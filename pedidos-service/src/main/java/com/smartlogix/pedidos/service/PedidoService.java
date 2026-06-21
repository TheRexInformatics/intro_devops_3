package com.smartlogix.pedidos.service;

import com.smartlogix.pedidos.dto.PedidoDTO;
import java.util.List;

public interface PedidoService {
    // Recibe DTO y devuelve DTO
    PedidoDTO crearPedido(PedidoDTO pedidoDTO);

    // Devuelve lista de DTOs
    List<PedidoDTO> findAll();

    PedidoDTO findById(Long id);

    PedidoDTO compensarPedido(Long id);

    PedidoDTO completarPedido(Long id);
}