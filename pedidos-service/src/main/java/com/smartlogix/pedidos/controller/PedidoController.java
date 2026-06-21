package com.smartlogix.pedidos.controller;

import com.smartlogix.pedidos.dto.PedidoDTO;
import com.smartlogix.pedidos.service.PedidoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/pedidos")
@RequiredArgsConstructor
public class PedidoController {

    private final PedidoService pedidoService;

    @PostMapping
    // CAMBIO AQUÍ: Recibimos PedidoDTO en lugar de Pedido
    public ResponseEntity<?> crearPedido(@RequestBody PedidoDTO pedidoDTO) {
        try {
            return ResponseEntity.status(HttpStatus.CREATED).body(pedidoService.crearPedido(pedidoDTO));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping
    // CAMBIO AQUÍ: Retornamos List<PedidoDTO> en lugar de List<Pedido>
    public ResponseEntity<List<PedidoDTO>> listarPedidos() {
        return ResponseEntity.ok(pedidoService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<PedidoDTO> obtenerPedido(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(pedidoService.findById(id));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/{id}/compensar")
    public ResponseEntity<PedidoDTO> compensarPedido(@PathVariable Long id) {
        // Servicio para cancelar el pedido
        PedidoDTO pedidoCompensado = pedidoService.compensarPedido(id);
        return ResponseEntity.ok(pedidoCompensado);
    }

    @PutMapping("/{id}/completar")
    public ResponseEntity<PedidoDTO> completarPedido(@PathVariable Long id) {
        PedidoDTO pedido = pedidoService.completarPedido(id);
        return ResponseEntity.ok(pedido);
    }
}