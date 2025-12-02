import { useState, useMemo } from 'react';
import { Users, TrendingUp, TrendingDown, Minus, Sparkles, Filter, X } from 'lucide-react';
import { Card, Badge, Button, Table, Select } from '../../../components/componentsreutilizables';
import type { TableColumn } from '../../../components/componentsreutilizables';
import { CustomerSegment, SegmentSummary, CustomerSegmentType } from '../types';

interface CustomerSegmentationProps {
  segments: CustomerSegment[];
  summary?: SegmentSummary[];
  loading?: boolean;
  onSegmentClick?: (segment: CustomerSegment) => void;
}

const SEGMENT_COLORS: Record<CustomerSegmentType, { bg: string; text: string; border: string }> = {
  embajador: {
    bg: 'bg-emerald-50 dark:bg-emerald-900/20',
    text: 'text-emerald-700 dark:text-emerald-300',
    border: 'border-emerald-200 dark:border-emerald-800',
  },
  nuevo: {
    bg: 'bg-blue-50 dark:bg-blue-900/20',
    text: 'text-blue-700 dark:text-blue-300',
    border: 'border-blue-200 dark:border-blue-800',
  },
  riesgo: {
    bg: 'bg-rose-50 dark:bg-rose-900/20',
    text: 'text-rose-700 dark:text-rose-300',
    border: 'border-rose-200 dark:border-rose-800',
  },
  regular: {
    bg: 'bg-slate-50 dark:bg-slate-800/40',
    text: 'text-slate-700 dark:text-slate-300',
    border: 'border-slate-200 dark:border-slate-700',
  },
  vip: {
    bg: 'bg-purple-50 dark:bg-purple-900/20',
    text: 'text-purple-700 dark:text-purple-300',
    border: 'border-purple-200 dark:border-purple-800',
  },
};

const SEGMENT_LABELS: Record<CustomerSegmentType, string> = {
  embajador: 'Embajadores',
  nuevo: 'Nuevos',
  riesgo: 'En Riesgo',
  regular: 'Regulares',
  vip: 'VIP',
};

const SEGMENT_ICONS: Record<CustomerSegmentType, string> = {
  embajador: '⭐',
  nuevo: '🆕',
  riesgo: '⚠️',
  regular: '👤',
  vip: '👑',
};

export function CustomerSegmentation({
  segments,
  summary = [],
  loading,
  onSegmentClick,
}: CustomerSegmentationProps) {
  const [selectedSegmentType, setSelectedSegmentType] = useState<CustomerSegmentType | 'all'>('all');
  const [selectedSource, setSelectedSource] = useState<'all' | 'ai' | 'manual' | 'rule-based'>('all');

  const filteredSegments = useMemo(() => {
    let filtered = segments;

    if (selectedSegmentType !== 'all') {
      filtered = filtered.filter((s) => s.segmentType === selectedSegmentType);
    }

    if (selectedSource !== 'all') {
      filtered = filtered.filter((s) => s.classificationSource === selectedSource);
    }

    return filtered;
  }, [segments, selectedSegmentType, selectedSource]);

  const segmentColumns: TableColumn<CustomerSegment>[] = useMemo(
    () => [
      {
        key: 'clientName',
        label: 'Cliente',
        render: (_, row) => (
          <div className="space-y-1">
            <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{row.clientName}</p>
            <div className="flex flex-wrap gap-1">
              <SegmentBadge segmentType={row.segmentType} />
              {row.classificationSource === 'ai' && (
                <Badge variant="blue" size="sm" className="text-xs">
                  <Sparkles className="w-3 h-3 mr-1" />
                  IA
                </Badge>
              )}
            </div>
          </div>
        ),
      },
      {
        key: 'metrics',
        label: 'Métricas Clave',
        render: (_, row) => (
          <div className="space-y-1 text-xs">
            {row.metrics.attendanceRate !== undefined && (
              <div className="text-slate-600 dark:text-slate-400">
                Asistencia: <strong>{row.metrics.attendanceRate}%</strong>
              </div>
            )}
            {row.metrics.npsScore !== undefined && (
              <div className="text-slate-600 dark:text-slate-400">
                NPS: <strong>{row.metrics.npsScore}</strong>
              </div>
            )}
            {row.metrics.satisfactionScore !== undefined && (
              <div className="text-slate-600 dark:text-slate-400">
                Satisfacción: <strong>{row.metrics.satisfactionScore.toFixed(1)}/5</strong>
              </div>
            )}
            {row.metrics.referralCount !== undefined && row.metrics.referralCount > 0 && (
              <div className="text-slate-600 dark:text-slate-400">
                Referidos: <strong>{row.metrics.referralCount}</strong>
              </div>
            )}
          </div>
        ),
      },
      {
        key: 'classificationReason',
        label: 'Razón de Clasificación',
        render: (reason) => (
          <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2 max-w-md">{reason}</p>
        ),
      },
      {
        key: 'confidenceScore',
        label: 'Confianza IA',
        render: (_, row) => {
          if (row.classificationSource !== 'ai' || !row.confidenceScore) return <span>-</span>;
          return (
            <div className="flex items-center gap-2">
              <div className="flex-1 bg-slate-200 dark:bg-slate-700 rounded-full h-2 max-w-[80px]">
                <div
                  className={`h-2 rounded-full ${
                    row.confidenceScore >= 85
                      ? 'bg-emerald-500'
                      : row.confidenceScore >= 70
                        ? 'bg-yellow-500'
                        : 'bg-rose-500'
                  }`}
                  style={{ width: `${row.confidenceScore}%` }}
                />
              </div>
              <span className="text-xs font-medium text-slate-600 dark:text-slate-400">{row.confidenceScore}%</span>
            </div>
          );
        },
        width: '40',
      },
      {
        key: 'actions',
        label: 'Acciones',
        align: 'right',
        render: (_, row) => (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onSegmentClick?.(row)}
            className="text-indigo-600 hover:text-indigo-700 dark:text-indigo-300 dark:hover:text-indigo-200"
          >
            Ver detalles
          </Button>
        ),
      },
    ],
    [filteredSegments, onSegmentClick],
  );

  return (
    <Card className="bg-white/90 dark:bg-slate-900/80 shadow-sm border border-slate-200/60 dark:border-slate-800/60">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-indigo-100 to-purple-200 dark:from-indigo-900/40 dark:to-purple-900/30 rounded-xl">
            <Users className="w-5 h-5 text-indigo-600 dark:text-indigo-300" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Segmentación de Clientes con IA</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Clasificación automática de clientes según asistencia, NPS y compras para tratarlos de forma diferenciada
            </p>
          </div>
        </div>
      </div>

      {/* Resumen de segmentos */}
      {summary && summary.length > 0 && (
        <div className="mb-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {summary.map((seg) => (
            <div
              key={seg.segmentType}
              className={`p-4 rounded-lg border ${SEGMENT_COLORS[seg.segmentType].border} ${SEGMENT_COLORS[seg.segmentType].bg}`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{SEGMENT_ICONS[seg.segmentType]}</span>
                  <span className={`text-sm font-semibold ${SEGMENT_COLORS[seg.segmentType].text}`}>
                    {SEGMENT_LABELS[seg.segmentType]}
                  </span>
                </div>
                {seg.trend && (
                  <TrendIcon
                    trend={seg.trend}
                    change={seg.change}
                    className={SEGMENT_COLORS[seg.segmentType].text}
                  />
                )}
              </div>
              <div className="space-y-1">
                <p className={`text-2xl font-bold ${SEGMENT_COLORS[seg.segmentType].text}`}>{seg.count}</p>
                <p className={`text-xs ${SEGMENT_COLORS[seg.segmentType].text} opacity-75`}>
                  {seg.percentage.toFixed(1)}% del total
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Filtros */}
      <div className="mb-6 flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-500 dark:text-slate-400" />
          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Filtros:</span>
        </div>
        <Select
          value={selectedSegmentType}
          onChange={(value) => setSelectedSegmentType(value as CustomerSegmentType | 'all')}
          options={[
            { label: 'Todos los segmentos', value: 'all' },
            ...Object.entries(SEGMENT_LABELS).map(([value, label]) => ({
              label: `${SEGMENT_ICONS[value as CustomerSegmentType]} ${label}`,
              value,
            })),
          ]}
          className="min-w-[200px]"
        />
        <Select
          value={selectedSource}
          onChange={(value) => setSelectedSource(value as 'all' | 'ai' | 'manual' | 'rule-based')}
          options={[
            { label: 'Todas las fuentes', value: 'all' },
            { label: '🤖 Clasificación IA', value: 'ai' },
            { label: '✋ Manual', value: 'manual' },
            { label: '📋 Basado en reglas', value: 'rule-based' },
          ]}
          className="min-w-[180px]"
        />
        {(selectedSegmentType !== 'all' || selectedSource !== 'all') && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setSelectedSegmentType('all');
              setSelectedSource('all');
            }}
            leftIcon={<X className="w-4 h-4" />}
          >
            Limpiar filtros
          </Button>
        )}
      </div>

      {/* Tabla de segmentos */}
      <Table
        data={filteredSegments}
        columns={segmentColumns}
        loading={loading}
        emptyMessage="No hay clientes en este segmento."
      />
    </Card>
  );
}

function SegmentBadge({ segmentType }: { segmentType: CustomerSegmentType }) {
  return (
    <Badge
      variant={segmentType === 'embajador' ? 'green' : segmentType === 'riesgo' ? 'destructive' : 'blue'}
      size="sm"
    >
      {SEGMENT_ICONS[segmentType]} {SEGMENT_LABELS[segmentType]}
    </Badge>
  );
}

function TrendIcon({ trend, change, className }: { trend: 'up' | 'down' | 'steady'; change?: number; className?: string }) {
  const Icon = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : Minus;
  return (
    <div className={`flex items-center gap-1 ${className}`}>
      <Icon className="w-4 h-4" />
      {change !== undefined && change !== 0 && (
        <span className="text-xs font-medium">
          {change > 0 ? '+' : ''}
          {change}
        </span>
      )}
    </div>
  );
}

