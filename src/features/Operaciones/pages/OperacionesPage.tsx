import { ChangeEvent, useMemo, useState } from 'react';
import {
  Activity,
  AlertCircle,
  AlertTriangle,
  BadgeCheck,
  Building2,
  CalendarClock,
  CheckCircle,
  ClipboardCheck,
  ClipboardList,
  FileText,
  Gavel,
  Map,
  Shield,
  Target,
  Users,
  Wrench,
} from 'lucide-react';
import {
  Badge,
  Button,
  Card,
  Select,
  Tabs,
  type TabItem,
} from '../../../components/componentsreutilizables';

type IncidentPriority = 'Baja' | 'Media' | 'Alta' | 'Crítica';
type IncidentStatus = 'Abierta' | 'En curso' | 'Pendiente proveedor' | 'Resuelta';
type ChecklistState = 'Completado' | 'Parcial' | 'No iniciado';

const TAB_ITEMS: TabItem[] = [
  { id: 'overview', label: 'Overview operativo', icon: <Activity className="h-4 w-4" /> },
  { id: 'incidencias', label: 'Incidencias & Mantenimiento', icon: <Wrench className="h-4 w-4" /> },
  { id: 'checklists', label: 'Checklists & Rutinas', icon: <ClipboardList className="h-4 w-4" /> },
  { id: 'salas', label: 'Salas & Recursos', icon: <Building2 className="h-4 w-4" /> },
  { id: 'seguridad', label: 'Seguridad & Normativas', icon: <Shield className="h-4 w-4" /> },
  { id: 'documentacion', label: 'Documentación & Protocolos', icon: <FileText className="h-4 w-4" /> },
  { id: 'auditorias', label: 'Auditorías & Calidad', icon: <Gavel className="h-4 w-4" /> },
];

const sedeOptions = [
  { value: 'central', label: 'Sede Central' },
  { value: 'norte', label: 'Sede Norte' },
  { value: 'sur', label: 'Sede Sur' },
];

const resourceTypeOptions = [
  { value: 'todos', label: 'Todos los recursos' },
  { value: 'maquinaria-fuerza', label: 'Maquinaria fuerza' },
  { value: 'maquinaria-cardio', label: 'Maquinaria cardio' },
  { value: 'salas', label: 'Salas' },
  { value: 'spa', label: 'Spa / piscina' },
  { value: 'vestuarios', label: 'Vestuarios' },
];

const statusOptions = [
  { value: 'todos', label: 'Todos los estados' },
  { value: 'ok', label: 'OK' },
  { value: 'incidencias', label: 'Con incidencias' },
  { value: 'revision', label: 'En revisión' },
];

const periodOptions = [
  { value: 'hoy', label: 'Hoy' },
  { value: 'semana', label: 'Esta semana' },
  { value: 'mes', label: 'Este mes' },
];

const GLOBAL_KPIS = [
  { label: 'Incidencias abiertas', value: '14', trend: '+3 críticas', variant: 'red' as const, icon: <AlertTriangle className="h-4 w-4" /> },
  { label: 'Máquinas fuera de servicio', value: '6', trend: '2 cardio • 4 fuerza', variant: 'orange' as const, icon: <Wrench className="h-4 w-4" /> },
  { label: 'Checklists completados', value: '78%', trend: '12 de 15 completados hoy', variant: 'green' as const, icon: <ClipboardCheck className="h-4 w-4" /> },
  { label: 'Próximo mantenimiento', value: '3h', trend: 'Cinta nº3 • Preventivo', variant: 'blue' as const, icon: <CalendarClock className="h-4 w-4" /> },
  { label: 'Última auditoría', value: '92/100', trend: '15 Oct • Sin no conformidades críticas', variant: 'purple' as const, icon: <BadgeCheck className="h-4 w-4" /> },
];

const OVERVIEW_ALERTS = [
  { message: '3 máquinas críticas fuera de servicio', severity: 'critical' as const, area: 'Sala fuerza' },
  { message: 'Checklist de apertura no completado', severity: 'warning' as const, area: 'Recepción' },
  { message: 'Ducha mujeres vestuario 2 en incidencia 48h', severity: 'warning' as const, area: 'Vestuarios' },
];

const OVERVIEW_ROOMS = [
  { name: 'Sala principal', status: 'ok' as const, incidents: 1 },
  { name: 'Box funcional', status: 'warning' as const, incidents: 2 },
  { name: 'Zona cardio', status: 'critical' as const, incidents: 3 },
  { name: 'Spa / piscina', status: 'ok' as const, incidents: 0 },
  { name: 'Vestuarios H', status: 'ok' as const, incidents: 0 },
  { name: 'Vestuarios M', status: 'warning' as const, incidents: 1 },
  { name: 'Sala ciclo', status: 'ok' as const, incidents: 0 },
  { name: 'Sala yoga', status: 'closed' as const, incidents: 0 },
];

const OVERVIEW_TIMELINE = [
  { time: '06:00', title: 'Apertura del centro', description: 'Checklist apertura validado 95%' },
  { time: '08:30', title: 'Incidencia crítica', description: 'Cinta nº2 fuera de servicio • Responsable: Mantenimiento' },
  { time: '11:00', title: 'Revisión limpieza', description: 'Checklist limpieza matutina 80% completado' },
  { time: '15:30', title: 'Mantenimiento preventivo', description: 'Piscina climatizada • Proveedor AguaClean' },
  { time: '21:30', title: 'Checklist de cierre', description: 'Pendientes: 2 tareas críticas' },
];

const INCIDENTS = [
  {
    id: 'INC-245',
    type: 'Máquina',
    area: 'Zona cardio',
    description: 'Cinta nº2 no arranca',
    priority: 'Crítica' as IncidentPriority,
    status: 'En curso' as IncidentStatus,
    responsible: 'Carlos Pérez',
    sla: '4h',
    createdAt: '08 Nov • 08:20',
    due: '08 Nov • 12:20',
  },
  {
    id: 'INC-244',
    type: 'Instalación',
    area: 'Vestuarios M',
    description: 'Ducha nº3 con fuga',
    priority: 'Alta' as IncidentPriority,
    status: 'Pendiente proveedor' as IncidentStatus,
    responsible: 'Laura Martínez',
    sla: '12h',
    createdAt: '07 Nov • 19:40',
    due: '08 Nov • 07:40',
  },
  {
    id: 'INC-241',
    type: 'Limpieza',
    area: 'Sala principal',
    description: 'Suelo resbaladizo post clase HIIT',
    priority: 'Media' as IncidentPriority,
    status: 'Abierta' as IncidentStatus,
    responsible: 'Equipo limpieza',
    sla: '2h',
    createdAt: '08 Nov • 07:00',
    due: '08 Nov • 09:00',
  },
  {
    id: 'INC-238',
    type: 'Seguridad',
    area: 'Acceso principal',
    description: 'Torno 1 con lectura intermitente',
    priority: 'Alta' as IncidentPriority,
    status: 'En curso' as IncidentStatus,
    responsible: 'TechSecure',
    sla: '8h',
    createdAt: '07 Nov • 12:10',
    due: '07 Nov • 20:10',
  },
];

const MAINTENANCE_CALENDAR = [
  { task: 'Cinta nº3 cada 3 meses', frequency: 'Trimestral', next: '08 Nov • 16:00', responsible: 'Carlos Pérez' },
  { task: 'Revisión spa semanal', frequency: 'Semanal', next: '09 Nov • 09:00', responsible: 'Spa Team' },
  { task: 'Chequeo luces emergencia', frequency: 'Mensual', next: '12 Nov • 11:00', responsible: 'Seguridad' },
];

const MAINTENANCE_KPIS = [
  { label: 'MTTR', value: '6.3h', description: 'Tiempo medio resolución (últimos 30 días)' },
  { label: 'Dentro de SLA', value: '84%', description: '% incidencias resueltas en objetivo' },
  { label: 'Máquinas críticas', value: 'Cinta nº2 • Remo #4', description: 'Top incidencias por recurrencia' },
];

const MAINTENANCE_ACTIONS = [
  'Asignar responsable',
  'Cambiar estado',
  'Subir evidencia',
  'Escalar a proveedor',
  'Marcar como resuelta',
  'Agregar comentario',
  'Registrar coste estimado',
];

const CHECKLIST_TYPES = [
  { name: 'Apertura', total: 32, mandatory: true },
  { name: 'Cierre', total: 32, mandatory: true },
  { name: 'Limpieza diaria', total: 48, mandatory: false },
  { name: 'Revisión maquinaria', total: 24, mandatory: true },
  { name: 'Seguridad', total: 18, mandatory: true },
  { name: 'Spa / Piscina', total: 12, mandatory: false },
  { name: 'Eventos especiales', total: 9, mandatory: false },
];

const CHECKLISTS_TODAY: Array<{
  name: string;
  state: ChecklistState;
  responsible: string;
  deadline: string;
  progress: number;
}> = [
  { name: 'Apertura del centro', state: 'Completado', responsible: 'Laura M.', deadline: '06:30', progress: 100 },
  { name: 'Limpieza mañana', state: 'Parcial', responsible: 'Equipo limpieza', deadline: '11:00', progress: 76 },
  { name: 'Chequeo seguridad', state: 'Parcial', responsible: 'Coordinador', deadline: '14:00', progress: 62 },
  { name: 'Revisión maquinaria', state: 'No iniciado', responsible: 'Técnico guardia', deadline: '16:00', progress: 10 },
  { name: 'Cierre del día', state: 'No iniciado', responsible: 'Recepción', deadline: '22:00', progress: 0 },
];

const SALAS = [
  {
    name: 'Sala Fitness 1',
    type: 'Sala fitness',
    capacity: '45 personas',
    schedule: '06:00 - 23:00',
    status: 'Operativa' as const,
    resources: 28,
  },
  {
    name: 'Sala ciclo',
    type: 'Sala ciclo indoor',
    capacity: '34 bicicletas',
    schedule: '06:00 - 22:00',
    status: 'En mantenimiento' as const,
    resources: 34,
  },
  {
    name: 'Box funcional',
    type: 'Box',
    capacity: '25 personas',
    schedule: '07:00 - 23:00',
    status: 'Operativa' as const,
    resources: 18,
  },
  {
    name: 'Piscina / Spa',
    type: 'Spa',
    capacity: '30 personas',
    schedule: '08:00 - 21:00',
    status: 'Operativa' as const,
    resources: 12,
  },
];

const RECURSOS = [
  {
    name: 'Cinta LifeFitness #2',
    type: 'Cinta',
    room: 'Zona cardio',
    serial: 'LF-23-8891',
    purchaseDate: 'Abr 2022',
    provider: 'GymFix Co.',
    status: 'Fuera de servicio' as const,
  },
  {
    name: 'Remo Concept2 #4',
    type: 'Remo',
    room: 'Zona cardio',
    serial: 'C2-2021-034',
    purchaseDate: 'Sep 2021',
    provider: 'GymFix Co.',
    status: 'En revisión' as const,
  },
  {
    name: 'Jaula multipower',
    type: 'Rack',
    room: 'Sala fuerza',
    serial: 'MP-2020-112',
    purchaseDate: 'Ene 2020',
    provider: 'IronPro',
    status: 'Operativo' as const,
  },
  {
    name: 'Tumbona spa #6',
    type: 'Spa',
    room: 'Zona spa',
    serial: 'SPA-2023-008',
    purchaseDate: 'Feb 2023',
    provider: 'AquaRelax',
    status: 'Operativo' as const,
  },
];

const SEGURIDAD_REGISTROS = [
  { title: 'Simulacro evacuación Q4', date: '15 Oct 2025', responsible: 'Seguridad', status: 'Completado' },
  { title: 'Revisión extintores noviembre', date: '01 Nov 2025', responsible: 'Proveedor TecFire', status: 'En curso' },
  { title: 'Formación primeros auxilios equipo recepción', date: '20 Oct 2025', responsible: 'RRHH', status: 'Completado' },
  { title: 'Check salidas emergencia', date: '07 Nov 2025', responsible: 'Operaciones', status: 'Pendiente' },
];

const SEGURIDAD_ALERTAS = [
  { label: 'Revisar extintores antes del 15 Nov', type: 'warning' as const },
  { label: 'Actualizar protocolo de evacuación', type: 'info' as const },
  { label: 'Revisión eléctrica pendiente', type: 'critical' as const },
];

const DOCUMENTOS = [
  {
    title: 'Protocolo de atención al cliente',
    category: 'Operaciones',
    owner: 'Operaciones',
    updatedAt: '05 Nov 2025',
  },
  {
    title: 'Guía de limpieza vestuarios',
    category: 'Limpieza',
    owner: 'Operaciones',
    updatedAt: '28 Oct 2025',
  },
  {
    title: 'Proceso alta de socio',
    category: 'Clientes',
    owner: 'Recepción',
    updatedAt: '24 Oct 2025',
  },
  {
    title: 'Gestión de incidencias críticas',
    category: 'Calidad',
    owner: 'Operaciones',
    updatedAt: '21 Oct 2025',
  },
];

const DOCUMENT_CATEGORIES = [
  { name: 'Operativa diaria', count: 24 },
  { name: 'Seguridad y emergencias', count: 18 },
  { name: 'RRHH y formación', count: 21 },
  { name: 'Calidad y auditoría', count: 15 },
];

const FIRMAS_PENDIENTES = [
  { team: 'Equipo recepción', document: 'Manual trato al cliente', progress: '87% firmó' },
  { team: 'Equipo mantenimiento', document: 'Protocolo seguridad herramientas', progress: '65% firmó' },
  { team: 'Clases colectivas', document: 'Actualización PRL', progress: '40% firmó' },
];

const AUDIT_CHECKS = [
  {
    name: 'Auditoría limpieza mensual',
    score: 88,
    auditor: 'María López',
    status: 'Plan de acción abierto',
    actions: 4,
  },
  {
    name: 'Auditoría mantenimiento',
    score: 94,
    auditor: 'Proveedor externo',
    status: 'Cerrada',
    actions: 0,
  },
  {
    name: 'Auditoría experiencia cliente',
    score: 90,
    auditor: 'Operaciones',
    status: 'En seguimiento',
    actions: 2,
  },
];

const AUDIT_KPIS = [
  { label: 'Auditorías completadas', value: '6', detail: 'Últimos 12 meses' },
  { label: 'No conformidades abiertas', value: '3', detail: '1 crítica • 2 menores' },
  { label: 'Planes de acción en curso', value: '5', detail: 'Responsables asignados' },
];

const AUDIT_ACTIONS = [
  'Crear auditoría',
  'Asignar auditor',
  'Generar informe',
  'Exportar resultados',
  'Asignar tareas derivadas',
];

const ROOM_STATUS_VARIANTS: Record<(typeof OVERVIEW_ROOMS)[number]['status'], string> = {
  ok: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  warning: 'border-amber-200 bg-amber-50 text-amber-700',
  critical: 'border-rose-200 bg-rose-50 text-rose-700',
  closed: 'border-slate-200 bg-slate-100 text-slate-500',
};

const INCIDENT_PRIORITY_VARIANTS: Record<IncidentPriority, { badge: Parameters<typeof Badge>[0]['variant']; label: string }> = {
  Baja: { badge: 'secondary', label: 'Baja' },
  Media: { badge: 'yellow', label: 'Media' },
  Alta: { badge: 'red', label: 'Alta' },
  Crítica: { badge: 'destructive', label: 'Crítica' },
};

const INCIDENT_STATUS_VARIANTS: Record<IncidentStatus, { badge: Parameters<typeof Badge>[0]['variant']; label: string }> = {
  Abierta: { badge: 'yellow', label: 'Abierta' },
  'En curso': { badge: 'blue', label: 'En curso' },
  'Pendiente proveedor': { badge: 'orange', label: 'Pendiente proveedor' },
  Resuelta: { badge: 'success', label: 'Resuelta' },
};

const CHECKLIST_STATE_VARIANTS: Record<ChecklistState, { badge: Parameters<typeof Badge>[0]['variant']; label: string }> = {
  Completado: { badge: 'success', label: 'Completado' },
  Parcial: { badge: 'yellow', label: 'Parcial' },
  'No iniciado': { badge: 'secondary', label: 'No iniciado' },
};

export function OperacionesPage() {
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [filters, setFilters] = useState({
    sede: 'central',
    tipo: 'todos',
    estado: 'todos',
    periodo: 'hoy',
  });

  const checklistAverage = useMemo(() => {
    const total = CHECKLISTS_TODAY.reduce((acc, item) => acc + item.progress, 0);
    return Math.round(total / CHECKLISTS_TODAY.length);
  }, []);

  const handleFilterChange = (key: keyof typeof filters) => (event: ChangeEvent<HTMLSelectElement>) => {
    setFilters(prev => ({
      ...prev,
      [key]: event.target.value,
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <header className="border-b border-slate-200/60 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/70">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 py-10 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-3">
              <Badge variant="blue" size="md">
                Operaciones
              </Badge>
              <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 md:text-4xl">
                Command Center de Operaciones
              </h1>
              <p className="max-w-3xl text-sm text-slate-600 md:text-base">
                Controla la operativa diaria del gimnasio: incidencias, mantenimiento, checklists, recursos físicos y
                documentación crítica. Pensado para que nada se escape y tu centro funcione al 100%.
              </p>
            </div>
            <div className="flex flex-wrap gap-2 sm:flex-row sm:items-center">
              <Button variant="secondary" leftIcon={<AlertTriangle className="h-4 w-4" />} onClick={() => setActiveTab('incidencias')}>
                Nueva incidencia
              </Button>
              <Button variant="ghost" leftIcon={<CalendarClock className="h-4 w-4" />} onClick={() => setActiveTab('incidencias')}>
                Nuevo mantenimiento
              </Button>
              <Button variant="ghost" leftIcon={<ClipboardCheck className="h-4 w-4" />} onClick={() => setActiveTab('checklists')}>
                Crear checklist
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="space-y-8">
          <section className="space-y-6 rounded-3xl border border-slate-200/70 bg-white/70 p-6 shadow-sm backdrop-blur">
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              <Card padding="lg" className="border border-slate-200/60 bg-slate-50">
                <Select
                  label="Sede"
                  value={filters.sede}
                  onChange={handleFilterChange('sede')}
                  options={sedeOptions}
                  helperText="Filtra por ubicación"
                />
              </Card>
              <Card padding="lg" className="border border-slate-200/60 bg-slate-50">
                <Select
                  label="Tipo de recurso"
                  value={filters.tipo}
                  onChange={handleFilterChange('tipo')}
                  options={resourceTypeOptions}
                  helperText="Maquinaria, salas o servicios"
                />
              </Card>
              <Card padding="lg" className="border border-slate-200/60 bg-slate-50">
                <Select
                  label="Estado"
                  value={filters.estado}
                  onChange={handleFilterChange('estado')}
                  options={statusOptions}
                  helperText="Haz foco en incidencias críticas"
                />
              </Card>
              <Card padding="lg" className="border border-slate-200/60 bg-slate-50">
                <Select
                  label="Periodo"
                  value={filters.periodo}
                  onChange={handleFilterChange('periodo')}
                  options={periodOptions}
                  helperText="Vista temporal rápida"
                />
              </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
              {GLOBAL_KPIS.map(kpi => (
                <Card key={kpi.label} padding="lg" className="border border-slate-200/60 bg-white shadow-sm">
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" size="sm" className="uppercase tracking-wide text-xs text-slate-500">
                      {kpi.label}
                    </Badge>
                    <span className="rounded-full bg-slate-100 p-2 text-slate-500">{kpi.icon}</span>
                  </div>
                  <p className="mt-3 text-2xl font-bold text-slate-900">{kpi.value}</p>
                  <p className="mt-1 text-xs text-slate-500">{kpi.trend}</p>
                  </Card>
                ))}
              </div>

            <div className="flex flex-wrap gap-3">
              <Button variant="primary" size="sm" leftIcon={<AlertTriangle className="h-4 w-4" />} onClick={() => setActiveTab('incidencias')}>
                + Nueva incidencia
              </Button>
              <Button variant="secondary" size="sm" leftIcon={<Wrench className="h-4 w-4" />} onClick={() => setActiveTab('incidencias')}>
                + Nuevo mantenimiento programado
              </Button>
              <Button variant="ghost" size="sm" leftIcon={<ClipboardCheck className="h-4 w-4" />} onClick={() => setActiveTab('checklists')}>
                + Crear checklist
              </Button>
              <Button variant="ghost" size="sm" leftIcon={<Building2 className="h-4 w-4" />} onClick={() => setActiveTab('salas')}>
                + Nueva sala / recurso
              </Button>
              <Button variant="ghost" size="sm" leftIcon={<Map className="h-4 w-4" />}>
                Ver mapa del centro
              </Button>
              <Button variant="ghost" size="sm" leftIcon={<Target className="h-4 w-4" />}>
                Configurar categorías & SLAs
              </Button>
            </div>
          </section>

          <Tabs items={TAB_ITEMS} activeTab={activeTab} onTabChange={setActiveTab} variant="underline" />

          {activeTab === 'overview' && (
            <section className="space-y-6">
              <div className="grid gap-4 lg:grid-cols-3">
                <Card padding="lg" className="lg:col-span-2 border border-slate-200/60 bg-white shadow-sm">
                  <div className="flex items-start justify-between gap-4">
                  <div>
                      <h2 className="text-lg font-semibold text-slate-900">Estado operativo general</h2>
                    <p className="mt-1 text-sm text-slate-600">
                        Termómetro diario del centro. Detecta incidencias críticas al instante.
                    </p>
                  </div>
                    <Badge variant="success" size="md" leftIcon={<Activity className="h-4 w-4" />}>
                      Centro operativo al 92%
                  </Badge>
                </div>

                <div className="mt-6 space-y-3">
                    {OVERVIEW_ALERTS.map(alert => (
                      <div
                        key={alert.message}
                        className="flex items-start justify-between rounded-2xl border border-slate-200/70 bg-slate-50 p-4"
                      >
                        <div className="flex items-start gap-3">
                          {alert.severity === 'critical' ? (
                            <AlertTriangle className="mt-0.5 h-5 w-5 text-rose-500" />
                          ) : (
                            <AlertCircle className="mt-0.5 h-5 w-5 text-amber-500" />
                          )}
                      <div>
                            <p className="text-sm font-semibold text-slate-900">{alert.message}</p>
                            <p className="text-xs text-slate-500">Zona: {alert.area}</p>
                      </div>
                        </div>
                        <Button variant="ghost" size="sm">
                          Ver detalle
                        </Button>
                    </div>
                  ))}
                </div>
              </Card>

                <Card padding="lg" className="border border-slate-200/60 bg-white shadow-sm">
                  <h3 className="text-lg font-semibold text-slate-900">Timeline de hoy</h3>
                  <div className="mt-6 space-y-4">
                    {OVERVIEW_TIMELINE.map(item => (
                      <div key={item.time} className="relative pl-6">
                        <span className="absolute left-0 top-1.5 h-3 w-3 rounded-full bg-teal-500" />
                        <div className="flex flex-col">
                          <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">{item.time}</span>
                          <span className="text-sm font-semibold text-slate-800">{item.title}</span>
                          <span className="text-xs text-slate-500">{item.description}</span>
                  </div>
                  </div>
                    ))}
                </div>
              </Card>
            </div>

              <Card padding="lg" className="border border-slate-200/60 bg-white shadow-sm">
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900">Mapa operativo del centro</h3>
                    <p className="mt-1 text-sm text-slate-600">
                      Haz clic en cada sala para ver incidencias, recursos y checklists vinculados.
                    </p>
                  </div>
                  <Button variant="secondary" size="sm" leftIcon={<Map className="h-4 w-4" />}>
                    Abrir vista completa
                  </Button>
                </div>
                <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                  {OVERVIEW_ROOMS.map(room => (
                    <div
                      key={room.name}
                      className={`rounded-2xl border p-4 transition hover:-translate-y-0.5 hover:shadow ${ROOM_STATUS_VARIANTS[room.status]}`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-semibold">{room.name}</span>
                        <Badge variant="outline" size="sm">
                          {room.status === 'ok'
                            ? 'OK'
                            : room.status === 'warning'
                            ? 'Incidencia leve'
                            : room.status === 'critical'
                            ? 'Incidencia crítica'
                            : 'Cerrado'}
                        </Badge>
                      </div>
                      <p className="mt-2 text-xs">
                        {room.incidents === 0 ? 'Sin incidencias activas' : `${room.incidents} incidencia${room.incidents > 1 ? 's' : ''} vinculada${room.incidents > 1 ? 's' : ''}`}
                      </p>
                    </div>
                  ))}
                </div>
              </Card>

              <Card padding="lg" className="border border-slate-200/60 bg-white shadow-sm">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h3 className="text-lg font-semibold text-slate-900">Acciones rápidas</h3>
                  <div className="flex flex-wrap gap-2">
                    <Button variant="secondary" size="sm">
                      Ver detalle sala
                    </Button>
                    <Button variant="ghost" size="sm" leftIcon={<AlertTriangle className="h-4 w-4" />} onClick={() => setActiveTab('incidencias')}>
                      Crear incidencia
                    </Button>
                    <Button variant="ghost" size="sm" leftIcon={<Users className="h-4 w-4" />}>
                      Asignar responsable
                    </Button>
              </div>
            </div>
              </Card>
            </section>
          )}

          {activeTab === 'incidencias' && (
            <section className="space-y-6">
              <div className="grid gap-4 md:grid-cols-3">
                {MAINTENANCE_KPIS.map(kpi => (
                  <Card key={kpi.label} padding="lg" className="border border-slate-200/60 bg-white shadow-sm">
                    <p className="text-xs uppercase tracking-wide text-slate-500">{kpi.label}</p>
                    <p className="mt-3 text-2xl font-bold text-slate-900">{kpi.value}</p>
                    <p className="mt-1 text-xs text-slate-500">{kpi.description}</p>
                  </Card>
                ))}
              </div>

              <Card padding="lg" className="border border-slate-200/60 bg-white shadow-sm">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div>
                    <h2 className="text-lg font-semibold text-slate-900">Incidencias activas</h2>
                    <p className="mt-1 text-sm text-slate-600">Gestiona incidencias con SLAs claros y responsables definidos.</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                  <Button variant="secondary" size="sm">
                      + Nueva incidencia
                    </Button>
                    <Button variant="ghost" size="sm">
                      Exportar listado
                  </Button>
                </div>
                </div>

                <div className="mt-6 space-y-3">
                  {INCIDENTS.map(incident => (
                    <div
                      key={incident.id}
                      className="grid gap-4 rounded-2xl border border-slate-200/70 bg-slate-50 p-4 md:grid-cols-6 md:items-center"
                    >
                      <div className="md:col-span-2">
                        <p className="text-sm font-semibold text-slate-900">
                          {incident.id} • {incident.type}
                        </p>
                        <p className="text-xs text-slate-500">{incident.area}</p>
                        <p className="mt-1 text-sm text-slate-700">{incident.description}</p>
                      </div>
                      <div>
                        <p className="text-xs uppercase text-slate-500">Prioridad</p>
                        <Badge variant={INCIDENT_PRIORITY_VARIANTS[incident.priority].badge} size="sm">
                          {INCIDENT_PRIORITY_VARIANTS[incident.priority].label}
                        </Badge>
                      </div>
                      <div>
                        <p className="text-xs uppercase text-slate-500">Estado</p>
                        <Badge variant={INCIDENT_STATUS_VARIANTS[incident.status].badge} size="sm">
                          {INCIDENT_STATUS_VARIANTS[incident.status].label}
                        </Badge>
                      </div>
                      <div>
                        <p className="text-xs uppercase text-slate-500">Responsable</p>
                        <p className="text-sm text-slate-800">{incident.responsible}</p>
                        <p className="text-xs text-slate-500">SLA {incident.sla}</p>
                      </div>
                      <div>
                        <p className="text-xs uppercase text-slate-500">Ventana</p>
                        <p className="text-xs text-slate-600">Creada: {incident.createdAt}</p>
                        <p className="text-xs text-slate-600">Vence: {incident.due}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 flex flex-wrap gap-2">
                  {MAINTENANCE_ACTIONS.map(action => (
                    <Badge key={action} variant="outline" size="sm" className="bg-white text-slate-600">
                      {action}
                    </Badge>
                  ))}
                </div>
              </Card>

              <div className="grid gap-4 lg:grid-cols-2">
                <Card padding="lg" className="border border-slate-200/60 bg-white shadow-sm">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900">Mantenimiento programado</h3>
                      <p className="mt-1 text-sm text-slate-600">Calendario de tareas recurrentes y preventivos.</p>
                    </div>
                    <Button variant="ghost" size="sm">
                      + Nueva tarea recurrente
                    </Button>
                  </div>
                  <div className="mt-6 space-y-4">
                    {MAINTENANCE_CALENDAR.map(item => (
                      <div key={item.task} className="rounded-2xl border border-slate-200/70 bg-slate-50 p-4">
                        <div className="flex items-center justify-between gap-3">
                          <p className="text-sm font-semibold text-slate-900">{item.task}</p>
                          <Badge variant="secondary" size="sm">
                            {item.frequency}
                          </Badge>
                        </div>
                        <p className="mt-1 text-xs text-slate-500">Próximo: {item.next}</p>
                        <p className="text-xs text-slate-500">Responsable: {item.responsible}</p>
                        <div className="mt-3 flex flex-wrap gap-2">
                          <Button variant="ghost" size="sm">
                            Marcar como realizado
                          </Button>
                          <Button variant="ghost" size="sm">
                            Adjuntar informe
                          </Button>
                          <Button variant="ghost" size="sm">
                            Asignar proveedor
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>

                <Card padding="lg" className="border border-slate-200/60 bg-white shadow-sm">
                  <h3 className="text-lg font-semibold text-slate-900">Proveedores vinculados</h3>
                  <div className="mt-4 space-y-3 text-sm text-slate-600">
                    <div className="rounded-2xl border border-slate-200/70 bg-slate-50 p-4">
                      <p className="font-semibold text-slate-900">GymFix Co.</p>
                      <p>Maquinaria fuerza y cardio</p>
                      <p className="text-xs text-slate-500">SLA 4h • Contacto: soporte@gymfix.com</p>
              </div>
                    <div className="rounded-2xl border border-slate-200/70 bg-slate-50 p-4">
                      <p className="font-semibold text-slate-900">Clean &amp; Go</p>
                      <p>Limpieza integral diaria</p>
                      <p className="text-xs text-slate-500">SLA 12h • Contacto: operaciones@cleanandgo.com</p>
            </div>
                    <div className="rounded-2xl border border-slate-200/70 bg-slate-50 p-4">
                      <p className="font-semibold text-slate-900">TechSecure</p>
                      <p>Sistemas de acceso y control</p>
                      <p className="text-xs text-slate-500">SLA 8h • Contacto: soporte@techsecure.io</p>
                    </div>
                  </div>
                </Card>
              </div>
            </section>
          )}

          {activeTab === 'checklists' && (
            <section className="space-y-6">
              <div className="grid gap-4 md:grid-cols-4">
                <Card padding="lg" className="border border-slate-200/60 bg-white shadow-sm">
                  <p className="text-xs uppercase tracking-wide text-slate-500">Promedio cumplimiento hoy</p>
                  <p className="mt-3 text-2xl font-bold text-slate-900">{checklistAverage}%</p>
                  <p className="mt-1 text-xs text-slate-500">Basado en {CHECKLISTS_TODAY.length} checklists activos</p>
                </Card>
                <Card padding="lg" className="border border-slate-200/60 bg-white shadow-sm">
                  <p className="text-xs uppercase tracking-wide text-slate-500">Alertas activas</p>
                  <p className="mt-3 text-2xl font-bold text-amber-600">3 tareas</p>
                  <p className="mt-1 text-xs text-slate-500">Requieren cierre antes de las 18:00</p>
                </Card>
                <Card padding="lg" className="border border-slate-200/60 bg-white shadow-sm">
                  <p className="text-xs uppercase tracking-wide text-slate-500">Automatizaciones</p>
                  <p className="mt-3 text-2xl font-bold text-slate-900">5 flujos</p>
                  <p className="mt-1 text-xs text-slate-500">Recordatorios y escalados activos</p>
                </Card>
                <Card padding="lg" className="border border-slate-200/60 bg-white shadow-sm">
                  <p className="text-xs uppercase tracking-wide text-slate-500">Duplicar plantillas</p>
                  <p className="mt-3 text-2xl font-bold text-slate-900">2 sedes</p>
                  <p className="mt-1 text-xs text-slate-500">Listas para expandir</p>
                </Card>
              </div>

              <Card padding="lg" className="border border-slate-200/60 bg-white shadow-sm">
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div>
                    <h2 className="text-lg font-semibold text-slate-900">Checklists del día</h2>
                    <p className="mt-1 text-sm text-slate-600">
                      Resultados en tiempo real. Crea incidencias directamente desde cada ítem.
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                  <Button variant="secondary" size="sm">
                      + Crear checklist (plantilla)
                    </Button>
                    <Button variant="ghost" size="sm">
                      Asignar a rol / persona
                    </Button>
                    <Button variant="ghost" size="sm">
                      Ver histórico
                  </Button>
                </div>
                </div>

                <div className="mt-6 space-y-3">
                  {CHECKLISTS_TODAY.map(item => (
                    <div
                      key={item.name}
                      className="grid gap-4 rounded-2xl border border-slate-200/70 bg-slate-50 p-4 md:grid-cols-5 md:items-center"
                    >
                      <div className="md:col-span-2">
                        <p className="text-sm font-semibold text-slate-900">{item.name}</p>
                        <p className="text-xs text-slate-500">
                          Responsable: {item.responsible} • Límite {item.deadline}h
                        </p>
                      </div>
                      <div className="md:col-span-2">
                        <div className="h-2 w-full rounded-full bg-slate-200">
                        <div
                            className="h-2 rounded-full bg-teal-500 transition-all"
                            style={{ width: `${item.progress}%` }}
                        />
                        </div>
                        <p className="mt-1 text-xs text-slate-500">Progreso {item.progress}%</p>
                      </div>
                      <div className="md:text-right">
                        <Badge variant={CHECKLIST_STATE_VARIANTS[item.state].badge} size="sm">
                          {CHECKLIST_STATE_VARIANTS[item.state].label}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              <div className="grid gap-4 lg:grid-cols-2">
                <Card padding="lg" className="border border-slate-200/60 bg-white shadow-sm">
                  <h3 className="text-lg font-semibold text-slate-900">Tipos de checklist</h3>
                  <div className="mt-4 grid gap-3 md:grid-cols-2">
                    {CHECKLIST_TYPES.map(type => (
                      <div key={type.name} className="rounded-2xl border border-slate-200/70 bg-slate-50 p-4">
                        <div className="flex items-center justify-between gap-3">
                          <p className="text-sm font-semibold text-slate-900">{type.name}</p>
                          {type.mandatory && <Badge variant="outline" size="sm">Obligatorio</Badge>}
                        </div>
                        <p className="mt-1 text-xs text-slate-500">{type.total} ítems definidos</p>
                        <div className="mt-3 flex flex-wrap gap-2">
                          <Button variant="ghost" size="sm">
                            Lanzar ahora
                          </Button>
                          <Button variant="ghost" size="sm">
                            Duplicar plantilla
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>

                <Card padding="lg" className="border border-slate-200/60 bg-white shadow-sm">
                <h3 className="text-lg font-semibold text-slate-900">Eventos destacados</h3>
                <div className="mt-4 space-y-3 text-sm text-slate-600">
                    <div className="flex items-center gap-3 rounded-2xl border border-slate-200/70 bg-slate-50 p-4">
                      <AlertTriangle className="h-5 w-5 text-amber-500" />
                      <span>Checklist de apertura con observaciones pendientes</span>
                  </div>
                    <div className="flex items-center gap-3 rounded-2xl border border-slate-200/70 bg-slate-50 p-4">
                      <CheckCircle className="h-5 w-5 text-emerald-500" />
                      <span>Seguridad validada previa apertura (07:15h)</span>
                  </div>
                    <div className="flex items-center gap-3 rounded-2xl border border-slate-200/70 bg-slate-50 p-4">
                      <AlertTriangle className="h-5 w-5 text-rose-500" />
                      <span>Checklist de cierre anterior con 2 tareas críticas sin completar</span>
                    </div>
                  </div>
                </Card>
              </div>
            </section>
          )}

          {activeTab === 'salas' && (
            <section className="space-y-6">
              <div className="grid gap-4 lg:grid-cols-2">
                <Card padding="lg" className="border border-slate-200/60 bg-white shadow-sm">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h2 className="text-lg font-semibold text-slate-900">Salas operativas</h2>
                      <p className="mt-1 text-sm text-slate-600">
                        Gestiona capacidad, horarios y permisos de uso.
                      </p>
                    </div>
                    <Button variant="secondary" size="sm">
                      + Nueva sala
                    </Button>
                  </div>

                  <div className="mt-6 space-y-4">
                    {SALAS.map(room => (
                      <div key={room.name} className="rounded-2xl border border-slate-200/70 bg-slate-50 p-4">
                        <div className="flex flex-wrap items-center justify-between gap-3">
                          <div>
                            <p className="text-sm font-semibold text-slate-900">{room.name}</p>
                            <p className="text-xs text-slate-500">{room.type}</p>
                          </div>
                          <Badge variant="outline" size="sm">
                            {room.status}
                          </Badge>
                        </div>
                        <div className="mt-2 grid gap-2 text-xs text-slate-600 md:grid-cols-2">
                          <span>Capacidad: {room.capacity}</span>
                          <span>Horario: {room.schedule}</span>
                          <span>Recursos asociados: {room.resources}</span>
                          <span>Permisos: Clases colectivas / Reservas premium</span>
                        </div>
                        <div className="mt-3 flex flex-wrap gap-2">
                          <Button variant="ghost" size="sm">
                            Editar sala
                          </Button>
                          <Button variant="ghost" size="sm">
                            Ver incidencias
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => setActiveTab('incidencias')}>
                            Marcar fuera de servicio
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>

                <Card padding="lg" className="border border-slate-200/60 bg-white shadow-sm">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h2 className="text-lg font-semibold text-slate-900">Recursos &amp; Equipos</h2>
                      <p className="mt-1 text-sm text-slate-600">
                        Inventario centralizado con histórico de mantenimiento.
                      </p>
                    </div>
                    <Button variant="secondary" size="sm">
                      + Nuevo recurso
                    </Button>
                  </div>

                  <div className="mt-6 space-y-4">
                    {RECURSOS.map(resource => (
                      <div key={resource.name} className="rounded-2xl border border-slate-200/70 bg-slate-50 p-4">
                        <div className="flex items-center justify-between gap-3">
                          <div>
                            <p className="text-sm font-semibold text-slate-900">{resource.name}</p>
                            <p className="text-xs text-slate-500">{resource.type} • Sala: {resource.room}</p>
                          </div>
                          <Badge
                            variant={
                              resource.status === 'Operativo'
                                ? 'success'
                                : resource.status === 'En revisión'
                                ? 'yellow'
                                : 'destructive'
                            }
                            size="sm"
                          >
                            {resource.status}
                          </Badge>
                        </div>
                        <div className="mt-2 grid gap-2 text-xs text-slate-600 md:grid-cols-2">
                          <span>Nº serie: {resource.serial}</span>
                          <span>Compra: {resource.purchaseDate}</span>
                          <span>Proveedor: {resource.provider}</span>
                          <span>Vida útil estimada: 5 años</span>
                        </div>
                        <div className="mt-3 flex flex-wrap gap-2">
                          <Button variant="ghost" size="sm" onClick={() => setActiveTab('incidencias')}>
                            Crear incidencia
                          </Button>
                          <Button variant="ghost" size="sm">
                            Asignar sala
                          </Button>
                          <Button variant="ghost" size="sm">
                            Ver historial
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            </section>
          )}

          {activeTab === 'seguridad' && (
            <section className="space-y-6">
              <div className="grid gap-4 lg:grid-cols-3">
                <Card padding="lg" className="border border-slate-200/60 bg-white shadow-sm lg:col-span-2">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h2 className="text-lg font-semibold text-slate-900">Registro de seguridad</h2>
                      <p className="mt-1 text-sm text-slate-600">
                        Seguimiento de simulacros, revisiones y formaciones del personal.
                      </p>
                    </div>
                    <Button variant="secondary" size="sm">
                      + Registrar evento
                    </Button>
                  </div>
                  <div className="mt-6 space-y-3">
                    {SEGURIDAD_REGISTROS.map(item => (
                      <div key={item.title} className="rounded-2xl border border-slate-200/70 bg-slate-50 p-4">
                        <div className="flex flex-wrap items-center justify-between gap-3">
                          <div>
                            <p className="text-sm font-semibold text-slate-900">{item.title}</p>
                            <p className="text-xs text-slate-500">
                              {item.date} • Responsable: {item.responsible}
                            </p>
                          </div>
                          <Badge variant={item.status === 'Completado' ? 'success' : item.status === 'Pendiente' ? 'yellow' : 'blue'} size="sm">
                            {item.status}
                          </Badge>
                        </div>
                        <div className="mt-3 flex flex-wrap gap-2">
                          <Button variant="ghost" size="sm">
                            Adjuntar informe
                          </Button>
                          <Button variant="ghost" size="sm">
                            Asignar seguimiento
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>

                <Card padding="lg" className="border border-slate-200/60 bg-white shadow-sm">
                  <h3 className="text-lg font-semibold text-slate-900">Alertas críticas</h3>
                  <div className="mt-4 space-y-3">
                    {SEGURIDAD_ALERTAS.map(alert => (
                      <div
                        key={alert.label}
                        className="flex items-center justify-between rounded-2xl border border-slate-200/70 bg-slate-50 p-4"
                      >
                  <div className="flex items-center gap-3">
                          {alert.type === 'critical' ? (
                            <AlertTriangle className="h-5 w-5 text-rose-500" />
                          ) : alert.type === 'warning' ? (
                            <AlertTriangle className="h-5 w-5 text-amber-500" />
                          ) : (
                            <Shield className="h-5 w-5 text-teal-500" />
                          )}
                          <p className="text-sm text-slate-800">{alert.label}</p>
                  </div>
                        <Button variant="ghost" size="sm">
                          Ver detalle
                        </Button>
                      </div>
                    ))}
                  </div>
                  <div className="mt-6 space-y-2 text-xs text-slate-600">
                    <p>• Registrar revisiones de extintores y simulacros</p>
                    <p>• Vincular documentos legales y protocolos</p>
                    <p>• Descargar informes para auditorías externas</p>
                </div>
              </Card>
            </div>
            </section>
          )}

          {activeTab === 'documentacion' && (
            <section className="space-y-6">
              <div className="grid gap-4 md:grid-cols-4">
                <Card padding="lg" className="border border-slate-200/60 bg-white shadow-sm">
                  <p className="text-xs uppercase tracking-wide text-slate-500">Repositorio activo</p>
                  <p className="mt-3 text-2xl font-bold text-slate-900">128 documentos</p>
                  <p className="mt-1 text-xs text-slate-500">Operativa vigente y protocolos críticos</p>
                </Card>
                <Card padding="lg" className="border border-slate-200/60 bg-white shadow-sm">
                  <p className="text-xs uppercase tracking-wide text-slate-500">Actualizaciones este mes</p>
                  <p className="mt-3 text-2xl font-bold text-slate-900">12</p>
                  <p className="mt-1 text-xs text-slate-500">Documentos revisados por responsables</p>
                </Card>
                <Card padding="lg" className="border border-slate-200/60 bg-white shadow-sm">
                  <p className="text-xs uppercase tracking-wide text-slate-500">Firmas pendientes</p>
                  <p className="mt-3 text-2xl font-bold text-amber-600">4 equipos</p>
                  <p className="mt-1 text-xs text-slate-500">Aceptación de nuevas políticas</p>
                </Card>
                <Card padding="lg" className="border border-slate-200/60 bg-white shadow-sm">
                  <p className="text-xs uppercase tracking-wide text-slate-500">Destacados</p>
                  <p className="mt-3 text-2xl font-bold text-slate-900">8 documentos</p>
                  <p className="mt-1 text-xs text-slate-500">Marcados como prioritarios</p>
                </Card>
              </div>

              <Card padding="lg" className="border border-slate-200/60 bg-white shadow-sm">
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div>
                    <h2 className="text-lg font-semibold text-slate-900">Documentación interna</h2>
                    <p className="mt-1 text-sm text-slate-600">
                      Protocolo operativo centralizado. Controla visibilidad por roles.
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                  <Button variant="secondary" size="sm">
                      + Subir documento
                    </Button>
                    <Button variant="ghost" size="sm">
                      Crear guía rápida
                    </Button>
                    <Button variant="ghost" size="sm">
                      Destacar como importante
                  </Button>
                </div>
                </div>

                <div className="mt-6 space-y-3">
                  {DOCUMENTOS.map(doc => (
                    <div
                      key={doc.title}
                      className="grid gap-4 rounded-2xl border border-slate-200/70 bg-slate-50 p-4 md:grid-cols-4 md:items-center"
                    >
                      <div className="md:col-span-2">
                        <p className="text-sm font-semibold text-slate-900">{doc.title}</p>
                        <p className="text-xs text-slate-500">Categoría: {doc.category}</p>
                      </div>
                      <p className="text-xs text-slate-500">Actualizado: {doc.updatedAt}</p>
                      <p className="text-xs text-slate-500 md:text-right">Owner: {doc.owner}</p>
                    </div>
                  ))}
                </div>
              </Card>

              <div className="grid gap-4 lg:grid-cols-2">
                <Card padding="lg" className="border border-slate-200/60 bg-white shadow-sm">
                  <h3 className="text-lg font-semibold text-slate-900">Categorías destacadas</h3>
                  <div className="mt-4 space-y-3">
                    {DOCUMENT_CATEGORIES.map(category => (
                      <div key={category.name} className="flex items-center justify-between rounded-2xl border border-slate-200/70 bg-slate-50 p-4">
                        <span className="text-sm text-slate-800">{category.name}</span>
                        <Badge variant="outline" size="sm">
                          {category.count} contenidos
                        </Badge>
                      </div>
                    ))}
                  </div>
                </Card>

                <Card padding="lg" className="border border-slate-200/60 bg-white shadow-sm">
                  <h3 className="text-lg font-semibold text-slate-900">Firmas pendientes</h3>
                  <div className="mt-4 space-y-3">
                    {FIRMAS_PENDIENTES.map(item => (
                      <div key={item.document} className="rounded-2xl border border-slate-200/70 bg-slate-50 p-4">
                        <p className="text-sm font-semibold text-slate-900">{item.team}</p>
                        <p className="text-xs text-slate-500">Documento: {item.document}</p>
                        <p className="mt-1 text-xs text-slate-500">{item.progress}</p>
                        <div className="mt-3 flex flex-wrap gap-2">
                          <Button variant="ghost" size="sm">
                            Recordar firma
                          </Button>
                          <Button variant="ghost" size="sm">
                            Ver quién ha leído
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            </section>
          )}

          {activeTab === 'auditorias' && (
            <section className="space-y-6">
              <div className="grid gap-4 md:grid-cols-3">
                {AUDIT_KPIS.map(kpi => (
                  <Card key={kpi.label} padding="lg" className="border border-slate-200/60 bg-white shadow-sm">
                    <p className="text-xs uppercase tracking-wide text-slate-500">{kpi.label}</p>
                    <p className="mt-3 text-2xl font-bold text-slate-900">{kpi.value}</p>
                    <p className="mt-1 text-xs text-slate-500">{kpi.detail}</p>
                  </Card>
                ))}
            </div>

              <Card padding="lg" className="border border-slate-200/60 bg-white shadow-sm">
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div>
                    <h2 className="text-lg font-semibold text-slate-900">Auditorías &amp; calidad</h2>
                    <p className="mt-1 text-sm text-slate-600">
                      Crea auditorías internas, puntúa áreas y genera planes de acción.
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Button variant="secondary" size="sm">
                      + Nueva auditoría
                    </Button>
                    <Button variant="ghost" size="sm">
                      Exportar informe
                    </Button>
                  </div>
                </div>

                <div className="mt-6 space-y-3">
                  {AUDIT_CHECKS.map(audit => (
                    <div
                      key={audit.name}
                      className="grid gap-4 rounded-2xl border border-slate-200/70 bg-slate-50 p-4 md:grid-cols-4 md:items-center"
                    >
                      <div className="md:col-span-2">
                        <p className="text-sm font-semibold text-slate-900">{audit.name}</p>
                        <p className="text-xs text-slate-500">Auditor: {audit.auditor}</p>
                      </div>
                      <div>
                        <p className="text-xs uppercase text-slate-500">Puntuación</p>
                        <p className="text-lg font-semibold text-slate-900">{audit.score}/100</p>
                      </div>
                      <div className="md:text-right">
                        <Badge variant={audit.status === 'Cerrada' ? 'success' : 'yellow'} size="sm">
                          {audit.status}
                        </Badge>
                        {audit.actions > 0 && (
                          <p className="mt-1 text-xs text-slate-500">{audit.actions} acciones abiertas</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 flex flex-wrap gap-2">
                  {AUDIT_ACTIONS.map(action => (
                    <Badge key={action} variant="outline" size="sm" className="bg-white text-slate-600">
                      {action}
                    </Badge>
                  ))}
                </div>
              </Card>
            </section>
          )}
        </div>
      </main>
    </div>
  );
}

export default OperacionesPage;