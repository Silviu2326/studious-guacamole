import React, { useState, useEffect } from 'react';
import { Card } from '../../../components/componentsreutilizables';
import { Factura, Cobro } from '../types';
import { facturasAPI } from '../api/facturas';
import { cobrosAPI } from '../api/cobros';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { 
  DollarSign, 
  TrendingUp, 
  Clock, 
  Calendar,
  ArrowUpCircle,
  CheckCircle
} from 'lucide-react';

interface DashboardWidgetProps {
  facturas?: Factura[];
  onRefresh?: () => void;
}

interface MonthlyData {
  mes: string;
  facturado: number;
  cobrado: number;
}

interface DashboardStats {
  ingresosMes: number;
  cobradoMes: number;
  pendienteCobro: number;
  proximosVencimientos: Factura[];
  tendenciaMensual: MonthlyData[];
}

export const DashboardWidget: React.FC<DashboardWidgetProps> = ({ 
  facturas: facturasProp,
  onRefresh 
}) => {
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState<DashboardStats>({
    ingresosMes: 0,
    cobradoMes: 0,
    pendienteCobro: 0,
    proximosVencimientos: [],
    tendenciaMensual: []
  });
  const [facturas, setFacturas] = useState<Factura[]>(facturasProp || []);

  useEffect(() => {
    cargarDatos();
  }, []);

  useEffect(() => {
    if (facturasProp && facturasProp.length > 0) {
      setFacturas(facturasProp);
      calcularEstadisticas(facturasProp).catch(error => {
        console.error('Error al calcular estadísticas:', error);
      });
    }
  }, [facturasProp]);

  const cargarDatos = async () => {
    if (facturasProp) {
      await calcularEstadisticas(facturasProp);
      return;
    }
    
    setLoading(true);
    try {
      const facturasData = await facturasAPI.obtenerFacturas();
      setFacturas(facturasData);
      await calcularEstadisticas(facturasData);
    } catch (error) {
      console.error('Error al cargar datos del dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const calcularEstadisticas = async (facturasData: Factura[]) => {
    const ahora = new Date();
    const inicioMes = new Date(ahora.getFullYear(), ahora.getMonth(), 1);
    const finMes = new Date(ahora.getFullYear(), ahora.getMonth() + 1, 0);

    // Calcular ingresos del mes (facturado)
    const facturasMes = facturasData.filter(f => {
      const fechaEmision = new Date(f.fechaEmision);
      return fechaEmision >= inicioMes && fechaEmision <= finMes;
    });
    const ingresosMes = facturasMes.reduce((sum, f) => sum + f.total, 0);

    // Calcular cobrado del mes (pagos registrados en el mes)
    let cobradoMes = 0;
    try {
      const cobrosMes = await cobrosAPI.obtenerCobros({
        fechaInicio: inicioMes,
        fechaFin: finMes
      });
      cobradoMes = cobrosMes.reduce((sum, c) => sum + c.monto, 0);
    } catch (error) {
      console.error('Error al cargar cobros:', error);
      // Calcular desde las facturas pagadas del mes
      const facturasPagadasMes = facturasMes.filter(f => f.estado === 'pagada');
      cobradoMes = facturasPagadasMes.reduce((sum, f) => sum + f.total, 0);
    }

    // Calcular pendiente de cobro
    const pendienteCobro = facturasData
      .filter(f => f.estado === 'pendiente' || f.estado === 'parcial' || f.estado === 'vencida')
      .reduce((sum, f) => sum + f.montoPendiente, 0);

    // Proximos vencimientos (próximos 7 días)
    const proximos7Dias = new Date();
    proximos7Dias.setDate(proximos7Dias.getDate() + 7);
    const proximosVencimientos = facturasData
      .filter(f => {
        const fechaVenc = new Date(f.fechaVencimiento);
        return fechaVenc >= ahora && fechaVenc <= proximos7Dias && f.montoPendiente > 0;
      })
      .sort((a, b) => a.fechaVencimiento.getTime() - b.fechaVencimiento.getTime())
      .slice(0, 5);

    // Tendencia mensual (últimos 6 meses)
    const tendenciaMensual: MonthlyData[] = [];
    const nombresMeses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    
    for (let i = 5; i >= 0; i--) {
      const fecha = new Date(ahora.getFullYear(), ahora.getMonth() - i, 1);
      const inicioMesTendencia = new Date(fecha.getFullYear(), fecha.getMonth(), 1);
      const finMesTendencia = new Date(fecha.getFullYear(), fecha.getMonth() + 1, 0);
      
      const facturasMesTendencia = facturasData.filter(f => {
        const fechaEmision = new Date(f.fechaEmision);
        return fechaEmision >= inicioMesTendencia && fechaEmision <= finMesTendencia;
      });
      
      const facturado = facturasMesTendencia.reduce((sum, f) => sum + f.total, 0);
      
      // Calcular cobrado del mes
      let cobrado = 0;
      try {
        const cobrosMesTendencia = await cobrosAPI.obtenerCobros({
          fechaInicio: inicioMesTendencia,
          fechaFin: finMesTendencia
        });
        cobrado = cobrosMesTendencia.reduce((sum, c) => sum + c.monto, 0);
      } catch (error) {
        // Si falla, usar facturas pagadas como aproximación
        const facturasPagadas = facturasMesTendencia.filter(f => f.estado === 'pagada');
        cobrado = facturasPagadas.reduce((sum, f) => sum + f.total, 0);
      }
      
      tendenciaMensual.push({
        mes: nombresMeses[fecha.getMonth()],
        facturado,
        cobrado
      });
    }

    setStats({
      ingresosMes,
      cobradoMes,
      pendienteCobro,
      proximosVencimientos,
      tendenciaMensual
    });
  };

  const formatearMoneda = (valor: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(valor);
  };

  const formatearFecha = (fecha: Date) => {
    return fecha.toLocaleDateString('es-ES', { 
      day: '2-digit', 
      month: 'short'
    });
  };

  if (loading) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">Cargando estadísticas...</div>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Métricas principales */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Ingresos del mes */}
        <Card className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-700 mb-1">Facturado este Mes</p>
              <p className="text-2xl font-bold text-blue-900">
                {formatearMoneda(stats.ingresosMes)}
              </p>
              <div className="flex items-center mt-2 text-sm text-blue-600">
                <TrendingUp className="w-4 h-4 mr-1" />
                <span>Ingresos totales</span>
              </div>
            </div>
            <div className="p-3 bg-blue-200 rounded-full">
              <DollarSign className="w-6 h-6 text-blue-700" />
            </div>
          </div>
        </Card>

        {/* Cobrado del mes */}
        <Card className="p-6 bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-700 mb-1">Cobrado este Mes</p>
              <p className="text-2xl font-bold text-green-900">
                {formatearMoneda(stats.cobradoMes)}
              </p>
              <div className="flex items-center mt-2 text-sm text-green-600">
                <ArrowUpCircle className="w-4 h-4 mr-1" />
                <span>Pagos recibidos</span>
              </div>
            </div>
            <div className="p-3 bg-green-200 rounded-full">
              <CheckCircle className="w-6 h-6 text-green-700" />
            </div>
          </div>
        </Card>

        {/* Pendiente de cobro */}
        <Card className="p-6 bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-orange-700 mb-1">Pendiente de Cobro</p>
              <p className="text-2xl font-bold text-orange-900">
                {formatearMoneda(stats.pendienteCobro)}
              </p>
              <div className="flex items-center mt-2 text-sm text-orange-600">
                <Clock className="w-4 h-4 mr-1" />
                <span>Por cobrar</span>
              </div>
            </div>
            <div className="p-3 bg-orange-200 rounded-full">
              <Clock className="w-6 h-6 text-orange-700" />
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gráfico de tendencia mensual */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Tendencia Mensual
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={stats.tendenciaMensual}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis 
                dataKey="mes" 
                stroke="#6b7280"
                style={{ fontSize: '12px' }}
              />
              <YAxis 
                stroke="#6b7280"
                style={{ fontSize: '12px' }}
                tickFormatter={(value) => {
                  if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
                  if (value >= 1000) return `${(value / 1000).toFixed(0)}K`;
                  return value.toString();
                }}
              />
              <Tooltip
                formatter={(value: number) => formatearMoneda(value)}
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  padding: '8px'
                }}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="facturado" 
                stroke="#3b82f6" 
                strokeWidth={2}
                name="Facturado"
                dot={{ fill: '#3b82f6', r: 4 }}
              />
              <Line 
                type="monotone" 
                dataKey="cobrado" 
                stroke="#10b981" 
                strokeWidth={2}
                name="Cobrado"
                dot={{ fill: '#10b981', r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        {/* Próximos vencimientos */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Próximos Vencimientos
            </h3>
            <Calendar className="w-5 h-5 text-gray-400" />
          </div>
          {stats.proximosVencimientos.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Calendar className="w-12 h-12 mx-auto mb-2 text-gray-300" />
              <p>No hay vencimientos próximos</p>
            </div>
          ) : (
            <div className="space-y-3">
              {stats.proximosVencimientos.map((factura) => {
                const diasRestantes = Math.ceil(
                  (new Date(factura.fechaVencimiento).getTime() - new Date().getTime()) / 
                  (1000 * 60 * 60 * 24)
                );
                const esHoy = diasRestantes === 0;
                const esUrgente = diasRestantes <= 2;

                return (
                  <div
                    key={factura.id}
                    className={`p-4 rounded-lg border ${
                      esUrgente
                        ? 'bg-red-50 border-red-200'
                        : 'bg-gray-50 border-gray-200'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-gray-900">
                            {factura.numeroFactura}
                          </span>
                          {esUrgente && (
                            <span className="px-2 py-0.5 text-xs font-medium bg-red-100 text-red-700 rounded">
                              Urgente
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600">
                          {factura.cliente.nombre}
                        </p>
                        <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                          <span>Vence: {formatearFecha(factura.fechaVencimiento)}</span>
                          <span>
                            {esHoy
                              ? 'Hoy'
                              : diasRestantes === 1
                              ? 'Mañana'
                              : `${diasRestantes} días`}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">
                          {formatearMoneda(factura.montoPendiente)}
                        </p>
                        <p className="text-xs text-gray-500">Pendiente</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </Card>
      </div>

      {/* Gráfico de barras comparativo */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Comparativo Facturado vs Cobrado
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={stats.tendenciaMensual}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis 
              dataKey="mes" 
              stroke="#6b7280"
              style={{ fontSize: '12px' }}
            />
            <YAxis 
              stroke="#6b7280"
              style={{ fontSize: '12px' }}
              tickFormatter={(value) => {
                if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
                if (value >= 1000) return `${(value / 1000).toFixed(0)}K`;
                return value.toString();
              }}
            />
            <Tooltip
              formatter={(value: number) => formatearMoneda(value)}
              contentStyle={{
                backgroundColor: '#fff',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                padding: '8px'
              }}
            />
            <Legend />
            <Bar 
              dataKey="facturado" 
              fill="#3b82f6" 
              name="Facturado"
              radius={[8, 8, 0, 0]}
            />
            <Bar 
              dataKey="cobrado" 
              fill="#10b981" 
              name="Cobrado"
              radius={[8, 8, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
};

