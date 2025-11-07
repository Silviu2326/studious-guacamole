import React from 'react';
import { Card, Badge, Button } from '../../../components/componentsreutilizables';
import { EstadoPago, Pago } from '../types';
import { CreditCard, Calendar, DollarSign, Send } from 'lucide-react';

interface EstadoPagoProps {
  membresiaId: string;
  estado: EstadoPago;
  ultimoPago?: Pago;
  proximoVencimiento?: string;
  onProcessPayment?: (membresiaId: string) => void;
  onSendReminder?: (membresiaId: string) => void;
}

export const EstadoPagoComponent: React.FC<EstadoPagoProps> = ({
  membresiaId,
  estado,
  ultimoPago,
  proximoVencimiento,
  onProcessPayment,
  onSendReminder,
}) => {
  const getEstadoColor = (estado: EstadoPago): 'green' | 'yellow' | 'red' | 'gray' => {
    switch (estado) {
      case 'pagado':
        return 'green';
      case 'pendiente':
        return 'yellow';
      case 'vencido':
        return 'red';
      case 'suspendido':
        return 'gray';
      default:
        return 'gray';
    }
  };

  const getEstadoLabel = (estado: EstadoPago): string => {
    switch (estado) {
      case 'pagado':
        return 'Al día';
      case 'pendiente':
        return 'Pendiente';
      case 'vencido':
        return 'Vencido';
      case 'suspendido':
        return 'Suspendido';
      default:
        return 'Desconocido';
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatCurrency = (amount: number) => {
    return `${amount.toFixed(2)} €`;
  };

  const formatMetodoPago = (metodo: string) => {
    const metodos: Record<string, string> = {
      efectivo: 'Efectivo',
      tarjeta: 'Tarjeta',
      transferencia: 'Transferencia',
      otro: 'Otro',
    };
    return metodos[metodo] || metodo;
  };

  return (
    <Card className="bg-white shadow-sm">
      <div className="p-4 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">
            Estado de Pago
          </h3>
          <Badge variant={getEstadoColor(estado)} size="md">
            {getEstadoLabel(estado)}
          </Badge>
        </div>

        {ultimoPago && (
          <div className="rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-gradient-to-br from-green-600 to-green-700 rounded-xl flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-600">
                  Último Pago
                </p>
                <p className="text-lg font-bold text-gray-900">
                  {formatCurrency(ultimoPago.monto)}
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-600 mb-1">
                  Fecha
                </p>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-slate-500" />
                  <p className="text-sm text-gray-900">
                    {formatDate(ultimoPago.fecha)}
                  </p>
                </div>
              </div>
              <div>
                <p className="text-xs text-gray-600 mb-1">
                  Método
                </p>
                <div className="flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-slate-500" />
                  <p className="text-sm text-gray-900">
                    {formatMetodoPago(ultimoPago.metodoPago)}
                  </p>
                </div>
              </div>
            </div>
            {ultimoPago.referencia && (
              <div className="mt-3 pt-3 border-t border-slate-200">
                <p className="text-xs text-gray-600">
                  Referencia: {ultimoPago.referencia}
                </p>
              </div>
            )}
          </div>
        )}

        {proximoVencimiento && (
          <div className="rounded-2xl bg-blue-50 ring-1 ring-blue-200 p-4">
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-xs font-semibold text-gray-600">
                  Próximo Vencimiento
                </p>
                <p className="text-sm font-semibold text-gray-900">
                  {formatDate(proximoVencimiento)}
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="flex gap-3">
          {estado === 'vencido' && onProcessPayment && (
            <Button
              variant="primary"
              size="md"
              onClick={() => onProcessPayment(membresiaId)}
              className="flex-1"
            >
              <CreditCard className="w-4 h-4 mr-2" />
              Procesar Pago
            </Button>
          )}
          {estado === 'pendiente' && onSendReminder && (
            <Button
              variant="secondary"
              size="md"
              onClick={() => onSendReminder(membresiaId)}
              className="flex-1"
            >
              <Send className="w-4 h-4 mr-2" />
              Enviar Recordatorio
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
};

