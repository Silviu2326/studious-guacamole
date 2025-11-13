import React, { useState, useEffect } from 'react';
import { Button } from '../../../components/componentsreutilizables';
import { TipoAccionRapida, AccionRapida } from '../types';
import {
  Copy,
  ShoppingCart,
  Brain,
  Shuffle,
  FileSpreadsheet,
  Sparkles,
  Pin,
  PinOff,
  MoreVertical,
} from 'lucide-react';

interface AtajosRapidosProps {
  acciones: AccionRapida[];
  onAccion: (accionId: TipoAccionRapida) => void;
  onTogglePin?: (accionId: TipoAccionRapida) => void;
  mostrarConfigurar?: boolean;
}

const iconosAcciones: Record<TipoAccionRapida, React.ReactNode> = {
  duplicar_semana: <Copy className="w-4 h-4" />,
  generar_lista_compra: <ShoppingCart className="w-4 h-4" />,
  equilibrar_macros_ia: <Brain className="w-4 h-4" />,
  variar_recetas: <Shuffle className="w-4 h-4" />,
  exportar_excel: <FileSpreadsheet className="w-4 h-4" />,
  optimizar_semana_ia: <Sparkles className="w-4 h-4" />,
};

export const AtajosRapidos: React.FC<AtajosRapidosProps> = ({
  acciones,
  onAccion,
  onTogglePin,
  mostrarConfigurar = false,
}) => {
  const [mostrarMenu, setMostrarMenu] = useState(false);

  const accionesPinned = acciones
    .filter(a => a.pinned)
    .sort((a, b) => (a.orden || 0) - (b.orden || 0));

  if (accionesPinned.length === 0 && !mostrarConfigurar) {
    return null;
  }

  return (
    <div className="flex items-center gap-2 flex-wrap">
      {accionesPinned.map((accion) => (
        <Button
          key={accion.id}
          variant="secondary"
          size="sm"
          onClick={() => onAccion(accion.id)}
          leftIcon={iconosAcciones[accion.id]}
          className="text-xs"
        >
          {accion.label}
        </Button>
      ))}

      {mostrarConfigurar && (
        <div className="relative">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setMostrarMenu(!mostrarMenu)}
            leftIcon={<MoreVertical className="w-4 h-4" />}
            className="text-xs"
          >
            Configurar
          </Button>

          {mostrarMenu && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setMostrarMenu(false)}
              />
              <div className="absolute right-0 top-full mt-2 w-64 bg-white border border-slate-200 rounded-lg shadow-lg z-20 p-2">
                <div className="text-xs font-semibold text-slate-700 mb-2 px-2">
                  Atajos rápidos
                </div>
                <div className="space-y-1 max-h-64 overflow-y-auto">
                  {acciones.map((accion) => (
                    <button
                      key={accion.id}
                      onClick={() => {
                        if (onTogglePin) {
                          onTogglePin(accion.id);
                        }
                      }}
                      className="w-full flex items-center justify-between gap-2 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded-lg transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        {iconosAcciones[accion.id]}
                        <span>{accion.label}</span>
                      </div>
                      {accion.pinned ? (
                        <Pin className="w-4 h-4 text-blue-600" />
                      ) : (
                        <PinOff className="w-4 h-4 text-slate-400" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

// Hook para gestionar atajos rápidos con localStorage
export function useAtajosRapidos(dietaId?: string) {
  const [acciones, setAcciones] = useState<AccionRapida[]>([
    {
      id: 'duplicar_semana',
      label: 'Duplicar semana',
      pinned: true,
      orden: 1,
    },
    {
      id: 'generar_lista_compra',
      label: 'Generar lista compra',
      pinned: true,
      orden: 2,
    },
    {
      id: 'equilibrar_macros_ia',
      label: 'Equilibrar macros',
      pinned: false,
      orden: 3,
    },
    {
      id: 'variar_recetas',
      label: 'Variar recetas',
      pinned: false,
      orden: 4,
    },
    {
      id: 'exportar_excel',
      label: 'Exportar Excel',
      pinned: false,
      orden: 5,
    },
    {
      id: 'optimizar_semana_ia',
      label: 'Optimizar semana',
      pinned: false,
      orden: 6,
    },
  ]);

  const storageKey = dietaId
    ? `atajos-rapidos-dieta-${dietaId}`
    : 'atajos-rapidos-global';

  useEffect(() => {
    // Cargar desde localStorage
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        setAcciones(parsed);
      }
    } catch (error) {
      console.error('Error cargando atajos rápidos:', error);
    }
  }, [storageKey]);

  const togglePin = (accionId: TipoAccionRapida) => {
    setAcciones(prev => {
      const nuevas = prev.map(accion => {
        if (accion.id === accionId) {
          return { ...accion, pinned: !accion.pinned };
        }
        return accion;
      });
      
      // Guardar en localStorage
      try {
        localStorage.setItem(storageKey, JSON.stringify(nuevas));
      } catch (error) {
        console.error('Error guardando atajos rápidos:', error);
      }
      
      return nuevas;
    });
  };

  return { acciones, togglePin };
}

