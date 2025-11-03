import React, { useState, useEffect } from 'react';
import { Campaign, CampaignFormData, CampaignDeliverable } from '../api/influencers';
import { X, Plus, Trash2, Loader2 } from 'lucide-react';

interface CampaignFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (campaignData: CampaignFormData) => void;
  initialData?: Partial<Campaign>;
  influencerId?: string;
}

/**
 * Modal con formulario para crear o editar una campaña de colaboración.
 */
export const CampaignFormModal: React.FC<CampaignFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  influencerId
}) => {
  const [formData, setFormData] = useState<CampaignFormData>({
    name: '',
    description: '',
    influencerId: influencerId || '',
    agreementType: 'service_exchange',
    agreementDetails: '',
    startDate: new Date().toISOString().split('T')[0],
    endDate: '',
    deliverables: []
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setFormData({
          name: initialData.name || '',
          description: initialData.description || '',
          influencerId: initialData.influencerId || influencerId || '',
          agreementType: initialData.agreementType || 'service_exchange',
          agreementDetails: initialData.agreementDetails || '',
          startDate: initialData.startDate ? initialData.startDate.split('T')[0] : new Date().toISOString().split('T')[0],
          endDate: initialData.endDate ? initialData.endDate.split('T')[0] : '',
          deliverables: initialData.deliverables || []
        });
      } else {
        // Reset form
        setFormData({
          name: '',
          description: '',
          influencerId: influencerId || '',
          agreementType: 'service_exchange',
          agreementDetails: '',
          startDate: new Date().toISOString().split('T')[0],
          endDate: '',
          deliverables: []
        });
      }
      setFormErrors({});
    }
  }, [isOpen, initialData, influencerId]);

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      errors.name = 'El nombre de la campaña es requerido';
    }
    
    if (!formData.influencerId) {
      errors.influencerId = 'Debes seleccionar un influencer';
    }
    
    if (!formData.startDate) {
      errors.startDate = 'La fecha de inicio es requerida';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    try {
      onSubmit(formData);
      onClose();
    } catch (error) {
      console.error('Error al guardar campaña:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddDeliverable = () => {
    setFormData(prev => ({
      ...prev,
      deliverables: [
        ...(prev.deliverables || []),
        {
          type: 'post',
          description: '',
          status: 'pending'
        }
      ]
    }));
  };

  const handleUpdateDeliverable = (index: number, updates: Partial<CampaignDeliverable>) => {
    setFormData(prev => ({
      ...prev,
      deliverables: prev.deliverables?.map((del, i) =>
        i === index ? { ...del, ...updates } : del
      ) || []
    }));
  };

  const handleRemoveDeliverable = (index: number) => {
    setFormData(prev => ({
      ...prev,
      deliverables: prev.deliverables?.filter((_, i) => i !== index) || []
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {initialData ? 'Editar Campaña' : 'Nueva Campaña de Colaboración'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Nombre */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nombre de la Campaña *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                formErrors.name ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Ej: Lanzamiento Programa Abs de Acero"
            />
            {formErrors.name && (
              <p className="mt-1 text-sm text-red-600">{formErrors.name}</p>
            )}
          </div>

          {/* Descripción */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Descripción
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              rows={3}
              placeholder="Describe el objetivo y contexto de la campaña..."
            />
          </div>

          {/* Tipo de Acuerdo */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tipo de Acuerdo *
            </label>
            <select
              value={formData.agreementType}
              onChange={(e) => setFormData(prev => ({ ...prev, agreementType: e.target.value as any }))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="service_exchange">Intercambio de Servicios</option>
              <option value="fixed_payment">Pago Fijo</option>
              <option value="commission">Comisión</option>
              <option value="free">Gratis / Sin Costo</option>
            </select>
          </div>

          {/* Detalles del Acuerdo */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Detalles del Acuerdo
            </label>
            <textarea
              value={formData.agreementDetails}
              onChange={(e) => setFormData(prev => ({ ...prev, agreementDetails: e.target.value }))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              rows={3}
              placeholder="Ej: 3 meses de coaching premium a cambio de 2 posts, 5 stories y 1 Reel..."
            />
          </div>

          {/* Fechas */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fecha de Inicio *
              </label>
              <input
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                  formErrors.startDate ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              {formErrors.startDate && (
                <p className="mt-1 text-sm text-red-600">{formErrors.startDate}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fecha de Fin (Opcional)
              </label>
              <input
                type="date"
                value={formData.endDate}
                onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                min={formData.startDate}
              />
            </div>
          </div>

          {/* Entregables */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="block text-sm font-medium text-gray-700">
                Entregables
              </label>
              <button
                type="button"
                onClick={handleAddDeliverable}
                className="flex items-center gap-1 px-3 py-1.5 text-sm text-purple-600 hover:bg-purple-50 rounded transition"
              >
                <Plus className="w-4 h-4" />
                Añadir Entregable
              </button>
            </div>
            
            <div className="space-y-3">
              {formData.deliverables?.map((deliverable, index) => (
                <div key={index} className="flex gap-3 p-3 border border-gray-200 rounded-lg">
                  <select
                    value={deliverable.type || 'post'}
                    onChange={(e) => handleUpdateDeliverable(index, { type: e.target.value as any })}
                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  >
                    <option value="post">Post</option>
                    <option value="story">Story</option>
                    <option value="reel">Reel</option>
                    <option value="video">Video</option>
                    <option value="other">Otro</option>
                  </select>
                  <input
                    type="text"
                    value={deliverable.description || ''}
                    onChange={(e) => handleUpdateDeliverable(index, { description: e.target.value })}
                    placeholder="Descripción del entregable"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  />
                  <input
                    type="date"
                    value={deliverable.dueDate?.split('T')[0] || ''}
                    onChange={(e) => handleUpdateDeliverable(index, { dueDate: e.target.value })}
                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    placeholder="Fecha límite"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveDeliverable(index)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
              
              {(!formData.deliverables || formData.deliverables.length === 0) && (
                <p className="text-sm text-gray-500 text-center py-4">
                  No hay entregables añadidos. Haz clic en "Añadir Entregable" para agregar uno.
                </p>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Guardando...
                </>
              ) : (
                'Guardar Campaña'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};


