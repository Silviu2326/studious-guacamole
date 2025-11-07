import { useState, useMemo, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { Card, MetricCards, Button, Modal } from '../../../components/componentsreutilizables';
import { Trophy, Plus, MapPin, Calendar, Users, Video, Target, Search, X, Edit, Trash2, Eye } from 'lucide-react';
import { Badge } from '../../../components/componentsreutilizables/Badge';
import { Input } from '../../../components/componentsreutilizables/Input';
import { Textarea } from '../../../components/componentsreutilizables/Textarea';
import { Select } from '../../../components/componentsreutilizables/Select';

type TipoEvento = 'presencial' | 'reto' | 'virtual';
type EstadoEvento = 'programado' | 'en-curso' | 'finalizado' | 'cancelado';

interface Evento {
  id: string;
  tipo: TipoEvento;
  nombre: string;
  descripcion: string;
  fechaInicio: Date;
  fechaFin?: Date;
  capacidad: number;
  participantes: string[];
  estado: EstadoEvento;
  // Campos específicos por tipo
  ubicacion?: string; // presencial
  requisitosFisicos?: string; // presencial
  materialNecesario?: string; // presencial
  plataforma?: string; // virtual
  linkAcceso?: string; // virtual
  requisitosTecnicos?: string; // virtual
  grabacion?: boolean; // virtual
  duracionDias?: number; // reto
  objetivo?: string; // reto
  metricas?: string; // reto
  premios?: string; // reto
  imagen?: string;
  creadoPor: string;
  createdAt: Date;
}

export default function EventosRetosPage() {
  const { user } = useAuth();
  const isEntrenador = user?.role === 'entrenador';
  
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [tipoFiltro, setTipoFiltro] = useState<TipoEvento | 'todos'>('todos');
  const [busqueda, setBusqueda] = useState('');
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [eventoEditando, setEventoEditando] = useState<Evento | null>(null);
  const [eventoSeleccionado, setEventoSeleccionado] = useState<Evento | null>(null);
  const [tipoFormulario, setTipoFormulario] = useState<TipoEvento>('presencial');

  // Estado del formulario
  const [formData, setFormData] = useState<Partial<Evento>>({
    tipo: 'presencial',
    nombre: '',
    descripcion: '',
    fechaInicio: new Date(),
    capacidad: 50,
    estado: 'programado',
    creadoPor: user?.id || '',
  });

  useEffect(() => {
    cargarEventos();
  }, []);

  const cargarEventos = async () => {
    // TODO: Implementar llamada a API
    // Por ahora, datos de ejemplo
    setEventos([
      {
        id: '1',
        tipo: 'presencial',
        nombre: 'Maratón de Fuerza',
        descripcion: 'Evento de levantamiento de pesas',
        fechaInicio: new Date('2024-02-15'),
        capacidad: 50,
        participantes: [],
        estado: 'programado',
        ubicacion: 'Sala Principal',
        requisitosFisicos: 'Nivel intermedio',
        materialNecesario: 'Pesas y barras',
        creadoPor: user?.id || '',
        createdAt: new Date(),
      },
      {
        id: '2',
        tipo: 'reto',
        nombre: 'Reto 30 Días',
        descripcion: 'Desafío de 30 días de entrenamiento',
        fechaInicio: new Date('2024-02-01'),
        fechaFin: new Date('2024-03-02'),
        capacidad: 100,
        participantes: [],
        estado: 'en-curso',
        duracionDias: 30,
        objetivo: 'Mejora general de condición física',
        metricas: 'Entrenamientos, pasos, hidratación',
        premios: 'Certificado y descuento',
        creadoPor: user?.id || '',
        createdAt: new Date(),
      },
      {
        id: '3',
        tipo: 'virtual',
        nombre: 'Webinar de Nutrición',
        descripcion: 'Sesión online sobre nutrición deportiva',
        fechaInicio: new Date('2024-02-20'),
        capacidad: 100,
        participantes: [],
        estado: 'programado',
        plataforma: 'Zoom',
        linkAcceso: 'https://zoom.us/j/123456',
        requisitosTecnicos: 'Conexión estable a internet',
        grabacion: true,
        creadoPor: user?.id || '',
        createdAt: new Date(),
      },
    ]);
  };

  const eventosFiltrados = useMemo(() => {
    let filtrados = eventos;

    // Filtro por tipo
    if (tipoFiltro !== 'todos') {
      filtrados = filtrados.filter(e => e.tipo === tipoFiltro);
    }

    // Filtro por búsqueda
    if (busqueda) {
      filtrados = filtrados.filter(
        e =>
          e.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
          e.descripcion.toLowerCase().includes(busqueda.toLowerCase()) ||
          (e.ubicacion && e.ubicacion.toLowerCase().includes(busqueda.toLowerCase()))
      );
    }

    return filtrados;
  }, [eventos, tipoFiltro, busqueda]);

  const metricas = useMemo(
    () => [
      {
        title: 'Total Eventos',
        value: eventos.length.toString(),
        icon: <Trophy className="w-5 h-5" />,
        trend: 'up' as const,
        trendValue: '+0%',
        color: 'blue' as const,
      },
      {
        title: 'Eventos Activos',
        value: eventos.filter(e => e.estado === 'en-curso').length.toString(),
        icon: <Calendar className="w-5 h-5" />,
        trend: 'up' as const,
        trendValue: '+0%',
        color: 'green' as const,
      },
      {
        title: 'Total Participantes',
        value: eventos.reduce((sum, e) => sum + e.participantes.length, 0).toString(),
        icon: <Users className="w-5 h-5" />,
        trend: 'neutral' as const,
        trendValue: '0%',
        color: 'purple' as const,
      },
      {
        title: 'Eventos Programados',
        value: eventos.filter(e => e.estado === 'programado').length.toString(),
        icon: <Target className="w-5 h-5" />,
        trend: 'neutral' as const,
        trendValue: '0%',
        color: 'orange' as const,
      },
    ],
    [eventos]
  );

  const handleNuevoEvento = (tipo: TipoEvento) => {
    setTipoFormulario(tipo);
    setFormData({
      tipo,
      nombre: '',
      descripcion: '',
      fechaInicio: new Date(),
      capacidad: 50,
      estado: 'programado',
      creadoPor: user?.id || '',
    });
    setEventoEditando(null);
    setMostrarFormulario(true);
  };

  const handleEditarEvento = (evento: Evento) => {
    setEventoEditando(evento);
    setTipoFormulario(evento.tipo);
    setFormData(evento);
    setMostrarFormulario(true);
  };

  const handleGuardar = async () => {
    try {
      // TODO: Implementar guardado en API
      if (eventoEditando) {
        setEventos(eventos.map(e => (e.id === eventoEditando.id ? { ...formData, id: eventoEditando.id } as Evento : e)));
      } else {
        const nuevo: Evento = {
          ...formData,
          id: Date.now().toString(),
          participantes: [],
          createdAt: new Date(),
        } as Evento;
        setEventos([...eventos, nuevo]);
      }
      setMostrarFormulario(false);
      setEventoEditando(null);
      setFormData({
        tipo: 'presencial',
        nombre: '',
        descripcion: '',
        fechaInicio: new Date(),
        capacidad: 50,
        estado: 'programado',
        creadoPor: user?.id || '',
      });
    } catch (error) {
      console.error('Error al guardar evento:', error);
      alert('Error al guardar el evento');
    }
  };

  const handleEliminar = async (id: string) => {
    if (window.confirm('¿Estás seguro de eliminar este evento?')) {
      setEventos(eventos.filter(e => e.id !== id));
    }
  };

  const getTipoBadge = (tipo: TipoEvento) => {
    const configs = {
      presencial: { label: 'Presencial', variant: 'blue' as const, icon: <MapPin className="w-3 h-3" /> },
      reto: { label: 'Reto', variant: 'purple' as const, icon: <Target className="w-3 h-3" /> },
      virtual: { label: 'Virtual', variant: 'green' as const, icon: <Video className="w-3 h-3" /> },
    };
    const config = configs[tipo];
    return (
      <Badge variant={config.variant} leftIcon={config.icon}>
        {config.label}
      </Badge>
    );
  };

  const getEstadoBadge = (estado: EstadoEvento) => {
    const configs = {
      programado: { label: 'Programado', variant: 'blue' as const },
      'en-curso': { label: 'En Curso', variant: 'green' as const },
      finalizado: { label: 'Finalizado', variant: 'gray' as const },
      cancelado: { label: 'Cancelado', variant: 'red' as const },
    };
    const config = configs[estado];
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Header */}
      <div className="border-b border-gray-200/60 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6">
          <div className="py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 rounded-xl mr-4 ring-1 ring-purple-200/70">
                  <Trophy size={24} className="text-purple-600" />
                </div>
                <div>
                  <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900">
                    Eventos & Retos
                  </h1>
                  <p className="text-gray-600">
                    Gestiona eventos presenciales, retos de entrenamiento y webinars virtuales
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={() => handleNuevoEvento('presencial')}
                  variant="secondary"
                  iconLeft={MapPin}
                >
                  Nuevo Presencial
                </Button>
                <Button
                  onClick={() => handleNuevoEvento('reto')}
                  variant="secondary"
                  iconLeft={Target}
                >
                  Nuevo Reto
                </Button>
                <Button
                  onClick={() => handleNuevoEvento('virtual')}
                  variant="secondary"
                  iconLeft={Video}
                >
                  Nuevo Virtual
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contenedor Principal */}
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6 py-8">
        <div className="space-y-6">
          {/* Métricas */}
          <MetricCards data={metricas} />

          {/* Filtros */}
          <Card className="p-4 bg-white shadow-sm">
            <div className="flex items-center gap-4 flex-wrap">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-700">Filtrar por tipo:</span>
                <div className="flex gap-2">
                  {(['todos', 'presencial', 'reto', 'virtual'] as const).map(tipo => (
                    <button
                      key={tipo}
                      onClick={() => setTipoFiltro(tipo)}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                        tipoFiltro === tipo
                          ? 'bg-purple-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {tipo === 'todos' ? 'Todos' : tipo.charAt(0).toUpperCase() + tipo.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex-1 max-w-md">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    type="text"
                    placeholder="Buscar eventos..."
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                    className="pl-10"
                  />
                  {busqueda && (
                    <button
                      onClick={() => setBusqueda('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </Card>

          {/* Lista de Eventos */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {eventosFiltrados.map(evento => (
              <Card key={evento.id} className="p-6 bg-white shadow-sm hover:shadow-md transition-shadow">
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      {getTipoBadge(evento.tipo)}
                      <h3 className="text-lg font-semibold text-gray-900 mt-2">{evento.nombre}</h3>
                      <p className="text-sm text-gray-600 mt-1 line-clamp-2">{evento.descripcion}</p>
                    </div>
                  </div>

                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>
                        {new Date(evento.fechaInicio).toLocaleDateString('es-ES', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </span>
                    </div>
                    {evento.tipo === 'presencial' && evento.ubicacion && (
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        <span>{evento.ubicacion}</span>
                      </div>
                    )}
                    {evento.tipo === 'virtual' && evento.plataforma && (
                      <div className="flex items-center gap-2">
                        <Video className="w-4 h-4" />
                        <span>{evento.plataforma}</span>
                      </div>
                    )}
                    {evento.tipo === 'reto' && evento.duracionDias && (
                      <div className="flex items-center gap-2">
                        <Target className="w-4 h-4" />
                        <span>{evento.duracionDias} días</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      <span>
                        {evento.participantes.length} / {evento.capacidad} participantes
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-gray-200">
                    {getEstadoBadge(evento.estado)}
                    <div className="flex gap-2">
                      <button
                        onClick={() => setEventoSeleccionado(evento)}
                        className="p-1.5 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                        title="Ver detalle"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleEditarEvento(evento)}
                        className="p-1.5 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded transition-colors"
                        title="Editar"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleEliminar(evento.id)}
                        className="p-1.5 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                        title="Eliminar"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {eventosFiltrados.length === 0 && (
            <Card className="p-12 text-center bg-white">
              <Trophy className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No se encontraron eventos</p>
            </Card>
          )}
        </div>
      </div>

      {/* Modal de Formulario */}
      {mostrarFormulario && (
        <Modal
          isOpen={mostrarFormulario}
          onClose={() => {
            setMostrarFormulario(false);
            setEventoEditando(null);
          }}
          title={eventoEditando ? 'Editar Evento' : 'Nuevo Evento'}
        >
          <div className="space-y-4">
            {/* Tipo de evento */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de Evento</label>
              <Select
                value={tipoFormulario}
                onChange={(value) => {
                  setTipoFormulario(value as TipoEvento);
                  setFormData({ ...formData, tipo: value as TipoEvento });
                }}
                options={[
                  { label: 'Presencial', value: 'presencial' },
                  { label: 'Reto', value: 'reto' },
                  { label: 'Virtual', value: 'virtual' },
                ]}
              />
            </div>

            {/* Campos comunes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Nombre del Evento</label>
              <Input
                value={formData.nombre || ''}
                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                placeholder="Ej: Maratón de Fuerza"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Descripción</label>
              <Textarea
                value={formData.descripcion || ''}
                onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                placeholder="Describe el evento..."
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Fecha de Inicio</label>
                <Input
                  type="datetime-local"
                  value={
                    formData.fechaInicio
                      ? new Date(formData.fechaInicio).toISOString().slice(0, 16)
                      : ''
                  }
                  onChange={(e) =>
                    setFormData({ ...formData, fechaInicio: new Date(e.target.value) })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Capacidad Máxima</label>
                <Input
                  type="number"
                  value={formData.capacidad || ''}
                  onChange={(e) => setFormData({ ...formData, capacidad: parseInt(e.target.value) })}
                  placeholder="50"
                />
              </div>
            </div>

            {/* Campos específicos por tipo */}
            {tipoFormulario === 'presencial' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Ubicación</label>
                  <Input
                    value={formData.ubicacion || ''}
                    onChange={(e) => setFormData({ ...formData, ubicacion: e.target.value })}
                    placeholder="Ej: Sala Principal"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Requisitos Físicos</label>
                  <Input
                    value={formData.requisitosFisicos || ''}
                    onChange={(e) => setFormData({ ...formData, requisitosFisicos: e.target.value })}
                    placeholder="Ej: Nivel intermedio"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Material Necesario</label>
                  <Input
                    value={formData.materialNecesario || ''}
                    onChange={(e) => setFormData({ ...formData, materialNecesario: e.target.value })}
                    placeholder="Ej: Pesas y barras"
                  />
                </div>
              </>
            )}

            {tipoFormulario === 'reto' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Duración (días)</label>
                  <Input
                    type="number"
                    value={formData.duracionDias || ''}
                    onChange={(e) => setFormData({ ...formData, duracionDias: parseInt(e.target.value) })}
                    placeholder="30"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Objetivo del Reto</label>
                  <Input
                    value={formData.objetivo || ''}
                    onChange={(e) => setFormData({ ...formData, objetivo: e.target.value })}
                    placeholder="Ej: Mejora general de condición física"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Métricas a Seguir</label>
                  <Input
                    value={formData.metricas || ''}
                    onChange={(e) => setFormData({ ...formData, metricas: e.target.value })}
                    placeholder="Ej: Entrenamientos, pasos, hidratación"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Premios/Incentivos</label>
                  <Input
                    value={formData.premios || ''}
                    onChange={(e) => setFormData({ ...formData, premios: e.target.value })}
                    placeholder="Ej: Certificado y descuento"
                  />
                </div>
              </>
            )}

            {tipoFormulario === 'virtual' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Plataforma</label>
                  <Select
                    value={formData.plataforma || ''}
                    onChange={(value) => setFormData({ ...formData, plataforma: value })}
                    options={[
                      { label: 'Zoom', value: 'Zoom' },
                      { label: 'Teams', value: 'Teams' },
                      { label: 'Google Meet', value: 'Google Meet' },
                      { label: 'Otra', value: 'Otra' },
                    ]}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Link de Acceso</label>
                  <Input
                    value={formData.linkAcceso || ''}
                    onChange={(e) => setFormData({ ...formData, linkAcceso: e.target.value })}
                    placeholder="https://..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Requisitos Técnicos</label>
                  <Input
                    value={formData.requisitosTecnicos || ''}
                    onChange={(e) => setFormData({ ...formData, requisitosTecnicos: e.target.value })}
                    placeholder="Ej: Conexión estable a internet"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.grabacion || false}
                    onChange={(e) => setFormData({ ...formData, grabacion: e.target.checked })}
                    className="rounded"
                  />
                  <label className="text-sm font-medium text-gray-700">Grabar sesión</label>
                </div>
              </>
            )}

            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button
                variant="secondary"
                onClick={() => {
                  setMostrarFormulario(false);
                  setEventoEditando(null);
                }}
              >
                Cancelar
              </Button>
              <Button onClick={handleGuardar}>Guardar</Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Modal de Detalle */}
      {eventoSeleccionado && (
        <Modal
          isOpen={!!eventoSeleccionado}
          onClose={() => setEventoSeleccionado(null)}
          title={eventoSeleccionado.nombre}
        >
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              {getTipoBadge(eventoSeleccionado.tipo)}
              {getEstadoBadge(eventoSeleccionado.estado)}
            </div>
            <p className="text-gray-600">{eventoSeleccionado.descripcion}</p>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-gray-400" />
                <span>
                  {new Date(eventoSeleccionado.fechaInicio).toLocaleDateString('es-ES', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-gray-400" />
                <span>
                  {eventoSeleccionado.participantes.length} / {eventoSeleccionado.capacidad} participantes
                </span>
              </div>
              {eventoSeleccionado.tipo === 'presencial' && eventoSeleccionado.ubicacion && (
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  <span>{eventoSeleccionado.ubicacion}</span>
                </div>
              )}
              {eventoSeleccionado.tipo === 'virtual' && eventoSeleccionado.linkAcceso && (
                <div>
                  <a
                    href={eventoSeleccionado.linkAcceso}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    {eventoSeleccionado.linkAcceso}
                  </a>
                </div>
              )}
            </div>
            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button variant="secondary" onClick={() => setEventoSeleccionado(null)}>
                Cerrar
              </Button>
              <Button onClick={() => {
                setEventoSeleccionado(null);
                handleEditarEvento(eventoSeleccionado);
              }}>
                Editar
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

