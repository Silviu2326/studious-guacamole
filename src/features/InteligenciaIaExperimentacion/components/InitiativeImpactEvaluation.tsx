import React, { useState, useEffect } from 'react';
import { Card, Badge, Button, Table, Tooltip } from '../../../components/componentsreutilizables';
import { InitiativeImpactEvaluation, InitiativeRepeatRecommendation } from '../types';
import { getInitiativeImpactEvaluationsService, evaluateInitiativeImpactService } from '../services/intelligenceService';
import { useAuth } from '../../../context/AuthContext';
import { 
  TrendingUp, 
  TrendingDown, 
  Repeat, 
  Scale, 
  XCircle, 
  FlaskConical,
  Loader2,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  BarChart3,
} from 'lucide-react';

interface InitiativeImpactEvaluationProps {
  trainerId?: string;
}

const recommendationConfig: Record<InitiativeRepeatRecommendation, {
  label: string;
  variant: 'success' | 'warning' | 'destructive' | 'secondary' | 'purple';
  icon: React.ReactNode;
  color: string;
}> = {
  'repeat': {
    label: 'Repetir',
    variant: 'success',
    icon: <Repeat size={16} />,
    color: 'text-emerald-600',
  },
  'repeat-with-modifications': {
    label: 'Repetir con modificaciones',
    variant: 'warning',
    icon: <Repeat size={16} />,
    color: 'text-amber-600',
  },
  'scale': {
    label: 'Escalar',
    variant: 'purple',
    icon: <Scale size={16} />,
    color: 'text-purple-600',
  },
  'discontinue': {
    label: 'Discontinuar',
    variant: 'destructive',
    icon: <XCircle size={16} />,
    color: 'text-rose-600',
  },
  'test-more': {
    label: 'Probar más',
    variant: 'secondary',
    icon: <FlaskConical size={16} />,
    color: 'text-slate-600',
  },
};

const performanceCategoryConfig: Record<string, { label: string; variant: 'success' | 'warning' | 'destructive' | 'secondary' }> = {
  'excellent': { label: 'Excelente', variant: 'success' },
  'good': { label: 'Bueno', variant: 'success' },
  'average': { label: 'Promedio', variant: 'warning' },
  'poor': { label: 'Pobre', variant: 'destructive' },
};

export const InitiativeImpactEvaluation: React.FC<InitiativeImpactEvaluationProps> = ({ trainerId }) => {
  const { user } = useAuth();
  const [evaluations, setEvaluations] = useState<InitiativeImpactEvaluation[]>([]);
  const [summary, setSummary] = useState<{
    totalEvaluated: number;
    recommendedToRepeat: number;
    recommendedToScale: number;
    recommendedToDiscontinue: number;
    averageEffectiveness: number;
    topPerformers: string[];
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedEvaluation, setSelectedEvaluation] = useState<InitiativeImpactEvaluation | null>(null);

  useEffect(() => {
    loadEvaluations();
  }, [trainerId]);

  const loadEvaluations = async () => {
    setLoading(true);
    try {
      const response = await getInitiativeImpactEvaluationsService({
        trainerId: trainerId || user?.id,
        limit: 10,
      });

      if (response.success) {
        setEvaluations(response.evaluations);
        setSummary(response.summary);
      }
    } catch (error) {
      console.error('Error cargando evaluaciones:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEvaluateInitiative = async (initiativeId: string, initiativeType: 'playbook' | 'experiment' | 'campaign' | 'automation') => {
    try {
      const response = await evaluateInitiativeImpactService({
        initiativeId,
        initiativeType,
        trainerId: trainerId || user?.id,
      });

      if (response.success) {
        await loadEvaluations();
        setSelectedEvaluation(response.evaluation);
      }
    } catch (error) {
      console.error('Error evaluando iniciativa:', error);
    }
  };

  if (loading) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-center py-8">
          <Loader2 size={24} className="animate-spin text-indigo-600" />
          <span className="ml-2 text-sm text-slate-600">Cargando evaluaciones...</span>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="p-6 bg-gradient-to-br from-rose-50 to-orange-50 border border-rose-200">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-rose-100 text-rose-600">
              <BarChart3 size={20} />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-900 mb-1">
                Evaluación Automática de Impacto
              </h3>
              <p className="text-sm text-slate-600">
                El sistema evalúa automáticamente el impacto de cada iniciativa y te dice si repetirla para optimizar recursos.
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            leftIcon={<RefreshCw size={16} />}
            onClick={loadEvaluations}
          >
            Actualizar
          </Button>
        </div>

        {summary && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-lg p-4 border border-slate-200">
              <div className="text-sm font-medium text-slate-700 mb-1">Total Evaluadas</div>
              <p className="text-2xl font-bold text-slate-900">{summary.totalEvaluated}</p>
            </div>
            <div className="bg-white rounded-lg p-4 border border-slate-200">
              <div className="text-sm font-medium text-slate-700 mb-1">Recomendadas Repetir</div>
              <p className="text-2xl font-bold text-emerald-600">{summary.recommendedToRepeat}</p>
            </div>
            <div className="bg-white rounded-lg p-4 border border-slate-200">
              <div className="text-sm font-medium text-slate-700 mb-1">Recomendadas Escalar</div>
              <p className="text-2xl font-bold text-purple-600">{summary.recommendedToScale}</p>
            </div>
            <div className="bg-white rounded-lg p-4 border border-slate-200">
              <div className="text-sm font-medium text-slate-700 mb-1">Efectividad Promedio</div>
              <p className="text-2xl font-bold text-slate-900">{summary.averageEffectiveness.toFixed(1)}%</p>
            </div>
          </div>
        )}

        {evaluations.length === 0 ? (
          <div className="bg-white rounded-lg p-6 border border-slate-200 text-center">
            <AlertCircle size={32} className="mx-auto text-slate-400 mb-3" />
            <p className="text-sm text-slate-600">
              Aún no hay evaluaciones de impacto. Las evaluaciones se generan automáticamente cuando las iniciativas se completan.
            </p>
          </div>
        ) : (
          <Table<InitiativeImpactEvaluation>
            data={evaluations}
            columns={[
              {
                key: 'initiativeName',
                label: 'Iniciativa',
                render: (_, row) => (
                  <div>
                    <p className="font-semibold text-slate-900">{row.initiativeName}</p>
                    <Badge variant="secondary" size="sm" className="mt-1">
                      {row.initiativeType}
                    </Badge>
                  </div>
                ),
              },
              {
                key: 'metrics.overallEffectiveness',
                label: 'Efectividad',
                render: (_, row) => (
                  <div>
                    <p className="font-semibold text-slate-900">{row.metrics.overallEffectiveness.toFixed(1)}%</p>
                    <Badge 
                      variant={performanceCategoryConfig[row.evaluation.performanceCategory].variant} 
                      size="sm"
                      className="mt-1"
                    >
                      {performanceCategoryConfig[row.evaluation.performanceCategory].label}
                    </Badge>
                  </div>
                ),
              },
              {
                key: 'metrics.roi',
                label: 'ROI',
                render: (_, row) => (
                  <span className="font-semibold text-slate-900">
                    {row.metrics.roi.toFixed(1)}%
                  </span>
                ),
              },
              {
                key: 'recommendation',
                label: 'Recomendación',
                render: (value: InitiativeRepeatRecommendation) => {
                  const config = recommendationConfig[value];
                  return (
                    <Badge variant={config.variant} size="sm" className="flex items-center gap-1 w-fit">
                      {config.icon}
                      {config.label}
                    </Badge>
                  );
                },
              },
              {
                key: 'confidence',
                label: 'Confianza',
                render: (value: number) => (
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-slate-200 rounded-full h-2 max-w-[60px]">
                      <div
                        className="bg-indigo-600 h-2 rounded-full"
                        style={{ width: `${value}%` }}
                      />
                    </div>
                    <span className="text-sm text-slate-600">{value}%</span>
                  </div>
                ),
              },
            ]}
            actions={[
              {
                label: 'Ver detalles',
                icon: <BarChart3 size={16} />,
                onClick: (row) => setSelectedEvaluation(row),
              },
            ]}
          />
        )}
      </Card>

      {/* Modal de detalle de evaluación */}
      {selectedEvaluation && (
        <Card className="p-6 bg-white border border-slate-200">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h4 className="text-xl font-semibold text-slate-900 mb-1">
                {selectedEvaluation.initiativeName}
              </h4>
              <Badge variant="secondary" size="sm">
                {selectedEvaluation.initiativeType}
              </Badge>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSelectedEvaluation(null)}
            >
              Cerrar
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-slate-50 rounded-lg p-4">
              <div className="text-sm text-slate-600 mb-1">Efectividad General</div>
              <p className="text-2xl font-bold text-slate-900">
                {selectedEvaluation.metrics.overallEffectiveness.toFixed(1)}%
              </p>
            </div>
            <div className="bg-slate-50 rounded-lg p-4">
              <div className="text-sm text-slate-600 mb-1">ROI</div>
              <p className="text-2xl font-bold text-slate-900">
                {selectedEvaluation.metrics.roi.toFixed(1)}%
              </p>
            </div>
            <div className="bg-slate-50 rounded-lg p-4">
              <div className="text-sm text-slate-600 mb-1">Ingresos Generados</div>
              <p className="text-2xl font-bold text-slate-900">
                ${selectedEvaluation.metrics.revenue.toLocaleString()}
              </p>
            </div>
          </div>

          <div className="mb-6">
            <h5 className="text-sm font-semibold text-slate-900 mb-3">Recomendación</h5>
            <div className="bg-indigo-50 rounded-lg p-4 border border-indigo-200">
              <div className="flex items-center gap-2 mb-2">
                {recommendationConfig[selectedEvaluation.recommendation].icon}
                <Badge variant={recommendationConfig[selectedEvaluation.recommendation].variant} size="sm">
                  {recommendationConfig[selectedEvaluation.recommendation].label}
                </Badge>
                <span className="text-xs text-slate-500">
                  Confianza: {selectedEvaluation.confidence}%
                </span>
              </div>
              <p className="text-sm text-slate-700">{selectedEvaluation.recommendationReason}</p>
            </div>
          </div>

          <div className="mb-6">
            <h5 className="text-sm font-semibold text-slate-900 mb-3">Resumen de Evaluación</h5>
            <p className="text-sm text-slate-600 mb-4">{selectedEvaluation.evaluation.summary}</p>
            
            {selectedEvaluation.evaluation.strengths.length > 0 && (
              <div className="mb-4">
                <h6 className="text-xs font-semibold text-emerald-700 mb-2">Fortalezas</h6>
                <ul className="space-y-1">
                  {selectedEvaluation.evaluation.strengths.map((strength, idx) => (
                    <li key={idx} className="text-sm text-slate-600 flex items-start gap-2">
                      <CheckCircle2 size={14} className="text-emerald-600 mt-0.5 flex-shrink-0" />
                      {strength}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {selectedEvaluation.evaluation.weaknesses.length > 0 && (
              <div>
                <h6 className="text-xs font-semibold text-rose-700 mb-2">Debilidades</h6>
                <ul className="space-y-1">
                  {selectedEvaluation.evaluation.weaknesses.map((weakness, idx) => (
                    <li key={idx} className="text-sm text-slate-600 flex items-start gap-2">
                      <AlertCircle size={14} className="text-rose-600 mt-0.5 flex-shrink-0" />
                      {weakness}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {selectedEvaluation.suggestedModifications && selectedEvaluation.suggestedModifications.length > 0 && (
            <div className="mb-6">
              <h5 className="text-sm font-semibold text-slate-900 mb-3">Modificaciones Sugeridas</h5>
              <div className="space-y-3">
                {selectedEvaluation.suggestedModifications.map((mod, idx) => (
                  <div key={idx} className="bg-amber-50 rounded-lg p-4 border border-amber-200">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="warning" size="sm">{mod.priority}</Badge>
                      <span className="text-sm font-medium text-slate-900">{mod.what}</span>
                    </div>
                    <p className="text-xs text-slate-600 mb-1"><strong>Por qué:</strong> {mod.why}</p>
                    <p className="text-xs text-slate-600"><strong>Impacto esperado:</strong> {mod.expectedImpact}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div>
            <h5 className="text-sm font-semibold text-slate-900 mb-3">Próximos Pasos</h5>
            <ul className="space-y-2">
              {selectedEvaluation.nextSteps.map((step, idx) => (
                <li key={idx} className="text-sm text-slate-600 flex items-start gap-2">
                  <span className="text-indigo-600 mt-0.5">•</span>
                  {step}
                </li>
              ))}
            </ul>
          </div>
        </Card>
      )}
    </div>
  );
};

export default InitiativeImpactEvaluation;

