import React, { useState, useEffect } from 'react';
import {
  GenerationRequest,
  ContentObjective,
  ContentFormat,
  ClientSegment,
  getClientSegments
} from '../api/contentIdeas';
import { Sparkles, Loader2, Users } from 'lucide-react';

interface GeneratorFormProps {
  inputs: Partial<GenerationRequest>;
  onInputChange: (field: string, value: any) => void;
  onSubmit: () => void;
  isLoading: boolean;
}

/**
 * Renderiza el formulario con todos los campos necesarios para
 * que el entrenador defina sus necesidades de contenido.
 */
export const GeneratorForm: React.FC<GeneratorFormProps> = ({
  inputs,
  onInputChange,
  onSubmit,
  isLoading
}) => {
  const [segments, setSegments] = useState<ClientSegment[]>([]);
  const [showAdvanced, setShowAdvanced] = useState<boolean>(false);

  useEffect(() => {
    loadSegments();
  }, []);

  const loadSegments = async () => {
    try {
      const data = await getClientSegments();
      setSegments(data);
    } catch (error) {
      console.error('Error cargando segmentos:', error);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!inputs.objective || !inputs.format || !inputs.audience?.description) {
      alert('Por favor, completa los campos requeridos');
      return;
    }
    
    onSubmit();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Objetivo */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Objetivo Principal *
        </label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {([
            { value: 'captar_leads', label: 'Captar Leads', icon: '🎯' },
            { value: 'vender_programa', label: 'Vender Programa', icon: '💰' },
            { value: 'educar_audiencia', label: 'Educar Audiencia', icon: '📚' },
            { value: 'aumentar_engagement', label: 'Aumentar Engagement', icon: '💬' },
            { value: 'retencion_clientes', label: 'Retención Clientes', icon: '🤝' },
            { value: 'promocionar_evento', label: 'Promocionar Evento', icon: '📅' }
          ] as { value: ContentObjective; label: string; icon: string }[]).map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => onInputChange('objective', option.value)}
              className={`p-4 rounded-lg border-2 text-left transition ${
                inputs.objective === option.value
                  ? 'border-purple-500 bg-purple-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <span className="text-2xl mb-2 block">{option.icon}</span>
              <span className="font-medium text-sm text-gray-900">{option.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Audiencia */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Audiencia Objetivo *
        </label>
        
        {/* Segmentos predefinidos */}
        {segments.length > 0 && (
          <div className="mb-3">
            <p className="text-xs text-gray-600 mb-2">Segmentos del CRM:</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {segments.map((segment) => (
                <button
                  key={segment.id}
                  type="button"
                  onClick={() => onInputChange('audience', {
                    segmentId: segment.id,
                    description: segment.description
                  })}
                  className={`p-3 rounded-lg border-2 text-left transition ${
                    inputs.audience?.segmentId === segment.id
                      ? 'border-purple-500 bg-purple-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <Users className="w-4 h-4 text-gray-500" />
                    <span className="text-xs font-medium text-gray-900">{segment.name}</span>
                  </div>
                  <p className="text-xs text-gray-600">{segment.memberCount} miembros</p>
                </button>
              ))}
            </div>
          </div>
        )}
        
        {/* Descripción personalizada */}
        <div>
          <label className="block text-xs text-gray-600 mb-2">
            O describe tu audiencia manualmente:
          </label>
          <textarea
            value={inputs.audience?.description || ''}
            onChange={(e) => onInputChange('audience', {
              ...inputs.audience,
              description: e.target.value
            })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            rows={3}
            placeholder="Ej: Mujeres de 30-45 años que trabajan en oficinas y buscan aliviar dolores de espalda"
            required
          />
        </div>
      </div>

      {/* Formato */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Formato de Contenido *
        </label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {([
            { value: 'reel', label: 'Reel', icon: '🎬' },
            { value: 'post', label: 'Post', icon: '📝' },
            { value: 'carousel', label: 'Carrusel', icon: '🖼️' },
            { value: 'blog', label: 'Blog', icon: '✍️' },
            { value: 'newsletter', label: 'Newsletter', icon: '📧' },
            { value: 'tiktok', label: 'TikTok', icon: '🎵' },
            { value: 'youtube', label: 'YouTube', icon: '📹' },
            { value: 'story', label: 'Story', icon: '📸' }
          ] as { value: ContentFormat; label: string; icon: string }[]).map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => onInputChange('format', option.value)}
              className={`p-4 rounded-lg border-2 transition text-center ${
                inputs.format === option.value
                  ? 'border-purple-500 bg-purple-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="text-2xl mb-1">{option.icon}</div>
              <span className="text-xs font-medium text-gray-900">{option.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Opciones avanzadas */}
      <div>
        <button
          type="button"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-gray-900"
        >
          <span>Opciones Avanzadas</span>
          <span className="text-gray-400">{showAdvanced ? '−' : '+'}</span>
        </button>

        {showAdvanced && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg space-y-4 border border-gray-200">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tema o Palabras Clave
              </label>
              <input
                type="text"
                value={inputs.topic || ''}
                onChange={(e) => onInputChange('topic', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Ej: movilidad articular, entrenamiento funcional"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Número de Ideas a Generar
              </label>
              <select
                value={inputs.count || 5}
                onChange={(e) => onInputChange('count', Number(e.target.value))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value={3}>3 ideas</option>
                <option value={5}>5 ideas</option>
                <option value={10}>10 ideas</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tono (opcional)
              </label>
              <input
                type="text"
                value={inputs.tone || ''}
                onChange={(e) => onInputChange('tone', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Ej: Motivacional, educativo, directo"
              />
            </div>
          </div>
        )}
      </div>

      {/* Botón de envío */}
      <button
        type="submit"
        disabled={isLoading || !inputs.objective || !inputs.format || !inputs.audience?.description}
        className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition disabled:opacity-50 disabled:cursor-not-allowed font-medium"
      >
        {isLoading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Generando Ideas...
          </>
        ) : (
          <>
            <Sparkles className="w-5 h-5" />
            Generar Ideas
          </>
        )}
      </button>
    </form>
  );
};


