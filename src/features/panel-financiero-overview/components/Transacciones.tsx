import React, { useState, useEffect } from 'react';
import { Card, Table, TableColumn, Button, Input, Select } from '../../../components/componentsreutilizables';
import { Receipt, Search, Filter, Calendar, User, DollarSign, Download, X } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { transaccionesApi, Transaccion } from '../api/transacciones';

export const Transacciones: React.FC = () => {
  const { user } = useAuth();
  const [transacciones, setTransacciones] = useState<Transaccion[]>([]);
  const [loading, setLoading] = useState(true);
  const [mostrarFiltros, setMostrarFiltros] = useState(false);
  
  // Filtros
  const [fechaInicio, setFechaInicio] = useState<string>('');
  const [fechaFin, setFechaFin] = useState<string>('');
  const [clienteId, setClienteId] = useState<string>('');
  const [tipoServicio, setTipoServicio] = useState<string>('');
  const [estado, setEstado] = useState<string>('');

  useEffect(() => {
    cargarTransacciones();
  }, [user?.id]);

  const cargarTransacciones = async () => {
    try {
      setLoading(true);
      
      const filtros: any = {};
      
      if (fechaInicio) {
        filtros.fechaInicio = new Date(fechaInicio);
      }
      
      if (fechaFin) {
        const fecha = new Date(fechaFin);
        fecha.setHours(23, 59, 59, 999);
        filtros.fechaFin = fecha;
      }
      
      if (clienteId) {
        filtros.clienteId = clienteId;
      }
      
      if (tipoServicio) {
        filtros.tipoServicio = tipoServicio;
      }
      
      if (estado) {
        filtros.estado = estado;
      }

      const data = await transaccionesApi.obtenerTransacciones(filtros, user?.id);
      setTransacciones(data);
    } catch (error) {
      console.error('Error cargando transacciones:', error);
    } finally {
      setLoading(false);
    }
  };

  const limpiarFiltros = () => {
    setFechaInicio('');
    setFechaFin('');
    setClienteId('');
    setTipoServicio('');
    setEstado('');
    cargarTransacciones();
  };

  const aplicarFiltros = () => {
    cargarTransacciones();
    setMostrarFiltros(false);
  };

  const getEstadoColor = (estado: string) => {
    const colores: Record<string, string> = {
      'pagado': 'bg-green-100 text-green-800',
      'pendiente': 'bg-yellow-100 text-yellow-800',
      'vencido': 'bg-red-100 text-red-800',
      'cancelado': 'bg-gray-100 text-gray-800',
    };
    return colores[estado] || 'bg-gray-100 text-gray-800';
  };

  const getEstadoLabel = (estado: string) => {
    const labels: Record<string, string> = {
      'pagado': 'Pagado',
      'pendiente': 'Pendiente',
      'vencido': 'Vencido',
      'cancelado': 'Cancelado',
    };
    return labels[estado] || estado;
  };

  const getMetodoPagoLabel = (metodo?: string) => {
    if (!metodo) return '-';
    const labels: Record<string, string> = {
      'efectivo': 'Efectivo',
      'tarjeta': 'Tarjeta',
      'transferencia': 'Transferencia',
      'otro': 'Otro',
    };
    return labels[metodo] || metodo;
  };

  // Obtener lista única de clientes para el filtro
  const clientesUnicos = Array.from(
    new Set(transacciones.map(t => t.clienteId))
  ).map(id => {
    const transaccion = transacciones.find(t => t.clienteId === id);
    return { id, nombre: transaccion?.cliente || '' };
  });

  const totalIngresos = transacciones
    .filter(t => t.estado === 'pagado')
    .reduce((sum, t) => sum + t.monto, 0);

  const totalPendiente = transacciones
    .filter(t => t.estado === 'pendiente' || t.estado === 'vencido')
    .reduce((sum, t) => sum + t.monto, 0);

  const columns: TableColumn<Transaccion>[] = [
    {
      key: 'fecha',
      label: 'Fecha',
      render: (fecha: Date) => {
        const date = new Date(fecha);
        return (
          <div>
            <div className="font-medium text-gray-900">
              {date.toLocaleDateString('es-ES', {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
              })}
            </div>
            <div className="text-xs text-gray-500">
              {date.toLocaleTimeString('es-ES', {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </div>
          </div>
        );
      },
    },
    {
      key: 'cliente',
      label: 'Cliente',
      render: (cliente: string) => (
        <div className="font-medium text-gray-900">{cliente}</div>
      ),
    },
    {
      key: 'concepto',
      label: 'Concepto',
      render: (concepto: string) => (
        <div className="text-gray-700">{concepto}</div>
      ),
    },
    {
      key: 'monto',
      label: 'Monto',
      align: 'right',
      render: (monto: number) => (
        <div className="font-semibold text-gray-900">
          €{monto.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </div>
      ),
    },
    {
      key: 'estado',
      label: 'Estado',
      render: (estado: string) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getEstadoColor(estado)}`}>
          {getEstadoLabel(estado)}
        </span>
      ),
    },
    {
      key: 'metodoPago',
      label: 'Método de Pago',
      render: (metodo?: string) => (
        <div className="text-sm text-gray-600">{getMetodoPagoLabel(metodo)}</div>
      ),
    },
    {
      key: 'fechaPago',
      label: 'Fecha de Pago',
      render: (fechaPago?: Date) => {
        if (!fechaPago) return <span className="text-gray-400">-</span>;
        const date = new Date(fechaPago);
        return (
          <div className="text-sm text-gray-600">
            {date.toLocaleDateString('es-ES', {
              day: '2-digit',
              month: 'short',
              year: 'numeric',
            })}
          </div>
        );
      },
    },
  ];

  return (
    <div className="space-y-6">
      {/* Resumen de Transacciones */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-white shadow-sm">
          <div className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Transacciones</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{transacciones.length}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Receipt className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>
        </Card>

        <Card className="bg-white shadow-sm">
          <div className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Ingresos Totales</p>
                <p className="text-2xl font-bold text-green-600 mt-1">
                  €{totalIngresos.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>
        </Card>

        <Card className="bg-white shadow-sm">
          <div className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pendiente</p>
                <p className="text-2xl font-bold text-yellow-600 mt-1">
                  €{totalPendiente.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Calendar className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Tabla de Transacciones */}
      <Card className="bg-white shadow-sm">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Listado de Transacciones</h2>
              <p className="text-sm text-gray-600 mt-1">
                Registro detallado de todas tus transacciones
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setMostrarFiltros(!mostrarFiltros)}
                leftIcon={<Filter className="w-4 h-4" />}
              >
                {mostrarFiltros ? 'Ocultar Filtros' : 'Filtros'}
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={cargarTransacciones}
                leftIcon={<Search className="w-4 h-4" />}
              >
                Actualizar
              </Button>
            </div>
          </div>

          {/* Panel de Filtros */}
          {mostrarFiltros && (
            <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-gray-900">Filtros de Búsqueda</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={limpiarFiltros}
                  className="text-xs"
                >
                  <X className="w-3 h-3 mr-1" />
                  Limpiar
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Fecha Inicio
                  </label>
                  <Input
                    type="date"
                    value={fechaInicio}
                    onChange={(e) => setFechaInicio(e.target.value)}
                    className="text-sm"
                  />
                </div>
                
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Fecha Fin
                  </label>
                  <Input
                    type="date"
                    value={fechaFin}
                    onChange={(e) => setFechaFin(e.target.value)}
                    className="text-sm"
                  />
                </div>
                
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Cliente
                  </label>
                  <Select
                    value={clienteId}
                    onChange={(e) => setClienteId(e.target.value)}
                    className="text-sm"
                  >
                    <option value="">Todos</option>
                    {clientesUnicos.map((cliente) => (
                      <option key={cliente.id} value={cliente.id}>
                        {cliente.nombre}
                      </option>
                    ))}
                  </Select>
                </div>
                
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Tipo de Servicio
                  </label>
                  <Select
                    value={tipoServicio}
                    onChange={(e) => setTipoServicio(e.target.value)}
                    className="text-sm"
                  >
                    <option value="">Todos</option>
                    <option value="sesion-1-1">Sesión 1 a 1</option>
                    <option value="videollamada">Videollamada</option>
                    <option value="evaluacion">Evaluación</option>
                    <option value="paquete">Paquete</option>
                    <option value="otro">Otro</option>
                  </Select>
                </div>
                
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Estado
                  </label>
                  <Select
                    value={estado}
                    onChange={(e) => setEstado(e.target.value)}
                    className="text-sm"
                  >
                    <option value="">Todos</option>
                    <option value="pagado">Pagado</option>
                    <option value="pendiente">Pendiente</option>
                    <option value="vencido">Vencido</option>
                    <option value="cancelado">Cancelado</option>
                  </Select>
                </div>
              </div>
              
              <div className="mt-4 flex justify-end">
                <Button
                  variant="primary"
                  size="sm"
                  onClick={aplicarFiltros}
                >
                  Aplicar Filtros
                </Button>
              </div>
            </div>
          )}

          {/* Tabla */}
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p className="text-gray-600 mt-4">Cargando transacciones...</p>
            </div>
          ) : transacciones.length === 0 ? (
            <div className="text-center py-12">
              <Receipt className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No se encontraron transacciones</p>
              <p className="text-sm text-gray-500 mt-1">
                {mostrarFiltros ? 'Intenta ajustar los filtros' : 'Las transacciones aparecerán aquí cuando marques pagos en la agenda'}
              </p>
            </div>
          ) : (
            <Table
              data={transacciones}
              columns={columns}
              loading={loading}
            />
          )}
        </div>
      </Card>
    </div>
  );
};

