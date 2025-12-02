import React, { useState, useEffect } from 'react';
import { Card, MetricCards, Table, Select } from '../../../components/componentsreutilizables';
import { getAnalyticsAusencias } from '../api';
import { AnalyticsAusencias as AnalyticsAusenciasType } from '../types';
import { TrendingUp, TrendingDown, Minus, UserX, AlertTriangle, DollarSign, Loader2 } from 'lucide-react';

export const AnalyticsAusencias: React.FC = () => {
  const [analytics, setAnalytics] = useState<AnalyticsAusenciasType | null>(null);
  const [loading, setLoading] = useState(true);
  const [periodo, setPeriodo] = useState<'diario' | 'semanal' | 'mensual'>('mensual');

  useEffect(() => {
    cargarAnalytics();
  }, [periodo]);

  const cargarAnalytics = async () => {
    try {
      setLoading(true);
      const data = await getAnalyticsAusencias(periodo);
      setAnalytics(data);
    } catch (error) {
      console.error('Error al cargar analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTendenciaIcon = (tendencia: string) => {
    switch (tendencia) {
      case 'aumentando':
        return <TrendingUp className="w-5 h-5 text-red-500" />;
      case 'disminuyendo':
        return <TrendingDown className="w-5 h-5 text-green-500" />;
      default:
        return <Minus className="w-5 h-5 text-gray-500" />;
    }
  };

  if (!analytics) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
      </div>
    );
  }

  const metricas = [
    {
      id: 'total-ausencias',
      title: 'Total Ausencias',
      value: analytics.totalAusencias,
      subtitle: `Período: ${periodo}`,
      icon: <UserX className="w-6 h-6" />,
      color: 'error' as const,
    },
    {
      id: 'tasa-ausencias',
      title: 'Tasa de Ausencias',
      value: `${analytics.tasaAusencias.toFixed(1)}%`,
      subtitle: `Tendencia: ${analytics.tendencia}`,
      icon: <AlertTriangle className="w-6 h-6" />,
      color: 'warning' as const,
    },
    {
      id: 'impacto-financiero',
      title: 'Impacto Financiero',
      value: `€${analytics.impactoFinanciero}`,
      subtitle: 'Pérdidas estimadas',
      icon: <DollarSign className="w-6 h-6" />,
      color: 'error' as const,
    },
    {
      id: 'no-show',
      title: 'No Show',
      value: analytics.ausenciasPorTipo.no_show,
      subtitle: 'Sin aviso previo',
      icon: <UserX className="w-6 h-6" />,
      color: 'error' as const,
    },
  ];

  const columnsClases = [
    {
      key: 'nombreClase',
      label: 'Clase',
      render: (value: string) => <div className="font-semibold">{value}</div>,
    },
    {
      key: 'ausencias',
      label: 'Ausencias',
      render: (value: number) => (
        <div className="flex items-center gap-2">
          <span className="font-semibold">{value}</span>
        </div>
      ),
    },
  ];

  const columnsSocios = [
    {
      key: 'nombre',
      label: 'Socio',
      render: (value: string) => <div className="font-semibold">{value}</div>,
    },
    {
      key: 'ausencias',
      label: 'Ausencias',
      render: (value: number) => (
        <div className="flex items-center gap-2">
          <span className="font-semibold">{value}</span>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <Card>
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className={`${ds.typography.h3} ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
              Analytics de Ausencias
            </h3>
            <Select
              value={periodo}
              onChange={(e) => setPeriodo(e.target.value as 'diario' | 'semanal' | 'mensual')}
              options={[
                { value: 'diario', label: 'Diario' },
                { value: 'semanal', label: 'Semanal' },
                { value: 'mensual', label: 'Mensual' },
              ]}
            />
          </div>

          <MetricCards data={metricas} columns={4} />

          <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div className="flex items-center gap-3">
              <span className={`${ds.typography.bodyMedium} font-semibold ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
                Tendencia:
              </span>
              {getTendenciaIcon(analytics.tendencia)}
              <span className={`${ds.typography.body} ${ds.color.textSecondary} ${ds.color.textSecondaryDark} capitalize`}>
                {analytics.tendencia}
              </span>
            </div>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <div className="p-6">
            <h4 className={`${ds.typography.h4} ${ds.color.textPrimary} ${ds.color.textPrimaryDark} mb-4`}>
              Clases Más Afectadas
            </h4>
            <Table
              data={analytics.clasesMasAfectadas}
              columns={columnsClases}
              loading={loading}
              emptyMessage="No hay datos disponibles"
            />
          </div>
        </Card>

        <Card>
          <div className="p-6">
            <h4 className={`${ds.typography.h4} ${ds.color.textPrimary} ${ds.color.textPrimaryDark} mb-4`}>
              Socios Más Ausentes
            </h4>
            <Table
              data={analytics.sociosMasAusentes}
              columns={columnsSocios}
              loading={loading}
              emptyMessage="No hay datos disponibles"
            />
          </div>
        </Card>
      </div>

      <Card>
        <div className="p-6">
          <h4 className={`${ds.typography.h4} ${ds.color.textPrimary} ${ds.color.textPrimaryDark} mb-4`}>
            Ausencias por Tipo
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <UserX className="w-5 h-5 text-red-600" />
                <span className={`${ds.typography.bodyMedium} font-semibold ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
                  No Show
                </span>
              </div>
              <p className={`${ds.typography.h2} ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
                {analytics.ausenciasPorTipo.no_show}
              </p>
            </div>
            <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="w-5 h-5 text-orange-600" />
                <span className={`${ds.typography.bodyMedium} font-semibold ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
                  Cancelación Tardía
                </span>
              </div>
              <p className={`${ds.typography.h2} ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
                {analytics.ausenciasPorTipo.cancelacion_tardia}
              </p>
            </div>
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Minus className="w-5 h-5 text-blue-600" />
                <span className={`${ds.typography.bodyMedium} font-semibold ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
                  Justificadas
                </span>
              </div>
              <p className={`${ds.typography.h2} ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
                {analytics.ausenciasPorTipo.ausencia_justificada}
              </p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

