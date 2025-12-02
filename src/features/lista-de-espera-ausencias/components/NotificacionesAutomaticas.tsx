import React, { useState, useEffect } from 'react';
import { Card, Table, Button, MetricCards } from '../../../components/componentsreutilizables';
import { getNotificaciones, marcarNotificacionLeida } from '../api';
import { Notificacion } from '../types';
import { Bell, Mail, MessageSquare, Smartphone, Check } from 'lucide-react';

export const NotificacionesAutomaticas: React.FC = () => {
  const [notificaciones, setNotificaciones] = useState<Notificacion[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cargarNotificaciones();
  }, []);

  const cargarNotificaciones = async () => {
    try {
      setLoading(true);
      const data = await getNotificaciones();
      setNotificaciones(data);
    } catch (error) {
      console.error('Error al cargar notificaciones:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarcarLeida = async (id: string) => {
    try {
      await marcarNotificacionLeida(id);
      cargarNotificaciones();
    } catch (error) {
      console.error('Error al marcar notificación como leída:', error);
    }
  };

  const getCanalIcon = (canal: string) => {
    switch (canal) {
      case 'email':
        return <Mail className="w-4 h-4" />;
      case 'sms':
        return <MessageSquare className="w-4 h-4" />;
      case 'push':
        return <Smartphone className="w-4 h-4" />;
      default:
        return <Bell className="w-4 h-4" />;
    }
  };

  const getEstadoBadge = (estado: string) => {
    const colors = {
      pendiente: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      enviada: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      leida: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      expirada: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200',
    };
    return colors[estado as keyof typeof colors] || colors.pendiente;
  };

  const getTipoBadge = (tipo: string) => {
    const tipos: Record<string, string> = {
      disponibilidad_plaza: 'Plaza Disponible',
      recordatorio_clase: 'Recordatorio',
      confirmacion_reserva: 'Confirmación',
      cancelacion: 'Cancelación',
    };
    return tipos[tipo] || tipo;
  };

  const columns = [
    {
      key: 'tipo',
      label: 'Tipo',
      render: (value: string) => (
        <span className="inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
          {getTipoBadge(value)}
        </span>
      ),
    },
    {
      key: 'mensaje',
      label: 'Mensaje',
      render: (value: string) => (
        <div className="max-w-md">{value}</div>
      ),
    },
    {
      key: 'canal',
      label: 'Canal',
      render: (value: string) => (
        <div className="flex items-center gap-2">
          {getCanalIcon(value)}
          <span className="capitalize">{value}</span>
        </div>
      ),
    },
    {
      key: 'fechaEnvio',
      label: 'Fecha Envío',
      render: (value: Date) => new Date(value).toLocaleString('es-ES'),
    },
    {
      key: 'estado',
      label: 'Estado',
      render: (value: string) => (
        <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${getEstadoBadge(value)}`}>
          {value}
        </span>
      ),
    },
    {
      key: 'acciones',
      label: 'Acciones',
      render: (_: any, row: Notificacion) => (
        <Button
          size="sm"
          variant="secondary"
          onClick={() => handleMarcarLeida(row.id)}
          disabled={row.estado === 'leida'}
        >
          <Check className="w-4 h-4 mr-1" />
          Marcar Leída
        </Button>
      ),
    },
  ];

  const estadisticas = {
    total: notificaciones.length,
    pendientes: notificaciones.filter(n => n.estado === 'pendiente').length,
    enviadas: notificaciones.filter(n => n.estado === 'enviada').length,
    leidas: notificaciones.filter(n => n.estado === 'leida').length,
  };

  return (
    <div className="space-y-6">
      {/* KPIs de Notificaciones */}
      <MetricCards
        data={[
          {
            id: 'total',
            title: 'Total Notificaciones',
            value: estadisticas.total,
            color: 'primary',
            icon: <Bell />,
          },
          {
            id: 'pendientes',
            title: 'Pendientes',
            value: estadisticas.pendientes,
            color: 'warning',
            icon: <Bell />,
          },
          {
            id: 'enviadas',
            title: 'Enviadas',
            value: estadisticas.enviadas,
            color: 'info',
            icon: <Bell />,
          },
          {
            id: 'leidas',
            title: 'Leídas',
            value: estadisticas.leidas,
            color: 'success',
            icon: <Bell />,
          },
        ]}
      />

      {/* Tabla de Historial de Notificaciones */}
      <Card className="p-6 bg-white shadow-sm">
        <h3 className="text-xl font-bold text-gray-900 mb-4">
          Historial de Notificaciones
        </h3>

        <Table
          data={notificaciones}
          columns={columns}
          loading={loading}
          emptyMessage="No hay notificaciones"
        />
      </Card>
    </div>
  );
};

