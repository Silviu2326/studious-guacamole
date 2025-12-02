import React from 'react';
import { useAuth } from '../../../context/AuthContext';
import { ContentIdeaGeneratorContainer } from '../components/ContentIdeaGeneratorContainer';
import {
  Lightbulb,
  Sparkles,
  BookOpen
} from 'lucide-react';

/**
 * Página principal del Generador de Ideas de Contenido con IA
 * 
 * Permite a los entrenadores generar ideas de contenido estratégicas y específicas
 * utilizando inteligencia artificial basada en sus objetivos y audiencia.
 */
export const GeneradorDeIdeasDeContenidoConIaPage: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Header */}
      <div className="border-b border-gray-200/60 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6">
          <div className="py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                {/* Icono con contenedor */}
                <div className="p-2 bg-blue-100 rounded-xl mr-4 ring-1 ring-blue-200/70">
                  <Sparkles size={24} className="text-blue-600" />
                </div>
                
                {/* Título y descripción */}
                <div>
                  <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900">
                    Generador de Ideas de Contenido
                  </h1>
                  <p className="text-gray-600">
                    Genera ideas estratégicas de contenido alineadas con tus objetivos de negocio
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
        <div className="mb-6 bg-gradient-to-r from-blue-50 to-slate-50 border border-blue-200/60 rounded-2xl p-6">
          <div className="flex items-start gap-4">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Lightbulb className="w-5 h-5 text-blue-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                ¿Qué es el Generador de Ideas de Contenido?
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Esta herramienta está profundamente integrada en TrainerERP y analiza tus objetivos 
                comerciales, segmentos de clientes y calendario de eventos para generar ideas de contenido 
                altamente relevantes. No es solo un generador de texto genérico; cada idea está alineada 
                con tus metas de negocio (captar leads, vender programas, retener clientes) y viene con 
                ganchos, descripciones y llamadas a la acción específicas para tu audiencia.
              </p>
              <p className="text-xs text-gray-600 mt-2 italic">
                💡 Las ideas generadas deben ser revisadas y personalizadas según tus necesidades específicas.
              </p>
            </div>
          </div>
        </div>

        {/* Contenedor principal */}
        <ContentIdeaGeneratorContainer />
      </div>
    </div>
  );
};

export default GeneradorDeIdeasDeContenidoConIaPage;


