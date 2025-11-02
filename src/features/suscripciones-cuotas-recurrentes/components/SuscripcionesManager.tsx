import React from 'react';
import { Suscripcion } from '../types';
import { Card, Table, Badge, Button } from '../../../components/componentsreutilizables';
import { CreditCard, Calendar, TrendingUp, Pause, Play, X } from 'lucide-react';

interface SuscripcionesManagerProps {
  suscripciones: Suscripcion[];
  userType: 'entrenador' | 'gimnasio';
  onUpdate?: (id: string, data: any) => void;
  onCancel?: (id: string) => void;
  onSelect?: (suscripcion: Suscripcion) => void;
}

export const SuscripcionesManager: React.FC<SuscripcionesManagerProps> = ({
  suscripciones,
  userType,
  onUpdate,
  onCancel,
  onSelect,
}) => {
  const getEstadoBadge = (estado: string) => {
    const estados: Record<string, { label: string; color: 'success' | 'warning' | 'error' | 'info' }> = {
      activa: { label: 'Activa', color: 'success' },
      pausada: { label: 'Pausada', color: 'warning' },
      cancelada: { label: 'Cancelada', color: 'error' },
      vencida: { label: 'Vencida', color: 'error' },
      pendiente: { label: 'Pendiente', color: 'info' },
    };
    
    const estadoData = estados[estado] || estados.pendiente;
    return <Badge color={estadoData.color}>{estadoData.label}</Badge>;
  };

  const columns = userType === 'entrenador' 
    ? [
        {
          key: 'clienteNombre',
          label: 'Cliente',
          render: (value: string, row: Suscripcion) => (
            <div
              className={onSelect ? 'cursor-pointer hover:underline' : ''}
              onClick={(e) => {
                if (onSelect) {
                  e.stopPropagation();
                  onSelect(row);
                }
              }}
            >
              <div className="text-base font-semibold text-gray-900">
                {value}
              </div>
              <div className="text-sm text-gray-600">
                {row.clienteEmail}
              </div>
            </div>
          ),
        },
        {
          key: 'planNombre',
          label: 'Plan',
          render: (value: string, row: Suscripcion) => (
            <div>
              <div className="text-base text-gray-900">
                {value}
              </div>
              {row.sesionesIncluidas && (
                <div className="text-sm text-gray-600">
                  {row.sesionesDisponibles}/{row.sesionesIncluidas} sesiones
                </div>
              )}
            </div>
          ),
        },
        {
          key: 'precio',
          label: 'Precio Mensual',
          render: (value: number) => (
            <span className="text-base font-semibold text-gray-900">
              {value} €
            </span>
          ),
        },
        {
          key: 'estado',
          label: 'Estado',
          render: (value: string) => getEstadoBadge(value),
        },
        {
          key: 'proximaRenovacion',
          label: 'Próxima Renovación',
          render: (value?: string) => (
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-gray-400" />
              <span className="text-base text-gray-900">
                {value ? new Date(value).toLocaleDateString('es-ES') : '-'}
              </span>
            </div>
          ),
        },
        {
          key: 'actions',
          label: 'Acciones',
          render: (value: any, row: Suscripcion) => (
            <div className="flex items-center gap-2">
              {row.estado === 'activa' && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onUpdate?.(row.id, { estado: 'pausada' })}
                >
                  <Pause className="w-4 h-4" />
                </Button>
              )}
              {row.estado === 'pausada' && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onUpdate?.(row.id, { estado: 'activa' })}
                >
                  <Play className="w-4 h-4" />
                </Button>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onCancel?.(row.id)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          ),
        },
      ]
    : [
        {
          key: 'clienteNombre',
          label: 'Socio',
          render: (value: string, row: Suscripcion) => (
            <div>
              <div className="text-base font-semibold text-gray-900">
                {value}
              </div>
              <div className="text-sm text-gray-600">
                {row.clienteEmail}
              </div>
            </div>
          ),
        },
        {
          key: 'planNombre',
          label: 'Membresía',
          render: (value: string, row: Suscripcion) => (
            <div>
              <div className="text-base text-gray-900">
                {value}
              </div>
              {row.nivelPlan && (
                <Badge color="info">{row.nivelPlan}</Badge>
              )}
            </div>
          ),
        },
        {
          key: 'precio',
          label: 'Cuota Mensual',
          render: (value: number) => (
            <span className="text-base font-semibold text-gray-900">
              {value} €
            </span>
          ),
        },
        {
          key: 'estado',
          label: 'Estado',
          render: (value: string, row: Suscripcion) => (
            <div className="flex flex-col gap-1">
              {getEstadoBadge(value)}
              {row.freezeActivo && (
                <Badge color="warning">Freeze activo</Badge>
              )}
              {row.multisesionActivo && (
                <Badge color="info">Multisesión</Badge>
              )}
            </div>
          ),
        },
        {
          key: 'proximaRenovacion',
          label: 'Próximo Cobro',
          render: (value?: string) => (
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-gray-400" />
              <span className="text-base text-gray-900">
                {value ? new Date(value).toLocaleDateString('es-ES') : '-'}
              </span>
            </div>
          ),
        },
        {
          key: 'actions',
          label: 'Acciones',
          render: (value: any, row: Suscripcion) => (
            <div className="flex items-center gap-2">
              {row.estado === 'activa' && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onUpdate?.(row.id, { estado: 'pausada' })}
                >
                  <Pause className="w-4 h-4" />
                </Button>
              )}
              {row.estado === 'pausada' && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onUpdate?.(row.id, { estado: 'activa' })}
                >
                  <Play className="w-4 h-4" />
                </Button>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onCancel?.(row.id)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          ),
        },
      ];

  return (
    <Card className="bg-white shadow-sm">
      <Table
        data={suscripciones}
        columns={columns}
        emptyMessage={
          userType === 'entrenador'
            ? 'No hay suscripciones PT activas'
            : 'No hay suscripciones activas'
        }
      />
    </Card>
  );
};

