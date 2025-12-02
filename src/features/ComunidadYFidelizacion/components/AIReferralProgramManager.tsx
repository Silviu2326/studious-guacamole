import { useState } from 'react';
import {
  Sparkles,
  Gift,
  Users,
  TrendingUp,
  Settings,
  Plus,
  Edit,
  Brain,
  Target,
  MessageSquare,
  BarChart3,
  Zap,
} from 'lucide-react';
import { Card, Badge, Button, Tabs } from '../../../components/componentsreutilizables';
import {
  AIReferralProgram,
  SegmentBasedReward,
  CustomerSegmentType,
  RewardType,
  ReferralStats,
} from '../types';

interface AIReferralProgramManagerProps {
  program?: AIReferralProgram;
  stats?: ReferralStats;
  customerSegments?: { segmentType: CustomerSegmentType; count: number }[];
  loading?: boolean;
  onCreateProgram?: () => void;
  onEditProgram?: (programId: string) => void;
  onEnableAI?: (programId: string) => void;
  onGenerateSegmentRewards?: (programId: string) => void;
  onUpdateSegmentReward?: (programId: string, segmentReward: SegmentBasedReward) => void;
  onAnalyzeWithAI?: (programId: string) => void;
}

const SEGMENT_LABELS: Record<CustomerSegmentType, string> = {
  embajador: 'Embajadores',
  nuevo: 'Nuevos',
  riesgo: 'En Riesgo',
  regular: 'Regulares',
  vip: 'VIP',
};

const SEGMENT_COLORS: Record<CustomerSegmentType, string> = {
  embajador: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
  nuevo: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
  riesgo: 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300',
  regular: 'bg-slate-100 text-slate-700 dark:bg-slate-800/60 dark:text-slate-300',
  vip: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
};

const REWARD_TYPE_LABELS: Record<RewardType, string> = {
  descuento: 'Descuento',
  'sesion-gratis': 'Sesión Gratis',
  bono: 'Bono',
  producto: 'Producto',
  personalizado: 'Personalizado',
};

export function AIReferralProgramManager({
  program,
  stats,
  customerSegments = [],
  loading,
  onCreateProgram,
  onEditProgram,
  onEnableAI,
  onGenerateSegmentRewards,
  onUpdateSegmentReward,
  onAnalyzeWithAI,
}: AIReferralProgramManagerProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'segments' | 'ai-insights'>('overview');

  const formatRewardValue = (type: RewardType, value: number, currency?: string): string => {
    switch (type) {
      case 'descuento':
        return `${value}%`;
      case 'sesion-gratis':
        return `${value} sesión${value > 1 ? 'es' : ''}`;
      case 'bono':
        return `${currency || '$'}${value}`;
      default:
        return String(value);
    }
  };

  if (loading) {
    return (
      <Card className="bg-white/90 dark:bg-slate-900/80 shadow-sm border border-slate-200/60 dark:border-slate-800/60">
        <div className="animate-pulse space-y-4">
          <div className="h-6 w-48 rounded-md bg-slate-200/70 dark:bg-slate-800/70" />
          <div className="h-32 rounded-lg bg-slate-200/60 dark:bg-slate-800/60" />
        </div>
      </Card>
    );
  }

  if (!program) {
    return (
      <Card className="bg-white/90 dark:bg-slate-900/80 shadow-sm border border-slate-200/60 dark:border-slate-800/60">
        <div className="text-center py-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="w-12 h-12 text-indigo-600 dark:text-indigo-400" />
            <Brain className="w-12 h-12 text-purple-600 dark:text-purple-400" />
          </div>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">
            Programa de Referidos con IA
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 max-w-md mx-auto">
            Crea programas de referidos inteligentes que adaptan recompensas y mensajes a cada segmento de clientes
            para maximizar el crecimiento orgánico.
          </p>
          <Button variant="primary" onClick={onCreateProgram} className="inline-flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Crear programa de referidos IA
          </Button>
        </div>
      </Card>
    );
  }

  const tabs = [
    { id: 'overview', label: 'Resumen', icon: <BarChart3 className="w-4 h-4" /> },
    { id: 'segments', label: 'Recompensas por Segmento', icon: <Target className="w-4 h-4" /> },
    { id: 'ai-insights', label: 'Insights IA', icon: <Brain className="w-4 h-4" /> },
  ];

  return (
    <Card className="bg-white/90 dark:bg-slate-900/80 shadow-sm border border-slate-200/60 dark:border-slate-800/60">
      <header className="flex items-start justify-between gap-4 mb-6">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <div className="flex items-center gap-2">
              <Gift className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">{program.name}</h3>
            </div>
            <Badge variant={program.isActive ? 'blue' : 'secondary'} size="sm">
              {program.isActive ? 'Activo' : 'Inactivo'}
            </Badge>
            {program.isAIEnabled && (
              <Badge variant="purple" size="sm" className="inline-flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                IA Activada
              </Badge>
            )}
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400">{program.description}</p>
        </div>
        <div className="flex gap-2">
          {!program.isAIEnabled && (
            <Button
              variant="secondary"
              size="sm"
              onClick={() => onEnableAI?.(program.id)}
              className="inline-flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              Activar IA
            </Button>
          )}
          <Button variant="secondary" size="sm" onClick={() => onEditProgram?.(program.id)}>
            <Edit className="w-4 h-4" />
          </Button>
        </div>
      </header>

      <div className="mb-6">
        <Tabs items={tabs} activeTab={activeTab} onTabChange={setActiveTab} variant="pills" size="sm" />
      </div>

      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="rounded-xl border border-slate-200/60 dark:border-slate-800/60 bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-950 p-4">
              <div className="flex items-center gap-2 mb-2">
                <Users className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Total Referidos</span>
              </div>
              <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">{program.totalReferrals}</p>
            </div>
            <div className="rounded-xl border border-slate-200/60 dark:border-slate-800/60 bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-950 p-4">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Convertidos</span>
              </div>
              <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                {program.convertedReferrals}
              </p>
            </div>
            <div className="rounded-xl border border-slate-200/60 dark:border-slate-800/60 bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-950 p-4">
              <div className="flex items-center gap-2 mb-2">
                <Gift className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Recompensas</span>
              </div>
              <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                {program.totalRewardsGiven}
              </p>
            </div>
          </div>

          {program.isAIEnabled && (
            <div className="rounded-xl border border-indigo-200/50 dark:border-indigo-800/50 bg-indigo-50/50 dark:bg-indigo-900/20 p-5">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-1 flex items-center gap-2">
                    <Brain className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                    Adaptación Automática por IA
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    {program.autoAdaptEnabled
                      ? 'La IA está adaptando automáticamente recompensas y mensajes según el rendimiento de cada segmento.'
                      : 'Activa la adaptación automática para que la IA optimice el programa continuamente.'}
                  </p>
                </div>
                <Badge variant={program.autoAdaptEnabled ? 'blue' : 'secondary'} size="sm">
                  {program.autoAdaptEnabled ? 'Activa' : 'Inactiva'}
                </Badge>
              </div>
              {program.lastAIAnalysis && (
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">
                  Última análisis: {new Date(program.lastAIAnalysis).toLocaleDateString('es-ES')}
                </p>
              )}
              <Button
                variant="primary"
                size="sm"
                onClick={() => onAnalyzeWithAI?.(program.id)}
                className="inline-flex items-center gap-2"
              >
                <Zap className="w-4 h-4" />
                Analizar con IA ahora
              </Button>
            </div>
          )}

          <div className="rounded-xl border border-slate-200/60 dark:border-slate-800/60 bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-950 p-5">
            <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-3 flex items-center gap-2">
              <Gift className="w-4 h-4" />
              Recompensa por Defecto
            </h4>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600 dark:text-slate-400">Tipo:</span>
                <Badge size="sm" variant="blue">
                  {REWARD_TYPE_LABELS[program.defaultReward.type]}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600 dark:text-slate-400">Valor:</span>
                <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                  {formatRewardValue(
                    program.defaultReward.type,
                    program.defaultReward.value,
                    program.defaultReward.currency,
                  )}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600 dark:text-slate-400">Descripción:</span>
                <span className="text-sm text-slate-600 dark:text-slate-400 text-right">
                  {program.defaultReward.description}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'segments' && (
        <div className="space-y-4">
          {program.isAIEnabled ? (
            <>
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Recompensas y mensajes personalizados por segmento de cliente
                </p>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => onGenerateSegmentRewards?.(program.id)}
                  className="inline-flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  Generar con IA
                </Button>
              </div>
              {program.segmentBasedRewards && program.segmentBasedRewards.length > 0 ? (
                <div className="space-y-4">
                  {program.segmentBasedRewards.map((segmentReward) => (
                    <div
                      key={segmentReward.segmentType}
                      className="rounded-xl border border-slate-200/60 dark:border-slate-800/60 bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-950 p-5"
                    >
                      <div className="flex items-start justify-between gap-4 mb-4">
                        <div className="flex items-center gap-3">
                          <Badge size="sm" className={SEGMENT_COLORS[segmentReward.segmentType]}>
                            {SEGMENT_LABELS[segmentReward.segmentType]}
                          </Badge>
                          {segmentReward.aiGenerated && (
                            <Badge variant="purple" size="sm" className="inline-flex items-center gap-1">
                              <Sparkles className="w-3 h-3" />
                              Generado por IA
                            </Badge>
                          )}
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onUpdateSegmentReward?.(program.id, segmentReward)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                      </div>
                      <div className="space-y-3">
                        <div>
                          <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Recompensa:</p>
                          <div className="flex items-center gap-2">
                            <Badge size="sm" variant="blue">
                              {REWARD_TYPE_LABELS[segmentReward.reward.type]}
                            </Badge>
                            <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                              {formatRewardValue(
                                segmentReward.reward.type,
                                segmentReward.reward.value,
                                segmentReward.reward.currency,
                              )}
                            </span>
                          </div>
                          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                            {segmentReward.reward.description}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">
                            Mensaje Personalizado:
                          </p>
                          <div className="rounded-lg bg-slate-50 dark:bg-slate-800/50 p-3 border border-slate-200/60 dark:border-slate-800/60">
                            <p className="text-sm text-slate-700 dark:text-slate-300">{segmentReward.message}</p>
                          </div>
                        </div>
                        {segmentReward.performance && (
                          <div className="grid grid-cols-3 gap-3 pt-3 border-t border-slate-200/60 dark:border-slate-800/60">
                            <div>
                              <p className="text-xs text-slate-500 dark:text-slate-400">Tasa Conversión</p>
                              <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                                {segmentReward.performance.conversionRate.toFixed(1)}%
                              </p>
                            </div>
                            <div>
                              <p className="text-xs text-slate-500 dark:text-slate-400">Referidos</p>
                              <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                                {segmentReward.performance.referralsCount}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs text-slate-500 dark:text-slate-400">Tiempo Promedio</p>
                              <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                                {segmentReward.performance.avgTimeToConvert.toFixed(0)} días
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 rounded-xl border border-slate-200/60 dark:border-slate-800/60 bg-slate-50/50 dark:bg-slate-800/30">
                  <Target className="w-10 h-10 text-slate-300 dark:text-slate-700 mx-auto mb-3" />
                  <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
                    No hay recompensas personalizadas por segmento configuradas aún.
                  </p>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => onGenerateSegmentRewards?.(program.id)}
                    className="inline-flex items-center gap-2"
                  >
                    <Sparkles className="w-4 h-4" />
                    Generar recompensas por segmento con IA
                  </Button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12 rounded-xl border border-slate-200/60 dark:border-slate-800/60 bg-slate-50/50 dark:bg-slate-800/30">
              <Brain className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto mb-4" />
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
                Activa la IA para habilitar recompensas y mensajes personalizados por segmento.
              </p>
              <Button
                variant="primary"
                size="sm"
                onClick={() => onEnableAI?.(program.id)}
                className="inline-flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                Activar IA
              </Button>
            </div>
          )}
        </div>
      )}

      {activeTab === 'ai-insights' && program.aiInsights && (
        <div className="space-y-6">
          <div className="rounded-xl border border-purple-200/50 dark:border-purple-800/50 bg-purple-50/50 dark:bg-purple-900/20 p-5">
            <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-3 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              Segmento con Mejor Rendimiento
            </h4>
            <Badge size="lg" className={SEGMENT_COLORS[program.aiInsights.bestPerformingSegment]}>
              {SEGMENT_LABELS[program.aiInsights.bestPerformingSegment]}
            </Badge>
          </div>

          {program.aiInsights.recommendedAdjustments.length > 0 && (
            <div className="rounded-xl border border-slate-200/60 dark:border-slate-800/60 bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-950 p-5">
              <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-3 flex items-center gap-2">
                <Settings className="w-4 h-4" />
                Ajustes Recomendados por IA
              </h4>
              <ul className="space-y-2">
                {program.aiInsights.recommendedAdjustments.map((adjustment, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <span className="text-purple-600 dark:text-purple-400 mt-0.5">•</span>
                    <span>{adjustment}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {program.aiInsights.conversionPredictions.length > 0 && (
            <div className="rounded-xl border border-slate-200/60 dark:border-slate-800/60 bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-950 p-5">
              <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-2">
                <BarChart3 className="w-4 h-4" />
                Predicciones de Conversión por Segmento
              </h4>
              <div className="space-y-3">
                {program.aiInsights.conversionPredictions.map((prediction) => (
                  <div
                    key={prediction.segmentType}
                    className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50"
                  >
                    <Badge size="sm" className={SEGMENT_COLORS[prediction.segmentType]}>
                      {SEGMENT_LABELS[prediction.segmentType]}
                    </Badge>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                        {prediction.predictedConversionRate.toFixed(1)}%
                      </span>
                      <div className="w-24 h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-indigo-600 dark:bg-indigo-400"
                          style={{ width: `${Math.min(100, prediction.predictedConversionRate)}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </Card>
  );
}

