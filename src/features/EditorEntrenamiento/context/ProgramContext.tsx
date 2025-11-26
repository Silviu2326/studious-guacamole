import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback, useMemo } from 'react';
import { Day, Tag, Week } from '../types/training';
import { VersioningService } from '../services/VersioningService';
import { offlineQueue } from '../utils/offlineQueue';
import { MockApiService } from '../services/MockApiService';

import { useHistory } from '../hooks/useHistory';

interface ProgramContextType {
  weeks: Week[];
  daysData: Day[]; // Computed for backward compatibility
  updateDay: (dayId: string, newDay: Day) => void;
  setProgramData: (data: Week[]) => void; // Updated to accept Week[]
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
  // Tag Management
  globalTags: Tag[];
  createTag: (tag: Tag) => void;
  updateTag: (tagId: string, updates: Partial<Tag>) => void;
  deleteTag: (tagId: string) => void;
  mergeTags: (sourceTagId: string, targetTagId: string) => void;
  addWeek: () => void;
}

const ProgramContext = createContext<ProgramContextType | undefined>(undefined);

const INITIAL_TAGS: Tag[] = [
  { id: 't1', label: 'Fuerza', color: 'blue', category: 'pattern' },
  { id: 't2', label: 'Upper', color: 'red', category: 'muscle' },
  { id: 't3', label: 'Cardio', color: 'green', category: 'other' },
  { id: 't4', label: 'HIIT', color: 'orange', category: 'intensity' },
  { id: 't5', label: 'Descanso', color: 'gray', category: 'other' },
];

// Mock Initial Data
const INITIAL_WEEKS: Week[] = [
  {
    id: 'w1',
    name: 'Semana 1',
    days: [
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
    { id: 'd4', name: 'JUEVES', tags: [{id: 't1', label: 'Fuerza', color: 'blue', category: 'pattern'}], blocks: [], totalDuration: 70, averageRpe: 7 },
    { id: 'd5', name: 'VIERNES', tags: [{id: 't1', label: 'Fuerza', color: 'blue', category: 'pattern'}], blocks: [], totalDuration: 40, averageRpe: 8 },
    { id: 'd6', name: 'SÁBADO', tags: [{id: 't1', label: 'Fuerza', color: 'blue', category: 'pattern'}], blocks: [], totalDuration: 30, averageRpe: 4 },
    { id: 'd7', name: 'DOMINGO', tags: [{id: 't1', label: 'Descanso', color: 'gray', category: 'other'}], blocks: [], totalDuration: 0, averageRpe: 0 },
  ]
  }
];

export const ProgramProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { state: weeks, set: setWeeks, undo, redo, canUndo, canRedo } = useHistory<Week[]>(INITIAL_WEEKS);
  const [globalTags, setGlobalTags] = useState<Tag[]>(INITIAL_TAGS);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null);
  
  // Computed property for backward compatibility
  const daysData = useMemo(() => weeks.flatMap(week => week.days), [weeks]);

  // Offline Sync State
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [pendingSyncCount, setPendingSyncCount] = useState(0);

  const updateDay = useCallback((dayId: string, newDay: Day) => {
    setWeeks(prevWeeks => prevWeeks.map(week => ({
      ...week,
      days: week.days.map(d => d.id === dayId ? newDay : d)
    })));
  }, [setWeeks]);

  const setProgramData = useCallback((data: Week[]) => {
    setWeeks(data);
  }, [setWeeks]);

  // Tag Management
  const createTag = useCallback((tag: Tag) => {
    setGlobalTags(prev => [...prev, tag]);
  }, []);

  const updateTag = useCallback((tagId: string, updates: Partial<Tag>) => {
    setGlobalTags(prev => prev.map(t => t.id === tagId ? { ...t, ...updates } : t));
    
    // Update occurrences in weeks
    setWeeks(prevWeeks => prevWeeks.map(week => ({
        ...week,
        days: week.days.map(day => {
            // Update day tags
            const updatedDayTags = day.tags.map(t => t.id === tagId ? { ...t, ...updates } : t);
            
            // Update block/exercise tags
            const updatedBlocks = day.blocks.map(block => {
                const updatedExercises = block.exercises.map(ex => {
                    const updatedExTags = ex.tags.map(t => t.id === tagId ? { ...t, ...updates } : t);
                    return { ...ex, tags: updatedExTags };
                });
                return { ...block, exercises: updatedExercises };
            });

            return { ...day, tags: updatedDayTags, blocks: updatedBlocks };
        })
    })));
  }, [setWeeks]);

  const deleteTag = useCallback((tagId: string) => {
    setGlobalTags(prev => prev.filter(t => t.id !== tagId));
    
    // Remove occurrences in weeks
    setWeeks(prevWeeks => prevWeeks.map(week => ({
        ...week,
        days: week.days.map(day => {
            const updatedDayTags = day.tags.filter(t => t.id !== tagId);
            const updatedBlocks = day.blocks.map(block => {
                const updatedExercises = block.exercises.map(ex => {
                    const updatedExTags = ex.tags.filter(t => t.id !== tagId);
                    return { ...ex, tags: updatedExTags };
                });
                return { ...block, exercises: updatedExercises };
            });
            return { ...day, tags: updatedDayTags, blocks: updatedBlocks };
        })
    })));
  }, [setWeeks]);

  const mergeTags = useCallback((sourceTagId: string, targetTagId: string) => {
    const targetTag = globalTags.find(t => t.id === targetTagId);
    if (!targetTag) return;

    setGlobalTags(prev => prev.filter(t => t.id !== sourceTagId));

    setWeeks(prevWeeks => prevWeeks.map(week => ({
        ...week,
        days: week.days.map(day => {
            // Update day tags
            let dayTags = day.tags.filter(t => t.id !== sourceTagId);
            // Check if targetTag is already present
            if (day.tags.some(t => t.id === sourceTagId) && !dayTags.some(t => t.id === targetTagId)) {
                dayTags.push(targetTag);
            }
            
            const updatedBlocks = day.blocks.map(block => {
                const updatedExercises = block.exercises.map(ex => {
                    let exTags = ex.tags.filter(t => t.id !== sourceTagId);
                    if (ex.tags.some(t => t.id === sourceTagId) && !exTags.some(t => t.id === targetTagId)) {
                        exTags.push(targetTag);
                    }
                    return { ...ex, tags: exTags };
                });
                return { ...block, exercises: updatedExercises };
            });

            return { ...day, tags: dayTags, blocks: updatedBlocks };
        })
    })));
  }, [globalTags, setWeeks]);

  const addWeek = useCallback(() => {
    const daysOfWeek = ['LUNES', 'MARTES', 'MIÉRCOLES', 'JUEVES', 'VIERNES', 'SÁBADO', 'DOMINGO'];
    const newDays: Day[] = daysOfWeek.map(dayName => ({
      id: crypto.randomUUID(),
      name: dayName,
      blocks: [],
      tags: [],
      totalDuration: 0,
      averageRpe: 0
    }));

    const newWeek: Week = {
        id: crypto.randomUUID(),
        name: `Semana ${weeks.length + 1}`,
        days: newDays
    };
    
    setWeeks(prev => [...prev, newWeek]);
  }, [weeks.length, setWeeks]);

  const bulkUpdateExercises = useCallback((targetIds: string[], action: { type: 'SET_PROPERTY' | 'MULTIPLY_PROPERTY' | 'ADD_SETS_FACTOR', field: string, value: number }) => {
    setWeeks(prevWeeks => {
      return prevWeeks.map(week => ({
          ...week,
          days: week.days.map(day => {
            // If Day is selected, everything inside is selected
            const daySelected = targetIds.includes(day.id);
            
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
          })
      }));
    });
  }, [setWeeks]);

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
      // We need to save 'weeks' now, but VersioningService might expect Day[] or we can change it to expect any data
      // Assuming VersioningService uses generic type T
      VersioningService.saveVersion(weeks, label);
      setLastSavedAt(new Date());
    } catch (e) {
      console.error('Local save failed', e);
    }

    // 2. Try to save to "Remote" (Mock API)
    try {
      await MockApiService.saveProgram(weeks, label);
    } catch (error) {
      console.warn('Remote save failed, adding to offline queue', error);
      offlineQueue.addOperation({
        type: 'save_program',
        data: weeks,
        label
      });
    } finally {
      setIsSaving(false);
    }
  }, [weeks]);

  // Autosave effect
  useEffect(() => {
    const interval = setInterval(() => {
      saveCurrentVersion(); // Auto-save
    }, 30000); // 30 seconds

    return () => clearInterval(interval);
  }, [saveCurrentVersion]);

  return (
    <ProgramContext.Provider value={{ 
      weeks,
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
      bulkUpdateExercises,
      globalTags,
      createTag,
      updateTag,
      deleteTag,
      mergeTags,
      addWeek
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
