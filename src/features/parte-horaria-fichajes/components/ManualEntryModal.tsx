// Modal para añadir/editar fichajes manualmente
import React, { useState, useEffect } from 'react';
import { Modal, Button, Input, Select, Textarea } from '../../../components/componentsreutilizables';
import { TimeEntry, ManualEntryFormData, Employee } from '../types';
import { format, parseISO } from 'date-fns';
import { Clock } from 'lucide-react';

interface ManualEntryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ManualEntryFormData) => Promise<void>;
  initialData?: Partial<TimeEntry>;
  employees: Employee[];
}

export const ManualEntryModal: React.FC<ManualEntryModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  employees,
}) => {
  const [formData, setFormData] = useState<ManualEntryFormData>({
    employeeId: '',
    clockIn: '',
    clockOut: null,
    reason: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        // Modo edición
        setFormData({
          employeeId: initialData.employee?.id || '',
          clockIn: initialData.clockIn
            ? format(parseISO(initialData.clockIn), "yyyy-MM-dd'T'HH:mm")
            : '',
          clockOut: initialData.clockOut
            ? format(parseISO(initialData.clockOut), "yyyy-MM-dd'T'HH:mm")
            : null,
          reason: initialData.audit?.reason || '',
        });
      } else {
        // Modo creación
        setFormData({
          employeeId: '',
          clockIn: format(new Date(), "yyyy-MM-dd'T'HH:mm"),
          clockOut: null,
          reason: '',
        });
      }
      setErrors({});
    }
  }, [isOpen, initialData]);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.employeeId) {
      newErrors.employeeId = 'Debe seleccionar un empleado';
    }

    if (!formData.clockIn) {
      newErrors.clockIn = 'Debe especificar la hora de entrada';
    }

    if (formData.clockOut && formData.clockIn) {
      const entrada = new Date(formData.clockIn);
      const salida = new Date(formData.clockOut);
      if (salida < entrada) {
        newErrors.clockOut = 'La salida no puede ser anterior a la entrada';
      }
    }

    if (!formData.reason.trim()) {
      newErrors.reason = 'Debe justificar la edición manual';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    setIsSubmitting(true);
    try {
      await onSubmit({
        ...formData,
        clockIn: new Date(formData.clockIn).toISOString(),
        clockOut: formData.clockOut ? new Date(formData.clockOut).toISOString() : null,
      });
      onClose();
    } catch (error) {
      console.error('Error al guardar fichaje:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const employeeOptions = employees.map(emp => ({
    value: emp.id,
    label: emp.name,
  }));

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? 'Editar Fichaje' : 'Nuevo Fichaje Manual'}
      size="lg"
      footer={
        <div className="flex space-x-3">
          <Button variant="secondary" onClick={onClose} disabled={isSubmitting}>
            Cancelar
          </Button>
          <Button 
            variant="primary" 
            onClick={handleSubmit}
            disabled={isSubmitting}
            loading={isSubmitting}
          >
            {initialData ? 'Actualizar' : 'Guardar'}
          </Button>
        </div>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Select
          label="Empleado"
          options={employeeOptions}
          placeholder="Seleccione un empleado"
          value={formData.employeeId}
          onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
          error={errors.employeeId}
          disabled={!!initialData} // No permitir cambiar empleado en edición
        />

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Hora de Entrada"
            type="datetime-local"
            value={formData.clockIn}
            onChange={(e) => setFormData({ ...formData, clockIn: e.target.value })}
            error={errors.clockIn}
            leftIcon={<Clock className="w-4 h-4" />}
          />

          <Input
            label="Hora de Salida (opcional)"
            type="datetime-local"
            value={formData.clockOut || ''}
            onChange={(e) => setFormData({ 
              ...formData, 
              clockOut: e.target.value || null 
            })}
            error={errors.clockOut}
            leftIcon={<Clock className="w-4 h-4" />}
          />
        </div>

        <Textarea
          label="Justificación"
          placeholder="Explique el motivo de esta edición manual (obligatorio)"
          value={formData.reason}
          onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
          error={errors.reason}
          rows={3}
          required
        />

        {initialData?.audit && (
          <div className="p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
            <p className="text-sm font-semibold text-amber-800 dark:text-amber-300 mb-1">
              Edición previa:
            </p>
            <p className="text-xs text-amber-700 dark:text-amber-400">
              Editado por {initialData.audit.editedBy} el{' '}
              {format(parseISO(initialData.audit.editTimestamp), 'dd/MM/yyyy HH:mm', {
                locale: es,
              })}
            </p>
            <p className="text-xs text-amber-700 dark:text-amber-400 mt-1">
              Motivo: {initialData.audit.reason}
            </p>
          </div>
        )}
      </form>
    </Modal>
  );
};

