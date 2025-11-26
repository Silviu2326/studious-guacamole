import React from 'react';
import { useAuth } from '../../../context/AuthContext';
import { LocationSummaryDashboard } from '../components';
import { Card } from '../../../components/componentsreutilizables';
import { BarChart3, Building2 } from 'lucide-react';

export default function ResumenPorSedePage() {
  const { user } = useAuth();
  const isEntrenador = user?.role === 'entrenador';

  // Esta página es solo para gimnasios
  if (isEntrenador) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6 py-8">
          <Card className="p-8 text-center bg-white shadow-sm">
            <Building2 size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Acceso Restringido</h3>
            <p className="text-gray-600 mb-4">
              Esta funcionalidad está diseñada exclusivamente para propietarios de cadenas de gimnasios, administradores regionales o gestores de franquicias. No es aplicable para entrenadores personales independientes, ya que su propósito es comparar el rendimiento operativo y financiero entre múltiples ubicaciones físicas.
            </p>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Header */}
      <div className="border-b border-gray-200/60 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6">
          <div className="py-6">
            <div className="flex items-center">
              {/* Icono con contenedor */}
              <div className="p-2 bg-blue-100 rounded-xl mr-4 ring-1 ring-blue-200/70">
                <BarChart3 size={24} className="text-blue-600" />
              </div>
              
              {/* Título y descripción */}
              <div>
                <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900">
                  Resumen por Sede
                </h1>
                <p className="text-gray-600">
                  Dashboard analítico de alto nivel para comparar el rendimiento de todas las ubicaciones
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6 py-8">
        <LocationSummaryDashboard />
      </div>
    </div>
  );
}

