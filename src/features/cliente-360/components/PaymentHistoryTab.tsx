import React, { useState, useEffect } from 'react';
import { Card, Badge } from '../../../components/componentsreutilizables';
import { PaymentHistory } from '../types';
import { getPaymentHistory } from '../api/client360';
import { Loader2, CreditCard, Calendar, Download, CheckCircle, Clock, XCircle } from 'lucide-react';

interface PaymentHistoryTabProps {
  clientId: string;
}

export const PaymentHistoryTab: React.FC<PaymentHistoryTabProps> = ({ clientId }) => {
  const [payments, setPayments] = useState<PaymentHistory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPayments();
  }, [clientId]);

  const loadPayments = async () => {
    setLoading(true);
    try {
      const data = await getPaymentHistory(clientId);
      setPayments(data);
    } catch (error) {
      console.error('Error cargando historial de pagos:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric'
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid':
        return <CheckCircle size={18} className="text-green-600" />;
      case 'pending':
        return <Clock size={18} className="text-yellow-600" />;
      case 'failed':
        return <XCircle size={18} className="text-red-600" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string) => {
    const statusLabels = {
      paid: 'Pagado',
      pending: 'Pendiente',
      failed: 'Fallido'
    };
    
    const statusVariants = {
      paid: 'green' as const,
      pending: 'yellow' as const,
      failed: 'red' as const
    };

    return (
      <Badge variant={statusVariants[status as keyof typeof statusVariants]}>
        {statusLabels[status as keyof typeof statusLabels]}
      </Badge>
    );
  };

  const getMethodLabel = (method: string) => {
    const methodLabels = {
      card: 'Tarjeta',
      cash: 'Efectivo',
      transfer: 'Transferencia',
      other: 'Otro'
    };
    return methodLabels[method as keyof typeof methodLabels] || method;
  };

  if (loading) {
    return (
      <div className="p-8 text-center">
        <Loader2 size={48} className="mx-auto text-blue-500 animate-spin mb-4" />
        <p className="text-gray-600">Cargando historial de pagos...</p>
      </div>
    );
  }

  if (payments.length === 0) {
    return (
      <div className="p-8 text-center">
        <CreditCard size={48} className="mx-auto text-gray-400 mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No hay pagos registrados</h3>
        <p className="text-gray-600">Aún no se han registrado pagos para este cliente</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 p-6">
      {payments.map((payment) => (
        <Card key={payment.id} className="p-4 bg-white shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                {getStatusIcon(payment.status)}
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold text-gray-900">
                      €{payment.amount.toFixed(2)}
                    </span>
                    {getStatusBadge(payment.status)}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                    <Calendar size={14} />
                    <span>{formatDate(payment.date)}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-3 mt-3">
                <div className="flex items-center gap-2 text-sm">
                  <CreditCard size={14} className="text-gray-400" />
                  <span className="text-gray-700">{getMethodLabel(payment.method)}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-gray-400">•</span>
                  <span className="text-gray-600 capitalize">{payment.type}</span>
                </div>
              </div>
            </div>

            {payment.invoiceUrl && (
              <a
                href={payment.invoiceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              >
                <Download size={18} />
              </a>
            )}
          </div>
        </Card>
      ))}
    </div>
  );
};

