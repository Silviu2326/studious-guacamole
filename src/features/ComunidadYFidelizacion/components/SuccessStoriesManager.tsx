import { useState, useMemo } from 'react';
import {
  Sparkles,
  Star,
  TrendingUp,
  ExternalLink,
  Plus,
  Edit,
  Eye,
  CheckCircle2,
  X,
  Filter,
  Search,
  Copy,
  Globe,
  Mail,
  FileText,
  Image as ImageIcon,
  Video,
  Share2,
} from 'lucide-react';
import { Card, Badge, Button, Modal, Input, Select, Textarea } from '../../../components/componentsreutilizables';
import { SuccessStory, Testimonial, ContentType, SuccessStoryFormat, SuccessStoryStatus } from '../types';
import { SuccessStoriesAPI } from '../api/successStories';

interface SuccessStoriesManagerProps {
  testimonials: Testimonial[];
  successStories?: SuccessStory[];
  loading?: boolean;
  onStoryCreated?: (story: SuccessStory) => void;
  onStoryUpdated?: (story: SuccessStory) => void;
}

export function SuccessStoriesManager({
  testimonials,
  successStories = [],
  loading,
  onStoryCreated,
  onStoryUpdated,
}: SuccessStoriesManagerProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<SuccessStoryStatus | 'all'>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStory, setSelectedStory] = useState<SuccessStory | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedTestimonial, setSelectedTestimonial] = useState<Testimonial | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  // Filtrar testimonios positivos (score >= 4)
  const positiveTestimonials = useMemo(
    () => testimonials.filter((t) => t.score >= 4 && t.status === 'aprobado'),
    [testimonials],
  );

  // Filtrar historias de éxito
  const filteredStories = useMemo(() => {
    return successStories.filter((story) => {
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesSearch =
          story.title.toLowerCase().includes(query) ||
          story.clientName.toLowerCase().includes(query) ||
          story.storyContent.headline.toLowerCase().includes(query) ||
          story.tags.some((tag) => tag.toLowerCase().includes(query));
        if (!matchesSearch) return false;
      }

      if (selectedStatus !== 'all' && story.status !== selectedStatus) {
        return false;
      }

      if (selectedCategory !== 'all' && story.category !== selectedCategory) {
        return false;
      }

      return true;
    });
  }, [successStories, searchQuery, selectedStatus, selectedCategory]);

  // Obtener categorías únicas
  const categories = useMemo(() => {
    const cats = new Set<string>();
    successStories.forEach((story) => {
      if (story.category) cats.add(story.category);
    });
    return Array.from(cats).sort();
  }, [successStories]);

  const handleCreateFromTestimonial = async (testimonial: Testimonial) => {
    setSelectedTestimonial(testimonial);
    setIsCreateModalOpen(true);
  };

  const handleGenerateStory = async (format?: SuccessStoryFormat, contentType?: ContentType) => {
    if (!selectedTestimonial) return;

    setIsGenerating(true);
    try {
      const story = await SuccessStoriesAPI.convertTestimonialToSuccessStory(selectedTestimonial, {
        format,
        contentType,
      });
      if (onStoryCreated) {
        onStoryCreated(story);
      }
      setSelectedStory(story);
      setIsCreateModalOpen(false);
      setIsDetailModalOpen(true);
    } catch (error) {
      console.error('Error generando historia de éxito:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleViewStory = (story: SuccessStory) => {
    setSelectedStory(story);
    setIsDetailModalOpen(true);
  };

  const handlePublishStory = async (storyId: string) => {
    try {
      const updated = await SuccessStoriesAPI.publishSuccessStory(storyId);
      if (onStoryUpdated) {
        onStoryUpdated(updated);
      }
      setSelectedStory(updated);
    } catch (error) {
      console.error('Error publicando historia:', error);
    }
  };

  const handleAddToContent = async (
    storyId: string,
    contentType: ContentType,
    contentName?: string,
  ) => {
    try {
      const updated = await SuccessStoriesAPI.addToContent(storyId, contentType, undefined, contentName);
      if (onStoryUpdated) {
        onStoryUpdated(updated);
      }
      setSelectedStory(updated);
    } catch (error) {
      console.error('Error agregando a contenido:', error);
    }
  };

  const getStatusBadge = (status: SuccessStoryStatus) => {
    const variants: Record<SuccessStoryStatus, 'green' | 'yellow' | 'secondary'> = {
      published: 'green',
      draft: 'yellow',
      archived: 'secondary',
    };
    return variants[status] || 'secondary';
  };

  const getContentTypeIcon = (contentType: ContentType) => {
    switch (contentType) {
      case 'funnel':
        return <TrendingUp className="w-4 h-4" />;
      case 'landing-page':
        return <Globe className="w-4 h-4" />;
      case 'social-media':
        return <Share2 className="w-4 h-4" />;
      case 'email':
        return <Mail className="w-4 h-4" />;
      case 'blog':
        return <FileText className="w-4 h-4" />;
      case 'testimonial-page':
        return <Star className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  return (
    <>
      <Card className="bg-white/90 dark:bg-slate-900/80 shadow-sm border border-slate-200/60 dark:border-slate-800/60">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                Historias de Éxito
              </h3>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Convierte feedback positivo en historias de éxito para usar en funnels, landing pages y contenido
            </p>
          </div>
          <Button
            onClick={() => {
              if (positiveTestimonials.length > 0) {
                setSelectedTestimonial(positiveTestimonials[0]);
                setIsCreateModalOpen(true);
              }
            }}
            leftIcon={<Plus className="w-4 h-4" />}
            disabled={positiveTestimonials.length === 0}
          >
            Crear Historia
          </Button>
        </div>

        {/* Filtros */}
        <div className="mt-6 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              placeholder="Buscar historias..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="flex flex-wrap gap-4">
            <Select
              label="Estado"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value as SuccessStoryStatus | 'all')}
              options={[
                { label: 'Todos', value: 'all' },
                { label: 'Publicado', value: 'published' },
                { label: 'Borrador', value: 'draft' },
                { label: 'Archivado', value: 'archived' },
              ]}
            />
            <Select
              label="Categoría"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              options={[
                { label: 'Todas', value: 'all' },
                ...categories.map((cat) => ({ label: cat, value: cat })),
              ]}
            />
          </div>
        </div>

        {/* Lista de historias */}
        {loading ? (
          <div className="mt-6 space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-32 animate-pulse rounded-lg bg-slate-200 dark:bg-slate-800" />
            ))}
          </div>
        ) : filteredStories.length === 0 ? (
          <div className="mt-6 py-12 text-center">
            <Sparkles className="w-12 h-12 mx-auto text-slate-300 dark:text-slate-600 mb-3" />
            <p className="text-sm text-slate-500 dark:text-slate-400">
              No hay historias de éxito. Crea una desde un testimonio positivo.
            </p>
          </div>
        ) : (
          <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredStories.map((story) => (
              <div
                key={story.id}
                className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-4 hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => handleViewStory(story)}
              >
                <div className="flex items-start justify-between mb-2">
                  <Badge variant={getStatusBadge(story.status)} size="sm" className="capitalize">
                    {story.status}
                  </Badge>
                  {story.aiGenerated && (
                    <Badge variant="secondary" size="sm">
                      <Sparkles className="w-3 h-3 mr-1" />
                      IA
                    </Badge>
                  )}
                </div>

                <h4 className="font-semibold text-slate-900 dark:text-slate-100 mb-2 line-clamp-2">
                  {story.title}
                </h4>

                <p className="text-sm text-slate-600 dark:text-slate-400 mb-3 line-clamp-2">
                  {story.storyContent.headline}
                </p>

                <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                  <span>{story.clientName}</span>
                  {story.usedInContent.length > 0 && (
                    <span className="flex items-center gap-1">
                      <ExternalLink className="w-3 h-3" />
                      {story.usedInContent.length} uso{story.usedInContent.length !== 1 ? 's' : ''}
                    </span>
                  )}
                </div>

                {story.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-3">
                    {story.tags.slice(0, 3).map((tag) => (
                      <Badge key={tag} variant="secondary" size="sm">
                        {tag}
                      </Badge>
                    ))}
                    {story.tags.length > 3 && (
                      <Badge variant="secondary" size="sm">+{story.tags.length - 3}</Badge>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Sección de testimonios disponibles */}
        {positiveTestimonials.length > 0 && (
          <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-700">
            <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-3">
              Testimonios Positivos Disponibles ({positiveTestimonials.length})
            </h4>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {positiveTestimonials.slice(0, 5).map((testimonial) => {
                const alreadyConverted = successStories.some(
                  (s) => s.sourceTestimonialId === testimonial.id,
                );
                return (
                  <div
                    key={testimonial.id}
                    className="flex items-center justify-between p-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                          {testimonial.customerName}
                        </p>
                        <div className="flex items-center gap-1 text-amber-500">
                          <Star className="w-3 h-3 fill-current" />
                          <span className="text-xs">{testimonial.score}</span>
                        </div>
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-1 mt-1">
                        "{testimonial.quote}"
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleCreateFromTestimonial(testimonial)}
                      disabled={alreadyConverted}
                    >
                      {alreadyConverted ? (
                        <>
                          <CheckCircle2 className="w-4 h-4 mr-1" />
                          Convertido
                        </>
                      ) : (
                        <>
                          <Plus className="w-4 h-4 mr-1" />
                          Convertir
                        </>
                      )}
                    </Button>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </Card>

      {/* Modal de creación */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => {
          setIsCreateModalOpen(false);
          setSelectedTestimonial(null);
        }}
        title="Crear Historia de Éxito"
        size="lg"
        footer={
          <>
            <Button variant="secondary" onClick={() => setIsCreateModalOpen(false)}>
              Cancelar
            </Button>
            <Button
              onClick={() => handleGenerateStory()}
              disabled={!selectedTestimonial || isGenerating}
              leftIcon={isGenerating ? <Sparkles className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            >
              {isGenerating ? 'Generando...' : 'Generar con IA'}
            </Button>
          </>
        }
      >
        {selectedTestimonial && (
          <div className="space-y-4">
            <div className="rounded-lg border border-slate-200 dark:border-slate-700 p-4 bg-slate-50 dark:bg-slate-800/50">
              <div className="flex items-center justify-between mb-2">
                <p className="font-semibold text-slate-900 dark:text-slate-100">
                  {selectedTestimonial.customerName}
                </p>
                <div className="flex items-center gap-1 text-amber-500">
                  <Star className="w-4 h-4 fill-current" />
                  <span>{selectedTestimonial.score}</span>
                </div>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                "{selectedTestimonial.quote}"
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <Select
                label="Formato"
                defaultValue="case-study"
                options={[
                  { label: 'Caso de Estudio', value: 'case-study' },
                  { label: 'Texto', value: 'text' },
                  { label: 'Video', value: 'video' },
                  { label: 'Imagen', value: 'image' },
                ]}
              />
              <Select
                label="Tipo de Contenido"
                defaultValue="funnel"
                options={[
                  { label: 'Funnel', value: 'funnel' },
                  { label: 'Landing Page', value: 'landing-page' },
                  { label: 'Redes Sociales', value: 'social-media' },
                  { label: 'Email', value: 'email' },
                  { label: 'Blog', value: 'blog' },
                  { label: 'Página de Testimonios', value: 'testimonial-page' },
                ]}
              />
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400">
              La IA generará automáticamente una historia de éxito basada en este testimonio, incluyendo
              desafío, solución y resultados.
            </p>
          </div>
        )}
      </Modal>

      {/* Modal de detalles */}
      <Modal
        isOpen={isDetailModalOpen && selectedStory !== null}
        onClose={() => {
          setIsDetailModalOpen(false);
          setSelectedStory(null);
        }}
        title={selectedStory?.title || 'Historia de Éxito'}
        size="xl"
        footer={
          selectedStory && (
            <>
              <Button variant="secondary" onClick={() => setIsDetailModalOpen(false)}>
                Cerrar
              </Button>
              {selectedStory.status === 'draft' && (
                <Button
                  onClick={() => handlePublishStory(selectedStory.id)}
                  leftIcon={<CheckCircle2 className="w-4 h-4" />}
                >
                  Publicar
                </Button>
              )}
            </>
          )
        }
      >
        {selectedStory && (
          <div className="space-y-6">
            {/* Información general */}
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">
                  Cliente
                </label>
                <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                  {selectedStory.clientName}
                </p>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">
                  Estado
                </label>
                <Badge variant={getStatusBadge(selectedStory.status)} size="sm" className="capitalize">
                  {selectedStory.status}
                </Badge>
              </div>
            </div>

            {/* Contenido de la historia */}
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-2">
                  Headline
                </label>
                <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                  {selectedStory.storyContent.headline}
                </p>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-2">
                  Desafío
                </label>
                <p className="text-sm text-slate-700 dark:text-slate-300">
                  {selectedStory.storyContent.challenge}
                </p>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-2">
                  Solución
                </label>
                <p className="text-sm text-slate-700 dark:text-slate-300">
                  {selectedStory.storyContent.solution}
                </p>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-2">
                  Resultados
                </label>
                <p className="text-sm text-slate-700 dark:text-slate-300">
                  {selectedStory.storyContent.results}
                </p>
              </div>

              <div className="rounded-lg border border-amber-200 dark:border-amber-900/60 bg-amber-50/50 dark:bg-amber-900/10 p-4">
                <label className="block text-xs font-medium text-amber-900 dark:text-amber-100 mb-2">
                  Cita Destacada
                </label>
                <p className="text-sm italic text-amber-800 dark:text-amber-200">
                  "{selectedStory.storyContent.quote}"
                </p>
              </div>

              {selectedStory.storyContent.metrics && selectedStory.storyContent.metrics.length > 0 && (
                <div>
                  <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-2">
                    Métricas
                  </label>
                  <div className="grid gap-3 md:grid-cols-3">
                    {selectedStory.storyContent.metrics.map((metric, index) => (
                      <div
                        key={index}
                        className="rounded-lg border border-slate-200 dark:border-slate-700 p-3 bg-slate-50 dark:bg-slate-800/50"
                      >
                        <p className="text-xs text-slate-500 dark:text-slate-400">{metric.label}</p>
                        <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                          {metric.value}
                        </p>
                        {metric.improvement && (
                          <p className="text-xs text-emerald-600 dark:text-emerald-400">
                            {metric.improvement}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Uso en contenido */}
            {selectedStory.usedInContent.length > 0 && (
              <div>
                <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-2">
                  Usado en Contenido
                </label>
                <div className="space-y-2">
                  {selectedStory.usedInContent.map((usage, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50"
                    >
                      <div className="flex items-center gap-2">
                        {getContentTypeIcon(usage.contentType)}
                        <span className="text-sm text-slate-900 dark:text-slate-100 capitalize">
                          {usage.contentType.replace('-', ' ')}
                        </span>
                        {usage.contentName && (
                          <span className="text-xs text-slate-500 dark:text-slate-400">
                            - {usage.contentName}
                          </span>
                        )}
                      </div>
                      {usage.publishedAt && (
                        <span className="text-xs text-slate-500 dark:text-slate-400">
                          {new Date(usage.publishedAt).toLocaleDateString('es-ES')}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Agregar a contenido */}
            <div className="border-t border-slate-200 dark:border-slate-700 pt-4">
              <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-2">
                Agregar a Contenido
              </label>
              <div className="flex flex-wrap gap-2">
                {(['funnel', 'landing-page', 'social-media', 'email'] as ContentType[]).map((contentType) => (
                  <Button
                    key={contentType}
                    variant="secondary"
                    size="sm"
                    onClick={() => handleAddToContent(selectedStory.id, contentType)}
                    leftIcon={getContentTypeIcon(contentType)}
                  >
                    {contentType.replace('-', ' ')}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
}

