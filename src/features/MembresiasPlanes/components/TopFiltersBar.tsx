import {
  Calculator,
  Filter,
  LayoutDashboard,
  Plus,
  Settings2,
  Sparkles,
  UserPlus,
} from 'lucide-react';
import {
  Badge,
  Button,
  Card,
  Input,
  Select,
  type SelectOption,
} from '../../../components/componentsreutilizables';

const sedeOptions: SelectOption[] = [
  { value: 'todas', label: 'Todas las sedes' },
  { value: 'central', label: 'Sede Central' },
  { value: 'norte', label: 'Sede Norte' },
  { value: 'sur', label: 'Sede Sur' },
  { value: 'online', label: 'Online' },
];

const tipoPlanOptions: SelectOption[] = [
  { value: 'todos', label: 'Todos los tipos' },
  { value: 'general', label: 'Cuota general' },
  { value: 'pt', label: 'PT / coaching' },
  { value: 'online', label: 'Online / híbrido' },
  { value: 'daypass', label: 'Day pass / bonos' },
  { value: 'corporate', label: 'Corporate' },
  { value: 'especial', label: 'Juvenil / Senior / Especial' },
];

const estadoOptions: SelectOption[] = [
  { value: 'todos', label: 'Todos los estados' },
  { value: 'activo', label: 'Activos' },
  { value: 'oculto', label: 'Ocultos' },
  { value: 'archivado', label: 'Archivados' },
];

const mostrarOptions: SelectOption[] = [
  { value: 'todos', label: 'Todos los planes' },
  { value: 'muchas_altas', label: 'Planes con muchas altas' },
  { value: 'bajas_altas', label: 'Planes con bajas altas' },
  { value: 'antiguos', label: 'Planes antiguos' },
  { value: 'upgrade', label: 'Clientes con upgrade potencial' },
];

export function TopFiltersBar() {
  return (
    <Card className="bg-white/90 shadow-sm ring-1 ring-slate-200/70 backdrop-blur dark:bg-slate-900/70 dark:ring-slate-700/40" padding="lg">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
              Control total de Membresías & Planes
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Filtros rápidos por sede, tipo y estado para aislar los planes que importan ahora mismo.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="primary" leftIcon={<Plus size={16} />}>
              Crear nuevo plan
            </Button>
            <Button variant="secondary" leftIcon={<UserPlus size={16} />}>
              Asignar membresía
            </Button>
            <Button variant="ghost" leftIcon={<Calculator size={16} />}>
              Simular cambios
            </Button>
            <Button variant="ghost" leftIcon={<LayoutDashboard size={16} />}>
              Ver matriz
            </Button>
            <Button variant="ghost" leftIcon={<Settings2 size={16} />}>
              Configurar políticas
            </Button>
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-[repeat(5,minmax(0,1fr))]">
          <Select label="Sede" options={sedeOptions} defaultValue="todas" />
          <Select label="Tipo de plan" options={tipoPlanOptions} defaultValue="todos" />
          <Select label="Estado" options={estadoOptions} defaultValue="todos" />
          <Select label="Mostrar" options={mostrarOptions} defaultValue="todos" />
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
              Buscar plan
            </label>
            <Input placeholder="Ej. Premium, Corporativo..." />
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-indigo-100 bg-indigo-50 px-4 py-3 text-sm text-indigo-900 dark:border-indigo-500/30 dark:bg-indigo-500/10 dark:text-indigo-100">
          <div className="flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-2 rounded-lg bg-white px-3 py-1 text-xs font-medium text-indigo-700 shadow-sm dark:bg-indigo-950/60 dark:text-indigo-200">
              <Filter size={14} />
              Filtro activo: Altas recurrentes &gt; 30
            </span>
            <Badge variant="outline" size="sm" className="!text-[11px] !px-2 !py-0.5">
              KPI: % Upgrade potencial
            </Badge>
            <Badge variant="outline" size="sm" className="!text-[11px] !px-2 !py-0.5">
              KPI: Churn último 90d
            </Badge>
          </div>
          <Button variant="primary" size="sm" leftIcon={<Sparkles size={14} />}>
            Guardar vista inteligente
          </Button>
        </div>
      </div>
    </Card>
  );
}

