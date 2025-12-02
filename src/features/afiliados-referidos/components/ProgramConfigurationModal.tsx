import React, { useState, useEffect } from 'react';
import { Modal, Button, Input, Select, Textarea } from '../../../components/componentsreutilizables';
import { ReferralProgram, ProgramFormData, RewardType, UserType } from '../types';
import { Calendar, Gift } from 'lucide-react';

interface ProgramConfigurationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (programData: ProgramFormData) => void;
  initialData?: ReferralProgram | null;
  userType: UserType;
}

const rewardTypeOptions: { value: RewardType; label: string }[] = [
  { value: 'percent_discount', label: 'Descuento Porcentual (%)' },
  { value: 'free_month', label: 'Mes Gratis' },
  { value: 'free_session', label: 'Sesión Gratis' },
  { value: 'fixed_amount', label: 'Cantidad Fija' },
];

export const ProgramConfigurationModal: React.FC<ProgramConfigurationModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  userType,
}) => {
  const [formData, setFormData] = useState<ProgramFormData>({
    name: '',
    startDate: '',
    endDate: '',
    referrerRewardType: userType === 'gym' ? 'free_month' : 'free_session',
    referrerRewardValue: 1,
    referredRewardType: userType === 'gym' ? 'percent_discount' : 'free_session',
    referredRewardValue: userType === 'gym' ? 20 : 1,
    description: '',
    isActive: true,
  });

  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        startDate: initialData.startDate.split('T')[0],
        endDate: initialData.endDate.split('T')[0],
        referrerRewardType: initialData.referrerReward.type,
        referrerRewardValue: initialData.referrerReward.value,
        referredRewardType: initialData.referredReward.type,
        referredRewardValue: initialData.referredReward.value,
        description: initialData.description || '',
        isActive: initialData.isActive,
      });
    } else {
      // Reset form
      setFormData({
        name: '',
        startDate: '',
        endDate: '',
        referrerRewardType: userType === 'gym' ? 'free_month' : 'free_session',
        referrerRewardValue: 1,
        referredRewardType: userType === 'gym' ? 'percent_discount' : 'free_session',
        referredRewardValue: userType === 'gym' ? 20 : 1,
        description: '',
        isActive: true,
      });
    }
    setValidationErrors({});
  }, [initialData, isOpen, userType]);

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.name.trim()) {
      errors.name = 'El nombre es requerido';
    }

    if (!formData.startDate) {
      errors.startDate = 'La fecha de inicio es requerida';
    }

    if (!formData.endDate) {
      errors.endDate = 'La fecha de fin es requerida';
    }

    if (formData.startDate && formData.endDate && formData.startDate >= formData.endDate) {
      errors.endDate = 'La fecha de fin debe ser posterior a la fecha de inicio';
    }

    if (formData.referrerRewardValue <= 0) {
      errors.referrerRewardValue = 'El valor debe ser mayor a 0';
    }

    if (formData.referredRewardValue <= 0) {
      errors.referredRewardValue = 'El valor debe ser mayor a 0';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    onSubmit({
      ...formData,
      startDate: new Date(formData.startDate).toISOString(),
      endDate: new Date(formData.endDate + 'T23:59:59').toISOString(),
    });

    onClose();
  };

  const handleChange = (field: keyof ProgramFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (validationErrors[field]) {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  // Filter reward types based on user type
  const getRewardTypeOptions = () => {
    if (userType === 'trainer') {
      return rewardTypeOptions.filter(opt => 
        opt.value === 'free_session' || opt.value === 'percent_discount'
      );
    }
    return rewardTypeOptions;
  };

  const getRewardTypeLabel = (type: RewardType) => {
    const option = rewardTypeOptions.find(opt => opt.value === type);
    return option?.label || type;
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? 'Editar Programa de Referidos' : 'Crear Programa de Referidos'}
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <Input
          label="Nombre del Programa"
          value={formData.name}
          onChange={(e) => handleChange('name', e.target.value)}
          error={validationErrors.name}
          placeholder="Ej: Campaña Verano 2024"
          leftIcon={<Gift size={16} />}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Fecha de Inicio"
            type="date"
            value={formData.startDate}
            onChange={(e) => handleChange('startDate', e.target.value)}
            error={validationErrors.startDate}
            leftIcon={<Calendar size={16} />}
          />

          <Input
            label="Fecha de Fin"
            type="date"
            value={formData.endDate}
            onChange={(e) => handleChange('endDate', e.target.value)}
            error={validationErrors.endDate}
            leftIcon={<Calendar size={16} />}
          />
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Recompensa para el Referente
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              label="Tipo de Recompensa"
              value={formData.referrerRewardType}
              onChange={(e) => handleChange('referrerRewardType', e.target.value as RewardType)}
              options={getRewardTypeOptions().map(opt => ({
                value: opt.value,
                label: opt.label,
              }))}
            />

            <Input
              label="Valor"
              type="number"
              value={formData.referrerRewardValue}
              onChange={(e) => handleChange('referrerRewardValue', parseFloat(e.target.value) || 0)}
              error={validationErrors.referrerRewardValue}
              helperText={
                formData.referrerRewardType === 'percent_discount'
                  ? 'Porcentaje de descuento'
                  : formData.referrerRewardType === 'free_month'
                  ? 'Número de meses'
                  : formData.referrerRewardType === 'free_session'
                  ? 'Número de sesiones'
                  : 'Cantidad fija'
              }
            />
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Recompensa para el Referido
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              label="Tipo de Recompensa"
              value={formData.referredRewardType}
              onChange={(e) => handleChange('referredRewardType', e.target.value as RewardType)}
              options={getRewardTypeOptions().map(opt => ({
                value: opt.value,
                label: opt.label,
              }))}
            />

            <Input
              label="Valor"
              type="number"
              value={formData.referredRewardValue}
              onChange={(e) => handleChange('referredRewardValue', parseFloat(e.target.value) || 0)}
              error={validationErrors.referredRewardValue}
              helperText={
                formData.referredRewardType === 'percent_discount'
                  ? 'Porcentaje de descuento'
                  : formData.referredRewardType === 'free_month'
                  ? 'Número de meses'
                  : formData.referredRewardType === 'free_session'
                  ? 'Número de sesiones'
                  : 'Cantidad fija'
              }
            />
          </div>
        </div>

        <Textarea
          label="Descripción (Opcional)"
          value={formData.description}
          onChange={(e) => handleChange('description', e.target.value)}
          placeholder="Descripción del programa..."
          rows={3}
        />

        <div className="flex justify-end gap-2 pt-4 border-t border-gray-200">
          <Button variant="secondary" onClick={onClose} type="button">
            Cancelar
          </Button>
          <Button variant="primary" type="submit">
            {initialData ? 'Guardar Cambios' : 'Crear Programa'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

