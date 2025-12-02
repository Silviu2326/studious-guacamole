import React from 'react';
import { useAuth } from '../../../context/AuthContext';
import { RiskDashboardContainer } from '../components';
import { UserRole } from '../types';
import { AlertTriangle } from 'lucide-react';

/**
 * Página principal de Clientes en Riesgo / Retención
 * 
 * Sistema proactivo para identificar y actuar sobre clientes en riesgo de abandono.
 * 
 * Para Gimnasios:
 * - Enfoque en check-ins, estado de pagos y membresías
 * - Métricas de asistencia masiva
 * - Análisis de MRR en riesgo
 * 
 * Para Entrenadores:
 * - Enfoque en adherencia individual
 * - Sesiones perdidas y comunicación
 * - Registro de progreso
 */
const ClientesEnRiesgoRetencionPage: React.FC = () => {
  const { user } = useAuth();
  const userType: UserRole = user?.role === 'entrenador' ? 'trainer' : 'gym';

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Header según guía de estilos */}
      <div className="border-b border-gray-200/60 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6">
          <div className="py-6">
            <div className="flex items-center">
              {/* Icono con contenedor */}
              <div className="p-2 bg-blue-100 rounded-xl mr-4 ring-1 ring-blue-200/70">
                <AlertTriangle size={24} className="text-blue-600" />
              </div>
              
              {/* Título y descripción */}
              <div>
                <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900">
                  Clientes en Riesgo / Retención
                </h1>
                <p className="text-gray-600">
                  {userType === 'gym'
                    ? 'Identifica y actúa sobre socios en riesgo de abandono'
                    : 'Monitorea la adherencia de tus clientes y toma acción proactiva'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contenedor principal */}
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6 py-8">
        <RiskDashboardContainer userType={userType} />
      </div>
    </div>
  );
};

export default ClientesEnRiesgoRetencionPage;

