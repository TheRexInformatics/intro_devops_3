export default function LoginView({ 
  username, setUsername, 
  password, setPassword, 
  error, success, loading, onSubmit,
  isRegister, onToggle
}) {
  return (
    <div className="min-h-screen flex items-center justify-center relative bg-slate-50 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-100 via-slate-50 to-cyan-100 opacity-70" />
      
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-br from-indigo-500/5 to-cyan-500/5" />
      
      <div className="relative w-full max-w-md mx-4">
        <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 p-8">
          <div className="text-center mb-8">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-indigo-500/25">
              <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7">
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-slate-800">SmartLogix</h2>
            <p className="text-slate-500 text-sm mt-1.5">
              {isRegister ? 'Crea tu cuenta para acceder' : 'Ingresa tus credenciales'}
            </p>
          </div>

          {success && (
            <div className="mb-5 p-3.5 bg-emerald-50 border border-emerald-100 text-emerald-600 rounded-xl text-sm text-center flex items-center gap-2 justify-center">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4 shrink-0"><polyline points="20 6 9 17 4 12" /></svg>
              {success}
            </div>
          )}

          {error && (
            <div className="mb-5 p-3.5 bg-red-50 border border-red-100 text-red-600 rounded-xl text-sm text-center">
              {error}
            </div>
          )}

          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1.5">Usuario</label>
              <input 
                type="text" 
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition-all"
                placeholder="tu_usuario"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1.5">Contraseña</label>
              <input 
                type="password" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition-all"
                placeholder="••••••••"
              />
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className={`w-full py-2.5 px-4 rounded-xl text-sm font-semibold text-white transition-all duration-200 ${
                loading 
                  ? 'bg-slate-400 cursor-not-allowed' 
                  : 'bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 shadow-lg shadow-indigo-500/25 hover:shadow-xl hover:shadow-indigo-500/30'
              }`}
            >
              {loading ? 'Procesando...' : isRegister ? 'Crear Cuenta' : 'Iniciar Sesión'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button 
              type="button"
              onClick={onToggle}
              className="text-sm text-indigo-600 hover:text-indigo-700 font-medium transition-colors"
            >
              {isRegister ? '¿Ya tienes cuenta? Inicia sesión' : '¿No tienes cuenta? Regístrate'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
