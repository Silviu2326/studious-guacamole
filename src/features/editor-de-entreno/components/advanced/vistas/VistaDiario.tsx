import React, { useState } from 'react';
import { SesionEntrenamiento, PlanificacionSemana, Restricciones, EstadoCliente } from '../../../types/advanced';
import { Button } from '../../../../../components/componentsreutilizables';
import { GripVertical, Plus, Trash2, Zap, Clock, AlertCircle } from 'lucide-react';
import { EjercicioEnSesion } from '../../../api/editor';

interface VistaDiarioProps {
  sesion?: SesionEntrenamiento;
  onSesionChange: (sesion: SesionEntrenamiento) => void;
  diaSeleccionado: keyof PlanificacionSemana;
  onDiaSeleccionado: (dia: keyof PlanificacionSemana) => void;
  restricciones?: Restricciones;
  onSmartFill: (restricciones: Restricciones) => void;
  estadoCliente?: EstadoCliente;
}

export const VistaDiario: React.FC<VistaDiarioProps> = ({
  sesion,
  onSesionChange,
  diaSeleccionado,
  onDiaSeleccionado,
  restricciones,
  onSmartFill,
  estadoCliente,
}) => {
  const [ejercicios, setEjercicios] = useState<EjercicioEnSesion[]>(
    sesion?.ejercicios || []
  );

  const dias: Array<{ key: keyof PlanificacionSemana; label: string }> = [
    { key: 'lunes', label: 'Lunes' },
    { key: 'martes', label: 'Martes' },
    { key: 'miercoles', label: 'Miércoles' },
    { key: 'jueves', label: 'Jueves' },
    { key: 'viernes', label: 'Viernes' },
    { key: 'sabado', label: 'Sábado' },
    { key: 'domingo', label: 'Domingo' },
  ];

  const calcularTiempoEstimado = () => {
    const tiempoEjercicios = ejercicios.length * 5; // 5 min por ejercicio aprox
    const tiempoDescansos = ejercicios.reduce((sum, ej) => {
      return sum + (ej.series?.reduce((s, serie) => s + (serie.descanso || 0), 0) || 0);
    }, 0);
    return Math.round((tiempoEjercicios + tiempoDescansos) / 60);
  };

  // Multi-selección de ejercicios
  const [ejerciciosSeleccionados, setEjerciciosSeleccionados] = useState<Set<string>>(new Set());
  
  const toggleSeleccionEjercicio = (id: string) => {
    setEjerciciosSeleccionados(prev => {
      const nuevo = new Set(prev);
      if (nuevo.has(id)) {
        nuevo.delete(id);
      } else {
        nuevo.add(id);
      }
      return nuevo;
    });
  };

  const editarSeleccionadosEnLote = (campo: 'descanso' | 'rpe', valor: number) => {
    const nuevosEjercicios = ejercicios.map(ej => {
      if (!ejerciciosSeleccionados.has(ej.id)) return ej;
      
      const nuevasSeries = ej.series?.map(serie => ({
        ...serie,
        [campo]: valor,
      }));
      
      return {
        ...ej,
        series: nuevasSeries,
      };
    });
    
    setEjercicios(nuevosEjercicios);
    if (sesion) {
      onSesionChange({
        ...sesion,
        ejercicios: nuevosEjercicios,
      });
    }
    
    // Limpiar selección
    setEjerciciosSeleccionados(new Set());
  };

  const tiempoEstimado = calcularTiempoEstimado();
  const tiempoExcedeRestriccion = restricciones?.tiempoDisponible && tiempoEstimado > restricciones.tiempoDisponible;

  const handleAgregarEjercicio = () => {
    const nuevoEjercicio: EjercicioEnSesion = {
      id: `ejercicio-${Date.now()}`,
      ejercicio: {
        id: '',
        nombre: 'Nuevo Ejercicio',
        categoria: '',
        grupoMuscular: [],
      },
      series: [
        {
          id: `serie-${Date.now()}`,
          repeticiones: 10,
          peso: 0,
          descanso: 60,
          rpe: 6,
        },
      ],
      orden: ejercicios.length + 1,
    };
    const nuevosEjercicios = [...ejercicios, nuevoEjercicio];
    setEjercicios(nuevosEjercicios);
    if (sesion) {
      onSesionChange({
        ...sesion,
        ejercicios: nuevosEjercicios,
      });
    }
  };

  const handleEliminarEjercicio = (id: string) => {
    const nuevosEjercicios = ejercicios.filter(e => e.id !== id);
    setEjercicios(nuevosEjercicios);
    if (sesion) {
      onSesionChange({
        ...sesion,
        ejercicios: nuevosEjercicios,
      });
    }
  };

  const handleCondensarDia = () => {
    // TODO: Implementar lógica de condensación
    alert('Funcionalidad de condensar día en desarrollo');
  };

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header con selector de día */}
      <div className="border-b border-gray-200 p-4 bg-gray-50">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <select
              value={diaSeleccionado}
              onChange={(e) => onDiaSeleccionado(e.target.value as keyof PlanificacionSemana)}
              className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm font-medium bg-white"
            >
              {dias.map(dia => (
                <option key={dia.key} value={dia.key}>{dia.label}</option>
              ))}
            </select>
            {tiempoEstimado > 0 && (
              <div className={`flex items-center gap-1 text-sm ${
                tiempoExcedeRestriccion ? 'text-red-600' : 'text-gray-600'
              }`}>
                <Clock className="w-4 h-4" />
                <span>~{tiempoEstimado} min</span>
                {tiempoExcedeRestriccion && (
                  <AlertCircle className="w-4 h-4 text-red-600" />
                )}
              </div>
            )}
          </div>
          <div className="flex items-center gap-2">
            {ejerciciosSeleccionados.size > 0 && (
              <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-100 rounded-lg">
                <span className="text-sm font-medium text-blue-900">
                  {ejerciciosSeleccionados.size} seleccionados
                </span>
                <div className="flex gap-1">
                  <button
                    onClick={() => {
                      const valor = prompt('Nuevo descanso (segundos):', '60');
                      if (valor) editarSeleccionadosEnLote('descanso', parseInt(valor));
                    }}
                    className="text-xs px-2 py-1 bg-blue-200 hover:bg-blue-300 rounded text-blue-900"
                  >
                    Cambiar descanso
                  </button>
                  <button
                    onClick={() => {
                      const valor = prompt('Nuevo RPE (1-10):', '6');
                      if (valor) editarSeleccionadosEnLote('rpe', parseInt(valor));
                    }}
                    className="text-xs px-2 py-1 bg-blue-200 hover:bg-blue-300 rounded text-blue-900"
                  >
                    Cambiar RPE
                  </button>
                  <button
                    onClick={() => setEjerciciosSeleccionados(new Set())}
                    className="text-xs px-2 py-1 bg-gray-200 hover:bg-gray-300 rounded text-gray-900"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            )}
            {tiempoExcedeRestriccion && (
              <Button
                size="sm"
                variant="secondary"
                onClick={handleCondensarDia}
                leftIcon={<Zap className="w-4 h-4" />}
              >
                Condensar día
              </Button>
            )}
            {restricciones && (
              <Button
                size="sm"
                variant="secondary"
                onClick={() => onSmartFill(restricciones)}
                leftIcon={<Zap className="w-4 h-4" />}
              >
                Smart Fill
              </Button>
            )}
            <Button
              size="sm"
              onClick={handleAgregarEjercicio}
              leftIcon={<Plus className="w-4 h-4" />}
            >
              Agregar Ejercicio
            </Button>
          </div>
        </div>
      </div>

      {/* Lista de ejercicios con drag-and-drop */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {ejercicios.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <p className="mb-2">No hay ejercicios en este día</p>
            <p className="text-sm">Arrastra ejercicios desde la biblioteca o haz clic en "Agregar Ejercicio"</p>
          </div>
        ) : (
          ejercicios.map((ejercicio, index) => (
            <div
              key={ejercicio.id}
              className={`bg-white border rounded-lg p-4 hover:border-blue-300 transition-colors ${
                ejerciciosSeleccionados.has(ejercicio.id)
                  ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200'
                  : 'border-gray-200'
              }`}
              draggable
            >
              <div className="flex items-start gap-3">
                <div className="mt-1 flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={ejerciciosSeleccionados.has(ejercicio.id)}
                    onChange={() => toggleSeleccionEjercicio(ejercicio.id)}
                    className="w-4 h-4 text-blue-600 rounded"
                    onClick={(e) => e.stopPropagation()}
                  />
                  <div className="cursor-move">
                    <GripVertical className="w-5 h-5 text-gray-400" />
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h4 className="font-medium text-gray-900">{ejercicio.ejercicio.nombre}</h4>
                      {ejercicio.ejercicio.grupoMuscular.length > 0 && (
                        <p className="text-xs text-gray-500 mt-1">
                          {ejercicio.ejercicio.grupoMuscular.join(', ')}
                        </p>
                      )}
                    </div>
                    <button
                      onClick={() => handleEliminarEjercicio(ejercicio.id)}
                      className="p-1 hover:bg-red-50 rounded text-red-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Series */}
                  <div className="space-y-2">
                    {ejercicio.series?.map((serie, serieIndex) => (
                      <div
                        key={serie.id}
                        className="flex items-center gap-2 text-sm bg-gray-50 rounded p-2"
                      >
                        <span className="font-medium text-gray-700">S{serieIndex + 1}:</span>
                        <input
                          type="number"
                          value={serie.repeticiones}
                          onChange={(e) => {
                            const nuevasSeries = [...(ejercicio.series || [])];
                            nuevasSeries[serieIndex] = {
                              ...serie,
                              repeticiones: parseInt(e.target.value) || 0,
                            };
                            const nuevosEjercicios = [...ejercicios];
                            nuevosEjercicios[index] = {
                              ...ejercicio,
                              series: nuevasSeries,
                            };
                            setEjercicios(nuevosEjercicios);
                            if (sesion) {
                              onSesionChange({
                                ...sesion,
                                ejercicios: nuevosEjercicios,
                              });
                            }
                          }}
                          className="w-12 px-2 py-1 border border-gray-300 rounded text-center"
                          placeholder="Reps"
                        />
                        <span className="text-gray-500">×</span>
                        <input
                          type="number"
                          value={serie.peso || ''}
                          onChange={(e) => {
                            const nuevasSeries = [...(ejercicio.series || [])];
                            nuevasSeries[serieIndex] = {
                              ...serie,
                              peso: parseFloat(e.target.value) || 0,
                            };
                            const nuevosEjercicios = [...ejercicios];
                            nuevosEjercicios[index] = {
                              ...ejercicio,
                              series: nuevasSeries,
                            };
                            setEjercicios(nuevosEjercicios);
                            if (sesion) {
                              onSesionChange({
                                ...sesion,
                                ejercicios: nuevosEjercicios,
                              });
                            }
                          }}
                          className="w-16 px-2 py-1 border border-gray-300 rounded text-center"
                          placeholder="Peso"
                        />
                        <span className="text-gray-500">kg</span>
                        <span className="text-gray-400">@</span>
                        <input
                          type="number"
                          value={serie.rpe || ''}
                          onChange={(e) => {
                            const nuevasSeries = [...(ejercicio.series || [])];
                            nuevasSeries[serieIndex] = {
                              ...serie,
                              rpe: parseInt(e.target.value) || 0,
                            };
                            const nuevosEjercicios = [...ejercicios];
                            nuevosEjercicios[index] = {
                              ...ejercicio,
                              series: nuevasSeries,
                            };
                            setEjercicios(nuevosEjercicios);
                            if (sesion) {
                              onSesionChange({
                                ...sesion,
                                ejercicios: nuevosEjercicios,
                              });
                            }
                          }}
                          className="w-12 px-2 py-1 border border-gray-300 rounded text-center"
                          placeholder="RPE"
                          min="1"
                          max="10"
                        />
                        <span className="text-gray-500">RPE</span>
                        <span className="text-gray-400 ml-2">Descanso:</span>
                        <input
                          type="number"
                          value={serie.descanso || ''}
                          onChange={(e) => {
                            const nuevasSeries = [...(ejercicio.series || [])];
                            nuevasSeries[serieIndex] = {
                              ...serie,
                              descanso: parseInt(e.target.value) || 0,
                            };
                            const nuevosEjercicios = [...ejercicios];
                            nuevosEjercicios[index] = {
                              ...ejercicio,
                              series: nuevasSeries,
                            };
                            setEjercicios(nuevosEjercicios);
                            if (sesion) {
                              onSesionChange({
                                ...sesion,
                                ejercicios: nuevosEjercicios,
                              });
                            }
                          }}
                          className="w-16 px-2 py-1 border border-gray-300 rounded text-center"
                          placeholder="Seg"
                        />
                        <span className="text-gray-500">s</span>
                      </div>
                    ))}
                    <button
                      onClick={() => {
                        const nuevasSeries = [
                          ...(ejercicio.series || []),
                          {
                            id: `serie-${Date.now()}`,
                            repeticiones: 10,
                            peso: 0,
                            descanso: 60,
                            rpe: 6,
                          },
                        ];
                        const nuevosEjercicios = [...ejercicios];
                        nuevosEjercicios[index] = {
                          ...ejercicio,
                          series: nuevasSeries,
                        };
                        setEjercicios(nuevosEjercicios);
                        if (sesion) {
                          onSesionChange({
                            ...sesion,
                            ejercicios: nuevosEjercicios,
                          });
                        }
                      }}
                      className="text-xs text-blue-600 hover:text-blue-700 mt-1"
                    >
                      + Agregar serie
                    </button>
                  </div>

                  {/* Notas rápidas al cliente */}
                  <div className="mt-2">
                    <input
                      type="text"
                      placeholder="Notas rápidas al cliente (se ven en su app)..."
                      className="w-full px-2 py-1 text-xs border border-gray-300 rounded"
                      title="Notas que el cliente verá en su app"
                    />
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

