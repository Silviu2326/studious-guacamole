import { useState, useCallback } from 'react';
import {
  MessageSquare,
  Mail,
  Sparkles,
  Check,
  X,
  Loader2,
  AlertCircle,
  Copy,
  Send,
  Clock,
  Zap,
} from 'lucide-react';
import { Button, Card, Badge, Input, Select, Textarea } from '../../../components/componentsreutilizables';
import { FunnelsAdquisicionService } from '../services/funnelsAdquisicionService';
import {
  FollowUpTemplateGenerationRequest,
  FollowUpTemplateGenerationResponse,
  PostRegistrationFollowUpTemplate,
  FollowUpTemplateApplication,
  FollowUpTemplateApplicationResponse,
  FollowUpChannel,
  FollowUpTiming,
  ToneOfVoice,
  AcquisitionFunnelPerformance,
} from '../types';

interface PostRegistrationFollowUpTemplatesProps {
  funnel?: AcquisitionFunnelPerformance;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (response: FollowUpTemplateApplicationResponse) => void;
}

const channelOptions: { value: FollowUpChannel; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { value: 'whatsapp', label: 'WhatsApp', icon: MessageSquare },
  { value: 'email', label: 'Email', icon: Mail },
];

const timingOptions: { value: FollowUpTiming; label: string }[] = [
  { value: 'immediate', label: 'Inmediato' },
  { value: '1h', label: '1 hora después' },
  { value: '6h', label: '6 horas después' },
  { value: '24h', label: '24 horas después' },
  { value: '48h', label: '48 horas después' },
  { value: '3d', label: '3 días después' },
  { value: '7d', label: '7 días después' },
];

const toneOptions: { value: ToneOfVoice; label: string }[] = [
  { value: 'motivacional', label: 'Motivacional' },
  { value: 'educativo', label: 'Educativo' },
  { value: 'enérgico', label: 'Enérgico' },
  { value: 'empático', label: 'Empático' },
  { value: 'profesional', label: 'Profesional' },
  { value: 'directo', label: 'Directo' },
  { value: 'inspirador', label: 'Inspirador' },
  { value: 'cercano', label: 'Cercano' },
];

export function PostRegistrationFollowUpTemplates({
  funnel,
  isOpen,
  onClose,
  onSuccess,
}: PostRegistrationFollowUpTemplatesProps) {
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [channel, setChannel] = useState<FollowUpChannel>('whatsapp');
  const [timing, setTiming] = useState<FollowUpTiming>('24h');
  const [tone, setTone] = useState<ToneOfVoice>('cercano');
  const [customToneDescription, setCustomToneDescription] = useState('');
  const [objective, setObjective] = useState('cerrar venta');
  const [ctaText, setCtaText] = useState('Agendar consulta');
  const [ctaUrl, setCtaUrl] = useState('');
  const [includeCTA, setIncludeCTA] = useState(true);
  const [templates, setTemplates] = useState<PostRegistrationFollowUpTemplate[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<PostRegistrationFollowUpTemplate | null>(null);
  const [leadName, setLeadName] = useState('');
  const [leadEmail, setLeadEmail] = useState('');
  const [leadPhone, setLeadPhone] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<{ subject?: string; body: string } | null>(null);

  const generatePreview = useCallback((template: PostRegistrationFollowUpTemplate, leadNameValue?: string) => {
    let body = template.message;
    let subject = template.subject;

    // Reemplazar variables con valores de ejemplo
    const variables: Record<string, string> = {
      '{{nombre}}': leadNameValue || leadName || 'Juan',
      '{{funnel}}': funnel?.name || 'Funnel Principal',
      '{{fecha_registro}}': new Date().toLocaleDateString('es-ES'),
      '{{cta_text}}': template.cta?.text || ctaText || 'Agendar consulta',
    };

    Object.entries(variables).forEach(([key, value]) => {
      body = body.replace(new RegExp(key, 'g'), value);
      if (subject) {
        subject = subject.replace(new RegExp(key, 'g'), value);
      }
    });

    setPreview({ subject, body });
  }, [leadName, funnel, ctaText]);

  const handleGenerate = useCallback(async () => {
    setGenerating(true);
    setError(null);
    setTemplates([]);
    setSelectedTemplate(null);

    try {
      const request: FollowUpTemplateGenerationRequest = {
        channel,
        timing,
        toneOfVoice: tone,
        customToneDescription: customToneDescription || undefined,
        funnelId: funnel?.id,
        funnelName: funnel?.name,
        objective,
        includeCTA,
        ctaText: includeCTA ? ctaText : undefined,
        ctaUrl: includeCTA ? ctaUrl : undefined,
        length: 'medium',
      };

      const response: FollowUpTemplateGenerationResponse =
        await FunnelsAdquisicionService.generateFollowUpTemplates(request);
      setTemplates(response.templates);
      if (response.templates.length > 0) {
        const firstTemplate = response.templates[0];
        setSelectedTemplate(firstTemplate);
        generatePreview(firstTemplate, leadName);
      }
    } catch (err: any) {
      setError(err.message || 'Error al generar plantillas');
    } finally {
      setGenerating(false);
    }
  }, [channel, timing, tone, customToneDescription, funnel, objective, includeCTA, ctaText, ctaUrl, leadName, generatePreview]);

  const handleTemplateSelect = useCallback((template: PostRegistrationFollowUpTemplate) => {
    setSelectedTemplate(template);
    generatePreview(template, leadName);
  }, [generatePreview, leadName]);

  const handleApply = useCallback(async () => {
    if (!selectedTemplate) {
      setError('Selecciona una plantilla para aplicar');
      return;
    }

    if (!leadName) {
      setError('Ingresa el nombre del lead');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const request: FollowUpTemplateApplication = {
        templateId: selectedTemplate.id,
        leadName,
        leadEmail: leadEmail || undefined,
        leadPhone: leadPhone || undefined,
        funnelId: funnel?.id,
        funnelName: funnel?.name,
        sendImmediately: timing === 'immediate',
        scheduledFor: timing !== 'immediate' ? new Date(Date.now() + getTimingMs(timing)).toISOString() : undefined,
      };

      const response = await FunnelsAdquisicionService.applyFollowUpTemplate(request);
      if (onSuccess) {
        onSuccess(response);
      }
      onClose();
    } catch (err: any) {
      setError(err.message || 'Error al aplicar plantilla');
    } finally {
      setLoading(false);
    }
  }, [selectedTemplate, leadName, leadEmail, leadPhone, funnel, timing, onSuccess, onClose]);

  const getTimingMs = (timing: FollowUpTiming): number => {
    switch (timing) {
      case '1h':
        return 60 * 60 * 1000;
      case '6h':
        return 6 * 60 * 60 * 1000;
      case '24h':
        return 24 * 60 * 60 * 1000;
      case '48h':
        return 48 * 60 * 60 * 1000;
      case '3d':
        return 3 * 24 * 60 * 60 * 1000;
      case '7d':
        return 7 * 24 * 60 * 60 * 1000;
      default:
        return 0;
    }
  };

  const handleCopyPreview = useCallback(() => {
    if (preview) {
      const text = preview.subject ? `${preview.subject}\n\n${preview.body}` : preview.body;
      navigator.clipboard.writeText(text);
    }
  }, [preview]);

  if (!isOpen) return null;

  const ChannelIcon = channelOptions.find((opt) => opt.value === channel)?.icon || MessageSquare;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <Card className="relative w-full max-w-4xl max-h-[90vh] overflow-hidden bg-white dark:bg-slate-900 shadow-xl">
        <div className="flex items-center justify-between border-b border-gray-200 dark:border-slate-800 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
              <Sparkles className="w-5 h-5 text-indigo-600 dark:text-indigo-300" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-slate-100">
                Plantillas IA para Follow-up Post Registro
              </h2>
              <p className="text-sm text-gray-600 dark:text-slate-400">
                Genera plantillas personalizadas con tu tono
              </p>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        <div className="overflow-y-auto max-h-[calc(90vh-140px)] px-6 py-4 space-y-6">
          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20 p-4 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-red-800 dark:text-red-200">{error}</p>
              </div>
            </div>
          )}

          {/* Configuración */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-slate-100">Configuración</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">
                  Canal
                </label>
                <div className="flex gap-2">
                  {channelOptions.map((opt) => {
                    const Icon = opt.icon;
                    return (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => setChannel(opt.value)}
                        className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg border transition-all ${
                          channel === opt.value
                            ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300'
                            : 'border-gray-200 dark:border-slate-800 text-gray-700 dark:text-slate-300 hover:border-gray-300'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        {opt.label}
                      </button>
                    );
                  })}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">
                  Timing
                </label>
                <Select value={timing} onChange={(e) => setTiming(e.target.value as FollowUpTiming)}>
                  {timingOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">
                  Tono de Voz
                </label>
                <Select value={tone} onChange={(e) => setTone(e.target.value as ToneOfVoice)}>
                  {toneOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">
                  Objetivo
                </label>
                <Input
                  value={objective}
                  onChange={(e) => setObjective(e.target.value)}
                  placeholder="Ej: cerrar venta, agendar consulta"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">
                Descripción Personalizada del Tono (Opcional)
              </label>
              <Textarea
                value={customToneDescription}
                onChange={(e) => setCustomToneDescription(e.target.value)}
                placeholder="Describe cómo quieres que suene el mensaje..."
                rows={2}
              />
            </div>
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={includeCTA}
                  onChange={(e) => setIncludeCTA(e.target.checked)}
                  className="rounded"
                />
                <span className="text-sm text-gray-700 dark:text-slate-300">Incluir CTA</span>
              </label>
              {includeCTA && (
                <>
                  <Input
                    value={ctaText}
                    onChange={(e) => setCtaText(e.target.value)}
                    placeholder="Texto del CTA"
                    className="flex-1"
                  />
                  <Input
                    value={ctaUrl}
                    onChange={(e) => setCtaUrl(e.target.value)}
                    placeholder="URL del CTA"
                    className="flex-1"
                  />
                </>
              )}
            </div>
            <Button
              variant="primary"
              onClick={handleGenerate}
              disabled={generating}
              className="w-full inline-flex items-center justify-center gap-2"
            >
              {generating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Generando...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Generar Plantillas IA
                </>
              )}
            </Button>
          </div>

          {/* Plantillas generadas */}
          {templates.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-slate-100">
                Plantillas Generadas ({templates.length})
              </h3>
              <div className="space-y-3">
                {templates.map((template) => (
                  <div
                    key={template.id}
                    className={`rounded-lg border p-4 cursor-pointer transition-all ${
                      selectedTemplate?.id === template.id
                        ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20'
                        : 'border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-gray-300'
                    }`}
                    onClick={() => handleTemplateSelect(template)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <ChannelIcon className="w-4 h-4 text-gray-600 dark:text-slate-400" />
                          <Badge variant="blue" size="sm">
                            {toneOptions.find((t) => t.value === template.toneOfVoice)?.label}
                          </Badge>
                          <Badge variant="green" size="sm">
                            {timingOptions.find((t) => t.value === template.timing)?.label}
                          </Badge>
                        </div>
                        {template.subject && (
                          <p className="text-sm font-medium text-gray-900 dark:text-slate-100 mb-1">
                            {template.subject}
                          </p>
                        )}
                        <p className="text-sm text-gray-700 dark:text-slate-300 line-clamp-2">
                          {template.message.substring(0, 150)}...
                        </p>
                      </div>
                      {selectedTemplate?.id === template.id && (
                        <Check className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Vista previa */}
          {preview && selectedTemplate && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-slate-100">Vista Previa</h3>
                <Button variant="ghost" size="sm" onClick={handleCopyPreview}>
                  <Copy className="w-4 h-4 mr-2" />
                  Copiar
                </Button>
              </div>
              <div className="rounded-lg border border-gray-200 dark:border-slate-800 bg-gray-50 dark:bg-slate-900/50 p-4">
                {preview.subject && (
                  <div className="mb-3 pb-3 border-b border-gray-200 dark:border-slate-800">
                    <p className="text-xs font-medium text-gray-600 dark:text-slate-400 mb-1">Asunto:</p>
                    <p className="text-sm text-gray-900 dark:text-slate-100">{preview.subject}</p>
                  </div>
                )}
                <div className="whitespace-pre-wrap text-sm text-gray-900 dark:text-slate-100">
                  {preview.body}
                </div>
              </div>
            </div>
          )}

          {/* Información del lead */}
          {selectedTemplate && (
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-slate-100">Información del Lead</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">
                    Nombre *
                  </label>
                  <Input
                    value={leadName}
                    onChange={(e) => {
                      const newName = e.target.value;
                      setLeadName(newName);
                      if (selectedTemplate) generatePreview(selectedTemplate, newName);
                    }}
                    placeholder="Nombre del lead"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">
                    {channel === 'email' ? 'Email' : 'Teléfono'}
                  </label>
                  <Input
                    type={channel === 'email' ? 'email' : 'tel'}
                    value={channel === 'email' ? leadEmail : leadPhone}
                    onChange={(e) => {
                      if (channel === 'email') {
                        setLeadEmail(e.target.value);
                      } else {
                        setLeadPhone(e.target.value);
                      }
                    }}
                    placeholder={channel === 'email' ? 'email@ejemplo.com' : '+34 600 000 000'}
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center justify-end gap-3 border-t border-gray-200 dark:border-slate-800 px-6 py-4">
          <Button variant="ghost" onClick={onClose} disabled={loading}>
            Cancelar
          </Button>
          {selectedTemplate && (
            <Button
              variant="primary"
              onClick={handleApply}
              disabled={loading || !leadName}
              className="inline-flex items-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  {timing === 'immediate' ? 'Enviando...' : 'Programando...'}
                </>
              ) : (
                <>
                  {timing === 'immediate' ? (
                    <>
                      <Send className="w-4 h-4" />
                      Enviar Ahora
                    </>
                  ) : (
                    <>
                      <Clock className="w-4 h-4" />
                      Programar Envío
                    </>
                  )}
                </>
              )}
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
}

