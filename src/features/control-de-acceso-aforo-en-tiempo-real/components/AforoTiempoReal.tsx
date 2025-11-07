import React, { useState, useEffect } from 'react';
import { Card, MetricCards } from '../../../components/componentsreutilizables';
import {
  obtenerAforoActual,
  obtenerAforoPorZona,
  obtenerConfiguracionAforo,
  type AforoActual,
  type AforoPorZona,
} from '../api';
import { Users, TrendingUp, AlertTriangle, XCircle } from 'lucide-react';

export const AforoTiempoReal: React.FC = () => {
  const [aforoActual, setAforoActual] = useState<AforoActual | null>(null);
  const [aforoZonas, setAforoZonas] = useState<AforoPorZona[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    cargarAforo();
    const interval = setInterval(cargarAforo, 3000);
    return () => clearInterval(interval);
  }, []);

  const cargarAforo = async () => {
    setLoading(true);
    try {
      const [aforo, zonas] = await Promise.all([
        obtenerAforoActual(),
        obtenerAforoPorZona(),
      ]);
      setAforoActual(aforo);
      setAforoZonas(zonas);
    } catch (error) {
      console.error('Error al cargar aforo:', error);
    } finally {
      setLoading(false);
    }
  };

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case 'completo':
        return 'error';
      case 'alerta':
        return 'warning';
      default:
        return 'success';
    }
  };

  const getEstadoIcon = (estado: string) => {
    switch (estado) {
      case 'completo':
        return <XCircle className="w-5 h-5" />;
      case 'alerta':
        return <AlertTriangle className="w-5 h-5" />;
      default:
        return <TrendingUp className="w-5 h-5" />;
    }
  };

  const metricas = aforoActual
    ? [
        {
          id: 'personas',
          title: 'Personas Dentro',
          value: aforoActual.personasDentro,
          subtitle: `de ${aforoActual.capacidadMaxima} máximo`,
          color: getEstadoColor(aforoActual.estado) as any,
          icon: <Users className="w-5 h-5" />,
        },
        {
          id: 'ocupacion',
          title: 'Ocupación',
          value: `${aforoActual.porcentajeOcupacion.toFixed(1)}%`,
          subtitle: aforoActual.estado === 'completo' ? 'Aforo completo' : 'Capacidad disponible',
          color: getEstadoColor(aforoActual.estado) as any,
          icon: getEstadoIcon(aforoActual.estado),
        },
        {
          id: 'disponible',
          title: 'Espacios Disponibles',
          value: Math.max(0, aforoActual.capacidadMaxima - aforoActual.personasDentro),
          subtitle: 'Pueden ingresar',
          color: 'info' as any,
          icon: <TrendingUp className="w-5 h-5" />,
        },
        {
          id: 'actualizacion',
          title: 'Última Actualización',
          value: new Date(aforoActual.ultimaActualizacion).toLocaleTimeString('es-ES'),
          subtitle: 'En tiempo real',
          color: 'primary' as any,
          icon: <RefreshCw className="w-5 h-5" />,
        },
      ]
    : [];

  return (
    <div className="space-y-6">
      {/* Métricas principales */}
      <MetricCards data={metricas} columns={4} loading={loading} />

      {/* Indicador visual de aforo */}
      {aforoActual && (
        <Card className="bg-white shadow-sm">
          <div className="p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Aforo en Tiempo Real
            </h2>

            <div className="space-y-4">
              {/* Barra de progreso */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-slate-700">
                    Ocupación Actual
                  </span>
                  <span className="text-sm font-semibold text-gray-900">
                    {aforoActual.porcentajeOcupacion.toFixed(1)}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-8 overflow-hidden">
                  <div
                    className={`h-full transition-all duration-500 ${
                      aforoActual.estado === 'completo'
                        ? 'bg-red-500'
                        : aforoActual.estado === 'alerta'
                        ? 'bg-yellow-500'
                        : 'bg-green-500'
                    }`}
                    style={{ width: `${Math.min(100, aforoActual.porcentajeOcupacion)}%` }}
                  />
                </div>
              </div>

              {/* Estado actual */}
              <div className={`bg-white rounded-xl ring-1 ring-slate-200 p-4 shadow-sm ${
                aforoActual.estado === 'completo'
                  ? 'bg-red-50 ring-red-200'
                  : aforoActual.estado === 'alerta'
                  ? 'bg-yellow-50 ring-yellow-200'
                  : 'bg-green-50 ring-green-200'
              }`}>
                <div className="flex items-center gap-3">
                  {aforoActual.estado === 'completo' && <XCircle className="w-6 h-6 text-red-600" />}
                  {aforoActual.estado === 'alerta' && <AlertTriangle className="w-6 h-6 text-yellow-600" />}
                  {aforoActual.estado === 'normal' && <TrendingUp className="w-6 h-6 text-green-600" />}
                  <div>
                    <p className={`font-semibold text-sm ${
                      aforoActual.estado === 'completo'
                        ? 'text-red-800'
                        : aforoActual.estado === 'alerta'
                        ? 'text-yellow-800'
                        : 'text-green-800'
                    }`}>
                      {aforoActual.estado === 'completo'
                        ? 'Aforo Completo - Acceso Bloqueado'
                        : aforoActual.estado === 'alerta'
                        ? 'Próximo al Límite'
                        : 'Aforo Normal'}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      {aforoActual.personasDentro} personas actualmente en el centro
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Aforo por zonas */}
      {aforoZonas.length > 0 && (
        <Card className="bg-white shadow-sm">
          <div className="p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Aforo por Zona
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {aforoZonas.map((zona) => (
                <div key={zona.zona} className="bg-white rounded-xl ring-1 ring-slate-200 p-4 shadow-sm">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-base font-semibold text-gray-900">
                      {zona.zona}
                    </h3>
                    {zona.estado === 'completo' && <XCircle className="w-5 h-5 text-red-500" />}
                    {zona.estado === 'alerta' && <AlertTriangle className="w-5 h-5 text-yellow-500" />}
                    {zona.estado === 'normal' && <TrendingUp className="w-5 h-5 text-green-500" />}
                  </div>
                  <div className="mb-2">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-slate-700">
                        {zona.personas} / {zona.capacidad}
                      </span>
                      <span className="text-sm font-semibold text-gray-900">
                        {zona.porcentaje.toFixed(1)}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                      <div
                        className={`h-full transition-all duration-500 ${
                          zona.estado === 'completo'
                            ? 'bg-red-500'
                            : zona.estado === 'alerta'
                            ? 'bg-yellow-500'
                            : 'bg-green-500'
                        }`}
                        style={{ width: `${Math.min(100, zona.porcentaje)}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

