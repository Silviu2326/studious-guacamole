import React, { useState, useEffect } from 'react';
import { Card, Button, Modal, Select, Input } from '../../../components/componentsreutilizables';
import {
  Calendar,
  Bell,
  ShoppingCart,
  ChefHat,
  Settings,
  Plus,
  CheckCircle2,
  Clock,
  AlertCircle,
  RefreshCw,
  Loader2,
  Trash2,
  Edit,
  Link as LinkIcon,
  Unlink,
} from 'lucide-react';
import type {
  RecordatorioCalendario,
  EventoCalendarioCliente,
  ConfiguracionCalendario,
  TipoRecordatorioCalendario,
  Dieta,
} from '../types';
import {
  getRecordatoriosCalendario,
  crearRecordatorioCalendario,
  actualizarRecordatorioCalendario,
  eliminarRecordatorioCalendario,
  generarRecordatoriosAutomaticos,
  getEventosCalendario,
  sincronizarCalendarioExterno,
  getConfiguracionCalendario,
  guardarConfiguracionCalendario,
} from '../api/calendarioCliente';

interface GestorCalendarioClienteProps {
  dieta: Dieta;
  clienteId: string;
  onRecordatoriosActualizados?: () => void;
}

const tiposRecordatorio: { value: TipoRecordatorioCalendario; label: string; icon: React.ReactNode }[] = [
  { value: 'preparacion', label: 'Preparación', icon: <ChefHat className="w-4 h-4" /> },
  { value: 'compra', label: 'Compra', icon: <ShoppingCart className="w-4 h-4" /> },
  { value: 'comida', label: 'Comida', icon: <ChefHat className="w-4 h-4" /> },
  { value: 'suplemento', label: 'Suplemento', icon: <Bell className="w-4 h-4" /> },
  { value: 'hidratacion', label: 'Hidratación', icon: <Bell className="w-4 h-4" /> },
];

export const GestorCalendarioCliente: React.FC<GestorCalendarioClienteProps> = ({
  dieta,
  clienteId,
  onRecordatoriosActualizados,
}) => {
  const [mostrarModal, setMostrarModal] = useState(false);
  const [mostrarConfiguracion, setMostrarConfiguracion] = useState(false);
  const [recordatorios, setRecordatorios] = useState<RecordatorioCalendario[]>([]);
  const [eventos, setEventos] = useState<EventoCalendarioCliente[]>([]);
  const [configuracion, setConfiguracion] = useState<ConfiguracionCalendario | null>(null);
  const [cargando, setCargando] = useState(false);
  const [sincronizando, setSincronizando] = useState(false);
  const [recordatorioEditando, setRecordatorioEditando] = useState<RecordatorioCalendario | null>(null);

  // Formulario
  const [tipo, setTipo] = useState<TipoRecordatorioCalendario>('preparacion');
  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [fechaRecordatorio, setFechaRecordatorio] = useState('');
  const [horaRecordatorio, setHoraRecordatorio] = useState('');
  const [antelacionDias, setAntelacionDias] = useState(2);

  useEffect(() => {
    cargarDatos();
  }, [dieta.id, clienteId]);

  const cargarDatos = async () => {
    setCargando(true);
    try {
      const [recs, evts, config] = await Promise.all([
        getRecordatoriosCalendario(dieta.id, clienteId),
        getEventosCalendario(dieta.id, clienteId),
        getConfiguracionCalendario(dieta.id, clienteId),
      ]);
      setRecordatorios(recs);
      setEventos(evts);
      setConfiguracion(config);
    } catch (error) {
      console.error('Error cargando datos:', error);
    } finally {
      setCargando(false);
    }
  };

  const handleCrearRecordatorio = async () => {
    try {
      const nuevoRecordatorio: Omit<RecordatorioCalendario, 'id' | 'creadoEn' | 'actualizadoEn'> = {
        dietaId: dieta.id,
        clienteId,
        tipo,
        titulo,
        descripcion,
        fechaRecordatorio: fechaRecordatorio || new Date().toISOString(),
        horaRecordatorio: horaRecordatorio || undefined,
        antelacionDias,
        activo: true,
        enviado: false,
        completado: false,
        creadoPor: 'user', // En producción usaría el ID del usuario actual
      };

      if (recordatorioEditando) {
        await actualizarRecordatorioCalendario(
          recordatorioEditando.id,
          dieta.id,
          clienteId,
          nuevoRecordatorio
        );
      } else {
        await crearRecordatorioCalendario(nuevoRecordatorio);
      }

      await cargarDatos();
      resetFormulario();
      setMostrarModal(false);
      onRecordatoriosActualizados?.();
    } catch (error) {
      console.error('Error guardando recordatorio:', error);
      alert('Error al guardar el recordatorio');
    }
  };

  const handleEliminar = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar este recordatorio?')) return;

    try {
      await eliminarRecordatorioCalendario(id, dieta.id, clienteId);
      await cargarDatos();
      onRecordatoriosActualizados?.();
    } catch (error) {
      console.error('Error eliminando recordatorio:', error);
    }
  };

  const handleCompletar = async (recordatorio: RecordatorioCalendario) => {
    try {
      await actualizarRecordatorioCalendario(recordatorio.id, dieta.id, clienteId, {
        completado: !recordatorio.completado,
        fechaCompletado: !recordatorio.completado ? new Date().toISOString() : undefined,
      });
      await cargarDatos();
      onRecordatoriosActualizados?.();
    } catch (error) {
      console.error('Error actualizando recordatorio:', error);
    }
  };

  const handleGenerarAutomaticos = async () => {
    try {
      await generarRecordatoriosAutomaticos(dieta.id, clienteId);
      await cargarDatos();
      alert('Recordatorios automáticos generados correctamente');
    } catch (error) {
      console.error('Error generando recordatorios:', error);
      alert('Error al generar recordatorios automáticos. Verifica la configuración.');
    }
  };

  const handleSincronizar = async () => {
    setSincronizando(true);
    try {
      await sincronizarCalendarioExterno(dieta.id, clienteId);
      await cargarDatos();
      alert('Calendario sincronizado correctamente');
    } catch (error) {
      console.error('Error sincronizando:', error);
      alert('Error al sincronizar. Verifica la configuración del calendario externo.');
    } finally {
      setSincronizando(false);
    }
  };

  const handleGuardarConfiguracion = async () => {
    if (!configuracion) return;
    try {
      await guardarConfiguracionCalendario(configuracion);
      setMostrarConfiguracion(false);
      alert('Configuración guardada');
    } catch (error) {
      console.error('Error guardando configuración:', error);
    }
  };

  const resetFormulario = () => {
    setTipo('preparacion');
    setTitulo('');
    setDescripcion('');
    setFechaRecordatorio('');
    setHoraRecordatorio('');
    setAntelacionDias(2);
    setRecordatorioEditando(null);
  };

  const abrirEditar = (recordatorio: RecordatorioCalendario) => {
    setRecordatorioEditando(recordatorio);
    setTipo(recordatorio.tipo);
    setTitulo(recordatorio.titulo);
    setDescripcion(recordatorio.descripcion);
    setFechaRecordatorio(recordatorio.fechaRecordatorio.split('T')[0]);
    setHoraRecordatorio(recordatorio.horaRecordatorio || '');
    setAntelacionDias(recordatorio.antelacionDias);
    setMostrarModal(true);
  };

  const recordatoriosProximos = recordatorios.filter((r) => {
    if (!r.activo || r.completado) return false;
    const fecha = new Date(r.fechaRecordatorio);
    const hoy = new Date();
    const diasDiferencia = Math.ceil((fecha.getTime() - hoy.getTime()) / (1000 * 60 * 60 * 24));
    return diasDiferencia >= 0 && diasDiferencia <= 7;
  });

  return (
    <div className="space-y-4">
      <Card className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-indigo-600" />
            <h3 className="text-lg font-semibold text-gray-900">
              Recordatorios de Calendario
            </h3>
          </div>
          <div className="flex gap-2">
            {configuracion?.calendarioExterno?.activo && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleSincronizar}
                disabled={sincronizando}
              >
                {sincronizando ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <RefreshCw className="w-4 h-4" />
                )}
                Sincronizar
              </Button>
            )}
            <Button variant="outline" size="sm" onClick={handleGenerarAutomaticos}>
              <Bell className="w-4 h-4" />
              Generar Automáticos
            </Button>
            <Button variant="outline" size="sm" onClick={() => setMostrarConfiguracion(true)}>
              <Settings className="w-4 h-4" />
              Configurar
            </Button>
            <Button
              size="sm"
              onClick={() => {
                resetFormulario();
                setMostrarModal(true);
              }}
            >
              <Plus className="w-4 h-4" />
              Nuevo Recordatorio
            </Button>
          </div>
        </div>

        <p className="text-sm text-gray-600 mb-4">
          Vincula el editor con el calendario del cliente para que reciba recordatorios de
          preparación o compra con antelación.
        </p>

        {/* Recordatorios próximos */}
        {recordatoriosProximos.length > 0 && (
          <div className="mb-4">
            <h4 className="text-sm font-medium text-gray-700 mb-2">
              Próximos Recordatorios (7 días)
            </h4>
            <div className="space-y-2">
              {recordatoriosProximos.map((recordatorio) => {
                const fecha = new Date(recordatorio.fechaRecordatorio);
                const diasRestantes = Math.ceil(
                  (fecha.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
                );

                return (
                  <div
                    key={recordatorio.id}
                    className={`flex items-center justify-between p-3 rounded-lg border ${
                      recordatorio.completado
                        ? 'bg-gray-50 border-gray-200'
                        : 'bg-blue-50 border-blue-200'
                    }`}
                  >
                    <div className="flex items-center gap-3 flex-1">
                      <div
                        className={`p-2 rounded ${
                          recordatorio.completado ? 'bg-gray-200' : 'bg-blue-100'
                        }`}
                      >
                        {tiposRecordatorio.find((t) => t.value === recordatorio.tipo)?.icon}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <p
                            className={`text-sm font-medium ${
                              recordatorio.completado ? 'text-gray-500 line-through' : 'text-gray-900'
                            }`}
                          >
                            {recordatorio.titulo}
                          </p>
                          {recordatorio.completado && (
                            <CheckCircle2 className="w-4 h-4 text-green-600" />
                          )}
                        </div>
                        <p className="text-xs text-gray-500">{recordatorio.descripcion}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Clock className="w-3 h-3 text-gray-400" />
                          <span className="text-xs text-gray-500">
                            {fecha.toLocaleDateString('es-ES')}
                            {recordatorio.horaRecordatorio && ` • ${recordatorio.horaRecordatorio}`}
                            {diasRestantes >= 0 && ` • ${diasRestantes} día${diasRestantes !== 1 ? 's' : ''}`}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleCompletar(recordatorio)}
                      >
                        {recordatorio.completado ? 'Desmarcar' : 'Completar'}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => abrirEditar(recordatorio)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEliminar(recordatorio.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Todos los recordatorios */}
        {recordatorios.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">Todos los Recordatorios</h4>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {recordatorios.map((recordatorio) => (
                <div
                  key={recordatorio.id}
                  className={`flex items-center justify-between p-2 rounded border ${
                    recordatorio.activo ? 'bg-white border-gray-200' : 'bg-gray-50 border-gray-200'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {tiposRecordatorio.find((t) => t.value === recordatorio.tipo)?.icon}
                    <div>
                      <p className="text-sm font-medium text-gray-900">{recordatorio.titulo}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(recordatorio.fechaRecordatorio).toLocaleDateString('es-ES')}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {!recordatorio.activo && (
                      <span className="text-xs text-gray-400">Inactivo</span>
                    )}
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => abrirEditar(recordatorio)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {recordatorios.length === 0 && (
          <div className="text-center py-8 text-sm text-gray-500">
            <Calendar className="w-8 h-8 mx-auto mb-2 text-gray-400" />
            <p>No hay recordatorios configurados</p>
            <p className="text-xs text-gray-400 mt-1">
              Crea recordatorios para preparación o compra
            </p>
          </div>
        )}

        {/* Eventos del calendario */}
        {eventos.length > 0 && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Eventos del Calendario</h4>
            <div className="space-y-2">
              {eventos.map((evento) => (
                <div
                  key={evento.id}
                  className="p-3 bg-purple-50 rounded-lg border border-purple-200"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{evento.titulo}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(evento.fechaInicio).toLocaleDateString('es-ES')}
                        {evento.fechaFin && ` - ${new Date(evento.fechaFin).toLocaleDateString('es-ES')}`}
                      </p>
                      {evento.impactoNutricional?.requiereAjuste && (
                        <p className="text-xs text-orange-600 mt-1">
                          Requiere ajuste nutricional
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </Card>

      {/* Modal de crear/editar recordatorio */}
      <Modal
        isOpen={mostrarModal}
        onClose={() => {
          setMostrarModal(false);
          resetFormulario();
        }}
        title={recordatorioEditando ? 'Editar Recordatorio' : 'Nuevo Recordatorio'}
        size="lg"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tipo</label>
            <Select
              value={tipo}
              onChange={(e) => setTipo(e.target.value as TipoRecordatorioCalendario)}
              options={tiposRecordatorio.map((t) => ({
                value: t.value,
                label: t.label,
              }))}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Título</label>
            <Input
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              placeholder="Ej: Preparar comida del lunes"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Descripción</label>
            <textarea
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              rows={3}
              placeholder="Descripción del recordatorio..."
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Fecha</label>
              <Input
                type="date"
                value={fechaRecordatorio}
                onChange={(e) => setFechaRecordatorio(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Hora</label>
              <Input
                type="time"
                value={horaRecordatorio}
                onChange={(e) => setHoraRecordatorio(e.target.value)}
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Antelación (días antes)
            </label>
            <Input
              type="number"
              value={antelacionDias}
              onChange={(e) => setAntelacionDias(parseInt(e.target.value) || 0)}
              min={0}
            />
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <Button
              variant="outline"
              onClick={() => {
                setMostrarModal(false);
                resetFormulario();
              }}
            >
              Cancelar
            </Button>
            <Button onClick={handleCrearRecordatorio}>Guardar</Button>
          </div>
        </div>
      </Modal>

      {/* Modal de configuración */}
      <Modal
        isOpen={mostrarConfiguracion}
        onClose={() => setMostrarConfiguracion(false)}
        title="Configuración de Calendario"
        size="lg"
      >
        {configuracion && (
          <div className="space-y-4">
            {/* Conexión con calendario externo */}
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="text-sm font-medium text-gray-900 mb-3">
                Conexión con Calendario Externo
              </h4>
              <div className="space-y-3">
                <div>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={configuracion.calendarioExterno?.activo || false}
                      onChange={(e) =>
                        setConfiguracion({
                          ...configuracion,
                          calendarioExterno: {
                            ...configuracion.calendarioExterno,
                            tipo: configuracion.calendarioExterno?.tipo || 'google-calendar',
                            activo: e.target.checked,
                          },
                        })
                      }
                    />
                    <span className="text-sm text-gray-700">Activar sincronización</span>
                  </label>
                </div>
                {configuracion.calendarioExterno?.activo && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tipo de Calendario
                    </label>
                    <Select
                      value={configuracion.calendarioExterno.tipo}
                      onChange={(e) =>
                        setConfiguracion({
                          ...configuracion,
                          calendarioExterno: {
                            ...configuracion.calendarioExterno!,
                            tipo: e.target.value as any,
                          },
                        })
                      }
                      options={[
                        { value: 'google-calendar', label: 'Google Calendar' },
                        { value: 'outlook', label: 'Outlook' },
                        { value: 'apple-calendar', label: 'Apple Calendar' },
                        { value: 'otro', label: 'Otro' },
                      ]}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Recordatorios automáticos */}
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="text-sm font-medium text-gray-900 mb-3">
                Recordatorios Automáticos
              </h4>
              <div className="space-y-3">
                <div>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={configuracion.recordatoriosAutomaticos.preparacionComidas.activo}
                      onChange={(e) =>
                        setConfiguracion({
                          ...configuracion,
                          recordatoriosAutomaticos: {
                            ...configuracion.recordatoriosAutomaticos,
                            preparacionComidas: {
                              ...configuracion.recordatoriosAutomaticos.preparacionComidas,
                              activo: e.target.checked,
                            },
                          },
                        })
                      }
                    />
                    <span className="text-sm text-gray-700">Recordatorios de preparación</span>
                  </label>
                  {configuracion.recordatoriosAutomaticos.preparacionComidas.activo && (
                    <div className="ml-6 mt-2 grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">Días antes</label>
                        <Input
                          type="number"
                          value={configuracion.recordatoriosAutomaticos.preparacionComidas.antelacionDias}
                          onChange={(e) =>
                            setConfiguracion({
                              ...configuracion,
                              recordatoriosAutomaticos: {
                                ...configuracion.recordatoriosAutomaticos,
                                preparacionComidas: {
                                  ...configuracion.recordatoriosAutomaticos.preparacionComidas,
                                  antelacionDias: parseInt(e.target.value) || 0,
                                },
                              },
                            })
                          }
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">Hora</label>
                        <Input
                          type="time"
                          value={configuracion.recordatoriosAutomaticos.preparacionComidas.horaRecordatorio}
                          onChange={(e) =>
                            setConfiguracion({
                              ...configuracion,
                              recordatoriosAutomaticos: {
                                ...configuracion.recordatoriosAutomaticos,
                                preparacionComidas: {
                                  ...configuracion.recordatoriosAutomaticos.preparacionComidas,
                                  horaRecordatorio: e.target.value,
                                },
                              },
                            })
                          }
                        />
                      </div>
                    </div>
                  )}
                </div>
                <div>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={configuracion.recordatoriosAutomaticos.listaCompra.activo}
                      onChange={(e) =>
                        setConfiguracion({
                          ...configuracion,
                          recordatoriosAutomaticos: {
                            ...configuracion.recordatoriosAutomaticos,
                            listaCompra: {
                              ...configuracion.recordatoriosAutomaticos.listaCompra,
                              activo: e.target.checked,
                            },
                          },
                        })
                      }
                    />
                    <span className="text-sm text-gray-700">Recordatorios de compra</span>
                  </label>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={() => setMostrarConfiguracion(false)}>
                Cancelar
              </Button>
              <Button onClick={handleGuardarConfiguracion}>Guardar</Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

