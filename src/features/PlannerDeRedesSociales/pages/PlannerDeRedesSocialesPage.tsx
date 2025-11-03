import React, { useState, useEffect } from 'react';
import { Layout } from '../../../components/layout';
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
import { Plus, Calendar, BarChart3, AlertCircle, TrendingUp, Eye, MousePointerClick } from 'lucide-react';

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
      <Layout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <p className="text-red-600 font-medium">{error}</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Planner de Redes Sociales</h1>
            <p className="text-gray-600 mt-2">
              Planifica, programa y analiza tu contenido social
            </p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
          >
            <Plus className="w-5 h-5" />
            Nueva Publicación
          </button>
        </div>

        {/* Connected Profiles */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Cuentas Conectadas</h2>
          <div className="flex items-center gap-4">
            {profiles.map((profile) => (
              <div
                key={profile.id}
                className="flex items-center gap-3 p-4 border-2 rounded-lg border-gray-200 hover:border-purple-500 transition"
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
                    <button className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium hover:bg-gray-200">
                      Conectar
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('calendar')}
              className={`
                flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition
                ${
                  activeTab === 'calendar'
                    ? 'border-purple-600 text-purple-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }
              `}
            >
              <Calendar className="w-5 h-5" />
              Calendario
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className={`
                flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition
                ${
                  activeTab === 'analytics'
                    ? 'border-purple-600 text-purple-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }
              `}
            >
              <BarChart3 className="w-5 h-5" />
              Analíticas
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === 'calendar' ? (
          <SocialPlannerCalendar
            currentDate={currentDate}
            onPostSelect={handlePostSelect}
          />
        ) : (
          <div className="space-y-6">
            {/* Analytics Summary */}
            {analytics && (
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Eye className="w-5 h-5 text-blue-600" />
                    </div>
                  </div>
                  <h3 className="text-sm font-medium text-gray-600 mb-1">Alcance Total</h3>
                  <p className="text-3xl font-bold text-gray-900">
                    {analytics.summary.totalReach.toLocaleString()}
                  </p>
                </div>

                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <TrendingUp className="w-5 h-5 text-purple-600" />
                    </div>
                  </div>
                  <h3 className="text-sm font-medium text-gray-600 mb-1">Engagement Rate</h3>
                  <p className="text-3xl font-bold text-gray-900">{analytics.summary.engagementRate}</p>
                </div>

                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <TrendingUp className="w-5 h-5 text-green-600" />
                    </div>
                  </div>
                  <h3 className="text-sm font-medium text-gray-600 mb-1">Crecimiento</h3>
                  <p className="text-3xl font-bold text-green-600">
                    +{analytics.summary.followerGrowth}
                  </p>
                </div>

                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="p-2 bg-orange-100 rounded-lg">
                      <MousePointerClick className="w-5 h-5 text-orange-600" />
                    </div>
                  </div>
                  <h3 className="text-sm font-medium text-gray-600 mb-1">Clics</h3>
                  <p className="text-3xl font-bold text-gray-900">{analytics.summary.linkClicks}</p>
                </div>

                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="p-2 bg-indigo-100 rounded-lg">
                      <Eye className="w-5 h-5 text-indigo-600" />
                    </div>
                  </div>
                  <h3 className="text-sm font-medium text-gray-600 mb-1">Impresiones</h3>
                  <p className="text-3xl font-bold text-gray-900">
                    {analytics.summary.totalImpressions.toLocaleString()}
                  </p>
                </div>
              </div>
            )}

            {/* Top Posts */}
            {analytics && (
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Top Publicaciones</h2>
                <div className="space-y-4">
                  {analytics.topPosts.map((post, idx) => (
                    <div
                      key={post.id}
                      className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
                    >
                      <div className="flex items-center gap-4">
                        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-purple-100 text-purple-700 font-bold">
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
                          <p className="text-xl font-bold text-purple-600">{post.engagement}</p>
                          <p className="text-xs text-gray-600">engagement</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xl font-bold text-blue-600">{post.reach.toLocaleString()}</p>
                          <p className="text-xs text-gray-600">alcance</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

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
    </Layout>
  );
}

