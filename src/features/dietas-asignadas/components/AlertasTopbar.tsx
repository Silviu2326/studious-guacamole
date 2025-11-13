import React from 'react';
import { AlertTriangle, X, CheckCircle2 } from 'lucide-react';
import { Inconsistencia } from '../utils/detectarInconsistencias';

interface AlertasTopbarProps {
  inconsistencias: Inconsistencia[];
  onDismiss?: (inconsistenciaId: string) => void;
  onVerDetalles?: () => void;
}

export const AlertasTopbar: React.FC<AlertasTopbarProps> = ({
  inconsistencias,
  onDismiss,
  onVerDetalles,
}) => {
  if (inconsistencias.length === 0) {
    return null;
  }

  // Ordenar por severidad: alta, media, baja
  const inconsistenciasOrdenadas = [...inconsistencias].sort((a, b) => {
    const ordenSeveridad = { alta: 0, media: 1, baja: 2 };
    return ordenSeveridad[a.severidad] - ordenSeveridad[b.severidad];
  });

  const inconsistenciasAltas = inconsistencias.filter(i => i.severidad === 'alta');
  const tieneInconsistenciasAltas = inconsistenciasAltas.length > 0;

  return (
    <div className={`border-b ${
      tieneInconsistenciasAltas 
        ? 'border-red-200 bg-red-50' 
        : 'border-amber-200 bg-amber-50'
    } px-4 py-3`}>
      <div className="mx-auto max-w-7xl flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <AlertTriangle 
            className={`h-5 w-5 flex-shrink-0 ${
              tieneInconsistenciasAltas ? 'text-red-600' : 'text-amber-600'
            }`} 
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className={`text-sm font-semibold ${
                tieneInconsistenciasAltas ? 'text-red-900' : 'text-amber-900'
              }`}>
                {inconsistencias.length} inconsistencia{inconsistencias.length !== 1 ? 's' : ''} detectada{inconsistencias.length !== 1 ? 's' : ''}
              </span>
              {inconsistenciasAltas.length > 0 && (
                <span className="text-xs px-2 py-0.5 rounded-full bg-red-200 text-red-800 font-medium">
                  {inconsistenciasAltas.length} crítica{inconsistenciasAltas.length !== 1 ? 's' : ''}
                </span>
              )}
            </div>
            <div className="mt-1">
              <p className={`text-xs ${
                tieneInconsistenciasAltas ? 'text-red-700' : 'text-amber-700'
              }`}>
                {inconsistenciasOrdenadas[0].mensaje}
                {inconsistencias.length > 1 && ` y ${inconsistencias.length - 1} más`}
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          {onVerDetalles && (
            <button
              onClick={onVerDetalles}
              className={`text-xs font-medium px-3 py-1.5 rounded-md transition-colors ${
                tieneInconsistenciasAltas
                  ? 'bg-red-100 text-red-700 hover:bg-red-200'
                  : 'bg-amber-100 text-amber-700 hover:bg-amber-200'
              }`}
            >
              Ver detalles
            </button>
          )}
          {onDismiss && (
            <button
              onClick={() => {
                // Dismiss all
                inconsistencias.forEach(inc => onDismiss(inc.id));
              }}
              className={`p-1.5 rounded-md transition-colors ${
                tieneInconsistenciasAltas
                  ? 'text-red-600 hover:bg-red-100'
                  : 'text-amber-600 hover:bg-amber-100'
              }`}
              title="Descartar alertas"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

