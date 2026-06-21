package com.smartlogix.pedidos.model;

import org.junit.jupiter.api.Test;
import java.math.BigDecimal;

import static org.junit.jupiter.api.Assertions.*;

class PedidoTest {

    @Test
    void testLombokData() {
        // 1. Instanciar y usar Setters
        Pedido pedido1 = new Pedido();
        pedido1.setId(1L);
        pedido1.setProductoId(100L);
        pedido1.setCodigoProducto("SKU-123");
        pedido1.setCantidad(5);
        pedido1.setTotal(new BigDecimal("250.00"));
        pedido1.setEstado("PROCESADO");

        // 2. Verificar Getters
        assertEquals(1L, pedido1.getId());
        assertEquals("SKU-123", pedido1.getCodigoProducto());
        assertEquals(5, pedido1.getCantidad());

        // 3. Probar equals() y hashCode() generados por @Data
        Pedido pedido2 = new Pedido();
        pedido2.setId(1L);
        pedido2.setProductoId(100L);
        pedido2.setCodigoProducto("SKU-123");
        pedido2.setCantidad(5);
        pedido2.setTotal(new BigDecimal("250.00"));
        pedido2.setEstado("PROCESADO");

        assertEquals(pedido1, pedido2);
        assertEquals(pedido1.hashCode(), pedido2.hashCode());

        // 4. Probar toString() generado por @Data
        assertNotNull(pedido1.toString());
        assertTrue(pedido1.toString().contains("SKU-123"));
    }
}