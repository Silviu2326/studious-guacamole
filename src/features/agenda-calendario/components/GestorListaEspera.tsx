import React, { useState, useEffect } from 'react';
import { 
  Clock, 
  Users, 
  Bell, 
  Plus, 
  X, 
  CheckCircle, 
  AlertCircle,
  Calendar,
  Settings,
  TrendingUp,
  UserPlus,
} from 'lucide-react';
import { 
  Card, 
  Table, 
  Button, 
  Input, 
  Select, 
  Badge, 
  Modal, 
  MetricCards,
  Switch,
} from '../../../components/componentsreutilizables';
import {
  EntradaListaEspera,
  EstadoListaEspera,
  HorarioPopular,
  NotificacionSlotLiberado,
  ConfiguracionListaEspera,
  ResumenListaEspera,
} from '../types';
import {
  getListaEspera,
  agregarClienteListaEspera,
  eliminarClienteListaEspera,
  getHorariosPopulares,
  getResumenListaEspera,
  getConfiguracionListaEspera,
  actualizarConfiguracionListaEspera,
  getNotificacionesSlotsLiberados,
  asignarSlotListaEspera,
} from '../api/listaEspera';
import { ClienteAutocomplete } from './ClienteAutocomplete';
import { useAuth } from '../../../context/AuthContext';

export const GestorListaEspera: React.FC = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [listaEspera, setListaEspera] = useState<EntradaListaEspera[]>([]);
  const [horariosPopulares, setHorariosPopulares] = useState<HorarioPopular[]>([]);
  const [resumen, setResumen] = useState<ResumenListaEspera | null>(null);
  const [configuracion, setConfiguracion] = useState<ConfiguracionListaEspera | null>(null);
  const [notificaciones, setNotificaciones] = useState<NotificacionSlotLiberado[]>([]);
  const [mostrarModalAgregar, setMostrarModalAgregar] = useState(false);
  const [mostrarModalConfig, setMostrarModalConfig] = useState(false);
  const [filtroEstado, setFiltroEstado] = useState<EstadoListaEspera | undefined>(undefined);
  
  // Formulario para agregar cliente
  const [nuevoCliente, setNuevoCliente] = useState({
    clienteId: '',
    clienteNombre: '',
    diaSemana: 1,
    horaInicio: '10:00',
    horaFin: '11:00',
  });

  useEffect(() => {
    if (user?.id) {
      cargarDatos();
    }
  }, [user?.id, filtroEstado]);

  const cargarDatos = async () => {
    if (!user?.id) return;
    
    setLoading(true);
    try {
      const [listaData, horariosData, resumenData, configData, notifData] = await Promise.all([
        getListaEspera(user.id, filtroEstado),
        getHorariosPopulares(user.id),
        getResumenListaEspera(user.id),
        getConfiguracionListaEspera(user.id),
        getNotificacionesSlotsLiberados(user.id),
      ]);

      setListaEspera(listaData);
      setHorariosPopulares(horariosData);
      setResumen(resumenData);
      setConfiguracion(configData);
      setNotificaciones(notifData);
    } catch (error) {
      console.error('Error cargando lista de espera:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAgregarCliente = async () => {
    if (!user?.id || !nuevoCliente.clienteId) return;

    try {
      await agregarClienteListaEspera({
        entrenadorId: user.id,
        clienteId: nuevoCliente.clienteId,
        clienteNombre: nuevoCliente.clienteNombre,
        diaSemana: nuevoCliente.diaSemana,
        horaInicio: nuevoCliente.horaInicio,
        horaFin: nuevoCliente.horaFin,
      });
      
      setMostrarModalAgregar(false);
      setNuevoCliente({
        clienteId: '',
        clienteNombre: '',
        diaSemana: 1,
        horaInicio: '10:00',
        horaFin: '11:00',
      });
      cargarDatos();
    } catch (error: any) {
      alert(error.message || 'Error agregando cliente a la lista de espera');
    }
  };

  const handleEliminarCliente = async (entradaId: string) => {
    if (!user?.id) return;
    
    if (!confirm('¿Estás seguro de eliminar este cliente de la lista de espera?')) {
      return;
    }

    try {
      await eliminarClienteListaEspera(entradaId, user.id);
      cargarDatos();
    } catch (error) {
      console.error('Error eliminando cliente:', error);
    }
  };

  const handleAsignarSlot = async (entradaId: string, fechaSlot: Date) => {
    if (!user?.id) return;

    try {
      await asignarSlotListaEspera(entradaId, fechaSlot, user.id);
      cargarDatos();
    } catch (error) {
      console.error('Error asignando slot:', error);
    }
  };

  const handleActualizarConfig = async () => {
    if (!user?.id || !configuracion) return;

    try {
      await actualizarConfiguracionListaEspera(configuracion, user.id);
      setMostrarModalConfig(false);
      cargarDatos();
    } catch (error) {
      console.error('Error actualizando configuración:', error);
    }
  };

  const metricasData = [
    {
      id: 'total',
      title: 'Total Entradas',
      value: resumen?.totalEntradas || 0,
      subtitle: `${resumen?.entradasActivas || 0} activas`,
      icon: <Users className="w-6 h-6" />,
      color: 'info' as const,
      loading,
    },
    {
      id: 'activas',
      title: 'Entradas Activas',
      value: resumen?.entradasActivas || 0,
      subtitle: `${resumen?.entradasNotificadas || 0} notificadas`,
      icon: <Clock className="w-6 h-6" />,
      color: 'primary' as const,
      loading,
    },
    {
      id: 'asignadas',
      title: 'Asignadas',
      value: resumen?.entradasAsignadas || 0,
      subtitle: 'Slots asignados',
      icon: <CheckCircle className="w-6 h-6" />,
      color: 'success' as const,
      loading,
    },
    {
      id: 'notificaciones',
      title: 'Notificaciones',
      value: notificaciones.length,
      subtitle: `${notificaciones.filter(n => !n.confirmada).length} pendientes`,
      icon: <Bell className="w-6 h-6" />,
      color: notificaciones.length > 0 ? 'warning' as const : 'info' as const,
      loading,
    },
  ];

  const diasSemana = [
    { value: 0, label: 'Domingo' },
    { value: 1, label: 'Lunes' },
    { value: 2, label: 'Martes' },
    { value: 3, label: 'Miércoles' },
    { value: 4, label: 'Jueves' },
    { value: 5, label: 'Viernes' },
    { value: 6, label: 'Sábado' },
  ];

  const columnasListaEspera = [
    {
      key: 'prioridad',
      label: 'Prioridad',
      render: (entrada: EntradaListaEspera) => (
        <Badge variant="secondary">#{entrada.prioridad}</Badge>
      ),
    },
    {
      key: 'clienteNombre',
      label: 'Cliente',
      render: (entrada: EntradaListaEspera) => entrada.clienteNombre,
    },
    {
      key: 'diaSemana',
      label: 'Día',
      render: (entrada: EntradaListaEspera) => {
        const dia = diasSemana.find(d => d.value === entrada.diaSemana);
        return dia?.label || 'N/A';
      },
    },
    {
      key: 'horario',
      label: 'Horario',
      render: (entrada: EntradaListaEspera) => `${entrada.horaInicio} - ${entrada.horaFin}`,
    },
    {
      key: 'fechaSolicitud',
      label: 'Fecha Solicitud',
      render: (entrada: EntradaListaEspera) => 
        new Date(entrada.fechaSolicitud).toLocaleDateString('es-ES'),
    },
    {
      key: 'estado',
      label: 'Estado',
      render: (entrada: EntradaListaEspera) => {
        const estados = {
          activa: { label: 'Activa', variant: 'primary' as const },
          notificada: { label: 'Notificada', variant: 'warning' as const },
          asignada: { label: 'Asignada', variant: 'success' as const },
          cancelada: { label: 'Cancelada', variant: 'secondary' as const },
          expirada: { label: 'Expirada', variant: 'error' as const },
        };
        const estado = estados[entrada.estado];
        return <Badge variant={estado.variant}>{estado.label}</Badge>;
      },
    },
    {
      key: 'acciones',
      label: 'Acciones',
      render: (entrada: EntradaListaEspera) => (
        <div className="flex gap-2">
          {entrada.estado === 'activa' && (
            <Button
              variant="secondary"
              size="sm"
              onClick={() => handleEliminarCliente(entrada.id)}
            >
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>
      ),
    },
  ];

  const columnasHorariosPopulares = [
    {
      key: 'diaSemana',
      label: 'Día',
      render: (horario: HorarioPopular) => {
        const dia = diasSemana.find(d => d.value === horario.diaSemana);
        return dia?.label || 'N/A';
      },
    },
    {
      key: 'horario',
      label: 'Horario',
      render: (horario: HorarioPopular) => `${horario.horaInicio} - ${horario.horaFin}`,
    },
    {
      key: 'numeroSolicitudes',
      label: 'Solicitudes',
      render: (horario: HorarioPopular) => (
        <Badge variant="primary">{horario.numeroSolicitudes}</Badge>
      ),
    },
    {
      key: 'frecuenciaAsignacion',
      label: 'Veces Asignado',
      render: (horario: HorarioPopular) => horario.frecuenciaAsignacion,
    },
    {
      key: 'ultimaAsignacion',
      label: 'Última Asignación',
      render: (horario: HorarioPopular) => 
        horario.ultimaAsignacion 
          ? new Date(horario.ultimaAsignacion).toLocaleDateString('es-ES')
          : 'Nunca',
    },
  ];

  const columnasNotificaciones = [
    {
      key: 'clienteNombre',
      label: 'Cliente',
      render: (notif: NotificacionSlotLiberado) => notif.clienteNombre,
    },
    {
      key: 'fechaSlot',
      label: 'Fecha Slot',
      render: (notif: NotificacionSlotLiberado) => 
        new Date(notif.fechaSlot).toLocaleDateString('es-ES'),
    },
    {
      key: 'horario',
      label: 'Horario',
      render: (notif: NotificacionSlotLiberado) => `${notif.horaInicio} - ${notif.horaFin}`,
    },
    {
      key: 'fechaEnvio',
      label: 'Enviada',
      render: (notif: NotificacionSlotLiberado) => 
        notif.fechaEnvio ? new Date(notif.fechaEnvio).toLocaleDateString('es-ES') : 'No',
    },
    {
      key: 'confirmada',
      label: 'Estado',
      render: (notif: NotificacionSlotLiberado) => (
        <Badge variant={notif.confirmada ? 'success' : 'warning'}>
          {notif.confirmada ? 'Confirmada' : 'Pendiente'}
        </Badge>
      ),
    },
    {
      key: 'fechaExpiracion',
      label: 'Expira',
      render: (notif: NotificacionSlotLiberado) => 
        new Date(notif.fechaExpiracion).toLocaleDateString('es-ES'),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Métricas */}
      <MetricCards data={metricasData} columns={4} />

      {/* Acciones */}
      <Card className="bg-white shadow-sm">
        <div className="p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">Lista de Espera</h2>
            <div className="flex gap-2">
              <Button
                variant="primary"
                onClick={() => setMostrarModalAgregar(true)}
              >
                <UserPlus className="w-4 h-4 mr-2" />
                Agregar Cliente
              </Button>
              <Button
                variant="secondary"
                onClick={() => setMostrarModalConfig(true)}
              >
                <Settings className="w-4 h-4 mr-2" />
                Configuración
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Filtros */}
      <Card className="bg-white shadow-sm">
        <div className="p-6">
          <div className="flex items-center gap-4">
            <label className="text-sm font-medium text-gray-700">Filtrar por estado:</label>
            <Select
              value={filtroEstado || ''}
              onChange={(e) => setFiltroEstado(e.target.value ? e.target.value as EstadoListaEspera : undefined)}
              options={[
                { value: '', label: 'Todos' },
                { value: 'activa', label: 'Activas' },
                { value: 'notificada', label: 'Notificadas' },
                { value: 'asignada', label: 'Asignadas' },
                { value: 'cancelada', label: 'Canceladas' },
                { value: 'expirada', label: 'Expiradas' },
              ]}
            />
          </div>
        </div>
      </Card>

      {/* Lista de Espera */}
      <Card className="bg-white shadow-sm">
        <div className="p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Clientes en Lista de Espera</h2>
          <Table
            data={listaEspera}
            columns={columnasListaEspera}
          />
        </div>
      </Card>

      {/* Horarios Populares */}
      <Card className="bg-white shadow-sm">
        <div className="p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
            <TrendingUp className="w-5 h-5 mr-2" />
            Horarios Populares
          </h2>
          <Table
            data={horariosPopulares}
            columns={columnasHorariosPopulares}
          />
        </div>
      </Card>

      {/* Notificaciones */}
      {notificaciones.length > 0 && (
        <Card className="bg-white shadow-sm">
          <div className="p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <Bell className="w-5 h-5 mr-2" />
              Notificaciones de Slots Liberados
            </h2>
            <Table
              data={notificaciones}
              columns={columnasNotificaciones}
            />
          </div>
        </Card>
      )}

      {/* Modal Agregar Cliente */}
      <Modal
        isOpen={mostrarModalAgregar}
        onClose={() => setMostrarModalAgregar(false)}
        title="Agregar Cliente a Lista de Espera"
        size="md"
        footer={
          <div className="flex space-x-3">
            <Button
              variant="secondary"
              onClick={() => setMostrarModalAgregar(false)}
            >
              Cancelar
            </Button>
            <Button
              variant="primary"
              onClick={handleAgregarCliente}
            >
              Agregar
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Cliente
            </label>
            <ClienteAutocomplete
              value={nuevoCliente.clienteId}
              onChange={(id, nombre) => {
                setNuevoCliente({
                  ...nuevoCliente,
                  clienteId: id || '',
                  clienteNombre: nombre || '',
                });
              }}
              label=""
              placeholder="Seleccionar cliente"
              role="entrenador"
              userId={user?.id}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Día de la Semana
            </label>
            <Select
              value={nuevoCliente.diaSemana.toString()}
              onChange={(e) => setNuevoCliente({ ...nuevoCliente, diaSemana: parseInt(e.target.value) })}
              options={diasSemana.map(dia => ({
                value: dia.value.toString(),
                label: dia.label,
              }))}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Hora Inicio
              </label>
              <Input
                type="time"
                value={nuevoCliente.horaInicio}
                onChange={(e) => setNuevoCliente({ ...nuevoCliente, horaInicio: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Hora Fin
              </label>
              <Input
                type="time"
                value={nuevoCliente.horaFin}
                onChange={(e) => setNuevoCliente({ ...nuevoCliente, horaFin: e.target.value })}
              />
            </div>
          </div>
        </div>
      </Modal>

      {/* Modal Configuración */}
      <Modal
        isOpen={mostrarModalConfig}
        onClose={() => setMostrarModalConfig(false)}
        title="Configuración de Lista de Espera"
        size="md"
        footer={
          <div className="flex space-x-3">
            <Button
              variant="secondary"
              onClick={() => setMostrarModalConfig(false)}
            >
              Cancelar
            </Button>
            <Button
              variant="primary"
              onClick={handleActualizarConfig}
            >
              Guardar
            </Button>
          </div>
        }
      >
        {configuracion && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700">
                Activar Lista de Espera
              </label>
              <Switch
                checked={configuracion.activo}
                onChange={(checked) => setConfiguracion({ ...configuracion, activo: checked })}
              />
            </div>
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700">
                Notificación Automática
              </label>
              <Switch
                checked={configuracion.notificacionAutomatica}
                onChange={(checked) => setConfiguracion({ ...configuracion, notificacionAutomatica: checked })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tiempo de Respuesta (horas)
              </label>
              <Input
                type="number"
                value={configuracion.tiempoRespuestaHoras}
                onChange={(e) => setConfiguracion({ 
                  ...configuracion, 
                  tiempoRespuestaHoras: parseInt(e.target.value) 
                })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Método de Notificación
              </label>
              <Select
                value={configuracion.metodoNotificacion}
                onChange={(e) => setConfiguracion({ 
                  ...configuracion, 
                  metodoNotificacion: e.target.value as any 
                })}
                options={[
                  { value: 'email', label: 'Email' },
                  { value: 'sms', label: 'SMS' },
                  { value: 'whatsapp', label: 'WhatsApp' },
                  { value: 'push', label: 'Push' },
                ]}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Máximo de Entradas por Cliente
              </label>
              <Input
                type="number"
                value={configuracion.maxEntradasPorCliente}
                onChange={(e) => setConfiguracion({ 
                  ...configuracion, 
                  maxEntradasPorCliente: parseInt(e.target.value) 
                })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Días de Validez
              </label>
              <Input
                type="number"
                value={configuracion.diasValidez}
                onChange={(e) => setConfiguracion({ 
                  ...configuracion, 
                  diasValidez: parseInt(e.target.value) 
                })}
              />
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};


