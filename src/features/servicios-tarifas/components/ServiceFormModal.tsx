import React, { useState, useEffect } from 'react';
import { Modal } from '../../../components/componentsreutilizables';
import { Input, Textarea, Select, SelectOption, Button } from '../../../components/componentsreutilizables';
import { Service, ServiceFormData, UserRole } from '../types';

interface ServiceFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ServiceFormData) => Promise<void>;
  initialData?: Partial<Service> | null;
  userRole: UserRole;
  categories: Array<{ id: string; name: string }>;
}

const ServiceFormModal: React.FC<ServiceFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  userRole,
  categories
}) => {
  const [formData, setFormData] = useState<ServiceFormData>({
    name: '',
    description: '',
    category: categories[0]?.id || '',
    price: 0,
    currency: 'EUR',
    serviceType: 'MEMBERSHIP',
    isRecurring: false,
    billingType: 'ONE_TIME',
    recurringInterval: undefined,
    isActive: true,
    duration: undefined,
    sessionCount: undefined,
    taxRate: 21,
    taxType: 'STANDARD',
    sku: '',
    requiresBooking: false,
    requiresResources: false
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        description: initialData.description || '',
        category: initialData.category || '',
        price: initialData.price || 0,
        currency: initialData.currency || 'EUR',
        serviceType: initialData.serviceType || 'MEMBERSHIP',
        isRecurring: initialData.isRecurring || false,
        billingType: initialData.billingType || 'ONE_TIME',
        recurringInterval: initialData.recurringInterval,
        isActive: initialData.isActive !== undefined ? initialData.isActive : true,
        duration: initialData.duration,
        sessionCount: initialData.sessionCount,
        taxRate: initialData.taxRate || 21,
        taxType: initialData.taxType || 'STANDARD',
        sku: initialData.sku || '',
        requiresBooking: initialData.requiresBooking || false,
        requiresResources: initialData.requiresResources || false
      });
    } else {
      setFormData({
        name: '',
        description: '',
        category: categories[0]?.id || '',
        price: 0,
        currency: 'EUR',
        serviceType: 'MEMBERSHIP',
        isRecurring: false,
        billingType: 'ONE_TIME',
        recurringInterval: undefined,
        isActive: true,
        duration: undefined,
        sessionCount: undefined,
        taxRate: 21,
        taxType: 'STANDARD',
        sku: '',
        requiresBooking: false,
        requiresResources: false
      });
    }
    setFormErrors({});
  }, [initialData, categories, isOpen]);

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.name.trim()) {
      errors.name = 'El nombre es obligatorio';
    }

    if (!formData.category) {
      errors.category = 'La categoría es obligatoria';
    }

    if (formData.price <= 0) {
      errors.price = 'El precio debe ser mayor a 0';
    }

    if (formData.isRecurring && !formData.recurringInterval) {
      errors.recurringInterval = 'Debe especificar el intervalo de facturación';
    }

    if (formData.serviceType === 'SESSION_PACK' && !formData.sessionCount) {
      errors.sessionCount = 'Debe especificar el número de sesiones';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(formData);
      onClose();
    } catch (error) {
      console.error('Error submitting form:', error);
      setFormErrors({ submit: 'Error al guardar el servicio. Por favor, inténtalo de nuevo.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const serviceTypeOptions: SelectOption[] = userRole === 'entrenador' 
    ? [
        { value: 'SESSION_PACK', label: 'Pack de Sesiones' },
        { value: 'CONSULTATION', label: 'Consulta' },
        { value: 'ONLINE_PROGRAM', label: 'Programa Online' },
        { value: 'MEMBERSHIP', label: 'Membresía' }
      ]
    : [
        { value: 'MEMBERSHIP', label: 'Membresía' },
        { value: 'SESSION_PACK', label: 'Pack de Sesiones' },
        { value: 'SINGLE_CLASS', label: 'Clase Suelta' },
        { value: 'PRODUCT', label: 'Producto' },
        { value: 'CONSULTATION', label: 'Consulta' },
        { value: 'ONLINE_PROGRAM', label: 'Programa Online' }
      ];

  const billingTypeOptions: SelectOption[] = [
    { value: 'ONE_TIME', label: 'Pago único' },
    { value: 'RECURRING', label: 'Recurrente' }
  ];

  const recurringIntervalOptions: SelectOption[] = [
    { value: 'MONTHLY', label: 'Mensual' },
    { value: 'QUARTERLY', label: 'Trimestral' },
    { value: 'YEARLY', label: 'Anual' }
  ];

  const taxTypeOptions: SelectOption[] = [
    { value: 'STANDARD', label: 'Estándar (21%)' },
    { value: 'REDUCED', label: 'Reducido (10%)' },
    { value: 'EXEMPT', label: 'Exento (0%)' }
  ];

  const categoryOptions: SelectOption[] = categories.map(cat => ({
    value: cat.id,
    label: cat.name
  }));

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? 'Editar Servicio' : 'Crear Nuevo Servicio'}
      size="lg"
      footer={
        <div className="flex space-x-3">
          <Button variant="secondary" onClick={onClose} disabled={isSubmitting}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleSubmit} loading={isSubmitting}>
            {initialData ? 'Actualizar' : 'Crear'} Servicio
          </Button>
        </div>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Nombre del Servicio"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            error={formErrors.name}
            required
            fullWidth
          />
          
          <Select
            label="Categoría"
            options={categoryOptions}
            value={formData.category}
            onChange={(value) => setFormData({ ...formData, category: value })}
            error={formErrors.category}
            required
            fullWidth
          />
        </div>

        <Textarea
          label="Descripción"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          rows={3}
          fullWidth
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Select
            label="Tipo de Servicio"
            options={serviceTypeOptions}
            value={formData.serviceType}
            onChange={(value) => setFormData({ ...formData, serviceType: value as any })}
            required
            fullWidth
          />

          <Input
            label="Precio"
            type="number"
            step="0.01"
            min="0"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
            error={formErrors.price}
            required
            fullWidth
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Select
            label="Tipo de Facturación"
            options={billingTypeOptions}
            value={formData.billingType}
            onChange={(value) => {
              const isRecurring = value === 'RECURRING';
              setFormData({
                ...formData,
                billingType: value as any,
                isRecurring,
                recurringInterval: isRecurring ? formData.recurringInterval : undefined
              });
            }}
            required
            fullWidth
          />

          {formData.isRecurring && (
            <Select
              label="Intervalo de Facturación"
              options={recurringIntervalOptions}
              value={formData.recurringInterval || ''}
              onChange={(value) => setFormData({ ...formData, recurringInterval: value as any })}
              error={formErrors.recurringInterval}
              required
              fullWidth
            />
          )}
        </div>

        {formData.serviceType === 'SESSION_PACK' && (
          <Input
            label="Número de Sesiones"
            type="number"
            min="1"
            value={formData.sessionCount || ''}
            onChange={(e) => setFormData({ ...formData, sessionCount: parseInt(e.target.value) || undefined })}
            error={formErrors.sessionCount}
            fullWidth
          />
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {(formData.serviceType === 'SINGLE_CLASS' || 
            formData.serviceType === 'SESSION_PACK' || 
            formData.serviceType === 'CONSULTATION') && (
            <Input
              label="Duración (minutos)"
              type="number"
              min="1"
              value={formData.duration || ''}
              onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) || undefined })}
              fullWidth
            />
          )}

          <Select
            label="Tipo de IVA"
            options={taxTypeOptions}
            value={formData.taxType}
            onChange={(value) => setFormData({ ...formData, taxType: value as any })}
            fullWidth
          />

          <Input
            label="% IVA"
            type="number"
            step="0.1"
            min="0"
            max="100"
            value={formData.taxRate}
            onChange={(e) => setFormData({ ...formData, taxRate: parseFloat(e.target.value) || 0 })}
            fullWidth
          />
        </div>

        <Input
          label="SKU (Código de producto)"
          value={formData.sku}
          onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
          placeholder="Opcional"
          fullWidth
        />

        <div className="flex items-center space-x-6">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={formData.isActive}
              onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
              className="rounded border-gray-300"
            />
            <span className="text-sm font-medium text-gray-700">Servicio activo</span>
          </label>

          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={formData.requiresBooking}
              onChange={(e) => setFormData({ ...formData, requiresBooking: e.target.checked })}
              className="rounded border-gray-300"
            />
            <span className="text-sm font-medium text-gray-700">Requiere reserva</span>
          </label>

          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={formData.requiresResources}
              onChange={(e) => setFormData({ ...formData, requiresResources: e.target.checked })}
              className="rounded border-gray-300"
            />
            <span className="text-sm font-medium text-gray-700">Requiere recursos</span>
          </label>
        </div>

        {formErrors.submit && (
          <div className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">
            {formErrors.submit}
          </div>
        )}
      </form>
    </Modal>
  );
};

export default ServiceFormModal;

