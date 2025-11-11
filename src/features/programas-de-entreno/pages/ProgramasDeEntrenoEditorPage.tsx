import { useCallback, useMemo, useState } from 'react';
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
} from 'lucide-react';
import { Button, Card, Tabs, Badge, Input, Select } from '../../../components/componentsreutilizables';
import { WeeklyEditorView } from '../components/WeeklyEditorView';
import { DailyEditorView } from '../components/DailyEditorView';
import { ExcelSummaryView } from '../components/ExcelSummaryView';
import type { DayPlan } from '../types';

type EditorView = 'weekly' | 'daily' | 'excel';
type LibraryTab = 'templates' | 'exercises';

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

export default function ProgramasDeEntrenoEditorPage() {
  const navigate = useNavigate();
  const [activeView, setActiveView] = useState<EditorView>('weekly');
  const [selectedDay, setSelectedDay] = useState<(typeof weekDays)[number]>('Lunes');
  const [leftCollapsed, setLeftCollapsed] = useState(false);
  const [rightCollapsed, setRightCollapsed] = useState(false);
  const [libraryTab, setLibraryTab] = useState<LibraryTab>('templates');

  const currentDayIndex = weekDays.findIndex((day) => day === selectedDay);

  const goToDay = useCallback(
    (direction: -1 | 1) => {
      const nextIndex = (currentDayIndex + direction + weekDays.length) % weekDays.length;
      setSelectedDay(weekDays[nextIndex]);
    },
    [currentDayIndex],
  );

  const handleSelectDay = useCallback((day: (typeof weekDays)[number]) => {
    setSelectedDay(day);
  }, []);

  const weeklyPlan = useMemo<Record<(typeof weekDays)[number], DayPlan>>(
    () => ({
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
    }),
    [],
  );

  const templateExamples = useMemo(
    () => [
      {
        id: 'hypertrophy-4d',
        name: 'Hipertrofia · 4 días',
        focus: 'Upper / Lower alterno',
        duration: '45-60 min',
      },
      {
        id: 'fat-loss-hiit',
        name: 'Pérdida grasa HIIT',
        focus: 'Circuitos + Finisher',
        duration: '35-40 min',
      },
      {
        id: 'mobility-reset',
        name: 'Reset movilidad & core',
        focus: 'Estabilidad + respiración',
        duration: '30 min',
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
      },
      {
        id: 'pullup-last',
        name: 'Dominadas lastre progresivo',
        target: 'Espalda · Bíceps',
        equipment: 'Chaleco lastre',
      },
      {
        id: 'kb-complex',
        name: 'Complex kettlebell 6 movimientos',
        target: 'Full body · Metcon',
        equipment: 'Kettlebell 16-20kg',
      },
      {
        id: 'tempo-pushup',
        name: 'Push-ups tempo 3-1-3',
        target: 'Pecho · Estabilidad',
        equipment: 'Peso corporal',
      },
    ],
    [],
  );

  const selectedDayPlan = weeklyPlan[selectedDay];

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

  const weeklyTargets = useMemo(
    () => ({
      sessions: Math.max(3, Math.round(weeklyOverview.sessions * 0.75)),
      duration: Math.max(180, Math.round(weeklyOverview.duration * 0.85)),
      calories: Math.max(2500, Math.round(weeklyCalories * 1.1)),
    }),
    [weeklyCalories, weeklyOverview],
  );

  const todaysSessions = selectedDayPlan.sessions;
  const nextSession = todaysSessions[0];

  const renderCanvas = () => {
    if (activeView === 'weekly') {
      return (
        <WeeklyEditorView
          weekDays={weekDays}
          weeklyPlan={weeklyPlan}
          onViewDay={(day) => {
            setSelectedDay(day as (typeof weekDays)[number]);
            setActiveView('daily');
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
          onSelectDay={(day) => handleSelectDay(day as (typeof weekDays)[number])}
          onBackToWeekly={() => setActiveView('weekly')}
        />
      );
    }

    return <ExcelSummaryView weekDays={weekDays} weeklyPlan={weeklyPlan} />;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100/80 py-8 dark:from-[#050815] dark:via-[#0b1120] dark:to-[#020617]">
      <div className="flex w-full flex-col gap-6 px-4 md:px-6 lg:px-8">
        {/* Top bar */}
        <header className="rounded-3xl border border-slate-200/70 bg-white/95 px-6 py-4 shadow-sm dark:border-slate-800/70 dark:bg-slate-950/60">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" leftIcon={<ArrowLeft className="h-4 w-4" />} onClick={() => navigate(-1)}>
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
                <Button variant="ghost" size="sm" onClick={() => setRightCollapsed(false)}>
                  Restaurar panel
                </Button>
              )}
              <Button variant="ghost" size="sm" leftIcon={<Sparkles className="h-4 w-4" />}>
                Sugerir con IA
              </Button>
              <Button variant="secondary" size="sm" leftIcon={<Save className="h-4 w-4" />}>
                Guardar borrador
              </Button>
            </div>
          </div>
        </header>

        {/* View selector */}
        <Card className="border border-slate-200/70 bg-white/95 px-6 py-4 dark:border-slate-800/70 dark:bg-slate-950/60">
          <Tabs
            items={viewTabs}
            activeTab={activeView}
            onTabChange={(tabId) => setActiveView(tabId as EditorView)}
            variant="pills"
            size="sm"
            className="justify-center"
          />
        </Card>

        <div className="flex flex-col gap-6 lg:flex-row">
          {/* Left panel */}
          <aside
            className={`relative flex w-full flex-col gap-4 transition-all duration-300 lg:flex-shrink-0 ${
              leftCollapsed ? 'lg:w-16' : 'lg:w-[320px]'
            }`}
          >
            <button
              type="button"
              onClick={() => setLeftCollapsed((prev) => !prev)}
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
                      onTabChange={(tabId) => setLibraryTab(tabId as LibraryTab)}
                      variant="pills"
                      size="sm"
                    />
                  </div>

                  <div className="mt-4 space-y-3">
                    <div className="relative">
                      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                      <Input placeholder="Buscar ejercicios..." className="pl-9" />
                    </div>
                    <Select
                      options={[
                        { label: 'Todos los grupos musculares', value: 'todos' },
                        { label: 'Push (pecho, hombro, tríceps)', value: 'push' },
                        { label: 'Pull (espalda, bíceps)', value: 'pull' },
                        { label: 'Lower body', value: 'lower' },
                        { label: 'Core & estabilidad', value: 'core' },
                      ]}
                      defaultValue="todos"
                    />
                  </div>

                  <div className="mt-4 space-y-3">
                    {libraryTab === 'templates'
                      ? templateExamples.map((template) => (
                          <button
                            key={template.id}
                            type="button"
                            className="w-full rounded-2xl border border-slate-200/70 bg-white/90 p-4 text-left transition hover:border-indigo-300 hover:shadow-md dark:border-slate-800/70 dark:bg-slate-950/60 dark:hover:border-indigo-500/40"
                          >
                            <div className="flex items-center justify-between gap-3">
                              <div>
                                <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{template.name}</p>
                                <p className="text-xs text-slate-500 dark:text-slate-300">{template.focus}</p>
                              </div>
                              <Badge size="sm" variant="secondary">
                                {template.duration}
                              </Badge>
                            </div>
                            <div className="mt-3 flex flex-wrap gap-2 text-[11px] text-indigo-600 dark:text-indigo-300">
                              <span className="rounded-full bg-indigo-50 px-2 py-1 dark:bg-indigo-500/10">Personalizable</span>
                              <span className="rounded-full bg-indigo-50 px-2 py-1 dark:bg-indigo-500/10">IA ready</span>
                            </div>
                          </button>
                        ))
                      : exerciseExamples.map((exercise) => (
                          <button
                            key={exercise.id}
                            type="button"
                            className="w-full rounded-2xl border border-slate-200/70 bg-white/90 p-4 text-left transition hover:border-emerald-300 hover:shadow-md dark:border-slate-800/70 dark:bg-slate-950/60 dark:hover:border-emerald-500/40"
                          >
                            <div className="flex items-center justify-between gap-3">
                              <div>
                                <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{exercise.name}</p>
                                <p className="text-xs text-slate-500 dark:text-slate-300">{exercise.target}</p>
                              </div>
                              <Badge size="sm" variant="green">
                                Nuevo
                              </Badge>
                            </div>
                            <p className="mt-3 text-[11px] text-slate-500 dark:text-slate-300">Equipo: {exercise.equipment}</p>
                          </button>
                        ))}
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

          {/* Canvas */}
          <main className="flex-1 space-y-4">{renderCanvas()}</main>

          {/* Right panel */}
          {!rightCollapsed && (
            <aside className="w-full flex-shrink-0 lg:w-[340px] xl:w-[360px]">
              <Card className="space-y-6 border border-slate-200/70 bg-white/95 p-6 shadow-lg dark:border-slate-800/70 dark:bg-slate-950/60">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Resumen</p>
                    <h3 className="mt-1 text-sm font-semibold text-slate-900 dark:text-slate-100">Hoy</h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => setRightCollapsed(true)}
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
                      <p className="text-base font-semibold text-slate-900 dark:text-slate-100">{nextSession.block}</p>
                      <p>{nextSession.time} · {nextSession.duration}</p>
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
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Progreso</p>
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
                            <div
                              className={`h-full rounded-full bg-gradient-to-r ${item.gradient}`}
                              style={{ width: `${percentage}%` }}
                            />
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
                      <Button
                        variant="ghost"
                        size="sm"
                        className="mt-2 h-auto px-3 py-1 text-xs text-amber-600 hover:text-amber-700"
                      >
                        Reducir series
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            </aside>
          )}
        </div>
      </div>
    </div>
  );
}