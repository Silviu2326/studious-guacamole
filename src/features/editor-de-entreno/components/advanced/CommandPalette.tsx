import React, { useState, useEffect, useMemo } from 'react';
import { Modal } from '../../../../components/componentsreutilizables';
import { Search, Command } from 'lucide-react';
import { PlanificacionSemana } from '../../types/advanced';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onCommand: (command: string, params?: any) => void;
  planificacion: PlanificacionSemana;
  diaSeleccionado: keyof PlanificacionSemana;
}

interface Comando {
  id: string;
  label: string;
  description: string;
  action: string;
  params?: any;
  keywords: string[];
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  onCommand,
  planificacion,
  diaSeleccionado,
}) => {
  const [busqueda, setBusqueda] = useState('');
  const [comandoSeleccionado, setComandoSeleccionado] = useState(0);

  const comandos: Comando[] = [
    {
      id: 'agregar-ejercicio',
      label: 'Añadir ejercicio',
      description: 'Añadir sentadilla 3×5 @RPE7 jueves',
      action: 'agregar-ejercicio',
      keywords: ['añadir', 'agregar', 'add', 'ejercicio', 'exercise'],
    },
    {
      id: 'aplicar-plantilla-semana',
      label: 'Aplicar plantilla semana',
      description: 'Aplicar plantilla sobre toda la semana',
      action: 'aplicar-plantilla-semana',
      keywords: ['aplicar', 'apply', 'plantilla', 'template', 'semana', 'week'],
    },
    {
      id: 'condensar-dia-tiempo',
      label: 'Condensar día a 25 min',
      description: 'Condensar día a tiempo específico (ej: 25 min)',
      action: 'condensar-dia-tiempo',
      keywords: ['condensar', 'compactar', 'reducir', 'tiempo', '25', '30', 'min'],
    },
    {
      id: 'cambiar-sentadillas-zancadas',
      label: 'Cambiar sentadillas por zancadas',
      description: 'Cambiar todas las sentadillas por zancadas esta semana',
      action: 'cambiar-sentadillas-zancadas',
      keywords: ['cambiar', 'replace', 'sentadilla', 'squat', 'zancada', 'lunge'],
    },
    {
      id: 'exportar-pdf',
      label: 'Exportar PDF para cliente',
      description: 'Exportar planificación actual a PDF para compartir',
      action: 'exportar-pdf',
      keywords: ['exportar', 'export', 'pdf', 'cliente', 'compartir'],
    },
    {
      id: 'copiar-dia',
      label: 'Copiar día',
      description: 'Copiar día Lunes→Miércoles',
      action: 'copiar-dia',
      keywords: ['copiar', 'copy', 'duplicar', 'duplicate'],
    },
    {
      id: 'aplicar-plantilla',
      label: 'Aplicar plantilla',
      description: 'Aplicar plantilla sobre día/semana/rango',
      action: 'aplicar-plantilla',
      keywords: ['aplicar', 'apply', 'plantilla', 'template'],
    },
    {
      id: 'smart-fill',
      label: 'Smart Fill',
      description: 'Rellenar inteligentemente según restricciones',
      action: 'smart-fill',
      keywords: ['smart', 'fill', 'rellenar', 'inteligente'],
    },
    {
      id: 'condensar-dia',
      label: 'Condensar día',
      description: 'Priorizar compuestos y reducir accesorios',
      action: 'condensar-dia',
      keywords: ['condensar', 'compactar', 'reducir', 'tiempo'],
    },
    {
      id: 'modo-hotel',
      label: 'Modo Hotel',
      description: 'Cambiar a variantes bodyweight/bandas',
      action: 'modo-hotel',
      keywords: ['hotel', 'viaje', 'bodyweight', 'sin equipo'],
    },
    {
      id: 'deload',
      label: 'Deload Parcial',
      description: 'Reducir volumen 15%, aumentar tempo',
      action: 'deload',
      keywords: ['deload', 'descanso', 'fatiga', 'reducir'],
    },
  ];

  const comandosFiltrados = useMemo(() => {
    if (!busqueda) return comandos;
    const busquedaLower = busqueda.toLowerCase();
    return comandos.filter(
      cmd =>
        cmd.keywords.some(kw => kw.includes(busquedaLower)) ||
        cmd.label.toLowerCase().includes(busquedaLower) ||
        cmd.description.toLowerCase().includes(busquedaLower)
    );
  }, [busqueda]);

  useEffect(() => {
    if (isOpen) {
      setBusqueda('');
      setComandoSeleccionado(0);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setComandoSeleccionado(prev =>
          prev < comandosFiltrados.length - 1 ? prev + 1 : 0
        );
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setComandoSeleccionado(prev =>
          prev > 0 ? prev - 1 : comandosFiltrados.length - 1
        );
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (comandosFiltrados[comandoSeleccionado]) {
          onCommand(
            comandosFiltrados[comandoSeleccionado].action,
            comandosFiltrados[comandoSeleccionado].params
          );
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, comandosFiltrados, comandoSeleccionado, onCommand]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[20vh]">
      <div className="bg-black/50 fixed inset-0" onClick={onClose} />
      <div className="relative w-full max-w-2xl mx-4">
        <div className="bg-white rounded-lg shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-200 bg-gray-50">
            <Command className="w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder="Escribe un comando... (ej: añadir sentadilla 3×5 @RPE7)"
              className="flex-1 bg-transparent border-0 outline-none text-gray-900 placeholder-gray-400"
              autoFocus
            />
            <div className="text-xs text-gray-400 bg-gray-200 px-2 py-1 rounded">
              ⌘K
            </div>
          </div>

          {/* Lista de comandos */}
          <div className="max-h-96 overflow-y-auto">
            {comandosFiltrados.length === 0 ? (
              <div className="px-4 py-8 text-center text-gray-500">
                <p>No se encontraron comandos</p>
              </div>
            ) : (
              comandosFiltrados.map((comando, index) => (
                <button
                  key={comando.id}
                  onClick={() => {
                    onCommand(comando.action, comando.params);
                  }}
                  className={`w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors ${
                    index === comandoSeleccionado ? 'bg-blue-50' : ''
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-gray-900">{comando.label}</div>
                      <div className="text-sm text-gray-500 mt-0.5">{comando.description}</div>
                    </div>
                    {index === comandoSeleccionado && (
                      <div className="text-xs text-blue-600">Enter</div>
                    )}
                  </div>
                </button>
              ))
            )}
          </div>

          {/* Footer con ayuda */}
          <div className="px-4 py-2 border-t border-gray-200 bg-gray-50 flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center gap-4">
              <span>↑↓ navegar</span>
              <span>Enter seleccionar</span>
              <span>Esc cerrar</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

