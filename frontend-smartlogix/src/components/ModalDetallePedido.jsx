/**
 * ModalDetallePedido.jsx — Presenter puro
 * Muestra el detalle completo de un pedido.
 * Si sagaStatus === "CANCELLED", muestra el motivoFallo del microservicio.
 */

const STATUS_CONFIG = {
  CONFIRMED: { label: "Confirmado", badge: "bg-green-100 text-green-800", icon: "✅" },
  PENDING:   { label: "Pendiente",  badge: "bg-yellow-100 text-yellow-800", icon: "⏳" },
  CANCELLED: { label: "Cancelado",  badge: "bg-red-100 text-red-800", icon: "❌" },
};

function DetailRow({ label, value, mono = false }) {
  return (
    <div className="flex items-start justify-between py-2.5 border-b border-gray-50 last:border-0">
      <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide w-36 shrink-0">
        {label}
      </span>
      <span className={`text-sm text-gray-700 text-right ${mono ? "font-mono" : "font-medium"}`}>
        {value ?? "—"}
      </span>
    </div>
  );
}

export default function ModalDetallePedido({ pedido, loadingDetalle, onClose, onEdit, onCancel }) {
  if (!pedido && !loadingDetalle) return null;

  const cfg = STATUS_CONFIG[pedido?.sagaStatus] ?? STATUS_CONFIG.PENDING;
  const isCancelled   = pedido?.sagaStatus === "CANCELLED";
  const isCancellable = pedido?.sagaStatus === "PENDING" || pedido?.sagaStatus === "CONFIRMED";
  const isEditable    = pedido?.sagaStatus !== "CANCELLED";

  function handleBackdrop(e) {
    if (e.target === e.currentTarget) onClose();
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={handleBackdrop}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center text-lg">
              🛒
            </div>
            <div>
              <h2 className="text-base font-bold text-gray-800">
                {loadingDetalle ? "Cargando detalle..." : `Pedido ${pedido?.id}`}
              </h2>
              <p className="text-xs text-gray-400">Información completa del pedido</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5">
          {loadingDetalle ? (
            <div className="space-y-3 animate-pulse">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="flex justify-between items-center py-2.5 border-b border-gray-50">
                  <div className="h-3 bg-gray-100 rounded w-28" />
                  <div className="h-3 bg-gray-100 rounded w-36" />
                </div>
              ))}
            </div>
          ) : (
            <>
              {/* Estado Saga — prominente */}
              <div className={`flex items-center gap-2 px-4 py-3 rounded-xl mb-4 ${
                isCancelled ? "bg-red-50 border border-red-100" :
                pedido?.sagaStatus === "PENDING" ? "bg-yellow-50 border border-yellow-100" :
                "bg-green-50 border border-green-100"
              }`}>
                <span className="text-lg">{cfg.icon}</span>
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Estado Saga</p>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold mt-0.5 ${cfg.badge}`}>
                    {cfg.label}
                  </span>
                </div>
              </div>

              {/* Datos del pedido */}
              <div className="space-y-0">
                <DetailRow label="ID Pedido"    value={pedido?.id}          mono />
                <DetailRow label="Cliente"      value={pedido?.clienteId ?? pedido?.client} />
                <DetailRow label="Ítems"        value={pedido?.items} />
                <DetailRow label="Total"        value={`$${Number(pedido?.total ?? 0).toLocaleString("es-CL")}`} />
                <DetailRow label="Fecha"        value={pedido?.fecha} />
                <DetailRow label="Hora"         value={pedido?.hora} />
              </div>

              {/* ── Motivo del Fallo Saga (solo CANCELLED) ── */}
              {isCancelled && (
                <div className="mt-4 rounded-xl bg-red-50 border border-red-200 p-4 space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-base">⚠️</span>
                    <p className="text-xs font-bold text-red-700 uppercase tracking-wide">
                      Motivo del Fallo — Compensación Saga
                    </p>
                  </div>
                  <p className="text-sm text-red-800 leading-relaxed">
                    {pedido?.motivoFallo ?? "Sin descripción de fallo disponible."}
                  </p>
                  {pedido?.sagaStep && (
                    <p className="text-xs text-red-500 font-mono">
                      Paso fallido: {pedido.sagaStep}
                    </p>
                  )}
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer — acciones contextuales */}
        {!loadingDetalle && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 bg-gray-50">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-200 transition-colors"
            >
              Cerrar
            </button>
            <div className="flex items-center gap-2">
              {isEditable && (
                <button
                  onClick={() => onEdit(pedido)}
                  className="px-4 py-2 rounded-lg text-sm font-semibold text-blue-600 border border-blue-200 hover:bg-blue-50 transition-colors"
                >
                  Editar
                </button>
              )}
              {isCancellable && (
                <button
                  onClick={() => onCancel(pedido.id)}
                  className="px-4 py-2 rounded-lg text-sm font-semibold bg-red-600 text-white hover:bg-red-700 transition-colors"
                >
                  Cancelar Pedido
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
