package com.smartlogix.inventario.controller;

import com.smartlogix.inventario.model.Stock;
import com.smartlogix.inventario.service.StockService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/stocks")
@RequiredArgsConstructor
public class StockController {

    private final StockService stockService;

    @GetMapping
    public List<Stock> findAll() {
        return stockService.findAll();
    }

    @GetMapping("/bodega/{bodegaId}")
    public List<Stock> findByBodega(@PathVariable Long bodegaId) {
        return stockService.findByBodega(bodegaId);
    }

    @GetMapping("/producto/{productoId}/bodega/{bodegaId}")
    public ResponseEntity<Stock> findByProductoAndBodega(@PathVariable Long productoId,
                                                         @PathVariable Long bodegaId) {
        return stockService.findByProductoAndBodega(productoId, bodegaId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/entrada")
    public ResponseEntity<Stock> registrarEntrada(@RequestParam Long productoId,
                                                  @RequestParam Long bodegaId,
                                                  @RequestParam Integer cantidad) {
        Stock stock = stockService.registrarEntrada(productoId, bodegaId, cantidad);
        return ResponseEntity.ok(stock);
    }

    @PostMapping("/salida")
    public ResponseEntity<Stock> registrarSalida(@RequestParam Long productoId,
                                                 @RequestParam Long bodegaId,
                                                 @RequestParam Integer cantidad) {
        try {
            Stock stock = stockService.registrarSalida(productoId, bodegaId, cantidad);
            return ResponseEntity.ok(stock);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/actualizar")
    public ResponseEntity<Stock> actualizarStock(@RequestParam Long productoId,
                                                 @RequestParam Long bodegaId,
                                                 @RequestParam Integer nuevaCantidad) {
        Stock stock = stockService.actualizarStock(productoId, bodegaId, nuevaCantidad);
        return ResponseEntity.ok(stock);
    }
}