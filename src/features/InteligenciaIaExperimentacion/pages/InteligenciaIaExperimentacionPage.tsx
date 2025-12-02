import React, { useEffect, useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import {
  Dashboard,
  DashboardViewType,
  StrategyView,
  PlaybooksView,
  GrowthLabView,
  ClientExperienceView,
  OperationsView,
} from '../components';
import { getIntelligenceOverview, getIntelligenceProfile } from '../services/intelligenceService';
import { IntelligenceOverviewResponse } from '../types';
import { Loader2 } from 'lucide-react';

export const InteligenciaIaExperimentacionPage: React.FC = () => {
  const { user } = useAuth();
  const [currentView, setCurrentView] = useState<DashboardViewType>('dashboard');
  const [overview, setOverview] = useState<IntelligenceOverviewResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [overviewData] = await Promise.all([
          getIntelligenceOverview(),
          getIntelligenceProfile(user?.id),
        ]);
        setOverview(overviewData);
      } catch (error) {
        console.error('No se pudo cargar el overview de inteligencia', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [user?.id]);

  const handleBackToDashboard = () => setCurrentView('dashboard');

  const refreshOverview = () => {
    getIntelligenceOverview().then(setOverview);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex items-center gap-3 text-slate-500">
          <Loader2 className="animate-spin" size={24} />
          <span className="text-lg font-medium">Cargando tu centro de inteligencia...</span>
        </div>
      </div>
    );
  }

  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard onNavigate={setCurrentView} />;
      case 'strategy':
        return <StrategyView onBack={handleBackToDashboard} trainerId={user?.id} />;
      case 'playbooks':
        return (
          <PlaybooksView
            onBack={handleBackToDashboard}
            overview={overview}
            trainerId={user?.id}
            onPlaybookCreated={refreshOverview}
          />
        );
      case 'growth-lab':
        return (
          <GrowthLabView
            onBack={handleBackToDashboard}
            overview={overview}
            trainerId={user?.id}
            onExperimentCreated={refreshOverview}
            onPlaybookCreated={refreshOverview}
          />
        );
      case 'client-experience':
        return (
          <ClientExperienceView
            onBack={handleBackToDashboard}
            overview={overview}
            trainerId={user?.id}
          />
        );
      case 'operations':
        return (
          <OperationsView
            onBack={handleBackToDashboard}
            trainerId={user?.id}
            onApprovalChange={refreshOverview}
          />
        );
      default:
        return <Dashboard onNavigate={setCurrentView} />;
    }
  };

  return <div className="min-h-screen bg-slate-50">{renderView()}</div>;
};

export default InteligenciaIaExperimentacionPage;

