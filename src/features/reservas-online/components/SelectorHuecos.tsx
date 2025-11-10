import React, { useState, useEffect } from 'react';
import { Card } from '../../../components/componentsreutilizables';
import { Disponibilidad } from '../types';
import { getDisponibilidad } from '../api';
import { Calendar, Clock, Users, Check, Loader2 } from 'lucide-react';

interface SelectorHuecosProps {
  fecha: Date;
  role: 'entrenador' | 'gimnasio';
  onSeleccionarHueco: (disponibilidad: Disponibilidad) => void;
  huecoSeleccionado?: Disponibilidad;
  entrenadorId?: string;
}

export const SelectorHuecos: React.FC<SelectorHuecosProps> = ({
  fecha,
  role,
  onSeleccionarHueco,
  huecoSeleccionado,
  entrenadorId,
}) => {
  const [disponibilidad, setDisponibilidad] = useState<Disponibilidad[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargarDisponibilidad = async () => {
      setLoading(true);
      const disp = await getDisponibilidad(fecha, role, entrenadorId);
      setDisponibilidad(disp);
      setLoading(false);
    };
    cargarDisponibilidad();
  }, [fecha, role, entrenadorId]);

  const formatearFecha = (fecha: Date) => {
    return fecha.toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <Card className="p-8 text-center bg-white shadow-sm">
        <Loader2 size={48} className="mx-auto text-blue-500 animate-spin mb-4" />
        <p className="text-gray-600">Cargando disponibilidad...</p>
      </Card>
    );
  }

  return (
    <Card className="bg-white shadow-sm">
      <div className="p-6 space-y-4">
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-blue-600" />
          <h3 className="text-xl font-bold text-gray-900">
            {formatearFecha(fecha)}
          </h3>
        </div>

        {disponibilidad.length === 0 ? (
          <Card className="p-8 text-center bg-white shadow-sm">
            <Clock size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Sin disponibilidad</h3>
            <p className="text-gray-600">No hay horarios disponibles para esta fecha</p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {disponibilidad.map((hueco) => (
              <button
                key={hueco.id}
                onClick={() => hueco.disponible && onSeleccionarHueco(hueco)}
                disabled={!hueco.disponible}
                className={`
                  p-4 rounded-xl border-2 transition-all duration-200 text-left
                  ${huecoSeleccionado?.id === hueco.id
                    ? 'border-blue-600 bg-blue-50'
                    : hueco.disponible
                    ? 'border-slate-300 hover:border-blue-600 hover:bg-slate-50'
                    : 'border-slate-300 opacity-50 cursor-not-allowed bg-slate-100'
                  }
                `}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-slate-600" />
                    <div>
                      <span className="text-sm font-semibold text-gray-900">
                        {hueco.horaInicio} - {hueco.horaFin}
                      </span>
                      {hueco.duracionMinutos && (
                        <span className="text-xs text-gray-500 ml-2">
                          ({hueco.duracionMinutos} min)
                        </span>
                      )}
                    </div>
                  </div>
                  {huecoSeleccionado?.id === hueco.id && (
                    <Check className="w-5 h-5 text-blue-600" />
                  )}
                </div>

                {role === 'gimnasio' && hueco.claseNombre && (
                  <div className="mt-2">
                    <p className="text-sm text-gray-600">
                      {hueco.claseNombre}
                    </p>
                    {hueco.capacidad && hueco.ocupacion !== undefined && (
                      <div className="flex items-center gap-2 mt-2">
                        <Users className="w-4 h-4 text-slate-600" />
                        <span className="text-xs text-gray-500">
                          {hueco.ocupacion}/{hueco.capacidad} plazas
                        </span>
                      </div>
                    )}
                  </div>
                )}

                {!hueco.disponible && (
                  <span className="text-xs text-red-600 mt-2 block">
                    Ocupado
                  </span>
                )}
              </button>
            ))}
          </div>
        )}
      </div>
    </Card>
  );
};
