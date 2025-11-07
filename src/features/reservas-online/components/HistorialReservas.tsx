import React, { useState, useEffect } from 'react';
import { Card, Table } from '../../../components/componentsreutilizables';
import { Badge } from '../../../components/componentsreutilizables/Badge';
import { Reserva } from '../types';
import { getReservas } from '../api';
import { Calendar, Clock, User, DollarSign, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

interface HistorialReservasProps {
  role: 'entrenador' | 'gimnasio';
}

export const HistorialReservas: React.FC<HistorialReservasProps> = ({ role }) => {
  const [reservas, setReservas] = useState<Reserva[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargarReservas = async () => {
      setLoading(true);
      const fechaInicio = new Date();
      fechaInicio.setMonth(fechaInicio.getMonth() - 1);
      const fechaFin = new Date();
      fechaFin.setMonth(fechaFin.getMonth() + 1);
      
      const datos = await getReservas(fechaInicio, fechaFin, role);
      setReservas(datos);
      setLoading(false);
    };
    cargarReservas();
  }, [role]);

  const getEstadoBadge = (estado: Reserva['estado']) => {
    const estados = {
      pendiente: { color: 'yellow' as const, icon: AlertCircle, label: 'Pendiente' },
      confirmada: { color: 'green' as const, icon: CheckCircle, label: 'Confirmada' },
      cancelada: { color: 'red' as const, icon: XCircle, label: 'Cancelada' },
      completada: { color: 'blue' as const, icon: CheckCircle, label: 'Completada' },
      'no-show': { color: 'gray' as const, icon: XCircle, label: 'No Show' },
    };
    
    const estadoInfo = estados[estado];
    const Icon = estadoInfo.icon;
    
    return (
      <Badge variant={estadoInfo.color} leftIcon={<Icon className="w-3 h-3" />}>
        {estadoInfo.label}
      </Badge>
    );
  };

  const columns = [
    {
      key: 'fecha',
      label: 'Fecha',
      render: (value: Date) => (
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-slate-600" />
          <span>{value.toLocaleDateString('es-ES')}</span>
        </div>
      ),
    },
    {
      key: 'horaInicio',
      label: 'Hora',
      render: (_: any, row: Reserva) => (
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-slate-600" />
          <span>{row.horaInicio} - {row.horaFin}</span>
        </div>
      ),
    },
    {
      key: 'clienteNombre',
      label: role === 'entrenador' ? 'Cliente' : 'Socio',
      render: (value: string) => (
        <div className="flex items-center gap-2">
          <User className="w-4 h-4 text-slate-600" />
          <span>{value}</span>
        </div>
      ),
    },
    ...(role === 'gimnasio' ? [{
      key: 'claseNombre',
      label: 'Clase',
      render: (value: string) => value || '-',
    }] : []),
    {
      key: 'tipoSesion',
      label: 'Tipo',
      render: (value: string, row: Reserva) => {
        if (role === 'entrenador' && row.tipoSesion) {
          return row.tipoSesion === 'presencial' ? 'Presencial' : 'Videollamada';
        }
        return row.tipo === 'clase-grupal' ? 'Clase Grupal' : row.tipo;
      },
    },
    {
      key: 'estado',
      label: 'Estado',
      render: (value: Reserva['estado']) => getEstadoBadge(value),
    },
    {
      key: 'precio',
      label: 'Precio',
      render: (value: number, row: Reserva) => (
        <div className="flex items-center gap-2">
          <DollarSign className="w-4 h-4 text-slate-600" />
          <span className={row.pagado ? 'text-green-600' : 'text-slate-400'}>
            €{value.toFixed(2)}
          </span>
        </div>
      ),
      align: 'right' as const,
    },
  ];

  return (
    <Card className="bg-white shadow-sm">
      <div className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold text-gray-900">
            Historial de Reservas
          </h3>
        </div>

        <Table
          data={reservas}
          columns={columns}
          loading={loading}
          emptyMessage="No hay reservas registradas"
        />
      </div>
    </Card>
  );
};
