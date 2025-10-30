import React from 'react';
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <BibliotecaEjercicios 
          modo="visualizacion"
          mostrarFavoritos={true}
        />
      </div>
    </div>
  );
};

export default BibliotecaEjerciciosPage;