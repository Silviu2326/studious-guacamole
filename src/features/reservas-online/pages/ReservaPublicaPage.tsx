import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Button, Input, Select, Textarea } from '../../../components/componentsreutilizables';
import { 
  Calendar, 
  Clock, 
  User, 
  CheckCircle, 
  AlertCircle, 
  ArrowLeft,
  FileText,
  CreditCard,
  Mail
} from 'lucide-react';
import { getEnlacePublicoPorToken, incrementarReservasDesdeEnlace } from '../api/enlacePublico';
import { getDisponibilidad } from '../api/disponibilidad';
import { crearReserva, procesarPago, enviarConfirmacion } from '../api';
import { getConfiguracionAprobacion } from '../api/configuracionAprobacion';
import { getPlantillasSesionActivas, getPlantillaSesionPorId, calcularPrecioSesion } from '../api/plantillasSesion';
import { EnlacePublico, Disponibilidad, Reserva, PlantillaSesion } from '../types';

export default function ReservaPublicaPage() {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const [enlace, setEnlace] = useState<EnlacePublico | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [fechaSeleccionada, setFechaSeleccionada] = useState(new Date());
  const [disponibilidad, setDisponibilidad] = useState<Disponibilidad[]>([]);
  const [huecoSeleccionado, setHuecoSeleccionado] = useState<Disponibilidad | null>(null);
  const [paso, setPaso] = useState<'seleccion' | 'confirmacion' | 'pago' | 'exito'>('seleccion');
  const [clienteNombre, setClienteNombre] = useState('');
  const [clienteEmail, setClienteEmail] = useState('');
  const [tipoSesion, setTipoSesion] = useState<'presencial' | 'videollamada'>('presencial');
  const [plantillaSeleccionada, setPlantillaSeleccionada] = useState<string>('');
  const [plantillasDisponibles, setPlantillasDisponibles] = useState<PlantillaSesion[]>([]);
  const [precioCalculado, setPrecioCalculado] = useState<number>(50);
  const [metodoPago, setMetodoPago] = useState('tarjeta');
  const [procesando, setProcesando] = useState(false);
  const [aprobacionAutomatica, setAprobacionAutomatica] = useState(true);
  const [observacionesCliente, setObservacionesCliente] = useState<string>('');

  useEffect(() => {
    if (token) {
      cargarEnlace();
    }
  }, [token]);

  useEffect(() => {
    if (enlace && enlace.activo) {
      cargarDisponibilidad();
      cargarPlantillas();
      cargarConfiguracionAprobacion();
    }
  }, [enlace, fechaSeleccionada]);

  useEffect(() => {
    if (plantillaSeleccionada && plantillasDisponibles.length > 0) {
      actualizarPrecio();
    }
  }, [plantillaSeleccionada, tipoSesion]);

  const cargarEnlace = async () => {
    if (!token) {
      setError('Token no válido');
      setLoading(false);
      return;
    }

    try {
      const enlaceData = await getEnlacePublicoPorToken(token);
      if (!enlaceData) {
        setError('Enlace no encontrado o inactivo');
        setLoading(false);
        return;
      }
      setEnlace(enlaceData);
    } catch (error) {
      console.error('Error cargando enlace:', error);
      setError('Error al cargar el enlace');
    } finally {
      setLoading(false);
    }
  };

  const cargarDisponibilidad = async () => {
    if (!enlace) return;

    try {
      const disponibilidadData = await getDisponibilidad(
        fechaSeleccionada,
        'entrenador',
        enlace.entrenadorId
      );
      // Filtrar solo los slots disponibles
      const disponibles = disponibilidadData.filter(d => d.disponible);
      setDisponibilidad(disponibles);
    } catch (error) {
      console.error('Error cargando disponibilidad:', error);
    }
  };

  const cargarPlantillas = async () => {
    if (!enlace) return;

    try {
      const plantillas = await getPlantillasSesionActivas(enlace.entrenadorId);
      setPlantillasDisponibles(plantillas);
      if (plantillas.length > 0) {
        setPlantillaSeleccionada(plantillas[0].id);
        const primeraPlantilla = plantillas[0];
        setTipoSesion(primeraPlantilla.tipoSesion);
        setPrecioCalculado(primeraPlantilla.precio);
      }
    } catch (error) {
      console.error('Error cargando plantillas:', error);
    }
  };

  const cargarConfiguracionAprobacion = async () => {
    if (!enlace) return;

    try {
      const config = await getConfiguracionAprobacion(enlace.entrenadorId);
      setAprobacionAutomatica(config.aprobacionAutomatica);
    } catch (error) {
      console.error('Error cargando configuración:', error);
    }
  };

  const actualizarPrecio = async () => {
    if (!enlace || !plantillaSeleccionada) return;

    try {
      const plantilla = await getPlantillaSesionPorId(enlace.entrenadorId, plantillaSeleccionada);
      if (plantilla) {
        const multiplicadorModalidad = tipoSesion === 'videollamada' ? 0.9 : 1.0;
        const precio = calcularPrecioSesion(
          plantilla.precio,
          tipoSesion,
          plantilla.duracionMinutos,
          multiplicadorModalidad
        );
        setPrecioCalculado(precio);
      }
    } catch (error) {
      console.error('Error calculando precio:', error);
    }
  };

  const cambiarFecha = (dias: number) => {
    const nuevaFecha = new Date(fechaSeleccionada);
    nuevaFecha.setDate(nuevaFecha.getDate() + dias);
    setFechaSeleccionada(nuevaFecha);
    setHuecoSeleccionado(null);
  };

  const seleccionarHueco = (hueco: Disponibilidad) => {
    setHuecoSeleccionado(hueco);
    setPaso('confirmacion');
  };

  const calcularHoraFin = (horaInicio: string, duracionMinutos: number): string => {
    const [horas, minutos] = horaInicio.split(':').map(Number);
    const totalMinutos = horas * 60 + minutos + duracionMinutos;
    const nuevasHoras = Math.floor(totalMinutos / 60);
    const nuevosMinutos = totalMinutos % 60;
    return `${String(nuevasHoras).padStart(2, '0')}:${String(nuevosMinutos).padStart(2, '0')}`;
  };

  const confirmarReserva = async () => {
    if (!clienteNombre.trim() || !clienteEmail.trim() || !huecoSeleccionado || !enlace) {
      return;
    }

    setProcesando(true);
    try {
      // Obtener plantilla seleccionada para determinar tipo de entrenamiento
      let tipoEntrenamiento: 'sesion-1-1' | 'fisio' | 'nutricion' | 'masaje' = 'sesion-1-1';
      let duracionMinutos = 60;

      if (plantillaSeleccionada) {
        const plantilla = await getPlantillaSesionPorId(enlace.entrenadorId, plantillaSeleccionada);
        if (plantilla) {
          tipoEntrenamiento = plantilla.tipoEntrenamiento;
          duracionMinutos = plantilla.duracionMinutos;
        }
      } else if (huecoSeleccionado.duracionMinutos) {
        duracionMinutos = huecoSeleccionado.duracionMinutos;
      }

      const horaFin = calcularHoraFin(huecoSeleccionado.horaInicio, duracionMinutos);

      // Crear reserva con estado según la configuración
      const estadoReserva = aprobacionAutomatica ? 'confirmada' : 'pendiente';

      // Construir observaciones combinando las del cliente con información del enlace público
      const observacionesCompletas = [
        `Reserva realizada desde enlace público. Email: ${clienteEmail}`,
        observacionesCliente.trim(),
      ].filter(Boolean).join('\n\n');

      const reserva = await crearReserva({
        clienteId: `cliente-publico-${Date.now()}`,
        clienteNombre,
        fecha: fechaSeleccionada,
        horaInicio: huecoSeleccionado.horaInicio,
        horaFin,
        tipo: tipoEntrenamiento,
        tipoSesion,
        estado: estadoReserva,
        precio: precioCalculado,
        pagado: false,
        duracionMinutos,
        observaciones: observacionesCompletas || undefined,
      }, enlace?.entrenadorId);

      // Incrementar contador de reservas desde el enlace
      if (enlace.token) {
        await incrementarReservasDesdeEnlace(enlace.token);
      }

      setPaso('pago');

      // Procesar pago
      const pago = await procesarPago(reserva.id, metodoPago);

      if (pago.exito) {
        // Enviar confirmación por email y WhatsApp
        await enviarConfirmacion(reserva.id, 'email');
        // En producción, también se podría enviar por WhatsApp si el cliente tiene teléfono
        // await enviarConfirmacion(reserva.id, 'whatsapp');

        setPaso('exito');
      }
    } catch (error) {
      console.error('Error al procesar reserva:', error);
      const mensajeError = error instanceof Error ? error.message : 'Error al procesar la reserva. Por favor, inténtalo de nuevo.';
      setError(mensajeError);
    } finally {
      setProcesando(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  if (error || !enlace || !enlace.activo) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 flex items-center justify-center">
        <Card className="p-8 max-w-md w-full">
          <div className="text-center">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Enlace no disponible</h2>
            <p className="text-gray-600 mb-4">
              {error || 'Este enlace no está activo o no existe.'}
            </p>
          </div>
        </Card>
      </div>
    );
  }

  if (paso === 'exito') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 flex items-center justify-center p-4">
        <Card className="p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {aprobacionAutomatica ? '¡Reserva Confirmada!' : 'Reserva Pendiente de Aprobación'}
          </h2>
          <p className="text-gray-600 mb-4">
            {aprobacionAutomatica
              ? 'Tu reserva ha sido confirmada. Recibirás un email con los detalles.'
              : 'Tu reserva está pendiente de aprobación. Recibirás un email cuando sea aprobada.'}
          </p>
          {huecoSeleccionado && (
            <div className="p-4 bg-gray-50 rounded-lg mb-4">
              <p className="text-sm text-gray-600 mb-1">Fecha y Hora</p>
              <p className="text-base font-semibold text-gray-900">
                {fechaSeleccionada.toLocaleDateString('es-ES', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
              <p className="text-base font-semibold text-gray-900">
                {huecoSeleccionado.horaInicio} - {calcularHoraFin(huecoSeleccionado.horaInicio, plantillasDisponibles.find(p => p.id === plantillaSeleccionada)?.duracionMinutos || 60)}
              </p>
            </div>
          )}
        </Card>
      </div>
    );
  }

  if (paso === 'pago') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 flex items-center justify-center p-4">
        <Card className="p-8 max-w-md w-full text-center">
          <CreditCard className="w-12 h-12 text-blue-500 mx-auto mb-4 animate-pulse" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">Procesando Pago</h2>
          <p className="text-gray-600">Por favor espere...</p>
        </Card>
      </div>
    );
  }

  if (paso === 'confirmacion' && huecoSeleccionado) {
    const plantilla = plantillasDisponibles.find(p => p.id === plantillaSeleccionada);
    const duracionMinutos = plantilla?.duracionMinutos || huecoSeleccionado.duracionMinutos || 60;

    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 py-8 px-4">
        <div className="max-w-2xl mx-auto">
          <Card className="p-6 bg-white shadow-sm">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Confirmar Reserva</h2>

            <div className="space-y-4">
              <div className="p-4 bg-slate-50 rounded-lg ring-1 ring-slate-200">
                <p className="text-sm text-gray-600 mb-2">Fecha y Hora</p>
                <p className="text-base font-semibold text-gray-900">
                  {fechaSeleccionada.toLocaleDateString('es-ES', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
                <p className="text-base font-semibold text-gray-900">
                  {huecoSeleccionado.horaInicio} - {calcularHoraFin(huecoSeleccionado.horaInicio, duracionMinutos)}
                </p>
              </div>

              <Input
                label="Nombre Completo"
                value={clienteNombre}
                onChange={(e) => setClienteNombre(e.target.value)}
                placeholder="Ingresa tu nombre"
                leftIcon={<User className="w-5 h-5" />}
                required
              />

              <Input
                label="Email"
                type="email"
                value={clienteEmail}
                onChange={(e) => setClienteEmail(e.target.value)}
                placeholder="tu@email.com"
                leftIcon={<Mail className="w-5 h-5" />}
                required
              />

              {plantillasDisponibles.length > 0 && (
                <>
                  <Select
                    label="Tipo de Sesión"
                    value={plantillaSeleccionada}
                    onChange={(e) => setPlantillaSeleccionada(e.target.value)}
                    options={plantillasDisponibles.map(p => ({
                      value: p.id,
                      label: `${p.nombre}${p.descripcion ? ` - ${p.descripcion}` : ''} (${p.duracionMinutos} min - €${p.precio})`,
                    }))}
                    leftIcon={<FileText className="w-5 h-5" />}
                  />
                  <Select
                    label="Modalidad"
                    value={tipoSesion}
                    onChange={(e) => setTipoSesion(e.target.value as 'presencial' | 'videollamada')}
                    options={[
                      { value: 'presencial', label: 'Presencial' },
                      { value: 'videollamada', label: 'Videollamada (10% descuento)' },
                    ]}
                  />
                </>
              )}

              <Textarea
                label="Observaciones (opcional)"
                value={observacionesCliente}
                onChange={(e) => setObservacionesCliente(e.target.value)}
                placeholder="Añade cualquier información relevante para preparar mejor la sesión (objetivos, lesiones, preferencias, etc.)"
                rows={4}
                className="w-full"
              />
              <p className="text-xs text-gray-500 -mt-2">
                Esta información ayudará al entrenador a preparar mejor la sesión según tus necesidades específicas.
              </p>

              <Select
                label="Método de Pago"
                value={metodoPago}
                onChange={(e) => setMetodoPago(e.target.value)}
                options={[
                  { value: 'tarjeta', label: 'Tarjeta de Crédito' },
                  { value: 'transferencia', label: 'Transferencia' },
                  { value: 'efectivo', label: 'Efectivo' },
                ]}
              />

              <div className="p-4 bg-blue-50 rounded-lg ring-1 ring-blue-200">
                <div className="flex items-center justify-between">
                  <span className="text-base text-gray-900">Total</span>
                  <span className="text-2xl font-bold text-blue-600">
                    €{precioCalculado.toFixed(2)}
                  </span>
                </div>
              </div>

              {!aprobacionAutomatica && (
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
                    <p className="text-sm text-yellow-800">
                      Esta reserva quedará pendiente de aprobación. Recibirás un email cuando sea confirmada.
                    </p>
                  </div>
                </div>
              )}

              <div className="flex gap-3">
                <Button
                  variant="secondary"
                  onClick={() => {
                    setPaso('seleccion');
                    setHuecoSeleccionado(null);
                  }}
                  fullWidth
                >
                  Volver
                </Button>
                <Button
                  variant="primary"
                  onClick={confirmarReserva}
                  disabled={!clienteNombre.trim() || !clienteEmail.trim() || procesando}
                  loading={procesando}
                  fullWidth
                >
                  Confirmar y Pagar
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Header */}
      <div className="border-b border-gray-200/60 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900 mb-2">
              {enlace.nombrePersonalizado || 'Reserva tu Sesión'}
            </h1>
            {enlace.descripcion && (
              <p className="text-gray-600">{enlace.descripcion}</p>
            )}
          </div>
        </div>
      </div>

      {/* Contenido */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="p-6 bg-white shadow-sm mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-blue-600" />
              <h2 className="text-xl font-bold text-gray-900">Selecciona Fecha y Hora</h2>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => cambiarFecha(-1)}
              >
                ← Anterior
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setFechaSeleccionada(new Date())}
              >
                Hoy
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => cambiarFecha(1)}
              >
                Siguiente →
              </Button>
            </div>
          </div>

          <p className="text-gray-600 mb-4">
            {fechaSeleccionada.toLocaleDateString('es-ES', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>

          {disponibilidad.length === 0 ? (
            <div className="text-center py-8">
              <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No hay horarios disponibles para esta fecha</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {disponibilidad.map((hueco) => {
                const plantilla = plantillasDisponibles.find(p => 
                  p.duracionMinutos === (hueco.duracionMinutos || 60)
                );
                const duracionMinutos = hueco.duracionMinutos || 60;
                const horaFin = calcularHoraFin(hueco.horaInicio, duracionMinutos);

                return (
                  <button
                    key={hueco.id}
                    onClick={() => seleccionarHueco(hueco)}
                    className="p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all text-left"
                  >
                    <p className="font-semibold text-gray-900">{hueco.horaInicio}</p>
                    <p className="text-sm text-gray-600">{horaFin}</p>
                    {plantilla && (
                      <p className="text-xs text-gray-500 mt-1">{plantilla.nombre}</p>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}

