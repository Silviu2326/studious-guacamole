import React, { useState, useEffect } from 'react';
import { Card, Button } from '../../../components/componentsreutilizables';
import { 
  ShoppingCart, 
  Copy, 
  Send, 
  Zap,
  Loader2,
  CheckCircle2
} from 'lucide-react';
import { Dieta } from '../types';
import { 
  getAccionesRapidasContextuales, 
  AccionRapidaContextual,
  MomentoPlan 
} from '../api/accionesRapidas';

interface AccionesRapidasContextualesProps {
  dieta: Dieta;
  onAccionCompletada?: () => void;
  className?: string;
}

const getIcono = (nombreIcono: string): React.ReactNode => {
  switch (nombreIcono) {
    case 'ShoppingCart':
      return <ShoppingCart className="w-4 h-4" />;
    case 'Copy':
      return <Copy className="w-4 h-4" />;
    case 'Send':
      return <Send className="w-4 h-4" />;
    default:
      return <Zap className="w-4 h-4" />;
  }
};

const getMomentoLabel = (momento: MomentoPlan): string => {
  switch (momento) {
    case 'recien-creado':
      return 'Plan recién creado';
    case 'inicio':
      return 'Inicio del plan';
    case 'en-progreso':
      return 'Plan en progreso';
    case 'cerca-final':
      return 'Cerca del final';
    case 'finalizado':
      return 'Plan finalizado';
    default:
      return '';
  }
};

const getMomentoColor = (momento: MomentoPlan): string => {
  switch (momento) {
    case 'recien-creado':
      return 'bg-blue-50 border-blue-200 text-blue-700';
    case 'inicio':
      return 'bg-green-50 border-green-200 text-green-700';
    case 'en-progreso':
      return 'bg-purple-50 border-purple-200 text-purple-700';
    case 'cerca-final':
      return 'bg-orange-50 border-orange-200 text-orange-700';
    case 'finalizado':
      return 'bg-gray-50 border-gray-200 text-gray-700';
    default:
      return 'bg-gray-50 border-gray-200 text-gray-700';
  }
};

export const AccionesRapidasContextuales: React.FC<AccionesRapidasContextualesProps> = ({
  dieta,
  onAccionCompletada,
  className = '',
}) => {
  const [acciones, setAcciones] = useState<AccionRapidaContextual[]>([]);
  const [ejecutando, setEjecutando] = useState<Set<string>>(new Set());
  const [completadas, setCompletadas] = useState<Set<string>>(new Set());

  useEffect(() => {
    const accionesDisponibles = getAccionesRapidasContextuales(dieta, () => {
      onAccionCompletada?.();
    });
    setAcciones(accionesDisponibles);
  }, [dieta, onAccionCompletada]);

  const handleAccion = async (accion: AccionRapidaContextual) => {
    if (ejecutando.has(accion.id)) return;

    setEjecutando(prev => new Set(prev).add(accion.id));

    try {
      await accion.accion();
      setCompletadas(prev => new Set(prev).add(accion.id));
      
      // Remover el estado de completado después de 2 segundos
      setTimeout(() => {
        setCompletadas(prev => {
          const nuevo = new Set(prev);
          nuevo.delete(accion.id);
          return nuevo;
        });
      }, 2000);
    } catch (error) {
      console.error('Error ejecutando acción:', error);
    } finally {
      setEjecutando(prev => {
        const nuevo = new Set(prev);
        nuevo.delete(accion.id);
        return nuevo;
      });
    }
  };

  if (acciones.length === 0) {
    return null;
  }

  const momento = acciones[0]?.momentoPlan[0] || 'en-progreso';

  return (
    <Card className={`bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 border-2 border-indigo-200 shadow-lg ${className}`}>
      <div className="p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-indigo-100 rounded-lg">
              <Zap className="h-5 w-5 text-indigo-600" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">
                Acciones Rápidas
              </h3>
              <p className="text-sm text-gray-600">
                Acciones frecuentes según el momento del plan
              </p>
            </div>
          </div>
          <div className={`px-3 py-1 rounded-full text-xs font-medium ${getMomentoColor(momento as MomentoPlan)}`}>
            {getMomentoLabel(momento as MomentoPlan)}
          </div>
        </div>

        {/* Acciones */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {acciones.map((accion) => {
            const estaEjecutando = ejecutando.has(accion.id);
            const estaCompletada = completadas.has(accion.id);
            const Icono = getIcono(accion.icono);

            return (
              <Button
                key={accion.id}
                variant="secondary"
                size="sm"
                onClick={() => handleAccion(accion)}
                disabled={estaEjecutando || !accion.disponible}
                className="flex items-center justify-center gap-2 h-auto py-3 px-4 bg-white hover:bg-indigo-50 border border-indigo-200 hover:border-indigo-300 transition-all"
                leftIcon={
                  estaEjecutando ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : estaCompletada ? (
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                  ) : (
                    Icono
                  )
                }
              >
                <div className="flex flex-col items-start">
                  <span className="font-semibold text-sm">{accion.label}</span>
                  <span className="text-xs text-gray-500">{accion.descripcion}</span>
                </div>
              </Button>
            );
          })}
        </div>
      </div>
    </Card>
  );
};

