package com.smartlogix.bff.dto;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class PedidoDTO {
    private Long id;
    private Long productoId;
    private String codigoProducto;
    private Integer cantidad;
    private BigDecimal total;
    private String estado;
    private String sagaStatus;
    private String clienteId;
}
