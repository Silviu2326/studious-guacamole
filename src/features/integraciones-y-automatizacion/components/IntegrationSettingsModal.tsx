import React, { useState, useEffect } from 'react';
import { Modal } from '../../../components/componentsreutilizables';
import { Button } from '../../../components/componentsreutilizables';
import { Input } from '../../../components/componentsreutilizables';
import { Select } from '../../../components/componentsreutilizables';
import type { IntegrationSettings, UserIntegration } from '../types';
import { integrationService } from '../api';

interface IntegrationSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  integrationId: string;
  userIntegrationId: string;
  integrationName: string;
}

export const IntegrationSettingsModal: React.FC<
  IntegrationSettingsModalProps
> = ({ isOpen, onClose, integrationId, userIntegrationId, integrationName }) => {
  const [settings, setSettings] = useState<IntegrationSettings>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && userIntegrationId) {
      loadSettings();
    }
  }, [isOpen, userIntegrationId]);

  const loadSettings = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Aquí se cargarían los settings desde la API
      // Por ahora usamos valores por defecto según el tipo de integración
      const defaultSettings = getDefaultSettings(integrationId);
      setSettings(defaultSettings);
    } catch (err: any) {
      setError(err.message || 'Error al cargar la configuración');
    } finally {
      setIsLoading(false);
    }
  };

  const getDefaultSettings = (id: string): IntegrationSettings => {
    // Settings específicos según el tipo de integración
    if (id.includes('calendar')) {
      return {
        calendarToSync: 'primary',
        sendReminders: true,
        reminderTime: '24',
      };
    }
    if (id.includes('stripe') || id.includes('paypal')) {
      return {
        autoCapture: true,
        currency: 'EUR',
        webhookUrl: '',
      };
    }
    if (id.includes('whatsapp')) {
      return {
        enableReminders: true,
        reminderTime: '24',
        templateId: '',
      };
    }
    if (id.includes('mailchimp')) {
      return {
        listId: '',
        autoSubscribe: true,
        updateExisting: true,
      };
    }
    return {};
  };

  const handleSave = async () => {
    setIsSaving(true);
    setError(null);
    try {
      await integrationService.updateSettings(userIntegrationId, settings);
      onClose();
      // Aquí podrías mostrar un mensaje de éxito
    } catch (err: any) {
      setError(err.message || 'Error al guardar la configuración');
    } finally {
      setIsSaving(false);
    }
  };

  const handleChange = (key: string, value: any) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const renderCalendarSettings = () => (
    <div className="space-y-4">
      <Select
        label="Calendario a sincronizar"
        value={settings.calendarToSync || 'primary'}
        onChange={(e) => handleChange('calendarToSync', e.target.value)}
        options={[
          { value: 'primary', label: 'Calendario Principal' },
          { value: 'work', label: 'Trabajo' },
          { value: 'personal', label: 'Personal' },
        ]}
      />
      <div className="flex items-center">
        <input
          type="checkbox"
          id="sendReminders"
          checked={settings.sendReminders || false}
          onChange={(e) => handleChange('sendReminders', e.target.checked)}
          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
        />
        <label htmlFor="sendReminders" className="ml-2 text-sm text-gray-700">
          Enviar recordatorios automáticos
        </label>
      </div>
      {settings.sendReminders && (
        <Select
          label="Tiempo del recordatorio"
          value={settings.reminderTime || '24'}
          onChange={(e) => handleChange('reminderTime', e.target.value)}
          options={[
            { value: '1', label: '1 hora antes' },
            { value: '24', label: '24 horas antes' },
            { value: '48', label: '48 horas antes' },
          ]}
        />
      )}
    </div>
  );

  const renderPaymentSettings = () => (
    <div className="space-y-4">
      <div className="flex items-center">
        <input
          type="checkbox"
          id="autoCapture"
          checked={settings.autoCapture !== false}
          onChange={(e) => handleChange('autoCapture', e.target.checked)}
          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
        />
        <label htmlFor="autoCapture" className="ml-2 text-sm text-gray-700">
          Captura automática de pagos
        </label>
      </div>
      <Select
        label="Moneda"
        value={settings.currency || 'EUR'}
        onChange={(e) => handleChange('currency', e.target.value)}
        options={[
          { value: 'EUR', label: 'EUR - Euro' },
          { value: 'USD', label: 'USD - Dólar' },
          { value: 'GBP', label: 'GBP - Libra' },
        ]}
      />
      <Input
        label="Webhook URL"
        value={settings.webhookUrl || ''}
        onChange={(e) => handleChange('webhookUrl', e.target.value)}
        placeholder="https://tu-dominio.com/webhook"
      />
    </div>
  );

  const renderSettings = () => {
    if (integrationId.includes('calendar')) {
      return renderCalendarSettings();
    }
    if (integrationId.includes('stripe') || integrationId.includes('paypal')) {
      return renderPaymentSettings();
    }
    return (
      <div className="text-sm text-gray-600">
        Esta integración no requiere configuración adicional.
      </div>
    );
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Configuración de ${integrationName}`}
      size="md"
      footer={
        <div className="flex justify-end gap-3">
          <Button variant="secondary" onClick={onClose} disabled={isSaving}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleSave} loading={isSaving}>
            Guardar Cambios
          </Button>
        </div>
      }
    >
      {isLoading ? (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
        </div>
      ) : (
        <div className="space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}
          {renderSettings()}
        </div>
      )}
    </Modal>
  );
};

