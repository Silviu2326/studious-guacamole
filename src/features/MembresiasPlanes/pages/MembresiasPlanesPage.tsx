import { useEffect, useMemo, useState } from 'react';
import {
  ClipboardCheck,
  Crown,
  Download,
  RefreshCcw,
  Sparkles,
} from 'lucide-react';
import {
  Button,
  Card,
  MetricCards,
  Tabs,
  type MetricCardData,
  type TabItem,
} from '../../../components/componentsreutilizables';
import {
  fetchActiveMemberships,
  fetchPlanCatalog,
  fetchRenewalInsights,
  type ActiveMembership,
  type PlanSummary,
  type RenewalInsight,
} from '../api';
import {
  ActiveMembershipsTable,
  PlanCatalogTable,
  RenewalsPanel,
} from '../components';

const TAB_ITEMS: TabItem[] = [
  { id: 'catalog', label: 'Catálogo planes', icon: <Crown className="h-4 w-4" /> },
  { id: 'active', label: 'Membresías activas', icon: <ClipboardCheck className="h-4 w-4" /> },
  { id: 'renewals', label: 'Renovaciones & bajas', icon: <Sparkles className="h-4 w-4" /> },
];

export function MembresiasPlanesPage() {
  const [plans, setPlans] = useState<PlanSummary[]>([]);
  const [memberships, setMemberships] = useState<ActiveMembership[]>([]);
  const [renewals, setRenewals] = useState<RenewalInsight[]>([]);
  const [activeTab, setActiveTab] = useState<string>('catalog');
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const [planData, membershipData, renewalData] = await Promise.all([
        fetchPlanCatalog(),
        fetchActiveMemberships(),
        fetchRenewalInsights(),
      ]);

      setPlans(planData);
      setMemberships(membershipData);
      setRenewals(renewalData);
      setLoading(false);
    };

    void loadData();
  }, []);

  const metrics: MetricCardData[] = useMemo(() => {
    const totalPlans = plans.length;
    const activePlans = plans.filter(plan => plan.status === 'activo').length;
    const totalMembers = plans.reduce((sum, plan) => sum + plan.activeMembers, 0);
    const riskCount = renewals.filter(renewal => renewal.churnRisk !== 'bajo').length;

    return [
      {
        id: 'plans-total',
        title: 'Planes disponibles',
        value: totalPlans,
        subtitle: `${activePlans} activos actualmente`,
        color: 'primary',
        icon: <Crown size={18} />,
      },
      {
        id: 'members-active',
        title: 'Membresías activas',
        value: memberships.length,
        subtitle: `${totalMembers} miembros vinculados`,
        color: 'success',
        icon: <ClipboardCheck size={18} />,
      },
      {
        id: 'renewals',
        title: 'Renovaciones a vigilar',
        value: riskCount,
        subtitle: 'Clientes con churn médio/alto',
        color: 'warning',
        icon: <Sparkles size={18} />,
      },
    ];
  }, [plans, memberships, renewals]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <header className="border-b border-slate-200/60 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/70">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6">
          <div className="py-8">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-4">
                <div className="rounded-2xl bg-gradient-to-br from-indigo-100 to-purple-100 p-3 ring-1 ring-indigo-200/60">
                  <Crown className="h-7 w-7 text-indigo-600" />
                </div>
                <div>
                  <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 md:text-4xl">
                    Membresías & Planes
                  </h1>
                  <p className="mt-1 max-w-2xl text-sm text-slate-600 md:text-base">
                    Diseña ofertas irresistibles, controla la salud de tus clientes recurrentes y gestiona renovaciones en un solo lugar.
                  </p>
                </div>
              </div>
              <div className="flex flex-col gap-2 sm:flex-row">
                <Button variant="secondary" leftIcon={<Download size={16} />}>
                  Exportar datos
                </Button>
                <Button variant="ghost" leftIcon={<RefreshCcw size={16} />} onClick={() => setActiveTab('catalog')}>
                  Refrescar
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1600px] px-4 py-8 sm:px-6 lg:px-6">
        <div className="space-y-8">
          <MetricCards data={metrics} columns={3} />

          <Tabs items={TAB_ITEMS} activeTab={activeTab} onTabChange={setActiveTab} variant="underline" />

          {activeTab === 'catalog' && (
            <>
              {loading ? (
                <div className="h-64 animate-pulse rounded-2xl bg-slate-100 dark:bg-slate-800" />
              ) : (
                <PlanCatalogTable plans={plans} />
              )}
            </>
          )}

          {activeTab === 'active' && (
            <>
              {loading ? (
                <div className="h-64 animate-pulse rounded-2xl bg-slate-100 dark:bg-slate-800" />
              ) : (
                <ActiveMembershipsTable memberships={memberships} />
              )}
            </>
          )}

          {activeTab === 'renewals' && (
            <>
              {loading ? (
                <div className="h-48 animate-pulse rounded-2xl bg-slate-100 dark:bg-slate-800" />
              ) : (
                <RenewalsPanel renewals={renewals} />
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
}

