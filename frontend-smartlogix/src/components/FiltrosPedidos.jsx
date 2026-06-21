const STATUS_TABS = [
  { value: "ALL",       label: "Todos" },
  { value: "CONFIRMED", label: "Confirmados" },
  { value: "PENDING",   label: "Pendientes" },
  { value: "CANCELLED", label: "Cancelados" },
];

const TAB_ACTIVE = {
  ALL:       "bg-gray-800 text-white",
  CONFIRMED: "bg-green-600 text-white",
  PENDING:   "bg-yellow-500 text-white",
  CANCELLED: "bg-red-500 text-white",
};

export default function FiltrosPedidos({
  filterStatus,
  filterFechaDesde,
  filterFechaHasta,
  onFilterStatus,
  onFilterFechaDesde,
  onFilterFechaHasta,
}) {
  return (
    <div className="flex flex-wrap items-center gap-4 px-5 py-4 border-b border-gray-100 bg-gray-50 rounded-t-xl">
      {/* Tabs de estado */}
      <div className="flex items-center gap-1.5 bg-white border border-gray-200 rounded-lg p-1">
        {STATUS_TABS.map(({ value, label }) => {
          const isActive = filterStatus === value;
          return (
            <button
              key={value}
              onClick={() => onFilterStatus(value)}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all duration-150 ${
                isActive
                  ? TAB_ACTIVE[value]
                  : "text-gray-500 hover:bg-gray-100"
              }`}
            >
              {label}
            </button>
          );
        })}
      </div>

      {/* Separador */}
      <div className="hidden sm:block h-6 w-px bg-gray-200" />

      {/* Rango de fechas */}
      <div className="flex items-center gap-2 text-xs text-gray-500">
        <span className="font-medium text-gray-400 uppercase tracking-wide">Desde</span>
        <input
          type="date"
          value={filterFechaDesde}
          onChange={(e) => onFilterFechaDesde(e.target.value)}
          className="border border-gray-200 rounded-lg px-2.5 py-1.5 text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-300 transition"
        />
        <span className="font-medium text-gray-400 uppercase tracking-wide">Hasta</span>
        <input
          type="date"
          value={filterFechaHasta}
          onChange={(e) => onFilterFechaHasta(e.target.value)}
          className="border border-gray-200 rounded-lg px-2.5 py-1.5 text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-300 transition"
        />
        {(filterFechaDesde || filterFechaHasta) && (
          <button
            onClick={() => { onFilterFechaDesde(""); onFilterFechaHasta(""); }}
            className="text-gray-400 hover:text-red-500 text-base leading-none transition-colors"
            title="Limpiar fechas"
          >
            ✕
          </button>
        )}
      </div>
    </div>
  );
}
