export default function StockAlertsList({ alerts = [] }) {
  if (!alerts || alerts.length === 0) {
    return (
      <div className="p-8 text-center flex flex-col items-center justify-center h-full">
        <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center mb-3">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6 text-emerald-500">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        <h4 className="text-sm font-semibold text-slate-700">Inventario Saludable</h4>
        <p className="text-xs text-slate-500 mt-1">No hay productos en nivel crítico.</p>
      </div>
    );
  }

  return (
    <ul className="divide-y divide-slate-100 max-h-[350px] overflow-y-auto">
      {alerts.map((alert, index) => {
        const stockActual = alert.stockActual ?? alert.stock ?? 0;
        const estaAgotado = stockActual <= 0;

        return (
          <li key={alert.id || index} className="px-5 py-4 hover:bg-slate-50 transition-colors">
            <div className="flex justify-between items-start">
              <div className="flex flex-col min-w-0">
                <span className="text-sm font-semibold text-slate-800 truncate">
                  {alert.producto || alert.productName || 'Producto Desconocido'}
                </span>
                <span className="text-xs text-slate-500 mt-1">
                  Mínimo requerido: {alert.stockMinimo || alert.minStock || 10}
                </span>
              </div>

              <div className="flex flex-col items-end ml-3 shrink-0">
                <span className={`text-sm font-bold px-2.5 py-1 rounded-lg ${
                  estaAgotado 
                    ? 'bg-red-50 text-red-700 border border-red-200' 
                    : 'bg-amber-50 text-amber-700 border border-amber-200'
                }`}>
                  {stockActual} unid.
                </span>
                <span className={`text-[10px] font-bold uppercase mt-1 tracking-wider ${
                  estaAgotado ? 'text-red-500' : 'text-amber-600'
                }`}>
                  {estaAgotado ? 'Agotado' : 'Crítico'}
                </span>
              </div>
            </div>

            {!estaAgotado && (
              <div className="mt-2 w-full bg-slate-100 rounded-full h-1.5">
                <div
                  className="bg-amber-400 h-1.5 rounded-full"
                  style={{ width: `${Math.min(100, (stockActual / (alert.stockMinimo || 10)) * 100)}%` }}
                />
              </div>
            )}
          </li>
        );
      })}
    </ul>
  );
}
