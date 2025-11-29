/**
 * FacturacionManager - Componente principal del tab "Facturación"
 * 
 * Este componente es el núcleo del tab "Facturación" de la página principal.
 * Orquesta el listado de facturas, filtros avanzados y acciones rápidas sobre facturas.
 * 
 * Funcionalidades principales:
 * - Listado de facturas con filtros por estado, periodo, cliente y rol
 * - Acciones rápidas: ver detalle, editar, registrar pago (abre ModalPagoRapido), cancelar factura
 * - Indicadores visuales para facturas vencidas o en seguimiento
 * - Gestión de estados de carga, error y paginación básica
 * 
 * INTEGRACIÓN CON COMPONENTES DE GESTIÓN OPERATIVA:
 * 
 * 1. GestorCobros.tsx
 *    - Se puede integrar en el modal de detalle de factura
 *    - Permite gestionar pagos completos y parciales de una factura
 *    - Actualiza la factura en tiempo real tras cada operación
 *    - Ejemplo de uso:
 *      ```tsx
 *      import { GestorCobros } from './GestorCobros';
 *      
 *      <GestorCobros
 *        factura={facturaSeleccionada}
 *        isOpen={mostrarGestorCobros}
 *        onClose={() => setMostrarGestorCobros(false)}
 *        onCobroRegistrado={(facturaActualizada) => {
 *          // Actualizar lista de facturas
 *          loadFacturas();
 *        }}
 *      />
 *      ```
 * 
 * 2. FacturasVencidas.tsx
 *    - Se puede usar como tab independiente dentro de FacturacionManager
 *    - Lista facturas vencidas con filtros por antigüedad y riesgo
 *    - Acciones: abrir ficha, registrar pago rápido, marcar en seguimiento
 *    - Ejemplo de uso:
 *      ```tsx
 *      import { FacturasVencidas } from './FacturasVencidas';
 *      
 *      {tabActiva === 'vencidas' && (
 *        <FacturasVencidas
 *          onFacturaSeleccionada={(factura) => {
 *            // Abrir detalle de factura
 *            handleViewDetail(factura);
 *          }}
 *          onRefresh={loadFacturas}
 *        />
 *      )}
 *      ```
 * 
 * 3. SeguimientoEstados.tsx
 *    - Se puede integrar en el modal de detalle de factura
 *    - Muestra un timeline pequeño de cambios de estado para una factura
 *    - Versión compacta disponible para espacios reducidos
 *    - Ejemplo de uso:
 *      ```tsx
 *      import { SeguimientoEstados } from './SeguimientoEstados';
 *      
 *      <Modal title="Detalle de Factura">
 *        {/* Información de la factura */}
 *        <SeguimientoEstados factura={facturaSeleccionada} />
 *      </Modal>
 *      ```
 * 
 * 4. ModalPagoRapido.tsx (ya integrado)
 *    - Modal para registro rápido de pagos desde el listado
 *    - Se abre desde acciones rápidas en la tabla de facturas
 */

import React, { useState, useEffect, useMemo } from 'react';
import { Factura, FiltroFacturas, EstadoFactura, RolFacturacion } from '../types';
import { getFacturas, getFacturaById, cancelarFactura } from '../api/facturas';
import { getFacturasVencidas, marcarComoEnSeguimiento } from '../api/facturasVencidas';
import { esFacturaVencida } from '../utils/paymentStatus';
import { Card, Button, Table, Modal, Input, Select, Badge } from '../../../components/componentsreutilizables';
import { 
  FileText, 
  Plus, 
  Edit2, 
  Trash2, 
  Filter, 
  X, 
  Search, 
  Loader2, 
  Eye, 
  DollarSign, 
  AlertCircle,
  Calendar,
  User,
  CheckCircle2,
  Clock,
  Ban
} from 'lucide-react';
import { ModalPagoRapido } from './ModalPagoRapido';

interface FacturacionManagerProps {
  role?: RolFacturacion;
  onError?: (errorMessage: string) => void;
}

export const FacturacionManager: React.FC<FacturacionManagerProps> = ({ 
  role = 'gimnasio', 
  onError 
}) => {
  // Estados principales
  const [facturas, setFacturas] = useState<Factura[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Estados de filtros
  const [filters, setFilters] = useState<FiltroFacturas>({});
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Estados de modales y acciones
  const [facturaSeleccionada, setFacturaSeleccionada] = useState<Factura | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showPagoModal, setShowPagoModal] = useState(false);
  const [facturaParaPago, setFacturaParaPago] = useState<Factura | null>(null);
  
  // Estados de paginación
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // Cargar facturas cuando cambian los filtros o el rol
  useEffect(() => {
    loadFacturas();
  }, [filters, role]);

  /**
   * Carga las facturas desde la API aplicando los filtros actuales
   */
  const loadFacturas = async () => {
    setLoading(true);
    setError(null);
    try {
      const filtrosConRol: FiltroFacturas = {
        ...filters,
        rol: role
      };
      const data = await getFacturas(filtrosConRol);
      setFacturas(data);
    } catch (error) {
      console.error('Error loading invoices:', error);
      const errorMessage = error instanceof Error ? error.message : 'No se pudieron cargar las facturas';
      setError(errorMessage);
      if (onError) {
        onError(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  /**
   * Maneja la acción de ver detalle de una factura
   */
  const handleViewDetail = (factura: Factura) => {
    setFacturaSeleccionada(factura);
    setShowDetailModal(true);
  };

  /**
   * Maneja la acción de editar una factura
   */
  const handleEdit = (factura: Factura) => {
    // TODO: Implementar modal de edición o navegar a página de edición
    console.log('Editar factura:', factura.id);
    alert('Funcionalidad de edición en desarrollo');
  };

  /**
   * Maneja la acción de registrar pago rápido
   */
  const handleRegistrarPago = (factura: Factura) => {
    setFacturaParaPago(factura);
    setShowPagoModal(true);
  };

  /**
   * Maneja la acción de cancelar una factura
   */
  const handleCancelar = async (factura: Factura) => {
    if (!window.confirm(`¿Estás seguro de cancelar la factura ${factura.numero}?`)) {
      return;
    }

    try {
      await cancelarFactura(factura.id);
      await loadFacturas();
    } catch (error) {
      console.error('Error canceling invoice:', error);
      alert('Error al cancelar la factura');
    }
  };

  /**
   * Maneja la acción de marcar factura como en seguimiento
   */
  const handleMarcarSeguimiento = async (factura: Factura) => {
    try {
      await marcarComoEnSeguimiento(factura.id);
      await loadFacturas();
    } catch (error) {
      console.error('Error marking invoice for follow-up:', error);
      alert('Error al marcar la factura en seguimiento');
    }
  };

  /**
   * Obtiene el badge de estado para una factura
   */
  const getStatusBadge = (estado: EstadoFactura, factura: Factura) => {
    const isVencida = esFacturaVencida(estado, factura.fechaVencimiento);
    const tieneSeguimiento = factura.notasInternas?.includes('[En seguimiento]');

    const statusConfig: Record<string, { label: string; variant: 'blue' | 'purple' | 'green' | 'yellow' | 'red' | 'gray' }> = {
      pendiente: { label: 'Pendiente', variant: isVencida ? 'red' : 'blue' },
      pagada: { label: 'Pagada', variant: 'green' },
      parcialmentePagada: { label: 'Parcial', variant: 'yellow' },
      vencida: { label: 'Vencida', variant: 'red' },
      cancelada: { label: 'Cancelada', variant: 'gray' },
    };
    
    const statusKey = estado as string;
    const config = statusConfig[statusKey] || { label: statusKey, variant: 'blue' as const };
    
    return (
      <div className="flex items-center gap-2">
        <Badge variant={config.variant}>{config.label}</Badge>
        {isVencida && (
          <AlertCircle className="w-4 h-4 text-red-500" title="Factura vencida" />
        )}
        {tieneSeguimiento && (
          <Clock className="w-4 h-4 text-orange-500" title="En seguimiento" />
        )}
      </div>
    );
  };

  /**
   * Formatea un número como moneda
   */
  const formatearMoneda = (valor: number, moneda: string = 'EUR') => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: moneda,
      minimumFractionDigits: 2
    }).format(valor);
  };

  /**
   * Formatea una fecha
   */
  const formatearFecha = (fecha: Date) => {
    return new Date(fecha).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Filtrar facturas con búsqueda
  const filteredFacturas = useMemo(() => {
    let filtered = [...facturas];
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(factura => 
        factura.numero.toLowerCase().includes(query) ||
        factura.nombreCliente.toLowerCase().includes(query) ||
        factura.clienteId.toLowerCase().includes(query)
      );
    }
    
    return filtered;
  }, [facturas, searchQuery]);

  // Paginación
  const totalPages = Math.ceil(filteredFacturas.length / itemsPerPage);
  const paginatedFacturas = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return filteredFacturas.slice(start, end);
  }, [filteredFacturas, currentPage, itemsPerPage]);

  // Estadísticas rápidas
  const stats = useMemo(() => {
    const total = filteredFacturas.length;
    const pagadas = filteredFacturas.filter(f => f.estado === 'pagada').length;
    const pendientes = filteredFacturas.filter(f => f.estado === 'pendiente').length;
    const vencidas = filteredFacturas.filter(f => 
      esFacturaVencida(f.estado, f.fechaVencimiento)
    ).length;
    const totalFacturado = filteredFacturas.reduce((sum, f) => sum + f.total, 0);
    const totalPendiente = filteredFacturas.reduce((sum, f) => sum + f.saldoPendiente, 0);

    return { total, pagadas, pendientes, vencidas, totalFacturado, totalPendiente };
  }, [filteredFacturas]);

  // Contar filtros activos
  const activeFiltersCount = Object.values(filters).filter(v => v !== undefined && v !== '').length;

  // Columnas de la tabla
  const columns = [
    {
      key: 'numero',
      label: 'Número',
      render: (value: string, row: Factura) => (
        <div className="font-semibold text-gray-900">{value}</div>
      ),
    },
    {
      key: 'nombreCliente',
      label: 'Cliente',
      render: (value: string, row: Factura) => (
        <div className="text-sm text-gray-700">{value}</div>
      ),
    },
    {
      key: 'fechaEmision',
      label: 'Emisión',
      render: (_: any, row: Factura) => (
        <div className="text-sm text-gray-700">{formatearFecha(row.fechaEmision)}</div>
      ),
    },
    {
      key: 'fechaVencimiento',
      label: 'Vencimiento',
      render: (_: any, row: Factura) => (
        <div className="text-sm text-gray-700">{formatearFecha(row.fechaVencimiento)}</div>
      ),
    },
    {
      key: 'total',
      label: 'Total',
      render: (value: number, row: Factura) => (
        <div className="text-sm font-medium text-gray-900">
          {formatearMoneda(value, row.moneda)}
        </div>
      ),
    },
    {
      key: 'saldoPendiente',
      label: 'Pendiente',
      render: (value: number, row: Factura) => (
        <div className="text-sm font-medium text-gray-900">
          {formatearMoneda(value, row.moneda)}
        </div>
      ),
    },
    {
      key: 'estado',
      label: 'Estado',
      render: (value: EstadoFactura, row: Factura) => getStatusBadge(value, row),
    },
    {
      key: 'actions',
      label: 'Acciones',
      render: (_: any, row: Factura) => (
        <div className="flex gap-2">
          <button
            onClick={() => handleViewDetail(row)}
            className="p-2 rounded-lg text-gray-600 hover:bg-gray-50 transition-all"
            title="Ver detalle"
          >
            <Eye className="w-4 h-4" />
          </button>
          {row.estado !== 'cancelada' && row.estado !== 'pagada' && (
            <>
              <button
                onClick={() => handleRegistrarPago(row)}
                className="p-2 rounded-lg text-green-600 hover:bg-green-50 transition-all"
                title="Registrar pago"
              >
                <DollarSign className="w-4 h-4" />
              </button>
              {esFacturaVencida(row.estado, row.fechaVencimiento) && (
                <button
                  onClick={() => handleMarcarSeguimiento(row)}
                  className="p-2 rounded-lg text-orange-600 hover:bg-orange-50 transition-all"
                  title="Marcar en seguimiento"
                >
                  <Clock className="w-4 h-4" />
                </button>
              )}
            </>
          )}
          {row.estado !== 'cancelada' && (
            <button
              onClick={() => handleEdit(row)}
              className="p-2 rounded-lg text-blue-600 hover:bg-blue-50 transition-all"
              title="Editar"
            >
              <Edit2 className="w-4 h-4" />
            </button>
          )}
          {row.estado !== 'cancelada' && row.estado !== 'pagada' && (
            <button
              onClick={() => handleCancelar(row)}
              className="p-2 rounded-lg text-red-600 hover:bg-red-50 transition-all"
              title="Cancelar"
            >
              <Ban className="w-4 h-4" />
            </button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Toolbar superior */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <FileText className="w-6 h-6 text-gray-600" />
          <h2 className="text-2xl font-bold text-gray-900">Facturación</h2>
        </div>
        <Button variant="primary" onClick={() => alert('Funcionalidad de creación en desarrollo')}>
          <Plus size={20} className="mr-2" />
          Nueva Factura
        </Button>
      </div>

      {/* Estadísticas rápidas */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
        <Card className="p-4 bg-white shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500 mb-1">Total</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <FileText className="w-8 h-8 text-gray-400" />
          </div>
        </Card>
        <Card className="p-4 bg-white shadow-sm border-l-4 border-l-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500 mb-1">Pagadas</p>
              <p className="text-2xl font-bold text-green-600">{stats.pagadas}</p>
            </div>
            <CheckCircle2 className="w-8 h-8 text-green-500" />
          </div>
        </Card>
        <Card className="p-4 bg-white shadow-sm border-l-4 border-l-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500 mb-1">Pendientes</p>
              <p className="text-2xl font-bold text-blue-600">{stats.pendientes}</p>
            </div>
            <Clock className="w-8 h-8 text-blue-500" />
          </div>
        </Card>
        <Card className="p-4 bg-white shadow-sm border-l-4 border-l-red-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500 mb-1">Vencidas</p>
              <p className="text-2xl font-bold text-red-600">{stats.vencidas}</p>
            </div>
            <AlertCircle className="w-8 h-8 text-red-500" />
          </div>
        </Card>
        <Card className="p-4 bg-white shadow-sm border-l-4 border-l-purple-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500 mb-1">Facturado</p>
              <p className="text-lg font-bold text-purple-600">
                {formatearMoneda(stats.totalFacturado)}
              </p>
            </div>
            <DollarSign className="w-8 h-8 text-purple-500" />
          </div>
        </Card>
        <Card className="p-4 bg-white shadow-sm border-l-4 border-l-orange-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500 mb-1">Pendiente</p>
              <p className="text-lg font-bold text-orange-600">
                {formatearMoneda(stats.totalPendiente)}
              </p>
            </div>
            <AlertCircle className="w-8 h-8 text-orange-500" />
          </div>
        </Card>
      </div>

      {/* Sistema de Filtros */}
      <Card className="mb-6 bg-white shadow-sm">
        <div className="space-y-4">
          {/* Barra de búsqueda */}
          <div className="rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-3">
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Buscar por número de factura, cliente..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 pl-10 pr-3 py-2.5"
                />
              </div>
              <Button
                variant="secondary"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter size={18} className="mr-2" />
                Filtros
                {activeFiltersCount > 0 && (
                  <Badge variant="blue" className="ml-2">
                    {activeFiltersCount}
                  </Badge>
                )}
              </Button>
              {activeFiltersCount > 0 && (
                <Button
                  variant="ghost"
                  onClick={() => {
                    setFilters({});
                    setSearchQuery('');
                  }}
                >
                  <X size={18} className="mr-2" />
                  Limpiar
                </Button>
              )}
            </div>
          </div>

          {/* Panel de filtros avanzados */}
          {showFilters && (
            <div className="rounded-2xl bg-white ring-1 ring-slate-200 p-4 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    <Filter size={16} className="inline mr-1" />
                    Estado
                  </label>
                  <Select
                    value={filters.estado || ''}
                    onChange={(e) => setFilters({ ...filters, estado: e.target.value as EstadoFactura || undefined })}
                    options={[
                      { value: '', label: 'Todos' },
                      { value: 'pendiente', label: 'Pendiente' },
                      { value: 'pagada', label: 'Pagada' },
                      { value: 'parcialmentePagada', label: 'Parcialmente Pagada' },
                      { value: 'vencida', label: 'Vencida' },
                      { value: 'cancelada', label: 'Cancelada' },
                    ]}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    <Calendar size={16} className="inline mr-1" />
                    Fecha desde
                  </label>
                  <Input
                    type="date"
                    value={filters.fechaInicio ? new Date(filters.fechaInicio).toISOString().split('T')[0] : ''}
                    onChange={(e) => setFilters({ 
                      ...filters, 
                      fechaInicio: e.target.value ? new Date(e.target.value) : undefined 
                    })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    <Calendar size={16} className="inline mr-1" />
                    Fecha hasta
                  </label>
                  <Input
                    type="date"
                    value={filters.fechaFin ? new Date(filters.fechaFin).toISOString().split('T')[0] : ''}
                    onChange={(e) => setFilters({ 
                      ...filters, 
                      fechaFin: e.target.value ? new Date(e.target.value) : undefined 
                    })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    <User size={16} className="inline mr-1" />
                    Cliente ID
                  </label>
                  <Input
                    value={filters.clienteId || ''}
                    onChange={(e) => setFilters({ ...filters, clienteId: e.target.value || undefined })}
                    placeholder="ID del cliente"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Resumen de resultados */}
          <div className="flex justify-between items-center text-sm text-slate-600 border-t border-slate-200 pt-4">
            <span>
              {filteredFacturas.length} resultado{filteredFacturas.length !== 1 ? 's' : ''} encontrado{filteredFacturas.length !== 1 ? 's' : ''}
            </span>
            {activeFiltersCount > 0 && (
              <span>{activeFiltersCount} filtro{activeFiltersCount !== 1 ? 's' : ''} aplicado{activeFiltersCount !== 1 ? 's' : ''}</span>
            )}
          </div>
        </div>
      </Card>

      {/* Listado de facturas */}
      {loading ? (
        <Card className="p-8 text-center bg-white shadow-sm">
          <Loader2 size={48} className="mx-auto text-blue-500 animate-spin mb-4" />
          <p className="text-gray-600">Cargando facturas...</p>
        </Card>
      ) : error ? (
        <Card className="p-8 text-center bg-white shadow-sm border-l-4 border-l-red-500">
          <AlertCircle className="w-12 h-12 mx-auto text-red-500 mb-4" />
          <p className="text-red-600 font-medium">{error}</p>
          <Button variant="secondary" onClick={loadFacturas} className="mt-4">
            Reintentar
          </Button>
        </Card>
      ) : paginatedFacturas.length === 0 ? (
        <Card className="p-12 text-center bg-white shadow-sm">
          <FileText className="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No hay facturas registradas</h3>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            Comienza a gestionar la facturación creando tu primera factura.
          </p>
          <Button variant="primary" onClick={() => alert('Funcionalidad de creación en desarrollo')}>
            <Plus size={20} className="mr-2" />
            Crear primera factura
          </Button>
        </Card>
      ) : (
        <>
          <Table
            data={paginatedFacturas}
            columns={columns}
            loading={false}
            emptyMessage="No hay facturas que mostrar"
          />
          
          {/* Paginación */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">
                Mostrando {((currentPage - 1) * itemsPerPage) + 1} a {Math.min(currentPage * itemsPerPage, filteredFacturas.length)} de {filteredFacturas.length} facturas
              </div>
              <div className="flex gap-2">
                <Button
                  variant="secondary"
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                >
                  Anterior
                </Button>
                <span className="px-4 py-2 text-sm text-gray-700">
                  Página {currentPage} de {totalPages}
                </span>
                <Button
                  variant="secondary"
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                >
                  Siguiente
                </Button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Modal de detalle de factura */}
      {facturaSeleccionada && (
        <Modal
          isOpen={showDetailModal}
          onClose={() => {
            setShowDetailModal(false);
            setFacturaSeleccionada(null);
          }}
          title={`Detalle: ${facturaSeleccionada.numero}`}
          size="lg"
          footer={
            <div className="flex gap-3">
              <Button variant="secondary" onClick={() => {
                setShowDetailModal(false);
                setFacturaSeleccionada(null);
              }}>
                Cerrar
              </Button>
              {facturaSeleccionada.estado !== 'cancelada' && facturaSeleccionada.estado !== 'pagada' && (
                <Button variant="primary" onClick={() => {
                  setShowDetailModal(false);
                  handleRegistrarPago(facturaSeleccionada);
                }}>
                  <DollarSign size={18} className="mr-2" />
                  Registrar Pago
                </Button>
              )}
            </div>
          }
        >
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700">Cliente</label>
                <p className="text-gray-900 mt-1">{facturaSeleccionada.nombreCliente}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Estado</label>
                <div className="mt-1">{getStatusBadge(facturaSeleccionada.estado, facturaSeleccionada)}</div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Fecha de Emisión</label>
                <p className="text-gray-900 mt-1">{formatearFecha(facturaSeleccionada.fechaEmision)}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Fecha de Vencimiento</label>
                <p className="text-gray-900 mt-1">{formatearFecha(facturaSeleccionada.fechaVencimiento)}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Total</label>
                <p className="text-gray-900 mt-1 font-semibold">
                  {formatearMoneda(facturaSeleccionada.total, facturaSeleccionada.moneda)}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Saldo Pendiente</label>
                <p className="text-gray-900 mt-1 font-semibold">
                  {formatearMoneda(facturaSeleccionada.saldoPendiente, facturaSeleccionada.moneda)}
                </p>
              </div>
            </div>
            
            {facturaSeleccionada.lineas && facturaSeleccionada.lineas.length > 0 && (
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Líneas de Factura</label>
                <div className="space-y-2">
                  {facturaSeleccionada.lineas.map((linea) => (
                    <div key={linea.id} className="p-3 bg-gray-50 rounded-lg">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium text-gray-900">{linea.descripcion}</p>
                          <p className="text-sm text-gray-600">
                            {linea.cantidad} x {formatearMoneda(linea.precioUnitario, facturaSeleccionada.moneda)}
                          </p>
                        </div>
                        <p className="font-semibold text-gray-900">
                          {formatearMoneda(linea.totalLinea, facturaSeleccionada.moneda)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {facturaSeleccionada.notasInternas && (
              <div>
                <label className="text-sm font-medium text-gray-700">Notas Internas</label>
                <p className="text-gray-900 mt-1 whitespace-pre-wrap">{facturaSeleccionada.notasInternas}</p>
              </div>
            )}
          </div>
        </Modal>
      )}

      {/* Modal de pago rápido */}
      {facturaParaPago && (
        <ModalPagoRapido
          isOpen={showPagoModal}
          onClose={() => {
            setShowPagoModal(false);
            setFacturaParaPago(null);
          }}
          factura={facturaParaPago}
          onPagoRegistrado={() => {
            setShowPagoModal(false);
            setFacturaParaPago(null);
            loadFacturas();
          }}
        />
      )}
    </div>
  );
};

