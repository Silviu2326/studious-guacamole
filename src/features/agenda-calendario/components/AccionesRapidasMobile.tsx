import React, { useState } from 'react';
import { Plus, X, Calendar, Clock } from 'lucide-react';
import { Button } from '../../../components/componentsreutilizables';

interface AccionesRapidasMobileProps {
  onCrearSesion: () => void;
  onVerHoy: () => void;
  className?: string;
}

export const AccionesRapidasMobile: React.FC<AccionesRapidasMobileProps> = ({
  onCrearSesion,
  onVerHoy,
  className = '',
}) => {
  const [mostrarMenu, setMostrarMenu] = useState(false);

  return (
    <div className={`fixed bottom-20 right-4 z-50 ${className}`}>
      {mostrarMenu && (
        <div className="absolute bottom-16 right-0 mb-2 flex flex-col gap-2">
          <Button
            variant="primary"
            size="sm"
            onClick={() => {
              onVerHoy();
              setMostrarMenu(false);
            }}
            className="shadow-lg flex items-center gap-2"
          >
            <Clock className="w-4 h-4" />
            <span>Ir a hoy</span>
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => {
              onCrearSesion();
              setMostrarMenu(false);
            }}
            className="shadow-lg flex items-center gap-2"
          >
            <Calendar className="w-4 h-4" />
            <span>Nueva sesión</span>
          </Button>
        </div>
      )}
      <Button
        variant="primary"
        size="lg"
        onClick={() => setMostrarMenu(!mostrarMenu)}
        className="rounded-full w-14 h-14 shadow-lg flex items-center justify-center p-0"
      >
        {mostrarMenu ? (
          <X className="w-6 h-6" />
        ) : (
          <Plus className="w-6 h-6" />
        )}
      </Button>
    </div>
  );
};


