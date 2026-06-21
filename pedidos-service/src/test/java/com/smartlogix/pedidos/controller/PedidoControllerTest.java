package com.smartlogix.pedidos.controller;

import com.smartlogix.pedidos.dto.PedidoDTO;
import com.smartlogix.pedidos.service.PedidoService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.boot.jdbc.test.autoconfigure.AutoConfigureTestDatabase;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.reactive.server.WebTestClient;

import java.math.BigDecimal;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@AutoConfigureTestDatabase
class PedidoControllerTest {

    @LocalServerPort
    private int port;

    @MockitoBean
    private PedidoService pedidoService;

    private WebTestClient client;

    @BeforeEach
    void setUp() {
        client = WebTestClient.bindToServer().baseUrl("http://localhost:" + port).build();
    }

    @Test
    void listarPedidos_OK() {
        PedidoDTO p = dto(1L, "LAP-001", "PROCESADO", "PENDING");
        when(pedidoService.findAll()).thenReturn(List.of(p));

        client.get().uri("/api/pedidos").exchange().expectStatus().isOk().expectBody()
            .jsonPath("$[0].id").isEqualTo(1).jsonPath("$[0].codigoProducto").isEqualTo("LAP-001");
    }

    @Test
    void crearPedido_OK() {
        PedidoDTO p = dto(1L, "LAP-001", "PROCESADO", "PENDING");
        when(pedidoService.crearPedido(any())).thenReturn(p);

        client.post().uri("/api/pedidos").bodyValue("{\"productoId\":1,\"codigoProducto\":\"LAP-001\",\"cantidad\":3}")
            .header("Content-Type", "application/json").exchange().expectStatus().isCreated()
            .expectBody().jsonPath("$.estado").isEqualTo("PROCESADO");
    }

    @Test
    void crearPedido_Error() {
        when(pedidoService.crearPedido(any())).thenThrow(new RuntimeException("Sin stock"));

        client.post().uri("/api/pedidos").bodyValue("{\"productoId\":1,\"codigoProducto\":\"LAP-001\",\"cantidad\":999}")
            .header("Content-Type", "application/json").exchange().expectStatus().isBadRequest();
    }

    @Test
    void obtenerPedido_OK() {
        when(pedidoService.findById(1L)).thenReturn(dto(1L, "LAP-001", "PROCESADO", "PENDING"));
        client.get().uri("/api/pedidos/1").exchange().expectStatus().isOk().expectBody().jsonPath("$.id").isEqualTo(1);
    }

    @Test
    void obtenerPedido_NoEncontrado() {
        when(pedidoService.findById(99L)).thenThrow(new RuntimeException("No encontrado"));
        client.get().uri("/api/pedidos/99").exchange().expectStatus().isNotFound();
    }

    @Test
    void compensarPedido_OK() {
        when(pedidoService.compensarPedido(1L)).thenReturn(dto(1L, "LAP-001", "CANCELADO", "CANCELLED"));
        client.put().uri("/api/pedidos/1/compensar").exchange().expectStatus().isOk()
            .expectBody().jsonPath("$.estado").isEqualTo("CANCELADO");
    }

    @Test
    void completarPedido_OK() {
        when(pedidoService.completarPedido(1L)).thenReturn(dto(1L, "LAP-001", "COMPLETADO", "COMPLETED"));
        client.put().uri("/api/pedidos/1/completar").exchange().expectStatus().isOk()
            .expectBody().jsonPath("$.estado").isEqualTo("COMPLETADO");
    }

    private PedidoDTO dto(Long id, String codigo, String estado, String saga) {
        PedidoDTO d = new PedidoDTO();
        d.setId(id); d.setProductoId(1L); d.setCodigoProducto(codigo);
        d.setCantidad(3); d.setTotal(BigDecimal.valueOf(100));
        d.setEstado(estado); d.setSagaStatus(saga); d.setClienteId("cliente");
        return d;
    }
}
