import { useState, useEffect } from 'react';
import { getPedidos, crearEnvio, getEnvioByPedidoId, actualizarEstadoEnvio } from '../facade/BffFacade';

const ESTADOS_FLUJO = ['PREPARACION', 'EN_TRANSITO', 'ENTREGADO'];
const ESTADO_COLORS = {
  PREPARACION: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200', dot: 'bg-blue-500' },
  EN_TRANSITO: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', dot: 'bg-amber-500' },
  ENTREGADO:  { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', dot: 'bg-emerald-500' },
  INCIDENCIA: { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200', dot: 'bg-red-500' },
  CANCELADO:  { bg: 'bg-slate-50', text: 'text-slate-500', border: 'border-slate-200', dot: 'bg-slate-400' },
};

export default function EnviosContainer() {
  const [pedidos, setPedidos] = useState([]);
  const [envios, setEnvios] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreate, setShowCreate] = useState(false);
  const [pedidoIdInput, setPedidoIdInput] = useState('');
  const [direccion, setDireccion] = useState('');
  const [transportistaInput, setTransportistaInput] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);
      const pedidosList = await getPedidos();
      setPedidos(pedidosList);
      const enviosMap = {};
      await Promise.all(pedidosList.map(async p => {
        try { enviosMap[p.id] = await getEnvioByPedidoId(p.id); } catch {}
      }));
      setEnvios(enviosMap);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);
  useEffect(() => { const id = setInterval(loadData, 15000); return () => clearInterval(id); }, []);

  const handleCrearEnvio = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    try {
      await crearEnvio(parseInt(pedidoIdInput), direccion);
      setShowCreate(false);
      setPedidoIdInput('');
      setDireccion('');
      await loadData();
    } catch (err) { setError(err.message); }
    finally { setActionLoading(false); }
  };

  const handleAvanzarEstado = async (envio) => {
    const idx = ESTADOS_FLUJO.indexOf(envio.estado);
    if (idx < ESTADOS_FLUJO.length - 1) {
      setActionLoading(true);
      try {
        await actualizarEstadoEnvio(envio.id, ESTADOS_FLUJO[idx + 1], transportistaInput || undefined);
        await loadData();
      } catch (err) { setError(err.message); }
      finally { setActionLoading(false); }
    }
  };

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
          <h2 className="text-lg font-bold text-slate-800">Envíos</h2>
          <p className="text-xs text-slate-500 mt-0.5">{pedidos.length} pedidos en sistema</p>
        </div>
        <button onClick={() => setShowCreate(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl transition-colors shadow-sm">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
          Crear Envío
        </button>
      </div>

      {showCreate && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h3 className="text-sm font-semibold text-slate-800 mb-4">Nuevo Envío</h3>
          <form onSubmit={handleCrearEnvio} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">ID del Pedido</label>
                <input required type="number" value={pedidoIdInput} onChange={e => setPedidoIdInput(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 outline-none" />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Dirección</label>
                <input required value={direccion} onChange={e => setDireccion(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 outline-none" placeholder="Av. Principal 123" />
              </div>
            </div>
            <div className="flex gap-3">
              <button type="submit" disabled={actionLoading}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white text-sm font-semibold rounded-lg transition-colors">
                {actionLoading ? 'Creando...' : 'Crear Envío'}
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
                <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Pedido ID</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Destino</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Tracking</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Estado</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Transportista</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr><td colSpan={6} className="px-5 py-12 text-center text-slate-400 text-sm">Cargando envíos...</td></tr>
              ) : pedidos.length === 0 ? (
                <tr><td colSpan={6} className="px-5 py-12 text-center text-slate-400 text-sm">No hay pedidos en el sistema.</td></tr>
              ) : pedidos.map(p => {
                const envio = envios[p.id];
                const col = envio ? ESTADO_COLORS[envio.estado] || ESTADO_COLORS.PREPARACION : null;
                const idx = envio ? ESTADOS_FLUJO.indexOf(envio.estado) : -1;
                const puedeAvanzar = idx >= 0 && idx < ESTADOS_FLUJO.length - 1;

                return (
                  <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-5 py-3.5 font-mono text-xs font-semibold text-slate-700">#{p.id}</td>
                    <td className="px-5 py-3.5 text-slate-600">{envio?.direccionDestino || '—'}</td>
                    <td className="px-5 py-3.5">
                      {envio ? (
                        <code className="text-xs bg-slate-100 px-2 py-0.5 rounded text-slate-600">{envio.codigoSeguimiento}</code>
                      ) : (
                        <span className="text-xs text-slate-400">Sin envío</span>
                      )}
                    </td>
                    <td className="px-5 py-3.5">
                      {envio ? (
                        <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-0.5 rounded-full ${col.bg} ${col.text}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${col.dot}`} />
                          {envio.estado}
                        </span>
                      ) : (
                        <span className="text-xs bg-slate-100 text-slate-500 px-2 py-1 rounded-full">Sin envío</span>
                      )}
                    </td>
                    <td className="px-5 py-3.5 text-slate-600">{envio?.transportista || '—'}</td>
                    <td className="px-5 py-3.5">
                      {envio && puedeAvanzar ? (
                        <button onClick={() => handleAvanzarEstado(envio)} disabled={actionLoading}
                          className="text-xs px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded-lg hover:bg-indigo-100 disabled:bg-slate-100 disabled:text-slate-400 font-medium transition-colors">
                          {actionLoading ? '...' : `→ ${ESTADOS_FLUJO[idx + 1]}`}
                        </button>
                      ) : envio?.estado === 'ENTREGADO' ? (
                        <span className="text-xs text-emerald-600 font-medium">✓ Completado</span>
                      ) : !envio ? (
                        <span className="text-xs text-slate-400">—</span>
                      ) : (
                        <span className="text-xs text-slate-400">{envio.estado}</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
