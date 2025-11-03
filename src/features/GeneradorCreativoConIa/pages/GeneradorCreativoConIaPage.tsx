import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { GenerationForm } from '../components/GenerationForm';
import { ResultCard } from '../components/ResultCard';
import { useAIGeneration } from '../hooks/useAIGeneration';
import {
  getContentTemplates,
  getBrandProfile,
  saveGeneratedContent,
  GenerationRequest,
  ContentTemplate
} from '../api/generator';
import {
  Sparkles,
  Lightbulb,
  History,
  Loader2,
  AlertCircle,
  X
} from 'lucide-react';

/**
 * Página principal del Generador Creativo con IA
 * 
 * Permite a los entrenadores generar contenido de marketing de alta calidad
 * utilizando inteligencia artificial personalizada con su marca.
 */
export const GeneradorCreativoConIaPage: React.FC = () => {
  const { user } = useAuth();
  const { generate, isLoading, error, data } = useAIGeneration();
  const [templates, setTemplates] = useState(getContentTemplates());
  const [brandProfile, setBrandProfile] = useState<any>(null);
  const [showHistory, setShowHistory] = useState<boolean>(false);

  useEffect(() => {
    loadBrandProfile();
  }, []);

  const loadBrandProfile = async () => {
    try {
      const profile = await getBrandProfile();
      setBrandProfile(profile);
    } catch (error) {
      console.error('Error cargando perfil de marca:', error);
    }
  };

  const handleGenerate = async (formData: {
    prompt: string;
    templateId: string;
    settings: any;
  }) => {
    const request: GenerationRequest = {
      templateId: formData.templateId as ContentTemplate,
      prompt: formData.prompt,
      settings: formData.settings
    };

    await generate(request);
  };

  const handleCopy = () => {
    // Acción adicional después de copiar si es necesario
    console.log('Contenido copiado');
  };

  const handleSave = async (resultId: string) => {
    if (data) {
      try {
        await saveGeneratedContent(data.generationId, resultId);
      } catch (error) {
        console.error('Error guardando contenido:', error);
        alert('Error al guardar el contenido');
      }
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
                  <Sparkles size={24} className="text-purple-600" />
                </div>
                
                {/* Título y descripción */}
                <div>
                  <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900">
                    Generador Creativo con IA
                  </h1>
                  <p className="text-gray-600 mt-1">
                    Genera contenido de marketing de alta calidad en segundos
                  </p>
                </div>
              </div>
              
              <button
                onClick={() => setShowHistory(!showHistory)}
                className="flex items-center gap-2 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
              >
                <History className="w-5 h-5" />
                Historial
              </button>
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
                ¿Qué es el Generador Creativo con IA?
              </h3>
              <p className="text-sm text-gray-700 leading-relaxed">
                Esta herramienta utiliza inteligencia artificial para generar textos de marketing 
                específicos para el nicho del fitness. Selecciona una plantilla, describe tu idea, 
                y la IA creará múltiples variantes de contenido alineadas con tu marca. Personaliza 
                el tono, público objetivo y longitud para obtener resultados perfectos para tu negocio.
              </p>
              <p className="text-xs text-gray-600 mt-2 italic">
                ⚠️ El contenido generado debe ser revisado antes de publicarse.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Formulario de generación */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                Crear Nuevo Contenido
              </h2>
              
              <GenerationForm
                templates={templates}
                brandProfile={brandProfile}
                onSubmit={handleGenerate}
                isGenerating={isLoading}
              />
            </div>

            {/* Error */}
            {error && (
              <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-red-600" />
                  <div>
                    <p className="text-sm font-medium text-red-900">Error al generar contenido</p>
                    <p className="text-xs text-red-700 mt-1">{error.message}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Resultados */}
            {data && data.results.length > 0 && (
              <div className="mt-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-gray-900">
                    Resultados Generados
                  </h2>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <span>Tokens usados: {data.tokensUsed}</span>
                  </div>
                </div>
                
                <div className="space-y-4">
                  {data.results.map((result) => (
                    <ResultCard
                      key={result.id}
                      result={result}
                      onCopy={handleCopy}
                      onSave={() => handleSave(result.id)}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Loading state */}
            {isLoading && (
              <div className="mt-6 bg-white rounded-lg border border-gray-200 p-12 text-center">
                <Loader2 className="w-8 h-8 text-purple-600 animate-spin mx-auto mb-4" />
                <p className="text-gray-600">Generando contenido con IA...</p>
                <p className="text-sm text-gray-500 mt-2">
                  Esto puede tomar unos segundos
                </p>
              </div>
            )}
          </div>

          {/* Sidebar - Perfil de marca e info */}
          <div className="space-y-6">
            {/* Perfil de marca */}
            {brandProfile && (
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Perfil de Marca
                </h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-xs font-medium text-gray-600 mb-1">Tono de Voz</p>
                    <p className="text-sm text-gray-900">{brandProfile.toneOfVoice}</p>
                  </div>
                  {brandProfile.targetAudience && (
                    <div>
                      <p className="text-xs font-medium text-gray-600 mb-1">Público Objetivo</p>
                      <p className="text-sm text-gray-900">{brandProfile.targetAudience}</p>
                    </div>
                  )}
                  {brandProfile.keywords && brandProfile.keywords.length > 0 && (
                    <div>
                      <p className="text-xs font-medium text-gray-600 mb-1">Palabras Clave</p>
                      <div className="flex flex-wrap gap-1">
                        {brandProfile.keywords.map((keyword: string, idx: number) => (
                          <span
                            key={idx}
                            className="px-2 py-1 text-xs bg-purple-100 text-purple-700 rounded"
                          >
                            {keyword}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                <button className="mt-4 w-full text-sm text-purple-600 hover:text-purple-700">
                  Editar Perfil
                </button>
              </div>
            )}

            {/* Consejos */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="text-sm font-semibold text-blue-900 mb-3">
                💡 Consejos para mejores resultados
              </h3>
              <ul className="space-y-2 text-xs text-blue-800">
                <li>• Sé específico sobre el tema y el objetivo</li>
                <li>• Define claramente a quién va dirigido</li>
                <li>• Usa el perfil de marca para mantener coherencia</li>
                <li>• Revisa y personaliza el contenido generado</li>
                <li>• Guarda las mejores variantes para reutilizar</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GeneradorCreativoConIaPage;


