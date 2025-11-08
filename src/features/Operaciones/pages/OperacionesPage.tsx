import { useMemo, useState } from 'react';
import {
  Activity,
  AlertTriangle,
  CalendarDays,
  CheckCircle,
  ClipboardList,
  FileText,
  Flame,
  Shield,
  Wrench,
} from 'lucide-react';
import { Badge, Button, Card, Tabs, type TabItem } from '../../../components/componentsreutilizables';

type ShiftStatus = 'En curso' | 'Pendiente' | 'Completado';
type AccessStatus = 'OK' | 'Bloqueado' | 'Pendiente';
type MaintenancePriority = 'Alta' | 'Media' | 'Baja';

const TAB_ITEMS: TabItem[] = [
  { id: 'turnos', label: 'Turnos & horarios', icon: <CalendarDays className="h-4 w-4" /> },
  { id: 'acceso', label: 'Control acceso & aforo', icon: <Shield className="h-4 w-4" /> },
  { id: 'mantenimiento', label: 'Mantenimiento', icon: <Wrench className="h-4 w-4" /> },
  { id: 'checklists', label: 'Checklists', icon: <ClipboardList className="h-4 w-4" /> },
  { id: 'documentacion', label: 'Documentación interna', icon: <FileText className="h-4 w-4" /> },
];

const shiftMetrics = [
  { label: 'Personal activo', value: '12', detail: 'Equipo disponible hoy' },
  { label: 'Turnos asignados', value: '18', detail: 'Repartidos en 3 sedes' },
  { label: 'Solicitudes', value: '5', detail: 'Vacaciones o cambios' },
  { label: 'Incidencias', value: '2', detail: 'En revisión' },
];

const shiftSchedule: Array<{ name: string; role: string; schedule: string; status: ShiftStatus }> = [
  { name: 'Laura Martínez', role: 'Recepción', schedule: '06:00 - 14:00', status: 'En curso' },
  { name: 'Diego Gómez', role: 'Entrenador', schedule: '07:30 - 15:30', status: 'En curso' },
  { name: 'Marta Ruiz', role: 'Limpieza', schedule: '14:00 - 20:00', status: 'Pendiente' },
  { name: 'Carlos Pérez', role: 'Entrenador', schedule: '16:00 - 22:00', status: 'Pendiente' },
];

const accessStats = [
  { label: 'Accesos hoy', value: '428', detail: '+6% vs ayer' },
  { label: 'Capacidad media', value: '68%', detail: 'Aforo controlado' },
  { label: 'Alertas', value: '3', detail: '2 en recepción, 1 zona pesas' },
];

const accessLog: Array<{ member: string; time: string; gate: string; status: AccessStatus }> = [
  { member: 'Jorge Vidal', time: '08:12', gate: 'Recepción', status: 'OK' },
  { member: 'Lucía Fernández', time: '08:32', gate: 'Catraca cardio', status: 'OK' },
  { member: 'Invitado 102', time: '08:45', gate: 'Recepción', status: 'Pendiente' },
  { member: 'Sofía Prieto', time: '09:02', gate: 'Zona piscina', status: 'Bloqueado' },
];

const maintenanceMetrics = [
  { label: 'Tickets abiertos', value: '9', detail: '4 críticos, 5 en seguimiento' },
  { label: 'Tiempo medio', value: '12h', detail: 'Resolución últimas 24h' },
  { label: 'Proveedores activos', value: '3', detail: 'Mantenimiento, limpieza, equipos' },
];

const maintenanceTickets: Array<{
  id: string;
  area: string;
  description: string;
  priority: MaintenancePriority;
  updatedAt: string;
}> = [
  {
    id: 'MT-203',
    area: 'Sala fuerza',
    description: 'Cable máquina crossover desajustado',
    priority: 'Alta',
    updatedAt: 'Hace 20 min',
  },
  {
    id: 'MT-198',
    area: 'Vestuario femenino',
    description: 'Fuga en ducha 3',
    priority: 'Media',
    updatedAt: 'Hace 1 h',
  },
  {
    id: 'MT-192',
    area: 'Recepción',
    description: 'Pantalla tótem sin señal',
    priority: 'Baja',
    updatedAt: 'Hace 3 h',
  },
];

const checklistSummary = [
  { task: 'Apertura del centro', completion: 100, responsible: 'Laura M.' },
  { task: 'Control limpieza mañana', completion: 80, responsible: 'Equipo limpieza' },
  { task: 'Chequeo seguridad', completion: 60, responsible: 'Coordinador' },
  { task: 'Cierre administrativo', completion: 30, responsible: 'Recepción' },
];

const documents: Array<{ title: string; category: string; lastUpdate: string; owner: string }> = [
  { title: 'Protocolo de apertura', category: 'Operaciones', lastUpdate: '05 Nov 2025', owner: 'Operaciones' },
  { title: 'Plan emergencias 2025', category: 'Seguridad', lastUpdate: '01 Nov 2025', owner: 'Prevención' },
  { title: 'Manual onboarding staff', category: 'RRHH', lastUpdate: '28 Oct 2025', owner: 'RRHH' },
  { title: 'Check-list auditoría interna', category: 'Calidad', lastUpdate: '18 Oct 2025', owner: 'Calidad' },
];

function renderShiftStatus(status: ShiftStatus) {
  const variants: Record<ShiftStatus, { variant: 'success' | 'yellow' | 'secondary'; label: string }> = {
    'En curso': { variant: 'success', label: 'En curso' },
    Pendiente: { variant: 'yellow', label: 'Pendiente' },
    Completado: { variant: 'secondary', label: 'Completado' },
  };
  const config = variants[status];
  return (
    <Badge variant={config.variant} size="sm">
      {config.label}
    </Badge>
  );
}

function renderAccessStatus(status: AccessStatus) {
  const variants: Record<AccessStatus, { variant: 'success' | 'red' | 'yellow'; label: string }> = {
    OK: { variant: 'success', label: 'Permitido' },
    Bloqueado: { variant: 'red', label: 'Bloqueado' },
    Pendiente: { variant: 'yellow', label: 'Revisar' },
  };
  const config = variants[status];
  return (
    <Badge variant={config.variant} size="sm">
      {config.label}
    </Badge>
  );
}

function renderPriority(priority: MaintenancePriority) {
  const variants: Record<MaintenancePriority, { variant: 'red' | 'yellow' | 'secondary'; label: string }> = {
    Alta: { variant: 'red', label: 'Alta' },
    Media: { variant: 'yellow', label: 'Media' },
    Baja: { variant: 'secondary', label: 'Baja' },
  };
  const config = variants[priority];
  return (
    <Badge variant={config.variant} size="sm">
      Prioridad {config.label}
    </Badge>
  );
}

export function OperacionesPage() {
  const [activeTab, setActiveTab] = useState<string>('turnos');

  const completionAverage = useMemo(() => {
    const total = checklistSummary.reduce((acc, item) => acc + item.completion, 0);
    return Math.round(total / checklistSummary.length);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <header className="border-b border-slate-200/60 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/70">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 py-10 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-3">
              <Badge variant="blue" size="md">
                Operaciones del centro
              </Badge>
              <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 md:text-4xl">
                Hub de Operaciones
              </h1>
              <p className="max-w-2xl text-sm text-slate-600 md:text-base">
                Centraliza la gestión del día a día del centro: planificación de turnos, control de accesos, mantenimiento
                y documentación estandarizada para tu equipo operativo.
              </p>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <Button variant="secondary" onClick={() => setActiveTab('mantenimiento')}>
                Registrar incidencia
              </Button>
              <Button variant="ghost" onClick={() => setActiveTab('checklists')}>
                Revisar checklists diarios
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="space-y-8">
          <Tabs items={TAB_ITEMS} activeTab={activeTab} onTabChange={setActiveTab} variant="underline" />

          {activeTab === 'turnos' && (
            <div className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                {shiftMetrics.map(metric => (
                  <Card key={metric.label} className="bg-white shadow-sm ring-1 ring-slate-200/70" padding="lg">
                    <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{metric.label}</p>
                    <p className="mt-2 text-2xl font-bold text-slate-900">{metric.value}</p>
                    <p className="mt-1 text-sm text-slate-500">{metric.detail}</p>
                  </Card>
                ))}
              </div>

              <Card className="bg-white shadow-sm ring-1 ring-slate-200/70" padding="lg">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div>
                    <h2 className="text-lg font-semibold text-slate-900">Planificación de hoy</h2>
                    <p className="mt-1 text-sm text-slate-600">
                      Visualiza el estado de los turnos asignados y controla incidencias en tiempo real.
                    </p>
                  </div>
                  <Badge variant="secondary" size="md" leftIcon={<Activity className="h-4 w-4" />}>
                    95% cobertura
                  </Badge>
                </div>
                <div className="mt-6 space-y-3">
                  {shiftSchedule.map(shift => (
                    <div
                      key={shift.name}
                      className="grid gap-3 rounded-2xl border border-slate-200/70 bg-slate-50 p-4 md:grid-cols-4 md:items-center"
                    >
                      <div>
                        <p className="text-sm font-semibold text-slate-800">{shift.name}</p>
                        <p className="text-xs text-slate-500">{shift.role}</p>
                      </div>
                      <p className="text-sm font-medium text-slate-700">{shift.schedule}</p>
                      <p className="text-xs text-slate-500">Actualizado hace 10 minutos</p>
                      <div className="md:text-right">{renderShiftStatus(shift.status)}</div>
                    </div>
                  ))}
                </div>
              </Card>

              <Card className="bg-white shadow-sm ring-1 ring-slate-200/70" padding="lg">
                <h3 className="text-lg font-semibold text-slate-900">Solicitudes recientes</h3>
                <div className="mt-4 grid gap-3 md:grid-cols-3">
                  <div className="rounded-xl border border-slate-200/60 bg-slate-50 p-4">
                    <p className="text-xs uppercase text-slate-500">Vacaciones</p>
                    <p className="mt-2 text-lg font-semibold text-slate-900">2 pendientes</p>
                    <p className="mt-1 text-xs text-slate-500">Aprobar antes del viernes</p>
                  </div>
                  <div className="rounded-xl border border-slate-200/60 bg-slate-50 p-4">
                    <p className="text-xs uppercase text-slate-500">Cambios de turno</p>
                    <p className="mt-2 text-lg font-semibold text-slate-900">3 resueltos</p>
                    <p className="mt-1 text-xs text-slate-500">Última respuesta hace 1h</p>
                  </div>
                  <div className="rounded-xl border border-slate-200/60 bg-slate-50 p-4">
                    <p className="text-xs uppercase text-slate-500">Horas extra</p>
                    <p className="mt-2 text-lg font-semibold text-slate-900">6 programadas</p>
                    <p className="mt-1 text-xs text-slate-500">Cobertura fines de semana</p>
                  </div>
                </div>
              </Card>
            </div>
          )}

          {activeTab === 'acceso' && (
            <div className="space-y-6">
              <div className="grid gap-4 md:grid-cols-3">
                {accessStats.map(stat => (
                  <Card key={stat.label} className="bg-white shadow-sm ring-1 ring-slate-200/70" padding="lg">
                    <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{stat.label}</p>
                    <p className="mt-2 text-2xl font-bold text-slate-900">{stat.value}</p>
                    <p className="mt-1 text-sm text-slate-500">{stat.detail}</p>
                  </Card>
                ))}
              </div>

              <Card className="bg-white shadow-sm ring-1 ring-slate-200/70" padding="lg">
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div>
                    <h2 className="text-lg font-semibold text-slate-900">Log de accesos</h2>
                    <p className="mt-1 text-sm text-slate-600">Últimos registros en tiempo real.</p>
                  </div>
                  <Badge variant="secondary" size="md">Aforo actual 72%</Badge>
                </div>
                <div className="mt-6 space-y-3">
                  {accessLog.map(entry => (
                    <div
                      key={`${entry.member}-${entry.time}`}
                      className="grid gap-3 rounded-2xl border border-slate-200/70 bg-slate-50 p-4 md:grid-cols-4 md:items-center"
                    >
                      <div>
                        <p className="text-sm font-semibold text-slate-800">{entry.member}</p>
                        <p className="text-xs text-slate-500">{entry.gate}</p>
                      </div>
                      <p className="text-sm text-slate-600">Acceso {entry.time}</p>
                      <p className="text-xs text-slate-500">Zona controlada automáticamente</p>
                      <div className="md:text-right">{renderAccessStatus(entry.status)}</div>
                    </div>
                  ))}
                </div>
              </Card>

              <div className="grid gap-4 md:grid-cols-3">
                <Card className="bg-white shadow-sm ring-1 ring-slate-200/70" padding="lg">
                  <p className="text-xs uppercase text-slate-500">Alertas activas</p>
                  <p className="mt-2 text-lg font-semibold text-red-600">3 alertas</p>
                  <p className="mt-1 text-xs text-slate-500">Última: puerta zona pesas</p>
                </Card>
                <Card className="bg-white shadow-sm ring-1 ring-slate-200/70" padding="lg">
                  <p className="text-xs uppercase text-slate-500">Bajas automáticas</p>
                  <p className="mt-2 text-lg font-semibold text-slate-900">Automatizadas</p>
                  <p className="mt-1 text-xs text-slate-500">Basado en pagos y morosidad</p>
                </Card>
                <Card className="bg-white shadow-sm ring-1 ring-slate-200/70" padding="lg">
                  <p className="text-xs uppercase text-slate-500">Historico</p>
                  <p className="mt-2 text-lg font-semibold text-slate-900">Logs 90 días</p>
                  <p className="mt-1 text-xs text-slate-500">Exportable en CSV</p>
                </Card>
              </div>
            </div>
          )}

          {activeTab === 'mantenimiento' && (
            <div className="space-y-6">
              <div className="grid gap-4 md:grid-cols-3">
                {maintenanceMetrics.map(metric => (
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
                    <h2 className="text-lg font-semibold text-slate-900">Incidencias abiertas</h2>
                    <p className="mt-1 text-sm text-slate-600">Prioriza las tareas críticas y asigna responsables.</p>
                  </div>
                  <Button variant="secondary" size="sm">
                    Nueva incidencia
                  </Button>
                </div>
                <div className="mt-6 space-y-3">
                  {maintenanceTickets.map(ticket => (
                    <div
                      key={ticket.id}
                      className="grid gap-3 rounded-2xl border border-slate-200/70 bg-slate-50 p-4 md:grid-cols-5 md:items-center"
                    >
                      <div>
                        <p className="text-sm font-semibold text-slate-800">{ticket.id}</p>
                        <p className="text-xs text-slate-500">{ticket.area}</p>
                      </div>
                      <p className="text-sm text-slate-700 md:col-span-2">{ticket.description}</p>
                      <p className="text-xs text-slate-500">Actualizado {ticket.updatedAt}</p>
                      <div className="md:text-right">{renderPriority(ticket.priority)}</div>
                    </div>
                  ))}
                </div>
              </Card>

              <div className="grid gap-4 md:grid-cols-2">
                <Card className="bg-white shadow-sm ring-1 ring-slate-200/70" padding="lg">
                  <h3 className="text-lg font-semibold text-slate-900">Proveedores vinculados</h3>
                  <ul className="mt-4 space-y-3 text-sm text-slate-600">
                    <li>
                      <span className="font-semibold text-slate-800">GymFix Co.</span> • Mantenimiento maquinaria • SLA 4h
                    </li>
                    <li>
                      <span className="font-semibold text-slate-800">Clean&Go</span> • Limpieza integral • SLA 12h
                    </li>
                    <li>
                      <span className="font-semibold text-slate-800">TechSecure</span> • Sistemas acceso • SLA 8h
                    </li>
                  </ul>
                </Card>
                <Card className="bg-white shadow-sm ring-1 ring-slate-200/70" padding="lg">
                  <h3 className="text-lg font-semibold text-slate-900">Preventivos programados</h3>
                  <ul className="mt-4 space-y-3 text-sm text-slate-600">
                    <li>Inspección máquinas cardio • 10 Nov • Responsable: Carlos P.</li>
                    <li>Revisión extintores • 15 Nov • Responsable: Seguridad</li>
                    <li>Actualización software accesos • 18 Nov • Responsable: Sistemas</li>
                  </ul>
                </Card>
              </div>
            </div>
          )}

          {activeTab === 'checklists' && (
            <div className="space-y-6">
              <div className="grid gap-4 md:grid-cols-3">
                <Card className="bg-white shadow-sm ring-1 ring-slate-200/70" padding="lg">
                  <p className="text-xs uppercase text-slate-500">Promedio cumplimiento</p>
                  <p className="mt-2 text-2xl font-bold text-slate-900">{completionAverage}%</p>
                  <p className="mt-1 text-sm text-slate-500">Basado en 4 checklist activos</p>
                </Card>
                <Card className="bg-white shadow-sm ring-1 ring-slate-200/70" padding="lg">
                  <p className="text-xs uppercase text-slate-500">Alertas</p>
                  <p className="mt-2 text-2xl font-bold text-amber-600">2 tareas</p>
                  <p className="mt-1 text-sm text-slate-500">Requieren cierre antes de las 18h</p>
                </Card>
                <Card className="bg-white shadow-sm ring-1 ring-slate-200/70" padding="lg">
                  <p className="text-xs uppercase text-slate-500">Automatizaciones</p>
                  <p className="mt-2 text-2xl font-bold text-slate-900">5 flujos</p>
                  <p className="mt-1 text-sm text-slate-500">Recordatorios y escalados</p>
                </Card>
              </div>

              <Card className="bg-white shadow-sm ring-1 ring-slate-200/70" padding="lg">
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div>
                    <h2 className="text-lg font-semibold text-slate-900">Checklist diarios</h2>
                    <p className="mt-1 text-sm text-slate-600">
                      Seguimiento del equipo operativo en cada franja horaria.
                    </p>
                  </div>
                  <Button variant="secondary" size="sm">
                    Crear checklist
                  </Button>
                </div>
                <div className="mt-6 space-y-3">
                  {checklistSummary.map(item => (
                    <div
                      key={item.task}
                      className="grid gap-3 rounded-2xl border border-slate-200/70 bg-slate-50 p-4 md:grid-cols-3 md:items-center"
                    >
                      <div>
                        <p className="text-sm font-semibold text-slate-800">{item.task}</p>
                        <p className="text-xs text-slate-500">Responsable: {item.responsible}</p>
                      </div>
                      <div className="h-2 rounded-full bg-slate-200">
                        <div
                          className="h-2 rounded-full bg-teal-500"
                          style={{ width: `${item.completion}%` }}
                        />
                      </div>
                      <div className="md:text-right">
                        <Badge variant={item.completion === 100 ? 'success' : 'yellow'} size="sm">
                          {item.completion}% completado
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              <Card className="bg-white shadow-sm ring-1 ring-slate-200/70" padding="lg">
                <h3 className="text-lg font-semibold text-slate-900">Eventos destacados</h3>
                <div className="mt-4 space-y-3 text-sm text-slate-600">
                  <div className="flex items-center gap-3">
                    <Flame className="h-5 w-5 text-amber-600" />
                    <span>Check de seguridad con pendiente en extintores (02:00 PM)</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-emerald-600" />
                    <span>Apertura completada y validada por supervisión (07:15 AM)</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <AlertTriangle className="h-5 w-5 text-red-500" />
                    <span>Checklist de cierre con tareas críticas sin completar (Anoche)</span>
                  </div>
                </div>
              </Card>
            </div>
          )}

          {activeTab === 'documentacion' && (
            <div className="space-y-6">
              <div className="grid gap-4 md:grid-cols-3">
                <Card className="bg-white shadow-sm ring-1 ring-slate-200/70" padding="lg">
                  <p className="text-xs uppercase text-slate-500">Repositorio activo</p>
                  <p className="mt-2 text-2xl font-bold text-slate-900">128 archivos</p>
                  <p className="mt-1 text-sm text-slate-500">Documentación operativa vigente</p>
                </Card>
                <Card className="bg-white shadow-sm ring-1 ring-slate-200/70" padding="lg">
                  <p className="text-xs uppercase text-slate-500">Actualizaciones</p>
                  <p className="mt-2 text-2xl font-bold text-slate-900">12 este mes</p>
                  <p className="mt-1 text-sm text-slate-500">Protocolos y guías revisadas</p>
                </Card>
                <Card className="bg-white shadow-sm ring-1 ring-slate-200/70" padding="lg">
                  <p className="text-xs uppercase text-slate-500">Firmas pendientes</p>
                  <p className="mt-2 text-2xl font-bold text-amber-600">4 equipos</p>
                  <p className="mt-1 text-sm text-slate-500">Aceptar nuevas políticas</p>
                </Card>
              </div>

              <Card className="bg-white shadow-sm ring-1 ring-slate-200/70" padding="lg">
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div>
                    <h2 className="text-lg font-semibold text-slate-900">Documentos recientes</h2>
                    <p className="mt-1 text-sm text-slate-600">
                      Protocolos y manuales más consultados por el personal operativo.
                    </p>
                  </div>
                  <Button variant="secondary" size="sm">
                    Subir documento
                  </Button>
                </div>
                <div className="mt-6 space-y-3">
                  {documents.map(doc => (
                    <div
                      key={doc.title}
                      className="grid gap-3 rounded-2xl border border-slate-200/70 bg-slate-50 p-4 md:grid-cols-4 md:items-center"
                    >
                      <div className="md:col-span-2">
                        <p className="text-sm font-semibold text-slate-800">{doc.title}</p>
                        <p className="text-xs text-slate-500">Categoría: {doc.category}</p>
                      </div>
                      <p className="text-xs text-slate-500">Actualizado {doc.lastUpdate}</p>
                      <p className="text-xs text-right text-slate-500 md:text-right">Owner: {doc.owner}</p>
                    </div>
                  ))}
                </div>
              </Card>

              <div className="grid gap-4 md:grid-cols-2">
                <Card className="bg-white shadow-sm ring-1 ring-slate-200/70" padding="lg">
                  <h3 className="text-lg font-semibold text-slate-900">Categorías destacadas</h3>
                  <ul className="mt-4 space-y-2 text-sm text-slate-600">
                    <li>• Operativa diaria (24 contenidos)</li>
                    <li>• Seguridad y emergencias (18 contenidos)</li>
                    <li>• RRHH y formación (21 contenidos)</li>
                    <li>• Calidad y auditoría (15 contenidos)</li>
                  </ul>
                </Card>
                <Card className="bg-white shadow-sm ring-1 ring-slate-200/70" padding="lg">
                  <h3 className="text-lg font-semibold text-slate-900">Firmas pendientes</h3>
                  <ul className="mt-4 space-y-2 text-sm text-slate-600">
                    <li>Equipo recepción • Manual de trato al cliente • 87% firmó</li>
                    <li>Equipo mantenimiento • Protocolo seguridad herramientas • 65% firmó</li>
                    <li>Staff clases colectivas • Actualización PRL • 40% firmó</li>
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

export default OperacionesPage;

