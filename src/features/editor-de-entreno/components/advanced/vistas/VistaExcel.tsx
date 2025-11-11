import React from 'react';
import { PlanificacionSemana, EstadoCliente } from '../../../types/advanced';
import { Grid3x3 } from 'lucide-react';

interface VistaExcelProps {
  planificacion: PlanificacionSemana;
  onPlanificacionChange: (plan: PlanificacionSemana) => void;
  estadoCliente?: EstadoCliente;
}

export const VistaExcel: React.FC<VistaExcelProps> = ({
  planificacion,
  onPlanificacionChange,
  estadoCliente,
}) => {
  // TODO: Implementar vista Excel con grid editable
  return (
    <div className="h-full p-4 overflow-y-auto">
      <div className="text-center py-12 text-gray-500">
        <Grid3x3 className="w-12 h-12 mx-auto mb-4 text-gray-400" />
        <p className="text-lg font-medium mb-2">Vista Excel</p>
        <p className="text-sm">Grid editable con copiar/pegar y validaciones</p>
        <p className="text-xs text-gray-400 mt-2">Funcionalidad en desarrollo</p>
      </div>
    </div>
  );
};












