package com.smartlogix.inventario.controller;

import com.smartlogix.inventario.model.Producto;
import com.smartlogix.inventario.service.ProductoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/productos")
@RequiredArgsConstructor
public class ProductoController {

    private final ProductoService productoService;

    @GetMapping("/check-stock")
    public ResponseEntity<Boolean> checkStock(
            @RequestParam("codigo") String codigo,
            @RequestParam("cantidad") Integer cantidad) {
        return ResponseEntity.ok(productoService.verificarStockTotal(codigo, cantidad));
    }

    @PutMapping("/reducir-stock")
    public ResponseEntity<Void> reducirStock(
            @RequestParam("codigo") String codigo,
            @RequestParam("cantidad") Integer cantidad) {
        try {
            productoService.reducirStockGlobal(codigo, cantidad);
            return ResponseEntity.ok().build();
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/restaurar-stock")
    public ResponseEntity<Void> restaurarStock(
            @RequestParam("codigo") String codigo,
            @RequestParam("cantidad") Integer cantidad) {
        try {
            // Llamamos al servicio para que sume el stock de vuelta
            // OJO: Debes asegurarte de que tu ProductoService tenga este método creado
            productoService.aumentarStockGlobal(codigo, cantidad);
            return ResponseEntity.ok().build();
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping
    public List<Producto> findAll() {
        return productoService.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Producto> findById(@PathVariable Long id) {
        return productoService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/sku/{sku}")
    public ResponseEntity<Producto> findBySku(@PathVariable String sku) {
        return productoService.findBySku(sku)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Producto> create(@RequestBody Producto producto) {
        Producto saved = productoService.save(producto);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Producto> update(@PathVariable Long id, @RequestBody Producto producto) {
        try {
            Producto updated = productoService.update(id, producto);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        productoService.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}