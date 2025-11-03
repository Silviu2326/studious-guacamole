import React, { useState, useEffect } from 'react';
import { SocialPlannerCalendar } from '../components/SocialPlannerCalendar';
import { PostCreatorModal } from '../components/PostCreatorModal';
import { PostCard } from '../components/PostCard';
import {
  getSocialPosts,
  createSocialPost,
  updateSocialPost,
  getSocialProfiles,
  getSocialAnalytics,
  getPostTemplates,
  SocialPost,
  SocialProfile,
  SocialAnalytics,
  PostTemplate,
  getStatusLabel,
  getStatusColor,
  getPlatformIcon
} from '../api/social';
import { Plus, Calendar, BarChart3, AlertCircle, TrendingUp, Eye, MousePointerClick, Share2, Loader2 } from 'lucide-react';
import { Card, Button, MetricCards } from '../../../components/componentsreutilizables';

export default function PlannerDeRedesSocialesPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [profiles, setProfiles] = useState<SocialProfile[]>([]);
  const [posts, setPosts] = useState<SocialPost[]>([]);
  const [analytics, setAnalytics] = useState<SocialAnalytics | null>(null);
  const [templates, setTemplates] = useState<PostTemplate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'calendar' | 'analytics'>('calendar');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const [profilesData, postsData, analyticsData, templatesData] = await Promise.all([
        getSocialProfiles(),
        getSocialPosts('2024-01-01', '2024-12-31'),
        getSocialAnalytics('2024-01-01', '2024-01-31'),
        getPostTemplates()
      ]);

      setProfiles(profilesData);
      setPosts(postsData);
      setAnalytics(analyticsData);
      setTemplates(templatesData);
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
                  className="flex items-center gap-2 rounded-2xl bg-slate-100 p-1"
                >
                  <button
                    role="tab"
                    aria-selected={activeTab === 'calendar'}
                    onClick={() => setActiveTab('calendar')}
                    className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all ${
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
                    className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all ${
                      activeTab === 'analytics'
                        ? 'bg-white text-slate-900 shadow-sm ring-1 ring-slate-200'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-white/70'
                    }`}
                  >
                    <BarChart3 size={18} className={activeTab === 'analytics' ? 'opacity-100' : 'opacity-70'} />
                    <span>Analíticas</span>
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
              ) : activeTab === 'calendar' ? (
                <SocialPlannerCalendar
                  currentDate={currentDate}
                  onPostSelect={handlePostSelect}
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
                </div>
              )}
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

