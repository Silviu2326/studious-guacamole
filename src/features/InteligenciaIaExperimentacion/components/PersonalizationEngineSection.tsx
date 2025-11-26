import React, { useState } from 'react';
import { Card, Tabs, Badge, Button } from '../../../components/componentsreutilizables';
import { Sparkles, Target, Users, LayoutTemplate, Loader2, CheckCircle2, Mail, MessageSquare, Smartphone } from 'lucide-react';
import { generatePersonalizedJourneyService } from '../services/intelligenceService';
import { useAuth } from '../../../context/AuthContext';
import { LeadAttributes, FitnessGoal, Motivator, PersonalizedJourney } from '../types';

const personalizationTabs = [
  { id: 'segments', label: 'Segmentos dinámicos', icon: <Users size={16} /> },
  { id: 'journeys', label: 'Journeys personalizados', icon: <Target size={16} /> },
  { id: 'templates', label: 'Templates generativos', icon: <LayoutTemplate size={16} /> },
];

export const PersonalizationEngineSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('segments');

  return (
    <Card className="p-0 bg-white shadow-sm border border-slate-200/70">
      <div className="p-6 border-b border-slate-200/60">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg bg-indigo-100 text-indigo-600">
            <Sparkles size={20} />
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-semibold text-slate-900">Personalization Engine (IA avanzada)</h2>
            <p className="text-sm text-slate-600">
              Configura experiencias 1:1 combinando señales de comportamiento, predicciones y contenido generado por IA.
            </p>
          </div>
        </div>
        <div className="mt-6">
          <Tabs
            items={personalizationTabs.map((tab) => ({ id: tab.id, label: tab.label, icon: tab.icon }))}
            activeTab={activeTab}
            onTabChange={(tabId) => setActiveTab(tabId)}
            variant="pills"
          />
        </div>
      </div>

      <div className="p-6">
        {activeTab === 'segments' && (
          <div className="space-y-4">
            <p className="text-sm text-slate-600">
              Combina scores de propensión, afinidad de contenidos y etapa del funnel para generar segmentos actualizados en tiempo real.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {([
                {
                  title: 'Champions',
                  desc: 'Clientes con engagement alto y alta propensión a upgrades',
                  variant: 'green' as const,
                },
                {
                  title: 'Riesgo silencioso',
                  desc: 'Usuarios activos pero con señales tempranas de abandono',
                  variant: 'yellow' as const,
                },
                {
                  title: 'Exploradores IA',
                  desc: 'Segmento con alta interacción con contenido AI-first',
                  variant: 'blue' as const,
                },
              ]).map((segment) => (
                <div key={segment.title} className="rounded-2xl border border-slate-200 p-4 bg-slate-50/60">
                  <Badge variant={segment.variant} size="sm" className="mb-2">
                    {segment.title}
                  </Badge>
                  <p className="text-sm text-slate-600">{segment.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'journeys' && (
          <JourneyBuilderSection />
        )}

        {activeTab === 'templates' && (
          <div className="space-y-4">
            <p className="text-sm text-slate-600">
              Crea prompts y plantillas generativas aprobadas por tu marca para escalar contenido personalizado a cualquier canal.
            </p>
            <div className="rounded-2xl border border-dashed border-indigo-200 p-6 bg-indigo-50/50">
              <p className="font-semibold text-indigo-900">Generador de Estrategias de Marketing con IA</p>
              <p className="text-sm text-indigo-800 mt-2">
                Conecta con el módulo dedicado para generar propuestas completas: objetivos, audiencias, mensajes clave y playbooks recomendados.
              </p>
              <Button className="mt-4" variant="secondary" leftIcon={<Sparkles size={16} />}>
                Abrir generador IA
              </Button>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

// User Story 1: Componente para construir journeys personalizados
const JourneyBuilderSection: React.FC = () => {
  const { user } = useAuth();
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedJourney, setGeneratedJourney] = useState<PersonalizedJourney | null>(null);
  const [leadAttributes, setLeadAttributes] = useState<LeadAttributes>({
    fitnessGoal: 'salud-general',
    motivators: [],
    experienceLevel: 'principiante',
    availableTime: 3,
  });

  const fitnessGoals: { value: FitnessGoal; label: string }[] = [
    { value: 'perdida-peso', label: 'Pérdida de Peso' },
    { value: 'ganancia-masa-muscular', label: 'Ganancia de Masa Muscular' },
    { value: 'mejora-resistencia', label: 'Mejora de Resistencia' },
    { value: 'tonificacion', label: 'Tonificación' },
    { value: 'salud-general', label: 'Salud General' },
    { value: 'preparacion-deportiva', label: 'Preparación Deportiva' },
    { value: 'rehabilitacion', label: 'Rehabilitación' },
    { value: 'flexibilidad-movilidad', label: 'Flexibilidad y Movilidad' },
  ];

  const motivators: { value: Motivator; label: string }[] = [
    { value: 'salud-prevencion', label: 'Salud y Prevención' },
    { value: 'apariencia-estetica', label: 'Apariencia Estética' },
    { value: 'rendimiento-deportivo', label: 'Rendimiento Deportivo' },
    { value: 'bienestar-mental', label: 'Bienestar Mental' },
    { value: 'presion-social', label: 'Presión Social' },
    { value: 'competencia-personal', label: 'Competencia Personal' },
    { value: 'recomendacion-medica', label: 'Recomendación Médica' },
    { value: 'evento-especial', label: 'Evento Especial' },
  ];

  const handleMotivatorToggle = (motivator: Motivator) => {
    setLeadAttributes((prev) => ({
      ...prev,
      motivators: prev.motivators.includes(motivator)
        ? prev.motivators.filter((m) => m !== motivator)
        : [...prev.motivators, motivator],
    }));
  };

  const handleGenerateJourney = async () => {
    if (leadAttributes.motivators.length === 0) {
      alert('Por favor selecciona al menos un motivador');
      return;
    }

    setIsGenerating(true);
    try {
      const response = await generatePersonalizedJourneyService({
        leadAttributes,
        trainerId: user?.id,
      });

      if (response.success && response.journey) {
        setGeneratedJourney(response.journey);
      }
    } catch (error) {
      console.error('Error generando journey', error);
      alert('Error al generar el journey. Por favor intenta de nuevo.');
    } finally {
      setIsGenerating(false);
    }
  };

  const getChannelIcon = (channel: string) => {
    switch (channel) {
      case 'email':
        return <Mail size={14} />;
      case 'sms':
      case 'whatsapp':
        return <MessageSquare size={14} />;
      case 'in-app':
      case 'push':
        return <Smartphone size={14} />;
      default:
        return <Target size={14} />;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-slate-900 mb-2">
          Motor de Personalización IA - Constructor de Journeys
        </h3>
        <p className="text-sm text-slate-600">
          Construye journeys personalizados según atributos del lead (objetivo fitness, motivadores) para ofrecer experiencias únicas.
        </p>
      </div>

      {!generatedJourney ? (
        <div className="space-y-6">
          <Card className="p-6 bg-white border border-slate-200">
            <div className="space-y-6">
              {/* Objetivo Fitness */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Objetivo Fitness *
                </label>
                <select
                  value={leadAttributes.fitnessGoal}
                  onChange={(e) =>
                    setLeadAttributes((prev) => ({
                      ...prev,
                      fitnessGoal: e.target.value as FitnessGoal,
                    }))
                  }
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  {fitnessGoals.map((goal) => (
                    <option key={goal.value} value={goal.value}>
                      {goal.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Motivadores */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Motivadores * (selecciona al menos uno)
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {motivators.map((motivator) => (
                    <button
                      key={motivator.value}
                      type="button"
                      onClick={() => handleMotivatorToggle(motivator.value)}
                      className={`px-3 py-2 text-sm rounded-lg border transition-colors ${
                        leadAttributes.motivators.includes(motivator.value)
                          ? 'bg-indigo-100 border-indigo-500 text-indigo-700 font-medium'
                          : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      {motivator.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Nivel de Experiencia */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Nivel de Experiencia
                </label>
                <select
                  value={leadAttributes.experienceLevel || 'principiante'}
                  onChange={(e) =>
                    setLeadAttributes((prev) => ({
                      ...prev,
                      experienceLevel: e.target.value as 'principiante' | 'intermedio' | 'avanzado',
                    }))
                  }
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="principiante">Principiante</option>
                  <option value="intermedio">Intermedio</option>
                  <option value="avanzado">Avanzado</option>
                </select>
              </div>

              {/* Tiempo Disponible */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Horas disponibles por semana
                </label>
                <input
                  type="number"
                  min="1"
                  max="20"
                  value={leadAttributes.availableTime || 3}
                  onChange={(e) =>
                    setLeadAttributes((prev) => ({
                      ...prev,
                      availableTime: parseInt(e.target.value) || 3,
                    }))
                  }
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              <Button
                onClick={handleGenerateJourney}
                disabled={isGenerating || leadAttributes.motivators.length === 0}
                leftIcon={
                  isGenerating ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <Sparkles size={16} />
                  )
                }
                className="w-full"
              >
                {isGenerating ? 'Generando Journey...' : 'Generar Journey Personalizado'}
              </Button>
            </div>
          </Card>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-slate-900">{generatedJourney.name}</h3>
              <p className="text-sm text-slate-600 mt-1">{generatedJourney.description}</p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setGeneratedJourney(null)}
            >
              Crear nuevo
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="rounded-lg border border-slate-200 p-4 bg-slate-50">
              <p className="text-xs text-slate-500 mb-1">Nivel de Personalización</p>
              <Badge
                variant={
                  generatedJourney.personalizationLevel === 'alto'
                    ? 'green'
                    : generatedJourney.personalizationLevel === 'medio'
                    ? 'blue'
                    : 'yellow'
                }
                size="sm"
              >
                {generatedJourney.personalizationLevel.toUpperCase()}
              </Badge>
            </div>
            <div className="rounded-lg border border-slate-200 p-4 bg-slate-50">
              <p className="text-xs text-slate-500 mb-1">Duración Estimada</p>
              <p className="text-sm font-semibold text-slate-900">
                {generatedJourney.estimatedDuration} días
              </p>
            </div>
            <div className="rounded-lg border border-slate-200 p-4 bg-slate-50">
              <p className="text-xs text-slate-500 mb-1">Pasos del Journey</p>
              <p className="text-sm font-semibold text-slate-900">
                {generatedJourney.steps.length} pasos
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="font-semibold text-slate-900">Pasos del Journey</h4>
            {generatedJourney.steps.map((step) => (
              <Card key={step.id} className="p-4 border border-slate-200">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-semibold text-sm">
                    {step.stepNumber}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h5 className="font-semibold text-slate-900">{step.name}</h5>
                      <Badge variant="blue" size="sm" className="flex items-center gap-1">
                        {getChannelIcon(step.channel)}
                        {step.channel}
                      </Badge>
                    </div>
                    <p className="text-sm text-slate-600 mb-2">{step.description}</p>
                    <p className="text-xs text-slate-500 mb-2">
                      <strong>Trigger:</strong> {step.trigger}
                      {step.delay !== undefined && step.delay > 0 && ` (${step.delay} días después)`}
                    </p>
                    {step.content.subject && (
                      <div className="mt-2 p-2 bg-slate-50 rounded text-sm">
                        <p className="font-medium text-slate-700">Asunto: {step.content.subject}</p>
                      </div>
                    )}
                    <div className="mt-2 p-2 bg-slate-50 rounded text-sm">
                      <p className="text-slate-700 whitespace-pre-line">{step.content.message}</p>
                      {step.content.cta && (
                        <Button size="sm" variant="secondary" className="mt-2">
                          {step.content.cta}
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          <div className="flex gap-3 pt-4">
            <Button variant="secondary" onClick={() => setGeneratedJourney(null)}>
              Generar otro Journey
            </Button>
            <Button>
              <CheckCircle2 size={16} className="mr-2" />
              Activar Journey
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PersonalizationEngineSection;

