import React, { useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { StrategyGeneratorWizard } from '../components/StrategyGeneratorWizard';
import { StrategyOutputDisplay } from '../components/StrategyOutputDisplay';
import { useAIStrategyGeneration } from '../hooks/useAIStrategyGeneration';
import {
  StrategyInputData,
  MarketingStrategy
} from '../api/strategies';
import {
  Target,
  Lightbulb,
  AlertCircle,
  Save,
  Download,
  Calendar as CalendarIcon,
  X
} from 'lucide-react';

/**
 * Página principal del Generador de Estrategias de Marketing con IA
 * 
 * Permite a los entrenadores generar planes de marketing completos y personalizados
 * utilizando inteligencia artificial basada en sus objetivos y audiencia.
 */
export const GeneradorDeEstrategiasDeMarketingConIaPage: React.FC = () => {
  const { user } = useAuth();
  const { generate, isLoading, error, data } = useAIStrategyGeneration();
  const [showHistory, setShowHistory] = useState<boolean>(false);

  const handleGenerate = async (input: StrategyInputData) => {
    await generate(input);
  };

  const handleSave = () => {
    if (data) {
      // TODO: Implementar guardado de estrategia
      alert('Estrategia guardada exitosamente');
    }
  };

  const handleExport = () => {
    if (data) {
      // TODO: Implementar exportación a PDF
      alert('Funcionalidad de exportación próximamente');
    }
  };

  const handleAddToCalendar = () => {
    if (data) {
      // TODO: Implementar integración con calendario
      alert('Funcionalidad de integración con calendario próximamente');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Header */}
      <div className="border-b border-gray-200/60 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6">
          <div className="py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                {/* Icono con contenedor */}
                <div className="p-2 bg-purple-100 rounded-xl mr-4 ring-1 ring-purple-200/70">
                  <Target size={24} className="text-purple-600" />
                </div>
                
                {/* Título y descripción */}
                <div>
                  <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900">
                    Generador de Estrategias de Marketing
                  </h1>
                  <p className="text-gray-600 mt-1">
                    Crea planes de marketing completos y personalizados con inteligencia artificial
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6 py-8">
        {/* Información educativa */}
        <div className="mb-6 bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-6">
          <div className="flex items-start gap-4">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Lightbulb className="w-5 h-5 text-purple-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 mb-2">
                ¿Qué es el Generador de Estrategias de Marketing?
              </h3>
              <p className="text-sm text-gray-700 leading-relaxed">
                Esta herramienta actúa como un consultor de marketing virtual. Define tus objetivos, 
                audiencia y preferencias, y la IA generará un plan de marketing completo y personalizado. 
                Puedes crear planes de contenido para redes sociales, estrategias de lanzamiento, 
                tácticas de retención y más. Todo basado en las mejores prácticas del sector del fitness 
                y adaptado a tu negocio específico.
              </p>
              <p className="text-xs text-gray-600 mt-2 italic">
                ⚠️ Las estrategias generadas deben ser revisadas y personalizadas según tus necesidades específicas.
              </p>
            </div>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-600" />
              <div>
                <p className="text-sm font-medium text-red-900">Error al generar estrategia</p>
                <p className="text-xs text-red-700 mt-1">{error.message}</p>
              </div>
            </div>
          </div>
        )}

        {/* Formulario de generación o resultado */}
        {!data ? (
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <StrategyGeneratorWizard
              onSubmit={handleGenerate}
              isGenerating={isLoading}
            />
          </div>
        ) : (
          <div className="space-y-6">
            {/* Header con acciones */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{data.title}</h2>
                  <p className="text-sm text-gray-600 mt-1">
                    Generada el {new Date(data.createdAt).toLocaleDateString('es-ES', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    })}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleSave}
                    className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
                  >
                    <Save className="w-4 h-4" />
                    Guardar
                  </button>
                  <button
                    onClick={handleExport}
                    className="flex items-center gap-2 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
                  >
                    <Download className="w-4 h-4" />
                    Exportar PDF
                  </button>
                  {data.output?.contentPlan && (
                    <button
                      onClick={handleAddToCalendar}
                      className="flex items-center gap-2 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
                    >
                      <CalendarIcon className="w-4 h-4" />
                      Añadir al Calendario
                    </button>
                  )}
                  <button
                    onClick={() => window.location.reload()}
                    className="flex items-center gap-2 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
                  >
                    <X className="w-4 h-4" />
                    Nueva Estrategia
                  </button>
                </div>
              </div>
            </div>

            {/* Estrategia generada */}
            {data.output && (
              <StrategyOutputDisplay
                strategyData={data.output}
                isLoading={false}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default GeneradorDeEstrategiasDeMarketingConIaPage;


