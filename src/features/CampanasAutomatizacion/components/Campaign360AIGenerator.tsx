import React, { useState } from 'react';
import { Badge, Button, Card, Modal } from '../../../components/componentsreutilizables';
import { Sparkles, Mail, MessageCircle, Send, CheckCircle2, ArrowRight, ArrowLeft, Loader2 } from 'lucide-react';
import type {
  Campaign360Step,
  Campaign360Objective,
  Campaign360Content,
  Campaign360Review,
  Campaign360GenerationRequest,
  CampaignObjective,
} from '../types';

interface Campaign360AIGeneratorProps {
  isOpen: boolean;
  onClose: () => void;
  onCampaignGenerated?: (campaign: Campaign360Review) => void;
  className?: string;
}

const objectiveLabels: Record<CampaignObjective, { label: string; description: string }> = {
  captar: {
    label: 'Captar',
    description: 'Atraer nuevos clientes y leads',
  },
  reactivar: {
    label: 'Reactivar',
    description: 'Recuperar clientes inactivos',
  },
  fidelizar: {
    label: 'Fidelizar',
    description: 'Mantener y fortalecer relación con clientes activos',
  },
};

const steps: { id: Campaign360Step; title: string; description: string }[] = [
  {
    id: 'objective',
    title: 'Objetivo',
    description: 'Define el objetivo y audiencia de tu campaña',
  },
  {
    id: 'content',
    title: 'Contenido generado',
    description: 'Revisa y personaliza el contenido generado por IA',
  },
  {
    id: 'review',
    title: 'Revisar y activar',
    description: 'Revisa todos los detalles antes de activar',
  },
];

export const Campaign360AIGenerator: React.FC<Campaign360AIGeneratorProps> = ({
  isOpen,
  onClose,
  onCampaignGenerated,
  className = '',
}) => {
  const [currentStep, setCurrentStep] = useState<Campaign360Step>('objective');
  const [isGenerating, setIsGenerating] = useState(false);
  const [objective, setObjective] = useState<Campaign360Objective>({
    name: '',
    description: '',
    objective: 'captar',
    targetAudience: '',
    channels: ['email', 'whatsapp'],
    timeline: 7,
  });
  const [content, setContent] = useState<Campaign360Content | null>(null);
  const [campaign, setCampaign] = useState<Campaign360Review | null>(null);

  const handleNext = () => {
    if (currentStep === 'objective') {
      handleGenerateContent();
    } else if (currentStep === 'content') {
      handleGenerateReview();
    }
  };

  const handleBack = () => {
    if (currentStep === 'objective') {
      onClose();
    } else if (currentStep === 'content') {
      setCurrentStep('objective');
    } else if (currentStep === 'review') {
      setCurrentStep('content');
    }
  };

  const handleGenerateContent = async () => {
    if (!objective.name || !objective.description || !objective.targetAudience) {
      alert('Por favor completa todos los campos requeridos');
      return;
    }

    setIsGenerating(true);
    try {
      // Simulación de generación de contenido con IA
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const generatedContent: Campaign360Content = generateMockContent(objective);
      setContent(generatedContent);
      setCurrentStep('content');
    } catch (error) {
      console.error('Error generando contenido:', error);
      alert('Error al generar contenido. Por favor intenta de nuevo.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGenerateReview = () => {
    if (!content) return;

    const review: Campaign360Review = {
      objective,
      content,
      estimatedReach: 500,
      estimatedCost: 150,
      status: 'draft',
    };
    setCampaign(review);
    setCurrentStep('review');
  };

  const handleActivate = () => {
    if (!campaign) return;
    onCampaignGenerated?.(campaign);
    handleClose();
  };

  const handleClose = () => {
    setCurrentStep('objective');
    setObjective({
      name: '',
      description: '',
      objective: 'captar',
      targetAudience: '',
      channels: ['email', 'whatsapp'],
      timeline: 7,
    });
    setContent(null);
    setCampaign(null);
    onClose();
  };

  const generateMockContent = (obj: Campaign360Objective): Campaign360Content => {
    const baseMessages = {
      captar: {
        email: {
          subject: '¡Transforma tu vida con entrenamiento personalizado!',
          body: `Hola {nombre},\n\n¿Listo para alcanzar tus objetivos de fitness? Te ofrecemos un entrenamiento personalizado diseñado específicamente para ti.\n\n🎯 Beneficios:\n- Plan personalizado\n- Seguimiento constante\n- Resultados garantizados\n\n¡Agenda tu sesión gratuita hoy!`,
        },
        whatsapp: {
          message: `¡Hola {nombre}! 👋\n\n¿Sabías que el entrenamiento personalizado puede acelerar tus resultados hasta 3x? 🚀\n\nTe invitamos a una sesión gratuita para conocer tus objetivos y crear un plan perfecto para ti.\n\n¿Te interesa? Responde "SÍ" y te contactamos.`,
        },
        dm: {
          message: `¡Hola {nombre}! 👋\n\n¿Listo para transformar tu cuerpo? 💪\n\nOfrecemos entrenamiento personalizado con resultados garantizados. ¡Agenda tu sesión gratuita!`,
        },
      },
      reactivar: {
        email: {
          subject: 'Te extrañamos - ¡Vuelve a entrenar con nosotros!',
          body: `Hola {nombre},\n\nNotamos que hace tiempo que no nos visitas. ¡Te extrañamos!\n\n🎁 Oferta especial: 20% de descuento en tu próximo mes\n\nVuelve a alcanzar tus objetivos con nosotros. Tu salud es importante.\n\n¡Reserva tu sesión ahora!`,
        },
        whatsapp: {
          message: `¡Hola {nombre}! 👋\n\nHace tiempo que no te vemos por aquí. ¿Todo bien?\n\nTenemos una oferta especial para ti: 20% OFF en tu próximo mes 🎁\n\n¿Te gustaría volver a entrenar? Responde y te ayudamos.`,
        },
        dm: {
          message: `¡Hola {nombre}! 👋\n\nTe extrañamos 💙\n\nOferta especial: 20% OFF para que vuelvas a entrenar con nosotros. ¡Reserva ahora!`,
        },
      },
      fidelizar: {
        email: {
          subject: 'Gracias por ser parte de nuestra comunidad',
          body: `Hola {nombre},\n\nQueremos agradecerte por ser parte de nuestra comunidad de fitness.\n\n🌟 Como cliente fiel, tienes acceso a:\n- Sesiones exclusivas\n- Descuentos especiales\n- Contenido premium\n\n¡Sigue alcanzando tus objetivos con nosotros!`,
        },
        whatsapp: {
          message: `¡Hola {nombre}! 👋\n\nGracias por ser parte de nuestra comunidad 💪\n\nComo cliente fiel, tienes acceso a beneficios exclusivos. ¿Quieres conocer más?`,
        },
        dm: {
          message: `¡Hola {nombre}! 👋\n\nGracias por ser parte de nuestra comunidad 🌟\n\nBeneficios exclusivos para ti. ¡Sigue entrenando!`,
        },
      },
    };

    const messages = baseMessages[obj.objective];

    return {
      email: messages.email,
      whatsapp: messages.whatsapp,
      dm: messages.dm,
      tone: 'friendly',
      personalizationVariables: ['nombre', 'fecha', 'objetivo'],
    };
  };

  const canAdvance = () => {
    if (currentStep === 'objective') {
      return objective.name && objective.description && objective.targetAudience && !isGenerating;
    }
    if (currentStep === 'content') {
      return content !== null;
    }
    if (currentStep === 'review') {
      return campaign !== null;
    }
    return false;
  };

  const currentStepIndex = steps.findIndex((s) => s.id === currentStep);

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Generar Campaña 360 con IA" size="xl">
      <div className="space-y-6">
        {/* Progress indicator */}
        <div className="flex items-center justify-between mb-6">
          {steps.map((step, index) => (
            <React.Fragment key={step.id}>
              <div className="flex flex-col items-center flex-1">
                <div
                  className={[
                    'w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all',
                    index < currentStepIndex
                      ? 'bg-green-500 text-white'
                      : index === currentStepIndex
                      ? 'bg-indigo-500 text-white'
                      : 'bg-slate-200 text-slate-500 dark:bg-slate-700 dark:text-slate-400',
                  ].join(' ')}
                >
                  {index < currentStepIndex ? (
                    <CheckCircle2 className="w-5 h-5" />
                  ) : (
                    index + 1
                  )}
                </div>
                <div className="mt-2 text-center">
                  <p
                    className={[
                      'text-xs font-medium',
                      index === currentStepIndex
                        ? 'text-indigo-600 dark:text-indigo-400'
                        : 'text-slate-500 dark:text-slate-400',
                    ].join(' ')}
                  >
                    {step.title}
                  </p>
                </div>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={[
                    'h-0.5 flex-1 mx-2 transition-all',
                    index < currentStepIndex ? 'bg-green-500' : 'bg-slate-200 dark:bg-slate-700',
                  ].join(' ')}
                />
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Step content */}
        <div className="min-h-[400px]">
          {currentStep === 'objective' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">
                  {steps[0].title}
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">{steps[0].description}</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Nombre de la campaña *
                  </label>
                  <input
                    type="text"
                    value={objective.name}
                    onChange={(e) => setObjective((prev) => ({ ...prev, name: e.target.value }))}
                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                    placeholder="Ej. Campaña Verano 2024"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Descripción *
                  </label>
                  <textarea
                    rows={3}
                    value={objective.description}
                    onChange={(e) => setObjective((prev) => ({ ...prev, description: e.target.value }))}
                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                    placeholder="Describe el propósito y contexto de la campaña..."
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
                    Objetivo *
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {(Object.keys(objectiveLabels) as CampaignObjective[]).map((obj) => {
                      const objData = objectiveLabels[obj];
                      const isSelected = objective.objective === obj;
                      return (
                        <button
                          key={obj}
                          type="button"
                          onClick={() => setObjective((prev) => ({ ...prev, objective: obj }))}
                          className={[
                            'p-3 rounded-lg border-2 text-left transition-all',
                            isSelected
                              ? 'border-indigo-500 bg-indigo-50 dark:border-indigo-400 dark:bg-indigo-900/20'
                              : 'border-slate-200 hover:border-indigo-300 dark:border-slate-700',
                          ].join(' ')}
                        >
                          <div className="font-semibold text-sm text-slate-900 dark:text-slate-100 mb-1">
                            {objData.label}
                          </div>
                          <div className="text-xs text-slate-600 dark:text-slate-400">
                            {objData.description}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Audiencia objetivo *
                  </label>
                  <input
                    type="text"
                    value={objective.targetAudience}
                    onChange={(e) => setObjective((prev) => ({ ...prev, targetAudience: e.target.value }))}
                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                    placeholder="Ej. Leads calientes, Clientes inactivos, Clientes premium"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Canales (seleccionados automáticamente para campaña 360)
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {objective.channels.map((channel) => (
                      <Badge key={channel} variant="blue">
                        {channel === 'email' && <Mail className="w-3 h-3 mr-1" />}
                        {channel === 'whatsapp' && <MessageCircle className="w-3 h-3 mr-1" />}
                        {channel === 'dm' && <Send className="w-3 h-3 mr-1" />}
                        {channel.toUpperCase()}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Timeline (días)
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={objective.timeline}
                    onChange={(e) =>
                      setObjective((prev) => ({ ...prev, timeline: Number(e.target.value) }))
                    }
                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                  />
                </div>
              </div>
            </div>
          )}

          {currentStep === 'content' && content && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">
                  {steps[1].title}
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">{steps[1].description}</p>
              </div>

              <div className="space-y-4">
                <div className="p-4 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900/50">
                  <div className="flex items-center gap-2 mb-3">
                    <Mail className="w-5 h-5 text-indigo-600" />
                    <h4 className="font-semibold text-slate-900 dark:text-slate-100">Email</h4>
                  </div>
                  <div className="space-y-2">
                    <div>
                      <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                        Asunto
                      </label>
                      <input
                        type="text"
                        value={content.email.subject}
                        onChange={(e) =>
                          setContent((prev) =>
                            prev ? { ...prev, email: { ...prev.email, subject: e.target.value } } : null
                          )
                        }
                        className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                        Cuerpo del mensaje
                      </label>
                      <textarea
                        rows={6}
                        value={content.email.body}
                        onChange={(e) =>
                          setContent((prev) =>
                            prev ? { ...prev, email: { ...prev.email, body: e.target.value } } : null
                          )
                        }
                        className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                      />
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900/50">
                  <div className="flex items-center gap-2 mb-3">
                    <MessageCircle className="w-5 h-5 text-green-600" />
                    <h4 className="font-semibold text-slate-900 dark:text-slate-100">WhatsApp</h4>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                      Mensaje
                    </label>
                    <textarea
                      rows={6}
                      value={content.whatsapp.message}
                      onChange={(e) =>
                        setContent((prev) =>
                          prev ? { ...prev, whatsapp: { ...prev.whatsapp, message: e.target.value } } : null
                        )
                      }
                      className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                    />
                  </div>
                </div>

                <div className="p-4 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900/50">
                  <div className="flex items-center gap-2 mb-3">
                    <Send className="w-5 h-5 text-purple-600" />
                    <h4 className="font-semibold text-slate-900 dark:text-slate-100">Direct Message (DM)</h4>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                      Mensaje
                    </label>
                    <textarea
                      rows={6}
                      value={content.dm.message}
                      onChange={(e) =>
                        setContent((prev) =>
                          prev ? { ...prev, dm: { ...prev.dm, message: e.target.value } } : null
                        )
                      }
                      className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {currentStep === 'review' && campaign && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">
                  {steps[2].title}
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">{steps[2].description}</p>
              </div>

              <div className="space-y-4">
                <div className="p-4 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900/50">
                  <h4 className="font-semibold text-slate-900 dark:text-slate-100 mb-3">Resumen de la campaña</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-600 dark:text-slate-400">Nombre:</span>
                      <span className="font-medium text-slate-900 dark:text-slate-100">{campaign.objective.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600 dark:text-slate-400">Objetivo:</span>
                      <span className="font-medium text-slate-900 dark:text-slate-100">
                        {objectiveLabels[campaign.objective.objective].label}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600 dark:text-slate-400">Audiencia:</span>
                      <span className="font-medium text-slate-900 dark:text-slate-100">
                        {campaign.objective.targetAudience}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600 dark:text-slate-400">Alcance estimado:</span>
                      <span className="font-medium text-slate-900 dark:text-slate-100">
                        {campaign.estimatedReach} contactos
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600 dark:text-slate-400">Costo estimado:</span>
                      <span className="font-medium text-slate-900 dark:text-slate-100">€{campaign.estimatedCost}</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-lg border border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-green-900 dark:text-green-100">
                        Campaña lista para activar
                      </p>
                      <p className="text-xs text-green-700 dark:text-green-300 mt-1">
                        El contenido ha sido generado y está listo para ser enviado. Puedes activarlo ahora o guardarlo
                        como borrador.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Navigation buttons */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-700">
          <Button variant="ghost" onClick={handleBack} leftIcon={<ArrowLeft className="w-4 h-4" />}>
            {currentStep === 'objective' ? 'Cancelar' : 'Atrás'}
          </Button>
          <div className="flex items-center gap-3">
            {isGenerating && (
              <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Generando contenido con IA...</span>
              </div>
            )}
            {currentStep === 'review' ? (
              <Button variant="primary" onClick={handleActivate} leftIcon={<Sparkles className="w-4 h-4" />}>
                Activar campaña
              </Button>
            ) : (
              <Button
                variant="primary"
                onClick={handleNext}
                disabled={!canAdvance()}
                rightIcon={isGenerating ? undefined : <ArrowRight className="w-4 h-4" />}
              >
                {currentStep === 'objective' ? 'Generar contenido con IA' : 'Continuar'}
              </Button>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
};

