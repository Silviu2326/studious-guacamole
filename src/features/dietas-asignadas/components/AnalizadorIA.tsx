import React, { useState, useMemo } from 'react';
import { Card, Button } from '../../../components/componentsreutilizables';
import { Sparkles, TrendingUp, TrendingDown, ArrowUp, ArrowDown, X, Loader2, CheckCircle2, Calculator } from 'lucide-react';
import type { Dieta, TipoMetricaExcel, RecomendacionIA, SimulacionImpactoIA } from '../types';
import type { RangoSeleccionado, CeldaSeleccionada } from './ResumenAutomatico';
import { SimuladorImpactoIA } from './SimuladorImpactoIA';

interface SugerenciaAjuste {
  id: string;
  tipo: 'aumentar' | 'reducir' | 'redistribuir' | 'optimizar';
  metrica: TipoMetricaExcel;
  descripcion: string;
  razon: string;
  accion: string;
  impacto: 'alto' | 'medio' | 'bajo';
  prioridad: number; // 1-5, donde 5 es más prioritario
  valores?: {
    actual: number;
    recomendado: number;
    diferencia: number;
  };
  ubicacion?: {
    dias?: string[];
    tiposComida?: string[];
  };
}

interface AnalizadorIAProps {
  dieta: Dieta;
  rangoSeleccionado: RangoSeleccionado;
  onCerrar: () => void;
  onAplicarAjuste?: (sugerencia: SugerenciaAjuste) => void;
}

export const AnalizadorIA: React.FC<AnalizadorIAProps> = ({
  dieta,
  rangoSeleccionado,
  onCerrar,
  onAplicarAjuste,
}) => {
  const [analizando, setAnalizando] = useState(false);
  const [sugerencias, setSugerencias] = useState<SugerenciaAjuste[]>([]);
  const [recomendacionSimulacion, setRecomendacionSimulacion] = useState<RecomendacionIA | null>(null);
  const [mostrarSimulador, setMostrarSimulador] = useState(false);

  // Analizar el rango seleccionado y generar sugerencias
  const analizarRango = useMemo(() => {
    if (rangoSeleccionado.celdas.length === 0) return null;

    // Agrupar celdas por columna (métrica)
    const porColumna: Record<string, CeldaSeleccionada[]> = {};
    rangoSeleccionado.celdas.forEach((celda) => {
      if (!porColumna[celda.columna]) {
        porColumna[celda.columna] = [];
      }
      porColumna[celda.columna].push(celda);
    });

    // Agrupar por tipo de comida
    const porTipoComida: Record<string, CeldaSeleccionada[]> = {};
    rangoSeleccionado.celdas.forEach((celda) => {
      if (!porTipoComida[celda.tipoComida]) {
        porTipoComida[celda.tipoComida] = [];
      }
      porTipoComida[celda.tipoComida].push(celda);
    });

    // Agrupar por día
    const porDia: Record<string, CeldaSeleccionada[]> = {};
    rangoSeleccionado.celdas.forEach((celda) => {
      if (!porDia[celda.dia]) {
        porDia[celda.dia] = [];
      }
      porDia[celda.dia].push(celda);
    });

    return { porColumna, porTipoComida, porDia };
  }, [rangoSeleccionado]);

  // Generar sugerencias basadas en el análisis
  const generarSugerencias = async () => {
    setAnalizando(true);
    try {
      // Simular análisis de IA (en producción sería una llamada a API)
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const sugerenciasGeneradas: SugerenciaAjuste[] = [];

      if (!analizarRango) {
        setSugerencias([]);
        return;
      }

      // Analizar cada columna (métrica)
      Object.entries(analizarRango.porColumna).forEach(([columna, celdas]) => {
        const valores = celdas
          .map((c) => {
            const num = typeof c.valor === 'string' ? parseFloat(c.valor) : c.valor;
            return isNaN(num) ? null : num;
          })
          .filter((v): v is number => v !== null);

        if (valores.length === 0) return;

        const promedio = valores.reduce((a, b) => a + b, 0) / valores.length;
        const suma = valores.reduce((a, b) => a + b, 0);
        const minimo = Math.min(...valores);
        const maximo = Math.max(...valores);

        // Analizar proteínas
        if (columna === 'proteinas') {
          // Calcular promedio por tipo de comida
          const proteinasPorTipo: Record<string, number> = {};
          celdas.forEach((celda) => {
            if (!proteinasPorTipo[celda.tipoComida]) {
              proteinasPorTipo[celda.tipoComida] = 0;
            }
            const num = typeof celda.valor === 'string' ? parseFloat(celda.valor) : celda.valor;
            if (!isNaN(num)) {
              proteinasPorTipo[celda.tipoComida] += num;
            }
          });

          // Sugerir aumentar proteína en cenas si es baja
          const proteinasCena = proteinasPorTipo['cena'] || 0;
          if (proteinasCena < 25) {
            sugerenciasGeneradas.push({
              id: `sug_${Date.now()}_1`,
              tipo: 'aumentar',
              metrica: 'proteinas',
              descripcion: 'Aumentar proteína en cenas',
              razon: `Las cenas tienen un promedio de ${proteinasCena.toFixed(1)}g de proteína, que está por debajo del objetivo recomendado de 25-30g para mantener la síntesis proteica durante la noche.`,
              accion: 'Aumentar la cantidad de proteína en las cenas seleccionadas en 10-15g',
              impacto: 'alto',
              prioridad: 4,
              valores: {
                actual: proteinasCena,
                recomendado: 30,
                diferencia: 30 - proteinasCena,
              },
              ubicacion: {
                tiposComida: ['cena'],
              },
            });
          }

          // Sugerir redistribuir si hay mucha variación
          if (maximo - minimo > 20) {
            sugerenciasGeneradas.push({
              id: `sug_${Date.now()}_2`,
              tipo: 'redistribuir',
              metrica: 'proteinas',
              descripcion: 'Redistribuir proteína de forma más uniforme',
              razon: `Hay una variación significativa en la distribución de proteínas (mínimo: ${minimo.toFixed(1)}g, máximo: ${maximo.toFixed(1)}g). Una distribución más uniforme mejora la síntesis proteica a lo largo del día.`,
              accion: 'Ajustar las comidas con proteína baja para acercarlas al promedio',
              impacto: 'medio',
              prioridad: 3,
            });
          }
        }

        // Analizar carbohidratos
        if (columna === 'carbohidratos') {
          const carbosPorTipo: Record<string, number> = {};
          celdas.forEach((celda) => {
            if (!carbosPorTipo[celda.tipoComida]) {
              carbosPorTipo[celda.tipoComida] = 0;
            }
            const num = typeof celda.valor === 'string' ? parseFloat(celda.valor) : celda.valor;
            if (!isNaN(num)) {
              carbosPorTipo[celda.tipoComida] += num;
            }
          });

          // Sugerir reducir carbohidratos en cenas si son altos
          const carbosCena = carbosPorTipo['cena'] || 0;
          if (carbosCena > 60) {
            sugerenciasGeneradas.push({
              id: `sug_${Date.now()}_3`,
              tipo: 'reducir',
              metrica: 'carbohidratos',
              descripcion: 'Reducir carbohidratos en cenas',
              razon: `Las cenas tienen un promedio de ${carbosCena.toFixed(1)}g de carbohidratos, que puede ser excesivo para la noche y afectar el descanso.`,
              accion: 'Reducir los carbohidratos en las cenas en 15-20g, compensando con más proteína o verduras',
              impacto: 'medio',
              prioridad: 3,
              valores: {
                actual: carbosCena,
                recomendado: 40,
                diferencia: carbosCena - 40,
              },
              ubicacion: {
                tiposComida: ['cena'],
              },
            });
          }
        }

        // Analizar calorías
        if (columna === 'calorias') {
          const caloriasPorDia: Record<string, number> = {};
          celdas.forEach((celda) => {
            if (!caloriasPorDia[celda.dia]) {
              caloriasPorDia[celda.dia] = 0;
            }
            const num = typeof celda.valor === 'string' ? parseFloat(celda.valor) : celda.valor;
            if (!isNaN(num)) {
              caloriasPorDia[celda.dia] += num;
            }
          });

          // Detectar días con calorías muy bajas o altas
          const caloriasObjetivo = dieta.macros.calorias;
          Object.entries(caloriasPorDia).forEach(([dia, total]) => {
            const diferencia = total - caloriasObjetivo;
            if (diferencia < -200) {
              sugerenciasGeneradas.push({
                id: `sug_${Date.now()}_4_${dia}`,
                tipo: 'aumentar',
                metrica: 'calorias',
                descripcion: `Aumentar calorías en ${dia}`,
                razon: `El ${dia} tiene ${total.toFixed(0)} kcal, que está ${Math.abs(diferencia).toFixed(0)} kcal por debajo del objetivo (${caloriasObjetivo} kcal).`,
                accion: `Aumentar las calorías en ${Math.abs(diferencia).toFixed(0)} kcal distribuyéndolas entre las comidas`,
                impacto: 'alto',
                prioridad: 5,
                valores: {
                  actual: total,
                  recomendado: caloriasObjetivo,
                  diferencia: Math.abs(diferencia),
                },
                ubicacion: {
                  dias: [dia],
                },
              });
            } else if (diferencia > 200) {
              sugerenciasGeneradas.push({
                id: `sug_${Date.now()}_5_${dia}`,
                tipo: 'reducir',
                metrica: 'calorias',
                descripcion: `Reducir calorías en ${dia}`,
                razon: `El ${dia} tiene ${total.toFixed(0)} kcal, que está ${diferencia.toFixed(0)} kcal por encima del objetivo (${caloriasObjetivo} kcal).`,
                accion: `Reducir las calorías en ${diferencia.toFixed(0)} kcal ajustando porciones o alimentos`,
                impacto: 'alto',
                prioridad: 5,
                valores: {
                  actual: total,
                  recomendado: caloriasObjetivo,
                  diferencia,
                },
                ubicacion: {
                  dias: [dia],
                },
              });
            }
          });
        }

        // Analizar fibra
        if (columna === 'fibra') {
          if (promedio < 5) {
            sugerenciasGeneradas.push({
              id: `sug_${Date.now()}_6`,
              tipo: 'aumentar',
              metrica: 'fibra',
              descripcion: 'Aumentar contenido de fibra',
              razon: `El promedio de fibra en el rango seleccionado es ${promedio.toFixed(1)}g, que está por debajo de las recomendaciones (mínimo 5g por comida).`,
              accion: 'Añadir más verduras, frutas o cereales integrales a las comidas seleccionadas',
              impacto: 'medio',
              prioridad: 3,
              valores: {
                actual: promedio,
                recomendado: 8,
                diferencia: 8 - promedio,
              },
            });
          }
        }
      });

      // Ordenar por prioridad (mayor a menor)
      sugerenciasGeneradas.sort((a, b) => b.prioridad - a.prioridad);

      setSugerencias(sugerenciasGeneradas);
    } catch (error) {
      console.error('Error generando sugerencias:', error);
    } finally {
      setAnalizando(false);
    }
  };

  // Ejecutar análisis automáticamente cuando cambia el rango
  React.useEffect(() => {
    if (rangoSeleccionado.celdas.length > 0) {
      generarSugerencias();
    } else {
      setSugerencias([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rangoSeleccionado]);

  const getIconoTipo = (tipo: SugerenciaAjuste['tipo']) => {
    switch (tipo) {
      case 'aumentar':
        return <ArrowUp className="w-4 h-4 text-green-600" />;
      case 'reducir':
        return <ArrowDown className="w-4 h-4 text-red-600" />;
      case 'redistribuir':
        return <TrendingUp className="w-4 h-4 text-blue-600" />;
      case 'optimizar':
        return <Sparkles className="w-4 h-4 text-purple-600" />;
    }
  };

  const getColorImpacto = (impacto: SugerenciaAjuste['impacto']) => {
    switch (impacto) {
      case 'alto':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'medio':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'bajo':
        return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  const getEtiquetaMetrica = (metrica: TipoMetricaExcel): string => {
    const etiquetas: Record<TipoMetricaExcel, string> = {
      calorias: 'Calorías',
      proteinas: 'Proteínas',
      carbohidratos: 'Carbohidratos',
      grasas: 'Grasas',
      fibra: 'Fibra',
      azucares: 'Azúcares',
      sodio: 'Sodio',
      'ratio-proteina': 'Ratio Proteína',
      'vasos-agua': 'Vasos de Agua',
      adherencia: 'Adherencia',
      'tiempo-preparacion': 'Tiempo Preparación',
      coste: 'Coste',
      'satisfaccion-prevista': 'Satisfacción Prevista',
    };
    return etiquetas[metrica] || metrica;
  };

  return (
    <Card className="bg-white border border-purple-200 shadow-lg">
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-200">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-purple-600" />
          <h3 className="text-lg font-semibold text-gray-900">Análisis IA de Ajustes</h3>
        </div>
        <button
          onClick={onCerrar}
          className="p-1 hover:bg-slate-100 rounded transition-colors"
          aria-label="Cerrar análisis"
        >
          <X className="w-5 h-5 text-slate-500" />
        </button>
      </div>

      {analizando ? (
        <div className="flex flex-col items-center justify-center py-8">
          <Loader2 className="w-8 h-8 text-purple-600 animate-spin mb-3" />
          <p className="text-sm text-gray-600">Analizando columnas seleccionadas...</p>
        </div>
      ) : sugerencias.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p className="text-sm">No se encontraron sugerencias de ajuste para el rango seleccionado.</p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="text-sm text-gray-600 mb-4">
            Se encontraron <strong>{sugerencias.length}</strong> sugerencias de mejora basadas en el análisis de las columnas seleccionadas.
          </div>

          {sugerencias.map((sugerencia) => (
            <div
              key={sugerencia.id}
              className="p-4 bg-slate-50 rounded-lg border border-slate-200 hover:border-purple-300 transition-colors"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2 flex-1">
                  {getIconoTipo(sugerencia.tipo)}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold text-gray-900">{sugerencia.descripcion}</h4>
                      <span
                        className={`px-2 py-0.5 text-xs font-medium rounded border ${getColorImpacto(
                          sugerencia.impacto
                        )}`}
                      >
                        Impacto {sugerencia.impacto}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{sugerencia.razon}</p>
                    <p className="text-sm font-medium text-gray-800">
                      <strong>Acción sugerida:</strong> {sugerencia.accion}
                    </p>
                  </div>
                </div>
              </div>

              {sugerencia.valores && (
                <div className="mt-3 p-3 bg-white rounded border border-slate-200">
                  <div className="grid grid-cols-3 gap-3 text-sm">
                    <div>
                      <div className="text-xs text-gray-500 mb-1">Valor Actual</div>
                      <div className="font-semibold text-gray-900">
                        {sugerencia.valores.actual.toFixed(1)}
                        {sugerencia.metrica === 'calorias' ? ' kcal' : 'g'}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 mb-1">Valor Recomendado</div>
                      <div className="font-semibold text-green-600">
                        {sugerencia.valores.recomendado.toFixed(1)}
                        {sugerencia.metrica === 'calorias' ? ' kcal' : 'g'}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 mb-1">Diferencia</div>
                      <div
                        className={`font-semibold ${
                          sugerencia.tipo === 'aumentar' ? 'text-green-600' : 'text-red-600'
                        }`}
                      >
                        {sugerencia.tipo === 'aumentar' ? '+' : '-'}
                        {Math.abs(sugerencia.valores.diferencia).toFixed(1)}
                        {sugerencia.metrica === 'calorias' ? ' kcal' : 'g'}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {sugerencia.ubicacion && (
                <div className="mt-2 text-xs text-gray-500">
                  {sugerencia.ubicacion.dias && (
                    <span>Días: {sugerencia.ubicacion.dias.map((d) => d.charAt(0).toUpperCase() + d.slice(1)).join(', ')}</span>
                  )}
                  {sugerencia.ubicacion.tiposComida && (
                    <span className="ml-2">
                      Tipos de comida: {sugerencia.ubicacion.tiposComida.map((t) => t.replace('-', ' ')).join(', ')}
                    </span>
                  )}
                </div>
              )}

              <div className="mt-3 flex justify-end gap-2">
                {/* USER STORY 2: Botón para simular impacto antes de aplicar */}
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    // Convertir SugerenciaAjuste a RecomendacionIA para la simulación
                    const recomendacion: RecomendacionIA = {
                      id: sugerencia.id,
                      tipo: sugerencia.tipo === 'aumentar' || sugerencia.tipo === 'reducir' 
                        ? 'ajuste-macros' 
                        : sugerencia.tipo === 'redistribuir' 
                        ? 'modificar-cantidad'
                        : 'ajuste-macros',
                      titulo: sugerencia.descripcion,
                      descripcion: sugerencia.razon,
                      razon: sugerencia.accion,
                      prioridad: sugerencia.impacto === 'alto' ? 'alta' : sugerencia.impacto === 'medio' ? 'media' : 'baja',
                      detalles: {
                        ajusteMacros: sugerencia.valores ? {
                          calorias: sugerencia.metrica === 'calorias' ? sugerencia.valores.diferencia : undefined,
                          proteinas: sugerencia.metrica === 'proteinas' ? sugerencia.valores.diferencia : undefined,
                          carbohidratos: sugerencia.metrica === 'carbohidratos' ? sugerencia.valores.diferencia : undefined,
                          grasas: sugerencia.metrica === 'grasas' ? sugerencia.valores.diferencia : undefined,
                        } : undefined,
                      },
                    };
                    setRecomendacionSimulacion(recomendacion);
                    setMostrarSimulador(true);
                  }}
                  leftIcon={<Calculator className="w-4 h-4" />}
                >
                  Simular Impacto
                </Button>
                {onAplicarAjuste && (
                  <Button
                    size="sm"
                    variant="primary"
                    onClick={() => onAplicarAjuste(sugerencia)}
                    leftIcon={<CheckCircle2 className="w-4 h-4" />}
                  >
                    Aplicar Ajuste
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* USER STORY 2: Simulador de Impacto */}
      {recomendacionSimulacion && (
        <SimuladorImpactoIA
          dieta={dieta}
          recomendacion={recomendacionSimulacion}
          isOpen={mostrarSimulador}
          onClose={() => {
            setMostrarSimulador(false);
            setRecomendacionSimulacion(null);
          }}
          onAplicar={(simulacion) => {
            // Si hay un callback para aplicar ajuste, llamarlo
            if (onAplicarAjuste) {
              const sugerencia = sugerencias.find(s => s.id === recomendacionSimulacion.id);
              if (sugerencia) {
                onAplicarAjuste(sugerencia);
              }
            }
            setMostrarSimulador(false);
            setRecomendacionSimulacion(null);
          }}
        />
      )}
    </Card>
  );
};

