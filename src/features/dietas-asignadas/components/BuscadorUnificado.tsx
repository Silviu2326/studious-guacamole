import React, { useState, useEffect, useMemo } from 'react';
import { Card, Input, Button } from '../../../components/componentsreutilizables';
import { Search, X, FileText, UtensilsCrossed, Apple, Package, Cookie, Filter, Loader2 } from 'lucide-react';
import { buscarRecursosUnificada, ResultadoBusqueda, TipoRecurso, obtenerEstadisticasBusqueda } from '../api/busquedaUnificada';

interface BuscadorUnificadoProps {
  onSeleccionar?: (resultado: ResultadoBusqueda) => void;
  placeholder?: string;
  className?: string;
}

export const BuscadorUnificado: React.FC<BuscadorUnificadoProps> = ({
  onSeleccionar,
  placeholder = 'Buscar plantillas, recetas, alimentos, bloques y snacks...',
  className = '',
}) => {
  const [query, setQuery] = useState('');
  const [resultados, setResultados] = useState<ResultadoBusqueda[]>([]);
  const [cargando, setCargando] = useState(false);
  const [mostrarResultados, setMostrarResultados] = useState(false);
  const [tiposFiltro, setTiposFiltro] = useState<TipoRecurso[]>([]);
  const [estadisticas, setEstadisticas] = useState<Record<TipoRecurso, number>>({
    plantilla: 0,
    receta: 0,
    alimento: 0,
    bloque: 0,
    snack: 0,
  });

  // Debounce para la búsqueda
  useEffect(() => {
    if (!query.trim()) {
      setResultados([]);
      setMostrarResultados(false);
      return;
    }

    const timeoutId = setTimeout(async () => {
      setCargando(true);
      try {
        const resultadosBusqueda = await buscarRecursosUnificada(query, {
          tipos: tiposFiltro.length > 0 ? tiposFiltro : undefined,
        });
        setResultados(resultadosBusqueda);
        setMostrarResultados(true);

        // Obtener estadísticas
        const stats = await obtenerEstadisticasBusqueda(query);
        setEstadisticas(stats);
      } catch (error) {
        console.error('Error en búsqueda:', error);
        setResultados([]);
      } finally {
        setCargando(false);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [query, tiposFiltro]);

  const handleSeleccionar = (resultado: ResultadoBusqueda) => {
    if (onSeleccionar) {
      onSeleccionar(resultado);
    }
    setQuery('');
    setMostrarResultados(false);
  };

  const handleLimpiar = () => {
    setQuery('');
    setResultados([]);
    setMostrarResultados(false);
    setTiposFiltro([]);
  };

  const toggleFiltroTipo = (tipo: TipoRecurso) => {
    setTiposFiltro(prev =>
      prev.includes(tipo)
        ? prev.filter(t => t !== tipo)
        : [...prev, tipo]
    );
  };

  const getIconoTipo = (tipo: TipoRecurso) => {
    switch (tipo) {
      case 'plantilla':
        return <FileText className="w-4 h-4" />;
      case 'receta':
        return <UtensilsCrossed className="w-4 h-4" />;
      case 'alimento':
        return <Apple className="w-4 h-4" />;
      case 'bloque':
        return <Package className="w-4 h-4" />;
      case 'snack':
        return <Cookie className="w-4 h-4" />;
    }
  };

  const getColorTipo = (tipo: TipoRecurso) => {
    switch (tipo) {
      case 'plantilla':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'receta':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'alimento':
        return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'bloque':
        return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'snack':
        return 'bg-pink-100 text-pink-700 border-pink-200';
    }
  };

  const getLabelTipo = (tipo: TipoRecurso) => {
    switch (tipo) {
      case 'plantilla':
        return 'Plantilla';
      case 'receta':
        return 'Receta';
      case 'alimento':
        return 'Alimento';
      case 'bloque':
        return 'Bloque';
      case 'snack':
        return 'Snack';
    }
  };

  const resultadosAgrupados = useMemo(() => {
    const agrupados: Record<TipoRecurso, ResultadoBusqueda[]> = {
      plantilla: [],
      receta: [],
      alimento: [],
      bloque: [],
      snack: [],
    };

    resultados.forEach(r => {
      agrupados[r.tipo].push(r);
    });

    return agrupados;
  }, [resultados]);

  return (
    <div className={`relative ${className}`}>
      {/* Barra de búsqueda */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <Input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query.trim() && setMostrarResultados(true)}
          placeholder={placeholder}
          className="pl-10 pr-10 w-full"
        />
        {query && (
          <button
            onClick={handleLimpiar}
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
          >
            <X className="h-5 w-5 text-gray-400 hover:text-gray-600" />
          </button>
        )}
      </div>

      {/* Filtros de tipo */}
      {query && (
        <div className="mt-2 flex flex-wrap gap-2">
          <span className="text-sm text-gray-600 flex items-center gap-1">
            <Filter className="w-4 h-4" />
            Filtrar:
          </span>
          {(['plantilla', 'receta', 'alimento', 'bloque', 'snack'] as TipoRecurso[]).map(tipo => (
            <button
              key={tipo}
              onClick={() => toggleFiltroTipo(tipo)}
              className={`
                px-3 py-1 rounded-full text-xs font-medium border transition-colors
                flex items-center gap-1
                ${tiposFiltro.includes(tipo)
                  ? `${getColorTipo(tipo)} border-current`
                  : 'bg-gray-100 text-gray-600 border-gray-200 hover:bg-gray-200'
                }
              `}
            >
              {getIconoTipo(tipo)}
              {getLabelTipo(tipo)}
              {estadisticas[tipo] > 0 && (
                <span className="ml-1">({estadisticas[tipo]})</span>
              )}
            </button>
          ))}
        </div>
      )}

      {/* Resultados */}
      {mostrarResultados && query.trim() && (
        <Card className="absolute z-50 w-full mt-2 max-h-96 overflow-y-auto shadow-lg">
          {cargando ? (
            <div className="p-8 text-center">
              <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-gray-400" />
              <p className="text-sm text-gray-600">Buscando...</p>
            </div>
          ) : resultados.length === 0 ? (
            <div className="p-8 text-center">
              <Search className="w-8 h-8 mx-auto mb-2 text-gray-400" />
              <p className="text-sm text-gray-600">No se encontraron resultados</p>
            </div>
          ) : (
            <div className="p-2">
              {/* Resultados agrupados por tipo */}
              {(['plantilla', 'receta', 'alimento', 'bloque', 'snack'] as TipoRecurso[]).map(tipo => {
                const resultadosTipo = resultadosAgrupados[tipo];
                if (resultadosTipo.length === 0) return null;

                return (
                  <div key={tipo} className="mb-4 last:mb-0">
                    <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg mb-2">
                      {getIconoTipo(tipo)}
                      <span className="text-sm font-semibold text-gray-700">
                        {getLabelTipo(tipo)}s ({resultadosTipo.length})
                      </span>
                    </div>
                    <div className="space-y-1">
                      {resultadosTipo.map(resultado => (
                        <button
                          key={resultado.id}
                          onClick={() => handleSeleccionar(resultado)}
                          className="w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-200"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium ${getColorTipo(tipo)}`}>
                                  {getIconoTipo(tipo)}
                                  {getLabelTipo(tipo)}
                                </span>
                                <h4 className="text-sm font-semibold text-gray-900 truncate">
                                  {resultado.titulo}
                                </h4>
                              </div>
                              {resultado.descripcion && (
                                <p className="text-xs text-gray-600 line-clamp-1 mb-2">
                                  {resultado.descripcion}
                                </p>
                              )}
                              {resultado.metadata?.calorias && (
                                <div className="flex items-center gap-3 text-xs text-gray-500">
                                  <span>{resultado.metadata.calorias} kcal</span>
                                  {resultado.metadata.proteinas && (
                                    <span>P: {resultado.metadata.proteinas}g</span>
                                  )}
                                  {resultado.metadata.carbohidratos && (
                                    <span>C: {resultado.metadata.carbohidratos}g</span>
                                  )}
                                  {resultado.metadata.grasas && (
                                    <span>G: {resultado.metadata.grasas}g</span>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </Card>
      )}

      {/* Overlay para cerrar resultados al hacer clic fuera */}
      {mostrarResultados && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setMostrarResultados(false)}
        />
      )}
    </div>
  );
};

