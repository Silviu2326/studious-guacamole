// Página principal del módulo Parte Horaria / Fichajes
import React from 'react';
import { useAuth } from '../../../context/AuthContext';
import { Card } from '../../../components/componentsreutilizables';
import { TimeTrackingDashboardContainer } from '../components';
import { Clock, AlertCircle } from 'lucide-react';

export default function ParteHorariaFichajesPage() {
  const { user } = useAuth();

  // Verificar que solo gimnasios pueden acceder
  if (user?.role === 'entrenador') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6 py-8">
          <Card className="p-8 text-center bg-white shadow-sm">
            <AlertCircle size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Acceso Restringido</h3>
            <p className="text-gray-600 mb-4">Este módulo está disponible solo para gimnasios.</p>
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
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-xl mr-4 ring-1 ring-blue-200/70">
                  <Clock size={24} className="text-blue-600" />
                </div>
                <div>
                  <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900">
                    Parte Horaria / Fichajes
                  </h1>
                  <p className="text-gray-600">
                    Gestiona el control horario de tu personal interno. Registra fichajes, visualiza el personal presente y genera informes para nóminas.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6 py-8">
        <TimeTrackingDashboardContainer />
      </div>
    </div>
  );
}

