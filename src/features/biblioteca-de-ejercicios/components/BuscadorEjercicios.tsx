import React, { useState, useEffect } from 'react';
import { Search, X, Clock } from 'lucide-react';
import { buscarEjercicios } from '../api/ejercicios';
import { Ejercicio } from '../types';

interface BuscadorEjerciciosProps {
  valor: string;
  onChange: (valor: string) => void;
  onLimpiar?: () => void;
  placeholder?: string;
  className?: string;
  mostrarSugerencias?: boolean;
  onEjercicioSeleccionado?: (ejercicio: Ejercicio) => void;
}

export const BuscadorEjercicios: React.FC<BuscadorEjerciciosProps> = ({
  valor,
  onChange,
  onLimpiar,
  placeholder = 'Buscar ejercicios por nombre, grupo muscular, equipamiento...',
  className = '',
  mostrarSugerencias = true,
  onEjercicioSeleccionado,
}) => {
  const [sugerencias, setSugerencias] = useState<Ejercicio[]>([]);
  const [mostrarSugerenciasLista, setMostrarSugerenciasLista] = useState(false);

  useEffect(() => {
    if (valor.length >= 2 && mostrarSugerencias) {
      const timeoutId = setTimeout(async () => {
        const resultados = await buscarEjercicios(valor);
        setSugerencias(resultados.slice(0, 5)); // Mostrar solo 5 sugerencias
        setMostrarSugerenciasLista(true);
      }, 300);

      return () => clearTimeout(timeoutId);
    } else {
      setSugerencias([]);
      setMostrarSugerenciasLista(false);
    }
  }, [valor, mostrarSugerencias]);

  const handleEjercicioClick = (ejercicio: Ejercicio) => {
    onChange(ejercicio.nombre);
    setMostrarSugerenciasLista(false);
    onEjercicioSeleccionado?.(ejercicio);
  };

  return (
    <div className={`relative ${className}`}>
      <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
        <Search className="w-5 h-5 text-slate-400" />
      </div>
      <input
        value={valor}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => valor.length >= 2 && setMostrarSugerenciasLista(true)}
        onBlur={() => setTimeout(() => setMostrarSugerenciasLista(false), 200)}
        placeholder={placeholder}
        className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 pl-10 pr-10 py-2.5"
      />
      {valor && onLimpiar && (
        <button
          onClick={onLimpiar}
          className="absolute right-3 top-1/2 -translate-y-1/2 hover:text-slate-700 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      )}

      {/* Sugerencias */}
      {mostrarSugerenciasLista && sugerencias.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-white rounded-lg shadow-lg ring-1 ring-slate-200 max-h-64 overflow-y-auto">
          {sugerencias.map((ejercicio) => (
            <button
              key={ejercicio.id}
              onClick={() => handleEjercicioClick(ejercicio)}
              className="w-full px-4 py-3 text-left hover:bg-slate-50 transition-colors border-b border-slate-100 last:border-b-0"
            >
              <div className="flex items-start gap-3">
                <div className="flex-1">
                  <div className="font-medium text-slate-900">{ejercicio.nombre}</div>
                  <div className="text-xs text-slate-600 mt-1 line-clamp-1">
                    {ejercicio.descripcion}
                  </div>
                  <div className="flex items-center gap-2 mt-1 text-xs text-slate-500">
                    <span>{ejercicio.dificultad}</span>
                    <span>•</span>
                    <span>{ejercicio.grupoMuscular.join(', ')}</span>
                  </div>
                </div>
                <Clock className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" />
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

