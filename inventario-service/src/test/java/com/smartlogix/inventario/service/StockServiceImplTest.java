package com.smartlogix.inventario.service;

import com.smartlogix.inventario.model.Producto;
import com.smartlogix.inventario.model.Stock;
import com.smartlogix.inventario.repository.ProductoRepository;
import com.smartlogix.inventario.repository.StockRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class StockServiceImplTest {

    @Mock
    private StockRepository stockRepository;

    @Mock
    private ProductoRepository productoRepository;

    @InjectMocks
    private StockServiceImpl stockService;

    private Producto productoMock;
    private Stock stockMock;

    @BeforeEach
    void setUp() {
        productoMock = new Producto();
        productoMock.setId(1L);
        productoMock.setSku("PROD-TEST");

        stockMock = new Stock();
        stockMock.setId(10L);
        stockMock.setProducto(productoMock);
        stockMock.setCantidad(50);
        stockMock.setBodegaId(1L);
    }

    @Test
    void findAll_DebeRetornarLista() {
        when(stockRepository.findAll()).thenReturn(Arrays.asList(stockMock));
        List<Stock> resultado = stockService.findAll();
        assertEquals(1, resultado.size());
    }

    @Test
    void findByProductoAndBodega_DebeRetornarOptional() {
        when(stockRepository.findByProductoIdAndBodegaId(1L, 1L)).thenReturn(Optional.of(stockMock));
        Optional<Stock> resultado = stockService.findByProductoAndBodega(1L, 1L);
        assertTrue(resultado.isPresent());
    }

    @Test
    void findByBodega_DebeRetornarLista() {
        when(stockRepository.findByBodegaId(1L)).thenReturn(Arrays.asList(stockMock));
        List<Stock> resultado = stockService.findByBodega(1L);
        assertEquals(1, resultado.size());
    }

    @Test
    void registrarEntrada_StockExistente_IncrementaCantidad() {
        when(stockRepository.findByProductoIdAndBodegaId(1L, 1L)).thenReturn(Optional.of(stockMock));
        when(stockRepository.save(any(Stock.class))).thenReturn(stockMock);

        Stock resultado = stockService.registrarEntrada(1L, 1L, 20);

        assertEquals(70, resultado.getCantidad()); // 50 iniciales + 20 entrada
        verify(stockRepository, times(1)).save(stockMock);
    }

    @Test
    void registrarEntrada_StockNuevo_CreaStockInicial() {
        when(stockRepository.findByProductoIdAndBodegaId(1L, 1L)).thenReturn(Optional.empty());
        when(productoRepository.findById(1L)).thenReturn(Optional.of(productoMock));
        when(stockRepository.save(any(Stock.class))).thenAnswer(invocation -> invocation.getArgument(0));

        Stock resultado = stockService.registrarEntrada(1L, 1L, 30);

        assertNotNull(resultado);
        assertEquals(30, resultado.getCantidad());
        verify(productoRepository, times(1)).findById(1L);
    }

    @Test
    void registrarEntrada_StockNuevoProductoNoExiste_LanzaException() {
        when(stockRepository.findByProductoIdAndBodegaId(1L, 1L)).thenReturn(Optional.empty());
        when(productoRepository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(RuntimeException.class, () -> stockService.registrarEntrada(1L, 1L, 10));
    }

    @Test
    void registrarSalida_Exito_ReduceCantidad() {
        when(stockRepository.findByProductoIdAndBodegaId(1L, 1L)).thenReturn(Optional.of(stockMock));
        when(stockRepository.save(any(Stock.class))).thenReturn(stockMock);

        Stock resultado = stockService.registrarSalida(1L, 1L, 20);

        assertEquals(30, resultado.getCantidad()); // 50 iniciales - 20 salida
        verify(stockRepository, times(1)).save(stockMock);
    }

    // 🎯 EL TEST SALVADOR 1: Fuerza a entrar en el .orElseThrow() amarillo
    @Test
    void registrarSalida_StockNoEncontrado_LanzaRuntimeException() {
        when(stockRepository.findByProductoIdAndBodegaId(999L, 1L)).thenReturn(Optional.empty());

        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            stockService.registrarSalida(999L, 1L, 10);
        });

        assertEquals("Stock no encontrado", exception.getMessage());
    }

    // 🎯 EL TEST SALVADOR 2: Asegura que cubrimos la validación de stock insuficiente
    @Test
    void registrarSalida_StockInsuficiente_LanzaRuntimeException() {
        when(stockRepository.findByProductoIdAndBodegaId(1L, 1L)).thenReturn(Optional.of(stockMock)); // Tiene 50

        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            stockService.registrarSalida(1L, 1L, 100); // Pedimos 100
        });

        assertTrue(exception.getMessage().contains("Stock insuficiente"));
    }

    @Test
    void actualizarStock_ModificaCantidad() {
        when(stockRepository.findByProductoIdAndBodegaId(1L, 1L)).thenReturn(Optional.of(stockMock));
        when(stockRepository.save(any(Stock.class))).thenReturn(stockMock);

        Stock resultado = stockService.actualizarStock(1L, 1L, 200);

        assertEquals(200, resultado.getCantidad());
        verify(stockRepository, times(1)).save(stockMock);
    }
}