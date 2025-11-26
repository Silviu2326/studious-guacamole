import { useEffect, useMemo, useState } from 'react';
import {
  AlertTriangle,
  Filter,
  HeartPulse,
  LifeBuoy,
  MailQuestion,
  Search,
  ShieldOff,
  UserMinus,
} from 'lucide-react';
import { Button, Card, Input, MetricCards } from '../../../components/componentsreutilizables';
import {
  RiskMember,
  SimpleAutomation,
  fetchRiskMembers,
  fetchSimpleAutomations,
} from '../api';
import { RiskMembersList, SimpleAutomations } from '../components';

export function CampanasRetencionRiesgoPage() {
  const [members, setMembers] = useState<RiskMember[]>([]);
  const [automations, setAutomations] = useState<SimpleAutomation[]>([]);
  const [memberSearch, setMemberSearch] = useState('');
  const [automationSearch, setAutomationSearch] = useState('');

  useEffect(() => {
    const loadData = async () => {
      const [membersData, automationData] = await Promise.all([fetchRiskMembers(), fetchSimpleAutomations()]);
      setMembers(membersData);
      setAutomations(automationData);
    };

    void loadData();
  }, []);

  const handleAssignAutomation = (memberId: string) => {
    alert(`Asignar automatización a ${memberId} (pendiente de implementación)`);
  };

  const handleActivateAutomation = (automationId: string) => {
    alert(`Automatización ${automationId} activada (pendiente de implementación)`);
  };

  const metrics = useMemo(() => {
    const highRisk = members.filter(member => member.riskScore >= 85).length;
    const inactive = members.filter(member => member.status === 'inactivo').length;
    const overdue = members.filter(member => member.status === 'moroso').length;
    const avgRisk =
      members.length > 0
        ? Math.round(members.reduce((sum, member) => sum + member.riskScore, 0) / members.length)
        : 0;

    return [
      {
        id: 'at-risk',
        title: 'Clientes en riesgo',
        value: members.length,
        subtitle: 'Usuarios con riesgo activo monitoreado',
        color: 'info' as const,
        icon: <UserMinus size={18} />,
      },
      {
        id: 'high-risk',
        title: 'Riesgo crítico',
        value: highRisk,
        subtitle: 'Score ≥ 85 requiere acción inmediata',
        color: 'warning' as const,
        icon: <AlertTriangle size={18} />,
      },
      {
        id: 'inactive',
        title: 'Inactivos detectados',
        value: inactive,
        subtitle: 'Sin asistencia en más de 21 días',
        color: 'primary' as const,
        icon: <ShieldOff size={18} />,
      },
      {
        id: 'overdue',
        title: 'Morosidad o impago',
        value: overdue,
        subtitle: 'Pagos atrasados pendientes',
        color: 'error' as const,
        icon: <MailQuestion size={18} />,
      },
      {
        id: 'avg-risk',
        title: 'Riesgo promedio',
        value: `${avgRisk}%`,
        subtitle: 'Score medio de la cohorte',
        color: 'success' as const,
        icon: <HeartPulse size={18} />,
      },
    ];
  }, [members]);

  const filteredMembers = useMemo(() => {
    const term = memberSearch.trim().toLowerCase();
    if (!term) {
      return members;
    }

    return members.filter(member => {
      return (
        member.name.toLowerCase().includes(term) ||
        member.notes.toLowerCase().includes(term) ||
        member.membership.toLowerCase().includes(term) ||
        member.status.toLowerCase().includes(term)
      );
    });
  }, [members, memberSearch]);

  const filteredAutomations = useMemo(() => {
    const term = automationSearch.trim().toLowerCase();
    if (!term) {
      return automations;
    }

    return automations.filter(automation => {
      return (
        automation.title.toLowerCase().includes(term) ||
        automation.description.toLowerCase().includes(term) ||
        automation.type.toLowerCase().includes(term) ||
        automation.channel.toLowerCase().includes(term)
      );
    });
  }, [automations, automationSearch]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <header className="border-b border-gray-200/60 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6">
          <div className="py-6">
            <div className="flex items-center">
              <div className="mr-4 rounded-xl bg-blue-100 p-2 ring-1 ring-blue-200/70">
                <LifeBuoy size={24} className="text-blue-600" />
              </div>
              <div>
                <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 md:text-4xl">
                  Campañas de retención & riesgo de baja
                </h1>
                <p className="text-gray-600">
                  Detecta señales de abandono, activa automatizaciones multi-canal y recupera clientes antes de que cancelen.
                </p>
                <p className="text-xs text-gray-500">
                  Datos basados en asistencia, pagos y satisfacción sincronizados con tu CRM.
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1600px] px-4 py-8 sm:px-6 lg:px-6">
        <div className="space-y-6">
          <div className="flex items-center justify-end">
            <Button variant="secondary" leftIcon={<HeartPulse size={18} />}>
              Crear plan de rescate manual
            </Button>
          </div>

          <MetricCards data={metrics} columns={5} />

          <Card className="bg-white shadow-sm ring-1 ring-slate-200" padding="md">
            <div className="space-y-4">
              <div className="rounded-2xl bg-slate-50 p-3 ring-1 ring-slate-200">
                <div className="grid gap-4 md:grid-cols-[1fr_auto] md:items-center">
                  <Input
                    value={memberSearch}
                    onChange={event => setMemberSearch(event.target.value)}
                    placeholder="Buscar clientes por nombre, estado o membresía..."
                    leftIcon={<Search size={18} />}
                    aria-label="Buscar clientes en riesgo"
                  />
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                    <Button variant="secondary" leftIcon={<Filter size={18} />} className="whitespace-nowrap">
                      Filtros avanzados
                    </Button>
                    <Button
                      variant="ghost"
                      onClick={() => setMemberSearch('')}
                      disabled={memberSearch.length === 0}
                      className="whitespace-nowrap text-sm"
                    >
                      Limpiar búsqueda
                    </Button>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-slate-200 pt-4 text-sm text-slate-600">
                <span>{filteredMembers.length} clientes coinciden con los filtros seleccionados</span>
                <span>{members.length} clientes monitoreados en total</span>
              </div>
            </div>
          </Card>

          <RiskMembersList members={filteredMembers} onAssignAutomation={handleAssignAutomation} />

          <Card className="bg-white shadow-sm ring-1 ring-slate-200" padding="md">
            <div className="space-y-4">
              <div className="rounded-2xl bg-slate-50 p-3 ring-1 ring-slate-200">
                <div className="grid gap-4 md:grid-cols-[1fr_auto] md:items-center">
                  <Input
                    value={automationSearch}
                    onChange={event => setAutomationSearch(event.target.value)}
                    placeholder="Buscar automatizaciones por canal o tipo..."
                    leftIcon={<Search size={18} />}
                    aria-label="Buscar automatizaciones"
                  />
                  <Button
                    variant="ghost"
                    onClick={() => setAutomationSearch('')}
                    disabled={automationSearch.length === 0}
                    className="whitespace-nowrap text-sm"
                  >
                    Limpiar búsqueda
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-slate-200 pt-4 text-sm text-slate-600">
                <span>{filteredAutomations.length} automatizaciones disponibles</span>
                <span>{automations.length} plantillas configuradas en total</span>
              </div>
            </div>
          </Card>

          <SimpleAutomations automations={filteredAutomations} onActivate={handleActivateAutomation} />

          <Card padding="lg" className="bg-white text-center shadow-sm ring-1 ring-slate-200">
            <p className="text-lg font-semibold text-gray-900">Próximamente</p>
            <p className="mt-2 text-gray-600">
              Workflows personalizados, pruebas A/B de mensajes y seguimiento automático de resultados y revenue retenido.
            </p>
          </Card>
        </div>
      </main>
    </div>
  );
}

