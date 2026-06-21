const COLOR_MAP = {
  blue:    { bg: "bg-blue-50",   text: "text-blue-600",  bar: "bg-blue-500",   border: "border-l-blue-500",  iconBg: "bg-blue-500" },
  emerald: { bg: "bg-emerald-50", text: "text-emerald-600", bar: "bg-emerald-500", border: "border-l-emerald-500", iconBg: "bg-emerald-500" },
  amber:   { bg: "bg-amber-50",  text: "text-amber-600",  bar: "bg-amber-500",  border: "border-l-amber-500",  iconBg: "bg-amber-500" },
  violet:  { bg: "bg-violet-50", text: "text-violet-600", bar: "bg-violet-500", border: "border-l-violet-500", iconBg: "bg-violet-500" },
};

const KPI_ICONS = {
  pedidos: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" />
    </svg>
  ),
  ingresos: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
      <line x1="12" y1="1" x2="12" y2="23" />
      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </svg>
  ),
  entregados: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  ),
  pendientes: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
      <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
    </svg>
  ),
  default: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
      <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" />
    </svg>
  ),
};

function getKpiIcon(title) {
  const t = (title || "").toLowerCase();
  if (t.includes("pedido")) return KPI_ICONS.pedidos;
  if (t.includes("ingreso")) return KPI_ICONS.ingresos;
  if (t.includes("entregado")) return KPI_ICONS.entregados;
  if (t.includes("pendiente")) return KPI_ICONS.pendientes;
  return KPI_ICONS.default;
}

export default function KpiCard({ label, title, value, delta, trend, icon, color }) {
  const displayLabel = label || title || "";
  const c = COLOR_MAP[color] ?? COLOR_MAP.blue;

  return (
    <div className={`bg-white rounded-xl shadow-md hover:shadow-lg border border-slate-200 border-l-4 ${c.border} p-5 flex flex-col gap-3 transition-all duration-300`}>
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
          {displayLabel}
        </span>
        <span className={`w-10 h-10 flex items-center justify-center rounded-xl ${c.iconBg} shadow-sm`}>
          <span className="text-white">{icon || getKpiIcon(displayLabel)}</span>
        </span>
      </div>

      <div className="flex items-end justify-between">
        <span className="text-2xl font-bold text-slate-800 leading-none">{value}</span>
        {delta && (
          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${c.bg} ${c.text}`}>
            {trend === "up" ? "▲" : "▼"} {delta}
          </span>
        )}
      </div>

      <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${c.bar} opacity-60`} style={{ width: trend === "up" ? "72%" : "38%" }} />
      </div>
    </div>
  );
}
