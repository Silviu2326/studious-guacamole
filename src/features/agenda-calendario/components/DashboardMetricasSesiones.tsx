import React, { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, DollarSign, Calendar, PieChart, Clock, ArrowUp, ArrowDown, Minus } from 'lucide-react';
import { Card, MetricCards, Button } from '../../../components/componentsreutilizables';
import { MetricasSesiones, getMetricasSesionesMesActual, getTendenciasSemanales } from '../api/metricasSesiones';
import { useAuth } from '../../../context/AuthContext';
import { BarChart, Bar, PieChart as RechartsPieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#06B6D4'];

export const DashboardMetricasSesiones: React.FC = () => {
  const { user } = useAuth();
  const [metricas, setMetricas] = useState<MetricasSesiones | null>(null);
  const [tendenciasSemanales, setTendenciasSemanales] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    setLoading(true);
    try {
      const [metricasData, tendenciasData] = await Promise.all([
        getMetricasSesionesMesActual(user?.id),
        getTendenciasSemanales(8, user?.id),
      ]);
      setMetricas(metricasData);
      setTendenciasSemanales(tendenciasData);
    } catch (error) {
      console.error('Error cargando métricas de sesiones:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading && !metricas) {
    return (
      <div className="text-center py-8">
        <div className="text-gray-600">Cargando métricas...</div>
      </div>
    );
  }

  if (!metricas) {
    return (
      <Card className="bg-white shadow-sm">
        <div className="p-6">
          <div className="text-center py-8">
            <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No hay datos de métricas disponibles</p>
          </div>
        </div>
      </Card>
    );
  }

  const metricasCards = [
    {
      title: 'Total Sesiones',
      value: metricas.totalSesiones.toString(),
      icon: <Calendar className="w-6 h-6" />,
      trend: metricas.comparativaMesAnterior.tendencia === 'subiendo' ? 'up' : metricas.comparativaMesAnterior.tendencia === 'bajando' ? 'down' : null,
      trendValue: metricas.comparativaMesAnterior.porcentajeCambio !== 0 
        ? `${Math.abs(metricas.comparativaMesAnterior.porcentajeCambio)}% vs mes anterior`
        : null,
    },
    {
      title: 'Promedio por Día',
      value: metricas.promedioSesionesPorDia.toString(),
      icon: <Clock className="w-6 h-6" />,
      trend: null,
    },
    {
      title: 'Ingresos Generados',
      value: `€${metricas.ingresosGenerados}`,
      icon: <DollarSign className="w-6 h-6" />,
      trend: null,
    },
    {
      title: 'Comparativa Mes',
      value: `${metricas.comparativaMesAnterior.diferencia > 0 ? '+' : ''}${metricas.comparativaMesAnterior.diferencia}`,
      icon: <TrendingUp className="w-6 h-6" />,
      trend: metricas.comparativaMesAnterior.tendencia === 'subiendo' ? 'up' : metricas.comparativaMesAnterior.tendencia === 'bajando' ? 'down' : null,
      trendValue: `${metricas.comparativaMesAnterior.mesActual} vs ${metricas.comparativaMesAnterior.mesAnterior}`,
    },
  ];

  // Preparar datos para gráficos
  const datosSesionesPorTipo = metricas.sesionesPorTipo.map(item => ({
    name: item.tipo.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
    value: item.cantidad,
    porcentaje: item.porcentaje,
  }));

  const datosSesionesPorHorario = metricas.sesionesPorHorario
    .filter(item => item.cantidad > 0)
    .map(item => ({
      horario: item.horario,
      cantidad: item.cantidad,
    }));

  const datosSesionesPorDiaSemana = metricas.sesionesPorDiaSemana.map(item => ({
    dia: item.diaSemana,
    cantidad: item.cantidad,
  }));

  const datosTendencias = tendenciasSemanales.map(item => ({
    semana: item.semana,
    sesiones: item.totalSesiones,
    ingresos: item.ingresos,
  }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-white shadow-sm">
        <div className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Dashboard de Métricas de Sesiones</h2>
              <p className="text-gray-600 mt-1">Visión general de tu negocio de entrenamiento personal</p>
            </div>
            <Button variant="secondary" size="sm" onClick={cargarDatos}>
              Actualizar
            </Button>
          </div>
        </div>
      </Card>

      {/* Métricas principales */}
      <MetricCards metrics={metricasCards} />

      {/* Comparativa con mes anterior */}
      <Card className="bg-white shadow-sm">
        <div className="p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Comparativa con Mes Anterior</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="text-sm text-gray-600 mb-1">Mes Actual</div>
              <div className="text-2xl font-bold text-blue-600">
                {metricas.comparativaMesAnterior.mesActual} sesiones
              </div>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="text-sm text-gray-600 mb-1">Mes Anterior</div>
              <div className="text-2xl font-bold text-gray-600">
                {metricas.comparativaMesAnterior.mesAnterior} sesiones
              </div>
            </div>
            <div className={`p-4 rounded-lg ${
              metricas.comparativaMesAnterior.tendencia === 'subiendo'
                ? 'bg-green-50'
                : metricas.comparativaMesAnterior.tendencia === 'bajando'
                ? 'bg-red-50'
                : 'bg-yellow-50'
            }`}>
              <div className="text-sm text-gray-600 mb-1">Diferencia</div>
              <div className="flex items-center gap-2">
                {metricas.comparativaMesAnterior.tendencia === 'subiendo' && <ArrowUp className="w-5 h-5 text-green-600" />}
                {metricas.comparativaMesAnterior.tendencia === 'bajando' && <ArrowDown className="w-5 h-5 text-red-600" />}
                {metricas.comparativaMesAnterior.tendencia === 'estable' && <Minus className="w-5 h-5 text-yellow-600" />}
                <div className={`text-2xl font-bold ${
                  metricas.comparativaMesAnterior.tendencia === 'subiendo'
                    ? 'text-green-600'
                    : metricas.comparativaMesAnterior.tendencia === 'bajando'
                    ? 'text-red-600'
                    : 'text-yellow-600'
                }`}>
                  {metricas.comparativaMesAnterior.diferencia > 0 ? '+' : ''}{metricas.comparativaMesAnterior.diferencia}
                </div>
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {metricas.comparativaMesAnterior.porcentajeCambio > 0 ? '+' : ''}{metricas.comparativaMesAnterior.porcentajeCambio}%
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Gráfico de sesiones por tipo */}
      <Card className="bg-white shadow-sm">
        <div className="p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Sesiones por Tipo</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ResponsiveContainer width="100%" height={300}>
              <RechartsPieChart>
                <Pie
                  data={datosSesionesPorTipo}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, porcentaje }) => `${name}: ${porcentaje}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {datosSesionesPorTipo.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </RechartsPieChart>
            </ResponsiveContainer>
            <div className="space-y-2">
              {metricas.sesionesPorTipo.map((item, index) => (
                <div key={item.tipo} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-4 h-4 rounded"
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    />
                    <span className="font-medium text-gray-900">
                      {item.tipo.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-gray-900">{item.cantidad}</div>
                    <div className="text-sm text-gray-500">{item.porcentaje}%</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Card>

      {/* Gráfico de sesiones por horario */}
      <Card className="bg-white shadow-sm">
        <div className="p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Sesiones por Horario</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={datosSesionesPorHorario}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
              <XAxis dataKey="horario" tick={{ fill: '#64748B', fontSize: 12 }} />
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
              <Bar dataKey="cantidad" fill="#3B82F6" name="Cantidad de Sesiones" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Gráfico de sesiones por día de semana */}
      <Card className="bg-white shadow-sm">
        <div className="p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Sesiones por Día de Semana</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={datosSesionesPorDiaSemana}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
              <XAxis dataKey="dia" tick={{ fill: '#64748B', fontSize: 12 }} />
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
              <Bar dataKey="cantidad" fill="#10B981" name="Cantidad de Sesiones" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Gráfico de tendencias */}
      <Card className="bg-white shadow-sm">
        <div className="p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Tendencias (Últimas 8 Semanas)</h3>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={datosTendencias}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
              <XAxis dataKey="semana" tick={{ fill: '#64748B', fontSize: 12 }} />
              <YAxis yAxisId="left" tick={{ fill: '#64748B', fontSize: 12 }} />
              <YAxis yAxisId="right" orientation="right" tick={{ fill: '#64748B', fontSize: 12 }} />
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
                yAxisId="left"
                type="monotone"
                dataKey="sesiones"
                stroke="#3B82F6"
                strokeWidth={3}
                name="Sesiones"
                dot={{ fill: '#3B82F6', r: 5 }}
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="ingresos"
                stroke="#10B981"
                strokeWidth={3}
                name="Ingresos (€)"
                dot={{ fill: '#10B981', r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
};


