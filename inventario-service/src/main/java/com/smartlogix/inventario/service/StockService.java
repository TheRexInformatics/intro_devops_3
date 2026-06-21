package com.smartlogix.inventario.service;

import com.smartlogix.inventario.model.Stock;
import java.util.List;
import java.util.Optional;

public interface StockService {
    List<Stock> findAll();
    Optional<Stock> findByProductoAndBodega(Long productoId, Long bodegaId);
    List<Stock> findByBodega(Long bodegaId);
    Stock registrarEntrada(Long productoId, Long bodegaId, Integer cantidad);
    Stock registrarSalida(Long productoId, Long bodegaId, Integer cantidad);
    Stock actualizarStock(Long productoId, Long bodegaId, Integer nuevaCantidad);
}