import { useState, useMemo } from 'react';
import { Star, MessageCircle, Search, Filter, Edit, Check, X, Eye, Video, Headphones, FileText, Calendar } from 'lucide-react';
import { Card, Badge, Button, Modal, Input, Select, Textarea } from '../../../components/componentsreutilizables';
import { Testimonial, TestimonialType, TestimonialStatus } from '../types';
import { ShareTestimonial } from './ShareTestimonial';
import { GenerateTestimonialImage } from './GenerateTestimonialImage';
import { ExportTestimonials } from './ExportTestimonials';

interface TestimonialsShowcaseProps {
  testimonials: Testimonial[];
  loading?: boolean;
}

const TYPE_OPTIONS: { value: TestimonialType | 'all'; label: string }[] = [
  { value: 'all', label: 'Todos los tipos' },
  { value: 'texto', label: 'Texto' },
  { value: 'video', label: 'Video' },
  { value: 'audio', label: 'Audio' },
];

const STATUS_OPTIONS: { value: TestimonialStatus | 'all'; label: string }[] = [
  { value: 'all', label: 'Todos los estados' },
  { value: 'pendiente', label: 'Pendiente' },
  { value: 'aprobado', label: 'Aprobado' },
  { value: 'rechazado', label: 'Rechazado' },
  { value: 'publicado', label: 'Publicado' },
];

const SCORE_OPTIONS: { value: string; label: string }[] = [
  { value: 'all', label: 'Todas las puntuaciones' },
  { value: '5', label: '5 estrellas' },
  { value: '4', label: '4+ estrellas' },
  { value: '3', label: '3+ estrellas' },
  { value: '2', label: '2+ estrellas' },
  { value: '1', label: '1+ estrellas' },
];

export function TestimonialsShowcase({ testimonials, loading }: TestimonialsShowcaseProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClient, setSelectedClient] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<TestimonialType | 'all'>('all');
  const [selectedStatus, setSelectedStatus] = useState<TestimonialStatus | 'all'>('all');
  const [selectedScore, setSelectedScore] = useState<string>('all');
  const [selectedTag, setSelectedTag] = useState<string>('all');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [selectedTestimonial, setSelectedTestimonial] = useState<Testimonial | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [isImageGeneratorOpen, setIsImageGeneratorOpen] = useState(false);
  const [testimonialForImage, setTestimonialForImage] = useState<Testimonial | null>(null);

  // Obtener lista única de clientes
  const uniqueClients = useMemo(() => {
    const clients = new Set(testimonials.map((t) => t.customerName));
    return Array.from(clients).sort();
  }, [testimonials]);

  // Obtener lista única de etiquetas
  const uniqueTags = useMemo(() => {
    const tags = new Set<string>();
    testimonials.forEach((t) => {
      t.tags?.forEach((tag) => tags.add(tag));
    });
    return Array.from(tags).sort();
  }, [testimonials]);

  // Filtrar testimonios
  const filteredTestimonials = useMemo(() => {
    return testimonials.filter((testimonial) => {
      // Búsqueda por palabras clave
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesSearch =
          testimonial.customerName.toLowerCase().includes(query) ||
          testimonial.quote.toLowerCase().includes(query) ||
          testimonial.role.toLowerCase().includes(query) ||
          testimonial.tags?.some((tag) => tag.toLowerCase().includes(query));
        if (!matchesSearch) return false;
      }

      // Filtro por cliente
      if (selectedClient !== 'all' && testimonial.customerName !== selectedClient) {
        return false;
      }

      // Filtro por tipo
      if (selectedType !== 'all' && testimonial.type !== selectedType) {
        return false;
      }

      // Filtro por estado
      if (selectedStatus !== 'all' && testimonial.status !== selectedStatus) {
        return false;
      }

      // Filtro por puntuación
      if (selectedScore !== 'all') {
        const minScore = parseFloat(selectedScore);
        if (testimonial.score < minScore) return false;
      }

      // Filtro por etiqueta
      if (selectedTag !== 'all' && !testimonial.tags?.includes(selectedTag)) {
        return false;
      }

      // Filtro por fecha
      if (dateFrom || dateTo) {
        const testimonialDate = new Date(testimonial.createdAt);
        if (dateFrom && testimonialDate < new Date(dateFrom)) return false;
        if (dateTo && testimonialDate > new Date(dateTo)) return false;
      }

      return true;
    });
  }, [testimonials, searchQuery, selectedClient, selectedType, selectedStatus, selectedScore, selectedTag, dateFrom, dateTo]);

  const handleViewTestimonial = (testimonial: Testimonial) => {
    setSelectedTestimonial(testimonial);
    setIsDetailModalOpen(true);
  };

  const handleEditTestimonial = (testimonial: Testimonial) => {
    setSelectedTestimonial(testimonial);
    setIsEditModalOpen(true);
  };

  const handleApprove = (testimonial: Testimonial) => {
    console.log('Aprobar testimonio:', testimonial.id);
    // Aquí se enviaría al backend
    setIsDetailModalOpen(false);
  };

  const handleReject = (testimonial: Testimonial) => {
    console.log('Rechazar testimonio:', testimonial.id);
    // Aquí se enviaría al backend
    setIsDetailModalOpen(false);
  };

  const getTypeIcon = (type: TestimonialType) => {
    switch (type) {
      case 'video':
        return <Video className="w-4 h-4" />;
      case 'audio':
        return <Headphones className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  const getStatusBadge = (status: TestimonialStatus) => {
    const variants: Record<TestimonialStatus, 'green' | 'yellow' | 'red' | 'blue'> = {
      publicado: 'green',
      aprobado: 'blue',
      pendiente: 'yellow',
      rechazado: 'red',
    };
    return variants[status] || 'secondary';
  };

  return (
    <Card className="bg-white/90 dark:bg-slate-900/80 shadow-sm border border-slate-200/60 dark:border-slate-800/60">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
            Biblioteca de testimonios
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 max-w-2xl">
            Vista de todos los testimonios con filtros por cliente, fecha, tipo, puntuación y etiquetas. Búsqueda por palabras clave.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <ExportTestimonials testimonials={testimonials} />
          <Button
            variant="ghost"
            className="inline-flex items-center gap-2"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="w-4 h-4" />
            Filtros
          </Button>
        </div>
      </div>

      {/* Barra de búsqueda y filtros */}
      <div className="mt-6 space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            placeholder="Buscar por palabras clave..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {showFilters && (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 p-4 bg-slate-50 dark:bg-slate-800/40 rounded-lg border border-slate-200 dark:border-slate-800">
            <Select
              label="Cliente"
              value={selectedClient}
              onChange={(e) => setSelectedClient(e.target.value)}
              options={[
                { label: 'Todos los clientes', value: 'all' },
                ...uniqueClients.map((client) => ({ label: client, value: client })),
              ]}
            />
            <Select
              label="Tipo"
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value as TestimonialType | 'all')}
              options={TYPE_OPTIONS}
            />
            <Select
              label="Estado"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value as TestimonialStatus | 'all')}
              options={STATUS_OPTIONS}
            />
            <Select
              label="Puntuación"
              value={selectedScore}
              onChange={(e) => setSelectedScore(e.target.value)}
              options={SCORE_OPTIONS}
            />
            <Select
              label="Etiqueta"
              value={selectedTag}
              onChange={(e) => setSelectedTag(e.target.value)}
              options={[
                { label: 'Todas las etiquetas', value: 'all' },
                ...uniqueTags.map((tag) => ({ label: tag, value: tag })),
              ]}
            />
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Fecha desde
              </label>
              <Input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Fecha hasta
              </label>
              <Input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
              />
            </div>
            <div className="flex items-end">
              <Button
                variant="secondary"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedClient('all');
                  setSelectedType('all');
                  setSelectedStatus('all');
                  setSelectedScore('all');
                  setSelectedTag('all');
                  setDateFrom('');
                  setDateTo('');
                }}
              >
                Limpiar filtros
              </Button>
            </div>
          </div>
        )}

        <div className="text-sm text-slate-500 dark:text-slate-400">
          Mostrando {filteredTestimonials.length} de {testimonials.length} testimonios
        </div>
      </div>

      {/* Tabla de testimonios */}
      <div className="mt-6 overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-800">
          <thead className="bg-slate-50/70 dark:bg-slate-800/60">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                Cliente
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                Tipo / Fuente
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                Testimonio
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                Puntuación
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                Estado
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                Fecha
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-sm">
            {loading
              ? Array.from({ length: 4 }).map((_, index) => (
                  <tr key={`skeleton-${index}`} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                    <SkeletonRow />
                  </tr>
                ))
              : filteredTestimonials.map((testimonial) => (
                  <tr key={testimonial.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="px-4 py-4 align-top">
                      <div className="space-y-1">
                        <p className="font-semibold text-slate-900 dark:text-slate-100">{testimonial.customerName}</p>
                        <p className="text-xs uppercase tracking-wide text-slate-400">{testimonial.role}</p>
                      </div>
                    </td>
                    <td className="px-4 py-4 align-top">
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5">
                          {getTypeIcon(testimonial.type)}
                          <span className="text-xs text-slate-600 dark:text-slate-400 capitalize">{testimonial.type}</span>
                        </div>
                        <Badge variant="blue" size="sm">
                          {testimonial.channel}
                        </Badge>
                      </div>
                    </td>
                    <td className="px-4 py-4 align-top">
                      <p className="text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-3">
                        "{testimonial.quote}"
                      </p>
                      {testimonial.tags && testimonial.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {testimonial.tags.slice(0, 3).map((tag) => (
                            <Badge key={tag} variant="secondary" size="sm">
                              {tag}
                            </Badge>
                          ))}
                          {testimonial.tags.length > 3 && (
                            <Badge variant="secondary" size="sm">
                              +{testimonial.tags.length - 3}
                            </Badge>
                          )}
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-4 align-top">
                      <span className="inline-flex items-center gap-1.5 text-amber-500 dark:text-amber-300 font-medium">
                        <Star className="w-4 h-4 fill-current" />
                        {testimonial.score.toFixed(1)}
                      </span>
                    </td>
                    <td className="px-4 py-4 align-top">
                      <Badge variant={getStatusBadge(testimonial.status)} size="sm" className="capitalize">
                        {testimonial.status}
                      </Badge>
                    </td>
                    <td className="px-4 py-4 align-top">
                      <span className="text-slate-500 dark:text-slate-400">
                        {new Date(testimonial.createdAt).toLocaleDateString('es-ES', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </span>
                    </td>
                    <td className="px-4 py-4 align-top">
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewTestimonial(testimonial)}
                          title="Ver detalles"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <ShareTestimonial
                          testimonial={testimonial}
                          onGenerateImage={() => {
                            setTestimonialForImage(testimonial);
                            setIsImageGeneratorOpen(true);
                          }}
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditTestimonial(testimonial)}
                          title="Editar"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
          </tbody>
        </table>
      </div>

      {/* Modal de vista detallada */}
      <Modal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        title="Detalle del testimonio"
        size="lg"
        footer={
          selectedTestimonial && (
            <>
              <Button variant="secondary" onClick={() => setIsDetailModalOpen(false)}>
                Cerrar
              </Button>
              {selectedTestimonial.status === 'pendiente' && (
                <>
                  <Button variant="secondary" onClick={() => handleReject(selectedTestimonial)}>
                    <X className="w-4 h-4 mr-2" />
                    Rechazar
                  </Button>
                  <Button onClick={() => handleApprove(selectedTestimonial)}>
                    <Check className="w-4 h-4 mr-2" />
                    Aprobar
                  </Button>
                </>
              )}
              {selectedTestimonial.status === 'aprobado' && (
                <Button onClick={() => console.log('Publicar:', selectedTestimonial.id)}>
                  Publicar
                </Button>
              )}
              <ShareTestimonial
                testimonial={selectedTestimonial}
                onGenerateImage={() => {
                  setTestimonialForImage(selectedTestimonial);
                  setIsImageGeneratorOpen(true);
                  setIsDetailModalOpen(false);
                }}
              />
              <Button variant="ghost" onClick={() => handleEditTestimonial(selectedTestimonial)}>
                <Edit className="w-4 h-4 mr-2" />
                Editar
              </Button>
            </>
          )
        }
      >
        {selectedTestimonial && (
          <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Cliente
                </label>
                <p className="text-slate-900 dark:text-slate-100 font-semibold">{selectedTestimonial.customerName}</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">{selectedTestimonial.role}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Estado
                </label>
                <Badge variant={getStatusBadge(selectedTestimonial.status)} size="sm" className="capitalize">
                  {selectedTestimonial.status}
                </Badge>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Testimonio
              </label>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
                "{selectedTestimonial.quote}"
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Tipo
                </label>
                <div className="flex items-center gap-2">
                  {getTypeIcon(selectedTestimonial.type)}
                  <span className="text-sm text-slate-600 dark:text-slate-400 capitalize">{selectedTestimonial.type}</span>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Puntuación
                </label>
                <div className="flex items-center gap-1.5 text-amber-500 dark:text-amber-300 font-medium">
                  <Star className="w-4 h-4 fill-current" />
                  {selectedTestimonial.score.toFixed(1)}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Fuente
                </label>
                <Badge variant="blue" size="sm">
                  {selectedTestimonial.channel}
                </Badge>
              </div>
            </div>

            {selectedTestimonial.mediaUrl && (
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Archivo multimedia
                </label>
                <a
                  href={selectedTestimonial.mediaUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 text-sm"
                >
                  {selectedTestimonial.mediaUrl}
                </a>
              </div>
            )}

            {selectedTestimonial.tags && selectedTestimonial.tags.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Etiquetas
                </label>
                <div className="flex flex-wrap gap-2">
                  {selectedTestimonial.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" size="sm">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            <div className="grid gap-4 md:grid-cols-2 pt-4 border-t border-slate-200 dark:border-slate-800">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Fecha de creación
                </label>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  {new Date(selectedTestimonial.createdAt).toLocaleString('es-ES')}
                </p>
              </div>
              {selectedTestimonial.updatedAt && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Última actualización
                  </label>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    {new Date(selectedTestimonial.updatedAt).toLocaleString('es-ES')}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </Modal>

      {/* Modal de edición */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Editar testimonio"
        size="lg"
        footer={
          <>
            <Button variant="secondary" onClick={() => setIsEditModalOpen(false)}>
              Cancelar
            </Button>
            <Button
              onClick={() => {
                console.log('Guardar cambios:', selectedTestimonial?.id);
                setIsEditModalOpen(false);
              }}
            >
              Guardar cambios
            </Button>
          </>
        }
      >
        {selectedTestimonial && (
          <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <Input label="Nombre del cliente" defaultValue={selectedTestimonial.customerName} />
              <Input label="Rol" defaultValue={selectedTestimonial.role} />
            </div>
            <Textarea label="Testimonio" defaultValue={selectedTestimonial.quote} rows={6} />
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Puntuación
                </label>
                <input
                  type="range"
                  min="1"
                  max="5"
                  step="0.1"
                  defaultValue={selectedTestimonial.score}
                  className="w-full"
                />
              </div>
              <Select
                label="Estado"
                defaultValue={selectedTestimonial.status}
                options={STATUS_OPTIONS.filter((opt) => opt.value !== 'all')}
              />
            </div>
          </div>
        )}
      </Modal>

      {/* Modal de generación de imagen */}
      {testimonialForImage && (
        <GenerateTestimonialImage
          testimonial={testimonialForImage}
          isOpen={isImageGeneratorOpen}
          onClose={() => {
            setIsImageGeneratorOpen(false);
            setTestimonialForImage(null);
          }}
        />
      )}
    </Card>
  );
}

function SkeletonRow() {
  return (
    <>
      {[...Array(7)].map((_, cellIndex) => (
        <td key={cellIndex} className="px-4 py-4">
          <div className="animate-pulse space-y-2">
            <div className="h-3 w-full rounded bg-slate-200/80 dark:bg-slate-800/60" />
            <div className="h-3 w-3/4 rounded bg-slate-200/60 dark:bg-slate-800/50" />
          </div>
        </td>
      ))}
    </>
  );
}
