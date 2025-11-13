import React, { useState, useEffect } from 'react';
import { Card, Button, Modal, Badge } from '../../../components/componentsreutilizables';
import {
  Bell,
  CheckCircle2,
  AlertCircle,
  Loader2,
  X,
  Link2,
  Settings,
  Scale,
  Ruler,
  Activity,
  Moon,
  FileText,
  ExternalLink,
} from 'lucide-react';
import type {
  NotificacionSincronizacionDatos,
  DatosSincronizadosCliente,
  ConfiguracionNotificacionesSincronizacion,
  TipoDatoSincronizado,
  Dieta,
} from '../types';
import {
  getNotificacionesSincronizacion,
  marcarNotificacionLeida,
  vincularDatosAPlan,
  getConfiguracionNotificacionesSincronizacion,
  guardarConfiguracionNotificacionesSincronizacion,
  getDatosSincronizadosCliente,
} from '../api/notificacionesSincronizacion';
import { useAuth } from '../../../context/AuthContext';

interface NotificacionesSincronizacionDatosProps {
  dieta?: Dieta;
  onDatosVinculados?: (datosId: string) => void;
}

export const NotificacionesSincronizacionDatos: React.FC<NotificacionesSincronizacionDatosProps> = ({
  dieta,
  onDatosVinculados,
}) => {
  const { user } = useAuth();
  const [mostrarModal, setMostrarModal] = useState(false);
  const [notificaciones, setNotificaciones] = useState<NotificacionSincronizacionDatos[]>([]);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mostrarConfiguracion, setMostrarConfiguracion] = useState(false);
  const [configuracion, setConfiguracion] = useState<ConfiguracionNotificacionesSincronizacion | null>(null);
  const [notificacionSeleccionada, setNotificacionSeleccionada] = useState<NotificacionSincronizacionDatos | null>(null);

  useEffect(() => {
    if (mostrarModal && dieta) {
      cargarNotificaciones();
      cargarConfiguracion();
    }
  }, [mostrarModal, dieta]);

  const cargarNotificaciones = async () => {
    if (!dieta) return;
    setCargando(true);
    try {
      const data = await getNotificacionesSincronizacion(dieta.id, false); // Solo no leídas
      setNotificaciones(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error cargando notificaciones');
    } finally {
      setCargando(false);
    }
  };

  const cargarConfiguracion = async () => {
    if (!user?.id) return;
    try {
      const data = await getConfiguracionNotificacionesSincronizacion(user.id);
      setConfiguracion(data);
    } catch (err) {
      console.error('Error cargando configuración:', err);
    }
  };

  const handleMarcarLeida = async (notificacion: NotificacionSincronizacionDatos) => {
    try {
      await marcarNotificacionLeida(notificacion.id);
      await cargarNotificaciones();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error marcando notificación');
    }
  };

  const handleVincularAPlan = async (notificacion: NotificacionSincronizacionDatos) => {
    if (!dieta) return;

    try {
      await vincularDatosAPlan(notificacion.datosSincronizadosId, dieta.id);
      setNotificacionSeleccionada(null);
      if (onDatosVinculados) {
        onDatosVinculados(notificacion.datosSincronizadosId);
      }
      await cargarNotificaciones();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error vinculando datos al plan');
    }
  };

  const getTipoIcon = (tipo: TipoDatoSincronizado) => {
    switch (tipo) {
      case 'peso':
        return <Scale size={20} className="text-blue-500" />;
      case 'medidas':
        return <Ruler size={20} className="text-green-500" />;
      case 'analisis-clinicos':
        return <FileText size={20} className="text-red-500" />;
      case 'actividad':
        return <Activity size={20} className="text-purple-500" />;
      case 'sueño':
        return <Moon size={20} className="text-indigo-500" />;
      default:
        return <Bell size={20} className="text-gray-500" />;
    }
  };

  const getTipoLabel = (tipo: TipoDatoSincronizado) => {
    switch (tipo) {
      case 'peso':
        return 'Peso';
      case 'medidas':
        return 'Medidas';
      case 'analisis-clinicos':
        return 'Análisis Clínicos';
      case 'actividad':
        return 'Actividad';
      case 'sueño':
        return 'Sueño';
      default:
        return 'Otro';
    }
  };

  const getPrioridadColor = (prioridad: 'alta' | 'media' | 'baja') => {
    switch (prioridad) {
      case 'alta':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'media':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'baja':
        return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  const renderDetallesDatos = (datos: DatosSincronizadosCliente) => {
    switch (datos.tipo) {
      case 'peso':
        return datos.peso ? (
          <div className="space-y-1">
            <p>
              <strong>Peso:</strong> {datos.peso.valor} {datos.peso.unidad}
            </p>
            {datos.peso.fuente && (
              <p className="text-sm text-gray-600">
                <strong>Fuente:</strong> {datos.peso.fuente}
              </p>
            )}
            <p className="text-sm text-gray-600">
              <strong>Fecha:</strong> {new Date(datos.fecha).toLocaleDateString()}
            </p>
          </div>
        ) : null;

      case 'medidas':
        return datos.medidas ? (
          <div className="space-y-1">
            {datos.medidas.cintura && <p><strong>Cintura:</strong> {datos.medidas.cintura} cm</p>}
            {datos.medidas.cadera && <p><strong>Cadera:</strong> {datos.medidas.cadera} cm</p>}
            {datos.medidas.pecho && <p><strong>Pecho:</strong> {datos.medidas.pecho} cm</p>}
            {datos.medidas.brazo && <p><strong>Brazo:</strong> {datos.medidas.brazo} cm</p>}
            {datos.medidas.muslo && <p><strong>Muslo:</strong> {datos.medidas.muslo} cm</p>}
            {datos.medidas.fuente && (
              <p className="text-sm text-gray-600">
                <strong>Fuente:</strong> {datos.medidas.fuente}
              </p>
            )}
            <p className="text-sm text-gray-600">
              <strong>Fecha:</strong> {new Date(datos.fecha).toLocaleDateString()}
            </p>
          </div>
        ) : null;

      case 'analisis-clinicos':
        return datos.analisisClinicos && datos.analisisClinicos.length > 0 ? (
          <div className="space-y-2">
            {datos.analisisClinicos.map((analisis, index) => (
              <div key={index} className="border-l-2 border-red-300 pl-3">
                <p>
                  <strong>{analisis.tipo}:</strong> {analisis.valor} {analisis.unidad}
                </p>
                {analisis.rangoNormal && (
                  <p className="text-sm text-gray-600">
                    Rango normal: {analisis.rangoNormal.minimo} - {analisis.rangoNormal.maximo} {analisis.unidad}
                    {(analisis.valor < analisis.rangoNormal.minimo || analisis.valor > analisis.rangoNormal.maximo) && (
                      <Badge variant="error" className="ml-2">Fuera de rango</Badge>
                    )}
                  </p>
                )}
                {analisis.laboratorio && (
                  <p className="text-sm text-gray-600">
                    <strong>Laboratorio:</strong> {analisis.laboratorio}
                  </p>
                )}
                <p className="text-sm text-gray-600">
                  <strong>Fecha:</strong> {new Date(analisis.fechaAnalisis).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        ) : null;

      default:
        return (
          <p className="text-sm text-gray-600">
            Datos sincronizados el {new Date(datos.fechaSincronizacion).toLocaleString()}
          </p>
        );
    }
  };

  const notificacionesNoLeidas = notificaciones.filter(n => !n.leida).length;

  return (
    <>
      <Button
        onClick={() => setMostrarModal(true)}
        variant="outline"
        className="flex items-center gap-2 relative"
      >
        <Bell size={18} />
        Sincronización de Datos
        {notificacionesNoLeidas > 0 && (
          <Badge variant="error" className="absolute -top-2 -right-2">
            {notificacionesNoLeidas}
          </Badge>
        )}
      </Button>

      <Modal
        isOpen={mostrarModal}
        onClose={() => {
          setMostrarModal(false);
          setNotificacionSeleccionada(null);
        }}
        title="Notificaciones de Sincronización de Datos"
        size="lg"
      >
        <div className="space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-600">
              Recibe avisos cuando el cliente sincronice nuevos datos (peso, medidas, análisis clínicos) y linkéalos al plan.
            </p>
            <Button
              onClick={() => setMostrarConfiguracion(!mostrarConfiguracion)}
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              <Settings size={16} />
              Configuración
            </Button>
          </div>

          {cargando ? (
            <div className="flex justify-center py-8">
              <Loader2 className="animate-spin" size={24} />
            </div>
          ) : notificaciones.length === 0 ? (
            <Card className="p-8 text-center text-gray-500">
              <Bell size={48} className="mx-auto mb-4 text-gray-400" />
              <p>No hay notificaciones nuevas</p>
              <p className="text-sm mt-2">Se te notificará cuando el cliente sincronice nuevos datos</p>
            </Card>
          ) : (
            <div className="space-y-3">
              {notificaciones.map((notificacion) => (
                <Card
                  key={notificacion.id}
                  className={`p-4 ${!notificacion.leida ? 'border-l-4 border-blue-500' : ''}`}
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-1">{getTipoIcon(notificacion.tipo)}</div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold">{notificacion.titulo}</h3>
                        <Badge className={getPrioridadColor(notificacion.prioridad)}>
                          {notificacion.prioridad}
                        </Badge>
                        {notificacion.vinculadoAPlan && (
                          <Badge variant="success">Vinculado</Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mb-3">{notificacion.mensaje}</p>
                      
                      <div className="bg-gray-50 p-3 rounded mb-3">
                        {renderDetallesDatos(notificacion.datos)}
                      </div>

                      <div className="flex items-center gap-2">
                        {!notificacion.vinculadoAPlan && (
                          <Button
                            onClick={() => handleVincularAPlan(notificacion)}
                            variant="primary"
                            size="sm"
                            className="flex items-center gap-1"
                          >
                            <Link2 size={16} />
                            Vincular al Plan
                          </Button>
                        )}
                        {!notificacion.leida && (
                          <Button
                            onClick={() => handleMarcarLeida(notificacion)}
                            variant="outline"
                            size="sm"
                            className="flex items-center gap-1"
                          >
                            <CheckCircle2 size={16} />
                            Marcar como Leída
                          </Button>
                        )}
                        <Button
                          onClick={() => setNotificacionSeleccionada(notificacion)}
                          variant="outline"
                          size="sm"
                        >
                          Ver Detalles
                        </Button>
                      </div>

                      <p className="text-xs text-gray-500 mt-2">
                        {new Date(notificacion.creadoEn).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}

          {mostrarConfiguracion && configuracion && (
            <Card className="p-4 mt-4">
              <h3 className="font-semibold mb-3">Configuración de Notificaciones</h3>
              <div className="space-y-3">
                <div>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={configuracion.notificaciones.email}
                      onChange={async (e) => {
                        const nuevaConfig = {
                          ...configuracion,
                          notificaciones: {
                            ...configuracion.notificaciones,
                            email: e.target.checked,
                          },
                        };
                        setConfiguracion(nuevaConfig);
                        await guardarConfiguracionNotificacionesSincronizacion(nuevaConfig);
                      }}
                    />
                    Notificaciones por Email
                  </label>
                </div>
                <div>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={configuracion.notificaciones.push}
                      onChange={async (e) => {
                        const nuevaConfig = {
                          ...configuracion,
                          notificaciones: {
                            ...configuracion.notificaciones,
                            push: e.target.checked,
                          },
                        };
                        setConfiguracion(nuevaConfig);
                        await guardarConfiguracionNotificacionesSincronizacion(nuevaConfig);
                      }}
                    />
                    Notificaciones Push
                  </label>
                </div>
                <div>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={configuracion.notificaciones.inApp}
                      onChange={async (e) => {
                        const nuevaConfig = {
                          ...configuracion,
                          notificaciones: {
                            ...configuracion.notificaciones,
                            inApp: e.target.checked,
                          },
                        };
                        setConfiguracion(nuevaConfig);
                        await guardarConfiguracionNotificacionesSincronizacion(nuevaConfig);
                      }}
                    />
                    Notificaciones en la App
                  </label>
                </div>
                <div>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={configuracion.autoVincularPlan}
                      onChange={async (e) => {
                        const nuevaConfig = {
                          ...configuracion,
                          autoVincularPlan: e.target.checked,
                        };
                        setConfiguracion(nuevaConfig);
                        await guardarConfiguracionNotificacionesSincronizacion(nuevaConfig);
                      }}
                    />
                    Auto-vincular datos al plan
                  </label>
                </div>
              </div>
            </Card>
          )}
        </div>

        {/* Modal de detalles */}
        {notificacionSeleccionada && (
          <Modal
            isOpen={!!notificacionSeleccionada}
            onClose={() => setNotificacionSeleccionada(null)}
            title="Detalles de la Notificación"
            size="md"
          >
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">{notificacionSeleccionada.titulo}</h3>
                <p className="text-sm text-gray-600">{notificacionSeleccionada.mensaje}</p>
              </div>

              <div className="bg-gray-50 p-4 rounded">
                <h4 className="font-semibold mb-2">Datos Sincronizados</h4>
                {renderDetallesDatos(notificacionSeleccionada.datos)}
              </div>

              {notificacionSeleccionada.accionRequerida && (
                <div className="bg-yellow-50 border border-yellow-200 p-3 rounded">
                  <p className="text-sm">
                    <strong>Acción requerida:</strong> {notificacionSeleccionada.accionRequerida}
                  </p>
                </div>
              )}

              <div className="flex justify-end gap-2">
                {!notificacionSeleccionada.vinculadoAPlan && (
                  <Button
                    onClick={() => handleVincularAPlan(notificacionSeleccionada)}
                    variant="primary"
                  >
                    Vincular al Plan
                  </Button>
                )}
                <Button
                  onClick={() => setNotificacionSeleccionada(null)}
                  variant="outline"
                >
                  Cerrar
                </Button>
              </div>
            </div>
          </Modal>
        )}
      </Modal>
    </>
  );
};

