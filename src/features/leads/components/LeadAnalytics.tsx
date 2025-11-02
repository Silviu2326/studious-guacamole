import React, { useState, useEffect } from 'react';
import { Card, MetricCards } from '../../../components/componentsreutilizables';
import { ds } from '../../adherencia/ui/ds';
import { LeadAnalytics as LeadAnalyticsType } from '../types';
import { getLeadAnalytics } from '../api';
import { 
  Users, 
  TrendingUp, 
  Target, 
  DollarSign,
  BarChart3,
  ArrowUp,
  ArrowDown
} from 'lucide-react';

interface LeadAnalyticsProps {
  businessType: 'entrenador' | 'gimnasio';
  userId?: string;
}

export const LeadAnalytics: React.FC<LeadAnalyticsProps> = ({ businessType, userId }) => {
  const [analytics, setAnalytics] = useState<LeadAnalyticsType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnalytics();
  }, [businessType, userId]);

  const loadAnalytics = async () => {
    setLoading(true);
    try {
      const data = await getLeadAnalytics(businessType, userId);
      setAnalytics(data);
    } catch (error) {
      console.error('Error cargando analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className={`animate-spin ${ds.radius.full} h-8 w-8 border-b-2 ${ds.color.primaryBg}`}></div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="text-center py-12">
        <BarChart3 className={`w-12 h-12 ${ds.color.textMuted} ${ds.color.textMutedDark} mx-auto mb-4`} />
        <p className={`${ds.typography.body} ${ds.color.textSecondary} ${ds.color.textSecondaryDark}`}>
          No hay datos disponibles
        </p>
      </div>
    );
  }

  const metrics = [
    {
      id: 'total',
      title: 'Total Leads',
      value: analytics.overview.totalLeads,
      icon: <Users className="w-5 h-5" />,
      color: 'primary' as const,
    },
    {
      id: 'new',
      title: 'Nuevos',
      value: analytics.overview.newLeads,
      icon: <TrendingUp className="w-5 h-5" />,
      color: 'info' as const,
    },
    {
      id: 'converted',
      title: 'Convertidos',
      value: analytics.overview.convertedLeads,
      icon: <Target className="w-5 h-5" />,
      color: 'success' as const,
    },
    {
      id: 'rate',
      title: 'Tasa Conversión',
      value: `${analytics.overview.conversionRate.toFixed(1)}%`,
      icon: <BarChart3 className="w-5 h-5" />,
      color: 'warning' as const,
      trend: {
        value: 5.2,
        direction: 'up' as const,
        label: 'vs mes anterior',
      },
    },
  ];

  return (
    <div className="space-y-6">
      {/* Métricas principales */}
      <MetricCards data={metrics} columns={4} />

      {/* Breakdown por origen */}
      <Card>
        <div className={ds.spacing.xl}>
          <h3 className={`${ds.typography.h3} ${ds.color.textPrimary} ${ds.color.textPrimaryDark} mb-4`}>
            Leads por Origen
          </h3>
          <div className="space-y-4">
            {analytics.bySource.map((source) => (
              <div key={source.source} className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className={`${ds.typography.body} font-medium ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
                      {source.source}
                    </span>
                    <span className={`${ds.typography.bodySmall} ${ds.color.textSecondary} ${ds.color.textSecondaryDark}`}>
                      {source.count} leads
                    </span>
                  </div>
                  <div className={`w-full ${ds.color.border} ${ds.color.borderDark} ${ds.radius.full} h-2 ${ds.color.surface2} ${ds.color.surface2Dark}`}>
                    <div
                      className={`${ds.color.primaryBg} h-2 ${ds.radius.full} ${ds.animation.normal}`}
                      style={{ width: `${(source.count / analytics.overview.totalLeads) * 100}%` }}
                    />
                  </div>
                </div>
                <div className="ml-4 text-right">
                  <p className={`${ds.typography.bodySmall} ${ds.color.textSecondary} ${ds.color.textSecondaryDark}`}>
                    {source.conversionRate.toFixed(1)}% conversión
                  </p>
                  <p className={`${ds.typography.caption} ${ds.color.textMuted} ${ds.color.textMutedDark}`}>
                    Score: {source.averageScore.toFixed(0)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Funnel de conversión */}
      <Card>
        <div className={ds.spacing.xl}>
          <h3 className={`${ds.typography.h3} ${ds.color.textPrimary} ${ds.color.textPrimaryDark} mb-4`}>
            Embudo de Conversión
          </h3>
          <div className="space-y-4">
            {analytics.conversionFunnel.map((step) => (
              <div key={step.stage} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className={`${ds.typography.body} font-medium ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
                    {step.stage}
                  </span>
                  <div className="flex items-center gap-4">
                    <span className={`${ds.typography.bodySmall} ${ds.color.textSecondary} ${ds.color.textSecondaryDark}`}>
                      {step.count} leads ({step.percentage.toFixed(1)}%)
                    </span>
                    {step.dropoffRate > 0 && (
                      <span className={`${ds.typography.caption} ${ds.color.error}`}>
                        -{step.dropoffRate.toFixed(1)}%
                      </span>
                    )}
                  </div>
                </div>
                <div className={`w-full ${ds.color.border} ${ds.color.borderDark} ${ds.radius.full} h-3 ${ds.color.surface2} ${ds.color.surface2Dark}`}>
                  <div
                    className={`${ds.color.primaryBg} ${ds.color.primaryBgHover} h-3 ${ds.radius.full} ${ds.animation.normal}`}
                    style={{ width: `${step.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
};

