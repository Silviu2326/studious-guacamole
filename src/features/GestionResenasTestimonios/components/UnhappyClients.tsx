import { HeartPulse, Skull } from 'lucide-react';
import { Badge, Button, Card } from '../../../components/componentsreutilizables';
import { UnhappyClient } from '../api';

interface UnhappyClientsProps {
  clients: UnhappyClient[];
  onFollowUp: (clientId: string) => void;
}

export function UnhappyClients({ clients, onFollowUp }: UnhappyClientsProps) {
  return (
    <Card padding="none" className="bg-white shadow-sm ring-1 ring-slate-200">
      <div className="px-6 py-5">
        <header className="mb-6 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-rose-700">Clientes potencialmente descontentos</h2>
            <p className="text-sm text-rose-600">
              Detectamos señales de riesgo (NPS bajo, respuestas negativas, inactividad). Actúa antes de que cancelen.
            </p>
          </div>
          <Badge variant="red" size="sm" leftIcon={<Skull size={14} />}>
            {clients.length} clientes en riesgo
          </Badge>
        </header>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {clients.map(client => (
            <Card
              key={client.id}
              variant="hover"
              className="flex h-full flex-col gap-4 bg-rose-50 ring-1 ring-rose-200"
              padding="lg"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="text-base font-semibold text-rose-900">{client.name}</h3>
                  <p className="text-xs text-rose-600">ID: {client.id}</p>
                </div>
                {client.nps !== undefined && (
                  <Badge variant="yellow" size="sm">
                    NPS {client.nps}
                  </Badge>
                )}
              </div>

              <div className="space-y-2 text-sm text-rose-800">
                <div className="flex items-center justify-between">
                  <span className="font-semibold">Última visita</span>
                  <span>{client.lastVisit}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-semibold">Membresía</span>
                  <span>{client.membership}</span>
                </div>
              </div>

              <p className="flex-1 text-sm text-rose-700">{client.note}</p>

              <Button
                variant="primary"
                size="sm"
                leftIcon={<HeartPulse size={16} />}
                onClick={() => onFollowUp(client.id)}
              >
                Programar seguimiento
              </Button>
            </Card>
          ))}
        </div>
      </div>
    </Card>
  );
}

