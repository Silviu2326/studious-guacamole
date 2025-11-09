import React, { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
  IntelligenceHeader,
  IntelligenceMetrics,
  PlaybookLibrary,
  FeedbackLoopSection,
  ExperimentationSection,
  PersonalizationEngineSection,
  InsightsSection,
} from '../components';
import { getIntelligenceOverview } from '../services/intelligenceService';
import { IntelligenceOverviewResponse } from '../types';
import { Card, Button, Tabs, TabItem } from '../../../components/componentsreutilizables';
import {
  Loader2,
  LayoutDashboard,
  BookOpen,
  MessageSquare,
  Sparkles,
  FlaskConical,
  Radar,
  Wand2,
  MessageSquareHeart,
} from 'lucide-react';

type IntelligenceTabId =
  | 'overview'
  | 'playbooks'
  | 'feedback'
  | 'personalization'
  | 'experimentation'
  | 'insights';

export const InteligenciaIaExperimentacionPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [overview, setOverview] = useState<IntelligenceOverviewResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [hasError, setHasError] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<IntelligenceTabId>('overview');

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await getIntelligenceOverview();
        setOverview(data);
        setHasError(false);
      } catch (error) {
        console.error('No se pudo cargar el overview de inteligencia', error);
        setHasError(true);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  const tabItems: TabItem[] = useMemo(
    () => [
      { id: 'overview', label: 'Overview Hub', icon: <LayoutDashboard size={16} /> },
      { id: 'playbooks', label: 'Playbooks IA', icon: <BookOpen size={16} /> },
      { id: 'feedback', label: 'Feedback Inteligente', icon: <MessageSquare size={16} /> },
      { id: 'personalization', label: 'Personalización IA', icon: <Sparkles size={16} /> },
      { id: 'experimentation', label: 'A/B Testing', icon: <FlaskConical size={16} /> },
      { id: 'insights', label: 'Insights & Mercado', icon: <Radar size={16} /> },
    ],
    []
  );

  const handleCreatePlaybook = () => setActiveTab('playbooks');
  const handleLaunchExperiment = () => setActiveTab('experimentation');

  const renderTabContent = () => {
    if (!overview) return null;

    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-8">
            <IntelligenceMetrics metrics={overview.metrics} />

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              <Card className="p-6 bg-white border border-slate-200/80 shadow-sm">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-indigo-100 text-indigo-600">
                    <Wand2 size={18} />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-slate-900">Generador de Estrategias con IA</h3>
                    <p className="text-sm text-slate-600 mt-2">
                      Define objetivos, audiencias y entregables en minutos con el asistente estratégico.
                    </p>
                    <Button
                      className="mt-4"
                      variant="secondary"
                      onClick={() => navigate('/dashboard/marketing/ia-estrategias')}
                    >
                      Abrir generador
                    </Button>
                  </div>
                </div>
              </Card>

              <Card className="p-6 bg-white border border-slate-200/80 shadow-sm">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-emerald-100 text-emerald-600">
                    <MessageSquareHeart size={18} />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-slate-900">Crea una encuesta inteligente</h3>
                    <p className="text-sm text-slate-600 mt-2">
                      Activa feedback loops que alimenten tus playbooks con señales de clientes reales.
                    </p>
                    <Button className="mt-4" variant="ghost" onClick={() => setActiveTab('feedback')}>
                      Ir a feedback loop
                    </Button>
                  </div>
                </div>
              </Card>

              <Card className="p-6 bg-white border border-slate-200/80 shadow-sm">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-rose-100 text-rose-600">
                    <FlaskConical size={18} />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-slate-900">Explora tus experimentos</h3>
                    <p className="text-sm text-slate-600 mt-2">
                      Prioriza hipótesis y replica ganadores en todos los canales automáticamente.
                    </p>
                    <Button className="mt-4" onClick={() => setActiveTab('experimentation')}>
                      Gestionar experimentos
                    </Button>
                  </div>
                </div>
              </Card>
            </div>

            <InsightsSection insights={overview.insights} />
          </div>
        );
      case 'playbooks':
        return <PlaybookLibrary playbooks={overview.playbooks} />;
      case 'feedback':
        return <FeedbackLoopSection feedbackLoops={overview.feedbackLoops} />;
      case 'personalization':
        return <PersonalizationEngineSection />;
      case 'experimentation':
        return <ExperimentationSection experiments={overview.experiments} />;
      case 'insights':
        return <InsightsSection insights={overview.insights} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <div className="border-b border-slate-200/70 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6 py-8">
          <p className="text-sm text-slate-500 mb-2">
            Hola {user?.name ?? 'equipo'}, aquí tienes tu Engagement Hub central.
          </p>
          <IntelligenceHeader
            onCreatePlaybook={handleCreatePlaybook}
            onLaunchExperiment={handleLaunchExperiment}
          />
        </div>
      </div>

      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6 py-8 space-y-8">
        {isLoading && (
          <Card className="p-12 flex items-center justify-center bg-white shadow-sm border border-slate-200/70">
            <div className="flex items-center gap-3 text-slate-500">
              <Loader2 className="animate-spin" size={20} />
              Cargando inteligencia...
            </div>
          </Card>
        )}

        {hasError && !isLoading && (
          <Card className="p-8 bg-white shadow-sm border border-red-200">
            <p className="text-sm text-red-600">
              Ocurrió un problema al cargar los datos. Intenta de nuevo más tarde.
            </p>
          </Card>
        )}

        {!isLoading && overview && (
          <div className="space-y-8">
            <Tabs
              items={tabItems}
              activeTab={activeTab}
              onTabChange={(tabId) => setActiveTab(tabId as IntelligenceTabId)}
              variant="pills"
              fullWidth
            />

            {renderTabContent()}
          </div>
        )}
      </div>
    </div>
  );
};

export default InteligenciaIaExperimentacionPage;

