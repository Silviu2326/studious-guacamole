import { useState, useEffect } from 'react';
import { Sparkles, AlertTriangle, Lightbulb, TrendingUp, RefreshCw, Copy, Loader2, CheckCircle2 } from 'lucide-react';
import { Button, Card, Badge, Select, Tabs } from '../../../components/componentsreutilizables';
import type { SaturatedTopicsAnalysis, CreativeTwist, ContentStudioPeriod } from '../types';
import { analyzeSaturatedTopics, generateCreativeTwists, getAnalysisHistory } from '../api/saturatedTopics';

interface SaturatedTopicsDetectorProps {
  loading?: boolean;
  period?: ContentStudioPeriod;
}

const periodOptions: Array<{ value: ContentStudioPeriod; label: string }> = [
  { value: '7d', label: 'Últimos 7 días' },
  { value: '30d', label: 'Últimos 30 días' },
  { value: '90d', label: 'Últimos 90 días' },
];

export function SaturatedTopicsDetector({ loading: externalLoading, period: initialPeriod = '30d' }: SaturatedTopicsDetectorProps) {
  const [period, setPeriod] = useState<ContentStudioPeriod>(initialPeriod);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<SaturatedTopicsAnalysis | null>(null);
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [generatingTwists, setGeneratingTwists] = useState(false);
  const [customTwists, setCustomTwists] = useState<CreativeTwist[]>([]);
  const [activeTab, setActiveTab] = useState<'analysis' | 'twists' | 'recommendations'>('analysis');

  useEffect(() => {
    if (!externalLoading) {
      loadAnalysis();
    }
  }, [period, externalLoading]);

  const loadAnalysis = async () => {
    setAnalyzing(true);
    try {
      const result = await analyzeSaturatedTopics({ period, includeSuggestions: true });
      setAnalysis(result);
    } catch (error) {
      console.error('Error analyzing saturated topics:', error);
      alert('Error al analizar temas saturados. Intenta nuevamente.');
    } finally {
      setAnalyzing(false);
    }
  };

  const handleGenerateTwists = async (topic: string) => {
    setSelectedTopic(topic);
    setGeneratingTwists(true);
    try {
      const twists = await generateCreativeTwists({ topic, count: 5 });
      setCustomTwists(twists);
      setActiveTab('twists');
    } catch (error) {
      console.error('Error generating twists:', error);
      alert('Error al generar giros creativos. Intenta nuevamente.');
    } finally {
      setGeneratingTwists(false);
    }
  };

  const getSaturationColor = (level: string) => {
    if (level === 'high') return 'red';
    if (level === 'medium') return 'yellow';
    return 'blue';
  };

  const getSaturationBadgeVariant = (level: string) => {
    if (level === 'high') return 'red';
    if (level === 'medium') return 'yellow';
    return 'blue';
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('Copiado al portapapeles');
  };

  if (externalLoading) {
    return (
      <Card className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 w-1/3 bg-slate-200 rounded" />
          <div className="h-24 bg-slate-100 rounded-2xl" />
        </div>
      </Card>
    );
  }

  const allTwists = analysis ? [...analysis.creativeTwists, ...customTwists] : customTwists;

  return (
    <Card className="p-0 shadow-sm border border-slate-100">
      <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-slate-900 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-500" />
            Detección de Temas Saturados
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Detecta temas saturados y recibe propuestas de giros creativos para mantener frescura
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Select
            options={periodOptions}
            value={period}
            onChange={(e) => setPeriod(e.target.value as ContentStudioPeriod)}
            className="w-40"
          />
          <Button
            variant="secondary"
            size="sm"
            onClick={loadAnalysis}
            disabled={analyzing}
            leftIcon={analyzing ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
          >
            {analyzing ? 'Analizando...' : 'Analizar'}
          </Button>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {analyzing && !analysis ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <Loader2 className="w-8 h-8 animate-spin text-indigo-500 mx-auto mb-3" />
              <p className="text-slate-600">Analizando temas saturados...</p>
            </div>
          </div>
        ) : analysis ? (
          <>
            {/* Resumen */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                <div className="text-sm text-slate-600 mb-1">Temas analizados</div>
                <div className="text-2xl font-bold text-slate-900">{analysis.totalTopicsAnalyzed}</div>
              </div>
              <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
                <div className="text-sm text-amber-700 mb-1">Temas saturados</div>
                <div className="text-2xl font-bold text-amber-900">{analysis.saturatedTopics.length}</div>
              </div>
              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="text-sm text-green-700 mb-1">Giros creativos</div>
                <div className="text-2xl font-bold text-green-900">{allTwists.length}</div>
              </div>
            </div>

            {/* Tabs */}
            <Tabs
              items={[
                { id: 'analysis', label: 'Análisis' },
                { id: 'twists', label: 'Giros Creativos' },
                { id: 'recommendations', label: 'Recomendaciones' },
              ]}
              activeTab={activeTab}
              onTabChange={(tabId) => setActiveTab(tabId as any)}
              variant="underline"
            />

            {/* Contenido de tabs */}
            {activeTab === 'analysis' && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-slate-900">Temas Saturados Detectados</h3>
                {analysis.saturatedTopics.length === 0 ? (
                  <div className="p-6 bg-green-50 rounded-lg border border-green-200 text-center">
                    <CheckCircle2 className="w-8 h-8 text-green-600 mx-auto mb-2" />
                    <p className="text-green-800 font-semibold">¡Excelente! No hay temas saturados detectados.</p>
                    <p className="text-sm text-green-700 mt-1">Tu contenido mantiene buena diversidad temática.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {analysis.saturatedTopics.map((topic) => (
                      <div
                        key={topic.id}
                        className="p-4 bg-white rounded-lg border border-slate-200 hover:border-slate-300 transition-colors"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h4 className="font-semibold text-slate-900">{topic.topic}</h4>
                              <Badge variant={getSaturationBadgeVariant(topic.saturationLevel) as any} size="sm">
                                {topic.saturationLevel === 'high' ? 'Alta' : topic.saturationLevel === 'medium' ? 'Media' : 'Baja'}
                              </Badge>
                              {topic.category && (
                                <Badge variant="gray" size="sm">
                                  {topic.category}
                                </Badge>
                              )}
                            </div>
                            <div className="flex items-center gap-4 text-sm text-slate-600">
                              <span>Frecuencia: {topic.frequency} veces</span>
                              <span>Saturación: {topic.saturationScore}/100</span>
                              {topic.lastUsed && (
                                <span>Último uso: {new Date(topic.lastUsed).toLocaleDateString('es-ES')}</span>
                              )}
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleGenerateTwists(topic.topic)}
                            disabled={generatingTwists}
                            leftIcon={<Lightbulb className="w-4 h-4" />}
                          >
                            Generar giros
                          </Button>
                        </div>
                        <div className="mt-3">
                          <div className="text-sm font-semibold text-slate-700 mb-1">Razones de saturación:</div>
                          <ul className="text-sm text-slate-600 space-y-1">
                            {topic.reasons.map((reason, i) => (
                              <li key={i} className="flex items-start gap-2">
                                <span className="text-amber-500 mt-1">•</span>
                                <span>{reason}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        {topic.relatedTopics.length > 0 && (
                          <div className="mt-3 pt-3 border-t border-slate-200">
                            <div className="text-sm font-semibold text-slate-700 mb-1">Temas relacionados:</div>
                            <div className="flex flex-wrap gap-2">
                              {topic.relatedTopics.map((related, i) => (
                                <Badge key={i} variant="gray" size="sm">
                                  {related}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'twists' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-slate-900">Giros Creativos Propuestos</h3>
                  {selectedTopic && (
                    <Badge variant="blue" size="md">
                      Para: {selectedTopic}
                    </Badge>
                  )}
                </div>
                {allTwists.length === 0 ? (
                  <div className="p-6 bg-slate-50 rounded-lg border border-slate-200 text-center">
                    <Lightbulb className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                    <p className="text-slate-600">No hay giros creativos disponibles.</p>
                    <p className="text-sm text-slate-500 mt-1">Selecciona un tema saturado y genera giros creativos.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {allTwists.map((twist) => (
                      <div
                        key={twist.id}
                        className="p-5 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-lg border border-indigo-200"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h4 className="font-semibold text-slate-900">{twist.twist}</h4>
                              <Badge variant="green" size="sm">
                                Freshness: {twist.freshnessScore}/100
                              </Badge>
                              <Badge
                                variant={twist.priority === 'high' ? 'red' : twist.priority === 'medium' ? 'yellow' : 'gray'}
                                size="sm"
                              >
                                {twist.priority === 'high' ? 'Alta' : twist.priority === 'medium' ? 'Media' : 'Baja'} prioridad
                              </Badge>
                            </div>
                            <p className="text-sm text-slate-700 mb-2">{twist.description}</p>
                            <div className="text-sm text-slate-600 mb-3">
                              <span className="font-semibold">Ángulo:</span> {twist.angle}
                            </div>
                            <div className="flex flex-wrap gap-2 mb-3">
                              <span className="text-xs font-semibold text-slate-600">Formatos sugeridos:</span>
                              {twist.suggestedFormats.map((format, i) => (
                                <Badge key={i} variant="blue" size="sm">
                                  {format}
                                </Badge>
                              ))}
                              <span className="text-xs font-semibold text-slate-600 ml-2">Plataformas:</span>
                              {twist.suggestedPlatforms.map((platform, i) => (
                                <Badge key={i} variant="purple" size="sm">
                                  {platform}
                                </Badge>
                              ))}
                            </div>
                            {twist.exampleContent && (
                              <div className="mt-4 p-3 bg-white rounded border border-indigo-200">
                                <div className="text-xs font-semibold text-slate-600 mb-2">Ejemplo de contenido:</div>
                                <div className="space-y-2 text-sm">
                                  <div>
                                    <span className="font-semibold text-slate-700">Hook:</span>{' '}
                                    <span className="text-slate-600">{twist.exampleContent.hook}</span>
                                  </div>
                                  <div>
                                    <span className="font-semibold text-slate-700">Cuerpo:</span>{' '}
                                    <span className="text-slate-600">{twist.exampleContent.body}</span>
                                  </div>
                                  <div>
                                    <span className="font-semibold text-slate-700">CTA:</span>{' '}
                                    <span className="text-slate-600">{twist.exampleContent.cta}</span>
                                  </div>
                                </div>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="mt-2"
                                  onClick={() =>
                                    copyToClipboard(
                                      `${twist.exampleContent!.hook}\n\n${twist.exampleContent!.body}\n\n${twist.exampleContent!.cta}`
                                    )
                                  }
                                  leftIcon={<Copy className="w-4 h-4" />}
                                >
                                  Copiar ejemplo
                                </Button>
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-slate-500">
                          <span>Confianza: {twist.confidence}%</span>
                          <span>•</span>
                          <span>Tema original: {twist.originalTopic}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'recommendations' && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-slate-900">Recomendaciones</h3>
                {analysis.recommendations.length === 0 ? (
                  <div className="p-6 bg-slate-50 rounded-lg border border-slate-200 text-center">
                    <CheckCircle2 className="w-8 h-8 text-green-600 mx-auto mb-2" />
                    <p className="text-slate-600">No hay recomendaciones específicas en este momento.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {analysis.recommendations.map((rec) => (
                      <div
                        key={rec.id}
                        className={`p-4 rounded-lg border ${
                          rec.type === 'avoid'
                            ? 'bg-red-50 border-red-200'
                            : rec.type === 'refresh'
                            ? 'bg-amber-50 border-amber-200'
                            : 'bg-blue-50 border-blue-200'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className="mt-1">
                            {rec.type === 'avoid' ? (
                              <AlertTriangle className="w-5 h-5 text-red-600" />
                            ) : rec.type === 'refresh' ? (
                              <RefreshCw className="w-5 h-5 text-amber-600" />
                            ) : (
                              <TrendingUp className="w-5 h-5 text-blue-600" />
                            )}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h4 className="font-semibold text-slate-900">{rec.topic}</h4>
                              <Badge
                                variant={
                                  rec.priority === 'high' ? 'red' : rec.priority === 'medium' ? 'yellow' : 'gray'
                                }
                                size="sm"
                              >
                                {rec.priority === 'high' ? 'Alta' : rec.priority === 'medium' ? 'Media' : 'Baja'} prioridad
                              </Badge>
                              <Badge
                                variant={rec.type === 'avoid' ? 'red' : rec.type === 'refresh' ? 'yellow' : 'blue'}
                                size="sm"
                              >
                                {rec.type === 'avoid' ? 'Evitar' : rec.type === 'refresh' ? 'Refrescar' : 'Pivotear'}
                              </Badge>
                            </div>
                            <p className="text-sm text-slate-700 mb-3">{rec.message}</p>
                            {rec.actionItems.length > 0 && (
                              <div>
                                <div className="text-sm font-semibold text-slate-700 mb-2">Acciones recomendadas:</div>
                                <ul className="space-y-1">
                                  {rec.actionItems.map((action, i) => (
                                    <li key={i} className="text-sm text-slate-600 flex items-start gap-2">
                                      <span className="text-indigo-500 mt-1">✓</span>
                                      <span>{action}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Insights */}
                {analysis.insights.length > 0 && (
                  <div className="mt-6">
                    <h4 className="text-md font-semibold text-slate-900 mb-3">Insights Adicionales</h4>
                    <div className="space-y-2">
                      {analysis.insights.map((insight) => (
                        <div
                          key={insight.id}
                          className={`p-3 rounded-lg border ${
                            insight.type === 'warning'
                              ? 'bg-amber-50 border-amber-200'
                              : insight.type === 'opportunity'
                              ? 'bg-green-50 border-green-200'
                              : 'bg-blue-50 border-blue-200'
                          }`}
                        >
                          <div className="flex items-start gap-2">
                            {insight.type === 'warning' ? (
                              <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5" />
                            ) : insight.type === 'opportunity' ? (
                              <Lightbulb className="w-4 h-4 text-green-600 mt-0.5" />
                            ) : (
                              <TrendingUp className="w-4 h-4 text-blue-600 mt-0.5" />
                            )}
                            <div>
                              <div className="font-semibold text-slate-900 text-sm">{insight.title}</div>
                              <div className="text-sm text-slate-600 mt-1">{insight.description}</div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <Sparkles className="w-12 h-12 text-slate-400 mx-auto mb-3" />
            <p className="text-slate-600 mb-4">Haz clic en "Analizar" para detectar temas saturados</p>
            <Button variant="primary" onClick={loadAnalysis} disabled={analyzing}>
              {analyzing ? 'Analizando...' : 'Comenzar análisis'}
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
}

