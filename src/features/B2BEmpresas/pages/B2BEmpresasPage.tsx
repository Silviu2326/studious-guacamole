import { useMemo, useState } from 'react';
import {
  BadgeCheck,
  Building2,
  CheckCircle2,
  FileBarChart,
  Globe,
  Handshake,
  LineChart,
  Receipt,
  ShieldCheck,
  Target,
  Users,
} from 'lucide-react';
import { Badge, Button, Card, Tabs, type TabItem } from '../../../components/componentsreutilizables';

type DealStage = 'Activo' | 'Renegociación' | 'Borrador';
type CompanyTier = 'Strategic' | 'Growth' | 'Trial';
type AdoptionLevel = 'Alto' | 'Medio' | 'Bajo';
type InvoiceStatus = 'Pagada' | 'Pendiente' | 'Retrasada';

const TAB_ITEMS: TabItem[] = [
  { id: 'convenios', label: 'Convenios', icon: <Handshake className="h-4 w-4" /> },
  { id: 'empresas', label: 'Empresas', icon: <Building2 className="h-4 w-4" /> },
  { id: 'empleados', label: 'Empleados', icon: <Users className="h-4 w-4" /> },
  { id: 'uso', label: 'Uso & resultados', icon: <LineChart className="h-4 w-4" /> },
  { id: 'facturacion', label: 'Facturación', icon: <Receipt className="h-4 w-4" /> },
  { id: 'portal', label: 'Portal empresa', icon: <Globe className="h-4 w-4" /> },
];

const dealMetrics = [
  { label: 'Convenios activos', value: '28', detail: '+3 desde septiembre' },
  { label: 'Pipeline Q4', value: '€184K', detail: 'Valor negociaciones' },
  { label: 'Renovaciones próximas', value: '6', detail: 'Antes de 31/12' },
];

const deals: Array<{
  company: string;
  seats: number;
  value: string;
  stage: DealStage;
  renewal: string;
}> = [
  { company: 'TechNova', seats: 220, value: '€48.000', stage: 'Activo', renewal: '31/12/2025' },
  { company: 'HealthCorp', seats: 150, value: '€34.500', stage: 'Renegociación', renewal: '15/01/2026' },
  { company: 'Globanty', seats: 80, value: '€19.200', stage: 'Borrador', renewal: 'N/A' },
  { company: 'FitNation', seats: 300, value: '€72.000', stage: 'Activo', renewal: '05/03/2026' },
];

const companyMetrics = [
  { label: 'Empresas activas', value: '32', detail: 'B2B Enterprise + SMB' },
  { label: 'Empleados enrolados', value: '4.870', detail: 'Usuarios con acceso' },
  { label: 'NPS corporativo', value: '+46', detail: 'Última encuesta' },
];

const companies: Array<{
  name: string;
  tier: CompanyTier;
  sponsor: string;
  startDate: string;
}> = [
  { name: 'TechNova', tier: 'Strategic', sponsor: 'Lucía Contreras', startDate: '01/02/2024' },
  { name: 'HealthCorp', tier: 'Growth', sponsor: 'Marc Vidal', startDate: '15/06/2024' },
  { name: 'Globanty', tier: 'Trial', sponsor: 'Patricia Alonso', startDate: '10/10/2025' },
  { name: 'FitNation', tier: 'Strategic', sponsor: 'Javier Gómez', startDate: '05/05/2023' },
];

const employeeMetrics = [
  { label: 'Usuarios activos 30d', value: '3.920', detail: '80% empleados con acceso' },
  { label: 'Sesiones promedio', value: '3.1', detail: 'Por semana / usuario' },
  { label: 'Programas corporativos', value: '12', detail: 'B2B wellness + training' },
];

const employees: Array<{
  name: string;
  company: string;
  engagement: AdoptionLevel;
  lastActivity: string;
}> = [
  { name: 'Laura Rivera', company: 'TechNova', engagement: 'Alto', lastActivity: 'Ayer' },
  { name: 'Carlos Jiménez', company: 'HealthCorp', engagement: 'Medio', lastActivity: 'Hace 3 días' },
  { name: 'Marina Ortiz', company: 'FitNation', engagement: 'Alto', lastActivity: 'Hoy' },
  { name: 'Andrés Molina', company: 'Globanty', engagement: 'Bajo', lastActivity: 'Hace 12 días' },
];

const adoptionMetrics = [
  { label: 'Uso promedio', value: '68%', detail: 'Sesiones / seats asignados' },
  { label: 'Retención trimestral', value: '92%', detail: 'Usuarios activos > 60 días' },
  { label: 'Clases completadas', value: '14.230', detail: '+18% vs Q3' },
];

const adoptionHighlights: Array<{
  company: string;
  participation: number;
  outcomes: string;
}> = [
  { company: 'TechNova', participation: 82, outcomes: 'Reducción ausentismo 12%' },
  { company: 'HealthCorp', participation: 65, outcomes: 'Programa salud mental adoptado' },
  { company: 'FitNation', participation: 74, outcomes: 'Engagement líder en wellness' },
];

const billingMetrics = [
  { label: 'MRR corporativo', value: '€52.800', detail: '+9% vs Q3' },
  { label: 'Facturas abiertas', value: '5', detail: 'Total €21.400' },
  { label: 'Cobro promedio', value: '28 días', detail: 'DSO corporativo' },
];

const invoices: Array<{
  id: string;
  company: string;
  amount: string;
  status: InvoiceStatus;
  dueDate: string;
}> = [
  { id: 'B2B-1042', company: 'TechNova', amount: '€12.000', status: 'Pagada', dueDate: '05/10/2025' },
  { id: 'B2B-1045', company: 'HealthCorp', amount: '€4.800', status: 'Pendiente', dueDate: '18/11/2025' },
  { id: 'B2B-1047', company: 'Globanty', amount: '€2.600', status: 'Retrasada', dueDate: '01/11/2025' },
  { id: 'B2B-1048', company: 'FitNation', amount: '€6.000', status: 'Pagada', dueDate: '28/10/2025' },
];

const portalResources = [
  { title: 'Guía de bienvenida', type: 'PDF', audience: 'HR & People', updatedAt: '02 Nov 2025' },
  { title: 'Calendario de retos corporativos', type: 'Calendario', audience: 'Líderes bienestar', updatedAt: '30 Oct 2025' },
  { title: 'Dashboard de resultados', type: 'Dashboard', audience: 'Comité dirección', updatedAt: '27 Oct 2025' },
  { title: 'FAQs empleados', type: 'Base de conocimiento', audience: 'Empleados', updatedAt: '21 Oct 2025' },
];

function renderDealStage(stage: DealStage) {
  const variants: Record<DealStage, { variant: 'success' | 'yellow' | 'secondary'; label: string }> = {
    Activo: { variant: 'success', label: 'Activo' },
    Renegociación: { variant: 'yellow', label: 'Renegociación' },
    Borrador: { variant: 'secondary', label: 'Borrador' },
  };
  const config = variants[stage];
  return (
    <Badge variant={config.variant} size="sm">
      {config.label}
    </Badge>
  );
}

function renderTier(tier: CompanyTier) {
  const variants: Record<CompanyTier, { variant: 'success' | 'blue' | 'secondary'; label: string }> = {
    Strategic: { variant: 'success', label: 'Strategic' },
    Growth: { variant: 'blue', label: 'Growth' },
    Trial: { variant: 'secondary', label: 'Trial' },
  };
  const config = variants[tier];
  return (
    <Badge variant={config.variant} size="sm">
      {config.label}
    </Badge>
  );
}

function renderAdoption(level: AdoptionLevel) {
  const variants: Record<AdoptionLevel, { variant: 'success' | 'yellow' | 'secondary'; label: string }> = {
    Alto: { variant: 'success', label: 'Alto' },
    Medio: { variant: 'yellow', label: 'Medio' },
    Bajo: { variant: 'secondary', label: 'Bajo' },
  };
  const config = variants[level];
  return (
    <Badge variant={config.variant} size="sm">
      {config.label}
    </Badge>
  );
}

function renderInvoiceStatus(status: InvoiceStatus) {
  const variants: Record<InvoiceStatus, { variant: 'success' | 'yellow' | 'red'; label: string }> = {
    Pagada: { variant: 'success', label: 'Pagada' },
    Pendiente: { variant: 'yellow', label: 'Pendiente' },
    Retrasada: { variant: 'red', label: 'Retrasada' },
  };
  const config = variants[status];
  return (
    <Badge variant={config.variant} size="sm">
      {config.label}
    </Badge>
  );
}

export function B2BEmpresasPage() {
  const [activeTab, setActiveTab] = useState<string>('convenios');

  const averageParticipation = useMemo(() => {
    const total = adoptionHighlights.reduce((acc, item) => acc + item.participation, 0);
    return Math.round(total / adoptionHighlights.length);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <header className="border-b border-slate-200/60 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/70">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 py-10 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-3">
              <Badge variant="blue" size="md" leftIcon={<BadgeCheck className="h-4 w-4" />}>
                B2B / Empresas
              </Badge>
              <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 md:text-4xl">
                Programas Corporativos
              </h1>
              <p className="max-w-2xl text-sm text-slate-600 md:text-base">
                Gestiona vínculos con empresas, monitoriza la adopción de sus empleados, controla la facturación y
                administra el portal corporativo en un único hub.
              </p>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <Button variant="secondary" onClick={() => setActiveTab('convenios')}>
                Crear nuevo convenio
              </Button>
              <Button variant="ghost" onClick={() => setActiveTab('portal')}>
                Acceder al portal B2B
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="space-y-8">
          <Tabs items={TAB_ITEMS} activeTab={activeTab} onTabChange={setActiveTab} variant="underline" />

          {activeTab === 'convenios' && (
            <div className="space-y-6">
              <div className="grid gap-4 md:grid-cols-3">
                {dealMetrics.map(metric => (
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
                    <h2 className="text-lg font-semibold text-slate-900">Convenios principales</h2>
                    <p className="mt-1 text-sm text-slate-600">
                      Seguimiento de acuerdos, seats contratados y próximos hitos de renovación.
                    </p>
                  </div>
                  <Badge variant="secondary" size="md" leftIcon={<Target className="h-4 w-4" />}>
                    Win rate YTD 62%
                  </Badge>
                </div>
                <div className="mt-6 space-y-3">
                  {deals.map(deal => (
                    <div
                      key={deal.company}
                      className="grid gap-3 rounded-2xl border border-slate-200/70 bg-slate-50 p-4 md:grid-cols-5 md:items-center"
                    >
                      <div>
                        <p className="text-sm font-semibold text-slate-800">{deal.company}</p>
                        <p className="text-xs text-slate-500">{deal.seats} seats contratados</p>
                      </div>
                      <p className="text-sm font-semibold text-slate-700">{deal.value}</p>
                      <p className="text-xs text-slate-500">Renovación {deal.renewal}</p>
                      <p className="text-xs text-slate-500">CSM asignado • Equipo enterprise</p>
                      <div className="md:text-right">{renderDealStage(deal.stage)}</div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          )}

          {activeTab === 'empresas' && (
            <div className="space-y-6">
              <div className="grid gap-4 md:grid-cols-3">
                {companyMetrics.map(metric => (
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
                    <h2 className="text-lg font-semibold text-slate-900">Empresas asociadas</h2>
                    <p className="mt-1 text-sm text-slate-600">
                      Clasificación por tier, responsables y fecha de activación.
                    </p>
                  </div>
                  <Button variant="secondary" size="sm">
                    Importar lista
                  </Button>
                </div>
                <div className="mt-6 space-y-3">
                  {companies.map(company => (
                    <div
                      key={company.name}
                      className="grid gap-3 rounded-2xl border border-slate-200/70 bg-slate-50 p-4 md:grid-cols-4 md:items-center"
                    >
                      <div>
                        <p className="text-sm font-semibold text-slate-800">{company.name}</p>
                        <p className="text-xs text-slate-500">Sponsor: {company.sponsor}</p>
                      </div>
                      <p className="text-sm text-slate-600">Inicio {company.startDate}</p>
                      <p className="text-xs text-slate-500">Sector: Tecnología / Salud</p>
                      <div className="md:text-right">{renderTier(company.tier)}</div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          )}

          {activeTab === 'empleados' && (
            <div className="space-y-6">
              <div className="grid gap-4 md:grid-cols-3">
                {employeeMetrics.map(metric => (
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
                    <h2 className="text-lg font-semibold text-slate-900">Engagement de empleados</h2>
                    <p className="mt-1 text-sm text-slate-600">
                      Seguimiento individual para anticipar acciones de retención.
                    </p>
                  </div>
                  <Badge variant="secondary" size="md" leftIcon={<CheckCircle2 className="h-4 w-4" />}>
                    Activación promedio 78%
                  </Badge>
                </div>
                <div className="mt-6 space-y-3">
                  {employees.map(employee => (
                    <div
                      key={employee.name}
                      className="grid gap-3 rounded-2xl border border-slate-200/70 bg-slate-50 p-4 md:grid-cols-4 md:items-center"
                    >
                      <div>
                        <p className="text-sm font-semibold text-slate-800">{employee.name}</p>
                        <p className="text-xs text-slate-500">{employee.company}</p>
                      </div>
                      <p className="text-sm text-slate-600">Última actividad {employee.lastActivity}</p>
                      <p className="text-xs text-slate-500">Programas favoritos: Wellness, Nutrición</p>
                      <div className="md:text-right">{renderAdoption(employee.engagement)}</div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          )}

          {activeTab === 'uso' && (
            <div className="space-y-6">
              <div className="grid gap-4 md:grid-cols-3">
                {adoptionMetrics.map(metric => (
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
                    <h2 className="text-lg font-semibold text-slate-900">Uso por empresa</h2>
                    <p className="mt-1 text-sm text-slate-600">
                      Analiza la adopción y resultados clave para cada cuenta corporativa.
                    </p>
                  </div>
                  <Badge variant="secondary" size="md" leftIcon={<LineChart className="h-4 w-4" />}>
                    Participación media {averageParticipation}%
                  </Badge>
                </div>
                <div className="mt-6 space-y-3">
                  {adoptionHighlights.map(item => (
                    <div
                      key={item.company}
                      className="grid gap-3 rounded-2xl border border-slate-200/70 bg-slate-50 p-4 md:grid-cols-3 md:items-center"
                    >
                      <p className="text-sm font-semibold text-slate-800">{item.company}</p>
                      <p className="text-sm font-semibold text-slate-700">{item.participation}% participación</p>
                      <p className="text-xs text-slate-500">{item.outcomes}</p>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          )}

          {activeTab === 'facturacion' && (
            <div className="space-y-6">
              <div className="grid gap-4 md:grid-cols-3">
                {billingMetrics.map(metric => (
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
                    <h2 className="text-lg font-semibold text-slate-900">Facturación corporativa</h2>
                    <p className="mt-1 text-sm text-slate-600">
                      Control de facturas, estados de cobro y acciones pendientes.
                    </p>
                  </div>
                  <Button variant="secondary" size="sm">
                    Exportar CSV
                  </Button>
                </div>
                <div className="mt-6 space-y-3">
                  {invoices.map(invoice => (
                    <div
                      key={invoice.id}
                      className="grid gap-3 rounded-2xl border border-slate-200/70 bg-slate-50 p-4 md:grid-cols-4 md:items-center"
                    >
                      <div>
                        <p className="text-sm font-semibold text-slate-800">{invoice.id}</p>
                        <p className="text-xs text-slate-500">{invoice.company}</p>
                      </div>
                      <p className="text-sm font-semibold text-slate-700">{invoice.amount}</p>
                      <p className="text-xs text-slate-500">Vence {invoice.dueDate}</p>
                      <div className="md:text-right">{renderInvoiceStatus(invoice.status)}</div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          )}

          {activeTab === 'portal' && (
            <div className="space-y-6">
              <div className="grid gap-4 md:grid-cols-3">
                <Card className="bg-white shadow-sm ring-1 ring-slate-200/70" padding="lg">
                  <p className="text-xs uppercase text-slate-500">Portal activo</p>
                  <p className="mt-2 text-2xl font-bold text-slate-900">28 empresas</p>
                  <p className="mt-1 text-sm text-slate-500">Acceso multi-tenant</p>
                </Card>
                <Card className="bg-white shadow-sm ring-1 ring-slate-200/70" padding="lg">
                  <p className="text-xs uppercase text-slate-500">Contenido actualizado</p>
                  <p className="mt-2 text-2xl font-bold text-slate-900">92%</p>
                  <p className="mt-1 text-sm text-slate-500">Últimas 4 semanas</p>
                </Card>
                <Card className="bg-white shadow-sm ring-1 ring-slate-200/70" padding="lg">
                  <p className="text-xs uppercase text-slate-500">Firmas pendientes</p>
                  <p className="mt-2 text-2xl font-bold text-amber-600">11 acuerdos</p>
                  <p className="mt-1 text-sm text-slate-500">Solicitar confirmación</p>
                </Card>
              </div>

              <Card className="bg-white shadow-sm ring-1 ring-slate-200/70" padding="lg">
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div>
                    <h2 className="text-lg font-semibold text-slate-900">Recursos del portal</h2>
                    <p className="mt-1 text-sm text-slate-600">
                      Contenido disponible para empresas y empleados corporativos.
                    </p>
                  </div>
                  <Button variant="secondary" size="sm">
                    Publicar actualización
                  </Button>
                </div>
                <div className="mt-6 space-y-3">
                  {portalResources.map(resource => (
                    <div
                      key={resource.title}
                      className="grid gap-3 rounded-2xl border border-slate-200/70 bg-slate-50 p-4 md:grid-cols-4 md:items-center"
                    >
                      <div className="md:col-span-2">
                        <p className="text-sm font-semibold text-slate-800">{resource.title}</p>
                        <p className="text-xs text-slate-500">Tipo: {resource.type}</p>
                      </div>
                      <p className="text-xs text-slate-500">Audiencia: {resource.audience}</p>
                      <p className="text-xs text-slate-500">Actualizado {resource.updatedAt}</p>
                    </div>
                  ))}
                </div>
              </Card>

              <div className="grid gap-4 md:grid-cols-2">
                <Card className="bg-white shadow-sm ring-1 ring-slate-200/70" padding="lg">
                  <div className="flex items-center gap-3">
                    <ShieldCheck className="h-5 w-5 text-emerald-500" />
                    <h3 className="text-lg font-semibold text-slate-900">Accesos & seguridad</h3>
                  </div>
                  <ul className="mt-4 space-y-2 text-sm text-slate-600">
                    <li>• SSO / SAML activo • 85% adoption</li>
                    <li>• Auditoría trimestral • Última revisión 14/10/2025</li>
                    <li>• Roles: HR Manager, Sponsor, Employee</li>
                  </ul>
                </Card>
                <Card className="bg-white shadow-sm ring-1 ring-slate-200/70" padding="lg">
                  <div className="flex items-center gap-3">
                    <FileBarChart className="h-5 w-5 text-blue-500" />
                    <h3 className="text-lg font-semibold text-slate-900">Reportes compartidos</h3>
                  </div>
                  <ul className="mt-4 space-y-2 text-sm text-slate-600">
                    <li>• Informe mensual de uso • Enviado automáticamente</li>
                    <li>• Benchmark por sector • Disponible para sponsors</li>
                    <li>• API datos brutos • Bajo demanda (export JSON/CSV)</li>
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

export default B2BEmpresasPage;

