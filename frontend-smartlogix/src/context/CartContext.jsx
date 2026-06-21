import { createContext, useContext, useState, useCallback } from 'react';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [carrito, setCarrito] = useState([]);

  const addToCart = useCallback((producto) => {
    setCarrito(prev => {
      const existing = prev.find(c => c.productoId === producto.id);
      if (existing) {
        return prev.map(c => c.productoId === producto.id ? { ...c, cantidad: c.cantidad + 1 } : c);
      }
      return [...prev, {
        productoId: producto.id,
        codigoProducto: producto.sku,
        nombre: producto.nombre,
        precio: producto.precio,
        cantidad: 1,
      }];
    });
  }, []);

  const updateCantidad = useCallback((productoId, delta) => {
    setCarrito(prev => prev.map(c => {
      if (c.productoId !== productoId) return c;
      const nueva = c.cantidad + delta;
      return nueva <= 0 ? null : { ...c, cantidad: nueva };
    }).filter(Boolean));
  }, []);

  const clearCart = useCallback(() => setCarrito([]), []);

  const totalCarrito = carrito.reduce((sum, c) => sum + c.precio * c.cantidad, 0);
  const itemsCount = carrito.reduce((sum, c) => sum + c.cantidad, 0);

  return (
    <CartContext.Provider value={{ carrito, addToCart, updateCantidad, clearCart, totalCarrito, itemsCount }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be inside CartProvider');
  return ctx;
}
