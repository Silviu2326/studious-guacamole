import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { useAdherencia } from '../hooks/useAdherencia';
import { RecomendacionMejora, FiltrosAdherencia } from '../types';
import { ds } from '../ui/ds';
import { Icon, iconForCategoria } from '../ui/icons';
import { Card } from '../../../components/componentsreutilizables';

interface Props {
  filtros: FiltrosAdherencia;
  onFiltrosChange: (filtros: FiltrosAdherencia) => void;
}

export const OptimizadorAdherencia: React.FC<Props> = ({ filtros, onFiltrosChange }) => {
  const { user } = useAuth();
  const { recomendaciones, obtenerRecomendaciones, loading } = useAdherencia();
  const [categoriaFiltro, setCategoriaFiltro] = useState<string>('todas');
  const [prioridadFiltro, setPrioridadFiltro] = useState<string>('todas');
  const [recomendacionesImplementadas, setRecomendacionesImplementadas] = useState<string[]>([]);

  useEffect(() => {
    obtenerRecomendaciones();
  }, [obtenerRecomendaciones, filtros]);

  const recomendacionesFiltradas = recomendaciones.filter(rec => {
    if (recomendacionesImplementadas.includes(rec.id)) return false;
    
    const cumpleCategoria = categoriaFiltro === 'todas' || rec.categoria === categoriaFiltro;
    const cumplePrioridad = prioridadFiltro === 'todas' || rec.prioridad === prioridadFiltro;
    
    return cumpleCategoria && cumplePrioridad;
  });

  const marcarComoImplementada = (recomendacionId: string) => {
    setRecomendacionesImplementadas([...recomendacionesImplementadas, recomendacionId]);
  };

  const getIconoCategoria = (categoria: string) => iconForCategoria(categoria);

  const getColorPrioridad = (prioridad: string) => {
    switch (prioridad) {
      case 'alta':
        return 'bg-red-50 border-red-200 text-red-800';
      case 'media':
        return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      case 'baja':
        return 'bg-green-50 border-green-200 text-green-800';
      default:
        return 'bg-gray-50 border-gray-200 text-gray-800';
    }
  };

  const getColorBotonPrioridad = (prioridad: string) => {
    switch (prioridad) {
      case 'alta':
        return 'bg-red-100 text-red-800 hover:bg-red-200';
      case 'media':
        return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200';
      case 'baja':
        return 'bg-green-100 text-green-800 hover:bg-green-200';
      default:
        return 'bg-gray-100 text-gray-800 hover:bg-gray-200';
    }
  };

  const contarPorPrioridad = (prioridad: string) => {
    return recomendacionesFiltradas.filter(rec => rec.prioridad === prioridad).length;
  };

  const contarPorCategoria = (categoria: string) => {
    return recomendacionesFiltradas.filter(rec => rec.categoria === categoria).length;
  };

  const categoriasDisponibles = user?.role === 'entrenador' 
    ? ['horarios', 'motivacion', 'comunicacion', 'programacion']
    : ['horarios', 'marketing', 'infraestructura', 'personal', 'programacion'];

  if (loading) {
    return (
      <div className={`${ds.card} ${ds.cardPad}`}>
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
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
      {/* Resumen de Recomendaciones */}
      <Card className="p-4 bg-white shadow-sm">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Resumen de Optimizaciones</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex items-center">
              <Icon name="lightbulb" className="w-6 h-6 mr-3 text-blue-600" />
              <div>
                <p className={`text-sm font-medium ${ds.color.info}`}>Total Recomendaciones</p>
                <p className={`text-2xl font-bold ${ds.color.textPrimary}`}>{recomendacionesFiltradas.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-red-50 rounded-lg p-4">
            <div className="flex items-center">
              <Icon name="warning" className="w-6 h-6 mr-3 text-red-600" />
              <div>
                <p className="text-sm font-medium text-red-600">Alta Prioridad</p>
                <p className="text-2xl font-bold text-red-900">{contarPorPrioridad('alta')}</p>
              </div>
            </div>
          </div>

          <div className="bg-yellow-50 rounded-lg p-4">
            <div className="flex items-center">
              <Icon name="warning" className="w-6 h-6 mr-3 text-amber-600" />
              <div>
                <p className="text-sm font-medium text-yellow-600">Media Prioridad</p>
                <p className="text-2xl font-bold text-yellow-900">{contarPorPrioridad('media')}</p>
              </div>
            </div>
          </div>

          <div className="bg-green-50 rounded-lg p-4">
            <div className="flex items-center">
              <Icon name="check" className="w-6 h-6 mr-3 text-green-600" />
              <div>
                <p className="text-sm font-medium text-green-600">Implementadas</p>
                <p className="text-2xl font-bold text-green-900">{recomendacionesImplementadas.length}</p>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Filtros */}
      <Card className="p-4 bg-white shadow-sm">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Filtros</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Categoría
            </label>
            <select
              value={categoriaFiltro}
              onChange={(e) => setCategoriaFiltro(e.target.value)}
              className={ds.select}
            >
              <option value="todas">Todas las categorías</option>
              {categoriasDisponibles.map(categoria => (
                <option key={categoria} value={categoria}>
                  {categoria.charAt(0).toUpperCase() + categoria.slice(1)} ({contarPorCategoria(categoria)})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Prioridad
            </label>
            <select
              value={prioridadFiltro}
              onChange={(e) => setPrioridadFiltro(e.target.value)}
              className={ds.select}
            >
              <option value="todas">Todas las prioridades</option>
              <option value="alta">Alta ({contarPorPrioridad('alta')})</option>
              <option value="media">Media ({contarPorPrioridad('media')})</option>
              <option value="baja">Baja ({contarPorPrioridad('baja')})</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Recomendaciones Prioritarias */}
      {contarPorPrioridad('alta') > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <div className="flex items-center mb-4">
            <span className="text-2xl mr-3">🚨</span>
            <h3 className="text-lg font-medium text-red-900">
              Recomendaciones de Alta Prioridad
            </h3>
          </div>
          <p className="text-sm text-red-700 mb-4">
            Estas recomendaciones pueden tener un impacto significativo en la adherencia y deben implementarse pronto.
          </p>
          <div className="space-y-3">
            {recomendacionesFiltradas
              .filter(rec => rec.prioridad === 'alta')
              .slice(0, 3)
              .map((recomendacion) => (
                <div key={recomendacion.id} className="bg-white rounded-lg p-4 border border-red-200">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3 flex-1">
                      <span className="text-xl">{getIconoCategoria(recomendacion.categoria)}</span>
                      <div>
                        <h4 className="font-medium text-red-900 mb-1">{recomendacion.titulo}</h4>
                        <p className="text-sm text-red-700 mb-2">{recomendacion.descripcion}</p>
                        <p className="text-xs text-red-600">
                          Impacto esperado: +{recomendacion.impactoEsperado}% en adherencia
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => marcarComoImplementada(recomendacion.id)}
                      className="ml-4 px-3 py-1 text-sm font-medium text-white bg-red-600 rounded hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    >
                      Implementar
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Lista de Todas las Recomendaciones */}
      <Card className="p-4 bg-white shadow-sm">
        <h3 className="text-xl font-bold text-gray-900 mb-4">
          Todas las Recomendaciones ({recomendacionesFiltradas.length})
        </h3>
        
        {recomendacionesFiltradas.length === 0 ? (
          <div className="text-center py-8">
            <span className="mb-4 block"><Icon name="target" className="w-12 h-12 text-slate-600" /></span>
            <p className={`text-lg font-medium ${ds.color.textPrimary} mb-2`}>¡Excelente trabajo!</p>
            <p className={ds.color.textSecondary}>
              {recomendacionesImplementadas.length > 0 
                ? 'Has implementado todas las recomendaciones disponibles.'
                : 'No hay recomendaciones pendientes en este momento.'
              }
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {recomendacionesFiltradas.map((recomendacion) => (
              <div
                key={recomendacion.id}
                className={`${ds.card} ${ds.cardPad} ${getColorPrioridad(recomendacion.prioridad)}`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3 flex-1">
                    <span className="text-2xl">{getIconoCategoria(recomendacion.categoria)}</span>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h4 className={`${ds.cardTitle}`}>{recomendacion.titulo}</h4>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${recomendacion.prioridad === 'alta' ? ds.badge.danger : recomendacion.prioridad === 'media' ? ds.badge.warning : ds.badge.success}`}>
                          {recomendacion.prioridad.toUpperCase()}
                        </span>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${ds.badge.muted}`}>
                          {recomendacion.categoria}
                        </span>
                      </div>
                      
                      <p className={`text-sm mb-3 ${ds.color.textSecondary}`}>{recomendacion.descripcion}</p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                        <div className="bg-white bg-opacity-50 rounded p-3">
                          <p className={`text-sm font-medium mb-1 ${ds.color.textSecondary}`}>📈 Impacto Esperado</p>
                          <p className="text-sm">+{recomendacion.impactoEsperado}% en adherencia</p>
                        </div>
                        
                        <div className="bg-white bg-opacity-50 rounded p-3">
                          <p className={`text-sm font-medium mb-1 ${ds.color.textSecondary}`}>⏱️ Tiempo de Implementación</p>
                          <p className="text-sm">{recomendacion.tiempoImplementacion}</p>
                        </div>
                      </div>
                      
                      {recomendacion.pasosImplementacion && recomendacion.pasosImplementacion.length > 0 && (
                        <div className="bg-white bg-opacity-50 rounded p-3 mb-3">
                          <p className={`text-sm font-medium mb-2 ${ds.color.textSecondary}`}>📋 Pasos para Implementar:</p>
                          <ol className="text-sm space-y-1">
                            {recomendacion.pasosImplementacion.map((paso, index) => (
                              <li key={index} className="flex items-start">
                                <span className="font-medium mr-2">{index + 1}.</span>
                                <span>{paso}</span>
                              </li>
                            ))}
                          </ol>
                        </div>
                      )}
                      
                      {recomendacion.recursosNecesarios && recomendacion.recursosNecesarios.length > 0 && (
                        <div className="bg-white bg-opacity-50 rounded p-3">
                          <p className={`text-sm font-medium mb-2 ${ds.color.textSecondary}`}>🛠️ Recursos Necesarios:</p>
                          <ul className="text-sm space-y-1">
                            {recomendacion.recursosNecesarios.map((recurso, index) => (
                              <li key={index} className="flex items-start">
                                <span className="mr-2">•</span>
                                <span>{recurso}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="ml-4 flex flex-col space-y-2">
                    <button
                      onClick={() => marcarComoImplementada(recomendacion.id)}
                      className={`px-3 py-1 text-sm font-medium text-white rounded hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                        recomendacion.prioridad === 'alta' ? 'bg-red-600 focus:ring-red-500' :
                        recomendacion.prioridad === 'media' ? 'bg-yellow-600 focus:ring-yellow-500' :
                        'bg-green-600 focus:ring-green-500'
                      }`}
                    >
                      ✓ Implementar
                    </button>
                    
                    <button
                      className="px-3 py-1 text-sm font-medium text-gray-600 bg-gray-100 rounded hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                      onClick={() => {
                        // Aquí se podría implementar funcionalidad para obtener más detalles
                        console.log('Ver detalles de:', recomendacion.id);
                      }}
                    >
                      📋 Detalles
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Plan de Acción Sugerido */}
      {recomendacionesFiltradas.length > 0 && (
        <Card className="p-4 bg-white shadow-sm">
          <div className="flex items-center mb-4">
            <span className="text-2xl mr-3">🎯</span>
            <h3 className="text-xl font-bold text-gray-900">Plan de Acción Sugerido</h3>
          </div>
          
          <div className="space-y-3">
            <div className="bg-white rounded-lg p-4">
              <h4 className={`${ds.cardTitle} mb-2`}>📅 Esta Semana (Prioridad Alta)</h4>
              <ul className={`text-sm ${ds.color.textSecondary} space-y-1`}>
                {recomendacionesFiltradas
                  .filter(rec => rec.prioridad === 'alta')
                  .slice(0, 2)
                  .map((rec, index) => (
                    <li key={index}>• {rec.titulo}</li>
                  ))}
              </ul>
            </div>
            
            <div className="bg-white rounded-lg p-4">
              <h4 className={`${ds.cardTitle} mb-2`}>📅 Próximas 2 Semanas (Prioridad Media)</h4>
              <ul className={`text-sm ${ds.color.textSecondary} space-y-1`}>
                {recomendacionesFiltradas
                  .filter(rec => rec.prioridad === 'media')
                  .slice(0, 3)
                  .map((rec, index) => (
                    <li key={index}>• {rec.titulo}</li>
                  ))}
              </ul>
            </div>
            
            <div className="bg-white rounded-lg p-4">
              <h4 className={`${ds.cardTitle} mb-2`}>📅 Próximo Mes (Prioridad Baja)</h4>
              <ul className={`text-sm ${ds.color.textSecondary} space-y-1`}>
                {recomendacionesFiltradas
                  .filter(rec => rec.prioridad === 'baja')
                  .slice(0, 2)
                  .map((rec, index) => (
                    <li key={index}>• {rec.titulo}</li>
                  ))}
              </ul>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};