import React, { useState, useEffect } from 'react';
import { Table, Card, Button, Modal, Input, Select } from '../../../components/componentsreutilizables';
import { materialApi, Material } from '../api';
import { Plus, Search, Package, CheckCircle, XCircle, Wrench, AlertCircle } from 'lucide-react';

export const MaterialDisponible: React.FC = () => {
  const [material, setMaterial] = useState<Material[]>([]);
  const [loading, setLoading] = useState(true);
  const [busqueda, setBusqueda] = useState('');
  const [filtroTipo, setFiltroTipo] = useState<string>('all');
  const [filtroEstado, setFiltroEstado] = useState<string>('all');
  const [modalAbierto, setModalAbierto] = useState(false);
  const [materialSeleccionado, setMaterialSeleccionado] = useState<Material | null>(null);

  useEffect(() => {
    cargarMaterial();
  }, [filtroTipo, filtroEstado]);

  const cargarMaterial = async () => {
    try {
      setLoading(true);
      const filtros: any = {};
      if (filtroTipo !== 'all') filtros.tipo = filtroTipo;
      if (filtroEstado !== 'all') filtros.estado = filtroEstado;
      const datos = await materialApi.obtenerMaterial(filtros);
      setMaterial(datos);
    } catch (error) {
      console.error('Error al cargar material:', error);
    } finally {
      setLoading(false);
    }
  };

  const materialFiltrado = material.filter(item => {
    const matchBusqueda = busqueda === '' || 
      item.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      item.ubicacion.toLowerCase().includes(busqueda.toLowerCase());
    return matchBusqueda;
  });

  const getEstadoIcon = (estado: string) => {
    switch (estado) {
      case 'disponible':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'en_uso':
        return <Package className="w-5 h-5 text-blue-500" />;
      case 'mantenimiento':
        return <Wrench className="w-5 h-5 text-orange-500" />;
      case 'fuera_servicio':
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <AlertCircle className="w-5 h-5 text-gray-500" />;
    }
  };

  const getEstadoBadge = (estado: string) => {
    const clases = 'px-2 py-1 rounded-full text-xs font-semibold';
    switch (estado) {
      case 'disponible':
        return <span className={`${clases} bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300`}>Disponible</span>;
      case 'en_uso':
        return <span className={`${clases} bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300`}>En Uso</span>;
      case 'mantenimiento':
        return <span className={`${clases} bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300`}>Mantenimiento</span>;
      case 'reservado':
        return <span className={`${clases} bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300`}>Reservado</span>;
      case 'fuera_servicio':
        return <span className={`${clases} bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300`}>Fuera de Servicio</span>;
      default:
        return <span className={`${clases} bg-gray-100 text-gray-700 dark:bg-gray-900 dark:text-gray-300`}>{estado}</span>;
    }
  };

  const getTipoNombre = (tipo: string) => {
    const nombres: Record<string, string> = {
      maquina: 'Máquina',
      peso_libre: 'Peso Libre',
      accesorio: 'Accesorio',
      esterilla: 'Esterilla',
      bicicleta: 'Bicicleta',
      equipamiento_especializado: 'Equipamiento Especializado'
    };
    return nombres[tipo] || tipo;
  };

  const getCalidadBadge = (calidad: string) => {
    const clases = 'px-2 py-1 rounded-full text-xs font-semibold';
    switch (calidad) {
      case 'excelente':
        return <span className={`${clases} bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300`}>Excelente</span>;
      case 'bueno':
        return <span className={`${clases} bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300`}>Bueno</span>;
      case 'regular':
        return <span className={`${clases} bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300`}>Regular</span>;
      case 'requiere_atencion':
        return <span className={`${clases} bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300`}>Requiere Atención</span>;
      default:
        return <span className={`${clases} bg-gray-100 text-gray-700 dark:bg-gray-900 dark:text-gray-300`}>{calidad}</span>;
    }
  };

  const columns = [
    {
      key: 'nombre',
      label: 'Material',
      render: (value: string, row: Material) => (
        <div className="flex items-center gap-3">
          <Package className="w-5 h-5 text-gray-400" />
          <div>
            <div className="font-semibold">{value}</div>
            <div className="text-sm text-gray-500">{row.ubicacion}</div>
          </div>
        </div>
      )
    },
    {
      key: 'tipo',
      label: 'Tipo',
      render: (value: string) => getTipoNombre(value)
    },
    {
      key: 'cantidad',
      label: 'Cantidad',
      render: (_: any, row: Material) => (
        <div>
          <div className="font-semibold">
            {row.cantidadDisponible} / {row.cantidad}
          </div>
          <div className="text-sm text-gray-500">
            {row.cantidadEnUso} en uso
          </div>
        </div>
      )
    },
    {
      key: 'estado',
      label: 'Estado',
      render: (value: string) => (
        <div className="flex items-center gap-2">
          {getEstadoIcon(value)}
          {getEstadoBadge(value)}
        </div>
      )
    },
    {
      key: 'estadoCalidad',
      label: 'Calidad',
      render: (value: string) => getCalidadBadge(value)
    },
    {
      key: 'acciones',
      label: 'Acciones',
      render: (_: any, row: Material) => (
        <div className="flex gap-2">
          <Button 
            size="sm" 
            variant="ghost"
            onClick={() => {
              setMaterialSeleccionado(row);
              setModalAbierto(true);
            }}
          >
            Ver Detalles
          </Button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      {/* Toolbar superior */}
      <div className="flex items-center justify-end">
        <Button onClick={() => {
          setMaterialSeleccionado(null);
          setModalAbierto(true);
        }}>
          <Plus size={20} className="mr-2" />
          Nuevo Material
        </Button>
      </div>

      {/* Sistema de Filtros según guía */}
      <Card className="mb-6 bg-white shadow-sm">
        <div className="space-y-4">
          {/* Barra de búsqueda */}
          <div className="rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-3">
            <div className="flex gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Buscar material..."
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                  className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 pl-10 pr-3 py-2.5"
                />
              </div>
            </div>
          </div>

          {/* Panel de filtros avanzados */}
          <div className="rounded-2xl bg-white ring-1 ring-slate-200 p-4 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  <Package size={16} className="inline mr-1" />
                  Tipo
                </label>
                <Select
                  options={[
                    { value: 'all', label: 'Todos los tipos' },
                    { value: 'maquina', label: 'Máquina' },
                    { value: 'peso_libre', label: 'Peso Libre' },
                    { value: 'accesorio', label: 'Accesorio' },
                    { value: 'esterilla', label: 'Esterilla' },
                    { value: 'bicicleta', label: 'Bicicleta' },
                    { value: 'equipamiento_especializado', label: 'Equipamiento Especializado' }
                  ]}
                  value={filtroTipo}
                  onChange={(e) => setFiltroTipo(e.target.value)}
                  fullWidth={true}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  <CheckCircle size={16} className="inline mr-1" />
                  Estado
                </label>
                <Select
                  options={[
                    { value: 'all', label: 'Todos los estados' },
                    { value: 'disponible', label: 'Disponible' },
                    { value: 'en_uso', label: 'En Uso' },
                    { value: 'mantenimiento', label: 'Mantenimiento' },
                    { value: 'reservado', label: 'Reservado' },
                    { value: 'fuera_servicio', label: 'Fuera de Servicio' }
                  ]}
                  value={filtroEstado}
                  onChange={(e) => setFiltroEstado(e.target.value)}
                  fullWidth={true}
                />
              </div>
            </div>

            {/* Resumen de resultados */}
            <div className="flex justify-between items-center text-sm text-slate-600 border-t border-slate-200 pt-4">
              <span>{materialFiltrado.length} resultados encontrados</span>
              <span>
                {(filtroTipo !== 'all' || filtroEstado !== 'all') && 'Filtros aplicados'}
              </span>
            </div>
          </div>
        </div>
      </Card>

      <Table
        data={materialFiltrado}
        columns={columns}
        loading={loading}
        emptyMessage="No hay material disponible"
      />

      <Modal
        isOpen={modalAbierto}
        onClose={() => {
          setModalAbierto(false);
          setMaterialSeleccionado(null);
        }}
        title={materialSeleccionado ? 'Detalles de Material' : 'Nuevo Material'}
        size="lg"
      >
        {materialSeleccionado ? (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Nombre</label>
              <Input value={materialSeleccionado.nombre} disabled />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Tipo</label>
                <Input value={getTipoNombre(materialSeleccionado.tipo)} disabled />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Estado</label>
                <div className="mt-2">{getEstadoBadge(materialSeleccionado.estado)}</div>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Total</label>
                <Input value={materialSeleccionado.cantidad} disabled />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Disponible</label>
                <Input value={materialSeleccionado.cantidadDisponible} disabled />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">En Uso</label>
                <Input value={materialSeleccionado.cantidadEnUso} disabled />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Estado de Calidad</label>
              <div className="mt-2">{getCalidadBadge(materialSeleccionado.estadoCalidad)}</div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Nombre del Material</label>
              <Input placeholder="Ej: Bicicletas de Spinning" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Tipo</label>
                <Select
                  options={[
                    { value: 'maquina', label: 'Máquina' },
                    { value: 'peso_libre', label: 'Peso Libre' },
                    { value: 'accesorio', label: 'Accesorio' },
                    { value: 'esterilla', label: 'Esterilla' },
                    { value: 'bicicleta', label: 'Bicicleta' },
                    { value: 'equipamiento_especializado', label: 'Equipamiento Especializado' }
                  ]}
                  value=""
                  onChange={() => {}}
                  placeholder="Selecciona un tipo"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Ubicación</label>
                <Input placeholder="Ej: Sala de Spinning" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Cantidad Total</label>
                <Input type="number" placeholder="20" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Estado de Calidad</label>
                <Select
                  options={[
                    { value: 'excelente', label: 'Excelente' },
                    { value: 'bueno', label: 'Bueno' },
                    { value: 'regular', label: 'Regular' },
                    { value: 'requiere_atencion', label: 'Requiere Atención' }
                  ]}
                  value=""
                  onChange={() => {}}
                  placeholder="Selecciona calidad"
                />
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

