package com.smartlogix.bff.dto;

import lombok.Data;

@Data
public class StockDTO {
    private Long id;
    private ProductoDTO producto;
    private Long bodegaId;
    private Integer cantidad;
}
