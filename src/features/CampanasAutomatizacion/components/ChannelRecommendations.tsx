import React, { useState } from 'react';
import { Badge, Card, Button } from '../../../components/componentsreutilizables';
import {
  ArrowRight,
  CheckCircle,
  Clock,
  MessageSquare,
  Sparkles,
  TrendingUp,
  Users,
  X,
  Zap,
  Filter,
  Bot,
  Phone,
  Bell,
  Mail,
  Smartphone,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  Rocket,
} from 'lucide-react';
import { ds } from '../../adherencia/ui/ds';
import {
  ChannelRecommendationsDashboard,
  ChannelRecommendation,
  ChannelRecommendationType,
  ChannelRecommendationReason,
  ChannelRecommendationPriority,
} from '../types';
import { CampanasAutomatizacionService } from '../services/campanasAutomatizacionService';

interface ChannelRecommendationsProps {
  dashboard: ChannelRecommendationsDashboard;
  loading?: boolean;
  className?: string;
  onRecommendationAccept?: (recommendationId: string) => void;
  onRecommendationReject?: (recommendationId: string) => void;
  onRecommendationDismiss?: (recommendationId: string) => void;
  onViewRecommendation?: (recommendation: ChannelRecommendation) => void;
  onStartImplementation?: (recommendationId: string) => void;
  onSettingsEdit?: () => void;
}

const channelIcons: Record<ChannelRecommendationType, React.ReactNode> = {
  sms: <Smartphone className="w-5 h-5" />,
  bot: <Bot className="w-5 h-5" />,
  push: <Bell className="w-5 h-5" />,
  'in-app': <MessageSquare className="w-5 h-5" />,
  voice: <Phone className="w-5 h-5" />,
};

const channelColors: Record<ChannelRecommendationType, string> = {
  sms: 'from-purple-500 to-pink-500',
  bot: 'from-blue-500 to-indigo-500',
  push: 'from-sky-500 to-cyan-500',
  'in-app': 'from-orange-500 to-amber-500',
  voice: 'from-emerald-500 to-teal-500',
};

const priorityColors: Record<ChannelRecommendationPriority, { bg: string; text: string; border: string }> = {
  high: {
    bg: 'bg-red-50 dark:bg-red-900/20',
    text: 'text-red-600 dark:text-red-400',
    border: 'border-red-200 dark:border-red-800',
  },
  medium: {
    bg: 'bg-amber-50 dark:bg-amber-900/20',
    text: 'text-amber-600 dark:text-amber-400',
    border: 'border-amber-200 dark:border-amber-800',
  },
  low: {
    bg: 'bg-blue-50 dark:bg-blue-900/20',
    text: 'text-blue-600 dark:text-blue-400',
    border: 'border-blue-200 dark:border-blue-800',
  },
};

const reasonLabels: Record<ChannelRecommendationReason, string> = {
  saturation: 'Saturación',
  'low-engagement': 'Bajo engagement',
  'high-potential': 'Alto potencial',
  complementary: 'Complementario',
  'cost-effective': 'Coste-efectivo',
  'better-reach': 'Mayor alcance',
};

const difficultyLabels: Record<'easy' | 'medium' | 'hard', string> = {
  easy: 'Fácil',
  medium: 'Media',
  hard: 'Difícil',
};

export const ChannelRecommendations: React.FC<ChannelRecommendationsProps> = ({
  dashboard,
  loading = false,
  className = '',
  onRecommendationAccept,
  onRecommendationReject,
  onRecommendationDismiss,
  onViewRecommendation,
  onStartImplementation,
  onSettingsEdit,
}) => {
  const [selectedPriority, setSelectedPriority] = useState<ChannelRecommendationPriority | 'all'>('all');
  const [selectedChannel, setSelectedChannel] = useState<ChannelRecommendationType | 'all'>('all');
  const [expandedRecommendations, setExpandedRecommendations] = useState<Set<string>>(new Set());

  if (loading && dashboard.recommendations.length === 0) {
    return (
      <Card className={className}>
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className={`${ds.shimmer} h-32`} />
          ))}
        </div>
      </Card>
    );
  }

  const toggleRecommendationExpansion = (recommendationId: string) => {
    setExpandedRecommendations((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(recommendationId)) {
        newSet.delete(recommendationId);
      } else {
        newSet.add(recommendationId);
      }
      return newSet;
    });
  };

  const filteredRecommendations = dashboard.recommendations.filter((rec) => {
    if (selectedPriority !== 'all' && rec.priority !== selectedPriority) return false;
    if (selectedChannel !== 'all' && rec.recommendedChannel !== selectedChannel) return false;
    return true;
  });

  return (
    <Card className={className}>
      <div className="flex items-start justify-between mb-5">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-100 to-purple-200 dark:from-indigo-900/50 dark:to-purple-900/40 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-indigo-600 dark:text-indigo-200" />
            </span>
            <h2 className={`${ds.typography.h2} ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
              Recomendaciones de Canales
            </h2>
          </div>
          <p className={`${ds.typography.bodySmall} ${ds.color.textSecondary} ${ds.color.textSecondaryDark}`}>
            La IA evalúa tu desempeño actual y saturación, y sugiere nuevos canales (SMS, bots) cuando tenga sentido para expandir alcance sin improvisar.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="indigo" size="md">
            {dashboard.totalRecommendations} recomendaciones
          </Badge>
          {onSettingsEdit && (
            <Button
              size="sm"
              variant="ghost"
              leftIcon={<Filter className="w-4 h-4" />}
              onClick={onSettingsEdit}
            >
              Configurar
            </Button>
          )}
        </div>
      </div>

      {/* Resumen */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="rounded-xl bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 border border-indigo-200 dark:border-indigo-800 p-4">
          <p className={`${ds.typography.caption} ${ds.color.textMuted} ${ds.color.textMutedDark} mb-1`}>
            Alta prioridad
          </p>
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
            <span className={`${ds.typography.h3} text-red-600 dark:text-red-400`}>
              {dashboard.byPriority.high}
            </span>
          </div>
        </div>
        <div className="rounded-xl bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200 dark:border-green-800 p-4">
          <p className={`${ds.typography.caption} ${ds.color.textMuted} ${ds.color.textMutedDark} mb-1`}>
            Mejora en alcance
          </p>
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-green-600 dark:text-green-400" />
            <span className={`${ds.typography.h3} text-green-600 dark:text-green-400`}>
              +{dashboard.totalEstimatedImpact.reachImprovement.toFixed(1)}%
            </span>
          </div>
        </div>
        <div className="rounded-xl bg-gradient-to-br from-blue-50 to-sky-50 dark:from-blue-900/20 dark:to-sky-900/20 border border-blue-200 dark:border-blue-800 p-4">
          <p className={`${ds.typography.caption} ${ds.color.textMuted} ${ds.color.textMutedDark} mb-1`}>
            Mejora en engagement
          </p>
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <span className={`${ds.typography.h3} text-blue-600 dark:text-blue-400`}>
              +{dashboard.totalEstimatedImpact.engagementImprovement.toFixed(1)}%
            </span>
          </div>
        </div>
        <div className="rounded-xl bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border border-purple-200 dark:border-purple-800 p-4">
          <p className={`${ds.typography.caption} ${ds.color.textMuted} ${ds.color.textMutedDark} mb-1`}>
            Impacto en ingresos
          </p>
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            <span className={`${ds.typography.h3} text-purple-600 dark:text-purple-400`}>
              {CampanasAutomatizacionService.formatCurrency(dashboard.totalEstimatedImpact.revenueImpact)}
            </span>
          </div>
        </div>
      </div>

      {/* Filtros */}
      <div className="flex items-center gap-3 mb-6 flex-wrap">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-500 dark:text-slate-400" />
          <span className={`${ds.typography.caption} ${ds.color.textMuted} ${ds.color.textMutedDark}`}>
            Prioridad:
          </span>
          <select
            value={selectedPriority}
            onChange={(e) => setSelectedPriority(e.target.value as ChannelRecommendationPriority | 'all')}
            className="px-3 py-1.5 text-sm border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          >
            <option value="all">Todas</option>
            <option value="high">Alta</option>
            <option value="medium">Media</option>
            <option value="low">Baja</option>
          </select>
        </div>
        <div className="flex items-center gap-2">
          <span className={`${ds.typography.caption} ${ds.color.textMuted} ${ds.color.textMutedDark}`}>
            Canal:
          </span>
          <select
            value={selectedChannel}
            onChange={(e) => setSelectedChannel(e.target.value as ChannelRecommendationType | 'all')}
            className="px-3 py-1.5 text-sm border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          >
            <option value="all">Todos</option>
            <option value="sms">SMS</option>
            <option value="bot">Bot</option>
            <option value="push">Push</option>
            <option value="in-app">In-App</option>
            <option value="voice">Voz</option>
          </select>
        </div>
      </div>

      {/* Lista de recomendaciones */}
      {filteredRecommendations.length === 0 ? (
        <div className="text-center py-12">
          <CheckCircle className="w-16 h-16 text-green-500 dark:text-green-400 mx-auto mb-4" />
          <p className={`${ds.typography.body} ${ds.color.textSecondary} ${ds.color.textSecondaryDark} mb-2`}>
            No hay recomendaciones disponibles
          </p>
          <p className={`${ds.typography.bodySmall} ${ds.color.textMuted} ${ds.color.textMutedDark}`}>
            La IA está analizando tu desempeño y generará recomendaciones cuando tenga sentido.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredRecommendations.map((recommendation) => {
            const priorityColor = priorityColors[recommendation.priority];
            const channelColor = channelColors[recommendation.recommendedChannel];
            const isExpanded = expandedRecommendations.has(recommendation.id);
            return (
              <div
                key={recommendation.id}
                className={`rounded-2xl border ${priorityColor.border} ${priorityColor.bg} p-5 transition-all`}
              >
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2 flex-wrap">
                      <div
                        className={`w-10 h-10 rounded-xl bg-gradient-to-br ${channelColor} flex items-center justify-center text-white`}
                      >
                        {channelIcons[recommendation.recommendedChannel]}
                      </div>
                      <h3 className={`${ds.typography.h4} ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
                        {recommendation.recommendedChannelLabel}
                      </h3>
                      <Badge
                        variant={recommendation.priority === 'high' ? 'red' : recommendation.priority === 'medium' ? 'orange' : 'blue'}
                        size="sm"
                      >
                        {recommendation.priority.toUpperCase()}
                      </Badge>
                      <Badge variant="gray" size="sm">
                        {reasonLabels[recommendation.reason]}
                      </Badge>
                      <Badge variant="purple" size="sm">
                        {recommendation.aiConfidence}% confianza IA
                      </Badge>
                    </div>
                    <p className={`${ds.typography.bodySmall} ${ds.color.textSecondary} ${ds.color.textSecondaryDark} mb-3`}>
                      {recommendation.description}
                    </p>
                    <div className="flex items-center gap-4 flex-wrap text-sm">
                      <div className="flex items-center gap-1">
                        <TrendingUp className="w-4 h-4 text-green-500" />
                        <span className="text-green-600 dark:text-green-400 font-medium">
                          +{recommendation.expectedImpact.reachImprovement.toFixed(1)}% alcance
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <TrendingUp className="w-4 h-4 text-blue-500" />
                        <span className="text-blue-600 dark:text-blue-400 font-medium">
                          +{recommendation.expectedImpact.engagementImprovement.toFixed(1)}% engagement
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                        <span className={ds.color.textSecondary + ' ' + ds.color.textSecondaryDark}>
                          {recommendation.implementationPlan.totalEstimatedTime}
                        </span>
                      </div>
                      <Badge variant="gray" size="sm">
                        {difficultyLabels[recommendation.implementationPlan.difficulty]}
                      </Badge>
                    </div>
                  </div>
                  <button
                    onClick={() => toggleRecommendationExpansion(recommendation.id)}
                    className="flex-shrink-0 p-2 rounded-lg hover:bg-white/50 dark:hover:bg-slate-800/50 transition-colors"
                  >
                    {isExpanded ? (
                      <ChevronUp className="w-5 h-5 text-slate-500 dark:text-slate-400" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-slate-500 dark:text-slate-400" />
                    )}
                  </button>
                </div>

                {isExpanded && (
                  <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700 space-y-4">
                    {/* Estado actual */}
                    <div className="rounded-xl bg-white/70 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <MessageSquare className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                        <h4 className={`${ds.typography.h4} ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
                          Estado actual
                        </h4>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div>
                          <p className={`${ds.typography.caption} ${ds.color.textMuted} ${ds.color.textMutedDark} mb-1`}>
                            Canales actuales
                          </p>
                          <div className="flex flex-wrap gap-1">
                            {recommendation.currentState.currentChannels.map((channel, idx) => (
                              <Badge key={idx} variant="blue" size="sm">
                                {channel}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div>
                          <p className={`${ds.typography.caption} ${ds.color.textMuted} ${ds.color.textMutedDark} mb-1`}>
                            Saturación
                          </p>
                          <p className={`${ds.typography.bodySmall} font-semibold ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
                            {recommendation.currentState.saturationLevel}%
                          </p>
                        </div>
                        <div>
                          <p className={`${ds.typography.caption} ${ds.color.textMuted} ${ds.color.textMutedDark} mb-1`}>
                            Engagement
                          </p>
                          <p className={`${ds.typography.bodySmall} font-semibold ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
                            {recommendation.currentState.engagementRate}%
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Impacto esperado */}
                    <div className="rounded-xl bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200 dark:border-green-800 p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <TrendingUp className="w-5 h-5 text-green-600 dark:text-green-400" />
                        <h4 className={`${ds.typography.h4} ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
                          Impacto esperado
                        </h4>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div>
                          <p className={`${ds.typography.caption} ${ds.color.textMuted} ${ds.color.textMutedDark} mb-1`}>
                            Mejora en alcance
                          </p>
                          <p className={`${ds.typography.bodySmall} font-semibold text-green-600 dark:text-green-400`}>
                            +{recommendation.expectedImpact.reachImprovement.toFixed(1)}%
                          </p>
                        </div>
                        <div>
                          <p className={`${ds.typography.caption} ${ds.color.textMuted} ${ds.color.textMutedDark} mb-1`}>
                            Mejora en engagement
                          </p>
                          <p className={`${ds.typography.bodySmall} font-semibold text-green-600 dark:text-green-400`}>
                            +{recommendation.expectedImpact.engagementImprovement.toFixed(1)}%
                          </p>
                        </div>
                        <div>
                          <p className={`${ds.typography.caption} ${ds.color.textMuted} ${ds.color.textMutedDark} mb-1`}>
                            Mejora en conversión
                          </p>
                          <p className={`${ds.typography.bodySmall} font-semibold text-green-600 dark:text-green-400`}>
                            +{recommendation.expectedImpact.conversionImprovement.toFixed(1)}%
                          </p>
                        </div>
                      </div>
                      {recommendation.expectedImpact.estimatedRevenueImpact && (
                        <div className="mt-3 pt-3 border-t border-green-200 dark:border-green-800">
                          <p className={`${ds.typography.caption} ${ds.color.textMuted} ${ds.color.textMutedDark} mb-1`}>
                            Impacto estimado en ingresos
                          </p>
                          <p className={`${ds.typography.bodySmall} font-semibold text-green-600 dark:text-green-400`}>
                            {CampanasAutomatizacionService.formatCurrency(recommendation.expectedImpact.estimatedRevenueImpact)}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Plan de implementación */}
                    <div className="rounded-xl bg-white/70 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <Rocket className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                        <h4 className={`${ds.typography.h4} ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
                          Plan de implementación
                        </h4>
                      </div>
                      <div className="space-y-3">
                        {recommendation.implementationPlan.steps.map((step) => (
                          <div
                            key={step.stepNumber}
                            className="flex items-start gap-3 p-3 bg-slate-50 dark:bg-slate-900/50 rounded-lg"
                          >
                            <div className="flex-shrink-0 w-6 h-6 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                              {step.stepNumber}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1 flex-wrap">
                                <span className={`${ds.typography.caption} font-medium ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
                                  {step.title}
                                </span>
                                <Badge variant="gray" size="sm">
                                  {step.estimatedTime}
                                </Badge>
                              </div>
                              <p className={`${ds.typography.bodySmall} ${ds.color.textSecondary} ${ds.color.textSecondaryDark}`}>
                                {step.description}
                              </p>
                              {step.requiredResources && step.requiredResources.length > 0 && (
                                <div className="mt-2">
                                  <p className={`${ds.typography.caption} ${ds.color.textMuted} ${ds.color.textMutedDark} mb-1`}>
                                    Recursos necesarios:
                                  </p>
                                  <div className="flex flex-wrap gap-1">
                                    {step.requiredResources.map((resource, idx) => (
                                      <Badge key={idx} variant="blue" size="sm">
                                        {resource}
                                      </Badge>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between flex-wrap gap-3">
                        <div>
                          <p className={`${ds.typography.caption} ${ds.color.textMuted} ${ds.color.textMutedDark} mb-1`}>
                            Tiempo total estimado
                          </p>
                          <p className={`${ds.typography.bodySmall} font-semibold ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
                            {recommendation.implementationPlan.totalEstimatedTime}
                          </p>
                        </div>
                        <div>
                          <p className={`${ds.typography.caption} ${ds.color.textMuted} ${ds.color.textMutedDark} mb-1`}>
                            Dificultad
                          </p>
                          <Badge
                            variant={recommendation.implementationPlan.difficulty === 'easy' ? 'green' : recommendation.implementationPlan.difficulty === 'medium' ? 'yellow' : 'red'}
                            size="sm"
                          >
                            {difficultyLabels[recommendation.implementationPlan.difficulty]}
                          </Badge>
                        </div>
                        {recommendation.implementationPlan.cost && (
                          <div>
                            <p className={`${ds.typography.caption} ${ds.color.textMuted} ${ds.color.textMutedDark} mb-1`}>
                              Costo estimado
                            </p>
                            <p className={`${ds.typography.bodySmall} font-semibold ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
                              {CampanasAutomatizacionService.formatCurrency(recommendation.implementationPlan.cost)}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Casos de uso */}
                    {recommendation.useCases && recommendation.useCases.length > 0 && (
                      <div className="rounded-xl bg-white/70 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 p-4">
                        <div className="flex items-center gap-2 mb-3">
                          <Sparkles className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                          <h4 className={`${ds.typography.h4} ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
                            Casos de uso
                          </h4>
                        </div>
                        <div className="space-y-3">
                          {recommendation.useCases.map((useCase, idx) => (
                            <div key={idx} className="p-3 bg-slate-50 dark:bg-slate-900/50 rounded-lg">
                              <p className={`${ds.typography.caption} font-medium ${ds.color.textPrimary} ${ds.color.textPrimaryDark} mb-1`}>
                                {useCase.title}
                              </p>
                              <p className={`${ds.typography.bodySmall} ${ds.color.textSecondary} ${ds.color.textSecondaryDark} mb-2`}>
                                {useCase.description}
                              </p>
                              {useCase.exampleMessage && (
                                <div className="mb-2 p-2 bg-white dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-700">
                                  <p className={`${ds.typography.caption} ${ds.color.textMuted} ${ds.color.textMutedDark} mb-1`}>
                                    Ejemplo:
                                  </p>
                                  <p className={`${ds.typography.bodySmall} ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
                                    {useCase.exampleMessage}
                                  </p>
                                </div>
                              )}
                              <p className={`${ds.typography.caption} ${ds.color.textMuted} ${ds.color.textMutedDark}`}>
                                Resultado esperado: {useCase.expectedResult}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Acciones */}
                    <div className="flex items-center gap-2 pt-3 border-t border-slate-200 dark:border-slate-700 flex-wrap">
                      {onStartImplementation && (
                        <Button
                          size="sm"
                          leftIcon={<Rocket className="w-4 h-4" />}
                          onClick={() => onStartImplementation(recommendation.id)}
                          className="bg-indigo-600 hover:bg-indigo-700 text-white"
                        >
                          Iniciar implementación
                        </Button>
                      )}
                      {onRecommendationAccept && (
                        <Button
                          size="sm"
                          variant="secondary"
                          leftIcon={<CheckCircle className="w-4 h-4" />}
                          onClick={() => onRecommendationAccept(recommendation.id)}
                        >
                          Aceptar
                        </Button>
                      )}
                      {onViewRecommendation && (
                        <Button
                          size="sm"
                          variant="ghost"
                          leftIcon={<MessageSquare className="w-4 h-4" />}
                          onClick={() => onViewRecommendation(recommendation)}
                        >
                          Ver detalles
                        </Button>
                      )}
                      {onRecommendationReject && (
                        <Button
                          size="sm"
                          variant="ghost"
                          leftIcon={<X className="w-4 h-4" />}
                          onClick={() => onRecommendationReject(recommendation.id)}
                          className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300"
                        >
                          Rechazar
                        </Button>
                      )}
                      {onRecommendationDismiss && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => onRecommendationDismiss(recommendation.id)}
                        >
                          Descartar
                        </Button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Insights */}
      {dashboard.insights && dashboard.insights.length > 0 && (
        <div className="mt-6 rounded-xl bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 border border-indigo-200 dark:border-indigo-800 p-4">
          <div className="flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-indigo-600 dark:text-indigo-400 mt-0.5" />
            <div>
              <p className={`${ds.typography.bodySmall} font-medium ${ds.color.textPrimary} ${ds.color.textPrimaryDark} mb-2`}>
                Insights de IA
              </p>
              <ul className="space-y-1">
                {dashboard.insights.map((insight, idx) => (
                  <li key={idx} className={`${ds.typography.bodySmall} ${ds.color.textSecondary} ${ds.color.textSecondaryDark}`}>
                    • {insight}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Información adicional */}
      <div className="mt-6 rounded-xl bg-gradient-to-br from-blue-50 to-sky-50 dark:from-blue-900/20 dark:to-sky-900/20 border border-blue-200 dark:border-blue-800 p-4">
        <div className="flex items-start gap-3">
          <Sparkles className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
          <div>
            <p className={`${ds.typography.bodySmall} font-medium ${ds.color.textPrimary} ${ds.color.textPrimaryDark} mb-1`}>
              Recomendaciones inteligentes de canales
            </p>
            <p className={`${ds.typography.bodySmall} ${ds.color.textSecondary} ${ds.color.textSecondaryDark}`}>
              La IA evalúa tu desempeño actual y saturación de canales, y sugiere nuevos canales cuando tenga sentido
              para expandir alcance sin improvisar. Última análisis: {new Date(dashboard.lastAnalysisDate).toLocaleDateString('es-ES')}
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
};

