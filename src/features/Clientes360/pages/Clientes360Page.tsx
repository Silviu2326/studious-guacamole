import { useEffect, useMemo, useState } from 'react';
import {
  AlertTriangle,
  ArrowLeft,
  CalendarClock,
  Download,
  Filter,
  MessageCircle,
  Search,
  Sparkles,
  Upload,
  UserPlus,
  Users,
  Wallet,
} from 'lucide-react';
import {
  Button,
  Card,
  Input,
  MetricCards,
  Select,
  type MetricCardData,
  type SelectOption,
} from '../../../components/componentsreutilizables';
import {
  fetchClientProfile,
  fetchClients,
  type Client360Summary,
  type ClientProfile,
  type ClientRiskLevel,
  type ClientSatisfactionLevel,
  type ClientStatus,
  type ClientType,
} from '../api';
import { ClientListTable, ClientProfileSummary } from '../components';

interface FilterState {
  statuses: ClientStatus[];
  types: ClientType[];
  riskLevels: ClientRiskLevel[];
  satisfactionLevels: ClientSatisfactionLevel[];
  branch: string;
  onlyRisk: boolean;
  onlyVip: boolean;
}

const STATUS_FILTERS: Array<{ id: ClientStatus; label: string }> = [
  { id: 'activo', label: 'Activos' },
  { id: 'pausa', label: 'En pausa' },
  { id: 'baja', label: 'De baja' },
  { id: 'lead', label: 'Leads convertidos' },
  { id: 'prueba', label: 'En prueba' },
];

const TYPE_FILTERS: Array<{ id: ClientType; label: string }> = [
  { id: 'gym', label: 'Gym only' },
  { id: 'pt', label: 'PT' },
  { id: 'online', label: 'Online' },
  { id: 'hybrid', label: 'Hybrid' },
];

const RISK_FILTERS: Array<{ id: ClientRiskLevel; label: string }> = [
  { id: 'alto', label: 'Riesgo alto' },
  { id: 'medio', label: 'Riesgo medio' },
  { id: 'bajo', label: 'Riesgo bajo' },
];

const SATISFACTION_FILTERS: Array<{ id: ClientSatisfactionLevel; label: string }> = [
  { id: 'alto', label: 'NPS alto' },
  { id: 'neutro', label: 'NPS neutro' },
  { id: 'bajo', label: 'NPS bajo' },
];

export function Clientes360Page() {
  const [clients, setClients] = useState<Client360Summary[]>([]);
  const [selectedClientIds, setSelectedClientIds] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState<boolean>(true);
  const [activeClientId, setActiveClientId] = useState<string | null>(null);
  const [clientProfile, setClientProfile] = useState<ClientProfile | null>(null);
  const [profileLoading, setProfileLoading] = useState<boolean>(false);
  const [filters, setFilters] = useState<FilterState>({
    statuses: [],
    types: [],
    riskLevels: [],
    satisfactionLevels: [],
    branch: 'all',
    onlyRisk: false,
    onlyVip: false,
  });

  useEffect(() => {
    const loadClients = async () => {
      setLoading(true);
      const data = await fetchClients();
      setClients(data);
      setLoading(false);
    };

    void loadClients();
  }, []);

  useEffect(() => {
    if (!activeClientId) {
      setClientProfile(null);
      setProfileLoading(false);
      return;
    }

    let isCancelled = false;

    const loadProfile = async () => {
      setProfileLoading(true);
      setClientProfile(null);
      const profile = await fetchClientProfile(activeClientId);
      if (!isCancelled) {
        setClientProfile(profile);
        setProfileLoading(false);
      }
    };

    void loadProfile();

    return () => {
      isCancelled = true;
    };
  }, [activeClientId]);

  const branches = useMemo(() => {
    const uniqueBranches = Array.from(new Set(clients.map(client => client.branch)));
    return [
      { value: 'all', label: 'Todas las sedes' },
      ...uniqueBranches.map(branch => ({ value: branch, label: branch })),
    ];
  }, [clients]);

  const branchOptions: SelectOption[] = branches;

  const filteredClients = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    return clients.filter(client => {
      const matchesSearch =
        term.length === 0 ||
        client.name.toLowerCase().includes(term) ||
        client.email.toLowerCase().includes(term) ||
        client.phone.toLowerCase().includes(term) ||
        client.assignedCoach.toLowerCase().includes(term) ||
        client.tags.some(tag => tag.toLowerCase().includes(term));

      if (!matchesSearch) return false;

      if (filters.statuses.length > 0 && !filters.statuses.includes(client.status)) return false;
      if (filters.types.length > 0 && !filters.types.includes(client.type)) return false;
      if (filters.riskLevels.length > 0 && !filters.riskLevels.includes(client.riskLevel)) return false;
      if (
        filters.satisfactionLevels.length > 0 &&
        !filters.satisfactionLevels.includes(client.satisfactionLevel)
      )
        return false;
      if (filters.branch !== 'all' && client.branch !== filters.branch) return false;
      if (filters.onlyRisk && client.riskLevel !== 'alto') return false;
      if (filters.onlyVip && !(client.isVip || client.isHighValue)) return false;

      return true;
    });
  }, [clients, filters, searchTerm]);

  const metrics: MetricCardData[] = useMemo(() => {
    if (clients.length === 0) return [];

    const activeClients = clients.filter(client => client.status === 'activo').length;
    const riskClients = clients.filter(client => client.riskLevel === 'alto').length;
    const now = new Date();
    const newThisMonth = clients.filter(client => {
      const joined = new Date(client.joinedAt);
      return joined.getMonth() === now.getMonth() && joined.getFullYear() === now.getFullYear();
    }).length;
    const upcomingRenewals = clients.filter(client => {
      if (!client.upcomingRenewal) return false;
      const renewal = new Date(client.upcomingRenewal).getTime();
      return renewal - now.getTime() <= 1000 * 60 * 60 * 24 * 30 && renewal >= now.getTime();
    }).length;
    const mrr = clients.reduce((acc, client) => acc + client.monthlyValue, 0);

    return [
      {
        id: 'clients-active',
        title: 'Clientes activos',
        value: activeClients,
        subtitle: `${Math.round((activeClients / clients.length) * 100)}% del total gestionado`,
        color: 'primary',
        icon: <Users size={18} />,
      },
      {
        id: 'clients-risk',
        title: 'Clientes en riesgo',
        value: riskClients,
        subtitle: 'Marcados con señales de baja',
        color: 'warning',
        icon: <AlertTriangle size={18} />,
      },
      {
        id: 'new-month',
        title: 'Nuevos este mes',
        value: newThisMonth,
        subtitle: 'Altas en los últimos 30 días',
        color: 'success',
        icon: <Sparkles size={18} />,
      },
      {
        id: 'renewals',
        title: 'Renovaciones (30 días)',
        value: upcomingRenewals,
        subtitle: 'Planes que caducan pronto',
        color: 'info',
        icon: <CalendarClock size={18} />,
      },
      {
        id: 'mrr',
        title: 'MRR estimado',
        value: mrr.toLocaleString('es-ES', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }),
        subtitle: 'Ingreso mensual recurrente',
        color: 'primary',
        icon: <Wallet size={18} />,
      },
    ];
  }, [clients]);

  const toggleFilterValue = <T,>(values: T[], value: T) => {
    return values.includes(value) ? values.filter(item => item !== value) : [...values, value];
  };

  const handleToggleStatus = (status: ClientStatus) => {
    setFilters(prev => ({ ...prev, statuses: toggleFilterValue(prev.statuses, status) }));
  };

  const handleToggleType = (type: ClientType) => {
    setFilters(prev => ({ ...prev, types: toggleFilterValue(prev.types, type) }));
  };

  const handleToggleRisk = (risk: ClientRiskLevel) => {
    setFilters(prev => ({ ...prev, riskLevels: toggleFilterValue(prev.riskLevels, risk) }));
  };

  const handleToggleSatisfaction = (satisfaction: ClientSatisfactionLevel) => {
    setFilters(prev => ({
      ...prev,
      satisfactionLevels: toggleFilterValue(prev.satisfactionLevels, satisfaction),
    }));
  };

  const handleToggleClientSelection = (clientId: string) => {
    setSelectedClientIds(prev =>
      prev.includes(clientId) ? prev.filter(id => id !== clientId) : [...prev, clientId],
    );
  };

  const handleClearSelection = () => setSelectedClientIds([]);

  const handleClearFilters = () =>
    setFilters({
      statuses: [],
      types: [],
      riskLevels: [],
      satisfactionLevels: [],
      branch: 'all',
      onlyRisk: false,
      onlyVip: false,
    });

  const activeClient = useMemo(
    () => clients.find(client => client.id === activeClientId),
    [clients, activeClientId],
  );

  const handleViewClientProfile = (clientId: string) => {
    setActiveClientId(clientId);
  };

  const handleBackToList = () => {
    setActiveClientId(null);
  };

  const listView = (
    <div className="space-y-10">
      <MetricCards data={metrics} columns={5} />

      <Card padding="lg" className="bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/80 dark:bg-slate-900/80">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="flex-1 space-y-2">
              <h2 className="text-lg font-semibold text-slate-900">Control centralizado</h2>
              <p className="text-sm text-slate-600">
                Busca, segmenta y activa campañas o tareas sobre tu cartera con filtros inteligentes.
              </p>
            </div>
            <div className="w-full max-w-md">
              <Input
                value={searchTerm}
                onChange={event => setSearchTerm(event.target.value)}
                placeholder="Buscar por nombre, email, teléfono, tags o coach"
                leftIcon={<Search size={16} />}
                aria-label="Buscar clientes"
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">Estado</span>
              {STATUS_FILTERS.map(option => {
                const isActive = filters.statuses.includes(option.id);
                return (
                  <Button
                    key={option.id}
                    variant="ghost"
                    size="sm"
                    className={`rounded-full border px-4 py-2 text-xs ${
                      isActive
                        ? 'border-indigo-500 bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-200'
                        : 'border-transparent text-slate-600 hover:border-indigo-200 hover:bg-indigo-50/60 dark:text-slate-300 dark:hover:bg-indigo-900/20'
                    }`}
                    onClick={() => handleToggleStatus(option.id)}
                  >
                    {option.label}
                  </Button>
                );
              })}
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">Tipo</span>
              {TYPE_FILTERS.map(option => {
                const isActive = filters.types.includes(option.id);
                return (
                  <Button
                    key={option.id}
                    variant="ghost"
                    size="sm"
                    className={`rounded-full border px-4 py-2 text-xs ${
                      isActive
                        ? 'border-indigo-500 bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-200'
                        : 'border-transparent text-slate-600 hover:border-indigo-200 hover:bg-indigo-50/60 dark:text-slate-300 dark:hover:bg-indigo-900/20'
                    }`}
                    onClick={() => handleToggleType(option.id)}
                  >
                    {option.label}
                  </Button>
                );
              })}
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">Riesgo</span>
              {RISK_FILTERS.map(option => {
                const isActive = filters.riskLevels.includes(option.id);
                return (
                  <Button
                    key={option.id}
                    variant="ghost"
                    size="sm"
                    className={`rounded-full border px-4 py-2 text-xs ${
                      isActive
                        ? 'border-indigo-500 bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-200'
                        : 'border-transparent text-slate-600 hover:border-indigo-200 hover:bg-indigo-50/60 dark:text-slate-300 dark:hover:bg-indigo-900/20'
                    }`}
                    onClick={() => handleToggleRisk(option.id)}
                  >
                    {option.label}
                  </Button>
                );
              })}
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">Satisfacción</span>
              {SATISFACTION_FILTERS.map(option => {
                const isActive = filters.satisfactionLevels.includes(option.id);
                return (
                  <Button
                    key={option.id}
                    variant="ghost"
                    size="sm"
                    className={`rounded-full border px-4 py-2 text-xs ${
                      isActive
                        ? 'border-indigo-500 bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-200'
                        : 'border-transparent text-slate-600 hover:border-indigo-200 hover:bg-indigo-50/60 dark:text-slate-300 dark:hover:bg-indigo-900/20'
                    }`}
                    onClick={() => handleToggleSatisfaction(option.id)}
                  >
                    {option.label}
                  </Button>
                );
              })}
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-wrap items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  leftIcon={<AlertTriangle size={16} />}
                  className={`rounded-full border px-4 py-2 text-xs ${
                    filters.onlyRisk
                      ? 'border-red-400 bg-red-50 text-red-600 dark:border-red-500/60 dark:bg-red-900/20 dark:text-red-200'
                      : 'border-transparent text-slate-600 hover:border-red-200 hover:bg-red-50/60 dark:text-slate-300 dark:hover:bg-red-900/20'
                  }`}
                  onClick={() => setFilters(prev => ({ ...prev, onlyRisk: !prev.onlyRisk }))}
                >
                  Ver solo clientes en riesgo
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  leftIcon={<Sparkles size={16} />}
                  className={`rounded-full border px-4 py-2 text-xs ${
                    filters.onlyVip
                      ? 'border-purple-400 bg-purple-50 text-purple-600 dark:border-purple-500/60 dark:bg-purple-900/20 dark:text-purple-200'
                      : 'border-transparent text-slate-600 hover:border-purple-200 hover:bg-purple-50/60 dark:text-slate-300 dark:hover:bg-purple-900/20'
                  }`}
                  onClick={() => setFilters(prev => ({ ...prev, onlyVip: !prev.onlyVip }))}
                >
                  Ver solo VIP / alto valor
                </Button>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <Select
                  label="Sede"
                  value={filters.branch}
                  onChange={event => setFilters(prev => ({ ...prev, branch: event.target.value }))}
                  options={branchOptions}
                />
                <Button variant="ghost" size="sm" leftIcon={<Filter size={16} />} onClick={handleClearFilters}>
                  Limpiar filtros
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {selectedClientIds.length > 0 ? (
        <Card
          padding="lg"
          className="border-indigo-200/80 bg-indigo-50/70 text-indigo-700 dark:border-indigo-500/40 dark:bg-indigo-900/30 dark:text-indigo-200"
        >
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wide">{selectedClientIds.length} clientes seleccionados</h3>
              <p className="text-xs text-indigo-600/80 dark:text-indigo-200/80">
                Aplica acciones masivas: campañas, tareas, cambios de estado o precios.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button variant="primary" size="sm" leftIcon={<MessageCircle size={16} />}>
                Enviar campaña
              </Button>
              <Button variant="secondary" size="sm" leftIcon={<Users size={16} />}>
                Asignar entrenador
              </Button>
              <Button variant="ghost" size="sm" leftIcon={<Sparkles size={16} />}>
                Activar automatización
              </Button>
              <Button variant="ghost" size="sm" onClick={handleClearSelection}>
                Limpiar selección
              </Button>
            </div>
          </div>
        </Card>
      ) : null}

      <Card padding="lg" className="bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/80 dark:bg-slate-900/80">
        {loading ? (
          <div className="h-[600px] animate-pulse rounded-2xl bg-slate-100 dark:bg-slate-800" />
        ) : (
          <ClientListTable
            clients={filteredClients}
            selectedClientIds={selectedClientIds}
            onToggleClientSelection={handleToggleClientSelection}
            onViewClientProfile={handleViewClientProfile}
          />
        )}
      </Card>
    </div>
  );

  const profileView = (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" leftIcon={<ArrowLeft size={16} />} onClick={handleBackToList}>
            Volver al listado
          </Button>
          {activeClient ? (
            <span className="text-sm text-slate-500 dark:text-slate-400">
              Viendo ficha de <span className="font-semibold text-slate-700 dark:text-slate-200">{activeClient.name}</span>
            </span>
          ) : null}
        </div>
      </div>
      <ClientProfileSummary client={activeClient} profile={clientProfile} loading={profileLoading} />
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 pb-16">
      <header className="border-b border-slate-200/60 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/70">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8">
          <div className="py-10">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex items-start gap-4">
                <div className="rounded-2xl bg-gradient-to-br from-indigo-100 to-purple-100 p-3 ring-1 ring-indigo-200/60">
                  <Users className="h-7 w-7 text-indigo-600" />
                </div>
                <div className="space-y-2">
                  <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 md:text-4xl">Clientes 360</h1>
                  <p className="max-w-2xl text-sm text-slate-600 md:text-base">
                    “Quién es este cliente, cuánto vale, qué hace, qué resultados tiene, qué está pagando, si está
                    contento, si está a punto de irse, y qué tengo que hacer con él.” Todo en una sola vista.
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button variant="primary" leftIcon={<UserPlus size={16} />}>
                  Nuevo cliente
                </Button>
                <Button variant="secondary" leftIcon={<Upload size={16} />}>
                  Importar clientes
                </Button>
                <Button variant="ghost" leftIcon={<Download size={16} />}>
                  Exportar
                </Button>
                <Button variant="ghost" leftIcon={<Sparkles size={16} />}>
                  Crear segmento inteligente
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1600px] px-4 py-10 sm:px-6 lg:px-8">
        {activeClientId ? profileView : listView}
      </main>
    </div>
  );
}

