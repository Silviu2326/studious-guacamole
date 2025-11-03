import React from 'react';
import { useAuth } from '../../../context/AuthContext';
import { Card, Button, MetricCards } from '../../../components/componentsreutilizables';
import { 
  TrendingUp, 
  Plus,
  Search,
  Lightbulb,
  Filter,
  Sparkles,
  Users
} from 'lucide-react';

/**
 * Página principal de Trend Analizer
 * 
 * Centro de inteligencia competitiva y de mercado para mantener al entrenador
 * un paso por delante de la competencia mediante el análisis de tendencias emergentes
 * en el sector fitness.
 * 
 * Ruta: /dashboard/intelligence/trend-analyzer
 */
export const TrendAnalizerPage: React.FC = () => {
  const { user } = useAuth();
  const esEntrenador = user?.role === 'entrenador';

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Header */}
      <div className="border-b border-gray-200/60 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6">
          <div className="py-6">
            <div className="flex items-center">
              {/* Icono con contenedor */}
              <div className="p-2 bg-blue-100 rounded-xl mr-4 ring-1 ring-blue-200/70">
                <TrendingUp size={24} className="text-blue-600" />
              </div>
              
              {/* Título y descripción */}
              <div>
                <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900">
                  Trend Analizer
                </h1>
                <p className="text-gray-600">
                  Inteligencia de mercado y análisis de tendencias emergentes en fitness
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6 py-8">
        <div className="space-y-6">
          {/* Toolbar superior */}
          <div className="flex items-center justify-end">
            <div className="flex items-center gap-3">
              <Button variant="secondary" leftIcon={<Filter size={20} />}>
                Filtros
              </Button>
              <Button leftIcon={<Plus size={20} />}>
                Nuevo Competidor
              </Button>
            </div>
          </div>
          {/* KPIs/Métricas */}
          <MetricCards
            data={[
              {
                id: 'velocidad',
                title: 'Velocidad de Tendencia',
                value: '-',
                subtitle: 'Score promedio',
                color: 'primary',
                icon: <TrendingUp size={24} />
              },
              {
                id: 'tendencias',
                title: 'Tendencias Activas',
                value: '0',
                subtitle: 'Este mes',
                color: 'info',
                icon: <Sparkles size={24} />
              },
              {
                id: 'competidores',
                title: 'Competidores Monitoreados',
                value: '0',
                subtitle: 'Perfiles analizados',
                color: 'success',
                icon: <Users size={24} />
              },
              {
                id: 'alertas',
                title: 'Alertas Configuradas',
                value: '0',
                subtitle: 'Palabras clave activas',
                color: 'warning',
                icon: <Search size={24} />
              }
            ]}
            columns={4}
          />

          {/* Secciones principales */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Tendencias destacadas */}
            <Card className="p-0 bg-white shadow-sm">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">Top Tendencias</h2>
                <p className="text-sm text-gray-600 mt-1">
                  Las tendencias más relevantes en fitness ahora mismo
                </p>
              </div>

              <div className="p-8 text-center">
                <TrendingUp size={48} className="mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No hay tendencias disponibles
                </h3>
                <p className="text-gray-600">
                  Las tendencias se actualizan automáticamente. Vuelve pronto para ver insights.
                </p>
              </div>
            </Card>

            {/* Sugerencias de contenido */}
            <Card className="p-0 bg-white shadow-sm">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">Sugerencias de Contenido</h2>
                <p className="text-sm text-gray-600 mt-1">
                  Ideas generadas por IA basadas en tendencias actuales
                </p>
              </div>

              <div className="p-8 text-center">
                <Lightbulb size={48} className="mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No hay sugerencias disponibles
                </h3>
                <p className="text-gray-600 mb-4">
                  Selecciona una tendencia para generar ideas de contenido personalizadas
                </p>
                <Button variant="ghost" size="sm" leftIcon={<Search size={16} />}>
                  Explorar Tendencias
                </Button>
              </div>
            </Card>
          </div>

          {/* Análisis de competidores */}
          <Card className="p-0 bg-white shadow-sm">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Análisis de Competidores</h2>
                  <p className="text-sm text-gray-600 mt-1">
                    Monitorea las estrategias de tus competidores y encuentra oportunidades
                  </p>
                </div>
                <Button variant="ghost" size="sm" leftIcon={<Plus size={16} />}>
                  Añadir Competidor
                </Button>
              </div>
            </div>

            <div className="p-8 text-center">
              <Users size={48} className="mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No hay competidores monitoreados
              </h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                Añade perfiles de competidores para analizar su contenido más exitoso, 
                frecuencia de publicación y estrategia de hashtags
              </p>
              <Button leftIcon={<Plus size={20} />}>
                Añadir Primer Competidor
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default TrendAnalizerPage;

