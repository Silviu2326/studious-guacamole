import React, { useState, useEffect } from 'react';
import { Card, Button } from '../../../components/componentsreutilizables';
import { Disponibilidad, Reserva, PlantillaSesion, BonoActivo, PaqueteSesiones, ClienteInfo } from '../types';
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  User,
  FileText,
  Clock,
  Package,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ArrowRight,
  ArrowLeft,
  X
} from 'lucide-react';
import { getConfiguracionDiasMaximosReserva } from '../api';
import { calcularDisponibilidad } from '../api/disponibilidad';
import { getPlantillasSesion } from '../api/plantillasSesion';
import { getPaquetesSesiones } from '../api/paquetesSesiones';
import { getBonosActivosPorCliente } from '../api/bonos';
import { createReserva } from '../api/reservas';
import { getActiveClients } from '../../../features/gestión-de-clientes/api/clients';

interface ReservasOnlineProps {
  role: 'entrenador' | 'gimnasio';
  onReservaCreada: (reserva: Reserva) => void;
  entrenadorId?: string;
}

type WizardStep = 1 | 2 | 3 | 4 | 5;

interface WizardState {
  step: WizardStep;
  clienteId: string | null;
  clienteNombre: string | null;
  plantillaId: string | null;
  fecha: Date | null;
  disponibilidadSeleccionada: Disponibilidad | null;
  bonoId: string | null;
  paqueteId: string | null;
  observaciones: string;
}

export const ReservasOnline: React.FC<ReservasOnlineProps> = ({
  role,
  onReservaCreada,
  entrenadorId,
}) => {
  const [wizardState, setWizardState] = useState<WizardState>({
    step: 1,
    clienteId: null,
    clienteNombre: null,
    plantillaId: null,
    fecha: new Date(),
    disponibilidadSeleccionada: null,
    bonoId: null,
    paqueteId: null,
    observaciones: '',
  });

  // Data loading states
  const [clientes, setClientes] = useState<ClienteInfo[]>([]);
  const [plantillas, setPlantillas] = useState<PlantillaSesion[]>([]);
  const [disponibilidades, setDisponibilidades] = useState<Disponibilidad[]>([]);
  const [bonos, setBonos] = useState<BonoActivo[]>([]);
  const [paquetes, setPaquetes] = useState<PaqueteSesiones[]>([]);

  // UI states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [diasMaximosConfig, setDiasMaximosConfig] = useState<{ activo: boolean; diasMaximos: number } | null>(null);
  const [creandoReserva, setCreandoReserva] = useState(false);

  // Cargar configuración de días máximos si es entrenador
  useEffect(() => {
    const cargarConfiguracion = async () => {
      if (role === 'entrenador' && entrenadorId) {
        try {
          const config = await getConfiguracionDiasMaximosReserva(entrenadorId);
          setDiasMaximosConfig({
            activo: config.activo,
            diasMaximos: config.diasMaximos,
          });
        } catch (error) {
          console.error('Error cargando configuración de días máximos:', error);
        }
      }
    };
    cargarConfiguracion();
  }, [role, entrenadorId]);

  // Cargar clientes en el paso 1
  useEffect(() => {
    if (wizardState.step === 1 && role === 'entrenador' && entrenadorId) {
      const cargarClientes = async () => {
        setLoading(true);
        setError(null);
        try {
          const clientesData = await getActiveClients('entrenador', entrenadorId);
          const clientesInfo: ClienteInfo[] = clientesData.map(c => ({
            id: c.id,
            nombre: c.name,
            email: c.email,
            telefono: c.phone,
          }));
          setClientes(clientesInfo);
        } catch (error) {
          console.error('Error cargando clientes:', error);
          setError('Error al cargar la lista de clientes');
        } finally {
          setLoading(false);
        }
      };
      cargarClientes();
    }
  }, [wizardState.step, role, entrenadorId]);

  // Cargar plantillas en el paso 2
  useEffect(() => {
    if (wizardState.step === 2 && role === 'entrenador' && entrenadorId) {
      const cargarPlantillas = async () => {
        setLoading(true);
        setError(null);
        try {
          const plantillasData = await getPlantillasSesion(entrenadorId);
          setPlantillas(plantillasData.filter(p => p.activo));
        } catch (error) {
          console.error('Error cargando plantillas:', error);
          setError('Error al cargar las plantillas de sesión');
        } finally {
          setLoading(false);
        }
      };
      cargarPlantillas();
    }
  }, [wizardState.step, role, entrenadorId]);

  // Cargar disponibilidad en el paso 3
  useEffect(() => {
    if (wizardState.step === 3 && wizardState.fecha && wizardState.plantillaId && role === 'entrenador' && entrenadorId) {
      const cargarDisponibilidad = async () => {
        setLoading(true);
        setError(null);
        try {
          const plantilla = plantillas.find(p => p.id === wizardState.plantillaId);
          const disponibilidadesData = await calcularDisponibilidad({
            fecha: wizardState.fecha!,
            role,
            entrenadorId,
            tipoSesionId: wizardState.plantillaId,
            duracionMinutos: plantilla?.duracionMinutos,
          });
          setDisponibilidades(disponibilidadesData);
        } catch (error) {
          console.error('Error cargando disponibilidad:', error);
          setError('Error al cargar la disponibilidad');
        } finally {
          setLoading(false);
        }
      };
      cargarDisponibilidad();
    }
  }, [wizardState.step, wizardState.fecha, wizardState.plantillaId, role, entrenadorId, plantillas]);

  // Cargar bonos y paquetes en el paso 4
  useEffect(() => {
    if (wizardState.step === 4 && wizardState.clienteId && role === 'entrenador' && entrenadorId) {
      const cargarBonosYPaquetes = async () => {
        setLoading(true);
        setError(null);
        try {
          // Cargar bonos activos del cliente
          const bonosData = await getBonosActivosPorCliente(wizardState.clienteId!);
          setBonos(bonosData);

          // Cargar paquetes disponibles
          const paquetesData = await getPaquetesSesiones(entrenadorId);
          setPaquetes(paquetesData.filter(p => p.activo));
        } catch (error) {
          console.error('Error cargando bonos y paquetes:', error);
          setError('Error al cargar bonos y paquetes');
        } finally {
          setLoading(false);
        }
      };
      cargarBonosYPaquetes();
    }
  }, [wizardState.step, wizardState.clienteId, role, entrenadorId]);

  // Navegación entre pasos
  const irASiguientePaso = () => {
    if (validarPasoActual()) {
      setWizardState(prev => ({ ...prev, step: Math.min(5, prev.step + 1) as WizardStep }));
      setError(null);
    }
  };

  const irAPasoAnterior = () => {
    setWizardState(prev => ({ ...prev, step: Math.max(1, prev.step - 1) as WizardStep }));
    setError(null);
  };

  const irAPaso = (paso: WizardStep) => {
    setWizardState(prev => ({ ...prev, step: paso }));
    setError(null);
  };

  // Validaciones por paso
  const validarPasoActual = (): boolean => {
    switch (wizardState.step) {
      case 1:
        if (!wizardState.clienteId) {
          setError('Por favor, selecciona un cliente');
          return false;
        }
        return true;
      case 2:
        if (!wizardState.plantillaId) {
          setError('Por favor, selecciona una plantilla de sesión');
          return false;
        }
        return true;
      case 3:
        if (!wizardState.disponibilidadSeleccionada) {
          setError('Por favor, selecciona un horario disponible');
          return false;
        }
        return true;
      case 4:
        // Paso 4 es opcional, siempre puede continuar
        return true;
      case 5:
        return true;
      default:
        return false;
    }
  };

  // Versión de validación que NO modifica el estado (para usar durante render)
  const esPasoValido = (): boolean => {
    switch (wizardState.step) {
      case 1:
        return !!wizardState.clienteId;
      case 2:
        return !!wizardState.plantillaId;
      case 3:
        return !!wizardState.disponibilidadSeleccionada;
      case 4:
      case 5:
        return true;
      default:
        return false;
    }
  };

  // Cambiar fecha
  const cambiarFecha = (dias: number) => {
    if (!wizardState.fecha) return;

    const nuevaFecha = new Date(wizardState.fecha);
    nuevaFecha.setDate(nuevaFecha.getDate() + dias);

    // Verificar límite antes de cambiar la fecha
    if (dias > 0 && role === 'entrenador' && diasMaximosConfig && diasMaximosConfig.activo) {
      const hoy = new Date();
      hoy.setHours(0, 0, 0, 0);
      const fechaMaxima = new Date(hoy);
      fechaMaxima.setDate(fechaMaxima.getDate() + diasMaximosConfig.diasMaximos);

      nuevaFecha.setHours(0, 0, 0, 0);
      if (nuevaFecha > fechaMaxima) {
        setError(`No se puede reservar más allá de ${diasMaximosConfig.diasMaximos} días`);
        return;
      }
    }

    setWizardState(prev => ({
      ...prev,
      fecha: nuevaFecha,
      disponibilidadSeleccionada: null,
    }));
    setError(null);
  };

  // Calcular precio final
  const calcularPrecioFinal = (): number => {
    if (wizardState.bonoId) {
      // Si hay bono, el precio es 0
      return 0;
    }

    const plantilla = plantillas.find(p => p.id === wizardState.plantillaId);
    return plantilla?.precio || 0;
  };

  // Calcular duración
  const calcularDuracion = (): number => {
    const plantilla = plantillas.find(p => p.id === wizardState.plantillaId);
    return plantilla?.duracionMinutos || 60;
  };

  // Crear reserva
  const handleCrearReserva = async () => {
    if (!validarPasoActual()) return;

    setCreandoReserva(true);
    setError(null);

    try {
      const plantilla = plantillas.find(p => p.id === wizardState.plantillaId);
      const disponibilidad = wizardState.disponibilidadSeleccionada;

      if (!plantilla || !disponibilidad || !wizardState.fecha || !wizardState.clienteId) {
        throw new Error('Faltan datos para crear la reserva');
      }

      // Calcular fechaInicio y fechaFin
      const fechaInicio = new Date(wizardState.fecha);
      const [horaInicio, minutoInicio] = disponibilidad.horaInicio.split(':').map(Number);
      fechaInicio.setHours(horaInicio, minutoInicio, 0, 0);

      const fechaFin = new Date(fechaInicio);
      fechaFin.setMinutes(fechaFin.getMinutes() + calcularDuracion());

      // Crear la reserva
      const nuevaReserva = await createReserva({
        clienteId: wizardState.clienteId,
        clienteNombre: wizardState.clienteNombre || '',
        entrenadorId: entrenadorId || '',
        tipoSesionId: wizardState.plantillaId,
        fechaInicio,
        fechaFin,
        fecha: wizardState.fecha,
        horaInicio: disponibilidad.horaInicio,
        horaFin: disponibilidad.horaFin,
        tipo: plantilla.tipoEntrenamiento || 'sesion-1-1',
        tipoSesion: plantilla.tipoSesion === 'ambos' ? 'presencial' : plantilla.tipoSesion,
        estado: 'pendiente',
        origen: 'appCliente',
        esOnline: plantilla.tipoSesion === 'videollamada',
        precio: calcularPrecioFinal(),
        pagado: wizardState.bonoId ? true : false,
        bonoIdOpcional: wizardState.bonoId || undefined,
        paqueteIdOpcional: wizardState.paqueteId || undefined,
        observaciones: wizardState.observaciones || undefined,
      }, entrenadorId);

      // Llamar al callback
      onReservaCreada(nuevaReserva);

      // Resetear wizard
      setWizardState({
        step: 1,
        clienteId: null,
        clienteNombre: null,
        plantillaId: null,
        fecha: new Date(),
        disponibilidadSeleccionada: null,
        bonoId: null,
        paqueteId: null,
        observaciones: '',
      });
    } catch (error: any) {
      console.error('Error creando reserva:', error);
      setError(error.message || 'Error al crear la reserva. Por favor, intenta de nuevo.');
    } finally {
      setCreandoReserva(false);
    }
  };

  // Renderizar indicador de pasos
  const renderStepIndicator = () => {
    const steps = [
      { num: 1, label: 'Cliente', icon: User },
      { num: 2, label: 'Plantilla', icon: FileText },
      { num: 3, label: 'Fecha/Hora', icon: Clock },
      { num: 4, label: 'Paquete/Bono', icon: Package },
      { num: 5, label: 'Resumen', icon: CheckCircle2 },
    ];

    return (
      <div className="mb-6 sm:mb-8">
        {/* Vista móvil: solo paso actual */}
        <div className="md:hidden">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => wizardState.step > 1 && irAPasoAnterior()}
              disabled={wizardState.step === 1}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${wizardState.step > 1
                ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                : 'bg-gray-50 text-gray-400 cursor-not-allowed'
                }`}
            >
              <ArrowLeft size={16} />
              <span className="text-sm font-medium">Anterior</span>
            </button>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-600">
                Paso {wizardState.step} de {steps.length}
              </span>
            </div>
            <button
              onClick={() => wizardState.step < 5 && irASiguientePaso()}
              disabled={wizardState.step === 5 || !esPasoValido()}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${wizardState.step < 5 && esPasoValido()
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-gray-50 text-gray-400 cursor-not-allowed'
                }`}
            >
              <span className="text-sm font-medium">Siguiente</span>
              <ArrowRight size={16} />
            </button>
          </div>
          <div className="flex items-center gap-2">
            {steps.map((step) => {
              const Icon = step.icon;
              const isActive = wizardState.step === step.num;
              const isCompleted = wizardState.step > step.num;
              return (
                <div
                  key={step.num}
                  className={`flex-1 h-1.5 rounded-full transition-all ${isActive || isCompleted ? 'bg-blue-600' : 'bg-gray-300'
                    }`}
                />
              );
            })}
          </div>
        </div>
        {/* Vista desktop: todos los pasos */}
        <div className="hidden md:flex items-center justify-between">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isActive = wizardState.step === step.num;
            const isCompleted = wizardState.step > step.num;
            const isClickable = wizardState.step > step.num;

            return (
              <React.Fragment key={step.num}>
                <button
                  onClick={() => isClickable && irAPaso(step.num as WizardStep)}
                  disabled={!isClickable}
                  className={`flex flex-col items-center gap-2 transition-all ${isClickable ? 'cursor-pointer' : 'cursor-not-allowed'
                    }`}
                >
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all ${isActive
                      ? 'border-blue-600 bg-blue-600 text-white'
                      : isCompleted
                        ? 'border-green-600 bg-green-600 text-white'
                        : 'border-gray-300 bg-white text-gray-400'
                      }`}
                  >
                    {isCompleted ? (
                      <CheckCircle2 size={24} />
                    ) : (
                      <Icon size={24} />
                    )}
                  </div>
                  <span
                    className={`text-sm font-medium ${isActive ? 'text-blue-600' : isCompleted ? 'text-green-600' : 'text-gray-400'
                      }`}
                  >
                    {step.label}
                  </span>
                </button>
                {index < steps.length - 1 && (
                  <div
                    className={`flex-1 h-0.5 mx-4 ${isCompleted ? 'bg-green-600' : 'bg-gray-300'
                      }`}
                  />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>
    );
  };

  // Renderizar paso 1: Selección de cliente
  const renderStep1 = () => {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <User className="w-5 h-5 text-blue-600" />
          <h3 className="text-xl font-bold text-gray-900">Selecciona un cliente</h3>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
            <span className="ml-3 text-gray-600">Cargando clientes...</span>
          </div>
        ) : clientes.length === 0 ? (
          <div className="text-center py-12">
            <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No hay clientes disponibles</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {clientes.map((cliente) => (
              <button
                key={cliente.id}
                onClick={() => {
                  setWizardState(prev => ({
                    ...prev,
                    clienteId: cliente.id,
                    clienteNombre: cliente.nombre,
                  }));
                  setError(null);
                }}
                className={`p-4 rounded-xl border-2 text-left transition-all ${wizardState.clienteId === cliente.id
                  ? 'border-blue-600 bg-blue-50'
                  : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'
                  }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                    <span className="text-blue-600 font-semibold">
                      {cliente.nombre.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{cliente.nombre}</p>
                    {cliente.email && (
                      <p className="text-sm text-gray-600">{cliente.email}</p>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    );
  };

  // Renderizar paso 2: Selección de plantilla
  const renderStep2 = () => {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <FileText className="w-5 h-5 text-blue-600" />
          <h3 className="text-xl font-bold text-gray-900">Selecciona el tipo de sesión</h3>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
            <span className="ml-3 text-gray-600">Cargando plantillas...</span>
          </div>
        ) : plantillas.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No hay plantillas disponibles</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            {plantillas.map((plantilla) => (
              <button
                key={plantilla.id}
                onClick={() => {
                  setWizardState(prev => ({
                    ...prev,
                    plantillaId: plantilla.id,
                  }));
                  setError(null);
                }}
                className={`p-6 rounded-xl border-2 text-left transition-all ${wizardState.plantillaId === plantilla.id
                  ? 'border-blue-600 bg-blue-50'
                  : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'
                  }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">{plantilla.nombre}</h4>
                    {plantilla.descripcion && (
                      <p className="text-sm text-gray-600 mb-2">{plantilla.descripcion}</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1 text-gray-600">
                    <Clock size={16} />
                    <span>{plantilla.duracionMinutos} min</span>
                  </div>
                  <div className="flex items-center gap-1 text-gray-600">
                    <span className="capitalize">{plantilla.tipoSesion}</span>
                  </div>
                  <div className="ml-auto">
                    <span className="font-bold text-blue-600">€{plantilla.precio}</span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    );
  };

  // Renderizar paso 3: Selección de fecha/hora
  const renderStep3 = () => {
    return (
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg sm:text-xl font-bold text-gray-900">Selecciona fecha y hora</h3>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => cambiarFecha(-1)}
              className="flex-1 sm:flex-initial"
            >
              <ChevronLeft size={16} />
              <span className="hidden sm:inline">Anterior</span>
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => {
                setWizardState(prev => ({ ...prev, fecha: new Date(), disponibilidadSeleccionada: null }));
                setError(null);
              }}
            >
              Hoy
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => cambiarFecha(1)}
              disabled={
                role === 'entrenador' &&
                diasMaximosConfig?.activo &&
                wizardState.fecha &&
                (() => {
                  const hoy = new Date();
                  hoy.setHours(0, 0, 0, 0);
                  const fechaMaxima = new Date(hoy);
                  fechaMaxima.setDate(fechaMaxima.getDate() + diasMaximosConfig.diasMaximos);
                  const fechaActual = new Date(wizardState.fecha!);
                  fechaActual.setHours(0, 0, 0, 0);
                  return fechaActual >= fechaMaxima;
                })()
              }
              className="flex-1 sm:flex-initial"
            >
              <span className="hidden sm:inline">Siguiente</span>
              <ChevronRight size={16} />
            </Button>
          </div>
        </div>

        {wizardState.fecha && (
          <div className="mb-4">
            <p className="text-lg font-semibold text-gray-900">
              {wizardState.fecha.toLocaleDateString('es-ES', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
            {role === 'entrenador' && diasMaximosConfig && diasMaximosConfig.activo && (
              <p className="text-sm text-blue-600 mt-1">
                Reservas disponibles hasta{' '}
                {(() => {
                  const fechaMaxima = new Date();
                  fechaMaxima.setDate(fechaMaxima.getDate() + diasMaximosConfig.diasMaximos);
                  return fechaMaxima.toLocaleDateString('es-ES', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  });
                })()}
              </p>
            )}
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
            <span className="ml-3 text-gray-600">Cargando disponibilidad...</span>
          </div>
        ) : disponibilidades.length === 0 ? (
          <div className="text-center py-12">
            <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No hay horarios disponibles para esta fecha</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {disponibilidades.map((disp) => (
              <button
                key={disp.id}
                onClick={() => {
                  setWizardState(prev => ({
                    ...prev,
                    disponibilidadSeleccionada: disp,
                  }));
                  setError(null);
                }}
                disabled={!disp.disponible}
                className={`p-4 rounded-xl border-2 text-left transition-all ${wizardState.disponibilidadSeleccionada?.id === disp.id
                  ? 'border-blue-600 bg-blue-50'
                  : disp.disponible
                    ? 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'
                    : 'border-gray-300 opacity-50 cursor-not-allowed bg-gray-100'
                  }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-gray-600" />
                    <span className="font-semibold text-gray-900">
                      {disp.horaInicio} - {disp.horaFin}
                    </span>
                    {disp.duracionMinutos && (
                      <span className="text-sm text-gray-500">
                        ({disp.duracionMinutos} min)
                      </span>
                    )}
                  </div>
                  {wizardState.disponibilidadSeleccionada?.id === disp.id && (
                    <CheckCircle2 className="w-5 h-5 text-blue-600" />
                  )}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    );
  };

  // Renderizar paso 4: Paquete/Bono
  const renderStep4 = () => {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-2 mb-4">
          <Package className="w-5 h-5 text-blue-600" />
          <h3 className="text-xl font-bold text-gray-900">Aplicar paquete o bono (opcional)</h3>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
            <span className="ml-3 text-gray-600">Cargando bonos y paquetes...</span>
          </div>
        ) : (
          <>
            {/* Bonos activos */}
            {bonos.length > 0 && (
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Bonos disponibles</h4>
                <div className="space-y-3">
                  {bonos.map((bono) => (
                    <button
                      key={bono.id}
                      onClick={() => {
                        setWizardState(prev => ({
                          ...prev,
                          bonoId: prev.bonoId === bono.id ? null : bono.id,
                          paqueteId: null, // Deseleccionar paquete si se selecciona bono
                        }));
                        setError(null);
                      }}
                      className={`w-full p-4 rounded-xl border-2 text-left transition-all ${wizardState.bonoId === bono.id
                        ? 'border-green-600 bg-green-50'
                        : 'border-gray-300 hover:border-green-400 hover:bg-gray-50'
                        }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-semibold text-gray-900">{bono.paqueteNombre}</p>
                          <p className="text-sm text-gray-600">
                            {bono.sesionesRestantes} sesiones restantes
                          </p>
                          {bono.fechaCaducidadOpcional && (
                            <p className="text-xs text-gray-500 mt-1">
                              Vence: {bono.fechaCaducidadOpcional.toLocaleDateString('es-ES')}
                            </p>
                          )}
                        </div>
                        {wizardState.bonoId === bono.id && (
                          <CheckCircle2 className="w-5 h-5 text-green-600" />
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Opción de no usar bono/paquete */}
            <div>
              <button
                onClick={() => {
                  setWizardState(prev => ({
                    ...prev,
                    bonoId: null,
                    paqueteId: null,
                  }));
                  setError(null);
                }}
                className={`w-full p-4 rounded-xl border-2 text-left transition-all ${!wizardState.bonoId && !wizardState.paqueteId
                  ? 'border-blue-600 bg-blue-50'
                  : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'
                  }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-gray-900">Pago directo</p>
                    <p className="text-sm text-gray-600">
                      Pagar directamente por esta sesión
                    </p>
                  </div>
                  {!wizardState.bonoId && !wizardState.paqueteId && (
                    <CheckCircle2 className="w-5 h-5 text-blue-600" />
                  )}
                </div>
              </button>
            </div>
          </>
        )}
      </div>
    );
  };

  // Renderizar paso 5: Resumen
  const renderStep5 = () => {
    const plantilla = plantillas.find(p => p.id === wizardState.plantillaId);
    const disponibilidad = wizardState.disponibilidadSeleccionada;
    const bono = bonos.find(b => b.id === wizardState.bonoId);
    const precioFinal = calcularPrecioFinal();
    const duracion = calcularDuracion();

    return (
      <div className="space-y-6">
        <div className="flex items-center gap-2 mb-4">
          <CheckCircle2 className="w-5 h-5 text-blue-600" />
          <h3 className="text-xl font-bold text-gray-900">Resumen de la reserva</h3>
        </div>

        <Card className="bg-white shadow-sm">
          <div className="p-4 sm:p-6 space-y-4">
            {/* Cliente */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 py-3 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <User className="w-5 h-5 text-gray-600 flex-shrink-0" />
                <div className="min-w-0">
                  <p className="text-sm text-gray-600">Cliente</p>
                  <p className="font-semibold text-gray-900 truncate">{wizardState.clienteNombre}</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => irAPaso(1)}
                className="self-start sm:self-auto"
              >
                Cambiar
              </Button>
            </div>

            {/* Plantilla */}
            {plantilla && (
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 py-3 border-b border-gray-200">
                <div className="flex items-center gap-3 min-w-0">
                  <FileText className="w-5 h-5 text-gray-600 flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-sm text-gray-600">Tipo de sesión</p>
                    <p className="font-semibold text-gray-900">{plantilla.nombre}</p>
                    {plantilla.descripcion && (
                      <p className="text-xs text-gray-500 truncate">{plantilla.descripcion}</p>
                    )}
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => irAPaso(2)}
                  className="self-start sm:self-auto"
                >
                  Cambiar
                </Button>
              </div>
            )}

            {/* Fecha y hora */}
            {disponibilidad && wizardState.fecha && (
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 py-3 border-b border-gray-200">
                <div className="flex items-center gap-3 min-w-0">
                  <Clock className="w-5 h-5 text-gray-600 flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-sm text-gray-600">Fecha y hora</p>
                    <p className="font-semibold text-gray-900">
                      {wizardState.fecha.toLocaleDateString('es-ES', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                    <p className="text-sm text-gray-600">
                      {disponibilidad.horaInicio} - {disponibilidad.horaFin} ({duracion} min)
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => irAPaso(3)}
                  className="self-start sm:self-auto"
                >
                  Cambiar
                </Button>
              </div>
            )}

            {/* Bono/Paquete */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 py-3 border-b border-gray-200">
              <div className="flex items-center gap-3 min-w-0">
                <Package className="w-5 h-5 text-gray-600 flex-shrink-0" />
                <div className="min-w-0">
                  <p className="text-sm text-gray-600">Método de pago</p>
                  {bono ? (
                    <p className="font-semibold text-gray-900 truncate">
                      Bono: {bono.paqueteNombre}
                    </p>
                  ) : (
                    <p className="font-semibold text-gray-900">Pago directo</p>
                  )}
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => irAPaso(4)}
                className="self-start sm:self-auto"
              >
                Cambiar
              </Button>
            </div>

            {/* Precio */}
            <div className="flex items-center justify-between py-3">
              <div>
                <p className="text-sm text-gray-600">Precio total</p>
                <p className="text-2xl font-bold text-blue-600">
                  {precioFinal === 0 ? 'Gratis (bono aplicado)' : `€${precioFinal.toFixed(2)}`}
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* Observaciones opcionales */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Observaciones (opcional)
          </label>
          <textarea
            value={wizardState.observaciones}
            onChange={(e) =>
              setWizardState(prev => ({ ...prev, observaciones: e.target.value }))
            }
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            rows={3}
            placeholder="Añade cualquier observación o nota sobre esta reserva..."
          />
        </div>
      </div>
    );
  };

  // Renderizar contenido del paso actual
  const renderStepContent = () => {
    switch (wizardState.step) {
      case 1:
        return renderStep1();
      case 2:
        return renderStep2();
      case 3:
        return renderStep3();
      case 4:
        return renderStep4();
      case 5:
        return renderStep5();
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Indicador de pasos */}
      <Card className="bg-white shadow-sm">
        <div className="p-6">
          {renderStepIndicator()}
        </div>
      </Card>

      {/* Mensaje de error */}
      {error && (
        <Card className="bg-red-50 border-red-200 shadow-sm">
          <div className="p-4 flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <p className="text-red-800">{error}</p>
            <button
              onClick={() => setError(null)}
              className="ml-auto"
            >
              <X className="w-5 h-5 text-red-600" />
            </button>
          </div>
        </Card>
      )}

      {/* Contenido del paso actual */}
      <Card className="bg-white shadow-sm">
        <div className="p-4 sm:p-6">
          {renderStepContent()}
        </div>
      </Card>

      {/* Navegación Desktop */}
      <Card className="bg-white shadow-sm hidden md:block">
        <div className="p-4 sm:p-6 flex items-center justify-between gap-4">
          <Button
            variant="ghost"
            onClick={irAPasoAnterior}
            disabled={wizardState.step === 1}
            className="flex-shrink-0"
          >
            <ArrowLeft size={16} className="mr-2" />
            Anterior
          </Button>

          {wizardState.step < 5 ? (
            <Button
              onClick={irASiguientePaso}
              disabled={loading}
              className="flex-shrink-0"
            >
              Siguiente
              <ArrowRight size={16} className="ml-2" />
            </Button>
          ) : (
            <Button
              onClick={handleCrearReserva}
              disabled={creandoReserva || loading}
              className="flex-shrink-0"
            >
              {creandoReserva ? (
                <>
                  <Loader2 size={16} className="mr-2 animate-spin" />
                  Creando reserva...
                </>
              ) : (
                <>
                  <CheckCircle2 size={16} className="mr-2" />
                  Confirmar y crear reserva
                </>
              )}
            </Button>
          )}
        </div>
      </Card>

      {/* Navegación Móvil - Fixed bottom */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-10 p-4">
        <div className="flex items-center gap-3 max-w-md mx-auto">
          <Button
            variant="ghost"
            onClick={irAPasoAnterior}
            disabled={wizardState.step === 1}
            className="flex-1"
          >
            <ArrowLeft size={16} className="mr-2" />
            Anterior
          </Button>

          {wizardState.step < 5 ? (
            <Button
              onClick={irASiguientePaso}
              disabled={loading || !esPasoValido()}
              className="flex-1"
            >
              Siguiente
              <ArrowRight size={16} className="ml-2" />
            </Button>
          ) : (
            <Button
              onClick={handleCrearReserva}
              disabled={creandoReserva || loading}
              className="flex-1"
            >
              {creandoReserva ? (
                <>
                  <Loader2 size={16} className="mr-2 animate-spin" />
                  Creando...
                </>
              ) : (
                <>
                  <CheckCircle2 size={16} className="mr-2" />
                  Confirmar
                </>
              )}
            </Button>
          )}
        </div>
      </div>
      <div className="md:hidden h-20"></div>
    </div>
  );
};
