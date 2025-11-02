import React, { useState, useEffect } from 'react';
import { Card, Table } from '../../../components/componentsreutilizables';
import { Badge } from '../../../components/componentsreutilizables/Badge';
import { Recordatorio, Reserva } from '../types';
import { Bell, Mail, Phone, Smartphone, CheckCircle, Clock } from 'lucide-react';

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

  useEffect(() => {
    // Simular carga de recordatorios
    setTimeout(() => {
      const datos: Recordatorio[] = reservas
        .filter((r) => r.estado === 'confirmada' || r.estado === 'pendiente')
        .map((reserva) => ({
          id: `rec-${reserva.id}`,
          reservaId: reserva.id,
          tipo: 'email' as const,
          enviado: Math.random() > 0.5,
          fechaEnvio: Math.random() > 0.5 ? new Date() : undefined,
          programadoPara: new Date(reserva.fecha),
        }));
      setRecordatorios(datos);
      setLoading(false);
    }, 300);
  }, [reservas]);

  const getTipoIcon = (tipo: Recordatorio['tipo']) => {
    switch (tipo) {
      case 'email':
        return <Mail className="w-4 h-4" />;
      case 'sms':
        return <Phone className="w-4 h-4" />;
      case 'push':
        return <Smartphone className="w-4 h-4" />;
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
          <div>
            <p className="text-sm text-gray-900">{reserva.clienteNombre}</p>
            <p className="text-xs text-gray-500">
              {reserva.fecha.toLocaleDateString('es-ES')} {reserva.horaInicio}
            </p>
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
          <p className="text-sm text-gray-600">
            Los recordatorios se envían automáticamente 24 horas antes de cada reserva confirmada
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
