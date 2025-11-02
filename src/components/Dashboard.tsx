import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { EntrenadorDashboard } from './EntrenadorDashboard';
import { GimnasioDashboard } from './GimnasioDashboard';
import { AdherenciaTracker } from '../features/adherencia/components/AdherenciaTracker';
import { RestriccionesAlimentariasPage } from '../features/restricciones-alimentarias/page';
import { BibliotecaEjerciciosPage } from '../features/biblioteca-ejercicios';

export function Dashboard() {
  const { user } = useAuth();
  const [activeView, setActiveView] = useState<string>('dashboard');

  if (!user) return null;

  const renderContent = () => {
    switch (activeView) {
      case 'adherencia':
        return <AdherenciaTracker />;
      case 'restricciones':
        return <RestriccionesAlimentariasPage />;
      case 'biblioteca-ejercicios':
        return <BibliotecaEjerciciosPage />;
      case 'dashboard':
      default:
        return user.role === 'entrenador' ? (
          <EntrenadorDashboard activeView={activeView} onViewChange={setActiveView} />
        ) : (
          <GimnasioDashboard activeView={activeView} onViewChange={setActiveView} />
        );
    }
  };

  return renderContent();
}
