package com.smartlogix.pedidos.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;

@Data
@AllArgsConstructor
@NoArgsConstructor
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