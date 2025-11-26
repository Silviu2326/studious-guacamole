import { memo, useMemo, useState, useEffect } from 'react';
import { 
  Lightbulb, 
  Sparkles, 
  Clock, 
  Dumbbell, 
  Target, 
  Zap, 
  TrendingUp,
  GripVertical,
  PlusCircle,
  X,
  Check
} from 'lucide-react';
import { Badge, Card, Button } from '../../../components/componentsreutilizables';
import type { DayPlan, DaySession } from '../types';
import { 
  saveRecommendationFeedback, 
  rankSuggestionsByRelevance,
  type RecommendationFeedback 
} from '../api/recommendation-learning';

export type RecommendedBlock = {
  id: string;
  title: string;
  description: string;
  type: 'warmup' | 'strength' | 'cardio' | 'mobility' | 'recovery' | 'finisher' | 'accessory';
  duration: string;
  intensity: string;
  modality: string;
  icon?: React.ReactNode;
  priority: 'high' | 'medium' | 'low';
  reason: string;
  draggableData: {
    type: 'session';
    item: DaySession;
  };
};

type RecommendedBlocksPanelProps = {
  weeklyPlan: Record<string, DayPlan>;
  weekDays: readonly string[];
  coachId?: string; // ID del coach para el sistema de aprendizaje
  onBlockDragStart?: (block: RecommendedBlock) => void;
  onBlockClick?: (block: RecommendedBlock) => void;
  onApplyBlock?: (block: RecommendedBlock) => void;
  onDiscardBlock?: (blockId: string) => void;
};

// Función para generar bloques recomendados basados en huecos libres y contexto
function generateRecommendedBlocks(
  weeklyPlan: Record<string, DayPlan>,
  weekDays: readonly string[]
): RecommendedBlock[] {
  const blocks: RecommendedBlock[] = [];
  
  // Analizar días con pocas o ninguna sesión
  weekDays.forEach((day) => {
    const plan = weeklyPlan[day];
    const sessions = plan?.sessions || [];
    const sessionCount = sessions.length;
    
    // Si el día tiene menos de 2 sesiones, sugerir bloques
    if (sessionCount < 2) {
      // Calcular duración total del día
      const totalMinutes = sessions.reduce((total, session) => {
        const match = session.duration.match(/\d+/);
        return total + (match ? Number(match[0]) : 0);
      }, 0);
      
      // Sugerir warm-up si no hay
      if (!sessions.some(s => s.modality.toLowerCase().includes('mobility') || s.block.toLowerCase().includes('warm'))) {
        blocks.push({
          id: `recommended-warmup-${day}`,
          title: 'Warm-up & Activación',
          description: 'Prepara el cuerpo para el entrenamiento',
          type: 'warmup',
          duration: '10-15 min',
          intensity: 'Ligera',
          modality: 'Mobility',
          icon: <Zap className="h-4 w-4 text-amber-500" />,
          priority: 'high',
          reason: `${day} no tiene sesión de activación`,
          draggableData: {
            type: 'session',
            item: {
              id: `recommended-warmup-${day}-${Date.now()}`,
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
      
      // Sugerir sesión principal si hay poco volumen
      if (totalMinutes < 30) {
        const focus = plan?.focus?.toLowerCase() || '';
        
        if (focus.includes('upper') || focus.includes('superior')) {
          blocks.push({
            id: `recommended-upper-${day}`,
            title: 'Sesión Upper Body',
            description: 'Trabajo de tren superior completo',
            type: 'strength',
            duration: '35-45 min',
            intensity: 'RPE 7',
            modality: 'Strength',
            icon: <Dumbbell className="h-4 w-4 text-indigo-500" />,
            priority: 'high',
            reason: `${day} tiene poco volumen y enfoque en tren superior`,
            draggableData: {
              type: 'session',
              item: {
                id: `recommended-upper-${day}-${Date.now()}`,
                time: '10:00',
                block: 'Upper Body Strength',
                duration: '40 min',
                modality: 'Strength',
                intensity: 'RPE 7',
                notes: 'Press + Remo + Accesorios',
                tags: ['upper-body', 'strength'],
              },
            },
          });
        } else if (focus.includes('lower') || focus.includes('inferior')) {
          blocks.push({
            id: `recommended-lower-${day}`,
            title: 'Sesión Lower Body',
            description: 'Trabajo de tren inferior completo',
            type: 'strength',
            duration: '35-45 min',
            intensity: 'RPE 7',
            modality: 'Strength',
            icon: <Target className="h-4 w-4 text-rose-500" />,
            priority: 'high',
            reason: `${day} tiene poco volumen y enfoque en tren inferior`,
            draggableData: {
              type: 'session',
              item: {
                id: `recommended-lower-${day}-${Date.now()}`,
                time: '10:00',
                block: 'Lower Body Strength',
                duration: '40 min',
                modality: 'Strength',
                intensity: 'RPE 7',
                notes: 'Squat + Hip Hinge + Accesorios',
                tags: ['lower-body', 'strength'],
              },
            },
          });
        } else {
          blocks.push({
            id: `recommended-fullbody-${day}`,
            title: 'Sesión Full Body',
            description: 'Entrenamiento completo de cuerpo',
            type: 'strength',
            duration: '35-45 min',
            intensity: 'RPE 6-7',
            modality: 'Strength',
            icon: <Dumbbell className="h-4 w-4 text-emerald-500" />,
            priority: 'medium',
            reason: `${day} tiene poco volumen`,
            draggableData: {
              type: 'session',
              item: {
                id: `recommended-fullbody-${day}-${Date.now()}`,
                time: '10:00',
                block: 'Full Body Strength',
                duration: '40 min',
                modality: 'Strength',
                intensity: 'RPE 6-7',
                notes: 'Compuesto + Accesorios',
                tags: ['full-body', 'strength'],
              },
            },
          });
        }
      }
      
      // Sugerir finisher si hay sesiones pero no finisher
      if (sessionCount > 0 && !sessions.some(s => s.block.toLowerCase().includes('finisher'))) {
        blocks.push({
          id: `recommended-finisher-${day}`,
          title: 'Finisher Cardio',
          description: 'Bloque final de acondicionamiento',
          type: 'finisher',
          duration: '10-15 min',
          intensity: 'Alta',
          modality: 'MetCon',
          icon: <TrendingUp className="h-4 w-4 text-red-500" />,
          priority: 'low',
          reason: `${day} no tiene finisher`,
          draggableData: {
            type: 'session',
            item: {
              id: `recommended-finisher-${day}-${Date.now()}`,
              time: '18:00',
              block: 'Cardio Finisher',
              duration: '12 min',
              modality: 'MetCon',
              intensity: 'Alta',
              notes: 'EMOM o AMRAP corto',
              tags: ['finisher', 'cardio'],
            },
          },
        });
      }
      
      // Sugerir recovery si es un día intenso
      const hasIntenseSession = sessions.some(s => 
        s.intensity.includes('8') || 
        s.intensity.includes('9') || 
        s.intensity.toLowerCase().includes('alta')
      );
      
      if (hasIntenseSession && !sessions.some(s => s.modality.toLowerCase().includes('recovery'))) {
        blocks.push({
          id: `recommended-recovery-${day}`,
          title: 'Recuperación Activa',
          description: 'Facilita la recuperación post-entreno',
          type: 'recovery',
          duration: '10-15 min',
          intensity: 'Ligera',
          modality: 'Recovery',
          icon: <TrendingUp className="h-4 w-4 text-emerald-500" />,
          priority: 'medium',
          reason: `${day} tiene sesiones intensas sin recuperación`,
          draggableData: {
            type: 'session',
            item: {
              id: `recommended-recovery-${day}-${Date.now()}`,
              time: '19:00',
              block: 'Active Recovery',
              duration: '12 min',
              modality: 'Recovery',
              intensity: 'Ligera',
              notes: 'Estiramientos + movilidad',
              tags: ['recovery', 'mobility'],
            },
          },
        });
      }
    }
  });
  
  // Ordenar por prioridad
  const priorityOrder = { high: 0, medium: 1, low: 2 };
  return blocks.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
}

function RecommendedBlocksPanelComponent({
  weeklyPlan,
  weekDays,
  coachId,
  onBlockDragStart,
  onBlockClick,
  onApplyBlock,
  onDiscardBlock,
}: RecommendedBlocksPanelProps) {
  const [filter, setFilter] = useState<'all' | 'high' | 'medium' | 'low'>('all');
  const [rankedBlocks, setRankedBlocks] = useState<RecommendedBlock[]>([]);
  
  const baseBlocks = useMemo(
    () => generateRecommendedBlocks(weeklyPlan, weekDays),
    [weeklyPlan, weekDays]
  );

  // Aplicar sistema de aprendizaje si hay coachId
  useEffect(() => {
    if (coachId && baseBlocks.length > 0) {
      // Convertir RecommendedBlock a formato compatible con ranking
      const blocksForRanking = baseBlocks.map(block => ({
        type: 'block' as const,
        priority: block.priority,
        reason: block.reason,
      }));

      const context: RecommendationFeedback['context'] = {
        activeView: 'weekly',
      };

      rankSuggestionsByRelevance(coachId, blocksForRanking, context)
        .then((ranked) => {
          // Mapear de vuelta a RecommendedBlock usando el orden
          const rankedMap = new Map(ranked.map((r, idx) => [r.reason, idx]));
          const sorted = [...baseBlocks].sort((a, b) => {
            const idxA = rankedMap.get(a.reason) ?? Infinity;
            const idxB = rankedMap.get(b.reason) ?? Infinity;
            return idxA - idxB;
          });
          setRankedBlocks(sorted);
        })
        .catch(() => {
          setRankedBlocks(baseBlocks);
        });
    } else {
      setRankedBlocks(baseBlocks);
    }
  }, [baseBlocks, coachId]);

  const allBlocks = rankedBlocks.length > 0 ? rankedBlocks : baseBlocks;
  
  const filteredBlocks = useMemo(() => {
    if (filter === 'all') return allBlocks;
    return allBlocks.filter(b => b.priority === filter);
  }, [allBlocks, filter]);
  
  const handleDragStart = (block: RecommendedBlock) => (e: React.DragEvent) => {
    e.dataTransfer.setData('application/json', JSON.stringify(block.draggableData));
    e.dataTransfer.effectAllowed = 'copy';
    onBlockDragStart?.(block);
  };
  
  const handleClick = (block: RecommendedBlock) => {
    onBlockClick?.(block);
  };

  const handleApply = async (block: RecommendedBlock) => {
    // Guardar feedback de aceptación
    if (coachId) {
      const context: RecommendationFeedback['context'] = {
        activeView: 'weekly',
        modality: block.modality,
      };

      try {
        await saveRecommendationFeedback(
          coachId,
          block.id,
          {
            type: 'block',
            title: block.title,
            description: block.description,
            priority: block.priority,
            reason: block.reason,
            metadata: {
              duration: block.duration,
              intensity: block.intensity,
              modality: block.modality,
              type: block.type,
            },
          },
          'accepted',
          context
        );
      } catch (error) {
        console.error('Error saving recommendation feedback:', error);
      }
    }

    onApplyBlock?.(block);
  };

  const handleDiscard = async (blockId: string) => {
    const block = allBlocks.find(b => b.id === blockId);
    
    // Guardar feedback de descarte
    if (coachId && block) {
      const context: RecommendationFeedback['context'] = {
        activeView: 'weekly',
        modality: block.modality,
      };

      try {
        await saveRecommendationFeedback(
          coachId,
          block.id,
          {
            type: 'block',
            title: block.title,
            description: block.description,
            priority: block.priority,
            reason: block.reason,
            metadata: {
              duration: block.duration,
              intensity: block.intensity,
              modality: block.modality,
              type: block.type,
            },
          },
          'discarded',
          context
        );
      } catch (error) {
        console.error('Error saving recommendation feedback:', error);
      }
    }

    onDiscardBlock?.(blockId);
  };
  
  const priorityColors = {
    high: 'border-amber-300 bg-amber-50/50 dark:bg-amber-950/20',
    medium: 'border-indigo-300 bg-indigo-50/50 dark:bg-indigo-950/20',
    low: 'border-slate-300 bg-slate-50/50 dark:bg-slate-800/50',
  };
  
  const priorityBadges = {
    high: { variant: 'red' as const, label: 'Alta' },
    medium: { variant: 'secondary' as const, label: 'Media' },
    low: { variant: 'green' as const, label: 'Baja' },
  };
  
  if (allBlocks.length === 0) {
    return (
      <Card className="p-4">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="h-5 w-5 text-indigo-500" />
          <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
            Bloques Recomendados
          </h3>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 text-center py-4">
          No hay recomendaciones en este momento. Todos los días tienen suficiente contenido.
        </p>
      </Card>
    );
  }
  
  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-indigo-500" />
          <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
            Bloques Recomendados
          </h3>
        </div>
        <Badge size="sm" variant="secondary">
          {allBlocks.length}
        </Badge>
      </div>
      
      {/* Filtros */}
      <div className="flex gap-1 mb-3">
        {(['all', 'high', 'medium', 'low'] as const).map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setFilter(f)}
            className={`px-2 py-1 text-xs rounded transition ${
              filter === f
                ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700'
            }`}
          >
            {f === 'all' ? 'Todos' : f === 'high' ? 'Alta' : f === 'medium' ? 'Media' : 'Baja'}
          </button>
        ))}
      </div>
      
      {/* Lista de bloques */}
      <div className="space-y-2 max-h-[600px] overflow-y-auto">
        {filteredBlocks.map((block) => {
          const priorityStyle = priorityColors[block.priority];
          const priorityBadge = priorityBadges[block.priority];
          
          return (
            <Card
              key={block.id}
              draggable
              onDragStart={handleDragStart(block)}
              onClick={() => handleClick(block)}
              className={`cursor-move border-2 ${priorityStyle} p-3 shadow-sm transition hover:shadow-md hover:scale-[1.02] group`}
            >
              <div className="flex items-start gap-2">
                <div className="mt-0.5 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300">
                  <GripVertical className="h-4 w-4" />
                </div>
                {block.icon && <div className="mt-0.5">{block.icon}</div>}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100 truncate">
                      {block.title}
                    </h4>
                    <Badge size="xs" variant={priorityBadge.variant}>
                      {priorityBadge.label}
                    </Badge>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mb-1 line-clamp-2">
                    {block.description}
                  </p>
                  <p className="text-[10px] text-slate-500 dark:text-slate-500 italic mb-2">
                    {block.reason}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    <Badge size="xs" variant="secondary" className="text-[10px]">
                      <Clock className="h-2.5 w-2.5 mr-1" />
                      {block.duration}
                    </Badge>
                    <Badge size="xs" variant="secondary" className="text-[10px]">
                      {block.intensity}
                    </Badge>
                    <Badge size="xs" variant="secondary" className="text-[10px]">
                      {block.modality}
                    </Badge>
                  </div>
                </div>
                {/* Botones de acción: Aplicar y Descartar */}
                {(onApplyBlock || onDiscardBlock) && (
                  <div className="flex flex-col gap-1">
                    {onApplyBlock && (
                      <Button
                        variant="ghost"
                        size="xs"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleApply(block);
                        }}
                        className="h-6 px-2 text-[10px]"
                        title="Aceptar recomendación"
                      >
                        <Check className="h-3 w-3" />
                      </Button>
                    )}
                    {onDiscardBlock && (
                      <Button
                        variant="ghost"
                        size="xs"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDiscard(block.id);
                        }}
                        className="h-6 px-2 text-[10px] text-red-600 hover:text-red-700"
                        title="Descartar recomendación"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                )}
              </div>
            </Card>
          );
        })}
      </div>
      
      <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-700">
        <p className="text-[10px] text-slate-500 dark:text-slate-400 text-center">
          💡 Arrastra los bloques a los huecos libres del calendario para añadirlos rápidamente
        </p>
      </div>
    </Card>
  );
}

export const RecommendedBlocksPanel = memo(RecommendedBlocksPanelComponent);

