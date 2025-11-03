import React from 'react';
import { useAuth } from '../../../context/AuthContext';
import { Button, Card, MetricCards } from '../../../components/componentsreutilizables';
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

  // Métricas
  const metricas = [
    {
      id: 'videos-publicados',
      title: 'Videos Publicados',
      value: '0',
      subtitle: 'Últimos 30 días',
      icon: <Video className="w-5 h-5" />,
      color: 'primary' as const
    },
    {
      id: 'visualizaciones',
      title: 'Visualizaciones Totales',
      value: '0',
      subtitle: 'Acumuladas',
      icon: <Play className="w-5 h-5" />,
      color: 'info' as const
    },
    {
      id: 'engagement',
      title: 'Tasa de Engagement',
      value: '-',
      subtitle: 'Promedio',
      icon: <BarChart3 className="w-5 h-5" />,
      color: 'success' as const
    },
    {
      id: 'programadas',
      title: 'Publicaciones Programadas',
      value: '0',
      subtitle: 'Próximas',
      icon: <Calendar className="w-5 h-5" />,
      color: 'warning' as const
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
                <div className="p-2 bg-blue-100 rounded-xl mr-4 ring-1 ring-blue-200/70">
                  <Video size={24} className="text-blue-600" />
                </div>
                
                {/* Título y descripción */}
                <div>
                  <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900">
                    Video Studio
                  </h1>
                  <p className="text-gray-600">
                    Crea, edita y distribuye contenido de video profesional en minutos
                  </p>
                </div>
              </div>

              {/* Botones de acción */}
              <div className="flex items-center gap-3">
                <Button variant="secondary" onClick={() => {/* TODO */}}>
                  <Upload size={20} className="mr-2" />
                  Subir Video
                </Button>
                <Button variant="primary" onClick={() => {/* TODO */}}>
                  <Plus size={20} className="mr-2" />
                  Nuevo Proyecto
                </Button>
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
                  <Film className="w-5 h-5 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    ¿Qué es el Video Studio?
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    Crea contenido de video profesional sin necesidad de software costoso. Transforma tus ideas en videos atractivos 
                    usando plantillas temáticas personalizables, edita con herramientas simples pero potentes (recortar, añadir texto, 
                    música) y programa la publicación automática en múltiples plataformas (Instagram Reels, TikTok, YouTube Shorts). 
                    Todo tu contenido se almacena en una biblioteca centralizada para reutilizar clips y activos en futuras creaciones.
                  </p>
                </div>
              </div>
            </div>
          </Card>

          {/* Dashboard de estadísticas */}
          <MetricCards data={metricas} columns={4} />

          {/* Secciones principales */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Proyectos recientes */}
            <Card className="lg:col-span-2 p-0 bg-white shadow-sm">
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">Mis Proyectos</h2>
                    <p className="text-sm text-gray-600">
                      Gestiona tus videos y proyectos de edición
                    </p>
                  </div>
                  <Button variant="ghost" size="sm">
                    Ver todos
                  </Button>
                </div>
              </div>

              <div className="p-8 text-center">
                {/* Estado vacío */}
                <Video size={48} className="mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No hay proyectos creados aún
                </h3>
                <p className="text-gray-600 mb-4">
                  Crea tu primer proyecto de video usando una plantilla o empezando desde cero
                </p>
                <Button variant="primary" onClick={() => {/* TODO */}}>
                  <Plus size={20} className="mr-2" />
                  Crear Primer Proyecto
                </Button>
              </div>
            </Card>

            {/* Top videos */}
            <Card className="p-0 bg-white shadow-sm">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">Top Videos</h2>
                <p className="text-sm text-gray-600">
                  Tus videos con mejor rendimiento
                </p>
              </div>

              <div className="p-8 text-center">
                {/* Estado vacío */}
                <Sparkles size={48} className="mx-auto text-gray-400 mb-4" />
                <p className="text-gray-600">
                  Publica videos para ver estadísticas de rendimiento
                </p>
              </div>
            </Card>
          </div>

          {/* Plantillas y biblioteca */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Plantillas */}
            <Card className="p-0 bg-white shadow-sm">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">Plantillas</h2>
                <p className="text-sm text-gray-600">
                  Empieza rápido con plantillas profesionales
                </p>
              </div>

              <div className="p-8 text-center">
                {/* Estado vacío */}
                <Film size={48} className="mx-auto text-gray-400 mb-4" />
                <p className="text-gray-600">
                  Las plantillas estarán disponibles próximamente
                </p>
              </div>
            </Card>

            {/* Biblioteca de medios */}
            <Card className="p-0 bg-white shadow-sm">
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">Biblioteca de Medios</h2>
                    <p className="text-sm text-gray-600">
                      Tus videos, imágenes y audio
                    </p>
                  </div>
                  <Button variant="secondary" size="sm" onClick={() => {/* TODO */}}>
                    <Upload size={16} className="mr-1" />
                    Subir
                  </Button>
                </div>
              </div>

              <div className="p-8 text-center">
                {/* Estado vacío */}
                <Upload size={48} className="mx-auto text-gray-400 mb-4" />
                <p className="text-gray-600 mb-4">
                  Sube tus primeros archivos para comenzar a crear
                </p>
                <Button variant="secondary" onClick={() => {/* TODO */}}>
                  <Upload size={20} className="mr-2" />
                  Subir Primer Archivo
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoMarketingYAutomationPage;

