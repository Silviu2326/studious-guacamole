import React, { useState, useEffect } from 'react';
import { Card, Button, Input, Select, Textarea, Switch } from '../../../components/componentsreutilizables';
import { Disponibilidad, Reserva, PlantillaSesion, BonoActivo, ClienteInfo, PatronRecurrencia } from '../types';
import { crearReserva, procesarPago, enviarConfirmacion } from '../api';
import { crearReservaRecurrente, generarReservasDesdePatron } from '../api/reservasRecurrentes';
import { getDuracionesSesion, getDuracionSesionPorMinutos, DuracionSesion } from '../api/duracionesSesion';
import {
  getPlantillasSesionActivas,
  getPlantillaSesionPorId,
  calcularPrecioSesion,
  PlantillaSesion as PlantillaSesionType,
} from '../api/plantillasSesion';
import { getConfiguracionAprobacion } from '../api/configuracionAprobacion';
import { getBonosActivosCliente, usarSesionBono } from '../api/bonos';
import { getActiveClients } from '../../../features/gestión-de-clientes/api/clients';
import { getNotasPorCliente } from '../api/notasSesion';
import { NotaDeSesion } from '../types';
import { CheckCircle, CreditCard, Mail, X, User, Clock, FileText, Video, Link2, Gift, AlertCircle, StickyNote, ChevronDown, ChevronUp, Repeat } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';

interface ConfirmacionReservaProps {
  disponibilidad: Disponibilidad;
  role: 'entrenador' | 'gimnasio';
  onConfirmar: (reserva: Reserva) => void;
  onCancelar: () => void;
  entrenadorId?: string;
}

export const ConfirmacionReserva: React.FC<ConfirmacionReservaProps> = ({
  disponibilidad,
  role,
  onConfirmar,
  onCancelar,
  entrenadorId,
}) => {
  const { user } = useAuth();
  const [clienteSeleccionado, setClienteSeleccionado] = useState<string>('');
  const [clientes, setClientes] = useState<ClienteInfo[]>([]);
  const [bonosActivos, setBonosActivos] = useState<BonoActivo[]>([]);
  const [bonoSeleccionado, setBonoSeleccionado] = useState<string>('');
  const [tipoSesion, setTipoSesion] = useState<'presencial' | 'videollamada'>('presencial');
  const [metodoPago, setMetodoPago] = useState('tarjeta');
  const [procesando, setProcesando] = useState(false);
  const [paso, setPaso] = useState<'info' | 'pago' | 'confirmacion'>('info');
  const [plantillasDisponibles, setPlantillasDisponibles] = useState<PlantillaSesionType[]>([]);
  const [plantillaSeleccionada, setPlantillaSeleccionada] = useState<string>('');
  const [duracionSeleccionada, setDuracionSeleccionada] = useState<number>(
    disponibilidad.duracionMinutos || 60
  );
  const [precioCalculado, setPrecioCalculado] = useState<number>(50);
  const [tipoEntrenamiento, setTipoEntrenamiento] = useState<'sesion-1-1' | 'fisio' | 'nutricion' | 'masaje'>('sesion-1-1');
  const [aprobacionAutomatica, setAprobacionAutomatica] = useState(true);
  const [reservaCreada, setReservaCreada] = useState<Reserva | null>(null);
  const [notasCliente, setNotasCliente] = useState<NotaDeSesion[]>([]);
  const [cargandoNotas, setCargandoNotas] = useState(false);
  const [mostrarNotas, setMostrarNotas] = useState(true);
  const [observacionesCliente, setObservacionesCliente] = useState<string>('');
  const [esRecurrente, setEsRecurrente] = useState(false);
  const [frecuenciaRecurrencia, setFrecuenciaRecurrencia] = useState<'diaria' | 'semanal' | 'quincenal' | 'mensual'>('semanal');
  const [diaSemanaRecurrencia, setDiaSemanaRecurrencia] = useState<number>(new Date().getDay());
  const [numeroRepeticiones, setNumeroRepeticiones] = useState<number>(4);
  const [usarFechaFin, setUsarFechaFin] = useState(false);
  const [fechaFinRecurrencia, setFechaFinRecurrencia] = useState<Date>(() => {
    const fecha = new Date();
    fecha.setMonth(fecha.getMonth() + 1); // Por defecto, 1 mes desde hoy
    return fecha;
  });

  // Cargar clientes disponibles si es entrenador
  useEffect(() => {
    const cargarClientes = async () => {
      const idEntrenador = entrenadorId || user?.id;
      if (role === 'entrenador' && idEntrenador) {
        try {
          const clientesData = await getActiveClients('entrenador', idEntrenador);
          const clientesInfo: ClienteInfo[] = clientesData.map(c => ({
            id: c.id,
            nombre: c.name,
            email: c.email,
            telefono: c.phone,
          }));
          setClientes(clientesInfo);
        } catch (error) {
          console.error('Error cargando clientes:', error);
        }
      }
    };
    cargarClientes();
  }, [role, user?.id, entrenadorId]);

  // Cargar bonos activos cuando se selecciona un cliente
  useEffect(() => {
    const cargarBonos = async () => {
      if (role === 'entrenador' && clienteSeleccionado) {
        try {
          const idEntrenador = entrenadorId || user?.id;
          const bonos = await getBonosActivosCliente(clienteSeleccionado, idEntrenador);
          setBonosActivos(bonos);
          // Si hay bonos activos, no seleccionar ninguno por defecto (el usuario debe elegir)
          setBonoSeleccionado('');
        } catch (error) {
          console.error('Error cargando bonos:', error);
          setBonosActivos([]);
        }
      } else {
        setBonosActivos([]);
        setBonoSeleccionado('');
      }
    };
    cargarBonos();
  }, [clienteSeleccionado, role, user?.id, entrenadorId]);

  // Cargar notas del cliente cuando se selecciona un cliente
  useEffect(() => {
    const cargarNotas = async () => {
      if (role === 'entrenador' && clienteSeleccionado) {
        setCargandoNotas(true);
        try {
          const idEntrenador = entrenadorId || user?.id;
          const notas = await getNotasPorCliente(clienteSeleccionado, idEntrenador);
          // Mostrar solo las 3 notas más recientes
          setNotasCliente(notas.slice(0, 3));
          // Expandir notas por defecto si hay notas
          if (notas.length > 0) {
            setMostrarNotas(true);
          }
        } catch (error) {
          console.error('Error cargando notas del cliente:', error);
          setNotasCliente([]);
          setMostrarNotas(false);
        } finally {
          setCargandoNotas(false);
        }
      } else {
        setNotasCliente([]);
        setMostrarNotas(false);
      }
    };
    cargarNotas();
  }, [clienteSeleccionado, role, user?.id, entrenadorId]);

  // Cargar plantillas disponibles si es entrenador
  useEffect(() => {
    const cargarPlantillas = async () => {
      const idEntrenador = entrenadorId || user?.id;
      if (role === 'entrenador' && idEntrenador) {
        try {
          const plantillas = await getPlantillasSesionActivas(idEntrenador);
          setPlantillasDisponibles(plantillas);

          // Establecer plantilla seleccionada basada en la disponibilidad o la primera activa
          if (plantillas.length > 0) {
            const primeraPlantilla = plantillas[0];
            setPlantillaSeleccionada(primeraPlantilla.id);
            setDuracionSeleccionada(primeraPlantilla.duracionMinutos);
            setTipoSesion(primeraPlantilla.tipoSesion);
            setTipoEntrenamiento(primeraPlantilla.tipoEntrenamiento);
            setPrecioCalculado(primeraPlantilla.precio);
          }
        } catch (error) {
          console.error('Error cargando plantillas:', error);
          // Fallback a duraciones si no hay plantillas
          const duraciones = await getDuracionesSesion(idEntrenador);
          const activas = duraciones.filter(d => d.activo).sort((a, b) => a.orden - b.orden);
          if (activas.length > 0) {
            setDuracionSeleccionada(activas[0].duracionMinutos);
            setPrecioCalculado(activas[0].precio || 50);
          }
        }
      }
    };
    cargarPlantillas();
  }, [role, user?.id, entrenadorId, disponibilidad.duracionMinutos]);

  // Cargar configuración de aprobación si es entrenador
  useEffect(() => {
    const cargarConfiguracionAprobacion = async () => {
      const idEntrenador = entrenadorId || user?.id;
      if (role === 'entrenador' && idEntrenador) {
        try {
          const config = await getConfiguracionAprobacion(idEntrenador);
          setAprobacionAutomatica(config.aprobacionAutomatica);
        } catch (error) {
          console.error('Error cargando configuración de aprobación:', error);
        }
      }
    };
    cargarConfiguracionAprobacion();
  }, [role, user?.id, entrenadorId]);

  // Actualizar datos cuando cambie la plantilla seleccionada
  useEffect(() => {
    const idEntrenador = entrenadorId || user?.id;
    if (role === 'entrenador' && idEntrenador && plantillaSeleccionada) {
      const actualizarDatosPlantilla = async () => {
        try {
          const plantilla = await getPlantillaSesionPorId(idEntrenador, plantillaSeleccionada);
          if (plantilla) {
            // Actualizar datos de la plantilla
            setDuracionSeleccionada(plantilla.duracionMinutos);
            setTipoSesion(plantilla.tipoSesion);
            setTipoEntrenamiento(plantilla.tipoEntrenamiento);
          }
        } catch (error) {
          console.error('Error cargando datos de plantilla:', error);
        }
      };
      actualizarDatosPlantilla();
    }
  }, [plantillaSeleccionada, role, user?.id, entrenadorId]);

  // Actualizar precio cuando cambie la plantilla o el tipo de sesión
  useEffect(() => {
    const idEntrenador = entrenadorId || user?.id;
    if (role === 'entrenador' && idEntrenador && plantillaSeleccionada) {
      const calcularPrecio = async () => {
        try {
          const plantilla = await getPlantillaSesionPorId(idEntrenador, plantillaSeleccionada);
          if (plantilla) {
            // Calcular precio basado en la plantilla y el tipo de sesión seleccionado
            // Para videollamada, aplicar un descuento del 10% por defecto
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
      calcularPrecio();
    }
  }, [plantillaSeleccionada, tipoSesion, role, user?.id, entrenadorId]);

  // Actualizar fecha de fin de recurrencia cuando cambie la fecha de disponibilidad
  useEffect(() => {
    if (esRecurrente && disponibilidad.fecha) {
      const nuevaFechaFin = new Date(disponibilidad.fecha);
      nuevaFechaFin.setMonth(nuevaFechaFin.getMonth() + 1);
      if (nuevaFechaFin > fechaFinRecurrencia || fechaFinRecurrencia < disponibilidad.fecha) {
        setFechaFinRecurrencia(nuevaFechaFin);
      }
    }
  }, [disponibilidad.fecha, esRecurrente]);

  // Calcular precio final: si se aplica un bono, el precio es 0
  const precioFinal = bonoSeleccionado ? 0 : (role === 'entrenador' ? precioCalculado : 15);
  const clienteSeleccionadoInfo = clientes.find(c => c.id === clienteSeleccionado);
  const bonoSeleccionadoInfo = bonosActivos.find(b => b.id === bonoSeleccionado);

  // Calcular hora de fin basada en la duración seleccionada
  const calcularHoraFin = (horaInicio: string, duracionMinutos: number): string => {
    const [horas, minutos] = horaInicio.split(':').map(Number);
    const totalMinutos = horas * 60 + minutos + duracionMinutos;
    const nuevasHoras = Math.floor(totalMinutos / 60);
    const nuevosMinutos = totalMinutos % 60;
    return `${String(nuevasHoras).padStart(2, '0')}:${String(nuevosMinutos).padStart(2, '0')}`;
  };

  const handleReservar = async () => {
    if (!clienteSeleccionado || !clienteSeleccionadoInfo) return;

    setProcesando(true);
    try {
      const idEntrenador = role === 'entrenador' ? (entrenadorId || user?.id) : undefined;
      
      // Si es una reserva recurrente, crear la configuración de recurrencia
      if (esRecurrente && role === 'entrenador' && idEntrenador) {
        // Calcular hora de fin basada en la duración seleccionada
        const horaFin = calcularHoraFin(disponibilidad.horaInicio, duracionSeleccionada);
        
        // Calcular día de semana basado en la fecha seleccionada si es semanal
        const diaSemana = frecuenciaRecurrencia === 'semanal' 
          ? disponibilidad.fecha.getDay() 
          : diaSemanaRecurrencia;
        
        // Crear reserva recurrente
        const reservaRecurrente = await crearReservaRecurrente({
          entrenadorId: idEntrenador,
          clienteId: clienteSeleccionado,
          clienteNombre: clienteSeleccionadoInfo.nombre,
          fechaInicio: disponibilidad.fecha,
          horaInicio: disponibilidad.horaInicio,
          horaFin,
          tipo: tipoEntrenamiento,
          tipoSesion,
          frecuencia: frecuenciaRecurrencia,
          diaSemana: frecuenciaRecurrencia === 'semanal' ? diaSemana : undefined,
          numeroRepeticiones: usarFechaFin ? undefined : numeroRepeticiones,
          fechaFin: usarFechaFin ? fechaFinRecurrencia : undefined,
          precio: precioFinal,
          duracionMinutos: duracionSeleccionada,
          plantillaSesionId: plantillaSeleccionada || undefined,
          bonoId: bonoSeleccionado || undefined,
          observaciones: observacionesCliente.trim() || undefined,
          activo: true,
        });
        
        // Generar las reservas basadas en el patrón
        const reservasCreadas = await generarReservasDesdePatron(reservaRecurrente);
        
        if (reservasCreadas.length === 0) {
          throw new Error('No se pudieron crear las reservas recurrentes. Por favor, verifica la disponibilidad.');
        }
        
        // Usar la primera reserva creada para mostrar confirmación
        const primeraReserva = reservasCreadas[0];
        setReservaCreada(primeraReserva);
        
        // Mostrar mensaje de confirmación con número de reservas creadas
        setPaso('confirmacion');
        setTimeout(() => {
          onConfirmar(primeraReserva);
        }, 2000);
        
        return;
      }
      
      // Si no es recurrente, crear reserva única normalmente
      // Si se aplica un bono, usar una sesión del bono
      if (bonoSeleccionado) {
        await usarSesionBono(bonoSeleccionado);
      }

      // Calcular hora de fin basada en la duración seleccionada
      const horaFin = role === 'entrenador' 
        ? calcularHoraFin(disponibilidad.horaInicio, duracionSeleccionada)
        : disponibilidad.horaFin;

      // Determinar el estado de la reserva según la configuración de aprobación
      // Para entrenadores, usar la configuración; para gimnasios, siempre confirmada
      const estadoReserva = role === 'entrenador' 
        ? (aprobacionAutomatica ? 'confirmada' : 'pendiente')
        : 'confirmada';

      // Crear reserva
      const reserva = await crearReserva({
        clienteId: clienteSeleccionado,
        clienteNombre: clienteSeleccionadoInfo.nombre,
        fecha: disponibilidad.fecha,
        horaInicio: disponibilidad.horaInicio,
        horaFin,
        tipo: role === 'entrenador' ? tipoEntrenamiento : 'clase-grupal',
        tipoSesion: role === 'entrenador' ? tipoSesion : undefined,
        estado: estadoReserva,
        precio: precioFinal,
        pagado: bonoSeleccionado ? true : false, // Si se usa un bono, se considera pagado
        claseId: disponibilidad.claseId,
        claseNombre: disponibilidad.claseNombre,
        capacidad: disponibilidad.capacidad,
        ocupacion: disponibilidad.ocupacion,
        duracionMinutos: role === 'entrenador' ? duracionSeleccionada : undefined,
        bonoId: bonoSeleccionado || undefined,
        bonoNombre: bonoSeleccionadoInfo?.paqueteNombre || undefined,
        observaciones: observacionesCliente.trim() || undefined,
      }, idEntrenador);

      // Si no se usa bono, procesar pago
      if (!bonoSeleccionado) {
        setPaso('pago');
        const pago = await procesarPago(reserva.id, metodoPago);
        
        if (!pago.exito) {
          // Si el pago falla y se había usado un bono, reembolsar la sesión
          if (bonoSeleccionado) {
            // Reembolsar sesión del bono (esta función se implementaría si es necesario)
            console.error('Pago falló, se debería reembolsar la sesión del bono');
          }
          throw new Error('Error al procesar el pago');
        }
      }

      // Enviar confirmación
      await enviarConfirmacion(reserva.id, 'email');
      
      // Guardar reserva con enlace si es videollamada
      const reservaFinal = { 
        ...reserva, 
        pagado: bonoSeleccionado ? true : reserva.pagado, 
        estado: estadoReserva 
      };
      setReservaCreada(reservaFinal);
      
      setPaso('confirmacion');
      setTimeout(() => {
        onConfirmar(reservaFinal);
      }, 2000);
    } catch (error) {
      console.error('Error al procesar reserva:', error);
      const mensajeError = error instanceof Error ? error.message : 'Error al procesar la reserva. Por favor, inténtalo de nuevo.';
      alert(mensajeError);
    } finally {
      setProcesando(false);
    }
  };

  if (paso === 'confirmacion') {
    return (
      <Card className="p-8 text-center bg-white shadow-sm">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-8 h-8 text-green-600" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          {esRecurrente ? 'Reservas Recurrentes Creadas' : 'Reserva Confirmada'}
        </h3>
        <p className="text-gray-600 mb-4">
          {esRecurrente 
            ? 'Se han creado las reservas recurrentes según el patrón configurado. Se enviará confirmación por email para cada reserva.'
            : 'Se ha enviado la confirmación por email'}
        </p>
        {tipoSesion === 'videollamada' && (
          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg text-left">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Video className="w-5 h-5 text-blue-600" />
              <p className="text-sm font-medium text-blue-900">
                Sesión de Videollamada
              </p>
            </div>
            <p className="text-xs text-blue-700 mb-3">
              El enlace de videollamada se ha generado automáticamente y se enviará en el email de confirmación.
            </p>
            {reservaCreada?.enlaceVideollamada && (
              <div className="mt-3">
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => window.open(reservaCreada.enlaceVideollamada, '_blank')}
                  iconLeft={<Link2 className="w-4 h-4" />}
                  fullWidth
                >
                  Abrir Enlace de Videollamada
                </Button>
              </div>
            )}
          </div>
        )}
      </Card>
    );
  }

  if (paso === 'pago') {
    return (
      <Card className="p-8 text-center bg-white shadow-sm">
        <CreditCard className="w-12 h-12 text-blue-500 mx-auto mb-4 animate-pulse" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Procesando Pago
        </h3>
        <p className="text-gray-600">Por favor espere...</p>
      </Card>
    );
  }

  return (
    <Card className="bg-white shadow-sm">
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold text-gray-900">
            Confirmar Reserva
          </h3>
          <button
            onClick={onCancelar}
            className="p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        <div className="space-y-4">
          <div className="p-4 bg-slate-50 rounded-lg ring-1 ring-slate-200">
            <p className="text-sm text-gray-600 mb-2">
              Horario
            </p>
            <p className="text-base font-semibold text-gray-900">
              {disponibilidad.horaInicio} - {role === 'entrenador' 
                ? calcularHoraFin(disponibilidad.horaInicio, duracionSeleccionada)
                : disponibilidad.horaFin}
            </p>
            {disponibilidad.claseNombre && (
              <p className="text-sm text-gray-600 mt-1">
                {disponibilidad.claseNombre}
              </p>
            )}
          </div>

          {role === 'entrenador' ? (
            <Select
              label="Cliente"
              value={clienteSeleccionado}
              onChange={(value) => setClienteSeleccionado(value)}
              options={clientes.map(c => ({
                value: c.id,
                label: c.nombre,
              }))}
              placeholder="Selecciona un cliente"
              leftIcon={<User className="w-5 h-5" />}
            />
          ) : (
            <Input
              label="Nombre del Cliente"
              value={clienteSeleccionado}
              onChange={(e) => setClienteSeleccionado(e.target.value)}
              placeholder="Ingrese el nombre"
              leftIcon={<User className="w-5 h-5" />}
            />
          )}

          {/* Mostrar notas previas del cliente si hay un cliente seleccionado */}
          {role === 'entrenador' && clienteSeleccionado && (
            <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <StickyNote className="w-5 h-5 text-amber-600" />
                  <h4 className="text-sm font-semibold text-amber-900">
                    Notas Previas del Cliente
                  </h4>
                </div>
                {notasCliente.length > 0 && (
                  <button
                    onClick={() => setMostrarNotas(!mostrarNotas)}
                    className="p-1 hover:bg-amber-100 rounded transition"
                  >
                    {mostrarNotas ? (
                      <ChevronUp className="w-4 h-4 text-amber-600" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-amber-600" />
                    )}
                  </button>
                )}
              </div>
              {cargandoNotas ? (
                <p className="text-xs text-amber-700">Cargando notas...</p>
              ) : mostrarNotas && notasCliente.length > 0 ? (
                <div className="space-y-3">
                  {notasCliente.map((nota, index) => (
                    <div key={nota.id} className="p-3 bg-white rounded border border-amber-200">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-medium text-gray-700">
                          Sesión del {nota.fechaSesion.toLocaleDateString('es-ES', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })}
                        </span>
                        <span className="text-xs text-gray-500">
                          {nota.horaInicio} - {nota.horaFin}
                        </span>
                      </div>
                      <div className="space-y-2">
                        {nota.observaciones && (
                          <div>
                            <p className="text-xs font-medium text-gray-600 mb-1">Observaciones:</p>
                            <p className="text-xs text-gray-700 bg-gray-50 p-2 rounded">
                              {nota.observaciones}
                            </p>
                          </div>
                        )}
                        {nota.queTrabajamos && (
                          <div>
                            <p className="text-xs font-medium text-gray-600 mb-1">Qué trabajamos:</p>
                            <p className="text-xs text-gray-700 bg-gray-50 p-2 rounded">
                              {nota.queTrabajamos}
                            </p>
                          </div>
                        )}
                        {nota.rendimiento && (
                          <div>
                            <p className="text-xs font-medium text-gray-600 mb-1">Rendimiento:</p>
                            <p className="text-xs text-gray-700 bg-gray-50 p-2 rounded">
                              {nota.rendimiento}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                  <p className="text-xs text-amber-700 italic">
                    Mostrando las 3 notas más recientes. Revisa estas notas para recordar aspectos importantes como lesiones, objetivos o preferencias del cliente.
                  </p>
                </div>
              ) : notasCliente.length === 0 && !cargandoNotas ? (
                <p className="text-xs text-amber-700">
                  No hay notas registradas para este cliente aún.
                </p>
              ) : null}
            </div>
          )}

          {/* Mostrar bonos activos si hay un cliente seleccionado */}
          {role === 'entrenador' && clienteSeleccionado && bonosActivos.length > 0 && (
            <div className="space-y-2">
              <Select
                label="Aplicar Bono (opcional)"
                value={bonoSeleccionado}
                onChange={(value) => setBonoSeleccionado(value)}
                options={[
                  { value: '', label: 'No usar bono - Pagar normalmente' },
                  ...bonosActivos.map(b => ({
                    value: b.id,
                    label: `${b.paqueteNombre} (${b.sesionesRestantes}/${b.sesionesTotal} sesiones disponibles)`,
                  })),
                ]}
                leftIcon={<Gift className="w-5 h-5" />}
              />
              {bonoSeleccionado && bonoSeleccionadoInfo && (
                <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Gift className="w-4 h-4 text-green-600" />
                    <p className="text-sm font-medium text-green-900">
                      Bono aplicado: {bonoSeleccionadoInfo.paqueteNombre}
                    </p>
                  </div>
                  <p className="text-xs text-green-700">
                    Se descontará 1 sesión del bono. Sesiones restantes: {bonoSeleccionadoInfo.sesionesRestantes - 1}
                  </p>
                </div>
              )}
            </div>
          )}

          {role === 'entrenador' && clienteSeleccionado && bonosActivos.length === 0 && (
            <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
              <p className="text-sm text-gray-600">
                Este cliente no tiene bonos activos disponibles
              </p>
            </div>
          )}

          {role === 'entrenador' && (
            <>
              {plantillasDisponibles.length > 0 ? (
                <>
                  <Select
                    label="Plantilla de Sesión"
                    value={plantillaSeleccionada}
                    onChange={(e) => {
                      const nuevaPlantillaId = e.target.value;
                      setPlantillaSeleccionada(nuevaPlantillaId);
                      // El useEffect se encargará de actualizar tipoSesion, duracionSeleccionada y tipoEntrenamiento
                    }}
                    options={plantillasDisponibles.map(p => ({
                      value: p.id,
                      label: `${p.nombre}${p.descripcion ? ` - ${p.descripcion}` : ''} (${p.duracionMinutos} min - €${p.precio})`,
                    }))}
                    leftIcon={<FileText className="w-5 h-5" />}
                  />
                  <Select
                    label="Tipo de Sesión"
                    value={tipoSesion}
                    onChange={(e) => setTipoSesion(e.target.value as 'presencial' | 'videollamada')}
                    options={[
                      { value: 'presencial', label: 'Presencial' },
                      { value: 'videollamada', label: 'Videollamada (10% descuento)' },
                    ]}
                  />
                  <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <p className="text-xs text-blue-800">
                      <strong>Duración:</strong> {duracionSeleccionada} minutos | <strong>Tipo:</strong> {tipoEntrenamiento === 'sesion-1-1' ? 'Sesión 1 a 1' : tipoEntrenamiento}
                    </p>
                  </div>
                </>
              ) : (
                <>
                  {/* Fallback a duraciones si no hay plantillas */}
                  <Select
                    label="Duración de Sesión"
                    value={duracionSeleccionada.toString()}
                    onChange={(e) => setDuracionSeleccionada(parseInt(e.target.value))}
                    options={[
                      { value: '30', label: '30 minutos' },
                      { value: '45', label: '45 minutos' },
                      { value: '60', label: '60 minutos' },
                      { value: '90', label: '90 minutos' },
                    ]}
                    leftIcon={<Clock className="w-5 h-5" />}
                  />
                  <Select
                    label="Tipo de Sesión"
                    value={tipoSesion}
                    onChange={(e) => setTipoSesion(e.target.value as 'presencial' | 'videollamada')}
                    options={[
                      { value: 'presencial', label: 'Presencial' },
                      { value: 'videollamada', label: 'Videollamada (10% descuento)' },
                    ]}
                  />
                </>
              )}
            </>
          )}

          {/* Campo de observaciones del cliente */}
          {role === 'entrenador' && (
            <div className="space-y-2">
              <Textarea
                label="Observaciones (opcional)"
                value={observacionesCliente}
                onChange={(e) => setObservacionesCliente(e.target.value)}
                placeholder="Añade cualquier información relevante para preparar mejor la sesión (objetivos, lesiones, preferencias, etc.)"
                rows={4}
                className="w-full"
              />
              <p className="text-xs text-gray-500">
                Esta información ayudará al entrenador a preparar mejor la sesión según tus necesidades específicas.
              </p>
            </div>
          )}

          {/* Configuración de reserva recurrente */}
          {role === 'entrenador' && (
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Repeat className="w-5 h-5 text-blue-600" />
                  <h4 className="text-sm font-semibold text-blue-900">
                    Reserva Recurrente
                  </h4>
                </div>
                <Switch
                  checked={esRecurrente}
                  onChange={setEsRecurrente}
                  label="Crear reservas recurrentes"
                />
              </div>
              
              {esRecurrente && (
                <div className="space-y-3 pt-2 border-t border-blue-200">
                  <Select
                    label="Frecuencia"
                    value={frecuenciaRecurrencia}
                    onChange={(e) => setFrecuenciaRecurrencia(e.target.value as 'diaria' | 'semanal' | 'quincenal' | 'mensual')}
                    options={[
                      { value: 'diaria', label: 'Diaria' },
                      { value: 'semanal', label: 'Semanal' },
                      { value: 'quincenal', label: 'Quincenal' },
                      { value: 'mensual', label: 'Mensual' },
                    ]}
                    leftIcon={<Repeat className="w-5 h-5" />}
                  />
                  
                  {frecuenciaRecurrencia === 'semanal' && (
                    <div className="p-3 bg-white rounded border border-blue-200">
                      <p className="text-xs text-gray-600 mb-1">
                        Día de la semana: {disponibilidad.fecha.toLocaleDateString('es-ES', { weekday: 'long' })}
                      </p>
                      <p className="text-xs text-gray-500">
                        Las reservas se crearán cada {frecuenciaRecurrencia === 'semanal' ? 'semana' : frecuenciaRecurrencia === 'quincenal' ? '2 semanas' : frecuenciaRecurrencia === 'mensual' ? 'mes' : 'día'} en este mismo día y hora.
                      </p>
                    </div>
                  )}
                  
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={usarFechaFin}
                      onChange={setUsarFechaFin}
                      label="Usar fecha de finalización"
                    />
                  </div>
                  
                  {usarFechaFin ? (
                    <Input
                      label="Fecha de finalización"
                      type="date"
                      value={fechaFinRecurrencia.toISOString().split('T')[0]}
                      onChange={(e) => {
                        const nuevaFecha = new Date(e.target.value);
                        if (nuevaFecha >= disponibilidad.fecha) {
                          setFechaFinRecurrencia(nuevaFecha);
                        }
                      }}
                      min={disponibilidad.fecha.toISOString().split('T')[0]}
                    />
                  ) : (
                    <Input
                      label="Número de repeticiones"
                      type="number"
                      value={numeroRepeticiones.toString()}
                      onChange={(e) => setNumeroRepeticiones(parseInt(e.target.value) || 4)}
                      min={1}
                      max={52}
                    />
                  )}
                  
                  <div className="p-3 bg-white rounded border border-blue-200">
                    <p className="text-xs text-blue-800">
                      <strong>Resumen:</strong> Se crearán {usarFechaFin ? 'múltiples' : numeroRepeticiones} reservas cada {frecuenciaRecurrencia === 'semanal' ? 'semana' : frecuenciaRecurrencia === 'quincenal' ? '2 semanas' : frecuenciaRecurrencia === 'mensual' ? 'mes' : 'día'} a las {disponibilidad.horaInicio} horas.
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {!bonoSeleccionado && (
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
          )}

          <div className={`p-4 rounded-lg ring-1 ${bonoSeleccionado ? 'bg-green-50 ring-green-200' : 'bg-blue-50 ring-blue-200'}`}>
            <div className="flex items-center justify-between">
              <span className="text-base text-gray-900">
                {bonoSeleccionado ? 'Total (con bono)' : 'Total'}
              </span>
              <span className={`text-2xl font-bold ${bonoSeleccionado ? 'text-green-600' : 'text-blue-600'}`}>
                {bonoSeleccionado ? 'Gratis' : `€${precioFinal.toFixed(2)}`}
              </span>
            </div>
            {bonoSeleccionado && (
              <p className="text-xs text-green-700 mt-1">
                Se usará 1 sesión del bono "{bonoSeleccionadoInfo?.paqueteNombre}"
              </p>
            )}
          </div>

          {role === 'entrenador' && !aprobacionAutomatica && (
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-start gap-2">
                <Mail className="w-5 h-5 text-yellow-600 mt-0.5" />
                <p className="text-sm text-yellow-800">
                  Esta reserva quedará pendiente de aprobación. Recibirás un email cuando sea confirmada.
                </p>
              </div>
            </div>
          )}

          <div className="flex gap-3">
            <Button
              variant="secondary"
              onClick={onCancelar}
              fullWidth
            >
              Cancelar
            </Button>
            <Button
              variant="primary"
              onClick={handleReservar}
              disabled={!clienteSeleccionado || procesando || (esRecurrente && !usarFechaFin && numeroRepeticiones < 1)}
              loading={procesando}
              fullWidth
            >
              {esRecurrente 
                ? `Crear ${usarFechaFin ? 'Reservas Recurrentes' : numeroRepeticiones + ' Reservas Recurrentes'}`
                : bonoSeleccionado 
                  ? 'Confirmar Reserva' 
                  : 'Confirmar y Pagar'}
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};
