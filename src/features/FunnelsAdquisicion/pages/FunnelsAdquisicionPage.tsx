import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layers, Rocket, Sparkles, Target } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { Badge, Button, Card, MetricCards, Tabs } from '../../../components/componentsreutilizables';
import { WorkspaceBlueprints } from '../components';
import { FunnelsAdquisicionService } from '../services/funnelsAdquisicionService';
import {
  AcquisitionFunnelPerformance,
  AcquisitionKPI,
  AcquisitionWorkspaceBlueprint,
  FunnelsAcquisitionPeriod,
} from '../types';

const periodTabs = [
  { id: '7d', label: 'Últimos 7 días' },
  { id: '30d', label: 'Últimos 30 días' },
  { id: '90d', label: 'Últimos 90 días' },
] as const;

type SectionTabId = 'builder' | 'lead-magnet';

interface SectionTabItem {
  id: SectionTabId;
  label: string;
  icon: React.ComponentType<{ size?: number | string; className?: string }>;
}

const sectionTabItems: SectionTabItem[] = [
  { id: 'builder', label: 'Funnels & Landing Pages Builder', icon: Layers },
  { id: 'lead-magnet', label: 'Lead Magnet Factory', icon: Sparkles },
] as const;

export default function FunnelsAdquisicionPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [period, setPeriod] = useState<FunnelsAcquisitionPeriod>('30d');
  const [loadingSnapshot, setLoadingSnapshot] = useState(true);
  const [activeSection, setActiveSection] = useState<SectionTabId>('builder');
  const [kpis, setKpis] = useState<AcquisitionKPI[]>([]);
  const [funnels, setFunnels] = useState<AcquisitionFunnelPerformance[]>([]);
  const [blueprints, setBlueprints] = useState<AcquisitionWorkspaceBlueprint[]>([]);
  const [activeWorkspace, setActiveWorkspace] = useState<string>('funnels-builder');

  const loadSnapshot = useCallback(async () => {
    setLoadingSnapshot(true);
    try {
      const snapshot = await FunnelsAdquisicionService.getSnapshot(period);
      setKpis(snapshot.kpis);
      setFunnels(snapshot.funnels);
      setBlueprints(snapshot.workspaceBlueprints);
    } catch (error) {
      console.error('[FunnelsAdquisicionPage] Error cargando datos:', error);
    } finally {
      setLoadingSnapshot(false);
    }
  }, [period]);

  useEffect(() => {
    loadSnapshot();
  }, [loadSnapshot]);

  useEffect(() => {
    if (blueprints.length > 0 && !blueprints.some((blueprint) => blueprint.id === activeWorkspace)) {
      setActiveWorkspace(blueprints[0].id);
    }
  }, [blueprints, activeWorkspace]);

  const workspaceTabs = useMemo(
    () =>
      blueprints.map((workspace) => ({
        id: workspace.id,
        label: workspace.title,
      })),
    [blueprints],
  );

  const currentBlueprint = useMemo(
    () => blueprints.find((workspace) => workspace.id === activeWorkspace),
    [blueprints, activeWorkspace],
  );

  const currencyFormatter = useMemo(
    () =>
      new Intl.NumberFormat('es-ES', {
        style: 'currency',
        currency: 'EUR',
        maximumFractionDigits: 0,
      }),
    [],
  );

  const metricIcons = useMemo(() => [Rocket, Target, Layers, Sparkles], []);

  const metricCardsSkeleton = useMemo(
    () =>
      Array.from({ length: 4 }).map((_, index) => ({
        id: `loading-${index}`,
        title: 'Cargando métricas',
        value: '',
        loading: true as const,
      })),
    [],
  );

  const metricCardsData = useMemo(() => {
    if (kpis.length === 0) return [];

    return kpis.map((kpi, index) => {
      const Icon = metricIcons[index % metricIcons.length];
      const formatTargetValue = () => {
        if (typeof kpi.target === 'undefined') return undefined;
        switch (kpi.format) {
          case 'currency':
            return currencyFormatter.format(kpi.target);
          case 'percentage':
            return `${kpi.target.toFixed(1)}%`;
          case 'number':
          default:
            return kpi.target.toLocaleString('es-ES');
        }
      };

      return {
        id: kpi.id,
        title: kpi.label,
        value: FunnelsAdquisicionService.formatKpiValue(kpi),
        subtitle: formatTargetValue() ? `Objetivo: ${formatTargetValue()}` : undefined,
        trend: typeof kpi.changePercentage === 'number'
          ? {
              value: kpi.changePercentage,
              direction: kpi.trendDirection,
              label: 'vs período anterior',
            }
          : undefined,
        color:
          kpi.trendDirection === 'up'
            ? ('success' as const)
            : kpi.trendDirection === 'down'
            ? ('error' as const)
            : ('info' as const),
        icon: <Icon className="w-5 h-5 text-white" />,
      };
    });
  }, [kpis, currencyFormatter, metricIcons]);

  const metricCardsToRender = useMemo(() => {
    if (loadingSnapshot && metricCardsData.length === 0) {
      return metricCardsSkeleton;
    }
    return metricCardsData;
  }, [loadingSnapshot, metricCardsData, metricCardsSkeleton]);

  const landingPages = useMemo(
    () => [
      {
        id: 'lp-1',
        name: 'Landing Evergreen 24/7',
        objective: 'Captación de demos',
        status: 'Activa',
        updatedAt: 'Hace 2 días',
      },
      {
        id: 'lp-2',
        name: 'Landing Promoción Flash',
        objective: 'Ventas directas',
        status: 'En iteración',
        updatedAt: 'Hace 6 horas',
      },
      {
        id: 'lp-3',
        name: 'Landing Webinar IA',
        objective: 'Registro a evento',
        status: 'Borrador',
        updatedAt: 'Hace 4 días',
      },
    ],
    [],
  );

  const leadMagnets = useMemo(
    () => [
      {
        id: 'lm-1',
        title: 'Toolkit de automatización 2025',
        format: 'PDF interactivo',
        funnel: 'Evergreen IA',
        status: 'Listo para lanzar',
      },
      {
        id: 'lm-2',
        title: 'Checklist Paid Media',
        format: 'Notion template',
        funnel: 'Acquisition Sprint',
        status: 'En revisión IA',
      },
      {
        id: 'lm-3',
        title: 'Mini-curso Email + Ads',
        format: 'Email series',
        funnel: 'Full Funnel',
        status: 'Programado',
      },
    ],
    [],
  );

  const handleRefresh = () => {
    loadSnapshot();
  };

  const handleCreateFunnel = () => {
    navigate('/dashboard/marketing/funnels-adquisicion/funnel-editor');
  };

  const handleCreateLandingPage = () => {
    navigate('/dashboard/marketing/funnels-adquisicion/landing-page-editor');
  };

  const handleCreateLeadMagnet = () => {
    navigate('/dashboard/marketing/funnels-adquisicion/lead-magnet-factory');
  };

  const handleEditFunnel = (funnelId: string) => {
    navigate('/dashboard/marketing/funnels-adquisicion/funnel-editor', {
      state: { funnelId },
    });
  };

  const handleEditLandingPage = (landingPageId: string) => {
    navigate('/dashboard/marketing/funnels-adquisicion/landing-page-editor', {
      state: { landingPageId },
    });
  };

  const handleEditLeadMagnet = (leadMagnetId: string) => {
    navigate('/dashboard/marketing/funnels-adquisicion/lead-magnet-factory', {
      state: { leadMagnetId },
    });
  };

  const renderSectionContent = () => {
    if (activeSection === 'builder') {
      return (
        <div className="space-y-8">
          <div className="rounded-2xl border border-gray-200/60 bg-white/90 p-6 shadow-sm backdrop-blur-sm dark:border-slate-800/60 dark:bg-slate-900/60">
            <div className="flex flex-wrap items-start justify-between gap-3 pb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-slate-100">Funnels activos</h3>
                <p className="text-sm text-gray-600 dark:text-slate-400">
                  Visualiza performance y optimiza cada etapa antes de iterar.
                </p>
              </div>
              <Button variant="primary" size="sm" onClick={handleCreateFunnel} className="inline-flex items-center gap-2">
                <Sparkles className="h-4 w-4" />
                Crear funnel
              </Button>
            </div>
            <div className="overflow-x-auto">
              {funnels.length > 0 ? (
                <table className="min-w-full text-sm">
                  <thead className="text-left text-xs uppercase tracking-wide text-gray-500 dark:text-slate-400">
                    <tr>
                      <th className="pb-3 pr-4 font-medium">Funnel</th>
                      <th className="pb-3 px-4 font-medium text-right">Conversión</th>
                      <th className="pb-3 px-4 font-medium text-right">Revenue</th>
                      <th className="pb-3 px-4 font-medium text-right">Velocidad</th>
                      <th className="pb-3 pl-4 font-medium text-right">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200/60 dark:divide-slate-800/60">
                    {funnels.slice(0, 6).map((funnel) => (
                      <tr key={funnel.id} className="align-middle">
                        <td className="py-3 pr-4">
                          <p className="font-medium text-gray-900 dark:text-slate-100">{funnel.name}</p>
                          <p className="text-xs text-gray-500 dark:text-slate-400">Etapa {funnel.stage}</p>
                        </td>
                        <td className="py-3 px-4 text-right font-semibold text-indigo-600 dark:text-indigo-300">
                          {`${funnel.conversionRate.toFixed(1)}%`}
                        </td>
                        <td className="py-3 px-4 text-right text-gray-900 dark:text-slate-100">
                          {currencyFormatter.format(funnel.revenue)}
                        </td>
                        <td className="py-3 px-4 text-right text-gray-900 dark:text-slate-100">
                          {`${funnel.velocityDays} días`}
                        </td>
                        <td className="py-3 pl-4 text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-indigo-600 hover:text-indigo-700 dark:text-indigo-300 dark:hover:text-indigo-200"
                            onClick={() => handleEditFunnel(funnel.id)}
                          >
                            Editar
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="rounded-xl border border-dashed border-gray-200/70 bg-gray-50/60 p-6 text-center text-sm text-gray-500 dark:border-slate-800/70 dark:bg-slate-900/50 dark:text-slate-400">
                  Aún no hay funnels registrados en este período. Crea uno nuevo para comenzar a medirlo.
                </div>
              )}
            </div>
          </div>

          <div className="rounded-2xl border border-gray-200/60 bg-white/90 p-6 shadow-sm backdrop-blur-sm dark:border-slate-800/60 dark:bg-slate-900/60">
            <div className="flex flex-wrap items-start justify-between gap-3 pb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-slate-100">Landing pages</h3>
                <p className="text-sm text-gray-600 dark:text-slate-400">
                  Prioriza experiencias de conversión y lanza variaciones controladas.
                </p>
              </div>
              <Button variant="secondary" size="sm" onClick={handleCreateLandingPage}>
                Crear página
              </Button>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="text-left text-xs uppercase tracking-wide text-gray-500 dark:text-slate-400">
                  <tr>
                    <th className="pb-3 pr-4 font-medium">Página</th>
                    <th className="pb-3 px-4 font-medium">Objetivo</th>
                    <th className="pb-3 px-4 font-medium text-center">Estado</th>
                    <th className="pb-3 px-4 font-medium text-right">Actualización</th>
                    <th className="pb-3 pl-4 font-medium text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200/60 dark:divide-slate-800/60">
                  {landingPages.map((page) => (
                    <tr key={page.id} className="align-middle">
                      <td className="py-3 pr-4">
                        <p className="font-medium text-gray-900 dark:text-slate-100">{page.name}</p>
                        <p className="text-xs text-gray-500 dark:text-slate-400">ID: {page.id}</p>
                      </td>
                      <td className="py-3 px-4 text-gray-700 dark:text-slate-200">{page.objective}</td>
                      <td className="py-3 px-4 text-center">
                        <span className="inline-flex items-center rounded-full border border-indigo-200 bg-indigo-50 px-2.5 py-1 text-xs font-medium text-indigo-700 dark:border-indigo-500/40 dark:bg-indigo-500/10 dark:text-indigo-200">
                          {page.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right text-gray-600 dark:text-slate-300">{page.updatedAt}</td>
                      <td className="py-3 pl-4 text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-indigo-600 hover:text-indigo-700 dark:text-indigo-300 dark:hover:text-indigo-200"
                          onClick={() => handleEditLandingPage(page.id)}
                        >
                          Editar
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="rounded-2xl border border-gray-200/60 bg-white/90 p-6 shadow-sm backdrop-blur-sm dark:border-slate-800/60 dark:bg-slate-900/60">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
              <div className="flex items-center gap-3">
                <Target className="w-5 h-5 text-indigo-500" />
                <h2 className="text-xl font-semibold text-gray-900 dark:text-slate-100">
                  Workspaces de ejecución: crea, captura y segmenta
                </h2>
              </div>
            </div>
            <Tabs
              items={workspaceTabs}
              activeTab={activeWorkspace}
              onTabChange={(tabId) => setActiveWorkspace(tabId)}
              variant="underline"
              size="md"
              className="mb-6"
            />
            <WorkspaceBlueprints blueprint={currentBlueprint} loading={loadingSnapshot} />
          </div>

          <div className="rounded-2xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white p-6 shadow-lg flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Sparkles className="w-6 h-6" />
              <div>
                <p className="text-sm font-medium uppercase tracking-[0.2em] opacity-80">Movimiento clave del día</p>
                <h3 className="text-lg font-semibold">
                  Lanza la variante B de tu funnel evergreen y conecta audiencias dinámicas en 15 minutos.
                </h3>
              </div>
            </div>
            <Button variant="ghost" className="bg-white/10 hover:bg-white/20 text-white" onClick={handleCreateFunnel}>
              Abrir funnels → IA
            </Button>
          </div>
        </div>
      );
    }

    if (activeSection === 'lead-magnet') {
      return (
        <div className="space-y-8">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-slate-100">
            Diseña imanes de leads irresistibles
          </h2>

          <div className="rounded-2xl border border-gray-200/60 bg-white/90 p-6 shadow-sm backdrop-blur-sm dark:border-slate-800/60 dark:bg-slate-900/60">
            <div className="flex flex-wrap items-start justify-between gap-3 pb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-slate-100">Lead Magnet Factory</h3>
                <p className="text-sm text-gray-600 dark:text-slate-400">
                  Prototipea recursos de valor y asígnalos al funnel correcto con dos clics.
                </p>
              </div>
              <Button variant="primary" size="sm" onClick={handleCreateLeadMagnet} className="inline-flex items-center gap-2">
                <Sparkles className="h-4 w-4" />
                Crear lead magnet
              </Button>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="text-left text-xs uppercase tracking-wide text-gray-500 dark:text-slate-400">
                  <tr>
                    <th className="pb-3 pr-4 font-medium">Lead magnet</th>
                    <th className="pb-3 px-4 font-medium">Formato</th>
                    <th className="pb-3 px-4 font-medium">Funnel</th>
                    <th className="pb-3 px-4 font-medium text-center">Estado</th>
                    <th className="pb-3 pl-4 font-medium text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200/60 dark:divide-slate-800/60">
                  {leadMagnets.map((magnet) => (
                    <tr key={magnet.id} className="align-middle">
                      <td className="py-3 pr-4">
                        <p className="font-medium text-gray-900 dark:text-slate-100">{magnet.title}</p>
                        <p className="text-xs text-gray-500 dark:text-slate-400">ID: {magnet.id}</p>
                      </td>
                      <td className="py-3 px-4 text-gray-700 dark:text-slate-200">{magnet.format}</td>
                      <td className="py-3 px-4 text-gray-700 dark:text-slate-200">{magnet.funnel}</td>
                      <td className="py-3 px-4 text-center">
                        <span className="inline-flex items-center rounded-full border border-purple-200 bg-purple-50 px-2.5 py-1 text-xs font-medium text-purple-700 dark:border-purple-500/40 dark:bg-purple-500/10 dark:text-purple-200">
                          {magnet.status}
                        </span>
                      </td>
                      <td className="py-3 pl-4 text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-indigo-600 hover:text-indigo-700 dark:text-indigo-300 dark:hover:text-indigo-200"
                          onClick={() => handleEditLeadMagnet(magnet.id)}
                        >
                          Editar
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="rounded-2xl border border-dashed border-indigo-300 dark:border-indigo-800 bg-white/70 dark:bg-slate-900/40 p-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-sm font-medium uppercase tracking-[0.2em] text-indigo-600 dark:text-indigo-300">
                  Plantillas high-converting
                </p>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-slate-100">
                  Combina formularios dinámicos + nurturing IA para nutrir al lead antes del primer contacto.
                </h3>
              </div>
              <Button variant="primary" className="inline-flex items-center gap-2" onClick={handleCreateLeadMagnet}>
                <Sparkles className="w-4 h-4" />
                Generar lead magnet
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-[#0b1120] dark:via-[#0f172a] dark:to-[#020617]">
      <div className="border-b border-gray-200/60 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:border-gray-800/60 dark:bg-[#0b1120]/80">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6">
          <div className="py-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-gradient-to-br from-indigo-100 to-pink-200 dark:from-indigo-900/40 dark:to-pink-900/30 rounded-xl ring-1 ring-indigo-200/70">
                  <Layers className="w-6 h-6 text-indigo-600 dark:text-indigo-300" />
                </div>
                <div>
                  <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900 dark:text-slate-100">
                    Funnels & Adquisición
                  </h1>
                  <p className="text-gray-600 dark:text-slate-400 max-w-2xl">
                    Orquesta la captación y cualificación end-to-end: KPIs clave, funnels top, campañas activas,
                    eventos estratégicos y acciones IA para lanzar hoy mismo.
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <Badge variant="blue" size="md" className="shadow">
                  {user?.name ? `Hola, ${user.name.split(' ')[0]}` : 'Modo growth'}
                </Badge>
                <Button variant="primary" size="sm" onClick={handleCreateFunnel} className="inline-flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  Crear funnel
                </Button>
                <Button variant="secondary" size="sm" onClick={handleCreateLandingPage}>
                  Crear página
                </Button>
                <Button variant="ghost" size="sm" onClick={handleRefresh} className="inline-flex items-center gap-2">
                  <Sparkles className={`w-4 h-4 ${loadingSnapshot ? 'animate-spin' : ''}`} />
                  Actualizar datos
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6 py-8">
        <div className="space-y-6">
          <MetricCards data={metricCardsToRender} columns={4} />

          <Card className="p-0 bg-white shadow-sm dark:bg-slate-900/60">
            <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2 overflow-x-auto">
                {sectionTabItems.map(({ id, label, icon: Icon }) => {
                  const isActive = activeSection === id;
                  return (
                    <button
                      key={id}
                      onClick={() => setActiveSection(id)}
                      className={[
                        'inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all',
                        isActive
                          ? 'bg-indigo-50 text-indigo-700 shadow-sm ring-1 ring-indigo-200 dark:bg-indigo-500/20 dark:text-indigo-100 dark:ring-indigo-500/40'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-300 dark:hover:text-slate-100 dark:hover:bg-slate-800/60',
                      ].join(' ')}
                    >
                      <Icon size={18} className={isActive ? 'opacity-100' : 'opacity-70'} />
                      <span>{label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="px-4 py-6 space-y-6">
              {(activeSection === 'builder' || activeSection === 'lead-magnet') && (
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <Tabs
                    items={periodTabs.map((tab) => ({ id: tab.id, label: tab.label }))}
                    activeTab={period}
                    onTabChange={(tabId) => setPeriod(tabId as FunnelsAcquisitionPeriod)}
                    variant="pills"
                    size="sm"
                  />
                  <div className="flex items-center gap-2 text-sm text-indigo-600 dark:text-indigo-300">
                    <Rocket className="w-4 h-4" />
                    <span>Datos simulados con base en performance de captación y nurturing multicanal.</span>
                  </div>
                </div>
              )}

              {renderSectionContent()}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}


