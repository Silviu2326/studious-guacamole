import React, { useState, useEffect } from 'react';
import { Card } from '../../../components/componentsreutilizables';
import { TrendingUp, TrendingDown, BarChart3, Activity } from 'lucide-react';
import { getTendenciasAdherencia } from '../api/adherencia';

interface AnalizadorTendenciasProps {
  clienteId: string;
  dias?: number;
}

export const AnalizadorTendencias: React.FC<AnalizadorTendenciasProps> = ({
  clienteId,
  dias = 30,
}) => {
  const [tendencias, setTendencias] = useState<Array<{ fecha: string; adherencia: number }>>([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    cargarTendencias();
  }, [clienteId, dias]);

  const cargarTendencias = async () => {
    setCargando(true);
    try {
      const data = await getTendenciasAdherencia(clienteId, dias);
      setTendencias(data);
    } catch (error) {
      console.error('Error al cargar tendencias:', error);
    } finally {
      setCargando(false);
    }
  };

  const calcularPromedio = () => {
    if (tendencias.length === 0) return 0;
    const sum = tendencias.reduce((acc, t) => acc + t.adherencia, 0);
    return sum / tendencias.length;
  };

  const calcularTendencia = () => {
    if (tendencias.length < 2) return 'estable';
    const primera = tendencias[0].adherencia;
    const ultima = tendencias[tendencias.length - 1].adherencia;
    const diferencia = ultima - primera;
    
    if (diferencia > 5) return 'mejora';
    if (diferencia < -5) return 'empeora';
    return 'estable';
  };

  const getColorTendencia = (tendencia: string) => {
    switch (tendencia) {
      case 'mejora':
        return 'text-green-600';
      case 'empeora':
        return 'text-red-600';
      default:
        return 'text-gray-500';
    }
  };

  const getIconoTendencia = (tendencia: string) => {
    switch (tendencia) {
      case 'mejora':
        return <TrendingUp className="w-5 h-5" />;
      case 'empeora':
        return <TrendingDown className="w-5 h-5" />;
      default:
        return <Activity className="w-5 h-5" />;
    }
  };

  const tendenciaActual = calcularTendencia();
  const promedio = calcularPromedio();

  if (cargando) {
    return (
      <Card className="p-8 text-center bg-white shadow-sm">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/3 mx-auto" />
          <div className="h-64 bg-gray-200 rounded" />
        </div>
      </Card>
    );
  }

  if (tendencias.length === 0) {
    return (
      <Card className="p-8 text-center bg-white shadow-sm">
        <BarChart3 size={48} className="mx-auto text-gray-400 mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Sin datos disponibles</h3>
        <p className="text-gray-600 mb-4">No hay datos de tendencias disponibles</p>
      </Card>
    );
  }

  const maxAdherencia = Math.max(...tendencias.map(t => t.adherencia));
  const minAdherencia = Math.min(...tendencias.map(t => t.adherencia));

  return (
    <Card className="p-4 bg-white shadow-sm">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-xl ring-1 ring-green-200/70">
              <BarChart3 size={20} className="text-green-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Análisis de Tendencias
              </h3>
              <p className="text-xs text-gray-500">
                Últimos {dias} días
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-gray-50">
            <div className="flex items-center gap-2 mb-2">
              {getIconoTendencia(tendenciaActual)}
              <span className="text-sm font-semibold text-gray-900">
                Tendencia
              </span>
            </div>
            <p className={`text-lg font-bold ${getColorTendencia(tendenciaActual)}`}>
              {tendenciaActual === 'mejora' ? 'Mejora' : tendenciaActual === 'empeora' ? 'Empeora' : 'Estable'}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-gray-50">
            <div className="flex items-center gap-2 mb-2">
              <Activity size={20} className="text-blue-600" />
              <span className="text-sm font-semibold text-gray-900">
                Promedio
              </span>
            </div>
            <p className="text-lg font-bold text-gray-900">
              {promedio.toFixed(1)}%
            </p>
          </div>

          <div className="p-4 rounded-xl bg-gray-50">
            <div className="flex items-center gap-2 mb-2">
              <BarChart3 size={20} className="text-purple-600" />
              <span className="text-sm font-semibold text-gray-900">
                Rango
              </span>
            </div>
            <p className="text-lg font-bold text-gray-900">
              {minAdherencia.toFixed(0)}% - {maxAdherencia.toFixed(0)}%
            </p>
          </div>
        </div>

        <div className="space-y-2">
          <h4 className="text-lg font-semibold text-gray-900">
            Evolución Diaria
          </h4>
          <div className="space-y-2">
            {tendencias.slice(-7).map((tendencia, index) => {
              const ancho = tendencia.adherencia;
              return (
                <div key={index} className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">
                      {new Date(tendencia.fecha).toLocaleDateString('es-ES', { day: '2-digit', month: 'short' })}
                    </span>
                    <span className={`text-sm font-semibold ${
                      tendencia.adherencia >= 80 ? 'text-green-600' :
                      tendencia.adherencia >= 60 ? 'text-yellow-600' :
                      'text-red-600'
                    }`}>
                      {tendencia.adherencia.toFixed(0)}%
                    </span>
                  </div>
                  <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-500 ${
                        tendencia.adherencia >= 80 ? 'bg-green-500' :
                        tendencia.adherencia >= 60 ? 'bg-yellow-500' :
                        'bg-red-500'
                      }`}
                      style={{ width: `${ancho}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </Card>
  );
};

