import React from 'react';
import { useAuth } from '../../../context/AuthContext';
import { SupplierEvaluationDashboard } from '../components';
import { Navigate } from 'react-router-dom';

/**
 * Página de Evaluación de Proveedores
 * 
 * Esta página está diseñada exclusivamente para gimnasios (Administrador o Gerente).
 * Permite gestionar y analizar evaluaciones de proveedores para tomar decisiones
 * informadas basadas en datos históricos y métricas objetivas.
 */
export default function EvaluacionDeProveedoresPage() {
  const { user } = useAuth();
  
  // Solo permitir acceso a gimnasios (no entrenadores)
  const isGym = user?.role !== 'entrenador';
  
  if (!isGym) {
    return <Navigate to="/dashboard" replace />;
  }

  // Obtener el ID del gimnasio (en un sistema real vendría del contexto o auth)
  // Por ahora usamos el user.id como identificador del gimnasio
  const gymId = user?.id || 'gym-default';

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <SupplierEvaluationDashboard gymId={gymId} />
    </div>
  );
}

