package com.smartlogix.pedidos.model;

import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;

@Entity
@Data
@Table(name = "pedidos")
public class Pedido {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long productoId;
    private String codigoProducto;
    private Integer cantidad;
    private BigDecimal total;
    private String estado;

    private String clienteId;

    @Column(name = "saga_status")
    private String sagaStatus;
}