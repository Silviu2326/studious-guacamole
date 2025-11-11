import React, { useState, useEffect } from 'react';
import { Clock, Plus, Trash2, Copy, Save, FolderOpen, X, Check, AlertCircle } from 'lucide-react';
import { Card, Button, Input, Modal, Select } from '../../../components/componentsreutilizables';
import { HorarioTrabajoSemanal, HorarioTrabajoDia, RangoHorario, PlantillaHorario } from '../types';
import {
  getHorarioTrabajoActual,
  guardarHorarioTrabajo,
  getPlantillasHorario,
  guardarPlantillaHorario,
  eliminarPlantillaHorario,
  aplicarPlantillaHorario,
} from '../api/horariosTrabajo';

export const ConfiguradorHorariosTrabajo: React.FC = () => {
  const [horario, setHorario] = useState<HorarioTrabajoSemanal | null>(null);
  const [loading, setLoading] = useState(false);
  const [mostrarModalPlantilla, setMostrarModalPlantilla] = useState(false);
  const [mostrarModalGuardarPlantilla, setMostrarModalGuardarPlantilla] = useState(false);
  const [plantillas, setPlantillas] = useState<PlantillaHorario[]>([]);
  const [nombrePlantilla, setNombrePlantilla] = useState('');
  const [descripcionPlantilla, setDescripcionPlantilla] = useState('');
  const [diaOrigen, setDiaOrigen] = useState<number | null>(null);
  const [guardando, setGuardando] = useState(false);
  const [mensajeExito, setMensajeExito] = useState<string | null>(null);
  const [mensajeError, setMensajeError] = useState<string | null>(null);

  const diasSemana = [
    { value: 0, label: 'Domingo', short: 'Dom' },
    { value: 1, label: 'Lunes', short: 'Lun' },
    { value: 2, label: 'Martes', short: 'Mar' },
    { value: 3, label: 'Miércoles', short: 'Mié' },
    { value: 4, label: 'Jueves', short: 'Jue' },
    { value: 5, label: 'Viernes', short: 'Vie' },
    { value: 6, label: 'Sábado', short: 'Sáb' },
  ];

  useEffect(() => {
    cargarHorario();
    cargarPlantillas();
  }, []);

  const cargarHorario = async () => {
    setLoading(true);
    try {
      const horarioData = await getHorarioTrabajoActual();
      setHorario(horarioData);
    } catch (error) {
      console.error('Error cargando horario:', error);
      setMensajeError('Error al cargar el horario de trabajo');
    } finally {
      setLoading(false);
    }
  };

  const cargarPlantillas = async () => {
    try {
      const plantillasData = await getPlantillasHorario();
      setPlantillas(plantillasData);
    } catch (error) {
      console.error('Error cargando plantillas:', error);
    }
  };

  const agregarRango = (diaSemana: number) => {
    if (!horario) return;

    const nuevoRango: RangoHorario = {
      id: `rango-${Date.now()}-${Math.random()}`,
      horaInicio: '09:00',
      horaFin: '18:00',
    };

    const nuevosDias = horario.dias.map(dia => {
      if (dia.diaSemana === diaSemana) {
        return {
          ...dia,
          disponible: true,
          rangos: [...dia.rangos, nuevoRango],
        };
      }
      return dia;
    });

    setHorario({
      ...horario,
      dias: nuevosDias,
    });
  };

  const eliminarRango = (diaSemana: number, rangoId: string) => {
    if (!horario) return;

    const nuevosDias = horario.dias.map(dia => {
      if (dia.diaSemana === diaSemana) {
        const nuevosRangos = dia.rangos.filter(r => r.id !== rangoId);
        return {
          ...dia,
          rangos: nuevosRangos,
          disponible: nuevosRangos.length > 0 ? dia.disponible : false,
        };
      }
      return dia;
    });

    setHorario({
      ...horario,
      dias: nuevosDias,
    });
  };

  const actualizarRango = (diaSemana: number, rangoId: string, campo: 'horaInicio' | 'horaFin', valor: string) => {
    if (!horario) return;

    const nuevosDias = horario.dias.map(dia => {
      if (dia.diaSemana === diaSemana) {
        return {
          ...dia,
          rangos: dia.rangos.map(rango => {
            if (rango.id === rangoId) {
              return {
                ...rango,
                [campo]: valor,
              };
            }
            return rango;
          }),
        };
      }
      return dia;
    });

    setHorario({
      ...horario,
      dias: nuevosDias,
    });
  };

  const toggleDisponible = (diaSemana: number) => {
    if (!horario) return;

    const nuevosDias = horario.dias.map(dia => {
      if (dia.diaSemana === diaSemana) {
        return {
          ...dia,
          disponible: !dia.disponible,
        };
      }
      return dia;
    });

    setHorario({
      ...horario,
      dias: nuevosDias,
    });
  };

  const copiarHorario = (diaOrigen: number, diaDestino: number) => {
    if (!horario) return;

    const diaOrigenData = horario.dias.find(d => d.diaSemana === diaOrigen);
    if (!diaOrigenData) return;

    const nuevosDias = horario.dias.map(dia => {
      if (dia.diaSemana === diaDestino) {
        return {
          ...dia,
          disponible: diaOrigenData.disponible,
          rangos: diaOrigenData.rangos.map(rango => ({
            ...rango,
            id: `rango-${Date.now()}-${Math.random()}`,
          })),
        };
      }
      return dia;
    });

    setHorario({
      ...horario,
      dias: nuevosDias,
    });

    setDiaOrigen(null);
    setMensajeExito(`Horario copiado de ${diasSemana.find(d => d.value === diaOrigen)?.label} a ${diasSemana.find(d => d.value === diaDestino)?.label}`);
    setTimeout(() => setMensajeExito(null), 3000);
  };

  const guardarHorario = async () => {
    if (!horario) return;

    setGuardando(true);
    setMensajeError(null);
    try {
      await guardarHorarioTrabajo(horario);
      setMensajeExito('Horario guardado exitosamente');
      setTimeout(() => setMensajeExito(null), 3000);
    } catch (error) {
      console.error('Error guardando horario:', error);
      setMensajeError('Error al guardar el horario');
    } finally {
      setGuardando(false);
    }
  };

  const guardarComoPlantilla = async () => {
    if (!horario || !nombrePlantilla.trim()) {
      setMensajeError('El nombre de la plantilla es obligatorio');
      return;
    }

    setGuardando(true);
    setMensajeError(null);
    try {
      await guardarPlantillaHorario({
        nombre: nombrePlantilla,
        descripcion: descripcionPlantilla,
        horarioTrabajo: {
          dias: horario.dias,
        },
      });
      setMensajeExito('Plantilla guardada exitosamente');
      setMostrarModalGuardarPlantilla(false);
      setNombrePlantilla('');
      setDescripcionPlantilla('');
      cargarPlantillas();
      setTimeout(() => setMensajeExito(null), 3000);
    } catch (error) {
      console.error('Error guardando plantilla:', error);
      setMensajeError('Error al guardar la plantilla');
    } finally {
      setGuardando(false);
    }
  };

  const aplicarPlantilla = async (plantillaId: string) => {
    setGuardando(true);
    setMensajeError(null);
    try {
      const horarioAplicado = await aplicarPlantillaHorario(plantillaId);
      setHorario(horarioAplicado);
      setMostrarModalPlantilla(false);
      setMensajeExito('Plantilla aplicada exitosamente');
      setTimeout(() => setMensajeExito(null), 3000);
    } catch (error) {
      console.error('Error aplicando plantilla:', error);
      setMensajeError('Error al aplicar la plantilla');
    } finally {
      setGuardando(false);
    }
  };

  const eliminarPlantilla = async (plantillaId: string) => {
    if (!window.confirm('¿Estás seguro de que quieres eliminar esta plantilla?')) {
      return;
    }

    try {
      await eliminarPlantillaHorario(plantillaId);
      cargarPlantillas();
      setMensajeExito('Plantilla eliminada exitosamente');
      setTimeout(() => setMensajeExito(null), 3000);
    } catch (error) {
      console.error('Error eliminando plantilla:', error);
      setMensajeError('Error al eliminar la plantilla');
    }
  };

  const validarRango = (horaInicio: string, horaFin: string): boolean => {
    return horaInicio < horaFin;
  };

  if (loading) {
    return (
      <Card className="bg-white shadow-sm">
        <div className="p-8 text-center">
          <div className="text-gray-600">Cargando horarios...</div>
        </div>
      </Card>
    );
  }

  if (!horario) {
    return (
      <Card className="bg-white shadow-sm">
        <div className="p-8 text-center">
          <div className="text-gray-600">No se pudo cargar el horario</div>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-gray-900">Configurar Horarios de Trabajo</h3>
          <p className="text-sm text-gray-600 mt-1">
            Establece tus horarios de disponibilidad por día de la semana
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            onClick={() => setMostrarModalPlantilla(true)}
            className="flex items-center gap-2"
          >
            <FolderOpen className="w-4 h-4" />
            Cargar Plantilla
          </Button>
          <Button
            variant="secondary"
            onClick={() => setMostrarModalGuardarPlantilla(true)}
            className="flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            Guardar como Plantilla
          </Button>
          <Button
            variant="primary"
            onClick={guardarHorario}
            disabled={guardando}
            className="flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            {guardando ? 'Guardando...' : 'Guardar Horario'}
          </Button>
        </div>
      </div>

      {/* Mensajes de éxito/error */}
      {mensajeExito && (
        <div className="p-3 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2 text-green-800">
          <Check className="w-5 h-5" />
          <span className="text-sm">{mensajeExito}</span>
        </div>
      )}
      {mensajeError && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-800">
          <AlertCircle className="w-5 h-5" />
          <span className="text-sm">{mensajeError}</span>
        </div>
      )}

      {/* Configurador de horarios */}
      <Card className="bg-white shadow-sm">
        <div className="p-6">
          <div className="space-y-4">
            {horario.dias.map((dia) => {
              const diaInfo = diasSemana.find(d => d.value === dia.diaSemana);
              return (
                <div
                  key={dia.diaSemana}
                  className={`p-4 border rounded-lg ${
                    dia.disponible ? 'border-slate-200 bg-white' : 'border-slate-100 bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={dia.disponible}
                        onChange={() => toggleDisponible(dia.diaSemana)}
                        className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                      />
                      <h4 className="text-lg font-semibold text-gray-900">
                        {diaInfo?.label}
                      </h4>
                      {dia.disponible && dia.rangos.length > 0 && (
                        <span className="text-sm text-gray-600">
                          {dia.rangos.length} {dia.rangos.length === 1 ? 'rango' : 'rangos'}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      {diaOrigen === null && dia.disponible && dia.rangos.length > 0 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setDiaOrigen(dia.diaSemana)}
                          className="flex items-center gap-1"
                          title="Copiar horario de este día"
                        >
                          <Copy className="w-4 h-4" />
                          Copiar
                        </Button>
                      )}
                      {diaOrigen !== null && diaOrigen !== dia.diaSemana && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copiarHorario(diaOrigen, dia.diaSemana)}
                          className="flex items-center gap-1 text-blue-600"
                          title={`Pegar horario de ${diasSemana.find(d => d.value === diaOrigen)?.label}`}
                        >
                          <Check className="w-4 h-4" />
                          Pegar
                        </Button>
                      )}
                      {diaOrigen === dia.diaSemana && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setDiaOrigen(null)}
                          className="flex items-center gap-1"
                        >
                          <X className="w-4 h-4" />
                          Cancelar
                        </Button>
                      )}
                      {dia.disponible && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => agregarRango(dia.diaSemana)}
                          className="flex items-center gap-1"
                        >
                          <Plus className="w-4 h-4" />
                          Agregar Rango
                        </Button>
                      )}
                    </div>
                  </div>

                  {dia.disponible && (
                    <div className="space-y-3 mt-3">
                      {dia.rangos.length === 0 ? (
                        <div className="text-sm text-gray-500 italic">
                          No hay rangos de horario configurados. Haz clic en "Agregar Rango" para agregar uno.
                        </div>
                      ) : (
                        dia.rangos.map((rango, index) => {
                          const esValido = validarRango(rango.horaInicio, rango.horaFin);
                          return (
                            <div
                              key={rango.id}
                              className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg border border-slate-200"
                            >
                              <div className="flex items-center gap-2 flex-1">
                                <Clock className="w-4 h-4 text-gray-400" />
                                <Input
                                  type="time"
                                  value={rango.horaInicio}
                                  onChange={(e) =>
                                    actualizarRango(dia.diaSemana, rango.id, 'horaInicio', e.target.value)
                                  }
                                  className="w-32"
                                />
                                <span className="text-gray-600">-</span>
                                <Input
                                  type="time"
                                  value={rango.horaFin}
                                  onChange={(e) =>
                                    actualizarRango(dia.diaSemana, rango.id, 'horaFin', e.target.value)
                                  }
                                  className="w-32"
                                />
                                {!esValido && (
                                  <span className="text-xs text-red-600 flex items-center gap-1">
                                    <AlertCircle className="w-3 h-3" />
                                    Hora de inicio debe ser menor que hora de fin
                                  </span>
                                )}
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => eliminarRango(dia.diaSemana, rango.id)}
                                className="text-red-600 hover:text-red-700"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          );
                        })
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </Card>

      {/* Modal de plantillas */}
      <Modal
        isOpen={mostrarModalPlantilla}
        onClose={() => setMostrarModalPlantilla(false)}
        title="Cargar Plantilla de Horario"
        size="lg"
        footer={
          <Button variant="secondary" onClick={() => setMostrarModalPlantilla(false)}>
            Cerrar
          </Button>
        }
      >
        <div className="space-y-4">
          {plantillas.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No hay plantillas guardadas. Guarda una plantilla para poder usarla más tarde.
            </div>
          ) : (
            plantillas.map((plantilla) => (
              <div
                key={plantilla.id}
                className="p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 mb-1">{plantilla.nombre}</h4>
                    {plantilla.descripcion && (
                      <p className="text-sm text-gray-600 mb-2">{plantilla.descripcion}</p>
                    )}
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <span>
                        Creada: {new Date(plantilla.createdAt).toLocaleDateString('es-ES')}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => aplicarPlantilla(plantilla.id)}
                      disabled={guardando}
                    >
                      Aplicar
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => eliminarPlantilla(plantilla.id)}
                      className="text-red-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </Modal>

      {/* Modal de guardar plantilla */}
      <Modal
        isOpen={mostrarModalGuardarPlantilla}
        onClose={() => {
          setMostrarModalGuardarPlantilla(false);
          setNombrePlantilla('');
          setDescripcionPlantilla('');
          setMensajeError(null);
        }}
        title="Guardar como Plantilla"
        footer={
          <div className="flex gap-3">
            <Button
              variant="secondary"
              onClick={() => {
                setMostrarModalGuardarPlantilla(false);
                setNombrePlantilla('');
                setDescripcionPlantilla('');
                setMensajeError(null);
              }}
            >
              Cancelar
            </Button>
            <Button variant="primary" onClick={guardarComoPlantilla} disabled={guardando || !nombrePlantilla.trim()}>
              {guardando ? 'Guardando...' : 'Guardar'}
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          <Input
            label="Nombre de la Plantilla *"
            value={nombrePlantilla}
            onChange={(e) => setNombrePlantilla(e.target.value)}
            placeholder="Ej: Temporada Alta"
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Descripción (opcional)
            </label>
            <textarea
              value={descripcionPlantilla}
              onChange={(e) => setDescripcionPlantilla(e.target.value)}
              placeholder="Describe cuándo usar esta plantilla..."
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
            />
          </div>
        </div>
      </Modal>
    </div>
  );
};


