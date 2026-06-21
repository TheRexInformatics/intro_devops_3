package com.smartlogix.envios.controller;

import com.smartlogix.envios.model.Envio;
import com.smartlogix.envios.model.EstadoEnvio;
import com.smartlogix.envios.service.EnvioService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.jdbc.test.autoconfigure.AutoConfigureTestDatabase;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@AutoConfigureTestDatabase
class EnvioControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private EnvioService envioService;

    @Test
    void crearEnvio_OK() throws Exception {
        Envio envio = envio(1L, 1L, "Calle 123", "SLX-ABC", EstadoEnvio.PREPARACION);
        when(envioService.crearEnvio(1L, "Calle 123")).thenReturn(envio);

        mockMvc.perform(post("/api/envios/pedido/1")
                .param("direccion", "Calle 123"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.estado").value("PREPARACION"));
    }

    @Test
    void obtenerEnvio_OK() throws Exception {
        when(envioService.obtenerPorPedidoId(1L))
                .thenReturn(envio(1L, 1L, "Calle 123", "SLX-ABC", EstadoEnvio.PREPARACION));

        mockMvc.perform(get("/api/envios/pedido/1"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.codigoSeguimiento").value("SLX-ABC"));
    }

    @Test
    void obtenerEnvio_NoExiste() throws Exception {
        when(envioService.obtenerPorPedidoId(99L))
                .thenThrow(new RuntimeException("No encontrado"));

        mockMvc.perform(get("/api/envios/pedido/99"))
            .andExpect(status().is5xxServerError());
    }

    @Test
    void actualizarEstado_OK() throws Exception {
        when(envioService.actualizarEstado(1L, EstadoEnvio.EN_TRANSITO, "DHL"))
                .thenReturn(envio(1L, 1L, "Calle 123", "SLX-ABC", EstadoEnvio.EN_TRANSITO));

        mockMvc.perform(put("/api/envios/1/estado")
                .param("estado", "EN_TRANSITO")
                .param("transportista", "DHL"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.estado").value("EN_TRANSITO"));
    }

    @Test
    void actualizarEstado_NoExiste() throws Exception {
        when(envioService.actualizarEstado(99L, EstadoEnvio.ENTREGADO, null))
                .thenThrow(new RuntimeException("No encontrado"));

        mockMvc.perform(put("/api/envios/99/estado")
                .param("estado", "ENTREGADO"))
            .andExpect(status().is5xxServerError());
    }

    private Envio envio(Long id, Long pedidoId, String direccion, String tracking, EstadoEnvio estado) {
        Envio e = new Envio();
        e.setId(id);
        e.setPedidoId(pedidoId);
        e.setDireccionDestino(direccion);
        e.setCodigoSeguimiento(tracking);
        e.setEstado(estado);
        return e;
    }
}
