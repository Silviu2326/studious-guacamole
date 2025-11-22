import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Exercise } from '../types/training';

interface UIContextType {
  isFitCoachOpen: boolean;
  toggleFitCoach: () => void;
  isCommandPaletteOpen: boolean;
  setCommandPaletteOpen: (isOpen: boolean) => void;
  isVersionHistoryOpen: boolean;
  setVersionHistoryOpen: (isOpen: boolean) => void;
  isExportModalOpen: boolean;
  setExportModalOpen: (isOpen: boolean) => void;
  
  // Exercise Detail Modal
  selectedExercise: Exercise | null;
  setSelectedExercise: (exercise: Exercise | null) => void;
  isExerciseDetailModalOpen: boolean;
  setExerciseDetailModalOpen: (isOpen: boolean) => void;

  // Preferences Modal
  isPreferencesModalOpen: boolean;
  setPreferencesModalOpen: (isOpen: boolean) => void;
}

const UIContext = createContext<UIContextType | undefined>(undefined);

export const UIProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isFitCoachOpen, setIsFitCoachOpen] = useState(false);
  const [isCommandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [isVersionHistoryOpen, setVersionHistoryOpen] = useState(false);
  const [isExportModalOpen, setExportModalOpen] = useState(false);
  const [isPreferencesModalOpen, setPreferencesModalOpen] = useState(false);
  
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [isExerciseDetailModalOpen, setExerciseDetailModalOpen] = useState(false);

  const toggleFitCoach = () => {
    setIsFitCoachOpen((prev) => !prev);
  };

  return (
    <UIContext.Provider value={{ 
      isFitCoachOpen, 
      toggleFitCoach,
      isCommandPaletteOpen,
      setCommandPaletteOpen,
      isVersionHistoryOpen,
      setVersionHistoryOpen,
      isExportModalOpen,
      setExportModalOpen,
      selectedExercise,
      setSelectedExercise,
      isExerciseDetailModalOpen,
      setExerciseDetailModalOpen,
      isPreferencesModalOpen,
      setPreferencesModalOpen
    }}>
      {children}
    </UIContext.Provider>
  );
};

export const useUIContext = () => {
  const context = useContext(UIContext);
  if (context === undefined) {
    throw new Error('useUIContext must be used within a UIProvider');
  }
  return context;
};
