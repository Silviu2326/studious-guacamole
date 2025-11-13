import React, { useState, useEffect } from 'react';
import { CustomAlertRule, AlertCondition, AlertConditionOperator, AlertConditionLogic, AlertPeriod, AlertRuleTestResult, AlertType, AlertPriority } from '../types';
import { getCustomAlertRules, createCustomAlertRule, updateCustomAlertRule, deleteCustomAlertRule, testCustomAlertRule, activateCustomAlertRule, deactivateCustomAlertRule } from '../api/customAlertRules';
import { Card, Button, Modal, Input, Select, Textarea, Badge } from '../../../components/componentsreutilizables';
import { Settings, Plus, Edit2, Trash2, Play, CheckCircle, XCircle, AlertTriangle, X, Save, TestTube } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';

interface CustomAlertRulesManagerProps {
  role: 'entrenador' | 'gimnasio';
  onClose?: () => void;
}

export const CustomAlertRulesManager: React.FC<CustomAlertRulesManagerProps> = ({ role, onClose }) => {
  const { user } = useAuth();
  const [rules, setRules] = useState<CustomAlertRule[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRule, setEditingRule] = useState<CustomAlertRule | null>(null);
  const [testResult, setTestResult] = useState<AlertRuleTestResult | null>(null);
  const [showTestResult, setShowTestResult] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState<Partial<CustomAlertRule>>({
    name: '',
    description: '',
    enabled: true,
    active: false,
    conditions: [],
    conditionLogic: 'AND',
    period: 'month',
    alertType: 'objective_deviation',
    priority: 'medium',
    severity: 'medium',
    notificationChannels: ['in_app'],
  });

  useEffect(() => {
    loadRules();
  }, []);

  const loadRules = async () => {
    setLoading(true);
    try {
      const data = await getCustomAlertRules(role);
      setRules(data);
    } catch (error) {
      console.error('Error loading rules:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (rule?: CustomAlertRule) => {
    if (rule) {
      setEditingRule(rule);
      setFormData(rule);
    } else {
      setEditingRule(null);
      setFormData({
        name: '',
        description: '',
        enabled: true,
        active: false,
        conditions: [],
        conditionLogic: 'AND',
        period: 'month',
        alertType: 'objective_deviation',
        priority: 'medium',
        severity: 'medium',
        notificationChannels: ['in_app'],
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingRule(null);
    setFormData({
      name: '',
      description: '',
      enabled: true,
      active: false,
      conditions: [],
      conditionLogic: 'AND',
      period: 'month',
      alertType: 'objective_deviation',
      priority: 'medium',
      severity: 'medium',
      notificationChannels: ['in_app'],
    });
  };

  const handleSave = async () => {
    if (!formData.name || !formData.conditions || formData.conditions.length === 0) {
      alert('Por favor completa el nombre y al menos una condición');
      return;
    }

    try {
      if (editingRule) {
        await updateCustomAlertRule(editingRule.id, {
          ...formData,
          updatedAt: new Date().toISOString(),
        } as CustomAlertRule);
      } else {
        await createCustomAlertRule({
          ...formData,
          createdBy: user?.id || 'user',
          createdByName: user?.name || 'Usuario',
        } as Omit<CustomAlertRule, 'id' | 'createdAt' | 'updatedAt'>);
      }
      await loadRules();
      handleCloseModal();
    } catch (error) {
      console.error('Error saving rule:', error);
      alert('Error al guardar la regla');
    }
  };

  const handleDelete = async (ruleId: string) => {
    if (!confirm('¿Estás seguro de eliminar esta regla?')) return;
    
    try {
      await deleteCustomAlertRule(ruleId);
      await loadRules();
    } catch (error) {
      console.error('Error deleting rule:', error);
      alert('Error al eliminar la regla');
    }
  };

  const handleTest = async (rule: CustomAlertRule) => {
    try {
      const result = await testCustomAlertRule(
        rule,
        user?.id || 'user',
        user?.name || 'Usuario'
      );
      setTestResult(result);
      setShowTestResult(true);
      await loadRules(); // Recargar para ver el resultado de la prueba
    } catch (error) {
      console.error('Error testing rule:', error);
      alert('Error al probar la regla');
    }
  };

  const handleActivate = async (ruleId: string) => {
    try {
      await activateCustomAlertRule(ruleId);
      await loadRules();
    } catch (error) {
      console.error('Error activating rule:', error);
      alert('Error al activar la regla');
    }
  };

  const handleDeactivate = async (ruleId: string) => {
    try {
      await deactivateCustomAlertRule(ruleId);
      await loadRules();
    } catch (error) {
      console.error('Error deactivating rule:', error);
      alert('Error al desactivar la regla');
    }
  };

  const addCondition = () => {
    const newCondition: AlertCondition = {
      id: `cond-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      field: 'progress',
      operator: 'less_than',
      value: 50,
    };
    setFormData({
      ...formData,
      conditions: [...(formData.conditions || []), newCondition],
    });
  };

  const updateCondition = (conditionId: string, updates: Partial<AlertCondition>) => {
    setFormData({
      ...formData,
      conditions: formData.conditions?.map(cond =>
        cond.id === conditionId ? { ...cond, ...updates } : cond
      ),
    });
  };

  const removeCondition = (conditionId: string) => {
    setFormData({
      ...formData,
      conditions: formData.conditions?.filter(cond => cond.id !== conditionId),
    });
  };

  const getNoiseLevelColor = (level: 'low' | 'medium' | 'high') => {
    switch (level) {
      case 'low':
        return 'text-green-600 bg-green-50';
      case 'medium':
        return 'text-yellow-600 bg-yellow-50';
      case 'high':
        return 'text-red-600 bg-red-50';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Reglas de Alerta Personalizadas</h2>
          <p className="text-gray-600 mt-1">Crea y gestiona reglas de alerta con condiciones múltiples, periodos y responsables</p>
        </div>
        <Button
          variant="primary"
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2"
        >
          <Plus size={20} />
          Nueva Regla
        </Button>
      </div>

      {loading ? (
        <Card className="p-8 text-center">
          <div className="text-gray-500">Cargando reglas...</div>
        </Card>
      ) : rules.length === 0 ? (
        <Card className="p-8 text-center">
          <Settings size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No hay reglas configuradas</h3>
          <p className="text-gray-600 mb-4">Crea tu primera regla de alerta personalizada</p>
          <Button variant="primary" onClick={() => handleOpenModal()}>
            <Plus size={20} className="mr-2" />
            Crear Regla
          </Button>
        </Card>
      ) : (
        <div className="space-y-4">
          {rules.map((rule) => (
            <Card key={rule.id} className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{rule.name}</h3>
                    {rule.active ? (
                      <Badge variant="green" className="flex items-center gap-1">
                        <CheckCircle size={14} />
                        Activa
                      </Badge>
                    ) : (
                      <Badge variant="gray" className="flex items-center gap-1">
                        <XCircle size={14} />
                        Inactiva
                      </Badge>
                    )}
                    {rule.enabled ? (
                      <Badge variant="blue">Habilitada</Badge>
                    ) : (
                      <Badge variant="gray">Deshabilitada</Badge>
                    )}
                  </div>
                  {rule.description && (
                    <p className="text-gray-600 mb-3">{rule.description}</p>
                  )}
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                    <div>
                      <span className="text-xs text-gray-500">Condiciones</span>
                      <p className="text-sm font-medium">{rule.conditions.length} condición(es) ({rule.conditionLogic})</p>
                    </div>
                    <div>
                      <span className="text-xs text-gray-500">Período</span>
                      <p className="text-sm font-medium capitalize">{rule.period}</p>
                    </div>
                    <div>
                      <span className="text-xs text-gray-500">Prioridad</span>
                      <p className="text-sm font-medium capitalize">{rule.priority}</p>
                    </div>
                    <div>
                      <span className="text-xs text-gray-500">Severidad</span>
                      <p className="text-sm font-medium capitalize">{rule.severity}</p>
                    </div>
                  </div>

                  {rule.lastTestedAt && (
                    <div className="text-xs text-gray-500">
                      Última prueba: {new Date(rule.lastTestedAt).toLocaleString('es-ES')}
                      {rule.testResults && rule.testResults.length > 0 && (
                        <span className="ml-2">
                          - Nivel de ruido: 
                          <span className={`ml-1 px-2 py-0.5 rounded ${getNoiseLevelColor(rule.testResults[rule.testResults.length - 1].noiseLevel)}`}>
                            {rule.testResults[rule.testResults.length - 1].noiseLevel === 'low' ? 'Bajo' : 
                             rule.testResults[rule.testResults.length - 1].noiseLevel === 'medium' ? 'Medio' : 'Alto'}
                          </span>
                        </span>
                      )}
                    </div>
                  )}
                </div>
                
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleTest(rule)}
                    className="flex items-center gap-1"
                    title="Probar regla"
                  >
                    <TestTube size={16} />
                    Probar
                  </Button>
                  {rule.active ? (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeactivate(rule.id)}
                      className="flex items-center gap-1"
                    >
                      <XCircle size={16} />
                      Desactivar
                    </Button>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleActivate(rule.id)}
                      className="flex items-center gap-1"
                      disabled={!rule.testResults || rule.testResults.length === 0}
                      title={!rule.testResults || rule.testResults.length === 0 ? 'Debes probar la regla antes de activarla' : ''}
                    >
                      <CheckCircle size={16} />
                      Activar
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleOpenModal(rule)}
                    className="flex items-center gap-1"
                  >
                    <Edit2 size={16} />
                    Editar
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(rule.id)}
                    className="flex items-center gap-1 text-red-600 hover:text-red-700"
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Modal para crear/editar regla */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingRule ? 'Editar Regla de Alerta' : 'Nueva Regla de Alerta'}
        size="large"
      >
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nombre de la regla *
            </label>
            <Input
              value={formData.name || ''}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Ej: Objetivos en riesgo con bajo progreso"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Descripción
            </label>
            <Textarea
              value={formData.description || ''}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe el propósito de esta regla"
              rows={3}
            />
          </div>

          {/* Condiciones */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="block text-sm font-medium text-gray-700">
                Condiciones *
              </label>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Lógica:</span>
                <Select
                  value={formData.conditionLogic || 'AND'}
                  onChange={(e) => setFormData({ ...formData, conditionLogic: e.target.value as AlertConditionLogic })}
                  className="w-24"
                >
                  <option value="AND">AND</option>
                  <option value="OR">OR</option>
                </Select>
                <Button variant="outline" size="sm" onClick={addCondition}>
                  <Plus size={16} className="mr-1" />
                  Agregar
                </Button>
              </div>
            </div>
            
            <div className="space-y-3">
              {formData.conditions?.map((condition, index) => (
                <Card key={condition.id} className="p-4 bg-gray-50">
                  <div className="grid grid-cols-12 gap-3 items-end">
                    <div className="col-span-3">
                      <label className="block text-xs text-gray-600 mb-1">Campo</label>
                      <Select
                        value={condition.field}
                        onChange={(e) => updateCondition(condition.id, { field: e.target.value as any })}
                      >
                        <option value="progress">Progreso</option>
                        <option value="currentValue">Valor Actual</option>
                        <option value="targetValue">Valor Objetivo</option>
                        <option value="deviation">Desviación</option>
                        <option value="daysUntilDeadline">Días hasta Deadline</option>
                        <option value="daysSinceUpdate">Días sin Actualizar</option>
                        <option value="status">Estado</option>
                        <option value="metric">Métrica</option>
                        <option value="category">Categoría</option>
                      </Select>
                    </div>
                    <div className="col-span-3">
                      <label className="block text-xs text-gray-600 mb-1">Operador</label>
                      <Select
                        value={condition.operator}
                        onChange={(e) => updateCondition(condition.id, { operator: e.target.value as AlertConditionOperator })}
                      >
                        <option value="greater_than">Mayor que</option>
                        <option value="less_than">Menor que</option>
                        <option value="equals">Igual a</option>
                        <option value="not_equals">Diferente de</option>
                        <option value="greater_or_equal">Mayor o igual</option>
                        <option value="less_or_equal">Menor o igual</option>
                        <option value="between">Entre</option>
                        <option value="contains">Contiene</option>
                        <option value="not_contains">No contiene</option>
                      </Select>
                    </div>
                    <div className="col-span-3">
                      <label className="block text-xs text-gray-600 mb-1">Valor</label>
                      <Input
                        type={condition.field === 'status' || condition.field === 'metric' || condition.field === 'category' ? 'text' : 'number'}
                        value={condition.value || ''}
                        onChange={(e) => updateCondition(condition.id, { 
                          value: condition.field === 'status' || condition.field === 'metric' || condition.field === 'category' 
                            ? e.target.value 
                            : parseFloat(e.target.value) || 0 
                        })}
                        placeholder="Valor"
                      />
                    </div>
                    {condition.operator === 'between' && (
                      <div className="col-span-2">
                        <label className="block text-xs text-gray-600 mb-1">Valor 2</label>
                        <Input
                          type="number"
                          value={condition.value2 || ''}
                          onChange={(e) => updateCondition(condition.id, { value2: parseFloat(e.target.value) || 0 })}
                          placeholder="Valor 2"
                        />
                      </div>
                    )}
                    <div className="col-span-1">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => removeCondition(condition.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <X size={16} />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
              {(!formData.conditions || formData.conditions.length === 0) && (
                <div className="text-center py-4 text-gray-500 text-sm">
                  No hay condiciones. Haz clic en "Agregar" para crear una.
                </div>
              )}
            </div>
          </div>

          {/* Período */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Período
            </label>
            <Select
              value={formData.period || 'month'}
              onChange={(e) => setFormData({ ...formData, period: e.target.value as AlertPeriod })}
            >
              <option value="day">Diario</option>
              <option value="week">Semanal</option>
              <option value="month">Mensual</option>
              <option value="quarter">Trimestral</option>
              <option value="year">Anual</option>
              <option value="custom">Personalizado</option>
            </Select>
          </div>

          {/* Configuración de alerta */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tipo de Alerta
              </label>
              <Select
                value={formData.alertType || 'objective_deviation'}
                onChange={(e) => setFormData({ ...formData, alertType: e.target.value as AlertType })}
              >
                <option value="objective_deviation">Desviación</option>
                <option value="objective_at_risk">En Riesgo</option>
                <option value="objective_not_updated">No Actualizado</option>
                <option value="kpi_critical_drop">KPI Crítico</option>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Prioridad
              </label>
              <Select
                value={formData.priority || 'medium'}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value as AlertPriority })}
              >
                <option value="low">Baja</option>
                <option value="medium">Media</option>
                <option value="high">Alta</option>
                <option value="critical">Crítica</option>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Severidad
              </label>
              <Select
                value={formData.severity || 'medium'}
                onChange={(e) => setFormData({ ...formData, severity: e.target.value as 'low' | 'medium' | 'high' })}
              >
                <option value="low">Baja</option>
                <option value="medium">Media</option>
                <option value="high">Alta</option>
              </Select>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="outline" onClick={handleCloseModal}>
              Cancelar
            </Button>
            <Button variant="primary" onClick={handleSave}>
              <Save size={16} className="mr-2" />
              Guardar
            </Button>
          </div>
        </div>
      </Modal>

      {/* Modal de resultados de prueba */}
      <Modal
        isOpen={showTestResult}
        onClose={() => setShowTestResult(false)}
        title="Resultados de la Prueba"
        size="large"
      >
        {testResult && (
          <div className="space-y-6">
            <div className={`p-4 rounded-lg ${getNoiseLevelColor(testResult.noiseLevel)}`}>
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle size={20} />
                <h3 className="font-semibold">Nivel de Ruido: {
                  testResult.noiseLevel === 'low' ? 'Bajo' : 
                  testResult.noiseLevel === 'medium' ? 'Medio' : 'Alto'
                }</h3>
              </div>
              <p className="text-sm">{testResult.noiseReason}</p>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Resumen</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-sm text-gray-600">Objetivos que cumplen condiciones:</span>
                  <p className="text-lg font-semibold">{testResult.matchedCount}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Alertas que se generarían:</span>
                  <p className="text-lg font-semibold">{testResult.wouldGenerateAlerts}</p>
                </div>
              </div>
            </div>

            {testResult.recommendations && testResult.recommendations.length > 0 && (
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Recomendaciones</h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                  {testResult.recommendations.map((rec, index) => (
                    <li key={index}>{rec}</li>
                  ))}
                </ul>
              </div>
            )}

            {testResult.sampleAlerts && testResult.sampleAlerts.length > 0 && (
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Ejemplos de Alertas (primeras 5)</h4>
                <div className="space-y-2">
                  {testResult.sampleAlerts.map((alert) => (
                    <Card key={alert.id} className="p-3 bg-gray-50">
                      <h5 className="font-medium text-gray-900">{alert.title}</h5>
                      <p className="text-sm text-gray-600">{alert.message}</p>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button variant="outline" onClick={() => setShowTestResult(false)}>
                Cerrar
              </Button>
              {testResult.noiseLevel === 'low' && (
                <Button
                  variant="primary"
                  onClick={async () => {
                    if (editingRule) {
                      await handleActivate(editingRule.id);
                      setShowTestResult(false);
                    }
                  }}
                >
                  Activar Regla
                </Button>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

