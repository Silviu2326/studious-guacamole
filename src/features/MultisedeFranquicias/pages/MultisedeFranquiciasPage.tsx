import { useMemo, useState } from 'react';
import {
  ArrowLeftRight,
  BadgeCheck,
  Building2,
  Building,
  ClipboardList,
  DollarSign,
  FileText,
  Scale,
  TrendingUp,
} from 'lucide-react';
import { Badge, Button, Card, Tabs, type TabItem } from '../../../components/componentsreutilizables';

type PerformanceStatus = 'Excelente' | 'En línea' | 'A optimizar';
type PricingStatus = 'Sin cambios' | 'Ajuste sugerido' | 'Revisar urgente';
type TransferStatus = 'Completada' | 'En tránsito' | 'Programada';
type ComplianceStatus = 'Aprobada' | 'Pendiente' | 'Requiere acción';

const TAB_ITEMS: TabItem[] = [
  { id: 'resumen', label: 'Resumen', icon: <Building className="h-4 w-4" /> },
  { id: 'comparativa', label: 'Comparativa', icon: <Scale className="h-4 w-4" /> },
  { id: 'precios', label: 'Precios por sede', icon: <DollarSign className="h-4 w-4" /> },
  { id: 'transferencias', label: 'Transferencias', icon: <ArrowLeftRight className="h-4 w-4" /> },
  { id: 'normativas', label: 'Normativas', icon: <ClipboardList className="h-4 w-4" /> },
];

const networkMetrics = [
  { label: 'Sedes activas', value: '18', detail: '12 propias • 6 franquicias' },
  { label: 'Ingresos red', value: '€1.62M', detail: 'Últimos 90 días' },
  { label: 'Crecimiento promedio', value: '+12%', detail: 'Comparado con Q2' },
];

const siteOverview: Array<{
  name: string;
  manager: string;
  revenue: string;
  status: PerformanceStatus;
  highlights: string;
}> = [
  {
    name: 'Madrid Centro',
    manager: 'Laura Gómez',
    revenue: '€210K',
    status: 'Excelente',
    highlights: 'Top NPS corporativo • Ocupación 92%',
  },
  {
    name: 'Barcelona Diagonal',
    manager: 'Carlos Pérez',
    revenue: '€185K',
    status: 'En línea',
    highlights: 'Clases premium con lista espera',
  },
  {
    name: 'Valencia Marina',
    manager: 'Eva Sanz',
    revenue: '€138K',
    status: 'A optimizar',
    highlights: 'Plan de marketing local en marcha',
  },
];

const comparisonMetrics = [
  { label: 'Ingresos / sede', value: '€92K', detail: 'Media mensual' },
  { label: 'Coste operativo', value: '€48K', detail: 'Incluye franquicias' },
  { label: 'Margen promedio', value: '22%', detail: '+3 pts vs Q2' },
];

const comparisonData = [
  { site: 'Madrid Centro', revenueGrowth: '+18%', newMembers: 215, churn: '2.1%' },
  { site: 'Barcelona Diagonal', revenueGrowth: '+11%', newMembers: 182, churn: '2.8%' },
  { site: 'Valencia Marina', revenueGrowth: '+6%', newMembers: 140, churn: '4.2%' },
  { site: 'Sevilla Plaza', revenueGrowth: '+14%', newMembers: 168, churn: '3.1%' },
];

const pricingModels: Array<{
  site: string;
  plan: string;
  price: string;
  status: PricingStatus;
  recommendation: string;
}> = [
  {
    site: 'Madrid Centro',
    plan: 'Premium 12M',
    price: '€89',
    status: 'Sin cambios',
    recommendation: 'Mantener • Top ventas corporativo',
  },
  {
    site: 'Barcelona Diagonal',
    plan: 'Fit Unlimited',
    price: '€79',
    status: 'Ajuste sugerido',
    recommendation: 'Subir a €82 • Alta demanda evening',
  },
  {
    site: 'Valencia Marina',
    plan: 'Flexible 6M',
    price: '€69',
    status: 'Revisar urgente',
    recommendation: 'Analizar bundle con nutrición',
  },
];

const transferMetrics = [
  { label: 'Transferencias mes', value: '42', detail: 'Intra-red • Inventario + staff' },
  { label: 'Tiempo medio', value: '3.2 días', detail: 'De solicitud a recepción' },
  { label: 'Coste medio', value: '€280', detail: 'Logística y coordinación' },
];

const transfers: Array<{
  id: string;
  from: string;
  to: string;
  type: string;
  status: TransferStatus;
  eta: string;
}> = [
  {
    id: 'TR-204',
    from: 'Madrid Centro',
    to: 'Valencia Marina',
    type: 'Equipos cardio',
    status: 'En tránsito',
    eta: 'Entrega 09/11',
  },
  {
    id: 'TR-205',
    from: 'Barcelona Diagonal',
    to: 'Sevilla Plaza',
    type: 'Personal instructor',
    status: 'Programada',
    eta: 'Inicio 15/11',
  },
  {
    id: 'TR-199',
    from: 'Madrid Centro',
    to: 'Madrid Norte',
    type: 'Inventario retail',
    status: 'Completada',
    eta: 'Recepcionado 05/11',
  },
];

const regulatoryMetrics = [
  { label: 'Documentos vigentes', value: '68', detail: 'Políticas, procesos, compliance' },
  { label: 'Pendientes firma', value: '9', detail: 'Franquicias • Sede + HR' },
  { label: 'Revisiones en curso', value: '4', detail: 'Actualización 2026' },
];

const regulatoryItems: Array<{
  title: string;
  category: string;
  status: ComplianceStatus;
  owner: string;
}> = [
  { title: 'Protocolo marca 2025', category: 'Branding & UX', status: 'Aprobada', owner: 'Marketing HQ' },
  { title: 'Checklist auditoría operativa', category: 'Operaciones', status: 'Pendiente', owner: 'Operaciones' },
  { title: 'Manual seguridad entrenamiento', category: 'Seguridad', status: 'Requiere acción', owner: 'Compliance' },
  { title: 'Guía experiencia cliente', category: 'Customer experience', status: 'Aprobada', owner: 'CX Team' },
];

function renderPerformance(status: PerformanceStatus) {
  const variants: Record<PerformanceStatus, { variant: 'success' | 'secondary' | 'yellow'; label: string }> = {
    Excelente: { variant: 'success', label: 'Excelente' },
    'En línea': { variant: 'secondary', label: 'En línea' },
    'A optimizar': { variant: 'yellow', label: 'A optimizar' },
  };
  const config = variants[status];
  return (
    <Badge variant={config.variant} size="sm">
      {config.label}
    </Badge>
  );
}

function renderPricing(status: PricingStatus) {
  const variants: Record<PricingStatus, { variant: 'secondary' | 'yellow' | 'red'; label: string }> = {
    'Sin cambios': { variant: 'secondary', label: 'Sin cambios' },
    'Ajuste sugerido': { variant: 'yellow', label: 'Ajuste sugerido' },
    'Revisar urgente': { variant: 'red', label: 'Revisar urgente' },
  };
  const config = variants[status];
  return (
    <Badge variant={config.variant} size="sm">
      {config.label}
    </Badge>
  );
}

function renderTransfer(status: TransferStatus) {
  const variants: Record<TransferStatus, { variant: 'success' | 'yellow' | 'secondary'; label: string }> = {
    Completada: { variant: 'success', label: 'Completada' },
    'En tránsito': { variant: 'yellow', label: 'En tránsito' },
    Programada: { variant: 'secondary', label: 'Programada' },
  };
  const config = variants[status];
  return (
    <Badge variant={config.variant} size="sm">
      {config.label}
    </Badge>
  );
}

function renderCompliance(status: ComplianceStatus) {
  const variants: Record<ComplianceStatus, { variant: 'success' | 'yellow' | 'red'; label: string }> = {
    Aprobada: { variant: 'success', label: 'Aprobada' },
    Pendiente: { variant: 'yellow', label: 'Pendiente' },
    'Requiere acción': { variant: 'red', label: 'Requiere acción' },
  };
  const config = variants[status];
  return (
    <Badge variant={config.variant} size="sm">
      {config.label}
    </Badge>
  );
}

export function MultisedeFranquiciasPage() {
  const [activeTab, setActiveTab] = useState<string>('resumen');

  const bestPerformer = useMemo(
    () => siteOverview.reduce((best, current) => (current.status === 'Excelente' ? current : best), siteOverview[0]),
    [],
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <header className="border-b border-slate-200/60 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/70">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 py-10 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-3">
              <Badge variant="blue" size="md" leftIcon={<BadgeCheck className="h-4 w-4" />}>
                Multisede & Franquicias
              </Badge>
              <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 md:text-4xl">
                Red de sedes y franquicias
              </h1>
              <p className="max-w-2xl text-sm text-slate-600 md:text-base">
                Supervisa la red de centros propios y franquiciados, alinea precios, coordina transferencias y controla
                normativas globales desde un único panel.
              </p>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <Button variant="secondary" onClick={() => setActiveTab('resumen')}>
                Ver KPI red
              </Button>
              <Button variant="ghost" onClick={() => setActiveTab('normativas')}>
                Actualizar normativas
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="space-y-8">
          <Tabs items={TAB_ITEMS} activeTab={activeTab} onTabChange={setActiveTab} variant="underline" />

          {activeTab === 'resumen' && (
            <div className="space-y-6">
              <div className="grid gap-4 md:grid-cols-3">
                {networkMetrics.map(metric => (
                  <Card key={metric.label} className="bg-white shadow-sm ring-1 ring-slate-200/70" padding="lg">
                    <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{metric.label}</p>
                    <p className="mt-2 text-2xl font-bold text-slate-900">{metric.value}</p>
                    <p className="mt-1 text-sm text-slate-500">{metric.detail}</p>
                  </Card>
                ))}
              </div>

              <Card className="bg-white shadow-sm ring-1 ring-slate-200/70" padding="lg">
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div>
                    <h2 className="text-lg font-semibold text-slate-900">Rendimiento por sede</h2>
                    <p className="mt-1 text-sm text-slate-600">
                      Identifica oportunidades y comparte mejores prácticas entre la red.
                    </p>
                  </div>
                  <Badge variant="secondary" size="md" leftIcon={<TrendingUp className="h-4 w-4" />}>
                    {bestPerformer.name}: crecimiento destacado
                  </Badge>
                </div>
                <div className="mt-6 space-y-3">
                  {siteOverview.map(site => (
                    <div
                      key={site.name}
                      className="grid gap-3 rounded-2xl border border-slate-200/70 bg-slate-50 p-4 md:grid-cols-4 md:items-center"
                    >
                      <div>
                        <p className="text-sm font-semibold text-slate-800">{site.name}</p>
                        <p className="text-xs text-slate-500">Manager: {site.manager}</p>
                      </div>
                      <p className="text-sm font-semibold text-slate-700">{site.revenue}</p>
                      <p className="text-xs text-slate-500">{site.highlights}</p>
                      <div className="md:text-right">{renderPerformance(site.status)}</div>
                    </div>
                  ))}
                </div>
              </Card>

              <div className="grid gap-4 md:grid-cols-2">
                <Card className="bg-white shadow-sm ring-1 ring-slate-200/70" padding="lg">
                  <h3 className="text-lg font-semibold text-slate-900">Prioridades para Q4</h3>
                  <ul className="mt-4 space-y-2 text-sm text-slate-600">
                    <li>• Integrar programas corporativos en franquicias estratégicas</li>
                    <li>• Lanzar plan de retención premium compartido entre sedes top</li>
                    <li>• Revisar acuerdos comerciales en 6 franquicias con renovación</li>
                  </ul>
                </Card>
                <Card className="bg-white shadow-sm ring-1 ring-slate-200/70" padding="lg">
                  <h3 className="text-lg font-semibold text-slate-900">Alertas de la red</h3>
                  <ul className="mt-4 space-y-2 text-sm text-slate-600">
                    <li>• Valencia Marina: plan de marketing en marcha • Revisar en 2 semanas</li>
                    <li>• Madrid Norte: formación de staff pendiente • Completar antes del 15/11</li>
                    <li>• Franquicia Bilbao: auditoría operativa • Programar visita HQ</li>
                  </ul>
                </Card>
              </div>
            </div>
          )}

          {activeTab === 'comparativa' && (
            <div className="space-y-6">
              <div className="grid gap-4 md:grid-cols-3">
                {comparisonMetrics.map(metric => (
                  <Card key={metric.label} className="bg-white shadow-sm ring-1 ring-slate-200/70" padding="lg">
                    <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{metric.label}</p>
                    <p className="mt-2 text-2xl font-bold text-slate-900">{metric.value}</p>
                    <p className="mt-1 text-sm text-slate-500">{metric.detail}</p>
                  </Card>
                ))}
              </div>

              <Card className="bg-white shadow-sm ring-1 ring-slate-200/70" padding="lg">
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div>
                    <h2 className="text-lg font-semibold text-slate-900">Indicadores comparativos</h2>
                    <p className="mt-1 text-sm text-slate-600">
                      Analiza el rendimiento de cada sede y comparte tácticas ganadoras.
                    </p>
                  </div>
                  <Button variant="secondary" size="sm">
                    Exportar benchmark
                  </Button>
                </div>
                <div className="mt-6 space-y-3">
                  {comparisonData.map(item => (
                    <div
                      key={item.site}
                      className="grid gap-3 rounded-2xl border border-slate-200/70 bg-slate-50 p-4 md:grid-cols-4 md:items-center"
                    >
                      <p className="text-sm font-semibold text-slate-800">{item.site}</p>
                      <p className="text-sm text-slate-600">Crecimiento {item.revenueGrowth}</p>
                      <p className="text-sm text-slate-600">Altas {item.newMembers} clientes</p>
                      <p className="text-xs text-slate-500">Churn {item.churn}</p>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          )}

          {activeTab === 'precios' && (
            <div className="space-y-6">
              <div className="grid gap-4 md:grid-cols-3">
                <Card className="bg-white shadow-sm ring-1 ring-slate-200/70" padding="lg">
                  <p className="text-xs uppercase text-slate-500">Planes analizados</p>
                  <p className="mt-2 text-2xl font-bold text-slate-900">54 planes</p>
                  <p className="mt-1 text-sm text-slate-500">Última revisión Octubre</p>
                </Card>
                <Card className="bg-white shadow-sm ring-1 ring-slate-200/70" padding="lg">
                  <p className="text-xs uppercase text-slate-500">Top margen</p>
                  <p className="mt-2 text-2xl font-bold text-slate-900">Madrid Centro</p>
                  <p className="mt-1 text-sm text-slate-500">Margen 28% en premium</p>
                </Card>
                <Card className="bg-white shadow-sm ring-1 ring-slate-200/70" padding="lg">
                  <p className="text-xs uppercase text-slate-500">Check pendiente</p>
                  <p className="mt-2 text-2xl font-bold text-amber-600">4 sedes</p>
                  <p className="mt-1 text-sm text-slate-500">Actualizar precios Q1 2026</p>
                </Card>
              </div>

              <Card className="bg-white shadow-sm ring-1 ring-slate-200/70" padding="lg">
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div>
                    <h2 className="text-lg font-semibold text-slate-900">Estructura de precios por sede</h2>
                    <p className="mt-1 text-sm text-slate-600">
                      Sincroniza la estrategia de pricing y detecta oportunidades de ajuste.
                    </p>
                  </div>
                  <Button variant="secondary" size="sm">
                    Actualizar catálogo
                  </Button>
                </div>
                <div className="mt-6 space-y-3">
                  {pricingModels.map(model => (
                    <div
                      key={`${model.site}-${model.plan}`}
                      className="grid gap-3 rounded-2xl border border-slate-200/70 bg-slate-50 p-4 md:grid-cols-4 md:items-center"
                    >
                      <div>
                        <p className="text-sm font-semibold text-slate-800">{model.site}</p>
                        <p className="text-xs text-slate-500">{model.plan}</p>
                      </div>
                      <p className="text-sm font-semibold text-slate-700">{model.price}</p>
                      <p className="text-xs text-slate-500">{model.recommendation}</p>
                      <div className="md:text-right">{renderPricing(model.status)}</div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          )}

          {activeTab === 'transferencias' && (
            <div className="space-y-6">
              <div className="grid gap-4 md:grid-cols-3">
                {transferMetrics.map(metric => (
                  <Card key={metric.label} className="bg-white shadow-sm ring-1 ring-slate-200/70" padding="lg">
                    <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{metric.label}</p>
                    <p className="mt-2 text-2xl font-bold text-slate-900">{metric.value}</p>
                    <p className="mt-1 text-sm text-slate-500">{metric.detail}</p>
                  </Card>
                ))}
              </div>

              <Card className="bg-white shadow-sm ring-1 ring-slate-200/70" padding="lg">
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div>
                    <h2 className="text-lg font-semibold text-slate-900">Transferencias recientes</h2>
                    <p className="mt-1 text-sm text-slate-600">
                      Revisa movimientos logísticos y asignaciones de personal entre sedes.
                    </p>
                  </div>
                  <Button variant="secondary" size="sm">
                    Crear transferencia
                  </Button>
                </div>
                <div className="mt-6 space-y-3">
                  {transfers.map(transfer => (
                    <div
                      key={transfer.id}
                      className="grid gap-3 rounded-2xl border border-slate-200/70 bg-slate-50 p-4 md:grid-cols-5 md:items-center"
                    >
                      <div>
                        <p className="text-sm font-semibold text-slate-800">{transfer.id}</p>
                        <p className="text-xs text-slate-500">{transfer.type}</p>
                      </div>
                      <p className="text-sm text-slate-600">
                        De {transfer.from} a {transfer.to}
                      </p>
                      <p className="text-xs text-slate-500">ETA {transfer.eta}</p>
                      <p className="text-xs text-slate-500">Coordinado por HQ logística</p>
                      <div className="md:text-right">{renderTransfer(transfer.status)}</div>
                    </div>
                  ))}
                </div>
              </Card>

              <div className="grid gap-4 md:grid-cols-2">
                <Card className="bg-white shadow-sm ring-1 ring-slate-200/70" padding="lg">
                  <h3 className="text-lg font-semibold text-slate-900">Centros con demanda alta</h3>
                  <ul className="mt-4 space-y-2 text-sm text-slate-600">
                    <li>• Sevilla Plaza • Requiere material fuerza • Solicitar stock a HQ</li>
                    <li>• Barcelona Diagonal • Refuerzo staff fines de semana • Coordinar formación</li>
                    <li>• Valencia Marina • Esperar recepción cardio • Ajustar agenda temporal</li>
                  </ul>
                </Card>
                <Card className="bg-white shadow-sm ring-1 ring-slate-200/70" padding="lg">
                  <h3 className="text-lg font-semibold text-slate-900">Resumen logístico</h3>
                  <ul className="mt-4 space-y-2 text-sm text-slate-600">
                    <li>• Proveedor FitLogistics • SLA 72h • Cumplimiento 94%</li>
                    <li>• Costes compartidos HQ 60% / Franquicia 40%</li>
                    <li>• Documentos y firmas electrónicas archivadas</li>
                  </ul>
                </Card>
              </div>
            </div>
          )}

          {activeTab === 'normativas' && (
            <div className="space-y-6">
              <div className="grid gap-4 md:grid-cols-3">
                {regulatoryMetrics.map(metric => (
                  <Card key={metric.label} className="bg-white shadow-sm ring-1 ring-slate-200/70" padding="lg">
                    <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{metric.label}</p>
                    <p className="mt-2 text-2xl font-bold text-slate-900">{metric.value}</p>
                    <p className="mt-1 text-sm text-slate-500">{metric.detail}</p>
                  </Card>
                ))}
              </div>

              <Card className="bg-white shadow-sm ring-1 ring-slate-200/70" padding="lg">
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div>
                    <h2 className="text-lg font-semibold text-slate-900">Documentación corporativa</h2>
                    <p className="mt-1 text-sm text-slate-600">
                      Alinea procesos operativos, de marca y compliance en toda la red.
                    </p>
                  </div>
                  <Button variant="secondary" size="sm">
                    Subir documento
                  </Button>
                </div>
                <div className="mt-6 space-y-3">
                  {regulatoryItems.map(item => (
                    <div
                      key={item.title}
                      className="grid gap-3 rounded-2xl border border-slate-200/70 bg-slate-50 p-4 md:grid-cols-4 md:items-center"
                    >
                      <div className="md:col-span-2">
                        <p className="text-sm font-semibold text-slate-800">{item.title}</p>
                        <p className="text-xs text-slate-500">Categoría: {item.category}</p>
                      </div>
                      <p className="text-xs text-slate-500">Owner: {item.owner}</p>
                      <div className="md:text-right">{renderCompliance(item.status)}</div>
                    </div>
                  ))}
                </div>
              </Card>

              <div className="grid gap-4 md:grid-cols-2">
                <Card className="bg-white shadow-sm ring-1 ring-slate-200/70" padding="lg">
                  <div className="flex items-center gap-3">
                    <Building2 className="h-5 w-5 text-indigo-500" />
                    <h3 className="text-lg font-semibold text-slate-900">Visitas & auditorías</h3>
                  </div>
                  <ul className="mt-4 space-y-2 text-sm text-slate-600">
                    <li>• Madrid Centro • Auditoría calidad • 28/11 • Equipo HQ</li>
                    <li>• Franquicia Bilbao • Revisión operativa • 05/12 • Checklist actualizado</li>
                    <li>• Barcelona Diagonal • Audit marketing & CX • 12/12</li>
                  </ul>
                </Card>
                <Card className="bg-white shadow-sm ring-1 ring-slate-200/70" padding="lg">
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-emerald-500" />
                    <h3 className="text-lg font-semibold text-slate-900">Próximos cambios normativos</h3>
                  </div>
                  <ul className="mt-4 space-y-2 text-sm text-slate-600">
                    <li>• Guía onboarding franquicias • Enero 2026</li>
                    <li>• Actualización protocolo seguridad • Febrero 2026</li>
                    <li>• Manual experiencia digital unificada • Marzo 2026</li>
                  </ul>
                </Card>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default MultisedeFranquiciasPage;

