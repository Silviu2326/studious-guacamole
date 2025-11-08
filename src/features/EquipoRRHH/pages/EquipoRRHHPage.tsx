import { useMemo, useState } from 'react';
import {
  AlertTriangle,
  BadgeCheck,
  BarChart2,
  ClipboardCheck,
  Clock,
  DollarSign,
  FileSpreadsheet,
  GraduationCap,
  HeartPulse,
  Target,
  Trophy,
  Users,
} from 'lucide-react';
import { Badge, Button, Card, Tabs, type TabItem } from '../../../components/componentsreutilizables';

type AvailabilityStatus = 'Disponible' | 'En licencia' | 'Capacitación';
type AttendanceStatus = 'A tiempo' | 'Retraso' | 'Ausente';
type PayrollStatus = 'Procesado' | 'Pendiente' | 'Incidencia';
type PerformanceLevel = 'Sobresaliente' | 'En progreso' | 'Con apoyo';

const TAB_ITEMS: TabItem[] = [
  { id: 'equipo', label: 'Equipo & roles', icon: <Users className="h-4 w-4" /> },
  { id: 'fichajes', label: 'Fichajes', icon: <Clock className="h-4 w-4" /> },
  { id: 'nominas', label: 'Nóminas', icon: <FileSpreadsheet className="h-4 w-4" /> },
  { id: 'comisiones', label: 'Comisiones', icon: <DollarSign className="h-4 w-4" /> },
  { id: 'evaluaciones', label: 'Evaluaciones', icon: <ClipboardCheck className="h-4 w-4" /> },
];

const teamMetrics = [
  { label: 'Total equipo', value: '34', detail: 'Incluye monitores externos' },
  { label: 'Nuevos ingresos', value: '3', detail: 'Últimos 30 días' },
  { label: 'Roles críticos', value: '5', detail: 'Necesitan cobertura' },
  { label: 'Rotación', value: '2%', detail: 'Trailing 90 días' },
];

const teamRoster: Array<{
  name: string;
  role: string;
  availability: AvailabilityStatus;
  manager: string;
}> = [
  { name: 'Laura Martínez', role: 'Coordinadora', availability: 'Disponible', manager: 'Dirección' },
  { name: 'Diego Gómez', role: 'Entrenador personal', availability: 'Capacitación', manager: 'Laura Martínez' },
  { name: 'Marta Ruiz', role: 'Recepción', availability: 'Disponible', manager: 'Ricardo Soler' },
  { name: 'Carla Paredes', role: 'Nutricionista', availability: 'En licencia', manager: 'Servicios clínicos' },
];

const attendanceMetrics = [
  { label: 'Puntualidad', value: '92%', detail: 'Mes actual' },
  { label: 'Retrasos hoy', value: '1', detail: 'Registros tarde' },
  { label: 'Ausencias', value: '0', detail: 'Sin justificar' },
];

const attendanceLog: Array<{
  member: string;
  checkIn: string;
  checkOut?: string;
  status: AttendanceStatus;
}> = [
  { member: 'Laura Martínez', checkIn: '05:58', checkOut: '14:12', status: 'A tiempo' },
  { member: 'Diego Gómez', checkIn: '08:09', checkOut: undefined, status: 'Retraso' },
  { member: 'Marta Ruiz', checkIn: '06:02', checkOut: '14:01', status: 'A tiempo' },
  { member: 'Carla Paredes', checkIn: '-', checkOut: '-', status: 'Ausente' },
];

const payrollMetrics = [
  { label: 'Nómina noviembre', value: '€38.240', detail: 'Incluye variables' },
  { label: 'Bonos aprobados', value: '12', detail: 'Staff ventas & coaches' },
  { label: 'Incidencias', value: '3', detail: 'Validar antes de 12/11' },
];

const payrollSummary: Array<{
  name: string;
  concept: string;
  amount: string;
  status: PayrollStatus;
}> = [
  { name: 'Laura Martínez', concept: 'Salario base + bonus', amount: '€2.350', status: 'Procesado' },
  { name: 'Diego Gómez', concept: 'Variable ventas', amount: '€420', status: 'Pendiente' },
  { name: 'Marta Ruiz', concept: 'Horas extra', amount: '€180', status: 'Procesado' },
  { name: 'Carla Paredes', concept: 'Licencia médica', amount: '€0', status: 'Incidencia' },
];

const commissionMetrics = [
  { label: 'Objetivo mensual', value: '€18.000', detail: 'Equipo comercial' },
  { label: 'Avance actual', value: '74%', detail: 'Restan 9 días' },
  { label: 'Comisiones proyectadas', value: '€6.430', detail: 'Sin cerrar' },
];

const commissionLeaderboard: Array<{
  member: string;
  total: string;
  achievement: number;
}> = [
  { member: 'Diego Gómez', total: '€1.240', achievement: 85 },
  { member: 'Sara López', total: '€980', achievement: 74 },
  { member: 'Javier Costa', total: '€730', achievement: 56 },
  { member: 'Equipo corporativo', total: '€1.540', achievement: 61 },
];

const performanceMetrics = [
  { label: 'Evaluaciones finalizadas', value: '14', detail: 'De 20 previstas' },
  { label: 'Planes de mejora', value: '3', detail: 'En seguimiento activo' },
  { label: 'Feedbacks recogidos', value: '47', detail: 'Últimos 30 días' },
];

const performanceReviews: Array<{
  member: string;
  cycle: string;
  level: PerformanceLevel;
  nextAction: string;
}> = [
  {
    member: 'Laura Martínez',
    cycle: 'Q4 2025',
    level: 'Sobresaliente',
    nextAction: 'Mentoring a nuevos coordinadores',
  },
  {
    member: 'Diego Gómez',
    cycle: 'Q4 2025',
    level: 'En progreso',
    nextAction: 'Plan de desarrollo comercial',
  },
  {
    member: 'Marta Ruiz',
    cycle: 'Q4 2025',
    level: 'Sobresaliente',
    nextAction: 'Proponer como formadora de recepción',
  },
  {
    member: 'Carla Paredes',
    cycle: 'Q4 2025',
    level: 'Con apoyo',
    nextAction: 'Revisión tras reincorporación',
  },
];

function renderAvailability(status: AvailabilityStatus) {
  const variants: Record<AvailabilityStatus, { variant: 'success' | 'yellow' | 'secondary'; label: string }> = {
    Disponible: { variant: 'success', label: 'Disponible' },
    'En licencia': { variant: 'secondary', label: 'En licencia' },
    Capacitación: { variant: 'yellow', label: 'Capacitación' },
  };
  const config = variants[status];
  return (
    <Badge variant={config.variant} size="sm">
      {config.label}
    </Badge>
  );
}

function renderAttendance(status: AttendanceStatus) {
  const variants: Record<AttendanceStatus, { variant: 'success' | 'yellow' | 'red'; label: string }> = {
    'A tiempo': { variant: 'success', label: 'A tiempo' },
    Retraso: { variant: 'yellow', label: 'Retraso' },
    Ausente: { variant: 'red', label: 'Ausente' },
  };
  const config = variants[status];
  return (
    <Badge variant={config.variant} size="sm">
      {config.label}
    </Badge>
  );
}

function renderPayroll(status: PayrollStatus) {
  const variants: Record<PayrollStatus, { variant: 'success' | 'yellow' | 'red'; label: string }> = {
    Procesado: { variant: 'success', label: 'Procesado' },
    Pendiente: { variant: 'yellow', label: 'Pendiente' },
    Incidencia: { variant: 'red', label: 'Incidencia' },
  };
  const config = variants[status];
  return (
    <Badge variant={config.variant} size="sm">
      {config.label}
    </Badge>
  );
}

function renderPerformance(level: PerformanceLevel) {
  const variants: Record<PerformanceLevel, { variant: 'success' | 'yellow' | 'red'; label: string }> = {
    Sobresaliente: { variant: 'success', label: 'Sobresaliente' },
    'En progreso': { variant: 'yellow', label: 'En progreso' },
    'Con apoyo': { variant: 'red', label: 'Con apoyo' },
  };
  const config = variants[level];
  return (
    <Badge variant={config.variant} size="sm">
      {config.label}
    </Badge>
  );
}

export function EquipoRRHHPage() {
  const [activeTab, setActiveTab] = useState<string>('equipo');

  const averageAchievement = useMemo(() => {
    const total = commissionLeaderboard.reduce((acc, item) => acc + item.achievement, 0);
    return Math.round(total / commissionLeaderboard.length);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-slate-100">
      <header className="border-b border-blue-200/60 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/70">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 py-10 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-3">
              <Badge variant="blue" size="md" leftIcon={<BadgeCheck className="h-4 w-4" />}>
                Equipo & RRHH
              </Badge>
              <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 md:text-4xl">
                Gestión del talento
              </h1>
              <p className="max-w-2xl text-sm text-slate-600 md:text-base">
                Consolida todos los procesos de recursos humanos: estructura del equipo, control horario, nóminas y planes
                de desarrollo profesional.
              </p>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <Button variant="secondary" onClick={() => setActiveTab('equipo')}>
                Invitar a un miembro
              </Button>
              <Button variant="ghost" onClick={() => setActiveTab('fichajes')}>
                Revisar fichajes
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="space-y-8">
          <Tabs items={TAB_ITEMS} activeTab={activeTab} onTabChange={setActiveTab} variant="underline" />

          {activeTab === 'equipo' && (
            <div className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                {teamMetrics.map(metric => (
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
                    <h2 className="text-lg font-semibold text-slate-900">Mapa de roles & disponibilidad</h2>
                    <p className="mt-1 text-sm text-slate-600">
                      Visualiza la configuración del equipo y detecta necesidades de cobertura.
                    </p>
                  </div>
                  <Badge variant="secondary" size="md" leftIcon={<Users className="h-4 w-4" />}>
                    34 colaboradores activos
                  </Badge>
                </div>
                <div className="mt-6 space-y-3">
                  {teamRoster.map(member => (
                    <div
                      key={member.name}
                      className="grid gap-3 rounded-2xl border border-slate-200/70 bg-slate-50 p-4 md:grid-cols-4 md:items-center"
                    >
                      <div>
                        <p className="text-sm font-semibold text-slate-800">{member.name}</p>
                        <p className="text-xs text-slate-500">{member.role}</p>
                      </div>
                      <p className="text-sm text-slate-600">Manager: {member.manager}</p>
                      <p className="text-xs text-slate-500">Actualizado hace 2 h</p>
                      <div className="md:text-right">{renderAvailability(member.availability)}</div>
                    </div>
                  ))}
                </div>
              </Card>

              <div className="grid gap-4 md:grid-cols-2">
                <Card className="bg-white shadow-sm ring-1 ring-slate-200/70" padding="lg">
                  <div className="flex items-center gap-3">
                    <GraduationCap className="h-5 w-5 text-indigo-500" />
                    <h3 className="text-lg font-semibold text-slate-900">Onboarding en curso</h3>
                  </div>
                  <ul className="mt-4 space-y-2 text-sm text-slate-600">
                    <li>• Ana García (Recepción) • Día 7 • Checklist 80% completado</li>
                    <li>• Marcos López (Monitor clases) • Día 3 • Requiere tutor asignado</li>
                    <li>• Paula Núñez (Ventas B2B) • Día 1 • Entrevista con dirección</li>
                  </ul>
                </Card>
                <Card className="bg-white shadow-sm ring-1 ring-slate-200/70" padding="lg">
                  <div className="flex items-center gap-3">
                    <HeartPulse className="h-5 w-5 text-rose-500" />
                    <h3 className="text-lg font-semibold text-slate-900">Alertas de capacidad</h3>
                  </div>
                  <ul className="mt-4 space-y-2 text-sm text-slate-600">
                    <li>• Coordinación de clases • 2 plazas libres • Buscar candidato</li>
                    <li>• Nutrición clínica • Licencia hasta 30/11 • Cubrir horarios sábados</li>
                    <li>• Ventas corporativas • Objetivo Q4 crítico • Activar plan incentivo</li>
                  </ul>
                </Card>
              </div>
            </div>
          )}

          {activeTab === 'fichajes' && (
            <div className="space-y-6">
              <div className="grid gap-4 md:grid-cols-3">
                {attendanceMetrics.map(metric => (
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
                    <h2 className="text-lg font-semibold text-slate-900">Registro de fichajes</h2>
                    <p className="mt-1 text-sm text-slate-600">Log en tiempo real con incidencias marcadas.</p>
                  </div>
                  <Badge variant="secondary" size="md" leftIcon={<Clock className="h-4 w-4" />}>
                    Corte 12:00 actualizado
                  </Badge>
                </div>
                <div className="mt-6 space-y-3">
                  {attendanceLog.map(entry => (
                    <div
                      key={entry.member}
                      className="grid gap-3 rounded-2xl border border-slate-200/70 bg-slate-50 p-4 md:grid-cols-4 md:items-center"
                    >
                      <div>
                        <p className="text-sm font-semibold text-slate-800">{entry.member}</p>
                        <p className="text-xs text-slate-500">
                          Entrada {entry.checkIn} • Salida {entry.checkOut ?? '—'}
                        </p>
                      </div>
                      <p className="text-sm text-slate-600">Ubicación principal</p>
                      <p className="text-xs text-slate-500">Validado por control horario</p>
                      <div className="md:text-right">{renderAttendance(entry.status)}</div>
                    </div>
                  ))}
                </div>
              </Card>

              <div className="grid gap-4 md:grid-cols-2">
                <Card className="bg-white shadow-sm ring-1 ring-slate-200/70" padding="lg">
                  <div className="flex items-center gap-3">
                    <AlertTriangle className="h-5 w-5 text-amber-500" />
                    <h3 className="text-lg font-semibold text-slate-900">Alertas de incidencias</h3>
                  </div>
                  <ul className="mt-4 space-y-2 text-sm text-slate-600">
                    <li>• Fichaje tardío repetido: Diego G. • Revisar historial</li>
                    <li>• Ausencia sin justificar: Carla P. • Notificar a coordinación</li>
                    <li>• Marcajes dobles: Equipo limpieza turno noche • Validar manualmente</li>
                  </ul>
                </Card>
                <Card className="bg-white shadow-sm ring-1 ring-slate-200/70" padding="lg">
                  <div className="flex items-center gap-3">
                    <BarChart2 className="h-5 w-5 text-indigo-500" />
                    <h3 className="text-lg font-semibold text-slate-900">Resumen mensual</h3>
                  </div>
                  <ul className="mt-4 space-y-2 text-sm text-slate-600">
                    <li>• Horas normales: 4.320 • Horas extra: 220</li>
                    <li>• Licencias aprobadas: 6 • Permisos especiales: 3</li>
                    <li>• Integración con nómina lista • Enviar el 25/11</li>
                  </ul>
                </Card>
              </div>
            </div>
          )}

          {activeTab === 'nominas' && (
            <div className="space-y-6">
              <div className="grid gap-4 md:grid-cols-3">
                {payrollMetrics.map(metric => (
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
                    <h2 className="text-lg font-semibold text-slate-900">Resumen de nóminas</h2>
                    <p className="mt-1 text-sm text-slate-600">
                      Control del ciclo de payroll con incidencias y variables.
                    </p>
                  </div>
                  <Button variant="secondary" size="sm">
                    Generar nómina
                  </Button>
                </div>
                <div className="mt-6 space-y-3">
                  {payrollSummary.map(entry => (
                    <div
                      key={entry.name}
                      className="grid gap-3 rounded-2xl border border-slate-200/70 bg-slate-50 p-4 md:grid-cols-4 md:items-center"
                    >
                      <div>
                        <p className="text-sm font-semibold text-slate-800">{entry.name}</p>
                        <p className="text-xs text-slate-500">{entry.concept}</p>
                      </div>
                      <p className="text-sm font-semibold text-slate-700">{entry.amount}</p>
                      <p className="text-xs text-slate-500">Última actualización hace 3h</p>
                      <div className="md:text-right">{renderPayroll(entry.status)}</div>
                    </div>
                  ))}
                </div>
              </Card>

              <div className="grid gap-4 md:grid-cols-2">
                <Card className="bg-white shadow-sm ring-1 ring-slate-200/70" padding="lg">
                  <h3 className="text-lg font-semibold text-slate-900">Variables por aprobar</h3>
                  <ul className="mt-4 space-y-2 text-sm text-slate-600">
                    <li>• Comisión ventas Q4 • 6 colaboradores • Validar con dirección</li>
                    <li>• Horas extra eventos • 4 miembros • Cruce con fichajes</li>
                    <li>• Bonus fidelización B2B • Revisar contratos activos</li>
                  </ul>
                </Card>
                <Card className="bg-white shadow-sm ring-1 ring-slate-200/70" padding="lg">
                  <h3 className="text-lg font-semibold text-slate-900">Integraciones financieras</h3>
                  <ul className="mt-4 space-y-2 text-sm text-slate-600">
                    <li>• Banco principal • IBAN verificado • Pagos 24/48h</li>
                    <li>• ERP fiscal • Exportación planificada el 28/11</li>
                    <li>• Control de costes • Sección payroll en dashboard finanzas</li>
                  </ul>
                </Card>
              </div>
            </div>
          )}

          {activeTab === 'comisiones' && (
            <div className="space-y-6">
              <div className="grid gap-4 md:grid-cols-3">
                {commissionMetrics.map(metric => (
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
                    <h2 className="text-lg font-semibold text-slate-900">Leaderboard de comisiones</h2>
                    <p className="mt-1 text-sm text-slate-600">Seguimiento individual y por squad.</p>
                  </div>
                  <Badge variant="secondary" size="md" leftIcon={<Target className="h-4 w-4" />}>
                    Media de logro {averageAchievement}%
                  </Badge>
                </div>
                <div className="mt-6 space-y-3">
                  {commissionLeaderboard.map(entry => (
                    <div
                      key={entry.member}
                      className="grid gap-3 rounded-2xl border border-slate-200/70 bg-slate-50 p-4 md:grid-cols-3 md:items-center"
                    >
                      <p className="text-sm font-semibold text-slate-800">{entry.member}</p>
                      <p className="text-sm font-semibold text-slate-700">{entry.total}</p>
                      <div className="md:text-right">
                        <Badge
                          variant={entry.achievement >= 80 ? 'success' : entry.achievement >= 60 ? 'yellow' : 'secondary'}
                          size="sm"
                        >
                          {entry.achievement}% objetivo
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              <div className="grid gap-4 md:grid-cols-2">
                <Card className="bg-white shadow-sm ring-1 ring-slate-200/70" padding="lg">
                  <div className="flex items-center gap-3">
                    <Trophy className="h-5 w-5 text-amber-500" />
                    <h3 className="text-lg font-semibold text-slate-900">Programas activos</h3>
                  </div>
                  <ul className="mt-4 space-y-2 text-sm text-slate-600">
                    <li>• Plan retail • Comisión 5% • Pago mensual</li>
                    <li>• Programa corporate • Objetivos trimestrales • Bonus mixto</li>
                    <li>• Upsell nutrición • Incentivo por cliente retenido • Pago bimestral</li>
                  </ul>
                </Card>
                <Card className="bg-white shadow-sm ring-1 ring-slate-200/70" padding="lg">
                  <div className="flex items-center gap-3">
                    <BarChart2 className="h-5 w-5 text-sky-500" />
                    <h3 className="text-lg font-semibold text-slate-900">Coaching comercial</h3>
                  </div>
                  <ul className="mt-4 space-y-2 text-sm text-slate-600">
                    <li>• Sesiones de roleplay semanales • Jueves 11:00</li>
                    <li>• Dashboard de pipeline compartido con dirección</li>
                    <li>• Incentivos ligados a NPS post-venta</li>
                  </ul>
                </Card>
              </div>
            </div>
          )}

          {activeTab === 'evaluaciones' && (
            <div className="space-y-6">
              <div className="grid gap-4 md:grid-cols-3">
                {performanceMetrics.map(metric => (
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
                    <h2 className="text-lg font-semibold text-slate-900">Resumen de evaluaciones</h2>
                    <p className="mt-1 text-sm text-slate-600">
                      Estado de los ciclos y planes de desarrollo individual.
                    </p>
                  </div>
                  <Button variant="secondary" size="sm">
                    Lanzar evaluación
                  </Button>
                </div>
                <div className="mt-6 space-y-3">
                  {performanceReviews.map(review => (
                    <div
                      key={review.member}
                      className="grid gap-3 rounded-2xl border border-slate-200/70 bg-slate-50 p-4 md:grid-cols-4 md:items-center"
                    >
                      <div>
                        <p className="text-sm font-semibold text-slate-800">{review.member}</p>
                        <p className="text-xs text-slate-500">Ciclo {review.cycle}</p>
                      </div>
                      <p className="text-sm text-slate-600 md:col-span-2">{review.nextAction}</p>
                      <div className="md:text-right">{renderPerformance(review.level)}</div>
                    </div>
                  ))}
                </div>
              </Card>

              <div className="grid gap-4 md:grid-cols-2">
                <Card className="bg-white shadow-sm ring-1 ring-slate-200/70" padding="lg">
                  <div className="flex items-center gap-3">
                    <GraduationCap className="h-5 w-5 text-indigo-500" />
                    <h3 className="text-lg font-semibold text-slate-900">Crecimiento & formación</h3>
                  </div>
                  <ul className="mt-4 space-y-2 text-sm text-slate-600">
                    <li>• Programa liderazgo intermedio • 8 participantes • Finaliza en diciembre</li>
                    <li>• Academia digital • 26 cursos completos • 120 horas formadas</li>
                    <li>• Mentoring interno • 5 parejas activas • Feedback 4.8/5</li>
                  </ul>
                </Card>
                <Card className="bg-white shadow-sm ring-1 ring-slate-200/70" padding="lg">
                  <div className="flex items-center gap-3">
                    <HeartPulse className="h-5 w-5 text-rose-500" />
                    <h3 className="text-lg font-semibold text-slate-900">Clima & cultura</h3>
                  </div>
                  <ul className="mt-4 space-y-2 text-sm text-slate-600">
                    <li>• Índice eNPS actual: +42</li>
                    <li>• Encuesta bienestar • 78% participación • Siguiente corte en enero</li>
                    <li>• Actividades de team building • 4 eventos Q4 • Budget €1.800</li>
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

export default EquipoRRHHPage;

