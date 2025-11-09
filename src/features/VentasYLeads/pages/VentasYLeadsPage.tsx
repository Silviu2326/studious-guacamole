import { useEffect, useMemo, useState } from 'react';
import {
  BarChart3,
  CalendarClock,
  Clock3,
  Kanban,
  ListChecks,
  Plus,
  Rocket,
  Search,
  Sparkles,
  Target,
  Upload,
  Users,
} from 'lucide-react';
import {
  Button,
  Card,
  Input,
  MetricCards,
  Tabs,
  type MetricCardData,
  type TabItem,
} from '../../../components/componentsreutilizables';
import {
  fetchLeadOpportunities,
  fetchLeadSegments,
  fetchLeadWorkloadInsight,
  fetchPipelineStages,
  fetchSalesMetrics,
  type LeadOpportunity,
  type LeadSegment,
  type LeadStatus,
  type LeadWorkloadInsight,
  type PipelineStage,
  type SalesMetric,
} from '../api';
import {
  LeadDetailPanel,
  LeadOpportunitiesTable,
  LeadSegmentsPanel,
  LeadTimelineView,
  PipelineProgress,
} from '../components';

type StatusFilter = 'all' | LeadStatus;

const VIEW_TABS: TabItem[] = [
  {
    id: 'table',
    label: 'Tabla',
    icon: <ListChecks className="h-4 w-4" />,
  },
  {
    id: 'kanban',
    label: 'Kanban',
    icon: <Kanban className="h-4 w-4" />,
  },
  {
    id: 'timeline',
    label: 'Timeline',
    icon: <Clock3 className="h-4 w-4" />,
  },
];

const STATUS_LABELS: Record<LeadStatus, string> = {
  nuevo: 'Nuevo',
  contactado: 'Contactado',
  cita_agendada: 'Cita agendada',
  no_presentado: 'No presentado',
  visita_realizada: 'Visitó el centro',
  en_prueba: 'En prueba',
  cerrado_ganado: 'Cerrado ganado',
  cerrado_perdido: 'Cerrado perdido',
};

interface FilterChipProps {
  label: string;
  active: boolean;
  onClick: () => void;
  count?: number;
}

function FilterChip({ label, active, onClick, count }: FilterChipProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-sm font-medium transition ${
        active
          ? 'border-indigo-500 bg-indigo-50 text-indigo-700 shadow-sm'
          : 'border-slate-200 bg-white text-slate-600 hover:border-indigo-200 hover:text-indigo-600'
      }`}
    >
      <span>{label}</span>
      {typeof count === 'number' && (
        <span
          className={`inline-flex min-w-[1.5rem] items-center justify-center rounded-full px-2 py-0.5 text-xs ${
            active ? 'bg-white text-indigo-600' : 'bg-slate-100 text-slate-500'
          }`}
        >
          {count}
        </span>
      )}
    </button>
  );
}

export function VentasYLeadsPage() {
  const [metrics, setMetrics] = useState<SalesMetric[]>([]);
  const [pipelineStages, setPipelineStages] = useState<PipelineStage[]>([]);
  const [leads, setLeads] = useState<LeadOpportunity[]>([]);
  const [segments, setSegments] = useState<LeadSegment[]>([]);
  const [workload, setWorkload] = useState<LeadWorkloadInsight | null>(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [originFilter, setOriginFilter] = useState<string>('all');
  const [sedeFilter, setSedeFilter] = useState<string>('all');
  const [ownerFilter, setOwnerFilter] = useState<string>('all');
  const [activeView, setActiveView] = useState<string>('table');
  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null);
  const [selectedLeadIds, setSelectedLeadIds] = useState<string[]>([]);

  useEffect(() => {
    const loadData = async () => {
      const [metricsData, stagesData, leadsData, segmentsData, workloadData] = await Promise.all([
        fetchSalesMetrics(),
        fetchPipelineStages(),
        fetchLeadOpportunities(),
        fetchLeadSegments(),
        fetchLeadWorkloadInsight(),
      ]);

      setMetrics(metricsData);
      setPipelineStages(stagesData);
      setLeads(leadsData);
      setSegments(segmentsData);
      setWorkload(workloadData);
    };

    void loadData();
  }, []);

  useEffect(() => {
    if (leads.length > 0 && !selectedLeadId) {
      setSelectedLeadId(leads[0].id);
    }
  }, [leads, selectedLeadId]);

  const statusCounts = useMemo(() => {
    return leads.reduce<Record<LeadStatus, number>>((acc, lead) => {
      acc[lead.status] = (acc[lead.status] ?? 0) + 1;
      return acc;
    }, {
      nuevo: 0,
      contactado: 0,
      cita_agendada: 0,
      no_presentado: 0,
      visita_realizada: 0,
      en_prueba: 0,
      cerrado_ganado: 0,
      cerrado_perdido: 0,
    });
  }, [leads]);

  const originCounts = useMemo(() => {
    return leads.reduce<Record<string, number>>((acc, lead) => {
      acc[lead.source] = (acc[lead.source] ?? 0) + 1;
      return acc;
    }, {});
  }, [leads]);

  const sedeCounts = useMemo(() => {
    return leads.reduce<Record<string, number>>((acc, lead) => {
      acc[lead.sede] = (acc[lead.sede] ?? 0) + 1;
      return acc;
    }, {});
  }, [leads]);

  const ownerCounts = useMemo(() => {
    return leads.reduce<Record<string, number>>((acc, lead) => {
      acc[lead.owner] = (acc[lead.owner] ?? 0) + 1;
      return acc;
    }, {});
  }, [leads]);

  const originOptions = useMemo(
    () => ['all', ...Object.keys(originCounts)],
    [originCounts]
  );
  const sedeOptions = useMemo(() => ['all', ...Object.keys(sedeCounts)], [sedeCounts]);
  const ownerOptions = useMemo(() => ['all', ...Object.keys(ownerCounts)], [ownerCounts]);

  const filteredLeads = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();

    return leads.filter(lead => {
      const matchesSearch =
        term.length === 0 ||
        lead.name.toLowerCase().includes(term) ||
        lead.email.toLowerCase().includes(term) ||
        lead.phone.toLowerCase().includes(term) ||
        lead.source.toLowerCase().includes(term) ||
        lead.owner.toLowerCase().includes(term);

      const matchesStatus = statusFilter === 'all' || lead.status === statusFilter;
      const matchesOrigin = originFilter === 'all' || lead.source === originFilter;
      const matchesSede = sedeFilter === 'all' || lead.sede === sedeFilter;
      const matchesOwner = ownerFilter === 'all' || lead.owner === ownerFilter;

      return matchesSearch && matchesStatus && matchesOrigin && matchesSede && matchesOwner;
    });
  }, [leads, searchTerm, statusFilter, originFilter, sedeFilter, ownerFilter]);

  useEffect(() => {
    setSelectedLeadIds(prev =>
      prev.filter(leadId => filteredLeads.some(lead => lead.id === leadId))
    );
  }, [filteredLeads]);

  useEffect(() => {
    if (selectedLeadId && !filteredLeads.some(lead => lead.id === selectedLeadId)) {
      setSelectedLeadId(filteredLeads[0]?.id ?? null);
    }
  }, [filteredLeads, selectedLeadId]);

  const selectedLead = useMemo(
    () => leads.find(lead => lead.id === selectedLeadId) ?? null,
    [leads, selectedLeadId]
  );

  const metricCards: MetricCardData[] = useMemo(() => {
    const iconMap: Record<string, JSX.Element> = {
      'new-leads-today': <Sparkles size={18} />,
      appointments: <CalendarClock size={18} />,
      visits: <Users size={18} />,
      conversion: <Target size={18} />,
      pipeline: <BarChart3 size={18} />,
    };

    const colorMap: Record<string, MetricCardData['color']> = {
      'new-leads-today': 'info',
      appointments: 'primary',
      visits: 'success',
      conversion: 'warning',
      pipeline: 'primary',
    };

    return metrics.map(metric => {
      let value: string | number = metric.value;
      if (metric.id === 'conversion') {
        value = `${metric.value}%`;
      }
      if (metric.id === 'pipeline') {
        value = metric.value.toLocaleString('es-ES', {
          style: 'currency',
          currency: 'EUR',
          maximumFractionDigits: 0,
        });
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
        icon: iconMap[metric.id] ?? <BarChart3 size={18} />,
        color: colorMap[metric.id] ?? 'primary',
      };
    });
  }, [metrics]);

  const handleToggleSelectAll = () => {
    if (selectedLeadIds.length === filteredLeads.length) {
      setSelectedLeadIds([]);
    } else {
      setSelectedLeadIds(filteredLeads.map(lead => lead.id));
    }
  };

  const handleToggleSelectLead = (leadId: string) => {
    setSelectedLeadIds(prev =>
      prev.includes(leadId) ? prev.filter(id => id !== leadId) : [...prev, leadId]
    );
  };

  const handleBulkAction = (action: string, leadIds: string[]) => {
    console.info(`Acción masiva ${action} sobre`, leadIds);
  };

  const resetFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
    setOriginFilter('all');
    setSedeFilter('all');
    setOwnerFilter('all');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <header className="border-b border-slate-200/60 bg-white/80 backdrop-blur">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8">
          <div className="py-8">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex items-start gap-4">
                <div className="rounded-3xl bg-gradient-to-br from-indigo-100 via-purple-100 to-sky-100 p-4 ring-1 ring-indigo-200/60">
                  <Rocket className="h-7 w-7 text-indigo-600" />
                </div>
                <div className="space-y-2">
                  <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 md:text-4xl">
                    Ventas & Leads
                  </h1>
                  <p className="max-w-3xl text-sm text-slate-600 md:text-base">
                    El centro de control donde priorizas leads, accionas campañas multicanal y cierras membresías sin salir del módulo.
                  </p>
                  <div className="flex flex-wrap gap-3 text-xs uppercase tracking-wide text-slate-500">
                    <span>Pipeline completo</span>
                    <span className="h-1 w-1 rounded-full bg-slate-300" />
                    <span>Lead scoring & SLA</span>
                    <span className="h-1 w-1 rounded-full bg-slate-300" />
                    <span>Acciones rápidas omnicanal</span>
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-2 sm:flex-row">
                <Button variant="primary" leftIcon={<Plus className="h-4 w-4" />}>
                  Nuevo lead
                </Button>
                <Button variant="secondary" leftIcon={<Upload className="h-4 w-4" />}>
                  Importar leads
                </Button>
                <Button variant="ghost" leftIcon={<Sparkles className="h-4 w-4" />} onClick={resetFilters}>
                  Campaña rápida
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1600px] px-4 py-8 sm:px-6 lg:px-8">
        <div className="space-y-8">
          <MetricCards data={metricCards} columns={5} />

          <Card className="bg-white shadow-sm ring-1 ring-slate-200/70">
            <div className="space-y-6">
              <div className="grid gap-4 lg:grid-cols-[2fr,1fr] lg:items-center">
                <div className="flex flex-wrap items-center gap-3">
                  <Input
                    value={searchTerm}
                    onChange={event => setSearchTerm(event.target.value)}
                    placeholder="Buscar por nombre, email, teléfono, etiqueta..."
                    leftIcon={<Search className="h-4 w-4" />}
                    aria-label="Buscar leads"
                    className="min-w-[260px] flex-1"
                  />
                </div>
                <div className="flex flex-wrap items-center justify-end gap-2">
                  <span className="text-xs uppercase tracking-wide text-slate-400">
                    Filtros rápidos
                  </span>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Estado
                  </p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <FilterChip
                      label="Todos"
                      count={leads.length}
                      active={statusFilter === 'all'}
                      onClick={() => setStatusFilter('all')}
                    />
                    {(Object.keys(STATUS_LABELS) as LeadStatus[]).map(status => (
                      <FilterChip
                        key={status}
                        label={STATUS_LABELS[status]}
                        count={statusCounts[status]}
                        active={statusFilter === status}
                        onClick={() => setStatusFilter(status)}
                      />
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Origen
                  </p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {originOptions.map(option => (
                      <FilterChip
                        key={option}
                        label={option === 'all' ? 'Todos los canales' : option}
                        count={option === 'all' ? leads.length : originCounts[option]}
                        active={originFilter === option}
                        onClick={() => setOriginFilter(option)}
                      />
                    ))}
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Sede
                    </p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {sedeOptions.map(option => (
                        <FilterChip
                          key={option}
                          label={option === 'all' ? 'Todas las sedes' : option}
                          count={option === 'all' ? leads.length : sedeCounts[option]}
                          active={sedeFilter === option}
                          onClick={() => setSedeFilter(option)}
                        />
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Asignado a
                    </p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {ownerOptions.map(option => (
                        <FilterChip
                          key={option}
                          label={option === 'all' ? 'Todo el equipo' : option}
                          count={option === 'all' ? leads.length : ownerCounts[option]}
                          active={ownerFilter === option}
                          onClick={() => setOwnerFilter(option)}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-dashed border-slate-200 px-4 py-3 text-sm text-slate-600">
                {filteredLeads.length} leads visibles •{' '}
                {leads.length - filteredLeads.length} ocultos por filtros activos
              </div>
            </div>
          </Card>

          <LeadSegmentsPanel segments={segments} />

          <Tabs
            items={VIEW_TABS}
            activeTab={activeView}
            onTabChange={setActiveView}
            variant="pills"
            className="bg-white shadow-sm ring-1 ring-slate-200/60 rounded-2xl px-2 py-2"
          />

          <div className="flex flex-col gap-6 xl:flex-row">
            <div className="flex-1 space-y-6">
              {activeView === 'table' && (
                <LeadOpportunitiesTable
                  leads={filteredLeads}
                  selectedLeadId={selectedLeadId}
                  selectedLeadIds={selectedLeadIds}
                  onSelectLead={setSelectedLeadId}
                  onToggleSelectLead={handleToggleSelectLead}
                  onToggleSelectAll={handleToggleSelectAll}
                  onBulkAction={handleBulkAction}
                />
              )}

              {activeView === 'kanban' && (
                <PipelineProgress stages={pipelineStages} leads={filteredLeads} />
              )}

              {activeView === 'timeline' && (
                <LeadTimelineView
                  leads={filteredLeads}
                  workload={workload}
                  onSelectLead={setSelectedLeadId}
                />
              )}
            </div>

            <LeadDetailPanel
              lead={selectedLead}
              onClose={() => setSelectedLeadId(null)}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
