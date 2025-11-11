import React from 'react';
import { Suscripcion, HistorialCambio, TipoCambio } from '../types';
import { Card, Modal, Badge } from '../../../components/componentsreutilizables';
import { 
  History, 
  X, 
  Calendar, 
  User, 
  FileText, 
  DollarSign, 
  Package, 
  Play, 
  Pause, 
  Gift, 
  Snowflake,
  TrendingUp,
  TrendingDown,
  XCircle,
  Plus,
  Minus
} from 'lucide-react';

interface HistorialCambiosSuscripcionProps {
  suscripcion: Suscripcion;
  isOpen: boolean;
  onClose: () => void;
}

const getTipoCambioIcon = (tipo: TipoCambio) => {
  const iconos: Record<TipoCambio, React.ReactNode> = {
    creacion: <Plus className="w-5 h-5 text-green-600" />,
    actualizacion_precio: <DollarSign className="w-5 h-5 text-blue-600" />,
    cambio_plan: <Package className="w-5 h-5 text-purple-600" />,
    cambio_estado: <Play className="w-5 h-5 text-orange-600" />,
    cambio_fecha_vencimiento: <Calendar className="w-5 h-5 text-indigo-600" />,
    aplicacion_descuento: <TrendingDown className="w-5 h-5 text-green-600" />,
    eliminacion_descuento: <TrendingUp className="w-5 h-5 text-red-600" />,
    ajuste_sesiones: <FileText className="w-5 h-5 text-cyan-600" />,
    bonus_sesiones: <Gift className="w-5 h-5 text-pink-600" />,
    freeze: <Snowflake className="w-5 h-5 text-blue-400" />,
    unfreeze: <Play className="w-5 h-5 text-green-600" />,
    activacion_multisesion: <Package className="w-5 h-5 text-teal-600" />,
    desactivacion_multisesion: <Package className="w-5 h-5 text-gray-600" />,
    cancelacion: <XCircle className="w-5 h-5 text-red-600" />,
    otro: <FileText className="w-5 h-5 text-gray-600" />,
  };
  return iconos[tipo] || iconos.otro;
};

const getTipoCambioLabel = (tipo: TipoCambio): string => {
  const labels: Record<TipoCambio, string> = {
    creacion: 'Creación',
    actualizacion_precio: 'Actualización de Precio',
    cambio_plan: 'Cambio de Plan',
    cambio_estado: 'Cambio de Estado',
    cambio_fecha_vencimiento: 'Cambio de Fecha de Vencimiento',
    aplicacion_descuento: 'Aplicación de Descuento',
    eliminacion_descuento: 'Eliminación de Descuento',
    ajuste_sesiones: 'Ajuste de Sesiones',
    bonus_sesiones: 'Sesiones Bonus',
    freeze: 'Pausa (Freeze)',
    unfreeze: 'Reanudación',
    activacion_multisesion: 'Activación Multisesión',
    desactivacion_multisesion: 'Desactivación Multisesión',
    cancelacion: 'Cancelación',
    otro: 'Otro Cambio',
  };
  return labels[tipo] || labels.otro;
};

const getTipoCambioColor = (tipo: TipoCambio): 'success' | 'warning' | 'error' | 'info' => {
  if (tipo === 'creacion' || tipo === 'bonus_sesiones' || tipo === 'aplicacion_descuento' || tipo === 'unfreeze') {
    return 'success';
  }
  if (tipo === 'cancelacion' || tipo === 'eliminacion_descuento') {
    return 'error';
  }
  if (tipo === 'freeze' || tipo === 'cambio_estado') {
    return 'warning';
  }
  return 'info';
};

const formatValue = (value: any): string => {
  if (value === null || value === undefined) return '-';
  if (typeof value === 'boolean') return value ? 'Sí' : 'No';
  if (typeof value === 'number') {
    if (value % 1 === 0) return value.toString();
    return value.toFixed(2);
  }
  if (typeof value === 'string' && value.match(/^\d{4}-\d{2}-\d{2}/)) {
    return new Date(value).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }
  return String(value);
};

export const HistorialCambiosSuscripcion: React.FC<HistorialCambiosSuscripcionProps> = ({
  suscripcion,
  isOpen,
  onClose,
}) => {
  const historial = suscripcion.historialCambios || [];

  // Si no hay historial, crear un registro inicial de creación
  const historialCompleto: HistorialCambio[] = historial.length === 0
    ? [{
        id: 'creacion-inicial',
        suscripcionId: suscripcion.id,
        tipoCambio: 'creacion',
        fechaCambio: suscripcion.fechaCreacion,
        descripcion: `Suscripción creada - Plan: ${suscripcion.planNombre}`,
        cambios: [
          { campo: 'estado', valorNuevo: suscripcion.estado },
          { campo: 'precio', valorNuevo: suscripcion.precio },
          { campo: 'plan', valorNuevo: suscripcion.planNombre },
        ],
      }]
    : historial;

  // Ordenar por fecha descendente (más reciente primero)
  const historialOrdenado = [...historialCompleto].sort((a, b) => 
    new Date(b.fechaCambio).getTime() - new Date(a.fechaCambio).getTime()
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
        {/* Información de la suscripción */}
        <Card className="bg-gray-50 dark:bg-gray-800 p-4">
          <div className="flex items-center gap-3 mb-2">
            <History className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {suscripcion.clienteNombre}
            </h3>
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
            <p><strong>Plan:</strong> {suscripcion.planNombre}</p>
            <p><strong>Estado actual:</strong> {suscripcion.estado}</p>
            {suscripcion.motivoCancelacion && (
              <p className="text-red-600 dark:text-red-400">
                <strong>Motivo de cancelación:</strong> {suscripcion.motivoCancelacion}
              </p>
            )}
          </div>
        </Card>

        {/* Lista de cambios */}
        {historialOrdenado.length === 0 ? (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <History className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No hay cambios registrados en esta suscripción</p>
          </div>
        ) : (
          <div className="space-y-4 max-h-[600px] overflow-y-auto">
            {historialOrdenado.map((cambio, index) => (
              <Card key={cambio.id} className="p-4 border-l-4 border-l-blue-500">
                <div className="flex items-start gap-4">
                  {/* Icono */}
                  <div className="flex-shrink-0 mt-1">
                    {getTipoCambioIcon(cambio.tipoCambio)}
                  </div>

                  {/* Contenido */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge color={getTipoCambioColor(cambio.tipoCambio)}>
                        {getTipoCambioLabel(cambio.tipoCambio)}
                      </Badge>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {new Date(cambio.fechaCambio).toLocaleDateString('es-ES', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>

                    <p className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                      {cambio.descripcion}
                    </p>

                    {/* Detalles de cambios */}
                    {cambio.cambios && cambio.cambios.length > 0 && (
                      <div className="mt-3 space-y-2">
                        {cambio.cambios.map((detalle, idx) => (
                          <div
                            key={idx}
                            className="text-xs bg-gray-100 dark:bg-gray-700 p-2 rounded"
                          >
                            <div className="font-semibold text-gray-700 dark:text-gray-300 mb-1">
                              {detalle.campo}:
                            </div>
                            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                              {detalle.valorAnterior !== undefined && (
                                <>
                                  <span className="line-through text-red-600">
                                    {formatValue(detalle.valorAnterior)}
                                  </span>
                                  <span>→</span>
                                </>
                              )}
                              <span className="font-medium text-green-600 dark:text-green-400">
                                {formatValue(detalle.valorNuevo)}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Motivo */}
                    {cambio.motivo && (
                      <div className="mt-2 text-xs text-gray-600 dark:text-gray-400 italic">
                        <strong>Motivo:</strong> {cambio.motivo}
                      </div>
                    )}

                    {/* Realizado por */}
                    {cambio.realizadoPorNombre && (
                      <div className="mt-2 flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                        <User className="w-3 h-3" />
                        <span>Por: {cambio.realizadoPorNombre}</span>
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Footer con información adicional */}
        {suscripcion.fechaCancelacion && (
          <Card className="bg-red-50 dark:bg-red-900/20 p-4 border border-red-200 dark:border-red-800">
            <div className="flex items-center gap-2 text-red-800 dark:text-red-300">
              <XCircle className="w-5 h-5" />
              <div>
                <p className="font-semibold">Suscripción cancelada</p>
                <p className="text-sm">
                  Fecha de cancelación: {new Date(suscripcion.fechaCancelacion).toLocaleDateString('es-ES')}
                </p>
              </div>
            </div>
          </Card>
        )}
      </div>
    </Modal>
  );
};

