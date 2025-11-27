import React, { useState, useEffect, useMemo } from 'react';
import { ComparisonData } from '../types';
import { comparePeriods } from '../api/performance';
import { Card, Button, Select, Table } from '../../../components/componentsreutilizables';
import { TrendingUp, TrendingDown, Minus, Calendar, Loader2, BarChart3 } from 'lucide-react';

interface ComparisonToolProps {
  role: 'entrenador' | 'gimnasio';
  onError?: (errorMessage: string) => void;
}

type PresetOption = {
  value: string;
  label: string;
  getPeriodA: () => { start: string; end: string };
  getPeriodB: () => { start: string; end: string };
};

export const ComparisonTool: React.FC<ComparisonToolProps> = ({ role, onError }) => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<ComparisonData | null>(null);
  const [preset, setPreset] = useState<string>('this-month-vs-last-month');
  
  // Fechas para Periodo A (actual)
  const [periodAStart, setPeriodAStart] = useState<string>('');
  const [periodAEnd, setPeriodAEnd] = useState<string>('');
  
  // Fechas para Periodo B (anterior)
  const [periodBStart, setPeriodBStart] = useState<string>('');
  const [periodBEnd, setPeriodBEnd] = useState<string>('');

  const presetOptions: PresetOption[] = useMemo(() => [
    {
      value: 'this-month-vs-last-month',
      label: 'Este mes vs Mes pasado',
      getPeriodA: () => {
        const now = new Date();
        const start = new Date(now.getFullYear(), now.getMonth(), 1);
        const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        return {
          start: start.toISOString().split('T')[0],
          end: end.toISOString().split('T')[0],
        };
      },
      getPeriodB: () => {
        const now = new Date();
        const start = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const end = new Date(now.getFullYear(), now.getMonth(), 0);
        return {
          start: start.toISOString().split('T')[0],
          end: end.toISOString().split('T')[0],
        };
      },
    },
    {
      value: 'this-quarter-vs-last-quarter',
      label: 'Este trimestre vs Trimestre pasado',
      getPeriodA: () => {
        const now = new Date();
        const quarter = Math.floor(now.getMonth() / 3);
        const start = new Date(now.getFullYear(), quarter * 3, 1);
        const end = new Date(now.getFullYear(), (quarter + 1) * 3, 0);
        return {
          start: start.toISOString().split('T')[0],
          end: end.toISOString().split('T')[0],
        };
      },
      getPeriodB: () => {
        const now = new Date();
        const quarter = Math.floor(now.getMonth() / 3);
        const prevQuarter = quarter === 0 ? 3 : quarter - 1;
        const prevYear = quarter === 0 ? now.getFullYear() - 1 : now.getFullYear();
        const start = new Date(prevYear, prevQuarter * 3, 1);
        const end = new Date(prevYear, (prevQuarter + 1) * 3, 0);
        return {
          start: start.toISOString().split('T')[0],
          end: end.toISOString().split('T')[0],
        };
      },
    },
    {
      value: 'last-30-days-vs-previous-30-days',
      label: 'Últimos 30 días vs 30 días anteriores',
      getPeriodA: () => {
        const end = new Date();
        const start = new Date();
        start.setDate(start.getDate() - 30);
        return {
          start: start.toISOString().split('T')[0],
          end: end.toISOString().split('T')[0],
        };
      },
      getPeriodB: () => {
        const end = new Date();
        end.setDate(end.getDate() - 30);
        const start = new Date();
        start.setDate(start.getDate() - 60);
        return {
          start: start.toISOString().split('T')[0],
          end: end.toISOString().split('T')[0],
        };
      },
    },
    {
      value: 'custom',
      label: 'Personalizado',
      getPeriodA: () => ({ start: periodAStart || '', end: periodAEnd || '' }),
      getPeriodB: () => ({ start: periodBStart || '', end: periodBEnd || '' }),
    },
  ], [periodAStart, periodAEnd, periodBStart, periodBEnd]);

  // Inicializar fechas con preset por defecto
  useEffect(() => {
    const presetOption = presetOptions.find(p => p.value === preset);
    if (presetOption) {
      const periodA = presetOption.getPeriodA();
      const periodB = presetOption.getPeriodB();
      setPeriodAStart(periodA.start);
      setPeriodAEnd(periodA.end);
      setPeriodBStart(periodB.start);
      setPeriodBEnd(periodB.end);
    }
  }, [preset, presetOptions]);

  const handlePresetChange = (value: string) => {
    setPreset(value);
    if (value !== 'custom') {
      const presetOption = presetOptions.find(p => p.value === value);
      if (presetOption) {
        const periodA = presetOption.getPeriodA();
        const periodB = presetOption.getPeriodB();
        setPeriodAStart(periodA.start);
        setPeriodAEnd(periodA.end);
        setPeriodBStart(periodB.start);
        setPeriodBEnd(periodB.end);
      }
    }
  };

  const handleCompare = async () => {
    if (!periodAStart || !periodAEnd || !periodBStart || !periodBEnd) {
      alert('Por favor, completa todas las fechas');
      return;
    }

    setLoading(true);
    try {
      const comparison = await comparePeriods({
        role,
        currentPeriodStart: periodAStart,
        currentPeriodEnd: periodAEnd,
        previousPeriodStart: periodBStart,
        previousPeriodEnd: periodBEnd,
        granularity: 'day',
      });
      setData(comparison);
    } catch (error) {
      console.error('Error comparing performance:', error);
      const errorMessage = error instanceof Error ? error.message : 'No se pudo realizar la comparación de períodos';
      alert('Error al comparar períodos');
      if (onError) {
        onError(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  const getChangeIcon = (change: number) => {
    if (change > 0) return <TrendingUp className="w-4 h-4 text-green-600" />;
    if (change < 0) return <TrendingDown className="w-4 h-4 text-red-600" />;
    return <Minus className="w-4 h-4 text-gray-500" />;
  };

  const getChangeColor = (change: number, metric: string) => {
    // Para tasa de bajas, menos es mejor
    if (metric.toLowerCase().includes('bajas') || metric.toLowerCase().includes('baja')) {
      return change < 0 ? 'text-green-600' : change > 0 ? 'text-red-600' : 'text-gray-600';
    }
    return change > 0 ? 'text-green-600' : change < 0 ? 'text-red-600' : 'text-gray-600';
  };

  const getChangeBgColor = (change: number, metric: string) => {
    if (metric.toLowerCase().includes('bajas') || metric.toLowerCase().includes('baja')) {
      return change < 0 ? 'bg-green-50' : change > 0 ? 'bg-red-50' : 'bg-gray-50';
    }
    return change > 0 ? 'bg-green-50' : change < 0 ? 'bg-red-50' : 'bg-gray-50';
  };

  const formatValue = (value: number, metric: string): string => {
    // Buscar la unidad de la métrica en los datos
    const metricData = data?.currentPeriod.metrics.find(m => m.name === metric);
    const unit = metricData?.unit || '';
    
    if (unit === '%') {
      return `${value.toFixed(2)}%`;
    } else if (unit === '€') {
      return `${value.toLocaleString('es-ES', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 })}`;
    } else if (unit.includes('clientes') || unit.includes('socios')) {
      return `${Math.round(value).toLocaleString('es-ES')} ${unit}`;
    }
    return `${value.toFixed(2)} ${unit}`;
  };

  const generateTextualSummary = (): string => {
    if (!data || data.changes.length === 0) return '';

    const summaryParts: string[] = [];
    
    // Buscar facturación
    const facturacion = data.changes.find(c => 
      c.metric.toLowerCase().includes('facturación') || c.metric.toLowerCase().includes('facturacion')
    );
    
    // Buscar retención
    const retencion = data.changes.find(c => 
      c.metric.toLowerCase().includes('retención') || c.metric.toLowerCase().includes('retencion')
    );
    
    // Buscar adherencia
    const adherencia = data.changes.find(c => 
      c.metric.toLowerCase().includes('adherencia')
    );
    
    // Buscar ocupación
    const ocupacion = data.changes.find(c => 
      c.metric.toLowerCase().includes('ocupación') || c.metric.toLowerCase().includes('ocupacion')
    );
    
    // Buscar tasa de bajas
    const bajas = data.changes.find(c => 
      c.metric.toLowerCase().includes('bajas') || c.metric.toLowerCase().includes('baja')
    );

    // Construir resumen
    if (facturacion) {
      const direction = facturacion.changePercent > 0 ? 'incrementado' : 'disminuido';
      summaryParts.push(`has ${direction} tu facturación un ${Math.abs(facturacion.changePercent).toFixed(1)}%`);
    }
    
    if (retencion) {
      const direction = retencion.changePercent > 0 ? 'mejorado' : 'empeorado';
      summaryParts.push(`tu retención ha ${direction} un ${Math.abs(retencion.changePercent).toFixed(1)}%`);
    } else if (bajas) {
      const direction = bajas.changePercent < 0 ? 'mejorado' : 'empeorado';
      const absChange = Math.abs(bajas.changePercent);
      summaryParts.push(`tu tasa de bajas ha ${direction} un ${absChange.toFixed(1)}%`);
    }
    
    if (adherencia) {
      const direction = adherencia.changePercent > 0 ? 'mejorado' : 'empeorado';
      summaryParts.push(`la adherencia ha ${direction} un ${Math.abs(adherencia.changePercent).toFixed(1)}%`);
    }
    
    if (ocupacion) {
      const direction = ocupacion.changePercent > 0 ? 'aumentado' : 'disminuido';
      summaryParts.push(`la ocupación ha ${direction} un ${Math.abs(ocupacion.changePercent).toFixed(1)}%`);
    }
    
    // Si no hay métricas principales, usar las primeras disponibles
    if (summaryParts.length === 0 && data.changes.length > 0) {
      const firstChange = data.changes[0];
      const direction = firstChange.changePercent > 0 ? 'aumentado' : 'disminuido';
      summaryParts.push(`${firstChange.metric} ha ${direction} un ${Math.abs(firstChange.changePercent).toFixed(1)}%`);
    }

    if (summaryParts.length === 0) {
      return 'No se encontraron métricas para generar el resumen.';
    }

    // Determinar el período
    const periodLabel = preset === 'this-month-vs-last-month' 
      ? 'Este mes' 
      : preset === 'this-quarter-vs-last-quarter'
      ? 'Este trimestre'
      : 'En el período seleccionado';

    return `${periodLabel} ${summaryParts.join(', ')}.`;
  };

  const tableColumns = [
    {
      key: 'metric',
      label: 'Métrica',
      render: (value: string) => (
        <span className="font-semibold text-gray-900">{value}</span>
      ),
    },
    {
      key: 'periodA',
      label: 'Periodo A',
      render: (value: number, row: any) => (
        <span className="text-gray-700">{formatValue(value, row.metric)}</span>
      ),
    },
    {
      key: 'periodB',
      label: 'Periodo B',
      render: (value: number, row: any) => (
        <span className="text-gray-700">{formatValue(value, row.metric)}</span>
      ),
    },
    {
      key: 'difference',
      label: 'Diferencia Absoluta',
      render: (value: number, row: any) => {
        const metricData = data?.currentPeriod.metrics.find(m => m.name === row.metric);
        const unit = metricData?.unit || '';
        const formattedValue = unit === '€' 
          ? `${value > 0 ? '+' : ''}${value.toLocaleString('es-ES', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 })}`
          : `${value > 0 ? '+' : ''}${value.toFixed(2)} ${unit}`;
        
        return (
          <span className={`font-medium ${getChangeColor(value, row.metric)}`}>
            {formattedValue}
          </span>
        );
      },
    },
    {
      key: 'changePercent',
      label: 'Diferencia %',
      render: (value: number, row: any) => (
        <div className="flex items-center gap-2">
          {getChangeIcon(value)}
          <span className={`font-semibold ${getChangeColor(value, row.metric)}`}>
            {value > 0 ? '+' : ''}{value.toFixed(2)}%
          </span>
        </div>
      ),
    },
  ];

  const tableData = data?.changes.map(change => ({
    metric: change.metric,
    periodA: change.current,
    periodB: change.previous,
    difference: change.change,
    changePercent: change.changePercent,
  })) || [];

  return (
    <div className="space-y-6">
      <Card className="p-6 bg-white shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <BarChart3 size={20} />
          Comparación de Rendimiento
        </h3>
        
        <div className="space-y-4">
          {/* Preset selector */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              <Calendar size={16} className="inline mr-1" />
              Preset de Comparación
            </label>
            <Select
              options={presetOptions.map(p => ({ value: p.value, label: p.label }))}
              value={preset}
              onChange={(e) => handlePresetChange(e.target.value)}
            />
          </div>

          {/* Period A */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                <Calendar size={16} className="inline mr-1" />
                Periodo A - Fecha Inicio
              </label>
              <input
                type="date"
                value={periodAStart}
                onChange={(e) => setPeriodAStart(e.target.value)}
                className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                <Calendar size={16} className="inline mr-1" />
                Periodo A - Fecha Fin
              </label>
              <input
                type="date"
                value={periodAEnd}
                onChange={(e) => setPeriodAEnd(e.target.value)}
                className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5"
              />
            </div>
          </div>

          {/* Period B */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                <Calendar size={16} className="inline mr-1" />
                Periodo B - Fecha Inicio
              </label>
              <input
                type="date"
                value={periodBStart}
                onChange={(e) => setPeriodBStart(e.target.value)}
                className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                <Calendar size={16} className="inline mr-1" />
                Periodo B - Fecha Fin
              </label>
              <input
                type="date"
                value={periodBEnd}
                onChange={(e) => setPeriodBEnd(e.target.value)}
                className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5"
              />
            </div>
          </div>

          {/* Compare button */}
          <div className="flex justify-end">
            <Button
              variant="primary"
              onClick={handleCompare}
              disabled={loading || !periodAStart || !periodAEnd || !periodBStart || !periodBEnd}
              className="min-w-[200px]"
            >
              {loading ? (
                <>
                  <Loader2 size={20} className="mr-2 animate-spin" />
                  Comparando...
                </>
              ) : (
                <>
                  <BarChart3 size={20} className="mr-2" />
                  Comparar Períodos
                </>
              )}
            </Button>
          </div>
        </div>
      </Card>

      {loading && (
        <Card className="p-8 text-center bg-white shadow-sm">
          <Loader2 size={48} className="mx-auto text-blue-500 animate-spin mb-4" />
          <p className="text-gray-600">Cargando comparación...</p>
        </Card>
      )}

      {data && !loading && (
        <>
          {/* Textual Summary */}
          <Card className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <BarChart3 size={20} />
              Resumen
            </h3>
            <p className="text-base text-gray-700 leading-relaxed">
              {generateTextualSummary()}
            </p>
          </Card>

          {/* Comparison Table */}
          <Card className="p-6 bg-white shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">
              Comparación Detallada de Métricas
            </h3>
            
            <div className="overflow-x-auto">
              <Table
                columns={tableColumns}
                data={tableData}
                className="min-w-full"
              />
            </div>
          </Card>
        </>
      )}

      {!data && !loading && (
        <Card className="p-8 text-center bg-white shadow-sm">
          <Calendar size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Selecciona períodos para comparar</h3>
          <p className="text-gray-600">Selecciona los períodos y haz clic en "Comparar Períodos" para ver los resultados</p>
        </Card>
      )}
    </div>
  );
};

