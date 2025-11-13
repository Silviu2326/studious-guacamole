import React, { useState, useEffect } from 'react';
import { Card, Button, Badge } from '../../../components/componentsreutilizables';
import {
  Brain,
  Sparkles,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle2,
  Lightbulb,
  Loader2,
  X,
  ArrowRight,
  Target,
  BarChart3,
} from 'lucide-react';
import type { DayPlan, ContextoCliente, ResumenObjetivosProgreso } from '../types';

interface SelectedCell {
  cellId: string;
  column: string;
  row: number;
  value: string | number;
  day?: string;
  sessionId?: string;
  metadata?: {
    type: 'volume' | 'intensity' | 'duration' | 'series' | 'repetitions' | 'calories' | 'other';
    grupoMuscular?: string;
    ejercicio?: string;
  };
}

interface AISuggestion {
  id: string;
  tipo: 'aumentar' | 'disminuir' | 'optimizar' | 'revisar' | 'alerta';
  prioridad: 'alta' | 'media' | 'baja';
  titulo: string;
  descripcion: string;
  razonamiento: string;
  accion?: {
    tipo: 'aumentar_series' | 'aumentar_volumen' | 'ajustar_intensidad' | 'redistribuir' | 'revisar_grupo';
    valor?: number;
    unidad?: string;
    detalle?: string;
  };
  metricas?: {
    actual: number | string;
    recomendado: number | string;
    diferencia?: number;
    unidad?: string;
  };
  confianza: number; // 0-100
}

interface AIAnalysisPanelProps {
  selectedCells: SelectedCell[];
  weeklyPlan: Record<string, DayPlan>;
  weekDays: readonly string[];
  contextoCliente?: ContextoCliente;
  objetivosProgreso?: ResumenObjetivosProgreso;
  onApplySuggestion?: (suggestionId: string, action: AISuggestion['accion']) => void;
  onClose?: () => void;
}

export const AIAnalysisPanel: React.FC<AIAnalysisPanelProps> = ({
  selectedCells,
  weeklyPlan,
  weekDays,
  contextoCliente,
  objetivosProgreso,
  onApplySuggestion,
  onClose,
}) => {
  const [suggestions, setSuggestions] = useState<AISuggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [expandedSuggestion, setExpandedSuggestion] = useState<string | null>(null);

  useEffect(() => {
    if (selectedCells.length > 0) {
      analyzeSelectedCells();
    } else {
      setSuggestions([]);
    }
  }, [selectedCells, weeklyPlan, contextoCliente, objetivosProgreso]);

  const analyzeSelectedCells = async () => {
    setLoading(true);
    try {
      // Simular análisis de IA (en producción sería una llamada a API)
      await new Promise((resolve) => setTimeout(resolve, 1000 + Math.random() * 1000));
      
      const newSuggestions = generateSuggestionsFromCells(
        selectedCells,
        weeklyPlan,
        weekDays,
        contextoCliente,
        objetivosProgreso
      );
      
      setSuggestions(newSuggestions);
    } catch (error) {
      console.error('Error analizando celdas:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateSuggestionsFromCells = (
    cells: SelectedCell[],
    plan: Record<string, DayPlan>,
    days: readonly string[],
    contexto?: ContextoCliente,
    objetivos?: ResumenObjetivosProgreso
  ): AISuggestion[] => {
    const suggestions: AISuggestion[] = [];

    // Analizar volumen de grupos musculares
    const volumenPorGrupo: Record<string, { series: number; dias: Set<string> }> = {};
    
    days.forEach((day) => {
      const dayPlan = plan[day];
      dayPlan?.sessions.forEach((session) => {
        if (session.gruposMusculares) {
          session.gruposMusculares.forEach((grupo) => {
            if (!volumenPorGrupo[grupo]) {
              volumenPorGrupo[grupo] = { series: 0, dias: new Set() };
            }
            volumenPorGrupo[grupo].series += session.series || 0;
            volumenPorGrupo[grupo].dias.add(day);
          });
        }
      });
    });

    // Verificar si hay celdas relacionadas con volumen de piernas
    const celdasPiernas = cells.filter((cell) => 
      cell.metadata?.grupoMuscular === 'piernas' || 
      cell.metadata?.type === 'volume' ||
      (typeof cell.value === 'number' && cell.column === 'D') // Columna de volumen
    );

    if (celdasPiernas.length > 0) {
      const volumenPiernas = volumenPorGrupo['piernas']?.series || 0;
      const diasPiernas = volumenPorGrupo['piernas']?.dias.size || 0;
      
      // Para hipertrofia, se recomiendan al menos 10-20 series por grupo muscular por semana
      if (volumenPiernas < 10) {
        const diferencia = 12 - volumenPiernas; // Objetivo mínimo de 12 series
        suggestions.push({
          id: 'sug-1',
          tipo: 'aumentar',
          prioridad: 'alta',
          titulo: 'Volumen insuficiente de piernas para hipertrofia',
          descripcion: `El volumen actual de piernas (${volumenPiernas} series/semana) es insuficiente para estimular hipertrofia. Se recomienda un mínimo de 10-20 series por grupo muscular por semana.`,
          razonamiento: `Basado en la literatura científica sobre hipertrofia, se requieren al menos 10 series efectivas por grupo muscular por semana para generar adaptaciones. El volumen actual de ${volumenPiernas} series distribuidas en ${diasPiernas} día(s) está por debajo de este umbral.`,
          accion: {
            tipo: 'aumentar_series',
            valor: diferencia,
            unidad: 'series',
            detalle: 'Aumentar series de ejercicios de piernas en los días correspondientes',
          },
          metricas: {
            actual: volumenPiernas,
            recomendado: 12,
            diferencia: diferencia,
            unidad: 'series/semana',
          },
          confianza: 85,
        });
      }
    }

    // Analizar distribución de intensidad
    const celdasIntensidad = cells.filter((cell) => 
      cell.metadata?.type === 'intensity' || 
      cell.column === 'E' // Columna de intensidad
    );

    if (celdasIntensidad.length > 0) {
      const intensidades: number[] = [];
      days.forEach((day) => {
        const dayPlan = plan[day];
        dayPlan?.sessions.forEach((session) => {
          const intensityMatch = session.intensity?.match(/RPE\s*(\d+\.?\d*)/i);
          if (intensityMatch) {
            intensidades.push(parseFloat(intensityMatch[1]));
          }
        });
      });

      const promedioIntensidad = intensidades.length > 0 
        ? intensidades.reduce((a, b) => a + b, 0) / intensidades.length 
        : 0;

      if (promedioIntensidad > 8.5) {
        suggestions.push({
          id: 'sug-2',
          tipo: 'revisar',
          prioridad: 'alta',
          titulo: 'Intensidad promedio muy alta',
          descripcion: `La intensidad promedio (RPE ${promedioIntensidad.toFixed(1)}) es muy alta. Esto puede llevar a fatiga acumulada y riesgo de sobreentrenamiento.`,
          razonamiento: `Un RPE promedio superior a 8.5 indica una carga de entrenamiento muy alta que puede comprometer la recuperación y aumentar el riesgo de lesiones. Se recomienda incluir más días de recuperación activa o reducir la intensidad en algunos días.`,
          accion: {
            tipo: 'ajustar_intensidad',
            valor: 7.5,
            unidad: 'RPE',
            detalle: 'Reducir la intensidad promedio a RPE 7.5 mediante días de recuperación',
          },
          metricas: {
            actual: promedioIntensidad.toFixed(1),
            recomendado: '7.5',
            diferencia: promedioIntensidad - 7.5,
            unidad: 'RPE',
          },
          confianza: 90,
        });
      }
    }

    // Analizar balance de grupos musculares
    const gruposAnalizados = Object.keys(volumenPorGrupo);
    if (gruposAnalizados.length > 0) {
      const volumenes = Object.values(volumenPorGrupo).map(v => v.series);
      const maxVolumen = Math.max(...volumenes);
      const minVolumen = Math.min(...volumenes);
      const diferencia = maxVolumen - minVolumen;

      if (diferencia > 8) {
        const grupoBajo = Object.entries(volumenPorGrupo).find(([_, v]) => v.series === minVolumen)?.[0];
        if (grupoBajo) {
          suggestions.push({
            id: 'sug-3',
            tipo: 'optimizar',
            prioridad: 'media',
            titulo: `Desequilibrio en volumen: ${grupoBajo} está subdesarrollado`,
            descripcion: `Hay un desequilibrio significativo en el volumen de entrenamiento. El grupo ${grupoBajo} tiene ${minVolumen} series mientras que otros grupos tienen hasta ${maxVolumen} series.`,
            razonamiento: `Un desequilibrio de más de 8 series entre grupos musculares puede llevar a descompensaciones posturales y aumentar el riesgo de lesiones. Se recomienda equilibrar el volumen entre grupos musculares.`,
            accion: {
              tipo: 'aumentar_series',
              valor: Math.ceil(diferencia / 2),
              unidad: 'series',
              detalle: `Aumentar series de ejercicios para ${grupoBajo}`,
            },
            metricas: {
              actual: minVolumen,
              recomendado: maxVolumen - 4,
              diferencia: Math.ceil(diferencia / 2),
              unidad: 'series/semana',
            },
            confianza: 75,
          });
        }
      }
    }

    // Analizar objetivos del cliente
    if (objetivos && cells.some(c => c.metadata?.type === 'volume' || c.metadata?.type === 'series')) {
      const objetivosFuerza = objetivos.objetivos.filter(
        (o) => o.categoria === 'fuerza' && o.estado === 'in_progress'
      );
      
      if (objetivosFuerza.length > 0) {
        const objetivoPrincipal = objetivosFuerza[0];
        const progreso = objetivoPrincipal.progreso;
        
        if (progreso < 50) {
          suggestions.push({
            id: 'sug-4',
            tipo: 'optimizar',
            prioridad: 'media',
            titulo: `Progreso lento en objetivo de fuerza: ${objetivoPrincipal.titulo}`,
            descripcion: `El objetivo "${objetivoPrincipal.titulo}" tiene un progreso del ${progreso}%. Considera aumentar la frecuencia o intensidad del entrenamiento de fuerza.`,
            razonamiento: `Para objetivos de fuerza, se recomienda entrenar cada grupo muscular al menos 2 veces por semana con intensidad adecuada. El progreso actual del ${progreso}% sugiere que puede ser necesario aumentar el volumen o la frecuencia.`,
            accion: {
              tipo: 'aumentar_volumen',
              valor: 2,
              unidad: 'sesiones',
              detalle: 'Aumentar frecuencia de entrenamiento de fuerza a 2-3 veces por semana',
            },
            metricas: {
              actual: progreso,
              recomendado: 50,
              diferencia: 50 - progreso,
              unidad: '% progreso',
            },
            confianza: 70,
          });
        }
      }
    }

    // Analizar restricciones del cliente
    if (contexto && contexto.lesiones.some(l => l.estado === 'activa')) {
      const lesionesActivas = contexto.lesiones.filter(l => l.estado === 'activa');
      const gruposRiesgo = new Set<string>();
      
      lesionesActivas.forEach(lesion => {
        if (lesion.ubicacion.toLowerCase().includes('rodilla')) {
          gruposRiesgo.add('piernas');
        }
        if (lesion.ubicacion.toLowerCase().includes('hombro')) {
          gruposRiesgo.add('hombros');
        }
        if (lesion.ubicacion.toLowerCase().includes('espalda') || lesion.ubicacion.toLowerCase().includes('lumbar')) {
          gruposRiesgo.add('espalda');
        }
      });

      const celdasRiesgo = cells.filter(cell => 
        gruposRiesgo.has(cell.metadata?.grupoMuscular || '')
      );

      if (celdasRiesgo.length > 0) {
        suggestions.push({
          id: 'sug-5',
          tipo: 'alerta',
          prioridad: 'alta',
          titulo: 'Atención: Ejercicios seleccionados pueden afectar lesiones activas',
          descripcion: `Las celdas seleccionadas incluyen ejercicios para grupos musculares relacionados con lesiones activas del cliente. Revisa las restricciones antes de aplicar cambios.`,
          razonamiento: `El cliente tiene ${lesionesActivas.length} lesión(es) activa(s): ${lesionesActivas.map(l => l.nombre).join(', ')}. Los ejercicios seleccionados pueden necesitar adaptaciones o sustituciones.`,
          accion: {
            tipo: 'revisar_grupo',
            detalle: 'Revisar y adaptar ejercicios según restricciones del cliente',
          },
          confianza: 95,
        });
      }
    }

    return suggestions.sort((a, b) => {
      const prioridadOrder = { alta: 3, media: 2, baja: 1 };
      return prioridadOrder[b.prioridad] - prioridadOrder[a.prioridad];
    });
  };

  const handleApplySuggestion = (suggestion: AISuggestion) => {
    if (suggestion.accion && onApplySuggestion) {
      onApplySuggestion(suggestion.id, suggestion.accion);
    }
  };

  const getSuggestionIcon = (tipo: AISuggestion['tipo']) => {
    switch (tipo) {
      case 'aumentar':
        return <TrendingUp className="w-5 h-5" />;
      case 'disminuir':
        return <TrendingDown className="w-5 h-5" />;
      case 'optimizar':
        return <Target className="w-5 h-5" />;
      case 'revisar':
        return <AlertTriangle className="w-5 h-5" />;
      case 'alerta':
        return <AlertTriangle className="w-5 h-5" />;
      default:
        return <Lightbulb className="w-5 h-5" />;
    }
  };

  const getSuggestionColor = (tipo: AISuggestion['tipo'], prioridad: AISuggestion['prioridad']) => {
    if (tipo === 'alerta' || prioridad === 'alta') {
      return 'error';
    }
    if (tipo === 'optimizar' || prioridad === 'media') {
      return 'warning';
    }
    return 'info';
  };

  if (selectedCells.length === 0) {
    return null;
  }

  return (
    <Card className="p-6 border-l-4 border-l-indigo-500">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-100 rounded-lg">
            <Brain className="w-6 h-6 text-indigo-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Análisis de IA</h3>
            <p className="text-sm text-gray-600">
              {selectedCells.length} celda(s) seleccionada(s)
            </p>
          </div>
        </div>
        {onClose && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            leftIcon={<X className="w-4 h-4" />}
          />
        )}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-6 h-6 animate-spin text-indigo-600" />
          <span className="ml-2 text-sm text-gray-600">Analizando celdas seleccionadas...</span>
        </div>
      ) : suggestions.length === 0 ? (
        <div className="text-center py-8">
          <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-3" />
          <p className="text-sm text-gray-600">
            No se encontraron sugerencias para las celdas seleccionadas.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {suggestions.map((suggestion) => (
            <div
              key={suggestion.id}
              className={`p-4 rounded-lg border ${
                suggestion.prioridad === 'alta'
                  ? 'border-red-200 bg-red-50'
                  : suggestion.prioridad === 'media'
                  ? 'border-yellow-200 bg-yellow-50'
                  : 'border-blue-200 bg-blue-50'
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className={`text-${
                    getSuggestionColor(suggestion.tipo, suggestion.prioridad) === 'error'
                      ? 'red'
                      : getSuggestionColor(suggestion.tipo, suggestion.prioridad) === 'warning'
                      ? 'yellow'
                      : 'blue'
                  }-600`}>
                    {getSuggestionIcon(suggestion.tipo)}
                  </div>
                  <h4 className="font-semibold text-sm">{suggestion.titulo}</h4>
                </div>
                <Badge className={
                  suggestion.prioridad === 'alta'
                    ? 'bg-red-100 text-red-700'
                    : suggestion.prioridad === 'media'
                    ? 'bg-yellow-100 text-yellow-700'
                    : 'bg-blue-100 text-blue-700'
                }>
                  {suggestion.prioridad}
                </Badge>
              </div>
              
              <p className="text-sm mb-3 opacity-90">{suggestion.descripcion}</p>

              {suggestion.metricas && (
                <div className="mb-3 p-3 bg-white rounded border border-gray-200">
                  <div className="flex items-center gap-2 mb-2">
                    <BarChart3 className="w-4 h-4 text-gray-600" />
                    <span className="text-xs font-semibold text-gray-700">Métricas</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-gray-600">Actual:</span>
                      <span className="ml-1 font-semibold">{suggestion.metricas.actual} {suggestion.metricas.unidad}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Recomendado:</span>
                      <span className="ml-1 font-semibold text-green-600">
                        {suggestion.metricas.recomendado} {suggestion.metricas.unidad}
                      </span>
                    </div>
                    {suggestion.metricas.diferencia !== undefined && (
                      <div className="col-span-2">
                        <span className="text-gray-600">Diferencia:</span>
                        <span className={`ml-1 font-semibold ${
                          suggestion.metricas.diferencia > 0 ? 'text-red-600' : 'text-green-600'
                        }`}>
                          {suggestion.metricas.diferencia > 0 ? '+' : ''}{suggestion.metricas.diferencia} {suggestion.metricas.unidad}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              <button
                onClick={() => setExpandedSuggestion(
                  expandedSuggestion === suggestion.id ? null : suggestion.id
                )}
                className="text-xs text-indigo-600 hover:text-indigo-700 mb-3 flex items-center gap-1"
              >
                <Sparkles className="w-3 h-3" />
                {expandedSuggestion === suggestion.id ? 'Ocultar razonamiento' : 'Ver razonamiento'}
              </button>

              {expandedSuggestion === suggestion.id && (
                <div className="mb-3 p-3 bg-white rounded border border-gray-200">
                  <p className="text-xs text-gray-700 leading-relaxed">{suggestion.razonamiento}</p>
                  <div className="mt-2 flex items-center gap-2 text-xs">
                    <span className="text-gray-600">Confianza:</span>
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-indigo-500 h-2 rounded-full"
                        style={{ width: `${suggestion.confianza}%` }}
                      />
                    </div>
                    <span className="text-indigo-600 font-semibold">{suggestion.confianza}%</span>
                  </div>
                </div>
              )}

              {suggestion.accion && (
                <Button
                  variant="primary"
                  size="sm"
                  className="w-full"
                  onClick={() => handleApplySuggestion(suggestion)}
                  leftIcon={<ArrowRight className="w-4 h-4" />}
                >
                  {suggestion.accion.detalle || 'Aplicar sugerencia'}
                </Button>
              )}
            </div>
          ))}
        </div>
      )}
    </Card>
  );
};

