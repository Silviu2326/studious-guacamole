import React, { useState, useEffect, useMemo } from 'react';
import { Scenario, ScenarioModification, ScenarioComparison, Objective, GlobalFilters } from '../types';
import { simulateScenario, compareScenarios, saveScenario, getSavedScenarios } from '../api/scenarios';
import { getObjectives } from '../api/objectives';
import { useAuth } from '../../../context/AuthContext';
import { Card, Button, Input, Select, Modal } from '../../../components/componentsreutilizables';
import { 
  Target, 
  TrendingUp, 
  TrendingDown, 
  Plus, 
  X, 
  Loader2, 
  Save, 
  BarChart3,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  GitCompare,
  Calculator
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  Cell
} from 'recharts';

interface ScenarioSimulatorProps {
  role: 'entrenador' | 'gimnasio';
  globalFilters?: GlobalFilters;
  periodo?: 'semana' | 'mes' | 'trimestre';
}

export const ScenarioSimulator: React.FC<ScenarioSimulatorProps> = ({ role, globalFilters, periodo }) => {
  const { user } = useAuth();
  const [objectives, setObjectives] = useState<Objective[]>([]);
  const [loadingObjectives, setLoadingObjectives] = useState(true);
  const [selectedObjectiveId, setSelectedObjectiveId] = useState<string>('');
  const [scenarios, setScenarios] = useState<Scenario[]>([]);
  const [loading, setLoading] = useState(false);
  const [comparison, setComparison] = useState<ScenarioComparison | null>(null);
  const [showComparison, setShowComparison] = useState(false);
  const [savedScenarios, setSavedScenarios] = useState<Scenario[]>([]);

  // Formulario para crear nuevo escenario
  const [newScenario, setNewScenario] = useState({
    name: '',
    description: '',
    modificationType: 'target_increase' as ScenarioModification['modificationType'],
    value: 10,
    unit: '%',
  });

  useEffect(() => {
    loadObjectives();
    loadSavedScenarios();
  }, [role, globalFilters]);

  const loadObjectives = async () => {
    setLoadingObjectives(true);
    try {
      const data = await getObjectives({}, role);
      setObjectives(data);
      if (data.length > 0 && !selectedObjectiveId) {
        setSelectedObjectiveId(data[0].id);
      }
    } catch (error) {
      console.error('Error loading objectives:', error);
    } finally {
      setLoadingObjectives(false);
    }
  };

  const loadSavedScenarios = async () => {
    try {
      const saved = await getSavedScenarios(role);
      setSavedScenarios(saved);
    } catch (error) {
      console.error('Error loading saved scenarios:', error);
    }
  };

  const selectedObjective = objectives.find(obj => obj.id === selectedObjectiveId);

  const handleCreateScenario = async () => {
    if (!selectedObjectiveId || !newScenario.value) {
      alert('Por favor, selecciona un objetivo y especifica el valor de modificación');
      return;
    }

    setLoading(true);
    try {
      const modification: ScenarioModification = {
        objectiveId: selectedObjectiveId,
        objectiveTitle: selectedObjective?.title || '',
        modificationType: newScenario.modificationType,
        value: newScenario.value,
        unit: newScenario.unit,
      };

      const scenario = await simulateScenario(
        role,
        selectedObjectiveId,
        [modification],
        periodo || 'mes',
        user?.id || 'current-user',
        user?.name || 'Usuario'
      );

      // Actualizar nombre si se proporcionó
      if (newScenario.name) {
        scenario.name = newScenario.name;
      }
      if (newScenario.description) {
        scenario.description = newScenario.description;
      }

      setScenarios([...scenarios, scenario]);
      
      // Resetear formulario
      setNewScenario({
        name: '',
        description: '',
        modificationType: 'target_increase',
        value: 10,
        unit: '%',
      });
    } catch (error) {
      console.error('Error creating scenario:', error);
      alert('Error al crear el escenario');
    } finally {
      setLoading(false);
    }
  };

  const handleCompareScenarios = async () => {
    if (scenarios.length < 2) {
      alert('Necesitas al menos 2 escenarios para comparar');
      return;
    }

    setLoading(true);
    try {
      const comparisonData = await compareScenarios(
        role,
        selectedObjectiveId,
        scenarios,
        periodo || 'mes'
      );
      setComparison(comparisonData);
      setShowComparison(true);
    } catch (error) {
      console.error('Error comparing scenarios:', error);
      alert('Error al comparar escenarios');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveScenario = async (scenario: Scenario) => {
    try {
      await saveScenario(scenario);
      await loadSavedScenarios();
      alert('Escenario guardado exitosamente');
    } catch (error) {
      console.error('Error saving scenario:', error);
      alert('Error al guardar el escenario');
    }
  };

  const handleDeleteScenario = (scenarioId: string) => {
    setScenarios(scenarios.filter(s => s.id !== scenarioId));
  };

  // Datos para gráfico de comparación
  const comparisonChartData = useMemo(() => {
    if (!comparison) return [];
    
    const data: any[] = [];
    const metrics = new Set<string>();
    
    // Recopilar todas las métricas únicas
    comparison.scenarios.forEach(scenario => {
      scenario.impacts.forEach(impact => {
        metrics.add(impact.metricName);
      });
    });

    // Crear datos para cada métrica
    Array.from(metrics).forEach(metricName => {
      const metricData: any = { name: metricName };
      comparison.scenarios.forEach(scenario => {
        const impact = scenario.impacts.find(i => i.metricName === metricName);
        if (impact) {
          metricData[scenario.name] = impact.projectedValue;
        }
      });
      data.push(metricData);
    });

    return data;
  }, [comparison]);

  const getModificationLabel = (type: ScenarioModification['modificationType']) => {
    const labels = {
      target_increase: 'Aumentar objetivo',
      target_decrease: 'Reducir objetivo',
      target_set: 'Establecer objetivo',
      deadline_extend: 'Extender plazo',
      deadline_reduce: 'Reducir plazo',
    };
    return labels[type];
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="p-6 bg-white shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Calculator className="w-6 h-6 text-blue-600" />
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Simulador de Escenarios</h2>
              <p className="text-sm text-gray-600">Simula cambios hipotéticos en objetivos y visualiza el impacto proyectado</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Selector de objetivo */}
      <Card className="p-6 bg-white shadow-sm">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <Target className="inline w-4 h-4 mr-1" />
          Seleccionar Objetivo
        </label>
        {loadingObjectives ? (
          <div className="flex items-center gap-2 text-gray-600">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Cargando objetivos...</span>
          </div>
        ) : (
          <Select
            value={selectedObjectiveId}
            onChange={(e) => setSelectedObjectiveId(e.target.value)}
            className="w-full"
          >
            <option value="">Selecciona un objetivo</option>
            {objectives.map(obj => (
              <option key={obj.id} value={obj.id}>
                {obj.title} - {obj.currentValue} / {obj.targetValue} {obj.unit} ({obj.progress.toFixed(0)}%)
              </option>
            ))}
          </Select>
        )}

        {selectedObjective && (
          <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-xs text-gray-600 mb-1">Valor Actual</p>
                <p className="text-lg font-semibold text-gray-900">
                  {selectedObjective.currentValue.toLocaleString()} {selectedObjective.unit}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-600 mb-1">Objetivo</p>
                <p className="text-lg font-semibold text-gray-900">
                  {selectedObjective.targetValue.toLocaleString()} {selectedObjective.unit}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-600 mb-1">Progreso</p>
                <p className="text-lg font-semibold text-gray-900">
                  {selectedObjective.progress.toFixed(1)}%
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-600 mb-1">Estado</p>
                <p className="text-lg font-semibold text-gray-900">
                  {selectedObjective.status === 'achieved' ? '✅ Logrado' :
                   selectedObjective.status === 'in_progress' ? '🔄 En progreso' :
                   selectedObjective.status === 'at_risk' ? '⚠️ En riesgo' :
                   selectedObjective.status === 'failed' ? '❌ Fallido' : '⏸️ No iniciado'}
                </p>
              </div>
            </div>
          </div>
        )}
      </Card>

      {/* Formulario para crear escenario */}
      <Card className="p-6 bg-white shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Crear Nuevo Escenario</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nombre del Escenario (opcional)
            </label>
            <Input
              type="text"
              value={newScenario.name}
              onChange={(e) => setNewScenario({ ...newScenario, name: e.target.value })}
              placeholder="Ej: Aumentar ventas 10%"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tipo de Modificación
            </label>
            <Select
              value={newScenario.modificationType}
              onChange={(e) => setNewScenario({ ...newScenario, modificationType: e.target.value as ScenarioModification['modificationType'] })}
            >
              <option value="target_increase">Aumentar objetivo</option>
              <option value="target_decrease">Reducir objetivo</option>
              <option value="target_set">Establecer valor específico</option>
            </Select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Valor
            </label>
            <div className="flex gap-2">
              <Input
                type="number"
                value={newScenario.value}
                onChange={(e) => setNewScenario({ ...newScenario, value: parseFloat(e.target.value) || 0 })}
                placeholder="10"
              />
              <Select
                value={newScenario.unit}
                onChange={(e) => setNewScenario({ ...newScenario, unit: e.target.value })}
                className="w-24"
              >
                <option value="%">%</option>
                <option value="€">€</option>
                <option value="">Unidad</option>
              </Select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Descripción (opcional)
            </label>
            <Input
              type="text"
              value={newScenario.description}
              onChange={(e) => setNewScenario({ ...newScenario, description: e.target.value })}
              placeholder="Descripción del escenario"
            />
          </div>
        </div>
        <div className="mt-4">
          <Button
            variant="primary"
            onClick={handleCreateScenario}
            disabled={loading || !selectedObjectiveId}
            className="w-full md:w-auto"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Simulando...
              </>
            ) : (
              <>
                <Plus className="w-4 h-4 mr-2" />
                Crear Escenario
              </>
            )}
          </Button>
        </div>
      </Card>

      {/* Lista de escenarios creados */}
      {scenarios.length > 0 && (
        <Card className="p-6 bg-white shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Escenarios Creados ({scenarios.length})
            </h3>
            {scenarios.length >= 2 && (
              <Button
                variant="secondary"
                onClick={handleCompareScenarios}
                disabled={loading}
              >
                <GitCompare className="w-4 h-4 mr-2" />
                Comparar Escenarios
              </Button>
            )}
          </div>

          <div className="space-y-4">
            {scenarios.map((scenario) => (
              <div key={scenario.id} className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 mb-1">{scenario.name}</h4>
                    {scenario.description && (
                      <p className="text-sm text-gray-600 mb-2">{scenario.description}</p>
                    )}
                    <div className="flex flex-wrap gap-2 mb-3">
                      {scenario.modifications.map((mod, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-medium"
                        >
                          {getModificationLabel(mod.modificationType)}: {mod.value}{mod.unit || ''}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => handleSaveScenario(scenario)}
                      title="Guardar escenario"
                    >
                      <Save className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => handleDeleteScenario(scenario.id)}
                      title="Eliminar escenario"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {/* Impactos proyectados */}
                <div className="space-y-2">
                  <h5 className="text-sm font-medium text-gray-700">Impactos Proyectados:</h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {scenario.impacts.map((impact, idx) => (
                      <div
                        key={idx}
                        className="p-3 bg-gray-50 rounded border border-gray-200"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-gray-900">{impact.metricName}</span>
                          {impact.changePercent > 0 ? (
                            <TrendingUp className="w-4 h-4 text-green-600" />
                          ) : (
                            <TrendingDown className="w-4 h-4 text-red-600" />
                          )}
                        </div>
                        <div className="space-y-1 text-xs">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Actual:</span>
                            <span className="font-medium">{impact.currentValue.toFixed(2)} {impact.unit}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Proyectado:</span>
                            <span className={`font-semibold ${impact.changePercent > 0 ? 'text-green-600' : 'text-red-600'}`}>
                              {impact.projectedValue.toFixed(2)} {impact.unit}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Cambio:</span>
                            <span className={`font-semibold ${impact.changePercent > 0 ? 'text-green-600' : 'text-red-600'}`}>
                              {impact.changePercent > 0 ? '+' : ''}{impact.changePercent.toFixed(1)}%
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Confianza:</span>
                            <span className="font-medium">{impact.confidence}%</span>
                          </div>
                        </div>
                        {impact.reasoning && (
                          <p className="text-xs text-gray-500 mt-2 italic">{impact.reasoning}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Modal de comparación */}
      {showComparison && comparison && (
        <Modal
          isOpen={showComparison}
          onClose={() => setShowComparison(false)}
          title="Comparación de Escenarios"
          size="large"
        >
          <div className="space-y-6">
            {/* Resumen */}
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h4 className="font-semibold text-gray-900 mb-2">Resumen de Comparación</h4>
              {comparison.summary.recommendedScenario && (
                <div className="mb-2">
                  <div className="flex items-center gap-2 text-green-700">
                    <CheckCircle2 className="w-4 h-4" />
                    <span className="font-medium">Escenario Recomendado:</span>
                    <span>{comparison.scenarios.find(s => s.id === comparison.summary.recommendedScenario)?.name}</span>
                  </div>
                  {comparison.summary.recommendationReason && (
                    <p className="text-sm text-gray-700 mt-1 ml-6">{comparison.summary.recommendationReason}</p>
                  )}
                </div>
              )}
            </div>

            {/* Gráfico de comparación */}
            {comparisonChartData.length > 0 && (
              <div>
                <h4 className="font-semibold text-gray-900 mb-4">Comparación Visual de Impactos</h4>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={comparisonChartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    {comparison.scenarios.map((scenario, idx) => {
                      const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];
                      return (
                        <Bar
                          key={scenario.id}
                          dataKey={scenario.name}
                          fill={colors[idx % colors.length]}
                        />
                      );
                    })}
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}

            {/* Tabla de comparación detallada */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Comparación Detallada</h4>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left p-2 font-semibold text-gray-700">Métrica</th>
                      {comparison.scenarios.map(scenario => (
                        <th key={scenario.id} className="text-center p-2 font-semibold text-gray-700">
                          {scenario.name}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {Array.from(new Set(comparison.scenarios.flatMap(s => s.impacts.map(i => i.metricName)))).map(metricName => (
                      <tr key={metricName} className="border-b border-gray-100">
                        <td className="p-2 font-medium text-gray-900">{metricName}</td>
                        {comparison.scenarios.map(scenario => {
                          const impact = scenario.impacts.find(i => i.metricName === metricName);
                          return (
                            <td key={scenario.id} className="p-2 text-center">
                              {impact ? (
                                <div>
                                  <div className={`font-semibold ${impact.changePercent > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                    {impact.projectedValue.toFixed(2)} {impact.unit}
                                  </div>
                                  <div className="text-xs text-gray-500">
                                    {impact.changePercent > 0 ? '+' : ''}{impact.changePercent.toFixed(1)}%
                                  </div>
                                </div>
                              ) : (
                                <span className="text-gray-400">-</span>
                              )}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* Estado vacío */}
      {scenarios.length === 0 && !loading && (
        <Card className="p-8 text-center bg-white shadow-sm">
          <Calculator size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Crea tu primer escenario</h3>
          <p className="text-gray-600">
            Selecciona un objetivo y define una modificación para ver el impacto proyectado
          </p>
        </Card>
      )}
    </div>
  );
};

