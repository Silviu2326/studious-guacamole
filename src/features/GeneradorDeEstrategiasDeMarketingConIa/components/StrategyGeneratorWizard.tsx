import React, { useState } from 'react';
import { StrategyInputData, StrategyType, BudgetRange, TimeHorizon, MarketingChannel } from '../api/strategies';
import { TitledInputSection } from './TitledInputSection';
import { ArrowLeft, ArrowRight, Loader2, CheckCircle } from 'lucide-react';
import { Button } from '../../../components/componentsreutilizables';

interface StrategyGeneratorWizardProps {
  onSubmit: (data: StrategyInputData) => void;
  isGenerating: boolean;
}

/**
 * Componente principal que gestiona el flujo de varios pasos para
 * recopilar la información del usuario necesaria para generar la estrategia.
 */
export const StrategyGeneratorWizard: React.FC<StrategyGeneratorWizardProps> = ({
  onSubmit,
  isGenerating
}) => {
  const [currentStep, setCurrentStep] = useState<number>(0);
  
  const [formData, setFormData] = useState<StrategyInputData>({
    type: 'content_plan_30_days',
    objectives: {
      primary: '',
      timeHorizon: 'short_term'
    },
    audience: {
      description: ''
    },
    budget: 'medium',
    channels: ['instagram'],
    tone: ''
  });

  const steps = [
    {
      id: 'type',
      title: 'Tipo de Estrategia',
      description: '¿Qué tipo de estrategia quieres generar?'
    },
    {
      id: 'objectives',
      title: 'Objetivos',
      description: 'Define qué quieres lograr con esta estrategia'
    },
    {
      id: 'audience',
      title: 'Audiencia',
      description: 'Describe a quién te diriges'
    },
    {
      id: 'settings',
      title: 'Configuración',
      description: 'Ajusta presupuesto, canales y tono'
    },
    {
      id: 'review',
      title: 'Revisar',
      description: 'Revisa tu solicitud antes de generar'
    }
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    if (!formData.objectives.primary || !formData.audience.description) {
      alert('Por favor, completa todos los campos requeridos');
      return;
    }
    onSubmit(formData);
  };

  const isStepValid = (step: number): boolean => {
    switch (step) {
      case 0:
        return !!formData.type;
      case 1:
        return !!formData.objectives.primary;
      case 2:
        return !!formData.audience.description;
      case 3:
        return formData.channels.length > 0 && !!formData.tone;
      default:
        return true;
    }
  };

  return (
    <div className="space-y-6">
      {/* Indicador de pasos */}
      <div className="flex items-center justify-between mb-6">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center flex-1">
            <div className="flex flex-col items-center flex-1">
              <button
                type="button"
                onClick={() => {
                  if (index <= currentStep) {
                    setCurrentStep(index);
                  }
                }}
                className={`w-10 h-10 rounded-full flex items-center justify-center font-medium transition ${
                  index < currentStep
                    ? 'bg-green-600 text-white'
                    : index === currentStep
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-600'
                }`}
              >
                {index < currentStep ? <CheckCircle className="w-5 h-5" /> : index + 1}
              </button>
              <span className="mt-2 text-xs font-medium text-gray-600 text-center max-w-[80px]">
                {step.title}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div className={`flex-1 h-1 mx-2 ${
                index < currentStep ? 'bg-green-600' : 'bg-gray-200'
              }`} />
            )}
          </div>
        ))}
      </div>

      {/* Contenido del paso actual */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        {currentStep === 0 && (
          <TitledInputSection
            title={steps[0].title}
            description={steps[0].description}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { value: 'content_plan_30_days', label: 'Plan de Contenido - 30 Días' },
                { value: 'content_plan_60_days', label: 'Plan de Contenido - 60 Días' },
                { value: 'content_plan_90_days', label: 'Plan de Contenido - 90 Días' },
                { value: 'launch_campaign', label: 'Campaña de Lanzamiento' },
                { value: 'seasonal_campaign', label: 'Campaña Estacional' },
                { value: 'retention_strategy', label: 'Estrategia de Retención' },
                { value: 'collaboration_ideas', label: 'Ideas de Colaboración' },
                { value: 'product_launch', label: 'Lanzamiento de Producto' }
              ].map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, type: option.value as StrategyType }))}
                  className={`p-4 rounded-xl border-2 text-left transition ${
                    formData.type === option.value
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <span className="font-medium text-gray-900">{option.label}</span>
                </button>
              ))}
            </div>
          </TitledInputSection>
        )}

        {currentStep === 1 && (
          <TitledInputSection
            title={steps[1].title}
            description={steps[1].description}
          >
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Objetivo Principal *
              </label>
              <textarea
                value={formData.objectives.primary}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  objectives: { ...prev.objectives, primary: e.target.value }
                }))}
                className="w-full px-4 py-3 rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                rows={3}
                placeholder="Ej: Aumentar el engagement en Instagram y conseguir 15 nuevas consultas en 30 días"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Horizonte Temporal
              </label>
              <select
                value={formData.objectives.timeHorizon}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  objectives: { ...prev.objectives, timeHorizon: e.target.value as TimeHorizon }
                }))}
                className="w-full px-4 py-2 rounded-xl bg-white text-slate-900 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                <option value="short_term">Corto Plazo (1-3 meses)</option>
                <option value="medium_term">Mediano Plazo (3-6 meses)</option>
                <option value="long_term">Largo Plazo (6+ meses)</option>
              </select>
            </div>
          </TitledInputSection>
        )}

        {currentStep === 2 && (
          <TitledInputSection
            title={steps[2].title}
            description={steps[2].description}
          >
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Descripción del Cliente Ideal *
              </label>
              <textarea
                value={formData.audience.description}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  audience: { ...prev.audience, description: e.target.value }
                }))}
                className="w-full px-4 py-3 rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                rows={4}
                placeholder="Ej: Hombres y mujeres entre 30-45 años que trabajan en oficinas, pasan más de 8 horas sentados y sufren de dolores de espalda. Valoran la eficiencia y necesitan rutinas cortas y efectivas."
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rango de Edad (opcional)
              </label>
              <input
                type="text"
                value={formData.audience.ageRange || ''}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  audience: { ...prev.audience, ageRange: e.target.value }
                }))}
                className="w-full px-4 py-2 rounded-xl bg-white text-slate-900 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="Ej: 30-45 años"
              />
            </div>
          </TitledInputSection>
        )}

        {currentStep === 3 && (
          <TitledInputSection
            title={steps[3].title}
            description={steps[3].description}
          >
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Canales de Marketing *
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {(['instagram', 'facebook', 'email', 'blog', 'youtube', 'tiktok'] as MarketingChannel[]).map((channel) => (
                  <button
                    key={channel}
                    type="button"
                    onClick={() => {
                      const newChannels = formData.channels.includes(channel)
                        ? formData.channels.filter(c => c !== channel)
                        : [...formData.channels, channel];
                      setFormData(prev => ({ ...prev, channels: newChannels }));
                    }}
                    className={`p-3 rounded-xl border-2 transition ${
                      formData.channels.includes(channel)
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <span className="text-sm font-medium text-gray-900 capitalize">{channel}</span>
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Presupuesto
              </label>
              <select
                value={formData.budget}
                onChange={(e) => setFormData(prev => ({ ...prev, budget: e.target.value as BudgetRange }))}
                className="w-full px-4 py-2 rounded-xl bg-white text-slate-900 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                <option value="low">Bajo (€0-100/mes)</option>
                <option value="medium">Medio (€100-500/mes)</option>
                <option value="high">Alto (€500-2000/mes)</option>
                <option value="very_high">Muy Alto (€2000+/mes)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tono de Comunicación *
              </label>
              <input
                type="text"
                value={formData.tone}
                onChange={(e) => setFormData(prev => ({ ...prev, tone: e.target.value }))}
                className="w-full px-4 py-2 rounded-xl bg-white text-slate-900 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="Ej: Educativo, profesional pero cercano"
                required
              />
            </div>
          </TitledInputSection>
        )}

        {currentStep === 4 && (
          <TitledInputSection
            title={steps[4].title}
            description={steps[4].description}
          >
            <div className="space-y-4 bg-gray-50 rounded-lg p-4">
              <div>
                <span className="text-sm font-medium text-gray-600">Tipo de Estrategia:</span>
                <p className="text-base text-gray-900 mt-1">
                  {steps.find(s => s.id === 'type')?.title}: {formData.type.replace(/_/g, ' ')}
                </p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-600">Objetivo:</span>
                <p className="text-base text-gray-900 mt-1">{formData.objectives.primary}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-600">Audiencia:</span>
                <p className="text-base text-gray-900 mt-1">{formData.audience.description}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-600">Canales:</span>
                <p className="text-base text-gray-900 mt-1">
                  {formData.channels.map(c => c.charAt(0).toUpperCase() + c.slice(1)).join(', ')}
                </p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-600">Presupuesto:</span>
                <p className="text-base text-gray-900 mt-1 capitalize">{formData.budget}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-600">Tono:</span>
                <p className="text-base text-gray-900 mt-1">{formData.tone}</p>
              </div>
            </div>
          </TitledInputSection>
        )}

        {/* Navegación */}
        <div className="flex items-center justify-between pt-6 border-t border-gray-200 mt-6">
          <Button
            type="button"
            onClick={handlePrevious}
            disabled={currentStep === 0}
            variant="ghost"
            size="md"
            leftIcon={<ArrowLeft size={20} />}
          >
            Anterior
          </Button>

          {currentStep < steps.length - 1 ? (
            <Button
              type="button"
              onClick={handleNext}
              disabled={!isStepValid(currentStep)}
              variant="primary"
              size="md"
              leftIcon={<ArrowRight size={20} />}
            >
              Siguiente
            </Button>
          ) : (
            <Button
              type="button"
              onClick={handleSubmit}
              disabled={isGenerating || !isStepValid(currentStep)}
              variant="primary"
              size="md"
              loading={isGenerating}
              leftIcon={<ArrowRight size={20} />}
            >
              {isGenerating ? 'Generando...' : 'Generar Estrategia'}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};


