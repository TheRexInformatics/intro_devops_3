package com.smartlogix.inventario.repository;

import com.smartlogix.inventario.model.Stock;
import com.smartlogix.inventario.model.Producto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface StockRepository extends JpaRepository<Stock, Long> {
    Optional<Stock> findByProductoIdAndBodegaId(Long productoId, Long bodegaId);
    List<Stock> findByBodegaId(Long bodegaId);
}