import { ArrowDownRight, ArrowRight, ArrowUpRight } from 'lucide-react';
import { Badge, Card } from '../../../components/componentsreutilizables';
import { FunnelStage } from '../api';

interface FunnelOverviewProps {
  stages: FunnelStage[];
}

const stageLabels: Record<FunnelStage['stage'], string> = {
  lead: 'Leads captados',
  visita: 'Visitas agendadas',
  alta: 'Altas / Membresías',
};

export function FunnelOverview({ stages }: FunnelOverviewProps) {
  return (
    <Card padding="lg" className="bg-white shadow-sm ring-1 ring-slate-200">
      <header className="mb-6 flex flex-col gap-2">
        <h2 className="text-xl font-semibold text-gray-900">Embudo lead → visita → alta</h2>
        <p className="text-sm text-gray-600">
          Evalúa la conversión en cada etapa clave. Ajusta scripts, ofertas o seguimiento según los cuellos de botella detectados.
        </p>
      </header>

      <div className="grid gap-4 lg:grid-cols-3">
        {stages.map((stage, index) => {
          const conversion = stage.conversionRateToNext
            ? `${Math.round(stage.conversionRateToNext * 100)}%`
            : '—';

          const conversionIcon =
            stage.conversionRateToNext && stage.conversionRateToNext >= 0.5
              ? <ArrowUpRight size={16} className="text-emerald-500" />
              : stage.conversionRateToNext && stage.conversionRateToNext < 0.3
              ? <ArrowDownRight size={16} className="text-rose-500" />
              : <ArrowRight size={16} className="text-slate-500" />;

          return (
            <Card
              key={stage.stage}
              variant="hover"
              className="flex h-full flex-col items-center justify-between bg-slate-50 text-center ring-1 ring-slate-200"
              padding="lg"
            >
              <Badge variant="blue" size="sm" className="mb-3">
                Paso {index + 1}
              </Badge>
              <p className="text-sm font-semibold text-slate-700">{stageLabels[stage.stage]}</p>
              <p className="text-3xl font-bold text-slate-900">{stage.count}</p>
              <div className="mt-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                {conversionIcon}
                <span>Conversión a siguiente etapa: {conversion}</span>
              </div>
            </Card>
          );
        })}
      </div>
    </Card>
  );
}

