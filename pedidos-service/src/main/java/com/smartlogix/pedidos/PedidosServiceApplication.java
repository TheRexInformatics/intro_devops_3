package com.smartlogix.pedidos;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.openfeign.EnableFeignClients;

@SpringBootApplication
@EnableFeignClients
public class PedidosServiceApplication {
	public static void main(String[] args) {
		SpringApplication.run(PedidosServiceApplication.class, args);
	}
}