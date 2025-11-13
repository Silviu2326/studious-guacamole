import React, { useState } from 'react';
import { Modal, Button, Textarea, Select } from '../../../components/componentsreutilizables';
import { Sparkles, Loader2 } from 'lucide-react';

interface AIActionPlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGenerate: (prompt: string, focus: string) => Promise<void>;
}

export const AIActionPlanModal: React.FC<AIActionPlanModalProps> = ({
  isOpen,
  onClose,
  onGenerate,
}) => {
  const [prompt, setPrompt] = useState('');
  const [focus, setFocus] = useState('objetivos');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      alert('Por favor, describe el objetivo o situación para generar el plan de acción.');
      return;
    }

    setIsGenerating(true);
    try {
      await onGenerate(prompt, focus);
      setPrompt('');
      onClose();
    } catch (error) {
      console.error('Error generating plan:', error);
      alert('Error al generar el plan de acción. Por favor, intenta de nuevo.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleClose = () => {
    if (!isGenerating) {
      setPrompt('');
      onClose();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Generar Plan de Acción con IA"
      size="lg"
      footer={
        <div className="flex gap-3">
          <Button variant="secondary" onClick={handleClose} disabled={isGenerating}>
            Cancelar
          </Button>
          <Button 
            variant="primary" 
            onClick={handleGenerate}
            disabled={isGenerating || !prompt.trim()}
            loading={isGenerating}
          >
            {isGenerating ? (
              <>
                <Loader2 size={18} className="mr-2 animate-spin" />
                Generando...
              </>
            ) : (
              <>
                <Sparkles size={18} className="mr-2" />
                Generar Plan
              </>
            )}
          </Button>
        </div>
      }
    >
      <div className="space-y-4">
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-purple-600 mt-0.5" />
            <div>
              <h4 className="text-sm font-semibold text-purple-900 mb-1">
                ¿Cómo funciona?
              </h4>
              <p className="text-xs text-purple-700">
                Describe tu objetivo o situación actual. La IA analizará tu contexto y generará un plan de acción personalizado con pasos concretos, métricas y recomendaciones.
              </p>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Enfoque del Plan
          </label>
          <Select
            value={focus}
            onChange={(e) => setFocus(e.target.value)}
            options={[
              { value: 'objetivos', label: 'Objetivos de Rendimiento' },
              { value: 'mejora', label: 'Mejora Continua' },
              { value: 'estrategia', label: 'Estrategia Comercial' },
              { value: 'operaciones', label: 'Operaciones' },
            ]}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Describe tu objetivo o situación
          </label>
          <Textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Ejemplo: Necesito aumentar la facturación mensual en un 20% durante el próximo trimestre. Actualmente tengo 50 clientes activos y una tasa de retención del 75%."
            rows={6}
            className="w-full"
          />
          <p className="text-xs text-gray-500 mt-1">
            Sé específico sobre tu objetivo, situación actual y cualquier contexto relevante.
          </p>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <p className="text-xs text-blue-800">
            <strong>Tip:</strong> Incluye información sobre métricas actuales, desafíos específicos y el resultado deseado para obtener un plan más preciso.
          </p>
        </div>
      </div>
    </Modal>
  );
};

