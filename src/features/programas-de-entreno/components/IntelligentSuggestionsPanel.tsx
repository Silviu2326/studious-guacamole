import { memo, useMemo, useEffect, useState } from 'react';
import { Lightbulb, Sparkles, TrendingUp, Clock, Dumbbell, Target, Zap, FileSpreadsheet, Calculator, CalendarRange, CalendarCheck, X } from 'lucide-react';
import { Badge, Card, Button } from '../../../components/componentsreutilizables';
import type { DayPlan, DaySession } from '../types';
import { getFormulasPredefinidas } from '../utils/formulasPersonalizadas';
import { 
  saveRecommendationFeedback, 
  rankSuggestionsByRelevance,
  type RecommendationFeedback 
} from '../api/recommendation-learning';

export type SuggestionType = 'template' | 'exercise' | 'session' | 'block' | 'formula';

export interface IntelligentSuggestion {
  id: string;
  type: SuggestionType;
  title: string;
  description: string;
  icon?: React.ReactNode;
  metadata?: {
    duration?: string;
    intensity?: string;
    modality?: string;
    calories?: number;
    tags?: string[];
    formula?: string;
    formulaType?: string;
  };
  priority: 'high' | 'medium' | 'low';
  reason: string; // Por qué se sugiere
  draggableData: {
    type: 'template' | 'exercise' | 'session' | 'formula';
    item: any;
  };
  onApply?: () => void;
  onDiscard?: () => void;
}

type IntelligentSuggestionsPanelProps = {
  selectedDay: string | null;
  dayPlan: DayPlan | null;
  weeklyPlan?: Record<string, DayPlan>;
  activeView?: 'weekly' | 'daily' | 'excel';
  coachId?: string; // ID del coach para el sistema de aprendizaje
  onDragStart?: (suggestion: IntelligentSuggestion) => void;
  onSuggestionClick?: (suggestion: IntelligentSuggestion) => void;
  onApplySuggestion?: (suggestion: IntelligentSuggestion) => void;
  onDiscardSuggestion?: (suggestionId: string) => void;
};

// Función para generar sugerencias de fórmulas para vista Excel
function generateExcelFormulaSuggestions(
  weeklyPlan?: Record<string, DayPlan>
): IntelligentSuggestion[] {
  const suggestions: IntelligentSuggestion[] = [];
  const formulasPredefinidas = getFormulasPredefinidas();

  // Sugerir fórmulas más relevantes según el plan
  const hasStrengthSessions = Object.values(weeklyPlan || {}).some(plan =>
    plan?.sessions.some(s => s.modality.toLowerCase().includes('strength'))
  );

  if (hasStrengthSessions) {
    const tonelajeFormula = formulasPredefinidas.find(f => f.nombre === 'Tonelaje Total');
    if (tonelajeFormula) {
      suggestions.push({
        id: 'formula-tonelaje',
        type: 'formula',
        title: 'Tonelaje Total',
        description: 'Calcula el peso total levantado (peso × series × repeticiones)',
        icon: <Calculator className="h-4 w-4 text-blue-500" />,
        metadata: {
          formula: tonelajeFormula.formula,
          formulaType: tonelajeFormula.tipo,
        },
        priority: 'high',
        reason: 'Útil para analizar carga total de entrenamiento',
        draggableData: {
          type: 'formula',
          item: tonelajeFormula,
        },
      });
    }

    const volumenFormula = formulasPredefinidas.find(f => f.nombre === 'Volumen Total');
    if (volumenFormula) {
      suggestions.push({
        id: 'formula-volumen',
        type: 'formula',
        title: 'Volumen Total',
        description: 'Suma de series × repeticiones para todas las sesiones',
        icon: <Calculator className="h-4 w-4 text-indigo-500" />,
        metadata: {
          formula: volumenFormula.formula,
          formulaType: volumenFormula.tipo,
        },
        priority: 'high',
        reason: 'Mide el volumen total de trabajo',
        draggableData: {
          type: 'formula',
          item: volumenFormula,
        },
      });
    }
  }

  const densidadFormula = formulasPredefinidas.find(f => f.nombre === 'Densidad de Entrenamiento');
  if (densidadFormula) {
    suggestions.push({
      id: 'formula-densidad',
      type: 'formula',
      title: 'Densidad de Entrenamiento',
      description: 'Tonelaje por minuto de entrenamiento',
      icon: <Calculator className="h-4 w-4 text-purple-500" />,
      metadata: {
        formula: densidadFormula.formula,
        formulaType: densidadFormula.tipo,
      },
      priority: 'medium',
      reason: 'Evalúa la eficiencia del entrenamiento',
      draggableData: {
        type: 'formula',
        item: densidadFormula,
      },
    });
  }

  const intensidadFormula = formulasPredefinidas.find(f => f.nombre === 'Intensidad Promedio');
  if (intensidadFormula) {
    suggestions.push({
      id: 'formula-intensidad',
      type: 'formula',
      title: 'Intensidad Promedio',
      description: 'Promedio de RPE en todas las series',
      icon: <Calculator className="h-4 w-4 text-amber-500" />,
      metadata: {
        formula: intensidadFormula.formula,
        formulaType: intensidadFormula.tipo,
      },
      priority: 'medium',
      reason: 'Analiza la intensidad promedio del programa',
      draggableData: {
        type: 'formula',
        item: intensidadFormula,
      },
    });
  }

  return suggestions;
}

// Función para generar sugerencias semanales (bloques para toda la semana)
function generateWeeklyBlockSuggestions(
  weeklyPlan?: Record<string, DayPlan>
): IntelligentSuggestion[] {
  const suggestions: IntelligentSuggestion[] = [];
  const weekDays = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

  // Analizar distribución semanal
  const daysWithSessions = weekDays.filter(day => {
    const plan = weeklyPlan?.[day];
    return plan && plan.sessions.length > 0;
  });

  const daysWithoutSessions = weekDays.filter(day => {
    const plan = weeklyPlan?.[day];
    return !plan || plan.sessions.length === 0;
  });

  // Sugerir bloques de recuperación para días sin sesiones
  if (daysWithoutSessions.length > 0) {
    daysWithoutSessions.slice(0, 2).forEach(day => {
      suggestions.push({
        id: `weekly-recovery-${day}`,
        type: 'block',
        title: `Bloque de Recuperación - ${day}`,
        description: 'Añade una sesión de recuperación activa para este día',
        icon: <Target className="h-4 w-4 text-emerald-500" />,
        metadata: {
          duration: '20-30 min',
          intensity: 'Ligera',
          modality: 'Recovery',
          tags: ['recovery', 'mobility'],
        },
        priority: 'medium',
        reason: `Día ${day} sin sesiones programadas`,
        draggableData: {
          type: 'session',
          item: {
            id: `weekly-recovery-${day}-${Date.now()}`,
            time: '10:00',
            block: 'Active Recovery',
            duration: '25 min',
            modality: 'Recovery',
            intensity: 'Ligera',
            notes: 'Movilidad + trabajo de recuperación',
            tags: ['recovery', 'mobility'],
          },
        },
      });
    });
  }

  // Sugerir bloques de balanceo si hay días muy cargados
  const daysWithHighVolume = weekDays.filter(day => {
    const plan = weeklyPlan?.[day];
    if (!plan) return false;
    const totalMin = plan.sessions.reduce((acc, s) => {
      const m = s.duration.match(/\d+/);
      return acc + (m ? Number(m[0]) : 0);
    }, 0);
    return totalMin > 60;
  });

  if (daysWithHighVolume.length > 0) {
    suggestions.push({
      id: 'weekly-balance',
      type: 'block',
      title: 'Bloques de Balance Semanal',
      description: 'Redistribuye volumen de días cargados a días más ligeros',
      icon: <TrendingUp className="h-4 w-4 text-blue-500" />,
      metadata: {
        duration: 'Variable',
        intensity: 'Moderada',
        modality: 'Balance',
        tags: ['balance', 'distribution'],
      },
      priority: 'high',
      reason: `${daysWithHighVolume.length} día(s) con volumen alto (>60 min)`,
      draggableData: {
        type: 'template',
        item: {
          id: 'weekly-balance-template',
          name: 'Template de Balance Semanal',
          type: 'balance',
        },
      },
    });
  }

  return suggestions;
}

// Función para generar sugerencias inteligentes basadas en el día
function generateIntelligentSuggestions(
  selectedDay: string | null,
  dayPlan: DayPlan | null,
  weeklyPlan?: Record<string, DayPlan>,
  activeView: 'weekly' | 'daily' | 'excel' = 'daily'
): IntelligentSuggestion[] {
  // Para vista Excel, generar sugerencias de fórmulas
  if (activeView === 'excel') {
    return generateExcelFormulaSuggestions(weeklyPlan);
  }

  // Para vista semanal, generar sugerencias de bloques semanales
  if (activeView === 'weekly') {
    return generateWeeklyBlockSuggestions(weeklyPlan);
  }

  // Para vista diaria, usar la lógica existente
  if (!selectedDay || !dayPlan) {
    return [];
  }

  const suggestions: IntelligentSuggestion[] = [];

  // Analizar el día actual
  const currentFocus = dayPlan.focus.toLowerCase();
  const currentIntensity = dayPlan.intensity;
  const currentSessions = dayPlan.sessions || [];
  const currentModalities = new Set(currentSessions.map(s => s.modality));

  // Analizar días adyacentes para coherencia
  const weekDays = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
  const currentDayIndex = weekDays.indexOf(selectedDay);
  const previousDay = currentDayIndex > 0 ? weekDays[currentDayIndex - 1] : null;
  const nextDay = currentDayIndex < weekDays.length - 1 ? weekDays[currentDayIndex + 1] : null;

  // Sugerencia 1: Warm-up si no hay sesión de activación
  if (!currentSessions.some(s => s.modality.toLowerCase().includes('mobility') || s.block.toLowerCase().includes('warm'))) {
    suggestions.push({
      id: 'suggestion-warmup',
      type: 'session',
      title: 'Sesión de Activación',
      description: 'Añade un calentamiento y movilidad para preparar el cuerpo',
      icon: <Zap className="h-4 w-4 text-amber-500" />,
      metadata: {
        duration: '10-15 min',
        intensity: 'Ligera',
        modality: 'Mobility',
        tags: ['warm-up', 'movilidad'],
      },
      priority: 'high',
      reason: 'No hay sesión de activación en este día',
      draggableData: {
        type: 'session',
        item: {
          id: `suggestion-warmup-${Date.now()}`,
          time: '08:00',
          block: 'Warm-up & Activation',
          duration: '12 min',
          modality: 'Mobility',
          intensity: 'Ligera',
          notes: 'Movilidad articular + activación específica',
          tags: ['warm-up', 'movilidad'],
        },
      },
    });
  }

  // Sugerencia 2: Cooldown/Recovery si es un día intenso
  if (currentIntensity.includes('7') || currentIntensity.includes('8') || currentIntensity.includes('Alta')) {
    if (!currentSessions.some(s => s.modality.toLowerCase().includes('recovery') || s.block.toLowerCase().includes('cooldown'))) {
      suggestions.push({
        id: 'suggestion-cooldown',
        type: 'session',
        title: 'Sesión de Recuperación',
        description: 'Añade un cooldown para facilitar la recuperación',
        icon: <TrendingUp className="h-4 w-4 text-emerald-500" />,
        metadata: {
          duration: '10-15 min',
          intensity: 'Ligera',
          modality: 'Recovery',
          tags: ['recovery', 'cooldown'],
        },
        priority: 'high',
        reason: 'Día de alta intensidad sin sesión de recuperación',
        draggableData: {
          type: 'session',
          item: {
            id: `suggestion-cooldown-${Date.now()}`,
            time: '19:00',
            block: 'Cooldown & Recovery',
            duration: '12 min',
            modality: 'Recovery',
            intensity: 'Ligera',
            notes: 'Estiramientos + respiración',
            tags: ['recovery', 'cooldown'],
          },
        },
      });
    }
  }

  // Sugerencia 3: Ejercicios complementarios basados en el focus
  if (currentFocus.includes('upper') || currentFocus.includes('superior')) {
    suggestions.push({
      id: 'suggestion-upper-accessory',
      type: 'exercise',
      title: 'Ejercicios Accesorios Upper Body',
      description: 'Añade trabajo accesorio para completar el tren superior',
      icon: <Dumbbell className="h-4 w4 text-indigo-500" />,
      metadata: {
        duration: '15-20 min',
        intensity: 'Moderada',
        modality: 'Accessory',
        tags: ['upper-body', 'accessory'],
      },
      priority: 'medium',
      reason: 'Día enfocado en tren superior',
      draggableData: {
        type: 'exercise',
        item: {
          id: `suggestion-upper-${Date.now()}`,
          name: 'Face pulls + Lateral raises',
          target: 'Deltoides posterior y lateral',
          equipment: 'Cables y mancuernas',
          difficulty: 'Media' as const,
        },
      },
    });
  }

  if (currentFocus.includes('lower') || currentFocus.includes('inferior')) {
    suggestions.push({
      id: 'suggestion-lower-accessory',
      type: 'exercise',
      title: 'Ejercicios Accesorios Lower Body',
      description: 'Añade trabajo accesorio para completar el tren inferior',
      icon: <Target className="h-4 w-4 text-rose-500" />,
      metadata: {
        duration: '15-20 min',
        intensity: 'Moderada',
        modality: 'Accessory',
        tags: ['lower-body', 'accessory'],
      },
      priority: 'medium',
      reason: 'Día enfocado en tren inferior',
      draggableData: {
        type: 'exercise',
        item: {
          id: `suggestion-lower-${Date.now()}`,
          name: 'Hip thrust + Calf raises',
          target: 'Glúteos y gemelos',
          equipment: 'Barra y discos',
          difficulty: 'Media' as const,
        },
      },
    });
  }

  // Sugerencia 4: Balancear volumen si hay días adyacentes muy cargados
  if (previousDay && weeklyPlan?.[previousDay]) {
    const prevSessions = weeklyPlan[previousDay].sessions.length;
    if (prevSessions > 3 && currentSessions.length < 2) {
      suggestions.push({
        id: 'suggestion-balance',
        type: 'session',
        title: 'Sesión Ligera de Balance',
        description: 'Añade una sesión ligera para balancear el volumen semanal',
        icon: <Clock className="h-4 w-4 text-blue-500" />,
        metadata: {
          duration: '20-30 min',
          intensity: 'Ligera',
          modality: 'Mobility',
          tags: ['balance', 'recovery'],
        },
        priority: 'medium',
        reason: 'Día anterior muy cargado, este día tiene poco volumen',
        draggableData: {
          type: 'session',
          item: {
            id: `suggestion-balance-${Date.now()}`,
            time: '10:00',
            block: 'Active Recovery',
            duration: '25 min',
            modality: 'Mobility',
            intensity: 'Ligera',
            notes: 'Movilidad + trabajo de movilidad',
            tags: ['balance', 'recovery'],
          },
        },
      });
    }
  }

  // Sugerencia 5: Core si no hay trabajo de core
  if (!currentSessions.some(s => s.modality.toLowerCase().includes('core'))) {
    suggestions.push({
      id: 'suggestion-core',
      type: 'session',
      title: 'Trabajo de Core',
      description: 'Añade una sesión de estabilidad y fuerza del core',
      icon: <Target className="h-4 w-4 text-purple-500" />,
      metadata: {
        duration: '10-15 min',
        intensity: 'Moderada',
        modality: 'Core',
        tags: ['core', 'stability'],
      },
      priority: 'low',
      reason: 'No hay trabajo específico de core en este día',
      draggableData: {
        type: 'session',
        item: {
          id: `suggestion-core-${Date.now()}`,
          time: '18:00',
          block: 'Core Stability',
          duration: '12 min',
          modality: 'Core',
          intensity: 'Moderada',
          notes: 'Anti-rotación + anti-flexión',
          tags: ['core', 'stability'],
        },
      },
    });
  }

  // Ordenar por prioridad
  const priorityOrder = { high: 0, medium: 1, low: 2 };
  return suggestions.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
}

function IntelligentSuggestionsPanelComponent({
  selectedDay,
  dayPlan,
  weeklyPlan,
  activeView = 'daily',
  coachId,
  onDragStart,
  onSuggestionClick,
  onApplySuggestion,
  onDiscardSuggestion,
}: IntelligentSuggestionsPanelProps) {
  const [rankedSuggestions, setRankedSuggestions] = useState<IntelligentSuggestion[]>([]);
  
  const baseSuggestions = useMemo(
    () => generateIntelligentSuggestions(selectedDay, dayPlan, weeklyPlan, activeView),
    [selectedDay, dayPlan, weeklyPlan, activeView]
  );

  // Aplicar sistema de aprendizaje si hay coachId
  useEffect(() => {
    if (coachId && baseSuggestions.length > 0) {
      const context: RecommendationFeedback['context'] = {
        day: selectedDay || undefined,
        focus: dayPlan?.focus,
        intensity: dayPlan?.intensity,
        activeView,
        tags: dayPlan?.tags,
      };

      rankSuggestionsByRelevance(coachId, baseSuggestions, context)
        .then((ranked) => {
          setRankedSuggestions(ranked);
        })
        .catch(() => {
          // Si falla, usar sugerencias sin ranking
          setRankedSuggestions(baseSuggestions);
        });
    } else {
      setRankedSuggestions(baseSuggestions);
    }
  }, [baseSuggestions, coachId, selectedDay, dayPlan, activeView]);

  const suggestions = rankedSuggestions.length > 0 ? rankedSuggestions : baseSuggestions;

  // Para vista Excel y semanal, mostrar aunque no haya día seleccionado
  if (suggestions.length === 0) {
    return null;
  }

  // Para vista diaria, requerir día seleccionado
  if (activeView === 'daily' && !selectedDay) {
    return null;
  }

  const handleDragStart = (suggestion: IntelligentSuggestion) => (e: React.DragEvent) => {
    e.dataTransfer.setData('application/json', JSON.stringify(suggestion.draggableData));
    e.dataTransfer.effectAllowed = 'copy';
    onDragStart?.(suggestion);
  };

  const handleClick = (suggestion: IntelligentSuggestion) => {
    onSuggestionClick?.(suggestion);
  };

  const handleApply = async (suggestion: IntelligentSuggestion) => {
    // Guardar feedback de aceptación
    if (coachId) {
      const context: RecommendationFeedback['context'] = {
        day: selectedDay || undefined,
        focus: dayPlan?.focus,
        intensity: dayPlan?.intensity,
        activeView,
        tags: dayPlan?.tags,
        modality: suggestion.metadata?.modality,
      };

      try {
        await saveRecommendationFeedback(
          coachId,
          suggestion.id,
          {
            type: suggestion.type,
            title: suggestion.title,
            description: suggestion.description,
            priority: suggestion.priority,
            reason: suggestion.reason,
            metadata: suggestion.metadata,
          },
          'accepted',
          context
        );
      } catch (error) {
        console.error('Error saving recommendation feedback:', error);
      }
    }

    onApplySuggestion?.(suggestion);
  };

  const handleDiscard = async (suggestionId: string) => {
    const suggestion = suggestions.find(s => s.id === suggestionId);
    
    // Guardar feedback de descarte
    if (coachId && suggestion) {
      const context: RecommendationFeedback['context'] = {
        day: selectedDay || undefined,
        focus: dayPlan?.focus,
        intensity: dayPlan?.intensity,
        activeView,
        tags: dayPlan?.tags,
        modality: suggestion.metadata?.modality,
      };

      try {
        await saveRecommendationFeedback(
          coachId,
          suggestion.id,
          {
            type: suggestion.type,
            title: suggestion.title,
            description: suggestion.description,
            priority: suggestion.priority,
            reason: suggestion.reason,
            metadata: suggestion.metadata,
          },
          'discarded',
          context
        );
      } catch (error) {
        console.error('Error saving recommendation feedback:', error);
      }
    }

    onDiscardSuggestion?.(suggestionId);
  };

  const priorityColors = {
    high: 'border-amber-300 bg-amber-50/50',
    medium: 'border-indigo-300 bg-indigo-50/50',
    low: 'border-slate-300 bg-slate-50/50',
  };

  const priorityBadges = {
    high: { variant: 'red' as const, label: 'Alta' },
    medium: { variant: 'secondary' as const, label: 'Media' },
    low: { variant: 'green' as const, label: 'Baja' },
  };

  const getViewLabel = () => {
    switch (activeView) {
      case 'weekly':
        return 'Vista Semanal';
      case 'daily':
        return selectedDay ? `Vista Diaria - ${selectedDay}` : 'Vista Diaria';
      case 'excel':
        return 'Vista Excel';
      default:
        return 'Sugerencias';
    }
  };

  const getViewIcon = () => {
    switch (activeView) {
      case 'weekly':
        return <CalendarRange className="h-5 w-5 text-indigo-500" />;
      case 'daily':
        return <CalendarCheck className="h-5 w-5 text-emerald-500" />;
      case 'excel':
        return <FileSpreadsheet className="h-5 w-5 text-slate-500" />;
      default:
        return <Sparkles className="h-5 w-5 text-indigo-500" />;
    }
  };

  return (
    <div className="mb-6 space-y-3">
      <div className="flex items-center gap-2">
        {getViewIcon()}
        <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
          Sugerencias - {getViewLabel()}
        </h3>
        <Badge size="sm" variant="secondary" className="ml-auto">
          {suggestions.length}
        </Badge>
      </div>
      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-transparent">
        {suggestions.map((suggestion) => {
          const priorityStyle = priorityColors[suggestion.priority];
          const priorityBadge = priorityBadges[suggestion.priority];
          const isFormula = suggestion.type === 'formula';
          const isDraggable = activeView !== 'excel' || !isFormula;

          return (
            <Card
              key={suggestion.id}
              draggable={isDraggable}
              onDragStart={isDraggable ? handleDragStart(suggestion) : undefined}
              onClick={() => handleClick(suggestion)}
              className={`min-w-[280px] ${isDraggable ? 'cursor-move' : 'cursor-pointer'} border-2 ${priorityStyle} p-4 shadow-sm transition hover:shadow-md hover:scale-[1.02]`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-start gap-2 flex-1">
                  {suggestion.icon && <div className="mt-0.5">{suggestion.icon}</div>}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100 truncate">
                        {suggestion.title}
                      </h4>
                      <Badge size="xs" variant={priorityBadge.variant}>
                        {priorityBadge.label}
                      </Badge>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mb-2 line-clamp-2">
                      {suggestion.description}
                    </p>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 italic mb-2">
                      {suggestion.reason}
                    </p>
                    {suggestion.metadata && (
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {suggestion.metadata.duration && (
                          <Badge size="xs" variant="secondary" className="text-[10px]">
                            <Clock className="h-2.5 w-2.5 mr-1" />
                            {suggestion.metadata.duration}
                          </Badge>
                        )}
                        {suggestion.metadata.intensity && (
                          <Badge size="xs" variant="secondary" className="text-[10px]">
                            {suggestion.metadata.intensity}
                          </Badge>
                        )}
                        {suggestion.metadata.modality && (
                          <Badge size="xs" variant="secondary" className="text-[10px]">
                            {suggestion.metadata.modality}
                          </Badge>
                        )}
                        {suggestion.metadata.formula && (
                          <Badge size="xs" variant="secondary" className="text-[10px] font-mono">
                            <Calculator className="h-2.5 w-2.5 mr-1" />
                            {suggestion.metadata.formula}
                          </Badge>
                        )}
                      </div>
                    )}
                  </div>
                </div>
                {/* Botones de acción: Aplicar y Descartar */}
                <div className="flex flex-col gap-1">
                  {onApplySuggestion && (
                    <Button
                      variant="ghost"
                      size="xs"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleApply(suggestion);
                      }}
                      className="h-6 px-2 text-[10px]"
                    >
                      Aplicar
                    </Button>
                  )}
                  {onDiscardSuggestion && (
                    <Button
                      variant="ghost"
                      size="xs"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDiscard(suggestion.id);
                      }}
                      className="h-6 px-2 text-[10px] text-red-600 hover:text-red-700"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

export const IntelligentSuggestionsPanel = memo(IntelligentSuggestionsPanelComponent);

