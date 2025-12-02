import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Button, Input } from '../../../components/componentsreutilizables';
import { 
  Calendar, 
  MapPin, 
  Video, 
  Target, 
  Users, 
  Clock, 
  CheckCircle, 
  XCircle,
  AlertCircle,
  ArrowLeft
} from 'lucide-react';
import { getEventoPorPublicLink, inscribirClientePublico, Evento } from '../api/events';

export const PublicEventRegistrationPage: React.FC = () => {
  const { publicLink } = useParams<{ publicLink: string }>();
  const navigate = useNavigate();
  const [evento, setEvento] = useState<Evento | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [enListaEspera, setEnListaEspera] = useState(false);

  // Formulario
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [telefono, setTelefono] = useState('');

  useEffect(() => {
    cargarEvento();
  }, [publicLink]);

  const cargarEvento = async () => {
    if (!publicLink) {
      setError('Link de evento no válido');
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const eventoData = await getEventoPorPublicLink(publicLink);
      if (!eventoData) {
        setError('Evento no encontrado');
      } else if (!eventoData.inscripcionesPublicasHabilitadas) {
        setError('Las inscripciones públicas no están habilitadas para este evento');
      } else if (eventoData.estado !== 'programado' && eventoData.estado !== 'en-curso') {
        setError('Este evento no acepta inscripciones en este momento');
      } else {
        setEvento(eventoData);
      }
    } catch (err) {
      console.error('Error cargando evento:', err);
      setError('Error al cargar el evento');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!nombre.trim() || !email.trim()) {
      setError('Por favor, completa todos los campos obligatorios');
      return;
    }

    if (!evento) return;

    setSubmitting(true);
    setError(null);

    try {
      const resultado = await inscribirClientePublico(evento.id, {
        nombre: nombre.trim(),
        email: email.trim(),
        telefono: telefono.trim() || undefined,
      });

      if (resultado.success) {
        setSuccess(true);
        setEnListaEspera(resultado.enListaEspera || false);
      } else {
        setError(resultado.message);
      }
    } catch (err) {
      console.error('Error inscribiendo:', err);
      setError('Error al procesar la inscripción. Por favor, intenta de nuevo.');
    } finally {
      setSubmitting(false);
    }
  };

  const getTipoEventoIcon = (tipo: string) => {
    switch (tipo) {
      case 'presencial':
        return <MapPin className="w-5 h-5" />;
      case 'virtual':
        return <Video className="w-5 h-5" />;
      case 'reto':
        return <Target className="w-5 h-5" />;
      default:
        return <Calendar className="w-5 h-5" />;
    }
  };

  const getTipoEventoLabel = (tipo: string) => {
    switch (tipo) {
      case 'presencial':
        return 'Evento Presencial';
      case 'virtual':
        return 'Evento Virtual';
      case 'reto':
        return 'Reto';
      default:
        return tipo;
    }
  };

  const participantesInscritos = evento?.participantesDetalle?.filter(p => !p.fechaCancelacion).length || 0;
  const capacidadDisponible = evento ? evento.capacidad - participantesInscritos : 0;
  const estaLleno = capacidadDisponible <= 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 flex items-center justify-center">
        <Card className="p-8 max-w-md w-full">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Cargando evento...</p>
          </div>
        </Card>
      </div>
    );
  }

  if (error && !evento) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 flex items-center justify-center p-4">
        <Card className="p-8 max-w-md w-full">
          <div className="text-center">
            <XCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-900 mb-2">Error</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <Button onClick={() => navigate('/')}>Volver al inicio</Button>
          </div>
        </Card>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 flex items-center justify-center p-4">
        <Card className="p-8 max-w-md w-full">
          <div className="text-center">
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {enListaEspera ? '¡Estás en la lista de espera!' : '¡Inscripción exitosa!'}
            </h2>
            <p className="text-gray-600 mb-6">
              {enListaEspera
                ? 'Te hemos agregado a la lista de espera. Te notificaremos por email si hay disponibilidad.'
                : 'Te esperamos en el evento. Recibirás un email de confirmación con todos los detalles.'}
            </p>
            {evento && (
              <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
                <p className="font-semibold text-gray-900 mb-2">{evento.nombre}</p>
                <p className="text-sm text-gray-600">
                  {new Date(evento.fechaInicio).toLocaleDateString('es-ES', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>
            )}
            <Button onClick={() => navigate('/')}>Cerrar</Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Información del evento */}
        <Card className="p-6 mb-6">
          <div className="flex items-start gap-4 mb-6">
            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
              {evento && getTipoEventoIcon(evento.tipo)}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h1 className="text-2xl font-bold text-gray-900">{evento?.nombre}</h1>
                {evento && (
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded">
                    {getTipoEventoLabel(evento.tipo)}
                  </span>
                )}
              </div>
              {evento?.descripcion && (
                <p className="text-gray-600 mb-4">{evento.descripcion}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="flex items-center gap-3 text-gray-700">
              <Calendar className="w-5 h-5 text-gray-500" />
              <div>
                <p className="text-sm text-gray-500">Fecha y hora</p>
                <p className="font-medium">
                  {evento && new Date(evento.fechaInicio).toLocaleDateString('es-ES', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>
            </div>

            {evento?.ubicacion && (
              <div className="flex items-center gap-3 text-gray-700">
                <MapPin className="w-5 h-5 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500">Ubicación</p>
                  <p className="font-medium">{evento.ubicacion}</p>
                </div>
              </div>
            )}

            {evento?.plataforma && (
              <div className="flex items-center gap-3 text-gray-700">
                <Video className="w-5 h-5 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500">Plataforma</p>
                  <p className="font-medium">{evento.plataforma}</p>
                </div>
              </div>
            )}

            <div className="flex items-center gap-3 text-gray-700">
              <Users className="w-5 h-5 text-gray-500" />
              <div>
                <p className="text-sm text-gray-500">Capacidad</p>
                <p className="font-medium">
                  {participantesInscritos} / {evento?.capacidad} participantes
                </p>
              </div>
            </div>
          </div>

          {estaLleno && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <div className="flex items-center gap-2 text-yellow-800">
                <AlertCircle className="w-5 h-5" />
                <p className="font-medium">Evento lleno</p>
              </div>
              <p className="text-sm text-yellow-700 mt-1">
                Puedes inscribirte en la lista de espera. Te notificaremos si hay disponibilidad.
              </p>
            </div>
          )}
        </Card>

        {/* Formulario de inscripción */}
        <Card className="p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Inscripción al evento</h2>
          
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <div className="flex items-center gap-2 text-red-800">
                <XCircle className="w-5 h-5" />
                <p className="font-medium">Error</p>
              </div>
              <p className="text-sm text-red-700 mt-1">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 mb-1">
                Nombre completo <span className="text-red-500">*</span>
              </label>
              <Input
                id="nombre"
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                required
                placeholder="Tu nombre completo"
                disabled={submitting || estaLleno}
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email <span className="text-red-500">*</span>
              </label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="tu@email.com"
                disabled={submitting || estaLleno}
              />
            </div>

            <div>
              <label htmlFor="telefono" className="block text-sm font-medium text-gray-700 mb-1">
                Teléfono (opcional)
              </label>
              <Input
                id="telefono"
                type="tel"
                value={telefono}
                onChange={(e) => setTelefono(e.target.value)}
                placeholder="+34 123 456 789"
                disabled={submitting || estaLleno}
              />
            </div>

            <div className="pt-4">
              <Button
                type="submit"
                disabled={submitting || estaLleno}
                className="w-full"
                size="lg"
              >
                {submitting
                  ? 'Procesando...'
                  : estaLleno
                  ? 'Inscribirse en lista de espera'
                  : 'Inscribirse al evento'}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
};


