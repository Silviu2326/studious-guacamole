import React, { useState, useEffect } from 'react';
import { Valoracion, EstadisticasValoraciones } from '../types';
import { getValoracionesProducto, crearValoracion, getEstadisticasValoraciones } from '../api/valoraciones';
import { Star, Filter, X, CheckCircle, AlertCircle } from 'lucide-react';
import { Card, Button, Textarea, Badge } from '../../../components/componentsreutilizables';

interface ValoracionesProductoProps {
  productoId: string;
  permiteCrearValoracion?: boolean;
  clienteIdOpcional?: string;
  nombreClienteOpcional?: string;
}

export const ValoracionesProducto: React.FC<ValoracionesProductoProps> = ({
  productoId,
  permiteCrearValoracion = false,
  clienteIdOpcional,
  nombreClienteOpcional,
}) => {
  const [valoraciones, setValoraciones] = useState<Valoracion[]>([]);
  const [estadisticas, setEstadisticas] = useState<EstadisticasValoraciones | null>(null);
  const [cargando, setCargando] = useState(true);
  const [filtroEstrellas, setFiltroEstrellas] = useState<number | null>(null);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [nuevaValoracion, setNuevaValoracion] = useState({
    rating: 5 as 1 | 2 | 3 | 4 | 5,
    comentario: '',
    nombreMostrado: nombreClienteOpcional || '',
  });
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [exito, setExito] = useState(false);

  useEffect(() => {
    cargarValoraciones();
  }, [productoId]);

  const cargarValoraciones = async () => {
    setCargando(true);
    try {
      const [valoracionesData, estadisticasData] = await Promise.all([
        getValoracionesProducto(productoId),
        getEstadisticasValoraciones(productoId),
      ]);
      setValoraciones(valoracionesData);
      setEstadisticas(estadisticasData);
    } catch (err) {
      console.error('Error cargando valoraciones:', err);
      setError('Error al cargar las valoraciones');
    } finally {
      setCargando(false);
    }
  };

  const handleCrearValoracion = async () => {
    if (!nuevaValoracion.nombreMostrado.trim()) {
      setError('Por favor, ingresa tu nombre');
      return;
    }

    setEnviando(true);
    setError(null);

    try {
      await crearValoracion({
        productoId,
        clienteIdOpcional,
        nombreMostradoOpcional: nuevaValoracion.nombreMostrado,
        rating: nuevaValoracion.rating,
        comentarioOpcional: nuevaValoracion.comentario || undefined,
        verificado: false,
      });

      setExito(true);
      setMostrarFormulario(false);
      setNuevaValoracion({
        rating: 5,
        comentario: '',
        nombreMostrado: nombreClienteOpcional || '',
      });

      // Recargar valoraciones
      await cargarValoraciones();

      // Ocultar mensaje de éxito después de 3 segundos
      setTimeout(() => setExito(false), 3000);
    } catch (err) {
      setError('Error al crear la valoración. Por favor, intenta de nuevo.');
      console.error(err);
    } finally {
      setEnviando(false);
    }
  };

  const renderStars = (rating: number, size: 'sm' | 'md' | 'lg' = 'md', clickable = false) => {
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
            } ${clickable ? 'cursor-pointer hover:fill-yellow-300' : ''}`}
            onClick={clickable ? () => setNuevaValoracion({ ...nuevaValoracion, rating: star as 1 | 2 | 3 | 4 | 5 }) : undefined}
          />
        ))}
      </div>
    );
  };

  const valoracionesFiltradas = filtroEstrellas
    ? valoraciones.filter((v) => v.rating === filtroEstrellas)
    : valoraciones;

  if (cargando) {
    return (
      <Card className="p-6">
        <div className="text-center text-gray-500">Cargando valoraciones...</div>
      </Card>
    );
  }

  if (!estadisticas || estadisticas.totalValoraciones === 0) {
    return (
      <Card className="p-6">
        <div className="text-center space-y-4">
          <p className="text-gray-600">Aún no hay valoraciones para este producto.</p>
          {permiteCrearValoracion && (
            <Button variant="primary" onClick={() => setMostrarFormulario(true)}>
              Sé el primero en valorar
            </Button>
          )}
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 space-y-6">
      {/* Header con estadísticas */}
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              {renderStars(Math.round(estadisticas.promedio), 'lg')}
              <span className="text-3xl font-bold text-gray-900">
                {estadisticas.promedio.toFixed(1)}
              </span>
            </div>
            <div className="text-gray-600">
              <p className="text-sm">
                {estadisticas.totalValoraciones} {estadisticas.totalValoraciones === 1 ? 'valoración' : 'valoraciones'}
              </p>
            </div>
          </div>

          {/* Distribución de estrellas */}
          <div className="space-y-1 pt-2">
            {[5, 4, 3, 2, 1].map((stars) => {
              const count = estadisticas.distribucion[stars as keyof typeof estadisticas.distribucion];
              const porcentaje = estadisticas.totalValoraciones > 0 
                ? (count / estadisticas.totalValoraciones) * 100 
                : 0;
              
              return (
                <div key={stars} className="flex items-center gap-2 text-sm">
                  <span className="text-gray-600 w-12">{stars} estrellas</span>
                  <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-yellow-400 transition-all"
                      style={{ width: `${porcentaje}%` }}
                    />
                  </div>
                  <span className="text-gray-500 w-12 text-right">{count}</span>
                </div>
              );
            })}
          </div>
        </div>

        {permiteCrearValoracion && (
          <Button
            variant="primary"
            onClick={() => setMostrarFormulario(!mostrarFormulario)}
          >
            {mostrarFormulario ? 'Cancelar' : 'Añadir valoración'}
          </Button>
        )}
      </div>

      {/* Mensajes de éxito/error */}
      {exito && (
        <div className="p-4 rounded-lg bg-green-50 border border-green-200 flex items-center gap-2">
          <CheckCircle size={20} className="text-green-600" />
          <p className="text-sm text-green-700">¡Valoración enviada con éxito!</p>
        </div>
      )}

      {error && (
        <div className="p-4 rounded-lg bg-red-50 border border-red-200 flex items-center gap-2">
          <AlertCircle size={20} className="text-red-600" />
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {/* Formulario para añadir valoración */}
      {mostrarFormulario && permiteCrearValoracion && (
        <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 space-y-4">
          <h3 className="font-semibold text-gray-900">Añade tu valoración</h3>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tu nombre
            </label>
            <input
              type="text"
              value={nuevaValoracion.nombreMostrado}
              onChange={(e) => setNuevaValoracion({ ...nuevaValoracion, nombreMostrado: e.target.value })}
              placeholder="Tu nombre"
              className="w-full rounded-lg bg-white text-slate-900 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Valoración
            </label>
            {renderStars(nuevaValoracion.rating, 'md', true)}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Comentario (opcional)
            </label>
            <Textarea
              value={nuevaValoracion.comentario}
              onChange={(e) => setNuevaValoracion({ ...nuevaValoracion, comentario: e.target.value })}
              placeholder="Comparte tu experiencia con este producto..."
              rows={4}
            />
          </div>

          <Button
            variant="primary"
            onClick={handleCrearValoracion}
            loading={enviando}
            fullWidth
          >
            Enviar valoración
          </Button>
        </div>
      )}

      {/* Filtro por estrellas */}
      {valoraciones.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 flex-wrap">
            <Filter size={16} className="text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Filtrar por:</span>
            <button
              onClick={() => setFiltroEstrellas(null)}
              className={`px-3 py-1 rounded-lg text-sm font-medium transition-all ${
                filtroEstrellas === null
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Todas
            </button>
            {[5, 4, 3, 2, 1].map((stars) => (
              <button
                key={stars}
                onClick={() => setFiltroEstrellas(stars)}
                className={`px-3 py-1 rounded-lg text-sm font-medium transition-all flex items-center gap-1 ${
                  filtroEstrellas === stars
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {stars} {renderStars(stars, 'sm')}
              </button>
            ))}
          </div>

          {/* Lista de valoraciones */}
          <div className="space-y-4 pt-4 border-t border-gray-200">
            {valoracionesFiltradas.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No hay valoraciones con {filtroEstrellas} estrellas
              </div>
            ) : (
              valoracionesFiltradas.map((valoracion) => (
                <div
                  key={valoracion.id}
                  className="p-4 bg-gray-50 rounded-lg border border-gray-200"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-white text-sm font-semibold">
                          {valoracion.nombreMostradoOpcional?.charAt(0).toUpperCase() || 'A'}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {valoracion.nombreMostradoOpcional || 'Anónimo'}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          {renderStars(valoracion.rating, 'sm')}
                          <span className="text-xs text-gray-500">
                            {new Date(valoracion.createdAt).toLocaleDateString('es-ES', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                            })}
                          </span>
                        </div>
                      </div>
                    </div>
                    {valoracion.verificado && (
                      <Badge variant="success" className="text-xs">
                        Verificada
                      </Badge>
                    )}
                  </div>
                  {valoracion.comentarioOpcional && (
                    <p className="text-sm text-gray-700 mt-3">
                      {valoracion.comentarioOpcional}
                    </p>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </Card>
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

