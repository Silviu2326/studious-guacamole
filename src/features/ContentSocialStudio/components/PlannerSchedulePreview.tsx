import { useEffect, useMemo, useRef, useState } from 'react';
import {
  CalendarDays,
  CalendarRange,
  ChevronLeft,
  ChevronRight,
  List,
  Loader2,
  RefreshCw,
  Sparkles,
} from 'lucide-react';
import {
  Badge,
  Button,
  Card,
  Input,
  Modal,
  Select,
  Tabs,
  Textarea,
  Tooltip,
} from '../../../components/componentsreutilizables';
import type { PlannerAndSocialSnapshot, PlannerAISuggestion } from '../types';

type PlannerPlatform = PlannerAndSocialSnapshot['planner']['upcoming'][number]['platform'];
type PlannerItem = PlannerAndSocialSnapshot['planner']['upcoming'][number];
type PlannerStatus = PlannerItem['status'];

interface CalendarDay {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
  events: PlannerItem[];
}

const platformStyles: Record<PlannerPlatform, { label: string; className: string }> = {
  instagram: { label: 'Instagram', className: 'bg-gradient-to-r from-pink-500 to-yellow-500 text-white' },
  facebook: { label: 'Facebook', className: 'bg-blue-100 text-blue-700' },
  tiktok: { label: 'TikTok', className: 'bg-slate-900 text-white' },
  linkedin: { label: 'LinkedIn', className: 'bg-sky-100 text-sky-700' },
};

const statusStyles: Record<
  ContentSocialSnapshot['planner']['upcoming'][number]['status'],
  { label: string; className: string }
> = {
  scheduled: { label: 'Programado', className: 'bg-blue-100 text-blue-700' },
  published: { label: 'Publicado', className: 'bg-emerald-100 text-emerald-700' },
  draft: { label: 'Borrador', className: 'bg-slate-100 text-slate-600' },
  failed: { label: 'Error', className: 'bg-rose-100 text-rose-700' },
};

const priorityStyles: Record<'high' | 'medium' | 'low', string> = {
  high: 'bg-rose-100 text-rose-700',
  medium: 'bg-amber-100 text-amber-700',
  low: 'bg-slate-100 text-slate-600',
};

const formatDateInput = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const formatTimeInput = (date: Date) => {
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${hours}:${minutes}`;
};

const weekdays = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'] as const;

const getMonthStart = (date: Date) => new Date(date.getFullYear(), date.getMonth(), 1);

const addMonths = (date: Date, amount: number) => new Date(date.getFullYear(), date.getMonth() + amount, 1);

const getWeekdayIndex = (date: Date) => {
  const day = date.getDay();
  return (day + 6) % 7;
};

const getDateKey = (date: Date) => `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;

const capitalize = (value: string) => value.charAt(0).toUpperCase() + value.slice(1);

const formatMonthLabel = (date: Date) => {
  const formatter = new Intl.DateTimeFormat('es-ES', { month: 'long', year: 'numeric' });
  const raw = formatter.format(date).replace(' de ', ' ');
  return capitalize(raw);
};

const formatTime = (iso: string) =>
  new Date(iso).toLocaleTimeString('es-ES', {
    hour: '2-digit',
    minute: '2-digit',
  });

interface PlannerSchedulePreviewProps {
  planner: PlannerAndSocialSnapshot['planner'];
  loading?: boolean;
}

const formatDateTime = (iso: string) =>
  new Date(iso).toLocaleString('es-ES', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString('es-ES', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

const getPlatformStyle = (platform: PlannerItem['platform']) =>
  platform && platformStyles[platform]
    ? platformStyles[platform]
    : {
        label: platform ? platform.toUpperCase() : 'OTRO',
        className: 'bg-slate-100 text-slate-600',
      };

const getStatusStyle = (status: PlannerStatus | undefined) =>
  status && statusStyles[status]
    ? statusStyles[status]
    : {
        label: status ?? 'Sin estado',
        className: 'bg-slate-100 text-slate-600',
      };

const getContentTypeLabel = (contentType: PlannerItem['contentType']) => {
  if (contentType === 'reel') return 'Reel';
  if (contentType === 'carousel') return 'Carrusel';
  if (contentType === 'story') return 'Story';
  return 'Post';
};

type PlannerPriority = 'high' | 'medium' | 'low';
type PlannerContentType = 'post' | 'reel' | 'carousel' | 'story';
type PlannerDraftStatus = 'draft' | 'scheduled';

interface PlannerDraftForm {
  title: string;
  platform: PlannerPlatform | '';
  date: string;
  time: string;
  type: PlannerContentType;
  status: PlannerDraftStatus;
  priority: PlannerPriority;
  description: string;
  aiAssist: boolean;
}

type PlannerFormErrors = Partial<Record<keyof PlannerDraftForm, string>>;

interface SuggestionDetailForm {
  title: string;
  description: string;
  platform: PlannerPlatform | '';
  priority: PlannerPriority;
  date: string;
  time: string;
  reason: string;
}

type SuggestionFormErrors = Partial<Record<keyof SuggestionDetailForm, string>>;

export function PlannerSchedulePreview({ planner, loading }: PlannerSchedulePreviewProps) {
  const [upcomingPosts, setUpcomingPosts] = useState(() => planner.upcoming);
  const [aiSuggestions, setAiSuggestions] = useState(() => planner.aiSuggestions);

  useEffect(() => {
    setUpcomingPosts(planner.upcoming);
  }, [planner.upcoming]);

  useEffect(() => {
    setAiSuggestions(planner.aiSuggestions);
  }, [planner.aiSuggestions]);

  const computedInitialMonth = useMemo(() => {
    const validDates = upcomingPosts
      .map((item) => new Date(item.scheduledAt))
      .filter((date) => !Number.isNaN(date.getTime()));
    const sortedDates = [...validDates].sort((a, b) => a.getTime() - b.getTime());
    const baseDate = sortedDates[0] ?? new Date();
    return getMonthStart(baseDate);
  }, [upcomingPosts]);

  const [viewMode, setViewMode] = useState<'calendar' | 'table'>('calendar');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState<Date>(computedInitialMonth);
  const submitTimeoutRef = useRef<number | null>(null);
  const suggestionSubmitTimeoutRef = useRef<number | null>(null);
  const [isRefreshingSuggestions, setIsRefreshingSuggestions] = useState(false);

  const computeDefaultSchedule = () => {
    const now = new Date();
    const nextSlot = new Date(now.getTime() + 1000 * 60 * 45);
    nextSlot.setSeconds(0, 0);
    const roundedMinutes = nextSlot.getMinutes();
    if (roundedMinutes >= 45) {
      nextSlot.setMinutes(0);
      nextSlot.setHours(nextSlot.getHours() + 1);
    } else if (roundedMinutes >= 15) {
      nextSlot.setMinutes(30);
    } else {
      nextSlot.setMinutes(15);
    }

    return {
      date: formatDateInput(nextSlot),
      time: formatTimeInput(nextSlot),
    };
  };

  const createInitialFormState = (): PlannerDraftForm => {
    const { date, time } = computeDefaultSchedule();
    return {
      title: '',
      platform: '',
      date,
      time,
      type: 'post',
      status: 'draft',
      priority: 'medium',
      description: '',
      aiAssist: true,
    };
  };

  const [formData, setFormData] = useState<PlannerDraftForm>(() => createInitialFormState());
  const [formErrors, setFormErrors] = useState<PlannerFormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuggestionModalOpen, setIsSuggestionModalOpen] = useState(false);
  const [activeSuggestion, setActiveSuggestion] = useState<PlannerAISuggestion | null>(null);
  const [suggestionForm, setSuggestionForm] = useState<SuggestionDetailForm | null>(null);
  const [suggestionFormErrors, setSuggestionFormErrors] = useState<SuggestionFormErrors>({});
  const [isSavingSuggestion, setIsSavingSuggestion] = useState(false);

  useEffect(() => {
    setCurrentMonth((prev) => {
      if (
        prev.getFullYear() === computedInitialMonth.getFullYear() &&
        prev.getMonth() === computedInitialMonth.getMonth()
      ) {
        return prev;
      }
      return computedInitialMonth;
    });
  }, [computedInitialMonth]);

  useEffect(() => {
    if (isCreateModalOpen) {
      setFormData(createInitialFormState());
      setFormErrors({});
      setIsSubmitting(false);
    }
  }, [isCreateModalOpen]);

  useEffect(() => {
    return () => {
      if (submitTimeoutRef.current) {
        window.clearTimeout(submitTimeoutRef.current);
      }
      if (suggestionSubmitTimeoutRef.current) {
        window.clearTimeout(suggestionSubmitTimeoutRef.current);
      }
    };
  }, []);

  const eventsByDate = useMemo(() => {
    const map = new Map<string, PlannerItem[]>();

    upcomingPosts.forEach((item) => {
      const eventDate = new Date(item.scheduledAt);
      if (Number.isNaN(eventDate.getTime())) {
        return;
      }
      const key = getDateKey(eventDate);
      const existing = map.get(key) ?? [];
      map.set(key, [...existing, item]);
    });

    map.forEach((events, key) => {
      map.set(
        key,
        [...events].sort(
          (a, b) => new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime(),
        ),
      );
    });

    return map;
  }, [upcomingPosts]);

  const calendarDays = useMemo<CalendarDay[]>(() => {
    const startOfMonth = getMonthStart(currentMonth);
    const endOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);

    const startDate = new Date(startOfMonth);
    const startOffset = getWeekdayIndex(startDate);
    startDate.setDate(startDate.getDate() - startOffset);

    const endDate = new Date(endOfMonth);
    const endOffset = getWeekdayIndex(endDate);
    endDate.setDate(endDate.getDate() + (6 - endOffset));

    const days: CalendarDay[] = [];
    const cursor = new Date(startDate);
    const todayKey = getDateKey(new Date());

    while (cursor <= endDate) {
      const dayDate = new Date(cursor);
      const key = getDateKey(dayDate);

      days.push({
        date: dayDate,
        isCurrentMonth: dayDate.getMonth() === currentMonth.getMonth(),
        isToday: key === todayKey,
        events: eventsByDate.get(key) ?? [],
      });

      cursor.setDate(cursor.getDate() + 1);
    }

    return days;
  }, [currentMonth, eventsByDate]);

  const sortedUpcoming = useMemo(
    () =>
      [...upcomingPosts].sort(
        (a, b) => new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime(),
      ),
    [upcomingPosts],
  );

  const hasUpcoming = sortedUpcoming.length > 0;

  const viewTabs = useMemo(
    () => [
      { id: 'calendar', label: 'Calendario', icon: <CalendarDays className="w-4 h-4" /> },
      { id: 'table', label: 'Tabla', icon: <List className="w-4 h-4" /> },
    ],
    [],
  );

  const currentMonthEvents = useMemo(
    () =>
      calendarDays.reduce(
        (count, day) => (day.isCurrentMonth ? count + day.events.length : count),
        0,
      ),
    [calendarDays],
  );

  const emptyMessage =
    'No hay publicaciones programadas. Genera ideas con IA y añádelas al calendario.';

  const monthEmptyMessage = hasUpcoming
    ? 'No hay publicaciones programadas en este mes. Navega para ver otros periodos.'
    : emptyMessage;

  const monthSummaryMessage =
    currentMonthEvents > 0
      ? `${currentMonthEvents} ${
          currentMonthEvents === 1 ? 'publicación en este mes' : 'publicaciones en este mes'
        }`
      : monthEmptyMessage;

  const platformOptions = useMemo(
    () => [
      { value: '', label: 'Selecciona una plataforma', disabled: true },
      { value: 'instagram', label: 'Instagram' },
      { value: 'facebook', label: 'Facebook' },
      { value: 'tiktok', label: 'TikTok' },
      { value: 'linkedin', label: 'LinkedIn' },
    ],
    [],
  );

  const contentTypeOptions = useMemo(
    () => [
      { value: 'post', label: 'Post' },
      { value: 'reel', label: 'Reel' },
      { value: 'carousel', label: 'Carrusel' },
      { value: 'story', label: 'Story' },
    ],
    [],
  );

  const statusOptions = useMemo(
    () => [
      { value: 'draft', label: 'Borrador' },
      { value: 'scheduled', label: 'Programado' },
    ],
    [],
  );

  const priorityOptions = useMemo(
    () => [
      { value: 'high', label: 'Alta' },
      { value: 'medium', label: 'Media' },
      { value: 'low', label: 'Baja' },
    ],
    [],
  );

  const handleFieldChange = <K extends keyof PlannerDraftForm>(field: K, value: PlannerDraftForm[K]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (formErrors[field]) {
      setFormErrors((prev) => {
        const updated = { ...prev };
        delete updated[field];
        return updated;
      });
    }
  };

  const resetFormState = () => {
    if (submitTimeoutRef.current) {
      window.clearTimeout(submitTimeoutRef.current);
      submitTimeoutRef.current = null;
    }
    setFormData(createInitialFormState());
    setFormErrors({});
    setIsSubmitting(false);
  };

  const buildSuggestionForm = (suggestion: PlannerAISuggestion): SuggestionDetailForm => {
    const scheduleDate = new Date(suggestion.scheduledFor);
    const isValidDate = !Number.isNaN(scheduleDate.getTime());
    const fallback = computeDefaultSchedule();
    return {
      title: suggestion.title,
      description: suggestion.description,
      platform: suggestion.platform ?? '',
      priority: suggestion.priority,
      date: isValidDate ? formatDateInput(scheduleDate) : fallback.date,
      time: isValidDate ? formatTimeInput(scheduleDate) : fallback.time,
      reason: suggestion.reason,
    };
  };

  const resetSuggestionFormState = () => {
    if (suggestionSubmitTimeoutRef.current) {
      window.clearTimeout(suggestionSubmitTimeoutRef.current);
      suggestionSubmitTimeoutRef.current = null;
    }
    setSuggestionForm(null);
    setSuggestionFormErrors({});
    setActiveSuggestion(null);
    setIsSavingSuggestion(false);
  };

  const handleCloseCreateModal = () => {
    setIsCreateModalOpen(false);
    resetFormState();
  };

  const handleCreatePost = () => {
    const errors: PlannerFormErrors = {};

    if (!formData.title.trim()) {
      errors.title = 'El título es obligatorio';
    }
    if (!formData.platform) {
      errors.platform = 'Selecciona una plataforma';
    }
    if (!formData.date) {
      errors.date = 'Selecciona una fecha';
    }
    if (!formData.time) {
      errors.time = 'Selecciona una hora';
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setIsSubmitting(true);
    submitTimeoutRef.current = window.setTimeout(() => {
      resetFormState();
      setIsCreateModalOpen(false);
    }, 600);
  };

  const handleOpenSuggestionDetails = (suggestion: PlannerAISuggestion) => {
    setActiveSuggestion(suggestion);
    setSuggestionForm(buildSuggestionForm(suggestion));
    setSuggestionFormErrors({});
    setIsSavingSuggestion(false);
    setIsSuggestionModalOpen(true);
  };

  const handleSuggestionFieldChange = <K extends keyof SuggestionDetailForm>(
    field: K,
    value: SuggestionDetailForm[K],
  ) => {
    if (!suggestionForm) return;
    setSuggestionForm({ ...suggestionForm, [field]: value });
    if (suggestionFormErrors[field]) {
      setSuggestionFormErrors((prev) => {
        const updated = { ...prev };
        delete updated[field];
        return updated;
      });
    }
  };

  const handleCloseSuggestionModal = () => {
    setIsSuggestionModalOpen(false);
    resetSuggestionFormState();
  };

  const handleSaveSuggestionDetails = () => {
    if (!activeSuggestion || !suggestionForm) return;
    const errors: SuggestionFormErrors = {};

    if (!suggestionForm.title.trim()) {
      errors.title = 'El título es obligatorio';
    }
    if (!suggestionForm.platform) {
      errors.platform = 'Selecciona una plataforma';
    }
    if (!suggestionForm.date) {
      errors.date = 'Selecciona una fecha';
    }
    if (!suggestionForm.time) {
      errors.time = 'Selecciona una hora';
    }

    if (Object.keys(errors).length > 0) {
      setSuggestionFormErrors(errors);
      return;
    }

    const updatedScheduledFor = `${suggestionForm.date}T${suggestionForm.time}`;

    const updatedSuggestion: PlannerAISuggestion = {
      ...activeSuggestion,
      title: suggestionForm.title,
      description: suggestionForm.description,
      platform: suggestionForm.platform as PlannerPlatform,
      priority: suggestionForm.priority,
      scheduledFor: updatedScheduledFor,
      reason: suggestionForm.reason,
    };

    setIsSavingSuggestion(true);
    suggestionSubmitTimeoutRef.current = window.setTimeout(() => {
      setAiSuggestions((prev) =>
        prev.map((item) => (item.id === activeSuggestion.id ? updatedSuggestion : item)),
      );
      setIsSavingSuggestion(false);
      setIsSuggestionModalOpen(false);
      resetSuggestionFormState();
    }, 500);
  };

  const handleInsertSuggestion = (suggestion: PlannerAISuggestion) => {
    let effectiveSuggestion = suggestion;

    if (activeSuggestion?.id === suggestion.id && suggestionForm) {
      const errors: SuggestionFormErrors = {};

      if (!suggestionForm.title.trim()) {
        errors.title = 'El título es obligatorio';
      }
      if (!suggestionForm.platform) {
        errors.platform = 'Selecciona una plataforma';
      }
      if (!suggestionForm.date) {
        errors.date = 'Selecciona una fecha';
      }
      if (!suggestionForm.time) {
        errors.time = 'Selecciona una hora';
      }

      if (Object.keys(errors).length > 0) {
        setSuggestionFormErrors(errors);
        return;
      }

      effectiveSuggestion = {
        ...suggestion,
        title: suggestionForm.title,
        description: suggestionForm.description,
        platform: suggestionForm.platform as PlannerPlatform,
        priority: suggestionForm.priority,
        scheduledFor: `${suggestionForm.date}T${suggestionForm.time}`,
        reason: suggestionForm.reason,
      };
    }

    const newPost: PlannerItem = {
      id: `suggestion-${effectiveSuggestion.id}-${Date.now()}`,
      title: effectiveSuggestion.title,
      scheduledAt: effectiveSuggestion.scheduledFor,
      platform: effectiveSuggestion.platform as PlannerPlatform,
      status: 'scheduled',
      contentType: 'post',
      aiGenerated: true,
    };

    setUpcomingPosts((prev) => [...prev, newPost]);
    setAiSuggestions((prev) => prev.filter((item) => item.id !== suggestion.id));

    if (activeSuggestion?.id === suggestion.id) {
      handleCloseSuggestionModal();
    }
  };

  const previewDate = useMemo(() => {
    if (!formData.date) return null;
    const dateString = `${formData.date}${formData.time ? `T${formData.time}` : ''}`;
    const parsed = new Date(dateString);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  }, [formData.date, formData.time]);

  const previewScheduleLabel = previewDate
    ? previewDate.toLocaleString('es-ES', {
        weekday: 'short',
        day: '2-digit',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit',
      })
    : 'Programación pendiente';

  const previewPlatform = formData.platform
    ? getPlatformStyle(formData.platform)
    : null;

  const previewStatus = getStatusStyle(formData.status as PlannerStatus);
  const previewPriorityStyle = priorityStyles[formData.priority];

  const isSubmitDisabled = isSubmitting;
  const baselineUpcomingCount = planner.upcoming.length;
  const additionalBacklog = upcomingPosts.length - baselineUpcomingCount;
  const derivedBacklogCount = Math.max(0, planner.backlogCount + additionalBacklog);
  const suggestionPreviewDate = useMemo(() => {
    if (!suggestionForm) return null;
    const base = `${suggestionForm.date}${suggestionForm.time ? `T${suggestionForm.time}` : ''}`;
    const parsed = new Date(base);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  }, [suggestionForm]);

  const suggestionPreviewLabel = suggestionPreviewDate
    ? suggestionPreviewDate.toLocaleString('es-ES', {
        weekday: 'short',
        day: '2-digit',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit',
      })
    : 'Programación pendiente';

  const suggestionPlatformStyle =
    suggestionForm && suggestionForm.platform
      ? getPlatformStyle(suggestionForm.platform as PlannerPlatform)
      : null;
  const suggestionPriorityStyle =
    suggestionForm ? priorityStyles[suggestionForm.priority] : priorityStyles.medium;
  const handleRefreshSuggestions = () => {
    if (isRefreshingSuggestions) return;
    setIsRefreshingSuggestions(true);
    window.setTimeout(() => {
      setIsRefreshingSuggestions(false);
    }, 800);
  };

  const handlePrevMonth = () => setCurrentMonth((prev) => addMonths(prev, -1));
  const handleNextMonth = () => setCurrentMonth((prev) => addMonths(prev, 1));
  const handleResetMonth = () => setCurrentMonth(getMonthStart(new Date()));

  if (loading) {
    return (
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <Card className="p-6 xl:col-span-2">
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
          </div>
        </Card>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <Card className="p-0 xl:col-span-2 shadow-sm border border-slate-100">
        <div className="px-6 py-5 border-b border-slate-100">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-xl font-semibold text-slate-900 flex items-center gap-2">
                <CalendarRange className="w-5 h-5 text-indigo-500" />
                Próximos contenidos
              </h2>
              <p className="text-sm text-slate-500">
                Cobertura de {planner.coverageDays} días · {derivedBacklogCount} borradores listos
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
              <Tabs
                items={viewTabs}
                activeTab={viewMode}
                onTabChange={(tabId) => setViewMode(tabId as 'calendar' | 'table')}
                variant="pills"
                size="sm"
                className="sm:justify-end"
              />
              <Button variant="secondary" size="sm" onClick={() => setIsCreateModalOpen(true)}>
                Crear post
              </Button>
            </div>
          </div>
        </div>

        <div className="px-6 py-6">
          {viewMode === 'calendar' ? (
            <div className="space-y-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="space-y-1">
                  <h3 className="text-lg font-semibold text-slate-900 capitalize">
                    {formatMonthLabel(currentMonth)}
                  </h3>
                  <p className="text-sm text-slate-500">{monthSummaryMessage}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="px-0 py-0 w-9 h-9 rounded-xl border border-slate-200"
                    onClick={handlePrevMonth}
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="hidden sm:inline-flex text-indigo-600 hover:text-indigo-700"
                    onClick={handleResetMonth}
                  >
                    Mes actual
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="px-0 py-0 w-9 h-9 rounded-xl border border-slate-200"
                    onClick={handleNextMonth}
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-100 overflow-hidden">
                <div className="grid grid-cols-7 bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  {weekdays.map((day) => (
                    <div key={day} className="px-3 py-2 text-center">
                      {day}
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-7 gap-px bg-slate-100">
                  {calendarDays.map((day) => {
                    const dayKey = `${day.date.getFullYear()}-${day.date.getMonth()}-${day.date.getDate()}`;
                    const visibleEvents = day.events.slice(0, 3);
                    const remainingEvents = day.events.length - visibleEvents.length;

                    return (
                      <div
                        key={dayKey}
                        className={`min-h-[140px] p-3 flex flex-col gap-2 ${
                          day.isCurrentMonth ? 'bg-white' : 'bg-slate-50 text-slate-400'
                        } ${day.isToday ? 'ring-1 ring-indigo-400' : ''}`}
                      >
                        <div className="flex items-center justify-between">
                          <span
                            className={`text-sm font-semibold ${
                              day.isCurrentMonth ? 'text-slate-900' : 'text-slate-400'
                            }`}
                          >
                            {day.date.getDate()}
                          </span>
                          {day.isToday ? (
                            <span className="text-[10px] font-semibold uppercase text-indigo-500">Hoy</span>
                          ) : null}
                        </div>
                        <div className="flex flex-1 flex-col gap-2">
                          {visibleEvents.map((event) => {
                            const platform = getPlatformStyle(event.platform);
                            const status = getStatusStyle(event.status);

                            return (
                              <div
                                key={event.id}
                                className="rounded-xl border border-slate-200 bg-white px-2 py-2 shadow-sm"
                              >
                                <div className="flex items-start justify-between gap-2">
                                  <p className="text-[11px] font-semibold text-slate-900 truncate">
                                    {event.title}
                                  </p>
                                  {event.aiGenerated ? (
                                    <Tooltip content="Copy enriquecido con IA">
                                      <Sparkles className="w-3 h-3 text-violet-500 shrink-0" />
                                    </Tooltip>
                                  ) : null}
                                </div>
                                <div className="mt-1 flex flex-wrap items-center gap-1">
                                  <span className="inline-flex items-center rounded-full bg-indigo-50 px-2 py-0.5 text-[10px] font-semibold text-indigo-600">
                                    {formatTime(event.scheduledAt)}
                                  </span>
                                  <span
                                    className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold ${platform.className}`}
                                  >
                                    {platform.label}
                                  </span>
                                  <span
                                    className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium ${status.className}`}
                                  >
                                    {status.label}
                                  </span>
                                </div>
                              </div>
                            );
                          })}
                          {remainingEvents > 0 ? (
                            <span className="text-[10px] font-medium text-indigo-600">
                              +{remainingEvents}{' '}
                              {remainingEvents === 1 ? 'contenido más' : 'contenidos más'}
                            </span>
                          ) : null}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {currentMonthEvents === 0 ? (
                <p className="text-sm text-slate-500 text-center">{monthEmptyMessage}</p>
              ) : null}
            </div>
          ) : hasUpcoming ? (
            <div className="overflow-x-auto rounded-2xl border border-slate-100">
              <table className="w-full min-w-[820px] text-sm">
                <thead className="bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  <tr>
                    <th className="px-4 py-3 text-left">Fecha</th>
                    <th className="px-4 py-3 text-left">Hora</th>
                    <th className="px-4 py-3 text-left">Plataforma</th>
                    <th className="px-4 py-3 text-left">Estado</th>
                    <th className="px-4 py-3 text-left">Tipo</th>
                    <th className="px-4 py-3 text-left">Título</th>
                    <th className="px-4 py-3 text-left">Campaña</th>
                    <th className="px-4 py-3 text-left">IA</th>
                    <th className="px-4 py-3 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {sortedUpcoming.map((item) => {
                    const platform = getPlatformStyle(item.platform);
                    const status = getStatusStyle(item.status);
                    const contentType = getContentTypeLabel(item.contentType);
                    const campaign = item.campaign ?? '—';

                    return (
                      <tr key={item.id} className="bg-white">
                        <td className="px-4 py-3 text-slate-700">{formatDate(item.scheduledAt)}</td>
                        <td className="px-4 py-3 text-slate-700">{formatTime(item.scheduledAt)}</td>
                        <td className="px-4 py-3">
                          <span
                            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${platform.className}`}
                          >
                            {platform.label}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${status.className}`}
                          >
                            {status.label}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-slate-700">{contentType}</td>
                        <td className="px-4 py-3 text-slate-900 font-medium">{item.title}</td>
                        <td className="px-4 py-3 text-slate-700">{campaign}</td>
                        <td className="px-4 py-3 text-slate-700">
                          {item.aiGenerated ? (
                            <Tooltip content="Copy enriquecido con IA">
                              <span className="inline-flex items-center gap-1 rounded-full bg-violet-100 px-2 py-0.5 text-xs font-semibold text-violet-600">
                                <Sparkles className="w-3 h-3" />
                                IA
                              </span>
                            </Tooltip>
                          ) : (
                            '—'
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-slate-500 hover:text-slate-700"
                            >
                              Ver
                            </Button>
                            <Button variant="secondary" size="sm" className="text-indigo-600">
                              Editar
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="py-12 text-center text-slate-500">{emptyMessage}</div>
          )}
        </div>
      </Card>

        <Card className="p-0 shadow-sm border border-slate-100">
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-violet-500" />
              Sugerencias IA
            </h3>
            <p className="text-sm text-slate-500">Ideas accionables para cubrir huecos del calendario</p>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="purple" size="sm">
              {aiSuggestions.length} ideas
            </Badge>
            <Button
              variant="ghost"
              size="sm"
              className="text-violet-600 hover:text-violet-700"
              onClick={handleRefreshSuggestions}
              disabled={isRefreshingSuggestions}
              leftIcon={<RefreshCw className="w-4 h-4" />}
            >
              {isRefreshingSuggestions ? 'Actualizando...' : 'Recargar'}
            </Button>
          </div>
        </div>

        <div className="p-6 space-y-4">
          {aiSuggestions.length === 0 ? (
            <p className="text-sm text-slate-500">
              Lanza el Generador de Ideas para obtener recomendaciones personalizadas.
            </p>
          ) : (
            aiSuggestions.map((suggestion) => (
              <div key={suggestion.id} className="rounded-2xl border border-slate-100 p-4 bg-slate-50">
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      {(() => {
                        const platformStyle =
                          platformStyles[suggestion.platform as PlannerPlatform] ?? {
                            label: suggestion.platform ? suggestion.platform.toUpperCase() : 'OTRO',
                            className: 'bg-slate-100 text-slate-600',
                          };
                        return (
                          <span
                            className={`text-xs font-semibold px-2.5 py-1 rounded-full ${platformStyle.className}`}
                          >
                            {platformStyle.label}
                          </span>
                        );
                      })()}
                      <span
                        className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                          priorityStyles[suggestion.priority]
                        }`}
                      >
                        Prioridad{' '}
                        {suggestion.priority === 'high'
                          ? 'alta'
                          : suggestion.priority === 'medium'
                          ? 'media'
                          : 'baja'}
                      </span>
                    </div>
                    <p className="text-sm font-semibold text-slate-900">{suggestion.title}</p>
                    <p className="text-sm text-slate-500">{suggestion.description}</p>
                    <p className="text-xs text-slate-400">
                      Recomendado para {formatDateTime(suggestion.scheduledFor)}
                    </p>
                  </div>
                </div>

                <div className="mt-3 flex gap-3">
                  <Button variant="secondary" size="sm" onClick={() => handleInsertSuggestion(suggestion)}>
                    Insertar en Planner
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleOpenSuggestionDetails(suggestion)}>
                    Ver detalles
                  </Button>
                </div>
                <p className="text-xs text-slate-400 mt-3">{suggestion.reason}</p>
              </div>
            ))
          )}
          {isRefreshingSuggestions ? (
            <div className="rounded-xl border border-dashed border-violet-200 bg-violet-50 px-4 py-3 text-xs text-violet-600">
              Actualizando recomendaciones personalizadas...
            </div>
          ) : null}
        </div>
        </Card>
      </div>

      <Modal
        isOpen={isCreateModalOpen}
        onClose={handleCloseCreateModal}
        title="Crear nuevo contenido"
        size="lg"
        footer={
          <div className="flex gap-3">
            <Button variant="ghost" size="sm" onClick={handleCloseCreateModal} disabled={isSubmitting}>
              Cancelar
            </Button>
            <Button size="sm" onClick={handleCreatePost} loading={isSubmitting} disabled={isSubmitDisabled}>
              Guardar borrador
            </Button>
          </div>
        }
      >
        <div className="space-y-6">
          <div className="flex flex-col gap-2">
            <p className="text-sm font-semibold text-indigo-600">Planifica con contexto</p>
            <p className="text-sm text-slate-500">
              Completa la información básica para programar un nuevo contenido. Ajustaremos los detalles más
              adelante desde el planner completo.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Input
              label="Título"
              placeholder="Ej. Lanzamiento de nuevo producto"
              value={formData.title}
              maxLength={80}
              onChange={(event) => handleFieldChange('title', event.target.value)}
              error={formErrors.title}
            />
            <Select
              label="Plataforma"
              value={formData.platform}
              onChange={(event) => handleFieldChange('platform', event.target.value as PlannerPlatform | '')}
              options={platformOptions}
              placeholder="Selecciona una plataforma"
              error={formErrors.platform}
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Input
              label="Fecha"
              type="date"
              value={formData.date}
              onChange={(event) => handleFieldChange('date', event.target.value)}
              error={formErrors.date}
            />
            <Input
              label="Hora"
              type="time"
              value={formData.time}
              onChange={(event) => handleFieldChange('time', event.target.value)}
              error={formErrors.time}
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Select
              label="Tipo de contenido"
              value={formData.type}
              onChange={(event) => handleFieldChange('type', event.target.value as PlannerContentType)}
              options={contentTypeOptions}
              helperText="Define el formato para organizar entregables y recursos."
            />
            <Select
              label="Estado inicial"
              value={formData.status}
              onChange={(event) => handleFieldChange('status', event.target.value as PlannerDraftStatus)}
              options={statusOptions}
              helperText="Puedes cambiarlo después desde la vista calendarizada."
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Select
              label="Prioridad editorial"
              value={formData.priority}
              onChange={(event) => handleFieldChange('priority', event.target.value as PlannerPriority)}
              options={priorityOptions}
              helperText="Ayuda a priorizar cuando haya huecos o conflictos en la agenda."
            />
            <div className="space-y-2">
              <span className="text-sm font-semibold text-slate-700">Copy asistido por IA</span>
              <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                <div className="flex items-center gap-2">
                  <Tooltip content="Activa para recibir sugerencias de copy y hashtags contextuales.">
                    <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-violet-100 text-violet-600">
                      <Sparkles className="h-4 w-4" />
                    </span>
                  </Tooltip>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">Enriquecer copy con IA</p>
                    <p className="text-xs text-slate-500">
                      Recomendaciones personalizadas al guardar el borrador.
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleFieldChange('aiAssist', !formData.aiAssist)}
                  className={`relative inline-flex h-6 w-12 items-center rounded-full transition-colors ${
                    formData.aiAssist ? 'bg-indigo-500' : 'bg-slate-300'
                  }`}
                  aria-pressed={formData.aiAssist}
                  aria-label="Alternar copy asistido por IA"
                >
                  <span
                    className={`absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
                      formData.aiAssist ? 'translate-x-6' : ''
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          <Textarea
            label="Descripción"
            placeholder="Describe la idea principal, CTA y recursos necesarios..."
            rows={4}
            value={formData.description}
            onChange={(event) => handleFieldChange('description', event.target.value)}
            showCount
            maxLength={320}
            helperText="Incluye notas para el equipo creativo o enlaces a referencias."
          />

          <div className="space-y-3 rounded-2xl border border-slate-100 bg-slate-50 p-5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Resumen del borrador
              </span>
              {previewPlatform ? (
                <span
                  className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${previewPlatform.className}`}
                >
                  {previewPlatform.label}
                </span>
              ) : null}
              <span
                className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${previewStatus.className}`}
              >
                {previewStatus.label}
              </span>
              <span
                className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${previewPriorityStyle}`}
              >
                Prioridad {formData.priority === 'high' ? 'alta' : formData.priority === 'medium' ? 'media' : 'baja'}
              </span>
              <span className="inline-flex items-center rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-600">
                {getContentTypeLabel(formData.type)}
              </span>
              {formData.aiAssist ? (
                <span className="inline-flex items-center gap-1 rounded-full bg-violet-100 px-3 py-1 text-xs font-semibold text-violet-600">
                  <Sparkles className="h-3 w-3" />
                  IA activada
                </span>
              ) : null}
            </div>

            <div className="space-y-1">
              <p className="text-sm font-semibold text-slate-900">
                {formData.title.trim() ? formData.title : 'Nuevo contenido sin título'}
              </p>
              <p className="text-xs font-medium text-indigo-600">{previewScheduleLabel}</p>
            </div>
            <p className="text-sm text-slate-600">
              {formData.description.trim()
                ? formData.description
                : 'Añade una descripción para orientar al equipo sobre el mensaje y los recursos necesarios.'}
            </p>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={isSuggestionModalOpen && !!suggestionForm && !!activeSuggestion}
        onClose={handleCloseSuggestionModal}
        title="Detalles de sugerencia IA"
        size="lg"
        footer={
          <div className="flex flex-wrap gap-3">
            <Button variant="ghost" size="sm" onClick={handleCloseSuggestionModal} disabled={isSavingSuggestion}>
              Cerrar
            </Button>
            {activeSuggestion ? (
              <Button
                variant="secondary"
                size="sm"
                onClick={() => handleInsertSuggestion(activeSuggestion)}
                disabled={isSavingSuggestion}
              >
                Insertar en planner
              </Button>
            ) : null}
            <Button
              size="sm"
              onClick={handleSaveSuggestionDetails}
              loading={isSavingSuggestion}
              disabled={isSavingSuggestion}
            >
              Guardar cambios
            </Button>
          </div>
        }
      >
        {suggestionForm ? (
          <div className="space-y-6">
            <div className="flex flex-col gap-2">
              <p className="text-sm font-semibold text-violet-600">Revisa y personaliza la recomendación</p>
              <p className="text-sm text-slate-500">
                Ajusta los detalles antes de insertarla en tu calendario. Puedes convertirla en borrador o
                programarla directamente.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <Input
                label="Título"
                placeholder="Ej. Anuncio de webinar sobre tendencias"
                value={suggestionForm.title}
                maxLength={100}
                onChange={(event) => handleSuggestionFieldChange('title', event.target.value)}
                error={suggestionFormErrors.title}
              />
              <Select
                label="Plataforma"
                value={suggestionForm.platform}
                onChange={(event) =>
                  handleSuggestionFieldChange('platform', event.target.value as PlannerPlatform | '')
                }
                options={platformOptions}
                placeholder="Selecciona una plataforma"
                error={suggestionFormErrors.platform}
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <Input
                label="Fecha"
                type="date"
                value={suggestionForm.date}
                onChange={(event) => handleSuggestionFieldChange('date', event.target.value)}
                error={suggestionFormErrors.date}
              />
              <Input
                label="Hora"
                type="time"
                value={suggestionForm.time}
                onChange={(event) => handleSuggestionFieldChange('time', event.target.value)}
                error={suggestionFormErrors.time}
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <Select
                label="Prioridad"
                value={suggestionForm.priority}
                onChange={(event) =>
                  handleSuggestionFieldChange('priority', event.target.value as PlannerPriority)
                }
                options={priorityOptions}
              />
              <Input
                label="Motivo destacado"
                placeholder="Ej. Mayor engagement en martes por la tarde"
                value={suggestionForm.reason}
                onChange={(event) => handleSuggestionFieldChange('reason', event.target.value)}
              />
            </div>

            <Textarea
              label="Descripción"
              placeholder="Describe el ángulo creativo, CTA y recursos sugeridos por la IA."
              rows={4}
              value={suggestionForm.description}
              onChange={(event) => handleSuggestionFieldChange('description', event.target.value)}
              showCount
              maxLength={320}
            />

            <div className="space-y-3 rounded-2xl border border-violet-100 bg-violet-50 p-5">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-semibold uppercase tracking-wide text-violet-600">
                  Vista previa
                </span>
                {suggestionPlatformStyle ? (
                  <span
                    className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${suggestionPlatformStyle.className}`}
                  >
                    {suggestionPlatformStyle.label}
                  </span>
                ) : null}
                <span
                  className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${suggestionPriorityStyle}`}
                >
                  Prioridad{' '}
                  {suggestionForm.priority === 'high'
                    ? 'alta'
                    : suggestionForm.priority === 'medium'
                    ? 'media'
                    : 'baja'}
                </span>
              </div>

              <div className="space-y-1">
                <p className="text-sm font-semibold text-slate-900">
                  {suggestionForm.title.trim() ? suggestionForm.title : 'Sugerencia sin título'}
                </p>
                <p className="text-xs font-medium text-violet-600">{suggestionPreviewLabel}</p>
              </div>
              <p className="text-sm text-slate-600">
                {suggestionForm.description.trim()
                  ? suggestionForm.description
                  : 'Añade más contexto creativo para orientar la ejecución del contenido.'}
              </p>
            </div>
          </div>
        ) : null}
      </Modal>
    </>
  );
}

