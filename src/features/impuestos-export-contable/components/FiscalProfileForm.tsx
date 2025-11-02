import React, { useState, useEffect } from 'react';
import { Card, Button, Input } from '../../../components/componentsreutilizables';
import { FiscalProfile } from '../api/types';
import { Save, Building2 } from 'lucide-react';

interface FiscalProfileFormProps {
  initialData: FiscalProfile;
  onSubmit: (data: FiscalProfile) => void;
  isSaving?: boolean;
}

export const FiscalProfileForm: React.FC<FiscalProfileFormProps> = ({
  initialData,
  onSubmit,
  isSaving = false
}) => {
  const [formData, setFormData] = useState<FiscalProfile>(initialData);
  const [errors, setErrors] = useState<Partial<Record<keyof FiscalProfile, string>>>({});

  useEffect(() => {
    setFormData(initialData);
  }, [initialData]);

  const handleChange = (field: keyof FiscalProfile) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }));
    // Limpiar error del campo
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof FiscalProfile, string>> = {};

    if (!formData.legalName.trim()) {
      newErrors.legalName = 'El nombre fiscal es requerido';
    }

    if (!formData.taxId.trim()) {
      newErrors.taxId = 'El CIF/NIF es requerido';
    }

    if (!formData.address.trim()) {
      newErrors.address = 'La dirección fiscal es requerida';
    }

    if (!formData.country.trim()) {
      newErrors.country = 'El país es requerido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  return (
    <Card className="p-0 bg-white shadow-sm">
      <form onSubmit={handleSubmit} className="space-y-6 p-4">
        {/* Header */}
        <div className="flex items-center gap-3 pb-4 border-b border-gray-200">
          <div className="p-2 bg-blue-100 rounded-xl ring-1 ring-blue-200/70">
            <Building2 size={24} className="text-blue-600" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900">
              Datos Fiscales
            </h3>
            <p className="text-sm text-gray-600">
              Configura la información fiscal que aparecerá en las exportaciones
            </p>
          </div>
        </div>

        {/* Form Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Razón Social / Nombre"
            value={formData.legalName}
            onChange={handleChange('legalName')}
            error={errors.legalName}
            placeholder="Ej: Fit Center S.L."
            required
          />

          <Input
            label="CIF / NIF"
            value={formData.taxId}
            onChange={handleChange('taxId')}
            error={errors.taxId}
            placeholder="Ej: B12345678"
            required
          />

          <div className="md:col-span-2">
            <Input
              label="Dirección Fiscal"
              value={formData.address}
              onChange={handleChange('address')}
              error={errors.address}
              placeholder="Ej: Calle Falsa 123, 28080 Madrid"
              required
            />
          </div>

          <Input
            label="País"
            value={formData.country}
            onChange={handleChange('country')}
            error={errors.country}
            placeholder="Ej: ES"
            required
          />

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Régimen Fiscal
            </label>
            <select
              value={formData.taxRegime}
              onChange={handleChange('taxRegime')}
              className="w-full rounded-xl bg-white text-slate-900 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5 text-sm"
            >
              <option value="General">General</option>
              <option value="Simplificado">Simplificado</option>
              <option value="Exento">Exento</option>
            </select>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end pt-4 border-t border-gray-200">
          <Button
            type="submit"
            variant="primary"
            loading={isSaving}
            disabled={isSaving}
          >
            <Save size={20} className="mr-2" />
            Guardar Cambios
          </Button>
        </div>
      </form>
    </Card>
  );
};

