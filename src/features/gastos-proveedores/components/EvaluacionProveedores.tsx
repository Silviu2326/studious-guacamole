import React, { useState, useEffect, useMemo } from 'react';
import { Card, Table, Button, Modal, Select, MetricCards } from '../../../components/componentsreutilizables';
import { getProveedores } from '../api/proveedores';
import { EvaluacionProveedor, Proveedor } from '../types';
import { Star, Plus, Search, Filter, X, ChevronDown, ChevronUp, Loader2, Package, Calendar } from 'lucide-react';

// Componente LightInput para filtros (según guía de estilos)
type LightInputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
};

const LightInput: React.FC<LightInputProps> = ({ leftIcon, rightIcon, className = '', ...props }) => (
  <div className={`relative ${className}`}>
    {leftIcon && (
      <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
        <span className="text-slate-400">{leftIcon}</span>
      </span>
    )}
    <input
      {...props}
      className={[
        'w-full rounded-xl bg-white text-slate-900 placeholder-slate-400',
        'ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400',
        leftIcon ? 'pl-10' : 'pl-3',
        rightIcon ? 'pr-10' : 'pr-3',
        'py-2.5'
      ].join(' ')}
    />
    {rightIcon && (
      <span className="absolute inset-y-0 right-0 flex items-center pr-3">
        {rightIcon}
      </span>
    )}
  </div>
);

// Datos mock para evaluaciones
const evaluacionesMock: EvaluacionProveedor[] = [
  {
    id: '1',
    proveedorId: '1',
    fecha: new Date('2024-01-20'),
    calificacion: 4.5,
    criterios: {
      calidad: 5,
      precio: 4,
      servicio: 4.5,
      puntualidad: 4,
      comunicacion: 5,
    },
    comentarios: 'Excelente servicio, muy profesional',
    usuario: 'admin',
    ordenCompraId: '1',
  },
  {
    id: '2',
    proveedorId: '2',
    fecha: new Date('2024-01-25'),
    calificacion: 3.8,
    criterios: {
      calidad: 4,
      precio: 3.5,
      servicio: 4,
      puntualidad: 3.5,
      comunicacion: 4,
    },
    comentarios: 'Buen proveedor, mejoraría en puntualidad',
    usuario: 'admin',
    ordenCompraId: '2',
  },
];

interface FiltrosEvaluacion {
  busqueda?: string;
  proveedorId?: string;
  calificacionMin?: number;
  fechaDesde?: string;
  fechaHasta?: string;
}

export const EvaluacionProveedores: React.FC = () => {
  const [evaluaciones, setEvaluaciones] = useState<EvaluacionProveedor[]>(evaluacionesMock);
  const [proveedores, setProveedores] = useState<Proveedor[]>([]);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [cargando, setCargando] = useState(false);
  const [mostrarFiltrosAvanzados, setMostrarFiltrosAvanzados] = useState(false);
  const [filtros, setFiltros] = useState<FiltrosEvaluacion>({});
  const [evaluacionEditando, setEvaluacionEditando] = useState<EvaluacionProveedor | null>(null);

  // Formulario de evaluación
  const [formEvaluacion, setFormEvaluacion] = useState({
    proveedorId: '',
    fecha: new Date().toISOString().split('T')[0],
    calidad: 5,
    precio: 5,
    servicio: 5,
    puntualidad: 5,
    comunicacion: 5,
    comentarios: '',
    ordenCompraId: '',
  });

  useEffect(() => {
    cargarProveedores();
  }, []);

  const cargarProveedores = async () => {
    try {
      setCargando(true);
      const data = await getProveedores({ activo: true });
      setProveedores(data);
    } catch (error) {
      console.error('Error al cargar proveedores:', error);
    } finally {
      setCargando(false);
    }
  };

  const renderEstrellas = (calificacion: number) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={16}
            className={`${star <= Math.round(calificacion) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
          />
        ))}
        <span className="ml-2 text-sm font-medium text-gray-700">{calificacion.toFixed(1)}</span>
      </div>
    );
  };

  const getProveedorNombre = (proveedorId: string) => {
    const proveedor = proveedores.find(p => p.id === proveedorId);
    return proveedor?.nombre || 'N/A';
  };

  // Filtrar evaluaciones
  const evaluacionesFiltradas = useMemo(() => {
    return evaluaciones.filter((evaluacion) => {
      if (filtros.busqueda) {
        const busqueda = filtros.busqueda.toLowerCase();
        const proveedorNombre = getProveedorNombre(evaluacion.proveedorId).toLowerCase();
        const comentarios = (evaluacion.comentarios || '').toLowerCase();
        if (!proveedorNombre.includes(busqueda) && !comentarios.includes(busqueda)) {
          return false;
        }
      }
      if (filtros.proveedorId && evaluacion.proveedorId !== filtros.proveedorId) {
        return false;
      }
      if (filtros.calificacionMin && evaluacion.calificacion < filtros.calificacionMin) {
        return false;
      }
      if (filtros.fechaDesde) {
        const fechaEval = new Date(evaluacion.fecha);
        const fechaDesde = new Date(filtros.fechaDesde);
        if (fechaEval < fechaDesde) return false;
      }
      if (filtros.fechaHasta) {
        const fechaEval = new Date(evaluacion.fecha);
        const fechaHasta = new Date(filtros.fechaHasta);
        fechaHasta.setHours(23, 59, 59, 999);
        if (fechaEval > fechaHasta) return false;
      }
      return true;
    });
  }, [evaluaciones, filtros, proveedores]);

  // Calcular métricas
  const metricas = useMemo(() => {
    const total = evaluacionesFiltradas.length;
    const promedio = total > 0
      ? evaluacionesFiltradas.reduce((sum, e) => sum + e.calificacion, 0) / total
      : 0;
    const ultimaEvaluacion = evaluacionesFiltradas.length > 0
      ? evaluacionesFiltradas[evaluacionesFiltradas.length - 1]
      : null;
    
    return [
      {
        id: 'total',
        title: 'Total Evaluaciones',
        value: total,
        color: 'info' as const,
      },
      {
        id: 'promedio',
        title: 'Calificación Promedio',
        value: promedio > 0 ? promedio.toFixed(1) : '0.0',
        subtitle: `De ${total} evaluaciones`,
        color: 'success' as const,
      },
      {
        id: 'ultima',
        title: 'Última Evaluación',
        value: ultimaEvaluacion 
          ? new Date(ultimaEvaluacion.fecha).toLocaleDateString('es-CO', { month: 'short', day: 'numeric' })
          : 'N/A',
        subtitle: ultimaEvaluacion ? getProveedorNombre(ultimaEvaluacion.proveedorId) : '',
        color: 'warning' as const,
      },
    ];
  }, [evaluacionesFiltradas, proveedores]);

  const filtrosActivos = Object.values(filtros).filter(v => v !== undefined && v !== '').length;

  const handleFiltroChange = (key: keyof FiltrosEvaluacion, value: any) => {
    setFiltros(prev => ({
      ...prev,
      [key]: value || undefined,
    }));
  };

  const limpiarFiltros = () => {
    setFiltros({});
  };

  const abrirModalNuevo = () => {
    setEvaluacionEditando(null);
    setFormEvaluacion({
      proveedorId: '',
      fecha: new Date().toISOString().split('T')[0],
      calidad: 5,
      precio: 5,
      servicio: 5,
      puntualidad: 5,
      comunicacion: 5,
      comentarios: '',
      ordenCompraId: '',
    });
    setMostrarModal(true);
  };

  const guardarEvaluacion = () => {
    const calificacionPromedio = (
      formEvaluacion.calidad +
      formEvaluacion.precio +
      formEvaluacion.servicio +
      formEvaluacion.puntualidad +
      formEvaluacion.comunicacion
    ) / 5;

    const nuevaEvaluacion: EvaluacionProveedor = {
      id: evaluacionEditando?.id || Date.now().toString(),
      proveedorId: formEvaluacion.proveedorId,
      fecha: new Date(formEvaluacion.fecha),
      calificacion: calificacionPromedio,
      criterios: {
        calidad: formEvaluacion.calidad,
        precio: formEvaluacion.precio,
        servicio: formEvaluacion.servicio,
        puntualidad: formEvaluacion.puntualidad,
        comunicacion: formEvaluacion.comunicacion,
      },
      comentarios: formEvaluacion.comentarios,
      usuario: 'admin',
      ordenCompraId: formEvaluacion.ordenCompraId || undefined,
    };

    if (evaluacionEditando) {
      setEvaluaciones(prev => prev.map(e => e.id === evaluacionEditando.id ? nuevaEvaluacion : e));
    } else {
      setEvaluaciones(prev => [...prev, nuevaEvaluacion]);
    }

    setMostrarModal(false);
  };

  const columnas = [
    {
      key: 'fecha',
      label: 'Fecha',
      render: (value: Date) => (
        <div className="flex items-center gap-2">
          <Calendar size={16} className="text-gray-400" />
          <span className="text-sm text-gray-700">{value.toLocaleDateString('es-CO')}</span>
        </div>
      ),
      sortable: true,
    },
    {
      key: 'proveedorId',
      label: 'Proveedor',
      render: (value: string) => (
        <span className="font-medium text-gray-900">{getProveedorNombre(value)}</span>
      ),
      sortable: true,
    },
    {
      key: 'calificacion',
      label: 'Calificación',
      render: (value: number) => renderEstrellas(value),
      sortable: true,
    },
    {
      key: 'criterios',
      label: 'Detalle de Criterios',
      render: (value: EvaluacionProveedor['criterios']) => (
        <div className="text-xs text-gray-600 space-y-1">
          <div className="flex items-center gap-2">
            <span className="font-medium">Calidad:</span>
            <span>{value.calidad.toFixed(1)}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-medium">Precio:</span>
            <span>{value.precio.toFixed(1)}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-medium">Servicio:</span>
            <span>{value.servicio.toFixed(1)}</span>
          </div>
        </div>
      ),
    },
    {
      key: 'comentarios',
      label: 'Comentarios',
      render: (value: string | undefined) => (
        <span className="text-sm text-gray-600">{value || <span className="text-gray-400 italic">Sin comentarios</span>}</span>
      ),
    },
    {
      key: 'acciones',
      label: 'Acciones',
      render: (_: any, row: EvaluacionProveedor) => (
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setEvaluacionEditando(row);
              setFormEvaluacion({
                proveedorId: row.proveedorId,
                fecha: new Date(row.fecha).toISOString().split('T')[0],
                calidad: row.criterios.calidad,
                precio: row.criterios.precio,
                servicio: row.criterios.servicio,
                puntualidad: row.criterios.puntualidad,
                comunicacion: row.criterios.comunicacion,
                comentarios: row.comentarios || '',
                ordenCompraId: row.ordenCompraId || '',
              });
              setMostrarModal(true);
            }}
          >
            Editar
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Toolbar Superior */}
      <div className="flex items-center justify-end">
        <Button onClick={abrirModalNuevo}>
          <Plus size={20} className="mr-2" />
          Nueva Evaluación
        </Button>
      </div>

      {/* Métricas/KPIs */}
      <MetricCards data={metricas} columns={3} />

      {/* Sistema de Filtros */}
      <Card className="mb-6 bg-white shadow-sm">
        <div className="space-y-4">
          {/* Barra de búsqueda */}
          <div className="rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-3">
            <div className="flex gap-4">
              <div className="flex-1">
                <LightInput
                  placeholder="Buscar por proveedor o comentarios..."
                  value={(filtros.busqueda as string) || ''}
                  onChange={(e) => handleFiltroChange('busqueda', e.currentTarget.value)}
                  leftIcon={<Search size={20} />}
                  rightIcon={
                    filtros.busqueda ? (
                      <button
                        onClick={() => handleFiltroChange('busqueda', '')}
                        className="text-slate-400 hover:text-slate-600 transition-colors"
                      >
                        <X size={16} />
                      </button>
                    ) : undefined
                  }
                />
              </div>

              <Button
                variant="secondary"
                onClick={() => setMostrarFiltrosAvanzados(!mostrarFiltrosAvanzados)}
                className="flex items-center gap-2"
              >
                <Filter size={16} />
                Filtros
                {filtrosActivos > 0 && (
                  <span className="bg-blue-600 text-white text-xs rounded-full px-2 py-1 min-w-[20px] h-5 flex items-center justify-center shadow-sm">
                    {filtrosActivos}
                  </span>
                )}
                {mostrarFiltrosAvanzados ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </Button>

              {filtrosActivos > 0 && (
                <Button variant="ghost" onClick={limpiarFiltros}>
                  <X size={16} className="mr-2" />
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
                    Proveedor
                  </label>
                  <Select
                    options={[
                      { value: '', label: 'Todos los proveedores' },
                      ...proveedores.map(p => ({ value: p.id, label: p.nombre })),
                    ]}
                    value={filtros.proveedorId || ''}
                    onChange={(e) => handleFiltroChange('proveedorId', e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Calificación Mínima
                  </label>
                  <Select
                    options={[
                      { value: '', label: 'Todas' },
                      { value: '3', label: '3.0 o más' },
                      { value: '4', label: '4.0 o más' },
                      { value: '4.5', label: '4.5 o más' },
                      { value: '5', label: '5.0' },
                    ]}
                    value={filtros.calificacionMin?.toString() || ''}
                    onChange={(e) => handleFiltroChange('calificacionMin', e.target.value ? parseFloat(e.target.value) : undefined)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    <Calendar size={16} className="inline mr-1" />
                    Fecha Desde
                  </label>
                  <input
                    type="date"
                    value={filtros.fechaDesde || ''}
                    onChange={(e) => handleFiltroChange('fechaDesde', e.target.value)}
                    className="w-full rounded-xl bg-white text-slate-900 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    <Calendar size={16} className="inline mr-1" />
                    Fecha Hasta
                  </label>
                  <input
                    type="date"
                    value={filtros.fechaHasta || ''}
                    onChange={(e) => handleFiltroChange('fechaHasta', e.target.value)}
                    className="w-full rounded-xl bg-white text-slate-900 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5"
                  />
                </div>
              </div>

              {/* Resumen de resultados */}
              <div className="flex justify-between items-center text-sm text-slate-600 border-t border-slate-200 pt-4">
                <span>{evaluacionesFiltradas.length} evaluación{evaluacionesFiltradas.length !== 1 ? 'es' : ''} encontrada{evaluacionesFiltradas.length !== 1 ? 's' : ''}</span>
                {filtrosActivos > 0 && <span>{filtrosActivos} filtro{filtrosActivos !== 1 ? 's' : ''} aplicado{filtrosActivos !== 1 ? 's' : ''}</span>}
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Tabla de Evaluaciones */}
      {cargando ? (
        <Card className="p-8 text-center bg-white shadow-sm">
          <Loader2 size={48} className="mx-auto text-blue-500 animate-spin mb-4" />
          <p className="text-gray-600">Cargando evaluaciones...</p>
        </Card>
      ) : evaluacionesFiltradas.length === 0 ? (
        <Card className="p-8 text-center bg-white shadow-sm">
          <Package size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No hay evaluaciones</h3>
          <p className="text-gray-600 mb-4">
            {filtrosActivos > 0 
              ? 'No se encontraron evaluaciones con los filtros aplicados'
              : 'Comienza agregando una nueva evaluación de proveedor'}
          </p>
          {filtrosActivos > 0 ? (
            <Button variant="secondary" onClick={limpiarFiltros}>
              Limpiar Filtros
            </Button>
          ) : (
            <Button onClick={abrirModalNuevo}>
              <Plus size={16} className="mr-2" />
              Nueva Evaluación
            </Button>
          )}
        </Card>
      ) : (
        <Card className="bg-white shadow-sm p-0">
          <div className="p-4">
            <Table
              data={evaluacionesFiltradas}
              columns={columnas}
              emptyMessage="No hay evaluaciones registradas"
            />
          </div>
        </Card>
      )}

      {/* Modal de Crear/Editar Evaluación */}
      <Modal
        isOpen={mostrarModal}
        onClose={() => setMostrarModal(false)}
        title={evaluacionEditando ? 'Editar Evaluación' : 'Nueva Evaluación'}
        size="lg"
        footer={
          <div className="flex gap-2 justify-end">
            <Button variant="secondary" onClick={() => setMostrarModal(false)}>
              Cancelar
            </Button>
            <Button onClick={guardarEvaluacion}>
              {evaluacionEditando ? 'Guardar Cambios' : 'Crear Evaluación'}
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Proveedor *
            </label>
            <Select
              options={[
                { value: '', label: 'Seleccione un proveedor' },
                ...proveedores.map(p => ({ value: p.id, label: p.nombre })),
              ]}
              value={formEvaluacion.proveedorId}
              onChange={(e) => setFormEvaluacion(prev => ({ ...prev, proveedorId: e.target.value }))}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              <Calendar size={16} className="inline mr-1" />
              Fecha *
            </label>
            <input
              type="date"
              value={formEvaluacion.fecha}
              onChange={(e) => setFormEvaluacion(prev => ({ ...prev, fecha: e.target.value }))}
              className="w-full rounded-xl bg-white text-slate-900 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5"
            />
          </div>

          <div className="border-t border-slate-200 pt-4">
            <h3 className="text-sm font-semibold text-slate-900 mb-4">Criterios de Evaluación (1-5)</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { key: 'calidad', label: 'Calidad' },
                { key: 'precio', label: 'Precio' },
                { key: 'servicio', label: 'Servicio' },
                { key: 'puntualidad', label: 'Puntualidad' },
                { key: 'comunicacion', label: 'Comunicación' },
              ].map(({ key, label }) => (
                <div key={key}>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    {label}
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="range"
                      min="1"
                      max="5"
                      step="0.5"
                      value={formEvaluacion[key as keyof typeof formEvaluacion] as number}
                      onChange={(e) => setFormEvaluacion(prev => ({ 
                        ...prev, 
                        [key]: parseFloat(e.target.value) 
                      }))}
                      className="flex-1"
                    />
                    <div className="flex items-center gap-1 min-w-[80px]">
                      <Star size={16} className="fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-semibold text-gray-700 w-8">
                        {formEvaluacion[key as keyof typeof formEvaluacion] as number}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Comentarios
            </label>
            <textarea
              value={formEvaluacion.comentarios}
              onChange={(e) => setFormEvaluacion(prev => ({ ...prev, comentarios: e.target.value }))}
              rows={4}
              className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5"
              placeholder="Agregue comentarios sobre la evaluación..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              ID de Orden de Compra (opcional)
            </label>
            <input
              type="text"
              value={formEvaluacion.ordenCompraId}
              onChange={(e) => setFormEvaluacion(prev => ({ ...prev, ordenCompraId: e.target.value }))}
              className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5"
              placeholder="OC-001"
            />
          </div>
        </div>
      </Modal>
    </div>
  );
};

