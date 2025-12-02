import React, { useState, useEffect } from 'react';
import { Card, Select, MetricCards } from '../../../components/componentsreutilizables';
import { ds } from '../../adherencia/ui/ds';
import { getLandingPageAnalytics } from '../api/landingPages';
import type { AnalyticsData } from '../types';
import { 
  Eye, 
  Users, 
  Target, 
  TrendingUp, 
  DollarSign,
  BarChart3,
  Globe,
  Mail,
  Share2,
  Loader2
} from 'lucide-react';

interface LandingPageAnalyticsProps {
  pageId: string;
}

export const LandingPageAnalytics: React.FC<LandingPageAnalyticsProps> = ({ pageId }) => {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState<'day' | 'week' | 'month' | 'year'>('month');

  useEffect(() => {
    loadAnalytics();
  }, [pageId, period]);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      const data = await getLandingPageAnalytics(pageId, period);
      setAnalytics(data);
    } catch (error) {
      console.error('Error loading analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading && !analytics) {
    return (
      <Card className={`p-8 text-center ${ds.card}`}>
        <Loader2 size={48} className={`mx-auto ${ds.color.info} animate-spin mb-4`} />
        <p className={`${ds.color.textSecondary} ${ds.color.textSecondaryDark}`}>Cargando analíticas...</p>
      </Card>
    );
  }

  if (!analytics) {
    return (
      <Card className={`p-8 text-center ${ds.card}`}>
        <BarChart3 size={48} className={`mx-auto ${ds.color.textMuted} ${ds.color.textMutedDark} mb-4`} />
        <h3 className={`${ds.typography.h3} ${ds.color.textPrimary} ${ds.color.textPrimaryDark} mb-2`}>No hay datos disponibles</h3>
        <p className={`${ds.typography.body} ${ds.color.textSecondary} ${ds.color.textSecondaryDark}`}>
          No hay datos de analíticas disponibles para esta landing page.
        </p>
      </Card>
    );
  }

  const { metrics } = analytics;

  const metricCards = [
    {
      id: 'visits',
      title: 'Visitas Totales',
      value: metrics.visits.toLocaleString(),
      subtitle: `${metrics.uniqueVisitors.toLocaleString()} visitantes únicos`,
      icon: <Eye className="w-5 h-5" />,
      color: 'primary' as const,
    },
    {
      id: 'leads',
      title: 'Leads Generados',
      value: metrics.leads.toLocaleString(),
      subtitle: `${metrics.conversionRate.toFixed(1)}% tasa de conversión`,
      icon: <Users className="w-5 h-5" />,
      color: 'success' as const,
    },
    {
      id: 'conversion',
      title: 'Tasa de Conversión',
      value: `${metrics.conversionRate.toFixed(1)}%`,
      subtitle: `${metrics.leads} leads de ${metrics.visits} visitas`,
      icon: <Target className="w-5 h-5" />,
      color: 'info' as const,
    },
    {
      id: 'bounce',
      title: 'Tasa de Rebote',
      value: `${metrics.bounceRate.toFixed(1)}%`,
      subtitle: metrics.bounceRate < 50 ? 'Excelente' : metrics.bounceRate < 70 ? 'Bueno' : 'A mejorar',
      icon: <TrendingUp className="w-5 h-5" />,
      color: metrics.bounceRate < 50 ? 'success' as const : metrics.bounceRate < 70 ? 'warning' as const : 'error' as const,
    },
  ];

  if (metrics.revenue) {
    metricCards.push({
      id: 'revenue',
      title: 'Ingresos Generados',
      value: `€${metrics.revenue.toLocaleString()}`,
      subtitle: 'Ventas directas desde la página',
      icon: <DollarSign className="w-5 h-5" />,
      color: 'warning' as const,
    });
  }

  const periodOptions = [
    { value: 'day', label: 'Último día' },
    { value: 'week', label: 'Última semana' },
    { value: 'month', label: 'Último mes' },
    { value: 'year', label: 'Último año' },
  ];

  return (
    <div className="space-y-6">
      {/* Selector de período */}
      <Card className={`p-4 ${ds.card}`}>
        <div className="flex items-center justify-between">
          <div>
            <h3 className={`${ds.typography.h2} ${ds.color.textPrimary} ${ds.color.textPrimaryDark} mb-2`}>
              Analíticas de Landing Page
            </h3>
            <p className={`${ds.typography.body} ${ds.color.textSecondary} ${ds.color.textSecondaryDark}`}>
              Métricas de rendimiento y conversión
            </p>
          </div>
          <Select
            value={period}
            onChange={(e) => setPeriod(e.target.value as typeof period)}
            options={periodOptions.map(opt => ({ value: opt.value, label: opt.label }))}
            className="w-48"
          />
        </div>
      </Card>

      {/* Métricas principales */}
      <MetricCards data={metricCards} columns={metricCards.length} />

      {/* Fuentes de tráfico */}
      {metrics.trafficSources && metrics.trafficSources.length > 0 && (
        <Card className={`p-6 ${ds.card}`}>
          <h4 className={`${ds.typography.h3} ${ds.color.textPrimary} ${ds.color.textPrimaryDark} mb-4`}>
            Fuentes de Tráfico
          </h4>
          <div className="space-y-4">
            {metrics.trafficSources.map((source, index) => {
              const sourceIcons = {
                direct: Globe,
                social: Share2,
                referral: Globe,
                search: Target,
                email: Mail,
                paid: DollarSign,
              };
              const Icon = sourceIcons[source.source] || Globe;
              const sourceLabels = {
                direct: 'Directo',
                social: 'Redes Sociales',
                referral: 'Referido',
                search: 'Búsqueda',
                email: 'Email',
                paid: 'Pago',
              };

              return (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-3 flex-1">
                    <div className={`p-2 ${ds.color.surface} ${ds.radius.md}`}>
                      <Icon className={`w-5 h-5 ${ds.color.textSecondary} ${ds.color.textSecondaryDark}`} />
                    </div>
                    <div>
                      <div className={`${ds.typography.bodySmall} font-medium ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
                        {sourceLabels[source.source] || source.source}
                      </div>
                      <div className={`${ds.typography.caption} ${ds.color.textSecondary} ${ds.color.textSecondaryDark}`}>
                        {source.visits.toLocaleString()} visitas
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className={`w-32 ${ds.color.surface2} ${ds.radius.full} h-2`}>
                      <div
                        className={`${ds.color.primaryBg} h-2 ${ds.radius.full} ${ds.animation.normal}`}
                        style={{ width: `${source.percentage}%` }}
                      />
                    </div>
                    <div className={`${ds.typography.bodySmall} font-semibold ${ds.color.textPrimary} ${ds.color.textPrimaryDark} w-16 text-right`}>
                      {source.percentage.toFixed(1)}%
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      )}

      {/* Gráfico de tendencias (placeholder) */}
      <Card className={`p-6 ${ds.card}`}>
        <h4 className={`${ds.typography.h3} ${ds.color.textPrimary} ${ds.color.textPrimaryDark} mb-4`}>
          Tendencias
        </h4>
        <div className={`h-64 flex items-center justify-center border-2 border-dashed ${ds.color.border} ${ds.radius.lg}`}>
          <div className="text-center">
            <BarChart3 size={48} className={`${ds.color.textMuted} ${ds.color.textMutedDark} mx-auto mb-2`} />
            <div className={`${ds.typography.body} ${ds.color.textSecondary} ${ds.color.textSecondaryDark}`}>
              Gráfico de tendencias (próximamente)
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

