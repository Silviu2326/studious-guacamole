import React, { useEffect, useRef } from 'react';
import { Edit2, X, MoreVertical } from 'lucide-react';
import { Cita } from '../types';

interface MenuContextualSesionProps {
  cita: Cita;
  position: { x: number; y: number };
  onClose: () => void;
  onEditar: (cita: Cita, editarSerie: boolean) => void;
  onCancelar: (cita: Cita, cancelarSerie: boolean) => void;
}

export const MenuContextualSesion: React.FC<MenuContextualSesionProps> = ({
  cita,
  position,
  onClose,
  onEditar,
  onCancelar,
}) => {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [onClose]);

  const tieneRecurrencia = cita.recurrencia && cita.recurrencia.serieId;

  return (
    <div
      ref={menuRef}
      className="fixed bg-white border border-gray-200 rounded-lg shadow-lg z-50 py-2 min-w-[200px]"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
      }}
    >
      <button
        onClick={() => {
          onEditar(cita, false);
          onClose();
        }}
        className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
      >
        <Edit2 className="w-4 h-4" />
        <span>Editar sesión</span>
      </button>

      {tieneRecurrencia && (
        <button
          onClick={() => {
            onEditar(cita, true);
            onClose();
          }}
          className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
        >
          <Edit2 className="w-4 h-4" />
          <span>Editar serie completa</span>
        </button>
      )}

      <div className="border-t border-gray-200 my-1" />

      <button
        onClick={() => {
          onCancelar(cita, false);
          onClose();
        }}
        className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2"
      >
        <X className="w-4 h-4" />
        <span>Cancelar sesión</span>
      </button>

      {tieneRecurrencia && (
        <button
          onClick={() => {
            onCancelar(cita, true);
            onClose();
          }}
          className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2"
        >
          <X className="w-4 h-4" />
          <span>Cancelar serie completa</span>
        </button>
      )}
    </div>
  );
};

// Componente de botón de acciones rápidas
interface BotonAccionesRapidasProps {
  cita: Cita;
  onEditar: (cita: Cita, editarSerie: boolean) => void;
  onCancelar: (cita: Cita, cancelarSerie: boolean) => void;
}

export const BotonAccionesRapidas: React.FC<BotonAccionesRapidasProps> = ({
  cita,
  onEditar,
  onCancelar,
}) => {
  const [mostrarMenu, setMostrarMenu] = React.useState(false);
  const botonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (botonRef.current && !botonRef.current.contains(event.target as Node)) {
        setMostrarMenu(false);
      }
    };

    if (mostrarMenu) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [mostrarMenu]);

  const tieneRecurrencia = cita.recurrencia && cita.recurrencia.serieId;

  return (
    <div className="relative">
      <button
        ref={botonRef}
        onClick={(e) => {
          e.stopPropagation();
          setMostrarMenu(!mostrarMenu);
        }}
        className="p-1.5 rounded hover:bg-gray-100 text-gray-600 hover:text-gray-900 transition-colors"
        title="Acciones"
      >
        <MoreVertical className="w-4 h-4" />
      </button>

      {mostrarMenu && (
        <div className="absolute right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 py-2 min-w-[200px]">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEditar(cita, false);
              setMostrarMenu(false);
            }}
            className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
          >
            <Edit2 className="w-4 h-4" />
            <span>Editar sesión</span>
          </button>

          {tieneRecurrencia && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEditar(cita, true);
                setMostrarMenu(false);
              }}
              className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
            >
              <Edit2 className="w-4 h-4" />
              <span>Editar serie completa</span>
            </button>
          )}

          <div className="border-t border-gray-200 my-1" />

          <button
            onClick={(e) => {
              e.stopPropagation();
              onCancelar(cita, false);
              setMostrarMenu(false);
            }}
            className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2"
          >
            <X className="w-4 h-4" />
            <span>Cancelar sesión</span>
          </button>

          {tieneRecurrencia && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onCancelar(cita, true);
                setMostrarMenu(false);
              }}
              className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2"
            >
              <X className="w-4 h-4" />
              <span>Cancelar serie completa</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
};


