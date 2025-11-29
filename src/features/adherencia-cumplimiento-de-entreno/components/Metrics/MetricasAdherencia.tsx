import React, { useState, useMemo, useEffect } from 'react';
import { MetricCards, Card, Table, Badge, Button, Input, Select } from '../../../../components/componentsreutilizables';
import { TrendingUp, AlertTriangle, Activity, Calendar, Users, Target, Clock, Award, Zap, TrendingDown, CheckCircle2, Flame, GitCompare, X, Heart, Activity as ActivityIcon, RefreshCw, AlertCircle } from 'lucide-react';
import type { MetricCardData, SelectOption } from '../../../../components/componentsreutilizables';
import { obtenerCorrelacionAdherenciaWearable, simularDatosWearables, type CorrelacionAdherenciaWearable } from '../../api/wearables';

interface Props {
  modo: 'entrenador' | 'gimnasio';
}

interface DateRange {
  startDate: string;
  endDate: string;
}

export const MetricasAdherencia: React.FC<Props> = ({ modo }) => {
  const [showComparison, setShowComparison] = useState(false);
  const [showWearables, setShowWearables] = useState(false);
  const [loadingWearables, setLoadingWearables] = useState(false);
  const [correlacionesWearables, setCorrelacionesWearables] = useState<CorrelacionAdherenciaWearable[]>([]);
  const [clienteSeleccionado, setClienteSeleccionado] = useState<string>('');
  const [period1, setPeriod1] = useState<DateRange>({
    startDate: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    endDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  });
  const [period2, setPeriod2] = useState<DateRange>({
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
  });

  // Datos de clientes para el selector (solo para modo entrenador)
  const clientes: SelectOption[] = useMemo(() => {
    if (modo !== 'entrenador') return [];
    return [
      { value: '1', label: 'María Pérez' },
      { value: '2', label: 'Carlos Ruiz' },
      { value: '3', label: 'Ana Martínez' },
      { value: '4', label: 'Luis García' },
      { value: '5', label: 'Sofia López' },
      { value: '6', label: 'Diego Fernández' },
      { value: '7', label: 'Elena Sánchez' },
    ];
  }, [modo]);

  // Cargar datos de wearables cuando se selecciona un cliente
  useEffect(() => {
    if (modo === 'entrenador' && clienteSeleccionado && showWearables) {
      cargarDatosWearables();
    }
  }, [clienteSeleccionado, showWearables, modo]);

  const cargarDatosWearables = async () => {
    if (!clienteSeleccionado) return;

    setLoadingWearables(true);
    try {
      const cliente = clientes.find(c => c.value === clienteSeleccionado);
      if (!cliente) return;

      // Simular datos de wearables si no existen
      await simularDatosWearables(clienteSeleccionado, cliente.label, 7);

      // Obtener correlación con adherencia
      const fechaInicio = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      const fechaFin = new Date();
      const adherencia = 75 + Math.random() * 25; // Simular adherencia

      const correlacion = await obtenerCorrelacionAdherenciaWearable(
        clienteSeleccionado,
        cliente.label,
        adherencia,
        fechaInicio,
        fechaFin
      );

      setCorrelacionesWearables([correlacion]);
    } catch (error) {
      console.error('Error al cargar datos de wearables:', error);
    } finally {
      setLoadingWearables(false);
    }
  };
  const metrics: MetricCardData[] =
    modo === 'entrenador'
      ? [
          { 
            id: '1',
            title: 'Adherencia 30d', 
            value: '84%',
            trend: { value: 2.4, direction: 'up' },
            icon: <TrendingUp size={24} />,
            color: 'info'
          },
          { 
            id: '2',
            title: 'Clientes en Riesgo', 
            value: '7',
            trend: { value: 1, direction: 'down' },
            icon: <AlertTriangle size={24} />,
            color: 'warning'
          },
          { 
            id: '3',
            title: 'Sesiones/Cliente (sem)', 
            value: '2.8',
            trend: { value: 0.2, direction: 'up' },
            icon: <Activity size={24} />,
            color: 'success'
          },
          { 
            id: '4',
            title: 'Tasa de Éxito', 
            value: '76%',
            trend: { value: 3.1, direction: 'up' },
            icon: <Target size={24} />,
            color: 'primary'
          },
          { 
            id: '5',
            title: 'Duración Media', 
            value: '48 min',
            trend: { value: 2, direction: 'up' },
            icon: <Clock size={24} />,
            color: 'info'
          },
          { 
            id: '6',
            title: 'Racha Promedio', 
            value: '11 días',
            trend: { value: 1.5, direction: 'up' },
            icon: <Flame size={24} />,
            color: 'success'
          },
        ]
      : [
          { 
            id: '1',
            title: 'Ocupación 30d', 
            value: '71%',
            trend: { value: 0.9, direction: 'up' },
            icon: <Calendar size={24} />,
            color: 'info'
          },
          { 
            id: '2',
            title: 'Picos de Demanda', 
            value: 'L-M 18-20h',
            icon: <TrendingUp size={24} />,
            color: 'primary'
          },
          { 
            id: '3',
            title: 'Plan Grupal Seguimiento', 
            value: '63%',
            trend: { value: 3.1, direction: 'up' },
            icon: <Users size={24} />,
            color: 'success'
          },
          { 
            id: '4',
            title: 'Clases Tope Reserva', 
            value: '8',
            trend: { value: 2, direction: 'up' },
            icon: <Zap size={24} />,
            color: 'error'
          },
          { 
            id: '5',
            title: 'Satisfacción Media', 
            value: '4.6/5',
            trend: { value: 0.2, direction: 'up' },
            icon: <Award size={24} />,
            color: 'primary'
          },
          { 
            id: '6',
            title: 'Cancelaciones (sem)', 
            value: '23',
            trend: { value: 3, direction: 'down' },
            icon: <TrendingDown size={24} />,
            color: 'success'
          },
        ];

  const tableData =
    modo === 'entrenador'
      ? [
          { id: 1, categoria: 'Adherencia General', valor: '84%', periodo: '30 días', cambio: '+2.4%', tendencia: 'up' },
          { id: 2, categoria: 'Sesiones Completadas', valor: '342', periodo: '30 días', cambio: '+18', tendencia: 'up' },
          { id: 3, categoria: 'Tasa de Asistencia', valor: '88%', periodo: '30 días', cambio: '+1.2%', tendencia: 'up' },
          { id: 4, categoria: 'Sesiones Canceladas', valor: '15', periodo: '30 días', cambio: '-5', tendencia: 'down' },
          { id: 5, categoria: 'Tiempo Promedio', valor: '48 min', periodo: 'Por sesión', cambio: '+2 min', tendencia: 'up' },
          { id: 6, categoria: 'Objetivos Cumplidos', valor: '76%', periodo: '30 días', cambio: '+4.2%', tendencia: 'up' },
          { id: 7, categoria: 'Clientes Nuevos', valor: '8', periodo: '30 días', cambio: '+2', tendencia: 'up' },
          { id: 8, categoria: 'Retención', valor: '91%', periodo: '30 días', cambio: '+0.8%', tendencia: 'up' },
        ]
      : [
          { id: 1, categoria: 'Ocupación General', valor: '71%', periodo: '30 días', cambio: '+0.9%', tendencia: 'up' },
          { id: 2, categoria: 'Asistencias Totales', valor: '4,892', periodo: '30 días', cambio: '+234', tendencia: 'up' },
          { id: 3, categoria: 'Clases Impartidas', valor: '186', periodo: '30 días', cambio: '+12', tendencia: 'up' },
          { id: 4, categoria: 'Media Asistencia/Clase', valor: '26.3', periodo: '30 días', cambio: '+0.8', tendencia: 'up' },
          { id: 5, categoria: 'Franjas Saturadas', valor: '8', periodo: 'Semanal', cambio: '+2', tendencia: 'up' },
          { id: 6, categoria: 'Franjas Vacías', valor: '3', periodo: 'Semanal', cambio: '-2', tendencia: 'down' },
          { id: 7, categoria: 'Satisfacción Media', valor: '4.6/5', periodo: '30 días', cambio: '+0.2', tendencia: 'up' },
          { id: 8, categoria: 'Tasa Retención', valor: '78%', periodo: '30 días', cambio: '+2.1%', tendencia: 'up' },
        ];

  const columns = [
    { key: 'categoria', label: 'Categoría' },
    { key: 'valor', label: 'Valor' },
    { key: 'periodo', label: 'Período' },
    { key: 'cambio', label: 'Cambio vs Anterior' },
    { key: 'tendencia', label: 'Tendencia' },
  ];

  const formattedTableData = tableData.map(row => ({
    ...row,
    tendencia: row.tendencia === 'up' 
      ? <Badge variant="green"><CheckCircle2 size={14} className="mr-1" />Alcista</Badge>
      : <Badge variant="blue"><TrendingDown size={14} className="mr-1" />Bajista</Badge>
  }));

  // Simular datos para el período 1 (datos anteriores)
  const metricsPeriod1 = useMemo(() => {
    return metrics.map(m => ({
      ...m,
      value: modo === 'entrenador' 
        ? m.id === '1' ? '78%' : m.id === '2' ? '9' : m.id === '3' ? '2.5' : m.id === '4' ? '72%' : m.id === '5' ? '46 min' : '9 días'
        : m.id === '1' ? '68%' : m.id === '2' ? 'L-M 17-19h' : m.id === '3' ? '58%' : m.id === '4' ? '6' : m.id === '5' ? '4.4/5' : '28',
    }));
  }, [modo]);

  // Simular datos para el período 2 (datos actuales)
  const metricsPeriod2 = useMemo(() => metrics, [metrics]);

  // Calcular diferencias
  const calculateDifference = (val1: string, val2: string): { value: string; isPositive: boolean } => {
    // Extraer números de los valores
    const num1 = parseFloat(val1.replace(/[^0-9.]/g, ''));
    const num2 = parseFloat(val2.replace(/[^0-9.]/g, ''));
    
    if (isNaN(num1) || isNaN(num2)) {
      return { value: 'N/A', isPositive: false };
    }
    
    const diff = num2 - num1;
    const isPercentage = val1.includes('%') || val2.includes('%');
    const sign = diff >= 0 ? '+' : '';
    const formattedDiff = isPercentage 
      ? `${sign}${diff.toFixed(1)}%`
      : `${sign}${diff.toFixed(1)}`;
    
    return { value: formattedDiff, isPositive: diff >= 0 };
  };

  const comparisonTableData = useMemo(() => {
    const period1Data = modo === 'entrenador'
      ? [
          { id: 1, categoria: 'Adherencia General', valor: '78%' },
          { id: 2, categoria: 'Sesiones Completadas', valor: '312' },
          { id: 3, categoria: 'Tasa de Asistencia', valor: '85%' },
          { id: 4, categoria: 'Sesiones Canceladas', valor: '20' },
          { id: 5, categoria: 'Tiempo Promedio', valor: '46 min' },
          { id: 6, categoria: 'Objetivos Cumplidos', valor: '72%' },
          { id: 7, categoria: 'Clientes Nuevos', valor: '6' },
          { id: 8, categoria: 'Retención', valor: '89%' },
        ]
      : [
          { id: 1, categoria: 'Ocupación General', valor: '68%' },
          { id: 2, categoria: 'Asistencias Totales', valor: '4,512' },
          { id: 3, categoria: 'Clases Impartidas', valor: '174' },
          { id: 4, categoria: 'Media Asistencia/Clase', valor: '25.9' },
          { id: 5, categoria: 'Franjas Saturadas', valor: '6' },
          { id: 6, categoria: 'Franjas Vacías', valor: '5' },
          { id: 7, categoria: 'Satisfacción Media', valor: '4.4/5' },
          { id: 8, categoria: 'Tasa Retención', valor: '75%' },
        ];

    const period2Data = tableData;

    return period1Data.map((p1, idx) => {
      const p2 = period2Data[idx];
      const diff = calculateDifference(p1.valor, p2.valor);
      return {
        categoria: p1.categoria,
        periodo1: p1.valor,
        periodo2: p2.valor,
        diferencia: diff.value,
        esMejora: diff.isPositive,
      };
    });
  }, [modo, tableData]);

  const comparisonColumns = [
    { key: 'categoria', label: 'Categoría' },
    { key: 'periodo1', label: `Período 1 (${period1.startDate} - ${period1.endDate})` },
    { key: 'periodo2', label: `Período 2 (${period2.startDate} - ${period2.endDate})` },
    { key: 'diferencia', label: 'Diferencia' },
  ];

  const formattedComparisonData = comparisonTableData.map(row => ({
    ...row,
    diferencia: (
      <div className="flex items-center gap-2">
        <span className={`font-semibold ${row.esMejora ? 'text-green-600' : 'text-red-600'}`}>
          {row.diferencia}
        </span>
        {row.esMejora ? (
          <TrendingUp size={16} className="text-green-600" />
        ) : (
          <TrendingDown size={16} className="text-red-600" />
        )}
      </div>
    ),
  }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-gray-900">
            Métricas de Adherencia
          </h3>
          <p className="text-sm text-gray-600 mt-2">
            Indicadores clave para decisiones operativas y análisis de rendimiento
          </p>
        </div>
        <Button
          variant={showComparison ? 'secondary' : 'primary'}
          onClick={() => setShowComparison(!showComparison)}
          leftIcon={<GitCompare size={18} />}
        >
          {showComparison ? 'Ocultar Comparación' : 'Comparar Períodos'}
        </Button>
      </div>

      {showComparison && (
        <Card className="bg-white shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <h4 className="text-lg font-semibold text-gray-900">
              Comparación de Períodos
            </h4>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowComparison(false)}
            >
              <X size={18} />
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="space-y-4">
              <h5 className="font-semibold text-gray-700 flex items-center gap-2">
                <Calendar size={18} className="text-blue-600" />
                Período 1
              </h5>
              <div className="grid grid-cols-2 gap-4">
                <Input
                  type="date"
                  label="Fecha Inicio"
                  value={period1.startDate}
                  onChange={(e) => setPeriod1({ ...period1, startDate: e.target.value })}
                />
                <Input
                  type="date"
                  label="Fecha Fin"
                  value={period1.endDate}
                  onChange={(e) => setPeriod1({ ...period1, endDate: e.target.value })}
                />
              </div>
              <div className="pt-4 border-t border-gray-200">
                <MetricCards data={metricsPeriod1} columns={2} />
              </div>
            </div>
            <div className="space-y-4">
              <h5 className="font-semibold text-gray-700 flex items-center gap-2">
                <Calendar size={18} className="text-green-600" />
                Período 2
              </h5>
              <div className="grid grid-cols-2 gap-4">
                <Input
                  type="date"
                  label="Fecha Inicio"
                  value={period2.startDate}
                  onChange={(e) => setPeriod2({ ...period2, startDate: e.target.value })}
                />
                <Input
                  type="date"
                  label="Fecha Fin"
                  value={period2.endDate}
                  onChange={(e) => setPeriod2({ ...period2, endDate: e.target.value })}
                />
              </div>
              <div className="pt-4 border-t border-gray-200">
                <MetricCards data={metricsPeriod2} columns={2} />
              </div>
            </div>
          </div>
          <div className="mt-6">
            <h5 className="font-semibold text-gray-900 mb-4">Comparativa Detallada</h5>
            <Table columns={comparisonColumns} data={formattedComparisonData} />
          </div>
        </Card>
      )}

      {!showComparison && <MetricCards data={metrics} columns={3} />}

      {/* Sección de Sincronización con Wearables (solo para entrenadores) */}
      {modo === 'entrenador' && (
        <div className="mt-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h4 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <ActivityIcon size={20} className="text-blue-600" />
                Sincronización con Wearables
              </h4>
              <p className="text-sm text-gray-600 mt-1">
                Correlaciona el esfuerzo real con el cumplimiento de entrenamientos y detecta sobrecargas
              </p>
            </div>
            <Button
              variant={showWearables ? 'secondary' : 'primary'}
              onClick={() => setShowWearables(!showWearables)}
              leftIcon={<RefreshCw size={18} />}
            >
              {showWearables ? 'Ocultar Wearables' : 'Ver Datos de Wearables'}
            </Button>
          </div>

          {showWearables && (
            <Card className="bg-white shadow-sm p-6">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Seleccionar Cliente
                  </label>
                  <Select
                    value={clienteSeleccionado}
                    onChange={(e) => setClienteSeleccionado(e.target.value)}
                    options={[{ value: '', label: 'Selecciona un cliente' }, ...clientes]}
                    className="w-full md:w-64"
                  />
                </div>

                {loadingWearables && (
                  <div className="text-center py-8">
                    <RefreshCw size={24} className="animate-spin mx-auto text-blue-600 mb-2" />
                    <p className="text-sm text-gray-600">Cargando datos de wearables...</p>
                  </div>
                )}

                {!loadingWearables && correlacionesWearables.length > 0 && (
                  <div className="space-y-6">
                    {correlacionesWearables.map((correlacion) => (
                      <div key={correlacion.clienteId} className="space-y-4">
                        <div className="border-b border-gray-200 pb-4">
                          <h5 className="text-lg font-semibold text-gray-900">{correlacion.clienteNombre}</h5>
                          <p className="text-sm text-gray-600">
                            Período: {correlacion.periodo.inicio.toLocaleDateString('es-ES')} - {correlacion.periodo.fin.toLocaleDateString('es-ES')}
                          </p>
                        </div>

                        {/* Métricas de Wearables */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <Card className="bg-blue-50 border border-blue-200 p-4">
                            <div className="flex items-center gap-2 mb-2">
                              <Heart size={20} className="text-blue-600" />
                              <span className="text-sm font-medium text-gray-700">Frecuencia Cardíaca</span>
                            </div>
                            <div className="text-2xl font-bold text-blue-900">
                              {correlacion.datosWearable.frecuenciaCardiacaPromedio} bpm
                            </div>
                            <p className="text-xs text-gray-600 mt-1">Promedio</p>
                          </Card>

                          <Card className="bg-green-50 border border-green-200 p-4">
                            <div className="flex items-center gap-2 mb-2">
                              <ActivityIcon size={20} className="text-green-600" />
                              <span className="text-sm font-medium text-gray-700">HRV (Variabilidad)</span>
                            </div>
                            <div className="text-2xl font-bold text-green-900">
                              {correlacion.datosWearable.hrvPromedio} ms
                            </div>
                            <p className="text-xs text-gray-600 mt-1">Promedio</p>
                          </Card>

                          <Card className="bg-purple-50 border border-purple-200 p-4">
                            <div className="flex items-center gap-2 mb-2">
                              <Clock size={20} className="text-purple-600" />
                              <span className="text-sm font-medium text-gray-700">Calidad de Sueño</span>
                            </div>
                            <div className="text-2xl font-bold text-purple-900">
                              {correlacion.datosWearable.calidadSueñoPromedio}%
                            </div>
                            <p className="text-xs text-gray-600 mt-1">Promedio</p>
                          </Card>
                        </div>

                        {/* Correlaciones */}
                        <div>
                          <h6 className="font-semibold text-gray-900 mb-3">Correlaciones con Adherencia</h6>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="p-4 bg-gray-50 rounded-lg">
                              <p className="text-sm text-gray-600 mb-1">Adherencia vs Frecuencia Cardíaca</p>
                              <div className="flex items-center gap-2">
                                <div className="flex-1 bg-gray-200 rounded-full h-2">
                                  <div
                                    className={`h-2 rounded-full ${
                                      correlacion.correlacion.adherenciaVsFrecuenciaCardiaca > 0.3
                                        ? 'bg-green-500'
                                        : correlacion.correlacion.adherenciaVsFrecuenciaCardiaca > -0.3
                                        ? 'bg-yellow-500'
                                        : 'bg-red-500'
                                    }`}
                                    style={{
                                      width: `${Math.abs(correlacion.correlacion.adherenciaVsFrecuenciaCardiaca) * 100}%`,
                                    }}
                                  />
                                </div>
                                <span className="text-sm font-semibold text-gray-900">
                                  {correlacion.correlacion.adherenciaVsFrecuenciaCardiaca.toFixed(2)}
                                </span>
                              </div>
                            </div>

                            <div className="p-4 bg-gray-50 rounded-lg">
                              <p className="text-sm text-gray-600 mb-1">Adherencia vs Recuperación</p>
                              <div className="flex items-center gap-2">
                                <div className="flex-1 bg-gray-200 rounded-full h-2">
                                  <div
                                    className={`h-2 rounded-full ${
                                      correlacion.correlacion.adherenciaVsRecuperacion > 0.3
                                        ? 'bg-green-500'
                                        : correlacion.correlacion.adherenciaVsRecuperacion > -0.3
                                        ? 'bg-yellow-500'
                                        : 'bg-red-500'
                                    }`}
                                    style={{
                                      width: `${Math.abs(correlacion.correlacion.adherenciaVsRecuperacion) * 100}%`,
                                    }}
                                  />
                                </div>
                                <span className="text-sm font-semibold text-gray-900">
                                  {correlacion.correlacion.adherenciaVsRecuperacion.toFixed(2)}
                                </span>
                              </div>
                            </div>

                            <div className="p-4 bg-gray-50 rounded-lg">
                              <p className="text-sm text-gray-600 mb-1">Adherencia vs Sobrecarga</p>
                              <div className="flex items-center gap-2">
                                <div className="flex-1 bg-gray-200 rounded-full h-2">
                                  <div
                                    className={`h-2 rounded-full ${
                                      correlacion.correlacion.adherenciaVsSobrecarga > 0.3
                                        ? 'bg-green-500'
                                        : correlacion.correlacion.adherenciaVsSobrecarga > -0.3
                                        ? 'bg-yellow-500'
                                        : 'bg-red-500'
                                    }`}
                                    style={{
                                      width: `${Math.abs(correlacion.correlacion.adherenciaVsSobrecarga) * 100}%`,
                                    }}
                                  />
                                </div>
                                <span className="text-sm font-semibold text-gray-900">
                                  {correlacion.correlacion.adherenciaVsSobrecarga.toFixed(2)}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Alertas */}
                        {(correlacion.alertas.sobrecarga ||
                          correlacion.alertas.fatiga ||
                          correlacion.alertas.recuperacionInsuficiente) && (
                          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                            <h6 className="font-semibold text-red-900 mb-2 flex items-center gap-2">
                              <AlertCircle size={18} />
                              Alertas Detectadas
                            </h6>
                            <ul className="space-y-1">
                              {correlacion.alertas.sobrecarga && (
                                <li className="text-sm text-red-700">
                                  • Sobrecarga detectada: {correlacion.datosWearable.sesionesConSobrecarga} sesiones
                                </li>
                              )}
                              {correlacion.alertas.fatiga && (
                                <li className="text-sm text-red-700">
                                  • Fatiga detectada: {correlacion.datosWearable.sesionesConFatiga} sesiones
                                </li>
                              )}
                              {correlacion.alertas.recuperacionInsuficiente && (
                                <li className="text-sm text-red-700">
                                  • Recuperación insuficiente (HRV bajo o sueño de baja calidad)
                                </li>
                              )}
                            </ul>
                          </div>
                        )}

                        {/* Resumen de adherencia */}
                        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm font-medium text-gray-700">Adherencia del Período</p>
                              <p className="text-2xl font-bold text-blue-900">{correlacion.adherencia.toFixed(1)}%</p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm text-gray-600">
                                Sesiones con sobrecarga: {correlacion.datosWearable.sesionesConSobrecarga}
                              </p>
                              <p className="text-sm text-gray-600">
                                Sesiones con fatiga: {correlacion.datosWearable.sesionesConFatiga}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {!loadingWearables && !clienteSeleccionado && (
                  <div className="text-center py-8 text-gray-500">
                    <ActivityIcon size={48} className="mx-auto mb-2 opacity-50" />
                    <p>Selecciona un cliente para ver los datos de wearables sincronizados</p>
                  </div>
                )}
              </div>
            </Card>
          )}
        </div>
      )}
      
      <div className="mt-8">
        <div className="mb-4">
          <h4 className="text-lg font-semibold text-gray-900">
            Análisis Detallado
          </h4>
          <p className="text-sm text-gray-600">
            {showComparison 
              ? 'Comparativa de métricas entre los dos períodos seleccionados'
              : 'Comparativa de métricas en el período seleccionado'}
          </p>
        </div>
        <Card className="bg-white shadow-sm p-6">
          {showComparison ? (
            <Table columns={comparisonColumns} data={formattedComparisonData} />
          ) : (
            <Table columns={columns} data={formattedTableData} />
          )}
        </Card>
      </div>
    </div>
  );
};


