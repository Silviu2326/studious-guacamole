import { useState, useEffect } from 'react';
import {
  AlertCircle,
  Calendar,
  Clock,
  Sparkles,
  Zap,
  CheckCircle2,
  Loader2,
  TrendingDown,
} from 'lucide-react';
import {
  Badge,
  Button,
  Card,
  Tooltip,
} from '../../../components/componentsreutilizables';
import type {
  CalendarGap,
  CalendarGapAlert,
  PlannerUpcomingPost,
  PlannerAISuggestion,
} from '../types';
import {
  detectCalendarGaps,
  generateGapAlerts,
  generateAISuggestionsForGap,
  fillGapWithAI,
  fillMultipleGapsWithAI,
} from '../api/calendarGaps';

interface CalendarGapAlertsProps {
  posts: PlannerUpcomingPost[];
  loading?: boolean;
  onGapFilled?: (post: PlannerUpcomingPost) => void;
  onGapsFilled?: (posts: PlannerUpcomingPost[]) => void;
}

const severityConfig: Record<CalendarGapAlert['severity'], { color: string; icon: typeof AlertCircle }> = {
  high: {
    color: 'bg-rose-100 text-rose-700 border-rose-200 dark:bg-rose-900/30 dark:text-rose-300',
    icon: AlertCircle,
  },
  medium: {
    color: 'bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-300',
    icon: AlertCircle,
  },
  low: {
    color: 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300',
    icon: AlertCircle,
  },
};

const priorityConfig: Record<CalendarGap['priority'], { color: string; label: string }> = {
  high: {
    color: 'bg-rose-100 text-rose-700',
    label: 'Alta',
  },
  medium: {
    color: 'bg-amber-100 text-amber-700',
    label: 'Media',
  },
  low: {
    color: 'bg-blue-100 text-blue-700',
    label: 'Baja',
  },
};

export function CalendarGapAlerts({ posts, loading: externalLoading, onGapFilled, onGapsFilled }: CalendarGapAlertsProps) {
  const [gaps, setGaps] = useState<CalendarGap[]>([]);
  const [alerts, setAlerts] = useState<CalendarGapAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const [fillingGaps, setFillingGaps] = useState<Set<string>>(new Set());
  const [fillingAllGaps, setFillingAllGaps] = useState(false);

  useEffect(() => {
    loadGapsAndAlerts();
  }, [posts]);

  const loadGapsAndAlerts = async () => {
    setLoading(true);
    try {
      const detectedGaps = await detectCalendarGaps(posts);
      const generatedAlerts = await generateGapAlerts(detectedGaps, posts);
      setGaps(detectedGaps);
      setAlerts(generatedAlerts);
    } catch (error) {
      console.error('Error loading gaps and alerts', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFillGap = async (gap: CalendarGap) => {
    if (fillingGaps.has(gap.id)) return;

    setFillingGaps((prev) => new Set(prev).add(gap.id));
    try {
      const post = await fillGapWithAI(gap);
      if (onGapFilled) {
        onGapFilled(post);
      }
      // Remove gap from list
      setGaps((prev) => prev.filter((g) => g.id !== gap.id));
      // Reload alerts
      await loadGapsAndAlerts();
    } catch (error) {
      console.error('Error filling gap', error);
      alert('Error al rellenar el hueco. Por favor intenta nuevamente.');
    } finally {
      setFillingGaps((prev) => {
        const next = new Set(prev);
        next.delete(gap.id);
        return next;
      });
    }
  };

  const handleFillAllGaps = async () => {
    if (fillingAllGaps || gaps.length === 0) return;

    setFillingAllGaps(true);
    try {
      const highPriorityGaps = gaps.filter((g) => g.priority === 'high');
      const posts = await fillMultipleGapsWithAI(highPriorityGaps);
      if (onGapsFilled) {
        onGapsFilled(posts);
      }
      // Remove filled gaps from list
      setGaps((prev) => prev.filter((g) => !highPriorityGaps.find((hg) => hg.id === g.id)));
      // Reload alerts
      await loadGapsAndAlerts();
    } catch (error) {
      console.error('Error filling all gaps', error);
      alert('Error al rellenar los huecos. Por favor intenta nuevamente.');
    } finally {
      setFillingAllGaps(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
    });
  };

  const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(':');
    return `${hours}:${minutes}`;
  };

  if (externalLoading || loading) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-6 h-6 text-indigo-500 animate-spin" />
        </div>
      </Card>
    );
  }

  if (alerts.length === 0 && gaps.length === 0) {
    return (
      <Card className="p-6">
        <div className="flex items-center gap-3 text-slate-500">
          <CheckCircle2 className="w-5 h-5 text-green-500" />
          <p className="text-sm">No se detectaron huecos en tu calendario editorial.</p>
        </div>
      </Card>
    );
  }

  const highPriorityGaps = gaps.filter((g) => g.priority === 'high');
  const hasHighPriorityGaps = highPriorityGaps.length > 0;

  return (
    <div className="space-y-4">
      {alerts.map((alert) => {
        const severityStyle = severityConfig[alert.severity];
        const AlertIcon = severityStyle.icon;

        return (
          <Card key={alert.id} className={`p-0 border-2 ${severityStyle.color.split(' ')[2]}`}>
            <div className="p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3 flex-1">
                  <AlertIcon className={`w-5 h-5 ${severityStyle.color.split(' ')[1]} shrink-0 mt-0.5`} />
                  <div className="flex-1">
                    <h3 className="text-sm font-semibold text-slate-900 mb-1">{alert.title}</h3>
                    <p className="text-sm text-slate-600 mb-3">{alert.message}</p>
                    {alert.gaps && alert.gaps.length > 0 ? (
                      <div className="space-y-2">
                        {alert.gaps.slice(0, 3).map((gap) => (
                          <div
                            key={gap.id}
                            className="flex items-center gap-2 p-2 rounded-lg bg-white border border-slate-200"
                          >
                            <Calendar className="w-4 h-4 text-slate-500" />
                            <span className="text-xs font-medium text-slate-700">
                              {formatDate(gap.date)} {formatTime(gap.startTime)} - {formatTime(gap.endTime)}
                            </span>
                            <span
                              className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold ${priorityConfig[gap.priority].color}`}
                            >
                              {priorityConfig[gap.priority].label}
                            </span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleFillGap(gap)}
                              disabled={fillingGaps.has(gap.id)}
                              className="ml-auto"
                            >
                              {fillingGaps.has(gap.id) ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : (
                                <>
                                  <Sparkles className="w-4 h-4 mr-1" />
                                  Rellenar con IA
                                </>
                              )}
                            </Button>
                          </div>
                        ))}
                        {alert.gaps.length > 3 ? (
                          <p className="text-xs text-slate-500">+{alert.gaps.length - 3} huecos más</p>
                        ) : null}
                      </div>
                    ) : null}
                  </div>
                </div>
                {hasHighPriorityGaps && alert.type === 'gap' ? (
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={handleFillAllGaps}
                    disabled={fillingAllGaps}
                    className="shrink-0"
                  >
                    {fillingAllGaps ? (
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    ) : (
                      <Zap className="w-4 h-4 mr-2" />
                    )}
                    Rellenar todos (1 clic)
                  </Button>
                ) : null}
              </div>
            </div>
          </Card>
        );
      })}

      {gaps.length > 0 && alerts.length === 0 ? (
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                <TrendingDown className="w-5 h-5 text-amber-500" />
                Huecos detectados en el calendario
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                {gaps.length} hueco{gaps.length !== 1 ? 's' : ''} encontrado{gaps.length !== 1 ? 's' : ''} en los próximos 14 días
              </p>
            </div>
            {hasHighPriorityGaps ? (
              <Button
                variant="primary"
                size="sm"
                onClick={handleFillAllGaps}
                disabled={fillingAllGaps}
              >
                {fillingAllGaps ? (
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                ) : (
                  <Zap className="w-4 h-4 mr-2" />
                )}
                Rellenar todos (1 clic)
              </Button>
            ) : null}
          </div>
          <div className="space-y-2">
            {gaps.slice(0, 5).map((gap) => (
              <div
                key={gap.id}
                className="flex items-center gap-3 p-3 rounded-lg border border-slate-200 bg-white"
              >
                <div className="flex items-center gap-2 flex-1">
                  <Calendar className="w-4 h-4 text-slate-500" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-slate-900">
                        {formatDate(gap.date)}
                      </span>
                      <span className="text-xs text-slate-500">
                        {formatTime(gap.startTime)} - {formatTime(gap.endTime)}
                      </span>
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold ${priorityConfig[gap.priority].color}`}
                      >
                        {priorityConfig[gap.priority].label}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">{gap.reason}</p>
                  </div>
                </div>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => handleFillGap(gap)}
                  disabled={fillingGaps.has(gap.id)}
                >
                  {fillingGaps.has(gap.id) ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 mr-1" />
                      Rellenar con IA
                    </>
                  )}
                </Button>
              </div>
            ))}
            {gaps.length > 5 ? (
              <p className="text-xs text-slate-500 text-center">
                +{gaps.length - 5} huecos más. Usa el botón "Rellenar todos" para llenarlos automáticamente.
              </p>
            ) : null}
          </div>
        </Card>
      ) : null}
    </div>
  );
}

