import { CheckCircle2, SendHorizontal, Timer } from 'lucide-react';
import { Badge, Button, Card } from '../../../components/componentsreutilizables';
import { ReviewChannel } from '../api';

interface ReviewRequestChannelsProps {
  channels: ReviewChannel[];
  selectedChannelId?: ReviewChannel['id'];
  onSelectChannel: (channelId: ReviewChannel['id']) => void;
  onSendRequest: (channelId: ReviewChannel['id']) => void;
}

export function ReviewRequestChannels({
  channels,
  selectedChannelId,
  onSelectChannel,
  onSendRequest,
}: ReviewRequestChannelsProps) {
  return (
    <Card padding="none" className="bg-white shadow-sm ring-1 ring-slate-200">
      <div className="px-6 py-5">
        <header className="mb-6 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">Pedir reseñas</h2>
            <p className="text-sm text-slate-600">Selecciona el canal ideal y envía solicitudes en segundos.</p>
          </div>
          <Badge variant="blue" size="sm">
            {channels.length} canales listos para usar
          </Badge>
        </header>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {channels.map(channel => {
          const isSelected = channel.id === selectedChannelId;

          return (
              <Card
              key={channel.id}
              variant="hover"
              className={`flex h-full flex-col gap-4 ring-1 ring-slate-200 ${isSelected ? 'bg-blue-50' : 'bg-slate-50'}`}
              padding="lg"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="text-base font-semibold text-slate-900">{channel.label}</h3>
                  <p className="text-sm text-slate-600">{channel.description}</p>
                </div>
                <Badge variant="secondary" size="sm" leftIcon={<Timer size={14} />}>
                  Resp. {channel.averageResponseTime}
                </Badge>
              </div>
              <div className="flex gap-3">
                <Button
                  onClick={() => onSelectChannel(channel.id)}
                  variant={isSelected ? 'primary' : 'secondary'}
                  size="sm"
                  leftIcon={<CheckCircle2 size={16} />}
                  className="flex-1"
                >
                  {isSelected ? 'Canal seleccionado' : 'Seleccionar'}
                </Button>
                <Button
                  onClick={() => onSendRequest(channel.id)}
                  variant="primary"
                  size="sm"
                  leftIcon={<SendHorizontal size={16} />}
                  className="flex-1"
                >
                  Enviar
                </Button>
              </div>
            </Card>
          );
        })}
        </div>
      </div>
    </Card>
  );
}

