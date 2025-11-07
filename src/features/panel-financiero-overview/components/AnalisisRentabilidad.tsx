import React from 'react';
import { Card, MetricCards, MetricCardData, Badge } from '../../../components/componentsreutilizables';
import { TrendingUp, TrendingDown, DollarSign, Percent, Loader2, Package } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { rentabilidadApi } from '../api';
import { AnalisisRentabilidad as AnalisisRentabilidadType } from '../types';

export const AnalisisRentabilidad: React.FC = () => {
  const { user } = useAuth();
  const [rentabilidad, setRentabilidad] = React.useState<AnalisisRentabilidadType | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const cargarRentabilidad = async () => {
      try {
        setLoading(true);
        if (user?.role === 'gimnasio') {
          const data = await rentabilidadApi.obtenerAnalisisRentabilidad();
          setRentabilidad(data);
        }
      } catch (error) {
        console.error('Error cargando rentabilidad:', error);
      } finally {
        setLoading(false);
      }
    };

    cargarRentabilidad();
  }, [user?.role]);

  if (user?.role === 'entrenador') {
    return (
      <Card className="bg-white shadow-sm">
        <div className="p-8 text-center">
          <p className="text-gray-600">
            El análisis de rentabilidad solo está disponible para gimnasios.
          </p>
        </div>
      </Card>
    );
  }

  const getEstadoBadge = (estado: string) => {
    const variants = {
      saludable: 'green' as const,
      advertencia: 'yellow' as const,
      critico: 'red' as const
    };
    return <Badge variant={variants[estado as keyof typeof variants] || 'gray'}>{estado}</Badge>;
  };

  const metrics: MetricCardData[] = rentabilidad ? [
    {
      id: 'ingresos',
      title: 'Ingresos Totales',
      value: `€${rentabilidad.ingresosTotales.toLocaleString()}`,
      icon: <TrendingUp className="w-5 h-5" />,
      color: 'success',
      loading
    },
    {
      id: 'costes',
      title: 'Costes Totales',
      value: `€${rentabilidad.costesTotales.toLocaleString()}`,
      icon: <TrendingDown className="w-5 h-5" />,
      color: 'error',
      loading
    },
    {
      id: 'beneficio',
      title: 'Beneficio Neto',
      value: `€${rentabilidad.beneficioNeto.toLocaleString()}`,
      icon: <DollarSign className="w-5 h-5" />,
      color: 'primary',
      loading
    },
    {
      id: 'margen',
      title: 'Margen Rentabilidad',
      value: `${rentabilidad.margenRentabilidad.toFixed(1)}%`,
      icon: <Percent className="w-5 h-5" />,
      color: rentabilidad.margenRentabilidad > 70 ? 'success' : rentabilidad.margenRentabilidad > 40 ? 'warning' : 'error',
      loading
    }
  ] : [];

  return (
    <div className="space-y-6">
      <MetricCards data={metrics} columns={4} />
      
      <Card className="bg-white shadow-sm">
        <div className="p-4">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Análisis de Rentabilidad
          </h2>
          {loading ? (
            <Card className="p-8 text-center bg-white shadow-sm">
              <Loader2 size={48} className="mx-auto text-blue-500 animate-spin mb-4" />
              <p className="text-gray-600">Cargando...</p>
            </Card>
          ) : rentabilidad ? (
            <div className="space-y-4">
              <div className="rounded-xl bg-white ring-1 ring-slate-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-lg font-semibold text-gray-900">
                    Estado Actual
                  </p>
                  {getEstadoBadge(rentabilidad.estado)}
                </div>
                <p className="text-gray-600 mb-4">
                  El margen de rentabilidad del centro es del {rentabilidad.margenRentabilidad.toFixed(1)}%, 
                  lo que indica un estado {rentabilidad.estado === 'saludable' ? 'saludable' : rentabilidad.estado === 'advertencia' ? 'de advertencia' : 'crítico'}.
                </p>
                <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-200">
                  <div>
                    <p className="text-sm font-medium text-slate-700 mb-1">
                      Ingresos
                    </p>
                    <p className="text-lg font-semibold text-green-600">
                      €{rentabilidad.ingresosTotales.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-700 mb-1">
                      Costes
                    </p>
                    <p className="text-lg font-semibold text-red-600">
                      €{rentabilidad.costesTotales.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-700 mb-1">
                      Beneficio
                    </p>
                    <p className="text-lg font-semibold text-blue-600">
                      €{rentabilidad.beneficioNeto.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <Card className="p-8 text-center bg-white shadow-sm">
              <Package size={48} className="mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Sin datos disponibles</h3>
              <p className="text-gray-600">No hay información de rentabilidad para mostrar en este momento.</p>
            </Card>
          )}
        </div>
      </Card>
    </div>
  );
};

