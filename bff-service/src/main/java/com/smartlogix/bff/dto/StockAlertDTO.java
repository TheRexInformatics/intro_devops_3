package com.smartlogix.bff.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class StockAlertDTO {
    private Long id;
    private String producto;
    private Integer stockActual;
    private Integer stockMinimo;
}
