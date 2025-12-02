import { ArrowUpRight, Award, Coins, DollarSign } from 'lucide-react';
import { Badge, Card } from '../../../components/componentsreutilizables';
import { CampaignPerformance } from '../api';

interface CampaignPerformanceTableProps {
  campaigns: CampaignPerformance[];
}

export function CampaignPerformanceTable({ campaigns }: CampaignPerformanceTableProps) {
  const bestConversion = campaigns.reduce(
    (acc, campaign) => (campaign.leadToMemberRate > acc ? campaign.leadToMemberRate : acc),
    0,
  );
  const lowestCost = campaigns.reduce(
    (acc, campaign) => (acc === 0 || campaign.costPerLead < acc ? campaign.costPerLead : acc),
    0,
  );

  return (
    <Card padding="none" className="bg-white shadow-sm ring-1 ring-slate-200">
      <div className="px-6 py-5">
        <header className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="space-y-1">
            <h2 className="text-xl font-semibold text-gray-900">Rendimiento de campañas</h2>
            <p className="text-sm text-gray-600">
              Analiza qué iniciativas convierten mejor y cómo optimizar tu presupuesto de captación.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
            <Badge variant="green" size="sm" className="flex items-center gap-1">
              <ArrowUpRight size={14} />
              Top conversión {Math.round(bestConversion * 100)}%
            </Badge>
            <Badge variant="blue" size="sm" className="flex items-center gap-1">
              <Coins size={14} />
              CPL mínimo €{lowestCost.toFixed(2)}
            </Badge>
          </div>
        </header>

        <div className="overflow-hidden rounded-2xl border border-slate-200">
          <table className="min-w-full divide-y divide-slate-200 text-sm text-slate-700">
            <thead className="bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-4 py-3 text-left">Campaña</th>
              <th className="px-4 py-3 text-left">Canal</th>
              <th className="px-4 py-3 text-right">Leads</th>
              <th className="px-4 py-3 text-right">Costo/Lead</th>
              <th className="px-4 py-3 text-right">Lead → Alta</th>
              <th className="px-4 py-3 text-right">Highlights</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white">
            {campaigns.map(campaign => {
              const isBestConversion = campaign.leadToMemberRate === bestConversion;
              const isBestCost = campaign.costPerLead === lowestCost;

              return (
                <tr key={campaign.id} className="transition-colors hover:bg-slate-50/60">
                  <td className="px-4 py-4 font-semibold text-slate-900">{campaign.name}</td>
                  <td className="px-4 py-4">
                    <Badge variant="blue" size="sm">
                      {campaign.channel}
                    </Badge>
                  </td>
                  <td className="px-4 py-4 text-right font-semibold text-slate-900">{campaign.leads}</td>
                  <td className="px-4 py-4 text-right">€{campaign.costPerLead.toFixed(2)}</td>
                  <td className="px-4 py-4 text-right">{(campaign.leadToMemberRate * 100).toFixed(0)}%</td>
                  <td className="px-4 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      {isBestConversion && (
                        <Badge variant="green" size="sm" className="flex items-center gap-1">
                          <Award size={14} />
                          Conversión top
                        </Badge>
                      )}
                      {isBestCost && (
                        <Badge variant="purple" size="sm" className="flex items-center gap-1">
                          <DollarSign size={14} />
                          Mejor CPL
                        </Badge>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        </div>

        <p className="mt-4 text-xs text-slate-500">
          * Costos integrados desde plataformas publicitarias y CRM. Pronto: comparación con objetivos y ROAS estimado.
        </p>
      </div>
    </Card>
  );
}

