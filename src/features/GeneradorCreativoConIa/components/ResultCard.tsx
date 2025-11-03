import React, { useState } from 'react';
import { GenerationResult } from '../api/generator';
import { Copy, Check, Save, X } from 'lucide-react';
import { Card, Button } from '../../../components/componentsreutilizables';

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
    <Card variant="hover" padding="none" className="h-full flex flex-col transition-shadow overflow-hidden">
      <div className="p-4 flex flex-col flex-1">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
              <span className="text-blue-600 font-semibold text-sm">
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
        <div className="mb-4 flex-1">
          <div className="bg-slate-50 rounded-xl p-4 ring-1 ring-slate-200">
            <p className="text-gray-900 whitespace-pre-wrap leading-relaxed">
              {result.text}
            </p>
          </div>
        </div>

        {/* Acciones */}
        <div className="flex items-center gap-2 mt-auto pt-3 border-t border-gray-100">
          <Button
            onClick={handleCopy}
            variant={isCopied ? 'secondary' : 'primary'}
            size="sm"
            fullWidth
            leftIcon={isCopied ? <Check size={16} /> : <Copy size={16} />}
            className={isCopied ? 'bg-green-100 text-green-700 hover:bg-green-200' : ''}
          >
            {isCopied ? '¡Copiado!' : 'Copiar'}
          </Button>
          
          <Button
            onClick={handleSave}
            disabled={isSaved}
            variant="secondary"
            size="sm"
            leftIcon={<Save size={16} />}
            className={isSaved ? 'bg-green-100 text-green-700 cursor-not-allowed' : ''}
          >
            {isSaved ? 'Guardado' : 'Guardar'}
          </Button>
        </div>
      </div>
    </Card>
  );
};


