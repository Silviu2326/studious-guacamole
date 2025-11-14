import { memo, useState, useMemo, useEffect } from 'react';
import { Plus, AlertCircle, Tag, CheckSquare, Square, Eye, BookOpen, Clock } from 'lucide-react';
import { Button, Badge, Select, Input } from '../../../components/componentsreutilizables';
import type { DayPlan, DaySession } from '../types';
import { InlineBlockEditor } from './InlineBlockEditor';
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
  onDropFromLibrary?: (day: string, data: { type: 'template' | 'block' | 'exercise'; item: any }) => void;
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
  // Visible days configuration
  const [maxVisibleDays, setMaxVisibleDays] = useState(() => Math.min(4, weekDays.length));
  const [dayFilterMode, setDayFilterMode] = useState<'manual' | 'weekday' | 'tag'>('manual');
  const [dayFilterValue, setDayFilterValue] = useState('');
  const [selectedDays, setSelectedDays] = useState<string[]>(() => weekDays.slice(0, Math.min(4, weekDays.length)));

  useEffect(() => {
    if (dayFilterMode !== 'manual') return;
    setSelectedDays((prev) => {
      const filtered = weekDays.filter((day) => prev.includes(day));
      const needed = Math.min(maxVisibleDays, weekDays.length);
      if (filtered.length >= needed) {
        return filtered.slice(0, needed);
      }
      const extras = weekDays.filter((day) => !filtered.includes(day)).slice(0, needed - filtered.length);
      return [...filtered, ...extras];
    });
  }, [weekDays, maxVisibleDays, dayFilterMode]);

  const daysMatchingTag = useMemo(() => {
    if (dayFilterMode !== 'tag' || !dayFilterValue) return [];
    const target = dayFilterValue.toLowerCase();
    return weekDays.filter((day) => {
      const plan = weeklyPlan[day];
      if (!plan) return false;
      const dayTags = plan.tags ?? [];
      if (dayTags.some((tag) => tag.toLowerCase().includes(target))) return true;
      return plan.sessions.some((session) =>
        session.tags?.some((tag) => tag.toLowerCase().includes(target)),
      );
    });
  }, [dayFilterMode, dayFilterValue, weekDays, weeklyPlan]);

  const daysMatchingWeekday = useMemo(() => {
    if (dayFilterMode !== 'weekday' || !dayFilterValue) return [];
    const target = dayFilterValue.toLowerCase();
    return weekDays.filter((day) => day.toLowerCase().includes(target));
  }, [dayFilterMode, dayFilterValue, weekDays]);

  const visibleDays = useMemo(() => {
    let base: readonly string[] = [];
    if (dayFilterMode === 'manual') {
      base = selectedDays.length > 0 ? selectedDays : weekDays;
    } else if (dayFilterMode === 'weekday') {
      base = daysMatchingWeekday;
    } else if (dayFilterMode === 'tag') {
      base = daysMatchingTag;
    }
    if (base.length === 0) {
      base = weekDays;
    }
    return base.slice(0, Math.min(maxVisibleDays, base.length));
  }, [selectedDays, maxVisibleDays, weekDays, dayFilterMode, daysMatchingTag, daysMatchingWeekday]);

  const cardsGridTemplate = useMemo(() => {
    if (visibleDays.length === 0) {
      return 'repeat(auto-fit, minmax(260px, 1fr))';
    }
    if (visibleDays.length <= 3) {
      return `repeat(${visibleDays.length}, minmax(280px, 1fr))`;
    }
    return 'repeat(auto-fit, minmax(260px, 1fr))';
  }, [visibleDays.length]);

  const shouldCenterGrid = visibleDays.length <= 2;

  const handleToggleVisibleDay = (day: string) => {
    if (dayFilterMode !== 'manual') return;
    setSelectedDays((prev) => {
      if (prev.includes(day)) {
        return prev.filter((d) => d !== day);
      }
      if (prev.length >= maxVisibleDays) {
        return prev;
      }
      return [...prev, day];
    });
  };
  
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
  const handleDoubleClick = (day: string, session: DaySession, field: 'series' | 'repeticiones' | 'duration' | 'intensity', e: React.MouseEvent<HTMLElement>) => {
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
          if (parsed.type === 'template' || parsed.type === 'exercise' || parsed.type === 'block' || parsed.type === 'session') {
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
            const fromIndices = (parsed.indices as number[]).sort((a, b) => a - b);
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
              const fromIndices = (parsed.indices as number[]).sort((a, b) => b - a);
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
        if (parsed.type === 'template' || parsed.type === 'exercise' || parsed.type === 'block' || parsed.type === 'session') {
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
            const fromIndices = (parsed.indices as number[]).sort((a, b) => b - a);
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
              const fromIndices = (parsed.indices as number[]).sort((a, b) => b - a);
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
        if (parsed.type === 'template' || parsed.type === 'exercise' || parsed.type === 'block' || parsed.type === 'session') {
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
     
      
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Plan semanal</h2>
      </div>

      <div className="flex flex-col gap-3 rounded-3xl border border-slate-200/70 bg-white/90 p-4 shadow-sm dark:border-slate-800/60 dark:bg-slate-950/50">
        <div className="flex flex-col">
          <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">Días visibles</span>
          <span className="text-sm text-slate-600">Compara hasta {weekDays.length} días. Actualmente mostrando {visibleDays.length}.</span>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">Modo</span>
          <div className="flex gap-2">
            {[
              { id: 'manual', label: 'Manual' },
              { id: 'weekday', label: 'Por día' },
              { id: 'tag', label: 'Por tag' },
            ].map((mode) => (
              <Button
                key={mode.id}
                variant={dayFilterMode === mode.id ? 'secondary' : 'ghost'}
                size="sm"
                className="h-8 px-3 text-xs"
                onClick={() => {
                  setDayFilterMode(mode.id as typeof dayFilterMode);
                  setDayFilterValue('');
                }}
              >
                {mode.label}
              </Button>
            ))}
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500">Máx.</span>
            <Select
              value={String(maxVisibleDays)}
              onChange={(e) => setMaxVisibleDays(Math.max(1, Number(e.target.value)))}
              options={weekDays.map((_, index) => ({
                label: `${index + 1}`,
                value: String(index + 1),
              }))}
            />
          </div>
          {dayFilterMode === 'weekday' && (
            <Input
              value={dayFilterValue}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDayFilterValue(e.target.value)}
              placeholder="Filtrar por nombre (ej. Lunes)"
              className="w-48"
            />
          )}
          {dayFilterMode === 'tag' && (
            <Input
              value={dayFilterValue}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDayFilterValue(e.target.value)}
              placeholder="Tag (ej. fuerza)"
              className="w-48"
            />
          )}
        </div>
        {dayFilterMode === 'manual' && (
          <div className="flex flex-wrap gap-2">
            {weekDays.map((day) => {
              const isSelected = visibleDays.includes(day);
              const disabled = !isSelected && visibleDays.length >= maxVisibleDays;
              return (
                <Button
                  key={day}
                  variant={isSelected ? 'secondary' : 'ghost'}
                  size="sm"
                  className="h-8 px-3 text-xs"
                  disabled={disabled}
                  onClick={() => handleToggleVisibleDay(day)}
                >
                  {day.slice(0, 3)}
                </Button>
              );
            })}
          </div>
        )}
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

      <div
        className={`grid gap-6 auto-rows-fr ${shouldCenterGrid ? 'justify-center' : ''}`}
        style={{ gridTemplateColumns: cardsGridTemplate }}
      >
        {visibleDays.map((day, dayIndex) => {
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
              className={`group flex h-full flex-col overflow-hidden rounded-3xl border shadow-lg transition-all hover:shadow-xl ${
                hasExceeded
                  ? 'border-red-300 bg-gradient-to-br from-red-50/80 to-white ring-2 ring-red-200'
                  : dragOverDay === day
                  ? 'border-indigo-400 bg-gradient-to-br from-indigo-50/80 to-white ring-2 ring-indigo-200'
                  : 'border-slate-200 bg-gradient-to-br from-white to-slate-50/50 hover:border-indigo-300'
              }`}
            >
              {/* Day Header - Integrado con gradiente */}
              <div className={`relative overflow-hidden rounded-t-3xl bg-gradient-to-br ${dayGradients[dayIndex % dayGradients.length]} px-5 py-4`}>
                <div className="relative z-10 flex items-start justify-between gap-3">
                  <div className="flex flex-1 flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-700">{day}</span>
                      {hasExceeded && (
                        <AlertCircle className="h-4 w-4 text-red-600" aria-label="Excede objetivos semanales" />
                      )}
                    </div>
                    <h3 className="text-base font-bold text-slate-900 leading-tight">{plan?.focus ?? 'Sin plan'}</h3>
                    {plan?.tags && plan.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        {plan.tags.map((tag) => (
                          <Badge key={tag} size="sm" variant="secondary" className="bg-white/80 text-[10px] backdrop-blur-sm">
                            <Tag className="mr-1 h-2.5 w-2.5" />
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => onViewDay(day)}
                    className="flex-shrink-0 rounded-lg bg-white/80 p-2 text-slate-600 transition hover:bg-white hover:text-indigo-600 hover:shadow-md"
                    title="Ver detalle del día"
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                </div>
                
                {/* Day Stats - Compactos en header */}
                <div className="relative z-10 mt-3 flex flex-wrap items-center gap-2">
                  <div className="flex items-center gap-1.5 rounded-lg bg-white/90 px-2.5 py-1.5 text-xs font-medium text-slate-700 backdrop-blur-sm">
                    <BookOpen className="h-3.5 w-3.5" />
                    <span className="font-semibold">{planSessions.length}</span>
                    <span className="hidden sm:inline">{planSessions.length === 1 ? 'sesión' : 'sesiones'}</span>
                  </div>
                  <div className="flex items-center gap-1.5 rounded-lg bg-indigo-100/90 px-2.5 py-1.5 text-xs font-medium text-indigo-700 backdrop-blur-sm">
                    <Clock className="h-3.5 w-3.5" />
                    <span className="font-semibold">{totalMinutes}</span>
                    <span>min</span>
                  </div>
                  {Boolean(totalSeries) && (
                    <div className="flex items-center gap-1.5 rounded-lg bg-emerald-100/90 px-2.5 py-1.5 text-xs font-medium text-emerald-700 backdrop-blur-sm">
                      <CheckSquare className="h-3.5 w-3.5" />
                      <span className="font-semibold">{totalSeries}</span>
                      <span>series</span>
                    </div>
                  )}
                  {Boolean(totalReps) && (
                    <div className="flex items-center gap-1.5 rounded-lg bg-amber-100/90 px-2.5 py-1.5 text-xs font-medium text-amber-700 backdrop-blur-sm">
                      <Plus className="h-3.5 w-3.5" />
                      <span className="font-semibold">{totalReps}</span>
                      <span>reps</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Day Content */}
              <div className="flex flex-1 flex-col p-4">
                {planSessions.length === 0 ? (
                  <div className="flex flex-1 items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50/50 p-6 text-center">
                    <div className="space-y-2">
                      <div className="mx-auto h-12 w-12 rounded-full bg-slate-200 flex items-center justify-center">
                        <Plus className="h-6 w-6 text-slate-400" />
                      </div>
                      <p className="text-sm font-medium text-slate-600">Sin sesiones</p>
                      <p className="text-xs text-slate-500">Crea o arrastra bloques aquí</p>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-1 flex-col gap-3 overflow-hidden">
                    <div className="flex-1 space-y-2.5 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-transparent">
                      {planSessions.map((session, idx) => {
                        const isSelected = selectedSessions.has(session.id);
                        const TipoIcon = getTipoEntrenamientoIcon(session.tipoEntrenamiento);
                        const sessionColorClass = getSessionColorClass(session.tipoEntrenamiento);
                        
                        return (
                          <div
                            key={session.id}
                            className={`group/session relative flex cursor-move gap-3 rounded-xl border-2 bg-white p-3 shadow-sm transition-all hover:shadow-md ${
                              isSelected
                                ? 'border-indigo-500 bg-indigo-50 ring-2 ring-indigo-200'
                                : sessionColorClass || 'border-slate-200 hover:border-indigo-300 hover:shadow-md'
                            }`}
                            draggable
                            onDragStart={handleDragStart(day, idx)}
                            onDragOver={handleDragOver(day)}
                            onDrop={handleDrop(day, idx)}
                            onClick={(e) => {
                              if (e.ctrlKey || e.metaKey) {
                                e.stopPropagation();
                                toggleSessionSelection(session.id);
                              }
                            }}
                          >
                            {/* Checkbox - Más sutil */}
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleSessionSelection(session.id);
                              }}
                              className={`mt-0.5 flex-shrink-0 transition ${
                                isSelected ? 'text-indigo-600' : 'text-slate-400 opacity-0 group-hover/session:opacity-100'
                              }`}
                            >
                              {isSelected ? (
                                <CheckSquare className="h-4 w-4" />
                              ) : (
                                <Square className="h-4 w-4" />
                              )}
                            </button>

                            {/* Icon/Number */}
                            {session.tipoEntrenamiento ? (
                              <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-gradient-to-br from-slate-50 to-white shadow-sm">
                                <TipoIcon className="h-4 w-4 text-slate-700" />
                              </div>
                            ) : (
                              <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-slate-100 to-slate-50 text-xs font-bold text-slate-600 shadow-sm">
                                {idx + 1}
                              </div>
                            )}

                            {/* Session Content */}
                            <div className="min-w-0 flex-1 space-y-1.5">
                              <div className="flex items-start justify-between gap-2">
                                <h4 className="text-sm font-semibold leading-snug text-slate-900 line-clamp-2 break-words">
                                  {session.block}
                                </h4>
                              </div>
                              
                              {/* Session Metadata - Más compacto */}
                              <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-slate-600">
                                {session.time && (
                                  <span className="flex items-center gap-1 font-medium">
                                    <Clock className="h-3 w-3 text-slate-400" />
                                    {session.time}
                                  </span>
                                )}
                                <span
                                  className="cursor-pointer rounded-md px-1.5 py-0.5 font-medium text-indigo-600 transition hover:bg-indigo-50"
                                  onDoubleClick={(e) => handleDoubleClick(day, session, 'duration', e)}
                                  title="Doble clic para editar"
                                >
                                  {session.duration}
                                </span>
                                <span className="text-slate-400">•</span>
                                <span className="font-medium">{session.modality}</span>
                                {(session.series || session.repeticiones) && (
                                  <>
                                    <span className="text-slate-400">•</span>
                                    <span
                                      className="cursor-pointer rounded-md px-1.5 py-0.5 font-medium text-emerald-600 transition hover:bg-emerald-50"
                                      onDoubleClick={(e) => handleDoubleClick(day, session, 'series', e)}
                                      title="Doble clic para editar"
                                    >
                                      {session.series || '?'}s
                                    </span>
                                    {session.repeticiones && (
                                      <span
                                        className="cursor-pointer rounded-md px-1.5 py-0.5 font-medium text-amber-600 transition hover:bg-amber-50"
                                        onDoubleClick={(e) => handleDoubleClick(day, session, 'repeticiones', e)}
                                        title="Doble clic para editar"
                                      >
                                        x{session.repeticiones}
                                      </span>
                                    )}
                                  </>
                                )}
                                <span className="text-slate-400">•</span>
                                <span
                                  className="cursor-pointer rounded-md px-1.5 py-0.5 font-medium text-slate-700 transition hover:bg-slate-100"
                                  onDoubleClick={(e) => handleDoubleClick(day, session, 'intensity', e)}
                                  title="Doble clic para editar"
                                >
                                  {session.intensity}
                                </span>
                              </div>

                              {/* Tags - Más compactos */}
                              {(session.tipoEntrenamiento || session.gruposMusculares?.length || session.tags?.length) && (
                                <div className="flex flex-wrap gap-1">
                                  {session.tipoEntrenamiento && (
                                    <Badge size="sm" variant="secondary" className="text-[10px] font-medium">
                                      <TipoIcon className="mr-1 h-2.5 w-2.5" />
                                      {session.tipoEntrenamiento}
                                    </Badge>
                                  )}
                                  {session.gruposMusculares?.map((grupo, gIdx) => {
                                    const GrupoIcon = getGrupoMuscularIcon(grupo);
                                    return (
                                      <Badge
                                        key={gIdx}
                                        size="sm"
                                        variant="secondary"
                                        className={`text-[10px] font-medium ${getGrupoMuscularColor(grupo)}`}
                                      >
                                        <GrupoIcon className="mr-1 h-2.5 w-2.5" />
                                        {grupo}
                                      </Badge>
                                    );
                                  })}
                                  {session.tags?.map((tag) => (
                                    <Badge key={tag} size="sm" variant="secondary" className="text-[10px] font-medium">
                                      <Tag className="mr-1 h-2.5 w-2.5" />
                                      {tag}
                                    </Badge>
                                  ))}
                                </div>
                              )}

                              {/* Drag hint - Solo en hover */}
                              <div className="flex items-center justify-between pt-1">
                                <span className="text-[10px] text-slate-400 opacity-0 transition group-hover/session:opacity-100">
                                  Arrastra para reordenar
                                </span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
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

