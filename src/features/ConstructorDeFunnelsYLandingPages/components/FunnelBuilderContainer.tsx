import React, { useState, useEffect } from 'react';
import { Funnel, LandingPage } from '../api/funnels';
import { LandingPageCanvas } from './LandingPageCanvas';
import { ComponentSettingsPanel } from './ComponentSettingsPanel';

interface FunnelBuilderContainerProps {
  funnelId: string | null;
  onSave?: (funnel: Funnel) => void;
}

/**
 * Componente principal que orquesta todo el constructor de funnels.
 * Maneja el estado del funnel activo, carga los datos, gestiona el guardado automático,
 * y provee el contexto a los componentes hijos.
 */
export const FunnelBuilderContainer: React.FC<FunnelBuilderContainerProps> = ({
  funnelId,
  onSave
}) => {
  const [activeFunnelData, setActiveFunnelData] = useState<Funnel | null>(null);
  const [activePage, setActivePage] = useState<LandingPage | null>(null);
  const [currentPageIndex, setCurrentPageIndex] = useState<number>(0);
  const [viewMode, setViewMode] = useState<'desktop' | 'mobile'>('desktop');
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [selectedComponentId, setSelectedComponentId] = useState<string | null>(null);

  // Simulación de carga de datos
  useEffect(() => {
    if (funnelId) {
      // En producción, aquí se cargaría el funnel desde la API
      // Por ahora, creamos datos de ejemplo
      setActiveFunnelData({
        funnelId,
        name: 'Funnel de Ejemplo',
        trainerId: 'trn_xyz789',
        createdAt: new Date().toISOString(),
        status: 'draft',
        steps: [
          {
            pageId: 'page_1',
            name: 'Página de Captura',
            order: 0
          }
        ]
      });
    }
  }, [funnelId]);

  const handleComponentDrop = (component: any, position: number) => {
    if (!activePage) return;
    
    const updatedComponents = [...activePage.jsonContent.components];
    updatedComponents.splice(position, 0, component);
    
    setActivePage({
      ...activePage,
      jsonContent: {
        ...activePage.jsonContent,
        components: updatedComponents
      }
    });
  };

  const handleComponentSelect = (componentId: string) => {
    setSelectedComponentId(componentId);
  };

  const handleComponentUpdate = (componentId: string, newProps: Record<string, any>) => {
    if (!activePage) return;
    
    const updatedComponents = activePage.jsonContent.components.map(comp =>
      comp.id === componentId ? { ...comp, props: { ...comp.props, ...newProps } } : comp
    );
    
    setActivePage({
      ...activePage,
      jsonContent: {
        ...activePage.jsonContent,
        components: updatedComponents
      }
    });
  };

  const selectedComponent = activePage?.jsonContent.components.find(
    comp => comp.id === selectedComponentId
  ) || null;

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Panel izquierdo - Lista de componentes disponibles */}
      <div className="w-64 bg-white border-r border-gray-200/60 p-4">
        <h3 className="text-sm font-semibold text-gray-900 mb-4">Componentes</h3>
        <div className="space-y-2">
          <div className="p-3 border border-gray-200 rounded-xl cursor-move hover:bg-slate-50 transition-colors ring-1 ring-gray-200/50">
            Título
          </div>
          <div className="p-3 border border-gray-200 rounded-xl cursor-move hover:bg-slate-50 transition-colors ring-1 ring-gray-200/50">
            Texto
          </div>
          <div className="p-3 border border-gray-200 rounded-xl cursor-move hover:bg-slate-50 transition-colors ring-1 ring-gray-200/50">
            Imagen
          </div>
          <div className="p-3 border border-gray-200 rounded-xl cursor-move hover:bg-slate-50 transition-colors ring-1 ring-gray-200/50">
            Formulario
          </div>
          <div className="p-3 border border-gray-200 rounded-xl cursor-move hover:bg-slate-50 transition-colors ring-1 ring-gray-200/50">
            Botón
          </div>
        </div>
      </div>

      {/* Canvas central */}
      <div className="flex-1 overflow-auto">
        <div className="p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">
              {activeFunnelData?.name || 'Nuevo Funnel'}
            </h2>
            <div className="flex gap-2">
              <button
                onClick={() => setViewMode('desktop')}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  viewMode === 'desktop'
                    ? 'bg-blue-600 text-white shadow-sm ring-1 ring-blue-200'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Desktop
              </button>
              <button
                onClick={() => setViewMode('mobile')}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  viewMode === 'mobile'
                    ? 'bg-blue-600 text-white shadow-sm ring-1 ring-blue-200'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Móvil
              </button>
            </div>
          </div>
          
          {activePage ? (
            <LandingPageCanvas
              pageData={activePage}
              onComponentDrop={handleComponentDrop}
              onComponentSelect={handleComponentSelect}
              viewMode={viewMode}
            />
          ) : (
            <div className="flex items-center justify-center h-64 bg-white border-2 border-dashed border-gray-300 rounded-xl">
              <p className="text-gray-500">No hay página activa</p>
            </div>
          )}
        </div>
      </div>

      {/* Panel derecho - Configuración de componentes */}
      <div className="w-80 bg-white border-l border-gray-200/60 p-4">
        {selectedComponent ? (
          <ComponentSettingsPanel
            component={selectedComponent}
            onUpdate={handleComponentUpdate}
          />
        ) : (
          <div className="text-center text-gray-500 mt-8">
            <p>Selecciona un componente para editarlo</p>
          </div>
        )}
      </div>
    </div>
  );
};


