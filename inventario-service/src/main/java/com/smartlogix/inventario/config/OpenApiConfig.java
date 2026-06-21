package com.smartlogix.inventario.config;

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
                        .title("Inventario Service API")
                        .version("1.0.0")
                        .description("Microservicio para la gestión y control de inventario - SmartLogix")
                        .contact(new Contact()
                                .name("Soporte DV")
                                .email("soporte@smartlogix.com")))
                .servers(List.of(
                        // URL directa del microservicio local
                        new Server().url("http://localhost:8082").description("Servidor Local (Directo)"),
                        // URL a través del API Gateway para cuando levantes todo el ecosistema
                        new Server().url("http://localhost:8080/inventario").description("API Gateway")
                ));
    }
}