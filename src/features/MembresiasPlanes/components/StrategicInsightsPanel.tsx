import { Badge, Button, Card } from '../../../components/componentsreutilizables';
import { ArrowRight, Sparkles } from 'lucide-react';
import type { StrategicInsight } from '../api';

interface StrategicInsightsPanelProps {
  insights: StrategicInsight[];
}

const iconLabel: Record<string, string> = {
  chart: 'Simulador',
  rocket: 'Upsell',
  shield: 'Retención',
};

export function StrategicInsightsPanel({ insights }: StrategicInsightsPanelProps) {
  return (
    <Card className="bg-gradient-to-br from-slate-900 via-indigo-900 to-purple-900 text-slate-100 shadow-lg ring-1 ring-indigo-500/40" padding="xl">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-indigo-200">Extras tocho</p>
            <h3 className="text-2xl font-semibold">Simulador, upgrades y heatmaps inteligentes</h3>
            <p className="text-sm text-indigo-100/80">
              Ejecuta en segundos las ideas que te hacen imbatible frente a la competencia.
            </p>
          </div>
          <Button variant="primary" leftIcon={<Sparkles size={16} />}>
            Abrir centro estratégico
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {insights.map(insight => (
            <div
              key={insight.id}
              className="flex h-full flex-col justify-between rounded-2xl border border-indigo-500/40 bg-white/10 p-5 backdrop-blur"
            >
              <div className="space-y-4">
                <Badge variant="outline" size="sm" className="!text-[11px] !px-2 !py-0.5">
                  {iconLabel[insight.icon] ?? 'Estrategia'}
                </Badge>
                <h4 className="text-lg font-semibold">{insight.title}</h4>
                <p className="text-sm text-indigo-100/80">{insight.description}</p>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <div className="text-sm font-semibold text-indigo-100">{insight.impact}</div>
                <Button variant="ghost" size="sm" rightIcon={<ArrowRight size={14} />} className="text-indigo-100 hover:text-white">
                  {insight.cta}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}

