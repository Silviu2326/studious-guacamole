import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { Card, Button, Modal, Select } from '../../../components/componentsreutilizables';
import { ds } from '../../adherencia/ui/ds';
import { Notification as LeadNotification, NotificationType, NotificationPreferences } from '../types';
import { NotificationService } from '../services/notificationService';
import {
  Bell,
  BellOff,
  X,
  Check,
  Settings,
  Mail,
  Smartphone,
  Clock,
  AlertCircle,
  TrendingUp,
  UserPlus,
  Target,
  Calendar
} from 'lucide-react';

interface NotificationCenterProps {
  businessType: 'entrenador' | 'gimnasio';
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationCenter: React.FC<NotificationCenterProps> = ({
  businessType,
  isOpen,
  onClose
}) => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<LeadNotification[]>([]);
  const [loading, setLoading] = useState(true);
  const [showPreferences, setShowPreferences] = useState(false);
  const [preferences, setPreferences] = useState<NotificationPreferences | null>(null);

  useEffect(() => {
    if (isOpen && user?.id) {
      loadNotifications();
      loadPreferences();
    }
  }, [isOpen, user?.id]);

  // Verificar nuevas notificaciones periódicamente
  useEffect(() => {
    if (!user?.id) return;

    const interval = setInterval(() => {
      NotificationService.runAllChecks(user.id, businessType);
      loadNotifications();
    }, 5 * 60 * 1000); // Cada 5 minutos

    // Verificación inicial
    NotificationService.runAllChecks(user.id, businessType).then(() => {
      loadNotifications();
    });

    return () => clearInterval(interval);
  }, [user?.id, businessType]);

  const loadNotifications = async () => {
    if (!user?.id) return;
    setLoading(true);
    try {
      const data = await NotificationService.getNotifications(user.id);
      setNotifications(data);
    } catch (error) {
      console.error('Error cargando notificaciones:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadPreferences = async () => {
    if (!user?.id) return;
    try {
      const prefs = await NotificationService.getPreferences(user.id);
      setPreferences(prefs);
    } catch (error) {
      console.error('Error cargando preferencias:', error);
    }
  };

  const handleMarkAsRead = async (id: string) => {
    if (!user?.id) return;
    await NotificationService.markAsRead(id, user.id);
    await loadNotifications();
  };

  const handleMarkAllAsRead = async () => {
    if (!user?.id) return;
    await NotificationService.markAllAsRead(user.id);
    await loadNotifications();
  };

  const handleDelete = async (id: string) => {
    if (!user?.id) return;
    await NotificationService.deleteNotification(id, user.id);
    await loadNotifications();
  };

  const handleUpdatePreferences = async (updates: Partial<NotificationPreferences>) => {
    if (!user?.id || !preferences) return;
    const updated = await NotificationService.updatePreferences(user.id, updates);
    setPreferences(updated);
  };

  const getNotificationIcon = (type: NotificationType) => {
    switch (type) {
      case 'lead_no_response':
        return <AlertCircle className="w-4 h-4" />;
      case 'follow_up_today':
        return <Calendar className="w-4 h-4" />;
      case 'hot_lead':
        return <TrendingUp className="w-4 h-4" />;
      case 'new_lead':
        return <UserPlus className="w-4 h-4" />;
      case 'lead_converted':
        return <Target className="w-4 h-4" />;
      default:
        return <Bell className="w-4 h-4" />;
    }
  };

  const getNotificationColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20';
      case 'high':
        return 'text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/20';
      case 'medium':
        return 'text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/20';
      default:
        return 'text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-900/20';
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Centro de Notificaciones"
      size="lg"
      footer={
        <div className="flex items-center justify-between w-full">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowPreferences(!showPreferences)}
          >
            <Settings className="w-4 h-4 mr-2" />
            Preferencias
          </Button>
          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <Button
                variant="secondary"
                size="sm"
                onClick={handleMarkAllAsRead}
              >
                <Check className="w-4 h-4 mr-2" />
                Marcar todas como leídas
              </Button>
            )}
            <Button
              variant="secondary"
              size="sm"
              onClick={onClose}
            >
              Cerrar
            </Button>
          </div>
        </div>
      }
    >
      <div className="space-y-4">
        {/* Preferencias */}
        {showPreferences && preferences && (
          <Card padding="md" className="mb-4">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-[#F1F5F9]">
                Preferencias de Notificaciones
              </h3>

              {/* Habilitar/deshabilitar notificaciones */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Smartphone className="w-4 h-4 text-gray-600 dark:text-[#94A3B8]" />
                    <span className="text-sm text-gray-900 dark:text-[#F1F5F9]">
                      Notificaciones Push
                    </span>
                  </div>
                  <button
                    onClick={() => handleUpdatePreferences({ pushEnabled: !preferences.pushEnabled })}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      preferences.pushEnabled ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        preferences.pushEnabled ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-gray-600 dark:text-[#94A3B8]" />
                    <span className="text-sm text-gray-900 dark:text-[#F1F5F9]">
                      Notificaciones por Email
                    </span>
                  </div>
                  <button
                    onClick={() => handleUpdatePreferences({ emailEnabled: !preferences.emailEnabled })}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      preferences.emailEnabled ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        preferences.emailEnabled ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              </div>

              {/* Horas silenciosas */}
              <div className="pt-3 border-t border-gray-200 dark:border-[#334155]">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-gray-600 dark:text-[#94A3B8]" />
                    <span className="text-sm text-gray-900 dark:text-[#F1F5F9]">
                      Horas Silenciosas
                    </span>
                  </div>
                  <button
                    onClick={() => handleUpdatePreferences({
                      quietHours: {
                        ...preferences.quietHours,
                        enabled: !preferences.quietHours?.enabled
                      }
                    })}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      preferences.quietHours?.enabled ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        preferences.quietHours?.enabled ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
                {preferences.quietHours?.enabled && (
                  <div className="flex items-center gap-2 mt-2">
                    <input
                      type="time"
                      value={preferences.quietHours.start}
                      onChange={(e) => handleUpdatePreferences({
                        quietHours: {
                          ...preferences.quietHours!,
                          start: e.target.value
                        }
                      })}
                      className="text-sm border border-gray-300 dark:border-[#334155] rounded px-2 py-1 bg-white dark:bg-[#1E1E2E] text-gray-900 dark:text-[#F1F5F9]"
                    />
                    <span className="text-sm text-gray-600 dark:text-[#94A3B8]">-</span>
                    <input
                      type="time"
                      value={preferences.quietHours.end}
                      onChange={(e) => handleUpdatePreferences({
                        quietHours: {
                          ...preferences.quietHours!,
                          end: e.target.value
                        }
                      })}
                      className="text-sm border border-gray-300 dark:border-[#334155] rounded px-2 py-1 bg-white dark:bg-[#1E1E2E] text-gray-900 dark:text-[#F1F5F9]"
                    />
                  </div>
                )}
              </div>
            </div>
          </Card>
        )}

        {/* Lista de notificaciones */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className={`animate-spin ${ds.radius.full} h-8 w-8 border-b-2 ${ds.color.primaryBg}`}></div>
          </div>
        ) : notifications.length === 0 ? (
          <div className="text-center py-12">
            <BellOff className="w-12 h-12 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-[#94A3B8]">
              No hay notificaciones
            </p>
          </div>
        ) : (
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-4 rounded-lg border transition-colors ${
                  notification.read
                    ? 'bg-gray-50 dark:bg-[#1E1E2E] border-gray-200 dark:border-[#334155]'
                    : `${getNotificationColor(notification.priority)} border-transparent`
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 flex-1">
                    <div className={`mt-0.5 ${notification.read ? 'text-gray-400' : 'text-blue-600 dark:text-blue-400'}`}>
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className={`text-sm font-semibold ${
                          notification.read
                            ? 'text-gray-600 dark:text-[#94A3B8]'
                            : 'text-gray-900 dark:text-[#F1F5F9]'
                        }`}>
                          {notification.title}
                        </h4>
                        {!notification.read && (
                          <span className="w-2 h-2 bg-blue-600 dark:bg-blue-400 rounded-full"></span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 dark:text-[#94A3B8] mb-2">
                        {notification.message}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-500">
                        <span>
                          {new Date(notification.createdAt).toLocaleString()}
                        </span>
                        {notification.leadName && (
                          <>
                            <span>•</span>
                            <span>{notification.leadName}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    {!notification.read && (
                      <button
                        onClick={() => handleMarkAsRead(notification.id)}
                        className="p-1 hover:bg-gray-200 dark:hover:bg-[#334155] rounded"
                        title="Marcar como leída"
                      >
                        <Check className="w-4 h-4 text-gray-600 dark:text-[#94A3B8]" />
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(notification.id)}
                      className="p-1 hover:bg-gray-200 dark:hover:bg-[#334155] rounded"
                      title="Eliminar"
                    >
                      <X className="w-4 h-4 text-gray-600 dark:text-[#94A3B8]" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Modal>
  );
};

