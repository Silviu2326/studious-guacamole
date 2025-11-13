import React, { useState, useEffect, useRef } from 'react';
import { Button, Card } from '../../../components/componentsreutilizables';
import { Clock, Play, Pause, Square, History, TrendingUp } from 'lucide-react';
import type { DatosTemporizador, TiempoReceta } from '../types';
import { guardarTiempoReceta, obtenerDatosTemporizador } from '../api/temporizadores';

interface TemporizadorRecetaProps {
  recetaId: string;
  tiempoEstimado?: number; // Tiempo estimado en minutos
  datosTemporizador?: DatosTemporizador;
  onDatosTemporizadorChange: (datos: DatosTemporizador) => void;
}

export const TemporizadorReceta: React.FC<TemporizadorRecetaProps> = ({
  recetaId,
  tiempoEstimado,
  datosTemporizador,
  onDatosTemporizadorChange,
}) => {
  const [tiempoTranscurrido, setTiempoTranscurrido] = useState(0); // en segundos
  const [corriendo, setCorriendo] = useState(false);
  const [mostrarHistorial, setMostrarHistorial] = useState(false);
  const intervaloRef = useRef<NodeJS.Timeout | null>(null);
  const tiempoInicioRef = useRef<number | null>(null);

  // Inicializar datos del temporizador si no existen
  useEffect(() => {
    if (!datosTemporizador) {
      const datosIniciales: DatosTemporizador = {
        recetaId,
        tiempoEstimado,
        historialTiempos: [],
      };
      onDatosTemporizadorChange(datosIniciales);
    }
  }, [recetaId, tiempoEstimado, datosTemporizador, onDatosTemporizadorChange]);

  // Efecto para el temporizador
  useEffect(() => {
    if (corriendo) {
      intervaloRef.current = setInterval(() => {
        setTiempoTranscurrido((prev) => prev + 1);
      }, 1000);
    } else {
      if (intervaloRef.current) {
        clearInterval(intervaloRef.current);
        intervaloRef.current = null;
      }
    }

    return () => {
      if (intervaloRef.current) {
        clearInterval(intervaloRef.current);
      }
    };
  }, [corriendo]);

  const formatearTiempo = (segundos: number): string => {
    const horas = Math.floor(segundos / 3600);
    const minutos = Math.floor((segundos % 3600) / 60);
    const segs = segundos % 60;

    if (horas > 0) {
      return `${horas}:${minutos.toString().padStart(2, '0')}:${segs.toString().padStart(2, '0')}`;
    }
    return `${minutos}:${segs.toString().padStart(2, '0')}`;
  };

  const formatearTiempoMinutos = (minutos: number): string => {
    if (minutos < 60) {
      return `${Math.round(minutos)} min`;
    }
    const horas = Math.floor(minutos / 60);
    const mins = Math.round(minutos % 60);
    return `${horas}h ${mins}min`;
  };

  const handleIniciar = () => {
    if (!corriendo) {
      tiempoInicioRef.current = Date.now() - tiempoTranscurrido * 1000;
      setCorriendo(true);
    }
  };

  const handlePausar = () => {
    setCorriendo(false);
  };

  const handleDetener = async () => {
    setCorriendo(false);
    const tiempoRealMinutos = tiempoTranscurrido / 60;

    if (tiempoRealMinutos > 0 && datosTemporizador) {
      try {
        const nuevoTiempo: TiempoReceta = {
          id: `tiempo-${Date.now()}`,
          recetaId,
          tiempoReal: tiempoRealMinutos,
          fecha: new Date().toISOString(),
        };

        await guardarTiempoReceta(recetaId, nuevoTiempo);

        const datosActualizados: DatosTemporizador = {
          ...datosTemporizador,
          tiempoReal: tiempoRealMinutos,
          historialTiempos: [...datosTemporizador.historialTiempos, nuevoTiempo],
          ultimaEjecucion: new Date().toISOString(),
        };

        onDatosTemporizadorChange(datosActualizados);
        setTiempoTranscurrido(0);
        tiempoInicioRef.current = null;
      } catch (error) {
        console.error('Error al guardar tiempo:', error);
        alert('Error al guardar el tiempo. Por favor, intenta de nuevo.');
      }
    }
  };

  const calcularTiempoPromedio = (): number => {
    if (!datosTemporizador || datosTemporizador.historialTiempos.length === 0) {
      return 0;
    }
    const suma = datosTemporizador.historialTiempos.reduce(
      (acc, tiempo) => acc + tiempo.tiempoReal,
      0
    );
    return suma / datosTemporizador.historialTiempos.length;
  };

  const tiempoPromedio = calcularTiempoPromedio();
  const diferenciaConEstimado =
    tiempoEstimado && datosTemporizador?.tiempoReal
      ? datosTemporizador.tiempoReal - tiempoEstimado
      : null;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-slate-600 flex items-center gap-1">
          <Clock className="w-3 h-3" />
          Temporizador
        </span>
        {datosTemporizador && datosTemporizador.historialTiempos.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setMostrarHistorial(!mostrarHistorial)}
            className="h-6 px-2 text-xs"
          >
            <History className="w-3 h-3 mr-1" />
            Historial
          </Button>
        )}
      </div>

      <Card className="p-3 bg-slate-50 border border-slate-200">
        <div className="space-y-3">
          {/* Tiempo actual */}
          <div className="text-center">
            <div className="text-2xl font-bold text-slate-900">
              {formatearTiempo(tiempoTranscurrido)}
            </div>
            {tiempoEstimado && (
              <div className="text-xs text-slate-500 mt-1">
                Estimado: {formatearTiempoMinutos(tiempoEstimado)}
              </div>
            )}
          </div>

          {/* Controles */}
          <div className="flex items-center justify-center gap-2">
            {!corriendo ? (
              <Button
                onClick={handleIniciar}
                size="sm"
                className="bg-green-500 hover:bg-green-600 text-white"
              >
                <Play className="w-4 h-4 mr-1" />
                Iniciar
              </Button>
            ) : (
              <>
                <Button
                  onClick={handlePausar}
                  size="sm"
                  variant="outline"
                >
                  <Pause className="w-4 h-4 mr-1" />
                  Pausar
                </Button>
                <Button
                  onClick={handleDetener}
                  size="sm"
                  className="bg-red-500 hover:bg-red-600 text-white"
                >
                  <Square className="w-4 h-4 mr-1" />
                  Detener y guardar
                </Button>
              </>
            )}
          </div>

          {/* Estadísticas */}
          {datosTemporizador && datosTemporizador.historialTiempos.length > 0 && (
            <div className="space-y-2 pt-2 border-t border-slate-200">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-600">Último tiempo:</span>
                <span className="font-medium text-slate-900">
                  {formatearTiempoMinutos(datosTemporizador.tiempoReal || 0)}
                </span>
              </div>
              {tiempoPromedio > 0 && (
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-600">Promedio:</span>
                  <span className="font-medium text-slate-900">
                    {formatearTiempoMinutos(tiempoPromedio)}
                  </span>
                </div>
              )}
              {diferenciaConEstimado !== null && tiempoEstimado && (
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-600">Diferencia:</span>
                  <span
                    className={`font-medium flex items-center gap-1 ${
                      diferenciaConEstimado > 0
                        ? 'text-red-600'
                        : diferenciaConEstimado < 0
                        ? 'text-green-600'
                        : 'text-slate-600'
                    }`}
                  >
                    {diferenciaConEstimado > 0 ? '+' : ''}
                    {formatearTiempoMinutos(Math.abs(diferenciaConEstimado))}
                    {diferenciaConEstimado !== 0 && (
                      <TrendingUp
                        className={`w-3 h-3 ${
                          diferenciaConEstimado > 0 ? 'rotate-180' : ''
                        }`}
                      />
                    )}
                  </span>
                </div>
              )}
            </div>
          )}
        </div>
      </Card>

      {/* Historial */}
      {mostrarHistorial && datosTemporizador && datosTemporizador.historialTiempos.length > 0 && (
        <Card className="p-3 bg-white border border-slate-200">
          <div className="space-y-2">
            <div className="text-xs font-medium text-slate-700 mb-2">Historial de tiempos</div>
            {datosTemporizador.historialTiempos
              .slice()
              .reverse()
              .map((tiempo) => (
                <div
                  key={tiempo.id}
                  className="flex items-center justify-between text-xs py-1 border-b border-slate-100 last:border-0"
                >
                  <div>
                    <div className="font-medium text-slate-900">
                      {formatearTiempoMinutos(tiempo.tiempoReal)}
                    </div>
                    <div className="text-slate-500">
                      {new Date(tiempo.fecha).toLocaleDateString('es-ES', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </div>
                  </div>
                  {tiempo.notas && (
                    <div className="text-slate-500 italic text-[10px] max-w-[150px] truncate">
                      {tiempo.notas}
                    </div>
                  )}
                </div>
              ))}
          </div>
        </Card>
      )}
    </div>
  );
};

