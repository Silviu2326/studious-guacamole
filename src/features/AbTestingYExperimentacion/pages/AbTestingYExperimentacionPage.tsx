import React from 'react';
import { useAuth } from '../../../context/AuthContext';
import { Card, MetricCards, Button } from '../../../components/componentsreutilizables';
import { ExperimentDashboard } from '../components/ExperimentDashboard';
import { 
  FlaskConical, 
  TrendingUp, 
  Target, 
  BarChart3,
  Plus,
  Zap
} from 'lucide-react';

/**
 * Página principal de A/B Testing y Experimentación
 * 
 * Permite a los entrenadores crear y gestionar experimentos A/B para optimizar
 * sus estrategias de marketing basándose en datos reales.
 */
export const AbTestingYExperimentacionPage: React.FC = () => {
  const { user } = useAuth();
  const esEntrenador = user?.role === 'entrenador';

  // Métricas de ejemplo
  const metricas = [
    {
      id: 'total-experiments',
      title: 'Total Experimentos',
      value: '12',
      subtitle: '5 activos',
      icon: <FlaskConical className="w-5 h-5" />,
      color: 'primary' as const,
      trend: {
        value: 3,
        direction: 'up' as const,
        label: 'este mes'
      }
    },
    {
      id: 'win-rate',
      title: 'Tasa de Éxito',
      value: '68%',
      subtitle: 'Experimentos con ganador',
      icon: <Target className="w-5 h-5" />,
      color: 'success' as const,
      trend: {
        value: 5.2,
        direction: 'up' as const,
        label: 'vs mes anterior'
      }
    },
    {
      id: 'avg-lift',
      title: 'Mejora Promedio',
      value: '+24%',
      subtitle: 'Lift promedio',
      icon: <TrendingUp className="w-5 h-5" />,
      color: 'warning' as const,
      trend: {
        value: 8.1,
        direction: 'up' as const,
        label: 'vs mes anterior'
      }
    },
    {
      id: 'conversions',
      title: 'Conversiones Totales',
      value: '1,245',
      subtitle: 'Desde experimentos',
      icon: <BarChart3 className="w-5 h-5" />,
      color: 'info' as const
    }
  ];

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
                  <FlaskConical size={24} className="text-purple-600" />
                </div>
                
                {/* Título y descripción */}
                <div>
                  <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900">
                    A/B Testing & Experimentación
                  </h1>
                  <p className="text-gray-600 mt-1">
                    Optimiza tus estrategias de marketing basándote en datos reales, no en intuiciones
                  </p>
                </div>
              </div>

              {/* Botón de acción principal */}
              <Button variant="primary" size="md" onClick={() => {/* TODO: Abrir wizard de creación */}}>
                <Plus className="w-5 h-5 mr-2" />
                Nuevo Experimento
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6 py-8">
        <div className="space-y-6">
          {/* Métricas */}
          <MetricCards 
            data={metricas} 
            columns={4} 
          />

          {/* Información educativa */}
          <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
            <div className="p-6">
              <div className="flex items-start gap-4">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Zap className="w-5 h-5 text-purple-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-2">
                    ¿Qué es A/B Testing?
                  </h3>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    El A/B Testing te permite comparar dos o más versiones de un elemento de marketing 
                    (como una landing page, email u oferta) para determinar cuál funciona mejor. 
                    El sistema divide automáticamente el tráfico entre las versiones y analiza estadísticamente 
                    los resultados para asegurar que las diferencias sean fiables y no producto del azar.
                  </p>
                </div>
              </div>
            </div>
          </Card>

          {/* Dashboard de experimentos */}
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Tus Experimentos
            </h2>
            <ExperimentDashboard trainerId={user?.id || 'trainer-123'} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AbTestingYExperimentacionPage;


