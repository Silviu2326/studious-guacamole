import { useState, useEffect } from 'react';
import { Calendar, Sparkles, Plus, CheckCircle2, Clock } from 'lucide-react';
import { Button, Card, Select, Input, Textarea, Badge, Modal } from '../../../components/componentsreutilizables';
import type {
  PromotionalContentTemplate,
  ServicePlan,
  PromotionalOffer,
  GeneratedPromotionalContent,
  SocialPlatform,
} from '../types';
import {
  getPromotionalTemplates,
  getServicePlans,
  getActiveOffers,
  generatePromotionalContent,
  schedulePromotionalContent,
} from '../api/promotionalContent';

interface PromotionalContentTemplatesProps {
  loading?: boolean;
}

export function PromotionalContentTemplates({ loading: externalLoading }: PromotionalContentTemplatesProps) {
  const [loading, setLoading] = useState(false);
  const [templates, setTemplates] = useState<PromotionalContentTemplate[]>([]);
  const [plans, setPlans] = useState<ServicePlan[]>([]);
  const [offers, setOffers] = useState<PromotionalOffer[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<PromotionalContentTemplate | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<GeneratedPromotionalContent | null>(null);
  const [templateVariables, setTemplateVariables] = useState<Record<string, string | number>>({});
  const [selectedPlatform, setSelectedPlatform] = useState<SocialPlatform>('instagram');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [templatesData, plansData, offersData] = await Promise.all([
        getPromotionalTemplates(),
        getServicePlans(),
        getActiveOffers(),
      ]);
      setTemplates(templatesData);
      setPlans(plansData);
      setOffers(offersData);
    } catch (error) {
      console.error('Error loading promotional content data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectTemplate = (template: PromotionalContentTemplate) => {
    setSelectedTemplate(template);
    setTemplateVariables({});
    setGeneratedContent(null);
    setShowModal(true);

    // Pre-fill variables with defaults
    const defaults: Record<string, string | number> = {};
    template.variables.forEach((variable) => {
      if (variable.defaultValue) {
        defaults[variable.key] = variable.defaultValue;
      }
    });
    setTemplateVariables(defaults);
  };

  const handleGenerate = async () => {
    if (!selectedTemplate) return;

    // Validate required variables
    const requiredVars = selectedTemplate.variables.filter((v) => !v.defaultValue);
    const missing = requiredVars.filter((v) => !templateVariables[v.key]);
    if (missing.length > 0) {
      alert(`Por favor, completa los campos requeridos: ${missing.map((v) => v.label).join(', ')}`);
      return;
    }

    setGenerating(true);
    try {
      const content = await generatePromotionalContent(
        selectedTemplate.id,
        templateVariables,
        selectedPlatform
      );
      setGeneratedContent(content);
    } catch (error) {
      console.error('Error generating content:', error);
      alert('Error al generar el contenido. Intenta nuevamente.');
    } finally {
      setGenerating(false);
    }
  };

  const handleSchedule = async () => {
    if (!generatedContent) return;

    // In a real implementation, this would open a date picker
    const scheduledAt = prompt('Ingresa la fecha y hora (formato: YYYY-MM-DD HH:MM):');
    if (!scheduledAt) return;

    try {
      await schedulePromotionalContent(generatedContent.id, scheduledAt);
      alert('Contenido programado exitosamente en el calendario');
      setShowModal(false);
      setGeneratedContent(null);
    } catch (error) {
      console.error('Error scheduling content:', error);
      alert('Error al programar el contenido. Intenta nuevamente.');
    }
  };

  const getVariableInput = (variable: PromotionalContentTemplate['variables'][0]) => {
    if (variable.type === 'plan') {
      return (
        <Select
          key={variable.key}
          label={variable.label}
          options={plans.map((plan) => ({ value: plan.id, label: `${plan.name} - ${plan.price}€` }))}
          value={String(templateVariables[variable.key] || '')}
          onChange={(e) =>
            setTemplateVariables({ ...templateVariables, [variable.key]: e.target.value })
          }
          placeholder="Selecciona un plan"
        />
      );
    }

    if (variable.type === 'offer') {
      return (
        <Select
          key={variable.key}
          label={variable.label}
          options={offers.map((offer) => ({ value: offer.id, label: offer.title }))}
          value={String(templateVariables[variable.key] || '')}
          onChange={(e) =>
            setTemplateVariables({ ...templateVariables, [variable.key]: e.target.value })
          }
          placeholder="Selecciona una oferta"
        />
      );
    }

    if (variable.type === 'number') {
      return (
        <Input
          key={variable.key}
          label={variable.label}
          type="number"
          value={String(templateVariables[variable.key] || '')}
          onChange={(e) =>
            setTemplateVariables({
              ...templateVariables,
              [variable.key]: parseFloat(e.target.value) || 0,
            })
          }
          placeholder={variable.defaultValue}
        />
      );
    }

    if (variable.type === 'date') {
      return (
        <Input
          key={variable.key}
          label={variable.label}
          type="date"
          value={String(templateVariables[variable.key] || '')}
          onChange={(e) =>
            setTemplateVariables({ ...templateVariables, [variable.key]: e.target.value })
          }
        />
      );
    }

    return (
      <Textarea
        key={variable.key}
        label={variable.label}
        value={String(templateVariables[variable.key] || '')}
        onChange={(e) =>
          setTemplateVariables({ ...templateVariables, [variable.key]: e.target.value })
        }
        placeholder={variable.defaultValue}
        rows={variable.key.includes('caracteristicas') || variable.key.includes('incluye') ? 4 : 2}
      />
    );
  };

  if (externalLoading || loading) {
    return (
      <Card className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 w-1/3 bg-slate-200 rounded" />
          <div className="h-24 bg-slate-100 rounded-2xl" />
          <div className="h-24 bg-slate-100 rounded-2xl" />
        </div>
      </Card>
    );
  }

  return (
    <>
      <Card className="p-0 shadow-sm border border-slate-100">
        <div className="px-6 py-5 border-b border-slate-100">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-slate-900 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-indigo-500" />
                Plantillas de Contenido Promocional
              </h2>
              <p className="text-sm text-slate-500 mt-1">
                Crea contenido promocional educativo que se integre con tus servicios, planes y ofertas
              </p>
            </div>
          </div>
        </div>

        <div className="p-6">
          {templates.length === 0 ? (
            <p className="text-sm text-slate-500">No hay plantillas disponibles.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {templates.map((template) => (
                <div
                  key={template.id}
                  className="border border-slate-200 rounded-lg p-4 hover:border-indigo-300 transition-colors cursor-pointer"
                  onClick={() => handleSelectTemplate(template)}
                >
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-slate-900">{template.name}</h3>
                    <Badge variant="blue" size="sm">
                      {template.format}
                    </Badge>
                  </div>
                  <p className="text-sm text-slate-600 mb-3">{template.description}</p>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {template.platforms.map((platform) => (
                      <Badge key={platform} variant="purple" size="sm">
                        {platform}
                      </Badge>
                    ))}
                  </div>
                  {template.educational && (
                    <Badge variant="green" size="sm" className="mb-2">
                      Educativo
                    </Badge>
                  )}
                  <Button variant="ghost" size="sm" className="w-full mt-2">
                    <Plus className="w-4 h-4 mr-2" />
                    Usar plantilla
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </Card>

      {/* Modal para generar contenido */}
      {selectedTemplate && (
        <Modal
          isOpen={showModal}
          onClose={() => {
            setShowModal(false);
            setGeneratedContent(null);
            setTemplateVariables({});
          }}
          title={`Crear contenido: ${selectedTemplate.name}`}
          size="lg"
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Plataforma
              </label>
              <Select
                options={selectedTemplate.platforms.map((p) => ({ value: p, label: p.toUpperCase() }))}
                value={selectedPlatform}
                onChange={(e) => setSelectedPlatform(e.target.value as SocialPlatform)}
              />
            </div>

            <div className="space-y-4 max-h-96 overflow-y-auto">
              {selectedTemplate.variables.map((variable) => getVariableInput(variable))}
            </div>

            {generatedContent ? (
              <div className="mt-6 p-4 bg-slate-50 rounded-lg border border-slate-200">
                <h4 className="font-semibold text-slate-900 mb-2">Contenido Generado:</h4>
                <div className="text-sm text-slate-700 whitespace-pre-wrap mb-4">
                  {generatedContent.content.caption}
                </div>
                <div className="flex flex-wrap gap-2 mb-4">
                  {generatedContent.content.hashtags.map((tag) => (
                    <Badge key={tag} variant="purple" size="sm">
                      #{tag}
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Button variant="primary" size="sm" onClick={handleSchedule} leftIcon={<Calendar className="w-4 h-4" />}>
                    Programar en calendario
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => {
                      navigator.clipboard.writeText(generatedContent.content.caption);
                      alert('Contenido copiado al portapapeles');
                    }}
                  >
                    Copiar contenido
                  </Button>
                </div>
              </div>
            ) : (
              <Button
                variant="primary"
                size="md"
                onClick={handleGenerate}
                disabled={generating}
                leftIcon={generating ? <Clock className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                className="w-full"
              >
                {generating ? 'Generando contenido...' : 'Generar contenido con IA'}
              </Button>
            )}
          </div>
        </Modal>
      )}
    </>
  );
}

