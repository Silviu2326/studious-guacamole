import React, { useState, useEffect } from 'react';
import { Card, Button } from '../../../components/componentsreutilizables';
import { Image as ImageIcon, Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { FotoComida, getFotosPorCheckIn, getFotosPorTipoComida } from '../api/fotos';
import { CheckInNutricional } from '../api/checkins';

interface ComparadorFotosProps {
  clienteId: string;
  checkIn: CheckInNutricional;
}

export const ComparadorFotos: React.FC<ComparadorFotosProps> = ({
  clienteId,
  checkIn,
}) => {
  const [fotosActuales, setFotosActuales] = useState<FotoComida[]>([]);
  const [fotosAnteriores, setFotosAnteriores] = useState<FotoComida[]>([]);
  const [cargando, setCargando] = useState(true);
  const [indiceFotoAnterior, setIndiceFotoAnterior] = useState(0);

  useEffect(() => {
    cargarFotos();
  }, [clienteId, checkIn.id, checkIn.tipoComida, checkIn.fecha]);

  const cargarFotos = async () => {
    if (!checkIn.id) return;
    
    setCargando(true);
    try {
      // Cargar fotos del check-in actual
      const fotosCheckIn = await getFotosPorCheckIn(checkIn.id);
      setFotosActuales(fotosCheckIn);

      // Cargar fotos anteriores del mismo tipo de comida
      const fotosPrevias = await getFotosPorTipoComida(
        clienteId,
        checkIn.tipoComida,
        checkIn.fecha
      );
      setFotosAnteriores(fotosPrevias);
      setIndiceFotoAnterior(0);
    } catch (error) {
      console.error('Error al cargar fotos:', error);
    } finally {
      setCargando(false);
    }
  };

  const fotoAnteriorSeleccionada = fotosAnteriores[indiceFotoAnterior] || null;

  const formatearFecha = (fecha: string) => {
    return new Date(fecha).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  const siguienteFotoAnterior = () => {
    if (indiceFotoAnterior < fotosAnteriores.length - 1) {
      setIndiceFotoAnterior(indiceFotoAnterior + 1);
    }
  };

  const anteriorFotoAnterior = () => {
    if (indiceFotoAnterior > 0) {
      setIndiceFotoAnterior(indiceFotoAnterior - 1);
    }
  };

  if (cargando) {
    return (
      <Card className="p-8 text-center bg-white shadow-sm">
        <div className="animate-pulse">
          <ImageIcon size={48} className="mx-auto text-gray-400 mb-4" />
          <p className="text-gray-600">Cargando fotos...</p>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">
          Comparación de Fotos
        </h3>
        {fotosAnteriores.length > 0 && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span>
              {indiceFotoAnterior + 1} de {fotosAnteriores.length} foto(s) anterior(es)
            </span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Fotos Actuales */}
        <Card className="p-4 bg-white shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <div className="p-2 bg-blue-100 rounded-lg">
              <ImageIcon size={18} className="text-blue-600" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-gray-900">
                Fotos Actuales
              </h4>
              <p className="text-xs text-gray-500">
                {formatearFecha(checkIn.fecha)}
              </p>
            </div>
          </div>

          {fotosActuales.length > 0 ? (
            <div className="space-y-4">
              {fotosActuales.map((foto) => (
                <div key={foto.id} className="relative">
                  <div className="relative h-64 bg-gray-100 rounded-lg overflow-hidden">
                    <img
                      src={foto.url}
                      alt={foto.descripcion || 'Foto actual'}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  {foto.descripcion && (
                    <p className="text-xs text-gray-600 mt-2">
                      {foto.descripcion}
                    </p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
              <ImageIcon size={32} className="mx-auto text-gray-400 mb-2" />
              <p className="text-sm text-gray-500">
                No hay fotos disponibles para este check-in
              </p>
            </div>
          )}
        </Card>

        {/* Fotos Anteriores */}
        <Card className="p-4 bg-white shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Calendar size={18} className="text-purple-600" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-gray-900">
                Fotos Anteriores
              </h4>
              <p className="text-xs text-gray-500">
                Mismo tipo de comida
              </p>
            </div>
          </div>

          {fotosAnteriores.length > 0 ? (
            <div className="space-y-4">
              <div className="relative">
                <div className="relative h-64 bg-gray-100 rounded-lg overflow-hidden">
                  <img
                    src={fotoAnteriorSeleccionada.url}
                    alt={fotoAnteriorSeleccionada.descripcion || 'Foto anterior'}
                    className="w-full h-full object-cover"
                  />
                </div>
                {fotoAnteriorSeleccionada.descripcion && (
                  <p className="text-xs text-gray-600 mt-2">
                    {fotoAnteriorSeleccionada.descripcion}
                  </p>
                )}
                <p className="text-xs text-gray-500 mt-1">
                  {formatearFecha(fotoAnteriorSeleccionada.fecha)}
                </p>
              </div>

              {fotosAnteriores.length > 1 && (
                <div className="flex items-center justify-between gap-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={anteriorFotoAnterior}
                    disabled={indiceFotoAnterior === 0}
                  >
                    <ChevronLeft size={16} className="mr-1" />
                    Anterior
                  </Button>
                  <span className="text-xs text-gray-500">
                    {indiceFotoAnterior + 1} / {fotosAnteriores.length}
                  </span>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={siguienteFotoAnterior}
                    disabled={indiceFotoAnterior === fotosAnteriores.length - 1}
                  >
                    Siguiente
                    <ChevronRight size={16} className="ml-1" />
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <div className="p-8 text-center bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
              <Calendar size={32} className="mx-auto text-gray-400 mb-2" />
              <p className="text-sm text-gray-500">
                No hay fotos anteriores para comparar
              </p>
            </div>
          )}
        </Card>
      </div>

      {/* Área de comentarios de evolución */}
      {fotosActuales.length > 0 && fotoAnteriorSeleccionada && (
        <Card className="p-4 bg-blue-50 border border-blue-200">
          <h4 className="text-sm font-semibold text-gray-900 mb-2">
            Observaciones de Evolución
          </h4>
          <p className="text-xs text-gray-600">
            Compara visualmente las fotos para evaluar la evolución del cliente. 
            Puedes agregar comentarios específicos sobre mejoras o áreas de atención 
            en el feedback del entrenador.
          </p>
        </Card>
      )}
    </div>
  );
};

