/**
 * Componente para gestionar automatizaciones recurrentes
 * User Story: Como coach quiero programar automatizaciones recurrentes (p. ej. cada lunes recalcular objetivos,
 * cada semana refrescar finisher), para mantener el plan actualizado automáticamente.
 */

import { useState, useEffect } from 'react';
import {
  Plus,
  Edit2,
  Trash2,
  Save,
  X,
  AlertCircle,
  CheckCircle2,
  Clock,
  Play,
  Pause,
  Calendar,
  Repeat,
} from 'lucide-react';
import { Button, Card, Input, Select, Modal, Badge } from '../../../components/componentsreutilizables';
import {
  obtenerAutomatizaciones,
  crearAutomatizacion,
  actualizarAutomatizacion,
  eliminarAutomatizacion,
  formatearFrecuencia,
  ejecutarAutomatizacion,
} from '../utils/recurringAutomations';
import type {
  AutomatizacionRecurrente,
  ConfiguracionRecurrencia,
  AccionAutomatizacion,
  FrecuenciaRecurrencia,
  TipoAccionAutomatizacion,
  DiaSemana,
} from '../types';

export function AutomatizacionesRecurrentes() {
  const [automatizaciones, setAutomatizaciones] = useState<AutomatizacionRecurrente[]>([]);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [automatizacionEditando, setAutomatizacionEditando] = useState<AutomatizacionRecurrente | null>(null);
  const [cargando, setCargando] = useState(false);

  useEffect(() => {
    cargarAutomatizaciones();
    // Recargar cada minuto para actualizar próximas ejecuciones
    const interval = setInterval(cargarAutomatizaciones, 60000);
    return () => clearInterval(interval);
  }, []);

  const cargarAutomatizaciones = () => {
    const automatizacionesCargadas = obtenerAutomatizaciones();
    setAutomatizaciones(automatizacionesCargadas);
  };

  const handleNuevaAutomatizacion = () => {
    setAutomatizacionEditando(null);
    setMostrarModal(true);
  };

  const handleEditarAutomatizacion = (automatizacion: AutomatizacionRecurrente) => {
    setAutomatizacionEditando(automatizacion);
    setMostrarModal(true);
  };

  const handleEliminarAutomatizacion = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar esta automatización?')) return;

    const exito = eliminarAutomatizacion(id);
    if (exito) {
      cargarAutomatizaciones();
    }
  };

  const handleToggleActiva = async (automatizacion: AutomatizacionRecurrente) => {
    const actualizada = actualizarAutomatizacion(automatizacion.id, {
      activa: !automatizacion.activa,
    });
    if (actualizada) {
      cargarAutomatizaciones();
    }
  };

  const handleEjecutarAhora = async (automatizacion: AutomatizacionRecurrente) => {
    if (!confirm('¿Ejecutar esta automatización ahora?')) return;

    setCargando(true);
    try {
      const resultado = await ejecutarAutomatizacion(automatizacion);
      if (resultado.exito) {
        alert('Automatización ejecutada correctamente');
        cargarAutomatizaciones();
      } else {
        alert(`Error al ejecutar: ${resultado.error}`);
      }
    } catch (error) {
      console.error('Error ejecutando automatización:', error);
      alert('Error al ejecutar la automatización');
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Automatizaciones Recurrentes</h2>
          <p className="text-gray-600 mt-1">
            Programa automatizaciones recurrentes para mantener los planes actualizados automáticamente.
            Ej: cada lunes recalcular objetivos, cada semana refrescar finisher.
          </p>
        </div>
        <Button onClick={handleNuevaAutomatizacion} className="flex items-center gap-2">
          <Plus size={18} />
          Nueva Automatización
        </Button>
      </div>

      {automatizaciones.length === 0 ? (
        <Card className="p-12 text-center">
          <Repeat className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No hay automatizaciones recurrentes
          </h3>
          <p className="text-gray-600 mb-4">
            Crea tu primera automatización para mantener los planes actualizados automáticamente.
          </p>
          <Button onClick={handleNuevaAutomatizacion}>Crear Primera Automatización</Button>
        </Card>
      ) : (
        <div className="grid gap-4">
          {automatizaciones.map((automatizacion) => (
            <Card key={automatizacion.id} className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{automatizacion.nombre}</h3>
                    <Badge
                      variant={automatizacion.activa ? 'success' : 'secondary'}
                      className="flex items-center gap-1"
                    >
                      {automatizacion.activa ? (
                        <>
                          <CheckCircle2 size={14} />
                          Activa
                        </>
                      ) : (
                        <>
                          <AlertCircle size={14} />
                          Inactiva
                        </>
                      )}
                    </Badge>
                  </div>
                  <p className="text-gray-600 mb-4">{automatizacion.descripcion}</p>

                  {/* Configuración de recurrencia */}
                  <div className="mb-4 flex items-center gap-4 text-sm text-gray-700">
                    <div className="flex items-center gap-2">
                      <Repeat size={16} className="text-gray-400" />
                      <span>
                        <strong>Frecuencia:</strong> {formatearFrecuencia(automatizacion.configuracion)}
                      </span>
                    </div>
                    {automatizacion.proximaEjecucion && (
                      <div className="flex items-center gap-2">
                        <Clock size={16} className="text-gray-400" />
                        <span>
                          <strong>Próxima ejecución:</strong>{' '}
                          {new Date(automatizacion.proximaEjecucion).toLocaleString('es-ES')}
                        </span>
                      </div>
                    )}
                    {automatizacion.ultimaEjecucion && (
                      <div className="flex items-center gap-2">
                        <Calendar size={16} className="text-gray-400" />
                        <span>
                          <strong>Última ejecución:</strong>{' '}
                          {new Date(automatizacion.ultimaEjecucion).toLocaleString('es-ES')}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Acciones */}
                  <div>
                    <h4 className="text-sm font-semibold text-gray-700 mb-2">Acciones:</h4>
                    <div className="space-y-2">
                      {automatizacion.acciones.map((accion, index) => (
                        <div key={index} className="text-sm text-gray-700">
                          <strong>{formatearTipoAccion(accion.tipo)}</strong>
                          {accion.programaId && (
                            <span className="text-gray-500 ml-2">(Programa: {accion.programaId})</span>
                          )}
                          {accion.clienteId && (
                            <span className="text-gray-500 ml-2">(Cliente: {accion.clienteId})</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Estadísticas */}
                  <div className="mt-4 flex items-center gap-4 text-xs text-gray-500">
                    <span>Ejecuciones: {automatizacion.totalEjecuciones}</span>
                    {automatizacion.errores > 0 && (
                      <span className="text-red-600">Errores: {automatizacion.errores}</span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 ml-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEjecutarAhora(automatizacion)}
                    disabled={cargando}
                    title="Ejecutar ahora"
                  >
                    <Play size={16} />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleToggleActiva(automatizacion)}
                  >
                    {automatizacion.activa ? <Pause size={16} /> : <Play size={16} />}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEditarAutomatizacion(automatizacion)}
                  >
                    <Edit2 size={16} />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEliminarAutomatizacion(automatizacion.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {mostrarModal && (
        <FormularioAutomatizacion
          automatizacion={automatizacionEditando}
          onClose={() => {
            setMostrarModal(false);
            setAutomatizacionEditando(null);
          }}
          onGuardar={() => {
            cargarAutomatizaciones();
            setMostrarModal(false);
            setAutomatizacionEditando(null);
          }}
        />
      )}
    </div>
  );
}

function FormularioAutomatizacion({
  automatizacion,
  onClose,
  onGuardar,
}: {
  automatizacion: AutomatizacionRecurrente | null;
  onClose: () => void;
  onGuardar: () => void;
}) {
  const [nombre, setNombre] = useState(automatizacion?.nombre || '');
  const [descripcion, setDescripcion] = useState(automatizacion?.descripcion || '');
  const [activa, setActiva] = useState(automatizacion?.activa ?? true);
  const [frecuencia, setFrecuencia] = useState<FrecuenciaRecurrencia>(
    automatizacion?.configuracion.frecuencia || 'semanal'
  );
  const [diaSemana, setDiaSemana] = useState<DiaSemana | undefined>(
    automatizacion?.configuracion.diaSemana
  );
  const [diaMes, setDiaMes] = useState<number | undefined>(
    automatizacion?.configuracion.diaMes
  );
  const [intervalo, setIntervalo] = useState<number | undefined>(
    automatizacion?.configuracion.intervalo
  );
  const [hora, setHora] = useState(automatizacion?.configuracion.hora || '08:00');
  const [fechaInicio, setFechaInicio] = useState(
    automatizacion?.configuracion.fechaInicio
      ? new Date(automatizacion.configuracion.fechaInicio).toISOString().split('T')[0]
      : ''
  );
  const [fechaFin, setFechaFin] = useState(
    automatizacion?.configuracion.fechaFin
      ? new Date(automatizacion.configuracion.fechaFin).toISOString().split('T')[0]
      : ''
  );
  const [acciones, setAcciones] = useState<AccionAutomatizacion[]>(
    automatizacion?.acciones || []
  );
  const [guardando, setGuardando] = useState(false);

  const handleAgregarAccion = () => {
    const nuevaAccion: AccionAutomatizacion = {
      tipo: 'recalcular_objetivos',
      parametros: {},
    };
    setAcciones([...acciones, nuevaAccion]);
  };

  const handleActualizarAccion = (
    index: number,
    actualizaciones: Partial<AccionAutomatizacion>
  ) => {
    setAcciones(acciones.map((a, i) => (i === index ? { ...a, ...actualizaciones } : a)));
  };

  const handleEliminarAccion = (index: number) => {
    setAcciones(acciones.filter((_, i) => i !== index));
  };

  const handleGuardar = async () => {
    if (!nombre.trim()) {
      alert('El nombre es obligatorio');
      return;
    }
    if (acciones.length === 0) {
      alert('Debes agregar al menos una acción');
      return;
    }

    setGuardando(true);
    try {
      const configuracion: ConfiguracionRecurrencia = {
        frecuencia,
        hora,
        fechaInicio: fechaInicio ? new Date(fechaInicio).toISOString() : undefined,
        fechaFin: fechaFin ? new Date(fechaFin).toISOString() : undefined,
        ...(frecuencia === 'semanal' && diaSemana && { diaSemana }),
        ...(frecuencia === 'mensual' && diaMes && { diaMes }),
        ...(frecuencia === 'personalizada' && intervalo && { intervalo }),
      };

      const datosAutomatizacion = {
        nombre: nombre.trim(),
        descripcion: descripcion.trim(),
        activa,
        configuracion,
        acciones,
        creadoPor: automatizacion?.creadoPor || 'usuario-actual',
      };

      if (automatizacion) {
        actualizarAutomatizacion(automatizacion.id, datosAutomatizacion);
      } else {
        crearAutomatizacion(datosAutomatizacion);
      }

      onGuardar();
    } catch (error) {
      console.error('Error guardando automatización:', error);
      alert('Error al guardar la automatización');
    } finally {
      setGuardando(false);
    }
  };

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title={automatizacion ? 'Editar Automatización' : 'Nueva Automatización'}
      size="lg"
    >
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nombre *
          </label>
          <Input
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            placeholder="Ej: Recalcular objetivos cada lunes"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Descripción
          </label>
          <Input
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            placeholder="Describe qué hace esta automatización"
          />
        </div>

        <div className="flex items-center">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={activa}
              onChange={(e) => setActiva(e.target.checked)}
              className="rounded"
            />
            <span className="text-sm font-medium text-gray-700">Activa</span>
          </label>
        </div>

        {/* Configuración de recurrencia */}
        <div className="space-y-4">
          <h4 className="text-sm font-semibold text-gray-700">Configuración de Recurrencia</h4>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Frecuencia *
            </label>
            <Select
              value={frecuencia}
              onChange={(e) => setFrecuencia(e.target.value as FrecuenciaRecurrencia)}
              options={[
                { value: 'diaria', label: 'Diaria' },
                { value: 'semanal', label: 'Semanal' },
                { value: 'mensual', label: 'Mensual' },
                { value: 'personalizada', label: 'Personalizada' },
              ]}
            />
          </div>

          {frecuencia === 'semanal' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Día de la semana *
              </label>
              <Select
                value={diaSemana || ''}
                onChange={(e) => setDiaSemana(e.target.value as DiaSemana)}
                options={[
                  { value: 'lunes', label: 'Lunes' },
                  { value: 'martes', label: 'Martes' },
                  { value: 'miercoles', label: 'Miércoles' },
                  { value: 'jueves', label: 'Jueves' },
                  { value: 'viernes', label: 'Viernes' },
                  { value: 'sabado', label: 'Sábado' },
                  { value: 'domingo', label: 'Domingo' },
                ]}
              />
            </div>
          )}

          {frecuencia === 'mensual' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Día del mes (1-31) *
              </label>
              <Input
                type="number"
                min="1"
                max="31"
                value={diaMes || ''}
                onChange={(e) => setDiaMes(parseInt(e.target.value) || undefined)}
                placeholder="Ej: 1"
              />
            </div>
          )}

          {frecuencia === 'personalizada' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Intervalo (días) *
              </label>
              <Input
                type="number"
                min="1"
                value={intervalo || ''}
                onChange={(e) => setIntervalo(parseInt(e.target.value) || undefined)}
                placeholder="Ej: 7 (cada 7 días)"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Hora (HH:mm) *
            </label>
            <Input
              type="time"
              value={hora}
              onChange={(e) => setHora(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fecha de inicio (opcional)
              </label>
              <Input
                type="date"
                value={fechaInicio}
                onChange={(e) => setFechaInicio(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fecha de fin (opcional)
              </label>
              <Input
                type="date"
                value={fechaFin}
                onChange={(e) => setFechaFin(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Acciones */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="block text-sm font-medium text-gray-700">
              Acciones *
            </label>
            <Button size="sm" variant="outline" onClick={handleAgregarAccion}>
              <Plus size={14} className="mr-1" />
              Agregar Acción
            </Button>
          </div>
          <div className="space-y-3">
            {acciones.map((accion, index) => (
              <Card key={index} className="p-4">
                <div className="grid grid-cols-12 gap-2 items-end">
                  <div className="col-span-6">
                    <Select
                      label="Tipo de acción"
                      value={accion.tipo}
                      onChange={(e) =>
                        handleActualizarAccion(index, {
                          tipo: e.target.value as TipoAccionAutomatizacion,
                        })
                      }
                      options={[
                        { value: 'recalcular_objetivos', label: 'Recalcular objetivos' },
                        { value: 'refrescar_finisher', label: 'Refrescar finisher' },
                        { value: 'actualizar_intensidad', label: 'Actualizar intensidad' },
                        { value: 'ajustar_volumen', label: 'Ajustar volumen' },
                        { value: 'aplicar_reglas', label: 'Aplicar reglas' },
                        { value: 'enviar_recordatorio', label: 'Enviar recordatorio' },
                        { value: 'generar_reporte', label: 'Generar reporte' },
                        { value: 'personalizada', label: 'Personalizada' },
                      ]}
                    />
                  </div>
                  <div className="col-span-3">
                    <Input
                      label="Programa ID (opcional)"
                      value={accion.programaId || ''}
                      onChange={(e) =>
                        handleActualizarAccion(index, {
                          programaId: e.target.value || undefined,
                        })
                      }
                      placeholder="ID del programa"
                    />
                  </div>
                  <div className="col-span-2">
                    <Input
                      label="Cliente ID (opcional)"
                      value={accion.clienteId || ''}
                      onChange={(e) =>
                        handleActualizarAccion(index, {
                          clienteId: e.target.value || undefined,
                        })
                      }
                      placeholder="ID del cliente"
                    />
                  </div>
                  <div className="col-span-1">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEliminarAccion(index)}
                      className="text-red-600"
                    >
                      <Trash2 size={14} />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            <X size={16} className="mr-2" />
            Cancelar
          </Button>
          <Button onClick={handleGuardar} disabled={guardando}>
            <Save size={16} className="mr-2" />
            {guardando ? 'Guardando...' : 'Guardar'}
          </Button>
        </div>
      </div>
    </Modal>
  );
}

function formatearTipoAccion(tipo: TipoAccionAutomatizacion): string {
  const map: Record<TipoAccionAutomatizacion, string> = {
    recalcular_objetivos: 'Recalcular objetivos',
    refrescar_finisher: 'Refrescar finisher',
    actualizar_intensidad: 'Actualizar intensidad',
    ajustar_volumen: 'Ajustar volumen',
    aplicar_reglas: 'Aplicar reglas',
    enviar_recordatorio: 'Enviar recordatorio',
    generar_reporte: 'Generar reporte',
    personalizada: 'Acción personalizada',
  };
  return map[tipo] || tipo;
}

