import React, { useState } from 'react';
import { Timer, MoreHorizontal, Link, Unlink, Plus, AlertTriangle } from 'lucide-react';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Block, Exercise } from '../../types/training';
import { SortableExerciseRow } from './ExerciseRow';
import { TimerWidget } from '../tools/TimerWidget';
import { useCollaboration, Collaborator } from '../../context/CollaborationContext';
import { FitCoachMemoryService } from '../../services/FitCoachMemoryService';
import { useValidation } from '../../hooks/useValidation';
import { useUIContext } from '../../context/UIContext';

interface TrainingBlockProps {
  block: Block;
  onUpdateBlock: (block: Block) => void;
  onDuplicate: () => void;
  onRemove: () => void;
  isLockedBy?: Collaborator | null;
  isSimpleMode?: boolean;
}

export const TrainingBlock: React.FC<TrainingBlockProps> = ({
  block,
  onUpdateBlock,
  onDuplicate,
  onRemove,
  isLockedBy,
  isSimpleMode = false
}) => {
  const [showTimer, setShowTimer] = useState(false);
  const [selectedExercises, setSelectedExercises] = useState<Set<string>>(new Set());

  const isConditioningOrEmom = block.name.toUpperCase().includes('EMOM') || block.name.toUpperCase().includes('CONDITIONING');
  const hasSelection = selectedExercises.size > 0;

  // Validation
  const { getBlockAlerts } = useValidation();
  const { openFitCoach } = useUIContext();
  const alerts = getBlockAlerts(block.id);
  const hasAlerts = alerts.length > 0;

  // Logic for grouping (simplified for now)
  const canGroup = selectedExercises.size > 1;
  const canUngroup = false; // Placeholder

  const toggleSelection = (exerciseId: string) => {
    const newSelection = new Set(selectedExercises);
    if (newSelection.has(exerciseId)) {
      newSelection.delete(exerciseId);
    } else {
      newSelection.add(exerciseId);
    }
    setSelectedExercises(newSelection);
  };

  const handleRemoveExercise = (exerciseId: string) => {
    if (isLockedBy) return;
    const newExercises = block.exercises.filter(e => e.id !== exerciseId);
    onUpdateBlock({ ...block, exercises: newExercises });
  };

  const handleAddExercise = () => {
    if (isLockedBy) return;
    const newExercise: Exercise = {
      id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).slice(2),
      name: 'Nuevo Ejercicio',
      sets: [
        {
          id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).slice(2),
          reps: 10,
          rpe: 7,
          weight: 0,
          rest: 60,
          completed: false
        }
      ],
      notes: ''
    };

    const newBlock = {
      ...block,
      exercises: [...block.exercises, newExercise]
    };

    onUpdateBlock(newBlock);

    // FitCoach Memory
    FitCoachMemoryService.saveMemory(
      `Añadió el ejercicio "${newExercise.name}"`,
      'action',
      { type: 'add_exercise', exerciseName: newExercise.name, blockId: block.id }
    );
  };

  const handleGroup = () => {
    // Placeholder for grouping logic
    alert("Agrupar ejercicios (Pendiente de implementación)");
  };

  const handleUngroup = () => {
    // Placeholder for ungrouping logic
    alert("Desagrupar ejercicios (Pendiente de implementación)");
  };

  return (
      <div className={`relative border rounded-lg mb-2 bg-white transition-all ${isLockedBy ? 'border-orange-200 bg-orange-50/30' : 'border-gray-200 hover:border-blue-300'
        }`}>
        {/* Header */}
        <div className="flex items-center justify-between p-2 border-b border-gray-100 bg-gray-50/50 rounded-t-lg">
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={block.name}
              onChange={(e) => !isLockedBy && onUpdateBlock({ ...block, name: e.target.value })}
              disabled={!!isLockedBy}
              className="font-semibold text-sm bg-transparent border-none p-0 focus:ring-0 text-gray-700 w-40"
            />
            {hasAlerts && (
              <div
                className="cursor-pointer text-yellow-500 hover:text-yellow-600 animate-pulse"
                onClick={(e) => {
                  e.stopPropagation();
                  openFitCoach('Alertas');
                }}
                title={alerts.map(a => a.message).join('\n')}
              >
                <AlertTriangle size={14} />
              </div>
            )}
          </div>
          <div className="flex items-center gap-1"> {/* Action buttons */}
            {isConditioningOrEmom && (
              <button
                onClick={() => setShowTimer(true)}
                className="text-gray-400 hover:text-blue-600 p-1"
                title="Abrir Temporizador"
              >
                <Timer size={14} />
              </button>
            )}
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
        {hasSelection && !isLockedBy && !isSimpleMode && (
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
                isExpanded={false}
                onToggleSelection={() => toggleSelection(exercise.id)}
                onRemoveExercise={() => handleRemoveExercise(exercise.id)}
                hideSelection={isSimpleMode}
              />
            ))}
          </SortableContext>
        </div>

        {/* Add Exercise Button */}
        <div className="p-2">
          <button
            disabled={!!isLockedBy}
            onClick={handleAddExercise}
            className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 font-medium px-1 py-1 rounded hover:bg-blue-50 transition-colors w-fit disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus size={12} />
            <span>Añadir ejercicio</span>
          </button>
        </div>
      </div>
  );
};