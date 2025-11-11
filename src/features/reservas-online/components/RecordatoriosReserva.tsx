import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Select } from '../../../components/componentsreutilizables';
import { Badge } from '../../../components/componentsreutilizables/Badge';
import { Recordatorio, Reserva } from '../types';
import { Bell, Mail, Phone, Smartphone, CheckCircle, Clock, Video, Link2, ExternalLink, MessageCircle, Send } from 'lucide-react';
import { enviarRecordatorioReserva } from '../api/notificacionesReserva';
import { crearTokenConfirmacion } from '../api/tokensConfirmacion';

interface RecordatoriosReservaProps {
  reservas: Reserva[];
  role: 'entrenador' | 'gimnasio';
}

export const RecordatoriosReserva: React.FC<RecordatoriosReservaProps> = ({
  reservas,
  role,
}) => {
  const [recordatorios, setRecordatorios] = useState<Recordatorio[]>([]);
  const [loading, setLoading] = useState(true);
  const [enviandoRecordatorio, setEnviandoRecordatorio] = useState<string | null>(null);
  const [canalesSeleccionados, setCanalesSeleccionados] = useState<Record<string, 'email' | 'sms' | 'push' | 'whatsapp'>>({});

  useEffect(() => {
    // Simular carga de recordatorios
    setTimeout(() => {
      const datos: Recordatorio[] = reservas
        .filter((r) => r.estado === 'confirmada' || r.estado === 'pendiente')
        .map((reserva) => {
          // Simular diferentes tipos de recordatorios
          const tipos: Array<'email' | 'sms' | 'push' | 'whatsapp'> = ['email', 'sms', 'whatsapp'];
          const tipoAleatorio = tipos[Math.floor(Math.random() * tipos.length)];
          
          return {
            id: `rec-${reserva.id}`,
            reservaId: reserva.id,
            tipo: tipoAleatorio,
            enviado: Math.random() > 0.5,
            fechaEnvio: Math.random() > 0.5 ? new Date() : undefined,
            programadoPara: new Date(reserva.fecha),
          };
        });
      setRecordatorios(datos);
      setLoading(false);
    }, 300);
  }, [reservas]);

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
        <div className="flex items-center gap-2">
          <Bell className="w-5 h-5 text-blue-600" />
          <h3 className="text-xl font-bold text-gray-900">
            Recordatorios Automáticos
          </h3>
        </div>

        <div className="p-4 bg-blue-50 rounded-lg ring-1 ring-blue-200">
          <p className="text-sm text-gray-600 mb-2">
            Los recordatorios se envían automáticamente 24 horas antes de cada reserva confirmada
          </p>
          <p className="text-sm text-blue-800 font-medium mb-2">
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
    </Card>
  );
};
