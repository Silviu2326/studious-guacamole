import React, { useState } from 'react';
import { Card, Button, Input, Select, Textarea, Modal } from '../../../components/componentsreutilizables';
import { ds } from '../../adherencia/ui/ds';
import { Campaign, CampaignObjective, CampaignType, CommunicationChannel, AudienceSegment } from '../types';

interface CampaignBuilderProps {
  onClose: () => void;
  onSave: (campaign: Omit<Campaign, 'id' | 'createdAt' | 'updatedAt'>) => void;
  audienceSegments: AudienceSegment[];
  campaign?: Campaign;
}

export const CampaignBuilder: React.FC<CampaignBuilderProps> = ({
  onClose,
  onSave,
  audienceSegments,
  campaign
}) => {
  const [formData, setFormData] = useState({
    name: campaign?.name || '',
    description: campaign?.description || '',
    objective: campaign?.objective || 'captacion' as CampaignObjective,
    type: campaign?.type || 'one_time' as CampaignType,
    channels: campaign?.channels || [] as CommunicationChannel[],
    audienceSegmentId: campaign?.audience.id || '',
    scheduleType: campaign?.schedule.type || 'immediate',
    startDate: campaign?.schedule.startDate ? campaign.schedule.startDate.toISOString().split('T')[0] : '',
    startTime: campaign?.schedule.startDate ? campaign.schedule.startDate.toTimeString().split(' ')[0].slice(0, 5) : '',
    endDate: campaign?.schedule.endDate ? campaign.schedule.endDate.toISOString().split('T')[0] : '',
    emailSubject: '',
    emailBody: '',
    whatsappMessage: '',
    smsMessage: ''
  });

  const [currentStep, setCurrentStep] = useState(1);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const objectiveOptions = [
    { value: 'captacion', label: 'Captación de nuevos socios' },
    { value: 'retencion', label: 'Retención de socios existentes' },
    { value: 'promocion', label: 'Promoción de servicios' },
    { value: 'reactivacion', label: 'Reactivación de socios inactivos' },
    { value: 'upselling', label: 'Venta cruzada' },
    { value: 'nurturing', label: 'Nutrición de leads' }
  ];

  const typeOptions = [
    { value: 'one_time', label: 'Campaña única' },
    { value: 'recurring', label: 'Campaña recurrente' },
    { value: 'automated', label: 'Campaña automatizada' },
    { value: 'drip', label: 'Secuencia de goteo' }
  ];

  const channelOptions = [
    { value: 'whatsapp', label: 'WhatsApp' },
    { value: 'email', label: 'Email' },
    { value: 'sms', label: 'SMS' },
    { value: 'push_notification', label: 'Push Notification' }
  ];

  const scheduleOptions = [
    { value: 'immediate', label: 'Enviar inmediatamente' },
    { value: 'scheduled', label: 'Programar envío' },
    { value: 'trigger_based', label: 'Basado en triggers' }
  ];

  const audienceOptions = audienceSegments.map(segment => ({
    value: segment.id,
    label: `${segment.name} (${segment.size} contactos)`
  }));

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleChannelToggle = (channel: CommunicationChannel) => {
    const newChannels = formData.channels.includes(channel)
      ? formData.channels.filter(c => c !== channel)
      : [...formData.channels, channel];
    
    handleInputChange('channels', newChannels);
  };

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (step === 1) {
      if (!formData.name.trim()) {
        newErrors.name = 'El nombre de la campaña es requerido';
      }
      if (!formData.objective) {
        newErrors.objective = 'El objetivo es requerido';
      }
      if (!formData.type) {
        newErrors.type = 'El tipo de campaña es requerido';
      }
    }

    if (step === 2) {
      if (!formData.audienceSegmentId) {
        newErrors.audienceSegmentId = 'Debe seleccionar un segmento de audiencia';
      }
      if (formData.channels.length === 0) {
        newErrors.channels = 'Debe seleccionar al menos un canal de comunicación';
      }
    }

    if (step === 3) {
      if (formData.scheduleType === 'scheduled') {
        if (!formData.startDate) {
          newErrors.startDate = 'La fecha de inicio es requerida';
        }
        if (!formData.startTime) {
          newErrors.startTime = 'La hora de inicio es requerida';
        }
      }
    }

    if (step === 4) {
      if (formData.channels.includes('email')) {
        if (!formData.emailSubject.trim()) {
          newErrors.emailSubject = 'El asunto del email es requerido';
        }
        if (!formData.emailBody.trim()) {
          newErrors.emailBody = 'El contenido del email es requerido';
        }
      }
      if (formData.channels.includes('whatsapp') && !formData.whatsappMessage.trim()) {
        newErrors.whatsappMessage = 'El mensaje de WhatsApp es requerido';
      }
      if (formData.channels.includes('sms') && !formData.smsMessage.trim()) {
        newErrors.smsMessage = 'El mensaje SMS es requerido';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => prev - 1);
  };

  const handleSubmit = () => {
    if (!validateStep(4)) return;

    const selectedSegment = audienceSegments.find(s => s.id === formData.audienceSegmentId);
    if (!selectedSegment) return;

    const startDateTime = formData.scheduleType === 'scheduled' && formData.startDate && formData.startTime
      ? new Date(`${formData.startDate}T${formData.startTime}`)
      : undefined;

    const endDateTime = formData.endDate ? new Date(formData.endDate) : undefined;

    const campaignData: Omit<Campaign, 'id' | 'createdAt' | 'updatedAt'> = {
      name: formData.name,
      description: formData.description || undefined,
      objective: formData.objective,
      status: 'draft',
      type: formData.type,
      channels: formData.channels,
      audience: selectedSegment,
      content: {
        templates: [
          ...(formData.channels.includes('email') ? [{
            id: 'email-template',
            channel: 'email' as CommunicationChannel,
            subject: formData.emailSubject,
            body: formData.emailBody,
            variables: []
          }] : []),
          ...(formData.channels.includes('whatsapp') ? [{
            id: 'whatsapp-template',
            channel: 'whatsapp' as CommunicationChannel,
            body: formData.whatsappMessage,
            variables: []
          }] : []),
          ...(formData.channels.includes('sms') ? [{
            id: 'sms-template',
            channel: 'sms' as CommunicationChannel,
            body: formData.smsMessage,
            variables: []
          }] : [])
        ],
        personalizations: []
      },
      schedule: {
        type: formData.scheduleType as any,
        startDate: startDateTime,
        endDate: endDateTime,
        timezone: 'America/Mexico_City'
      },
      metrics: {
        sent: 0,
        delivered: 0,
        opened: 0,
        clicked: 0,
        converted: 0,
        unsubscribed: 0,
        bounced: 0,
        engagementRate: 0,
        conversionRate: 0,
        deliveryRate: 0,
        openRate: 0,
        clickRate: 0,
        unsubscribeRate: 0
      },
      createdBy: 'admin'
    };

    onSave(campaignData);
  };

  const steps = [
    { number: 1, title: 'Información Básica', icon: '📝' },
    { number: 2, title: 'Audiencia y Canales', icon: '👥' },
    { number: 3, title: 'Programación', icon: '📅' },
    { number: 4, title: 'Contenido', icon: '✍️' }
  ];

  return (
    <Modal onClose={onClose} className="max-w-4xl">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className={`${ds.typography.h2} ${ds.color.textPrimary}`}>
            {campaign ? 'Editar Campaña' : 'Nueva Campaña'}
          </h2>
          <Button onClick={onClose} variant="ghost" size="sm">
            ✕
          </Button>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <div key={step.number} className="flex items-center">
              <div className={`
                flex items-center justify-center w-10 h-10 rounded-full text-sm font-semibold
                ${currentStep >= step.number 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
                }
              `}>
                {currentStep > step.number ? '✓' : step.icon}
              </div>
              <div className="ml-3 hidden sm:block">
                <div className={`text-sm font-medium ${
                  currentStep >= step.number ? ds.color.textPrimary : ds.color.textMuted
                }`}>
                  {step.title}
                </div>
              </div>
              {index < steps.length - 1 && (
                <div className={`
                  w-8 h-0.5 mx-4
                  ${currentStep > step.number ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'}
                `} />
              )}
            </div>
          ))}
        </div>

        {/* Step Content */}
        <Card className="min-h-[400px]">
          {currentStep === 1 && (
            <div className="space-y-6">
              <h3 className={`${ds.typography.h3} ${ds.color.textPrimary} mb-4`}>
                Información Básica de la Campaña
              </h3>
              
              <Input
                label="Nombre de la campaña"
                placeholder="Ej: Black Friday 2024"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                error={errors.name}
                required
              />
              
              <Textarea
                label="Descripción (opcional)"
                placeholder="Describe el propósito y objetivos de esta campaña..."
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                rows={3}
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Select
                  label="Objetivo de la campaña"
                  options={objectiveOptions}
                  value={formData.objective}
                  onChange={(value) => handleInputChange('objective', value)}
                  error={errors.objective}
                  required
                />
                
                <Select
                  label="Tipo de campaña"
                  options={typeOptions}
                  value={formData.type}
                  onChange={(value) => handleInputChange('type', value)}
                  error={errors.type}
                  required
                />
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-6">
              <h3 className={`${ds.typography.h3} ${ds.color.textPrimary} mb-4`}>
                Audiencia y Canales de Comunicación
              </h3>
              
              <Select
                label="Segmento de audiencia"
                options={audienceOptions}
                value={formData.audienceSegmentId}
                onChange={(value) => handleInputChange('audienceSegmentId', value)}
                error={errors.audienceSegmentId}
                placeholder="Selecciona el segmento objetivo"
                required
              />
              
              <div>
                <label className={`block ${ds.typography.bodySmall} font-semibold ${ds.color.textPrimary} mb-3`}>
                  Canales de comunicación *
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {channelOptions.map((channel) => (
                    <button
                      key={channel.value}
                      type="button"
                      onClick={() => handleChannelToggle(channel.value as CommunicationChannel)}
                      className={`
                        p-4 rounded-xl border-2 text-center transition-all
                        ${formData.channels.includes(channel.value as CommunicationChannel)
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                          : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                        }
                      `}
                    >
                      <div className="text-2xl mb-2">
                        {channel.value === 'whatsapp' && '💬'}
                        {channel.value === 'email' && '📧'}
                        {channel.value === 'sms' && '📱'}
                        {channel.value === 'push_notification' && '🔔'}
                      </div>
                      <div className={`text-sm font-medium ${ds.color.textPrimary}`}>
                        {channel.label}
                      </div>
                    </button>
                  ))}
                </div>
                {errors.channels && (
                  <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                    {errors.channels}
                  </p>
                )}
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-6">
              <h3 className={`${ds.typography.h3} ${ds.color.textPrimary} mb-4`}>
                Programación de la Campaña
              </h3>
              
              <Select
                label="Tipo de programación"
                options={scheduleOptions}
                value={formData.scheduleType}
                onChange={(value) => handleInputChange('scheduleType', value)}
                required
              />
              
              {formData.scheduleType === 'scheduled' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input
                    label="Fecha de inicio"
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => handleInputChange('startDate', e.target.value)}
                    error={errors.startDate}
                    required
                  />
                  
                  <Input
                    label="Hora de inicio"
                    type="time"
                    value={formData.startTime}
                    onChange={(e) => handleInputChange('startTime', e.target.value)}
                    error={errors.startTime}
                    required
                  />
                </div>
              )}
              
              <Input
                label="Fecha de finalización (opcional)"
                type="date"
                value={formData.endDate}
                onChange={(e) => handleInputChange('endDate', e.target.value)}
              />
            </div>
          )}

          {currentStep === 4 && (
            <div className="space-y-6">
              <h3 className={`${ds.typography.h3} ${ds.color.textPrimary} mb-4`}>
                Contenido de la Campaña
              </h3>
              
              {formData.channels.includes('email') && (
                <div className="space-y-4">
                  <h4 className={`${ds.typography.h4} ${ds.color.textPrimary}`}>
                    📧 Contenido del Email
                  </h4>
                  <Input
                    label="Asunto del email"
                    placeholder="Ej: ¡Oferta especial solo para ti!"
                    value={formData.emailSubject}
                    onChange={(e) => handleInputChange('emailSubject', e.target.value)}
                    error={errors.emailSubject}
                    required
                  />
                  <Textarea
                    label="Contenido del email"
                    placeholder="Escribe el contenido del email..."
                    value={formData.emailBody}
                    onChange={(e) => handleInputChange('emailBody', e.target.value)}
                    error={errors.emailBody}
                    rows={4}
                    required
                  />
                </div>
              )}
              
              {formData.channels.includes('whatsapp') && (
                <div className="space-y-4">
                  <h4 className={`${ds.typography.h4} ${ds.color.textPrimary}`}>
                    💬 Mensaje de WhatsApp
                  </h4>
                  <Textarea
                    label="Mensaje"
                    placeholder="Hola! Tenemos una oferta especial para ti..."
                    value={formData.whatsappMessage}
                    onChange={(e) => handleInputChange('whatsappMessage', e.target.value)}
                    error={errors.whatsappMessage}
                    rows={3}
                    required
                  />
                </div>
              )}
              
              {formData.channels.includes('sms') && (
                <div className="space-y-4">
                  <h4 className={`${ds.typography.h4} ${ds.color.textPrimary}`}>
                    📱 Mensaje SMS
                  </h4>
                  <Textarea
                    label="Mensaje (máx. 160 caracteres)"
                    placeholder="Oferta especial en FitGym..."
                    value={formData.smsMessage}
                    onChange={(e) => handleInputChange('smsMessage', e.target.value)}
                    error={errors.smsMessage}
                    rows={2}
                    maxLength={160}
                    required
                  />
                  <p className={`text-sm ${ds.color.textMuted}`}>
                    {formData.smsMessage.length}/160 caracteres
                  </p>
                </div>
              )}
            </div>
          )}
        </Card>

        {/* Navigation */}
        <div className="flex justify-between">
          <Button
            onClick={handlePrevious}
            variant="ghost"
            disabled={currentStep === 1}
          >
            ← Anterior
          </Button>
          
          <div className="flex gap-3">
            <Button onClick={onClose} variant="ghost">
              Cancelar
            </Button>
            
            {currentStep < 4 ? (
              <Button onClick={handleNext} variant="primary">
                Siguiente →
              </Button>
            ) : (
              <Button onClick={handleSubmit} variant="primary">
                {campaign ? 'Actualizar Campaña' : 'Crear Campaña'}
              </Button>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
};