import { memo, useState, useMemo } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  PlusCircle,
  Clock,
  Timer,
  Flame,
  MapPin,
  Tag,
  Settings,
  Zap,
  GitCompare,
  Shuffle,
  Wrench,
  Bot,
  Trash2,
  GripVertical,
} from 'lucide-react';
import { Button, Card, Badge } from '../../../components/componentsreutilizables';
import type { DayPlan, DaySession } from '../types';
import { InlineBlockEditor } from './InlineBlockEditor';
import { IntelligentSuggestionsPanel } from './IntelligentSuggestionsPanel';
import { ExerciseComparison } from './ExerciseComparison';
import { compararEjercicio, obtenerSesionAnterior, obtenerHistorialSesiones } from '../utils/exerciseComparison';

type LibraryDragPayload = { type: 'template' | 'exercise' | 'session'; item: any };

const isLibraryDragPayload = (payload: unknown): payload is LibraryDragPayload => {
  if (!payload || typeof payload !== 'object') return false;
  const type = (payload as { type?: string }).type;
  return type === 'template' || type === 'exercise' || type === 'session';
};

type DailyEditorViewProps = {
  selectedDay: string;
  weekDays: readonly string[];
  dayPlan: DayPlan;
  onPreviousDay: () => void;
  onNextDay: () => void;
  onSelectDay: (day: string) => void;
  onBackToWeekly: () => void;
  weeklyPlan?: Record<string, DayPlan>;
  coachId?: string; // ID del coach para el sistema de aprendizaje
  onUpdateSession?: (sessionId: string, updatedSession: DaySession) => void;
  onDropFromLibrary?: (day: string, data: { type: 'template' | 'exercise' | 'session'; item: any }) => void;
};

function DailyEditorViewComponent({
  selectedDay,
  weekDays,
  dayPlan,
  onPreviousDay,
  onNextDay,
  onSelectDay,
  onBackToWeekly,
  weeklyPlan,
  coachId,
  onDropFromLibrary,
  onUpdateSession,
}: DailyEditorViewProps) {
  // User Story: Modo de edición (rápida vs completa)
  const [editMode, setEditMode] = useState<'quick' | 'full'>('quick');
  const [showSuggestions, setShowSuggestions] = useState(false);
  
  // User Story: Inline editing state
  const [editingSession, setEditingSession] = useState<{ 
    sessionId: string; 
    field: 'series' | 'repeticiones' | 'duration' | 'intensity' | 'peso' | 'tempo' | 'descanso' | 'materialAlternativo'; 
    position: { x: number; y: number };
    fullMode?: boolean;
  } | null>(null);
  
  // User Story: Comparación de ejercicios
  const [comparingExercise, setComparingExercise] = useState<string | null>(null);
  
  // Obtener historial de sesiones
  const historialSesiones = useMemo(() => obtenerHistorialSesiones(), []);

  const getExerciseMetrics = (index: number) => {
    const calories = 70 + index * 12;
    const rest = 60 + index * 15;
    return { calories, rest };
  };

  // User Story: Handle double-click for inline editing
const handleDoubleClick = (
    session: DaySession, 
    field: 'series' | 'repeticiones' | 'duration' | 'intensity' | 'peso' | 'tempo' | 'descanso' | 'materialAlternativo', 
    e: React.MouseEvent<HTMLElement>
  ) => {
    e.stopPropagation();
    const rect = e.currentTarget.getBoundingClientRect();
    setEditingSession({
      sessionId: session.id,
      field,
      position: { x: rect.left, y: rect.top + rect.height },
      fullMode: editMode === 'full',
    });
  };
  
  // User Story: Handle click en botón de edición completa
  const handleFullEdit = (session: DaySession, anchorId?: string) => {
    let rect: DOMRect | null = null;
    if (anchorId) {
      const anchor = document.getElementById(anchorId);
      if (anchor) {
        rect = anchor.getBoundingClientRect();
      }
    }
    setEditingSession({
      sessionId: session.id,
      field: 'series',
      position: rect
        ? { x: rect.left, y: rect.top + rect.height }
        : { x: window.innerWidth / 2, y: window.innerHeight / 2 },
      fullMode: true,
    });
  };
  
  // User Story: Handle comparación de ejercicio
  const handleCompareExercise = (session: DaySession) => {
    setComparingExercise(session.id);
  };
  
  // Obtener comparación del ejercicio seleccionado
  const comparacionEjercicio = useMemo(() => {
    if (!comparingExercise) return null;
    
    const session = dayPlan.sessions.find(s => s.id === comparingExercise);
    if (!session) return null;
    
    const sesionAnterior = obtenerSesionAnterior(session.id, session, historialSesiones);
    return compararEjercicio(session.id, session.block, session, sesionAnterior);
  }, [comparingExercise, dayPlan.sessions, historialSesiones]);

  // User Story: Handle inline edit save
  const handleInlineSave = (updatedSession: DaySession) => {
    if (editingSession) {
      onUpdateSession?.(editingSession.sessionId, updatedSession);
      setEditingSession(null);
    }
  };

  // User Story: Handle inline edit cancel
  const handleInlineCancel = () => {
    setEditingSession(null);
  };

  return (
    <div className="space-y-6">
      <div className="mx-auto w-full max-w-6xl overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-500 via-indigo-400 to-emerald-400 p-6 text-white shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onPreviousDay}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white/15 text-white transition hover:bg-white/25"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <div>
              <p className="text-xs uppercase tracking-wider text-indigo-100">Planificación diaria</p>
              <h2 className="text-2xl font-semibold leading-tight">{selectedDay}</h2>
              <p className="text-sm text-indigo-100/80">{dayPlan.microCycle}</p>
            </div>
            <button
              type="button"
              onClick={onNextDay}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white/15 text-white transition hover:bg-white/25"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {/* User Story: Toggle modo de edición */}
            <div className="flex items-center gap-2 rounded-lg bg-white/15 px-2 py-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setEditMode('quick')}
                className={`h-7 text-xs ${
                  editMode === 'quick'
                    ? 'bg-white text-indigo-600'
                    : 'text-white hover:bg-white/20'
                }`}
              >
                <Zap className="mr-1 h-3 w-3" />
                Rápida
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setEditMode('full')}
                className={`h-7 text-xs ${
                  editMode === 'full'
                    ? 'bg-white text-indigo-600'
                    : 'text-white hover:bg-white/20'
                }`}
              >
                <Settings className="mr-1 h-3 w-3" />
                Completa
              </Button>
            </div>
            <Button
              variant="ghost"
              size="sm"
              leftIcon={<PlusCircle className="h-4 w-4" />}
              className="bg-white/95 text-indigo-700 shadow-lg hover:bg-white hover:shadow-xl"
            >
              Nueva sesión
            </Button>
            <Button variant="ghost" size="sm" className="text-white hover:bg-white/20" onClick={onBackToWeekly}>
              Volver a semana
            </Button>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2 text-xs text-indigo-100">
          <span className="rounded-full bg-white/15 px-3 py-1 font-medium">Focus · {dayPlan.focus}</span>
          <span className="rounded-full bg-white/15 px-3 py-1 font-medium">Volumen · {dayPlan.volume}</span>
          <span className="rounded-full bg-white/15 px-3 py-1 font-medium">Intensidad · {dayPlan.intensity}</span>
          <span className="rounded-full bg-white/15 px-3 py-1 font-medium">Recuperación · {dayPlan.restorative}</span>
          {dayPlan.tags && dayPlan.tags.length > 0 && (
            <>
              {dayPlan.tags.map((tag) => (
                <span key={tag} className="flex items-center gap-1 rounded-full bg-white/15 px-3 py-1 font-medium">
                  <Tag className="h-3 w-3" />
                  {tag}
                </span>
              ))}
            </>
          )}
        </div>
      </div>

      <div className="mx-auto flex w-full max-w-6xl items-center gap-3 overflow-x-auto pb-2">
        {weekDays.map((day) => {
          const isActive = day === selectedDay;
          return (
            <button
              key={day}
              type="button"
              onClick={() => onSelectDay(day)}
              className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200/60'
                  : 'bg-white text-slate-500 shadow hover:bg-slate-100'
              }`}
            >
              {day}
            </button>
          );
        })}
      </div>

      {/* User Story 2: Intelligent Suggestions Panel */}
      <div className="mx-auto w-full max-w-6xl rounded-3xl border border-slate-200/70 bg-white/90 p-4 shadow-md">
        <button
          type="button"
          onClick={() => setShowSuggestions((prev) => !prev)}
          className="flex w-full items-center justify-between text-left text-sm font-semibold text-slate-700"
        >
          <span>Sugerencias inteligentes · {selectedDay}</span>
          {showSuggestions ? (
            <ChevronUp className="h-4 w-4 text-slate-500" />
          ) : (
            <ChevronDown className="h-4 w-4 text-slate-500" />
          )}
        </button>
        {showSuggestions ? (
          <div className="mt-4">
            <IntelligentSuggestionsPanel
              selectedDay={selectedDay}
              dayPlan={dayPlan}
              weeklyPlan={weeklyPlan}
              activeView="daily"
              coachId={coachId}
              onDragStart={(_suggestion) => {
                // Handle drag start from suggestions
              }}
              onSuggestionClick={(suggestion) => {
                if (onDropFromLibrary && isLibraryDragPayload(suggestion.draggableData)) {
                  onDropFromLibrary(selectedDay, suggestion.draggableData);
                }
              }}
              onApplySuggestion={(suggestion) => {
                if (onDropFromLibrary && isLibraryDragPayload(suggestion.draggableData)) {
                  onDropFromLibrary(selectedDay, suggestion.draggableData);
                }
              }}
              onDiscardSuggestion={(_suggestionId) => {
                // El feedback se guarda automáticamente en el componente
              }}
            />
          </div>
        ) : (
          <p className="mt-3 text-xs text-slate-500">
            Despliega para ver recomendaciones del asistente IA basadas en este día.
          </p>
        )}
      </div>

      <div className="mx-auto grid w-full max-w-6xl gap-5">
        {dayPlan.sessions.map((session, index) => {
          const fullEditAnchorId = `full-edit-${session.id}`;
          return (
          <Card key={session.id} className="overflow-hidden border-none bg-white p-6 shadow-xl">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wide text-indigo-500">Bloque {index + 1}</span>
                <h3 className="mt-1 text-xl font-semibold text-slate-900">{session.block}</h3>
                <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-slate-500">
                  <span className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-indigo-500" />
                    {session.time}
                  </span>
                  <span
                    className="flex cursor-pointer items-center gap-2 rounded px-1 hover:bg-indigo-50"
                    onDoubleClick={(e) => handleDoubleClick(session, 'duration', e)}
                    title="Doble clic para editar duración"
                  >
                    <Timer className="h-4 w-4 text-indigo-500" />
                    {session.duration}
                  </span>
                  <span className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-indigo-500" />
                    Gimnasio principal
                  </span>
                  {(session.series || session.repeticiones) && (
                    <span
                      className="flex cursor-pointer items-center gap-2 rounded px-1 hover:bg-indigo-50"
                      onDoubleClick={(e) => handleDoubleClick(session, 'series', e)}
                      title="Doble clic para editar series"
                    >
                      {session.series || '?'} series
                    </span>
                  )}
                  {session.repeticiones && (
                    <span
                      className="flex cursor-pointer items-center gap-2 rounded px-1 hover:bg-indigo-50"
                      onDoubleClick={(e) => handleDoubleClick(session, 'repeticiones', e)}
                      title="Doble clic para editar repeticiones"
                    >
                      x {session.repeticiones}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                {/* User Story: Botón de comparación */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleCompareExercise(session)}
                  className="h-8 text-xs text-indigo-600 hover:bg-indigo-50"
                  aria-label="Comparar con sesión anterior"
                >
                  <GitCompare className="mr-1 h-3 w-3" />
                  Comparar
                </Button>
                {/* User Story: Botón de edición completa */}
                {editMode === 'quick' && (
                  <div id={fullEditAnchorId}>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleFullEdit(session, fullEditAnchorId)}
                      className="h-8 text-xs text-slate-600 hover:bg-slate-100"
                      aria-label="Edición completa"
                    >
                      <Settings className="mr-1 h-3 w-3" />
                      Completa
                    </Button>
                  </div>
                )}
                <Badge size="sm" variant="secondary" className="rounded-full bg-amber-100 text-amber-600">
                  pendiente
                </Badge>
              </div>

              <div className="mt-3 flex flex-wrap items-center gap-2">
                <Button variant="ghost" size="sm" className="h-8 text-xs text-slate-600 hover:bg-slate-100">
                  <Shuffle className="mr-1 h-3.5 w-3.5 text-indigo-500" />
                  Sustituir
                </Button>
                <Button variant="ghost" size="sm" className="h-8 text-xs text-slate-600 hover:bg-slate-100">
                  <Wrench className="mr-1 h-3.5 w-3.5 text-amber-500" />
                  Variantes
                </Button>
                <Button variant="ghost" size="sm" className="h-8 text-xs text-slate-600 hover:bg-slate-100">
                  <Bot className="mr-1 h-3.5 w-3.5 text-emerald-500" />
                  IA Fix
                </Button>
                <Button variant="ghost" size="sm" className="h-8 text-xs text-rose-600 hover:bg-rose-50">
                  <Trash2 className="mr-1 h-3.5 w-3.5" />
                  Eliminar
                </Button>
                <div className="flex h-8 items-center rounded-full bg-slate-100 px-2 text-xs font-medium text-slate-500">
                  <GripVertical className="mr-1 h-3.5 w-3.5" />
                  Arrastrar
                </div>
              </div>
            </div>

            {/* User Story: Mostrar campos avanzados en modo completo */}
            {editMode === 'full' && (
              <div className="mt-3 rounded-lg bg-slate-50 p-3">
                <div className="grid grid-cols-2 gap-3 text-xs">
                  {session.peso !== undefined && (
                    <div>
                      <span className="font-medium text-slate-600">Peso:</span>{' '}
                      <span
                        className="cursor-pointer text-slate-800 hover:text-indigo-600"
                        onDoubleClick={(e) => handleDoubleClick(session, 'peso', e)}
                        title="Doble clic para editar"
                      >
                        {session.peso}kg
                      </span>
                    </div>
                  )}
                  {session.tempo && (
                    <div>
                      <span className="font-medium text-slate-600">Tempo:</span>{' '}
                      <span
                        className="cursor-pointer text-slate-800 hover:text-indigo-600"
                        onDoubleClick={(e) => handleDoubleClick(session, 'tempo', e)}
                        title="Doble clic para editar"
                      >
                        {session.tempo}
                      </span>
                    </div>
                  )}
                  {session.descanso !== undefined && (
                    <div>
                      <span className="font-medium text-slate-600">Descanso:</span>{' '}
                      <span
                        className="cursor-pointer text-slate-800 hover:text-indigo-600"
                        onDoubleClick={(e) => handleDoubleClick(session, 'descanso', e)}
                        title="Doble clic para editar"
                      >
                        {session.descanso}s
                      </span>
                    </div>
                  )}
                  {session.materialAlternativo && (
                    <div className="col-span-2">
                      <span className="font-medium text-slate-600">Material alternativo:</span>{' '}
                      <span
                        className="cursor-pointer text-slate-800 hover:text-indigo-600"
                        onDoubleClick={(e) => handleDoubleClick(session, 'materialAlternativo', e)}
                        title="Doble clic para editar"
                      >
                        {session.materialAlternativo}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-slate-500">
              <span className="rounded-full bg-slate-100 px-3 py-1 font-medium text-slate-600">Modalidad · {session.modality}</span>
              <span
                className="cursor-pointer rounded-full bg-slate-100 px-3 py-1 font-medium text-slate-600 hover:bg-indigo-100"
                onDoubleClick={(e) => handleDoubleClick(session, 'intensity', e)}
                title="Doble clic para editar intensidad"
              >
                Intensidad · {session.intensity}
              </span>
              <span className="rounded-full bg-slate-100 px-3 py-1 font-medium text-slate-600">Notas · {session.notes}</span>
              {session.tags && session.tags.length > 0 && (
                <>
                  {session.tags.map((tag) => (
                    <span key={tag} className="flex items-center gap-1 rounded-full bg-indigo-100 px-3 py-1 font-medium text-indigo-700">
                      <Tag className="h-3 w-3" />
                      {tag}
                    </span>
                  ))}
                </>
              )}
            </div>

            <div className="mt-6">
              <div className="flex items-center justify-between gap-2">
                <span className="text-sm font-semibold text-slate-700">Ejercicios ({dayPlan.summary.length})</span>
                <span className="text-xs text-slate-400">Sugeridos para este bloque</span>
              </div>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                {dayPlan.summary.map((item, summaryIndex) => {
                  const { calories, rest } = getExerciseMetrics(summaryIndex);
                  return (
                    <div
                      key={`${session.id}-summary-${summaryIndex}`}
                      className="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm transition hover:border-indigo-200 hover:bg-white"
                    >
                      <p className="text-sm font-semibold text-slate-800">{item}</p>
                      <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-slate-500">
                        <span className="flex items-center gap-1">
                          <Flame className="h-3.5 w-3.5 text-amber-500" />
                          {calories} kcal
                        </span>
                        <span className="flex items-center gap-1">
                          <Timer className="h-3.5 w-3.5 text-emerald-500" />
                          Descanso · {rest}s
                        </span>
                        <span className="flex items-center gap-1">
                          <PlusCircle className="h-3.5 w-3.5 text-indigo-500" />
                          3 series
                        </span>
                      </div>
                      <div className="mt-4 flex items-center gap-2">
                        <Button variant="ghost" size="sm" className="h-7 px-2 text-xs">
                          Editar
                        </Button>
                        <Button variant="ghost" size="sm" className="h-7 px-2 text-xs">
                          Duplicar
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </Card>
        );})}
      </div>

      {/* User Story: Comparación de ejercicios */}
      {comparacionEjercicio && (
        <div className="mx-auto mt-4 w-full max-w-6xl">
          <ExerciseComparison
            comparacion={comparacionEjercicio}
            onClose={() => setComparingExercise(null)}
          />
        </div>
      )}

      {/* Inline Editor */}
      {editingSession && (() => {
        const session = dayPlan.sessions.find(s => s.id === editingSession.sessionId);
        if (!session) return null;
        
        return (
          <div
            style={{
              position: 'fixed',
              left: `${editingSession.position.x}px`,
              top: `${editingSession.position.y}px`,
              zIndex: 1000,
            }}
          >
            <InlineBlockEditor
              session={session}
              field={editingSession.field}
              onSave={handleInlineSave}
              onCancel={handleInlineCancel}
              fullMode={editingSession.fullMode}
            />
          </div>
        );
      })()}
    </div>
  );
}

export const DailyEditorView = memo(DailyEditorViewComponent);

