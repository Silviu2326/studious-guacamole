import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { Card, MetricCards, Button, Tabs } from '../../../components/componentsreutilizables';
import { CommunityFeed } from '../components/CommunityFeed';
import { LoyaltyQuickActions } from '../components/LoyaltyQuickActions';
import { TestimonialsAndReferralsPanel } from '../components/TestimonialsAndReferralsPanel';
import { getGroups, getCommunityAnalytics } from '../api/community';
import { 
  Users, 
  MessageSquare, 
  TrendingUp, 
  Clock,
  Target,
  BarChart3,
  Users as UsersIcon,
  Repeat,
  UserCheck,
  UserPlus
} from 'lucide-react';

/**
 * Página principal de Comunidad & Fidelización
 * 
 * Centro de mando para la comunidad, la retención de clientes y las acciones de fidelización
 * (testimonios, referidos y engagement).
 */
export const CommunityYEngagementPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [analytics, setAnalytics] = useState({
    dailyActiveUsers: 0,
    totalMembers: 0,
    participationRate: 0,
    postsThisWeek: 0,
    avgCommentsPerPost: 0,
    avgResponseTime: 0,
    growthRate: 0,
    retentionRate: 0,
    reactivatedMembers: 0,
    referralLeads: 0
  });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('feed');
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      const data = await getCommunityAnalytics();
      setAnalytics(data);
    } catch (error) {
      console.error('Error al cargar analíticas:', error);
    } finally {
      setLoading(false);
    }
  };

  const metricas = [
    {
      id: 'participation-rate',
      title: 'Tasa de Participación',
      value: `${analytics.participationRate}%`,
      subtitle: 'Usuarios activos diarios',
      icon: <TrendingUp className="w-5 h-5" />,
      color: 'primary' as const,
      trend: {
        value: 5.2,
        direction: 'up' as const,
        label: 'vs semana anterior'
      }
    },
    {
      id: 'total-members',
      title: 'Miembros',
      value: analytics.totalMembers.toString(),
      subtitle: 'En la comunidad',
      icon: <UsersIcon className="w-5 h-5" />,
      color: 'info' as const
    },
    {
      id: 'posts-week',
      title: 'Publicaciones',
      value: analytics.postsThisWeek.toString(),
      subtitle: 'Esta semana',
      icon: <MessageSquare className="w-5 h-5" />,
      color: 'success' as const,
      trend: {
        value: 8,
        direction: 'up' as const,
        label: 'vs semana anterior'
      }
    },
    {
      id: 'avg-comments',
      title: 'Comentarios/Post',
      value: analytics.avgCommentsPerPost.toFixed(1),
      subtitle: 'Promedio',
      icon: <MessageSquare className="w-5 h-5" />,
      color: 'info' as const
    },
    {
      id: 'response-time',
      title: 'Tiempo Respuesta',
      value: `${analytics.avgResponseTime}h`,
      subtitle: 'Promedio',
      icon: <Clock className="w-5 h-5" />,
      color: 'warning' as const
    },
    {
      id: 'growth-rate',
      title: 'Crecimiento',
      value: `+${analytics.growthRate}%`,
      subtitle: 'Nuevos miembros',
      icon: <Target className="w-5 h-5" />,
      color: 'success' as const
    },
    {
      id: 'retention-rate',
      title: 'Tasa de Retención',
      value: `${analytics.retentionRate}%`,
      subtitle: 'Usuarios que vuelven semanalmente',
      icon: <Repeat className="w-5 h-5" />,
      color: 'primary' as const,
      trend: {
        value: 3.2,
        direction: 'up' as const,
        label: 'vs semana anterior'
      }
    },
    {
      id: 'reactivated-members',
      title: 'Miembros Reactivados',
      value: analytics.reactivatedMembers.toString(),
      subtitle: 'Vuelven a participar',
      icon: <UserCheck className="w-5 h-5" />,
      color: 'success' as const
    }
  ];

  const tabs = [
    {
      id: 'feed',
      label: 'Feed',
      icon: <MessageSquare className="w-4 h-4" />
    },
    {
      id: 'groups',
      label: 'Grupos',
      icon: <Users className="w-4 h-4" />
    },
    {
      id: 'analytics',
      label: 'Fidelización & Analíticas',
      icon: <BarChart3 className="w-4 h-4" />
    }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'feed':
        return (
          <CommunityFeed 
            groupId={selectedGroupId}
            filterBy="latest"
          />
        );
      case 'groups':
        return (
          <Card className="p-8 text-center bg-white shadow-sm">
            <Users size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Grupos de la Comunidad</h3>
            <p className="text-gray-600">Gestiona y explora grupos temáticos</p>
          </Card>
        );
      case 'analytics':
        return (
          <div className="space-y-6">
            {/* Panel de Quick Actions de Fidelización */}
            <LoyaltyQuickActions
              onRequestTestimonial={() => console.log('Solicitar testimonio')}
              onLaunchReferralCampaign={() => console.log('Lanzar campaña de referidos')}
              onCreateSmartSurvey={() => navigate('/dashboard/feedback/surveys')}
            />
            
            {/* Panel de Testimonios y Referidos */}
            <TestimonialsAndReferralsPanel />
            
            {/* Sección de Analíticas (placeholder para futuras implementaciones) */}
            <Card className="p-8 text-center bg-white shadow-sm">
              <BarChart3 size={48} className="mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Analíticas Detalladas</h3>
              <p className="text-gray-600">Vista de analíticas avanzadas de la comunidad</p>
            </Card>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Header */}
      <div className="border-b border-gray-200/60 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6">
          <div className="py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                {/* Icono con contenedor */}
                <div className="p-2 bg-blue-100 rounded-xl mr-4 ring-1 ring-blue-200/70">
                  <Users size={24} className="text-blue-600" />
                </div>
                
                {/* Título y descripción */}
                <div>
                  <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900">
                    Comunidad & Fidelización
                  </h1>
                  <p className="text-gray-600 mt-1">
                    Centro de mando para la comunidad, la retención de clientes y las acciones de fidelización (testimonios, referidos y engagement)
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6 py-8">
        <div className="space-y-6">
          {/* Métricas */}
          {!loading && (
            <MetricCards 
              data={metricas} 
              columns={6} 
            />
          )}

          {/* Información sobre la comunidad */}
          <Card className="p-4 bg-white shadow-sm">
            <div className="flex items-start gap-4">
              <div className="p-2 bg-blue-100 rounded-xl">
                <Users size={20} className="text-blue-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Bienvenido a la Comunidad
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Este es tu espacio para compartir progresos, hacer preguntas, apoyar a otros miembros 
                  y celebrar juntos cada logro. La comunidad está aquí para motivarte y ayudarte a alcanzar 
                  tus objetivos de fitness.
                </p>
              </div>
            </div>
          </Card>

          {/* Tabs de navegación */}
          <Card className="p-0 bg-white shadow-sm">
            <div className="px-4 py-3">
              <div
                role="tablist"
                aria-label="Secciones"
                className="flex items-center gap-2 rounded-2xl bg-slate-100 p-1"
              >
                {tabs.map((tab) => {
                  const activo = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      role="tab"
                      aria-selected={activo}
                      onClick={() => setActiveTab(tab.id)}
                      className={[
                        'inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all',
                        activo
                          ? 'bg-white text-slate-900 shadow-sm ring-1 ring-slate-200'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-white/70'
                      ].join(' ')}
                    >
                      {React.cloneElement(tab.icon, {
                        size: 18,
                        className: activo ? 'opacity-100' : 'opacity-70'
                      })}
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
            <div className="px-6 py-6">
              {renderTabContent()}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CommunityYEngagementPage;


