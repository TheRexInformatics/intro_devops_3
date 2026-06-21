package com.smartlogix.pedidos.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.servers.Server;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("Pedidos Service API")
                        .version("1.0.0")
                        .description("Microservicio para la gestión de pedidos y órdenes - SmartLogix")
                        .contact(new Contact()
                                .name("Soporte DV")
                                .email("soporte@smartlogix.com")))
                .servers(List.of(
                        new Server().url("http://localhost:8082").description("Servidor Local (Directo)"),
                        new Server().url("http://localhost:8080/pedidos").description("API Gateway")
                ));
    }
}