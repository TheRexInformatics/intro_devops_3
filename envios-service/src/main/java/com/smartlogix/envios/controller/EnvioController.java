package com.smartlogix.envios.controller;

import com.smartlogix.envios.model.Envio;
import com.smartlogix.envios.model.EstadoEnvio;
import com.smartlogix.envios.service.EnvioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/envios")
public class EnvioController {

    @Autowired
    private EnvioService envioService;

    // Crear un envío
    @PostMapping("/pedido/{pedidoId}")
    public ResponseEntity<Envio> crearEnvio(@PathVariable Long pedidoId, @RequestParam String direccion) {
        return ResponseEntity.ok(envioService.crearEnvio(pedidoId, direccion));
    }

    // Consultar el estado de un envío por ID de pedido
    @GetMapping("/pedido/{pedidoId}")
    public ResponseEntity<Envio> obtenerEnvioPorPedido(@PathVariable Long pedidoId) {
        return ResponseEntity.ok(envioService.obtenerPorPedidoId(pedidoId));
    }

    // Actualizar el estado del envío
    @PutMapping("/{id}/estado")
    public ResponseEntity<Envio> actualizarEstado(
            @PathVariable Long id,
            @RequestParam EstadoEnvio estado,
            @RequestParam(required = false) String transportista) {
        return ResponseEntity.ok(envioService.actualizarEstado(id, estado, transportista));
    }
}