import React, { useState, useEffect } from 'react';
import { Alert, Objective } from '../types';
import { getAlertHistoryByObjective, updateAlertResult } from '../api/alerts';
import { Card, Badge, Button, Modal, Textarea, Select } from '../../../components/componentsreutilizables';
import { AlertTriangle, Info, CheckCircle, XCircle, History, TrendingUp, TrendingDown, Minus, Edit2, CheckCircle2, X } from 'lucide-react';

interface AlertHistoryViewProps {
  objective: Objective;
  onClose?: () => void;
}

export const AlertHistoryView: React.FC<AlertHistoryViewProps> = ({ objective, onClose }) => {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingResult, setEditingResult] = useState<string | null>(null);
  const [resultData, setResultData] = useState({
    wasEffective: undefined as boolean | undefined,
    effectivenessNotes: '',
  });

  useEffect(() => {
    loadAlertHistory();
  }, [objective.id]);

  const loadAlertHistory = async () => {
    setLoading(true);
    try {
      const history = await getAlertHistoryByObjective(objective.id);
      setAlerts(history);
    } catch (error) {
      console.error('Error loading alert history:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateResult = async (alertId: string) => {
    try {
      await updateAlertResult(alertId, {
        wasEffective: resultData.wasEffective,
        effectivenessNotes: resultData.effectivenessNotes,
      });
      await loadAlertHistory();
      setEditingResult(null);
      setResultData({ wasEffective: undefined, effectivenessNotes: '' });
    } catch (error) {
      console.error('Error updating alert result:', error);
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

  const getResultStatusBadge = (result?: Alert['result']) => {
    if (!result) {
      return <Badge variant="gray">Pendiente</Badge>;
    }

    switch (result.status) {
      case 'resolved':
        return <Badge variant="green">Resuelta</Badge>;
      case 'mitigated':
        return <Badge variant="blue">Mitigada</Badge>;
      case 'converted':
        return <Badge variant="purple">Convertida</Badge>;
      case 'dismissed':
        return <Badge variant="gray">Descartada</Badge>;
      default:
        return <Badge variant="yellow">Pendiente</Badge>;
    }
  };

  const getEffectivenessIcon = (wasEffective?: boolean) => {
    if (wasEffective === undefined) return null;
    if (wasEffective) {
      return <TrendingUp className="w-4 h-4 text-green-600" />;
    }
    return <TrendingDown className="w-4 h-4 text-red-600" />;
  };

  const getConversionTypeLabel = (type?: string) => {
    switch (type) {
      case 'adjustment':
        return 'Ajuste de objetivo';
      case 'task':
        return 'Tarea';
      case 'action_plan':
        return 'Plan de acción';
      default:
        return '';
    }
  };

  if (loading) {
    return (
      <Card className="p-8 text-center">
        <div className="text-sm text-gray-500">Cargando historial de alertas...</div>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <History className="w-6 h-6 text-gray-600" />
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Historial de Alertas</h3>
            <p className="text-sm text-gray-600">{objective.title}</p>
          </div>
        </div>
        {onClose && (
          <Button variant="outline" size="sm" onClick={onClose}>
            Cerrar
          </Button>
        )}
      </div>

      {/* Summary */}
      <Card className="p-4 bg-blue-50 border border-blue-200">
        <div className="grid grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-gray-900">{alerts.length}</div>
            <div className="text-xs text-gray-600">Total alertas</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-green-600">
              {alerts.filter(a => a.result?.status === 'resolved' || a.result?.status === 'mitigated').length}
            </div>
            <div className="text-xs text-gray-600">Resueltas</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-purple-600">
              {alerts.filter(a => a.result?.status === 'converted').length}
            </div>
            <div className="text-xs text-gray-600">Convertidas</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-yellow-600">
              {alerts.filter(a => !a.result || a.result.status === 'pending').length}
            </div>
            <div className="text-xs text-gray-600">Pendientes</div>
          </div>
        </div>
      </Card>

      {/* Alert list */}
      {alerts.length === 0 ? (
        <Card className="p-8 text-center">
          <History className="w-12 h-12 mx-auto text-gray-400 mb-4" />
          <h4 className="text-lg font-semibold text-gray-900 mb-2">No hay historial de alertas</h4>
          <p className="text-gray-600">Este objetivo no tiene alertas registradas.</p>
        </Card>
      ) : (
        <div className="space-y-3">
          {alerts.map((alert) => (
            <Card key={alert.id} className="p-4">
              <div className="flex items-start gap-4">
                <div className="mt-1">
                  {getAlertIcon(alert.type)}
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="text-base font-semibold text-gray-900">{alert.title}</h4>
                      <p className="text-sm text-gray-600 mt-1">{alert.message}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {getResultStatusBadge(alert.result)}
                      {getEffectivenessIcon(alert.result?.wasEffective)}
                    </div>
                  </div>

                  {/* Alert details */}
                  <div className="grid grid-cols-2 gap-4 mb-3 text-sm">
                    <div>
                      <span className="text-gray-500">Fecha:</span>
                      <span className="ml-2 text-gray-900">
                        {new Date(alert.createdAt).toLocaleString('es-ES')}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500">Severidad:</span>
                      <Badge
                        variant={
                          alert.severity === 'high' ? 'red' :
                          alert.severity === 'medium' ? 'yellow' : 'blue'
                        }
                        className="ml-2"
                      >
                        {alert.severity === 'high' ? 'Alta' : alert.severity === 'medium' ? 'Media' : 'Baja'}
                      </Badge>
                    </div>
                  </div>

                  {/* Conversion info */}
                  {alert.conversion && (
                    <div className="mb-3 p-3 bg-purple-50 rounded-lg border border-purple-200">
                      <div className="flex items-center gap-2 mb-1">
                        <CheckCircle2 className="w-4 h-4 text-purple-600" />
                        <span className="text-sm font-medium text-purple-900">
                          Convertida en {getConversionTypeLabel(alert.conversion.type)}
                        </span>
                      </div>
                      <p className="text-xs text-purple-800">
                        {alert.conversion.convertedToTitle}
                      </p>
                      <p className="text-xs text-purple-600 mt-1">
                        Convertida el {new Date(alert.conversion.convertedAt).toLocaleString('es-ES')} por {alert.conversion.convertedByName}
                      </p>
                    </div>
                  )}

                  {/* Result info */}
                  {alert.result && (
                    <div className="mb-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          {alert.result.resultDescription && (
                            <p className="text-sm text-gray-700 mb-2">
                              {alert.result.resultDescription}
                            </p>
                          )}
                          {alert.result.resolvedAt && (
                            <p className="text-xs text-gray-600">
                              Resuelta el {new Date(alert.result.resolvedAt).toLocaleString('es-ES')}
                              {alert.result.resolvedByName && ` por ${alert.result.resolvedByName}`}
                            </p>
                          )}
                          {alert.result.effectivenessNotes && (
                            <div className="mt-2 p-2 bg-white rounded border border-gray-200">
                              <p className="text-xs font-medium text-gray-700 mb-1">Notas de efectividad:</p>
                              <p className="text-xs text-gray-600">{alert.result.effectivenessNotes}</p>
                            </div>
                          )}
                        </div>
                        {alert.result.wasEffective !== undefined && (
                          <div className="ml-4">
                            {alert.result.wasEffective ? (
                              <div className="flex items-center gap-1 text-green-600">
                                <TrendingUp className="w-5 h-5" />
                                <span className="text-xs font-medium">Efectiva</span>
                              </div>
                            ) : (
                              <div className="flex items-center gap-1 text-red-600">
                                <TrendingDown className="w-5 h-5" />
                                <span className="text-xs font-medium">No efectiva</span>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Edit result button */}
                  {alert.result && alert.result.status !== 'pending' && !editingResult && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setEditingResult(alert.id);
                        setResultData({
                          wasEffective: alert.result?.wasEffective,
                          effectivenessNotes: alert.result?.effectivenessNotes || '',
                        });
                      }}
                      className="flex items-center gap-2"
                    >
                      <Edit2 className="w-4 h-4" />
                      {alert.result.wasEffective === undefined ? 'Registrar resultado' : 'Editar resultado'}
                    </Button>
                  )}

                  {/* Edit result form */}
                  {editingResult === alert.id && (
                    <div className="mt-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <h5 className="text-sm font-medium text-gray-900 mb-3">
                        ¿Fue efectiva la mitigación?
                      </h5>
                      <div className="space-y-3">
                        <Select
                          value={resultData.wasEffective === undefined ? '' : resultData.wasEffective ? 'true' : 'false'}
                          onChange={(e) => setResultData({
                            ...resultData,
                            wasEffective: e.target.value === '' ? undefined : e.target.value === 'true',
                          })}
                          options={[
                            { value: '', label: 'Seleccionar...' },
                            { value: 'true', label: 'Sí, fue efectiva' },
                            { value: 'false', label: 'No, no fue efectiva' },
                          ]}
                        />
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Notas sobre qué funcionó y qué no
                          </label>
                          <Textarea
                            value={resultData.effectivenessNotes}
                            onChange={(e) => setResultData({ ...resultData, effectivenessNotes: e.target.value })}
                            placeholder="Describe qué funcionó y qué no en esta mitigación..."
                            rows={4}
                          />
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            onClick={() => handleUpdateResult(alert.id)}
                          >
                            Guardar
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setEditingResult(null);
                              setResultData({ wasEffective: undefined, effectivenessNotes: '' });
                            }}
                          >
                            Cancelar
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

