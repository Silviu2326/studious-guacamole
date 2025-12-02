import React, { useEffect, useState } from 'react';
import { Reserva } from '../types';
import { X, Calendar, Clock, User, Video, MapPin, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface NotificacionNuevaReservaToastProps {
  reserva: Reserva;
  onCerrar: () => void;
  duracion?: number; // Duración en milisegundos antes de cerrar automáticamente
}

export const NotificacionNuevaReservaToast: React.FC<NotificacionNuevaReservaToastProps> = ({
  reserva,
  onCerrar,
  duracion = 8000, // 8 segundos por defecto
}) => {
  const [visible, setVisible] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Cerrar automáticamente después de la duración especificada
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(onCerrar, 300); // Esperar a que termine la animación
    }, duracion);

    return () => clearTimeout(timer);
  }, [duracion, onCerrar]);

  const getTipoTexto = (tipo: string): string => {
    const tipos: Record<string, string> = {
      'sesion-1-1': 'Sesión 1 a 1',
      'fisio': 'Fisioterapia',
      'nutricion': 'Nutrición',
      'masaje': 'Masaje',
      'clase-grupal': 'Clase Grupal',
    };
    return tipos[tipo] || tipo;
  };

  const formatearFechaHora = (fecha: Date, horaInicio: string): string => {
    const ahora = new Date();
    const fechaHoraInicio = new Date(fecha);
    const [hora, minuto] = horaInicio.split(':').map(Number);
    fechaHoraInicio.setHours(hora, minuto, 0, 0);

    const esHoy = fechaHoraInicio.toDateString() === ahora.toDateString();

    if (esHoy) {
      return `Hoy a las ${horaInicio}`;
    } else {
      const esManana = new Date(ahora);
      esManana.setDate(esManana.getDate() + 1);
      const esMananaDate = esManana.toDateString() === fechaHoraInicio.toDateString();

      if (esMananaDate) {
        return `Mañana a las ${horaInicio}`;
      } else {
        return fecha.toLocaleDateString('es-ES', {
          weekday: 'short',
          day: 'numeric',
          month: 'short',
        }) + ` a las ${horaInicio}`;
      }
    }
  };

  const handleClick = () => {
    navigate('/reservas-online');
    onCerrar();
  };

  if (!visible) {
    return null;
  }

  return (
    <div
      className={`fixed top-4 right-4 z-50 max-w-md w-full bg-white rounded-lg shadow-2xl border-2 border-blue-500 transform transition-all duration-300 ${
        visible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
      }`}
      onClick={handleClick}
      style={{ cursor: 'pointer' }}
    >
      <div className="p-4">
        {/* Header con botón de cerrar */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-blue-100 rounded-lg">
              <CheckCircle className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h4 className="font-bold text-gray-900 text-sm">Nueva Reserva</h4>
              <p className="text-xs text-gray-600">Cliente ha realizado una reserva</p>
            </div>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setVisible(false);
              setTimeout(onCerrar, 300);
            }}
            className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Cerrar notificación"
          >
            <X className="w-4 h-4 text-gray-400" />
          </button>
        </div>

        {/* Contenido de la reserva */}
        <div className="space-y-2 pl-9">
          {/* Cliente */}
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-gray-400" />
            <span className="font-semibold text-gray-900">{reserva.clienteNombre}</span>
          </div>

          {/* Fecha y hora */}
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-700">{formatearFechaHora(reserva.fecha, reserva.horaInicio)}</span>
          </div>

          {/* Tipo de sesión */}
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-700">
              {reserva.horaInicio} - {reserva.horaFin}
            </span>
          </div>

          {/* Tipo y modalidad */}
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <span className="font-medium">{getTipoTexto(reserva.tipo)}</span>
            {reserva.tipoSesion && (
              <div className="flex items-center gap-1">
                {reserva.tipoSesion === 'videollamada' ? (
                  <>
                    <Video className="w-3 h-3" />
                    <span>Videollamada</span>
                  </>
                ) : (
                  <>
                    <MapPin className="w-3 h-3" />
                    <span>Presencial</span>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Precio */}
          <div className="pt-2 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Precio:</span>
              <span className="font-bold text-gray-900">€{reserva.precio.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Footer con acción */}
        <div className="mt-3 pt-3 border-t border-gray-200">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleClick();
            }}
            className="w-full text-center text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
          >
            Ver detalles de la reserva →
          </button>
        </div>
      </div>

      {/* Barra de progreso para mostrar tiempo restante */}
      <div className="h-1 bg-gray-200 rounded-b-lg overflow-hidden">
        <div
          className="h-full bg-blue-500 transition-all duration-linear"
          style={{
            width: '100%',
            animation: `shrink ${duracion}ms linear forwards`,
          }}
        />
      </div>

      <style>{`
        @keyframes shrink {
          from {
            width: 100%;
          }
          to {
            width: 0%;
          }
        }
      `}</style>
    </div>
  );
};


