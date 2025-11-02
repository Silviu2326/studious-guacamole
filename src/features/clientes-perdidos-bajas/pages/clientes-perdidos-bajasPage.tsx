import React, { useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { Button } from '../../../components/componentsreutilizables';
import { ChurnedClientsDashboard, LogCancellationModal } from '../components';
import { UserType } from '../types';
import { UserMinus, Plus } from 'lucide-react';

export default function ClientesPerdidosBajasPage() {
  const { user } = useAuth();
  const esEntrenador = user?.role === 'entrenador';
  const userType: UserType = esEntrenador ? 'trainer' : 'gym';
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedClientId, setSelectedClientId] = useState<string>('');

  const handleLogCancellation = () => {
    // Esto se llamaría desde la tabla cuando se selecciona un cliente
    // Por ahora solo abrimos el modal con un ID de ejemplo
    setSelectedClientId('client-123');
    setIsModalOpen(true);
  };

  const handleModalSubmit = (data: { cancellationId: string; message: string }) => {
    // Recargar datos después de registrar la baja
    console.log('Baja registrada:', data);
    setIsModalOpen(false);
    // Aquí se podría recargar la tabla/dashboard
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Header */}
      <div className="border-b border-gray-200/60 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6">
          <div className="py-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-xl mr-4 ring-1 ring-blue-200/70">
                <UserMinus size={24} className="text-blue-600" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900">
                  {esEntrenador ? 'Clientes Perdidos' : 'Clientes Perdidos / Bajas'}
                </h1>
                <p className="text-gray-600">
                  {esEntrenador
                    ? 'Gestiona y analiza los clientes que han pausado o cancelado sus servicios. Registra motivos informales para facilitar el seguimiento y posibles acciones de re-enganche.'
                    : 'Centro de control analítico para gestionar y comprender el ciclo de vida final de los clientes. Registra bajas formales, analiza causas y mejora la retención.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6 py-8">
        <div className="space-y-6">
          {/* Toolbar superior */}
          <div className="flex items-center justify-end">
            <Button
              variant="primary"
              onClick={handleLogCancellation}
            >
              <Plus size={20} className="mr-2" />
              {esEntrenador ? 'Registrar Baja/Pausa' : 'Registrar Baja'}
            </Button>
          </div>
          
          {/* Dashboard principal */}
          <ChurnedClientsDashboard userType={userType} />
        </div>
      </div>

      {/* Modal de registro de baja */}
      <LogCancellationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleModalSubmit}
        userType={userType}
        clientId={selectedClientId}
        clientName="Cliente de ejemplo"
      />
    </div>
  );
}

