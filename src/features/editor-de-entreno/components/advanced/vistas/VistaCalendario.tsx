import React from 'react';
import { PlanificacionSemana, EstadoCliente } from '../../../types/advanced';
import { Calendar } from 'lucide-react';

interface VistaCalendarioProps {
  planificacion: PlanificacionSemana;
  onPlanificacionChange: (plan: PlanificacionSemana) => void;
  clienteId?: string;
  estadoCliente?: EstadoCliente;
}

export const VistaCalendario: React.FC<VistaCalendarioProps> = ({
  planificacion,
  onPlanificacionChange,
  clienteId,
  estadoCliente,
}) => {
  // TODO: Implementar vista de calendario completa con arrastre de sesiones
  return (
    <div className="h-full p-4 overflow-y-auto">
      <div className="text-center py-12 text-gray-500">
        <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-400" />
        <p className="text-lg font-medium mb-2">Vista Calendario</p>
        <p className="text-sm">Arrastra sesiones a fechas reales</p>
        <p className="text-xs text-gray-400 mt-2">Funcionalidad en desarrollo</p>
      </div>
    </div>
  );
};




