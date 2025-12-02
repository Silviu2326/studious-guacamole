import React, { useState } from 'react';
import { ContentIdea } from '../api/contentIdeas';
import { Save, Calendar, X, Copy, Check, Lightbulb, Hash } from 'lucide-react';

interface IdeaCardProps {
  idea: ContentIdea;
  onSave: (id: string) => void;
  onSchedule?: (id: string) => void;
  onDiscard: (id: string) => void;
}

/**
 * Muestra una única idea de contenido generada.
 */
export const IdeaCard: React.FC<IdeaCardProps> = ({
  idea,
  onSave,
  onSchedule,
  onDiscard
}) => {
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [isSaved, setIsSaved] = useState<boolean>(false);

  const handleCopy = async () => {
    const textToCopy = `${idea.title}\n\n${idea.hook}\n\n${idea.description}\n\n${idea.cta}\n\n${idea.hashtags.join(' ')}`;
    
    try {
      await navigator.clipboard.writeText(textToCopy);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (error) {
      console.error('Error copiando:', error);
      alert('Error al copiar. Por favor, selecciona el texto manualmente.');
    }
  };

  const handleSave = () => {
    setIsSaved(true);
    onSave(idea.id);
  };

  const getFormatIcon = (format: string) => {
    const icons: Record<string, string> = {
      reel: '🎬',
      post: '📝',
      carousel: '🖼️',
      blog: '✍️',
      newsletter: '📧',
      tiktok: '🎵',
      youtube: '📹',
      story: '📸'
    };
    return icons[format] || '📄';
  };

  const getFormatLabel = (format: string) => {
    const labels: Record<string, string> = {
      reel: 'Reel',
      post: 'Post',
      carousel: 'Carrusel',
      blog: 'Blog',
      newsletter: 'Newsletter',
      tiktok: 'TikTok',
      youtube: 'YouTube',
      story: 'Story'
    };
    return labels[format] || format;
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-transparent p-6 hover:shadow-md transition-all h-full flex flex-col overflow-hidden">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="text-2xl">{getFormatIcon(idea.format)}</div>
          <div>
            <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-700 rounded-lg">
              {getFormatLabel(idea.format)}
            </span>
          </div>
        </div>
        <button
          onClick={() => onDiscard(idea.id)}
          className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition"
          title="Descartar"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <h3 className="text-lg font-semibold text-gray-900 mb-3">{idea.title}</h3>

      {/* Hook */}
      <div className="mb-3 p-3 bg-blue-50 rounded-xl ring-1 ring-blue-200/70">
        <div className="flex items-start gap-2 mb-1">
          <Lightbulb className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
          <span className="text-xs font-medium text-blue-900">Gancho Inicial</span>
        </div>
        <p className="text-sm text-blue-800 italic">"{idea.hook}"</p>
      </div>

      {/* Descripción */}
      <div className="mb-4 flex-1">
        <p className="text-sm text-gray-600 leading-relaxed">{idea.description}</p>
      </div>

      {/* Outline si está disponible */}
      {idea.outline && idea.outline.length > 0 && (
        <div className="mb-4">
          <p className="text-xs font-medium text-slate-700 mb-2">Estructura:</p>
          <ul className="space-y-1">
            {idea.outline.map((point, index) => (
              <li key={index} className="text-xs text-slate-600 flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* CTA */}
      <div className="mb-4 p-3 bg-green-50 rounded-xl ring-1 ring-green-200/70">
        <p className="text-xs font-medium text-green-900 mb-1">Llamada a la Acción:</p>
        <p className="text-sm text-green-800 font-medium">{idea.cta}</p>
      </div>

      {/* Hashtags */}
      {idea.hashtags && idea.hashtags.length > 0 && (
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-2">
            <Hash className="w-4 h-4 text-slate-500" />
            <span className="text-xs font-medium text-slate-600">Hashtags sugeridos</span>
          </div>
          <div className="flex flex-wrap gap-1">
            {idea.hashtags.map((tag, index) => (
              <span
                key={index}
                className="px-2 py-1 text-xs bg-slate-100 text-slate-700 rounded-lg"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Acciones */}
      <div className="flex items-center gap-2 mt-auto pt-3 border-t border-gray-100">
        <button
          onClick={handleCopy}
          className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-xl transition-all ${
            isCopied
              ? 'bg-green-100 text-green-700'
              : 'bg-blue-600 text-white hover:bg-blue-700 shadow-sm'
          }`}
        >
          {isCopied ? (
            <>
              <Check className="w-4 h-4" />
              ¡Copiado!
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" />
              Copiar
            </>
          )}
        </button>
        
        <button
          onClick={handleSave}
          disabled={isSaved}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
            isSaved
              ? 'bg-green-100 text-green-700 cursor-not-allowed'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <Save className="w-4 h-4" />
          {isSaved ? 'Guardado' : 'Guardar'}
        </button>
        
        {onSchedule && (
          <button
            onClick={() => onSchedule(idea.id)}
            className="flex items-center gap-2 px-4 py-2 text-slate-700 bg-slate-100 rounded-xl hover:bg-slate-200 transition-all"
          >
            <Calendar className="w-4 h-4" />
            Programar
          </button>
        )}
      </div>
    </div>
  );
};

