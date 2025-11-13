import { memo, useState, useMemo, useEffect } from 'react';
import { Plus, AlertCircle, Tag, CheckSquare, Square, Eye, EyeOff, Calendar, ChevronLeft, ChevronRight, BookOpen, Clock } from 'lucide-react';
import { Button, Badge, Select } from '../../../components/componentsreutilizables';
import type { DayPlan, DaySession } from '../types';
import { InlineBlockEditor } from './InlineBlockEditor';
import { LoadTrackingChart } from './LoadTrackingChart';
import { BulkActionsPanel } from './BulkActionsPanel';
// User Story 2: Importar utilidades de colores e iconos dinámicos
import {
  getTipoEntrenamientoIcon,
  getSessionColorClass,
  getGrupoMuscularColor,
  getGrupoMuscularIcon,
} from '../utils/sessionVisuals';

type OverlayType = 'none' | 'previous' | 'next' | 'reference';

type WeeklyEditorViewProps = {
  weekDays: readonly string[];
  weeklyPlan: Record<string, DayPlan>;
  onViewDay: (day: string) => void;
  onReorderSessions?: (day: string, newSessions: DayPlan['sessions']) => void;
  weeklyTargets?: {
    duration: number;
    calories: number;
  };
  onDropFromLibrary?: (day: string, data: { type: 'template' | 'exercise'; item: any }) => void;
  onUpdateSession?: (day: string, sessionId: string, updatedSession: DaySession) => void;
  // User Story 2: Bulk actions props
  onBulkDuplicate?: (sessionIds: string[]) => void;
  onBulkMove?: (sessionIds: string[], targetDay: string) => void;
  onBulkReduceVolume?: (sessionIds: string[], percentage: number) => void;
  // User Story 1: Props para superposición de semana
  overlayWeekPlan?: Record<string, DayPlan>;
  onRequestOverlayWeek?: (type: OverlayType) => void;
  availableReferenceWeeks?: Array<{ id: string; label: string; date: string }>;
};

const dayGradients = [
  'from-amber-200 via-rose-100 to-indigo-100',
  'from-indigo-200 via-amber-100 to-emerald-100',
  'from-emerald-200 via-indigo-100 to-rose-100',
  'from-amber-200 via-rose-100 to-indigo-100',
  'from-indigo-200 via-amber-100 to-emerald-100',
  'from-emerald-200 via-indigo-100 to-rose-100',
  'from-amber-200 via-rose-100 to-indigo-100',
];

const parseFirstNumber = (value: string) => {
  const match = value.match(/\d+(?:[.,]\d+)?/);
  return match ? Number(match[0].replace(',', '.')) : null;
};

const getNumericValue = (value: string | number | null | undefined) => {
  if (typeof value === 'number') return value;
  if (typeof value === 'string') {
    return parseFirstNumber(value) ?? 0;
  }
  return 0;
};

function WeeklyEditorViewComponent({ 
  weekDays, 
  weeklyPlan, 
  onViewDay, 
  onReorderSessions, 
  weeklyTargets, 
  onDropFromLibrary, 
  onUpdateSession,
  onBulkDuplicate,
  onBulkMove,
  onBulkReduceVolume,
  overlayWeekPlan,
  onRequestOverlayWeek,
  availableReferenceWeeks = [],
}: WeeklyEditorViewProps) {
  const [dragState, setDragState] = useState<{ day: string | null; fromIndex: number | null }>({ day: null, fromIndex: null });
  const [dragOverDay, setDragOverDay] = useState<string | null>(null);
  // User Story 1: Multi-select state
  const [selectedSessions, setSelectedSessions] = useState<Set<string>>(new Set());
  const [isMultiDragActive, setIsMultiDragActive] = useState(false);
  // User Story: Inline editing state
  const [editingSession, setEditingSession] = useState<{ day: string; sessionId: string; field: 'series' | 'repeticiones' | 'duration' | 'intensity'; position: { x: number; y: number } } | null>(null);
  // User Story 2: Selection filter state
  const [selectionFilter, setSelectionFilter] = useState<{ type: 'modality' | 'day' | 'tag'; value: string } | null>(null);
  // User Story 1: Overlay state
  const [overlayType, setOverlayType] = useState<OverlayType>('none');
  const [selectedReferenceWeek, setSelectedReferenceWeek] = useState<string>('');
  
  // Calcular si cada día excede los objetivos semanales
  const dayExceedsTargets = useMemo(() => {
    const exceeds: Record<string, { duration: boolean; calories: boolean }> = {};
    
    weekDays.forEach((day) => {
      const plan = weeklyPlan[day];
      if (!plan || !weeklyTargets) {
        exceeds[day] = { duration: false, calories: false };
        return;
      }
      
      const totalMinutes = plan.sessions.reduce((total, session) => total + (parseFirstNumber(session.duration) ?? 0), 0);
      const calories = Math.round(totalMinutes * 8);
      
      exceeds[day] = {
        duration: totalMinutes > weeklyTargets.duration,
        calories: calories > weeklyTargets.calories,
      };
    });
    
    return exceeds;
  }, [weekDays, weeklyPlan, weeklyTargets]);

  // User Story 1: Toggle session selection
  const toggleSessionSelection = (sessionId: string) => {
    setSelectedSessions((prev) => {
      const next = new Set(prev);
      if (next.has(sessionId)) {
        next.delete(sessionId);
      } else {
        next.add(sessionId);
      }
      return next;
    });
  };

  // User Story 1: Clear all selections
  const clearSelection = () => {
    setSelectedSessions(new Set());
    setIsMultiDragActive(false);
    setSelectionFilter(null);
  };

  // User Story 2: Apply selection filter
  useEffect(() => {
    if (selectionFilter) {
      const newSelection = new Set<string>();
      weekDays.forEach((day) => {
        const plan = weeklyPlan[day];
        if (!plan) return;
        
        plan.sessions.forEach((session) => {
          let matches = false;
          
          switch (selectionFilter.type) {
            case 'modality':
              matches = session.modality === selectionFilter.value;
              break;
            case 'day':
              matches = day === selectionFilter.value;
              break;
            case 'tag':
              matches = session.tags?.includes(selectionFilter.value) ?? false;
              break;
          }
          
          if (matches) {
            newSelection.add(session.id);
          }
        });
      });
      
      setSelectedSessions(newSelection);
    }
  }, [selectionFilter, weeklyPlan, weekDays]);

  // User Story 2: Handle bulk actions
  const handleBulkDuplicate = (sessionIds: string[]) => {
    onBulkDuplicate?.(sessionIds);
  };

  const handleBulkMove = (sessionIds: string[], targetDay: string) => {
    onBulkMove?.(sessionIds, targetDay);
  };

  const handleBulkReduceVolume = (sessionIds: string[], percentage: number) => {
    onBulkReduceVolume?.(sessionIds, percentage);
  };

  // User Story: Handle double-click for inline editing
  const handleDoubleClick = (day: string, session: DaySession, field: 'series' | 'repeticiones' | 'duration' | 'intensity', e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    const rect = e.currentTarget.getBoundingClientRect();
    setEditingSession({
      day,
      sessionId: session.id,
      field,
      position: { x: rect.left, y: rect.top + rect.height },
    });
  };

  // User Story: Handle inline edit save
  const handleInlineSave = (updatedSession: DaySession) => {
    if (editingSession) {
      onUpdateSession?.(editingSession.day, editingSession.sessionId, updatedSession);
      setEditingSession(null);
    }
  };

  // User Story: Handle inline edit cancel
  const handleInlineCancel = () => {
    setEditingSession(null);
  };

  // User Story 1: Handle multi-select drag start
  const handleMultiDragStart = (day: string, selectedIndices: number[]) => (e: React.DragEvent<HTMLDivElement>) => {
    if (selectedIndices.length === 0) return;
    
    setIsMultiDragActive(true);
    const sessions = weeklyPlan[day]?.sessions || [];
    const selectedSessions = selectedIndices.map(idx => sessions[idx]).filter(Boolean);
    
    e.dataTransfer.setData('application/json', JSON.stringify({
      type: 'multi-session',
      day,
      indices: selectedIndices,
      sessions: selectedSessions,
    }));
    e.dataTransfer.effectAllowed = 'move';
    
    // Visual feedback
    e.dataTransfer.setDragImage(e.currentTarget, 0, 0);
  };

  // User Story 1: Handle single drag start (updated to check for multi-select)
  const handleDragStart = (day: string, index: number) => (e: React.DragEvent<HTMLDivElement>) => {
    const session = weeklyPlan[day]?.sessions?.[index];
    if (!session) return;

    // If this session is part of a multi-select, use multi-drag
    if (selectedSessions.has(session.id) && selectedSessions.size > 1) {
      const sessions = weeklyPlan[day]?.sessions || [];
      const selectedIndices = sessions
        .map((s, idx) => selectedSessions.has(s.id) ? idx : -1)
        .filter(idx => idx !== -1)
        .sort((a, b) => a - b);
      
      handleMultiDragStart(day, selectedIndices)(e);
      return;
    }

    // Single drag
    setDragState({ day, fromIndex: index });
    e.dataTransfer.setData('text/plain', JSON.stringify({ day, index }));
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (day: string) => (e: React.DragEvent<HTMLDivElement>) => {
    // User Story 1: Check for multi-session drag
    const multiData = e.dataTransfer.getData('application/json');
    if (multiData) {
      try {
        const parsed = JSON.parse(multiData);
        if (parsed.type === 'multi-session') {
          e.preventDefault();
          e.dataTransfer.dropEffect = 'move';
          setDragOverDay(day);
          return;
        }
      } catch {
        // Continue to other checks
      }
    }

    if (dragState.day === day) {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
    } else {
      // User Story 2: Permitir drop desde biblioteca
      const data = e.dataTransfer.getData('application/json');
      if (data) {
        try {
          const parsed = JSON.parse(data);
          if (parsed.type === 'template' || parsed.type === 'exercise' || parsed.type === 'session') {
            e.preventDefault();
            e.dataTransfer.dropEffect = 'copy';
            setDragOverDay(day);
          }
        } catch {
          // Ignore parse errors
        }
      }
    }
  };

  const handleDragLeave = () => {
    setDragOverDay(null);
  };

  const handleDrop = (day: string, toIndex: number) => (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOverDay(null);
    
    // User Story 1: Handle multi-session drop
    const multiData = e.dataTransfer.getData('application/json');
    if (multiData) {
      try {
        const parsed = JSON.parse(multiData);
        if (parsed.type === 'multi-session') {
          const { day: fromDay, sessions: draggedSessions } = parsed;
          const targetSessions = weeklyPlan[day]?.sessions || [];
          
          if (fromDay === day) {
            // Reordering within same day
            const fromIndices = parsed.indices.sort((a: number, b: number) => a - b);
            const newSessions = [...targetSessions];
            
            // Remove selected sessions (in reverse order to maintain indices)
            const removed: typeof draggedSessions = [];
            for (let i = fromIndices.length - 1; i >= 0; i--) {
              removed.unshift(newSessions.splice(fromIndices[i], 1)[0]);
            }
            
            // Adjust toIndex if needed
            let adjustedToIndex = toIndex;
            for (const idx of fromIndices) {
              if (idx < toIndex) adjustedToIndex--;
            }
            
            // Insert at new position maintaining order
            newSessions.splice(adjustedToIndex, 0, ...removed);
            onReorderSessions?.(day, newSessions);
          } else {
            // Moving to different day
            const newSessions = [...targetSessions];
            newSessions.splice(toIndex, 0, ...draggedSessions);
            onReorderSessions?.(day, newSessions);
            
            // Remove from source day
            if (onReorderSessions && weeklyPlan[fromDay]) {
              const sourceSessions = [...weeklyPlan[fromDay].sessions];
              const fromIndices = parsed.indices.sort((a: number, b: number) => b - a);
              fromIndices.forEach(idx => sourceSessions.splice(idx, 1));
              onReorderSessions(fromDay, sourceSessions);
            }
          }
          
          clearSelection();
          setDragState({ day: null, fromIndex: null });
          return;
        }
      } catch {
        // Continue to other checks
      }
    }
    
    // User Story 2: Verificar si es un drop desde biblioteca
    const libraryData = e.dataTransfer.getData('application/json');
    if (libraryData) {
      try {
        const parsed = JSON.parse(libraryData);
        if (parsed.type === 'template' || parsed.type === 'exercise' || parsed.type === 'session') {
          onDropFromLibrary?.(day, parsed);
          clearSelection();
          return;
        }
      } catch {
        // Ignore parse errors, continue with normal drop
      }
    }
    
    // Drop normal para reordenar sesiones (single)
    const fromIndex = dragState.day === day ? dragState.fromIndex : null;
    if (fromIndex == null || fromIndex === toIndex) {
      clearSelection();
      return;
    }
    const sessions = weeklyPlan[day]?.sessions || [];
    const newSessions = [...sessions];
    const [moved] = newSessions.splice(fromIndex, 1);
    newSessions.splice(toIndex, 0, moved);
    onReorderSessions?.(day, newSessions);
    setDragState({ day: null, fromIndex: null });
    clearSelection();
  };

  // User Story 2: Handler para drop en el área del día (no solo en sesiones)
  const handleDayDrop = (day: string) => (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOverDay(null);
    
    // User Story 1: Handle multi-session drop at end of day
    const multiData = e.dataTransfer.getData('application/json');
    if (multiData) {
      try {
        const parsed = JSON.parse(multiData);
        if (parsed.type === 'multi-session') {
          const { day: fromDay, sessions: draggedSessions } = parsed;
          const targetSessions = weeklyPlan[day]?.sessions || [];
          
          if (fromDay === day) {
            // Reordering within same day - append to end
            const fromIndices = parsed.indices.sort((a: number, b: number) => b - a);
            const newSessions = [...targetSessions];
            const removed: typeof draggedSessions = [];
            
            for (const idx of fromIndices) {
              removed.unshift(newSessions.splice(idx, 1)[0]);
            }
            
            newSessions.push(...removed);
            onReorderSessions?.(day, newSessions);
          } else {
            // Moving to different day - append to end
            const newSessions = [...targetSessions, ...draggedSessions];
            onReorderSessions?.(day, newSessions);
            
            // Remove from source day
            if (onReorderSessions && weeklyPlan[fromDay]) {
              const sourceSessions = [...weeklyPlan[fromDay].sessions];
              const fromIndices = parsed.indices.sort((a: number, b: number) => b - a);
              fromIndices.forEach(idx => sourceSessions.splice(idx, 1));
              onReorderSessions(fromDay, sourceSessions);
            }
          }
          
          clearSelection();
          return;
        }
      } catch {
        // Continue to other checks
      }
    }
    
    const libraryData = e.dataTransfer.getData('application/json');
    if (libraryData) {
      try {
        const parsed = JSON.parse(libraryData);
        if (parsed.type === 'template' || parsed.type === 'exercise' || parsed.type === 'session') {
          onDropFromLibrary?.(day, parsed);
          clearSelection();
        }
      } catch {
        // Ignore parse errors
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* User Story 1: Load Tracking Chart */}
      {weeklyTargets && (
        <LoadTrackingChart
          weekDays={weekDays}
          weeklyPlan={weeklyPlan}
          weeklyTargets={weeklyTargets}
        />
      )}
      
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Plan semanal</h2>
      </div>

      {/* User Story 2: Bulk Actions Panel */}
      <BulkActionsPanel
        selectedSessions={selectedSessions}
        weeklyPlan={weeklyPlan}
        weekDays={weekDays}
        onDuplicate={handleBulkDuplicate}
        onMove={handleBulkMove}
        onReduceVolume={handleBulkReduceVolume}
        onClearSelection={clearSelection}
        onApplyFilter={setSelectionFilter}
      />

      <div className="overflow-x-auto">
        <div className="grid min-w-max grid-flow-col gap-3 pb-1 sm:min-w-0 sm:grid-flow-row sm:grid-cols-3 lg:grid-cols-7">
          {weekDays.map((day, index) => (
            <button
              key={day}
              type="button"
              onClick={() => onViewDay(day)}
              className={`flex min-w-[160px] flex-col items-start justify-between rounded-3xl bg-gradient-to-br ${dayGradients[index % dayGradients.length]} px-5 py-4 text-left text-slate-800 shadow-md transition hover:-translate-y-1 hover:shadow-xl sm:min-w-0`}
            >
              <span className="text-xs font-semibold uppercase tracking-wide text-slate-600">{day}</span>
              <div className="mt-3 flex items-center gap-2 text-sm text-slate-700">
                <Calendar className="h-4 w-4" />
                <span>Semana · Día {index + 1}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4 2xl:grid-cols-7 auto-rows-fr">
        {weekDays.map((day) => {
          const plan = weeklyPlan[day];
          const planSessions = plan?.sessions || [];
          const exceeds = dayExceedsTargets[day];
          const hasExceeded = exceeds && (exceeds.duration || exceeds.calories);
          const totalMinutes = planSessions.reduce(
            (total, session) => total + (parseFirstNumber(String(session.duration ?? '')) ?? 0),
            0
          );
          const totalSeries = planSessions.reduce(
            (total, session) => total + getNumericValue(session.series),
            0
          );
          const totalReps = planSessions.reduce(
            (total, session) => total + getNumericValue(session.repeticiones),
            0
          );

          return (
            <div
              key={day}
              onDragOver={handleDragOver(day)}
              onDragLeave={handleDragLeave}
              onDrop={handleDayDrop(day)}
              className={`flex h-full flex-col rounded-3xl border p-4 shadow-lg transition hover:-translate-y-1 hover:shadow-xl ${
                hasExceeded
                  ? 'border-red-300 bg-red-50/50 ring-2 ring-red-200'
                  : dragOverDay === day
                  ? 'border-indigo-400 bg-indigo-50/50 ring-2 ring-indigo-200'
                  : 'border-slate-200 bg-white'
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex flex-1 flex-col gap-1">
                  <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
                    <span>{day}</span>
                    {hasExceeded && (
                      <AlertCircle className="h-4 w-4 text-red-500" title="Excede objetivos semanales" />
                    )}
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900">{plan?.focus ?? 'Sin plan'}</h3>
                  {plan?.tags && plan.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {plan.tags.map((tag) => (
                        <Badge key={tag} size="xs" variant="secondary" className="text-[10px]">
                          <Tag className="mr-1 h-2.5 w-2.5" />
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
                <div className="flex flex-col items-end gap-1 text-xs text-slate-500">
                  <div className="flex items-center gap-1 rounded-full bg-slate-100 px-2 py-1 font-medium text-slate-600">
                    <BookOpen className="h-4 w-4" />
                    {planSessions.length} {planSessions.length === 1 ? 'sesión' : 'sesiones'}
                  </div>
                  <div className="flex items-center gap-1 rounded-full bg-indigo-50 px-2 py-1 text-indigo-600">
                    <Clock className="h-4 w-4" />
                    {totalMinutes} min
                  </div>
                  {Boolean(totalSeries) && (
                    <div className="flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-1 text-emerald-600">
                      <CheckSquare className="h-4 w-4" />
                      {totalSeries} series
                    </div>
                  )}
                  {Boolean(totalReps) && (
                    <div className="flex items-center gap-1 rounded-full bg-amber-50 px-2 py-1 text-amber-600">
                      <Plus className="h-4 w-4" />
                      {totalReps} reps
                    </div>
                  )}
                  {hasExceeded && (
                    <div className="rounded-full bg-red-100 px-2 py-1 text-xs font-semibold text-red-600">
                      Objetivo superado
                    </div>
                  )}
                </div>
              </div>
              <div className="mt-4 flex flex-1 flex-col">
                {planSessions.length === 0 ? (
                  <div className="flex flex-1 items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white p-4 text-center text-slate-500">
                    Sin sesiones. Crea o arrastra bloques.
                  </div>
                ) : (
                  <div className="flex flex-1 flex-col gap-3 overflow-hidden">
                    <div className="flex-1 space-y-3 overflow-y-auto pr-1 md:pr-0">
                      {planSessions.map((session, idx) => {
                        const isSelected = selectedSessions.has(session.id);
                        // User Story 2: Obtener icono y color según tipo de entrenamiento
                        const TipoIcon = getTipoEntrenamientoIcon(session.tipoEntrenamiento);
                        const sessionColorClass = getSessionColorClass(session.tipoEntrenamiento);
                        
                        return (
                          <div
                            key={session.id}
                            className={`group flex cursor-move flex-col gap-3 rounded-xl border p-3 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md ${
                              isSelected
                                ? 'border-indigo-500 bg-indigo-50 ring-2 ring-indigo-200'
                                : sessionColorClass || 'border-slate-200 bg-white hover:border-indigo-300'
                            }`}
                            draggable
                            onDragStart={handleDragStart(day, idx)}
                            onDragOver={handleDragOver(day)}
                            onDrop={handleDrop(day, idx)}
                            onClick={(e) => {
                              // User Story 1: Toggle selection on click (with Ctrl/Cmd for multi-select)
                              if (e.ctrlKey || e.metaKey) {
                                e.stopPropagation();
                                toggleSessionSelection(session.id);
                              }
                            }}
                          >
                            <div className="flex flex-wrap items-start gap-3">
                              {/* User Story 1: Checkbox for multi-select */}
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleSessionSelection(session.id);
                                }}
                                className="flex-shrink-0 text-indigo-600 transition hover:text-indigo-700"
                              >
                                {isSelected ? (
                                  <CheckSquare className="h-5 w-5" />
                                ) : (
                                  <Square className="h-5 w-5 text-slate-400" />
                                )}
                              </button>
                              {/* User Story 2: Icono de tipo de entrenamiento o número de índice */}
                              {session.tipoEntrenamiento ? (
                                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white shadow-sm">
                                  <TipoIcon className="h-5 w-5 text-slate-600" />
                                </div>
                              ) : (
                                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl bg-slate-100 text-xs font-semibold text-slate-500">
                                  {idx + 1}
                                </div>
                              )}
                              <div className="min-w-0 flex-1 space-y-1">
                                <div className="flex items-start justify-between gap-2">
                                  <div className="truncate text-sm font-semibold text-slate-900">{session.block}</div>
                                  <Button
                                    variant="ghost"
                                    size="xs"
                                    className="hidden whitespace-nowrap text-xs text-indigo-600 hover:text-indigo-700 group-hover:flex"
                                    onClick={() => onViewDay(day)}
                                    leftIcon={<Eye className="h-3.5 w-3.5" />}
                                  >
                                    Ver día
                                  </Button>
                                </div>
                                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500">
                                  {session.time && <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{session.time}</span>}
                                  <span
                                    className="cursor-pointer rounded px-1 py-0.5 transition hover:bg-indigo-100"
                                    onDoubleClick={(e) => handleDoubleClick(day, session, 'duration', e)}
                                    title="Doble clic para editar duración"
                                  >
                                    {session.duration}
                                  </span>
                                  <span className="h-1 w-1 rounded-full bg-slate-300" />
                                  <span>{session.modality}</span>
                                  {(session.series || session.repeticiones) && (
                                    <>
                                      <span className="h-1 w-1 rounded-full bg-slate-300" />
                                      <span
                                        className="cursor-pointer rounded px-1 py-0.5 transition hover:bg-indigo-100"
                                        onDoubleClick={(e) => handleDoubleClick(day, session, 'series', e)}
                                        title="Doble clic para editar series"
                                      >
                                        {session.series || '?'} series
                                      </span>
                                      {session.repeticiones && (
                                        <span
                                          className="cursor-pointer rounded px-1 py-0.5 transition hover:bg-indigo-100"
                                          onDoubleClick={(e) => handleDoubleClick(day, session, 'repeticiones', e)}
                                          title="Doble clic para editar repeticiones"
                                        >
                                          x {session.repeticiones}
                                        </span>
                                      )}
                                    </>
                                  )}
                                  <span className="h-1 w-1 rounded-full bg-slate-300" />
                                  <span
                                    className="cursor-pointer rounded px-1 py-0.5 transition hover:bg-indigo-100"
                                    onDoubleClick={(e) => handleDoubleClick(day, session, 'intensity', e)}
                                    title="Doble clic para editar intensidad"
                                  >
                                    {session.intensity}
                                  </span>
                                </div>
                                {/* User Story 2: Mostrar tipo de entrenamiento y grupos musculares */}
                                <div className="flex flex-wrap gap-1">
                                  {session.tipoEntrenamiento && (
                                    <Badge size="xs" variant="secondary" className="text-[10px]">
                                      <TipoIcon className="mr-1 h-2.5 w-2.5" />
                                      {session.tipoEntrenamiento}
                                    </Badge>
                                  )}
                                  {session.gruposMusculares && session.gruposMusculares.map((grupo, gIdx) => {
                                    const GrupoIcon = getGrupoMuscularIcon(grupo);
                                    return (
                                      <Badge
                                        key={gIdx}
                                        size="xs"
                                        variant="secondary"
                                        className={`text-[10px] ${getGrupoMuscularColor(grupo)}`}
                                      >
                                        <GrupoIcon className="mr-1 h-2.5 w-2.5" />
                                        {grupo}
                                      </Badge>
                                    );
                                  })}
                                  {session.tags && session.tags.map((tag) => (
                                    <Badge key={tag} size="xs" variant="secondary" className="text-[10px]">
                                      <Tag className="mr-1 h-2.5 w-2.5" />
                                      {tag}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center justify-between text-xs text-slate-400">
                              <span className="hidden sm:inline">Arrastra para reordenar</span>
                              <Button
                                variant="ghost"
                                size="xs"
                                className="sm:hidden text-xs text-indigo-600"
                                onClick={() => onViewDay(day)}
                                leftIcon={<Eye className="h-3.5 w-3.5" />}
                              >
                                Ver día
                              </Button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    <div className="mt-2 flex justify-end">
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-xs font-medium"
                        onClick={() => onViewDay(day)}
                        leftIcon={<Eye className="h-4 w-4" />}
                      >
                        Abrir detalle del día
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Inline Editor */}
      {editingSession && (() => {
        const dayPlan = weeklyPlan[editingSession.day];
        const session = dayPlan?.sessions.find(s => s.id === editingSession.sessionId);
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
            />
          </div>
        );
      })()}
    </div>
  );
}

export const WeeklyEditorView = memo(WeeklyEditorViewComponent);

