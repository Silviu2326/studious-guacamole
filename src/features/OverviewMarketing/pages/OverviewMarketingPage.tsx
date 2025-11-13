import { useCallback, useEffect, useState, useMemo } from 'react';
import { BarChart3, Megaphone, RefreshCw, Sparkles, Settings } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { Badge, Button } from '../../../components/componentsreutilizables';
import {
  ActiveCampaigns,
  AISuggestions,
  KPICards,
  SocialGrowth,
  TopFunnels,
  UpcomingEvents,
  StrategicProfileSetup,
  QuarterlyObjectivesSelector,
  BuyerPersonaSelector,
  KPIAlerts,
  SalesAttributionComponent,
  WeeklyAIStrategyComponent,
  ContentRepowerSuggestions,
  HotLeads,
  ShareWeeklySummary,
  ForecastLeadsIngresos,
  AIRoadmapActivaciones,
  CalendarGapsAlerts,
  LearningInsightsComponent,
  ExperimentsTracker,
  MetricDropTips,
} from '../components';
import { MarketingOverviewService } from '../services/marketingOverviewService';
import {
  AISuggestion,
  CampaignPerformance,
  FunnelPerformance,
  MarketingKPI,
  MarketingOverviewPeriod,
  SocialGrowthMetric,
  UpcomingEvent,
  StrategicProfile,
  QuarterlyObjectives,
  DefaultBuyerPersonaType,
  KPIAlert,
  SalesAttributionSnapshot,
  WeeklyAIStrategy,
  ContentRepowerSnapshot,
  HotLeadsSnapshot,
  HotLead,
  TeamMember,
  ForecastSnapshot,
  AIRoadmapSnapshot,
  SuggestedActivation,
  MarketingCalendarGapsSnapshot,
  LearningProfile,
  LearningInsights,
  MarketingExperiment,
  ExperimentsSnapshot,
  MetricDropTipsSnapshot,
} from '../types';

export default function OverviewMarketingPage() {
  const { user } = useAuth();
  const period: MarketingOverviewPeriod = '30d';
  const [loadingSnapshot, setLoadingSnapshot] = useState(true);
  const [kpis, setKpis] = useState<MarketingKPI[]>([]);
  const [campaigns, setCampaigns] = useState<CampaignPerformance[]>([]);
  const [funnels, setFunnels] = useState<FunnelPerformance[]>([]);
  const [socialGrowth, setSocialGrowth] = useState<SocialGrowthMetric[]>([]);
  const [events, setEvents] = useState<UpcomingEvent[]>([]);
  const [suggestions, setSuggestions] = useState<AISuggestion[]>([]);
  const [strategicProfile, setStrategicProfile] = useState<StrategicProfile | null>(null);
  const [quarterlyObjectives, setQuarterlyObjectives] = useState<QuarterlyObjectives | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [showSetup, setShowSetup] = useState(false);
  const [selectedBuyerPersona, setSelectedBuyerPersona] = useState<DefaultBuyerPersonaType>('all');
  const [alerts, setAlerts] = useState<KPIAlert[]>([]);
  const [loadingAlerts, setLoadingAlerts] = useState(false);
  const [salesAttribution, setSalesAttribution] = useState<SalesAttributionSnapshot | null>(null);
  const [loadingAttribution, setLoadingAttribution] = useState(false);
  const [weeklyStrategy, setWeeklyStrategy] = useState<WeeklyAIStrategy | null>(null);
  const [loadingStrategy, setLoadingStrategy] = useState(false);
  const [contentRepower, setContentRepower] = useState<ContentRepowerSnapshot | null>(null);
  const [loadingContentRepower, setLoadingContentRepower] = useState(false);
  const [hotLeads, setHotLeads] = useState<HotLeadsSnapshot | null>(null);
  const [loadingHotLeads, setLoadingHotLeads] = useState(false);
  const [forecast, setForecast] = useState<ForecastSnapshot | null>(null);
  const [loadingForecast, setLoadingForecast] = useState(false);
  const [roadmap, setRoadmap] = useState<AIRoadmapSnapshot | null>(null);
  const [loadingRoadmap, setLoadingRoadmap] = useState(false);
  const [calendarGaps, setCalendarGaps] = useState<MarketingCalendarGapsSnapshot | null>(null);
  const [loadingCalendarGaps, setLoadingCalendarGaps] = useState(false);
  const [learningProfile, setLearningProfile] = useState<LearningProfile | null>(null);
  const [learningInsights, setLearningInsights] = useState<LearningInsights | null>(null);
  const [loadingLearning, setLoadingLearning] = useState(false);
  const [experiments, setExperiments] = useState<ExperimentsSnapshot | null>(null);
  const [loadingExperiments, setLoadingExperiments] = useState(false);
  const [metricDropTips, setMetricDropTips] = useState<MetricDropTipsSnapshot | null>(null);
  const [loadingMetricDropTips, setLoadingMetricDropTips] = useState(false);

  const loadSnapshot = useCallback(async () => {
    setLoadingSnapshot(true);
    try {
      const snapshot = await MarketingOverviewService.getSnapshot(
        period,
        selectedBuyerPersona,
        strategicProfile?.tone
      );
      setKpis(snapshot.kpis);
      setCampaigns(snapshot.campaigns);
      setFunnels(snapshot.funnels);
      setSocialGrowth(snapshot.socialGrowth);
      setEvents(snapshot.events);
      setSuggestions(snapshot.aiSuggestions);
      setSalesAttribution(snapshot.salesAttribution || null);

      // Cargar alertas
      setLoadingAlerts(true);
      try {
        const kpiAlerts = await MarketingOverviewService.getKPIAlerts(snapshot.kpis, selectedBuyerPersona);
        setAlerts(kpiAlerts);
      } catch (error) {
        console.error('[OverviewMarketingPage] Error cargando alertas:', error);
      } finally {
        setLoadingAlerts(false);
      }

      // Cargar contenido a repotenciar (User Story 1)
      setLoadingContentRepower(true);
      try {
        const repowerData = await MarketingOverviewService.getContentRepower(
          period,
          strategicProfile,
          snapshot.salesAttribution || null
        );
        setContentRepower(repowerData);
      } catch (error) {
        console.error('[OverviewMarketingPage] Error cargando contenido a repotenciar:', error);
      } finally {
        setLoadingContentRepower(false);
      }

      // Cargar leads calientes (User Story 1)
      setLoadingHotLeads(true);
      try {
        const hotLeadsData = await MarketingOverviewService.getHotLeads();
        setHotLeads(hotLeadsData);
      } catch (error) {
        console.error('[OverviewMarketingPage] Error cargando leads calientes:', error);
      } finally {
        setLoadingHotLeads(false);
      }

      // Cargar forecast de leads e ingresos (User Story 1)
      setLoadingForecast(true);
      try {
        const forecastData = await MarketingOverviewService.getForecast(period, '30d');
        setForecast(forecastData);
      } catch (error) {
        console.error('[OverviewMarketingPage] Error cargando forecast:', error);
      } finally {
        setLoadingForecast(false);
      }

      // Cargar huecos críticos en calendario (User Story 1)
      setLoadingCalendarGaps(true);
      try {
        const gapsData = await MarketingOverviewService.getMarketingCalendarGaps(period, strategicProfile);
        setCalendarGaps(gapsData);
      } catch (error) {
        console.error('[OverviewMarketingPage] Error cargando huecos de calendario:', error);
      } finally {
        setLoadingCalendarGaps(false);
      }

      // Cargar tips IA cuando métricas caen (User Story 2)
      setLoadingMetricDropTips(true);
      try {
        const tipsData = await MarketingOverviewService.getMetricDropTips(snapshot.kpis, strategicProfile);
        setMetricDropTips(tipsData);
      } catch (error) {
        console.error('[OverviewMarketingPage] Error cargando tips de métricas:', error);
      } finally {
        setLoadingMetricDropTips(false);
      }
    } catch (error) {
      console.error('[OverviewMarketingPage] Error cargando datos:', error);
    } finally {
      setLoadingSnapshot(false);
    }
  }, [selectedBuyerPersona, strategicProfile]);

  const loadProfileData = useCallback(async () => {
    setLoadingProfile(true);
    try {
      const [profile, objectives] = await Promise.all([
        MarketingOverviewService.getStrategicProfile(),
        MarketingOverviewService.getQuarterlyObjectives(),
      ]);
      setStrategicProfile(profile);
      setQuarterlyObjectives(objectives);
      // Show setup if profile or objectives are not completed
      if (!profile?.completed || !objectives?.completed) {
        setShowSetup(true);
      }
      
      // Load weekly AI strategy based on profile and objectives
      setLoadingStrategy(true);
      try {
        const strategy = await MarketingOverviewService.getWeeklyAIStrategy(profile, objectives);
        setWeeklyStrategy(strategy);
      } catch (error) {
        console.error('[OverviewMarketingPage] Error cargando estrategia semanal:', error);
      } finally {
        setLoadingStrategy(false);
      }

      // Cargar roadmap IA de activaciones (User Story 2)
      setLoadingRoadmap(true);
      try {
        const roadmapData = await MarketingOverviewService.getAIRoadmap(period, '30d', profile);
        setRoadmap(roadmapData);
      } catch (error) {
        console.error('[OverviewMarketingPage] Error cargando roadmap:', error);
      } finally {
        setLoadingRoadmap(false);
      }

      // Cargar datos de aprendizaje (User Story 2)
      setLoadingLearning(true);
      try {
        const [profileData, insightsData] = await Promise.all([
          MarketingOverviewService.getLearningProfile(),
          MarketingOverviewService.getLearningInsights(),
        ]);
        setLearningProfile(profileData);
        setLearningInsights(insightsData);
      } catch (error) {
        console.error('[OverviewMarketingPage] Error cargando datos de aprendizaje:', error);
      } finally {
        setLoadingLearning(false);
      }

      // Cargar experimentos (User Story 1)
      setLoadingExperiments(true);
      try {
        const experimentsData = await MarketingOverviewService.getExperiments();
        setExperiments(experimentsData);
      } catch (error) {
        console.error('[OverviewMarketingPage] Error cargando experimentos:', error);
      } finally {
        setLoadingExperiments(false);
      }
    } catch (error) {
      console.error('[OverviewMarketingPage] Error cargando perfil:', error);
    } finally {
      setLoadingProfile(false);
    }
  }, []);

  useEffect(() => {
    loadProfileData();
  }, [loadProfileData]);

  useEffect(() => {
    loadSnapshot();
  }, [loadSnapshot]);

  const handleSaveProfile = async (profile: StrategicProfile) => {
    await MarketingOverviewService.saveProfile(profile);
    setStrategicProfile(profile);
    if (quarterlyObjectives?.completed) {
      setShowSetup(false);
    }
  };

  const handleSaveObjectives = async (objectives: QuarterlyObjectives) => {
    await MarketingOverviewService.saveObjectives(objectives);
    setQuarterlyObjectives(objectives);
    if (strategicProfile?.completed) {
      setShowSetup(false);
    }
  };

  // Filter and enhance KPIs with contextual narratives based on quarterly objectives
  const filteredKpis = useMemo(() => {
    let enhancedKpis = [...kpis];

    // Add contextual narratives to KPIs
    enhancedKpis = enhancedKpis.map((kpi) => {
      const narrative = MarketingOverviewService.generateContextualNarrative(
        kpi,
        strategicProfile,
        quarterlyObjectives
      );
      return {
        ...kpi,
        contextualNarrative: narrative,
      };
    });

    // Prioritize KPIs based on quarterly objectives
    if (!quarterlyObjectives?.objectives || quarterlyObjectives.objectives.length === 0) {
      // Still add narratives even without objectives
      return enhancedKpis;
    }

    const priorityKpiIds: string[] = [];
    if (quarterlyObjectives.objectives.includes('captar_leads')) {
      priorityKpiIds.push('leads', 'email-ctr', 'social-growth');
    }
    if (quarterlyObjectives.objectives.includes('vender_packs')) {
      priorityKpiIds.push('funnel-revenue', 'roas');
    }
    if (quarterlyObjectives.objectives.includes('fidelizar')) {
      priorityKpiIds.push('social-growth', 'email-ctr');
    }

    // Assign priority numbers (lower = higher priority)
    enhancedKpis = enhancedKpis.map((kpi) => {
      const priorityIndex = priorityKpiIds.indexOf(kpi.id);
      return {
        ...kpi,
        priority: priorityIndex >= 0 ? priorityIndex + 1 : 999,
      };
    });

    // Sort by priority
    enhancedKpis.sort((a, b) => (a.priority || 999) - (b.priority || 999));

    return enhancedKpis;
  }, [kpis, quarterlyObjectives, strategicProfile]);

  // Adapt suggestions based on profile, strengths, objectives, and learning
  const adaptedSuggestions = useMemo(() => {
    let adapted = [...suggestions];
    
    // Aplicar aprendizaje de feedback
    if (learningProfile) {
      adapted = MarketingOverviewService.applyLearning(adapted, learningProfile);
    }

    // Note: Tone adaptation is now handled in the API layer, so suggestions are already adapted

    // Adapt based on strengths - filter and prioritize suggestions that match trainer's strengths
    if (strategicProfile?.strengths && strategicProfile.strengths.length > 0) {
      const strengthKeywords: Record<string, string[]> = {
        HIIT: ['HIIT', 'alta intensidad', 'intervalos', 'cardio intenso', 'entrenamiento explosivo'],
        fuerza_funcional: ['fuerza', 'funcional', 'movimientos', 'patrones', 'resistencia'],
        nutrición_holística: ['nutrición', 'alimentación', 'dieta', 'hábitos', 'bienestar'],
        yoga: ['yoga', 'mindfulness', 'flexibilidad', 'relajación', 'meditación'],
        pilates: ['pilates', 'core', 'estabilidad', 'postura', 'control'],
        crossfit: ['crossfit', 'WOD', 'box', 'comunidad', 'competencia'],
        running: ['running', 'carrera', 'maratón', 'resistencia', 'cardio'],
        ciclismo: ['ciclismo', 'bicicleta', 'endurance', 'pedaleo'],
        natación: ['natación', 'acuático', 'piscina', 'técnica'],
        rehabilitación: ['rehabilitación', 'lesiones', 'recuperación', 'prevención', 'fisioterapia'],
        nutrición_deportiva: ['nutrición deportiva', 'rendimiento', 'suplementación', 'hidratación'],
        coaching_mindset: ['mindset', 'mentalidad', 'motivación', 'psicología', 'coaching'],
        entrenamiento_personalizado: ['personalizado', 'individual', 'adaptado', 'programa específico'],
      };

      const strengthLabels: Record<string, string> = {
        HIIT: 'HIIT',
        fuerza_funcional: 'Fuerza Funcional',
        nutrición_holística: 'Nutrición Holística',
        yoga: 'Yoga',
        pilates: 'Pilates',
        crossfit: 'CrossFit',
        running: 'Running',
        ciclismo: 'Ciclismo',
        natación: 'Natación',
        rehabilitación: 'Rehabilitación',
        nutrición_deportiva: 'Nutrición Deportiva',
        coaching_mindset: 'Coaching Mindset',
        entrenamiento_personalizado: 'Entrenamiento Personalizado',
      };

      adapted = adapted.map((suggestion) => {
        let strengthMatchCount = 0;
        let matchedStrengths: string[] = [];

        strategicProfile.strengths?.forEach((strength) => {
          const keywords = strengthKeywords[strength] || [];
          const suggestionText = `${suggestion.title} ${suggestion.description}`.toLowerCase();
          const matches = keywords.filter((kw) => suggestionText.includes(kw.toLowerCase())).length;
          if (matches > 0) {
            strengthMatchCount += matches;
            matchedStrengths.push(strengthLabels[strength] || strength);
          }
        });

        return {
          ...suggestion,
          description:
            matchedStrengths.length > 0
              ? `${suggestion.description} [Recomendado para tus fortalezas: ${matchedStrengths.join(', ')}]`
              : suggestion.description,
          // Add a hidden score for sorting
          _strengthScore: strengthMatchCount,
        };
      });

      // Sort by strength match score (higher first)
      adapted = adapted.sort((a, b) => {
        const aScore = (a as any)._strengthScore || 0;
        const bScore = (b as any)._strengthScore || 0;
        return bScore - aScore;
      });

      // Remove the temporary score property
      adapted = adapted.map(({ _strengthScore, ...rest }) => rest as AISuggestion);
    }

    // Prioritize suggestions based on objectives
    if (quarterlyObjectives?.objectives) {
      const objectiveKeywords: Record<string, string[]> = {
        captar_leads: ['leads', 'retargeting', 'conversión', 'funnel'],
        vender_packs: ['ventas', 'revenue', 'cierre', 'packs'],
        fidelizar: ['email', 'retención', 'engagement', 'fidelización'],
      };

      adapted = adapted.sort((a, b) => {
        const aScore = quarterlyObjectives.objectives.reduce((score, obj) => {
          const keywords = objectiveKeywords[obj] || [];
          const matches = keywords.filter((kw) =>
            `${a.title} ${a.description}`.toLowerCase().includes(kw.toLowerCase())
          ).length;
          return score + matches;
        }, 0);

        const bScore = quarterlyObjectives.objectives.reduce((score, obj) => {
          const keywords = objectiveKeywords[obj] || [];
          const matches = keywords.filter((kw) =>
            `${b.title} ${b.description}`.toLowerCase().includes(kw.toLowerCase())
          ).length;
          return score + matches;
        }, 0);

        return bScore - aScore;
      });
    }

    return adapted;
  }, [suggestions, strategicProfile, quarterlyObjectives, learningProfile]);

  const handleRefresh = () => {
    loadSnapshot();
    loadProfileData();
  };

  const handleApproveStrategy = async (strategy: WeeklyAIStrategy) => {
    try {
      const approved = await MarketingOverviewService.approveWeeklyStrategy(strategy.id);
      setWeeklyStrategy(approved);
    } catch (error) {
      console.error('[OverviewMarketingPage] Error aprobando estrategia:', error);
    }
  };

  const handleExecuteStrategy = async (strategy: WeeklyAIStrategy) => {
    try {
      const executed = await MarketingOverviewService.executeWeeklyStrategy(strategy.id);
      setWeeklyStrategy(executed);
    } catch (error) {
      console.error('[OverviewMarketingPage] Error ejecutando estrategia:', error);
    }
  };

  const handleStartConversation = (lead: HotLead) => {
    const channel = lead.preferredChannel || 'whatsapp';
    window.location.href = `/leads?leadId=${lead.id}&channel=${channel}`;
  };

  const handleShareWeeklySummary = async (recipients: TeamMember[], message?: string) => {
    if (!weeklyStrategy) return;
    
    try {
      const recipientIds = recipients.map((r) => r.id);
      await MarketingOverviewService.shareWeeklySummaryWithTeam(
        weeklyStrategy.id,
        recipientIds,
        message
      );
    } catch (error) {
      console.error('[OverviewMarketingPage] Error compartiendo resumen:', error);
      throw error;
    }
  };

  const handleLoadTeamMembers = async (): Promise<TeamMember[]> => {
    try {
      return await MarketingOverviewService.getTeamMembers();
    } catch (error) {
      console.error('[OverviewMarketingPage] Error cargando miembros del equipo:', error);
      return [];
    }
  };

  const handleScheduleActivation = async (activation: SuggestedActivation) => {
    // En producción, esto actualizaría el estado de la activación
    console.log('Programando activación:', activation);
    if (roadmap) {
      const updatedActivations = roadmap.activations.map(a =>
        a.id === activation.id ? { ...a, status: 'scheduled' as const } : a
      );
      setRoadmap({ ...roadmap, activations: updatedActivations });
    }
  };

  const handleDismissActivation = async (activationId: string) => {
    // En producción, esto actualizaría el estado de la activación
    console.log('Descartando activación:', activationId);
    if (roadmap) {
      const updatedActivations = roadmap.activations.map(a =>
        a.id === activationId ? { ...a, status: 'dismissed' as const } : a
      );
      setRoadmap({ ...roadmap, activations: updatedActivations });
    }
  };

  const handleSuggestionAction = async (suggestionId: string, action: 'accept' | 'reject') => {
    // Recargar datos de aprendizaje después de una acción
    try {
      const [profileData, insightsData] = await Promise.all([
        MarketingOverviewService.getLearningProfile(),
        MarketingOverviewService.getLearningInsights(),
      ]);
      setLearningProfile(profileData);
      setLearningInsights(insightsData);
      
      // Recargar sugerencias con aprendizaje aplicado
      const updatedSuggestions = await MarketingOverviewService.getSuggestions(strategicProfile?.tone);
      const adapted = MarketingOverviewService.applyLearning(updatedSuggestions, profileData);
      setSuggestions(adapted);
    } catch (error) {
      console.error('[OverviewMarketingPage] Error actualizando después de acción:', error);
    }
  };

  const handleSaveExperiment = async (experiment: MarketingExperiment) => {
    try {
      await MarketingOverviewService.saveExperiment(experiment);
      const updatedExperiments = await MarketingOverviewService.getExperiments();
      setExperiments(updatedExperiments);
    } catch (error) {
      console.error('[OverviewMarketingPage] Error guardando experimento:', error);
      throw error;
    }
  };

  const handleUpdateExperiment = async (experimentId: string, updates: Partial<MarketingExperiment>) => {
    try {
      await MarketingOverviewService.updateExperiment(experimentId, updates);
      const updatedExperiments = await MarketingOverviewService.getExperiments();
      setExperiments(updatedExperiments);
    } catch (error) {
      console.error('[OverviewMarketingPage] Error actualizando experimento:', error);
      throw error;
    }
  };

  const handleApplyTip = async (tipId: string) => {
    // En producción, esto podría marcar el tip como aplicado o crear una acción
    console.log('Aplicando tip:', tipId);
    // Recargar tips después de aplicar
    try {
      const updatedTips = await MarketingOverviewService.getMetricDropTips(filteredKpis, strategicProfile);
      setMetricDropTips(updatedTips);
    } catch (error) {
      console.error('[OverviewMarketingPage] Error recargando tips:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-[#0b1120] dark:via-[#0f172a] dark:to-[#020617]">
      <div className="border-b border-gray-200/60 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:border-gray-800/60 dark:bg-[#0b1120]/80">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <div className="flex flex-wrap items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="p-2.5 bg-gradient-to-br from-indigo-100 to-purple-200 dark:from-indigo-900/40 dark:to-purple-900/30 rounded-2xl shadow-inner">
                  <BarChart3 className="w-6 h-6 text-indigo-600 dark:text-indigo-300" />
                </div>
                <div>
                  <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900 dark:text-slate-100">
                    Overview marketing
                  </h1>
                  <p className="text-gray-600 dark:text-slate-400 max-w-2xl">
                    Controla tus KPIs clave, funnels y activaciones de marketing en un solo dashboard y ejecuta la
                    siguiente mejor acción recomendada por IA.
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <Badge variant="blue" size="md" className="shadow">
                  {user?.name ? `Hola, ${user.name.split(' ')[0]}` : 'Modo estratégico'}
                </Badge>
                <Button variant="secondary" onClick={handleRefresh} className="inline-flex items-center gap-2">
                  <RefreshCw className={`w-4 h-4 ${loadingSnapshot ? 'animate-spin' : ''}`} />
                  Actualizar datos
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2 text-sm text-indigo-600 dark:text-indigo-300">
            <Sparkles className="w-4 h-4" />
            <span>Datos simulados a partir de campañas y funnels activos.</span>
          </div>
          <Button
            variant="secondary"
            onClick={() => setShowSetup(!showSetup)}
            className="inline-flex items-center gap-2"
          >
            <Settings className="w-4 h-4" />
            {showSetup ? 'Ocultar configuración' : 'Configurar perfil'}
          </Button>
        </div>

        {/* Setup Section */}
        {showSetup && (
          <div className="mb-8 space-y-6">
            <StrategicProfileSetup
              profile={strategicProfile || undefined}
              onSave={handleSaveProfile}
            />
            <QuarterlyObjectivesSelector
              objectives={quarterlyObjectives || undefined}
              onSave={handleSaveObjectives}
            />
          </div>
        )}

        {/* Profile Status Badge */}
        {!showSetup && (strategicProfile?.completed || quarterlyObjectives?.completed) && (
          <div className="mb-6 flex items-center gap-3 p-4 rounded-lg bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800">
            {strategicProfile?.completed && (
              <Badge variant="success" className="flex items-center gap-1">
                Perfil estratégico configurado
              </Badge>
            )}
            {quarterlyObjectives?.completed && (
              <Badge variant="success" className="flex items-center gap-1">
                Objetivos: {quarterlyObjectives.objectives.map(obj => {
                  const labels: Record<string, string> = {
                    captar_leads: 'Captar Leads',
                    vender_packs: 'Vender Packs',
                    fidelizar: 'Fidelizar',
                  };
                  return labels[obj] || obj;
                }).join(', ')}
              </Badge>
            )}
            <span className="text-sm text-indigo-700 dark:text-indigo-300 ml-auto">
              El dashboard está adaptado a tus preferencias
            </span>
          </div>
        )}

        {/* Buyer Persona Selector */}
        <div className="mb-6">
          <BuyerPersonaSelector
            selectedPersona={selectedBuyerPersona}
            onPersonaChange={setSelectedBuyerPersona}
          />
        </div>

        {/* KPI Alerts */}
        {alerts.length > 0 && (
          <div className="mb-8">
            <KPIAlerts alerts={alerts} />
          </div>
        )}

        {/* User Story 1: Alertas de Huecos Críticos en Calendario */}
        <div className="mb-8">
          <CalendarGapsAlerts
            snapshot={calendarGaps}
            loading={loadingCalendarGaps}
            onApplySuggestion={(suggestionId) => {
              console.log('Aplicar sugerencia:', suggestionId);
            }}
          />
        </div>

        {/* User Story 1: Hot Leads */}
        <div className="mb-8">
          <HotLeads
            snapshot={hotLeads}
            loading={loadingHotLeads}
            onStartConversation={handleStartConversation}
          />
        </div>

        {/* User Story 1: Forecast de Leads e Ingresos */}
        <div className="mb-8">
          <ForecastLeadsIngresos
            forecast={forecast}
            loading={loadingForecast}
          />
        </div>

        <div className="mb-8">
          <KPICards kpis={filteredKpis} loading={loadingSnapshot} />
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          <ActiveCampaigns campaigns={campaigns} loading={loadingSnapshot} className="xl:col-span-2" />
          <TopFunnels funnels={funnels} loading={loadingSnapshot} className="xl:col-span-2" />
        </div>

        {/* User Story 1: Sales Attribution */}
        <div className="mt-6">
          <SalesAttributionComponent attribution={salesAttribution} loading={loadingSnapshot} className="xl:col-span-4" />
        </div>

        {/* User Story 1: Content Repower Suggestions */}
        <div className="mt-6">
          <ContentRepowerSuggestions
            snapshot={contentRepower}
            loading={loadingContentRepower}
            className="xl:col-span-4"
          />
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 mt-6">
          <SocialGrowth networks={socialGrowth} loading={loadingSnapshot} className="xl:col-span-2" />
          <UpcomingEvents events={events} loading={loadingSnapshot} className="xl:col-span-2" />
        </div>

        {/* User Story 2: Weekly AI Strategy */}
        <div className="mt-6">
          <WeeklyAIStrategyComponent
            strategy={weeklyStrategy}
            loading={loadingStrategy}
            className="xl:col-span-4"
            onApprove={handleApproveStrategy}
            onExecute={handleExecuteStrategy}
          />
        </div>

        {/* User Story 2: Share Weekly Summary */}
        {weeklyStrategy && (
          <div className="mt-6">
            <ShareWeeklySummary
              strategy={weeklyStrategy}
              onShare={handleShareWeeklySummary}
              onLoadTeamMembers={handleLoadTeamMembers}
            />
          </div>
        )}

        {/* User Story 2: Roadmap IA de Activaciones */}
        <div className="mt-6">
          <AIRoadmapActivaciones
            roadmap={roadmap}
            loading={loadingRoadmap}
            onScheduleActivation={handleScheduleActivation}
            onDismissActivation={handleDismissActivation}
          />
        </div>

        <div className="mt-6">
          <AISuggestions
            suggestions={adaptedSuggestions}
            loading={loadingSnapshot}
            className="xl:col-span-4"
            period={period}
            onSuggestionAction={handleSuggestionAction}
          />
        </div>

        {/* User Story 2: Insights de Aprendizaje */}
        <div className="mt-6">
          <LearningInsightsComponent
            insights={learningInsights}
            profile={learningProfile}
            loading={loadingLearning}
            className="xl:col-span-4"
          />
        </div>

        {/* User Story 1: Experimentos Realizados */}
        <div className="mt-6">
          <ExperimentsTracker
            snapshot={experiments}
            loading={loadingExperiments}
            onSaveExperiment={handleSaveExperiment}
            onUpdateExperiment={handleUpdateExperiment}
            className="xl:col-span-4"
          />
        </div>

        {/* User Story 2: Tips IA cuando Métricas Caen */}
        <div className="mt-6">
          <MetricDropTips
            snapshot={metricDropTips}
            loading={loadingMetricDropTips}
            onApplyTip={handleApplyTip}
            className="xl:col-span-4"
          />
        </div>

        <div className="mt-10 rounded-2xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white p-6 shadow-lg flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Megaphone className="w-6 h-6" />
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.2em] opacity-80">Tip del día</p>
              <h3 className="text-lg font-semibold">
                Lanza hoy mismo una secuencia para leads que visitaron pricing en los últimos 3 días.
              </h3>
            </div>
          </div>
          <Button variant="ghost" className="bg-white/10 hover:bg-white/20 text-white">
            Ver flujo recomendado
          </Button>
        </div>
      </div>
    </div>
  );
}










