import React from 'react';
import { Card, Badge } from '../../../components/componentsreutilizables';
import { BarChart3, AlertTriangle, CheckCircle, TrendingUp } from 'lucide-react';
import { AnalisisPatrones } from '../api/patrones';

interface AnalizadorPatronesProps {
  analisis: AnalisisPatrones | null;
  loading?: boolean;
}

export const AnalizadorPatrones: React.FC<AnalizadorPatronesProps> = ({
  analisis,
  loading,
}) => {
  if (loading) {
    return (
      <Card className="p-8 text-center bg-white shadow-sm">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
        <p className="text-gray-600">Analizando patrones...</p>
      </Card>
    );
  }

  if (!analisis || analisis.patrones.length === 0) {
    return (
      <Card className="p-8 text-center bg-white shadow-sm">
        <CheckCircle size={48} className="mx-auto text-green-500 mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Sin Patrones Detectados
        </h3>
        <p className="text-gray-600">No se detectaron patrones significativos</p>
      </Card>
    );
  }

  const getTendenciaColor = (tendencia: string) => {
    switch (tendencia) {
      case 'mejora':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'empeora':
        return 'text-red-600 bg-red-50 border-red-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getSeveridadColor = (severidad: string) => {
    switch (severidad) {
      case 'alta':
        return 'bg-red-600';
      case 'media':
        return 'bg-orange-600';
      default:
        return 'bg-blue-600';
    }
  };

  // Estadísticas de patrones
  const estadisticasPatrones = {
    total: analisis.patrones.length,
    alta: analisis.patrones.filter(p => p.severidad === 'alta').length,
    media: analisis.patrones.filter(p => p.severidad === 'media').length,
    baja: analisis.patrones.filter(p => p.severidad === 'baja').length,
    positivos: analisis.patrones.filter(p => p.tipo === 'patron_positivo').length,
    negativos: analisis.patrones.filter(p => p.tipo !== 'patron_positivo').length,
  };

  return (
    <div className="space-y-6">
      {/* Resumen de Patrones */}
      <Card className="p-6 bg-white shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <BarChart3 size={20} className="text-purple-600" />
            Resumen de Patrones
          </h3>
          <Badge className={`${getTendenciaColor(analisis.tendenciaGeneral)} border`}>
            <TrendingUp size={12} className="mr-1" />
            {analisis.tendenciaGeneral.charAt(0).toUpperCase() + analisis.tendenciaGeneral.slice(1)}
          </Badge>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-lg bg-red-50 border border-red-200">
            <div className="text-2xl font-bold text-red-600 mb-1">{estadisticasPatrones.alta}</div>
            <div className="text-xs text-slate-600">Severidad Alta</div>
          </div>
          <div className="p-4 rounded-lg bg-orange-50 border border-orange-200">
            <div className="text-2xl font-bold text-orange-600 mb-1">{estadisticasPatrones.media}</div>
            <div className="text-xs text-slate-600">Severidad Media</div>
          </div>
          <div className="p-4 rounded-lg bg-green-50 border border-green-200">
            <div className="text-2xl font-bold text-green-600 mb-1">{estadisticasPatrones.positivos}</div>
            <div className="text-xs text-slate-600">Patrones Positivos</div>
          </div>
          <div className="p-4 rounded-lg bg-purple-50 border border-purple-200">
            <div className="text-2xl font-bold text-purple-600 mb-1">{estadisticasPatrones.total}</div>
            <div className="text-xs text-slate-600">Total Patrones</div>
          </div>
        </div>
      </Card>

      {/* Detalle de Patrones */}
      <Card className="p-4 bg-white shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <BarChart3 size={20} className="text-purple-600" />
            Análisis Detallado de Patrones
          </h3>
        </div>

      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {analisis.patrones.map((patron, index) => (
            <div
              key={index}
              className="p-4 rounded-xl ring-1 ring-slate-200 bg-white"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <AlertTriangle size={20} className="text-orange-500" />
                  <span className="font-semibold text-gray-900">
                    {patron.tipo.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
                  </span>
                </div>
                <Badge className={getSeveridadColor(patron.severidad)}>
                  {patron.severidad}
                </Badge>
              </div>
              <p className="text-sm text-slate-700 mb-2">{patron.descripcion}</p>
              <div className="mt-3 space-y-1">
                <p className="text-xs text-slate-600">
                  <strong>Frecuencia:</strong> {patron.frecuencia} veces
                </p>
                <p className="text-xs text-slate-600">
                  <strong>Última ocurrencia:</strong>{' '}
                  {new Date(patron.ultimaOcurrencia).toLocaleDateString('es-ES')}
                </p>
              </div>
              {patron.recomendaciones.length > 0 && (
                <div className="mt-3 pt-3 border-t border-slate-200">
                  <p className="text-xs font-semibold text-slate-700 mb-2">Recomendaciones:</p>
                  <ul className="list-disc list-inside text-xs text-slate-600 space-y-1">
                    {patron.recomendaciones.map((rec, idx) => (
                      <li key={idx} className="mb-1">{rec}</li>
                    ))}
                  </ul>
                </div>
              )}
              
              {/* Indicador de frecuencia */}
              <div className="mt-3 pt-3 border-t border-slate-200">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-600">Frecuencia</span>
                  <div className="flex-1 mx-2 bg-slate-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        patron.severidad === 'alta' 
                          ? 'bg-red-500'
                          : patron.severidad === 'media'
                          ? 'bg-orange-500'
                          : 'bg-blue-500'
                      }`}
                      style={{ width: `${Math.min((patron.frecuencia / 30) * 100, 100)}%` }}
                    />
                  </div>
                  <span className="text-xs font-semibold text-slate-700">{patron.frecuencia}x</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {analisis.recomendacionesGlobales.length > 0 && (
          <div className="mt-4 p-4 rounded-xl bg-blue-50 ring-1 ring-blue-200">
            <h4 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
              <TrendingUp size={16} className="text-blue-600" />
              Recomendaciones Globales
            </h4>
            <ul className="list-disc list-inside text-sm text-blue-800 space-y-1">
              {analisis.recomendacionesGlobales.map((rec, idx) => (
                <li key={idx}>{rec}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
      </Card>
    </div>
  );
};

