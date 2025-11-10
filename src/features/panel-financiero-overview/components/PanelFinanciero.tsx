import React from 'react';
import { Card, MetricCards, MetricCardData, Button, Modal, Input } from '../../../components/componentsreutilizables';
import { DollarSign, TrendingUp, TrendingDown, Loader2, Package, Calendar, Wallet, Target, ArrowUpCircle, Edit2, CheckCircle2, LineChart as LineChartIcon, AlertCircle } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { overviewApi, objetivosApi, gastosProfesionalesApi, ingresosApi, alertasApi } from '../api';
import { MetricasFinancieras, ObjetivosFinancieros, ProgresoObjetivo, IngresoMensual } from '../types';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ComparacionAnual } from './ComparacionAnual';
import { MetricasRetencionClientes } from './MetricasRetencionClientes';
import { ConfiguracionResumenSemanal } from './ConfiguracionResumenSemanal';

export const PanelFinanciero: React.FC = () => {
  const { user } = useAuth();
  const [overview, setOverview] = React.useState<MetricasFinancieras | null>(null);
  const [objetivos, setObjetivos] = React.useState<ObjetivosFinancieros | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [mostrarModalObjetivos, setMostrarModalObjetivos] = React.useState(false);
  const [objetivoMensualTemp, setObjetivoMensualTemp] = React.useState('');
  const [objetivoAnualTemp, setObjetivoAnualTemp] = React.useState('');
  const [guardandoObjetivos, setGuardandoObjetivos] = React.useState(false);
  const [gastosMensuales, setGastosMensuales] = React.useState<number>(0);
  const [evolucionMensual, setEvolucionMensual] = React.useState<IngresoMensual[]>([]);
  const [totalPendientes, setTotalPendientes] = React.useState<number>(0);

  React.useEffect(() => {
    const cargarDatos = async () => {
      try {
        setLoading(true);
        const isEntrenador = user?.role === 'entrenador';
        
        const promises = [
          overviewApi.obtenerOverview(user?.role || 'entrenador', user?.id),
          objetivosApi.obtenerObjetivos(user?.role || 'entrenador'),
          ingresosApi.obtenerEvolucionMensualIngresos(user?.role || 'entrenador', user?.id),
          alertasApi.obtenerClientesPendientes()
        ];
        
        // Si es entrenador, también cargar gastos para calcular beneficio neto
        if (isEntrenador && user?.id) {
          promises.push(gastosProfesionalesApi.obtenerResumenGastos(user.id, 'mes'));
        }
        
        const results = await Promise.all(promises);
        setOverview(results[0] as MetricasFinancieras);
        setObjetivos(results[1] as ObjetivosFinancieros);
        setEvolucionMensual(results[2] as IngresoMensual[]);
        
        // Calcular total de pagos pendientes (solo pendientes y en_gestion, excluir resueltos y cancelados)
        const pendientes = results[3] as any[];
        const totalPend = pendientes
          .filter(p => p.estado === 'pendiente' || p.estado === 'en_gestion')
          .reduce((sum, p) => sum + p.monto, 0);
        setTotalPendientes(totalPend);
        
        // Si hay gastos, guardarlos
        if (isEntrenador && results[4]) {
          const resumenGastos = results[4] as any;
          setGastosMensuales(resumenGastos.periodoActual?.total || 0);
        }
      } catch (error) {
        console.error('Error cargando datos:', error);
      } finally {
        setLoading(false);
      }
    };

    cargarDatos();
  }, [user?.role, user?.id]);

  const getTrendIcon = (tendencia: 'up' | 'down' | 'neutral') => {
    switch (tendencia) {
      case 'up':
        return <TrendingUp className="w-5 h-5" />;
      case 'down':
        return <TrendingDown className="w-5 h-5" />;
      default:
        return null;
    }
  };

  const isEntrenador = user?.role === 'entrenador';

  // Calcular beneficio neto (solo para entrenadores)
  const beneficioNeto = isEntrenador && overview 
    ? overview.total - gastosMensuales 
    : null;

  // Calcular progreso hacia objetivos
  const calcularProgreso = (actual: number, objetivo: number): ProgresoObjetivo => {
    const porcentaje = objetivo > 0 ? Math.min((actual / objetivo) * 100, 100) : 0;
    const restante = Math.max(objetivo - actual, 0);
    const tendencia: 'up' | 'down' | 'neutral' = porcentaje >= 100 ? 'up' : porcentaje >= 75 ? 'up' : porcentaje >= 50 ? 'neutral' : 'down';
    
    return {
      objetivo,
      actual,
      porcentaje: Math.round(porcentaje * 100) / 100,
      restante,
      tendencia
    };
  };

  const progresoMensual = overview && objetivos 
    ? calcularProgreso(overview.total, objetivos.objetivoMensual)
    : null;

  const progresoAnual = overview && objetivos
    ? calcularProgreso(overview.total * 12, objetivos.objetivoAnual)
    : null;

  // Abrir modal para editar objetivos
  const handleAbrirModalObjetivos = () => {
    if (objetivos) {
      setObjetivoMensualTemp(objetivos.objetivoMensual.toString());
      setObjetivoAnualTemp(objetivos.objetivoAnual.toString());
      setMostrarModalObjetivos(true);
    }
  };

  // Guardar objetivos
  const handleGuardarObjetivos = async () => {
    if (!objetivos || !user?.role) return;

    const mensual = parseFloat(objetivoMensualTemp.replace(/[^\d.-]/g, '').replace(/\./g, '').replace(',', '.'));
    const anual = parseFloat(objetivoAnualTemp.replace(/[^\d.-]/g, '').replace(/\./g, '').replace(',', '.'));

    if (isNaN(mensual) || mensual <= 0) {
      alert('Por favor, ingresa un objetivo mensual válido');
      return;
    }

    if (isNaN(anual) || anual <= 0) {
      alert('Por favor, ingresa un objetivo anual válido');
      return;
    }

    setGuardandoObjetivos(true);
    try {
      const objetivosActualizados = await objetivosApi.actualizarObjetivos(user.role, mensual, anual);
      setObjetivos(objetivosActualizados);
      setMostrarModalObjetivos(false);
    } catch (error) {
      console.error('Error al guardar objetivos:', error);
      alert('Error al guardar los objetivos. Por favor, intenta nuevamente.');
    } finally {
      setGuardandoObjetivos(false);
    }
  };

  // Métricas clave: Ingresos del mes, Pendientes, Próximo objetivo, Comparativa con mes anterior
  const metrics: MetricCardData[] = overview ? [
    {
      id: 'ingresos-mes',
      title: 'Ingresos del Mes',
      value: `€${overview.total.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      subtitle: overview.periodoActual,
      trend: overview.variacion !== undefined ? {
        value: Math.abs(overview.variacion),
        direction: overview.tendencia,
        label: 'vs mes anterior'
      } : undefined,
      icon: <DollarSign className="w-6 h-6" />,
      color: 'success' as const,
      loading
    },
    {
      id: 'pendientes',
      title: 'Pagos Pendientes',
      value: `€${totalPendientes.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      subtitle: totalPendientes > 0 ? 'Requieren atención' : 'Sin pendientes',
      icon: <AlertCircle className="w-6 h-6" />,
      color: totalPendientes > 0 ? 'error' as const : 'success' as const,
      loading
    },
    {
      id: 'objetivo',
      title: 'Próximo Objetivo',
      value: progresoMensual 
        ? (progresoMensual.porcentaje >= 100 
            ? '¡Objetivo Cumplido! 🎉' 
            : `€${Math.max(0, progresoMensual.restante).toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`)
        : 'Configurar objetivo',
      subtitle: objetivos 
        ? (progresoMensual && progresoMensual.porcentaje < 100
            ? `Faltan para alcanzar €${objetivos.objetivoMensual.toLocaleString('es-ES')} (${Math.round(progresoMensual.porcentaje)}%)`
            : `Objetivo: €${objetivos.objetivoMensual.toLocaleString('es-ES')}`)
        : 'Sin objetivo configurado',
      icon: <Target className="w-6 h-6" />,
      color: progresoMensual 
        ? (progresoMensual.porcentaje >= 100 ? 'success' : progresoMensual.porcentaje >= 75 ? 'info' : 'warning')
        : 'info',
      loading
    },
    {
      id: 'comparativa',
      title: 'Comparativa Mes Anterior',
      value: overview.variacion !== undefined 
        ? `${overview.variacion > 0 ? '+' : ''}${overview.variacion.toFixed(1)}%`
        : 'N/A',
      subtitle: overview.variacion !== undefined
        ? (overview.variacion > 0 
            ? 'Crecimiento respecto al mes anterior'
            : overview.variacion < 0
            ? 'Decrecimiento respecto al mes anterior'
            : 'Sin cambios')
        : 'Sin datos comparativos',
      icon: overview.tendencia === 'up' 
        ? <TrendingUp className="w-6 h-6" />
        : overview.tendencia === 'down'
        ? <TrendingDown className="w-6 h-6" />
        : <Package className="w-6 h-6" />,
      color: overview.tendencia === 'up' 
        ? 'success' 
        : overview.tendencia === 'down' 
        ? 'error' 
        : 'info' as const,
      loading
    }
  ] : [];

  // Preparar datos para el gráfico de evolución mensual (ordenados por fecha)
  const chartData = [...evolucionMensual]
    .sort((a, b) => a.fecha.getTime() - b.fecha.getTime())
    .map(item => ({
      mes: item.mesCorto,
      ingresos: item.ingresos,
      mesCompleto: item.mes
    }));

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-3">
          <p className="font-semibold mb-2 text-gray-900">{data.mesCompleto}</p>
          <p className="text-blue-600 text-sm font-medium">
            Ingresos: €{payload[0].value.toLocaleString('es-ES')}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Métricas clave - Diseño limpio y claro */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="bg-white shadow-sm">
              <div className="p-6">
                <div className="animate-pulse">
                  <div className="h-12 bg-gray-200 rounded-lg mb-4"></div>
                  <div className="h-6 bg-gray-200 rounded mb-2"></div>
                  <div className="h-8 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded"></div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : overview ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {metrics.map((metric) => (
            <Card key={metric.id} className="bg-white shadow-sm hover:shadow-md transition-shadow">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-lg ${
                    metric.color === 'success' ? 'bg-green-100' :
                    metric.color === 'error' ? 'bg-red-100' :
                    metric.color === 'warning' ? 'bg-yellow-100' :
                    'bg-blue-100'
                  }`}>
                    <div className={`${
                      metric.color === 'success' ? 'text-green-600' :
                      metric.color === 'error' ? 'text-red-600' :
                      metric.color === 'warning' ? 'text-yellow-600' :
                      'text-blue-600'
                    }`}>
                      {metric.icon}
                    </div>
                  </div>
                  {metric.trend && (
                    <div className={`flex items-center gap-1 text-sm font-medium ${
                      metric.trend.direction === 'up' ? 'text-green-600' :
                      metric.trend.direction === 'down' ? 'text-red-600' :
                      'text-gray-600'
                    }`}>
                      {metric.trend.direction === 'up' ? <TrendingUp className="w-4 h-4" /> :
                       metric.trend.direction === 'down' ? <TrendingDown className="w-4 h-4" /> : null}
                      <span>{metric.trend.value.toFixed(1)}%</span>
                    </div>
                  )}
                </div>
                <h3 className="text-sm font-medium text-gray-600 mb-1">{metric.title}</h3>
                <p className="text-2xl font-bold text-gray-900 mb-2">{metric.value}</p>
                <p className="text-xs text-gray-500">{metric.subtitle}</p>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="bg-white shadow-sm">
          <div className="p-8 text-center">
            <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Sin datos disponibles</h3>
            <p className="text-gray-600">No hay información financiera para mostrar en este momento.</p>
          </div>
        </Card>
      )}
      
      {/* Progreso de Objetivos - Solo si hay objetivos configurados */}
      {objetivos && (
        <Card className="bg-white shadow-sm">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
                  <Target className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">
                    Progreso hacia Objetivos
                  </h2>
                  <p className="text-sm text-gray-600">
                    Establece y alcanza tus metas financieras personalizadas
                  </p>
                </div>
              </div>
              <Button
                variant="secondary"
                size="sm"
                onClick={handleAbrirModalObjetivos}
                leftIcon={<Edit2 className="w-4 h-4" />}
              >
                Configurar Objetivos
              </Button>
            </div>

          {loading ? (
            <div className="animate-pulse space-y-4">
              <div className="h-24 bg-gray-200 rounded-lg"></div>
              <div className="h-24 bg-gray-200 rounded-lg"></div>
            </div>
          ) : objetivos && overview ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Progreso Mensual */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">Objetivo Mensual</h3>
                  {progresoMensual && (
                    <span className={`text-sm font-medium ${
                      progresoMensual.porcentaje >= 100 ? 'text-green-600' :
                      progresoMensual.porcentaje >= 75 ? 'text-blue-600' :
                      'text-orange-600'
                    }`}>
                      {Math.round(progresoMensual.porcentaje)}%
                    </span>
                  )}
                </div>
                {progresoMensual && (
                  <>
                    <div className="relative h-8 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={`absolute top-0 left-0 h-full transition-all duration-500 ${
                          progresoMensual.porcentaje >= 100 ? 'bg-green-500' :
                          progresoMensual.porcentaje >= 75 ? 'bg-blue-500' :
                          progresoMensual.porcentaje >= 50 ? 'bg-yellow-500' :
                          'bg-orange-500'
                        }`}
                        style={{ width: `${Math.min(progresoMensual.porcentaje, 100)}%` }}
                      />
                      {progresoMensual.porcentaje >= 100 && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <CheckCircle2 className="w-5 h-5 text-white" />
                        </div>
                      )}
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">
                        Actual: €{progresoMensual.actual.toLocaleString('es-ES', { maximumFractionDigits: 0 })}
                      </span>
                      <span className="text-gray-900 font-medium">
                        Meta: €{progresoMensual.objetivo.toLocaleString('es-ES', { maximumFractionDigits: 0 })}
                      </span>
                    </div>
                    {progresoMensual.restante > 0 && (
                      <p className="text-xs text-gray-500">
                        Faltan €{progresoMensual.restante.toLocaleString('es-ES', { maximumFractionDigits: 0 })} para alcanzar el objetivo
                      </p>
                    )}
                    {progresoMensual.porcentaje >= 100 && (
                      <p className="text-xs text-green-600 font-medium">
                        ¡Objetivo alcanzado! 🎉
                      </p>
                    )}
                  </>
                )}
              </div>

              {/* Progreso Anual */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">Objetivo Anual</h3>
                  {progresoAnual && (
                    <span className={`text-sm font-medium ${
                      progresoAnual.porcentaje >= 100 ? 'text-green-600' :
                      progresoAnual.porcentaje >= 75 ? 'text-blue-600' :
                      'text-orange-600'
                    }`}>
                      {Math.round(progresoAnual.porcentaje)}%
                    </span>
                  )}
                </div>
                {progresoAnual && (
                  <>
                    <div className="relative h-8 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={`absolute top-0 left-0 h-full transition-all duration-500 ${
                          progresoAnual.porcentaje >= 100 ? 'bg-green-500' :
                          progresoAnual.porcentaje >= 75 ? 'bg-blue-500' :
                          progresoAnual.porcentaje >= 50 ? 'bg-yellow-500' :
                          'bg-orange-500'
                        }`}
                        style={{ width: `${Math.min(progresoAnual.porcentaje, 100)}%` }}
                      />
                      {progresoAnual.porcentaje >= 100 && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <CheckCircle2 className="w-5 h-5 text-white" />
                        </div>
                      )}
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">
                        Proyección: €{progresoAnual.actual.toLocaleString('es-ES', { maximumFractionDigits: 0 })}
                      </span>
                      <span className="text-gray-900 font-medium">
                        Meta: €{progresoAnual.objetivo.toLocaleString('es-ES', { maximumFractionDigits: 0 })}
                      </span>
                    </div>
                    {progresoAnual.restante > 0 && (
                      <p className="text-xs text-gray-500">
                        Faltan €{progresoAnual.restante.toLocaleString('es-ES', { maximumFractionDigits: 0 })} para alcanzar el objetivo anual
                      </p>
                    )}
                    {progresoAnual.porcentaje >= 100 && (
                      <p className="text-xs text-green-600 font-medium">
                        ¡Objetivo anual alcanzado! 🎉
                      </p>
                    )}
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </Card>
      )}

      {/* Gráfico de Evolución Mensual de Ingresos */}
      <Card className="bg-white shadow-sm">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
              <LineChartIcon className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                Evolución de Ingresos (Últimos 12 Meses)
              </h2>
              <p className="text-sm text-gray-600">
                Visualiza la tendencia de tus ingresos mes a mes para identificar patrones
              </p>
            </div>
          </div>
          
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            </div>
          ) : chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={350}>
              <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis 
                  dataKey="mes" 
                  tick={{ fill: '#64748B', fontSize: 12 }}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis 
                  tick={{ fill: '#64748B', fontSize: 12 }}
                  tickFormatter={(value) => `€${(value / 1000).toFixed(0)}k`}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="ingresos"
                  stroke="#3B82F6"
                  strokeWidth={3}
                  name="Ingresos"
                  dot={{ fill: '#3B82F6', r: 5 }}
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="text-center py-8">
              <LineChartIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No hay datos de ingresos disponibles</p>
            </div>
          )}
        </div>
      </Card>

      {/* Comparación Anual: Año Actual vs Año Anterior */}
      <ComparacionAnual />

      {/* Métricas de Retención de Clientes */}
      <MetricasRetencionClientes />

      {/* Configuración de Resumen Semanal por Email */}
      <ConfiguracionResumenSemanal />

      {/* Modal para configurar objetivos */}
      <Modal
        isOpen={mostrarModalObjetivos}
        onClose={() => {
          setMostrarModalObjetivos(false);
          if (objetivos) {
            setObjetivoMensualTemp(objetivos.objetivoMensual.toString());
            setObjetivoAnualTemp(objetivos.objetivoAnual.toString());
          }
        }}
        title="Configurar Objetivos Financieros"
        size="md"
        footer={
          <div className="flex gap-3">
            <Button
              variant="secondary"
              onClick={() => {
                setMostrarModalObjetivos(false);
                if (objetivos) {
                  setObjetivoMensualTemp(objetivos.objetivoMensual.toString());
                  setObjetivoAnualTemp(objetivos.objetivoAnual.toString());
                }
              }}
              disabled={guardandoObjetivos}
            >
              Cancelar
            </Button>
            <Button
              variant="primary"
              onClick={handleGuardarObjetivos}
              loading={guardandoObjetivos}
              disabled={guardandoObjetivos}
              leftIcon={<CheckCircle2 className="w-4 h-4" />}
            >
              Guardar Objetivos
            </Button>
          </div>
        }
      >
        <div className="space-y-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              <strong>Establece tus objetivos financieros personalizados</strong> para mantenerte motivado y alcanzar tus metas. 
              Estos objetivos te ayudarán a medir tu progreso y mantener el enfoque en tus objetivos financieros.
            </p>
          </div>

          <div className="space-y-4">
            <Input
              label="Objetivo Mensual (€)"
              type="text"
              value={objetivoMensualTemp}
              onChange={(e) => {
                const value = e.target.value.replace(/[^\d.,]/g, '');
                setObjetivoMensualTemp(value);
              }}
              placeholder={objetivos?.objetivoMensual.toString() || '5000'}
              helperText="Ingresa el monto que deseas alcanzar cada mes"
              required
            />

            <Input
              label="Objetivo Anual (€)"
              type="text"
              value={objetivoAnualTemp}
              onChange={(e) => {
                const value = e.target.value.replace(/[^\d.,]/g, '');
                setObjetivoAnualTemp(value);
              }}
              placeholder={objetivos?.objetivoAnual.toString() || '60000'}
              helperText="Ingresa el monto total que deseas alcanzar en el año"
              required
            />
          </div>

          {objetivos && (
            <div className="bg-gray-50 rounded-lg p-4 space-y-2">
              <p className="text-sm font-medium text-gray-700">Objetivos actuales:</p>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Mensual:</span>
                <span className="font-semibold text-gray-900">€{objetivos.objetivoMensual.toLocaleString('es-ES')}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Anual:</span>
                <span className="font-semibold text-gray-900">€{objetivos.objetivoAnual.toLocaleString('es-ES')}</span>
              </div>
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
};

