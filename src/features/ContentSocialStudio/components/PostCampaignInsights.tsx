import { useState, useEffect } from 'react';
import { Sparkles, Users, TrendingUp, Target, BarChart3, Lightbulb, AlertCircle, Loader2, RefreshCw } from 'lucide-react';
import { Button, Card, Badge, Select } from '../../../components/componentsreutilizables';
import type { GetPostCampaignInsightsResponse, CampaignInsight, ContentPerformanceByPersona, ContentStudioPeriod } from '../types';
import { getPostCampaignInsights } from '../api/postCampaignInsights';

interface PostCampaignInsightsProps {
  loading?: boolean;
  period?: ContentStudioPeriod;
}

const periodOptions: Array<{ value: ContentStudioPeriod; label: string }> = [
  { value: '7d', label: 'Últimos 7 días' },
  { value: '30d', label: 'Últimos 30 días' },
  { value: '90d', label: 'Últimos 90 días' },
];

export function PostCampaignInsights({ loading: externalLoading, period: initialPeriod = '30d' }: PostCampaignInsightsProps) {
  const [period, setPeriod] = useState<ContentStudioPeriod>(initialPeriod);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<GetPostCampaignInsightsResponse | null>(null);
  const [selectedPersona, setSelectedPersona] = useState<string | null>(null);

  useEffect(() => {
    if (!externalLoading) {
      loadInsights();
    }
  }, [period, externalLoading]);

  const loadInsights = async () => {
    setLoading(true);
    try {
      const result = await getPostCampaignInsights({ period });
      setData(result);
      if (result.insights.length > 0 && result.insights[0].buyerPersonas.length > 0) {
        setSelectedPersona(result.insights[0].buyerPersonas[0].id);
      }
    } catch (error) {
      console.error('Error loading post-campaign insights:', error);
      alert('Error al cargar insights post-campaña. Intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  const getImpactColor = (level: string) => {
    if (level === 'high') return 'text-green-600';
    if (level === 'medium') return 'text-blue-600';
    return 'text-slate-600';
  };

  const getImpactBadgeVariant = (level: string) => {
    if (level === 'high') return 'green';
    if (level === 'medium') return 'blue';
    return 'gray';
  };

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'pattern':
        return <BarChart3 className="w-5 h-5 text-blue-600" />;
      case 'recommendation':
        return <Lightbulb className="w-5 h-5 text-amber-600" />;
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-red-600" />;
      case 'opportunity':
        return <TrendingUp className="w-5 h-5 text-green-600" />;
      default:
        return <Sparkles className="w-5 h-5 text-indigo-600" />;
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

  const insight = data?.insights[0];
  const filteredPerformance = insight
    ? selectedPersona
      ? insight.performanceByPersona.filter((p) => p.personaId === selectedPersona)
      : insight.performanceByPersona
    : [];

  return (
    <Card className="p-0 shadow-sm border border-slate-100">
      <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-slate-900 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-indigo-500" />
            Insights Post-Campaña por Buyer Persona
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Descubre qué contenido impactó más a cada buyer persona para afinar tus mensajes
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
            onClick={loadInsights}
            disabled={loading}
            leftIcon={loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
          >
            {loading ? 'Cargando...' : 'Actualizar'}
          </Button>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {!data || !insight ? (
          <div className="text-center py-12">
            <Sparkles className="w-12 h-12 text-slate-400 mx-auto mb-3" />
            <p className="text-slate-600 mb-4">No hay datos disponibles</p>
            <Button variant="primary" onClick={loadInsights} disabled={loading}>
              {loading ? 'Cargando...' : 'Cargar insights'}
            </Button>
          </div>
        ) : (
          <>
            {/* Resumen */}
            {data.summary && (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                  <div className="text-sm text-slate-600 mb-1">Contenido total</div>
                  <div className="text-2xl font-bold text-slate-900">{data.summary.totalContent}</div>
                </div>
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="text-sm text-blue-700 mb-1">Buyer Personas</div>
                  <div className="text-2xl font-bold text-blue-900">{data.summary.totalPersonas}</div>
                </div>
                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="text-sm text-green-700 mb-1">Engagement Rate</div>
                  <div className="text-2xl font-bold text-green-900">{data.summary.averageEngagementRate}%</div>
                </div>
                <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                  <div className="text-sm text-purple-700 mb-1">Top Persona</div>
                  <div className="text-lg font-bold text-purple-900 truncate">{data.summary.topPerformingPersona.personaName}</div>
                  <div className="text-xs text-purple-600 mt-1">
                    {data.summary.topPerformingPersona.averageEngagementRate}% engagement
                  </div>
                </div>
              </div>
            )}

            {/* Filtro por persona */}
            {insight.buyerPersonas.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Users className="w-4 h-4 text-slate-600" />
                  <span className="text-sm font-semibold text-slate-700">Filtrar por Buyer Persona:</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant={selectedPersona === null ? 'primary' : 'secondary'}
                    size="sm"
                    onClick={() => setSelectedPersona(null)}
                  >
                    Todas
                  </Button>
                  {insight.buyerPersonas.map((persona) => (
                    <Button
                      key={persona.id}
                      variant={selectedPersona === persona.id ? 'primary' : 'secondary'}
                      size="sm"
                      onClick={() => setSelectedPersona(persona.id)}
                    >
                      {persona.name}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {/* Top performing content */}
            {insight.topPerformingContent.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-green-600" />
                  Contenido de Mayor Impacto
                </h3>
                <div className="space-y-3">
                  {insight.topPerformingContent.map((content, index) => (
                    <div key={content.contentId} className="p-4 bg-white rounded-lg border border-slate-200">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant="green" size="sm">
                              #{index + 1}
                            </Badge>
                            <h4 className="font-semibold text-slate-900">{content.contentTitle}</h4>
                            <Badge variant="blue" size="sm">
                              Score: {content.overallScore}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-slate-600 mb-2">
                            <span>Top Persona: {content.topPersona}</span>
                            <span>Engagement: {content.metrics.totalEngagement.toLocaleString()}</span>
                            <span>Reach: {content.metrics.totalReach.toLocaleString()}</span>
                            <span>Engagement Rate: {content.metrics.engagementRate}%</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Performance by persona */}
            {filteredPerformance.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                  <Target className="w-5 h-5 text-indigo-600" />
                  Rendimiento por Buyer Persona
                  {selectedPersona && (
                    <Badge variant="blue" size="sm">
                      {insight.buyerPersonas.find((p) => p.id === selectedPersona)?.name}
                    </Badge>
                  )}
                </h3>
                <div className="space-y-3">
                  {filteredPerformance
                    .sort((a, b) => b.impact.score - a.impact.score)
                    .map((perf) => (
                      <div key={`${perf.contentId}_${perf.personaId}`} className="p-4 bg-white rounded-lg border border-slate-200">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h4 className="font-semibold text-slate-900">{perf.contentTitle}</h4>
                              <Badge variant={getImpactBadgeVariant(perf.impact.level) as any} size="sm">
                                Impacto {perf.impact.level}
                              </Badge>
                              <Badge variant="blue" size="sm">
                                {perf.contentType}
                              </Badge>
                              <Badge variant="purple" size="sm">
                                {perf.platform}
                              </Badge>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm mb-3">
                              <div>
                                <span className="text-slate-600">Engagement:</span>
                                <span className="font-semibold text-slate-900 ml-1">{perf.metrics.engagement.toLocaleString()}</span>
                              </div>
                              <div>
                                <span className="text-slate-600">Reach:</span>
                                <span className="font-semibold text-slate-900 ml-1">{perf.metrics.reach.toLocaleString()}</span>
                              </div>
                              <div>
                                <span className="text-slate-600">Engagement Rate:</span>
                                <span className="font-semibold text-slate-900 ml-1">{perf.metrics.engagementRate}%</span>
                              </div>
                              <div>
                                <span className="text-slate-600">Impact Score:</span>
                                <span className={`font-semibold ml-1 ${getImpactColor(perf.impact.level)}`}>
                                  {perf.impact.score}/100
                                </span>
                              </div>
                            </div>
                            {perf.impact.reasons.length > 0 && (
                              <div className="mt-3 pt-3 border-t border-slate-200">
                                <div className="text-sm font-semibold text-slate-700 mb-2">Por qué impactó:</div>
                                <ul className="space-y-1">
                                  {perf.impact.reasons.map((reason, i) => (
                                    <li key={i} className="text-sm text-slate-600 flex items-start gap-2">
                                      <span className="text-green-500 mt-1">✓</span>
                                      <span>{reason}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                            {perf.conversion && (
                              <div className="mt-3 pt-3 border-t border-slate-200">
                                <div className="text-sm font-semibold text-slate-700 mb-2">Conversiones:</div>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                                  <div>
                                    <span className="text-slate-600">Leads:</span>
                                    <span className="font-semibold text-slate-900 ml-1">{perf.conversion.leadsGenerated}</span>
                                  </div>
                                  <div>
                                    <span className="text-slate-600">Consultas:</span>
                                    <span className="font-semibold text-slate-900 ml-1">{perf.conversion.consultations}</span>
                                  </div>
                                  <div>
                                    <span className="text-slate-600">Ventas:</span>
                                    <span className="font-semibold text-slate-900 ml-1">{perf.conversion.sales}</span>
                                  </div>
                                  <div>
                                    <span className="text-slate-600">Revenue:</span>
                                    <span className="font-semibold text-green-600 ml-1">${perf.conversion.revenue.toLocaleString()}</span>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {/* Insights */}
            {insight.insights.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                  <Lightbulb className="w-5 h-5 text-amber-600" />
                  Insights Clave
                </h3>
                <div className="space-y-3">
                  {insight.insights.map((ins) => (
                    <div
                      key={ins.id}
                      className={`p-4 rounded-lg border ${
                        ins.type === 'warning'
                          ? 'bg-red-50 border-red-200'
                          : ins.type === 'opportunity'
                          ? 'bg-green-50 border-green-200'
                          : ins.type === 'pattern'
                          ? 'bg-blue-50 border-blue-200'
                          : 'bg-amber-50 border-amber-200'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        {getInsightIcon(ins.type)}
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="font-semibold text-slate-900">{ins.title}</h4>
                            {ins.personaName && (
                              <Badge variant="blue" size="sm">
                                {ins.personaName}
                              </Badge>
                            )}
                            <Badge
                              variant={ins.priority === 'high' ? 'red' : ins.priority === 'medium' ? 'yellow' : 'gray'}
                              size="sm"
                            >
                              {ins.priority === 'high' ? 'Alta' : ins.priority === 'medium' ? 'Media' : 'Baja'} prioridad
                            </Badge>
                          </div>
                          <p className="text-sm text-slate-700 mb-3">{ins.description}</p>
                          {ins.actionable && ins.actionItems && ins.actionItems.length > 0 && (
                            <div>
                              <div className="text-sm font-semibold text-slate-700 mb-2">Acciones recomendadas:</div>
                              <ul className="space-y-1">
                                {ins.actionItems.map((action, i) => (
                                  <li key={i} className="text-sm text-slate-600 flex items-start gap-2">
                                    <span className="text-indigo-500 mt-1">→</span>
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
              </div>
            )}

            {/* Recommendations */}
            {insight.recommendations.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                  <Target className="w-5 h-5 text-purple-600" />
                  Recomendaciones por Persona
                </h3>
                <div className="space-y-3">
                  {insight.recommendations.map((rec) => (
                    <div key={rec.id} className="p-4 bg-gradient-to-br from-purple-50 to-indigo-50 rounded-lg border border-purple-200">
                      <div className="flex items-start gap-3">
                        <Users className="w-5 h-5 text-purple-600 mt-1" />
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="font-semibold text-slate-900">{rec.personaName}</h4>
                            <Badge
                              variant={rec.priority === 'high' ? 'red' : rec.priority === 'medium' ? 'yellow' : 'gray'}
                              size="sm"
                            >
                              {rec.priority === 'high' ? 'Alta' : rec.priority === 'medium' ? 'Media' : 'Baja'} prioridad
                            </Badge>
                          </div>
                          <p className="text-sm text-slate-700 mb-2 font-semibold">{rec.recommendation}</p>
                          <p className="text-sm text-slate-600 mb-3">{rec.reason}</p>
                          <div className="flex flex-wrap gap-2">
                            <span className="text-xs font-semibold text-slate-600">Formatos sugeridos:</span>
                            {rec.suggestedContentTypes.map((format, i) => (
                              <Badge key={i} variant="blue" size="sm">
                                {format}
                              </Badge>
                            ))}
                            <span className="text-xs font-semibold text-slate-600 ml-2">Temas:</span>
                            {rec.suggestedTopics.map((topic, i) => (
                              <Badge key={i} variant="purple" size="sm">
                                {topic}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </Card>
  );
}

