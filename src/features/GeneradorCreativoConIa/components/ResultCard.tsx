import React, { useState } from 'react';
import { GenerationResult } from '../api/generator';
import { Copy, Check, Save, X } from 'lucide-react';

interface ResultCardProps {
  result: GenerationResult;
  onCopy: () => void;
  onSave: () => void;
  onDiscard?: () => void;
}

/**
 * Muestra un único resultado de la generación de IA con acciones.
 */
export const ResultCard: React.FC<ResultCardProps> = ({
  result,
  onCopy,
  onSave,
  onDiscard
}) => {
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [isSaved, setIsSaved] = useState<boolean>(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(result.text);
      setIsCopied(true);
      onCopy();
      setTimeout(() => setIsCopied(false), 2000);
    } catch (error) {
      console.error('Error copiando al portapapeles:', error);
      alert('Error al copiar. Por favor, selecciona el texto manualmente.');
    }
  };

  const handleSave = () => {
    setIsSaved(true);
    onSave();
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
            <span className="text-purple-600 font-semibold text-sm">
              {result.id.slice(-2)}
            </span>
          </div>
          <span className="text-sm font-medium text-gray-600">Variante</span>
        </div>
        <div className="flex items-center gap-2">
          {onDiscard && (
            <button
              onClick={onDiscard}
              className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition"
              title="Descartar"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Contenido generado */}
      <div className="mb-4">
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
          <p className="text-gray-900 whitespace-pre-wrap leading-relaxed">
            {result.text}
          </p>
        </div>
      </div>

      {/* Acciones */}
      <div className="flex items-center gap-2 pt-4 border-t border-gray-200">
        <button
          onClick={handleCopy}
          className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg transition ${
            isCopied
              ? 'bg-green-100 text-green-700'
              : 'bg-purple-600 text-white hover:bg-purple-700'
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
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${
            isSaved
              ? 'bg-green-100 text-green-700 cursor-not-allowed'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <Save className="w-4 h-4" />
          {isSaved ? 'Guardado' : 'Guardar'}
        </button>
      </div>
    </div>
  );
};


