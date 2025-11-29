import React, { useState, useEffect } from 'react';
import { Card, Button, Badge, Select } from '../../../components/componentsreutilizables';
import { AIOverviewResponse, AIOverviewNarrative } from '../types';
import { getAIOverview } from '../services/intelligenceService';
import {
  TrendingUp,
  TrendingDown,
  Minus,
  Megaphone,
  Users,
  ShoppingCart,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  AlertTriangle,
  Loader2,
  RefreshCw,
  ArrowRight,
} from 'lucide-react';

interface AIOverviewSectionProps {
  period?: '7d' | '30d' | '90d';
  onPeriodChange?: (period: '7d' | '30d' | '90d') => void;
}

const sentimentIcons = {
  positive: CheckCircle2,
  neutral: Minus,
  warning: AlertTriangle,
  critical: AlertCircle,
};

const sentimentColors = {
  positive: 'text-emerald-600 bg-emerald-50 border-emerald-200',
  neutral: 'text-slate-600 bg-slate-50 border-slate-200',
  warning: 'text-amber-600 bg-amber-50 border-amber-200',
  critical: 'text-red-600 bg-red-50 border-red-200',
};

const categoryIcons = {
  marketing: Megaphone,
  community: Users,
  sales: ShoppingCart,
  integrated: Sparkles,
};

const categoryColors = {
  marketing: 'text-blue-600 bg-blue-50',
  community: 'text-purple-600 bg-purple-50',
  sales: 'text-green-600 bg-green-50',
  integrated: 'text-indigo-600 bg-indigo-50',
};

export const AIOverviewSection: React.FC<AIOverviewSectionProps> = ({
  period = '30d',
  onPeriodChange,
}) => {
  const [data, setData] = useState<AIOverviewResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [hasError, setHasError] = useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] = useState<'all' | AIOverviewNarrative['category']>('all');

  useEffect(() => {
    loadData();
  }, [period]);

  const loadData = async () => {
    try {
      setIsLoading(true);
      setHasError(false);
      const overviewData = await getAIOverview(period);
      setData(overviewData);
    } catch (error) {
      console.error('Error cargando overview IA', error);
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatPercentage = (value: number) => {
    return `${value >= 0 ? '+' : ''}${value.toFixed(1)}%`;
  };

  const filteredNarratives = data?.narratives.filter((narrative) => {
    if (selectedCategory === 'all') return true;
    return narrative.category === selectedCategory;
  }) || [];

  if (isLoading) {
    return (
      <Card className="p-12 flex items-center justify-center bg-white shadow-sm border border-slate-200/70">
        <div className="flex items-center gap-3 text-slate-500">
          <Loader2 className="animate-spin" size={20} />
          <span>Analizando tus datos...</span>
        </div>
      </Card>
    );
  }

  if (hasError || !data) {
    return (
      <Card className="p-8 bg-white shadow-sm border border-red-200">
        <div className="flex items-center justify-between">
          <p className="text-sm text-red-600">Ocurrió un problema al cargar los datos.</p>
          <Button variant="ghost" size="sm" onClick={loadData}>
            <RefreshCw size={16} className="mr-2" />
            Reintentar
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header con controles */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Overview IA</h2>
          <p className="text-sm text-slate-600 mt-1">
            Vista integrada de marketing, comunidad y ventas en lenguaje claro
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Select
            value={period}
            onChange={(e) => {
              const newPeriod = e.target.value as '7d' | '30d' | '90d';
              onPeriodChange?.(newPeriod);
            }}
            className="min-w-[120px]"
          >
            <option value="7d">Últimos 7 días</option>
            <option value="30d">Últimos 30 días</option>
            <option value="90d">Últimos 90 días</option>
          </Select>
          <Button variant="ghost" size="sm" onClick={loadData}>
            <RefreshCw size={16} />
          </Button>
        </div>
      </div>

      {/* Resumen ejecutivo */}
      <Card className="p-6 bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200/50">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg bg-indigo-100 text-indigo-600">
            <Sparkles size={20} />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-slate-900 mb-2">Resumen ejecutivo</h3>
            <p className="text-sm text-slate-700 leading-relaxed">{data.summary}</p>
          </div>
        </div>
      </Card>

      {/* Métricas clave */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Marketing */}
        <Card className="p-5 bg-white border border-blue-200/50">
          <div className="flex items-center gap-2 mb-3">
            <div className="p-2 rounded-lg bg-blue-100 text-blue-600">
              <Megaphone size={18} />
            </div>
            <h3 className="font-semibold text-slate-900">Marketing</h3>
          </div>
          <div className="space-y-2">
            <div>
              <p className="text-xs text-slate-600">Ingresos</p>
              <p className="text-lg font-bold text-slate-900">{formatCurrency(data.marketing.totalRevenue)}</p>
              <div className="flex items-center gap-1 text-xs text-emerald-600">
                <TrendingUp size={12} />
                <span>{formatPercentage(data.marketing.revenueGrowth)}</span>
              </div>
            </div>
            <div>
              <p className="text-xs text-slate-600">Leads</p>
              <p className="text-sm font-semibold text-slate-900">{data.marketing.totalLeads}</p>
              <div className="flex items-center gap-1 text-xs text-emerald-600">
                <TrendingUp size={12} />
                <span>{formatPercentage(data.marketing.leadsGrowth)}</span>
              </div>
            </div>
            <div>
              <p className="text-xs text-slate-600">Conversión</p>
              <p className="text-sm font-semibold text-slate-900">{data.marketing.conversionRate}%</p>
            </div>
            <div>
              <p className="text-xs text-slate-600">Canal top</p>
              <p className="text-sm font-semibold text-slate-900">{data.marketing.topPerformingChannel}</p>
            </div>
          </div>
        </Card>

        {/* Comunidad */}
        <Card className="p-5 bg-white border border-purple-200/50">
          <div className="flex items-center gap-2 mb-3">
            <div className="p-2 rounded-lg bg-purple-100 text-purple-600">
              <Users size={18} />
            </div>
            <h3 className="font-semibold text-slate-900">Comunidad</h3>
          </div>
          <div className="space-y-2">
            <div>
              <p className="text-xs text-slate-600">Miembros activos</p>
              <p className="text-lg font-bold text-slate-900">{data.community.activeMembers}</p>
            </div>
            <div>
              <p className="text-xs text-slate-600">Engagement</p>
              <p className="text-sm font-semibold text-slate-900">{data.community.engagementRate}%</p>
            </div>
            <div>
              <p className="text-xs text-slate-600">NPS</p>
              <p className="text-sm font-semibold text-slate-900">{data.community.nps}</p>
            </div>
            <div>
              <p className="text-xs text-slate-600">Promotores</p>
              <p className="text-sm font-semibold text-slate-900">{data.community.advocatesCount}</p>
            </div>
            <div>
              <p className="text-xs text-slate-600">Retención +</p>
              <p className="text-sm font-semibold text-emerald-600">{data.community.retentionLift}%</p>
            </div>
          </div>
        </Card>

        {/* Ventas */}
        <Card className="p-5 bg-white border border-green-200/50">
          <div className="flex items-center gap-2 mb-3">
            <div className="p-2 rounded-lg bg-green-100 text-green-600">
              <ShoppingCart size={18} />
            </div>
            <h3 className="font-semibold text-slate-900">Ventas</h3>
          </div>
          <div className="space-y-2">
            <div>
              <p className="text-xs text-slate-600">Ventas totales</p>
              <p className="text-lg font-bold text-slate-900">{data.sales.totalSales}</p>
              <div className="flex items-center gap-1 text-xs text-emerald-600">
                <TrendingUp size={12} />
                <span>{formatPercentage(data.sales.salesGrowth)}</span>
              </div>
            </div>
            <div>
              <p className="text-xs text-slate-600">Ticket promedio</p>
              <p className="text-sm font-semibold text-slate-900">{formatCurrency(data.sales.averageOrderValue)}</p>
            </div>
            <div>
              <p className="text-xs text-slate-600">Pipeline</p>
              <p className="text-sm font-semibold text-slate-900">{formatCurrency(data.sales.pipelineValue)}</p>
            </div>
            <div>
              <p className="text-xs text-slate-600">Deals cerrados</p>
              <p className="text-sm font-semibold text-slate-900">{data.sales.closedDeals}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Filtro de categorías */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-sm text-slate-600">Filtrar por:</span>
        <Button
          variant={selectedCategory === 'all' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setSelectedCategory('all')}
        >
          Todas
        </Button>
        <Button
          variant={selectedCategory === 'integrated' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setSelectedCategory('integrated')}
        >
          Integradas
        </Button>
        <Button
          variant={selectedCategory === 'marketing' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setSelectedCategory('marketing')}
        >
          Marketing
        </Button>
        <Button
          variant={selectedCategory === 'community' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setSelectedCategory('community')}
        >
          Comunidad
        </Button>
        <Button
          variant={selectedCategory === 'sales' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setSelectedCategory('sales')}
        >
          Ventas
        </Button>
      </div>

      {/* Narrativas */}
      <div className="space-y-4">
        {filteredNarratives.map((narrative) => {
          const SentimentIcon = sentimentIcons[narrative.sentiment];
          const CategoryIcon = categoryIcons[narrative.category];
          const sentimentColorClass = sentimentColors[narrative.sentiment];
          const categoryColorClass = categoryColors[narrative.category];

          return (
            <Card key={narrative.id} className={`p-6 bg-white border ${sentimentColorClass}`}>
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-lg ${categoryColorClass}`}>
                  <CategoryIcon size={24} />
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div>
                      <h3 className="font-semibold text-slate-900 mb-1">{narrative.title}</h3>
                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge variant="outline" className={categoryColorClass}>
                          {narrative.category}
                        </Badge>
                        <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs ${sentimentColorClass}`}>
                          <SentimentIcon size={12} />
                          <span className="capitalize">{narrative.sentiment}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-slate-700 leading-relaxed mb-4">{narrative.narrative}</p>
                  {narrative.keyMetrics && narrative.keyMetrics.length > 0 && (
                    <div className="mb-4">
                      <p className="text-xs font-semibold text-slate-600 mb-2">Métricas clave:</p>
                      <div className="flex flex-wrap gap-2">
                        {narrative.keyMetrics.map((metric, idx) => (
                          <Badge key={idx} variant="secondary" className="text-xs">
                            {metric}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  {narrative.recommendations && narrative.recommendations.length > 0 && (
                    <div>
                      <p className="text-xs font-semibold text-slate-600 mb-2">Recomendaciones:</p>
                      <ul className="space-y-1">
                        {narrative.recommendations.map((recommendation, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-sm text-slate-700">
                            <ArrowRight size={14} className="mt-1 text-slate-400 flex-shrink-0" />
                            <span>{recommendation}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {filteredNarratives.length === 0 && (
        <Card className="p-8 bg-white border border-slate-200">
          <p className="text-sm text-slate-600 text-center">
            No hay narrativas disponibles para la categoría seleccionada.
          </p>
        </Card>
      )}
    </div>
  );
};

export default AIOverviewSection;
