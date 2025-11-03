import React, { useState, useEffect } from 'react';
import { EmailCampaign, EmailTemplate, getEmailTemplates, createCampaign, updateCampaign, scheduleCampaign } from '../api/campaigns';
import { SegmentSelector } from './SegmentSelector';
import { getSegments, EmailSegment } from '../api/campaigns';
import { X, ArrowLeft, ArrowRight, Mail, Loader2, Save, Send, Clock } from 'lucide-react';

interface CampaignBuilderContainerProps {
  campaignId?: string | null;
  onSave?: (campaign: EmailCampaign) => void;
  onCancel?: () => void;
}

type BuilderStep = 'setup' | 'design' | 'audience' | 'schedule';

/**
 * Componente principal que gestiona el estado y la lógica para crear o editar
 * una campaña de email. Orquesta los pasos del proceso.
 */
export const CampaignBuilderContainer: React.FC<CampaignBuilderContainerProps> = ({
  campaignId,
  onSave,
  onCancel
}) => {
  const [currentStep, setCurrentStep] = useState<BuilderStep>('setup');
  const [campaignData, setCampaignData] = useState<Partial<EmailCampaign>>({
    name: '',
    subject: '',
    bodyHtml: '<html><body><p>Contenido del email...</p></body></html>',
    fromName: 'TrainerERP',
    fromEmail: 'noreply@trainererp.com'
  });
  const [selectedSegmentId, setSelectedSegmentId] = useState<string | null>(null);
  const [scheduleDate, setScheduleDate] = useState<string>('');
  const [scheduleTime, setScheduleTime] = useState<string>('');
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [segments, setSegments] = useState<EmailSegment[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);

  useEffect(() => {
    loadTemplates();
    loadSegments();
  }, []);

  const loadTemplates = async () => {
    try {
      const data = await getEmailTemplates();
      setTemplates(data);
    } catch (error) {
      console.error('Error cargando plantillas:', error);
    }
  };

  const loadSegments = async () => {
    try {
      const data = await getSegments();
      setSegments(data);
    } catch (error) {
      console.error('Error cargando segmentos:', error);
    }
  };

  const handleNext = () => {
    const steps: BuilderStep[] = ['setup', 'design', 'audience', 'schedule'];
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex < steps.length - 1) {
      setCurrentStep(steps[currentIndex + 1]);
    }
  };

  const handlePrevious = () => {
    const steps: BuilderStep[] = ['setup', 'design', 'audience', 'schedule'];
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1]);
    }
  };

  const handleSaveDraft = async () => {
    setIsSaving(true);
    try {
      const campaignToSave = {
        ...campaignData,
        segmentId: selectedSegmentId || undefined
      } as Omit<EmailCampaign, 'id' | 'createdAt' | 'status'>;

      const saved = campaignId
        ? await updateCampaign(campaignId, campaignToSave)
        : await createCampaign(campaignToSave);

      onSave?.(saved);
    } catch (error) {
      console.error('Error guardando campaña:', error);
      alert('Error al guardar la campaña');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSchedule = async () => {
    if (!campaignData.name || !campaignData.subject || !selectedSegmentId) {
      alert('Por favor, completa todos los campos requeridos');
      return;
    }

    setIsSaving(true);
    try {
      let saved: EmailCampaign;
      
      if (campaignId) {
        saved = await updateCampaign(campaignId, {
          ...campaignData,
          segmentId: selectedSegmentId
        } as Partial<EmailCampaign>);
      } else {
        saved = await createCampaign({
          ...campaignData,
          segmentId: selectedSegmentId
        } as Omit<EmailCampaign, 'id' | 'createdAt' | 'status'>);
      }

      // Programar o enviar
      const scheduledDateTime = scheduleDate && scheduleTime
        ? `${scheduleDate}T${scheduleTime}:00`
        : undefined;

      const scheduled = await scheduleCampaign(saved.id, scheduledDateTime);
      onSave?.(scheduled);
    } catch (error) {
      console.error('Error programando campaña:', error);
      alert('Error al programar la campaña');
    } finally {
      setIsSaving(false);
    }
  };

  const handleTemplateSelect = (templateId: string) => {
    const template = templates.find(t => t.id === templateId);
    if (template) {
      setCampaignData(prev => ({
        ...prev,
        bodyHtml: template.bodyHtml
      }));
      setSelectedTemplate(templateId);
    }
  };

  const steps = [
    { id: 'setup', label: 'Configuración' },
    { id: 'design', label: 'Diseño' },
    { id: 'audience', label: 'Audiencia' },
    { id: 'schedule', label: 'Programar' }
  ];

  const currentStepIndex = steps.findIndex(s => s.id === currentStep);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header con progreso */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              {onCancel && (
                <button
                  onClick={onCancel}
                  className="p-2 hover:bg-gray-100 rounded-lg transition"
                >
                  <ArrowLeft className="w-5 h-5 text-gray-600" />
                </button>
              )}
              <h2 className="text-xl font-semibold text-gray-900">
                {campaignId ? 'Editar Campaña' : 'Nueva Campaña de Email'}
              </h2>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleSaveDraft}
                disabled={isSaving}
                className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                Guardar Borrador
              </button>
            </div>
          </div>

          {/* Indicador de pasos */}
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center flex-1">
                <div className="flex flex-col items-center flex-1">
                  <button
                    onClick={() => setCurrentStep(step.id as BuilderStep)}
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-medium transition ${
                      index <= currentStepIndex
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-200 text-gray-600'
                    }`}
                  >
                    {index + 1}
                  </button>
                  <span className="mt-2 text-xs font-medium text-gray-600">{step.label}</span>
                </div>
                {index < steps.length - 1 && (
                  <div className={`flex-1 h-1 mx-2 ${
                    index < currentStepIndex ? 'bg-purple-600' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Contenido del paso actual */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentStep === 'setup' && (
          <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">Configuración Básica</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombre de la Campaña *
              </label>
              <input
                type="text"
                value={campaignData.name || ''}
                onChange={(e) => setCampaignData(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Ej: Newsletter Mensual Octubre"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Asunto del Email *
              </label>
              <input
                type="text"
                value={campaignData.subject || ''}
                onChange={(e) => setCampaignData(prev => ({ ...prev, subject: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Ej: 💪 ¿Listo para tu mejor versión este verano?"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre del Remitente
                </label>
                <input
                  type="text"
                  value={campaignData.fromName || ''}
                  onChange={(e) => setCampaignData(prev => ({ ...prev, fromName: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email del Remitente
                </label>
                <input
                  type="email"
                  value={campaignData.fromEmail || ''}
                  onChange={(e) => setCampaignData(prev => ({ ...prev, fromEmail: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
        )}

        {currentStep === 'design' && (
          <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">Diseño del Email</h3>
            
            {/* Selección de plantilla */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Plantillas Disponibles
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {templates.map((template) => (
                  <button
                    key={template.id}
                    onClick={() => handleTemplateSelect(template.id)}
                    className={`p-4 border-2 rounded-lg transition-all text-left ${
                      selectedTemplate === template.id
                        ? 'border-purple-500 bg-purple-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {template.thumbnailUrl && (
                      <img
                        src={template.thumbnailUrl}
                        alt={template.name}
                        className="w-full h-32 object-cover rounded mb-2"
                      />
                    )}
                    <h4 className="font-medium text-gray-900 mb-1">{template.name}</h4>
                    {template.description && (
                      <p className="text-xs text-gray-600">{template.description}</p>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Editor simplificado */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Contenido HTML del Email
              </label>
              <textarea
                value={campaignData.bodyHtml || ''}
                onChange={(e) => setCampaignData(prev => ({ ...prev, bodyHtml: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent font-mono text-sm"
                rows={15}
                placeholder="Código HTML del email..."
              />
              <p className="text-xs text-gray-500 mt-2">
                Nota: En producción, aquí estaría el editor visual de arrastrar y soltar
              </p>
            </div>
          </div>
        )}

        {currentStep === 'audience' && (
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Seleccionar Audiencia</h3>
            <SegmentSelector
              segments={segments}
              selectedSegmentId={selectedSegmentId}
              onSegmentSelect={setSelectedSegmentId}
            />
            {selectedSegmentId && (
              <div className="mt-4 p-4 bg-purple-50 border border-purple-200 rounded-lg">
                <p className="text-sm text-purple-900">
                  ✓ Segmento seleccionado: {segments.find(s => s.id === selectedSegmentId)?.name}
                  {' '}
                  ({segments.find(s => s.id === selectedSegmentId)?.contactCount} contactos)
                </p>
              </div>
            )}
          </div>
        )}

        {currentStep === 'schedule' && (
          <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">Programar Envío</h3>
            
            <div className="space-y-4">
              <div>
                <label className="flex items-center gap-2 mb-4">
                  <input
                    type="radio"
                    name="sendOption"
                    value="now"
                    defaultChecked
                    className="w-4 h-4 text-purple-600"
                  />
                  <span className="text-sm font-medium text-gray-700">Enviar inmediatamente</span>
                </label>
              </div>

              <div>
                <label className="flex items-center gap-2 mb-4">
                  <input
                    type="radio"
                    name="sendOption"
                    value="schedule"
                    className="w-4 h-4 text-purple-600"
                  />
                  <span className="text-sm font-medium text-gray-700">Programar para más tarde</span>
                </label>
                
                <div className="ml-6 grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Fecha</label>
                    <input
                      type="date"
                      value={scheduleDate}
                      onChange={(e) => setScheduleDate(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Hora</label>
                    <input
                      type="time"
                      value={scheduleTime}
                      onChange={(e) => setScheduleTime(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Resumen */}
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">Resumen de la Campaña</h4>
              <div className="space-y-1 text-sm text-gray-600">
                <p><span className="font-medium">Nombre:</span> {campaignData.name || 'Sin nombre'}</p>
                <p><span className="font-medium">Asunto:</span> {campaignData.subject || 'Sin asunto'}</p>
                <p>
                  <span className="font-medium">Audiencia:</span>{' '}
                  {selectedSegmentId
                    ? segments.find(s => s.id === selectedSegmentId)?.name
                    : 'No seleccionada'}
                </p>
                {selectedSegmentId && (
                  <p>
                    <span className="font-medium">Contactos:</span>{' '}
                    {segments.find(s => s.id === selectedSegmentId)?.contactCount} destinatarios
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Navegación */}
        <div className="mt-6 flex items-center justify-between">
          <button
            onClick={handlePrevious}
            disabled={currentStep === 'setup'}
            className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ArrowLeft className="w-4 h-4" />
            Anterior
          </button>

          <div className="flex items-center gap-2">
            {currentStep === 'schedule' ? (
              <button
                onClick={handleSchedule}
                disabled={isSaving || !campaignData.name || !campaignData.subject || !selectedSegmentId}
                className="flex items-center gap-2 px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {scheduleDate && scheduleTime ? (
                  <>
                    <Clock className="w-4 h-4" />
                    Programar Envío
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Enviar Ahora
                  </>
                )}
              </button>
            ) : (
              <button
                onClick={handleNext}
                disabled={currentStep === 'schedule'}
                className="flex items-center gap-2 px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Siguiente
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};


