// Componente ChecklistDashboard - Container
import React, { useEffect, useState } from 'react';
import { ChecklistInstance, ChecklistTemplate, UserRole } from '../types';
import { ChecklistsService } from '../services/checklistsService';
import { Card, Button, Table, Select, Badge, Modal, MetricCards } from '../../../components/componentsreutilizables';
import { ChecklistInstanceView } from './ChecklistInstanceView';
import { ChecklistTemplateBuilder } from './ChecklistTemplateBuilder';
import { Plus, Eye, Filter, CheckCircle2, Clock, AlertCircle, ClipboardList } from 'lucide-react';

interface ChecklistDashboardProps {
  userRole: UserRole;
}

export const ChecklistDashboard: React.FC<ChecklistDashboardProps> = ({ userRole }) => {
  const [instances, setInstances] = useState<ChecklistInstance[]>([]);
  const [templates, setTemplates] = useState<ChecklistTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'instances' | 'templates'>('instances');
  const [selectedInstanceId, setSelectedInstanceId] = useState<string | null>(null);
  const [showTemplateBuilder, setShowTemplateBuilder] = useState(false);
  const [filters, setFilters] = useState({
    date: '',
    status: '',
    assignedTo: ''
  });

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    loadInstances();
  }, [filters]);

  const loadData = async () => {
    try {
      setLoading(true);
      await Promise.all([loadInstances(), loadTemplates()]);
    } catch (error) {
      console.error('Error al cargar datos:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadInstances = async () => {
    try {
      const data = await ChecklistsService.obtenerInstances(filters);
      setInstances(data);
    } catch (error) {
      console.error('Error al cargar instancias:', error);
    }
  };

  const loadTemplates = async () => {
    try {
      const data = await ChecklistsService.obtenerTemplates();
      setTemplates(data);
    } catch (error) {
      console.error('Error al cargar plantillas:', error);
    }
  };

  const handleViewInstance = (instanceId: string) => {
    setSelectedInstanceId(instanceId);
  };

  const handleTemplateSaved = (template: ChecklistTemplate) => {
    setTemplates([...templates, template]);
    setShowTemplateBuilder(false);
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { variant: 'gray' as const, label: 'Pendiente', icon: <Clock className="w-4 h-4" /> },
      in_progress: { variant: 'blue' as const, label: 'En Progreso', icon: <Clock className="w-4 h-4" /> },
      completed: { variant: 'green' as const, label: 'Completado', icon: <CheckCircle2 className="w-4 h-4" /> },
      overdue: { variant: 'red' as const, label: 'Retrasado', icon: <AlertCircle className="w-4 h-4" /> }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    return (
      <Badge variant={config.variant} leftIcon={config.icon}>
        {config.label}
      </Badge>
    );
  };

  const instanceColumns = [
    {
      key: 'templateName',
      label: 'Checklist',
      sortable: true,
      render: (value: string, row: ChecklistInstance) => (
        <div>
          <p className="font-semibold text-gray-900">{value}</p>
          <p className="text-sm text-gray-500">{row.assignedTo.name}</p>
        </div>
      )
    },
    {
      key: 'dueDate',
      label: 'Fecha Límite',
      sortable: true,
      render: (value: string) => (
        <span className="text-sm">
          {new Date(value).toLocaleString('es-ES', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })}
        </span>
      )
    },
    {
      key: 'status',
      label: 'Estado',
      sortable: true,
      render: (value: string) => getStatusBadge(value)
    },
    {
      key: 'completionPercentage',
      label: 'Progreso',
      sortable: true,
      render: (value: number) => (
        <div className="flex items-center gap-2">
          <div className="flex-1 bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full"
              style={{ width: `${value}%` }}
            />
          </div>
          <span className="text-sm font-semibold w-12 text-right">{value}%</span>
        </div>
      )
    },
    {
      key: 'actions',
      label: 'Acciones',
      render: (_: any, row: ChecklistInstance) => (
        <Button
          variant="secondary"
          size="sm"
          onClick={() => handleViewInstance(row.id)}
        >
          <Eye className="w-4 h-4 mr-2" />
          Ver
        </Button>
      )
    }
  ];

  const templateColumns = [
    {
      key: 'name',
      label: 'Nombre',
      sortable: true,
      render: (value: string) => <span className="font-semibold">{value}</span>
    },
    {
      key: 'description',
      label: 'Descripción',
      sortable: false
    },
    {
      key: 'taskCount',
      label: 'Tareas',
      sortable: true,
      render: (value: number) => (
        <Badge variant="blue">
          {value} {value === 1 ? 'tarea' : 'tareas'}
        </Badge>
      )
    },
    {
      key: 'createdAt',
      label: 'Creada',
      sortable: true,
      render: (value: string) => (
        <span className="text-sm">
          {new Date(value).toLocaleDateString('es-ES')}
        </span>
      )
    }
  ];

  const metrics = [
    {
      id: 'total',
      title: 'Total Checklists',
      value: instances.length,
      color: 'info' as const,
      icon: <ClipboardList size={20} />
    },
    {
      id: 'completed',
      title: 'Completados',
      value: instances.filter(i => i.status === 'completed').length,
      color: 'success' as const,
      icon: <CheckCircle2 size={20} />
    },
    {
      id: 'in-progress',
      title: 'En Progreso',
      value: instances.filter(i => i.status === 'in_progress').length,
      color: 'info' as const,
      icon: <Clock size={20} />
    },
    {
      id: 'overdue',
      title: 'Retrasados',
      value: instances.filter(i => i.status === 'overdue').length,
      color: 'error' as const,
      icon: <AlertCircle size={20} />
    }
  ];

  return (
    <div className="space-y-6">
      {/* Métricas */}
      <MetricCards data={metrics} columns={4} />

      {/* Tabs */}
      <Card className="p-0 bg-white shadow-sm">
        <div className="px-4 py-3">
          <div
            role="tablist"
            aria-label="Secciones"
            className="flex items-center gap-2 rounded-2xl bg-slate-100 p-1"
          >
            <button
              role="tab"
              aria-selected={activeTab === 'instances'}
              onClick={() => setActiveTab('instances')}
              className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all ${
                activeTab === 'instances'
                  ? 'bg-white text-slate-900 shadow-sm ring-1 ring-slate-200'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/70'
              }`}
            >
              <ClipboardList
                size={18}
                className={activeTab === 'instances' ? 'opacity-100' : 'opacity-70'}
              />
              <span>Checklists</span>
            </button>
            {userRole === 'manager' && (
              <button
                role="tab"
                aria-selected={activeTab === 'templates'}
                onClick={() => setActiveTab('templates')}
                className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all ${
                  activeTab === 'templates'
                    ? 'bg-white text-slate-900 shadow-sm ring-1 ring-slate-200'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/70'
                }`}
              >
                <ClipboardList
                  size={18}
                  className={activeTab === 'templates' ? 'opacity-100' : 'opacity-70'}
                />
                <span>Plantillas</span>
              </button>
            )}
          </div>
        </div>
      </Card>

      {/* Contenido de tabs */}
      <Card className="bg-white shadow-sm">
        <div className="p-4">
          {activeTab === 'instances' ? (
            <Table
              data={instances}
              columns={instanceColumns}
              loading={loading}
              emptyMessage="No hay checklists asignados"
            />
          ) : (
            <div className="space-y-4">
              {userRole === 'manager' && (
                <div className="flex justify-end">
                  <Button
                    variant="primary"
                    onClick={() => setShowTemplateBuilder(true)}
                  >
                    <Plus className="w-5 h-5 mr-2" />
                    Crear Plantilla
                  </Button>
                </div>
              )}
              <Table
                data={templates}
                columns={templateColumns}
                loading={loading}
                emptyMessage="No hay plantillas disponibles"
              />
            </div>
          )}
        </div>
      </Card>

      {/* Instance View Modal */}
      {selectedInstanceId && (
        <Modal
          isOpen={!!selectedInstanceId}
          onClose={() => setSelectedInstanceId(null)}
          title="Ver Checklist"
          size="xl"
        >
          <ChecklistInstanceView instanceId={selectedInstanceId} />
        </Modal>
      )}

      {/* Template Builder Modal */}
      <Modal
        isOpen={showTemplateBuilder}
        onClose={() => setShowTemplateBuilder(false)}
        title="Crear Nueva Plantilla"
        size="xl"
      >
        <ChecklistTemplateBuilder
          onSave={handleTemplateSaved}
          onCancel={() => setShowTemplateBuilder(false)}
        />
      </Modal>
    </div>
  );
};

