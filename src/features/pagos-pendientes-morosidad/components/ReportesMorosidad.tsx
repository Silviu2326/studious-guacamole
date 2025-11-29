/**
 * ReportesMorosidad.tsx
 * 
 * Componente de análisis y reportes detallados de morosidad.
 * 
 * Este componente se utiliza dentro del tab "Reportes" para proporcionar
 * análisis completos de morosidad con métricas agregadas, gráficos de distribución,
 * evolución temporal y top clientes morosos.
 * 
 * Nota: Este componente complementa ReporteMensualSimple.tsx que se encarga
 * del resumen mensual simplificado. Ambos componentes trabajan juntos para
 * proporcionar una visión completa de la morosidad.
 * 
 * Funcionalidades:
 * - Selección de período (rango de fechas)
 * - Carga de datos usando getReportesMorosidadPorPeriodo
 * - Visualización de resumen de MetricasMorosidad
 * - Gráficos de distribución por nivel de riesgo
 * - Evolución temporal de totalMorosidad y tasaRecuperacion
 * - Top clientes morosos por importe
 */

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Card, Button, MetricCards, Badge, Table, TableColumn } from '../../../components/componentsreutilizables';
import { ReporteMorosidad, MetricasMorosidad, NivelRiesgo, ClienteMorosoTop, FiltroMorosidad } from '../types';
import { reportesMensualesAPI } from '../api/reportesMensuales';
import { 
  FileDown, 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  AlertCircle, 
  BarChart3,
  Calendar,
  Users,
  Clock,
  Target
} from 'lucide-react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
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

interface ReportesMorosidadProps {
  onRefresh?: () => void;
}

export const ReportesMorosidad: React.FC<ReportesMorosidadProps> = ({ onRefresh }) => {
  // Estados para el rango de fechas (por defecto: últimos 3 meses)
  const getDefaultDateRange = () => {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - 3);
    return { from: startDate, to: endDate };
  };

  const [dateRange, setDateRange] = useState<{ from: Date; to: Date }>(getDefaultDateRange());
  const [reportes, setReportes] = useState<ReporteMorosidad[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Cargar reportes cuando cambia el rango de fechas
  const cargarReportes = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const filtros: FiltroMorosidad = {
        fechaInicio: dateRange.from,
        fechaFin: dateRange.to
      };
      const reportesData = await reportesMensualesAPI.getReportesMorosidadPorPeriodo(filtros);
      setReportes(reportesData);
    } catch (err) {
      console.error('Error al cargar reportes de morosidad:', err);
      setError('Error al cargar los reportes. Por favor, intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  }, [dateRange.from, dateRange.to]);

  useEffect(() => {
    cargarReportes();
  }, [cargarReportes]);

  // Calcular métricas agregadas de todos los reportes
  const metricasAgregadas = useMemo(() => {
    if (reportes.length === 0) return null;

    const totalMorosidad = reportes.reduce((sum, r) => sum + r.resumenMetricas.totalMorosidad, 0);
    const totalClientes = reportes.reduce((sum, r) => sum + r.resumenMetricas.numeroClientesMorosos, 0);
    const diasPromedioRetraso = reportes.reduce((sum, r) => sum + r.resumenMetricas.diasPromedioRetraso, 0) / reportes.length;
    const tasaRecuperacionPromedio = reportes.reduce((sum, r) => sum + r.resumenMetricas.tasaRecuperacion, 0) / reportes.length;

    // Distribución agregada por nivel de riesgo
    const distribucionAgregada: Record<NivelRiesgo, { cantidad: number; importe: number }> = {
      bajo: { cantidad: 0, importe: 0 },
      medio: { cantidad: 0, importe: 0 },
      alto: { cantidad: 0, importe: 0 },
      critico: { cantidad: 0, importe: 0 }
    };

    reportes.forEach(reporte => {
      Object.keys(distribucionAgregada).forEach(nivel => {
        const nivelKey = nivel as NivelRiesgo;
        distribucionAgregada[nivelKey].cantidad += reporte.resumenMetricas.distribucionPorNivelRiesgo[nivelKey].cantidad;
        distribucionAgregada[nivelKey].importe += reporte.resumenMetricas.distribucionPorNivelRiesgo[nivelKey].importe;
      });
    });

    return {
      totalMorosidad,
      numeroClientesMorosos: totalClientes,
      distribucionPorNivelRiesgo: distribucionAgregada,
      diasPromedioRetraso,
      tasaRecuperacion: tasaRecuperacionPromedio,
      periodo: {
        inicio: dateRange.from,
        fin: dateRange.to
      }
    } as MetricasMorosidad;
  }, [reportes, dateRange]);

  // Datos para gráfico de distribución por nivel de riesgo
  const datosDistribucionRiesgo = useMemo(() => {
    if (!metricasAgregadas) return [];

    return Object.entries(metricasAgregadas.distribucionPorNivelRiesgo).map(([nivel, datos]) => ({
      nivel: nivel.charAt(0).toUpperCase() + nivel.slice(1),
      cantidad: datos.cantidad,
      importe: datos.importe
    }));
  }, [metricasAgregadas]);

  // Datos para evolución temporal
  const datosEvolucionTemporal = useMemo(() => {
    return reportes.map(reporte => ({
      periodo: new Date(reporte.periodoInicio).toLocaleDateString('es-ES', { month: 'short', year: 'numeric' }),
      totalMorosidad: reporte.resumenMetricas.totalMorosidad,
      tasaRecuperacion: reporte.resumenMetricas.tasaRecuperacion * 100 // Convertir a porcentaje
    }));
  }, [reportes]);

  // Top clientes morosos (agregar todos y ordenar)
  const topClientesMorosos = useMemo(() => {
    const clientesMap = new Map<string, ClienteMorosoTop>();

    reportes.forEach(reporte => {
      reporte.topClientesMorosos.forEach(cliente => {
        if (clientesMap.has(cliente.clienteId)) {
          const existente = clientesMap.get(cliente.clienteId)!;
          existente.importeTotalAdeudado += cliente.importeTotalAdeudado;
          existente.diasMaximoRetraso = Math.max(existente.diasMaximoRetraso, cliente.diasMaximoRetraso);
          // Mantener el nivel de riesgo más alto
          const niveles: NivelRiesgo[] = ['bajo', 'medio', 'alto', 'critico'];
          const indiceActual = niveles.indexOf(existente.nivelRiesgo);
          const indiceNuevo = niveles.indexOf(cliente.nivelRiesgo);
          if (indiceNuevo > indiceActual) {
            existente.nivelRiesgo = cliente.nivelRiesgo;
          }
        } else {
          clientesMap.set(cliente.clienteId, { ...cliente });
        }
      });
    });

    return Array.from(clientesMap.values())
      .sort((a, b) => b.importeTotalAdeudado - a.importeTotalAdeudado)
      .slice(0, 10);
  }, [reportes]);

  const formatearMoneda = (valor: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(valor);
  };

  const formatearFecha = (fecha: Date) => {
    return new Intl.DateTimeFormat('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(fecha);
  };

  const handleExportarReporte = () => {
    // TODO: Implementar exportación a PDF/Excel
    console.log('Exportar reporte', { dateRange, reportes });
  };

  // Preparar métricas para MetricCards
  const metricas = metricasAgregadas ? [
    {
      id: 'total-morosidad',
      title: 'Total Morosidad',
      value: formatearMoneda(metricasAgregadas.totalMorosidad),
      subtitle: `En el período seleccionado`,
      icon: <DollarSign className="w-6 h-6" />,
      color: 'error' as const
    },
    {
      id: 'clientes-morosos',
      title: 'Clientes Morosos',
      value: metricasAgregadas.numeroClientesMorosos.toString(),
      subtitle: 'Total de clientes afectados',
      icon: <Users className="w-6 h-6" />,
      color: 'warning' as const
    },
    {
      id: 'promedio-retraso',
      title: 'Promedio Retraso',
      value: `${Math.round(metricasAgregadas.diasPromedioRetraso)} días`,
      subtitle: 'Tiempo promedio de mora',
      icon: <Clock className="w-6 h-6" />,
      color: 'warning' as const
    },
    {
      id: 'tasa-recuperacion',
      title: 'Tasa Recuperación',
      value: `${(metricasAgregadas.tasaRecuperacion * 100).toFixed(1)}%`,
      subtitle: 'Porcentaje de éxito',
      icon: <TrendingUp className="w-6 h-6" />,
      color: 'success' as const
    }
  ] : [];

  // Colores para los niveles de riesgo
  const coloresRiesgo: Record<NivelRiesgo, string> = {
    bajo: '#10B981',      // verde
    medio: '#F59E0B',     // amarillo
    alto: '#EF4444',      // rojo
    critico: '#7C2D12'    // marrón oscuro
  };

  const getColorRiesgo = (nivel: NivelRiesgo): string => {
    return coloresRiesgo[nivel] || '#6B7280';
  };

  // Columnas para la tabla de top clientes morosos
  const columnasTopMorosos: TableColumn<ClienteMorosoTop>[] = [
    {
      key: 'clienteNombre',
      label: 'Cliente',
      render: (_, row) => (
        <div className="font-medium">{row.clienteNombre}</div>
      )
    },
    {
      key: 'importeTotalAdeudado',
      label: 'Importe Adeudado',
      render: (_, row) => (
        <span className="font-semibold text-red-600">
          {formatearMoneda(row.importeTotalAdeudado)}
        </span>
      ),
      align: 'right'
    },
    {
      key: 'diasMaximoRetraso',
      label: 'Días Retraso',
      render: (_, row) => (
        <Badge 
          variant={row.diasMaximoRetraso > 60 ? 'red' : row.diasMaximoRetraso > 30 ? 'yellow' : 'green'} 
          size="sm"
        >
          {row.diasMaximoRetraso} días
        </Badge>
      )
    },
    {
      key: 'nivelRiesgo',
      label: 'Nivel Riesgo',
      render: (_, row) => {
        const color = getColorRiesgo(row.nivelRiesgo);
        return (
          <Badge 
            variant={row.nivelRiesgo === 'critico' || row.nivelRiesgo === 'alto' ? 'red' : 
                    row.nivelRiesgo === 'medio' ? 'yellow' : 'green'} 
            size="sm"
          >
            {row.nivelRiesgo.toUpperCase()}
          </Badge>
        );
      }
    }
  ];

  // Tooltip personalizado para gráficos
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-semibold mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }} className="text-sm">
              {entry.name}: {entry.name.includes('Tasa') 
                ? `${entry.value.toFixed(1)}%` 
                : formatearMoneda(entry.value)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            Reportes de Morosidad
          </h2>
          <p className="text-gray-600">
            Análisis detallado y métricas de morosidad por período
          </p>
        </div>
        <Button
          variant="secondary"
          onClick={handleExportarReporte}
          disabled={loading || reportes.length === 0}
        >
          <FileDown className="w-4 h-4 mr-2" />
          Exportar Reporte
        </Button>
      </div>

      {/* Selector de período */}
      <Card className="bg-white shadow-sm">
        <div className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Calendar size={20} className="text-slate-600" />
            <h3 className="text-lg font-semibold text-gray-900">
              Seleccionar Período
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700">
                Fecha de Inicio
              </label>
              <input
                type="date"
                value={dateRange.from.toISOString().split('T')[0]}
                onChange={(e) => {
                  const newDate = new Date(e.target.value);
                  if (!isNaN(newDate.getTime())) {
                    setDateRange({ ...dateRange, from: newDate });
                  }
                }}
                className="w-full rounded-xl bg-white text-slate-900 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5 text-sm"
              />
              <p className="text-xs text-gray-500">
                {formatearFecha(dateRange.from)}
              </p>
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700">
                Fecha de Fin
              </label>
              <input
                type="date"
                value={dateRange.to.toISOString().split('T')[0]}
                onChange={(e) => {
                  const newDate = new Date(e.target.value);
                  if (!isNaN(newDate.getTime())) {
                    setDateRange({ ...dateRange, to: newDate });
                  }
                }}
                className="w-full rounded-xl bg-white text-slate-900 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5 text-sm"
              />
              <p className="text-xs text-gray-500">
                {formatearFecha(dateRange.to)}
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Error */}
      {error && (
        <Card className="bg-red-50 border border-red-200 shadow-sm">
          <div className="p-4">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-600" />
              <p className="text-red-800">{error}</p>
            </div>
          </div>
        </Card>
      )}

      {/* Métricas principales */}
      {metricas.length > 0 && (
        <MetricCards data={metricas} columns={4} />
      )}

      {/* Gráfico de distribución por nivel de riesgo */}
      {datosDistribucionRiesgo.length > 0 && (
        <Card className="bg-white shadow-sm">
          <div className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <BarChart3 className="w-5 h-5 text-slate-600" />
              <h3 className="text-lg font-semibold text-gray-900">
                Distribución por Nivel de Riesgo
              </h3>
            </div>
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={datosDistribucionRiesgo} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis 
                  dataKey="nivel" 
                  tick={{ fill: '#64748B', fontSize: 12 }}
                  stroke="#9CA3AF"
                />
                <YAxis 
                  tick={{ fill: '#64748B', fontSize: 12 }}
                  stroke="#9CA3AF"
                  label={{ 
                    value: 'Cantidad de Clientes', 
                    angle: -90, 
                    position: 'insideLeft',
                    style: { textAnchor: 'middle', fill: '#64748B', fontSize: 12 }
                  }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Bar dataKey="cantidad" fill="#6366F1" name="Cantidad de Clientes" />
              </BarChart>
            </ResponsiveContainer>
            <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
              {datosDistribucionRiesgo.map((item) => {
                const nivelKey = item.nivel.toLowerCase() as NivelRiesgo;
                return (
                  <div key={item.nivel} className="p-3 bg-gray-50 rounded-lg ring-1 ring-slate-200">
                    <div className="text-sm font-medium text-slate-700 mb-1">{item.nivel}</div>
                    <div className="text-lg font-bold text-gray-900">{item.cantidad}</div>
                    <div className="text-xs text-gray-600">{formatearMoneda(item.importe)}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </Card>
      )}

      {/* Evolución temporal */}
      {datosEvolucionTemporal.length > 0 && (
        <Card className="bg-white shadow-sm">
          <div className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-5 h-5 text-slate-600" />
              <h3 className="text-lg font-semibold text-gray-900">
                Evolución Temporal
              </h3>
            </div>
            <ResponsiveContainer width="100%" height={350}>
              <LineChart data={datosEvolucionTemporal} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis 
                  dataKey="periodo" 
                  tick={{ fill: '#64748B', fontSize: 12 }}
                  stroke="#9CA3AF"
                />
                <YAxis 
                  yAxisId="left"
                  tick={{ fill: '#64748B', fontSize: 12 }}
                  stroke="#9CA3AF"
                  label={{ 
                    value: 'Total Morosidad (COP)', 
                    angle: -90, 
                    position: 'insideLeft',
                    style: { textAnchor: 'middle', fill: '#64748B', fontSize: 12 }
                  }}
                />
                <YAxis 
                  yAxisId="right"
                  orientation="right"
                  tick={{ fill: '#64748B', fontSize: 12 }}
                  stroke="#9CA3AF"
                  label={{ 
                    value: 'Tasa Recuperación (%)', 
                    angle: 90, 
                    position: 'insideRight',
                    style: { textAnchor: 'middle', fill: '#64748B', fontSize: 12 }
                  }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Line 
                  yAxisId="left"
                  type="monotone" 
                  dataKey="totalMorosidad" 
                  stroke="#EF4444" 
                  strokeWidth={3}
                  dot={{ fill: '#EF4444', r: 5 }}
                  activeDot={{ r: 7 }}
                  name="Total Morosidad"
                />
                <Line 
                  yAxisId="right"
                  type="monotone" 
                  dataKey="tasaRecuperacion" 
                  stroke="#10B981" 
                  strokeWidth={3}
                  dot={{ fill: '#10B981', r: 5 }}
                  activeDot={{ r: 7 }}
                  name="Tasa Recuperación (%)"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      )}

      {/* Top clientes morosos */}
      {topClientesMorosos.length > 0 && (
        <Card className="bg-white shadow-sm">
          <div className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Target className="w-5 h-5 text-slate-600" />
              <h3 className="text-lg font-semibold text-gray-900">
                Top 10 Clientes Morosos por Importe
              </h3>
            </div>
            <Table
              data={topClientesMorosos}
              columns={columnasTopMorosos}
              loading={loading}
              emptyMessage="No hay clientes morosos en el período seleccionado"
            />
          </div>
        </Card>
      )}

      {/* Estado de carga */}
      {loading && (
        <Card className="bg-white shadow-sm">
          <div className="p-6 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Cargando reportes...</p>
          </div>
        </Card>
      )}

      {/* Sin datos */}
      {!loading && reportes.length === 0 && !error && (
        <Card className="bg-white shadow-sm">
          <div className="p-12 text-center">
            <BarChart3 className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No hay datos disponibles
            </h3>
            <p className="text-gray-600">
              No se encontraron reportes para el período seleccionado.
            </p>
          </div>
        </Card>
      )}
    </div>
  );
};
