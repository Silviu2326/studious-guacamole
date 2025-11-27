// src/features/EditorEntrenamiento/components/TopBar.tsx

import React, { useEffect, useRef, useState } from 'react';
import { Sparkles, Menu, Download, WifiOff, RefreshCw, CornerUpLeft, CornerUpRight, Smartphone, Plus, Flame, Package } from 'lucide-react';

import ClientSelector, { ClientSelectorHandle } from './ClientSelector';
import AutoSaveIndicator from './AutoSaveIndicator';
import { useUIContext } from '../context/UIContext';
import { useProgramContext } from '../context/ProgramContext';
import UserActionsMenu from './UserActionsMenu';
import { useEditorToast } from './feedback/ToastSystem';
import { ExportModal } from './modals/ExportModal';
import { VariationGeneratorModal } from './modals/VariationGeneratorModal';
import { generateProgramVariation } from '../logic/aiGenerator';

export const TopBar: React.FC = () => {
  const { isFitCoachOpen, toggleFitCoach, setCommandPaletteOpen, setVersionHistoryOpen, setExportModalOpen, setClientPreviewOpen, setBatchTrainingOpen } = useUIContext();
  const { isSaving, lastSavedAt, saveCurrentVersion, isOffline, pendingSyncCount, undo, redo, canUndo, canRedo, addWeek, weeks, setProgramData } = useProgramContext();
  const { addToast } = useEditorToast();
  const clientSelectorRef = useRef<ClientSelectorHandle>(null);
  
  const [isVariationModalOpen, setVariationModalOpen] = useState(false);
  const [isGeneratingVariation, setGeneratingVariation] = useState(false);
  
  // Mock notification state - connect to real store later
  const hasNotification = false; 

  const handleCopyProgram = async () => {
      try {
          const programJson = JSON.stringify(weeks, null, 2);
          await navigator.clipboard.writeText(programJson);
          addToast({
              type: 'success',
              title: 'Programa Copiado',
              message: 'El JSON del programa se ha copiado al portapapeles.',
              duration: 3000
          });
      } catch (err) {
          console.error('Error copying program:', err);
          addToast({
              type: 'error',
              title: 'Error al copiar',
              message: 'No se pudo copiar el programa al portapapeles.',
              duration: 3000
          });
      }
  };

  const handleGenerateVariation = async (instruction: string) => {
      setGeneratingVariation(true);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      try {
          const newWeeks = generateProgramVariation(weeks, instruction);
          setProgramData(newWeeks);
          addToast({
              type: 'success',
              title: 'Variación Generada',
              message: 'Se ha creado una nueva versión del programa basada en tus instrucciones.',
              duration: 4000
          });
          setVariationModalOpen(false);
      } catch (err) {
          addToast({
              type: 'error',
              title: 'Error',
              message: 'No se pudo generar la variación.',
          });
      } finally {
          setGeneratingVariation(false);
      }
  }; 

  // Global Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd+K or Ctrl+K: Open Command Palette
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setCommandPaletteOpen(true);
      }

      // Cmd+/ or Ctrl+/: Toggle FitCoach
      if ((e.metaKey || e.ctrlKey) && e.key === '/') {
        e.preventDefault();
        toggleFitCoach();
      }
      
      // Cmd+S or Ctrl+S: Manual Save (Prevent browser save)
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 's') {
        e.preventDefault();
        console.log('Manual save triggered');
        saveCurrentVersion('Guardado Manual');
        addToast({
          type: 'success',
          title: 'Guardado exitosamente',
          message: 'Tus cambios se han guardado correctamente.',
          duration: 3000
        });
      }

      // Cmd+Z: Undo
      if ((e.metaKey || e.ctrlKey) && !e.shiftKey && e.key.toLowerCase() === 'z') {
        e.preventDefault();
        if (canUndo) undo();
      }

      // Cmd+Shift+Z or Cmd+Y: Redo
      if (((e.metaKey || e.ctrlKey) && e.shiftKey && e.key.toLowerCase() === 'z') || 
          ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'y')) {
        e.preventDefault();
        if (canRedo) redo();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [toggleFitCoach, addToast, setCommandPaletteOpen, saveCurrentVersion, undo, redo, canUndo, canRedo]);

  return (
    <>
      <header className="h-16 sticky top-0 z-50 bg-white border-b border-gray-200 px-4 lg:px-6 flex items-center justify-between">
        {/* Zona Izquierda */}
        <div className="flex justify-start items-center gap-4">
          {/* Hamburger Menu - Mobile Only (< 640px) */}
          <button 
            className="sm:hidden p-2 -ml-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Abrir menú de navegación"
            aria-haspopup="true"
          >
            <Menu className="w-6 h-6" />
          </button>

          {/* Logo - Hidden on Mobile, Icon on Tablet, Full on Desktop */}
          {/* REMOVED FITPRO LOGO */}
          <ClientSelector ref={clientSelectorRef} />
          
          <div className="h-6 w-px bg-gray-200 hidden sm:block"></div>

          {/* Undo/Redo Actions */}
          <div className="flex items-center gap-1 hidden sm:flex">
            <button
              onClick={undo}
              disabled={!canUndo}
              className={`p-1.5 rounded-lg transition-colors ${
                canUndo 
                  ? 'text-gray-600 hover:bg-gray-100 hover:text-gray-900' 
                  : 'text-gray-300 cursor-not-allowed'
              }`}
              aria-label="Deshacer (Cmd+Z)"
              title="Deshacer (Cmd+Z)"
            >
              <CornerUpLeft size={18} />
            </button>
            <button
              onClick={redo}
              disabled={!canRedo}
              className={`p-1.5 rounded-lg transition-colors ${
                canRedo 
                  ? 'text-gray-600 hover:bg-gray-100 hover:text-gray-900' 
                  : 'text-gray-300 cursor-not-allowed'
              }`}
              aria-label="Rehacer (Cmd+Shift+Z)"
              title="Rehacer (Cmd+Shift+Z)"
            >
              <CornerUpRight size={18} />
            </button>
          </div>
        </div>

        {/* Zona Central */}
        <div className="flex justify-center items-center gap-2">
          {/* Offline / Sync Indicator */}
          {isOffline && (
            <div className="flex items-center gap-2 px-3 py-1 bg-amber-50 text-amber-700 rounded-full text-xs font-medium border border-amber-200 animate-pulse">
              <WifiOff size={14} />
              <span>Sin conexión - Guardando localmente</span>
            </div>
          )}
          
          {!isOffline && pendingSyncCount > 0 && (
            <div className="flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium border border-blue-200">
              <RefreshCw size={14} className="animate-spin" />
              <span>Sincronizando ({pendingSyncCount})...</span>
            </div>
          )}
        </div>

        {/* Zona Derecha */}
        <div className="flex justify-end items-center space-x-2 lg:space-x-4">
          
          {/* New Actions Moved from Footer */}
          <div className="hidden xl:flex items-center gap-2 mr-2">
             <button 
                onClick={addWeek}
                className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:text-gray-900 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-500"
                title="Agregar Semana"
             >
                <Plus size={16} />
                <span>Semana</span>
             </button>
             <button 
                onClick={() => setBatchTrainingOpen(true)}
                className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:text-gray-900 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-500"
                title="Batch Training"
             >
                <Flame size={16} />
                <span>Batch</span>
             </button>
             <button 
                onClick={handleCopyProgram}
                className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:text-gray-900 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-500"
                title="Copiar Programa"
             >
                <Package size={16} />
                <span>Copiar</span>
             </button>
             <button 
                onClick={() => setVariationModalOpen(true)}
                className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-purple-700 bg-white border border-purple-200 rounded-lg hover:bg-purple-50 hover:text-purple-900 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-purple-500"
                title="Generar Variación IA"
             >
                <Sparkles size={16} />
                <span>Variar</span>
             </button>
             <div className="h-6 w-px bg-gray-200"></div>
          </div>

          {/* Indicador de Guardado */}
          <AutoSaveIndicator 
            status={isSaving ? 'saving' : 'saved'} 
            lastSavedAt={lastSavedAt} 
            onClick={() => setVersionHistoryOpen(true)}
          />
          
          <div className="h-6 w-px bg-gray-200 mx-2 hidden sm:block"></div>

          {/* User Actions Menu (Profile, Settings) */}
          <UserActionsMenu />
        </div>
      </header>
      <ExportModal />
      <VariationGeneratorModal
        isOpen={isVariationModalOpen}
        onClose={() => setVariationModalOpen(false)}
        onGenerate={handleGenerateVariation}
        isGenerating={isGeneratingVariation}
      />
    </>
  );
};
