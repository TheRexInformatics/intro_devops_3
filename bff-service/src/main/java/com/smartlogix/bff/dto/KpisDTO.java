package com.smartlogix.bff.dto;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;

@Data
@Builder
public class KpisDTO {
    private long totalPedidos;
    private BigDecimal ingresos;
    private long entregados;
    private long pendientes;
}
