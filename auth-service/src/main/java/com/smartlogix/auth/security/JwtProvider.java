package com.smartlogix.auth.security;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;

@Component
public class JwtProvider {

    // Traemos los valores desde application.yml
    @Value("${jwt.secret}")
    private String secret;

    @Value("${jwt.expiration}")
    private int expiration;

    // Transforma nuestro string secreto en una llave criptográfica
    private Key getSigningKey() {
        return Keys.hmacShaKeyFor(secret.getBytes());
    }

    // La fábrica de tokens!
    public String generateToken(String username, String role) {
        return Jwts.builder()
                .setSubject(username) // A quién pertenece (ej: "diego.admin")
                .claim("role", role) // Su poder en el sistema (ej: "ROLE_ADMIN")
                .setIssuedAt(new Date()) // Fecha de creación
                .setExpiration(new Date(System.currentTimeMillis() + expiration)) // Fecha de muerte
                .signWith(getSigningKey(), SignatureAlgorithm.HS256) // Firma digital inquebrantable
                .compact();
    }

    // Método útil por si el propio auth-service necesita validar un token
    public boolean validateToken(String token) {
        try {
            Jwts.parserBuilder()
                    .setSigningKey(getSigningKey())
                    .build()
                    .parseClaimsJws(token);
            return true;
        } catch (Exception e) {
            System.out.println("Token inválido o expirado: " + e.getMessage());
            return false;
        }
    }
}