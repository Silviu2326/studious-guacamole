// Modal para agregar ajustes manuales (bonos, deducciones, anticipos)
import React, { useState } from 'react';
import { Modal, Button, Input, Select, Textarea } from '../../../components/componentsreutilizables';
import { AdjustmentData } from '../types';
import { SelectOption } from '../../../components/componentsreutilizables';

interface PayrollAdjustmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (adjustment: AdjustmentData) => Promise<void>;
  employeeName: string;
  employeeId: string;
}

export const PayrollAdjustmentModal: React.FC<PayrollAdjustmentModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  employeeName,
  employeeId,
}) => {
  const [adjustmentType, setAdjustmentType] = useState<'bonus' | 'deduction' | 'advance'>('bonus');
  const [amount, setAmount] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const adjustmentTypeOptions: SelectOption[] = [
    { value: 'bonus', label: 'Bono' },
    { value: 'deduction', label: 'Deducción' },
    { value: 'advance', label: 'Anticipo' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validaciones
    if (!amount || parseFloat(amount) <= 0) {
      setError('El monto debe ser mayor a 0');
      return;
    }

    if (!description.trim()) {
      setError('La descripción es obligatoria');
      return;
    }

    setIsSubmitting(true);

    try {
      const adjustment: AdjustmentData = {
        employeeId,
        type: adjustmentType,
        amount: parseFloat(amount),
        description: description.trim(),
      };

      await onSubmit(adjustment);
      
      // Resetear formulario
      setAmount('');
      setDescription('');
      setAdjustmentType('bonus');
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al agregar el ajuste');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setAmount('');
      setDescription('');
      setAdjustmentType('bonus');
      setError(null);
      onClose();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={`Agregar Ajuste - ${employeeName}`}
      size="md"
      footer={
        <div className="flex gap-3">
          <Button variant="secondary" onClick={handleClose} disabled={isSubmitting}>
            Cancelar
          </Button>
          <Button
            variant="primary"
            onClick={handleSubmit}
            loading={isSubmitting}
            type="submit"
          >
            Agregar Ajuste
          </Button>
        </div>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {error}
          </div>
        )}

        <Select
          label="Tipo de Ajuste"
          options={adjustmentTypeOptions}
          value={adjustmentType}
          onChange={(e) => setAdjustmentType(e.target.value as 'bonus' | 'deduction' | 'advance')}
          required
        />

        <Input
          label="Monto"
          type="number"
          step="0.01"
          min="0"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="0.00"
          required
          helperText={
            adjustmentType === 'bonus'
              ? 'Ingrese el monto del bono'
              : adjustmentType === 'deduction'
              ? 'Ingrese el monto a deducir'
              : 'Ingrese el monto del anticipo'
          }
        />

        <Textarea
          label="Descripción"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Ej: Bono por rendimiento excepcional, Anticipo del próximo mes..."
          required
          rows={4}
        />
      </form>
    </Modal>
  );
};

