import React from 'react';
import { TableWithActions, Badge } from '../../../components/componentsreutilizables';
import { Factura } from '../types';
import { 
  Download, 
  Send, 
  X, 
  DollarSign,
  FileText
} from 'lucide-react';

interface FacturasTableProps {
  data: Factura[];
  loading: boolean;
  onRegisterPayment: (invoiceId: string) => void;
  onEnviar: (invoiceId: string) => void;
  onAnular: (invoiceId: string) => void;
  onDownloadPDF: (invoiceId: string) => void;
}

export const FacturasTable: React.FC<FacturasTableProps> = ({
  data,
  loading,
  onRegisterPayment,
  onEnviar,
  onAnular,
  onDownloadPDF
}) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 2
    }).format(amount);
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('es-ES');
  };

  const getStatusBadge = (status: Factura['status']) => {
    const variants = {
      draft: { variant: 'secondary' as const, label: 'Borrador' },
      sent: { variant: 'primary' as const, label: 'Enviada' },
      paid: { variant: 'success' as const, label: 'Pagada' },
      partially_paid: { variant: 'warning' as const, label: 'Pago Parcial' },
      overdue: { variant: 'error' as const, label: 'Vencida' },
      void: { variant: 'secondary' as const, label: 'Anulada' }
    };

    const config = variants[status];
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const columns = [
    {
      key: 'invoiceNumber',
      label: 'Número',
      sortable: true,
      render: (value: string) => (
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-gray-400" />
          <span className="font-mono font-semibold">{value}</span>
        </div>
      )
    },
    {
      key: 'company',
      label: 'Empresa',
      sortable: true,
      render: (value: any) => (
        <span className="font-medium">{value.name}</span>
      )
    },
    {
      key: 'issueDate',
      label: 'Fecha Emisión',
      sortable: true,
      render: (value: Date) => formatDate(value)
    },
    {
      key: 'dueDate',
      label: 'Fecha Vencimiento',
      sortable: true,
      render: (value: Date) => formatDate(value)
    },
    {
      key: 'totalAmount',
      label: 'Total',
      sortable: true,
      render: (value: number) => (
        <span className="font-semibold">{formatCurrency(value)}</span>
      )
    },
    {
      key: 'balanceDue',
      label: 'Saldo Pendiente',
      sortable: true,
      render: (value: number) => (
        <span className={value > 0 ? 'text-orange-600 font-semibold' : 'text-green-600 font-semibold'}>
          {formatCurrency(value)}
        </span>
      )
    },
    {
      key: 'status',
      label: 'Estado',
      sortable: true,
      render: (value: Factura['status']) => getStatusBadge(value)
    }
  ];

  return (
    <div>
      <TableWithActions
        data={data}
        columns={columns}
        loading={loading}
        emptyMessage="No hay facturas disponibles"
        actions={[
          {
            label: 'Registrar Pago',
            icon: <DollarSign className="w-4 h-4" />,
            variant: 'primary',
            onClick: (row: Factura) => onRegisterPayment(row.id),
            visible: (row: Factura) => row.status !== 'paid' && row.status !== 'void' && row.balanceDue > 0
          },
          {
            label: 'Enviar',
            icon: <Send className="w-4 h-4" />,
            variant: 'secondary',
            onClick: (row: Factura) => onEnviar(row.id),
            visible: (row: Factura) => row.status === 'draft'
          },
          {
            label: 'Descargar PDF',
            icon: <Download className="w-4 h-4" />,
            variant: 'ghost',
            onClick: (row: Factura) => onDownloadPDF(row.id)
          },
          {
            label: 'Anular',
            icon: <X className="w-4 h-4" />,
            variant: 'destructive',
            onClick: (row: Factura) => onAnular(row.id),
            visible: (row: Factura) => row.status !== 'paid' && row.status !== 'void'
          }
        ]}
      />
    </div>
  );
};

