package com.smartlogix.inventario.service;

import com.smartlogix.inventario.model.Producto;
import java.util.List;
import java.util.Optional;

public interface ProductoService {
    List<Producto> findAll();

    Optional<Producto> findById(Long id);

    Optional<Producto> findBySku(String sku);

    Producto save(Producto producto);

    Producto update(Long id, Producto producto);

    void deleteById(Long id);

    // Integración con Pedidos
    Boolean verificarStockTotal(String sku, Integer cantidad);

    void reducirStockGlobal(String sku, Integer cantidad);

    void aumentarStockGlobal(String sku, Integer cantidad);
}