import React, { useState, useMemo } from 'react';
import { CalendarDays, Plus, X } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { Card, Tabs, Button, MetricCards, Modal, Input, Select, Textarea } from '../../../components/componentsreutilizables';
import {
  AgendaCalendar,
  VistaPersonal,
  VistaCentro,
  GestorHorarios,
  ConfiguradorHorariosTrabajo,
  BloqueosAgenda,
  ReservasCitas,
  RecordatoriosAutomaticos,
  ConfiguracionResumenDiario,
  VistaResumenDiario,
  AnalyticsOcupacion,
  ConfiguracionTiempoDescanso,
  EstadisticasConfirmacion,
  SincronizacionCalendario,
  GestorEnlacesReserva,
  HistorialCliente,
  ClienteAutocomplete,
  EstadisticasNoShows,
  ConfiguracionPoliticaCancelacion,
  EstadisticasCumplimientoPolitica,
  DashboardMetricasSesiones,
  MapaCalorHorarios,
  DashboardFinanciero,
  GestorListaEspera,
} from '../components';
import { getCitas, crearCita } from '../api/calendario';

export default function AgendaCalendarioPage() {
  const { user } = useAuth();
  const esEntrenador = user?.role === 'entrenador';
  const role = esEntrenador ? 'entrenador' : 'gimnasio';
  const [tabActiva, setTabActiva] = useState<string>('calendario');
  const [citas, setCitas] = React.useState<any[]>([]);
  const [mostrarModalCita, setMostrarModalCita] = React.useState(false);
  const [clienteSeleccionadoHistorial, setClienteSeleccionadoHistorial] = React.useState<{ id: string; nombre: string } | null>(null);
  const [formCita, setFormCita] = React.useState(() => ({
    titulo: '',
    tipo: esEntrenador ? 'sesion-1-1' : 'clase-colectiva',
    fecha: '',
    horaInicio: '',
    horaFin: '',
    clienteNombre: '',
    instructorNombre: '',
    capacidadMaxima: '20',
    inscritos: '0',
    notas: '',
  }));

  React.useEffect(() => {
    const cargarCitas = async () => {
      const fechaInicio = new Date();
      const fechaFin = new Date();
      fechaFin.setMonth(fechaFin.getMonth() + 1);
      const citasData = await getCitas(fechaInicio, fechaFin, role);
      setCitas(citasData);
    };
    cargarCitas();
  }, [role]);

  const tabs = useMemo(() => {
    const comunes = [
      { id: 'calendario', label: 'Calendario', icon: <CalendarDays className="w-4 h-4" /> },
      { id: 'reservas', label: 'Reservas', icon: <CalendarDays className="w-4 h-4" /> },
      { id: 'bloqueos', label: 'Bloqueos', icon: <CalendarDays className="w-4 h-4" /> },
      { id: 'horarios', label: 'Gestión de Horarios', icon: <CalendarDays className="w-4 h-4" /> },
      ...(esEntrenador ? [{ id: 'tiempo-descanso', label: 'Tiempo de Descanso', icon: <CalendarDays className="w-4 h-4" /> }] : []),
      ...(esEntrenador ? [{ id: 'sincronizacion-calendario', label: 'Sincronización Calendario', icon: <CalendarDays className="w-4 h-4" /> }] : []),
      ...(esEntrenador ? [{ id: 'enlaces-reserva', label: 'Enlaces de Reserva', icon: <CalendarDays className="w-4 h-4" /> }] : []),
      { id: 'recordatorios', label: 'Recordatorios', icon: <CalendarDays className="w-4 h-4" /> },
      ...(esEntrenador ? [{ id: 'resumen-diario', label: 'Resumen Diario', icon: <CalendarDays className="w-4 h-4" /> }] : []),
      ...(esEntrenador ? [{ id: 'estadisticas-confirmacion', label: 'Estadísticas Confirmación', icon: <CalendarDays className="w-4 h-4" /> }] : []),
      ...(esEntrenador ? [{ id: 'estadisticas-no-shows', label: 'Estadísticas No-Shows', icon: <CalendarDays className="w-4 h-4" /> }] : []),
      ...(esEntrenador ? [{ id: 'politica-cancelacion', label: 'Política de Cancelación', icon: <CalendarDays className="w-4 h-4" /> }] : []),
      ...(esEntrenador ? [{ id: 'estadisticas-cumplimiento', label: 'Estadísticas Cumplimiento', icon: <CalendarDays className="w-4 h-4" /> }] : []),
      ...(esEntrenador ? [{ id: 'historial-cliente', label: 'Historial Cliente', icon: <CalendarDays className="w-4 h-4" /> }] : []),
      { id: 'analytics', label: 'Analytics Ocupación', icon: <CalendarDays className="w-4 h-4" /> },
      ...(esEntrenador ? [{ id: 'dashboard-metricas', label: 'Dashboard Métricas', icon: <CalendarDays className="w-4 h-4" /> }] : []),
      ...(esEntrenador ? [{ id: 'mapa-calor-horarios', label: 'Mapa de Calor Horarios', icon: <CalendarDays className="w-4 h-4" /> }] : []),
      ...(esEntrenador ? [{ id: 'dashboard-financiero', label: 'Dashboard Financiero', icon: <CalendarDays className="w-4 h-4" /> }] : []),
      ...(esEntrenador ? [{ id: 'lista-espera', label: 'Lista de Espera', icon: <CalendarDays className="w-4 h-4" /> }] : []),
    ];
    return comunes;
  }, [esEntrenador]);

  const handleCrearCita = async () => {
    const fechaCompleta = new Date(`${formCita.fecha}T${formCita.horaInicio}`);
    const fechaFin = new Date(`${formCita.fecha}T${formCita.horaFin}`);
    
    const nuevaCita = {
      titulo: formCita.titulo,
      tipo: formCita.tipo as any,
      estado: 'confirmada' as any,
      fechaInicio: fechaCompleta,
      fechaFin: fechaFin,
      ...(esEntrenador 
        ? { clienteNombre: formCita.clienteNombre }
        : { 
            instructorNombre: formCita.instructorNombre,
            capacidadMaxima: parseInt(formCita.capacidadMaxima),
            inscritos: parseInt(formCita.inscritos),
          }
      ),
      notas: formCita.notas || undefined,
    };
    
    const citaCreada = await crearCita(nuevaCita);
    setCitas([...citas, citaCreada]);
    setMostrarModalCita(false);
    setFormCita(prev => ({
      titulo: '',
      tipo: esEntrenador ? 'sesion-1-1' : 'clase-colectiva',
      fecha: '',
      horaInicio: '',
      horaFin: '',
      clienteNombre: '',
      instructorNombre: '',
      capacidadMaxima: '20',
      inscritos: '0',
      notas: '',
    }));
  };

  const renderTabContent = () => {
    switch (tabActiva) {
      case 'calendario':
        return (
          <>
            <AgendaCalendar role={role} citasAdicionales={citas} />
            {esEntrenador ? <VistaPersonal citas={citas} /> : <VistaCentro citas={citas} />}
          </>
        );
      case 'reservas':
        return <ReservasCitas />;
      case 'horarios':
        return esEntrenador ? <ConfiguradorHorariosTrabajo /> : <GestorHorarios />;
      case 'bloqueos':
        return <BloqueosAgenda />;
      case 'tiempo-descanso':
        return esEntrenador ? <ConfiguracionTiempoDescanso /> : null;
      case 'sincronizacion-calendario':
        return esEntrenador ? <SincronizacionCalendario /> : null;
      case 'enlaces-reserva':
        return esEntrenador ? <GestorEnlacesReserva /> : null;
      case 'recordatorios':
        return <RecordatoriosAutomaticos />;
      case 'resumen-diario':
        return esEntrenador ? (
          <div className="space-y-6">
            <ConfiguracionResumenDiario />
            <VistaResumenDiario />
          </div>
        ) : null;
      case 'estadisticas-confirmacion':
        return esEntrenador ? <EstadisticasConfirmacion /> : null;
      case 'estadisticas-no-shows':
        return esEntrenador ? <EstadisticasNoShows /> : null;
      case 'politica-cancelacion':
        return esEntrenador ? <ConfiguracionPoliticaCancelacion /> : null;
      case 'estadisticas-cumplimiento':
        return esEntrenador ? <EstadisticasCumplimientoPolitica /> : null;
      case 'historial-cliente':
        return esEntrenador ? (
          <div className="space-y-6">
            <Card className="bg-white shadow-sm">
              <div className="p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Seleccionar Cliente</h2>
                <ClienteAutocomplete
                  value={clienteSeleccionadoHistorial?.id || ''}
                  onChange={(id, nombre) => {
                    setClienteSeleccionadoHistorial(id ? { id, nombre } : null);
                  }}
                  label="Cliente"
                  placeholder="Buscar cliente para ver historial..."
                  role="entrenador"
                  userId={user?.id}
                />
              </div>
            </Card>
            {clienteSeleccionadoHistorial && (
              <HistorialCliente
                clienteId={clienteSeleccionadoHistorial.id}
                clienteNombre={clienteSeleccionadoHistorial.nombre}
              />
            )}
          </div>
        ) : null;
      case 'analytics':
        return <AnalyticsOcupacion />;
      case 'dashboard-metricas':
        return esEntrenador ? <DashboardMetricasSesiones /> : null;
      case 'mapa-calor-horarios':
        return esEntrenador ? <MapaCalorHorarios /> : null;
      case 'dashboard-financiero':
        return esEntrenador ? <DashboardFinanciero /> : null;
      case 'lista-espera':
        return esEntrenador ? <GestorListaEspera /> : null;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Header */}
      <div className="border-b border-gray-200/60 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6">
          <div className="py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-xl mr-4 ring-1 ring-blue-200/70">
                  <CalendarDays size={24} className="text-blue-600" />
                </div>
                <div>
                  <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900">
                    Agenda y Calendario
                  </h1>
                  <p className="text-gray-600">
                    {esEntrenador 
                      ? 'Gestiona tu agenda personal con sesiones 1 a 1' 
                      : 'Gestiona la agenda completa del centro con clases y servicios'
                    }
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {esEntrenador && (
                  <Button variant="primary" onClick={() => setMostrarModalCita(true)}>
                    <Plus size={20} className="mr-2" />
                    Nueva Cita 1:1
                  </Button>
                )}
                {!esEntrenador && (
                  <Button variant="primary" onClick={() => setMostrarModalCita(true)}>
                    <Plus size={20} className="mr-2" />
                    Publicar Nueva Clase
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contenido Principal */}
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6 py-8">
        <div className="space-y-6">
          {/* Sistema de Tabs */}
          <Card className="p-0 bg-white shadow-sm">
            <div className="px-4 py-3">
              <div
                role="tablist"
                aria-label="Secciones"
                className="flex items-center gap-2 rounded-2xl bg-slate-100 p-1"
              >
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setTabActiva(tab.id)}
                    className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all ${
                      tabActiva === tab.id
                        ? 'bg-white text-slate-900 shadow-sm ring-1 ring-slate-200'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-white/70'
                    }`}
                    role="tab"
                    aria-selected={tabActiva === tab.id}
                  >
                    <span className={tabActiva === tab.id ? 'opacity-100' : 'opacity-70'}>
                      {tab.icon}
                    </span>
                    <span>{tab.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </Card>

          {/* Contenido de la Tab Activa */}
          <div className="mt-6">
            {renderTabContent()}
          </div>
        </div>
      </div>

      {/* Modal para Nueva Cita */}
      <Modal
        isOpen={mostrarModalCita}
        onClose={() => setMostrarModalCita(false)}
        title={esEntrenador ? 'Nueva Cita 1:1' : 'Publicar Nueva Clase'}
        size="lg"
        footer={
          <div className="flex space-x-3">
            <Button variant="secondary" onClick={() => setMostrarModalCita(false)}>
              <X size={20} className="mr-2" />
              Cancelar
            </Button>
            <Button variant="primary" onClick={handleCrearCita}>
              <Plus size={20} className="mr-2" />
              {esEntrenador ? 'Crear Cita' : 'Publicar Clase'}
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          <Input
            label="Título"
            value={formCita.titulo}
            onChange={(e) => setFormCita({ ...formCita, titulo: e.target.value })}
            placeholder={esEntrenador ? 'Sesión PT con...' : 'Yoga Matutino'}
            required
          />

          <Select
            label="Tipo"
            value={formCita.tipo}
            onChange={(e) => setFormCita({ ...formCita, tipo: e.target.value })}
            options={
              esEntrenador
                ? [
                    { value: 'sesion-1-1', label: 'Sesión 1:1' },
                    { value: 'videollamada', label: 'Videollamada' },
                    { value: 'evaluacion', label: 'Evaluación' },
                  ]
                : [
                    { value: 'clase-colectiva', label: 'Clase Colectiva' },
                    { value: 'fisioterapia', label: 'Fisioterapia' },
                  ]
            }
          />

          <div className="grid grid-cols-3 gap-4">
            <div>
              <Input
                label="Fecha"
                type="date"
                value={formCita.fecha}
                onChange={(e) => setFormCita({ ...formCita, fecha: e.target.value })}
                required
              />
            </div>
            <div>
              <Input
                label="Hora Inicio"
                type="time"
                value={formCita.horaInicio}
                onChange={(e) => setFormCita({ ...formCita, horaInicio: e.target.value })}
                required
              />
            </div>
            <div>
              <Input
                label="Hora Fin"
                type="time"
                value={formCita.horaFin}
                onChange={(e) => setFormCita({ ...formCita, horaFin: e.target.value })}
                required
              />
            </div>
          </div>

          {esEntrenador ? (
            <Input
              label="Cliente"
              value={formCita.clienteNombre}
              onChange={(e) => setFormCita({ ...formCita, clienteNombre: e.target.value })}
              placeholder="Nombre del cliente"
              required
            />
          ) : (
            <>
              <Input
                label="Instructor"
                value={formCita.instructorNombre}
                onChange={(e) => setFormCita({ ...formCita, instructorNombre: e.target.value })}
                placeholder="Nombre del instructor"
                required
              />
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Capacidad Máxima"
                  type="number"
                  value={formCita.capacidadMaxima}
                  onChange={(e) => setFormCita({ ...formCita, capacidadMaxima: e.target.value })}
                  required
                />
                <Input
                  label="Inscritos"
                  type="number"
                  value={formCita.inscritos}
                  onChange={(e) => setFormCita({ ...formCita, inscritos: e.target.value })}
                />
              </div>
            </>
          )}

          <Textarea
            label="Notas (opcional)"
            value={formCita.notas}
            onChange={(e) => setFormCita({ ...formCita, notas: e.target.value })}
            placeholder="Información adicional sobre la cita..."
            rows={3}
          />
        </div>
      </Modal>
    </div>
  );
}

