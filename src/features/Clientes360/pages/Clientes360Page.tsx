import { useEffect, useMemo, useState } from 'react';
import {
  Download,
  MessageCircle,
  RefreshCcw,
  Search,
  Settings,
  UserCircle,
  Users,
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
  fetchClientProfile,
  fetchClients,
  fetchPortalSettings,
  fetchSatisfactionInsights,
  type Client360Summary,
  type ClientPortalSettings,
  type ClientProfile,
  type SatisfactionInsight,
} from '../api';
import {
  ClientListTable,
  ClientProfileSummary,
  PortalClientPanel,
  SatisfactionPanel,
} from '../components';

const TAB_ITEMS: TabItem[] = [
  { id: 'list', label: 'Listado de clientes', icon: <Users className="h-4 w-4" /> },
  { id: 'profile', label: 'Ficha cliente', icon: <UserCircle className="h-4 w-4" /> },
  { id: 'portal', label: 'Portal cliente (config + acceso)', icon: <Settings className="h-4 w-4" /> },
  { id: 'surveys', label: 'Encuestas & satisfacción', icon: <MessageCircle className="h-4 w-4" /> },
];

export function Clientes360Page() {
  const [clients, setClients] = useState<Client360Summary[]>([]);
  const [filteredClients, setFilteredClients] = useState<Client360Summary[]>([]);
  const [selectedClientId, setSelectedClientId] = useState<string | undefined>();
  const [profile, setProfile] = useState<ClientProfile | null>(null);
  const [portalSettings, setPortalSettings] = useState<ClientPortalSettings | null>(null);
  const [insights, setInsights] = useState<SatisfactionInsight[]>([]);

  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<string>('list');
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingDetail, setLoadingDetail] = useState<boolean>(false);

  useEffect(() => {
    const loadClients = async () => {
      setLoading(true);
      const data = await fetchClients();
      setClients(data);
      setFilteredClients(data);
      setSelectedClientId(data[0]?.id);
      setLoading(false);
    };

    void loadClients();
  }, []);

  useEffect(() => {
    const loadDetail = async () => {
      if (!selectedClientId) {
        setProfile(null);
        setPortalSettings(null);
        setInsights([]);
        return;
      }

      setLoadingDetail(true);
      const [profileData, portalData, satisfactionData] = await Promise.all([
        fetchClientProfile(selectedClientId),
        fetchPortalSettings(selectedClientId),
        fetchSatisfactionInsights(selectedClientId),
      ]);
      setProfile(profileData);
      setPortalSettings(portalData);
      setInsights(satisfactionData);
      setLoadingDetail(false);
    };

    void loadDetail();
  }, [selectedClientId]);

  const metrics: MetricCardData[] = useMemo(() => {
    if (clients.length === 0) return [];

    const activeClients = clients.filter(client => client.status === 'activo').length;
    const atRisk = clients.filter(client => client.status === 'riesgo').length;
    const averageSatisfaction =
      clients.reduce((sum, client) => sum + client.satisfactionScore, 0) / clients.length;

    return [
      {
        id: 'clients-total',
        title: 'Clientes totales',
        value: clients.length,
        subtitle: 'Gestionados en los últimos 12 meses',
        color: 'primary',
        icon: <Users size={18} />,
      },
      {
        id: 'clients-active',
        title: 'Clientes activos',
        value: activeClients,
        subtitle: `${Math.round((activeClients / clients.length) * 100)}% del total`,
        color: 'success',
        icon: <UserCircle size={18} />,
      },
      {
        id: 'clients-risk',
        title: 'En riesgo',
        value: atRisk,
        subtitle: 'Con señales de baja adherencia',
        color: 'warning',
        icon: <MessageCircle size={18} />,
      },
      {
        id: 'satisfaction',
        title: 'Satisfacción promedio',
        value: `${averageSatisfaction.toFixed(0)}%`,
        subtitle: 'Últimas encuestas registradas',
        color: 'info',
        icon: <Settings size={18} />,
      },
    ];
  }, [clients]);

  const clientOptions: SelectOption[] = useMemo(
    () =>
      clients.map(client => ({
        value: client.id,
        label: client.name,
      })),
    [clients],
  );

  const selectedClient = useMemo(
    () => clients.find(client => client.id === selectedClientId),
    [clients, selectedClientId],
  );

  useEffect(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) {
      setFilteredClients(clients);
      return;
    }

    setFilteredClients(
      clients.filter(client => {
        return (
          client.name.toLowerCase().includes(term) ||
          client.email.toLowerCase().includes(term) ||
          client.assignedCoach.toLowerCase().includes(term)
        );
      }),
    );
  }, [clients, searchTerm]);

  const handleSelectClient = (clientId: string) => {
    setSelectedClientId(clientId);
    if (activeTab !== 'profile') {
      setActiveTab('profile');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <header className="border-b border-slate-200/60 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/70">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6">
          <div className="py-8">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-4">
                <div className="rounded-2xl bg-gradient-to-br from-indigo-100 to-purple-100 p-3 ring-1 ring-indigo-200/60">
                  <Users className="h-7 w-7 text-indigo-600" />
                </div>
                <div>
                  <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 md:text-4xl">
                    Clientes 360
                  </h1>
                  <p className="mt-1 max-w-2xl text-sm text-slate-600 md:text-base">
                    Consolida la información crítica de cada cliente, coordina acciones con tu equipo
                    y ofrece experiencias personalizadas desde una única vista.
                  </p>
                </div>
              </div>
              <div className="flex flex-col gap-2 sm:flex-row">
                <Button variant="secondary" leftIcon={<Download size={16} />}>
                  Exportar reporte
                </Button>
                <Button variant="ghost" leftIcon={<RefreshCcw size={16} />} onClick={() => setSearchTerm('')}>
                  Refrescar datos
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1600px] px-4 py-8 sm:px-6 lg:px-6">
        <div className="space-y-8">
          <MetricCards data={metrics} columns={4} />

          <Tabs items={TAB_ITEMS} activeTab={activeTab} onTabChange={setActiveTab} variant="underline" />

          {activeTab === 'list' && (
            <Card className="bg-white shadow-sm ring-1 ring-slate-200/70 dark:ring-slate-700/40" padding="lg">
              <div className="space-y-6">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                  <div className="flex-1 space-y-3">
                    <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                      Listado inteligente de clientes
                    </h2>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Filtra, segmenta y lanza acciones masivas sin salir de la vista 360.
                    </p>
                  </div>
                  <div className="w-full max-w-md">
                    <Input
                      value={searchTerm}
                      onChange={event => setSearchTerm(event.target.value)}
                      placeholder="Buscar por nombre, email o coach asignado"
                      leftIcon={<Search size={16} />}
                      aria-label="Buscar clientes"
                    />
                  </div>
                </div>

                {loading ? (
                  <div className="h-64 animate-pulse rounded-2xl bg-slate-100 dark:bg-slate-800" />
                ) : (
                  <ClientListTable
                    clients={filteredClients}
                    selectedClientId={selectedClientId}
                    onSelectClient={handleSelectClient}
                  />
                )}
              </div>
            </Card>
          )}

          {activeTab === 'profile' && (
            <div className="space-y-6">
              <Card className="bg-white shadow-sm ring-1 ring-slate-200/70 dark:ring-slate-700/40" padding="lg">
                <div className="grid gap-4 md:grid-cols-2 md:items-end">
                  <div>
                    <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Ficha del cliente</h2>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Explora progresos, objetivos y métricas clave para personalizar los próximos pasos.
                    </p>
                  </div>
                  <Select
                    label="Selecciona cliente"
                    value={selectedClientId ?? ''}
                    onChange={event => setSelectedClientId(event.target.value)}
                    options={clientOptions}
                  />
                </div>
              </Card>

              {loadingDetail ? (
                <div className="h-64 animate-pulse rounded-2xl bg-slate-100 dark:bg-slate-800" />
              ) : (
                <ClientProfileSummary client={selectedClient} profile={profile ?? undefined} />
              )}
            </div>
          )}

          {activeTab === 'portal' && (
            <div className="space-y-6">
              <Card className="bg-white shadow-sm ring-1 ring-slate-200/70 dark:ring-slate-700/40" padding="lg">
                <div className="grid gap-4 md:grid-cols-2 md:items-end">
                  <div>
                    <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                      Portal del cliente
                    </h2>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Gestiona accesos, permisos y checklist de onboarding digital en segundos.
                    </p>
                  </div>
                  <Select
                    label="Selecciona cliente"
                    value={selectedClientId ?? ''}
                    onChange={event => setSelectedClientId(event.target.value)}
                    options={clientOptions}
                  />
                </div>
              </Card>

              {loadingDetail ? (
                <div className="h-48 animate-pulse rounded-2xl bg-slate-100 dark:bg-slate-800" />
              ) : (
                <PortalClientPanel settings={portalSettings ?? undefined} />
              )}
            </div>
          )}

          {activeTab === 'surveys' && (
            <div className="space-y-6">
              <Card className="bg-white shadow-sm ring-1 ring-slate-200/70 dark:ring-slate-700/40" padding="lg">
                <div className="grid gap-4 md:grid-cols-2 md:items-end">
                  <div>
                    <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                      Encuestas & satisfacción
                    </h2>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Analiza feedback cualitativo, puntuaciones y tendencias de cada cliente.
                    </p>
                  </div>
                  <Select
                    label="Selecciona cliente"
                    value={selectedClientId ?? ''}
                    onChange={event => setSelectedClientId(event.target.value)}
                    options={clientOptions}
                  />
                </div>
              </Card>

              {loadingDetail ? (
                <div className="h-48 animate-pulse rounded-2xl bg-slate-100 dark:bg-slate-800" />
              ) : (
                <SatisfactionPanel insights={insights} />
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

