import { useState, useEffect } from 'react';
import { Badge, Button, Card } from '../../../components/componentsreutilizables';
import type { FAQQuestion, FAQContentIdea } from '../types';
import { analyzeFrequentlyAskedQuestions, generateFAQContentIdeas } from '../api/faqContent';
import { ICON_MAP } from './iconMap';
import { MessageSquare, Lightbulb, TrendingUp, Copy, Plus } from 'lucide-react';

interface FAQContentGeneratorProps {
  loading?: boolean;
}

export function FAQContentGenerator({ loading: externalLoading }: FAQContentGeneratorProps) {
  const [questions, setQuestions] = useState<FAQQuestion[]>([]);
  const [contentIdeas, setContentIdeas] = useState<FAQContentIdea[]>([]);
  const [selectedQuestionId, setSelectedQuestionId] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    if (!externalLoading) {
      loadFAQData();
    }
  }, [externalLoading]);

  const loadFAQData = async () => {
    setLoading(true);
    try {
      const [faqQuestions, ideas] = await Promise.all([
        analyzeFrequentlyAskedQuestions(),
        generateFAQContentIdeas(),
      ]);
      setQuestions(faqQuestions);
      setContentIdeas(ideas);
      if (faqQuestions.length > 0 && !selectedQuestionId) {
        setSelectedQuestionId(faqQuestions[0].id);
      }
    } catch (error) {
      console.error('Error cargando preguntas frecuentes:', error);
    } finally {
      setLoading(false);
    }
  };

  const selectedQuestion = questions.find((q) => q.id === selectedQuestionId);
  const selectedIdea = contentIdeas.find((idea) => idea.question === selectedQuestion?.question);

  const getPriorityColor = (priority: FAQContentIdea['priority']) => {
    switch (priority) {
      case 'high':
        return 'red';
      case 'medium':
        return 'yellow';
      default:
        return 'blue';
    }
  };

  const getSourceIcon = (source: FAQQuestion['source']) => {
    switch (source) {
      case 'whatsapp':
        return '💬';
      case 'instagram':
        return '📷';
      case 'email':
        return '📧';
      default:
        return '📥';
    }
  };

  if (externalLoading || loading) {
    return (
      <Card className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 w-1/3 bg-slate-200 rounded" />
          <div className="h-24 bg-slate-100 rounded-2xl" />
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-0 shadow-sm border border-slate-100">
      <div className="px-6 py-5 border-b border-slate-100">
        <div className="flex items-center gap-2 mb-2">
          {ICON_MAP.message ? (
            <ICON_MAP.message className="w-5 h-5 text-indigo-500" />
          ) : (
            <MessageSquare className="w-5 h-5 text-indigo-500" />
          )}
          <h2 className="text-xl font-semibold text-slate-900">
            Generador de Contenido desde Preguntas Frecuentes
          </h2>
        </div>
        <p className="text-sm text-slate-500">
          Identifica preguntas frecuentes de tus mensajes y genera ideas de contenido educativo
        </p>
      </div>

      <div className="px-6 py-5 space-y-6">
        {/* Preguntas Frecuentes */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-slate-900">Preguntas Más Frecuentes</h3>
            <Badge variant="blue" size="sm">
              {questions.length} preguntas
            </Badge>
          </div>

          {questions.length === 0 ? (
            <div className="text-center py-8 text-slate-500">
              <MessageSquare className="w-12 h-12 mx-auto mb-3 text-slate-300" />
              <p className="text-sm">No se encontraron preguntas frecuentes aún</p>
              <p className="text-xs mt-1">Las preguntas se detectan automáticamente de tus mensajes</p>
            </div>
          ) : (
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {questions.map((question) => (
                <div
                  key={question.id}
                  className={`border rounded-xl p-3 cursor-pointer transition-all ${
                    selectedQuestionId === question.id
                      ? 'border-indigo-500 bg-indigo-50'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                  onClick={() => setSelectedQuestionId(question.id)}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-slate-900 mb-1">
                        {question.question}
                      </p>
                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge variant="gray" size="sm">
                          {getSourceIcon(question.source)} {question.source}
                        </Badge>
                        {question.category && (
                          <Badge variant="purple" size="sm">
                            {question.category}
                          </Badge>
                        )}
                        <span className="text-xs text-slate-500">
                          {question.frequency} {question.frequency === 1 ? 'vez' : 'veces'}
                        </span>
                      </div>
                    </div>
                    <TrendingUp className="w-4 h-4 text-slate-400" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Ideas de Contenido para la Pregunta Seleccionada */}
        {selectedIdea && (
          <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-semibold text-slate-900 mb-1">Ideas de Contenido</h3>
                <p className="text-xs text-slate-600">{selectedIdea.question}</p>
              </div>
              <Badge variant={getPriorityColor(selectedIdea.priority) as any} size="sm">
                Prioridad {selectedIdea.priority}
              </Badge>
            </div>

            <div className="space-y-4">
              {selectedIdea.contentIdeas.map((idea, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-xl p-4 border border-slate-200"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <Badge variant="purple" size="sm">
                      {idea.format.toUpperCase()}
                    </Badge>
                    <h4 className="text-sm font-semibold text-slate-900">{idea.title}</h4>
                  </div>

                  <div className="space-y-2 mb-3">
                    <div>
                      <p className="text-xs text-slate-500 mb-1">Hook:</p>
                      <p className="text-sm text-slate-700 font-medium">{idea.hook}</p>
                    </div>

                    <div>
                      <p className="text-xs text-slate-500 mb-1">Puntos Clave:</p>
                      <ul className="list-disc list-inside space-y-1">
                        {idea.keyPoints.map((point, pointIdx) => (
                          <li key={pointIdx} className="text-sm text-slate-700">
                            {point}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <p className="text-xs text-slate-500 mb-1">Call to Action:</p>
                      <p className="text-sm text-slate-700">{idea.cta}</p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => {
                        const content = `${idea.hook}\n\n${idea.keyPoints.map((p) => `• ${p}`).join('\n')}\n\n${idea.cta}`;
                        navigator.clipboard.writeText(content);
                      }}
                    >
                      <Copy className="w-3 h-3 mr-1" />
                      Copiar
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Plus className="w-3 h-3 mr-1" />
                      Agregar al Planner
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Botón Regenerar Ideas */}
        {questions.length > 0 && (
          <Button
            variant="secondary"
            onClick={async () => {
              setGenerating(true);
              try {
                const ideas = await generateFAQContentIdeas();
                setContentIdeas(ideas);
              } catch (error) {
                console.error('Error regenerando ideas:', error);
              } finally {
                setGenerating(false);
              }
            }}
            disabled={generating}
            className="w-full"
          >
            {generating ? (
              <>
                <Lightbulb className="w-4 h-4 mr-2 animate-spin" />
                Regenerando ideas...
              </>
            ) : (
              <>
                <Lightbulb className="w-4 h-4 mr-2" />
                Regenerar Ideas de Contenido
              </>
            )}
          </Button>
        )}
      </div>
    </Card>
  );
}

