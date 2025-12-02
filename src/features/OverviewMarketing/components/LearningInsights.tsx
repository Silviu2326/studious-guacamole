import React from 'react';
import { Brain, TrendingUp, TrendingDown, Target, Lightbulb } from 'lucide-react';
import { Badge, Card } from '../../../components/componentsreutilizables';
import { ds } from '../../adherencia/ui/ds';
import { LearningInsights, LearningProfile } from '../types';

interface LearningInsightsProps {
  insights: LearningInsights | null;
  profile: LearningProfile | null;
  loading?: boolean;
  className?: string;
}

export const LearningInsightsComponent: React.FC<LearningInsightsProps> = ({
  insights,
  profile,
  loading = false,
  className = '',
}) => {
  if (loading) {
    return (
      <Card className={className}>
        <div className={`${ds.shimmer} h-32`} />
      </Card>
    );
  }

  if (!insights || !profile) {
    return null;
  }

  const accuracyColor = profile.accuracyScore >= 70 ? 'text-green-600 dark:text-green-400' : 
                        profile.accuracyScore >= 50 ? 'text-yellow-600 dark:text-yellow-400' : 
                        'text-red-600 dark:text-red-400';

  return (
    <Card className={className}>
      <div className="flex items-start justify-between mb-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-100 to-indigo-200 dark:from-purple-900/40 dark:to-indigo-900/30 flex items-center justify-center">
              <Brain className="w-5 h-5 text-purple-600 dark:text-purple-300" />
            </span>
            <h2 className={`${ds.typography.h2} ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
              Aprendizaje de IA
            </h2>
          </div>
          <p className={`${ds.typography.bodySmall} ${ds.color.textSecondary} ${ds.color.textSecondaryDark}`}>
            El dashboard aprende de tus acciones para mejorar la precisión de las sugerencias.
          </p>
        </div>
        <div className="text-right">
          <div className={`text-2xl font-bold ${accuracyColor}`}>
            {profile.accuracyScore.toFixed(0)}%
          </div>
          <div className={`text-xs ${ds.color.textSecondary} ${ds.color.textSecondaryDark}`}>
            Precisión
          </div>
        </div>
      </div>

      {/* Estadísticas principales */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-900/50">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-green-600 dark:text-green-400" />
            <span className={`text-sm font-medium ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
              Tasa de aceptación
            </span>
          </div>
          <div className="text-2xl font-bold text-green-600 dark:text-green-400">
            {insights.acceptanceRate.toFixed(1)}%
          </div>
          <div className={`text-xs ${ds.color.textMuted} ${ds.color.textMutedDark} mt-1`}>
            {insights.totalFeedback} acciones registradas
          </div>
        </div>

        <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-900/50">
          <div className="flex items-center gap-2 mb-2">
            <TrendingDown className="w-4 h-4 text-red-600 dark:text-red-400" />
            <span className={`text-sm font-medium ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
              Tasa de rechazo
            </span>
          </div>
          <div className="text-2xl font-bold text-red-600 dark:text-red-400">
            {insights.rejectionRate.toFixed(1)}%
          </div>
          <div className={`text-xs ${ds.color.textMuted} ${ds.color.textMutedDark} mt-1`}>
            {insights.totalFeedback} acciones registradas
          </div>
        </div>

        <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-900/50">
          <div className="flex items-center gap-2 mb-2">
            <Target className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <span className={`text-sm font-medium ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
              Total feedback
            </span>
          </div>
          <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
            {insights.totalFeedback}
          </div>
          <div className={`text-xs ${ds.color.textMuted} ${ds.color.textMutedDark} mt-1`}>
            Acciones registradas
          </div>
        </div>
      </div>

      {/* Tipos más aceptados */}
      {insights.topAcceptedTypes.length > 0 && (
        <div className="mb-6">
          <h3 className={`text-sm font-medium ${ds.color.textPrimary} ${ds.color.textPrimaryDark} mb-3`}>
            Tipos de sugerencias más aceptadas
          </h3>
          <div className="space-y-2">
            {insights.topAcceptedTypes.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-2 rounded-lg bg-green-50 dark:bg-green-900/20">
                <span className={`text-sm ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
                  {item.type}
                </span>
                <div className="flex items-center gap-2">
                  <Badge variant="success">{item.count}</Badge>
                  <span className={`text-xs ${ds.color.textMuted} ${ds.color.textMutedDark}`}>
                    {item.percentage.toFixed(1)}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tipos más rechazados */}
      {insights.topRejectedTypes.length > 0 && (
        <div className="mb-6">
          <h3 className={`text-sm font-medium ${ds.color.textPrimary} ${ds.color.textPrimaryDark} mb-3`}>
            Tipos de sugerencias más rechazadas
          </h3>
          <div className="space-y-2">
            {insights.topRejectedTypes.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-2 rounded-lg bg-red-50 dark:bg-red-900/20">
                <span className={`text-sm ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
                  {item.type}
                </span>
                <div className="flex items-center gap-2">
                  <Badge variant="error">{item.count}</Badge>
                  <span className={`text-xs ${ds.color.textMuted} ${ds.color.textMutedDark}`}>
                    {item.percentage.toFixed(1)}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Razones comunes de rechazo */}
      {insights.commonRejectionReasons.length > 0 && (
        <div className="mb-6">
          <h3 className={`text-sm font-medium ${ds.color.textPrimary} ${ds.color.textPrimaryDark} mb-3`}>
            Razones comunes de rechazo
          </h3>
          <div className="space-y-2">
            {insights.commonRejectionReasons.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-2 rounded-lg bg-yellow-50 dark:bg-yellow-900/20">
                <span className={`text-sm ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
                  {item.reason}
                </span>
                <Badge variant="warning">{item.count}</Badge>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Sugerencias de mejora */}
      {insights.improvementSuggestions.length > 0 && (
        <div className="p-4 rounded-lg bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800">
          <div className="flex items-center gap-2 mb-3">
            <Lightbulb className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <h3 className={`text-sm font-medium ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
              Sugerencias de mejora
            </h3>
          </div>
          <ul className="space-y-2">
            {insights.improvementSuggestions.map((suggestion, index) => (
              <li key={index} className={`text-sm ${ds.color.textPrimary} ${ds.color.textPrimaryDark} flex items-start gap-2`}>
                <span className="text-indigo-600 dark:text-indigo-400 mt-0.5">•</span>
                {suggestion}
              </li>
            ))}
          </ul>
        </div>
      )}
    </Card>
  );
};

