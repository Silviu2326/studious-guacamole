import React from 'react';
import { useAuth } from '../../../context/AuthContext';
import { PerformanceDashboardContainer } from '../components';
import { Card } from '../../../components/componentsreutilizables';
import { BarChart3, Users } from 'lucide-react';

/**
 * Página principal de Feedback Interno y Evaluaciones de Rendimiento
 * 
 * Esta funcionalidad está diseñada exclusivamente para los roles de gestión dentro de un gimnasio
 * (Propietario, Gerente, Jefe de Entrenadores). Permite a la dirección evaluar, monitorear y
 * gestionar el rendimiento de su personal (entrenadores, instructores, etc.).
 * 
 * Ruta: /team/performance-reviews
 * Tipo de Usuario: Solo Gimnasio
 */
export default function FeedbackInternoYEvaluacionesDeRendimientoPage() {
  const { user } = useAuth();
  
  // Obtener el gymId del usuario (esto debería venir del contexto o de la sesión)
  const gymId = user?.gymId || 'default-gym-id';

  // Si es entrenador, no debería acceder (aunque esto debería manejarse en las rutas)
  if (user?.role === 'entrenador') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6 py-8">
          <Card className="p-8 text-center bg-white shadow-sm">
            <Users size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Acceso Restringido
            </h3>
            <p className="text-gray-600 mb-4">
              Esta funcionalidad está disponible solo para gerentes y administradores del gimnasio.
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
                  Feedback Interno y Evaluaciones de Rendimiento
                </h1>
                <p className="text-gray-600">
                  Gestiona y evalúa el rendimiento de tu equipo de entrenadores
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contenedor Principal */}
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6 py-8">
        <PerformanceDashboardContainer gymId={gymId} />
      </div>
    </div>
  );
}

