import React from 'react';
import { DndContext } from '@dnd-kit/core';
import { TopBar } from '../components/TopBar';
import { LibraryPanel } from '../components/LibraryPanel';
import { EditorCanvas } from '../components/EditorCanvas';
import { FitCoachPanel } from '../components/FitCoachPanel';
import { UIProvider } from '../context/UIContext';
import { ProgramProvider } from '../context/ProgramContext';
import { UserPreferencesProvider } from '../context/UserPreferencesContext';
import { ToastProvider } from '../components/feedback/ToastSystem';
import { VersionHistoryModal } from '../components/modals/VersionHistoryModal';
import { ExportModal } from '../components/modals/ExportModal';
import { ExerciseDetailModal } from '../components/modals/ExerciseDetailModal';
import { PreferencesModal } from '../components/modals/PreferencesModal';

import { CommandPalette } from '../components/overlays/CommandPalette';
import { EditorTour } from '../components/onboarding/EditorTour';

import '../styles/print.css';

export const EditorLayout: React.FC = () => {
  return (
    <UIProvider>
      <UserPreferencesProvider>
        <ProgramProvider>
          <ToastProvider>
            <DndContext>
              <div className="flex flex-col h-screen bg-gray-100 overflow-hidden font-sans">
                <div className="no-print">
                  <TopBar />
                </div>
                
                <div className="flex-1 flex overflow-hidden">
                  <div className="no-print h-full">
                    <LibraryPanel />
                  </div>
                  <EditorCanvas />
                  <div className="no-print h-full">
                    <FitCoachPanel />
                  </div>
                </div>
                
                <div className="no-print">
                  <CommandPalette />
                  <VersionHistoryModal />
                  <ExportModal />
                  <ExerciseDetailModal />
                  <PreferencesModal />
                  <EditorTour />
                </div>
              </div>
            </DndContext>
          </ToastProvider>
        </ProgramProvider>
      </UserPreferencesProvider>
    </UIProvider>
  );
};
