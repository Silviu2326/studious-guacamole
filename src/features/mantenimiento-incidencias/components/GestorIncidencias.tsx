import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Input, Select, Textarea, Badge, Card } from '../../../components/componentsreutilizables';
import { ds } from '../../adherencia/ui/ds';
import { MantenimientoService } from '../services/mantenimientoService';
import { Incidencia, Equipamiento, PrioridadIncidencia, TipoIncidencia, EstadoIncidencia } from '../types';
import { AlertTriangle, Plus, Edit, CheckCircle, XCircle, Filter } from 'lucide-react';

export const GestorIncidencias: React.FC = () => {
  const [incidencias, setIncidencias] = useState<Incidencia[]>([]);
  const [equipamiento, setEquipamiento] = useState<Equipamiento[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [incidenciaSeleccionada, setIncidenciaSeleccionada] = useState<Incidencia | null>(null);
  const [filtros, setFiltros] = useState<{ estado?: string; prioridad?: string; tipo?: string }>({});
  
  // Formulario
  const [formulario, setFormulario] = useState({
    titulo: '',
    descripcion: '',
    equipamientoId: '',
    tipo: 'general' as TipoIncidencia,
    prioridad: 'media' as PrioridadIncidencia,
  });

  useEffect(() => {
    cargarDatos();
  }, [filtros]);

  const cargarDatos = async () => {
    try {
      setLoading(true);
      const [incidenciasData, equipamientoData] = await Promise.all([
        MantenimientoService.obtenerIncidencias(filtros),
        MantenimientoService.obtenerEquipamiento(),
      ]);
      setIncidencias(incidenciasData);
      setEquipamiento(equipamientoData);
    } catch (error) {
      console.error('Error al cargar datos:', error);
    } finally {
      setLoading(false);
    }
  };

  const abrirModalCrear = () => {
    setIncidenciaSeleccionada(null);
    setFormulario({
      titulo: '',
      descripcion: '',
      equipamientoId: '',
      tipo: 'general',
      prioridad: 'media',
    });
    setModalAbierto(true);
  };

  const abrirModalEditar = (incidencia: Incidencia) => {
    setIncidenciaSeleccionada(incidencia);
    setFormulario({
      titulo: incidencia.titulo,
      descripcion: incidencia.descripcion,
      equipamientoId: incidencia.equipamientoId,
      tipo: incidencia.tipo,
      prioridad: incidencia.prioridad,
    });
    setModalAbierto(true);
  };

  const cerrarModal = () => {
    setModalAbierto(false);
    setIncidenciaSeleccionada(null);
  };

  const guardarIncidencia = async () => {
    try {
      if (incidenciaSeleccionada) {
        await MantenimientoService.actualizarIncidencia(incidenciaSeleccionada.id, formulario);
      } else {
        await MantenimientoService.crearIncidencia(formulario);
      }
      cerrarModal();
      cargarDatos();
    } catch (error) {
      console.error('Error al guardar incidencia:', error);
    }
  };

  const obtenerColorPrioridad = (prioridad: PrioridadIncidencia) => {
    switch (prioridad) {
      case 'critica':
        return 'red';
      case 'media':
        return 'yellow';
      case 'baja':
        return 'green';
      default:
        return 'gray';
    }
  };

  const obtenerColorEstado = (estado: EstadoIncidencia) => {
    switch (estado) {
      case 'resuelta':
        return 'green';
      case 'en_proceso':
        return 'blue';
      case 'pendiente':
        return 'yellow';
      case 'cancelada':
        return 'gray';
      default:
        return 'gray';
    }
  };

  const columnas = [
    {
      key: 'titulo',
      label: 'Título',
      sortable: true,
    },
    {
      key: 'equipamiento',
      label: 'Equipamiento',
      render: (value: any, row: Incidencia) => (
        <span>{row.equipamiento?.nombre || 'N/A'}</span>
      ),
    },
    {
      key: 'tipo',
      label: 'Tipo',
      render: (value: TipoIncidencia) => (
        <Badge variant="outline">{value}</Badge>
      ),
    },
    {
      key: 'prioridad',
      label: 'Prioridad',
      render: (value: PrioridadIncidencia) => (
        <Badge variant={obtenerColorPrioridad(value) as any}>
          {value.toUpperCase()}
        </Badge>
      ),
    },
    {
      key: 'estado',
      label: 'Estado',
      render: (value: EstadoIncidencia) => (
        <Badge variant={obtenerColorEstado(value) as any}>
          {value.replace('_', ' ').toUpperCase()}
        </Badge>
      ),
    },
    {
      key: 'fechaReporte',
      label: 'Fecha Reporte',
      render: (value: string) => new Date(value).toLocaleDateString('es-ES'),
    },
    {
      key: 'acciones',
      label: 'Acciones',
      render: (value: any, row: Incidencia) => (
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => abrirModalEditar(row)}
          >
            <Edit className="w-4 h-4" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className={`${ds.typography.h2} ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
            Gestión de Incidencias
          </h2>
          <p className={`${ds.typography.body} ${ds.color.textSecondary} ${ds.color.textSecondaryDark} mt-1`}>
            Gestiona y hace seguimiento de todas las incidencias reportadas
          </p>
        </div>
        <Button onClick={abrirModalCrear}>
          <Plus className="w-4 h-4 mr-2" />
          Reportar Incidencia
        </Button>
      </div>

      {/* Filtros */}
      <Card>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Select
            label="Estado"
            placeholder="Todos los estados"
            options={[
              { value: '', label: 'Todos los estados' },
              { value: 'pendiente', label: 'Pendiente' },
              { value: 'en_proceso', label: 'En Proceso' },
              { value: 'resuelta', label: 'Resuelta' },
              { value: 'cancelada', label: 'Cancelada' },
            ]}
            value={filtros.estado || ''}
            onChange={(e) => setFiltros({ ...filtros, estado: e.target.value || undefined })}
          />
          <Select
            label="Prioridad"
            placeholder="Todas las prioridades"
            options={[
              { value: '', label: 'Todas las prioridades' },
              { value: 'critica', label: 'Crítica' },
              { value: 'media', label: 'Media' },
              { value: 'baja', label: 'Baja' },
            ]}
            value={filtros.prioridad || ''}
            onChange={(e) => setFiltros({ ...filtros, prioridad: e.target.value || undefined })}
          />
          <Select
            label="Tipo"
            placeholder="Todos los tipos"
            options={[
              { value: '', label: 'Todos los tipos' },
              { value: 'seguridad', label: 'Seguridad' },
              { value: 'limpieza', label: 'Limpieza' },
              { value: 'suministros', label: 'Suministros' },
              { value: 'climatizacion', label: 'Climatización' },
              { value: 'general', label: 'General' },
            ]}
            value={filtros.tipo || ''}
            onChange={(e) => setFiltros({ ...filtros, tipo: e.target.value || undefined })}
          />
        </div>
      </Card>

      {/* Tabla de Incidencias */}
      <Table
        data={incidencias}
        columns={columnas}
        loading={loading}
        emptyMessage="No hay incidencias registradas"
      />

      {/* Modal Crear/Editar */}
      <Modal
        isOpen={modalAbierto}
        onClose={cerrarModal}
        title={incidenciaSeleccionada ? 'Editar Incidencia' : 'Reportar Nueva Incidencia'}
        size="lg"
        footer={
          <div className="flex gap-3 justify-end">
            <Button variant="secondary" onClick={cerrarModal}>
              Cancelar
            </Button>
            <Button onClick={guardarIncidencia}>
              {incidenciaSeleccionada ? 'Actualizar' : 'Crear'} Incidencia
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          <Input
            label="Título"
            value={formulario.titulo}
            onChange={(e) => setFormulario({ ...formulario, titulo: e.target.value })}
            placeholder="Ej: Máquina rota en sala principal"
          />
          <Select
            label="Equipamiento"
            options={[
              { value: '', label: 'Seleccionar equipamiento' },
              ...equipamiento.map(eq => ({ value: eq.id, label: eq.nombre })),
            ]}
            value={formulario.equipamientoId}
            onChange={(e) => setFormulario({ ...formulario, equipamientoId: e.target.value })}
          />
          <Select
            label="Tipo"
            options={[
              { value: 'general', label: 'General' },
              { value: 'seguridad', label: 'Seguridad' },
              { value: 'limpieza', label: 'Limpieza' },
              { value: 'suministros', label: 'Suministros' },
              { value: 'climatizacion', label: 'Climatización' },
            ]}
            value={formulario.tipo}
            onChange={(e) => setFormulario({ ...formulario, tipo: e.target.value as TipoIncidencia })}
          />
          <Select
            label="Prioridad"
            options={[
              { value: 'baja', label: 'Baja' },
              { value: 'media', label: 'Media' },
              { value: 'critica', label: 'Crítica' },
            ]}
            value={formulario.prioridad}
            onChange={(e) => setFormulario({ ...formulario, prioridad: e.target.value as PrioridadIncidencia })}
          />
          <Textarea
            label="Descripción"
            value={formulario.descripcion}
            onChange={(e) => setFormulario({ ...formulario, descripcion: e.target.value })}
            placeholder="Describe el problema detalladamente..."
            rows={4}
          />
        </div>
      </Modal>
    </div>
  );
};

