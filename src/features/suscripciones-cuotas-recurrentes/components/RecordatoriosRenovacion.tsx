import React, { useState, useEffect } from 'react';
import { Card, Table, Badge, Button, Input, Select } from '../../../components/componentsreutilizables';
import {
  getRecordatorios,
  getSuscripcionesParaRecordatorio,
  enviarRecordatorioRenovacion,
  verificarYEnviarRecordatorios,
  getConfiguracionRecordatorios,
  actualizarConfiguracionRecordatorios,
} from '../api/recordatoriosRenovacion';
import { getSuscripciones } from '../api/suscripciones';
import { RecordatorioRenovacion, Suscripcion, ConfiguracionRecordatorios } from '../types';
import { Bell, Send, RefreshCw, Settings, Mail, MessageSquare, Phone, CheckCircle, AlertCircle } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';

export const RecordatoriosRenovacion: React.FC = () => {
  const { user } = useAuth();
  const [recordatorios, setRecordatorios] = useState<RecordatorioRenovacion[]>([]);
  const [suscripciones, setSuscripciones] = useState<Suscripcion[]>([]);
  const [loading, setLoading] = useState(true);
  const [suscripcionSeleccionada, setSuscripcionSeleccionada] = useState<Suscripcion | null>(null);
  const [mostrarConfiguracion, setMostrarConfiguracion] = useState(false);
  const [configuracion, setConfiguracion] = useState<ConfiguracionRecordatorios | null>(null);
  const [diasAnticipacion, setDiasAnticipacion] = useState<number>(7);
  const [canalesSeleccionados, setCanalesSeleccionados] = useState<('email' | 'sms' | 'whatsapp')[]>(['email']);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [recs, subs] = await Promise.all([
        getRecordatorios(),
        getSuscripcionesParaRecordatorio(user?.id, 30),
      ]);
      setRecordatorios(recs);
      setSuscripciones(subs);
    } catch (error) {
      console.error('Error cargando datos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEnviarRecordatorio = async (suscripcion: Suscripcion) => {
    try {
      await enviarRecordatorioRenovacion({
        suscripcionId: suscripcion.id,
        diasAnticipacion,
        canales: canalesSeleccionados,
      });
      await loadData();
      alert('Recordatorio enviado correctamente');
    } catch (error) {
      console.error('Error enviando recordatorio:', error);
      alert('Error al enviar el recordatorio');
    }
  };

  const handleEnviarTodos = async () => {
    try {
      const enviados = await verificarYEnviarRecordatorios(user?.id);
      await loadData();
      alert(`${enviados.length} recordatorios enviados correctamente`);
    } catch (error) {
      console.error('Error enviando recordatorios:', error);
      alert('Error al enviar los recordatorios');
    }
  };

  const handleConfigurar = async (suscripcion: Suscripcion) => {
    setSuscripcionSeleccionada(suscripcion);
    const config = await getConfiguracionRecordatorios(suscripcion.id);
    setConfiguracion(config);
    setMostrarConfiguracion(true);
  };

  const handleGuardarConfiguracion = async () => {
    if (!suscripcionSeleccionada || !configuracion) return;
    
    try {
      await actualizarConfiguracionRecordatorios(configuracion);
      setMostrarConfiguracion(false);
      setSuscripcionSeleccionada(null);
      alert('Configuración guardada correctamente');
    } catch (error) {
      console.error('Error guardando configuración:', error);
      alert('Error al guardar la configuración');
    }
  };

  const getEstadoBadge = (estado: string) => {
    const estados: Record<string, { label: string; color: 'success' | 'warning' | 'error' | 'info'; icon: React.ReactNode }> = {
      pendiente: { label: 'Pendiente', color: 'warning', icon: <Bell className="w-4 h-4" /> },
      enviado: { label: 'Enviado', color: 'success', icon: <CheckCircle className="w-4 h-4" /> },
      fallido: { label: 'Fallido', color: 'error', icon: <AlertCircle className="w-4 h-4" /> },
    };
    
    const estadoData = estados[estado] || estados.pendiente;
    return (
      <Badge color={estadoData.color} className="flex items-center gap-1">
        {estadoData.icon}
        {estadoData.label}
      </Badge>
    );
  };

  const getCanalesBadges = (canales: string[]) => {
    const iconos: Record<string, React.ReactNode> = {
      email: <Mail className="w-3 h-3" />,
      sms: <MessageSquare className="w-3 h-3" />,
      whatsapp: <Phone className="w-3 h-3" />,
    };
    
    return (
      <div className="flex gap-1">
        {canales.map(canal => (
          <span key={canal} className="text-xs text-gray-600" title={canal}>
            {iconos[canal] || canal}
          </span>
        ))}
      </div>
    );
  };

  const columns = [
    {
      key: 'clienteNombre',
      label: 'Cliente',
      render: (value: string, row: RecordatorioRenovacion) => (
        <div>
          <div className="font-medium text-gray-900">{value}</div>
          <div className="text-sm text-gray-500">{row.clienteEmail}</div>
        </div>
      ),
    },
    {
      key: 'fechaRenovacion',
      label: 'Fecha Renovación',
      render: (value: string) => (
        <span className="text-base text-gray-900">
          {new Date(value).toLocaleDateString('es-ES')}
        </span>
      ),
    },
    {
      key: 'diasAnticipacion',
      label: 'Días Anticipación',
      render: (value: number) => (
        <span className="text-base text-gray-900">{value} días</span>
      ),
    },
    {
      key: 'monto',
      label: 'Monto',
      render: (value: number) => (
        <span className="text-base font-semibold text-gray-900">{value} €</span>
      ),
    },
    {
      key: 'canalesEnvio',
      label: 'Canales',
      render: (value: string[]) => getCanalesBadges(value),
    },
    {
      key: 'estado',
      label: 'Estado',
      render: (value: string) => getEstadoBadge(value),
    },
    {
      key: 'fechaEnvio',
      label: 'Fecha Envío',
      render: (value?: string) => (
        value ? (
          <span className="text-sm text-gray-600">
            {new Date(value).toLocaleDateString('es-ES')}
          </span>
        ) : (
          <span className="text-sm text-gray-400">-</span>
        )
      ),
    },
  ];

  const suscripcionesPendientes = suscripciones.filter(s => {
    if (!s.proximaRenovacion) return false;
    const hoy = new Date();
    const fechaRenovacion = new Date(s.proximaRenovacion);
    const diffDias = Math.ceil((fechaRenovacion.getTime() - hoy.getTime()) / (1000 * 60 * 60 * 24));
    return diffDias >= 0 && diffDias <= 7;
  });

  return (
    <div className="space-y-6">
      {/* Resumen */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-white shadow-sm p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Suscripciones por Renovar</p>
              <p className="text-2xl font-semibold text-gray-900 mt-1">
                {suscripcionesPendientes.length}
              </p>
            </div>
            <Bell className="w-8 h-8 text-blue-600" />
          </div>
        </Card>
        
        <Card className="bg-white shadow-sm p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Recordatorios Enviados</p>
              <p className="text-2xl font-semibold text-gray-900 mt-1">
                {recordatorios.filter(r => r.estado === 'enviado').length}
              </p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
        </Card>
        
        <Card className="bg-white shadow-sm p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pendientes</p>
              <p className="text-2xl font-semibold text-gray-900 mt-1">
                {recordatorios.filter(r => r.estado === 'pendiente').length}
              </p>
            </div>
            <AlertCircle className="w-8 h-8 text-yellow-600" />
          </div>
        </Card>
      </div>

      {/* Acciones */}
      <Card className="bg-white shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-gray-900">
            Enviar Recordatorios
          </h3>
          <div className="flex gap-2">
            <Button
              variant="primary"
              size="sm"
              onClick={handleEnviarTodos}
            >
              <Send className="w-4 h-4 mr-2" />
              Enviar Todos Automáticamente
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={loadData}
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Actualizar
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Días de Anticipación
            </label>
            <Input
              type="number"
              value={diasAnticipacion}
              onChange={(e) => setDiasAnticipacion(Number(e.target.value))}
              min={1}
              max={30}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Canales de Envío
            </label>
            <div className="flex gap-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={canalesSeleccionados.includes('email')}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setCanalesSeleccionados([...canalesSeleccionados, 'email']);
                    } else {
                      setCanalesSeleccionados(canalesSeleccionados.filter(c => c !== 'email'));
                    }
                  }}
                  className="w-4 h-4 text-blue-600 rounded"
                />
                <Mail className="w-4 h-4" />
                Email
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={canalesSeleccionados.includes('sms')}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setCanalesSeleccionados([...canalesSeleccionados, 'sms']);
                    } else {
                      setCanalesSeleccionados(canalesSeleccionados.filter(c => c !== 'sms'));
                    }
                  }}
                  className="w-4 h-4 text-blue-600 rounded"
                />
                <MessageSquare className="w-4 h-4" />
                SMS
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={canalesSeleccionados.includes('whatsapp')}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setCanalesSeleccionados([...canalesSeleccionados, 'whatsapp']);
                    } else {
                      setCanalesSeleccionados(canalesSeleccionados.filter(c => c !== 'whatsapp'));
                    }
                  }}
                  className="w-4 h-4 text-blue-600 rounded"
                />
                <Phone className="w-4 h-4" />
                WhatsApp
              </label>
            </div>
          </div>
        </div>

        {/* Lista de suscripciones pendientes */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-700">Suscripciones Próximas a Renovar</h4>
          {suscripcionesPendientes.length === 0 ? (
            <p className="text-sm text-gray-500">No hay suscripciones próximas a renovar</p>
          ) : (
            <div className="space-y-2">
              {suscripcionesPendientes.map(suscripcion => {
                const fechaRenovacion = new Date(suscripcion.proximaRenovacion!);
                const hoy = new Date();
                const diffDias = Math.ceil((fechaRenovacion.getTime() - hoy.getTime()) / (1000 * 60 * 60 * 24));
                
                return (
                  <div
                    key={suscripcion.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">{suscripcion.clienteNombre}</div>
                      <div className="text-sm text-gray-600">
                        Renovación: {fechaRenovacion.toLocaleDateString('es-ES')} ({diffDias} días)
                      </div>
                      <div className="text-sm font-semibold text-gray-900">
                        {suscripcion.precio} €
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleConfigurar(suscripcion)}
                      >
                        <Settings className="w-4 h-4 mr-2" />
                        Configurar
                      </Button>
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => handleEnviarRecordatorio(suscripcion)}
                      >
                        <Send className="w-4 h-4 mr-2" />
                        Enviar Ahora
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </Card>

      {/* Historial de recordatorios */}
      <Card className="bg-white shadow-sm p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">
          Historial de Recordatorios
        </h3>
        <Table
          data={recordatorios}
          columns={columns}
          loading={loading}
          emptyMessage="No hay recordatorios enviados"
        />
      </Card>

      {/* Modal de configuración */}
      {mostrarConfiguracion && suscripcionSeleccionada && configuracion && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="bg-white p-6 max-w-2xl w-full mx-4">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Configurar Recordatorios - {suscripcionSeleccionada.clienteNombre}
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="flex items-center gap-2 mb-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={configuracion.activo}
                    onChange={(e) => {
                      setConfiguracion({ ...configuracion, activo: e.target.checked });
                    }}
                    className="w-4 h-4 text-blue-600 rounded"
                  />
                  <span className="text-sm font-medium text-gray-700">
                    Activar recordatorios automáticos
                  </span>
                </label>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Días de Anticipación (separados por comas)
                </label>
                <Input
                  type="text"
                  value={configuracion.diasAnticipacion.join(', ')}
                  onChange={(e) => {
                    const dias = e.target.value.split(',').map(d => parseInt(d.trim())).filter(d => !isNaN(d));
                    setConfiguracion({ ...configuracion, diasAnticipacion: dias });
                  }}
                  placeholder="7, 3, 1"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Canales de Envío
                </label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={configuracion.canalesEnvio.includes('email')}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setConfiguracion({
                            ...configuracion,
                            canalesEnvio: [...configuracion.canalesEnvio, 'email'],
                          });
                        } else {
                          setConfiguracion({
                            ...configuracion,
                            canalesEnvio: configuracion.canalesEnvio.filter(c => c !== 'email'),
                          });
                        }
                      }}
                      className="w-4 h-4 text-blue-600 rounded"
                    />
                    <Mail className="w-4 h-4" />
                    Email
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={configuracion.canalesEnvio.includes('sms')}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setConfiguracion({
                            ...configuracion,
                            canalesEnvio: [...configuracion.canalesEnvio, 'sms'],
                          });
                        } else {
                          setConfiguracion({
                            ...configuracion,
                            canalesEnvio: configuracion.canalesEnvio.filter(c => c !== 'sms'),
                          });
                        }
                      }}
                      className="w-4 h-4 text-blue-600 rounded"
                    />
                    <MessageSquare className="w-4 h-4" />
                    SMS
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={configuracion.canalesEnvio.includes('whatsapp')}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setConfiguracion({
                            ...configuracion,
                            canalesEnvio: [...configuracion.canalesEnvio, 'whatsapp'],
                          });
                        } else {
                          setConfiguracion({
                            ...configuracion,
                            canalesEnvio: configuracion.canalesEnvio.filter(c => c !== 'whatsapp'),
                          });
                        }
                      }}
                      className="w-4 h-4 text-blue-600 rounded"
                    />
                    <Phone className="w-4 h-4" />
                    WhatsApp
                  </label>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end gap-2 mt-6">
              <Button
                variant="secondary"
                onClick={() => {
                  setMostrarConfiguracion(false);
                  setSuscripcionSeleccionada(null);
                }}
              >
                Cancelar
              </Button>
              <Button
                variant="primary"
                onClick={handleGuardarConfiguracion}
              >
                Guardar
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

