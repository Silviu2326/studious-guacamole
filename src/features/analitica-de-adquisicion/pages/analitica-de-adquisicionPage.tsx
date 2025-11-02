import React from 'react';
import { useAuth } from '../../../context/AuthContext';
import { AcquisitionDashboardContainer } from '../components';
import { TrendingUp } from 'lucide-react';

export default function AnaliticaDeAdquisicionPage() {
  const { user } = useAuth();
  const isEntrenador = user?.role === 'entrenador';

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Header */}
      <div className="border-b border-gray-200/60 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6">
          <div className="py-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-xl mr-4 ring-1 ring-blue-200/70">
                <TrendingUp size={24} className="text-blue-600" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900">
                  Analítica de Adquisición
                </h1>
                <p className="text-gray-600">
                  {isEntrenador
                    ? 'Análisis de tus canales de adquisición personales y orgánicos'
                    : 'Inteligencia de marketing y análisis de canales de adquisición'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6 py-8">
        <AcquisitionDashboardContainer isEntrenador={isEntrenador} />
      </div>
    </div>
  );
}

