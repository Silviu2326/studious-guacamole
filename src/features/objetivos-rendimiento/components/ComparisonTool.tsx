import React, { useState, useMemo, useRef } from 'react';
import { ExtendedComparisonData, GlobalFilters, AIComparisonAnalysis, UnitComparisonData, ComparisonUnitType } from '../types';
import { getExtendedComparison, analyzeSignificantDifferences } from '../api/aiSuggestions';
import { getUnitComparison } from '../api/comparison';
import { exportComparison } from '../utils/export';
import { useAuth } from '../../../context/AuthContext';
import { Card, Button, Table, Select, Badge } from '../../../components/componentsreutilizables';
import { 
  TrendingUp, 
  TrendingDown, 
  Minus, 
  Calendar, 
  Loader2, 
  Sparkles, 
  Target, 
  Info, 
  Table2, 
  BarChart3, 
  Grid3x3,
  AlertTriangle,
  CheckCircle2,
  Lightbulb,
  XCircle,
  GitCompare,
  Download,
  FileText,
  Share2
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer
} from 'recharts';

interface ComparisonToolProps {
  role: 'entrenador' | 'gimnasio';
  globalFilters?: GlobalFilters;
  periodo?: 'semana' | 'mes' | 'trimestre';
}

type ViewMode = 'table' | 'graph' | 'heatmap';

export const ComparisonTool: React.FC<ComparisonToolProps> = ({ role, globalFilters, periodo }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [comparisonMode, setComparisonMode] = useState<'periods' | 'units'>('periods');
  const [data, setData] = useState<ExtendedComparisonData | null>(null);
  const [unitData, setUnitData] = useState<UnitComparisonData | null>(null);
  const [aiAnalysis, setAiAnalysis] = useState<AIComparisonAnalysis | null>(null);
  const [currentPeriod, setCurrentPeriod] = useState('2024-11');
  const [previousPeriod, setPreviousPeriod] = useState('2024-10');
  const [viewMode, setViewMode] = useState<ViewMode>('table');
  const [showAIAnalysis, setShowAIAnalysis] = useState(true);
  const chartRef = useRef<HTMLDivElement>(null);
  
  // Unit comparison state
  const [unitType, setUnitType] = useState<ComparisonUnitType>('team');
  const [unit1Id, setUnit1Id] = useState('');
  const [unit2Id, setUnit2Id] = useState('');
  const [comparisonPeriod, setComparisonPeriod] = useState('2024-11');
  
  // Mock units data
  const mockTeams = [
    { id: 'team-1', name: 'Equipo A' },
    { id: 'team-2', name: 'Equipo B' },
    { id: 'team-3', name: 'Equipo C' },
  ];
  const mockSites = [
    { id: 'site-1', name: 'Sede 1' },
    { id: 'site-2', name: 'Sede 2' },
    { id: 'site-3', name: 'Sede 3' },
  ];
  
  const getUnits = () => {
    switch (unitType) {
      case 'team':
        return mockTeams;
      case 'site':
        return mockSites;
      default:
        return [];
    }
  };

  const handleCompare = async () => {
    setLoading(true);
    try {
      if (comparisonMode === 'periods') {
        // Obtener comparación extendida
        const comparison = await getExtendedComparison(role, currentPeriod, previousPeriod);
        setData(comparison);
        setUnitData(null);
        
        // Obtener análisis de IA de diferencias significativas
        const analysis = await analyzeSignificantDifferences(role, currentPeriod, previousPeriod, comparison);
        setAiAnalysis(analysis);
      } else {
        // Comparación entre unidades
        if (!unit1Id || !unit2Id) {
          alert('Por favor selecciona ambas unidades para comparar');
          setLoading(false);
          return;
        }
        const comparison = await getUnitComparison(role, unitType, unit1Id, unit2Id, comparisonPeriod);
        setUnitData(comparison);
        setData(null);
        setAiAnalysis(null);
      }
    } catch (error) {
      console.error('Error comparing performance:', error);
      alert('Error al comparar');
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async (format: 'csv' | 'excel' | 'json' | 'pdf' | 'embed') => {
    if (!data) {
      alert('No hay datos de comparación para exportar');
      return;
    }

    setExporting(true);
    try {
      await exportComparison(
        data,
        currentPeriod,
        previousPeriod,
        {
          format,
          includeCharts: format === 'png' || format === 'jpg' || format === 'svg',
          includeAIAnalysis: true,
          includeRawData: true,
          chartFormat: 'png',
        },
        aiAnalysis || undefined,
        chartRef.current,
        user?.id || 'current-user',
        user?.name || 'Usuario'
      );
    } catch (error) {
      console.error('Error exporting comparison:', error);
      alert('Error al exportar la comparación');
    } finally {
      setExporting(false);
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

  const getSignificanceColor = (significance: 'low' | 'medium' | 'high' | 'critical') => {
    switch (significance) {
      case 'critical':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'high':
        return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'low':
        return 'bg-blue-100 text-blue-800 border-blue-300';
    }
  };

  const getSignificanceBadge = (significance: 'low' | 'medium' | 'high' | 'critical') => {
    const labels = {
      critical: 'Crítica',
      high: 'Alta',
      medium: 'Media',
      low: 'Baja',
    };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getSignificanceColor(significance)}`}>
        {labels[significance]}
      </span>
    );
  };

  // Preparar datos para gráfico
  const chartData = useMemo(() => {
    if (!data) return [];
    return data.changes.map(change => ({
      name: change.metric,
      anterior: change.previous,
      actual: change.current,
      cambio: change.changePercent,
    }));
  }, [data]);

  // Preparar datos para heatmap
  const heatmapData = useMemo(() => {
    if (!data) return [];
    return data.changes.map(change => {
      const absChange = Math.abs(change.changePercent);
      let intensity = 0;
      if (absChange >= 30) intensity = 1;
      else if (absChange >= 20) intensity = 0.75;
      else if (absChange >= 10) intensity = 0.5;
      else intensity = 0.25;

      const isNegative = change.changePercent < 0;
      const metricLower = change.metric.toLowerCase();
      const isNegativeMetric = metricLower.includes('bajas') || metricLower.includes('tasa');
      
      // Para métricas negativas, invertir la lógica
      const isGood = isNegativeMetric ? isNegative : !isNegative;

      return {
        metric: change.metric,
        value: change.changePercent,
        intensity,
        isGood,
        current: change.current,
        previous: change.previous,
      };
    });
  }, [data]);

  const getHeatmapColor = (item: typeof heatmapData[0]) => {
    if (item.isGood) {
      // Verde para cambios positivos
      const opacity = item.intensity;
      return `rgba(34, 197, 94, ${0.3 + opacity * 0.7})`; // green-500
    } else {
      // Rojo para cambios negativos
      const opacity = item.intensity;
      return `rgba(239, 68, 68, ${0.3 + opacity * 0.7})`; // red-500
    }
  };

  // Columnas para la tabla
  const tableColumns = [
    {
      key: 'metric',
      label: 'Métrica',
      sortable: true,
    },
    {
      key: 'previous',
      label: 'Período Anterior',
      sortable: true,
      render: (value: number) => value.toFixed(2),
    },
    {
      key: 'current',
      label: 'Período Actual',
      sortable: true,
      render: (value: number) => value.toFixed(2),
    },
    {
      key: 'change',
      label: 'Cambio',
      sortable: true,
      render: (value: number, row: any) => (
        <div className="flex items-center gap-2">
          {getChangeIcon(value)}
          <span className={getChangeColor(value, row.metric)}>
            {value > 0 ? '+' : ''}{value.toFixed(2)}
          </span>
        </div>
      ),
    },
    {
      key: 'changePercent',
      label: 'Cambio %',
      sortable: true,
      render: (value: number, row: any) => (
        <span className={getChangeColor(value, row.metric)}>
          {value > 0 ? '+' : ''}{value.toFixed(1)}%
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Tabs para seleccionar modo de comparación */}
      <Card className="p-4 bg-white shadow-sm">
        <div className="flex items-center gap-4">
          <button
            onClick={() => {
              setComparisonMode('periods');
              setData(null);
              setUnitData(null);
            }}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              comparisonMode === 'periods'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Calendar size={18} className="inline mr-2" />
            Comparar Períodos
          </button>
          <button
            onClick={() => {
              setComparisonMode('units');
              setData(null);
              setUnitData(null);
            }}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              comparisonMode === 'units'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <GitCompare size={18} className="inline mr-2" />
            Comparar Unidades
          </button>
        </div>
      </Card>

      {/* Selector de períodos o unidades */}
      <Card className="p-6 bg-white shadow-sm">
        {comparisonMode === 'periods' ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              <Calendar size={16} className="inline mr-1" />
              Período Actual
            </label>
            <input
              type="month"
              value={currentPeriod}
              onChange={(e) => setCurrentPeriod(e.target.value)}
              className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              <Calendar size={16} className="inline mr-1" />
              Período Anterior
            </label>
            <input
              type="month"
              value={previousPeriod}
              onChange={(e) => setPreviousPeriod(e.target.value)}
              className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5"
            />
          </div>
          <div className="flex items-end">
            <Button
              variant="primary"
              onClick={handleCompare}
              disabled={loading}
              className="w-full"
            >
              <Calendar size={20} className="mr-2" />
              Comparar
            </Button>
          </div>
        </div>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Tipo de Unidad
                </label>
                <Select
                  value={unitType}
                  onChange={(e) => {
                    setUnitType(e.target.value as ComparisonUnitType);
                    setUnit1Id('');
                    setUnit2Id('');
                  }}
                >
                  <option value="team">Equipo</option>
                  <option value="site">Sede</option>
                  <option value="businessUnit">Unidad de Negocio</option>
                  <option value="responsible">Responsable</option>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  <Calendar size={16} className="inline mr-1" />
                  Período
                </label>
                <input
                  type="month"
                  value={comparisonPeriod}
                  onChange={(e) => setComparisonPeriod(e.target.value)}
                  className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  {unitType === 'team' ? 'Equipo 1' : unitType === 'site' ? 'Sede 1' : 'Unidad 1'}
                </label>
                <Select
                  value={unit1Id}
                  onChange={(e) => setUnit1Id(e.target.value)}
                >
                  <option value="">Selecciona...</option>
                  {getUnits().map(unit => (
                    <option key={unit.id} value={unit.id}>{unit.name}</option>
                  ))}
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  {unitType === 'team' ? 'Equipo 2' : unitType === 'site' ? 'Sede 2' : 'Unidad 2'}
                </label>
                <Select
                  value={unit2Id}
                  onChange={(e) => setUnit2Id(e.target.value)}
                >
                  <option value="">Selecciona...</option>
                  {getUnits().filter(u => u.id !== unit1Id).map(unit => (
                    <option key={unit.id} value={unit.id}>{unit.name}</option>
                  ))}
                </Select>
              </div>
            </div>
            <div className="flex justify-end">
              <Button
                variant="primary"
                onClick={handleCompare}
                disabled={loading || !unit1Id || !unit2Id}
                className="w-full md:w-auto"
              >
                <GitCompare size={20} className="mr-2" />
                Comparar Unidades
              </Button>
            </div>
          </div>
        )}
      </Card>

      {loading && (
        <Card className="p-8 text-center bg-white shadow-sm">
          <Loader2 size={48} className="mx-auto text-blue-500 animate-spin mb-4" />
          <p className="text-gray-600">Cargando comparación y análisis de IA...</p>
        </Card>
      )}

      {data && !loading && (
        <div className="space-y-6">
          {/* Selector de vista y exportación */}
          <Card className="p-4 bg-white shadow-sm">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Comparación de Períodos
              </h3>
              <div className="flex items-center gap-2 flex-wrap">
                {/* Selector de vista */}
                <div className="flex items-center gap-2 border-r border-gray-200 pr-2">
                  <button
                    onClick={() => setViewMode('table')}
                    className={`p-2 rounded-lg transition-all ${
                      viewMode === 'table'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                    title="Vista de tabla"
                  >
                    <Table2 size={20} />
                  </button>
                  <button
                    onClick={() => setViewMode('graph')}
                    className={`p-2 rounded-lg transition-all ${
                      viewMode === 'graph'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                    title="Vista de gráfico"
                  >
                    <BarChart3 size={20} />
                  </button>
                  <button
                    onClick={() => setViewMode('heatmap')}
                    className={`p-2 rounded-lg transition-all ${
                      viewMode === 'heatmap'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                    title="Vista de heatmap"
                  >
                    <Grid3x3 size={20} />
                  </button>
                </div>
                {/* Botones de exportación */}
                <div className="flex items-center gap-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => handleExport('csv')}
                    disabled={exporting}
                    title="Exportar a CSV"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    CSV
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => handleExport('excel')}
                    disabled={exporting}
                    title="Exportar a Excel"
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    Excel
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => handleExport('json')}
                    disabled={exporting}
                    title="Exportar a JSON"
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    JSON
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => handleExport('embed')}
                    disabled={exporting}
                    title="Generar código embed para dashboard"
                  >
                    <Share2 className="w-4 h-4 mr-2" />
                    Embed
                  </Button>
                </div>
              </div>
            </div>
          </Card>

          {/* Vista de tabla */}
          {viewMode === 'table' && (
            <Card className="p-6 bg-white shadow-sm">
              <Table
                data={data.changes}
                columns={tableColumns}
                className="w-full"
              />
            </Card>
          )}

          {/* Vista de gráfico */}
          {viewMode === 'graph' && (
            <Card ref={chartRef} className="p-6 bg-white shadow-sm">
              <h4 className="text-base font-semibold text-gray-900 mb-4">
                Comparación de Métricas: Período Anterior vs Actual
              </h4>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="name" 
                    angle={-45} 
                    textAnchor="end" 
                    height={100}
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="anterior" fill="#94a3b8" name="Período Anterior" />
                  <Bar dataKey="actual" fill="#3b82f6" name="Período Actual" />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          )}

          {/* Vista de heatmap */}
          {viewMode === 'heatmap' && (
            <Card className="p-6 bg-white shadow-sm">
              <h4 className="text-base font-semibold text-gray-900 mb-4">
                Heatmap de Cambios (Intensidad del cambio)
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {heatmapData.map((item, index) => (
                  <div
                    key={index}
                    className="p-4 rounded-lg border-2 transition-all hover:shadow-lg"
                    style={{
                      backgroundColor: getHeatmapColor(item),
                      borderColor: item.isGood ? '#22c55e' : '#ef4444',
                    }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h5 className="font-semibold text-gray-900 text-sm">{item.metric}</h5>
                      {getChangeIcon(item.value)}
                    </div>
                    <div className="space-y-1 text-xs">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Anterior:</span>
                        <span className="font-medium">{item.previous.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Actual:</span>
                        <span className="font-medium">{item.current.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Cambio:</span>
                        <span className={`font-bold ${item.isGood ? 'text-green-700' : 'text-red-700'}`}>
                          {item.value > 0 ? '+' : ''}{item.value.toFixed(1)}%
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-600">
                  <strong>Leyenda:</strong> Los colores verdes indican cambios positivos, los rojos indican cambios negativos. 
                  La intensidad del color refleja la magnitud del cambio.
                </p>
              </div>
            </Card>
          )}

          {/* Análisis de IA: Diferencias significativas y causas */}
          {showAIAnalysis && aiAnalysis && (
            <Card className="p-6 bg-white shadow-sm border-l-4 border-l-purple-500">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-purple-600" />
                  <h3 className="text-lg font-semibold text-gray-900">
                    Análisis de IA: Diferencias Significativas y Causas
                  </h3>
                </div>
                <button
                  onClick={() => setShowAIAnalysis(!showAIAnalysis)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircle size={20} />
                </button>
              </div>

              {/* Resumen general */}
              <div className="mb-6 p-4 bg-purple-50 rounded-lg border border-purple-200">
                <div className="flex items-start gap-2 mb-2">
                  <Info className="w-5 h-5 text-purple-600 mt-0.5" />
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 mb-2">Resumen General</h4>
                    <p className="text-sm text-gray-700 leading-relaxed">{aiAnalysis.overallSummary}</p>
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t border-purple-200">
                  <span className="text-xs text-purple-700">
                    Confianza del análisis: {aiAnalysis.confidence}%
                  </span>
                </div>
              </div>

              {/* Insights clave */}
              {aiAnalysis.keyInsights.length > 0 && (
                <div className="mb-6">
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <Lightbulb className="w-4 h-4 text-yellow-500" />
                    Insights Clave
                  </h4>
                  <ul className="space-y-2">
                    {aiAnalysis.keyInsights.map((insight, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
                        <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>{insight}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Áreas de riesgo */}
              {aiAnalysis.riskAreas.length > 0 && (
                <div className="mb-6">
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-red-500" />
                    Áreas de Riesgo
                  </h4>
                  <ul className="space-y-2">
                    {aiAnalysis.riskAreas.map((risk, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm text-red-700">
                        <AlertTriangle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                        <span>{risk}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Oportunidades */}
              {aiAnalysis.opportunities.length > 0 && (
                <div className="mb-6">
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <Target className="w-4 h-4 text-green-500" />
                    Oportunidades
                  </h4>
                  <ul className="space-y-2">
                    {aiAnalysis.opportunities.map((opportunity, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm text-green-700">
                        <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>{opportunity}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Diferencias significativas detalladas */}
              {aiAnalysis.significantDifferences.length > 0 && (
                <div>
                  <h4 className="font-semibold text-gray-900 mb-4">
                    Diferencias Significativas Detalladas
                  </h4>
                  <div className="space-y-4">
                    {aiAnalysis.significantDifferences.map((diff) => (
                      <Card key={diff.id} variant="hover" className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h5 className="font-semibold text-gray-900">{diff.metricName}</h5>
                              {getSignificanceBadge(diff.significance)}
                              {diff.statisticalSignificance && (
                                <span className="text-xs text-gray-500">
                                  Significancia estadística: {diff.statisticalSignificance}%
                                </span>
                              )}
                            </div>
                            <div className="grid grid-cols-3 gap-4 mb-3">
                              <div>
                                <p className="text-xs text-gray-500 mb-1">Valor Anterior</p>
                                <p className="text-base font-semibold text-gray-900">
                                  {diff.previousValue.toFixed(2)}
                                </p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-500 mb-1">Valor Actual</p>
                                <p className="text-base font-semibold text-gray-900">
                                  {diff.currentValue.toFixed(2)}
                                </p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-500 mb-1">Cambio</p>
                                <p className={`text-base font-semibold ${
                                  diff.differencePercent > 0 ? 'text-green-600' : 'text-red-600'
                                }`}>
                                  {diff.differencePercent > 0 ? '+' : ''}{diff.differencePercent.toFixed(1)}%
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Explicación de IA */}
                        <div className="mb-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                          <div className="flex items-start gap-2">
                            <Sparkles className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                            <div className="flex-1">
                              <p className="text-xs font-medium text-blue-900 mb-1">Explicación de IA:</p>
                              <p className="text-sm text-blue-800 leading-relaxed">{diff.aiExplanation}</p>
                            </div>
                          </div>
                        </div>

                        {/* Posibles causas */}
                        {diff.possibleCauses.length > 0 && (
                          <div className="mb-3">
                            <p className="text-xs font-medium text-gray-700 mb-2">Posibles Causas:</p>
                            <div className="space-y-2">
                              {diff.possibleCauses.map((cause) => (
                                <div key={cause.id} className="p-2 bg-gray-50 rounded border border-gray-200">
                                  <div className="flex items-center justify-between mb-1">
                                    <span className="text-sm font-medium text-gray-900">{cause.cause}</span>
                                    <div className="flex items-center gap-2">
                                      <span className={`text-xs px-2 py-0.5 rounded ${
                                        cause.likelihood === 'high' 
                                          ? 'bg-red-100 text-red-700' 
                                          : cause.likelihood === 'medium'
                                          ? 'bg-yellow-100 text-yellow-700'
                                          : 'bg-blue-100 text-blue-700'
                                      }`}>
                                        Probabilidad: {cause.likelihood === 'high' ? 'Alta' : cause.likelihood === 'medium' ? 'Media' : 'Baja'}
                                      </span>
                                      <span className="text-xs text-gray-500">
                                        Confianza: {cause.confidence}%
                                      </span>
                                    </div>
                                  </div>
                                  <p className="text-xs text-gray-600">{cause.description}</p>
                                  {cause.evidence && (
                                    <p className="text-xs text-gray-500 mt-1 italic">Evidencia: {cause.evidence}</p>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Recomendación */}
                        {diff.recommendation && (
                          <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                            <p className="text-xs font-medium text-green-900 mb-1">Recomendación:</p>
                            <p className="text-sm text-green-800">{diff.recommendation}</p>
                          </div>
                        )}
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </Card>
          )}

          {/* Botón para mostrar/ocultar análisis de IA */}
          {!showAIAnalysis && aiAnalysis && (
            <Card className="p-4 bg-white shadow-sm">
              <Button
                variant="secondary"
                onClick={() => setShowAIAnalysis(true)}
                className="w-full"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Mostrar Análisis de IA
              </Button>
            </Card>
          )}
        </div>
      )}

      {/* Comparación entre unidades */}
      {unitData && !loading && (
        <div className="space-y-6">
          <Card className="p-6 bg-white shadow-sm">
            <div className="flex items-center gap-2 mb-6">
              <GitCompare className="w-5 h-5 text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-900">
                Comparación: {unitData.unit1.name} vs {unitData.unit2.name}
              </h3>
            </div>
            
            <div className="space-y-4">
              {unitData.changes.map((change, index) => (
                <Card key={index} variant="hover" className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-base font-semibold text-gray-900">
                      {change.metric}
                    </h4>
                    <div className="flex items-center gap-2">
                      {change.winner === 'unit1' ? (
                        <span className="text-sm font-medium text-blue-600">{unitData.unit1.name} gana</span>
                      ) : change.winner === 'unit2' ? (
                        <span className="text-sm font-medium text-green-600">{unitData.unit2.name} gana</span>
                      ) : (
                        <span className="text-sm font-medium text-gray-600">Empate</span>
                      )}
                      <span className={`text-base font-semibold ${
                        change.difference > 0 ? 'text-green-600' : change.difference < 0 ? 'text-red-600' : 'text-gray-600'
                      }`}>
                        {change.difference > 0 ? '+' : ''}{change.difference.toFixed(2)} ({change.differencePercent > 0 ? '+' : ''}{change.differencePercent.toFixed(1)}%)
                      </span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">{unitData.unit1.name}</p>
                      <p className="text-base text-gray-900">{change.unit1Value.toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">{unitData.unit2.name}</p>
                      <p className="text-base text-gray-900">{change.unit2Value.toFixed(2)}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </Card>

          {/* Oportunidades detectadas */}
          {unitData.opportunities && unitData.opportunities.length > 0 && (
            <Card className="p-6 bg-white shadow-sm border-l-4 border-l-yellow-500">
              <div className="flex items-center gap-2 mb-6">
                <Lightbulb className="w-5 h-5 text-yellow-600" />
                <h3 className="text-lg font-semibold text-gray-900">
                  Oportunidades Detectadas
                </h3>
              </div>
              
              <div className="space-y-4">
                {unitData.opportunities.map((opportunity) => (
                  <Card key={opportunity.id} variant="hover" className="p-4 bg-gradient-to-r from-yellow-50 to-orange-50">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="text-base font-semibold text-gray-900">
                            {opportunity.title}
                          </h4>
                          <Badge variant={opportunity.priority === 'high' ? 'red' : opportunity.priority === 'medium' ? 'yellow' : 'blue'}>
                            {opportunity.priority === 'high' ? 'Alta' : opportunity.priority === 'medium' ? 'Media' : 'Baja'}
                          </Badge>
                          <Badge variant={opportunity.estimatedImpact === 'high' ? 'red' : opportunity.estimatedImpact === 'medium' ? 'yellow' : 'blue'}>
                            Impacto: {opportunity.estimatedImpact === 'high' ? 'Alto' : opportunity.estimatedImpact === 'medium' ? 'Medio' : 'Bajo'}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">{opportunity.description}</p>
                        <div className="bg-white rounded-lg p-3 mb-3">
                          <p className="text-sm font-medium text-gray-700 mb-1">Recomendación:</p>
                          <p className="text-sm text-gray-600">{opportunity.recommendation}</p>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-xs text-gray-500 mb-1">{unitData.unit1.name}</p>
                            <p className="text-base font-semibold text-gray-900">{opportunity.unit1Value.toFixed(2)}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 mb-1">{unitData.unit2.name}</p>
                            <p className="text-base font-semibold text-gray-900">{opportunity.unit2Value.toFixed(2)}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </Card>
          )}
        </div>
      )}

      {!data && !unitData && !loading && (
        <Card className="p-8 text-center bg-white shadow-sm">
          {comparisonMode === 'periods' ? (
            <>
              <Calendar size={48} className="mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Selecciona períodos para comparar</h3>
              <p className="text-gray-600">Selecciona los períodos y haz clic en "Comparar" para ver los resultados</p>
            </>
          ) : (
            <>
              <GitCompare size={48} className="mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Selecciona unidades para comparar</h3>
              <p className="text-gray-600">Selecciona dos unidades y un período para ver la comparación</p>
            </>
          )}
        </Card>
      )}
    </div>
  );
};
