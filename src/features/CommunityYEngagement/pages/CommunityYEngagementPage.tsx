import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { Card, MetricCards, Button, Tabs } from '../../../components/componentsreutilizables';
import { CommunityFeed } from '../components/CommunityFeed';
import { getGroups, getCommunityAnalytics } from '../api/community';
import { 
  Users, 
  MessageSquare, 
  TrendingUp, 
  Clock,
  Target,
  BarChart3,
  Users as UsersIcon
} from 'lucide-react';

/**
 * Página principal de Community & Engagement
 * 
 * Plataforma social privada donde los clientes comparten logros,
 * interactúan y construyen una comunidad de apoyo y motivación.
 */
export const CommunityYEngagementPage: React.FC = () => {
  const { user } = useAuth();
  const [analytics, setAnalytics] = useState({
    dailyActiveUsers: 0,
    totalMembers: 0,
    participationRate: 0,
    postsThisWeek: 0,
    avgCommentsPerPost: 0,
    avgResponseTime: 0,
    growthRate: 0
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
      label: 'Analíticas',
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
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Grupos de la Comunidad</h3>
            <div className="text-center py-12 text-gray-500">
              <Users className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p>Gestiona y explora grupos temáticos</p>
            </div>
          </Card>
        );
      case 'analytics':
        return (
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Analíticas Detalladas</h3>
            <div className="text-center py-12 text-gray-500">
              <BarChart3 className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p>Vista de analíticas avanzadas de la comunidad</p>
            </div>
          </Card>
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
                <div className="p-2 bg-green-100 rounded-xl mr-4 ring-1 ring-green-200/70">
                  <Users size={24} className="text-green-600" />
                </div>
                
                {/* Título y descripción */}
                <div>
                  <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900">
                    Community & Engagement
                  </h1>
                  <p className="text-gray-600 mt-1">
                    Comparte logros, conecta con otros miembros y construye una comunidad de apoyo
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
          <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
            <div className="p-6">
              <div className="flex items-start gap-4">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Users className="w-5 h-5 text-green-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Bienvenido a la Comunidad
                  </h3>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    Este es tu espacio para compartir progresos, hacer preguntas, apoyar a otros miembros 
                    y celebrar juntos cada logro. La comunidad está aquí para motivarte y ayudarte a alcanzar 
                    tus objetivos de fitness.
                  </p>
                </div>
              </div>
            </div>
          </Card>

          {/* Tabs de navegación */}
          <Card className="p-0 bg-white shadow-sm">
            <div className="px-4 py-3 border-b border-gray-200">
              <div
                role="tablist"
                aria-label="Secciones"
                className="flex items-center gap-2"
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
                          ? 'bg-green-100 text-green-900 shadow-sm ring-1 ring-green-200'
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
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
            <div className="p-6">
              {renderTabContent()}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CommunityYEngagementPage;


