import React, { useState, useEffect } from 'react';
import { Card, Button, Modal } from '../../../components/componentsreutilizables';
import { Input } from '../../../components/componentsreutilizables/Input';
import { Clock, Plus, Trash2, Save, AlertCircle, CheckCircle } from 'lucide-react';
import { getHorarioSemanal, guardarHorarioSemanal, crearBloqueHorario, validarBloqueHorario, validarBloquesNoSolapados, HorarioSemanal, HorarioDia, HorarioDisponible } from '../api/schedules';
import { GestionFechasNoDisponibles } from './GestionFechasNoDisponibles';
import { ConfiguracionDuracionesSesion } from './ConfiguracionDuracionesSesion';

interface ConfiguracionHorariosProps {
  entrenadorId: string;
}

const DIAS_SEMANA: HorarioDia['dia'][] = ['lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado', 'domingo'];
const DIAS_NOMBRES: Record<HorarioDia['dia'], string> = {
  lunes: 'Lunes',
  martes: 'Martes',
  miércoles: 'Miércoles',
  jueves: 'Jueves',
  viernes: 'Viernes',
  sábado: 'Sábado',
  domingo: 'Domingo',
};

export const ConfiguracionHorarios: React.FC<ConfiguracionHorariosProps> = ({ entrenadorId }) => {
  const [horario, setHorario] = useState<HorarioSemanal | null>(null);
  const [loading, setLoading] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [mensajeExito, setMensajeExito] = useState<string | null>(null);
  const [errores, setErrores] = useState<Record<string, string>>({});

  useEffect(() => {
    cargarHorario();
  }, [entrenadorId]);

  const cargarHorario = async () => {
    setLoading(true);
    try {
      const horarioData = await getHorarioSemanal(entrenadorId);
      setHorario(horarioData);
    } catch (error) {
      console.error('Error cargando horario:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleDiaDisponible = (dia: HorarioDia['dia']) => {
    if (!horario) return;

    const nuevosHorarios = horario.horariosPorDia.map(h => {
      if (h.dia === dia) {
        return {
          ...h,
          disponible: !h.disponible,
          horarios: !h.disponible ? h.horarios : [], // Limpiar horarios si se desactiva el día
        };
      }
      return h;
    });

    setHorario({
      ...horario,
      horariosPorDia: nuevosHorarios,
    });
    setErrores({});
  };

  const agregarBloqueHorario = (dia: HorarioDia['dia']) => {
    if (!horario) return;

    const nuevoBloque: HorarioDisponible = { horaInicio: '09:00', horaFin: '18:00' };
    const nuevosHorarios = horario.horariosPorDia.map(h => {
      if (h.dia === dia) {
        return {
          ...h,
          horarios: [...h.horarios, nuevoBloque],
        };
      }
      return h;
    });

    setHorario({
      ...horario,
      horariosPorDia: nuevosHorarios,
    });
    setErrores({});
  };

  const eliminarBloqueHorario = (dia: HorarioDia['dia'], indice: number) => {
    if (!horario) return;

    const nuevosHorarios = horario.horariosPorDia.map(h => {
      if (h.dia === dia) {
        return {
          ...h,
          horarios: h.horarios.filter((_, i) => i !== indice),
        };
      }
      return h;
    });

    setHorario({
      ...horario,
      horariosPorDia: nuevosHorarios,
    });
    setErrores({});
  };

  const actualizarBloqueHorario = (
    dia: HorarioDia['dia'],
    indice: number,
    campo: 'horaInicio' | 'horaFin',
    valor: string
  ) => {
    if (!horario) return;

    const nuevosHorarios = horario.horariosPorDia.map(h => {
      if (h.dia === dia) {
        const nuevosBloques = h.horarios.map((bloque, i) => {
          if (i === indice) {
            return { ...bloque, [campo]: valor };
          }
          return bloque;
        });
        return { ...h, horarios: nuevosBloques };
      }
      return h;
    });

    setHorario({
      ...horario,
      horariosPorDia: nuevosHorarios,
    });
    setErrores({});
  };

  const validarHorario = (): boolean => {
    if (!horario) return false;

    const nuevosErrores: Record<string, string> = {};

    horario.horariosPorDia.forEach(horarioDia => {
      if (horarioDia.disponible) {
        // Validar que tenga al menos un bloque horario
        if (horarioDia.horarios.length === 0) {
          nuevosErrores[`${horarioDia.dia}-sin-bloques`] = `${DIAS_NOMBRES[horarioDia.dia]}: Debe tener al menos un bloque horario`;
        }

        // Validar cada bloque
        horarioDia.horarios.forEach((bloque, indice) => {
          if (!validarBloqueHorario(bloque)) {
            nuevosErrores[`${horarioDia.dia}-${indice}`] = `${DIAS_NOMBRES[horarioDia.dia]}: La hora de fin debe ser posterior a la hora de inicio`;
          }
        });

        // Validar que no haya solapamientos
        if (!validarBloquesNoSolapados(horarioDia.horarios)) {
          nuevosErrores[`${horarioDia.dia}-solapamiento`] = `${DIAS_NOMBRES[horarioDia.dia]}: Los bloques horarios no pueden solaparse`;
        }
      }
    });

    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const guardarHorario = async () => {
    if (!horario) return;

    if (!validarHorario()) {
      return;
    }

    setGuardando(true);
    try {
      await guardarHorarioSemanal(horario);
      setMensajeExito('Horario guardado correctamente');
      setTimeout(() => setMensajeExito(null), 3000);
    } catch (error) {
      console.error('Error guardando horario:', error);
      setErrores({ general: 'Error al guardar el horario. Por favor, intenta de nuevo.' });
    } finally {
      setGuardando(false);
    }
  };

  const toggleActivo = () => {
    if (!horario) return;
    setHorario({ ...horario, activo: !horario.activo });
  };

  if (loading) {
    return (
      <Card className="p-8 text-center bg-white shadow-sm">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Cargando horario...</p>
      </Card>
    );
  }

  if (!horario) {
    return (
      <Card className="p-8 text-center bg-white shadow-sm">
        <p className="text-gray-600">Error al cargar el horario</p>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="bg-white shadow-sm">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Clock className="w-6 h-6 text-blue-600" />
              <div>
                <h3 className="text-xl font-bold text-gray-900">Configuración de Horarios Disponibles</h3>
                <p className="text-sm text-gray-600 mt-1">
                  Configura los horarios en los que estarás disponible para sesiones 1 a 1
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={horario.activo}
                  onChange={toggleActivo}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-gray-700">Horario activo</span>
              </label>
              <Button
                variant="primary"
                onClick={guardarHorario}
                disabled={guardando}
                iconLeft={Save}
              >
                {guardando ? 'Guardando...' : 'Guardar Horario'}
              </Button>
            </div>
          </div>

          {mensajeExito && (
            <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <p className="text-sm text-green-800">{mensajeExito}</p>
            </div>
          )}

          {errores.general && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-600" />
              <p className="text-sm text-red-800">{errores.general}</p>
            </div>
          )}

          <div className="space-y-4">
            {DIAS_SEMANA.map(dia => {
              const horarioDia = horario.horariosPorDia.find(h => h.dia === dia);
              if (!horarioDia) return null;

              const errorDia = Object.keys(errores).find(key => key.startsWith(dia));
              const mensajeError = errorDia ? errores[errorDia] : null;

              return (
                <div key={dia} className="border rounded-lg p-4 bg-gray-50">
                  <div className="flex items-center justify-between mb-3">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={horarioDia.disponible}
                        onChange={() => toggleDiaDisponible(dia)}
                        className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                      />
                      <span className="text-lg font-semibold text-gray-900">
                        {DIAS_NOMBRES[dia]}
                      </span>
                    </label>
                    {horarioDia.disponible && (
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => agregarBloqueHorario(dia)}
                        iconLeft={Plus}
                      >
                        Agregar Bloque
                      </Button>
                    )}
                  </div>

                  {mensajeError && (
                    <div className="mb-3 p-2 bg-red-50 border border-red-200 rounded text-sm text-red-700">
                      {mensajeError}
                    </div>
                  )}

                  {horarioDia.disponible && (
                    <div className="space-y-3">
                      {horarioDia.horarios.length === 0 ? (
                        <p className="text-sm text-gray-500 italic">
                          No hay bloques horarios configurados. Agrega uno para este día.
                        </p>
                      ) : (
                        horarioDia.horarios.map((bloque, indice) => (
                          <div key={indice} className="flex items-center gap-3 p-3 bg-white rounded border">
                            <div className="flex items-center gap-2 flex-1">
                              <label className="text-sm text-gray-700">Desde:</label>
                              <input
                                type="time"
                                value={bloque.horaInicio}
                                onChange={(e) => actualizarBloqueHorario(dia, indice, 'horaInicio', e.target.value)}
                                className="px-3 py-1.5 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                              />
                              <label className="text-sm text-gray-700 ml-4">Hasta:</label>
                              <input
                                type="time"
                                value={bloque.horaFin}
                                onChange={(e) => actualizarBloqueHorario(dia, indice, 'horaFin', e.target.value)}
                                className="px-3 py-1.5 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                              />
                            </div>
                            {horarioDia.horarios.length > 1 && (
                              <button
                                onClick={() => eliminarBloqueHorario(dia, indice)}
                                className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                                title="Eliminar bloque"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        ))
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </Card>

      {/* Gestión de Fechas No Disponibles */}
      <GestionFechasNoDisponibles entrenadorId={entrenadorId} />

      {/* Configuración de Duraciones de Sesión */}
      <ConfiguracionDuracionesSesion entrenadorId={entrenadorId} />
    </div>
  );
};

