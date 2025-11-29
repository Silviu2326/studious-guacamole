import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Select, Modal, Input } from '../../../components/componentsreutilizables';
import { Badge } from '../../../components/componentsreutilizables/Badge';
import { Recordatorio, Reserva } from '../types';
import { Bell, Mail, Phone, Smartphone, CheckCircle, Clock, Video, Link2, ExternalLink, MessageCircle, Send, Settings, Plus, Trash2 } from 'lucide-react';
import { enviarRecordatorioReserva } from '../api/notificacionesReserva';
import { crearTokenConfirmacion } from '../api/tokensConfirmacion';

interface RecordatoriosReservaProps {
  reservas: Reserva[];
  role: 'entrenador' | 'gimnasio';
}

interface ConfiguracionRecordatorio {
  id: string;
  canal: 'email' | 'sms' | 'push' | 'whatsapp';
  offsetHoras: number; // Horas antes de la reserva para enviar el recordatorio
  activo: boolean;
  descripcion?: string;
}

export const RecordatoriosReserva: React.FC<RecordatoriosReservaProps> = ({
  reservas,
  role,
}) => {
  const [recordatorios, setRecordatorios] = useState<Recordatorio[]>([]);
  const [loading, setLoading] = useState(true);
  const [enviandoRecordatorio, setEnviandoRecordatorio] = useState<string | null>(null);
  const [canalesSeleccionados, setCanalesSeleccionados] = useState<Record<string, 'email' | 'sms' | 'push' | 'whatsapp'>>({});
  const [configuraciones, setConfiguraciones] = useState<ConfiguracionRecordatorio[]>([
    { id: '1', canal: 'email', offsetHoras: 24, activo: true, descripcion: 'Recordatorio 24h antes por email' },
    { id: '2', canal: 'whatsapp', offsetHoras: 2, activo: true, descripcion: 'Recordatorio 2h antes por WhatsApp' },
  ]);
  const [mostrarConfigModal, setMostrarConfigModal] = useState(false);
  const [nuevaConfig, setNuevaConfig] = useState<Omit<ConfiguracionRecordatorio, 'id'>>({
    canal: 'email',
    offsetHoras: 24,
    activo: true,
    descripcion: '',
  });

  useEffect(() => {
    // Simular carga de recordatorios basados en configuraciones
    setTimeout(() => {
      const datos: Recordatorio[] = [];
      reservas
        .filter((r) => r.estado === 'confirmada' || r.estado === 'pendiente')
        .forEach((reserva) => {
          // Crear recordatorios según las configuraciones activas
          configuraciones
            .filter(c => c.activo)
            .forEach((config) => {
              const fechaReserva = new Date(reserva.fecha);
              const fechaRecordatorio = new Date(fechaReserva);
              fechaRecordatorio.setHours(fechaRecordatorio.getHours() - config.offsetHoras);
              
              // Solo crear recordatorio si la fecha programada no ha pasado
              if (fechaRecordatorio > new Date()) {
                datos.push({
                  id: `rec-${reserva.id}-${config.id}`,
                  reservaId: reserva.id,
                  tipo: config.canal,
                  enviado: false,
                  fechaEnvio: undefined,
                  programadoPara: fechaRecordatorio,
                });
              }
            });
        });
      setRecordatorios(datos);
      setLoading(false);
    }, 300);
  }, [reservas, configuraciones]);

  const handleEnviarRecordatorio = async (reservaId: string) => {
    const reserva = reservas.find(r => r.id === reservaId);
    if (!reserva) return;

    const canal = canalesSeleccionados[reservaId] || 'email';
    setEnviandoRecordatorio(reservaId);
    try {
      // Crear token de confirmación para la reserva
      const tokenConfirmacion = await crearTokenConfirmacion(reservaId);
      
      // Enviar recordatorio con el canal seleccionado
      await enviarRecordatorioReserva(reserva, canal, tokenConfirmacion.token);
      
      // Actualizar el estado del recordatorio
      setRecordatorios(prev => prev.map(rec => 
        rec.reservaId === reservaId 
          ? { ...rec, enviado: true, fechaEnvio: new Date(), tipo: canal }
          : rec
      ));
    } catch (error) {
      console.error('Error enviando recordatorio:', error);
    } finally {
      setEnviandoRecordatorio(null);
    }
  };

  const handleCambiarCanal = (reservaId: string, canal: 'email' | 'sms' | 'push' | 'whatsapp') => {
    setCanalesSeleccionados(prev => ({
      ...prev,
      [reservaId]: canal,
    }));
  };

  const handleAgregarConfiguracion = () => {
    const nueva: ConfiguracionRecordatorio = {
      ...nuevaConfig,
      id: `config-${Date.now()}`,
    };
    setConfiguraciones([...configuraciones, nueva]);
    setNuevaConfig({ canal: 'email', offsetHoras: 24, activo: true, descripcion: '' });
    setMostrarConfigModal(false);
  };

  const handleEliminarConfiguracion = (id: string) => {
    setConfiguraciones(configuraciones.filter(c => c.id !== id));
  };

  const handleToggleConfiguracion = (id: string) => {
    setConfiguraciones(configuraciones.map(c => 
      c.id === id ? { ...c, activo: !c.activo } : c
    ));
  };

  const getTipoIcon = (tipo: Recordatorio['tipo']) => {
    switch (tipo) {
      case 'email':
        return <Mail className="w-4 h-4" />;
      case 'sms':
        return <Phone className="w-4 h-4" />;
      case 'push':
        return <Smartphone className="w-4 h-4" />;
      case 'whatsapp':
        return <MessageCircle className="w-4 h-4" />;
      default:
        return <Bell className="w-4 h-4" />;
    }
  };

  const columns = [
    {
      key: 'reservaId',
      label: 'Reserva',
      render: (value: string) => {
        const reserva = reservas.find((r) => r.id === value);
        return reserva ? (
          <div className="space-y-1">
            <p className="text-sm text-gray-900">{reserva.clienteNombre}</p>
            <p className="text-xs text-gray-500">
              {reserva.fecha.toLocaleDateString('es-ES')} {reserva.horaInicio}
            </p>
            {reserva.tipoSesion === 'videollamada' && reserva.enlaceVideollamada && (
              <div className="mt-2 flex items-center gap-1">
                <Video className="w-3 h-3 text-blue-600" />
                <a
                  href={reserva.enlaceVideollamada}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-blue-600 hover:text-blue-800 hover:underline flex items-center gap-1"
                  onClick={(e) => e.stopPropagation()}
                >
                  Enlace de videollamada
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            )}
          </div>
        ) : (
          value
        );
      },
    },
    {
      key: 'tipo',
      label: 'Tipo',
      render: (value: Recordatorio['tipo']) => (
        <div className="flex items-center gap-2">
          {getTipoIcon(value)}
          <span className="capitalize">{value}</span>
        </div>
      ),
    },
    {
      key: 'programadoPara',
      label: 'Programado para',
      render: (value: Date) => (
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-slate-600" />
          <span>{value.toLocaleString('es-ES')}</span>
        </div>
      ),
    },
    {
      key: 'enviado',
      label: 'Estado',
      render: (value: boolean, row: Recordatorio) => (
        <Badge 
          variant={value ? 'green' : 'yellow'}
          leftIcon={value ? <CheckCircle className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
        >
          {value ? 'Enviado' : 'Pendiente'}
        </Badge>
      ),
    },
    {
      key: 'acciones',
      label: 'Acciones',
      render: (value: any, row: Recordatorio) => {
        const reserva = reservas.find(r => r.id === row.reservaId);
        const estaEnviando = enviandoRecordatorio === row.reservaId;
        const puedeEnviar = reserva && (reserva.estado === 'confirmada' || reserva.estado === 'pendiente');
        const canalActual = canalesSeleccionados[row.reservaId] || row.tipo || 'email';
        
        return (
          <div className="flex items-center gap-2">
            <div className="w-32">
              <Select
                value={canalActual}
                onChange={(e) => handleCambiarCanal(row.reservaId, e.target.value as 'email' | 'sms' | 'push' | 'whatsapp')}
                options={[
                  { value: 'email', label: 'Email' },
                  { value: 'whatsapp', label: 'WhatsApp' },
                  { value: 'sms', label: 'SMS' },
                  { value: 'push', label: 'Push' },
                ]}
              />
            </div>
            <Button
              variant="primary"
              size="sm"
              onClick={() => handleEnviarRecordatorio(row.reservaId)}
              disabled={!puedeEnviar || estaEnviando}
              loading={estaEnviando}
              leftIcon={<Send className="w-4 h-4" />}
            >
              Enviar
            </Button>
          </div>
        );
      },
    },
  ];

  return (
    <Card className="bg-white shadow-sm">
      <div className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-blue-600" />
            <h3 className="text-xl font-bold text-gray-900">
              Recordatorios Automáticos
            </h3>
          </div>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setMostrarConfigModal(true)}
            leftIcon={<Settings className="w-4 h-4" />}
          >
            Configurar
          </Button>
        </div>

        <div className="p-4 bg-blue-50 rounded-lg ring-1 ring-blue-200">
          <p className="text-sm text-gray-600 mb-2">
            Los recordatorios se envían automáticamente según la configuración establecida
          </p>
          <div className="mt-2 space-y-1">
            {configuraciones.filter(c => c.activo).map(config => (
              <p key={config.id} className="text-sm text-blue-800 font-medium">
                • {config.canal.toUpperCase()}: {config.offsetHoras}h antes {config.descripcion ? `(${config.descripcion})` : ''}
              </p>
            ))}
          </div>
          <p className="text-sm text-blue-800 font-medium mt-2">
            💡 Los enlaces de videollamada se incluyen automáticamente en los recordatorios para reservas de tipo videollamada
          </p>
          <p className="text-sm text-blue-800 font-medium">
            ✅ Los recordatorios incluyen enlaces para que el cliente confirme o cancele su asistencia directamente desde el mensaje
          </p>
        </div>

        <Table
          data={recordatorios}
          columns={columns}
          loading={loading}
          emptyMessage="No hay recordatorios programados"
        />
      </div>

      {/* Modal de configuración */}
      {mostrarConfigModal && (
        <Modal
          isOpen={mostrarConfigModal}
          onClose={() => setMostrarConfigModal(false)}
          title="Configurar Recordatorios Automáticos"
          size="lg"
          footer={
            <div className="flex justify-end gap-3">
              <Button variant="secondary" onClick={() => setMostrarConfigModal(false)}>
                Cerrar
              </Button>
              <Button
                variant="primary"
                onClick={handleAgregarConfiguracion}
                leftIcon={<Plus className="w-4 h-4" />}
              >
                Agregar Configuración
              </Button>
            </div>
          }
        >
          <div className="space-y-6">
            {/* Lista de configuraciones existentes */}
            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-3">Configuraciones Activas</h4>
              <div className="space-y-2">
                {configuraciones.map(config => (
                  <div
                    key={config.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        {getTipoIcon(config.canal)}
                        <span className="font-medium capitalize">{config.canal}</span>
                        <Badge variant={config.activo ? 'green' : 'gray'}>
                          {config.activo ? 'Activo' : 'Inactivo'}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        {config.offsetHoras} horas antes de la reserva
                        {config.descripcion && ` • ${config.descripcion}`}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleToggleConfiguracion(config.id)}
                      >
                        {config.activo ? 'Desactivar' : 'Activar'}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEliminarConfiguracion(config.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Formulario para nueva configuración */}
            <div className="pt-4 border-t border-gray-200">
              <h4 className="text-sm font-semibold text-gray-900 mb-3">Nueva Configuración</h4>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Canal
                  </label>
                  <Select
                    value={nuevaConfig.canal}
                    onChange={(e) => setNuevaConfig({ ...nuevaConfig, canal: e.target.value as any })}
                    options={[
                      { value: 'email', label: 'Email' },
                      { value: 'whatsapp', label: 'WhatsApp' },
                      { value: 'sms', label: 'SMS' },
                      { value: 'push', label: 'Push Notification' },
                    ]}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Horas antes de la reserva
                  </label>
                  <Input
                    type="number"
                    value={nuevaConfig.offsetHoras}
                    onChange={(e) => setNuevaConfig({ ...nuevaConfig, offsetHoras: parseInt(e.target.value) || 24 })}
                    min="0"
                    max="168"
                    placeholder="24"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Ejemplo: 24 = 24 horas antes, 2 = 2 horas antes
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Descripción (opcional)
                  </label>
                  <Input
                    type="text"
                    value={nuevaConfig.descripcion}
                    onChange={(e) => setNuevaConfig({ ...nuevaConfig, descripcion: e.target.value })}
                    placeholder="Ej: Recordatorio principal"
                  />
                </div>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </Card>
  );
};
