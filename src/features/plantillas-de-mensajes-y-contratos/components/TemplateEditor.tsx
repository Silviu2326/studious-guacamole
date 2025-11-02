import React, { useState, useEffect } from 'react';
import { Modal, Input, Select, Textarea, Button } from '../../../components/componentsreutilizables';
import { Template, TemplateType, AVAILABLE_VARIABLES, CreateTemplateRequest, UpdateTemplateRequest } from '../types';
import { ds } from '../../adherencia/ui/ds';
import { Plus } from 'lucide-react';

interface TemplateEditorProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: CreateTemplateRequest | UpdateTemplateRequest) => Promise<void>;
  initialData?: Partial<Template> | null;
}

const TemplateEditor: React.FC<TemplateEditorProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData,
}) => {
  const [name, setName] = useState('');
  const [type, setType] = useState<TemplateType>('EMAIL');
  const [subject, setSubject] = useState('');
  const [bodyHtml, setBodyHtml] = useState('');
  const [requiresSignature, setRequiresSignature] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (initialData) {
      setName(initialData.name || '');
      setType(initialData.type || 'EMAIL');
      setSubject(initialData.subject || '');
      setBodyHtml(initialData.bodyHtml || '');
      setRequiresSignature(initialData.requiresSignature || false);
    } else {
      // Resetear formulario
      setName('');
      setType('EMAIL');
      setSubject('');
      setBodyHtml('');
      setRequiresSignature(false);
    }
    setErrors({});
  }, [initialData, isOpen]);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!name.trim()) {
      newErrors.name = 'El nombre es requerido';
    }

    if (!bodyHtml.trim()) {
      newErrors.bodyHtml = 'El contenido es requerido';
    }

    if (type === 'EMAIL' && !subject.trim()) {
      newErrors.subject = 'El asunto es requerido para emails';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) {
      return;
    }

    setIsSaving(true);
    try {
      const templateData = {
        name,
        type,
        subject: type === 'EMAIL' ? subject : undefined,
        bodyHtml,
        requiresSignature,
      };

      await onSave(templateData);
      onClose();
    } catch (error) {
      console.error('Error al guardar plantilla:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const insertVariable = (variable: string) => {
    const textarea = document.getElementById('bodyHtml') as HTMLTextAreaElement;
    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const text = bodyHtml;
      const newText = text.substring(0, start) + variable + text.substring(end);
      setBodyHtml(newText);
      // Restaurar el foco y la posición del cursor
      setTimeout(() => {
        textarea.focus();
        const newCursorPosition = start + variable.length;
        textarea.setSelectionRange(newCursorPosition, newCursorPosition);
      }, 0);
    }
  };

  const typeOptions = [
    { value: 'EMAIL', label: 'Email' },
    { value: 'SMS', label: 'SMS' },
    { value: 'CONTRACT', label: 'Contrato' },
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? 'Editar Plantilla' : 'Nueva Plantilla'}
      size="xl"
      footer={
        <div className="flex justify-end gap-3">
          <Button variant="secondary" onClick={onClose} disabled={isSaving}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleSave} loading={isSaving}>
            {initialData ? 'Guardar Cambios' : 'Crear Plantilla'}
          </Button>
        </div>
      }
    >
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Nombre de la Plantilla"
            value={name}
            onChange={(e) => setName(e.target.value)}
            error={errors.name}
            placeholder="Ej: Email de Bienvenida"
            required
          />

          <Select
            label="Tipo de Plantilla"
            value={type}
            onChange={(e) => setType(e.target.value as TemplateType)}
            options={typeOptions}
            error={errors.type}
            required
          />
        </div>

        {type === 'EMAIL' && (
          <Input
            label="Asunto"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            error={errors.subject}
            placeholder="Ej: Bienvenido a nuestro gimnasio"
            required
          />
        )}

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className={`block ${ds.typography.bodySmall} font-semibold ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
              Contenido de la Plantilla
            </label>
            <div className="flex flex-wrap gap-2">
              {AVAILABLE_VARIABLES.map((variable) => (
                <button
                  key={variable.value}
                  onClick={() => insertVariable(variable.value)}
                  className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/20 dark:hover:bg-blue-900/30 text-blue-700 rounded-lg transition-colors border border-blue-200"
                  title={variable.description}
                >
                  <Plus className="w-3 h-3" />
                  {variable.label}
                </button>
              ))}
            </div>
          </div>
          <Textarea
            id="bodyHtml"
            value={bodyHtml}
            onChange={(e) => setBodyHtml(e.target.value)}
            error={errors.bodyHtml}
            placeholder="Escribe el contenido de tu plantilla aquí. Usa las variables disponibles arriba para personalizar."
            rows={12}
            required
            className="font-mono text-sm"
          />
          <p className={`mt-2 ${ds.typography.caption} ${ds.color.textMuted} ${ds.color.textMutedDark}`}>
            Usa las variables dinámicas para personalizar automáticamente el contenido para cada cliente.
          </p>
        </div>

        {type === 'CONTRACT' && (
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="requiresSignature"
              checked={requiresSignature}
              onChange={(e) => setRequiresSignature(e.target.checked)}
              className="w-5 h-5 text-purple-600 rounded focus:ring-purple-500"
            />
            <label htmlFor="requiresSignature" className={`${ds.typography.body} ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
              Requiere firma digital
            </label>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default TemplateEditor;

