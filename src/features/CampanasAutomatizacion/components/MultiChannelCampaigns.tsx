import React, { useMemo, useState } from 'react';
import { Badge, Button, Card, Modal } from '../../../components/componentsreutilizables';
import { Gauge, Layers3, Sparkles } from 'lucide-react';
import { ds } from '../../adherencia/ui/ds';
import { CampanasAutomatizacionService } from '../services/campanasAutomatizacionService';
import { MultiChannelCampaign } from '../types';

const statusBadge: Record<MultiChannelCampaign['status'], { label: string; variant: React.ComponentProps<typeof Badge>['variant'] }> = {
  draft: { label: 'Borrador', variant: 'gray' },
  scheduled: { label: 'Programada', variant: 'purple' },
  running: { label: 'En marcha', variant: 'green' },
  paused: { label: 'Pausada', variant: 'yellow' },
  completed: { label: 'Finalizada', variant: 'blue' },
};

interface MultiChannelCampaignsProps {
  campaigns: MultiChannelCampaign[];
  loading?: boolean;
  className?: string;
}

export const MultiChannelCampaigns: React.FC<MultiChannelCampaignsProps> = ({
  campaigns,
  loading = false,
  className = '',
}) => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const initialFormState = useMemo(
    () => ({
      name: '',
      owner: '',
      objective: '',
      campaignType: 'journey',
      status: 'draft' as MultiChannelCampaign['status'],
      channels: [] as string[],
      startDate: '',
      endDate: '',
      budget: '',
      targetSegments: '',
      nextAction: '',
      notes: '',
      aiAssisted: true,
    }),
    []
  );
  const [formData, setFormData] = useState(initialFormState);

  const statusOptions = useMemo(
    () => [
      { value: 'draft', label: 'Borrador' },
      { value: 'scheduled', label: 'Programada' },
      { value: 'running', label: 'En marcha' },
      { value: 'paused', label: 'Pausada' },
      { value: 'completed', label: 'Finalizada' },
    ],
    []
  );

  const channelPresets = useMemo(
    () => ['Email', 'SMS', 'WhatsApp', 'Push', 'Ads', 'Automations', 'Social'],
    []
  );

  const campaignTypes = useMemo(
    () => [
      { value: 'journey', label: 'Customer Journey' },
      { value: 'retention', label: 'Retención & Win-back' },
      { value: 'promotional', label: 'Promocional / Temporal' },
      { value: 'onboarding', label: 'Onboarding / Nurturing' },
    ],
    []
  );

  const handleInputChange = (field: keyof typeof formData) => (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const value = event.target.type === 'checkbox' ? (event.target as HTMLInputElement).checked : event.target.value;
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleChannelToggle = (channel: string) => {
    setFormData((prev) => {
      const exists = prev.channels.includes(channel);
      return {
        ...prev,
        channels: exists ? prev.channels.filter((item) => item !== channel) : [...prev.channels, channel],
      };
    });
  };

  const handleCloseModal = () => {
    setIsCreateModalOpen(false);
    setFormData(initialFormState);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // Aquí se podría integrar con el servicio para persistir la campaña
    console.info('[MultiChannelCampaigns] Nueva campaña omnicanal:', formData);
    handleCloseModal();
  };

  if (loading && campaigns.length === 0) {
    return (
      <Card className={`col-span-2 ${className}`.trim()}>
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className={`${ds.shimmer} h-32`} />
          ))}
        </div>
      </Card>
    );
  }

  return (
    <Card className={`col-span-2 ${className}`.trim()}>
      <div className="flex items-start justify-between mb-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-100 to-violet-200 flex items-center justify-center">
              <Layers3 className="w-5 h-5 text-indigo-600" />
            </span>
            <h2 className={`${ds.typography.h2} ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
              Campañas omnicanal
            </h2>
          </div>
          <p className={`${ds.typography.bodySmall} ${ds.color.textSecondary} ${ds.color.textSecondaryDark}`}>
            Orquesta campañas coordinadas en email, SMS, WhatsApp y push desde un único panel.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="purple" size="md">
            {campaigns.length} activas
          </Badge>
          <Button variant="primary" size="sm" onClick={() => setIsCreateModalOpen(true)}>
            Crear campaña
          </Button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-800 text-left">
          <thead className="bg-slate-50/80 dark:bg-slate-900/40">
            <tr className={`${ds.typography.caption} uppercase tracking-wide text-slate-500 dark:text-slate-400`}>
              <th className="px-4 py-3 font-medium">Campaña</th>
              <th className="px-4 py-3 font-medium">Canales</th>
              <th className="px-4 py-3 font-medium">Segmentos objetivo</th>
              <th className="px-4 py-3 font-medium whitespace-nowrap">Presupuesto · Gasto</th>
              <th className="px-4 py-3 font-medium whitespace-nowrap">Revenue atribuido</th>
              <th className="px-4 py-3 font-medium whitespace-nowrap">Progreso</th>
              <th className="px-4 py-3 font-medium whitespace-nowrap">Próxima acción</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {campaigns.map((campaign) => {
              const spendProgress = campaign.budget === 0 ? 0 : Math.min(100, Math.round((campaign.spend / campaign.budget) * 100));
              const status = statusBadge[campaign.status];
              return (
                <tr key={campaign.id} className="bg-white/80 dark:bg-[#0f172a]/70">
                  <td className="px-4 py-4 align-top">
                    <div className="flex flex-col gap-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className={`${ds.typography.h3} ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
                          {campaign.name}
                        </span>
                        <Badge variant={status.variant}>{status.label}</Badge>
                      </div>
                      <p className={`${ds.typography.caption} ${ds.color.textMuted} ${ds.color.textMutedDark}`}>
                        Objetivo: {campaign.objective} · Owner: {campaign.owner}
                      </p>
                      <div className="flex items-center gap-2 text-sm">
                        <Gauge className="w-4 h-4 text-emerald-500" />
                        <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                          Score impacto {campaign.impactScore}%
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 align-top">
                    <div className="flex flex-wrap gap-2">
                      {campaign.channels.map((channel) => (
                        <Badge key={`${campaign.id}-${channel}`} variant="outline">
                          {channel.toUpperCase()}
                        </Badge>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-4 align-top">
                    <span className={`${ds.typography.bodySmall} ${ds.color.textPrimaryDark}`}>
                      {campaign.targetSegments.join(' · ')}
                    </span>
                  </td>
                  <td className="px-4 py-4 align-top whitespace-nowrap">
                    <div className={`${ds.typography.bodySmall} ${ds.color.textPrimaryDark}`}>
                      {CampanasAutomatizacionService.formatCurrency(campaign.spend)} de{' '}
                      {CampanasAutomatizacionService.formatCurrency(campaign.budget)} ({spendProgress}%)
                    </div>
                  </td>
                  <td className="px-4 py-4 align-top whitespace-nowrap">
                    <div className={`${ds.typography.bodySmall} font-semibold ${ds.color.textPrimaryDark}`}>
                      {CampanasAutomatizacionService.formatCurrency(campaign.revenue)}
                    </div>
                    <div className={`${ds.typography.caption} ${ds.color.textSecondary} ${ds.color.textSecondaryDark}`}>
                      Conversión {CampanasAutomatizacionService.formatPercentage(campaign.conversionRate)}
                    </div>
                  </td>
                  <td className="px-4 py-4 align-top">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className={`${ds.typography.caption} ${ds.color.textMuted} ${ds.color.textMutedDark}`}>
                          {campaign.progression}%
                        </span>
                      </div>
                      <div className="h-2 rounded-full bg-slate-100 dark:bg-slate-800">
                        <div
                          className="h-2 rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-sky-500 transition-all"
                          style={{ width: `${campaign.progression}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 align-top">
                    <div className="flex flex-wrap items-center gap-3">
                      <span className={`${ds.typography.bodySmall} ${ds.color.textPrimaryDark} bg-indigo-50/70 dark:bg-indigo-900/30 px-3 py-1.5 rounded-full`}>
                        {campaign.nextAction}
                      </span>
                      <Badge variant="green" leftIcon={<Sparkles className="w-3.5 h-3.5" />}>
                        Origen Mission Control
                      </Badge>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <Modal isOpen={isCreateModalOpen} onClose={handleCloseModal} title="Crear campaña omnicanal" size="lg">
        <div className="max-h-[80vh] overflow-y-auto pr-1">
          <form className="space-y-8" onSubmit={handleSubmit}>
          <section className="space-y-4">
            <div>
              <p className="text-sm text-slate-600 dark:text-slate-300">
                Configura las bases de tu campaña omnicanal para activar workflows coordinados y audiencias dinámicas.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                  Nombre de la campaña
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={handleInputChange('name')}
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                  placeholder="Ej. Lanzamiento verano multicanal"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                  Owner
                </label>
                <input
                  type="text"
                  value={formData.owner}
                  onChange={handleInputChange('owner')}
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                  placeholder="Nombre del responsable"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                  Tipo de campaña
                </label>
                <select
                  value={formData.campaignType}
                  onChange={handleInputChange('campaignType')}
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                >
                  {campaignTypes.map(({ value, label }) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                  Estado inicial
                </label>
                <select
                  value={formData.status}
                  onChange={handleInputChange('status')}
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                >
                  {statusOptions.map(({ value, label }) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-indigo-500 dark:text-indigo-300">
              Objetivos & alcance
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2 md:col-span-2">
                <label className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                  Objetivo principal
                </label>
                <textarea
                  rows={2}
                  value={formData.objective}
                  onChange={handleInputChange('objective')}
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                  placeholder="Ej. Incrementar conversiones demo +25% en 45 días"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                  Fecha de inicio
                </label>
                <input
                  type="date"
                  value={formData.startDate}
                  onChange={handleInputChange('startDate')}
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                  Fecha de cierre
                </label>
                <input
                  type="date"
                  value={formData.endDate}
                  onChange={handleInputChange('endDate')}
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                  Presupuesto estimado (EUR)
                </label>
                <input
                  type="number"
                  min={0}
                  value={formData.budget}
                  onChange={handleInputChange('budget')}
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                  placeholder="Ej. 4500"
                />
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-indigo-500 dark:text-indigo-300">
              Activaciones & canales
            </h3>
            <div className="space-y-3">
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                Selecciona los canales principales (puedes personalizarlos más adelante).
              </p>
              <div className="flex flex-wrap gap-2">
                {channelPresets.map((channel) => {
                  const isSelected = formData.channels.includes(channel);
                  return (
                    <button
                      key={channel}
                      type="button"
                      onClick={() => handleChannelToggle(channel)}
                      className={[
                        'rounded-full border px-4 py-1.5 text-xs font-medium transition-colors',
                        isSelected
                          ? 'border-indigo-400 bg-indigo-50 text-indigo-700 dark:border-indigo-500/60 dark:bg-indigo-500/10 dark:text-indigo-200'
                          : 'border-slate-200 text-slate-600 hover:border-indigo-300 hover:text-indigo-600 dark:border-slate-700 dark:text-slate-300 dark:hover:border-indigo-500/40 dark:hover:text-indigo-200',
                      ].join(' ')}
                    >
                      {channel}
                    </button>
                  );
                })}
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                Segmentos objetivo
              </label>
              <textarea
                rows={2}
                value={formData.targetSegments}
                onChange={handleInputChange('targetSegments')}
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                placeholder="Ej. Leads calientes · Clientes con riesgo de churn · Comunidad premium"
              />
            </div>
          </section>

          <section className="space-y-4">
            <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-indigo-500 dark:text-indigo-300">
              Coordinación & seguimiento
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                  Próxima acción sugerida
                </label>
                <input
                  type="text"
                  value={formData.nextAction}
                  onChange={handleInputChange('nextAction')}
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                  placeholder="Ej. Sincronizar audiencias Lookalike 5%"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                  Automatización asistida por IA
                </label>
                <div className="flex items-center gap-3 rounded-lg border border-slate-200 px-3 py-2 dark:border-slate-700">
                  <input
                    id="ai-assisted"
                    type="checkbox"
                    checked={formData.aiAssisted}
                    onChange={handleInputChange('aiAssisted')}
                    className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 dark:border-slate-600 dark:bg-slate-900"
                  />
                  <label htmlFor="ai-assisted" className="text-sm text-slate-600 dark:text-slate-300">
                    Activar recomendaciones y optimizaciones automáticas
                  </label>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                Notas internas
              </label>
              <textarea
                rows={3}
                value={formData.notes}
                onChange={handleInputChange('notes')}
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                placeholder="Contexto adicional, dependencias o checklist de lanzamiento."
              />
            </div>
          </section>

          <div className="flex flex-wrap items-center justify-end gap-3">
            <Button variant="ghost" type="button" onClick={handleCloseModal}>
              Cancelar
            </Button>
            <Button variant="primary" type="submit">
              Guardar campaña
            </Button>
          </div>
          </form>
        </div>
      </Modal>
    </Card>
  );
};




