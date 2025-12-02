import React, { useState, useEffect } from 'react';
import { Card, Button, Table, Badge, MetricCards } from '../../../components/componentsreutilizables';
import { ds } from '../../adherencia/ui/ds';
import { PredictiveSegment } from '../types';
import { getPredictiveSegments, predictSegment } from '../api/analytics';
import { Brain, TrendingUp, Users, Target } from 'lucide-react';

export const PredictiveSegmentation: React.FC = () => {
  const [segments, setSegments] = useState<PredictiveSegment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPredictiveSegments();
  }, []);

  const loadPredictiveSegments = async () => {
    setLoading(true);
    try {
      const data = await getPredictiveSegments();
      setSegments(data);
    } catch (error) {
      console.error('Error cargando segmentos predictivos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGeneratePrediction = async () => {
    try {
      const newSegment = await predictSegment({
        attendanceRate: { min: 0.7 },
        daysSinceLastVisit: { max: 7 }
      });
      setSegments([...segments, newSegment]);
    } catch (error) {
      console.error('Error generando predicción:', error);
    }
  };

  const getModelTypeLabel = (type: string) => {
    const labels = {
      churn: 'Abandono',
      upsell: 'Upsell',
      engagement: 'Compromiso',
      conversion: 'Conversión'
    };
    return labels[type as keyof typeof labels] || type;
  };

  const getModelTypeColor = (type: string) => {
    const colors = {
      churn: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
      upsell: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      engagement: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      conversion: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
    };
    return colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const totalMembers = segments.reduce((sum, s) => sum + s.memberCount, 0);
  const avgConfidence = segments.length > 0
    ? segments.reduce((sum, s) => sum + s.confidence, 0) / segments.length
    : 0;

  const metrics = [
    {
      id: 'total-segments',
      title: 'Segmentos Predictivos',
      value: segments.length,
      subtitle: 'Modelos activos',
      icon: <Brain className="w-5 h-5" />,
      color: 'primary' as const
    },
    {
      id: 'total-members',
      title: 'Miembros Totales',
      value: totalMembers.toLocaleString(),
      subtitle: 'En todos los segmentos',
      icon: <Users className="w-5 h-5" />,
      color: 'info' as const
    },
    {
      id: 'avg-confidence',
      title: 'Confianza Media',
      value: `${(avgConfidence * 100).toFixed(1)}%`,
      subtitle: 'Promedio de confianza',
      icon: <Target className="w-5 h-5" />,
      color: 'success' as const
    }
  ];

  const columns = [
    {
      key: 'name',
      label: 'Nombre del Segmento',
      sortable: true,
      render: (value: string, row: PredictiveSegment) => (
        <div>
          <div className="font-semibold">{value}</div>
          <div className="text-xs text-gray-500 mt-1">
            Modelo: {getModelTypeLabel(row.modelType)}
          </div>
        </div>
      )
    },
    {
      key: 'modelType',
      label: 'Tipo de Modelo',
      sortable: true,
      render: (value: string) => (
        <Badge className={getModelTypeColor(value)}>
          {getModelTypeLabel(value)}
        </Badge>
      )
    },
    {
      key: 'confidence',
      label: 'Confianza',
      sortable: true,
      align: 'center' as const,
      render: (value: number) => (
        <div className="flex items-center justify-center gap-2">
          <div className={`text-lg font-bold ${
            value >= 0.8 ? 'text-green-600' :
            value >= 0.6 ? 'text-yellow-600' :
            'text-red-600'
          }`}>
            {(value * 100).toFixed(1)}%
          </div>
        </div>
      )
    },
    {
      key: 'memberCount',
      label: 'Miembros',
      sortable: true,
      align: 'center' as const,
      render: (value: number) => (
        <div className="flex items-center justify-center gap-2">
          <Users className="w-4 h-4 text-gray-400" />
          <span className="font-semibold">{value.toLocaleString()}</span>
        </div>
      )
    },
    {
      key: 'criteria',
      label: 'Criterios',
      render: (value: Record<string, any>) => (
        <div className="text-sm space-y-1">
          {Object.entries(value).slice(0, 2).map(([key, val]) => (
            <div key={key} className="text-gray-600 dark:text-gray-400">
              <span className="font-medium">{key}:</span> {JSON.stringify(val)}
            </div>
          ))}
        </div>
      )
    },
    {
      key: 'createdAt',
      label: 'Creado',
      sortable: true,
      render: (value: string) => {
        const date = new Date(value);
        return (
          <div className="text-sm">
            {date.toLocaleDateString('es-ES', { 
              day: '2-digit', 
              month: 'short', 
              year: 'numeric' 
            })}
          </div>
        );
      }
    }
  ];

  return (
    <div className="space-y-6">
      <MetricCards data={metrics} columns={3} />

      <Card padding="md">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className={`${ds.typography.h2} ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
              Segmentación Predictiva
            </h3>
            <p className={`${ds.typography.bodySmall} ${ds.color.textSecondary} ${ds.color.textSecondaryDark} mt-1`}>
              Segmentación basada en modelos de machine learning
            </p>
          </div>
          <Button variant="primary" size="md" onClick={handleGeneratePrediction}>
            <Brain className="w-4 h-4 mr-2" />
            Generar Predicción
          </Button>
        </div>

        <Table
          data={segments}
          columns={columns}
          loading={loading}
          emptyMessage="No se encontraron segmentos predictivos"
        />
      </Card>
    </div>
  );
};

