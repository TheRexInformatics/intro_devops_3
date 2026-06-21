package com.smartlogix.auth;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.test.web.reactive.server.WebTestClient;

import java.util.HashMap;
import java.util.Map;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
class AuthServiceApplicationTests {

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
    void testLoginSuccessfulAdmin() {
        Map<String, String> request = new HashMap<>();
        request.put("username", "diego");
        request.put("password", "admin123");

        webTestClient.post()
            .uri("/auth/login")
            .bodyValue(request)
            .exchange()
            .expectStatus().isOk()
            .expectBody()
            .jsonPath("$.token").exists();
    }

    @Test
    void testLoginSuccessfulCustomer() {
        Map<String, String> request = new HashMap<>();
        request.put("username", "cliente");
        request.put("password", "1234");

        webTestClient.post()
            .uri("/auth/login")
            .bodyValue(request)
            .exchange()
            .expectStatus().isOk()
            .expectBody()
            .jsonPath("$.token").exists();
    }

    @Test
    void testLoginFailed() {
        Map<String, String> request = new HashMap<>();
        request.put("username", "wronguser");
        request.put("password", "wrongpass");

        webTestClient.post()
            .uri("/auth/login")
            .bodyValue(request)
            .exchange()
            .expectStatus().isUnauthorized()
            .expectBody()
            .jsonPath("$.error").exists();
    }

}
