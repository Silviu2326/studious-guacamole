import { Badge, Button, Card } from '../../../components/componentsreutilizables';
import type { ContentSocialSnapshot, DistributionChannel } from '../types';
import { ICON_MAP } from './iconMap';

const statusStyles: Record<
  ContentSocialSnapshot['syndication']['pipeline'][number]['status'],
  { label: string; className: string }
> = {
  briefing: { label: 'Briefing', className: 'bg-slate-100 text-slate-600' },
  'awaiting-content': { label: 'Pendiente', className: 'bg-amber-100 text-amber-700' },
  live: { label: 'En vivo', className: 'bg-emerald-100 text-emerald-700' },
  reporting: { label: 'Reportando', className: 'bg-indigo-100 text-indigo-700' },
};

const channelLabel: Record<DistributionChannel, string> = {
  instagram: 'Instagram',
  facebook: 'Facebook',
  tiktok: 'TikTok',
  linkedin: 'LinkedIn',
  youtube: 'YouTube',
  podcast: 'Podcast',
  email: 'Email',
};

interface SyndicationOverviewProps {
  syndication: ContentSocialSnapshot['syndication'];
  loading?: boolean;
}

export function SyndicationOverview({ syndication, loading }: SyndicationOverviewProps) {
  if (loading) {
    return (
      <Card className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 w-2/3 bg-slate-200 rounded" />
          <div className="h-20 bg-slate-100 rounded-2xl" />
          <div className="h-20 bg-slate-100 rounded-2xl" />
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-0 shadow-sm border border-slate-100">
      <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-slate-900 flex items-center gap-2">
            {ICON_MAP.share ? <ICON_MAP.share className="w-5 h-5 text-indigo-500" /> : null}
            Creator Syndication
          </h2>
          <p className="text-sm text-slate-500">
            {syndication.activeCampaigns} campañas activas · {syndication.creatorsNetwork} creadores en la red
          </p>
        </div>
        <Button variant="secondary" size="sm">
          Gestionar campañas
        </Button>
      </div>

      <div className="px-6 py-4 grid grid-cols-2 gap-3 border-b border-slate-100">
        <div className="rounded-2xl bg-indigo-50 text-indigo-700 p-4">
          <p className="text-xs uppercase tracking-wide font-semibold opacity-70">Campañas activas</p>
          <p className="text-2xl font-bold">{syndication.activeCampaigns}</p>
        </div>
        <div className="rounded-2xl bg-slate-100 text-slate-700 p-4">
          <p className="text-xs uppercase tracking-wide font-semibold opacity-70">Creadorxs aliados</p>
          <p className="text-2xl font-bold">{syndication.creatorsNetwork}</p>
        </div>
      </div>

      <div className="p-6 space-y-4">
        {syndication.pipeline.length === 0 ? (
          <p className="text-sm text-slate-500">
            Centraliza tus colaboraciones con creadores. Define briefs, entregables y reportes en un solo lugar.
          </p>
        ) : (
          syndication.pipeline.map((campaign) => {
            const status = statusStyles[campaign.status];

            return (
              <div
                key={campaign.id}
                className="border border-slate-100 rounded-2xl p-4 bg-white hover:border-indigo-200 transition"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge variant="green" size="sm">
                        {campaign.creator}
                      </Badge>
                      <span className={`text-xs font-semibold px-3 py-1 rounded-full ${status.className}`}>
                        {status.label}
                      </span>
                    </div>
                    <p className="text-sm font-semibold text-slate-900">{campaign.title}</p>
                    <p className="text-xs text-slate-500">
                      Persona: {campaign.persona} · Próxima entrega {campaign.nextDelivery ? new Date(campaign.nextDelivery).toLocaleDateString('es-ES', { day: '2-digit', month: 'short' }) : 'Por confirmar'}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {campaign.channels.map((channel) => (
                        <span key={channel} className="text-xs text-indigo-600 bg-indigo-50 px-2 py-1 rounded-full">
                          {channelLabel[channel]}
                        </span>
                      ))}
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">
                    Ver brief
                  </Button>
                </div>
                <p className="text-xs text-slate-400 mt-3">
                  Alcance estimado {campaign.reachEstimate?.toLocaleString('es-ES') ?? '—'} · Alineación {campaign.alignmentScore ?? 90}%
                </p>
              </div>
            );
          })
        )}

        <div className="flex items-center justify-between">
          <div className="text-sm text-slate-500">
            ¿Nuevo acuerdo? Genera el contrato y tracking link en menos de 2 minutos.
          </div>
          <Button variant="primary" size="sm">
            Crear campaña
          </Button>
        </div>
      </div>
    </Card>
  );
}






