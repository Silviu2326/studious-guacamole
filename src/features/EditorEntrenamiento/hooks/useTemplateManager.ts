import { useState, useCallback } from 'react';
import { useProgramContext } from '../context/ProgramContext';
import { Day, Block, Exercise, Set } from '../types/training';

export interface Template {
  id: string;
  name: string;
  createdAt: string;
  type: 'week' | 'program'; 
  data: Day[];
  isSanitized: boolean;
}

export const useTemplateManager = () => {
  const { daysData } = useProgramContext();
  const [templates, setTemplates] = useState<Template[]>(() => {
    try {
        const saved = localStorage.getItem('savedTemplates');
        return saved ? JSON.parse(saved) : [];
    } catch (e) {
        console.error("Error parsing templates from localStorage", e);
        return [];
    }
  });

  const saveAsTemplate = useCallback((name: string, sanitize: boolean): Template => {
    const processSet = (set: Set): Set => {
      if (!sanitize) return set;
      // Remove weight, keep reps, rpe, rest
      // We create a new object excluding specific load parameters
      const { weight, percentage, ...rest } = set;
      return rest as Set;
    };

    const processExercise = (ex: Exercise): Exercise => ({
      ...ex,
      sets: ex.sets ? ex.sets.map(processSet) : [],
    });

    const processBlock = (block: Block): Block => ({
      ...block,
      exercises: block.exercises ? block.exercises.map(processExercise) : [],
    });

    const processDay = (day: Day): Day => ({
      ...day,
      blocks: day.blocks ? day.blocks.map(processBlock) : [],
    });

    const templateData = daysData.map(processDay);

    const newTemplate: Template = {
      id: crypto.randomUUID(),
      name,
      createdAt: new Date().toISOString(),
      type: 'week',
      data: templateData,
      isSanitized: sanitize,
    };

    setTemplates(prev => {
        const updated = [...prev, newTemplate];
        localStorage.setItem('savedTemplates', JSON.stringify(updated));
        return updated;
    });
    
    return newTemplate;
  }, [daysData]);

  const deleteTemplate = useCallback((id: string) => {
     setTemplates(prev => {
         const updated = prev.filter(t => t.id !== id);
         localStorage.setItem('savedTemplates', JSON.stringify(updated));
         return updated;
     });
  }, []);

  return {
    templates,
    saveAsTemplate,
    deleteTemplate
  };
};
