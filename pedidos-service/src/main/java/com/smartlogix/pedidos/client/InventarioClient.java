package com.smartlogix.pedidos.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.*;
// IMPORTANTE: Asegurarnos de que importe desde dto y no desde model
import com.smartlogix.pedidos.dto.ProductoDTO;

@FeignClient(name = "inventario-service", url = "${inventario.service.url}")
public interface InventarioClient {

    @GetMapping("/api/productos/check-stock")
    Boolean checkStock(@RequestParam("codigo") String codigo, @RequestParam("cantidad") Integer cantidad);

    @PutMapping("/api/productos/reducir-stock")
    void reducirStock(@RequestParam("codigo") String codigo, @RequestParam("cantidad") Integer cantidad);

    @PutMapping("/api/productos/restaurar-stock")
    void restaurarStock(@RequestParam("codigo") String codigo, @RequestParam("cantidad") Integer cantidad);

    @GetMapping("/api/productos/{id}")
    ProductoDTO getProductoById(@PathVariable("id") Long id);
}