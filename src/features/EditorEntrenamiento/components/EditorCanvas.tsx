import React, { useState } from 'react';
import { GripVertical, Trash2, Video, MoreHorizontal, Plus, Clock, Flame, Package } from 'lucide-react';
import { 
  DndContext, 
  closestCorners, 
  KeyboardSensor, 
  PointerSensor, 
  useSensor, 
  useSensors, 
  DragEndEvent,
  DragStartEvent,
  DragOverlay,
  useDroppable,
  defaultDropAnimationSideEffects,
  DropAnimation,
  DraggableAttributes
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Block, Exercise, Day } from '../types/training';

// --- Components ---

// Type definition for listeners based on dnd-kit usage
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type SyntheticListenerMap = Record<string, (event: any) => void>;

interface ExerciseRowItemProps {
  exercise: Exercise;
  dragAttributes?: DraggableAttributes;
  dragListeners?: SyntheticListenerMap;
  style?: React.CSSProperties;
  isDragging?: boolean;
  isOverlay?: boolean;
  forwardedRef?: React.Ref<HTMLDivElement>;
}

const ExerciseRowItem: React.FC<ExerciseRowItemProps> = ({
  exercise,
  dragAttributes,
  dragListeners,
  style,
  isDragging,
  isOverlay,
  forwardedRef
}) => {
  // Helper to extract display values from sets (simplified for UI)
  const setsCount = exercise.sets.length;
  const reps = exercise.sets[0]?.reps || 0;
  const rpe = exercise.sets[0]?.rpe || 0;
  const rest = exercise.sets[0]?.rest || 0;

  return (
    <div 
      ref={forwardedRef}
      style={style}
      className={`flex items-center gap-2 py-2 border-b border-gray-100 last:border-0 -mx-2 px-2 transition-colors bg-white ${
        isDragging ? 'opacity-50' : 'hover:bg-gray-50'
      } ${isOverlay ? 'shadow-xl rounded-lg border border-blue-200 bg-white opacity-95 cursor-grabbing' : ''}`}
    >
      {/* Drag Handle */}
      <div 
        {...dragAttributes} 
        {...dragListeners}
        className={`text-gray-300 cursor-move transition-opacity touch-none ${
          isOverlay ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
        }`}
      >
        <GripVertical size={14} />
      </div>

      {/* Exercise Name & Link */}
      <div className="flex-grow flex items-center gap-2 min-w-0">
        <input
          type="text"
          defaultValue={exercise.name}
          className="font-medium text-sm text-gray-900 bg-transparent border-none focus:ring-0 p-0 w-full placeholder-gray-400"
          placeholder="Nombre del ejercicio"
        />
        {exercise.videoUrl && (
          <a href={exercise.videoUrl} target="_blank" rel="noreferrer" className="text-blue-500 hover:text-blue-700">
            <Video size={14} />
          </a>
        )}
      </div>

      {/* Sets x Reps */}
      <div className="flex items-center gap-1 w-20 shrink-0">
        <input
          type="text"
          defaultValue={setsCount}
          className="w-6 text-center text-sm border border-transparent hover:border-gray-200 rounded focus:border-blue-500 focus:ring-1 focus:ring-blue-500 p-0.5"
        />
        <span className="text-xs text-gray-400">x</span>
        <input
          type="text"
          defaultValue={reps}
          className="w-8 text-center text-sm border border-transparent hover:border-gray-200 rounded focus:border-blue-500 focus:ring-1 focus:ring-blue-500 p-0.5"
        />
      </div>

      {/* Load / RPE */}
      <div className="w-16 shrink-0">
        <input
          type="text"
          defaultValue={rpe ? `RPE ${rpe}` : ''}
          placeholder="Carga"
          className="w-full text-center text-sm border border-transparent hover:border-gray-200 rounded focus:border-blue-500 focus:ring-1 focus:ring-blue-500 p-0.5"
        />
      </div>

      {/* Rest */}
      <div className="w-14 shrink-0 text-right">
        <input
          type="text"
          defaultValue={rest ? `${rest}s` : ''}
          placeholder="Rest"
          className="w-full text-right text-sm border border-transparent hover:border-gray-200 rounded focus:border-blue-500 focus:ring-1 focus:ring-blue-500 p-0.5 text-gray-500"
        />
      </div>

      {/* Actions */}
      <button className={`text-gray-300 hover:text-red-500 transition-opacity p-1 ${
        isOverlay ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
      }`}>
        <Trash2 size={14} />
      </button>
    </div>
  );
};

const SortableExerciseRow: React.FC<{ exercise: Exercise }> = ({ exercise }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: exercise.id });

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
      />
    </div>
  );
};

const TrainingBlock: React.FC<{ block: Block }> = ({ block }) => {
  return (
    <div className="border border-gray-200 rounded-lg p-3 mb-3 bg-white shadow-sm last:mb-0">
      {/* Block Header */}
      <div className="flex justify-between items-center mb-2 pb-2 border-b border-gray-50">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">{block.type}</span>
          <span className="text-gray-300 text-xs">|</span>
          <input
            type="text"
            defaultValue={block.name}
            className="text-sm font-semibold text-gray-800 bg-transparent border-none focus:ring-0 p-0"
          />
        </div>
        <div className="flex items-center gap-1">
           <span className="text-xs text-gray-400">{block.duration}min</span>
           <button className="text-gray-400 hover:text-gray-600 p-1">
             <MoreHorizontal size={14} />
           </button>
        </div>
      </div>

      {/* Exercises List */}
      <div className="flex flex-col">
        <SortableContext 
          items={block.exercises.map(e => e.id)} 
          strategy={verticalListSortingStrategy}
        >
          {block.exercises.map((exercise) => (
            <SortableExerciseRow key={exercise.id} exercise={exercise} />
          ))}
        </SortableContext>
      </div>
      
      {/* Add Exercise Button */}
      <button className="mt-2 flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 font-medium px-1 py-1 rounded hover:bg-blue-50 transition-colors w-fit">
        <Plus size={12} />
        <span>Añadir ejercicio</span>
      </button>
    </div>
  );
};

interface DayCardProps {
  day: Day;
  isExpanded: boolean;
  onToggleExpand: () => void;
}

const DayCard: React.FC<DayCardProps> = ({
  day,
  isExpanded,
  onToggleExpand,
}) => {
  const { setNodeRef, isOver } = useDroppable({
    id: `day-${day.id}`,
    data: { type: 'day', dayId: day.id }
  });

  const cardClasses = `bg-white shadow-sm rounded-xl p-4 flex flex-col h-full transition-all duration-300 ease-in-out border ${
    isOver 
      ? 'border-blue-500 border-dashed bg-blue-50 ring-2 ring-blue-200' 
      : 'border-transparent hover:border-gray-200'
  } ${
    isExpanded ? 'col-span-full ring-1 ring-blue-500/20 shadow-md' : ''
  }`;

  return (
    <div ref={setNodeRef} className={cardClasses}>
      {/* Header */}
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-bold text-sm text-gray-800">{day.name}</h3>
        <div className="flex gap-1">
          {day.tags.slice(0, 2).map((tag, index) => (
            <span key={tag.id || index} className="text-xs bg-gray-100 text-gray-600 rounded-full px-2 py-0.5">
              #{tag.label}
            </span>
          ))}
          {day.tags.length > 2 && (
            <span className="text-xs bg-gray-100 text-gray-600 rounded-full px-2 py-0.5">
              +{day.tags.length - 2}
            </span>
          )}
        </div>
      </div>

      {/* Body */}
      <div className="flex-grow mb-2">
        {day.blocks.length > 0 ? (
           <input 
             type="text" 
             defaultValue={day.blocks[0]?.name || "Sesión"} // Placeholder logic for session title
             className="text-sm font-semibold text-gray-900 w-full border-none p-0 focus:ring-0 mb-1"
           />
        ) : (
            <p className="text-sm font-semibold text-gray-400 mb-1">Descanso</p>
        )}
        
        {!isExpanded && day.blocks.length > 0 && (
          <div className="flex items-center text-xs text-gray-500 gap-3 mt-2">
            <div className="flex items-center gap-1">
                <Clock size={12} />
                <span>{day.totalDuration || 0}min</span>
            </div>
            <div className="flex items-center gap-1">
                <Flame size={12} />
                <span>RPE {day.averageRpe || 0}</span>
            </div>
            <div className="flex items-center gap-1">
                <Package size={12} />
                <span>{day.blocks.length} bloq</span>
            </div>
          </div>
        )}
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="my-3 p-3 bg-gray-50 rounded-lg border border-gray-100">
          {day.blocks.map((block) => (
            <TrainingBlock key={block.id} block={block} />
          ))}
           <button className="w-full py-2 mt-2 flex justify-center items-center gap-2 border-2 border-dashed border-gray-200 rounded-lg text-gray-400 hover:border-blue-300 hover:text-blue-500 transition-colors text-xs font-medium">
              <Plus size={14} />
              Agregar Bloque
           </button>
        </div>
      )}

      {/* Footer */}
      <div className="flex justify-between items-center mt-auto pt-2 border-t border-transparent">
        <button 
            className="text-sm text-blue-600 font-medium hover:text-blue-800 flex items-center gap-1" 
            onClick={onToggleExpand}
        >
          {isExpanded ? 'Colapsar' : '+ Info'}
        </button>
        <button className="text-gray-400 hover:text-gray-700 p-1 rounded-md hover:bg-gray-100">
            <MoreHorizontal size={16} />
        </button>
      </div>
    </div>
  );
};

export const EditorCanvas: React.FC = () => {
  const [expandedDayIndex, setExpandedDayIndex] = useState<number | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);

  // Mock Data following the types
  const daysData: Day[] = [
    {
      id: 'd1',
      name: 'LUNES',
      tags: [{ id: 't1', label: 'Fuerza', color: 'blue', category: 'pattern' }, { id: 't2', label: 'Upper', color: 'red', category: 'muscle' }],
      totalDuration: 65,
      averageRpe: 8,
      blocks: [
        {
          id: 'b1',
          name: 'Activation & Mobility',
          type: 'warmup',
          duration: 12,
          exercises: [
            { id: 'e1', name: 'Cat-Cow Flow', type: 'mobility', tags: [], sets: [{ id: 's1', type: 'warmup', reps: 10, rpe: 3, rest: 0 }] },
            { id: 'e2', name: 'Band Pull-Aparts', type: 'mobility', tags: [], sets: [{ id: 's2', type: 'warmup', reps: 15, rpe: 3, rest: 0 }] }
          ]
        },
        {
          id: 'b2',
          name: 'Strength Block',
          type: 'main',
          duration: 38,
          exercises: [
            { id: 'e3', name: 'Bench Press', type: 'strength', videoUrl: '#', tags: [], sets: [{ id: 's3', type: 'working', reps: 6, rpe: 8, rest: 120 }] },
            { id: 'e4', name: 'Barbell Row', type: 'strength', videoUrl: '#', tags: [], sets: [{ id: 's4', type: 'working', reps: 8, rpe: 8, rest: 90 }] }
          ]
        }
      ]
    },
    {
      id: 'd2',
      name: 'MARTES',
      tags: [{ id: 't3', label: 'Cardio', color: 'green', category: 'other' }, { id: 't4', label: 'HIIT', color: 'orange', category: 'intensity' }],
      totalDuration: 30,
      averageRpe: 9,
      blocks: [
          {
              id: 'b3',
              name: 'HIIT Intervals',
              type: 'conditioning',
              duration: 30,
              exercises: [
                  { id: 'e5', name: 'Sprint 30s', type: 'cardio', tags: [], sets: [{ id: 's5', type: 'working', reps: '10', rpe: 9, rest: 30 }] }
              ]
          }
      ]
    },
    {
      id: 'd3',
      name: 'MIÉRCOLES',
      tags: [{ id: 't5', label: 'Descanso', color: 'gray', category: 'other' }],
      blocks: [],
      totalDuration: 0,
      averageRpe: 0
    },
    // Add other days placeholders if needed
    { id: 'd4', name: 'JUEVES', tags: [{id: 't1', label: 'Fuerza', color: '', category: 'other'}], blocks: [], totalDuration: 70, averageRpe: 7 },
    { id: 'd5', name: 'VIERNES', tags: [{id: 't1', label: 'Híbrido', color: '', category: 'other'}], blocks: [], totalDuration: 40, averageRpe: 8 },
    { id: 'd6', name: 'SÁBADO', tags: [{id: 't1', label: 'Activo', color: '', category: 'other'}], blocks: [], totalDuration: 30, averageRpe: 4 },
    { id: 'd7', name: 'DOMINGO', tags: [{id: 't1', label: 'Descanso', color: '', category: 'other'}], blocks: [], totalDuration: 0, averageRpe: 0 },
  ];

  const handleToggleExpand = (index: number) => {
    setExpandedDayIndex(expandedDayIndex === index ? null : index);
  };

  const sensors = useSensors(
    useSensor(PointerSensor, {
        activationConstraint: {
            distance: 8,
        },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const findExercise = (id: string) => {
    for (const day of daysData) {
      for (const block of day.blocks) {
        const exercise = block.exercises.find(e => e.id === id);
        if (exercise) return exercise;
      }
    }
    return null;
  };

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (active.id !== over?.id) {
      console.log('Dropped!', active.id, 'over', over?.id);
      // Logic to handle reordering or dropping will go here.
    }
    setActiveId(null);
  };

  const handleDragCancel = () => {
    setActiveId(null);
  };

  const activeExercise = activeId ? findExercise(activeId) : null;

  const dropAnimation: DropAnimation = {
    sideEffects: defaultDropAnimationSideEffects({
      styles: {
        active: {
          opacity: '0.5',
        },
      },
    }),
  };

  return (
    <DndContext 
      sensors={sensors} 
      collisionDetection={closestCorners} 
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
      <div className="p-4 pb-20"> {/* Added padding-bottom to account for fixed footer */}
        <h2 className="text-xl font-semibold mb-4">Weekly View</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-4">
          {daysData.map((day, index) => (
            <DayCard
              key={day.id}
              day={day}
              isExpanded={expandedDayIndex === index}
              onToggleExpand={() => handleToggleExpand(index)}
            />
          ))}
        </div>
      </div>

      {/* Fixed Footer */}
      <div className="fixed bottom-0 left-0 right-0 bg-white p-4 shadow-lg z-50 flex justify-center gap-4 border-t border-gray-100">
        <button className="bg-blue-800 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition-colors flex items-center gap-2">
          <Plus size={18} />
          <span>Agregar Semana</span>
        </button>
        <button className="bg-white hover:bg-gray-50 text-gray-800 font-semibold py-2 px-4 rounded-lg shadow-md border border-gray-300 transition-colors flex items-center gap-2">
          <Flame size={18} />
          <span>BatchTraining</span>
        </button>
        <button className="bg-white hover:bg-gray-50 text-gray-800 font-semibold py-2 px-4 rounded-lg shadow-md border border-gray-300 transition-colors flex items-center gap-2">
          <Package size={18} /> {/* Using Package icon for 'Copiar Programa' as per reference */}
          <span>Copiar Programa</span>
        </button>
      </div>

      <DragOverlay dropAnimation={dropAnimation}>
        {activeExercise ? (
           <ExerciseRowItem exercise={activeExercise} isOverlay />
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};