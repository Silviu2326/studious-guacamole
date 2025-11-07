import React from 'react';
import { Calendar, Clock, User, Users } from 'lucide-react';
import { Card, Button, Badge } from '../../../components/componentsreutilizables';

export const ReservasCitas: React.FC = () => {
  // Mock data - en producción vendría de la API
  const reservas = [
    {
      id: '1',
      cliente: 'Juan Pérez',
      tipo: 'Sesión PT',
      fecha: new Date(),
      hora: '10:00',
      estado: 'confirmada',
    },
  ];

  return (
    <Card className="bg-white shadow-sm">
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">
          Reservas y Citas
        </h3>
        <div className="space-y-4">
          {reservas.length === 0 ? (
            <div className="text-center py-8">
              <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">
                No hay reservas pendientes
              </p>
            </div>
          ) : (
            reservas.map((reserva) => (
              <div key={reserva.id} className="p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900">
                      {reserva.cliente}
                    </h4>
                    <div className="flex items-center space-x-4 mt-2">
                      <span className="text-sm text-gray-600">
                        {reserva.tipo}
                      </span>
                      <span className="text-sm text-gray-600">
                        {reserva.hora}
                      </span>
                    </div>
                  </div>
                  <Badge color={reserva.estado === 'confirmada' ? 'success' : 'warning'}>
                    {reserva.estado}
                  </Badge>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </Card>
  );
};
