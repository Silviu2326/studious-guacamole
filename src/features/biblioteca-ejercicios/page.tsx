import React from 'react';
import { Dumbbell } from 'lucide-react';
import { BibliotecaEjercicios } from './components/BibliotecaEjercicios';

/**
 * Página principal de la Biblioteca de Ejercicios
 * 
 * Esta página proporciona acceso completo al catálogo de ejercicios con:
 * - Búsqueda y filtrado avanzado
 * - Visualización detallada de ejercicios
 * - Sistema de favoritos
 * - Categorización por grupos musculares y equipamiento
 * - Información de seguridad y advertencias
 * 
 * Funciona tanto para entrenadores personales como para gimnasios/centros.
 */
const BibliotecaEjerciciosPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Header */}
      <div className="border-b border-gray-200/60 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6">
          <div className="py-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-xl mr-4 ring-1 ring-blue-200/70">
                <Dumbbell size={24} className="text-blue-600" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900">
                  Biblioteca de Ejercicios
                </h1>
                <p className="text-gray-600">
                  Catálogo completo de ejercicios con vídeos, instrucciones y advertencias
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6 py-8">
        <BibliotecaEjercicios 
          modo="visualizacion"
          mostrarFavoritos={true}
        />
      </div>
    </div>
  );
};

export default BibliotecaEjerciciosPage;