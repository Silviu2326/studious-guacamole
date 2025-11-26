import React, { useState } from 'react';
import { Modal, Button, Input, Select, Textarea } from '../../../components/componentsreutilizables';
import { FacturacionService } from '../api/facturacionService';
import { Factura } from '../types';

interface RegisterPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
  invoice: Factura;
}

export const RegisterPaymentModal: React.FC<RegisterPaymentModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  invoice
}) => {
  const [amount, setAmount] = useState(invoice.balanceDue.toString());
  const [paymentDate, setPaymentDate] = useState(new Date().toISOString().split('T')[0]);
  const [method, setMethod] = useState<'bank_transfer' | 'cash' | 'credit_card' | 'check'>('bank_transfer');
  const [transactionId, setTransactionId] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = async () => {
    const newErrors: Record<string, string> = {};

    const amountNum = parseFloat(amount);
    if (!amountNum || amountNum <= 0) {
      newErrors.amount = 'El monto debe ser mayor a 0';
    }
    if (amountNum > invoice.balanceDue) {
      newErrors.amount = 'El monto no puede exceder el saldo pendiente';
    }
    if (!paymentDate) {
      newErrors.paymentDate = 'Fecha de pago requerida';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    try {
      await FacturacionService.registrarPago({
        invoiceId: invoice.id,
        amount: amountNum,
        paymentDate: new Date(paymentDate),
        method,
        transactionId: transactionId || undefined,
        notes: notes || undefined
      });
      onSubmit();
    } catch (error: any) {
      console.error('Error registrando pago:', error);
      alert(error.message || 'Error al registrar el pago');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  const methodOptions = [
    { value: 'bank_transfer', label: 'Transferencia Bancaria' },
    { value: 'cash', label: 'Efectivo' },
    { value: 'credit_card', label: 'Tarjeta de Crédito' },
    { value: 'check', label: 'Cheque' }
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Registrar Pago"
      size="md"
      footer={
        <div className="flex gap-3 justify-end">
          <Button variant="secondary" onClick={onClose}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleSubmit} loading={loading}>
            Registrar Pago
          </Button>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Información de la factura */}
        <div className="rounded-2xl bg-blue-50 ring-1 ring-blue-200/70 p-4">
          <div className="text-sm font-medium text-blue-600 mb-3">
            Información de la Factura
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-slate-600">Número:</span>
              <span className="font-semibold text-slate-900">{invoice.invoiceNumber}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Empresa:</span>
              <span className="font-semibold text-slate-900">{invoice.company.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Total:</span>
              <span className="font-semibold text-slate-900">{formatCurrency(invoice.totalAmount)}</span>
            </div>
            <div className="flex justify-between border-t border-slate-200 pt-2 mt-2">
              <span className="text-orange-600 font-semibold">Saldo Pendiente:</span>
              <span className="text-orange-600 font-bold text-lg">
                {formatCurrency(invoice.balanceDue)}
              </span>
            </div>
          </div>
        </div>

        {/* Detalles del pago */}
        <div className="space-y-4">
          <Input
            label="Monto del Pago *"
            type="number"
            step="0.01"
            min="0.01"
            max={invoice.balanceDue}
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            error={errors.amount}
            helperText={`Máximo: ${formatCurrency(invoice.balanceDue)}`}
          />

          <Input
            label="Fecha de Pago *"
            type="date"
            value={paymentDate}
            onChange={(e) => setPaymentDate(e.target.value)}
            error={errors.paymentDate}
          />

          <Select
            label="Método de Pago *"
            options={methodOptions}
            value={method}
            onChange={(e) => setMethod(e.target.value as any)}
          />

          <Input
            label="ID de Transacción"
            value={transactionId}
            onChange={(e) => setTransactionId(e.target.value)}
            placeholder="Ej: TRF-BANK-123456"
            helperText="Opcional: referencia de la transacción"
          />

          <Textarea
            label="Notas"
            rows={3}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Notas adicionales (opcional)"
          />
        </div>
      </div>
    </Modal>
  );
};

