import React, { useState, useRef } from 'react';
import { GripVertical, Trash2, Video, ChevronDown, ChevronUp, Clock, FileText, Flame, Dumbbell, RefreshCw, MessageSquare } from 'lucide-react';
import { DraggableAttributes } from '@dnd-kit/core';
import {
  useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Exercise, Set } from '../../types/training';
import { ContextMenu, ContextMenuItem } from '../common/ContextMenu';
import { useUIContext } from '../../context/UIContext';
import { CollaboratorHighlight } from '../collaboration/CollaboratorCursors';
import { useCollaboration } from '../../context/CollaborationContext';
import { CommentThread } from '../collaboration/CommentThread';
import { calculateLoad, MOCK_CLIENT_STATS, isPercentage } from '../../utils/loadCalculator';
import { AlertTriangle } from 'lucide-react';
import { useUserPreferences } from '../../context/UserPreferencesContext';

// Type definition for listeners based on dnd-kit usage
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type SyntheticListenerMap = Record<string, (event: any) => void>;

export interface ExerciseRowItemProps {
  exercise: Exercise;
  dragAttributes?: DraggableAttributes;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  dragListeners?: any;
  style?: React.CSSProperties;
  isDragging?: boolean;
  isOverlay?: boolean;
  forwardedRef?: React.Ref<HTMLDivElement>;
  isSelected?: boolean;
  onToggleSelection?: () => void;
  onRemoveExercise?: () => void;
  viewMode?: 'edit' | 'review';
}

export const ExerciseRowItem: React.FC<ExerciseRowItemProps> = ({
  exercise,
  dragAttributes,
  dragListeners,
  style,
  isDragging,
  isOverlay,
  forwardedRef,
  isSelected,
  onToggleSelection,
  onRemoveExercise,
  viewMode = 'edit'
}) => {
  const [isExpanded, setIsExpanded] = React.useState(false);
  // Local state to manage individual sets updates for the UI demo
  const [localSets, setLocalSets] = React.useState(exercise.sets);
  const [loadWarnings, setLoadWarnings] = useState<Record<number, string>>({});
  const [contextMenu, setContextMenu] = useState<{ isOpen: boolean; x: number; y: number } | null>(null);
  const { setExerciseDetailModalOpen, setSelectedExercise } = useUIContext();
  const { comments } = useCollaboration();
  const { density } = useUserPreferences();
  const isCompact = density === 'compact';

  const [showComments, setShowComments] = useState(false);
  const commentButtonRef = useRef<HTMLButtonElement>(null);

  const hasComments = comments[exercise.id] && comments[exercise.id].length > 0;

  // Helper to extract display values from sets (simplified for UI)
  const setsCount = localSets.length;
  const reps = localSets[0]?.reps || 0;
  const rpe = localSets[0]?.rpe || 0;
  const rest = localSets[0]?.rest || 0;
  
  const actualReps = localSets[0]?.actualReps;
  const actualWeight = localSets[0]?.actualWeight;
  const actualRpe = localSets[0]?.actualRpe;

  const getDiffColor = (target: string | number | undefined, actual: string | number | undefined) => {
      if (!actual) return 'text-gray-400';
      if (target === undefined) return 'text-gray-600';
      // Simple comparison logic
      if (Number(actual) >= Number(target)) return 'text-green-600';
      if (Number(actual) < Number(target)) return 'text-red-500';
      return 'text-gray-600';
  };

  const toggleSetType = (index: number) => {
    const newSets = [...localSets];
    newSets[index] = {
      ...newSets[index],
      type: newSets[index].type === 'warmup' ? 'working' : 'warmup'
    };
    setLocalSets(newSets);
  };

  const handleLoadChange = (index: number, value: string) => {
    const newSets = [...localSets];
    const currentSet = newSets[index];
    
    // Check if input is percentage-based
    if (isPercentage(value)) {
      const { weight, warning } = calculateLoad(value, exercise.id, MOCK_CLIENT_STATS);
      
      // Update warnings
      setLoadWarnings(prev => {
        const newWarnings = { ...prev };
        if (warning) {
          newWarnings[index] = warning;
        } else {
          delete newWarnings[index];
        }
        return newWarnings;
      });

      if (weight !== null) {
        newSets[index] = {
          ...currentSet,
          percentage: parseFloat(value) / 100,
          weight: weight,
          // We store the formatted display string in a temp field if needed, 
          // but for now we rely on the input value or re-render.
          // However, inputs are uncontrolled (defaultValue). 
          // To update them we might need controlled inputs or force update.
        };
        
        // Force the input to show the calculated display
        // This is a bit tricky with defaultValue. We might need to switch to value + onChange
        // or just accept that it updates on next render if we change the key or something.
        // For this implementation, I'll try to update the set and let the user see the result.
      }
    } else {
      // Regular number input
      setLoadWarnings(prev => {
        const newWarnings = { ...prev };
        delete newWarnings[index];
        return newWarnings;
      });
      
      // Try to parse as weight or RPE
      if (value.toLowerCase().includes('rpe')) {
         const rpeVal = parseFloat(value.replace(/[^0-9.]/g, ''));
         newSets[index] = { ...currentSet, rpe: isNaN(rpeVal) ? undefined : rpeVal, weight: undefined, percentage: undefined };
      } else {
         const weightVal = parseFloat(value);
         newSets[index] = { ...currentSet, weight: isNaN(weightVal) ? undefined : weightVal, rpe: undefined, percentage: undefined };
      }
    }
    setLocalSets(newSets);
  };

  const getLoadDisplayValue = (set: Set, index: number) => {
     if (set.percentage && !loadWarnings[index]) {
         // If we have a calculated weight, show it
         if (set.weight) {
             return `${Math.round(set.percentage * 100)}% (${set.weight}kg)`;
         }
         return `${Math.round(set.percentage * 100)}%`;
     }
     if (set.rpe) return `RPE ${set.rpe}`;
     if (set.weight) return `${set.weight}kg`;
     return '';
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation(); // Prevent bubbling to day card
    setContextMenu({
      isOpen: true,
      x: e.clientX,
      y: e.clientY
    });
  };

  const handleOpenDetail = () => {
    setSelectedExercise(exercise);
    setExerciseDetailModalOpen(true);
  };

  const handleWatchVideo = () => {
    if (exercise.videoUrl) {
        window.open(exercise.videoUrl, '_blank');
    } else {
        alert('No hay video URL configurado para este ejercicio.');
    }
  };

  const handleSubstitute = () => {
      alert('SmartFill: Sustituir Ejercicio (Funcionalidad pendiente de integración)');
  };

  const handleDelete = () => {
      if (onRemoveExercise) {
          if (window.confirm('¿Eliminar ejercicio?')) {
              onRemoveExercise();
          }
      }
  };

  const contextMenuItems: ContextMenuItem[] = [
    {
      label: 'Añadir Comentario',
      icon: <MessageSquare size={14} />,
      onClick: () => setShowComments(true)
    },
    {
      label: 'Ver Video',
      icon: <Video size={14} />,
      onClick: handleWatchVideo,
      // Disable if no URL? Or show alert. Alert is simpler for now.
    },
    {
      label: 'Sustituir Ejercicio',
      icon: <RefreshCw size={14} />,
      onClick: handleSubstitute
    },
    {
      label: 'Eliminar',
      icon: <Trash2 size={14} />,
      onClick: handleDelete,
      danger: true,
      separator: true
    }
  ];

  return (
    <>
    <div 
      ref={forwardedRef}
      style={style}
      className={`flex flex-col border-b border-gray-100 last:border-0 -mx-2 px-2 transition-colors bg-white ${
        isDragging ? 'opacity-50' : 'hover:bg-gray-50'
      } ${isOverlay ? 'shadow-xl rounded-lg border border-blue-200 bg-white opacity-95 cursor-grabbing' : ''} ${
        exercise.groupId ? 'border-l-4 border-l-blue-500 pl-3 bg-blue-50/30' : ''
      }`}
      onContextMenu={handleContextMenu}
    >
      <CollaboratorHighlight elementId={exercise.id} type="exercise">
      {/* Main Row Content */}
      <div className={`flex items-center gap-2 ${isCompact ? 'py-1' : 'py-2'} relative`}>
        {/* Selection Checkbox */}
        <div className="flex items-center h-full" onClick={(e) => e.stopPropagation()}>
          <input 
            type="checkbox"
            checked={isSelected || false}
            onChange={() => onToggleSelection && onToggleSelection()}
            className="w-3.5 h-3.5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer focus-visible:ring-2 focus-visible:ring-offset-1"
            aria-label="Seleccionar ejercicio"
          />
        </div>

        {/* Group Label */}
        {exercise.groupLabel && (
           <span className="text-xs font-bold text-blue-600 w-6 text-center shrink-0">{exercise.groupLabel}</span>
        )}

        {/* Drag Handle */}
        <div 
          {...dragAttributes} 
          {...dragListeners}
          className={`text-gray-300 cursor-move transition-opacity touch-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-none rounded ${
            isOverlay ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
          }`}
          aria-label="Reordenar ejercicio"
          role="button"
          tabIndex={0}
        >
          <GripVertical size={14} aria-hidden="true" />
        </div>

        {/* Exercise Name & Link & Comments */}
        <div className="flex-grow flex items-center gap-2 min-w-0">
          <span
            onClick={handleOpenDetail}
            role="button"
            tabIndex={0}
            aria-label={`Ver detalles de ${exercise.name}`}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleOpenDetail();
              }
            }}
            className={`font-medium ${isCompact ? 'text-xs' : 'text-sm'} text-gray-900 cursor-pointer hover:text-blue-600 transition-colors truncate focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-none rounded px-1`}
          >
            {exercise.name}
          </span>
          {exercise.videoUrl && !isCompact && (
            <a 
              href={exercise.videoUrl} 
              target="_blank" 
              rel="noreferrer" 
              className="text-blue-500 hover:text-blue-700 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-none rounded"
              aria-label="Ver video del ejercicio"
            >
              <Video size={14} aria-hidden="true" />
            </a>
          )}
          {hasComments && (
            <button
              ref={commentButtonRef}
              onClick={() => setShowComments(!showComments)}
              className={`p-1 rounded-full transition-colors ${
                showComments ? 'bg-blue-100 text-blue-600' : 'bg-yellow-100 text-yellow-600 hover:bg-yellow-200'
              }`}
              title="Ver comentarios"
            >
              <MessageSquare size={12} />
            </button>
          )}
        </div>

        {/* Sets x Reps */}
        <div className="flex flex-col w-20 shrink-0">
          <div className="flex items-center gap-1">
            <input
              type="text"
              value={setsCount}
              readOnly
              aria-label="Número de series"
              className={`w-6 text-center ${isCompact ? 'text-xs' : 'text-sm'} border border-transparent hover:border-gray-200 rounded focus:border-blue-500 focus:ring-1 focus:ring-blue-500 p-0.5 bg-transparent`}
            />
            <span className="text-xs text-gray-400" aria-hidden="true">x</span>
            <input
              type="text"
              defaultValue={reps}
              aria-label="Repeticiones"
              className={`w-8 text-center ${isCompact ? 'text-xs' : 'text-sm'} border border-transparent hover:border-gray-200 rounded focus:border-blue-500 focus:ring-1 focus:ring-blue-500 p-0.5`}
            />
          </div>
          {viewMode === 'review' && (
             <div className="text-center -mt-1">
               <span className={`text-xs font-bold ${getDiffColor(reps, actualReps)}`}>
                 {actualReps ? `${setsCount} x ${actualReps}` : '-'}
               </span>
             </div>
          )}
        </div>

        {/* Load / RPE */}
        <div className="flex flex-col w-16 shrink-0">
          <input
            type="text"
            key={`summary-load-${localSets[0]?.percentage}-${localSets[0]?.weight}-${localSets[0]?.rpe}`}
            defaultValue={localSets[0] ? getLoadDisplayValue(localSets[0], 0) : ''}
            onBlur={(e) => localSets[0] && handleLoadChange(0, e.target.value)}
            onKeyDown={(e) => {
                if (e.key === 'Enter') {
                    e.currentTarget.blur();
                }
            }}
            placeholder="Carga"
            aria-label="Carga o RPE"
            className={`w-full text-center ${isCompact ? 'text-xs' : 'text-sm'} border border-transparent hover:border-gray-200 rounded focus:border-blue-500 focus:ring-1 focus:ring-blue-500 p-0.5 ${loadWarnings[0] ? 'text-yellow-600 bg-yellow-50' : ''}`}
            title={loadWarnings[0]}
          />
           {viewMode === 'review' && (
             <div className="text-center -mt-1">
               <span className={`text-xs font-bold ${getDiffColor(rpe, actualRpe)}`}>
                 {actualRpe ? `RPE ${actualRpe}` : (actualWeight ? `${actualWeight}kg` : '-')}
               </span>
             </div>
          )}
        </div>

        {/* Rest */}
        <div className="w-14 shrink-0 text-right">
          <input
            type="text"
            defaultValue={rest ? `${rest}s` : ''}
            placeholder="Rest"
            aria-label="Tiempo de descanso"
            className={`w-full text-right ${isCompact ? 'text-xs' : 'text-sm'} border border-transparent hover:border-gray-200 rounded focus:border-blue-500 focus:ring-1 focus:ring-blue-500 p-0.5 text-gray-500`}
          />
        </div>

        {/* Actions & Expand */}
        <div className="flex items-center gap-1">
            <button 
                onClick={() => setIsExpanded(!isExpanded)}
                className={`text-gray-400 hover:text-blue-600 transition-colors p-1 rounded hover:bg-blue-50 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-none ${isExpanded ? 'text-blue-600 bg-blue-50' : ''}`}
                aria-label={isExpanded ? "Colapsar detalles" : "Expandir detalles"}
                aria-expanded={isExpanded}
            >
                {isExpanded ? <ChevronUp size={16} aria-hidden="true" /> : <ChevronDown size={16} aria-hidden="true" />}
            </button>
            <button 
              className={`text-gray-300 hover:text-red-500 transition-opacity p-1 focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:outline-none rounded ${
                isOverlay ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
              }`}
              onClick={handleDelete}
              aria-label="Eliminar ejercicio"
            >
                <Trash2 size={14} aria-hidden="true" />
            </button>
        </div>

        {/* Comment Thread Popover */}
        {showComments && (
          <div className="absolute top-8 left-10 z-20">
            <CommentThread 
              exerciseId={exercise.id} 
              onClose={() => setShowComments(false)} 
            />
          </div>
        )}
      </div>

      {/* Expanded Details */}
      {isExpanded && (
          <div className="px-10 pb-4 pt-2">
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-100 space-y-4">
                {/* Top Row: Tempo, Rest, Notes */}
                <div className="grid grid-cols-12 gap-4">
                    <div className="col-span-3">
                        <label className="block text-xs font-medium text-gray-500 mb-1 flex items-center gap-1">
                            <Clock size={12} aria-hidden="true" /> Tempo
                        </label>
                        <input 
                            type="text" 
                            defaultValue={exercise.tempo || "2-0-2-0"} 
                            placeholder="e.g., 3-0-1-0"
                            aria-label="Tempo del ejercicio"
                            className="w-full text-sm border-gray-200 rounded-md focus:border-blue-500 focus:ring-blue-500"
                        />
                    </div>
                    <div className="col-span-3">
                        <label className="block text-xs font-medium text-gray-500 mb-1 flex items-center gap-1">
                            <Clock size={12} aria-hidden="true" /> Descanso (Global)
                        </label>
                        <input 
                            type="text" 
                            defaultValue={rest} 
                            placeholder="e.g., 60s"
                            aria-label="Descanso global"
                            className="w-full text-sm border-gray-200 rounded-md focus:border-blue-500 focus:ring-blue-500"
                        />
                    </div>
                    <div className="col-span-6">
                        <label className="block text-xs font-medium text-gray-500 mb-1 flex items-center gap-1">
                            <FileText size={12} aria-hidden="true" /> Notas de Ejecución
                        </label>
                        <textarea 
                            rows={1}
                            defaultValue={exercise.notes}
                            placeholder="Notas específicas para el cliente..."
                            aria-label="Notas de ejecución"
                            className="w-full text-sm border-gray-200 rounded-md focus:border-blue-500 focus:ring-blue-500 resize-none"
                        />
                    </div>
                </div>

                {/* Sets Table */}
                <div>
                    <div className="grid grid-cols-12 gap-2 mb-2 px-2" aria-hidden="true">
                        <div className="col-span-1 text-xs font-semibold text-gray-400 text-center">#</div>
                        <div className="col-span-2 text-xs font-semibold text-gray-400">TIPO</div>
                        
                        {viewMode === 'review' ? (
                            <>
                                <div className="col-span-1 text-xs font-semibold text-gray-400 text-center">PLAN</div>
                                <div className="col-span-1 text-xs font-semibold text-blue-600 text-center">REAL</div>
                                <div className="col-span-2 text-xs font-semibold text-gray-400 text-center">CARGA</div>
                                <div className="col-span-2 text-xs font-semibold text-blue-600 text-center">REAL</div>
                            </>
                        ) : (
                            <>
                                <div className="col-span-2 text-xs font-semibold text-gray-400 text-center">REPS</div>
                                <div className="col-span-3 text-xs font-semibold text-gray-400 text-center">CARGA / RPE</div>
                            </>
                        )}

                        <div className={viewMode === 'review' ? "col-span-1 text-xs font-semibold text-gray-400 text-center" : "col-span-2 text-xs font-semibold text-gray-400 text-center"}>REST</div>
                        <div className="col-span-2"></div>
                    </div>
                    <div className="space-y-1" role="list" aria-label="Lista de series">
                        {localSets.map((set, idx) => (
                            <div 
                                key={idx} 
                                role="listitem"
                                className={`grid grid-cols-12 gap-2 items-center p-2 rounded-md transition-colors ${
                                    set.type === 'warmup' ? 'bg-orange-50 border border-orange-100' : 'bg-white border border-gray-100'
                                }`}
                            >
                                <div className="col-span-1 text-center text-sm font-medium text-gray-500" aria-label={`Serie ${idx + 1}`}>
                                    {idx + 1}
                                </div>
                                <div className="col-span-2">
                                    <button
                                        onClick={() => toggleSetType(idx)}
                                        className={`text-xs px-2 py-1 rounded-full font-medium transition-colors flex items-center gap-1 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-none ${
                                            set.type === 'warmup' 
                                                ? 'bg-orange-100 text-orange-700 hover:bg-orange-200'
                                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                        }`}
                                        aria-label={set.type === 'warmup' ? "Cambiar a serie efectiva" : "Cambiar a serie de calentamiento"}
                                    >
                                        {set.type === 'warmup' ? <Flame size={10} aria-hidden="true" /> : <Dumbbell size={10} aria-hidden="true" />}
                                        {set.type === 'warmup' ? 'Warm-up' : 'Working'}
                                    </button>
                                </div>

                                {/* REPS */}
                                <div className={viewMode === 'review' ? "col-span-1" : "col-span-2"}>
                                    <input
                                        type="text"
                                        defaultValue={set.reps}
                                        aria-label={`Repeticiones planificadas serie ${idx + 1}`}
                                        className="w-full text-center text-sm border-gray-200 rounded focus:ring-blue-500 focus:border-blue-500 p-1"
                                    />
                                </div>
                                {viewMode === 'review' && (
                                    <div className="col-span-1">
                                        <input
                                            type="text"
                                            defaultValue={set.actualReps}
                                            placeholder="-"
                                            className={`w-full text-center text-sm border-blue-100 bg-blue-50 rounded focus:ring-blue-500 focus:border-blue-500 p-1 ${getDiffColor(set.reps, set.actualReps)} font-medium`}
                                        />
                                    </div>
                                )}

                                {/* LOAD */}
                                <div className={viewMode === 'review' ? "col-span-2" : "col-span-3"}>
                                    <div className="relative" title={loadWarnings[idx]}>
                                        <input
                                            type="text"
                                            key={`load-${idx}-${set.percentage}-${set.weight}-${set.rpe}`}
                                            defaultValue={getLoadDisplayValue(set, idx)}
                                            onBlur={(e) => handleLoadChange(idx, e.target.value)}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter') {
                                                    e.currentTarget.blur();
                                                }
                                            }}
                                            placeholder="-"
                                            aria-label={`Carga o RPE planificado serie ${idx + 1}`}
                                            className={`w-full text-center text-sm border-gray-200 rounded focus:ring-blue-500 focus:border-blue-500 p-1 ${loadWarnings[idx] ? 'border-yellow-400 bg-yellow-50 text-yellow-800 pr-5' : ''}`}
                                        />
                                        {loadWarnings[idx] && (
                                            <AlertTriangle size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-yellow-600 pointer-events-none" />
                                        )}
                                    </div>
                                </div>
                                {viewMode === 'review' && (
                                    <div className="col-span-2">
                                        <input
                                            type="text"
                                            defaultValue={set.actualRpe || set.actualWeight || ''}
                                            placeholder="-"
                                            className={`w-full text-center text-sm border-blue-100 bg-blue-50 rounded focus:ring-blue-500 focus:border-blue-500 p-1 ${getDiffColor(set.rpe || set.weight, set.actualRpe || set.actualWeight)} font-medium`}
                                        />
                                    </div>
                                )}

                                <div className={viewMode === 'review' ? "col-span-1" : "col-span-2"}>
                                    <input
                                        type="text"
                                        defaultValue={set.rest}
                                        placeholder="s"
                                        aria-label={`Descanso serie ${idx + 1}`}
                                        className="w-full text-center text-sm border-gray-200 rounded focus:ring-blue-500 focus:border-blue-500 p-1"
                                    />
                                </div>
                                <div className="col-span-2 flex justify-end gap-1">
                                    {viewMode === 'review' && (
                                        <button
                                            onClick={() => {
                                                const newSets = [...localSets];
                                                // Promote actual to planned
                                                if (newSets[idx].actualReps) newSets[idx].reps = newSets[idx].actualReps;
                                                if (newSets[idx].actualWeight) newSets[idx].weight = newSets[idx].actualWeight;
                                                if (newSets[idx].actualRpe) newSets[idx].rpe = newSets[idx].actualRpe;
                                                setLocalSets(newSets);
                                            }}
                                            className="text-blue-400 hover:text-blue-600 p-1 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-none rounded"
                                            title="Usar Real como Planificado (Promover)"
                                        >
                                            <RefreshCw size={14} aria-hidden="true" />
                                        </button>
                                    )}
                                    <button 
                                      className="text-gray-300 hover:text-red-500 p-1 focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:outline-none rounded"
                                      aria-label={`Eliminar serie ${idx + 1}`}
                                    >
                                        <Trash2 size={14} aria-hidden="true" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                    <button 
                      className="mt-2 text-xs font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1 ml-2 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-none rounded p-1"
                      aria-label="Agregar nueva serie"
                    >
                        + Agregar Serie
                    </button>
                </div>
            </div>
          </div>
      )}
      </CollaboratorHighlight>
      {contextMenu && (
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          items={contextMenuItems}
          onClose={() => setContextMenu(null)}
        />
      )}
    </div>
    </>
  );
};

export const SortableExerciseRow: React.FC<{ 
  exercise: Exercise;
  isSelected?: boolean;
  onToggleSelection?: () => void;
  onRemoveExercise?: () => void;
  viewMode?: 'edit' | 'review';
}> = ({ exercise, isSelected, onToggleSelection, onRemoveExercise, viewMode }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ 
    id: exercise.id,
    data: {
      type: 'exercise',
      exercise
    }
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div className="group relative">
      <ExerciseRowItem
        exercise={exercise}
        forwardedRef={setNodeRef}
        style={style}
        dragAttributes={attributes}
        dragListeners={listeners}
        isDragging={isDragging}
        isSelected={isSelected}
        onToggleSelection={onToggleSelection}
        onRemoveExercise={onRemoveExercise}
        viewMode={viewMode}
      />
    </div>
  );
};