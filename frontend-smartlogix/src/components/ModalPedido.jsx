import React from 'react';

export default function ModalPedido({ isOpen, onClose, pedido, loading }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden bg-black bg-opacity-50">
      <div className="relative w-full max-w-2xl p-4">
        {/* Contenido del Modal */}
        <div className="relative bg-white rounded-xl shadow-xl flex flex-col">
          
          {/* Header */}
          <div className="flex items-center justify-between p-5 border-b rounded-t">
            <h3 className="text-xl font-semibold text-gray-900">
              Detalle del Pedido {pedido?.id ? `#${pedido.id}` : ''}
            </h3>
            <button 
              onClick={onClose}
              className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center"
            >
              <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
              </svg>
            </button>
          </div>

          {/* Body */}
          <div className="p-6 space-y-6 flex-1 overflow-y-auto">
            {loading ? (
              <div className="flex justify-center items-center h-32">
                <span className="text-gray-500">Cargando detalles desde el microservicio...</span>
              </div>
            ) : pedido ? (
              <>
                {/* 🚨 ZONA SAGA: Alerta Crítica si el pedido fue compensado */}
                {pedido.sagaStatus === 'CANCELLED' && (
                  <div className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 border border-red-200" role="alert">
                    <div className="flex items-center mb-2">
                      <span className="text-xl mr-2">⚠️</span>
                      <span className="font-bold text-base">Transacción Interrumpida (Compensación Saga)</span>
                    </div>
                    <p>
                      El pedido fue cancelado automáticamente porque uno de los microservicios falló. <br/>
                      <strong>Motivo reportado:</strong> {pedido.motivoFallo || "Fallo en validación de Stock o Envío."}
                    </p>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-500">Estado de la Saga</p>
                    <p className={`font-bold ${
                      pedido.sagaStatus === 'CONFIRMED' ? 'text-green-600' :
                      pedido.sagaStatus === 'CANCELLED' ? 'text-red-600' :
                      'text-yellow-600'
                    }`}>
                      {pedido.sagaStatus || 'PENDING'}
                    </p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-500">Cliente ID</p>
                    <p className="font-semibold text-gray-900">{pedido.clienteId || 'N/A'}</p>
                  </div>
                </div>

                {/* Lista de productos ficticia o real si el endpoint te la devuelve */}
                <div>
                  <h4 className="text-lg font-medium text-gray-900 mb-2">Artículos</h4>
                  <ul className="divide-y divide-gray-200 border rounded-lg px-4">
                    {/* Aquí mapearíamos pedido.items si los tuvieras. Por ahora un placeholder */}
                    <li className="py-3 flex justify-between">
                      <span className="text-gray-600">ID Producto: {pedido.productoId || 'N/A'}</span>
                      <span className="font-semibold">Cant: {pedido.cantidad || 1}</span>
                    </li>
                  </ul>
                </div>
              </>
            ) : (
              <p className="text-center text-gray-500">No se pudo cargar la información.</p>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end p-5 border-t border-gray-200 rounded-b">
            <button 
              onClick={onClose}
              className="text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}