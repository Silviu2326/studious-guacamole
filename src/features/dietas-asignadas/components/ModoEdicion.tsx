import React from 'react';
import { Button } from '../../../components/componentsreutilizables';
import { Zap, Settings, Clock, RefreshCw, FileText } from 'lucide-react';

export type ModoEdicion = 'rapido' | 'avanzado';

interface ModoEdicionProps {
  modo: ModoEdicion;
  onModoChange: (modo: ModoEdicion) => void;
  className?: string;
}

export const ModoEdicion: React.FC<ModoEdicionProps> = ({
  modo,
  onModoChange,
  className = '',
}) => {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Button
        variant={modo === 'rapido' ? 'primary' : 'secondary'}
        size="sm"
        onClick={() => onModoChange('rapido')}
        leftIcon={<Zap className="w-4 h-4" />}
        className="text-xs"
      >
        Rápido
      </Button>
      <Button
        variant={modo === 'avanzado' ? 'primary' : 'secondary'}
        size="sm"
        onClick={() => onModoChange('avanzado')}
        leftIcon={<Settings className="w-4 h-4" />}
        className="text-xs"
      >
        Avanzado
      </Button>
    </div>
  );
};

interface CamposAvanzadosProps {
  tempoCulinario?: number;
  sustitutos?: any[];
  instruccionesDetalladas?: string;
  onTempoCulinarioChange?: (tempo: number) => void;
  onSustitutosChange?: (sustitutos: any[]) => void;
  onInstruccionesChange?: (instrucciones: string) => void;
}

export const CamposAvanzados: React.FC<CamposAvanzadosProps> = ({
  tempoCulinario,
  sustitutos = [],
  instruccionesDetalladas,
  onTempoCulinarioChange,
  onSustitutosChange,
  onInstruccionesChange,
}) => {
  return (
    <div className="space-y-4 pt-4 border-t border-slate-200">
      <div>
        <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 mb-2">
          <Clock className="w-4 h-4 text-slate-500" />
          Tiempo de preparación (minutos)
        </label>
        <input
          type="number"
          value={tempoCulinario || ''}
          onChange={(e) => onTempoCulinarioChange?.(parseInt(e.target.value) || 0)}
          className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          placeholder="Ej: 20"
          min="0"
        />
      </div>

      <div>
        <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 mb-2">
          <RefreshCw className="w-4 h-4 text-slate-500" />
          Sustitutos
        </label>
        <div className="space-y-2">
          {sustitutos.length === 0 ? (
            <p className="text-xs text-slate-500 italic">No hay sustitutos configurados</p>
          ) : (
            sustitutos.map((sustituto, index) => (
              <div key={index} className="p-2 bg-slate-50 rounded border border-slate-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-slate-900">{sustituto.nombre}</p>
                    <p className="text-xs text-slate-600">{sustituto.razon}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      const nuevos = sustitutos.filter((_, i) => i !== index);
                      onSustitutosChange?.(nuevos);
                    }}
                    className="text-xs text-red-600 hover:text-red-700"
                  >
                    Eliminar
                  </Button>
                </div>
              </div>
            ))
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              const nuevoSustituto = {
                id: `sustituto-${Date.now()}`,
                nombre: 'Nuevo sustituto',
                razon: 'Razón del sustituto',
                macros: { calorias: 0, proteinas: 0, carbohidratos: 0, grasas: 0 },
                alimentos: [],
              };
              onSustitutosChange?.([...sustitutos, nuevoSustituto]);
            }}
            className="text-xs"
          >
            + Añadir sustituto
          </Button>
        </div>
      </div>

      <div>
        <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 mb-2">
          <FileText className="w-4 h-4 text-slate-500" />
          Instrucciones detalladas
        </label>
        <textarea
          value={instruccionesDetalladas || ''}
          onChange={(e) => onInstruccionesChange?.(e.target.value)}
          className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          placeholder="Ej: Cocinar el pollo a fuego medio durante 15 minutos, luego añadir las verduras..."
          rows={4}
        />
      </div>
    </div>
  );
};

