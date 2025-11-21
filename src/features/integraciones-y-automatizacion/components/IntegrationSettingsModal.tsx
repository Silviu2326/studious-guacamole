import React, { useState, useEffect } from 'react';
import { Modal } from '../../../components/componentsreutilizables';
import { Button } from '../../../components/componentsreutilizables';
import { Input } from '../../../components/componentsreutilizables';
import { Select } from '../../../components/componentsreutilizables';
import { Calendar, CreditCard, Bell, Mail, Globe, Clock, CheckSquare, DollarSign } from 'lucide-react';
import type { IntegrationSettings } from '../types';
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
      // Simular retardo para ver el estado de carga
      await new Promise(resolve => setTimeout(resolve, 500));
      alert('Configuración guardada correctamente');
      onClose();
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
    <div className="space-y-6">
      <div className="bg-blue-50 p-4 rounded-lg flex items-start gap-3">
        <Calendar className="text-blue-600 mt-1" size={20} />
        <div>
          <h4 className="font-medium text-blue-900">Sincronización de Calendario</h4>
          <p className="text-sm text-blue-700">Configura cómo se sincronizan tus eventos y citas.</p>
        </div>
      </div>
      
      <div className="grid gap-6">
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
        
        <div className="p-4 border border-gray-200 rounded-lg space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bell size={18} className="text-gray-500" />
              <label htmlFor="sendReminders" className="text-sm font-medium text-gray-700">
                Enviar recordatorios automáticos
              </label>
            </div>
            <input
              type="checkbox"
              id="sendReminders"
              checked={settings.sendReminders || false}
              onChange={(e) => handleChange('sendReminders', e.target.checked)}
              className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
          </div>
          
          {settings.sendReminders && (
            <div className="pl-7 animate-in fade-in slide-in-from-top-2">
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
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderPaymentSettings = () => (
    <div className="space-y-6">
      <div className="bg-green-50 p-4 rounded-lg flex items-start gap-3">
        <CreditCard className="text-green-600 mt-1" size={20} />
        <div>
          <h4 className="font-medium text-green-900">Configuración de Pagos</h4>
          <p className="text-sm text-green-700">Gestiona cómo se procesan los cobros y monedas.</p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
          <CheckSquare className="text-gray-400 mr-3" size={20} />
          <div className="flex-1">
            <label htmlFor="autoCapture" className="text-sm font-medium text-gray-900 block">
              Captura automática de pagos
            </label>
            <span className="text-xs text-gray-500">Procesar el cargo inmediatamente al recibir la orden</span>
          </div>
          <input
            type="checkbox"
            id="autoCapture"
            checked={settings.autoCapture !== false}
            onChange={(e) => handleChange('autoCapture', e.target.checked)}
            className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Select
            label="Moneda Principal"
            value={settings.currency || 'EUR'}
            onChange={(e) => handleChange('currency', e.target.value)}
            options={[
              { value: 'EUR', label: 'EUR - Euro' },
              { value: 'USD', label: 'USD - Dólar' },
              { value: 'GBP', label: 'GBP - Libra' },
            ]}
          />
        </div>

        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none pt-6">
            <Globe className="h-5 w-5 text-gray-400" />
          </div>
          <Input
            label="Webhook URL (Opcional)"
            value={settings.webhookUrl || ''}
            onChange={(e) => handleChange('webhookUrl', e.target.value)}
            placeholder="https://tu-dominio.com/webhook"
            className="pl-10"
          />
          <p className="text-xs text-gray-500 mt-1">URL para recibir notificaciones de eventos de pago en tiempo real.</p>
        </div>
      </div>
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
      <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg border border-dashed border-gray-200">
        <CheckSquare size={32} className="mx-auto mb-2 text-gray-400" />
        <p>Esta integración no requiere configuración adicional.</p>
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
        <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
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
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
        </div>
      ) : (
        <div className="space-y-6 py-2">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
              <div className="text-red-500 mt-0.5">⚠️</div>
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}
          {renderSettings()}
        </div>
      )}
    </Modal>
  );
};

