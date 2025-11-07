import React, { useState, useEffect } from 'react';
import { Card, Table } from '../../../components/componentsreutilizables';
import { getComparisonReports } from '../api';
import { ComparisonReport } from '../types';
import { TrendingUp, TrendingDown, FileText } from 'lucide-react';

export const ComparisonReports: React.FC = () => {
  const [reports, setReports] = useState<ComparisonReport[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = async () => {
    setLoading(true);
    try {
      const data = await getComparisonReports();
      setReports(data);
    } catch (error) {
      console.error('Error cargando reportes:', error);
    } finally {
      setLoading(false);
    }
  };

  const tableColumns = [
    {
      key: 'period',
      label: 'Período',
      render: (value: string) => (
        <span className="text-sm font-semibold text-gray-900">
          {value}
        </span>
      ),
    },
    {
      key: 'nps',
      label: 'NPS',
      render: (_: any, row: ComparisonReport) => {
        const nps = row.metrics.nps.score;
        const isPositive = nps >= 50;
        return (
          <div className="flex items-center gap-2">
            {isPositive ? (
              <TrendingUp className="w-4 h-4 text-green-600" />
            ) : (
              <TrendingDown className="w-4 h-4 text-red-600" />
            )}
            <span className={`font-bold ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
              {nps}
            </span>
          </div>
        );
      },
    },
    {
      key: 'csat',
      label: 'CSAT',
      render: (_: any, row: ComparisonReport) => {
        const csat = row.metrics.csat.average;
        const isPositive = csat >= 4;
        return (
          <div className="flex items-center gap-2">
            {isPositive ? (
              <TrendingUp className="w-4 h-4 text-green-600" />
            ) : (
              <TrendingDown className="w-4 h-4 text-red-600" />
            )}
            <span className={`font-bold ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
              {csat.toFixed(1)}
            </span>
          </div>
        );
      },
    },
    {
      key: 'promotors',
      label: 'Promotores',
      render: (_: any, row: ComparisonReport) => (
        <span className="text-sm text-gray-900">
          {row.metrics.nps.promotors}
        </span>
      ),
    },
    {
      key: 'detractors',
      label: 'Detractores',
      render: (_: any, row: ComparisonReport) => (
        <span className="text-sm text-gray-900">
          {row.metrics.nps.detractors}
        </span>
      ),
    },
    {
      key: 'total',
      label: 'Total Respuestas',
      render: (_: any, row: ComparisonReport) => (
        <span className="text-sm text-gray-900">
          {row.metrics.nps.total + row.metrics.csat.total}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <Card className="p-4 bg-white shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-blue-100 rounded-xl ring-1 ring-blue-200/70">
            <FileText size={24} className="text-blue-600" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900">
              Reportes Comparativos
            </h3>
            <p className="text-sm text-gray-600">
              Comparación de métricas entre períodos, equipos y departamentos
            </p>
          </div>
        </div>

        <Table
          data={reports}
          columns={tableColumns}
          loading={loading}
          emptyMessage="No hay reportes disponibles"
        />
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {reports.length > 0 && (
          <>
            <Card className="p-4 bg-white shadow-sm">
              <h4 className="text-xl font-bold text-gray-900 mb-4">
                Evolución NPS
              </h4>
              <div className="space-y-3">
                {reports.map((report, index) => {
                  const previous = index < reports.length - 1 ? reports[index + 1] : null;
                  const change = previous
                    ? report.metrics.nps.score - previous.metrics.nps.score
                    : 0;
                  return (
                    <div key={report.period} className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">
                        {report.period}
                      </span>
                      <div className="flex items-center gap-3">
                        <div className="w-48 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              report.metrics.nps.score >= 50 ? 'bg-green-500' : 'bg-yellow-500'
                            }`}
                            style={{ width: `${Math.min((report.metrics.nps.score + 100) / 2, 100)}%` }}
                          />
                        </div>
                        <span className="text-sm font-semibold text-gray-900 w-12 text-right">
                          {report.metrics.nps.score}
                        </span>
                        {change !== 0 && (
                          <span
                            className={`text-xs ${
                              change > 0 ? 'text-green-600' : 'text-red-600'
                            }`}
                          >
                            {change > 0 ? '+' : ''}
                            {change}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>

            <Card className="p-4 bg-white shadow-sm">
              <h4 className="text-xl font-bold text-gray-900 mb-4">
                Evolución CSAT
              </h4>
              <div className="space-y-3">
                {reports.map((report, index) => {
                  const previous = index < reports.length - 1 ? reports[index + 1] : null;
                  const change = previous
                    ? report.metrics.csat.average - previous.metrics.csat.average
                    : 0;
                  return (
                    <div key={report.period} className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">
                        {report.period}
                      </span>
                      <div className="flex items-center gap-3">
                        <div className="w-48 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              report.metrics.csat.average >= 4 ? 'bg-green-500' : 'bg-yellow-500'
                            }`}
                            style={{ width: `${(report.metrics.csat.average / 5) * 100}%` }}
                          />
                        </div>
                        <span className="text-sm font-semibold text-gray-900 w-12 text-right">
                          {report.metrics.csat.average.toFixed(1)}
                        </span>
                        {change !== 0 && (
                          <span
                            className={`text-xs ${
                              change > 0 ? 'text-green-600' : 'text-red-600'
                            }`}
                          >
                            {change > 0 ? '+' : ''}
                            {change.toFixed(1)}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          </>
        )}
      </div>
    </div>
  );
};

