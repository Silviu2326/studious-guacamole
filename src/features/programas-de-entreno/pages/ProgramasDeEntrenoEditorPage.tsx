import { useCallback, useEffect, useMemo, useState, type ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Calendar,
  CalendarCheck,
  CalendarRange,
  ChevronLeft,
  ChevronRight,
  Dumbbell,
  FileSpreadsheet,
  Flame,
  Library,
  PlusCircle,
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
  StickyNote,
  Edit2,
  Trash2,
  Share2,
  TrendingUp,
  TrendingDown,
  Minus,
  Undo2,
  Redo2,
  History,
  Bookmark,
  BookmarkPlus,
  CheckCircle2,
  BarChart3,
  X,
} from 'lucide-react';
import { Button, Card, Tabs, Badge, Input, Select, Modal, Textarea } from '../../../components/componentsreutilizables';
import { WeeklyEditorView } from '../components/WeeklyEditorView';
import { DailyEditorView } from '../components/DailyEditorView';
import { ExcelSummaryView } from '../components/ExcelSummaryView';
import { LoadTrackingChart } from '../components/LoadTrackingChart';
import type { DayPlan, DaySession, RespuestasCuestionario, PlantillaRecomendada } from '../types';
import { obtenerReglas, aplicarReglasInteligentes, type ReglaInteligente } from '../utils/intelligentRules';
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
import type { FormulaPersonalizada } from '../utils/formulasPersonalizadas';

type EditorView = 'weekly' | 'daily' | 'excel';
type LibraryTab = 'templates' | 'exercises';

type FollowUpNote = {
  id: string;
  content: string;
  createdAt: string;
};

type TemplateExample = {
  id: string;
  name: string;
  focus: string;
  duration: string;
  difficulty: 'Facil' | 'Media' | 'Dificil';
};

type ExerciseExample = {
  id: string;
  name: string;
  target: string;
  equipment: string;
  difficulty: 'Facil' | 'Media' | 'Dificil';
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

const weekDays = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'] as const;

type DayKey = (typeof weekDays)[number];

const INITIAL_WEEKLY_PLAN: Record<DayKey, DayPlan> = {
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

type EditorHeaderProps = {
  onBack: () => void;
  rightCollapsed: boolean;
  onRestoreRightPanel: () => void;
  onOpenClientInfo: () => void;
  onOpenFitCoach: () => void;
  onOpenSubstitutions: () => void;
  onOpenBatchTraining: () => void;
  onOpenCompartirChat: () => void;
  onOpenBuscarSustituir: () => void;
  onOpenTagManager: () => void;
  onOpenCharts: () => void;
  onOpenBulkAutomation: () => void;
  onOpenLayoutSurvey: () => void;
  onSaveDraft: () => void;
  lastSaveTime: string | null;
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
  onOpenBulkAutomation,
  onOpenLayoutSurvey,
  onSaveDraft,
  lastSaveTime,
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

  return (
    <header className="rounded-3xl border border-slate-200/70 bg-white/95 px-6 py-4 shadow-sm dark:border-slate-800/70 dark:bg-slate-950/60">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" leftIcon={<ArrowLeft className="h-4 w-4" />} onClick={onBack}>
            Volver
          </Button>
        </div>
        <div className="text-center">
          <h1 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Editor de entreno</h1>
          <p className="text-xs text-slate-500 dark:text-slate-300">
            Diseña sesiones, plantillas y progresiones semanales con IA asistida
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {rightCollapsed && (
            <Button variant="ghost" size="sm" onClick={onRestoreRightPanel}>
              Restaurar panel
            </Button>
          )}
          <Button variant="ghost" size="sm" leftIcon={<Info className="h-4 w-4" />} onClick={onOpenClientInfo}>
            Cliente
          </Button>
          <Button variant="ghost" size="sm" leftIcon={<Sparkles className="h-4 w-4" />} onClick={onOpenFitCoach}>
            Fit Coach
          </Button>
          <Button variant="ghost" size="sm" leftIcon={<Search className="h-4 w-4" />} onClick={onOpenBuscarSustituir}>
            Buscar y Sustituir
          </Button>
          <Button variant="ghost" size="sm" leftIcon={<Share2 className="h-4 w-4" />} onClick={onOpenCompartirChat}>
            Compartir Chat
          </Button>
          <Button variant="ghost" size="sm" leftIcon={<Replace className="h-4 w-4" />} onClick={onOpenSubstitutions}>
            Sustituciones
          </Button>
          <Button variant="ghost" size="sm" leftIcon={<Settings className="h-4 w-4" />} onClick={onOpenBatchTraining}>
            Batch Training
          </Button>
          <Button variant="ghost" size="sm" leftIcon={<BookmarkPlus className="h-4 w-4" />} onClick={onOpenTagManager}>
            Tags
          </Button>
          <Button variant="ghost" size="sm" leftIcon={<BarChart3 className="h-4 w-4" />} onClick={onOpenCharts}>
            Gráficos
          </Button>
          <Button variant="ghost" size="sm" leftIcon={<Lightbulb className="h-4 w-4" />} onClick={onOpenLayoutSurvey}>
            Configurar layout
          </Button>
          <Button variant="ghost" size="sm" leftIcon={<Sparkles className="h-4 w-4" />} onClick={onOpenBulkAutomation}>
            Automatización
          </Button>
          <div className="flex flex-col items-end">
            <Button 
              variant="secondary" 
              size="sm" 
              leftIcon={<Save className="h-4 w-4" />}
              onClick={onSaveDraft}
              title={formattedTime ? `Último guardado: ${formattedTime}` : 'Guardar borrador'}
            >
              Guardar borrador
            </Button>
            {formattedTime && (
              <span className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                {formattedTime}
              </span>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}


type ViewSelectorProps = {
  activeView: EditorView;
  onChange: (view: EditorView) => void;
};

function ViewSelector({ activeView, onChange }: ViewSelectorProps) {
  return (
    <Card className="border border-slate-200/70 bg-white/95 px-6 py-4 dark:border-slate-800/70 dark:bg-slate-950/60">
      <Tabs
        items={viewTabs}
        activeTab={activeView}
        onTabChange={(tabId) => onChange(tabId as EditorView)}
        variant="pills"
        size="sm"
        className="justify-center"
      />
    </Card>
  );
}

type LibrarySidebarProps = {
  leftCollapsed: boolean;
  onToggleCollapse: () => void;
  libraryTab: LibraryTab;
  onChangeLibraryTab: (tab: LibraryTab) => void;
  librarySearch: string;
  onChangeLibrarySearch: (value: string) => void;
  equipmentFilter: string;
  onChangeEquipmentFilter: (value: string) => void;
  categoryFilter: string;
  onChangeCategoryFilter: (value: string) => void;
  uniqueEquipments: string[];
  filteredPinnedTemplates: TemplateExample[];
  filteredUnpinnedTemplates: TemplateExample[];
  filteredPinnedExercises: ExerciseExample[];
  filteredUnpinnedExercises: ExerciseExample[];
  filteredExercises: ExerciseExample[];
  pinnedTemplatesCount: number;
  pinnedExercisesCount: number;
  onTogglePinTemplate: (templateId: string) => void;
  onTogglePinExercise: (exerciseId: string) => void;
  onDragStart: (type: 'template' | 'exercise', item: TemplateExample | ExerciseExample) => void;
};


function LibrarySidebar({
  leftCollapsed,
  onToggleCollapse,
  libraryTab,
  onChangeLibraryTab,
  librarySearch,
  onChangeLibrarySearch,
  equipmentFilter,
  onChangeEquipmentFilter,
  categoryFilter,
  onChangeCategoryFilter,
  uniqueEquipments,
  filteredPinnedTemplates,
  filteredUnpinnedTemplates,
  filteredPinnedExercises,
  filteredUnpinnedExercises,
  filteredExercises,
  pinnedTemplatesCount,
  pinnedExercisesCount,
  onTogglePinTemplate,
  onTogglePinExercise,
  onDragStart,
}: LibrarySidebarProps) {
  return (
    <aside
      className={`relative flex w-full flex-col gap-4 transition-all duration-300 lg:flex-shrink-0 ${
        leftCollapsed ? 'lg:w-16' : 'lg:w-[320px]'
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
              <div className="flex items-center gap-2">
                <Library className="h-5 w-5 text-indigo-500" />
                <h2 className="text-sm font-semibold text-slate-800 dark:text-slate-100">Biblioteca & bloques</h2>
              </div>
            </div>
            <p className="mt-2 text-xs text-slate-500 dark:text-slate-300">
              Arrastra bloques prediseñados, ejercicios individuales o plantillas completas.
            </p>

            <div className="mt-4">
              <Tabs
                items={[
                  {
                    id: 'templates',
                    label: 'Plantillas',
                    icon: <ScrollText className="h-3.5 w-3.5 text-indigo-500" />,
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
              />
            </div>

            <div className="mt-4 space-y-3">
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <Input
                  placeholder="Buscar en biblioteca..."
                  className="pl-9"
                  value={librarySearch}
                  onChange={(e) => onChangeLibrarySearch(e.target.value)}
                />
              </div>
              <Select
                options={[
                  { label: 'Todos los grupos musculares', value: 'todos' },
                  { label: 'Push (pecho, hombro, tríceps)', value: 'push' },
                  { label: 'Pull (espalda, bíceps)', value: 'pull' },
                  { label: 'Lower body', value: 'lower' },
                  { label: 'Core & estabilidad', value: 'core' },
                ]}
              value={categoryFilter}
              onChange={(e) => onChangeCategoryFilter(e.target.value)}
              />
              {libraryTab === 'exercises' && (
                <Select
                  options={[
                    { label: 'Todos los equipos', value: 'todos' },
                    ...uniqueEquipments.slice(1).map((eq) => ({ label: eq, value: eq })),
                  ]}
                  value={equipmentFilter}
                  onChange={(e) => onChangeEquipmentFilter(e.target.value)}
                />
              )}
            </div>

            <div className="mt-4 space-y-3">
              {libraryTab === 'templates' ? (
                <>
                  {pinnedTemplatesCount > 0 && (
                    <div className="space-y-2">
                      <div className="text-[11px] font-semibold uppercase tracking-wide text-amber-600">Favoritas</div>
                      {filteredPinnedTemplates.map((template) => (
                        <div
                          key={template.id}
                          draggable
                          onDragStart={(e) => {
                            e.dataTransfer.setData(
                              'application/json',
                              JSON.stringify({ type: 'template', item: template })
                            );
                            onDragStart('template', template);
                          }}
                          className="w-full cursor-move rounded-2xl border border-amber-200/70 bg-amber-50/60 p-4 transition hover:border-amber-300 hover:shadow-sm dark:border-amber-900/40 dark:bg-amber-500/10"
                        >
                          <div className="flex items-center justify-between gap-3">
                            <div>
                              <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{template.name}</p>
                              <p className="text-xs text-slate-500 dark:text-slate-300">{template.focus}</p>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge size="sm" variant={difficultyColorMap[template.difficulty].badgeVariant}>
                                {difficultyColorMap[template.difficulty].label}
                              </Badge>
                              <Badge size="sm" variant="secondary">
                                {template.duration}
                              </Badge>
                              <button
                                type="button"
                                aria-label="Quitar de favoritas"
                                className="rounded-full p-1 text-amber-500 hover:bg-amber-100/60 dark:hover:bg-amber-500/20"
                                onClick={() => onTogglePinTemplate(template.id)}
                              >
                                <Star className="h-4 w-4 fill-amber-400 text-amber-500" />
                              </button>
                            </div>
                          </div>
                          <div className="mt-3 flex flex-wrap gap-2 text-[11px] text-indigo-600 dark:text-indigo-300">
                            <span className="rounded-full bg-indigo-50 px-2 py-1 dark:bg-indigo-500/10">Personalizable</span>
                            <span className="rounded-full bg-indigo-50 px-2 py-1 dark:bg-indigo-500/10">IA ready</span>
                          </div>
                        </div>
                      ))}
                      <div className="pt-2 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                        Todas las plantillas
                      </div>
                    </div>
                  )}
                  {filteredUnpinnedTemplates.map((template) => (
                    <div
                      key={template.id}
                      draggable
                      onDragStart={(e) => {
                        e.dataTransfer.setData(
                          'application/json',
                          JSON.stringify({ type: 'template', item: template })
                        );
                        onDragStart('template', template);
                      }}
                      className="w-full cursor-move rounded-2xl border border-slate-200/70 bg-white/90 p-4 transition hover:border-indigo-300 hover:shadow-md dark:border-slate-800/70 dark:bg-slate-950/60 dark:hover:border-indigo-500/40"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{template.name}</p>
                          <p className="text-xs text-slate-500 dark:text-slate-300">{template.focus}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge size="sm" variant={difficultyColorMap[template.difficulty].badgeVariant}>
                            {difficultyColorMap[template.difficulty].label}
                          </Badge>
                          <Badge size="sm" variant="secondary">
                            {template.duration}
                          </Badge>
                          <button
                            type="button"
                            aria-label="Marcar como favorita"
                            className="rounded-full p-1 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                            onClick={() => onTogglePinTemplate(template.id)}
                          >
                            <Star className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                      <div className="mt-3 flex flex-wrap gap-2 text-[11px] text-indigo-600 dark:text-indigo-300">
                        <span className="rounded-full bg-indigo-50 px-2 py-1 dark:bg-indigo-500/10">Personalizable</span>
                        <span className="rounded-full bg-indigo-50 px-2 py-1 dark:bg-indigo-500/10">IA ready</span>
                      </div>
                    </div>
                  ))}
                </>
              ) : (
                <>
                  {pinnedExercisesCount > 0 && (
                    <div className="space-y-2">
                      <div className="text-[11px] font-semibold uppercase tracking-wide text-amber-600">Favoritos</div>
                      {filteredPinnedExercises.map((exercise) => (
                        <div
                          key={exercise.id}
                          draggable
                          onDragStart={(e) => {
                            e.dataTransfer.setData('application/json', JSON.stringify({ type: 'exercise', item: exercise }));
                            onDragStart('exercise', exercise);
                          }}
                          className="w-full cursor-move rounded-2xl border border-amber-200/70 bg-amber-50/60 p-4 transition hover:border-amber-300 hover:shadow-sm dark:border-amber-900/40 dark:bg-amber-500/10"
                        >
                          <div className="flex items-center justify-between gap-3">
                            <div>
                              <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{exercise.name}</p>
                              <p className="text-xs text-slate-500 dark:text-slate-300">{exercise.target}</p>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge size="sm" variant={difficultyColorMap[exercise.difficulty].badgeVariant}>
                                {difficultyColorMap[exercise.difficulty].label}
                              </Badge>
                              <button
                                type="button"
                                aria-label="Quitar de favoritos"
                                className="rounded-full p-1 text-amber-500 hover:bg-amber-100/60 dark:hover:bg-amber-500/20"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onTogglePinExercise(exercise.id);
                                }}
                              >
                                <Star className="h-4 w-4 fill-amber-400 text-amber-500" />
                              </button>
                            </div>
                          </div>
                          <p className="mt-3 text-[11px] text-slate-500 dark:text-slate-300">Equipo: {exercise.equipment}</p>
                        </div>
                      ))}
                      <div className="pt-2 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                        Todos los ejercicios
                      </div>
                    </div>
                  )}
                  {filteredUnpinnedExercises.map((exercise) => (
                    <div
                      key={exercise.id}
                      draggable
                      onDragStart={(e) => {
                        e.dataTransfer.setData('application/json', JSON.stringify({ type: 'exercise', item: exercise }));
                        onDragStart('exercise', exercise);
                      }}
                      className="w-full cursor-move rounded-2xl border border-slate-200/70 bg-white/90 p-4 transition hover:border-emerald-300 hover:shadow-md dark:border-slate-800/70 dark:bg-slate-950/60 dark:hover:border-emerald-500/40"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{exercise.name}</p>
                          <p className="text-xs text-slate-500 dark:text-slate-300">{exercise.target}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge size="sm" variant={difficultyColorMap[exercise.difficulty].badgeVariant}>
                            {difficultyColorMap[exercise.difficulty].label}
                          </Badge>
                          <button
                            type="button"
                            aria-label="Marcar como favorito"
                            className="rounded-full p-1 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                            onClick={(e) => {
                              e.stopPropagation();
                              onTogglePinExercise(exercise.id);
                            }}
                          >
                            <Star className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                      <p className="mt-3 text-[11px] text-slate-500 dark:text-slate-300">Equipo: {exercise.equipment}</p>
                    </div>
                  ))}
                </>
              )}
            </div>
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
  followUpNotes: FollowUpNote[];
  isAddingNote: boolean;
  newNoteContent: string;
  onStartAddNote: () => void;
  onCancelAddNote: () => void;
  onChangeNewNoteContent: (value: string) => void;
  onSaveNewNote: () => void;
  editingNoteId: string | null;
  onSetEditingNoteId: (id: string | null) => void;
  onEditNote: (id: string, newContent: string) => void;
  onDeleteNote: (id: string) => void;
  activeView: EditorView;
  customFormulaCount: number;
  onOpenFormulaManager: () => void;
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
  followUpNotes,
  isAddingNote,
  newNoteContent,
  onStartAddNote,
  onCancelAddNote,
  onChangeNewNoteContent,
  onSaveNewNote,
  editingNoteId,
  onSetEditingNoteId,
  onEditNote,
  onDeleteNote,
  activeView,
  customFormulaCount,
  onOpenFormulaManager,
}: SummarySidebarProps) {
  return (
    !isCollapsed && (
      <aside className="w-full flex-shrink-0 lg:w-[340px] xl:w-[360px]">
        <Card className="space-y-6 border border-slate-200/70 bg-white/95 p-6 shadow-lg dark:border-slate-800/70 dark:bg-slate-950/60">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Resumen</p>
              <h3 className="mt-1 text-sm font-semibold text-slate-900 dark:text-slate-100">Hoy</h3>
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
                <label className="text-xs font-medium text-slate-600 dark:text-slate-300 w-20">Sesiones:</label>
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
                <label className="text-xs font-medium text-slate-600 dark:text-slate-300 w-20">Duración:</label>
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
                <label className="text-xs font-medium text-slate-600 dark:text-slate-300 w-20">Calorías:</label>
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
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400 mb-3">Progreso</p>
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
            <div className="flex items-center gap-2 mb-3">
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
                    <Sparkles className="h-4 w-4 text-indigo-500 mt-0.5 flex-shrink-0" />
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

          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <StickyNote className="h-4 w-4 text-emerald-500" />
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Notas de seguimiento</p>
              </div>
              {!isAddingNote && (
                <Button
                  variant="ghost"
                  size="sm"
                  leftIcon={<PlusCircle className="h-3.5 w-3.5" />}
                  onClick={onStartAddNote}
                  className="h-auto px-2 py-1 text-xs"
                >
                  Nueva
                </Button>
              )}
            </div>

            {isAddingNote && (
              <div className="mb-3 rounded-xl border border-emerald-200/70 bg-emerald-50/50 p-3 dark:border-emerald-800/70 dark:bg-emerald-500/10">
                <textarea
                  value={newNoteContent}
                  onChange={(e) => onChangeNewNoteContent(e.target.value)}
                  placeholder="Escribe una nota de seguimiento..."
                  className="w-full min-h-[80px] rounded-lg border border-emerald-200 bg-white px-3 py-2 text-xs text-slate-700 placeholder:text-slate-400 focus:border-emerald-400 focus:outline-none dark:border-emerald-800 dark:bg-slate-950 dark:text-slate-200"
                  autoFocus
                />
                <div className="mt-2 flex items-center justify-end gap-2">
                  <Button variant="ghost" size="sm" onClick={onCancelAddNote} className="h-auto px-2 py-1 text-xs">
                    Cancelar
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={onSaveNewNote}
                    disabled={!newNoteContent.trim()}
                    className="h-auto px-2 py-1 text-xs"
                  >
                    Guardar
                  </Button>
                </div>
              </div>
            )}

            <div className="space-y-2 max-h-[300px] overflow-y-auto">
              {followUpNotes.length > 0 ? (
                followUpNotes.map((note) => (
                  <div
                    key={note.id}
                    className="group relative rounded-xl border border-slate-200/70 bg-white/90 p-3 text-sm transition hover:border-emerald-300 hover:shadow-sm dark:border-slate-800/70 dark:bg-slate-950/60 dark:hover:border-emerald-500/40"
                  >
                    {editingNoteId === note.id ? (
                      <div>
                        <textarea
                          defaultValue={note.content}
                          onBlur={(e) => {
                            if (e.target.value.trim() !== note.content) {
                              onEditNote(note.id, e.target.value);
                            } else {
                              onSetEditingNoteId(null);
                            }
                          }}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                              e.currentTarget.blur();
                            }
                            if (e.key === 'Escape') {
                              onSetEditingNoteId(null);
                            }
                          }}
                          className="w-full min-h-[60px] rounded-lg border border-emerald-200 bg-white px-2 py-1.5 text-xs text-slate-700 focus:border-emerald-400 focus:outline-none dark:border-emerald-800 dark:bg-slate-900 dark:text-slate-200"
                          autoFocus
                        />
                        <p className="mt-1 text-[10px] text-slate-400">Presiona Cmd/Ctrl+Enter para guardar, Esc para cancelar</p>
                      </div>
                    ) : (
                      <>
                        <p className="text-xs text-slate-700 dark:text-slate-300 whitespace-pre-wrap break-words">{note.content}</p>
                        <p className="mt-1.5 text-[10px] text-slate-400">
                          {new Date(note.createdAt).toLocaleDateString('es-ES', {
                            day: 'numeric',
                            month: 'short',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>
                        <div className="absolute top-2 right-2 flex items-center gap-1 opacity-0 transition group-hover:opacity-100">
                          <button
                            type="button"
                            onClick={() => onSetEditingNoteId(note.id)}
                            className="rounded p-1 text-slate-400 transition hover:bg-slate-100 hover:text-indigo-600 dark:hover:bg-slate-800"
                            aria-label="Editar nota"
                          >
                            <Edit2 className="h-3 w-3" />
                          </button>
                          <button
                            type="button"
                            onClick={() => onDeleteNote(note.id)}
                            className="rounded p-1 text-slate-400 transition hover:bg-slate-100 hover:text-red-600 dark:hover:bg-slate-800"
                            aria-label="Eliminar nota"
                          >
                            <Trash2 className="h-3 w-3" />
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                ))
              ) : (
                <div className="rounded-xl border border-dashed border-slate-200/70 bg-slate-50 p-4 text-center dark:border-slate-800/70 dark:bg-slate-900/40">
                  <StickyNote className="mx-auto h-6 w-6 text-slate-300 mb-2" />
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    No hay notas de seguimiento. Añade una para recordar ajustes acordados con el cliente.
                  </p>
                </div>
              )}
            </div>
          </div>
        </Card>
      </aside>
    )
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
  const [showPreview, setShowPreview] = useState(false);
  const [filtrosAvanzados, setFiltrosAvanzados] = useState({
    modalidad: '',
    intensidad: '',
    duracionMin: '',
    duracionMax: '',
    equipamiento: '',
    tagsPersonalizados: [] as string[],
  });
  const [reglasInteligentes, setReglasInteligentes] = useState<ReglaInteligente[]>([]);
  const [aplicarReglasAuto, setAplicarReglasAuto] = useState(true);
  
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

  // Cargar reglas inteligentes al montar
  useEffect(() => {
    setReglasInteligentes(obtenerReglas());
  }, []);

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
            iconLeft={Undo2}
            className="h-8"
          >
            Deshacer
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleRedo}
            disabled={!historyInfo.canRedo}
            iconLeft={Redo2}
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
            iconLeft={Bookmark}
            className="h-8"
          >
            Presets ({presets.length})
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setShowSavePresetModal(true)}
            disabled={selectedBlocks.size === 0 || !selectedReplacement}
            iconLeft={BookmarkPlus}
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
                        iconLeft={CheckSquare}
                      >
                        Aplicar
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeletePreset(preset.id)}
                        iconLeft={Trash2}
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

// Componente para el modal de Batch Training
type BatchTrainingModalProps = {
  weeklyPlan: Record<DayKey, DayPlan>;
  weekDays: ReadonlyArray<DayKey>;
  onApplyRules: (updatedPlan: Record<DayKey, DayPlan>) => void;
  onClose: () => void;
};

type BatchRule = {
  id: string;
  type: 'modify-intensity' | 'modify-duration' | 'add-rest' | 'change-modality';
  condition: {
    modality?: string;
    day?: string;
    intensity?: string;
  };
  action: {
    intensity?: string;
    durationModifier?: number;
    restMinutes?: number;
    newModality?: string;
  };
  enabled: boolean;
};

function BatchTrainingModal({ weeklyPlan, weekDays, onApplyRules, onClose }: BatchTrainingModalProps) {
  const [rules, setRules] = useState<BatchRule[]>([
    {
      id: '1',
      type: 'modify-intensity',
      condition: { modality: 'Strength' },
      action: { intensity: 'RPE 8' },
      enabled: false,
    },
    {
      id: '2',
      type: 'modify-duration',
      condition: { modality: 'MetCon' },
      action: { durationModifier: 5 },
      enabled: false,
    },
    {
      id: '3',
      type: 'add-rest',
      condition: {},
      action: { restMinutes: 2 },
      enabled: false,
    },
  ]);

  const toggleRule = (ruleId: string) => {
    setRules((prev) => prev.map((rule) => (rule.id === ruleId ? { ...rule, enabled: !rule.enabled } : rule)));
  };

  const updateRule = (ruleId: string, updates: Partial<BatchRule>) => {
    setRules((prev) => prev.map((rule) => (rule.id === ruleId ? { ...rule, ...updates } : rule)));
  };

  const applyRules = () => {
    const updatedPlan: Record<DayKey, DayPlan> = { ...weeklyPlan };
    const enabledRules = rules.filter((rule) => rule.enabled);

    weekDays.forEach((day) => {
      const dayPlan = updatedPlan[day];

      const updatedSessions = dayPlan.sessions.map((session: DayPlan['sessions'][number]) => {
        let updatedSession = { ...session };

        enabledRules.forEach((rule) => {
          // Verificar condiciones
          const matchesCondition =
            (!rule.condition.modality || session.modality === rule.condition.modality) &&
            (!rule.condition.day || day === rule.condition.day) &&
            (!rule.condition.intensity || session.intensity.includes(rule.condition.intensity));

          if (matchesCondition) {
            // Aplicar acciones
            if (rule.type === 'modify-intensity' && rule.action.intensity) {
              updatedSession = { ...updatedSession, intensity: rule.action.intensity };
            }

            if (rule.type === 'modify-duration' && rule.action.durationModifier) {
              const currentDuration = parseInt(session.duration) || 0;
              const newDuration = Math.max(5, currentDuration + rule.action.durationModifier);
              updatedSession = { ...updatedSession, duration: `${newDuration} min` };
            }

            if (rule.type === 'change-modality' && rule.action.newModality) {
              updatedSession = { ...updatedSession, modality: rule.action.newModality };
            }

            if (rule.type === 'add-rest' && rule.action.restMinutes) {
              updatedSession = {
                ...updatedSession,
                notes: `${session.notes || ''} [Descanso: ${rule.action.restMinutes} min]`.trim(),
              };
            }
          }
        });

        return updatedSession;
      });

      updatedPlan[day] = {
        ...dayPlan,
        sessions: updatedSessions,
      };
    });

    onApplyRules(updatedPlan);
  };

  const ruleTypes = [
    { value: 'modify-intensity', label: 'Modificar intensidad' },
    { value: 'modify-duration', label: 'Modificar duración' },
    { value: 'change-modality', label: 'Cambiar modalidad' },
    { value: 'add-rest', label: 'Añadir descanso' },
  ];

  const modalities = ['Strength', 'MetCon', 'Cardio', 'Mobility', 'Core', 'Recovery', 'Accessory', 'Plyo'];

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-200/70 bg-slate-50 p-4 text-sm dark:border-slate-800/70 dark:bg-slate-900/40">
        <p className="text-slate-700 dark:text-slate-300">
          Configura reglas para aplicar ediciones masivas automáticas al plan semanal. Las reglas se aplicarán a todos
          los bloques que cumplan las condiciones especificadas.
        </p>
      </div>

      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-100">Reglas configuradas</h3>
        {rules.map((rule) => (
          <Card
            key={rule.id}
            className={`border p-4 dark:bg-slate-950/60 ${
              rule.enabled
                ? 'border-indigo-500 bg-indigo-50/50 dark:border-indigo-400 dark:bg-indigo-500/10'
                : 'border-slate-200/70 bg-white/95 dark:border-slate-800/70'
            }`}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3 flex-1">
                <button
                  type="button"
                  onClick={() => toggleRule(rule.id)}
                  className="mt-1"
                >
                  {rule.enabled ? (
                    <CheckSquare className="h-5 w-5 text-indigo-500" />
                  ) : (
                    <Square className="h-5 w-5 text-slate-400" />
                  )}
                </button>
                <div className="flex-1 space-y-3">
                  <div className="flex items-center gap-3">
                    <Select
                      options={ruleTypes}
                      value={rule.type}
                      onChange={(e) => updateRule(rule.id, { type: e.target.value as BatchRule['type'] })}
                      className="flex-1"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-medium text-slate-600 dark:text-slate-300 mb-1 block">
                        Condición: Modalidad
                      </label>
                      <Select
                        options={[{ label: 'Cualquiera', value: '' }, ...modalities.map((m) => ({ label: m, value: m }))]}
                        value={rule.condition.modality || ''}
                        onChange={(e) =>
                          updateRule(rule.id, { condition: { ...rule.condition, modality: e.target.value || undefined } })
                        }
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-slate-600 dark:text-slate-300 mb-1 block">
                        Condición: Día
                      </label>
                      <Select
                        options={[
                          { label: 'Cualquier día', value: '' },
                          ...weekDays.map((d) => ({ label: d, value: d })),
                        ]}
                        value={rule.condition.day || ''}
                        onChange={(e) =>
                          updateRule(rule.id, { condition: { ...rule.condition, day: e.target.value || undefined } })
                        }
                      />
                    </div>
                  </div>
                  {rule.type === 'modify-intensity' && (
                    <div>
                      <label className="text-xs font-medium text-slate-600 dark:text-slate-300 mb-1 block">
                        Nueva intensidad
                      </label>
                      <Input
                        value={rule.action.intensity || ''}
                        onChange={(e) => updateRule(rule.id, { action: { ...rule.action, intensity: e.target.value } })}
                        placeholder="Ej: RPE 8"
                      />
                    </div>
                  )}
                  {rule.type === 'modify-duration' && (
                    <div>
                      <label className="text-xs font-medium text-slate-600 dark:text-slate-300 mb-1 block">
                        Modificar duración (minutos)
                      </label>
                      <Input
                        type="number"
                        value={rule.action.durationModifier || 0}
                        onChange={(e) =>
                          updateRule(rule.id, {
                            action: { ...rule.action, durationModifier: parseInt(e.target.value) || 0 },
                          })
                        }
                        placeholder="Ej: +5 o -5"
                      />
                    </div>
                  )}
                  {rule.type === 'change-modality' && (
                    <div>
                      <label className="text-xs font-medium text-slate-600 dark:text-slate-300 mb-1 block">
                        Nueva modalidad
                      </label>
                      <Select
                        options={modalities.map((m) => ({ label: m, value: m }))}
                        value={rule.action.newModality || ''}
                        onChange={(e) =>
                          updateRule(rule.id, { action: { ...rule.action, newModality: e.target.value } })
                        }
                      />
                    </div>
                  )}
                  {rule.type === 'add-rest' && (
                    <div>
                      <label className="text-xs font-medium text-slate-600 dark:text-slate-300 mb-1 block">
                        Minutos de descanso
                      </label>
                      <Input
                        type="number"
                        value={rule.action.restMinutes || 0}
                        onChange={(e) =>
                          updateRule(rule.id, {
                            action: { ...rule.action, restMinutes: parseInt(e.target.value) || 0 },
                          })
                        }
                        placeholder="Ej: 2"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="flex items-center justify-end gap-2">
        <Button variant="ghost" onClick={onClose}>
          Cancelar
        </Button>
        <Button
          variant="secondary"
          onClick={applyRules}
          disabled={rules.filter((r) => r.enabled).length === 0}
        >
          Aplicar reglas ({rules.filter((r) => r.enabled).length} activas)
        </Button>
      </div>
    </div>
  );
}

export default function ProgramasDeEntrenoEditorPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeView, setActiveView] = useState<EditorView>('weekly');
  const [selectedDay, setSelectedDay] = useState<DayKey>('Lunes');
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
  const [isTagManagerOpen, setIsTagManagerOpen] = useState(false);
  const [isBulkAutomationOpen, setIsBulkAutomationOpen] = useState(false);
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
  const [equipmentFilter, setEquipmentFilter] = useState<string>(() => {
    try {
      const saved = localStorage.getItem('programasEditor_equipmentFilter');
      return saved || 'todos';
    } catch {
      return 'todos';
    }
  });
  const [categoryFilter, setCategoryFilter] = useState<string>(() => {
    try {
      return localStorage.getItem('programasEditor_categoryFilter') || 'todos';
    } catch {
      return 'todos';
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

  // Estado para notas de seguimiento
  const [followUpNotes, setFollowUpNotes] = useState<FollowUpNote[]>(() => {
    try {
      const raw = localStorage.getItem('followUpNotes');
      return raw ? (JSON.parse(raw) as FollowUpNote[]) : [];
    } catch {
      return [];
    }
  });
  const [isAddingNote, setIsAddingNote] = useState(false);
  const [newNoteContent, setNewNoteContent] = useState('');
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);

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

  const templateExamples = useMemo(
    () => [
      {
        id: 'hypertrophy-4d',
        name: 'Hipertrofia · 4 días',
        focus: 'Upper / Lower alterno',
        duration: '45-60 min',
        difficulty: 'Media' as const,
      },
      {
        id: 'fat-loss-hiit',
        name: 'Pérdida grasa HIIT',
        focus: 'Circuitos + Finisher',
        duration: '35-40 min',
        difficulty: 'Dificil' as const,
      },
      {
        id: 'mobility-reset',
        name: 'Reset movilidad & core',
        focus: 'Estabilidad + respiración',
        duration: '30 min',
        difficulty: 'Facil' as const,
      },
    ],
    [],
  );

  const exerciseExamples = useMemo(
    () => [
      {
        id: 'front-squat',
        name: 'Front squat con pausa',
        target: 'Cuádriceps · Core',
        equipment: 'Barra olímpica',
        difficulty: 'Dificil' as const,
      },
      {
        id: 'pullup-last',
        name: 'Dominadas lastre progresivo',
        target: 'Espalda · Bíceps',
        equipment: 'Chaleco lastre',
        difficulty: 'Dificil' as const,
      },
      {
        id: 'kb-complex',
        name: 'Complex kettlebell 6 movimientos',
        target: 'Full body · Metcon',
        equipment: 'Kettlebell 16-20kg',
        difficulty: 'Media' as const,
      },
      {
        id: 'tempo-pushup',
        name: 'Push-ups tempo 3-1-3',
        target: 'Pecho · Estabilidad',
        equipment: 'Peso corporal',
        difficulty: 'Facil' as const,
      },
    ],
    [],
  );

  const selectedDayPlan = weeklyPlan[selectedDay];
  const pinnedTemplates = useMemo(
    () => templateExamples.filter((t) => pinnedTemplateIds.includes(t.id)),
    [templateExamples, pinnedTemplateIds],
  );
  const unpinnedTemplates = useMemo(
    () => templateExamples.filter((t) => !pinnedTemplateIds.includes(t.id)),
    [templateExamples, pinnedTemplateIds],
  );
  const filteredPinnedTemplates = useMemo(() => {
    return pinnedTemplates.filter((t) => {
      const matchesSearch = t.name.toLowerCase().includes(librarySearch.toLowerCase());
      const matchesCategory =
        categoryFilter === 'todos' ||
        t.focus?.toLowerCase().includes(categoryFilter.toLowerCase());
      return matchesSearch && matchesCategory;
    });
  }, [pinnedTemplates, librarySearch, categoryFilter]);
  const filteredUnpinnedTemplates = useMemo(() => {
    return unpinnedTemplates.filter((t) => {
      const matchesSearch = t.name.toLowerCase().includes(librarySearch.toLowerCase());
      const matchesCategory =
        categoryFilter === 'todos' ||
        t.focus?.toLowerCase().includes(categoryFilter.toLowerCase());
      return matchesSearch && matchesCategory;
    });
  }, [unpinnedTemplates, librarySearch, categoryFilter]);
  const uniqueEquipments = useMemo(() => {
    const all = Array.from(new Set(exerciseExamples.map((e) => e.equipment)));
    return ['Todos los equipos', ...all];
  }, [exerciseExamples]);
  const filteredExercises = useMemo(() => {
    const bySearch = exerciseExamples.filter((e) =>
      e.name.toLowerCase().includes(librarySearch.toLowerCase()),
    );
    if (equipmentFilter === 'todos') return bySearch;
    return bySearch.filter((e) =>
      e.equipment.toLowerCase().includes(equipmentFilter.toLowerCase()),
    );
  }, [exerciseExamples, librarySearch, equipmentFilter]);
  const pinnedExercises = useMemo(
    () => exerciseExamples.filter((e) => pinnedExerciseIds.includes(e.id)),
    [exerciseExamples, pinnedExerciseIds],
  );
  const unpinnedExercises = useMemo(
    () => exerciseExamples.filter((e) => !pinnedExerciseIds.includes(e.id)),
    [exerciseExamples, pinnedExerciseIds],
  );
  const filteredPinnedExercises = useMemo(() => {
    const bySearch = pinnedExercises.filter((e) =>
      e.name.toLowerCase().includes(librarySearch.toLowerCase()),
    );
    if (equipmentFilter === 'todos') return bySearch;
    return bySearch.filter((e) =>
      e.equipment.toLowerCase().includes(equipmentFilter.toLowerCase()),
    );
  }, [pinnedExercises, librarySearch, equipmentFilter]);
  const filteredUnpinnedExercises = useMemo(() => {
    const bySearch = unpinnedExercises.filter((e) =>
      e.name.toLowerCase().includes(librarySearch.toLowerCase()),
    );
    if (equipmentFilter === 'todos') return bySearch;
    return bySearch.filter((e) =>
      e.equipment.toLowerCase().includes(equipmentFilter.toLowerCase()),
    );
  }, [unpinnedExercises, librarySearch, equipmentFilter]);
  const pinnedTemplatesCount = pinnedTemplates.length;
  const pinnedExercisesCount = pinnedExercises.length;

  const parseDurationInMinutes = useCallback((duration: string) => {
    const match = duration.match(/\d+/);
    return match ? Number(match[0]) : 0;
  }, []);

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
    }),
    [],
  );

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

  // Funciones para manejar notas de seguimiento
  const saveNotesToStorage = useCallback((notes: FollowUpNote[]) => {
    try {
      localStorage.setItem('followUpNotes', JSON.stringify(notes));
    } catch {
      // ignore persistence errors
    }
  }, []);

  const handleAddNote = useCallback(() => {
    if (!newNoteContent.trim()) return;
    const newNote: FollowUpNote = {
      id: Date.now().toString(),
      content: newNoteContent.trim(),
      createdAt: new Date().toISOString(),
    };
    const updatedNotes = [newNote, ...followUpNotes];
    setFollowUpNotes(updatedNotes);
    saveNotesToStorage(updatedNotes);
    setNewNoteContent('');
    setIsAddingNote(false);
  }, [newNoteContent, followUpNotes, saveNotesToStorage]);

  const handleEditNote = useCallback(
    (noteId: string, newContent: string) => {
      const updatedNotes = followUpNotes.map((note) =>
        note.id === noteId ? { ...note, content: newContent.trim() } : note
      );
      setFollowUpNotes(updatedNotes);
      saveNotesToStorage(updatedNotes);
      setEditingNoteId(null);
    },
    [followUpNotes, saveNotesToStorage]
  );

  const handleDeleteNote = useCallback(
    (noteId: string) => {
      const updatedNotes = followUpNotes.filter((note) => note.id !== noteId);
      setFollowUpNotes(updatedNotes);
      saveNotesToStorage(updatedNotes);
    },
    [followUpNotes, saveNotesToStorage]
  );

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

  const handleEquipmentFilterChange = useCallback((value: string) => {
    setEquipmentFilter(value);
    try {
      localStorage.setItem('programasEditor_equipmentFilter', value);
    } catch {
      // ignore persistence errors
    }
  }, []);

  const handleCategoryFilterChange = useCallback((value: string) => {
    setCategoryFilter(value);
    try {
      localStorage.setItem('programasEditor_categoryFilter', value);
    } catch {
      // ignore persistence errors
    }
  }, []);

  const handleResetManualTargets = useCallback(() => {
    updateManualWeeklyTargets({ sessions: null, duration: null, calories: null });
  }, [updateManualWeeklyTargets]);

  const handleStartAddNote = useCallback(() => setIsAddingNote(true), []);

  const handleCancelAddNote = useCallback(() => {
    setIsAddingNote(false);
    setNewNoteContent('');
  }, []);

  const handleChangeNewNoteContent = useCallback((value: string) => setNewNoteContent(value), []);

  const handleSetEditingNoteId = useCallback((noteId: string | null) => setEditingNoteId(noteId), []);

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
    (_type: 'template' | 'exercise', _item: TemplateExample | ExerciseExample) => {
      // Placeholder for analytics or contextual hints
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
          onOpenFitCoach={() => setIsFitCoachOpen(true)}
          onOpenSubstitutions={() => setIsSubstitutionsOpen(true)}
          onOpenBatchTraining={() => setIsBatchTrainingOpen(true)}
          onOpenCompartirChat={() => setIsCompartirChatOpen(true)}
          onOpenBuscarSustituir={() => setIsBuscarSustituirOpen(true)}
          onOpenTagManager={() => setIsTagManagerOpen(true)}
          onOpenCharts={() => setIsChartsOpen(true)}
          onOpenLayoutSurvey={() => setIsLayoutSurveyOpen(true)}
          onOpenBulkAutomation={() => setIsBulkAutomationOpen(true)}
          onSaveDraft={handleOpenSaveDraftModal}
          lastSaveTime={lastSaveTime}
        />

        {/* View selector */}
        <ViewSelector activeView={activeView} onChange={(view) => setActiveView(view)} />

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
            equipmentFilter={equipmentFilter}
            onChangeEquipmentFilter={handleEquipmentFilterChange}
            categoryFilter={categoryFilter}
            onChangeCategoryFilter={handleCategoryFilterChange}
            uniqueEquipments={uniqueEquipments}
            filteredPinnedTemplates={filteredPinnedTemplates}
            filteredUnpinnedTemplates={filteredUnpinnedTemplates}
            filteredPinnedExercises={filteredPinnedExercises}
            filteredUnpinnedExercises={filteredUnpinnedExercises}
            filteredExercises={filteredExercises}
            pinnedTemplatesCount={pinnedTemplatesCount}
            pinnedExercisesCount={pinnedExercisesCount}
            onTogglePinTemplate={togglePinTemplate}
            onTogglePinExercise={togglePinExercise}
            onDragStart={handleLibraryDragStart}
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
            followUpNotes={followUpNotes}
            isAddingNote={isAddingNote}
            newNoteContent={newNoteContent}
            onStartAddNote={handleStartAddNote}
            onCancelAddNote={handleCancelAddNote}
            onChangeNewNoteContent={handleChangeNewNoteContent}
            onSaveNewNote={handleAddNote}
            editingNoteId={editingNoteId}
            onSetEditingNoteId={handleSetEditingNoteId}
            onEditNote={handleEditNote}
            onDeleteNote={handleDeleteNote}
            activeView={activeView}
            customFormulaCount={customFormulas.length}
            onOpenFormulaManager={() => setIsFormulaManagerOpen(true)}
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
          onReplaceBlocks={(replacements) => {
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
          onApplyRules={(updatedPlan) => {
            setWeeklyPlan(updatedPlan);
            setIsBatchTrainingOpen(false);
          }}
          onClose={() => setIsBatchTrainingOpen(false)}
        />
      </Modal>

      {/* Modal: Compartir Extractos del Chat */}
      <CompartirExtractosChat
        open={isCompartirChatOpen}
        onOpenChange={setIsCompartirChatOpen}
        clienteId={selectedClient.id}
        clienteNombre={selectedClient.nombre}
        programaId="current-program"
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

      {/* Modal: Automatización Masiva */}
      <BulkAutomationFlow
        open={isBulkAutomationOpen}
        onOpenChange={setIsBulkAutomationOpen}
        weeklyPlan={weeklyPlan}
        weekDays={weekDays}
        onUpdatePlan={(updatedPlan) => {
          setWeeklyPlan(updatedPlan);
        }}
      />
    </div>
  );
}
