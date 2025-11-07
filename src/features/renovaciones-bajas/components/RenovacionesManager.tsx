import React, { useState, useMemo } from 'react';
import { Renovacion, ProcessRenovacionRequest, UserType } from '../types';
import { Card, Button, Select, Table, MetricCards, MetricCardData } from '../../../components/componentsreutilizables';
import type { TableColumn } from '../../../components/componentsreutilizables';
import { RefreshCw, Send, Check, X, Clock, AlertTriangle, Users } from 'lucide-react';

interface RenovacionesManagerProps {
  userType: UserType;
  renovaciones: Renovacion[];
  onProcessRenovacion: (id: string, data: ProcessRenovacionRequest) => Promise<void>;
  onCancelRenovacion: (id: string) => Promise<void>;
  onSendReminder: (id: string) => Promise<void>;
  loading?: boolean;
}

export const RenovacionesManager: React.FC<RenovacionesManagerProps> = ({
  userType,
  renovaciones,
  onProcessRenovacion,
  onCancelRenovacion,
  onSendReminder,
  loading = false,
}) => {
  const [filter, setFilter] = useState<'todas' | 'pendientes' | 'procesadas' | 'canceladas'>('todas');

  const filteredRenovaciones = useMemo(() => {
    return renovaciones.filter(renovacion => {
      if (filter === 'todas') return true;
      return renovacion.estado === filter;
    });
  }, [renovaciones, filter]);

  // Calcular métricas
  const metricas = useMemo(() => {
    const total = renovaciones.length;
    const pendientes = renovaciones.filter(r => r.estado === 'pendiente').length;
    const urgentes = renovaciones.filter(r => r.diasRestantes <= 7 && r.estado === 'pendiente').length;
    const procesadas = renovaciones.filter(r => r.estado === 'procesada').length;
    
    return {
      total,
      pendientes,
      urgentes,
      procesadas,
    };
  }, [renovaciones]);

  const metricCards: MetricCardData[] = [
    {
      id: 'total-renovaciones',
      title: 'Total Renovaciones',
      value: metricas.total.toString(),
      subtitle: 'En este período',
      color: 'info',
      icon: <Users className="w-6 h-6" />,
    },
    {
      id: 'pendientes',
      title: 'Pendientes',
      value: metricas.pendientes.toString(),
      subtitle: 'Requieren atención',
      color: 'warning',
      icon: <Clock className="w-6 h-6" />,
    },
    {
      id: 'urgentes',
      title: 'Urgentes',
      value: metricas.urgentes.toString(),
      subtitle: 'Menos de 7 días',
      color: 'error',
      icon: <AlertTriangle className="w-6 h-6" />,
    },
    {
      id: 'procesadas',
      title: 'Procesadas',
      value: metricas.procesadas.toString(),
      subtitle: 'Completadas',
      color: 'success',
      icon: <Check className="w-6 h-6" />,
    },
  ];

  const getEstadoBadge = (estado: string) => {
    const estados = {
      pendiente: { bg: 'bg-yellow-100 text-yellow-800', text: 'Pendiente' },
      procesada: { bg: 'bg-green-100 text-green-800', text: 'Procesada' },
      cancelada: { bg: 'bg-red-100 text-red-800', text: 'Cancelada' },
    };
    const estadoStyle = estados[estado as keyof typeof estados] || estados.pendiente;
    return (
      <span className={`px-2 py-1 rounded-lg text-xs font-semibold ${estadoStyle.bg}`}>
        {estadoStyle.text}
      </span>
    );
  };

  const columns: TableColumn<Renovacion>[] = [
    {
      key: 'cliente',
      label: 'Cliente',
      render: (_, row) => (
        <div>
          <div className="font-semibold text-gray-900">{row.cliente.nombre}</div>
          <div className="text-sm text-gray-600">{row.cliente.email}</div>
        </div>
      ),
    },
    {
      key: 'tipo',
      label: userType === 'entrenador' ? 'Bono PT' : 'Membresía',
      render: (_, row) => (
        <span className="text-sm">
          {row.membresia.tipo === 'bono-pt' ? 'Bono PT' : 'Cuota Mensual'}
        </span>
      ),
    },
    {
      key: 'fechaVencimiento',
      label: 'Fecha Vencimiento',
      render: (_, row) => (
        <div>
          <div className="font-medium text-gray-900">
            {new Date(row.fechaVencimiento).toLocaleDateString('es-ES')}
          </div>
          <div className="text-sm text-gray-600">{row.diasRestantes} días restantes</div>
        </div>
      ),
    },
    {
      key: 'estado',
      label: 'Estado',
      render: (_, row) => getEstadoBadge(row.estado),
    },
    {
      key: 'acciones',
      label: 'Acciones',
      render: (_, row) => (
        <div className="flex gap-2">
          {row.estado === 'pendiente' && (
            <>
              <Button
                size="sm"
                variant="primary"
                onClick={() => onProcessRenovacion(row.id, { renovacionId: row.id })}
              >
                <Check size={20} className="mr-2" />
                Procesar
              </Button>
              <Button
                size="sm"
                variant="secondary"
                onClick={() => onSendReminder(row.id)}
              >
                <Send size={20} className="mr-2" />
                Recordatorio
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => onCancelRenovacion(row.id)}
              >
                <X size={20} />
              </Button>
            </>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Métricas */}
      <MetricCards data={metricCards} columns={4} />

      {/* Toolbar Superior */}
      <div className="flex items-center justify-end">
        <div className="flex items-center gap-3">
          <Select
            value={filter}
            onChange={(e) => setFilter(e.target.value as typeof filter)}
            options={[
              { value: 'todas', label: 'Todas' },
              { value: 'pendientes', label: 'Pendientes' },
              { value: 'procesadas', label: 'Procesadas' },
              { value: 'canceladas', label: 'Canceladas' },
            ]}
            className="w-48"
            fullWidth={false}
          />
          <Button variant="ghost" size="sm">
            <RefreshCw size={20} className="mr-2" />
            Actualizar
          </Button>
        </div>
      </div>

      {/* Tabla de Renovaciones */}
      <Card className="p-0 bg-white shadow-sm">
        <Table
          data={filteredRenovaciones}
          columns={columns}
          loading={loading}
          emptyMessage="No hay renovaciones disponibles"
        />
      </Card>
    </div>
  );
};
