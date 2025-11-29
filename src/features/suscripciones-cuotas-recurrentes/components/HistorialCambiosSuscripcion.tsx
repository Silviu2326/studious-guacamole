import React, { useState, useMemo } from 'react';
import { Suscripcion, HistorialCambio, TipoCambio, EventoSuscripcion, TipoEventoSuscripcion } from '../types';
import { Card, Modal, Badge, Button, Select, Input } from '../../../components/componentsreutilizables';
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
  Minus,
  Download,
  Filter,
  RefreshCw
} from 'lucide-react';

interface HistorialCambiosSuscripcionProps {
  suscripcion: Suscripcion;
  isOpen: boolean;
  onClose: () => void;
}

// Función para convertir HistorialCambio a EventoSuscripcion
const convertirAEventoSuscripcion = (cambio: HistorialCambio, suscripcion: Suscripcion): EventoSuscripcion => {
  const tipoEventoMap: Record<TipoCambio, TipoEventoSuscripcion> = {
    creacion: 'alta',
    cambio_plan: 'cambio_plan',
    freeze: 'congelacion',
    unfreeze: 'descongelacion',
    cancelacion: 'cancelacion',
    aplicacion_descuento: 'aplicacion_descuento',
    eliminacion_descuento: 'eliminacion_descuento',
    ajuste_sesiones: 'ajuste_sesiones',
    bonus_sesiones: 'bonus_sesiones',
    actualizacion_precio: 'cambio_plan',
    cambio_estado: 'cambio_plan',
    cambio_fecha_vencimiento: 'cambio_plan',
    activacion_multisesion: 'cambio_plan',
    desactivacion_multisesion: 'cambio_plan',
    otro: 'cambio_plan',
  };

  return {
    id: cambio.id,
    suscripcionId: cambio.suscripcionId,
    clienteId: suscripcion.clienteId,
    clienteNombre: suscripcion.clienteNombre,
    clienteEmail: suscripcion.clienteEmail,
    tipoEvento: tipoEventoMap[cambio.tipoCambio] || 'cambio_plan',
    fecha: cambio.fechaCambio,
    descripcion: cambio.descripcion,
    detalles: cambio.cambios,
    realizadoPor: cambio.realizadoPor,
    realizadoPorNombre: cambio.realizadoPorNombre,
    motivo: cambio.motivo,
    metadata: cambio.metadata,
  };
};

const getTipoEventoIcon = (tipo: TipoEventoSuscripcion) => {
  const iconos: Record<TipoEventoSuscripcion, React.ReactNode> = {
    alta: <Plus className="w-5 h-5 text-green-600" />,
    upgrade: <TrendingUp className="w-5 h-5 text-blue-600" />,
    downgrade: <TrendingDown className="w-5 h-5 text-orange-600" />,
    congelacion: <Snowflake className="w-5 h-5 text-blue-400" />,
    descongelacion: <Play className="w-5 h-5 text-green-600" />,
    pago_fallido: <XCircle className="w-5 h-5 text-red-600" />,
    cancelacion: <XCircle className="w-5 h-5 text-red-600" />,
    renovacion: <RefreshCw className="w-5 h-5 text-blue-600" />,
    cambio_plan: <Package className="w-5 h-5 text-purple-600" />,
    aplicacion_descuento: <TrendingDown className="w-5 h-5 text-green-600" />,
    eliminacion_descuento: <TrendingUp className="w-5 h-5 text-red-600" />,
    ajuste_sesiones: <FileText className="w-5 h-5 text-cyan-600" />,
    bonus_sesiones: <Gift className="w-5 h-5 text-pink-600" />,
  };
  return iconos[tipo] || <FileText className="w-5 h-5 text-gray-600" />;
};

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

const getTipoEventoLabel = (tipo: TipoEventoSuscripcion): string => {
  const labels: Record<TipoEventoSuscripcion, string> = {
    alta: 'Alta',
    upgrade: 'Upgrade',
    downgrade: 'Downgrade',
    congelacion: 'Congelación',
    descongelacion: 'Descongelación',
    pago_fallido: 'Pago Fallido',
    cancelacion: 'Cancelación',
    renovacion: 'Renovación',
    cambio_plan: 'Cambio de Plan',
    aplicacion_descuento: 'Aplicación de Descuento',
    eliminacion_descuento: 'Eliminación de Descuento',
    ajuste_sesiones: 'Ajuste de Sesiones',
    bonus_sesiones: 'Sesiones Bonus',
  };
  return labels[tipo] || 'Cambio';
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

const getTipoEventoColor = (tipo: TipoEventoSuscripcion): 'success' | 'warning' | 'error' | 'info' => {
  if (tipo === 'alta' || tipo === 'bonus_sesiones' || tipo === 'aplicacion_descuento' || tipo === 'descongelacion' || tipo === 'renovacion') {
    return 'success';
  }
  if (tipo === 'cancelacion' || tipo === 'pago_fallido' || tipo === 'eliminacion_descuento') {
    return 'error';
  }
  if (tipo === 'congelacion' || tipo === 'downgrade') {
    return 'warning';
  }
  return 'info';
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
  const [filtroTipoEvento, setFiltroTipoEvento] = useState<TipoEventoSuscripcion | 'todos'>('todos');
  const [fechaInicio, setFechaInicio] = useState<string>('');
  const [fechaFin, setFechaFin] = useState<string>('');

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

  // Convertir a EventoSuscripcion
  const eventos: EventoSuscripcion[] = historialCompleto.map(cambio => 
    convertirAEventoSuscripcion(cambio, suscripcion)
  );

  // Filtrar eventos
  const eventosFiltrados = useMemo(() => {
    let filtrados = [...eventos];

    // Filtrar por tipo de evento
    if (filtroTipoEvento !== 'todos') {
      filtrados = filtrados.filter(e => e.tipoEvento === filtroTipoEvento);
    }

    // Filtrar por rango de fechas
    if (fechaInicio) {
      const inicio = new Date(fechaInicio);
      filtrados = filtrados.filter(e => new Date(e.fecha) >= inicio);
    }
    if (fechaFin) {
      const fin = new Date(fechaFin);
      fin.setHours(23, 59, 59, 999); // Incluir todo el día
      filtrados = filtrados.filter(e => new Date(e.fecha) <= fin);
    }

    // Ordenar por fecha descendente (más reciente primero)
    return filtrados.sort((a, b) => 
      new Date(b.fecha).getTime() - new Date(a.fecha).getTime()
    );
  }, [eventos, filtroTipoEvento, fechaInicio, fechaFin]);

  // Exportar a CSV/Excel (simulado)
  const handleExportar = (formato: 'csv' | 'excel') => {
    const eventosExportar = eventosFiltrados.map(e => ({
      Fecha: new Date(e.fecha).toLocaleDateString('es-ES'),
      Tipo: getTipoEventoLabel(e.tipoEvento),
      Descripción: e.descripcion,
      Cliente: e.clienteNombre,
      RealizadoPor: e.realizadoPorNombre || '-',
      Motivo: e.motivo || '-',
    }));

    if (formato === 'csv') {
      const headers = Object.keys(eventosExportar[0] || {});
      const csvContent = [
        headers.join(','),
        ...eventosExportar.map(e => headers.map(h => `"${e[h as keyof typeof e]}"`).join(','))
      ].join('\n');
      
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `historial_cambios_${suscripcion.clienteNombre}_${new Date().toISOString().split('T')[0]}.csv`;
      link.click();
    } else {
      // Simulación de exportación Excel
      alert('Exportación a Excel simulada. En producción, se usaría una librería como xlsx.');
    }
  };

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

        {/* Filtros */}
        <Card className="bg-white dark:bg-gray-800 p-4">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="w-4 h-4 text-gray-600" />
            <h4 className="text-sm font-semibold text-gray-900 dark:text-white">Filtros</h4>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Select
              label="Tipo de evento"
              value={filtroTipoEvento}
              onChange={(e) => setFiltroTipoEvento(e.target.value as TipoEventoSuscripcion | 'todos')}
              options={[
                { value: 'todos', label: 'Todos los eventos' },
                { value: 'alta', label: 'Altas' },
                { value: 'upgrade', label: 'Upgrades' },
                { value: 'downgrade', label: 'Downgrades' },
                { value: 'congelacion', label: 'Congelaciones' },
                { value: 'descongelacion', label: 'Descongelaciones' },
                { value: 'pago_fallido', label: 'Pagos Fallidos' },
                { value: 'cancelacion', label: 'Cancelaciones' },
                { value: 'renovacion', label: 'Renovaciones' },
                { value: 'cambio_plan', label: 'Cambios de Plan' },
              ]}
            />
            <Input
              label="Fecha inicio"
              type="date"
              value={fechaInicio}
              onChange={(e) => setFechaInicio(e.target.value)}
            />
            <Input
              label="Fecha fin"
              type="date"
              value={fechaFin}
              onChange={(e) => setFechaFin(e.target.value)}
            />
            <div className="flex items-end gap-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => handleExportar('csv')}
                disabled={eventosFiltrados.length === 0}
              >
                <Download className="w-4 h-4 mr-2" />
                CSV
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => handleExportar('excel')}
                disabled={eventosFiltrados.length === 0}
              >
                <Download className="w-4 h-4 mr-2" />
                Excel
              </Button>
            </div>
          </div>
        </Card>

        {/* Lista de cambios */}
        {eventosFiltrados.length === 0 ? (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <History className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No hay cambios registrados con los filtros aplicados</p>
          </div>
        ) : (
          <div className="space-y-4 max-h-[600px] overflow-y-auto">
            {eventosFiltrados.map((evento) => (
              <Card key={evento.id} className="p-4 border-l-4 border-l-blue-500">
                <div className="flex items-start gap-4">
                  {/* Icono */}
                  <div className="flex-shrink-0 mt-1">
                    {getTipoEventoIcon(evento.tipoEvento)}
                  </div>

                  {/* Contenido */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge color={getTipoEventoColor(evento.tipoEvento)}>
                        {getTipoEventoLabel(evento.tipoEvento)}
                      </Badge>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {new Date(evento.fecha).toLocaleDateString('es-ES', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>

                    <p className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                      {evento.descripcion}
                    </p>

                    {/* Detalles de cambios */}
                    {evento.detalles && evento.detalles.length > 0 && (
                      <div className="mt-3 space-y-2">
                        {evento.detalles.map((detalle, idx) => (
                          <div
                            key={idx}
                            className="text-xs bg-gray-100 dark:bg-gray-700 p-2 rounded"
                          >
                            {detalle.campo && (
                              <div className="font-semibold text-gray-700 dark:text-gray-300 mb-1">
                                {detalle.campo}:
                              </div>
                            )}
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
                    {evento.motivo && (
                      <div className="mt-2 text-xs text-gray-600 dark:text-gray-400 italic">
                        <strong>Motivo:</strong> {evento.motivo}
                      </div>
                    )}

                    {/* Realizado por */}
                    {evento.realizadoPorNombre && (
                      <div className="mt-2 flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                        <User className="w-3 h-3" />
                        <span>Por: {evento.realizadoPorNombre}</span>
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

