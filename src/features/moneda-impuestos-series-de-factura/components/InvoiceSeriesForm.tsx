import React, { useState, useEffect } from 'react';
import { Modal, Button, Input, Select, SelectOption } from '../../../components/componentsreutilizables';
import { InvoiceSeries, CreateInvoiceSeriesRequest, UpdateInvoiceSeriesRequest, Location } from '../api/types';
import { FileText } from 'lucide-react';

interface InvoiceSeriesFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (seriesData: CreateInvoiceSeriesRequest | UpdateInvoiceSeriesRequest) => Promise<void>;
  initialData?: Partial<InvoiceSeries>;
  locations?: Location[];
  isGym: boolean;
}

export const InvoiceSeriesForm: React.FC<InvoiceSeriesFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  locations = [],
  isGym,
}) => {
  const [formData, setFormData] = useState({
    name: '',
    format: '',
    next_number: 1,
    is_default: false,
    location_id: '',
  });
  const [isSaving, setIsSaving] = useState(false);
  const [formatError, setFormatError] = useState('');

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        format: initialData.format || '',
        next_number: initialData.next_number || 1,
        is_default: initialData.is_default || false,
        location_id: initialData.location_id || '',
      });
    } else {
      setFormData({
        name: '',
        format: '',
        next_number: 1,
        is_default: false,
        location_id: '',
      });
    }
  }, [initialData, isOpen]);

  const validateFormat = (format: string): boolean => {
    // El formato debe contener al menos un placeholder numérico {####}
    const hasNumericPlaceholder = format.includes('{####}') || format.includes('{####}');
    return hasNumericPlaceholder;
  };

  const handleFormatChange = (value: string) => {
    setFormData({ ...formData, format: value });
    if (value && !validateFormat(value)) {
      setFormatError('El formato debe contener {####} para el número secuencial');
    } else {
      setFormatError('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateFormat(formData.format)) {
      setFormatError('El formato debe contener {####} para el número secuencial');
      return;
    }

    setIsSaving(true);
    try {
      const submitData: CreateInvoiceSeriesRequest | UpdateInvoiceSeriesRequest = {
        name: formData.name,
        format: formData.format,
        next_number: formData.next_number,
        is_default: formData.is_default,
      };

      if (isGym && formData.location_id) {
        submitData.location_id = formData.location_id;
      }

      await onSubmit(submitData);
      onClose();
    } catch (error) {
      console.error('Error al guardar serie:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const locationOptions: SelectOption[] = [
    { value: '', label: 'Sin sede (General)' },
    ...locations.map(loc => ({ value: loc.id, label: loc.name })),
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? 'Editar Serie de Facturación' : 'Nueva Serie de Facturación'}
      size="lg"
      footer={
        <div className="flex space-x-3">
          <Button variant="secondary" onClick={onClose}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleSubmit} loading={isSaving}>
            {initialData ? 'Guardar Cambios' : 'Crear Serie'}
          </Button>
        </div>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Nombre de la Serie"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="Ej: Facturas 2024"
          required
        />

        <Input
          label="Formato de Numeración"
          value={formData.format}
          onChange={(e) => handleFormatChange(e.target.value)}
          placeholder="Ej: F-{YYYY}/{####}"
          helperText="Usa {YYYY} para el año y {####} para el número secuencial"
          error={formatError}
          required
        />

        <Input
          label="Próximo Número"
          type="number"
          min="1"
          value={formData.next_number}
          onChange={(e) => setFormData({ ...formData, next_number: parseInt(e.target.value) || 1 })}
          helperText="Número que se usará en la próxima factura generada"
          required
        />

        {isGym && (
          <Select
            label="Sede (Opcional)"
            options={locationOptions}
            value={formData.location_id}
            onChange={(e) => setFormData({ ...formData, location_id: e.target.value })}
            placeholder="Selecciona una sede"
          />
        )}

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="is_default"
            checked={formData.is_default}
            onChange={(e) => setFormData({ ...formData, is_default: e.target.checked })}
            className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
          />
          <label htmlFor="is_default" className="text-sm font-medium text-slate-700">
            Establecer como serie predeterminada
          </label>
        </div>

        {formData.format && validateFormat(formData.format) && (
          <div className="p-4 bg-blue-50 rounded-lg ring-1 ring-blue-100">
            <p className="text-sm font-medium text-blue-900 mb-1">
              Vista previa:
            </p>
            <p className="text-sm text-blue-700">
              {formData.format
                .replace('{YYYY}', new Date().getFullYear().toString())
                .replace('{####}', formData.next_number.toString().padStart(4, '0'))}
            </p>
          </div>
        )}
      </form>
    </Modal>
  );
};

