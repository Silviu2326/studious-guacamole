import React, { useState, useEffect } from 'react';
import { Card, Table, Select, MetricCards } from '../../../components/componentsreutilizables';
import { ds } from '../../adherencia/ui/ds';
import { BehaviorPattern } from '../types';
import { getBehaviorPatterns } from '../api/behavior';
import { Activity, TrendingUp, AlertTriangle, ShoppingBag } from 'lucide-react';

export const BehaviorAnalyzer: React.FC = () => {
  const [patterns, setPatterns] = useState<BehaviorPattern[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState<string>('all');

  useEffect(() => {
    loadPatterns();
  }, [filterType]);

  const loadPatterns = async () => {
    setLoading(true);
    try {
      const data = await getBehaviorPatterns(undefined, filterType === 'all' ? undefined : filterType);
      setPatterns(data);
    } catch (error) {
      console.error('Error cargando patrones:', error);
    } finally {
      setLoading(false);
    }
  };

  const getPatternIcon = (type: string) => {
    const icons = {
      attendance: Activity,
      purchase: ShoppingBag,
      engagement: TrendingUp,
      risk: AlertTriangle
    };
    return icons[type as keyof typeof icons] || Activity;
  };

  const getPatternLabel = (type: string) => {
    const labels = {
      attendance: 'Asistencia',
      purchase: 'Compra',
      engagement: 'Compromiso',
      risk: 'Riesgo'
    };
    return labels[type as keyof typeof labels] || type;
  };

  const getScoreColor = (score: number) => {
    if (score >= 0.8) return 'text-red-600 dark:text-red-400';
    if (score >= 0.6) return 'text-orange-600 dark:text-orange-400';
    if (score >= 0.4) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-green-600 dark:text-green-400';
  };

  const riskPatterns = patterns.filter(p => p.patternType === 'risk').length;
  const engagementPatterns = patterns.filter(p => p.patternType === 'engagement').length;
  const avgScore = patterns.length > 0 
    ? patterns.reduce((sum, p) => sum + p.score, 0) / patterns.length 
    : 0;

  const metrics = [
    {
      id: 'total-patterns',
      title: 'Patrones Detectados',
      value: patterns.length,
      subtitle: 'Total analizados',
      icon: <Activity className="w-5 h-5" />,
      color: 'primary' as const
    },
    {
      id: 'risk-patterns',
      title: 'Patrones de Riesgo',
      value: riskPatterns,
      subtitle: 'Requieren atención',
      icon: <AlertTriangle className="w-5 h-5" />,
      color: 'warning' as const
    },
    {
      id: 'engagement-patterns',
      title: 'Alto Compromiso',
      value: engagementPatterns,
      subtitle: 'Clientes comprometidos',
      icon: <TrendingUp className="w-5 h-5" />,
      color: 'success' as const
    },
    {
      id: 'avg-score',
      title: 'Puntuación Media',
      value: `${(avgScore * 100).toFixed(1)}%`,
      subtitle: 'Puntuación promedio',
      icon: <Activity className="w-5 h-5" />,
      color: 'info' as const
    }
  ];

  const columns = [
    {
      key: 'clientName',
      label: 'Cliente',
      sortable: true,
      render: (value: string, row: BehaviorPattern) => (
        <div>
          <div className="font-semibold">{value}</div>
          <div className="text-xs text-gray-500">ID: {row.clientId}</div>
        </div>
      )
    },
    {
      key: 'patternType',
      label: 'Tipo de Patrón',
      sortable: true,
      render: (value: string) => {
        const Icon = getPatternIcon(value);
        return (
          <div className="flex items-center gap-2">
            <Icon className="w-4 h-4 text-gray-400" />
            <span>{getPatternLabel(value)}</span>
          </div>
        );
      }
    },
    {
      key: 'score',
      label: 'Puntuación',
      sortable: true,
      align: 'center' as const,
      render: (value: number) => (
        <div className={`font-bold text-lg ${getScoreColor(value)}`}>
          {(value * 100).toFixed(0)}%
        </div>
      )
    },
    {
      key: 'details',
      label: 'Detalles',
      render: (value: Record<string, any>) => (
        <div className="text-sm space-y-1">
          {Object.entries(value).slice(0, 2).map(([key, val]) => (
            <div key={key} className="text-gray-600 dark:text-gray-400">
              <span className="font-medium">{key}:</span> {String(val)}
            </div>
          ))}
        </div>
      )
    },
    {
      key: 'detectedAt',
      label: 'Detectado',
      sortable: true,
      render: (value: string) => {
        const date = new Date(value);
        return (
          <div className="text-sm">
            {date.toLocaleDateString('es-ES', { 
              day: '2-digit', 
              month: 'short', 
              hour: '2-digit', 
              minute: '2-digit' 
            })}
          </div>
        );
      }
    }
  ];

  return (
    <div className="space-y-6">
      <MetricCards data={metrics} columns={4} />

      <Card padding="md">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className={`${ds.typography.h2} ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
              Análisis de Comportamiento
            </h3>
            <p className={`${ds.typography.bodySmall} ${ds.color.textSecondary} ${ds.color.textSecondaryDark} mt-1`}>
              Patrones de comportamiento detectados automáticamente
            </p>
          </div>
          <Select
            options={[
              { value: 'all', label: 'Todos los tipos' },
              { value: 'attendance', label: 'Asistencia' },
              { value: 'purchase', label: 'Compra' },
              { value: 'engagement', label: 'Compromiso' },
              { value: 'risk', label: 'Riesgo' }
            ]}
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="w-48"
            fullWidth={false}
          />
        </div>

        <Table
          data={patterns}
          columns={columns}
          loading={loading}
          emptyMessage="No se encontraron patrones de comportamiento"
        />
      </Card>
    </div>
  );
};

