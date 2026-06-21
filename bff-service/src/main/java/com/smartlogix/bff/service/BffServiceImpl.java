package com.smartlogix.bff.service;

import com.smartlogix.bff.dto.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.math.BigDecimal;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class BffServiceImpl implements BffService {

    private final RestTemplate restTemplate = new RestTemplate();

    @Value("${services.pedidos.url:http://localhost:8082}")
    private String pedidosUrl;

    @Value("${services.inventario.url:http://localhost:8081}")
    private String inventarioUrl;

    @Value("${bff.stock-alert-threshold:10}")
    private int stockAlertThreshold;

    @Override
    public KpisDTO obtenerKpis() {
        List<PedidoDTO> pedidos = listarPedidos();
        return calcularKpis(pedidos);
    }

    @Override
    public DashboardDTO obtenerDashboard() {
        List<PedidoDTO> pedidos = listarPedidos();
        List<StockDTO> stocks = listarStocks();

        List<PedidoDTO> recientes = pedidos.stream()
                .sorted(Comparator.comparing(PedidoDTO::getId, Comparator.nullsLast(Comparator.reverseOrder())))
                .limit(5)
                .collect(Collectors.toList());

        return DashboardDTO.builder()
                .kpis(calcularKpis(pedidos))
                .recentOrders(recientes)
                .stockAlerts(construirAlertas(stocks))
                .activityFeed(construirActividad(pedidos))
                .build();
    }

    private List<PedidoDTO> listarPedidos() {
        try {
            PedidoDTO[] result = restTemplate.getForObject(pedidosUrl + "/api/pedidos", PedidoDTO[].class);
            return result != null ? Arrays.asList(result) : Collections.emptyList();
        } catch (Exception e) {
            System.err.println("Error fetching pedidos: " + e.getMessage());
            return Collections.emptyList();
        }
    }

    private List<StockDTO> listarStocks() {
        try {
            StockDTO[] result = restTemplate.getForObject(inventarioUrl + "/api/stocks", StockDTO[].class);
            return result != null ? Arrays.asList(result) : Collections.emptyList();
        } catch (Exception e) {
            System.err.println("Error fetching stocks: " + e.getMessage());
            return Collections.emptyList();
        }
    }

    private KpisDTO calcularKpis(List<PedidoDTO> pedidos) {
        BigDecimal ingresos = pedidos.stream()
                .map(PedidoDTO::getTotal)
                .filter(Objects::nonNull)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        long entregados = pedidos.stream()
                .filter(p -> "PROCESADO".equalsIgnoreCase(p.getEstado()))
                .count();

        long pendientes = pedidos.stream()
                .filter(p -> "PENDING".equalsIgnoreCase(p.getSagaStatus())
                        || "PENDIENTE".equalsIgnoreCase(p.getEstado()))
                .count();

        return KpisDTO.builder()
                .totalPedidos(pedidos.size())
                .ingresos(ingresos)
                .entregados(entregados)
                .pendientes(pendientes)
                .build();
    }

    private List<StockAlertDTO> construirAlertas(List<StockDTO> stocks) {
        Map<Long, Integer> stockPorProducto = new HashMap<>();
        Map<Long, String> nombrePorProducto = new HashMap<>();

        for (StockDTO stock : stocks) {
            if (stock.getProducto() == null || stock.getProducto().getId() == null) {
                continue;
            }
            Long productoId = stock.getProducto().getId();
            int cantidad = stock.getCantidad() != null ? stock.getCantidad() : 0;
            stockPorProducto.merge(productoId, cantidad, Integer::sum);
            nombrePorProducto.putIfAbsent(productoId, stock.getProducto().getNombre());
        }

        return stockPorProducto.entrySet().stream()
                .filter(entry -> entry.getValue() <= stockAlertThreshold)
                .map(entry -> StockAlertDTO.builder()
                        .id(entry.getKey())
                        .producto(nombrePorProducto.get(entry.getKey()))
                        .stockActual(entry.getValue())
                        .stockMinimo(stockAlertThreshold)
                        .build())
                .sorted(Comparator.comparing(StockAlertDTO::getStockActual))
                .limit(10)
                .collect(Collectors.toList());
    }

    private List<ActivityEventDTO> construirActividad(List<PedidoDTO> pedidos) {
        return pedidos.stream()
                .sorted(Comparator.comparing(PedidoDTO::getId, Comparator.nullsLast(Comparator.reverseOrder())))
                .limit(8)
                .map(p -> ActivityEventDTO.builder()
                        .id(p.getId())
                        .type("order")
                        .msg("Pedido #%d — %s ($%s)".formatted(
                                p.getId(),
                                p.getEstado() != null ? p.getEstado() : "sin estado",
                                p.getTotal() != null ? p.getTotal() : BigDecimal.ZERO))
                        .time("reciente")
                        .build())
                .collect(Collectors.toList());
    }
}
