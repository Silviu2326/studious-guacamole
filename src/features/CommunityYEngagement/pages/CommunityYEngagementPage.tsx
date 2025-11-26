import React from 'react';
import { CommunityMetrics } from '../components/CommunityMetrics';
import { TestimonialsViewer } from '../components/TestimonialsViewer';
import { SurveysManager } from '../components/SurveysManager';
import { InteractionsViewer } from '../components/InteractionsViewer';
import { LoyaltyQuickActions } from '../components/LoyaltyQuickActions';
import {
  Users,
  Sparkles
} from 'lucide-react';

/**
 * Página principal de Comunidad & Fidelización
 * 
 * Centro de mando rediseñado para la gestión profesional de la comunidad,
 * enfocado en testimonios, encuestas y engagement.
 */
export const CommunityYEngagementPage: React.FC = () => {

  return (
    <div className="min-h-screen bg-gray-50/50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10 backdrop-blur-md bg-white/80">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg shadow-blue-500/20 text-white">
                  <Users size={24} />
                </div>

                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">
                    Comunidad & Fidelización
                  </h1>
                  <p className="text-gray-500 text-sm mt-0.5 flex items-center gap-2">
                    Gestiona testimonios, encuestas y engagement con tus clientes
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100">
                      <Sparkles size={10} className="mr-1" />
                      Pro Dashboard
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">

          {/* 1. Métricas Clave */}
          <section>
            <CommunityMetrics />
          </section>

          {/* 2. Grid Principal de 3 Columnas */}
          <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">
            {/* Columna 1: Testimonios */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 h-full overflow-hidden">
              <TestimonialsViewer />
            </div>

            {/* Columna 2: Encuestas */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 h-full overflow-hidden">
              <SurveysManager />
            </div>

            {/* Columna 3: Interacciones */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 h-full overflow-hidden">
              <InteractionsViewer />
            </div>
          </section>

          {/* 3. Acciones Rápidas (Reutilizado) */}
          <section>
            <LoyaltyQuickActions
              onRequestTestimonial={() => console.log('Abrir modal testimonio')}
              onLaunchReferralCampaign={() => console.log('Abrir modal referidos')}
              onCreateSmartSurvey={() => console.log('Abrir modal encuesta')}
            />
          </section>

        </div>
      </div>
    </div>
  );
};

export default CommunityYEngagementPage;
