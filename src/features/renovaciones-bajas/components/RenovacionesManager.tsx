import React, { useState, useEffect, useMemo } from 'react';
import { Renovacion, EstadoRenovacion, FiltrosRenovaciones } from '../types';
import { 
  getRenovaciones, 
  procesarRenovacion, 
  marcarComoRenovada, 
  registrarRenovacionFallida,
  getMetricasRenovacion 
} from '../api/renovaciones';
import { Card, Button, Table, Modal, Input, Select, Textarea, Badge } from '../../../components/componentsreutilizables';
import { 
  RefreshCw, 
  Filter, 
  X, 
  Search, 
  Loader2, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  TrendingUp, 
  TrendingDown,
  AlertCircle,
  Calendar,
  User,
  CreditCard,
  Check,
  X as XIcon,
  AlertTriangle
} from 'lucide-react';

interface RenovacionesManagerProps {
  role?: 'entrenador' | 'gimnasio';
  onError?: (errorMessage: string) => void;
}

export const RenovacionesManager: React.FC<RenovacionesManagerProps> = ({ 
  role = 'gimnasio',
  onError 
}) => {
  const [renovaciones, setRenovaciones] = useState<Renovacion[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<FiltrosRenovaciones>({});
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [metricas, setMetricas] = useState<any>(null);
  const [loadingMetricas, setLoadingMetricas] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  
  // Estados para modales
  const [showMarcarRenovadaModal, setShowMarcarRenovadaModal] = useState(false);
  const [showRegistrarFallidaModal, setShowRegistrarFallidaModal] = useState(false);
  const [renovacionSeleccionada, setRenovacionSeleccionada] = useState<Renovacion | null>(null);
  const [motivoFallo, setMotivoFallo] = useState('');
  const [procesando, setProcesando] = useState(false);

  useEffect(() => {
    loadRenovaciones();
    loadMetricas();
  }, [filters]);

  const loadRenovaciones = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getRenovaciones(filters);
      setRenovaciones(data);
    } catch (error) {
      console.error('Error loading renovaciones:', error);
      const errorMessage = error instanceof Error ? error.message : 'No se pudieron cargar las renovaciones';
      setError(errorMessage);
      if (onError) {
        onError(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  const loadMetricas = async () => {
    setLoadingMetricas(true);
    try {
      const ahora = new Date();
      const metricasData = await getMetricasRenovacion({
        anio: ahora.getFullYear(),
        mes: ahora.getMonth() + 1,
      });
      setMetricas(metricasData);
    } catch (error) {
      console.error('Error loading metricas:', error);
    } finally {
      setLoadingMetricas(false);
    }
  };

  const handleProcesarRenovacion = async (renovacion: Renovacion) => {
    setProcesando(true);
    setError(null);
    setSuccessMessage(null);
    try {
      await procesarRenovacion(renovacion.id, {});
      setSuccessMessage('Renovación procesada exitosamente');
      await loadRenovaciones();
      await loadMetricas();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error al procesar la renovación';
      setError(errorMessage);
      if (onError) {
        onError(errorMessage);
      }
    } finally {
      setProcesando(false);
    }
  };

  const handleMarcarComoRenovada = async () => {
    if (!renovacionSeleccionada) return;
    
    setProcesando(true);
    setError(null);
    setSuccessMessage(null);
    try {
      await marcarComoRenovada(renovacionSeleccionada.id);
      setSuccessMessage('Renovación marcada como completada exitosamente');
      setShowMarcarRenovadaModal(false);
      setRenovacionSeleccionada(null);
      await loadRenovaciones();
      await loadMetricas();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error al marcar la renovación';
      setError(errorMessage);
      if (onError) {
        onError(errorMessage);
      }
    } finally {
      setProcesando(false);
    }
  };

  const handleRegistrarFallida = async () => {
    if (!renovacionSeleccionada || !motivoFallo.trim()) {
      setError('Por favor, ingresa un motivo para el fallo');
      return;
    }

    setProcesando(true);
    setError(null);
    setSuccessMessage(null);
    try {
      await registrarRenovacionFallida(renovacionSeleccionada.id, motivoFallo);
      setSuccessMessage('Renovación registrada como fallida');
      setShowRegistrarFallidaModal(false);
      setRenovacionSeleccionada(null);
      setMotivoFallo('');
      await loadRenovaciones();
      await loadMetricas();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error al registrar el fallo';
      setError(errorMessage);
      if (onError) {
        onError(errorMessage);
      }
    } finally {
      setProcesando(false);
    }
  };

  const getEstadoBadge = (estado: EstadoRenovacion) => {
    const estados: Record<EstadoRenovacion, { label: string; variant: 'blue' | 'purple' | 'green' | 'yellow' | 'red' }> = {
      pendiente: { label: 'Pendiente', variant: 'yellow' },
      en_proceso: { label: 'En Proceso', variant: 'purple' },
      renovada: { label: 'Renovada', variant: 'green' },
      rechazada: { label: 'Rechazada', variant: 'red' },
      fallida: { label: 'Fallida', variant: 'red' },
    };
    
    const config = estados[estado] || estados.pendiente;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const getTipoBadge = (tipo: 'automatica' | 'manual') => {
    return (
      <Badge variant={tipo === 'automatica' ? 'blue' : 'purple'}>
        {tipo === 'automatica' ? 'Automática' : 'Manual'}
      </Badge>
    );
  };

  const getSugerenciaAccion = (renovacion: Renovacion): { accion: string; color: string; icon: React.ReactNode } => {
    if (renovacion.estado === 'renovada') {
      return { accion: 'Completada', color: 'text-green-600', icon: <CheckCircle2 className="w-4 h-4" /> };
    }
    if (renovacion.estado === 'fallida' || renovacion.estado === 'rechazada') {
      return { accion: 'Contactar cliente', color: 'text-red-600', icon: <AlertCircle className="w-4 h-4" /> };
    }
    if (renovacion.diasRestantes !== undefined && renovacion.diasRestantes <= 3) {
      return { accion: 'Urgente - Renovar', color: 'text-red-600', icon: <AlertTriangle className="w-4 h-4" /> };
    }
    if (renovacion.diasRestantes !== undefined && renovacion.diasRestantes <= 7) {
      return { accion: 'Contactar pronto', color: 'text-yellow-600', icon: <Clock className="w-4 h-4" /> };
    }
    if (renovacion.planAnteriorId !== renovacion.planNuevoId && renovacion.planNuevoId) {
      const esUpgrade = ['plan-basico', 'plan-intermedio', 'plan-premium'].indexOf(renovacion.planNuevoId) > 
                        ['plan-basico', 'plan-intermedio', 'plan-premium'].indexOf(renovacion.planAnteriorId);
      return { 
        accion: esUpgrade ? 'Upgrade' : 'Downgrade', 
        color: esUpgrade ? 'text-green-600' : 'text-yellow-600',
        icon: esUpgrade ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />
      };
    }
    return { accion: 'Renovar', color: 'text-blue-600', icon: <CheckCircle2 className="w-4 h-4" /> };
  };

  // Filtrar renovaciones con búsqueda
  const filteredRenovaciones = useMemo(() => {
    let filtered = [...renovaciones];
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(ren => 
        ren.cliente?.nombre.toLowerCase().includes(query) ||
        ren.cliente?.email.toLowerCase().includes(query) ||
        ren.planActual?.nombre.toLowerCase().includes(query) ||
        ren.id.toLowerCase().includes(query)
      );
    }
    
    return filtered;
  }, [renovaciones, searchQuery]);

  const activeFiltersCount = (filters.fechaVencimientoDesde ? 1 : 0) + 
                             (filters.fechaVencimientoHasta ? 1 : 0) + 
                             (filters.tipo ? 1 : 0) + 
                             (filters.estado ? 1 : 0) + 
                             (filters.planId ? 1 : 0);

  const columns = [
    {
      key: 'cliente',
      label: 'Cliente',
      render: (_: any, row: Renovacion) => (
        <div>
          <div className="font-semibold text-gray-900">{row.cliente?.nombre || `Cliente ${row.clienteId}`}</div>
          {row.cliente?.email && (
            <div className="text-xs text-gray-500 mt-1">{row.cliente.email}</div>
          )}
        </div>
      ),
    },
    {
      key: 'plan',
      label: 'Plan Actual',
      render: (_: any, row: Renovacion) => (
        <div>
          <div className="text-sm font-medium text-gray-900">
            {row.planActual?.nombre || row.planAnteriorId}
          </div>
          {row.planActual?.precio && (
            <div className="text-xs text-gray-500">€{row.planActual.precio.toFixed(2)}/mes</div>
          )}
        </div>
      ),
    },
    {
      key: 'fechaVencimiento',
      label: 'Fecha Vencimiento',
      render: (_: any, row: Renovacion) => (
        <div>
          <div className="font-medium text-gray-900">
            {new Date(row.fechaVencimiento).toLocaleDateString('es-ES', {
              day: 'numeric',
              month: 'short',
              year: 'numeric'
            })}
          </div>
          {row.diasRestantes !== undefined && (
            <div className={`text-xs mt-1 ${
              row.diasRestantes <= 3 ? 'text-red-600 font-semibold' :
              row.diasRestantes <= 7 ? 'text-yellow-600' :
              'text-gray-500'
            }`}>
              {row.diasRestantes > 0 ? `${row.diasRestantes} días restantes` : 
               row.diasRestantes === 0 ? 'Vence hoy' : 
               `Vencida hace ${Math.abs(row.diasRestantes)} días`}
            </div>
          )}
        </div>
      ),
    },
    {
      key: 'tipo',
      label: 'Tipo',
      render: (_: any, row: Renovacion) => getTipoBadge(row.tipo),
    },
    {
      key: 'estado',
      label: 'Estado',
      render: (_: any, row: Renovacion) => getEstadoBadge(row.estado),
    },
    {
      key: 'sugerencia',
      label: 'Sugerencia',
      render: (_: any, row: Renovacion) => {
        const sugerencia = getSugerenciaAccion(row);
        return (
          <div className={`flex items-center gap-1 ${sugerencia.color}`}>
            {sugerencia.icon}
            <span className="text-sm font-medium">{sugerencia.accion}</span>
          </div>
        );
      },
    },
    {
      key: 'acciones',
      label: 'Acciones',
      render: (_: any, row: Renovacion) => (
        <div className="flex gap-2">
          {row.estado === 'pendiente' && (
            <Button
              size="sm"
              variant="primary"
              onClick={() => handleProcesarRenovacion(row)}
              disabled={procesando}
            >
              <Check className="w-4 h-4 mr-1" />
              Renovar
            </Button>
          )}
          {(row.estado === 'pendiente' || row.estado === 'en_proceso') && (
            <>
              <Button
                size="sm"
                variant="secondary"
                onClick={() => {
                  setRenovacionSeleccionada(row);
                  setShowMarcarRenovadaModal(true);
                }}
                disabled={procesando}
              >
                <CheckCircle2 className="w-4 h-4 mr-1" />
                Marcar Renovada
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => {
                  setRenovacionSeleccionada(row);
                  setShowRegistrarFallidaModal(true);
                }}
                disabled={procesando}
              >
                <XIcon className="w-4 h-4 mr-1" />
                Marcar Fallida
              </Button>
            </>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Mensajes de feedback */}
      {error && (
        <Card className="p-4 bg-red-50 border-l-4 border-red-500">
          <div className="flex items-center gap-2">
            <XCircle className="w-5 h-5 text-red-600" />
            <p className="text-red-800">{error}</p>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setError(null)}
              className="ml-auto"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </Card>
      )}

      {successMessage && (
        <Card className="p-4 bg-green-50 border-l-4 border-green-500">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-green-600" />
            <p className="text-green-800">{successMessage}</p>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSuccessMessage(null)}
              className="ml-auto"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </Card>
      )}

      {/* Métricas */}
      {loadingMetricas ? (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => (
            <Card key={i} className="p-4 bg-white shadow-sm">
              <Loader2 className="w-6 h-6 text-gray-400 animate-spin mx-auto" />
            </Card>
          ))}
        </div>
      ) : metricas && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="p-4 bg-white shadow-sm border-l-4 border-l-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 mb-1">Tasa de Renovación</p>
                <p className="text-2xl font-bold text-blue-600">{metricas.tasaRenovacion.toFixed(1)}%</p>
              </div>
              <TrendingUp className="w-8 h-8 text-blue-500" />
            </div>
          </Card>
          <Card className="p-4 bg-white shadow-sm border-l-4 border-l-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 mb-1">Total Renovaciones</p>
                <p className="text-2xl font-bold text-green-600">{metricas.renovacionesTotales}</p>
              </div>
              <CreditCard className="w-8 h-8 text-green-500" />
            </div>
          </Card>
          <Card className="p-4 bg-white shadow-sm border-l-4 border-l-purple-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 mb-1">Upgrades</p>
                <p className="text-2xl font-bold text-purple-600">{metricas.upgrades}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-purple-500" />
            </div>
          </Card>
          <Card className="p-4 bg-white shadow-sm border-l-4 border-l-yellow-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 mb-1">Downgrades</p>
                <p className="text-2xl font-bold text-yellow-600">{metricas.downgrades}</p>
              </div>
              <TrendingDown className="w-8 h-8 text-yellow-500" />
            </div>
          </Card>
        </div>
      )}

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
                  placeholder="Buscar por cliente, email, plan o ID..."
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
              <Button
                variant="ghost"
                onClick={() => {
                  loadRenovaciones();
                  loadMetricas();
                }}
                disabled={loading}
              >
                <RefreshCw size={18} className={`mr-2 ${loading ? 'animate-spin' : ''}`} />
                Actualizar
              </Button>
            </div>
          </div>

          {/* Panel de filtros avanzados */}
          {showFilters && (
            <div className="rounded-2xl bg-white ring-1 ring-slate-200 p-4 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    <Calendar size={16} className="inline mr-1" />
                    Fecha Desde
                  </label>
                  <Input
                    type="date"
                    value={filters.fechaVencimientoDesde || ''}
                    onChange={(e) => setFilters({ ...filters, fechaVencimientoDesde: e.target.value || undefined })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    <Calendar size={16} className="inline mr-1" />
                    Fecha Hasta
                  </label>
                  <Input
                    type="date"
                    value={filters.fechaVencimientoHasta || ''}
                    onChange={(e) => setFilters({ ...filters, fechaVencimientoHasta: e.target.value || undefined })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    <Filter size={16} className="inline mr-1" />
                    Tipo
                  </label>
                  <Select
                    value={filters.tipo || ''}
                    onChange={(e) => setFilters({ ...filters, tipo: e.target.value as 'automatica' | 'manual' || undefined })}
                    options={[
                      { value: '', label: 'Todos' },
                      { value: 'automatica', label: 'Automática' },
                      { value: 'manual', label: 'Manual' },
                    ]}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    <Filter size={16} className="inline mr-1" />
                    Estado
                  </label>
                  <Select
                    value={filters.estado || ''}
                    onChange={(e) => setFilters({ ...filters, estado: e.target.value as EstadoRenovacion || undefined })}
                    options={[
                      { value: '', label: 'Todos' },
                      { value: 'pendiente', label: 'Pendiente' },
                      { value: 'en_proceso', label: 'En Proceso' },
                      { value: 'renovada', label: 'Renovada' },
                      { value: 'rechazada', label: 'Rechazada' },
                      { value: 'fallida', label: 'Fallida' },
                    ]}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    <CreditCard size={16} className="inline mr-1" />
                    Plan
                  </label>
                  <Select
                    value={filters.planId || ''}
                    onChange={(e) => setFilters({ ...filters, planId: e.target.value || undefined })}
                    options={[
                      { value: '', label: 'Todos' },
                      { value: 'plan-basico', label: 'Plan Básico' },
                      { value: 'plan-intermedio', label: 'Plan Intermedio' },
                      { value: 'plan-premium', label: 'Plan Premium' },
                    ]}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Resumen de resultados */}
          <div className="flex justify-between items-center text-sm text-slate-600 border-t border-slate-200 pt-4">
            <span>{filteredRenovaciones.length} resultado{filteredRenovaciones.length !== 1 ? 's' : ''} encontrado{filteredRenovaciones.length !== 1 ? 's' : ''}</span>
            {activeFiltersCount > 0 && (
              <span>{activeFiltersCount} filtro{activeFiltersCount !== 1 ? 's' : ''} aplicado{activeFiltersCount !== 1 ? 's' : ''}</span>
            )}
          </div>
        </div>
      </Card>

      {/* Tabla de Renovaciones */}
      {loading ? (
        <Card className="p-8 text-center bg-white shadow-sm">
          <Loader2 size={48} className="mx-auto text-blue-500 animate-spin mb-4" />
          <p className="text-gray-600">Cargando renovaciones...</p>
        </Card>
      ) : filteredRenovaciones.length === 0 ? (
        <Card className="p-12 text-center bg-white shadow-sm">
          <CreditCard className="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No hay renovaciones disponibles</h3>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            No se encontraron renovaciones con los filtros aplicados. Intenta ajustar los criterios de búsqueda.
          </p>
        </Card>
      ) : (
        <Card className="p-0 bg-white shadow-sm">
          <Table
            data={filteredRenovaciones}
            columns={columns}
            loading={false}
            emptyMessage="No hay renovaciones disponibles"
          />
        </Card>
      )}

      {/* Modal para marcar como renovada */}
      <Modal
        isOpen={showMarcarRenovadaModal}
        onClose={() => {
          setShowMarcarRenovadaModal(false);
          setRenovacionSeleccionada(null);
        }}
        title="Marcar como Renovada"
        size="md"
        footer={
          <div className="flex gap-3">
            <Button 
              variant="secondary" 
              onClick={() => {
                setShowMarcarRenovadaModal(false);
                setRenovacionSeleccionada(null);
              }}
            >
              Cancelar
            </Button>
            <Button 
              variant="primary" 
              onClick={handleMarcarComoRenovada}
              loading={procesando}
            >
              <CheckCircle2 className="w-4 h-4 mr-2" />
              Confirmar
            </Button>
          </div>
        }
      >
        {renovacionSeleccionada && (
          <div className="space-y-4">
            <p className="text-gray-700">
              ¿Estás seguro de que deseas marcar esta renovación como completada?
            </p>
            <div className="bg-gray-50 p-4 rounded-lg space-y-2">
              <div>
                <span className="font-medium text-gray-700">Cliente: </span>
                <span className="text-gray-900">{renovacionSeleccionada.cliente?.nombre || renovacionSeleccionada.clienteId}</span>
              </div>
              <div>
                <span className="font-medium text-gray-700">Plan: </span>
                <span className="text-gray-900">{renovacionSeleccionada.planActual?.nombre || renovacionSeleccionada.planAnteriorId}</span>
              </div>
              <div>
                <span className="font-medium text-gray-700">Fecha de vencimiento: </span>
                <span className="text-gray-900">
                  {new Date(renovacionSeleccionada.fechaVencimiento).toLocaleDateString('es-ES')}
                </span>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Modal para registrar fallida */}
      <Modal
        isOpen={showRegistrarFallidaModal}
        onClose={() => {
          setShowRegistrarFallidaModal(false);
          setRenovacionSeleccionada(null);
          setMotivoFallo('');
        }}
        title="Registrar Renovación Fallida"
        size="md"
        footer={
          <div className="flex gap-3">
            <Button 
              variant="secondary" 
              onClick={() => {
                setShowRegistrarFallidaModal(false);
                setRenovacionSeleccionada(null);
                setMotivoFallo('');
              }}
            >
              Cancelar
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleRegistrarFallida}
              loading={procesando}
              disabled={!motivoFallo.trim()}
            >
              <XIcon className="w-4 h-4 mr-2" />
              Registrar Fallo
            </Button>
          </div>
        }
      >
        {renovacionSeleccionada && (
          <div className="space-y-4">
            <p className="text-gray-700">
              Indica el motivo del fallo de la renovación:
            </p>
            <div className="bg-gray-50 p-4 rounded-lg space-y-2 mb-4">
              <div>
                <span className="font-medium text-gray-700">Cliente: </span>
                <span className="text-gray-900">{renovacionSeleccionada.cliente?.nombre || renovacionSeleccionada.clienteId}</span>
              </div>
              <div>
                <span className="font-medium text-gray-700">Plan: </span>
                <span className="text-gray-900">{renovacionSeleccionada.planActual?.nombre || renovacionSeleccionada.planAnteriorId}</span>
              </div>
            </div>
            <Textarea
              label="Motivo del fallo"
              value={motivoFallo}
              onChange={(e) => setMotivoFallo(e.target.value)}
              placeholder="Ej: Error en el procesamiento del pago, tarjeta rechazada, cliente canceló..."
              rows={4}
              required
            />
          </div>
        )}
      </Modal>
    </div>
  );
};
