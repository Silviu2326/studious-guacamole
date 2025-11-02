import React from 'react';
import { CatalogManagerContainer } from '../components';
import { Building2 } from 'lucide-react';

/**
 * Página principal de Catálogo y Precios por Sede
 * 
 * Sistema de gestión de catálogo y precios diferenciados por sede.
 * Funcionalidades principales:
 * - Catálogo maestro global
 * - Sobrescritura de precios por sede
 * - Ítems exclusivos por sede
 * - Comparación de catálogos entre sedes
 * - Gestión de disponibilidad por sede
 * 
 * NOTA: Este módulo es exclusivo para gimnasios con múltiples sedes.
 * NO aplica para entrenadores personales independientes.
 */
export const CatalogoYPreciosPorSedePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Header */}
      <div className="border-b border-gray-200/60 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6">
          <div className="py-6">
            <div className="flex items-center">
              {/* Icono con contenedor */}
              <div className="p-2 bg-blue-100 rounded-xl mr-4 ring-1 ring-blue-200/70">
                <Building2 size={24} className="text-blue-600" />
              </div>
              
              {/* Título y descripción */}
              <div>
                <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900">
                  Catálogo y Precios por Sede
                </h1>
                <p className="text-gray-600">
                  Gestión centralizada del catálogo de productos y servicios con personalización por sede. 
                  Define precios locales, gestiona ítems exclusivos y optimiza la estrategia comercial 
                  de cada ubicación manteniendo el control centralizado.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contenido Principal */}
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6 py-8">
        <CatalogManagerContainer />
      </div>
    </div>
  );
};

export default CatalogoYPreciosPorSedePage;
