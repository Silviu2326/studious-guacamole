import React from 'react';
import { Table, Badge, Button, Card } from '../../../components/componentsreutilizables';
import { Membresia, EstadoMembresia } from '../types';
import { 
  CreditCard, 
  Calendar, 
  DollarSign, 
  User,
  RefreshCw,
  X,
  CheckCircle
} from 'lucide-react';

interface MembresiasListProps {
  membresias: Membresia[];
  userType: 'entrenador' | 'gimnasio';
  onUpdate?: (id: string, data: any) => void;
  onCancel?: (id: string) => void;
  onRenew?: (id: string) => void;
  onProcessPayment?: (id: string) => void;
}

export const MembresiasList: React.FC<MembresiasListProps> = ({
  membresias,
  userType,
  onUpdate,
  onCancel,
  onRenew,
  onProcessPayment,
}) => {
  const getEstadoBadge = (estado: EstadoMembresia) => {
    switch (estado) {
      case 'activa':
        return <Badge variant="green">Activa</Badge>;
      case 'pendiente':
        return <Badge variant="yellow">Pendiente</Badge>;
      case 'vencida':
        return <Badge variant="red">Vencida</Badge>;
      case 'suspendida':
        return <Badge variant="gray">Suspendida</Badge>;
      case 'cancelada':
        return <Badge variant="gray">Cancelada</Badge>;
      default:
        return <Badge variant="gray">{estado}</Badge>;
    }
  };

  const getEstadoPagoBadge = (estadoPago: string) => {
    switch (estadoPago) {
      case 'pagado':
        return <Badge variant="green">Al día</Badge>;
      case 'pendiente':
        return <Badge variant="yellow">Pendiente</Badge>;
      case 'vencido':
        return <Badge variant="red">Vencido</Badge>;
      case 'suspendido':
        return <Badge variant="gray">Suspendido</Badge>;
      default:
        return <Badge variant="gray">{estadoPago}</Badge>;
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatCurrency = (amount: number) => {
    return `${amount.toFixed(2)} €`;
  };

  const columns = [
    {
      key: 'clienteNombre',
      label: 'Cliente',
      render: (_: any, row: Membresia) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-full flex items-center justify-center flex-shrink-0">
            <User className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="text-sm font-semibold text-gray-900">
              {row.clienteNombre}
            </div>
            <div className="text-xs text-gray-600">
              {row.clienteEmail}
            </div>
          </div>
        </div>
      ),
    },
    {
      key: 'planNombre',
      label: 'Plan',
      render: (_: any, row: Membresia) => (
        <div>
          <div className="text-sm font-medium text-gray-900">
            {row.planNombre}
          </div>
          {row.tipo === 'privada-pt' && (
            <div className="text-xs text-gray-600">
              PT Privada
            </div>
          )}
        </div>
      ),
    },
    {
      key: 'precioMensual',
      label: 'Precio Mensual',
      render: (_: any, row: Membresia) => (
        <div className="flex items-center gap-2">
          <DollarSign className="w-4 h-4 text-green-600" />
          <span className="text-sm font-semibold text-gray-900">
            {formatCurrency(row.precioMensual)}
          </span>
        </div>
      ),
    },
    {
      key: 'estado',
      label: 'Estado',
      render: (_: any, row: Membresia) => getEstadoBadge(row.estado),
    },
    {
      key: 'estadoPago',
      label: 'Estado Pago',
      render: (_: any, row: Membresia) => getEstadoPagoBadge(row.estadoPago),
    },
    {
      key: 'fechaVencimiento',
      label: 'Próximo Vencimiento',
      render: (_: any, row: Membresia) => (
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-slate-500" />
          <span className="text-sm text-gray-600">
            {row.proximoVencimiento ? formatDate(row.proximoVencimiento) : formatDate(row.fechaVencimiento)}
          </span>
          {row.diasMorosidad && row.diasMorosidad > 0 && (
            <Badge variant="red" size="sm">{row.diasMorosidad} días</Badge>
          )}
        </div>
      ),
    },
    {
      key: 'actions',
      label: 'Acciones',
      align: 'right' as const,
      render: (_: any, row: Membresia) => (
        <div className="flex items-center gap-2 justify-end">
          {row.estadoPago === 'vencido' && onProcessPayment && (
            <Button
              variant="primary"
              size="sm"
              onClick={() => onProcessPayment(row.id)}
              title="Procesar Pago"
            >
              <CreditCard className="w-4 h-4 mr-1" />
              Pagar
            </Button>
          )}
          {row.estado === 'activa' && onRenew && (
            <Button
              variant="secondary"
              size="sm"
              onClick={() => onRenew(row.id)}
              title="Renovar Membresía"
            >
              <RefreshCw className="w-4 h-4 mr-1" />
              Renovar
            </Button>
          )}
          {row.estado !== 'cancelada' && onCancel && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onCancel(row.id)}
              title="Cancelar Membresía"
            >
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>
      ),
    },
  ];

  if (membresias.length === 0) {
    return (
      <Card className="p-8 text-center bg-white shadow-sm">
        <User size={48} className="mx-auto text-gray-400 mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No hay membresías activas</h3>
        <p className="text-gray-600">No se encontraron membresías para mostrar</p>
      </Card>
    );
  }

  return (
    <Card className="bg-white shadow-sm">
      <Table
        data={membresias}
        columns={columns}
        emptyMessage="No hay membresías activas"
      />
    </Card>
  );
};

