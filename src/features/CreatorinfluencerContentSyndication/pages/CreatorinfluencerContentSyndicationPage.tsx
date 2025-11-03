import React from 'react';
import { useAuth } from '../../../context/AuthContext';
import { InfluencerDashboardContainer } from '../components/InfluencerDashboardContainer';
import { Users, Lightbulb, TrendingUp } from 'lucide-react';

/**
 * Página principal de Creator/Influencer Content Syndication
 * 
 * Permite a los entrenadores gestionar colaboraciones con influencers,
 * crear campañas de marketing, y medir el ROI de cada colaboración.
 */
export const CreatorinfluencerContentSyndicationPage: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Header */}
      <div className="border-b border-gray-200/60 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6">
          <div className="py-6">
            <div className="flex items-center">
              {/* Icono con contenedor */}
              <div className="p-2 bg-purple-100 rounded-xl mr-4 ring-1 ring-purple-200/70">
                <Users size={24} className="text-purple-600" />
              </div>
              
              {/* Título y descripción */}
              <div>
                <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900">
                  Creator/Influencer Content Syndication
                </h1>
                <p className="text-gray-600 mt-1">
                  Gestiona colaboraciones con influencers y mide el impacto de tu marketing
                </p>
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
                ¿Qué es Creator/Influencer Content Syndication?
              </h3>
              <p className="text-sm text-gray-700 leading-relaxed">
                Esta herramienta transforma el marketing de influencers de una apuesta incierta 
                en una estrategia medible y escalable. Registra perfiles de influencers, crea 
                campañas de colaboración con términos definidos, genera códigos de descuento y 
                enlaces de seguimiento únicos, y mide el ROI en tiempo real. Conecta directamente 
                los resultados (leads, ventas) con tu embudo de ventas para tomar decisiones 
                basadas en datos sobre dónde invertir tu tiempo y recursos de marketing.
              </p>
            </div>
          </div>
        </div>

        {/* Dashboard */}
        <InfluencerDashboardContainer userId={user?.id || 'user-123'} />
      </div>
    </div>
  );
};

export default CreatorinfluencerContentSyndicationPage;


