import React, { useState } from 'react';
import { Card, Button, Input, Select, Table, Modal, ConfirmModal } from '../../../components/componentsreutilizables';
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
  
  // Estados para modales
  const [modalCrear, setModalCrear] = useState(false);
  const [modalEditar, setModalEditar] = useState(false);
  const [restriccionSeleccionada, setRestriccionSeleccionada] = useState<RestriccionAlimentaria | null>(null);
  const [modalConfirmarEliminar, setModalConfirmarEliminar] = useState(false);
  const [restriccionAEliminar, setRestriccionAEliminar] = useState<RestriccionAlimentaria | null>(null);

  // Filtrar restricciones
  const restriccionesFiltradas = restricciones.filter(restriccion => {
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

  // Configuración de columnas para la tabla
  const columnas = [
    {
      key: 'tipo',
      label: 'Tipo',
      render: (valor: TipoRestriccion) => (
        <div className="flex items-center space-x-2">
          <span className="text-lg">{obtenerIconoTipo(valor)}</span>
          <span className="font-medium">{formatearTipoRestriccion(valor)}</span>
        </div>
      )
    },
    {
      key: 'nombre',
      label: 'Restricción',
      render: (valor: string, restriccion: RestriccionAlimentaria) => (
        <div>
          <div className="font-semibold text-gray-900 dark:text-white">{valor}</div>
          {restriccion.descripcion && (
            <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
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
                className="px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200 text-xs rounded-md"
              >
                {ingrediente}
              </span>
            ))}
            {valor.length > 3 && (
              <span className="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-xs rounded-md">
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
        <span className="text-sm text-gray-500 dark:text-gray-400">
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
            ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200'
            : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
        }`}>
          {valor ? 'Activa' : 'Inactiva'}
        </span>
      )
    }
  ];

  // Agregar columna de acciones si está habilitada
  if (mostrarAcciones) {
    columnas.push({
      key: 'acciones',
      label: 'Acciones',
      render: (_: any, restriccion: RestriccionAlimentaria) => (
        <div className="flex space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setRestriccionSeleccionada(restriccion);
              setModalEditar(true);
            }}
          >
            ✏️
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setRestriccionAEliminar(restriccion);
              setModalConfirmarEliminar(true);
            }}
          >
            🗑️
          </Button>
          {onSeleccionarRestriccion && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onSeleccionarRestriccion(restriccion)}
            >
              👁️
            </Button>
          )}
        </div>
      )
    });
  }

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

  if (error) {
    return (
      <Card className="p-6">
        <div className="text-center text-red-600 dark:text-red-400">
          <div className="text-4xl mb-4">⚠️</div>
          <h3 className="text-lg font-semibold mb-2">Error al cargar restricciones</h3>
          <p>{error}</p>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Restricciones Alimentarias
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Gestión de alergias, intolerancias y restricciones dietéticas
          </p>
        </div>
        {mostrarAcciones && (
          <Button
            variant="primary"
            onClick={() => setModalCrear(true)}
          >
            ➕ Nueva Restricción
          </Button>
        )}
      </div>

      {/* Filtros */}
      {mostrarFiltros && (
        <Card className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Input
              placeholder="Buscar restricciones..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              leftIcon={<span>🔍</span>}
            />
            
            <Select
              placeholder="Tipo de restricción"
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
            
            <Select
              placeholder="Severidad"
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
            
            <Select
              placeholder="Estado"
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
        </Card>
      )}

      {/* Estadísticas rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
              <span className="text-2xl">📋</span>
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {restriccionesFiltradas.length}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Total restricciones
              </div>
            </div>
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center">
              <span className="text-2xl">⚠️</span>
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {restriccionesFiltradas.filter(r => r.tipo === 'alergia').length}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Alergias
              </div>
            </div>
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center">
              <span className="text-2xl">🔴</span>
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {restriccionesFiltradas.filter(r => r.severidad === 'severa' || r.severidad === 'critica').length}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Críticas/Severas
              </div>
            </div>
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
              <span className="text-2xl">✅</span>
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {restriccionesFiltradas.filter(r => r.activa).length}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Activas
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Tabla de restricciones */}
      <Table
        data={restriccionesFiltradas}
        columns={columnas}
        loading={loading}
        emptyMessage="No se encontraron restricciones con los filtros aplicados"
      />

      {/* Modal para crear restricción */}
      <Modal
        isOpen={modalCrear}
        onClose={() => setModalCrear(false)}
        title="Nueva Restricción Alimentaria"
        size="lg"
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
        size="lg"
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