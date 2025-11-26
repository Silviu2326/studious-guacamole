import React, { useState, useEffect, useMemo } from 'react';
import { Card, Button, Badge } from '../../../components/componentsreutilizables';
import {
  Zap,
  Copy,
  Activity,
  Send,
  Sparkles,
  Loader2,
  ChevronRight,
  Clock,
} from 'lucide-react';
import { Programa } from '../api/programas';
import { DayPlan } from '../types';
import {
  getAccionesRapidasContextuales,
  AccionRapidaContextual,
} from '../api/acciones-rapidas';

interface QuickActionsPanelProps {
  programa: Programa;
  weeklyPlan?: Record<string, DayPlan>;
  onAccionCompletada?: () => void;
  className?: string;
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Copy,
  Activity,
  Send,
  Zap,
};

export const QuickActionsPanel: React.FC<QuickActionsPanelProps> = ({
  programa,
  weeklyPlan,
  onAccionCompletada,
  className = '',
}) => {
  const [acciones, setAcciones] = useState<AccionRapidaContextual[]>([]);
  const [loading, setLoading] = useState(false);
  const [ejecutandoAccion, setEjecutandoAccion] = useState<string | null>(null);

  useEffect(() => {
    loadAcciones();
  }, [programa, weeklyPlan]);

  const loadAcciones = () => {
    setLoading(true);
    try {
      const accionesDisponibles = getAccionesRapidasContextuales(
        programa,
        weeklyPlan,
        () => {
          // Recargar acciones después de completar una
          loadAcciones();
          onAccionCompletada?.();
        }
      );
      setAcciones(accionesDisponibles);
    } catch (error) {
      console.error('Error cargando acciones rápidas:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAccion = async (accion: AccionRapidaContextual) => {
    setEjecutandoAccion(accion.id);
    try {
      await accion.accion();
    } catch (error) {
      console.error('Error ejecutando acción:', error);
    } finally {
      setEjecutandoAccion(null);
    }
  };

  const getPrioridadColor = (prioridad: AccionRapidaContextual['prioridad']) => {
    switch (prioridad) {
      case 'alta':
        return 'bg-red-100 text-red-700 border-red-200';
      case 'media':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'baja':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  if (loading) {
    return (
      <Card className={`p-6 ${className}`}>
        <div className="flex items-center justify-center py-4">
          <Loader2 className="w-5 h-5 animate-spin text-indigo-600" />
          <span className="ml-2 text-sm text-gray-600">Cargando acciones...</span>
        </div>
      </Card>
    );
  }

  if (acciones.length === 0) {
    return null;
  }

  return (
    <Card className={`p-6 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-100 rounded-lg">
            <Sparkles className="w-5 h-5 text-indigo-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Acciones Rápidas</h3>
            <p className="text-sm text-gray-600">
              Acciones sugeridas según el momento del programa
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {acciones.map((accion) => {
          const IconComponent = iconMap[accion.icono] || Zap;
          const isEjecutando = ejecutandoAccion === accion.id;

          return (
            <div
              key={accion.id}
              className={`p-4 rounded-lg border-2 transition-all hover:shadow-md ${
                accion.prioridad === 'alta'
                  ? 'border-red-200 bg-red-50/50'
                  : accion.prioridad === 'media'
                  ? 'border-yellow-200 bg-yellow-50/50'
                  : 'border-blue-200 bg-blue-50/50'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3 flex-1">
                  <div
                    className={`p-2 rounded-lg ${
                      accion.prioridad === 'alta'
                        ? 'bg-red-100'
                        : accion.prioridad === 'media'
                        ? 'bg-yellow-100'
                        : 'bg-blue-100'
                    }`}
                  >
                    <IconComponent
                      className={`w-5 h-5 ${
                        accion.prioridad === 'alta'
                          ? 'text-red-600'
                          : accion.prioridad === 'media'
                          ? 'text-yellow-600'
                          : 'text-blue-600'
                      }`}
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold text-sm text-gray-900">
                        {accion.label}
                      </h4>
                      <Badge
                        className={`text-xs ${getPrioridadColor(accion.prioridad)}`}
                      >
                        {accion.prioridad}
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-600 mb-2">{accion.descripcion}</p>
                  </div>
                </div>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => handleAccion(accion)}
                  disabled={isEjecutando}
                  className="ml-4"
                  leftIcon={
                    isEjecutando ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <ChevronRight className="w-4 h-4" />
                    )
                  }
                >
                  {isEjecutando ? 'Ejecutando...' : 'Ejecutar'}
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      {acciones.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <Clock className="w-3 h-3" />
            <span>
              Estas acciones se actualizan automáticamente según el contexto del programa
            </span>
          </div>
        </div>
      )}
    </Card>
  );
};

