import { Day, Block, Exercise, Set } from '../types/training';
import { useEditorToast } from '../components/feedback/ToastSystem';

const CLIPBOARD_KEY = 'training_editor_clipboard';

export interface ClipboardItem {
  type: 'day' | 'block' | 'exercise';
  data: Day | Block | Exercise;
  timestamp: number;
}

// Helper to generate IDs
const generateId = () => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return Math.random().toString(36).substring(2, 15);
};

// Deep clone and regenerate IDs for a Set
const cloneSet = (set: Set): Set => ({
  ...set,
  id: generateId(),
});

// Deep clone and regenerate IDs for an Exercise
const cloneExercise = (exercise: Exercise): Exercise => ({
  ...exercise,
  id: generateId(),
  sets: exercise.sets.map(cloneSet),
});

// Deep clone and regenerate IDs for a Block
const cloneBlock = (block: Block): Block => ({
  ...block,
  id: generateId(),
  exercises: block.exercises.map(cloneExercise),
});

// Deep clone and regenerate IDs for a Day (blocks only, keeps other meta if needed, but usually we paste blocks)
// When pasting a Day, we often want the blocks.
const cloneDayContent = (day: Day): Day => ({
  ...day,
  // We don't regenerate Day ID here usually because the target day exists, 
  // but the blocks inside must be new instances.
  blocks: day.blocks.map(cloneBlock),
});

// --- Low Level Utils ---

export const saveToClipboard = (
  type: 'day' | 'block' | 'exercise',
  data: Day | Block | Exercise
) => {
  try {
    const item: ClipboardItem = {
      type,
      data,
      timestamp: Date.now(),
    };
    localStorage.setItem(CLIPBOARD_KEY, JSON.stringify(item));
    return true;
  } catch (error) {
    console.error('Clipboard save error:', error);
    return false;
  }
};

export const getClipboardContent = (): ClipboardItem | null => {
  try {
    const itemStr = localStorage.getItem(CLIPBOARD_KEY);
    if (!itemStr) return null;
    return JSON.parse(itemStr) as ClipboardItem;
  } catch (error) {
    console.error('Clipboard read error:', error);
    return null;
  }
};

// --- Hook ---

export const useTrainingClipboard = () => {
  const { addToast } = useEditorToast();

  const copy = (type: 'day' | 'block' | 'exercise', data: Day | Block | Exercise) => {
    const success = saveToClipboard(type, data);
    if (success) {
      let label = '';
      switch (type) {
        case 'day': label = 'Día'; break;
        case 'block': label = 'Bloque'; break;
        case 'exercise': label = 'Ejercicio'; break;
      }
      
      addToast({
        type: 'success',
        title: 'Copiado',
        message: `${label} copiado al portapapeles.`,
        duration: 2000
      });
    } else {
      addToast({
        type: 'error',
        title: 'Error',
        message: 'No se pudo guardar en el portapapeles.'
      });
    }
  };

  /**
   * Checks if pasting a Day causes a conflict.
   * Returns status and the source data if available.
   */
  const checkPasteDayConflict = (targetDay: Day): { 
    status: 'empty_clipboard' | 'invalid_type' | 'conflict' | 'ready'; 
    sourceDay?: Day 
  } => {
    const content = getClipboardContent();
    if (!content) return { status: 'empty_clipboard' };
    if (content.type !== 'day') return { status: 'invalid_type' };

    const sourceDay = content.data as Day;
    const targetHasContent = targetDay.blocks && targetDay.blocks.length > 0;

    if (targetHasContent) {
      return { status: 'conflict', sourceDay };
    }
    
    return { status: 'ready', sourceDay };
  };

  /**
   * Performs the paste action for a Day.
   * Automatically handles ID regeneration.
   */
  const performPasteDay = (
    action: 'overwrite' | 'append',
    targetDay: Day,
    sourceDay: Day,
    onUpdate: (d: Day) => void
  ) => {
    // Clone source content with new IDs to avoid reference issues
    const rehydratedSource = cloneDayContent(sourceDay);

    let newDay: Day;

    if (action === 'overwrite') {
      newDay = {
        ...rehydratedSource,
        id: targetDay.id, // Keep target identity
        date: targetDay.date, // Keep target date
        name: rehydratedSource.name || targetDay.name, // Maybe take source name? Usually yes.
      };
    } else {
      // Append
      newDay = {
        ...targetDay,
        blocks: [...targetDay.blocks, ...rehydratedSource.blocks]
      };
    }

    onUpdate(newDay);
    
    addToast({
      type: 'success',
      title: action === 'overwrite' ? 'Día reemplazado' : 'Bloques añadidos',
      message: 'El contenido se ha pegado correctamente.'
    });
  };

  return {
    copy,
    checkPasteDayConflict,
    performPasteDay,
    getClipboardContent
  };
};
