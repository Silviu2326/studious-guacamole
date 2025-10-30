import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { useAdherencia } from '../hooks/useAdherencia';
import { TendenciaAdherencia, FiltrosAdherencia } from '../types';
import { ds } from '../ui/ds';

interface Props {
  filtros: FiltrosAdherencia;
  onFiltrosChange: (filtros: FiltrosAdherencia) => void;
}

export const AnalizadorTendencias: React.FC<Props> = ({ filtros, onFiltrosChange }) => {
  const { user } = useAuth();
  const { tendencias, obtenerTendencias, loading } = useAdherencia();
  const [periodoComparacion, setPeriodoComparacion] = useState<string>('mes_anterior');
  const [tipoAnalisis, setTipoAnalisis] = useState<string>('general');

  useEffect(() => {
    obtenerTendencias();
  }, [obtenerTendencias, filtros]);

  // Datos simulados para el gráfico de tendencias
  const datosTendencia = [
    { periodo: 'Sem 1', valor: 75, valorAnterior: 70 },
    { periodo: 'Sem 2', valor: 78, valorAnterior: 72 },
    { periodo: 'Sem 3', valor: 82, valorAnterior: 75 },
    { periodo: 'Sem 4', valor: 79, valorAnterior: 78 },
    { periodo: 'Sem 5', valor: 85, valorAnterior: 80 },
    { periodo: 'Sem 6', valor: 88, valorAnterior: 82 },
  ];

  const getIconoTendencia = (tendencia: string) => {
    switch (tendencia) {
      case 'creciente': return '📈';
      case 'decreciente': return '📉';
      case 'estable': return '➡️';
      default: return '📊';
    }
  };

  const getColorTendencia = (tendencia: string) => {
    switch (tendencia) {
      case 'creciente': return 'text-green-600 bg-green-100';
      case 'decreciente': return 'text-red-600 bg-red-100';
      case 'estable': return 'text-blue-600 bg-blue-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const calcularCambio = (actual: number, anterior: number) => {
    const cambio = ((actual - anterior) / anterior) * 100;
    return {
      porcentaje: Math.abs(cambio).toFixed(1),
      tipo: cambio > 0 ? 'positivo' : cambio < 0 ? 'negativo' : 'neutro'
    };
  };

  const promedioActual = datosTendencia.reduce((sum, item) => sum + item.valor, 0) / datosTendencia.length;
  const promedioAnterior = datosTendencia.reduce((sum, item) => sum + item.valorAnterior, 0) / datosTendencia.length;
  const cambioGeneral = calcularCambio(promedioActual, promedioAnterior);

  if (loading) {
    return (
      <div className={`${ds.card} ${ds.cardPad}`}>
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-64 bg-gray-200 rounded mb-4"></div>
          <div className="grid grid-cols-3 gap-4">
            <div className="h-20 bg-gray-200 rounded"></div>
            <div className="h-20 bg-gray-200 rounded"></div>
            <div className="h-20 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Controles de Análisis */}
      <div className={`${ds.card} ${ds.cardPad}`}>
        <h3 className={`${ds.sectionTitle} mb-4`}>Configuración del Análisis</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Período de Comparación
            </label>
            <select
              value={periodoComparacion}
              onChange={(e) => setPeriodoComparacion(e.target.value)}
              className={ds.select}
            >
              <option value="semana_anterior">Semana Anterior</option>
              <option value="mes_anterior">Mes Anterior</option>
              <option value="trimestre_anterior">Trimestre Anterior</option>
              <option value="año_anterior">Año Anterior</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Tipo de Análisis
            </label>
            <select
              value={tipoAnalisis}
              onChange={(e) => setTipoAnalisis(e.target.value)}
              className={ds.select}
            >
              <option value="general">Análisis General</option>
              {user?.role === 'entrenador' && (
                <>
                  <option value="por_cliente">Por Cliente</option>
                  <option value="por_tipo_sesion">Por Tipo de Sesión</option>
                </>
              )}
              {user?.role === 'gimnasio' && (
                <>
                  <option value="por_clase">Por Clase</option>
                  <option value="por_instructor">Por Instructor</option>
                  <option value="por_horario">Por Horario</option>
                </>
              )}
            </select>
          </div>
        </div>
      </div>

      {/* Resumen de Tendencias */}
      <div className={`${ds.card} ${ds.cardPad}`}>
        <h3 className={`${ds.sectionTitle} mb-4`}>Resumen de Tendencias</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex items-center">
              <span className="text-2xl mr-3">📊</span>
              <div>
                <p className={`text-sm font-medium ${ds.color.info}`}>
                  {user?.role === 'entrenador' ? 'Adherencia Promedio' : 'Ocupación Promedio'}
                </p>
                <p className={`text-2xl font-bold ${ds.color.textPrimary}`}>{promedioActual.toFixed(1)}%</p>
              </div>
            </div>
          </div>

          <div className={`rounded-lg p-4 ${
            cambioGeneral.tipo === 'positivo' ? 'bg-green-50' : 
            cambioGeneral.tipo === 'negativo' ? 'bg-red-50' : 'bg-gray-50'
          }`}>
            <div className="flex items-center">
              <span className="text-2xl mr-3">
                {cambioGeneral.tipo === 'positivo' ? '📈' : 
                 cambioGeneral.tipo === 'negativo' ? '📉' : '➡️'}
              </span>
              <div>
                <p className={`text-sm font-medium ${
                  cambioGeneral.tipo === 'positivo' ? 'text-green-600' : 
                  cambioGeneral.tipo === 'negativo' ? 'text-red-600' : 'text-gray-600'
                }`}>
                  Cambio vs {periodoComparacion.replace('_', ' ')}
                </p>
                <p className={`text-2xl font-bold ${
                  cambioGeneral.tipo === 'positivo' ? 'text-green-900' : 
                  cambioGeneral.tipo === 'negativo' ? 'text-red-900' : 'text-gray-900'
                }`}>
                  {cambioGeneral.tipo === 'positivo' ? '+' : cambioGeneral.tipo === 'negativo' ? '-' : ''}
                  {cambioGeneral.porcentaje}%
                </p>
              </div>
            </div>
          </div>

          <div className="bg-purple-50 rounded-lg p-4">
            <div className="flex items-center">
              <span className="text-2xl mr-3">🎯</span>
              <div>
                <p className="text-sm font-medium text-purple-600">Mejor Semana</p>
                <p className="text-2xl font-bold text-purple-900">
                  {Math.max(...datosTendencia.map(d => d.valor))}%
                </p>
              </div>
            </div>
          </div>

          <div className="bg-orange-50 rounded-lg p-4">
            <div className="flex items-center">
              <span className="text-2xl mr-3">⚠️</span>
              <div>
                <p className="text-sm font-medium text-orange-600">Peor Semana</p>
                <p className="text-2xl font-bold text-orange-900">
                  {Math.min(...datosTendencia.map(d => d.valor))}%
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Gráfico de Tendencias */}
      <div className={`${ds.card} ${ds.cardPad}`}>
        <h3 className={`${ds.sectionTitle} mb-4`}>
          Evolución de {user?.role === 'entrenador' ? 'Adherencia' : 'Ocupación'}
        </h3>
        
        <div className="relative">
          {/* Leyenda */}
          <div className="flex justify-center space-x-6 mb-6">
            <div className="flex items-center">
              <div className="w-4 h-4 bg-blue-500 rounded mr-2"></div>
              <span className={`text-sm ${ds.color.textSecondary}`}>Período Actual</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-gray-300 rounded mr-2"></div>
              <span className={`text-sm ${ds.color.textSecondary}`}>Período Anterior</span>
            </div>
          </div>

          {/* Gráfico Simple */}
          <div className="space-y-4">
            {datosTendencia.map((dato, index) => (
              <div key={index} className="flex items-center space-x-4">
                <div className="w-16 text-sm font-medium text-gray-600">
                  {dato.periodo}
                </div>
                <div className="flex-1 relative">
                  {/* Barra período anterior */}
                  <div className="w-full bg-gray-200 rounded-full h-6 mb-1">
                    <div
                      className="bg-gray-400 h-6 rounded-full flex items-center justify-end pr-2"
                      style={{ width: `${dato.valorAnterior}%` }}
                    >
                      <span className="text-xs text-white font-medium">
                        {dato.valorAnterior}%
                      </span>
                    </div>
                  </div>
                  {/* Barra período actual */}
                  <div className="w-full bg-gray-200 rounded-full h-6">
                    <div
                      className="bg-blue-500 h-6 rounded-full flex items-center justify-end pr-2"
                      style={{ width: `${dato.valor}%` }}
                    >
                      <span className="text-xs text-white font-medium">
                        {dato.valor}%
                      </span>
                    </div>
                  </div>
                </div>
                <div className="w-16 text-right">
                  {(() => {
                    const cambio = calcularCambio(dato.valor, dato.valorAnterior);
                    return (
                      <span className={`text-sm font-medium ${
                        cambio.tipo === 'positivo' ? 'text-green-600' : 
                        cambio.tipo === 'negativo' ? 'text-red-600' : 'text-gray-600'
                      }`}>
                        {cambio.tipo === 'positivo' ? '+' : cambio.tipo === 'negativo' ? '-' : ''}
                        {cambio.porcentaje}%
                      </span>
                    );
                  })()}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Análisis Detallado */}
      <div className={`${ds.card} ${ds.cardPad}`}>
        <h3 className={`${ds.sectionTitle} mb-4`}>Análisis Detallado</h3>
        
        {tendencias.length === 0 ? (
          <p className="text-gray-500 text-center py-8">
            No hay datos suficientes para generar tendencias.
          </p>
        ) : (
          <div className="space-y-4">
            {tendencias.slice(0, 5).map((tendencia, index) => (
              <div
                key={index}
                className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    <span className="text-2xl">{getIconoTendencia(tendencia.direccion)}</span>
                    <div>
                      <h4 className={`font-medium ${ds.color.textPrimary} mb-1`}>
                        {tendencia.metrica} - {tendencia.periodo}
                      </h4>
                      <p className={`text-sm ${ds.color.textSecondary} mb-2`}>
                        {tendencia.descripcion}
                      </p>
                      <div className="flex items-center space-x-4 text-sm">
                        <span className={`${ds.color.textSecondary}`}>
                          Valor actual: <strong>{tendencia.valorActual}%</strong>
                        </span>
                        <span className={`${ds.color.textSecondary}`}>
                          Valor anterior: <strong>{tendencia.valorAnterior}%</strong>
                        </span>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getColorTendencia(tendencia.direccion)}`}>
                          {tendencia.direccion}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Insights y Recomendaciones */}
      <div className={`${ds.card} ${ds.cardPad}`}>
        <h3 className={`${ds.sectionTitle} mb-4`}>Insights y Recomendaciones</h3>
        
        <div className="space-y-4">
          {/* Insight positivo */}
          {cambioGeneral.tipo === 'positivo' && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex">
                <span className="text-green-400 text-xl mr-3">✅</span>
                <div>
                  <h4 className="text-sm font-medium text-green-800">Tendencia Positiva</h4>
                  <p className="mt-1 text-sm text-green-700">
                    {user?.role === 'entrenador' 
                      ? `La adherencia de tus clientes ha mejorado un ${cambioGeneral.porcentaje}% comparado con el ${periodoComparacion.replace('_', ' ')}. ¡Excelente trabajo!`
                      : `La ocupación de las clases ha aumentado un ${cambioGeneral.porcentaje}% comparado con el ${periodoComparacion.replace('_', ' ')}. Las estrategias implementadas están funcionando.`
                    }
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Insight negativo */}
          {cambioGeneral.tipo === 'negativo' && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex">
                <span className="text-red-400 text-xl mr-3">⚠️</span>
                <div>
                  <h4 className="text-sm font-medium text-red-800">Área de Mejora</h4>
                  <p className="mt-1 text-sm text-red-700">
                    {user?.role === 'entrenador' 
                      ? `La adherencia ha disminuido un ${cambioGeneral.porcentaje}% comparado con el ${periodoComparacion.replace('_', ' ')}. Considera revisar la motivación y seguimiento de tus clientes.`
                      : `La ocupación ha bajado un ${cambioGeneral.porcentaje}% comparado con el ${periodoComparacion.replace('_', ' ')}. Revisa la programación de clases y estrategias de marketing.`
                    }
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Recomendaciones específicas */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex">
              <span className="text-blue-400 text-xl mr-3">💡</span>
              <div>
                <h4 className="text-sm font-medium text-blue-800">Recomendaciones</h4>
                <ul className="mt-1 text-sm text-blue-700 space-y-1">
                  {user?.role === 'entrenador' ? (
                    <>
                      <li>• Identifica patrones en los días de mayor y menor adherencia</li>
                      <li>• Implementa recordatorios personalizados para clientes con baja adherencia</li>
                      <li>• Considera ajustar la intensidad o variedad de los entrenamientos</li>
                    </>
                  ) : (
                    <>
                      <li>• Analiza los horarios con mejor y peor ocupación</li>
                      <li>• Considera promociones especiales para clases con baja ocupación</li>
                      <li>• Evalúa la satisfacción de los clientes con instructores y tipos de clase</li>
                    </>
                  )}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};