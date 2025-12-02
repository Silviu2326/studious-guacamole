// Página principal de Nóminas & Variables
import React from 'react';
import { useAuth } from '../../../context/AuthContext';
import { PayrollRunDashboard } from '../components/PayrollRunDashboard';
import { Navigate } from 'react-router-dom';
import { Card } from '../../../components/componentsreutilizables';
import { AlertCircle, Euro } from 'lucide-react';

/**
 * Página de Nóminas & Variables
 * 
 * Esta página está diseñada exclusivamente para administradores o propietarios de gimnasios.
 * Permite gestionar la nómina del personal con estructuras salariales complejas
 * incluyendo salarios base, variables (comisiones, bonos) y ajustes manuales.
 */
export default function NominasVariablesPage() {
  const { user } = useAuth();

  // Verificar que el usuario sea un gimnasio
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role === 'entrenador') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
        {/* Header */}
        <div className="border-b border-gray-200/60 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
          <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6">
            <div className="py-6">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-xl mr-4 ring-1 ring-blue-200/70">
                  <Euro size={24} className="text-blue-600" />
                </div>
                <div>
                  <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900">
                    Nóminas & Variables
                  </h1>
                  <p className="text-gray-600">
                    Gestiona las nóminas y variables del personal del gimnasio
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contenido Principal */}
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6 py-8">
          <Card className="p-8 text-center bg-white shadow-sm">
            <AlertCircle size={48} className="mx-auto text-red-500 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Acceso Restringido</h3>
            <p className="text-gray-600 mb-4">
              Esta funcionalidad está disponible solo para administradores de gimnasios.
            </p>
          </Card>
        </div>
      </div>
    );
  }

  // Usar el ID del usuario como gymId
  // En producción, esto podría venir de otra fuente (contexto del gimnasio, etc.)
  const gymId = user.id || 'gym-default';

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Header */}
      <div className="border-b border-gray-200/60 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6">
          <div className="py-6">
            <div className="flex items-center">
              {/* Icono con contenedor */}
              <div className="p-2 bg-blue-100 rounded-xl mr-4 ring-1 ring-blue-200/70">
                <Euro size={24} className="text-blue-600" />
              </div>
              
              {/* Título y descripción */}
              <div>
                <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900">
                  Nóminas & Variables
                </h1>
                <p className="text-gray-600">
                  Gestiona las nóminas y variables del personal del gimnasio
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contenido Principal */}
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6 py-8">
        <PayrollRunDashboard currentGymId={gymId} />
      </div>
    </div>
  );
}

