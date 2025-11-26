import React, { useState, useEffect } from 'react';
import { Modal, Button, Input, Select, Textarea } from '../../../components/componentsreutilizables';
import { SupplierEvaluation, EvaluationFormData, Supplier } from '../types';
import { Star, Calendar, FileText } from 'lucide-react';
import { getSuppliers } from '../api';

interface EvaluationFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: Partial<SupplierEvaluation>;
  onSubmit: (formData: EvaluationFormData) => Promise<void>;
  gymId: string;
}

export const EvaluationFormModal: React.FC<EvaluationFormModalProps> = ({
  isOpen,
  onClose,
  initialData,
  onSubmit,
  gymId,
}) => {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loadingSuppliers, setLoadingSuppliers] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  
  const [formData, setFormData] = useState<EvaluationFormData>({
    supplierId: '',
    supplierName: '',
    evaluationDate: new Date().toISOString().split('T')[0],
    concept: '',
    criteriaRatings: {
      quality: 0,
      timeliness: 0,
      support: 0,
      costBenefit: 0,
      communication: 0,
    },
    notes: '',
    attachments: [],
  });

  useEffect(() => {
    if (isOpen) {
      loadSuppliers();
      if (initialData) {
        setFormData({
          supplierId: initialData.supplierId || '',
          supplierName: initialData.supplierName || '',
          evaluationDate: initialData.evaluationDate
            ? (typeof initialData.evaluationDate === 'string'
                ? initialData.evaluationDate.split('T')[0]
                : new Date(initialData.evaluationDate).toISOString().split('T')[0])
            : new Date().toISOString().split('T')[0],
          concept: initialData.concept || '',
          criteriaRatings: initialData.criteriaRatings || {
            quality: 0,
            timeliness: 0,
            support: 0,
            costBenefit: 0,
            communication: 0,
          },
          notes: initialData.notes || '',
          attachments: [],
        });
      } else {
        // Reset form
        setFormData({
          supplierId: '',
          supplierName: '',
          evaluationDate: new Date().toISOString().split('T')[0],
          concept: '',
          criteriaRatings: {
            quality: 0,
            timeliness: 0,
            support: 0,
            costBenefit: 0,
            communication: 0,
          },
          notes: '',
          attachments: [],
        });
      }
      setFormErrors({});
    }
  }, [isOpen, initialData]);

  const loadSuppliers = async () => {
    setLoadingSuppliers(true);
    try {
      const data = await getSuppliers(gymId);
      setSuppliers(data);
    } catch (error) {
      console.error('Error cargando proveedores:', error);
    } finally {
      setLoadingSuppliers(false);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    if (field.startsWith('criteriaRatings.')) {
      const criteriaField = field.split('.')[1];
      setFormData({
        ...formData,
        criteriaRatings: {
          ...formData.criteriaRatings,
          [criteriaField]: value,
        },
      });
    } else {
      setFormData({
        ...formData,
        [field]: value,
      });
    }
    // Limpiar error del campo
    if (formErrors[field]) {
      setFormErrors({
        ...formErrors,
        [field]: '',
      });
    }
  };

  const handleSupplierChange = (supplierId: string) => {
    const supplier = suppliers.find(s => s.id === supplierId);
    handleInputChange('supplierId', supplierId);
    handleInputChange('supplierName', supplier?.name || '');
  };

  const handleRatingChange = (criteria: string, rating: number) => {
    handleInputChange(`criteriaRatings.${criteria}`, rating);
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};
    
    if (!formData.supplierId) {
      errors.supplierId = 'Debes seleccionar un proveedor';
    }
    
    if (!formData.evaluationDate) {
      errors.evaluationDate = 'Debes seleccionar una fecha';
    }
    
    if (formData.criteriaRatings.quality === 0) {
      errors.quality = 'Debes calificar la calidad';
    }
    
    if (formData.criteriaRatings.timeliness === 0) {
      errors.timeliness = 'Debes calificar la puntualidad';
    }
    
    if (formData.criteriaRatings.support === 0) {
      errors.support = 'Debes calificar el soporte';
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
      console.error('Error guardando evaluación:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStarRating = (criteria: string, label: string, value: number, error?: string) => {
    return (
      <div className="space-y-2">
        <label className="block text-sm font-medium text-slate-700">
          {label}
          <span className="text-red-500 ml-1">*</span>
        </label>
        <div className="flex items-center gap-2">
          {[1, 2, 3, 4, 5].map((rating) => (
            <button
              key={rating}
              type="button"
              onClick={() => handleRatingChange(criteria, rating)}
              className="focus:outline-none transition-transform hover:scale-110"
            >
              <Star
                className={`w-6 h-6 ${
                  rating <= value
                    ? 'text-yellow-400 fill-yellow-400'
                    : 'text-gray-300'
                }`}
              />
            </button>
          ))}
          {value > 0 && (
            <span className="ml-2 text-sm text-gray-600">
              {value}/5
            </span>
          )}
        </div>
        {error && (
          <p className="text-sm text-red-600">{error}</p>
        )}
      </div>
    );
  };

  const supplierOptions = suppliers.map(s => ({
    value: s.id,
    label: s.name,
  }));

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? 'Editar Evaluación' : 'Nueva Evaluación'}
      size="lg"
      footer={
        <div className="flex justify-end gap-3">
          <Button variant="secondary" onClick={onClose} disabled={isSubmitting}>
            Cancelar
          </Button>
          <Button
            variant="primary"
            onClick={handleSubmit}
            loading={isSubmitting}
            type="submit"
          >
            {initialData ? 'Actualizar' : 'Guardar Evaluación'}
          </Button>
        </div>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Selección de Proveedor */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Proveedor
            <span className="text-red-500 ml-1">*</span>
          </label>
          <Select
            options={supplierOptions}
            value={formData.supplierId}
            onChange={(e) => handleSupplierChange(e.target.value)}
            placeholder="Selecciona un proveedor"
            disabled={loadingSuppliers}
            error={formErrors.supplierId}
          />
          {formErrors.supplierId && (
            <p className="mt-1 text-sm text-red-600">
              {formErrors.supplierId}
            </p>
          )}
        </div>

        {/* Fecha de Evaluación */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            <Calendar size={16} className="inline mr-1" />
            Fecha de Evaluación
            <span className="text-red-500 ml-1">*</span>
          </label>
          <Input
            type="date"
            value={formData.evaluationDate}
            onChange={(e) => handleInputChange('evaluationDate', e.target.value)}
            error={formErrors.evaluationDate}
          />
        </div>

        {/* Concepto */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            <FileText size={16} className="inline mr-1" />
            Concepto
          </label>
          <Input
            placeholder="Ej: Compra e instalación de 5 bicicletas de spinning modelo X2"
            value={formData.concept}
            onChange={(e) => handleInputChange('concept', e.target.value)}
          />
        </div>

        {/* Calificaciones por Criterios */}
        <div className="space-y-4 border-t border-gray-200 pt-4">
          <h3 className="text-base font-semibold text-gray-900">
            Calificación por Criterios
          </h3>
          
          {renderStarRating('quality', 'Calidad del Producto/Servicio', formData.criteriaRatings.quality, formErrors.quality)}
          {renderStarRating('timeliness', 'Puntualidad de Entrega', formData.criteriaRatings.timeliness, formErrors.timeliness)}
          {renderStarRating('support', 'Soporte/Instalación', formData.criteriaRatings.support, formErrors.support)}
          {renderStarRating('costBenefit', 'Relación Calidad/Precio', formData.criteriaRatings.costBenefit || 0)}
          {renderStarRating('communication', 'Comunicación', formData.criteriaRatings.communication || 0)}
        </div>

        {/* Comentarios */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Comentarios
          </label>
          <Textarea
            placeholder="Escribe tus comentarios sobre la evaluación..."
            value={formData.notes}
            onChange={(e) => handleInputChange('notes', e.target.value)}
            rows={4}
          />
        </div>
      </form>
    </Modal>
  );
};

