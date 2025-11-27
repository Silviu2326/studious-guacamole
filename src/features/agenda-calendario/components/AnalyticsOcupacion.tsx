import React, { useState, useEffect } from 'react';
import { TrendingUp, Users, Calendar, DollarSign, Target, BarChart3, Settings, ArrowUp, ArrowDown, Minus, Clock, AlertCircle, RefreshCw } from 'lucide-react';
import { Card, MetricCards, Button, Modal, Input } from '../../../components/componentsreutilizables';
import { MetricasOcupacion, ComparativaOcupacion, ConfiguracionMetaOcupacion, ProyeccionIngresos, RangoFechas, ContextoMetricas } from '../types';
import {
  getMetricasOcupacionSemanal,
  getMetricasOcupacionMensual,
  getComparativaOcupacion,
  getProyeccionIngresos,
  getConfiguracionMetaOcupacion,
  actualizarConfiguracionMetaOcupacion,
} from '../api/analytics';
import { getMetricasSesiones, getSeriesOcupacionPorDia } from '../api/metricasSesiones';
import { useAuth } from '../../../context/AuthContext';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine, PieChart, Pie, Cell } from 'recharts';

interface AnalyticsOcupacionProps {
  rangoFechas?: RangoFechas;
  contexto?: ContextoMetricas;
}

export const AnalyticsOcupacion: React.FC<AnalyticsOcupacionProps> = ({ 
  rangoFechas: rangoFechasProp, 
  contexto: contextoProp 
}) => {
  const { user } = useAuth();
  const [vista, setVista] = useState<'semana' | 'mes'>('semana');
  const [metricasSemanales, setMetricasSemanales] = useState<MetricasOcupacion[]>([]);
  const [metricasMensuales, setMetricasMensuales] = useState<MetricasOcupacion[]>([]);
  const [comparativa, setComparativa] = useState<ComparativaOcupacion | null>(null);
  const [proyeccion, setProyeccion] = useState<ProyeccionIngresos | null>(null);
  const [configuracion, setConfiguracion] = useState<ConfiguracionMetaOcupacion | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mostrarModalConfig, setMostrarModalConfig] = useState(false);
  const [formConfig, setFormConfig] = useState({
    metaSemanal: '80',
    metaMensual: '75',
    precioPromedioSesion: '50',
  });
  const [metricasSesiones, setMetricasSesiones] = useState<any>(null);
  const [serieOcupacionPorDia, setSerieOcupacionPorDia] = useState<any[]>([]);

  useEffect(() => {
    cargarDatos();
  }, [vista, user?.id, rangoFechasProp]);

  const cargarDatos = async () => {
    setLoading(true);
    setError(null);
    try {
      const fechaActual = new Date();
      
      // Determinar rango de fechas
      let fechaInicio: Date;
      let fechaFin: Date;
      
      if (rangoFechasProp) {
        fechaInicio = rangoFechasProp.fechaInicio;
        fechaFin = rangoFechasProp.fechaFin;
      } else {
        // Por defecto: última semana o mes según vista
        if (vista === 'semana') {
          fechaInicio = new Date(fechaActual);
          fechaInicio.setDate(fechaInicio.getDate() - 7);
          fechaFin = new Date(fechaActual);
        } else {
          fechaInicio = new Date(fechaActual.getFullYear(), fechaActual.getMonth(), 1);
          fechaFin = new Date(fechaActual.getFullYear(), fechaActual.getMonth() + 1, 0);
        }
      }
      
      const contexto: ContextoMetricas = contextoProp || {
        userId: user?.id,
        role: user?.role as 'entrenador' | 'gimnasio',
      };
      
      const [semanales, mensuales, config, metricasSesionesData, serieOcupacion] = await Promise.all([
        getMetricasOcupacionSemanal(fechaActual, 4, user?.id),
        getMetricasOcupacionMensual(fechaActual, 3, user?.id),
        getConfiguracionMetaOcupacion(user?.id),
        getMetricasSesiones(fechaInicio, fechaFin, user?.id),
        getSeriesOcupacionPorDia({ fechaInicio, fechaFin }, contexto),
      ]);

      setMetricasSemanales(semanales);
      setMetricasMensuales(mensuales);
      setConfiguracion(config);
      setMetricasSesiones(metricasSesionesData);
      setSerieOcupacionPorDia(serieOcupacion);

      // Calcular comparativa según vista actual
      const metricasActuales = vista === 'semana' ? semanales : mensuales;
      if (metricasActuales.length >= 2) {
        const ultimoPeriodo = metricasActuales[metricasActuales.length - 1];
        const periodoAnterior = metricasActuales[metricasActuales.length - 2];
        
        const diferenciaPorcentaje = periodoAnterior.porcentajeOcupacion > 0
          ? Math.round(((ultimoPeriodo.porcentajeOcupacion - periodoAnterior.porcentajeOcupacion) / periodoAnterior.porcentajeOcupacion) * 100)
          : 0;
        
        const diferenciaHoras = ultimoPeriodo.horasTrabajadas - periodoAnterior.horasTrabajadas;
        
        const tendencia: 'subiendo' | 'bajando' | 'estable' = diferenciaPorcentaje > 5
          ? 'subiendo'
          : diferenciaPorcentaje < -5
          ? 'bajando'
          : 'estable';
        
        setComparativa({
          periodoActual: ultimoPeriodo,
          periodoAnterior: periodoAnterior,
          diferenciaPorcentaje,
          diferenciaHoras,
          tendencia,
        });
      }

      // Calcular proyección (usar período actual según vista)
      if (metricasActuales.length > 0) {
        const ultimoPeriodo = metricasActuales[metricasActuales.length - 1];
        const proyeccionData = await getProyeccionIngresos(
          ultimoPeriodo.fechaInicio,
          ultimoPeriodo.fechaFin,
          user?.id
        );
        setProyeccion(proyeccionData);
      }

      // Inicializar formulario de configuración
      setFormConfig({
        metaSemanal: config.metaSemanal.toString(),
        metaMensual: config.metaMensual.toString(),
        precioPromedioSesion: config.precioPromedioSesion.toString(),
      });
    } catch (error) {
      console.error('Error cargando datos:', error);
      setError('No se pudieron cargar los datos de analytics. Por favor, intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const handleGuardarConfig = async () => {
    try {
      await actualizarConfiguracionMetaOcupacion({
        metaSemanal: parseInt(formConfig.metaSemanal),
        metaMensual: parseInt(formConfig.metaMensual),
        precioPromedioSesion: parseFloat(formConfig.precioPromedioSesion),
      }, user?.id);
      setMostrarModalConfig(false);
      await cargarDatos();
    } catch (error) {
      console.error('Error guardando configuración:', error);
    }
  };

  const metricasActuales = vista === 'semana' ? metricasSemanales : metricasMensuales;
  const ultimaMetrica = metricasActuales[metricasActuales.length - 1];

  // Manejo de errores parciales - no rompe toda la página
  if (error && !ultimaMetrica) {
    return (
      <Card className="bg-white shadow-sm border-red-200">
        <div className="p-6">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0">
              <AlertCircle className="w-5 h-5 text-red-600" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-semibold text-red-900 mb-1">
                Error al cargar analytics
              </h3>
              <p className="text-sm text-red-700 mb-4">
                {error}
              </p>
              <Button 
                variant="secondary" 
                size="sm"
                onClick={cargarDatos}
                className="border-red-300 text-red-700 hover:bg-red-50"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Reintentar
              </Button>
            </div>
          </div>
        </div>
      </Card>
    );
  }

  if (loading && metricasActuales.length === 0 && !error) {
    return (
      <Card className="bg-white shadow-sm">
        <div className="p-6">
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
            <p className="text-sm text-gray-600">Cargando analytics...</p>
          </div>
        </div>
      </Card>
    );
  }

  if (!ultimaMetrica && !loading && !error) {
    return (
      <Card className="bg-white shadow-sm">
        <div className="p-6">
          <div className="text-center py-8">
            <TrendingUp className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-sm font-medium text-gray-600 mb-1">No hay datos de analytics disponibles</p>
            <p className="text-xs text-gray-500">Los datos aparecerán aquí cuando haya sesiones registradas.</p>
          </div>
        </div>
      </Card>
    );
  }

  // Preparar datos para gráficos
  const datosGrafico = metricasActuales.map(m => ({
    periodo: m.periodo.split(' - ')[0] || m.periodo.split(' ')[0],
    ocupacion: m.porcentajeOcupacion,
    horasTrabajadas: Math.round(m.horasTrabajadas * 10) / 10,
    horasDisponibles: Math.round(m.horasDisponibles * 10) / 10,
    ingresos: m.ingresosEstimados,
  }));

  const metricas = [
    {
      title: 'Ocupación Actual',
      value: `${ultimaMetrica.porcentajeOcupacion}%`,
      icon: <TrendingUp className="w-6 h-6" />,
      trend: comparativa?.tendencia === 'subiendo' ? 'up' : comparativa?.tendencia === 'bajando' ? 'down' : null,
      trendValue: comparativa ? `${Math.abs(comparativa.diferenciaPorcentaje)}% vs anterior` : null,
    },
    {
      title: 'Horas Trabajadas',
      value: `${Math.round(ultimaMetrica.horasTrabajadas * 10) / 10}h`,
      icon: <Calendar className="w-6 h-6" />,
      trend: null,
    },
    {
      title: 'Horas Disponibles',
      value: `${Math.round(ultimaMetrica.horasDisponibles * 10) / 10}h`,
      icon: <Users className="w-6 h-6" />,
      trend: null,
    },
    {
      title: 'Ingresos Estimados',
      value: `€${ultimaMetrica.ingresosEstimados}`,
      icon: <DollarSign className="w-6 h-6" />,
      trend: null,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header con selector de vista y configuración */}
      <Card className="bg-white shadow-sm">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-900">Analytics de Ocupación</h2>
            <div className="flex items-center gap-3">
              <div className="flex gap-2 bg-gray-100 rounded-lg p-1">
                <Button
                  variant={vista === 'semana' ? 'primary' : 'secondary'}
                  size="sm"
                  onClick={() => setVista('semana')}
                >
                  Semanal
                </Button>
                <Button
                  variant={vista === 'mes' ? 'primary' : 'secondary'}
                  size="sm"
                  onClick={() => setVista('mes')}
                >
                  Mensual
                </Button>
              </div>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setMostrarModalConfig(true)}
              >
                <Settings className="w-4 h-4 mr-2" />
                Configurar Meta
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Métricas */}
      <MetricCards metrics={metricas} />

      {/* Gráfico de Ocupación */}
      <Card className="bg-white shadow-sm">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-gray-900">
              Ocupación {vista === 'semana' ? 'Semanal' : 'Mensual'}
            </h3>
            {configuracion && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Target className="w-4 h-4" />
                <span>Meta: {vista === 'semana' ? configuracion.metaSemanal : configuracion.metaMensual}%</span>
              </div>
            )}
          </div>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={datosGrafico}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
              <XAxis dataKey="periodo" tick={{ fill: '#64748B', fontSize: 12 }} />
              <YAxis
                tick={{ fill: '#64748B', fontSize: 12 }}
                domain={[0, 100]}
                label={{ value: 'Ocupación %', angle: -90, position: 'insideLeft' }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #E2E8F0',
                  borderRadius: '8px',
                  padding: '8px',
                }}
                formatter={(value: number) => [`${value}%`, 'Ocupación']}
              />
              <Legend />
              {configuracion && (
                <ReferenceLine
                  y={vista === 'semana' ? configuracion.metaSemanal : configuracion.metaMensual}
                  stroke="#F59E0B"
                  strokeDasharray="5 5"
                  label={{ value: 'Meta', position: 'right' }}
                />
              )}
              <Line
                type="monotone"
                dataKey="ocupacion"
                stroke="#3B82F6"
                strokeWidth={3}
                name="Ocupación %"
                dot={{ fill: '#3B82F6', r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Gráfico de Horas */}
      <Card className="bg-white shadow-sm">
        <div className="p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">
            Horas Trabajadas vs Disponibles
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={datosGrafico}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
              <XAxis dataKey="periodo" tick={{ fill: '#64748B', fontSize: 12 }} />
              <YAxis tick={{ fill: '#64748B', fontSize: 12 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #E2E8F0',
                  borderRadius: '8px',
                  padding: '8px',
                }}
                formatter={(value: number) => [`${value}h`, '']}
              />
              <Legend />
              <Bar dataKey="horasDisponibles" fill="#E5E7EB" name="Horas Disponibles" />
              <Bar dataKey="horasTrabajadas" fill="#10B981" name="Horas Trabajadas" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Ocupación por Franja Horaria */}
      {metricasSesiones && metricasSesiones.sesionesPorHorario && metricasSesiones.sesionesPorHorario.length > 0 && (
        <Card className="bg-white shadow-sm">
          <div className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Clock className="w-5 h-5 text-gray-600" />
              <h3 className="text-xl font-bold text-gray-900">
                Ocupación por Franja Horaria
              </h3>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Distribución de sesiones a lo largo del día. Identifica las horas pico y los períodos de menor actividad.
            </p>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={metricasSesiones.sesionesPorHorario}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis 
                  dataKey="horario" 
                  tick={{ fill: '#64748B', fontSize: 12 }} 
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis tick={{ fill: '#64748B', fontSize: 12 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #E2E8F0',
                    borderRadius: '8px',
                    padding: '8px',
                  }}
                  formatter={(value: number, name: string) => {
                    if (name === 'cantidad') return [`${value} sesiones`, 'Cantidad'];
                    if (name === 'porcentaje') return [`${value}%`, 'Porcentaje'];
                    return [value, name];
                  }}
                />
                <Legend />
                <Bar dataKey="cantidad" fill="#3B82F6" name="Sesiones" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      )}

      {/* Ocupación por Día de la Semana */}
      {metricasSesiones && metricasSesiones.sesionesPorDiaSemana && metricasSesiones.sesionesPorDiaSemana.length > 0 && (
        <Card className="bg-white shadow-sm">
          <div className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Calendar className="w-5 h-5 text-gray-600" />
              <h3 className="text-xl font-bold text-gray-900">
                Ocupación por Día de la Semana
              </h3>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Distribución de sesiones por día. Identifica qué días de la semana tienen mayor demanda.
            </p>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={metricasSesiones.sesionesPorDiaSemana}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis 
                  dataKey="diaSemana" 
                  tick={{ fill: '#64748B', fontSize: 12 }} 
                />
                <YAxis tick={{ fill: '#64748B', fontSize: 12 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #E2E8F0',
                    borderRadius: '8px',
                    padding: '8px',
                  }}
                  formatter={(value: number, name: string) => {
                    if (name === 'cantidad') return [`${value} sesiones`, 'Cantidad'];
                    if (name === 'porcentaje') return [`${value}%`, 'Porcentaje'];
                    return [value, name];
                  }}
                />
                <Legend />
                <Bar dataKey="cantidad" fill="#10B981" name="Sesiones" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      )}

      {/* Ocupación por Tipo de Sesión */}
      {metricasSesiones && metricasSesiones.sesionesPorTipo && metricasSesiones.sesionesPorTipo.length > 0 && (
        <Card className="bg-white shadow-sm">
          <div className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <BarChart3 className="w-5 h-5 text-gray-600" />
              <h3 className="text-xl font-bold text-gray-900">
                Ocupación por Tipo de Sesión
              </h3>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Distribución de sesiones por tipo. Identifica qué tipos de sesión son más populares.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={metricasSesiones.sesionesPorTipo}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                  <XAxis 
                    dataKey="tipo" 
                    tick={{ fill: '#64748B', fontSize: 12 }} 
                    angle={-45}
                    textAnchor="end"
                    height={80}
                  />
                  <YAxis tick={{ fill: '#64748B', fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#fff',
                      border: '1px solid #E2E8F0',
                      borderRadius: '8px',
                      padding: '8px',
                    }}
                    formatter={(value: number, name: string) => {
                      if (name === 'cantidad') return [`${value} sesiones`, 'Cantidad'];
                      if (name === 'porcentaje') return [`${value}%`, 'Porcentaje'];
                      return [value, name];
                    }}
                  />
                  <Legend />
                  <Bar dataKey="cantidad" fill="#8B5CF6" name="Sesiones" />
                </BarChart>
              </ResponsiveContainer>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={metricasSesiones.sesionesPorTipo}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ tipo, porcentaje }) => `${tipo}: ${porcentaje}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="cantidad"
                  >
                    {metricasSesiones.sesionesPorTipo.map((entry: any, index: number) => {
                      const colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];
                      return <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />;
                    })}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#fff',
                      border: '1px solid #E2E8F0',
                      borderRadius: '8px',
                      padding: '8px',
                    }}
                    formatter={(value: number) => [`${value} sesiones`, 'Cantidad']}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </Card>
      )}

      {/* Comparativa con período anterior */}
      {comparativa && (
        <Card className="bg-white shadow-sm">
          <div className="p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Comparativa con Período Anterior</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="text-sm text-gray-600 mb-1">Ocupación Actual</div>
                <div className="text-2xl font-bold text-blue-600">
                  {comparativa.periodoActual.porcentajeOcupacion}%
                </div>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="text-sm text-gray-600 mb-1">Ocupación Anterior</div>
                <div className="text-2xl font-bold text-gray-600">
                  {comparativa.periodoAnterior.porcentajeOcupacion}%
                </div>
              </div>
              <div className={`p-4 rounded-lg ${
                comparativa.tendencia === 'subiendo'
                  ? 'bg-green-50'
                  : comparativa.tendencia === 'bajando'
                  ? 'bg-red-50'
                  : 'bg-yellow-50'
              }`}>
                <div className="text-sm text-gray-600 mb-1">Diferencia</div>
                <div className="flex items-center gap-2">
                  {comparativa.tendencia === 'subiendo' && <ArrowUp className="w-5 h-5 text-green-600" />}
                  {comparativa.tendencia === 'bajando' && <ArrowDown className="w-5 h-5 text-red-600" />}
                  {comparativa.tendencia === 'estable' && <Minus className="w-5 h-5 text-yellow-600" />}
                  <div className={`text-2xl font-bold ${
                    comparativa.tendencia === 'subiendo'
                      ? 'text-green-600'
                      : comparativa.tendencia === 'bajando'
                      ? 'text-red-600'
                      : 'text-yellow-600'
                  }`}>
                    {Math.abs(comparativa.diferenciaPorcentaje)}%
                  </div>
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {comparativa.diferenciaHoras > 0 ? '+' : ''}{Math.round(comparativa.diferenciaHoras * 10) / 10}h
                </div>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Proyección de Ingresos */}
      {proyeccion && (
        <Card className="bg-white shadow-sm">
          <div className="p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Proyección de Ingresos</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <div className="text-sm text-gray-600 mb-1">Ocupación Actual</div>
                  <div className="text-2xl font-bold text-blue-600">{proyeccion.ocupacionActual}%</div>
                </div>
                <div className="p-4 bg-green-50 rounded-lg">
                  <div className="text-sm text-gray-600 mb-1">Ocupación Proyectada (Meta)</div>
                  <div className="text-2xl font-bold text-green-600">{proyeccion.ocupacionProyectada}%</div>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="text-sm text-gray-600 mb-1">Ingresos Actuales</div>
                  <div className="text-2xl font-bold text-gray-900">€{proyeccion.ingresosActuales}</div>
                </div>
                <div className="p-4 bg-purple-50 rounded-lg">
                  <div className="text-sm text-gray-600 mb-1">Ingresos Proyectados</div>
                  <div className="text-2xl font-bold text-purple-600">€{Math.round(proyeccion.ingresosProyectados)}</div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="p-4 bg-yellow-50 rounded-lg">
                  <div className="text-sm text-gray-600 mb-1">Diferencia de Ingresos</div>
                  <div className={`text-2xl font-bold ${
                    proyeccion.diferenciaIngresos > 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {proyeccion.diferenciaIngresos > 0 ? '+' : ''}€{Math.round(proyeccion.diferenciaIngresos)}
                  </div>
                </div>
                <div className="p-4 bg-orange-50 rounded-lg">
                  <div className="text-sm text-gray-600 mb-1">Horas Necesarias para Meta</div>
                  <div className="text-2xl font-bold text-orange-600">
                    {Math.round(proyeccion.horasNecesariasParaMeta * 10) / 10}h
                  </div>
                </div>
                <div className="p-4 bg-indigo-50 rounded-lg">
                  <div className="text-sm text-gray-600 mb-1">Sesiones Necesarias para Meta</div>
                  <div className="text-2xl font-bold text-indigo-600">
                    {proyeccion.sesionesNecesariasParaMeta}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Modal de Configuración */}
      <Modal
        isOpen={mostrarModalConfig}
        onClose={() => setMostrarModalConfig(false)}
        title="Configurar Meta de Ocupación"
        size="md"
        footer={
          <div className="flex justify-end gap-2">
            <Button variant="secondary" onClick={() => setMostrarModalConfig(false)}>
              Cancelar
            </Button>
            <Button variant="primary" onClick={handleGuardarConfig}>
              Guardar
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          <Input
            label="Meta Semanal (%)"
            type="number"
            value={formConfig.metaSemanal}
            onChange={(e) => setFormConfig({ ...formConfig, metaSemanal: e.target.value })}
            min="0"
            max="100"
            required
          />
          <Input
            label="Meta Mensual (%)"
            type="number"
            value={formConfig.metaMensual}
            onChange={(e) => setFormConfig({ ...formConfig, metaMensual: e.target.value })}
            min="0"
            max="100"
            required
          />
          <Input
            label="Precio Promedio por Sesión (€)"
            type="number"
            value={formConfig.precioPromedioSesion}
            onChange={(e) => setFormConfig({ ...formConfig, precioPromedioSesion: e.target.value })}
            min="0"
            step="0.01"
            required
          />
        </div>
      </Modal>
    </div>
  );
};
