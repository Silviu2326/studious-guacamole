import { TrendingUp, TrendingDown, Minus, Users, MessageCircleHeart, Star, Sparkles } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { Card, Badge } from '../../../components/componentsreutilizables';
import { CommunityPulseMetric, CommunitySummary } from '../types';

interface PulseOverviewProps {
  summary: CommunitySummary;
  pulseMetrics: CommunityPulseMetric[];
  loading?: boolean;
  periodLabel: string;
}

export function PulseOverview({ summary, pulseMetrics, loading, periodLabel }: PulseOverviewProps) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        <SummaryCard
          icon={Sparkles}
          title="cNPS activo"
          value={`${summary.cNps}`}
          footnote="Clima de comunidad"
          accent="from-indigo-500/90 via-indigo-400 to-sky-400"
          loading={loading}
        />
        <SummaryCard
          icon={Users}
          title="Clientes promotores"
          value={summary.advocates.toString()}
          footnote="Listos para referidos"
          accent="from-emerald-500/90 via-emerald-400 to-teal-400"
          loading={loading}
        />
        <SummaryCard
          icon={Star}
          title="Testimonios recientes"
          value={summary.testimonialsCollected.toString()}
          footnote="Últimos 30 días"
          accent="from-amber-500/90 via-orange-400 to-yellow-400"
          loading={loading}
        />
        <SummaryCard
          icon={MessageCircleHeart}
          title="Lift de retención"
          value={`${summary.retentionLift.toFixed(1)}%`}
          footnote="Impacto programas de fidelización"
          accent="from-purple-500/90 via-fuchsia-400 to-pink-400"
          loading={loading}
        />
      </div>

      <Card className="bg-white/90 dark:bg-slate-900/80 shadow-sm border border-slate-200/60 dark:border-slate-800/60">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
              Latido de la comunidad
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Indicadores que miden la salud de relación y prueba social en el periodo seleccionado.
            </p>
          </div>
          <Badge variant="blue" size="sm">
            {periodLabel}
          </Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mt-6">
          {pulseMetrics.map((metric) => (
            <div
              key={metric.id}
              className="rounded-2xl border border-slate-200/60 dark:border-slate-800/60 bg-gradient-to-br from-white via-white to-slate-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-950 p-5"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-slate-500 dark:text-slate-400">{metric.label}</span>
                <TrendPill trend={metric.trend} delta={metric.delta} />
              </div>
              <div className="mt-3">
                <p className="text-3xl font-semibold text-slate-900 dark:text-slate-100">{metric.value}</p>
              </div>
              <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">{metric.description}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

interface SummaryCardProps {
  icon: LucideIcon;
  title: string;
  value: string;
  footnote: string;
  accent: string;
  loading?: boolean;
}

function SummaryCard({ icon: Icon, title, value, footnote, accent, loading }: SummaryCardProps) {
  return (
    <Card className="relative overflow-hidden bg-white/90 dark:bg-slate-900/80 shadow-sm border border-slate-200/60 dark:border-slate-800/60">
      <div className={`absolute inset-0 opacity-10 bg-gradient-to-r ${accent}`} />
      <div className="relative">
        <div className="flex items-center justify-between">
          <div className="p-2.5 rounded-xl bg-slate-900/5 dark:bg-white/10">
            <Icon className="w-5 h-5 text-slate-900 dark:text-slate-100" />
          </div>
          <span className="text-xs uppercase tracking-wide text-slate-400">{footnote}</span>
        </div>
        <div className="mt-6">
          {loading ? (
            <div className="h-8 w-24 rounded-md bg-slate-200/70 dark:bg-slate-700/60 animate-pulse" />
          ) : (
            <p className="text-3xl font-bold text-slate-900 dark:text-slate-100">{value}</p>
          )}
        </div>
        <p className="mt-3 text-sm font-medium text-slate-600 dark:text-slate-300">{title}</p>
      </div>
    </Card>
  );
}

interface TrendPillProps {
  trend: CommunityPulseMetric['trend'];
  delta: number;
}

function TrendPill({ trend, delta }: TrendPillProps) {
  const Icon =
    trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : Minus;
  const color =
    trend === 'up'
      ? 'text-emerald-600 bg-emerald-100/80 dark:text-emerald-300 dark:bg-emerald-900/30'
      : trend === 'down'
        ? 'text-rose-600 bg-rose-100/80 dark:text-rose-300 dark:bg-rose-900/30'
        : 'text-slate-500 bg-slate-100/80 dark:text-slate-300 dark:bg-slate-800/40';

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${color}`}
    >
      <Icon className="w-3.5 h-3.5" />
      {trend === 'steady' ? 'Estable' : `${delta > 0 ? '+' : ''}${delta}`}
    </span>
  );
}

