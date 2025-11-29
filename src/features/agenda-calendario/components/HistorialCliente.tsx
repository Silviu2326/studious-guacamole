import React, { useState, useEffect } from 'react';
import { Calendar, Clock, CheckCircle, XCircle, AlertCircle, Filter, TrendingUp, Users, FileText } from 'lucide-react';
import { Card, Button, Input, Select, Badge } from '../../../components/componentsreutilizables';
import { getHistorialSesionesCliente, SesionHistorial, EstadisticasCliente, FiltroHistorial } from '../api/sesiones';
import { TipoCita, EstadoCita } from '../types';
import { useAuth } from '../../../context/AuthContext';

interface HistorialClienteProps {
  clienteId: string;
  clienteNombre?: string;
}

const TIPOS_SESION: Array<{ value: TipoCita | ''; label: string }> = [
  { value: '', label: 'Todos los tipos' },
  { value: 'sesion-1-1', label: 'Sesión 1:1' },
  { value: 'videollamada', label: 'Videollamada' },
  { value: 'evaluacion', label: 'Evaluación' },
  { value: 'fisioterapia', label: 'Fisioterapia' },
  { value: 'mantenimiento', label: 'Mantenimiento' },
  { value: 'otro', label: 'Otro' },
];

const ESTADOS_SESION: Array<{ value: EstadoCita | ''; label: string }> = [
  { value: '', label: 'Todos los estados' },
  { value: 'pendiente', label: 'Pendiente' },
  { value: 'confirmada', label: 'Confirmada' },
  { value: 'en-curso', label: 'En curso' },
  { value: 'completada', label: 'Completada' },
  { value: 'cancelada', label: 'Cancelada' },
];

const ASISTENCIA_OPCIONES: Array<{ value: 'asistio' | 'falto' | 'cancelado' | ''; label: string }> = [
  { value: '', label: 'Todas' },
  { value: 'asistio', label: 'Asistió' },
  { value: 'falto', label: 'Faltó' },
  { value: 'cancelado', label: 'Canceló' },
];

export const HistorialCliente: React.FC<HistorialClienteProps> = ({ clienteId, clienteNombre }) => {
  const { user } = useAuth();
  const [sesiones, setSesiones] = useState<SesionHistorial[]>([]);
  const [estadisticas, setEstadisticas] = useState<EstadisticasCliente | null>(null);
  const [loading, setLoading] = useState(false);
  const [filtros, setFiltros] = useState<FiltroHistorial>({});
  const [mostrarFiltros, setMostrarFiltros] = useState(false);
  const [fechaInicioFiltro, setFechaInicioFiltro] = useState('');
  const [fechaFinFiltro, setFechaFinFiltro] = useState('');

  useEffect(() => {
    cargarHistorial();
  }, [clienteId, filtros]);

  const cargarHistorial = async () => {
    setLoading(true);
    try {
      const resultado = await getHistorialSesionesCliente(clienteId, filtros, user?.id);
      setSesiones(resultado.sesiones);
      setEstadisticas(resultado.estadisticas);
    } catch (error) {
      console.error('Error cargando historial:', error);
    } finally {
      setLoading(false);
    }
  };

  const aplicarFiltros = () => {
    const nuevosFiltros: FiltroHistorial = {};
    
    if (fechaInicioFiltro) {
      nuevosFiltros.fechaInicio = new Date(fechaInicioFiltro);
    }
    if (fechaFinFiltro) {
      nuevosFiltros.fechaFin = new Date(fechaFinFiltro);
      nuevosFiltros.fechaFin.setHours(23, 59, 59, 999); // Fin del día
    }
    
    setFiltros(nuevosFiltros);
    setMostrarFiltros(false);
  };

  const limpiarFiltros = () => {
    setFechaInicioFiltro('');
    setFechaFinFiltro('');
    setFiltros({});
    setMostrarFiltros(false);
  };

  const getVariantEstado = (estado: string): 'green' | 'blue' | 'yellow' | 'red' | 'purple' | 'gray' => {
    switch (estado) {
      case 'completada':
        return 'green';
      case 'confirmada':
        return 'blue';
      case 'pendiente':
        return 'yellow';
      case 'cancelada':
        return 'red';
      case 'en-curso':
        return 'purple';
      default:
        return 'gray';
    }
  };

  const getIconoAsistencia = (asistencia?: string) => {
    switch (asistencia) {
      case 'asistio':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'falto':
        return <XCircle className="w-5 h-5 text-red-600" />;
      case 'cancelado':
        return <AlertCircle className="w-5 h-5 text-orange-600" />;
      default:
        return null;
    }
  };

  const getLabelAsistencia = (asistencia?: string): string => {
    switch (asistencia) {
      case 'asistio':
        return 'Asistió';
      case 'falto':
        return 'Faltó';
      case 'cancelado':
        return 'Canceló';
      default:
        return 'Sin registrar';
    }
  };

  const getTipoLabel = (tipo: string): string => {
    const tipoEncontrado = TIPOS_SESION.find(t => t.value === tipo);
    return tipoEncontrado?.label || tipo;
  };

  const esPasada = (fecha: Date): boolean => {
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    const fechaSesion = new Date(fecha);
    fechaSesion.setHours(0, 0, 0, 0);
    return fechaSesion < hoy;
  };

  const esPresente = (fechaInicio: Date, fechaFin: Date): boolean => {
    const hoy = new Date();
    const inicio = new Date(fechaInicio);
    const fin = new Date(fechaFin);
    return inicio <= hoy && fin >= hoy;
  };

  const esFutura = (fecha: Date): boolean => {
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    const fechaSesion = new Date(fecha);
    fechaSesion.setHours(0, 0, 0, 0);
    return fechaSesion > hoy;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-white shadow-sm">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Historial de Sesiones
              </h2>
              {clienteNombre && (
                <p className="text-gray-600 mt-1">Cliente: {clienteNombre}</p>
              )}
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setMostrarFiltros(!mostrarFiltros)}
            >
              <Filter className="w-4 h-4 mr-2" />
              {mostrarFiltros ? 'Ocultar' : 'Mostrar'} Filtros
            </Button>
          </div>

          {/* Estadísticas */}
          {estadisticas && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Sesiones</p>
                    <p className="text-2xl font-bold text-gray-900">{estadisticas.totalSesiones}</p>
                  </div>
                  <Calendar className="w-8 h-8 text-blue-600" />
                </div>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Tasa de Asistencia</p>
                    <p className="text-2xl font-bold text-gray-900">{estadisticas.tasaAsistencia}%</p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-green-600" />
                </div>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Asistidas</p>
                    <p className="text-2xl font-bold text-gray-900">{estadisticas.sesionesAsistidas}</p>
                  </div>
                  <CheckCircle className="w-8 h-8 text-purple-600" />
                </div>
              </div>
              <div className="bg-red-50 p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Canceladas</p>
                    <p className="text-2xl font-bold text-gray-900">{estadisticas.sesionesCanceladas}</p>
                  </div>
                  <XCircle className="w-8 h-8 text-red-600" />
                </div>
              </div>
            </div>
          )}

          {/* Filtros */}
          {mostrarFiltros && (
            <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Input
                    type="date"
                    label="Fecha inicio"
                    value={fechaInicioFiltro}
                    onChange={(e) => setFechaInicioFiltro(e.target.value)}
                  />
                </div>
                <div>
                  <Input
                    type="date"
                    label="Fecha fin"
                    value={fechaFinFiltro}
                    onChange={(e) => setFechaFinFiltro(e.target.value)}
                  />
                </div>
                <div className="flex items-end gap-2">
                  <Button variant="primary" onClick={aplicarFiltros}>
                    Aplicar
                  </Button>
                  <Button variant="ghost" onClick={limpiarFiltros}>
                    Limpiar
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Lista de Sesiones */}
      <Card className="bg-white shadow-sm">
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Sesiones ({sesiones.length})
          </h3>

          {loading ? (
            <div className="text-center py-8">
              <div className="text-gray-600">Cargando historial...</div>
            </div>
          ) : sesiones.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No hay sesiones registradas para este cliente</p>
            </div>
          ) : (
            <div className="space-y-4">
              {sesiones.map((sesion) => {
                const esPasadaSesion = esPasada(sesion.fechaFin);
                const esPresenteSesion = esPresente(sesion.fechaInicio, sesion.fechaFin);
                const esFuturaSesion = esFutura(sesion.fechaInicio);

                return (
                  <div
                    key={sesion.id}
                    className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <Badge variant={getVariantEstado(sesion.estado)}>
                            {sesion.estado}
                          </Badge>
                          <span className="text-sm font-medium text-gray-700">
                            {getTipoLabel(sesion.tipo)}
                          </span>
                          {esPasadaSesion && (
                            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                              Pasada
                            </span>
                          )}
                          {esPresenteSesion && (
                            <span className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded">
                              En curso
                            </span>
                          )}
                          {esFuturaSesion && (
                            <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded">
                              Futura
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            <span>
                              {new Date(sesion.fechaInicio).toLocaleDateString('es-ES', {
                                weekday: 'long',
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                              })}
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            <span>
                              {new Date(sesion.fechaInicio).toLocaleTimeString('es-ES', {
                                hour: '2-digit',
                                minute: '2-digit',
                              })}{' '}
                              -{' '}
                              {new Date(sesion.fechaFin).toLocaleTimeString('es-ES', {
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </span>
                          </div>
                        </div>

                        {sesion.notas && (
                          <div className="flex items-start gap-2 mt-2">
                            <FileText className="w-4 h-4 text-gray-400 mt-0.5" />
                            <p className="text-sm text-gray-600 italic">{sesion.notas}</p>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        {getIconoAsistencia(sesion.asistencia)}
                        <span className="text-sm text-gray-600">
                          {getLabelAsistencia(sesion.asistencia)}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

