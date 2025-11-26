import React from 'react';
import { Card, MetricCards, MetricCardData } from '../../../components/componentsreutilizables';
import { TrendingUp, TrendingDown, BarChart3, Loader2 } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { rendimientoApi } from '../api';
import { RendimientoEntrenador, MetricasFinancieras } from '../types';

export const RendimientoMensual: React.FC = () => {
  const { user } = useAuth();
  const [rendimiento, setRendimiento] = React.useState<RendimientoEntrenador | MetricasFinancieras | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const cargarRendimiento = async () => {
      try {
        setLoading(true);
        if (user?.role === 'entrenador') {
          const data = await rendimientoApi.obtenerRendimientoEntrenador();
          setRendimiento(data as any);
        } else {
          const data = await rendimientoApi.obtenerRendimientoGimnasio();
          setRendimiento(data);
        }
      } catch (error) {
        console.error('Error cargando rendimiento:', error);
      } finally {
        setLoading(false);
      }
    };

    cargarRendimiento();
  }, [user?.role]);

  const getTrendIcon = (tendencia: 'up' | 'down' | 'neutral') => {
    switch (tendencia) {
      case 'up':
        return <TrendingUp className="w-5 h-5" />;
      case 'down':
        return <TrendingDown className="w-5 h-5" />;
      default:
        return null;
    }
  };

  if (user?.role === 'entrenador' && rendimiento && 'mesActual' in rendimiento) {
    const rend = rendimiento as RendimientoEntrenador;
    const metrics: MetricCardData[] = [
      {
        id: 'actual',
        title: 'Mes Actual',
        value: `€${rend.mesActual.toLocaleString()}`,
        subtitle: 'Ingresos del mes en curso',
        icon: <BarChart3 className="w-5 h-5" />,
        color: 'primary',
        loading
      },
      {
        id: 'anterior',
        title: 'Mes Anterior',
        value: `€${rend.mesAnterior.toLocaleString()}`,
        subtitle: 'Ingresos del mes pasado',
        icon: <BarChart3 className="w-5 h-5" />,
        color: 'info',
        loading
      },
      {
        id: 'variacion',
        title: 'Variación',
        value: `${rend.variacion > 0 ? '+' : ''}${rend.variacion.toFixed(1)}%`,
        subtitle: 'Comparación mensual',
        trend: {
          value: Math.abs(rend.variacion),
          direction: rend.tendencia,
          label: 'vs mes anterior'
        },
        icon: getTrendIcon(rend.tendencia),
        color: rend.tendencia === 'up' ? 'success' : rend.tendencia === 'down' ? 'error' : 'info',
        loading
      }
    ];

    return (
      <div className="space-y-6">
        <MetricCards data={metrics} columns={3} />
        
        <Card className="bg-white shadow-sm">
          <div className="p-4">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Análisis de Rendimiento
            </h2>
            <div className="space-y-4">
              <div className="rounded-xl bg-white ring-1 ring-slate-200 p-6">
                <p className="text-gray-600 mb-2">
                  Tu rendimiento este mes ha sido {rend.tendencia === 'up' ? 'positivo' : rend.tendencia === 'down' ? 'negativo' : 'estable'}.
                </p>
                <p className="text-sm text-gray-500">
                  {rend.variacion > 0 
                    ? `Has aumentado tus ingresos en un ${rend.variacion.toFixed(1)}% comparado con el mes anterior.`
                    : rend.variacion < 0
                    ? `Tus ingresos han disminuido un ${Math.abs(rend.variacion).toFixed(1)}% comparado con el mes anterior.`
                    : 'Tus ingresos se han mantenido estables comparados con el mes anterior.'
                  }
                </p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  // Gimnasio
  if (rendimiento && 'total' in rendimiento) {
    const rend = rendimiento as MetricasFinancieras;
    const metrics: MetricCardData[] = [
      {
        id: 'actual',
        title: rend.periodoActual,
        value: `€${rend.total.toLocaleString()}`,
        subtitle: 'Facturación del período actual',
        icon: <BarChart3 className="w-5 h-5" />,
        color: 'primary',
        loading
      },
      {
        id: 'variacion',
        title: 'Variación',
        value: `${rend.variacion && rend.variacion > 0 ? '+' : ''}${rend.variacion || 0}%`,
        subtitle: `Comparado con ${rend.periodoAnterior || 'período anterior'}`,
        trend: rend.variacion ? {
          value: Math.abs(rend.variacion),
          direction: rend.tendencia,
          label: 'vs período anterior'
        } : undefined,
        icon: getTrendIcon(rend.tendencia),
        color: rend.tendencia === 'up' ? 'success' : rend.tendencia === 'down' ? 'error' : 'info',
        loading
      }
    ];

    return (
      <div className="space-y-6">
        <MetricCards data={metrics} columns={2} />
        
        <Card className="bg-white shadow-sm">
          <div className="p-4">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Análisis de Rendimiento
            </h2>
            <div className="space-y-4">
              <div className="rounded-xl bg-white ring-1 ring-slate-200 p-6">
                <p className="text-gray-600 mb-2">
                  El rendimiento del centro este período ha sido {rend.tendencia === 'up' ? 'positivo' : rend.tendencia === 'down' ? 'negativo' : 'estable'}.
                </p>
                {rend.variacion && (
                  <p className="text-sm text-gray-500">
                    {rend.variacion > 0 
                      ? `La facturación ha aumentado en un ${rend.variacion}% comparado con ${rend.periodoAnterior}.`
                      : rend.variacion < 0
                      ? `La facturación ha disminuido un ${Math.abs(rend.variacion)}% comparado con ${rend.periodoAnterior}.`
                      : 'La facturación se ha mantenido estable.'
                    }
                  </p>
                )}
              </div>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <Card className="bg-white shadow-sm">
      <div className="p-8 text-center">
        <Loader2 size={48} className="mx-auto text-blue-500 animate-spin mb-4" />
        <p className="text-gray-600">Cargando...</p>
      </div>
    </Card>
  );
};

