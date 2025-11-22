import React from 'react';
import { Loader2, Check, AlertCircle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

export type AutoSaveStatus = 'saving' | 'saved' | 'error';

interface AutoSaveIndicatorProps {
  status: AutoSaveStatus;
  lastSavedAt?: Date;
  errorMessage?: string;
  onRetry?: () => void;
}

export const AutoSaveIndicator: React.FC<AutoSaveIndicatorProps> = ({
  status,
  lastSavedAt,
  onRetry
}) => {
  // Hidden on mobile (< 640px), flex on tablet/desktop. Text hidden on tablet.
  const containerClasses = "hidden sm:flex items-center gap-2 text-sm font-medium transition-colors duration-200";
  const textClasses = "hidden lg:inline";

  if (status === 'saving') {
    return (
      <div className={`${containerClasses} text-blue-600`} role="status" aria-live="polite">
        <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
        <span className={textClasses}>Guardando...</span>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <button 
        className={`${containerClasses} text-red-600 cursor-pointer hover:text-red-700 focus:outline-none focus:underline`} 
        onClick={onRetry} 
        title={onRetry ? "Click para reintentar" : "Error al guardar"}
        disabled={!onRetry}
        aria-label="Error al guardar. Click para reintentar."
      >
        <AlertCircle className="w-4 h-4" aria-hidden="true" />
        <span className={textClasses}>Error al guardar</span>
      </button>
    );
  }

  // Status 'saved'
  return (
    <div className={`${containerClasses} text-gray-500`} role="status" aria-live="polite">
      <Check className="w-4 h-4" aria-hidden="true" />
      <span className={textClasses}>
        {lastSavedAt
          ? `Guardado hace ${formatDistanceToNow(lastSavedAt, { locale: es, addSuffix: false })}`
          : 'Guardado'}
      </span>
    </div>
  );
};

export default AutoSaveIndicator;
