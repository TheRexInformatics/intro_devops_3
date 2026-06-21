package com.smartlogix.inventario.service;

import com.smartlogix.inventario.model.Producto;
import com.smartlogix.inventario.model.Stock;
import com.smartlogix.inventario.repository.ProductoRepository;
import com.smartlogix.inventario.repository.StockRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ProductoServiceImpl implements ProductoService {

    private final ProductoRepository productoRepository;
    private final StockRepository stockRepository;

    @Override
    public List<Producto> findAll() {
        return productoRepository.findAll();
    }

    @Override
    public Optional<Producto> findById(Long id) {
        return productoRepository.findById(id);
    }

    @Override
    public Optional<Producto> findBySku(String sku) {
        return productoRepository.findBySku(sku);
    }

    @Override
    @Transactional
    public Producto save(Producto producto) {
        return productoRepository.save(producto);
    }

    @Override
    @Transactional
    public Producto update(Long id, Producto producto) {
        Producto existing = productoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Producto no encontrado con ID: " + id));

        existing.setSku(producto.getSku());
        existing.setNombre(producto.getNombre());
        existing.setDescripcion(producto.getDescripcion());
        existing.setPrecio(producto.getPrecio());

        return productoRepository.save(existing);
    }

    @Override
    @Transactional
    public void deleteById(Long id) {
        productoRepository.deleteById(id);
    }

    @Override
    public Boolean verificarStockTotal(String sku, Integer cantidad) {
        return productoRepository.findBySku(sku)
                .map(prod -> {
                    int totalDisponible = stockRepository.findAll().stream()
                            .filter(s -> s.getProducto().getId().equals(prod.getId()))
                            .mapToInt(Stock::getCantidad)
                            .sum();
                    return totalDisponible >= cantidad;
                }).orElse(false);
    }

    @Override
    @Transactional
    public void reducirStockGlobal(String sku, Integer cantidad) {
        Producto prod = productoRepository.findBySku(sku)
                .orElseThrow(() -> new RuntimeException("Producto no encontrado con SKU: " + sku));

        List<Stock> stocks = stockRepository.findAll().stream()
                .filter(s -> s.getProducto().getId().equals(prod.getId()) && s.getCantidad() > 0)
                .toList();

        int pendientePorReducir = cantidad;

        for (Stock stock : stocks) {
            if (pendientePorReducir <= 0)
                break;

            int cantidadEnBodega = stock.getCantidad();

            if (cantidadEnBodega >= pendientePorReducir) {
                stock.setCantidad(cantidadEnBodega - pendientePorReducir);
                pendientePorReducir = 0;
            } else {
                pendientePorReducir -= cantidadEnBodega;
                stock.setCantidad(0);
            }
            stockRepository.save(stock);
        }

        if (pendientePorReducir > 0) {
            throw new RuntimeException("Stock insuficiente para el SKU: " + sku +
                    ". Faltaron " + pendientePorReducir + " unidades por cubrir.");
        }
    }

    @Override
    @Transactional
    public void aumentarStockGlobal(String sku, Integer cantidad) {
        // 1. Buscamos que el producto exista
        Producto prod = productoRepository.findBySku(sku)
                .orElseThrow(() -> new RuntimeException("Producto no encontrado con SKU: " + sku));

        // 2. Buscamos dónde está guardado este producto (sus registros en bodegas)
        List<Stock> stocks = stockRepository.findAll().stream()
                .filter(s -> s.getProducto().getId().equals(prod.getId()))
                .toList();

        // 3. Validamos que tenga al menos un registro de bodega
        if (stocks.isEmpty()) {
            throw new RuntimeException("No existe registro de bodega para devolver el stock del SKU: " + sku);
        }

        // 4. Para la compensación, devolvemos todo el stock a la primera bodega
        // encontrada
        Stock stockPrincipal = stocks.get(0);
        stockPrincipal.setCantidad(stockPrincipal.getCantidad() + cantidad);

        // 5. Guardamos el cambio
        stockRepository.save(stockPrincipal);
    }
}