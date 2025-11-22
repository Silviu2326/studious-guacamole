// src/features/EditorEntrenamiento/components/TopBar.tsx

import React, { useEffect, useRef } from 'react';
import { Sparkles, Menu, Download, WifiOff, RefreshCw, CornerUpLeft, CornerUpRight, Smartphone } from 'lucide-react';

import ClientSelector, { ClientSelectorHandle } from './ClientSelector';
import AutoSaveIndicator from './AutoSaveIndicator';
import { useUIContext } from '../context/UIContext';
import { useProgramContext } from '../context/ProgramContext';
import UserActionsMenu from './UserActionsMenu';
import { useEditorToast } from './feedback/ToastSystem';
import { ExportModal } from './modals/ExportModal';

export const TopBar: React.FC = () => {
  const { isFitCoachOpen, toggleFitCoach, setCommandPaletteOpen, setVersionHistoryOpen, setExportModalOpen, setClientPreviewOpen } = useUIContext();
  const { isSaving, lastSavedAt, saveCurrentVersion, isOffline, pendingSyncCount, undo, redo, canUndo, canRedo } = useProgramContext();
  const { addToast } = useEditorToast();
  const clientSelectorRef = useRef<ClientSelectorHandle>(null);
  
  // Mock notification state - connect to real store later
  const hasNotification = false; 

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
          <a 
            href="/dashboard" 
            className="hidden sm:flex items-center gap-2 group focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg p-1"
            aria-label="Ir al Dashboard"
          >
            <div className="w-8 h-8 bg-blue-600 text-white rounded-lg flex items-center justify-center shadow-sm group-hover:bg-blue-700 transition">
              {/* Isotipo placeholder */}
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.41-7-7.05h2.92c0 2.22 1.44 4.1 3.5 4.77V19.93zm6.93-2.61a7.994 7.994 0 00-.73-1.63L14.47 16h-.14c-.93 0-1.7-.63-1.92-1.5-.06-.18-.11-.35-.11-.5h-2.18v2.18h-.18v-2.18H7.17v-2.18H5.17V9.67h2.18V7.5h2.18v2.17h2.18v-2.17h2.18v2.17h2.18v2.17h2.18v2.18c.06 0 .11.02.17.02l.62-1.37a7.957 7.957 0 00.72-1.63l1.24-2.75h-.02a7.994 7.994 0 00-.73-1.63l-.42-.92h-.14c-.93 0-1.7-.63-1.92-1.5-.06-.18-.11-.35-.11-.5h-2.18V7.5h-.18v2.18H7.17v2.18H5.17V9.67h2.18V7.5h2.18v2.17h2.18v-2.17h2.18v2.17h2.18v2.17h2.18v2.18c.06 0 .11.02.17.02l.62-1.37a7.957 7.957 0 00.72-1.63l1.24-2.75h-.02c.93 0 1.7.63 1.92 1.5.06.18.11.35.11.5zM12 4c4.41 0 8 3.59 8 8s-3.59 8-8 8-8-3.59-8-8 3.59-8 8-8z"/>
              </svg>
            </div>
            <span className="font-bold text-xl text-gray-900 hidden lg:block tracking-tight">FitPro</span>
          </a>
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
          
          <button
            onClick={() => setClientPreviewOpen(true)}
            className="hidden sm:flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:text-gray-900 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-500"
            title="Ver como Cliente (Móvil)"
          >
            <Smartphone size={16} />
            <span className="hidden xl:inline">Vista Cliente</span>
          </button>

          <button
            onClick={() => setExportModalOpen(true)}
            className="hidden sm:flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:text-gray-900 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-500"
          >
            <Download size={16} />
            <span>Exportar</span>
          </button>

          {/* Indicador de Guardado */}
          <AutoSaveIndicator 
            status={isSaving ? 'saving' : 'saved'} 
            lastSavedAt={lastSavedAt} 
            onClick={() => setVersionHistoryOpen(true)}
          />
          
          <div className="h-6 w-px bg-gray-200 mx-2 hidden sm:block"></div>

          {/* Toggle FitCoach - Hidden on Mobile, Icon on Tablet, Full on Desktop */}
          <button
            onClick={toggleFitCoach}
            className={`
              relative hidden sm:flex items-center justify-center sm:justify-start gap-2 rounded-full transition-all border
              p-2 sm:px-3 sm:py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500
              ${isFitCoachOpen 
                ? 'bg-indigo-100 text-indigo-700 border-indigo-200 hover:bg-indigo-200' 
                : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
              }
            `}
            aria-label={isFitCoachOpen ? "Cerrar FitCoach IA" : "Abrir FitCoach IA"}
            aria-pressed={isFitCoachOpen}
            title="FitCoach IA (Cmd+/)"
          >
            <Sparkles className={`w-4 h-4 ${isFitCoachOpen ? 'fill-indigo-700' : ''}`} aria-hidden="true" />
            <span className="hidden lg:inline font-medium text-sm">FitCoach</span>
            
            {/* Notification Badge */}
            {hasNotification && (
              <span className="absolute top-0 right-0 -mt-1 -mr-1 flex h-2.5 w-2.5" role="status" aria-label="Nuevas notificaciones">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500 border-2 border-white"></span>
              </span>
            )}
          </button>

          {/* User Actions Menu (Profile, Settings) */}
          <UserActionsMenu />
        </div>
      </header>
      <ExportModal />
    </>
  );
};
