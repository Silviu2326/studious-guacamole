import React, { useState, useMemo } from 'react';
import {
  LayoutDashboard,
  Play,
  Pause,
  Edit,
  Trash2,
  Filter,
  Search,
  Calendar,
  Users,
  TrendingUp,
  CheckCircle2,
  AlertCircle,
  Clock,
  XCircle,
} from 'lucide-react';
import { Card, Button, Badge } from '../../../components/componentsreutilizables';
import { ds } from '../../adherencia/ui/ds';
import {
  CentralAutomationsPanel,
  CentralizedAutomation,
  AutomationStatus,
  AutomationType,
} from '../types';

interface AutomationsCentralPanelProps {
  panel?: CentralAutomationsPanel;
  loading?: boolean;
  className?: string;
  onAutomationPause?: (automationId: string) => void;
  onAutomationResume?: (automationId: string) => void;
  onAutomationEdit?: (automation: CentralizedAutomation) => void;
  onAutomationDelete?: (automationId: string) => void;
  onViewDetails?: (automationId: string) => void;
}

const statusIcons = {
  active: <Play className="w-4 h-4" />,
  paused: <Pause className="w-4 h-4" />,
  finished: <CheckCircle2 className="w-4 h-4" />,
  draft: <Edit className="w-4 h-4" />,
  error: <AlertCircle className="w-4 h-4" />,
};

const statusColors = {
  active: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
  paused: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300',
  finished: 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300',
  draft: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
  error: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
};

const statusLabels: Record<AutomationStatus, string> = {
  active: 'Activa',
  paused: 'Pausada',
  finished: 'Finalizada',
  draft: 'Borrador',
  error: 'Error',
};

export const AutomationsCentralPanel: React.FC<AutomationsCentralPanelProps> = ({
  panel,
  loading = false,
  className = '',
  onAutomationPause,
  onAutomationResume,
  onAutomationEdit,
  onAutomationDelete,
  onViewDetails,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<AutomationStatus | 'all'>('all');
  const [typeFilter, setTypeFilter] = useState<AutomationType | 'all'>('all');

  if (loading) {
    return (
      <Card className={className}>
        <div className={`${ds.shimmer} h-64 rounded-2xl`} />
      </Card>
    );
  }

  if (!panel) {
    return (
      <Card className={className} padding="lg">
        <div className="text-center py-12">
          <LayoutDashboard className="w-12 h-12 text-slate-400 mx-auto mb-4" />
          <p className={`${ds.typography.body} ${ds.color.textSecondary} ${ds.color.textSecondaryDark}`}>
            No hay datos del panel disponibles
          </p>
        </div>
      </Card>
    );
  }

  const filteredAutomations = useMemo(() => {
    return panel.automations.filter((automation) => {
      const matchesSearch =
        searchQuery === '' ||
        automation.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        automation.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'all' || automation.status === statusFilter;
      const matchesType = typeFilter === 'all' || automation.type === typeFilter;
      return matchesSearch && matchesStatus && matchesType;
    });
  }, [panel.automations, searchQuery, statusFilter, typeFilter]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('es-ES', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <Card className={className} padding="lg">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-xl bg-indigo-100 dark:bg-indigo-900/40">
                <LayoutDashboard className="w-5 h-5 text-indigo-600 dark:text-indigo-300" />
              </div>
              <h2 className={`${ds.typography.h2} ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
                Panel Centralizado de Automatizaciones
              </h2>
            </div>
            <p className={`${ds.typography.bodySmall} ${ds.color.textSecondary} ${ds.color.textSecondaryDark}`}>
              Gestiona todas tus automatizaciones desde un único lugar: estado, próximos envíos y acciones rápidas
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
            <div className="flex items-center gap-2 mb-1">
              <Play className="w-4 h-4 text-green-600 dark:text-green-400" />
              <span className={`${ds.typography.caption} ${ds.color.textSecondary} ${ds.color.textSecondaryDark}`}>
                Activas
              </span>
            </div>
            <p className={`${ds.typography.h3} text-green-700 dark:text-green-300`}>
              {panel.totalActive}
            </p>
          </div>
          <div className="p-4 rounded-xl bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800">
            <div className="flex items-center gap-2 mb-1">
              <Pause className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
              <span className={`${ds.typography.caption} ${ds.color.textSecondary} ${ds.color.textSecondaryDark}`}>
                Pausadas
              </span>
            </div>
            <p className={`${ds.typography.h3} text-yellow-700 dark:text-yellow-300`}>
              {panel.totalPaused}
            </p>
          </div>
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
            <div className="flex items-center gap-2 mb-1">
              <CheckCircle2 className="w-4 h-4 text-slate-500" />
              <span className={`${ds.typography.caption} ${ds.color.textSecondary} ${ds.color.textSecondaryDark}`}>
                Finalizadas
              </span>
            </div>
            <p className={`${ds.typography.h3} ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
              {panel.totalFinished}
            </p>
          </div>
          <div className="p-4 rounded-xl bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800">
            <div className="flex items-center gap-2 mb-1">
              <Calendar className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <span className={`${ds.typography.caption} ${ds.color.textSecondary} ${ds.color.textSecondaryDark}`}>
                Próximos envíos
              </span>
            </div>
            <p className={`${ds.typography.h3} text-indigo-700 dark:text-indigo-300`}>
              {panel.upcomingSends.length}
            </p>
          </div>
        </div>

        {/* Próximos envíos */}
        {panel.upcomingSends.length > 0 && (
          <div className="p-4 rounded-xl bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800">
            <h3 className={`${ds.typography.h3} mb-3 ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
              Próximos envíos programados
            </h3>
            <div className="space-y-2">
              {panel.upcomingSends.slice(0, 5).map((send, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 rounded-lg bg-white dark:bg-slate-800/50"
                >
                  <div className="flex items-center gap-3">
                    <Clock className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                    <div>
                      <p className={`${ds.typography.bodyMedium} font-medium ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
                        {send.automationName}
                      </p>
                      <p className={`${ds.typography.caption} ${ds.color.textSecondary} ${ds.color.textSecondaryDark}`}>
                        {formatDate(send.scheduledDate)} • {send.recipientCount} destinatarios
                      </p>
                    </div>
                  </div>
                  <Badge variant="outline" size="sm">
                    {send.channel}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar automatizaciones..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 ${ds.color.textPrimary} ${ds.color.textPrimaryDark} focus:outline-none focus:ring-2 focus:ring-indigo-500`}
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as AutomationStatus | 'all')}
            className={`px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 ${ds.color.textPrimary} ${ds.color.textPrimaryDark} focus:outline-none focus:ring-2 focus:ring-indigo-500`}
          >
            <option value="all">Todos los estados</option>
            <option value="active">Activas</option>
            <option value="paused">Pausadas</option>
            <option value="finished">Finalizadas</option>
            <option value="draft">Borradores</option>
            <option value="error">Con error</option>
          </select>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value as AutomationType | 'all')}
            className={`px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 ${ds.color.textPrimary} ${ds.color.textPrimaryDark} focus:outline-none focus:ring-2 focus:ring-indigo-500`}
          >
            <option value="all">Todos los tipos</option>
            <option value="session-reminder">Recordatorios de sesión</option>
            <option value="welcome-sequence">Secuencias de bienvenida</option>
            <option value="absence-follow-up">Seguimiento de ausencias</option>
            <option value="inactivity-sequence">Secuencias de inactividad</option>
            <option value="payment-reminder">Recordatorios de pago</option>
            <option value="important-date">Fechas importantes</option>
            <option value="scheduled-message">Mensajes programados</option>
            <option value="promotional-campaign">Campañas promocionales</option>
            <option value="newsletter">Newsletters</option>
            <option value="after-hours-reply">Respuestas fuera de horario</option>
            <option value="reservation-integration">Integración con reservas</option>
          </select>
        </div>

        {/* Automatizations List */}
        <div className="space-y-3">
          {filteredAutomations.length === 0 ? (
            <div className="text-center py-12">
              <LayoutDashboard className="w-12 h-12 text-slate-400 mx-auto mb-4" />
              <p className={`${ds.typography.body} ${ds.color.textSecondary} ${ds.color.textSecondaryDark} mb-2`}>
                No se encontraron automatizaciones
              </p>
              <p className={`${ds.typography.caption} ${ds.color.textSecondary} ${ds.color.textSecondaryDark}`}>
                {searchQuery || statusFilter !== 'all' || typeFilter !== 'all'
                  ? 'Intenta ajustar los filtros de búsqueda'
                  : 'Crea tu primera automatización para comenzar'}
              </p>
            </div>
          ) : (
            filteredAutomations.map((automation) => (
              <div
                key={automation.id}
                className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className={`${ds.typography.h3} ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
                        {automation.name}
                      </h3>
                      <Badge
                        variant={automation.status === 'active' ? 'success' : automation.status === 'paused' ? 'warning' : 'secondary'}
                        size="sm"
                        className={`${statusColors[automation.status]} flex items-center gap-1`}
                      >
                        {statusIcons[automation.status]}
                        {statusLabels[automation.status]}
                      </Badge>
                      <Badge variant="outline" size="sm">
                        {automation.typeLabel}
                      </Badge>
                    </div>
                    <p className={`${ds.typography.bodySmall} ${ds.color.textSecondary} ${ds.color.textSecondaryDark} mb-3`}>
                      {automation.description}
                    </p>
                    <div className="flex flex-wrap items-center gap-4">
                      {automation.nextScheduledSend && (
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-slate-500" />
                          <span className={`${ds.typography.caption} ${ds.color.textSecondary} ${ds.color.textSecondaryDark}`}>
                            Próximo envío: {formatDate(automation.nextScheduledSend)}
                          </span>
                        </div>
                      )}
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-slate-500" />
                        <span className={`${ds.typography.caption} ${ds.color.textSecondary} ${ds.color.textSecondaryDark}`}>
                          {automation.activeRecipients} destinatarios activos
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-slate-500" />
                        <span className={`${ds.typography.caption} ${ds.color.textSecondary} ${ds.color.textSecondaryDark}`}>
                          {automation.totalSends} envíos totales
                        </span>
                      </div>
                      {automation.successRate !== undefined && (
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-green-500" />
                          <span className={`${ds.typography.caption} ${ds.color.textSecondary} ${ds.color.textSecondaryDark}`}>
                            {automation.successRate.toFixed(1)}% éxito
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    {automation.status === 'active' && automation.canPause && (
                      <Button
                        size="sm"
                        variant="secondary"
                        leftIcon={<Pause size={16} />}
                        onClick={() => onAutomationPause?.(automation.id)}
                      >
                        Pausar
                      </Button>
                    )}
                    {automation.status === 'paused' && automation.canResume && (
                      <Button
                        size="sm"
                        variant="secondary"
                        leftIcon={<Play size={16} />}
                        onClick={() => onAutomationResume?.(automation.id)}
                      >
                        Reanudar
                      </Button>
                    )}
                    {automation.canEdit && (
                      <button
                        onClick={() => onAutomationEdit?.(automation)}
                        className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                      >
                        <Edit className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                      </button>
                    )}
                    {automation.canDelete && (
                      <button
                        onClick={() => onAutomationDelete?.(automation.id)}
                        className="p-2 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4 text-red-600 dark:text-red-400" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </Card>
  );
};

