import React, { useState, useEffect } from 'react';
import { Card, Button, MetricCards, Badge, Table, TableColumn } from '../../../components/componentsreutilizables';
import { EstadisticasMorosidad, PagoPendiente } from '../types';
import { morosidadAPI } from '../api/morosidad';
import { FileDown, TrendingUp, TrendingDown, DollarSign, AlertCircle, BarChart3 } from 'lucide-react';

interface ReportesMorosidadProps {
  onRefresh?: () => void;
}

export const ReportesMorosidad: React.FC<ReportesMorosidadProps> = ({ onRefresh }) => {
  const [estadisticas, setEstadisticas] = useState<EstadisticasMorosidad | null>(null);
  const [pagos, setPagos] = useState<PagoPendiente[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    setLoading(true);
    try {
      const [estadisticasData, pagosData] = await Promise.all([
        morosidadAPI.obtenerEstadisticas(),
        morosidadAPI.obtenerPagosPendientes()
      ]);
      setEstadisticas(estadisticasData);
      setPagos(pagosData);
    } catch (error) {
      console.error('Error al cargar datos:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatearMoneda = (valor: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(valor);
  };

  const handleExportarReporte = () => {
    // TODO: Implementar exportación a PDF/Excel
    console.log('Exportar reporte');
  };

  const metricas = estadisticas ? [
    {
      id: 'total-pendientes',
      title: 'Total Pendientes',
      value: estadisticas.totalPendientes.toString(),
      subtitle: formatearMoneda(estadisticas.montoTotalPendiente),
      icon: <DollarSign className="w-6 h-6" />,
      color: 'warning' as const
    },
    {
      id: 'total-vencidos',
      title: 'Vencidos',
      value: estadisticas.totalVencidos.toString(),
      subtitle: formatearMoneda(estadisticas.montoTotalVencido),
      icon: <AlertCircle className="w-6 h-6" />,
      color: 'error' as const
    },
    {
      id: 'promedio-retraso',
      title: 'Promedio Retraso',
      value: `${Math.round(estadisticas.promedioDiasRetraso)} días`,
      subtitle: 'Tiempo promedio de mora',
      icon: <TrendingDown className="w-6 h-6" />,
      color: 'warning' as const
    },
    {
      id: 'tasa-recuperacion',
      title: 'Tasa Recuperación',
      value: `${(estadisticas.tasaRecuperacion * 100).toFixed(1)}%`,
      subtitle: 'Porcentaje de éxito',
      icon: <TrendingUp className="w-6 h-6" />,
      color: 'success' as const
    },
    {
      id: 'casos-criticos',
      title: 'Casos Críticos',
      value: estadisticas.casosCriticos.toString(),
      subtitle: 'Requieren atención inmediata',
      icon: <AlertCircle className="w-6 h-6" />,
      color: 'error' as const
    }
  ] : [];

  const topMorosos = pagos
    .sort((a, b) => b.montoPendiente - a.montoPendiente)
    .slice(0, 10);

  const columnasTopMorosos: TableColumn<PagoPendiente>[] = [
    {
      key: 'numeroFactura',
      label: 'Factura',
      render: (_, row) => (
        <div className="font-medium">{row.numeroFactura}</div>
      )
    },
    {
      key: 'cliente',
      label: 'Cliente',
      render: (_, row) => row.cliente.nombre
    },
    {
      key: 'diasRetraso',
      label: 'Días Retraso',
      render: (_, row) => (
        <Badge variant={row.diasRetraso > 30 ? 'red' : row.diasRetraso > 15 ? 'yellow' : 'green'} size="sm">
          {row.diasRetraso} días
        </Badge>
      )
    },
    {
      key: 'montoPendiente',
      label: 'Monto',
      render: (_, row) => formatearMoneda(row.montoPendiente),
      align: 'right'
    },
    {
      key: 'nivelMorosidad',
      label: 'Nivel',
      render: (_, row) => (
        <Badge 
          variant={row.nivelMorosidad === 'negro' || row.nivelMorosidad === 'rojo' ? 'red' : 
                  row.nivelMorosidad === 'naranja' ? 'yellow' : 'green'} 
          size="sm"
        >
          {row.nivelMorosidad}
        </Badge>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            Reportes de Morosidad
          </h2>
          <p className="text-gray-600">
            Análisis detallado y métricas de morosidad
          </p>
        </div>
        <Button
          variant="secondary"
          onClick={handleExportarReporte}
        >
          <FileDown className="w-4 h-4 mr-2" />
          Exportar Reporte
        </Button>
      </div>

      {/* Métricas principales */}
      <MetricCards data={metricas} columns={5} />

      {/* Desglose por nivel */}
      {estadisticas && (
        <Card className="bg-white shadow-sm">
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Desglose por Nivel de Morosidad
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {Object.entries(estadisticas.porNivel).map(([nivel, datos]) => (
                <div key={nivel} className="p-4 bg-gray-50 rounded-lg ring-1 ring-slate-200">
                  <div className="text-sm font-medium text-slate-700 mb-1 capitalize">{nivel}</div>
                  <div className="text-2xl font-bold text-gray-900">{datos.cantidad}</div>
                  <div className="text-sm text-gray-600">{formatearMoneda(datos.monto)}</div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      )}

      {/* Top morosos */}
      <Card className="bg-white shadow-sm">
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Top 10 Morosos por Monto
          </h3>
          <Table
            data={topMorosos}
            columns={columnasTopMorosos}
            loading={loading}
            emptyMessage="No hay datos disponibles"
          />
        </div>
      </Card>

      {/* Análisis adicional */}
      {estadisticas && (
        <Card className="bg-white shadow-sm">
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Análisis de Situación
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg ring-1 ring-blue-200">
                <span className="font-medium text-gray-900">Total en mora:</span>
                <span className="font-bold text-blue-700">{formatearMoneda(estadisticas.montoTotalVencido)}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg ring-1 ring-yellow-200">
                <span className="font-medium text-gray-900">Promedio días de retraso:</span>
                <span className="font-bold text-yellow-700">{Math.round(estadisticas.promedioDiasRetraso)} días</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg ring-1 ring-green-200">
                <span className="font-medium text-gray-900">Tasa de recuperación:</span>
                <span className="font-bold text-green-700">{(estadisticas.tasaRecuperacion * 100).toFixed(1)}%</span>
              </div>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

