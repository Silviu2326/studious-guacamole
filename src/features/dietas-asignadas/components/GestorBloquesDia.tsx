import React, { useState } from 'react';
import { Card, Button, Badge } from '../../../components/componentsreutilizables';
import { Plus, X, Settings } from 'lucide-react';
import type { Dieta, TipoComida, DistribucionBloquesDia } from '../types';
import { 
  getBloquesActivosDia, 
  getBloquesDisponibles,
  getDistribucionBloquesDia 
} from '../utils/distribucionBloques';

interface GestorBloquesDiaProps {
  dieta: Dieta;
  dia: string;
  onAñadirBloque: (dia: string, tipoBloque: TipoComida) => void;
  onQuitarBloque: (dia: string, tipoBloque: TipoComida) => void;
}

const nombresBloques: Record<TipoComida, string> = {
  'desayuno': 'Desayuno',
  'media-manana': 'Snack mañana',
  'almuerzo': 'Comida',
  'merienda': 'Snack tarde',
  'cena': 'Cena',
  'post-entreno': 'Post-entreno',
};

export const GestorBloquesDia: React.FC<GestorBloquesDiaProps> = ({
  dieta,
  dia,
  onAñadirBloque,
  onQuitarBloque,
}) => {
  const [mostrarMenu, setMostrarMenu] = useState(false);
  const bloquesActivos = getBloquesActivosDia(dieta, dia);
  const bloquesDisponibles = getBloquesDisponibles();
  const bloquesInactivos = bloquesDisponibles.filter(b => !bloquesActivos.includes(b));
  const distribucion = getDistribucionBloquesDia(dieta, dia);

  const handleAñadir = (tipoBloque: TipoComida) => {
    onAñadirBloque(dia, tipoBloque);
    setMostrarMenu(false);
  };

  const handleQuitar = (tipoBloque: TipoComida) => {
    // No permitir quitar si solo queda un bloque
    if (bloquesActivos.length <= 1) {
      alert('Debe haber al menos un bloque activo por día');
      return;
    }
    onQuitarBloque(dia, tipoBloque);
  };

  return (
    <div className="relative">
      <div className="flex items-center gap-2 flex-wrap">
        {bloquesActivos.map((bloque) => (
          <Badge
            key={bloque}
            className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-medium flex items-center gap-2"
          >
            {nombresBloques[bloque]}
            <button
              onClick={() => handleQuitar(bloque)}
              className="hover:bg-blue-200 rounded-full p-0.5 transition-colors"
              title="Quitar bloque"
            >
              <X className="w-3 h-3" />
            </button>
          </Badge>
        ))}
        
        {bloquesInactivos.length > 0 && (
          <div className="relative">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setMostrarMenu(!mostrarMenu)}
              className="flex items-center gap-1 text-xs"
            >
              <Plus className="w-3 h-3" />
              Añadir bloque
            </Button>
            
            {mostrarMenu && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setMostrarMenu(false)}
                />
                <Card className="absolute top-full left-0 mt-2 z-20 bg-white border border-slate-200 shadow-lg p-2 min-w-[180px]">
                  <div className="space-y-1">
                    {bloquesInactivos.map((bloque) => (
                      <button
                        key={bloque}
                        onClick={() => handleAñadir(bloque)}
                        className="w-full text-left px-3 py-2 text-sm hover:bg-slate-50 rounded-lg transition-colors"
                      >
                        {nombresBloques[bloque]}
                      </button>
                    ))}
                  </div>
                </Card>
              </>
            )}
          </div>
        )}
      </div>
      
      {bloquesActivos.length > 0 && (
        <p className="text-xs text-slate-500 mt-2">
          {bloquesActivos.length} {bloquesActivos.length === 1 ? 'bloque activo' : 'bloques activos'}
        </p>
      )}
    </div>
  );
};

