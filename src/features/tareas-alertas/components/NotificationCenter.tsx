import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { Card, Button, Badge } from '../../../components/componentsreutilizables';
import { Notification, Alert, AlertType, NotificationItem, CreateTaskData, AlertFilters } from '../types';
import { 
  getNotifications, 
  markNotificationAsRead, 
  markAllNotificationsAsRead, 
  getUnreadNotificationsCount,
  getAlerts, 
  markAlertAsRead, 
  markAllAlertsAsRead, 
  markAlertsAsRead, 
  getUnreadAlertsCount,
  getPriorityColor, 
  getPriorityLabel,
  createTask 
} from '../api';
import { Bell, CheckCircle2, Clock, AlertTriangle, Loader2, AlertCircle, ExternalLink, X, CheckSquare2, Square, User, UserPlus, ArrowRight, ChevronDown, ChevronUp } from 'lucide-react';
import { AlertQuickActions } from './AlertQuickActions';
import { TaskCreator } from './TaskCreator';

interface NotificationCenterProps {
  role: 'entrenador' | 'gimnasio';
  alerts?: Alert[]; // Si se proporciona, usa estas alertas en lugar de cargarlas
  notifications?: Notification[]; // Si se proporciona, usa estas notificaciones en lugar de cargarlas
}

export const NotificationCenter: React.FC<NotificationCenterProps> = ({ 
  role, 
  alerts: providedAlerts,
  notifications: providedNotifications,
}) => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>(providedNotifications || []);
  const [alerts, setAlerts] = useState<Alert[]>(providedAlerts || []);
  const [unreadNotificationsCount, setUnreadNotificationsCount] = useState(0);
  const [unreadAlertsCount, setUnreadAlertsCount] = useState(0);
  const [loading, setLoading] = useState(!providedAlerts || !providedNotifications);
  const [activeTab, setActiveTab] = useState<'all' | 'unread' | 'alerts' | 'notifications'>('unread');
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [selectedAlertIds, setSelectedAlertIds] = useState<Set<string>>(new Set());
  const [showTaskCreator, setShowTaskCreator] = useState(false);
  const [taskCreatorInitialData, setTaskCreatorInitialData] = useState<Partial<CreateTaskData> | undefined>(undefined);
  const [expandedCards, setExpandedCards] = useState<Set<string>>(new Set());

  // Si se proporcionan datos, usarlos directamente
  const displayAlerts = providedAlerts || alerts;
  const displayNotifications = providedNotifications || notifications;

  useEffect(() => {
    if (!providedAlerts || !providedNotifications) {
      loadData();
    } else {
      // Si se proporcionan datos, calcular contadores
      setUnreadAlertsCount(displayAlerts.filter(a => !a.isRead).length);
      setUnreadNotificationsCount(displayNotifications.filter(n => !n.isRead).length);
      setLoading(false);
    }
    // Limpiar selección al cambiar de pestaña
    setSelectedAlertIds(new Set());
  }, [activeTab, role, user?.id, providedAlerts, providedNotifications]);

  const loadData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        loadNotifications(),
        loadAlerts(),
        loadUnreadCounts(),
      ]);
    } finally {
      setLoading(false);
    }
  };

  const loadNotifications = async () => {
    try {
      const isRead = activeTab === 'unread' ? false : undefined;
      const data = await getNotifications(isRead);
      setNotifications(data);
    } catch (error) {
      console.error('Error cargando notificaciones:', error);
    }
  };

  const loadAlerts = async () => {
    try {
      const filters: AlertFilters = {
        role,
        ...(activeTab === 'unread' ? { isRead: false } : {}),
      };
      const data = await getAlerts(filters);
      setAlerts(data);
    } catch (error) {
      console.error('Error cargando alertas:', error);
    }
  };

  const loadUnreadCounts = async () => {
    try {
      const [notificationsCount, alertsCount] = await Promise.all([
        getUnreadNotificationsCount(),
        getUnreadAlertsCount({ role }),
      ]);
      setUnreadNotificationsCount(notificationsCount);
      setUnreadAlertsCount(alertsCount);
    } catch (error) {
      console.error('Error cargando contadores:', error);
    }
  };

  const handleMarkNotificationAsRead = async (id: string) => {
    try {
      await markNotificationAsRead(id);
      if (!providedNotifications) {
        loadData();
      } else {
        // Si se proporcionaron notificaciones, actualizar estado local
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
        setUnreadNotificationsCount(prev => Math.max(0, prev - 1));
      }
    } catch (error) {
      console.error('Error marcando notificación:', error);
    }
  };

  const handleMarkAlertAsRead = async (id: string) => {
    try {
      await markAlertAsRead(id);
      if (!providedAlerts) {
        loadData();
      } else {
        // Si se proporcionaron alertas, actualizar estado local
        setAlerts(prev => prev.map(a => a.id === id ? { ...a, isRead: true } : a));
        setUnreadAlertsCount(prev => Math.max(0, prev - 1));
      }
    } catch (error) {
      console.error('Error marcando alerta:', error);
    }
  };

  const handleAlertUpdated = (updatedAlert: Alert) => {
    if (!providedAlerts) {
      loadData();
    } else {
      setAlerts(prev => prev.map(a => a.id === updatedAlert.id ? updatedAlert : a));
      if (updatedAlert.isRead) {
        setUnreadAlertsCount(prev => Math.max(0, prev - 1));
      }
    }
  };

  const handleShowToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleTaskCreated = () => {
    // Recargar datos si es necesario
    if (!providedAlerts) {
      loadData();
    }
  };

  const handleOpenTaskCreator = (alert?: Alert) => {
    if (alert) {
      // Prellenar datos desde la alerta
      setTaskCreatorInitialData({
        title: alert.title,
        description: alert.message,
        priority: alert.priority,
        relatedEntityId: alert.relatedEntityId,
        relatedEntityType: alert.relatedEntityType,
      });
    } else {
      setTaskCreatorInitialData(undefined);
    }
    setShowTaskCreator(true);
  };

  const handleCreateTask = async (data: CreateTaskData) => {
    try {
      await createTask(data);
      setShowTaskCreator(false);
      setTaskCreatorInitialData(undefined);
      handleShowToast('Tarea creada exitosamente', 'success');
      handleTaskCreated();
    } catch (error) {
      console.error('Error creando tarea:', error);
      handleShowToast('Error al crear la tarea', 'error');
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await Promise.all([
        markAllNotificationsAsRead(),
        markAllAlertsAsRead({ role }),
      ]);
      if (!providedAlerts || !providedNotifications) {
        loadData();
      } else {
        // Si se proporcionaron datos, actualizar estado local
        setAlerts(prev => prev.map(a => ({ ...a, isRead: true })));
        setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
        setUnreadAlertsCount(0);
        setUnreadNotificationsCount(0);
      }
    } catch (error) {
      console.error('Error marcando todas como leídas:', error);
    }
  };

  // Funciones para manejar selección múltiple
  const handleToggleAlertSelection = (alertId: string) => {
    setSelectedAlertIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(alertId)) {
        newSet.delete(alertId);
      } else {
        newSet.add(alertId);
      }
      return newSet;
    });
  };

  const handleSelectAllAlerts = () => {
    // Obtener solo las alertas no leídas del listado actual
    const unreadAlerts = unifiedItems.filter(item => 
      item.type === 'alert' && !item.isRead
    );
    
    if (unreadAlerts.length === 0) return;

    const allUnreadAlertIds = new Set(
      unreadAlerts.map(item => {
        // Extraer el ID real de la alerta (puede tener prefijo 'alert-')
        return item.id.startsWith('alert-') 
          ? item.id.replace('alert-', '') 
          : item.id;
      })
    );

    // Si todas están seleccionadas, deseleccionar todas; si no, seleccionar todas
    const allSelected = Array.from(allUnreadAlertIds).every(id => selectedAlertIds.has(id));
    
    if (allSelected) {
      setSelectedAlertIds(new Set());
    } else {
      setSelectedAlertIds(allUnreadAlertIds);
    }
  };

  const handleMarkSelectedAsRead = async () => {
    if (selectedAlertIds.size === 0) return;

    try {
      const idsArray = Array.from(selectedAlertIds);
      await markAlertsAsRead(idsArray);
      
      if (!providedAlerts) {
        loadData();
      } else {
        // Si se proporcionaron alertas, actualizar estado local
        setAlerts(prev => prev.map(a => 
          selectedAlertIds.has(a.id) ? { ...a, isRead: true } : a
        ));
        const updatedCount = Array.from(selectedAlertIds).filter(id => 
          displayAlerts.find(a => a.id === id && !a.isRead)
        ).length;
        setUnreadAlertsCount(prev => Math.max(0, prev - updatedCount));
      }

      // Limpiar selección
      setSelectedAlertIds(new Set());
      
      // Mostrar toast de confirmación
      handleShowToast(
        `${idsArray.length} ${idsArray.length === 1 ? 'alerta marcada' : 'alertas marcadas'} como leída${idsArray.length === 1 ? '' : 's'}`,
        'success'
      );
    } catch (error) {
      console.error('Error marcando alertas seleccionadas:', error);
      handleShowToast('Error al marcar las alertas como leídas', 'error');
    }
  };

  const getAlertIcon = (type: AlertType) => {
    switch (type) {
      case 'pago-pendiente':
      case 'factura-vencida':
        return <AlertCircle className="w-5 h-5 text-red-600" />;
      case 'check-in-faltante':
      case 'lead-sin-seguimiento':
        return <Bell className="w-5 h-5 text-orange-600" />;
      case 'equipo-roto':
      case 'aforo-superado':
        return <AlertCircle className="w-5 h-5 text-yellow-600" />;
      default:
        return <Bell className="w-5 h-5 text-blue-600" />;
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

  const getAlertTypeLabel = (type: AlertType): string => {
    const labels: Record<AlertType, string> = {
      'pago-pendiente': 'Pago Pendiente',
      'check-in-faltante': 'Check-in Faltante',
      'lead-sin-seguimiento': 'Lead Sin Seguimiento',
      'factura-vencida': 'Factura Vencida',
      'equipo-roto': 'Equipo Roto',
      'aforo-superado': 'Aforo Superado',
      'mantenimiento': 'Mantenimiento',
      'tarea-critica': 'Tarea Crítica',
      'recordatorio': 'Recordatorio',
    };
    return labels[type] || type;
  };

  const getEntityBadge = (entityType?: 'client' | 'lead' | 'other') => {
    if (!entityType || entityType === 'other') return null;
    
    if (entityType === 'client') {
      return (
        <Badge className="bg-blue-100 text-blue-800 border-blue-200 text-xs flex items-center gap-1">
          <User className="w-3 h-3" />
          <span>Cliente</span>
        </Badge>
      );
    }
    
    if (entityType === 'lead') {
      return (
        <Badge className="bg-purple-100 text-purple-800 border-purple-200 text-xs flex items-center gap-1">
          <UserPlus className="w-3 h-3" />
          <span>Lead</span>
        </Badge>
      );
    }
    
    return null;
  };

  // Función auxiliar para verificar si una alerta está pospuesta y aún no ha llegado su hora
  const isSnoozed = (alert: Alert): boolean => {
    if (!alert.snoozedUntil) return false;
    const snoozedUntil = new Date(alert.snoozedUntil);
    return snoozedUntil > new Date();
  };

  // Función auxiliar para obtener alertas activas (no pospuestas o ya pasó su hora de posponer)
  const getActiveAlerts = (alerts: Alert[]): Alert[] => {
    return alerts.filter(alert => !isSnoozed(alert));
  };

  // Función auxiliar para obtener alertas pospuestas
  const getSnoozedAlerts = (alerts: Alert[]): Alert[] => {
    return alerts.filter(alert => isSnoozed(alert));
  };

  // Unificar alertas y notificaciones en NotificationItem
  const getUnifiedItems = (): NotificationItem[] => {
    const items: NotificationItem[] = [];

    // Filtrar alertas activas (no pospuestas o ya pasó su hora)
    const activeAlerts = getActiveAlerts(displayAlerts);

    if (activeTab === 'alerts') {
      activeAlerts.forEach(alert => {
        items.push({
          id: alert.id,
          type: 'alert',
          title: alert.title,
          message: alert.message,
          priority: alert.priority,
          isRead: alert.isRead,
          createdAt: alert.createdAt,
          actionUrl: alert.actionUrl,
          alertType: alert.type,
          relatedEntityId: alert.relatedEntityId,
          relatedEntityType: alert.relatedEntityType,
          entityType: alert.entityType,
          userId: alert.userId,
          role: alert.role,
        });
      });
    } else if (activeTab === 'notifications') {
      displayNotifications.forEach(notif => {
        items.push({
          id: notif.id,
          type: 'notification',
          title: notif.title,
          message: notif.message,
          priority: notif.priority,
          isRead: notif.isRead,
          createdAt: notif.createdAt,
          actionUrl: notif.actionUrl,
          notificationType: notif.type,
          scheduledFor: notif.scheduledFor,
        });
      });
    } else {
      // Mostrar ambos (all o unread)
      activeAlerts.forEach(alert => {
        items.push({
          id: `alert-${alert.id}`,
          type: 'alert',
          title: alert.title,
          message: alert.message,
          priority: alert.priority,
          isRead: alert.isRead,
          createdAt: alert.createdAt,
          actionUrl: alert.actionUrl,
          alertType: alert.type,
          relatedEntityId: alert.relatedEntityId,
          relatedEntityType: alert.relatedEntityType,
          entityType: alert.entityType,
          userId: alert.userId,
          role: alert.role,
        });
      });
      displayNotifications.forEach(notif => {
        items.push({
          id: `notif-${notif.id}`,
          type: 'notification',
          title: notif.title,
          message: notif.message,
          priority: notif.priority,
          isRead: notif.isRead,
          createdAt: notif.createdAt,
          actionUrl: notif.actionUrl,
          notificationType: notif.type,
          scheduledFor: notif.scheduledFor,
        });
      });
    }

    // Ordenar por prioridad y fecha (más recientes primero)
    return items.sort((a, b) => {
      const priorityOrder = { alta: 3, media: 2, baja: 1 };
      const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority];
      if (priorityDiff !== 0) return priorityDiff;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  };

  const unifiedItems = getUnifiedItems();
  const totalUnread = unreadAlertsCount + unreadNotificationsCount;

  if (loading) {
    return (
      <Card className="p-8 text-center bg-white shadow-sm">
        <Loader2 size={48} className="mx-auto text-blue-500 animate-spin mb-4" />
        <p className="text-gray-600">Cargando...</p>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toast && (
        <div className={`fixed top-4 right-4 z-50 animate-in slide-in-from-right-full fade-in duration-300`}>
          <div className={`flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg border ${
            toast.type === 'success' 
              ? 'bg-green-50 border-green-200 text-green-800' 
              : 'bg-red-50 border-red-200 text-red-800'
          }`}>
            {toast.type === 'success' ? (
              <CheckCircle2 size={20} className="text-green-600" />
            ) : (
              <AlertCircle size={20} className="text-red-600" />
            )}
            <p className="text-sm font-medium">{toast.message}</p>
            <button 
              onClick={() => setToast(null)}
              className="ml-2 p-1 hover:bg-black/5 rounded-full transition-colors"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      )}

      <Card className="bg-white shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Bell className="w-5 h-5 text-gray-600" />
            <h3 className="text-lg font-semibold text-gray-900">
              Centro de Notificaciones
            </h3>
            {totalUnread > 0 && (
              <Badge className="bg-red-100 text-red-800 border-red-200">
                {totalUnread} sin leer
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-2">
            {selectedAlertIds.size > 0 && (
              <Button 
                variant="default" 
                size="sm" 
                onClick={handleMarkSelectedAsRead}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <CheckCircle2 className="w-4 h-4 mr-2" />
                Marcar seleccionadas como leídas ({selectedAlertIds.size})
              </Button>
            )}
            {unifiedItems.length > 0 && (activeTab === 'unread' || activeTab === 'all') && (
              <Button variant="ghost" size="sm" onClick={handleMarkAllAsRead}>
                Marcar todas como leídas
              </Button>
            )}
          </div>
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
                <span>Sin Leer ({totalUnread})</span>
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
              <button
                onClick={() => setActiveTab('alerts')}
                className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all ${
                  activeTab === 'alerts'
                    ? 'bg-white text-slate-900 shadow-sm ring-1 ring-slate-200'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/70'
                }`}
                role="tab"
                aria-selected={activeTab === 'alerts'}
              >
                <AlertCircle size={18} className={activeTab === 'alerts' ? 'opacity-100' : 'opacity-70'} />
                <span>Alertas ({unreadAlertsCount})</span>
              </button>
              <button
                onClick={() => setActiveTab('notifications')}
                className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all ${
                  activeTab === 'notifications'
                    ? 'bg-white text-slate-900 shadow-sm ring-1 ring-slate-200'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/70'
                }`}
                role="tab"
                aria-selected={activeTab === 'notifications'}
              >
                <Bell size={18} className={activeTab === 'notifications' ? 'opacity-100' : 'opacity-70'} />
                <span>Notificaciones ({unreadNotificationsCount})</span>
              </button>
            </div>
          </div>
        </Card>

        <div className="space-y-4">
          {unifiedItems.length === 0 ? (
            <Card className="p-8 text-center bg-white shadow-sm">
              <CheckCircle2 size={48} className="mx-auto text-green-500 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No hay {activeTab === 'alerts' ? 'alertas' : activeTab === 'notifications' ? 'notificaciones' : 'elementos'} {activeTab === 'unread' ? 'sin leer' : ''}
              </h3>
              <p className="text-gray-600">
                {activeTab === 'unread' 
                  ? 'Todas las alertas y notificaciones están leídas'
                  : `No hay ${activeTab === 'alerts' ? 'alertas' : activeTab === 'notifications' ? 'notificaciones' : 'elementos'} disponibles`}
              </p>
            </Card>
          ) : (
            <>
              {/* Header con checkbox "Seleccionar todo" - solo para alertas */}
              {unifiedItems.some(item => item.type === 'alert' && !item.isRead) && (
                <div className="flex items-center gap-3 px-4 py-2 bg-gray-50 rounded-lg border border-gray-200">
                  <button
                    onClick={handleSelectAllAlerts}
                    className="flex items-center gap-2 text-sm text-gray-700 hover:text-gray-900 transition-colors"
                    aria-label="Seleccionar todas las alertas no leídas"
                  >
                    {(() => {
                      const unreadAlerts = unifiedItems.filter(item => 
                        item.type === 'alert' && !item.isRead
                      );
                      const unreadAlertIds = unreadAlerts.map(item => 
                        item.id.startsWith('alert-') ? item.id.replace('alert-', '') : item.id
                      );
                      const allSelected = unreadAlertIds.length > 0 && 
                        unreadAlertIds.every(id => selectedAlertIds.has(id));
                      
                      return allSelected ? (
                        <CheckSquare2 className="w-5 h-5 text-blue-600" />
                      ) : (
                        <Square className="w-5 h-5 text-gray-400" />
                      );
                    })()}
                    <span className="font-medium">
                      Seleccionar todas las alertas no leídas
                    </span>
                  </button>
                </div>
              )}
              {unifiedItems.map((item) => {
                // Determinar si es una alerta y obtener su ID real
                const isAlert = item.type === 'alert';
                const alertId = isAlert 
                  ? (item.id.startsWith('alert-') ? item.id.replace('alert-', '') : item.id)
                  : null;
                const isSelected = alertId ? selectedAlertIds.has(alertId) : false;
                const isExpanded = expandedCards.has(item.id);
                
                // Obtener entityType de la alerta si existe (primero del item, luego de la alerta)
                const alert = isAlert && alertId ? displayAlerts.find(a => a.id === alertId) : null;
                const entityType = item.entityType || alert?.entityType;
                
                return (
              <div
                key={item.id}
                className={`rounded-xl border transition-all ${
                  item.isRead
                    ? 'bg-slate-50 border-slate-200 opacity-75'
                    : 'bg-blue-50 border-blue-200 ring-1 ring-blue-100'
                } ${isSelected ? 'ring-2 ring-blue-500 border-blue-400' : ''} ${
                  isExpanded ? 'md:p-5 p-3' : 'md:p-5 p-3'
                }`}
              >
                <div className="flex items-start gap-3 relative">
                  {/* Badge en esquina superior derecha - móvil y desktop */}
                  <div className="absolute top-2 right-2 md:relative md:top-0 md:right-0 md:ml-auto flex items-center gap-2 z-10">
                    {!item.isRead && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (item.type === 'alert') {
                            const alertId = item.id.startsWith('alert-') 
                              ? item.id.replace('alert-', '') 
                              : item.id;
                            handleMarkAlertAsRead(alertId);
                          } else {
                            const notifId = item.id.startsWith('notif-') 
                              ? item.id.replace('notif-', '') 
                              : item.id;
                            handleMarkNotificationAsRead(notifId);
                          }
                        }}
                        title="Marcar como leída"
                        className="min-h-[44px] min-w-[44px] p-2 md:min-h-0 md:min-w-0"
                      >
                        <CheckCircle2 className="w-5 h-5 md:w-4 md:h-4" />
                      </Button>
                    )}
                    {/* Badge de prioridad siempre visible en esquina superior derecha */}
                    <Badge className={getPriorityColor(item.priority)}>
                      {getPriorityLabel(item.priority)}
                    </Badge>
                  </div>

                  {/* Checkbox para seleccionar alertas */}
                  {isAlert && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        alertId && handleToggleAlertSelection(alertId);
                      }}
                      className="mt-1 flex-shrink-0 min-h-[44px] min-w-[44px] flex items-center justify-center md:min-h-0 md:min-w-0"
                      aria-label={isSelected ? 'Deseleccionar alerta' : 'Seleccionar alerta'}
                    >
                      {isSelected ? (
                        <CheckSquare2 className="w-6 h-6 md:w-5 md:h-5 text-blue-600" />
                      ) : (
                        <Square className="w-6 h-6 md:w-5 md:h-5 text-gray-400 hover:text-gray-600" />
                      )}
                    </button>
                  )}
                  {item.type === 'alert' && item.alertType
                    ? getAlertIcon(item.alertType)
                    : item.notificationType
                    ? getNotificationIcon(item.notificationType)
                    : <Bell className="w-5 h-5 text-gray-600" />}
                  <div className="flex-1 min-w-0 pr-16 md:pr-0">
                    {/* Título - compacto en móvil */}
                    <div className="flex items-start justify-between gap-2 mb-1 md:mb-2">
                      <h4 className={`text-base md:text-lg font-bold text-gray-900 ${item.isRead ? 'opacity-75' : ''} line-clamp-1 md:line-clamp-none`}>
                        {item.title}
                      </h4>
                      {/* Botón expandir/colapsar en móvil */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setExpandedCards(prev => {
                            const newSet = new Set(prev);
                            if (newSet.has(item.id)) {
                              newSet.delete(item.id);
                            } else {
                              newSet.add(item.id);
                            }
                            return newSet;
                          });
                        }}
                        className="md:hidden flex-shrink-0 min-h-[44px] min-w-[44px] flex items-center justify-center"
                        aria-label={isExpanded ? 'Colapsar' : 'Expandir'}
                      >
                        {isExpanded ? (
                          <ChevronUp className="w-5 h-5 text-gray-600" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-gray-600" />
                        )}
                      </button>
                    </div>
                    
                    {/* Descripción - siempre visible en desktop, expandible en móvil */}
                    <p className={`text-sm mb-2 md:mb-3 ${item.isRead ? 'text-gray-500' : 'text-gray-700'} ${
                      isExpanded ? 'line-clamp-none' : 'line-clamp-1'
                    } md:line-clamp-2`}>
                      {item.message}
                    </p>
                    
                    {/* Metadatos - ocultos en móvil cuando está colapsado */}
                    <div className={`flex items-center flex-wrap gap-2 md:gap-3 text-xs text-gray-500 ${
                      isExpanded ? '' : 'hidden md:flex'
                    }`}>
                      {getEntityBadge(entityType)}
                      {item.type === 'alert' && item.alertType && (
                        <>
                          <Badge className="bg-orange-100 text-orange-800 border-orange-200 text-xs">
                            Alerta
                          </Badge>
                          <span className="hidden sm:inline">{getAlertTypeLabel(item.alertType)}</span>
                          {(() => {
                            const alertId = item.id.startsWith('alert-') 
                              ? item.id.replace('alert-', '') 
                              : item.id;
                            const alert = displayAlerts.find(a => a.id === alertId);
                            if (alert && isSnoozed(alert)) {
                              const snoozedUntil = new Date(alert.snoozedUntil!);
                              return (
                                <Badge className="bg-purple-100 text-purple-800 border-purple-200 text-xs flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  <span className="hidden sm:inline">Pospuesta hasta {snoozedUntil.toLocaleString('es-ES', {
                                    day: '2-digit',
                                    month: 'short',
                                    hour: '2-digit',
                                    minute: '2-digit',
                                  })}</span>
                                </Badge>
                              );
                            }
                            return null;
                          })()}
                        </>
                      )}
                      {item.type === 'notification' && (
                        <Badge className="bg-blue-100 text-blue-800 border-blue-200 text-xs">
                          Notificación
                        </Badge>
                      )}
                      <span>
                        {new Date(item.createdAt).toLocaleDateString('es-ES', {
                          day: '2-digit',
                          month: 'short',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                      {item.actionUrl && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            window.open(item.actionUrl, '_blank');
                          }}
                          className="text-blue-600 hover:text-blue-700 flex items-center gap-1 min-h-[44px] px-2 md:min-h-0"
                        >
                          Ver detalles
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                    
                    {/* Acciones rápidas para alertas - ocultas en móvil cuando está colapsado */}
                    {item.type === 'alert' && item.alertType && (
                      <div className={`mt-3 ${isExpanded ? '' : 'hidden md:block'}`} onClick={(e) => e.stopPropagation()}>
                        {(() => {
                          const alertId = item.id.startsWith('alert-') 
                            ? item.id.replace('alert-', '') 
                            : item.id;
                          const alert = displayAlerts.find(a => a.id === alertId);
                          if (alert) {
                            return (
                              <AlertQuickActions
                                alert={alert}
                                onAlertUpdated={handleAlertUpdated}
                                onTaskCreated={handleTaskCreated}
                                onShowToast={handleShowToast}
                                onOpenTaskCreator={() => handleOpenTaskCreator(alert)}
                              />
                            );
                          }
                          return null;
                        })()}
                      </div>
                    )}
                  </div>
                </div>
              </div>
                );
              })}
            </>
          )}
        </div>

        {/* Sección de alertas pospuestas (opcional - comentada por defecto) */}
        {/* 
        {(() => {
          const snoozedAlerts = getSnoozedAlerts(displayAlerts);
          if (snoozedAlerts.length > 0 && (activeTab === 'all' || activeTab === 'alerts')) {
            return (
              <div className="mt-6">
                <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Alertas pospuestas ({snoozedAlerts.length})
                </h4>
                <div className="space-y-3">
                  {snoozedAlerts.map((alert) => {
                    const snoozedUntil = new Date(alert.snoozedUntil!);
                    return (
                      <div
                        key={alert.id}
                        className="p-3 rounded-lg border border-purple-200 bg-purple-50/50"
                      >
                        <div className="flex items-start gap-2">
                          {getAlertIcon(alert.type)}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <h5 className="font-medium text-gray-900 text-sm">{alert.title}</h5>
                              <Badge className="bg-purple-100 text-purple-800 border-purple-200 text-xs">
                                Pospuesta hasta {snoozedUntil.toLocaleString('es-ES', {
                                  day: '2-digit',
                                  month: 'short',
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })}
                              </Badge>
                            </div>
                            <p className="text-xs text-gray-600">{alert.message}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          }
          return null;
        })()}
        */}

        {/* 
        CÓDIGO PARA REACTIVACIÓN AUTOMÁTICA DE ALERTAS POSPUESTAS:
        
        Este código debería ejecutarse periódicamente (por ejemplo, cada minuto) 
        para verificar si alguna alerta pospuesta ya ha llegado a su hora y reactivarla.
        
        useEffect(() => {
          const checkSnoozedAlerts = () => {
            const now = new Date();
            displayAlerts.forEach(async (alert) => {
              if (alert.snoozedUntil) {
                const snoozedUntil = new Date(alert.snoozedUntil);
                // Si la hora de posponer ya pasó, limpiar el campo snoozedUntil
                if (snoozedUntil <= now) {
                  // En una implementación real, llamaríamos a una API para limpiar el snoozedUntil
                  // await clearSnooze(alert.id);
                  // Luego recargar los datos
                  if (!providedAlerts) {
                    loadData();
                  }
                }
              }
            });
          };

          // Verificar cada minuto
          const interval = setInterval(checkSnoozedAlerts, 60000);
          return () => clearInterval(interval);
        }, [displayAlerts, providedAlerts]);
        */}
      </Card>

      {/* Modal de creación de tarea */}
      {showTaskCreator && (
        <TaskCreator
          onClose={() => {
            setShowTaskCreator(false);
            setTaskCreatorInitialData(undefined);
          }}
          onCreate={handleCreateTask}
          role={role}
          initialData={taskCreatorInitialData}
        />
      )}
    </div>
  );
};

