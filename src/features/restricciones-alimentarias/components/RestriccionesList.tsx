import React, { useState, useMemo } from 'react';
import { Card, Button, Input, Select, Table, Modal, ConfirmModal, MetricCards } from '../../../components/componentsreutilizables';
import { RestriccionAlimentaria, TipoRestriccion, SeveridadRestriccion, FiltrosRestricciones } from '../types';
import { useRestricciones } from '../hooks/useRestricciones';
import { 
  formatearTipoRestriccion, 
  formatearSeveridad, 
  obtenerColorSeveridad,
  obtenerIconoTipo,
  obtenerIconoSeveridad,
  formatearFechaCorta,
  obtenerTiposRestriccion,
  obtenerSeveridades
} from '../utils/validaciones';
import { ConfiguradorRestricciones } from './ConfiguradorRestricciones';
import { Plus, Search, ChevronDown, ChevronUp, X, Filter, AlertCircle, Loader2, Package } from 'lucide-react';

interface RestriccionesListProps {
  clienteId?: string;
  mostrarFiltros?: boolean;
  mostrarAcciones?: boolean;
  onSeleccionarRestriccion?: (restriccion: RestriccionAlimentaria) => void;
}

export const RestriccionesList: React.FC<RestriccionesListProps> = ({
  clienteId,
  mostrarFiltros = true,
  mostrarAcciones = true,
  onSeleccionarRestriccion
}) => {
  const { restricciones, loading, error, eliminarRestriccion } = useRestricciones(clienteId);
  
  // Estados para filtros
  const [filtros, setFiltros] = useState<FiltrosRestricciones>({});
  const [busqueda, setBusqueda] = useState('');
  const [mostrarFiltrosAvanzados, setMostrarFiltrosAvanzados] = useState(false);
  
  // Estados para modales
  const [modalCrear, setModalCrear] = useState(false);
  const [modalEditar, setModalEditar] = useState(false);
  const [restriccionSeleccionada, setRestriccionSeleccionada] = useState<RestriccionAlimentaria | null>(null);
  const [modalConfirmarEliminar, setModalConfirmarEliminar] = useState(false);
  const [restriccionAEliminar, setRestriccionAEliminar] = useState<RestriccionAlimentaria | null>(null);

  // Contar filtros activos
  const filtrosActivos = useMemo(() => {
    let count = 0;
    if (busqueda) count++;
    if (filtros.tipo && filtros.tipo.length > 0) count++;
    if (filtros.severidad && filtros.severidad.length > 0) count++;
    if (filtros.activa !== undefined) count++;
    return count;
  }, [busqueda, filtros]);

  // Filtrar restricciones
  const restriccionesFiltradas = useMemo(() => {
    return restricciones.filter(restriccion => {
      // Filtro por búsqueda
      if (busqueda) {
        const textoBusqueda = busqueda.toLowerCase();
        const coincide = 
          restriccion.nombre.toLowerCase().includes(textoBusqueda) ||
          restriccion.descripcion?.toLowerCase().includes(textoBusqueda) ||
          restriccion.ingredientesProhibidos.some(ing => ing.toLowerCase().includes(textoBusqueda));
        
        if (!coincide) return false;
      }
      
      // Filtros específicos
      if (filtros.tipo && filtros.tipo.length > 0 && !filtros.tipo.includes(restriccion.tipo)) {
        return false;
      }
      
      if (filtros.severidad && filtros.severidad.length > 0 && !filtros.severidad.includes(restriccion.severidad)) {
        return false;
      }
      
      if (filtros.activa !== undefined && restriccion.activa !== filtros.activa) {
        return false;
      }
      
      return true;
    });
  }, [restricciones, busqueda, filtros]);

  // Calcular métricas
  const metricas = useMemo(() => [
    {
      id: 'total',
      title: 'Total Restricciones',
      value: restriccionesFiltradas.length,
      color: 'info' as const,
    },
    {
      id: 'alergias',
      title: 'Alergias',
      value: restriccionesFiltradas.filter(r => r.tipo === 'alergia').length,
      color: 'danger' as const,
    },
    {
      id: 'severas',
      title: 'Críticas/Severas',
      value: restriccionesFiltradas.filter(r => r.severidad === 'severa' || r.severidad === 'critica').length,
      color: 'warning' as const,
    },
    {
      id: 'activas',
      title: 'Activas',
      value: restriccionesFiltradas.filter(r => r.activa).length,
      color: 'success' as const,
    },
  ], [restriccionesFiltradas]);

  // Configuración de columnas para la tabla
  const columnas = useMemo(() => [
    {
      key: 'tipo',
      label: 'Tipo',
      render: (valor: TipoRestriccion) => (
        <div className="flex items-center space-x-2">
          <span className="text-lg">{obtenerIconoTipo(valor)}</span>
          <span className="font-medium text-slate-900">{formatearTipoRestriccion(valor)}</span>
        </div>
      )
    },
    {
      key: 'nombre',
      label: 'Restricción',
      render: (valor: string, restriccion: RestriccionAlimentaria) => (
        <div>
          <div className="font-semibold text-gray-900">{valor}</div>
          {restriccion.descripcion && (
            <div className="text-sm text-gray-600 mt-1">
              {restriccion.descripcion}
            </div>
          )}
        </div>
      )
    },
    {
      key: 'severidad',
      label: 'Severidad',
      render: (valor: SeveridadRestriccion) => {
        const colorClass = obtenerColorSeveridad(valor);
        return (
          <div className="flex items-center space-x-2">
            <span className="text-lg">{obtenerIconoSeveridad(valor)}</span>
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${colorClass}`}>
              {formatearSeveridad(valor)}
            </span>
          </div>
        );
      }
    },
    {
      key: 'ingredientesProhibidos',
      label: 'Ingredientes Prohibidos',
      render: (valor: string[]) => (
        <div className="max-w-xs">
          <div className="flex flex-wrap gap-1">
            {valor.slice(0, 3).map((ingrediente, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-md"
              >
                {ingrediente}
              </span>
            ))}
            {valor.length > 3 && (
              <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md">
                +{valor.length - 3} más
              </span>
            )}
          </div>
        </div>
      )
    },
    {
      key: 'fechaCreacion',
      label: 'Fecha',
      render: (valor: Date) => (
        <span className="text-sm text-gray-600">
          {formatearFechaCorta(valor)}
        </span>
      )
    },
    {
      key: 'activa',
      label: 'Estado',
      render: (valor: boolean) => (
        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
          valor 
            ? 'bg-green-100 text-green-800'
            : 'bg-gray-100 text-gray-800'
        }`}>
          {valor ? 'Activa' : 'Inactiva'}
        </span>
      )
    }
  ], []);

  // Agregar columna de acciones si está habilitada
  const columnasConAcciones = useMemo(() => {
    if (!mostrarAcciones) return columnas;
    
    return [
      ...columnas,
      {
        key: 'acciones',
        label: 'Acciones',
        render: (_: any, restriccion: RestriccionAlimentaria) => (
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setRestriccionSeleccionada(restriccion);
                setModalEditar(true);
              }}
            >
              Editar
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setRestriccionAEliminar(restriccion);
                setModalConfirmarEliminar(true);
              }}
            >
              Eliminar
            </Button>
            {onSeleccionarRestriccion && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onSeleccionarRestriccion(restriccion)}
              >
                Ver
              </Button>
            )}
          </div>
        )
      }
    ];
  }, [columnas, mostrarAcciones, onSeleccionarRestriccion]);

  const handleEliminarRestriccion = async () => {
    if (!restriccionAEliminar) return;
    
    try {
      await eliminarRestriccion(restriccionAEliminar.id);
      setModalConfirmarEliminar(false);
      setRestriccionAEliminar(null);
    } catch (error) {
      console.error('Error al eliminar restricción:', error);
    }
  };

  const limpiarFiltros = () => {
    setBusqueda('');
    setFiltros({});
  };

  // Estado de carga
  if (loading) {
    return (
      <Card className="p-8 text-center bg-white shadow-sm">
        <Loader2 size={48} className="mx-auto text-blue-500 animate-spin mb-4" />
        <p className="text-gray-600">Cargando restricciones...</p>
      </Card>
    );
  }

  // Estado de error
  if (error) {
    return (
      <Card className="p-8 text-center bg-white shadow-sm">
        <AlertCircle size={48} className="mx-auto text-red-500 mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Error al cargar restricciones</h3>
        <p className="text-gray-600 mb-4">{error}</p>
        <Button onClick={() => window.location.reload()}>Reintentar</Button>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Toolbar Superior */}
      <div className="flex items-center justify-end">
        {mostrarAcciones && (
          <Button onClick={() => setModalCrear(true)}>
            <Plus size={20} className="mr-2" />
            Nueva Restricción
          </Button>
        )}
      </div>

      {/* Tarjetas de Métricas */}
      <MetricCards data={metricas} columns={4} />

      {/* Sistema de Filtros */}
      {mostrarFiltros && (
        <Card className="mb-6 bg-white shadow-sm">
          <div className="space-y-4">
            {/* Barra de búsqueda */}
            <div className="rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-3">
              <div className="flex gap-4">
                <div className="flex-1 relative">
                  <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                    placeholder="Buscar por nombre, descripción o ingrediente..."
                    className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 pl-10 pr-3 py-2.5"
                  />
                </div>
                <Button
                  variant="secondary"
                  onClick={() => setMostrarFiltrosAvanzados(!mostrarFiltrosAvanzados)}
                >
                  <Filter size={18} className="mr-2" />
                  Filtros
                  {filtrosActivos > 0 && (
                    <span className="ml-2 px-2 py-0.5 bg-blue-600 text-white text-xs rounded-full">
                      {filtrosActivos}
                    </span>
                  )}
                  {mostrarFiltrosAvanzados ? (
                    <ChevronUp size={16} className="ml-2" />
                  ) : (
                    <ChevronDown size={16} className="ml-2" />
                  )}
                </Button>
                {filtrosActivos > 0 && (
                  <Button variant="ghost" onClick={limpiarFiltros}>
                    <X size={18} className="mr-2" />
                    Limpiar
                  </Button>
                )}
              </div>
            </div>

            {/* Panel de filtros avanzados */}
            {mostrarFiltrosAvanzados && (
              <div className="rounded-2xl bg-white ring-1 ring-slate-200 p-4 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Tipo de Restricción
                    </label>
                    <Select
                      placeholder="Todos los tipos"
                      options={[
                        { value: '', label: 'Todos los tipos' },
                        ...obtenerTiposRestriccion().map(tipo => ({
                          value: tipo.value,
                          label: tipo.label
                        }))
                      ]}
                      value={filtros.tipo?.[0] || ''}
                      onChange={(e) => {
                        const valor = e.target.value as TipoRestriccion;
                        setFiltros(prev => ({
                          ...prev,
                          tipo: valor ? [valor] : undefined
                        }));
                      }}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Severidad
                    </label>
                    <Select
                      placeholder="Todas las severidades"
                      options={[
                        { value: '', label: 'Todas las severidades' },
                        ...obtenerSeveridades().map(sev => ({
                          value: sev.value,
                          label: sev.label
                        }))
                      ]}
                      value={filtros.severidad?.[0] || ''}
                      onChange={(e) => {
                        const valor = e.target.value as SeveridadRestriccion;
                        setFiltros(prev => ({
                          ...prev,
                          severidad: valor ? [valor] : undefined
                        }));
                      }}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Estado
                    </label>
                    <Select
                      placeholder="Todos los estados"
                      options={[
                        { value: '', label: 'Todos los estados' },
                        { value: 'true', label: 'Activas' },
                        { value: 'false', label: 'Inactivas' }
                      ]}
                      value={filtros.activa !== undefined ? filtros.activa.toString() : ''}
                      onChange={(e) => {
                        const valor = e.target.value;
                        setFiltros(prev => ({
                          ...prev,
                          activa: valor === '' ? undefined : valor === 'true'
                        }));
                      }}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Resumen de resultados */}
            <div className="flex justify-between items-center text-sm text-slate-600 border-t border-slate-200 pt-4">
              <span>{restriccionesFiltradas.length} resultados encontrados</span>
              {filtrosActivos > 0 && (
                <span>{filtrosActivos} filtros aplicados</span>
              )}
            </div>
          </div>
        </Card>
      )}

      {/* Tabla de restricciones */}
      {restriccionesFiltradas.length === 0 ? (
        <Card className="p-8 text-center bg-white shadow-sm">
          <Package size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No se encontraron restricciones</h3>
          <p className="text-gray-600 mb-4">
            {filtrosActivos > 0 
              ? 'Intenta ajustar los filtros para ver más resultados.'
              : 'Comienza agregando una nueva restricción alimentaria.'}
          </p>
          {mostrarAcciones && filtrosActivos === 0 && (
            <Button onClick={() => setModalCrear(true)}>
              <Plus size={18} className="mr-2" />
              Nueva Restricción
            </Button>
          )}
        </Card>
      ) : (
        <Card className="bg-white shadow-sm">
          <Table
            data={restriccionesFiltradas}
            columns={columnasConAcciones}
            loading={loading}
            emptyMessage="No se encontraron restricciones con los filtros aplicados"
          />
        </Card>
      )}

      {/* Modal para crear restricción */}
      <Modal
        isOpen={modalCrear}
        onClose={() => setModalCrear(false)}
        title="Nueva Restricción Alimentaria"
        size="md"
      >
        <ConfiguradorRestricciones
          clienteId={clienteId}
          onGuardar={() => {
            setModalCrear(false);
          }}
          onCancelar={() => setModalCrear(false)}
        />
      </Modal>

      {/* Modal para editar restricción */}
      <Modal
        isOpen={modalEditar}
        onClose={() => {
          setModalEditar(false);
          setRestriccionSeleccionada(null);
        }}
        title="Editar Restricción Alimentaria"
        size="md"
      >
        {restriccionSeleccionada && (
          <ConfiguradorRestricciones
            restriccion={restriccionSeleccionada}
            clienteId={clienteId}
            onGuardar={() => {
              setModalEditar(false);
              setRestriccionSeleccionada(null);
            }}
            onCancelar={() => {
              setModalEditar(false);
              setRestriccionSeleccionada(null);
            }}
          />
        )}
      </Modal>

      {/* Modal de confirmación para eliminar */}
      <ConfirmModal
        isOpen={modalConfirmarEliminar}
        onClose={() => {
          setModalConfirmarEliminar(false);
          setRestriccionAEliminar(null);
        }}
        onConfirm={handleEliminarRestriccion}
        title="Eliminar Restricción"
        message={`¿Estás seguro de que deseas eliminar la restricción "${restriccionAEliminar?.nombre}"? Esta acción no se puede deshacer.`}
        confirmText="Eliminar"
        variant="destructive"
      />
    </div>
  );
};