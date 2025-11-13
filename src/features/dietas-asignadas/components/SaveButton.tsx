import React, { useState, useRef, useEffect } from 'react';
import { Save, Clock, FileText, Send, ChevronDown, CheckCircle2 } from 'lucide-react';
import { Button } from '../../../components/componentsreutilizables';

interface SaveButtonProps {
  ultimoAutosave?: string;
  estadoPublicacion?: 'borrador' | 'publicado';
  onGuardarBorrador: () => Promise<void>;
  onPublicar: () => Promise<void>;
  guardando?: boolean;
  publicando?: boolean;
}

export const SaveButton: React.FC<SaveButtonProps> = ({
  ultimoAutosave,
  estadoPublicacion = 'borrador',
  onGuardarBorrador,
  onPublicar,
  guardando = false,
  publicando = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const formatTime = (timestamp?: string): string => {
    if (!timestamp) return 'Nunca';
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Hace unos segundos';
    if (diffMins < 60) return `Hace ${diffMins} min`;
    if (diffHours < 24) return `Hace ${diffHours} h`;
    if (diffDays === 1) return 'Ayer';
    if (diffDays < 7) return `Hace ${diffDays} días`;
    
    return date.toLocaleDateString('es-ES', { 
      day: '2-digit', 
      month: 'short', 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const handleGuardarBorrador = async () => {
    await onGuardarBorrador();
    setIsOpen(false);
  };

  const handlePublicar = async () => {
    await onPublicar();
    setIsOpen(false);
  };

  const isPublicado = estadoPublicacion === 'publicado';

  return (
    <div className="relative" ref={dropdownRef}>
      <Button
        variant="secondary"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2"
        disabled={guardando || publicando}
      >
        {(guardando || publicando) ? (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current" />
            <span>{guardando ? 'Guardando...' : 'Publicando...'}</span>
          </>
        ) : (
          <>
            <Save className="h-4 w-4" />
            <span>{isPublicado ? 'Publicado' : 'Guardar'}</span>
            <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
          </>
        )}
      </Button>

      {isOpen && !guardando && !publicando && (
        <div className="absolute right-0 mt-2 w-72 bg-white border border-slate-200 rounded-xl shadow-lg z-50 overflow-hidden">
          {/* Header con último autosave */}
          <div className="px-4 py-3 border-b border-slate-200 bg-slate-50">
            <div className="flex items-center gap-2 text-xs text-slate-600">
              <Clock className="h-3.5 w-3.5 text-slate-400" />
              <span className="font-medium">Último autosave:</span>
              <span className="text-slate-900 font-semibold">{formatTime(ultimoAutosave)}</span>
            </div>
            {isPublicado && (
              <div className="flex items-center gap-2 mt-2 text-xs text-emerald-600">
                <CheckCircle2 className="h-3.5 w-3.5" />
                <span>Publicado</span>
              </div>
            )}
          </div>

          {/* Opciones */}
          <div className="py-2">
            <button
              onClick={handleGuardarBorrador}
              className="w-full px-4 py-3 flex items-center gap-3 text-left hover:bg-slate-50 transition-colors text-sm text-slate-700"
            >
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-100 text-blue-600">
                <FileText className="h-4 w-4" />
              </div>
              <div className="flex-1">
                <div className="font-semibold text-slate-900">Guardar como borrador</div>
                <div className="text-xs text-slate-500">Guarda los cambios sin publicar</div>
              </div>
            </button>

            <button
              onClick={handlePublicar}
              className="w-full px-4 py-3 flex items-center gap-3 text-left hover:bg-slate-50 transition-colors text-sm text-slate-700"
            >
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-100 text-emerald-600">
                <Send className="h-4 w-4" />
              </div>
              <div className="flex-1">
                <div className="font-semibold text-slate-900">Publicar</div>
                <div className="text-xs text-slate-500">Publica la dieta para el cliente</div>
              </div>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

