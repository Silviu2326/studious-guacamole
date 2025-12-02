import React, { useState } from 'react';
import { Partner, PartnerType, CommissionType } from '../api/partnerships';
import { UserPlus } from 'lucide-react';
import { Modal, Button } from '../../../components/componentsreutilizables';

interface AddPartnerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPartnerAdded: (newPartner: Partner) => void;
}

export const AddPartnerModal: React.FC<AddPartnerModalProps> = ({
  isOpen,
  onClose,
  onPartnerAdded
}) => {
  const [formData, setFormData] = useState({
    name: '',
    type: 'professional' as PartnerType,
    specialty: '',
    email: '',
    phone: '',
    instagram: '',
    commissionType: 'percentage' as CommissionType,
    commissionValue: 0,
    terms: ''
  });

  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (validationErrors[field]) {
      setValidationErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (!formData.name.trim()) {
      errors.name = 'El nombre es obligatorio';
    }

    if (!formData.email.trim() && !formData.phone.trim() && !formData.instagram.trim()) {
      errors.contact = 'Debe proporcionar al menos un método de contacto';
    }

    if (formData.commissionValue <= 0) {
      errors.commissionValue = 'El valor de la comisión debe ser mayor a 0';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
    }

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const newPartner: Omit<Partner, 'id' | 'stats'> = {
        name: formData.name,
        type: formData.type,
        specialty: formData.specialty || undefined,
        contact: {
          email: formData.email || undefined,
          phone: formData.phone || undefined,
          instagram: formData.instagram || undefined
        },
        agreement: {
          commissionType: formData.commissionType,
          commissionValue: formData.commissionValue,
          terms: formData.terms || undefined,
          effectiveDate: new Date().toISOString()
        },
        status: 'active'
      };

      // Aquí llamaríamos a la API
      onPartnerAdded(newPartner as any);
      
      // Reset form
      setFormData({
        name: '',
        type: 'professional',
        specialty: '',
        email: '',
        phone: '',
        instagram: '',
        commissionType: 'percentage',
        commissionValue: 0,
        terms: ''
      });
      
      onClose();
    } catch (err: any) {
      alert('Error al crear el partner: ' + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formRef = React.useRef<HTMLFormElement>(null);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 rounded-xl">
            <UserPlus size={20} className="text-blue-600" />
          </div>
          <span>Añadir Nuevo Partner</span>
        </div>
      }
      size="lg"
      footer={
        <div className="flex justify-end gap-3">
          <Button variant="secondary" onClick={onClose}>
            Cancelar
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              if (formRef.current) {
                formRef.current.requestSubmit();
              } else {
                handleSubmit();
              }
            }}
            disabled={isSubmitting}
            loading={isSubmitting}
          >
            {isSubmitting ? 'Creando...' : 'Crear Partner'}
          </Button>
        </div>
      }
    >
      <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Información Básica</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Nombre *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Ej: Ana Morales - Nutricionista"
                className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-4 py-2.5"
              />
              {validationErrors.name && (
                <p className="text-red-600 text-sm mt-1">{validationErrors.name}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Tipo de Partner *
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => handleInputChange('type', e.target.value as PartnerType)}
                  className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-4 py-2.5"
                >
                  <option value="professional">Profesional</option>
                  <option value="influencer">Influencer</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Especialidad
                </label>
                <input
                  type="text"
                  value={formData.specialty}
                  onChange={(e) => handleInputChange('specialty', e.target.value)}
                  placeholder="Ej: Nutrición Deportiva"
                  className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-4 py-2.5"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Contact Info */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Información de Contacto</h3>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-4 py-2.5"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Teléfono</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-4 py-2.5"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Instagram</label>
              <input
                type="text"
                value={formData.instagram}
                onChange={(e) => handleInputChange('instagram', e.target.value)}
                placeholder="@usuario"
                className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-4 py-2.5"
              />
            </div>

            {validationErrors.contact && (
              <p className="text-red-600 text-sm">{validationErrors.contact}</p>
            )}
          </div>
        </div>

        {/* Agreement */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Acuerdo de Comisión</h3>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Tipo de Comisión *
                </label>
                <select
                  value={formData.commissionType}
                  onChange={(e) => handleInputChange('commissionType', e.target.value as CommissionType)}
                  className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-4 py-2.5"
                >
                  <option value="percentage">Porcentaje (%)</option>
                  <option value="fixed">Fijo (€)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Valor *
                </label>
                <input
                  type="number"
                  value={formData.commissionValue}
                  onChange={(e) => handleInputChange('commissionValue', parseFloat(e.target.value) || 0)}
                  placeholder="0"
                  className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-4 py-2.5"
                />
                {validationErrors.commissionValue && (
                  <p className="text-red-600 text-sm mt-1">{validationErrors.commissionValue}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Términos Adicionales</label>
              <textarea
                value={formData.terms}
                onChange={(e) => handleInputChange('terms', e.target.value)}
                rows={3}
                placeholder="Términos y condiciones del acuerdo..."
                className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-4 py-2.5 resize-none"
              />
            </div>
          </div>
        </div>
      </form>
    </Modal>
  );
};

