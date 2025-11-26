import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import {
  VideoStudioSpotlight,
  VideoScriptGenerator,
  AIContentWorkbench,
  AITemplateLibrary,
  InternalContentIdeasGenerator,
  ContentAIFeedback,
  ClientTransformationPostGenerator,
  FAQContentGenerator,
} from '../components';
import { Button } from '../../../components/componentsreutilizables';
import type { CreationAndAISnapshot } from '../types';

/**
 * Página dedicada "Creación & IA"
 * Agrupa las herramientas de producción (vídeo y contenido) con la suite de IA creativa
 */
export default function CreationAndAIPage() {
  const [loading, setLoading] = useState(true);
  const [videoData, setVideoData] = useState<CreationAndAISnapshot['video'] | null>(null);
  const [aiData, setAiData] = useState<CreationAndAISnapshot['ai'] | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      // Cargar datos de video y AI de forma independiente
      // En lugar de usar getContentSocialStudioSnapshot(), cada componente usa sus propias APIs
      const [video, ai] = await Promise.all([
        loadVideoData(),
        loadAIData(),
      ]);
      setVideoData(video);
      setAiData(ai);
    } catch (error) {
      console.error('[CreationAndAIPage] Error loading data', error);
    } finally {
      setLoading(false);
    }
  };

  // Cargar datos de video de forma independiente
  // Nota: En producción, esto llamaría a una API específica de video (ej: getVideoStudioData())
  // En lugar de usar getContentSocialStudioSnapshot()
  const loadVideoData = async (): Promise<CreationAndAISnapshot['video']> => {
    // Simular carga de datos
    await new Promise((resolve) => setTimeout(resolve, 200));
    
    // En producción, esto sería: return await getVideoStudioData();
    return {
      projects: [],
      automationPlaybooks: 0,
      readyToPublish: 0,
      libraryAssets: 0,
    };
  };

  // Cargar datos de AI de forma independiente
  // Nota: En producción, esto llamaría a una API específica de AI (ej: getAIContentWorkbenchData())
  // En lugar de usar getContentSocialStudioSnapshot()
  const loadAIData = async (): Promise<CreationAndAISnapshot['ai']> => {
    // Simular carga de datos
    await new Promise((resolve) => setTimeout(resolve, 200));
    
    // En producción, esto sería: return await getAIContentWorkbenchData();
    return {
      assistants: [],
      quickIdeas: [],
      lastUpdated: new Date().toISOString(),
    };
  };

  return (
    <div className="space-y-8 p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Creación & IA</h1>
            <p className="text-slate-600 mt-2">
              Herramientas de producción de vídeo y contenido con IA creativa
            </p>
          </div>
          <Link to="/dashboard/content/social-studio">
            <Button
              variant="ghost"
              size="sm"
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Volver
            </Button>
          </Link>
        </div>
      </div>

      {/* Bloque: Video Studio */}
      <section className="space-y-6">
        <div className="border-b border-slate-200 pb-3">
          <h2 className="text-2xl font-semibold text-slate-900">Video Studio</h2>
          <p className="text-sm text-slate-600 mt-1">
            Trabaja en proyectos de vídeo y genera guiones con IA
          </p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {videoData && (
            <VideoStudioSpotlight video={videoData} loading={loading} />
          )}
          <VideoScriptGenerator loading={loading} />
        </div>
      </section>

      {/* Bloque: IA Creativa */}
      <section className="space-y-6">
        <div className="border-b border-slate-200 pb-3">
          <h2 className="text-2xl font-semibold text-slate-900">IA Creativa</h2>
          <p className="text-sm text-slate-600 mt-1">
            Genera ideas, usa plantillas y crea contenido con IA
          </p>
        </div>
        <div className="space-y-6">
          {aiData && (
            <AIContentWorkbench ai={aiData} loading={loading} />
          )}
          <AITemplateLibrary loading={loading} />
          <InternalContentIdeasGenerator loading={loading} />
        </div>
      </section>

      {/* Bloque: Contenido basado en evidencia */}
      <section className="space-y-6">
        <div className="border-b border-slate-200 pb-3">
          <h2 className="text-2xl font-semibold text-slate-900">Contenido basado en evidencia</h2>
          <p className="text-sm text-slate-600 mt-1">
            Crea contenido a partir de transformaciones de clientes y preguntas frecuentes
          </p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ClientTransformationPostGenerator loading={loading} />
          <FAQContentGenerator loading={loading} />
        </div>
      </section>

      {/* Bloque: Feedback IA */}
      <section className="space-y-6">
        <div className="border-b border-slate-200 pb-3">
          <h2 className="text-2xl font-semibold text-slate-900">Feedback IA</h2>
          <p className="text-sm text-slate-600 mt-1">
            Revisa y mejora contenido generado con retroalimentación de IA
          </p>
        </div>
        <ContentAIFeedback loading={loading} />
      </section>
    </div>
  );
}

