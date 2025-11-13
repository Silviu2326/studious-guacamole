import React, { useMemo } from 'react';
import { Card, Button, Badge } from '../../../components/componentsreutilizables';
import { IntelligenceOverviewResponse, DecisionStyle } from '../types';
import { 
  AlertCircle, 
  Lightbulb, 
  Zap,
  Target,
  MessageSquare,
  Sparkles,
  TrendingUp,
  BarChart3,
  RefreshCw
} from 'lucide-react';

interface IntelligentRecommendationsProps {
  overview: IntelligenceOverviewResponse;
  decisionStyle?: DecisionStyle;
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
  decisionStyle,
  onCreatePlaybook,
  onLaunchExperiment,
  onViewFeedback,
}) => {
  // Función para adaptar descripciones según el estilo de decisión
  const adaptDescription = (baseDescription: string, style?: DecisionStyle): string => {
    if (!style) return baseDescription;
    
    switch (style) {
      case 'rapido':
        // Descripciones más cortas y directas
        return baseDescription.split('.')[0] + '.';
      case 'basado-en-datos':
        // Mantener descripción completa con énfasis en datos
        return baseDescription;
      case 'iterativo':
        // Enfoque en pasos y fases
        return baseDescription + ' Puedes implementarlo en fases y ajustar según resultados.';
      default:
        return baseDescription;
    }
  };

  // Función para adaptar títulos según el estilo
  const adaptTitle = (baseTitle: string, style?: DecisionStyle): string => {
    if (!style) return baseTitle;
    
    switch (style) {
      case 'rapido':
        return baseTitle; // Títulos ya son cortos
      case 'basado-en-datos':
        return baseTitle; // Títulos descriptivos están bien
      case 'iterativo':
        return baseTitle; // Títulos descriptivos están bien
      default:
        return baseTitle;
    }
  };

  const recommendations = useMemo<Recommendation[]>(() => {
    const recs: Recommendation[] = [];

    // Analizar métricas para generar recomendaciones
    const hasLowMetrics = overview.metrics.some(
      (m) => m.trend?.direction === 'down' || parseFloat(m.value.replace(/[^\d.]/g, '')) < 50
    );

    // Recomendación basada en experimentos
    const activeExperiments = overview.experiments.filter((e) => e.status === 'running');
    if (activeExperiments.length === 0) {
      const baseDescription = 'No tienes experimentos activos. Prueba diferentes mensajes para descubrir qué funciona mejor con tu audiencia.';
      recs.push({
        id: 'no-experiments',
        title: adaptTitle('Crea tu primer test de estrategias', decisionStyle),
        description: adaptDescription(baseDescription, decisionStyle),
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
      const baseDescription = 'Tienes pocos playbooks activos. Crea estrategias automatizadas para mejorar el engagement de tus clientes.';
      recs.push({
        id: 'more-playbooks',
        title: adaptTitle('Amplía tu biblioteca de playbooks', decisionStyle),
        description: adaptDescription(baseDescription, decisionStyle),
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
      const baseDescription = 'No tienes loops de feedback activos. Recopila opiniones de tus clientes para mejorar tus estrategias.';
      recs.push({
        id: 'no-feedback',
        title: adaptTitle('Activa feedback inteligente', decisionStyle),
        description: adaptDescription(baseDescription, decisionStyle),
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
      let baseDescription = 'Algunas métricas están descendiendo. Revisa tus estrategias y considera crear nuevos experimentos para mejorar los resultados.';
      
      // Para estilo basado en datos, agregar más detalles
      if (decisionStyle === 'basado-en-datos') {
        const downMetrics = overview.metrics.filter((m) => m.trend?.direction === 'down');
        if (downMetrics.length > 0) {
          baseDescription += ` ${downMetrics.length} métrica${downMetrics.length !== 1 ? 's' : ''} en descenso detectada${downMetrics.length !== 1 ? 's' : ''}.`;
        }
      }
      
      recs.push({
        id: 'low-metrics',
        title: adaptTitle('Optimiza tus métricas de engagement', decisionStyle),
        description: adaptDescription(baseDescription, decisionStyle),
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
      let baseDescription = `Tienes ${highSeverityInsights.length} insight${highSeverityInsights.length !== 1 ? 's' : ''} de alta prioridad que requieren tu atención.`;
      
      // Para estilo basado en datos, agregar más contexto
      if (decisionStyle === 'basado-en-datos' && highSeverityInsights.length > 0) {
        const insightSources = [...new Set(highSeverityInsights.map((i) => i.source))];
        baseDescription += ` Fuentes: ${insightSources.join(', ')}.`;
      }
      
      recs.push({
        id: 'high-severity-insights',
        title: adaptTitle(`Revisa ${highSeverityInsights.length} insight${highSeverityInsights.length !== 1 ? 's' : ''} importante${highSeverityInsights.length !== 1 ? 's' : ''}`, decisionStyle),
        description: adaptDescription(baseDescription, decisionStyle),
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
      const baseDescription = 'Tus métricas están en buen estado. Considera explorar nuevas estrategias para seguir mejorando.';
      recs.push({
        id: 'all-good',
        title: adaptTitle('¡Todo va bien!', decisionStyle),
        description: adaptDescription(baseDescription, decisionStyle),
        priority: 'low',
        action: {
          label: 'Explorar',
          onClick: () => {},
          icon: <Lightbulb size={16} />,
        },
      });
    }

    // Ordenar por prioridad y limitar según estilo
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    const sortedRecs = recs.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
    
    // Para estilo rápido, mostrar máximo 2 recomendaciones
    // Para otros estilos, mostrar hasta 3
    const maxRecs = decisionStyle === 'rapido' ? 2 : 3;
    return sortedRecs.slice(0, maxRecs);
  }, [overview, decisionStyle, onCreatePlaybook, onLaunchExperiment, onViewFeedback]);

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

  // Icono según estilo de decisión
  const styleIcon = decisionStyle === 'rapido' 
    ? <Zap size={16} className="text-amber-600" />
    : decisionStyle === 'basado-en-datos'
    ? <BarChart3 size={16} className="text-blue-600" />
    : decisionStyle === 'iterativo'
    ? <RefreshCw size={16} className="text-green-600" />
    : null;

  return (
    <div className="mt-6 space-y-3">
      <div className="flex items-center gap-2 mb-4">
        <div className="p-2 rounded-lg bg-gradient-to-br from-indigo-100 to-purple-100 text-indigo-600">
          <Lightbulb size={18} />
        </div>
        <h3 className="text-lg font-semibold text-slate-900">Recomendaciones Inteligentes</h3>
        {styleIcon && (
          <Badge variant="secondary" className="flex items-center gap-1">
            {styleIcon}
            <span className="text-xs">
              {decisionStyle === 'rapido' 
                ? 'Modo rápido'
                : decisionStyle === 'basado-en-datos'
                ? 'Modo datos'
                : 'Modo iterativo'}
            </span>
          </Badge>
        )}
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

