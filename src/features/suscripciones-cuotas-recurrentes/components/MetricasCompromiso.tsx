import React, { useState, useEffect } from 'react';
import { Card, Table, Badge, Button, MetricCards } from '../../../components/componentsreutilizables';
import { 
  AlertTriangle, 
  TrendingDown, 
  TrendingUp, 
  Users, 
  Activity, 
  DollarSign,
  Calendar,
  RefreshCw,
  Mail,
  Phone,
  Eye
} from 'lucide-react';
import { 
  getMetricasCompromiso,
} from '../api/suscripciones';
import { 
  MetricaCompromiso, 
  ResumenMetricasCompromiso,
  NivelRiesgo 
} from '../types';

interface MetricasCompromisoProps {
  entrenadorId?: string;
  onVerCliente?: (clienteId: string) => void;
}

export const MetricasCompromiso: React.FC<MetricasCompromisoProps> = ({
  entrenadorId,
  onVerCliente,
}) => {
  const [loading, setLoading] = useState(true);
  const [resumen, setResumen] = useState<ResumenMetricasCompromiso | null>(null);
  const [filtroRiesgo, setFiltroRiesgo] = useState<NivelRiesgo | 'todos'>('todos');

  useEffect(() => {
    loadMetricas();
  }, [entrenadorId]);

  const loadMetricas = async () => {
    try {
      setLoading(true);
      const data = await getMetricasCompromiso(entrenadorId);
      setResumen(data);
    } catch (error) {
      console.error('Error cargando métricas de compromiso:', error);
    } finally {
      setLoading(false);
    }
  };

  const getNivelRiesgoBadge = (nivel: NivelRiesgo) => {
    const niveles: Record<NivelRiesgo, { label: string; color: 'success' | 'warning' | 'error' | 'info' }> = {
      bajo: { label: 'Bajo', color: 'success' },
      medio: { label: 'Medio', color: 'warning' },
      alto: { label: 'Alto', color: 'error' },
      critico: { label: 'Crítico', color: 'error' },
    };
    
    const nivelData = niveles[nivel];
    return <Badge color={nivelData.color}>{nivelData.label}</Badge>;
  };

  const getMetricasFiltradas = () => {
    if (!resumen) return [];
    if (filtroRiesgo === 'todos') return resumen.metricas;
    return resumen.metricas.filter(m => m.nivelRiesgo === filtroRiesgo);
  };

  if (loading) {
    return (
      <Card className="bg-white shadow-sm p-6">
        <div className="flex items-center justify-center py-8">
          <RefreshCw className="w-6 h-6 animate-spin text-gray-400" />
          <span className="ml-2 text-gray-600">Cargando métricas...</span>
        </div>
      </Card>
    );
  }

  if (!resumen) {
    return (
      <Card className="bg-white shadow-sm p-6">
        <div className="text-center py-8 text-gray-600">
          No se pudieron cargar las métricas de compromiso
        </div>
      </Card>
    );
  }

  const metricasFiltradas = getMetricasFiltradas();

  const metricCards = [
    {
      id: 'total',
      title: 'Total Clientes',
      value: resumen.totalClientes.toString(),
      subtitle: 'Suscripciones activas',
      icon: <Users className="w-5 h-5" />,
      color: 'info' as const,
    },
    {
      id: 'riesgo',
      title: 'Clientes en Riesgo',
      value: resumen.clientesEnRiesgo.toString(),
      subtitle: `${resumen.clientesRiesgoAlto} alto, ${resumen.clientesRiesgoCritico} crítico`,
      icon: <AlertTriangle className="w-5 h-5" />,
      color: resumen.clientesEnRiesgo > 0 ? ('error' as const) : ('success' as const),
    },
    {
      id: 'compromiso',
      title: 'Compromiso Promedio',
      value: `${resumen.tasaCompromisoPromedio.toFixed(1)}%`,
      subtitle: resumen.tasaCompromisoPromedio > 70 ? 'Excelente' : resumen.tasaCompromisoPromedio > 50 ? 'Bueno' : 'Mejorable',
      icon: <Activity className="w-5 h-5" />,
      color: resumen.tasaCompromisoPromedio > 70 ? ('success' as const) : resumen.tasaCompromisoPromedio > 50 ? ('warning' as const) : ('error' as const),
    },
    {
      id: 'uso',
      title: 'Tasa de Uso',
      value: `${resumen.tasaUsoPromedio.toFixed(1)}%`,
      subtitle: 'Sesiones utilizadas',
      icon: <TrendingUp className="w-5 h-5" />,
      color: resumen.tasaUsoPromedio > 70 ? ('success' as const) : resumen.tasaUsoPromedio > 50 ? ('warning' as const) : ('error' as const),
    },
  ];

  const columns = [
    {
      key: 'clienteNombre',
      label: 'Cliente',
      render: (value: string, row: MetricaCompromiso) => (
        <div>
          <div className="text-base font-semibold text-gray-900">
            {value}
          </div>
          <div className="text-sm text-gray-600">
            {row.clienteEmail}
          </div>
        </div>
      ),
    },
    {
      key: 'puntuacionCompromiso',
      label: 'Compromiso',
      render: (value: number, row: MetricaCompromiso) => (
        <div className="flex items-center gap-2">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className={`text-lg font-semibold ${
                value >= 70 ? 'text-green-600' : 
                value >= 50 ? 'text-yellow-600' : 
                'text-red-600'
              }`}>
                {value}%
              </span>
              {value >= 70 ? (
                <TrendingUp className="w-4 h-4 text-green-600" />
              ) : value < 50 ? (
                <TrendingDown className="w-4 h-4 text-red-600" />
              ) : null}
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full ${
                  value >= 70 ? 'bg-green-600' : 
                  value >= 50 ? 'bg-yellow-600' : 
                  'bg-red-600'
                }`}
                style={{ width: `${value}%` }}
              />
            </div>
          </div>
        </div>
      ),
    },
    {
      key: 'nivelRiesgo',
      label: 'Nivel de Riesgo',
      render: (value: NivelRiesgo, row: MetricaCompromiso) => (
        <div>
          {getNivelRiesgoBadge(value)}
          {row.factoresRiesgo.length > 0 && (
            <div className="mt-1 text-xs text-gray-600">
              {row.factoresRiesgo.length} factor{row.factoresRiesgo.length > 1 ? 'es' : ''}
            </div>
          )}
        </div>
      ),
    },
    {
      key: 'tasaUsoSesiones',
      label: 'Uso de Sesiones',
      render: (value: number, row: MetricaCompromiso) => (
        <div>
          <div className="text-base font-semibold text-gray-900">
            {value.toFixed(1)}%
          </div>
          <div className="text-sm text-gray-600">
            {row.sesionesUsadasUltimos3Meses}/{row.sesionesIncluidasUltimos3Meses} sesiones
          </div>
        </div>
      ),
    },
    {
      key: 'diasDesdeUltimaSesion',
      label: 'Última Actividad',
      render: (value: number) => (
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-gray-400" />
          <span className={`text-base ${
            value <= 7 ? 'text-green-600' : 
            value <= 14 ? 'text-yellow-600' : 
            'text-red-600'
          }`}>
            {value} días
          </span>
        </div>
      ),
    },
    {
      key: 'tasaPagosPuntuales',
      label: 'Pagos',
      render: (value: number, row: MetricaCompromiso) => (
        <div>
          <div className="text-base font-semibold text-gray-900">
            {value.toFixed(1)}%
          </div>
          <div className="text-sm text-gray-600">
            {row.pagosPuntuales} puntuales, {row.pagosFallidos} fallidos
          </div>
        </div>
      ),
    },
    {
      key: 'factoresRiesgo',
      label: 'Factores de Riesgo',
      render: (value: string[], row: MetricaCompromiso) => (
        <div>
          {value.length > 0 ? (
            <div className="flex flex-col gap-1">
              {value.slice(0, 2).map((factor, idx) => (
                <span key={idx} className="text-xs bg-red-50 text-red-700 px-2 py-1 rounded">
                  {factor}
                </span>
              ))}
              {value.length > 2 && (
                <span className="text-xs text-gray-500">
                  +{value.length - 2} más
                </span>
              )}
            </div>
          ) : (
            <span className="text-sm text-gray-400">Ninguno</span>
          )}
        </div>
      ),
    },
    {
      key: 'actions',
      label: 'Acciones',
      render: (value: any, row: MetricaCompromiso) => (
        <div className="flex items-center gap-2">
          {onVerCliente && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onVerCliente(row.clienteId)}
              title="Ver detalles del cliente"
            >
              <Eye className="w-4 h-4" />
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => window.location.href = `mailto:${row.clienteEmail}`}
            title="Enviar email"
          >
            <Mail className="w-4 h-4" />
          </Button>
          {row.clienteTelefono && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => window.location.href = `tel:${row.clienteTelefono}`}
              title="Llamar"
            >
              <Phone className="w-4 h-4" />
            </Button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <Card className="bg-white shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-semibold text-gray-900">
              Métricas de Compromiso
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              Identifica clientes en riesgo de cancelación y actúa preventivamente
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={loadMetricas}
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Actualizar
          </Button>
        </div>
        
        <MetricCards data={metricCards} columns={4} />
      </Card>

      <Card className="bg-white shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">
            Clientes en Riesgo
          </h3>
          <div className="flex items-center gap-2">
            <select
              value={filtroRiesgo}
              onChange={(e) => setFiltroRiesgo(e.target.value as NivelRiesgo | 'todos')}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="todos">Todos los niveles</option>
              <option value="critico">Crítico</option>
              <option value="alto">Alto</option>
              <option value="medio">Medio</option>
              <option value="bajo">Bajo</option>
            </select>
          </div>
        </div>

        <Table
          data={metricasFiltradas}
          columns={columns}
          emptyMessage="No hay clientes con este nivel de riesgo"
        />
      </Card>
    </div>
  );
};

