import React from 'react';
import { useAuth } from '../../../context/AuthContext';
import { ContentClipperDashboard } from '../components/ContentClipperDashboard';
import { Scissors, Lightbulb, TrendingUp } from 'lucide-react';

/**
 * Página principal del Content Clipper
 * 
 * Permite a los entrenadores capturar, organizar y gestionar contenido
 * de valor encontrado en internet para inspirarse en la creación de
 * su propio contenido de marketing.
 */
export const ContentClipperPage: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Header */}
      <div className="border-b border-gray-200/60 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6">
          <div className="py-6">
            <div className="flex items-center">
              {/* Icono con contenedor */}
              <div className="p-2 bg-purple-100 rounded-xl mr-4 ring-1 ring-purple-200/70">
                <Scissors size={24} className="text-purple-600" />
              </div>
              
              {/* Título y descripción */}
              <div>
                <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900">
                  Content Clipper
                </h1>
                <p className="text-gray-600 mt-1">
                  Captura, organiza y reutiliza contenido de valor para tu marketing
                </p>
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
                ¿Qué es el Content Clipper?
              </h3>
              <p className="text-sm text-gray-700 leading-relaxed">
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

        {/* Estadísticas rápidas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total de Contenidos</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">-</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <Scissors className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Este Mes</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">-</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <TrendingUp className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Categorías</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">-</p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <Lightbulb className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Dashboard */}
        <ContentClipperDashboard />
      </div>
    </div>
  );
};

export default ContentClipperPage;


