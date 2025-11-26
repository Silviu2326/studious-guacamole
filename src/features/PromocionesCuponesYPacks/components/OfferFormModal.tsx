import React, { useState } from 'react';
import {
  Offer,
  OfferType,
  DiscountType,
  OfferStatus
} from '../api/offers';
import { Save, Tag, Package, Zap } from 'lucide-react';
import { Modal } from '../../../components/componentsreutilizables';
import { Button } from '../../../components/componentsreutilizables';

interface OfferFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (offerData: Partial<Offer>) => void;
  initialData?: Offer | null;
  availableServices?: string[];
}

export const OfferFormModal: React.FC<OfferFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  availableServices = []
}) => {
  const [formData, setFormData] = useState<Partial<Offer>>({
    name: initialData?.name || '',
    type: initialData?.type || 'coupon',
    code: initialData?.code || '',
    discountType: initialData?.discountType || 'percentage',
    discountValue: initialData?.discountValue || 0,
    usageLimit: initialData?.usageLimit,
    validFrom: initialData?.validFrom || new Date().toISOString().split('T')[0],
    validTo: initialData?.validTo?.split('T')[0],
    description: initialData?.description || '',
    status: initialData?.status || 'active'
  });

  const [selectedServices, setSelectedServices] = useState<string[]>(
    initialData?.applicableServices || []
  );

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const handleInputChange = (field: keyof Offer, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (formErrors[field]) {
      setFormErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleToggleService = (service: string) => {
    setSelectedServices(prev =>
      prev.includes(service)
        ? prev.filter(s => s !== service)
        : [...prev, service]
    );
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (!formData.name?.trim()) {
      errors.name = 'El nombre es obligatorio';
    }

    if (formData.type === 'coupon' && !formData.code?.trim()) {
      errors.code = 'El código es obligatorio para cupones';
    }

    if (!formData.discountValue || formData.discountValue <= 0) {
      errors.discountValue = 'El valor del descuento debe ser mayor a 0';
    }

    if (formData.discountType === 'percentage' && formData.discountValue > 100) {
      errors.discountValue = 'El porcentaje no puede ser mayor a 100';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    onSubmit({
      ...formData,
      applicableServices: selectedServices
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? 'Editar Oferta' : 'Nueva Oferta'}
      size="lg"
      footer={
        <div className="flex justify-end gap-3">
          <Button variant="secondary" onClick={onClose} type="button">
            Cancelar
          </Button>
          <Button
            variant="primary"
            onClick={(e) => {
              e.preventDefault();
              const form = document.getElementById('offer-form') as HTMLFormElement;
              if (form) {
                form.requestSubmit();
              }
            }}
            leftIcon={<Save size={16} />}
          >
            Guardar
          </Button>
        </div>
      }
    >
      <form id="offer-form" onSubmit={handleSubmit} className="space-y-6">
          {/* Type Selection */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-3">
              Tipo de Oferta *
            </label>
            <div className="grid grid-cols-3 gap-4">
              {[
                { value: 'coupon', label: 'Cupón', icon: Tag },
                { value: 'pack', label: 'Pack', icon: Package },
                { value: 'automatic', label: 'Automática', icon: Zap }
              ].map(({ value, label, icon: Icon }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => handleInputChange('type', value)}
                  className={`flex flex-col items-center gap-2 p-4 border-2 rounded-xl transition-all ${
                    formData.type === value
                      ? 'border-blue-600 bg-blue-50 ring-2 ring-blue-200'
                      : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <Icon className={`w-6 h-6 ${formData.type === value ? 'text-blue-600' : 'text-slate-600'}`} />
                  <span className={`text-sm font-medium ${formData.type === value ? 'text-blue-900' : 'text-slate-900'}`}>{label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Basic Info */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Nombre *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5"
              />
              {formErrors.name && (
                <p className="text-red-600 text-xs mt-1">{formErrors.name}</p>
              )}
            </div>

            {formData.type === 'coupon' && (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Código *
                </label>
                <input
                  type="text"
                  value={formData.code}
                  onChange={(e) => handleInputChange('code', e.target.value.toUpperCase())}
                  placeholder="EJ: CUPON20"
                  className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5 font-mono"
                />
                {formErrors.code && (
                  <p className="text-red-600 text-xs mt-1">{formErrors.code}</p>
                )}
              </div>
            )}
          </div>

          {/* Discount */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Tipo de Descuento *
              </label>
              <select
                value={formData.discountType}
                onChange={(e) => handleInputChange('discountType', e.target.value)}
                className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5"
              >
                <option value="percentage">Porcentaje (%)</option>
                <option value="fixed_amount">Cantidad Fija (€)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Valor *
              </label>
              <input
                type="number"
                value={formData.discountValue}
                onChange={(e) => handleInputChange('discountValue', parseFloat(e.target.value) || 0)}
                className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5"
              />
              {formErrors.discountValue && (
                <p className="text-red-600 text-xs mt-1">{formErrors.discountValue}</p>
              )}
            </div>
          </div>

          {/* Usage Limits */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Límite Total de Usos
              </label>
              <input
                type="number"
                value={formData.usageLimit}
                onChange={(e) => handleInputChange('usageLimit', parseInt(e.target.value) || undefined)}
                placeholder="Sin límite"
                className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5"
              />
            </div>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Fecha de Inicio *
              </label>
              <input
                type="date"
                value={formData.validFrom}
                onChange={(e) => handleInputChange('validFrom', e.target.value)}
                className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Fecha de Fin
              </label>
              <input
                type="date"
                value={formData.validTo}
                onChange={(e) => handleInputChange('validTo', e.target.value)}
                className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5"
              />
            </div>
          </div>

          {/* Applicable Services */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-3">
              Aplicable a Servicios
            </label>
            <div className="grid grid-cols-2 gap-2">
              {availableServices.map((service) => (
                <label key={service} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedServices.includes(service)}
                    onChange={() => handleToggleService(service)}
                    className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm text-slate-700">{service}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Descripción
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              rows={3}
              className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5"
            />
          </div>
        </form>
    </Modal>
  );
};

