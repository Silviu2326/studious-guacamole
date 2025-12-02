import { useState } from 'react';
import type { LucideIcon } from 'lucide-react';
import {
  AlertTriangle,
  Award,
  BadgeCheck,
  Bell,
  Briefcase,
  CalendarCheck,
  CalendarClock,
  CalendarDays,
  CheckCircle2,
  ClipboardCheck,
  ClipboardList,
  Clock,
  Download,
  FileSpreadsheet,
  FileText,
  GraduationCap,
  Layers,
  ListChecks,
  Mail,
  MapPin,
  MessageCircle,
  Settings,
  ShieldCheck,
  Sparkles,
  Target,
  Upload,
  Users,
  UserCog,
  UserPlus,
} from 'lucide-react';
import { Badge, Button, Card, Input, Tabs, type TabItem } from '../../../components/componentsreutilizables';

type EmployeeStatus = 'Activo' | 'Onboarding' | 'Baja' | 'Congelado';

interface KpiCard {
  id: string;
  label: string;
  value: string;
  helper: string;
  icon: LucideIcon;
}

interface FilterGroup {
  label: string;
  options: string[];
}

interface EmployeeIndicator {
  label: string;
  variant: 'success' | 'yellow' | 'destructive' | 'secondary';
}

interface EmployeeSummary {
  id: string;
  name: string;
  role: string;
  location: string;
  status: EmployeeStatus;
  contractType: string;
  contractCategory: string;
  lastActivity: string;
  indicators: EmployeeIndicator[];
  tags: string[];
  manager: string;
}

interface TimelineItem {
  label: string;
  detail: string;
  status: 'completo' | 'pendiente' | 'en-progreso';
}

interface ChecklistItem {
  label: string;
  completed: boolean;
  owner: string;
}

interface PermissionItem {
  area: string;
  scope: string;
  critical?: boolean;
}

interface AttendanceItem {
  day: string;
  checkIn: string;
  checkOut: string;
  difference: string;
  status: 'A tiempo' | 'Retraso' | 'Ausencia';
  note?: string;
}

interface VariableItem {
  concept: string;
  amount: string;
  status: 'Pendiente' | 'Aprobado' | 'Revisión';
}

interface EvaluationItem {
  cycle: string;
  score: string;
  focus: string;
  nextStep: string;
}

interface CertificationItem {
  name: string;
  validity: string;
  status: 'Vigente' | 'Vencimiento cercano' | 'Caducada';
}

interface AbsenceItem {
  type: string;
  dates: string;
  status: 'Pendiente' | 'Aprobada' | 'Registrada';
  note?: string;
}

interface EmployeeDetail {
  header: {
    roles: string[];
    status: EmployeeStatus;
    contract: string;
    schedule: string;
    seniority: string;
    cost: string;
    manager: string;
    tags: string[];
  };
  personalData: Array<{ label: string; value: string }>;
  contractData: Array<{ label: string; value: string }>;
  documentation: Array<{ label: string; status: 'Firmado' | 'Pendiente' | 'Vencido'; updated: string }>;
  reminders: Array<{ label: string; date: string; type: 'warning' | 'info' | 'success' }>;
  roles: {
    functional: string[];
    compatible: string[];
    permissions: PermissionItem[];
    shortcuts: string[];
  };
  shifts: {
    summary: Array<{ label: string; value: string }>;
    availability: string[];
    conflicts: string[];
    actions: string[];
  };
  attendance: {
    highlights: Array<{ label: string; value: string }>;
    log: AttendanceItem[];
  };
  payroll: {
    snapshot: Array<{ label: string; value: string }>;
    incidents: string[];
    variables: VariableItem[];
  };
  variables: {
    programs: string[];
    performance: Array<{ label: string; progress: string }>;
    actions: string[];
  };
  evaluation: {
    overview: Array<{ label: string; value: string }>;
    history: EvaluationItem[];
    feedback: string[];
  };
  training: {
    courses: TimelineItem[];
    certifications: CertificationItem[];
    reminders: string[];
  };
  absences: {
    upcoming: AbsenceItem[];
    history: AbsenceItem[];
    alerts: string[];
  };
  onboarding: {
    onboardingChecklist: ChecklistItem[];
    offboardingChecklist: ChecklistItem[];
    history: TimelineItem[];
  };
}

const TOP_KPIS: KpiCard[] = [
  {
    id: 'activos',
    label: 'Nº empleados activos',
    value: '48',
    helper: 'Incluye equipos internos y franquicias',
    icon: Users,
  },
  {
    id: 'externos',
    label: 'Nº freelance / externos',
    value: '6',
    helper: 'Contratos vigentes este mes',
    icon: Briefcase,
  },
  {
    id: 'horas',
    label: 'Horas planificadas vs trabajadas',
    value: '38h / 40h',
    helper: 'Semana actual • Cobertura 95%',
    icon: Clock,
  },
  {
    id: 'coste',
    label: 'Coste estimado de personal',
    value: '€82.400',
    helper: 'Mes en curso • Incluye variables',
    icon: FileSpreadsheet,
  },
  {
    id: 'ausencias',
    label: 'Ausencias registradas',
    value: '4 hoy / 7 semana',
    helper: 'Vacaciones + incidencias',
    icon: AlertTriangle,
  },
  {
    id: 'vacantes',
    label: 'Puestos sin cubrir',
    value: '3',
    helper: 'Recepción, PT senior, Mantenimiento',
    icon: Target,
  },
  {
    id: 'onboarding',
    label: 'Onboarding / salidas',
    value: '5 / 2',
    helper: 'Procesos activos',
    icon: ClipboardCheck,
  },
  {
    id: 'evaluaciones',
    label: 'Evaluaciones pendientes',
    value: '6',
    helper: 'Cerrar antes del 30/11',
    icon: Award,
  },
];

const FILTER_GROUPS: FilterGroup[] = [
  { label: 'Sede', options: ['Todas', 'Centro', 'Norte', 'Sur', 'Online'] },
  {
    label: 'Rol',
    options: ['Recepción', 'PT', 'Monitor', 'Mantenimiento', 'Limpieza', 'Dirección'],
  },
  {
    label: 'Tipo contratación',
    options: ['Indefinido', 'Parcial', 'Autónomo', 'Prácticas'],
  },
  {
    label: 'Estado',
    options: ['Activo', 'Onboarding', 'Offboarding', 'Baja'],
  },
];

const QUICK_FILTERS = ['Solo con horas extra', 'Incidencias fichaje', 'Evaluaciones pendientes'];

const GLOBAL_ACTIONS = [
  { id: 'add', label: '+ Añadir empleado', icon: UserPlus },
  { id: 'import', label: 'Importar equipo', icon: Upload },
  { id: 'turnos', label: 'Ver cuadrante de turnos', icon: CalendarDays },
  { id: 'roles', label: 'Configurar roles & permisos', icon: Settings },
  { id: 'policies', label: 'Configurar políticas RRHH', icon: ShieldCheck },
  { id: 'export', label: 'Exportar datos RRHH', icon: Download },
];

const EMPLOYEES: EmployeeSummary[] = [
  {
    id: 'laura-martinez',
    name: 'Laura Martínez',
    role: 'Coordinadora Operaciones',
    location: 'Sede Central',
    status: 'Activo',
    contractType: 'Indefinido',
    contractCategory: '40h / semana',
    lastActivity: 'Último fichaje 05:58',
    indicators: [
      { label: '⭐ Alto rendimiento', variant: 'success' },
      { label: '⏱ Horas extra', variant: 'yellow' },
    ],
    tags: ['Líder', 'Formador', 'Clave crossfit'],
    manager: 'Dirección general',
  },
  {
    id: 'diego-gomez',
    name: 'Diego Gómez',
    role: 'Entrenador Personal Senior',
    location: 'Sede Norte',
    status: 'Onboarding',
    contractType: 'Indefinido parcial',
    contractCategory: '30h / semana',
    lastActivity: 'Checklist onboarding 60%',
    indicators: [
      { label: '📈 Variables altas', variant: 'success' },
      { label: '⚠ Retrasos puntuales', variant: 'yellow' },
    ],
    tags: ['Ventas PT', 'Cross-training'],
    manager: 'Laura Martínez',
  },
  {
    id: 'marta-ruiz',
    name: 'Marta Ruiz',
    role: 'Recepción Senior',
    location: 'Sede Centro',
    status: 'Activo',
    contractType: 'Indefinido',
    contractCategory: '35h / semana',
    lastActivity: 'Incidencia fichaje resuelta',
    indicators: [
      { label: '⭐ Alto rendimiento', variant: 'success' },
      { label: '📎 Pendiente evaluación', variant: 'secondary' },
    ],
    tags: ['Customer love', 'Formadora'],
    manager: 'Ricardo Soler',
  },
  {
    id: 'carla-paredes',
    name: 'Carla Paredes',
    role: 'Nutricionista Clínica',
    location: 'Sede Sur',
    status: 'Congelado',
    contractType: 'Autónomo',
    contractCategory: 'Facturación mensual',
    lastActivity: 'Licencia médica hasta 30/11',
    indicators: [
      { label: '🚨 Ausencia prolongada', variant: 'destructive' },
      { label: '📄 Revisar contrato', variant: 'yellow' },
    ],
    tags: ['Clínica', 'Especialista RCP'],
    manager: 'Servicios clínicos',
  },
];

const EMPLOYEE_DETAILS: Record<string, EmployeeDetail> = {
  'laura-martinez': {
    header: {
      roles: ['Coordinadora Operaciones', 'Formadora Recepción'],
      status: 'Activo',
      contract: 'Contrato indefinido • Nivel 3 convenio fitness',
      schedule: '40h semanales • Jornada completa',
      seniority: 'Antigüedad 3 años',
      cost: 'Coste estimado mensual €2.450',
      manager: 'Reporta a Dirección General',
      tags: ['Líder', 'Formador', 'Clave crossfit'],
    },
    personalData: [
      { label: 'Nombre completo', value: 'Laura Martínez López' },
      { label: 'DNI', value: '12345678L' },
      { label: 'Email', value: 'laura.martinez@gymfit.com' },
      { label: 'Teléfono', value: '+34 600 123 456' },
      { label: 'Sede asignada', value: 'Central + apoyo Sede Norte' },
      { label: 'Último acceso', value: 'Hoy • 07:10' },
    ],
    contractData: [
      { label: 'Tipo de contrato', value: 'Indefinido • Tiempo completo' },
      { label: 'Jornada', value: '40h semanales • L-V' },
      { label: 'Salario base', value: '€2.050' },
      { label: 'Variable media', value: '€400 / mes' },
      { label: 'Puestos permitidos', value: 'Coordinadora, Recepción, Manager fichajes' },
      { label: 'Sede principal', value: 'Central · Calle Mayor 12' },
    ],
    documentation: [
      { label: 'Contrato firmado', status: 'Firmado', updated: 'Actualizado 01/01/2025' },
      { label: 'Anexo variable Q4', status: 'Firmado', updated: 'Firmado 03/10/2025' },
      { label: 'Certificado PRL', status: 'Pendiente', updated: 'Vence 12/2025' },
      { label: 'Curso RCP', status: 'Firmado', updated: 'Actualizado 09/2025' },
    ],
    reminders: [
      { label: 'Revisión salarial', date: '15/12/2025', type: 'info' },
      { label: 'Renovación certificado PRL', date: '10/12/2025', type: 'warning' },
      { label: 'Evaluación desempeño Q4', date: '30/11/2025', type: 'info' },
    ],
    roles: {
      functional: ['Coordinadora Operaciones', 'Responsable fichajes', 'Mentora onboarding'],
      compatible: ['Recepción', 'Gestión turnos', 'Gestión incidencias'],
      permissions: [
        { area: 'Agenda', scope: 'Administrar', critical: true },
        { area: 'Clientes', scope: 'Ver + editar', critical: true },
        { area: 'Finanzas', scope: 'Ver nómina y variables', critical: false },
        { area: 'Marketing', scope: 'Ver campañas', critical: false },
        { area: 'RRHH', scope: 'Gestionar evaluaciones', critical: true },
      ],
      shortcuts: ['Clonar permisos', 'Ver mapa de permisos', 'Cambiar rol funcional'],
    },
    shifts: {
      summary: [
        { label: 'Horas programadas', value: '38h' },
        { label: 'Horas contrato', value: '40h' },
        { label: 'Horas extra', value: '2h (compensar)' },
        { label: 'Descansos', value: 'Miércoles tarde • Domingo' },
      ],
      availability: [
        'Disponible 06:00 - 15:00 L-V',
        'Support remoto sábados',
        'No disponible tardes por formación',
      ],
      conflicts: [
        'Cierre martes coincide con auditoría • reasignar',
        'Vacaciones del equipo recepción semana 47 • cubrir',
      ],
      actions: ['Editar disponibilidad', 'Asignar turno', 'Ver conflictos', 'Exportar resumen horas'],
    },
    attendance: {
      highlights: [
        { label: 'Puntualidad mes', value: '96%' },
        { label: 'Retrasos', value: '1 incidencia leve' },
        { label: 'Ausencias', value: '0 sin justificar' },
      ],
      log: [
        { day: 'Lun 10', checkIn: '05:58', checkOut: '14:12', difference: '+0:12', status: 'A tiempo' },
        {
          day: 'Mar 11',
          checkIn: '06:05',
          checkOut: '14:05',
          difference: '-0:10',
          status: 'Retraso',
          note: 'Reunión externa',
        },
        { day: 'Mié 12', checkIn: '06:00', checkOut: '13:58', difference: '-0:02', status: 'A tiempo' },
        { day: 'Jue 13', checkIn: '05:55', checkOut: '14:20', difference: '+0:25', status: 'A tiempo' },
        { day: 'Vie 14', checkIn: '06:01', checkOut: '14:02', difference: '+0:01', status: 'A tiempo' },
      ],
    },
    payroll: {
      snapshot: [
        { label: 'Nómina noviembre', value: '€2.350' },
        { label: 'Variables aprobadas', value: '€420' },
        { label: 'Estado de payroll', value: 'Procesado' },
      ],
      incidents: [
        'Revisar compensación horas extra Q3',
        'Confirmar bonus mentoring equipo recepción',
      ],
      variables: [
        { concept: 'Bonus objetivos operaciones', amount: '€250', status: 'Pendiente' },
        { concept: 'Incentivo onboarding', amount: '€120', status: 'Aprobado' },
        { concept: 'Horas extra auditoría', amount: '€80', status: 'Revisión' },
      ],
    },
    variables: {
      programs: [
        'Comisión upsell nutrición • 7% neto',
        'Plan incentivo coordinación • Q4',
        'Incentivo retención staff • Semestral',
      ],
      performance: [
        { label: 'Objetivo upsell', progress: '78% cumplido' },
        { label: 'Objetivo retención clientes', progress: '91% cumplido' },
        { label: 'Objetivo mentoring', progress: '100% completado' },
      ],
      actions: ['Añadir variable', 'Configurar esquema comisiones', 'Ver detalle ventas atribuidas'],
    },
    evaluation: {
      overview: [
        { label: 'Última evaluación', value: 'Q3 2025 • Nota 4.6/5' },
        { label: 'Planes de mejora', value: '0 activos' },
        { label: 'Feedbacks recibidos', value: '12 (últimos 30 días)' },
      ],
      history: [
        {
          cycle: 'Q3 2025',
          score: '4.6 / 5',
          focus: 'Liderazgo + coordinación',
          nextStep: 'Mentoring nuevos coordinadores',
        },
        {
          cycle: 'Q2 2025',
          score: '4.4 / 5',
          focus: 'Gestión incidencias fichaje',
          nextStep: 'Plan de automatización fichajes',
        },
      ],
      feedback: [
        'Equipo recepción: liderazgo cercano y resolutivo.',
        'Dirección: proactiva con mejoras de procesos.',
        'Clientes internos: seguimiento impecable de incidencias.',
      ],
    },
    training: {
      courses: [
        { label: 'Programa liderazgo intermedio', detail: 'Completado 2025', status: 'completo' },
        { label: 'Curso analítica operaciones', detail: 'En progreso • 60%', status: 'en-progreso' },
        { label: 'Mentoring interno', detail: 'Asignada a 2 mentees', status: 'completo' },
      ],
      certifications: [
        { name: 'RCP + DEA', validity: 'Válido hasta 09/2026', status: 'Vigente' },
        { name: 'PRL instal. deportivas', validity: 'Vence 12/2025', status: 'Vencimiento cercano' },
        { name: 'Formación acogida', validity: 'Certificada 2024', status: 'Vigente' },
      ],
      reminders: [
        'Configurar recordatorio renovación PRL',
        'Asignar formación avanzada analítica 2026',
      ],
    },
    absences: {
      upcoming: [
        { type: 'Vacaciones', dates: '02-06 Dic', status: 'Aprobada' },
        { type: 'Permiso médico', dates: '15 Ene', status: 'Pendiente', note: 'Revisión rutinaria' },
      ],
      history: [
        { type: 'Vacaciones', dates: 'Agosto 2025', status: 'Registrada' },
        { type: 'Permiso estudios', dates: 'Mayo 2025', status: 'Registrada' },
      ],
      alerts: ['Recordar cobertura recepción semana 49', 'Notificar cambios al equipo mentoring'],
    },
    onboarding: {
      onboardingChecklist: [
        { label: 'Actualizar plan de mentoría', completed: true, owner: 'Laura' },
        { label: 'Revisión protocolos seguridad', completed: true, owner: 'RRHH' },
        { label: 'Asignar formación avanzada', completed: false, owner: 'Operaciones' },
      ],
      offboardingChecklist: [
        { label: 'Plan sucesión coordinador suplente', completed: false, owner: 'Dirección' },
        { label: 'Documentar procesos críticos', completed: true, owner: 'Operaciones' },
        { label: 'Revisar accesos sistemas', completed: false, owner: 'IT' },
      ],
      history: [
        { label: 'Onboarding recepción Q3 2025', detail: '3 perfiles completados', status: 'completo' },
        { label: 'Offboarding Marta P. (recepción)', detail: 'Proceso cerrado 08/2025', status: 'completo' },
        { label: 'Onboarding Diego G.', detail: 'Mentoría 60% avance', status: 'en-progreso' },
      ],
    },
  },
  'diego-gomez': {
    header: {
      roles: ['Entrenador Personal Senior', 'Consultor Ventas PT'],
      status: 'Onboarding',
      contract: 'Contrato indefinido parcial • Nivel 2',
      schedule: '30h semanales • Turnos variables',
      seniority: 'Antigüedad 2 meses',
      cost: 'Coste estimado mensual €1.650',
      manager: 'Reporta a Coordinación Operaciones',
      tags: ['Ventas PT', 'Cross-training'],
    },
    personalData: [
      { label: 'Nombre completo', value: 'Diego Gómez Robles' },
      { label: 'DNI', value: '87654321D' },
      { label: 'Email', value: 'diego.gomez@gymfit.com' },
      { label: 'Teléfono', value: '+34 611 980 234' },
      { label: 'Sede asignada', value: 'Norte (PT) + apoyo Sede Central' },
      { label: 'Último acceso', value: 'Ayer • 21:45' },
    ],
    contractData: [
      { label: 'Tipo de contrato', value: 'Indefinido parcial' },
      { label: 'Jornada', value: '30h semanales • Turnos rotativos' },
      { label: 'Tarifa sesión PT', value: '€35' },
      { label: 'Objetivo mensual ventas', value: '€5.000' },
      { label: 'Roles permitidos', value: 'Entrenador, Mentor PT, Ventas corporativo' },
      { label: 'Sede principal', value: 'Norte · CC FitMall' },
    ],
    documentation: [
      { label: 'Contrato firmado', status: 'Firmado', updated: 'Firmado 01/09/2025' },
      { label: 'Homologación entrenador', status: 'Pendiente', updated: 'Completar 20/11/2025' },
      { label: 'Seguro responsabilidad', status: 'Firmado', updated: 'Actualizado 09/2025' },
      { label: 'Certificado nutrición', status: 'Pendiente', updated: 'En revisión' },
    ],
    reminders: [
      { label: 'Evaluación onboarding día 60', date: '30/11/2025', type: 'warning' },
      { label: 'Certificación homologación', date: '20/11/2025', type: 'warning' },
      { label: 'Formación ventas PT', date: '25/11/2025', type: 'info' },
    ],
    roles: {
      functional: ['Entrenador Personal', 'Consultor ventas PT', 'Instructor workshops'],
      compatible: ['Clases colectivas', 'Eventos corporativos'],
      permissions: [
        { area: 'Agenda', scope: 'Gestionar sesiones PT', critical: true },
        { area: 'Clientes', scope: 'Ver historial + notas', critical: true },
        { area: 'Finanzas', scope: 'Ver variables', critical: false },
        { area: 'RRHH', scope: 'Ver onboarding', critical: false },
      ],
      shortcuts: ['Asignar mentor', 'Clonar permisos de PT senior', 'Ver mapa permisos'],
    },
    shifts: {
      summary: [
        { label: 'Horas programadas', value: '28h' },
        { label: 'Horas contrato', value: '30h' },
        { label: 'Horas extra', value: '1h (formación)' },
        { label: 'Descansos', value: 'Lunes • Viernes tarde' },
      ],
      availability: [
        'Disponible 07:00 - 12:00 y 17:00 - 21:00',
        'No disponible domingos',
        'Disponible eventos corporativos sábados',
      ],
      conflicts: [
        'Solapamiento con clases HIIT martes tarde',
        'Vacaciones PT senior diciembre • preparar cobertura',
      ],
      actions: ['Editar disponibilidad', 'Asignar turno', 'Ver conflictos', 'Exportar resumen horas'],
    },
    attendance: {
      highlights: [
        { label: 'Puntualidad mes', value: '88%' },
        { label: 'Retrasos', value: '3 incidencias leves' },
        { label: 'Ausencias', value: '1 justificada' },
      ],
      log: [
        { day: 'Lun 10', checkIn: '07:15', checkOut: '13:00', difference: '+0:45', status: 'Retraso', note: 'Transporte' },
        { day: 'Mar 11', checkIn: '07:00', checkOut: '13:30', difference: '+0:30', status: 'A tiempo' },
        { day: 'Mié 12', checkIn: '16:55', checkOut: '21:05', difference: '+0:10', status: 'A tiempo' },
        { day: 'Jue 13', checkIn: '07:05', checkOut: '12:45', difference: '-0:20', status: 'Retraso' },
        { day: 'Vie 14', checkIn: '-', checkOut: '-', difference: '—', status: 'Ausencia', note: 'Formación externa' },
      ],
    },
    payroll: {
      snapshot: [
        { label: 'Nómina noviembre', value: '€1.320' },
        { label: 'Variables aprobadas', value: '€530' },
        { label: 'Estado de payroll', value: 'Pendiente cierre' },
      ],
      incidents: [
        'Validar horas formación externa',
        'Cruzar comisión corporate con ventas CRM',
      ],
      variables: [
        { concept: 'Comisión ventas PT', amount: '€420', status: 'Pendiente' },
        { concept: 'Bonus onboarding', amount: '€80', status: 'Aprobado' },
        { concept: 'Clases sustitución', amount: '€110', status: 'Revisión' },
      ],
    },
    variables: {
      programs: [
        'Comisión PT recurrente • 10%',
        'Programa corporativo B2B • Bonus por cierre',
        'Incentivo upsell nutrición • 5%',
      ],
      performance: [
        { label: 'Objetivo ventas PT', progress: '74% cumplimiento' },
        { label: 'Satisfacción clientes', progress: '4.7 / 5' },
        { label: 'Onboarding completado', progress: '60% checklist' },
      ],
      actions: ['Añadir variable', 'Configurar esquema comisiones', 'Enviar resumen al empleado'],
    },
    evaluation: {
      overview: [
        { label: 'Evaluación onboarding', value: 'En progreso • Día 60' },
        { label: 'Feedback clientes', value: '4.6 / 5' },
        { label: 'Mentor asignado', value: 'Laura Martínez' },
      ],
      history: [
        {
          cycle: 'Onboarding día 30',
          score: '4.2 / 5',
          focus: 'Adaptación cultura y procesos',
          nextStep: 'Refuerzo puntualidad + checklists',
        },
      ],
      feedback: [
        'Clientes PT: destaca empatía y seguimiento.',
        'Coordinación: mejorar puntualidad mañanas.',
        'Mentor: avanza rápido en procesos internos.',
      ],
    },
    training: {
      courses: [
        { label: 'Formación metodología Gymfit', detail: 'Completado 09/2025', status: 'completo' },
        { label: 'Ventas consultivas PT', detail: 'En progreso 70%', status: 'en-progreso' },
        { label: 'Workshop nutrición avanzada', detail: 'Programado 25/11', status: 'pendiente' },
      ],
      certifications: [
        { name: 'RCP + DEA', validity: 'Válido hasta 03/2026', status: 'Vigente' },
        { name: 'Homologación entrenador', validity: 'Pendiente examen 20/11', status: 'Vencimiento cercano' },
      ],
      reminders: ['Subir certificado homologación', 'Registrar sesiones shadowing'],
    },
    absences: {
      upcoming: [
        { type: 'Vacaciones', dates: 'No planificadas', status: 'Pendiente' },
        { type: 'Permiso formación', dates: '14 Dic', status: 'Pendiente', note: 'Workshop movilidad' },
      ],
      history: [
        { type: 'Licencia estudios', dates: 'Octubre 2025', status: 'Registrada' },
      ],
      alerts: ['Revisar cobertura clases HIIT martes', 'Actualizar estado formación externa'],
    },
    onboarding: {
      onboardingChecklist: [
        { label: 'Crear usuario ERP', completed: true, owner: 'IT' },
        { label: 'Asignar formación inicial', completed: true, owner: 'Operaciones' },
        { label: 'Completar shadowing PT', completed: false, owner: 'Mentor' },
        { label: 'Entregar protocolos', completed: true, owner: 'RRHH' },
      ],
      offboardingChecklist: [
        { label: 'Revisión accesos', completed: false, owner: 'IT' },
        { label: 'Encuesta salida', completed: false, owner: 'RRHH' },
      ],
      history: [
        { label: 'Ingreso 01/09/2025', detail: 'Checklist 60% completado', status: 'en-progreso' },
        { label: 'Shadowing PT senior', detail: '3 de 5 sesiones completadas', status: 'en-progreso' },
      ],
    },
  },
  'marta-ruiz': {
    header: {
      roles: ['Recepción Senior', 'Gestora experiencias'],
      status: 'Activo',
      contract: 'Contrato indefinido • Nivel 1',
      schedule: '35h semanales • Turnos rotativos',
      seniority: 'Antigüedad 4 años',
      cost: 'Coste estimado mensual €1.950',
      manager: 'Reporta a Coordinación Recepción',
      tags: ['Customer love', 'Formadora'],
    },
    personalData: [
      { label: 'Nombre completo', value: 'Marta Ruiz Ortega' },
      { label: 'DNI', value: '11223344M' },
      { label: 'Email', value: 'marta.ruiz@gymfit.com' },
      { label: 'Teléfono', value: '+34 622 450 980' },
      { label: 'Sede asignada', value: 'Central • Cobertura eventual Norte' },
      { label: 'Último acceso', value: 'Hoy • 06:10' },
    ],
    contractData: [
      { label: 'Tipo de contrato', value: 'Indefinido' },
      { label: 'Jornada', value: '35h • Turnos mañana / tarde' },
      { label: 'Salario base', value: '€1.500' },
      { label: 'Variable media', value: '€280 / mes' },
      { label: 'Puestos permitidos', value: 'Recepción, Ventas retail, CRM básico' },
      { label: 'Sede principal', value: 'Central' },
    ],
    documentation: [
      { label: 'Contrato firmado', status: 'Firmado', updated: 'Actualizado 03/2024' },
      { label: 'Anexo variables retail', status: 'Firmado', updated: 'Renovado 01/2025' },
      { label: 'Certificado PRL', status: 'Firmado', updated: 'Validado 05/2025' },
      { label: 'Curso RCP', status: 'Pendiente', updated: 'Programar 12/2025' },
    ],
    reminders: [
      { label: 'Evaluación desempeño anual', date: '05/12/2025', type: 'info' },
      { label: 'Renovación curso RCP', date: '20/12/2025', type: 'warning' },
    ],
    roles: {
      functional: ['Recepción Senior', 'Gestión incidencias clientes'],
      compatible: ['Ventas retail', 'Formación nuevos recepcionistas'],
      permissions: [
        { area: 'Agenda', scope: 'Gestionar reservas', critical: true },
        { area: 'Clientes', scope: 'Editar datos de contacto', critical: true },
        { area: 'Finanzas', scope: 'Registrar cobros retail', critical: false },
        { area: 'RRHH', scope: 'Ver turnos', critical: false },
      ],
      shortcuts: ['Clonar permisos', 'Ver mapa permisos', 'Cambiar rol funcional'],
    },
    shifts: {
      summary: [
        { label: 'Horas programadas', value: '36h' },
        { label: 'Horas contrato', value: '35h' },
        { label: 'Horas extra', value: '1h' },
        { label: 'Descansos', value: 'Sábado tarde • Domingo' },
      ],
      availability: [
        'Disponible turnos mañana 06:00 - 14:00',
        'Tardes disponibles lunes y miércoles',
        'No disponible sábados noche',
      ],
      conflicts: [
        'Solicita intercambio turno 22/11',
        'Formación nuevos recepcionistas 18/11',
      ],
      actions: ['Editar disponibilidad', 'Asignar turno', 'Ver conflictos', 'Exportar resumen horas'],
    },
    attendance: {
      highlights: [
        { label: 'Puntualidad mes', value: '98%' },
        { label: 'Retrasos', value: '0 incidencias' },
        { label: 'Ausencias', value: '1 justificada' },
      ],
      log: [
        { day: 'Lun 10', checkIn: '05:55', checkOut: '13:55', difference: '+0:15', status: 'A tiempo' },
        { day: 'Mar 11', checkIn: '05:58', checkOut: '14:05', difference: '+0:07', status: 'A tiempo' },
        { day: 'Mié 12', checkIn: '12:55', checkOut: '20:05', difference: '+0:10', status: 'A tiempo' },
        { day: 'Jue 13', checkIn: '06:02', checkOut: '14:01', difference: '+0:01', status: 'A tiempo' },
        { day: 'Vie 14', checkIn: '06:00', checkOut: '13:58', difference: '-0:02', status: 'A tiempo' },
      ],
    },
    payroll: {
      snapshot: [
        { label: 'Nómina noviembre', value: '€1.780' },
        { label: 'Variables aprobadas', value: '€260' },
        { label: 'Estado de payroll', value: 'Procesado' },
      ],
      incidents: ['Validar comisión retail Black Friday', 'Cruzar incentivos captación'],
      variables: [
        { concept: 'Comisión retail', amount: '€180', status: 'Aprobado' },
        { concept: 'Incentivo captación', amount: '€80', status: 'Pendiente' },
      ],
    },
    variables: {
      programs: [
        'Comisión retail • 4%',
        'Incentivo captación socios • por tramos',
        'Bonus atención al cliente • trimestral',
      ],
      performance: [
        { label: 'Objetivo conversiones', progress: '85% cumplimiento' },
        { label: 'NPS recepción', progress: '4.8 / 5' },
        { label: 'Formación nuevos hires', progress: '100% completado' },
      ],
      actions: ['Añadir variable', 'Ver detalle ventas atribuidas', 'Enviar resumen al empleado'],
    },
    evaluation: {
      overview: [
        { label: 'Última evaluación', value: 'Abril 2025 • 4.7/5' },
        { label: 'Planes de mejora', value: '1 (cross-selling)' },
        { label: 'Feedbacks recibidos', value: '8 últimos 30 días' },
      ],
      history: [
        {
          cycle: 'Abr 2025',
          score: '4.7 / 5',
          focus: 'Experiencia cliente',
          nextStep: 'Implementar playbook CRM',
        },
        {
          cycle: 'Nov 2024',
          score: '4.5 / 5',
          focus: 'Ventas retail',
          nextStep: 'Formación upsell nutrición',
        },
      ],
      feedback: [
        'Clientes: atención sobresaliente en picos.',
        'Dirección: lidera mejoras CRM recepción.',
      ],
    },
    training: {
      courses: [
        { label: 'Customer Success Gymfit', detail: 'Completado 2024', status: 'completo' },
        { label: 'CRM Avanzado', detail: 'Completado 2025', status: 'completo' },
        { label: 'Formación liderazgo recepción', detail: 'Programado 12/2025', status: 'pendiente' },
      ],
      certifications: [
        { name: 'RCP + DEA', validity: 'Vence 12/2025', status: 'Vencimiento cercano' },
        { name: 'Prevención riesgos básicos', validity: 'Válido hasta 05/2026', status: 'Vigente' },
      ],
      reminders: ['Registrar curso liderazgo', 'Subir certificado RCP tras renovación'],
    },
    absences: {
      upcoming: [
        { type: 'Vacaciones', dates: '23-27 Dic', status: 'Aprobada' },
        { type: 'Permuta turno', dates: '22 Nov', status: 'Pendiente', note: 'Cambio con Sara L.' },
      ],
      history: [
        { type: 'Vacaciones', dates: 'Julio 2025', status: 'Registrada' },
        { type: 'Permiso médico', dates: 'Feb 2025', status: 'Registrada' },
      ],
      alerts: ['Revisar cobertura navidad', 'Notificar a equipo de turnos'],
    },
    onboarding: {
      onboardingChecklist: [
        { label: 'Actualizar guías recepción', completed: true, owner: 'Marta' },
        { label: 'Mentoría nuevos hires', completed: true, owner: 'RRHH' },
        { label: 'Implementar script CRM', completed: false, owner: 'Operaciones' },
      ],
      offboardingChecklist: [
        { label: 'Documentar procesos', completed: true, owner: 'Recepción' },
        { label: 'Revisión accesos', completed: false, owner: 'IT' },
      ],
      history: [
        { label: 'Onboarding Sara L.', detail: 'Checklist completado 09/2025', status: 'completo' },
        { label: 'Formación interna CRM', detail: 'Finalizado 08/2025', status: 'completo' },
      ],
    },
  },
  'carla-paredes': {
    header: {
      roles: ['Nutricionista Clínica', 'Responsable protocolos salud'],
      status: 'Congelado',
      contract: 'Colaboración autónoma • Facturación mensual',
      schedule: 'Sesiones bajo demanda • 20h/mes',
      seniority: 'Antigüedad 1 año',
      cost: 'Coste estimado mensual €1.120',
      manager: 'Reporta a Servicios clínicos',
      tags: ['Clínica', 'Especialista RCP'],
    },
    personalData: [
      { label: 'Nombre completo', value: 'Carla Paredes Álvarez' },
      { label: 'NIF', value: 'X1234567C' },
      { label: 'Email', value: 'carla.paredes@gymfit.com' },
      { label: 'Teléfono', value: '+34 699 102 347' },
      { label: 'Sede asignada', value: 'Sur • Consultas online' },
      { label: 'Último acceso', value: 'Hace 12 días' },
    ],
    contractData: [
      { label: 'Tipo de contrato', value: 'Autónomo • Colaboración' },
      { label: 'Tarifa consulta', value: '€55 sesión' },
      { label: 'Objetivo mensual', value: '18 sesiones' },
      { label: 'Servicios autorizados', value: 'Nutrición deportiva, clínica, seguimiento online' },
      { label: 'Sede principal', value: 'Sur' },
    ],
    documentation: [
      { label: 'Contrato colaboración', status: 'Firmado', updated: 'Actualizado 05/2025' },
      { label: 'Seguro RC', status: 'Firmado', updated: 'Vence 05/2026' },
      { label: 'Colegiación', status: 'Firmado', updated: 'Válido 2025' },
      { label: 'Baja médica', status: 'Pendiente', updated: 'Adjuntar parte final' },
    ],
    reminders: [
      { label: 'Revisión médica reincorporación', date: '30/11/2025', type: 'warning' },
      { label: 'Renovación contrato', date: '15/01/2026', type: 'info' },
    ],
    roles: {
      functional: ['Nutricionista Clínica', 'Gestión protocolos salud'],
      compatible: ['Formación staff', 'Charlas clínicas'],
      permissions: [
        { area: 'Clientes', scope: 'Ver historial clínico', critical: true },
        { area: 'Agenda', scope: 'Gestionar citas nutrición', critical: true },
        { area: 'Finanzas', scope: 'Ver facturación', critical: false },
      ],
      shortcuts: ['Suspender accesos temporales', 'Ver mapa permisos', 'Clonar permisos'],
    },
    shifts: {
      summary: [
        { label: 'Sesiones programadas', value: '12' },
        { label: 'Objetivo mensual', value: '18' },
        { label: 'Disponibilidad', value: 'Suspendida hasta 30/11' },
        { label: 'Cobertura', value: 'Requiere sustitución sábados' },
      ],
      availability: [
        'Disponible Miércoles y Sábados (post licencia)',
        'Teleconsulta lunes tarde',
      ],
      conflicts: ['Licencia médica • 01/10 al 30/11', 'Sesiones sábado sin cobertura'],
      actions: ['Asignar sustituto', 'Reprogramar pacientes', 'Actualizar disponibilidad'],
    },
    attendance: {
      highlights: [
        { label: 'Sesiones cumplidas', value: 'Suspendidas' },
        { label: 'Pacientes activos', value: '22 en seguimiento' },
        { label: 'Incidencias', value: 'Alertas reprogramación' },
      ],
      log: [
        { day: 'Septiembre', checkIn: '-', checkOut: '-', difference: '—', status: 'Ausencia', note: 'Licencia médica' },
      ],
    },
    payroll: {
      snapshot: [
        { label: 'Facturación octubre', value: '€0 (licencia)' },
        { label: 'Variables aprobadas', value: '€0' },
        { label: 'Estado pagos', value: 'Congelado' },
      ],
      incidents: ['Regularizar pagos durante baja', 'Actualizar facturación noviembre'],
      variables: [
        { concept: 'Bonus captación', amount: '€150', status: 'Pendiente' },
      ],
    },
    variables: {
      programs: [
        'Incentivo extensión planes nutrición • 12%',
        'Programa recetas personalizadas • Pago por paquete',
      ],
      performance: [
        { label: 'Objetivo pacientes activos', progress: '62% durante licencia' },
        { label: 'Satisfacción pacientes', progress: '4.9 / 5' },
      ],
      actions: ['Revisar esquema al volver', 'Enviar resumen al empleado'],
    },
    evaluation: {
      overview: [
        { label: 'Última evaluación', value: 'Jun 2025 • 4.8/5' },
        { label: 'Planes abiertos', value: 'Plan reintegro tras baja' },
      ],
      history: [
        {
          cycle: 'Jun 2025',
          score: '4.8 / 5',
          focus: 'Protocolos salud',
          nextStep: 'Documentar procesos clínicas',
        },
      ],
      feedback: ['Pacientes con NPS 4.9', 'Equipo clínico: referente en formación'],
    },
    training: {
      courses: [
        { label: 'Actualización nutrición deportiva', detail: 'Completado 2025', status: 'completo' },
        { label: 'Formación telemedicina', detail: 'Programado tras reincorporación', status: 'pendiente' },
      ],
      certifications: [
        { name: 'Colegiación', validity: '2025', status: 'Vigente' },
        { name: 'Seguro RC', validity: 'Vence 05/2026', status: 'Vigente' },
      ],
      reminders: ['Configurar recordatorio retorno', 'Actualizar protocolos salud'],
    },
    absences: {
      upcoming: [
        { type: 'Baja médica', dates: 'Hasta 30/11', status: 'Registrada' },
      ],
      history: [
        { type: 'Vacaciones', dates: 'Junio 2025', status: 'Registrada' },
      ],
      alerts: [
        'Ver impacto en turnos nutrición',
        'Notificar pacientes sobre reprogramación',
      ],
    },
    onboarding: {
      onboardingChecklist: [
        { label: 'Activar accesos tras baja', completed: false, owner: 'IT' },
        { label: 'Plan retorno pacientes', completed: false, owner: 'Clínica' },
      ],
      offboardingChecklist: [
        { label: 'Bloquear accesos (temporal)', completed: true, owner: 'IT' },
        { label: 'Recoger llaves', completed: true, owner: 'RRHH' },
      ],
      history: [
        { label: 'Onboarding 2024', detail: 'Proceso completado', status: 'completo' },
        { label: 'Seguimiento baja', detail: 'Control quincenal', status: 'en-progreso' },
      ],
    },
  },
};

const TAB_ITEMS: TabItem[] = [
  { id: 'datos', label: 'Datos & Contrato', icon: <FileText className="h-4 w-4" /> },
  { id: 'roles', label: 'Roles & Permisos', icon: <Layers className="h-4 w-4" /> },
  { id: 'turnos', label: 'Turnos & Disponibilidad', icon: <CalendarClock className="h-4 w-4" /> },
  { id: 'fichajes', label: 'Fichajes & Asistencia', icon: <Clock className="h-4 w-4" /> },
  { id: 'variables', label: 'Variables & Pagos', icon: <FileSpreadsheet className="h-4 w-4" /> },
  { id: 'evaluacion', label: 'Evaluación & Objetivos', icon: <Target className="h-4 w-4" /> },
  { id: 'formacion', label: 'Formación & Certificaciones', icon: <GraduationCap className="h-4 w-4" /> },
  { id: 'ausencias', label: 'Ausencias & Solicitudes', icon: <CalendarCheck className="h-4 w-4" /> },
  { id: 'onboarding', label: 'Onboarding & Offboarding', icon: <ClipboardList className="h-4 w-4" /> },
];

function renderEmployeeStatus(status: EmployeeStatus) {
  const variants: Record<EmployeeStatus, { variant: 'success' | 'blue' | 'destructive' | 'yellow'; label: string }> = {
    Activo: { variant: 'success', label: 'Activo' },
    Onboarding: { variant: 'blue', label: 'Onboarding' },
    Baja: { variant: 'destructive', label: 'Baja' },
    Congelado: { variant: 'yellow', label: 'Congelado' },
  };
  const config = variants[status];
  return (
    <Badge variant={config.variant} size="sm">
      {config.label}
    </Badge>
  );
}

function renderBadgeByStatus(status: 'Firmado' | 'Pendiente' | 'Vencido') {
  const variant = status === 'Firmado' ? 'success' : status === 'Pendiente' ? 'yellow' : 'destructive';
  return (
    <Badge variant={variant} size="sm">
      {status}
    </Badge>
  );
}

function renderCertificationStatus(status: CertificationItem['status']) {
  const variant =
    status === 'Vigente' ? 'success' : status === 'Caducada' ? 'destructive' : 'yellow';
  return (
    <Badge variant={variant} size="sm">
      {status}
    </Badge>
  );
}

function renderAbsenceStatus(status: AbsenceItem['status']) {
  const variant =
    status === 'Aprobada' ? 'success' : status === 'Pendiente' ? 'yellow' : 'secondary';
  return (
    <Badge variant={variant} size="sm">
      {status}
    </Badge>
  );
}

function renderVariableStatus(status: VariableItem['status']) {
  const variant =
    status === 'Aprobado' ? 'success' : status === 'Pendiente' ? 'yellow' : 'secondary';
  return (
    <Badge variant={variant} size="sm">
      {status}
    </Badge>
  );
}

function renderTimelineStatus(status: TimelineItem['status']) {
  const variant =
    status === 'completo' ? 'success' : status === 'en-progreso' ? 'yellow' : 'secondary';
  const label = status === 'completo' ? 'Completado' : status === 'en-progreso' ? 'En progreso' : 'Pendiente';
  return (
    <Badge variant={variant} size="sm">
      {label}
    </Badge>
  );
}

export function EquipoRRHHPage() {
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string>(EMPLOYEES[0]?.id ?? '');
  const [activeTab, setActiveTab] = useState<string>('datos');
  const selectedEmployeeDetail =
    EMPLOYEE_DETAILS[selectedEmployeeId] ?? EMPLOYEE_DETAILS[EMPLOYEES[0]?.id ?? ''];
  const selectedEmployeeSummary =
    EMPLOYEES.find(employee => employee.id === selectedEmployeeId) ?? EMPLOYEES[0];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 pb-12">
      <header className="border-b border-slate-200/70 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/70">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-6 py-10 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-3">
              <Badge variant="blue" size="md" leftIcon={<BadgeCheck className="h-4 w-4" />}>
                Equipo & RRHH
              </Badge>
              <h1 className="text-3xl font-extrabold text-slate-900 md:text-4xl">
                “Quién trabaja aquí, qué hace y si estamos cubiertos”
              </h1>
              <p className="max-w-2xl text-sm text-slate-600 md:text-base">
                Centraliza contratos, roles, turnos, fichajes, variables, evaluaciones, formación y procesos de onboarding
                desde una única ficha 360º por empleado.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button variant="secondary" leftIcon={<UserPlus className="h-4 w-4" />}>
                Añadir empleado
              </Button>
              <Button variant="ghost" leftIcon={<Upload className="h-4 w-4" />}>
                Importar equipo
              </Button>
              <Button variant="ghost" leftIcon={<Settings className="h-4 w-4" />}>
                Configurar políticas RRHH
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 pt-10 sm:px-6 lg:px-8">
        <section className="space-y-8">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {TOP_KPIS.map(metric => (
              <Card
                key={metric.id}
                padding="lg"
                className="relative overflow-hidden border border-slate-200/60 bg-white"
              >
                <div className="flex items-center gap-3">
                  <div className="rounded-xl bg-slate-100 p-3 text-slate-600">
                    <metric.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{metric.label}</p>
                    <p className="text-2xl font-extrabold text-slate-900">{metric.value}</p>
                  </div>
                </div>
                <p className="mt-3 text-sm text-slate-600">{metric.helper}</p>
              </Card>
            ))}
          </div>

          <Card padding="lg" className="border border-slate-200/60 bg-white">
            <div className="flex flex-wrap items-center justify-between gap-6">
              <div className="space-y-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Filtros rápidos</p>
                <div className="flex flex-wrap gap-4">
                  {FILTER_GROUPS.map(group => (
                    <div key={group.label} className="space-y-2">
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{group.label}</p>
                      <div className="flex flex-wrap gap-2">
                        {group.options.map(option => (
                          <Badge key={option} variant="secondary" size="sm" className="cursor-pointer hover:bg-slate-200/80">
                            {option}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Mostrar</p>
                <div className="flex flex-wrap gap-2">
                  {QUICK_FILTERS.map(filter => (
                    <Badge key={filter} variant="blue" size="sm" className="cursor-pointer bg-blue-100 text-blue-700">
                      {filter}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </Card>

          <div className="flex flex-wrap gap-3">
            {GLOBAL_ACTIONS.map(action => (
              <Button key={action.id} variant="ghost" size="sm" leftIcon={<action.icon className="h-4 w-4" />}>
                {action.label}
              </Button>
            ))}
          </div>
        </section>

        <section className="mt-10 grid gap-6 lg:grid-cols-[320px_minmax(0,1fr)_320px]">
          <div className="space-y-6">
            <Card padding="lg" className="border border-slate-200/60 bg-white">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Listado del equipo</h2>
                <Badge variant="secondary" size="sm">
                  {EMPLOYEES.length} perfiles
                </Badge>
              </div>
              <div className="mt-4">
                <Input placeholder="Buscar por nombre, rol o sede" leftIcon={<Users className="h-4 w-4" />} />
              </div>
              <div className="mt-6 space-y-3">
                {EMPLOYEES.map(employee => {
                  const isSelected = employee.id === selectedEmployeeId;
                  return (
                    <Card
                      key={employee.id}
                      onClick={() => setSelectedEmployeeId(employee.id)}
                      padding="lg"
                      variant="hover"
                      className={`w-full text-left transition ${
                        isSelected ? 'border border-blue-300 bg-blue-50/60' : 'border border-slate-200/60 bg-slate-50/60'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-sm font-semibold text-blue-600">
                            {employee.name
                              .split(' ')
                              .map(part => part[0])
                              .join('')
                              .slice(0, 2)}
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-slate-900">{employee.name}</p>
                            <p className="text-xs text-slate-500">{employee.role}</p>
                          </div>
                        </div>
                        {renderEmployeeStatus(employee.status)}
                      </div>
                      <div className="mt-3 space-y-2 text-xs text-slate-600">
                        <p className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-slate-400" />
                          {employee.location}
                        </p>
                        <p>
                          {employee.contractType} • {employee.contractCategory}
                        </p>
                        <p>{employee.lastActivity}</p>
                      </div>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {employee.indicators.map(indicator => (
                          <Badge key={indicator.label} variant={indicator.variant} size="sm">
                            {indicator.label}
                          </Badge>
                        ))}
                      </div>
                      <div className="mt-3 flex flex-wrap gap-2 text-xs text-slate-500">
                        {employee.tags.map(tag => (
                          <Badge key={tag} variant="gray" size="sm">
                            #{tag}
                          </Badge>
                        ))}
                      </div>
                      <div className="mt-4 flex flex-wrap gap-2">
                        <Button variant="ghost" size="sm" leftIcon={<CalendarClock className="h-4 w-4" />}>
                          Turnos
                        </Button>
                        <Button variant="ghost" size="sm" leftIcon={<Clock className="h-4 w-4" />}>
                          Fichajes
                        </Button>
                        <Button variant="ghost" size="sm" leftIcon={<MessageCircle className="h-4 w-4" />}>
                          Mensaje
                        </Button>
                        <Button variant="ghost" size="sm" leftIcon={<FileText className="h-4 w-4" />}>
                          Contrato
                        </Button>
                      </div>
                    </Card>
                  );
                })}
              </div>
            </Card>
          </div>

          <div className="space-y-6">
            <Card padding="lg" className="border border-slate-200/70 bg-white">
              <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  <div className="flex items-start gap-4">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-500/10 text-lg font-bold text-blue-600">
                      {selectedEmployeeSummary?.name
                        .split(' ')
                        .map(part => part[0])
                        .join('')
                        .slice(0, 2)}
                    </div>
                    <div className="space-y-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <h2 className="text-2xl font-bold text-slate-900">{selectedEmployeeSummary?.name}</h2>
                        {selectedEmployeeSummary ? renderEmployeeStatus(selectedEmployeeSummary.status) : null}
                      </div>
                      <p className="text-sm text-slate-600">{selectedEmployeeDetail?.header.contract}</p>
                      <div className="flex flex-wrap gap-2 text-sm text-slate-600">
                        <span className="flex items-center gap-2">
                          <Layers className="h-4 w-4 text-slate-400" />
                          {selectedEmployeeDetail?.header.roles.join(' • ')}
                        </span>
                        <span className="hidden h-4 w-px bg-slate-200 lg:block" />
                        <span className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-slate-400" />
                          {selectedEmployeeDetail?.header.schedule}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-3 text-xs text-slate-500">
                        <span>Antigüedad: {selectedEmployeeDetail?.header.seniority}</span>
                        <span className="hidden h-3 w-px bg-slate-200 md:block" />
                        <span>Coste estimado: {selectedEmployeeDetail?.header.cost}</span>
                        <span className="hidden h-3 w-px bg-slate-200 md:block" />
                        <span>Manager: {selectedEmployeeDetail?.header.manager}</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {selectedEmployeeDetail?.header.tags.map(tag => (
                          <Badge key={tag} variant="blue" size="sm">
                            #{tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Button variant="secondary" size="sm" leftIcon={<UserCog className="h-4 w-4" />}>
                      Editar datos
                    </Button>
                    <Button variant="ghost" size="sm" leftIcon={<MessageCircle className="h-4 w-4" />}>
                      Enviar mensaje
                    </Button>
                    <Button variant="ghost" size="sm" leftIcon={<CalendarClock className="h-4 w-4" />}>
                      Ver turnos
                    </Button>
                    <Button variant="ghost" size="sm" leftIcon={<Clock className="h-4 w-4" />}>
                      Ver fichajes
                    </Button>
                    <Button variant="ghost" size="sm" leftIcon={<FileSpreadsheet className="h-4 w-4" />}>
                      Ver nómina & variables
                    </Button>
                    <Button variant="ghost" size="sm" leftIcon={<ClipboardCheck className="h-4 w-4" />}>
                      Iniciar evaluación
                    </Button>
                    <Button variant="ghost" size="sm" leftIcon={<ListChecks className="h-4 w-4" />}>
                      Onboarding / Offboarding
                    </Button>
                    <Button variant="ghost" size="sm" leftIcon={<ShieldCheck className="h-4 w-4" />}>
                      Desactivar empleado
                    </Button>
                  </div>
                </div>
                <Tabs items={TAB_ITEMS} activeTab={activeTab} onTabChange={setActiveTab} variant="underline" />
              </div>
            </Card>

            <div className="space-y-6">
              {activeTab === 'datos' && selectedEmployeeDetail && (
                <>
                  <Card padding="lg" className="border border-slate-200/60 bg-white">
                    <h3 className="text-lg font-semibold text-slate-900">Datos personales & contacto</h3>
                    <div className="mt-4 grid gap-4 md:grid-cols-2">
                      {selectedEmployeeDetail.personalData.map(item => (
                        <div key={item.label} className="space-y-1 rounded-xl bg-slate-50/80 p-4">
                          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{item.label}</p>
                          <p className="text-sm font-medium text-slate-900">{item.value}</p>
                        </div>
                      ))}
                    </div>
                    <div className="mt-6 flex flex-wrap gap-3">
                      <Button variant="secondary" size="sm" leftIcon={<Mail className="h-4 w-4" />}>
                        Enviar credenciales
                      </Button>
                      <Button variant="ghost" size="sm" leftIcon={<CheckCircle2 className="h-4 w-4" />}>
                        Confirmar datos
                      </Button>
                    </div>
                  </Card>

                  <Card padding="lg" className="border border-slate-200/60 bg-white">
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-slate-900">Contrato & puestos</h3>
                        <p className="text-sm text-slate-600">
                          Gestiona jornadas, salarios y roles habilitados para el empleado.
                        </p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <Button variant="secondary" size="sm">
                          Actualizar contrato
                        </Button>
                        <Button variant="ghost" size="sm">
                          Configurar avisos
                        </Button>
                      </div>
                    </div>
                    <div className="mt-6 grid gap-4 md:grid-cols-2">
                      {selectedEmployeeDetail.contractData.map(item => (
                        <div key={item.label} className="space-y-1 rounded-xl bg-slate-50/80 p-4">
                          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{item.label}</p>
                          <p className="text-sm font-medium text-slate-900">{item.value}</p>
                        </div>
                      ))}
                    </div>
                  </Card>

                  <Card padding="lg" className="border border-slate-200/60 bg-white">
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-slate-900">Documentación & vencimientos</h3>
                        <p className="text-sm text-slate-600">
                          Mantén contratos, anexos y certificados siempre actualizados.
                        </p>
                      </div>
                      <Button variant="secondary" size="sm">
                        Subir documento
                      </Button>
                    </div>
                    <div className="mt-6 space-y-3">
                      {selectedEmployeeDetail.documentation.map(doc => (
                        <div
                          key={doc.label}
                          className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200/60 bg-slate-50/70 p-4"
                        >
                          <div>
                            <p className="text-sm font-semibold text-slate-900">{doc.label}</p>
                            <p className="text-xs text-slate-500">{doc.updated}</p>
                          </div>
                          {renderBadgeByStatus(doc.status)}
                        </div>
                      ))}
                    </div>
                    <div className="mt-6 grid gap-3 md:grid-cols-3">
                      {selectedEmployeeDetail.reminders.map(reminder => (
                        <div
                          key={reminder.label}
                          className="space-y-1 rounded-xl border border-slate-200/60 bg-white p-4"
                        >
                          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                            {reminder.label}
                          </p>
                          <p className="text-sm font-medium text-slate-900">{reminder.date}</p>
                          <Badge
                            variant={
                              reminder.type === 'warning'
                                ? 'yellow'
                                : reminder.type === 'success'
                                ? 'success'
                                : 'blue'
                            }
                            size="sm"
                          >
                            {reminder.type === 'warning'
                              ? 'Revisar'
                              : reminder.type === 'info'
                              ? 'Planificado'
                              : 'OK'}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </Card>
                </>
              )}

              {activeTab === 'roles' && selectedEmployeeDetail && (
                <>
                  <Card padding="lg" className="border border-slate-200/60 bg-white">
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-slate-900">Roles funcionales</h3>
                        <p className="text-sm text-slate-600">
                          Determina qué funciones puede desempeñar y qué sedes están habilitadas.
                        </p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <Button variant="secondary" size="sm">
                          Cambiar rol
                        </Button>
                        <Button variant="ghost" size="sm">
                          Clonar permisos
                        </Button>
                      </div>
                    </div>
                    <div className="mt-6 grid gap-4 md:grid-cols-2">
                      <div className="space-y-2 rounded-xl bg-slate-50/80 p-4">
                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Roles activos</p>
                        <ul className="space-y-1 text-sm text-slate-700">
                          {selectedEmployeeDetail.roles.functional.map(role => (
                            <li key={role}>• {role}</li>
                          ))}
                        </ul>
                      </div>
                      <div className="space-y-2 rounded-xl bg-slate-50/80 p-4">
                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Puestos compatibles</p>
                        <ul className="space-y-1 text-sm text-slate-700">
                          {selectedEmployeeDetail.roles.compatible.map(role => (
                            <li key={role}>• {role}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </Card>

                  <Card padding="lg" className="border border-slate-200/60 bg-white">
                    <h3 className="text-lg font-semibold text-slate-900">Permisos de sistema</h3>
                    <div className="mt-4 space-y-3">
                      {selectedEmployeeDetail.roles.permissions.map(permission => (
                        <div
                          key={permission.area}
                          className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200/60 bg-slate-50/70 p-4"
                        >
                          <div>
                            <p className="text-sm font-semibold text-slate-900">{permission.area}</p>
                            <p className="text-xs text-slate-500">{permission.scope}</p>
                          </div>
                          <Badge variant={permission.critical ? 'success' : 'secondary'} size="sm">
                            {permission.critical ? 'Crítico' : 'Controlado'}
                          </Badge>
                        </div>
                      ))}
                    </div>
                    <div className="mt-6 flex flex-wrap gap-2">
                      {selectedEmployeeDetail.roles.shortcuts.map(action => (
                        <Button key={action} variant="ghost" size="sm">
                          {action}
                        </Button>
                      ))}
                    </div>
                  </Card>
                </>
              )}

              {activeTab === 'turnos' && selectedEmployeeDetail && (
                <>
                  <Card padding="lg" className="border border-slate-200/60 bg-white">
                    <div className="flex flex-col gap-2">
                      <h3 className="text-lg font-semibold text-slate-900">Resumen semanal</h3>
                      <p className="text-sm text-slate-600">
                        Evalúa la carga de trabajo respecto a contrato y detecta horas extra o huecos.
                      </p>
                    </div>
                    <div className="mt-4 grid gap-4 md:grid-cols-2">
                      {selectedEmployeeDetail.shifts.summary.map(entry => (
                        <div key={entry.label} className="rounded-xl bg-slate-50/80 p-4">
                          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{entry.label}</p>
                          <p className="text-lg font-semibold text-slate-900">{entry.value}</p>
                        </div>
                      ))}
                    </div>
                  </Card>

                  <Card padding="lg" className="border border-slate-200/60 bg-white">
                    <h3 className="text-lg font-semibold text-slate-900">Disponibilidad & conflictos</h3>
                    <div className="mt-4 space-y-3 text-sm text-slate-700">
                      <div className="space-y-2">
                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Disponibilidad declarada</p>
                        <ul className="space-y-1">
                          {selectedEmployeeDetail.shifts.availability.map(item => (
                            <li key={item}>• {item}</li>
                          ))}
                        </ul>
                      </div>
                      <div className="space-y-2">
                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Conflictos detectados</p>
                        <ul className="space-y-1 text-slate-700">
                          {selectedEmployeeDetail.shifts.conflicts.map(item => (
                            <li key={item}>• {item}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                    <div className="mt-6 flex flex-wrap gap-2">
                      {selectedEmployeeDetail.shifts.actions.map(action => (
                        <Button key={action} variant="ghost" size="sm">
                          {action}
                        </Button>
                      ))}
                    </div>
                  </Card>
                </>
              )}

              {activeTab === 'fichajes' && selectedEmployeeDetail && (
                <>
                  <Card padding="lg" className="border border-slate-200/60 bg-white">
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-slate-900">Control horario</h3>
                        <p className="text-sm text-slate-600">Registro en tiempo real con incidencias marcadas.</p>
                      </div>
                      <Badge variant="secondary" size="sm" leftIcon={<Clock className="h-4 w-4" />}>
                        Última sincronización 12:00
                      </Badge>
                    </div>
                    <div className="mt-4 grid gap-4 md:grid-cols-3">
                      {selectedEmployeeDetail.attendance.highlights.map(metric => (
                        <div key={metric.label} className="rounded-xl bg-slate-50/80 p-4">
                          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{metric.label}</p>
                          <p className="text-lg font-semibold text-slate-900">{metric.value}</p>
                        </div>
                      ))}
                    </div>
                    <div className="mt-6 space-y-3">
                      {selectedEmployeeDetail.attendance.log.map(entry => (
                        <div
                          key={entry.day}
                          className="grid gap-3 rounded-xl border border-slate-200/60 bg-slate-50/80 p-4 md:grid-cols-[100px_1fr_1fr_120px]"
                        >
                          <div>
                            <p className="text-sm font-semibold text-slate-900">{entry.day}</p>
                            <p className="text-xs text-slate-500">Balance {entry.difference}</p>
                          </div>
                          <p className="text-sm text-slate-600">Entrada {entry.checkIn}</p>
                          <p className="text-sm text-slate-600">Salida {entry.checkOut}</p>
                          <div className="flex flex-col items-start gap-1 md:items-end">
                            <Badge
                              variant={
                                entry.status === 'A tiempo'
                                  ? 'success'
                                  : entry.status === 'Retraso'
                                  ? 'yellow'
                                  : 'destructive'
                              }
                              size="sm"
                            >
                              {entry.status}
                            </Badge>
                            {entry.note ? <p className="text-xs text-slate-500">{entry.note}</p> : null}
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="mt-6 flex flex-wrap gap-2">
                      <Button variant="secondary" size="sm">
                        Ajustar fichaje
                      </Button>
                      <Button variant="ghost" size="sm">
                        Marcar incidencia
                      </Button>
                      <Button variant="ghost" size="sm">
                        Exportar para nómina
                      </Button>
                    </div>
                  </Card>
                </>
              )}

              {activeTab === 'variables' && selectedEmployeeDetail && (
                <>
                  <Card padding="lg" className="border border-slate-200/60 bg-white">
                    <h3 className="text-lg font-semibold text-slate-900">Resumen variable & nómina</h3>
                    <div className="mt-4 grid gap-4 md:grid-cols-3">
                      {selectedEmployeeDetail.payroll.snapshot.map(item => (
                        <div key={item.label} className="rounded-xl bg-slate-50/80 p-4">
                          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{item.label}</p>
                          <p className="text-lg font-semibold text-slate-900">{item.value}</p>
                        </div>
                      ))}
                    </div>
                    <div className="mt-6">
                      <h4 className="text-sm font-semibold text-slate-700">Incidencias abiertas</h4>
                      <ul className="mt-2 space-y-2 text-sm text-slate-600">
                        {selectedEmployeeDetail.payroll.incidents.map(incident => (
                          <li key={incident}>• {incident}</li>
                        ))}
                      </ul>
                    </div>
                  </Card>

                  <Card padding="lg" className="border border-slate-200/60 bg-white">
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-slate-900">Variables & comisiones</h3>
                        <p className="text-sm text-slate-600">
                          Control de comisiones, bonus y variables ligadas al desempeño.
                        </p>
                      </div>
                      <Button variant="secondary" size="sm">
                        Añadir variable
                      </Button>
                    </div>
                    <div className="mt-6 space-y-3">
                      {selectedEmployeeDetail.payroll.variables.map(variable => (
                        <div
                          key={variable.concept}
                          className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200/60 bg-slate-50/70 p-4"
                        >
                          <div>
                            <p className="text-sm font-semibold text-slate-900">{variable.concept}</p>
                            <p className="text-xs text-slate-500">Valor estimado {variable.amount}</p>
                          </div>
                          {renderVariableStatus(variable.status)}
                        </div>
                      ))}
                    </div>
                    <div className="mt-6 grid gap-3 md:grid-cols-2">
                      {selectedEmployeeDetail.variables.performance.map(item => (
                        <div key={item.label} className="rounded-xl bg-slate-50/80 p-4">
                          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{item.label}</p>
                          <p className="text-sm font-semibold text-slate-900">{item.progress}</p>
                        </div>
                      ))}
                    </div>
                    <div className="mt-6 flex flex-wrap gap-2">
                      {selectedEmployeeDetail.variables.actions.map(action => (
                        <Button key={action} variant="ghost" size="sm">
                          {action}
                        </Button>
                      ))}
                    </div>
                  </Card>
                </>
              )}

              {activeTab === 'evaluacion' && selectedEmployeeDetail && (
                <>
                  <Card padding="lg" className="border border-slate-200/60 bg-white">
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-slate-900">Evaluaciones & objetivos</h3>
                        <p className="text-sm text-slate-600">
                          Estado de los ciclos de feedback 360º y planes de desarrollo.
                        </p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <Button variant="secondary" size="sm">
                          Iniciar evaluación
                        </Button>
                        <Button variant="ghost" size="sm">
                          Asignar objetivo
                        </Button>
                      </div>
                    </div>
                    <div className="mt-6 grid gap-4 md:grid-cols-3">
                      {selectedEmployeeDetail.evaluation.overview.map(item => (
                        <div key={item.label} className="rounded-xl bg-slate-50/80 p-4">
                          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{item.label}</p>
                          <p className="text-lg font-semibold text-slate-900">{item.value}</p>
                        </div>
                      ))}
                    </div>
                  </Card>

                  <Card padding="lg" className="border border-slate-200/60 bg-white">
                    <h3 className="text-lg font-semibold text-slate-900">Histórico & feedback</h3>
                    <div className="mt-4 space-y-3">
                      {selectedEmployeeDetail.evaluation.history.map(item => (
                        <div
                          key={item.cycle}
                          className="grid gap-3 rounded-xl border border-slate-200/60 bg-slate-50/80 p-4 md:grid-cols-[160px_1fr_1fr]"
                        >
                          <div>
                            <p className="text-sm font-semibold text-slate-900">{item.cycle}</p>
                            <p className="text-xs text-slate-500">{item.score}</p>
                          </div>
                          <p className="text-sm text-slate-700">{item.focus}</p>
                          <p className="text-sm font-medium text-slate-700">{item.nextStep}</p>
                        </div>
                      ))}
                    </div>
                    <div className="mt-6 space-y-2">
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Feedback destacado</p>
                      <ul className="space-y-2 text-sm text-slate-600">
                        {selectedEmployeeDetail.evaluation.feedback.map(item => (
                          <li key={item}>• {item}</li>
                        ))}
                      </ul>
                    </div>
                  </Card>
                </>
              )}

              {activeTab === 'formacion' && selectedEmployeeDetail && (
                <>
                  <Card padding="lg" className="border border-slate-200/60 bg-white">
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-slate-900">Formación interna</h3>
                        <p className="text-sm text-slate-600">
                          Seguimiento de cursos internos, mentoring y academias digitales.
                        </p>
                      </div>
                      <Button variant="secondary" size="sm">
                        Registrar formación
                      </Button>
                    </div>
                    <div className="mt-6 space-y-3">
                      {selectedEmployeeDetail.training.courses.map(course => (
                        <div
                          key={course.label}
                          className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200/60 bg-slate-50/80 p-4"
                        >
                          <div>
                            <p className="text-sm font-semibold text-slate-900">{course.label}</p>
                            <p className="text-xs text-slate-500">{course.detail}</p>
                          </div>
                          {renderTimelineStatus(course.status)}
                        </div>
                      ))}
                    </div>
                  </Card>

                  <Card padding="lg" className="border border-slate-200/60 bg-white">
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-slate-900">Certificaciones</h3>
                        <p className="text-sm text-slate-600">
                          Control de caducidades críticas como RCP, PRL y certificaciones técnicas.
                        </p>
                      </div>
                      <Button variant="secondary" size="sm">
                        Subir certificado
                      </Button>
                    </div>
                    <div className="mt-6 space-y-3">
                      {selectedEmployeeDetail.training.certifications.map(cert => (
                        <div
                          key={cert.name}
                          className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200/60 bg-slate-50/80 p-4"
                        >
                          <div>
                            <p className="text-sm font-semibold text-slate-900">{cert.name}</p>
                            <p className="text-xs text-slate-500">{cert.validity}</p>
                          </div>
                          {renderCertificationStatus(cert.status)}
                        </div>
                      ))}
                    </div>
                    <div className="mt-6 space-y-2">
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Recordatorios</p>
                      <ul className="space-y-2 text-sm text-slate-600">
                        {selectedEmployeeDetail.training.reminders.map(item => (
                          <li key={item}>• {item}</li>
                        ))}
                      </ul>
                    </div>
                  </Card>
                </>
              )}

              {activeTab === 'ausencias' && selectedEmployeeDetail && (
                <>
                  <Card padding="lg" className="border border-slate-200/60 bg-white">
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-slate-900">Solicitudes & ausencias</h3>
                        <p className="text-sm text-slate-600">
                          Gestiona vacaciones, bajas médicas y permisos especiales.
                        </p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <Button variant="secondary" size="sm">
                          Registrar ausencia
                        </Button>
                        <Button variant="ghost" size="sm">
                          Ver impacto en turnos
                        </Button>
                      </div>
                    </div>
                    <div className="mt-6 space-y-3">
                      {selectedEmployeeDetail.absences.upcoming.map(absence => (
                        <div
                          key={`${absence.type}-${absence.dates}`}
                          className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200/60 bg-slate-50/80 p-4"
                        >
                          <div>
                            <p className="text-sm font-semibold text-slate-900">
                              {absence.type} • {absence.dates}
                            </p>
                            {absence.note ? <p className="text-xs text-slate-500">{absence.note}</p> : null}
                          </div>
                          {renderAbsenceStatus(absence.status)}
                        </div>
                      ))}
                    </div>
                  </Card>

                  <Card padding="lg" className="border border-slate-200/60 bg-white">
                    <h3 className="text-lg font-semibold text-slate-900">Histórico & alertas</h3>
                    <div className="mt-4 space-y-3">
                      {selectedEmployeeDetail.absences.history.map(absence => (
                        <div
                          key={`${absence.type}-${absence.dates}-history`}
                          className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200/60 bg-slate-50/80 p-4"
                        >
                          <div>
                            <p className="text-sm font-semibold text-slate-900">
                              {absence.type} • {absence.dates}
                            </p>
                          </div>
                          {renderAbsenceStatus(absence.status)}
                        </div>
                      ))}
                    </div>
                    <div className="mt-6 space-y-2">
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Alertas</p>
                      <ul className="space-y-2 text-sm text-slate-600">
                        {selectedEmployeeDetail.absences.alerts.map(alert => (
                          <li key={alert}>• {alert}</li>
                        ))}
                      </ul>
                    </div>
                  </Card>
                </>
              )}

              {activeTab === 'onboarding' && selectedEmployeeDetail && (
                <>
                  <Card padding="lg" className="border border-slate-200/60 bg-white">
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-slate-900">Onboarding checklist</h3>
                        <p className="text-sm text-slate-600">
                          Onboarding claro por responsables e hitos críticos.
                        </p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <Button variant="secondary" size="sm">
                          Iniciar onboarding
                        </Button>
                        <Button variant="ghost" size="sm">
                          Ver progreso
                        </Button>
                      </div>
                    </div>
                    <div className="mt-6 space-y-3">
                      {selectedEmployeeDetail.onboarding.onboardingChecklist.map(item => (
                        <div
                          key={item.label}
                          className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200/60 bg-slate-50/80 p-4"
                        >
                          <div>
                            <p className="text-sm font-semibold text-slate-900">{item.label}</p>
                            <p className="text-xs text-slate-500">Responsable: {item.owner}</p>
                          </div>
                          <Badge variant={item.completed ? 'success' : 'secondary'} size="sm">
                            {item.completed ? 'Completado' : 'Pendiente'}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </Card>

                  <Card padding="lg" className="border border-slate-200/60 bg-white">
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-slate-900">Offboarding checklist</h3>
                        <p className="text-sm text-slate-600">
                          Checklist estructurada para cierres impecables con RRHH, IT y finanzas.
                        </p>
                      </div>
                      <Button variant="secondary" size="sm">
                        Iniciar offboarding
                      </Button>
                    </div>
                    <div className="mt-6 space-y-3">
                      {selectedEmployeeDetail.onboarding.offboardingChecklist.map(item => (
                        <div
                          key={item.label}
                          className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200/60 bg-slate-50/80 p-4"
                        >
                          <div>
                            <p className="text-sm font-semibold text-slate-900">{item.label}</p>
                            <p className="text-xs text-slate-500">Responsable: {item.owner}</p>
                          </div>
                          <Badge variant={item.completed ? 'success' : 'secondary'} size="sm">
                            {item.completed ? 'Completado' : 'Pendiente'}
                          </Badge>
                        </div>
                      ))}
                    </div>
                    <div className="mt-6 space-y-3">
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Historial de procesos</p>
                      {selectedEmployeeDetail.onboarding.history.map(item => (
                        <div
                          key={item.label}
                          className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200/60 bg-white p-4"
                        >
                          <div>
                            <p className="text-sm font-semibold text-slate-900">{item.label}</p>
                            <p className="text-xs text-slate-500">{item.detail}</p>
                          </div>
                          {renderTimelineStatus(item.status)}
                        </div>
                      ))}
                    </div>
                  </Card>
                </>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <Card padding="lg" className="border border-slate-200/60 bg-white">
              <div className="flex items-center gap-3">
                <Sparkles className="h-5 w-5 text-indigo-500" />
                <h3 className="text-lg font-semibold text-slate-900">Resumen global del equipo</h3>
              </div>
              <div className="mt-4 space-y-3 text-sm text-slate-600">
                <p>Visualiza cobertura por sedes, turnos críticos y evolución de plantilla.</p>
                <div className="rounded-xl bg-slate-50/80 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Cobertura actual</p>
                  <p className="mt-2 text-sm text-slate-700">
                    Sede Central 98% · Sede Norte 92% · Sede Sur 86% · Online 100%
                  </p>
                </div>
                <div className="rounded-xl bg-slate-50/80 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Huecos críticos</p>
                  <ul className="mt-2 space-y-1">
                    <li>• Recepción fin de semana (Central) · cubrir antes del 20/11</li>
                    <li>• PT senior (Norte) · proceso selección en marcha</li>
                    <li>• Nutrición sábados (Sur) · sustitución temporal</li>
                  </ul>
                </div>
              </div>
            </Card>

            <Card padding="lg" className="border border-slate-200/60 bg-white">
              <div className="flex items-center gap-3">
                <ListChecks className="h-5 w-5 text-amber-500" />
                <h3 className="text-lg font-semibold text-slate-900">Acciones masivas</h3>
              </div>
              <ul className="mt-4 space-y-2 text-sm text-slate-600">
                <li>• Asignar rol a varios colaboradores de un clic.</li>
                <li>• Mover empleados de sede manteniendo histórico y turnos.</li>
                <li>• Mandar comunicado interno por squads o listas dinámicas.</li>
                <li>• Programar formación obligatoria parametrizada.</li>
                <li>• Exportar listado empleados y aplicar actualización salarial masiva.</li>
              </ul>
            </Card>

            <Card padding="lg" className="border border-slate-200/60 bg-white">
              <div className="flex items-center gap-3">
                <Sparkles className="h-5 w-5 text-sky-500" />
                <h3 className="text-lg font-semibold text-slate-900">Automatizaciones inteligentes</h3>
              </div>
              <ul className="mt-4 space-y-2 text-sm text-slate-600">
                <li>• Alertas por rotación elevada o no-shows de empleados.</li>
                <li>• Notificaciones por incumplimiento de horas o certificados a caducar.</li>
                <li>• Recomendaciones: talento para mentoring, revisar comisiones, detectar retrasos.</li>
                <li>• Integraciones con nóminas externas, firmas digitales y control de acceso.</li>
              </ul>
            </Card>

            <Card padding="lg" className="border border-slate-200/60 bg-white">
              <div className="flex items-center gap-3">
                <Bell className="h-5 w-5 text-rose-500" />
                <h3 className="text-lg font-semibold text-slate-900">Botones imprescindibles</h3>
              </div>
              <div className="mt-4 space-y-3 text-sm text-slate-600">
                <p className="font-semibold text-slate-900">Global</p>
                <ul className="space-y-1">
                  <li>• Añadir empleado · Importar equipo · Configurar roles & permisos.</li>
                  <li>• Configurar políticas RRHH · Ver peticiones de vacaciones y cambios.</li>
                </ul>
                <p className="font-semibold text-slate-900">En ficha empleado</p>
                <ul className="space-y-1">
                  <li>• Editar datos · Asignar rol · Ver turnos y fichajes.</li>
                  <li>• Registrar ausencia · Configurar variables · Iniciar evaluación.</li>
                  <li>• Onboarding / Offboarding · Desactivar empleado.</li>
                </ul>
              </div>
            </Card>
          </div>
        </section>
      </main>
    </div>
  );
}

export default EquipoRRHHPage;


