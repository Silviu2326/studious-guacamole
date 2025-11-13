import React, { useState, useMemo } from 'react';
import {
  Badge,
  Button,
  Card,
  Modal,
} from '../../../components/componentsreutilizables';
import {
  Sparkles,
  TrendingUp,
  Repeat,
  Copy,
  Edit,
  BarChart3,
  Award,
  ArrowRight,
  CheckCircle,
  XCircle,
  Clock,
  Users,
  Target,
  Mail,
  MessageCircle,
  Send,
  Calendar,
  Lightbulb,
  Zap,
} from 'lucide-react';
import type {
  CampaignRecommendation,
  CampaignSuccessMetrics,
  SuccessfulCampaignsRecommenderDashboard,
  CampaignSuccessMetric,
  MessagingChannel,
  CampaignObjective,
} from '../types';

interface SuccessfulCampaignsRecommenderProps {
  dashboard: SuccessfulCampaignsRecommenderDashboard | undefined;
  loading?: boolean;
  className?: string;
  onRecommendationAccept: (recommendationId: string) => void;
  onRecommendationReject: (recommendationId: string) => void;
  onRecommendationClone: (recommendationId: string) => void;
  onRecommendationRepeat: (recommendationId: string) => void;
  onRecommendationAdapt: (recommendationId: string, changes: any) => void;
  onRecommendationView: (recommendation: CampaignRecommendation) => void;
  onViewCampaignDetails: (campaignId: string) => void;
}

const priorityColors: Record<string, string> = {
  high: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
  medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
  low: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
};

const impactColors: Record<string, string> = {
  high: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
  medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
  low: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
};

const recommendationTypeLabels: Record<string, string> = {
  repeat: 'Repetir',
  clone: 'Clonar',
  adapt: 'Adaptar',
};

const recommendationTypeIcons: Record<string, React.ReactNode> = {
  repeat: <Repeat className="w-4 h-4" />,
  clone: <Copy className="w-4 h-4" />,
  adapt: <Edit className="w-4 h-4" />,
};

const channelIcons: Record<MessagingChannel, React.ReactNode> = {
  email: <Mail className="w-4 h-4" />,
  whatsapp: <MessageCircle className="w-4 h-4" />,
  sms: <Send className="w-4 h-4" />,
  push: <Send className="w-4 h-4" />,
  'in-app': <Target className="w-4 h-4" />,
};

const objectiveLabels: Record<CampaignObjective, string> = {
  captar: 'Captar',
  reactivar: 'Reactivar',
  fidelizar: 'Fidelizar',
};

const metricLabels: Record<CampaignSuccessMetric, string> = {
  'conversion-rate': 'Tasa de conversión',
  'open-rate': 'Tasa de apertura',
  'reply-rate': 'Tasa de respuesta',
  'revenue-generated': 'Ingresos generados',
  'booking-rate': 'Tasa de reservas',
  'engagement-score': 'Puntuación de engagement',
  roi: 'ROI',
};

export const SuccessfulCampaignsRecommender: React.FC<SuccessfulCampaignsRecommenderProps> = ({
  dashboard,
  loading = false,
  className = '',
  onRecommendationAccept,
  onRecommendationReject,
  onRecommendationClone,
  onRecommendationRepeat,
  onRecommendationAdapt,
  onRecommendationView,
  onViewCampaignDetails,
}) => {
  const [selectedRecommendation, setSelectedRecommendation] = useState<CampaignRecommendation | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isActionModalOpen, setIsActionModalOpen] = useState(false);
  const [actionType, setActionType] = useState<'accept' | 'reject' | 'clone' | 'repeat' | 'adapt'>('accept');

  const recommendations = useMemo(
    () => dashboard?.recommendations || [],
    [dashboard]
  );

  const sortedRecommendations = useMemo(() => {
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    return [...recommendations]
      .filter((rec) => rec.status === 'pending')
      .sort((a, b) => {
        if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
          return priorityOrder[a.priority] - priorityOrder[b.priority];
        }
        return b.confidence - a.confidence;
      });
  }, [recommendations]);

  const topSuccessfulCampaigns = useMemo(
    () => dashboard?.topSuccessfulCampaigns || [],
    [dashboard]
  );

  const handleViewDetails = (recommendation: CampaignRecommendation) => {
    setSelectedRecommendation(recommendation);
    setIsDetailsModalOpen(true);
    onRecommendationView(recommendation);
  };

  const handleAccept = (recommendation: CampaignRecommendation) => {
    setSelectedRecommendation(recommendation);
    setActionType('accept');
    setIsActionModalOpen(true);
  };

  const handleReject = (recommendation: CampaignRecommendation) => {
    setSelectedRecommendation(recommendation);
    setActionType('reject');
    setIsActionModalOpen(true);
  };

  const handleClone = (recommendation: CampaignRecommendation) => {
    onRecommendationClone(recommendation.id);
  };

  const handleRepeat = (recommendation: CampaignRecommendation) => {
    onRecommendationRepeat(recommendation.id);
  };

  const handleAdapt = (recommendation: CampaignRecommendation) => {
    setSelectedRecommendation(recommendation);
    setActionType('adapt');
    setIsActionModalOpen(true);
  };

  const handleSubmitAction = () => {
    if (!selectedRecommendation) return;

    if (actionType === 'accept') {
      onRecommendationAccept(selectedRecommendation.id);
    } else if (actionType === 'reject') {
      onRecommendationReject(selectedRecommendation.id);
    } else if (actionType === 'adapt') {
      onRecommendationAdapt(selectedRecommendation.id, selectedRecommendation.suggestedChanges || {});
    }

    setIsActionModalOpen(false);
    setSelectedRecommendation(null);
  };

  const formatMetric = (metric: CampaignSuccessMetric, value: number): string => {
    switch (metric) {
      case 'conversion-rate':
      case 'open-rate':
      case 'reply-rate':
      case 'booking-rate':
        return `${value.toFixed(1)}%`;
      case 'revenue-generated':
        return new Intl.NumberFormat('es-ES', {
          style: 'currency',
          currency: 'EUR',
        }).format(value);
      case 'engagement-score':
        return `${value.toFixed(0)}/100`;
      case 'roi':
        return `${value.toFixed(1)}x`;
      default:
        return value.toString();
    }
  };

  const getSuccessScoreColor = (score: number): string => {
    if (score >= 80) return 'text-green-600 dark:text-green-400';
    if (score >= 60) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-blue-600 dark:text-blue-400';
  };

  if (loading) {
    return (
      <Card className={className} padding="lg">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        </div>
      </Card>
    );
  }

  if (!dashboard) {
    return (
      <Card className={className} padding="lg">
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <Sparkles className="w-12 h-12 text-slate-400 mb-4" />
          <p className="text-slate-600 dark:text-slate-400 font-medium">
            No hay datos de recomendaciones disponibles
          </p>
        </div>
      </Card>
    );
  }

  return (
    <div className={className}>
      {/* Header */}
      <Card className="mb-6" padding="lg">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/30">
              <Sparkles className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
                Recomendaciones de Campañas Exitosas
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                El sistema aprende de tus campañas más exitosas y recomienda repetirlas
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <Badge variant="purple" size="sm">
              {dashboard.totalRecommendations} recomendaciones
            </Badge>
            {dashboard.learningProgress.improvementTrend === 'up' && (
              <Badge variant="green" size="sm">
                <TrendingUp className="w-3 h-3 mr-1" />
                Mejora {dashboard.learningProgress.improvementPercentage.toFixed(1)}%
              </Badge>
            )}
          </div>
        </div>
      </Card>

      {/* Learning Progress */}
      <Card className="mb-6" padding="lg">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
              {dashboard.learningProgress.totalCampaignsAnalyzed}
            </p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Campañas analizadas</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600 dark:text-green-400">
              {dashboard.learningProgress.successfulCampaignsIdentified}
            </p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Campañas exitosas</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
              {dashboard.learningProgress.recommendationsGenerated}
            </p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Recomendaciones</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
              {dashboard.learningProgress.recommendationsAccepted}
            </p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Aceptadas</p>
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Puntuación promedio de éxito
              </p>
              <p className={`text-2xl font-bold ${getSuccessScoreColor(dashboard.learningProgress.averageSuccessScore)}`}>
                {dashboard.learningProgress.averageSuccessScore.toFixed(1)}/100
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Tendencia de mejora
              </p>
              <div className="flex items-center gap-1">
                {dashboard.learningProgress.improvementTrend === 'up' ? (
                  <>
                    <TrendingUp className="w-4 h-4 text-green-600 dark:text-green-400" />
                    <span className="text-green-600 dark:text-green-400 font-semibold">
                      +{dashboard.learningProgress.improvementPercentage.toFixed(1)}%
                    </span>
                  </>
                ) : dashboard.learningProgress.improvementTrend === 'down' ? (
                  <>
                    <TrendingUp className="w-4 h-4 text-red-600 dark:text-red-400 rotate-180" />
                    <span className="text-red-600 dark:text-red-400 font-semibold">
                      {dashboard.learningProgress.improvementPercentage.toFixed(1)}%
                    </span>
                  </>
                ) : (
                  <span className="text-slate-600 dark:text-slate-400 font-semibold">
                    {dashboard.learningProgress.improvementPercentage.toFixed(1)}%
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Recommendations */}
      <div className="space-y-4 mb-6">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
          Recomendaciones pendientes ({sortedRecommendations.length})
        </h3>
        {sortedRecommendations.length === 0 ? (
          <Card padding="lg">
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <CheckCircle className="w-12 h-12 text-green-400 mb-4" />
              <p className="text-slate-600 dark:text-slate-400 font-medium">
                No hay recomendaciones pendientes
              </p>
              <p className="text-sm text-slate-500 dark:text-slate-500 mt-2">
                Todas las recomendaciones han sido procesadas
              </p>
            </div>
          </Card>
        ) : (
          sortedRecommendations.map((recommendation) => (
            <Card key={recommendation.id} className="overflow-hidden" padding="none">
              <div className="p-4 space-y-4">
                {/* Header */}
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex items-center gap-1.5">
                        {recommendationTypeIcons[recommendation.recommendationType]}
                        <Badge variant="purple" size="sm">
                          {recommendationTypeLabels[recommendation.recommendationType]}
                        </Badge>
                      </div>
                      <Badge className={priorityColors[recommendation.priority]} size="sm">
                        {recommendation.priority}
                      </Badge>
                      <Badge className={impactColors[recommendation.expectedImpact.impact]} size="sm">
                        Impacto: {recommendation.expectedImpact.impact}
                      </Badge>
                    </div>
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-1">
                      {recommendation.campaignName}
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      {recommendation.recommendationReason}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="text-right">
                      <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                        Confianza
                      </p>
                      <p className="text-lg font-bold text-indigo-600 dark:text-indigo-400">
                        {recommendation.confidence}%
                      </p>
                    </div>
                  </div>
                </div>

                {/* Success Metrics */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                  <div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Puntuación de éxito</p>
                    <p className={`text-lg font-bold ${getSuccessScoreColor(recommendation.successMetrics.successScore)}`}>
                      {recommendation.successMetrics.successScore.toFixed(0)}/100
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Tasa de conversión</p>
                    <p className="text-lg font-bold text-slate-900 dark:text-slate-100">
                      {recommendation.successMetrics.metrics.conversionRate.toFixed(1)}%
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Ingresos generados</p>
                    <p className="text-lg font-bold text-green-600 dark:text-green-400">
                      {new Intl.NumberFormat('es-ES', {
                        style: 'currency',
                        currency: 'EUR',
                        notation: 'compact',
                      }).format(recommendation.successMetrics.metrics.revenueGenerated)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">ROI</p>
                    <p className="text-lg font-bold text-purple-600 dark:text-purple-400">
                      {recommendation.successMetrics.metrics.roi.toFixed(1)}x
                    </p>
                  </div>
                </div>

                {/* Expected Impact */}
                <div className="flex items-center gap-2 p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg">
                  <Lightbulb className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                      Impacto esperado en {metricLabels[recommendation.expectedImpact.metric]}:
                    </p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      {formatMetric(recommendation.expectedImpact.metric, recommendation.expectedImpact.currentValue)} →{' '}
                      {formatMetric(recommendation.expectedImpact.metric, recommendation.expectedImpact.expectedValue)} (
                      +{recommendation.expectedImpact.improvementPercentage.toFixed(1)}%)
                    </p>
                  </div>
                </div>

                {/* Channels & Objective */}
                <div className="flex flex-wrap items-center gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Target className="w-4 h-4 text-slate-400" />
                    <span className="text-slate-600 dark:text-slate-400">
                      {objectiveLabels[recommendation.successMetrics.objective]}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-slate-400" />
                    <span className="text-slate-600 dark:text-slate-400">
                      {recommendation.successMetrics.targetAudience.clientCount.toLocaleString()} destinatarios
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {recommendation.successMetrics.channels.map((channel) => (
                      <div
                        key={channel}
                        className="flex items-center gap-1 px-2 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                      >
                        {channelIcons[channel]}
                        <span className="text-xs capitalize">{channel}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-200 dark:border-slate-700">
                  <Button
                    variant="secondary"
                    size="sm"
                    leftIcon={<BarChart3 className="w-4 h-4" />}
                    onClick={() => handleViewDetails(recommendation)}
                    className="flex-1 sm:flex-initial"
                  >
                    Ver detalles
                  </Button>
                  {recommendation.recommendationType === 'repeat' && (
                    <Button
                      variant="success"
                      size="sm"
                      leftIcon={<Repeat className="w-4 h-4" />}
                      onClick={() => handleRepeat(recommendation)}
                      className="flex-1 sm:flex-initial"
                    >
                      Repetir
                    </Button>
                  )}
                  {recommendation.recommendationType === 'clone' && (
                    <Button
                      variant="primary"
                      size="sm"
                      leftIcon={<Copy className="w-4 h-4" />}
                      onClick={() => handleClone(recommendation)}
                      className="flex-1 sm:flex-initial"
                    >
                      Clonar
                    </Button>
                  )}
                  {recommendation.recommendationType === 'adapt' && (
                    <Button
                      variant="warning"
                      size="sm"
                      leftIcon={<Edit className="w-4 h-4" />}
                      onClick={() => handleAdapt(recommendation)}
                      className="flex-1 sm:flex-initial"
                    >
                      Adaptar
                    </Button>
                  )}
                  <Button
                    variant="success"
                    size="sm"
                    leftIcon={<CheckCircle className="w-4 h-4" />}
                    onClick={() => handleAccept(recommendation)}
                    className="flex-1 sm:flex-initial"
                  >
                    Aceptar
                  </Button>
                  <Button
                    variant="error"
                    size="sm"
                    leftIcon={<XCircle className="w-4 h-4" />}
                    onClick={() => handleReject(recommendation)}
                    className="flex-1 sm:flex-initial"
                  >
                    Rechazar
                  </Button>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Top Successful Campaigns */}
      {topSuccessfulCampaigns.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
            Campañas más exitosas
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {topSuccessfulCampaigns.slice(0, 6).map((campaign) => (
              <Card
                key={campaign.campaignId}
                className="cursor-pointer hover:shadow-lg transition-shadow"
                padding="lg"
                onClick={() => onViewCampaignDetails(campaign.campaignId)}
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="text-base font-semibold text-slate-900 dark:text-slate-100 line-clamp-2">
                      {campaign.campaignName}
                    </h4>
                    <Award className="w-5 h-5 text-yellow-500 flex-shrink-0" />
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="purple" size="sm">
                      {objectiveLabels[campaign.objective]}
                    </Badge>
                    <Badge className={getSuccessScoreColor(campaign.successScore)} size="sm">
                      {campaign.successScore.toFixed(0)}/100
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Conversión</p>
                      <p className="font-semibold text-slate-900 dark:text-slate-100">
                        {campaign.metrics.conversionRate.toFixed(1)}%
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Ingresos</p>
                      <p className="font-semibold text-green-600 dark:text-green-400">
                        {new Intl.NumberFormat('es-ES', {
                          style: 'currency',
                          currency: 'EUR',
                          notation: 'compact',
                        }).format(campaign.metrics.revenueGenerated)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 pt-2 border-t border-slate-200 dark:border-slate-700">
                    {campaign.channels.map((channel) => (
                      <div
                        key={channel}
                        className="flex items-center gap-1 text-slate-600 dark:text-slate-400"
                      >
                        {channelIcons[channel]}
                      </div>
                    ))}
                    <span className="text-xs text-slate-500 dark:text-slate-400 ml-auto">
                      {new Date(campaign.completedAt).toLocaleDateString('es-ES')}
                    </span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Details Modal */}
      {selectedRecommendation && (
        <Modal
          isOpen={isDetailsModalOpen}
          onClose={() => {
            setIsDetailsModalOpen(false);
            setSelectedRecommendation(null);
          }}
          title={`Detalles: ${selectedRecommendation.campaignName}`}
          size="lg"
        >
          <div className="space-y-6 max-h-[70vh] overflow-y-auto">
            {/* Recommendation Info */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Badge variant="purple" size="sm">
                  {recommendationTypeLabels[selectedRecommendation.recommendationType]}
                </Badge>
                <Badge className={priorityColors[selectedRecommendation.priority]} size="sm">
                  {selectedRecommendation.priority}
                </Badge>
                <Badge className={impactColors[selectedRecommendation.expectedImpact.impact]} size="sm">
                  Impacto: {selectedRecommendation.expectedImpact.impact}
                </Badge>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Razón de la recomendación:
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  {selectedRecommendation.recommendationReason}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Confianza: {selectedRecommendation.confidence}%
                </p>
              </div>
            </div>

            {/* Success Metrics */}
            <div className="space-y-3">
              <h4 className="text-base font-semibold text-slate-900 dark:text-slate-100">
                Métricas de éxito
              </h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Puntuación de éxito</p>
                  <p className={`text-2xl font-bold ${getSuccessScoreColor(selectedRecommendation.successMetrics.successScore)}`}>
                    {selectedRecommendation.successMetrics.successScore.toFixed(0)}/100
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Tasa de conversión</p>
                  <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                    {selectedRecommendation.successMetrics.metrics.conversionRate.toFixed(1)}%
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Tasa de apertura</p>
                  <p className="text-xl font-bold text-slate-900 dark:text-slate-100">
                    {selectedRecommendation.successMetrics.metrics.openRate.toFixed(1)}%
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Tasa de respuesta</p>
                  <p className="text-xl font-bold text-slate-900 dark:text-slate-100">
                    {selectedRecommendation.successMetrics.metrics.replyRate.toFixed(1)}%
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Ingresos generados</p>
                  <p className="text-xl font-bold text-green-600 dark:text-green-400">
                    {new Intl.NumberFormat('es-ES', {
                      style: 'currency',
                      currency: 'EUR',
                    }).format(selectedRecommendation.successMetrics.metrics.revenueGenerated)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">ROI</p>
                  <p className="text-xl font-bold text-purple-600 dark:text-purple-400">
                    {selectedRecommendation.successMetrics.metrics.roi.toFixed(1)}x
                  </p>
                </div>
              </div>
            </div>

            {/* Expected Impact */}
            <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg">
              <h4 className="text-base font-semibold text-slate-900 dark:text-slate-100 mb-2">
                Impacto esperado
              </h4>
              <p className="text-sm text-slate-700 dark:text-slate-300 mb-2">
                {metricLabels[selectedRecommendation.expectedImpact.metric]}:
              </p>
              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-600 dark:text-slate-400">
                  {formatMetric(selectedRecommendation.expectedImpact.metric, selectedRecommendation.expectedImpact.currentValue)}
                </span>
                <ArrowRight className="w-4 h-4 text-slate-400" />
                <span className="text-sm font-semibold text-green-600 dark:text-green-400">
                  {formatMetric(selectedRecommendation.expectedImpact.metric, selectedRecommendation.expectedImpact.expectedValue)}
                </span>
                <span className="text-sm font-semibold text-indigo-600 dark:text-indigo-400">
                  (+{selectedRecommendation.expectedImpact.improvementPercentage.toFixed(1)}%)
                </span>
              </div>
            </div>

            {/* Success Factors */}
            {selectedRecommendation.successMetrics.successFactors.length > 0 && (
              <div>
                <h4 className="text-base font-semibold text-slate-900 dark:text-slate-100 mb-2">
                  Factores de éxito
                </h4>
                <div className="flex flex-wrap gap-2">
                  {selectedRecommendation.successMetrics.successFactors.map((factor, index) => (
                    <Badge key={index} variant="green" size="sm">
                      {factor}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Suggested Changes */}
            {selectedRecommendation.recommendationType === 'adapt' && selectedRecommendation.suggestedChanges && (
              <div>
                <h4 className="text-base font-semibold text-slate-900 dark:text-slate-100 mb-2">
                  Cambios sugeridos
                </h4>
                <div className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                  {selectedRecommendation.suggestedChanges.targetAudience && (
                    <p>
                      <span className="font-medium">Audiencia:</span>{' '}
                      {selectedRecommendation.suggestedChanges.targetAudience.segmentName ||
                        selectedRecommendation.suggestedChanges.targetAudience.type}
                    </p>
                  )}
                  {selectedRecommendation.suggestedChanges.channels && (
                    <p>
                      <span className="font-medium">Canales:</span>{' '}
                      {selectedRecommendation.suggestedChanges.channels.join(', ')}
                    </p>
                  )}
                  {selectedRecommendation.suggestedChanges.scheduling && (
                    <p>
                      <span className="font-medium">Programación:</span>{' '}
                      {selectedRecommendation.suggestedChanges.scheduling.startDate
                        ? new Date(selectedRecommendation.suggestedChanges.scheduling.startDate).toLocaleDateString('es-ES')
                        : 'No especificada'}
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        </Modal>
      )}

      {/* Action Modal */}
      {selectedRecommendation && (
        <Modal
          isOpen={isActionModalOpen}
          onClose={() => {
            setIsActionModalOpen(false);
            setSelectedRecommendation(null);
          }}
          title={
            actionType === 'accept'
              ? 'Aceptar recomendación'
              : actionType === 'reject'
              ? 'Rechazar recomendación'
              : 'Adaptar campaña'
          }
          size="md"
        >
          <div className="space-y-4">
            <p className="text-sm text-slate-600 dark:text-slate-400">
              {actionType === 'accept' &&
                `¿Estás seguro de que deseas aceptar la recomendación de "${selectedRecommendation.campaignName}"?`}
              {actionType === 'reject' &&
                `¿Estás seguro de que deseas rechazar la recomendación de "${selectedRecommendation.campaignName}"?`}
              {actionType === 'adapt' &&
                `¿Deseas adaptar la campaña "${selectedRecommendation.campaignName}" con los cambios sugeridos?`}
            </p>

            {actionType === 'adapt' && selectedRecommendation.suggestedChanges && (
              <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                <h5 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Cambios sugeridos:
                </h5>
                <ul className="text-sm text-slate-600 dark:text-slate-400 space-y-1">
                  {selectedRecommendation.suggestedChanges.targetAudience && (
                    <li>• Audiencia: {selectedRecommendation.suggestedChanges.targetAudience.segmentName || selectedRecommendation.suggestedChanges.targetAudience.type}</li>
                  )}
                  {selectedRecommendation.suggestedChanges.channels && (
                    <li>• Canales: {selectedRecommendation.suggestedChanges.channels.join(', ')}</li>
                  )}
                  {selectedRecommendation.suggestedChanges.scheduling && (
                    <li>• Programación: {selectedRecommendation.suggestedChanges.scheduling.startDate
                      ? new Date(selectedRecommendation.suggestedChanges.scheduling.startDate).toLocaleDateString('es-ES')
                      : 'No especificada'}</li>
                  )}
                </ul>
              </div>
            )}

            <div className="flex flex-wrap gap-2 pt-4 border-t border-slate-200 dark:border-slate-700">
              <Button
                variant="secondary"
                onClick={() => {
                  setIsActionModalOpen(false);
                  setSelectedRecommendation(null);
                }}
                className="flex-1 sm:flex-initial"
              >
                Cancelar
              </Button>
              <Button
                variant={actionType === 'accept' ? 'success' : actionType === 'reject' ? 'error' : 'warning'}
                onClick={handleSubmitAction}
                className="flex-1 sm:flex-initial"
              >
                {actionType === 'accept' ? 'Aceptar' : actionType === 'reject' ? 'Rechazar' : 'Adaptar'}
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

