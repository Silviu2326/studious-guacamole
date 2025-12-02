import React from 'react';
import { ReceptionsDashboard } from '../components';
import { PackageOpen } from 'lucide-react';

/**
 * Página principal de Recepciones de Material
 * 
 * Sistema de gestión de recepciones de material para gimnasios.
 * Funcionalidades principales:
 * - Registro de recepciones de material asociadas a órdenes de compra
 * - Gestión de discrepancias (dañados, faltantes)
 * - Historial completo de recepciones con filtros
 * - Métricas y reportes de cumplimiento
 */
export const RecepcionesDeMaterialPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Header */}
      <div className="border-b border-gray-200/60 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6">
          <div className="py-6">
            <div className="flex items-center">
              {/* Icono con contenedor */}
              <div className="p-2 bg-blue-100 rounded-xl mr-4 ring-1 ring-blue-200/70">
                <PackageOpen size={24} className="text-blue-600" />
              </div>
              
              {/* Título y descripción */}
              <div>
                <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900">
                  Recepciones de Material
                </h1>
                <p className="text-gray-600">
                  Gestiona las recepciones de material y equipamiento de tus proveedores. 
                  Verifica que todo lo recibido coincide con las órdenes de compra y mantén 
                  un registro completo de discrepancias.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6 py-8">
        <ReceptionsDashboard />
      </div>
    </div>
  );
};

export default RecepcionesDeMaterialPage;

