import React, { useState } from 'react';
import { Card, Button, Modal, Input, Checkbox, Textarea, Badge } from '../../../components/componentsreutilizables';
import { Bell, Settings, Mail, MessageSquare, Save, Loader2, Clock, CheckCircle2, XCircle } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { recordatoriosAutomaticosApi } from '../api';
import { ConfiguracionRecordatoriosPagos, RecordatorioEnviado } from '../types';

export const ConfiguracionRecordatorios: React.FC = () => {
  const { user } = useAuth();
  const [configuracion, setConfiguracion] = useState<ConfiguracionRecordatoriosPagos | null>(null);
  const [loading, setLoading] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [historial, setHistorial] = useState<RecordatorioEnviado[]>([]);
  const [mostrarHistorial, setMostrarHistorial] = useState(false);

  // Estados para edición
  const [activo, setActivo] = useState(false);
  const [diasAnticipacion, setDiasAnticipacion] = useState<number[]>([]);
  const [canalesEnvio, setCanalesEnvio] = useState<('whatsapp' | 'email')[]>([]);
  const [plantillaWhatsApp, setPlantillaWhatsApp] = useState('');
  const [plantillaEmailAsunto, setPlantillaEmailAsunto] = useState('');
  const [plantillaEmailCuerpo, setPlantillaEmailCuerpo] = useState('');

  React.useEffect(() => {
    cargarConfiguracion();
    cargarHistorial();
  }, []);

  const cargarConfiguracion = async () => {
    try {
      setLoading(true);
      const config = await recordatoriosAutomaticosApi.obtenerConfiguracion();
      setConfiguracion(config);
      setActivo(config.activo);
      setDiasAnticipacion([...config.diasAnticipacion]);
      setCanalesEnvio([...config.canalesEnvio]);
      setPlantillaWhatsApp(config.plantillaWhatsApp || '');
      setPlantillaEmailAsunto(config.plantillaEmail?.asunto || '');
      setPlantillaEmailCuerpo(config.plantillaEmail?.cuerpo || '');
    } catch (error) {
      console.error('Error cargando configuración:', error);
    } finally {
      setLoading(false);
    }
  };

  const cargarHistorial = async () => {
    try {
      const hist = await recordatoriosAutomaticosApi.obtenerHistorialRecordatorios();
      setHistorial(hist);
    } catch (error) {
      console.error('Error cargando historial:', error);
    }
  };

  const guardarConfiguracion = async () => {
    try {
      setGuardando(true);
      const configActualizada: ConfiguracionRecordatoriosPagos = {
        ...configuracion,
        activo,
        diasAnticipacion: [...diasAnticipacion].sort((a, b) => b - a), // Ordenar de mayor a menor
        canalesEnvio: [...canalesEnvio],
        plantillaWhatsApp,
        plantillaEmail: {
          asunto: plantillaEmailAsunto,
          cuerpo: plantillaEmailCuerpo,
        },
      };

      const guardada = await recordatoriosAutomaticosApi.guardarConfiguracion(configActualizada);
      setConfiguracion(guardada);
      alert('Configuración guardada correctamente');
    } catch (error) {
      console.error('Error guardando configuración:', error);
      alert('Error al guardar la configuración');
    } finally {
      setGuardando(false);
    }
  };

  const toggleDiaAnticipacion = (dia: number) => {
    if (diasAnticipacion.includes(dia)) {
      setDiasAnticipacion(diasAnticipacion.filter(d => d !== dia));
    } else {
      setDiasAnticipacion([...diasAnticipacion, dia].sort((a, b) => b - a));
    }
  };

  const toggleCanalEnvio = (canal: 'whatsapp' | 'email') => {
    if (canalesEnvio.includes(canal)) {
      setCanalesEnvio(canalesEnvio.filter(c => c !== canal));
    } else {
      setCanalesEnvio([...canalesEnvio, canal]);
    }
  };

  const getEstadoBadge = (estado: string) => {
    const variants = {
      enviado: { variant: 'green' as const, icon: <CheckCircle2 className="w-3 h-3" />, label: 'Enviado' },
      fallido: { variant: 'red' as const, icon: <XCircle className="w-3 h-3" />, label: 'Fallido' },
      pendiente: { variant: 'yellow' as const, icon: <Clock className="w-3 h-3" />, label: 'Pendiente' },
    };
    const config = variants[estado as keyof typeof variants] || variants.pendiente;
    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        {config.icon}
        {config.label}
      </Badge>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="bg-white shadow-sm">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <Settings className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  Configuración de Recordatorios Automáticos
                </h2>
                <p className="text-sm text-gray-600">
                  Configura recordatorios que se envían automáticamente antes del vencimiento de pagos
                </p>
              </div>
            </div>
            <Button
              variant="primary"
              onClick={guardarConfiguracion}
              loading={guardando}
              leftIcon={<Save className="w-4 h-4" />}
            >
              Guardar Configuración
            </Button>
          </div>

          {/* Activar/Desactivar */}
          <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-gray-900 flex items-center gap-2">
                  <Bell className="w-4 h-4" />
                  Activar Recordatorios Automáticos
                </label>
                <p className="text-xs text-gray-600 mt-1">
                  Cuando esté activo, los recordatorios se enviarán automáticamente según la configuración
                </p>
              </div>
              <Checkbox
                checked={activo}
                onChange={(e) => setActivo(e.target.checked)}
              />
            </div>
          </div>

          {/* Días de anticipación */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-900 mb-3">
              Días de Anticipación
            </label>
            <p className="text-xs text-gray-600 mb-3">
              Selecciona los días antes del vencimiento en los que se enviarán recordatorios
            </p>
            <div className="flex flex-wrap gap-2">
              {[1, 3, 7, 14, 30].map((dia) => (
                <button
                  key={dia}
                  type="button"
                  onClick={() => toggleDiaAnticipacion(dia)}
                  className={`px-4 py-2 rounded-lg border transition-all ${
                    diasAnticipacion.includes(dia)
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-white text-gray-700 border-gray-300 hover:border-blue-300'
                  }`}
                >
                  {dia} {dia === 1 ? 'día' : 'días'} antes
                </button>
              ))}
            </div>
            {diasAnticipacion.length > 0 && (
              <p className="text-xs text-gray-500 mt-2">
                Recordatorios configurados: {diasAnticipacion.join(', ')} días antes
              </p>
            )}
          </div>

          {/* Canales de envío */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-900 mb-3">
              Canales de Envío
            </label>
            <p className="text-xs text-gray-600 mb-3">
              Selecciona los canales por los que se enviarán los recordatorios
            </p>
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => toggleCanalEnvio('whatsapp')}
                className={`flex items-center gap-2 px-4 py-3 rounded-lg border transition-all ${
                  canalesEnvio.includes('whatsapp')
                    ? 'bg-green-50 text-green-700 border-green-300'
                    : 'bg-white text-gray-700 border-gray-300 hover:border-green-300'
                }`}
              >
                <MessageSquare className="w-5 h-5" />
                <span>WhatsApp</span>
                {canalesEnvio.includes('whatsapp') && (
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                )}
              </button>
              <button
                type="button"
                onClick={() => toggleCanalEnvio('email')}
                className={`flex items-center gap-2 px-4 py-3 rounded-lg border transition-all ${
                  canalesEnvio.includes('email')
                    ? 'bg-blue-50 text-blue-700 border-blue-300'
                    : 'bg-white text-gray-700 border-gray-300 hover:border-blue-300'
                }`}
              >
                <Mail className="w-5 h-5" />
                <span>Email</span>
                {canalesEnvio.includes('email') && (
                  <CheckCircle2 className="w-4 h-4 text-blue-600" />
                )}
              </button>
            </div>
          </div>

          {/* Plantilla WhatsApp */}
          {canalesEnvio.includes('whatsapp') && (
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Plantilla de WhatsApp
              </label>
              <p className="text-xs text-gray-600 mb-2">
                Usa las variables: {'{{nombre}}'}, {'{{monto}}'}, {'{{servicio}}'}, {'{{fechaVencimiento}}'}, {'{{diasRestantes}}'}
              </p>
              <Textarea
                value={plantillaWhatsApp}
                onChange={(e) => setPlantillaWhatsApp(e.target.value)}
                placeholder="Hola {{nombre}}, te recordamos que tienes un pago pendiente..."
                rows={6}
                className="font-mono text-sm"
              />
            </div>
          )}

          {/* Plantilla Email */}
          {canalesEnvio.includes('email') && (
            <div className="mb-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Asunto del Email
                </label>
                <Input
                  value={plantillaEmailAsunto}
                  onChange={(e) => setPlantillaEmailAsunto(e.target.value)}
                  placeholder="Recordatorio de pago pendiente - {{servicio}}"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Cuerpo del Email
                </label>
                <p className="text-xs text-gray-600 mb-2">
                  Usa las variables: {'{{nombre}}'}, {'{{monto}}'}, {'{{servicio}}'}, {'{{fechaVencimiento}}'}, {'{{diasRestantes}}'}
                </p>
                <Textarea
                  value={plantillaEmailCuerpo}
                  onChange={(e) => setPlantillaEmailCuerpo(e.target.value)}
                  placeholder="Hola {{nombre}}, te recordamos que tienes un pago pendiente..."
                  rows={8}
                  className="font-mono text-sm"
                />
              </div>
            </div>
          )}

          {/* Botón para ver historial */}
          <div className="pt-4 border-t border-gray-200">
            <Button
              variant="secondary"
              onClick={() => setMostrarHistorial(true)}
              leftIcon={<Clock className="w-4 h-4" />}
            >
              Ver Historial de Recordatorios
            </Button>
          </div>
        </div>
      </Card>

      {/* Modal de historial */}
      <Modal
        isOpen={mostrarHistorial}
        onClose={() => setMostrarHistorial(false)}
        title="Historial de Recordatorios Enviados"
        size="lg"
        footer={
          <Button variant="secondary" onClick={() => setMostrarHistorial(false)}>
            Cerrar
          </Button>
        }
      >
        <div className="space-y-4">
          {historial.length > 0 ? (
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {historial.map((rec) => (
                <div key={rec.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-medium text-gray-900">{rec.clienteNombre}</p>
                      <p className="text-sm text-gray-600">
                        {rec.canal === 'whatsapp' ? (
                          <span className="flex items-center gap-1">
                            <MessageSquare className="w-3 h-3" />
                            WhatsApp
                          </span>
                        ) : (
                          <span className="flex items-center gap-1">
                            <Mail className="w-3 h-3" />
                            Email
                          </span>
                        )}
                      </p>
                    </div>
                    {getEstadoBadge(rec.estado)}
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm mb-2">
                    <div>
                      <span className="text-gray-600">Monto:</span>
                      <span className="font-medium ml-1">€{rec.monto.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Días antes:</span>
                      <span className="font-medium ml-1">{rec.diasAnticipacion} días</span>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500">
                    Enviado el {new Date(rec.fechaEnvio).toLocaleDateString('es-ES', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Bell className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>No hay recordatorios enviados aún</p>
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
};

