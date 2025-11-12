import React, { useMemo } from 'react';
import { Card, Button, Badge } from '../../../components/componentsreutilizables';
import { IntelligenceOverviewResponse } from '../types';
import { 
  AlertCircle, 
  Lightbulb, 
  Zap,
  Target,
  MessageSquare,
  Sparkles,
  TrendingUp
} from 'lucide-react';

interface IntelligentRecommendationsProps {
  overview: IntelligenceOverviewResponse;
  onCreatePlaybook?: () => void;
  onLaunchExperiment?: () => void;
  onViewFeedback?: () => void;
}

interface Recommendation {
  id: string;
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  action: {
    label: string;
    onClick: () => void;
    icon: React.ReactNode;
  };
  metric?: string;
}

export const IntelligentRecommendations: React.FC<IntelligentRecommendationsProps> = ({
  overview,
  onCreatePlaybook,
  onLaunchExperiment,
  onViewFeedback,
}) => {
  const recommendations = useMemo<Recommendation[]>(() => {
    const recs: Recommendation[] = [];

    // Analizar métricas para generar recomendaciones
    const hasLowMetrics = overview.metrics.some(
      (m) => m.trend?.direction === 'down' || parseFloat(m.value.replace(/[^\d.]/g, '')) < 50
    );

    // Recomendación basada en experimentos
    const activeExperiments = overview.experiments.filter((e) => e.status === 'running');
    if (activeExperiments.length === 0) {
      recs.push({
        id: 'no-experiments',
        title: 'Crea tu primer test de estrategias',
        description: 'No tienes experimentos activos. Prueba diferentes mensajes para descubrir qué funciona mejor con tu audiencia.',
        priority: 'high',
        action: {
          label: 'Crear Test',
          onClick: onLaunchExperiment || (() => {}),
          icon: <Sparkles size={16} />,
        },
        metric: '0 experimentos activos',
      });
    }

    // Recomendación basada en playbooks
    const activePlaybooks = overview.playbooks.filter((p) => p.status === 'active');
    if (activePlaybooks.length < 2) {
      recs.push({
        id: 'more-playbooks',
        title: 'Amplía tu biblioteca de playbooks',
        description: 'Tienes pocos playbooks activos. Crea estrategias automatizadas para mejorar el engagement de tus clientes.',
        priority: 'medium',
        action: {
          label: 'Nuevo Playbook',
          onClick: onCreatePlaybook || (() => {}),
          icon: <Target size={16} />,
        },
        metric: `${activePlaybooks.length} playbook${activePlaybooks.length !== 1 ? 's' : ''} activo${activePlaybooks.length !== 1 ? 's' : ''}`,
      });
    }

    // Recomendación basada en feedback loops
    const activeFeedbackLoops = overview.feedbackLoops.filter((f) => f.status === 'active');
    if (activeFeedbackLoops.length === 0) {
      recs.push({
        id: 'no-feedback',
        title: 'Activa feedback inteligente',
        description: 'No tienes loops de feedback activos. Recopila opiniones de tus clientes para mejorar tus estrategias.',
        priority: 'high',
        action: {
          label: 'Ver Feedback',
          onClick: onViewFeedback || (() => {}),
          icon: <MessageSquare size={16} />,
        },
        metric: '0 loops activos',
      });
    }

    // Recomendación basada en métricas bajas
    if (hasLowMetrics) {
      recs.push({
        id: 'low-metrics',
        title: 'Optimiza tus métricas de engagement',
        description: 'Algunas métricas están descendiendo. Revisa tus estrategias y considera crear nuevos experimentos para mejorar los resultados.',
        priority: 'high',
        action: {
          label: 'Ver Métricas',
          onClick: () => {},
          icon: <TrendingUp size={16} />,
        },
        metric: 'Métricas en descenso',
      });
    }

    // Recomendación basada en insights de alta severidad
    const highSeverityInsights = overview.insights.filter((i) => i.severity === 'high');
    if (highSeverityInsights.length > 0) {
      recs.push({
        id: 'high-severity-insights',
        title: `Revisa ${highSeverityInsights.length} insight${highSeverityInsights.length !== 1 ? 's' : ''} importante${highSeverityInsights.length !== 1 ? 's' : ''}`,
        description: `Tienes ${highSeverityInsights.length} insight${highSeverityInsights.length !== 1 ? 's' : ''} de alta prioridad que requieren tu atención.`,
        priority: 'high',
        action: {
          label: 'Ver Insights',
          onClick: () => {},
          icon: <AlertCircle size={16} />,
        },
        metric: `${highSeverityInsights.length} insight${highSeverityInsights.length !== 1 ? 's' : ''} crítico${highSeverityInsights.length !== 1 ? 's' : ''}`,
      });
    }

    // Si no hay recomendaciones específicas, mostrar una genérica
    if (recs.length === 0) {
      recs.push({
        id: 'all-good',
        title: '¡Todo va bien!',
        description: 'Tus métricas están en buen estado. Considera explorar nuevas estrategias para seguir mejorando.',
        priority: 'low',
        action: {
          label: 'Explorar',
          onClick: () => {},
          icon: <Lightbulb size={16} />,
        },
      });
    }

    // Ordenar por prioridad
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    return recs.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]).slice(0, 3);
  }, [overview, onCreatePlaybook, onLaunchExperiment, onViewFeedback]);

  if (recommendations.length === 0) return null;

  const priorityColors = {
    high: 'bg-red-50 text-red-700 border-red-200',
    medium: 'bg-amber-50 text-amber-700 border-amber-200',
    low: 'bg-blue-50 text-blue-700 border-blue-200',
  };

  const priorityIcons = {
    high: <AlertCircle size={16} className="text-red-600" />,
    medium: <Lightbulb size={16} className="text-amber-600" />,
    low: <Zap size={16} className="text-blue-600" />,
  };

  return (
    <div className="mt-6 space-y-3">
      <div className="flex items-center gap-2 mb-4">
        <div className="p-2 rounded-lg bg-gradient-to-br from-indigo-100 to-purple-100 text-indigo-600">
          <Lightbulb size={18} />
        </div>
        <h3 className="text-lg font-semibold text-slate-900">Recomendaciones Inteligentes</h3>
        <Badge className="ml-auto bg-indigo-50 text-indigo-700">
          {recommendations.length} sugerencia{recommendations.length !== 1 ? 's' : ''}
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {recommendations.map((rec) => (
          <Card
            key={rec.id}
            className={`p-5 border-2 transition-all hover:shadow-md ${priorityColors[rec.priority]}`}
          >
            <div className="flex items-start gap-3 mb-3">
              {priorityIcons[rec.priority]}
              <div className="flex-1">
                <h4 className="font-semibold text-slate-900 mb-1">{rec.title}</h4>
                <p className="text-sm text-slate-600 mb-3">{rec.description}</p>
                {rec.metric && (
                  <Badge variant="secondary" size="sm" className="mb-3">
                    {rec.metric}
                  </Badge>
                )}
                <Button
                  size="sm"
                  variant={rec.priority === 'high' ? 'primary' : 'secondary'}
                  leftIcon={rec.action.icon}
                  onClick={rec.action.onClick}
                  className="w-full mt-2"
                >
                  {rec.action.label}
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default IntelligentRecommendations;

