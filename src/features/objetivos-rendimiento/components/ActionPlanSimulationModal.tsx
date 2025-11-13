import React, { useState, useEffect } from 'react';
import { Modal, Button, Badge, Card } from '../../../components/componentsreutilizables';
import { 
  ActionPlanSimulationResult, 
  ObjectiveImpact,
  SimulationRecommendation,
  SimulationWarning 
} from '../api/actionPlanSimulation';
import { simulateActionPlanImpact } from '../api/actionPlanSimulation';
import { ActionPlan } from '../types';
import { Objective } from '../types';
import { 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  Target,
  Loader2,
  Sparkles,
  AlertCircle,
  Lightbulb,
  X
} from 'lucide-react';

interface ActionPlanSimulationModalProps {
  isOpen: boolean;
  onClose: () => void;
  actionPlan: ActionPlan;
  objectives: Objective[];
  onApprove: () => void;
  onCancel: () => void;
}

export const ActionPlanSimulationModal: React.FC<ActionPlanSimulationModalProps> = ({
  isOpen,
  onClose,
  actionPlan,
  objectives,
  onApprove,
  onCancel,
}) => {
  const [simulation, setSimulation] = useState<ActionPlanSimulationResult | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && actionPlan && objectives.length > 0) {
      runSimulation();
    }
  }, [isOpen, actionPlan?.id, objectives.length]);

  const runSimulation = async () => {
    setIsSimulating(true);
    setError(null);
    try {
      const result = await simulateActionPlanImpact(actionPlan, objectives);
      setSimulation(result);
    } catch (err) {
      console.error('Error running simulation:', err);
      setError('Error al ejecutar la simulación. Por favor, intenta de nuevo.');
    } finally {
      setIsSimulating(false);
    }
  };

  const getRiskColor = (risk: 'low' | 'medium' | 'high') => {
    switch (risk) {
      case 'high':
        return 'bg-red-100 text-red-700 border-red-300';
      case 'medium':
        return 'bg-yellow-100 text-yellow-700 border-yellow-300';
      case 'low':
        return 'bg-green-100 text-green-700 border-green-300';
    }
  };

  const getImpactColor = (impact: number) => {
    if (impact >= 70) return 'text-green-600';
    if (impact >= 40) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Simulación de Impacto del Plan de Acción"
      size="xl"
      footer={
        <div className="flex gap-3 justify-end">
          <Button variant="secondary" onClick={onCancel}>
            Cancelar
          </Button>
          <Button
            variant="secondary"
            onClick={runSimulation}
            disabled={isSimulating}
          >
            {isSimulating ? (
              <>
                <Loader2 size={18} className="mr-2 animate-spin" />
                Simulando...
              </>
            ) : (
              <>
                <Sparkles size={18} className="mr-2" />
                Re-simular
              </>
            )}
          </Button>
          <Button
            variant="primary"
            onClick={onApprove}
            disabled={isSimulating || !simulation}
          >
            <CheckCircle2 size={18} className="mr-2" />
            Aprobar Plan
          </Button>
        </div>
      }
    >
      <div className="space-y-6">
        {isSimulating && (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <Loader2 size={48} className="animate-spin text-blue-600 mx-auto mb-4" />
              <p className="text-gray-600">Analizando impacto del plan de acción...</p>
              <p className="text-sm text-gray-500 mt-2">Esto puede tomar unos segundos</p>
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center gap-2 text-red-800">
              <AlertCircle size={20} />
              <span className="font-medium">Error</span>
            </div>
            <p className="text-red-700 mt-2">{error}</p>
          </div>
        )}

        {simulation && !isSimulating && (
          <>
            {/* Resumen General */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Resumen General</h3>
                <Badge variant={simulation.overallImpact.riskLevel === 'high' ? 'red' : 
                               simulation.overallImpact.riskLevel === 'medium' ? 'yellow' : 'green'}>
                  Riesgo: {simulation.overallImpact.riskLevel === 'high' ? 'Alto' : 
                           simulation.overallImpact.riskLevel === 'medium' ? 'Medio' : 'Bajo'}
                </Badge>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <div className="text-sm text-gray-600 mb-1">Impacto Positivo</div>
                  <div className={`text-2xl font-bold ${getImpactColor(simulation.overallImpact.positiveImpact)}`}>
                    {simulation.overallImpact.positiveImpact}%
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-600 mb-1">Probabilidad de Éxito</div>
                  <div className={`text-2xl font-bold ${getImpactColor(simulation.overallImpact.successProbability)}`}>
                    {simulation.overallImpact.successProbability}%
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-600 mb-1">Confianza</div>
                  <div className="text-2xl font-bold text-blue-600">
                    {simulation.overallImpact.confidence}%
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-600 mb-1">Fecha Estimada</div>
                  <div className="text-sm font-medium text-gray-900">
                    {new Date(simulation.overallImpact.estimatedCompletionDate).toLocaleDateString('es-ES')}
                  </div>
                </div>
              </div>
            </Card>

            {/* Impacto por Objetivo */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Impacto por Objetivo</h3>
              <div className="space-y-4">
                {simulation.objectivesImpact.map((impact) => (
                  <Card key={impact.objectiveId} className="p-5">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900">{impact.objectiveTitle}</h4>
                        <div className="flex items-center gap-4 mt-2">
                          <div className="text-sm text-gray-600">
                            Estado actual: <Badge variant={impact.currentStatus === 'at_risk' ? 'yellow' : 'blue'}>
                              {impact.currentStatus === 'at_risk' ? 'En Riesgo' : 
                               impact.currentStatus === 'achieved' ? 'Alcanzado' : 'En Progreso'}
                            </Badge>
                          </div>
                          <div className="text-sm text-gray-600">
                            Estado predicho: <Badge variant={impact.predictedStatus === 'at_risk' ? 'yellow' : 
                                                       impact.predictedStatus === 'achieved' ? 'green' : 'blue'}>
                              {impact.predictedStatus === 'at_risk' ? 'En Riesgo' : 
                               impact.predictedStatus === 'achieved' ? 'Alcanzado' : 'En Progreso'}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-gray-600 mb-1">Impacto</div>
                        <div className={`text-xl font-bold ${getImpactColor(impact.impactScore)}`}>
                          {impact.impactScore.toFixed(0)}%
                        </div>
                      </div>
                    </div>

                    {/* Progreso */}
                    <div className="mb-4">
                      <div className="flex items-center justify-between text-sm mb-2">
                        <span className="text-gray-600">Progreso actual: {impact.currentProgress.toFixed(0)}%</span>
                        <span className="text-gray-600">Progreso predicho: {impact.predictedProgress.toFixed(0)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div 
                          className="bg-blue-600 h-3 rounded-full transition-all"
                          style={{ width: `${impact.currentProgress}%` }}
                        />
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3 mt-1">
                        <div 
                          className="bg-green-600 h-3 rounded-full transition-all"
                          style={{ width: `${impact.predictedProgress}%` }}
                        />
                        <div className="text-xs text-gray-500 mt-1">Predicción</div>
                      </div>
                      {impact.progressIncrease > 0 && (
                        <div className="flex items-center gap-1 text-green-600 text-sm mt-2">
                          <TrendingUp size={16} />
                          <span>+{impact.progressIncrease.toFixed(1)}% esperado</span>
                        </div>
                      )}
                    </div>

                    {/* Riesgos */}
                    {impact.risks.length > 0 && (
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <div className="flex items-center gap-2 mb-2">
                          <AlertTriangle size={16} className="text-yellow-600" />
                          <span className="text-sm font-medium text-gray-700">Riesgos Identificados</span>
                        </div>
                        <div className="space-y-2">
                          {impact.risks.map((risk, idx) => (
                            <div key={idx} className={`text-xs p-2 rounded ${getRiskColor(risk.severity)}`}>
                              <div className="font-medium">{risk.description}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </Card>
                ))}
              </div>
            </div>

            {/* Advertencias */}
            {simulation.warnings.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <AlertTriangle className="text-yellow-600" size={20} />
                  Advertencias
                </h3>
                <div className="space-y-3">
                  {simulation.warnings.map((warning, idx) => (
                    <div key={idx} className={`border-l-4 p-4 rounded-r-lg ${getRiskColor(warning.severity)}`}>
                      <div className="font-medium mb-1">{warning.title}</div>
                      <div className="text-sm mb-2">{warning.description}</div>
                      {warning.suggestedMitigation && (
                        <div className="text-sm italic mt-2">
                          💡 {warning.suggestedMitigation}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Recomendaciones */}
            {simulation.recommendations.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Lightbulb className="text-blue-600" size={20} />
                  Recomendaciones
                </h3>
                <div className="space-y-3">
                  {simulation.recommendations.map((rec, idx) => (
                    <div key={idx} className="border border-blue-200 bg-blue-50 p-4 rounded-lg">
                      <div className="flex items-start justify-between mb-2">
                        <div className="font-medium text-blue-900">{rec.title}</div>
                        <Badge variant={rec.priority === 'high' ? 'red' : rec.priority === 'medium' ? 'yellow' : 'blue'}>
                          {rec.priority === 'high' ? 'Alta' : rec.priority === 'medium' ? 'Media' : 'Baja'}
                        </Badge>
                      </div>
                      <div className="text-sm text-blue-800 mb-2">{rec.description}</div>
                      {rec.suggestedAction && (
                        <div className="text-sm font-medium text-blue-900 mt-2">
                          Acción sugerida: {rec.suggestedAction}
                        </div>
                      )}
                      {rec.expectedBenefit && (
                        <div className="text-sm text-green-700 mt-2">
                          Beneficio esperado: {rec.expectedBenefit}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </Modal>
  );
};

