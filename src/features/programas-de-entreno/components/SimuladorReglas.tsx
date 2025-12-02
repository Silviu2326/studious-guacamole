/**
 * Componente para simular reglas y ver métricas antes de aplicarlas
 * User Story: Como coach quiero simular el resultado de un conjunto de reglas y ver métricas antes de aplicarlas,
 * para anticipar cambios en volumen total, calorías o balance de intensidades.
 */

import { useState, useEffect, useMemo } from 'react';
import {
  Play,
  TrendingUp,
  TrendingDown,
  Minus,
  BarChart3,
  CheckCircle2,
  AlertCircle,
  X,
  Save,
  RefreshCw,
} from 'lucide-react';
import { Button, Card, Modal, Badge, Select } from '../../../components/componentsreutilizables';
import { obtenerReglasEncadenadas } from '../utils/chainedRules';
import { simularReglas } from '../utils/ruleSimulation';
import type {
  DayPlan,
  ReglaEncadenada,
  ResultadoSimulacion,
  ContextoCliente,
} from '../types';

interface SimuladorReglasProps {
  weeklyPlan: Record<string, DayPlan>;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAplicarSimulacion?: (resultado: ResultadoSimulacion) => void;
  contextoCliente?: ContextoCliente;
  programaId?: string;
  clienteId?: string;
}

export function SimuladorReglas({
  weeklyPlan,
  open,
  onOpenChange,
  contextoCliente,
  programaId,
  clienteId,
  onAplicarSimulacion,
}: SimuladorReglasProps) {
  const [reglasDisponibles, setReglasDisponibles] = useState<ReglaEncadenada[]>([]);
  const [reglasSeleccionadas, setReglasSeleccionadas] = useState<string[]>([]);
  const [resultadoSimulacion, setResultadoSimulacion] = useState<ResultadoSimulacion | null>(null);
  const [cargando, setCargando] = useState(false);

  useEffect(() => {
    if (open) {
      const reglas = obtenerReglasEncadenadas().filter((r) => r.activa);
      setReglasDisponibles(reglas);
      setReglasSeleccionadas([]);
      setResultadoSimulacion(null);
    }
  }, [open]);

  const handleToggleRegla = (reglaId: string) => {
    setReglasSeleccionadas((prev) =>
      prev.includes(reglaId) ? prev.filter((id) => id !== reglaId) : [...prev, reglaId]
    );
  };

  const handleSimular = () => {
    if (reglasSeleccionadas.length === 0) {
      alert('Selecciona al menos una regla para simular');
      return;
    }

    setCargando(true);
    try {
      const resultado = simularReglas(
        weeklyPlan,
        reglasSeleccionadas,
        contextoCliente,
        programaId,
        clienteId
      );
      setResultadoSimulacion(resultado);
    } catch (error) {
      console.error('Error en simulación:', error);
      alert('Error al simular las reglas');
    } finally {
      setCargando(false);
    }
  };

  const handleAplicar = () => {
    if (resultadoSimulacion && onAplicarSimulacion) {
      onAplicarSimulacion(resultadoSimulacion);
      onOpenChange(false);
    }
  };

  const handleReset = () => {
    setReglasSeleccionadas([]);
    setResultadoSimulacion(null);
  };

  return (
    <Modal
      isOpen={open}
      onClose={() => onOpenChange(false)}
      title="Simulador de Reglas"
      size="lg"
    >
      <div className="space-y-6">
        {/* Selección de reglas */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-3">
            Selecciona las reglas a simular
          </h3>
          {reglasDisponibles.length === 0 ? (
            <Card className="p-6 text-center">
              <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-600">No hay reglas activas disponibles</p>
            </Card>
          ) : (
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {reglasDisponibles.map((regla) => (
                <Card
                  key={regla.id}
                  className={`p-4 cursor-pointer transition-colors ${
                    reglasSeleccionadas.includes(regla.id)
                      ? 'border-indigo-500 bg-indigo-50'
                      : 'hover:bg-gray-50'
                  }`}
                  onClick={() => handleToggleRegla(regla.id)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <input
                          type="checkbox"
                          checked={reglasSeleccionadas.includes(regla.id)}
                          onChange={() => handleToggleRegla(regla.id)}
                          className="rounded"
                        />
                        <h4 className="font-semibold text-gray-900">{regla.nombre}</h4>
                        <Badge variant="info">Prioridad: {regla.prioridad}</Badge>
                      </div>
                      <p className="text-sm text-gray-600">{regla.descripcion}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Botón de simulación */}
        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={handleReset} disabled={cargando}>
            <RefreshCw size={16} className="mr-2" />
            Resetear
          </Button>
          <Button
            onClick={handleSimular}
            disabled={reglasSeleccionadas.length === 0 || cargando}
          >
            <Play size={16} className="mr-2" />
            {cargando ? 'Simulando...' : 'Simular'}
          </Button>
        </div>

        {/* Resultados de la simulación */}
        {resultadoSimulacion && (
          <div className="space-y-4 border-t pt-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Resultados de la Simulación</h3>
              <Badge variant="success">
                {resultadoSimulacion.reglasAplicadas.length} regla(s) aplicada(s)
              </Badge>
            </div>

            {/* Métricas comparativas */}
            <MetricasComparativas resultado={resultadoSimulacion} />

            {/* Reglas aplicadas */}
            {resultadoSimulacion.reglasAplicadas.length > 0 && (
              <Card className="p-4">
                <h4 className="font-semibold text-gray-900 mb-3">Reglas Aplicadas</h4>
                <div className="space-y-2">
                  {resultadoSimulacion.reglasAplicadas.map((regla) => (
                    <div key={regla.reglaId} className="flex items-center justify-between text-sm">
                      <span className="text-gray-700">{regla.reglaNombre}</span>
                      <Badge variant="info">{regla.sesionesModificadas} sesiones</Badge>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* Acciones */}
            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                <X size={16} className="mr-2" />
                Cerrar
              </Button>
              {onAplicarSimulacion && (
                <Button onClick={handleAplicar}>
                  <Save size={16} className="mr-2" />
                  Aplicar Cambios
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}

function MetricasComparativas({ resultado }: { resultado: ResultadoSimulacion }) {
  const { metricasOriginales, metricasSimuladas, diferencias } = resultado;

  const MetricCard = ({
    titulo,
    valorOriginal,
    valorSimulado,
    diferencia,
    unidad,
    formato = (v: number) => v.toFixed(0),
  }: {
    titulo: string;
    valorOriginal: number;
    valorSimulado: number;
    diferencia: number;
    unidad: string;
    formato?: (v: number) => string;
  }) => {
    const cambio = diferencia;
    const cambioPorcentual =
      valorOriginal !== 0 ? ((cambio / valorOriginal) * 100).toFixed(1) : '0.0';

    return (
      <Card className="p-4">
        <h4 className="text-sm font-semibold text-gray-700 mb-3">{titulo}</h4>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Original:</span>
            <span className="font-semibold text-gray-900">
              {formato(valorOriginal)} {unidad}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Simulado:</span>
            <span className="font-semibold text-indigo-600">
              {formato(valorSimulado)} {unidad}
            </span>
          </div>
          <div className="flex items-center justify-between pt-2 border-t">
            <span className="text-sm font-medium text-gray-700">Cambio:</span>
            <div className="flex items-center gap-2">
              {cambio !== 0 ? (
                cambio > 0 ? (
                  <TrendingUp size={16} className="text-green-600" />
                ) : (
                  <TrendingDown size={16} className="text-red-600" />
                )
              ) : (
                <Minus size={16} className="text-gray-400" />
              )}
              <span
                className={`font-semibold ${
                  cambio > 0 ? 'text-green-600' : cambio < 0 ? 'text-red-600' : 'text-gray-600'
                }`}
              >
                {cambio > 0 ? '+' : ''}
                {formato(cambio)} {unidad} ({cambioPorcentual}%)
              </span>
            </div>
          </div>
        </div>
      </Card>
    );
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <MetricCard
          titulo="Volumen Total"
          valorOriginal={metricasOriginales.volumenTotal}
          valorSimulado={metricasSimuladas.volumenTotal}
          diferencia={diferencias.volumenTotal}
          unidad="series"
        />
        <MetricCard
          titulo="Calorías Totales"
          valorOriginal={metricasOriginales.caloriasTotales}
          valorSimulado={metricasSimuladas.caloriasTotales}
          diferencia={diferencias.caloriasTotales}
          unidad="kcal"
        />
        <MetricCard
          titulo="Duración Total"
          valorOriginal={metricasOriginales.duracionTotal}
          valorSimulado={metricasSimuladas.duracionTotal}
          diferencia={diferencias.duracionTotal}
          unidad="min"
        />
      </div>

      {/* Balance de Intensidades */}
      <Card className="p-4">
        <h4 className="text-sm font-semibold text-gray-700 mb-3">Balance de Intensidades</h4>
        <div className="space-y-3">
          {(['baja', 'media', 'alta'] as const).map((intensidad) => {
            const original = metricasOriginales.balanceIntensidades[intensidad];
            const simulado = metricasSimuladas.balanceIntensidades[intensidad];
            const diferencia = diferencias.balanceIntensidades[intensidad];

            return (
              <div key={intensidad}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-gray-700 capitalize">
                    {intensidad}:
                  </span>
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-gray-600">
                      {original.toFixed(1)}% → {simulado.toFixed(1)}%
                    </span>
                    {diferencia !== 0 && (
                      <span
                        className={`text-sm font-semibold ${
                          diferencia > 0 ? 'text-green-600' : 'text-red-600'
                        }`}
                      >
                        {diferencia > 0 ? '+' : ''}
                        {diferencia.toFixed(1)}%
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gray-400"
                      style={{ width: `${original}%` }}
                    />
                  </div>
                  <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-indigo-500"
                      style={{ width: `${simulado}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}

