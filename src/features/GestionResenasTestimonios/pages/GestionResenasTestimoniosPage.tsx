import { useEffect, useMemo, useState } from 'react';
import {
  BellRing,
  Filter,
  Mail,
  MessageCircleHeart,
  Search,
  Star,
  StarHalf,
  Trophy,
} from 'lucide-react';
import { Button, Card, Input, MetricCards } from '../../../components/componentsreutilizables';
import {
  RatingSummary,
  ReviewChannel,
  UnhappyClient,
  fetchRatingSummary,
  fetchReviewChannels,
  fetchUnhappyClients,
} from '../api';
import { RatingOverview, ReviewRequestChannels, UnhappyClients } from '../components';

export function GestionResenasTestimoniosPage() {
  const [channels, setChannels] = useState<ReviewChannel[]>([]);
  const [ratingSummary, setRatingSummary] = useState<RatingSummary>();
  const [unhappyClients, setUnhappyClients] = useState<UnhappyClient[]>([]);
  const [selectedChannelId, setSelectedChannelId] = useState<ReviewChannel['id']>();
  const [channelSearch, setChannelSearch] = useState('');
  const [clientSearch, setClientSearch] = useState('');

  useEffect(() => {
    const loadData = async () => {
      const [channelsData, ratingData, unhappyData] = await Promise.all([
        fetchReviewChannels(),
        fetchRatingSummary(),
        fetchUnhappyClients(),
      ]);

      setChannels(channelsData);
      setRatingSummary(ratingData);
      setUnhappyClients(unhappyData);

      if (channelsData.length > 0) {
        setSelectedChannelId(channelsData[0].id);
      }
    };

    void loadData();
  }, []);

  const channelOptions = useMemo(() => channels.map(channel => channel.id), [channels]);

  const handleSendRequest = (channelId: ReviewChannel['id']) => {
    alert(`Solicitud enviada vía ${channelId.toUpperCase()} (funcionalidad futura)`);
  };

  const handleFollowUp = (clientId: string) => {
    alert(`Seguimiento programado para ${clientId} (funcionalidad futura)`);
  };

  const metrics = useMemo(() => {
    const totalChannels = channels.length;
    const avgRating = ratingSummary?.average ?? 0;
    const last30Days = ratingSummary?.last30Days ?? 0;
    const totalReviews = ratingSummary?.totalReviews ?? 0;
    const detractors = unhappyClients.length;

    return [
      {
        id: 'avg-rating',
        title: 'Rating promedio',
        value: avgRating ? avgRating.toFixed(1) : '—',
        subtitle: `${totalReviews} reseñas totales`,
        color: 'info' as const,
        icon: <Star size={18} />,
      },
      {
        id: 'recent-reviews',
        title: 'Reseñas últimos 30 días',
        value: last30Days,
        subtitle: 'Campañas activas recientemente',
        color: 'success' as const,
        icon: <Trophy size={18} />,
      },
      {
        id: 'channels-enabled',
        title: 'Canales habilitados',
        value: totalChannels,
        subtitle: channelOptions.join(' · ').toUpperCase() || 'Sin canales configurados',
        color: 'primary' as const,
        icon: <Mail size={18} />,
      },
      {
        id: 'detractors',
        title: 'Clientes a recuperar',
        value: detractors,
        subtitle: 'Marcados con NPS bajo o feedback negativo',
        color: 'warning' as const,
        icon: <BellRing size={18} />,
      },
      {
        id: 'selected-channel',
        title: 'Canal activo',
        value: selectedChannelId ? selectedChannelId.toUpperCase() : '—',
        subtitle: 'Para enviar nuevas solicitudes',
        color: 'info' as const,
        icon: <MessageCircleHeart size={18} />,
      },
    ];
  }, [channels, ratingSummary, unhappyClients, channelOptions, selectedChannelId]);

  const filteredChannels = useMemo(() => {
    const term = channelSearch.trim().toLowerCase();
    if (!term) {
      return channels;
    }

    return channels.filter(channel => {
      return (
        channel.label.toLowerCase().includes(term) ||
        channel.description.toLowerCase().includes(term) ||
        channel.id.toLowerCase().includes(term)
      );
    });
  }, [channels, channelSearch]);

  const filteredClients = useMemo(() => {
    const term = clientSearch.trim().toLowerCase();
    if (!term) {
      return unhappyClients;
    }

    return unhappyClients.filter(client => {
      return (
        client.name.toLowerCase().includes(term) ||
        client.membership.toLowerCase().includes(term) ||
        client.note.toLowerCase().includes(term)
      );
    });
  }, [unhappyClients, clientSearch]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <header className="border-b border-gray-200/60 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6">
          <div className="py-6">
            <div className="flex items-center">
              <div className="mr-4 rounded-xl bg-blue-100 p-2 ring-1 ring-blue-200/70">
                <StarHalf size={24} className="text-blue-600" />
              </div>
              <div>
                <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 md:text-4xl">
                  Gestión de reseñas & testimonios
                </h1>
                <p className="text-gray-600">
                  Solicita reseñas fácilmente, monitoriza tu reputación y detecta clientes descontentos antes de que se den de baja.
                </p>
                {channelOptions.length > 0 && (
                  <p className="text-xs text-gray-500">
                    Canales habilitados: {channelOptions.join(' · ').toUpperCase()}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1600px] px-4 py-8 sm:px-6 lg:px-6">
        <div className="space-y-6">
          <div className="flex items-center justify-end">
            <Button variant="secondary" leftIcon={<Star size={18} />}>
              Crear campaña destacada
            </Button>
          </div>

          <MetricCards data={metrics} columns={5} />

          <Card className="bg-white shadow-sm ring-1 ring-slate-200" padding="md">
            <div className="space-y-4">
              <div className="rounded-2xl bg-slate-50 p-3 ring-1 ring-slate-200">
                <div className="grid gap-4 md:grid-cols-[1fr_auto] md:items-center">
                  <Input
                    value={channelSearch}
                    onChange={event => setChannelSearch(event.target.value)}
                    placeholder="Buscar canales por nombre o descripción..."
                    leftIcon={<Search size={18} />}
                    aria-label="Buscar canales de reseñas"
                  />
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                    <Button variant="secondary" leftIcon={<Filter size={18} />} className="whitespace-nowrap">
                      Filtros avanzados
                    </Button>
                    <Button
                      variant="ghost"
                      onClick={() => setChannelSearch('')}
                      disabled={channelSearch.length === 0}
                      className="whitespace-nowrap text-sm"
                    >
                      Limpiar búsqueda
                    </Button>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-slate-200 pt-4 text-sm text-slate-600">
                <span>{filteredChannels.length} canales disponibles</span>
                <span>{channels.length} total configurados</span>
              </div>
            </div>
          </Card>

          <ReviewRequestChannels
            channels={filteredChannels}
            selectedChannelId={selectedChannelId}
            onSelectChannel={setSelectedChannelId}
            onSendRequest={handleSendRequest}
          />

          <RatingOverview summary={ratingSummary} />

          <Card className="bg-white shadow-sm ring-1 ring-slate-200" padding="md">
            <div className="space-y-4">
              <div className="rounded-2xl bg-slate-50 p-3 ring-1 ring-slate-200">
                <div className="grid gap-4 md:grid-cols-[1fr_auto] md:items-center">
                  <Input
                    value={clientSearch}
                    onChange={event => setClientSearch(event.target.value)}
                    placeholder="Buscar clientes por nombre, nota o membresía..."
                    leftIcon={<Search size={18} />}
                    aria-label="Buscar clientes descontentos"
                  />
                  <Button
                    variant="ghost"
                    onClick={() => setClientSearch('')}
                    disabled={clientSearch.length === 0}
                    className="whitespace-nowrap text-sm"
                  >
                    Limpiar búsqueda
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-slate-200 pt-4 text-sm text-slate-600">
                <span>{filteredClients.length} clientes coinciden con los filtros</span>
                <span>{unhappyClients.length} clientes monitorizados</span>
              </div>
            </div>
          </Card>

          <UnhappyClients clients={filteredClients} onFollowUp={handleFollowUp} />

          <Card padding="lg" className="bg-white text-center shadow-sm ring-1 ring-slate-200">
            <p className="text-lg font-semibold text-gray-900">Próximamente</p>
            <p className="mt-2 text-gray-600">
              Automatizaciones de recordatorio, testimonios destacados para la web y monitor de reseñas externas en tiempo real.
            </p>
          </Card>
        </div>
      </main>
    </div>
  );
}

