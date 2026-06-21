import NotificationDropdown from './NotificationDropdown';
import CartDropdown from './CartDropdown';
import { useState } from 'react';

export default function Header({ section, userName = "Admin", onLogout }) {
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const now = new Date().toLocaleDateString("es-CL", {
    weekday: "long", year: "numeric", month: "long", day: "numeric",
  });

  const initials = userName
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");

  const gradientColors = [
    "from-indigo-500 to-blue-600",
    "from-emerald-500 to-teal-600",
    "from-violet-500 to-purple-600",
    "from-amber-500 to-orange-600",
  ];
  const avatarGradient = gradientColors[userName.charCodeAt(0) % gradientColors.length];

  return (
    <>
      <header className="bg-white border-b border-slate-200 px-6 py-3 flex items-center justify-between shrink-0">
        <div>
          <h1 className="text-slate-800 font-semibold text-lg leading-tight">{section}</h1>
          <p className="text-slate-500 text-xs capitalize">{now}</p>
        </div>

        <div className="flex items-center gap-4">
          <NotificationDropdown />
          <CartDropdown userName={userName} />

          <div className="flex items-center gap-3 pl-3 border-l border-slate-200">
            <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${avatarGradient} flex items-center justify-center text-white text-xs font-bold shrink-0`}>
              {initials || "AD"}
            </div>
            <span className="hidden md:block text-sm font-medium text-slate-700 max-w-[140px] truncate">
              {userName}
            </span>
            <button
              onClick={() => setShowLogoutConfirm(true)}
              title="Cerrar sesión"
              className="ml-1 p-1.5 rounded-lg text-slate-400 hover:bg-red-50 hover:text-red-500 transition-colors"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50" onClick={() => setShowLogoutConfirm(false)}>
          <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-sm mx-4" onClick={e => e.stopPropagation()}>
            <div className="text-center mb-4">
              <div className="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center mx-auto mb-3">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6 text-red-500">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                  <polyline points="16 17 21 12 16 7" />
                  <line x1="21" y1="12" x2="9" y2="12" />
                </svg>
              </div>
              <h3 className="text-sm font-semibold text-slate-800">Cerrar sesión</h3>
              <p className="text-xs text-slate-500 mt-1">¿Estás seguro de que quieres salir?</p>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setShowLogoutConfirm(false)}
                className="flex-1 px-4 py-2.5 border border-slate-200 text-slate-600 text-sm font-medium rounded-xl hover:bg-slate-50 transition-colors">
                Cancelar
              </button>
              <button onClick={() => { setShowLogoutConfirm(false); onLogout(); }}
                className="flex-1 px-4 py-2.5 bg-red-500 hover:bg-red-600 text-white text-sm font-semibold rounded-xl transition-colors">
                Salir
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
