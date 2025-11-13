import React, { useState, useEffect, useCallback } from 'react';
import { Card, Button, Badge } from '../../../components/componentsreutilizables';
import { Sparkles, ChefHat, X, ArrowRight, ShoppingCart, Check, XCircle } from 'lucide-react';
import { SugerenciaInteligente } from '../api/sugerenciasInteligentes';
import { getSugerenciasInteligentes } from '../api/sugerenciasInteligentes';
import { RecursoBiblioteca } from '../types';
import { guardarPreferenciaDietista } from '../api/preferenciasDietista';
import { useAuth } from '../../../context/AuthContext';

interface SugerenciasInteligentesProps {
  clienteId?: string;
  dietaId?: string; // Para análisis de cumplimiento
  onSeleccionarRecurso?: (recurso: RecursoBiblioteca) => void;
  visible?: boolean;
  onCerrar?: () => void;
  onPreferenciaGuardada?: () => void; // Callback cuando se guarda una preferencia
}

export const SugerenciasInteligentes: React.FC<SugerenciasInteligentesProps> = ({
  clienteId,
  dietaId,
  onSeleccionarRecurso,
  visible = true,
  onCerrar,
  onPreferenciaGuardada,
}) => {
  const { user } = useAuth();
  const [sugerencias, setSugerencias] = useState<SugerenciaInteligente[]>([]);
  const [cargando, setCargando] = useState(false);
  const [mostrar, setMostrar] = useState(visible);
  const [procesando, setProcesando] = useState<Set<string>>(new Set());

  const cargarSugerencias = useCallback(async () => {
    setCargando(true);
    try {
      const data = await getSugerenciasInteligentes(clienteId, user?.id, dietaId);
      setSugerencias(data);
    } catch (error) {
      console.error('Error cargando sugerencias:', error);
    } finally {
      setCargando(false);
    }
  }, [clienteId, user?.id, dietaId]);

  useEffect(() => {
    if (mostrar) {
      cargarSugerencias();
    }
  }, [mostrar, cargarSugerencias]);

  if (!mostrar || sugerencias.length === 0) {
    return null;
  }

  const getTipoLabel = (tipo: SugerenciaInteligente['tipo']) => {
    switch (tipo) {
      case 'receta-ingredientes-comprados':
        return 'Con ingredientes que ya compraste';
      case 'receta-popular':
        return 'Popular';
      case 'receta-similar':
        return 'Similar';
      case 'receta-tendencia':
        return 'En tendencia';
      default:
        return 'Sugerencia';
    }
  };

  const getTipoColor = (tipo: SugerenciaInteligente['tipo']) => {
    switch (tipo) {
      case 'receta-ingredientes-comprados':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'receta-popular':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'receta-similar':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'receta-tendencia':
        return 'bg-orange-50 text-orange-700 border-orange-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const handleAceptar = async (sugerencia: SugerenciaInteligente) => {
    if (!user?.id || procesando.has(sugerencia.id)) return;

    setProcesando(prev => new Set(prev).add(sugerencia.id));

    try {
      await guardarPreferenciaDietista(user.id, {
        tipo: 'aceptada',
        sugerenciaId: sugerencia.id,
        recursoId: sugerencia.recurso.id,
        recursoTipo: sugerencia.recurso.tipo,
        razon: `Aceptada: ${sugerencia.razon}`,
        contexto: clienteId ? { clienteId } : undefined,
      });

      // Remover la sugerencia de la lista y recargar para obtener nuevas sugerencias
      setSugerencias(prev => prev.filter(s => s.id !== sugerencia.id));
      onPreferenciaGuardada?.();
      
      // Recargar sugerencias después de un breve delay para que el sistema aprenda
      setTimeout(() => {
        cargarSugerencias();
      }, 500);
    } catch (error) {
      console.error('Error guardando preferencia:', error);
    } finally {
      setProcesando(prev => {
        const nuevo = new Set(prev);
        nuevo.delete(sugerencia.id);
        return nuevo;
      });
    }
  };

  const handleRechazar = async (sugerencia: SugerenciaInteligente) => {
    if (!user?.id || procesando.has(sugerencia.id)) return;

    setProcesando(prev => new Set(prev).add(sugerencia.id));

    try {
      await guardarPreferenciaDietista(user.id, {
        tipo: 'rechazada',
        sugerenciaId: sugerencia.id,
        recursoId: sugerencia.recurso.id,
        recursoTipo: sugerencia.recurso.tipo,
        razon: `Rechazada: No se ajusta a mis preferencias`,
        contexto: clienteId ? { clienteId } : undefined,
      });

      // Remover la sugerencia de la lista y recargar para obtener nuevas sugerencias
      setSugerencias(prev => prev.filter(s => s.id !== sugerencia.id));
      onPreferenciaGuardada?.();
      
      // Recargar sugerencias después de un breve delay para que el sistema aprenda
      setTimeout(() => {
        cargarSugerencias();
      }, 500);
    } catch (error) {
      console.error('Error guardando preferencia:', error);
    } finally {
      setProcesando(prev => {
        const nuevo = new Set(prev);
        nuevo.delete(sugerencia.id);
        return nuevo;
      });
    }
  };

  return (
    <Card className="bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 border-2 border-blue-200 shadow-lg">
      <div className="p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Sparkles className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">
                Sugerencias Inteligentes
              </h3>
              <p className="text-sm text-gray-600">
                Recetas personalizadas para ti
              </p>
            </div>
          </div>
          {onCerrar && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setMostrar(false);
                onCerrar();
              }}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>

        {/* Sugerencias */}
        {cargando ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {sugerencias.map((sugerencia) => (
              <Card
                key={sugerencia.id}
                className="bg-white border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all cursor-pointer group"
                onClick={() => onSeleccionarRecurso?.(sugerencia.recurso)}
              >
                <div className="p-3">
                  <div className="flex items-start justify-between mb-2">
                    <Badge className={`${getTipoColor(sugerencia.tipo)} text-xs`}>
                      {getTipoLabel(sugerencia.tipo)}
                    </Badge>
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <Sparkles className="h-3 w-3" />
                      <span>{Math.round(sugerencia.relevancia)}%</span>
                    </div>
                  </div>

                  <h4 className="font-semibold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
                    {sugerencia.recurso.nombre}
                  </h4>

                  <p className="text-xs text-gray-600 mb-2 line-clamp-2">
                    {sugerencia.razon}
                  </p>

                  {sugerencia.ingredientesCoincidentes && sugerencia.ingredientesCoincidentes.length > 0 && (
                    <div className="flex items-center gap-1 mb-2 flex-wrap">
                      <ShoppingCart className="h-3 w-3 text-green-600" />
                      <span className="text-xs text-gray-600">
                        {sugerencia.ingredientesCoincidentes.slice(0, 2).join(', ')}
                        {sugerencia.ingredientesCoincidentes.length > 2 && '...'}
                      </span>
                    </div>
                  )}

                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <ChefHat className="h-3 w-3" />
                      <span>
                        {sugerencia.recurso.macros.calorias} kcal
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 text-xs group-hover:text-blue-600"
                        onClick={(e) => {
                          e.stopPropagation();
                          onSeleccionarRecurso?.(sugerencia.recurso);
                        }}
                      >
                        Ver receta
                        <ArrowRight className="h-3 w-3 ml-1" />
                      </Button>
                      {user && (
                        <>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0 text-green-600 hover:bg-green-50"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleAceptar(sugerencia);
                            }}
                            disabled={procesando.has(sugerencia.id)}
                            title="Aceptar sugerencia"
                          >
                            <Check className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0 text-red-600 hover:bg-red-50"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRechazar(sugerencia);
                            }}
                            disabled={procesando.has(sugerencia.id)}
                            title="Rechazar sugerencia"
                          >
                            <XCircle className="h-3 w-3" />
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </Card>
  );
};

