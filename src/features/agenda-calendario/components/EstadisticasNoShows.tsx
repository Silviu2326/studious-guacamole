import React, { useState, useEffect } from 'react';
import { AlertTriangle, TrendingUp, TrendingDown, Users, XCircle, CheckCircle, AlertCircle, MessageSquare, BarChart3, Eye } from 'lucide-react';
import { Card, Table, Badge, Button, MetricCards, Modal } from '../../../components/componentsreutilizables';
import { EstadisticasNoShowsClienteExtendida, AlertaNoShow } from '../types';
import {
  getEstadisticasNoShowsTodosClientesExtendida,
  getAlertasNoShow,
  resolverAlertaNoShow,
} from '../api/metricasNoShows';
import { useAuth } from '../../../context/AuthContext';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';

export const EstadisticasNoShows: React.FC = () => {
  const { user } = useAuth();
  const [estadisticas, setEstadisticas] = useState<EstadisticasNoShowsClienteExtendida[]>([]);
  const [alertas, setAlertas] = useState<AlertaNoShow[]>([]);
  const [loading, setLoading] = useState(false);
  const [filtro, setFiltro] = useState<'todos' | 'con-alertas' | 'sin-alertas'>('todos');
  const [clienteSeleccionado, setClienteSeleccionado] = useState<EstadisticasNoShowsClienteExtendida | null>(null);
  const [mostrarModalDetalle, setMostrarModalDetalle] = useState(false);
  const [mostrarModalSugerencia, setMostrarModalSugerencia] = useState(false);

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    setLoading(true);
    try {
      const [estadisticasData, alertasData] = await Promise.all([
        getEstadisticasNoShowsTodosClientesExtendida(user?.id),
        getAlertasNoShow(user?.id),
      ]);
      setEstadisticas(estadisticasData);
      setAlertas(alertasData);
    } catch (error) {
      console.error('Error cargando estadísticas:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleResolverAlerta = async (alertaId: string) => {
    try {
      await resolverAlertaNoShow(alertaId);
      await cargarDatos();
    } catch (error) {
      console.error('Error resolviendo alerta:', error);
    }
  };

  const handleVerDetalle = (cliente: EstadisticasNoShowsClienteExtendida) => {
    setClienteSeleccionado(cliente);
    setMostrarModalDetalle(true);
  };

  const handleVerSugerencia = (cliente: EstadisticasNoShowsClienteExtendida) => {
    setClienteSeleccionado(cliente);
    setMostrarModalSugerencia(true);
  };

  const estadisticasFiltradas = estadisticas.filter(e => {
    if (filtro === 'con-alertas') return e.tieneAlerta;
    if (filtro === 'sin-alertas') return !e.tieneAlerta;
    return true;
  });

  const totalClientes = estadisticas.length;
  const clientesConAlertas = estadisticas.filter(e => e.tieneAlerta).length;
  const totalNoShows = estadisticas.reduce((sum, e) => sum + e.sesionesNoShow, 0);
  const tasaPromedioNoShow = totalClientes > 0
    ? Math.round(estadisticas.reduce((sum, e) => sum + e.tasaNoShow, 0) / totalClientes)
    : 0;
  const tasaPromedioAdherencia = totalClientes > 0
    ? Math.round(estadisticas.reduce((sum, e) => sum + e.porcentajeAdherencia, 0) / totalClientes)
    : 0;

  const metricas = [
    {
      title: 'Total Clientes',
      value: totalClientes.toString(),
      icon: <Users className="w-6 h-6" />,
      trend: null,
    },
    {
      title: 'Clientes con Alertas',
      value: clientesConAlertas.toString(),
      icon: <AlertTriangle className="w-6 h-6" />,
      trend: clientesConAlertas > 0 ? 'up' : null,
      trendValue: clientesConAlertas > 0 ? 'Requiere atención' : 'Sin alertas',
    },
    {
      title: 'Tasa Promedio Adherencia',
      value: `${tasaPromedioAdherencia}%`,
      icon: <TrendingUp className="w-6 h-6" />,
      trend: tasaPromedioAdherencia > 80 ? 'down' : tasaPromedioAdherencia > 60 ? null : 'up',
    },
    {
      title: 'Total No-Shows',
      value: totalNoShows.toString(),
      icon: <XCircle className="w-6 h-6" />,
      trend: totalNoShows > 0 ? 'up' : null,
    },
  ];

  const columnas = [
    {
      key: 'clienteNombre',
      label: 'Cliente',
    },
    {
      key: 'totalSesiones',
      label: 'Total Sesiones',
    },
    {
      key: 'sesionesCompletadas',
      label: 'Asistidas',
    },
    {
      key: 'sesionesNoShow',
      label: 'No-Shows',
    },
    {
      key: 'sesionesCanceladas',
      label: 'Canceladas',
    },
    {
      key: 'porcentajeAdherencia',
      label: 'Adherencia',
      render: (value: number) => (
        <span className={value > 80 ? 'text-green-600 font-semibold' : value > 60 ? 'text-yellow-600' : 'text-red-600'}>
          {value}%
        </span>
      ),
    },
    {
      key: 'tasaNoShow',
      label: 'Tasa No-Show',
      render: (value: number) => (
        <span className={value > 20 ? 'text-red-600 font-semibold' : value > 10 ? 'text-orange-600' : 'text-gray-600'}>
          {value}%
        </span>
      ),
    },
    {
      key: 'tieneAlerta',
      label: 'Estado',
      render: (value: boolean, row: EstadisticasNoShowsClienteExtendida) => (
        <div className="flex items-center gap-2">
          {value ? (
            <Badge variant="danger">Alerta</Badge>
          ) : (
            <Badge variant="success">Normal</Badge>
          )}
          <Button
            variant="secondary"
            size="sm"
            onClick={() => handleVerDetalle(row)}
          >
            <Eye className="w-4 h-4" />
          </Button>
          {row.sugerenciaConversacion && (
            <Button
              variant="primary"
              size="sm"
              onClick={() => handleVerSugerencia(row)}
            >
              <MessageSquare className="w-4 h-4" />
            </Button>
          )}
        </div>
      ),
    },
  ];

  // Preparar datos para el gráfico de tendencia
  const datosGraficoTendencia = clienteSeleccionado?.tendenciaUltimos3Meses.map(t => ({
    mes: t.mes.split(' ')[0], // Solo el mes
    tasaAsistencia: t.tasaAsistencia,
    tasaNoShow: t.tasaNoShow,
    totalSesiones: t.totalSesiones,
  })) || [];

  const COLORS = {
    advertencia: '#F59E0B',
    mejora: '#3B82F6',
    recompensa: '#10B981',
  };

  return (
    <div className="space-y-6">
      {/* Métricas */}
      <MetricCards metrics={metricas} />

      {/* Alertas */}
      {alertas.length > 0 && (
        <Card className="bg-red-50 border-red-200">
          <div className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <AlertTriangle className="w-6 h-6 text-red-600" />
              <h2 className="text-xl font-bold text-red-900">Alertas Activas</h2>
            </div>
            <div className="space-y-3">
              {alertas.map((alerta) => (
                <div
                  key={alerta.id}
                  className={`p-4 rounded-lg border ${
                    alerta.tipoAlerta === 'critica'
                      ? 'bg-red-100 border-red-300'
                      : 'bg-orange-100 border-orange-300'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant={alerta.tipoAlerta === 'critica' ? 'danger' : 'warning'}>
                          {alerta.tipoAlerta === 'critica' ? 'Crítica' : 'Advertencia'}
                        </Badge>
                        <span className="font-semibold text-gray-900">{alerta.clienteNombre}</span>
                      </div>
                      <p className="text-sm text-gray-700 mb-2">{alerta.mensaje}</p>
                      <p className="text-xs text-gray-500">
                        {alerta.noShowsCount} no-shows registrados. Último: {' '}
                        {new Date(alerta.fechaUltimoNoShow).toLocaleDateString('es-ES')}
                      </p>
                    </div>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => handleResolverAlerta(alerta.id)}
                    >
                      Resolver
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      )}

      {/* Filtros */}
      <Card>
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">Estadísticas por Cliente</h2>
            <div className="flex gap-2">
              <Button
                variant={filtro === 'todos' ? 'primary' : 'secondary'}
                size="sm"
                onClick={() => setFiltro('todos')}
              >
                Todos
              </Button>
              <Button
                variant={filtro === 'con-alertas' ? 'primary' : 'secondary'}
                size="sm"
                onClick={() => setFiltro('con-alertas')}
              >
                Con Alertas
              </Button>
              <Button
                variant={filtro === 'sin-alertas' ? 'primary' : 'secondary'}
                size="sm"
                onClick={() => setFiltro('sin-alertas')}
              >
                Sin Alertas
              </Button>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-8 text-gray-500">Cargando estadísticas...</div>
          ) : estadisticasFiltradas.length === 0 ? (
            <div className="text-center py-8 text-gray-500">No hay estadísticas disponibles</div>
          ) : (
            <Table
              columns={columnas}
              data={estadisticasFiltradas}
              keyExtractor={(row) => row.clienteId}
            />
          )}
        </div>
      </Card>

      {/* Modal de Detalle del Cliente */}
      <Modal
        isOpen={mostrarModalDetalle}
        onClose={() => setMostrarModalDetalle(false)}
        title={`Dashboard - ${clienteSeleccionado?.clienteNombre}`}
        size="lg"
      >
        {clienteSeleccionado && (
          <div className="space-y-6">
            {/* Métricas del Cliente */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card className="bg-white">
                <div className="p-4">
                  <div className="text-sm text-gray-600 mb-1">Total Sesiones</div>
                  <div className="text-2xl font-bold text-gray-900">{clienteSeleccionado.totalSesiones}</div>
                </div>
              </Card>
              <Card className="bg-white">
                <div className="p-4">
                  <div className="text-sm text-gray-600 mb-1">Asistidas</div>
                  <div className="text-2xl font-bold text-green-600">{clienteSeleccionado.sesionesCompletadas}</div>
                </div>
              </Card>
              <Card className="bg-white">
                <div className="p-4">
                  <div className="text-sm text-gray-600 mb-1">No-Shows</div>
                  <div className="text-2xl font-bold text-red-600">{clienteSeleccionado.sesionesNoShow}</div>
                </div>
              </Card>
              <Card className="bg-white">
                <div className="p-4">
                  <div className="text-sm text-gray-600 mb-1">Canceladas</div>
                  <div className="text-2xl font-bold text-orange-600">{clienteSeleccionado.sesionesCanceladas}</div>
                </div>
              </Card>
            </div>

            {/* Porcentaje de Adherencia */}
            <Card className="bg-white">
              <div className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Porcentaje de Adherencia</h3>
                  <Badge variant={clienteSeleccionado.porcentajeAdherencia > 80 ? 'success' : clienteSeleccionado.porcentajeAdherencia > 60 ? 'warning' : 'danger'}>
                    {clienteSeleccionado.porcentajeAdherencia}%
                  </Badge>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-4">
                  <div
                    className={`h-4 rounded-full ${
                      clienteSeleccionado.porcentajeAdherencia > 80
                        ? 'bg-green-500'
                        : clienteSeleccionado.porcentajeAdherencia > 60
                        ? 'bg-yellow-500'
                        : 'bg-red-500'
                    }`}
                    style={{ width: `${clienteSeleccionado.porcentajeAdherencia}%` }}
                  />
                </div>
              </div>
            </Card>

            {/* Gráfico de Tendencia */}
            {clienteSeleccionado.tendenciaUltimos3Meses.length > 0 && (
              <Card className="bg-white">
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Tendencia Últimos 3 Meses</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={datosGraficoTendencia}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                      <XAxis dataKey="mes" tick={{ fill: '#64748B', fontSize: 12 }} />
                      <YAxis tick={{ fill: '#64748B', fontSize: 12 }} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#fff',
                          border: '1px solid #E2E8F0',
                          borderRadius: '8px',
                          padding: '8px',
                        }}
                      />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="tasaAsistencia"
                        stroke="#10B981"
                        strokeWidth={2}
                        name="Tasa Asistencia %"
                      />
                      <Line
                        type="monotone"
                        dataKey="tasaNoShow"
                        stroke="#EF4444"
                        strokeWidth={2}
                        name="Tasa No-Show %"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                  
                  {/* Gráfico de barras para total de sesiones */}
                  <div className="mt-6">
                    <h4 className="text-md font-semibold text-gray-700 mb-3">Total Sesiones por Mes</h4>
                    <ResponsiveContainer width="100%" height={200}>
                      <BarChart data={datosGraficoTendencia}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                        <XAxis dataKey="mes" tick={{ fill: '#64748B', fontSize: 12 }} />
                        <YAxis tick={{ fill: '#64748B', fontSize: 12 }} />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: '#fff',
                            border: '1px solid #E2E8F0',
                            borderRadius: '8px',
                            padding: '8px',
                          }}
                        />
                        <Bar dataKey="totalSesiones" fill="#3B82F6" name="Total Sesiones" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </Card>
            )}
          </div>
        )}
      </Modal>

      {/* Modal de Sugerencia de Conversación */}
      <Modal
        isOpen={mostrarModalSugerencia}
        onClose={() => setMostrarModalSugerencia(false)}
        title={`Sugerencia de Conversación - ${clienteSeleccionado?.clienteNombre}`}
        size="lg"
      >
        {clienteSeleccionado?.sugerenciaConversacion && (
          <div className="space-y-4">
            <div className={`p-4 rounded-lg border ${
              clienteSeleccionado.sugerenciaConversacion.tipo === 'advertencia'
                ? 'bg-orange-50 border-orange-200'
                : clienteSeleccionado.sugerenciaConversacion.tipo === 'mejora'
                ? 'bg-blue-50 border-blue-200'
                : 'bg-green-50 border-green-200'
            }`}>
              <div className="flex items-center gap-2 mb-2">
                <Badge
                  variant={
                    clienteSeleccionado.sugerenciaConversacion.tipo === 'advertencia'
                      ? 'warning'
                      : clienteSeleccionado.sugerenciaConversacion.tipo === 'mejora'
                      ? 'info'
                      : 'success'
                  }
                >
                  {clienteSeleccionado.sugerenciaConversacion.tipo === 'advertencia'
                    ? 'Advertencia'
                    : clienteSeleccionado.sugerenciaConversacion.tipo === 'mejora'
                    ? 'Mejora'
                    : 'Reconocimiento'}
                </Badge>
                <span className="text-sm text-gray-600">
                  Tono: {clienteSeleccionado.sugerenciaConversacion.tono}
                </span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {clienteSeleccionado.sugerenciaConversacion.titulo}
              </h3>
              <p className="text-gray-700 mb-4">{clienteSeleccionado.sugerenciaConversacion.mensaje}</p>
              
              <div className="mt-4">
                <h4 className="text-sm font-semibold text-gray-900 mb-2">Puntos Clave:</h4>
                <ul className="list-disc list-inside space-y-1">
                  {clienteSeleccionado.sugerenciaConversacion.puntosClave.map((punto, index) => (
                    <li key={index} className="text-sm text-gray-700">{punto}</li>
                  ))}
                </ul>
              </div>
            </div>
            
            <div className="flex justify-end gap-2">
              <Button variant="secondary" onClick={() => setMostrarModalSugerencia(false)}>
                Cerrar
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
