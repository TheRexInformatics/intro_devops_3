import { useState, useEffect } from 'react';
import { getPedidos, getDetallePedido, compensarPedido, completarPedido } from '../facade/BffFacade';
import RecentOrdersTable from '../components/RecentOrdersTable';
import ModalPedido from '../components/ModalPedido';

export default function PedidosContainer({ clienteId }) {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Estados para Filtros
  const [filtroEstado, setFiltroEstado] = useState('TODOS');
  const [busquedaId, setBusquedaId] = useState('');

  // Estados para el Modal de la Saga
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pedidoSeleccionado, setPedidoSeleccionado] = useState(null);
  const [loadingDetalle, setLoadingDetalle] = useState(false);

  // Cargar datos reales al montar el componente
  useEffect(() => {
    cargarPedidosRest();
    const interval = setInterval(cargarPedidosRest, 15_000);
    return () => clearInterval(interval);
  }, []);

  const cargarPedidosRest = async () => {
    try {
      setLoading(true);
      // Llama a tu microservicio real a través del Gateway
      const data = await getPedidos();
      setPedidos(data || []);
    } catch (err) {
      setError("Error al cargar los pedidos desde el servidor.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Función que se ejecuta al hacer clic en un pedido de la tabla
  const handleVerDetalle = async (id) => {
    setIsModalOpen(true);
    setLoadingDetalle(true);
    try {
      const detalle = await getDetallePedido(id);
      setPedidoSeleccionado(detalle);
    } catch (err) {
      console.error("Error al obtener detalle del pedido", err);
      // Fallback: Si el detalle falla, pasamos los datos básicos de la tabla
      const pedidoBasico = pedidos.find(p => p.id === id);
      setPedidoSeleccionado(pedidoBasico);
    } finally {
      setLoadingDetalle(false);
    }
  };

  // Lógica de Filtros Reales
  const pedidosFiltrados = pedidos.filter((pedido) => {
    const matchEstado = filtroEstado === 'TODOS' || 
                        pedido.sagaStatus === filtroEstado || 
                        pedido.estado === filtroEstado;
    const matchId = busquedaId === '' || String(pedido.id).includes(busquedaId);
    const matchCliente = !clienteId || pedido.clienteId === clienteId;
    return matchEstado && matchId && matchCliente;
  });

  const handleCancelar = async (id) => {
    try {
      await compensarPedido(id);
      await cargarPedidosRest();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleCompletar = async (id) => {
    try {
      await completarPedido(id);
      await cargarPedidosRest();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="flex-1 p-6 overflow-y-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-lg font-bold text-slate-800">{clienteId ? 'Mis Pedidos' : 'Gestión de Pedidos'}</h2>
          <p className="text-xs text-slate-500 mt-0.5">{clienteId ? 'Tus compras' : 'Saga Pattern activo'}</p>
        </div>
        <button onClick={cargarPedidosRest} className="flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-700 rounded-xl text-sm font-medium hover:bg-indigo-100 transition-colors">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4"><polyline points="23 4 23 10 17 10" /><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" /></svg>
          Refrescar
        </button>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm">
          {error}
        </div>
      )}

      {/* Tu componente Presenter Visual (La tabla) */}
      <RecentOrdersTable 
        pedidos={pedidosFiltrados} 
        loading={loading}
        filtroEstado={filtroEstado}
        setFiltroEstado={setFiltroEstado}
        busquedaId={busquedaId}
        setBusquedaId={setBusquedaId}
        onVerDetalle={handleVerDetalle}
        onCancelar={handleCancelar}
        onCompletar={handleCompletar}
        clienteId={clienteId}
      />

      {/* Renderizado del Modal */}
      <ModalPedido 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        pedido={pedidoSeleccionado}
        loading={loadingDetalle}
      />
    </div>
  );
}