import React from 'react';
import { TeamManagementContainer } from '../components';
import { Users } from 'lucide-react';

/**
 * Página principal de Equipo & Roles
 * 
 * Esta funcionalidad está diseñada exclusivamente para administradores de gimnasios
 * y centros deportivos. Permite gestionar múltiples perfiles de personal (entrenadores,
 * recepción, especialistas).
 * 
 * Ruta: /settings/team
 */
export default function EquipoRolesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Header */}
      <div className="border-b border-gray-200/60 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6">
          <div className="py-6">
            <div className="flex items-center">
              {/* Icono con contenedor */}
              <div className="p-2 bg-blue-100 rounded-xl mr-4 ring-1 ring-blue-200/70">
                <Users size={24} className="text-blue-600" />
              </div>
              
              {/* Título y descripción */}
              <div>
                <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900">
                  Equipo & Roles
                </h1>
                <p className="text-gray-600">
                  Gestiona los miembros de tu equipo y configura los permisos de acceso
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contenedor Principal */}
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6 py-8">
        <TeamManagementContainer />
      </div>
    </div>
  );
}

