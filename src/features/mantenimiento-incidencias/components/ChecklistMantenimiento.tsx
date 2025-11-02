import React, { useState, useEffect } from 'react';
import { Card, Button, Table, Modal, Input, Select, Badge } from '../../../components/componentsreutilizables';
import { ds } from '../../adherencia/ui/ds';
import { MantenimientoService } from '../services/mantenimientoService';
import { Checklist, ChecklistItem, FrecuenciaChecklist, Equipamiento } from '../types';
import { CheckCircle2, Circle, Plus, FileCheck, Calendar } from 'lucide-react';

export const ChecklistMantenimiento: React.FC = () => {
  const [checklists, setChecklists] = useState<Checklist[]>([]);
  const [equipamiento, setEquipamiento] = useState<Equipamiento[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [checklistActivo, setChecklistActivo] = useState<Checklist | null>(null);
  const [ejecutandoChecklist, setEjecutandoChecklist] = useState<Checklist | null>(null);

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      setLoading(true);
      const [checklistsData, equipamientoData] = await Promise.all([
        MantenimientoService.obtenerChecklists(),
        MantenimientoService.obtenerEquipamiento(),
      ]);
      setChecklists(checklistsData);
      setEquipamiento(equipamientoData);
    } catch (error) {
      console.error('Error al cargar datos:', error);
    } finally {
      setLoading(false);
    }
  };

  const iniciarEjecucion = (checklist: Checklist) => {
    const checklistParaEjecutar = {
      ...checklist,
      items: checklist.items.map(item => ({ ...item, completado: false })),
    };
    setEjecutandoChecklist(checklistParaEjecutar);
    setModalAbierto(true);
  };

  const toggleItem = (itemId: string) => {
    if (!ejecutandoChecklist) return;
    setEjecutandoChecklist({
      ...ejecutandoChecklist,
      items: ejecutandoChecklist.items.map(item =>
        item.id === itemId ? { ...item, completado: !item.completado } : item
      ),
    });
  };

  const completarChecklist = async () => {
    if (!ejecutandoChecklist) return;
    // Aquí se guardaría el checklist completado
    cerrarModal();
    cargarDatos();
  };

  const cerrarModal = () => {
    setModalAbierto(false);
    setEjecutandoChecklist(null);
  };

  const obtenerPorcentajeCompletado = (checklist: Checklist) => {
    if (checklist.items.length === 0) return 0;
    const completados = checklist.items.filter(item => item.completado).length;
    return Math.round((completados / checklist.items.length) * 100);
  };

  const columnas = [
    {
      key: 'nombre',
      label: 'Nombre',
      sortable: true,
    },
    {
      key: 'tipoEquipamiento',
      label: 'Tipo de Equipamiento',
    },
    {
      key: 'frecuencia',
      label: 'Frecuencia',
      render: (value: FrecuenciaChecklist) => (
        <Badge variant="blue">{value}</Badge>
      ),
    },
    {
      key: 'items',
      label: 'Progreso',
      render: (value: ChecklistItem[], row: Checklist) => {
        const porcentaje = obtenerPorcentajeCompletado(row);
        return (
          <div className="flex items-center gap-2">
            <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all"
                style={{ width: `${porcentaje}%` }}
              />
            </div>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {porcentaje}%
            </span>
          </div>
        );
      },
    },
    {
      key: 'fechaUltimaEjecucion',
      label: 'Última Ejecución',
      render: (value: string | undefined) =>
        value ? new Date(value).toLocaleDateString('es-ES') : 'Nunca',
    },
    {
      key: 'acciones',
      label: 'Acciones',
      render: (value: any, row: Checklist) => (
        <Button
          variant="primary"
          size="sm"
          onClick={() => iniciarEjecucion(row)}
        >
          <FileCheck className="w-4 h-4 mr-2" />
          Ejecutar
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className={`${ds.typography.h2} ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
          Checklist de Mantenimiento
        </h2>
        <p className={`${ds.typography.body} ${ds.color.textSecondary} ${ds.color.textSecondaryDark} mt-1`}>
          Ejecuta y gestiona checklist de mantenimiento preventivo y correctivo
        </p>
      </div>

      {/* Checklists disponibles */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {['Diario', 'Semanal', 'Mensual', 'Trimestral', 'Anual'].map((frecuencia) => (
          <Card key={frecuencia} variant="hover" padding="md" onClick={() => {
            const checklist = checklists.find(c => c.frecuencia === frecuencia.toLowerCase() as FrecuenciaChecklist);
            if (checklist) iniciarEjecucion(checklist);
          }}>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-blue-600" />
                <h3 className={`${ds.typography.h3} ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
                  {frecuencia}
                </h3>
              </div>
              <FileCheck className="w-5 h-5 text-gray-400" />
            </div>
            <p className={`${ds.typography.bodySmall} ${ds.color.textSecondary} ${ds.color.textSecondaryDark}`}>
              Checklist de mantenimiento {frecuencia.toLowerCase()}
            </p>
            <div className="mt-4">
              <Button variant="primary" size="sm" fullWidth>
                Ejecutar Checklist
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Tabla de Checklists */}
      <Card>
        <h3 className={`${ds.typography.h3} ${ds.color.textPrimary} ${ds.color.textPrimaryDark} mb-4`}>
          Historial de Checklists
        </h3>
        <Table
          data={checklists}
          columns={columnas}
          loading={loading}
          emptyMessage="No hay checklists configurados"
        />
      </Card>

      {/* Modal Ejecutar Checklist */}
      <Modal
        isOpen={modalAbierto}
        onClose={cerrarModal}
        title={ejecutandoChecklist ? `Ejecutar: ${ejecutandoChecklist.nombre}` : ''}
        size="lg"
        footer={
          ejecutandoChecklist && (
            <div className="flex gap-3 justify-end">
              <Button variant="secondary" onClick={cerrarModal}>
                Cancelar
              </Button>
              <Button
                onClick={completarChecklist}
                disabled={ejecutandoChecklist.items.filter(item => item.completado).length === 0}
              >
                Completar Checklist
              </Button>
            </div>
          )
        }
      >
        {ejecutandoChecklist && (
          <div className="space-y-4">
            <div className="mb-4">
              <p className={`${ds.typography.body} ${ds.color.textSecondary} ${ds.color.textSecondaryDark}`}>
                Marca cada tarea como completada al verificarla
              </p>
            </div>
            <div className="space-y-3">
              {ejecutandoChecklist.items.map((item) => (
                <div
                  key={item.id}
                  className={`flex items-start gap-3 p-4 rounded-lg border ${
                    item.completado
                      ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
                      : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
                  }`}
                >
                  <button
                    onClick={() => toggleItem(item.id)}
                    className="mt-0.5 flex-shrink-0"
                  >
                    {item.completado ? (
                      <CheckCircle2 className="w-6 h-6 text-green-600" />
                    ) : (
                      <Circle className="w-6 h-6 text-gray-400" />
                    )}
                  </button>
                  <div className="flex-1">
                    <p
                      className={`${
                        item.completado
                          ? 'line-through text-gray-500'
                          : `${ds.typography.body} ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`
                      }`}
                    >
                      {item.tarea}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <p className={`${ds.typography.bodySmall} ${ds.color.textSecondary} ${ds.color.textSecondaryDark}`}>
                Progreso: {ejecutandoChecklist.items.filter(item => item.completado).length} /{' '}
                {ejecutandoChecklist.items.length} tareas completadas
              </p>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

