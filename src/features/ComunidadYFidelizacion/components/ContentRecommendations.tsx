import { useState } from 'react';
import { MessageSquare, FileText, TrendingUp, Sparkles, Check, X, RefreshCw, AlertCircle } from 'lucide-react';
import { Card, Button, Badge, Tabs } from '../../../components/componentsreutilizables';
import {
  ContentRecommendationsConfig,
  FeedbackAnalysis,
  ContentRecommendation,
  CommunicationRecommendation,
  RecommendationPriority,
  RecommendationStatus,
} from '../types';
import { ContentRecommendationsAPI } from '../api/contentRecommendations';

interface ContentRecommendationsProps {
  config?: ContentRecommendationsConfig;
  feedbackAnalysis?: FeedbackAnalysis;
  contentRecommendations?: ContentRecommendation[];
  communicationRecommendations?: CommunicationRecommendation[];
  loading?: boolean;
  onRefresh?: () => void;
}

const PRIORITY_COLORS: Record<RecommendationPriority, string> = {
  high: 'red',
  medium: 'yellow',
  low: 'blue',
};

const STATUS_COLORS: Record<RecommendationStatus, string> = {
  pending: 'gray',
  accepted: 'green',
  rejected: 'red',
  implemented: 'blue',
  archived: 'gray',
};

export function ContentRecommendations({
  config,
  feedbackAnalysis,
  contentRecommendations = [],
  communicationRecommendations = [],
  loading: externalLoading = false,
  onRefresh,
}: ContentRecommendationsProps) {
  const [activeTab, setActiveTab] = useState<'analysis' | 'content' | 'communication' | 'config'>('analysis');
  const [loading, setLoading] = useState(false);

  const handleAnalyzeFeedback = async () => {
    setLoading(true);
    try {
      const analysis = await ContentRecommendationsAPI.analyzeFeedback('30d');
      console.log('Análisis de feedback:', analysis);
      if (onRefresh) onRefresh();
    } catch (error) {
      console.error('Error analizando feedback:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateContentRecommendations = async () => {
    if (!feedbackAnalysis) return;
    setLoading(true);
    try {
      const recommendations = await ContentRecommendationsAPI.generateContentRecommendations(feedbackAnalysis, 5);
      console.log('Recomendaciones de contenido generadas:', recommendations);
      if (onRefresh) onRefresh();
    } catch (error) {
      console.error('Error generando recomendaciones:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateCommunicationRecommendations = async () => {
    if (!feedbackAnalysis) return;
    setLoading(true);
    try {
      const recommendations = await ContentRecommendationsAPI.generateCommunicationRecommendations(feedbackAnalysis, 3);
      console.log('Recomendaciones de comunicación generadas:', recommendations);
      if (onRefresh) onRefresh();
    } catch (error) {
      console.error('Error generando recomendaciones:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptContentRecommendation = async (recommendationId: string) => {
    setLoading(true);
    try {
      await ContentRecommendationsAPI.acceptContentRecommendation(recommendationId);
      if (onRefresh) onRefresh();
    } catch (error) {
      console.error('Error aceptando recomendación:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRejectContentRecommendation = async (recommendationId: string, reason: string) => {
    setLoading(true);
    try {
      await ContentRecommendationsAPI.rejectContentRecommendation(recommendationId, reason);
      if (onRefresh) onRefresh();
    } catch (error) {
      console.error('Error rechazando recomendación:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptCommunicationRecommendation = async (recommendationId: string) => {
    setLoading(true);
    try {
      await ContentRecommendationsAPI.acceptCommunicationRecommendation(recommendationId);
      if (onRefresh) onRefresh();
    } catch (error) {
      console.error('Error aceptando recomendación:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRejectCommunicationRecommendation = async (recommendationId: string, reason: string) => {
    setLoading(true);
    try {
      await ContentRecommendationsAPI.rejectCommunicationRecommendation(recommendationId, reason);
      if (onRefresh) onRefresh();
    } catch (error) {
      console.error('Error rechazando recomendación:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-blue-100 to-purple-200 dark:from-blue-900/40 dark:to-purple-900/30 rounded-xl">
              <MessageSquare className="w-6 h-6 text-blue-600 dark:text-blue-300" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-slate-100">
                Recomendaciones de Contenido/Comunicaciones
              </h2>
              <p className="text-sm text-gray-600 dark:text-slate-400">
                Recomendaciones basadas en feedback reciente para iterar rápidamente
              </p>
            </div>
          </div>
          {config && (
            <Badge variant={config.enabled ? 'green' : 'gray'} size="md">
              {config.enabled ? 'Activo' : 'Inactivo'}
            </Badge>
          )}
        </div>

        {config && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <FileText className="w-5 h-5 text-blue-600 dark:text-blue-300" />
                <span className="text-sm font-medium text-gray-700 dark:text-slate-300">Recomendaciones Generadas</span>
              </div>
              <p className="text-2xl font-bold text-gray-900 dark:text-slate-100">
                {config.stats?.totalRecommendationsGenerated || 0}
              </p>
            </div>
            <div className="p-4 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Check className="w-5 h-5 text-green-600 dark:text-green-300" />
                <span className="text-sm font-medium text-gray-700 dark:text-slate-300">Aceptadas</span>
              </div>
              <p className="text-2xl font-bold text-gray-900 dark:text-slate-100">
                {config.stats?.totalRecommendationsAccepted || 0}
              </p>
            </div>
            <div className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-5 h-5 text-purple-600 dark:text-purple-300" />
                <span className="text-sm font-medium text-gray-700 dark:text-slate-300">Implementadas</span>
              </div>
              <p className="text-2xl font-bold text-gray-900 dark:text-slate-100">
                {config.stats?.totalRecommendationsImplemented || 0}
              </p>
            </div>
            <div className="p-4 bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-5 h-5 text-orange-600 dark:text-orange-300" />
                <span className="text-sm font-medium text-gray-700 dark:text-slate-300">Impacto Promedio</span>
              </div>
              <p className="text-2xl font-bold text-gray-900 dark:text-slate-100">
                {config.stats?.averageImpact || 0}%
              </p>
            </div>
          </div>
        )}

        <Tabs
          items={[
            { id: 'analysis', label: 'Análisis de Feedback', icon: <TrendingUp className="w-4 h-4" /> },
            { id: 'content', label: 'Recomendaciones de Contenido', icon: <FileText className="w-4 h-4" /> },
            { id: 'communication', label: 'Recomendaciones de Comunicación', icon: <MessageSquare className="w-4 h-4" /> },
            { id: 'config', label: 'Configuración', icon: <Sparkles className="w-4 h-4" /> },
          ]}
          activeTab={activeTab}
          onTabChange={(tabId) => setActiveTab(tabId as typeof activeTab)}
          variant="pills"
          size="sm"
        />

        {activeTab === 'analysis' && (
          <div className="mt-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-slate-100">Análisis de Feedback</h3>
              <Button
                variant="secondary"
                size="sm"
                onClick={handleAnalyzeFeedback}
                disabled={loading}
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Analizar Feedback
              </Button>
            </div>

            {feedbackAnalysis && (
              <div className="space-y-4">
                <Card className="p-4">
                  <h4 className="font-semibold text-gray-900 dark:text-slate-100 mb-3">Sentimiento General</h4>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                        {feedbackAnalysis.overallSentiment.positive}%
                      </p>
                      <p className="text-sm text-gray-600 dark:text-slate-400">Positivo</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-gray-600 dark:text-slate-400">
                        {feedbackAnalysis.overallSentiment.neutral}%
                      </p>
                      <p className="text-sm text-gray-600 dark:text-slate-400">Neutral</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                        {feedbackAnalysis.overallSentiment.negative}%
                      </p>
                      <p className="text-sm text-gray-600 dark:text-slate-400">Negativo</p>
                    </div>
                  </div>
                  <div className="mt-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700 dark:text-slate-300">Score General</span>
                      <span className="text-lg font-bold text-gray-900 dark:text-slate-100">
                        {feedbackAnalysis.overallSentiment.score}/100
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                      <div
                        className="bg-blue-600 h-3 rounded-full"
                        style={{ width: `${feedbackAnalysis.overallSentiment.score}%` }}
                      />
                    </div>
                  </div>
                </Card>

                <Card className="p-4">
                  <h4 className="font-semibold text-gray-900 dark:text-slate-100 mb-3">Temas Principales</h4>
                  <div className="space-y-3">
                    {feedbackAnalysis.keyTopics.map((topic, index) => (
                      <div key={index} className="flex items-start justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="font-semibold text-gray-900 dark:text-slate-100">{topic.topic}</span>
                            <Badge variant={topic.sentiment === 'positive' ? 'green' : topic.sentiment === 'negative' ? 'red' : 'gray'} size="sm">
                              {topic.sentiment}
                            </Badge>
                            <Badge variant={topic.impact === 'high' ? 'red' : topic.impact === 'medium' ? 'yellow' : 'blue'} size="sm">
                              {topic.impact}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600 dark:text-slate-400">
                            Frecuencia: {topic.frequency} menciones
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>

                <Card className="p-4">
                  <h4 className="font-semibold text-gray-900 dark:text-slate-100 mb-3">Insights de IA</h4>
                  <div className="space-y-3">
                    <div>
                      <h5 className="font-medium text-gray-900 dark:text-slate-100 mb-2">Tendencias</h5>
                      <ul className="list-disc list-inside text-sm text-gray-600 dark:text-slate-400 space-y-1">
                        {feedbackAnalysis.aiInsights.trends.map((trend, index) => (
                          <li key={index}>{trend}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h5 className="font-medium text-gray-900 dark:text-slate-100 mb-2">Oportunidades</h5>
                      <ul className="list-disc list-inside text-sm text-gray-600 dark:text-slate-400 space-y-1">
                        {feedbackAnalysis.aiInsights.opportunities.map((opportunity, index) => (
                          <li key={index}>{opportunity}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h5 className="font-medium text-gray-900 dark:text-slate-100 mb-2">Riesgos</h5>
                      <ul className="list-disc list-inside text-sm text-gray-600 dark:text-slate-400 space-y-1">
                        {feedbackAnalysis.aiInsights.risks.map((risk, index) => (
                          <li key={index}>{risk}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </Card>
              </div>
            )}
          </div>
        )}

        {activeTab === 'content' && (
          <div className="mt-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-slate-100">
                Recomendaciones de Contenido
              </h3>
              <Button
                variant="secondary"
                size="sm"
                onClick={handleGenerateContentRecommendations}
                disabled={loading || !feedbackAnalysis}
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Generar con IA
              </Button>
            </div>

            <div className="space-y-4">
              {contentRecommendations.map((recommendation) => (
                <Card key={recommendation.id} className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-semibold text-gray-900 dark:text-slate-100">{recommendation.title}</h4>
                        <Badge variant={PRIORITY_COLORS[recommendation.priority] as any} size="sm">
                          {recommendation.priority}
                        </Badge>
                        <Badge variant={STATUS_COLORS[recommendation.status] as any} size="sm">
                          {recommendation.status}
                        </Badge>
                        {recommendation.aiGenerated && (
                          <Badge variant="purple" size="sm">
                            <Sparkles className="w-3 h-3 mr-1" />
                            IA
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 dark:text-slate-400 mb-3">{recommendation.description}</p>
                      <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg mb-3">
                        <p className="text-sm font-medium text-gray-900 dark:text-slate-100 mb-2">
                          {recommendation.recommendation.suggestedTitle}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-slate-400">
                          {recommendation.recommendation.suggestedContent}
                        </p>
                        {recommendation.recommendation.suggestedCTA && (
                          <p className="text-sm font-medium text-blue-600 dark:text-blue-400 mt-2">
                            CTA: {recommendation.recommendation.suggestedCTA}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center gap-2 mb-3">
                        <Badge variant="blue" size="sm">
                          {recommendation.recommendation.contentType}
                        </Badge>
                        {recommendation.recommendation.platform && (
                          <Badge variant="purple" size="sm">
                            {recommendation.recommendation.platform}
                          </Badge>
                        )}
                      </div>
                      <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                        <p className="text-sm font-medium text-gray-900 dark:text-slate-100 mb-2">Impacto Esperado</p>
                        <p className="text-sm text-gray-600 dark:text-slate-400">
                          {recommendation.expectedImpact.description}
                        </p>
                        {recommendation.expectedImpact.engagement && (
                          <div className="mt-2 flex items-center gap-4 text-sm">
                            <span className="text-gray-600 dark:text-slate-400">
                              Engagement: <span className="font-semibold">{recommendation.expectedImpact.engagement}%</span>
                            </span>
                            {recommendation.expectedImpact.satisfaction && (
                              <span className="text-gray-600 dark:text-slate-400">
                                Satisfacción: <span className="font-semibold">{recommendation.expectedImpact.satisfaction}%</span>
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  {recommendation.status === 'pending' && (
                    <div className="flex items-center gap-2 mt-4">
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => handleAcceptContentRecommendation(recommendation.id)}
                        disabled={loading}
                      >
                        <Check className="w-4 h-4 mr-2" />
                        Aceptar
                      </Button>
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => handleRejectContentRecommendation(recommendation.id, 'No es relevante')}
                        disabled={loading}
                      >
                        <X className="w-4 h-4 mr-2" />
                        Rechazar
                      </Button>
                    </div>
                  )}
                </Card>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'communication' && (
          <div className="mt-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-slate-100">
                Recomendaciones de Comunicación
              </h3>
              <Button
                variant="secondary"
                size="sm"
                onClick={handleGenerateCommunicationRecommendations}
                disabled={loading || !feedbackAnalysis}
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Generar con IA
              </Button>
            </div>

            <div className="space-y-4">
              {communicationRecommendations.map((recommendation) => (
                <Card key={recommendation.id} className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-semibold text-gray-900 dark:text-slate-100">{recommendation.title}</h4>
                        <Badge variant={PRIORITY_COLORS[recommendation.priority] as any} size="sm">
                          {recommendation.priority}
                        </Badge>
                        <Badge variant={STATUS_COLORS[recommendation.status] as any} size="sm">
                          {recommendation.status}
                        </Badge>
                        {recommendation.aiGenerated && (
                          <Badge variant="purple" size="sm">
                            <Sparkles className="w-3 h-3 mr-1" />
                            IA
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 dark:text-slate-400 mb-3">{recommendation.description}</p>
                      <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg mb-3">
                        {recommendation.recommendation.subject && (
                          <p className="text-sm font-medium text-gray-900 dark:text-slate-100 mb-2">
                            Asunto: {recommendation.recommendation.subject}
                          </p>
                        )}
                        <p className="text-sm text-gray-600 dark:text-slate-400">
                          {recommendation.recommendation.message}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge variant="blue" size="sm">
                            {recommendation.recommendation.communicationType}
                          </Badge>
                          <Badge variant="purple" size="sm">
                            {recommendation.recommendation.tone}
                          </Badge>
                        </div>
                      </div>
                      <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                        <p className="text-sm font-medium text-gray-900 dark:text-slate-100 mb-2">Impacto Esperado</p>
                        <p className="text-sm text-gray-600 dark:text-slate-400">
                          {recommendation.expectedImpact.description}
                        </p>
                        {recommendation.expectedImpact.responseRate && (
                          <div className="mt-2 flex items-center gap-4 text-sm">
                            <span className="text-gray-600 dark:text-slate-400">
                              Tasa de Respuesta: <span className="font-semibold">{recommendation.expectedImpact.responseRate}%</span>
                            </span>
                            {recommendation.expectedImpact.satisfaction && (
                              <span className="text-gray-600 dark:text-slate-400">
                                Satisfacción: <span className="font-semibold">{recommendation.expectedImpact.satisfaction}%</span>
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  {recommendation.status === 'pending' && (
                    <div className="flex items-center gap-2 mt-4">
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => handleAcceptCommunicationRecommendation(recommendation.id)}
                        disabled={loading}
                      >
                        <Check className="w-4 h-4 mr-2" />
                        Aceptar
                      </Button>
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => handleRejectCommunicationRecommendation(recommendation.id, 'No es relevante')}
                        disabled={loading}
                      >
                        <X className="w-4 h-4 mr-2" />
                        Rechazar
                      </Button>
                    </div>
                  )}
                </Card>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'config' && config && (
          <div className="mt-6 space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-slate-100">Configuración</h3>
            <Card className="p-4">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                    Análisis de Feedback
                  </label>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={config.feedbackAnalysis?.enabled}
                        readOnly
                        className="rounded"
                      />
                      <span className="text-sm text-gray-600 dark:text-slate-400">Habilitar análisis</span>
                    </label>
                    <p className="text-sm text-gray-600 dark:text-slate-400">
                      Frecuencia: {config.feedbackAnalysis?.frequency}
                    </p>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                    Recomendaciones de Contenido
                  </label>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={config.contentRecommendations?.enabled}
                        readOnly
                        className="rounded"
                      />
                      <span className="text-sm text-gray-600 dark:text-slate-400">Habilitar recomendaciones</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={config.contentRecommendations?.autoGenerate}
                        readOnly
                        className="rounded"
                      />
                      <span className="text-sm text-gray-600 dark:text-slate-400">Generar automáticamente</span>
                    </label>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                    Recomendaciones de Comunicación
                  </label>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={config.communicationRecommendations?.enabled}
                        readOnly
                        className="rounded"
                      />
                      <span className="text-sm text-gray-600 dark:text-slate-400">Habilitar recomendaciones</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={config.communicationRecommendations?.autoGenerate}
                        readOnly
                        className="rounded"
                      />
                      <span className="text-sm text-gray-600 dark:text-slate-400">Generar automáticamente</span>
                    </label>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        )}
      </Card>
    </div>
  );
}

