import { memo, useState, useMemo, useEffect, useCallback } from 'react';
import { Plus, AlertCircle, Tag, CheckSquare, Square, Eye, BookOpen, Clock, SlidersHorizontal, Filter, ChevronUp } from 'lucide-react';
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
type ViewPreset = 'custom' | 'all' | 'weekdays' | 'weekend' | 'empty' | 'exceeded';
type DaySortMode = 'default' | 'alphabetical' | 'sessions' | 'duration';
type LayoutMode = 'auto' | 'columns' | 'vertical' | 'horizontal';
type CardSize = 'compact' | 'standard' | 'detailed';
type DragAnimationStyle = 'subtle' | 'elastic' | 'none';
type ColorCodingMode = 'none' | 'focus' | 'modality' | 'intensity';
type MatrixMode = 'single' | 'dual';

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

const isWeekendDay = (day: string) => {
  const normalized = day.toLowerCase();
  return normalized.includes('sab') || normalized.includes('sáb') || normalized.includes('dom');
};

const accentPalette = [
  'ring-2 ring-amber-200 bg-amber-50/80',
  'ring-2 ring-indigo-200 bg-indigo-50/80',
  'ring-2 ring-emerald-200 bg-emerald-50/80',
  'ring-2 ring-rose-200 bg-rose-50/80',
  'ring-2 ring-sky-200 bg-sky-50/80',
  'ring-2 ring-purple-200 bg-purple-50/80',
];

const hashStringToIndex = (value: string) => {
  let hash = 0;
  for (let i = 0; i < value.length; i++) {
    hash = (hash << 5) - hash + value.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash) % accentPalette.length;
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
  const [viewPreset, setViewPreset] = useState<ViewPreset>('custom');
  const [daySortMode, setDaySortMode] = useState<DaySortMode>('default');
  const [showOnlyWithSessions, setShowOnlyWithSessions] = useState(false);
  const [showOnlyExceededTargets, setShowOnlyExceededTargets] = useState(false);
  const [focusFilter, setFocusFilter] = useState('all');
  const [modalityFilter, setModalityFilter] = useState('all');
  const [showAdvancedControls, setShowAdvancedControls] = useState(false);
  const [showVisibleDaysPanel, setShowVisibleDaysPanel] = useState(false);
  const [layoutMode, setLayoutMode] = useState<LayoutMode>('auto');
  const [customColumns, setCustomColumns] = useState(() => Math.min(4, weekDays.length));
  const [horizontalScroll, setHorizontalScroll] = useState(true);
  const [cardSize, setCardSize] = useState<CardSize>('standard');
  const [showStats, setShowStats] = useState(true);
  const [showTags, setShowTags] = useState(true);
  const [showIcons, setShowIcons] = useState(true);
  const [dragAnimationStyle, setDragAnimationStyle] = useState<DragAnimationStyle>('subtle');
  const [colorCodingMode, setColorCodingMode] = useState<ColorCodingMode>('none');
  const [matrixMode, setMatrixMode] = useState<MatrixMode>('single');

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

  useEffect(() => {
    if (!selectedReferenceWeek && availableReferenceWeeks.length > 0) {
      setSelectedReferenceWeek(availableReferenceWeeks[0].id);
    }
  }, [availableReferenceWeeks, selectedReferenceWeek]);

  useEffect(() => {
    if (matrixMode === 'dual' && selectedReferenceWeek) {
      onRequestOverlayWeek?.('reference');
    }
  }, [matrixMode, selectedReferenceWeek, onRequestOverlayWeek]);
  useEffect(() => {
    setCustomColumns((prev) => Math.min(prev, Math.max(1, weekDays.length)));
  }, [weekDays.length]);

  const computeDayExceeds = useCallback(
    (planData: Record<string, DayPlan> | undefined) => {
      const exceeds: Record<string, { duration: boolean; calories: boolean }> = {};
      weekDays.forEach((day) => {
        const plan = planData?.[day];
        if (!plan || !weeklyTargets) {
          exceeds[day] = { duration: false, calories: false };
          return;
        }
        const totalMinutes = plan.sessions.reduce(
          (total, session) => total + (parseFirstNumber(session.duration) ?? 0),
          0,
        );
        const calories = Math.round(totalMinutes * 8);

        exceeds[day] = {
          duration: totalMinutes > weeklyTargets.duration,
          calories: calories > weeklyTargets.calories,
        };
      });
      return exceeds;
    },
    [weekDays, weeklyTargets],
  );

  const dayExceedsTargets = useMemo(() => computeDayExceeds(weeklyPlan), [computeDayExceeds, weeklyPlan]);
  const referenceDayExceeds = useMemo(
    () => (overlayWeekPlan ? computeDayExceeds(overlayWeekPlan) : null),
    [computeDayExceeds, overlayWeekPlan],
  );

  const totalMinutesByDay = useMemo(() => {
    const totals: Record<string, number> = {};
    weekDays.forEach((day) => {
      const sessions = weeklyPlan[day]?.sessions ?? [];
      totals[day] = sessions.reduce(
        (total, session) => total + (parseFirstNumber(String(session.duration ?? '')) ?? 0),
        0,
      );
    });
    return totals;
  }, [weekDays, weeklyPlan]);

  const availableFocuses = useMemo(() => {
    const focusSet = new Set<string>();
    weekDays.forEach((day) => {
      const focus = weeklyPlan[day]?.focus;
      if (focus) focusSet.add(focus);
    });
    return Array.from(focusSet);
  }, [weekDays, weeklyPlan]);

  const availableModalities = useMemo(() => {
    const modalitySet = new Set<string>();
    weekDays.forEach((day) => {
      weeklyPlan[day]?.sessions.forEach((session) => {
        if (session.modality) modalitySet.add(session.modality);
      });
    });
    return Array.from(modalitySet);
  }, [weekDays, weeklyPlan]);

  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (viewPreset !== 'custom') count++;
    if (focusFilter !== 'all') count++;
    if (modalityFilter !== 'all') count++;
    if (showOnlyWithSessions) count++;
    if (showOnlyExceededTargets) count++;
    if (dayFilterMode !== 'manual' && dayFilterValue.trim()) count++;
    return count;
  }, [
    viewPreset,
    focusFilter,
    modalityFilter,
    showOnlyWithSessions,
    showOnlyExceededTargets,
    dayFilterMode,
    dayFilterValue,
  ]);

  const presetOptions = useMemo(
    () => [
      { label: 'Personalizado', value: 'custom' },
      { label: 'Todos los días', value: 'all' },
      { label: 'Solo lunes-viernes', value: 'weekdays' },
      { label: 'Solo fin de semana', value: 'weekend' },
      { label: 'Solo sin sesiones', value: 'empty' },
      { label: 'Solo que exceden metas', value: 'exceeded' },
    ],
    [],
  );

  const sortOptions = useMemo(
    () => [
      { label: 'Orden semanal', value: 'default' },
      { label: 'Alfabético', value: 'alphabetical' },
      { label: 'Más sesiones', value: 'sessions' },
      { label: 'Mayor duración', value: 'duration' },
    ],
    [],
  );

  const activePresetLabel = useMemo(() => {
    const preset = presetOptions.find((option) => option.value === viewPreset);
    return preset?.label ?? 'Personalizado';
  }, [presetOptions, viewPreset]);

  const columnOptions = useMemo(() => {
    const maxColumns = Math.min(8, Math.max(1, weekDays.length));
    return Array.from({ length: maxColumns }, (_, index) => ({
      label: `${index + 1} ${index === 0 ? 'columna' : 'columnas'}`,
      value: String(index + 1),
    }));
  }, [weekDays.length]);

  const layoutModeDescription = useMemo(() => {
    switch (layoutMode) {
      case 'columns':
        return `Mostrando grilla fija de ${customColumns} columnas`;
      case 'vertical':
        return 'Lista vertical (una tarjeta debajo de otra)';
      case 'horizontal':
        return horizontalScroll ? 'Carrusel horizontal con scroll' : 'Fila horizontal en pantalla';
      default:
        return 'Auto: ajusta columnas según espacio disponible';
    }
  }, [layoutMode, customColumns, horizontalScroll]);

  const cardContentPadding = useMemo(() => {
    switch (cardSize) {
      case 'compact':
        return 'p-3';
      case 'detailed':
        return 'p-5';
      default:
        return 'p-4';
    }
  }, [cardSize]);

  const sessionCardPadding = useMemo(() => {
    switch (cardSize) {
      case 'compact':
        return 'p-2 text-xs gap-2';
      case 'detailed':
        return 'p-4 text-sm gap-3';
      default:
        return 'p-3 text-sm gap-3';
    }
  }, [cardSize]);

  const dragAnimationClass = useMemo(() => {
    switch (dragAnimationStyle) {
      case 'elastic':
        return 'transition-transform duration-300 ease-out hover:-translate-y-1';
      case 'none':
        return '';
      default:
        return 'transition-all duration-200 hover:-translate-y-0.5';
    }
  }, [dragAnimationStyle]);

  const getCardAccentClass = useCallback(
    (plan: DayPlan | undefined, sessions: DaySession[]) => {
      if (colorCodingMode === 'none') return '';

      if (colorCodingMode === 'focus' && plan?.focus) {
        return accentPalette[hashStringToIndex(plan.focus)];
      }

      if (colorCodingMode === 'modality') {
        const modality = sessions.find((session) => session.modality)?.modality;
        if (modality) {
          return accentPalette[hashStringToIndex(modality)];
        }
      }

      if (colorCodingMode === 'intensity') {
        const intensity = sessions.find((session) => typeof session.intensity === 'string' && session.intensity)?.intensity;
        if (intensity) {
          if (/alta|high/i.test(intensity)) return 'ring-2 ring-red-200 bg-red-50/80';
          if (/media|medium/i.test(intensity)) return 'ring-2 ring-amber-200 bg-amber-50/80';
          if (/baja|low/i.test(intensity)) return 'ring-2 ring-emerald-200 bg-emerald-50/80';
          return accentPalette[hashStringToIndex(intensity)];
        }
      }

      return '';
    },
    [colorCodingMode],
  );

  const referenceWeekLabel = useMemo(() => {
    if (!selectedReferenceWeek) return 'Semana referencia';
    const match = availableReferenceWeeks.find((week) => week.id === selectedReferenceWeek);
    return match ? `Referencia: ${match.label}` : 'Semana referencia';
  }, [selectedReferenceWeek, availableReferenceWeeks]);

  const weekSources = useMemo(() => {
    const sources: Array<{
      id: string;
      label: string;
      plan: Record<string, DayPlan>;
      exceeds: Record<string, { duration: boolean; calories: boolean }>;
      isPrimary: boolean;
    }> = [
      {
        id: 'primary',
        label: 'Semana actual',
        plan: weeklyPlan,
        exceeds: dayExceedsTargets,
        isPrimary: true,
      },
    ];

    if (matrixMode === 'dual' && overlayWeekPlan) {
      sources.push({
        id: selectedReferenceWeek || 'reference',
        label: referenceWeekLabel,
        plan: overlayWeekPlan,
        exceeds: referenceDayExceeds ?? computeDayExceeds(overlayWeekPlan),
        isPrimary: false,
      });
    }

    return sources;
  }, [
    matrixMode,
    overlayWeekPlan,
    selectedReferenceWeek,
    referenceWeekLabel,
    weeklyPlan,
    dayExceedsTargets,
    referenceDayExceeds,
    computeDayExceeds,
  ]);

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
  
  const manualDays = useMemo(() => {
    if (dayFilterMode === 'manual') {
      return selectedDays.length > 0 ? selectedDays : weekDays;
    }
    if (dayFilterMode === 'weekday') {
      return daysMatchingWeekday;
    }
    if (dayFilterMode === 'tag') {
      return daysMatchingTag;
    }
    return weekDays;
  }, [dayFilterMode, daysMatchingTag, daysMatchingWeekday, selectedDays, weekDays]);

  const presetDays = useMemo(() => {
    if (viewPreset === 'custom') return manualDays;
    const preset = (() => {
      switch (viewPreset) {
        case 'all':
          return weekDays;
        case 'weekdays':
          return weekDays.filter((day) => !isWeekendDay(day));
        case 'weekend':
          return weekDays.filter((day) => isWeekendDay(day));
        case 'empty':
          return weekDays.filter((day) => (weeklyPlan[day]?.sessions.length ?? 0) === 0);
        case 'exceeded':
          return weekDays.filter((day) => dayExceedsTargets[day]?.duration || dayExceedsTargets[day]?.calories);
        default:
          return weekDays;
      }
    })();
    return preset.length > 0 ? preset : weekDays;
  }, [viewPreset, manualDays, weekDays, weeklyPlan, dayExceedsTargets]);

  const filteredDays = useMemo(() => {
    let days = [...presetDays];

    if (focusFilter !== 'all') {
      days = days.filter((day) => weeklyPlan[day]?.focus === focusFilter);
    }

    if (modalityFilter !== 'all') {
      days = days.filter((day) =>
        weeklyPlan[day]?.sessions.some((session) => session.modality === modalityFilter),
      );
    }

    if (showOnlyWithSessions) {
      days = days.filter((day) => (weeklyPlan[day]?.sessions.length ?? 0) > 0);
    }

    if (showOnlyExceededTargets) {
      days = days.filter((day) => dayExceedsTargets[day]?.duration || dayExceedsTargets[day]?.calories);
    }

    return days;
  }, [
    presetDays,
    focusFilter,
    modalityFilter,
    showOnlyWithSessions,
    showOnlyExceededTargets,
    weeklyPlan,
    dayExceedsTargets,
  ]);

  const sortedDays = useMemo(() => {
    const days = [...filteredDays];
    switch (daySortMode) {
      case 'alphabetical':
        return days.sort((a, b) => a.localeCompare(b, 'es'));
      case 'sessions':
        return days.sort(
          (a, b) => (weeklyPlan[b]?.sessions.length ?? 0) - (weeklyPlan[a]?.sessions.length ?? 0),
        );
      case 'duration':
        return days.sort((a, b) => (totalMinutesByDay[b] ?? 0) - (totalMinutesByDay[a] ?? 0));
      default:
        return days.sort((a, b) => weekDays.indexOf(a) - weekDays.indexOf(b));
    }
  }, [filteredDays, daySortMode, totalMinutesByDay, weekDays, weeklyPlan]);

  const visibleDays = useMemo(() => {
    const base = sortedDays.length > 0 ? sortedDays : weekDays;
    return base.slice(0, Math.min(maxVisibleDays, base.length));
  }, [sortedDays, maxVisibleDays, weekDays]);

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

  const layoutContainerProps = useMemo(() => {
    if (layoutMode === 'vertical') {
      return {
        className: 'flex flex-col gap-6',
        style: undefined,
      };
    }
    if (layoutMode === 'horizontal') {
      const base = 'flex gap-6';
      return {
        className: horizontalScroll
          ? `${base} overflow-x-auto pb-2 snap-x snap-mandatory scrollbar-thin scrollbar-thumb-slate-300`
          : `${base} flex-wrap`,
        style: undefined,
      };
    }
    if (layoutMode === 'columns') {
      return {
        className: 'grid gap-6 auto-rows-fr',
        style: { gridTemplateColumns: `repeat(${Math.max(1, customColumns)}, minmax(260px, 1fr))` },
      };
    }
    return {
      className: `grid gap-6 auto-rows-fr ${shouldCenterGrid ? 'justify-center' : ''}`,
      style: { gridTemplateColumns: cardsGridTemplate },
    };
  }, [layoutMode, horizontalScroll, customColumns, cardsGridTemplate, shouldCenterGrid]);
  const { className: layoutContainerClassName, style: layoutContainerStyle } = layoutContainerProps;

  const handleToggleVisibleDay = (day: string) => {
    if (dayFilterMode !== 'manual') return;
    setViewPreset('custom');
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

      <div className="flex flex-col gap-5 rounded-3xl border border-slate-200/70 bg-white/90 p-4 shadow-sm dark:border-slate-800/60 dark:bg-slate-950/50">
        <button
          type="button"
          aria-expanded={showVisibleDaysPanel}
          onClick={() => setShowVisibleDaysPanel((prev) => !prev)}
          className="flex w-full items-center justify-between rounded-2xl border border-slate-100/80 bg-slate-50/60 px-4 py-3 text-left transition hover:border-indigo-200 hover:bg-indigo-50/70 dark:border-slate-800/40 dark:bg-slate-900/40"
        >
          <div className="flex flex-col">
            <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">Días visibles</span>
            <span className="text-sm text-slate-600">
              Control total para comparar hasta {weekDays.length} días. Actualmente mostrando {visibleDays.length}.
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Badge size="sm" variant="secondary" className="bg-white/80 font-semibold text-slate-700">
              {visibleDays.length}/{weekDays.length}
            </Badge>
            <ChevronUp
              className={`h-4 w-4 text-slate-500 transition-transform ${showVisibleDaysPanel ? '' : 'rotate-180'}`}
            />
          </div>
        </button>

        {showVisibleDaysPanel && (
          <>
            <div className="flex flex-col gap-4 rounded-2xl border border-slate-100/80 bg-slate-50/60 p-4 dark:border-slate-800/40 dark:bg-slate-900/40">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                <div className="grid w-full gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  <div className="flex flex-col gap-1 text-xs text-slate-500">
                    <span>Preset rápido</span>
                    <Select
                      value={viewPreset}
                      onChange={(e) => setViewPreset(e.target.value as ViewPreset)}
                      options={presetOptions}
                    />
                  </div>
                  <div className="flex flex-col gap-1 text-xs text-slate-500">
                    <span>Ordenar por</span>
                    <Select value={daySortMode} onChange={(e) => setDaySortMode(e.target.value as DaySortMode)} options={sortOptions} />
                  </div>
                  <div className="flex flex-col gap-1 text-xs text-slate-500">
                    <span>Máx. de días</span>
                    <Select
                      value={String(maxVisibleDays)}
                      onChange={(e) => setMaxVisibleDays(Math.max(1, Number(e.target.value)))}
                      options={weekDays.map((_, index) => ({
                        label: `${index + 1}`,
                        value: String(index + 1),
                      }))}
                    />
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <Button
                    variant={showOnlyWithSessions ? 'secondary' : 'ghost'}
                    size="sm"
                    className="h-8 px-3 text-xs"
                    onClick={() => setShowOnlyWithSessions((prev) => !prev)}
                  >
                    {showOnlyWithSessions ? 'Mostrando solo con sesiones' : 'Incluir días vacíos'}
                  </Button>
                  <Button
                    variant={showOnlyExceededTargets ? 'secondary' : 'ghost'}
                    size="sm"
                    className="h-8 px-3 text-xs"
                    onClick={() => setShowOnlyExceededTargets((prev) => !prev)}
                  >
                    {showOnlyExceededTargets ? 'Solo excedidos' : 'Ver excedidos'}
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-8 px-3 text-xs"
                    onClick={() => {
                      setViewPreset('custom');
                      setDayFilterMode('manual');
                      setDayFilterValue('');
                      setSelectedDays(weekDays.slice(0, Math.min(maxVisibleDays, weekDays.length)));
                      setShowOnlyWithSessions(false);
                      setShowOnlyExceededTargets(false);
                      setFocusFilter('all');
                      setModalityFilter('all');
                      setDaySortMode('default');
                      setLayoutMode('auto');
                      setCustomColumns(Math.min(4, weekDays.length));
                      setHorizontalScroll(true);
                      setCardSize('standard');
                      setShowStats(true);
                      setShowTags(true);
                      setShowIcons(true);
                      setDragAnimationStyle('subtle');
                      setColorCodingMode('none');
                      setMatrixMode('single');
                    }}
                  >
                    Reiniciar
                  </Button>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 text-xs text-slate-600">
                <Badge size="sm" variant="secondary" className="bg-white/80 font-semibold text-slate-700">
                  {visibleDays.length}/{weekDays.length} días activos
                </Badge>
                <Badge size="sm" variant="secondary" className="bg-white/80 text-slate-600">
                  Preset: {activePresetLabel}
                </Badge>
                {activeFiltersCount > 0 ? (
                  <Badge size="sm" variant="secondary" className="bg-indigo-50 text-indigo-700">
                    {activeFiltersCount} filtros activos
                  </Badge>
                ) : (
                  <Badge size="sm" variant="secondary" className="bg-emerald-50 text-emerald-700">
                    Vista limpia
                  </Badge>
                )}
                <Button
                  size="sm"
                  variant="ghost"
                  className="ml-auto flex items-center gap-2 text-xs"
                  onClick={() => setShowAdvancedControls((prev) => !prev)}
                >
                  {showAdvancedControls ? (
                    <>
                      <ChevronUp className="h-3.5 w-3.5" />
                      Ocultar controles avanzados
                    </>
                  ) : (
                    <>
                      <SlidersHorizontal className="h-3.5 w-3.5" />
                      Mostrar controles avanzados
                    </>
                  )}
                </Button>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-100/80 bg-white/80 p-4 dark:border-slate-800/40 dark:bg-slate-900/40">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">Distribución visual</span>
                  <p className="text-[11px] text-slate-500">{layoutModeDescription}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {[
                    { id: 'auto', label: 'Auto' },
                    { id: 'columns', label: 'Columnas' },
                    { id: 'vertical', label: 'Vertical' },
                    { id: 'horizontal', label: 'Horizontal' },
                  ].map((option) => (
                    <Button
                      key={option.id}
                      variant={layoutMode === option.id ? 'secondary' : 'ghost'}
                      size="sm"
                      className="h-8 px-3 text-xs"
                      onClick={() => setLayoutMode(option.id as LayoutMode)}
                    >
                      {option.label}
                    </Button>
                  ))}
                </div>
              </div>
              {layoutMode === 'columns' && (
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <span className="text-xs text-slate-500">Columnas visibles</span>
                  <Select
                    value={String(customColumns)}
                    onChange={(e) => setCustomColumns(Math.max(1, Number(e.target.value)))}
                    options={columnOptions}
                  />
                </div>
              )}
              {layoutMode === 'horizontal' && (
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <span className="text-xs text-slate-500">Comportamiento</span>
                  <Button
                    variant={horizontalScroll ? 'secondary' : 'ghost'}
                    size="sm"
                    className="h-8 px-3 text-xs"
                    onClick={() => setHorizontalScroll((prev) => !prev)}
                  >
                    {horizontalScroll ? 'Scroll habilitado' : 'Sin scroll (ajusta al ancho)'}
                  </Button>
                  <p className="text-[11px] text-slate-500">
                    Los días adoptan formato carrusel cuando el scroll está activo.
                  </p>
                </div>
              )}
              {layoutMode === 'vertical' && (
                <p className="mt-3 text-[11px] text-slate-500">
                  Los días se apilan uno debajo del otro para revisar planes en detalle.
                </p>
              )}
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
              <div className="space-y-3 rounded-2xl border border-slate-100/80 bg-white/80 p-4 dark:border-slate-800/40 dark:bg-slate-900/40">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">Configuración avanzada de tarjetas</span>
                    <p className="text-[11px] text-slate-500">Controla tamaño, densidad y animaciones de drag & drop.</p>
                  </div>
                  <Badge size="sm" variant="secondary" className="bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                    {cardSize === 'compact' ? 'Compactas' : cardSize === 'detailed' ? 'Detalladas' : 'Estándar'}
                  </Badge>
                </div>
                <div className="space-y-2">
                  <span className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">Tamaño</span>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { id: 'compact', label: 'Compacta' },
                      { id: 'standard', label: 'Estándar' },
                      { id: 'detailed', label: 'Detallada' },
                    ].map((size) => (
                      <Button
                        key={size.id}
                        variant={cardSize === size.id ? 'secondary' : 'ghost'}
                        size="sm"
                        className="h-8 px-3 text-xs"
                        onClick={() => setCardSize(size.id as CardSize)}
                      >
                        {size.label}
                      </Button>
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <span className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">Densidad de información</span>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      variant={showStats ? 'secondary' : 'ghost'}
                      size="sm"
                      className="h-8 px-3 text-xs"
                      onClick={() => setShowStats((prev) => !prev)}
                    >
                      {showStats ? 'Ocultar stats' : 'Mostrar stats'}
                    </Button>
                    <Button
                      variant={showTags ? 'secondary' : 'ghost'}
                      size="sm"
                      className="h-8 px-3 text-xs"
                      onClick={() => setShowTags((prev) => !prev)}
                    >
                      {showTags ? 'Ocultar tags' : 'Mostrar tags'}
                    </Button>
                    <Button
                      variant={showIcons ? 'secondary' : 'ghost'}
                      size="sm"
                      className="h-8 px-3 text-xs"
                      onClick={() => setShowIcons((prev) => !prev)}
                    >
                      {showIcons ? 'Ocultar íconos' : 'Mostrar íconos'}
                    </Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <span className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">Animación de arrastre</span>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { id: 'subtle', label: 'Sutil' },
                      { id: 'elastic', label: 'Elástica' },
                      { id: 'none', label: 'Sin animación' },
                    ].map((animation) => (
                      <Button
                        key={animation.id}
                        variant={dragAnimationStyle === animation.id ? 'secondary' : 'ghost'}
                        size="sm"
                        className="h-8 px-3 text-xs"
                        onClick={() => setDragAnimationStyle(animation.id as DragAnimationStyle)}
                      >
                        {animation.label}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-3 rounded-2xl border border-slate-100/80 bg-white/80 p-4 dark:border-slate-800/40 dark:bg-slate-900/40">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">Matriz de semanas</span>
                    <p className="text-[11px] text-slate-500">Comparar filas paralelas (actual vs referencia).</p>
                  </div>
                  <Badge size="sm" variant="secondary" className="bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                    {matrixMode === 'dual' ? 'Modo comparativo' : 'Una sola semana'}
                  </Badge>
                </div>
                <div className="flex flex-wrap gap-2">
                  {[
                    { id: 'single', label: 'Única' },
                    { id: 'dual', label: 'Comparar' },
                  ].map((mode) => (
                    <Button
                      key={mode.id}
                      variant={matrixMode === mode.id ? 'secondary' : 'ghost'}
                      size="sm"
                      className="h-8 px-3 text-xs"
                      disabled={mode.id === 'dual' && !overlayWeekPlan}
                      onClick={() => setMatrixMode(mode.id as MatrixMode)}
                    >
                      {mode.label}
                    </Button>
                  ))}
                </div>
                <div className="space-y-2">
                  <span className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">Semana referencia</span>
                  <Select
                    value={selectedReferenceWeek}
                    onChange={(e) => setSelectedReferenceWeek(e.target.value)}
                    disabled={!availableReferenceWeeks.length}
                    options={
                      availableReferenceWeeks.length
                        ? availableReferenceWeeks.map((week) => ({
                            label: `${week.label} (${week.date})`,
                            value: week.id,
                          }))
                        : [{ label: 'Sin semanas disponibles', value: '' }]
                    }
                  />
                  {matrixMode === 'dual' && !overlayWeekPlan && (
                    <p className="text-[11px] text-amber-600">
                      Solicita la semana de referencia para ver la matriz (usa el selector o recarga los datos).
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-100/80 bg-white/80 p-4 dark:border-slate-800/40 dark:bg-slate-900/40">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">Filtros visuales instantáneos</span>
                  <p className="text-[11px] text-slate-500">Colorea las tarjetas por foco, modalidad o intensidad.</p>
                </div>
                <Badge size="sm" variant="secondary" className="bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                  {colorCodingMode === 'none' ? 'Sin color' : `Por ${colorCodingMode}`}
                </Badge>
              </div>
              <div className="mt-2 flex flex-wrap gap-2">
                {[
                  { id: 'none', label: 'Ninguno' },
                  { id: 'focus', label: 'Foco' },
                  { id: 'modality', label: 'Modalidad' },
                  { id: 'intensity', label: 'Intensidad' },
                ].map((option) => (
                  <Button
                    key={option.id}
                    variant={colorCodingMode === option.id ? 'secondary' : 'ghost'}
                    size="sm"
                    className="h-8 px-3 text-xs"
                    onClick={() => setColorCodingMode(option.id as ColorCodingMode)}
                  >
                    {option.label}
                  </Button>
                ))}
              </div>
            </div>

            {showAdvancedControls && (
              <div className="grid gap-4 xl:grid-cols-3">
                <div className="space-y-3 rounded-2xl border border-slate-100/80 bg-white/70 p-3 dark:border-slate-800/40 dark:bg-slate-900/40">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">Modo de selección</span>
                    <Filter className="h-3.5 w-3.5 text-slate-400" />
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { id: 'manual', label: 'Manual' },
                      { id: 'weekday', label: 'Por nombre' },
                      { id: 'tag', label: 'Por tag' },
                    ].map((mode) => (
                      <Button
                        key={mode.id}
                        variant={dayFilterMode === mode.id ? 'secondary' : 'ghost'}
                        size="sm"
                        className="h-8 px-3 text-xs"
                        onClick={() => {
                          setViewPreset('custom');
                          setDayFilterMode(mode.id as typeof dayFilterMode);
                          setDayFilterValue('');
                        }}
                      >
                        {mode.label}
                      </Button>
                    ))}
                  </div>
                  {dayFilterMode === 'weekday' && (
                    <Input
                      value={dayFilterValue}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        setViewPreset('custom');
                        setDayFilterValue(e.target.value);
                      }}
                      placeholder="Filtrar por nombre (ej. Lunes)"
                      className="w-full"
                    />
                  )}
                  {dayFilterMode === 'tag' && (
                    <Input
                      value={dayFilterValue}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        setViewPreset('custom');
                        setDayFilterValue(e.target.value);
                      }}
                      placeholder="Tag (ej. fuerza)"
                      className="w-full"
                    />
                  )}
                  {dayFilterMode === 'manual' && (
                    <>
                      <span className="text-xs text-slate-500">Activa o desactiva días para tu vista custom:</span>
                      <div className="flex flex-wrap gap-2">
                        {weekDays.map((day) => {
                          const isSelected = selectedDays.includes(day);
                          const disabled = !isSelected && selectedDays.length >= maxVisibleDays;
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
                    </>
                  )}
                </div>

                <div className="space-y-3 rounded-2xl border border-slate-100/80 bg-white/70 p-3 dark:border-slate-800/40 dark:bg-slate-900/40">
                  <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">Filtros por enfoque y modalidad</span>
                  <div className="flex flex-col gap-2">
                    <Select
                      value={focusFilter}
                      onChange={(e) => setFocusFilter(e.target.value)}
                      options={[
                        { label: 'Todos los enfoques', value: 'all' },
                        ...availableFocuses.map((focus) => ({
                          label: focus,
                          value: focus,
                        })),
                      ]}
                    />
                    <Select
                      value={modalityFilter}
                      onChange={(e) => setModalityFilter(e.target.value)}
                      options={[
                        { label: 'Todas las modalidades', value: 'all' },
                        ...availableModalities.map((modality) => ({
                          label: modality,
                          value: modality,
                        })),
                      ]}
                    />
                  </div>
                  <p className="text-xs text-slate-500">
                    Ideal para entrenadores que segmentan por bloques temáticos o por tipo de estímulo.
                  </p>
                </div>

                <div className="space-y-3 rounded-2xl border border-slate-100/80 bg-white/70 p-3 dark:border-slate-800/40 dark:bg-slate-900/40">
                  <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">Ajustes finos & tips</span>
                  <ul className="list-disc space-y-1 pl-5 text-xs text-slate-500">
                    <li>Combina presets con filtros para vistas “macro” y “micro”.</li>
                    <li>Usa manual + orden por duración para revisar cargas acumuladas.</li>
                    <li>Activa “Solo excedidos” para detectar fácilmente días críticos.</li>
                  </ul>
                  <p className="text-xs text-slate-500">
                    ¿Tienes una combinación favorita? Déjala activa y solo ajusta los días concretos en la grilla de arriba.
                  </p>
                </div>
              </div>
            )}
          </>
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

      {weekSources.map((source) => (
        <div key={source.id} className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-semibold text-slate-700">{source.label}</h3>
              {!source.isPrimary && <Badge size="sm" variant="secondary" className="bg-slate-100 text-slate-500">Lectura</Badge>}
            </div>
            {!source.isPrimary && (
              <p className="text-xs text-slate-500">Reutiliza la misma distribución para comparar rápidamente.</p>
            )}
          </div>
          <div className={layoutContainerClassName} style={layoutContainerStyle}>
            {visibleDays.map((day, dayIndex) => {
              const plan = source.plan[day];
              const planSessions = plan?.sessions || [];
              const exceeds = source.exceeds[day];
              const hasExceeded = exceeds && (exceeds.duration || exceeds.calories);
              const totalMinutes = planSessions.reduce(
                (total, session) => total + (parseFirstNumber(String(session.duration ?? '')) ?? 0),
                0,
              );
              const totalSeries = planSessions.reduce((total, session) => total + getNumericValue(session.series), 0);
              const totalReps = planSessions.reduce((total, session) => total + getNumericValue(session.repeticiones), 0);
              const cardLayoutClass =
                layoutMode === 'horizontal'
                  ? 'min-w-[280px] snap-start flex-shrink-0'
                  : layoutMode === 'vertical'
                  ? 'w-full'
                  : '';
              const accentClass = getCardAccentClass(plan, planSessions);
              const canInteract = source.isPrimary;

              return (
                <div
                  key={`${source.id}-${day}`}
                  onDragOver={canInteract ? handleDragOver(day) : undefined}
                  onDragLeave={canInteract ? handleDragLeave : undefined}
                  onDrop={canInteract ? handleDayDrop(day) : undefined}
                  className={`group flex h-full flex-col overflow-hidden rounded-3xl border shadow-lg transition-all hover:shadow-xl ${cardLayoutClass} ${
                    hasExceeded
                      ? 'border-red-300 bg-gradient-to-br from-red-50/80 to-white ring-2 ring-red-200'
                      : dragOverDay === day && canInteract
                      ? 'border-indigo-400 bg-gradient-to-br from-indigo-50/80 to-white ring-2 ring-indigo-200'
                      : accentClass || 'border-slate-200 bg-gradient-to-br from-white to-slate-50/50 hover:border-indigo-300'
                  }`}
                >
                  <div
                    className={`relative overflow-hidden rounded-t-3xl bg-gradient-to-br ${dayGradients[dayIndex % dayGradients.length]} px-5 py-4`}
                  >
                    <div className="relative z-10 flex items-start justify-between gap-3">
                      <div className="flex flex-1 flex-col gap-2">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold uppercase tracking-wider text-slate-700">{day}</span>
                          {hasExceeded && (
                            <AlertCircle className="h-4 w-4 text-red-600" aria-label="Excede objetivos semanales" />
                          )}
                        </div>
                        <h3 className="text-base font-bold text-slate-900 leading-tight">{plan?.focus ?? 'Sin plan'}</h3>
                        {showTags && plan?.tags && plan.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1.5">
                            {plan.tags.map((tag) => (
                              <Badge key={tag} size="sm" variant="secondary" className="bg-white/80 text-[10px] backdrop-blur-sm">
                                {showIcons && <Tag className="mr-1 h-2.5 w-2.5" />}
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                      {source.isPrimary && (
                        <button
                          type="button"
                          onClick={() => onViewDay(day)}
                          className="flex-shrink-0 rounded-lg bg-white/80 p-2 text-slate-600 transition hover:bg-white hover:text-indigo-600 hover:shadow-md"
                          title="Ver detalle del día"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                      )}
                    </div>

                    {showStats && (
                      <div className="relative z-10 mt-3 flex flex-wrap items-center gap-2">
                        <div className="flex items-center gap-1.5 rounded-lg bg-white/90 px-2.5 py-1.5 text-xs font-medium text-slate-700 backdrop-blur-sm">
                          {showIcons && <BookOpen className="h-3.5 w-3.5" />}
                          <span className="font-semibold">{planSessions.length}</span>
                          <span className="hidden sm:inline">{planSessions.length === 1 ? 'sesión' : 'sesiones'}</span>
                        </div>
                        <div className="flex items-center gap-1.5 rounded-lg bg-indigo-100/90 px-2.5 py-1.5 text-xs font-medium text-indigo-700 backdrop-blur-sm">
                          {showIcons && <Clock className="h-3.5 w-3.5" />}
                          <span className="font-semibold">{totalMinutes}</span>
                          <span>min</span>
                        </div>
                        {Boolean(totalSeries) && (
                          <div className="flex items-center gap-1.5 rounded-lg bg-emerald-100/90 px-2.5 py-1.5 text-xs font-medium text-emerald-700 backdrop-blur-sm">
                            {showIcons && <CheckSquare className="h-3.5 w-3.5" />}
                            <span className="font-semibold">{totalSeries}</span>
                            <span>series</span>
                          </div>
                        )}
                        {Boolean(totalReps) && (
                          <div className="flex items-center gap-1.5 rounded-lg bg-amber-100/90 px-2.5 py-1.5 text-xs font-medium text-amber-700 backdrop-blur-sm">
                            {showIcons && <Plus className="h-3.5 w-3.5" />}
                            <span className="font-semibold">{totalReps}</span>
                            <span>reps</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  <div className={`flex flex-1 flex-col ${cardContentPadding}`}>
                    {planSessions.length === 0 ? (
                      <div className="flex flex-1 items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50/50 p-6 text-center">
                        <div className="space-y-2">
                          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-200">
                            <Plus className="h-6 w-6 text-slate-400" />
                          </div>
                          <p className="text-sm font-medium text-slate-600">Sin sesiones</p>
                          <p className="text-xs text-slate-500">
                            {canInteract ? 'Crea o arrastra bloques aquí' : 'Disponible al activar la semana actual'}
                          </p>
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
                                className={`group/session relative flex ${sessionCardPadding} rounded-xl border-2 bg-white shadow-sm ${
                                  canInteract ? dragAnimationClass : ''
                                } ${
                                  canInteract && isSelected
                                    ? 'border-indigo-500 bg-indigo-50 ring-2 ring-indigo-200'
                                    : sessionColorClass || 'border-slate-200'
                                }`}
                                draggable={canInteract}
                                onDragStart={canInteract ? handleDragStart(day, idx) : undefined}
                                onDragOver={canInteract ? handleDragOver(day) : undefined}
                                onDrop={canInteract ? handleDrop(day, idx) : undefined}
                                onClick={(e) => {
                                  if (!canInteract) return;
                                  if (e.ctrlKey || e.metaKey) {
                                    e.stopPropagation();
                                    toggleSessionSelection(session.id);
                                  }
                                }}
                              >
                                {canInteract && (
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
                                    {isSelected ? <CheckSquare className="h-4 w-4" /> : <Square className="h-4 w-4" />}
                                  </button>
                                )}

                                {showIcons && session.tipoEntrenamiento ? (
                                  <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-gradient-to-br from-slate-50 to-white shadow-sm">
                                    <TipoIcon className="h-4 w-4 text-slate-700" />
                                  </div>
                                ) : (
                                  <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-slate-100 to-slate-50 text-xs font-bold text-slate-600 shadow-sm">
                                    {idx + 1}
                                  </div>
                                )}

                                <div className="min-w-0 flex-1 space-y-1.5">
                                  <div className="flex items-start justify-between gap-2">
                                    <h4 className={`leading-snug text-slate-900 ${cardSize === 'compact' ? 'text-xs font-semibold' : 'text-sm font-semibold'} line-clamp-2 break-words`}>
                                      {session.block}
                                    </h4>
                                  </div>

                                  <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-slate-600">
                                    {session.time && (
                                      <span className="flex items-center gap-1 font-medium">
                                        {showIcons && <Clock className="h-3 w-3 text-slate-400" />}
                                        {session.time}
                                      </span>
                                    )}
                                    <span
                                      className="cursor-pointer rounded-md px-1.5 py-0.5 font-medium text-indigo-600 transition hover:bg-indigo-50"
                                      onDoubleClick={(e) => canInteract && handleDoubleClick(day, session, 'duration', e)}
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
                                          onDoubleClick={(e) => canInteract && handleDoubleClick(day, session, 'series', e)}
                                          title="Doble clic para editar"
                                        >
                                          {session.series || '?'}s
                                        </span>
                                        {session.repeticiones && (
                                          <span
                                            className="cursor-pointer rounded-md px-1.5 py-0.5 font-medium text-amber-600 transition hover:bg-amber-50"
                                            onDoubleClick={(e) => canInteract && handleDoubleClick(day, session, 'repeticiones', e)}
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
                                      onDoubleClick={(e) => canInteract && handleDoubleClick(day, session, 'intensity', e)}
                                      title="Doble clic para editar"
                                    >
                                      {session.intensity}
                                    </span>
                                  </div>

                                  {showTags && (session.tipoEntrenamiento || session.gruposMusculares?.length || session.tags?.length) && (
                                    <div className="flex flex-wrap gap-1">
                                      {session.tipoEntrenamiento && (
                                        <Badge size="sm" variant="secondary" className="text-[10px] font-medium">
                                          {showIcons && <TipoIcon className="mr-1 h-2.5 w-2.5" />}
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
                                            {showIcons && <GrupoIcon className="mr-1 h-2.5 w-2.5" />}
                                            {grupo}
                                          </Badge>
                                        );
                                      })}
                                      {session.tags?.map((tag) => (
                                        <Badge key={tag} size="sm" variant="secondary" className="text-[10px] font-medium">
                                          {showIcons && <Tag className="mr-1 h-2.5 w-2.5" />}
                                          {tag}
                                        </Badge>
                                      ))}
                                    </div>
                                  )}

                                  {canInteract && (
                                    <div className="flex items-center justify-between pt-1">
                                      <span className="text-[10px] text-slate-400 opacity-0 transition group-hover/session:opacity-100">
                                        Arrastra para reordenar
                                      </span>
                                    </div>
                                  )}
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
        </div>
      ))}

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

