import React from 'react';
import { Calendar, Mail, MessageSquare, Send, Layers, Image as ImageIcon, Instagram, Linkedin, Facebook, Sparkles, TrendingUp, Clock, CheckCircle2, PlayCircle, FileText, Target, Users } from 'lucide-react';
import { Badge, Button, Card } from '../../../components/componentsreutilizables';
import { ds } from '../../adherencia/ui/ds';
import { WeeklyAIStrategy, WeeklyStrategyMessage, WeeklyStrategyFunnel, WeeklyStrategyPost } from '../types';

interface WeeklyAIStrategyProps {
  strategy: WeeklyAIStrategy | null;
  loading?: boolean;
  className?: string;
  onExecute?: (strategy: WeeklyAIStrategy) => void;
  onApprove?: (strategy: WeeklyAIStrategy) => void;
}

const platformIcon: Record<WeeklyStrategyPost['platform'], React.ReactNode> = {
  instagram: <Instagram className="w-4 h-4" />,
  linkedin: <Linkedin className="w-4 h-4" />,
  tiktok: <ImageIcon className="w-4 h-4" />,
  facebook: <Facebook className="w-4 h-4" />,
};

const platformLabel: Record<WeeklyStrategyPost['platform'], string> = {
  instagram: 'Instagram',
  linkedin: 'LinkedIn',
  tiktok: 'TikTok',
  facebook: 'Facebook',
};

const typeLabel: Record<WeeklyStrategyPost['type'], string> = {
  post: 'Post',
  reel: 'Reel',
  story: 'Story',
  carousel: 'Carrusel',
};

const messageTypeIcon: Record<WeeklyStrategyMessage['type'], React.ReactNode> = {
  email: <Mail className="w-4 h-4" />,
  sms: <MessageSquare className="w-4 h-4" />,
  push: <Send className="w-4 h-4" />,
};

const messageTypeLabel: Record<WeeklyStrategyMessage['type'], string> = {
  email: 'Email',
  sms: 'SMS',
  push: 'Push',
};

const statusLabel: Record<WeeklyAIStrategy['status'], string> = {
  draft: 'Borrador',
  approved: 'Aprobada',
  executing: 'Ejecutando',
  completed: 'Completada',
};

const statusColor: Record<WeeklyAIStrategy['status'], 'success' | 'warning' | 'info' | 'secondary'> = {
  draft: 'secondary',
  approved: 'info',
  executing: 'warning',
  completed: 'success',
};

const stageLabel: Record<WeeklyStrategyFunnel['stage'], string> = {
  TOFU: 'Prospección',
  MOFU: 'Nurturing',
  BOFU: 'Cierre',
};

const stageColor: Record<WeeklyStrategyFunnel['stage'], string> = {
  TOFU: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300',
  MOFU: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
  BOFU: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
};

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0,
  }).format(value);
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export const WeeklyAIStrategyComponent: React.FC<WeeklyAIStrategyProps> = ({
  strategy,
  loading = false,
  className = '',
  onExecute,
  onApprove,
}) => {
  const placeholders = Array.from({ length: 3 }).map((_, index) => (
    <div key={`strategy-skeleton-${index}`} className={`${ds.shimmer} h-32`} />
  ));

  if (loading && !strategy) {
    return (
      <Card className={`col-span-2 ${className}`.trim()}>
        <div className="space-y-4">{placeholders}</div>
      </Card>
    );
  }

  if (!strategy) {
    return (
      <Card className={`col-span-2 ${className}`.trim()}>
        <div className="text-center py-8">
          <Sparkles className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className={`${ds.typography.bodySmall} ${ds.color.textSecondary} ${ds.color.textSecondaryDark}`}>
            No hay estrategia semanal disponible. Genera una nueva estrategia para esta semana.
          </p>
        </div>
      </Card>
    );
  }

  return (
    <Card className={`col-span-2 ${className}`.trim()}>
      <div className="flex items-start justify-between mb-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-100 to-pink-200 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-purple-600" />
            </span>
            <div>
              <h2 className={`${ds.typography.h2} ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
                Estrategia IA Semanal
              </h2>
              <p className={`${ds.typography.bodySmall} ${ds.color.textSecondary} ${ds.color.textSecondaryDark}`}>
                {formatDate(strategy.weekStartDate)} - {formatDate(strategy.weekEndDate)}
              </p>
            </div>
          </div>
          <p className={`${ds.typography.bodySmall} ${ds.color.textSecondary} ${ds.color.textSecondaryDark} max-w-2xl`}>
            {strategy.strategicFocus}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={statusColor[strategy.status]}>{statusLabel[strategy.status]}</Badge>
          {strategy.status === 'draft' && onApprove && (
            <Button variant="primary" size="sm" onClick={() => onApprove(strategy)}>
              Aprobar
            </Button>
          )}
          {strategy.status === 'approved' && onExecute && (
            <Button variant="success" size="sm" onClick={() => onExecute(strategy)}>
              Ejecutar
            </Button>
          )}
        </div>
      </div>

      {/* Objectives */}
      {strategy.objectives && strategy.objectives.length > 0 && (
        <div className="mb-6 rounded-2xl border border-indigo-200 dark:border-indigo-800 bg-indigo-50/50 dark:bg-indigo-900/10 p-4">
          <div className="flex items-center gap-2 mb-3">
            <Target className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <h3 className={`${ds.typography.h3} ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
              Objetivos de la Semana
            </h3>
          </div>
          <ul className="space-y-2">
            {strategy.objectives.map((objective, index) => (
              <li key={index} className="flex items-start gap-2">
                <span className="text-indigo-600 dark:text-indigo-400 mt-1">•</span>
                <p className={`${ds.typography.bodySmall} ${ds.color.textSecondary} ${ds.color.textSecondaryDark}`}>
                  {objective}
                </p>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Expected Results */}
      <div className="mb-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-gray-100 dark:border-gray-800 p-4 bg-gradient-to-br from-white to-gray-50 dark:from-[#111827] dark:to-[#1f2937]">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-emerald-500" />
            <p className={`${ds.typography.caption} ${ds.color.textMuted} ${ds.color.textMutedDark}`}>
              Revenue Estimado
            </p>
          </div>
          <p className={`${ds.typography.h3} ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
            {formatCurrency(strategy.expectedResults.estimatedRevenue)}
          </p>
        </div>
        <div className="rounded-2xl border border-gray-100 dark:border-gray-800 p-4 bg-gradient-to-br from-white to-gray-50 dark:from-[#111827] dark:to-[#1f2937]">
          <div className="flex items-center gap-2 mb-2">
            <Users className="w-4 h-4 text-blue-500" />
            <p className={`${ds.typography.caption} ${ds.color.textMuted} ${ds.color.textMutedDark}`}>
              Leads Estimados
            </p>
          </div>
          <p className={`${ds.typography.h3} ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
            {strategy.expectedResults.estimatedLeads}
          </p>
        </div>
        <div className="rounded-2xl border border-gray-100 dark:border-gray-800 p-4 bg-gradient-to-br from-white to-gray-50 dark:from-[#111827] dark:to-[#1f2937]">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-4 h-4 text-purple-500" />
            <p className={`${ds.typography.caption} ${ds.color.textMuted} ${ds.color.textMutedDark}`}>
              Engagement Estimado
            </p>
          </div>
          <p className={`${ds.typography.h3} ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
            {strategy.expectedResults.estimatedEngagement.toLocaleString('es-ES')}
          </p>
        </div>
      </div>

      {/* Messages */}
      {strategy.messages && strategy.messages.length > 0 && (
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Mail className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <h3 className={`${ds.typography.h3} ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
              Mensajes ({strategy.messages.length})
            </h3>
          </div>
          <div className="space-y-3">
            {strategy.messages.map((message) => (
              <div
                key={message.id}
                className="rounded-2xl border border-gray-100 dark:border-gray-800 p-4 bg-gradient-to-br from-white to-gray-50 dark:from-[#111827] dark:to-[#1f2937]"
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex items-center gap-2">
                    {messageTypeIcon[message.type]}
                    <Badge variant="secondary" size="sm">
                      {messageTypeLabel[message.type]}
                    </Badge>
                    {message.subject && (
                      <span className={`${ds.typography.bodySmall} font-semibold ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
                        {message.subject}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={message.estimatedImpact === 'high' ? 'success' : message.estimatedImpact === 'medium' ? 'warning' : 'secondary'} size="sm">
                      {message.estimatedImpact === 'high' ? 'Alto' : message.estimatedImpact === 'medium' ? 'Medio' : 'Bajo'}
                    </Badge>
                    <Clock className="w-4 h-4 text-gray-400" />
                    <span className={`${ds.typography.caption} ${ds.color.textMuted} ${ds.color.textMutedDark}`}>
                      {formatDate(message.sendDate)}
                    </span>
                  </div>
                </div>
                <p className={`${ds.typography.bodySmall} ${ds.color.textSecondary} ${ds.color.textSecondaryDark} mb-2`}>
                  {message.content}
                </p>
                <p className={`${ds.typography.caption} ${ds.color.textMuted} ${ds.color.textMutedDark}`}>
                  Audiencia: {message.targetAudience}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Funnels */}
      {strategy.funnels && strategy.funnels.length > 0 && (
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Layers className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <h3 className={`${ds.typography.h3} ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
              Funnels ({strategy.funnels.length})
            </h3>
          </div>
          <div className="space-y-3">
            {strategy.funnels
              .sort((a, b) => a.priority - b.priority)
              .map((funnel) => (
                <div
                  key={funnel.id}
                  className="rounded-2xl border border-gray-100 dark:border-gray-800 p-4 bg-gradient-to-br from-white to-gray-50 dark:from-[#111827] dark:to-[#1f2937]"
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex items-center gap-2">
                      <Badge className={stageColor[funnel.stage]} size="sm">
                        {stageLabel[funnel.stage]}
                      </Badge>
                      <span className={`${ds.typography.bodyLarge} font-semibold ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
                        {funnel.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" size="sm">
                        Prioridad {funnel.priority}
                      </Badge>
                    </div>
                  </div>
                  <p className={`${ds.typography.bodySmall} ${ds.color.textSecondary} ${ds.color.textSecondaryDark} mb-3`}>
                    {funnel.description}
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <p className={`${ds.typography.caption} ${ds.color.textMuted} ${ds.color.textMutedDark}`}>
                        Revenue Estimado
                      </p>
                      <p className={`${ds.typography.bodyLarge} font-semibold ${ds.color.textPrimaryDark}`}>
                        {formatCurrency(funnel.estimatedRevenue)}
                      </p>
                    </div>
                    <div>
                      <p className={`${ds.typography.caption} ${ds.color.textMuted} ${ds.color.textMutedDark}`}>
                        Conversión Estimada
                      </p>
                      <p className={`${ds.typography.bodyLarge} font-semibold ${ds.color.textPrimaryDark}`}>
                        {funnel.estimatedConversion.toFixed(1)}%
                      </p>
                    </div>
                    <div>
                      <p className={`${ds.typography.caption} ${ds.color.textMuted} ${ds.color.textMutedDark}`}>
                        Acción Recomendada
                      </p>
                      <p className={`${ds.typography.bodySmall} ${ds.color.textSecondary} ${ds.color.textSecondaryDark}`}>
                        {funnel.recommendedAction}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Posts */}
      {strategy.posts && strategy.posts.length > 0 && (
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-4">
            <ImageIcon className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <h3 className={`${ds.typography.h3} ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
              Publicaciones ({strategy.posts.length})
            </h3>
          </div>
          <div className="space-y-3">
            {strategy.posts
              .sort((a, b) => new Date(a.publishDate).getTime() - new Date(b.publishDate).getTime())
              .map((post) => (
                <div
                  key={post.id}
                  className="rounded-2xl border border-gray-100 dark:border-gray-800 p-4 bg-gradient-to-br from-white to-gray-50 dark:from-[#111827] dark:to-[#1f2937]"
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex items-center gap-2">
                      {platformIcon[post.platform]}
                      <Badge variant="secondary" size="sm">
                        {platformLabel[post.platform]}
                      </Badge>
                      <Badge variant="info" size="sm">
                        {typeLabel[post.type]}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <span className={`${ds.typography.caption} ${ds.color.textMuted} ${ds.color.textMutedDark}`}>
                        {formatDate(post.publishDate)}
                      </span>
                    </div>
                  </div>
                  <p className={`${ds.typography.bodySmall} ${ds.color.textSecondary} ${ds.color.textSecondaryDark} mb-3`}>
                    {post.caption}
                  </p>
                  {post.hashtags && post.hashtags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-3">
                      {post.hashtags.map((tag, index) => (
                        <Badge key={index} variant="secondary" size="sm">
                          #{tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <p className={`${ds.typography.caption} ${ds.color.textMuted} ${ds.color.textMutedDark}`}>
                        Engagement Estimado
                      </p>
                      <p className={`${ds.typography.bodyLarge} font-semibold ${ds.color.textPrimaryDark}`}>
                        {post.estimatedEngagement.toLocaleString('es-ES')}
                      </p>
                    </div>
                    <div>
                      <p className={`${ds.typography.caption} ${ds.color.textMuted} ${ds.color.textMutedDark}`}>
                        Alcance Estimado
                      </p>
                      <p className={`${ds.typography.bodyLarge} font-semibold ${ds.color.textPrimaryDark}`}>
                        {post.estimatedReach.toLocaleString('es-ES')}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Execution Progress */}
      {strategy.status === 'executing' && (
        <div className="mt-6 rounded-2xl border border-indigo-200 dark:border-indigo-800 bg-indigo-50/50 dark:bg-indigo-900/10 p-4">
          <div className="flex items-center justify-between mb-2">
            <span className={`${ds.typography.bodySmall} font-semibold ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
              Progreso de Ejecución
            </span>
            <span className={`${ds.typography.bodySmall} ${ds.color.textSecondary} ${ds.color.textSecondaryDark}`}>
              {strategy.executionProgress}%
            </span>
          </div>
          <div className="h-2 rounded-full bg-gray-200 dark:bg-gray-700">
            <div
              className="h-2 rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 transition-all"
              style={{ width: `${strategy.executionProgress}%` }}
            />
          </div>
        </div>
      )}

      {/* Personalization Info */}
      {strategy.personalizationBasedOn && (
        <div className="mt-6 rounded-2xl border border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/10 p-4">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-4 h-4 text-gray-600 dark:text-gray-400" />
            <p className={`${ds.typography.caption} font-semibold ${ds.color.textSecondary} ${ds.color.textSecondaryDark}`}>
              Personalizada basada en:
            </p>
          </div>
          <ul className="space-y-1">
            {strategy.personalizationBasedOn.strategicProfile && (
              <li className={`${ds.typography.caption} ${ds.color.textMuted} ${ds.color.textMutedDark}`}>
                • Perfil estratégico configurado
              </li>
            )}
            {strategy.personalizationBasedOn.quarterlyObjectives && (
              <li className={`${ds.typography.caption} ${ds.color.textMuted} ${ds.color.textMutedDark}`}>
                • Objetivos trimestrales
              </li>
            )}
            {strategy.personalizationBasedOn.performanceData && (
              <li className={`${ds.typography.caption} ${ds.color.textMuted} ${ds.color.textMutedDark}`}>
                • Datos de performance
              </li>
            )}
          </ul>
        </div>
      )}
    </Card>
  );
};

