import React from 'react';
import { TrendingUp, Zap, Target, Sparkles, ArrowUpRight } from 'lucide-react';
import { Badge, Button, Card } from '../../../components/componentsreutilizables';
import { ds } from '../../adherencia/ui/ds';
import { ContentRepowerSnapshot, ContentToRepower } from '../types';

interface ContentRepowerSuggestionsProps {
  snapshot: ContentRepowerSnapshot | null;
  loading?: boolean;
  className?: string;
}

const impactLabel: Record<'high' | 'medium' | 'low', { label: string; variant: 'success' | 'warning' | 'secondary' }> = {
  high: { label: 'Alto impacto', variant: 'success' },
  medium: { label: 'Impacto medio', variant: 'warning' },
  low: { label: 'Impacto ligero', variant: 'secondary' },
};

const typeLabels: Record<ContentToRepower['type'], string> = {
  post: 'Post',
  reel: 'Reel',
  story: 'Story',
  carousel: 'Carrusel',
  lead_magnet: 'Lead Magnet',
  campaign: 'Campaña',
  email: 'Email',
};

const platformLabels: Record<string, string> = {
  instagram: 'Instagram',
  linkedin: 'LinkedIn',
  tiktok: 'TikTok',
  facebook: 'Facebook',
  email: 'Email',
};

export const ContentRepowerSuggestions: React.FC<ContentRepowerSuggestionsProps> = ({
  snapshot,
  loading = false,
  className = '',
}) => {
  const placeholders = Array.from({ length: 3 }).map((_, index) => (
    <div key={`repower-skeleton-${index}`} className={`${ds.shimmer} h-32`} />
  ));

  if (loading && !snapshot) {
    return (
      <Card className={`col-span-2 ${className}`.trim()}>
        <div className="flex items-start justify-between mb-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-100 to-orange-200 flex items-center justify-center">
                <Zap className="w-5 h-5 text-orange-600" />
              </span>
              <h2 className={`${ds.typography.h2} ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
                Contenido a repotenciar
              </h2>
            </div>
            <p className={`${ds.typography.bodySmall} ${ds.color.textSecondary} ${ds.color.textSecondaryDark}`}>
              La IA identifica qué contenido repotenciar según rendimiento y estilo para amplificar ganadores.
            </p>
          </div>
        </div>
        <div className="space-y-4">{placeholders}</div>
      </Card>
    );
  }

  if (!snapshot || snapshot.contents.length === 0) {
    return (
      <Card className={`col-span-2 ${className}`.trim()}>
        <div className="flex items-start justify-between mb-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-100 to-orange-200 flex items-center justify-center">
                <Zap className="w-5 h-5 text-orange-600" />
              </span>
              <h2 className={`${ds.typography.h2} ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
                Contenido a repotenciar
              </h2>
            </div>
            <p className={`${ds.typography.bodySmall} ${ds.color.textSecondary} ${ds.color.textSecondaryDark}`}>
              La IA identifica qué contenido repotenciar según rendimiento y estilo para amplificar ganadores.
            </p>
          </div>
        </div>
        <div className="text-center py-8">
          <p className={`${ds.typography.body} ${ds.color.textSecondary} ${ds.color.textSecondaryDark}`}>
            No hay contenido disponible para repotenciar en este momento.
          </p>
        </div>
      </Card>
    );
  }

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR',
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <Card className={`col-span-2 ${className}`.trim()}>
      <div className="flex items-start justify-between mb-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-100 to-orange-200 flex items-center justify-center">
              <Zap className="w-5 h-5 text-orange-600" />
            </span>
            <h2 className={`${ds.typography.h2} ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
              Contenido a repotenciar
            </h2>
          </div>
          <p className={`${ds.typography.bodySmall} ${ds.color.textSecondary} ${ds.color.textSecondaryDark}`}>
            La IA identifica qué contenido repotenciar según rendimiento y estilo para amplificar ganadores sin reinventar la rueda.
          </p>
        </div>
      </div>

      {/* Insights destacados */}
      {snapshot.insights.length > 0 && (
        <div className="mb-6 space-y-2">
          {snapshot.insights.map((insight, index) => (
            <div
              key={`insight-${index}`}
              className="p-3 rounded-lg bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800"
            >
              <div className="flex items-start gap-2">
                <Sparkles className="w-4 h-4 text-orange-600 dark:text-orange-400 mt-0.5 flex-shrink-0" />
                <p className={`text-sm ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>{insight}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Impacto potencial total */}
      {snapshot.totalPotentialImpact && (
        <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-lg bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-900/10 border border-orange-200 dark:border-orange-800">
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className="w-4 h-4 text-orange-600 dark:text-orange-400" />
              <span className={`text-xs font-medium ${ds.color.textSecondary} ${ds.color.textSecondaryDark}`}>
                Leads estimados
              </span>
            </div>
            <p className={`text-2xl font-bold ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
              {Math.round(snapshot.totalPotentialImpact.estimatedLeads)}
            </p>
          </div>
          <div className="p-4 rounded-lg bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-900/10 border border-orange-200 dark:border-orange-800">
            <div className="flex items-center gap-2 mb-1">
              <Target className="w-4 h-4 text-orange-600 dark:text-orange-400" />
              <span className={`text-xs font-medium ${ds.color.textSecondary} ${ds.color.textSecondaryDark}`}>
                Revenue estimado
              </span>
            </div>
            <p className={`text-2xl font-bold ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
              {formatCurrency(snapshot.totalPotentialImpact.estimatedRevenue)}
            </p>
          </div>
          <div className="p-4 rounded-lg bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-900/10 border border-orange-200 dark:border-orange-800">
            <div className="flex items-center gap-2 mb-1">
              <Sparkles className="w-4 h-4 text-orange-600 dark:text-orange-400" />
              <span className={`text-xs font-medium ${ds.color.textSecondary} ${ds.color.textSecondaryDark}`}>
                Engagement estimado
              </span>
            </div>
            <p className={`text-2xl font-bold ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
              {Math.round(snapshot.totalPotentialImpact.estimatedEngagement)}
            </p>
          </div>
        </div>
      )}

      {/* Lista de contenido a repotenciar */}
      <div className="space-y-4">
        {snapshot.contents.map((content) => {
          const impact = impactLabel[content.recommendation.expectedImpact];
          return (
            <div
              key={content.id}
              className="rounded-2xl border border-gray-100 dark:border-gray-900 p-4 bg-white/80 dark:bg-[#111827]/80 backdrop-blur"
            >
              <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <h3 className={`${ds.typography.h3} ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
                      {content.title}
                    </h3>
                    <Badge variant={impact.variant}>{impact.label}</Badge>
                    <Badge variant="secondary" size="sm">
                      {typeLabels[content.type]}
                    </Badge>
                    {content.platform && (
                      <Badge variant="secondary" size="sm">
                        {platformLabels[content.platform] || content.platform}
                      </Badge>
                    )}
                  </div>
                  <p className={`${ds.typography.bodySmall} ${ds.color.textSecondary} ${ds.color.textSecondaryDark} mb-2`}>
                    {content.recommendation.reason}
                  </p>
                  <p className={`${ds.typography.bodySmall} font-medium ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
                    💡 {content.recommendation.suggestedAction}
                  </p>
                </div>
              </div>

              {/* Métricas de rendimiento */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
                {content.performance.score !== undefined && (
                  <div className="p-2 rounded-lg bg-gray-50 dark:bg-gray-900/50">
                    <p className={`text-xs ${ds.color.textSecondary} ${ds.color.textSecondaryDark} mb-1`}>Score</p>
                    <p className={`text-lg font-bold ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
                      {content.performance.score}/100
                    </p>
                  </div>
                )}
                {content.performance.salesRevenue !== undefined && (
                  <div className="p-2 rounded-lg bg-gray-50 dark:bg-gray-900/50">
                    <p className={`text-xs ${ds.color.textSecondary} ${ds.color.textSecondaryDark} mb-1`}>Revenue</p>
                    <p className={`text-lg font-bold ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
                      {formatCurrency(content.performance.salesRevenue)}
                    </p>
                  </div>
                )}
                {content.performance.conversionRate !== undefined && (
                  <div className="p-2 rounded-lg bg-gray-50 dark:bg-gray-900/50">
                    <p className={`text-xs ${ds.color.textSecondary} ${ds.color.textSecondaryDark} mb-1`}>Conversión</p>
                    <p className={`text-lg font-bold ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
                      {content.performance.conversionRate.toFixed(1)}%
                    </p>
                  </div>
                )}
                {content.performance.leadsGenerated !== undefined && (
                  <div className="p-2 rounded-lg bg-gray-50 dark:bg-gray-900/50">
                    <p className={`text-xs ${ds.color.textSecondary} ${ds.color.textSecondaryDark} mb-1`}>Leads</p>
                    <p className={`text-lg font-bold ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
                      {content.performance.leadsGenerated}
                    </p>
                  </div>
                )}
              </div>

              {/* Coincidencia de estilo */}
              {content.styleMatch.strengthMatch.length > 0 && (
                <div className="mb-3 flex items-center gap-2 flex-wrap">
                  <span className={`text-xs font-medium ${ds.color.textSecondary} ${ds.color.textSecondaryDark}`}>
                    Coincide con tus fortalezas:
                  </span>
                  {content.styleMatch.strengthMatch.map((strength, idx) => (
                    <Badge key={idx} variant="success" size="sm">
                      {strength}
                    </Badge>
                  ))}
                </div>
              )}

              {/* Canales sugeridos */}
              {content.recommendation.suggestedChannels && content.recommendation.suggestedChannels.length > 0 && (
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`text-xs ${ds.color.textSecondary} ${ds.color.textSecondaryDark}`}>
                      Canales sugeridos:
                    </span>
                    {content.recommendation.suggestedChannels.map((channel, idx) => (
                      <Badge key={idx} variant="secondary" size="sm">
                        {channel}
                      </Badge>
                    ))}
                  </div>
                  <Button variant="primary" size="sm" className="inline-flex items-center gap-2">
                    Repotenciar ahora
                    <ArrowUpRight className="w-4 h-4" />
                  </Button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </Card>
  );
};

