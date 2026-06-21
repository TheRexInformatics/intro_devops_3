import KpiCard from "./KpiCard";
import RecentOrdersTable from "./RecentOrdersTable";
import StockAlertsList from "./StockAlertsList";
import ActivityFeed from "./ActivityFeed";

export default function DashboardView({ loading, error, data, activeSection, onRefresh, onNavigate }) {
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

      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-widest">
            Resumen del Día
          </h2>
          <button onClick={onRefresh} className="flex items-center gap-1.5 text-xs text-indigo-600 hover:text-indigo-700 font-medium transition-colors">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5">
              <polyline points="23 4 23 10 17 10" /><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
            </svg>
            Refrescar
          </button>
        </div>
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
          {loading
            ? Array.from({ length: 4 }).map((_, i) => <KpiSkeleton key={i} />)
            : data?.kpis.map((kpi) => <KpiCard key={kpi.id} {...kpi} />)}
        </div>
      </section>

      <section className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 bg-white rounded-xl shadow-md border border-slate-200 overflow-hidden">
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-200 bg-slate-50/50">
            <h3 className="text-sm font-semibold text-slate-800">Pedidos Recientes</h3>
            <button onClick={() => onNavigate && onNavigate("Pedidos")} className="text-xs text-indigo-600 hover:text-indigo-700 font-medium transition-colors">
              Ver todos →
            </button>
          </div>
          {loading ? (
            <TableSkeleton />
          ) : (
            <RecentOrdersTable pedidos={data?.recentOrders ?? []} onVerDetalle={() => onNavigate && onNavigate("Pedidos")} />
          )}
        </div>

        <div className="bg-white rounded-xl shadow-md border border-slate-200 overflow-hidden">
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-200 bg-slate-50/50">
            <h3 className="text-sm font-semibold text-slate-800 flex items-center gap-2">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4 text-amber-500">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                <line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
              Alertas de Stock
            </h3>
            <span className="text-xs bg-amber-50 text-amber-700 font-semibold px-2 py-0.5 rounded-full border border-amber-200">
              {data?.stockAlerts.length ?? "—"}
            </span>
          </div>
          {loading ? (
            <GenericSkeleton rows={3} />
          ) : (
            <StockAlertsList alerts={data?.stockAlerts ?? []} />
          )}
        </div>
      </section>

      <section className="bg-white rounded-xl shadow-md border border-slate-200 overflow-hidden">
        <div className="px-5 py-3.5 border-b border-slate-200 bg-slate-50/50">
          <h3 className="text-sm font-semibold text-slate-800">Actividad Reciente del Sistema</h3>
        </div>
        {loading ? (
          <GenericSkeleton rows={5} />
        ) : (
          <ActivityFeed events={data?.activityFeed ?? []} />
        )}
      </section>
    </main>
  );
}

function KpiSkeleton() {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 animate-pulse space-y-3">
      <div className="h-3 bg-slate-200 rounded w-1/2" />
      <div className="h-7 bg-slate-200 rounded w-2/3" />
      <div className="h-3 bg-slate-200 rounded w-1/3" />
    </div>
  );
}

function TableSkeleton() {
  return (
    <div className="p-4 space-y-3 animate-pulse">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex gap-4">
          <div className="h-4 bg-slate-100 rounded flex-1" />
          <div className="h-4 bg-slate-100 rounded w-24" />
          <div className="h-4 bg-slate-100 rounded w-16" />
        </div>
      ))}
    </div>
  );
}

function GenericSkeleton({ rows = 4 }) {
  return (
    <div className="p-4 space-y-3 animate-pulse">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="h-4 bg-slate-100 rounded w-full" />
      ))}
    </div>
  );
}
