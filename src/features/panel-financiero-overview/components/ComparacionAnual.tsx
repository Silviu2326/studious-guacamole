import React from 'react';
import { Card } from '../../../components/componentsreutilizables';
import { TrendingUp, TrendingDown, Loader2, Calendar } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { ingresosApi } from '../api';
import { ComparacionAnual as ComparacionAnualType } from '../types';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export const ComparacionAnual: React.FC = () => {
  const { user } = useAuth();
  const [comparacion, setComparacion] = React.useState<ComparacionAnualType | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const cargarComparacion = async () => {
      try {
        setLoading(true);
        const data = await ingresosApi.obtenerComparacionAnual(
          user?.role || 'entrenador',
          user?.id
        );
        setComparacion(data);
      } catch (error) {
        console.error('Error cargando comparación anual:', error);
      } finally {
        setLoading(false);
      }
    };

    cargarComparacion();
  }, [user?.role, user?.id]);

  // Preparar datos para el gráfico
  const chartData = comparacion?.datos.map(item => ({
    mes: item.mesCorto,
    [`${comparacion.añoActual}`]: item.añoActual,
    [`${comparacion.añoAnterior}`]: item.añoAnterior,
    diferencia: item.diferencia,
    diferenciaPorcentaje: item.diferenciaPorcentaje
  })) || [];

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length && comparacion) {
      const data = payload[0].payload;
      return (
        <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-4">
          <p className="font-semibold mb-3 text-gray-900">{data.mes}</p>
          <div className="space-y-2">
            <div className="flex items-center justify-between gap-4">
              <span className="text-sm text-gray-600">Año {comparacion.añoActual}:</span>
              <span className="text-sm font-semibold text-blue-600">
                €{data[comparacion.añoActual]?.toLocaleString('es-ES') || 0}
              </span>
            </div>
            <div className="flex items-center justify-between gap-4">
              <span className="text-sm text-gray-600">Año {comparacion.añoAnterior}:</span>
              <span className="text-sm font-semibold text-gray-600">
                €{data[comparacion.añoAnterior]?.toLocaleString('es-ES') || 0}
              </span>
            </div>
            <div className="pt-2 border-t border-gray-200">
              <div className="flex items-center justify-between gap-4">
                <span className="text-sm text-gray-600">Diferencia:</span>
                <span className={`text-sm font-semibold ${
                  data.diferencia >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {data.diferencia >= 0 ? '+' : ''}€{data.diferencia?.toLocaleString('es-ES') || 0}
                </span>
              </div>
              <div className="flex items-center justify-between gap-4 mt-1">
                <span className="text-sm text-gray-600">Variación:</span>
                <span className={`text-sm font-semibold ${
                  data.diferenciaPorcentaje >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {data.diferenciaPorcentaje >= 0 ? '+' : ''}{data.diferenciaPorcentaje?.toFixed(1) || 0}%
                </span>
              </div>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Resumen de comparación */}
      {comparacion && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-white shadow-sm">
            <div className="p-4">
              <p className="text-sm font-medium text-gray-600 mb-1">Año {comparacion.añoActual}</p>
              <p className="text-2xl font-bold text-gray-900">
                €{comparacion.datos.reduce((sum, d) => sum + d.añoActual, 0).toLocaleString('es-ES')}
              </p>
            </div>
          </Card>
          <Card className="bg-white shadow-sm">
            <div className="p-4">
              <p className="text-sm font-medium text-gray-600 mb-1">Año {comparacion.añoAnterior}</p>
              <p className="text-2xl font-bold text-gray-900">
                €{comparacion.datos.reduce((sum, d) => sum + d.añoAnterior, 0).toLocaleString('es-ES')}
              </p>
            </div>
          </Card>
          <Card className={`bg-white shadow-sm ${
            comparacion.crecimientoTotal >= 0 ? 'ring-2 ring-green-200' : 'ring-2 ring-red-200'
          }`}>
            <div className="p-4">
              <div className="flex items-center gap-2 mb-1">
                {comparacion.crecimientoTotal >= 0 ? (
                  <TrendingUp className="w-5 h-5 text-green-600" />
                ) : (
                  <TrendingDown className="w-5 h-5 text-red-600" />
                )}
                <p className="text-sm font-medium text-gray-600">Crecimiento</p>
              </div>
              <p className={`text-2xl font-bold ${
                comparacion.crecimientoTotal >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {comparacion.crecimientoTotal >= 0 ? '+' : ''}€{comparacion.crecimientoTotal.toLocaleString('es-ES')}
              </p>
              <p className={`text-sm mt-1 ${
                comparacion.crecimientoPorcentaje >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {comparacion.crecimientoPorcentaje >= 0 ? '+' : ''}{comparacion.crecimientoPorcentaje.toFixed(1)}%
              </p>
            </div>
          </Card>
        </div>
      )}

      {/* Gráfico de comparación */}
      <Card className="bg-white shadow-sm">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
              <Calendar className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                Comparación Anual: {comparacion?.añoActual} vs {comparacion?.añoAnterior}
              </h2>
              <p className="text-sm text-gray-600">
                Compara tus ingresos mes a mes entre el año actual y el año anterior
              </p>
            </div>
          </div>
          
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            </div>
          ) : chartData.length > 0 && comparacion ? (
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis 
                  dataKey="mes" 
                  tick={{ fill: '#64748B', fontSize: 12 }}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis 
                  tick={{ fill: '#64748B', fontSize: 12 }}
                  tickFormatter={(value) => `€${(value / 1000).toFixed(0)}k`}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend 
                  wrapperStyle={{ paddingTop: '20px' }}
                  iconType="line"
                />
                <Line
                  type="monotone"
                  dataKey={comparacion.añoAnterior.toString()}
                  stroke="#94A3B8"
                  strokeWidth={2}
                  name={`Año ${comparacion.añoAnterior}`}
                  dot={{ fill: '#94A3B8', r: 4 }}
                  activeDot={{ r: 6 }}
                />
                <Line
                  type="monotone"
                  dataKey={comparacion.añoActual.toString()}
                  stroke="#3B82F6"
                  strokeWidth={3}
                  name={`Año ${comparacion.añoActual}`}
                  dot={{ fill: '#3B82F6', r: 5 }}
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="text-center py-8">
              <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No hay datos de comparación disponibles</p>
            </div>
          )}
        </div>
      </Card>

      {/* Tabla de comparación detallada */}
      {comparacion && (
        <Card className="bg-white shadow-sm">
          <div className="p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Comparación Detallada por Mes</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Mes</th>
                    <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">
                      Año {comparacion.añoAnterior}
                    </th>
                    <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">
                      Año {comparacion.añoActual}
                    </th>
                    <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">Diferencia</th>
                    <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">Variación %</th>
                  </tr>
                </thead>
                <tbody>
                  {comparacion.datos.map((item, index) => (
                    <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4 text-sm text-gray-900">{item.mes}</td>
                      <td className="py-3 px-4 text-sm text-right text-gray-600">
                        €{item.añoAnterior.toLocaleString('es-ES')}
                      </td>
                      <td className="py-3 px-4 text-sm text-right font-semibold text-gray-900">
                        €{item.añoActual.toLocaleString('es-ES')}
                      </td>
                      <td className={`py-3 px-4 text-sm text-right font-medium ${
                        item.diferencia >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {item.diferencia >= 0 ? '+' : ''}€{item.diferencia.toLocaleString('es-ES')}
                      </td>
                      <td className={`py-3 px-4 text-sm text-right font-medium ${
                        item.diferenciaPorcentaje >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {item.diferenciaPorcentaje >= 0 ? '+' : ''}{item.diferenciaPorcentaje.toFixed(1)}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

