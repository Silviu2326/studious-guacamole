import { useMemo, useState } from 'react';
import {
  Badge,
  Button,
  Card,
  Tooltip,
} from '../../../components/componentsreutilizables';
import {
  ArrowRight,
  CalendarPlus,
  CheckSquare,
  ChevronDown,
  Mail,
  MessageCircle,
  Phone,
  RefreshCcw,
  Star,
  Tag,
  Trash2,
  UserRound,
} from 'lucide-react';
import type { LeadOpportunity, LeadStatus } from '../api';

interface LeadOpportunitiesTableProps {
  leads: LeadOpportunity[];
  selectedLeadId: string | null;
  selectedLeadIds: string[];
  onSelectLead: (leadId: string) => void;
  onToggleSelectLead: (leadId: string) => void;
  onToggleSelectAll: () => void;
  onBulkAction?: (action: string, leadIds: string[]) => void;
}

type SortState = {
  column: 'score' | 'probability' | 'potentialValue' | 'createdAt';
  direction: 'asc' | 'desc';
};

const statusConfig: Record<LeadStatus, { label: string; className: string }> = {
  nuevo: {
    label: 'Nuevo',
    className: 'bg-sky-100 text-sky-700 ring-1 ring-inset ring-sky-200',
  },
  contactado: {
    label: 'Contactado',
    className: 'bg-orange-100 text-orange-700 ring-1 ring-inset ring-orange-200',
  },
  cita_agendada: {
    label: 'Cita agendada',
    className: 'bg-amber-100 text-amber-700 ring-1 ring-inset ring-amber-200',
  },
  visita_realizada: {
    label: 'Visitó el centro',
    className: 'bg-indigo-100 text-indigo-700 ring-1 ring-inset ring-indigo-200',
  },
  no_presentado: {
    label: 'No presentado',
    className: 'bg-rose-100 text-rose-700 ring-1 ring-inset ring-rose-200',
  },
  en_prueba: {
    label: 'En prueba',
    className: 'bg-emerald-100 text-emerald-700 ring-1 ring-inset ring-emerald-200',
  },
  cerrado_ganado: {
    label: 'Cerrado ganado',
    className: 'bg-green-100 text-green-700 ring-1 ring-inset ring-green-200',
  },
  cerrado_perdido: {
    label: 'Cerrado perdido',
    className: 'bg-slate-200 text-slate-700 ring-1 ring-inset ring-slate-300',
  },
};

const channelDictionary: Record<string, { label: string; icon: JSX.Element }> = {
  whatsapp: {
    label: 'WhatsApp',
    icon: <MessageCircle className="h-4 w-4 text-emerald-500" />,
  },
  email: {
    label: 'Email',
    icon: <Mail className="h-4 w-4 text-sky-500" />,
  },
  llamada: {
    label: 'Llamada',
    icon: <Phone className="h-4 w-4 text-indigo-500" />,
  },
  sms: {
    label: 'SMS',
    icon: <MessageCircle className="h-4 w-4 text-violet-500" />,
  },
  presencial: {
    label: 'Presencial',
    icon: <UserRound className="h-4 w-4 text-slate-500" />,
  },
};

const formatDate = (isoDate: string, withTime = false) => {
  const date = new Date(isoDate);
  return date.toLocaleString('es-ES', {
    day: '2-digit',
    month: 'short',
    ...(withTime ? { hour: '2-digit', minute: '2-digit' } : {}),
  });
};

const getRelativeTimeFromNow = (isoDate?: string) => {
  if (!isoDate) return 'Sin registro';
  const now = new Date();
  const target = new Date(isoDate);
  const diff = now.getTime() - target.getTime();
  const diffHours = Math.floor(diff / (1000 * 60 * 60));

  if (diffHours < 1) {
    const diffMinutes = Math.max(Math.floor(diff / (1000 * 60)), 1);
    return `Hace ${diffMinutes} min`;
  }
  if (diffHours < 24) {
    return `Hace ${diffHours}h`;
  }
  const diffDays = Math.floor(diffHours / 24);
  return `Hace ${diffDays}d`;
};

const getSortIcon = (column: SortState['column'], sortState: SortState) => {
  if (sortState.column !== column) return '↕';
  return sortState.direction === 'asc' ? '↑' : '↓';
};

export function LeadOpportunitiesTable({
  leads,
  selectedLeadId,
  selectedLeadIds,
  onSelectLead,
  onToggleSelectLead,
  onToggleSelectAll,
  onBulkAction,
}: LeadOpportunitiesTableProps) {
  const [sortState, setSortState] = useState<SortState>({
    column: 'createdAt',
    direction: 'desc',
  });

  const sortedLeads = useMemo(() => {
    const data = [...leads];
    data.sort((a, b) => {
      const { column, direction } = sortState;
      let comparator = 0;

      if (column === 'createdAt') {
        comparator = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      } else {
        comparator = (a[column] as number) - (b[column] as number);
      }

      return direction === 'asc' ? comparator : -comparator;
    });

    return data;
  }, [leads, sortState]);

  const allSelected = selectedLeadIds.length > 0 && selectedLeadIds.length === leads.length;
  const selectedCount = selectedLeadIds.length;

  const toggleSort = (column: SortState['column']) => {
    setSortState(prev => {
      if (prev.column === column) {
        return {
          column,
          direction: prev.direction === 'asc' ? 'desc' : 'asc',
        };
      }
      return {
        column,
        direction: column === 'createdAt' ? 'desc' : 'asc',
      };
    });
  };

  const handleBulkAction = (action: string) => {
    onBulkAction?.(action, selectedLeadIds);
  };

  return (
    <Card className="bg-white shadow-sm ring-1 ring-slate-200/80 dark:bg-slate-900/40 dark:ring-slate-700/50">
      <div className="space-y-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-slate-100 px-3 py-2 text-sm font-medium text-slate-700 dark:bg-slate-800/60 dark:text-slate-200">
              {leads.length} leads activos
            </div>
            <Badge variant="blue" size="md">
              {selectedCount > 0 ? `${selectedCount} seleccionados` : 'Sin selección'}
            </Badge>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button variant="ghost" size="sm" leftIcon={<RefreshCcw className="h-4 w-4" />}>
              Actualizar vista
            </Button>
            <Button variant="ghost" size="sm" leftIcon={<Tag className="h-4 w-4" />}>
              Añadir etiqueta
            </Button>
            <Button variant="secondary" size="sm" leftIcon={<Star className="h-4 w-4" />}>
              Guardar filtro como lista inteligente
            </Button>
          </div>
        </div>

        <div className="rounded-2xl border border-dashed border-slate-200 px-4 py-3 dark:border-slate-700">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-300">
              <CheckSquare className="h-4 w-4 text-indigo-500" />
              <span>
                {selectedCount > 0
                  ? `Acciones masivas disponibles para ${selectedCount} leads`
                  : 'Selecciona leads para ejecutar acciones masivas'}
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Button
                size="sm"
                variant="secondary"
                leftIcon={<UserRound className="h-3.5 w-3.5" />}
                disabled={selectedCount === 0}
                onClick={() => handleBulkAction('assign')}
              >
                Asignar a...
              </Button>
              <Button
                size="sm"
                variant="secondary"
                leftIcon={<ChevronDown className="h-3.5 w-3.5" />}
                disabled={selectedCount === 0}
                onClick={() => handleBulkAction('change-status')}
              >
                Cambiar estado
              </Button>
              <Button
                size="sm"
                variant="secondary"
                leftIcon={<CalendarPlus className="h-3.5 w-3.5" />}
                disabled={selectedCount === 0}
                onClick={() => handleBulkAction('create-task')}
              >
                Crear tareas
              </Button>
              <Button
                size="sm"
                variant="secondary"
                leftIcon={<MessageCircle className="h-3.5 w-3.5" />}
                disabled={selectedCount === 0}
                onClick={() => handleBulkAction('whatsapp')}
              >
                Enviar WhatsApp
              </Button>
              <Button
                size="sm"
                variant="secondary"
                leftIcon={<Mail className="h-3.5 w-3.5" />}
                disabled={selectedCount === 0}
                onClick={() => handleBulkAction('email')}
              >
                Enviar Email
              </Button>
              <Button
                size="sm"
                variant="secondary"
                leftIcon={<ArrowRight className="h-3.5 w-3.5" />}
                disabled={selectedCount === 0}
                onClick={() => handleBulkAction('sequence')}
              >
                Añadir a secuencia
              </Button>
              <Button
                size="sm"
                variant="ghost"
                leftIcon={<Trash2 className="h-3.5 w-3.5" />}
                disabled={selectedCount === 0}
                onClick={() => handleBulkAction('archive')}
              >
                Archivar
              </Button>
            </div>
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl border border-slate-200 shadow-sm dark:border-slate-700/60">
          <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700/60">
            <thead className="bg-slate-50 dark:bg-slate-800/40">
              <tr className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-300">
                <th className="px-4 py-3">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                    checked={allSelected}
                    onChange={onToggleSelectAll}
                    aria-label="Seleccionar todos los leads visibles"
                  />
                </th>
                <th className="px-4 py-3 text-left">Lead</th>
                <th className="px-4 py-3 text-left">Estado</th>
                <th className="px-4 py-3 text-left">Origen</th>
                <th className="px-4 py-3 text-left">Sede</th>
                <th className="px-4 py-3 text-left">Asignado a</th>
                <th className="px-4 py-3 text-left">Último contacto</th>
                <th className="px-4 py-3 text-left">Próxima acción</th>
                <th
                  className="px-4 py-3 text-left cursor-pointer select-none"
                  onClick={() => toggleSort('score')}
                >
                  <span className="inline-flex items-center gap-1">
                    Score
                    <span className="text-slate-400">{getSortIcon('score', sortState)}</span>
                  </span>
                </th>
                <th
                  className="px-4 py-3 text-right cursor-pointer select-none"
                  onClick={() => toggleSort('probability')}
                >
                  <span className="inline-flex items-center gap-1 justify-end w-full">
                    Prob.
                    <span className="text-slate-400">{getSortIcon('probability', sortState)}</span>
                  </span>
                </th>
                <th
                  className="px-4 py-3 text-right cursor-pointer select-none"
                  onClick={() => toggleSort('potentialValue')}
                >
                  <span className="inline-flex items-center gap-1 justify-end w-full">
                    Valor potencial
                    <span className="text-slate-400">
                      {getSortIcon('potentialValue', sortState)}
                    </span>
                  </span>
                </th>
                <th
                  className="px-4 py-3 text-right cursor-pointer select-none"
                  onClick={() => toggleSort('createdAt')}
                >
                  <span className="inline-flex items-center gap-1 justify-end w-full">
                    Creado
                    <span className="text-slate-400">{getSortIcon('createdAt', sortState)}</span>
                  </span>
                </th>
                <th className="px-4 py-3 text-right">
                  <span className="sr-only">Acciones</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white text-sm dark:divide-slate-800 dark:bg-slate-900/30">
              {sortedLeads.map(lead => {
                const isSelected = selectedLeadIds.includes(lead.id);
                const isActive = selectedLeadId === lead.id;
                const lastContactInfo = lead.lastContact
                  ? channelDictionary[lead.lastContact.channel]
                  : null;

                return (
                  <tr
                    key={lead.id}
                    className={`group transition-colors hover:bg-slate-50/80 dark:hover:bg-slate-800/40 ${
                      isActive ? 'bg-indigo-50/60 dark:bg-indigo-500/10' : ''
                    }`}
                  >
                    <td className="px-4 py-3 align-top">
                      <input
                        type="checkbox"
                        className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                        checked={isSelected}
                        onChange={() => onToggleSelectLead(lead.id)}
                        aria-label={`Seleccionar ${lead.name}`}
                      />
                    </td>
                    <td className="px-4 py-4 align-top">
                      <button
                        type="button"
                        onClick={() => onSelectLead(lead.id)}
                        className="text-left"
                      >
                        <div className="font-semibold text-slate-900 transition hover:text-indigo-600 dark:text-slate-100">
                          {lead.name}
                        </div>
                        <div className="mt-1 flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                          <span>{lead.phone}</span>
                          <span className="h-1 w-1 rounded-full bg-slate-300" />
                          <span>{lead.email}</span>
                        </div>
                        {lead.priority === 'alta' && (
                          <span className="mt-1 inline-flex items-center gap-1 rounded-full bg-rose-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-rose-600">
                            <Star className="h-3 w-3" /> Prioritario
                          </span>
                        )}
                      </button>
                    </td>
                    <td className="px-4 py-4 align-top">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${statusConfig[lead.status].className}`}
                      >
                        {statusConfig[lead.status].label}
                      </span>
                    </td>
                    <td className="px-4 py-4 align-top text-slate-600 dark:text-slate-300">
                      {lead.source}
                    </td>
                    <td className="px-4 py-4 align-top text-slate-600 dark:text-slate-300">
                      {lead.sede}
                    </td>
                    <td className="px-4 py-4 align-top">
                      <div className="text-sm font-medium text-slate-700 dark:text-slate-200">
                        {lead.owner}
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">
                        {lead.ownerRole === 'comercial' ? 'Comercial' : 'Entrenador'}
                      </div>
                    </td>
                    <td className="px-4 py-4 align-top">
                      <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                        {lastContactInfo?.icon}
                        <div>
                          <p className="font-medium text-slate-700 dark:text-slate-200">
                            {getRelativeTimeFromNow(lead.lastContact?.date)}
                          </p>
                          {lead.lastContact?.summary && (
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                              {lead.lastContact.summary}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 align-top">
                      {lead.nextAction ? (
                        <div className="space-y-1 text-sm text-slate-700 dark:text-slate-200">
                          <p className="font-medium">{lead.nextAction.label}</p>
                          {lead.nextAction.dueDate && (
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                              {formatDate(lead.nextAction.dueDate, true)}
                            </p>
                          )}
                        </div>
                      ) : (
                        <span className="text-sm text-slate-400">Sin definir</span>
                      )}
                    </td>
                    <td className="px-4 py-4 align-top">
                      <div className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                        {lead.score}/100
                      </div>
                      <div className="mt-1 h-1.5 rounded-full bg-slate-100 dark:bg-slate-800/60">
                        <div
                          className="h-1.5 rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-500"
                          style={{ width: `${lead.score}%` }}
                        />
                      </div>
                    </td>
                    <td className="px-4 py-4 align-top text-right">
                      <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                        {(lead.probability * 100).toFixed(0)}%
                      </span>
                    </td>
                    <td className="px-4 py-4 align-top text-right">
                      <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                        {lead.potentialValue.toLocaleString('es-ES', {
                          style: 'currency',
                          currency: 'EUR',
                          maximumFractionDigits: 0,
                        })}
                      </span>
                    </td>
                    <td className="px-4 py-4 align-top text-right text-xs text-slate-500 dark:text-slate-400">
                      {formatDate(lead.createdAt)}
                    </td>
                    <td className="px-4 py-4 align-top">
                      <div className="flex justify-end gap-1 text-slate-400">
                        <Tooltip content="Abrir ficha" side="left">
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-8 w-8 rounded-full p-0"
                            onClick={() => onSelectLead(lead.id)}
                          >
                            <ArrowRight className="h-4 w-4" />
                          </Button>
                        </Tooltip>
                        <Tooltip content="WhatsApp rápido" side="left">
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-8 w-8 rounded-full p-0"
                          >
                            <MessageCircle className="h-4 w-4" />
                          </Button>
                        </Tooltip>
                        <Tooltip content="Enviar email" side="left">
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-8 w-8 rounded-full p-0"
                          >
                            <Mail className="h-4 w-4" />
                          </Button>
                        </Tooltip>
                        <Tooltip content="Registrar llamada" side="left">
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-8 w-8 rounded-full p-0"
                          >
                            <Phone className="h-4 w-4" />
                          </Button>
                        </Tooltip>
                        <Tooltip content="Programar cita" side="left">
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-8 w-8 rounded-full p-0"
                          >
                            <CalendarPlus className="h-4 w-4" />
                          </Button>
                        </Tooltip>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {leads.length === 0 && (
            <div className="px-6 py-12 text-center text-sm text-slate-500">
              No hay leads que coincidan con los filtros seleccionados.
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
