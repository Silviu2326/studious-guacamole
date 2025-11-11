import React, { useState } from 'react';
import { PlanificacionSemana } from '../../types/advanced';
import { Modal } from '../../../../components/componentsreutilizables';
import { TrendingUp, TrendingDown, Minus, BarChart3 } from 'lucide-react';

interface ComparadorSemanasProps {
  semanaA: PlanificacionSemana;
  semanaB: PlanificacionSemana;
  isOpen: boolean;
  onClose: () => void;
}

interface Delta {
  patrón: string;
  volumen: { semanaA: number; semanaB: number; delta: number; porcentaje: number };
  carga: { semanaA: number; semanaB: number; delta: number; porcentaje: number };
  seriesEfectivas: { semanaA: number; semanaB: number; delta: number; porcentaje: number };
}

/**
 * Comparar semanas (A↔B): muestra deltas de volumen/carga/series efectivas por patrón
 */
export const ComparadorSemanas: React.FC<ComparadorSemanasProps> = ({
  semanaA,
  semanaB,
  isOpen,
  onClose,
}) => {
  const calcularMetricas = (planificacion: PlanificacionSemana) => {
    const patrones: Record<string, { volumen: number; carga: number; seriesEfectivas: number }> = {
      empuje: { volumen: 0, carga: 0, seriesEfectivas: 0 },
      tiron: { volumen: 0, carga: 0, seriesEfectivas: 0 },
      rodilla: { volumen: 0, carga: 0, seriesEfectivas: 0 },
      cadera: { volumen: 0, carga: 0, seriesEfectivas: 0 },
      vertical: { volumen: 0, carga: 0, seriesEfectivas: 0 },
      horizontal: { volumen: 0, carga: 0, seriesEfectivas: 0 },
      core: { volumen: 0, carga: 0, seriesEfectivas: 0 },
    };

    Object.values(planificacion).forEach(sesion => {
      if (!sesion) return;
      
      sesion.ejercicios?.forEach(ej => {
        // Determinar patrón (simplificado - en producción usaría datos reales)
        const nombreEj = ej.ejercicio.nombre.toLowerCase();
        let patron = 'general';
        
        if (nombreEj.includes('press') || nombreEj.includes('push')) {
          patron = 'empuje';
        } else if (nombreEj.includes('remo') || nombreEj.includes('pull')) {
          patron = 'tiron';
        } else if (nombreEj.includes('sentadilla') || nombreEj.includes('squat')) {
          patron = 'rodilla';
        } else if (nombreEj.includes('muerto') || nombreEj.includes('deadlift')) {
          patron = 'cadera';
        }

        if (patron !== 'general') {
          const volumen = ej.series?.reduce((sum, s) => sum + s.repeticiones, 0) || 0;
          const carga = ej.series?.reduce((sum, s) => sum + (s.peso || 0) * s.repeticiones, 0) || 0;
          const seriesEfectivas = ej.series?.length || 0;

          patrones[patron].volumen += volumen;
          patrones[patron].carga += carga;
          patrones[patron].seriesEfectivas += seriesEfectivas;
        }
      });
    });

    return patrones;
  };

  const calcularDeltas = (): Delta[] => {
    const metricasA = calcularMetricas(semanaA);
    const metricasB = calcularMetricas(semanaB);
    const deltas: Delta[] = [];

    Object.keys(metricasA).forEach(patron => {
      const a = metricasA[patron];
      const b = metricasB[patron];

      const deltaVolumen = b.volumen - a.volumen;
      const deltaCarga = b.carga - a.carga;
      const deltaSeries = b.seriesEfectivas - a.seriesEfectivas;

      deltas.push({
        patrón: patron.charAt(0).toUpperCase() + patron.slice(1),
        volumen: {
          semanaA: a.volumen,
          semanaB: b.volumen,
          delta: deltaVolumen,
          porcentaje: a.volumen > 0 ? (deltaVolumen / a.volumen) * 100 : 0,
        },
        carga: {
          semanaA: a.carga,
          semanaB: b.carga,
          delta: deltaCarga,
          porcentaje: a.carga > 0 ? (deltaCarga / a.carga) * 100 : 0,
        },
        seriesEfectivas: {
          semanaA: a.seriesEfectivas,
          semanaB: b.seriesEfectivas,
          delta: deltaSeries,
          porcentaje: a.seriesEfectivas > 0 ? (deltaSeries / a.seriesEfectivas) * 100 : 0,
        },
      });
    });

    return deltas;
  };

  const deltas = calcularDeltas();

  const renderDelta = (valor: number, porcentaje: number) => {
    const isPositive = valor > 0;
    const isNegative = valor < 0;
    const isNeutral = valor === 0;

    return (
      <div className="flex items-center gap-2">
        {isPositive && <TrendingUp className="w-4 h-4 text-green-600" />}
        {isNegative && <TrendingDown className="w-4 h-4 text-red-600" />}
        {isNeutral && <Minus className="w-4 h-4 text-gray-400" />}
        <span className={`font-medium ${isPositive ? 'text-green-600' : isNegative ? 'text-red-600' : 'text-gray-600'}`}>
          {isPositive ? '+' : ''}{valor.toFixed(0)} ({isPositive ? '+' : ''}{porcentaje.toFixed(1)}%)
        </span>
      </div>
    );
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Comparar Semanas" size="xl">
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
            <div className="font-semibold text-blue-900">Semana A</div>
          </div>
          <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
            <div className="font-semibold text-purple-900">Semana B</div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left p-2 font-semibold text-gray-700">Patrón</th>
                <th className="text-center p-2 font-semibold text-gray-700">Volumen</th>
                <th className="text-center p-2 font-semibold text-gray-700">Carga</th>
                <th className="text-center p-2 font-semibold text-gray-700">Series Efectivas</th>
              </tr>
            </thead>
            <tbody>
              {deltas.map((delta, idx) => (
                <tr key={idx} className="border-b border-gray-100">
                  <td className="p-2 font-medium text-gray-900">{delta.patrón}</td>
                  <td className="p-2">
                    <div className="space-y-1">
                      <div className="text-xs text-gray-500">
                        A: {delta.volumen.semanaA} | B: {delta.volumen.semanaB}
                      </div>
                      {renderDelta(delta.volumen.delta, delta.volumen.porcentaje)}
                    </div>
                  </td>
                  <td className="p-2">
                    <div className="space-y-1">
                      <div className="text-xs text-gray-500">
                        A: {delta.carga.semanaA.toFixed(0)} | B: {delta.carga.semanaB.toFixed(0)}
                      </div>
                      {renderDelta(delta.carga.delta, delta.carga.porcentaje)}
                    </div>
                  </td>
                  <td className="p-2">
                    <div className="space-y-1">
                      <div className="text-xs text-gray-500">
                        A: {delta.seriesEfectivas.semanaA} | B: {delta.seriesEfectivas.semanaB}
                      </div>
                      {renderDelta(delta.seriesEfectivas.delta, delta.seriesEfectivas.porcentaje)}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Modal>
  );
};











