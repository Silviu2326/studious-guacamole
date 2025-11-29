import { useEffect, useState } from 'react';
import { Card } from '../../../components/componentsreutilizables/Card';
import { Badge } from '../../../components/componentsreutilizables/Badge';
import { Button } from '../../../components/componentsreutilizables/Button';
import { Select } from '../../../components/componentsreutilizables/Select';
import {
  AlertTriangle,
  AlertCircle,
  XCircle,
  Activity,
  Ban,
  AlertOctagon,
  CheckCircle2,
  User,
  Filter,
  X,
  Zap,
  TrendingDown,
  MessageSquare,
  Dumbbell,
} from 'lucide-react';
import * as alertasApi from '../api/alertas-activas';
import * as alertasProactivasApi from '../api/alertas-proactivas';
import { AlertaActiva, NivelPrioridad, TipoAlerta } from '../types';
import type { AlertaProactiva, TipoRiesgoProactivo } from '../api/alertas-proactivas';
import * as contextoApi from '../api/contexto-cliente';

export function AlertasActivas() {
  const [clientes, setClientes] = useState<Array<{ id: string; nombre: string }>>([]);
  const [clienteSeleccionado, setClienteSeleccionado] = useState<string>('');
  const [alertas, setAlertas] = useState<AlertaActiva[]>([]);
  const [alertasProactivas, setAlertasProactivas] = useState<AlertaProactiva[]>([]);
  const [loading, setLoading] = useState(false);
  const [filtroTipo, setFiltroTipo] = useState<string>('todos');
  const [filtroPrioridad, setFiltroPrioridad] = useState<string>('todos');
  const [tipoVista, setTipoVista] = useState<'activas' | 'proactivas' | 'todas'>('todas');
  const [resumen, setResumen] = useState({
    total: 0,
    criticas: 0,
    altas: 0,
    medias: 0,
    bajas: 0,
  });
  const [resumenProactivas, setResumenProactivas] = useState({
    total: 0,
    porTipo: {} as Record<TipoRiesgoProactivo, number>,
    porPrioridad: { alta: 0, media: 0, baja: 0 },
  });

  useEffect(() => {
    loadClientes();
  }, []);

  useEffect(() => {
    if (clienteSeleccionado) {
      loadAlertas();
      loadResumen();
      loadAlertasProactivas();
      loadResumenProactivas();
    } else {
      loadAlertas();
      loadResumen();
      loadAlertasProactivas();
      loadResumenProactivas();
    }
  }, [clienteSeleccionado]);

  const loadClientes = async () => {
    try {
      const clientesData = await contextoApi.getClientes();
      setClientes(clientesData);
      if (clientesData.length > 0 && !clienteSeleccionado) {
        setClienteSeleccionado('todos');
      }
    } catch (error) {
      console.error('Error loading clientes:', error);
    }
  };

  const loadAlertas = async () => {
    setLoading(true);
    try {
      const clienteId = clienteSeleccionado === 'todos' ? undefined : clienteSeleccionado;
      const alertasData = await alertasApi.getAlertasActivas(clienteId);
      setAlertas(alertasData);
    } catch (error) {
      console.error('Error loading alertas:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadResumen = async () => {
    try {
      const clienteId = clienteSeleccionado === 'todos' ? undefined : clienteSeleccionado;
      const resumenData = await alertasApi.getResumenAlertas(clienteId);
      setResumen(resumenData);
    } catch (error) {
      console.error('Error loading resumen:', error);
    }
  };

  const loadAlertasProactivas = async () => {
    try {
      const clienteId = clienteSeleccionado === 'todos' ? undefined : clienteSeleccionado;
      const alertasData = await alertasProactivasApi.getAlertasProactivas(clienteId);
      setAlertasProactivas(alertasData);
    } catch (error) {
      console.error('Error loading alertas proactivas:', error);
    }
  };

  const loadResumenProactivas = async () => {
    try {
      const clienteId = clienteSeleccionado === 'todos' ? undefined : clienteSeleccionado;
      const resumenData = await alertasProactivasApi.getResumenAlertasProactivas(clienteId);
      setResumenProactivas(resumenData);
    } catch (error) {
      console.error('Error loading resumen proactivas:', error);
    }
  };

  const handleResolverAlerta = async (alertaId: string) => {
    try {
      await alertasApi.resolverAlerta(alertaId);
      await loadAlertas();
      await loadResumen();
    } catch (error) {
      console.error('Error resolving alerta:', error);
    }
  };

  const handleResolverAlertaProactiva = async (alertaId: string) => {
    try {
      await alertasProactivasApi.resolverAlertaProactiva(alertaId);
      await loadAlertasProactivas();
      await loadResumenProactivas();
    } catch (error) {
      console.error('Error resolving alerta proactiva:', error);
    }
  };

  const getPrioridadColor = (prioridad: NivelPrioridad): 'destructive' | 'secondary' | 'default' | 'outline' => {
    switch (prioridad) {
      case 'critica':
        return 'destructive';
      case 'alta':
        return 'secondary';
      case 'media':
        return 'default';
      case 'baja':
        return 'outline';
      default:
        return 'outline';
    }
  };

  const getPrioridadIcon = (prioridad: NivelPrioridad) => {
    switch (prioridad) {
      case 'critica':
        return <AlertOctagon className="w-4 h-4" />;
      case 'alta':
        return <AlertTriangle className="w-4 h-4" />;
      case 'media':
        return <AlertCircle className="w-4 h-4" />;
      case 'baja':
        return <Activity className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  const getTipoIcon = (tipo: TipoAlerta) => {
    switch (tipo) {
      case 'dolor':
        return <Activity className="w-5 h-5 text-red-500" />;
      case 'contraindicacion':
        return <Ban className="w-5 h-5 text-orange-500" />;
      case 'incidencia':
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      default:
        return <AlertCircle className="w-5 h-5" />;
    }
  };

  const getTipoLabel = (tipo: TipoAlerta): string => {
    switch (tipo) {
      case 'dolor':
        return 'Dolor';
      case 'contraindicacion':
        return 'Contraindicación';
      case 'incidencia':
        return 'Incidencia';
      default:
        return tipo;
    }
  };

  const getTipoRiesgoIcon = (tipo: TipoRiesgoProactivo) => {
    switch (tipo) {
      case 'sobrecarga-muscular':
        return <Dumbbell className="w-5 h-5 text-red-500" />;
      case 'baja-movilidad':
        return <Activity className="w-5 h-5 text-orange-500" />;
      case 'feedback-negativo':
        return <MessageSquare className="w-5 h-5 text-yellow-500" />;
      case 'fatiga-acumulada':
        return <TrendingDown className="w-5 h-5 text-purple-500" />;
      case 'desbalance-volumen':
        return <AlertCircle className="w-5 h-5 text-blue-500" />;
      default:
        return <AlertTriangle className="w-5 h-5" />;
    }
  };

  const getTipoRiesgoLabel = (tipo: TipoRiesgoProactivo): string => {
    switch (tipo) {
      case 'sobrecarga-muscular':
        return 'Sobrecarga Muscular';
      case 'baja-movilidad':
        return 'Baja Movilidad';
      case 'feedback-negativo':
        return 'Feedback Negativo';
      case 'fatiga-acumulada':
        return 'Fatiga Acumulada';
      case 'desbalance-volumen':
        return 'Desbalance de Volumen';
      default:
        return tipo;
    }
  };

  // Filtrar alertas
  const alertasFiltradas = alertas.filter(alerta => {
    if (filtroTipo !== 'todos' && alerta.tipo !== filtroTipo) return false;
    if (filtroPrioridad !== 'todos' && alerta.prioridad !== filtroPrioridad) return false;
    return true;
  });

  // Filtrar alertas proactivas
  const alertasProactivasFiltradas = alertasProactivas.filter(alerta => {
    if (filtroPrioridad !== 'todos' && alerta.prioridad !== filtroPrioridad) return false;
    return true;
  });

  if (loading) {
    return (
      <Card className="p-8 text-center">
        <div className="text-gray-500">Cargando alertas activas...</div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header con selector y resumen */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <Select
                label="Cliente"
                value={clienteSeleccionado}
                onChange={(v) => setClienteSeleccionado(v)}
                options={[
                  { label: 'Todos los clientes', value: 'todos' },
                  ...clientes.map((c) => ({ label: c.nombre, value: c.id })),
                ]}
              />
            </div>
          </div>
        </Card>

        {/* Resumen de alertas */}
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="w-5 h-5 text-orange-600" />
            <h2 className="text-xl font-semibold text-gray-900">Resumen de Alertas</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{resumen.total}</div>
              <div className="text-xs text-gray-600">Total</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">{resumen.criticas}</div>
              <div className="text-xs text-gray-600">Críticas</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{resumen.altas}</div>
              <div className="text-xs text-gray-600">Altas</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">{resumen.medias}</div>
              <div className="text-xs text-gray-600">Medias</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{resumen.bajas}</div>
              <div className="text-xs text-gray-600">Bajas</div>
            </div>
          </div>
        </Card>
      </div>

      {/* Selector de tipo de vista */}
      <Card className="p-4">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-700">Vista:</span>
          <div className="flex gap-2">
            <Button
              variant={tipoVista === 'activas' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setTipoVista('activas')}
            >
              Alertas Activas ({resumen.total})
            </Button>
            <Button
              variant={tipoVista === 'proactivas' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setTipoVista('proactivas')}
              leftIcon={<Zap className="w-4 h-4" />}
            >
              Alertas Proactivas ({resumenProactivas.total})
            </Button>
            <Button
              variant={tipoVista === 'todas' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setTipoVista('todas')}
            >
              Todas ({resumen.total + resumenProactivas.total})
            </Button>
          </div>
        </div>
      </Card>

      {/* Filtros */}
      <Card className="p-4">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Filtros:</span>
          </div>
          <Select
            value={filtroTipo}
            onChange={(v) => setFiltroTipo(v)}
            options={[
              { label: 'Todos los tipos', value: 'todos' },
              { label: 'Dolor', value: 'dolor' },
              { label: 'Contraindicación', value: 'contraindicacion' },
              { label: 'Incidencia', value: 'incidencia' },
            ]}
          />
          <Select
            value={filtroPrioridad}
            onChange={(v) => setFiltroPrioridad(v)}
            options={[
              { label: 'Todas las prioridades', value: 'todos' },
              { label: 'Crítica', value: 'critica' },
              { label: 'Alta', value: 'alta' },
              { label: 'Media', value: 'media' },
              { label: 'Baja', value: 'baja' },
            ]}
          />
          {(filtroTipo !== 'todos' || filtroPrioridad !== 'todos') && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setFiltroTipo('todos');
                setFiltroPrioridad('todos');
              }}
              leftIcon={<X className="w-4 h-4" />}
            >
              Limpiar filtros
            </Button>
          )}
        </div>
      </Card>

      {/* Lista de alertas activas */}
      {(tipoVista === 'activas' || tipoVista === 'todas') && (
        <>
          {tipoVista === 'todas' && alertasFiltradas.length > 0 && (
            <div className="flex items-center gap-2 mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Alertas Activas</h3>
              <Badge variant="outline">{alertasFiltradas.length}</Badge>
            </div>
          )}
          {alertasFiltradas.length === 0 && tipoVista === 'activas' ? (
            <Card className="p-8 text-center">
              <CheckCircle2 className="w-12 h-12 mx-auto mb-2 text-green-500" />
              <p className="text-gray-600">No hay alertas activas</p>
              <p className="text-sm text-gray-500 mt-1">
                {filtroTipo !== 'todos' || filtroPrioridad !== 'todos'
                  ? 'Intenta ajustar los filtros'
                  : 'Todas las alertas están resueltas'}
              </p>
            </Card>
          ) : (
            <div className="space-y-4">
              {alertasFiltradas.map((alerta) => (
            <Card key={alerta.id} className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-4 flex-1">
                  <div className="mt-1">{getTipoIcon(alerta.tipo)}</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{alerta.titulo}</h3>
                      <Badge variant={getPrioridadColor(alerta.prioridad)}>
                        <div className="flex items-center gap-1">
                          {getPrioridadIcon(alerta.prioridad)}
                          <span className="capitalize">{alerta.prioridad}</span>
                        </div>
                      </Badge>
                      <Badge variant="outline">{getTipoLabel(alerta.tipo)}</Badge>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                      <User className="w-4 h-4" />
                      <span>{alerta.clienteNombre}</span>
                      {alerta.relacionadoCon && (
                        <>
                          <span>•</span>
                          <span className="capitalize">{alerta.relacionadoCon.tipo}</span>
                          {alerta.relacionadoCon.nombre && (
                            <>
                              <span>:</span>
                              <span className="font-medium">{alerta.relacionadoCon.nombre}</span>
                            </>
                          )}
                        </>
                      )}
                    </div>
                    <p className="text-gray-700 mb-3">{alerta.descripcion}</p>

                    {alerta.ejerciciosRiesgosos && alerta.ejerciciosRiesgosos.length > 0 && (
                      <div className="mb-3">
                        <div className="text-sm font-medium text-red-700 mb-1">
                          ⚠️ Ejercicios riesgosos a evitar:
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {alerta.ejerciciosRiesgosos.map((ejercicio, idx) => (
                            <Badge key={idx} variant="destructive" className="text-xs">
                              {ejercicio}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {alerta.recomendaciones && alerta.recomendaciones.length > 0 && (
                      <div className="mb-3">
                        <div className="text-sm font-medium text-blue-700 mb-1">💡 Recomendaciones:</div>
                        <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                          {alerta.recomendaciones.map((rec, idx) => (
                            <li key={idx}>{rec}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <div className="text-xs text-gray-500 mt-3">
                      Creada: {new Date(alerta.fechaCreacion).toLocaleString('es-ES')}
                    </div>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleResolverAlerta(alerta.id)}
                  leftIcon={<CheckCircle2 className="w-4 h-4" />}
                >
                  Marcar como resuelta
                </Button>
              </div>
            </Card>
              ))}
            </div>
          )}
        </>
      )}

      {/* Lista de alertas proactivas */}
      {(tipoVista === 'proactivas' || tipoVista === 'todas') && (
        <>
          {tipoVista === 'todas' && alertasProactivasFiltradas.length > 0 && (
            <div className="flex items-center gap-2 mb-4 mt-6">
              <Zap className="w-5 h-5 text-yellow-600" />
              <h3 className="text-lg font-semibold text-gray-900">Alertas Proactivas</h3>
              <Badge variant="outline">{alertasProactivasFiltradas.length}</Badge>
            </div>
          )}
          {alertasProactivasFiltradas.length === 0 && tipoVista === 'proactivas' ? (
            <Card className="p-8 text-center">
              <CheckCircle2 className="w-12 h-12 mx-auto mb-2 text-green-500" />
              <p className="text-gray-600">No hay alertas proactivas</p>
              <p className="text-sm text-gray-500 mt-1">
                {filtroPrioridad !== 'todos'
                  ? 'Intenta ajustar los filtros'
                  : 'No se han detectado riesgos proactivos'}
              </p>
            </Card>
          ) : (
            <div className="space-y-4">
              {alertasProactivasFiltradas.map((alerta) => (
                <Card key={alerta.id} className="p-6 border-l-4 border-l-yellow-500">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="mt-1">{getTipoRiesgoIcon(alerta.tipo)}</div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">{alerta.titulo}</h3>
                          <Badge
                            variant={
                              alerta.prioridad === 'alta'
                                ? 'destructive'
                                : alerta.prioridad === 'media'
                                ? 'secondary'
                                : 'outline'
                            }
                          >
                            <div className="flex items-center gap-1">
                              {alerta.prioridad === 'alta' && <AlertTriangle className="w-4 h-4" />}
                              {alerta.prioridad === 'media' && <AlertCircle className="w-4 h-4" />}
                              {alerta.prioridad === 'baja' && <Activity className="w-4 h-4" />}
                              <span className="capitalize">{alerta.prioridad}</span>
                            </div>
                          </Badge>
                          <Badge variant="outline" className="bg-yellow-50">
                            <Zap className="w-3 h-3 mr-1" />
                            Proactiva
                          </Badge>
                          <Badge variant="outline">{getTipoRiesgoLabel(alerta.tipo)}</Badge>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                          <User className="w-4 h-4" />
                          <span>{alerta.clienteNombre}</span>
                          <span>•</span>
                          <span>
                            Detectada: {new Date(alerta.fechaDeteccion).toLocaleDateString('es-ES')}
                          </span>
                        </div>
                        <p className="text-gray-700 mb-3">{alerta.descripcion}</p>

                        {/* Datos específicos */}
                        {alerta.datos.grupoMuscular && (
                          <div className="mb-3 p-3 bg-red-50 rounded-lg">
                            <div className="text-sm font-medium text-red-900 mb-1">
                              📊 Datos de Sobrecarga:
                            </div>
                            <div className="text-sm text-red-800 space-y-1">
                              <div>
                                Grupo muscular: <strong>{alerta.datos.grupoMuscular}</strong>
                              </div>
                              <div>
                                Volumen actual: <strong>{alerta.datos.volumenActual}</strong> unidades
                              </div>
                              <div>
                                Volumen recomendado: <strong>{alerta.datos.volumenRecomendado}</strong> unidades
                              </div>
                              <div>
                                Semanas consecutivas: <strong>{alerta.datos.semanasConsecutivas}</strong>
                              </div>
                            </div>
                          </div>
                        )}

                        {alerta.datos.frecuenciaMovilidad !== undefined && (
                          <div className="mb-3 p-3 bg-orange-50 rounded-lg">
                            <div className="text-sm font-medium text-orange-900 mb-1">
                              📊 Datos de Movilidad:
                            </div>
                            <div className="text-sm text-orange-800 space-y-1">
                              <div>
                                Frecuencia actual: <strong>{alerta.datos.frecuenciaMovilidad}</strong> sesiones/semana
                              </div>
                              <div>
                                Frecuencia recomendada: <strong>{alerta.datos.frecuenciaRecomendada}</strong> sesiones/semana
                              </div>
                              {alerta.datos.ultimaSesionMovilidad && (
                                <div>
                                  Última sesión:{' '}
                                  <strong>
                                    {new Date(alerta.datos.ultimaSesionMovilidad).toLocaleDateString('es-ES')}
                                  </strong>
                                </div>
                              )}
                            </div>
                          </div>
                        )}

                        {alerta.datos.puntuacion !== undefined && (
                          <div className="mb-3 p-3 bg-yellow-50 rounded-lg">
                            <div className="text-sm font-medium text-yellow-900 mb-1">
                              📊 Datos de Feedback:
                            </div>
                            <div className="text-sm text-yellow-800 space-y-1">
                              <div>
                                Puntuación: <strong>{alerta.datos.puntuacion}/5</strong>
                              </div>
                              {alerta.datos.comentario && (
                                <div>
                                  Comentario: <strong>"{alerta.datos.comentario}"</strong>
                                </div>
                              )}
                              {alerta.datos.fechaFeedback && (
                                <div>
                                  Fecha:{' '}
                                  <strong>
                                    {new Date(alerta.datos.fechaFeedback).toLocaleDateString('es-ES')}
                                  </strong>
                                </div>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Recomendaciones accionables */}
                        {alerta.recomendaciones && alerta.recomendaciones.length > 0 && (
                          <div className="mb-3">
                            <div className="text-sm font-medium text-blue-700 mb-2 flex items-center gap-2">
                              <Zap className="w-4 h-4" />
                              Recomendaciones Accionables:
                            </div>
                            <div className="space-y-2">
                              {alerta.recomendaciones.map((rec, idx) => (
                                <div
                                  key={idx}
                                  className={`p-3 rounded-lg border ${
                                    rec.prioridad === 'alta'
                                      ? 'bg-red-50 border-red-200'
                                      : rec.prioridad === 'media'
                                      ? 'bg-orange-50 border-orange-200'
                                      : 'bg-blue-50 border-blue-200'
                                  }`}
                                >
                                  <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                      <div className="font-semibold text-gray-900 mb-1">{rec.accion}</div>
                                      <div className="text-sm text-gray-700">{rec.descripcion}</div>
                                    </div>
                                    {rec.accionable && (
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        className="ml-2"
                                        onClick={() => {
                                          // Aquí se podría implementar la acción directa
                                          alert(`Ejecutando: ${rec.accion}`);
                                        }}
                                      >
                                        Ejecutar
                                      </Button>
                                    )}
                                  </div>
                                  <Badge
                                    variant="outline"
                                    className={`mt-2 ${
                                      rec.prioridad === 'alta'
                                        ? 'border-red-300 text-red-700'
                                        : rec.prioridad === 'media'
                                        ? 'border-orange-300 text-orange-700'
                                        : 'border-blue-300 text-blue-700'
                                    }`}
                                  >
                                    Prioridad: {rec.prioridad}
                                  </Badge>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        <div className="text-xs text-gray-500 mt-3">
                          Detectada: {new Date(alerta.fechaDeteccion).toLocaleString('es-ES')}
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleResolverAlertaProactiva(alerta.id)}
                      leftIcon={<CheckCircle2 className="w-4 h-4" />}
                    >
                      Marcar como resuelta
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

