import React from 'react';
import { TrendingUp, TrendingDown, Minus, Share2, Clock, DollarSign, MessageSquare, Heart, Send, Bookmark } from 'lucide-react';
import { Card, Badge } from '../../../components/componentsreutilizables';
import { SocialMediaMetrics as SocialMediaMetricsType, TrendDirection, SocialMediaPlatform } from '../types';

interface SocialMediaMetricsProps {
  metrics: SocialMediaMetricsType;
  loading?: boolean;
  className?: string;
}

const trendIcons: Record<TrendDirection, React.ComponentType<{ className?: string }>> = {
  up: TrendingUp,
  down: TrendingDown,
  neutral: Minus,
};

const trendColors: Record<TrendDirection, string> = {
  up: 'text-green-600 dark:text-green-400',
  down: 'text-red-600 dark:text-red-400',
  neutral: 'text-gray-600 dark:text-gray-400',
};

const platformLabels: Record<SocialMediaPlatform, string> = {
  instagram: 'Instagram',
  facebook: 'Facebook',
  tiktok: 'TikTok',
  youtube: 'YouTube',
  linkedin: 'LinkedIn',
};

const platformColors: Record<SocialMediaPlatform, string> = {
  instagram: 'bg-gradient-to-r from-purple-500 to-pink-500',
  facebook: 'bg-blue-600',
  tiktok: 'bg-black',
  youtube: 'bg-red-600',
  linkedin: 'bg-blue-700',
};

const formatTime = (minutes: number): string => {
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins > 0 ? `${hours}h ${mins}min` : `${hours}h`;
};

export const SocialMediaMetricsComponent: React.FC<SocialMediaMetricsProps> = ({
  metrics,
  loading = false,
  className = '',
}) => {
  if (loading) {
    return (
      <Card className={`p-6 ${className}`}>
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-24 bg-gray-100 dark:bg-gray-800 rounded"></div>
            ))}
          </div>
        </div>
      </Card>
    );
  }

  const periodLabels = {
    '7d': 'Últimos 7 días',
    '30d': 'Últimos 30 días',
    '90d': 'Últimos 90 días',
  };

  const TrendIcon = metrics.comparison ? trendIcons[metrics.comparison.trendDirection] : Minus;
  const trendColor = metrics.comparison ? trendColors[metrics.comparison.trendDirection] : '';

  return (
    <Card className={`p-6 ${className}`}>
      <div className="flex items-center gap-2 mb-6">
        <Share2 className="w-5 h-5 text-indigo-500" />
        <h2 className="text-xl font-semibold text-gray-900 dark:text-slate-100">
          Métricas de Redes Sociales
        </h2>
        <Badge variant="blue" size="sm" className="ml-auto">
          {periodLabels[metrics.period]}
        </Badge>
      </div>

      {/* Métricas principales */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="rounded-xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-4">
          <div className="text-sm text-gray-600 dark:text-slate-400 mb-1 flex items-center gap-1">
            <MessageSquare className="w-4 h-4" />
            Total Engagement
          </div>
          <div className="text-2xl font-bold text-gray-900 dark:text-slate-100">
            {metrics.totalEngagement.toLocaleString('es-ES')}
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-4">
          <div className="text-sm text-gray-600 dark:text-slate-400 mb-1 flex items-center gap-1">
            <TrendingUp className="w-4 h-4" />
            Leads Generados
          </div>
          <div className="text-2xl font-bold text-gray-900 dark:text-slate-100">
            {metrics.totalLeads}
          </div>
          <div className="text-xs text-gray-500 dark:text-slate-500 mt-1">
            {metrics.totalInquiries} consultas
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-4">
          <div className="text-sm text-gray-600 dark:text-slate-400 mb-1 flex items-center gap-1">
            <Clock className="w-4 h-4" />
            Tiempo Invertido
          </div>
          <div className="text-2xl font-bold text-gray-900 dark:text-slate-100">
            {formatTime(metrics.totalTimeInvestedMinutes)}
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-4">
          <div className="text-sm text-gray-600 dark:text-slate-400 mb-1 flex items-center gap-1">
            <DollarSign className="w-4 h-4" />
            ROI Promedio
          </div>
          <div className={`text-2xl font-bold ${trendColor}`}>
            {metrics.averageROI.toFixed(2)}x
          </div>
          {metrics.comparison && (
            <div className="text-xs text-gray-500 dark:text-slate-500 mt-1 flex items-center gap-1">
              <TrendIcon className="w-3 h-3" />
              {metrics.comparison.conversionRateChangePercentage > 0 ? '+' : ''}
              {metrics.comparison.conversionRateChangePercentage.toFixed(1)}% vs período anterior
            </div>
          )}
        </div>
      </div>

      {/* Métricas por plataforma */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-slate-100 mb-4">
          Por Plataforma
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {metrics.platforms.map((platform) => {
            const PlatformIcon = Share2;
            const TrendIcon = trendIcons[platform.trendDirection];
            const trendColor = trendColors[platform.trendDirection];

            return (
              <div
                key={platform.platform}
                className="rounded-xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-4"
              >
                <div className="flex items-center gap-2 mb-3">
                  <div className={`w-8 h-8 rounded-lg ${platformColors[platform.platform]} flex items-center justify-center`}>
                    <PlatformIcon className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-gray-900 dark:text-slate-100">
                      {platformLabels[platform.platform]}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-slate-500">
                      {platform.postsCount} publicaciones
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-slate-400">Engagement</span>
                    <span className="font-semibold text-gray-900 dark:text-slate-100">
                      {platform.totalEngagement.toLocaleString('es-ES')}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-slate-400">Leads</span>
                    <span className="font-semibold text-gray-900 dark:text-slate-100">
                      {platform.leadsGenerated}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-slate-400">Tasa conversión</span>
                    <span className="font-semibold text-gray-900 dark:text-slate-100">
                      {platform.engagementToLeadRate.toFixed(2)}%
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-slate-400">ROI</span>
                    <span className={`font-semibold ${trendColor} flex items-center gap-1`}>
                      {platform.roi.toFixed(2)}x
                      <TrendIcon className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Top Publicaciones */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-slate-100 mb-4">
          Top Publicaciones que Generan Más Leads
        </h3>
        <div className="space-y-3">
          {metrics.topPosts.map((post) => {
            const platformColor = platformColors[post.platform];

            return (
              <div
                key={post.id}
                className="rounded-xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-4"
              >
                <div className="flex items-start gap-4">
                  <div className={`w-10 h-10 rounded-lg ${platformColor} flex items-center justify-center flex-shrink-0`}>
                    <Share2 className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-sm font-semibold text-gray-900 dark:text-slate-100">
                        {platformLabels[post.platform]}
                      </span>
                      <span className="text-xs text-gray-500 dark:text-slate-500">
                        {new Date(post.publishedAt).toLocaleDateString('es-ES', {
                          day: 'numeric',
                          month: 'short',
                        })}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700 dark:text-slate-300 mb-3 line-clamp-2">
                      {post.content}
                    </p>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                      <div className="flex items-center gap-1 text-xs">
                        <Heart className="w-3 h-3 text-gray-500" />
                        <span className="text-gray-600 dark:text-slate-400">
                          {post.engagement.likes.toLocaleString('es-ES')}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-xs">
                        <MessageSquare className="w-3 h-3 text-gray-500" />
                        <span className="text-gray-600 dark:text-slate-400">
                          {post.engagement.comments}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-xs">
                        <Send className="w-3 h-3 text-gray-500" />
                        <span className="text-gray-600 dark:text-slate-400">
                          {post.engagement.shares}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-xs">
                        <Bookmark className="w-3 h-3 text-gray-500" />
                        <span className="text-gray-600 dark:text-slate-400">
                          {post.engagement.saves}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-xs">
                        <TrendingUp className="w-3 h-3 text-green-500" />
                        <span className="font-semibold text-gray-900 dark:text-slate-100">
                          {post.leadsGenerated} leads
                        </span>
                      </div>
                    </div>
                    <div className="mt-2 flex items-center justify-between text-xs">
                      <span className="text-gray-500 dark:text-slate-500">
                        ROI: {post.roi.toFixed(2)}x | Tiempo: {post.timeInvestedMinutes} min
                      </span>
                      <span className="text-gray-500 dark:text-slate-500">
                        Tasa conversión: {post.engagementToLeadRate.toFixed(2)}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Card>
  );
};

