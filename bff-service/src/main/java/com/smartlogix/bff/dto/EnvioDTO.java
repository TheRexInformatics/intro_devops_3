package com.smartlogix.bff.dto;

import lombok.Data;

@Data
public class EnvioDTO {
    private String direccionDestino;
    private String transportista;
    private String codigoSeguimiento;
    private String estado;
}