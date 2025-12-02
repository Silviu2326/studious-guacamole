import { useCallback, useEffect, useMemo, useState } from 'react';
import { Badge, Button, Card, Input, Select, Textarea } from '../../../components/componentsreutilizables';
import {
  CheckSquare,
  Square,
  Plus,
  Trash2,
  Copy,
  ChevronRight,
  ChevronLeft,
  Save,
  Upload,
  Download,
  History,
  Layers,
  Sparkles,
} from 'lucide-react';
import type { DayPlan, DaySession } from '../types';
import { BulkMetricsMode } from './BulkMetricsMode';
import { DuplicateWeekMode } from './DuplicateWeekMode';

type ConditionType = 'modality' | 'intensity' | 'duration' | 'tag';
type Comparator = 'equals' | 'contains' | 'gte' | 'lte';

type Condition = {
  id: string;
  type: ConditionType;
  comparator: Comparator;
  value: string;
};

type ActionType = 'set-intensity' | 'bump-duration' | 'add-rest' | 'change-modality' | 'append-tag';
type ActionMode = 'set' | 'increase' | 'decrease';

type Action = {
  id: string;
  type: ActionType;
  mode?: ActionMode;
  value: string;
};

type BatchRule = {
  id: string;
  name: string;
  description?: string;
  enabled: boolean;
  operator: 'AND' | 'OR';
  conditions: Condition[];
  actions: Action[];
};

type RuleTemplate = {
  id: string;
  name: string;
  description: string;
  tags: string[];
  rules: BatchRule[];
};

type BatchMode =
  | 'rules'
  | 'edit-sessions'
  | 'add-routines'
  | 'move-sessions'
  | 'bulk-tags'
  | 'bulk-metrics'
  | 'duplicate-week';

type RoutineTemplate = {
  id: string;
  name: string;
  description?: string;
  tags?: string[];
  sessions: Omit<DaySession, 'id'>[];
};

type HistoryEntry = {
  id: string;
  timestamp: string;
  summary: string;
  metrics: PreviewMetrics;
};

type PreviewMetrics = {
  sessionsTouched: number;
  totalDurationDelta: number;
  perDay: Array<{ day: string; delta: number; sessions: number }>;
  intensityBefore: Record<string, number>;
  intensityAfter: Record<string, number>;
};

type PreviewResult = {
  simulatedPlan: Record<string, DayPlan>;
  metrics: PreviewMetrics;
  affectedRules: number;
};

type BatchTrainingTab = 'summary' | 'quick-actions';

export type BatchTrainingSummary = PreviewResult;

export type BatchTrainingModalProps = {
  weeklyPlan: Record<string, DayPlan>;
  weekDays: ReadonlyArray<string>;
  onApplyRules: (updatedPlan: Record<string, DayPlan>) => void;
  onClose: () => void;
  clientId?: string;
  programId?: string;
  onExportSummary?: (summary: PreviewResult) => void;
};

const CONDITION_LABELS: Record<ConditionType, string> = {
  modality: 'Modalidad',
  intensity: 'Intensidad',
  duration: 'Duración (min)',
  tag: 'Tag',
};

const ACTION_LABELS: Record<ActionType, string> = {
  'set-intensity': 'Cambiar intensidad',
  'bump-duration': 'Ajustar duración',
  'add-rest': 'Añadir descanso',
  'change-modality': 'Cambiar modalidad',
  'append-tag': 'Añadir tag',
};

const createId = () => Math.random().toString(36).slice(2, 9);

const parseMinutes = (value: string) => {
  const match = value.match(/\d+/);
  return match ? Number(match[0]) : 0;
};

const evaluateCondition = (session: DaySession, condition: Condition, day: string) => {
  switch (condition.type) {
    case 'modality':
      return condition.comparator === 'equals'
        ? session.modality === condition.value
        : session.modality?.toLowerCase().includes(condition.value.toLowerCase());
    case 'intensity':
      return condition.comparator === 'equals'
        ? session.intensity === condition.value
        : session.intensity?.toLowerCase().includes(condition.value.toLowerCase());
    case 'duration': {
      const minutes = parseMinutes(session.duration || '0');
      const target = Number(condition.value);
      if (condition.comparator === 'gte') return minutes >= target;
      if (condition.comparator === 'lte') return minutes <= target;
      return minutes === target;
    }
    case 'tag': {
      const tags = [...(session.tags ?? []), day];
      return tags.some((tag) => tag.toLowerCase().includes(condition.value.toLowerCase()));
    }
    default:
      return false;
  }
};

const applyAction = (session: DaySession, action: Action): DaySession => {
  switch (action.type) {
    case 'set-intensity':
      return { ...session, intensity: action.value };
    case 'bump-duration': {
      const modifier = Number(action.value) || 0;
      const current = parseMinutes(session.duration || '0');
      const mode = action.mode ?? 'increase';
      const next =
        mode === 'increase'
          ? current + modifier
          : mode === 'decrease'
          ? Math.max(5, current - modifier)
          : modifier;
      return { ...session, duration: `${next} min` };
    }
    case 'add-rest': {
      const note = `[Descanso extra: ${action.value} min]`;
      const notes = session.notes || '';
      if (notes.includes(note)) return session;
      return { ...session, notes: notes ? `${notes} · ${note}` : note };
    }
    case 'change-modality':
      return { ...session, modality: action.value };
    case 'append-tag': {
      const tags = new Set(session.tags ?? []);
      tags.add(action.value);
      return { ...session, tags: Array.from(tags) };
    }
    default:
      return session;
  }
};

const cloneRule = (rule: BatchRule): BatchRule => ({
  ...rule,
  id: createId(),
  conditions: rule.conditions.map((condition) => ({ ...condition, id: createId() })),
  actions: rule.actions.map((action) => ({ ...action, id: createId() })),
});

const cloneRules = (rules: BatchRule[]) => rules.map(cloneRule);

const aggregatePlanMetrics = (plan: Record<string, DayPlan>, weekDays: ReadonlyArray<string>) => {
  const perDayDuration: Record<string, number> = {};
  let totalDuration = 0;
  const intensity: Record<string, number> = {};

  weekDays.forEach((day) => {
    const sessions = plan[day]?.sessions ?? [];
    const minutes = sessions.reduce((total, session) => total + parseMinutes(session.duration || '0'), 0);
    perDayDuration[day] = minutes;
    totalDuration += minutes;
    sessions.forEach((session) => {
      const key = session.intensity || 'Sin dato';
      intensity[key] = (intensity[key] ?? 0) + 1;
    });
  });

  return { totalDuration, perDayDuration, intensity };
};

const cloneWeeklyPlan = (plan: Record<string, DayPlan>): Record<string, DayPlan> =>
  Object.fromEntries(
    Object.entries(plan).map(([day, dayPlan]) => [
      day,
      {
        ...dayPlan,
        sessions: dayPlan.sessions.map((session) => ({ ...session })),
      },
    ]),
  );

const computeSessionsTouched = (
  before: Record<string, DayPlan>,
  after: Record<string, DayPlan>,
  weekDays: ReadonlyArray<string>,
) => {
  let count = 0;
  weekDays.forEach((day) => {
    const beforeSessions = before[day]?.sessions ?? [];
    const afterSessions = after[day]?.sessions ?? [];
    const beforeById = new Map(beforeSessions.map((s) => [s.id, s]));
    const afterById = new Map(afterSessions.map((s) => [s.id, s]));
    const ids = new Set<string>([...beforeById.keys(), ...afterById.keys()]);
    ids.forEach((id) => {
      const b = beforeById.get(id);
      const a = afterById.get(id);
      if (!b || !a) {
        count += 1;
        return;
      }
      const beforeTags = (b.tags ?? []).join(',');
      const afterTags = (a.tags ?? []).join(',');
      if (
        b.duration !== a.duration ||
        b.modality !== a.modality ||
        b.intensity !== a.intensity ||
        b.notes !== a.notes ||
        beforeTags !== afterTags
      ) {
        count += 1;
      }
    });
  });
  return count;
};

const buildManualMetrics = (
  before: Record<string, DayPlan>,
  after: Record<string, DayPlan>,
  weekDays: ReadonlyArray<string>,
): PreviewMetrics => {
  const baseline = aggregatePlanMetrics(before, weekDays);
  const updated = aggregatePlanMetrics(after, weekDays);

  const perDay = weekDays.map((day) => {
    const beforeMinutes = (before[day]?.sessions ?? []).reduce(
      (total, session) => total + parseMinutes(session.duration || '0'),
      0,
    );
    const afterMinutes = (after[day]?.sessions ?? []).reduce(
      (total, session) => total + parseMinutes(session.duration || '0'),
      0,
    );
    return {
      day,
      delta: afterMinutes - beforeMinutes,
      sessions: after[day]?.sessions.length ?? 0,
    };
  });

  return {
    sessionsTouched: computeSessionsTouched(before, after, weekDays),
    totalDurationDelta: updated.totalDuration - baseline.totalDuration,
    perDay,
    intensityBefore: baseline.intensity,
    intensityAfter: updated.intensity,
  };
};

const runRulesPreview = (
  rules: BatchRule[],
  weeklyPlan: Record<string, DayPlan>,
  weekDays: ReadonlyArray<string>,
): PreviewResult => {
  const activeRules = rules.filter((rule) => rule.enabled && rule.actions.length > 0);
  const baseline = aggregatePlanMetrics(weeklyPlan, weekDays);
  const perDayDelta: Record<string, number> = Object.fromEntries(weekDays.map((day) => [day, 0]));
  let sessionsTouched = 0;

  const simulatedPlan: Record<string, DayPlan> = {};

  weekDays.forEach((day) => {
    const plan = weeklyPlan[day];
    if (!plan) return;
    const clonedDay: DayPlan = { ...plan, sessions: plan.sessions.map((session) => ({ ...session })) };

    clonedDay.sessions = clonedDay.sessions.map((session) => {
      let updated = { ...session };
      let touched = false;

      activeRules.forEach((rule) => {
        const matches =
          rule.conditions.length === 0
            ? true
            : rule.operator === 'AND'
            ? rule.conditions.every((condition) => evaluateCondition(updated, condition, day))
            : rule.conditions.some((condition) => evaluateCondition(updated, condition, day));

        if (!matches) return;
        touched = true;
        rule.actions.forEach((action) => {
          updated = applyAction(updated, action);
        });
      });

      if (touched) {
        sessionsTouched += 1;
        perDayDelta[day] += parseMinutes(updated.duration || '0') - parseMinutes(session.duration || '0');
      }

      return updated;
    });

    simulatedPlan[day] = clonedDay;
  });

  const after = aggregatePlanMetrics(simulatedPlan, weekDays);

  const metrics: PreviewMetrics = {
    sessionsTouched,
    totalDurationDelta: after.totalDuration - baseline.totalDuration,
    perDay: weekDays.map((day) => ({
      day,
      delta: perDayDelta[day],
      sessions: simulatedPlan[day]?.sessions.length ?? 0,
    })),
    intensityBefore: baseline.intensity,
    intensityAfter: after.intensity,
  };

  return {
    simulatedPlan,
    metrics,
    affectedRules: activeRules.length,
  };
};

const DEFAULT_ROUTINES: RoutineTemplate[] = [
  {
    id: 'rt-fullbody-30',
    name: 'Full body 30′',
    description: 'Sesión global de fuerza de 30 min.',
    tags: ['fuerza', 'full-body'],
    sessions: [
      {
        time: '00:00',
        block: 'Full body strength',
        duration: '30 min',
        modality: 'Strength',
        intensity: 'RPE 7',
        notes: 'Priorizar técnica limpia.',
      },
    ],
  },
  {
    id: 'rt-metcon-20',
    name: 'MetCon 20′',
    description: 'Metcon intenso y corto.',
    tags: ['metcon', 'hiit'],
    sessions: [
      {
        time: '00:00',
        block: 'MetCon',
        duration: '20 min',
        modality: 'MetCon',
        intensity: 'Alta',
        notes: 'Controlar respiración y RPE.',
      },
    ],
  },
  {
    id: 'rt-movilidad-15',
    name: 'Movilidad 15′',
    description: 'Bloque suave de movilidad y recuperación.',
    tags: ['movilidad', 'recuperación'],
    sessions: [
      {
        time: '00:00',
        block: 'Mobility flow',
        duration: '15 min',
        modality: 'Mobility',
        intensity: 'Baja',
        notes: 'Enfocar en rango de movimiento.',
      },
    ],
  },
];

export function BatchTrainingModal({
  weeklyPlan,
  weekDays,
  onApplyRules,
  onClose,
  clientId,
  programId,
  onExportSummary,
}: BatchTrainingModalProps) {
  const [mode, setMode] = useState<BatchMode>('add-routines');
  const [activeTab, setActiveTab] = useState<BatchTrainingTab>('summary');
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [workingPlan, setWorkingPlan] = useState<Record<string, DayPlan>>(() => cloneWeeklyPlan(weeklyPlan));
  const [selectedRoutineId, setSelectedRoutineId] = useState<string | null>(null);
  const [routineTargetDays, setRoutineTargetDays] = useState<string[]>([]);
  const [manualApplyStatus, setManualApplyStatus] = useState<string | null>(null);
  const [moveSourceDay, setMoveSourceDay] = useState<string>(() => weekDays[0] ?? '');
  const [moveTargetDay, setMoveTargetDay] = useState<string>(() => weekDays[1] ?? weekDays[0] ?? '');
  const [moveSelectedSessionIds, setMoveSelectedSessionIds] = useState<string[]>([]);
  const [moveMode, setMoveMode] = useState<'move' | 'copy'>('move');
  const [bulkTagValue, setBulkTagValue] = useState('');
  const [bulkTagMode, setBulkTagMode] = useState<'add' | 'remove'>('add');
  const [bulkTagTargetDays, setBulkTagTargetDays] = useState<string[]>([]);

  const historyStorageKey = useMemo(
    () => `batch-training-history-${clientId ?? 'global'}-${programId ?? 'default'}`,
    [clientId, programId],
  );

  useEffect(() => {
    setWorkingPlan(cloneWeeklyPlan(weeklyPlan));
  }, [weeklyPlan]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(historyStorageKey);
      if (raw) {
        setHistory(JSON.parse(raw) as HistoryEntry[]);
      }
    } catch {
      // ignore
    }
  }, [historyStorageKey]);

  const summaryMetrics = useMemo(() => {
    const { totalDuration, perDayDuration, intensity } = aggregatePlanMetrics(workingPlan, weekDays);
    let totalSessions = 0;
    let daysWithSessions = 0;
    const perDayList: Array<{ day: string; minutes: number; sessions: number }> = [];
    const modalityCount: Record<string, number> = {};

    weekDays.forEach((day) => {
      const sessions = workingPlan[day]?.sessions ?? [];
      const minutes = perDayDuration[day] ?? 0;
      const count = sessions.length;
      totalSessions += count;
      if (count > 0) daysWithSessions += 1;
      perDayList.push({ day, minutes, sessions: count });
      sessions.forEach((session) => {
        const key = session.modality || 'Sin modalidad';
        modalityCount[key] = (modalityCount[key] ?? 0) + 1;
      });
    });

    return {
      totalDuration,
      totalSessions,
      daysWithSessions,
      perDayList,
      intensity,
      modalityCount,
    };
  }, [weekDays, workingPlan]);

  const handleApplyWorkingPlan = () => {
    const metrics = buildManualMetrics(weeklyPlan, workingPlan, weekDays);
    onApplyRules(workingPlan);
    const entry: HistoryEntry = {
      id: createId(),
      timestamp: new Date().toISOString(),
      summary: `Cambios manuales · ${metrics.sessionsTouched} bloques`,
      metrics,
    };
    setHistory((prev) => {
      const next = [entry, ...prev].slice(0, 15);
      try {
        localStorage.setItem(historyStorageKey, JSON.stringify(next));
      } catch {
        // ignore
      }
      return next;
    });
    setManualApplyStatus('Cambios aplicados al programa.');
  };

  const handleConfirmClose = () => {
    onClose();
  };

  const handleSelectQuickAction = (nextMode: BatchMode) => {
    setMode(nextMode);
    setManualApplyStatus(null);
    if (nextMode === 'move-sessions') {
      setMoveSelectedSessionIds([]);
    }
  };

  const toggleRoutineDay = (day: string) => {
    setRoutineTargetDays((prev) =>
      prev.includes(day) ? prev.filter((item) => item !== day) : [...prev, day],
    );
  };

  const handleApplyRoutineToDays = () => {
    const routine = DEFAULT_ROUTINES.find((item) => item.id === selectedRoutineId);
    if (!routine || routineTargetDays.length === 0) return;

    setWorkingPlan((prev) => {
      const next: Record<string, DayPlan> = { ...prev };
      routineTargetDays.forEach((day) => {
        const dayPlan = next[day];
        if (!dayPlan) return;
        const newSessions = routine.sessions.map((sessionTemplate) => ({
          ...sessionTemplate,
          id: createId(),
        }));
        next[day] = {
          ...dayPlan,
          sessions: [...dayPlan.sessions, ...newSessions],
        };
      });
      return next;
    });
    setManualApplyStatus('Rutina añadida. Aplica los cambios para guardarlos en el programa.');
  };

  const toggleMoveSessionSelection = (sessionId: string) => {
    setMoveSelectedSessionIds((prev) =>
      prev.includes(sessionId) ? prev.filter((id) => id !== sessionId) : [...prev, sessionId],
    );
  };

  const handleExecuteMoveSessions = () => {
    if (!moveSourceDay || !moveTargetDay || moveSourceDay === moveTargetDay || moveSelectedSessionIds.length === 0) {
      return;
    }

    setWorkingPlan((prev) => {
      const sourcePlan = prev[moveSourceDay];
      const targetPlan = prev[moveTargetDay];
      if (!sourcePlan || !targetPlan) return prev;

      const sourceSessions = [...sourcePlan.sessions];
      const toMove: DaySession[] = [];

      moveSelectedSessionIds.forEach((id) => {
        const idx = sourceSessions.findIndex((s) => s.id === id);
        if (idx !== -1) {
          const session = sourceSessions[idx];
          if (moveMode === 'move') {
            sourceSessions.splice(idx, 1);
            toMove.push(session);
          } else {
            toMove.push({ ...session, id: createId() });
          }
        }
      });

      if (toMove.length === 0) return prev;

      return {
        ...prev,
        [moveSourceDay]: {
          ...sourcePlan,
          sessions: sourceSessions,
        },
        [moveTargetDay]: {
          ...targetPlan,
          sessions: [...targetPlan.sessions, ...toMove],
        },
      };
    });

    setMoveSelectedSessionIds([]);
    setManualApplyStatus(
      moveMode === 'move'
        ? 'Bloques movidos. Aplica los cambios para guardarlos en el programa.'
        : 'Bloques copiados. Aplica los cambios para guardarlos en el programa.',
    );
  };

  const toggleBulkTagDay = (day: string) => {
    setBulkTagTargetDays((prev) =>
      prev.includes(day) ? prev.filter((item) => item !== day) : [...prev, day],
    );
  };

  const handleExecuteBulkTags = () => {
    const tag = bulkTagValue.trim();
    if (!tag || bulkTagTargetDays.length === 0) return;

    setWorkingPlan((prev) => {
      const next: Record<string, DayPlan> = { ...prev };
      bulkTagTargetDays.forEach((day) => {
        const dayPlan = next[day];
        if (!dayPlan) return;
        next[day] = {
          ...dayPlan,
          sessions: dayPlan.sessions.map((session) => {
            const currentTags = session.tags ?? [];
            if (bulkTagMode === 'add') {
              if (currentTags.includes(tag)) return session;
              return { ...session, tags: [...currentTags, tag] };
            }
            // remove
            if (!currentTags.includes(tag)) return session;
            return { ...session, tags: currentTags.filter((t) => t !== tag) };
          }),
        };
      });
      return next;
    });

    setManualApplyStatus(
      bulkTagMode === 'add'
        ? `Tag "${tag}" añadido a los días seleccionados. Aplica los cambios para guardarlos en el programa.`
        : `Tag "${tag}" eliminado de los días seleccionados. Aplica los cambios para guardarlos en el programa.`,
    );
  };

  return (
    <div className="space-y-6">
      {/* Header principal */}
      <div className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-200/70 pb-3 dark:border-slate-800/70">
        <div className="space-y-1">
          <h2 className="text-base font-semibold text-slate-900 dark:text-slate-50">
            Batch Training – Ajustes masivos del programa
          </h2>
          <p className="text-xs text-slate-500">
            Aplica cambios a toda la semana de forma rápida y segura. Primero previsualiza, luego aplica.
          </p>
          <p className="text-[11px] text-slate-400">
            Plan actual: Semana seleccionada
          </p>
        </div>
        <div className="flex items-center gap-3">
          {/* Placeholder opcional para selector de semana/rango de fechas */}
          <Button variant="ghost" size="sm" onClick={handleConfirmClose}>
            Cerrar
          </Button>
        </div>
      </div>

      {/* Tabs principales */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200/70 pb-2 dark:border-slate-800/70">
        <div className="flex flex-wrap gap-2">
          <Button
            variant={activeTab === 'summary' ? 'secondary' : 'ghost'}
            size="sm"
            onClick={() => setActiveTab('summary')}
          >
            Resumen
          </Button>
          <Button
            variant={activeTab === 'quick-actions' ? 'secondary' : 'ghost'}
            size="sm"
            onClick={() => setActiveTab('quick-actions')}
          >
            Acciones rápidas
          </Button>
        </div>
        <p className="text-xs text-slate-500">
          {activeTab === 'summary'
            ? 'Vista global de la semana y cambios recientes.'
            : 'Elige una receta rápida, configura y previsualiza su impacto.'}
        </p>
      </div>

      {/* Pestaña 1 – Resumen */}
      {activeTab === 'summary' && (
        <div className="grid gap-4 lg:grid-cols-3">
          <div className="space-y-4 lg:col-span-2">
            <Card className="space-y-3 border border-slate-200/70 bg-white/95 p-4 dark:border-slate-800/70 dark:bg-slate-900/50">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                Resumen de la semana
              </p>
              <div className="grid gap-3 sm:grid-cols-3 text-sm text-slate-700">
                <div>
                  <p className="text-xs text-slate-500">Bloques/sesiones</p>
                  <p className="font-semibold">{summaryMetrics.totalSessions}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Minutos totales</p>
                  <p className="font-semibold">{summaryMetrics.totalDuration}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Días con sesiones</p>
                  <p className="font-semibold">{summaryMetrics.daysWithSessions}</p>
                </div>
              </div>
              <div className="mt-2 space-y-1 text-xs text-slate-600">
                {summaryMetrics.perDayList.map((item) => (
                  <div key={item.day} className="flex items-center justify-between">
                    <span>{item.day}</span>
                    <span className="text-slate-500">
                      {item.minutes} min · {item.sessions} bloques
                    </span>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="space-y-3 border border-slate-200/70 bg-white/95 p-4 dark:border-slate-800/70 dark:bg-slate-900/50">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                Intensidades
              </p>
              {Object.keys(summaryMetrics.intensity).length === 0 ? (
                <p className="text-xs text-slate-500">Todavía no hay intensidades registradas.</p>
              ) : (
                <div className="space-y-1 text-xs text-slate-600">
                  {Object.entries(summaryMetrics.intensity).map(([label, count]) => (
                    <div key={label} className="flex items-center justify-between">
                      <span>{label}</span>
                      <span className="text-slate-500">{count} sesiones</span>
                    </div>
                  ))}
                </div>
              )}
            </Card>

            <Card className="space-y-3 border border-slate-200/70 bg-white/95 p-4 dark:border-slate-800/70 dark:bg-slate-900/50">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                Distribución por modalidades
              </p>
              {Object.keys(summaryMetrics.modalityCount).length === 0 ? (
                <p className="text-xs text-slate-500">
                  Todavía no hay modalidades registradas en esta semana.
                </p>
              ) : (
                <div className="space-y-1 text-xs text-slate-600">
                  {Object.entries(summaryMetrics.modalityCount).map(([label, count]) => (
                    <div key={label} className="flex items-center justify-between">
                      <span>{label}</span>
                      <span className="text-slate-500">{count} sesiones</span>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>

          <div className="space-y-4">
            <Card className="space-y-3 border border-slate-200/70 bg-white/95 p-4 dark:border-slate-800/70 dark:bg-slate-900/50">
              <div className="flex items-center gap-2">
                <History className="h-4 w-4 text-slate-500" />
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Historial de cambios
                </p>
              </div>
              {history.length === 0 ? (
                <p className="text-xs text-slate-500">
                  Todavía no has aplicado cambios masivos a esta semana. Usa la pestaña de
                  &quot;Acciones rápidas&quot; para empezar.
                </p>
              ) : (
                <div className="max-h-64 space-y-2 overflow-y-auto">
                  {history.map((entry) => (
                    <Card key={entry.id} className="border border-slate-200/70 bg-white/90 p-3">
                      <div className="flex items-center justify-between text-xs text-slate-500">
                        <span>{new Date(entry.timestamp).toLocaleString()}</span>
                        <span>{entry.metrics.sessionsTouched} bloques</span>
                      </div>
                      <p className="text-sm text-slate-700">{entry.summary}</p>
                    </Card>
                  ))}
                </div>
              )}
            </Card>
          </div>
        </div>
      )}

      {/* Pestaña 2 – Acciones rápidas: menú de acciones */}
      {activeTab === 'quick-actions' && (
        <div className="space-y-4">
          <Card className="space-y-3 border border-slate-200/70 bg-white/95 p-4 dark:border-slate-800/70 dark:bg-slate-900/50">
            <div className="flex flex-col gap-1">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                Acciones rápidas
              </p>
              <p className="text-xs text-slate-500">
                Elige qué quieres hacer y sigue los pasos. Siempre podrás previsualizar el impacto antes de aplicar.
              </p>
            </div>
            <div className="mt-3 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              <Card
                className={`cursor-pointer border p-3 hover:border-indigo-300 ${
                  mode === 'add-routines'
                    ? 'border-indigo-300 bg-indigo-50/60 dark:border-indigo-700/70 dark:bg-indigo-950/40'
                    : 'border-slate-200/70 bg-white/95 dark:border-slate-800/70 dark:bg-slate-950/40'
                }`}
                onClick={() => handleSelectQuickAction('add-routines')}
              >
                <div className="flex items-start gap-2">
                  <Plus className="mt-0.5 h-4 w-4 text-indigo-500" />
                  <div className="space-y-0.5">
                    <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                      Añadir rutinas predefinidas
                    </p>
                    <p className="text-xs text-slate-500">
                      Aplica una rutina predefinida a varios días a la vez.
                    </p>
                  </div>
                </div>
              </Card>

              <Card
                className={`cursor-pointer border p-3 hover:border-indigo-300 ${
                  mode === 'move-sessions'
                    ? 'border-indigo-300 bg-indigo-50/60 dark:border-indigo-700/70 dark:bg-indigo-950/40'
                    : 'border-slate-200/70 bg-white/95 dark:border-slate-800/70 dark:bg-slate-950/40'
                }`}
                onClick={() => handleSelectQuickAction('move-sessions')}
              >
                <div className="flex items-start gap-2">
                  <ChevronRight className="mt-0.5 h-4 w-4 text-indigo-500" />
                  <div className="space-y-0.5">
                    <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                      Mover o copiar bloques entre días
                    </p>
                    <p className="text-xs text-slate-500">
                      Reorganiza bloques de un día a otro rápidamente.
                    </p>
                  </div>
                </div>
              </Card>

              <Card
                className={`cursor-pointer border p-3 hover:border-indigo-300 ${
                  mode === 'bulk-tags'
                    ? 'border-indigo-300 bg-indigo-50/60 dark:border-indigo-700/70 dark:bg-indigo-950/40'
                    : 'border-slate-200/70 bg-white/95 dark:border-slate-800/70 dark:bg-slate-950/40'
                }`}
                onClick={() => handleSelectQuickAction('bulk-tags')}
              >
                <div className="flex items-start gap-2">
                  <Badge size="sm" variant="secondary" className="mt-0.5">
                    Tag
                  </Badge>
                  <div className="space-y-0.5">
                    <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                      Añadir / quitar tags en lote
                    </p>
                    <p className="text-xs text-slate-500">
                      Gestiona un mismo tag en muchos bloques a la vez.
                    </p>
                  </div>
                </div>
              </Card>

              <Card
                className={`cursor-pointer border p-3 hover:border-indigo-300 ${
                  mode === 'bulk-metrics'
                    ? 'border-indigo-300 bg-indigo-50/60 dark:border-indigo-700/70 dark:bg-indigo-950/40'
                    : 'border-slate-200/70 bg-white/95 dark:border-slate-800/70 dark:bg-slate-950/40'
                }`}
                onClick={() => handleSelectQuickAction('bulk-metrics')}
              >
                <div className="flex items-start gap-2">
                  <Sparkles className="mt-0.5 h-4 w-4 text-indigo-500" />
                  <div className="space-y-0.5">
                    <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                      Modificar métricas en lote
                    </p>
                    <p className="text-xs text-slate-500">
                      Cambia intensidad, series, repeticiones, peso, tempo o descanso masivamente.
                    </p>
                  </div>
                </div>
              </Card>

              <Card
                className={`cursor-pointer border p-3 hover:border-indigo-300 ${
                  mode === 'duplicate-week'
                    ? 'border-indigo-300 bg-indigo-50/60 dark:border-indigo-700/70 dark:bg-indigo-950/40'
                    : 'border-slate-200/70 bg-white/95 dark:border-slate-800/70 dark:bg-slate-950/40'
                }`}
                onClick={() => handleSelectQuickAction('duplicate-week')}
              >
                <div className="flex items-start gap-2">
                  <Copy className="mt-0.5 h-4 w-4 text-indigo-500" />
                  <div className="space-y-0.5">
                    <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                      Duplicar semana completa
                    </p>
                    <p className="text-xs text-slate-500">
                      Duplica una semana a otras con variaciones automáticas (progresión, intensidad, etc.).
                    </p>
                  </div>
                </div>
              </Card>

            </div>
          </Card>
        </div>
      )}

      {/* Acciones rápidas: Añadir rutinas */}
      {activeTab === 'quick-actions' && mode === 'add-routines' && (
        <div className="grid gap-5 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1.4fr)]">
          <Card className="space-y-4 border border-slate-200/70 bg-white/95 p-4 dark:border-slate-800/70 dark:bg-slate-900/50">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              Configuración: Añadir rutinas predefinidas
            </p>
            <p className="text-xs text-slate-500">
              Selecciona los días objetivo y elige una rutina de la biblioteca para insertarla en lote.
            </p>
            <div className="mt-3 space-y-2">
              <p className="text-xs font-semibold text-slate-500">Días objetivo</p>
              <div className="flex flex-wrap gap-2">
                {weekDays.map((day) => {
                  const active = routineTargetDays.includes(day);
                  return (
                    <Button
                      key={day}
                      variant={active ? 'secondary' : 'ghost'}
                      size="sm"
                      onClick={() => toggleRoutineDay(day)}
                    >
                      {day}
                    </Button>
                  );
                })}
              </div>
            </div>
            <p className="mt-2 text-[11px] text-slate-500">
              Se aplicará solo a los días seleccionados. Después podrás revisar el impacto en el plan semanal.
            </p>
            <div className="mt-4 flex flex-wrap items-center justify-end gap-2">
              <Button
                variant="secondary"
                onClick={handleApplyRoutineToDays}
                disabled={!selectedRoutineId || routineTargetDays.length === 0}
              >
                Añadir rutina a días
              </Button>
              <Button variant="secondary" onClick={handleApplyWorkingPlan}>
                Aplicar cambios al programa
              </Button>
            </div>
            {manualApplyStatus && (
              <p className="text-xs text-emerald-700">{manualApplyStatus}</p>
            )}
          </Card>

          <Card className="space-y-4 border border-slate-200/70 bg-white/95 p-4 dark:border-slate-800/70 dark:bg-slate-900/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Biblioteca de rutinas
                </p>
                <p className="text-xs text-slate-500">
                  Elige una rutina para añadir a los días seleccionados.
                </p>
              </div>
              <Layers className="h-4 w-4 text-indigo-500" />
            </div>
            <div className="space-y-2">
              {DEFAULT_ROUTINES.map((routine) => {
                const active = routine.id === selectedRoutineId;
                return (
                  <Card
                    key={routine.id}
                    className={`cursor-pointer border p-3 ${
                      active
                        ? 'border-indigo-300 bg-indigo-50/70 dark:border-indigo-700/70 dark:bg-indigo-950/40'
                        : 'border-slate-200/70 bg-white/90 dark:border-slate-800/70 dark:bg-slate-950/40'
                    }`}
                    onClick={() => setSelectedRoutineId(routine.id)}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                          {routine.name}
                        </p>
                        {routine.description && (
                          <p className="text-xs text-slate-500 dark:text-slate-400">
                            {routine.description}
                          </p>
                        )}
                      </div>
                      <span className="text-xs text-slate-400">
                        {routine.sessions.length} bloque(s)
                      </span>
                    </div>
                    {routine.tags && routine.tags.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {routine.tags.map((tag) => (
                          <Badge
                            key={tag}
                            variant="secondary"
                            size="sm"
                            className="text-[10px]"
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </Card>
                );
              })}
            </div>
          </Card>
        </div>
      )}

      {/* Acciones rápidas: Mover o copiar bloques */}
      {activeTab === 'quick-actions' && mode === 'move-sessions' && (
        <div className="grid gap-5 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1.4fr)]">
          <Card className="space-y-4 border border-slate-200/70 bg-white/95 p-4 dark:border-slate-800/70 dark:bg-slate-900/50">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              Configuración: Mover o copiar bloques entre días
            </p>
            <p className="text-xs text-slate-500">
              Elige un día origen, un día destino y los bloques que quieres mover o copiar.
            </p>
            <div className="mt-3 grid gap-3 md:grid-cols-3">
              <div className="space-y-2">
                <p className="text-xs font-semibold text-slate-500">Día origen</p>
                <Select
                  value={moveSourceDay}
                  onChange={(e) => setMoveSourceDay(e.target.value)}
                  options={weekDays.map((day) => ({ label: day, value: day }))}
                />
              </div>
              <div className="space-y-2">
                <p className="text-xs font-semibold text-slate-500">Día destino</p>
                <Select
                  value={moveTargetDay}
                  onChange={(e) => setMoveTargetDay(e.target.value)}
                  options={weekDays.map((day) => ({ label: day, value: day }))}
                />
              </div>
              <div className="space-y-2">
                <p className="text-xs font-semibold text-slate-500">Modo</p>
                <Select
                  value={moveMode}
                  onChange={(e) => setMoveMode(e.target.value as 'move' | 'copy')}
                  options={[
                    { label: 'Mover (cortar y pegar)', value: 'move' },
                    { label: 'Copiar (duplicar)', value: 'copy' },
                  ]}
                />
              </div>
            </div>
            <p className="mt-2 text-[11px] text-slate-500">
              Se aplicará solo a los bloques seleccionados del día origen. El resto del plan no cambiará.
            </p>
            <div className="mt-4 flex flex-wrap items-center justify-end gap-2">
              <Button
                variant="secondary"
                onClick={handleExecuteMoveSessions}
                disabled={
                  !moveSourceDay ||
                  !moveTargetDay ||
                  moveSourceDay === moveTargetDay ||
                  moveSelectedSessionIds.length === 0
                }
              >
                {moveMode === 'move' ? 'Mover bloques' : 'Copiar bloques'}
              </Button>
              <Button variant="secondary" onClick={handleApplyWorkingPlan}>
                Aplicar cambios al programa
              </Button>
            </div>
            {manualApplyStatus && (
              <p className="text-xs text-emerald-700">{manualApplyStatus}</p>
            )}
          </Card>

          <Card className="space-y-3 border border-slate-200/70 bg-white/95 p-4 dark:border-slate-800/70 dark:bg-slate-900/50">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              Bloques del día origen
            </p>
            {(!moveSourceDay ||
              !workingPlan[moveSourceDay] ||
              workingPlan[moveSourceDay].sessions.length === 0) && (
              <p className="text-xs text-slate-500">Este día no tiene sesiones.</p>
            )}
            {moveSourceDay &&
              workingPlan[moveSourceDay] &&
              workingPlan[moveSourceDay].sessions.length > 0 && (
                <div className="space-y-2">
                  {workingPlan[moveSourceDay].sessions.map((session) => {
                    const checked = moveSelectedSessionIds.includes(session.id);
                    return (
                      <Card
                        key={session.id}
                        className={`flex items-center justify-between gap-3 border border-slate-200/70 bg-white/90 p-3 dark:border-slate-800/70 dark:bg-slate-950/40 ${
                          checked ? 'ring-1 ring-indigo-400' : ''
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={() => toggleMoveSessionSelection(session.id)}
                            className="h-4 w-4 rounded border-slate-300 text-indigo-600"
                          />
                          <div className="flex flex-col text-xs">
                            <span className="font-semibold text-slate-700">
                              {session.block || 'Bloque sin nombre'}
                            </span>
                            <span className="text-slate-500">
                              {session.time} · {session.duration} · {session.modality} · {session.intensity}
                            </span>
                          </div>
                        </div>
                      </Card>
                    );
                  })}
                </div>
              )}
          </Card>
        </div>
      )}

      {/* Acciones rápidas: Métricas masivas */}
      {activeTab === 'quick-actions' && mode === 'bulk-metrics' && (
        <div className="grid gap-5 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1.4fr)]">
          <Card className="space-y-3 border border-slate-200/70 bg-white/95 p-4 dark:border-slate-800/70 dark:bg-slate-900/50">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              Configuración: Modificar métricas en lote
            </p>
            <p className="text-xs text-slate-500">
              Selecciona los días y define qué métrica quieres modificar y cómo.
            </p>
            <p className="text-[11px] text-slate-500">
              Se aplicará solo a los días seleccionados. El resto del plan no cambiará.
            </p>
          </Card>
          <BulkMetricsMode
            weekDays={weekDays}
            workingPlan={workingPlan}
            setWorkingPlan={setWorkingPlan}
            setManualApplyStatus={setManualApplyStatus}
          />
        </div>
      )}

      {/* Acciones rápidas: Duplicar semana */}
      {activeTab === 'quick-actions' && mode === 'duplicate-week' && (
        <div className="grid gap-5 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1.4fr)]">
          <Card className="space-y-3 border border-slate-200/70 bg-white/95 p-4 dark:border-slate-800/70 dark:bg-slate-900/50">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              Configuración: Duplicar semana completa
            </p>
            <p className="text-xs text-slate-500">
              Selecciona la semana origen y las semanas destino. Opcionalmente aplica variaciones automáticas.
            </p>
            <p className="text-[11px] text-slate-500">
              ⚠️ Esta acción reemplazará completamente el contenido de las semanas destino.
            </p>
          </Card>
          <DuplicateWeekMode
            weekDays={weekDays}
            workingPlan={workingPlan}
            setWorkingPlan={setWorkingPlan}
            setManualApplyStatus={setManualApplyStatus}
          />
        </div>
      )}

      {/* Acciones rápidas: Tags masivos */}
      {activeTab === 'quick-actions' && mode === 'bulk-tags' && (
        <div className="grid gap-5 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1.4fr)]">
          <Card className="space-y-4 border border-slate-200/70 bg-white/95 p-4 dark:border-slate-800/70 dark:bg-slate-900/50">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              Configuración: Gestión masiva de tags
            </p>
            <p className="text-xs text-slate-500">
              Añade o elimina un tag en todos los bloques de los días seleccionados.
            </p>
            <div className="mt-3 grid gap-3 md:grid-cols-3">
              <div className="space-y-2 md:col-span-2">
                <p className="text-xs font-semibold text-slate-500">Días objetivo</p>
                <div className="flex flex-wrap gap-2">
                  {weekDays.map((day) => {
                    const active = bulkTagTargetDays.includes(day);
                    return (
                      <Button
                        key={day}
                        variant={active ? 'secondary' : 'ghost'}
                        size="sm"
                        onClick={() => toggleBulkTagDay(day)}
                      >
                        {day}
                      </Button>
                    );
                  })}
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-xs font-semibold text-slate-500">Acción</p>
                <Select
                  value={bulkTagMode}
                  onChange={(e) => setBulkTagMode(e.target.value as 'add' | 'remove')}
                  options={[
                    { label: 'Añadir tag', value: 'add' },
                    { label: 'Eliminar tag', value: 'remove' },
                  ]}
                />
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-xs font-semibold text-slate-500">Tag</p>
              <Input
                value={bulkTagValue}
                onChange={(e) => setBulkTagValue(e.target.value)}
                placeholder="Nombre del tag (ej: long-form, fuerza, metcon)"
              />
            </div>
            <p className="mt-2 text-[11px] text-slate-500">
              Se aplicará a todos los bloques de los días seleccionados que cumplan la condición de tag.
            </p>
            <div className="mt-4 flex flex-wrap items-center justify-end gap-2">
              <Button
                variant="secondary"
                onClick={handleExecuteBulkTags}
                disabled={!bulkTagValue.trim() || bulkTagTargetDays.length === 0}
              >
                {bulkTagMode === 'add' ? 'Añadir tag a días' : 'Eliminar tag de días'}
              </Button>
              <Button variant="secondary" onClick={handleApplyWorkingPlan}>
                Aplicar cambios al programa
              </Button>
            </div>
            {manualApplyStatus && (
              <p className="text-xs text-emerald-700">{manualApplyStatus}</p>
            )}
          </Card>

          <Card className="space-y-3 border border-slate-200/70 bg-white/95 p-4 text-xs text-slate-600 dark:border-slate-800/70 dark:bg-slate-900/50">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              Impacto estimado
            </p>
            <p className="text-[11px] text-slate-500">
              Esta acción afectará a todos los bloques de los días seleccionados. Usa la vista de &quot;Edición manual&quot;
              o el &quot;Resumen&quot; para revisar el resultado antes de aplicarlo definitivamente al programa.
            </p>
          </Card>
        </div>
      )}

    </div>
  );
}

