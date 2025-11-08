import React, { useState } from 'react';
import { VistaDiario, VistaSemana, VistaCalendario, VistaExcel } from './vistas';
import { 
  SesionEntrenamiento, 
  PlanificacionSemana,
  VistaEditor,
  EstadoCliente,
  Restricciones 
} from '../../types/advanced';

interface CenterAreaProps {
  vista: VistaEditor;
  planificacion: PlanificacionSemana;
  sesionActual?: SesionEntrenamiento;
  diaSeleccionado: keyof PlanificacionSemana;
  onDiaSeleccionado: (dia: keyof PlanificacionSemana) => void;
  onSesionChange: (sesion: SesionEntrenamiento) => void;
  clienteId?: string;
  estadoCliente?: EstadoCliente;
  restricciones?: Restricciones;
  onSmartFill: (restricciones: Restricciones) => void;
  autoprogressionEnabled: boolean;
}

export const CenterArea: React.FC<CenterAreaProps> = ({
  vista,
  planificacion,
  sesionActual,
  diaSeleccionado,
  onDiaSeleccionado,
  onSesionChange,
  clienteId,
  estadoCliente,
  restricciones,
  onSmartFill,
  autoprogressionEnabled,
}) => {
  return (
    <div className="h-full overflow-hidden">
      {vista === 'diario' && (
        <VistaDiario
          sesion={sesionActual}
          onSesionChange={onSesionChange}
          diaSeleccionado={diaSeleccionado}
          onDiaSeleccionado={onDiaSeleccionado}
          restricciones={restricciones}
          onSmartFill={onSmartFill}
          estadoCliente={estadoCliente}
        />
      )}
      {vista === 'semana' && (
        <VistaSemana
          planificacion={planificacion}
          onPlanificacionChange={(plan) => {
            // Actualizar toda la planificación
            Object.keys(plan).forEach((dia) => {
              if (plan[dia as keyof PlanificacionSemana]) {
                onSesionChange(plan[dia as keyof PlanificacionSemana]!);
              }
            });
          }}
          diaSeleccionado={diaSeleccionado}
          onDiaSeleccionado={onDiaSeleccionado}
          restricciones={restricciones}
          onSmartFill={onSmartFill}
        />
      )}
      {vista === 'calendario' && (
        <VistaCalendario
          planificacion={planificacion}
          onPlanificacionChange={(plan) => {
            Object.keys(plan).forEach((dia) => {
              if (plan[dia as keyof PlanificacionSemana]) {
                onSesionChange(plan[dia as keyof PlanificacionSemana]!);
              }
            });
          }}
          clienteId={clienteId}
          estadoCliente={estadoCliente}
        />
      )}
      {vista === 'excel' && (
        <VistaExcel
          planificacion={planificacion}
          onPlanificacionChange={(plan) => {
            Object.keys(plan).forEach((dia) => {
              if (plan[dia as keyof PlanificacionSemana]) {
                onSesionChange(plan[dia as keyof PlanificacionSemana]!);
              }
            });
          }}
          estadoCliente={estadoCliente}
        />
      )}
    </div>
  );
};







