import { Badge, Button, Card } from '../../../components/componentsreutilizables';
import { RiskMember } from '../api';

interface RiskMembersListProps {
  members: RiskMember[];
  onAssignAutomation: (memberId: string) => void;
}

const STATUS_LABELS: Record<RiskMember['status'], { label: string; variant: 'yellow' | 'red' | 'blue' }> = {
  inactivo: { label: 'Inactivo', variant: 'yellow' },
  moroso: { label: 'Morosidad', variant: 'red' },
  alerta: { label: 'Alerta', variant: 'blue' },
};

export function RiskMembersList({ members, onAssignAutomation }: RiskMembersListProps) {
  return (
    <Card padding="none" className="bg-white shadow-sm ring-1 ring-slate-200">
      <div className="px-6 py-5">
        <header className="mb-6 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">Listado riesgo de fuga</h2>
            <p className="text-sm text-slate-600">
              Identifica rápidamente quién está a punto de darse de baja (ausencias, impagos o señales negativas).
            </p>
          </div>
          <Badge variant="blue" size="sm">
            {members.length} clientes en seguimiento
          </Badge>
        </header>

        <div className="overflow-hidden rounded-2xl border border-slate-200">
          <table className="min-w-full divide-y divide-slate-200 text-sm text-slate-600">
            <thead className="bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-4 py-3 text-left">Cliente</th>
                <th className="px-4 py-3 text-left">Estado</th>
                <th className="px-4 py-3 text-left">Última visita</th>
                <th className="px-4 py-3 text-left">Último pago</th>
                <th className="px-4 py-3 text-left">Membresía</th>
                <th className="px-4 py-3 text-left">Riesgo</th>
                <th className="px-4 py-3 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {members.map(member => {
                const status = STATUS_LABELS[member.status];
                const riskColor =
                  member.riskScore >= 85 ? 'text-rose-600' : member.riskScore >= 75 ? 'text-amber-600' : 'text-slate-800';

                return (
                  <tr key={member.id} className="transition-colors hover:bg-slate-50/60">
                    <td className="px-4 py-4">
                      <p className="font-semibold text-slate-900">{member.name}</p>
                      <p className="text-xs text-slate-500">{member.notes}</p>
                    </td>
                    <td className="px-4 py-4">
                      <Badge variant={status.variant} size="sm">
                        {status.label}
                      </Badge>
                    </td>
                    <td className="px-4 py-4">{member.lastVisit}</td>
                    <td className="px-4 py-4">{member.lastPayment ?? '—'}</td>
                    <td className="px-4 py-4">{member.membership}</td>
                    <td className="px-4 py-4">
                      <span className={`text-base font-semibold ${riskColor}`}>{member.riskScore}</span>
                    </td>
                    <td className="px-4 py-4 text-right">
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => onAssignAutomation(member.id)}
                      >
                        Asignar automatización
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </Card>
  );
}

