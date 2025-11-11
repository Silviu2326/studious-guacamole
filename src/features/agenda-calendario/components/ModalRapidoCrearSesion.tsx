import React, { useState, useEffect } from 'react';
import { Clock, Calendar, Repeat, X, Calendar as CalendarIcon } from 'lucide-react';
import { Modal, Button, Input, Select, Textarea, Switch } from '../../../components/componentsreutilizables';
import { ClienteAutocomplete } from './ClienteAutocomplete';
import { Cita, TipoCita, PlantillaSesion, TipoRecurrencia, Recurrencia } from '../types';
import { crearCita } from '../api/calendario';
import { getPlantillas } from '../api/plantillas';
import { useAuth } from '../../../context/AuthContext';
import { getPrimeraConexionActiva } from '../api/sincronizacionCalendario';

interface ModalRapidoCrearSesionProps {
  isOpen: boolean;
  onClose: () => void;
  onCitaCreada: (cita: Cita) => void;
  fechaInicial?: Date;
  horaInicial?: { hora: number; minuto: number };
  role?: 'entrenador' | 'gimnasio';
  userId?: string;
}

const TIPOS_SESION: Array<{ value: TipoCita; label: string }> = [
  { value: 'sesion-1-1', label: 'Sesión 1:1' },
  { value: 'videollamada', label: 'Videollamada' },
  { value: 'evaluacion', label: 'Evaluación' },
  { value: 'fisioterapia', label: 'Fisioterapia' },
  { value: 'mantenimiento', label: 'Mantenimiento' },
  { value: 'otro', label: 'Otro' },
];

const DURACIONES = [
  { value: '30', label: '30 min' },
  { value: '45', label: '45 min' },
  { value: '60', label: '60 min' },
  { value: '90', label: '90 min' },
  { value: '120', label: '120 min' },
];

export const ModalRapidoCrearSesion: React.FC<ModalRapidoCrearSesionProps> = ({
  isOpen,
  onClose,
  onCitaCreada,
  fechaInicial,
  horaInicial,
  role = 'entrenador',
  userId: propUserId,
}) => {
  const { user } = useAuth();
  const userId = propUserId || user?.id;
  const [clienteId, setClienteId] = useState('');
  const [clienteNombre, setClienteNombre] = useState('');
  const [fecha, setFecha] = useState('');
  const [hora, setHora] = useState('');
  const [tipo, setTipo] = useState<TipoCita>('sesion-1-1');
  const [duracion, setDuracion] = useState('60');
  const [notas, setNotas] = useState('');
  const [plantillas, setPlantillas] = useState<PlantillaSesion[]>([]);
  const [plantillaAplicada, setPlantillaAplicada] = useState<string>('');
  const [recurrenciaActiva, setRecurrenciaActiva] = useState(false);
  const [tipoRecurrencia, setTipoRecurrencia] = useState<TipoRecurrencia>('semanal');
  const [diasSemana, setDiasSemana] = useState<number[]>([]);
  const [fechaInicioRecurrencia, setFechaInicioRecurrencia] = useState('');
  const [fechaFinRecurrencia, setFechaFinRecurrencia] = useState('');
  const [hastaCancelar, setHastaCancelar] = useState(false);
  const [sincronizarCalendario, setSincronizarCalendario] = useState(true);
  const [tieneConexionActiva, setTieneConexionActiva] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Valores por defecto inteligentes
  useEffect(() => {
    if (isOpen) {
      // Establecer fecha y hora por defecto
      const ahora = fechaInicial || new Date();
      const fechaHoy = ahora.toISOString().split('T')[0];
      setFecha(fechaHoy);

      if (horaInicial) {
        const horaStr = `${horaInicial.hora.toString().padStart(2, '0')}:${horaInicial.minuto.toString().padStart(2, '0')}`;
        setHora(horaStr);
      } else {
        // Hora por defecto: próxima hora redondeada a los 30 minutos
        const proximaHora = new Date(ahora);
        proximaHora.setHours(ahora.getHours() + 1);
        const minutos = proximaHora.getMinutes();
        proximaHora.setMinutes(minutos < 30 ? 30 : 60, 0, 0);
        if (proximaHora.getMinutes() === 60) {
          proximaHora.setHours(proximaHora.getHours() + 1);
          proximaHora.setMinutes(0);
        }
        const horaStr = `${proximaHora.getHours().toString().padStart(2, '0')}:${proximaHora.getMinutes().toString().padStart(2, '0')}`;
        setHora(horaStr);
      }

      // Establecer fecha de inicio de recurrencia
      setFechaInicioRecurrencia(fechaHoy);
      
      // Establecer fecha de fin por defecto (3 meses después)
      const fechaFinDefault = new Date(ahora);
      fechaFinDefault.setMonth(fechaFinDefault.getMonth() + 3);
      setFechaFinRecurrencia(fechaFinDefault.toISOString().split('T')[0]);

      // Cargar plantillas
      cargarPlantillas();
      
      // Verificar si hay conexión de calendario activa
      verificarConexionCalendario();
    }
  }, [isOpen, fechaInicial, horaInicial, userId]);

  const verificarConexionCalendario = async () => {
    try {
      const conexion = await getPrimeraConexionActiva(userId);
      setTieneConexionActiva(!!conexion);
      // Por defecto, activar sincronización si hay conexión
      setSincronizarCalendario(!!conexion);
    } catch (error) {
      console.error('Error verificando conexión de calendario:', error);
      setTieneConexionActiva(false);
    }
  };

  const cargarPlantillas = async () => {
    try {
      const datos = await getPlantillas();
      setPlantillas(datos);
    } catch (error) {
      console.error('Error cargando plantillas:', error);
    }
  };

  const aplicarPlantilla = (plantillaId: string) => {
    const plantilla = plantillas.find(p => p.id === plantillaId);
    if (plantilla) {
      setTipo(plantilla.tipo);
      setDuracion(plantilla.duracion.toString());
      setNotas(plantilla.notas || '');
      setPlantillaAplicada(plantillaId);
    }
  };

  const resetearFormulario = () => {
    setClienteId('');
    setClienteNombre('');
    setNotas('');
    setPlantillaAplicada('');
    setRecurrenciaActiva(false);
    setTipoRecurrencia('semanal');
    setDiasSemana([]);
    setHastaCancelar(false);
    setSincronizarCalendario(true);
    setError(null);
  };

  const handleCerrar = () => {
    resetearFormulario();
    onClose();
  };

  const validarFormulario = (): boolean => {
    if (!clienteId) {
      setError('Selecciona un cliente');
      return false;
    }
    if (!fecha) {
      setError('Selecciona una fecha');
      return false;
    }
    if (!hora) {
      setError('Selecciona una hora');
      return false;
    }
    if (!tipo) {
      setError('Selecciona un tipo de sesión');
      return false;
    }
    if (!duracion) {
      setError('Selecciona una duración');
      return false;
    }
    if (recurrenciaActiva) {
      if (tipoRecurrencia === 'semanal' && diasSemana.length === 0) {
        setError('Selecciona al menos un día de la semana');
        return false;
      }
      if (!hastaCancelar && !fechaFinRecurrencia) {
        setError('Selecciona una fecha de fin o marca "hasta cancelar"');
        return false;
      }
    }
    setError(null);
    return true;
  };

  const toggleDiaSemana = (dia: number) => {
    setDiasSemana(prev => 
      prev.includes(dia) 
        ? prev.filter(d => d !== dia)
        : [...prev, dia].sort()
    );
  };

  const generarFechasRecurrencia = (fechaInicio: Date, fechaFinRecurrencia: Date | null): Date[] => {
    const fechas: Date[] = [];
    const fechaActual = new Date(fechaInicio);
    const fechaFin = fechaFinRecurrencia || new Date('2099-12-31'); // Fecha muy lejana si es "hasta cancelar"
    const [horaNum, minutoNum] = hora.split(':').map(Number);

    // Limitar a máximo 2 años de recurrencia para evitar generar demasiadas fechas
    const fechaMaxima = new Date(fechaInicio);
    fechaMaxima.setFullYear(fechaMaxima.getFullYear() + 2);
    const fechaLimite = fechaFinRecurrencia && fechaFin < fechaMaxima ? fechaFin : fechaMaxima;

    if (tipoRecurrencia === 'diaria') {
      while (fechaActual <= fechaLimite) {
        const nuevaFecha = new Date(fechaActual);
        nuevaFecha.setHours(horaNum, minutoNum, 0, 0);
        fechas.push(new Date(nuevaFecha));
        fechaActual.setDate(fechaActual.getDate() + 1);
      }
    } else if (tipoRecurrencia === 'semanal') {
      // Para semanal, generar fechas basadas en los días seleccionados
      while (fechaActual <= fechaLimite) {
        const diaSemanaActual = fechaActual.getDay();
        if (diasSemana.includes(diaSemanaActual)) {
          const nuevaFecha = new Date(fechaActual);
          nuevaFecha.setHours(horaNum, minutoNum, 0, 0);
          fechas.push(new Date(nuevaFecha));
        }
        fechaActual.setDate(fechaActual.getDate() + 1);
        
        // Limitar a máximo 500 sesiones
        if (fechas.length >= 500) break;
      }
    } else if (tipoRecurrencia === 'quincenal') {
      while (fechaActual <= fechaLimite) {
        const nuevaFecha = new Date(fechaActual);
        nuevaFecha.setHours(horaNum, minutoNum, 0, 0);
        fechas.push(new Date(nuevaFecha));
        fechaActual.setDate(fechaActual.getDate() + 14);
      }
    } else if (tipoRecurrencia === 'mensual') {
      while (fechaActual <= fechaLimite) {
        const nuevaFecha = new Date(fechaActual);
        nuevaFecha.setHours(horaNum, minutoNum, 0, 0);
        fechas.push(new Date(nuevaFecha));
        fechaActual.setMonth(fechaActual.getMonth() + 1);
      }
    }

    return fechas;
  };

  const crearSesiones = async () => {
    if (!validarFormulario()) return;

    setLoading(true);
    setError(null);

    try {
      const [ano, mes, dia] = fecha.split('-').map(Number);
      const [horaNum, minutoNum] = hora.split(':').map(Number);

      const fechaInicio = new Date(ano, mes - 1, dia, horaNum, minutoNum);
      const fechaFin = new Date(fechaInicio);
      fechaFin.setMinutes(fechaFin.getMinutes() + parseInt(duracion));

      // Generar serieId único para sesiones recurrentes
      const serieId = recurrenciaActiva ? `serie-${Date.now()}` : undefined;

      // Preparar información de recurrencia
      const recurrencia: Recurrencia | undefined = recurrenciaActiva ? {
        tipo: tipoRecurrencia,
        diasSemana: tipoRecurrencia === 'semanal' ? diasSemana : undefined,
        fechaInicio: fechaInicio, // Usar la fecha de inicio de la sesión
        fechaFin: hastaCancelar ? undefined : new Date(fechaFinRecurrencia + 'T23:59:59'),
        serieId,
      } : undefined;

      // Generar fechas de sesiones
      let fechasSesiones: Date[] = [fechaInicio];
      
      if (recurrenciaActiva) {
        const fechaFinRec = hastaCancelar ? null : new Date(fechaFinRecurrencia + 'T23:59:59');
        fechasSesiones = generarFechasRecurrencia(fechaInicio, fechaFinRec);
        // Eliminar duplicados y ordenar
        fechasSesiones = Array.from(new Set(fechasSesiones.map(d => d.getTime())))
          .map(t => new Date(t))
          .sort((a, b) => a.getTime() - b.getTime());
      }

      // Crear todas las sesiones
      const citasCreadas: Cita[] = [];
      for (const fechaSesion of fechasSesiones) {
        const fechaFinSesion = new Date(fechaSesion);
        fechaFinSesion.setMinutes(fechaFinSesion.getMinutes() + parseInt(duracion));

        const nuevaCita = await crearCita({
          titulo: `Sesión ${tipo === 'sesion-1-1' ? 'PT' : tipo} - ${clienteNombre}`,
          tipo,
          estado: 'confirmada',
          fechaInicio: fechaSesion,
          fechaFin: fechaFinSesion,
          clienteId,
          clienteNombre,
          notas: notas || undefined,
          recurrencia,
          sincronizarCalendario,
        }, userId);
        citasCreadas.push(nuevaCita);
      }

      // Notificar todas las citas creadas
      citasCreadas.forEach(cita => onCitaCreada(cita));

      // Notificar política de cancelación al cliente si está configurado (User Story 1)
      if (clienteId && userId) {
        try {
          const { getConfiguracionPoliticaCancelacion } = await import('../api/metricasNoShows');
          const config = await getConfiguracionPoliticaCancelacion(userId);
          
          if (config.activo && config.notificarPoliticaAlCrear && config.mensajePolitica) {
            // Enviar notificación de política al cliente
            // En producción, esto enviaría un email/SMS real
            console.log(`Notificación de política enviada a ${clienteNombre}:`);
            console.log(config.mensajePolitica);
            // Aquí se integraría con el sistema de notificaciones real
          }
        } catch (error) {
          // No fallar la creación si hay error en la notificación
          console.error('Error notificando política de cancelación:', error);
        }
      }

      resetearFormulario();
      onClose();
    } catch (err) {
      console.error('Error creando sesión:', err);
      setError('Error al crear la sesión. Por favor, intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleCerrar}
      title="Crear Sesión Rápida"
      size="lg"
      footer={
        <div className="flex items-center justify-between w-full">
          <Button
            variant="ghost"
            onClick={handleCerrar}
            disabled={loading}
          >
            Cancelar
          </Button>
          <Button
            variant="primary"
            onClick={crearSesiones}
            loading={loading}
          >
            {recurrenciaActiva ? 'Crear serie de sesiones' : 'Crear sesión'}
          </Button>
        </div>
      }
    >
      <div className="space-y-4">
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-800 text-sm">
            {error}
          </div>
        )}

        {/* Plantillas */}
        {plantillas.length > 0 && (
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Plantillas (1 click)
            </label>
            <div className="flex flex-wrap gap-2">
              {plantillas.map(plantilla => (
                <button
                  key={plantilla.id}
                  type="button"
                  onClick={() => aplicarPlantilla(plantilla.id)}
                  className={`px-3 py-1.5 text-sm rounded-lg border transition-colors ${
                    plantillaAplicada === plantilla.id
                      ? 'bg-blue-100 border-blue-500 text-blue-700'
                      : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {plantilla.nombre}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Cliente */}
        <ClienteAutocomplete
          value={clienteId}
          onChange={(id, nombre) => {
            setClienteId(id);
            setClienteNombre(nombre);
          }}
          label="Cliente *"
          placeholder="Buscar cliente..."
          role={role}
          userId={userId}
          error={error && !clienteId ? error : undefined}
        />

        {/* Fecha y Hora */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Input
              type="date"
              label="Fecha *"
              value={fecha}
              onChange={(e) => setFecha(e.target.value)}
              leftIcon={<Calendar className="w-4 h-4" />}
              error={error && !fecha ? error : undefined}
            />
          </div>
          <div>
            <Input
              type="time"
              label="Hora *"
              value={hora}
              onChange={(e) => setHora(e.target.value)}
              leftIcon={<Clock className="w-4 h-4" />}
              error={error && !hora ? error : undefined}
            />
          </div>
        </div>

        {/* Tipo y Duración */}
        <div className="grid grid-cols-2 gap-4">
          <Select
            label="Tipo de sesión *"
            value={tipo}
            onChange={(e) => setTipo(e.target.value as TipoCita)}
            options={TIPOS_SESION}
            error={error && !tipo ? error : undefined}
          />
          <Select
            label="Duración *"
            value={duracion}
            onChange={(e) => setDuracion(e.target.value)}
            options={DURACIONES}
            error={error && !duracion ? error : undefined}
          />
        </div>

        {/* Notas */}
        <Textarea
          label="Notas"
          value={notas}
          onChange={(e) => setNotas(e.target.value)}
          placeholder="Notas adicionales..."
          rows={3}
        />

        {/* Sincronización con calendario externo */}
        {tieneConexionActiva && (
          <div className="border-t border-gray-200 pt-4">
            <div className="flex items-center justify-between">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Sincronizar con calendario externo
                </label>
                <p className="text-xs text-gray-500">
                  Crear automáticamente un evento en tu calendario personal (Google/Outlook)
                </p>
              </div>
              <Switch
                checked={sincronizarCalendario}
                onChange={setSincronizarCalendario}
              />
            </div>
          </div>
        )}

        {/* Recurrencia */}
        <div className="border-t border-gray-200 pt-4">
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={recurrenciaActiva}
              onChange={(e) => {
                setRecurrenciaActiva(e.target.checked);
                if (!e.target.checked) {
                  setDiasSemana([]);
                  setHastaCancelar(false);
                } else if (tipoRecurrencia === 'semanal' && diasSemana.length === 0) {
                  // Por defecto, seleccionar el día de la semana de la fecha inicial
                  const fechaObj = new Date(fecha);
                  setDiasSemana([fechaObj.getDay()]);
                }
              }}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <span className="text-sm font-semibold text-gray-900 flex items-center">
              <Repeat className="w-4 h-4 mr-1" />
              Crear sesiones recurrentes
            </span>
          </label>

          {recurrenciaActiva && (
            <div className="mt-4 ml-6 space-y-4">
              <Select
                label="Frecuencia *"
                value={tipoRecurrencia}
                onChange={(e) => {
                  const nuevoTipo = e.target.value as TipoRecurrencia;
                  setTipoRecurrencia(nuevoTipo);
                  if (nuevoTipo === 'semanal' && diasSemana.length === 0) {
                    const fechaObj = new Date(fecha);
                    setDiasSemana([fechaObj.getDay()]);
                  } else if (nuevoTipo !== 'semanal') {
                    setDiasSemana([]);
                  }
                }}
                options={[
                  { value: 'diaria', label: 'Diaria' },
                  { value: 'semanal', label: 'Semanal' },
                  { value: 'quincenal', label: 'Quincenal' },
                  { value: 'mensual', label: 'Mensual' },
                ]}
              />

              {/* Selección de días de la semana (solo para recurrencia semanal) */}
              {tipoRecurrencia === 'semanal' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Días de la semana *
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { valor: 1, label: 'Lun' },
                      { valor: 2, label: 'Mar' },
                      { valor: 3, label: 'Mié' },
                      { valor: 4, label: 'Jue' },
                      { valor: 5, label: 'Vie' },
                      { valor: 6, label: 'Sáb' },
                      { valor: 0, label: 'Dom' },
                    ].map((dia) => (
                      <button
                        key={dia.valor}
                        type="button"
                        onClick={() => toggleDiaSemana(dia.valor)}
                        className={`px-3 py-2 text-sm font-medium rounded-lg border transition-colors ${
                          diasSemana.includes(dia.valor)
                            ? 'bg-blue-600 text-white border-blue-600'
                            : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        {dia.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Fecha de inicio y fin */}
              <div className="grid grid-cols-2 gap-4">
                <Input
                  type="date"
                  label="Fecha de inicio *"
                  value={fechaInicioRecurrencia}
                  onChange={(e) => setFechaInicioRecurrencia(e.target.value)}
                  leftIcon={<Calendar className="w-4 h-4" />}
                />
                <div>
                  <Input
                    type="date"
                    label="Fecha de fin"
                    value={fechaFinRecurrencia}
                    onChange={(e) => setFechaFinRecurrencia(e.target.value)}
                    leftIcon={<Calendar className="w-4 h-4" />}
                    disabled={hastaCancelar}
                  />
                  <label className="flex items-center space-x-2 mt-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={hastaCancelar}
                      onChange={(e) => {
                        setHastaCancelar(e.target.checked);
                        if (e.target.checked) {
                          setFechaFinRecurrencia('');
                        }
                      }}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">Hasta cancelar</span>
                  </label>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};

