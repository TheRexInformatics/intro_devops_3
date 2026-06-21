import { useState, useEffect } from 'react';
import { getProductos, getStocks } from '../facade/BffFacade';
import { useCart } from '../context/CartContext';

export default function StoreContainer() {
  const [productos, setProductos] = useState([]);
  const [stocks, setStocks] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { addToCart } = useCart();

  const loadData = async () => {
    try {
      setLoading(true);
      const [prods, stks] = await Promise.all([getProductos(), getStocks()]);
      setProductos(prods);
      const stockMap = {};
      stks.forEach(s => {
        const pid = s.producto?.id || s.productoId;
        stockMap[pid] = (stockMap[pid] || 0) + (s.cantidad || 0);
      });
      setStocks(stockMap);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  if (loading) {
    return (
      <main className="flex-1 overflow-y-auto p-6">
        <div className="text-center py-12 text-slate-400">Cargando productos...</div>
      </main>
    );
  }

  return (
    <main className="flex-1 overflow-y-auto p-6">
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm">{error}</div>
      )}

      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-bold text-slate-800">Tienda SmartLogix</h2>
          <p className="text-xs text-slate-500 mt-0.5">{productos.length} productos disponibles</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
        {productos.map(p => (
          <div key={p.id} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md hover:border-indigo-200 transition-all duration-200">
            <div className="h-40 bg-gradient-to-br from-indigo-50 to-blue-50 flex items-center justify-center">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="w-16 h-16 text-indigo-200">
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
              </svg>
            </div>
            <div className="p-4">
              <h3 className="text-sm font-semibold text-slate-800">{p.nombre}</h3>
              <p className="text-xs text-slate-400 mt-0.5 truncate">{p.descripcion}</p>
              <div className="flex items-center justify-between mt-3">
                <span className="text-lg font-bold text-slate-800">${Number(p.precio).toLocaleString()}</span>
                <span className={`text-xs font-medium ${(stocks[p.id] || 0) === 0 ? 'text-red-500' : (stocks[p.id] || 0) < 5 ? 'text-amber-600' : 'text-emerald-600'}`}>
                  {(stocks[p.id] || 0)} unid.
                </span>
              </div>
              <button
                onClick={() => addToCart(p)}
                disabled={(stocks[p.id] || 0) <= 0}
                className="mt-3 w-full py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-200 disabled:text-slate-400 text-white text-sm font-semibold rounded-lg transition-colors">
                {(stocks[p.id] || 0) <= 0 ? 'Agotado' : 'Agregar al carrito'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
