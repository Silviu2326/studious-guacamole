import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Input, Textarea, Badge, Card } from '../../../components/componentsreutilizables';
import { ds } from '../../adherencia/ui/ds';
import { MantenimientoService } from '../services/mantenimientoService';
import { Reparacion, Incidencia } from '../types';
import { Wrench, Plus, Edit, Calendar, DollarSign, Package } from 'lucide-react';

export const SeguimientoReparaciones: React.FC = () => {
  const [reparaciones, setReparaciones] = useState<Reparacion[]>([]);
  const [incidencias, setIncidencias] = useState<Incidencia[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [reparacionSeleccionada, setReparacionSeleccionada] = useState<Reparacion | null>(null);

  const [formulario, setFormulario] = useState({
    incidenciaId: '',
    diagnostico: '',
    repuestosNecesarios: '',
    tecnicoAsignado: '',
    costoRepuestos: '',
    costoServicio: '',
    notas: '',
  });

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      setLoading(true);
      const [reparacionesData, incidenciasData] = await Promise.all([
        MantenimientoService.obtenerReparaciones(),
        MantenimientoService.obtenerIncidencias(),
      ]);
      setReparaciones(reparacionesData);
      setIncidencias(incidenciasData);
    } catch (error) {
      console.error('Error al cargar datos:', error);
    } finally {
      setLoading(false);
    }
  };

  const abrirModalCrear = () => {
    setReparacionSeleccionada(null);
    setFormulario({
      incidenciaId: '',
      diagnostico: '',
      repuestosNecesarios: '',
      tecnicoAsignado: '',
      costoRepuestos: '',
      costoServicio: '',
      notas: '',
    });
    setModalAbierto(true);
  };

  const cerrarModal = () => {
    setModalAbierto(false);
    setReparacionSeleccionada(null);
  };

  const guardarReparacion = async () => {
    try {
      const datosReparacion = {
        incidenciaId: formulario.incidenciaId,
        diagnostico: formulario.diagnostico,
        repuestosNecesarios: formulario.repuestosNecesarios
          ? formulario.repuestosNecesarios.split(',').map(r => r.trim())
          : [],
        tecnicoAsignado: formulario.tecnicoAsignado,
        costoRepuestos: formulario.costoRepuestos ? parseFloat(formulario.costoRepuestos) : undefined,
        costoServicio: formulario.costoServicio ? parseFloat(formulario.costoServicio) : undefined,
        notas: formulario.notas,
        fechaInicio: new Date().toISOString(),
        estado: 'diagnostico' as const,
      };

      await MantenimientoService.crearReparacion(datosReparacion);
      cerrarModal();
      cargarDatos();
    } catch (error) {
      console.error('Error al guardar reparación:', error);
    }
  };

  const obtenerColorEstado = (estado: string) => {
    switch (estado) {
      case 'completada':
        return 'green';
      case 'en_reparacion':
        return 'blue';
      case 'esperando_repuestos':
        return 'yellow';
      case 'diagnostico':
        return 'gray';
      case 'pruebas':
        return 'purple';
      default:
        return 'gray';
    }
  };

  const columnas = [
    {
      key: 'incidencia',
      label: 'Incidencia',
      render: (value: any, row: Reparacion) => (
        <span>{row.incidencia?.titulo || 'N/A'}</span>
      ),
    },
    {
      key: 'diagnostico',
      label: 'Diagnóstico',
      render: (value: string) => (
        <span className="text-sm">{value.substring(0, 50)}...</span>
      ),
    },
    {
      key: 'tecnicoNombre',
      label: 'Técnico',
      render: (value: string, row: Reparacion) => (
        <span>{row.tecnicoNombre || row.tecnicoAsignado || 'Sin asignar'}</span>
      ),
    },
    {
      key: 'estado',
      label: 'Estado',
      render: (value: string) => (
        <Badge variant={obtenerColorEstado(value) as any}>
          {value.replace('_', ' ').toUpperCase()}
        </Badge>
      ),
    },
    {
      key: 'fechaInicio',
      label: 'Fecha Inicio',
      render: (value: string) => new Date(value).toLocaleDateString('es-ES'),
    },
    {
      key: 'costoTotal',
      label: 'Costo Total',
      render: (value: number | undefined) =>
        value ? new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(value) : 'N/A',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className={`${ds.typography.h2} ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
            Seguimiento de Reparaciones
          </h2>
          <p className={`${ds.typography.body} ${ds.color.textSecondary} ${ds.color.textSecondaryDark} mt-1`}>
            Gestiona y realiza seguimiento de reparaciones en curso
          </p>
        </div>
        <Button onClick={abrirModalCrear}>
          <Plus className="w-4 h-4 mr-2" />
          Nueva Reparación
        </Button>
      </div>

      {/* Resumen de Reparaciones */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card padding="md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
              <Wrench className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className={`${ds.typography.bodySmall} ${ds.color.textSecondary} ${ds.color.textSecondaryDark}`}>
                En Reparación
              </p>
              <p className={`${ds.typography.h3} ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
                {reparaciones.filter(r => r.estado === 'en_reparacion').length}
              </p>
            </div>
          </div>
        </Card>
        <Card padding="md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg flex items-center justify-center">
              <Package className="w-5 h-5 text-yellow-600" />
            </div>
            <div>
              <p className={`${ds.typography.bodySmall} ${ds.color.textSecondary} ${ds.color.textSecondaryDark}`}>
                Esperando Repuestos
              </p>
              <p className={`${ds.typography.h3} ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
                {reparaciones.filter(r => r.estado === 'esperando_repuestos').length}
              </p>
            </div>
          </div>
        </Card>
        <Card padding="md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
              <Calendar className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className={`${ds.typography.bodySmall} ${ds.color.textSecondary} ${ds.color.textSecondaryDark}`}>
                En Pruebas
              </p>
              <p className={`${ds.typography.h3} ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
                {reparaciones.filter(r => r.estado === 'pruebas').length}
              </p>
            </div>
          </div>
        </Card>
        <Card padding="md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className={`${ds.typography.bodySmall} ${ds.color.textSecondary} ${ds.color.textSecondaryDark}`}>
                Costo Total Mes
              </p>
              <p className={`${ds.typography.h3} ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
                {new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 })
                  .format(reparaciones.reduce((sum, r) => sum + (r.costoTotal || 0), 0))}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Tabla de Reparaciones */}
      <Table
        data={reparaciones}
        columns={columnas}
        loading={loading}
        emptyMessage="No hay reparaciones registradas"
      />

      {/* Modal Crear/Editar Reparación */}
      <Modal
        isOpen={modalAbierto}
        onClose={cerrarModal}
        title="Nueva Reparación"
        size="lg"
        footer={
          <div className="flex gap-3 justify-end">
            <Button variant="secondary" onClick={cerrarModal}>
              Cancelar
            </Button>
            <Button onClick={guardarReparacion}>
              Crear Reparación
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className={`block ${ds.typography.bodySmall} font-semibold ${ds.color.textPrimary} ${ds.color.textPrimaryDark} mb-2`}>
                Incidencia Relacionada
              </label>
              <select
                className={ds.select}
                value={formulario.incidenciaId}
                onChange={(e) => setFormulario({ ...formulario, incidenciaId: e.target.value })}
              >
                <option value="">Seleccionar incidencia</option>
                {incidencias
                  .filter(i => i.estado !== 'resuelta')
                  .map(inc => (
                    <option key={inc.id} value={inc.id}>
                      {inc.titulo} - {inc.equipamiento?.nombre}
                    </option>
                  ))}
              </select>
            </div>
            <Input
              label="Técnico Asignado"
              value={formulario.tecnicoAsignado}
              onChange={(e) => setFormulario({ ...formulario, tecnicoAsignado: e.target.value })}
              placeholder="Nombre del técnico"
            />
            <Input
              label="Costo Repuestos (COP)"
              type="number"
              value={formulario.costoRepuestos}
              onChange={(e) => setFormulario({ ...formulario, costoRepuestos: e.target.value })}
              placeholder="0"
            />
            <Input
              label="Costo Servicio (COP)"
              type="number"
              value={formulario.costoServicio}
              onChange={(e) => setFormulario({ ...formulario, costoServicio: e.target.value })}
              placeholder="0"
            />
          </div>
          <Textarea
            label="Diagnóstico"
            value={formulario.diagnostico}
            onChange={(e) => setFormulario({ ...formulario, diagnostico: e.target.value })}
            placeholder="Describe el diagnóstico del problema..."
            rows={4}
          />
          <Input
            label="Repuestos Necesarios (separados por comas)"
            value={formulario.repuestosNecesarios}
            onChange={(e) => setFormulario({ ...formulario, repuestosNecesarios: e.target.value })}
            placeholder="Ej: Cable, Resistor, Banda"
          />
          <Textarea
            label="Notas"
            value={formulario.notas}
            onChange={(e) => setFormulario({ ...formulario, notas: e.target.value })}
            placeholder="Notas adicionales sobre la reparación..."
            rows={3}
          />
        </div>
      </Modal>
    </div>
  );
};

