import React from 'react';
import { User, Video, ClipboardCheck, Clock } from 'lucide-react';
import { Card, Badge } from '../../../components/componentsreutilizables';
import { Cita } from '../types';

interface VistaPersonalProps {
  citas?: Cita[];
}

export const VistaPersonal: React.FC<VistaPersonalProps> = ({ citas = [] }) => {
  const getIconoPorTipo = (tipo: string) => {
    switch (tipo) {
      case 'sesion-1-1':
        return <User className="w-5 h-5 text-blue-600" />;
      case 'videollamada':
        return <Video className="w-5 h-5 text-purple-600" />;
      case 'evaluacion':
        return <ClipboardCheck className="w-5 h-5 text-orange-600" />;
      default:
        return <Clock className="w-5 h-5 text-gray-600" />;
    }
  };

  const getColorEstado = (estado: string) => {
    switch (estado) {
      case 'confirmada':
        return 'success';
      case 'pendiente':
        return 'warning';
      case 'cancelada':
        return 'error';
      default:
        return 'info';
    }
  };

  const formatearHora = (fecha: Date) => {
    return new Date(fecha).toLocaleTimeString('es-ES', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const citasHoy = citas.filter(cita => {
    const fechaCita = new Date(cita.fechaInicio);
    const hoy = new Date();
    return fechaCita.getDate() === hoy.getDate() &&
      fechaCita.getMonth() === hoy.getMonth() &&
      fechaCita.getFullYear() === hoy.getFullYear();
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold text-gray-900">
          Agenda Personal
        </h3>
        <Badge color="info">
          {citasHoy.length} citas hoy
        </Badge>
      </div>

      <Card className="bg-white shadow-sm">
        <div className="p-6">
          <div className="space-y-4">
            {citasHoy.length === 0 ? (
              <div className="text-center py-8">
                <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">
                  No hay citas programadas para hoy
                </p>
              </div>
            ) : (
              citasHoy.map((cita) => (
                <div
                  key={cita.id}
                  className="flex items-start space-x-4 p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  <div className="flex-shrink-0 mt-1">
                    {getIconoPorTipo(cita.tipo)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-lg font-semibold text-gray-900">
                        {cita.titulo}
                      </h4>
                      <Badge color={getColorEstado(cita.estado) as any}>
                        {cita.estado}
                      </Badge>
                    </div>
                    <div className="flex items-center space-x-4 text-sm">
                      <div className="flex items-center space-x-1 text-gray-600">
                        <Clock className="w-4 h-4" />
                        <span>{formatearHora(cita.fechaInicio)} - {formatearHora(cita.fechaFin)}</span>
                      </div>
                      {cita.clienteNombre && (
                        <div className="flex items-center space-x-1 text-gray-600">
                          <User className="w-4 h-4" />
                          <span>{cita.clienteNombre}</span>
                        </div>
                      )}
                    </div>
                    {cita.notas && (
                      <p className="mt-2 text-sm text-gray-500">
                        {cita.notas}
                      </p>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </Card>
    </div>
  );
};
