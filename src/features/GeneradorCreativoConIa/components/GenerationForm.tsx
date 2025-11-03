import React, { useState, useEffect } from 'react';
import {
  ContentTemplateOption,
  GenerationSettings,
  ToneOfVoice,
  getContentTemplates,
  BrandProfile
} from '../api/generator';
import { Sparkles, Loader2 } from 'lucide-react';

interface GenerationFormProps {
  templates: ContentTemplateOption[];
  brandProfile?: BrandProfile | null;
  onSubmit: (data: { prompt: string; templateId: string; settings: GenerationSettings }) => void;
  isGenerating: boolean;
}

/**
 * Formulario donde el entrenador introduce su idea y selecciona
 * las opciones de generación.
 */
export const GenerationForm: React.FC<GenerationFormProps> = ({
  templates,
  brandProfile,
  onSubmit,
  isGenerating
}) => {
  const [selectedTemplate, setSelectedTemplate] = useState<ContentTemplateOption | null>(
    templates[0] || null
  );
  const [prompt, setPrompt] = useState<string>('');
  const [settings, setSettings] = useState<GenerationSettings>({
    tone: 'motivational',
    length: 'medium',
    language: 'es'
  });
  const [showAdvanced, setShowAdvanced] = useState<boolean>(false);

  useEffect(() => {
    // Precargar tono de voz desde el perfil de marca si existe
    if (brandProfile?.toneOfVoice) {
      // Intentar extraer el tono del perfil
      const toneMap: Record<string, ToneOfVoice> = {
        'motivacional': 'motivational',
        'educativo': 'educational',
        'enérgico': 'energetic',
        'empático': 'empathetic',
        'científico': 'scientific',
        'directo': 'direct'
      };
      
      const foundTone = Object.keys(toneMap).find(key => 
        brandProfile.toneOfVoice.toLowerCase().includes(key)
      );
      
      if (foundTone) {
        setSettings(prev => ({ ...prev, tone: toneMap[foundTone] }));
      }
      
      if (brandProfile.targetAudience) {
        setSettings(prev => ({ ...prev, targetAudience: brandProfile.targetAudience }));
      }
      
      if (brandProfile.keywords && brandProfile.keywords.length > 0) {
        setSettings(prev => ({ ...prev, keywords: brandProfile.keywords }));
      }
    }
  }, [brandProfile]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedTemplate || !prompt.trim()) {
      alert('Por favor, selecciona una plantilla y escribe tu idea');
      return;
    }
    
    onSubmit({
      prompt: prompt.trim(),
      templateId: selectedTemplate.id,
      settings
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Selección de plantilla */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Tipo de Contenido
        </label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {templates.map((template) => (
            <button
              key={template.id}
              type="button"
              onClick={() => setSelectedTemplate(template)}
              className={`p-4 rounded-lg border-2 transition-all text-left ${
                selectedTemplate?.id === template.id
                  ? 'border-purple-500 bg-purple-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="text-2xl mb-1">{template.icon || '📝'}</div>
              <div className="font-medium text-sm text-gray-900">{template.name}</div>
              <div className="text-xs text-gray-500 mt-1">{template.description}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Campo de prompt */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Tu Idea o Tema Principal *
        </label>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Ej: Crear un post para Instagram sobre los beneficios del entrenamiento funcional para oficinistas..."
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          rows={4}
          required
        />
        <p className="mt-2 text-xs text-gray-500">
          Sé específico: describe qué quieres comunicar, a quién va dirigido y qué objetivo tiene.
        </p>
      </div>

      {/* Opciones avanzadas (colapsable) */}
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
            {/* Tono de voz */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tono de Voz
              </label>
              <select
                value={settings.tone || 'motivational'}
                onChange={(e) => setSettings(prev => ({ 
                  ...prev, 
                  tone: e.target.value as ToneOfVoice 
                }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="motivational">Motivacional</option>
                <option value="educational">Educativo</option>
                <option value="energetic">Enérgico</option>
                <option value="empathetic">Empático</option>
                <option value="scientific">Científico</option>
                <option value="direct">Directo</option>
                <option value="custom">Personalizado</option>
              </select>
              {settings.tone === 'custom' && (
                <input
                  type="text"
                  value={settings.customTone || ''}
                  onChange={(e) => setSettings(prev => ({ 
                    ...prev, 
                    customTone: e.target.value 
                  }))}
                  placeholder="Describe tu tono de voz..."
                  className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              )}
            </div>

            {/* Público objetivo */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Público Objetivo (opcional)
              </label>
              <input
                type="text"
                value={settings.targetAudience || ''}
                onChange={(e) => setSettings(prev => ({ 
                  ...prev, 
                  targetAudience: e.target.value 
                }))}
                placeholder="Ej: Mujeres de 30-45 años..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            {/* Longitud */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Longitud del Texto
              </label>
              <select
                value={settings.length || 'medium'}
                onChange={(e) => setSettings(prev => ({ 
                  ...prev, 
                  length: e.target.value as 'short' | 'medium' | 'long' 
                }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="short">Corto (100-200 palabras)</option>
                <option value="medium">Medio (200-500 palabras)</option>
                <option value="long">Largo (500+ palabras)</option>
              </select>
            </div>

            {/* Llamada a la acción */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Llamada a la Acción (opcional)
              </label>
              <input
                type="text"
                value={settings.callToAction || ''}
                onChange={(e) => setSettings(prev => ({ 
                  ...prev, 
                  callToAction: e.target.value 
                }))}
                placeholder="Ej: Reserva tu sesión gratuita ahora"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
          </div>
        )}
      </div>

      {/* Botón de envío */}
      <button
        type="submit"
        disabled={isGenerating || !selectedTemplate || !prompt.trim()}
        className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition disabled:opacity-50 disabled:cursor-not-allowed font-medium"
      >
        {isGenerating ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Generando...
          </>
        ) : (
          <>
            <Sparkles className="w-5 h-5" />
            Generar Contenido
          </>
        )}
      </button>
    </form>
  );
};


