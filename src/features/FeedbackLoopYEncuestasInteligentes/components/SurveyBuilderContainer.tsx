import React, { useState, useEffect } from 'react';
import { Survey, SurveyQuestion, QuestionType, createSurvey, updateSurvey, getSurvey } from '../api/surveys';
import { AutomationTriggerConfig } from './AutomationTriggerConfig';
import { getTriggerOptions } from '../api/surveys';
import { X, ArrowLeft, Plus, Trash2, GripVertical, Loader2, Save, Eye } from 'lucide-react';

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
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 text-purple-600 animate-spin" />
      </div>
    );
  }

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
                {surveyId ? 'Editar Encuesta' : 'Crear Nueva Encuesta'}
              </h2>
            </div>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition disabled:opacity-50"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Guardando...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Guardar
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Contenido */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* Información básica */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Información Básica</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Título de la Encuesta *
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Ej: Satisfacción Post-Sesión"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Descripción (opcional)
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  rows={3}
                  placeholder="Describe el propósito de esta encuesta..."
                />
              </div>
            </div>
          </div>

          {/* Preguntas */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Preguntas</h3>
              <div className="flex items-center gap-2">
                <select
                  onChange={(e) => handleAddQuestion(e.target.value as QuestionType)}
                  defaultValue=""
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
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
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
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
                                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
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
                            className="text-sm text-purple-600 hover:text-purple-700"
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
                            className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
                          />
                          <span className="text-gray-700">Requerida</span>
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
                <div className="text-center py-8 text-gray-500">
                  <p>No hay preguntas todavía. Agrega una pregunta para comenzar.</p>
                </div>
              )}
            </div>
          </div>

          {/* Automatización */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <AutomationTriggerConfig
              availableTriggers={triggerOptions}
              value={automationRule}
              onChange={setAutomationRule}
            />
          </div>
        </div>
      </div>
    </div>
  );
};


