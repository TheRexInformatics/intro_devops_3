// src/containers/DashboardContainer.jsx
import { useState, useEffect, useCallback } from "react";
import DashboardView from "../components/DashboardView";
import { bffFacade } from "../facade/BffFacade";

export default function DashboardContainer({ onNavigate }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadDashboard = useCallback(async () => {
    try {
      setLoading(true);
      const dashboardData = await bffFacade.getDashboardData();
      setData(dashboardData);
    } catch (err) {
      setError("Error de conexión con el BFF de SmartLogix.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  return (
    <DashboardView 
      loading={loading} 
      error={error} 
      data={data} 
      activeSection="Dashboard"
      onRefresh={loadDashboard}
      onNavigate={onNavigate}
    />
  );
}
