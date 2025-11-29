import React, { Suspense } from 'react';
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
import { CommandPalette } from '../components/overlays/CommandPalette';
import { EditorTour } from '../components/onboarding/EditorTour';
import { ClientMobilePreview } from '../components/preview/ClientMobilePreview';
import { Spinner } from '../../../components/componentsreutilizables/Spinner';

import '../styles/print.css';

// Lazy load modals
const VersionHistoryModal = React.lazy(() => import('../components/modals/VersionHistoryModal').then(module => ({ default: module.VersionHistoryModal })));
const ExportModal = React.lazy(() => import('../components/modals/ExportModal').then(module => ({ default: module.ExportModal })));
const ExerciseDetailModal = React.lazy(() => import('../components/modals/ExerciseDetailModal').then(module => ({ default: module.ExerciseDetailModal })));
const PreferencesModal = React.lazy(() => import('../components/modals/PreferencesModal').then(module => ({ default: module.PreferencesModal })));
const AIProgramGenerator = React.lazy(() => import('../components/modals/AIProgramGenerator').then(module => ({ default: module.AIProgramGenerator })));
const TagManagerModal = React.lazy(() => import('../components/modals/TagManagerModal').then(module => ({ default: module.TagManagerModal })));
const BatchTrainingModal = React.lazy(() => import('../components/modals/BatchTraining/BatchTrainingModal').then(module => ({ default: module.BatchTrainingModal })));

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
                    <Suspense fallback={<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20"><Spinner size="lg" /></div>}>
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
                    </Suspense>
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
