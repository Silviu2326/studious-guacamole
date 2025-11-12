import React from 'react';
import { Card, Badge, Button, Tooltip } from '../../../components/componentsreutilizables';
import { IntelligenceInsight } from '../types';
import { Radar, LineChart, ShieldQuestion, ExternalLink } from 'lucide-react';

interface InsightsSectionProps {
  insights: IntelligenceInsight[];
}

const severityVariant: Record<IntelligenceInsight['severity'], 'purple' | 'yellow' | 'red'> = {
  low: 'purple',
  medium: 'yellow',
  high: 'red',
};

export const InsightsSection: React.FC<InsightsSectionProps> = ({ insights }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card className="p-6 bg-white shadow-sm border border-slate-200/70">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg bg-sky-100 text-sky-600">
            <LineChart size={20} />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-semibold text-slate-900">Trend Analyzer</h2>
              <Badge variant="blue" size="sm">
                Señales emergentes
              </Badge>
            </div>
            <p className="text-sm text-slate-600 mt-1">
              Identifica patrones de crecimiento y comportamientos emergentes antes que la competencia. Conecta cada insight con playbooks y experimentos.
            </p>
            <div className="mt-4 space-y-3">
              {insights.slice(0, 2).map((insight) => (
                <div key={insight.id} className="rounded-xl border border-slate-200 p-4 bg-slate-50/60">
                  <div className="flex items-center justify-between">
                    <p className="font-semibold text-slate-900">{insight.title}</p>
                    <Badge variant={severityVariant[insight.severity]} size="sm">
                      {insight.severity === 'high' ? 'Alerta' : insight.severity === 'medium' ? 'Atención' : 'Idea'}
                    </Badge>
                  </div>
                  <p className="text-sm text-slate-600 mt-2">{insight.description}</p>
                  <p className="text-xs text-slate-500 mt-2">Fuente: {insight.source}</p>
                </div>
              ))}
            </div>
            <Button className="mt-4" variant="secondary" leftIcon={<Radar size={16} />}>
              Abrir Trend Analyzer
            </Button>
          </div>
        </div>
      </Card>

      <Card className="p-6 bg-white shadow-sm border border-slate-200/70">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg bg-amber-100 text-amber-600">
            <ShieldQuestion size={20} />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-semibold text-slate-900">Competitive Analysis & Market Intelligence</h2>
              <Badge variant="orange" size="sm">
                Benchmark continuo
              </Badge>
            </div>
            <p className="text-sm text-slate-600 mt-1">
              Centraliza señales de la competencia, monitorea lanzamientos clave y acciona respuestas rápidas.
            </p>
            <div className="mt-4 space-y-3">
              {insights.slice(2).map((insight) => (
                <div key={insight.id} className="rounded-xl border border-slate-200 p-4 bg-slate-50/60">
                  <div className="flex items-center justify-between">
                    <p className="font-semibold text-slate-900">{insight.title}</p>
                    <Badge variant={severityVariant[insight.severity]} size="sm">
                      {insight.severity === 'high' ? 'Riesgo' : insight.severity === 'medium' ? 'Observación' : 'Nota'}
                    </Badge>
                  </div>
                  <p className="text-sm text-slate-600 mt-2">{insight.description}</p>
                  <p className="text-xs text-slate-500 mt-2">Fuente: {insight.source}</p>
                </div>
              ))}
            </div>
            <div className="mt-4 flex items-center gap-3">
              <Button variant="secondary" leftIcon={<ExternalLink size={16} />}>
                Ver tablero competitivo
              </Button>
              <Tooltip content="Activa alertas inteligentes para recibir notificaciones en tiempo real.">
                <span className="text-sm text-slate-500 cursor-help">Alertas inteligentes</span>
              </Tooltip>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default InsightsSection;











