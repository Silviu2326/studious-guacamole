import React, { useState, useEffect } from 'react';
import { Card, Button, Table, Badge, Modal } from '../../../components/componentsreutilizables';
import { devolucionesApi } from '../api/devoluciones';
import { Devolucion } from '../types';
import { Check, X, Eye } from 'lucide-react';

export const GestorDevoluciones: React.FC = () => {
  const [devoluciones, setDevoluciones] = useState<Devolucion[]>([]);
  const [loading, setLoading] = useState(false);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [devolucionSeleccionada, setDevolucionSeleccionada] = useState<Devolucion | null>(null);
  const [filtroEstado, setFiltroEstado] = useState<Devolucion['estado'] | ''>('');

  useEffect(() => {
    cargarDevoluciones();
  }, [filtroEstado]);

  const cargarDevoluciones = async () => {
    setLoading(true);
    try {
      const datos = await devolucionesApi.obtenerDevoluciones(
        filtroEstado ? { estado: filtroEstado as Devolucion['estado'] } : {}
      );
      setDevoluciones(datos);
    } catch (error) {
      console.error('Error al cargar devoluciones:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatearMoneda = (valor: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(valor);
  };

  const formatearFecha = (fecha: Date | string) => {
    const fechaObj = typeof fecha === 'string' ? new Date(fecha) : fecha;
    return new Intl.DateTimeFormat('es-CO', {
      dateStyle: 'short',
      timeStyle: 'short',
    }).format(fechaObj);
  };

  const getEstadoBadge = (estado: Devolucion['estado']) => {
    const estados = {
      pendiente: { label: 'Pendiente', variant: 'yellow' as const },
      aprobada: { label: 'Aprobada', variant: 'blue' as const },
      rechazada: { label: 'Rechazada', variant: 'red' as const },
      completada: { label: 'Completada', variant: 'green' as const },
    };
    return estados[estado] || estados.pendiente;
  };

  const aprobarDevolucion = async (id: string) => {
    try {
      await devolucionesApi.aprobarDevolucion(id, 'Usuario actual');
      cargarDevoluciones();
    } catch (error) {
      console.error('Error al aprobar devolución:', error);
    }
  };

  const rechazarDevolucion = async (id: string, motivo: string) => {
    try {
      await devolucionesApi.rechazarDevolucion(id, motivo);
      cargarDevoluciones();
    } catch (error) {
      console.error('Error al rechazar devolución:', error);
    }
  };

  const completarDevolucion = async (id: string) => {
    try {
      await devolucionesApi.completarDevolucion(id, 'Usuario actual');
      cargarDevoluciones();
    } catch (error) {
      console.error('Error al completar devolución:', error);
    }
  };

  const columnas = [
    {
      key: 'numeroDevolucion',
      label: 'Número de Devolución',
      sortable: true,
      render: (value: string, row: Devolucion) => (
        <div className="font-semibold text-purple-600 dark:text-purple-400">{value}</div>
      ),
    },
    {
      key: 'numeroTicket',
      label: 'Ticket Original',
      sortable: true,
    },
    {
      key: 'fecha',
      label: 'Fecha',
      sortable: true,
      render: (value: Date | string) => formatearFecha(value),
    },
    {
      key: 'motivo',
      label: 'Motivo',
    },
    {
      key: 'estado',
      label: 'Estado',
      render: (value: Devolucion['estado']) => {
        const estadoInfo = getEstadoBadge(value);
        return <Badge variant={estadoInfo.variant}>{estadoInfo.label}</Badge>;
      },
    },
    {
      key: 'montoTotal',
      label: 'Monto a Reembolsar',
      align: 'right' as const,
      sortable: true,
      render: (value: number) => (
        <span className="font-semibold">{formatearMoneda(value)}</span>
      ),
    },
    {
      key: 'actions',
      label: 'Acciones',
      render: (_: any, row: Devolucion) => (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setDevolucionSeleccionada(row);
              setMostrarModal(true);
            }}
            title="Ver detalle"
          >
            <Eye className="w-4 h-4" />
          </Button>
          {row.estado === 'pendiente' && (
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => aprobarDevolucion(row.id)}
                title="Aprobar"
              >
                <Check className="w-4 h-4 text-green-600" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  const motivo = prompt('Motivo del rechazo:');
                  if (motivo) rechazarDevolucion(row.id, motivo);
                }}
                title="Rechazar"
              >
                <X className="w-4 h-4 text-red-600" />
              </Button>
            </>
          )}
          {row.estado === 'aprobada' && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => completarDevolucion(row.id)}
              title="Completar devolución"
            >
              <RefreshCw className="w-4 h-4 text-blue-600" />
            </Button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Filtros */}
      <Card className="mb-6 bg-white shadow-sm">
        <div className="rounded-2xl bg-white ring-1 ring-slate-200 p-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Estado
              </label>
              <select
                value={filtroEstado}
                onChange={(e) => setFiltroEstado(e.target.value as Devolucion['estado'] | '')}
                className="w-full rounded-xl bg-white text-slate-900 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-4 pr-3 py-2.5"
              >
                <option value="">Todos los estados</option>
                <option value="pendiente">Pendiente</option>
                <option value="aprobada">Aprobada</option>
                <option value="rechazada">Rechazada</option>
                <option value="completada">Completada</option>
              </select>
            </div>
          </div>

          {/* Resumen de resultados */}
          <div className="flex justify-between items-center text-sm text-slate-600 border-t border-slate-200 pt-4">
            <span>{devoluciones.length} resultados encontrados</span>
          </div>
        </div>
      </Card>

      {/* Tabla de devoluciones */}
      <Table
        data={devoluciones}
        columns={columnas}
        loading={loading}
        emptyMessage="No hay devoluciones disponibles"
      />

      {/* Modal de detalle */}
      {devolucionSeleccionada && (
        <Modal
          isOpen={mostrarModal}
          onClose={() => {
            setMostrarModal(false);
            setDevolucionSeleccionada(null);
          }}
          title={`Devolución ${devolucionSeleccionada.numeroDevolucion}`}
          size="lg"
        >
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-slate-700 mb-1">
                  Ticket Original
                </p>
                <p className="text-base text-gray-900">
                  {devolucionSeleccionada.numeroTicket}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-700 mb-1">
                  Estado
                </p>
                <Badge variant={getEstadoBadge(devolucionSeleccionada.estado).variant}>
                  {getEstadoBadge(devolucionSeleccionada.estado).label}
                </Badge>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-700 mb-1">
                  Motivo
                </p>
                <p className="text-base text-gray-900">
                  {devolucionSeleccionada.motivo}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-700 mb-1">
                  Monto Total
                </p>
                <p className="text-base text-gray-900 font-semibold">
                  {formatearMoneda(devolucionSeleccionada.montoTotal)}
                </p>
              </div>
            </div>

            <div>
              <p className="text-sm font-medium text-slate-700 mb-2">
                Productos
              </p>
              <div className="space-y-2">
                {devolucionSeleccionada.items.map((item) => (
                  <div key={item.id} className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-base text-gray-900 font-semibold">
                          {item.productoNombre}
                        </p>
                        <p className="text-xs text-gray-600">
                          Cantidad: {item.cantidad} - {formatearMoneda(item.precioUnitario)} c/u
                        </p>
                      </div>
                      <Badge variant={item.estado === 'buen_estado' ? 'green' : 'red'}>
                        {item.estado === 'buen_estado' ? 'Buen estado' : 'Defectuoso'}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

