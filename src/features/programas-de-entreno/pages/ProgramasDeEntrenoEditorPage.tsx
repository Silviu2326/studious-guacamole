import { useCallback, useEffect, useMemo, useRef, useState, type ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Calendar,
  CalendarCheck,
  CalendarRange,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Dumbbell,
  FileSpreadsheet,
  Flame,
  Library,
  PlusCircle,
  Plus,
  GripVertical,
  ScrollText,
  Save,
  Search,
  Sparkles,
  AlertCircle,
  User,
  Info,
  Replace,
  Settings,
  CheckSquare,
  Square,
  Star,
  Lightbulb,
  Share2,
  Trash2,
  Undo2,
  Redo2,
  Bookmark,
  BookmarkPlus,
  MoreHorizontal,
  Activity,
  AlertTriangle,
  Target as TargetIcon,
  Bell,
  BarChart3,
} from 'lucide-react';
import { Button, Card, Tabs, Badge, Input, Select, Modal, Textarea } from '../../../components/componentsreutilizables';
import { WeeklyEditorView } from '../components/WeeklyEditorView';
import { DailyEditorView } from '../components/DailyEditorView';
import { ExcelSummaryView } from '../components/ExcelSummaryView';
import { LoadTrackingChart } from '../components/LoadTrackingChart';
import { BatchTrainingModal } from '../components/BatchTrainingModal';
import type { BatchTrainingSummary } from '../components/BatchTrainingModal';
import type {
  ContextoCliente,
  DayPlan,
  DaySession,
  PlantillaRecomendada,
  PresetAutomatizacion,
  RespuestasCuestionario,
  ResumenObjetivosProgreso,
  TimelineSesiones,
} from '../types';
import { BuscarSustituirEntidades } from '../components/BuscarSustituirEntidades';
import { CompartirExtractosChat } from '../components/CompartirExtractosChat';
import { SubstitutionHistoryManager } from '../utils/substitutionHistory';
import { SubstitutionPresetsManager, type SubstitutionPreset } from '../utils/substitutionPresets';
import { TagManager } from '../components/TagManager';
import { BulkAutomationFlow } from '../components/BulkAutomationFlow';
import { guardarBorrador } from '../api/programas';
import { useAuth } from '../../../context/AuthContext';
import { AsistenteIAPrograma } from '../components/AsistenteIAPrograma';
import { CuestionarioConfiguracion } from '../components/CuestionarioConfiguracion';
import { GestorFormulas } from '../components/GestorFormulas';
import { GestorPresetsAutomatizaciones } from '../components/GestorPresetsAutomatizaciones';
import { InsightsAssistantPanel } from '../components/InsightsAssistantPanel';
import { NotasAcuerdosRecordatorios } from '../components/NotasAcuerdosRecordatorios';
import type { FormulaPersonalizada } from '../utils/formulasPersonalizadas';

type EditorView = 'weekly' | 'daily' | 'excel';
type LibraryTab = 'templates' | 'blocks' | 'exercises';

type TemplateExample = {
  id: string;
  name: string;
  focus: string;
  duration: string;
  difficulty: 'Facil' | 'Media' | 'Dificil';
  equipment?: string;
  sessions?: number;
  aiTags?: string[];
};

type ExerciseExample = {
  id: string;
  name: string;
  target: string;
  equipment: string;
  difficulty: 'Facil' | 'Media' | 'Dificil';
  intensity?: 'Baja' | 'Media' | 'Alta';
  aiTags?: string[];
};

type BlockExample = {
  id: string;
  name: string;
  category: 'Calentamiento' | 'Fuerza' | 'Accesorios' | 'Movilidad' | 'HIIT' | 'Core';
  focus: string;
  duration: string;
  intensity: 'Baja' | 'Media' | 'Alta';
  level: 'Facil' | 'Media' | 'Dificil';
  equipment: string;
  goal: string;
  aiTags: string[];
};

type LibraryQuickFilters = {
  nivel: 'todos' | 'Facil' | 'Media' | 'Dificil';
  intensidad: 'todos' | 'Baja' | 'Media' | 'Alta';
  material: 'todos' | 'Bandas' | 'Mancuernas' | 'Barra' | 'Máquinas' | 'Peso corporal';
  duracion: 'todos' | '<30' | '30-45' | '>45';
  objetivo: 'todos' | 'Hipertrofia' | 'Fuerza' | 'Movilidad' | 'MetCon' | 'Pérdida de grasa' | 'Core';
  bloque: 'todos' | BlockExample['category'];
};

const DEFAULT_LIBRARY_FILTERS: LibraryQuickFilters = {
  nivel: 'todos',
  intensidad: 'todos',
  material: 'todos',
  duracion: 'todos',
  objetivo: 'todos',
  bloque: 'todos',
};

const difficultyToIntensity = (difficulty: 'Facil' | 'Media' | 'Dificil'): 'Baja' | 'Media' | 'Alta' => {
  if (difficulty === 'Facil') return 'Baja';
  if (difficulty === 'Media') return 'Media';
  return 'Alta';
};

const difficultyColorMap: Record<string, { badgeVariant: 'secondary' | 'green' | 'red'; label: string }> = {
  Facil: { badgeVariant: 'green', label: 'Fácil' },
  Media: { badgeVariant: 'secondary', label: 'Media' },
  Dificil: { badgeVariant: 'red', label: 'Difícil' },
};

const viewTabs = [
  {
    id: 'weekly',
    label: 'Vista semanal',
    icon: <CalendarRange className="h-4 w-4 text-indigo-500" />,
  },
  {
    id: 'daily',
    label: 'Vista diaria',
    icon: <CalendarCheck className="h-4 w-4 text-emerald-500" />,
  },
  {
    id: 'excel',
    label: 'Vista Excel',
    icon: <FileSpreadsheet className="h-4 w-4 text-slate-500" />,
  },
] as const satisfies { id: EditorView; label: string; icon: JSX.Element }[];

const baseWeekDays = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'] as const;
const TOTAL_WEEKS = 4;
const weekDays = Array.from({ length: TOTAL_WEEKS }, (_, weekIndex) =>
  baseWeekDays.map((day) => `${day} · Semana ${weekIndex + 1}`),
).flat();

type DayKey = (typeof weekDays)[number];

const BASE_WEEK_PLAN: Record<(typeof baseWeekDays)[number], DayPlan> = {
  Lunes: {
    microCycle: 'Semana 3 · Hipertrofia',
    focus: 'Upper body power',
    volume: '18 series',
    intensity: 'RPE 7',
    restorative: 'Movilidad torácica',
    summary: ['Press inclin bench tempo 3-1-1', 'Dominadas lastradas progresivas', 'Core anti-rotación con bandas'],
    sessions: [
      {
        id: 'mon-06',
        time: '08:00',
        block: 'Activation & mobility',
        duration: '12 min',
        modality: 'Mobility',
        intensity: 'Ligera',
        notes: 'Foam roller + band pull aparts',
      },
      {
        id: 'mon-08',
        time: '10:00',
        block: 'Strength block',
        duration: '38 min',
        modality: 'Strength',
        intensity: 'RPE 8',
        notes: 'Superseries · Press + Dominadas',
      },
      {
        id: 'mon-10',
        time: '18:00',
        block: 'Conditioning finisher',
        duration: '15 min',
        modality: 'MetCon',
        intensity: 'Alta',
        notes: 'Ski erg + battle rope EMOM',
      },
    ],
  },
  Martes: {
    microCycle: 'Semana 3 · Hipertrofia',
    focus: 'Lower body strength',
    volume: '21 series',
    intensity: 'RPE 7.5',
    restorative: 'Respiración diafragmática',
    summary: ['Back squat tempo 4-1-1', 'Sled push heavy intervals', 'Trabajo isométrico glúteo'],
    sessions: [
      {
        id: 'tue-06',
        time: '08:00',
        block: 'Primer bloque fuerza',
        duration: '40 min',
        modality: 'Strength',
        intensity: 'RPE 7',
        notes: 'Back squat + split squat',
      },
      {
        id: 'tue-08',
        time: '12:00',
        block: 'Acondicionamiento unilateral',
        duration: '20 min',
        modality: 'Accessory',
        intensity: 'Moderada',
        notes: 'Bulgarian split squat + hip thrust',
      },
      {
        id: 'tue-10',
        time: '18:00',
        block: 'Recuperación activa',
        duration: '10 min',
        modality: 'Recovery',
        intensity: 'Ligera',
        notes: 'Mobility flow lower body',
      },
    ],
  },
  Miércoles: {
    microCycle: 'Semana 3 · Hipertrofia',
    focus: 'MetCon + Core',
    volume: '16 series',
    intensity: 'RPE 6.5',
    restorative: 'Trabajo respiración nasal',
    summary: ['Circuito kettlebell 6 movimientos', 'Intervals bike + burpees', 'Core anti-flexión & anti-rotación'],
    sessions: [
      {
        id: 'wed-06',
        time: '09:00',
        block: 'Complex KB',
        duration: '25 min',
        modality: 'MetCon',
        intensity: 'Alta',
        notes: 'Complex 6 movimientos',
      },
      {
        id: 'wed-08',
        time: '12:00',
        block: 'Intervals',
        duration: '20 min',
        modality: 'Cardio',
        intensity: 'Moderada',
        notes: 'Bike erg interval 30/30',
      },
      {
        id: 'wed-10',
        time: '19:00',
        block: 'Core stability',
        duration: '15 min',
        modality: 'Core',
        intensity: 'Ligera',
        notes: 'Pallof press + hollow rocks',
      },
    ],
  },
  Jueves: {
    microCycle: 'Semana 3 · Hipertrofia',
    focus: 'Upper body hypertrophy',
    volume: '20 series',
    intensity: 'RPE 7',
    restorative: 'Upper mobility flow',
    summary: ['Press militar con tempo', 'Remo pecho apoyado', 'Farmer carry 40mts x 4'],
    sessions: [
      {
        id: 'thu-06',
        time: '07:30',
        block: 'Warm-up & priming',
        duration: '10 min',
        modality: 'Mobility',
        intensity: 'Ligera',
        notes: 'Shoulder CARs + scap push ups',
      },
      {
        id: 'thu-08',
        time: '11:00',
        block: 'Hypertrophy waves',
        duration: '42 min',
        modality: 'Strength',
        intensity: 'RPE 7',
        notes: 'Press militar + chest supported row',
      },
      {
        id: 'thu-10',
        time: '18:00',
        block: 'Carry & grip',
        duration: '12 min',
        modality: 'Accessory',
        intensity: 'Alta',
        notes: 'Farmer carry + sandbag hold',
      },
    ],
  },
  Viernes: {
    microCycle: 'Semana 3 · Hipertrofia',
    focus: 'Lower body speed',
    volume: '17 series',
    intensity: 'RPE 6.5',
    restorative: 'Cadera + movilidad dinámica',
    summary: ['Trap bar deadlift speed', 'Pliometría reactiva', 'Sled drag backwards'],
    sessions: [
      {
        id: 'fri-06',
        time: '08:00',
        block: 'Speed pull',
        duration: '30 min',
        modality: 'Strength',
        intensity: 'Moderada',
        notes: 'Trap bar 60% velocity sets',
      },
      {
        id: 'fri-08',
        time: '13:00',
        block: 'Plyo contrast',
        duration: '18 min',
        modality: 'Plyo',
        intensity: 'Alta',
        notes: 'Depth jumps + bounds',
      },
      {
        id: 'fri-10',
        time: '19:00',
        block: 'Posterior chain finisher',
        duration: '12 min',
        modality: 'Accessory',
        intensity: 'Moderada',
        notes: 'Sled drag backwards + hamstring',
      },
    ],
  },
  Sábado: {
    microCycle: 'Semana 3 · Hipertrofia',
    focus: 'Team MetCon',
    volume: '12 series',
    intensity: 'RPE 7.5',
    restorative: 'Stretching global 15 min',
    summary: ['Partner WOD estilo AMRAP', 'Bike + Wall ball ladder', 'Cooldown asistido'],
    sessions: [
      {
        id: 'sat-06',
        time: '10:00',
        block: 'Partner AMRAP',
        duration: '30 min',
        modality: 'MetCon',
        intensity: 'Alta',
        notes: 'AMRAP 20 con pareja',
      },
      {
        id: 'sat-08',
        time: '12:00',
        block: 'Bike + wall ball ladder',
        duration: '20 min',
        modality: 'Cardio',
        intensity: 'Moderada',
        notes: 'Bike erg + wall balls',
      },
      {
        id: 'sat-10',
        time: '13:00',
        block: 'Assisted cooldown',
        duration: '15 min',
        modality: 'Recovery',
        intensity: 'Ligera',
        notes: 'Stretch con coach',
      },
    ],
  },
  Domingo: {
    microCycle: 'Semana 3 · Hipertrofia',
    focus: 'Recovery + Mobility',
    volume: '8 series',
    intensity: 'RPE 4',
    restorative: 'Breath work + sauna',
    summary: ['Yoga mobility session', 'Core estabilidad baja intensidad', 'Sauna + contrast shower'],
    sessions: [
      {
        id: 'sun-06',
        time: '09:00',
        block: 'Mobility flow',
        duration: '25 min',
        modality: 'Mobility',
        intensity: 'Ligera',
        notes: 'Sesión guiada full body',
      },
      {
        id: 'sun-08',
        time: '11:00',
        block: 'Core control',
        duration: '15 min',
        modality: 'Core',
        intensity: 'Ligera',
        notes: 'Respiración + plank series',
      },
      {
        id: 'sun-10',
        time: '18:00',
        block: 'Sauna + contrast',
        duration: '20 min',
        modality: 'Recovery',
        intensity: 'Regenerativa',
        notes: 'Sauna 10’ + ducha fría 2’',
      },
    ],
  },
};

const cloneDayPlan = (plan: DayPlan): DayPlan => ({
  ...plan,
  summary: [...plan.summary],
  sessions: plan.sessions.map((session) => ({ ...session, id: `${session.id}-${Math.random().toString(36).slice(2, 6)}` })),
});

const INITIAL_WEEKLY_PLAN: Record<DayKey, DayPlan> = weekDays.reduce((acc, label) => {
  const baseDay = label.split(' · ')[0] as (typeof baseWeekDays)[number];
  acc[label as DayKey] = cloneDayPlan(BASE_WEEK_PLAN[baseDay]);
  return acc;
}, {} as Record<DayKey, DayPlan>);

type EditorHeaderProps = {
  onBack: () => void;
  rightCollapsed: boolean;
  onRestoreRightPanel: () => void;
  onOpenClientInfo: () => void;
  onQuickSwitchClient: () => void;
  onOpenFitCoach: () => void;
  onOpenSubstitutions: () => void;
  onOpenBatchTraining: () => void;
  onOpenCompartirChat: () => void;
  onOpenBuscarSustituir: () => void;
  onOpenTagManager: () => void;
  onOpenCharts: () => void;
  onOpenAutomationPresets: () => void;
  onOpenBulkAutomation: () => void;
  onOpenLayoutSurvey: () => void;
  onOpenImportTemplate: () => void;
  activeView: EditorView;
  onChangeView: (view: EditorView) => void;
  onSaveDraft: () => void;
  lastSaveTime: string | null;
  clienteNombre: string;
  clienteContexto?: string;
  clienteAvatarUrl?: string | null;
  programaEstado: 'borrador' | 'enviado' | 'auto-ia';
  clienteNivel?: string | null;
  clienteLesion?: string | null;
  clienteObjetivo?: string | null;
  clienteAlerta?: string | null;
};

function EditorHeader({
  onBack,
  rightCollapsed,
  onRestoreRightPanel,
  onOpenClientInfo,
  onOpenFitCoach,
  onOpenSubstitutions,
  onOpenBatchTraining,
  onOpenCompartirChat,
  onOpenBuscarSustituir,
  onOpenCharts,
  onOpenTagManager,
  onOpenAutomationPresets,
  onOpenBulkAutomation,
  onOpenLayoutSurvey,
  onOpenImportTemplate,
  activeView,
  onChangeView,
  onSaveDraft,
  lastSaveTime,
  clienteNombre,
  clienteContexto,
  clienteAvatarUrl,
  programaEstado,
  onQuickSwitchClient,
  clienteNivel,
  clienteLesion,
  clienteObjetivo,
  clienteAlerta,
}: EditorHeaderProps) {
  const formatLastSaveTime = (timestamp: string | null) => {
    if (!timestamp) return null;
    try {
      const date = new Date(timestamp);
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMs / 3600000);
      const diffDays = Math.floor(diffMs / 86400000);

      if (diffMins < 1) return 'Ahora';
      if (diffMins < 60) return `Hace ${diffMins} min`;
      if (diffHours < 24) return `Hace ${diffHours} h`;
      if (diffDays === 1) return 'Ayer';
      if (diffDays < 7) return `Hace ${diffDays} días`;

      // Formato completo para fechas más antiguas
      return date.toLocaleDateString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return null;
    }
  };

  const formattedTime = formatLastSaveTime(lastSaveTime);

  const statusConfig: Record<
    EditorHeaderProps['programaEstado'],
    { label: string; badgeVariant: 'secondary' | 'green' | 'outline' }
  > = {
    borrador: { label: 'Borrador', badgeVariant: 'secondary' },
    enviado: { label: 'Enviado', badgeVariant: 'green' },
    'auto-ia': { label: 'Auto-IA activa', badgeVariant: 'outline' },
  };

  const clienteIniciales = useMemo(() => {
    return clienteNombre
      .split(' ')
      .filter(Boolean)
      .map((parte) => parte[0]?.toUpperCase())
      .slice(0, 2)
      .join('');
  }, [clienteNombre]);

  const status = statusConfig[programaEstado];
  const [isMoreToolsOpen, setIsMoreToolsOpen] = useState(false);
  const moreToolsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isMoreToolsOpen) return;
    const handleClick = (event: MouseEvent) => {
      if (!moreToolsRef.current) return;
      if (!moreToolsRef.current.contains(event.target as Node)) {
        setIsMoreToolsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [isMoreToolsOpen]);

  const indicators = useMemo(() => {
    const items: Array<{ id: string; label: string; tone: 'success' | 'warning' | 'info' | 'alert'; icon: JSX.Element }> = [];
    if (clienteNivel) {
      items.push({
        id: 'nivel',
        label: clienteNivel,
        tone: 'success',
        icon: <Activity className="h-3.5 w-3.5 text-emerald-500" />,
      });
    }
    if (clienteLesion) {
      items.push({
        id: 'lesion',
        label: clienteLesion,
        tone: 'warning',
        icon: <AlertTriangle className="h-3.5 w-3.5 text-amber-500" />,
      });
    }
    if (clienteObjetivo) {
      items.push({
        id: 'objetivo',
        label: clienteObjetivo,
        tone: 'info',
        icon: <TargetIcon className="h-3.5 w-3.5 text-indigo-500" />,
      });
    }
    if (clienteAlerta) {
      items.push({
        id: 'alerta',
        label: clienteAlerta,
        tone: 'alert',
        icon: <Bell className="h-3.5 w-3.5 text-rose-500" />,
      });
    }
    return items;
  }, [clienteNivel, clienteLesion, clienteObjetivo, clienteAlerta]);

  const vistasGroupClass =
    'rounded-2xl border border-indigo-100 bg-white px-4 py-3 shadow-[0_8px_20px_rgba(99,102,241,0.12)] dark:border-indigo-500/30 dark:bg-slate-900/70';
  const groupLabelClass = 'text-[11px] font-semibold uppercase tracking-wide text-slate-400';
  const buttonGroupClass = 'flex flex-wrap items-center gap-2';
  const groupedButtonClass = 'px-3';

  return (
    <header className="rounded-3xl border border-slate-200/70 bg-white/95 px-6 py-5 shadow-sm dark:border-slate-800/70 dark:bg-slate-950/60">
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200/60 pb-4 dark:border-slate-800/70">
          <div className="flex flex-wrap items-center gap-4 min-w-0">
            <Button variant="ghost" size="sm" leftIcon={<ArrowLeft className="h-4 w-4" />} onClick={onBack}>
              Volver
            </Button>
            <div className="flex items-center gap-3 min-w-0">
              <div className="h-11 w-11 flex-shrink-0 rounded-full bg-gradient-to-br from-indigo-100 to-indigo-200 text-sm font-semibold text-indigo-700 dark:from-indigo-500/20 dark:to-indigo-500/10 dark:text-indigo-200 flex items-center justify-center overflow-hidden">
                {clienteAvatarUrl ? (
                  <img
                    src={clienteAvatarUrl}
                    alt={clienteNombre}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  clienteIniciales || <User className="h-4 w-4" />
                )}
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-slate-900 dark:text-slate-100">{clienteNombre}</p>
                <p className="text-xs text-slate-500 dark:text-slate-300">{clienteContexto ?? 'Cliente activo'}</p>
                {indicators.length > 0 && (
                  <div className="mt-1 flex flex-wrap gap-2 text-[11px] text-slate-500">
                    {indicators.map((indicator) => (
                      <span
                        key={indicator.id}
                        className="flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 dark:bg-slate-800/70"
                      >
                        {indicator.icon}
                        <span className="line-clamp-1">{indicator.label}</span>
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <Button variant="secondary" size="sm" onClick={onQuickSwitchClient}>
                Cambiar cliente
              </Button>
              <Button variant="ghost" size="sm" leftIcon={<Info className="h-4 w-4" />} onClick={onOpenClientInfo}>
                Ver ficha
              </Button>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant={status.badgeVariant}>{status.label}</Badge>
            {programaEstado === 'auto-ia' && (
              <Badge variant="secondary" className="flex items-center gap-1 text-emerald-600 dark:text-emerald-300">
                <Sparkles className="h-3.5 w-3.5" />
                Auto-IA
              </Badge>
            )}
            {rightCollapsed && (
              <Button variant="ghost" size="sm" onClick={onRestoreRightPanel}>
                Mostrar panel
              </Button>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:gap-6">
          <div className={`${vistasGroupClass} flex-1`}>
            <p className={`${groupLabelClass} mb-2 text-indigo-500`}>Vistas</p>
            <Tabs
              items={viewTabs}
              activeTab={activeView}
              onTabChange={(tabId) => onChangeView(tabId as EditorView)}
              variant="pills"
              size="sm"
              className="justify-start"
            />
          </div>

          <div className="flex flex-1 flex-col gap-2 rounded-2xl border border-slate-200/70 bg-white/80 px-4 py-3 shadow-sm dark:border-slate-800/60 dark:bg-slate-900/60">
            <p className={`${groupLabelClass}`}>Acciones inteligentes</p>
            <div className={`${buttonGroupClass}`}>
              <Button
                variant="ghost"
                size="sm"
                className={groupedButtonClass}
                leftIcon={<Sparkles className="h-4 w-4" />}
                onClick={onOpenFitCoach}
              >
                FitCoach
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className={groupedButtonClass}
                leftIcon={<Settings className="h-4 w-4" />}
                onClick={onOpenBatchTraining}
              >
                BatchTraining
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className={groupedButtonClass}
                leftIcon={<Replace className="h-4 w-4" />}
                onClick={onOpenSubstitutions}
              >
                Sustituciones IA
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className={groupedButtonClass}
                leftIcon={<Bookmark className="h-4 w-4" />}
                onClick={onOpenAutomationPresets}
              >
                Presets inteligentes
              </Button>
            </div>
          </div>

          <div className="flex flex-1 flex-col gap-2 rounded-2xl border border-slate-200/70 bg-white/80 px-4 py-3 shadow-sm dark:border-slate-800/60 dark:bg-slate-900/60">
            <p className={`${groupLabelClass}`}>Utilidades</p>
            <div className={`${buttonGroupClass} justify-end`}>
              <Button
                variant="ghost"
                size="sm"
                className={groupedButtonClass}
                leftIcon={<Search className="h-4 w-4" />}
                onClick={onOpenBuscarSustituir}
              >
                Buscar y sustituir
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className={groupedButtonClass}
                leftIcon={<Lightbulb className="h-4 w-4" />}
                onClick={onOpenLayoutSurvey}
              >
                Layout
              </Button>
              <div className="relative" ref={moreToolsRef}>
                <Button
                  variant="ghost"
                  size="sm"
                  className={`${groupedButtonClass} font-medium`}
                  leftIcon={<MoreHorizontal className="h-4 w-4" />}
                  onClick={() => setIsMoreToolsOpen((prev) => !prev)}
                  aria-haspopup="menu"
                  aria-expanded={isMoreToolsOpen}
                >
                  Más herramientas
                </Button>
                {isMoreToolsOpen && (
                  <div className="absolute right-0 top-full z-20 mt-2 w-56 rounded-2xl border border-slate-200 bg-white/95 p-2 shadow-xl dark:border-slate-700 dark:bg-slate-900">
                    <div className="flex flex-col divide-y divide-slate-100 dark:divide-slate-800">
                      {[
                        {
                          label: 'Importar plantilla',
                          icon: <Library className="h-4 w-4 text-slate-500" />,
                          action: () => onOpenImportTemplate(),
                        },
                        {
                          label: 'Tags',
                          icon: <BookmarkPlus className="h-4 w-4 text-slate-500" />,
                          action: () => onOpenTagManager(),
                        },
                        {
                          label: 'Gráficos',
                          icon: <BarChart3 className="h-4 w-4 text-slate-500" />,
                          action: () => onOpenCharts(),
                        },
                        {
                          label: 'Compartir',
                          icon: <Share2 className="h-4 w-4 text-slate-500" />,
                          action: () => onOpenCompartirChat(),
                        },
                        {
                          label: 'Automatización',
                          icon: <Sparkles className="h-4 w-4 text-slate-500" />,
                          action: () => onOpenBulkAutomation(),
                        },
                      ].map((item, index) => (
                        <button
                          key={item.label}
                          type="button"
                          className={`flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-slate-600 transition hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-800 ${
                            index === 0 ? '' : ''
                          }`}
                          onClick={() => {
                            item.action();
                            setIsMoreToolsOpen(false);
                          }}
                        >
                          {item.icon}
                          <span>{item.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <div className="flex flex-col items-end">
                <Button
                  variant="primary"
                  size="sm"
                  className="bg-gradient-to-r from-indigo-500 via-fuchsia-500 to-rose-500 text-white shadow-lg shadow-rose-200/60 transition hover:brightness-105 dark:shadow-none"
                  leftIcon={<Save className="h-4 w-4" />}
                  onClick={onSaveDraft}
                >
                  Guardar
                </Button>
                {formattedTime && (
                  <span className="mt-0.5 text-[10px] text-slate-500 dark:text-slate-400">
                    {formattedTime}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}


type LibrarySidebarProps = {
  leftCollapsed: boolean;
  onToggleCollapse: () => void;
  libraryTab: LibraryTab;
  onChangeLibraryTab: (tab: LibraryTab) => void;
  librarySearch: string;
  onChangeLibrarySearch: (value: string) => void;
  searchSuggestions: string[];
  onSelectSuggestion: (value: string) => void;
  quickFilters: LibraryQuickFilters;
  onUpdateQuickFilter: (filter: keyof LibraryQuickFilters, value: LibraryQuickFilters[keyof LibraryQuickFilters]) => void;
  templateLists: {
    pinned: TemplateExample[];
    unpinned: TemplateExample[];
    pinnedCount: number;
  };
  blockList: BlockExample[];
  exerciseLists: {
    pinned: ExerciseExample[];
    unpinned: ExerciseExample[];
    pinnedCount: number;
  };
  onTogglePinTemplate: (templateId: string) => void;
  onTogglePinExercise: (exerciseId: string) => void;
  onDragStart: (type: 'template' | 'block' | 'exercise', item: TemplateExample | BlockExample | ExerciseExample) => void;
  onAddToLibrary: () => void;
};


function LibrarySidebar({
  leftCollapsed,
  onToggleCollapse,
  libraryTab,
  onChangeLibraryTab,
  librarySearch,
  onChangeLibrarySearch,
  searchSuggestions,
  onSelectSuggestion,
  quickFilters,
  onUpdateQuickFilter,
  templateLists,
  blockList,
  exerciseLists,
  onTogglePinTemplate,
  onTogglePinExercise,
  onDragStart,
  onAddToLibrary,
}: LibrarySidebarProps) {
  const [showHeaderDescription, setShowHeaderDescription] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  const chipsConfig: Array<{
    id: keyof LibraryQuickFilters;
    label: string;
    options: { label: string; value: LibraryQuickFilters[keyof LibraryQuickFilters] }[];
  }> = [
    {
      id: 'nivel',
      label: 'Nivel',
      options: [
        { label: 'Todos', value: 'todos' },
        { label: 'Fácil', value: 'Facil' },
        { label: 'Medio', value: 'Media' },
        { label: 'Difícil', value: 'Dificil' },
      ],
    },
    {
      id: 'intensidad',
      label: 'Intensidad',
      options: [
        { label: 'Todas', value: 'todos' },
        { label: 'Baja', value: 'Baja' },
        { label: 'Media', value: 'Media' },
        { label: 'Alta', value: 'Alta' },
      ],
    },
    {
      id: 'material',
      label: 'Material',
      options: [
        { label: 'Todos', value: 'todos' },
        { label: 'Bandas', value: 'Bandas' },
        { label: 'Mancuernas', value: 'Mancuernas' },
        { label: 'Barra', value: 'Barra' },
        { label: 'Máquinas', value: 'Máquinas' },
        { label: 'Peso corporal', value: 'Peso corporal' },
      ],
    },
    {
      id: 'duracion',
      label: 'Duración',
      options: [
        { label: 'Todas', value: 'todos' },
        { label: '<30’', value: '<30' },
        { label: '30–45’', value: '30-45' },
        { label: '>45’', value: '>45' },
      ],
    },
    {
      id: 'objetivo',
      label: 'Objetivo',
      options: [
        { label: 'Todos', value: 'todos' },
        { label: 'Hipertrofia', value: 'Hipertrofia' },
        { label: 'Fuerza', value: 'Fuerza' },
        { label: 'Movilidad', value: 'Movilidad' },
        { label: 'MetCon', value: 'MetCon' },
        { label: 'Pérdida grasa', value: 'Pérdida de grasa' },
        { label: 'Core', value: 'Core' },
      ],
    },
    {
      id: 'bloque',
      label: 'Tipo de bloque',
      options: [
        { label: 'Todos', value: 'todos' },
        { label: 'Calentamiento', value: 'Calentamiento' },
        { label: 'Fuerza', value: 'Fuerza' },
        { label: 'Accesorios', value: 'Accesorios' },
        { label: 'Movilidad', value: 'Movilidad' },
        { label: 'HIIT', value: 'HIIT' },
        { label: 'Core', value: 'Core' },
      ],
    },
  ];

  const renderTemplateCard = (template: TemplateExample, isPinned: boolean = false) => (
    <div
      key={template.id}
      draggable
      onDragStart={(e) => {
        e.dataTransfer.setData('application/json', JSON.stringify({ type: 'template', item: template }));
        onDragStart('template', template);
      }}
      className="w-full cursor-move rounded-2xl border border-slate-200/80 bg-white/95 p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-indigo-300 hover:shadow-lg dark:border-slate-800/70 dark:bg-slate-950/60 dark:hover:border-indigo-500/40"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{template.name}</p>
          <p className="text-xs text-slate-500 dark:text-slate-300">{template.focus}</p>
          <div className="mt-2 flex flex-wrap items-center gap-2 text-[11px] text-slate-500">
            <span className="rounded-full bg-slate-100 px-2 py-0.5 dark:bg-slate-800/60">
              {difficultyColorMap[template.difficulty].label}
            </span>
            <span className="rounded-full bg-indigo-50 px-2 py-0.5 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-300">
              {template.duration}
            </span>
            {template.sessions && (
              <span className="rounded-full bg-slate-100 px-2 py-0.5 dark:bg-slate-900/60">{template.sessions} sesiones</span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-label={isPinned ? 'Quitar de favoritas' : 'Marcar como favorita'}
            className={`rounded-full p-1 ${isPinned ? 'text-amber-500' : 'text-slate-400 hover:text-amber-400'}`}
            onClick={() => onTogglePinTemplate(template.id)}
          >
            <Star className={`h-4 w-4 ${isPinned ? 'fill-amber-400 text-amber-500' : ''}`} />
          </button>
          <GripVertical className="h-4 w-4 text-slate-300" />
        </div>
      </div>
      <div className="mt-3 flex flex-wrap gap-2 text-[11px] text-indigo-600 dark:text-indigo-300">
        <span className="rounded-full bg-indigo-50 px-2 py-0.5 dark:bg-indigo-500/10">IA ready</span>
        <span className="rounded-full bg-indigo-50 px-2 py-0.5 dark:bg-indigo-500/10">Personalizable</span>
        {template.aiTags?.slice(0, 2).map((tag) => (
          <span key={tag} className="rounded-full bg-slate-100 px-2 py-0.5 dark:bg-slate-800/60">
            {tag}
          </span>
        ))}
      </div>
    </div>
  );

  const renderBlockCard = (block: BlockExample) => (
    <div
      key={block.id}
      draggable
      onDragStart={(e) => {
        e.dataTransfer.setData('application/json', JSON.stringify({ type: 'block', item: block }));
        onDragStart('block', block);
      }}
      className="w-full cursor-move rounded-2xl border border-slate-200/80 bg-white/95 p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-emerald-300 hover:shadow-lg dark:border-slate-800/70 dark:bg-slate-950/60 dark:hover:border-emerald-500/40"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 text-[11px] uppercase tracking-wide text-emerald-600">
            <span>{block.category}</span>
            <span className="text-slate-300">•</span>
            <span>{block.goal}</span>
          </div>
          <p className="mt-1 text-sm font-semibold text-slate-900 dark:text-slate-100">{block.name}</p>
          <p className="text-xs text-slate-500 dark:text-slate-300">{block.focus}</p>
          <div className="mt-2 flex flex-wrap gap-2 text-[11px] text-slate-500">
            <span className="rounded-full bg-slate-100 px-2 py-0.5 dark:bg-slate-800/60">{block.duration}</span>
            <span className="rounded-full bg-slate-100 px-2 py-0.5 dark:bg-slate-800/60">{block.intensity}</span>
            <span className="rounded-full bg-slate-100 px-2 py-0.5 dark:bg-slate-800/60">{block.equipment}</span>
          </div>
        </div>
        <GripVertical className="h-4 w-4 text-slate-300" />
      </div>
      <div className="mt-3 flex flex-wrap gap-2 text-[11px] text-indigo-600 dark:text-indigo-300">
        {block.aiTags.map((tag) => (
          <span key={tag} className="rounded-full bg-indigo-50 px-2 py-0.5 dark:bg-indigo-500/10">
            {tag}
          </span>
        ))}
      </div>
    </div>
  );

  const renderExerciseCard = (exercise: ExerciseExample, isPinned: boolean = false) => (
    <div
      key={exercise.id}
      draggable
      onDragStart={(e) => {
        e.dataTransfer.setData('application/json', JSON.stringify({ type: 'exercise', item: exercise }));
        onDragStart('exercise', exercise);
      }}
      className="w-full cursor-move rounded-2xl border border-slate-200/80 bg-white/95 p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-emerald-300 hover:shadow-lg dark:border-slate-800/70 dark:bg-slate-950/60 dark:hover:border-emerald-500/40"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{exercise.name}</p>
          <p className="text-xs text-slate-500 dark:text-slate-300">{exercise.target}</p>
          <div className="mt-2 flex flex-wrap gap-2 text-[11px] text-slate-500">
            <span className="rounded-full bg-slate-100 px-2 py-0.5 dark:bg-slate-800/60">{exercise.equipment}</span>
            {exercise.intensity && (
              <span className="rounded-full bg-slate-100 px-2 py-0.5 dark:bg-slate-800/60">{exercise.intensity}</span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-label={isPinned ? 'Quitar de favoritos' : 'Marcar como favorito'}
            className={`rounded-full p-1 ${isPinned ? 'text-amber-500' : 'text-slate-400 hover:text-amber-400'}`}
            onClick={(e) => {
              e.stopPropagation();
              onTogglePinExercise(exercise.id);
            }}
          >
            <Star className={`h-4 w-4 ${isPinned ? 'fill-amber-400 text-amber-500' : ''}`} />
          </button>
          <GripVertical className="h-4 w-4 text-slate-300" />
        </div>
      </div>
      <div className="mt-3 flex flex-wrap gap-2 text-[11px] text-indigo-600 dark:text-indigo-300">
        {exercise.aiTags?.map((tag) => (
          <span key={tag} className="rounded-full bg-indigo-50 px-2 py-0.5 dark:bg-indigo-500/10">
            {tag}
          </span>
        ))}
      </div>
    </div>
  );

  const renderActiveList = () => {
    if (libraryTab === 'templates') {
      return (
        <div className="space-y-3">
          {templateLists.pinnedCount > 0 && (
            <div className="space-y-2">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-amber-500">Favoritas</p>
              {templateLists.pinned.map((template) => renderTemplateCard(template, true))}
              <div className="pt-2 text-[10px] uppercase tracking-wide text-slate-400">Todas las plantillas</div>
            </div>
          )}
          {templateLists.unpinned.map((template) => renderTemplateCard(template))}
          {templateLists.unpinned.length === 0 && templateLists.pinned.length === 0 && (
            <div className="rounded-2xl border border-dashed border-slate-200/70 p-4 text-center text-xs text-slate-500 dark:border-slate-700">
              No hay resultados con los filtros actuales
            </div>
          )}
        </div>
      );
    }

    if (libraryTab === 'blocks') {
      return (
        <div className="space-y-3">
          {blockList.map((block) => renderBlockCard(block))}
          {blockList.length === 0 && (
            <div className="rounded-2xl border border-dashed border-slate-200/70 p-4 text-center text-xs text-slate-500 dark:border-slate-700">
              Ajusta los filtros para ver bloques disponibles
            </div>
          )}
        </div>
      );
    }

    return (
      <div className="space-y-3">
        {exerciseLists.pinnedCount > 0 && (
          <div className="space-y-2">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-amber-500">Favoritos</p>
            {exerciseLists.pinned.map((exercise) => renderExerciseCard(exercise, true))}
            <div className="pt-2 text-[10px] uppercase tracking-wide text-slate-400">Todos los ejercicios</div>
          </div>
        )}
        {exerciseLists.unpinned.map((exercise) => renderExerciseCard(exercise))}
        {exerciseLists.unpinned.length === 0 && exerciseLists.pinned.length === 0 && (
          <div className="rounded-2xl border border-dashed border-slate-200/70 p-4 text-center text-xs text-slate-500 dark:border-slate-700">
            No encontramos ejercicios que coincidan
          </div>
        )}
      </div>
    );
  };

  return (
    <aside
      className={`relative flex w-full flex-col gap-4 transition-all duration-300 lg:flex-shrink-0 ${
        leftCollapsed ? 'lg:w-16' : 'lg:w-[340px]'
      }`}
    >
      <button
        type="button"
        onClick={onToggleCollapse}
        className="absolute -right-3 top-4 flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 shadow-sm transition hover:border-indigo-300 hover:text-indigo-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300"
        aria-label={leftCollapsed ? 'Expandir panel izquierdo' : 'Colapsar panel izquierdo'}
      >
        {leftCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
      </button>

      {leftCollapsed ? (
        <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-slate-200/70 bg-white/95 p-3 text-center shadow-sm dark:border-slate-800/70 dark:bg-slate-950/60">
          <Library className="h-5 w-5 text-indigo-500" />
          <PlusCircle className="h-5 w-5 text-slate-400" />
          <span className="text-[11px] font-medium text-slate-500 dark:text-slate-300">Biblioteca</span>
        </div>
      ) : (
        <>
          <Card className="border border-slate-200/70 bg-white/95 p-5 dark:border-slate-800/70 dark:bg-slate-950/60">
            <div className="flex items-center justify-between gap-2">
              <div>
                <div className="flex items-center gap-2">
                  <Library className="h-5 w-5 text-indigo-500" />
                  <h2 className="text-sm font-semibold text-slate-800 dark:text-slate-100">Biblioteca & bloques</h2>
                </div>
                {showHeaderDescription && (
                  <p className="mt-2 text-xs text-slate-500 dark:text-slate-300">
                    Arrastra bloques prediseñados, ejercicios o plantillas completas. Curado para entrenadores pro.
                  </p>
                )}
                <button
                  type="button"
                  className="mt-1 flex items-center gap-1 text-[11px] font-medium text-indigo-600 hover:text-indigo-700 dark:text-indigo-300"
                  onClick={() => setShowHeaderDescription((prev) => !prev)}
                >
                  {showHeaderDescription ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                  {showHeaderDescription ? 'Ocultar descripción' : 'Mostrar descripción'}
                </button>
              </div>
              <Button variant="secondary" size="sm" leftIcon={<Plus className="h-4 w-4" />} onClick={onAddToLibrary}>
                Añadir a biblioteca
              </Button>
            </div>

            <div className="mt-4">
            <div className="w-full overflow-hidden">
              <Tabs
                items={[
                  {
                    id: 'templates',
                    label: 'Plantillas',
                    icon: <ScrollText className="h-3.5 w-3.5 text-indigo-500" />,
                  },
                  {
                    id: 'blocks',
                    label: 'Bloques',
                    icon: <Flame className="h-3.5 w-3.5 text-amber-500" />,
                  },
                  {
                    id: 'exercises',
                    label: 'Ejercicios',
                    icon: <Dumbbell className="h-3.5 w-3.5 text-emerald-500" />,
                  },
                ]}
                activeTab={libraryTab}
                onTabChange={(tabId) => onChangeLibraryTab(tabId as LibraryTab)}
                variant="pills"
                size="sm"
                className="flex w-full justify-between gap-2 whitespace-nowrap rounded-2xl bg-slate-50/80 p-1 dark:bg-slate-900/50"
              />
            </div>
            </div>

            <div className="mt-4 space-y-2">
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <Input
                  placeholder="Buscar plantillas, bloques o ejercicios..."
                  className="pl-9"
                  value={librarySearch}
                  onChange={(e) => onChangeLibrarySearch(e.target.value)}
                />
                {librarySearch.length >= 2 && searchSuggestions.length > 0 && (
                  <div className="absolute z-20 mt-1 w-full rounded-2xl border border-slate-200 bg-white p-2 shadow-lg dark:border-slate-700 dark:bg-slate-900">
                    {searchSuggestions.slice(0, 5).map((suggestion) => (
                      <button
                        key={suggestion}
                        type="button"
                        className="w-full rounded-xl px-3 py-1.5 text-left text-xs text-slate-600 transition hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-800"
                        onClick={() => onSelectSuggestion(suggestion)}
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-3 dark:border-slate-800 dark:bg-slate-900/40">
                <button
                  type="button"
                  className="flex w-full items-center justify-between text-[11px] font-semibold uppercase tracking-wide text-slate-400"
                  onClick={() => setShowFilters((prev) => !prev)}
                >
                  <span>Filtros inteligentes</span>
                  {showFilters ? (
                    <ChevronUp className="h-3 w-3 text-slate-400" />
                  ) : (
                    <ChevronDown className="h-3 w-3 text-slate-400" />
                  )}
                </button>
                {showFilters && (
                  <div className="mt-2 space-y-2">
                    {chipsConfig.map((group) => (
                      <div key={group.id}>
                        <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-300">{group.label}</p>
                        <div className="mt-1 flex flex-wrap gap-2">
                          {group.options.map((option) => (
                            <button
                              key={option.label}
                              type="button"
                              onClick={() => onUpdateQuickFilter(group.id, option.value)}
                              className={`rounded-full px-2.5 py-1 text-[11px] transition ${
                                quickFilters[group.id] === option.value
                                  ? 'bg-slate-900 text-white shadow-sm dark:bg-indigo-500/70'
                                  : 'bg-white text-slate-500 hover:bg-slate-100 dark:bg-slate-900/60 dark:text-slate-300'
                              }`}
                            >
                              {option.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="mt-4 space-y-3">{renderActiveList()}</div>
          </Card>

          <Card className="border border-slate-200/70 bg-white/95 p-5 dark:border-slate-800/70 dark:bg-slate-950/60">
            <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-100">Acciones rápidas</h3>
            <div className="mt-4 space-y-3">
              <Button fullWidth variant="secondary" size="sm" leftIcon={<PlusCircle className="h-4 w-4" />}>
                Crear bloque desde cero
              </Button>
              <Button fullWidth variant="ghost" size="sm" leftIcon={<Flame className="h-4 w-4 text-amber-500" />}>
                Añadir finisher / EMOM
              </Button>
              <Button fullWidth variant="ghost" size="sm" leftIcon={<Library className="h-4 w-4" />}>
                Importar plantilla guardada
              </Button>
            </div>
          </Card>
        </>
      )}
    </aside>
  );
}

type SummarySidebarProps = {
  isCollapsed: boolean;
  onCollapse: () => void;
  todaysSessions: DayPlan['sessions'];
  nextSession: DayPlan['sessions'][number] | undefined;
  weeklyOverview: { sessions: number; exercises: number; duration: number };
  weeklyCalories: number;
  autoWeeklyTargets: { sessions: number; duration: number; calories: number };
  weeklyTargets: { sessions: number; duration: number; calories: number };
  manualWeeklyTargets: { sessions: number | null; duration: number | null; calories: number | null };
  onResetManualTargets: () => void;
  onUpdateManualTargets: (updates: Partial<{ sessions: number | null; duration: number | null; calories: number | null }>) => void;
  contextualSuggestions: string[];
  activeView: EditorView;
  customFormulaCount: number;
  onOpenFormulaManager: () => void;
  weeklyPlan: Record<DayKey, DayPlan>;
  weekDays: ReadonlyArray<DayKey>;
  contextoCliente: ContextoCliente;
  objetivosProgreso: ResumenObjetivosProgreso;
  timelineSesiones: TimelineSesiones;
  onInsightAction: (insightId: string, action: { tipo: string; label: string; detalle?: string } | undefined) => void;
  clienteId: string;
  programaId: string;
};

function SummarySidebar({
  isCollapsed,
  onCollapse,
  todaysSessions,
  nextSession,
  weeklyOverview,
  weeklyCalories,
  autoWeeklyTargets,
  weeklyTargets,
  manualWeeklyTargets,
  onResetManualTargets,
  onUpdateManualTargets,
  contextualSuggestions,
  activeView,
  customFormulaCount,
  onOpenFormulaManager,
  weeklyPlan,
  weekDays,
  contextoCliente,
  objetivosProgreso,
  timelineSesiones,
  onInsightAction,
  clienteId,
  programaId,
}: SummarySidebarProps) {
  const [activeTab, setActiveTab] = useState<'resumen' | 'insights'>('resumen');

  if (isCollapsed) {
    return null;
  }

  const tabButtonClasses = (tab: 'resumen' | 'insights') =>
    `rounded-full px-3 py-1 transition focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
      activeTab === tab
        ? 'bg-white text-slate-900 shadow-sm dark:bg-slate-800 dark:text-slate-100'
        : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
    }`;

  return (
    <aside className="w-full flex-shrink-0 lg:w-[340px] xl:w-[360px]">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Panel</p>
          <h3 className="mt-1 text-sm font-semibold text-slate-900 dark:text-slate-100">
            {activeTab === 'insights' ? 'Asistente de insights' : 'Resumen semanal'}
          </h3>
        </div>
        <button
          type="button"
          onClick={onCollapse}
          className="rounded-full border border-slate-200 p-2 text-slate-400 transition hover:border-indigo-300 hover:text-indigo-500 dark:border-slate-700 dark:hover:border-indigo-500"
          aria-label="Colapsar panel derecho"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      <div className="mb-4 flex items-center gap-2">
        <div className="flex rounded-full bg-slate-100 p-1 text-xs font-semibold dark:bg-slate-900/40">
          <button
            type="button"
            className={tabButtonClasses('resumen')}
            onClick={() => setActiveTab('resumen')}
            aria-pressed={activeTab === 'resumen'}
          >
            Resumen
          </button>
          <button
            type="button"
            className={tabButtonClasses('insights')}
            onClick={() => setActiveTab('insights')}
            aria-pressed={activeTab === 'insights'}
          >
            Insights
          </button>
        </div>
      </div>

      {activeTab === 'insights' ? (
        <InsightsAssistantPanel
          weeklyPlan={weeklyPlan}
          weekDays={weekDays}
          weeklyTargets={weeklyTargets}
          contextoCliente={contextoCliente}
          objetivosProgreso={objetivosProgreso}
          timelineSesiones={timelineSesiones}
          clienteId={clienteId}
          onInsightAction={onInsightAction}
        />
      ) : (
        <div className="space-y-6">
          <Card className="space-y-6 border border-slate-200/70 bg-white/95 p-6 shadow-lg dark:border-slate-800/70 dark:bg-slate-950/60">
            <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-5 text-center dark:border-slate-800/70 dark:bg-slate-900/40">
              {todaysSessions.length === 0 ? (
                <div className="space-y-2">
                  <Calendar className="mx-auto h-8 w-8 text-slate-300" />
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-300">No hay sesiones programadas para hoy</p>
                </div>
              ) : (
                <div className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
                  <p className="text-xs font-semibold uppercase tracking-wide text-emerald-500">Siguiente sesión</p>
                  <p className="text-base font-semibold text-slate-900 dark:text-slate-100">{nextSession?.block}</p>
                  <p>
                    {nextSession?.time} · {nextSession?.duration}
                  </p>
                </div>
              )}
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Esta semana</p>
              <dl className="mt-3 space-y-2 text-sm text-slate-600 dark:text-slate-300">
                <div className="flex items-center justify-between">
                  <dt>Sesiones</dt>
                  <dd className="font-semibold text-indigo-600">{weeklyOverview.sessions}</dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt>Ejercicios</dt>
                  <dd className="font-semibold text-indigo-600">{weeklyOverview.exercises}</dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt>Duración</dt>
                  <dd className="font-semibold text-indigo-600">{weeklyOverview.duration} min</dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt>Calorías</dt>
                  <dd className="font-semibold text-indigo-600">{weeklyCalories}</dd>
                </div>
              </dl>
            </div>

            <div>
              <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Objetivos semanales</p>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onOpenFormulaManager}
                    className="h-auto px-2 py-1 text-xs"
                  >
                    Fórmulas personalizadas
                    {customFormulaCount > 0 ? ` (${customFormulaCount})` : ''}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onResetManualTargets}
                    className="h-auto px-2 py-1 text-xs"
                    disabled={
                      manualWeeklyTargets.sessions === null &&
                      manualWeeklyTargets.duration === null &&
                      manualWeeklyTargets.calories === null
                    }
                  >
                    Restablecer
                  </Button>
                </div>
              </div>
              <div className="mb-4 space-y-2 rounded-xl border border-slate-200/70 bg-slate-50/50 p-3 dark:border-slate-800/70 dark:bg-slate-900/40">
                <div className="flex items-center gap-2">
                  <label className="w-20 text-xs font-medium text-slate-600 dark:text-slate-300">Sesiones:</label>
                  <Input
                    type="number"
                    min="0"
                    value={manualWeeklyTargets.sessions ?? ''}
                    onChange={(e) => {
                      const value = e.target.value === '' ? null : parseInt(e.target.value, 10);
                      onUpdateManualTargets({ sessions: value && !Number.isNaN(value) ? value : null });
                    }}
                    placeholder={autoWeeklyTargets.sessions.toString()}
                    className="flex-1 text-xs"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <label className="w-20 text-xs font-medium text-slate-600 dark:text-slate-300">Duración:</label>
                  <Input
                    type="number"
                    min="0"
                    value={manualWeeklyTargets.duration ?? ''}
                    onChange={(e) => {
                      const value = e.target.value === '' ? null : parseInt(e.target.value, 10);
                      onUpdateManualTargets({ duration: value && !Number.isNaN(value) ? value : null });
                    }}
                    placeholder={autoWeeklyTargets.duration.toString()}
                    className="flex-1 text-xs"
                  />
                  <span className="text-xs text-slate-500">min</span>
                </div>
                <div className="flex items-center gap-2">
                  <label className="w-20 text-xs font-medium text-slate-600 dark:text-slate-300">Calorías:</label>
                  <Input
                    type="number"
                    min="0"
                    value={manualWeeklyTargets.calories ?? ''}
                    onChange={(e) => {
                      const value = e.target.value === '' ? null : parseInt(e.target.value, 10);
                      onUpdateManualTargets({ calories: value && !Number.isNaN(value) ? value : null });
                    }}
                    placeholder={autoWeeklyTargets.calories.toString()}
                    className="flex-1 text-xs"
                  />
                </div>
              </div>
              <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-400">Progreso</p>
              <div className="mt-3 space-y-4">
                {[
                  {
                    label: 'Sesiones',
                    value: weeklyOverview.sessions,
                    goal: weeklyTargets.sessions,
                    suffix: '',
                    gradient: 'from-emerald-500 to-emerald-400',
                    highlight: 'text-emerald-600',
                  },
                  {
                    label: 'Duración',
                    value: weeklyOverview.duration,
                    goal: weeklyTargets.duration,
                    suffix: ' min',
                    gradient: 'from-indigo-500 to-indigo-400',
                    highlight: 'text-emerald-600',
                  },
                  {
                    label: 'Calorías',
                    value: weeklyCalories,
                    goal: weeklyTargets.calories,
                    suffix: '',
                    gradient: 'from-amber-500 to-orange-400',
                    highlight: weeklyCalories > weeklyTargets.calories ? 'text-red-500' : 'text-emerald-600',
                  },
                ].map((item) => {
                  const percentage = item.goal > 0 ? Math.min(100, (item.value / item.goal) * 100) : 0;
                  return (
                    <div key={item.label} className="space-y-1">
                      <div className="flex items-center justify-between text-xs text-slate-500">
                        <span>{item.label}</span>
                        <span className={`font-semibold ${item.highlight}`}>
                          {item.value}
                          {item.suffix} / {item.goal}
                          {item.suffix}
                        </span>
                      </div>
                      <div className="h-2 rounded-full bg-slate-100">
                        <div className={`h-full rounded-full bg-gradient-to-r ${item.gradient}`} style={{ width: `${percentage}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Alertas</p>
              <div className="mt-3 flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-700">
                <AlertCircle className="h-5 w-5 text-amber-500" />
                <div>
                  <p className="font-semibold">Volumen alto en la sesión del jueves</p>
                  <Button variant="ghost" size="sm" className="mt-2 h-auto px-3 py-1 text-xs text-amber-600 hover:text-amber-700">
                    Reducir series
                  </Button>
                </div>
              </div>
            </div>

            <div>
              <div className="mb-3 flex items-center gap-2">
                <Lightbulb className="h-4 w-4 text-indigo-500" />
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Sugerencias {activeView === 'weekly' ? 'Semanal' : activeView === 'daily' ? 'Diaria' : 'Excel'}
                </p>
              </div>
              <div className="space-y-2">
                {contextualSuggestions.length > 0 ? (
                  contextualSuggestions.map((suggestion) => (
                    <div
                      key={suggestion}
                      className="flex items-start gap-2 rounded-xl border border-indigo-200/70 bg-indigo-50/50 p-3 text-sm text-indigo-700 dark:border-indigo-800/70 dark:bg-indigo-500/10 dark:text-indigo-300"
                    >
                      <Sparkles className="mt-0.5 h-4 w-4 flex-shrink-0 text-indigo-500" />
                      <p className="text-xs leading-relaxed">{suggestion}</p>
                    </div>
                  ))
                ) : (
                  <div className="rounded-xl border border-slate-200/70 bg-slate-50 p-3 text-xs text-slate-500 dark:border-slate-800/70 dark:bg-slate-900/40">
                    No hay sugerencias en este momento
                  </div>
                )}
              </div>
            </div>
          </Card>

          <NotasAcuerdosRecordatorios programaId={programaId} clienteId={clienteId} />
        </div>
      )}
    </aside>
  );
}

// Componente para el modal de sustituciones
type SubstitutionsModalProps = {
  weeklyPlan: Record<DayKey, DayPlan>;
  weekDays: ReadonlyArray<DayKey>;
  onReplaceBlocks: (replacements: Array<{ day: DayKey; sessionId: string; newBlock: Partial<import('../types').DaySession> }>) => void;
  onUpdatePlan: (plan: Record<DayKey, DayPlan>) => void;
  historyManager: SubstitutionHistoryManager;
  onClose: () => void;
};

function SubstitutionsModal({ weeklyPlan, weekDays, onReplaceBlocks, onUpdatePlan, historyManager, onClose }: SubstitutionsModalProps) {
  const [selectedBlocks, setSelectedBlocks] = useState<Set<string>>(new Set());
  const [selectedReplacement, setSelectedReplacement] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filtrosAvanzados, setFiltrosAvanzados] = useState({
    modalidad: '',
    intensidad: '',
    duracionMin: '',
    duracionMax: '',
    equipamiento: '',
    tagsPersonalizados: [] as string[],
  });
  
  // Estados para presets
  const [presets, setPresets] = useState<SubstitutionPreset[]>([]);
  const [showPresetsModal, setShowPresetsModal] = useState(false);
  const [showSavePresetModal, setShowSavePresetModal] = useState(false);
  const [presetName, setPresetName] = useState('');
  const [presetDescription, setPresetDescription] = useState('');
  const [presetTags, setPresetTags] = useState('');
  const [historyInfo, setHistoryInfo] = useState(historyManager.getHistoryInfo());

  // Cargar presets al montar
  useEffect(() => {
    setPresets(SubstitutionPresetsManager.getAllPresets());
  }, []);

  // Actualizar información del historial
  useEffect(() => {
    setHistoryInfo(historyManager.getHistoryInfo());
  }, [weeklyPlan, historyManager]);

  // Obtener todos los bloques únicos de la semana
  const allBlocks = useMemo(() => {
    const blocks: Array<{ key: string; day: DayKey; sessionId: string; block: string; modality: string }> = [];
    weekDays.forEach((day) => {
      const dayPlan = weeklyPlan[day];
      dayPlan.sessions.forEach((session: DayPlan['sessions'][number]) => {
        const key = `${day}::${session.id}`;
        blocks.push({
          key,
          day,
          sessionId: session.id,
          block: session.block,
          modality: session.modality,
        });
      });
    });
    return blocks;
  }, [weeklyPlan, weekDays]);

  // Bloques de reemplazo disponibles (simulados desde la biblioteca)
  const replacementBlocks = useMemo(
    () => [
      { id: 'mobility-1', name: 'Movilidad dinámica completa', modality: 'Mobility', duration: '15 min', intensity: 'Ligera', equipment: 'Bandas, Foam roller', tags: ['movilidad', 'calentamiento'] },
      { id: 'strength-1', name: 'Bloque de fuerza superior', modality: 'Strength', duration: '40 min', intensity: 'RPE 7', equipment: 'Barra, Mancuernas', tags: ['fuerza', 'superior'] },
      { id: 'metcon-1', name: 'MetCon corto e intenso', modality: 'MetCon', duration: '20 min', intensity: 'Alta', equipment: 'Kettlebell, Battle rope', tags: ['metcon', 'intenso'] },
      { id: 'cardio-1', name: 'Cardio zona 2', modality: 'Cardio', duration: '25 min', intensity: 'Moderada', equipment: 'Bike, Cinta', tags: ['cardio', 'zona2'] },
      { id: 'core-1', name: 'Core estabilidad', modality: 'Core', duration: '15 min', intensity: 'Ligera', equipment: 'Peso corporal, Bandas', tags: ['core', 'estabilidad'] },
      { id: 'recovery-1', name: 'Recuperación activa', modality: 'Recovery', duration: '12 min', intensity: 'Regenerativa', equipment: 'Foam roller', tags: ['recuperación', 'movilidad'] },
      { id: 'press-maquina-1', name: 'Press en máquina', modality: 'Strength', duration: '40 min', intensity: 'RPE 7', equipment: 'Máquina', tags: ['fuerza', 'máquina', 'hombro'] },
      { id: 'goblet-squat-1', name: 'Goblet squat o split-squat', modality: 'Strength', duration: '35 min', intensity: 'RPE 6.5', equipment: 'Mancuernas', tags: ['fuerza', 'rodilla'] },
    ],
    []
  );

  const filteredReplacementBlocks = useMemo(() => {
    let filtered = replacementBlocks.filter(
      (block) =>
        block.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        block.modality.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (block.equipment && block.equipment.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    // Aplicar filtros avanzados
    if (filtrosAvanzados.modalidad) {
      filtered = filtered.filter((b) => b.modality === filtrosAvanzados.modalidad);
    }
    if (filtrosAvanzados.intensidad) {
      filtered = filtered.filter((b) => b.intensity?.includes(filtrosAvanzados.intensidad));
    }
    if (filtrosAvanzados.duracionMin) {
      const min = parseInt(filtrosAvanzados.duracionMin);
      filtered = filtered.filter((b) => {
        const duration = parseInt(b.duration) || 0;
        return duration >= min;
      });
    }
    if (filtrosAvanzados.duracionMax) {
      const max = parseInt(filtrosAvanzados.duracionMax);
      filtered = filtered.filter((b) => {
        const duration = parseInt(b.duration) || 0;
        return duration <= max;
      });
    }
    if (filtrosAvanzados.equipamiento) {
      filtered = filtered.filter((b) =>
        b.equipment?.toLowerCase().includes(filtrosAvanzados.equipamiento.toLowerCase())
      );
    }
    if (filtrosAvanzados.tagsPersonalizados.length > 0) {
      filtered = filtered.filter((b) =>
        filtrosAvanzados.tagsPersonalizados.some((tag) =>
          b.tags?.some((t) => t.toLowerCase().includes(tag.toLowerCase()))
        )
      );
    }

    return filtered;
  }, [replacementBlocks, searchTerm, filtrosAvanzados]);

  const toggleBlockSelection = (key: string) => {
    const newSelected = new Set(selectedBlocks);
    if (newSelected.has(key)) {
      newSelected.delete(key);
    } else {
      newSelected.add(key);
    }
    setSelectedBlocks(newSelected);
  };

  const handleReplace = () => {
    if (!selectedReplacement || selectedBlocks.size === 0) return;

    const replacement = replacementBlocks.find((b) => b.id === selectedReplacement);
    if (!replacement) return;

    const replacements = Array.from(selectedBlocks).map((key) => {
      const [day, sessionId] = key.split('::') as [DayKey, string];
      return {
        day,
        sessionId,
        newBlock: {
          block: replacement.name,
          modality: replacement.modality,
          duration: replacement.duration,
          intensity: replacement.intensity || '',
          notes: `Reemplazado desde biblioteca${replacement.equipment ? ` · Equipamiento: ${replacement.equipment}` : ''}`,
        },
      };
    });

    // Guardar estado antes de la sustitución para el historial
    const planBefore = JSON.parse(JSON.stringify(weeklyPlan));
    
    // Aplicar las sustituciones
    const updatedPlan: Record<DayKey, DayPlan> = { ...weeklyPlan };
    replacements.forEach(({ day, sessionId, newBlock }) => {
      const dayPlan = updatedPlan[day];
      updatedPlan[day] = {
        ...dayPlan,
        sessions: dayPlan.sessions.map((session) =>
          session.id === sessionId ? { ...session, ...newBlock } : session
        ),
      };
    });

    // Agregar al historial
    historyManager.addEntry(
      planBefore,
      updatedPlan,
      `Sustitución de ${replacements.length} bloque(s) por "${replacement.name}"`
    );

    // Actualizar el plan
    onUpdatePlan(updatedPlan);
    onReplaceBlocks(replacements);
    
    // Limpiar selección
    setSelectedBlocks(new Set());
    setSelectedReplacement('');
    setHistoryInfo(historyManager.getHistoryInfo());
  };

  const handleUndo = () => {
    const previousPlan = historyManager.undo();
    if (previousPlan) {
      onUpdatePlan(previousPlan);
      setHistoryInfo(historyManager.getHistoryInfo());
    }
  };

  const handleRedo = () => {
    const nextPlan = historyManager.redo();
    if (nextPlan) {
      onUpdatePlan(nextPlan);
      setHistoryInfo(historyManager.getHistoryInfo());
    }
  };

  const handleSavePreset = () => {
    if (!presetName.trim() || selectedBlocks.size === 0 || !selectedReplacement) {
      alert('Por favor completa el nombre del preset y selecciona bloques y reemplazo');
      return;
    }

    const replacement = replacementBlocks.find((b) => b.id === selectedReplacement);
    if (!replacement) return;

    const replacements = Array.from(selectedBlocks).map((key) => {
      const [day, sessionId] = key.split('::') as [DayKey, string];
      return {
        day,
        sessionId,
        newBlock: {
          block: replacement.name,
          modality: replacement.modality,
          duration: replacement.duration,
          intensity: replacement.intensity || '',
          notes: `Reemplazado desde biblioteca${replacement.equipment ? ` · Equipamiento: ${replacement.equipment}` : ''}`,
        },
      };
    });

    const tags = presetTags.split(',').map(t => t.trim()).filter(t => t.length > 0);
    SubstitutionPresetsManager.savePreset(presetName, replacements, presetDescription || undefined, tags);
    
    setPresets(SubstitutionPresetsManager.getAllPresets());
    setShowSavePresetModal(false);
    setPresetName('');
    setPresetDescription('');
    setPresetTags('');
    alert('Preset guardado correctamente');
  };

  const handleApplyPreset = (preset: SubstitutionPreset) => {
    const planBefore = JSON.parse(JSON.stringify(weeklyPlan));
    
    // Aplicar las sustituciones del preset
    const updatedPlan: Record<DayKey, DayPlan> = { ...weeklyPlan };
    preset.replacements.forEach(({ day, sessionId, newBlock }) => {
      const dayPlan = updatedPlan[day];
      if (dayPlan) {
        updatedPlan[day] = {
          ...dayPlan,
          sessions: dayPlan.sessions.map((session) =>
            session.id === sessionId ? { ...session, ...newBlock } : session
          ),
        };
      }
    });

    // Agregar al historial
    historyManager.addEntry(planBefore, updatedPlan, `Preset aplicado: "${preset.name}"`);

    // Actualizar el plan
    onUpdatePlan(updatedPlan);
    onReplaceBlocks(preset.replacements);
    setShowPresetsModal(false);
    setHistoryInfo(historyManager.getHistoryInfo());
  };

  const handleDeletePreset = (id: string) => {
    if (confirm('¿Estás seguro de que deseas eliminar este preset?')) {
      SubstitutionPresetsManager.deletePreset(id);
      setPresets(SubstitutionPresetsManager.getAllPresets());
    }
  };

  return (
    <div className="space-y-6">
      {/* Barra de herramientas: Historial y Presets */}
      <div className="flex items-center justify-between rounded-xl border border-slate-200/70 bg-white/95 p-3 dark:border-slate-800/70 dark:bg-slate-950/60">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleUndo}
            disabled={!historyInfo.canUndo}
            leftIcon={<Undo2 />}
            className="h-8"
          >
            Deshacer
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleRedo}
            disabled={!historyInfo.canRedo}
            leftIcon={<Redo2 />}
            className="h-8"
          >
            Rehacer
          </Button>
          {historyInfo.currentDescription && (
            <span className="text-xs text-slate-500 dark:text-slate-400 ml-2">
              {historyInfo.currentDescription}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setShowPresetsModal(true)}
            leftIcon={<Bookmark className="h-4 w-4" />}
            className="h-8"
          >
            Presets ({presets.length})
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setShowSavePresetModal(true)}
            disabled={selectedBlocks.size === 0 || !selectedReplacement}
            leftIcon={<BookmarkPlus className="h-4 w-4" />}
            className="h-8"
          >
            Guardar Preset
          </Button>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200/70 bg-slate-50 p-4 text-sm dark:border-slate-800/70 dark:bg-slate-900/40">
        <p className="text-slate-700 dark:text-slate-300">
          Selecciona los bloques que deseas reemplazar y elige un bloque de reemplazo desde la biblioteca.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Selección de bloques a reemplazar */}
        <Card className="border border-slate-200/70 bg-white/95 p-5 dark:border-slate-800/70 dark:bg-slate-950/60">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-100">
              Bloques del plan semanal ({selectedBlocks.size} seleccionados)
            </h3>
            {allBlocks.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  if (selectedBlocks.size === allBlocks.length) {
                    setSelectedBlocks(new Set());
                  } else {
                    setSelectedBlocks(new Set(allBlocks.map((b) => b.key)));
                  }
                }}
                className="h-auto px-2 py-1 text-xs"
              >
                {selectedBlocks.size === allBlocks.length ? 'Deseleccionar todos' : 'Seleccionar todos'}
              </Button>
            )}
          </div>
          
          {/* Agrupar por día para mejor visualización */}
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {weekDays.map((day) => {
              const dayBlocks = allBlocks.filter((b) => b.day === day);
              if (dayBlocks.length === 0) return null;

              const daySelectedCount = dayBlocks.filter((b) => selectedBlocks.has(b.key)).length;

              return (
                <div key={day} className="space-y-2">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-1">
                    <h4 className="text-xs font-semibold uppercase tracking-wide text-slate-600 dark:text-slate-400">
                      {day}
                    </h4>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-500">
                        {daySelectedCount}/{dayBlocks.length} seleccionados
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          const newSelected = new Set(selectedBlocks);
                          const allDaySelected = dayBlocks.every((b) => newSelected.has(b.key));
                          dayBlocks.forEach((b) => {
                            if (allDaySelected) {
                              newSelected.delete(b.key);
                            } else {
                              newSelected.add(b.key);
                            }
                          });
                          setSelectedBlocks(newSelected);
                        }}
                        className="h-auto px-2 py-0.5 text-[10px]"
                      >
                        {daySelectedCount === dayBlocks.length ? 'Deseleccionar día' : 'Seleccionar día'}
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-2 pl-2">
                    {dayBlocks.map((blockInfo) => {
                      const isSelected = selectedBlocks.has(blockInfo.key);
                      return (
                        <button
                          key={blockInfo.key}
                          type="button"
                          onClick={() => toggleBlockSelection(blockInfo.key)}
                          className={`w-full rounded-xl border p-3 text-left transition ${
                            isSelected
                              ? 'border-indigo-500 bg-indigo-50 dark:border-indigo-400 dark:bg-indigo-500/10'
                              : 'border-slate-200/70 bg-white/90 hover:border-slate-300 dark:border-slate-800/70 dark:bg-slate-950/60 dark:hover:border-slate-700'
                          }`}
                        >
                          <div className="flex items-center justify-between gap-3">
                            <div className="flex items-center gap-2">
                              {isSelected ? (
                                <CheckSquare className="h-4 w-4 text-indigo-500 flex-shrink-0" />
                              ) : (
                                <Square className="h-4 w-4 text-slate-400 flex-shrink-0" />
                              )}
                              <div className="flex-1">
                                <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                                  {blockInfo.block}
                                </p>
                                <p className="text-xs text-slate-500 dark:text-slate-300">
                                  {blockInfo.modality}
                                </p>
                              </div>
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Selección de bloque de reemplazo */}
        <Card className="border border-slate-200/70 bg-white/95 p-5 dark:border-slate-800/70 dark:bg-slate-950/60">
          <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-100 mb-4">Biblioteca de bloques</h3>
          
          {/* Búsqueda básica */}
          <div className="mb-4">
            <Input
              placeholder="Buscar bloques..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              leftIcon={<Search className="h-4 w-4" />}
            />
          </div>

          {/* Filtros avanzados */}
          <div className="mb-4 space-y-3 rounded-lg border border-slate-200/70 bg-slate-50/50 p-3 dark:border-slate-800/70 dark:bg-slate-900/40">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-semibold uppercase tracking-wide text-slate-600 dark:text-slate-400">
                Filtros Avanzados
              </h4>
              <Button
                variant="ghost"
                size="sm"
                onClick={() =>
                  setFiltrosAvanzados({
                    modalidad: '',
                    intensidad: '',
                    duracionMin: '',
                    duracionMax: '',
                    equipamiento: '',
                    tagsPersonalizados: [],
                  })
                }
                className="h-auto px-2 py-1 text-xs"
              >
                Limpiar
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <Select
                options={[
                  { label: 'Todas las modalidades', value: '' },
                  { label: 'Strength', value: 'Strength' },
                  { label: 'MetCon', value: 'MetCon' },
                  { label: 'Cardio', value: 'Cardio' },
                  { label: 'Mobility', value: 'Mobility' },
                  { label: 'Core', value: 'Core' },
                  { label: 'Recovery', value: 'Recovery' },
                  { label: 'Accessory', value: 'Accessory' },
                ]}
                value={filtrosAvanzados.modalidad}
                onChange={(e) => setFiltrosAvanzados({ ...filtrosAvanzados, modalidad: e.target.value })}
              />
              <Select
                options={[
                  { label: 'Todas las intensidades', value: '' },
                  { label: 'Ligera', value: 'Ligera' },
                  { label: 'Moderada', value: 'Moderada' },
                  { label: 'RPE 7', value: 'RPE 7' },
                  { label: 'RPE 7.5', value: 'RPE 7.5' },
                  { label: 'RPE 8', value: 'RPE 8' },
                  { label: 'Alta', value: 'Alta' },
                  { label: 'Regenerativa', value: 'Regenerativa' },
                ]}
                value={filtrosAvanzados.intensidad}
                onChange={(e) => setFiltrosAvanzados({ ...filtrosAvanzados, intensidad: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <Input
                type="number"
                placeholder="Duración mín (min)"
                value={filtrosAvanzados.duracionMin}
                onChange={(e) => setFiltrosAvanzados({ ...filtrosAvanzados, duracionMin: e.target.value })}
                className="text-xs"
              />
              <Input
                type="number"
                placeholder="Duración máx (min)"
                value={filtrosAvanzados.duracionMax}
                onChange={(e) => setFiltrosAvanzados({ ...filtrosAvanzados, duracionMax: e.target.value })}
                className="text-xs"
              />
            </div>

            <Input
              placeholder="Equipamiento (ej: Barra, Kettlebell, Bandas...)"
              value={filtrosAvanzados.equipamiento}
              onChange={(e) => setFiltrosAvanzados({ ...filtrosAvanzados, equipamiento: e.target.value })}
              className="text-xs"
            />

            <div>
              <Input
                placeholder="Tags personalizados (separar por comas)"
                value={filtrosAvanzados.tagsPersonalizados.join(', ')}
                onChange={(e) => {
                  const tags = e.target.value
                    .split(',')
                    .map((tag) => tag.trim())
                    .filter((tag) => tag.length > 0);
                  setFiltrosAvanzados({ ...filtrosAvanzados, tagsPersonalizados: tags });
                }}
                className="text-xs"
              />
              {filtrosAvanzados.tagsPersonalizados.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1">
                  {filtrosAvanzados.tagsPersonalizados.map((tag, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      size="sm"
                      className="text-xs"
                      onClick={() => {
                        const newTags = filtrosAvanzados.tagsPersonalizados.filter((_, i) => i !== index);
                        setFiltrosAvanzados({ ...filtrosAvanzados, tagsPersonalizados: newTags });
                      }}
                    >
                      {tag} ×
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {filteredReplacementBlocks.map((block) => {
              const isSelected = selectedReplacement === block.id;
              return (
                <button
                  key={block.id}
                  type="button"
                  onClick={() => setSelectedReplacement(block.id)}
                  className={`w-full rounded-xl border p-3 text-left transition ${
                    isSelected
                      ? 'border-emerald-500 bg-emerald-50 dark:border-emerald-400 dark:bg-emerald-500/10'
                      : 'border-slate-200/70 bg-white/90 hover:border-slate-300 dark:border-slate-800/70 dark:bg-slate-950/60 dark:hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-slate-900 dark:text-slate-100">{block.name}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-300">
                        {block.modality} · {block.duration} · {block.intensity}
                      </p>
                      <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">
                        Equipamiento: {block.equipment}
                      </p>
                      {block.tags && block.tags.length > 0 && (
                        <div className="mt-1 flex flex-wrap gap-1">
                          {block.tags.map((tag, tagIndex) => (
                            <Badge key={tagIndex} variant="outline" size="sm" className="text-[10px]">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                    {isSelected && <div className="h-2 w-2 rounded-full bg-emerald-500 mt-1" />}
                  </div>
                </button>
              );
            })}
          </div>
        </Card>
      </div>

      <div className="flex items-center justify-end gap-2">
        <Button variant="ghost" onClick={onClose}>
          Cancelar
        </Button>
        <Button
          variant="secondary"
          onClick={handleReplace}
          disabled={selectedBlocks.size === 0 || !selectedReplacement}
        >
          Reemplazar {selectedBlocks.size > 0 ? `${selectedBlocks.size} bloque(s)` : ''}
        </Button>
      </div>

      {/* Modal: Guardar Preset */}
      <Modal
        isOpen={showSavePresetModal}
        onClose={() => setShowSavePresetModal(false)}
        title="Guardar Preset de Sustituciones"
        size="md"
      >
        <div className="space-y-4">
          <Input
            label="Nombre del preset *"
            value={presetName}
            onChange={(e) => setPresetName(e.target.value)}
            placeholder="Ej: Modo Deload, Semana de Competición..."
          />
          <Input
            label="Descripción (opcional)"
            value={presetDescription}
            onChange={(e) => setPresetDescription(e.target.value)}
            placeholder="Describe cuándo usar este preset..."
          />
          <Input
            label="Tags (separados por comas)"
            value={presetTags}
            onChange={(e) => setPresetTags(e.target.value)}
            placeholder="deload, competición, recuperación..."
          />
          <div className="rounded-lg bg-slate-50 dark:bg-slate-900/40 p-3 text-sm">
            <p className="font-medium text-slate-700 dark:text-slate-300 mb-1">Se guardarán:</p>
            <ul className="list-disc list-inside text-slate-600 dark:text-slate-400 space-y-1">
              <li>{selectedBlocks.size} bloque(s) seleccionado(s)</li>
              <li>
                Reemplazo: {replacementBlocks.find((b) => b.id === selectedReplacement)?.name || 'Ninguno'}
              </li>
            </ul>
          </div>
          <div className="flex items-center justify-end gap-2">
            <Button variant="ghost" onClick={() => setShowSavePresetModal(false)}>
              Cancelar
            </Button>
            <Button variant="primary" onClick={handleSavePreset} disabled={!presetName.trim()}>
              Guardar Preset
            </Button>
          </div>
        </div>
      </Modal>

      {/* Modal: Lista de Presets */}
      <Modal
        isOpen={showPresetsModal}
        onClose={() => setShowPresetsModal(false)}
        title="Presets de Sustituciones"
        size="lg"
      >
        <div className="space-y-4">
          {presets.length === 0 ? (
            <div className="text-center py-8 text-slate-500">
              <Bookmark className="w-12 h-12 mx-auto mb-2 text-slate-400" />
              <p>No hay presets guardados</p>
              <p className="text-sm mt-1">Crea un preset desde la barra de herramientas</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {presets.map((preset) => (
                <Card
                  key={preset.id}
                  className="border border-slate-200/70 bg-white/95 p-4 dark:border-slate-800/70 dark:bg-slate-950/60"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold text-slate-900 dark:text-slate-100">{preset.name}</h4>
                        {preset.tags && preset.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {preset.tags.map((tag, idx) => (
                              <Badge key={idx} variant="outline" size="sm" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                      {preset.description && (
                        <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">{preset.description}</p>
                      )}
                      <p className="text-xs text-slate-500 dark:text-slate-500">
                        {preset.replacements.length} sustitución(es) · Creado:{' '}
                        {new Date(preset.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => handleApplyPreset(preset)}
                        leftIcon={<CheckSquare className="h-4 w-4" />}
                      >
                        Aplicar
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeletePreset(preset.id)}
                        leftIcon={<Trash2 className="h-4 w-4" />}
                        className="text-red-600 hover:text-red-700 dark:text-red-400"
                      >
                        Eliminar
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
}

export default function ProgramasDeEntrenoEditorPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const currentProgramId = 'current-program';
  const [activeView, setActiveView] = useState<EditorView>('weekly');
  const [selectedDay, setSelectedDay] = useState<DayKey>(weekDays[0]);
  const [leftCollapsed, setLeftCollapsed] = useState(() => {
    try {
      const saved = localStorage.getItem('programasEditor_leftCollapsed');
      return saved ? JSON.parse(saved) : false;
    } catch {
      return false;
    }
  });
  const [rightCollapsed, setRightCollapsed] = useState(() => {
    try {
      const saved = localStorage.getItem('programasEditor_rightCollapsed');
      return saved ? JSON.parse(saved) : false;
    } catch {
      return false;
    }
  });
  const [libraryTab, setLibraryTab] = useState<LibraryTab>(() => {
    try {
      const saved = localStorage.getItem('programasEditor_libraryTab');
      return (saved as LibraryTab) || 'templates';
    } catch {
      return 'templates';
    }
  });
  const [isClientInfoOpen, setIsClientInfoOpen] = useState(false);
  const [isFitCoachOpen, setIsFitCoachOpen] = useState(false);
  const [isSubstitutionsOpen, setIsSubstitutionsOpen] = useState(false);
  const [isBatchTrainingOpen, setIsBatchTrainingOpen] = useState(false);
  const [lastBatchSummary, setLastBatchSummary] = useState<BatchTrainingSummary | null>(null);
  const [isTagManagerOpen, setIsTagManagerOpen] = useState(false);
  const [isBulkAutomationOpen, setIsBulkAutomationOpen] = useState(false);
  const [isAutomationPresetsOpen, setIsAutomationPresetsOpen] = useState(false);
  const [selectedAutomationPreset, setSelectedAutomationPreset] = useState<PresetAutomatizacion | null>(null);
  const [isChartsOpen, setIsChartsOpen] = useState(false);
  const [isCompartirChatOpen, setIsCompartirChatOpen] = useState(false);
  const [isBuscarSustituirOpen, setIsBuscarSustituirOpen] = useState(false);
  const [isLayoutSurveyOpen, setIsLayoutSurveyOpen] = useState(false);
  const [layoutSurveyResponses, setLayoutSurveyResponses] = useState<RespuestasCuestionario | null>(null);
  const [layoutRecommendedTemplates, setLayoutRecommendedTemplates] = useState<PlantillaRecomendada[]>([]);
  const [isFormulaManagerOpen, setIsFormulaManagerOpen] = useState(false);
  const [customFormulas, setCustomFormulas] = useState<FormulaPersonalizada[]>([]);
  const [librarySearch, setLibrarySearch] = useState(() => {
    try {
      const saved = localStorage.getItem('programasEditor_librarySearch');
      return saved || '';
    } catch {
      return '';
    }
  });
  const [libraryQuickFilters, setLibraryQuickFilters] = useState<LibraryQuickFilters>(() => {
    try {
      const saved = localStorage.getItem('programasEditor_quickFilters');
      return saved ? { ...DEFAULT_LIBRARY_FILTERS, ...(JSON.parse(saved) as Partial<LibraryQuickFilters>) } : DEFAULT_LIBRARY_FILTERS;
    } catch {
      return DEFAULT_LIBRARY_FILTERS;
    }
  });
  const [pinnedTemplateIds, setPinnedTemplateIds] = useState<string[]>(() => {
    try {
      const raw = localStorage.getItem('pinnedTemplates');
      return raw ? (JSON.parse(raw) as string[]) : [];
    } catch {
      return [];
    }
  });
  const [pinnedExerciseIds, setPinnedExerciseIds] = useState<string[]>(() => {
    try {
      const raw = localStorage.getItem('pinnedExercises');
      return raw ? (JSON.parse(raw) as string[]) : [];
    } catch {
      return [];
    }
  });

  // Estado para guardar borrador
  const [isSaveDraftModalOpen, setIsSaveDraftModalOpen] = useState(false);
  const [draftMessage, setDraftMessage] = useState(() => {
    try {
      return localStorage.getItem('programasEditor_lastDraftMessage') || '';
    } catch {
      return '';
    }
  });
  const [draftId, setDraftId] = useState<string | null>(() => {
    try {
      return localStorage.getItem('programasEditor_lastDraftId');
    } catch {
      return null;
    }
  });
  const [lastSaveTime, setLastSaveTime] = useState<string | null>(() => {
    try {
      const saved = localStorage.getItem('programasEditor_lastSaveTime');
      return saved || null;
    } catch {
      return null;
    }
  });
  const [isSavingDraft, setIsSavingDraft] = useState(false);
  const [saveDraftError, setSaveDraftError] = useState<string | null>(null);
  const [programStatus] = useState<'borrador' | 'enviado' | 'auto-ia'>('borrador');

  const togglePinTemplate = useCallback((templateId: string) => {
    setPinnedTemplateIds((prev) => {
      const exists = prev.includes(templateId);
      const next = exists ? prev.filter((id) => id !== templateId) : [...prev, templateId];
      try {
        localStorage.setItem('pinnedTemplates', JSON.stringify(next));
      } catch {
        // ignore persistence errors
      }
      return next;
    });
  }, []);

  const togglePinExercise = useCallback((exerciseId: string) => {
    setPinnedExerciseIds((prev) => {
      const exists = prev.includes(exerciseId);
      const next = exists ? prev.filter((id) => id !== exerciseId) : [...prev, exerciseId];
      try {
        localStorage.setItem('pinnedExercises', JSON.stringify(next));
      } catch {
        // ignore persistence errors
      }
      return next;
    });
  }, []);

  const currentDayIndex = weekDays.findIndex((day) => day === selectedDay);

  const goToDay = useCallback(
    (direction: -1 | 1) => {
      const nextIndex = (currentDayIndex + direction + weekDays.length) % weekDays.length;
      setSelectedDay(weekDays[nextIndex]);
    },
    [currentDayIndex],
  );

  const handleSelectDay = useCallback((day: DayKey) => {
    setSelectedDay(day);
  }, []);

  const [weeklyPlan, setWeeklyPlan] = useState<Record<DayKey, DayPlan>>(
    () => INITIAL_WEEKLY_PLAN,
  );

  const handleAddBlockToDay = useCallback(
    (day: DayKey, block: DaySession) => {
      setWeeklyPlan((prev) => {
        const dayPlan = prev[day];
        if (!dayPlan) {
          return prev;
        }
        const uniqueId =
          block.id ?? `ai-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
        const newSession: DaySession = { ...block, id: uniqueId };
        return {
          ...prev,
          [day]: {
            ...dayPlan,
            sessions: [...dayPlan.sessions, newSession],
          },
        };
      });
    },
    [setWeeklyPlan],
  );

  // Gestor de historial para sustituciones (undo/redo)
  const substitutionHistoryManager = useMemo(() => new SubstitutionHistoryManager(), []);

  const templateExamples: TemplateExample[] = useMemo(
    () => [
      {
        id: 'hypertrophy-4d',
        name: 'Hipertrofia · 4 días',
      focus: 'Hipertrofia upper / lower alterno',
        duration: '45-60 min',
        difficulty: 'Media' as const,
      equipment: 'Barra, Mancuernas',
      sessions: 4,
      aiTags: ['hipertrofia', 'upper/lower', 'volumen controlado'],
      },
      {
        id: 'fat-loss-hiit',
        name: 'Pérdida grasa HIIT',
      focus: 'Pérdida de grasa · Circuitos + Finisher',
        duration: '35-40 min',
        difficulty: 'Dificil' as const,
      equipment: 'Kettlebell, Air bike',
      sessions: 3,
      aiTags: ['fat loss', 'hiit', 'metcon'],
      },
      {
        id: 'mobility-reset',
        name: 'Reset movilidad & core',
      focus: 'Movilidad + core · Estabilidad + respiración',
        duration: '30 min',
        difficulty: 'Facil' as const,
      equipment: 'Bandas, Peso corporal',
      sessions: 2,
      aiTags: ['movilidad', 'core', 'respiración'],
      },
    ],
    [],
  );

  const exerciseExamples: ExerciseExample[] = useMemo(
    () => [
      {
        id: 'front-squat',
        name: 'Front squat con pausa',
        target: 'Cuádriceps · Core',
        equipment: 'Barra olímpica',
        difficulty: 'Dificil' as const,
      intensity: 'Alta' as const,
      aiTags: ['fuerza', 'bilateral', 'barra'],
      },
      {
        id: 'pullup-last',
        name: 'Dominadas lastre progresivo',
        target: 'Espalda · Bíceps',
        equipment: 'Chaleco lastre',
        difficulty: 'Dificil' as const,
      intensity: 'Alta' as const,
      aiTags: ['tracción', 'calistenia'],
      },
      {
        id: 'kb-complex',
        name: 'Complex kettlebell 6 movimientos',
        target: 'Full body · Metcon',
        equipment: 'Kettlebell 16-20kg',
        difficulty: 'Media' as const,
      intensity: 'Media' as const,
      aiTags: ['metcon', 'emom', 'kettlebell'],
      },
      {
        id: 'tempo-pushup',
        name: 'Push-ups tempo 3-1-3',
        target: 'Pecho · Estabilidad',
        equipment: 'Peso corporal',
        difficulty: 'Facil' as const,
      intensity: 'Baja' as const,
      aiTags: ['core', 'tempo', 'push'],
      },
    ],
    [],
  );

const blockExamples: BlockExample[] = useMemo(
  () => [
    {
      id: 'block-warmup-mobility',
      name: 'Reset de movilidad torácica',
      category: 'Calentamiento' as const,
      focus: 'Apertura torácica + activación escapular',
      duration: '10 min',
      intensity: 'Baja' as const,
      level: 'Facil' as const,
      equipment: 'Bandas, Foam roller',
      goal: 'Movilidad',
      aiTags: ['movilidad', 'preparación', 'respiración'],
    },
    {
      id: 'block-strength-upper',
      name: 'Bloque fuerza Upper ondulante',
      category: 'Fuerza' as const,
      focus: 'Press + tirón pesado',
      duration: '35 min',
      intensity: 'Alta' as const,
      level: 'Media' as const,
      equipment: 'Barra, Mancuernas',
      goal: 'Fuerza',
      aiTags: ['upper', 'superserie', 'volumen controlado'],
    },
    {
      id: 'block-acc-core',
      name: 'Core + estabilidad anti-rotación',
      category: 'Core' as const,
      focus: 'Control lumbo-pélvico y respiración',
      duration: '15 min',
      intensity: 'Media' as const,
      level: 'Facil' as const,
      equipment: 'Bandas, Cable',
      goal: 'Core',
      aiTags: ['anti-rotación', 'control', 'respiración'],
    },
    {
      id: 'block-hiit-bike',
      name: 'HIIT bike + sled contrast',
      category: 'HIIT' as const,
      focus: 'Capacidad anaeróbica + potencia',
      duration: '20 min',
      intensity: 'Alta' as const,
      level: 'Dificil' as const,
      equipment: 'Bike, Trineo',
      goal: 'MetCon',
      aiTags: ['anaeróbico', 'sled', 'intervalos'],
    },
    {
      id: 'block-mobility-hips',
      name: 'Flujo movilidad cadera 360º',
      category: 'Movilidad' as const,
      focus: 'Cadera + cadena posterior',
      duration: '12 min',
      intensity: 'Baja' as const,
      level: 'Facil' as const,
      equipment: 'Peso corporal',
      goal: 'Movilidad',
      aiTags: ['cadera', 'flow', 'control articular'],
    },
  ],
  [],
);

  const selectedDayPlan = weeklyPlan[selectedDay];

  const parseDurationInMinutes = useCallback((duration: string) => {
    const match = duration.match(/\d+/);
    return match ? Number(match[0]) : 0;
  }, []);

  const durationBucketFor = useCallback(
    (duration: string) => {
      const minutes = parseDurationInMinutes(duration);
      if (minutes === 0) return 'todos';
      if (minutes < 30) return '<30';
      if (minutes <= 45) return '30-45';
      return '>45';
    },
    [parseDurationInMinutes],
  );

  const librarySearchTerm = librarySearch.trim().toLowerCase();

  const filteredTemplates = useMemo(() => {
    return templateExamples.filter((template) => {
      if (
        librarySearchTerm &&
        ![template.name, template.focus, template.equipment, ...(template.aiTags ?? [])]
          .filter(Boolean)
          .some((field) => field!.toLowerCase().includes(librarySearchTerm))
      ) {
        return false;
      }

      if (libraryQuickFilters.nivel !== 'todos' && template.difficulty !== libraryQuickFilters.nivel) return false;

      if (
        libraryQuickFilters.intensidad !== 'todos' &&
        difficultyToIntensity(template.difficulty) !== libraryQuickFilters.intensidad
      ) {
        return false;
      }

      if (libraryQuickFilters.duracion !== 'todos' && durationBucketFor(template.duration) !== libraryQuickFilters.duracion) {
        return false;
      }

      if (libraryQuickFilters.material !== 'todos') {
        if (!template.equipment || !template.equipment.toLowerCase().includes(libraryQuickFilters.material.toLowerCase())) {
          return false;
        }
      }

      if (
        libraryQuickFilters.objetivo !== 'todos' &&
        !template.focus.toLowerCase().includes(libraryQuickFilters.objetivo.toLowerCase())
      ) {
        return false;
      }

      return true;
    });
  }, [templateExamples, librarySearchTerm, libraryQuickFilters, durationBucketFor]);

  const templateLists = useMemo(() => {
    const pinned = filteredTemplates.filter((template) => pinnedTemplateIds.includes(template.id));
    const unpinned = filteredTemplates.filter((template) => !pinnedTemplateIds.includes(template.id));
    return {
      pinned,
      unpinned,
      pinnedCount: pinned.length,
    };
  }, [filteredTemplates, pinnedTemplateIds]);

  const filteredBlocks = useMemo(() => {
    return blockExamples.filter((block) => {
      if (
        librarySearchTerm &&
        ![block.name, block.focus, block.goal, ...(block.aiTags ?? [])]
          .filter(Boolean)
          .some((field) => field!.toLowerCase().includes(librarySearchTerm))
      ) {
        return false;
      }

      if (libraryQuickFilters.nivel !== 'todos' && block.level !== libraryQuickFilters.nivel) return false;
      if (libraryQuickFilters.intensidad !== 'todos' && block.intensity !== libraryQuickFilters.intensidad) return false;
      if (libraryQuickFilters.material !== 'todos' && !block.equipment.toLowerCase().includes(libraryQuickFilters.material.toLowerCase())) {
        return false;
      }
      if (libraryQuickFilters.duracion !== 'todos' && durationBucketFor(block.duration) !== libraryQuickFilters.duracion) {
        return false;
      }
      if (libraryQuickFilters.objetivo !== 'todos' && !block.goal.toLowerCase().includes(libraryQuickFilters.objetivo.toLowerCase())) {
        return false;
      }
      if (libraryQuickFilters.bloque !== 'todos' && block.category !== libraryQuickFilters.bloque) return false;

      return true;
    });
  }, [blockExamples, libraryQuickFilters, durationBucketFor, librarySearchTerm]);

  const filteredExercises = useMemo(() => {
    return exerciseExamples.filter((exercise) => {
      if (
        librarySearchTerm &&
        ![exercise.name, exercise.target, exercise.equipment, ...(exercise.aiTags ?? [])]
          .filter(Boolean)
          .some((field) => field!.toLowerCase().includes(librarySearchTerm))
      ) {
        return false;
      }

      if (libraryQuickFilters.nivel !== 'todos' && exercise.difficulty !== libraryQuickFilters.nivel) return false;

      const exerciseIntensity = exercise.intensity ?? difficultyToIntensity(exercise.difficulty);
      if (libraryQuickFilters.intensidad !== 'todos' && exerciseIntensity !== libraryQuickFilters.intensidad) return false;

      if (
        libraryQuickFilters.material !== 'todos' &&
        !exercise.equipment.toLowerCase().includes(libraryQuickFilters.material.toLowerCase())
      ) {
        return false;
      }

      if (
        libraryQuickFilters.objetivo !== 'todos' &&
        !exercise.target.toLowerCase().includes(libraryQuickFilters.objetivo.toLowerCase())
      ) {
        return false;
      }

      if (libraryQuickFilters.duracion !== 'todos' && libraryQuickFilters.duracion === '<30') {
        // consider bodyweight/aux exercises as cortos
      }

      return true;
    });
  }, [exerciseExamples, libraryQuickFilters, librarySearchTerm]);

  const exerciseLists = useMemo(() => {
    const pinned = filteredExercises.filter((exercise) => pinnedExerciseIds.includes(exercise.id));
    const unpinned = filteredExercises.filter((exercise) => !pinnedExerciseIds.includes(exercise.id));
    return {
      pinned,
      unpinned,
      pinnedCount: pinned.length,
    };
  }, [filteredExercises, pinnedExerciseIds]);

  const searchSuggestions = useMemo(() => {
    if (librarySearch.trim().length < 2) return [];
    const term = librarySearch.trim().toLowerCase();
    const pool = new Set<string>();

    templateExamples.forEach((template) => {
      pool.add(template.name);
      pool.add(template.focus);
      template.aiTags?.forEach((tag) => pool.add(tag));
    });
    blockExamples.forEach((block) => {
      pool.add(block.name);
      pool.add(block.goal);
      block.aiTags.forEach((tag) => pool.add(tag));
    });
    exerciseExamples.forEach((exercise) => {
      pool.add(exercise.name);
      pool.add(exercise.target);
      pool.add(exercise.equipment);
      exercise.aiTags?.forEach((tag) => pool.add(tag));
    });

    return Array.from(pool)
      .filter((item): item is string => Boolean(item))
      .filter((item) => item.toLowerCase().includes(term))
      .slice(0, 8);
  }, [librarySearch, templateExamples, blockExamples, exerciseExamples]);

  const weeklyOverview = useMemo(() => {
    return weekDays.reduce(
      (acc, day) => {
        const plan = weeklyPlan[day];
        acc.sessions += plan.sessions.length;
        acc.exercises += plan.sessions.length * 3;
        acc.duration += plan.sessions.reduce((total, session) => total + parseDurationInMinutes(session.duration), 0);
        return acc;
      },
      { sessions: 0, exercises: 0, duration: 0 },
    );
  }, [parseDurationInMinutes, weekDays, weeklyPlan]);

  const weeklyCalories = useMemo(() => Math.round(weeklyOverview.duration * 8), [weeklyOverview.duration]);

  // Estado para objetivos semanales manuales
  const [manualWeeklyTargets, setManualWeeklyTargets] = useState<{
    sessions: number | null;
    duration: number | null;
    calories: number | null;
  }>(() => {
    try {
      const saved = localStorage.getItem('programasEditor_manualWeeklyTargets');
      return saved ? JSON.parse(saved) : { sessions: null, duration: null, calories: null };
    } catch {
      return { sessions: null, duration: null, calories: null };
    }
  });

  const autoWeeklyTargets = useMemo(
    () => ({
      sessions: Math.max(3, Math.round(weeklyOverview.sessions * 0.75)),
      duration: Math.max(180, Math.round(weeklyOverview.duration * 0.85)),
      calories: Math.max(2500, Math.round(weeklyCalories * 1.1)),
    }),
    [weeklyCalories, weeklyOverview],
  );

  // Calcular objetivos: usar manuales si existen, sino calcular automáticamente
  const weeklyTargets = useMemo(
    () => ({
      sessions: manualWeeklyTargets.sessions ?? autoWeeklyTargets.sessions,
      duration: manualWeeklyTargets.duration ?? autoWeeklyTargets.duration,
      calories: manualWeeklyTargets.calories ?? autoWeeklyTargets.calories,
    }),
    [autoWeeklyTargets, manualWeeklyTargets],
  );

  // Guardar objetivos manuales en localStorage
  const updateManualWeeklyTargets = useCallback((updates: Partial<typeof manualWeeklyTargets>) => {
    setManualWeeklyTargets((prev) => {
      const next = { ...prev, ...updates };
      try {
        localStorage.setItem('programasEditor_manualWeeklyTargets', JSON.stringify(next));
      } catch {
        // ignore persistence errors
      }
      return next;
    });
  }, []);

  const todaysSessions = selectedDayPlan.sessions;
  const nextSession = todaysSessions[0];

  const selectedClient = useMemo(
    () => ({
      id: 'cli-123',
      nombre: 'María López',
      edad: 34,
      nivel: 'Intermedio',
      objetivos: ['Pérdida de grasa', 'Mejorar fuerza tren inferior', 'Mejorar postura'],
      restricciones: ['Tendinopatía rotuliana leve', 'Límites en impacto alto', 'Evitar hiperextensión lumbar'],
      notas: 'Prefiere sesiones de 40-50 min, 4 días/semana. Historial de running recreativo.',
      avatarUrl: null as string | null,
    }),
    [],
  );
  const clientContext = `${selectedClient.nivel} · ${selectedClient.objetivos[0] ?? 'Objetivo activo'}`;

  const contextoCliente = useMemo<ContextoCliente>(
    () => ({
      clienteId: selectedClient.id,
      clienteNombre: selectedClient.nombre,
      datosBiometricos: {
        peso: {
          valor: 68.2,
          fecha: '2025-01-08',
          tendencia: 'bajando',
        },
        altura: 168,
        imc: 24.1,
        grasaCorporal: {
          porcentaje: 24,
          fecha: '2025-01-05',
        },
        frecuenciaCardiaca: {
          reposo: 58,
          maxima: 186,
        },
        vo2Max: 42,
      },
      lesiones: [
        {
          id: 'lesion-rotuliana',
          nombre: 'Tendinopatía rotuliana',
          ubicacion: 'Rodilla derecha',
          severidad: 'leve',
          fechaInicio: '2024-11-15',
          estado: 'activa',
          restricciones: ['Limitar impactos altos', 'Trabajo excéntrico controlado'],
          notas: 'Mejora progresiva, monitorizar respuesta tras sesiones de fuerza.',
        },
      ],
      habitos: [
        {
          id: 'habito-sueno',
          nombre: 'Higiene del sueño',
          tipo: 'sueño',
          objetivo: 7,
          unidad: 'h/noche',
          cumplimiento: 68,
          activo: true,
        },
        {
          id: 'habito-nutricion',
          nombre: 'Registro nutricional',
          tipo: 'nutricion',
          objetivo: 5,
          unidad: 'días/semana',
          cumplimiento: 60,
          activo: true,
        },
      ],
      disponibilidadMaterial: [
        { material: 'Bandas elásticas', disponible: true, ubicacion: 'Home gym' },
        { material: 'Kettlebell 16kg', disponible: false, notas: 'Prestada durante dos semanas' },
        { material: 'Barra olímpica', disponible: true, ubicacion: 'Box' },
      ],
      cronotipo: 'matutino',
      ultimaActualizacion: new Date().toISOString(),
    }),
    [selectedClient.id, selectedClient.nombre],
  );

  const objetivosProgreso = useMemo<ResumenObjetivosProgreso>(() => {
    const objetivos: ResumenObjetivosProgreso['objetivos'] = [
      {
        id: 'obj-1',
        titulo: 'Reducir grasa corporal al 22%',
        descripcion: 'Mejorar composición corporal sin perder masa magra.',
        categoria: 'salud',
        horizonte: 'medio',
        valorObjetivo: 22,
        valorActual: 24.5,
        unidad: '%',
        fechaLimite: '2025-03-31',
        estado: 'in_progress',
        progreso: 35,
        fechaCreacion: '2024-09-01',
        fechaActualizacion: new Date().toISOString(),
      },
      {
        id: 'obj-2',
        titulo: 'Mejorar sentadilla trasera 1RM',
        descripcion: 'Alcanzar 120 kg manteniendo técnica sólida.',
        categoria: 'fuerza',
        horizonte: 'corto',
        valorObjetivo: 120,
        valorActual: 112,
        unidad: 'kg',
        fechaLimite: '2025-02-15',
        estado: 'at_risk',
        progreso: 45,
        fechaCreacion: '2024-10-10',
        fechaActualizacion: new Date().toISOString(),
      },
      {
        id: 'obj-3',
        titulo: 'Completar 10 sesiones consecutivas de movilidad',
        descripcion: 'Establecer rutina de movilidad torácica y cadera.',
        categoria: 'fitness',
        horizonte: 'corto',
        valorObjetivo: 10,
        valorActual: 10,
        unidad: 'sesiones',
        fechaLimite: '2024-12-20',
        estado: 'achieved',
        progreso: 100,
        fechaCreacion: '2024-11-01',
        fechaActualizacion: '2024-12-18',
      },
    ];

    const metricas = [
      {
        id: 'met-1',
        nombre: 'Peso corporal',
        categoria: 'salud',
        valorActual: 68.2,
        valorAnterior: 69.5,
        cambio: -1.3,
        cambioPorcentual: Number((-1.3 / 69.5 * 100).toFixed(2)),
        unidad: 'kg',
        tendencia: 'down' as const,
        fecha: '2025-01-08',
      },
      {
        id: 'met-2',
        nombre: 'Adherencia semanal',
        categoria: 'fitness',
        valorActual: 74,
        valorAnterior: 68,
        cambio: 6,
        cambioPorcentual: Number((6 / 68 * 100).toFixed(2)),
        unidad: '%',
        tendencia: 'up' as const,
        fecha: '2025-01-07',
      },
      {
        id: 'met-3',
        nombre: 'Horas de sueño promedio',
        categoria: 'salud',
        valorActual: 6.6,
        valorAnterior: 6.2,
        cambio: 0.4,
        cambioPorcentual: Number((0.4 / 6.2 * 100).toFixed(2)),
        unidad: 'h',
        tendencia: 'up' as const,
        fecha: '2025-01-09',
      },
    ];

    const resumen = {
      totalObjetivos: objetivos.length,
      objetivosCortoPlazo: objetivos.filter((o) => o.horizonte === 'corto').length,
      objetivosMedioPlazo: objetivos.filter((o) => o.horizonte === 'medio').length,
      objetivosLargoPlazo: objetivos.filter((o) => o.horizonte === 'largo').length,
      objetivosEnProgreso: objetivos.filter((o) => o.estado === 'in_progress').length,
      objetivosCompletados: objetivos.filter((o) => o.estado === 'achieved').length,
      objetivosEnRiesgo: objetivos.filter((o) => o.estado === 'at_risk').length,
      progresoPromedio:
        objetivos.length > 0
          ? Math.round(objetivos.reduce((acc, objetivo) => acc + objetivo.progreso, 0) / objetivos.length)
          : 0,
    };

    return {
      clienteId: selectedClient.id,
      clienteNombre: selectedClient.nombre,
      objetivos,
      metricas,
      resumen,
      ultimaActualizacion: new Date().toISOString(),
    };
  }, [selectedClient.id, selectedClient.nombre]);

  const timelineSesiones = useMemo<TimelineSesiones>(() => {
    const eventos: TimelineSesiones['eventos'] = [
      {
        id: 'evt-1',
        tipo: 'sesion',
        fecha: '2025-01-10T09:00:00Z',
        titulo: 'Sesión fuerza tren inferior',
        descripcion: 'Sesión completada con énfasis en control excéntrico.',
        clienteId: selectedClient.id,
        clienteNombre: selectedClient.nombre,
        metadata: {
          sesionId: 'tue-06',
          duracionMinutos: 40,
          ejerciciosCompletados: 5,
          ejerciciosTotales: 5,
          tipoEntrenamiento: 'fuerza',
          gruposMusculares: ['piernas'],
        },
      },
      {
        id: 'evt-2',
        tipo: 'feedback',
        fecha: '2025-01-09T19:30:00Z',
        titulo: 'Feedback post-sesión',
        descripcion: 'Reporta fatiga moderada tras bloques intensos consecutivos.',
        clienteId: selectedClient.id,
        clienteNombre: selectedClient.nombre,
        metadata: {
          tipoFeedback: 'post-sesion',
          puntuacion: 7,
          comentarios: 'Buena sesión, pero la rodilla cargada al final.',
        },
      },
      {
        id: 'evt-3',
        tipo: 'resultado',
        fecha: '2025-01-05T08:00:00Z',
        titulo: 'Test de movilidad torácica',
        descripcion: 'Incremento de 7° en rango de movimiento.',
        clienteId: selectedClient.id,
        clienteNombre: selectedClient.nombre,
        metadata: {
          metrica: 'Movilidad torácica',
          valorAnterior: 75,
          valorActual: 82,
          unidad: '°',
          tipoEntrenamiento: 'movilidad',
        },
      },
    ];

    return {
      clienteId: selectedClient.id,
      clienteNombre: selectedClient.nombre,
      eventos,
      resumen: {
        totalSesiones: 7,
        sesionesCompletadas: 5,
        sesionesPendientes: 2,
        promedioAdherencia: 72,
        promedioFeedback: 8.1,
        ultimaSesion: eventos[0]?.fecha,
        patronesDetectados: [
          {
            tipo: 'adherencia',
            descripcion: 'Mayor adherencia al inicio de la semana que en sesiones de jueves.',
            severidad: 'media',
          },
          {
            tipo: 'fatiga',
            descripcion: 'Fatiga elevada tras dos días consecutivos de intensidad alta.',
            severidad: 'alta',
          },
        ],
      },
      ultimaActualizacion: new Date().toISOString(),
    };
  }, [selectedClient.id, selectedClient.nombre]);

  // Sugerencias contextuales según la vista activa
  const contextualSuggestions = useMemo(() => {
    if (activeView === 'weekly') {
      const daysWithSessions = weekDays.filter((day) => {
        const plan = weeklyPlan[day];
        return plan && plan.sessions.length > 0;
      });
      const daysWithoutSessions = weekDays.filter((day) => {
        const plan = weeklyPlan[day];
        return !plan || plan.sessions.length === 0;
      });

      const suggestions: string[] = [];
      if (daysWithoutSessions.length > 0) {
        suggestions.push(`Tienes ${daysWithoutSessions.length} día(s) sin sesiones programadas. Considera distribuir la carga semanal.`);
      }
      if (daysWithSessions.length > 0) {
        const avgSessions = daysWithSessions.reduce((acc, day) => {
          const plan = weeklyPlan[day];
          return acc + (plan?.sessions.length || 0);
        }, 0) / daysWithSessions.length;
        if (avgSessions > 3) {
          suggestions.push('Algunos días tienen muchas sesiones. Revisa si puedes redistribuir para evitar sobrecarga.');
        }
      }
      if (weeklyOverview.duration > weeklyTargets.duration * 1.1) {
        suggestions.push('El volumen semanal excede el objetivo. Considera reducir duraciones o eliminar sesiones menos prioritarias.');
      }
      if (weeklyOverview.sessions < weeklyTargets.sessions * 0.8) {
        suggestions.push('El número de sesiones está por debajo del objetivo. Añade más sesiones para alcanzar las metas semanales.');
      }
      suggestions.push('Usa la vista diaria para editar sesiones específicas o la vista Excel para análisis detallado.');
      return suggestions;
    }

    if (activeView === 'daily') {
      const suggestions: string[] = [];
      const totalMin = selectedDayPlan?.sessions.reduce((acc, s) => {
        const m = s.duration.match(/\d+/);
        return acc + (m ? Number(m[0]) : 0);
      }, 0) || 0;

      if (totalMin > 60) {
        suggestions.push('La duración total del día es alta. Considera dividir en dos sesiones o reducir tiempos.');
      } else if (totalMin < 30) {
        suggestions.push('El volumen del día es bajo. Añade un bloque adicional para alcanzar objetivos.');
      }

      const modalities = selectedDayPlan?.sessions.map((s) => s.modality) || [];
      if (modalities.filter((m) => m === 'Strength').length > 2) {
        suggestions.push('Múltiples bloques de fuerza en el mismo día. Asegúrate de tener suficiente recuperación entre ellos.');
      }
      if (!modalities.includes('Mobility') && !modalities.includes('Recovery')) {
        suggestions.push('Considera añadir un bloque de movilidad o recuperación para completar el día.');
      }

      suggestions.push('Revisa la distribución de intensidades. Alterna días pesados con días ligeros.');
      return suggestions;
    }

    if (activeView === 'excel') {
      const suggestions: string[] = [];
      const daysExceeding = weekDays.filter((day) => {
        const plan = weeklyPlan[day];
        if (!plan) return false;
        const totalMin = plan.sessions.reduce((acc, s) => {
          const m = s.duration.match(/\d+/);
          return acc + (m ? Number(m[0]) : 0);
        }, 0);
        const calories = Math.round(totalMin * 8);
        return (
          (weeklyTargets && totalMin > weeklyTargets.duration) ||
          (weeklyTargets && calories > weeklyTargets.calories)
        );
      });

      if (daysExceeding.length > 0) {
        suggestions.push(`${daysExceeding.length} día(s) exceden los objetivos semanales. Revisa las celdas resaltadas en rojo.`);
      }

      const totalDuration = weeklyOverview.duration;
      const totalCalories = weeklyCalories;
      if (weeklyTargets) {
        const durationDiff = totalDuration - weeklyTargets.duration;
        const caloriesDiff = totalCalories - weeklyTargets.calories;
        if (Math.abs(durationDiff) > 30) {
          suggestions.push(
            `La duración total (${totalDuration} min) difiere del objetivo (${weeklyTargets.duration} min) en ${Math.abs(durationDiff)} min.`
          );
        }
        if (Math.abs(caloriesDiff) > 500) {
          suggestions.push(
            `Las calorías totales (${totalCalories}) difieren del objetivo (${weeklyTargets.calories}) en ${Math.abs(caloriesDiff)} kcal.`
          );
        }
      }

      suggestions.push('Usa doble clic en las celdas de objetivos (H, I) para editar valores específicos por día.');
      suggestions.push('Exporta los datos a Excel para compartir con el cliente o hacer análisis adicionales.');
      return suggestions;
    }

    return [];
  }, [activeView, weeklyPlan, weekDays, weeklyOverview, weeklyTargets, weeklyCalories, selectedDayPlan]);
  const primarySuggestion = contextualSuggestions[0] ?? null;

  const handleUpdateDayPlan = useCallback(
    (day: string, updates: Partial<DayPlan>) => {
      const dayKey = day as DayKey;
      setWeeklyPlan((prev) => ({
        ...prev,
        [dayKey]: {
          ...prev[dayKey],
          ...updates,
        },
      }));
    },
    [],
  );

  const handleInsightAction = useCallback(
    (insightId: string, action: { tipo: string; label: string; detalle?: string } | undefined) => {
      if (!action) return;

      if (
        action.tipo === 'aumentar_volumen_grupo' ||
        action.tipo === 'revisar_objetivo' ||
        action.tipo === 'revisar_adherencia' ||
        action.tipo === 'revisar_plan'
      ) {
        setActiveView('weekly');
      }

      if (
        action.tipo === 'aumentar_volumen_grupo' ||
        action.tipo === 'ajustar_intensidad' ||
        action.tipo === 'ajustar_plan_sueno'
      ) {
        setSelectedAutomationPreset(null);
        setIsBulkAutomationOpen(true);
      }

      if (rightCollapsed) {
        setRightCollapsed(false);
        try {
          localStorage.setItem('programasEditor_rightCollapsed', JSON.stringify(false));
        } catch {
          // ignore persistence errors
        }
      }

      console.info('[ProgramasDeEntrenoEditorPage] Acción de insight recibida', { insightId, action });
    },
    [rightCollapsed],
  );

  const handleAutomationPresetSelect = useCallback((preset: PresetAutomatizacion) => {
    setSelectedAutomationPreset(preset);
    setIsAutomationPresetsOpen(false);
    setIsBulkAutomationOpen(true);
  }, []);

  const handleBulkAutomationOpenChange = useCallback((open: boolean) => {
    setIsBulkAutomationOpen(open);
    if (!open) {
      setSelectedAutomationPreset(null);
    }
  }, []);

  // Atajos de teclado para cambiar vistas y colapsar paneles
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Solo activar si no estamos escribiendo en un input o textarea
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        (e.target instanceof HTMLElement && e.target.isContentEditable)
      ) {
        return;
      }

      // Cambiar vistas: 1 = semanal, 2 = diaria, 3 = excel
      if (e.key === '1' && !e.ctrlKey && !e.metaKey && !e.shiftKey && !e.altKey) {
        e.preventDefault();
        setActiveView('weekly');
      } else if (e.key === '2' && !e.ctrlKey && !e.metaKey && !e.shiftKey && !e.altKey) {
        e.preventDefault();
        setActiveView('daily');
      } else if (e.key === '3' && !e.ctrlKey && !e.metaKey && !e.shiftKey && !e.altKey) {
        e.preventDefault();
        setActiveView('excel');
      }
      // Colapsar/expandir panel izquierdo: Ctrl/Cmd + B
      else if ((e.ctrlKey || e.metaKey) && e.key === 'b' && !e.shiftKey && !e.altKey) {
        e.preventDefault();
        setLeftCollapsed((prev: boolean) => {
          const next = !prev;
          try {
            localStorage.setItem('programasEditor_leftCollapsed', JSON.stringify(next));
          } catch {
            // ignore persistence errors
          }
          return next;
        });
      }
      // Colapsar/expandir panel derecho: Ctrl/Cmd + Shift + B
      else if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'B') {
        e.preventDefault();
        setRightCollapsed((prev: boolean) => {
          const next = !prev;
          try {
            localStorage.setItem('programasEditor_rightCollapsed', JSON.stringify(next));
          } catch {
            // ignore persistence errors
          }
          return next;
        });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const renderCanvas = () => {
    if (activeView === 'weekly') {
      return (
        <WeeklyEditorView
          weekDays={weekDays}
          weeklyPlan={weeklyPlan}
          weeklyTargets={weeklyTargets}
          onViewDay={(day) => {
            setSelectedDay(day as DayKey);
            setActiveView('daily');
          }}
          onReorderSessions={(day, newSessions) => {
            setWeeklyPlan((prev) => ({
              ...prev,
              [day]: {
                ...prev[day as DayKey],
                sessions: newSessions,
              },
            }));
          }}
        onDropFromLibrary={(day, payload) => handleDropFromLibrary(day as DayKey, payload)}
        />
      );
    }

    if (activeView === 'daily' && selectedDayPlan) {
      return (
        <DailyEditorView
          selectedDay={selectedDay}
          weekDays={weekDays}
          dayPlan={selectedDayPlan}
          onPreviousDay={() => goToDay(-1)}
          onNextDay={() => goToDay(1)}
          onSelectDay={(day) => handleSelectDay(day as DayKey)}
          onBackToWeekly={() => setActiveView('weekly')}
        />
      );
    }

    return (
      <ExcelSummaryView
        weekDays={weekDays}
        weeklyPlan={weeklyPlan}
        weeklyTargets={weeklyTargets}
        onUpdateDayPlan={handleUpdateDayPlan}
      />
    );
  };

  const handleNavigateBack = useCallback(() => navigate(-1), [navigate]);

  const handleToggleLeftPanel = useCallback(() => {
    setLeftCollapsed((prev: boolean) => {
      const next = !prev;
      try {
        localStorage.setItem('programasEditor_leftCollapsed', JSON.stringify(next));
      } catch {
        // ignore persistence errors
      }
      return next;
    });
  }, []);

  const handleRestoreRightPanel = useCallback(() => {
    setRightCollapsed(false);
    try {
      localStorage.setItem('programasEditor_rightCollapsed', JSON.stringify(false));
    } catch {
      // ignore persistence errors
    }
  }, []);

  const handleCollapseRightPanel = useCallback(() => {
    setRightCollapsed(true);
    try {
      localStorage.setItem('programasEditor_rightCollapsed', JSON.stringify(true));
    } catch {
      // ignore persistence errors
    }
  }, []);

  const handleLibraryTabChange = useCallback((tab: LibraryTab) => {
    setLibraryTab(tab);
    try {
      localStorage.setItem('programasEditor_libraryTab', tab);
    } catch {
      // ignore persistence errors
    }
  }, []);

  const handleLibrarySearchChange = useCallback((value: string) => {
    setLibrarySearch(value);
    try {
      localStorage.setItem('programasEditor_librarySearch', value);
    } catch {
      // ignore persistence errors
    }
  }, []);

  const handleSelectLibrarySuggestion = useCallback(
    (value: string) => {
      handleLibrarySearchChange(value);
    },
    [handleLibrarySearchChange],
  );

  const handleQuickFilterChange = useCallback(
    (filter: keyof LibraryQuickFilters, value: LibraryQuickFilters[keyof LibraryQuickFilters]) => {
      setLibraryQuickFilters((prev) => {
        const next = { ...prev, [filter]: value };
        try {
          localStorage.setItem('programasEditor_quickFilters', JSON.stringify(next));
        } catch {
          // ignore
        }
        return next;
      });
    },
    [],
  );

  const handleResetManualTargets = useCallback(() => {
    updateManualWeeklyTargets({ sessions: null, duration: null, calories: null });
  }, [updateManualWeeklyTargets]);

  const handleOpenSaveDraftModal = useCallback(() => {
    setSaveDraftError(null);
    setIsSaveDraftModalOpen(true);
  }, []);

  const handleCloseSaveDraftModal = useCallback(() => {
    setIsSaveDraftModalOpen(false);
  }, []);

  const handleDraftMessageChange = useCallback((event: ChangeEvent<HTMLTextAreaElement>) => {
    const { value } = event.target;
    setDraftMessage(value);
    try {
      localStorage.setItem('programasEditor_lastDraftMessage', value);
    } catch {
      // ignore persistence errors
    }
  }, []);

  const handleSaveDraft = useCallback(async () => {
    setIsSavingDraft(true);
    setSaveDraftError(null);

    const timestamp = new Date().toISOString();

    try {
      const programa = await guardarBorrador(draftId, {
        nombre: 'Programa Actual',
        descripcion: draftMessage || 'Borrador guardado desde el editor de entreno.',
        tipo: 'personalizado',
        categoria: 'general',
        planSemanal: weeklyPlan,
        clienteId: selectedClient.id,
        creadoPor: user?.id ?? 'entrenador-demo',
      });

      if (programa?.id) {
        setDraftId(programa.id);
        try {
          localStorage.setItem('programasEditor_lastDraftId', programa.id);
        } catch {
          // ignore persistence errors
        }
      }

      setLastSaveTime(timestamp);
      try {
        localStorage.setItem('programasEditor_lastSaveTime', timestamp);
      } catch {
        // ignore persistence errors
      }

      setIsSaveDraftModalOpen(false);
    } catch (error) {
      console.error('Error guardando borrador', error);
      setSaveDraftError('No se pudo guardar el borrador. Inténtalo de nuevo.');
    } finally {
      setIsSavingDraft(false);
    }
  }, [draftId, draftMessage, selectedClient.id, user?.id, weeklyPlan]);

  const handleLayoutSurveyComplete = useCallback(
    (respuestas: RespuestasCuestionario, plantillas: PlantillaRecomendada[]) => {
      setLayoutSurveyResponses(respuestas);
      setLayoutRecommendedTemplates(plantillas);
      setIsLayoutSurveyOpen(false);
    },
    [],
  );

  const handleFormulasChange = useCallback((formulas: FormulaPersonalizada[]) => {
    setCustomFormulas(formulas);
  }, []);

  const handleLibraryDragStart = useCallback(
    (_type: 'template' | 'block' | 'exercise', _item: TemplateExample | BlockExample | ExerciseExample) => {
      // Placeholder for analytics o métricas
    },
    [],
  );

  const handleQuickClientSwitch = useCallback(() => {
    setIsClientInfoOpen(true);
  }, [setIsClientInfoOpen]);

  const handleImportTemplate = useCallback(() => {
    setLeftCollapsed((prev: boolean) => {
      if (prev) {
        try {
          localStorage.setItem('programasEditor_leftCollapsed', JSON.stringify(false));
        } catch {
          // ignore persistence errors
        }
        return false;
      }
      return prev;
    });

    setLibraryTab('templates');
    try {
      localStorage.setItem('programasEditor_libraryTab', 'templates');
    } catch {
      // ignore persistence errors
    }
  }, [setLeftCollapsed, setLibraryTab]);

  const handleAddToLibrary = useCallback(() => {
    console.info('Añadir a biblioteca - próximamente');
  }, []);

  const handleDropFromLibrary = useCallback(
    (day: DayKey, data: { type: 'template' | 'block' | 'exercise'; item: TemplateExample | BlockExample | ExerciseExample }) => {
      const createSession = () => {
        const base = {
          id: `lib-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
          time: '10:00',
          duration: '30 min',
          modality: 'Custom',
          intensity: 'Media',
          notes: 'Añadido desde biblioteca',
        };

        if (data.type === 'template') {
          const template = data.item as TemplateExample;
          return {
            ...base,
            block: template.name,
            duration: template.duration,
            modality: template.focus.includes('Mob') ? 'Mobility' : 'Strength',
            intensity: difficultyToIntensity(template.difficulty),
            notes: template.focus,
          };
        }
        if (data.type === 'block') {
          const block = data.item as BlockExample;
          return {
            ...base,
            block: block.name,
            duration: block.duration,
            modality: block.category,
            intensity: block.intensity,
            notes: block.focus,
          };
        }

        const exercise = data.item as ExerciseExample;
        return {
          ...base,
          block: exercise.name,
          duration: '12 min',
          modality: exercise.target.includes('Core') ? 'Core' : 'Accessory',
          intensity: exercise.intensity ?? difficultyToIntensity(exercise.difficulty),
          notes: `Equipo: ${exercise.equipment}`,
        };
      };

      setWeeklyPlan((prev) => {
        const dayPlan = prev[day];
        if (!dayPlan) return prev;
        return {
          ...prev,
          [day]: {
            ...dayPlan,
            sessions: [...dayPlan.sessions, createSession()],
          },
        };
      });
    },
    [],
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100/80 py-8 dark:from-[#050815] dark:via-[#0b1120] dark:to-[#020617]">
      <div className="flex w-full flex-col gap-6 px-4 md:px-6 lg:px-8">
        {/* Top bar */}
        <EditorHeader
          onBack={handleNavigateBack}
          rightCollapsed={rightCollapsed}
          onRestoreRightPanel={handleRestoreRightPanel}
          onOpenClientInfo={() => setIsClientInfoOpen(true)}
          onQuickSwitchClient={handleQuickClientSwitch}
          onOpenFitCoach={() => setIsFitCoachOpen(true)}
          onOpenSubstitutions={() => setIsSubstitutionsOpen(true)}
          onOpenBatchTraining={() => setIsBatchTrainingOpen(true)}
          onOpenCompartirChat={() => setIsCompartirChatOpen(true)}
          onOpenBuscarSustituir={() => setIsBuscarSustituirOpen(true)}
          onOpenTagManager={() => setIsTagManagerOpen(true)}
          onOpenCharts={() => setIsChartsOpen(true)}
          onOpenLayoutSurvey={() => setIsLayoutSurveyOpen(true)}
          onOpenAutomationPresets={() => setIsAutomationPresetsOpen(true)}
          onOpenImportTemplate={handleImportTemplate}
          onOpenBulkAutomation={() => setIsBulkAutomationOpen(true)}
          onSaveDraft={handleOpenSaveDraftModal}
          lastSaveTime={lastSaveTime}
          activeView={activeView}
          onChangeView={(view) => setActiveView(view)}
          clienteNombre={selectedClient.nombre}
          clienteContexto={clientContext}
          clienteAvatarUrl={selectedClient.avatarUrl}
          programaEstado={programStatus}
          clienteNivel={selectedClient.nivel}
          clienteLesion={selectedClient.restricciones[0] ?? null}
          clienteObjetivo={selectedClient.objetivos[0] ?? null}
          clienteAlerta={primarySuggestion}
        />

        {lastBatchSummary && (
          <div className="rounded-2xl border border-emerald-100/80 bg-emerald-50/70 p-4 text-xs text-emerald-700 dark:border-emerald-900/40 dark:bg-emerald-950/30 dark:text-emerald-300">
            <p className="text-sm font-semibold text-emerald-900 dark:text-emerald-200">Resumen batch exportado</p>
            <p>
              {lastBatchSummary.metrics.sessionsTouched} bloques · Δ duración{' '}
              {lastBatchSummary.metrics.totalDurationDelta >= 0 ? '+' : ''}
              {lastBatchSummary.metrics.totalDurationDelta} min · {lastBatchSummary.affectedRules} reglas
            </p>
          </div>
        )}

        {layoutRecommendedTemplates.length > 0 && (
          <Card className="border border-indigo-200/70 bg-white/95 p-4 shadow-sm dark:border-indigo-900/40 dark:bg-slate-950/60">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-indigo-500">
                  Plantillas sugeridas por el asistente
                </p>
                {layoutSurveyResponses?.rol && (
                  <p className="text-sm text-slate-600 dark:text-slate-300">
                    Rol seleccionado: {layoutSurveyResponses.rol}
                  </p>
                )}
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsLayoutSurveyOpen(true)}
                className="h-auto px-3 py-1 text-xs"
              >
                Ajustar preferencias
              </Button>
            </div>
            <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {layoutRecommendedTemplates.slice(0, 6).map((template) => (
                <div
                  key={template.id}
                  className="rounded-xl border border-indigo-100/70 bg-indigo-50/40 p-3 dark:border-indigo-900/30 dark:bg-indigo-500/10"
                >
                  <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                    {template.nombre}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-300">{template.descripcion}</p>
                  <p className="mt-2 text-[11px] text-indigo-600 dark:text-indigo-300">
                    {template.razon}
                  </p>
                </div>
              ))}
            </div>
          </Card>
        )}

        <div className="flex flex-col gap-6 lg:flex-row">
          <LibrarySidebar
            leftCollapsed={leftCollapsed}
            onToggleCollapse={handleToggleLeftPanel}
            libraryTab={libraryTab}
            onChangeLibraryTab={handleLibraryTabChange}
            librarySearch={librarySearch}
            onChangeLibrarySearch={handleLibrarySearchChange}
            searchSuggestions={searchSuggestions}
            onSelectSuggestion={handleSelectLibrarySuggestion}
            quickFilters={libraryQuickFilters}
            onUpdateQuickFilter={handleQuickFilterChange}
            templateLists={templateLists}
            blockList={filteredBlocks}
            exerciseLists={exerciseLists}
            onTogglePinTemplate={togglePinTemplate}
            onTogglePinExercise={togglePinExercise}
            onDragStart={handleLibraryDragStart}
            onAddToLibrary={handleAddToLibrary}
          />

          <main className="flex-1 space-y-4">{renderCanvas()}</main>

          <SummarySidebar
            isCollapsed={rightCollapsed}
            onCollapse={handleCollapseRightPanel}
            todaysSessions={todaysSessions}
            nextSession={nextSession}
            weeklyOverview={weeklyOverview}
            weeklyCalories={weeklyCalories}
            autoWeeklyTargets={autoWeeklyTargets}
            weeklyTargets={weeklyTargets}
            manualWeeklyTargets={manualWeeklyTargets}
            onResetManualTargets={handleResetManualTargets}
            onUpdateManualTargets={updateManualWeeklyTargets}
            contextualSuggestions={contextualSuggestions}
            activeView={activeView}
            customFormulaCount={customFormulas.length}
            onOpenFormulaManager={() => setIsFormulaManagerOpen(true)}
          weeklyPlan={weeklyPlan}
          weekDays={weekDays}
          contextoCliente={contextoCliente}
          objetivosProgreso={objetivosProgreso}
          timelineSesiones={timelineSesiones}
          onInsightAction={handleInsightAction}
          clienteId={selectedClient.id}
          programaId={currentProgramId}
          />
        </div>
      </div>
      {/* Modal: Ficha del cliente */}
      <Modal
        isOpen={isClientInfoOpen}
        onClose={() => setIsClientInfoOpen(false)}
        title="Ficha del cliente"
        size="lg"
      >
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 text-indigo-700">
              <User className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{selectedClient.nombre}</p>
              <p className="text-xs text-slate-500 dark:text-slate-300">
                {selectedClient.edad} años · {selectedClient.nivel}
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Card className="border border-slate-200/70 bg-white/95 p-4 dark:border-slate-800/70 dark:bg-slate-950/60">
              <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-100">Objetivos</h4>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-600 dark:text-slate-300">
                {selectedClient.objetivos.map((o) => (
                  <li key={o}>{o}</li>
                ))}
              </ul>
            </Card>
            <Card className="border border-slate-200/70 bg-white/95 p-4 dark:border-slate-800/70 dark:bg-slate-950/60">
              <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-100">Restricciones</h4>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-600 dark:text-slate-300">
                {selectedClient.restricciones.map((r) => (
                  <li key={r}>{r}</li>
                ))}
              </ul>
            </Card>
          </div>
          <Card className="border border-slate-200/70 bg-white/95 p-4 dark:border-slate-800/70 dark:bg-slate-950/60">
            <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-100">Notas</h4>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{selectedClient.notas}</p>
          </Card>
        </div>
      </Modal>

      <CuestionarioConfiguracion
        isOpen={isLayoutSurveyOpen}
        onClose={() => setIsLayoutSurveyOpen(false)}
        onComplete={handleLayoutSurveyComplete}
        respuestasExistentes={layoutSurveyResponses ?? undefined}
      />

      <GestorFormulas
        isOpen={isFormulaManagerOpen}
        onClose={() => setIsFormulaManagerOpen(false)}
        onFormulasChange={handleFormulasChange}
      />

      <Modal
        isOpen={isChartsOpen}
        onClose={() => setIsChartsOpen(false)}
        title="Gráficos de carga semanal"
        size="xl"
      >
        <LoadTrackingChart weekDays={weekDays} weeklyPlan={weeklyPlan} weeklyTargets={weeklyTargets} />
      </Modal>

      {/* Modal: Fit Coach (Recomendaciones IA) */}
      <Modal
        isOpen={isFitCoachOpen}
        onClose={() => setIsFitCoachOpen(false)}
        title={`Asistente IA · ${selectedDay}`}
        size="xl"
      >
        <div className="space-y-4">
          <AsistenteIAPrograma
            weeklyPlan={weeklyPlan}
            selectedDay={selectedDay}
            selectedDayPlan={selectedDayPlan}
            clientInfo={{
              nombre: selectedClient.nombre,
              objetivos: selectedClient.objetivos,
              restricciones: selectedClient.restricciones,
              notas: selectedClient.notas,
            }}
            weeklyTargets={weeklyTargets}
            onAddBlock={(block) => handleAddBlockToDay(selectedDay, block)}
          />
          <div className="flex items-center justify-end">
            <Button variant="ghost" onClick={() => setIsFitCoachOpen(false)}>
              Cerrar
            </Button>
          </div>
        </div>
      </Modal>

      {/* Modal: Sustituciones de ejercicios */}
      <Modal
        isOpen={isSubstitutionsOpen}
        onClose={() => setIsSubstitutionsOpen(false)}
        title="Sustituciones de ejercicios"
        size="xl"
      >
        <SubstitutionsModal
          weeklyPlan={weeklyPlan}
          weekDays={weekDays}
          onReplaceBlocks={(_replacements) => {
            // Esta función se llama desde handleReplace dentro del modal
            // El plan ya se actualiza a través de onUpdatePlan
          }}
          onUpdatePlan={(updatedPlan) => {
            setWeeklyPlan(updatedPlan);
          }}
          historyManager={substitutionHistoryManager}
          onClose={() => setIsSubstitutionsOpen(false)}
        />
      </Modal>

      {/* Modal: Batch Training */}
      <Modal
        isOpen={isBatchTrainingOpen}
        onClose={() => setIsBatchTrainingOpen(false)}
        title="Batch Training - Ediciones masivas"
        size="xl"
      >
        <BatchTrainingModal
          weeklyPlan={weeklyPlan}
          weekDays={weekDays}
          clientId={selectedClient.id}
          programId={currentProgramId}
          onApplyRules={(updatedPlan) => {
            setWeeklyPlan(updatedPlan);
            setIsBatchTrainingOpen(false);
          }}
          onClose={() => setIsBatchTrainingOpen(false)}
          onExportSummary={(summary) => {
            setLastBatchSummary(summary);
          }}
        />
      </Modal>

      {/* Modal: Compartir Extractos del Chat */}
      <CompartirExtractosChat
        open={isCompartirChatOpen}
        onOpenChange={setIsCompartirChatOpen}
        clienteId={selectedClient.id}
        clienteNombre={selectedClient.nombre}
        programaId={currentProgramId}
        programaNombre="Programa Actual"
      />

      {/* Modal: Buscar y Sustituir Entidades */}
      <BuscarSustituirEntidades
        open={isBuscarSustituirOpen}
        onOpenChange={setIsBuscarSustituirOpen}
        weeklyPlan={weeklyPlan}
        weekDays={weekDays}
        onReplace={(replacements) => {
          const updatedPlan: Record<DayKey, DayPlan> = { ...weeklyPlan };
          
          replacements.forEach((replacement) => {
            const dayPlan = updatedPlan[replacement.dia];
            
            if (replacement.sessionId) {
              // Reemplazar en una sesión específica
              updatedPlan[replacement.dia] = {
                ...dayPlan,
                sessions: dayPlan.sessions.map((session) => {
                  if (session.id === replacement.sessionId) {
                    const updatedSession = { ...session };
                    
                    switch (replacement.tipo) {
                      case 'bloque':
                        updatedSession.block = replacement.valorNuevo;
                        break;
                      case 'tag':
                        // Determinar qué tag reemplazar basándose en el valor original
                        if (session.modality === replacement.valorNuevo || session.intensity === replacement.valorNuevo) {
                          // Ya está reemplazado o es el mismo
                        } else if (session.modality.toLowerCase().includes(replacement.valorNuevo.toLowerCase())) {
                          updatedSession.modality = replacement.valorNuevo;
                        } else if (session.intensity.toLowerCase().includes(replacement.valorNuevo.toLowerCase())) {
                          updatedSession.intensity = replacement.valorNuevo;
                        }
                        break;
                      case 'nota':
                        updatedSession.notes = replacement.valorNuevo;
                        break;
                    }
                    
                    return updatedSession;
                  }
                  return session;
                }),
              };
            } else {
              // Reemplazar en propiedades del día
              switch (replacement.tipo) {
                case 'tag':
                  if (dayPlan.focus.toLowerCase().includes(replacement.valorNuevo.toLowerCase())) {
                    updatedPlan[replacement.dia] = { ...dayPlan, focus: replacement.valorNuevo };
                  } else if (dayPlan.volume.toLowerCase().includes(replacement.valorNuevo.toLowerCase())) {
                    updatedPlan[replacement.dia] = { ...dayPlan, volume: replacement.valorNuevo };
                  } else if (dayPlan.intensity.toLowerCase().includes(replacement.valorNuevo.toLowerCase())) {
                    updatedPlan[replacement.dia] = { ...dayPlan, intensity: replacement.valorNuevo };
                  } else if (dayPlan.microCycle.toLowerCase().includes(replacement.valorNuevo.toLowerCase())) {
                    updatedPlan[replacement.dia] = { ...dayPlan, microCycle: replacement.valorNuevo };
                  }
                  break;
                case 'nota':
                  // Reemplazar en summary
                  updatedPlan[replacement.dia] = {
                    ...dayPlan,
                    summary: dayPlan.summary.map((item) =>
                      item.toLowerCase().includes(replacement.valorNuevo.toLowerCase())
                        ? replacement.valorNuevo
                        : item
                    ),
                  };
                  break;
              }
            }
          });
          
          setWeeklyPlan(updatedPlan);
          setIsBuscarSustituirOpen(false);
        }}
      />

      {/* Modal: Guardar borrador */}
      <Modal
        isOpen={isSaveDraftModalOpen}
        onClose={handleCloseSaveDraftModal}
        title="Guardar borrador"
        size="md"
      >
        <div className="space-y-4">
          <p className="text-sm text-slate-600 dark:text-slate-300">
            Guarda tu progreso como borrador. Puedes añadir una nota opcional para recordar cambios clave.
          </p>
          <Textarea
            label="Notas del borrador (opcional)"
            placeholder="Resumen rápido de los cambios, bloque destacado, recordatorios..."
            rows={4}
            value={draftMessage}
            onChange={handleDraftMessageChange}
            maxLength={280}
            showCount
          />
          {saveDraftError && (
            <div className="flex items-start gap-2 rounded-xl border border-red-200/70 bg-red-50/80 p-3 dark:border-red-900/50 dark:bg-red-950/40">
              <AlertCircle className="mt-0.5 h-4 w-4 text-red-500" />
              <span className="text-sm text-red-600 dark:text-red-300">{saveDraftError}</span>
            </div>
          )}
          <div className="flex items-center justify-end gap-2">
            <Button variant="ghost" onClick={handleCloseSaveDraftModal} disabled={isSavingDraft}>
              Cancelar
            </Button>
            <Button variant="secondary" onClick={handleSaveDraft} loading={isSavingDraft}>
              Guardar borrador
            </Button>
          </div>
        </div>
      </Modal>

      {/* Modal: Gestión de Tags */}
      <TagManager
        open={isTagManagerOpen}
        onOpenChange={setIsTagManagerOpen}
        weeklyPlan={weeklyPlan}
        weekDays={weekDays}
        onUpdatePlan={(updatedPlan) => {
          setWeeklyPlan(updatedPlan);
        }}
      />

      <GestorPresetsAutomatizaciones
        open={isAutomationPresetsOpen}
        onOpenChange={setIsAutomationPresetsOpen}
        usuarioId={user?.id ?? 'usuario-actual'}
        usuarioNombre={user?.name ?? user?.email ?? 'Usuario'}
        onSeleccionarPreset={handleAutomationPresetSelect}
      />

      {/* Modal: Automatización Masiva */}
      <BulkAutomationFlow
        open={isBulkAutomationOpen}
        onOpenChange={handleBulkAutomationOpenChange}
        weeklyPlan={weeklyPlan}
        weekDays={weekDays}
        onUpdatePlan={(updatedPlan) => {
          setWeeklyPlan(updatedPlan);
        }}
        selectedPreset={selectedAutomationPreset}
        onClearSelectedPreset={() => setSelectedAutomationPreset(null)}
        programaId={currentProgramId}
        clienteId={selectedClient.id}
      />
    </div>
  );
}
