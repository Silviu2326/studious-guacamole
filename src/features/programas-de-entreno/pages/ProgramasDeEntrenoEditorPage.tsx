import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  CalendarCheck,
  CalendarRange,
  ChevronLeft,
  ChevronRight,
  FileSpreadsheet,
  Flame,
  Library,
  PlusCircle,
  Save,
  Search,
  Sparkles,
} from 'lucide-react';
import { Button, Card, Tabs, Badge, Input, Select } from '../../../components/componentsreutilizables';

type EditorView = 'weekly' | 'daily' | 'excel';

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

const weekDays = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
const timeSlots = ['06:00', '08:00', '10:00', '12:00', '16:00', '18:00', '20:00'];

export default function ProgramasDeEntrenoEditorPage() {
  const navigate = useNavigate();
  const [activeView, setActiveView] = useState<EditorView>('weekly');
  const [selectedDay, setSelectedDay] = useState('Lunes');
  const [leftCollapsed, setLeftCollapsed] = useState(false);
  const [rightCollapsed, setRightCollapsed] = useState(false);

  const dailyBlocks = useMemo(
    () => [
      { id: 'warmup', title: 'Calentamiento dinámico', duration: '10 min', focus: 'Mobility' },
      { id: 'main', title: 'Entrenamiento fuerza full body', duration: '35 min', focus: 'Strength' },
      { id: 'finish', title: 'Finisher HIIT', duration: '10 min', focus: 'Cardio' },
      { id: 'stretch', title: 'Stretching guiado', duration: '8 min', focus: 'Recovery' },
    ],
    [],
  );

  const rightPanelContent = useMemo(() => {
    if (activeView === 'weekly') {
      return {
        title: 'Resumen semanal',
        description: 'Carga, objetivos y puntos críticos de la semana seleccionada.',
        metrics: [
          { label: 'Microciclo', value: 'Semana 3 · Hipertrofia' },
          { label: 'Volumen total', value: '44 series' },
          { label: 'Intensidad media', value: 'RPE 7.5' },
          { label: 'Sesiones cardio', value: '2 moderadas' },
        ],
      };
    }

    if (activeView === 'daily') {
      return {
        title: `Detalle día · ${selectedDay}`,
        description: 'Ajusta repeticiones, cargas objetivo y feedback del cliente para esta sesión.',
        metrics: [
          { label: 'Bloques', value: `${dailyBlocks.length}` },
          { label: 'Duración total', value: '63 min' },
          { label: 'Focus', value: 'Fuerza + Metcon' },
          { label: 'Notas cliente', value: 'Prefiere kettlebell swings' },
        ],
      };
    }

    return {
      title: 'Importar / Exportar',
      description: 'Gestiona plantillas Excel, sincroniza con otras apps o descarga reporte.',
      metrics: [
        { label: 'Formato activo', value: 'CSV · Plantilla híbrida' },
        { label: 'Última importación', value: 'hoy · 08:42' },
        { label: 'Validaciones', value: '3 ajustes pendientes' },
        { label: 'Integraciones', value: 'Google Sheets, Notion' },
      ],
    };
  }, [activeView, dailyBlocks.length, selectedDay]);

  const renderCanvas = () => {
    if (activeView === 'weekly') {
      return (
        <div className="grid gap-4 md:grid-cols-7">
          {weekDays.map((day) => (
            <Card
              key={day}
              className="group min-h-[180px] border border-slate-200/80 bg-white/90 p-4 shadow-sm transition hover:border-indigo-300 hover:shadow-lg dark:border-slate-800/80 dark:bg-slate-950/50"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-100">{day}</h3>
                <Badge size="sm" variant="secondary">
                  3 bloques
                </Badge>
              </div>
              <div className="mt-3 space-y-2 text-xs text-slate-600 dark:text-slate-300">
                <p>• Fuerza tren superior (AMRAP)</p>
                <p>• Trabajo core y estabilidad</p>
                <p>• Cardio interválico (20’)</p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="mt-4 w-full opacity-0 transition group-hover:opacity-100"
                onClick={() => {
                  setActiveView('daily');
                  setSelectedDay(day);
                }}
              >
                Ver detalle
              </Button>
            </Card>
          ))}
        </div>
      );
    }

    if (activeView === 'daily') {
      return (
        <div className="space-y-4">
          {dailyBlocks.map((block) => (
            <Card
              key={block.id}
              className="flex flex-col gap-3 border border-slate-200/80 bg-white/95 p-5 shadow-sm hover:border-emerald-300 hover:shadow-lg dark:border-slate-800/80 dark:bg-slate-950/60"
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">{block.title}</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-300">Foco: {block.focus}</p>
                </div>
                <Badge size="sm" variant="green">
                  {block.duration}
                </Badge>
              </div>
              <div className="flex flex-wrap gap-3 text-xs text-slate-500 dark:text-slate-300">
                <span className="rounded-full bg-slate-100 px-3 py-1 dark:bg-slate-800">3 ejercicios</span>
                <span className="rounded-full bg-slate-100 px-3 py-1 dark:bg-slate-800">RPE objetivo 7</span>
                <span className="rounded-full bg-slate-100 px-3 py-1 dark:bg-slate-800">Tempo controlado</span>
              </div>
            </Card>
          ))}
        </div>
      );
    }

    return (
      <Card className="border border-dashed border-slate-300/80 bg-white/95 p-8 text-center dark:border-slate-700/80 dark:bg-slate-950/50">
        <div className="mx-auto max-w-xl space-y-4 text-slate-600 dark:text-slate-300">
          <FileSpreadsheet className="mx-auto h-12 w-12 text-indigo-400" />
          <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
            Gestiona tu plan desde una vista estilo Excel
          </h3>
          <p className="text-sm">
            Importa o exporta sesiones, copia y pega bloques completos y sincroniza con otras herramientas. Próximamente
            podrás editar directamente celdas con fórmulas personalizadas.
          </p>
          <div className="flex justify-center gap-3">
            <Button variant="primary" size="sm">
              Importar plantilla
            </Button>
            <Button variant="secondary" size="sm">
              Descargar ejemplo
            </Button>
          </div>
        </div>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100/80 px-4 py-8 dark:from-[#050815] dark:via-[#0b1120] dark:to-[#020617]">
      <div className="mx-auto flex max-w-[1500px] flex-col gap-6">
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
          <aside
            className={`relative flex w-full flex-col gap-4 transition-all duration-300 lg:flex-shrink-0 ${
              rightCollapsed ? 'lg:w-16' : 'lg:w-[320px]'
            }`}
          >
            <button
              type="button"
              onClick={() => setRightCollapsed((prev) => !prev)}
              className="absolute -left-3 top-4 flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 shadow-sm transition hover:border-indigo-300 hover:text-indigo-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300"
              aria-label={rightCollapsed ? 'Expandir panel derecho' : 'Colapsar panel derecho'}
            >
              {rightCollapsed ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
            </button>

            {rightCollapsed ? (
              <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-slate-200/70 bg-white/95 p-3 text-center shadow-sm dark:border-slate-800/70 dark:bg-slate-950/60">
                <Sparkles className="h-5 w-5 text-indigo-500" />
                <span className="text-[11px] font-medium text-slate-500 dark:text-slate-300">Insights</span>
              </div>
            ) : (
              <>
                <Card className="border border-slate-200/70 bg-white/95 p-5 dark:border-slate-800/70 dark:bg-slate-950/60">
                  <div className="flex items-center justify-between gap-2">
                    <h2 className="text-sm font-semibold text-slate-800 dark:text-slate-100">{rightPanelContent.title}</h2>
                    <Badge size="sm" variant="secondary">
                      Modo IA
                    </Badge>
                  </div>
                  <p className="mt-2 text-xs text-slate-500 dark:text-slate-300">{rightPanelContent.description}</p>

                  <div className="mt-4 space-y-3 text-xs text-slate-600 dark:text-slate-300">
                    {rightPanelContent.metrics.map((metric) => (
                      <div
                        key={metric.label}
                        className="flex items-start justify-between gap-4 rounded-xl border border-slate-200/70 bg-white/90 px-3 py-2 dark:border-slate-800/70 dark:bg-slate-900/50"
                      >
                        <span className="font-medium text-slate-500 dark:text-slate-400">{metric.label}</span>
                        <span className="text-right text-slate-800 dark:text-slate-100">{metric.value}</span>
                      </div>
                    ))}
                  </div>
                </Card>

                <Card className="border border-dashed border-indigo-200/70 bg-indigo-50/50 p-5 dark:border-indigo-500/40 dark:bg-indigo-950/20">
                  <div className="flex items-center gap-2 text-sm font-semibold text-indigo-700 dark:text-indigo-100">
                    <Sparkles className="h-4 w-4" />
                    Sugerencia IA
                  </div>
                  <p className="mt-3 text-xs text-indigo-800/90 dark:text-indigo-200">
                    Detectamos bajos niveles de trabajo unilateral esta semana. Propón añadir Bulgarian split squats el jueves
                    para compensar. Además, duplica la sesión de movilidad guiada para el domingo.
                  </p>
                </Card>
              </>
            )}
          </aside>
        </div>
      </div>
    </div>
  );
}