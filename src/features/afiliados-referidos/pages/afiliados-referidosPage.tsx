import React from 'react';
import { useAuth } from '../../../context/AuthContext';
import { ReferralDashboardContainer } from '../components';
import { UserType } from '../types';

/**
 * Página principal de Afiliados & Referidos
 * 
 * Adaptada según el rol del usuario:
 * - Gimnasios: Sistema completo con múltiples campañas, códigos únicos, 
 *   recompensas complejas y analytics avanzados
 * - Entrenadores: Versión simplificada con programa "uno a uno" 
 *   fácil de gestionar
 */
const AfiliadosReferidosPage: React.FC = () => {
  const { user } = useAuth();
  const esEntrenador = user?.role === 'entrenador';
  const userType: UserType = esEntrenador ? 'trainer' : 'gym';

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <ReferralDashboardContainer userType={userType} />
    </div>
  );
};

export default AfiliadosReferidosPage;

