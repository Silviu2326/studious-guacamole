import React, { useState, useEffect } from 'react';
import { PageComponent } from '../api/funnels';
import { Input, Select } from '../../../components/componentsreutilizables';

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
            <Input
              type="text"
              label="Texto del Título"
              value={formState.text || ''}
              onChange={(e) => handleChange('text', e.target.value)}
              placeholder="Escribe el título..."
            />
            <Select
              label="Tamaño"
              value={formState.size || 'h2'}
              onChange={(e) => handleChange('size', e.target.value)}
              options={[
                { value: 'h1', label: 'H1 (Muy Grande)' },
                { value: 'h2', label: 'H2 (Grande)' },
                { value: 'h3', label: 'H3 (Mediano)' }
              ]}
            />
            <Select
              label="Alineación"
              value={formState.align || 'left'}
              onChange={(e) => handleChange('align', e.target.value)}
              options={[
                { value: 'left', label: 'Izquierda' },
                { value: 'center', label: 'Centro' },
                { value: 'right', label: 'Derecha' }
              ]}
            />
          </div>
        );

      case 'text':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Contenido
              </label>
              <textarea
                value={formState.text || ''}
                onChange={(e) => handleChange('text', e.target.value)}
                className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5"
                rows={5}
                placeholder="Escribe el texto..."
              />
            </div>
          </div>
        );

      case 'image':
        return (
          <div className="space-y-4">
            <Input
              type="url"
              label="URL de la Imagen"
              value={formState.src || ''}
              onChange={(e) => handleChange('src', e.target.value)}
              placeholder="https://..."
            />
            <Input
              type="text"
              label="Texto Alternativo"
              value={formState.alt || ''}
              onChange={(e) => handleChange('alt', e.target.value)}
              placeholder="Descripción de la imagen..."
            />
          </div>
        );

      case 'form':
        return (
          <div className="space-y-4">
            <Input
              type="text"
              label="Texto del Botón"
              value={formState.buttonText || 'Enviar'}
              onChange={(e) => handleChange('buttonText', e.target.value)}
            />
            <Select
              label="Acción al Enviar"
              value={formState.action || 'add_to_list'}
              onChange={(e) => handleChange('action', e.target.value)}
              options={[
                { value: 'add_to_list', label: 'Añadir a Lista' },
                { value: 'send_email', label: 'Enviar Email' },
                { value: 'redirect', label: 'Redirigir' }
              ]}
            />
          </div>
        );

      case 'button':
        return (
          <div className="space-y-4">
            <Input
              type="text"
              label="Texto del Botón"
              value={formState.text || ''}
              onChange={(e) => handleChange('text', e.target.value)}
              placeholder="Ej: ¡Quiero Unirme Ahora!"
            />
            <Input
              type="url"
              label="URL de Destino"
              value={formState.url || ''}
              onChange={(e) => handleChange('url', e.target.value)}
              placeholder="https://..."
            />
            <Select
              label="Estilo"
              value={formState.style || 'primary'}
              onChange={(e) => handleChange('style', e.target.value)}
              options={[
                { value: 'primary', label: 'Primario (Azul)' },
                { value: 'secondary', label: 'Secundario (Gris)' },
                { value: 'success', label: 'Éxito (Verde)' }
              ]}
            />
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


