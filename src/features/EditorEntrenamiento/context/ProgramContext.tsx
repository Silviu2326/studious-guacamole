import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { Day } from '../types/training';
import { VersioningService } from '../services/VersioningService';
import { offlineQueue } from '../utils/offlineQueue';
import { MockApiService } from '../services/MockApiService';

import { useHistory } from '../hooks/useHistory';

interface ProgramContextType {
  daysData: Day[];
  updateDay: (dayId: string, newDay: Day) => void;
  setProgramData: (data: Day[]) => void;
  saveCurrentVersion: (label?: string) => void;
  isSaving: boolean;
  lastSavedAt: Date | null;
  isOffline: boolean;
  pendingSyncCount: number;
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  bulkUpdateExercises: (targetIds: string[], action: { type: 'SET_PROPERTY' | 'MULTIPLY_PROPERTY' | 'ADD_SETS_FACTOR', field: string, value: number }) => void;
}

const ProgramContext = createContext<ProgramContextType | undefined>(undefined);

// Mock Initial Data
const INITIAL_DAYS_DATA: Day[] = [
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
    { id: 'd4', name: 'JUEVES', tags: [{id: 't1', label: 'Fuerza', color: '', category: 'other'}], blocks: [], totalDuration: 70, averageRpe: 7 },
    { id: 'd5', name: 'VIERNES', tags: [{id: 't1', label: 'Híbrido', color: '', category: 'other'}], blocks: [], totalDuration: 40, averageRpe: 8 },
    { id: 'd6', name: 'SÁBADO', tags: [{id: 't1', label: 'Activo', color: '', category: 'other'}], blocks: [], totalDuration: 30, averageRpe: 4 },
    { id: 'd7', name: 'DOMINGO', tags: [{id: 't1', label: 'Descanso', color: '', category: 'other'}], blocks: [], totalDuration: 0, averageRpe: 0 },
  ];

export const ProgramProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { state: daysData, set: setDaysData, undo, redo, canUndo, canRedo } = useHistory<Day[]>(INITIAL_DAYS_DATA);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null);
  
  // Offline Sync State
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [pendingSyncCount, setPendingSyncCount] = useState(0);

  const updateDay = useCallback((dayId: string, newDay: Day) => {
    setDaysData(prev => prev.map(d => d.id === dayId ? newDay : d));
  }, [setDaysData]);

  const setProgramData = useCallback((data: Day[]) => {
    setDaysData(data);
  }, [setDaysData]);

  const bulkUpdateExercises = useCallback((targetIds: string[], action: { type: 'SET_PROPERTY' | 'MULTIPLY_PROPERTY' | 'ADD_SETS_FACTOR', field: string, value: number }) => {
    setDaysData(prevDays => {
      // Create a deep clone to avoid mutating state directly during traversal
      // using JSON parse/stringify for simplicity, or map structure
      // For complex objects, map is better to preserve prototypes if any (though here they are plain objects)
      
      return prevDays.map(day => {
        // If Day is selected, everything inside is selected
        const daySelected = targetIds.includes(day.id);
        
        // If no blocks/exercises need update and day not selected, return as is (optimization)
        // But we need to traverse to find if children are selected
        
        const updatedBlocks = day.blocks.map(block => {
            const blockSelected = daySelected || targetIds.includes(block.id);
            
            const updatedExercises = block.exercises.map(ex => {
                const exSelected = blockSelected || targetIds.includes(ex.id);
                
                if (!exSelected) return ex;

                // Apply Action
                let newSets = [...ex.sets];

                if (action.type === 'SET_PROPERTY') {
                    newSets = newSets.map(set => ({ ...set, [action.field]: action.value }));
                } else if (action.type === 'ADD_SETS_FACTOR') {
                    // E.g. multiply sets count by 1.2
                    const currentCount = newSets.length;
                    if (currentCount > 0) {
                        const newCount = Math.max(1, Math.round(currentCount * action.value));
                        if (newCount > currentCount) {
                            // Add copies of the last set
                            const lastSet = newSets[newSets.length - 1];
                            for (let i = 0; i < newCount - currentCount; i++) {
                                newSets.push({ ...lastSet, id: crypto.randomUUID() });
                            }
                        } else if (newCount < currentCount) {
                            // Remove sets
                            newSets = newSets.slice(0, newCount);
                        }
                    }
                }

                return { ...ex, sets: newSets };
            });

            return { ...block, exercises: updatedExercises };
        });

        return { ...day, blocks: updatedBlocks };
      });
    });
  }, [setDaysData]);

  const processSyncQueue = useCallback(async () => {
    const queue = offlineQueue.getQueue();
    if (queue.length === 0) return;

    console.log('Processing offline queue...', queue.length, 'items');
    
    // Process sequentially
    for (const op of queue) {
        if (op.type === 'save_program') {
            try {
                await MockApiService.saveProgram(op.data, op.label);
                offlineQueue.removeOperation(op.id);
                // Note: We don't update lastSavedAt here because it represents the local save time, 
                // but we could trigger a toast or status update if we had that capability exposed.
            } catch (error) {
                console.error('Sync failed for op', op.id, error);
                // If offline, stop processing
                if (!navigator.onLine) break;
            }
        }
    }
  }, []);

  // Network Status & Queue Listeners
  useEffect(() => {
    const handleOnline = () => {
      setIsOffline(false);
      processSyncQueue();
    };
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Subscribe to queue changes to update UI count
    const unsubscribeQueue = offlineQueue.subscribe((q) => {
      setPendingSyncCount(q.length);
    });
    
    // Initialize count
    setPendingSyncCount(offlineQueue.getQueue().length);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      unsubscribeQueue();
    };
  }, [processSyncQueue]);

  const saveCurrentVersion = useCallback(async (label?: string) => {
    setIsSaving(true);
    
    // 1. Always save locally immediately (Local First)
    try {
      VersioningService.saveVersion(daysData, label);
      setLastSavedAt(new Date());
    } catch (e) {
      console.error('Local save failed', e);
    }

    // 2. Try to save to "Remote" (Mock API)
    try {
      await MockApiService.saveProgram(daysData, label);
    } catch (error) {
      console.warn('Remote save failed, adding to offline queue', error);
      offlineQueue.addOperation({
        type: 'save_program',
        data: daysData,
        label
      });
    } finally {
      setIsSaving(false);
    }
  }, [daysData]);

  // Autosave effect
  useEffect(() => {
    const interval = setInterval(() => {
      saveCurrentVersion(); // Auto-save
    }, 30000); // 30 seconds

    return () => clearInterval(interval);
  }, [saveCurrentVersion]);

  return (
    <ProgramContext.Provider value={{ 
      daysData, 
      updateDay, 
      setProgramData,
      saveCurrentVersion,
      isSaving,
      lastSavedAt,
      isOffline,
      pendingSyncCount,
      undo,
      redo,
      canUndo,
      canRedo,
      bulkUpdateExercises
    }}>
      {children}
    </ProgramContext.Provider>
  );
};

export const useProgramContext = () => {
  const context = useContext(ProgramContext);
  if (context === undefined) {
    throw new Error('useProgramContext must be used within a ProgramProvider');
  }
  return context;
};
