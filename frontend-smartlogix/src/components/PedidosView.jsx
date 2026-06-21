import FiltrosPedidos      from "./FiltrosPedidos";
import ModalPedido         from "./ModalPedido";
import ModalDetallePedido  from "./ModalDetallePedido";
import ConfirmDialog       from "./ConfirmDialog";

const STATUS_STYLES = {
  CONFIRMED: "bg-green-100 text-green-800",
  PENDING:   "bg-yellow-100 text-yellow-800",
  CANCELLED: "bg-red-100 text-red-800",
};
const STATUS_LABELS = { CONFIRMED: "Confirmado", PENDING: "Pendiente", CANCELLED: "Cancelado" };

function SagaBadge({ status }) {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${STATUS_STYLES[status] ?? "bg-gray-100 text-gray-600"}`}>
      {STATUS_LABELS[status] ?? status}
    </span>
  );
}

function SkeletonRows() {
  return Array.from({ length: 6 }).map((_, i) => (
    <tr key={i} className="animate-pulse">
      {Array.from({ length: 7 }).map((__, j) => (
        <td key={j} className="px-5 py-4"><div className="h-3.5 bg-gray-100 rounded" /></td>
      ))}
    </tr>
  ));
}

function TablaPedidos({ pedidos, loading, onVerDetalle, onEdit, onCancel }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-100">
            {["Pedido", "Cliente / ID", "Ítems", "Total", "Fecha", "Estado Saga", "Acciones"].map((h) => (
              <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider whitespace-nowrap">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {loading ? <SkeletonRows /> : pedidos.length === 0 ? (
            <tr><td colSpan={7} className="px-5 py-12 text-center text-gray-400 text-sm">No se encontraron pedidos con los filtros aplicados.</td></tr>
          ) : pedidos.map((p) => {
            const clientLabel   = p.clienteId ?? p.client ?? "—";
            const statusKey     = p.sagaStatus ?? p.status;
            const isCancellable = statusKey === "PENDING" || statusKey === "CONFIRMED";
            const isEditable    = statusKey !== "CANCELLED";
            return (
              <tr key={p.id} className="hover:bg-gray-50 transition-colors duration-100 cursor-pointer" onClick={() => onVerDetalle(p)}>
                <td className="px-5 py-3.5 font-mono font-semibold text-gray-700 text-xs">{p.id}</td>
                <td className="px-5 py-3.5 text-gray-700 font-medium max-w-[160px] truncate">{clientLabel}</td>
                <td className="px-5 py-3.5 text-gray-500">{p.items}</td>
                <td className="px-5 py-3.5 text-gray-800 font-semibold">${Number(p.total ?? 0).toLocaleString("es-CL")}</td>
                <td className="px-5 py-3.5 text-gray-500 whitespace-nowrap">{p.fecha}</td>
                <td className="px-5 py-3.5"><SagaBadge status={statusKey} /></td>
                <td className="px-5 py-3.5" onClick={(e) => e.stopPropagation()}>
                  <div className="flex items-center gap-2">
                    <button onClick={() => onEdit(p)} disabled={!isEditable}
                      className="text-xs font-medium text-blue-600 hover:text-blue-800 disabled:text-gray-300 disabled:cursor-not-allowed transition-colors">
                      Editar
                    </button>
                    <span className="text-gray-200">|</span>
                    <button onClick={() => onCancel(p.id)} disabled={!isCancellable}
                      className="text-xs font-medium text-red-500 hover:text-red-700 disabled:text-gray-300 disabled:cursor-not-allowed transition-colors">
                      Cancelar
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default function PedidosView({
  pedidos, loading, saving, error,
  filterStatus, filterFechaDesde, filterFechaHasta,
  onFilterStatus, onFilterFechaDesde, onFilterFechaHasta,
  searchClienteId, onSearchClienteId,
  modalMode, form, formErrors,
  onOpenCreate, onOpenEdit, onCloseModal, onFormChange, onSubmit,
  showDetalle, detallePedido, loadingDetalle, onOpenDetalle, onCloseDetalle,
  confirmCancelId, onAskCancel, onConfirmCancel, onDismissCancel,
}) {
  return (
    <main className="flex-1 overflow-y-auto p-6 space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 text-sm">⚠️ {error}</div>
      )}

      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-gray-800">Gestión de Pedidos</h2>
          <p className="text-xs text-gray-400 mt-0.5">
            {loading ? "Cargando..." : `${pedidos.length} pedido${pedidos.length !== 1 ? "s" : ""} encontrado${pedidos.length !== 1 ? "s" : ""}`}
          </p>
        </div>
        <button onClick={onOpenCreate}
          className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition-colors shadow-sm">
          <span className="text-base leading-none">+</span> Nuevo Pedido
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <FiltrosPedidos
          filterStatus={filterStatus} filterFechaDesde={filterFechaDesde} filterFechaHasta={filterFechaHasta}
          onFilterStatus={onFilterStatus} onFilterFechaDesde={onFilterFechaDesde} onFilterFechaHasta={onFilterFechaHasta}
        />

        {/* Búsqueda local por clienteId / ID pedido */}
        <div className="px-5 py-3 border-b border-gray-100">
          <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 max-w-sm">
            <span className="text-gray-400 text-sm">🔍</span>
            <input type="text" value={searchClienteId} onChange={(e) => onSearchClienteId(e.target.value)}
              placeholder="Buscar por cliente o ID de pedido..."
              className="bg-transparent text-sm text-gray-700 placeholder-gray-400 outline-none flex-1" />
            {searchClienteId && (
              <button onClick={() => onSearchClienteId("")} className="text-gray-400 hover:text-red-500 transition-colors">✕</button>
            )}
          </div>
        </div>

        <TablaPedidos pedidos={pedidos} loading={loading}
          onVerDetalle={onOpenDetalle} onEdit={onOpenEdit} onCancel={onAskCancel} />
      </div>

      <ModalPedido mode={modalMode} form={form} formErrors={formErrors} saving={saving}
        onClose={onCloseModal} onChange={onFormChange} onSubmit={onSubmit} />

      {showDetalle && (
        <ModalDetallePedido pedido={detallePedido} loadingDetalle={loadingDetalle}
          onClose={onCloseDetalle} onEdit={onOpenEdit} onCancel={onAskCancel} />
      )}

      <ConfirmDialog show={!!confirmCancelId} title="Cancelar Pedido"
        message={`¿Estás seguro de cancelar el pedido ${confirmCancelId}? Esta acción iniciará la compensación Saga y no se puede deshacer.`}
        confirmLabel="Sí, cancelar pedido" saving={saving}
        onConfirm={onConfirmCancel} onDismiss={onDismissCancel} />
    </main>
  );
}
