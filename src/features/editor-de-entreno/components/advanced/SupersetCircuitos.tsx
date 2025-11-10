import React from 'react';
import { EjercicioEnSesion } from '../../api/editor';
import { Timer, Clock, Repeat } from 'lucide-react';

export type TipoTemporizador = 'EMOM' | 'AMRAP' | 'For-Time' | 'Tradicional';

export interface ConfiguracionTemporizador {
  tipo: TipoTemporizador;
  duracion?: number; // segundos para EMOM/AMRAP/For-Time
  rondas?: number; // para AMRAP/For-Time
}

export interface EjercicioConTemporizador extends EjercicioEnSesion {
  temporizador?: ConfiguracionTemporizador;
  esSuperset?: boolean;
  esCircuito?: boolean;
  grupoSuperset?: string; // A1, A2, B1, B2, etc.
}

/**
 * Componente para configurar superseries/circuitos con temporizadores
 */
export const ConfiguradorSupersetCircuito: React.FC<{
  ejercicios: EjercicioConTemporizador[];
  onEjerciciosChange: (ejercicios: EjercicioConTemporizador[]) => void;
}> = ({ ejercicios, onEjerciciosChange }) => {
  const toggleTemporizador = (ejercicioId: string, tipo: TipoTemporizador) => {
    const nuevosEjercicios = ejercicios.map(ej => {
      if (ej.id === ejercicioId) {
        return {
          ...ej,
          temporizador: {
            tipo,
            duracion: tipo !== 'Tradicional' ? 60 : undefined,
            rondas: tipo === 'AMRAP' || tipo === 'For-Time' ? 3 : undefined,
          },
        };
      }
      return ej;
    });
    onEjerciciosChange(nuevosEjercicios);
  };

  return (
    <div className="space-y-2">
      {ejercicios.map((ej, idx) => (
        <div key={ej.id} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
          <span className="text-sm font-medium text-gray-700 w-32 truncate">
            {ej.ejercicio.nombre}
          </span>
          <div className="flex gap-1">
            {(['Tradicional', 'EMOM', 'AMRAP', 'For-Time'] as TipoTemporizador[]).map(tipo => (
              <button
                key={tipo}
                onClick={() => toggleTemporizador(ej.id, tipo)}
                className={`px-2 py-1 text-xs rounded ${
                  ej.temporizador?.tipo === tipo
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {tipo}
              </button>
            ))}
          </div>
          {ej.temporizador && ej.temporizador.tipo !== 'Tradicional' && (
            <div className="flex items-center gap-2 text-xs text-gray-600">
              <Timer className="w-3 h-3" />
              {ej.temporizador.duracion && (
                <span>{ej.temporizador.duracion}s</span>
              )}
              {ej.temporizador.rondas && (
                <span>{ej.temporizador.rondas} rondas</span>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

/**
 * Renderizar ejercicio con indentación para superseries
 */
export const renderEjercicioConIndentacion = (
  ejercicio: EjercicioConTemporizador,
  nivel: number = 0
) => {
  const indentacion = nivel * 24; // 24px por nivel
  
  return (
    <div
      style={{ marginLeft: `${indentacion}px` }}
      className={`${
        ejercicio.esSuperset || ejercicio.esCircuito
          ? 'border-l-2 border-blue-300 pl-2'
          : ''
      }`}
    >
      {ejercicio.grupoSuperset && (
        <span className="text-xs font-medium text-blue-600 mr-2">
          {ejercicio.grupoSuperset}
        </span>
      )}
      {ejercicio.temporizador && ejercicio.temporizador.tipo !== 'Tradicional' && (
        <div className="inline-flex items-center gap-1 text-xs text-gray-600 mb-1">
          <Timer className="w-3 h-3" />
          <span>{ejercicio.temporizador.tipo}</span>
          {ejercicio.temporizador.duracion && (
            <>
              <Clock className="w-3 h-3 ml-1" />
              <span>{ejercicio.temporizador.duracion}s</span>
            </>
          )}
        </div>
      )}
    </div>
  );
};









