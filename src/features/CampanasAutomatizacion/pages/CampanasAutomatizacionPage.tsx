import { ComponentType, ReactNode, useCallback, useEffect, useMemo, useState } from 'react';
import {
  LayoutDashboard,
  Layers3,
  Mail,
  MessageSquare,
  Rocket,
  RefreshCcw,
  ShieldCheck,
  Workflow,
  Plus,
  Download,
  Upload,
  Target,
  Clock,
  DollarSign,
} from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { Badge, Button, Card, MetricCards } from '../../../components/componentsreutilizables';
import type { MetricCardData } from '../../../components/componentsreutilizables';
import {
  AutomationRoadmap,
  ChannelHealth,
  EmailPrograms,
  LifecycleSequences,
  MessagingAutomations,
  MultiChannelCampaigns,
  SummaryGrid,
} from '../components';
import { CampanasAutomatizacionService } from '../services/campanasAutomatizacionService';
import {
  AutomationRoadmapItem,
  ChannelHealthMetric,
  EmailProgram,
  LifecycleSequence,
  MessagingAutomation,
  MissionControlSummary,
  MultiChannelCampaign,
} from '../types';

type TabId = 'overview' | 'campaigns' | 'email' | 'lifecycle' | 'automation' | 'operations';

interface TabItem {
  id: TabId;
  label: string;
  icon: ComponentType<{ className?: string; size?: number | string }>;
}

export default function CampanasAutomatizacionPage() {
  const { user } = useAuth();

  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState<MissionControlSummary[]>([]);
  const [campaigns, setCampaigns] = useState<MultiChannelCampaign[]>([]);
  const [emails, setEmails] = useState<EmailProgram[]>([]);
  const [sequences, setSequences] = useState<LifecycleSequence[]>([]);
  const [automations, setAutomations] = useState<MessagingAutomation[]>([]);
  const [health, setHealth] = useState<ChannelHealthMetric[]>([]);
  const [roadmap, setRoadmap] = useState<AutomationRoadmapItem[]>([]);
  const [activeTab, setActiveTab] = useState<TabId>('overview');

  const tabItems: TabItem[] = useMemo(
    () => [
      { id: 'overview', label: 'Mission Overview', icon: LayoutDashboard },
      { id: 'campaigns', label: 'Campañas Omnicanal', icon: Layers3 },
      { id: 'email', label: 'Email & Newsletters', icon: Mail },
      { id: 'lifecycle', label: 'Lifecycle Sequences', icon: Workflow },
      { id: 'automation', label: 'SMS / WhatsApp Ops', icon: MessageSquare },
      { id: 'operations', label: 'Health & Roadmap', icon: ShieldCheck },
    ],
    [],
  );

  const loadSnapshot = useCallback(async () => {
    setLoading(true);
    try {
      const snapshot = await CampanasAutomatizacionService.getSnapshot();
      setSummary(snapshot.summary);
      setCampaigns(snapshot.campaigns);
      setEmails(snapshot.emailPrograms);
      setSequences(snapshot.lifecycleSequences);
      setAutomations(snapshot.messagingAutomations);
      setHealth(snapshot.channelHealth);
      setRoadmap(snapshot.roadmap);
    } catch (error) {
      console.error('[CampanasAutomatizacion] Error cargando snapshot', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSnapshot();
  }, [loadSnapshot]);

  const missionTagline = useMemo(
    () =>
      user?.name
        ? `Coordinando automatizaciones para ${user.name.split(' ')[0]}`
        : 'Mission Control de campañas & automatización',
    [user],
  );

  const metricCardsData = useMemo<MetricCardData[]>(() => {
    const iconMapper: Record<string, ReactNode> = {
      target: <Target className="w-5 h-5 text-white" />,
      workflow: <Workflow className="w-5 h-5 text-white" />,
      clock: <Clock className="w-5 h-5 text-white" />,
      currency: <DollarSign className="w-5 h-5 text-white" />,
    };

    if (loading && summary.length === 0) {
      return Array.from({ length: 4 }).map((_, index) => ({
        id: `loading-${index}`,
        title: 'Cargando',
        value: '...',
        loading: true,
      }));
    }

    return summary.map((item) => ({
      id: item.id,
      title: item.label,
      value:
        item.id === 'avg-response'
          ? `${item.value} min`
          : item.id === 'revenue-attributed'
          ? `€${item.value.toLocaleString('es-ES')}`
          : item.value,
      subtitle: item.description,
      icon: iconMapper[item.icon] ?? iconMapper.target,
      color: item.trend === 'down' ? 'error' : item.trend === 'up' ? 'success' : 'info',
      trend: {
        value: Math.abs(item.changePercentage),
        direction: item.trend,
        label: 'vs. periodo anterior',
      },
    }));
  }, [loading, summary]);

  const showMetricCards = metricCardsData.length > 0;

  const missionCta = (
    <section className="rounded-2xl bg-gradient-to-r from-indigo-500 via-purple-500 to-sky-500 text-white p-6 shadow-lg flex flex-wrap items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <Rocket className="w-6 h-6" />
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.3em] opacity-70">Modo pro</p>
          <h3 className="text-lg font-semibold">
            Activa el Playbook “Churn Shield” en 3 clics y sincroniza mensajes en email + WhatsApp automáticamente.
          </h3>
        </div>
      </div>
      <Button variant="ghost" className="bg-white/15 hover:bg-white/25 text-white border border-white/20">
        Ver playbooks recomendados
      </Button>
    </section>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'campaigns':
        return (
          <div className="space-y-6">
            <MultiChannelCampaigns campaigns={campaigns} loading={loading} className="w-full" />
            <ChannelHealth metrics={health} loading={loading} className="w-full" />
            {missionCta}
          </div>
        );
      case 'email':
        return (
          <div className="space-y-6">
            <EmailPrograms programs={emails} loading={loading} className="w-full" />
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              <LifecycleSequences sequences={sequences} loading={loading} className="xl:col-span-2" />
              <AutomationRoadmap items={roadmap} loading={loading} className="xl:col-span-1" />
            </div>
            {missionCta}
          </div>
        );
      case 'lifecycle':
        return (
          <div className="space-y-6">
            <LifecycleSequences sequences={sequences} loading={loading} className="w-full" />
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              <MessagingAutomations automations={automations} loading={loading} className="xl:col-span-2" />
              <AutomationRoadmap items={roadmap} loading={loading} className="xl:col-span-1" />
            </div>
          </div>
        );
      case 'automation':
        return (
          <div className="space-y-6">
            <MessagingAutomations automations={automations} loading={loading} className="w-full" />
            <ChannelHealth metrics={health} loading={loading} className="w-full" />
            {missionCta}
          </div>
        );
      case 'operations':
        return (
          <div className="space-y-6">
            <SummaryGrid summary={summary} loading={loading} />
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              <ChannelHealth metrics={health} loading={loading} className="xl:col-span-2" />
              <AutomationRoadmap items={roadmap} loading={loading} className="xl:col-span-1" />
            </div>
          </div>
        );
      case 'overview':
      default:
        return (
          <div className="space-y-8">
            <SummaryGrid summary={summary} loading={loading} />
            <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
              <MultiChannelCampaigns campaigns={campaigns} loading={loading} className="xl:col-span-2" />
              <EmailPrograms programs={emails} loading={loading} className="xl:col-span-2" />
            </div>
            <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
              <LifecycleSequences sequences={sequences} loading={loading} className="xl:col-span-2" />
              <MessagingAutomations automations={automations} loading={loading} className="xl:col-span-2" />
            </div>
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              <ChannelHealth metrics={health} loading={loading} className="xl:col-span-2" />
              <AutomationRoadmap items={roadmap} loading={loading} className="xl:col-span-1" />
            </div>
            {missionCta}
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-[#050b16] dark:via-[#091020] dark:to-[#030712]">
      <header className="border-b border-slate-200/70 bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/70 dark:border-slate-800/60 dark:bg-[#050b16]/80">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-2xl bg-gradient-to-br from-indigo-200 via-purple-200 to-sky-200 dark:from-indigo-900/50 dark:via-purple-900/40 dark:to-sky-900/30 shadow-inner">
                  <Workflow className="w-7 h-7 text-indigo-700 dark:text-indigo-200" />
                </div>
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center gap-3">
                    <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
                      Campañas & Automatización
                    </h1>
                    <Badge variant="purple" size="md">
                      {missionTagline}
                    </Badge>
                  </div>
                  <p className="text-slate-600 dark:text-slate-400 max-w-2xl">
                    Mission Control para todo lo que dispara mensajes: campañas multicanal, email marketing, secuencias de
                    lifecycle y automatizaciones de SMS/WhatsApp en un único panel operativo.
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <Button size="sm" leftIcon={<Plus size={16} />}>
                  Nueva campaña
                </Button>
                <Button size="sm" variant="secondary" leftIcon={<Download size={16} />}>
                  Exportar reportes
                </Button>
                <Button size="sm" variant="ghost" leftIcon={<Upload size={16} />}>
                  Importar flujos
                </Button>
                <Button
                  size="sm"
                  variant="secondary"
                  leftIcon={<RefreshCcw size={16} className={loading ? 'animate-spin' : ''} />}
                  onClick={loadSnapshot}
                  disabled={loading}
                >
                  Actualizar datos
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {showMetricCards && <MetricCards data={metricCardsData} columns={4} />}

        <Card padding="none" className="bg-white/90 shadow-sm dark:bg-[#050b16]/80">
          <div className="px-4 py-3">
            <div
              role="tablist"
              aria-label="Secciones campañas y automatización"
              className="flex flex-wrap items-center gap-2 rounded-2xl bg-slate-100 p-1 dark:bg-slate-800/50"
            >
              {tabItems.map(({ id, label, icon: Icon }) => {
                const active = activeTab === id;
                return (
                  <button
                    key={id}
                    role="tab"
                    aria-selected={active}
                    onClick={() => setActiveTab(id)}
                    className={[
                      'inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all',
                      active
                        ? 'bg-white text-slate-900 shadow-sm ring-1 ring-slate-200 dark:bg-[#0f172a] dark:text-white dark:ring-slate-700'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-white/70 dark:text-slate-300 dark:hover:text-white dark:hover:bg-slate-700/60',
                    ].join(' ')}
                  >
                    <Icon
                      size={18}
                      className={active ? 'opacity-100' : 'opacity-70'}
                    />
                    <span>{label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </Card>

        <div className="space-y-8">{renderTabContent()}</div>
      </main>
    </div>
  );
}


