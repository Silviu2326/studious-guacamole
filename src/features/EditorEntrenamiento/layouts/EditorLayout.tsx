import React from 'react';
import { GlobalDnDContext } from '../context/GlobalDnDContext';
import { TopBar } from '../components/TopBar';
import { LibraryPanel } from '../components/LibraryPanel';
import { EditorCanvas } from '../components/EditorCanvas';
import { FitCoachPanel } from '../components/FitCoachPanel';
import { UIProvider } from '../context/UIContext';
import { ProgramProvider } from '../context/ProgramContext';
import { UserPreferencesProvider } from '../context/UserPreferencesContext';
import { CollaborationProvider } from '../context/CollaborationContext';
import { ToastProvider } from '../components/feedback/ToastSystem';
import { VersionHistoryModal } from '../components/modals/VersionHistoryModal';
import { ExportModal } from '../components/modals/ExportModal';
import { ExerciseDetailModal } from '../components/modals/ExerciseDetailModal';
import { PreferencesModal } from '../components/modals/PreferencesModal';
import { AIProgramGenerator } from '../components/modals/AIProgramGenerator';
import { TagManagerModal } from '../components/modals/TagManagerModal';
import { BatchTrainingModal } from '../components/modals/BatchTraining/BatchTrainingModal';

import { CommandPalette } from '../components/overlays/CommandPalette';
import { EditorTour } from '../components/onboarding/EditorTour';
import { ClientMobilePreview } from '../components/preview/ClientMobilePreview';

import '../styles/print.css';

export const EditorLayout: React.FC = () => {
  return (
    <UIProvider>
      <UserPreferencesProvider>
        <CollaborationProvider>
          <ProgramProvider>
            <ToastProvider>
              <GlobalDnDContext>
              <div className="flex flex-col h-screen bg-gray-100 overflow-hidden font-sans">
                <div className="no-print">
                  <TopBar />
                </div>
                
                <div className="flex-1 flex overflow-hidden">
                  <div className="no-print h-full flex-shrink-0">
                    <LibraryPanel />
                  </div>
                  <EditorCanvas />
                  <div className="no-print h-full flex-shrink-0">
                    <FitCoachPanel />
                  </div>
                </div>
                
                <div className="no-print">
                  <ClientMobilePreview />
                  <CommandPalette />
                  <VersionHistoryModal />
                  <ExportModal />
                  <ExerciseDetailModal />
                  <PreferencesModal />
                  <TagManagerModal />
                  <UIContextConsumer>
                    {({ isBatchTrainingOpen, setBatchTrainingOpen }) => (
                      <BatchTrainingModal 
                        isOpen={isBatchTrainingOpen} 
                        onClose={() => setBatchTrainingOpen(false)} 
                      />
                    )}
                  </UIContextConsumer>
                  <AIProgramGenerator />
                  <EditorTour />
                </div>
              </div>
              </GlobalDnDContext>
            </ToastProvider>
          </ProgramProvider>
        </CollaborationProvider>
      </UserPreferencesProvider>
    </UIProvider>
  );
};

// Helper to consume context inside the provider tree
import { useUIContext } from '../context/UIContext';
const UIContextConsumer: React.FC<{ children: (context: ReturnType<typeof useUIContext>) => React.ReactNode }> = ({ children }) => {
  const context = useUIContext();
  return <>{children(context)}</>;
};
