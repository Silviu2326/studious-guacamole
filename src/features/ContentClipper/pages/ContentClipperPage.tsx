import React from 'react';
import { useAuth } from '../../../context/AuthContext';
import { ContentClipperDashboard } from '../components/ContentClipperDashboard';
import { Card, MetricCards } from '../../../components/componentsreutilizables';
import { Scissors, Lightbulb, TrendingUp, Package } from 'lucide-react';

/**
 * Página principal del Content Clipper
 * 
 * Permite a los entrenadores capturar, organizar y gestionar contenido
 * de valor encontrado en internet para inspirarse en la creación de
 * su propio contenido de marketing.
 */
export const ContentClipperPage: React.FC = () => {
  const { user } = useAuth();

  // Métricas de ejemplo
  const metricas = [
    {
      id: 'total-contenidos',
      title: 'Total de Contenidos',
      value: '-',
      icon: <Scissors className="w-5 h-5" />,
      color: 'info' as const,
    },
    {
      id: 'este-mes',
      title: 'Este Mes',
      value: '-',
      icon: <TrendingUp className="w-5 h-5" />,
      color: 'primary' as const,
    },
    {
      id: 'categorias',
      title: 'Categorías',
      value: '-',
      icon: <Lightbulb className="w-5 h-5" />,
      color: 'success' as const,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Header */}
      <div className="border-b border-gray-200/60 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6">
          <div className="py-6">
            <div className="flex items-center">
              {/* Icono con contenedor */}
              <div className="p-2 bg-blue-100 rounded-xl mr-4 ring-1 ring-blue-200/70">
                <Scissors size={24} className="text-blue-600" />
              </div>
              
              {/* Título y descripción */}
              <div>
                <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900">
                  Content Clipper
                </h1>
                <p className="text-gray-600">
                  Captura, organiza y reutiliza contenido de valor para tu marketing
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6 py-8">
        <div className="space-y-6">
          {/* Información educativa */}
          <Card className="bg-white shadow-sm">
            <div className="p-6">
              <div className="flex items-start gap-4">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Lightbulb className="w-5 h-5 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    ¿Qué es el Content Clipper?
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    El Content Clipper es tu biblioteca personal de inspiración. Captura cualquier 
                    contenido valioso que encuentres en internet (artículos, videos, estudios) con un 
                    solo clic. Organízalo con categorías y etiquetas, añade notas personales sobre cómo 
                    usar cada pieza, y encuentra rápidamente ideas cuando planifiques tu contenido. 
                    Combate el bloqueo del creador y optimiza tu tiempo de planificación manteniendo 
                    toda tu inspiración organizada en un solo lugar.
                  </p>
                </div>
              </div>
            </div>
          </Card>

          {/* Métricas */}
          <MetricCards 
            data={metricas} 
            columns={3} 
          />

          {/* Dashboard */}
          <ContentClipperDashboard />
        </div>
      </div>
    </div>
  );
};

export default ContentClipperPage;


