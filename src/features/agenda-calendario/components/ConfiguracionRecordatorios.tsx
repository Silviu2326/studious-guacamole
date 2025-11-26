import React, { useState, useEffect } from 'react';
import { Bell, MessageSquare, Mail, Smartphone, Save, Plus, Trash2, Eye, Users } from 'lucide-react';
import { Card, Button, Input, Select, Textarea, Badge, Modal } from '../../../components/componentsreutilizables';
import { Switch } from '../../../components/componentsreutilizables';
import type {
  ConfiguracionRecordatorios as ConfiguracionRecordatoriosData,
  RecordatorioConfiguracion,
  PreferenciasRecordatorioCliente,
  HistorialRecordatorio,
} from '../types';
import {
  getConfiguracionRecordatorios,
  actualizarConfiguracionRecordatorios,
  getTodasPreferenciasClientes,
  getHistorialRecordatorios,
  actualizarPreferenciasRecordatorioCliente,
} from '../api/recordatorios';
import { useAuth } from '../../../context/AuthContext';

export const ConfiguracionRecordatorios: React.FC = () => {
  const { user } = useAuth();
  const [configuracion, setConfiguracion] = useState<ConfiguracionRecordatoriosData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [mostrarPreferenciasClientes, setMostrarPreferenciasClientes] = useState(false);
  const [mostrarHistorial, setMostrarHistorial] = useState(false);
  const [preferenciasClientes, setPreferenciasClientes] = useState<PreferenciasRecordatorioCliente[]>([]);
  const [historial, setHistorial] = useState<HistorialRecordatorio[]>([]);
  const [editingCliente, setEditingCliente] = useState<PreferenciasRecordatorioCliente | null>(null);

  useEffect(() => {
    cargarConfiguracion();
    cargarPreferenciasClientes();
    cargarHistorial();
  }, []);

  const cargarConfiguracion = async () => {
    setLoading(true);
    try {
      const config = await getConfiguracionRecordatorios(user?.id);
      setConfiguracion(config);
    } catch (error) {
      console.error('Error cargando configuración:', error);
    } finally {
      setLoading(false);
    }
  };

  const cargarPreferenciasClientes = async () => {
    try {
      const prefs = await getTodasPreferenciasClientes();
      setPreferenciasClientes(prefs);
    } catch (error) {
      console.error('Error cargando preferencias:', error);
    }
  };

  const cargarHistorial = async () => {
    try {
      const hist = await getHistorialRecordatorios();
      setHistorial(hist);
    } catch (error) {
      console.error('Error cargando historial:', error);
    }
  };

  const guardarConfiguracion = async () => {
    if (!configuracion) return;
    setSaving(true);
    try {
      await actualizarConfiguracionRecordatorios(configuracion);
      alert('Configuración guardada exitosamente');
    } catch (error) {
      console.error('Error guardando configuración:', error);
      alert('Error al guardar la configuración');
    } finally {
      setSaving(false);
    }
  };

  const agregarRecordatorio = () => {
    if (!configuracion) return;
    const nuevoRecordatorio: RecordatorioConfiguracion = {
      id: `r-${Date.now()}`,
      tiempoAnticipacionHoras: 24,
      activo: true,
      canales: ['whatsapp'],
      orden: configuracion.recordatorios.length + 1,
    };
    setConfiguracion({
      ...configuracion,
      recordatorios: [...configuracion.recordatorios, nuevoRecordatorio],
    });
  };

  const eliminarRecordatorio = (id: string) => {
    if (!configuracion) return;
    setConfiguracion({
      ...configuracion,
      recordatorios: configuracion.recordatorios.filter((r) => r.id !== id),
    });
  };

  const actualizarRecordatorio = (id: string, updates: Partial<RecordatorioConfiguracion>) => {
    if (!configuracion) return;
    setConfiguracion({
      ...configuracion,
      recordatorios: configuracion.recordatorios.map((r) =>
        r.id === id ? { ...r, ...updates } : r
      ),
    });
  };

  const toggleCanal = (recordatorioId: string, canal: 'whatsapp' | 'sms' | 'email') => {
    if (!configuracion) return;
    const recordatorio = configuracion.recordatorios.find((r) => r.id === recordatorioId);
    if (!recordatorio) return;

    const canales = recordatorio.canales.includes(canal)
      ? recordatorio.canales.filter((c) => c !== canal)
      : [...recordatorio.canales, canal];

    actualizarRecordatorio(recordatorioId, { canales });
  };

  const getIconoCanal = (canal: string) => {
    switch (canal) {
      case 'whatsapp':
        return <MessageSquare className="w-4 h-4 text-green-600" />;
      case 'sms':
        return <Smartphone className="w-4 h-4 text-blue-600" />;
      case 'email':
        return <Mail className="w-4 h-4 text-red-600" />;
      default:
        return <Bell className="w-4 h-4 text-gray-600" />;
    }
  };

  if (loading) {
    return (
      <Card className="bg-white shadow-sm">
        <div className="p-6 text-center">Cargando...</div>
      </Card>
    );
  }

  if (!configuracion) {
    return (
      <Card className="bg-white shadow-sm">
        <div className="p-6 text-center">Error al cargar la configuración</div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Configuración principal */}
      <Card className="bg-white shadow-sm">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-bold text-gray-900">Recordatorios Automáticos</h3>
              <p className="text-sm text-gray-600 mt-1">
                Configura los recordatorios que se enviarán automáticamente a tus clientes
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Activar recordatorios</span>
                <Switch
                  checked={configuracion.activo}
                  onChange={(checked) =>
                    setConfiguracion({ ...configuracion, activo: checked })
                  }
                />
              </div>
              <Button
                variant="primary"
                onClick={guardarConfiguracion}
                disabled={saving}
              >
                <Save className="w-4 h-4 mr-2" />
                Guardar
              </Button>
            </div>
          </div>

          {configuracion.activo && (
            <>
              {/* Canal por defecto */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Canal por defecto
                </label>
                <Select
                  value={configuracion.canalPorDefecto}
                  onChange={(e) =>
                    setConfiguracion({
                      ...configuracion,
                      canalPorDefecto: e.target.value as 'whatsapp' | 'sms' | 'email',
                    })
                  }
                  options={[
                    { value: 'whatsapp', label: 'WhatsApp' },
                    { value: 'sms', label: 'SMS' },
                    { value: 'email', label: 'Email' },
                  ]}
                />
              </div>

              {/* Plantilla de mensaje */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Plantilla de mensaje
                </label>
                <Textarea
                  value={configuracion.plantillaMensaje}
                  onChange={(e) =>
                    setConfiguracion({
                      ...configuracion,
                      plantillaMensaje: e.target.value,
                    })
                  }
                  rows={4}
                  placeholder="Hola {nombre}, te recordamos que tienes una sesión el {fecha} a las {hora} en {lugar}. ¡Te esperamos!"
                />
                <p className="text-xs text-gray-500 mt-2">
                  Variables disponibles: {'{nombre}'}, {'{fecha}'}, {'{hora}'}, {'{lugar}'}, {'{titulo}'}
                </p>
              </div>

              {/* Recordatorios configurados */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Recordatorios configurados
                  </label>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={agregarRecordatorio}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Agregar
                  </Button>
                </div>
                <div className="space-y-4">
                  {configuracion.recordatorios.map((recordatorio) => (
                    <div
                      key={recordatorio.id}
                      className="p-4 border border-slate-200 rounded-lg"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Tiempo de anticipación (horas)
                            </label>
                            <Input
                              type="number"
                              value={recordatorio.tiempoAnticipacionHoras}
                              onChange={(e) =>
                                actualizarRecordatorio(recordatorio.id, {
                                  tiempoAnticipacionHoras: parseInt(e.target.value) || 0,
                                })
                              }
                              className="w-24"
                            />
                          </div>
                          <div className="flex items-center gap-2">
                            <Switch
                              checked={recordatorio.activo}
                              onChange={(checked) =>
                                actualizarRecordatorio(recordatorio.id, { activo: checked })
                              }
                            />
                            <span className="text-sm text-gray-600">Activo</span>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => eliminarRecordatorio(recordatorio.id)}
                        >
                          <Trash2 className="w-4 h-4 text-red-600" />
                        </Button>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Canales de envío
                        </label>
                        <div className="flex gap-4">
                          {(['whatsapp', 'sms', 'email'] as const).map((canal) => (
                            <button
                              key={canal}
                              type="button"
                              onClick={() => toggleCanal(recordatorio.id, canal)}
                              className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-colors ${
                                recordatorio.canales.includes(canal)
                                  ? 'bg-blue-50 border-blue-300 text-blue-700'
                                  : 'bg-white border-slate-200 text-gray-600 hover:bg-slate-50'
                              }`}
                            >
                              {getIconoCanal(canal)}
                              <span className="text-sm capitalize">{canal}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </Card>

      {/* Preferencias de clientes */}
      <Card className="bg-white shadow-sm">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-bold text-gray-900">Preferencias de Clientes</h3>
              <p className="text-sm text-gray-600 mt-1">
                Gestiona las preferencias de recordatorios por cliente
              </p>
            </div>
            <Button
              variant="secondary"
              onClick={() => setMostrarPreferenciasClientes(true)}
            >
              <Users className="w-4 h-4 mr-2" />
              Ver Clientes
            </Button>
          </div>
          <p className="text-sm text-gray-500">
            {preferenciasClientes.length === 0
              ? 'No hay preferencias de clientes configuradas'
              : `${preferenciasClientes.length} cliente(s) con preferencias configuradas`}
          </p>
        </div>
      </Card>

      {/* Historial de recordatorios */}
      <Card className="bg-white shadow-sm">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-bold text-gray-900">Historial de Recordatorios</h3>
              <p className="text-sm text-gray-600 mt-1">
                Ver el historial de recordatorios enviados
              </p>
            </div>
            <Button
              variant="secondary"
              onClick={() => setMostrarHistorial(true)}
            >
              <Eye className="w-4 h-4 mr-2" />
              Ver Historial
            </Button>
          </div>
          <p className="text-sm text-gray-500">
            {historial.length === 0
              ? 'No hay recordatorios enviados aún'
              : `${historial.length} recordatorio(s) enviado(s)`}
          </p>
        </div>
      </Card>

      {/* Modal de preferencias de clientes */}
      <Modal
        isOpen={mostrarPreferenciasClientes}
        onClose={() => setMostrarPreferenciasClientes(false)}
        title="Preferencias de Clientes"
        size="lg"
      >
        <div className="space-y-4">
          {preferenciasClientes.length === 0 ? (
            <p className="text-center text-gray-500 py-8">
              No hay preferencias de clientes configuradas. Las preferencias se crearán automáticamente cuando un cliente desactive los recordatorios.
            </p>
          ) : (
            preferenciasClientes.map((pref) => (
              <div
                key={pref.id}
                className="p-4 border border-slate-200 rounded-lg flex items-center justify-between"
              >
                <div>
                  <h4 className="font-semibold text-gray-900">{pref.clienteNombre || `Cliente ${pref.clienteId}`}</h4>
                  <p className="text-sm text-gray-600">
                    Recordatorios: {pref.recordatoriosDesactivados ? 'Desactivados' : 'Activados'}
                  </p>
                  {pref.canalPreferido && (
                    <p className="text-sm text-gray-600">
                      Canal preferido: {pref.canalPreferido}
                    </p>
                  )}
                </div>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setEditingCliente(pref)}
                >
                  Editar
                </Button>
              </div>
            ))
          )}
        </div>
      </Modal>

      {/* Modal de edición de preferencias de cliente */}
      {editingCliente && (
        <Modal
          isOpen={!!editingCliente}
          onClose={() => setEditingCliente(null)}
          title={`Editar Preferencias - ${editingCliente.clienteNombre || 'Cliente'}`}
          size="md"
          footer={
            <div className="flex gap-3">
              <Button
                variant="secondary"
                onClick={() => setEditingCliente(null)}
              >
                Cancelar
              </Button>
              <Button
                variant="primary"
                onClick={async () => {
                  if (editingCliente) {
                    await actualizarPreferenciasRecordatorioCliente(editingCliente);
                    await cargarPreferenciasClientes();
                    setEditingCliente(null);
                  }
                }}
              >
                Guardar
              </Button>
            </div>
          }
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Desactivar recordatorios</span>
              <Switch
                checked={editingCliente.recordatoriosDesactivados}
                onChange={(checked) =>
                  setEditingCliente({ ...editingCliente, recordatoriosDesactivados: checked })
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Canal preferido
              </label>
              <Select
                value={editingCliente.canalPreferido || 'whatsapp'}
                onChange={(e) =>
                  setEditingCliente({
                    ...editingCliente,
                    canalPreferido: e.target.value as 'whatsapp' | 'sms' | 'email',
                  })
                }
                options={[
                  { value: 'whatsapp', label: 'WhatsApp' },
                  { value: 'sms', label: 'SMS' },
                  { value: 'email', label: 'Email' },
                ]}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Teléfono (para WhatsApp/SMS)
              </label>
              <Input
                type="tel"
                value={editingCliente.telefono || ''}
                onChange={(e) =>
                  setEditingCliente({ ...editingCliente, telefono: e.target.value })
                }
                placeholder="+34 600 000 000"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email (para email)
              </label>
              <Input
                type="email"
                value={editingCliente.email || ''}
                onChange={(e) =>
                  setEditingCliente({ ...editingCliente, email: e.target.value })
                }
                placeholder="cliente@ejemplo.com"
              />
            </div>
          </div>
        </Modal>
      )}

      {/* Modal de historial */}
      <Modal
        isOpen={mostrarHistorial}
        onClose={() => setMostrarHistorial(false)}
        title="Historial de Recordatorios"
        size="lg"
      >
        <div className="space-y-4">
          {historial.length === 0 ? (
            <p className="text-center text-gray-500 py-8">
              No hay recordatorios en el historial aún.
            </p>
          ) : (
            historial.map((item) => (
              <div
                key={item.id}
                className="p-4 border border-slate-200 rounded-lg"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {getIconoCanal(item.tipo)}
                    <span className="font-semibold text-gray-900 capitalize">{item.tipo}</span>
                    <Badge color={item.enviado ? 'success' : 'warning'}>
                      {item.enviado ? 'Enviado' : 'Pendiente'}
                    </Badge>
                    {item.leido && (
                      <Badge color="info">Leído</Badge>
                    )}
                  </div>
                  <span className="text-sm text-gray-500">
                    {item.fechaEnvio.toLocaleString('es-ES')}
                  </span>
                </div>
                <p className="text-sm text-gray-700 mb-2">{item.mensaje}</p>
                <p className="text-xs text-gray-500">
                  Cliente: {item.clienteId} | {item.tiempoAnticipacionHoras}h antes
                </p>
              </div>
            ))
          )}
        </div>
      </Modal>
    </div>
  );
};

