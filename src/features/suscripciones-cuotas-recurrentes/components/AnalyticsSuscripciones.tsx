import React, { useMemo } from 'react';
import { Suscripcion } from '../types';
import { Card, MetricCards } from '../../../components/componentsreutilizables';
import { Users, TrendingUp, DollarSign, RefreshCw, TrendingDown, BarChart3 } from 'lucide-react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

interface AnalyticsSuscripcionesProps {
  suscripciones: Suscripcion[];
  userType: 'entrenador' | 'gimnasio';
}

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];

export const AnalyticsSuscripciones: React.FC<AnalyticsSuscripcionesProps> = ({
  suscripciones,
  userType,
}) => {
  const calcularMetricas = useMemo(() => {
    const activas = suscripciones.filter(s => s.estado === 'activa');
    const pausadas = suscripciones.filter(s => s.estado === 'pausada');
    const canceladas = suscripciones.filter(s => s.estado === 'cancelada');
    
    // Calcular MRR (Monthly Recurring Revenue)
    const mrr = activas.reduce((sum, s) => {
      let montoMensual = s.precio;
      if (s.frecuenciaPago === 'trimestral') {
        montoMensual = s.precio / 3;
      } else if (s.frecuenciaPago === 'semestral') {
        montoMensual = s.precio / 6;
      } else if (s.frecuenciaPago === 'anual') {
        montoMensual = s.precio / 12;
      }
      return sum + montoMensual;
    }, 0);

    // Calcular churn mensual (últimos 30 días)
    const fechaHace30Dias = new Date();
    fechaHace30Dias.setDate(fechaHace30Dias.getDate() - 30);
    const canceladasUltimoMes = canceladas.filter(s => {
      if (!s.fechaCancelacion) return false;
      const fechaCancelacion = new Date(s.fechaCancelacion);
      return fechaCancelacion >= fechaHace30Dias;
    }).length;
    const churnMensual = activas.length > 0 
      ? (canceladasUltimoMes / (activas.length + canceladasUltimoMes)) * 100 
      : 0;

    // Calcular LTV medio (Lifetime Value)
    const todasCuotas = suscripciones.flatMap(s => s.historialCuotas || []);
    const cuotasPagadas = todasCuotas.filter(c => c.estado === 'pagada');
    const ltvMedio = activas.length > 0
      ? cuotasPagadas.reduce((sum, c) => sum + (c.importe || c.monto || 0), 0) / activas.length
      : 0;

    // Calcular tasa de retención
    const tasaRetencion = suscripciones.length > 0
      ? (activas.length / suscripciones.length) * 100
      : 0;

    // Evolución de MRR (últimos 6 meses)
    const evolucionMRR = [];
    const fechaActual = new Date();
    for (let i = 5; i >= 0; i--) {
      const fechaMes = new Date(fechaActual);
      fechaMes.setMonth(fechaActual.getMonth() - i);
      const mes = fechaMes.toLocaleString('es-ES', { month: 'short', year: 'numeric' });
      
      const fechaInicio = new Date(fechaMes.getFullYear(), fechaMes.getMonth(), 1);
      const fechaFin = new Date(fechaMes.getFullYear(), fechaMes.getMonth() + 1, 0);
      
      const activasEnMes = activas.filter(s => {
        const fechaInicioSub = new Date(s.fechaInicio);
        const fechaVencimientoSub = new Date(s.fechaVencimiento);
        return fechaInicioSub <= fechaFin && fechaVencimientoSub >= fechaInicio;
      });

      const mrrMes = activasEnMes.reduce((sum, s) => {
        let montoMensual = s.precio;
        if (s.frecuenciaPago === 'trimestral') {
          montoMensual = s.precio / 3;
        } else if (s.frecuenciaPago === 'semestral') {
          montoMensual = s.precio / 6;
        } else if (s.frecuenciaPago === 'anual') {
          montoMensual = s.precio / 12;
        }
        return sum + montoMensual;
      }, 0);

      evolucionMRR.push({
        mes,
        mrr: mrrMes,
        numeroSuscripciones: activasEnMes.length,
      });
    }

    // Distribución por plan
    const distribucionPorPlan: Record<string, { numero: number; mrr: number }> = {};
    activas.forEach(s => {
      const planNombre = s.planNombre || s.nivelPlan || 'Sin plan';
      if (!distribucionPorPlan[planNombre]) {
        distribucionPorPlan[planNombre] = { numero: 0, mrr: 0 };
      }
      distribucionPorPlan[planNombre].numero += 1;
      
      let montoMensual = s.precio;
      if (s.frecuenciaPago === 'trimestral') {
        montoMensual = s.precio / 3;
      } else if (s.frecuenciaPago === 'semestral') {
        montoMensual = s.precio / 6;
      } else if (s.frecuenciaPago === 'anual') {
        montoMensual = s.precio / 12;
      }
      distribucionPorPlan[planNombre].mrr += montoMensual;
    });

    const distribucion = Object.entries(distribucionPorPlan).map(([planNombre, datos]) => ({
      planNombre,
      numeroSuscripciones: datos.numero,
      porcentaje: activas.length > 0 ? (datos.numero / activas.length) * 100 : 0,
      mrr: datos.mrr,
    })).sort((a, b) => b.numeroSuscripciones - a.numeroSuscripciones);

    return {
      mrr,
      numeroSuscripcionesActivas: activas.length,
      churnMensual,
      ltvMedio,
      retencion: tasaRetencion,
      evolucionMRR,
      distribucionPorPlan: distribucion,
    };
  }, [suscripciones]);

  const metricas = calcularMetricas;

  const metricCards = [
    {
      id: 'mrr',
      title: 'MRR',
      value: `${metricas.mrr.toFixed(0)} €`,
      subtitle: 'Monthly Recurring Revenue',
      icon: <DollarSign className="w-5 h-5" />,
      color: 'primary' as const,
    },
    {
      id: 'activas',
      title: userType === 'entrenador' ? 'Suscripciones Activas' : 'Membresías Activas',
      value: metricas.numeroSuscripcionesActivas.toString(),
      subtitle: `${suscripciones.length} total`,
      icon: <Users className="w-5 h-5" />,
      color: 'success' as const,
    },
    {
      id: 'churn',
      title: 'Churn Mensual',
      value: `${metricas.churnMensual.toFixed(1)}%`,
      subtitle: metricas.churnMensual < 5 ? 'Excelente' : metricas.churnMensual < 10 ? 'Aceptable' : 'Alto',
      icon: <TrendingDown className="w-5 h-5" />,
      color: metricas.churnMensual < 5 ? ('success' as const) : metricas.churnMensual < 10 ? ('warning' as const) : ('error' as const),
    },
    {
      id: 'ltv',
      title: 'LTV Medio',
      value: `${metricas.ltvMedio.toFixed(0)} €`,
      subtitle: 'Lifetime Value promedio',
      icon: <TrendingUp className="w-5 h-5" />,
      color: 'info' as const,
    },
    {
      id: 'retencion',
      title: 'Tasa de Retención',
      value: `${metricas.retencion.toFixed(1)}%`,
      subtitle: metricas.retencion > 80 ? 'Excelente' : 'Mejorable',
      icon: <RefreshCw className="w-5 h-5" />,
      color: metricas.retencion > 80 ? ('success' as const) : ('warning' as const),
    },
  ];

  return (
    <div className="space-y-6">
      <Card className="bg-white shadow-sm p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-6">
          Analytics de Suscripciones
        </h3>
        <MetricCards data={metricCards} columns={5} />
      </Card>

      {/* Gráfico de evolución de MRR */}
      <Card className="bg-white shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Evolución de MRR (Últimos 6 meses)
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={metricas.evolucionMRR} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
            <XAxis dataKey="mes" stroke="#64748B" />
            <YAxis 
              stroke="#64748B"
              tickFormatter={(value) => `€${(value / 1000).toFixed(0)}k`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#fff',
                border: '1px solid #E2E8F0',
                borderRadius: '8px',
              }}
              formatter={(value: number) => `${value.toFixed(0)}€`}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="mrr"
              name="MRR"
              stroke="#3B82F6"
              strokeWidth={2}
              dot={{ fill: '#3B82F6', r: 5 }}
              activeDot={{ r: 7 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      {/* Gráfico de evolución de suscripciones activas */}
      <Card className="bg-white shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Evolución de Suscripciones Activas (Últimos 6 meses)
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={metricas.evolucionMRR} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
            <XAxis dataKey="mes" stroke="#64748B" />
            <YAxis stroke="#64748B" />
            <Tooltip
              contentStyle={{
                backgroundColor: '#fff',
                border: '1px solid #E2E8F0',
                borderRadius: '8px',
              }}
            />
            <Legend />
            <Bar dataKey="numeroSuscripciones" name="Suscripciones Activas" fill="#10B981" />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      {/* Distribución por plan */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-white shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Distribución por Plan (Suscripciones)
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={metricas.distribucionPorPlan}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ planNombre, porcentaje }) => `${planNombre}: ${porcentaje.toFixed(1)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="numeroSuscripciones"
              >
                {metricas.distribucionPorPlan.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </Card>

        <Card className="bg-white shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Distribución por Plan (MRR)
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={metricas.distribucionPorPlan} margin={{ top: 5, right: 30, left: 20, bottom: 60 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
              <XAxis
                dataKey="planNombre"
                angle={-45}
                textAnchor="end"
                height={100}
                stroke="#64748B"
              />
              <YAxis
                stroke="#64748B"
                tickFormatter={(value) => `€${(value / 1000).toFixed(0)}k`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #E2E8F0',
                  borderRadius: '8px',
                }}
                formatter={(value: number) => `${value.toFixed(0)}€`}
              />
              <Legend />
              <Bar dataKey="mrr" name="MRR" fill="#3B82F6" />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>
    </div>
  );
};

