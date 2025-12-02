import React, { useState, useEffect } from 'react';
import { Webhook, WebhookFormData } from '../types';
import { Modal, Input, Button, Textarea } from '../../../components/componentsreutilizables';
import { AVAILABLE_EVENTS } from '../types';
import { ds } from '../../adherencia/ui/ds';

interface WebhookFormProps {
  isOpen: boolean;
  onClose: () => void;
  webhookToEdit?: Webhook | null;
  onSubmit: (data: WebhookFormData) => Promise<void>;
}

export const WebhookForm: React.FC<WebhookFormProps> = ({
  isOpen,
  onClose,
  webhookToEdit,
  onSubmit,
}) => {
  const [formData, setFormData] = useState<WebhookFormData>({
    name: '',
    targetUrl: '',
    events: [],
  });
  const [formErrors, setFormErrors] = useState<Partial<WebhookFormData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (webhookToEdit && isOpen) {
      setFormData({
        name: webhookToEdit.name,
        targetUrl: webhookToEdit.targetUrl,
        events: webhookToEdit.events,
      });
    } else {
      setFormData({
        name: '',
        targetUrl: '',
        events: [],
      });
    }
    setFormErrors({});
  }, [webhookToEdit, isOpen]);

  const validateForm = (): boolean => {
    const errors: Partial<WebhookFormData> = {};

    if (!formData.name.trim()) {
      errors.name = 'El nombre es requerido';
    }

    if (!formData.targetUrl.trim()) {
      errors.targetUrl = 'La URL es requerida';
    } else {
      try {
        new URL(formData.targetUrl);
      } catch {
        errors.targetUrl = 'La URL no es válida';
      }
    }

    if (formData.events.length === 0) {
      errors.events = 'Debe seleccionar al menos un evento';
    }

    setFormErrors(errors as any);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      setIsSubmitting(true);
      await onSubmit(formData);
      onClose();
    } catch (error) {
      console.error('Error al guardar webhook:', error);
      alert('Error al guardar el webhook. Por favor, intente nuevamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleEvent = (eventValue: string) => {
    setFormData({
      ...formData,
      events: formData.events.includes(eventValue)
        ? formData.events.filter((e) => e !== eventValue)
        : [...formData.events, eventValue],
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={webhookToEdit ? 'Editar Webhook' : 'Crear Nuevo Webhook'}
      size="lg"
      footer={
        <>
          <Button
            variant="secondary"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancelar
          </Button>
          <Button
            variant="primary"
            onClick={handleSubmit}
            loading={isSubmitting}
          >
            {webhookToEdit ? 'Guardar Cambios' : 'Crear Webhook'}
          </Button>
        </>
      }
    >
      <div className="space-y-6">
        <Input
          label="Nombre del Webhook"
          placeholder="Ej: Marketing Automation Hook"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          error={formErrors.name}
          helperText="Un nombre descriptivo para identificar este webhook"
        />

        <Input
          label="URL de Destino"
          placeholder="https://ejemplo.com/webhook"
          value={formData.targetUrl}
          onChange={(e) => setFormData({ ...formData, targetUrl: e.target.value })}
          error={formErrors.targetUrl}
          helperText="La URL donde recibirás las notificaciones en formato POST"
        />

        <div>
          <label className={`block ${ds.typography.bodySmall} font-semibold ${ds.color.textPrimary} ${ds.color.textPrimaryDark} mb-3`}>
            Eventos a Escuchar
            {formErrors.events && (
              <span className={`${ds.typography.caption} ${ds.color.error} ml-2`}>
                {formErrors.events}
              </span>
            )}
          </label>
          <div className="space-y-2 max-h-64 overflow-y-auto border border-gray-200 dark:border-gray-700 rounded-lg p-4">
            {AVAILABLE_EVENTS.map((event) => (
              <label
                key={event.value}
                className="flex items-center gap-3 p-2 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={formData.events.includes(event.value)}
                  onChange={() => handleToggleEvent(event.value)}
                  className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
                />
                <div className="flex-1">
                  <span className={`${ds.typography.body} font-medium ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
                    {event.label}
                  </span>
                  <span className={`${ds.typography.caption} ${ds.color.textMuted} ${ds.color.textMutedDark} ml-2 font-mono`}>
                    ({event.value})
                  </span>
                </div>
              </label>
            ))}
          </div>
          <p className={`${ds.typography.caption} ${ds.color.textMuted} ${ds.color.textMutedDark} mt-2`}>
            Selecciona los eventos que activarán una notificación a tu URL de destino.
          </p>
        </div>

        {webhookToEdit && (
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <h4 className={`${ds.typography.bodySmall} font-semibold text-blue-900 dark:text-blue-100 mb-2`}>
              Secreto del Webhook
            </h4>
            <p className={`${ds.typography.bodySmall} text-blue-800 dark:text-blue-200 mb-2`}>
              Usa este secreto para verificar que las peticiones provienen de nuestra plataforma:
            </p>
            <div className="bg-gray-900 text-gray-100 p-3 rounded-lg font-mono text-sm break-all">
              {webhookToEdit.secret}
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};

