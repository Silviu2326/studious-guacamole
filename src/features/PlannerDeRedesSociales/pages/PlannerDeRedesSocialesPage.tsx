import { useState, useEffect } from 'react';
import { SocialPlannerCalendar } from '../components/SocialPlannerCalendar';
import { PostCreatorModal } from '../components/PostCreatorModal';
import {
  CampaignsManager,
  ContentLibrary,
  AudienceInsights,
  ContentSuggestions,
  HashtagAnalyzer,
  BestTimesToPost,
  ClientTransformations,
  AutoPublishManager,
  RecurringPostsManager,
  AutoReplyManager,
  AdvancedAnalytics,
  AgendaIntegration,
  ReportExporter,
  SmartDashboard,
  ABTestingManager,
  AIContentGenerator,
  NotificationCenter,
  CollaboratorManager
} from '../components';
import {
  getSocialPosts,
  createSocialPost,
  updateSocialPost,
  getSocialProfiles,
  getSocialAnalytics,
  getPostTemplates,
  getCampaigns,
  getContentLibrary,
  getAudienceInsights,
  getContentSuggestions,
  getHashtagAnalysis,
  getBestTimesToPost,
  getClientTransformations,
  SocialPost,
  SocialProfile,
  SocialAnalytics,
  PostTemplate,
  Campaign,
  ContentLibraryItem,
  AudienceInsight,
  ContentSuggestion,
  HashtagAnalysis,
  BestTimeToPost,
  ClientTransformation,
  SocialPlatform,
  getPlatformIcon
} from '../api/social';
import { Plus, Calendar, BarChart3, AlertCircle, TrendingUp, Eye, MousePointerClick, Share2, Loader2, Target, BookOpen, Users, Lightbulb, Hash, Clock, Award, Zap, Repeat, MessageSquare, Sparkles, LayoutDashboard, FlaskConical, Bell, UserCheck, Download } from 'lucide-react';
import { Card, Button, MetricCards } from '../../../components/componentsreutilizables';

export default function PlannerDeRedesSocialesPage() {
  const [currentDate] = useState(new Date());
  const [profiles, setProfiles] = useState<SocialProfile[]>([]);
  const [analytics, setAnalytics] = useState<SocialAnalytics | null>(null);
  const [templates, setTemplates] = useState<PostTemplate[]>([]);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [contentLibrary, setContentLibrary] = useState<ContentLibraryItem[]>([]);
  const [audienceInsights, setAudienceInsights] = useState<AudienceInsight | null>(null);
  const [contentSuggestions, setContentSuggestions] = useState<ContentSuggestion[]>([]);
  const [hashtagAnalysis, setHashtagAnalysis] = useState<HashtagAnalysis[]>([]);
  const [bestTimes, setBestTimes] = useState<BestTimeToPost[]>([]);
  const [clientTransformations, setClientTransformations] = useState<ClientTransformation[]>([]);
  const [posts, setPosts] = useState<SocialPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'calendar' | 'analytics' | 'campaigns' | 'library' | 'insights' | 'suggestions' | 'transformations' | 'automation' | 'recurring' | 'auto-reply' | 'agenda' | 'reports' | 'ab-testing' | 'ai-content' | 'notifications' | 'collaborators'>('dashboard');
  const [selectedPlatform] = useState<SocialPlatform | undefined>(undefined);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const [
        profilesData,
        postsData,
        analyticsData,
        templatesData,
        campaignsData,
        contentLibraryData,
        audienceInsightsData,
        contentSuggestionsData,
        hashtagAnalysisData,
        bestTimesData,
        clientTransformationsData
      ] = await Promise.all([
        getSocialProfiles(),
        getSocialPosts('2024-01-01', '2024-12-31'),
        getSocialAnalytics('2024-01-01', '2024-01-31'),
        getPostTemplates(),
        getCampaigns(),
        getContentLibrary(),
        getAudienceInsights(),
        getContentSuggestions(),
        getHashtagAnalysis(),
        getBestTimesToPost('instagram'),
        getClientTransformations()
      ]);

      setProfiles(profilesData);
      setPosts(postsData);
      setAnalytics(analyticsData);
      setTemplates(templatesData);
      setCampaigns(campaignsData);
      setContentLibrary(contentLibraryData);
      setAudienceInsights(audienceInsightsData);
      setContentSuggestions(contentSuggestionsData);
      setHashtagAnalysis(hashtagAnalysisData);
      setBestTimes(bestTimesData);
      setClientTransformations(clientTransformationsData);
    } catch (err: any) {
      setError(err.message || 'Error al cargar los datos');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePostSelect = (postId: string | null) => {
    setSelectedPostId(postId);
    setIsModalOpen(true);
  };

  const handleSavePost = async (postData: Partial<SocialPost>) => {
    try {
      if (selectedPostId) {
        await updateSocialPost(selectedPostId, postData);
      } else {
        await createSocialPost(postData as SocialPost);
      }
      await loadData();
      setIsModalOpen(false);
      setSelectedPostId(null);
    } catch (err: any) {
      alert('Error al guardar: ' + err.message);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedPostId(null);
  };

  if (error && profiles.length === 0) {
    return (
      <Card className="p-8 text-center bg-white shadow-sm">
        <AlertCircle size={48} className="mx-auto text-red-500 mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Error al cargar</h3>
        <p className="text-gray-600 mb-4">{error}</p>
        <Button onClick={loadData}>Reintentar</Button>
      </Card>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
        {/* Header */}
        <div className="border-b border-gray-200/60 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
          <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6">
            <div className="py-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-100 rounded-xl mr-4 ring-1 ring-blue-200/70">
                    <Share2 size={24} className="text-blue-600" />
                  </div>
                  <div>
                    <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900">
                      Planner de Redes Sociales
                    </h1>
                    <p className="text-gray-600">
                      Planifica, programa y analiza tu contenido social
                    </p>
                  </div>
                </div>
                <Button onClick={() => setIsModalOpen(true)} leftIcon={<Plus size={20} />}>
                  Nueva Publicación
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Contenido Principal */}
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6 py-8">
          <div className="space-y-6">

            {/* Connected Profiles */}
            <Card className="bg-white shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Cuentas Conectadas</h2>
              <div className="flex flex-wrap items-center gap-4">
                {profiles.map((profile) => (
                  <Card
                    key={profile.id}
                    variant="hover"
                    padding="sm"
                    className="flex items-center gap-3 ring-1 ring-gray-200 hover:ring-blue-400 transition-all"
                  >
                    <span className="text-3xl">{getPlatformIcon(profile.platform)}</span>
                    <div>
                      <p className="font-semibold text-gray-900">{profile.displayName}</p>
                      <p className="text-sm text-gray-600">{profile.username}</p>
                      {profile.followerCount && (
                        <p className="text-xs text-gray-500">
                          {profile.followerCount.toLocaleString()} seguidores
                        </p>
                      )}
                    </div>
                    <div className="ml-4">
                      {profile.isConnected ? (
                        <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                          Conectada
                        </span>
                      ) : (
                        <Button variant="ghost" size="sm">
                          Conectar
                        </Button>
                      )}
                    </div>
                  </Card>
                ))}
              </div>
            </Card>

            {/* Tabs */}
            <Card className="p-0 bg-white shadow-sm">
              <div className="px-4 py-3">
                <div
                  role="tablist"
                  aria-label="Secciones"
                  className="flex items-center gap-2 rounded-2xl bg-slate-100 p-1 overflow-x-auto"
                >
                  <button
                    role="tab"
                    aria-selected={activeTab === 'dashboard'}
                    onClick={() => setActiveTab('dashboard')}
                    className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all whitespace-nowrap ${
                      activeTab === 'dashboard'
                        ? 'bg-white text-slate-900 shadow-sm ring-1 ring-slate-200'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-white/70'
                    }`}
                  >
                    <LayoutDashboard size={18} className={activeTab === 'dashboard' ? 'opacity-100' : 'opacity-70'} />
                    <span>Dashboard</span>
                  </button>
                  <button
                    role="tab"
                    aria-selected={activeTab === 'calendar'}
                    onClick={() => setActiveTab('calendar')}
                    className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all whitespace-nowrap ${
                      activeTab === 'calendar'
                        ? 'bg-white text-slate-900 shadow-sm ring-1 ring-slate-200'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-white/70'
                    }`}
                  >
                    <Calendar size={18} className={activeTab === 'calendar' ? 'opacity-100' : 'opacity-70'} />
                    <span>Calendario</span>
                  </button>
                  <button
                    role="tab"
                    aria-selected={activeTab === 'analytics'}
                    onClick={() => setActiveTab('analytics')}
                    className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all whitespace-nowrap ${
                      activeTab === 'analytics'
                        ? 'bg-white text-slate-900 shadow-sm ring-1 ring-slate-200'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-white/70'
                    }`}
                  >
                    <BarChart3 size={18} className={activeTab === 'analytics' ? 'opacity-100' : 'opacity-70'} />
                    <span>Analíticas</span>
                  </button>
                  <button
                    role="tab"
                    aria-selected={activeTab === 'campaigns'}
                    onClick={() => setActiveTab('campaigns')}
                    className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all whitespace-nowrap ${
                      activeTab === 'campaigns'
                        ? 'bg-white text-slate-900 shadow-sm ring-1 ring-slate-200'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-white/70'
                    }`}
                  >
                    <Target size={18} className={activeTab === 'campaigns' ? 'opacity-100' : 'opacity-70'} />
                    <span>Campañas</span>
                  </button>
                  <button
                    role="tab"
                    aria-selected={activeTab === 'library'}
                    onClick={() => setActiveTab('library')}
                    className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all whitespace-nowrap ${
                      activeTab === 'library'
                        ? 'bg-white text-slate-900 shadow-sm ring-1 ring-slate-200'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-white/70'
                    }`}
                  >
                    <BookOpen size={18} className={activeTab === 'library' ? 'opacity-100' : 'opacity-70'} />
                    <span>Biblioteca</span>
                  </button>
                  <button
                    role="tab"
                    aria-selected={activeTab === 'insights'}
                    onClick={() => setActiveTab('insights')}
                    className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all whitespace-nowrap ${
                      activeTab === 'insights'
                        ? 'bg-white text-slate-900 shadow-sm ring-1 ring-slate-200'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-white/70'
                    }`}
                  >
                    <Users size={18} className={activeTab === 'insights' ? 'opacity-100' : 'opacity-70'} />
                    <span>Audiencia</span>
                  </button>
                  <button
                    role="tab"
                    aria-selected={activeTab === 'suggestions'}
                    onClick={() => setActiveTab('suggestions')}
                    className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all whitespace-nowrap ${
                      activeTab === 'suggestions'
                        ? 'bg-white text-slate-900 shadow-sm ring-1 ring-slate-200'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-white/70'
                    }`}
                  >
                    <Lightbulb size={18} className={activeTab === 'suggestions' ? 'opacity-100' : 'opacity-70'} />
                    <span>Sugerencias</span>
                  </button>
                  <button
                    role="tab"
                    aria-selected={activeTab === 'transformations'}
                    onClick={() => setActiveTab('transformations')}
                    className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all whitespace-nowrap ${
                      activeTab === 'transformations'
                        ? 'bg-white text-slate-900 shadow-sm ring-1 ring-slate-200'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-white/70'
                    }`}
                  >
                    <Award size={18} className={activeTab === 'transformations' ? 'opacity-100' : 'opacity-70'} />
                    <span>Transformaciones</span>
                  </button>
                  <button
                    role="tab"
                    aria-selected={activeTab === 'automation'}
                    onClick={() => setActiveTab('automation')}
                    className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all whitespace-nowrap ${
                      activeTab === 'automation'
                        ? 'bg-white text-slate-900 shadow-sm ring-1 ring-slate-200'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-white/70'
                    }`}
                  >
                    <Zap size={18} className={activeTab === 'automation' ? 'opacity-100' : 'opacity-70'} />
                    <span>Automatización</span>
                  </button>
                  <button
                    role="tab"
                    aria-selected={activeTab === 'recurring'}
                    onClick={() => setActiveTab('recurring')}
                    className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all whitespace-nowrap ${
                      activeTab === 'recurring'
                        ? 'bg-white text-slate-900 shadow-sm ring-1 ring-slate-200'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-white/70'
                    }`}
                  >
                    <Repeat size={18} className={activeTab === 'recurring' ? 'opacity-100' : 'opacity-70'} />
                    <span>Recurrentes</span>
                  </button>
                  <button
                    role="tab"
                    aria-selected={activeTab === 'auto-reply'}
                    onClick={() => setActiveTab('auto-reply')}
                    className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all whitespace-nowrap ${
                      activeTab === 'auto-reply'
                        ? 'bg-white text-slate-900 shadow-sm ring-1 ring-slate-200'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-white/70'
                    }`}
                  >
                    <MessageSquare size={18} className={activeTab === 'auto-reply' ? 'opacity-100' : 'opacity-70'} />
                    <span>Auto-Respuestas</span>
                  </button>
                  <button
                    role="tab"
                    aria-selected={activeTab === 'agenda'}
                    onClick={() => setActiveTab('agenda')}
                    className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all whitespace-nowrap ${
                      activeTab === 'agenda'
                        ? 'bg-white text-slate-900 shadow-sm ring-1 ring-slate-200'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-white/70'
                    }`}
                  >
                    <Calendar size={18} className={activeTab === 'agenda' ? 'opacity-100' : 'opacity-70'} />
                    <span>Agenda</span>
                  </button>
                  <button
                    role="tab"
                    aria-selected={activeTab === 'reports'}
                    onClick={() => setActiveTab('reports')}
                    className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all whitespace-nowrap ${
                      activeTab === 'reports'
                        ? 'bg-white text-slate-900 shadow-sm ring-1 ring-slate-200'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-white/70'
                    }`}
                  >
                    <Download size={18} className={activeTab === 'reports' ? 'opacity-100' : 'opacity-70'} />
                    <span>Reportes</span>
                  </button>
                  <button
                    role="tab"
                    aria-selected={activeTab === 'ab-testing'}
                    onClick={() => setActiveTab('ab-testing')}
                    className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all whitespace-nowrap ${
                      activeTab === 'ab-testing'
                        ? 'bg-white text-slate-900 shadow-sm ring-1 ring-slate-200'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-white/70'
                    }`}
                  >
                    <FlaskConical size={18} className={activeTab === 'ab-testing' ? 'opacity-100' : 'opacity-70'} />
                    <span>A/B Testing</span>
                  </button>
                  <button
                    role="tab"
                    aria-selected={activeTab === 'ai-content'}
                    onClick={() => setActiveTab('ai-content')}
                    className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all whitespace-nowrap ${
                      activeTab === 'ai-content'
                        ? 'bg-white text-slate-900 shadow-sm ring-1 ring-slate-200'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-white/70'
                    }`}
                  >
                    <Sparkles size={18} className={activeTab === 'ai-content' ? 'opacity-100' : 'opacity-70'} />
                    <span>IA</span>
                  </button>
                  <button
                    role="tab"
                    aria-selected={activeTab === 'notifications'}
                    onClick={() => setActiveTab('notifications')}
                    className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all whitespace-nowrap ${
                      activeTab === 'notifications'
                        ? 'bg-white text-slate-900 shadow-sm ring-1 ring-slate-200'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-white/70'
                    }`}
                  >
                    <Bell size={18} className={activeTab === 'notifications' ? 'opacity-100' : 'opacity-70'} />
                    <span>Notificaciones</span>
                  </button>
                  <button
                    role="tab"
                    aria-selected={activeTab === 'collaborators'}
                    onClick={() => setActiveTab('collaborators')}
                    className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all whitespace-nowrap ${
                      activeTab === 'collaborators'
                        ? 'bg-white text-slate-900 shadow-sm ring-1 ring-slate-200'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-white/70'
                    }`}
                  >
                    <UserCheck size={18} className={activeTab === 'collaborators' ? 'opacity-100' : 'opacity-70'} />
                    <span>Colaboradores</span>
                  </button>
                </div>
              </div>
            </Card>

            {/* Tab Content */}
            <div className="mt-6">
              {isLoading ? (
                <Card className="p-8 text-center bg-white shadow-sm">
                  <Loader2 size={48} className="mx-auto text-blue-500 animate-spin mb-4" />
                  <p className="text-gray-600">Cargando...</p>
                </Card>
              ) : activeTab === 'dashboard' ? (
                <SmartDashboard
                  posts={posts}
                  analytics={analytics}
                  profiles={profiles}
                  onQuickAction={(action) => {
                    switch (action) {
                      case 'create_post':
                        setIsModalOpen(true);
                        break;
                      case 'view_calendar':
                        setActiveTab('calendar');
                        break;
                      case 'view_analytics':
                        setActiveTab('analytics');
                        break;
                      case 'view_suggestions':
                        setActiveTab('suggestions');
                        break;
                      default:
                        break;
                    }
                  }}
                />
              ) : activeTab === 'calendar' ? (
                <SocialPlannerCalendar
                  currentDate={currentDate}
                  onPostSelect={handlePostSelect}
                />
              ) : activeTab === 'analytics' ? (
                <div className="space-y-6">
                  {analytics && posts.length > 0 ? (
                    <AdvancedAnalytics
                      analytics={analytics}
                      posts={posts}
                      onPeriodChange={(_startDate, _endDate) => {
                        // Recargar datos para el nuevo período
                        loadData();
                      }}
                    />
                  ) : (
                    <div className="space-y-6">
                      {/* Analytics Summary */}
                      {analytics ? (
                        <MetricCards
                          columns={5}
                          data={[
                            {
                              id: 'reach',
                              title: 'Alcance Total',
                              value: analytics.summary.totalReach.toLocaleString(),
                              color: 'info',
                              icon: <Eye size={20} />,
                            },
                            {
                              id: 'engagement',
                              title: 'Engagement Rate',
                              value: `${analytics.summary.engagementRate}%`,
                              color: 'primary',
                              icon: <TrendingUp size={20} />,
                            },
                            {
                              id: 'growth',
                              title: 'Crecimiento',
                              value: `+${analytics.summary.followerGrowth}`,
                              color: 'success',
                              icon: <TrendingUp size={20} />,
                            },
                            {
                              id: 'clicks',
                              title: 'Clics',
                              value: analytics.summary.linkClicks.toLocaleString(),
                              color: 'warning',
                              icon: <MousePointerClick size={20} />,
                            },
                            {
                              id: 'impressions',
                              title: 'Impresiones',
                              value: analytics.summary.totalImpressions.toLocaleString(),
                              color: 'info',
                              icon: <Eye size={20} />,
                            },
                          ]}
                        />
                      ) : null}

                      {/* Top Posts */}
                      {analytics && analytics.topPosts.length > 0 ? (
                        <Card className="bg-white shadow-sm">
                          <h2 className="text-xl font-bold text-gray-900 mb-6">Top Publicaciones</h2>
                          <div className="space-y-4">
                            {analytics.topPosts.map((post, idx) => (
                              <Card
                                key={post.id}
                                variant="hover"
                                padding="sm"
                                className="flex items-center justify-between ring-1 ring-gray-200"
                              >
                                <div className="flex items-center gap-4">
                                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 text-blue-700 font-bold">
                                    {idx + 1}
                                  </div>
                                  <div className="flex items-center gap-3">
                                    <span className="text-2xl">{getPlatformIcon(post.platform)}</span>
                                    <div>
                                      <p className="font-semibold text-gray-900">{post.content.substring(0, 60)}...</p>
                                      <p className="text-sm text-gray-600">
                                        {new Date(post.publishedAt).toLocaleDateString('es-ES')}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                                <div className="flex items-center gap-6">
                                  <div className="text-right">
                                    <p className="text-xl font-bold text-blue-600">{post.engagement}</p>
                                    <p className="text-xs text-gray-600">engagement</p>
                                  </div>
                                  <div className="text-right">
                                    <p className="text-xl font-bold text-blue-600">{post.reach.toLocaleString()}</p>
                                    <p className="text-xs text-gray-600">alcance</p>
                                  </div>
                                </div>
                              </Card>
                            ))}
                          </div>
                        </Card>
                      ) : analytics ? (
                        <Card className="p-8 text-center bg-white shadow-sm">
                          <BarChart3 size={48} className="mx-auto text-gray-400 mb-4" />
                          <h3 className="text-lg font-semibold text-gray-900 mb-2">Sin publicaciones</h3>
                          <p className="text-gray-600">No hay publicaciones para mostrar en este período</p>
                        </Card>
                      ) : null}

                      {/* Hashtag Analysis */}
                      {hashtagAnalysis.length > 0 && (
                        <Card className="bg-white shadow-sm">
                          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <Hash size={20} />
                            Análisis de Hashtags
                          </h2>
                          <HashtagAnalyzer hashtags={hashtagAnalysis} />
                        </Card>
                      )}

                      {/* Best Times to Post */}
                      {bestTimes.length > 0 && (
                        <Card className="bg-white shadow-sm">
                          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <Clock size={20} />
                            Mejores Horarios para Publicar
                          </h2>
                          <BestTimesToPost times={bestTimes} platform={selectedPlatform} />
                        </Card>
                      )}
                    </div>
                  )}
                </div>
              ) : activeTab === 'campaigns' ? (
                <CampaignsManager
                  campaigns={campaigns}
                  onCampaignCreate={async () => {
                    // Handle campaign creation
                    await loadData();
                  }}
                />
              ) : activeTab === 'library' ? (
                <ContentLibrary
                  items={contentLibrary}
                  onItemSelect={() => {
                    // Handle item selection - could open in post creator
                    setSelectedPostId(null);
                    setIsModalOpen(true);
                  }}
                />
              ) : activeTab === 'insights' ? (
                audienceInsights ? (
                  <AudienceInsights insights={audienceInsights} />
                ) : (
                  <Card className="p-8 text-center bg-white shadow-sm">
                    <Users size={48} className="mx-auto text-gray-400 mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Cargando insights</h3>
                    <p className="text-gray-600">Analizando datos de audiencia...</p>
                  </Card>
                )
              ) : activeTab === 'suggestions' ? (
                <ContentSuggestions
                  suggestions={contentSuggestions}
                  onSuggestionAccept={() => {
                    // Handle suggestion acceptance
                    setSelectedPostId(null);
                    setIsModalOpen(true);
                  }}
                />
              ) : activeTab === 'transformations' ? (
                <ClientTransformations
                  transformations={clientTransformations}
                  onTransformToPost={() => {
                    // Handle transformation to post conversion
                    setSelectedPostId(null);
                    setIsModalOpen(true);
                  }}
                  onCreateTransformation={() => {
                    // Handle new transformation creation
                  }}
                />
              ) : activeTab === 'automation' ? (
                <AutoPublishManager
                  posts={posts}
                  bestTimes={bestTimes}
                  onQueueUpdate={() => loadData()}
                />
              ) : activeTab === 'recurring' ? (
                <RecurringPostsManager
                  onOccurrencesGenerated={(_occurrences) => {
                    // Handle generated occurrences
                    loadData();
                  }}
                />
              ) : activeTab === 'auto-reply' ? (
                <AutoReplyManager
                  onSettingsUpdate={() => loadData()}
                />
              ) : activeTab === 'agenda' ? (
                <AgendaIntegration
                  onPostGenerated={(_post) => {
                    // Handle generated post from event
                    setSelectedPostId(null);
                    setIsModalOpen(true);
                  }}
                />
              ) : activeTab === 'reports' ? (
                analytics ? (
                  <ReportExporter
                    analytics={analytics}
                    posts={posts}
                    onExport={(format, report) => {
                      // Handle export
                      console.log('Exporting:', format, report);
                    }}
                  />
                ) : (
                  <Card className="p-8 text-center bg-white shadow-sm">
                    <Download size={48} className="mx-auto text-gray-400 mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Cargando datos</h3>
                    <p className="text-gray-600">Preparando reportes...</p>
                  </Card>
                )
              ) : activeTab === 'ab-testing' ? (
                <ABTestingManager
                  onTestCreate={(_test) => {
                    // Handle test creation
                    loadData();
                  }}
                />
              ) : activeTab === 'ai-content' ? (
                <AIContentGenerator
                  onContentGenerated={(_content) => {
                    // Handle generated content
                    setSelectedPostId(null);
                    setIsModalOpen(true);
                  }}
                />
              ) : activeTab === 'notifications' ? (
                <NotificationCenter
                  onNotificationClick={(notification) => {
                    // Handle notification click
                    if (notification.action?.actionId) {
                      switch (notification.action.actionId) {
                        case 'view_post_001':
                          setActiveTab('calendar');
                          break;
                        case 'view_analytics':
                          setActiveTab('analytics');
                          break;
                        case 'view_calendar':
                          setActiveTab('calendar');
                          break;
                        default:
                          break;
                      }
                    }
                  }}
                />
              ) : activeTab === 'collaborators' ? (
                <CollaboratorManager
                  posts={posts}
                  onApprovalUpdate={() => loadData()}
                />
              ) : null}
            </div>
          </div>
        </div>

        {/* Post Creator Modal */}
        {isModalOpen && (
          <PostCreatorModal
            isOpen={isModalOpen}
            onClose={handleCloseModal}
            postId={selectedPostId}
            onSave={handleSavePost}
            profiles={profiles}
            templates={templates}
          />
        )}
      </div>
  );
}

