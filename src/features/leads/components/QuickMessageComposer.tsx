import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { Card, Button, Modal, Select, Textarea } from '../../../components/componentsreutilizables';
import { ds } from '../../adherencia/ui/ds';
import { Lead, InteractionChannel } from '../types';
import { TemplateService } from '../services/templateService';
import { createInteraction } from '../api';
import {
  Send,
  MessageSquare,
  Mail,
  Phone,
  FileText,
  X
} from 'lucide-react';

interface QuickMessageComposerProps {
  lead: Lead;
  isOpen: boolean;
  onClose: () => void;
  onSent?: () => void;
}

export const QuickMessageComposer: React.FC<QuickMessageComposerProps> = ({
  lead,
  isOpen,
  onClose,
  onSent
}) => {
  const { user } = useAuth();
  const [channel, setChannel] = useState<InteractionChannel>('whatsapp');
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [templates, setTemplates] = useState<any[]>([]);
  const [message, setMessage] = useState('');
  const [subject, setSubject] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadTemplates();
    }
  }, [isOpen, lead.businessType]);

  useEffect(() => {
    if (selectedTemplate) {
      applyTemplate(selectedTemplate);
    }
  }, [selectedTemplate, channel]);

  const loadTemplates = async () => {
    try {
      const data = await TemplateService.getTemplates(lead.businessType, channel);
      setTemplates(data);
    } catch (error) {
      console.error('Error cargando plantillas:', error);
    }
  };

  const applyTemplate = async (templateId: string) => {
    try {
      const template = await TemplateService.getTemplate(templateId);
      if (template) {
        const personalized = TemplateService.personalizeTemplate(template, lead);
        setMessage(personalized);
        if (template.subject) {
          setSubject(template.subject);
        }
      }
    } catch (error) {
      console.error('Error aplicando plantilla:', error);
    }
  };

  const handleChannelChange = (newChannel: InteractionChannel) => {
    setChannel(newChannel);
    setSelectedTemplate('');
    setMessage('');
    setSubject('');
    loadTemplates();
  };

  const handleSend = async () => {
    if (!message.trim()) {
      alert('Por favor escribe un mensaje');
      return;
    }

    setLoading(true);
    try {
      // Registrar interacción
      await createInteraction(lead.id, {
        type: channel === 'whatsapp' ? 'whatsapp_sent' :
              channel === 'email' ? 'email_sent' :
              channel === 'sms' ? 'sms_sent' : 'call',
        channel,
        description: channel === 'email' ? `Email enviado: ${subject}` : `Mensaje ${channel} enviado`,
        outcome: 'neutral',
        date: new Date()
      });

      // Incrementar uso de plantilla si se usó una
      if (selectedTemplate) {
        await TemplateService.incrementUsage(selectedTemplate);
      }

      // En producción, aquí se enviaría el mensaje real
      console.log('[QuickMessageComposer] Mensaje enviado:', {
        leadId: lead.id,
        channel,
        subject: channel === 'email' ? subject : undefined,
        message
      });

      setMessage('');
      setSubject('');
      setSelectedTemplate('');
      onSent?.();
      onClose();
    } catch (error) {
      console.error('Error enviando mensaje:', error);
      alert('Error al enviar el mensaje');
    } finally {
      setLoading(false);
    }
  };

  const channelOptions: InteractionChannel[] = ['whatsapp', 'email', 'sms'];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Enviar Mensaje a ${lead.name}`}
      size="md"
      footer={
        <div className="flex items-center justify-end gap-3">
          <Button variant="secondary" onClick={onClose}>
            Cancelar
          </Button>
          <Button
            variant="primary"
            onClick={handleSend}
            disabled={loading || !message.trim()}
          >
            <Send className="w-4 h-4 mr-2" />
            {loading ? 'Enviando...' : 'Enviar'}
          </Button>
        </div>
      }
    >
      <div className="space-y-4">
        {/* Selector de canal */}
        <div>
          <label className="block text-sm font-medium text-gray-900 dark:text-[#F1F5F9] mb-2">
            Canal
          </label>
          <div className="flex items-center gap-2">
            {channelOptions.map(opt => (
              <button
                key={opt}
                type="button"
                onClick={() => handleChannelChange(opt)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
                  channel === opt
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white dark:bg-[#1E1E2E] text-gray-900 dark:text-[#F1F5F9] border-gray-300 dark:border-[#334155] hover:bg-gray-50 dark:hover:bg-[#2A2A3E]'
                }`}
              >
                {opt === 'whatsapp' && <MessageSquare className="w-4 h-4" />}
                {opt === 'email' && <Mail className="w-4 h-4" />}
                {opt === 'sms' && <Phone className="w-4 h-4" />}
                <span className="capitalize">{opt}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Selector de plantilla */}
        {templates.length > 0 && (
          <div>
            <label className="block text-sm font-medium text-gray-900 dark:text-[#F1F5F9] mb-2">
              Usar Plantilla (opcional)
            </label>
            <Select
              value={selectedTemplate}
              onChange={(e) => setSelectedTemplate(e.target.value)}
              options={[
                { value: '', label: 'Sin plantilla' },
                ...templates.map(t => ({
                  value: t.id,
                  label: `${t.name} (${t.category})`
                }))
              ]}
            />
            {selectedTemplate && (
              <button
                type="button"
                onClick={() => {
                  setSelectedTemplate('');
                  setMessage('');
                  setSubject('');
                }}
                className="mt-2 text-xs text-blue-600 dark:text-blue-400 hover:underline"
              >
                Limpiar plantilla
              </button>
            )}
          </div>
        )}

        {/* Asunto (solo para email) */}
        {channel === 'email' && (
          <div>
            <label className="block text-sm font-medium text-gray-900 dark:text-[#F1F5F9] mb-2">
              Asunto *
            </label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Asunto del email"
              className="w-full px-3 py-2 border border-gray-300 dark:border-[#334155] rounded-lg bg-white dark:bg-[#1E1E2E] text-gray-900 dark:text-[#F1F5F9]"
              required={channel === 'email'}
            />
          </div>
        )}

        {/* Mensaje */}
        <div>
          <label className="block text-sm font-medium text-gray-900 dark:text-[#F1F5F9] mb-2">
            Mensaje *
          </label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={`Escribe tu mensaje para ${lead.name}...`}
            className="w-full px-3 py-2 border border-gray-300 dark:border-[#334155] rounded-lg bg-white dark:bg-[#1E1E2E] text-gray-900 dark:text-[#F1F5F9] min-h-[150px]"
            required
          />
          <div className="mt-2 text-xs text-gray-600 dark:text-[#94A3B8]">
            {message.length} caracteres
          </div>
        </div>

        {/* Preview del lead */}
        <div className="p-3 bg-gray-50 dark:bg-[#1E1E2E] rounded-lg">
          <div className="text-sm font-medium text-gray-900 dark:text-[#F1F5F9] mb-1">
            Enviando a:
          </div>
          <div className="text-sm text-gray-600 dark:text-[#94A3B8]">
            {lead.name}
            {lead.email && channel === 'email' && ` (${lead.email})`}
            {lead.phone && (channel === 'whatsapp' || channel === 'sms') && ` (${lead.phone})`}
          </div>
        </div>
      </div>
    </Modal>
  );
};

