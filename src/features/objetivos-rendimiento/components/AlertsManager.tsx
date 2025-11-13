import React, { useState, useEffect, useMemo } from 'react';
import { Alert, GlobalFilters, AlertPriority } from '../types';
import { getAlerts, markAlertAsRead, acknowledgeAlert } from '../api/alerts';
import { executeActiveCustomAlertRules } from '../api/customAlertRules';
import { Card, Badge, Button } from '../../../components/componentsreutilizables';
import { AlertTriangle, Info, CheckCircle, XCircle, Bell, BellOff, ChevronDown, ChevronUp, Sparkles, Target, AlertCircle, ArrowRight, Settings } from 'lucide-react';
import { AlertConversionModal } from './AlertConversionModal';
import { CustomAlertRulesManager } from './CustomAlertRulesManager';

interface AlertsManagerProps {
  role: 'entrenador' | 'gimnasio';
  globalFilters?: GlobalFilters;
  periodo?: 'semana' | 'mes' | 'trimestre';
}


export const AlertsManager: React.FC<AlertsManagerProps> = ({ role, globalFilters, periodo }) => {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all');
  const [priorityFilter, setPriorityFilter] = useState<AlertPriority | 'all'>('all');
  const [objectiveFilter, setObjectiveFilter] = useState<string | null>(null);
  const [expandedAlerts, setExpandedAlerts] = useState<Set<string>>(new Set());
  const [conversionModalOpen, setConversionModalOpen] = useState(false);
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);
  const [showCustomRulesManager, setShowCustomRulesManager] = useState(false);

  // Cargar alertas desde API
  const loadAlerts = async () => {
    setLoading(true);
    try {
      // Ejecutar reglas personalizadas activas primero
      await executeActiveCustomAlertRules(role);
      // Luego cargar todas las alertas
      const data = await getAlerts(role);
      setAlerts(data);
    } catch (error) {
      console.error('Error loading alerts:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAlerts();
  }, [role, globalFilters, periodo]);

  // Escuchar evento para filtrar por objetivo
  useEffect(() => {
    const handleFilterByObjective = (event: CustomEvent) => {
      const { objectiveId } = event.detail;
      if (objectiveId) {
        setObjectiveFilter(objectiveId);
        setFilter('all'); // Mostrar todas las alertas cuando se filtra por objetivo
      }
    };

    window.addEventListener('filter-alert-by-objective', handleFilterByObjective as EventListener);
    return () => {
      window.removeEventListener('filter-alert-by-objective', handleFilterByObjective as EventListener);
    };
  }, []);

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

  // User Story 2: Badge de prioridad
  const getPriorityBadge = (priority: AlertPriority) => {
    const config = {
      critical: { label: 'Crítica', variant: 'red' as const, className: 'bg-red-100 text-red-800 border-red-300' },
      high: { label: 'Alta', variant: 'red' as const, className: 'bg-orange-100 text-orange-800 border-orange-300' },
      medium: { label: 'Media', variant: 'yellow' as const, className: 'bg-yellow-100 text-yellow-800 border-yellow-300' },
      low: { label: 'Baja', variant: 'blue' as const, className: 'bg-blue-100 text-blue-800 border-blue-300' },
    };
    const conf = config[priority];
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${conf.className}`}>
        {conf.label}
      </span>
    );
  };

  const toggleExpand = (alertId: string) => {
    setExpandedAlerts(prev => {
      const newSet = new Set(prev);
      if (newSet.has(alertId)) {
        newSet.delete(alertId);
      } else {
        newSet.add(alertId);
      }
      return newSet;
    });
  };

  const markAsRead = async (id: string) => {
    try {
      await markAlertAsRead(id);
      setAlerts(alerts.map(alert => 
        alert.id === id ? { ...alert, read: true } : alert
      ));
    } catch (error) {
      console.error('Error marking alert as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      const unreadAlerts = alerts.filter(a => !a.read);
      await Promise.all(unreadAlerts.map(alert => markAlertAsRead(alert.id)));
      setAlerts(alerts.map(alert => ({ ...alert, read: true })));
    } catch (error) {
      console.error('Error marking all alerts as read:', error);
    }
  };

  const handleAcknowledge = async (alertId: string) => {
    try {
      await acknowledgeAlert(alertId);
      setAlerts(alerts.map(alert => 
        alert.id === alertId 
          ? { ...alert, acknowledged: true, acknowledgedAt: new Date().toISOString() } 
          : alert
      ));
    } catch (error) {
      console.error('Error acknowledging alert:', error);
    }
  };

  const handleConvertAlert = (alert: Alert) => {
    setSelectedAlert(alert);
    setConversionModalOpen(true);
  };

  const handleConversionComplete = () => {
    loadAlerts();
  };

  const filteredAlerts = useMemo(() => {
    let result = alerts;
    
    // Filtrar por objetivo si está especificado
    if (objectiveFilter) {
      result = result.filter(a => a.objectiveId === objectiveFilter);
    }
    
    // Aplicar filtro de lectura
    if (filter === 'unread') {
      result = result.filter(a => !a.read);
    } else if (filter === 'read') {
      result = result.filter(a => a.read);
    }
    
    // User Story 2: Filtrar por prioridad
    if (priorityFilter !== 'all') {
      result = result.filter(a => a.priority === priorityFilter);
    }
    
    return result;
  }, [alerts, filter, objectiveFilter, priorityFilter]);

  const unreadCount = alerts.filter(a => !a.read).length;

  if (showCustomRulesManager) {
    return <CustomAlertRulesManager role={role} onClose={() => setShowCustomRulesManager(false)} />;
  }

  return (
    <div className="space-y-6">
      {/* Toolbar superior */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={() => setShowCustomRulesManager(true)}
          className="flex items-center gap-2"
        >
          <Settings size={18} />
          Gestionar Reglas Personalizadas
        </Button>
        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="px-4 py-2 rounded-lg text-sm font-medium text-blue-600 hover:bg-blue-50 transition-all"
            >
              Marcar todas como leídas
            </button>
          )}
        </div>
      </div>

      {/* Filtros */}
      <Card className="p-4 bg-white shadow-sm">
        <div className="flex flex-wrap items-center gap-2">
          {objectiveFilter && (
            <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 rounded-lg border border-blue-200/50">
              <span className="text-sm text-blue-700">Filtrado por objetivo</span>
              <button
                onClick={() => setObjectiveFilter(null)}
                className="text-blue-600 hover:text-blue-700"
              >
                <XCircle size={16} />
              </button>
            </div>
          )}
          <button
            onClick={() => setFilter('all')}
            className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all ${
              filter === 'all'
                ? 'bg-white text-slate-900 shadow-sm ring-1 ring-slate-200'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/70'
            }`}
          >
            Todas ({alerts.length})
          </button>
          <button
            onClick={() => setFilter('unread')}
            className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all ${
              filter === 'unread'
                ? 'bg-white text-slate-900 shadow-sm ring-1 ring-slate-200'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/70'
            }`}
          >
            <Bell size={18} className={filter === 'unread' ? 'opacity-100' : 'opacity-70'} />
            No leídas ({unreadCount})
          </button>
          <button
            onClick={() => setFilter('read')}
            className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all ${
              filter === 'read'
                ? 'bg-white text-slate-900 shadow-sm ring-1 ring-slate-200'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/70'
            }`}
          >
            Leídas ({alerts.filter(a => a.read).length})
          </button>
          {/* User Story 2: Filtro por prioridad */}
          <div className="ml-auto flex items-center gap-2">
            <span className="text-sm text-gray-600">Prioridad:</span>
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value as AlertPriority | 'all')}
              className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Todas</option>
              <option value="critical">Crítica</option>
              <option value="high">Alta</option>
              <option value="medium">Media</option>
              <option value="low">Baja</option>
            </select>
          </div>
        </div>
      </Card>

      <div className="space-y-3">
        {filteredAlerts.map((alert) => {
          const isExpanded = expandedAlerts.has(alert.id);
          const hasMitigationPlan = !!alert.mitigationPlan;
          
          return (
            <Card
              key={alert.id}
              variant="hover"
              className={`p-4 ${!alert.read ? 'border-l-4 border-l-blue-600' : ''} transition-shadow ${
                alert.priority === 'critical' ? 'bg-red-50/50' : 
                alert.priority === 'high' ? 'bg-orange-50/50' : ''
              }`}
            >
              <div className="flex items-start gap-4">
                <div className="mt-1">
                  {getAlertIcon(alert.type)}
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="text-base font-semibold text-gray-900">
                      {alert.title}
                    </h4>
                    <div className="flex items-center gap-2">
                      {/* User Story 2: Badge de prioridad */}
                      {getPriorityBadge(alert.priority)}
                      {getSeverityBadge(alert.severity)}
                      {!alert.read && (
                        <Bell className="w-4 h-4 text-blue-600" />
                      )}
                      {alert.read && (
                        <BellOff className="w-4 h-4 text-gray-400" />
                      )}
                    </div>
                  </div>
                  <p className="text-base text-gray-600 mb-2">
                    {alert.message}
                  </p>
                  
                  {/* User Story 1 & 2: Causa detectada */}
                  {alert.detectedCause && (
                    <div className="mb-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                      <div className="flex items-start gap-2">
                        <AlertCircle className="w-4 h-4 text-blue-600 mt-0.5" />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-blue-900 mb-1">Causa detectada:</p>
                          <p className="text-sm text-blue-800">{alert.detectedCause.description}</p>
                          {alert.detectedCause.details && (
                            <div className="mt-2 text-xs text-blue-700">
                              {alert.detectedCause.details.deviation !== undefined && (
                                <span>Desviación: {alert.detectedCause.details.deviation.toFixed(1)}%</span>
                              )}
                              {alert.detectedCause.details.daysSinceUpdate !== undefined && (
                                <span>Días sin actualizar: {alert.detectedCause.details.daysSinceUpdate}</span>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* User Story 2: Plan de mitigación */}
                  {hasMitigationPlan && (
                    <div className="mb-3">
                      <button
                        onClick={() => toggleExpand(alert.id)}
                        className="flex items-center gap-2 w-full text-left p-3 bg-purple-50 rounded-lg border border-purple-200 hover:bg-purple-100 transition-colors"
                      >
                        <Sparkles className="w-4 h-4 text-purple-600" />
                        <span className="text-sm font-medium text-purple-900 flex-1">
                          Plan de Mitigación (IA)
                        </span>
                        {isExpanded ? (
                          <ChevronUp className="w-4 h-4 text-purple-600" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-purple-600" />
                        )}
                      </button>
                      
                      {isExpanded && alert.mitigationPlan && (
                        <div className="mt-2 p-4 bg-white rounded-lg border border-purple-200">
                          <h5 className="font-semibold text-gray-900 mb-2">{alert.mitigationPlan.title}</h5>
                          <p className="text-sm text-gray-600 mb-3">{alert.mitigationPlan.description}</p>
                          
                          <div className="mb-3">
                            <p className="text-xs font-medium text-gray-700 mb-2">Pasos del plan:</p>
                            <ol className="space-y-2">
                              {alert.mitigationPlan.steps.map((step, idx) => (
                                <li key={step.id} className="flex gap-3">
                                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center text-xs font-medium">
                                    {idx + 1}
                                  </span>
                                  <div className="flex-1">
                                    <p className="text-sm font-medium text-gray-900">{step.title}</p>
                                    <p className="text-xs text-gray-600 mt-1">{step.description}</p>
                                    <div className="flex gap-2 mt-1">
                                      <Badge variant={step.priority === 'high' ? 'red' : step.priority === 'medium' ? 'yellow' : 'blue'}>
                                        {step.priority === 'high' ? 'Alta' : step.priority === 'medium' ? 'Media' : 'Baja'}
                                      </Badge>
                                      <span className="text-xs text-gray-500">
                                        Impacto: {step.estimatedImpact === 'high' ? 'Alto' : step.estimatedImpact === 'medium' ? 'Medio' : 'Bajo'}
                                      </span>
                                    </div>
                                  </div>
                                </li>
                              ))}
                            </ol>
                          </div>
                          
                          <div className="p-3 bg-purple-50 rounded-lg">
                            <p className="text-xs font-medium text-purple-900 mb-1">Razonamiento de IA:</p>
                            <p className="text-xs text-purple-800">{alert.mitigationPlan.rationale}</p>
                          </div>
                          
                          {alert.mitigationPlan.estimatedTimeToResolve && (
                            <div className="mt-3 flex items-center gap-2 text-xs text-gray-600">
                              <Target className="w-4 h-4" />
                              <span>Tiempo estimado de resolución: {alert.mitigationPlan.estimatedTimeToResolve}</span>
                            </div>
                          )}
                          
                          <div className="mt-3 flex items-center justify-between">
                            <span className="text-xs text-gray-500">
                              Confianza: {alert.mitigationPlan.confidence}%
                            </span>
                            {!alert.acknowledged && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleAcknowledge(alert.id);
                                }}
                                className="px-3 py-1.5 text-xs font-medium text-purple-700 bg-purple-100 rounded-lg hover:bg-purple-200 transition-colors"
                              >
                                Reconocer alerta
                              </button>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between mt-3">
                    <span className="text-xs text-gray-500">
                      {new Date(alert.createdAt).toLocaleString('es-ES')}
                    </span>
                    <div className="flex items-center gap-2">
                      {alert.objectiveId && !alert.conversion && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleConvertAlert(alert);
                          }}
                          className="flex items-center gap-2"
                        >
                          <ArrowRight className="w-4 h-4" />
                          Convertir
                        </Button>
                      )}
                      {alert.conversion && (
                        <Badge variant="green" className="text-xs">
                          Convertida: {alert.conversion.type === 'adjustment' ? 'Ajuste' : alert.conversion.type === 'task' ? 'Tarea' : 'Plan'}
                        </Badge>
                      )}
                      {!alert.read && (
                        <button
                          onClick={() => markAsRead(alert.id)}
                          className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                        >
                          Marcar como leída
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {loading && (
        <Card className="p-8 text-center bg-white shadow-sm">
          <div className="text-sm text-gray-500">Cargando alertas...</div>
        </Card>
      )}

      {!loading && filteredAlerts.length === 0 && (
        <Card className="p-8 text-center bg-white shadow-sm">
          <Bell size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No hay alertas disponibles</h3>
          <p className="text-gray-600">No se encontraron alertas para mostrar.</p>
        </Card>
      )}

      {/* Conversion Modal */}
      <AlertConversionModal
        isOpen={conversionModalOpen}
        onClose={() => {
          setConversionModalOpen(false);
          setSelectedAlert(null);
        }}
        alert={selectedAlert}
        onConversionComplete={handleConversionComplete}
      />
    </div>
  );
};

