import { useEffect, useMemo, useState } from 'react';
import {
  AlertTriangle,
  BadgePercent,
  Banknote,
  BarChart3,
  Calculator,
  CalendarRange,
  CheckCircle2,
  ClipboardCheck,
  Clock,
  Coins,
  Download,
  FileBarChart2,
  FileSpreadsheet,
  LineChart,
  PiggyBank,
  PieChart,
  RefreshCcw,
  TrendingDown,
  TrendingUp,
  Users,
  Wallet,
  Zap,
} from 'lucide-react';
import {
  Badge,
  Button,
  Card,
  Tabs,
  type TabItem,
} from '../../../components/componentsreutilizables';
import {
  CashFlowEntry,
  DynamicPricingInsight,
  ExpenseRecord,
  FinancialMetric,
  ForecastEntry,
  InvoiceSummary,
  SubscriptionSummary,
  TaxExportRecord,
  fetchCashFlowEntries,
  fetchDynamicPricingInsights,
  fetchExpenseRecords,
  fetchForecastEntries,
  fetchInvoiceSummaries,
  fetchOverviewMetrics,
  fetchSubscriptionSummaries,
  fetchTaxExportRecords,
} from '../api';
import {
  CashFlowPanel,
  DynamicPricingPanel,
  ExpensesTable,
  ForecastPanel,
  InvoicesTable,
  OverviewMetrics,
  SubscriptionsTable,
  TaxExportTable,
} from '../components';

type RangeKey = '7d' | '30d' | '90d' | 'ytd';

const RANGE_OPTIONS: Array<{ id: RangeKey; label: string; description: string }> = [
  { id: '7d', label: '7 días', description: 'Actividad semanal' },
  { id: '30d', label: '30 días', description: 'Visión mensual' },
  { id: '90d', label: '90 días', description: 'Último trimestre' },
  { id: 'ytd', label: 'YTD', description: 'Desde inicio de año' },
];

const currencyFormatter = new Intl.NumberFormat('es-ES', {
  style: 'currency',
  currency: 'EUR',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

const formatCurrency = (value: number) => currencyFormatter.format(Math.round(value));

const formatPercent = (value: number) =>
  `${value.toLocaleString('es-ES', { minimumFractionDigits: 1, maximumFractionDigits: 1 })}%`;

const daysBetween = (start: string, end: string) => {
  const startDate = new Date(start);
  const endDate = new Date(end);
  const diffMs = endDate.getTime() - startDate.getTime();
  return Math.max(Math.round(diffMs / (1000 * 60 * 60 * 24)), 0);
};

const TAB_ITEMS: TabItem[] = [
  { id: 'overview', label: 'Overview', icon: <BarChart3 className="h-4 w-4" /> },
  { id: 'invoices', label: 'Facturación & cobros', icon: <ClipboardCheck className="h-4 w-4" /> },
  { id: 'subscriptions', label: 'Suscripciones & cuotas', icon: <Coins className="h-4 w-4" /> },
  { id: 'delinquency', label: 'Morosidad', icon: <BadgePercent className="h-4 w-4" /> },
  { id: 'expenses', label: 'Gastos & proveedores', icon: <Wallet className="h-4 w-4" /> },
  { id: 'cash', label: 'Caja & bancos', icon: <Banknote className="h-4 w-4" /> },
  { id: 'forecast', label: 'Presupuestos & forecast', icon: <Calculator className="h-4 w-4" /> },
  { id: 'tax', label: 'Impuestos & export', icon: <FileSpreadsheet className="h-4 w-4" /> },
  { id: 'reports', label: 'Informes avanzados', icon: <BarChart3 className="h-4 w-4" /> },
  { id: 'pricing', label: 'Precios dinámicos', icon: <PiggyBank className="h-4 w-4" /> },
];

export function FinanzasPage() {
  const [metrics, setMetrics] = useState<FinancialMetric[]>([]);
  const [invoices, setInvoices] = useState<InvoiceSummary[]>([]);
  const [subscriptions, setSubscriptions] = useState<SubscriptionSummary[]>([]);
  const [expenses, setExpenses] = useState<ExpenseRecord[]>([]);
  const [cash, setCash] = useState<CashFlowEntry[]>([]);
  const [forecast, setForecast] = useState<ForecastEntry[]>([]);
  const [taxRecords, setTaxRecords] = useState<TaxExportRecord[]>([]);
  const [pricingInsights, setPricingInsights] = useState<DynamicPricingInsight[]>([]);
  const [selectedRange, setSelectedRange] = useState<RangeKey>('30d');
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const [
        metricsData,
        invoicesData,
        subscriptionsData,
        expensesData,
        cashData,
        forecastData,
        taxData,
        pricingData,
      ] = await Promise.all([
        fetchOverviewMetrics(),
        fetchInvoiceSummaries(),
        fetchSubscriptionSummaries(),
        fetchExpenseRecords(),
        fetchCashFlowEntries(),
        fetchForecastEntries(),
        fetchTaxExportRecords(),
        fetchDynamicPricingInsights(),
      ]);

      setMetrics(metricsData);
      setInvoices(invoicesData);
      setSubscriptions(subscriptionsData);
      setExpenses(expensesData);
      setCash(cashData);
      setForecast(forecastData);
      setTaxRecords(taxData);
      setPricingInsights(pricingData);
      setLoading(false);
    };

    void loadData();
  }, []);

  const delinquencyInvoices = useMemo(
    () => invoices.filter(invoice => invoice.status === 'vencida'),
    [invoices],
  );

  const getRangeStart = useMemo(() => {
    const map: Record<RangeKey, () => Date> = {
      '7d': () => {
        const date = new Date();
        date.setDate(date.getDate() - 7);
        return date;
      },
      '30d': () => {
        const date = new Date();
        date.setDate(date.getDate() - 30);
        return date;
      },
      '90d': () => {
        const date = new Date();
        date.setDate(date.getDate() - 90);
        return date;
      },
      ytd: () => {
        const today = new Date();
        return new Date(today.getFullYear(), 0, 1);
      },
    };
    return map;
  }, []);

  const rangeFilteredInvoices = useMemo(() => {
    const startDate = getRangeStart[selectedRange]();
    return invoices.filter(invoice => new Date(invoice.issuedAt) >= startDate);
  }, [getRangeStart, invoices, selectedRange]);

  const rangeFilteredExpenses = useMemo(() => {
    const startDate = getRangeStart[selectedRange]();
    return expenses.filter(expense => new Date(expense.paidAt) >= startDate);
  }, [expenses, getRangeStart, selectedRange]);

  const rangeSummary = useMemo(() => {
    const incomeSum = rangeFilteredInvoices.reduce((acc, invoice) => acc + invoice.amount, 0);
    const expensesSum = rangeFilteredExpenses.reduce((acc, expense) => acc + expense.amount, 0);
    const balance = incomeSum - expensesSum;
    return {
      incomeSum,
      expensesSum,
      balance,
      margin: incomeSum > 0 ? (balance / incomeSum) * 100 : 0,
    };
  }, [rangeFilteredExpenses, rangeFilteredInvoices]);

  const invoiceStats = useMemo(() => {
    if (!invoices.length) {
      return {
        totalAmount: 0,
        pendingAmount: 0,
        paidAmount: 0,
        overdueAmount: 0,
        pendingCount: 0,
        paidCount: 0,
        overdueCount: 0,
        averageCollectionDays: 0,
        nextDueInvoice: undefined as InvoiceSummary | undefined,
        delinquencyRate: 0,
      };
    }

    const totalAmount = invoices.reduce((acc, invoice) => acc + invoice.amount, 0);
    const pending = invoices.filter(invoice => invoice.status === 'pendiente');
    const paid = invoices.filter(invoice => invoice.status === 'pagada');
    const overdue = invoices.filter(invoice => invoice.status === 'vencida');

    const pendingAmount = pending.reduce((acc, invoice) => acc + invoice.amount, 0);
    const paidAmount = paid.reduce((acc, invoice) => acc + invoice.amount, 0);
    const overdueAmount = overdue.reduce((acc, invoice) => acc + invoice.amount, 0);

    const paidCollectionDays = paid.map(invoice => daysBetween(invoice.issuedAt, invoice.dueAt));
    const averageCollectionDays =
      paidCollectionDays.length > 0
        ? paidCollectionDays.reduce((acc, days) => acc + days, 0) / paidCollectionDays.length
        : 0;

    const nextDueInvoice = pending
      .slice()
      .sort((a, b) => new Date(a.dueAt).getTime() - new Date(b.dueAt).getTime())[0];

    const delinquencyRate = totalAmount > 0 ? (overdueAmount / totalAmount) * 100 : 0;

    return {
      totalAmount,
      pendingAmount,
      paidAmount,
      overdueAmount,
      pendingCount: pending.length,
      paidCount: paid.length,
      overdueCount: overdue.length,
      averageCollectionDays,
      nextDueInvoice,
      delinquencyRate,
    };
  }, [invoices]);

  const subscriptionStats = useMemo(() => {
    if (!subscriptions.length) {
      return {
        activeCount: 0,
        pausedCount: 0,
        riskCount: 0,
        monthlyRecurringRevenue: 0,
        averageTicket: 0,
      };
    }

    const active = subscriptions.filter(subscription => subscription.status === 'activa');
    const paused = subscriptions.filter(subscription => subscription.status === 'en_pausa');
    const risk = subscriptions.filter(subscription => subscription.status === 'morosidad');

    const monthlyRecurringRevenue = active.reduce((acc, subscription) => acc + subscription.value, 0);
    const averageTicket =
      subscriptions.reduce((acc, subscription) => acc + subscription.value, 0) / subscriptions.length;

    return {
      activeCount: active.length,
      pausedCount: paused.length,
      riskCount: risk.length,
      monthlyRecurringRevenue,
      averageTicket,
    };
  }, [subscriptions]);

  const expenseStats = useMemo(() => {
    if (!expenses.length) {
      return {
        totalSpent: 0,
        pendingAmount: 0,
        paidAmount: 0,
        pendingCount: 0,
        paidCount: 0,
        topVendors: [] as Array<{ vendor: string; amount: number }>,
      };
    }

    const pending = expenses.filter(expense => expense.status === 'pendiente');
    const paid = expenses.filter(expense => expense.status === 'pagado');

    const totalSpent = expenses.reduce((acc, expense) => acc + expense.amount, 0);
    const pendingAmount = pending.reduce((acc, expense) => acc + expense.amount, 0);
    const paidAmount = paid.reduce((acc, expense) => acc + expense.amount, 0);

    const vendorMap = expenses.reduce<Record<string, number>>((acc, expense) => {
      acc[expense.vendor] = (acc[expense.vendor] ?? 0) + expense.amount;
      return acc;
    }, {});

    const topVendors = Object.entries(vendorMap)
      .map(([vendor, amount]) => ({ vendor, amount }))
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 3);

    return {
      totalSpent,
      pendingAmount,
      paidAmount,
      pendingCount: pending.length,
      paidCount: paid.length,
      topVendors,
    };
  }, [expenses]);

  const cashSummary = useMemo(() => {
    if (!cash.length) {
      return {
        totalBalance: 0,
        avgVariation: 0,
        positiveAccounts: 0,
        negativeAccounts: 0,
        runwayMonths: 0,
      };
    }

    const totalBalance = cash.reduce((acc, entry) => acc + entry.balance, 0);
    const avgVariation = cash.reduce((acc, entry) => acc + entry.variation, 0) / cash.length;
    const positiveAccounts = cash.filter(entry => entry.variation >= 0).length;
    const negativeAccounts = cash.length - positiveAccounts;

    const estimatedMonthlyBurn = Math.max(expenseStats.totalSpent / 2, 1); // aproximación
    const runwayMonths = estimatedMonthlyBurn > 0 ? totalBalance / estimatedMonthlyBurn : 0;

    return {
      totalBalance,
      avgVariation,
      positiveAccounts,
      negativeAccounts,
      runwayMonths,
    };
  }, [cash, expenseStats.totalSpent]);

  const forecastInsights = useMemo(() => {
    if (!forecast.length) {
      return {
        projectedRevenue: 0,
        projectedExpenses: 0,
        avgConfidence: 0,
        marginRate: 0,
      };
    }

    const projectedRevenue = forecast.reduce((acc, entry) => acc + entry.projectedRevenue, 0);
    const projectedExpenses = forecast.reduce((acc, entry) => acc + entry.projectedExpenses, 0);
    const avgConfidence = forecast.reduce((acc, entry) => acc + entry.confidence, 0) / forecast.length;
    const marginRate =
      projectedRevenue > 0 ? ((projectedRevenue - projectedExpenses) / projectedRevenue) * 100 : 0;

    return {
      projectedRevenue,
      projectedExpenses,
      avgConfidence,
      marginRate,
    };
  }, [forecast]);

  const pricingImpact = useMemo(() => {
    if (!pricingInsights.length) {
      return {
        positivo: 0,
        neutral: 0,
        negativo: 0,
      };
    }

    return pricingInsights.reduce(
      (acc, insight) => {
        acc[insight.impact] += 1;
        return acc;
      },
      { positivo: 0, neutral: 0, negativo: 0 } as Record<'positivo' | 'neutral' | 'negativo', number>,
    );
  }, [pricingInsights]);

  const upcomingInvoices = useMemo(
    () =>
      invoices
        .filter(invoice => invoice.status === 'pendiente')
        .sort((a, b) => new Date(a.dueAt).getTime() - new Date(b.dueAt).getTime())
        .slice(0, 4),
    [invoices],
  );

  const riskSubscriptions = useMemo(
    () => subscriptions.filter(subscription => subscription.status === 'morosidad'),
    [subscriptions],
  );

  const pausedSubscriptions = useMemo(
    () => subscriptions.filter(subscription => subscription.status === 'en_pausa'),
    [subscriptions],
  );

  const pendingExpenses = useMemo(
    () => expenses.filter(expense => expense.status === 'pendiente'),
    [expenses],
  );

  const taxSummary = useMemo(() => {
    if (!taxRecords.length) {
      return {
        totalAmount: 0,
        prepared: 0,
        sent: 0,
        validated: 0,
      };
    }

    const counters = taxRecords.reduce(
      (acc, record) => {
        acc.totalAmount += record.amount;
        acc[record.status] += 1;
        return acc;
      },
      { totalAmount: 0, preparado: 0, enviado: 0, validado: 0 } as {
        totalAmount: number;
        preparado: number;
        enviado: number;
        validado: number;
      },
    );

    return {
      totalAmount: counters.totalAmount,
      prepared: counters.preparado,
      sent: counters.enviado,
      validated: counters.validado,
    };
  }, [taxRecords]);

  const actionableAlerts = useMemo(() => {
    const alerts: Array<{
      id: string;
      title: string;
      description: string;
      tone: 'success' | 'warning' | 'danger' | 'info';
    }> = [];

    if (invoiceStats.overdueAmount > 0) {
      alerts.push({
        id: 'alert-overdue',
        title: 'Seguimiento de morosidad',
        description: `Tienes ${invoiceStats.overdueCount} facturas vencidas por ${formatCurrency(
          invoiceStats.overdueAmount,
        )}. Prioriza la recuperación.`,
        tone: 'danger',
      });
    }

    if (cashSummary.runwayMonths < 3 && cashSummary.totalBalance > 0) {
      alerts.push({
        id: 'alert-runway',
        title: 'Runway ajustado',
        description: `La caja actual cubre aproximadamente ${cashSummary.runwayMonths.toFixed(
          1,
        )} meses. Evalúa optimizar gastos o impulsar ventas.`,
        tone: 'warning',
      });
    }

    if (subscriptionStats.riskCount > 0) {
      alerts.push({
        id: 'alert-subscriptions',
        title: 'Suscripciones en riesgo',
        description: `${subscriptionStats.riskCount} membresías están en morosidad. Coordina acciones de retención.`,
        tone: 'info',
      });
    }

    if (!alerts.length) {
      alerts.push({
        id: 'alert-ok',
        title: 'Salud financiera estable',
        description: 'No hay alertas críticas en el período analizado. Mantén el ritmo de seguimiento actual.',
        tone: 'success',
      });
    }

    return alerts;
  }, [
    cashSummary.runwayMonths,
    cashSummary.totalBalance,
    invoiceStats.overdueAmount,
    invoiceStats.overdueCount,
    subscriptionStats.riskCount,
  ]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <header className="border-b border-slate-200/60 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/70">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6">
          <div className="py-8">
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="flex items-center gap-4">
                  <div className="rounded-2xl bg-gradient-to-br from-teal-100 to-sky-100 p-3 ring-1 ring-teal-200/60">
                    <BarChart3 className="h-7 w-7 text-teal-600" />
                  </div>
                  <div>
                    <div className="flex flex-col gap-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 md:text-4xl">
                          Finanzas
                        </h1>
                        <Badge variant="blue" size="md" leftIcon={<CalendarRange className="h-4 w-4" />}>
                          {RANGE_OPTIONS.find(range => range.id === selectedRange)?.description ?? ''}
                        </Badge>
                      </div>
                      <p className="max-w-2xl text-sm text-slate-600 md:text-base">
                        Control absoluto sobre ingresos, gastos, cobros y runway financiero para tomar decisiones en
                        tiempo real.
                      </p>
                    </div>
                    <div className="mt-4 grid gap-3 sm:grid-cols-2">
                      <div className="flex items-center gap-3 rounded-2xl border border-teal-200/60 bg-teal-50/60 p-3 text-teal-800">
                        <LineChart className="h-5 w-5" />
                        <div className="flex flex-col">
                          <span className="text-xs font-medium uppercase tracking-wide text-teal-600">
                            Ingresos - Gastos período
                          </span>
                          <span className="text-lg font-semibold">
                            {formatCurrency(rangeSummary.balance)}{' '}
                            <span className="text-xs font-normal text-teal-600">
                              ({formatPercent(rangeSummary.margin)})
                            </span>
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 rounded-2xl border border-slate-200/60 bg-white p-3 shadow-sm">
                        <PieChart className="h-5 w-5 text-slate-500" />
                        <div className="flex flex-col">
                          <span className="text-xs font-medium uppercase tracking-wide text-slate-500">
                            Cobros pendientes
                          </span>
                          <span className="text-lg font-semibold text-slate-900">
                            {formatCurrency(invoiceStats.pendingAmount)}{' '}
                            <span className="text-xs font-normal text-slate-500">
                              {invoiceStats.pendingCount} facturas
                            </span>
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                  <div className="flex flex-wrap items-center gap-2">
                    {RANGE_OPTIONS.map(range => (
                      <Button
                        key={range.id}
                        variant={range.id === selectedRange ? 'primary' : 'ghost'}
                        size="sm"
                        className={`rounded-full border transition ${
                          range.id === selectedRange
                            ? 'border-teal-500 bg-teal-600 text-white shadow-md'
                            : 'border-slate-200 bg-white text-slate-600 hover:border-teal-500 hover:text-teal-600'
                        }`}
                        onClick={() => setSelectedRange(range.id)}
                      >
                        {range.label}
                      </Button>
                    ))}
                  </div>
                  <div className="flex flex-col gap-2 sm:flex-row">
                    <Button variant="secondary" leftIcon={<Download size={16} />}>
                      Exportar reporte
                    </Button>
                    <Button
                      variant="ghost"
                      leftIcon={<RefreshCcw size={16} />}
                      onClick={() => setActiveTab('overview')}
                    >
                      Actualizar
                    </Button>
                  </div>
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                {actionableAlerts.map(alert => (
                  <Card
                    key={alert.id}
                    className={`border ${
                      alert.tone === 'danger'
                        ? 'border-red-200 bg-red-50/60'
                        : alert.tone === 'warning'
                          ? 'border-amber-200 bg-amber-50/60'
                          : alert.tone === 'info'
                            ? 'border-blue-200 bg-blue-50/60'
                            : 'border-teal-200 bg-teal-50/60'
                    }`}
                    padding="lg"
                  >
                    <div className="flex items-start gap-3">
                      {alert.tone === 'danger' && <AlertTriangle className="mt-1 h-5 w-5 text-red-600" />}
                      {alert.tone === 'warning' && <Clock className="mt-1 h-5 w-5 text-amber-600" />}
                      {alert.tone === 'info' && <Users className="mt-1 h-5 w-5 text-blue-600" />}
                      {alert.tone === 'success' && <CheckCircle2 className="mt-1 h-5 w-5 text-teal-600" />}
                      <div>
                        <h3 className="text-sm font-semibold text-slate-900">{alert.title}</h3>
                        <p className="mt-1 text-sm text-slate-600">{alert.description}</p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1600px] px-4 py-8 sm:px-6 lg:px-6">
        <div className="space-y-8">
          <Tabs items={TAB_ITEMS} activeTab={activeTab} onTabChange={setActiveTab} variant="underline" />

          {activeTab === 'overview' && (
            <>
              {loading ? (
                <div className="h-64 animate-pulse rounded-2xl bg-slate-100 dark:bg-slate-800" />
              ) : (
                <div className="space-y-8">
                  <OverviewMetrics metrics={metrics} />

                  <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                    <Card className="bg-white shadow-sm ring-1 ring-slate-200/70" padding="lg">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                            Cobros en curso
                          </p>
                          <p className="mt-2 text-2xl font-bold text-slate-900">
                            {formatCurrency(invoiceStats.pendingAmount)}
                          </p>
                          <p className="mt-1 text-sm text-slate-500">{invoiceStats.pendingCount} facturas activas</p>
                        </div>
                        <div className="rounded-xl bg-teal-100 p-3 text-teal-600">
                          <ClipboardCheck className="h-5 w-5" />
                        </div>
                      </div>
                      {invoiceStats.nextDueInvoice && (
                        <p className="mt-4 text-xs text-slate-500">
                          Próximo vencimiento: <span className="font-semibold text-slate-700">
                            {invoiceStats.nextDueInvoice.client}
                          </span>{' '}
                          ({formatCurrency(invoiceStats.nextDueInvoice.amount)})
                        </p>
                      )}
                    </Card>

                    <Card className="bg-white shadow-sm ring-1 ring-slate-200/70" padding="lg">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                            Runway estimado
                          </p>
                          <p className="mt-2 text-2xl font-bold text-slate-900">
                            {cashSummary.runwayMonths.toFixed(1)} meses
                          </p>
                          <p className="mt-1 text-sm text-slate-500">
                            Caja total {formatCurrency(cashSummary.totalBalance)}
                          </p>
                        </div>
                        <div className="rounded-xl bg-blue-100 p-3 text-blue-600">
                          <Banknote className="h-5 w-5" />
                        </div>
                      </div>
                      <p className="mt-4 text-xs text-slate-500">
                        Variación promedio {cashSummary.avgVariation.toFixed(1)}% &bull;{' '}
                        {cashSummary.positiveAccounts} cuentas al alza
                      </p>
                    </Card>

                    <Card className="bg-white shadow-sm ring-1 ring-slate-200/70" padding="lg">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">MRR activo</p>
                          <p className="mt-2 text-2xl font-bold text-slate-900">
                            {formatCurrency(subscriptionStats.monthlyRecurringRevenue)}
                          </p>
                          <p className="mt-1 text-sm text-slate-500">
                            Ticket medio {formatCurrency(subscriptionStats.averageTicket)}
                          </p>
                        </div>
                        <div className="rounded-xl bg-emerald-100 p-3 text-emerald-600">
                          <Users className="h-5 w-5" />
                        </div>
                      </div>
                      <p className="mt-4 text-xs text-slate-500">
                        {subscriptionStats.activeCount} activas &bull; {subscriptionStats.riskCount} en riesgo
                      </p>
                    </Card>

                    <Card className="bg-white shadow-sm ring-1 ring-slate-200/70" padding="lg">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                            Forecast próximos meses
                          </p>
                          <p className="mt-2 text-2xl font-bold text-slate-900">
                            {formatCurrency(forecastInsights.projectedRevenue)}
                          </p>
                          <p className="mt-1 text-sm text-slate-500">
                            Margen esperado {formatPercent(forecastInsights.marginRate)}
                          </p>
                        </div>
                        <div className="rounded-xl bg-violet-100 p-3 text-violet-600">
                          <BarChart3 className="h-5 w-5" />
                        </div>
                      </div>
                      <p className="mt-4 text-xs text-slate-500">
                        Confianza promedio {(forecastInsights.avgConfidence * 100).toFixed(0)}%
                      </p>
                    </Card>
                  </div>

                  <Card className="bg-gradient-to-br from-white via-slate-50 to-slate-100 shadow-sm ring-1 ring-slate-200/60" padding="lg">
                    <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-slate-900">Balance operativo del período</h3>
                        <p className="mt-1 text-sm text-slate-600">
                          Comparativa de ingresos vs gastos considerados en la ventana seleccionada.
                        </p>
                      </div>
                      <Badge
                        variant={rangeSummary.balance >= 0 ? 'green' : 'red'}
                        size="md"
                        leftIcon={rangeSummary.balance >= 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                      >
                        {rangeSummary.balance >= 0 ? 'Balance positivo' : 'Balance negativo'}
                      </Badge>
                    </div>
                    <div className="mt-6 grid gap-6 md:grid-cols-3">
                      <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200/60">
                        <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Ingresos</p>
                        <p className="mt-2 text-xl font-semibold text-slate-900">
                          {formatCurrency(rangeSummary.incomeSum)}
                        </p>
                      </div>
                      <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200/60">
                        <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Gastos</p>
                        <p className="mt-2 text-xl font-semibold text-slate-900">
                          {formatCurrency(rangeSummary.expensesSum)}
                        </p>
                      </div>
                      <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200/60">
                        <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Margen</p>
                        <p className="mt-2 text-xl font-semibold text-slate-900">
                          {formatCurrency(rangeSummary.balance)}
                        </p>
                        <p className="mt-1 text-sm text-slate-500">{formatPercent(rangeSummary.margin)}</p>
                      </div>
                    </div>
                  </Card>

                  <div className="grid gap-6 lg:grid-cols-2">
                    <Card className="bg-white shadow-sm ring-1 ring-slate-200/70" padding="lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-lg font-semibold text-slate-900">Top proveedores</h3>
                          <p className="mt-1 text-sm text-slate-600">
                            Revisa a los proveedores con mayor peso en el gasto del período.
                          </p>
                        </div>
                        <Wallet className="h-6 w-6 text-slate-400" />
                      </div>
                      <div className="mt-6 space-y-4">
                        {expenseStats.topVendors.map(vendor => (
                          <div key={vendor.vendor} className="flex items-center justify-between rounded-xl border border-slate-200/70 p-4">
                            <div className="flex flex-col">
                              <span className="text-sm font-semibold text-slate-700">{vendor.vendor}</span>
                              <span className="text-xs text-slate-500">Gasto acumulado</span>
                            </div>
                            <span className="text-sm font-semibold text-slate-900">
                              {formatCurrency(vendor.amount)}
                            </span>
                          </div>
                        ))}
                        {!expenseStats.topVendors.length && (
                          <p className="text-sm text-slate-500">Sin gastos registrados en este período.</p>
                        )}
                      </div>
                    </Card>

                    <Card className="bg-white shadow-sm ring-1 ring-slate-200/70" padding="lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-lg font-semibold text-slate-900">Equipo de pricing</h3>
                          <p className="mt-1 text-sm text-slate-600">
                            Impacto de los ajustes recientes y recomendaciones automáticas.
                          </p>
                        </div>
                        <PiggyBank className="h-6 w-6 text-slate-400" />
                      </div>
                      <div className="mt-6 grid grid-cols-3 gap-4 text-center">
                        <div className="rounded-2xl border border-slate-200/60 bg-slate-50 p-4">
                          <p className="text-xs uppercase text-slate-500">Positivos</p>
                          <p className="mt-2 text-lg font-semibold text-emerald-600">
                            {pricingImpact.positivo}
                          </p>
                        </div>
                        <div className="rounded-2xl border border-slate-200/60 bg-slate-50 p-4">
                          <p className="text-xs uppercase text-slate-500">Neutros</p>
                          <p className="mt-2 text-lg font-semibold text-slate-600">
                            {pricingImpact.neutral}
                          </p>
                        </div>
                        <div className="rounded-2xl border border-slate-200/60 bg-slate-50 p-4">
                          <p className="text-xs uppercase text-slate-500">Negativos</p>
                          <p className="mt-2 text-lg font-semibold text-red-600">
                            {pricingImpact.negativo}
                          </p>
                        </div>
                      </div>
                      <div className="mt-6 space-y-3">
                        {pricingInsights.slice(0, 3).map(insight => (
                          <div key={insight.id} className="rounded-2xl border border-slate-200/60 bg-slate-50 p-4">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-sm font-semibold text-slate-700">{insight.product}</p>
                                <p className="text-xs text-slate-500">Último cambio {new Date(insight.lastChange).toLocaleDateString('es-ES')}</p>
                              </div>
                              <Badge
                                variant={
                                  insight.impact === 'positivo' ? 'green' : insight.impact === 'neutral' ? 'blue' : 'red'
                                }
                                size="sm"
                              >
                                {insight.impact}
                              </Badge>
                            </div>
                            <p className="mt-3 text-sm text-slate-600">{insight.recommendation}</p>
                          </div>
                        ))}
                      </div>
                    </Card>
                  </div>
                </div>
              )}
            </>
          )}

          {activeTab === 'invoices' && (
            <>
              {loading ? (
                <div className="h-64 animate-pulse rounded-2xl bg-slate-100 dark:bg-slate-800" />
              ) : (
                <div className="space-y-6">
                  <div className="grid gap-4 md:grid-cols-3">
                    <Card className="bg-white shadow-sm ring-1 ring-slate-200/70" padding="lg">
                      <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                        Facturación total
                      </p>
                      <p className="mt-2 text-2xl font-bold text-slate-900">{formatCurrency(invoiceStats.totalAmount)}</p>
                      <p className="mt-1 text-sm text-slate-500">
                        Pagado {formatCurrency(invoiceStats.paidAmount)} ({invoiceStats.paidCount} facturas)
                      </p>
                    </Card>
                    <Card className="bg-white shadow-sm ring-1 ring-slate-200/70" padding="lg">
                      <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                        Índice de morosidad
                      </p>
                      <p className="mt-2 text-2xl font-bold text-slate-900">
                        {formatPercent(invoiceStats.delinquencyRate)}
                      </p>
                      <p className="mt-1 text-sm text-slate-500">
                        {invoiceStats.overdueCount} facturas vencidas ({formatCurrency(invoiceStats.overdueAmount)})
                      </p>
                    </Card>
                    <Card className="bg-white shadow-sm ring-1 ring-slate-200/70" padding="lg">
                      <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                        Días promedio de cobro
                      </p>
                      <p className="mt-2 text-2xl font-bold text-slate-900">
                        {invoiceStats.averageCollectionDays.toFixed(0)} días
                      </p>
                      <p className="mt-1 text-sm text-slate-500">Basado en facturas pagadas</p>
                    </Card>
                  </div>

                  <Card className="bg-white shadow-sm ring-1 ring-slate-200/70" padding="lg">
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-slate-900">Próximos vencimientos</h3>
                        <p className="mt-1 text-sm text-slate-600">
                          Controla las facturas en seguimiento prioritario durante los próximos días.
                        </p>
                      </div>
                      <Badge variant="orange" size="md" leftIcon={<Clock className="h-4 w-4" />}>
                        {upcomingInvoices.length} pendientes
                      </Badge>
                    </div>
                    <div className="mt-6 space-y-3">
                      {upcomingInvoices.map(invoice => (
                        <div
                          key={invoice.id}
                          className="flex flex-col gap-2 rounded-2xl border border-slate-200/70 bg-slate-50 p-4 md:flex-row md:items-center md:justify-between"
                        >
                          <div>
                            <p className="text-sm font-semibold text-slate-700">{invoice.client}</p>
                            <p className="text-xs text-slate-500">Factura {invoice.id}</p>
                          </div>
                          <div className="flex flex-col text-sm text-slate-600 md:text-right">
                            <span>{formatCurrency(invoice.amount)}</span>
                            <span className="text-xs">
                              Vence el {new Date(invoice.dueAt).toLocaleDateString('es-ES')}
                            </span>
                          </div>
                        </div>
                      ))}
                      {!upcomingInvoices.length && (
                        <p className="text-sm text-slate-500">No hay facturas próximas a vencer.</p>
                      )}
                    </div>
                  </Card>

                  <InvoicesTable invoices={invoices} />
                </div>
              )}
            </>
          )}

          {activeTab === 'subscriptions' && (
            <>
              {loading ? (
                <div className="h-64 animate-pulse rounded-2xl bg-slate-100 dark:bg-slate-800" />
              ) : (
                <div className="space-y-6">
                  <div className="grid gap-4 md:grid-cols-4">
                    <Card className="bg-white shadow-sm ring-1 ring-emerald-200/70" padding="lg">
                      <p className="text-xs font-medium uppercase tracking-wide text-emerald-600">Activas</p>
                      <p className="mt-2 text-2xl font-bold text-emerald-700">{subscriptionStats.activeCount}</p>
                      <p className="mt-1 text-sm text-emerald-600">
                        MRR {formatCurrency(subscriptionStats.monthlyRecurringRevenue)}
                      </p>
                    </Card>
                    <Card className="bg-white shadow-sm ring-1 ring-blue-200/70" padding="lg">
                      <p className="text-xs font-medium uppercase tracking-wide text-blue-600">En pausa</p>
                      <p className="mt-2 text-2xl font-bold text-blue-700">{pausedSubscriptions.length}</p>
                      <p className="mt-1 text-sm text-blue-600">Oportunidades de reactivación</p>
                    </Card>
                    <Card className="bg-white shadow-sm ring-1 ring-amber-200/70" padding="lg">
                      <p className="text-xs font-medium uppercase tracking-wide text-amber-600">Morosidad</p>
                      <p className="mt-2 text-2xl font-bold text-amber-700">{riskSubscriptions.length}</p>
                      <p className="mt-1 text-sm text-amber-600">Plan de retención recomendado</p>
                    </Card>
                    <Card className="bg-white shadow-sm ring-1 ring-slate-200/70" padding="lg">
                      <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Ticket medio</p>
                      <p className="mt-2 text-2xl font-bold text-slate-900">
                        {formatCurrency(subscriptionStats.averageTicket)}
                      </p>
                      <p className="mt-1 text-sm text-slate-500">Por suscriptor recurrente</p>
                    </Card>
                  </div>

                  <Card className="bg-white shadow-sm ring-1 ring-slate-200/70" padding="lg">
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-slate-900">Alertas de retención</h3>
                        <p className="mt-1 text-sm text-slate-600">
                          Identifica miembros que requieren contacto para evitar bajas o cancelaciones.
                        </p>
                      </div>
                      <Badge variant="yellow" size="md" leftIcon={<AlertTriangle className="h-4 w-4" />}>
                        {riskSubscriptions.length} en riesgo
                      </Badge>
                    </div>
                    <div className="mt-6 space-y-3">
                      {riskSubscriptions.map(subscription => (
                        <div
                          key={subscription.id}
                          className="flex flex-col gap-3 rounded-2xl border border-amber-200/70 bg-amber-50 p-4 md:flex-row md:items-center md:justify-between"
                        >
                          <div>
                            <p className="text-sm font-semibold text-slate-800">{subscription.memberName}</p>
                            <p className="text-xs text-slate-500">
                              Plan {subscription.planName} • Ciclo {subscription.billingCycle}
                            </p>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-amber-600">
                              {formatCurrency(subscription.value)}
                            </span>
                            <Button variant="secondary" size="sm" className="rounded-full">
                              Agendar llamada
                            </Button>
                          </div>
                        </div>
                      ))}
                      {!riskSubscriptions.length && (
                        <p className="text-sm text-slate-500">Sin membresías en riesgo actualmente.</p>
                      )}
                    </div>
                  </Card>

                  <SubscriptionsTable subscriptions={subscriptions} />
                </div>
              )}
            </>
          )}

          {activeTab === 'delinquency' && (
            <>
              {loading ? (
                <div className="h-48 animate-pulse rounded-2xl bg-slate-100 dark:bg-slate-800" />
              ) : (
                <div className="space-y-6">
                  <div className="grid gap-4 md:grid-cols-3">
                    <Card className="bg-white shadow-sm ring-1 ring-red-200/70" padding="lg">
                      <p className="text-xs font-medium uppercase tracking-wide text-red-600">Monto vencido</p>
                      <p className="mt-2 text-2xl font-bold text-red-700">
                        {formatCurrency(invoiceStats.overdueAmount)}
                      </p>
                      <p className="mt-1 text-sm text-red-600">
                        {invoiceStats.overdueCount} facturas fuera de término
                      </p>
                    </Card>
                    <Card className="bg-white shadow-sm ring-1 ring-orange-200/70" padding="lg">
                      <p className="text-xs font-medium uppercase tracking-wide text-orange-600">Cobros urgentes</p>
                      <p className="mt-2 text-2xl font-bold text-orange-700">{upcomingInvoices.length}</p>
                      <p className="mt-1 text-sm text-orange-600">Pendientes de gestión inmediata</p>
                    </Card>
                    <Card className="bg-white shadow-sm ring-1 ring-slate-200/70" padding="lg">
                      <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Tiempo promedio</p>
                      <p className="mt-2 text-2xl font-bold text-slate-900">
                        {invoiceStats.averageCollectionDays.toFixed(0)} días
                      </p>
                      <p className="mt-1 text-sm text-slate-500">Hasta el cobro efectivo</p>
                    </Card>
                  </div>

                  <Card className="bg-white shadow-sm ring-1 ring-slate-200/70" padding="lg">
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-slate-900">Facturas vencidas</h3>
                        <p className="mt-1 text-sm text-slate-600">
                          Coordina acciones con el equipo de cobranzas y automatizaciones de recordatorio.
                        </p>
                      </div>
                      <div className="flex flex-wrap items-center gap-2">
                        <Button variant="secondary" size="sm" leftIcon={<Zap className="h-4 w-4" />}>
                          Lanzar recordatorio
                        </Button>
                        <Button variant="ghost" size="sm">
                          Descargar listado
                        </Button>
                      </div>
                    </div>
                    <div className="mt-6">
                      <InvoicesTable invoices={delinquencyInvoices} />
                    </div>
                  </Card>
                </div>
              )}
            </>
          )}

          {activeTab === 'expenses' && (
            <>
              {loading ? (
                <div className="h-64 animate-pulse rounded-2xl bg-slate-100 dark:bg-slate-800" />
              ) : (
                <div className="space-y-6">
                  <div className="grid gap-4 md:grid-cols-4">
                    <Card className="bg-white shadow-sm ring-1 ring-slate-200/70" padding="lg">
                      <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Gasto total</p>
                      <p className="mt-2 text-2xl font-bold text-slate-900">{formatCurrency(expenseStats.totalSpent)}</p>
                    </Card>
                    <Card className="bg-white shadow-sm ring-1 ring-green-200/70" padding="lg">
                      <p className="text-xs font-medium uppercase tracking-wide text-green-600">Pagado</p>
                      <p className="mt-2 text-2xl font-bold text-green-700">{formatCurrency(expenseStats.paidAmount)}</p>
                      <p className="mt-1 text-sm text-green-600">{expenseStats.paidCount} comprobantes</p>
                    </Card>
                    <Card className="bg-white shadow-sm ring-1 ring-amber-200/70" padding="lg">
                      <p className="text-xs font-medium uppercase tracking-wide text-amber-600">Pendiente</p>
                      <p className="mt-2 text-2xl font-bold text-amber-700">
                        {formatCurrency(expenseStats.pendingAmount)}
                      </p>
                      <p className="mt-1 text-sm text-amber-600">{expenseStats.pendingCount} facturas</p>
                    </Card>
                    <Card className="bg-white shadow-sm ring-1 ring-slate-200/70" padding="lg">
                      <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Top proveedor</p>
                      <p className="mt-2 text-lg font-semibold text-slate-900">
                        {expenseStats.topVendors[0]?.vendor ?? 'Sin datos'}
                      </p>
                      {expenseStats.topVendors[0] && (
                        <p className="text-sm text-slate-500">
                          {formatCurrency(expenseStats.topVendors[0].amount)} en el período
                        </p>
                      )}
                    </Card>
                  </div>

                  <Card className="bg-white shadow-sm ring-1 ring-slate-200/70" padding="lg">
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-slate-900">Pagos programados</h3>
                        <p className="mt-1 text-sm text-slate-600">
                          Revisa y autoriza los pagos pendientes para mantener una buena relación con proveedores.
                        </p>
                      </div>
                      <Badge variant="orange" size="md" leftIcon={<Wallet className="h-4 w-4" />}>
                        {pendingExpenses.length} pendientes
                      </Badge>
                    </div>
                    <div className="mt-6 space-y-3">
                      {pendingExpenses.map(expense => (
                        <div
                          key={expense.id}
                          className="flex flex-col gap-3 rounded-2xl border border-amber-200/70 bg-amber-50 p-4 md:flex-row md:items-center md:justify-between"
                        >
                          <div>
                            <p className="text-sm font-semibold text-slate-800">{expense.vendor}</p>
                            <p className="text-xs text-slate-500">{expense.category}</p>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="text-sm font-semibold text-amber-700">
                              {formatCurrency(expense.amount)}
                            </span>
                            <Button variant="secondary" size="sm">
                              Aprobar pago
                            </Button>
                          </div>
                        </div>
                      ))}
                      {!pendingExpenses.length && (
                        <p className="text-sm text-slate-500">No hay pagos pendientes de aprobación.</p>
                      )}
                    </div>
                  </Card>

                  <ExpensesTable expenses={expenses} />
                </div>
              )}
            </>
          )}

          {activeTab === 'cash' && (
            <>
              {loading ? (
                <div className="h-48 animate-pulse rounded-2xl bg-slate-100 dark:bg-slate-800" />
              ) : (
                <div className="space-y-6">
                  <div className="grid gap-4 md:grid-cols-3">
                    <Card className="bg-white shadow-sm ring-1 ring-slate-200/70" padding="lg">
                      <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Saldo consolidado</p>
                      <p className="mt-2 text-2xl font-bold text-slate-900">{formatCurrency(cashSummary.totalBalance)}</p>
                    </Card>
                    <Card className="bg-white shadow-sm ring-1 ring-emerald-200/70" padding="lg">
                      <p className="text-xs font-medium uppercase tracking-wide text-emerald-600">
                        Variación promedio
                      </p>
                      <p className="mt-2 text-2xl font-bold text-emerald-700">
                        {cashSummary.avgVariation.toFixed(1)}%
                      </p>
                      <p className="mt-1 text-sm text-emerald-600">{cashSummary.positiveAccounts} cuentas al alza</p>
                    </Card>
                    <Card className="bg-white shadow-sm ring-1 ring-blue-200/70" padding="lg">
                      <p className="text-xs font-medium uppercase tracking-wide text-blue-600">Runway</p>
                      <p className="mt-2 text-2xl font-bold text-blue-700">{cashSummary.runwayMonths.toFixed(1)} meses</p>
                      <p className="mt-1 text-sm text-blue-600">Cobertura sobre gastos actuales</p>
                    </Card>
                  </div>

                  <CashFlowPanel entries={cash} />
                </div>
              )}
            </>
          )}

          {activeTab === 'forecast' && (
            <>
              {loading ? (
                <div className="h-48 animate-pulse rounded-2xl bg-slate-100 dark:bg-slate-800" />
              ) : (
                <div className="space-y-6">
                  <Card className="bg-white shadow-sm ring-1 ring-slate-200/70" padding="lg">
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-slate-900">Resumen de forecast</h3>
                        <p className="mt-1 text-sm text-slate-600">
                          Proyección consolidada de ingresos y gastos para los próximos períodos.
                        </p>
                      </div>
                      <Badge variant="blue" size="md" leftIcon={<Calculator className="h-4 w-4" />}>
                        Confianza {(forecastInsights.avgConfidence * 100).toFixed(0)}%
                      </Badge>
                    </div>
                    <div className="mt-6 grid gap-4 md:grid-cols-3">
                      <div className="rounded-2xl bg-slate-50 p-4">
                        <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Ingresos proyectados</p>
                        <p className="mt-2 text-xl font-semibold text-slate-900">
                          {formatCurrency(forecastInsights.projectedRevenue)}
                        </p>
                      </div>
                      <div className="rounded-2xl bg-slate-50 p-4">
                        <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Gastos proyectados</p>
                        <p className="mt-2 text-xl font-semibold text-slate-900">
                          {formatCurrency(forecastInsights.projectedExpenses)}
                        </p>
                      </div>
                      <div className="rounded-2xl bg-slate-50 p-4">
                        <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Margen esperado</p>
                        <p className="mt-2 text-xl font-semibold text-slate-900">
                          {formatPercent(forecastInsights.marginRate)}
                        </p>
                      </div>
                    </div>
                  </Card>

                  <ForecastPanel entries={forecast} />
                </div>
              )}
            </>
          )}

          {activeTab === 'tax' && (
            <>
              {loading ? (
                <div className="h-64 animate-pulse rounded-2xl bg-slate-100 dark:bg-slate-800" />
              ) : (
                <div className="space-y-6">
                  <div className="grid gap-4 md:grid-cols-4">
                    <Card className="bg-white shadow-sm ring-1 ring-slate-200/70" padding="lg">
                      <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Total impuestos</p>
                      <p className="mt-2 text-2xl font-bold text-slate-900">{formatCurrency(taxSummary.totalAmount)}</p>
                    </Card>
                    <Card className="bg-white shadow-sm ring-1 ring-blue-200/70" padding="lg">
                      <p className="text-xs font-medium uppercase tracking-wide text-blue-600">Preparados</p>
                      <p className="mt-2 text-2xl font-bold text-blue-700">{taxSummary.prepared}</p>
                    </Card>
                    <Card className="bg-white shadow-sm ring-1 ring-emerald-200/70" padding="lg">
                      <p className="text-xs font-medium uppercase tracking-wide text-emerald-600">Enviados</p>
                      <p className="mt-2 text-2xl font-bold text-emerald-700">{taxSummary.sent}</p>
                    </Card>
                    <Card className="bg-white shadow-sm ring-1 ring-teal-200/70" padding="lg">
                      <p className="text-xs font-medium uppercase tracking-wide text-teal-600">Validados</p>
                      <p className="mt-2 text-2xl font-bold text-teal-700">{taxSummary.validated}</p>
                    </Card>
                  </div>

                  <Card className="bg-white shadow-sm ring-1 ring-slate-200/70" padding="lg">
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-slate-900">Obligaciones fiscales</h3>
                        <p className="mt-1 text-sm text-slate-600">
                          Exporta los libros y modelos listos para presentar o comparte con tu asesoría.
                        </p>
                      </div>
                      <Button variant="secondary" size="sm" leftIcon={<FileBarChart2 className="h-4 w-4" />}>
                        Exportar todo
                      </Button>
                    </div>
                    <div className="mt-6">
                      <TaxExportTable records={taxRecords} />
                    </div>
                  </Card>
                </div>
              )}
            </>
          )}

          {activeTab === 'reports' && (
            <div className="space-y-6">
              <Card className="bg-white shadow-sm ring-1 ring-slate-200/70" padding="lg">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900">Centro de informes avanzados</h3>
                    <p className="mt-1 text-sm text-slate-600">
                      Genera dashboards ejecutivos, descarga informes personalizados y programa envíos automáticos.
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="secondary" size="sm" leftIcon={<Download className="h-4 w-4" />}>
                      Descargar P&L
                    </Button>
                    <Button variant="ghost" size="sm">
                      Nueva programación
                    </Button>
                  </div>
                </div>
                <div className="mt-6 grid gap-4 md:grid-cols-3">
                  <div className="rounded-2xl border border-slate-200/60 bg-slate-50 p-4">
                    <p className="text-sm font-semibold text-slate-700">Reporte de ingresos</p>
                    <p className="mt-2 text-xs text-slate-500">
                      Desglosa ingresos por tipo de producto, canal y segmento de clientes.
                    </p>
                  </div>
                  <div className="rounded-2xl border border-slate-200/60 bg-slate-50 p-4">
                    <p className="text-sm font-semibold text-slate-700">Balance mensual</p>
                    <p className="mt-2 text-xs text-slate-500">
                      Evolución de activos y pasivos con variaciones vs el mes anterior.
                    </p>
                  </div>
                  <div className="rounded-2xl border border-slate-200/60 bg-slate-50 p-4">
                    <p className="text-sm font-semibold text-slate-700">KPIs operativos</p>
                    <p className="mt-2 text-xs text-slate-500">
                      Incluye churn, CAC recuperado, MRR y margen de contribución.
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="bg-white shadow-sm ring-1 ring-slate-200/70" padding="lg">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900">Programaciones activas</h3>
                    <p className="mt-1 text-sm text-slate-600">
                      Controla los envíos automáticos a dirección, socios e inversionistas.
                    </p>
                  </div>
                  <Badge variant="blue" size="md">3 automaciones</Badge>
                </div>
                <div className="mt-6 space-y-3">
                  {[
                    {
                      id: 'sched-1',
                      name: 'Resumen semanal de caja',
                      cadence: 'Todos los lunes 08:00',
                      recipients: 'CFO, CEO',
                    },
                    {
                      id: 'sched-2',
                      name: 'Reporte de suscripciones',
                      cadence: 'Primer día de cada mes',
                      recipients: 'Equipo de crecimiento',
                    },
                    {
                      id: 'sched-3',
                      name: 'Panel de inversores',
                      cadence: 'Trimestral',
                      recipients: 'Stakeholders externos',
                    },
                  ].map(schedule => (
                    <div
                      key={schedule.id}
                      className="flex flex-col gap-3 rounded-2xl border border-slate-200/70 bg-slate-50 p-4 md:flex-row md:items-center md:justify-between"
                    >
                      <div>
                        <p className="text-sm font-semibold text-slate-800">{schedule.name}</p>
                        <p className="text-xs text-slate-500">{schedule.cadence}</p>
                      </div>
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge variant="gray" size="sm">{schedule.recipients}</Badge>
                        <Button variant="ghost" size="sm">
                          Editar
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          )}

          {activeTab === 'pricing' && (
            <>
              {loading ? (
                <div className="h-48 animate-pulse rounded-2xl bg-slate-100 dark:bg-slate-800" />
              ) : (
                <div className="space-y-6">
                  <Card className="bg-white shadow-sm ring-1 ring-slate-200/70" padding="lg">
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-slate-900">Estado del laboratorio de pricing</h3>
                        <p className="mt-1 text-sm text-slate-600">
                          Evalúa el impacto de los últimos movimientos y define próximos experimentos.
                        </p>
                      </div>
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge variant="green" size="md">+{pricingImpact.positivo} positivos</Badge>
                        <Badge variant="red" size="md">{pricingImpact.negativo} negativos</Badge>
                      </div>
                    </div>
                    <div className="mt-6 grid gap-4 md:grid-cols-3">
                      <div className="rounded-2xl border border-slate-200/60 bg-slate-50 p-4">
                        <p className="text-xs text-slate-500 uppercase font-medium tracking-wide">Prueba prioritaria</p>
                        <p className="mt-2 text-sm text-slate-700">
                          Escalar la prueba A/B de descuentos temporales en clases ilimitadas.
                        </p>
                      </div>
                      <div className="rounded-2xl border border-slate-200/60 bg-slate-50 p-4">
                        <p className="text-xs text-slate-500 uppercase font-medium tracking-wide">Objetivo</p>
                        <p className="mt-2 text-sm text-slate-700">
                          Incrementar el MRR en +8% con mínimo impacto en churn de suscripciones.
                        </p>
                      </div>
                      <div className="rounded-2xl border border-slate-200/60 bg-slate-50 p-4">
                        <p className="text-xs text-slate-500 uppercase font-medium tracking-wide">Equipo asignado</p>
                        <p className="mt-2 text-sm text-slate-700">Pricing squad + Data analytics</p>
                      </div>
                    </div>
                  </Card>

                  <DynamicPricingPanel insights={pricingInsights} />
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
}

