import { useState, useEffect } from 'react';
import { Calendar, Sparkles, Copy, Send, Clock, Hash, Video, RefreshCw, ChevronLeft, ChevronRight, CheckCircle2 } from 'lucide-react';
import { Button, Card, Badge, Modal, Textarea, Input } from '../../../components/componentsreutilizables';
import type { WeeklyAICalendar, WeeklyCalendarPost, SocialPlatform } from '../types';
import { generateWeeklyAICalendar, getWeeklyAICalendar, updateWeeklyCalendarPost } from '../api/weeklyAICalendar';
import { format, startOfWeek, endOfWeek, addWeeks, subWeeks, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';

interface WeeklyAICalendarProps {
  loading?: boolean;
}

const platformStyles: Record<SocialPlatform, { label: string; className: string }> = {
  instagram: { label: 'Instagram', className: 'bg-gradient-to-r from-pink-500 to-yellow-500 text-white' },
  facebook: { label: 'Facebook', className: 'bg-blue-100 text-blue-700' },
  tiktok: { label: 'TikTok', className: 'bg-slate-900 text-white' },
  linkedin: { label: 'LinkedIn', className: 'bg-sky-100 text-sky-700' },
};

const contentTypeLabels: Record<'post' | 'reel' | 'carousel' | 'story', string> = {
  post: 'Post',
  reel: 'Reel',
  carousel: 'Carrusel',
  story: 'Story',
};

export function WeeklyAICalendarComponent({ loading: externalLoading }: WeeklyAICalendarProps) {
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [calendar, setCalendar] = useState<WeeklyAICalendar | null>(null);
  const [currentWeekStart, setCurrentWeekStart] = useState<Date>(startOfWeek(new Date(), { weekStartsOn: 1 }));
  const [selectedPost, setSelectedPost] = useState<WeeklyCalendarPost | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    loadCalendar();
  }, [currentWeekStart]);

  const loadCalendar = async () => {
    setLoading(true);
    try {
      const weekStartStr = format(currentWeekStart, 'yyyy-MM-dd');
      const existing = await getWeeklyAICalendar(weekStartStr);
      if (existing) {
        setCalendar(existing);
      }
    } catch (error) {
      console.error('Error loading weekly calendar:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerate = async () => {
    setGenerating(true);
    try {
      const weekStartStr = format(currentWeekStart, 'yyyy-MM-dd');
      const newCalendar = await generateWeeklyAICalendar(weekStartStr);
      setCalendar(newCalendar);
    } catch (error) {
      console.error('Error generating weekly calendar:', error);
      alert('Error al generar el calendario. Intenta nuevamente.');
    } finally {
      setGenerating(false);
    }
  };

  const handlePreviousWeek = () => {
    setCurrentWeekStart(subWeeks(currentWeekStart, 1));
  };

  const handleNextWeek = () => {
    setCurrentWeekStart(addWeeks(currentWeekStart, 1));
  };

  const handleToday = () => {
    setCurrentWeekStart(startOfWeek(new Date(), { weekStartsOn: 1 }));
  };

  const handlePostClick = (post: WeeklyCalendarPost) => {
    setSelectedPost(post);
    setIsModalOpen(true);
  };

  const handleCopyContent = async (post: WeeklyCalendarPost) => {
    const fullContent = `${post.hook}\n\n${post.copy}\n\n${post.cta}\n\n${post.hashtags.join(' ')}`;
    try {
      await navigator.clipboard.writeText(fullContent);
      setCopiedId(post.id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (error) {
      console.error('Error copying content:', error);
    }
  };

  const handleSchedulePost = async (post: WeeklyCalendarPost) => {
    try {
      await updateWeeklyCalendarPost(calendar!.id, post.id, { status: 'scheduled' });
      setCalendar({
        ...calendar!,
        posts: calendar!.posts.map((p) => (p.id === post.id ? { ...p, status: 'scheduled' } : p)),
      });
      alert('Post programado exitosamente');
    } catch (error) {
      console.error('Error scheduling post:', error);
      alert('Error al programar el post');
    }
  };

  const weekEnd = endOfWeek(currentWeekStart, { weekStartsOn: 1 });
  const weekLabel = `${format(currentWeekStart, 'd MMM', { locale: es })} - ${format(weekEnd, 'd MMM yyyy', { locale: es })}`;

  if (externalLoading || loading) {
    return (
      <Card className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 w-1/3 bg-slate-200 rounded" />
          <div className="h-32 bg-slate-100 rounded-2xl" />
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="p-0 shadow-sm border border-slate-100">
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-slate-900 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-indigo-500" />
              Calendario Semanal IA
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Recibe un calendario semanal con ganchos, copy, CTA y hooks audiovisuales listos para publicar
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handlePreviousWeek}
                leftIcon={<ChevronLeft className="w-4 h-4" />}
              />
              <Button
                variant="ghost"
                size="sm"
                onClick={handleToday}
                className="min-w-[100px]"
              >
                Hoy
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleNextWeek}
                leftIcon={<ChevronRight className="w-4 h-4" />}
              />
            </div>
            <Button
              variant="primary"
              size="sm"
              onClick={handleGenerate}
              disabled={generating}
              leftIcon={generating ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            >
              {generating ? 'Generando...' : calendar ? 'Regenerar Semana' : 'Generar Calendario'}
            </Button>
          </div>
        </div>

        <div className="p-6">
          {!calendar ? (
            <div className="text-center py-12">
              <Calendar className="w-16 h-16 mx-auto mb-4 text-slate-300" />
              <h3 className="text-lg font-semibold text-slate-900 mb-2">
                No hay calendario para esta semana
              </h3>
              <p className="text-sm text-slate-500 mb-6">
                Genera un calendario semanal con contenido IA adaptado a tus nichos
              </p>
              <Button variant="primary" onClick={handleGenerate} disabled={generating}>
                {generating ? 'Generando...' : 'Generar Calendario Semanal'}
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">{weekLabel}</h3>
                  <p className="text-sm text-slate-500">
                    {calendar.posts.length} posts generados · Generado el {format(parseISO(calendar.generatedAt), 'd MMM yyyy HH:mm', { locale: es })}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {calendar.posts.map((post) => {
                  const platformStyle = platformStyles[post.platform] || platformStyles.instagram;
                  const isCopied = copiedId === post.id;

                  return (
                    <div
                      key={post.id}
                      className="border border-slate-200 rounded-lg p-4 bg-white hover:shadow-md transition-shadow cursor-pointer"
                      onClick={() => handlePostClick(post)}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <Badge
                            variant="blue"
                            size="sm"
                            className={platformStyle.className}
                          >
                            {platformStyle.label}
                          </Badge>
                          <Badge variant="outline" size="sm">
                            {contentTypeLabels[post.contentType]}
                          </Badge>
                        </div>
                        {post.niche && (
                          <Badge variant="purple" size="sm">
                            {post.niche}
                          </Badge>
                        )}
                      </div>

                      <div className="space-y-2 mb-3">
                        <div className="flex items-center gap-2 text-xs text-slate-500">
                          <Clock className="w-3 h-3" />
                          <span>{post.dayOfWeek} {post.time}</span>
                        </div>
                        <h4 className="font-semibold text-slate-900 text-sm line-clamp-2">
                          {post.hook}
                        </h4>
                        <p className="text-xs text-slate-600 line-clamp-3">
                          {post.copy}
                        </p>
                        <p className="text-xs font-medium text-indigo-600">
                          CTA: {post.cta}
                        </p>
                        {post.audiovisualHook && (
                          <div className="flex items-center gap-1 text-xs text-slate-500">
                            <Video className="w-3 h-3" />
                            <span className="line-clamp-1">{post.audiovisualHook}</span>
                          </div>
                        )}
                        {post.hashtags.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {post.hashtags.slice(0, 3).map((tag, idx) => (
                              <span key={idx} className="text-xs text-slate-400">
                                {tag}
                              </span>
                            ))}
                            {post.hashtags.length > 3 && (
                              <span className="text-xs text-slate-400">
                                +{post.hashtags.length - 3}
                              </span>
                            )}
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-2 pt-3 border-t border-slate-100">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCopyContent(post);
                          }}
                          className="flex-1"
                        >
                          {isCopied ? (
                            <>
                              <CheckCircle2 className="w-3 h-3 mr-1" />
                              Copiado
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3 mr-1" />
                              Copiar
                            </>
                          )}
                        </Button>
                        {post.status === 'draft' && (
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleSchedulePost(post);
                            }}
                          >
                            <Send className="w-3 h-3 mr-1" />
                            Programar
                          </Button>
                        )}
                        {post.status === 'scheduled' && (
                          <Badge variant="green" size="sm">
                            Programado
                          </Badge>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Modal de Detalle del Post */}
      <Modal
        isOpen={isModalOpen && !!selectedPost}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedPost(null);
        }}
        title="Detalle del Post"
        size="lg"
      >
        {selectedPost && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Plataforma
                </label>
                <Badge
                  variant="blue"
                  size="md"
                  className={platformStyles[selectedPost.platform].className}
                >
                  {platformStyles[selectedPost.platform].label}
                </Badge>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Tipo de Contenido
                </label>
                <Badge variant="outline" size="md">
                  {contentTypeLabels[selectedPost.contentType]}
                </Badge>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Fecha y Hora
                </label>
                <p className="text-sm text-slate-900">
                  {selectedPost.dayOfWeek} {selectedPost.date} a las {selectedPost.time}
                </p>
              </div>
              {selectedPost.niche && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Nicho
                  </label>
                  <Badge variant="purple" size="md">
                    {selectedPost.niche}
                  </Badge>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Hook
              </label>
              <div className="p-3 bg-indigo-50 rounded-lg border border-indigo-100">
                <p className="text-sm font-semibold text-slate-900">{selectedPost.hook}</p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Copy
              </label>
              <Textarea
                value={selectedPost.copy}
                readOnly
                rows={6}
                className="font-mono text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Call to Action (CTA)
              </label>
              <div className="p-3 bg-green-50 rounded-lg border border-green-100">
                <p className="text-sm font-medium text-slate-900">{selectedPost.cta}</p>
              </div>
            </div>

            {selectedPost.audiovisualHook && (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
                  <Video className="w-4 h-4" />
                  Hook Audiovisual
                </label>
                <div className="p-3 bg-violet-50 rounded-lg border border-violet-100">
                  <p className="text-sm text-slate-900">{selectedPost.audiovisualHook}</p>
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
                <Hash className="w-4 h-4" />
                Hashtags
              </label>
              <div className="flex flex-wrap gap-2">
                {selectedPost.hashtags.map((tag, idx) => (
                  <Badge key={idx} variant="purple" size="md">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="flex gap-3 pt-4 border-t border-slate-200">
              <Button
                variant="secondary"
                onClick={() => handleCopyContent(selectedPost)}
                leftIcon={copiedId === selectedPost.id ? <CheckCircle2 className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              >
                {copiedId === selectedPost.id ? 'Copiado' : 'Copiar Todo'}
              </Button>
              {selectedPost.status === 'draft' && (
                <Button
                  variant="primary"
                  onClick={() => {
                    handleSchedulePost(selectedPost);
                    setIsModalOpen(false);
                  }}
                  leftIcon={<Send className="w-4 h-4" />}
                >
                  Programar Post
                </Button>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

