import React, { useState, useEffect } from 'react';
import { Card, Button, Input } from '../../../components/componentsreutilizables';
import { IngresosPorCliente as IngresosPorClienteData } from '../types';
import { getIngresosPorCliente } from '../api/ingresos';
import { Users, DollarSign, TrendingUp, BarChart3, Loader2, Calendar, Star, Award, Filter } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';

interface IngresosPorClienteProps {
  entrenadorId?: string;
  role?: 'entrenador' | 'gimnasio';
}

const COLORS = ['#3B82F6', '#6366F1', '#8B5CF6', '#EC4899', '#F59E0B', '#10B981', '#14B8A6', '#06B6D4'];

export const IngresosPorCliente: React.FC<IngresosPorClienteProps> = ({ entrenadorId, role = 'entrenador' }) => {
  const [ingresos, setIngresos] = useState<IngresosPorClienteData[]>([]);
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

      const datos = await getIngresosPorCliente({
        fechaInicio: fechaInicioCalc,
        fechaFin: fechaFinCalc,
        entrenadorId: filtroEntrenadorId || entrenadorId || undefined,
      });
      setIngresos(datos);
    } catch (error) {
      console.error('Error cargando ingresos por cliente:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card className="p-8 text-center bg-white shadow-sm">
        <Loader2 size={48} className="mx-auto text-blue-500 animate-spin mb-4" />
        <p className="text-gray-600">Cargando ingresos por cliente...</p>
      </Card>
    );
  }

  // Preparar datos para el gráfico de barras
  const datosGrafico = ingresos.slice(0, 10).map((ingreso) => ({
    ...ingreso,
    nombreCorto: ingreso.clienteNombre.length > 15
      ? ingreso.clienteNombre.substring(0, 15) + '...'
      : ingreso.clienteNombre,
    ingresosFormato: `€${ingreso.ingresosTotales.toLocaleString()}`,
  }));

  // Preparar datos para el gráfico de pastel (top 5)
  const datosPastel = ingresos.slice(0, 5).map((ingreso, index) => ({
    name: ingreso.clienteNombre,
    value: ingreso.ingresosTotales,
    color: COLORS[index % COLORS.length],
  }));

  // Calcular totales
  const totalIngresos = ingresos.reduce((sum, ingreso) => sum + ingreso.ingresosTotales, 0);
  const totalReservas = ingresos.reduce((sum, ingreso) => sum + ingreso.cantidadReservas, 0);
  const totalClientes = ingresos.length;
  const promedioPorCliente = totalClientes > 0 ? totalIngresos / totalClientes : 0;

  // Obtener los top 5 clientes
  const topClientes = ingresos.slice(0, 5);

  // Clientes VIP (top 20% de ingresos)
  const umbralVIP = totalIngresos * 0.2;
  const clientesVIP = ingresos.filter(ingreso => ingreso.ingresosTotales >= umbralVIP);

  // Formatear fecha
  const formatearFecha = (fecha?: Date) => {
    if (!fecha) return 'N/A';
    return new Date(fecha).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="space-y-6">
      {/* Header con selector de período */}
      <Card className="bg-white shadow-sm">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Users className="w-6 h-6 text-blue-600" />
              <h2 className="text-2xl font-bold text-gray-900">
                Ingresos por Cliente
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
            Identifica tus mejores clientes para darles atención especial y fidelizarlos.
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
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
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
                <Users className="w-5 h-5 text-green-600" />
                <span className="text-sm font-medium text-gray-600">Total Clientes</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">
                {totalClientes}
              </p>
            </div>
            <div className="bg-purple-50 rounded-lg p-4 border border-purple-100">
              <div className="flex items-center gap-2 mb-2">
                <BarChart3 className="w-5 h-5 text-purple-600" />
                <span className="text-sm font-medium text-gray-600">Promedio por Cliente</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">
                €{promedioPorCliente.toFixed(2)}
              </p>
            </div>
            <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-100">
              <div className="flex items-center gap-2 mb-2">
                <Star className="w-5 h-5 text-yellow-600" />
                <span className="text-sm font-medium text-gray-600">Clientes VIP</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">
                {clientesVIP.length}
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Gráfico de barras - Top 10 clientes */}
      {datosGrafico.length > 0 && (
        <Card className="bg-white shadow-sm">
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Top 10 Clientes por Ingresos
            </h3>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={datosGrafico} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis
                  type="number"
                  stroke="#6b7280"
                  fontSize={12}
                  tickFormatter={(value) => `€${value.toLocaleString()}`}
                />
                <YAxis
                  type="category"
                  dataKey="nombreCorto"
                  stroke="#6b7280"
                  fontSize={12}
                  width={150}
                />
                <Tooltip
                  formatter={(value: number) => [`€${value.toLocaleString()}`, 'Ingresos']}
                  labelFormatter={(label) => `Cliente: ${label}`}
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                  }}
                />
                <Legend />
                <Bar dataKey="ingresosTotales" name="Ingresos" fill="#3B82F6">
                  {datosGrafico.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      )}

      {/* Gráfico de pastel - Top 5 clientes */}
      {datosPastel.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="bg-white shadow-sm">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Distribución de Ingresos (Top 5)
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={datosPastel}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name.substring(0, 10)}... ${(percent * 100).toFixed(0)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {datosPastel.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: number) => `€${value.toLocaleString()}`}
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Top 5 clientes */}
          <Card className="bg-white shadow-sm">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Award className="w-5 h-5 text-yellow-600" />
                Top 5 Mejores Clientes
              </h3>
              <div className="space-y-3">
                {topClientes.map((cliente, index) => (
                  <div
                    key={cliente.clienteId}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-yellow-100 text-yellow-600 font-bold">
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 flex items-center gap-2">
                          {cliente.clienteNombre}
                          {clientesVIP.includes(cliente) && (
                            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                          )}
                        </p>
                        <p className="text-sm text-gray-600">
                          {cliente.cantidadReservas} reserva{cliente.cantidadReservas !== 1 ? 's' : ''} •
                          Última: {formatearFecha(cliente.ultimaReserva)}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-lg text-gray-900">
                        €{cliente.ingresosTotales.toLocaleString()}
                      </p>
                      <p className="text-sm text-gray-600">
                        €{cliente.promedioPorReserva.toFixed(2)} promedio
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Tabla completa de todos los clientes */}
      {ingresos.length > 0 && (
        <Card className="bg-white shadow-sm">
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Desglose Completo por Cliente
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Cliente</th>
                    <th className="text-right py-3 px-4 font-semibold text-gray-700">Reservas</th>
                    <th className="text-right py-3 px-4 font-semibold text-gray-700">Completadas</th>
                    <th className="text-right py-3 px-4 font-semibold text-gray-700">Canceladas</th>
                    <th className="text-right py-3 px-4 font-semibold text-gray-700">Ingresos Totales</th>
                    <th className="text-right py-3 px-4 font-semibold text-gray-700">Promedio</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Última Reserva</th>
                  </tr>
                </thead>
                <tbody>
                  {ingresos.map((cliente) => (
                    <tr
                      key={cliente.clienteId}
                      className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${clientesVIP.includes(cliente) ? 'bg-yellow-50/50' : ''
                        }`}
                    >
                      <td className="py-3 px-4 text-gray-900 font-medium flex items-center gap-2">
                        {cliente.clienteNombre}
                        {clientesVIP.includes(cliente) && (
                          <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                        )}
                      </td>
                      <td className="py-3 px-4 text-right text-gray-700">
                        {cliente.cantidadReservas}
                      </td>
                      <td className="py-3 px-4 text-right text-green-700 font-medium">
                        {cliente.reservasCompletadas}
                      </td>
                      <td className="py-3 px-4 text-right text-red-700 font-medium">
                        {cliente.reservasCanceladas}
                      </td>
                      <td className="py-3 px-4 text-right text-gray-900 font-semibold">
                        €{cliente.ingresosTotales.toLocaleString()}
                      </td>
                      <td className="py-3 px-4 text-right text-gray-700">
                        €{cliente.promedioPorReserva.toFixed(2)}
                      </td>
                      <td className="py-3 px-4 text-left text-gray-600 text-sm">
                        {formatearFecha(cliente.ultimaReserva)}
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
          <Users className="w-12 h-12 mx-auto text-gray-400 mb-4" />
          <p className="text-gray-600">
            No hay datos de ingresos por cliente para el período seleccionado.
          </p>
        </Card>
      )}
    </div>
  );
};


