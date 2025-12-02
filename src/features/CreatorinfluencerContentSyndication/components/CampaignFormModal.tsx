import React, { useState, useEffect } from 'react';
import { Campaign, CampaignFormData, CampaignDeliverable } from '../api/influencers';
import { X, Plus, Trash2, Loader2 } from 'lucide-react';
import { Modal } from '../../../components/componentsreutilizables';
import { Button } from '../../../components/componentsreutilizables';

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
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? 'Editar Campaña' : 'Nueva Campaña de Colaboración'}
      size="xl"
    >
      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
          {/* Nombre */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Nombre de la Campaña *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className={`w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5 ${
                formErrors.name ? 'ring-red-300' : 'ring-slate-300'
              }`}
              placeholder="Ej: Lanzamiento Programa Abs de Acero"
            />
            {formErrors.name && (
              <p className="mt-1 text-sm text-red-600">{formErrors.name}</p>
            )}
          </div>

          {/* Descripción */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Descripción
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5"
              rows={3}
              placeholder="Describe el objetivo y contexto de la campaña..."
            />
          </div>

          {/* Tipo de Acuerdo */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Tipo de Acuerdo *
            </label>
            <select
              value={formData.agreementType}
              onChange={(e) => setFormData(prev => ({ ...prev, agreementType: e.target.value as any }))}
              className="w-full rounded-xl bg-white text-slate-900 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5"
            >
              <option value="service_exchange">Intercambio de Servicios</option>
              <option value="fixed_payment">Pago Fijo</option>
              <option value="commission">Comisión</option>
              <option value="free">Gratis / Sin Costo</option>
            </select>
          </div>

          {/* Detalles del Acuerdo */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Detalles del Acuerdo
            </label>
            <textarea
              value={formData.agreementDetails}
              onChange={(e) => setFormData(prev => ({ ...prev, agreementDetails: e.target.value }))}
              className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5"
              rows={3}
              placeholder="Ej: 3 meses de coaching premium a cambio de 2 posts, 5 stories y 1 Reel..."
            />
          </div>

          {/* Fechas */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Fecha de Inicio *
              </label>
              <input
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                className={`w-full rounded-xl bg-white text-slate-900 ring-1 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5 ${
                  formErrors.startDate ? 'ring-red-300' : 'ring-slate-300'
                }`}
              />
              {formErrors.startDate && (
                <p className="mt-1 text-sm text-red-600">{formErrors.startDate}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Fecha de Fin (Opcional)
              </label>
              <input
                type="date"
                value={formData.endDate}
                onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
                className="w-full rounded-xl bg-white text-slate-900 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5"
                min={formData.startDate}
              />
            </div>
          </div>

          {/* Entregables */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="block text-sm font-medium text-slate-700">
                Entregables
              </label>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleAddDeliverable}
                leftIcon={<Plus size={16} />}
              >
                Añadir Entregable
              </Button>
            </div>
            
            <div className="space-y-3">
              {formData.deliverables?.map((deliverable, index) => (
                <div key={index} className="flex gap-3 p-3 border border-slate-200 rounded-xl bg-slate-50">
                  <select
                    value={deliverable.type || 'post'}
                    onChange={(e) => handleUpdateDeliverable(index, { type: e.target.value as any })}
                    className="px-3 py-2 border border-slate-300 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-400"
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
                    className="flex-1 px-3 py-2 border border-slate-300 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                  <input
                    type="date"
                    value={deliverable.dueDate?.split('T')[0] || ''}
                    onChange={(e) => handleUpdateDeliverable(index, { dueDate: e.target.value })}
                    className="px-3 py-2 border border-slate-300 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-400"
                    placeholder="Fecha límite"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={() => handleRemoveDeliverable(index)}
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              ))}
              
              {(!formData.deliverables || formData.deliverables.length === 0) && (
                <p className="text-sm text-gray-500 text-center py-4">
                  No hay entregables añadidos. Haz clic en "Añadir Entregable" para agregar uno.
                </p>
              )}
            </div>
          </div>

          {/* Footer del formulario */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
            <Button
              type="button"
              variant="secondary"
              onClick={onClose}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              loading={isLoading}
            >
              Guardar Campaña
            </Button>
          </div>
        </form>
    </Modal>
  );
};


