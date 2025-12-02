import { useState, useEffect } from 'react';
import { Card, Button, Select, Checkbox } from '../../../components/componentsreutilizables';
import { 
  Settings, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft, 
  Sparkles,
  TrendingUp,
  Activity,
  Dumbbell,
  Heart,
  StretchHorizontal,
  RotateCcw,
  BarChart3,
  Calculator,
  FileText,
  Lightbulb,
  X
} from 'lucide-react';
import type { 
  RespuestasCuestionario, 
  RolCoach, 
  PrioridadCoach, 
  TipoColumnas,
  PlantillaRecomendada 
} from '../types';
import { generarPlantillasRecomendadas } from '../utils/plantillasRecomendadas';

interface CuestionarioConfiguracionProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (respuestas: RespuestasCuestionario, plantillasRecomendadas: PlantillaRecomendada[]) => void;
  respuestasExistentes?: RespuestasCuestionario;
}

const ROLES: { value: RolCoach; label: string; icon: JSX.Element; descripcion: string }[] = [
  { 
    value: 'fuerza', 
    label: 'Fuerza', 
    icon: <Dumbbell className="w-5 h-5" />,
    descripcion: 'Enfoque en levantamiento de pesas y fuerza máxima'
  },
  { 
    value: 'hipertrofia', 
    label: 'Hipertrofia', 
    icon: <TrendingUp className="w-5 h-5" />,
    descripcion: 'Enfoque en crecimiento muscular y volumen'
  },
  { 
    value: 'cardio', 
    label: 'Cardio', 
    icon: <Heart className="w-5 h-5" />,
    descripcion: 'Enfoque en resistencia cardiovascular'
  },
  { 
    value: 'movilidad', 
    label: 'Movilidad', 
    icon: <StretchHorizontal className="w-5 h-5" />,
    descripcion: 'Enfoque en flexibilidad y movilidad'
  },
  { 
    value: 'rehabilitacion', 
    label: 'Rehabilitación', 
    icon: <Activity className="w-5 h-5" />,
    descripcion: 'Enfoque en recuperación y rehabilitación'
  },
  { 
    value: 'general', 
    label: 'General', 
    icon: <BarChart3 className="w-5 h-5" />,
    descripcion: 'Enfoque general y equilibrado'
  },
];

const PRIORIDADES: { value: PrioridadCoach; label: string; descripcion: string }[] = [
  { value: 'tonelaje', label: 'Tonelaje', descripcion: 'Seguimiento de peso total levantado' },
  { value: 'volumen', label: 'Volumen', descripcion: 'Número de series y repeticiones' },
  { value: 'intensidad', label: 'Intensidad', descripcion: 'Nivel de esfuerzo y RPE' },
  { value: 'movilidad', label: 'Movilidad', descripcion: 'Ejercicios de flexibilidad y movilidad' },
  { value: 'recuperacion', label: 'Recuperación', descripcion: 'Tiempo de descanso y recuperación' },
  { value: 'equilibrio', label: 'Equilibrio', descripcion: 'Balance entre diferentes aspectos' },
];

const COLUMNAS_DISPONIBLES: { value: TipoColumnas; label: string; descripcion: string }[] = [
  { value: 'tonelaje', label: 'Tonelaje', descripcion: 'Peso total levantado' },
  { value: 'volumen', label: 'Volumen', descripcion: 'Series y repeticiones' },
  { value: 'intensidad', label: 'Intensidad', descripcion: 'Nivel de esfuerzo' },
  { value: 'movilidad', label: 'Movilidad', descripcion: 'Ejercicios de movilidad' },
  { value: 'recuperacion', label: 'Recuperación', descripcion: 'Tiempo de descanso' },
  { value: 'duracion', label: 'Duración', descripcion: 'Tiempo de sesión' },
  { value: 'calorias', label: 'Calorías', descripcion: 'Calorías estimadas' },
  { value: 'rpe', label: 'RPE', descripcion: 'Escala de esfuerzo percibido' },
  { value: 'series', label: 'Series', descripcion: 'Número de series' },
  { value: 'repeticiones', label: 'Repeticiones', descripcion: 'Número de repeticiones' },
];

export function CuestionarioConfiguracion({ 
  isOpen, 
  onClose, 
  onComplete,
  respuestasExistentes 
}: CuestionarioConfiguracionProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [respuestas, setRespuestas] = useState<RespuestasCuestionario>(() => {
    if (respuestasExistentes) {
      return respuestasExistentes;
    }
    return {
      rol: 'general',
      prioridades: [],
      columnasPreferidas: [],
      enfasisTonelaje: false,
      enfasisMovilidad: false,
      enfasisRecuperacion: false,
      calculosNecesarios: {
        tonelajeTotal: false,
        volumenTotal: false,
        intensidadPromedio: false,
        caloriasEstimadas: false,
        rpePromedio: false,
      },
      resumenesNecesarios: {
        resumenSemanal: true,
        resumenDiario: false,
        resumenPorModalidad: false,
        resumenPorIntensidad: false,
      },
    };
  });

  const [plantillasRecomendadas, setPlantillasRecomendadas] = useState<PlantillaRecomendada[]>([]);

  const totalSteps = 4;

  useEffect(() => {
    if (currentStep === totalSteps) {
      // Generar plantillas recomendadas cuando se completa el cuestionario
      const plantillas = generarPlantillasRecomendadas(respuestas);
      setPlantillasRecomendadas(plantillas);
    }
  }, [currentStep, respuestas]);

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    const respuestasCompletas: RespuestasCuestionario = {
      ...respuestas,
      fechaCompletado: respuestas.fechaCompletado || new Date().toISOString(),
      fechaUltimaModificacion: new Date().toISOString(),
    };
    onComplete(respuestasCompletas, plantillasRecomendadas);
  };

  const canAdvance = () => {
    switch (currentStep) {
      case 1:
        return respuestas.rol !== undefined;
      case 2:
        return respuestas.prioridades.length > 0;
      case 3:
        return respuestas.columnasPreferidas.length > 0;
      case 4:
        return true;
      default:
        return false;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto m-4">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-100 dark:bg-indigo-900 rounded-lg">
                <Settings className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {respuestasExistentes ? 'Reabrir Cuestionario' : 'Configuración de Layout'}
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Personaliza tu vista según tu rol y prioridades
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Paso {currentStep} de {totalSteps}
              </span>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {Math.round((currentStep / totalSteps) * 100)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div
                className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(currentStep / totalSteps) * 100}%` }}
              />
            </div>
          </div>

          {/* Step Content */}
          <div className="mb-6 min-h-[400px]">
            {/* Step 1: Rol */}
            {currentStep === 1 && (
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    ¿Cuál es tu rol principal como coach?
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    Esto ayudará a personalizar las columnas y cálculos para tu tipo de entrenamiento.
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {ROLES.map((rol) => (
                    <button
                      key={rol.value}
                      onClick={() => setRespuestas({ ...respuestas, rol: rol.value })}
                      className={`p-4 rounded-lg border-2 transition-all text-left ${
                        respuestas.rol === rol.value
                          ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20'
                          : 'border-gray-200 dark:border-gray-700 hover:border-indigo-300'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`p-2 rounded-lg ${
                          respuestas.rol === rol.value
                            ? 'bg-indigo-100 dark:bg-indigo-800'
                            : 'bg-gray-100 dark:bg-gray-800'
                        }`}>
                          {rol.icon}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900 dark:text-white">
                            {rol.label}
                          </h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            {rol.descripcion}
                          </p>
                        </div>
                        {respuestas.rol === rol.value && (
                          <CheckCircle2 className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 2: Prioridades */}
            {currentStep === 2 && (
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    ¿Cuáles son tus prioridades principales?
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    Selecciona todas las que apliquen. Esto influirá en las plantillas recomendadas.
                  </p>
                </div>
                <div className="space-y-3">
                  {PRIORIDADES.map((prioridad) => {
                    const isSelected = respuestas.prioridades.includes(prioridad.value);
                    return (
                      <label
                        key={prioridad.value}
                        className={`flex items-start gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                          isSelected
                            ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20'
                            : 'border-gray-200 dark:border-gray-700 hover:border-indigo-300'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setRespuestas({
                                ...respuestas,
                                prioridades: [...respuestas.prioridades, prioridad.value],
                              });
                            } else {
                              setRespuestas({
                                ...respuestas,
                                prioridades: respuestas.prioridades.filter((p) => p !== prioridad.value),
                              });
                            }
                          }}
                          className="mt-1 w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                        />
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900 dark:text-white">
                            {prioridad.label}
                          </h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            {prioridad.descripcion}
                          </p>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Step 3: Columnas */}
            {currentStep === 3 && (
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    ¿Qué columnas necesitas en tu vista?
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    Selecciona las columnas que quieres ver en tu layout. Puedes seleccionar múltiples.
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {COLUMNAS_DISPONIBLES.map((columna) => {
                    const isSelected = respuestas.columnasPreferidas.includes(columna.value);
                    return (
                      <label
                        key={columna.value}
                        className={`flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all ${
                          isSelected
                            ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20'
                            : 'border-gray-200 dark:border-gray-700 hover:border-indigo-300'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setRespuestas({
                                ...respuestas,
                                columnasPreferidas: [...respuestas.columnasPreferidas, columna.value],
                              });
                            } else {
                              setRespuestas({
                                ...respuestas,
                                columnasPreferidas: respuestas.columnasPreferidas.filter(
                                  (c) => c !== columna.value
                                ),
                              });
                            }
                          }}
                          className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                        />
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900 dark:text-white">
                            {columna.label}
                          </h4>
                          <p className="text-xs text-gray-600 dark:text-gray-400">
                            {columna.descripcion}
                          </p>
                        </div>
                      </label>
                    );
                  })}
                </div>

                {/* Opciones de énfasis */}
                <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
                    Opciones de énfasis
                  </h4>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={respuestas.enfasisTonelaje}
                        onChange={(e) =>
                          setRespuestas({ ...respuestas, enfasisTonelaje: e.target.checked })
                        }
                        className="w-4 h-4 text-indigo-600 border-gray-300 rounded"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        Más columnas de tonelaje
                      </span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={respuestas.enfasisMovilidad}
                        onChange={(e) =>
                          setRespuestas({ ...respuestas, enfasisMovilidad: e.target.checked })
                        }
                        className="w-4 h-4 text-indigo-600 border-gray-300 rounded"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        Menos columnas de movilidad
                      </span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={respuestas.enfasisRecuperacion}
                        onChange={(e) =>
                          setRespuestas({ ...respuestas, enfasisRecuperacion: e.target.checked })
                        }
                        className="w-4 h-4 text-indigo-600 border-gray-300 rounded"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        Enfoque en recuperación
                      </span>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Cálculos y Resúmenes */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    Cálculos y Resúmenes
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    Selecciona qué cálculos y resúmenes quieres que se generen automáticamente.
                  </p>
                </div>

                {/* Cálculos */}
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                    <Calculator className="w-5 h-5" />
                    Cálculos Automáticos
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {Object.entries(respuestas.calculosNecesarios).map(([key, value]) => (
                      <label
                        key={key}
                        className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-indigo-300 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={value}
                          onChange={(e) =>
                            setRespuestas({
                              ...respuestas,
                              calculosNecesarios: {
                                ...respuestas.calculosNecesarios,
                                [key]: e.target.checked,
                              },
                            })
                          }
                          className="w-4 h-4 text-indigo-600 border-gray-300 rounded"
                        />
                        <span className="text-sm text-gray-700 dark:text-gray-300">
                          {key
                            .replace(/([A-Z])/g, ' $1')
                            .replace(/^./, (str) => str.toUpperCase())
                            .replace('Tonelaje Total', 'Tonelaje Total')
                            .replace('Volumen Total', 'Volumen Total')
                            .replace('Intensidad Promedio', 'Intensidad Promedio')
                            .replace('Calorias Estimadas', 'Calorías Estimadas')
                            .replace('Rpe Promedio', 'RPE Promedio')}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Resúmenes */}
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    Resúmenes
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {Object.entries(respuestas.resumenesNecesarios).map(([key, value]) => (
                      <label
                        key={key}
                        className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-indigo-300 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={value}
                          onChange={(e) =>
                            setRespuestas({
                              ...respuestas,
                              resumenesNecesarios: {
                                ...respuestas.resumenesNecesarios,
                                [key]: e.target.checked,
                              },
                            })
                          }
                          className="w-4 h-4 text-indigo-600 border-gray-300 rounded"
                        />
                        <span className="text-sm text-gray-700 dark:text-gray-300">
                          {key
                            .replace(/([A-Z])/g, ' $1')
                            .replace(/^./, (str) => str.toUpperCase())
                            .replace('Resumen Semanal', 'Resumen Semanal')
                            .replace('Resumen Diario', 'Resumen Diario')
                            .replace('Resumen Por Modalidad', 'Resumen por Modalidad')
                            .replace('Resumen Por Intensidad', 'Resumen por Intensidad')}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Plantillas Recomendadas Preview */}
                {plantillasRecomendadas.length > 0 && (
                  <div className="mt-6 p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg">
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                      <Lightbulb className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                      Plantillas Recomendadas
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                      Basado en tus respuestas, te recomendamos estas plantillas:
                    </p>
                    <div className="space-y-2">
                      {plantillasRecomendadas.slice(0, 3).map((plantilla) => (
                        <div
                          key={plantilla.id}
                          className="p-3 bg-white dark:bg-gray-800 rounded-lg border border-indigo-200 dark:border-indigo-800"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h5 className="font-medium text-gray-900 dark:text-white">
                                {plantilla.nombre}
                              </h5>
                              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                                {plantilla.razon}
                              </p>
                            </div>
                            <span className="text-xs font-medium text-indigo-600 dark:text-indigo-400">
                              {plantilla.relevancia}% match
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between pt-6 border-t border-gray-200 dark:border-gray-700">
            <Button
              variant="ghost"
              onClick={currentStep === 1 ? onClose : handlePrevious}
              leftIcon={<ArrowLeft className="w-4 h-4" />}
            >
              {currentStep === 1 ? 'Cancelar' : 'Anterior'}
            </Button>
            <div className="flex gap-2">
              {currentStep < totalSteps ? (
                <Button
                  variant="primary"
                  onClick={handleNext}
                  disabled={!canAdvance()}
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                >
                  Siguiente
                </Button>
              ) : (
                <Button
                  variant="primary"
                  onClick={handleComplete}
                  leftIcon={<CheckCircle2 className="w-4 h-4" />}
                >
                  {respuestasExistentes ? 'Actualizar Configuración' : 'Completar'}
                </Button>
              )}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

