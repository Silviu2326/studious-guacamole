import React, { useState, useEffect } from 'react';
import { Modal, Button, Card, Badge } from '../../../components/componentsreutilizables';
import { getHistorialCambios, revertirCambio } from '../api';
import { HistorialCambioDieta, Dieta } from '../types';
import {
  History,
  RotateCcw,
  Clock,
  User,
  ChevronDown,
  ChevronUp,
  AlertCircle,
} from 'lucide-react';

interface HistorialCambiosProps {
  dieta: Dieta;
  isOpen: boolean;
  onClose: () => void;
  onRevertir?: (dieta: Dieta) => void;
}

const tipoCambioLabels: Record<string, string> = {
  creacion: 'Creación',
  actualizacion_macros: 'Actualización de macros',
  actualizacion_comidas: 'Actualización de comidas',
  cambio_objetivo: 'Cambio de objetivo',
  cambio_estado: 'Cambio de estado',
  cambio_restricciones: 'Cambio de restricciones',
  publicacion: 'Publicación',
  guardado_borrador: 'Guardado como borrador',
  duplicacion_semana: 'Duplicación de semana',
  otro: 'Otro cambio',
};

const tipoCambioColors: Record<string, string> = {
  creacion: 'bg-blue-100 text-blue-700 border-blue-200',
  actualizacion_macros: 'bg-purple-100 text-purple-700 border-purple-200',
  actualizacion_comidas: 'bg-green-100 text-green-700 border-green-200',
  cambio_objetivo: 'bg-amber-100 text-amber-700 border-amber-200',
  cambio_estado: 'bg-indigo-100 text-indigo-700 border-indigo-200',
  cambio_restricciones: 'bg-orange-100 text-orange-700 border-orange-200',
  publicacion: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  guardado_borrador: 'bg-gray-100 text-gray-700 border-gray-200',
  duplicacion_semana: 'bg-cyan-100 text-cyan-700 border-cyan-200',
  otro: 'bg-slate-100 text-slate-700 border-slate-200',
};

export const HistorialCambios: React.FC<HistorialCambiosProps> = ({
  dieta,
  isOpen,
  onClose,
  onRevertir,
}) => {
  const [historial, setHistorial] = useState<HistorialCambioDieta[]>([]);
  const [cargando, setCargando] = useState(false);
  const [revertiendo, setRevertiendo] = useState<string | null>(null);
  const [cambiosExpandidos, setCambiosExpandidos] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (isOpen && dieta.id) {
      cargarHistorial();
    }
  }, [isOpen, dieta.id]);

  const cargarHistorial = async () => {
    setCargando(true);
    try {
      const cambios = await getHistorialCambios(dieta.id);
      setHistorial(cambios);
    } catch (error) {
      console.error('Error cargando historial:', error);
    } finally {
      setCargando(false);
    }
  };

  const handleRevertir = async (cambioId: string) => {
    if (!confirm('¿Estás seguro de que quieres revertir a esta versión? Se perderán los cambios posteriores.')) {
      return;
    }

    setRevertiendo(cambioId);
    try {
      const dietaRestaurada = await revertirCambio(dieta.id, cambioId);
      if (dietaRestaurada && onRevertir) {
        onRevertir(dietaRestaurada);
        await cargarHistorial();
        alert('Cambio revertido exitosamente');
      }
    } catch (error) {
      console.error('Error revirtiendo cambio:', error);
      alert('Error al revertir el cambio. Por favor, intenta de nuevo.');
    } finally {
      setRevertiendo(null);
    }
  };

  const toggleExpandir = (cambioId: string) => {
    setCambiosExpandidos(prev => {
      const nuevo = new Set(prev);
      if (nuevo.has(cambioId)) {
        nuevo.delete(cambioId);
      } else {
        nuevo.add(cambioId);
      }
      return nuevo;
    });
  };

  const formatearFecha = (fecha: string) => {
    const date = new Date(fecha);
    return date.toLocaleString('es-ES', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatearFechaRelativa = (fecha: string) => {
    const date = new Date(fecha);
    const ahora = new Date();
    const diffMs = ahora.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Hace un momento';
    if (diffMins < 60) return `Hace ${diffMins} min`;
    if (diffHours < 24) return `Hace ${diffHours} h`;
    if (diffDays < 7) return `Hace ${diffDays} días`;
    return formatearFecha(fecha);
  };

  const historialOrdenado = [...historial].sort(
    (a, b) => new Date(b.fechaCambio).getTime() - new Date(a.fechaCambio).getTime()
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Historial de Cambios"
      size="xl"
      showCloseButton={true}
    >
      <div className="space-y-4">
        {/* Información de la dieta */}
        <Card className="bg-slate-50 border border-slate-200 p-4">
          <div className="flex items-center gap-3 mb-2">
            <History className="w-5 h-5 text-slate-600" />
            <h3 className="text-lg font-semibold text-slate-900">{dieta.nombre}</h3>
          </div>
          <div className="text-sm text-slate-600 space-y-1">
            <p>
              <strong>Cliente:</strong> {dieta.clienteNombre || 'N/A'}
            </p>
            <p>
              <strong>Estado actual:</strong>{' '}
              <Badge className="bg-blue-100 text-blue-700 text-xs">
                {dieta.estado}
              </Badge>
            </p>
            <p>
              <strong>Última actualización:</strong> {formatearFecha(dieta.actualizadoEn)}
            </p>
          </div>
        </Card>

        {/* Lista de cambios */}
        {cargando ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
            <p className="text-sm text-slate-600">Cargando historial...</p>
          </div>
        ) : historialOrdenado.length === 0 ? (
          <Card className="bg-slate-50 border border-slate-200 p-8 text-center">
            <History className="w-12 h-12 text-slate-400 mx-auto mb-3" />
            <p className="text-slate-600">No hay cambios registrados aún</p>
            <p className="text-sm text-slate-500 mt-1">
              Los cambios se registrarán automáticamente cuando modifiques la dieta
            </p>
          </Card>
        ) : (
          <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
            {historialOrdenado.map((cambio) => {
              const estaExpandido = cambiosExpandidos.has(cambio.id);
              const puedeRevertir = cambio.snapshot !== undefined;

              return (
                <Card
                  key={cambio.id}
                  className="bg-white border border-slate-200 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge
                            className={`${tipoCambioColors[cambio.tipoCambio] || tipoCambioColors.otro} text-xs py-1 px-2 rounded-full border font-medium`}
                          >
                            {tipoCambioLabels[cambio.tipoCambio] || 'Cambio'}
                          </Badge>
                          <div className="flex items-center gap-1 text-xs text-slate-500">
                            <Clock className="w-3 h-3" />
                            <span>{formatearFechaRelativa(cambio.fechaCambio)}</span>
                          </div>
                        </div>

                        <p className="text-sm font-medium text-slate-900 mb-1">
                          {cambio.descripcion}
                        </p>

                        {cambio.realizadoPorNombre && (
                          <div className="flex items-center gap-1 text-xs text-slate-500 mb-2">
                            <User className="w-3 h-3" />
                            <span>Por: {cambio.realizadoPorNombre}</span>
                          </div>
                        )}

                        {cambio.cambios.length > 0 && (
                          <button
                            onClick={() => toggleExpandir(cambio.id)}
                            className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 mt-2"
                          >
                            {estaExpandido ? (
                              <>
                                <ChevronUp className="w-3 h-3" />
                                Ocultar detalles
                              </>
                            ) : (
                              <>
                                <ChevronDown className="w-3 h-3" />
                                Ver detalles ({cambio.cambios.length})
                              </>
                            )}
                          </button>
                        )}

                        {estaExpandido && cambio.cambios.length > 0 && (
                          <div className="mt-3 pt-3 border-t border-slate-200 space-y-2">
                            {cambio.cambios.map((detalle, idx) => (
                              <div
                                key={idx}
                                className="text-xs bg-slate-50 rounded-lg p-2 border border-slate-200"
                              >
                                <div className="font-medium text-slate-700 mb-1">
                                  {detalle.campo}
                                </div>
                                {detalle.descripcion && (
                                  <div className="text-slate-600 mb-1">{detalle.descripcion}</div>
                                )}
                                {detalle.valorAnterior !== undefined && (
                                  <div className="text-slate-500">
                                    <span className="font-medium">Antes:</span>{' '}
                                    {typeof detalle.valorAnterior === 'object'
                                      ? JSON.stringify(detalle.valorAnterior)
                                      : String(detalle.valorAnterior)}
                                  </div>
                                )}
                                {detalle.valorNuevo !== undefined && (
                                  <div className="text-slate-700">
                                    <span className="font-medium">Ahora:</span>{' '}
                                    {typeof detalle.valorNuevo === 'object'
                                      ? JSON.stringify(detalle.valorNuevo)
                                      : String(detalle.valorNuevo)}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {puedeRevertir && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRevertir(cambio.id)}
                          disabled={revertiendo === cambio.id}
                          leftIcon={<RotateCcw className="w-4 h-4" />}
                          className="text-xs"
                        >
                          {revertiendo === cambio.id ? 'Revirtiendo...' : 'Revertir'}
                        </Button>
                      )}
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}

        {historialOrdenado.length > 0 && (
          <div className="flex items-center gap-2 text-xs text-slate-500 bg-blue-50 border border-blue-200 rounded-lg p-3">
            <AlertCircle className="w-4 h-4 text-blue-600" />
            <span>
              Solo puedes revertir cambios que tengan un snapshot guardado. Los cambios más
              antiguos pueden no estar disponibles para revertir.
            </span>
          </div>
        )}
      </div>
    </Modal>
  );
};

