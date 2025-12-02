import React from 'react';
import { InventarioManager } from '../components';
import { Package } from 'lucide-react';

/**
 * Página principal de Inventario & Stock
 * 
 * Sistema completo de gestión de inventario para gimnasios.
 * Funcionalidades principales:
 * - Control de stock en tiempo real
 * - Gestión de caducidades de productos
 * - Alertas de stock bajo automáticas
 * - Seguimiento de movimientos de stock
 * - Reportes y análisis
 */
export const InventarioStockPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Header */}
      <div className="border-b border-gray-200/60 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6">
          <div className="py-6">
            <div className="flex items-center">
              {/* Icono con contenedor */}
              <div className="p-2 bg-blue-100 rounded-xl mr-4 ring-1 ring-blue-200/70">
                <Package size={24} className="text-blue-600" />
              </div>
              
              {/* Título y descripción */}
              <div>
                <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900">
                  Inventario & Stock
                </h1>
                <p className="text-gray-600">
                  Sistema completo de gestión de inventario para gimnasios
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6 py-8">
        <InventarioManager />
      </div>
    </div>
  );
};

export default InventarioStockPage;
