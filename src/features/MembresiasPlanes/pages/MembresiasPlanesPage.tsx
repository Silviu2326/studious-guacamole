import { useEffect, useMemo, useState } from 'react';
import {
  BarChart3,
  Briefcase,
  ClipboardCheck,
  Crown,
  Download,
  Gavel,
  Puzzle,
  RefreshCcw,
} from 'lucide-react';
import {
  Button,
  MetricCards,
  Tabs,
  type MetricCardData,
  type TabItem,
} from '../../../components/componentsreutilizables';
import {
  fetchActiveMemberships,
  fetchAddOns,
  fetchCorporatePlans,
  fetchPlanCatalog,
  fetchRenewalInsights,
  fetchRuleCategories,
  fetchStrategicInsights,
  type ActiveMembership,
  type AddOn,
  type CorporatePlan,
  type PlanSummary,
  type RenewalInsight,
  type RuleCategory,
  type StrategicInsight,
} from '../api';
import {
  ActiveMembershipsTable,
  AddOnsGrid,
  CorporatePlansPanel,
  PlanCatalogTable,
  RenewalsPanel,
  RulesConditionsBoard,
  StrategicInsightsPanel,
  TopFiltersBar,
} from '../components';

const TAB_ITEMS: TabItem[] = [
  { id: 'catalog', label: 'Catálogo planes', icon: <Crown className="h-4 w-4" /> },
  { id: 'active', label: 'Membresías activas', icon: <ClipboardCheck className="h-4 w-4" /> },
  { id: 'rules', label: 'Reglas & condiciones', icon: <Gavel className="h-4 w-4" /> },
  { id: 'addons', label: 'Add-ons & extras', icon: <Puzzle className="h-4 w-4" /> },
  { id: 'corporate', label: 'Corporate & multisede', icon: <Briefcase className="h-4 w-4" /> },
];

export function MembresiasPlanesPage() {
  const [plans, setPlans] = useState<PlanSummary[]>([]);
  const [memberships, setMemberships] = useState<ActiveMembership[]>([]);
  const [renewals, setRenewals] = useState<RenewalInsight[]>([]);
  const [ruleCategories, setRuleCategories] = useState<RuleCategory[]>([]);
  const [addOns, setAddOns] = useState<AddOn[]>([]);
  const [corporatePlans, setCorporatePlans] = useState<CorporatePlan[]>([]);
  const [insights, setInsights] = useState<StrategicInsight[]>([]);
  const [activeTab, setActiveTab] = useState<string>('catalog');
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const [
        planData,
        membershipData,
        renewalData,
        ruleData,
        addOnData,
        corporateData,
        insightsData,
      ] = await Promise.all([
        fetchPlanCatalog(),
        fetchActiveMemberships(),
        fetchRenewalInsights(),
        fetchRuleCategories(),
        fetchAddOns(),
        fetchCorporatePlans(),
        fetchStrategicInsights(),
      ]);

      setPlans(planData);
      setSelectedPlanId(planData[0]?.id ?? null);
      setMemberships(membershipData);
      setRenewals(renewalData);
      setRuleCategories(ruleData);
      setAddOns(addOnData);
      setCorporatePlans(corporateData);
      setInsights(insightsData);
      setLoading(false);
    };

    void loadData();
  }, []);

  const metrics: MetricCardData[] = useMemo(() => {
    if (plans.length === 0) {
      return [];
    }

    const totalMembers = memberships.length;
    const totalActiveMembers = plans.reduce((sum, plan) => sum + plan.activeMembers, 0);
    const totalMRR = plans.reduce((sum, plan) => sum + plan.monthlyRevenue, 0);
    const upcomingRenewals = renewals.filter(renewal => {
      const now = new Date();
      const date = new Date(renewal.renewalDate);
      const diff = (date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
      return diff >= 0 && diff <= 30;
    }).length;
    const riskPlans = renewals.filter(item => item.churnRisk !== 'bajo').length;
    const upgradePotential = memberships.filter(m => m.upgradePotential !== 'bajo').length;
    const upgradePercentage = totalMembers === 0 ? 0 : Math.round((upgradePotential / totalMembers) * 100);
    const topPlan = [...plans].sort((a, b) => b.monthlyRevenue - a.monthlyRevenue)[0];

    return [
      {
        id: 'members-active',
        title: 'Membresías activas',
        value: totalMembers,
        subtitle: `${totalActiveMembers} clientes dentro de planes`,
        color: 'success',
        icon: <ClipboardCheck size={18} />,
      },
      {
        id: 'mrr',
        title: 'MRR por membresías',
        value: totalMRR.toLocaleString('es-ES', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }),
        subtitle: 'Ingresos recurrentes mensuales',
        color: 'primary',
        icon: <BarChart3 size={18} />,
      },
      {
        id: 'renewals',
        title: 'Renovaciones próximos 30d',
        value: upcomingRenewals,
        subtitle: `${riskPlans} necesitan seguimiento`,
        color: 'warning',
        icon: <RefreshCcw size={18} />,
      },
      {
        id: 'churn-risk',
        title: 'Alertas churn',
        value: riskPlans,
        subtitle: 'Clientes con riesgo medio o alto',
        color: 'error',
        icon: <Gavel size={18} />,
      },
      {
        id: 'top-plan',
        title: 'Top plan por facturación',
        value: topPlan?.name ?? '—',
        subtitle: topPlan
          ? `${topPlan.monthlyRevenue.toLocaleString('es-ES', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 })} / ${topPlan.activeMembers} miembros`
          : 'Sin datos',
        color: 'info',
        icon: <Crown size={18} />,
      },
      {
        id: 'upgrade',
        title: '% con upgrade potencial',
        value: `${upgradePercentage}%`,
        subtitle: `${upgradePotential} clientes listos para subir de plan`,
        color: 'info',
        icon: <Puzzle size={18} />,
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
                    Diseña ofertas irresistibles, controla renovación y churn y escala corporate sin perder control.
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
          <TopFiltersBar />

          <MetricCards data={metrics} columns={3} />

          <Tabs items={TAB_ITEMS} activeTab={activeTab} onTabChange={setActiveTab} variant="underline" />

          {activeTab === 'catalog' && (
            <div className="space-y-6">
              {loading ? (
                <div className="h-80 animate-pulse rounded-2xl bg-slate-100 dark:bg-slate-800" />
              ) : (
                <PlanCatalogTable plans={plans} selectedPlanId={selectedPlanId} onSelectPlan={setSelectedPlanId} />
              )}
              {!loading && <StrategicInsightsPanel insights={insights} />}
            </div>
          )}

          {activeTab === 'active' && (
            <div className="space-y-6">
              {loading ? (
                <div className="h-80 animate-pulse rounded-2xl bg-slate-100 dark:bg-slate-800" />
              ) : (
                <>
                  <ActiveMembershipsTable memberships={memberships} />
                  <RenewalsPanel renewals={renewals} />
                </>
              )}
            </div>
          )}

          {activeTab === 'rules' && (
            <div className="space-y-6">
              {loading ? (
                <div className="h-72 animate-pulse rounded-2xl bg-slate-100 dark:bg-slate-800" />
              ) : (
                <RulesConditionsBoard categories={ruleCategories} />
              )}
            </div>
          )}

          {activeTab === 'addons' && (
            <div className="space-y-6">
              {loading ? (
                <div className="h-72 animate-pulse rounded-2xl bg-slate-100 dark:bg-slate-800" />
              ) : (
                <AddOnsGrid addOns={addOns} />
              )}
            </div>
          )}

          {activeTab === 'corporate' && (
            <div className="space-y-6">
              {loading ? (
                <div className="h-72 animate-pulse rounded-2xl bg-slate-100 dark:bg-slate-800" />
              ) : (
                <CorporatePlansPanel corporatePlans={corporatePlans} />
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

