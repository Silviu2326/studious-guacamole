import React from 'react';
import { RolesPermissionsManager } from '../components';
import { Shield, Lock } from 'lucide-react';
import { Card } from '../../../components/componentsreutilizables';

/**
 * Página principal de Roles & Permisos
 * 
 * Esta funcionalidad está diseñada exclusivamente para propietarios y administradores
 * de gimnasios o centros de fitness. Permite crear una estructura jerárquica de acceso
 * para el personal (gerentes, recepcionistas, entrenadores, etc.), asegurando que cada
 * empleado solo pueda ver y modificar las secciones del software relevantes para su trabajo.
 * 
 * Para un entrenador personal independiente, esta funcionalidad no es necesaria, ya que
 * él/ella es el único usuario y administrador de su cuenta, teniendo acceso completo por defecto.
 * 
 * Ruta: /configuracion/roles-y-permisos
 */
export default function RolesPermisosPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Header */}
      <div className="border-b border-gray-200/60 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6">
          <div className="py-6">
            <div className="flex items-center">
              {/* Icono con contenedor */}
              <div className="p-2 bg-blue-100 rounded-xl mr-4 ring-1 ring-blue-200/70">
                <Shield size={24} className="text-blue-600" />
              </div>
              
              {/* Título y descripción */}
              <div>
                <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900">
                  Roles & Permisos
                </h1>
                <p className="text-gray-600">
                  Gestiona los roles del personal y controla el acceso a las funcionalidades del sistema
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contenedor Principal */}
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6 py-8">
        <div className="space-y-6">
          {/* Info Box */}
          <Card className="bg-white shadow-sm">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Lock size={20} className="text-purple-600" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-purple-900 mb-2">
                  Control de Acceso Basado en Roles (RBAC)
                </h3>
                <p className="text-sm text-purple-700">
                  Define roles de trabajo específicos (como 'Recepcionista', 'Entrenador Senior' o 'Personal de Limpieza')
                  y asigna a cada uno un conjunto granular de permisos. Asigna empleados a roles predefinidos en lugar de
                  configurar permisos individualmente, simplificando enormemente la administración.
                </p>
              </div>
            </div>
          </Card>

          {/* Componente principal */}
          <RolesPermissionsManager />
        </div>
      </div>
    </div>
  );
}

