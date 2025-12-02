import { useMemo } from 'react';
import { CalendarDays, CalendarRange, Clock3, Sparkles } from 'lucide-react';
import { Badge, Card } from '../../../components/componentsreutilizables';
import { CalendarPost } from '../api';

interface MonthlyCalendarProps {
  month: number;
  year: number;
  posts: CalendarPost[];
  onCreatePost: (date: string) => void;
  onSelectPost: (postId: string) => void;
}

const DAYS_OF_WEEK = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];
const PLATFORM_COLORS: Record<CalendarPost['platform'], string> = {
  Instagram: 'bg-gradient-to-r from-pink-500 to-purple-500 text-white',
  Facebook: 'bg-blue-600 text-white',
  TikTok: 'bg-slate-900 text-white',
  YouTube: 'bg-red-600 text-white',
  LinkedIn: 'bg-blue-500 text-white',
};

const STATUS_BADGES: Record<CalendarPost['status'], { label: string; variant: 'yellow' | 'blue' | 'green' }> = {
  borrador: { label: 'Borrador', variant: 'yellow' },
  programado: { label: 'Programado', variant: 'blue' },
  publicado: { label: 'Publicado', variant: 'green' },
};

export function MonthlyCalendar({ month, year, posts, onCreatePost, onSelectPost }: MonthlyCalendarProps) {
  const monthMatrix = useMemo(() => {
    const date = new Date(year, month, 1);
    const firstDay = date.getDay() === 0 ? 6 : date.getDay() - 1;
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const weeks: Array<Array<number | null>> = [];
    let currentDay = 1 - firstDay;

    while (currentDay <= daysInMonth) {
      const week: Array<number | null> = [];
      for (let i = 0; i < 7; i += 1) {
        if (currentDay < 1 || currentDay > daysInMonth) {
          week.push(null);
        } else {
          week.push(currentDay);
        }
        currentDay += 1;
      }
      weeks.push(week);
    }

    return weeks;
  }, [month, year]);

  const postsByDate = useMemo(() => {
    return posts.reduce<Record<string, CalendarPost[]>>((acc, post) => {
      if (!acc[post.date]) {
        acc[post.date] = [];
      }
      acc[post.date].push(post);
      return acc;
    }, {});
  }, [posts]);

  return (
    <Card padding="none" className="bg-white shadow-sm ring-1 ring-slate-200">
      <div className="px-6 py-5">
        <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm font-semibold text-blue-600">
              <CalendarRange size={18} />
              <span>Calendario mensual</span>
            </div>
            <h2 className="text-xl font-bold text-gray-900">Visión editorial</h2>
            <p className="text-sm text-gray-600">
              Organiza publicaciones de forma visual. Haz clic en un día vacío para crear una nueva o selecciona una existente para editarla.
            </p>
          </div>
          <div className="flex flex-col gap-2 text-sm text-slate-600 md:items-end">
            <span className="rounded-full bg-slate-100 px-3 py-1 font-semibold uppercase tracking-wide text-slate-700">
              {new Date(year, month).toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })}
            </span>
            <div className="flex items-center gap-3 text-xs text-slate-500">
              <span className="flex items-center gap-1">
                <Sparkles size={14} className="text-blue-500" />
                Programado
              </span>
              <span className="flex items-center gap-1">
                <Clock3 size={14} className="text-yellow-500" />
                Borrador
              </span>
              <span className="flex items-center gap-1">
                <CalendarDays size={14} className="text-emerald-500" />
                Publicado
              </span>
            </div>
          </div>
        </header>

        <div className="mt-6 grid grid-cols-7 gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
          {DAYS_OF_WEEK.map(day => (
            <div key={day} className="text-center">
              {day}
            </div>
          ))}
        </div>

        <div className="mt-3 grid grid-cols-7 gap-3">
          {monthMatrix.map((week, weekIndex) =>
            week.map((day, dayIndex) => {
              const date = day ? new Date(year, month, day) : null;
              const dateKey = date?.toISOString().slice(0, 10) ?? '';
              const dayPosts = date ? postsByDate[dateKey] ?? [] : [];
              const isToday =
                date &&
                date.getDate() === new Date().getDate() &&
                date.getMonth() === new Date().getMonth() &&
                date.getFullYear() === new Date().getFullYear();

              return (
                <div
                  key={`${weekIndex}-${dayIndex}`}
                  className={`h-32 rounded-2xl bg-slate-50 p-3 ring-1 ring-slate-200 transition-all ${
                    day
                      ? 'hover:-translate-y-0.5 hover:ring-blue-300 hover:shadow-md'
                      : 'opacity-50'
                  } ${isToday ? 'ring-2 ring-blue-500 bg-white' : ''}`}
                >
                  {day ? (
                    <button
                      onClick={() =>
                        dayPosts.length > 0 ? onSelectPost(dayPosts[0].id) : onCreatePost(dateKey)
                      }
                      className="flex h-full w-full flex-col items-start rounded-xl text-left text-xs text-slate-700"
                    >
                      <span className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-900">
                        {day}
                        {isToday && (
                          <span className="rounded-full bg-blue-100 px-2 py-0.5 text-[10px] font-semibold text-blue-600">
                            Hoy
                          </span>
                        )}
                      </span>
                      <div className="flex-1 space-y-2 overflow-hidden">
                        {dayPosts.map(post => (
                          <div
                            key={post.id}
                            className={`rounded-xl px-3 py-2 text-[11px] font-medium shadow-sm ${PLATFORM_COLORS[post.platform]}`}
                            title={`${post.title} · ${post.platform}`}
                          >
                            <div className="flex items-center justify-between gap-2">
                              <span className="truncate font-semibold">{post.title}</span>
                              <span className="text-[10px] uppercase tracking-wide opacity-75">
                                {post.platform}
                              </span>
                            </div>
                            <div className="mt-1">
                              <Badge
                                variant={STATUS_BADGES[post.status].variant}
                                size="sm"
                              >
                                {STATUS_BADGES[post.status].label}
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                      {dayPosts.length === 0 && (
                        <span className="mt-auto text-[11px] font-semibold text-blue-600">
                          Agregar publicación
                        </span>
                      )}
                    </button>
                  ) : null}
                </div>
              );
            }),
          )}
        </div>
      </div>
    </Card>
  );
}

