import React from 'react';
import { DndContext } from '@dnd-kit/core';
import { TopBar } from '../components/TopBar';
import { LibraryPanel } from '../components/LibraryPanel';
import { EditorCanvas } from '../components/EditorCanvas';
import { FitCoachPanel } from '../components/FitCoachPanel';
import { UIProvider } from '../context/UIContext';

export const EditorLayout: React.FC = () => {
  return (
    <UIProvider>
      <DndContext>
        <div className="flex flex-col h-screen bg-gray-100 overflow-hidden font-sans">
          <TopBar />
          
          <div className="flex-1 flex overflow-hidden">
            <LibraryPanel />
            <EditorCanvas />
            <FitCoachPanel />
          </div>
        </div>
      </DndContext>
    </UIProvider>
  );
};
