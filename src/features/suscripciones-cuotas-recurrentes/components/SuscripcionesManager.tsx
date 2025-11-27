import React, { useState, useEffect, useMemo } from 'react';
import { Suscripcion, SuscripcionFilters, EstadoSuscripcion } from '../types';
import { getSuscripciones, updateEstadoSuscripcion, getSuscripcionById } from '../api/suscripciones';
import { Card, Button, Table, Modal, Input, Select, Badge } from '../../../components/componentsreutilizables';
import { 
  Search, 
  Filter, 
  X, 
  Eye, 
  Snowflake, 
  XCircle, 
  RefreshCw, 
  CreditCard, 
  Calendar,
  TrendingUp,
  Loader2,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
  Phone,
  Mail
} from 'lucide-react';
import { VistaClienteSuscripcion } from './VistaClienteSuscripcion';
import { UpgradeDowngrade } from './UpgradeDowngrade';
import { CambioPlanPT } from './CambioPlanPT';

interface SuscripcionesManagerProps {
  role: 'entrenador' | 'gimnasio';
  userId?: string;
  onError?: (errorMessage: string) => void;
}

export const SuscripcionesManager: React.FC<SuscripcionesManagerProps> = ({ 
  role, 
  userId,
  onError 
}) => {
  const [suscripciones, setSuscripciones] = useState<Suscripcion[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<SuscripcionFilters>({});
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSuscripcion, setSelectedSuscripcion] = useState<Suscripcion | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showChangePlanModal, setShowChangePlanModal] = useState(false);
  const [suscripcionParaCambio, setSuscripcionParaCambio] = useState<Suscripcion | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  
  // Paginación
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    loadSuscripciones();
  }, [filters, role, userId]);

  const loadSuscripciones = async () => {
    setLoading(true);
    try {
      const data = await getSuscripciones(role, userId, filters);
      setSuscripciones(data);
    } catch (error) {
      console.error('Error loading suscripciones:', error);
      const errorMessage = error instanceof Error ? error.message : 'No se pudieron cargar las suscripciones';
      if (onError) {
        onError(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  // Filtrar con búsqueda
  const filteredSuscripciones = useMemo(() => {
    let filtered = [...suscripciones];
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(s => 
        s.clienteNombre.toLowerCase().includes(query) ||
        s.clienteEmail.toLowerCase().includes(query) ||
        s.planNombre.toLowerCase().includes(query)
      );
    }
    
    return filtered;
  }, [suscripciones, searchQuery]);

  // Paginación
  const totalPages = Math.ceil(filteredSuscripciones.length / itemsPerPage);
  const paginatedSuscripciones = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredSuscripciones.slice(start, start + itemsPerPage);
  }, [filteredSuscripciones, currentPage, itemsPerPage]);

  // Calcular MRR estimado
  const calcularMRR = (suscripcion: Suscripcion): number => {
    if (suscripcion.estado !== 'activa') return 0;
    
    const precioMensual = suscripcion.frecuenciaPago === 'mensual' 
      ? suscripcion.precio 
      : suscripcion.frecuenciaPago === 'trimestral'
      ? suscripcion.precio / 3
      : suscripcion.frecuenciaPago === 'semestral'
      ? suscripcion.precio / 6
      : suscripcion.precio / 12;
    
    return precioMensual;
  };

  const getEstadoBadge = (estado: EstadoSuscripcion) => {
    const estados: Record<EstadoSuscripcion, { label: string; variant: 'blue' | 'purple' | 'green' | 'yellow' | 'red' }> = {
      activa: { label: 'Activa', variant: 'green' },
      pausada: { label: 'Pausada', variant: 'yellow' },
      cancelada: { label: 'Cancelada', variant: 'red' },
      vencida: { label: 'Vencida', variant: 'red' },
      pendiente: { label: 'Pendiente', variant: 'blue' },
    };
    
    const estadoData = estados[estado] || estados.pendiente;
    return <Badge variant={estadoData.variant}>{estadoData.label}</Badge>;
  };

  const handleViewDetails = async (suscripcion: Suscripcion) => {
    try {
      const fullSuscripcion = await getSuscripcionById(suscripcion.id);
      setSelectedSuscripcion(fullSuscripcion);
      setShowDetailModal(true);
    } catch (error) {
      console.error('Error loading suscripcion details:', error);
      if (onError) {
        onError('No se pudieron cargar los detalles de la suscripción');
      }
    }
  };

  const handleFreeze = async (suscripcion: Suscripcion) => {
    if (!window.confirm('¿Estás seguro de congelar esta suscripción?')) return;
    
    setActionLoading(suscripcion.id);
    try {
      await updateEstadoSuscripcion(suscripcion.id, 'pausada', 'Congelación manual');
      await loadSuscripciones();
    } catch (error) {
      console.error('Error freezing suscripcion:', error);
      if (onError) {
        onError('No se pudo congelar la suscripción');
      }
    } finally {
      setActionLoading(null);
    }
  };

  const handleCancel = async (suscripcion: Suscripcion) => {
    const motivo = window.prompt('¿Motivo de cancelación?');
    if (!motivo) return;
    
    setActionLoading(suscripcion.id);
    try {
      await updateEstadoSuscripcion(suscripcion.id, 'cancelada', motivo);
      await loadSuscripciones();
    } catch (error) {
      console.error('Error canceling suscripcion:', error);
      if (onError) {
        onError('No se pudo cancelar la suscripción');
      }
    } finally {
      setActionLoading(null);
    }
  };

  const handleChangePlan = async (suscripcion: Suscripcion) => {
    try {
      const fullSuscripcion = await getSuscripcionById(suscripcion.id);
      setSuscripcionParaCambio(fullSuscripcion);
      setShowChangePlanModal(true);
    } catch (error) {
      console.error('Error loading suscripcion for plan change:', error);
      if (onError) {
        onError('No se pudieron cargar los detalles de la suscripción');
      }
    }
  };

  const handleGoToPayments = (suscripcion: Suscripcion) => {
    // Navegar a la sección de pagos/cuotas (se puede implementar después)
    alert(`Navegar a pagos/cuotas de ${suscripcion.clienteNombre}`);
  };

  const activeFiltersCount = useMemo(() => {
    return (
      (filters.estado && filters.estado.length > 0 ? 1 : 0) +
      (filters.planId && filters.planId.length > 0 ? 1 : 0) +
      (filters.tipoCliente ? 1 : 0) +
      (filters.fechaInicioDesde ? 1 : 0) +
      (filters.fechaInicioHasta ? 1 : 0)
    );
  }, [filters]);

  const clearFilters = () => {
    setFilters({});
    setSearchQuery('');
    setCurrentPage(1);
  };

  // Obtener planes únicos para el filtro (usando planId)
  const uniquePlans = useMemo(() => {
    const planMap = new Map<string, string>();
    suscripciones.forEach(s => {
      if (!planMap.has(s.planId)) {
        planMap.set(s.planId, s.planNombre);
      }
    });
    return Array.from(planMap.entries()).map(([id, nombre]) => ({ 
      value: id, 
      label: nombre 
    }));
  }, [suscripciones]);

  const columns = [
    {
      key: 'clienteNombre',
      label: 'Cliente',
      render: (value: string, row: Suscripcion) => (
        <div className="min-w-[200px]">
          <div className="font-semibold text-gray-900">{value}</div>
          <div className="text-sm text-gray-600 flex items-center gap-2 mt-1">
            <Mail className="w-3 h-3" />
            {row.clienteEmail}
          </div>
          {row.clienteTelefono && (
            <div className="text-xs text-gray-500 flex items-center gap-1 mt-1">
              <Phone className="w-3 h-3" />
              {row.clienteTelefono}
            </div>
          )}
        </div>
      ),
    },
    {
      key: 'planNombre',
      label: 'Plan',
      render: (value: string, row: Suscripcion) => (
        <div className="min-w-[180px]">
          <div className="font-medium text-gray-900">{value}</div>
          {row.isTrial && (
            <Badge variant="blue" className="mt-1 text-xs">
              Prueba
            </Badge>
          )}
        </div>
      ),
    },
    {
      key: 'estado',
      label: 'Estado',
      render: (value: EstadoSuscripcion) => getEstadoBadge(value),
    },
    {
      key: 'precio',
      label: 'Precio',
      render: (value: number, row: Suscripcion) => (
        <div>
          <span className="font-semibold text-gray-900">{value} €</span>
          {row.precioOriginal && row.precioOriginal !== value && (
            <div className="text-xs text-gray-500 line-through">
              {row.precioOriginal} €
            </div>
          )}
        </div>
      ),
    },
    {
      key: 'fechaInicio',
      label: 'Fecha Inicio',
      render: (value: string) => (
        <div className="flex items-center gap-2 text-sm text-gray-700">
          <Calendar className="w-4 h-4 text-gray-400" />
          {new Date(value).toLocaleDateString('es-ES')}
        </div>
      ),
    },
    {
      key: 'proximaRenovacion',
      label: 'Próxima Renovación',
      render: (value?: string) => (
        <div className="flex items-center gap-2 text-sm text-gray-700">
          <Calendar className="w-4 h-4 text-gray-400" />
          {value ? new Date(value).toLocaleDateString('es-ES') : '-'}
        </div>
      ),
    },
    {
      key: 'pagoRecurrente',
      label: 'Método de Pago',
      render: (value: Suscripcion['pagoRecurrente']) => (
        <div className="flex items-center gap-2">
          {value ? (
            <>
              <CreditCard className="w-4 h-4 text-gray-400" />
              <div>
                <div className="text-sm font-medium text-gray-900 capitalize">
                  {value.metodoPago}
                </div>
                {value.numeroTarjeta && (
                  <div className="text-xs text-gray-500">
                    {value.numeroTarjeta}
                  </div>
                )}
              </div>
            </>
          ) : (
            <span className="text-sm text-gray-500">No configurado</span>
          )}
        </div>
      ),
    },
    {
      key: 'mrr',
      label: 'MRR Estimado',
      render: (_: any, row: Suscripcion) => {
        const mrr = calcularMRR(row);
        return (
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-green-600" />
            <span className="font-semibold text-gray-900">
              {mrr.toFixed(2)} €
            </span>
          </div>
        );
      },
    },
    {
      key: 'actions',
      label: 'Acciones',
      render: (_: any, row: Suscripcion) => (
        <div className="flex items-center gap-1">
          <button
            onClick={() => handleViewDetails(row)}
            className="p-2 rounded-lg text-blue-600 hover:bg-blue-50 transition-all"
            title="Ver detalles"
          >
            <Eye className="w-4 h-4" />
          </button>
          {row.estado === 'activa' && (
            <button
              onClick={() => handleFreeze(row)}
              disabled={actionLoading === row.id}
              className="p-2 rounded-lg text-yellow-600 hover:bg-yellow-50 transition-all disabled:opacity-50"
              title="Congelar"
            >
              {actionLoading === row.id ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Snowflake className="w-4 h-4" />
              )}
            </button>
          )}
          {row.estado !== 'cancelada' && (
            <button
              onClick={() => handleCancel(row)}
              disabled={actionLoading === row.id}
              className="p-2 rounded-lg text-red-600 hover:bg-red-50 transition-all disabled:opacity-50"
              title="Cancelar"
            >
              {actionLoading === row.id ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <XCircle className="w-4 h-4" />
              )}
            </button>
          )}
          <button
            onClick={() => handleChangePlan(row)}
            className="p-2 rounded-lg text-purple-600 hover:bg-purple-50 transition-all"
            title="Cambiar plan"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleGoToPayments(row)}
            className="p-2 rounded-lg text-green-600 hover:bg-green-50 transition-all"
            title="Ir a pagos/cuotas"
          >
            <CreditCard className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  // Vista de cards para móvil
  const SubscriptionCard = ({ suscripcion }: { suscripcion: Suscripcion }) => (
    <Card className="p-4 bg-white shadow-sm hover:shadow-md transition-shadow">
      <div className="space-y-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900">{suscripcion.clienteNombre}</h3>
            <p className="text-sm text-gray-600 mt-1">{suscripcion.clienteEmail}</p>
          </div>
          {getEstadoBadge(suscripcion.estado)}
        </div>
        
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <span className="text-gray-500">Plan:</span>
            <p className="font-medium text-gray-900">{suscripcion.planNombre}</p>
          </div>
          <div>
            <span className="text-gray-500">Precio:</span>
            <p className="font-medium text-gray-900">{suscripcion.precio} €</p>
          </div>
          <div>
            <span className="text-gray-500">Inicio:</span>
            <p className="text-gray-900">
              {new Date(suscripcion.fechaInicio).toLocaleDateString('es-ES')}
            </p>
          </div>
          <div>
            <span className="text-gray-500">Renovación:</span>
            <p className="text-gray-900">
              {suscripcion.proximaRenovacion 
                ? new Date(suscripcion.proximaRenovacion).toLocaleDateString('es-ES')
                : '-'}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-green-600" />
            <span className="text-sm font-semibold text-gray-900">
              MRR: {calcularMRR(suscripcion).toFixed(2)} €
            </span>
          </div>
          <div className="flex gap-1">
            <button
              onClick={() => handleViewDetails(suscripcion)}
              className="p-2 rounded-lg text-blue-600 hover:bg-blue-50"
            >
              <Eye className="w-4 h-4" />
            </button>
            {suscripcion.estado === 'activa' && (
              <button
                onClick={() => handleFreeze(suscripcion)}
                className="p-2 rounded-lg text-yellow-600 hover:bg-yellow-50"
              >
                <Snowflake className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={() => handleGoToPayments(suscripcion)}
              className="p-2 rounded-lg text-green-600 hover:bg-green-50"
            >
              <CreditCard className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Barra de búsqueda y filtros */}
      <Card className="bg-white shadow-sm">
        <div className="space-y-4">
          <div className="rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-3">
            <div className="flex gap-4 flex-col md:flex-row">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Buscar por nombre de cliente, email o plan..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
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
                  onClick={clearFilters}
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Estado
                  </label>
                  <Select
                    value={filters.estado?.[0] || ''}
                    onChange={(e) => {
                      const value = e.target.value;
                      setFilters({
                        ...filters,
                        estado: value ? [value as EstadoSuscripcion] : undefined,
                      });
                      setCurrentPage(1);
                    }}
                    options={[
                      { value: '', label: 'Todos' },
                      { value: 'activa', label: 'Activa' },
                      { value: 'pausada', label: 'Pausada' },
                      { value: 'cancelada', label: 'Cancelada' },
                      { value: 'vencida', label: 'Vencida' },
                      { value: 'pendiente', label: 'Pendiente' },
                    ]}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Plan
                  </label>
                  <Select
                    value={filters.planId?.[0] || ''}
                    onChange={(e) => {
                      const value = e.target.value;
                      setFilters({
                        ...filters,
                        planId: value ? [value] : undefined,
                      });
                      setCurrentPage(1);
                    }}
                    options={[
                      { value: '', label: 'Todos' },
                      ...uniquePlans,
                    ]}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Tipo de Cliente
                  </label>
                  <Select
                    value={filters.tipoCliente || ''}
                    onChange={(e) => {
                      setFilters({
                        ...filters,
                        tipoCliente: e.target.value || undefined,
                      });
                      setCurrentPage(1);
                    }}
                    options={[
                      { value: '', label: 'Todos' },
                      { value: 'pt-mensual', label: 'PT Mensual' },
                      { value: 'membresia-gimnasio', label: 'Membresía Gimnasio' },
                      { value: 'servicio', label: 'Servicio' },
                      { value: 'contenido', label: 'Contenido' },
                      { value: 'evento', label: 'Evento' },
                      { value: 'hibrida', label: 'Híbrida' },
                    ]}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Fecha Inicio Desde
                  </label>
                  <Input
                    type="date"
                    value={filters.fechaInicioDesde || ''}
                    onChange={(e) => {
                      setFilters({
                        ...filters,
                        fechaInicioDesde: e.target.value || undefined,
                      });
                      setCurrentPage(1);
                    }}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Fecha Inicio Hasta
                  </label>
                  <Input
                    type="date"
                    value={filters.fechaInicioHasta || ''}
                    onChange={(e) => {
                      setFilters({
                        ...filters,
                        fechaInicioHasta: e.target.value || undefined,
                      });
                      setCurrentPage(1);
                    }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Resumen de resultados */}
          <div className="flex justify-between items-center text-sm text-slate-600 border-t border-slate-200 pt-4">
            <span>
              {filteredSuscripciones.length} suscripción{filteredSuscripciones.length !== 1 ? 'es' : ''} encontrada{filteredSuscripciones.length !== 1 ? 's' : ''}
            </span>
            {activeFiltersCount > 0 && (
              <span>
                {activeFiltersCount} filtro{activeFiltersCount !== 1 ? 's' : ''} aplicado{activeFiltersCount !== 1 ? 's' : ''}
              </span>
            )}
          </div>
        </div>
      </Card>

      {/* Tabla o Cards según tamaño de pantalla */}
      {loading ? (
        <Card className="p-8 text-center bg-white shadow-sm">
          <Loader2 size={48} className="mx-auto text-blue-500 animate-spin mb-4" />
          <p className="text-gray-600">Cargando suscripciones...</p>
        </Card>
      ) : filteredSuscripciones.length === 0 ? (
        <Card className="p-12 text-center bg-white shadow-sm">
          <CreditCard className="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            No hay suscripciones
          </h3>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            No se encontraron suscripciones con los filtros aplicados.
          </p>
          {activeFiltersCount > 0 && (
            <Button variant="secondary" onClick={clearFilters}>
              Limpiar filtros
            </Button>
          )}
        </Card>
      ) : (
        <>
          {/* Vista de tabla en desktop */}
          <div className="hidden md:block">
            <Card className="bg-white shadow-sm overflow-x-auto">
              <Table
                data={paginatedSuscripciones}
                columns={columns}
                loading={false}
                emptyMessage="No hay suscripciones"
              />
            </Card>
          </div>

          {/* Vista de cards en móvil */}
          <div className="md:hidden space-y-4">
            {paginatedSuscripciones.map((suscripcion) => (
              <SubscriptionCard key={suscripcion.id} suscripcion={suscripcion} />
            ))}
          </div>

          {/* Paginación */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between bg-white p-4 rounded-lg shadow-sm">
              <div className="text-sm text-gray-600">
                Mostrando {(currentPage - 1) * itemsPerPage + 1} - {Math.min(currentPage * itemsPerPage, filteredSuscripciones.length)} de {filteredSuscripciones.length}
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <span className="text-sm text-gray-700">
                  Página {currentPage} de {totalPages}
                </span>
                <Button
                  variant="ghost"
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Modal de detalles */}
      {selectedSuscripcion && (
        <Modal
          isOpen={showDetailModal}
          onClose={() => {
            setShowDetailModal(false);
            setSelectedSuscripcion(null);
          }}
          title={`Suscripción: ${selectedSuscripcion.clienteNombre}`}
          size="xl"
        >
          <VistaClienteSuscripcion
            suscripcion={selectedSuscripcion}
            onClose={() => {
              setShowDetailModal(false);
              setSelectedSuscripcion(null);
            }}
          />
        </Modal>
      )}

      {/* Modal de cambio de plan */}
      {suscripcionParaCambio && (
        <Modal
          isOpen={showChangePlanModal}
          onClose={() => {
            setShowChangePlanModal(false);
            setSuscripcionParaCambio(null);
          }}
          title={`Cambio de Plan: ${suscripcionParaCambio.clienteNombre}`}
          size="xl"
        >
          {suscripcionParaCambio.tipo === 'pt-mensual' ? (
            <CambioPlanPT
              suscripcion={suscripcionParaCambio}
              onSuccess={() => {
                setShowChangePlanModal(false);
                setSuscripcionParaCambio(null);
                loadSuscripciones();
              }}
            />
          ) : (
            <UpgradeDowngrade
              suscripcion={suscripcionParaCambio}
              onSuccess={() => {
                setShowChangePlanModal(false);
                setSuscripcionParaCambio(null);
                loadSuscripciones();
              }}
            />
          )}
        </Modal>
      )}
    </div>
  );
};
