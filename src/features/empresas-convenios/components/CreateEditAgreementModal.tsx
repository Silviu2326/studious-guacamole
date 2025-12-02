import React, { useState, useEffect } from 'react';
import { Modal, Input, Select, Button } from '../../../components/componentsreutilizables';
import { CorporateAgreement, AgreementFormData, DiscountType } from '../types';

interface CreateEditAgreementModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: AgreementFormData) => Promise<void>;
  initialData?: Partial<CorporateAgreement>;
}

export const CreateEditAgreementModal: React.FC<CreateEditAgreementModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
}) => {
  const [formData, setFormData] = useState<AgreementFormData>({
    companyName: '',
    contactPerson: '',
    contactEmail: '',
    contactPhone: '',
    discountType: 'percentage',
    discountValue: 0,
    validFrom: '',
    validUntil: '',
    applicablePlans: [],
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        companyName: initialData.companyName || '',
        contactPerson: initialData.contactPerson || '',
        contactEmail: initialData.contactEmail || '',
        contactPhone: initialData.contactPhone || '',
        discountType: initialData.discountType || 'percentage',
        discountValue: initialData.discountValue || 0,
        validFrom: initialData.validFrom ? initialData.validFrom.split('T')[0] : '',
        validUntil: initialData.validUntil ? initialData.validUntil.split('T')[0] : '',
        applicablePlans: initialData.applicablePlans || [],
      });
    } else {
      // Reset form for new agreement
      setFormData({
        companyName: '',
        contactPerson: '',
        contactEmail: '',
        contactPhone: '',
        discountType: 'percentage',
        discountValue: 0,
        validFrom: '',
        validUntil: '',
        applicablePlans: [],
      });
    }
    setErrors({});
  }, [initialData, isOpen]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.companyName.trim()) {
      newErrors.companyName = 'El nombre de la empresa es requerido';
    }

    if (formData.discountValue <= 0) {
      newErrors.discountValue = 'El valor del descuento debe ser mayor a 0';
    }

    if (formData.discountType === 'percentage' && formData.discountValue > 100) {
      newErrors.discountValue = 'El porcentaje no puede ser mayor a 100%';
    }

    if (!formData.validFrom) {
      newErrors.validFrom = 'La fecha de inicio es requerida';
    }

    if (!formData.validUntil) {
      newErrors.validUntil = 'La fecha de fin es requerida';
    }

    if (formData.validFrom && formData.validUntil) {
      const startDate = new Date(formData.validFrom);
      const endDate = new Date(formData.validUntil);
      if (endDate <= startDate) {
        newErrors.validUntil = 'La fecha de fin debe ser posterior a la fecha de inicio';
      }
    }

    if (formData.contactEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.contactEmail)) {
      newErrors.contactEmail = 'El email no es válido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      // Convert dates to ISO strings
      const submitData: AgreementFormData = {
        ...formData,
        validFrom: new Date(formData.validFrom).toISOString(),
        validUntil: new Date(formData.validUntil).toISOString(),
      };

      await onSubmit(submitData);
      onClose();
    } catch (error) {
      console.error('Error al guardar el convenio:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const discountTypeOptions = [
    { value: 'percentage', label: 'Porcentaje (%)' },
    { value: 'fixed', label: 'Tarifa Fija ($)' },
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? 'Editar Convenio' : 'Crear Nuevo Convenio'}
      size="lg"
      footer={
        <div className="flex gap-3 justify-end">
          <Button variant="secondary" onClick={onClose} disabled={isSubmitting}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleSubmit} loading={isSubmitting}>
            {initialData ? 'Actualizar' : 'Crear'}
          </Button>
        </div>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Información de la Empresa */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Información de la Empresa
          </h3>

          <Input
            label="Nombre de la Empresa"
            value={formData.companyName}
            onChange={(e) =>
              setFormData({ ...formData, companyName: e.target.value })
            }
            error={errors.companyName}
            required
          />

          <Input
            label="Persona de Contacto"
            value={formData.contactPerson || ''}
            onChange={(e) =>
              setFormData({ ...formData, contactPerson: e.target.value })
            }
            error={errors.contactPerson}
          />

          <Input
            label="Email de Contacto"
            type="email"
            value={formData.contactEmail || ''}
            onChange={(e) =>
              setFormData({ ...formData, contactEmail: e.target.value })
            }
            error={errors.contactEmail}
          />

          <Input
            label="Teléfono de Contacto"
            type="tel"
            value={formData.contactPhone || ''}
            onChange={(e) =>
              setFormData({ ...formData, contactPhone: e.target.value })
            }
            error={errors.contactPhone}
          />
        </div>

        {/* Términos del Convenio */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Términos del Convenio
          </h3>

          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Tipo de Descuento"
              value={formData.discountType}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  discountType: e.target.value as DiscountType,
                })
              }
              options={discountTypeOptions}
              error={errors.discountType}
            />

            <Input
              label={
                formData.discountType === 'percentage'
                  ? 'Valor del Descuento (%)'
                  : 'Valor del Descuento ($)'
              }
              type="number"
              min="0"
              max={formData.discountType === 'percentage' ? '100' : undefined}
              step={formData.discountType === 'percentage' ? '0.1' : '0.01'}
              value={formData.discountValue.toString()}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  discountValue: parseFloat(e.target.value) || 0,
                })
              }
              error={errors.discountValue}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Fecha de Inicio"
              type="date"
              value={formData.validFrom}
              onChange={(e) =>
                setFormData({ ...formData, validFrom: e.target.value })
              }
              error={errors.validFrom}
              required
            />

            <Input
              label="Fecha de Fin"
              type="date"
              value={formData.validUntil}
              onChange={(e) =>
                setFormData({ ...formData, validUntil: e.target.value })
              }
              error={errors.validUntil}
              required
            />
          </div>
        </div>
      </form>
    </Modal>
  );
};

