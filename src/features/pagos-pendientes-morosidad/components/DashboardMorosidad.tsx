/**
 * Dashboard Ejecutivo de Morosidad
 * 
 * Este componente muestra métricas clave de morosidad en formato ejecutivo.
 * Se utiliza en el tab "Dashboard" de pagos-pendientes-morosidadPage.tsx.
 * 
 * Métricas mostradas:
 * - Total de morosidad (monto)
 * - Número de clientes morosos
 * - Distribución por nivel de riesgo (gráfico)
 * - Días promedio de retraso
 * - Tasa de recuperación
 * - Tendencia vs periodo anterior (sube/baja/igual)
 */

import React, { useState, useEffect } from 'react';
import { Card, Badge } from '../../../components/componentsreutilizables';
import { MetricasMorosidad, ReporteMensualMorosidadSimple, NivelRiesgo } from '../types';
import { morosidadAPI } from '../api/morosidad';
import { reportesMensualesAPI } from '../api/reportesMensuales';
import {
  DollarSign,
  Users,
  TrendingUp,
  TrendingDown,
  Minus,
  Clock,
  Target,
  BarChart3,
  AlertTriangle
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

interface DashboardMorosidadProps {
  onRefresh?: () => void;
}

export const DashboardMorosidad: React.FC<DashboardMorosidadProps> = ({ onRefresh }) => {
  const [metricas, setMetricas] = useState<MetricasMorosidad | null>(null);
  const [reporteMensual, setReporteMensual] = useState<ReporteMensualMorosidadSimple | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    console.log('[DashboardMorosidad] Iniciando carga de datos...');
    setLoading(true);
    try {
      const hoy = new Date();
      const mes = hoy.getMonth() + 1;
      const anio = hoy.getFullYear();

      console.log(`[DashboardMorosidad] Cargando reporte para ${mes}/${anio}`);

      // Obtener reporte mensual simple para métricas y comparativa
      const reporte = await reportesMensualesAPI.getReporteMensualMorosidadSimple(mes, anio);
      console.log('[DashboardMorosidad] Reporte mensual cargado:', reporte);
      setReporteMensual(reporte);

      // Obtener métricas detalladas con distribución por riesgo
      console.log('[DashboardMorosidad] Cargando métricas detalladas...');
      const reportes = await reportesMensualesAPI.getReportesMorosidadPorPeriodo({
        fechaInicio: new Date(anio, mes - 1, 1),
        fechaFin: new Date(anio, mes, 0, 23, 59, 59, 999)
      });
      console.log('[DashboardMorosidad] Métricas detalladas cargadas:', reportes);

      if (reportes.length > 0) {
        setMetricas(reportes[0].resumenMetricas);
      } else {
        // Si no hay reporte, calcular métricas desde los pagos pendientes
        console.log('[DashboardMorosidad] No hay reporte, calculando desde pagos pendientes...');
        const pagos = await morosidadAPI.obtenerPagosPendientes();
        console.log('[DashboardMorosidad] Pagos pendientes cargados:', pagos.length);
        const metricasCalculadas = calcularMetricasDesdePagos(pagos, mes, anio);
        setMetricas(metricasCalculadas);
      }
    } catch (error) {
      console.error('Error al cargar datos del dashboard:', error);
    } finally {
      setLoading(false);
      console.log('[DashboardMorosidad] Carga de datos finalizada');
    }
  };

  // Función auxiliar para calcular métricas desde los pagos pendientes
  const calcularMetricasDesdePagos = (pagos: any[], mes: number, anio: number): MetricasMorosidad => {
    const totalMorosidad = pagos.reduce((sum, p) => sum + p.montoPendiente, 0);
    const numeroClientesMorosos = new Set(pagos.map(p => p.cliente.id)).size;
    const diasPromedioRetraso = pagos.length > 0
      ? pagos.reduce((sum, p) => sum + p.diasRetraso, 0) / pagos.length
      : 0;

    // Distribución por nivel de riesgo
    const distribucionPorNivelRiesgo: Record<NivelRiesgo, { cantidad: number; importe: number }> = {
      bajo: { cantidad: 0, importe: 0 },
      medio: { cantidad: 0, importe: 0 },
      alto: { cantidad: 0, importe: 0 },
      critico: { cantidad: 0, importe: 0 }
    };

    pagos.forEach(pago => {
      const nivelRiesgo: NivelRiesgo =
        pago.riesgo === 'critico' ? 'critico' :
          pago.riesgo === 'alto' ? 'alto' :
            pago.riesgo === 'medio' ? 'medio' : 'bajo';

      distribucionPorNivelRiesgo[nivelRiesgo].cantidad++;
      distribucionPorNivelRiesgo[nivelRiesgo].importe += pago.montoPendiente;
    });

    // Calcular tasa de recuperación (mock: basada en pagos pagados vs pendientes)
    const pagosPagados = pagos.filter(p => p.estado === 'pagado').length;
    const tasaRecuperacion = pagos.length > 0 ? pagosPagados / pagos.length : 0;

    const inicioMes = new Date(anio, mes - 1, 1);
    const finMes = new Date(anio, mes, 0, 23, 59, 59, 999);

    return {
      totalMorosidad,
      numeroClientesMorosos,
      distribucionPorNivelRiesgo,
      diasPromedioRetraso,
      tasaRecuperacion,
      periodo: {
        inicio: inicioMes,
        fin: finMes
      }
    };
  };

  const formatearMoneda = (valor: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(valor);
  };

  // Preparar datos para el gráfico de distribución por riesgo
  const datosGraficoRiesgo = metricas ? [
    {
      name: 'Bajo',
      cantidad: metricas.distribucionPorNivelRiesgo.bajo.cantidad,
      importe: metricas.distribucionPorNivelRiesgo.bajo.importe,
      color: '#10B981' // verde
    },
    {
      name: 'Medio',
      cantidad: metricas.distribucionPorNivelRiesgo.medio.cantidad,
      importe: metricas.distribucionPorNivelRiesgo.medio.importe,
      color: '#F59E0B' // amarillo/naranja
    },
    {
      name: 'Alto',
      cantidad: metricas.distribucionPorNivelRiesgo.alto.cantidad,
      importe: metricas.distribucionPorNivelRiesgo.alto.importe,
      color: '#EF4444' // rojo
    },
    {
      name: 'Crítico',
      cantidad: metricas.distribucionPorNivelRiesgo.critico.cantidad,
      importe: metricas.distribucionPorNivelRiesgo.critico.importe,
      color: '#7C2D12' // marrón/negro
    }
  ].filter(item => item.cantidad > 0) : [];

  // Obtener icono y color de tendencia
  const getTendenciaIcon = (tendencia: 'sube' | 'baja' | 'igual') => {
    switch (tendencia) {
      case 'sube':
        return <TrendingUp className="w-5 h-5 text-red-600" />;
      case 'baja':
        return <TrendingDown className="w-5 h-5 text-green-600" />;
      default:
        return <Minus className="w-5 h-5 text-gray-600" />;
    }
  };

  const getTendenciaColor = (tendencia: 'sube' | 'baja' | 'igual') => {
    switch (tendencia) {
      case 'sube':
        return 'text-red-600';
      case 'baja':
        return 'text-green-600';
      default:
        return 'text-gray-600';
    }
  };

  const getTendenciaLabel = (tendencia: 'sube' | 'baja' | 'igual') => {
    switch (tendencia) {
      case 'sube':
        return 'Aumenta';
      case 'baja':
        return 'Disminuye';
      default:
        return 'Estable';
    }
  };

  console.log('[DashboardMorosidad] Render - Loading:', loading, 'Metricas:', metricas ? 'Presente' : 'Null');

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-gray-500">Cargando métricas...</div>
      </div>
    );
  }

  if (!metricas) {
    return (
      <Card className="bg-white shadow-sm">
        <div className="p-12 text-center">
          <p className="text-gray-500 text-lg">No hay datos disponibles</p>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Encabezado */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Dashboard Ejecutivo de Morosidad
        </h2>
        <p className="text-gray-600">
          Métricas clave y análisis de morosidad del período actual
        </p>
      </div>

      {/* Tarjetas de métricas principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Total de morosidad */}
        <Card className="bg-white shadow-sm">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-red-100 rounded-lg">
                  <DollarSign className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-600">Total de Morosidad</h3>
                  <p className="text-3xl font-bold text-gray-900 mt-1">
                    {formatearMoneda(metricas.totalMorosidad)}
                  </p>
                </div>
              </div>
            </div>
            {reporteMensual && (
              <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-200">
                {getTendenciaIcon(reporteMensual.comparativaMesAnterior)}
                <span className={`text-sm font-medium ${getTendenciaColor(reporteMensual.comparativaMesAnterior)}`}>
                  {getTendenciaLabel(reporteMensual.comparativaMesAnterior)} vs mes anterior
                </span>
              </div>
            )}
          </div>
        </Card>

        {/* Número de clientes morosos */}
        <Card className="bg-white shadow-sm">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-600">Clientes Morosos</h3>
                  <p className="text-3xl font-bold text-gray-900 mt-1">
                    {metricas.numeroClientesMorosos}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Días promedio de retraso */}
        <Card className="bg-white shadow-sm">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-orange-100 rounded-lg">
                  <Clock className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-600">Días Promedio Retraso</h3>
                  <p className="text-3xl font-bold text-gray-900 mt-1">
                    {Math.round(metricas.diasPromedioRetraso)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Tasa de recuperación */}
        <Card className="bg-white shadow-sm">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-green-100 rounded-lg">
                  <Target className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-600">Tasa de Recuperación</h3>
                  <p className="text-3xl font-bold text-gray-900 mt-1">
                    {(metricas.tasaRecuperacion * 100).toFixed(1)}%
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Tendencia vs periodo anterior */}
        {reporteMensual && (
          <Card className="bg-white shadow-sm">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`p-3 rounded-lg ${reporteMensual.comparativaMesAnterior === 'sube' ? 'bg-red-100' :
                    reporteMensual.comparativaMesAnterior === 'baja' ? 'bg-green-100' :
                      'bg-gray-100'
                    }`}>
                    {reporteMensual.comparativaMesAnterior === 'sube' ? (
                      <TrendingUp className="w-6 h-6 text-red-600" />
                    ) : reporteMensual.comparativaMesAnterior === 'baja' ? (
                      <TrendingDown className="w-6 h-6 text-green-600" />
                    ) : (
                      <Minus className="w-6 h-6 text-gray-600" />
                    )}
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-600">Tendencia</h3>
                    <p className={`text-2xl font-bold mt-1 ${getTendenciaColor(reporteMensual.comparativaMesAnterior)}`}>
                      {getTendenciaLabel(reporteMensual.comparativaMesAnterior)}
                    </p>
                  </div>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Comparado con el mes anterior
              </p>
            </div>
          </Card>
        )}

        {/* Resumen de distribución */}
        <Card className="bg-white shadow-sm">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-purple-100 rounded-lg">
                  <BarChart3 className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-600">Niveles de Riesgo</h3>
                  <p className="text-lg font-semibold text-gray-900 mt-1">
                    {Object.values(metricas.distribucionPorNivelRiesgo).reduce((sum, nivel) => sum + nivel.cantidad, 0)} casos
                  </p>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 mt-3">
              {Object.entries(metricas.distribucionPorNivelRiesgo).map(([nivel, datos]) => {
                if (datos.cantidad === 0) return null;
                const colores: Record<string, string> = {
                  bajo: 'bg-green-100 text-green-700',
                  medio: 'bg-yellow-100 text-yellow-700',
                  alto: 'bg-orange-100 text-orange-700',
                  critico: 'bg-red-100 text-red-700'
                };
                return (
                  <div key={nivel} className={`p-2 rounded text-xs font-medium ${colores[nivel] || 'bg-gray-100 text-gray-700'}`}>
                    {nivel.charAt(0).toUpperCase() + nivel.slice(1)}: {datos.cantidad}
                  </div>
                );
              })}
            </div>
          </div>
        </Card>
      </div>

      {/* Gráfico de distribución por nivel de riesgo */}
      {datosGraficoRiesgo.length > 0 && (
        <Card className="bg-white shadow-sm">
          <div className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <BarChart3 className="w-6 h-6 text-gray-700" />
              <h3 className="text-lg font-semibold text-gray-900">
                Distribución por Nivel de Riesgo
              </h3>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Gráfico de barras - Cantidad */}
              <div>
                <h4 className="text-sm font-medium text-gray-600 mb-4 text-center">
                  Cantidad de Casos
                </h4>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={datosGraficoRiesgo} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                    <XAxis
                      dataKey="name"
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
                    />
                    <Bar dataKey="cantidad" fill="#6366F1" radius={[8, 8, 0, 0]}>
                      {datosGraficoRiesgo.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Gráfico de pastel - Importe */}
              <div>
                <h4 className="text-sm font-medium text-gray-600 mb-4 text-center">
                  Distribución de Monto
                </h4>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={datosGraficoRiesgo}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${((percent || 0) * 100).toFixed(0)}%`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="importe"
                    >
                      {datosGraficoRiesgo.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value: number) => formatearMoneda(value)}
                      contentStyle={{
                        backgroundColor: '#fff',
                        border: '1px solid #E2E8F0',
                        borderRadius: '8px',
                        padding: '8px',
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Leyenda de niveles */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {datosGraficoRiesgo.map((item) => (
                  <div key={item.name} className="flex items-center gap-2">
                    <div
                      className="w-4 h-4 rounded"
                      style={{ backgroundColor: item.color }}
                    />
                    <div className="text-sm">
                      <div className="font-medium text-gray-900">{item.name}</div>
                      <div className="text-xs text-gray-500">
                        {item.cantidad} casos • {formatearMoneda(item.importe)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Comentario ejecutivo */}
      {reporteMensual?.comentarioEjecutivo && (
        <Card className="bg-white shadow-sm border-l-4 border-l-blue-500">
          <div className="p-6">
            <div className="flex items-center gap-3 mb-3">
              <AlertTriangle className="w-5 h-5 text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-900">
                Análisis Ejecutivo
              </h3>
            </div>
            <p className="text-gray-700 leading-relaxed">
              {reporteMensual.comentarioEjecutivo}
            </p>
          </div>
        </Card>
      )}
    </div>
  );
};

