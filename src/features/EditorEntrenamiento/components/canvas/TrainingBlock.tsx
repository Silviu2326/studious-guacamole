import React, { useState } from 'react';
import { MoreHorizontal, Plus, Link, Unlink, Lock, Timer } from 'lucide-react';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { Block } from '../../types/training';
import { SortableExerciseRow } from './ExerciseRow';
import { CollaboratorHighlight } from '../collaboration/CollaboratorCursors';
import { Collaborator } from '../../context/CollaborationContext';
import { TimerWidget } from '../tools/TimerWidget';

export const TrainingBlock: React.FC<{ 
  block: Block;
  onUpdateBlock?: (newBlock: Block) => void;
  isLockedBy?: Collaborator;
}> = ({ block, onUpdateBlock, isLockedBy }) => {
  const [selectedExercises, setSelectedExercises] = useState<Set<string>>(new Set());
  const [showTimer, setShowTimer] = useState(false);

  const toggleSelection = (id: string) => {
    const newSet = new Set(selectedExercises);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    setSelectedExercises(newSet);
  };

  const generateId = () => typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).slice(2);

  const handleGroup = () => {
    if (!onUpdateBlock || isLockedBy) return;
    const selectedIds = Array.from(selectedExercises);
    if (selectedIds.length < 2) return;

    // Find exercises and their current indices
    const exercisesWithIndex = block.exercises.map((e, i) => ({ ...e, originalIndex: i }));
    const selectedExercisesList = exercisesWithIndex.filter(e => selectedExercises.has(e.id));
    
    // Sort by index to maintain order
    selectedExercisesList.sort((a, b) => a.originalIndex - b.originalIndex);

    // Generate Group ID
    const groupId = generateId();

    // Determine next available Group Letter (A, B, C...)
    const usedLetters = new Set(
      block.exercises
        .map(e => e.groupLabel ? e.groupLabel[0] : null)
        .filter((l): l is string => l !== null)
    );
    
    let groupLetter = 'A';
    while (usedLetters.has(groupLetter)) {
      groupLetter = String.fromCharCode(groupLetter.charCodeAt(0) + 1);
    }

    // Create new exercises array
    const newExercises = [...block.exercises];
    selectedExercisesList.forEach((e, index) => {
      newExercises[e.originalIndex] = {
        ...newExercises[e.originalIndex],
        groupId: groupId,
        groupLabel: `${groupLetter}${index + 1}`
      };
    });

    onUpdateBlock({ ...block, exercises: newExercises });
    setSelectedExercises(new Set());
  };

  const handleUngroup = () => {
    if (!onUpdateBlock || isLockedBy) return;
    
    const newExercises = block.exercises.map(e => {
      if (selectedExercises.has(e.id)) {
        // Create a new object without groupId and groupLabel
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { groupId, groupLabel, ...rest } = e;
        return rest;
      }
      return e;
    });

    onUpdateBlock({ ...block, exercises: newExercises });
    setSelectedExercises(new Set());
  };

  const handleRemoveExercise = (exerciseId: string) => {
    if (!onUpdateBlock || isLockedBy) return;
    const newExercises = block.exercises.filter(e => e.id !== exerciseId);
    onUpdateBlock({ ...block, exercises: newExercises });
  };

  const hasSelection = selectedExercises.size > 0;
  const canGroup = selectedExercises.size > 1;
  const canUngroup = Array.from(selectedExercises).some(id => {
    const ex = block.exercises.find(e => e.id === id);
    return ex?.groupId;
  });

  const isConditioningOrEmom = block.type === 'conditioning' || 
    block.name.toUpperCase().includes('EMOM') || 
    block.notes?.toUpperCase().includes('EMOM') ||
    block.name.toUpperCase().includes('AMRAP');

  return (
    <CollaboratorHighlight elementId={block.id} type="block" className="mb-3 last:mb-0">
      <div className={`border border-gray-200 rounded-lg p-3 bg-white shadow-sm relative transition-opacity duration-200 ${isLockedBy ? 'opacity-80' : ''}`}>
        
        {/* Locking Overlay */}
        {isLockedBy && (
          <div className="absolute inset-0 z-20 bg-white/50 backdrop-blur-[1px] rounded-lg flex items-center justify-center cursor-not-allowed">
            <div className="bg-white px-3 py-2 rounded-full shadow-lg border border-gray-200 flex items-center gap-2 animate-in fade-in zoom-in duration-200">
              <Lock size={14} className="text-gray-500" />
              <div className="flex items-center gap-1.5">
                {isLockedBy.avatar && (
                  <img src={isLockedBy.avatar} alt="" className="w-4 h-4 rounded-full" />
                )}
                <span className="text-xs font-medium text-gray-600">
                  Editado por {isLockedBy.name}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Block Header */}
        <div className="flex justify-between items-center mb-2 pb-2 border-b border-gray-50">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">{block.type}</span>
            <span className="text-gray-300 text-xs">|</span>
            <input
              type="text"
              defaultValue={block.name}
              disabled={!!isLockedBy}
              className="text-sm font-semibold text-gray-800 bg-transparent border-none focus:ring-0 p-0 disabled:text-gray-500"
            />
          </div>
          <div className="flex items-center gap-1">
             <span className="text-xs text-gray-400">{block.duration}min</span>
             
             {isConditioningOrEmom && (
                <button
                    onClick={() => setShowTimer(true)}
                    className="text-gray-400 hover:text-blue-600 p-1"
                    title="Abrir Temporizador"
                >
                    <Timer size={14} />
                </button>
             )}

             <button 
               disabled={!!isLockedBy}
               className="text-gray-400 hover:text-gray-600 p-1 disabled:opacity-50"
             >
               <MoreHorizontal size={14} />
             </button>
          </div>
        </div>

        {showTimer && (
            <TimerWidget 
                onClose={() => setShowTimer(false)} 
                initialConfig={{ 
                    mode: block.name.toUpperCase().includes('EMOM') ? 'interval' : 'stopwatch',
                    duration: block.duration ? block.duration * 60 : undefined
                }} 
            />
        )}

        {/* Floating Action Bar for Selection */}
        {hasSelection && !isLockedBy && (
          <div className="absolute top-2 right-12 z-10 flex gap-2 bg-white shadow-lg border border-gray-200 rounded-lg p-1 animate-in fade-in zoom-in duration-200">
            {canGroup && (
              <button 
                onClick={handleGroup}
                className="flex items-center gap-1 text-xs font-medium text-blue-600 hover:bg-blue-50 px-2 py-1 rounded"
                title="Agrupar seleccionados"
              >
                <Link size={14} />
                Agrupar
              </button>
            )}
            {canUngroup && (
              <button 
                onClick={handleUngroup}
                className="flex items-center gap-1 text-xs font-medium text-red-600 hover:bg-red-50 px-2 py-1 rounded"
                title="Desagrupar seleccionados"
              >
                <Unlink size={14} />
                Desagrupar
              </button>
            )}
            <button 
               onClick={() => setSelectedExercises(new Set())}
               className="text-xs text-gray-500 hover:bg-gray-100 px-2 py-1 rounded"
            >
              Cancelar
            </button>
          </div>
        )}

        {/* Exercises List */}
        <div className={`flex flex-col ${isLockedBy ? 'pointer-events-none' : ''}`}>
          <SortableContext 
            items={block.exercises.map(e => e.id)} 
            strategy={verticalListSortingStrategy}
          >
            {block.exercises.map((exercise) => (
              <SortableExerciseRow 
                key={exercise.id} 
                exercise={exercise} 
                isSelected={selectedExercises.has(exercise.id)}
                onToggleSelection={() => toggleSelection(exercise.id)}
                onRemoveExercise={() => handleRemoveExercise(exercise.id)}
              />
            ))}
          </SortableContext>
        </div>
        
        {/* Add Exercise Button */}
        <button 
          disabled={!!isLockedBy}
          className="mt-2 flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 font-medium px-1 py-1 rounded hover:bg-blue-50 transition-colors w-fit disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Plus size={12} />
          <span>Añadir ejercicio</span>
        </button>
      </div>
    </CollaboratorHighlight>
  );
};