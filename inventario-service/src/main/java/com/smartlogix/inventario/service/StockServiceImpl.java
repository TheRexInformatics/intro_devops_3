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
public class StockServiceImpl implements StockService {

    private final StockRepository stockRepository;
    private final ProductoRepository productoRepository;

    @Override
    public List<Stock> findAll() {
        return stockRepository.findAll();
    }

    @Override
    public Optional<Stock> findByProductoAndBodega(Long productoId, Long bodegaId) {
        return stockRepository.findByProductoIdAndBodegaId(productoId, bodegaId);
    }

    @Override
    public List<Stock> findByBodega(Long bodegaId) {
        return stockRepository.findByBodegaId(bodegaId);
    }

    @Override
    @Transactional
    public Stock registrarEntrada(Long productoId, Long bodegaId, Integer cantidad) {
        Stock stock = obtenerOCrearStock(productoId, bodegaId);
        stock.setCantidad(stock.getCantidad() + cantidad);
        return stockRepository.save(stock);
    }

    @Override
    @Transactional
    public Stock registrarSalida(Long productoId, Long bodegaId, Integer cantidad) {
        Stock stock = stockRepository.findByProductoIdAndBodegaId(productoId, bodegaId)
                .orElseThrow(() -> new RuntimeException("Stock no encontrado"));

        if (stock.getCantidad() < cantidad) {
            throw new RuntimeException("Stock insuficiente. Disponible: " + stock.getCantidad());
        }

        stock.setCantidad(stock.getCantidad() - cantidad);
        return stockRepository.save(stock);
    }

    @Override
    @Transactional
    public Stock actualizarStock(Long productoId, Long bodegaId, Integer nuevaCantidad) {
        Stock stock = obtenerOCrearStock(productoId, bodegaId);
        stock.setCantidad(nuevaCantidad);
        return stockRepository.save(stock);
    }

    private Stock obtenerOCrearStock(Long productoId, Long bodegaId) {
        Optional<Stock> stockOpt = stockRepository.findByProductoIdAndBodegaId(productoId, bodegaId);

        if (stockOpt.isPresent()) {
            return stockOpt.get();
        }

        Producto producto = productoRepository.findById(productoId)
                .orElseThrow(() -> new RuntimeException("Producto no encontrado"));

        Stock nuevoStock = new Stock();
        nuevoStock.setProducto(producto);
        nuevoStock.setBodegaId(bodegaId);
        nuevoStock.setCantidad(0);

        return nuevoStock;
    }
}