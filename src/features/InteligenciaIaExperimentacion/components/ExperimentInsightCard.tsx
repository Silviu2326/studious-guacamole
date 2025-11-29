import React from 'react';
import { Card, Badge } from '../../../components/componentsreutilizables';
import { ExperimentInsight, ScalingRecommendation } from '../types';
import { TrendingUp, TrendingDown, AlertCircle, CheckCircle2, Lightbulb, ArrowRight } from 'lucide-react';

interface ExperimentInsightCardProps {
  insight: ExperimentInsight;
}

const recommendationConfig: Record<ScalingRecommendation, { 
  label: string; 
  variant: 'success' | 'warning' | 'danger' | 'info';
  icon: React.ReactNode;
  color: string;
}> = {
  scale: {
    label: 'Escalar',
    variant: 'success',
    icon: <TrendingUp size={16} />,
    color: 'text-emerald-600 bg-emerald-50 border-emerald-200',
  },
  optimize: {
    label: 'Optimizar',
    variant: 'warning',
    icon: <AlertCircle size={16} />,
    color: 'text-amber-600 bg-amber-50 border-amber-200',
  },
  stop: {
    label: 'Detener',
    variant: 'danger',
    icon: <TrendingDown size={16} />,
    color: 'text-red-600 bg-red-50 border-red-200',
  },
  'test-more': {
    label: 'Probar más',
    variant: 'info',
    icon: <Lightbulb size={16} />,
    color: 'text-blue-600 bg-blue-50 border-blue-200',
  },
};

export const ExperimentInsightCard: React.FC<ExperimentInsightCardProps> = ({ insight }) => {
  const config = recommendationConfig[insight.recommendation];

  return (
    <Card className="p-6 bg-white shadow-sm border border-slate-200/70">
      <div className="space-y-6">
        {/* Header con recomendación */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <div className={`p-2 rounded-lg ${config.color} border`}>
                {config.icon}
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-900">Insight del Experimento</h3>
                <p className="text-sm text-slate-500">Generado automáticamente por IA</p>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-end gap-2">
            <Badge variant={config.variant} size="sm" className="flex items-center gap-1">
              {config.icon}
              {config.label}
            </Badge>
            <span className="text-xs text-slate-500">
              Confianza: {insight.confidence}%
            </span>
          </div>
        </div>

        {/* Resumen */}
        <div className="bg-slate-50 rounded-lg p-4 border border-slate-200/60">
          <p className="text-sm text-slate-700 leading-relaxed">{insight.summary}</p>
        </div>

        {/* Hallazgos clave */}
        <div>
          <h4 className="text-sm font-semibold text-slate-900 mb-3 flex items-center gap-2">
            <CheckCircle2 size={16} className="text-emerald-600" />
            Hallazgos Clave
          </h4>
          <ul className="space-y-2">
            {insight.keyFindings.map((finding, index) => (
              <li key={index} className="flex items-start gap-2 text-sm text-slate-700">
                <span className="text-emerald-600 mt-1">•</span>
                <span>{finding}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Análisis de rendimiento */}
        <div>
          <h4 className="text-sm font-semibold text-slate-900 mb-3">Análisis de Rendimiento</h4>
          <div className="space-y-3">
            {insight.performanceAnalysis.map((analysis, index) => (
              <div key={index} className="bg-slate-50 rounded-lg p-4 border border-slate-200/60">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-slate-900">{analysis.metric}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-slate-900">
                      {analysis.value.toLocaleString()}
                    </span>
                    {analysis.change > 0 ? (
                      <span className="text-sm font-semibold text-emerald-600 flex items-center gap-1">
                        <TrendingUp size={14} />
                        +{analysis.change}%
                      </span>
                    ) : (
                      <span className="text-sm font-semibold text-red-600 flex items-center gap-1">
                        <TrendingDown size={14} />
                        {analysis.change}%
                      </span>
                    )}
                  </div>
                </div>
                <p className="text-xs text-slate-600">{analysis.interpretation}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Razón de la recomendación */}
        <div className="bg-blue-50 rounded-lg p-4 border border-blue-200/60">
          <h4 className="text-sm font-semibold text-slate-900 mb-2 flex items-center gap-2">
            <Lightbulb size={16} className="text-blue-600" />
            ¿Por qué {config.label.toLowerCase()}?
          </h4>
          <p className="text-sm text-slate-700 leading-relaxed">{insight.recommendationReason}</p>
        </div>

        {/* Próximos pasos */}
        <div>
          <h4 className="text-sm font-semibold text-slate-900 mb-3 flex items-center gap-2">
            <ArrowRight size={16} className="text-slate-600" />
            Próximos Pasos Sugeridos
          </h4>
          <ol className="space-y-2">
            {insight.nextSteps.map((step, index) => (
              <li key={index} className="flex items-start gap-3 text-sm text-slate-700">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center text-xs font-semibold">
                  {index + 1}
                </span>
                <span className="pt-0.5">{step}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </Card>
  );
};

export default ExperimentInsightCard;

