import React from 'react';
import { LandingPage, PageComponent } from '../api/funnels';

interface LandingPageCanvasProps {
  pageData: LandingPage;
  onComponentDrop: (component: PageComponent, position: number) => void;
  onComponentSelect: (componentId: string) => void;
  viewMode?: 'desktop' | 'mobile';
}

/**
 * Representa el área visual donde el entrenador arrastra y suelta los componentes
 * para construir su página. Renderiza los componentes de la página basándose en
 * un objeto de configuración JSON.
 */
export const LandingPageCanvas: React.FC<LandingPageCanvasProps> = ({
  pageData,
  onComponentDrop,
  onComponentSelect,
  viewMode = 'desktop'
}) => {
  const maxWidth = viewMode === 'mobile' ? '375px' : '100%';

  const renderComponent = (component: PageComponent) => {
    const baseClasses = "border-2 border-dashed border-gray-300 rounded-xl p-4 mb-4 cursor-pointer hover:border-blue-400 transition-all";
    
    switch (component.type) {
      case 'heading':
        return (
          <div
            key={component.id}
            className={baseClasses}
            onClick={() => onComponentSelect(component.id)}
          >
            <h2 className="text-2xl font-bold">{component.props.text || 'Título'}</h2>
          </div>
        );
      
      case 'text':
        return (
          <div
            key={component.id}
            className={baseClasses}
            onClick={() => onComponentSelect(component.id)}
          >
            <p>{component.props.text || 'Texto descriptivo...'}</p>
          </div>
        );
      
      case 'image':
        return (
          <div
            key={component.id}
            className={baseClasses}
            onClick={() => onComponentSelect(component.id)}
          >
            <img
              src={component.props.src || 'https://via.placeholder.com/600x300'}
              alt={component.props.alt || ''}
              className="w-full h-auto rounded"
            />
          </div>
        );
      
      case 'form':
        return (
          <div
            key={component.id}
            className={baseClasses}
            onClick={() => onComponentSelect(component.id)}
          >
            <form className="space-y-4">
              <input
                type="text"
                placeholder="Nombre"
                className="w-full p-2 border border-gray-300 rounded"
                disabled
              />
              <input
                type="email"
                placeholder="Email"
                className="w-full p-2 border border-gray-300 rounded"
                disabled
              />
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 rounded-xl font-medium transition-all"
                disabled
              >
                {component.props.buttonText || 'Enviar'}
              </button>
            </form>
          </div>
        );
      
      case 'button':
        return (
          <div
            key={component.id}
            className={baseClasses}
            onClick={() => onComponentSelect(component.id)}
          >
            <button className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold transition-all hover:bg-blue-700">
              {component.props.text || 'Botón CTA'}
            </button>
          </div>
        );
      
      default:
        return (
          <div
            key={component.id}
            className={baseClasses}
            onClick={() => onComponentSelect(component.id)}
          >
            <p className="text-gray-500">Componente: {component.type}</p>
          </div>
        );
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen p-8">
      <div
        className="mx-auto bg-white shadow-sm rounded-2xl overflow-hidden ring-1 ring-gray-200/60"
        style={{ maxWidth }}
      >
        {/* Preview de la página */}
        <div className="p-8">
          {pageData.jsonContent.components.length > 0 ? (
            pageData.jsonContent.components.map(renderComponent)
          ) : (
            <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed border-gray-300 rounded-xl text-gray-400">
              <p className="mb-2 text-gray-600">Página vacía</p>
              <p className="text-sm text-gray-500">Arrastra componentes aquí para empezar</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};


