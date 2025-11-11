import React from 'react';
import { useAuth } from '../../../context/AuthContext';
import { 
  Video, 
  Plus,
  Calendar,
  Users,
  TrendingUp,
  PlayCircle,
  BarChart3,
  Clock
} from 'lucide-react';

/**
 * Página principal de Webinars & Virtual Events Manager
 * 
 * Centro de control para que los entrenadores diseñen, automaticen y moneticen
 * experiencias virtuales. Permite crear webinars, masterclasses y eventos de comunidad.
 * 
 * Ruta: /dashboard/experiences/virtual-events
 */
export const WebinarsYVirtualEventsManagerPage: React.FC = () => {
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
                    Webinars & Eventos Virtuales
                  </h1>
                  <p className="text-gray-600 mt-1">
                    Crea, gestiona y monetiza experiencias virtuales para tu comunidad
                  </p>
                </div>
              </div>

              {/* Botón de acción principal */}
              <button className="flex items-center gap-2 px-4 py-2.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors shadow-sm">
                <Plus className="w-5 h-5" />
                <span className="font-medium">Nuevo Evento</span>
              </button>
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
              <PlayCircle className="w-5 h-5 text-purple-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 mb-2">
                ¿Qué son los Webinars & Eventos Virtuales?
              </h3>
              <p className="text-sm text-gray-700 leading-relaxed">
                Crea y gestiona eventos virtuales que van desde webinars gratuitos para captar leads, hasta masterclasses 
                premium de pago y retos grupales. El sistema automatiza todo el ciclo de vida: páginas de registro personalizables, 
                gestión de inscritos, recordatorios automáticos por email y SMS, transmisión en vivo, y grabaciones para contenido 
                bajo demanda. Todo diseñado para escalar tu negocio y construir una comunidad comprometida.
              </p>
            </div>
          </div>
        </div>

        {/* Dashboard de estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Eventos Totales</p>
                <p className="text-2xl font-bold text-gray-900">0</p>
                <p className="text-xs text-gray-500 mt-1">Todos los tiempos</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <Video className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Inscritos Totales</p>
                <p className="text-2xl font-bold text-gray-900">0</p>
                <p className="text-xs text-gray-500 mt-1">En todos los eventos</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Tasa de Asistencia</p>
                <p className="text-2xl font-bold text-gray-900">-</p>
                <p className="text-xs text-gray-500 mt-1">Promedio en vivo</p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Ingresos Totales</p>
                <p className="text-2xl font-bold text-gray-900">€0.00</p>
                <p className="text-xs text-gray-500 mt-1">Eventos de pago</p>
              </div>
              <div className="p-3 bg-yellow-100 rounded-lg">
                <BarChart3 className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Filtros de eventos */}
        <div className="mb-6 flex items-center gap-2">
          <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            Próximos
          </button>
          <button className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
            Pasados
          </button>
          <button className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
            Borradores
          </button>
        </div>

        {/* Lista de eventos */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Mis Eventos</h2>
            <p className="text-sm text-gray-600 mt-1">
              Gestiona todos tus webinars, masterclasses y eventos virtuales
            </p>
          </div>

          <div className="p-6">
            {/* Estado vacío */}
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                <Video className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No hay eventos creados aún
              </h3>
              <p className="text-sm text-gray-600 mb-6 max-w-md mx-auto">
                Crea tu primer evento virtual para comenzar a construir tu comunidad y generar nuevas fuentes de ingresos
              </p>
              <button className="inline-flex items-center gap-2 px-4 py-2.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors shadow-sm">
                <Plus className="w-5 h-5" />
                <span className="font-medium">Crear Primer Evento</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WebinarsYVirtualEventsManagerPage;
















