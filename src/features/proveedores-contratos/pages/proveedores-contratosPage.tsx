import React from 'react';
import { useAuth } from '../../../context/AuthContext';
import { SuppliersDashboardContainer } from '../components';
import { Navigate } from 'react-router-dom';
import { Building2 } from 'lucide-react';

/**
 * Página de Proveedores & Contratos
 * 
 * Esta página está diseñada exclusivamente para gimnasios (Administrador o Gerente).
 * Permite gestionar la red de proveedores y los contratos asociados, incluyendo:
 * - Registro y categorización de proveedores
 * - Proceso de homologación
 * - Gestión del ciclo de vida de contratos
 * - Evaluaciones de rendimiento
 * - Documentos y SLAs
 */
export default function ProveedoresContratosPage() {
  const { user } = useAuth();
  
  // Solo permitir acceso a gimnasios (no entrenadores)
  const isGym = user?.role !== 'entrenador';
  
  if (!isGym) {
    return <Navigate to="/dashboard" replace />;
  }

  // Obtener el ID del gimnasio (en un sistema real vendría del contexto o auth)
  const gymId = user?.id || 'gym-default';

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
                  Proveedores & Contratos
                </h1>
                <p className="text-gray-600">
                  Gestión centralizada de proveedores y contratos para tu gimnasio
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6 py-8">
        <SuppliersDashboardContainer gymId={gymId} />
      </div>
    </div>
  );
}

