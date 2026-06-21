package com.smartlogix.gateway.controller;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.net.URI;
import java.util.Enumeration;

@RestController
public class GatewayProxyController {

    private final RestTemplate restTemplate = new RestTemplate();

    @Value("${INVENTARIO_SERVICE_URL:http://localhost:8081}")
    private String inventarioUrl;

    @Value("${PEDIDOS_SERVICE_URL:http://localhost:8082}")
    private String pedidosUrl;

    @Value("${ENVIOS_SERVICE_URL:http://localhost:8083}")
    private String enviosUrl;

    @Value("${BFF_SERVICE_URL:http://localhost:8084}")
    private String bffUrl;

    @Value("${AUTH_SERVICE_URL:http://localhost:8085}")
    private String authUrl;

    @RequestMapping("/api/productos/**")
    public ResponseEntity<?> proxyInventarioProductos(HttpServletRequest request, @RequestBody(required = false) String body) {
        return proxy(request, inventarioUrl, body);
    }

    @RequestMapping("/api/stocks/**")
    public ResponseEntity<?> proxyInventarioStocks(HttpServletRequest request, @RequestBody(required = false) String body) {
        return proxy(request, inventarioUrl, body);
    }

    @RequestMapping("/api/pedidos/**")
    public ResponseEntity<?> proxyPedidos(HttpServletRequest request, @RequestBody(required = false) String body) {
        return proxy(request, pedidosUrl, body);
    }

    @RequestMapping("/api/envios/**")
    public ResponseEntity<?> proxyEnvios(HttpServletRequest request, @RequestBody(required = false) String body) {
        return proxy(request, enviosUrl, body);
    }

    @RequestMapping("/api/bff/**")
    public ResponseEntity<?> proxyBff(HttpServletRequest request, @RequestBody(required = false) String body) {
        return proxy(request, bffUrl, body);
    }

    @RequestMapping("/auth/**")
    public ResponseEntity<?> proxyAuth(HttpServletRequest request, @RequestBody(required = false) String body) {
        return proxy(request, authUrl, body);
    }

    private ResponseEntity<?> proxy(HttpServletRequest request, String targetUrl, String body) {
        try {
            String path = request.getRequestURI();
            String query = request.getQueryString();
            String url = targetUrl + path + (query != null ? "?" + query : "");

            HttpHeaders headers = new HttpHeaders();
            Enumeration<String> headerNames = request.getHeaderNames();
            while (headerNames.hasMoreElements()) {
                String headerName = headerNames.nextElement();
                if (!headerName.equalsIgnoreCase("host")) {
                    headers.add(headerName, request.getHeader(headerName));
                }
            }

            HttpEntity<String> entity = new HttpEntity<>(body, headers);
            ResponseEntity<String> response = restTemplate.exchange(
                    URI.create(url),
                    HttpMethod.valueOf(request.getMethod()),
                    entity,
                    String.class
            );

            return ResponseEntity.status(response.getStatusCode())
                    .headers(response.getHeaders())
                    .body(response.getBody());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_GATEWAY)
                    .body("Error conectando al servicio: " + e.getMessage());
        }
    }
}
