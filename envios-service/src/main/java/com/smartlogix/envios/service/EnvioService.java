package com.smartlogix.envios.service;

import com.smartlogix.envios.model.Envio;
import com.smartlogix.envios.model.EstadoEnvio;
import com.smartlogix.envios.repository.EnvioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.UUID;

@Service
public class EnvioService {

    @Autowired
    private EnvioRepository envioRepository;

    public Envio crearEnvio(Long pedidoId, String direccionDestino) {
        Envio envio = new Envio();
        envio.setPedidoId(pedidoId);
        envio.setDireccionDestino(direccionDestino);
        envio.setEstado(EstadoEnvio.PREPARACION);
        // Generar un código de seguimiento simulado
        envio.setCodigoSeguimiento("SLX-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
        return envioRepository.save(envio);
    }

    public Envio obtenerPorPedidoId(Long pedidoId) {
        return envioRepository.findByPedidoId(pedidoId)
                .orElseThrow(() -> new RuntimeException("Envío no encontrado para el pedido: " + pedidoId));
    }

    public Envio actualizarEstado(Long id, EstadoEnvio nuevoEstado, String transportista) {
        Envio envio = envioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Envío no encontrado"));
        envio.setEstado(nuevoEstado);
        if (transportista != null) {
            envio.setTransportista(transportista);
        }
        return envioRepository.save(envio);
    }
}