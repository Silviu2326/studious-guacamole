// TemplateEditorModal - Container
import React, { useState, useEffect } from 'react';
import { GlobalTemplate, TemplateType } from '../types';
import { Modal, Button, Input, Select, SelectOption, Textarea } from '../../../components/componentsreutilizables';

interface TemplateEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  templateData?: Partial<GlobalTemplate>;
  onSave: (data: Partial<GlobalTemplate>) => Promise<void>;
}

export const TemplateEditorModal: React.FC<TemplateEditorModalProps> = ({
  isOpen,
  onClose,
  templateData,
  onSave
}) => {
  const [formData, setFormData] = useState({
    name: '',
    type: 'CONTRACT' as TemplateType,
    description: '',
    content: '',
    isMandatory: false
  });
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (templateData) {
      setFormData({
        name: templateData.name || '',
        type: templateData.type || 'CONTRACT',
        description: templateData.description || '',
        content: typeof templateData.content === 'string' 
          ? templateData.content 
          : JSON.stringify(templateData.content, null, 2),
        isMandatory: templateData.isMandatory || false
      });
    } else {
      setFormData({
        name: '',
        type: 'CONTRACT',
        description: '',
        content: '',
        isMandatory: false
      });
    }
    setError(null);
  }, [templateData, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.content) {
      setError('Nombre y contenido son requeridos');
      return;
    }

    try {
      setIsSaving(true);
      setError(null);
      
      let parsedContent: string | object = formData.content;
      if (formData.type === 'WORKOUT_PLAN' || formData.type === 'NUTRITION_GUIDE') {
        try {
          parsedContent = JSON.parse(formData.content);
        } catch {
          // Si no es JSON válido, mantener como string
        }
      }

      await onSave({
        name: formData.name,
        type: formData.type,
        description: formData.description,
        content: parsedContent,
        isMandatory: formData.isMandatory
      });
      
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al guardar');
    } finally {
      setIsSaving(false);
    }
  };

  const typeOptions: SelectOption[] = [
    { value: 'CONTRACT', label: 'Contrato' },
    { value: 'POLICY', label: 'Política' },
    { value: 'WORKOUT_PLAN', label: 'Plan de Entrenamiento' },
    { value: 'NUTRITION_GUIDE', label: 'Guía Nutricional' },
    { value: 'EMAIL', label: 'Email' },
    { value: 'PROTOCOL', label: 'Protocolo' },
    { value: 'REGULATION', label: 'Reglamento' }
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={templateData ? 'Editar Plantilla' : 'Nueva Plantilla'}
      size="xl"
      footer={
        <div className="flex justify-end gap-3">
          <Button variant="secondary" onClick={onClose} disabled={isSaving}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleSubmit} loading={isSaving}>
            {templateData ? 'Actualizar' : 'Crear'}
          </Button>
        </div>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 bg-red-50 text-red-600 rounded-xl text-sm ring-1 ring-red-200">
            {error}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Nombre de la Plantilla *
          </label>
          <Input
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Ej: Contrato Membresía Premium 2024"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Tipo *
          </label>
          <Select
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value as TemplateType })}
            options={typeOptions}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Descripción
          </label>
          <Input
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Breve descripción de la plantilla"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Contenido *
          </label>
          <Textarea
            value={formData.content}
            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            placeholder={
              formData.type === 'WORKOUT_PLAN' || formData.type === 'NUTRITION_GUIDE'
                ? 'Ingresa contenido en formato JSON'
                : 'Ingresa el contenido de la plantilla'
            }
            rows={12}
            required
          />
          {(formData.type === 'WORKOUT_PLAN' || formData.type === 'NUTRITION_GUIDE') && (
            <p className="text-xs text-slate-500 mt-1">
              Para plantillas estructuradas, usa formato JSON válido
            </p>
          )}
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="isMandatory"
            checked={formData.isMandatory}
            onChange={(e) => setFormData({ ...formData, isMandatory: e.target.checked })}
            className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
          />
          <label htmlFor="isMandatory" className="ml-2 text-sm text-slate-700">
            Marcar como obligatoria para todas las sedes
          </label>
        </div>
      </form>
    </Modal>
  );
};

