package com.smartlogix.pedidos;

import com.smartlogix.pedidos.client.InventarioClient;
import com.smartlogix.pedidos.dto.PedidoDTO;
import com.smartlogix.pedidos.dto.ProductoDTO;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.boot.jdbc.test.autoconfigure.AutoConfigureTestDatabase;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.reactive.server.WebTestClient;

import java.math.BigDecimal;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@AutoConfigureTestDatabase
class PedidosServiceApplicationTests {

    @LocalServerPort
    private int port;

    private WebTestClient webTestClient;

    @MockitoBean
    private InventarioClient inventarioClient;

    @BeforeEach
    void setUp() {
        webTestClient = WebTestClient.bindToServer()
            .baseUrl("http://localhost:" + port)
            .build();
    }

    @Test
    void testListarPedidos() {
        webTestClient.get()
            .uri("/api/pedidos")
            .exchange()
            .expectStatus().isOk()
            .expectBodyList(PedidoDTO.class);
    }

    @Test
    void testObtenerPedidoPorIdNonExistent() {
        webTestClient.get()
            .uri("/api/pedidos/999999")
            .exchange()
            .expectStatus().isNotFound();
    }

    @Test
    void testCrearPedido() {
        Mockito.when(inventarioClient.checkStock("PROD001", 2)).thenReturn(true);

        ProductoDTO productoDTO = new ProductoDTO();
        productoDTO.setId(1L);
        productoDTO.setSku("PROD001");
        productoDTO.setNombre("Producto de prueba");
        productoDTO.setPrecio(new BigDecimal("10.00"));
        Mockito.when(inventarioClient.getProductoById(1L)).thenReturn(productoDTO);

        PedidoDTO nuevo = new PedidoDTO();
        nuevo.setProductoId(1L);
        nuevo.setCodigoProducto("PROD001");
        nuevo.setCantidad(2);

        webTestClient.post()
            .uri("/api/pedidos")
            .bodyValue(nuevo)
            .exchange()
            .expectStatus().isCreated()
            .expectBody(PedidoDTO.class)
            .value(pedido -> {
                assertNotNull(pedido.getId());
                assertEquals("PROD001", pedido.getCodigoProducto());
                assertEquals(2, pedido.getCantidad());
                assertEquals(new BigDecimal("20.00"), pedido.getTotal());
                assertEquals("PROCESADO", pedido.getEstado());
                assertEquals("PENDING", pedido.getSagaStatus());
            });
    }

}
