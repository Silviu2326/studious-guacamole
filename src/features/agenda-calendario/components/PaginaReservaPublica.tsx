import React, { useState, useEffect } from 'react';
import { Calendar, Clock, User, Mail, Phone, CheckCircle, AlertCircle, ArrowLeft } from 'lucide-react';
import { Card, Button, Input, Select, Textarea } from '../../../components/componentsreutilizables';
import { EnlaceReservaPublica, TipoCita, ReservaPublica } from '../types';
import {
  getEnlaceReservaPorSlug,
  getHorariosDisponibles,
  crearReservaPublica,
} from '../api/enlacesReserva';

const TIPOS_SESION_LABELS: Record<TipoCita, string> = {
  'sesion-1-1': 'Sesión 1:1',
  'videollamada': 'Videollamada',
  'evaluacion': 'Evaluación',
  'clase-colectiva': 'Clase Colectiva',
  'fisioterapia': 'Fisioterapia',
  'mantenimiento': 'Mantenimiento',
  'otro': 'Otro',
};

interface PaginaReservaPublicaProps {
  slug: string;
}

export const PaginaReservaPublica: React.FC<PaginaReservaPublicaProps> = ({ slug }) => {
  const [enlace, setEnlace] = useState<EnlaceReservaPublica | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [horarios, setHorarios] = useState<Array<{ fecha: Date; hora: number; minuto: number; disponible: boolean }>>([]);
  const [fechaSeleccionada, setFechaSeleccionada] = useState<Date | null>(null);
  const [slotSeleccionado, setSlotSeleccionado] = useState<{ fecha: Date; hora: number; minuto: number } | null>(null);
  const [tipoSesionSeleccionado, setTipoSesionSeleccionado] = useState<TipoCita | ''>('');
  const [reservaCompletada, setReservaCompletada] = useState(false);
  const [reservaInfo, setReservaInfo] = useState<ReservaPublica | null>(null);

  const [formData, setFormData] = useState({
    nombreCliente: '',
    emailCliente: '',
    telefonoCliente: '',
    notas: '',
  });

  useEffect(() => {
    cargarEnlace();
  }, [slug]);

  useEffect(() => {
    if (enlace && enlace.activo && enlace.mostrarHorariosDisponibles) {
      cargarHorarios();
    }
  }, [enlace]);

  const cargarEnlace = async () => {
    setLoading(true);
    setError(null);
    try {
      const enlaceData = await getEnlaceReservaPorSlug(slug);
      if (!enlaceData) {
        setError('Enlace de reserva no encontrado');
        return;
      }
      if (!enlaceData.activo) {
        setError('Este enlace de reserva no está activo');
        return;
      }
      setEnlace(enlaceData);
      if (enlaceData.tiposSesionDisponibles.length > 0) {
        setTipoSesionSeleccionado(enlaceData.tiposSesionDisponibles[0]);
      }
    } catch (error) {
      setError('Error al cargar el enlace de reserva');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const cargarHorarios = async () => {
    if (!enlace) return;

    try {
      const fechaInicio = new Date();
      const fechaFin = new Date();
      fechaFin.setDate(fechaFin.getDate() + 14); // Próximos 14 días

      const horariosData = await getHorariosDisponibles(
        enlace.entrenadorId,
        fechaInicio,
        fechaFin,
        enlace.tiposSesionDisponibles
      );
      setHorarios(horariosData);
    } catch (error) {
      console.error('Error al cargar horarios:', error);
    }
  };

  const handleSeleccionarSlot = (fecha: Date, hora: number, minuto: number) => {
    setSlotSeleccionado({ fecha, hora, minuto });
    setFechaSeleccionada(fecha);
  };

  const handleSubmitReserva = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!enlace || !slotSeleccionado || !tipoSesionSeleccionado) {
      setError('Por favor completa todos los campos requeridos');
      return;
    }

    if (!formData.nombreCliente || !formData.emailCliente) {
      setError('Nombre y email son requeridos');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Calcular fecha de fin (asumiendo 1 hora de duración por defecto)
      const fechaInicio = new Date(slotSeleccionado.fecha);
      fechaInicio.setHours(slotSeleccionado.hora, slotSeleccionado.minuto, 0, 0);
      const fechaFin = new Date(fechaInicio);
      fechaFin.setHours(fechaFin.getHours() + 1);

      const reserva = await crearReservaPublica({
        enlaceId: enlace.id,
        entrenadorId: enlace.entrenadorId,
        nombreCliente: formData.nombreCliente,
        emailCliente: formData.emailCliente,
        telefonoCliente: formData.telefonoCliente || undefined,
        tipoSesion: tipoSesionSeleccionado,
        fechaInicio,
        fechaFin,
        notas: formData.notas || undefined,
        confirmadoAutomaticamente: !enlace.requiereConfirmacion,
      });

      setReservaInfo(reserva);
      setReservaCompletada(true);
    } catch (error) {
      setError('Error al crear la reserva. Por favor, intenta de nuevo.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const getHorariosDelDia = (fecha: Date) => {
    return horarios.filter(
      h =>
        h.fecha.getDate() === fecha.getDate() &&
        h.fecha.getMonth() === fecha.getMonth() &&
        h.fecha.getFullYear() === fecha.getFullYear() &&
        h.disponible
    );
  };

  const getFechasDisponibles = () => {
    const fechas = new Set<string>();
    horarios.forEach(h => {
      if (h.disponible) {
        const fechaStr = h.fecha.toISOString().split('T')[0];
        fechas.add(fechaStr);
      }
    });
    return Array.from(fechas)
      .map(f => new Date(f))
      .sort((a, b) => a.getTime() - b.getTime());
  };

  if (loading && !enlace) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-gray-600">Cargando...</div>
        </div>
      </div>
    );
  }

  if (error && !enlace) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 flex items-center justify-center">
        <Card className="max-w-md w-full p-6">
          <div className="text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-900 mb-2">Error</h2>
            <p className="text-gray-600">{error}</p>
          </div>
        </Card>
      </div>
    );
  }

  if (reservaCompletada && reservaInfo) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 flex items-center justify-center p-4">
        <Card className="max-w-md w-full p-6">
          <div className="text-center">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              ¡Reserva Confirmada!
            </h2>
            <p className="text-gray-600 mb-6">
              {reservaInfo.estado === 'confirmada'
                ? 'Tu reserva ha sido confirmada automáticamente.'
                : 'Tu reserva está pendiente de confirmación. Te contactaremos pronto.'}
            </p>
            <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
              <div className="space-y-2">
                <div>
                  <span className="font-semibold text-gray-700">Fecha y hora:</span>
                  <p className="text-gray-900">
                    {new Date(reservaInfo.fechaInicio).toLocaleString('es-ES', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
                <div>
                  <span className="font-semibold text-gray-700">Tipo de sesión:</span>
                  <p className="text-gray-900">{TIPOS_SESION_LABELS[reservaInfo.tipoSesion]}</p>
                </div>
                <div>
                  <span className="font-semibold text-gray-700">Nombre:</span>
                  <p className="text-gray-900">{reservaInfo.nombreCliente}</p>
                </div>
              </div>
            </div>
            <Button
              variant="primary"
              onClick={() => {
                setReservaCompletada(false);
                setReservaInfo(null);
                setSlotSeleccionado(null);
                setFormData({
                  nombreCliente: '',
                  emailCliente: '',
                  telefonoCliente: '',
                  notas: '',
                });
              }}
            >
              Hacer Otra Reserva
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  if (!enlace) {
    return null;
  }

  const fechasDisponibles = getFechasDisponibles();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <Card className="bg-white shadow-sm mb-6">
          <div className="p-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {enlace.nombrePersonalizado || 'Reserva tu Sesión'}
            </h1>
            {enlace.mensajeBienvenida && (
              <p className="text-gray-600">{enlace.mensajeBienvenida}</p>
            )}
          </div>
        </Card>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2 text-red-800">
            <AlertCircle className="w-5 h-5" />
            <span>{error}</span>
            <button onClick={() => setError(null)} className="ml-auto text-red-600 hover:text-red-800">
              ✕
            </button>
          </div>
        )}

        <form onSubmit={handleSubmitReserva}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Selección de Tipo de Sesión y Fecha/Hora */}
            <Card className="bg-white shadow-sm">
              <div className="p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                  <Calendar className="w-5 h-5 mr-2 text-blue-600" />
                  Selecciona tu Sesión
                </h2>

                {/* Tipo de Sesión */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tipo de Sesión *
                  </label>
                  <Select
                    value={tipoSesionSeleccionado}
                    onChange={(e) => setTipoSesionSeleccionado(e.target.value as TipoCita)}
                    options={enlace.tiposSesionDisponibles.map(tipo => ({
                      value: tipo,
                      label: TIPOS_SESION_LABELS[tipo],
                    }))}
                    required
                  />
                </div>

                {/* Selección de Fecha y Hora */}
                {enlace.mostrarHorariosDisponibles && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Fecha *
                      </label>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-48 overflow-y-auto">
                        {fechasDisponibles.map((fecha) => (
                          <button
                            key={fecha.toISOString()}
                            type="button"
                            onClick={() => setFechaSeleccionada(fecha)}
                            className={`p-3 border rounded-lg text-sm font-medium transition-colors ${
                              fechaSeleccionada &&
                              fechaSeleccionada.toDateString() === fecha.toDateString()
                                ? 'bg-blue-600 text-white border-blue-600'
                                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                            }`}
                          >
                            {fecha.toLocaleDateString('es-ES', {
                              weekday: 'short',
                              day: 'numeric',
                              month: 'short',
                            })}
                          </button>
                        ))}
                      </div>
                    </div>

                    {fechaSeleccionada && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Hora *
                        </label>
                        <div className="grid grid-cols-3 gap-2 max-h-48 overflow-y-auto">
                          {getHorariosDelDia(fechaSeleccionada).map((horario, index) => {
                            const esSeleccionado =
                              slotSeleccionado?.fecha.toDateString() === horario.fecha.toDateString() &&
                              slotSeleccionado?.hora === horario.hora &&
                              slotSeleccionado?.minuto === horario.minuto;

                            return (
                              <button
                                key={index}
                                type="button"
                                onClick={() => handleSeleccionarSlot(horario.fecha, horario.hora, horario.minuto)}
                                className={`p-2 border rounded-lg text-sm font-medium transition-colors ${
                                  esSeleccionado
                                    ? 'bg-blue-600 text-white border-blue-600'
                                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                                }`}
                              >
                                {horario.hora.toString().padStart(2, '0')}:
                                {horario.minuto.toString().padStart(2, '0')}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </Card>

            {/* Formulario de Datos del Cliente */}
            <Card className="bg-white shadow-sm">
              <div className="p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                  <User className="w-5 h-5 mr-2 text-blue-600" />
                  Tus Datos
                </h2>

                <div className="space-y-4">
                  <Input
                    label="Nombre completo *"
                    value={formData.nombreCliente}
                    onChange={(e) => setFormData({ ...formData, nombreCliente: e.target.value })}
                    placeholder="Juan Pérez"
                    required
                    leftIcon={<User className="w-4 h-4" />}
                  />

                  <Input
                    label="Email *"
                    type="email"
                    value={formData.emailCliente}
                    onChange={(e) => setFormData({ ...formData, emailCliente: e.target.value })}
                    placeholder="juan@ejemplo.com"
                    required
                    leftIcon={<Mail className="w-4 h-4" />}
                  />

                  <Input
                    label="Teléfono (opcional)"
                    type="tel"
                    value={formData.telefonoCliente}
                    onChange={(e) => setFormData({ ...formData, telefonoCliente: e.target.value })}
                    placeholder="+34 600 000 000"
                    leftIcon={<Phone className="w-4 h-4" />}
                  />

                  <Textarea
                    label="Notas adicionales (opcional)"
                    value={formData.notas}
                    onChange={(e) => setFormData({ ...formData, notas: e.target.value })}
                    placeholder="Información adicional que quieras compartir..."
                    rows={4}
                  />
                </div>

                <div className="mt-6">
                  <Button
                    type="submit"
                    variant="primary"
                    className="w-full"
                    disabled={
                      loading ||
                      !tipoSesionSeleccionado ||
                      (!slotSeleccionado && enlace.mostrarHorariosDisponibles) ||
                      !formData.nombreCliente ||
                      !formData.emailCliente
                    }
                  >
                    {loading ? 'Procesando...' : 'Confirmar Reserva'}
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </form>
      </div>
    </div>
  );
};

