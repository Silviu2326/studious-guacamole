import React, { useState, useEffect, useMemo } from 'react';
import { Alert, ObjectiveAlertType, AlertSeverity } from '../types';
import { getAlerts, updateAlertReadStatus, markAllAlertsAsRead, AlertFilters } from '../api/performance';
import { Card, Badge, Select, Button } from '../../../components/componentsreutilizables';
import { 
  AlertTriangle, 
  Info, 
  CheckCircle, 
  XCircle, 
  Bell, 
  BellOff, 
  Filter,
  X,
  Eye,
  EyeOff
} from 'lucide-react';

interface AlertsManagerProps {
  role: 'entrenador' | 'gimnasio';
  compact?: boolean;
  maxAlerts?: number;
  alerts?: Alert[];
  onError?: (errorMessage: string) => void;
}

export const AlertsManager: React.FC<AlertsManagerProps> = ({ 
  role, 
  compact = false,
  maxAlerts = 5,
  alerts: externalAlerts,
  onError
}) => {
  const [alerts, setAlerts] = useState<Alert[]>(externalAlerts || []);
  const [loading, setLoading] = useState(!externalAlerts);
  const [filters, setFilters] = useState<AlertFilters>({});
  const [showFilters, setShowFilters] = useState(false);
  
  // Cargar alertas desde API si no se proporcionan externamente
  useEffect(() => {
    if (!externalAlerts) {
      loadAlerts();
    } else {
      setAlerts(externalAlerts);
    }
  }, [role, externalAlerts]);

  // Recargar alertas cuando cambian los filtros
  useEffect(() => {
    if (!externalAlerts) {
      loadAlerts();
    }
  }, [filters, role]);

  const loadAlerts = async () => {
    setLoading(true);
    try {
      const data = await getAlerts(role, filters);
      setAlerts(data);
    } catch (error) {
      console.error('Error loading alerts:', error);
      const errorMessage = error instanceof Error ? error.message : 'No se pudieron cargar las alertas';
      if (onError) {
        onError(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  const getAlertIcon = (type: Alert['type']) => {
    switch (type) {
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-600" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-red-600" />;
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      default:
        return <Info className="w-5 h-5 text-blue-600" />;
    }
  };

  const getSeverityBadge = (severity: Alert['severity']) => {
    const config = {
      low: { label: 'Baja', variant: 'blue' as const },
      medium: { label: 'Media', variant: 'yellow' as const },
      high: { label: 'Alta', variant: 'red' as const },
    };
    return <Badge variant={config[severity].variant}>{config[severity].label}</Badge>;
  };

  const getTipoObjetivoLabel = (tipo?: string) => {
    const labels: Record<string, string> = {
      [ObjectiveAlertType.RIESGO_PROGRESO]: 'En Riesgo',
      [ObjectiveAlertType.OBJETIVO_CUMPLIDO]: 'Hito Alcanzado',
      [ObjectiveAlertType.FECHA_PROXIMA]: 'Fecha Próxima',
      [ObjectiveAlertType.OBJETIVO_FALLIDO]: 'Objetivo Fallido',
      [ObjectiveAlertType.UMBRAL_SUPERADO]: 'Umbral Superado',
    };
    return labels[tipo || ''] || tipo || 'Todos';
  };

  const markAsRead = async (id: string) => {
    try {
      await updateAlertReadStatus(id, true);
      setAlerts(alerts.map(alert => 
        alert.id === id ? { ...alert, read: true, isRead: true } : alert
      ));
    } catch (error) {
      console.error('Error marking alert as read:', error);
    }
  };

  const markAsUnread = async (id: string) => {
    try {
      await updateAlertReadStatus(id, false);
      setAlerts(alerts.map(alert => 
        alert.id === id ? { ...alert, read: false, isRead: false } : alert
      ));
    } catch (error) {
      console.error('Error marking alert as unread:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllAlertsAsRead(role);
      setAlerts(alerts.map(alert => ({ ...alert, read: true, isRead: true })));
    } catch (error) {
      console.error('Error marking all alerts as read:', error);
    }
  };

  const clearFilters = () => {
    setFilters({});
  };

  const toggleOnlyAtRisk = () => {
    if (filters.onlyAtRisk) {
      setFilters({ ...filters, onlyAtRisk: false });
    } else {
      setFilters({ onlyAtRisk: true });
    }
  };

  // Filtrar alertas localmente (ya vienen filtradas de la API, pero por si acaso)
  const filteredAlerts = useMemo(() => {
    let filtered = [...alerts];
    
    // Filtro por tipo de alerta
    if (filters.tipoObjetivo) {
      filtered = filtered.filter(a => a.tipoObjetivo === filters.tipoObjetivo);
    }
    
    // Filtro por severidad
    if (filters.severity) {
      filtered = filtered.filter(a => a.severity === filters.severity);
    }
    
    // Filtro por estado de lectura
    if (filters.isRead !== undefined) {
      filtered = filtered.filter(a => {
        const read = a.read ?? a.isRead ?? false;
        return read === filters.isRead;
      });
    }
    
    // Filtro solo en riesgo
    if (filters.onlyAtRisk) {
      filtered = filtered.filter(a => 
        a.tipoObjetivo === ObjectiveAlertType.RIESGO_PROGRESO ||
        a.riesgo === 'alto' ||
        a.severity === 'high'
      );
    }
    
    return filtered;
  }, [alerts, filters]);

  const unreadCount = alerts.filter(a => !(a.read ?? a.isRead ?? false)).length;
  const atRiskCount = alerts.filter(a => 
    a.tipoObjetivo === ObjectiveAlertType.RIESGO_PROGRESO ||
    a.riesgo === 'alto' ||
    a.severity === 'high'
  ).length;
  
  const activeFiltersCount = 
    (filters.tipoObjetivo ? 1 : 0) + 
    (filters.severity ? 1 : 0) + 
    (filters.isRead !== undefined ? 1 : 0) + 
    (filters.onlyAtRisk ? 1 : 0);
  
  // En modo compacto, mostrar solo alertas no leídas y limitar cantidad
  const displayAlerts = compact 
    ? filteredAlerts.filter(a => !(a.read ?? a.isRead ?? false)).slice(0, maxAlerts)
    : filteredAlerts;

  // Modo compacto: vista simplificada
  if (compact) {
    return (
      <div className="space-y-2">
        {loading ? (
          <Card className="p-4 text-center bg-white shadow-sm">
            <p className="text-sm text-gray-600">Cargando alertas...</p>
          </Card>
        ) : displayAlerts.length > 0 ? (
          <>
            {displayAlerts.map((alert) => {
              const isRead = alert.read ?? alert.isRead ?? false;
              return (
                <Card
                  key={alert.id}
                  className={`p-3 ${!isRead ? 'border-l-4 border-l-blue-600 bg-blue-50/30' : 'bg-white'} transition-shadow cursor-pointer hover:shadow-md`}
                  onClick={() => !isRead && markAsRead(alert.id)}
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 flex-shrink-0">
                      {getAlertIcon(alert.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-semibold text-gray-900 truncate">
                        {alert.title}
                      </h4>
                      <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                        {alert.message}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        {getSeverityBadge(alert.severity)}
                        <span className="text-xs text-gray-500">
                          {new Date(alert.createdAt).toLocaleDateString('es-ES', { day: '2-digit', month: 'short' })}
                        </span>
                      </div>
                    </div>
                    {!isRead && (
                      <Bell className="w-4 h-4 text-blue-600 flex-shrink-0" />
                    )}
                  </div>
                </Card>
              );
            })}
            {unreadCount > maxAlerts && (
              <p className="text-xs text-gray-500 text-center pt-2">
                +{unreadCount - maxAlerts} alerta{unreadCount - maxAlerts !== 1 ? 's' : ''} más
              </p>
            )}
          </>
        ) : (
          <Card className="p-4 text-center bg-white shadow-sm">
            <Bell size={24} className="mx-auto text-gray-400 mb-2" />
            <p className="text-xs text-gray-600">No hay alertas pendientes</p>
          </Card>
        )}
      </div>
    );
  }

  // Modo completo: vista estándar con filtros avanzados
  return (
    <div className="space-y-6">
      {/* Toolbar superior */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-semibold text-gray-900">Alertas</h2>
          {unreadCount > 0 && (
            <Badge variant="blue">{unreadCount} no leídas</Badge>
          )}
        </div>
        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <Button
              variant="secondary"
              onClick={handleMarkAllAsRead}
            >
              <BellOff size={18} className="mr-2" />
              Marcar todas como leídas
            </Button>
          )}
          <Button
            variant="secondary"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter size={18} className="mr-2" />
            Filtros
            {activeFiltersCount > 0 && (
              <Badge variant="blue" className="ml-2">
                {activeFiltersCount}
              </Badge>
            )}
          </Button>
        </div>
      </div>

      {/* Panel de filtros avanzados */}
      {showFilters && (
        <Card className="p-4 bg-white shadow-sm">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-gray-900">Filtros de Alertas</h3>
              {activeFiltersCount > 0 && (
                <button
                  onClick={clearFilters}
                  className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
                >
                  <X size={16} />
                  Limpiar filtros
                </button>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Filtro por tipo de alerta */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tipo de Alerta
                </label>
                <Select
                  value={filters.tipoObjetivo || ''}
                  onChange={(e) => setFilters({ 
                    ...filters, 
                    tipoObjetivo: e.target.value || undefined 
                  })}
                  options={[
                    { value: '', label: 'Todos los tipos' },
                    { value: ObjectiveAlertType.RIESGO_PROGRESO, label: 'En Riesgo' },
                    { value: ObjectiveAlertType.OBJETIVO_CUMPLIDO, label: 'Hito Alcanzado' },
                    { value: ObjectiveAlertType.FECHA_PROXIMA, label: 'Fecha Próxima' },
                    { value: ObjectiveAlertType.OBJETIVO_FALLIDO, label: 'Objetivo Fallido' },
                    { value: ObjectiveAlertType.UMBRAL_SUPERADO, label: 'Umbral Superado' },
                  ]}
                />
              </div>

              {/* Filtro por severidad */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Severidad
                </label>
                <Select
                  value={filters.severity || ''}
                  onChange={(e) => setFilters({ 
                    ...filters, 
                    severity: e.target.value as AlertSeverity || undefined 
                  })}
                  options={[
                    { value: '', label: 'Todas las severidades' },
                    { value: 'high', label: 'Alta' },
                    { value: 'medium', label: 'Media' },
                    { value: 'low', label: 'Baja' },
                  ]}
                />
              </div>

              {/* Filtro por estado de lectura */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Estado de Lectura
                </label>
                <Select
                  value={filters.isRead !== undefined ? (filters.isRead ? 'read' : 'unread') : ''}
                  onChange={(e) => setFilters({ 
                    ...filters, 
                    isRead: e.target.value === '' ? undefined : e.target.value === 'read' 
                  })}
                  options={[
                    { value: '', label: 'Todas' },
                    { value: 'unread', label: 'No leídas' },
                    { value: 'read', label: 'Leídas' },
                  ]}
                />
              </div>
            </div>

            {/* Filtro rápido: Solo en riesgo */}
            <div className="pt-2 border-t border-gray-200">
              <button
                onClick={toggleOnlyAtRisk}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  filters.onlyAtRisk
                    ? 'bg-red-50 text-red-700 border border-red-200'
                    : 'bg-gray-50 text-gray-700 border border-gray-200 hover:bg-gray-100'
                }`}
              >
                <AlertTriangle size={18} />
                Solo alertas en riesgo
                {atRiskCount > 0 && (
                  <Badge variant="red" className="ml-2">
                    {atRiskCount}
                  </Badge>
                )}
              </button>
            </div>
          </div>
        </Card>
      )}

      {/* Resumen de resultados */}
      <div className="flex justify-between items-center text-sm text-gray-600">
        <span>
          {filteredAlerts.length} alerta{filteredAlerts.length !== 1 ? 's' : ''} encontrada{filteredAlerts.length !== 1 ? 's' : ''}
        </span>
        {activeFiltersCount > 0 && (
          <span>{activeFiltersCount} filtro{activeFiltersCount !== 1 ? 's' : ''} aplicado{activeFiltersCount !== 1 ? 's' : ''}</span>
        )}
      </div>

      {/* Lista de alertas */}
      {loading ? (
        <Card className="p-8 text-center bg-white shadow-sm">
          <p className="text-gray-600">Cargando alertas...</p>
        </Card>
      ) : filteredAlerts.length === 0 ? (
        <Card className="p-8 text-center bg-white shadow-sm">
          <Bell size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No hay alertas disponibles</h3>
          <p className="text-gray-600">
            {activeFiltersCount > 0 
              ? 'No se encontraron alertas con los filtros aplicados. Intenta ajustar los filtros.'
              : 'No se encontraron alertas para mostrar.'}
          </p>
        </Card>
      ) : (
        <div className="space-y-3">
          {filteredAlerts.map((alert) => {
            const isRead = alert.read ?? alert.isRead ?? false;
            return (
              <Card
                key={alert.id}
                className={`p-4 ${!isRead ? 'border-l-4 border-l-blue-600 bg-blue-50/30' : 'bg-white'} transition-shadow hover:shadow-md`}
              >
                <div className="flex items-start gap-4">
                  <div className="mt-1 flex-shrink-0">
                    {getAlertIcon(alert.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h4 className="text-base font-semibold text-gray-900 mb-1">
                          {alert.title}
                        </h4>
                        {alert.tipoObjetivo && (
                          <Badge variant="blue" className="text-xs">
                            {getTipoObjetivoLabel(alert.tipoObjetivo)}
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-2 ml-4">
                        {getSeverityBadge(alert.severity)}
                        <button
                          onClick={() => isRead ? markAsUnread(alert.id) : markAsRead(alert.id)}
                          className="p-1.5 rounded-lg text-gray-600 hover:bg-gray-100 transition-all"
                          title={isRead ? 'Marcar como no leída' : 'Marcar como leída'}
                        >
                          {isRead ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4 text-blue-600" />
                          )}
                        </button>
                        {!isRead && (
                          <Bell className="w-4 h-4 text-blue-600" />
                        )}
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">
                      {alert.message}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span>
                        {new Date(alert.createdAt).toLocaleString('es-ES', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                      {alert.objectiveId && (
                        <span className="px-2 py-1 bg-gray-100 rounded">
                          Objetivo: {alert.objectiveId}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};
