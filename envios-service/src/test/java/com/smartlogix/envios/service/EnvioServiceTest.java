package com.smartlogix.envios.service;

import com.smartlogix.envios.model.Envio;
import com.smartlogix.envios.model.EstadoEnvio;
import com.smartlogix.envios.repository.EnvioRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class EnvioServiceTest {

    @Mock
    private EnvioRepository envioRepository;

    @InjectMocks
    private EnvioService envioService;

    private Envio envioMock;

    @BeforeEach
    void setUp() {
        envioMock = new Envio();
        envioMock.setId(1L);
        envioMock.setPedidoId(100L);
        envioMock.setDireccionDestino("Av. Siempre Viva 742");
        envioMock.setEstado(EstadoEnvio.PREPARACION);
    }

    @Test
    void crearEnvio_Exito_GeneraCodigoYGuarda() {
        // Hacemos que el mock devuelva el mismo objeto que se le pasa para guardar
        when(envioRepository.save(any(Envio.class))).thenAnswer(i -> i.getArguments()[0]);

        Envio resultado = envioService.crearEnvio(100L, "Av. Siempre Viva 742");

        assertNotNull(resultado);
        assertEquals(100L, resultado.getPedidoId());
        assertEquals("Av. Siempre Viva 742", resultado.getDireccionDestino());
        assertEquals(EstadoEnvio.PREPARACION, resultado.getEstado());

        // Verificamos la lógica del UUID
        assertNotNull(resultado.getCodigoSeguimiento());
        assertTrue(resultado.getCodigoSeguimiento().startsWith("SLX-"));

        verify(envioRepository, times(1)).save(any(Envio.class));
    }

    @Test
    void obtenerPorPedidoId_Exito_DevuelveEnvio() {
        when(envioRepository.findByPedidoId(100L)).thenReturn(Optional.of(envioMock));

        Envio resultado = envioService.obtenerPorPedidoId(100L);

        assertNotNull(resultado);
        assertEquals(100L, resultado.getPedidoId());
    }

    @Test
    void obtenerPorPedidoId_NoExiste_LanzaExcepcion() {
        when(envioRepository.findByPedidoId(999L)).thenReturn(Optional.empty());

        RuntimeException excepcion = assertThrows(RuntimeException.class, () -> {
            envioService.obtenerPorPedidoId(999L);
        });

        assertTrue(excepcion.getMessage().contains("Envío no encontrado para el pedido"));
    }

    @Test
    void actualizarEstado_ConTransportista_ActualizaAmbos() {
        when(envioRepository.findById(1L)).thenReturn(Optional.of(envioMock));
        when(envioRepository.save(any(Envio.class))).thenReturn(envioMock);

        Envio resultado = envioService.actualizarEstado(1L, EstadoEnvio.EN_TRANSITO, "BlueExpress");

        assertEquals(EstadoEnvio.EN_TRANSITO, resultado.getEstado());
        assertEquals("BlueExpress", resultado.getTransportista());
        verify(envioRepository, times(1)).save(envioMock);
    }

    @Test
    void actualizarEstado_SinTransportista_NoSobrescribeTransportista() {
        // Simulamos que ya tenía un transportista asignado previamente
        envioMock.setTransportista("FedEx");

        when(envioRepository.findById(1L)).thenReturn(Optional.of(envioMock));
        when(envioRepository.save(any(Envio.class))).thenReturn(envioMock);

        // Pasamos null como transportista
        Envio resultado = envioService.actualizarEstado(1L, EstadoEnvio.ENTREGADO, null);

        assertEquals(EstadoEnvio.ENTREGADO, resultado.getEstado());
        // El transportista debe mantenerse intacto, demostrando que pasó por el if (transportista != null)
        assertEquals("FedEx", resultado.getTransportista());
        verify(envioRepository, times(1)).save(envioMock);
    }

    @Test
    void actualizarEstado_NoExiste_LanzaExcepcion() {
        when(envioRepository.findById(999L)).thenReturn(Optional.empty());

        RuntimeException excepcion = assertThrows(RuntimeException.class, () -> {
            envioService.actualizarEstado(999L, EstadoEnvio.INCIDENCIA, "DHL");
        });

        assertEquals("Envío no encontrado", excepcion.getMessage());
    }
}