import React from 'react';
import { MetricCards } from '../../../components/componentsreutilizables/MetricCards';
import { PurchaseOrder, OrderStatus } from '../types';
import { ClipboardList, Clock, CheckCircle, DollarSign } from 'lucide-react';

interface PurchaseOrderKPIsProps {
  orders: PurchaseOrder[];
}

export const PurchaseOrderKPIs: React.FC<PurchaseOrderKPIsProps> = ({ orders }) => {
  const pendingApproval = orders.filter((o) => o.status === OrderStatus.PENDING_APPROVAL).length;

  const approvedNotReceived = orders.filter(
    (o) =>
      o.status === OrderStatus.APPROVED ||
      o.status === OrderStatus.ORDERED ||
      o.status === OrderStatus.PARTIALLY_RECEIVED
  );

  const totalCommitted = approvedNotReceived.reduce((sum, o) => sum + o.total_amount, 0);

  const completedOrders = orders.filter((o) => o.status === OrderStatus.COMPLETED).length;

  const metrics = [
    {
      id: 'pending',
      title: 'Pendientes de Aprobación',
      value: pendingApproval.toString(),
      icon: <Clock size={20} />,
      color: 'warning' as const,
    },
    {
      id: 'committed',
      title: 'Valor Comprometido',
      value: `${totalCommitted.toFixed(2)}€`,
      icon: <DollarSign size={20} />,
      color: 'info' as const,
    },
    {
      id: 'completed',
      title: 'Órdenes Completadas',
      value: completedOrders.toString(),
      icon: <CheckCircle size={20} />,
      color: 'success' as const,
    },
    {
      id: 'total',
      title: 'Total de Órdenes',
      value: orders.length.toString(),
      icon: <ClipboardList size={20} />,
      color: 'info' as const,
    },
  ];

  return <MetricCards data={metrics} />;
};

