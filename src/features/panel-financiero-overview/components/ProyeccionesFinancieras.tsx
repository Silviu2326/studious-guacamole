import React from 'react';
import { Card, Table, TableColumn } from '../../../components/componentsreutilizables';
import { TrendingUp, BarChart3, Loader2 } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { proyeccionesApi } from '../api';
import { ProyeccionFinanciera } from '../types';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, AreaChart } from 'recharts';

export const ProyeccionesFinancieras: React.FC = () => {
  const { user } = useAuth();
  const [proyecciones, setProyecciones] = React.useState<ProyeccionFinanciera[]>([]);
  const [loading, setLoading] = React.useState(true);
  const isEntrenador = user?.role === 'entrenador';

  React.useEffect(() => {
    const cargarProyecciones = async () => {
      try {
        setLoading(true);
        const data = await proyeccionesApi.obtenerProyecciones(user?.role || 'entrenador', 6);
        setProyecciones(data);
      } catch (error) {
        console.error('Error cargando proyecciones:', error);
      } finally {
        setLoading(false);
      }
    };

    cargarProyecciones();
  }, [user?.role]);

  const columns: TableColumn<ProyeccionFinanciera>[] = [
    { key: 'periodo', label: 'Período' },
    { 
      key: 'ingresos', 
      label: 'Ingresos Proyectados', 
      align: 'right', 
      render: (val) => `€${val.toLocaleString()}` 
    },
    { 
      key: 'gastos', 
      label: isEntrenador ? '-' : 'Gastos Proyectados', 
      align: 'right', 
      render: (val) => isEntrenador ? '-' : `€${val.toLocaleString()}`
    },
    { 
      key: 'beneficio', 
      label: isEntrenador ? 'Ingresos Netos' : 'Beneficio Neto', 
      align: 'right', 
      render: (val) => `€${val.toLocaleString()}`
    },
    { 
      key: 'confianza', 
      label: 'Confianza', 
      align: 'right', 
      render: (val) => `${val.toFixed(0)}%`
    }
  ];

  // Datos para el gráfico
  const chartData = proyecciones.map(proj => ({
    periodo: proj.periodo,
    ingresos: proj.ingresos,
    gastos: isEntrenador ? null : proj.gastos,
    beneficio: proj.beneficio
  }));

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-3">
          <p className="font-semibold mb-2 text-gray-900">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }} className="text-sm">
              {entry.name}: €{entry.value.toLocaleString('es-ES')}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Gráfico de proyecciones */}
      <Card className="bg-white shadow-sm">
        <div className="p-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">
              Proyecciones Financieras
            </h2>
          </div>
          <p className="text-gray-600 mb-6">
            Proyecciones basadas en datos históricos y tendencias actuales.
          </p>
          
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            </div>
          ) : proyecciones.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorIngresos" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorBeneficio" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                  </linearGradient>
                  {!isEntrenador && (
                    <linearGradient id="colorGastos" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#EF4444" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#EF4444" stopOpacity={0}/>
                    </linearGradient>
                  )}
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="periodo" stroke="#6b7280" />
                <YAxis 
                  stroke="#6b7280" 
                  tickFormatter={(value) => `€${(value / 1000).toFixed(0)}k`}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Area 
                  type="monotone" 
                  dataKey="ingresos" 
                  name="Ingresos Proyectados" 
                  stroke="#3B82F6" 
                  fillOpacity={1} 
                  fill="url(#colorIngresos)" 
                />
                {!isEntrenador && (
                  <Area 
                    type="monotone" 
                    dataKey="gastos" 
                    name="Gastos Proyectados" 
                    stroke="#EF4444" 
                    fillOpacity={1} 
                    fill="url(#colorGastos)" 
                  />
                )}
                <Area 
                  type="monotone" 
                  dataKey="beneficio" 
                  name={isEntrenador ? "Ingresos Netos" : "Beneficio Neto"} 
                  stroke="#10B981" 
                  fillOpacity={1} 
                  fill="url(#colorBeneficio)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="text-center py-12">
              <BarChart3 size={48} className="mx-auto text-gray-400 mb-4" />
              <p className="text-gray-600">No hay proyecciones disponibles</p>
            </div>
          )}
        </div>
      </Card>

      {/* Tabla detallada */}
      <Card className="bg-white shadow-sm">
        <div className="p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Detalles por Período
          </h3>
          <Table data={proyecciones} columns={columns} loading={loading} emptyMessage="No hay proyecciones disponibles" />
        </div>
      </Card>
    </div>
  );
};

