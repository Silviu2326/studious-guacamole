import React from 'react';
import { useAuth } from '../../../context/AuthContext';
import { MarketIntelligenceDashboard } from '../components/MarketIntelligenceDashboard';
import { 
  TrendingUp, 
  Plus,
  Search,
  BarChart3,
  Lightbulb
} from 'lucide-react';

/**
 * Página principal de Análisis Competitivo e Inteligencia de Mercado
 * 
 * Permite a los entrenadores monitorear competidores y analizar el mercado
 * para tomar decisiones estratégicas basadas en datos.
 */
export const CompetitiveAnalysisYMarketIntelligencePage: React.FC = () => {
  const { user } = useAuth();
  const esEntrenador = user?.role === 'entrenador';

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
                  <TrendingUp size={24} className="text-blue-600" />
                </div>
                
                {/* Título y descripción */}
                <div>
                  <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900">
                    Análisis Competitivo & Inteligencia de Mercado
                  </h1>
                  <p className="text-gray-600 mt-1">
                    Transforma datos del mercado en decisiones estratégicas para tu negocio
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
        <div className="mb-6 bg-gradient-to-r from-blue-50 to-slate-50 border border-blue-200 rounded-lg p-6">
          <div className="flex items-start gap-4">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Lightbulb className="w-5 h-5 text-blue-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 mb-2">
                ¿Qué es la Inteligencia de Mercado?
              </h3>
              <p className="text-sm text-gray-700 leading-relaxed">
                Esta herramienta te permite monitorear de forma automatizada a tus competidores directos 
                y analizar las tendencias del mercado en tu ubicación y nicho. Recopilamos información pública 
                sobre precios, servicios, estrategias de contenido y promociones para ayudarte a tomar 
                decisiones de negocio más inteligentes y diferenciarte en el mercado.
              </p>
            </div>
          </div>
        </div>

        {/* Dashboard de inteligencia de mercado */}
        <MarketIntelligenceDashboard userId={user?.id || 'user-123'} />
      </div>
    </div>
  );
};

export default CompetitiveAnalysisYMarketIntelligencePage;


