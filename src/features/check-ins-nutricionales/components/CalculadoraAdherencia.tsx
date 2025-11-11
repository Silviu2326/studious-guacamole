import React, { useEffect, useState } from 'react';
import { Card, MetricCards } from '../../../components/componentsreutilizables';
import { Target, TrendingUp, CheckCircle, AlertCircle } from 'lucide-react';
import { getAdherenciaNutricional, AdherenciaNutricional } from '../api/adherencia';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface CalculadoraAdherenciaProps {
  clienteId: string;
  periodo?: 'dia' | 'semana' | 'mes';
}

export const CalculadoraAdherencia: React.FC<CalculadoraAdherenciaProps> = ({
  clienteId,
  periodo = 'semana',
}) => {
  const [adherencia, setAdherencia] = useState<AdherenciaNutricional | null>(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    cargarAdherencia();
  }, [clienteId, periodo]);

  const cargarAdherencia = async () => {
    setCargando(true);
    try {
      const data = await getAdherenciaNutricional(clienteId, periodo);
      setAdherencia(data);
    } catch (error) {
      console.error('Error al cargar adherencia:', error);
    } finally {
      setCargando(false);
    }
  };

  const getColorAdherencia = (porcentaje: number) => {
    if (porcentaje >= 80) return 'success';
    if (porcentaje >= 60) return 'warning';
    return 'error';
  };

  const getIconAdherencia = (porcentaje: number) => {
    if (porcentaje >= 80) return <CheckCircle className="w-5 h-5" />;
    if (porcentaje >= 60) return <AlertCircle className="w-5 h-5" />;
    return <AlertCircle className="w-5 h-5" />;
  };

  if (cargando) {
    return (
      <Card className="p-8 text-center bg-white shadow-sm">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/3 mx-auto" />
          <div className="h-32 bg-gray-200 rounded" />
        </div>
      </Card>
    );
  }

  if (!adherencia) {
    return (
      <Card className="p-8 text-center bg-white shadow-sm">
        <Target size={48} className="mx-auto text-gray-400 mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Sin datos disponibles</h3>
        <p className="text-gray-600 mb-4">No hay datos de adherencia disponibles</p>
      </Card>
    );
  }

  const metricas = [
    {
      id: 'adherencia',
      title: 'Adherencia Nutricional',
      value: `${adherencia.porcentajeAdherencia.toFixed(0)}%`,
      icon: getIconAdherencia(adherencia.porcentajeAdherencia),
      color: getColorAdherencia(adherencia.porcentajeAdherencia) as any,
    },
    {
      id: 'checkins',
      title: 'Check-ins Completados',
      value: `${adherencia.checkInsCompletados}/${adherencia.checkInsTotales}`,
      icon: <CheckCircle className="w-5 h-5" />,
      color: 'info' as const,
    },
    {
      id: 'macros',
      title: 'Cumplimiento Macros',
      value: `${adherencia.cumplimientoMacros.toFixed(0)}%`,
      icon: <TrendingUp className="w-5 h-5" />,
      color: getColorAdherencia(adherencia.cumplimientoMacros) as any,
    },
    {
      id: 'fotos',
      title: 'Fotos Subidas',
      value: adherencia.fotosSubidas.toString(),
      icon: <CheckCircle className="w-5 h-5" />,
      color: 'info' as const,
    },
  ];

  return (
    <div className="space-y-6">
      <Card className="p-4 bg-white shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-xl ring-1 ring-blue-200/70">
              <Target size={20} className="text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Adherencia Nutricional
              </h3>
              <p className="text-xs text-gray-500">
                Período: {periodo === 'dia' ? 'Día' : periodo === 'semana' ? 'Semana' : 'Mes'}
              </p>
            </div>
          </div>
        </div>
      </Card>

      <MetricCards data={metricas} columns={4} />

      {/* Gráfico de Comparación de Macronutrientes */}
      {adherencia.macronutrientes && adherencia.macronutrientes.length > 0 && (
        <Card className="p-4 bg-white shadow-sm">
          <div className="space-y-4">
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">
                Comparación de Macronutrientes
              </h4>
              <p className="text-sm text-gray-600">
                Consumo real vs objetivos diarios de proteínas, carbohidratos y grasas
              </p>
            </div>
            
            <ResponsiveContainer width="100%" height={350}>
              <BarChart
                data={adherencia.macronutrientes.map(macro => ({
                  nombre: macro.nombre.charAt(0).toUpperCase() + macro.nombre.slice(1),
                  'Consumo Real (g)': macro.consumoReal,
                  'Objetivo Diario (g)': macro.objetivoDiario,
                  porcentaje: macro.porcentajeCumplimiento,
                }))}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis 
                  dataKey="nombre" 
                  tick={{ fill: '#64748B', fontSize: 12 }}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis 
                  tick={{ fill: '#64748B', fontSize: 12 }}
                  label={{ value: 'Gramos (g)', angle: -90, position: 'insideLeft', style: { fill: '#64748B' } }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #E2E8F0',
                    borderRadius: '8px',
                    padding: '12px'
                  }}
                  formatter={(value: number, name: string) => {
                    if (name === 'Consumo Real (g)' || name === 'Objetivo Diario (g)') {
                      return [`${value.toFixed(0)} g`, name];
                    }
                    return [value, name];
                  }}
                />
                <Legend 
                  wrapperStyle={{ paddingTop: '20px' }}
                  formatter={(value) => {
                    if (value === 'Consumo Real (g)') return 'Consumo Real';
                    if (value === 'Objetivo Diario (g)') return 'Objetivo Diario';
                    return value;
                  }}
                />
                <Bar 
                  dataKey="Consumo Real (g)" 
                  fill="#3B82F6" 
                  radius={[8, 8, 0, 0]}
                  name="Consumo Real"
                />
                <Bar 
                  dataKey="Objetivo Diario (g)" 
                  fill="#10B981" 
                  radius={[8, 8, 0, 0]}
                  name="Objetivo Diario"
                />
              </BarChart>
            </ResponsiveContainer>

            {/* Resumen de cumplimiento por macronutriente */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              {adherencia.macronutrientes.map((macro) => {
                const necesitaAjuste = macro.porcentajeCumplimiento < 80;
                return (
                  <div
                    key={macro.nombre}
                    className={`p-4 rounded-lg border-2 ${
                      necesitaAjuste
                        ? 'border-orange-200 bg-orange-50'
                        : 'border-green-200 bg-green-50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-semibold text-gray-900 capitalize">
                        {macro.nombre}
                      </span>
                      {necesitaAjuste && (
                        <AlertCircle className="w-4 h-4 text-orange-600" />
                      )}
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs text-gray-600">
                        <span>Real:</span>
                        <span className="font-medium">{macro.consumoReal}g</span>
                      </div>
                      <div className="flex justify-between text-xs text-gray-600">
                        <span>Objetivo:</span>
                        <span className="font-medium">{macro.objetivoDiario}g</span>
                      </div>
                      <div className="flex justify-between items-center mt-2 pt-2 border-t border-gray-200">
                        <span className="text-xs font-medium text-gray-700">Cumplimiento:</span>
                        <span
                          className={`text-sm font-bold ${
                            necesitaAjuste ? 'text-orange-600' : 'text-green-600'
                          }`}
                        >
                          {macro.porcentajeCumplimiento.toFixed(1)}%
                        </span>
                      </div>
                      {necesitaAjuste && (
                        <p className="text-xs text-orange-700 mt-2 font-medium">
                          ⚠️ Necesita ajustes
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </Card>
      )}

      <Card className="p-4 bg-white shadow-sm">
        <div className="space-y-4">
          <h4 className="text-lg font-semibold text-gray-900">
            Detalles de Cumplimiento
          </h4>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
              <span className="text-sm text-gray-900">
                Horarios
              </span>
              <span className="text-sm font-semibold text-gray-900">
                {adherencia.cumplimientoHorarios.toFixed(0)}%
              </span>
            </div>
            
            <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
              <span className="text-sm text-gray-900">
                Peso Registrado
              </span>
              <span className={`text-sm font-semibold ${adherencia.pesoRegistrado ? 'text-green-600' : 'text-red-600'}`}>
                {adherencia.pesoRegistrado ? 'Sí' : 'No'}
              </span>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

