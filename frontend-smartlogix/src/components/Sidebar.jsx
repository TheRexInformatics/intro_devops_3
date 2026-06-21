const ICONS = {
  dashboard: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
    </svg>
  ),
  inventario: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
      <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
      <line x1="12" y1="22.08" x2="12" y2="12" />
    </svg>
  ),
  pedidos: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <circle cx="9" cy="21" r="1" />
      <circle cx="20" cy="21" r="1" />
      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
    </svg>
  ),
  envios: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <rect x="1" y="3" width="15" height="13" rx="1" />
      <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
      <circle cx="5.5" cy="18.5" r="2.5" />
      <circle cx="18.5" cy="18.5" r="2.5" />
    </svg>
  ),
};

const ADMIN_ITEMS = [
  { label: "Dashboard", icon: ICONS.dashboard, section: "Dashboard" },
  { label: "Inventario", icon: ICONS.inventario, section: "Inventario" },
  { label: "Pedidos", icon: ICONS.pedidos, section: "Pedidos" },
  { label: "Envíos", icon: ICONS.envios, section: "Envíos" },
];

const CLIENTE_ITEMS = [
  { label: "Tienda", icon: ICONS.inventario, section: "Tienda" },
  { label: "Mis Pedidos", icon: ICONS.pedidos, section: "Pedidos" },
];

export default function Sidebar({ activeSection, onNavigate, userRole }) {
  const isAdmin = userRole === 'ROLE_ADMIN';
  const items = isAdmin ? ADMIN_ITEMS : CLIENTE_ITEMS;

  return (
    <aside className="w-64 bg-slate-900 flex flex-col shrink-0 h-full">
      <div className="px-6 py-6 border-b border-slate-700/50">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-indigo-500 flex items-center justify-center">
            <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
            </svg>
          </div>
          <div>
            <span className="text-white font-bold text-lg tracking-tight leading-none block">SmartLogix</span>
            <span className="text-slate-500 text-xs">{isAdmin ? 'Panel de Control' : 'Panel Cliente'}</span>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {items.map(({ label, icon, section }) => {
          const isActive = activeSection === section;
          return (
            <button
              key={section}
              onClick={() => onNavigate && onNavigate(section)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 text-left ${
                isActive
                  ? "bg-indigo-500/20 text-indigo-300 border-l-2 border-indigo-400 pl-3"
                  : "text-slate-400 hover:bg-slate-800 hover:text-slate-200 border-l-2 border-transparent pl-3"
              }`}
            >
              <span className={isActive ? "text-indigo-300" : "text-slate-500"}>{icon}</span>
              {label}
            </button>
          );
        })}
      </nav>

      <div className="px-4 py-4 border-t border-slate-700/50">
        <div className="flex items-center gap-3">
          <div className={`w-8 h-8 rounded-full bg-gradient-to-br flex items-center justify-center text-white text-xs font-bold shrink-0 ${isAdmin ? 'from-indigo-400 to-blue-500' : 'from-emerald-400 to-teal-500'}`}>
            {isAdmin ? 'A' : 'C'}
          </div>
          <div className="overflow-hidden">
            <p className="text-slate-300 text-xs font-medium truncate">{isAdmin ? 'Admin SmartLogix' : 'Cliente SmartLogix'}</p>
            <p className="text-slate-600 text-xs truncate">{isAdmin ? 'admin@smartlogix.cl' : 'cliente@smartlogix.cl'}</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
