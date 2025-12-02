import React, { useState } from 'react';
import { Sparkles, X, RefreshCw } from 'lucide-react';

interface VariationGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGenerate: (instruction: string) => void;
  isGenerating?: boolean;
}

export const VariationGeneratorModal: React.FC<VariationGeneratorModalProps> = ({
  isOpen,
  onClose,
  onGenerate,
  isGenerating = false,
}) => {
  const [instruction, setInstruction] = useState('');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center gap-2">
            <Sparkles className="text-purple-600" size={20} />
            <h3 className="text-lg font-semibold text-gray-900">Generador de Variaciones</h3>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={20} />
          </button>
        </div>
        
        <div className="p-6">
          <p className="text-sm text-gray-600 mb-4">
            Describe cómo quieres modificar el programa actual. La IA generará una nueva versión adaptada a tus necesidades.
          </p>
          
          <div className="space-y-3 mb-6">
            <label className="block text-sm font-medium text-gray-700">Instrucción</label>
            <textarea
              className="w-full h-32 p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none text-sm"
              placeholder="Ej: Reemplazar ejercicios con barra por mancuernas, reducir volumen en un 20%, adaptar para lesión de hombro..."
              value={instruction}
              onChange={(e) => setInstruction(e.target.value)}
            />
          </div>

          <div className="flex gap-2 justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              onClick={() => onGenerate(instruction)}
              disabled={!instruction.trim() || isGenerating}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-md hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isGenerating ? (
                <>
                  <RefreshCw size={16} className="animate-spin" />
                  Generando...
                </>
              ) : (
                <>
                  <Sparkles size={16} />
                  Generar Variación
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
