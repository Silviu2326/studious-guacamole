import React, { useState, useEffect } from 'react';
import { Card, Button, Badge } from '../../../components/componentsreutilizables';
import { Notification } from '../types';
import { getNotifications, markNotificationAsRead, markAllNotificationsAsRead, getUnreadNotificationsCount } from '../api';
import { getPriorityColor, getPriorityLabel } from '../api/priority';
import { Bell, CheckCircle2, Clock, AlertTriangle, Loader2 } from 'lucide-react';

interface NotificationCenterProps {
  role: 'entrenador' | 'gimnasio';
}

export const NotificationCenter: React.FC<NotificationCenterProps> = ({ role }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'all' | 'unread'>('unread');

  useEffect(() => {
    loadNotifications();
    loadUnreadCount();
  }, [activeTab]);

  const loadNotifications = async () => {
    setLoading(true);
    try {
      const isRead = activeTab === 'unread' ? false : undefined;
      const data = await getNotifications(isRead);
      setNotifications(data);
    } catch (error) {
      console.error('Error cargando notificaciones:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadUnreadCount = async () => {
    try {
      const count = await getUnreadNotificationsCount();
      setUnreadCount(count);
    } catch (error) {
      console.error('Error cargando contador:', error);
    }
  };

  const handleMarkAsRead = async (id: string) => {
    try {
      await markNotificationAsRead(id);
      loadNotifications();
      loadUnreadCount();
    } catch (error) {
      console.error('Error marcando notificación:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllNotificationsAsRead();
      loadNotifications();
      loadUnreadCount();
    } catch (error) {
      console.error('Error marcando todas las notificaciones:', error);
    }
  };

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'task':
        return <CheckCircle2 className="w-5 h-5 text-blue-600" />;
      case 'alert':
        return <AlertTriangle className="w-5 h-5 text-red-600" />;
      case 'reminder':
        return <Clock className="w-5 h-5 text-yellow-600" />;
      default:
        return <Bell className="w-5 h-5 text-gray-600" />;
    }
  };

  if (loading) {
    return (
      <Card className="p-8 text-center bg-white shadow-sm">
        <Loader2 size={48} className="mx-auto text-blue-500 animate-spin mb-4" />
        <p className="text-gray-600">Cargando...</p>
      </Card>
    );
  }

  return (
    <Card className="bg-white shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <Bell className="w-5 h-5 text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-900">
            Centro de Notificaciones
          </h3>
        </div>
        {notifications.length > 0 && activeTab === 'unread' && (
          <Button variant="ghost" size="sm" onClick={handleMarkAllAsRead}>
            Marcar todas como leídas
          </Button>
        )}
      </div>

      {/* Sistema de Tabs */}
      <Card className="p-0 bg-white shadow-sm mb-6">
        <div className="px-4 py-3">
          <div
            role="tablist"
            aria-label="Secciones"
            className="flex items-center gap-2 rounded-2xl bg-slate-100 p-1"
          >
            <button
              onClick={() => setActiveTab('unread')}
              className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all ${
                activeTab === 'unread'
                  ? 'bg-white text-slate-900 shadow-sm ring-1 ring-slate-200'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/70'
              }`}
              role="tab"
              aria-selected={activeTab === 'unread'}
            >
              <Bell size={18} className={activeTab === 'unread' ? 'opacity-100' : 'opacity-70'} />
              <span>Sin Leer ({unreadCount})</span>
            </button>
            <button
              onClick={() => setActiveTab('all')}
              className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all ${
                activeTab === 'all'
                  ? 'bg-white text-slate-900 shadow-sm ring-1 ring-slate-200'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/70'
              }`}
              role="tab"
              aria-selected={activeTab === 'all'}
            >
              <Bell size={18} className={activeTab === 'all' ? 'opacity-100' : 'opacity-70'} />
              <span>Todas</span>
            </button>
          </div>
        </div>
      </Card>

      <div className="space-y-4">
        {notifications.length === 0 ? (
          <Card className="p-8 text-center bg-white shadow-sm">
            <CheckCircle2 size={48} className="mx-auto text-green-500 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No hay notificaciones {activeTab === 'unread' ? 'sin leer' : ''}
            </h3>
            <p className="text-gray-600">
              {activeTab === 'unread' 
                ? 'Todas las notificaciones están leídas'
                : 'No hay notificaciones disponibles'}
            </p>
          </Card>
        ) : (
          notifications.map((notification) => (
            <div
              key={notification.id}
              className={`p-4 rounded-xl border transition-all ${
                notification.isRead
                  ? 'bg-slate-50 border-slate-200'
                  : 'bg-blue-50 border-blue-200 ring-1 ring-blue-100'
              }`}
            >
              <div className="flex items-start gap-3">
                {getNotificationIcon(notification.type)}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-semibold text-gray-900">
                      {notification.title}
                    </h4>
                    <Badge className={getPriorityColor(notification.priority)}>
                      {getPriorityLabel(notification.priority)}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">
                    {notification.message}
                  </p>
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span>
                      {new Date(notification.createdAt).toLocaleDateString('es-ES', {
                        day: '2-digit',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                    {notification.actionUrl && (
                      <a
                        href={notification.actionUrl}
                        className="text-blue-600 hover:text-blue-700 hover:underline"
                      >
                        Ver detalles
                      </a>
                    )}
                  </div>
                </div>
                {!notification.isRead && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleMarkAsRead(notification.id)}
                    title="Marcar como leída"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </Card>
  );
};

