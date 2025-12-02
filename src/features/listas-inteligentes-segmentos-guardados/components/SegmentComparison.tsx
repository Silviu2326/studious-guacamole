import React, { useState, useEffect } from 'react';
import { Card, Button, Select, MetricCards, Badge } from '../../../components/componentsreutilizables';
import { ds } from '../../adherencia/ui/ds';
import { SegmentComparison } from '../types';
import { compareSegments } from '../api/analytics';
import { BarChart3, Users, TrendingUp, DollarSign, Percent } from 'lucide-react';

export const SegmentComparisonComponent: React.FC = () => {
  const [comparison, setComparison] = useState<SegmentComparison | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedSegments, setSelectedSegments] = useState<string[]>(['1', '2']);

  const handleCompare = async () => {
    if (selectedSegments.length < 2) {
      alert('Selecciona al menos 2 segmentos para comparar');
      return;
    }
    
    setLoading(true);
    try {
      const data = await compareSegments(selectedSegments);
      setComparison(data);
    } catch (error) {
      console.error('Error comparando segmentos:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedSegments.length >= 2) {
      handleCompare();
    }
  }, [selectedSegments]);

  const segmentOptions = [
    { value: '1', label: 'Segmento 1 - Mujeres 30-45' },
    { value: '2', label: 'Segmento 2 - Clientes VIP' },
    { value: '3', label: 'Segmento 3 - Riesgo Abandono' }
  ];

  const handleSegmentToggle = (segmentId: string) => {
    if (selectedSegments.includes(segmentId)) {
      if (selectedSegments.length > 2) {
        setSelectedSegments(selectedSegments.filter(id => id !== segmentId));
      }
    } else {
      if (selectedSegments.length < 4) {
        setSelectedSegments([...selectedSegments, segmentId]);
      }
    }
  };

  const metrics = comparison ? comparison.segments.map((segmentId, index) => {
    const segmentName = segmentOptions.find(opt => opt.value === segmentId)?.label || `Segmento ${segmentId}`;
    return [
      {
        id: `members-${segmentId}`,
        title: `Miembros - ${segmentName.split(' - ')[1]}`,
        value: comparison.metrics.memberCount[index].toLocaleString(),
        subtitle: 'Total de miembros',
        icon: <Users className="w-5 h-5" />,
        color: 'primary' as const
      },
      {
        id: `engagement-${segmentId}`,
        title: `Compromiso - ${segmentName.split(' - ')[1]}`,
        value: `${(comparison.metrics.engagementRate[index] * 100).toFixed(1)}%`,
        subtitle: 'Tasa de compromiso',
        icon: <TrendingUp className="w-5 h-5" />,
        color: 'success' as const
      },
      {
        id: `conversion-${segmentId}`,
        title: `Conversión - ${segmentName.split(' - ')[1]}`,
        value: `${(comparison.metrics.conversionRate[index] * 100).toFixed(1)}%`,
        subtitle: 'Tasa de conversión',
        icon: <Percent className="w-5 h-5" />,
        color: 'info' as const
      },
      {
        id: `revenue-${segmentId}`,
        title: `Ingresos - ${segmentName.split(' - ')[1]}`,
        value: `$${comparison.metrics.revenue[index].toLocaleString()}`,
        subtitle: 'Total generado',
        icon: <DollarSign className="w-5 h-5" />,
        color: 'warning' as const
      }
    ];
  }).flat() : [];

  return (
    <div className="space-y-6">
      <Card padding="md">
        <div className="mb-6">
          <h3 className={`${ds.typography.h2} ${ds.color.textPrimary} ${ds.color.textPrimaryDark} mb-4`}>
            Comparación de Segmentos
          </h3>
          <p className={`${ds.typography.bodySmall} ${ds.color.textSecondary} ${ds.color.textSecondaryDark} mb-4`}>
            Compara el rendimiento de múltiples segmentos lado a lado
          </p>
          
          <div className="space-y-3">
            <label className={`block ${ds.typography.bodySmall} font-semibold ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
              Seleccionar Segmentos (2-4 segmentos)
            </label>
            <div className="flex flex-wrap gap-2">
              {segmentOptions.map(option => {
                const isSelected = selectedSegments.includes(option.value);
                return (
                  <Badge
                    key={option.value}
                    className={`cursor-pointer ${
                      isSelected
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                    }`}
                    onClick={() => handleSegmentToggle(option.value)}
                  >
                    {option.label}
                  </Badge>
                );
              })}
            </div>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
            <p className={`${ds.typography.body} ${ds.color.textSecondary} ${ds.color.textSecondaryDark} mt-4`}>
              Comparando segmentos...
            </p>
          </div>
        ) : comparison ? (
          <>
            <MetricCards data={metrics} columns={selectedSegments.length} />

            <div className="mt-6 p-6 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <h4 className={`${ds.typography.h3} ${ds.color.textPrimary} ${ds.color.textPrimaryDark} mb-4`}>
                Comparativa Visual
              </h4>
              <div className="space-y-6">
                {comparison.segments.map((segmentId, index) => {
                  const segmentName = segmentOptions.find(opt => opt.value === segmentId)?.label || `Segmento ${segmentId}`;
                  return (
                    <div key={segmentId} className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className={`${ds.typography.bodySmall} font-semibold ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
                          {segmentName}
                        </span>
                        <span className={`${ds.typography.bodySmall} ${ds.color.textSecondary} ${ds.color.textSecondaryDark}`}>
                          {comparison.metrics.memberCount[index]} miembros
                        </span>
                      </div>
                      <div className="space-y-2">
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs text-gray-600 dark:text-gray-400">Compromiso</span>
                            <span className="text-xs font-semibold">
                              {(comparison.metrics.engagementRate[index] * 100).toFixed(1)}%
                            </span>
                          </div>
                          <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-blue-600 rounded-full"
                              style={{ width: `${comparison.metrics.engagementRate[index] * 100}%` }}
                            />
                          </div>
                        </div>
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs text-gray-600 dark:text-gray-400">Conversión</span>
                            <span className="text-xs font-semibold">
                              {(comparison.metrics.conversionRate[index] * 100).toFixed(1)}%
                            </span>
                          </div>
                          <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-green-600 rounded-full"
                              style={{ width: `${comparison.metrics.conversionRate[index] * 100}%` }}
                            />
                          </div>
                        </div>
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs text-gray-600 dark:text-gray-400">Ingresos</span>
                            <span className="text-xs font-semibold">
                              ${comparison.metrics.revenue[index].toLocaleString()}
                            </span>
                          </div>
                          <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-purple-600 rounded-full"
                              style={{ width: `${Math.min(100, (comparison.metrics.revenue[index] / 50000) * 100)}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className={`${ds.typography.body} ${ds.color.textSecondary} ${ds.color.textSecondaryDark}`}>
              Selecciona al menos 2 segmentos para comparar
            </p>
          </div>
        )}
      </Card>
    </div>
  );
};

