package com.smartlogix.envios;

import com.smartlogix.envios.model.Envio;
import com.smartlogix.envios.model.EstadoEnvio;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.boot.jdbc.test.autoconfigure.AutoConfigureTestDatabase;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.web.reactive.server.WebTestClient;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@AutoConfigureTestDatabase
@TestPropertySource(properties = "spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.H2Dialect")
class EnviosServiceApplicationTests {

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
    void testCrearEnvio() {
        long randomPedidoId = (long) (Math.random() * 10000000) + 1;
        String direccion = "Calle de Prueba 123, Santiago";

        webTestClient.post()
            .uri(uriBuilder -> uriBuilder
                .path("/api/envios/pedido/" + randomPedidoId)
                .queryParam("direccion", direccion)
                .build())
            .exchange()
            .expectStatus().isOk()
            .expectBody(Envio.class)
            .value(envio -> {
                assertNotNull(envio.getId());
                assertEquals(randomPedidoId, envio.getPedidoId());
                assertEquals(direccion, envio.getDireccionDestino());
                assertEquals(EstadoEnvio.PREPARACION, envio.getEstado());
                assertNotNull(envio.getCodigoSeguimiento());
            });
    }

    @Test
    void testObtenerEnvioPorPedidoIdNonExistent() {
        webTestClient.get()
            .uri("/api/envios/pedido/9999999")
            .exchange()
            .expectStatus().is5xxServerError();
    }

}
