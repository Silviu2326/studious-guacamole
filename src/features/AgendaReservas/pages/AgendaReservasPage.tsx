import { useEffect, useMemo, useState } from 'react';
import {
  Calendar,
  ClipboardList,
  Download,
  Filter,
  ListChecks,
  RefreshCcw,
  Search,
  Sparkles,
  Timer,
} from 'lucide-react';
import {
  Button,
  Card,
  Input,
  MetricCards,
  Tabs,
  type MetricCardData,
  type TabItem,
} from '../../../components/componentsreutilizables';
import {
  fetchAbsences,
  fetchAgendaEvents,
  fetchChallenges,
  fetchOnlineReservations,
  fetchWaitlist,
  type AbsenceRecord,
  type AgendaEvent,
  type ChallengeEvent,
  type OnlineReservationChannel,
  type WaitlistEntry,
} from '../api';
import {
  AbsencesPanel,
  AgendaCalendarCard,
  ChallengesPanel,
  OnlineReservationsPanel,
  WaitlistTable,
} from '../components';

const TAB_ITEMS: TabItem[] = [
  { id: 'calendar', label: 'Calendario', icon: <Calendar className="h-4 w-4" /> },
  { id: 'reservations', label: 'Reservas online', icon: <Filter className="h-4 w-4" /> },
  { id: 'waitlist', label: 'Lista de espera', icon: <ClipboardList className="h-4 w-4" /> },
  { id: 'absences', label: 'Ausencias / cancelaciones', icon: <Timer className="h-4 w-4" /> },
  { id: 'events', label: 'Eventos & retos', icon: <Sparkles className="h-4 w-4" /> },
];

export function AgendaReservasPage() {
  const [agendaEvents, setAgendaEvents] = useState<AgendaEvent[]>([]);
  const [onlineChannels, setOnlineChannels] = useState<OnlineReservationChannel[]>([]);
  const [waitlist, setWaitlist] = useState<WaitlistEntry[]>([]);
  const [absences, setAbsences] = useState<AbsenceRecord[]>([]);
  const [challenges, setChallenges] = useState<ChallengeEvent[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<string>('calendar');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const [eventsData, onlineData, waitlistData, absencesData, challengesData] = await Promise.all([
        fetchAgendaEvents(),
        fetchOnlineReservations(),
        fetchWaitlist(),
        fetchAbsences(),
        fetchChallenges(),
      ]);

      setAgendaEvents(eventsData);
      setOnlineChannels(onlineData);
      setWaitlist(waitlistData);
      setAbsences(absencesData);
      setChallenges(challengesData);
      setLoading(false);
    };

    void loadData();
  }, []);

  const metrics: MetricCardData[] = useMemo(() => {
    const confirmedSessions = agendaEvents.length;
    const occupancyAverage =
      agendaEvents.length > 0
        ? agendaEvents.reduce((sum, event) => sum + event.attendees / event.capacity, 0) /
          agendaEvents.length
        : 0;
    const onlineActive = onlineChannels.filter(channel => channel.status === 'activo').length;

    return [
      {
        id: 'sessions',
        title: 'Sesiones programadas',
        value: confirmedSessions,
        subtitle: 'Hoy & próximos 2 días',
        color: 'primary',
        icon: <Calendar size={18} />,
      },
      {
        id: 'occupancy',
        title: 'Ocupación promedio',
        value: `${Math.round(occupancyAverage * 100)}%`,
        subtitle: 'Clases con reserva previa',
        color: 'info',
        icon: <ListChecks size={18} />,
      },
      {
        id: 'online-channels',
        title: 'Canales activos',
        value: onlineActive,
        subtitle: `${onlineChannels.length} conectados en total`,
        color: 'success',
        icon: <Filter size={18} />,
      },
      {
        id: 'waitlist-count',
        title: 'En lista de espera',
        value: waitlist.length,
        subtitle: 'Prioriza alertas automáticas',
        color: 'warning',
        icon: <ClipboardList size={18} />,
      },
    ];
  }, [agendaEvents, onlineChannels, waitlist]);

  const filteredWaitlist = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return waitlist;

    return waitlist.filter(entry => {
      return entry.member.toLowerCase().includes(term) || entry.session.toLowerCase().includes(term);
    });
  }, [waitlist, searchTerm]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <header className="border-b border-slate-200/60 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/70">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6">
          <div className="py-8">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-4">
                <div className="rounded-2xl bg-gradient-to-br from-teal-100 to-blue-100 p-3 ring-1 ring-teal-200/60">
                  <Calendar className="h-7 w-7 text-teal-600" />
                </div>
                <div>
                  <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 md:text-4xl">
                    Agenda & Reservas
                  </h1>
                  <p className="mt-1 max-w-2xl text-sm text-slate-600 md:text-base">
                    Coordina disponibilidad, optimiza ocupación y ofrece experiencias fluidas en cada
                    punto de contacto.
                  </p>
                </div>
              </div>
              <div className="flex flex-col gap-2 sm:flex-row">
                <Button variant="secondary" leftIcon={<Download size={16} />}>
                  Exportar agenda
                </Button>
                <Button variant="ghost" leftIcon={<RefreshCcw size={16} />} onClick={() => setSearchTerm('')}>
                  Refrescar datos
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1600px] px-4 py-8 sm:px-6 lg:px-6">
        <div className="space-y-8">
          <MetricCards data={metrics} columns={4} />

          <Tabs items={TAB_ITEMS} activeTab={activeTab} onTabChange={setActiveTab} variant="underline" />

          {activeTab === 'calendar' && (
            <>
              {loading ? (
                <div className="h-72 animate-pulse rounded-2xl bg-slate-100 dark:bg-slate-800" />
              ) : (
                <AgendaCalendarCard events={agendaEvents} />
              )}
            </>
          )}

          {activeTab === 'reservations' && (
            <>
              {loading ? (
                <div className="h-48 animate-pulse rounded-2xl bg-slate-100 dark:bg-slate-800" />
              ) : (
                <OnlineReservationsPanel channels={onlineChannels} />
              )}
            </>
          )}

          {activeTab === 'waitlist' && (
            <div className="space-y-6">
              <Card className="bg-white shadow-sm ring-1 ring-slate-200/70 dark:ring-slate-700/40" padding="lg">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                  <div>
                    <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Lista de espera</h2>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Automatiza notificaciones y libera plazas según reglas de negocio.
                    </p>
                  </div>
                  <div className="w-full max-w-sm">
                    <Input
                      value={searchTerm}
                      onChange={event => setSearchTerm(event.target.value)}
                      placeholder="Buscar por miembro o sesión"
                      leftIcon={<Search size={16} />}
                      aria-label="Buscar lista de espera"
                    />
                  </div>
                </div>
              </Card>

              {loading ? (
                <div className="h-48 animate-pulse rounded-2xl bg-slate-100 dark:bg-slate-800" />
              ) : (
                <WaitlistTable entries={filteredWaitlist} />
              )}
            </div>
          )}

          {activeTab === 'absences' && (
            <>
              {loading ? (
                <div className="h-48 animate-pulse rounded-2xl bg-slate-100 dark:bg-slate-800" />
              ) : (
                <AbsencesPanel records={absences} />
              )}
            </>
          )}

          {activeTab === 'events' && (
            <>
              {loading ? (
                <div className="h-48 animate-pulse rounded-2xl bg-slate-100 dark:bg-slate-800" />
              ) : (
                <ChallengesPanel challenges={challenges} />
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
}











