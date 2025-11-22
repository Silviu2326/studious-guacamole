import { useEffect } from 'react';
import { useProgramContext } from '../context/ProgramContext';
import { useEditorToast } from '../components/feedback/ToastSystem';
import { VersioningService } from '../services/VersioningService';
import { Day, Exercise } from '../types/training';

interface UseKeyboardShortcutsProps {
  activeDayId: string | null;
}

export const useKeyboardShortcuts = ({ activeDayId }: UseKeyboardShortcutsProps) => {
  const { daysData, setProgramData, saveCurrentVersion } = useProgramContext();
  const { addToast } = useEditorToast();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if focus is on an input/textarea/contentEditable, unless it's a global command
      const target = e.target as HTMLElement;
      const isInput = target.tagName === 'INPUT' || 
                      target.tagName === 'TEXTAREA' || 
                      target.isContentEditable;
      
      const isCmdOrCtrl = e.metaKey || e.ctrlKey;

      // Global commands allowed in inputs: Cmd+S (Save), Cmd+Enter (Save/Submit)
      const isGlobalCommand = isCmdOrCtrl && (e.key === 's' || e.key === 'Enter');

      if (isInput && !isGlobalCommand) return;

      // --- Shortcuts Implementation ---

      // Cmd+Z: Undo
      if (isCmdOrCtrl && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        handleUndo();
        return;
      }

      // Cmd+D: Duplicate Day
      if (isCmdOrCtrl && e.key === 'd') {
        e.preventDefault();
        if (activeDayId) {
            handleDuplicateDay(activeDayId);
        } else {
            addToast({
                type: 'info',
                title: 'Selecciona un día',
                message: 'Haz click en un día para duplicarlo',
                duration: 2000
            });
        }
        return;
      }

      // . (Dot): Add Exercise
      if (e.key === '.') {
        e.preventDefault();
        if (activeDayId) {
            handleAddExercise(activeDayId);
        } else {
             addToast({
                type: 'info',
                title: 'Selecciona un día',
                message: 'Haz click en un día para agregar un ejercicio',
                duration: 2000
            });
        }
        return;
      }
      
      // Cmd+S: Save (Explicit)
      if (isCmdOrCtrl && e.key === 's') {
          e.preventDefault();
          saveCurrentVersion('Guardado manual');
          addToast({ type: 'success', title: 'Guardado exitosamente', duration: 2000 });
          return;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [daysData, activeDayId, setProgramData, saveCurrentVersion, addToast]);

  // --- Action Handlers ---

  const handleUndo = () => {
      const versions = VersioningService.getVersions();
      // We need at least 2 versions to undo (current + previous)
      // Or if current state is not saved yet, maybe just restore the last saved?
      // For simplicity, we restore the version at index 1 (previous).
      
      if (versions.length > 0) {
          // If the top version is very recent (e.g. just auto-saved), we might want to go to index 1.
          // If we haven't saved recently, index 0 is the last stable state.
          // Let's try restoring index 1 if available, else index 0.
          
          const versionToRestore = versions.length > 1 ? versions[1] : versions[0];
          
          // Check if current data is different from top version? 
          // Assume user wants to go back.
          
          if (versionToRestore) {
               setProgramData(versionToRestore.data);
               
               // Optional: We could delete the top version to make it a true "pop", 
               // but VersioningService is append-only log usually. 
               // We just restore data.
               
               addToast({ 
                 type: 'info', 
                 title: 'Deshacer', 
                 message: `Restaurado a: ${versionToRestore.label}`, 
                 duration: 2000 
               });
          }
      } else {
          addToast({ type: 'warning', title: 'No hay historial para deshacer', duration: 2000 });
      }
  };

  const handleDuplicateDay = (dayId: string) => {
      const dayIndex = daysData.findIndex(d => d.id === dayId);
      if (dayIndex === -1) return;

      const dayToDuplicate = daysData[dayIndex];
      const newDay: Day = {
          ...JSON.parse(JSON.stringify(dayToDuplicate)),
          id: `d_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
          name: `${dayToDuplicate.name} (Copia)`
      };
      
      const newDays = [...daysData];
      // Insert after the original day
      newDays.splice(dayIndex + 1, 0, newDay);
      
      setProgramData(newDays);
      saveCurrentVersion(`Duplicado día ${dayToDuplicate.name}`);
      
      addToast({ 
        type: 'success', 
        title: 'Día duplicado', 
        message: `${dayToDuplicate.name} ha sido duplicado`,
        duration: 2000 
      });
  };

  const handleAddExercise = (dayId: string) => {
      const dayIndex = daysData.findIndex(d => d.id === dayId);
      if (dayIndex === -1) return;

      const newDays = [...daysData];
      const day = newDays[dayIndex];

      // Ensure at least one block exists
      if (day.blocks.length === 0) {
          day.blocks.push({
              id: `b_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
              name: 'Bloque Principal',
              type: 'main',
              exercises: [],
              duration: 0
          });
      }
      
      // Add to the last block by default
      const blockIndex = day.blocks.length - 1;
      const block = day.blocks[blockIndex];
      
      const newExercise: Exercise = {
          id: `e_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
          name: 'Nuevo Ejercicio',
          type: 'strength',
          tags: [],
          sets: [{ 
            id: `s_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`, 
            type: 'working', 
            reps: 10, 
            rpe: 8, 
            rest: 60 
          }]
      };
      
      block.exercises.push(newExercise);
      
      setProgramData(newDays);
      saveCurrentVersion(`Agregado ejercicio a ${day.name}`);
      
      addToast({ 
        type: 'success', 
        title: 'Ejercicio añadido', 
        message: 'Se agregó un nuevo ejercicio al final del día',
        duration: 2000 
      });
  };
};
