import React, { useState, useEffect } from 'react';
import { Card, Button, Modal } from '../../../components/componentsreutilizables';
import { 
  FileSpreadsheet, 
  CheckCircle2, 
  AlertCircle,
  ChevronRight,
  Settings,
  RefreshCcw
} from 'lucide-react';
import type {
  TipoMetricaExcel,
  NivelDetalle,
  FocoCliente,
  RespuestaCuestionarioMetodologia,
} from '../types';
import {
  getCuestionarioMetodologia,
  guardarCuestionarioMetodologia,
  regenerarConfiguracionExcel,
} from '../api/cuestionarioMetodologia';
import { SugerenciaPlantillas } from './SugerenciaPlantillas';

interface CuestionarioMetodologiaProps {
  dietistaId: string;
  onCompletado?: (cuestionario: RespuestaCuestionarioMetodologia) => void;
  onCancelar?: () => void;
  modoReapertura?: boolean; // Si es true, permite reabrir y modificar
}

const METRICAS_DISPONIBLES: { id: TipoMetricaExcel; label: string; descripcion: string }[] = [
  { id: 'calorias', label: 'Calorías', descripcion: 'Total de calorías por comida' },
  { id: 'proteinas', label: 'Proteínas', descripcion: 'Gramos de proteína' },
  { id: 'carbohidratos', label: 'Carbohidratos', descripcion: 'Gramos de carbohidratos' },
  { id: 'grasas', label: 'Grasas', descripcion: 'Gramos de grasas' },
  { id: 'fibra', label: 'Fibra', descripcion: 'Gramos de fibra dietética' },
  { id: 'azucares', label: 'Azúcares', descripcion: 'Gramos de azúcares' },
  { id: 'sodio', label: 'Sodio', descripcion: 'Miligramos de sodio' },
  { id: 'ratio-proteina', label: 'Ratio Proteína/kg', descripcion: 'Proteína por kilogramo de peso' },
  { id: 'vasos-agua', label: 'Vasos de Agua', descripcion: 'Cantidad de agua recomendada' },
  { id: 'adherencia', label: 'Adherencia', descripcion: 'Porcentaje de cumplimiento' },
  { id: 'tiempo-preparacion', label: 'Tiempo de Preparación', descripcion: 'Minutos de preparación' },
  { id: 'coste', label: 'Coste', descripcion: 'Coste estimado en euros' },
  { id: 'satisfaccion-prevista', label: 'Satisfacción Prevista', descripcion: 'Satisfacción prevista del cliente (1-5 o 0-100)' },
];

const NIVELES_DETALLE: { id: NivelDetalle; label: string; descripcion: string }[] = [
  { 
    id: 'basico', 
    label: 'Básico', 
    descripcion: 'Solo métricas esenciales (calorías, macros básicos)' 
  },
  { 
    id: 'intermedio', 
    label: 'Intermedio', 
    descripcion: 'Incluye fibra, azúcares y métricas adicionales' 
  },
  { 
    id: 'avanzado', 
    label: 'Avanzado', 
    descripcion: 'Métricas detalladas incluyendo ratios y sodio' 
  },
  { 
    id: 'completo', 
    label: 'Completo', 
    descripcion: 'Todas las métricas disponibles incluyendo coste y tiempo' 
  },
];

const FOCOS_CLIENTE: { id: FocoCliente; label: string; descripcion: string }[] = [
  { id: 'perdida-peso', label: 'Pérdida de Peso', descripcion: 'Enfoque en déficit calórico' },
  { id: 'ganancia-muscular', label: 'Ganancia Muscular', descripcion: 'Enfoque en proteínas y superávit' },
  { id: 'rendimiento', label: 'Rendimiento Deportivo', descripcion: 'Optimización para actividad física' },
  { id: 'salud-general', label: 'Salud General', descripcion: 'Equilibrio nutricional general' },
  { id: 'deficit-calorico', label: 'Déficit Calórico', descripcion: 'Control estricto de calorías' },
  { id: 'superavit-calorico', label: 'Superávit Calórico', descripcion: 'Aumento controlado de calorías' },
  { id: 'mantenimiento', label: 'Mantenimiento', descripcion: 'Mantener peso y composición actual' },
  { id: 'flexibilidad', label: 'Flexibilidad', descripcion: 'Enfoque flexible y adaptable' },
];

export const CuestionarioMetodologia: React.FC<CuestionarioMetodologiaProps> = ({
  dietistaId,
  onCompletado,
  onCancelar,
  modoReapertura = false,
}) => {
  const [pasoActual, setPasoActual] = useState(1);
  const [metricasSeleccionadas, setMetricasSeleccionadas] = useState<TipoMetricaExcel[]>([]);
  const [nivelDetalle, setNivelDetalle] = useState<NivelDetalle>('intermedio');
  const [focoCliente, setFocoCliente] = useState<FocoCliente[]>([]);
  const [cargando, setCargando] = useState(false);
  const [cuestionarioExistente, setCuestionarioExistente] = useState<RespuestaCuestionarioMetodologia | null>(null);
  const [cuestionarioCompletado, setCuestionarioCompletado] = useState<RespuestaCuestionarioMetodologia | null>(null);
  const [mostrarSugerencias, setMostrarSugerencias] = useState(false);

  useEffect(() => {
    // Cargar cuestionario existente si está en modo reapertura
    if (modoReapertura) {
      getCuestionarioMetodologia(dietistaId).then((cuestionario) => {
        if (cuestionario) {
          setCuestionarioExistente(cuestionario);
          setMetricasSeleccionadas(cuestionario.metricas);
          setNivelDetalle(cuestionario.nivelDetalle);
          setFocoCliente(cuestionario.focoCliente);
        }
      });
    }
  }, [dietistaId, modoReapertura]);

  const toggleMetrica = (metrica: TipoMetricaExcel) => {
    setMetricasSeleccionadas((prev) =>
      prev.includes(metrica)
        ? prev.filter((m) => m !== metrica)
        : [...prev, metrica]
    );
  };

  const toggleFocoCliente = (foco: FocoCliente) => {
    setFocoCliente((prev) =>
      prev.includes(foco)
        ? prev.filter((f) => f !== foco)
        : [...prev, foco]
    );
  };

  const handleSiguiente = () => {
    if (pasoActual < 3) {
      setPasoActual(pasoActual + 1);
    }
  };

  const handleAnterior = () => {
    if (pasoActual > 1) {
      setPasoActual(pasoActual - 1);
    }
  };

  const handleCompletar = async () => {
    setCargando(true);
    try {
      const cuestionario = await guardarCuestionarioMetodologia({
        dietistaId,
        metricas: metricasSeleccionadas,
        nivelDetalle,
        focoCliente,
        columnasExcel: [], // Se generará automáticamente
        formulasPersonalizadas: {}, // Se generará automáticamente
      });

      setCuestionarioCompletado(cuestionario);
      setMostrarSugerencias(true);

      // Si hay callback, llamarlo después de mostrar sugerencias
      // (el usuario puede aplicar una plantilla antes de cerrar)
    } catch (error) {
      console.error('Error guardando cuestionario:', error);
      alert('Error al guardar el cuestionario. Por favor, intenta de nuevo.');
    } finally {
      setCargando(false);
    }
  };

  const handleAplicarPlantilla = (cuestionarioActualizado: RespuestaCuestionarioMetodologia) => {
    setCuestionarioCompletado(cuestionarioActualizado);
    setMetricasSeleccionadas(cuestionarioActualizado.metricas);
    // Actualizar el cuestionario existente también
    setCuestionarioExistente(cuestionarioActualizado);
    
    if (onCompletado) {
      onCompletado(cuestionarioActualizado);
    }
  };

  const handleCerrarSugerencias = () => {
    setMostrarSugerencias(false);
    if (onCompletado && cuestionarioCompletado) {
      onCompletado(cuestionarioCompletado);
    }
  };

  const handleRegenerar = async () => {
    setCargando(true);
    try {
      const cuestionarioRegenerado = await regenerarConfiguracionExcel(dietistaId);
      if (onCompletado) {
        onCompletado(cuestionarioRegenerado);
      }
    } catch (error) {
      console.error('Error regenerando configuración:', error);
      alert('Error al regenerar la configuración. Por favor, intenta de nuevo.');
    } finally {
      setCargando(false);
    }
  };

  const renderPaso1 = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          ¿Qué métricas quieres incluir en tu vista Excel?
        </h3>
        <p className="text-sm text-gray-600 mb-4">
          Selecciona las métricas que son importantes para tu metodología de trabajo.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {METRICAS_DISPONIBLES.map((metrica) => {
          const seleccionada = metricasSeleccionadas.includes(metrica.id);
          return (
            <button
              key={metrica.id}
              onClick={() => toggleMetrica(metrica.id)}
              className={[
                'p-4 rounded-lg border-2 text-left transition-all',
                seleccionada
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300 bg-white',
              ].join(' ')}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="font-medium text-gray-900">{metrica.label}</div>
                  <div className="text-sm text-gray-600 mt-1">{metrica.descripcion}</div>
                </div>
                {seleccionada && (
                  <CheckCircle2 className="w-5 h-5 text-blue-500 flex-shrink-0 ml-2" />
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );

  const renderPaso2 = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          ¿Qué nivel de detalle prefieres?
        </h3>
        <p className="text-sm text-gray-600 mb-4">
          El nivel de detalle determinará qué columnas se mostrarán por defecto en tu vista Excel.
        </p>
      </div>
      <div className="space-y-3">
        {NIVELES_DETALLE.map((nivel) => (
          <button
            key={nivel.id}
            onClick={() => setNivelDetalle(nivel.id)}
            className={[
              'w-full p-4 rounded-lg border-2 text-left transition-all',
              nivelDetalle === nivel.id
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300 bg-white',
            ].join(' ')}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="font-medium text-gray-900">{nivel.label}</div>
                <div className="text-sm text-gray-600 mt-1">{nivel.descripcion}</div>
              </div>
              {nivelDetalle === nivel.id && (
                <CheckCircle2 className="w-5 h-5 text-blue-500 flex-shrink-0 ml-2" />
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  );

  const renderPaso3 = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          ¿Cuál es el foco principal de tus clientes?
        </h3>
        <p className="text-sm text-gray-600 mb-4">
          Selecciona uno o más focos. Esto ayudará a personalizar las fórmulas y columnas.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {FOCOS_CLIENTE.map((foco) => {
          const seleccionado = focoCliente.includes(foco.id);
          return (
            <button
              key={foco.id}
              onClick={() => toggleFocoCliente(foco.id)}
              className={[
                'p-4 rounded-lg border-2 text-left transition-all',
                seleccionado
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300 bg-white',
              ].join(' ')}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="font-medium text-gray-900">{foco.label}</div>
                  <div className="text-sm text-gray-600 mt-1">{foco.descripcion}</div>
                </div>
                {seleccionado && (
                  <CheckCircle2 className="w-5 h-5 text-blue-500 flex-shrink-0 ml-2" />
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );

  const puedeContinuar = () => {
    switch (pasoActual) {
      case 1:
        return metricasSeleccionadas.length > 0;
      case 2:
        return nivelDetalle !== null;
      case 3:
        return focoCliente.length > 0;
      default:
        return false;
    }
  };

  return (
    <Modal
      isOpen={true}
      onClose={onCancelar || (() => {})}
      title={
        <div className="flex items-center gap-2">
          <FileSpreadsheet className="w-5 h-5 text-blue-600" />
          <span>
            {modoReapertura ? 'Reabrir Cuestionario de Metodología' : 'Configurar Vista Excel'}
          </span>
        </div>
      }
      size="lg"
    >
      <div className="space-y-6">
        {/* Indicador de progreso */}
        <div className="flex items-center justify-between mb-6">
          {[1, 2, 3].map((paso) => (
            <React.Fragment key={paso}>
              <div className="flex items-center">
                <div
                  className={[
                    'w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm',
                    paso <= pasoActual
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-600',
                  ].join(' ')}
                >
                  {paso}
                </div>
                <div className="ml-2 text-sm font-medium text-gray-700">
                  {paso === 1 && 'Métricas'}
                  {paso === 2 && 'Detalle'}
                  {paso === 3 && 'Foco'}
                </div>
              </div>
              {paso < 3 && (
                <ChevronRight className="w-5 h-5 text-gray-400 mx-2" />
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Contenido del paso actual */}
        <div className="min-h-[400px]">
          {mostrarSugerencias && cuestionarioCompletado ? (
            <div className="space-y-4">
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center gap-2 text-green-800">
                  <CheckCircle2 className="w-5 h-5" />
                  <span className="font-medium">Cuestionario completado exitosamente</span>
                </div>
                <p className="text-sm text-green-700 mt-1">
                  Basándonos en tus respuestas, te sugerimos las siguientes plantillas:
                </p>
              </div>
              <SugerenciaPlantillas
                cuestionario={cuestionarioCompletado}
                onAplicarPlantilla={handleAplicarPlantilla}
                onCerrar={handleCerrarSugerencias}
              />
            </div>
          ) : (
            <>
              {pasoActual === 1 && renderPaso1()}
              {pasoActual === 2 && renderPaso2()}
              {pasoActual === 3 && renderPaso3()}
            </>
          )}
        </div>

        {/* Botones de navegación */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
          <div>
            {pasoActual > 1 && (
              <Button variant="secondary" onClick={handleAnterior}>
                Anterior
              </Button>
            )}
          </div>
          <div className="flex items-center gap-2">
            {onCancelar && (
              <Button variant="ghost" onClick={onCancelar}>
                Cancelar
              </Button>
            )}
            {mostrarSugerencias ? (
              <Button
                onClick={handleCerrarSugerencias}
                variant="primary"
              >
                Continuar
              </Button>
            ) : pasoActual < 3 ? (
              <Button
                onClick={handleSiguiente}
                disabled={!puedeContinuar()}
                rightIcon={<ChevronRight className="w-4 h-4" />}
              >
                Siguiente
              </Button>
            ) : (
              <>
                {modoReapertura && cuestionarioExistente && (
                  <Button
                    variant="secondary"
                    onClick={handleRegenerar}
                    disabled={cargando}
                    leftIcon={<RefreshCcw className="w-4 h-4" />}
                  >
                    Regenerar Layout
                  </Button>
                )}
                <Button
                  onClick={handleCompletar}
                  disabled={!puedeContinuar() || cargando}
                  leftIcon={<CheckCircle2 className="w-4 h-4" />}
                >
                  {cargando ? 'Guardando...' : modoReapertura ? 'Actualizar Configuración' : 'Completar'}
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
};

