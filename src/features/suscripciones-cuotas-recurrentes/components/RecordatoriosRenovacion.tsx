import React, { useState, useEffect } from 'react';
import { Card, Button, Table, Badge, Input, Select, Switch } from '../../../components/componentsreutilizables';
import {
  getConfiguracionRecordatorios,
  guardarConfiguracionRecordatorios,
  registrarEnvioRecordatorioRenovacion,
  getRecordatorios,
} from '../api/recordatoriosRenovacion';
import { getSuscripciones } from '../api/suscripciones';
import { RecordatorioRenovacion, ConfiguracionRecordatorios, Suscripcion } from '../types';
import { 
  Bell, 
  Mail, 
  MessageSquare, 
  Phone, 
  CheckCircle, 
  AlertCircle, 
  Settings,
  Save,
  RefreshCw,
  Clock,
} from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';

export const RecordatoriosRenovacion: React.FC = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  
  // Configuración global
  const [configuracionGlobal, setConfiguracionGlobal] = useState<ConfiguracionRecordatorios>({
    activo: true,
    diasAnticipacion: [7, 3, 1],
    canalesEnvio: ['email'],
  });
  
  // Configuraciones por plan
  const [configuracionesPorPlan, setConfiguracionesPorPlan] = useState<Map<string, ConfiguracionRecordatorios>>(new Map());
  
  // Configuraciones por suscripción
  const [configuracionesPorSuscripcion, setConfiguracionesPorSuscripcion] = useState<Map<string, ConfiguracionRecordatorios>>(new Map());
  
  // Historial de envíos
  const [historialEnvios, setHistorialEnvios] = useState<RecordatorioRenovacion[]>([]);
  
  // Suscripciones disponibles
  const [suscripciones, setSuscripciones] = useState<Suscripcion[]>([]);
  
  // Estados para UI
  const [mostrarConfiguracionPlan, setMostrarConfiguracionPlan] = useState(false);
  const [planSeleccionado, setPlanSeleccionado] = useState<string>('');
  const [suscripcionSeleccionada, setSuscripcionSeleccionada] = useState<Suscripcion | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      // Cargar configuración global
      const configGlobal = await getConfiguracionRecordatorios();
      if (configGlobal) {
        setConfiguracionGlobal(configGlobal);
      }
      
      // Cargar suscripciones
      const subs = await getSuscripciones(user?.role === 'entrenador' ? 'entrenador' : 'gimnasio', user?.id);
      setSuscripciones(subs);
      
      // Cargar historial de envíos recientes (últimos 10)
      const recordatorios = await getRecordatorios();
      const recientes = recordatorios
        .filter(r => r.estado === 'enviado')
        .sort((a, b) => {
          const fechaA = a.ultimoEnvio || a.fechaEnvio || '';
          const fechaB = b.ultimoEnvio || b.fechaEnvio || '';
          return fechaB.localeCompare(fechaA);
        })
        .slice(0, 10);
      setHistorialEnvios(recientes);
      
      // Cargar configuraciones por suscripción
      const configsMap = new Map<string, ConfiguracionRecordatorios>();
      for (const sub of subs) {
        const config = await getConfiguracionRecordatorios(sub.id);
        if (config && config.suscripcionId) {
          configsMap.set(sub.id, config);
        }
      }
      setConfiguracionesPorSuscripcion(configsMap);
    } catch (error) {
      console.error('Error cargando datos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGuardarConfiguracionGlobal = async () => {
    try {
      await guardarConfiguracionRecordatorios(configuracionGlobal);
      alert('Configuración global guardada correctamente');
    } catch (error) {
      console.error('Error guardando configuración:', error);
      alert('Error al guardar la configuración');
    }
  };

  const handleGuardarConfiguracionPlan = async (planId: string, config: ConfiguracionRecordatorios) => {
    try {
      await guardarConfiguracionRecordatorios({ ...config, planId });
      const nuevasConfigs = new Map(configuracionesPorPlan);
      nuevasConfigs.set(planId, config);
      setConfiguracionesPorPlan(nuevasConfigs);
      alert('Configuración del plan guardada correctamente');
    } catch (error) {
      console.error('Error guardando configuración:', error);
      alert('Error al guardar la configuración');
    }
  };

  const handleGuardarConfiguracionSuscripcion = async (suscripcionId: string, config: ConfiguracionRecordatorios) => {
    try {
      await guardarConfiguracionRecordatorios({ ...config, suscripcionId });
      const nuevasConfigs = new Map(configuracionesPorSuscripcion);
      nuevasConfigs.set(suscripcionId, config);
      setConfiguracionesPorSuscripcion(nuevasConfigs);
      alert('Configuración de la suscripción guardada correctamente');
    } catch (error) {
      console.error('Error guardando configuración:', error);
      alert('Error al guardar la configuración');
    }
  };

  const handleAgregarDia = (dias: number[]) => {
    const nuevoDia = Math.max(...dias, 0) + 1;
    if (nuevoDia <= 30 && !dias.includes(nuevoDia)) {
      return [...dias, nuevoDia].sort((a, b) => b - a);
    }
    return dias;
  };

  const handleEliminarDia = (dias: number[], diaAEliminar: number) => {
    return dias.filter(d => d !== diaAEliminar);
  };

  const handleToggleCanal = (canales: ('email' | 'sms' | 'whatsapp')[], canal: 'email' | 'sms' | 'whatsapp') => {
    if (canales.includes(canal)) {
      return canales.filter(c => c !== canal);
    } else {
      return [...canales, canal];
    }
  };

  const getPlanesUnicos = () => {
    const planes = new Map<string, { id: string; nombre: string; nivel?: string }>();
    suscripciones.forEach(sub => {
      if (sub.planId && sub.planNombre) {
        planes.set(sub.planId, {
          id: sub.planId,
          nombre: sub.planNombre,
          nivel: sub.nivelPlan,
        });
      }
    });
    return Array.from(planes.values());
  };

  const getEstadoBadge = (estado: string) => {
    const estados: Record<string, { label: string; variant: 'green' | 'yellow' | 'red' | 'blue'; icon: React.ReactNode }> = {
      pendiente: { label: 'Pendiente', variant: 'yellow', icon: <Bell className="w-3 h-3" /> },
      enviado: { label: 'Enviado', variant: 'green', icon: <CheckCircle className="w-3 h-3" /> },
      fallido: { label: 'Fallido', variant: 'red', icon: <AlertCircle className="w-3 h-3" /> },
    };
    
    const estadoData = estados[estado] || estados.pendiente;
    return (
      <Badge variant={estadoData.variant} size="sm" className="flex items-center gap-1">
        {estadoData.icon}
        {estadoData.label}
      </Badge>
    );
  };

  const getCanalIcon = (canal: string) => {
    const iconos: Record<string, React.ReactNode> = {
      email: <Mail className="w-4 h-4" />,
      sms: <MessageSquare className="w-4 h-4" />,
      whatsapp: <Phone className="w-4 h-4" />,
    };
    return iconos[canal] || <Bell className="w-4 h-4" />;
  };

  const columnsHistorial = [
    {
      key: 'clienteNombre',
      label: 'Cliente',
      render: (value: string, row: RecordatorioRenovacion) => (
        <div>
          <div className="font-medium text-gray-900">{value || `Cliente ${row.clienteId}`}</div>
          <div className="text-sm text-gray-500">{row.clienteEmail || '-'}</div>
        </div>
      ),
    },
    {
      key: 'canal',
      label: 'Canal',
      render: (value: string) => (
        <div className="flex items-center gap-2">
          {getCanalIcon(value)}
          <span className="text-sm text-gray-700 capitalize">{value}</span>
        </div>
      ),
    },
    {
      key: 'diasAntes',
      label: 'Días Antes',
      render: (value: number, row: RecordatorioRenovacion) => {
        const dias = value || row.diasAnticipacion || 0;
        return (
          <span className="text-sm text-gray-700">{dias} días</span>
        );
      },
    },
    {
      key: 'ultimoEnvio',
      label: 'Último Envío',
      render: (value?: string) => (
        value ? (
          <div className="flex items-center gap-1 text-sm text-gray-600">
            <Clock className="w-3 h-3" />
            {new Date(value).toLocaleDateString('es-ES', { 
              day: '2-digit', 
              month: 'short', 
              hour: '2-digit', 
              minute: '2-digit' 
            })}
          </div>
        ) : (
          <span className="text-sm text-gray-400">-</span>
        )
      ),
    },
    {
      key: 'estado',
      label: 'Estado',
      render: (value: string) => getEstadoBadge(value),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Configuración Global */}
      <Card className="bg-white shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Settings className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900">
                Configuración Global de Recordatorios
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                Configuración predeterminada para todas las suscripciones
              </p>
            </div>
          </div>
          <Button
            variant="primary"
            size="sm"
            onClick={handleGuardarConfiguracionGlobal}
            leftIcon={<Save className="w-4 h-4" />}
          >
            Guardar
          </Button>
        </div>

        <div className="space-y-6">
          {/* Toggle activación global */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <label className="text-sm font-medium text-gray-900">
                Activar recordatorios automáticos
              </label>
              <p className="text-xs text-gray-600 mt-1">
                Los recordatorios se enviarán automáticamente según la configuración
              </p>
            </div>
            <Switch
              checked={configuracionGlobal.activo}
              onChange={(checked) => setConfiguracionGlobal({ ...configuracionGlobal, activo: checked })}
              size="md"
            />
          </div>

          {/* Días antes de renovación */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Días antes de la renovación
            </label>
            <div className="space-y-3">
              {configuracionGlobal.diasAnticipacion.map((dia, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="flex-1">
                    <Input
                      type="number"
                      value={dia}
                      onChange={(e) => {
                        const nuevoValor = parseInt(e.target.value) || 0;
                        if (nuevoValor >= 1 && nuevoValor <= 30) {
                          const nuevosDias = [...configuracionGlobal.diasAnticipacion];
                          nuevosDias[index] = nuevoValor;
                          nuevosDias.sort((a, b) => b - a);
                          setConfiguracionGlobal({ ...configuracionGlobal, diasAnticipacion: nuevosDias });
                        }
                      }}
                      min={1}
                      max={30}
                      className="w-full"
                    />
                  </div>
                  <span className="text-sm text-gray-600">días antes</span>
                  {configuracionGlobal.diasAnticipacion.length > 1 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        const nuevosDias = handleEliminarDia(configuracionGlobal.diasAnticipacion, dia);
                        setConfiguracionGlobal({ ...configuracionGlobal, diasAnticipacion: nuevosDias });
                      }}
                    >
                      ×
                    </Button>
                  )}
                </div>
              ))}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  const nuevosDias = handleAgregarDia(configuracionGlobal.diasAnticipacion);
                  setConfiguracionGlobal({ ...configuracionGlobal, diasAnticipacion: nuevosDias });
                }}
                disabled={configuracionGlobal.diasAnticipacion.length >= 5}
              >
                + Agregar día
              </Button>
            </div>
          </div>

          {/* Canales de envío */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Canales de envío disponibles
            </label>
            <div className="flex gap-4">
              {(['email', 'sms', 'whatsapp'] as const).map((canal) => (
                <label
                  key={canal}
                  className="flex items-center gap-2 cursor-pointer p-3 border-2 rounded-lg transition-colors"
                  style={{
                    borderColor: configuracionGlobal.canalesEnvio.includes(canal)
                      ? 'rgb(37, 99, 235)'
                      : 'rgb(229, 231, 235)',
                    backgroundColor: configuracionGlobal.canalesEnvio.includes(canal)
                      ? 'rgb(239, 246, 255)'
                      : 'transparent',
                  }}
                >
                  <input
                    type="checkbox"
                    checked={configuracionGlobal.canalesEnvio.includes(canal)}
                    onChange={() => {
                      const nuevosCanales = handleToggleCanal(configuracionGlobal.canalesEnvio, canal);
                      setConfiguracionGlobal({ ...configuracionGlobal, canalesEnvio: nuevosCanales });
                    }}
                    className="w-4 h-4 text-blue-600 rounded"
                  />
                  {getCanalIcon(canal)}
                  <span className="text-sm font-medium text-gray-700 capitalize">{canal}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </Card>

      {/* Configuración por Plan */}
      <Card className="bg-white shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Settings className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900">
                Configuración por Nivel de Plan
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                Personaliza recordatorios según el nivel del plan (Básico, Premium, VIP)
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {getPlanesUnicos().map((plan) => {
            const configPlan = configuracionesPorPlan.get(plan.id) || {
              planId: plan.id,
              activo: configuracionGlobal.activo,
              diasAnticipacion: [...configuracionGlobal.diasAnticipacion],
              canalesEnvio: [...configuracionGlobal.canalesEnvio],
            };

            return (
              <div key={plan.id} className="p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h4 className="font-medium text-gray-900">{plan.nombre}</h4>
                    {plan.nivel && (
                      <span className="text-xs text-gray-600 capitalize">{plan.nivel}</span>
                    )}
                  </div>
                  <Switch
                    checked={configPlan.activo}
                    onChange={(checked) => {
                      const nuevaConfig = { ...configPlan, activo: checked };
                      handleGuardarConfiguracionPlan(plan.id, nuevaConfig);
                    }}
                    size="sm"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-2">
                      Días antes
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {configPlan.diasAnticipacion.map((dia, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium"
                        >
                          {dia} días
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-2">
                      Canales
                    </label>
                    <div className="flex gap-2">
                      {configPlan.canalesEnvio.map((canal) => (
                        <div key={canal} className="flex items-center gap-1">
                          {getCanalIcon(canal)}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Configuración por Suscripción */}
      <Card className="bg-white shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <Bell className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900">
                Recordatorios Configurados por Suscripción
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                Lista de suscripciones con configuración personalizada
              </p>
            </div>
          </div>
          <Button
            variant="secondary"
            size="sm"
            onClick={loadData}
            leftIcon={<RefreshCw className="w-4 h-4" />}
          >
            Actualizar
          </Button>
        </div>

        <div className="space-y-3">
          {suscripciones.length === 0 ? (
            <p className="text-sm text-gray-500 text-center py-4">
              No hay suscripciones disponibles
            </p>
          ) : (
            suscripciones.slice(0, 5).map((sub) => {
              const configSub = configuracionesPorSuscripcion.get(sub.id);
              if (!configSub) return null;

              return (
                <div
                  key={sub.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">{sub.clienteNombre}</div>
                    <div className="text-sm text-gray-600">{sub.planNombre}</div>
                    <div className="flex items-center gap-4 mt-2">
                      <div className="flex items-center gap-1">
                        <span className="text-xs text-gray-600">Días:</span>
                        <span className="text-xs font-medium text-gray-900">
                          {configSub.diasAnticipacion.join(', ')}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-xs text-gray-600">Canales:</span>
                        <div className="flex gap-1">
                          {configSub.canalesEnvio.map((canal) => getCanalIcon(canal))}
                        </div>
                      </div>
                      <Badge
                        variant={configSub.activo ? 'green' : 'gray'}
                        size="sm"
                      >
                        {configSub.activo ? 'Activo' : 'Inactivo'}
                      </Badge>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setSuscripcionSeleccionada(sub);
                      setMostrarConfiguracionPlan(true);
                    }}
                  >
                    <Settings className="w-4 h-4" />
                  </Button>
                </div>
              );
            })
          )}
        </div>
      </Card>

      {/* Historial de Envíos Recientes */}
      <Card className="bg-white shadow-sm p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-orange-100 rounded-lg">
            <Clock className="w-5 h-5 text-orange-600" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-900">
              Historial de Envíos Recientes
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              Últimos recordatorios enviados (últimos 10)
            </p>
          </div>
        </div>

        {historialEnvios.length === 0 ? (
          <div className="text-center py-8">
            <Bell className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-sm text-gray-500">
              No hay recordatorios enviados recientemente
            </p>
          </div>
        ) : (
          <Table
            data={historialEnvios}
            columns={columnsHistorial}
            loading={loading}
            emptyMessage="No hay recordatorios enviados"
          />
        )}
      </Card>
    </div>
  );
};
