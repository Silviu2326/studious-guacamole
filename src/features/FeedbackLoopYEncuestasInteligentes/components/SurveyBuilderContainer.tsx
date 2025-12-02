import React, { useState, useEffect } from 'react';
import { Survey, SurveyQuestion, QuestionType, createSurvey, updateSurvey, getSurvey } from '../api/surveys';
import { AutomationTriggerConfig } from './AutomationTriggerConfig';
import { getTriggerOptions } from '../api/surveys';
import { X, ArrowLeft, Plus, Trash2, GripVertical, Loader2, Save, Eye } from 'lucide-react';
import { Card } from '../../../components/componentsreutilizables';
import { Button } from '../../../components/componentsreutilizables';

interface SurveyBuilderContainerProps {
  surveyId?: string | null;
  onSave: (survey: Survey) => void;
  onCancel?: () => void;
}

/**
 * Componente principal que maneja la lógica y el estado para crear y editar una encuesta.
 */
export const SurveyBuilderContainer: React.FC<SurveyBuilderContainerProps> = ({
  surveyId,
  onSave,
  onCancel
}) => {
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [questions, setQuestions] = useState<SurveyQuestion[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [automationRule, setAutomationRule] = useState<{
    triggerId: string;
    delay: number;
    unit: 'hours' | 'days';
  }>({
    triggerId: 'manual',
    delay: 0,
    unit: 'hours'
  });

  const triggerOptions = getTriggerOptions();

  useEffect(() => {
    if (surveyId) {
      loadSurvey();
    }
  }, [surveyId]);

  const loadSurvey = async () => {
    setIsLoading(true);
    try {
      const survey = await getSurvey(surveyId!);
      if (survey) {
        setTitle(survey.title);
        setDescription(survey.description || '');
        setQuestions(survey.questions);
      }
    } catch (error) {
      console.error('Error cargando encuesta:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddQuestion = (type: QuestionType) => {
    const newQuestion: SurveyQuestion = {
      id: `q_${Date.now()}`,
      type,
      text: '',
      required: true,
      ...(type === 'multiple_choice' ? { options: ['Opción 1', 'Opción 2'] } : {}),
      ...(type === 'scale' ? { min: 1, max: 10 } : {}),
      ...(type === 'rating_stars' ? { max: 5 } : {})
    };
    setQuestions([...questions, newQuestion]);
  };

  const handleUpdateQuestion = (id: string, updates: Partial<SurveyQuestion>) => {
    setQuestions(questions.map(q => q.id === id ? { ...q, ...updates } : q));
  };

  const handleRemoveQuestion = (id: string) => {
    setQuestions(questions.filter(q => q.id !== id));
  };

  const handleSave = async () => {
    if (!title.trim()) {
      alert('El título es requerido');
      return;
    }

    if (questions.length === 0) {
      alert('Debes agregar al menos una pregunta');
      return;
    }

    if (questions.some(q => !q.text.trim())) {
      alert('Todas las preguntas deben tener texto');
      return;
    }

    setIsSaving(true);
    try {
      const surveyData = {
        title,
        description,
        questions
      };

      const saved = surveyId
        ? await updateSurvey(surveyId, surveyData)
        : await createSurvey(surveyData);

      onSave(saved);
    } catch (error) {
      console.error('Error guardando encuesta:', error);
      alert('Error al guardar la encuesta');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 flex items-center justify-center">
        <Card className="p-8 text-center bg-white shadow-sm">
          <Loader2 size={48} className="mx-auto text-blue-500 animate-spin mb-4" />
          <p className="text-gray-600">Cargando...</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Header */}
      <div className="border-b border-gray-200/60 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60 sticky top-0 z-10">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6">
          <div className="py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                {onCancel && (
                  <button
                    onClick={onCancel}
                    className="p-2 hover:bg-gray-100 rounded-lg transition mr-4"
                  >
                    <ArrowLeft className="w-5 h-5 text-gray-600" />
                  </button>
                )}
                <div className="p-2 bg-blue-100 rounded-xl mr-4 ring-1 ring-blue-200/70">
                  <Plus size={24} className="text-blue-600" />
                </div>
                <div>
                  <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900">
                    {surveyId ? 'Editar Encuesta' : 'Crear Nueva Encuesta'}
                  </h1>
                  <p className="text-gray-600">
                    {surveyId ? 'Modifica los detalles de tu encuesta' : 'Construye una encuesta personalizada para capturar feedback'}
                  </p>
                </div>
              </div>
              <Button
                onClick={handleSave}
                disabled={isSaving}
                loading={isSaving}
                variant="primary"
                leftIcon={!isSaving ? <Save size={20} /> : undefined}
              >
                {isSaving ? 'Guardando...' : 'Guardar'}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Contenido */}
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6 py-8">
        <div className="space-y-6">
          {/* Información básica */}
          <Card className="bg-white shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Información Básica</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Título de la Encuesta *
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5"
                  placeholder="Ej: Satisfacción Post-Sesión"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Descripción (opcional)
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5"
                  rows={3}
                  placeholder="Describe el propósito de esta encuesta..."
                />
              </div>
            </div>
          </Card>

          {/* Preguntas */}
          <Card className="bg-white shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Preguntas</h3>
              <div className="flex items-center gap-2">
                <select
                  onChange={(e) => handleAddQuestion(e.target.value as QuestionType)}
                  defaultValue=""
                  className="rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5 text-sm"
                >
                  <option value="" disabled>Agregar Pregunta</option>
                  <option value="rating_stars">⭐ Calificación con Estrellas</option>
                  <option value="nps">📊 Net Promoter Score (NPS)</option>
                  <option value="multiple_choice">☑️ Opción Múltiple</option>
                  <option value="text">✏️ Texto Libre</option>
                  <option value="yes_no">✅ Sí/No</option>
                  <option value="scale">📏 Escala Numérica</option>
                </select>
              </div>
            </div>

            <div className="space-y-4">
              {questions.map((question, index) => (
                <div key={question.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <div className="pt-2 cursor-move">
                      <GripVertical className="w-5 h-5 text-gray-400" />
                    </div>
                    <div className="flex-1 space-y-3">
                      <div>
                        <input
                          type="text"
                          value={question.text}
                          onChange={(e) => handleUpdateQuestion(question.id, { text: e.target.value })}
                          placeholder={`Pregunta ${index + 1}...`}
                          className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5"
                        />
                      </div>

                      {question.type === 'multiple_choice' && question.options && (
                        <div className="space-y-2">
                          {question.options.map((option, optIndex) => (
                            <div key={optIndex} className="flex items-center gap-2">
                              <input
                                type="text"
                                value={option}
                                onChange={(e) => {
                                  const newOptions = [...question.options!];
                                  newOptions[optIndex] = e.target.value;
                                  handleUpdateQuestion(question.id, { options: newOptions });
                                }}
                                className="flex-1 rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5 text-sm"
                                placeholder={`Opción ${optIndex + 1}`}
                              />
                              {question.options.length > 2 && (
                                <button
                                  onClick={() => {
                                    const newOptions = question.options!.filter((_, i) => i !== optIndex);
                                    handleUpdateQuestion(question.id, { options: newOptions });
                                  }}
                                  className="p-1 text-red-600 hover:bg-red-50 rounded"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              )}
                            </div>
                          ))}
                          <button
                            onClick={() => {
                              const newOptions = [...question.options!, 'Nueva opción'];
                              handleUpdateQuestion(question.id, { options: newOptions });
                            }}
                            className="text-sm text-blue-600 hover:text-blue-700"
                          >
                            + Agregar Opción
                          </button>
                        </div>
                      )}

                      <div className="flex items-center gap-4 text-sm">
                        <label className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={question.required}
                            onChange={(e) => handleUpdateQuestion(question.id, { required: e.target.checked })}
                            className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                          />
                          <span className="text-slate-700">Requerida</span>
                        </label>
                        <button
                          onClick={() => handleRemoveQuestion(question.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {questions.length === 0 && (
                <Card className="p-8 text-center bg-white shadow-sm">
                  <p className="text-gray-500">No hay preguntas todavía. Agrega una pregunta para comenzar.</p>
                </Card>
              )}
            </div>
          </Card>

          {/* Automatización */}
          <Card className="bg-white shadow-sm">
            <AutomationTriggerConfig
              availableTriggers={triggerOptions}
              value={automationRule}
              onChange={setAutomationRule}
            />
          </Card>
        </div>
      </div>
    </div>
  );
};


