package com.smartlogix.bff.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ResumenCompraDTO {
    private Long idPedido;
    private String estadoPedido;
    private String direccionEntrega;
    private String estadoLogistico;
    private String trackingCode;
}