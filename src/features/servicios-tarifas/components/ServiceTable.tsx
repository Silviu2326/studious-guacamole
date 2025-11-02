import React from 'react';
import { Table, TableColumn, Card, Button } from '../../../components/componentsreutilizables';
import { Badge } from '../../../components/componentsreutilizables';
import { Service } from '../types';
import { Edit2, Trash2, Copy, ToggleLeft, ToggleRight, DollarSign, Clock, Calendar, Package, Plus } from 'lucide-react';

interface ServiceTableProps {
  services: Service[];
  onEdit: (service: Service) => void;
  onDelete: (serviceId: string) => void;
  onDuplicate: (serviceId: string) => void;
  onToggleStatus: (serviceId: string, currentStatus: boolean) => void;
  loading?: boolean;
  onCreateNew?: () => void;
}

const ServiceTable: React.FC<ServiceTableProps> = ({
  services,
  onEdit,
  onDelete,
  onDuplicate,
  onToggleStatus,
  loading = false,
  onCreateNew
}) => {
  const getServiceTypeLabel = (type: string): string => {
    const labels: Record<string, string> = {
      'MEMBERSHIP': 'Membresía',
      'SESSION_PACK': 'Pack Sesiones',
      'SINGLE_CLASS': 'Clase Suelta',
      'PRODUCT': 'Producto',
      'CONSULTATION': 'Consulta',
      'ONLINE_PROGRAM': 'Programa Online'
    };
    return labels[type] || type;
  };

  const getServiceTypeColor = (type: string): 'blue' | 'green' | 'yellow' | 'purple' | 'orange' => {
    const colors: Record<string, 'blue' | 'green' | 'yellow' | 'purple' | 'orange'> = {
      'MEMBERSHIP': 'blue',
      'SESSION_PACK': 'green',
      'SINGLE_CLASS': 'yellow',
      'PRODUCT': 'purple',
      'CONSULTATION': 'orange',
      'ONLINE_PROGRAM': 'blue'
    };
    return colors[type] || 'blue';
  };

  const getBillingTypeLabel = (isRecurring: boolean, billingType: string, interval?: string): string => {
    if (!isRecurring) return 'Pago único';
    
    const intervals: Record<string, string> = {
      'MONTHLY': 'Mensual',
      'QUARTERLY': 'Trimestral',
      'YEARLY': 'Anual'
    };
    return interval ? intervals[interval] || interval : 'Recurrente';
  };

  const formatPrice = (price: number, currency: string): string => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: currency
    }).format(price);
  };

  const columns: TableColumn<Service>[] = [
    {
      key: 'name',
      label: 'Nombre',
      render: (value, row) => (
        <div>
          <div className="font-medium text-gray-900">{value}</div>
          {row.description && (
            <div className="text-sm text-slate-600 truncate max-w-md">
              {row.description}
            </div>
          )}
        </div>
      )
    },
    {
      key: 'category',
      label: 'Categoría',
      render: (value) => (
        <Badge variant="gray" size="sm">
          {value}
        </Badge>
      )
    },
    {
      key: 'serviceType',
      label: 'Tipo',
      render: (value) => (
        <Badge variant={getServiceTypeColor(value as string)} size="sm">
          {getServiceTypeLabel(value as string)}
        </Badge>
      )
    },
    {
      key: 'price',
      label: 'Precio',
      render: (value, row) => (
        <div className="flex items-center space-x-1">
          <DollarSign className="h-4 w-4 text-slate-400" />
          <span className="font-medium text-slate-900">{formatPrice(value as number, row.currency)}</span>
        </div>
      ),
      align: 'right'
    },
    {
      key: 'billingType',
      label: 'Facturación',
      render: (value, row) => (
        <Badge variant="outline" size="sm">
          {getBillingTypeLabel(row.isRecurring, row.billingType, row.recurringInterval)}
        </Badge>
      )
    },
    {
      key: 'details',
      label: 'Detalles',
      render: (value, row) => (
        <div className="flex items-center space-x-3 text-sm text-slate-600">
          {row.duration && (
            <div className="flex items-center space-x-1">
              <Clock className="h-3 w-3" />
              <span>{row.duration} min</span>
            </div>
          )}
          {row.sessionCount && (
            <div className="flex items-center space-x-1">
              <Package className="h-3 w-3" />
              <span>{row.sessionCount} ses.</span>
            </div>
          )}
          {row.recurringInterval && (
            <div className="flex items-center space-x-1">
              <Calendar className="h-3 w-3" />
              <span>{row.recurringInterval}</span>
            </div>
          )}
        </div>
      )
    },
    {
      key: 'isActive',
      label: 'Estado',
      render: (value, row) => (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleStatus(row.serviceId, row.isActive);
          }}
          className="flex items-center space-x-2 transition-all hover:opacity-80"
          title={row.isActive ? 'Desactivar servicio' : 'Activar servicio'}
        >
          {row.isActive ? (
            <>
              <ToggleRight className="h-5 w-5 text-green-600" />
              <span className="text-sm font-medium text-green-600">Activo</span>
            </>
          ) : (
            <>
              <ToggleLeft className="h-5 w-5 text-slate-400" />
              <span className="text-sm font-medium text-slate-400">Inactivo</span>
            </>
          )}
        </button>
      ),
      align: 'center'
    },
    {
      key: 'actions',
      label: 'Acciones',
      render: (value, row) => (
        <div className="flex items-center justify-end space-x-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit(row);
            }}
            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
            title="Editar servicio"
          >
            <Edit2 className="h-4 w-4" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDuplicate(row.serviceId);
            }}
            className="p-2 text-slate-600 hover:bg-slate-50 rounded-lg transition-all"
            title="Duplicar servicio"
          >
            <Copy className="h-4 w-4" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (window.confirm(`¿Estás seguro de que quieres eliminar "${row.name}"?`)) {
                onDelete(row.serviceId);
              }
            }}
            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all"
            title="Eliminar servicio"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ),
      align: 'right'
    }
  ];

  // Estado vacío personalizado según guía
  if (!loading && services.length === 0) {
    return (
      <Card className="p-8 text-center bg-white shadow-sm">
        <Package size={48} className="mx-auto text-gray-400 mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No hay servicios disponibles</h3>
        <p className="text-gray-600 mb-4">
          Crea tu primer servicio para comenzar a gestionar tu catálogo.
        </p>
        {onCreateNew && (
          <Button onClick={onCreateNew}>
            <Plus size={16} className="mr-2" />
            Crear Primer Servicio
          </Button>
        )}
      </Card>
    );
  }

  return (
    <Table
      data={services}
      columns={columns}
      loading={loading}
      emptyMessage="No hay servicios disponibles. Crea tu primer servicio para comenzar."
    />
  );
};

export default ServiceTable;

