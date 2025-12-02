import React, { useState } from 'react';
import { TrendingUp, TrendingDown, Minus, DollarSign, ShoppingCart, Users, Target, Megaphone, FileText, Image, Sparkles, Filter } from 'lucide-react';
import { Badge, Card, Button } from '../../../components/componentsreutilizables';
import { ds } from '../../adherencia/ui/ds';
import { SalesAttributionSnapshot, SalesAttribution, InsightSource } from '../types';
import { CreateFunnelCampaignModal } from './CreateFunnelCampaignModal';

interface SalesAttributionProps {
  attribution: SalesAttributionSnapshot | null;
  loading?: boolean;
  className?: string;
}

const sourceTypeIcon: Record<SalesAttribution['sourceType'], React.ReactNode> = {
  campaign: <Megaphone className="w-5 h-5" />,
  lead_magnet: <FileText className="w-5 h-5" />,
  content: <Image className="w-5 h-5" />,
};

const sourceTypeLabel: Record<SalesAttribution['sourceType'], string> = {
  campaign: 'Campaña',
  lead_magnet: 'Lead Magnet',
  content: 'Contenido',
};

const sourceTypeColor: Record<SalesAttribution['sourceType'], string> = {
  campaign: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
  lead_magnet: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
  content: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300',
};

const trendIcon: Record<string, React.ReactNode> = {
  up: <TrendingUp className="w-4 h-4 text-emerald-500" />,
  down: <TrendingDown className="w-4 h-4 text-red-500" />,
  neutral: <Minus className="w-4 h-4 text-gray-500" />,
};

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0,
  }).format(value);
}

function formatPercentage(value: number): string {
  return `${value.toFixed(1)}%`;
}

export const SalesAttributionComponent: React.FC<SalesAttributionProps> = ({
  attribution,
  loading = false,
  className = '',
}) => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedInsight, setSelectedInsight] = useState<InsightSource | null>(null);
  
  const placeholders = Array.from({ length: 3 }).map((_, index) => (
    <div key={`attribution-skeleton-${index}`} className={`${ds.shimmer} h-32`} />
  ));

  if (loading && !attribution) {
    return (
      <Card className={`col-span-2 ${className}`.trim()}>
        <div className="space-y-4">{placeholders}</div>
      </Card>
    );
  }

  if (!attribution || attribution.attribution.length === 0) {
    return (
      <Card className={`col-span-2 ${className}`.trim()}>
        <div className="text-center py-8">
          <Target className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className={`${ds.typography.bodySmall} ${ds.color.textSecondary} ${ds.color.textSecondaryDark}`}>
            No hay datos de atribución de ventas disponibles
          </p>
        </div>
      </Card>
    );
  }

  // Sort by revenue (descending)
  const sortedAttribution = [...attribution.attribution].sort((a, b) => b.salesRevenue - a.salesRevenue);

  return (
    <Card className={`col-span-2 ${className}`.trim()}>
      <div className="flex items-start justify-between mb-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-100 to-teal-200 flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-emerald-600" />
            </span>
            <h2 className={`${ds.typography.h2} ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
              Atribución de Ventas
            </h2>
          </div>
          <p className={`${ds.typography.bodySmall} ${ds.color.textSecondary} ${ds.color.textSecondaryDark}`}>
            Cómo se relacionan tus campañas, lead magnets y contenido con las ventas reales.
          </p>
        </div>
        <div className="text-right">
          <p className={`${ds.typography.h3} ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
            {formatCurrency(attribution.totalRevenue)}
          </p>
          <p className={`${ds.typography.caption} ${ds.color.textMuted} ${ds.color.textMutedDark}`}>
            {attribution.totalSales} ventas
          </p>
        </div>
      </div>

      {/* Top Performer Highlight */}
      {attribution.topPerformer && (
        <div className="mb-6 rounded-2xl border-2 border-emerald-200 dark:border-emerald-800 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 p-5">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <h3 className={`${ds.typography.h3} ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
              Mejor Performer
            </h3>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Badge className={sourceTypeColor[attribution.topPerformer.sourceType]}>
                  {sourceTypeLabel[attribution.topPerformer.sourceType]}
                </Badge>
                <span className={`${ds.typography.bodyLarge} font-semibold ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
                  {attribution.topPerformer.sourceName}
                </span>
              </div>
              <p className={`${ds.typography.bodySmall} ${ds.color.textSecondary} ${ds.color.textSecondaryDark}`}>
                {formatCurrency(attribution.topPerformer.salesRevenue)} en {attribution.topPerformer.salesCount} ventas
              </p>
            </div>
            <div className="text-right">
              <p className={`${ds.typography.bodyLarge} font-semibold text-emerald-600 dark:text-emerald-400`}>
                {formatPercentage(attribution.topPerformer.conversionRate)}
              </p>
              <p className={`${ds.typography.caption} ${ds.color.textMuted} ${ds.color.textMutedDark}`}>
                Tasa de conversión
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Attribution List */}
      <div className="space-y-4">
        {sortedAttribution.map((item) => {
          const trend = item.changePercentage
            ? {
                value: Math.abs(item.changePercentage),
                direction: item.trendDirection,
              }
            : null;

          return (
            <div
              key={item.id}
              className="rounded-2xl border border-gray-100 dark:border-gray-800 p-4 sm:p-5 bg-gradient-to-br from-white to-gray-50 dark:from-[#111827] dark:to-[#1f2937] hover:shadow-md transition-shadow"
            >
              <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className={`w-10 h-10 rounded-xl ${sourceTypeColor[item.sourceType]} flex items-center justify-center flex-shrink-0`}>
                    {sourceTypeIcon[item.sourceType]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge className={sourceTypeColor[item.sourceType]} size="sm">
                        {sourceTypeLabel[item.sourceType]}
                      </Badge>
                      {item.channel && (
                        <Badge variant="secondary" size="sm">
                          {item.channel}
                        </Badge>
                      )}
                      {item.type && (
                        <Badge variant="secondary" size="sm">
                          {item.type}
                        </Badge>
                      )}
                    </div>
                    <h3 className={`${ds.typography.h3} ${ds.color.textPrimary} ${ds.color.textPrimaryDark} truncate`}>
                      {item.sourceName}
                    </h3>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`${ds.typography.h3} ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
                    {formatCurrency(item.salesRevenue)}
                  </p>
                  {trend && (
                    <div className="flex items-center justify-end gap-1 mt-1">
                      {trendIcon[trend.direction]}
                      <span
                        className={`${ds.typography.caption} ${
                          trend.direction === 'up'
                            ? 'text-emerald-600 dark:text-emerald-400'
                            : trend.direction === 'down'
                            ? 'text-red-600 dark:text-red-400'
                            : 'text-gray-600 dark:text-gray-400'
                        }`}
                      >
                        {formatPercentage(trend.value)}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
                <div>
                  <div className="flex items-center gap-1 mb-1">
                    <ShoppingCart className="w-4 h-4 text-gray-400" />
                    <p className={`${ds.typography.caption} ${ds.color.textMuted} ${ds.color.textMutedDark}`}>
                      Ventas
                    </p>
                  </div>
                  <p className={`${ds.typography.bodyLarge} font-semibold ${ds.color.textPrimaryDark}`}>
                    {item.salesCount}
                  </p>
                </div>
                <div>
                  <div className="flex items-center gap-1 mb-1">
                    <Target className="w-4 h-4 text-gray-400" />
                    <p className={`${ds.typography.caption} ${ds.color.textMuted} ${ds.color.textMutedDark}`}>
                      Conversión
                    </p>
                  </div>
                  <p className={`${ds.typography.bodyLarge} font-semibold ${ds.color.textPrimaryDark}`}>
                    {formatPercentage(item.conversionRate)}
                  </p>
                </div>
                <div>
                  <div className="flex items-center gap-1 mb-1">
                    <DollarSign className="w-4 h-4 text-gray-400" />
                    <p className={`${ds.typography.caption} ${ds.color.textMuted} ${ds.color.textMutedDark}`}>
                      Ticket Promedio
                    </p>
                  </div>
                  <p className={`${ds.typography.bodyLarge} font-semibold ${ds.color.textPrimaryDark}`}>
                    {formatCurrency(item.averageOrderValue)}
                  </p>
                </div>
                <div>
                  <div className="flex items-center gap-1 mb-1">
                    <Users className="w-4 h-4 text-gray-400" />
                    <p className={`${ds.typography.caption} ${ds.color.textMuted} ${ds.color.textMutedDark}`}>
                      Leads
                    </p>
                  </div>
                  <p className={`${ds.typography.bodyLarge} font-semibold ${ds.color.textPrimaryDark}`}>
                    {item.leadsGenerated}
                  </p>
                  {item.leadsToSalesRate > 0 && (
                    <p className={`${ds.typography.caption} text-emerald-600 dark:text-emerald-400`}>
                      {formatPercentage(item.leadsToSalesRate)} → ventas
                    </p>
                  )}
                </div>
              </div>

              {/* ROAS for campaigns */}
              {item.sourceType === 'campaign' && item.roas !== undefined && (
                <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
                  <div className="flex items-center justify-between">
                    <span className={`${ds.typography.caption} ${ds.color.textMuted} ${ds.color.textMutedDark}`}>
                      ROAS (Return on Ad Spend)
                    </span>
                    <span className={`${ds.typography.bodyLarge} font-semibold text-emerald-600 dark:text-emerald-400`}>
                      {item.roas.toFixed(2)}x
                    </span>
                  </div>
                </div>
              )}

              {/* Action button to create funnel/campaign */}
              <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => {
                    setSelectedInsight({
                      type: 'attribution',
                      id: item.id,
                      title: item.sourceName,
                      description: `${item.sourceType === 'campaign' ? 'Campaña' : item.sourceType === 'lead_magnet' ? 'Lead Magnet' : 'Contenido'} que generó ${formatCurrency(item.salesRevenue)} en ${item.salesCount} ventas con ${formatPercentage(item.conversionRate)} de conversión.`,
                      data: item,
                    });
                    setShowCreateModal(true);
                  }}
                  className="inline-flex items-center gap-2"
                >
                  <Filter className="w-4 h-4" />
                  Crear {item.sourceType === 'campaign' ? 'campaña similar' : 'funnel desde este insight'}
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Insights */}
      {attribution.insights && attribution.insights.length > 0 && (
        <div className="mt-6 rounded-2xl border border-indigo-200 dark:border-indigo-800 bg-indigo-50/50 dark:bg-indigo-900/10 p-5">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <h3 className={`${ds.typography.h3} ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
              Insights para Optimizar
            </h3>
          </div>
          <ul className="space-y-2">
            {attribution.insights.map((insight, index) => (
              <li key={index} className="flex items-start gap-2">
                <span className="text-indigo-600 dark:text-indigo-400 mt-1">•</span>
                <p className={`${ds.typography.bodySmall} ${ds.color.textSecondary} ${ds.color.textSecondaryDark}`}>
                  {insight}
                </p>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Modal para crear funnel/campaña */}
      <CreateFunnelCampaignModal
        isOpen={showCreateModal}
        onClose={() => {
          setShowCreateModal(false);
          setSelectedInsight(null);
        }}
        insight={selectedInsight}
        onSuccess={(draft) => {
          console.log('Funnel/Campaña creado:', draft);
        }}
      />
    </Card>
  );
};

