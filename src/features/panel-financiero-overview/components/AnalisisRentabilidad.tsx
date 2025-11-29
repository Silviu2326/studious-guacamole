import React from 'react';
import { Card, MetricCards, MetricCardData, Badge } from '../../../components/componentsreutilizables';
import { TrendingUp, TrendingDown, DollarSign, Percent, Loader2, Package, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { getAnalisisRentabilidad } from '../api';
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
          const fechaActual = new Date();
          const data = await getAnalisisRentabilidad({
            mes: fechaActual.getMonth() + 1,
            anio: fechaActual.getFullYear()
          });
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

  const getEstadoBadge = (estadoSalud: string) => {
    const config = {
      saludable: {
        variant: 'green' as const,
        label: 'Saludable',
        icon: CheckCircle2
      },
      advertencia: {
        variant: 'yellow' as const,
        label: 'Advertencia',
        icon: AlertCircle
      },
      critico: {
        variant: 'red' as const,
        label: 'Crítico',
        icon: AlertCircle
      }
    };
    
    const estadoConfig = config[estadoSalud as keyof typeof config] || config.saludable;
    const Icon = estadoConfig.icon;
    
    return (
      <Badge variant={estadoConfig.variant} size="md">
        <Icon className="w-3 h-3 mr-1" />
        {estadoConfig.label}
      </Badge>
    );
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
      color: rentabilidad.beneficioNeto > 0 ? 'success' : 'error',
      loading
    },
    {
      id: 'margen',
      title: 'Margen Porcentual',
      value: `${rentabilidad.margenPorcentual.toFixed(1)}%`,
      icon: <Percent className="w-5 h-5" />,
      color: rentabilidad.margenPorcentual > 25 ? 'success' : rentabilidad.margenPorcentual >= 10 ? 'warning' : 'error',
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
            <div className="space-y-6">
              {/* Estado de Salud Financiera */}
              <div className="rounded-xl bg-gradient-to-br from-white to-gray-50 ring-1 ring-slate-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Estado de Salud Financiera
                  </h3>
                  {getEstadoBadge(rentabilidad.estadoSalud)}
                </div>
                
                {/* Comentario Resumen */}
                <div className="mb-6 p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                  <p className="text-sm text-gray-700 leading-relaxed">
                    {rentabilidad.comentarioResumen}
                  </p>
                </div>

                {/* Métricas Principales */}
                <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-200">
                  <div>
                    <p className="text-sm font-medium text-slate-700 mb-1">
                      Beneficio Neto
                    </p>
                    <p className={`text-lg font-semibold ${rentabilidad.beneficioNeto > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      €{rentabilidad.beneficioNeto.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-700 mb-1">
                      Margen Porcentual
                    </p>
                    <p className={`text-lg font-semibold ${
                      rentabilidad.margenPorcentual > 25 ? 'text-green-600' : 
                      rentabilidad.margenPorcentual >= 10 ? 'text-yellow-600' : 
                      'text-red-600'
                    }`}>
                      {rentabilidad.margenPorcentual.toFixed(1)}%
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-700 mb-1">
                      Ingresos Totales
                    </p>
                    <p className="text-lg font-semibold text-blue-600">
                      €{rentabilidad.ingresosTotales.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>

              {/* Desglose Adicional */}
              <div className="rounded-xl bg-white ring-1 ring-slate-200 p-6">
                <h3 className="text-md font-semibold text-gray-900 mb-4">
                  Desglose Financiero
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-slate-700 mb-1">
                      Ingresos Totales
                    </p>
                    <p className="text-lg font-semibold text-green-600">
                      €{rentabilidad.ingresosTotales.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-700 mb-1">
                      Costes Totales
                    </p>
                    <p className="text-lg font-semibold text-red-600">
                      €{rentabilidad.costesTotales.toLocaleString()}
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

