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
  IntelligenceProfileSection,
  AIOverviewSection,
  AIPrioritizationSection,
  PersonalizationImpactSection,
  IntegratedAIPatternsSection,
  ChannelInsightsSection,
  MarketTrendsAlertsSection,
  QuarterlyPlanSection,
  OwnershipTrackingSection,
  SectorTrendsLink,
  // User Story 1: Aprobar experimentos/playbooks desde móvil con resumen IA
  MobileApprovalSection,
  // User Story 2: Sincronizar playbooks con otras sedes o entrenadores
  PlaybookSyncSection,
  // User Story 1: IA que aprende de decisiones de playbooks
  PlaybookLearningInsights,
  // User Story 2: Evaluación automática de impacto de iniciativas
  InitiativeImpactEvaluation,
} from '../components';
import { getIntelligenceOverview, getIntelligenceProfile } from '../services/intelligenceService';
import { IntelligenceOverviewResponse, DecisionStyle } from '../types';
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
  UserCog,
  BarChart3,
  Target,
  TrendingUp,
  Layers,
  BarChart,
  Bell,
  Calendar,
  UserCheck,
  Smartphone,
  RefreshCw,
  Trophy,
} from 'lucide-react';

type IntelligenceTabId =
  | 'overview'
  | 'ai-overview'
  | 'ai-prioritization'
  | 'quarterly-plan'
  | 'monthly-retrospective'
  | 'playbooks'
  | 'playbook-learning'
  | 'initiative-impact'
  | 'feedback'
  | 'personalization'
  | 'personalization-impact'
  | 'integrated-ai-view'
  | 'experimentation'
  | 'experiments-impact'
  | 'insights'
  | 'channel-insights'
  | 'market-trends'
  | 'trend-analyzer'
  | 'ownership'
  | 'mobile-approval'
  | 'playbook-sync'
  | 'profile';

type IntelligenceCategoryId =
  | 'overview-hub'
  | 'planning'
  | 'playbooks'
  | 'experiments-impact'
  | 'personalization-feedback'
  | 'insights-market'
  | 'operations'
  | 'profile';

interface IntelligenceCategory {
  id: IntelligenceCategoryId;
  label: string;
  icon: React.ReactNode;
  tabs: TabItem[];
}

export const InteligenciaIaExperimentacionPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [overview, setOverview] = useState<IntelligenceOverviewResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [hasError, setHasError] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<IntelligenceTabId>('trend-analyzer');
  const [activeCategory, setActiveCategory] = useState<IntelligenceCategoryId>('insights-market');
  const [decisionStyle, setDecisionStyle] = useState<DecisionStyle | undefined>(undefined);
  const [aiOverviewPeriod, setAiOverviewPeriod] = useState<'7d' | '30d' | '90d'>('30d');
  const [aiPrioritizationPeriod, setAiPrioritizationPeriod] = useState<'7d' | '30d' | '90d'>('30d');
  const [personalizationImpactPeriod, setPersonalizationImpactPeriod] = useState<'7d' | '30d' | '90d' | '180d' | '365d'>('30d');
  const [integratedAIViewPeriod, setIntegratedAIViewPeriod] = useState<'7d' | '30d' | '90d'>('30d');
  const [channelInsightsPeriod, setChannelInsightsPeriod] = useState<'7d' | '30d' | '90d'>('30d');
  const [marketTrendsPeriod, setMarketTrendsPeriod] = useState<'7d' | '30d' | '90d'>('30d');

  useEffect(() => {
    const loadData = async () => {
      try {
        const [overviewData, profileData] = await Promise.all([
          getIntelligenceOverview(),
          getIntelligenceProfile(user?.id),
        ]);
        setOverview(overviewData);
        setDecisionStyle(profileData?.decisionStyle);
        setHasError(false);
      } catch (error) {
        console.error('No se pudo cargar el overview de inteligencia', error);
        setHasError(true);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [user?.id]);

  const categories = useMemo<IntelligenceCategory[]>(
    () => [
      {
        id: 'insights-market',
        label: 'Trend Analyzer & Competencia',
        icon: <Radar size={16} />,
        tabs: [
          { id: 'trend-analyzer', label: 'Trend Analyzer & Competencia', icon: <Radar size={16} /> },
        ],
      },
      {
        id: 'experiments-impact',
        label: 'A/B Tests & Impacto',
        icon: <FlaskConical size={16} />,
        tabs: [
          { id: 'experiments-impact', label: 'A/B Tests & Impacto', icon: <FlaskConical size={16} /> },
        ],
      },
    ],
    []
  );

  const categoryTabItems = useMemo<TabItem[]>(
    () =>
      categories.map((category) => ({
        id: category.id,
        label: category.label,
        icon: category.icon,
      })),
    [categories]
  );

  const getCategoryForTab = (tabId: IntelligenceTabId): IntelligenceCategoryId => {
    const category = categories.find((cat) => cat.tabs.some((tab) => tab.id === tabId));
    return category?.id ?? 'insights-market';
  };

  const activateTab = (tabId: IntelligenceTabId) => {
    setActiveTab(tabId);
    setActiveCategory(getCategoryForTab(tabId));
  };

  const handleCategoryChange = (categoryId: IntelligenceCategoryId) => {
    const category = categories.find((cat) => cat.id === categoryId);
    if (!category) return;
    setActiveCategory(categoryId);
    const firstTab = category.tabs[0]?.id as IntelligenceTabId | undefined;
    if (firstTab) {
      setActiveTab(firstTab);
    }
  };

  const handleSubTabChange = (tabId: IntelligenceTabId) => {
    activateTab(tabId);
  };

  const activeCategoryConfig = useMemo(
    () => categories.find((cat) => cat.id === activeCategory),
    [categories, activeCategory]
  );
  const subTabItems = activeCategoryConfig?.tabs ?? [];

  const handleCreatePlaybook = () => activateTab('playbooks');
  const handleLaunchExperiment = () => activateTab('experiments-impact');
  const handleViewFeedback = () => activateTab('feedback');
  const handleViewCampaignDetails = (campaignId: string) => {
    // Navigate to campaign details or show modal
    console.log('View campaign details:', campaignId);
    // TODO: Implement navigation to campaign details
  };
  const handleDuplicateCampaign = (campaignId: string) => {
    // Duplicate campaign logic
    console.log('Duplicate campaign:', campaignId);
    // TODO: Implement campaign duplication
  };
  const handleViewExperimentResults = () => {
    activateTab('experiments-impact');
    // TODO: Scroll to completed experiments or highlight them
  };
  const handlePauseSend = (sendId: string) => {
    // Pause send logic
    console.log('Pause send:', sendId);
    // TODO: Implement pause send functionality
  };
  const handleEditSend = (sendId: string) => {
    // Edit send logic
    console.log('Edit send:', sendId);
    // TODO: Implement edit send functionality - navigate to edit page or open modal
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        if (!overview) return null;
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

              {/* Nota: El entry point para crear encuestas inteligentes se encuentra ahora en la feature CommunityYEngagement (Comunidad & Fidelización) */}

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
                    <Button className="mt-4" onClick={() => activateTab('experiments-impact')}>
                      Gestionar experimentos
                    </Button>
                  </div>
                </div>
              </Card>
            </div>

            <InsightsSection 
              insights={overview.insights} 
              onPlaybookCreated={(playbookId) => {
                // Recargar datos cuando se crea un playbook desde un insight
                getIntelligenceOverview().then((data) => {
                  setOverview(data);
                  activateTab('playbooks');
                });
              }}
            />
          </div>
        );
      case 'ai-overview':
        return (
          <AIOverviewSection
            period={aiOverviewPeriod}
            onPeriodChange={(period) => setAiOverviewPeriod(period)}
          />
        );
      case 'ai-prioritization':
        return (
          <AIPrioritizationSection
            period={aiPrioritizationPeriod}
            onPeriodChange={(period) => setAiPrioritizationPeriod(period)}
            trainerId={user?.id}
          />
        );
      case 'quarterly-plan':
        return (
          <QuarterlyPlanSection
            trainerId={user?.id}
          />
        );
      case 'monthly-retrospective':
        return (
          <MonthlyRetrospectiveSection
            trainerId={user?.id}
          />
        );
      case 'playbooks':
        if (!overview) return null;
        return (
          <PlaybookLibrary 
            playbooks={overview.playbooks}
            onPlaybookCreated={(playbook) => {
              // Recargar datos cuando se crea un playbook
              getIntelligenceOverview().then((data) => {
                setOverview(data);
              });
            }}
          />
        );
      case 'playbook-learning':
        return (
          <PlaybookLearningInsights trainerId={user?.id} />
        );
      case 'initiative-impact':
        // Mantener compatibilidad con navegación directa al tab de evaluación de impacto
        return (
          <InitiativeImpactEvaluation trainerId={user?.id} />
        );
      case 'feedback':
        if (!overview) return null;
        return <FeedbackLoopSection feedbackLoops={overview.feedbackLoops} trainerId={user?.id} />;
      case 'personalization':
        return <PersonalizationEngineSection />;
      case 'personalization-impact':
        return (
          <PersonalizationImpactSection
            period={personalizationImpactPeriod}
            onPeriodChange={(period) => setPersonalizationImpactPeriod(period)}
            trainerId={user?.id}
          />
        );
      case 'integrated-ai-view':
        return (
          <IntegratedAIPatternsSection
            period={integratedAIViewPeriod}
            onPeriodChange={(period) => setIntegratedAIViewPeriod(period)}
            trainerId={user?.id}
          />
        );
      case 'experiments-impact':
        if (!overview) return null;
        return (
          <div className="space-y-8">
            {/* Parte superior: ExperimentationSection - Gestión de experimentos */}
            <ExperimentationSection 
              experiments={overview.experiments}
              trainerId={user?.id}
              onExperimentCreated={(experiment) => {
                // Recargar datos cuando se crea un experimento
                getIntelligenceOverview().then((data) => {
                  setOverview(data);
                });
              }}
            />

            {/* Parte inferior: InitiativeImpactEvaluation - Evaluación automática de impacto */}
            <InitiativeImpactEvaluation trainerId={user?.id} />
          </div>
        );
      case 'experimentation':
        // Mantener compatibilidad con navegación directa al tab de experimentación
        if (!overview) return null;
        return (
          <ExperimentationSection 
            experiments={overview.experiments}
            trainerId={user?.id}
            onExperimentCreated={(experiment) => {
              // Recargar datos cuando se crea un experimento
              getIntelligenceOverview().then((data) => {
                setOverview(data);
              });
            }}
          />
        );
      case 'insights':
        if (!overview) return null;
        return (
          <InsightsSection 
            insights={overview.insights}
            onPlaybookCreated={(playbookId) => {
              // Recargar datos cuando se crea un playbook desde un insight
              getIntelligenceOverview().then((data) => {
                setOverview(data);
                activateTab('playbooks');
              });
            }}
          />
        );
      case 'channel-insights':
        return (
          <ChannelInsightsSection
            period={channelInsightsPeriod}
            onPeriodChange={(period) => setChannelInsightsPeriod(period)}
            trainerId={user?.id}
          />
        );
      case 'market-trends':
        return (
          <MarketTrendsAlertsSection
            period={marketTrendsPeriod}
            onPeriodChange={(period) => setMarketTrendsPeriod(period)}
            trainerId={user?.id}
          />
        );
      case 'trend-analyzer':
        return (
          <div className="space-y-8">
            {/* Bloque 1: ChannelInsightsSection - Rendimiento e insights por canal */}
            <ChannelInsightsSection
              period={channelInsightsPeriod}
              onPeriodChange={(period) => setChannelInsightsPeriod(period)}
              trainerId={user?.id}
            />

            {/* Bloque 2: MarketTrendsAlertsSection - Tendencias y movimientos de mercado/competidores */}
            <MarketTrendsAlertsSection
              period={marketTrendsPeriod}
              onPeriodChange={(period) => setMarketTrendsPeriod(period)}
              trainerId={user?.id}
            />

            {/* Bloque 3: IntegratedAIPatternsSection - Patrones IA integrados para ver correlaciones globales */}
            <IntegratedAIPatternsSection
              period={integratedAIViewPeriod}
              onPeriodChange={(period) => setIntegratedAIViewPeriod(period)}
              trainerId={user?.id}
            />

            {/* Bloque auxiliar: SectorTrendsLink - Acceso a información más detallada del sector */}
            {overview?.sectorTrends && (
              <div className="flex justify-center">
                <SectorTrendsLink sectorTrends={overview.sectorTrends} />
              </div>
            )}
          </div>
        );
      case 'ownership':
        return (
          <OwnershipTrackingSection
            trainerId={user?.id}
          />
        );
      case 'mobile-approval':
        return (
          <MobileApprovalSection
            trainerId={user?.id}
            onApprovalChange={() => {
              // Recargar datos cuando se aprueba/rechaza un item
              getIntelligenceOverview().then((data) => {
                setOverview(data);
              });
            }}
          />
        );
      case 'playbook-sync':
        if (!overview) return null;
        return (
          <PlaybookSyncSection
            playbooks={overview.playbooks}
            trainerId={user?.id}
            onSyncComplete={() => {
              // Recargar datos cuando se sincroniza un playbook
              getIntelligenceOverview().then((data) => {
                setOverview(data);
              });
            }}
          />
        );
      case 'profile':
        return (
          <IntelligenceProfileSection
            onProfileUpdated={async () => {
              // Recargar el perfil para actualizar el estilo de decisión
              try {
                const profileData = await getIntelligenceProfile(user?.id);
                setDecisionStyle(profileData?.decisionStyle);
              } catch (error) {
                console.error('Error recargando perfil:', error);
              }
            }}
          />
        );
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
            overview={overview}
            decisionStyle={decisionStyle}
            onCreatePlaybook={handleCreatePlaybook}
            onLaunchExperiment={handleLaunchExperiment}
            onViewFeedback={handleViewFeedback}
            onViewCampaignDetails={handleViewCampaignDetails}
            onDuplicateCampaign={handleDuplicateCampaign}
            onViewExperimentResults={handleViewExperimentResults}
            onPauseSend={handlePauseSend}
            onEditSend={handleEditSend}
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

        <div className="space-y-8">
          <Tabs
            items={categoryTabItems}
            activeTab={activeCategory}
            onTabChange={(tabId) => handleCategoryChange(tabId as IntelligenceCategoryId)}
            variant="pills"
            fullWidth
          />

          {subTabItems.length > 0 && (
            <Tabs
              items={subTabItems}
              activeTab={activeTab}
              onTabChange={(tabId) => handleSubTabChange(tabId as IntelligenceTabId)}
              variant="underline"
            />
          )}

          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};

export default InteligenciaIaExperimentacionPage;

