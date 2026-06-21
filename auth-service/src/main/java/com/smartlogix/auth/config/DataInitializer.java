package com.smartlogix.auth.config;

import com.smartlogix.auth.model.User;
import com.smartlogix.auth.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Override
    public void run(String... args) {
        if (userRepository.count() == 0) {
            User admin = new User();
            admin.setUsername("diego");
            admin.setPassword("admin123");
            admin.setRole("ROLE_ADMIN");
            userRepository.save(admin);

            User cliente = new User();
            cliente.setUsername("cliente");
            cliente.setPassword("1234");
            cliente.setRole("ROLE_CLIENTE");
            userRepository.save(cliente);

            System.out.println("Usuarios iniciales creados: diego (ADMIN), cliente (CLIENTE)");
        }
    }
}
