import React from 'react';
import { GestorRecursos } from '../components';
import { Building2 } from 'lucide-react';

/**
 * Página principal de Recursos, Salas y Material
 * 
 * Sistema completo de gestión de recursos físicos para gimnasios y centros.
 * Funcionalidades principales:
 * - Gestión de salas con control de aforo
 * - Control de inventario y disponibilidad de material
 * - Sistema de reservas de espacios
 * - Bloqueos por mantenimiento
 * - Mantenimiento preventivo programado
 * - Analytics de utilización de recursos
 * 
 * Este módulo es específico para gimnasios y centros que manejan múltiples espacios físicos
 * y equipamiento. No aplica para entrenadores personales que trabajan solos.
 */
export const RecursosSalasMaterialPage: React.FC = () => {
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
                  Recursos, Salas y Material
                </h1>
                <p className="text-gray-600">
                  Sistema completo de gestión de recursos físicos para gimnasios y centros
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contenedor Principal */}
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6 py-8">
        <GestorRecursos />
      </div>
    </div>
  );
};

export default RecursosSalasMaterialPage;

