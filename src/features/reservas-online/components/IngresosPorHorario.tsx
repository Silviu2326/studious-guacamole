import React, { useState, useEffect } from 'react';
import { Card, Button, Input } from '../../../components/componentsreutilizables';
import { IngresosPorFranja } from '../types';
import { getIngresosPorHorario } from '../api/ingresos';
import { Clock, DollarSign, TrendingUp, BarChart3, Loader2, Calendar, Filter } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';

interface IngresosPorHorarioProps {
  entrenadorId?: string;
  role?: 'entrenador' | 'gimnasio';
}

const COLORS = ['#3B82F6', '#6366F1', '#8B5CF6', '#EC4899', '#F59E0B', '#10B981', '#14B8A6', '#06B6D4'];

export const IngresosPorHorario: React.FC<IngresosPorHorarioProps> = ({ entrenadorId, role = 'entrenador' }) => {
  const [ingresos, setIngresos] = useState<IngresosPorFranja[]>([]);
  const [loading, setLoading] = useState(true);
  const [periodo, setPeriodo] = useState<'mes' | 'trimestre' | 'año' | 'personalizado'>('mes');
  const [fechaInicio, setFechaInicio] = useState<string>(() => {
    const fecha = new Date();
    fecha.setMonth(fecha.getMonth() - 1);
    return fecha.toISOString().split('T')[0];
  });
  const [fechaFin, setFechaFin] = useState<string>(() => {
    return new Date().toISOString().split('T')[0];
  });
  const [filtroEntrenadorId, setFiltroEntrenadorId] = useState<string>(entrenadorId || '');

  useEffect(() => {
    cargarIngresos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [periodo, entrenadorId]);

  const cargarIngresos = async () => {
    setLoading(true);
    try {
      let fechaInicioCalc = new Date();
      let fechaFinCalc = new Date();
      
      if (periodo === 'personalizado') {
        fechaInicioCalc = new Date(fechaInicio);
        fechaFinCalc = new Date(fechaFin);
        fechaFinCalc.setHours(23, 59, 59, 999);
      } else {
        switch (periodo) {
          case 'mes':
            fechaInicioCalc.setMonth(fechaInicioCalc.getMonth() - 1);
            break;
          case 'trimestre':
            fechaInicioCalc.setMonth(fechaInicioCalc.getMonth() - 3);
            break;
          case 'año':
            fechaInicioCalc.setFullYear(fechaInicioCalc.getFullYear() - 1);
            break;
        }
      }
      
      const datos = await getIngresosPorHorario({
        fechaInicio: fechaInicioCalc,
        fechaFin: fechaFinCalc,
        entrenadorId: filtroEntrenadorId || entrenadorId || undefined,
      });
      setIngresos(datos);
    } catch (error) {
      console.error('Error cargando ingresos por horario:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card className="p-8 text-center bg-white shadow-sm">
        <Loader2 size={48} className="mx-auto text-blue-500 animate-spin mb-4" />
        <p className="text-gray-600">Cargando ingresos por horario...</p>
      </Card>
    );
  }

  // Preparar datos para el gráfico
  const datosGrafico = ingresos.map((ingreso, index) => ({
    ...ingreso,
    horaFormato: ingreso.hora,
    ingresosFormato: `€${ingreso.ingresos.toLocaleString()}`,
  }));

  // Calcular totales
  const totalIngresos = ingresos.reduce((sum, ingreso) => sum + ingreso.ingresos, 0);
  const totalReservas = ingresos.reduce((sum, ingreso) => sum + ingreso.cantidadReservas, 0);
  const promedioGeneral = totalReservas > 0 ? totalIngresos / totalReservas : 0;

  // Obtener los top 5 horarios
  const topHorarios = ingresos.slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Header con selector de período y filtros */}
      <Card className="bg-white shadow-sm">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Clock className="w-6 h-6 text-blue-600" />
              <h2 className="text-2xl font-bold text-gray-900">
                Ingresos por Horario
              </h2>
            </div>
            <div className="flex items-center gap-2">
              <select
                value={periodo}
                onChange={(e) => setPeriodo(e.target.value as 'mes' | 'trimestre' | 'año' | 'personalizado')}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="mes">Último mes</option>
                <option value="trimestre">Último trimestre</option>
                <option value="año">Último año</option>
                <option value="personalizado">Rango personalizado</option>
              </select>
            </div>
          </div>
          <p className="text-gray-600 mb-6">
            Analiza qué horarios generan más ingresos para optimizar tu disponibilidad en las franjas más demandadas.
          </p>

          {/* Filtros adicionales */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            {periodo === 'personalizado' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fecha Inicio
                  </label>
                  <Input
                    type="date"
                    value={fechaInicio}
                    onChange={(e) => setFechaInicio(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fecha Fin
                  </label>
                  <Input
                    type="date"
                    value={fechaFin}
                    onChange={(e) => setFechaFin(e.target.value)}
                  />
                </div>
              </>
            )}
            {role === 'gimnasio' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Entrenador (Opcional)
                </label>
                <Input
                  type="text"
                  placeholder="ID del entrenador"
                  value={filtroEntrenadorId}
                  onChange={(e) => setFiltroEntrenadorId(e.target.value)}
                />
              </div>
            )}
            <div className="flex items-end">
              <Button
                variant="primary"
                onClick={cargarIngresos}
                className="w-full"
              >
                <Filter className="w-4 h-4 mr-2" />
                Actualizar
              </Button>
            </div>
          </div>

          {/* Métricas principales */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="w-5 h-5 text-blue-600" />
                <span className="text-sm font-medium text-gray-600">Total Ingresos</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">
                €{totalIngresos.toLocaleString()}
              </p>
            </div>
            <div className="bg-green-50 rounded-lg p-4 border border-green-100">
              <div className="flex items-center gap-2 mb-2">
                <BarChart3 className="w-5 h-5 text-green-600" />
                <span className="text-sm font-medium text-gray-600">Total Reservas</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">
                {totalReservas}
              </p>
            </div>
            <div className="bg-purple-50 rounded-lg p-4 border border-purple-100">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-5 h-5 text-purple-600" />
                <span className="text-sm font-medium text-gray-600">Promedio por Reserva</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">
                €{promedioGeneral.toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Gráfico de barras */}
      {datosGrafico.length > 0 && (
        <Card className="bg-white shadow-sm">
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Ingresos por Franja Horaria
            </h3>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={datosGrafico}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="horaFormato" 
                  stroke="#6b7280"
                  fontSize={12}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis 
                  stroke="#6b7280"
                  fontSize={12}
                  tickFormatter={(value) => `€${value.toLocaleString()}`}
                />
                <Tooltip
                  formatter={(value: number, name: string) => {
                    if (name === 'ingresos') {
                      return [`€${value.toLocaleString()}`, 'Ingresos'];
                    }
                    return [value, name];
                  }}
                  labelFormatter={(label) => `Horario: ${label}`}
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                  }}
                />
                <Legend />
                <Bar dataKey="ingresos" name="Ingresos" fill="#3B82F6">
                  {datosGrafico.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      )}

      {/* Top 5 horarios más rentables */}
      {topHorarios.length > 0 && (
        <Card className="bg-white shadow-sm">
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-blue-600" />
              Top 5 Horarios Más Rentables
            </h3>
            <div className="space-y-3">
              {topHorarios.map((ingreso, index) => (
                <div
                  key={ingreso.hora}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 text-blue-600 font-bold">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">
                        {ingreso.franja}
                      </p>
                      <p className="text-sm text-gray-600">
                        {ingreso.cantidadReservas} reserva{ingreso.cantidadReservas !== 1 ? 's' : ''}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-lg text-gray-900">
                      €{ingreso.ingresos.toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-600">
                      €{ingreso.promedioPorReserva.toFixed(2)} por reserva
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      )}

      {/* Tabla completa de todos los horarios */}
      {ingresos.length > 0 && (
        <Card className="bg-white shadow-sm">
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Desglose Completo por Horario
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Horario</th>
                    <th className="text-right py-3 px-4 font-semibold text-gray-700">Reservas</th>
                    <th className="text-right py-3 px-4 font-semibold text-gray-700">Ingresos Totales</th>
                    <th className="text-right py-3 px-4 font-semibold text-gray-700">Promedio por Reserva</th>
                  </tr>
                </thead>
                <tbody>
                  {ingresos.map((ingreso) => (
                    <tr
                      key={ingreso.hora}
                      className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                    >
                      <td className="py-3 px-4 text-gray-900 font-medium">
                        {ingreso.franja}
                      </td>
                      <td className="py-3 px-4 text-right text-gray-700">
                        {ingreso.cantidadReservas}
                      </td>
                      <td className="py-3 px-4 text-right text-gray-900 font-semibold">
                        €{ingreso.ingresos.toLocaleString()}
                      </td>
                      <td className="py-3 px-4 text-right text-gray-700">
                        €{ingreso.promedioPorReserva.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </Card>
      )}

      {ingresos.length === 0 && !loading && (
        <Card className="p-8 text-center bg-white shadow-sm">
          <Calendar className="w-12 h-12 mx-auto text-gray-400 mb-4" />
          <p className="text-gray-600">
            No hay datos de ingresos para el período seleccionado.
          </p>
        </Card>
      )}
    </div>
  );
};

