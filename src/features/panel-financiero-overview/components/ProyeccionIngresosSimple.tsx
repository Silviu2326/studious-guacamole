import React from 'react';
import { Card, MetricCards, MetricCardData } from '../../../components/componentsreutilizables';
import { DollarSign, Users, TrendingUp, Calendar, Loader2, Calculator } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { proyeccionIngresosSimpleApi } from '../api';
import { ProyeccionIngresosSimple } from '../types';

export const ProyeccionIngresosSimple: React.FC = () => {
  const { user } = useAuth();
  const [proyeccion, setProyeccion] = React.useState<ProyeccionIngresosSimple | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const cargarProyeccion = async () => {
      try {
        setLoading(true);
        const data = await proyeccionIngresosSimpleApi.obtenerProyeccionIngresosSimple(user?.id);
        setProyeccion(data);
      } catch (error) {
        console.error('Error cargando proyección de ingresos:', error);
      } finally {
        setLoading(false);
      }
    };

    cargarProyeccion();
  }, [user?.id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!proyeccion) {
    return (
      <div className="text-center py-12">
        <Calculator size={48} className="mx-auto text-gray-400 mb-4" />
        <p className="text-gray-600">No se pudo calcular la proyección de ingresos</p>
      </div>
    );
  }

  const metricas: MetricCardData[] = [
    {
      title: 'Clientes Activos',
      value: proyeccion.numeroClientesActivos.toString(),
      icon: Users,
      trend: null,
      description: 'Total de clientes con suscripciones activas',
    },
    {
      title: 'Precio Medio',
      value: `€${proyeccion.precioMedio.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      icon: DollarSign,
      trend: null,
      description: 'Precio promedio por cliente',
    },
    {
      title: 'Ingresos Esperados',
      value: `€${proyeccion.ingresosEsperados.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      icon: TrendingUp,
      trend: 'up' as const,
      description: `Proyección para ${proyeccion.mesProyeccion}`,
    },
    {
      title: 'Frecuencia Más Común',
      value: proyeccion.frecuenciaPago.charAt(0).toUpperCase() + proyeccion.frecuenciaPago.slice(1),
      icon: Calendar,
      trend: null,
      description: 'Frecuencia de pago predominante',
    },
  ];

  const getFrecuenciaLabel = (freq: string) => {
    const labels: Record<string, string> = {
      mensual: 'Mensual',
      trimestral: 'Trimestral',
      semestral: 'Semestral',
      anual: 'Anual',
    };
    return labels[freq] || freq;
  };

  return (
    <div className="space-y-6">
      {/* Métricas principales */}
      <MetricCards metrics={metricas} />

      {/* Card principal con información detallada */}
      <Card className="bg-white shadow-sm">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-green-600 to-emerald-600 rounded-lg flex items-center justify-center">
              <Calculator className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                Proyección de Ingresos Simple
              </h2>
              <p className="text-sm text-gray-600">
                Cálculo basado en clientes activos, precio medio y frecuencia de pago
              </p>
            </div>
          </div>

          {/* Información de la proyección */}
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 mb-6 border border-green-100">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Mes Proyectado</p>
                <p className="text-2xl font-bold text-gray-900">{proyeccion.mesProyeccion}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-gray-600 mb-1">Ingresos Esperados</p>
                <p className="text-3xl font-bold text-green-600">
                  €{proyeccion.ingresosEsperados.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
              </div>
            </div>
            <div className="pt-4 border-t border-green-200">
              <p className="text-xs text-gray-500">
                Calculado el {new Date(proyeccion.fechaCalculo).toLocaleDateString('es-ES', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            </div>
          </div>

          {/* Desglose por frecuencia */}
          {proyeccion.desglosePorFrecuencia.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Desglose por Frecuencia de Pago
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {proyeccion.desglosePorFrecuencia.map((desglose, index) => (
                  <div
                    key={index}
                    className="bg-gray-50 rounded-lg p-4 border border-gray-200"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-600">
                        {getFrecuenciaLabel(desglose.frecuencia)}
                      </span>
                      <span className="text-xs text-gray-500">
                        {desglose.numeroClientes} {desglose.numeroClientes === 1 ? 'cliente' : 'clientes'}
                      </span>
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Precio promedio:</span>
                        <span className="font-medium text-gray-900">
                          €{desglose.precioPromedio.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Ingresos esperados:</span>
                        <span className="font-bold text-green-600">
                          €{desglose.ingresosEsperados.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Información adicional */}
          <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
            <p className="text-sm text-blue-800">
              <strong>Nota:</strong> Esta proyección es una estimación basada en los datos actuales de clientes activos y sus frecuencias de pago. 
              Los ingresos reales pueden variar según cancelaciones, nuevos clientes o cambios en las suscripciones.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};

