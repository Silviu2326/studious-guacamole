import React from 'react';
import { EstadisticasValoraciones, ValoracionProducto } from '../types';
import { Star } from 'lucide-react';
import { Badge } from '../../../components/componentsreutilizables';

interface ValoracionesProductoProps {
  estadisticas: EstadisticasValoraciones;
  valoraciones?: ValoracionProducto[];
  mostrarComentarios?: boolean;
  limiteComentarios?: number;
}

export const ValoracionesProducto: React.FC<ValoracionesProductoProps> = ({
  estadisticas,
  valoraciones = [],
  mostrarComentarios = false,
  limiteComentarios = 3,
}) => {
  const renderStars = (rating: number, size: 'sm' | 'md' | 'lg' = 'md') => {
    const starSize = size === 'sm' ? 12 : size === 'md' ? 16 : 20;
    return (
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={starSize}
            className={`${
              star <= rating
                ? 'fill-yellow-400 text-yellow-400'
                : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    );
  };

  if (estadisticas.totalValoraciones === 0) {
    return null;
  }

  return (
    <div className="space-y-3">
      {/* Estadísticas de valoraciones */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1">
          {renderStars(Math.round(estadisticas.promedio), 'md')}
          <span className="text-lg font-bold text-gray-900 ml-1">
            {estadisticas.promedio.toFixed(1)}
          </span>
        </div>
        <span className="text-sm text-gray-600">
          ({estadisticas.totalValoraciones} {estadisticas.totalValoraciones === 1 ? 'valoración' : 'valoraciones'})
        </span>
      </div>

      {/* Comentarios destacados */}
      {mostrarComentarios && valoraciones.length > 0 && (
        <div className="space-y-3 pt-2 border-t border-gray-200">
          <h4 className="text-sm font-semibold text-gray-900">
            Comentarios de clientes
          </h4>
          {valoraciones.slice(0, limiteComentarios).map((valoracion) => (
            <div
              key={valoracion.id}
              className="p-3 bg-gray-50 rounded-lg border border-gray-200"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-semibold">
                      {valoracion.clienteNombre.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {valoracion.clienteNombre}
                    </p>
                    <div className="flex items-center gap-1">
                      {renderStars(valoracion.rating, 'sm')}
                    </div>
                  </div>
                </div>
                {valoracion.verificada && (
                  <Badge variant="success" className="text-xs">
                    Verificada
                  </Badge>
                )}
              </div>
              {valoracion.comentario && (
                <p className="text-sm text-gray-700 mt-2">
                  {valoracion.comentario}
                </p>
              )}
              <p className="text-xs text-gray-500 mt-2">
                {new Date(valoracion.fecha).toLocaleDateString('es-ES', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </div>
          ))}
          {valoraciones.length > limiteComentarios && (
            <p className="text-xs text-gray-500 text-center">
              Y {valoraciones.length - limiteComentarios} más...
            </p>
          )}
        </div>
      )}
    </div>
  );
};

interface ValoracionEstrellaProps {
  promedio: number;
  totalValoraciones: number;
  size?: 'sm' | 'md' | 'lg';
  mostrarTotal?: boolean;
}

export const ValoracionEstrella: React.FC<ValoracionEstrellaProps> = ({
  promedio,
  totalValoraciones,
  size = 'md',
  mostrarTotal = true,
}) => {
  const starSize = size === 'sm' ? 12 : size === 'md' ? 14 : 18;
  const ratingRounded = Math.round(promedio);

  if (totalValoraciones === 0) {
    return (
      <div className="flex items-center gap-1">
        <Star size={starSize} className="text-gray-300" />
        <span className="text-xs text-gray-500">Sin valoraciones</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1.5">
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={starSize}
            className={`${
              star <= ratingRounded
                ? 'fill-yellow-400 text-yellow-400'
                : 'text-gray-300'
            }`}
          />
        ))}
      </div>
      <span className={`font-semibold text-gray-900 ${size === 'sm' ? 'text-xs' : size === 'md' ? 'text-sm' : 'text-base'}`}>
        {promedio.toFixed(1)}
      </span>
      {mostrarTotal && (
        <span className={`text-gray-500 ${size === 'sm' ? 'text-xs' : 'text-sm'}`}>
          ({totalValoraciones})
        </span>
      )}
    </div>
  );
};

