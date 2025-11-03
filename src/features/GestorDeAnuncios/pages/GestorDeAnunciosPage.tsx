import React from 'react';
import { useAuth } from '../../../context/AuthContext';
import { CampaignsDashboardContainer } from '../components/CampaignsDashboardContainer';
import { Megaphone, Target, TrendingUp } from 'lucide-react';

/**
 * Página principal del Gestor de Anuncios
 * 
 * Permite a los entrenadores crear, gestionar y optimizar campañas publicitarias
 * de forma centralizada sin necesidad de conocimientos técnicos avanzados.
 */
export const GestorDeAnunciosPage: React.FC = () => {
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
                <div className="p-2 bg-purple-100 rounded-xl mr-4 ring-1 ring-purple-200/70">
                  <Megaphone size={24} className="text-purple-600" />
                </div>
                
                {/* Título y descripción */}
                <div>
                  <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900">
                    Gestor de Anuncios
                  </h1>
                  <p className="text-gray-600 mt-1">
                    Gestiona tus campañas publicitarias de forma centralizada y simple
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
              <Target className="w-5 h-5 text-purple-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 mb-2">
                ¿Cómo funciona el Gestor de Anuncios?
              </h3>
              <p className="text-sm text-gray-700 leading-relaxed mb-3">
                Nuestro Gestor de Anuncios simplifica la creación y gestión de campañas publicitarias 
                en Meta (Facebook/Instagram) y Google Ads. Conecta tus cuentas publicitarias, usa plantillas 
                pre-diseñadas y deja que el sistema haga la integración automática con tu CRM.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                <div className="flex items-start gap-3">
                  <TrendingUp className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">ROI Medible</p>
                    <p className="text-xs text-gray-600">Sigue desde el clic hasta la conversión</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Target className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Plantillas Probadas</p>
                    <p className="text-xs text-gray-600">Optimizadas para el nicho fitness</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Megaphone className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Todo en Uno</p>
                    <p className="text-xs text-gray-600">Sin cambiar entre plataformas</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Dashboard de campañas */}
        <CampaignsDashboardContainer />
      </div>
    </div>
  );
};

export default GestorDeAnunciosPage;

