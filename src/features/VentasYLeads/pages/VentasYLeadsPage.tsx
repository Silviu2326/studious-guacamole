import { useEffect, useMemo, useState } from 'react';
import {
  BarChart3,
  Download,
  Filter,
  Inbox,
  Kanban,
  ListChecks,
  Megaphone,
  RefreshCcw,
  Search,
  Target,
  Users,
  Rocket,
  Clock3,
} from 'lucide-react';
import {
  Button,
  Card,
  Input,
  MetricCards,
  Select,
  Tabs,
  type MetricCardData,
  type SelectOption,
  type TabItem,
} from '../../../components/componentsreutilizables';
import {
  fetchLeadOpportunities,
  fetchLeadSegments,
  fetchPipelineStages,
  fetchSalesMetrics,
  type LeadOpportunity,
  type LeadSegment,
  type PipelineStage,
  type SalesMetric,
} from '../api';
import {
  LeadOpportunitiesTable,
  LeadSegmentsPanel,
  PipelineProgress,
} from '../components';

type StatusFilter = 'all' | LeadOpportunity['status'];

const TAB_ITEMS: TabItem[] = [
  {
    id: 'leads',
    label: 'Leads',
    icon: <Users className="h-4 w-4" />,
  },
  {
    id: 'pipeline',
    label: 'Pipeline',
    icon: <Kanban className="h-4 w-4" />,
  },
  {
    id: 'outreach',
    label: 'Campañas / Outreach',
    icon: <Megaphone className="h-4 w-4" />,
  },
  {
    id: 'segments',
    label: 'Listas inteligentes',
    icon: <ListChecks className="h-4 w-4" />,
  },
  {
    id: 'inbox',
    label: 'Inbox & SLA',
    icon: <Inbox className="h-4 w-4" />,
  },
];

export function VentasYLeadsPage() {
  const [metrics, setMetrics] = useState<SalesMetric[]>([]);
  const [pipelineStages, setPipelineStages] = useState<PipelineStage[]>([]);
  const [opportunities, setOpportunities] = useState<LeadOpportunity[]>([]);
  const [segments, setSegments] = useState<LeadSegment[]>([]);

  const [searchTerm, setSearchTerm] = useState('');
  const [ownerFilter, setOwnerFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [activeTab, setActiveTab] = useState<string>('leads');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const [metricsData, stagesData, opportunitiesData, segmentsData] = await Promise.all([
        fetchSalesMetrics(),
        fetchPipelineStages(),
        fetchLeadOpportunities(),
        fetchLeadSegments(),
      ]);

      setMetrics(metricsData);
      setPipelineStages(stagesData);
      setOpportunities(opportunitiesData);
      setSegments(segmentsData);
      setLoading(false);
    };

    void loadData();
  }, []);

  const metricCards: MetricCardData[] = useMemo(() => {
    const iconMap: Record<string, JSX.Element> = {
      'monthly-revenue': <BarChart3 size={18} />,
      'lead-to-sale': <Target size={18} />,
      'pipeline-value': <Users size={18} />,
      'lead-response': <Clock3 size={18} />,
    };

    const colorMap: Record<string, MetricCardData['color']> = {
      'monthly-revenue': 'primary',
      'lead-to-sale': 'success',
      'pipeline-value': 'info',
      'lead-response': 'warning',
    };

    return metrics.map(metric => {
      let value: string | number = metric.value;
      if (metric.id === 'monthly-revenue' || metric.id === 'pipeline-value') {
        value = metric.value.toLocaleString('es-ES', {
          style: 'currency',
          currency: 'EUR',
          maximumFractionDigits: 0,
        });
      }
      if (metric.id === 'lead-to-sale') {
        value = `${metric.value}%`;
      }
      if (metric.id === 'lead-response') {
        value = `${metric.value} min`;
      }

      return {
        id: metric.id,
        title: metric.title,
        value,
        subtitle: metric.subtitle,
        trend: metric.trend
          ? {
              direction: metric.trend.direction,
              value: metric.trend.value,
              label: metric.trend.label,
            }
          : undefined,
        icon: iconMap[metric.id] ?? <Rocket size={18} />,
        color: colorMap[metric.id] ?? 'primary',
      };
    });
  }, [metrics]);

  const statusOptions: SelectOption[] = [
    { value: 'all', label: 'Todos los estados' },
    { value: 'nuevo', label: 'Nuevo' },
    { value: 'en_progreso', label: 'En progreso' },
    { value: 'ganado', label: 'Ganado' },
    { value: 'perdido', label: 'Perdido' },
  ];

  const ownerOptions: SelectOption[] = useMemo(() => {
    const uniqueOwners = Array.from(new Set(opportunities.map(opp => opp.owner)));
    return [{ value: 'all', label: 'Todo el equipo' }].concat(
      uniqueOwners.map(owner => ({
        value: owner,
        label: owner,
      }))
    );
  }, [opportunities]);

  const filteredOpportunities = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();

    return opportunities.filter(opportunity => {
      const matchesSearch =
        term.length === 0 ||
        opportunity.name.toLowerCase().includes(term) ||
        opportunity.source.toLowerCase().includes(term) ||
        opportunity.owner.toLowerCase().includes(term);

      const matchesOwner = ownerFilter === 'all' || opportunity.owner === ownerFilter;
      const matchesStatus = statusFilter === 'all' || opportunity.status === statusFilter;

      return matchesSearch && matchesOwner && matchesStatus;
    });
  }, [opportunities, searchTerm, ownerFilter, statusFilter]);

  const resetFilters = () => {
    setSearchTerm('');
    setOwnerFilter('all');
    setStatusFilter('all');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <header className="border-b border-slate-200/60 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/70">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6">
          <div className="py-8">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="flex items-center space-x-4">
                <div className="rounded-2xl bg-gradient-to-br from-indigo-100 to-purple-100 p-3 ring-1 ring-indigo-200/60">
                  <Rocket className="h-7 w-7 text-indigo-600" />
                </div>
                <div>
                  <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 md:text-4xl">
                    Ventas & Leads
                  </h1>
                  <p className="mt-1 max-w-2xl text-sm text-slate-600 md:text-base">
                    Gestiona el pipeline comercial, detecta cuellos de botella y optimiza
                    la conversión de leads a ventas cerradas.
                  </p>
                </div>
              </div>
              <div className="flex flex-col gap-2 sm:flex-row">
                <Button variant="secondary" leftIcon={<Download size={16} />}>
                  Exportar resumen
                </Button>
                <Button variant="ghost" leftIcon={<RefreshCcw size={16} />} onClick={resetFilters}>
                  Restablecer filtros
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1600px] px-4 py-8 sm:px-6 lg:px-6">
        <div className="space-y-8">
          <MetricCards data={metricCards} columns={4} />

          <Tabs
            items={TAB_ITEMS}
            activeTab={activeTab}
            onTabChange={setActiveTab}
            variant="underline"
            className="bg-white shadow-sm ring-1 ring-slate-200/70 dark:ring-slate-700/40 rounded-2xl px-4 py-3"
          />

          {activeTab === 'leads' && (
            <>
              <Card className="bg-white shadow-sm ring-1 ring-slate-200/70 dark:ring-slate-700/40">
                <div className="space-y-6">
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                    <div className="flex-1 space-y-4">
                      <div className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200 dark:bg-slate-900/40 dark:ring-slate-700/50">
                        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                          Filtra y prioriza oportunidades
                        </h2>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          Combina filtros para enfocarte en segmentos de mayor impacto y mejorar
                          la velocidad de respuesta.
                        </p>
                      </div>

                      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                        <Input
                          value={searchTerm}
                          onChange={event => setSearchTerm(event.target.value)}
                          placeholder="Buscar por nombre, fuente o comercial"
                          leftIcon={<Search size={16} />}
                          aria-label="Buscar oportunidades"
                        />

                        <Select
                          label="Propietario"
                          value={ownerFilter}
                          onChange={event => setOwnerFilter(event.target.value)}
                          options={ownerOptions}
                        />

                        <Select
                          label="Estado"
                          value={statusFilter}
                          onChange={event => setStatusFilter(event.target.value as StatusFilter)}
                          options={statusOptions}
                        />

                        <Button
                          variant="secondary"
                          leftIcon={<Filter size={16} />}
                          className="mt-6 w-full"
                        >
                          Guardar segmento
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-dashed border-slate-200 pt-4 text-sm text-slate-600 dark:border-slate-700 dark:text-slate-400">
                    {filteredOpportunities.length} oportunidades mostradas •{' '}
                    {opportunities.length - filteredOpportunities.length} ocultas por filtros activos
                  </div>
                </div>
              </Card>

              <LeadSegmentsPanel segments={segments} />
              <LeadOpportunitiesTable opportunities={filteredOpportunities} />
            </>
          )}

          {activeTab === 'pipeline' && (
            <>
              <PipelineProgress stages={pipelineStages} />
              <Card className="bg-white shadow-sm ring-1 ring-slate-200/70 dark:ring-slate-700/40" padding="lg">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                  Optimiza el flujo comercial
                </h3>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                  Visualiza conversiones por etapa, detecta cuellos de botella y alinea a tu equipo con tiempos de respuesta objetivo.
                </p>
                <ul className="mt-4 space-y-2 text-sm text-slate-600 dark:text-slate-300 list-disc pl-5">
                  <li>Define playbooks de salida para leads estancados.</li>
                  <li>Automatiza recordatorios cuando una etapa supera el SLA deseado.</li>
                  <li>Conecta los datos con analíticas financieras para forecast de ingresos.</li>
                </ul>
              </Card>
            </>
          )}

          {activeTab === 'outreach' && (
            <Card className="bg-white shadow-sm ring-1 ring-slate-200/70 dark:ring-slate-700/40" padding="lg">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                Campañas & Outreach
              </h3>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                Consolida aquí el rendimiento de tus campañas outbound, automatizaciones y cadencias multicanal.
              </p>
              <p className="mt-4 text-sm text-slate-600 dark:text-slate-300">
                Próximamente podrás sincronizar campañas creadas en Marketing, ver atribución por canal y lanzar secuencias sin salir del módulo.
              </p>
            </Card>
          )}

          {activeTab === 'segments' && (
            <Card className="bg-white shadow-sm ring-1 ring-slate-200/70 dark:ring-slate-700/40" padding="lg">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                Listas inteligentes
              </h3>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                Genera segmentos dinámicos basados en comportamiento, scoring y probabilidad de conversión para activar acciones automáticas.
              </p>
              <p className="mt-4 text-sm text-slate-600 dark:text-slate-300">
                Integra esta vista con tus workflows existentes y guarda configuraciones reutilizables para tu equipo de ventas.
              </p>
            </Card>
          )}

          {activeTab === 'inbox' && (
            <Card className="bg-white shadow-sm ring-1 ring-slate-200/70 dark:ring-slate-700/40" padding="lg">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                Inbox & SLA
              </h3>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                Centraliza la gestión de conversaciones, mide tiempos de respuesta y coordina hand-offs con el equipo de atención.
              </p>
              <ul className="mt-4 space-y-2 text-sm text-slate-600 dark:text-slate-300 list-disc pl-5">
                <li>Visibilidad en tiempo real de SLA por canal.</li>
                <li>Asignación inteligente según disponibilidad y carga de trabajo.</li>
                <li>Integración con alertas y bandejas compartidas.</li>
              </ul>
            </Card>
          )}

          <Card padding="lg" className="bg-white text-center shadow-sm ring-1 ring-slate-200/70">
            <p className="text-lg font-semibold text-slate-900">
              Próximamente
            </p>
            <p className="mt-2 text-slate-600">
              Automatizaciones para hand-off entre marketing y ventas, scoring predictivo y dashboards por sede.
            </p>
          </Card>
        </div>
      </main>
    </div>
  );
}

