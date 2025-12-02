import React, { useState, useEffect } from 'react';
import { Table, Card, Button, Modal, Input, Select } from '../../../components/componentsreutilizables';
import { salasApi, Sala } from '../api';
import { Plus, Search, Building2, Users, MapPin, CheckCircle, XCircle, Wrench } from 'lucide-react';

export const SalasDisponibles: React.FC = () => {
  const [salas, setSalas] = useState<Sala[]>([]);
  const [loading, setLoading] = useState(true);
  const [busqueda, setBusqueda] = useState('');
  const [filtroTipo, setFiltroTipo] = useState<string>('all');
  const [filtroEstado, setFiltroEstado] = useState<string>('all');
  const [modalAbierto, setModalAbierto] = useState(false);
  const [salaSeleccionada, setSalaSeleccionada] = useState<Sala | null>(null);

  useEffect(() => {
    cargarSalas();
  }, [filtroTipo, filtroEstado]);

  const cargarSalas = async () => {
    try {
      setLoading(true);
      const filtros: any = {};
      if (filtroTipo !== 'all') filtros.tipo = filtroTipo;
      if (filtroEstado !== 'all') filtros.estado = filtroEstado;
      const datos = await salasApi.obtenerSalas(filtros);
      setSalas(datos);
    } catch (error) {
      console.error('Error al cargar salas:', error);
    } finally {
      setLoading(false);
    }
  };

  const salasFiltradas = salas.filter(sala => {
    const matchBusqueda = busqueda === '' || 
      sala.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      sala.ubicacion.toLowerCase().includes(busqueda.toLowerCase());
    return matchBusqueda;
  });

  const getEstadoIcon = (estado: string) => {
    switch (estado) {
      case 'disponible':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'ocupada':
        return <Users className="w-5 h-5 text-blue-500" />;
      case 'mantenimiento':
      case 'bloqueada':
        return <Wrench className="w-5 h-5 text-orange-500" />;
      default:
        return <XCircle className="w-5 h-5 text-gray-500" />;
    }
  };

  const getEstadoBadge = (estado: string) => {
    const clases = 'px-2 py-1 rounded-full text-xs font-semibold';
    switch (estado) {
      case 'disponible':
        return <span className={`${clases} bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300`}>Disponible</span>;
      case 'ocupada':
        return <span className={`${clases} bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300`}>Ocupada</span>;
      case 'mantenimiento':
        return <span className={`${clases} bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300`}>Mantenimiento</span>;
      case 'bloqueada':
        return <span className={`${clases} bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300`}>Bloqueada</span>;
      default:
        return <span className={`${clases} bg-gray-100 text-gray-700 dark:bg-gray-900 dark:text-gray-300`}>{estado}</span>;
    }
  };

  const getTipoNombre = (tipo: string) => {
    const nombres: Record<string, string> = {
      musculacion: 'Musculación',
      cardio: 'Cardio',
      spinning: 'Spinning',
      yoga: 'Yoga',
      boxeo: 'Boxeo',
      crossfit: 'Crossfit',
      fisioterapia: 'Fisioterapia',
      nutricion: 'Nutrición'
    };
    return nombres[tipo] || tipo;
  };

  const columns = [
    {
      key: 'nombre',
      label: 'Sala',
      render: (value: string, row: Sala) => (
        <div className="flex items-center gap-3">
          <Building2 className="w-5 h-5 text-gray-400" />
          <div>
            <div className="font-semibold">{value}</div>
            <div className="text-sm text-gray-500 flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              {row.ubicacion}
            </div>
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
      key: 'ocupacionActual',
      label: 'Ocupación',
      render: (value: number, row: Sala) => (
        <div>
          <div className="font-semibold">{value} / {row.capacidad}</div>
          <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
            <div 
              className={`h-2 rounded-full ${
                (value / row.capacidad) > 0.8 ? 'bg-red-500' :
                (value / row.capacidad) > 0.5 ? 'bg-yellow-500' : 'bg-green-500'
              }`}
              style={{ width: `${Math.min((value / row.capacidad) * 100, 100)}%` }}
            />
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
      key: 'acciones',
      label: 'Acciones',
      render: (_: any, row: Sala) => (
        <div className="flex gap-2">
          <Button 
            size="sm" 
            variant="ghost"
            onClick={() => {
              setSalaSeleccionada(row);
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
        <Button onClick={() => setModalAbierto(true)}>
          <Plus size={20} className="mr-2" />
          Nueva Sala
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
                  placeholder="Buscar salas..."
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
                  <Building2 size={16} className="inline mr-1" />
                  Tipo
                </label>
                <Select
                  options={[
                    { value: 'all', label: 'Todos los tipos' },
                    { value: 'musculacion', label: 'Musculación' },
                    { value: 'cardio', label: 'Cardio' },
                    { value: 'spinning', label: 'Spinning' },
                    { value: 'yoga', label: 'Yoga' },
                    { value: 'boxeo', label: 'Boxeo' },
                    { value: 'crossfit', label: 'Crossfit' },
                    { value: 'fisioterapia', label: 'Fisioterapia' },
                    { value: 'nutricion', label: 'Nutrición' }
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
                    { value: 'ocupada', label: 'Ocupada' },
                    { value: 'mantenimiento', label: 'Mantenimiento' },
                    { value: 'bloqueada', label: 'Bloqueada' }
                  ]}
                  value={filtroEstado}
                  onChange={(e) => setFiltroEstado(e.target.value)}
                  fullWidth={true}
                />
              </div>
            </div>

            {/* Resumen de resultados */}
            <div className="flex justify-between items-center text-sm text-slate-600 border-t border-slate-200 pt-4">
              <span>{salasFiltradas.length} resultados encontrados</span>
              <span>
                {(filtroTipo !== 'all' || filtroEstado !== 'all') && 'Filtros aplicados'}
              </span>
            </div>
          </div>
        </div>
      </Card>

      <Table
        data={salasFiltradas}
        columns={columns}
        loading={loading}
        emptyMessage="No hay salas disponibles"
      />

      <Modal
        isOpen={modalAbierto}
        onClose={() => {
          setModalAbierto(false);
          setSalaSeleccionada(null);
        }}
        title={salaSeleccionada ? 'Detalles de Sala' : 'Nueva Sala'}
        size="lg"
      >
        {salaSeleccionada ? (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Nombre</label>
              <Input value={salaSeleccionada.nombre} disabled />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Tipo</label>
              <Input value={getTipoNombre(salaSeleccionada.tipo)} disabled />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Capacidad</label>
              <Input value={salaSeleccionada.capacidad} disabled />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Ocupación Actual</label>
              <Input value={salaSeleccionada.ocupacionActual} disabled />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Estado</label>
              <div className="mt-2">{getEstadoBadge(salaSeleccionada.estado)}</div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Nombre de la Sala</label>
              <Input placeholder="Ej: Sala de Musculación Principal" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Tipo</label>
              <Select
                options={[
                  { value: 'musculacion', label: 'Musculación' },
                  { value: 'cardio', label: 'Cardio' },
                  { value: 'spinning', label: 'Spinning' },
                  { value: 'yoga', label: 'Yoga' },
                  { value: 'boxeo', label: 'Boxeo' },
                  { value: 'crossfit', label: 'Crossfit' },
                  { value: 'fisioterapia', label: 'Fisioterapia' },
                  { value: 'nutricion', label: 'Nutrición' }
                ]}
                value=""
                onChange={() => {}}
                placeholder="Selecciona un tipo"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Capacidad</label>
                <Input type="number" placeholder="50" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Ubicación</label>
                <Input placeholder="Ej: Planta 1" />
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

