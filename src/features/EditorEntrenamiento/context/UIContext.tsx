import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Exercise } from '../types/training';

interface UIContextType {
  // FitCoach
  isFitCoachOpen: boolean;
  toggleFitCoach: () => void;
  openFitCoach: (tab?: string) => void;
  fitCoachActiveTab: string;
  setFitCoachActiveTab: (tab: string) => void;

  // Command Palette
  isCommandPaletteOpen: boolean;
  setCommandPaletteOpen: (isOpen: boolean) => void;

  // Version History
  isVersionHistoryOpen: boolean;
  setVersionHistoryOpen: (isOpen: boolean) => void;

  // Export Modal
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

  // Client Preview
  isClientPreviewOpen: boolean;
  setClientPreviewOpen: (isOpen: boolean) => void;

  // AI Program Generator
  isAIProgramGeneratorOpen: boolean;
  setAIProgramGeneratorOpen: (isOpen: boolean) => void;

  // Tag Manager Modal
  isTagManagerOpen: boolean;
  setTagManagerOpen: (isOpen: boolean) => void;

  // Batch Training Modal
  isBatchTrainingOpen: boolean;
  setBatchTrainingOpen: (isOpen: boolean) => void;
}

const UIContext = createContext<UIContextType | undefined>(undefined);

export const UIProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isFitCoachOpen, setIsFitCoachOpen] = useState(false);
  const [fitCoachActiveTab, setFitCoachActiveTab] = useState('Chat');
  const [isCommandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [isVersionHistoryOpen, setVersionHistoryOpen] = useState(false);
  const [isExportModalOpen, setExportModalOpen] = useState(false);
  const [isPreferencesModalOpen, setPreferencesModalOpen] = useState(false);
  const [isClientPreviewOpen, setClientPreviewOpen] = useState(false);
  const [isAIProgramGeneratorOpen, setAIProgramGeneratorOpen] = useState(false);
  const [isTagManagerOpen, setTagManagerOpen] = useState(false);
  const [isBatchTrainingOpen, setBatchTrainingOpen] = useState(false);

  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [isExerciseDetailModalOpen, setExerciseDetailModalOpen] = useState(false);

  const toggleFitCoach = () => {
    setIsFitCoachOpen((prev) => !prev);
  };

  const openFitCoach = (tab?: string) => {
    if (tab) setFitCoachActiveTab(tab);
    setIsFitCoachOpen(true);
  };

  return (
    <UIContext.Provider value={{
      isFitCoachOpen,
      toggleFitCoach,
      openFitCoach,
      fitCoachActiveTab,
      setFitCoachActiveTab,
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
      setPreferencesModalOpen,
      isClientPreviewOpen,
      setClientPreviewOpen,
      isAIProgramGeneratorOpen,
      setAIProgramGeneratorOpen,
      isTagManagerOpen,
      setTagManagerOpen,
      isBatchTrainingOpen,
      setBatchTrainingOpen
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
