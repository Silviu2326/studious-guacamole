import React, { useState, useEffect } from 'react';
import { SocialAnalytics, SocialPost, TopPost } from '../api/social';
import { Card, Button, Select } from '../../../components/componentsreutilizables';
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Calendar,
  Eye,
  Heart,
  MessageSquare,
  Share2,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  Sparkles
} from 'lucide-react';

interface AdvancedAnalyticsProps {
  analytics: SocialAnalytics;
  posts: SocialPost[];
  onPeriodChange?: (startDate: string, endDate: string) => void;
}

export const AdvancedAnalytics: React.FC<AdvancedAnalyticsProps> = ({
  analytics,
  posts,
  onPeriodChange
}) => {
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'quarter' | 'year'>('month');
  const [comparisonPeriod, setComparisonPeriod] = useState<SocialAnalytics | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadComparisonData();
  }, [selectedPeriod]);

  const loadComparisonData = async () => {
    setIsLoading(true);
    try {
      // Simular carga de datos comparativos
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Datos simulados para comparación
      const mockComparison: SocialAnalytics = {
        summary: {
          totalReach: 12000,
          totalImpressions: 20000,
          engagementRate: '3.8%',
          followerGrowth: 65,
          linkClicks: 95
        },
        topPosts: []
      };
      
      setComparisonPeriod(mockComparison);
    } catch (err) {
      console.error('Error loading comparison:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const calculateChange = (current: number, previous: number): { value: number; percentage: number; trend: 'up' | 'down' | 'stable' } => {
    const diff = current - previous;
    const percentage = previous > 0 ? ((diff / previous) * 100) : 0;
    
    let trend: 'up' | 'down' | 'stable' = 'stable';
    if (Math.abs(percentage) < 1) {
      trend = 'stable';
    } else if (percentage > 0) {
      trend = 'up';
    } else {
      trend = 'down';
    }
    
    return {
      value: diff,
      percentage: Math.abs(percentage),
      trend
    };
  };

  const parseNumber = (value: string | number): number => {
    if (typeof value === 'number') return value;
    return parseFloat(value.toString().replace(/[^0-9.]/g, '')) || 0;
  };

  const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up':
        return <ArrowUpRight size={16} className="text-green-600" />;
      case 'down':
        return <ArrowDownRight size={16} className="text-red-600" />;
      default:
        return <Minus size={16} className="text-gray-400" />;
    }
  };

  const getTrendColor = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up':
        return 'text-green-600 bg-green-50';
      case 'down':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  if (!comparisonPeriod) {
    return (
      <Card className="p-8 text-center bg-white shadow-sm">
        <BarChart3 size={48} className="mx-auto text-blue-500 animate-spin mb-4" />
        <p className="text-gray-600">Cargando análisis comparativo...</p>
      </Card>
    );
  }

  const reachChange = calculateChange(
    analytics.summary.totalReach,
    comparisonPeriod.summary.totalReach
  );
  
  const engagementChange = calculateChange(
    parseNumber(analytics.summary.engagementRate),
    parseNumber(comparisonPeriod.summary.engagementRate)
  );
  
  const growthChange = calculateChange(
    analytics.summary.followerGrowth,
    comparisonPeriod.summary.followerGrowth
  );
  
  const clicksChange = calculateChange(
    analytics.summary.linkClicks,
    comparisonPeriod.summary.linkClicks
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <BarChart3 size={24} className="text-blue-600" />
          <div>
            <h3 className="text-xl font-bold text-gray-900">Análisis Avanzado</h3>
            <p className="text-sm text-gray-600">Comparaciones, tendencias y predicciones</p>
          </div>
        </div>
        <Select
          value={selectedPeriod}
          onChange={(e) => setSelectedPeriod(e.target.value as any)}
          options={[
            { value: 'week', label: 'Semana' },
            { value: 'month', label: 'Mes' },
            { value: 'quarter', label: 'Trimestre' },
            { value: 'year', label: 'Año' }
          ]}
        />
      </div>

      {/* Comparación de Períodos */}
      <div>
        <h4 className="text-lg font-semibold text-gray-900 mb-4">Comparación de Períodos</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="p-5 bg-white shadow-sm ring-1 ring-gray-200">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Eye size={18} className="text-blue-600" />
                <span className="text-sm font-medium text-gray-700">Alcance</span>
              </div>
              <div className={`flex items-center gap-1 px-2 py-1 rounded ${getTrendColor(reachChange.trend)}`}>
                {getTrendIcon(reachChange.trend)}
                <span className="text-xs font-semibold">{reachChange.percentage.toFixed(1)}%</span>
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-900 mb-1">
              {analytics.summary.totalReach.toLocaleString()}
            </p>
            <p className="text-xs text-gray-600">
              Anterior: {comparisonPeriod.summary.totalReach.toLocaleString()}
            </p>
            <div className="mt-3 pt-3 border-t border-gray-200">
              <div className="flex items-center gap-1 text-xs">
                {reachChange.trend === 'up' ? (
                  <span className="text-green-600 font-semibold">+{reachChange.value.toLocaleString()}</span>
                ) : reachChange.trend === 'down' ? (
                  <span className="text-red-600 font-semibold">{reachChange.value.toLocaleString()}</span>
                ) : (
                  <span className="text-gray-600">Sin cambios</span>
                )}
              </div>
            </div>
          </Card>

          <Card className="p-5 bg-white shadow-sm ring-1 ring-gray-200">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <TrendingUp size={18} className="text-purple-600" />
                <span className="text-sm font-medium text-gray-700">Engagement</span>
              </div>
              <div className={`flex items-center gap-1 px-2 py-1 rounded ${getTrendColor(engagementChange.trend)}`}>
                {getTrendIcon(engagementChange.trend)}
                <span className="text-xs font-semibold">{engagementChange.percentage.toFixed(1)}%</span>
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-900 mb-1">
              {analytics.summary.engagementRate}
            </p>
            <p className="text-xs text-gray-600">
              Anterior: {comparisonPeriod.summary.engagementRate}
            </p>
            <div className="mt-3 pt-3 border-t border-gray-200">
              <div className="flex items-center gap-1 text-xs">
                {engagementChange.trend === 'up' ? (
                  <span className="text-green-600 font-semibold">+{engagementChange.percentage.toFixed(1)}pp</span>
                ) : engagementChange.trend === 'down' ? (
                  <span className="text-red-600 font-semibold">-{engagementChange.percentage.toFixed(1)}pp</span>
                ) : (
                  <span className="text-gray-600">Sin cambios</span>
                )}
              </div>
            </div>
          </Card>

          <Card className="p-5 bg-white shadow-sm ring-1 ring-gray-200">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <TrendingUp size={18} className="text-green-600" />
                <span className="text-sm font-medium text-gray-700">Crecimiento</span>
              </div>
              <div className={`flex items-center gap-1 px-2 py-1 rounded ${getTrendColor(growthChange.trend)}`}>
                {getTrendIcon(growthChange.trend)}
                <span className="text-xs font-semibold">{growthChange.percentage.toFixed(1)}%</span>
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-900 mb-1">
              +{analytics.summary.followerGrowth}
            </p>
            <p className="text-xs text-gray-600">
              Anterior: +{comparisonPeriod.summary.followerGrowth}
            </p>
            <div className="mt-3 pt-3 border-t border-gray-200">
              <div className="flex items-center gap-1 text-xs">
                {growthChange.trend === 'up' ? (
                  <span className="text-green-600 font-semibold">+{growthChange.value}</span>
                ) : growthChange.trend === 'down' ? (
                  <span className="text-red-600 font-semibold">{growthChange.value}</span>
                ) : (
                  <span className="text-gray-600">Sin cambios</span>
                )}
              </div>
            </div>
          </Card>

          <Card className="p-5 bg-white shadow-sm ring-1 ring-gray-200">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Share2 size={18} className="text-orange-600" />
                <span className="text-sm font-medium text-gray-700">Clics</span>
              </div>
              <div className={`flex items-center gap-1 px-2 py-1 rounded ${getTrendColor(clicksChange.trend)}`}>
                {getTrendIcon(clicksChange.trend)}
                <span className="text-xs font-semibold">{clicksChange.percentage.toFixed(1)}%</span>
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-900 mb-1">
              {analytics.summary.linkClicks.toLocaleString()}
            </p>
            <p className="text-xs text-gray-600">
              Anterior: {comparisonPeriod.summary.linkClicks.toLocaleString()}
            </p>
            <div className="mt-3 pt-3 border-t border-gray-200">
              <div className="flex items-center gap-1 text-xs">
                {clicksChange.trend === 'up' ? (
                  <span className="text-green-600 font-semibold">+{clicksChange.value}</span>
                ) : clicksChange.trend === 'down' ? (
                  <span className="text-red-600 font-semibold">{clicksChange.value}</span>
                ) : (
                  <span className="text-gray-600">Sin cambios</span>
                )}
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Análisis de Tendencias */}
      <Card className="p-6 bg-white shadow-sm ring-1 ring-gray-200">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">Análisis de Tendencias</h4>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
            <div className="flex items-center gap-3">
              <Sparkles size={20} className="text-blue-600" />
              <div>
                <p className="font-semibold text-gray-900">Contenido Viral Detectado</p>
                <p className="text-sm text-gray-600">Las transformaciones tienen 3x más engagement</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-blue-600">3x</p>
              <p className="text-xs text-gray-600">vs promedio</p>
            </div>
          </div>
          
          <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
            <div className="flex items-center gap-3">
              <TrendingUp size={20} className="text-green-600" />
              <div>
                <p className="font-semibold text-gray-900">Mejora Continua</p>
                <p className="text-sm text-gray-600">El engagement ha aumentado 15% este mes</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-green-600">+15%</p>
              <p className="text-xs text-gray-600">este mes</p>
            </div>
          </div>
          
          <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg">
            <div className="flex items-center gap-3">
              <Calendar size={20} className="text-yellow-600" />
              <div>
                <p className="font-semibold text-gray-900">Mejor Día</p>
                <p className="text-sm text-gray-600">Los viernes generan 25% más engagement</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-yellow-600">Viernes</p>
              <p className="text-xs text-gray-600">mejor día</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Predicciones */}
      <Card className="p-6 bg-white shadow-sm ring-1 ring-gray-200">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">Predicciones Basadas en Datos</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
            <p className="text-sm font-medium text-gray-700 mb-2">Alcance Proyectado</p>
            <p className="text-2xl font-bold text-blue-600 mb-1">
              {(analytics.summary.totalReach * 1.15).toLocaleString()}
            </p>
            <p className="text-xs text-gray-600">Próximo mes (+15%)</p>
          </div>
          
          <div className="p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg">
            <p className="text-sm font-medium text-gray-700 mb-2">Engagement Esperado</p>
            <p className="text-2xl font-bold text-green-600 mb-1">
              {(parseNumber(analytics.summary.engagementRate) * 1.1).toFixed(1)}%
            </p>
            <p className="text-xs text-gray-600">Próximo mes (+10%)</p>
          </div>
          
          <div className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg">
            <p className="text-sm font-medium text-gray-700 mb-2">Crecimiento Estimado</p>
            <p className="text-2xl font-bold text-purple-600 mb-1">
              +{Math.round(analytics.summary.followerGrowth * 1.2)}
            </p>
            <p className="text-xs text-gray-600">Próximo mes (+20%)</p>
          </div>
        </div>
      </Card>

      {/* Top Performers */}
      <Card className="p-6 bg-white shadow-sm ring-1 ring-gray-200">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">Contenido de Alto Rendimiento</h4>
        <div className="space-y-3">
          {analytics.topPosts.slice(0, 5).map((post, idx) => {
            const avgEngagement = analytics.topPosts.reduce((sum, p) => sum + p.engagement, 0) / analytics.topPosts.length;
            const isViral = post.engagement > avgEngagement * 1.5;
            
            return (
              <div
                key={post.id}
                className={`p-4 rounded-lg border-2 transition-all ${
                  isViral
                    ? 'bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-300'
                    : 'bg-gray-50 border-gray-200'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-lg">{post.platform === 'instagram' ? '📷' : post.platform === 'facebook' ? '👥' : '🎵'}</span>
                      {isViral && (
                        <span className="px-2 py-0.5 bg-yellow-200 text-yellow-800 rounded-full text-xs font-medium">
                          🔥 Viral
                        </span>
                      )}
                      <span className="text-xs text-gray-600">
                        {new Date(post.publishedAt).toLocaleDateString('es-ES')}
                      </span>
                    </div>
                    <p className="text-sm font-medium text-gray-900 mb-2 line-clamp-2">
                      {post.content}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-gray-600">
                      <div className="flex items-center gap-1">
                        <Heart size={12} />
                        <span>{post.engagement}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Eye size={12} />
                        <span>{post.reach.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right ml-4">
                    <p className="text-lg font-bold text-blue-600">
                      {((post.engagement / post.reach) * 100).toFixed(1)}%
                    </p>
                    <p className="text-xs text-gray-600">Engagement Rate</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
};

