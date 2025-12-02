import React from 'react';
import { Modal } from '../../../components/componentsreutilizables';
import { Badge } from '../../../components/componentsreutilizables/Badge';
import { PurchaseOrder, OrderStatus } from '../types';

interface OrderDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: PurchaseOrder | null;
}

const statusConfig: Record<OrderStatus, { label: string; color: 'gray' | 'blue' | 'green' | 'yellow' | 'red' | 'purple' | 'orange' }> = {
  [OrderStatus.DRAFT]: { label: 'Borrador', color: 'gray' },
  [OrderStatus.PENDING_APPROVAL]: { label: 'Pendiente Aprobación', color: 'yellow' },
  [OrderStatus.APPROVED]: { label: 'Aprobada', color: 'blue' },
  [OrderStatus.REJECTED]: { label: 'Rechazada', color: 'red' },
  [OrderStatus.ORDERED]: { label: 'Ordenada', color: 'purple' },
  [OrderStatus.PARTIALLY_RECEIVED]: { label: 'Parcialmente Recibida', color: 'orange' },
  [OrderStatus.COMPLETED]: { label: 'Completada', color: 'green' },
  [OrderStatus.CANCELLED]: { label: 'Cancelada', color: 'red' },
};

export const OrderDetailModal: React.FC<OrderDetailModalProps> = ({
  isOpen,
  onClose,
  order,
}) => {
  if (!order) return null;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: currency,
    }).format(amount);
  };

  const statusConfig_item = statusConfig[order.status];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Orden de Compra ${order.id}`}
      size="xl"
    >
      <div className="space-y-6">
        {/* Información General */}
        <div className="grid grid-cols-2 gap-6">
          <div>
            <div className="text-sm text-gray-600 mb-1">
              Proveedor
            </div>
            <div className="text-base font-semibold text-gray-900">
              {order.supplier_name}
            </div>
          </div>

          <div>
            <div className="text-sm text-gray-600 mb-1">
              Estado
            </div>
            <Badge variant={statusConfig_item.color} size="md">
              {statusConfig_item.label}
            </Badge>
          </div>

          <div>
            <div className="text-sm text-gray-600 mb-1">
              Solicitante
            </div>
            <div className="text-base text-gray-900">
              {order.requester_name}
            </div>
          </div>

          <div>
            <div className="text-sm text-gray-600 mb-1">
              Fecha de Creación
            </div>
            <div className="text-base text-gray-900">
              {formatDate(order.created_at)}
            </div>
          </div>

          {order.notes && (
            <div className="col-span-2">
              <div className="text-sm text-gray-600 mb-1">
                Notas
              </div>
              <div className="text-sm p-3 bg-gray-50 rounded-lg text-gray-900">
                {order.notes}
              </div>
            </div>
          )}
        </div>

        {/* Items */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Productos</h3>
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                    Producto
                  </th>
                  <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">
                    Cantidad
                  </th>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">
                    Precio Unitario
                  </th>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">
                    Total
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {order.items.map((item, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm text-gray-900">{item.product_name}</td>
                    <td className="px-4 py-3 text-center text-sm text-gray-900">
                      {item.quantity}
                    </td>
                    <td className="px-4 py-3 text-right text-sm text-gray-900">
                      {formatCurrency(item.unit_price, order.currency)}
                    </td>
                    <td className="px-4 py-3 text-right text-sm text-gray-900 font-semibold">
                      {formatCurrency(item.total, order.currency)}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-gray-50 border-t border-gray-200">
                <tr>
                  <td
                    colSpan={3}
                    className="px-4 py-3 text-right text-base font-semibold text-gray-900"
                  >
                    Total:
                  </td>
                  <td className="px-4 py-3 text-right text-lg font-bold text-purple-600">
                    {formatCurrency(order.total_amount, order.currency)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        {/* Historial de Auditoría */}
        {order.audit_log && order.audit_log.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Historial</h3>
            <div className="space-y-3">
              {order.audit_log.map((log, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-semibold text-gray-900">
                        {log.user}
                      </span>
                      <Badge variant="gray" size="sm">
                        {log.action}
                      </Badge>
                    </div>
                    <div className="text-xs text-gray-600">
                      {formatDate(log.timestamp)}
                    </div>
                    {log.notes && (
                      <div className="text-sm mt-1 text-gray-600">
                        {log.notes}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};

