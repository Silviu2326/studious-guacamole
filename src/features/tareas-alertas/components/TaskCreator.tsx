import React, { useState } from 'react';
import { Modal, Button, Input, Textarea, Select } from '../../../components/componentsreutilizables';
import { ds } from '../../adherencia/ui/ds';
import { CreateTaskData, TaskPriority, UserRole } from '../types';
import { X } from 'lucide-react';

interface TaskCreatorProps {
  onClose: () => void;
  onCreate: (data: CreateTaskData) => void;
  role: UserRole;
}

export const TaskCreator: React.FC<TaskCreatorProps> = ({ onClose, onCreate, role }) => {
  const [formData, setFormData] = useState<CreateTaskData>({
    title: '',
    description: '',
    priority: 'media',
    dueDate: undefined,
    tags: [],
    category: '',
  });
  const [tagInput, setTagInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) return;
    onCreate(formData);
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags?.includes(tagInput.trim())) {
      setFormData({
        ...formData,
        tags: [...(formData.tags || []), tagInput.trim()],
      });
      setTagInput('');
    }
  };

  const handleRemoveTag = (tag: string) => {
    setFormData({
      ...formData,
      tags: formData.tags?.filter(t => t !== tag) || [],
    });
  };

  const priorityOptions = [
    { value: 'alta', label: 'Alta' },
    { value: 'media', label: 'Media' },
    { value: 'baja', label: 'Baja' },
  ];

  const categoryOptions = role === 'entrenador'
    ? [
        { value: 'cliente', label: 'Cliente' },
        { value: 'lead', label: 'Lead' },
        { value: 'sesión', label: 'Sesión' },
        { value: 'pago', label: 'Pago' },
        { value: 'preparación', label: 'Preparación' },
      ]
    : [
        { value: 'facturación', label: 'Facturación' },
        { value: 'mantenimiento', label: 'Mantenimiento' },
        { value: 'operaciones', label: 'Operaciones' },
        { value: 'staff', label: 'Staff' },
        { value: 'equipo', label: 'Equipo' },
      ];

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title="Crear Nueva Tarea"
      size="lg"
      footer={
        <div className="flex justify-end gap-3">
          <Button variant="secondary" onClick={onClose}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            Crear Tarea
          </Button>
        </div>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className={`block ${ds.typography.bodySmall} ${ds.color.textPrimary} ${ds.color.textPrimaryDark} mb-2`}>
            Título *
          </label>
          <Input
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="Ej: Seguimiento a cliente sin check-in"
            required
          />
        </div>

        <div>
          <label className={`block ${ds.typography.bodySmall} ${ds.color.textPrimary} ${ds.color.textPrimaryDark} mb-2`}>
            Descripción
          </label>
          <Textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Detalles de la tarea..."
            rows={4}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={`block ${ds.typography.bodySmall} ${ds.color.textPrimary} ${ds.color.textPrimaryDark} mb-2`}>
              Prioridad
            </label>
            <Select
              value={formData.priority}
              onChange={(e) => setFormData({ ...formData, priority: e.target.value as TaskPriority })}
              options={priorityOptions}
            />
          </div>

          <div>
            <label className={`block ${ds.typography.bodySmall} ${ds.color.textPrimary} ${ds.color.textPrimaryDark} mb-2`}>
              Categoría
            </label>
            <Select
              value={formData.category || ''}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              options={categoryOptions}
            />
          </div>
        </div>

        <div>
          <label className={`block ${ds.typography.bodySmall} ${ds.color.textPrimary} ${ds.color.textPrimaryDark} mb-2`}>
            Fecha Límite
          </label>
          <Input
            type="datetime-local"
            value={formData.dueDate ? new Date(formData.dueDate).toISOString().slice(0, 16) : ''}
            onChange={(e) => setFormData({ ...formData, dueDate: e.target.value ? new Date(e.target.value).toISOString() : undefined })}
          />
        </div>

        <div>
          <label className={`block ${ds.typography.bodySmall} ${ds.color.textPrimary} ${ds.color.textPrimaryDark} mb-2`}>
            Tags
          </label>
          <div className="flex gap-2 mb-2">
            <Input
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
              placeholder="Agregar tag..."
            />
            <Button type="button" variant="secondary" onClick={handleAddTag}>
              Agregar
            </Button>
          </div>
          {formData.tags && formData.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {formData.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="hover:text-blue-600"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>
      </form>
    </Modal>
  );
};

