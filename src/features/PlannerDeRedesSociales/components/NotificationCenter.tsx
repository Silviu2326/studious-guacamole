import React, { useState, useEffect } from 'react';
import {
  Notification,
  NotificationSettings,
  getNotifications,
  markNotificationAsRead,
  markAllAsRead,
  deleteNotification,
  getNotificationSettings,
  updateNotificationSettings,
  NotificationType,
  NotificationPriority
} from '../api/notifications';
import { Card, Button, Modal } from '../../../components/componentsreutilizables';
import {
  Bell,
  CheckCircle2,
  AlertCircle,
  XCircle,
  Info,
  Clock,
  Settings,
  Trash2,
  CheckCheck,
  Filter
} from 'lucide-react';

interface NotificationCenterProps {
  onNotificationClick?: (notification: Notification) => void;
}

export const NotificationCenter: React.FC<NotificationCenterProps> = ({
  onNotificationClick
}) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [settings, setSettings] = useState<NotificationSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [filter, setFilter] = useState<'all' | 'unread' | NotificationType>('all');
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    loadData();
    
    // Simular actualizaciones en tiempo real
    const interval = setInterval(() => {
      loadNotifications();
    }, 30000); // Cada 30 segundos
    
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const unread = notifications.filter(n => !n.read).length;
    setUnreadCount(unread);
  }, [notifications]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [notificationsData, settingsData] = await Promise.all([
        getNotifications(),
        getNotificationSettings()
      ]);
      setNotifications(notificationsData);
      setSettings(settingsData);
    } catch (err) {
      console.error('Error loading data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const loadNotifications = async () => {
    try {
      const data = await getNotifications();
      setNotifications(data);
    } catch (err) {
      console.error('Error loading notifications:', err);
    }
  };

  const handleMarkAsRead = async (id: string) => {
    try {
      await markNotificationAsRead(id);
      setNotifications(prev => prev.map(n => 
        n.id === id ? { ...n, read: true, readAt: new Date().toISOString() } : n
      ));
    } catch (err) {
      console.error('Error marking as read:', err);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsRead();
      setNotifications(prev => prev.map(n => ({ ...n, read: true, readAt: new Date().toISOString() })));
    } catch (err) {
      console.error('Error marking all as read:', err);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteNotification(id);
      setNotifications(prev => prev.filter(n => n.id !== id));
    } catch (err) {
      console.error('Error deleting:', err);
    }
  };

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.read) {
      handleMarkAsRead(notification.id);
    }
    onNotificationClick?.(notification);
  };

  const getNotificationIcon = (type: NotificationType) => {
    switch (type) {
      case 'success':
        return <CheckCircle2 size={20} className="text-green-600" />;
      case 'warning':
        return <AlertCircle size={20} className="text-yellow-600" />;
      case 'error':
        return <XCircle size={20} className="text-red-600" />;
      case 'info':
        return <Info size={20} className="text-blue-600" />;
      case 'reminder':
        return <Clock size={20} className="text-purple-600" />;
      default:
        return <Bell size={20} className="text-gray-600" />;
    }
  };

  const getNotificationColor = (type: NotificationType) => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-green-200';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200';
      case 'error':
        return 'bg-red-50 border-red-200';
      case 'info':
        return 'bg-blue-50 border-blue-200';
      case 'reminder':
        return 'bg-purple-50 border-purple-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  const getPriorityColor = (priority: NotificationPriority) => {
    switch (priority) {
      case 'urgent':
        return 'bg-red-100 text-red-700';
      case 'high':
        return 'bg-orange-100 text-orange-700';
      case 'medium':
        return 'bg-yellow-100 text-yellow-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const filteredNotifications = notifications.filter(n => {
    if (filter === 'all') return true;
    if (filter === 'unread') return !n.read;
    return n.type === filter;
  });

  if (isLoading) {
    return (
      <Card className="p-8 text-center bg-white shadow-sm">
        <Bell size={48} className="mx-auto text-blue-500 animate-spin mb-4" />
        <p className="text-gray-600">Cargando notificaciones...</p>
      </Card>
    );
  }

  if (!settings) return null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Bell size={24} className="text-blue-600" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900">Centro de Notificaciones</h3>
            <p className="text-sm text-gray-600">
              {unreadCount > 0 ? `${unreadCount} notificación${unreadCount !== 1 ? 'es' : ''} sin leer` : 'Todas las notificaciones leídas'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {unreadCount > 0 && (
            <Button
              onClick={handleMarkAllAsRead}
              variant="secondary"
              size="sm"
              leftIcon={<CheckCheck size={18} />}
            >
              Marcar Todas como Leídas
            </Button>
          )}
          <Button
            onClick={() => setIsSettingsOpen(true)}
            variant="ghost"
            size="sm"
            leftIcon={<Settings size={18} />}
          >
            Configuración
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2 flex-wrap">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
            filter === 'all'
              ? 'bg-blue-100 text-blue-700 ring-1 ring-blue-200'
              : 'bg-white text-gray-600 hover:bg-gray-100 ring-1 ring-gray-200'
          }`}
        >
          Todas
        </button>
        <button
          onClick={() => setFilter('unread')}
          className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
            filter === 'unread'
              ? 'bg-blue-100 text-blue-700 ring-1 ring-blue-200'
              : 'bg-white text-gray-600 hover:bg-gray-100 ring-1 ring-gray-200'
          }`}
        >
          Sin Leer ({unreadCount})
        </button>
        {(['success', 'warning', 'error', 'info', 'reminder'] as NotificationType[]).map((type) => (
          <button
            key={type}
            onClick={() => setFilter(type)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all capitalize ${
              filter === type
                ? 'bg-blue-100 text-blue-700 ring-1 ring-blue-200'
                : 'bg-white text-gray-600 hover:bg-gray-100 ring-1 ring-gray-200'
            }`}
          >
            {type === 'success' ? 'Éxito' :
             type === 'warning' ? 'Advertencia' :
             type === 'error' ? 'Error' :
             type === 'info' ? 'Info' : 'Recordatorio'}
          </button>
        ))}
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {filteredNotifications.length > 0 ? (
          filteredNotifications.map((notification) => (
            <Card
              key={notification.id}
              className={`p-4 bg-white shadow-sm ring-1 border-2 transition-all cursor-pointer ${
                notification.read
                  ? 'ring-gray-200 border-gray-200 opacity-75'
                  : getNotificationColor(notification.type)
              }`}
              onClick={() => handleNotificationClick(notification)}
            >
              <div className="flex items-start gap-3">
                <div className="mt-0.5">
                  {getNotificationIcon(notification.type)}
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <h5 className={`font-semibold ${notification.read ? 'text-gray-600' : 'text-gray-900'}`}>
                        {notification.title}
                      </h5>
                      {!notification.read && (
                        <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                      )}
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(notification.priority)}`}>
                        {notification.priority === 'urgent' ? 'Urgente' :
                         notification.priority === 'high' ? 'Alta' :
                         notification.priority === 'medium' ? 'Media' : 'Baja'}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      {!notification.read && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleMarkAsRead(notification.id);
                          }}
                          className="p-1 hover:bg-gray-100 rounded transition"
                          title="Marcar como leída"
                        >
                          <CheckCircle2 size={16} className="text-gray-400" />
                        </button>
                      )}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(notification.id);
                        }}
                        className="p-1 hover:bg-red-100 rounded transition"
                        title="Eliminar"
                      >
                        <Trash2 size={16} className="text-gray-400" />
                      </button>
                    </div>
                  </div>
                  <p className={`text-sm mb-2 ${notification.read ? 'text-gray-500' : 'text-gray-700'}`}>
                    {notification.message}
                  </p>
                  {notification.action && (
                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleNotificationClick(notification);
                      }}
                      variant="secondary"
                      size="sm"
                      className="mt-2"
                    >
                      {notification.action.label}
                    </Button>
                  )}
                  <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                    <Clock size={12} />
                    <span>{new Date(notification.createdAt).toLocaleString('es-ES')}</span>
                  </div>
                </div>
              </div>
            </Card>
          ))
        ) : (
          <Card className="p-8 text-center bg-white shadow-sm">
            <Bell size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No hay notificaciones</h3>
            <p className="text-gray-600">
              {filter === 'unread' ? 'No hay notificaciones sin leer' : 'No hay notificaciones en este filtro'}
            </p>
          </Card>
        )}
      </div>

      {/* Settings Modal */}
      {isSettingsOpen && settings && (
        <Modal
          isOpen={isSettingsOpen}
          onClose={() => setIsSettingsOpen(false)}
          title="Configuración de Notificaciones"
          size="lg"
        >
          <div className="space-y-6">
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Preferencias Generales</h4>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">Notificaciones Activadas</p>
                    <p className="text-sm text-gray-600">Recibir notificaciones en la aplicación</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.enabled}
                      onChange={async () => {
                        const updated = await updateNotificationSettings({ enabled: !settings.enabled });
                        setSettings(updated);
                      }}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">Notificaciones por Email</p>
                    <p className="text-sm text-gray-600">Recibir notificaciones por correo electrónico</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.email}
                      onChange={async () => {
                        const updated = await updateNotificationSettings({ email: !settings.email });
                        setSettings(updated);
                      }}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Tipos de Notificaciones</h4>
              <div className="space-y-3">
                {Object.entries(settings.types).map(([type, enabled]) => (
                  <div key={type} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      {getNotificationIcon(type as NotificationType)}
                      <span className="font-medium text-gray-900 capitalize">
                        {type === 'success' ? 'Éxito' :
                         type === 'warning' ? 'Advertencia' :
                         type === 'error' ? 'Error' :
                         type === 'info' ? 'Información' : 'Recordatorios'}
                      </span>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={enabled}
                        onChange={async () => {
                          const updated = await updateNotificationSettings({
                            types: {
                              ...settings.types,
                              [type]: !enabled
                            }
                          });
                          setSettings(updated);
                        }}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Horas Silenciosas</h4>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">Activar Horas Silenciosas</p>
                    <p className="text-sm text-gray-600">No recibir notificaciones durante estas horas</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.quietHours.enabled}
                      onChange={async () => {
                        const updated = await updateNotificationSettings({
                          quietHours: {
                            ...settings.quietHours,
                            enabled: !settings.quietHours.enabled
                          }
                        });
                        setSettings(updated);
                      }}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
                
                {settings.quietHours.enabled && (
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Inicio</label>
                      <input
                        type="time"
                        value={settings.quietHours.start}
                        onChange={async (e) => {
                          const updated = await updateNotificationSettings({
                            quietHours: {
                              ...settings.quietHours,
                              start: e.target.value
                            }
                          });
                          setSettings(updated);
                        }}
                        className="w-full rounded-lg bg-white text-gray-900 ring-1 ring-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-4 py-2"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Fin</label>
                      <input
                        type="time"
                        value={settings.quietHours.end}
                        onChange={async (e) => {
                          const updated = await updateNotificationSettings({
                            quietHours: {
                              ...settings.quietHours,
                              end: e.target.value
                            }
                          });
                          setSettings(updated);
                        }}
                        className="w-full rounded-lg bg-white text-gray-900 ring-1 ring-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-4 py-2"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
              <Button variant="secondary" onClick={() => setIsSettingsOpen(false)}>
                Cerrar
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

