import React from 'react';
import { useAuth } from '../../../context/AuthContext';
import { 
  TrendingUp, 
  Plus,
  Search,
  BarChart3,
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
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                {/* Icono con contenedor */}
                <div className="p-2 bg-purple-100 rounded-xl mr-4 ring-1 ring-purple-200/70">
                  <TrendingUp size={24} className="text-purple-600" />
                </div>
                
                {/* Título y descripción */}
                <div>
                  <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900">
                    Trend Analizer
                  </h1>
                  <p className="text-gray-600 mt-1">
                    Inteligencia de mercado y análisis de tendencias emergentes en fitness
                  </p>
                </div>
              </div>

              {/* Botones de acción */}
              <div className="flex items-center gap-3">
                <button className="flex items-center gap-2 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors shadow-sm">
                  <Filter className="w-5 h-5" />
                  <span className="font-medium">Filtros</span>
                </button>
                <button className="flex items-center gap-2 px-4 py-2.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors shadow-sm">
                  <Plus className="w-5 h-5" />
                  <span className="font-medium">Nuevo Competidor</span>
                </button>
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
                ¿Qué es el Trend Analizer?
              </h3>
              <p className="text-sm text-gray-700 leading-relaxed">
                Esta herramienta analiza continuamente datos de redes sociales (Instagram, TikTok, YouTube), 
                blogs de fitness influyentes y motores de búsqueda para identificar patrones y tendencias emergentes. 
                No solo muestra qué es tendencia, sino por qué y cómo puedes capitalizarlo. Obtén sugerencias de contenido 
                generadas por IA, ideas para reels, carruseles y artículos de blog. Además, monitorea las estrategias de 
                tus competidores para encontrar huecos en el mercado y mantenerte relevante como autoridad en el sector.
              </p>
            </div>
          </div>
        </div>

        {/* Dashboard de estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Velocidad de Tendencia</p>
                <p className="text-2xl font-bold text-gray-900">-</p>
                <p className="text-xs text-gray-500 mt-1">Score promedio</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Tendencias Activas</p>
                <p className="text-2xl font-bold text-gray-900">0</p>
                <p className="text-xs text-gray-500 mt-1">Este mes</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <Sparkles className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Competidores Monitoreados</p>
                <p className="text-2xl font-bold text-gray-900">0</p>
                <p className="text-xs text-gray-500 mt-1">Perfiles analizados</p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <Users className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Alertas Configuradas</p>
                <p className="text-2xl font-bold text-gray-900">0</p>
                <p className="text-xs text-gray-500 mt-1">Palabras clave activas</p>
              </div>
              <div className="p-3 bg-yellow-100 rounded-lg">
                <Search className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Secciones principales */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Tendencias destacadas */}
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Top Tendencias</h2>
              <p className="text-sm text-gray-600 mt-1">
                Las tendencias más relevantes en fitness ahora mismo
              </p>
            </div>

            <div className="p-6">
              {/* Estado vacío */}
              <div className="text-center py-12">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                  <TrendingUp className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No hay tendencias disponibles
                </h3>
                <p className="text-sm text-gray-600">
                  Las tendencias se actualizan automáticamente. Vuelve pronto para ver insights.
                </p>
              </div>
            </div>
          </div>

          {/* Sugerencias de contenido */}
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Sugerencias de Contenido</h2>
              <p className="text-sm text-gray-600 mt-1">
                Ideas generadas por IA basadas en tendencias actuales
              </p>
            </div>

            <div className="p-6">
              {/* Estado vacío */}
              <div className="text-center py-12">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                  <Lightbulb className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No hay sugerencias disponibles
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  Selecciona una tendencia para generar ideas de contenido personalizadas
                </p>
                <button className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-purple-600 hover:text-purple-700 transition-colors">
                  <Search className="w-4 h-4" />
                  <span>Explorar Tendencias</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Análisis de competidores */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Análisis de Competidores</h2>
                <p className="text-sm text-gray-600 mt-1">
                  Monitorea las estrategias de tus competidores y encuentra oportunidades
                </p>
              </div>
              <button className="px-4 py-2 text-sm font-medium text-purple-600 hover:text-purple-700 border border-purple-200 rounded-lg hover:bg-purple-50 transition-colors">
                <Plus className="w-4 h-4 inline mr-1" />
                Añadir Competidor
              </button>
            </div>
          </div>

          <div className="p-6">
            {/* Estado vacío */}
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                <Users className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No hay competidores monitoreados
              </h3>
              <p className="text-sm text-gray-600 mb-6 max-w-md mx-auto">
                Añade perfiles de competidores para analizar su contenido más exitoso, 
                frecuencia de publicación y estrategia de hashtags
              </p>
              <button className="inline-flex items-center gap-2 px-4 py-2.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors shadow-sm">
                <Plus className="w-5 h-5" />
                <span className="font-medium">Añadir Primer Competidor</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrendAnalizerPage;

