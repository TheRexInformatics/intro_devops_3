import { useState, useEffect } from 'react';
import { getProductos, crearProducto, getStocks, entradaStock, salidaStock } from '../facade/BffFacade';

export default function InventarioContainer() {
  const [productos, setProductos] = useState([]);
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreate, setShowCreate] = useState(false);
  const [stockModal, setStockModal] = useState(null);
  const [newProducto, setNewProducto] = useState({ nombre: '', descripcion: '', precio: '', sku: '' });
  const [cantidad, setCantidad] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);
      const [prods, stks] = await Promise.all([getProductos(), getStocks()]);
      setProductos(prods);
      setStocks(stks);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);
  useEffect(() => { const id = setInterval(loadData, 15000); return () => clearInterval(id); }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    try {
      await crearProducto({ ...newProducto, precio: parseFloat(newProducto.precio) });
      setShowCreate(false);
      setNewProducto({ nombre: '', descripcion: '', precio: '', sku: '' });
      await loadData();
    } catch (err) { setError(err.message); }
    finally { setActionLoading(false); }
  };

  const handleStockAction = async (tipo) => {
    setActionLoading(true);
    try {
      if (tipo === 'entrada') {
        await entradaStock(stockModal.productoId, stockModal.bodegaId || 1, parseInt(cantidad));
      } else {
        await salidaStock(stockModal.productoId, stockModal.bodegaId || 1, parseInt(cantidad));
      }
      setStockModal(null);
      setCantidad('');
      await loadData();
    } catch (err) { setError(err.message); }
    finally { setActionLoading(false); }
  };

  const stockPorProducto = {};
  stocks.forEach(s => {
    const pid = s.producto?.id || s.productoId;
    if (!stockPorProducto[pid]) stockPorProducto[pid] = 0;
    stockPorProducto[pid] += s.cantidad || 0;
  });

  return (
    <main className="flex-1 overflow-y-auto p-6 space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl p-4 text-sm flex items-center gap-2">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4 shrink-0">
            <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          {error}
        </div>
      )}

      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-800">Inventario</h2>
          <p className="text-xs text-slate-500 mt-0.5">{productos.length} productos</p>
        </div>
        <button onClick={() => setShowCreate(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl transition-colors shadow-sm">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
          Nuevo Producto
        </button>
      </div>

      {showCreate && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h3 className="text-sm font-semibold text-slate-800 mb-4">Crear Producto</h3>
          <form onSubmit={handleCreate} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Nombre</label>
                <input required value={newProducto.nombre} onChange={e => setNewProducto(p => ({...p, nombre: e.target.value}))}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 outline-none" />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">SKU</label>
                <input required value={newProducto.sku} onChange={e => setNewProducto(p => ({...p, sku: e.target.value}))}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 outline-none" />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Precio</label>
                <input required type="number" step="0.01" value={newProducto.precio} onChange={e => setNewProducto(p => ({...p, precio: e.target.value}))}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 outline-none" />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-slate-600 mb-1">Descripción</label>
                <input value={newProducto.descripcion} onChange={e => setNewProducto(p => ({...p, descripcion: e.target.value}))}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 outline-none" />
              </div>
            </div>
            <div className="flex gap-3">
              <button type="submit" disabled={actionLoading}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white text-sm font-semibold rounded-lg transition-colors">
                {actionLoading ? 'Creando...' : 'Crear'}
              </button>
              <button type="button" onClick={() => setShowCreate(false)} className="px-4 py-2 border border-slate-200 text-slate-600 text-sm rounded-lg hover:bg-slate-50">Cancelar</button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/50">
                <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Producto</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">SKU</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Precio</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Stock</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr><td colSpan={5} className="px-5 py-12 text-center text-slate-400 text-sm">Cargando...</td></tr>
              ) : productos.length === 0 ? (
                <tr><td colSpan={5} className="px-5 py-12 text-center text-slate-400 text-sm">No hay productos. Crea el primero.</td></tr>
              ) : productos.map(p => {
                const stock = stockPorProducto[p.id] || 0;
                return (
                  <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-5 py-3.5">
                      <span className="font-medium text-slate-800">{p.nombre}</span>
                      <span className="block text-xs text-slate-400 truncate max-w-[200px]">{p.descripcion}</span>
                    </td>
                    <td className="px-5 py-3.5"><code className="text-xs bg-slate-100 px-2 py-0.5 rounded text-slate-600">{p.sku}</code></td>
                    <td className="px-5 py-3.5 text-slate-800 font-semibold">${Number(p.precio).toLocaleString()}</td>
                    <td className="px-5 py-3.5">
                      <span className={`text-sm font-semibold ${stock === 0 ? 'text-red-600' : stock < 10 ? 'text-amber-600' : 'text-emerald-600'}`}>
                        {stock} unid.
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex gap-2">
                        <button onClick={() => { setStockModal({ productoId: p.id }); setCantidad(''); }}
                          className="text-xs px-2.5 py-1.5 bg-emerald-50 text-emerald-700 rounded-lg hover:bg-emerald-100 font-medium transition-colors">+ Entrada</button>
                        <button onClick={() => { setStockModal({ productoId: p.id }); setCantidad(''); }}
                          className="text-xs px-2.5 py-1.5 bg-amber-50 text-amber-700 rounded-lg hover:bg-amber-100 font-medium transition-colors">- Salida</button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {stockModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50" onClick={() => setStockModal(null)}>
          <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-sm mx-4" onClick={e => e.stopPropagation()}>
            <h3 className="text-sm font-semibold text-slate-800 mb-4">Cantidad</h3>
            <input type="number" min="1" value={cantidad} onChange={e => setCantidad(e.target.value)}
              className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 outline-none mb-4" placeholder="1" autoFocus />
            <div className="flex gap-3 justify-end">
              <button onClick={() => handleStockAction('entrada')} disabled={!cantidad || actionLoading}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 text-white text-sm font-semibold rounded-lg transition-colors">{actionLoading ? 'Procesando...' : 'Entrada'}</button>
              <button onClick={() => handleStockAction('salida')} disabled={!cantidad || actionLoading}
                className="px-4 py-2 bg-amber-600 hover:bg-amber-700 disabled:bg-slate-300 text-white text-sm font-semibold rounded-lg transition-colors">{actionLoading ? 'Procesando...' : 'Salida'}</button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
