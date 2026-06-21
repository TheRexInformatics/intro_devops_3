import { useState, useEffect } from "react";
import { isAuthenticated as checkAuthFacade, isTokenExpired, logout, decodeTokenPayload } from "./facade/BffFacade";
import { CartProvider } from "./context/CartContext";

import LoginContainer     from "./containers/LoginContainer";
import DashboardContainer from "./containers/DashboardContainer";
import PedidosContainer   from "./containers/PedidosContainer";
import InventarioContainer from "./containers/InventarioContainer";
import EnviosContainer     from "./containers/EnviosContainer";
import StoreContainer      from "./containers/StoreContainer";

import Sidebar from "./components/Sidebar";
import Header  from "./components/Header";

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('smartlogix_token'));
  const [activeSection, setActiveSection] = useState("Dashboard");

  const tokenPayload = isAuthenticated ? decodeTokenPayload() : null;
  const userName     = tokenPayload?.name ?? tokenPayload?.sub ?? "Admin";
  const userRole     = tokenPayload?.role ?? "ROLE_ADMIN";
  const isAdmin      = userRole === 'ROLE_ADMIN';

  useEffect(() => {
    function handleUnauthorized() {
      setIsAuthenticated(false);
    }
    window.addEventListener("smartlogix:unauthorized", handleUnauthorized);
    return () => window.removeEventListener("smartlogix:unauthorized", handleUnauthorized);
  }, []);

  useEffect(() => {
    if (!isAuthenticated) return;
    const id = setInterval(() => {
      if (isTokenExpired()) {
        logout();
        setIsAuthenticated(false);
      }
    }, 60_000);
    return () => clearInterval(id);
  }, [isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated && !isAdmin) {
      setActiveSection("Tienda");
    }
  }, [isAuthenticated, isAdmin]);

  if (!isAuthenticated) {
    return (
      <LoginContainer
        onLoginSuccess={() => {
          setIsAuthenticated(true);
          setActiveSection("Dashboard");
        }}
      />
    );
  }

  function handleLogout() {
    logout();
    setIsAuthenticated(false);
  }

  return (
    <CartProvider>
      <div className="flex h-full bg-slate-50 overflow-hidden"
        style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
      <Sidebar
        activeSection={activeSection}
        onNavigate={setActiveSection}
        userRole={userRole}
      />

      <div className="flex flex-col flex-1 overflow-hidden">
        <Header
          section={activeSection}
          userName={userName}
          onLogout={handleLogout}
        />

        {isAdmin && activeSection === "Dashboard"  && <DashboardContainer onNavigate={setActiveSection} />}
        {activeSection === "Pedidos"    && <PedidosContainer clienteId={isAdmin ? null : userName} />}
        {activeSection === "Tienda"     && <StoreContainer />}
        {isAdmin && activeSection === "Inventario" && <InventarioContainer />}
        {isAdmin && activeSection === "Envíos"     && <EnviosContainer />}
      </div>
      </div>
    </CartProvider>
  );
}
