import React, { useState, useEffect } from 'react';
import { SocialPost, SocialAnalytics, SocialProfile } from '../api/social';
import { Card, Button } from '../../../components/componentsreutilizables';
import {
  LayoutDashboard,
  AlertCircle,
  TrendingUp,
  Calendar,
  Lightbulb,
  Zap,
  Eye,
  Heart,
  Share2,
  Clock,
  CheckCircle2,
  XCircle,
  BarChart3
} from 'lucide-react';

interface SmartDashboardProps {
  posts: SocialPost[];
  analytics: SocialAnalytics | null;
  profiles: SocialProfile[];
  onQuickAction?: (action: string) => void;
}

export const SmartDashboard: React.FC<SmartDashboardProps> = ({
  posts,
  analytics,
  profiles,
  onQuickAction
}) => {
  const [alerts, setAlerts] = useState<any[]>([]);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [todayStats, setTodayStats] = useState<any>(null);

  useEffect(() => {
    generateAlerts();
    generateRecommendations();
    calculateTodayStats();
  }, [posts, analytics]);

  const generateAlerts = () => {
    const newAlerts: any[] = [];
    
    // Posts sin programar
    const scheduledToday = posts.filter(p => {
      if (!p.scheduledAt) return false;
      const scheduled = new Date(p.scheduledAt);
      const today = new Date();
      return scheduled.toDateString() === today.toDateString();
    });
    
    if (scheduledToday.length === 0) {
      newAlerts.push({
        id: 'alert_001',
        type: 'warning',
        title: 'No hay posts programados hoy',
        message: 'Considera programar contenido para mantener tu presencia activa',
        action: 'create_post'
      });
    }
    
    // Bajo engagement
    if (analytics) {
      const engagementRate = parseFloat(analytics.summary.engagementRate.replace('%', ''));
      if (engagementRate < 3) {
        newAlerts.push({
          id: 'alert_002',
          type: 'warning',
          title: 'Engagement bajo',
          message: `Tu engagement rate es ${analytics.summary.engagementRate}, considera mejorar tu contenido`,
          action: 'view_analytics'
        });
      }
    }
    
    // Posts próximos
    const upcomingPosts = posts.filter(p => {
      if (!p.scheduledAt) return false;
      const scheduled = new Date(p.scheduledAt);
      const now = new Date();
      const diffHours = (scheduled.getTime() - now.getTime()) / (1000 * 60 * 60);
      return diffHours > 0 && diffHours <= 2;
    });
    
    if (upcomingPosts.length > 0) {
      newAlerts.push({
        id: 'alert_003',
        type: 'info',
        title: `${upcomingPosts.length} post(s) próximos`,
        message: `Tienes ${upcomingPosts.length} publicación(es) programada(s) en las próximas 2 horas`,
        action: 'view_calendar'
      });
    }
    
    setAlerts(newAlerts);
  };

  const generateRecommendations = () => {
    const newRecommendations: any[] = [];
    
    // Recomendación de contenido
    newRecommendations.push({
      id: 'rec_001',
      type: 'content',
      title: 'Publica contenido de transformación',
      message: 'Las transformaciones tienen 3x más engagement. Considera publicar una esta semana.',
      priority: 'high',
      action: 'create_transformation_post'
    });
    
    // Recomendación de horario
    newRecommendations.push({
      id: 'rec_002',
      type: 'timing',
      title: 'Mejor horario: Viernes 20:00',
      message: 'Según tus datos, los viernes a las 20:00 generan el mayor engagement.',
      priority: 'medium',
      action: 'schedule_post'
    });
    
    // Recomendación de hashtags
    newRecommendations.push({
      id: 'rec_003',
      type: 'hashtags',
      title: 'Usa más #transformacion',
      message: 'Este hashtag tiene 850 de engagement promedio. Añádelo a tus próximos posts.',
      priority: 'medium',
      action: 'view_hashtags'
    });
    
    setRecommendations(newRecommendations);
  };

  const calculateTodayStats = () => {
    const today = new Date();
    const todayPosts = posts.filter(p => {
      if (!p.scheduledAt && !p.publishedAt) return false;
      const date = p.publishedAt ? new Date(p.publishedAt) : new Date(p.scheduledAt!);
      return date.toDateString() === today.toDateString();
    });
    
    setTodayStats({
      postsToday: todayPosts.length,
      scheduledToday: todayPosts.filter(p => p.status === 'scheduled').length,
      publishedToday: todayPosts.filter(p => p.status === 'published').length
    });
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'warning':
        return <AlertCircle size={20} className="text-yellow-600" />;
      case 'error':
        return <XCircle size={20} className="text-red-600" />;
      case 'info':
        return <CheckCircle2 size={20} className="text-blue-600" />;
      default:
        return <AlertCircle size={20} className="text-gray-600" />;
    }
  };

  const getAlertColor = (type: string) => {
    switch (type) {
      case 'warning':
        return 'bg-yellow-50 border-yellow-200';
      case 'error':
        return 'bg-red-50 border-red-200';
      case 'info':
        return 'bg-blue-50 border-blue-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-700 border-red-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'low':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <LayoutDashboard size={24} className="text-blue-600" />
          <div>
            <h3 className="text-xl font-bold text-gray-900">Dashboard Inteligente</h3>
            <p className="text-sm text-gray-600">Vista general con métricas clave y recomendaciones</p>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-5 bg-white shadow-sm ring-1 ring-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Posts Hoy</p>
              <p className="text-2xl font-bold text-gray-900">
                {todayStats?.postsToday || 0}
              </p>
            </div>
            <Calendar size={32} className="text-blue-600 opacity-50" />
          </div>
          <div className="mt-3 pt-3 border-t border-gray-200 flex items-center gap-2 text-xs text-gray-600">
            <CheckCircle2 size={12} className="text-green-600" />
            <span>{todayStats?.publishedToday || 0} publicados</span>
          </div>
        </Card>

        <Card className="p-5 bg-white shadow-sm ring-1 ring-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Alcance Total</p>
              <p className="text-2xl font-bold text-gray-900">
                {analytics?.summary.totalReach.toLocaleString() || '0'}
              </p>
            </div>
            <Eye size={32} className="text-purple-600 opacity-50" />
          </div>
          <div className="mt-3 pt-3 border-t border-gray-200 flex items-center gap-2 text-xs text-green-600">
            <TrendingUp size={12} />
            <span>+15% vs mes anterior</span>
          </div>
        </Card>

        <Card className="p-5 bg-white shadow-sm ring-1 ring-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Engagement Rate</p>
              <p className="text-2xl font-bold text-gray-900">
                {analytics?.summary.engagementRate || '0%'}
              </p>
            </div>
            <Heart size={32} className="text-red-600 opacity-50" />
          </div>
          <div className="mt-3 pt-3 border-t border-gray-200 flex items-center gap-2 text-xs text-green-600">
            <TrendingUp size={12} />
            <span>+0.5pp vs mes anterior</span>
          </div>
        </Card>

        <Card className="p-5 bg-white shadow-sm ring-1 ring-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Crecimiento</p>
              <p className="text-2xl font-bold text-gray-900">
                +{analytics?.summary.followerGrowth || 0}
              </p>
            </div>
            <TrendingUp size={32} className="text-green-600 opacity-50" />
          </div>
          <div className="mt-3 pt-3 border-t border-gray-200 flex items-center gap-2 text-xs text-gray-600">
            <Clock size={12} />
            <span>Este mes</span>
          </div>
        </Card>
      </div>

      {/* Alerts */}
      {alerts.length > 0 && (
        <div>
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Alertas</h4>
          <div className="space-y-3">
            {alerts.map((alert) => (
              <Card
                key={alert.id}
                className={`p-4 border-2 ${getAlertColor(alert.type)} transition-all`}
              >
                <div className="flex items-start gap-3">
                  {getAlertIcon(alert.type)}
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900 mb-1">{alert.title}</p>
                    <p className="text-sm text-gray-700">{alert.message}</p>
                  </div>
                  <Button
                    onClick={() => onQuickAction?.(alert.action)}
                    variant="ghost"
                    size="sm"
                  >
                    Ver
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Recommendations */}
      {recommendations.length > 0 && (
        <div>
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Recomendaciones del Día</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {recommendations.map((rec) => (
              <Card
                key={rec.id}
                className="p-5 bg-white shadow-sm ring-1 ring-gray-200 hover:ring-blue-400 transition-all"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Lightbulb size={20} className="text-yellow-600" />
                    <h5 className="font-semibold text-gray-900">{rec.title}</h5>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(rec.priority)}`}>
                    {rec.priority === 'high' ? 'Alta' : rec.priority === 'medium' ? 'Media' : 'Baja'}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-3">{rec.message}</p>
                <Button
                  onClick={() => onQuickAction?.(rec.action)}
                  variant="secondary"
                  size="sm"
                  className="w-full"
                >
                  Aplicar Recomendación
                </Button>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <Card className="p-6 bg-white shadow-sm ring-1 ring-gray-200">
        <h4 className="font-semibold text-gray-900 mb-4">Acciones Rápidas</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Button
            onClick={() => onQuickAction?.('create_post')}
            variant="secondary"
            className="flex flex-col items-center gap-2 h-auto py-4"
          >
            <Zap size={24} className="text-blue-600" />
            <span className="text-sm">Crear Post</span>
          </Button>
          <Button
            onClick={() => onQuickAction?.('schedule_suggestion')}
            variant="secondary"
            className="flex flex-col items-center gap-2 h-auto py-4"
          >
            <Lightbulb size={24} className="text-yellow-600" />
            <span className="text-sm">Programar Sugerencia</span>
          </Button>
          <Button
            onClick={() => onQuickAction?.('view_calendar')}
            variant="secondary"
            className="flex flex-col items-center gap-2 h-auto py-4"
          >
            <Calendar size={24} className="text-purple-600" />
            <span className="text-sm">Ver Calendario</span>
          </Button>
          <Button
            onClick={() => onQuickAction?.('view_analytics')}
            variant="secondary"
            className="flex flex-col items-center gap-2 h-auto py-4"
          >
            <BarChart3 size={24} className="text-green-600" />
            <span className="text-sm">Ver Analíticas</span>
          </Button>
        </div>
      </Card>

      {/* Calendar Preview */}
      <Card className="p-6 bg-white shadow-sm ring-1 ring-gray-200">
        <h4 className="font-semibold text-gray-900 mb-4">Calendario de Contenido</h4>
        <div className="grid grid-cols-7 gap-2">
          {['L', 'M', 'X', 'J', 'V', 'S', 'D'].map((day, idx) => {
            const date = new Date();
            date.setDate(date.getDate() + (idx - date.getDay() + 1));
            const dayPosts = posts.filter(p => {
              if (!p.scheduledAt) return false;
              const scheduled = new Date(p.scheduledAt);
              return scheduled.toDateString() === date.toDateString();
            });
            
            const isToday = date.toDateString() === new Date().toDateString();
            
            return (
              <div
                key={idx}
                className={`p-3 rounded-lg border-2 ${
                  isToday
                    ? 'bg-blue-50 border-blue-300'
                    : 'bg-gray-50 border-gray-200'
                }`}
              >
                <p className={`text-xs font-medium mb-1 ${isToday ? 'text-blue-700' : 'text-gray-600'}`}>
                  {day}
                </p>
                <p className={`text-lg font-bold mb-2 ${isToday ? 'text-blue-600' : 'text-gray-900'}`}>
                  {date.getDate()}
                </p>
                {dayPosts.length > 0 && (
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                    <span className="text-xs text-gray-600">{dayPosts.length}</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
};

