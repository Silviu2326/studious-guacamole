import React, { useState, useEffect } from 'react';
import { PageComponent } from '../api/funnels';

interface ComponentSettingsPanelProps {
  component: PageComponent | null;
  onUpdate: (componentId: string, newProps: Record<string, any>) => void;
}

/**
 * Panel lateral que muestra los campos de configuración para el componente
 * actualmente seleccionado en el canvas (ej: cambiar texto, subir imagen,
 * configurar campos de un formulario).
 */
export const ComponentSettingsPanel: React.FC<ComponentSettingsPanelProps> = ({
  component,
  onUpdate
}) => {
  const [formState, setFormState] = useState<Record<string, any>>({});

  useEffect(() => {
    if (component) {
      setFormState(component.props || {});
    }
  }, [component]);

  if (!component) {
    return (
      <div className="text-center text-gray-500 mt-8">
        <p>Selecciona un componente para editarlo</p>
      </div>
    );
  }

  const handleChange = (field: string, value: any) => {
    const newFormState = { ...formState, [field]: value };
    setFormState(newFormState);
    onUpdate(component.id, newFormState);
  };

  const renderSettings = () => {
    switch (component.type) {
      case 'heading':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Texto del Título
              </label>
              <input
                type="text"
                value={formState.text || ''}
                onChange={(e) => handleChange('text', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded"
                placeholder="Escribe el título..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tamaño
              </label>
              <select
                value={formState.size || 'h2'}
                onChange={(e) => handleChange('size', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded"
              >
                <option value="h1">H1 (Muy Grande)</option>
                <option value="h2">H2 (Grande)</option>
                <option value="h3">H3 (Mediano)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Alineación
              </label>
              <select
                value={formState.align || 'left'}
                onChange={(e) => handleChange('align', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded"
              >
                <option value="left">Izquierda</option>
                <option value="center">Centro</option>
                <option value="right">Derecha</option>
              </select>
            </div>
          </div>
        );

      case 'text':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Contenido
              </label>
              <textarea
                value={formState.text || ''}
                onChange={(e) => handleChange('text', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded"
                rows={5}
                placeholder="Escribe el texto..."
              />
            </div>
          </div>
        );

      case 'image':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                URL de la Imagen
              </label>
              <input
                type="url"
                value={formState.src || ''}
                onChange={(e) => handleChange('src', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded"
                placeholder="https://..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Texto Alternativo
              </label>
              <input
                type="text"
                value={formState.alt || ''}
                onChange={(e) => handleChange('alt', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded"
                placeholder="Descripción de la imagen..."
              />
            </div>
          </div>
        );

      case 'form':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Texto del Botón
              </label>
              <input
                type="text"
                value={formState.buttonText || 'Enviar'}
                onChange={(e) => handleChange('buttonText', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Acción al Enviar
              </label>
              <select
                value={formState.action || 'add_to_list'}
                onChange={(e) => handleChange('action', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded"
              >
                <option value="add_to_list">Añadir a Lista</option>
                <option value="send_email">Enviar Email</option>
                <option value="redirect">Redirigir</option>
              </select>
            </div>
          </div>
        );

      case 'button':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Texto del Botón
              </label>
              <input
                type="text"
                value={formState.text || ''}
                onChange={(e) => handleChange('text', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded"
                placeholder="Ej: ¡Quiero Unirme Ahora!"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                URL de Destino
              </label>
              <input
                type="url"
                value={formState.url || ''}
                onChange={(e) => handleChange('url', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded"
                placeholder="https://..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Estilo
              </label>
              <select
                value={formState.style || 'primary'}
                onChange={(e) => handleChange('style', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded"
              >
                <option value="primary">Primario (Azul)</option>
                <option value="secondary">Secundario (Gris)</option>
                <option value="success">Éxito (Verde)</option>
              </select>
            </div>
          </div>
        );

      default:
        return (
          <div className="text-gray-500">
            <p>Configuración no disponible para este tipo de componente</p>
          </div>
        );
    }
  };

  return (
    <div className="h-full overflow-y-auto">
      <div className="mb-4 pb-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">
          Configuración de {component.type}
        </h3>
      </div>
      {renderSettings()}
    </div>
  );
};


