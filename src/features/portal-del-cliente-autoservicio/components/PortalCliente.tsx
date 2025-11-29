import React, { useState, useEffect } from 'react';
import { Card } from '../../../components/componentsreutilizables';
import { clienteAPI } from '../api';
import { User, CreditCard, Calendar, CheckCircle2, Loader2 } from 'lucide-react';

interface PortalClienteProps {
  onSeleccionarServicio: (servicio: string) => void;
}

export const PortalCliente: React.FC<PortalClienteProps> = ({ onSeleccionarServicio }) => {
  const [cliente, setCliente] = useState<any>(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    cargarDatosCliente();
  }, []);

  const cargarDatosCliente = async () => {
    try {
      const datos = await clienteAPI.obtenerCliente();
      setCliente(datos);
    } catch (error) {
      console.error('Error al cargar datos del cliente:', error);
    } finally {
      setCargando(false);
    }
  };

  if (cargando) {
    return (
      <Card className="p-8 text-center bg-white shadow-sm">
        <Loader2 size={48} className="mx-auto text-blue-500 animate-spin mb-4" />
        <p className="text-gray-600">Cargando...</p>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Información del Cliente */}
      <Card className="bg-white shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
              <User className="w-8 h-8 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                {cliente?.nombre}
              </h2>
              <p className="text-gray-600">
                {cliente?.email}
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Información de Membresía */}
      {cliente?.membresiaActiva && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card variant="hover" className="h-full flex flex-col transition-shadow overflow-hidden">
            <div className="p-4 flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
                <CheckCircle2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700 mb-1">
                  Membresía
                </p>
                <p className="text-lg font-semibold text-gray-900">
                  {cliente.membresiaActiva.nombre}
                </p>
              </div>
            </div>
          </Card>

          <Card variant="hover" className="h-full flex flex-col transition-shadow overflow-hidden">
            <div className="p-4 flex items-center gap-4">
              <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center flex-shrink-0">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700 mb-1">
                  Estado
                </p>
                <p className="text-lg font-semibold text-gray-900">
                  {cliente.membresiaActiva.estado === 'activa' ? 'Activa' : 
                   cliente.membresiaActiva.estado === 'pausada' ? 'Pausada' : 'Vencida'}
                </p>
              </div>
            </div>
          </Card>

          {cliente?.tarjetaActual && (
            <Card variant="hover" className="h-full flex flex-col transition-shadow overflow-hidden">
              <div className="p-4 flex items-center gap-4">
                <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center flex-shrink-0">
                  <CreditCard className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-1">
                    Tarjeta
                  </p>
                  <p className="text-lg font-semibold text-gray-900">
                    •••• {cliente.tarjetaActual.ultimosDigitos}
                  </p>
                </div>
              </div>
            </Card>
          )}
        </div>
      )}
    </div>
  );
};

