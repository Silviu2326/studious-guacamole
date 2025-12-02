import { useEffect, useState } from 'react';
import { Card } from '../../../components/componentsreutilizables/Card';
import { Select } from '../../../components/componentsreutilizables/Select';
import { Badge } from '../../../components/componentsreutilizables/Badge';
import { MetricCards } from '../../../components/componentsreutilizables/MetricCards';
import {
  Target,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle2,
  Clock,
  User,
  Calendar,
  BarChart3,
  Minus,
} from 'lucide-react';
import * as objetivosApi from '../api/objetivos-progreso';
import { ResumenObjetivosProgreso, ObjetivoCliente, MetricaProgreso } from '../types';

export function ObjetivosProgreso() {
  const [clientes, setClientes] = useState<Array<{ id: string; nombre: string }>>([]);
  const [clienteSeleccionado, setClienteSeleccionado] = useState<string>('');
  const [resumen, setResumen] = useState<ResumenObjetivosProgreso | null>(null);
  const [loading, setLoading] = useState(false);
  const [filtroHorizonte, setFiltroHorizonte] = useState<'todos' | 'corto' | 'medio' | 'largo'>('todos');
  const [filtroEstado, setFiltroEstado] = useState<'todos' | 'not_started' | 'in_progress' | 'achieved' | 'at_risk' | 'failed'>('todos');

  useEffect(() => {
    loadClientes();
  }, []);

  useEffect(() => {
    if (clienteSeleccionado) {
      loadResumen();
    } else {
      setResumen(null);
    }
  }, [clienteSeleccionado]);

  const loadClientes = async () => {
    try {
      const clientesData = await objetivosApi.getClientes();
      setClientes(clientesData);
      if (clientesData.length > 0) {
        setClienteSeleccionado(clientesData[0].id);
      }
    } catch (error) {
      console.error('Error loading clientes:', error);
    }
  };

  const loadResumen = async () => {
    setLoading(true);
    try {
      const resumenData = await objetivosApi.getObjetivosProgreso(clienteSeleccionado);
      setResumen(resumenData);
    } catch (error) {
      console.error('Error loading resumen:', error);
    } finally {
      setLoading(false);
    }
  };

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case 'achieved':
        return 'default';
      case 'in_progress':
        return 'secondary';
      case 'at_risk':
        return 'destructive';
      case 'failed':
        return 'destructive';
      case 'not_started':
        return 'outline';
      default:
        return 'outline';
    }
  };

  const getEstadoLabel = (estado: string) => {
    const labels: Record<string, string> = {
      not_started: 'No iniciado',
      in_progress: 'En progreso',
      achieved: 'Completado',
      at_risk: 'En riesgo',
      failed: 'Fallido',
    };
    return labels[estado] || estado;
  };

  const getHorizonteLabel = (horizonte: string) => {
    const labels: Record<string, string> = {
      corto: 'Corto Plazo',
      medio: 'Medio Plazo',
      largo: 'Largo Plazo',
    };
    return labels[horizonte] || horizonte;
  };

  const getTendenciaIcon = (tendencia: string) => {
    switch (tendencia) {
      case 'up':
        return <TrendingUp className="w-4 h-4 text-green-500" />;
      case 'down':
        return <TrendingDown className="w-4 h-4 text-red-500" />;
      default:
        return <Minus className="w-4 h-4 text-gray-400" />;
    }
  };

  const objetivosFiltrados = resumen?.objetivos.filter((obj) => {
    const matchHorizonte = filtroHorizonte === 'todos' || obj.horizonte === filtroHorizonte;
    const matchEstado = filtroEstado === 'todos' || obj.estado === filtroEstado;
    return matchHorizonte && matchEstado;
  }) || [];

  if (loading) {
    return (
      <Card className="p-8 text-center">
        <div className="text-gray-500">Cargando objetivos y progreso...</div>
      </Card>
    );
  }

  if (!resumen) {
    return (
      <div className="space-y-4">
        <Card className="p-6">
          <Select
            label="Seleccionar Cliente"
            value={clienteSeleccionado}
            onChange={(v) => setClienteSeleccionado(v)}
            options={[
              { label: 'Selecciona un cliente', value: '' },
              ...clientes.map((c) => ({ label: c.nombre, value: c.id })),
            ]}
          />
        </Card>
        <Card className="p-8 text-center text-gray-500">
          Selecciona un cliente para ver sus objetivos y progreso
        </Card>
      </div>
    );
  }

  const metricas = [
    {
      title: 'Total Objetivos',
      value: resumen.resumen.totalObjetivos.toString(),
      icon: <Target className="w-5 h-5" />,
      trend: 'neutral' as const,
      trendValue: '',
      color: 'blue' as const,
    },
    {
      title: 'En Progreso',
      value: resumen.resumen.objetivosEnProgreso.toString(),
      icon: <TrendingUp className="w-5 h-5" />,
      trend: 'up' as const,
      trendValue: '',
      color: 'green' as const,
    },
    {
      title: 'Completados',
      value: resumen.resumen.objetivosCompletados.toString(),
      icon: <CheckCircle2 className="w-5 h-5" />,
      trend: 'neutral' as const,
      trendValue: '',
      color: 'purple' as const,
    },
    {
      title: 'Progreso Promedio',
      value: `${resumen.resumen.progresoPromedio}%`,
      icon: <BarChart3 className="w-5 h-5" />,
      trend: 'up' as const,
      trendValue: '',
      color: 'orange' as const,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Selector de Cliente */}
      <Card className="p-6">
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <Select
              label="Cliente"
              value={clienteSeleccionado}
              onChange={(v) => setClienteSeleccionado(v)}
              options={[
                { label: 'Selecciona un cliente', value: '' },
                ...clientes.map((c) => ({ label: c.nombre, value: c.id })),
              ]}
            />
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <User className="w-4 h-4" />
            <span className="font-medium">{resumen.clienteNombre}</span>
          </div>
        </div>
      </Card>

      {/* Métricas Resumen */}
      <MetricCards data={metricas} />

      {/* Filtros */}
      <Card className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Select
            label="Filtrar por Horizonte"
            value={filtroHorizonte}
            onChange={(v) => setFiltroHorizonte(v as any)}
            options={[
              { label: 'Todos', value: 'todos' },
              { label: 'Corto Plazo', value: 'corto' },
              { label: 'Medio Plazo', value: 'medio' },
              { label: 'Largo Plazo', value: 'largo' },
            ]}
          />
          <Select
            label="Filtrar por Estado"
            value={filtroEstado}
            onChange={(v) => setFiltroEstado(v as any)}
            options={[
              { label: 'Todos', value: 'todos' },
              { label: 'No Iniciado', value: 'not_started' },
              { label: 'En Progreso', value: 'in_progress' },
              { label: 'Completado', value: 'achieved' },
              { label: 'En Riesgo', value: 'at_risk' },
              { label: 'Fallido', value: 'failed' },
            ]}
          />
        </div>
      </Card>

      {/* Objetivos */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Target className="w-5 h-5 text-blue-600" />
          <h2 className="text-xl font-semibold text-gray-900">Objetivos</h2>
        </div>
        {objetivosFiltrados.length === 0 ? (
          <div className="text-center py-8 text-gray-500">No hay objetivos que coincidan con los filtros</div>
        ) : (
          <div className="space-y-4">
            {objetivosFiltrados.map((objetivo) => (
              <div key={objetivo.id} className="p-5 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-gray-900">{objetivo.titulo}</h3>
                      <Badge variant={getEstadoColor(objetivo.estado)}>
                        {getEstadoLabel(objetivo.estado)}
                      </Badge>
                      <Badge variant="outline">{getHorizonteLabel(objetivo.horizonte)}</Badge>
                    </div>
                    {objetivo.descripcion && (
                      <p className="text-sm text-gray-600 mb-2">{objetivo.descripcion}</p>
                    )}
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>Límite: {new Date(objetivo.fechaLimite).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>Categoría: {objetivo.categoria}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">
                      Progreso: {objetivo.valorActual} / {objetivo.valorObjetivo} {objetivo.unidad}
                    </span>
                    <span className="font-semibold text-gray-900">{objetivo.progreso}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className={`h-3 rounded-full transition-all ${
                        objetivo.progreso >= 80
                          ? 'bg-green-500'
                          : objetivo.progreso >= 50
                          ? 'bg-yellow-500'
                          : objetivo.progreso >= 25
                          ? 'bg-orange-500'
                          : 'bg-red-500'
                      }`}
                      style={{ width: `${objetivo.progreso}%` }}
                    />
                  </div>
                  {objetivo.estado === 'at_risk' && (
                    <div className="flex items-center gap-2 text-sm text-orange-600 mt-2">
                      <AlertTriangle className="w-4 h-4" />
                      <span>Este objetivo requiere atención</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Métricas de Progreso */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <BarChart3 className="w-5 h-5 text-purple-600" />
          <h2 className="text-xl font-semibold text-gray-900">Métricas de Progreso</h2>
        </div>
        {resumen.metricas.length === 0 ? (
          <div className="text-center py-8 text-gray-500">No hay métricas disponibles</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {resumen.metricas.map((metrica) => (
              <div key={metrica.id} className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-700">{metrica.nombre}</span>
                    {getTendenciaIcon(metrica.tendencia)}
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {metrica.categoria}
                  </Badge>
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-1">
                  {metrica.valorActual} {metrica.unidad}
                </div>
                {metrica.cambio !== undefined && metrica.cambioPorcentual !== undefined && (
                  <div className="text-sm">
                    <span
                      className={
                        metrica.cambio > 0
                          ? 'text-green-600'
                          : metrica.cambio < 0
                          ? 'text-red-600'
                          : 'text-gray-600'
                      }
                    >
                      {metrica.cambio > 0 ? '+' : ''}
                      {metrica.cambio} {metrica.unidad} ({metrica.cambioPorcentual > 0 ? '+' : ''}
                      {metrica.cambioPorcentual.toFixed(1)}%)
                    </span>
                    {metrica.valorAnterior !== undefined && (
                      <span className="text-gray-500 ml-2">
                        (Anterior: {metrica.valorAnterior} {metrica.unidad})
                      </span>
                    )}
                  </div>
                )}
                <div className="text-xs text-gray-500 mt-1">
                  {new Date(metrica.fecha).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Resumen por Horizonte */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-3">
            <Clock className="w-5 h-5 text-blue-600" />
            <h3 className="font-semibold text-gray-900">Corto Plazo</h3>
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-1">
            {resumen.resumen.objetivosCortoPlazo}
          </div>
          <div className="text-sm text-gray-600">objetivos</div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-3">
            <Clock className="w-5 h-5 text-purple-600" />
            <h3 className="font-semibold text-gray-900">Medio Plazo</h3>
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-1">
            {resumen.resumen.objetivosMedioPlazo}
          </div>
          <div className="text-sm text-gray-600">objetivos</div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-3">
            <Clock className="w-5 h-5 text-indigo-600" />
            <h3 className="font-semibold text-gray-900">Largo Plazo</h3>
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-1">
            {resumen.resumen.objetivosLargoPlazo}
          </div>
          <div className="text-sm text-gray-600">objetivos</div>
        </Card>
      </div>
    </div>
  );
}

