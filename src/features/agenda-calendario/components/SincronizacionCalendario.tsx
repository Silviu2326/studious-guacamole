import React, { useState, useEffect } from 'react';
import { Calendar, Link, Unlink, RefreshCw, AlertCircle, CheckCircle, Settings, ExternalLink } from 'lucide-react';
import { Card, Button, Modal, Switch, Input, Select } from '../../../components/componentsreutilizables';
import { useAuth } from '../../../context/AuthContext';
import {
  ConexionCalendario,
  ConfiguracionSincronizacion,
  TipoCalendarioExterno,
  EventoCalendarioExterno,
} from '../types';
import {
  getConexionesCalendario,
  conectarGoogleCalendar,
  conectarOutlookCalendar,
  desconectarCalendario,
  getCalendariosDisponibles,
  guardarConexionCalendario,
  sincronizarEventos,
  getConfiguracionSincronizacion,
  guardarConfiguracionSincronizacion,
} from '../api/sincronizacionCalendario';

export const SincronizacionCalendario: React.FC = () => {
  const { user } = useAuth();
  const [conexiones, setConexiones] = useState<ConexionCalendario[]>([]);
  const [configuracion, setConfiguracion] = useState<ConfiguracionSincronizacion | null>(null);
  const [loading, setLoading] = useState(false);
  const [mostrarModalConfiguracion, setMostrarModalConfiguracion] = useState(false);
  const [mostrarModalCalendarios, setMostrarModalCalendarios] = useState(false);
  const [conexionSeleccionada, setConexionSeleccionada] = useState<ConexionCalendario | null>(null);
  const [calendariosDisponibles, setCalendariosDisponibles] = useState<Array<{ id: string; nombre: string; descripcion?: string }>>([]);
  const [error, setError] = useState<string | null>(null);
  const [exito, setExito] = useState<string | null>(null);

  useEffect(() => {
    cargarDatos();
  }, [user?.id]);

  const cargarDatos = async () => {
    setLoading(true);
    try {
      const [conexionesData, configData] = await Promise.all([
        getConexionesCalendario(user?.id),
        getConfiguracionSincronizacion(user?.id),
      ]);
      setConexiones(conexionesData);
      setConfiguracion(configData);
    } catch (error) {
      setError('Error al cargar las conexiones de calendario');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleConectarGoogle = async () => {
    setLoading(true);
    setError(null);
    try {
      const { authUrl } = await conectarGoogleCalendar(user?.id);
      // En producción, esto abriría una ventana popup o redirigiría a la URL de OAuth
      // Por ahora, mostramos un mensaje
      window.open(authUrl, '_blank', 'width=600,height=700');
      setExito('Redirigiendo a Google para autorizar el acceso...');
      setTimeout(() => {
        setExito(null);
        cargarDatos(); // Recargar después de un momento (en producción, esto se haría con un webhook)
      }, 2000);
    } catch (error) {
      setError('Error al conectar con Google Calendar');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleConectarOutlook = async () => {
    setLoading(true);
    setError(null);
    try {
      const { authUrl } = await conectarOutlookCalendar(user?.id);
      // En producción, esto abriría una ventana popup o redirigiría a la URL de OAuth
      window.open(authUrl, '_blank', 'width=600,height=700');
      setExito('Redirigiendo a Microsoft para autorizar el acceso...');
      setTimeout(() => {
        setExito(null);
        cargarDatos();
      }, 2000);
    } catch (error) {
      setError('Error al conectar con Outlook Calendar');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDesconectar = async (conexionId: string) => {
    if (!confirm('¿Estás seguro de que quieres desconectar este calendario?')) {
      return;
    }

    setLoading(true);
    setError(null);
    try {
      await desconectarCalendario(conexionId);
      setExito('Calendario desconectado correctamente');
      setTimeout(() => setExito(null), 3000);
      cargarDatos();
    } catch (error) {
      setError('Error al desconectar el calendario');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSincronizar = async (conexionId: string) => {
    setLoading(true);
    setError(null);
    try {
      const fechaInicio = new Date();
      const fechaFin = new Date();
      fechaFin.setMonth(fechaFin.getMonth() + 1);
      
      await sincronizarEventos(conexionId, fechaInicio, fechaFin);
      setExito('Sincronización completada');
      setTimeout(() => setExito(null), 3000);
      cargarDatos();
    } catch (error) {
      setError('Error al sincronizar eventos');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleConfigurarConexion = async (conexion: ConexionCalendario) => {
    setConexionSeleccionada(conexion);
    setMostrarModalCalendarios(true);
    try {
      const calendarios = await getCalendariosDisponibles(conexion.id);
      setCalendariosDisponibles(calendarios);
    } catch (error) {
      setError('Error al cargar calendarios disponibles');
      console.error(error);
    }
  };

  const handleGuardarConfiguracion = async () => {
    if (!configuracion) return;

    setLoading(true);
    setError(null);
    try {
      await guardarConfiguracionSincronizacion(configuracion);
      setExito('Configuración guardada correctamente');
      setTimeout(() => setExito(null), 3000);
      setMostrarModalConfiguracion(false);
      cargarDatos();
    } catch (error) {
      setError('Error al guardar la configuración');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleActualizarConexion = async (conexion: ConexionCalendario, updates: Partial<ConexionCalendario>) => {
    setLoading(true);
    setError(null);
    try {
      const conexionActualizada = await guardarConexionCalendario({
        ...conexion,
        ...updates,
      });
      setConexiones(prev => prev.map(c => c.id === conexion.id ? conexionActualizada : c));
      setExito('Configuración actualizada');
      setTimeout(() => setExito(null), 3000);
    } catch (error) {
      setError('Error al actualizar la configuración');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const getIconoTipo = (tipo: TipoCalendarioExterno) => {
    return tipo === 'google' ? 'G' : 'O';
  };

  const getNombreTipo = (tipo: TipoCalendarioExterno) => {
    return tipo === 'google' ? 'Google Calendar' : 'Outlook Calendar';
  };

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case 'conectado':
        return 'text-green-600 bg-green-100';
      case 'error':
        return 'text-red-600 bg-red-100';
      case 'sincronizando':
        return 'text-blue-600 bg-blue-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="space-y-6">
      {/* Mensajes de error/éxito */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2 text-red-800">
          <AlertCircle className="w-5 h-5" />
          <span>{error}</span>
          <button onClick={() => setError(null)} className="ml-auto text-red-600 hover:text-red-800">
            ✕
          </button>
        </div>
      )}

      {exito && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg flex items-center space-x-2 text-green-800">
          <CheckCircle className="w-5 h-5" />
          <span>{exito}</span>
          <button onClick={() => setExito(null)} className="ml-auto text-green-600 hover:text-green-800">
            ✕
          </button>
        </div>
      )}

      {/* Configuración General */}
      <Card className="bg-white shadow-sm">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <Settings className="w-6 h-6 text-blue-600" />
              <h2 className="text-xl font-bold text-gray-900">Configuración de Sincronización</h2>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setMostrarModalConfiguracion(true)}
            >
              <Settings className="w-4 h-4 mr-2" />
              Configurar
            </Button>
          </div>

          {configuracion && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-700">Sincronización bidireccional</span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  configuracion.sincronizacionBidireccional
                    ? 'bg-green-100 text-green-800'
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {configuracion.sincronizacionBidireccional ? 'Activada' : 'Desactivada'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-700">Bloquear automáticamente eventos externos</span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  configuracion.bloquearAutomaticamente
                    ? 'bg-green-100 text-green-800'
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {configuracion.bloquearAutomaticamente ? 'Activado' : 'Desactivado'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-700">Intervalo de actualización</span>
                <span className="text-gray-900 font-medium">{configuracion.intervaloActualizacion} minutos</span>
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Conexiones de Calendario */}
      <Card className="bg-white shadow-sm">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <Calendar className="w-6 h-6 text-blue-600" />
              <h2 className="text-xl font-bold text-gray-900">Calendarios Conectados</h2>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="primary"
                size="sm"
                onClick={handleConectarGoogle}
                disabled={loading}
              >
                <Link className="w-4 h-4 mr-2" />
                Conectar Google
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={handleConectarOutlook}
                disabled={loading}
              >
                <Link className="w-4 h-4 mr-2" />
                Conectar Outlook
              </Button>
            </div>
          </div>

          {loading && conexiones.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-gray-600">Cargando conexiones...</div>
            </div>
          ) : conexiones.length === 0 ? (
            <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
              <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-4">No tienes calendarios conectados</p>
              <p className="text-sm text-gray-500 mb-6">
                Conecta tu Google Calendar o Outlook para sincronizar eventos automáticamente
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {conexiones.map((conexion) => (
                <div
                  key={conexion.id}
                  className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg ${
                        conexion.tipo === 'google' ? 'bg-blue-500' : 'bg-orange-500'
                      }`}>
                        {getIconoTipo(conexion.tipo)}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{conexion.nombreCalendario}</h3>
                        <p className="text-sm text-gray-600">{getNombreTipo(conexion.tipo)}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getEstadoColor(conexion.estado)}`}>
                            {conexion.estado}
                          </span>
                          {conexion.ultimaSincronizacion && (
                            <span className="text-xs text-gray-500">
                              Última sync: {new Date(conexion.ultimaSincronizacion).toLocaleString('es-ES')}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={conexion.sincronizacionBidireccional}
                        onChange={(checked) => handleActualizarConexion(conexion, { sincronizacionBidireccional: checked })}
                        label="Bidireccional"
                      />
                      <Switch
                        checked={conexion.bloquearAutomaticamente}
                        onChange={(checked) => handleActualizarConexion(conexion, { bloquearAutomaticamente: checked })}
                        label="Bloquear auto"
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleSincronizar(conexion.id)}
                        disabled={loading}
                      >
                        <RefreshCw className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleConfigurarConexion(conexion)}
                      >
                        <Settings className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDesconectar(conexion.id)}
                        disabled={loading}
                      >
                        <Unlink className="w-4 h-4 text-red-600" />
                      </Button>
                    </div>
                  </div>
                  {conexion.errorSincronizacion && (
                    <div className="mt-3 p-2 bg-red-50 border border-red-200 rounded text-sm text-red-800">
                      <AlertCircle className="w-4 h-4 inline mr-2" />
                      {conexion.errorSincronizacion}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </Card>

      {/* Modal de Configuración */}
      {configuracion && (
        <Modal
          isOpen={mostrarModalConfiguracion}
          onClose={() => setMostrarModalConfiguracion(false)}
          title="Configuración de Sincronización"
          size="md"
          footer={
            <div className="flex space-x-3">
              <Button variant="secondary" onClick={() => setMostrarModalConfiguracion(false)}>
                Cancelar
              </Button>
              <Button variant="primary" onClick={handleGuardarConfiguracion}>
                Guardar
              </Button>
            </div>
          }
        >
          <div className="space-y-4">
            <div>
              <Switch
                label="Sincronización bidireccional"
                checked={configuracion.sincronizacionBidireccional}
                onChange={(checked) => setConfiguracion({ ...configuracion, sincronizacionBidireccional: checked })}
              />
              <p className="text-sm text-gray-600 mt-1 ml-12">Los eventos creados en tu agenda se sincronizarán automáticamente con el calendario externo</p>
            </div>
            <div>
              <Switch
                label="Bloquear automáticamente eventos externos"
                checked={configuracion.bloquearAutomaticamente}
                onChange={(checked) => setConfiguracion({ ...configuracion, bloquearAutomaticamente: checked })}
              />
              <p className="text-sm text-gray-600 mt-1 ml-12">Los eventos del calendario externo bloquearán automáticamente los horarios en tu agenda</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Intervalo de actualización (minutos)
              </label>
              <Input
                type="number"
                value={configuracion.intervaloActualizacion.toString()}
                onChange={(e) => setConfiguracion({ ...configuracion, intervaloActualizacion: parseInt(e.target.value) || 15 })}
                min={5}
                max={60}
              />
            </div>
          </div>
        </Modal>
      )}

      {/* Modal de Selección de Calendarios */}
      <Modal
        isOpen={mostrarModalCalendarios}
        onClose={() => setMostrarModalCalendarios(false)}
        title="Seleccionar Calendario"
        size="md"
        footer={
          <div className="flex space-x-3">
            <Button variant="secondary" onClick={() => setMostrarModalCalendarios(false)}>
              Cerrar
            </Button>
          </div>
        }
      >
        <div className="space-y-2">
          {calendariosDisponibles.map((calendario) => (
            <div
              key={calendario.id}
              className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
              onClick={async () => {
                if (conexionSeleccionada) {
                  await handleActualizarConexion(conexionSeleccionada, {
                    calendarioId: calendario.id,
                    nombreCalendario: calendario.nombre,
                  });
                  setMostrarModalCalendarios(false);
                }
              }}
            >
              <div className="font-medium text-gray-900">{calendario.nombre}</div>
              {calendario.descripcion && (
                <div className="text-sm text-gray-600">{calendario.descripcion}</div>
              )}
            </div>
          ))}
        </div>
      </Modal>
    </div>
  );
};

