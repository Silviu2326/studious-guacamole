import React, { useState } from 'react';
import { GeneratorForm } from './GeneratorForm';
import { IdeaCard } from './IdeaCard';
import { useContentGeneratorAPI } from '../hooks/useContentGeneratorAPI';
import {
  GenerationRequest,
  ContentIdea
} from '../api/contentIdeas';
import {
  saveIdea,
  scheduleIdea
} from '../api/contentIdeas';
import { Lightbulb, AlertCircle, Loader2, Sparkles } from 'lucide-react';
import { Card } from '../../../components/componentsreutilizables';

/**
 * Componente principal que orquesta la lógica de la página.
 * Maneja el estado del formulario, las llamadas a la API y la gestión de resultados.
 */
export const ContentIdeaGeneratorContainer: React.FC = () => {
  const { generate, isLoading, error, data } = useContentGeneratorAPI();
  const [formInputs, setFormInputs] = useState<Partial<GenerationRequest>>({});
  const [selectedIdea, setSelectedIdea] = useState<string | null>(null);

  const handleInputChange = (field: string, value: any) => {
    if (field === 'audience') {
      setFormInputs(prev => ({
        ...prev,
        audience: value
      }));
    } else {
      setFormInputs(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const handleSubmit = async () => {
    const request: GenerationRequest = {
      objective: formInputs.objective!,
      audience: formInputs.audience!,
      format: formInputs.format!,
      topic: formInputs.topic,
      keywords: formInputs.keywords,
      tone: formInputs.tone,
      count: formInputs.count || 5
    };

    await generate(request);
  };

  const handleSave = async (ideaId: string) => {
    if (!data) return;
    
    const idea = data.ideas.find(i => i.id === ideaId);
    if (!idea) return;

    try {
      await saveIdea(idea);
      alert('Idea guardada en tu banco de ideas');
    } catch (error) {
      console.error('Error guardando idea:', error);
      alert('Error al guardar la idea');
    }
  };

  const handleSchedule = async (ideaId: string) => {
    if (!data) return;
    
    const date = window.prompt('¿Cuándo quieres programar este contenido? (YYYY-MM-DD HH:MM)');
    if (!date) return;

    try {
      const idea = data.ideas.find(i => i.id === ideaId);
      if (idea) {
        await saveIdea(idea);
        await scheduleIdea(idea.id, date);
        alert('Idea programada exitosamente');
      }
    } catch (error) {
      console.error('Error programando idea:', error);
      alert('Error al programar la idea');
    }
  };

  const handleDiscard = (ideaId: string) => {
    if (!data) return;
    
    const updatedIdeas = data.ideas.filter(i => i.id !== ideaId);
    // En producción, actualizar el estado de data con las ideas filtradas
    console.log('Idea descartada:', ideaId);
  };

  return (
    <div className="space-y-6">
      {/* Formulario */}
      <Card className="bg-white shadow-sm" padding="md">
        <div className="flex items-center gap-2 mb-6">
          <Sparkles className="w-6 h-6 text-blue-600" />
          <h2 className="text-xl font-semibold text-gray-900">
            Generar Nuevas Ideas
          </h2>
        </div>
        
        <GeneratorForm
          inputs={formInputs}
          onInputChange={handleInputChange}
          onSubmit={handleSubmit}
          isLoading={isLoading}
        />
      </Card>

      {/* Error */}
      {error && (
        <Card className="text-center bg-white shadow-sm" padding="lg">
          <AlertCircle size={48} className="mx-auto text-red-500 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Error al cargar</h3>
          <p className="text-gray-600 mb-4">{error.message}</p>
        </Card>
      )}

      {/* Loading */}
      {isLoading && (
        <Card className="text-center bg-white shadow-sm" padding="lg">
          <Loader2 size={48} className="mx-auto text-blue-500 animate-spin mb-4" />
          <p className="text-gray-600">Cargando...</p>
        </Card>
      )}

      {/* Resultados */}
      {data && data.ideas.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Lightbulb className="w-6 h-6 text-blue-600" />
              <h2 className="text-xl font-semibold text-gray-900">
                Ideas Generadas ({data.ideas.length})
              </h2>
            </div>
            <div className="text-sm text-slate-600">
              Créditos consumidos: {data.creditsConsumed}
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {data.ideas.map((idea: ContentIdea) => (
              <IdeaCard
                key={idea.id}
                idea={idea}
                onSave={handleSave}
                onSchedule={handleSchedule}
                onDiscard={handleDiscard}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};


