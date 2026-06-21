import { useState } from 'react';

const STATUS_STYLES = {
  CONFIRMED: "bg-emerald-50 text-emerald-700 border border-emerald-200",
  PENDING: "bg-amber-50 text-amber-700 border border-amber-200",
  CANCELLED: "bg-red-50 text-red-700 border border-red-200",
  PROCESADO: "bg-blue-50 text-blue-700 border border-blue-200",
  COMPLETADO: "bg-emerald-50 text-emerald-700 border border-emerald-200",
};

const STATUS_LABELS = {
  CONFIRMED: "Confirmado",
  PENDING: "Pendiente",
  CANCELLED: "Cancelado",
  PROCESADO: "Procesado",
  COMPLETADO: "Completado",
};

function SagaBadge({ status }) {
  const safeStatus = (status || "PROCESADO").toUpperCase();
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${STATUS_STYLES[safeStatus] ?? "bg-slate-100 text-slate-600 border border-slate-200"}`}>
      {STATUS_LABELS[safeStatus] ?? safeStatus}
    </span>
  );
}

export default function RecentOrdersTable({ 
  pedidos,
  loading,
  filtroEstado,
  setFiltroEstado,
  busquedaId,
  setBusquedaId,
  onVerDetalle,
  onCancelar,
  onCompletar,
  clienteId,
}) {
  const [cancelConfirmId, setCancelConfirmId] = useState(null);

  if (loading) {
    return (
      <div className="p-8 text-center">
        <div className="animate-spin w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full mx-auto mb-3" />
        <p className="text-slate-500 text-sm">Cargando pedidos...</p>
      </div>
    );
  }

  if (!pedidos || pedidos.length === 0) {
    return (
      <div className="p-10 text-center">
        <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center mx-auto mb-3">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6 text-slate-400">
            <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
          </svg>
        </div>
        <p className="text-slate-500 text-sm">No se encontraron pedidos con esos filtros.</p>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
        <div className="flex flex-col sm:flex-row justify-between gap-3 mb-4">
        <div className="relative">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            placeholder="Buscar por ID..."
            value={busquedaId}
            onChange={(e) => setBusquedaId(e.target.value)}
            className="w-full sm:w-56 pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400"
          />
        </div>
          <select
            value={filtroEstado}
            onChange={(e) => setFiltroEstado(e.target.value)}
            className="border border-slate-200 rounded-lg px-4 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 bg-white"
          >
            <option value="TODOS">Todos los estados</option>
            <option value="PROCESADO">Procesado</option>
            <option value="COMPLETADO">Completado</option>
            <option value="PENDING">Pendiente</option>
            <option value="CANCELLED">Cancelado</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Pedido ID</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Cliente</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Estado</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {pedidos.map((pedido) => {
                const badgeStatus = pedido.estado || pedido.sagaStatus || pedido.status;
                const isActive = badgeStatus === 'PROCESADO' && pedido.sagaStatus !== 'CANCELLED';
                const isCompleted = badgeStatus === 'COMPLETADO';
                const isCancelled = badgeStatus === 'CANCELLED';

                return (
                  <tr key={pedido.id} className="hover:bg-indigo-50/50 transition-colors duration-100">
                    <td
                      onClick={() => onVerDetalle && onVerDetalle(pedido.id)}
                      className="px-5 py-3.5 font-mono font-semibold text-slate-700 text-xs cursor-pointer">
                      #{pedido.id}
                    </td>
                    <td
                      onClick={() => onVerDetalle && onVerDetalle(pedido.id)}
                      className="px-5 py-3.5 text-slate-700 font-medium cursor-pointer">
                      {pedido.clienteId || pedido.client || "Cliente Local"}
                    </td>
                    <td
                      onClick={() => onVerDetalle && onVerDetalle(pedido.id)}
                      className="px-5 py-3.5 cursor-pointer">
                      <SagaBadge status={badgeStatus} />
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2">
                        {isActive && onCompletar && (
                          <button onClick={() => onCompletar(pedido.id)}
                            className="text-xs px-2.5 py-1.5 bg-emerald-50 text-emerald-700 rounded-lg hover:bg-emerald-100 font-medium transition-colors">
                            Completar
                          </button>
                        )}
                        {isActive && onCancelar && (
                          <button onClick={() => setCancelConfirmId(pedido.id)}
                            className="text-xs px-2.5 py-1.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 font-medium transition-colors">
                            Cancelar
                          </button>
                        )}
                        {isCompleted && (
                          <span className="text-xs text-emerald-600 font-medium">✓ Completado</span>
                        )}
                        {isCancelled && (
                          <span className="text-xs text-red-400 font-medium">Cancelado</span>
                        )}
                        <button
                          onClick={() => onVerDetalle && onVerDetalle(pedido.id)}
                          className="text-xs text-indigo-600 hover:text-indigo-700 font-medium">
                          Ver Detalle →
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {cancelConfirmId && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50" onClick={() => setCancelConfirmId(null)}>
          <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-sm mx-4" onClick={e => e.stopPropagation()}>
            <div className="text-center mb-4">
              <div className="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center mx-auto mb-3">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6 text-red-500">
                  <circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" />
                </svg>
              </div>
              <h3 className="text-sm font-semibold text-slate-800">Cancelar Pedido #{cancelConfirmId}</h3>
              <p className="text-xs text-slate-500 mt-1">Se cancelará el pedido y se restaurará el stock.</p>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setCancelConfirmId(null)}
                className="flex-1 px-4 py-2.5 border border-slate-200 text-slate-600 text-sm font-medium rounded-xl hover:bg-slate-50">
                Volver
              </button>
              <button onClick={() => { onCancelar(cancelConfirmId); setCancelConfirmId(null); }}
                className="flex-1 px-4 py-2.5 bg-red-500 hover:bg-red-600 text-white text-sm font-semibold rounded-xl">
                Cancelar Pedido
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
