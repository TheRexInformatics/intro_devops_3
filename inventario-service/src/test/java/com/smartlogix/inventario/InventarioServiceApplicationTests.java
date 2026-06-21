package com.smartlogix.inventario;

import com.smartlogix.inventario.model.Producto;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.boot.jdbc.test.autoconfigure.AutoConfigureTestDatabase;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.test.web.reactive.server.WebTestClient;

import java.math.BigDecimal;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@AutoConfigureTestDatabase
class InventarioServiceApplicationTests {

    @LocalServerPort
    private int port;

    private WebTestClient webTestClient;

    @BeforeEach
    void setUp() {
        webTestClient = WebTestClient.bindToServer()
            .baseUrl("http://localhost:" + port)
            .build();
    }

    @Test
    void testListarProductos() {
        webTestClient.get()
            .uri("/api/productos")
            .exchange()
            .expectStatus().isOk()
            .expectBodyList(Producto.class);
    }

    @Test
    void testObtenerProductoPorIdNonExistent() {
        webTestClient.get()
            .uri("/api/productos/999999")
            .exchange()
            .expectStatus().isNotFound();
    }

    @Test
    void testCrearProducto() {
        Producto nuevo = new Producto();
        nuevo.setSku("SKU-" + UUID.randomUUID().toString().substring(0, 8));
        nuevo.setNombre("Producto de Prueba Test");
        nuevo.setDescripcion("Descripcion de prueba");
        nuevo.setPrecio(new BigDecimal("150.00"));

        webTestClient.post()
            .uri("/api/productos")
            .bodyValue(nuevo)
            .exchange()
            .expectStatus().isCreated()
            .expectBody(Producto.class)
            .value(producto -> {
                assertNotNull(producto.getId());
                assertEquals(nuevo.getNombre(), producto.getNombre());
                assertEquals(nuevo.getSku(), producto.getSku());
            });
    }

}
