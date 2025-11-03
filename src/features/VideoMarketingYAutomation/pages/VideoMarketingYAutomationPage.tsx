import React from 'react';
import { useAuth } from '../../../context/AuthContext';
import { 
  Video, 
  Plus,
  Play,
  Upload,
  BarChart3,
  Sparkles,
  Film,
  Calendar
} from 'lucide-react';

/**
 * Página principal de Video Marketing & Automation
 * 
 * Centro de creación de contenido audiovisual diseñado específicamente para
 * las necesidades del profesional del fitness. Permite crear, editar y distribuir
 * videos de marketing de alto impacto.
 * 
 * Ruta: /dashboard/content/video-studio
 */
export const VideoMarketingYAutomationPage: React.FC = () => {
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
                  <Video size={24} className="text-purple-600" />
                </div>
                
                {/* Título y descripción */}
                <div>
                  <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900">
                    Video Studio
                  </h1>
                  <p className="text-gray-600 mt-1">
                    Crea, edita y distribuye contenido de video profesional en minutos
                  </p>
                </div>
              </div>

              {/* Botones de acción */}
              <div className="flex items-center gap-3">
                <button className="flex items-center gap-2 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors shadow-sm">
                  <Upload className="w-5 h-5" />
                  <span className="font-medium">Subir Video</span>
                </button>
                <button className="flex items-center gap-2 px-4 py-2.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors shadow-sm">
                  <Plus className="w-5 h-5" />
                  <span className="font-medium">Nuevo Proyecto</span>
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
              <Film className="w-5 h-5 text-purple-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 mb-2">
                ¿Qué es el Video Studio?
              </h3>
              <p className="text-sm text-gray-700 leading-relaxed">
                Crea contenido de video profesional sin necesidad de software costoso. Transforma tus ideas en videos atractivos 
                usando plantillas temáticas personalizables, edita con herramientas simples pero potentes (recortar, añadir texto, 
                música) y programa la publicación automática en múltiples plataformas (Instagram Reels, TikTok, YouTube Shorts). 
                Todo tu contenido se almacena en una biblioteca centralizada para reutilizar clips y activos en futuras creaciones.
              </p>
            </div>
          </div>
        </div>

        {/* Dashboard de estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Videos Publicados</p>
                <p className="text-2xl font-bold text-gray-900">0</p>
                <p className="text-xs text-gray-500 mt-1">Últimos 30 días</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <Video className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Visualizaciones Totales</p>
                <p className="text-2xl font-bold text-gray-900">0</p>
                <p className="text-xs text-gray-500 mt-1">Acumuladas</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <Play className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Tasa de Engagement</p>
                <p className="text-2xl font-bold text-gray-900">-</p>
                <p className="text-xs text-gray-500 mt-1">Promedio</p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <BarChart3 className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Publicaciones Programadas</p>
                <p className="text-2xl font-bold text-gray-900">0</p>
                <p className="text-xs text-gray-500 mt-1">Próximas</p>
              </div>
              <div className="p-3 bg-yellow-100 rounded-lg">
                <Calendar className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Secciones principales */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Proyectos recientes */}
          <div className="lg:col-span-2 bg-white rounded-lg border border-gray-200 shadow-sm">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Mis Proyectos</h2>
                  <p className="text-sm text-gray-600 mt-1">
                    Gestiona tus videos y proyectos de edición
                  </p>
                </div>
                <button className="px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                  Ver todos
                </button>
              </div>
            </div>

            <div className="p-6">
              {/* Estado vacío */}
              <div className="text-center py-12">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                  <Video className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No hay proyectos creados aún
                </h3>
                <p className="text-sm text-gray-600 mb-6 max-w-md mx-auto">
                  Crea tu primer proyecto de video usando una plantilla o empezando desde cero
                </p>
                <button className="inline-flex items-center gap-2 px-4 py-2.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors shadow-sm">
                  <Plus className="w-5 h-5" />
                  <span className="font-medium">Crear Primer Proyecto</span>
                </button>
              </div>
            </div>
          </div>

          {/* Top videos */}
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Top Videos</h2>
              <p className="text-sm text-gray-600 mt-1">
                Tus videos con mejor rendimiento
              </p>
            </div>

            <div className="p-6">
              {/* Estado vacío */}
              <div className="text-center py-8">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 mb-3">
                  <Sparkles className="w-6 h-6 text-gray-400" />
                </div>
                <p className="text-sm text-gray-600">
                  Publica videos para ver estadísticas de rendimiento
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Plantillas y biblioteca */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Plantillas */}
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Plantillas</h2>
              <p className="text-sm text-gray-600 mt-1">
                Empieza rápido con plantillas profesionales
              </p>
            </div>

            <div className="p-6">
              {/* Estado vacío */}
              <div className="text-center py-8">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 mb-3">
                  <Film className="w-6 h-6 text-gray-400" />
                </div>
                <p className="text-sm text-gray-600">
                  Las plantillas estarán disponibles próximamente
                </p>
              </div>
            </div>
          </div>

          {/* Biblioteca de medios */}
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Biblioteca de Medios</h2>
                  <p className="text-sm text-gray-600 mt-1">
                    Tus videos, imágenes y audio
                  </p>
                </div>
                <button className="px-3 py-1.5 text-sm font-medium text-purple-600 hover:text-purple-700 border border-purple-200 rounded-lg hover:bg-purple-50 transition-colors">
                  <Upload className="w-4 h-4 inline mr-1" />
                  Subir
                </button>
              </div>
            </div>

            <div className="p-6">
              {/* Estado vacío */}
              <div className="text-center py-8">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 mb-3">
                  <Upload className="w-6 h-6 text-gray-400" />
                </div>
                <p className="text-sm text-gray-600 mb-4">
                  Sube tus primeros archivos para comenzar a crear
                </p>
                <button className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-purple-600 hover:text-purple-700 transition-colors">
                  <Upload className="w-4 h-4" />
                  <span>Subir Primer Archivo</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoMarketingYAutomationPage;

