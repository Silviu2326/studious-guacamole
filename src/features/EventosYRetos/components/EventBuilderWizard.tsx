import React, { useState, useEffect } from 'react';
import { Event, EventMetric, EventType } from '../api/events';
import { X, ArrowLeft, ArrowRight, Save, Plus, Trash2, Loader2 } from 'lucide-react';

interface EventBuilderWizardProps {
  initialEventData?: Partial<Event>;
  onSubmit: (eventData: Omit<Event, 'id' | 'createdAt' | 'status' | 'participantCount'>) => Promise<void>;
  onCancel?: () => void;
}

type WizardStep = 'basic' | 'details' | 'metrics' | 'review';

/**
 * Componente de formulario multi-paso que guía al entrenador
 * a través de la creación de un nuevo evento o reto.
 */
export const EventBuilderWizard: React.FC<EventBuilderWizardProps> = ({
  initialEventData,
  onSubmit,
  onCancel
}) => {
  const [currentStep, setCurrentStep] = useState<WizardStep>('basic');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  
  const [formData, setFormData] = useState<Partial<Event>>({
    name: '',
    description: '',
    type: 'challenge',
    startDate: '',
    endDate: '',
    fee: 0,
    currency: 'EUR',
    maxParticipants: undefined,
    rules: [],
    metrics: [],
    coverImageUrl: '',
    ...initialEventData
  });

  const [newRule, setNewRule] = useState<string>('');
  const [newMetric, setNewMetric] = useState<Partial<EventMetric>>({
    name: '',
    type: 'number',
    unit: ''
  });

  const steps = [
    { id: 'basic', label: 'Información Básica' },
    { id: 'details', label: 'Detalles y Precio' },
    { id: 'metrics', label: 'Métricas' },
    { id: 'review', label: 'Revisar' }
  ];

  const currentStepIndex = steps.findIndex(s => s.id === currentStep);

  const validateStep = (step: WizardStep): boolean => {
    const errors: Record<string, string> = {};
    
    if (step === 'basic') {
      if (!formData.name?.trim()) errors.name = 'El nombre es requerido';
      if (!formData.description?.trim()) errors.description = 'La descripción es requerida';
      if (!formData.startDate) errors.startDate = 'La fecha de inicio es requerida';
      if (!formData.endDate) errors.endDate = 'La fecha de fin es requerida';
      if (formData.startDate && formData.endDate && new Date(formData.startDate) >= new Date(formData.endDate)) {
        errors.endDate = 'La fecha de fin debe ser posterior a la de inicio';
      }
    }
    
    if (step === 'details') {
      if (formData.fee === undefined || formData.fee < 0) {
        errors.fee = 'El precio debe ser un valor válido';
      }
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleNext = () => {
    if (!validateStep(currentStep)) return;
    
    const stepOrder: WizardStep[] = ['basic', 'details', 'metrics', 'review'];
    const currentIndex = stepOrder.indexOf(currentStep);
    if (currentIndex < stepOrder.length - 1) {
      setCurrentStep(stepOrder[currentIndex + 1]);
    }
  };

  const handlePrevious = () => {
    const stepOrder: WizardStep[] = ['basic', 'details', 'metrics', 'review'];
    const currentIndex = stepOrder.indexOf(currentStep);
    if (currentIndex > 0) {
      setCurrentStep(stepOrder[currentIndex - 1]);
    }
  };

  const handleAddRule = () => {
    if (newRule.trim()) {
      setFormData(prev => ({
        ...prev,
        rules: [...(prev.rules || []), newRule.trim()]
      }));
      setNewRule('');
    }
  };

  const handleRemoveRule = (index: number) => {
    setFormData(prev => ({
      ...prev,
      rules: prev.rules?.filter((_, i) => i !== index) || []
    }));
  };

  const handleAddMetric = () => {
    if (newMetric.name?.trim()) {
      const metric: EventMetric = {
        id: `metric_${Date.now()}`,
        name: newMetric.name,
        type: newMetric.type || 'number',
        unit: newMetric.unit,
        isPrimary: false
      };
      setFormData(prev => ({
        ...prev,
        metrics: [...(prev.metrics || []), metric]
      }));
      setNewMetric({ name: '', type: 'number', unit: '' });
    }
  };

  const handleRemoveMetric = (id: string) => {
    setFormData(prev => ({
      ...prev,
      metrics: prev.metrics?.filter(m => m.id !== id) || []
    }));
  };

  const handleSubmit = async () => {
    if (!validateStep('basic') || !validateStep('details')) {
      alert('Por favor, completa todos los campos requeridos');
      return;
    }

    setIsSubmitting(true);
    try {
      const eventData = {
        name: formData.name!,
        description: formData.description!,
        type: formData.type!,
        startDate: formData.startDate!,
        endDate: formData.endDate!,
        trainerId: 'trn_current',
        fee: formData.fee || 0,
        currency: formData.currency,
        maxParticipants: formData.maxParticipants,
        rules: formData.rules,
        metrics: formData.metrics,
        coverImageUrl: formData.coverImageUrl
      };
      
      await onSubmit(eventData);
    } catch (error) {
      console.error('Error creando evento:', error);
      alert('Error al crear el evento. Por favor, intenta nuevamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
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
                {initialEventData?.id ? 'Editar Evento' : 'Crear Nuevo Evento/Reto'}
              </h2>
            </div>
          </div>

          {/* Indicador de pasos */}
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center flex-1">
                <div className="flex flex-col items-center flex-1">
                  <button
                    onClick={() => {
                      if (index <= currentStepIndex) {
                        setCurrentStep(step.id as WizardStep);
                      }
                    }}
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-medium transition ${
                      index <= currentStepIndex
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-200 text-gray-600'
                    }`}
                  >
                    {index + 1}
                  </button>
                  <span className="mt-2 text-xs font-medium text-gray-600 text-center">
                    {step.label}
                  </span>
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
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          {currentStep === 'basic' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">Información Básica</h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre del Evento/Reto *
                </label>
                <input
                  type="text"
                  value={formData.name || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                    validationErrors.name ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Ej: Reto de 30 días Fit"
                />
                {validationErrors.name && (
                  <p className="mt-1 text-sm text-red-600">{validationErrors.name}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Descripción *
                </label>
                <textarea
                  value={formData.description || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                    validationErrors.description ? 'border-red-300' : 'border-gray-300'
                  }`}
                  rows={4}
                  placeholder="Describe el evento o reto..."
                />
                {validationErrors.description && (
                  <p className="mt-1 text-sm text-red-600">{validationErrors.description}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tipo *
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as EventType }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="challenge">Reto/Desafío</option>
                  <option value="bootcamp">Bootcamp</option>
                  <option value="workshop">Taller/Workshop</option>
                  <option value="retreat">Retiro</option>
                  <option value="other">Otro</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Fecha de Inicio *
                  </label>
                  <input
                    type="datetime-local"
                    value={formData.startDate || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                      validationErrors.startDate ? 'border-red-300' : 'border-gray-300'
                    }`}
                  />
                  {validationErrors.startDate && (
                    <p className="mt-1 text-sm text-red-600">{validationErrors.startDate}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Fecha de Fin *
                  </label>
                  <input
                    type="datetime-local"
                    value={formData.endDate || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                      validationErrors.endDate ? 'border-red-300' : 'border-gray-300'
                    }`}
                  />
                  {validationErrors.endDate && (
                    <p className="mt-1 text-sm text-red-600">{validationErrors.endDate}</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {currentStep === 'details' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">Detalles y Precio</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Precio de Inscripción (EUR)
                  </label>
                  <input
                    type="number"
                    value={formData.fee || 0}
                    onChange={(e) => setFormData(prev => ({ ...prev, fee: Number(e.target.value) }))}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                      validationErrors.fee ? 'border-red-300' : 'border-gray-300'
                    }`}
                    min="0"
                    step="0.01"
                  />
                  {validationErrors.fee && (
                    <p className="mt-1 text-sm text-red-600">{validationErrors.fee}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Máximo de Participantes
                  </label>
                  <input
                    type="number"
                    value={formData.maxParticipants || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, maxParticipants: Number(e.target.value) || undefined }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    min="1"
                    placeholder="Sin límite"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Reglas del Evento/Reto
                </label>
                <div className="space-y-2 mb-3">
                  {formData.rules?.map((rule, index) => (
                    <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                      <span className="flex-1 text-sm text-gray-700">{rule}</span>
                      <button
                        onClick={() => handleRemoveRule(index)}
                        className="p-1 text-red-600 hover:bg-red-50 rounded"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newRule}
                    onChange={(e) => setNewRule(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddRule();
                      }
                    }}
                    placeholder="Añadir nueva regla..."
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                  <button
                    onClick={handleAddRule}
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {currentStep === 'metrics' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">Métricas para Leaderboard</h3>
              <p className="text-sm text-gray-600">
                Define qué métricas se usarán para el ranking y seguimiento del progreso
              </p>
              
              <div className="space-y-3">
                {formData.metrics?.map((metric) => (
                  <div key={metric.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <span className="font-medium text-gray-900">{metric.name}</span>
                      {metric.unit && (
                        <span className="text-sm text-gray-600 ml-2">({metric.unit})</span>
                      )}
                    </div>
                    <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded">
                      {metric.type}
                    </span>
                    {metric.isPrimary && (
                      <span className="text-xs px-2 py-1 bg-purple-100 text-purple-800 rounded">
                        Principal
                      </span>
                    )}
                    <button
                      onClick={() => handleRemoveMetric(metric.id)}
                      className="p-1 text-red-600 hover:bg-red-50 rounded"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-200 pt-4">
                <h4 className="text-sm font-medium text-gray-700 mb-3">Añadir Nueva Métrica</h4>
                <div className="grid grid-cols-4 gap-3">
                  <input
                    type="text"
                    value={newMetric.name || ''}
                    onChange={(e) => setNewMetric(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Nombre"
                    className="col-span-2 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                  <select
                    value={newMetric.type || 'number'}
                    onChange={(e) => setNewMetric(prev => ({ ...prev, type: e.target.value as any }))}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="number">Número</option>
                    <option value="percentage">Porcentaje</option>
                    <option value="count">Contador</option>
                    <option value="boolean">Sí/No</option>
                  </select>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newMetric.unit || ''}
                      onChange={(e) => setNewMetric(prev => ({ ...prev, unit: e.target.value }))}
                      placeholder="Unidad"
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                    <button
                      onClick={handleAddMetric}
                      className="px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {currentStep === 'review' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">Revisar y Confirmar</h3>
              
              <div className="bg-gray-50 rounded-lg p-6 space-y-4">
                <div>
                  <span className="text-sm font-medium text-gray-600">Nombre:</span>
                  <p className="text-base text-gray-900 mt-1">{formData.name}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-600">Tipo:</span>
                  <p className="text-base text-gray-900 mt-1">{formData.type}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-600">Fechas:</span>
                  <p className="text-base text-gray-900 mt-1">
                    {formData.startDate && new Date(formData.startDate).toLocaleDateString('es-ES')} - {' '}
                    {formData.endDate && new Date(formData.endDate).toLocaleDateString('es-ES')}
                  </p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-600">Precio:</span>
                  <p className="text-base text-gray-900 mt-1">
                    {formData.fee?.toFixed(2)} {formData.currency}
                  </p>
                </div>
                {formData.maxParticipants && (
                  <div>
                    <span className="text-sm font-medium text-gray-600">Máximo Participantes:</span>
                    <p className="text-base text-gray-900 mt-1">{formData.maxParticipants}</p>
                  </div>
                )}
                {formData.metrics && formData.metrics.length > 0 && (
                  <div>
                    <span className="text-sm font-medium text-gray-600">Métricas:</span>
                    <p className="text-base text-gray-900 mt-1">
                      {formData.metrics.map(m => m.name).join(', ')}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Navegación */}
          <div className="mt-6 flex items-center justify-between pt-6 border-t border-gray-200">
            <button
              onClick={handlePrevious}
              disabled={currentStep === 'basic'}
              className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ArrowLeft className="w-4 h-4" />
              Anterior
            </button>

            <div className="flex items-center gap-2">
              {currentStep === 'review' ? (
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="flex items-center gap-2 px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Creando...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      Crear Evento
                    </>
                  )}
                </button>
              ) : (
                <button
                  onClick={handleNext}
                  className="flex items-center gap-2 px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
                >
                  Siguiente
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


