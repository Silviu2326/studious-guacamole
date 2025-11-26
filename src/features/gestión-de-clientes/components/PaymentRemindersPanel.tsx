import React, { useState, useEffect } from 'react';
import { Card, Button, Badge } from '../../../components/componentsreutilizables';
import {
  PaymentReminder,
  PaymentReminderSettings,
  PaymentReminderStats,
  ReminderChannel,
} from '../types/payment-reminders';
import {
  getPaymentReminders,
  getPaymentReminderStats,
  getPaymentReminderSettings,
  updatePaymentReminderSettings,
  sendPaymentReminder,
  sendAutomaticReminders,
  markReminderAsPaid,
} from '../api/payment-reminders';
import {
  Bell,
  Mail,
  MessageSquare,
  Phone,
  Send,
  Settings,
  CheckCircle,
  AlertCircle,
  Clock,
  DollarSign,
  Calendar,
  Loader2,
  RefreshCw,
  TrendingUp,
} from 'lucide-react';

interface PaymentRemindersPanelProps {
  role: 'entrenador' | 'gimnasio';
  userId?: string;
}

export const PaymentRemindersPanel: React.FC<PaymentRemindersPanelProps> = ({
  role,
  userId,
}) => {
  const [reminders, setReminders] = useState<PaymentReminder[]>([]);
  const [stats, setStats] = useState<PaymentReminderStats | null>(null);
  const [settings, setSettings] = useState<PaymentReminderSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [filter, setFilter] = useState<'all' | 'pending' | 'sent' | 'overdue'>('all');
  const [sending, setSending] = useState(false);

  useEffect(() => {
    loadData();
  }, [role, userId, filter]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [remindersData, statsData, settingsData] = await Promise.all([
        getPaymentReminders(role, userId, filter !== 'all' ? { status: filter } : undefined),
        getPaymentReminderStats(role, userId),
        getPaymentReminderSettings(role, userId),
      ]);
      setReminders(remindersData);
      setStats(statsData);
      setSettings(settingsData);
    } catch (error) {
      console.error('Error cargando recordatorios:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSendReminder = async (reminderId: string) => {
    if (!settings) return;
    
    setSending(true);
    try {
      await sendPaymentReminder({
        reminderId,
        channels: settings.channels,
      });
      await loadData();
    } catch (error) {
      console.error('Error enviando recordatorio:', error);
      alert('Error al enviar el recordatorio');
    } finally {
      setSending(false);
    }
  };

  const handleSendAllAutomatic = async () => {
    if (!confirm('¿Enviar recordatorios automáticos a todos los clientes con cuotas por vencer?')) {
      return;
    }
    
    setSending(true);
    try {
      const result = await sendAutomaticReminders(role, userId);
      alert(`Se enviaron ${result.sent} recordatorios. ${result.failed > 0 ? `${result.failed} fallaron.` : ''}`);
      await loadData();
    } catch (error) {
      console.error('Error enviando recordatorios automáticos:', error);
      alert('Error al enviar recordatorios automáticos');
    } finally {
      setSending(false);
    }
  };

  const handleMarkAsPaid = async (reminderId: string) => {
    try {
      await markReminderAsPaid(reminderId);
      await loadData();
    } catch (error) {
      console.error('Error marcando como pagado:', error);
      alert('Error al marcar como pagado');
    }
  };

  const getStatusBadge = (status: PaymentReminder['status']) => {
    const badges = {
      pending: <Badge variant="yellow">Pendiente</Badge>,
      sent: <Badge variant="blue">Enviado</Badge>,
      paid: <Badge variant="success">Pagado</Badge>,
      overdue: <Badge variant="destructive">Vencido</Badge>,
      cancelled: <Badge variant="secondary">Cancelado</Badge>,
    };
    return badges[status] || badges.pending;
  };

  const getReminderTypeBadge = (type: PaymentReminder['reminderType']) => {
    const badges = {
      upcoming: <Badge variant="blue">Próximo</Badge>,
      'due-today': <Badge variant="yellow">Vence Hoy</Badge>,
      overdue: <Badge variant="destructive">Vencido</Badge>,
    };
    return badges[type];
  };

  const getChannelIcon = (channel: ReminderChannel) => {
    const icons = {
      email: <Mail className="w-4 h-4" />,
      sms: <MessageSquare className="w-4 h-4" />,
      whatsapp: <MessageSquare className="w-4 h-4" />,
      push: <Bell className="w-4 h-4" />,
    };
    return icons[channel] || <Mail className="w-4 h-4" />;
  };

  if (loading) {
    return (
      <Card className="p-8 text-center">
        <Loader2 className="w-8 h-8 mx-auto text-blue-500 animate-spin mb-4" />
        <p className="text-gray-600">Cargando recordatorios...</p>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Estadísticas */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pendientes</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalPending}</p>
              </div>
              <Clock className="w-8 h-8 text-yellow-500" />
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Vencidos</p>
                <p className="text-2xl font-bold text-red-600">{stats.totalOverdue}</p>
              </div>
              <AlertCircle className="w-8 h-8 text-red-500" />
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Vencen Esta Semana</p>
                <p className="text-2xl font-bold text-orange-600">{stats.upcomingThisWeek}</p>
              </div>
              <Calendar className="w-8 h-8 text-orange-500" />
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Vencen Hoy</p>
                <p className="text-2xl font-bold text-blue-600">{stats.upcomingToday}</p>
              </div>
              <Bell className="w-8 h-8 text-blue-500" />
            </div>
          </Card>
        </div>
      )}

      {/* Acciones */}
      <Card className="p-4">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <Button
              variant={filter === 'all' ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => setFilter('all')}
            >
              Todos
            </Button>
            <Button
              variant={filter === 'pending' ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => setFilter('pending')}
            >
              Pendientes
            </Button>
            <Button
              variant={filter === 'overdue' ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => setFilter('overdue')}
            >
              Vencidos
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              leftIcon={<RefreshCw className="w-4 h-4" />}
              onClick={loadData}
            >
              Actualizar
            </Button>
            <Button
              variant="primary"
              size="sm"
              leftIcon={<Send className="w-4 h-4" />}
              onClick={handleSendAllAutomatic}
              loading={sending}
            >
              Enviar Automáticos
            </Button>
            <Button
              variant="ghost"
              size="sm"
              leftIcon={<Settings className="w-4 h-4" />}
              onClick={() => setShowSettings(!showSettings)}
            >
              Configuración
            </Button>
          </div>
        </div>
      </Card>

      {/* Configuración */}
      {showSettings && settings && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Configuración de Recordatorios</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Días antes del vencimiento para enviar recordatorios
              </label>
              <input
                type="text"
                value={settings.reminderDays.join(', ')}
                onChange={(e) => {
                  const days = e.target.value.split(',').map(d => parseInt(d.trim())).filter(d => !isNaN(d));
                  updatePaymentReminderSettings(role, userId, { reminderDays: days }).then(setSettings);
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                placeholder="7, 3, 1"
              />
              <p className="text-xs text-gray-500 mt-1">
                Separar por comas (ej: 7, 3, 1 = 7 días antes, 3 días antes, 1 día antes)
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Canales habilitados
              </label>
              <div className="flex gap-4">
                {(['email', 'sms', 'whatsapp', 'push'] as ReminderChannel[]).map((channel) => (
                  <label key={channel} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={settings.channels.includes(channel)}
                      onChange={(e) => {
                        const newChannels = e.target.checked
                          ? [...settings.channels, channel]
                          : settings.channels.filter(c => c !== channel);
                        updatePaymentReminderSettings(role, userId, { channels: newChannels }).then(setSettings);
                      }}
                      className="rounded"
                    />
                    <span className="text-sm capitalize">{channel}</span>
                  </label>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Horario preferido
              </label>
              <input
                type="time"
                value={settings.preferredTime}
                onChange={(e) => {
                  updatePaymentReminderSettings(role, userId, { preferredTime: e.target.value }).then(setSettings);
                }}
                className="px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>
          </div>
        </Card>
      )}

      {/* Lista de Recordatorios */}
      <Card className="p-0">
        <div className="p-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold">Recordatorios de Pago</h3>
        </div>
        <div className="divide-y divide-gray-200">
          {reminders.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <Bell className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <p>No hay recordatorios pendientes</p>
            </div>
          ) : (
            reminders.map((reminder) => (
              <div key={reminder.id} className="p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="font-semibold text-gray-900">{reminder.clientName}</h4>
                      {getStatusBadge(reminder.status)}
                      {getReminderTypeBadge(reminder.reminderType)}
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                      <div>
                        <span className="font-medium">Plan:</span> {reminder.planName}
                      </div>
                      <div>
                        <span className="font-medium">Monto:</span> {reminder.amount.toFixed(2)}€
                      </div>
                      <div>
                        <span className="font-medium">Vence:</span>{' '}
                        {new Date(reminder.dueDate).toLocaleDateString('es-ES')}
                      </div>
                      <div>
                        <span className="font-medium">Días:</span>{' '}
                        {reminder.daysUntilDue > 0
                          ? `${reminder.daysUntilDue} días`
                          : reminder.daysUntilDue === 0
                          ? 'Hoy'
                          : `Hace ${Math.abs(reminder.daysUntilDue)} días`}
                      </div>
                    </div>
                    {reminder.channels.length > 0 && (
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-xs text-gray-500">Canales:</span>
                        {reminder.channels.map((channel) => (
                          <span key={channel} className="flex items-center gap-1 text-xs text-gray-600">
                            {getChannelIcon(channel)}
                            <span className="capitalize">{channel}</span>
                          </span>
                        ))}
                      </div>
                    )}
                    {reminder.sentAt && (
                      <p className="text-xs text-gray-500 mt-2">
                        Enviado: {new Date(reminder.sentAt).toLocaleString('es-ES')}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    {reminder.status === 'pending' || reminder.status === 'overdue' ? (
                      <Button
                        variant="primary"
                        size="sm"
                        leftIcon={<Send className="w-4 h-4" />}
                        onClick={() => handleSendReminder(reminder.id)}
                        loading={sending}
                      >
                        Enviar
                      </Button>
                    ) : null}
                    {reminder.status === 'sent' && (
                      <Button
                        variant="primary"
                        size="sm"
                        leftIcon={<CheckCircle className="w-4 h-4" />}
                        onClick={() => handleMarkAsPaid(reminder.id)}
                      >
                        Marcar Pagado
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </Card>
    </div>
  );
};

