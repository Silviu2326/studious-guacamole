// TemplateManagerContainer - Container principal
import React, { useState, useEffect } from 'react';
import { GlobalTemplate, TemplateFilters, TemplateStats } from '../types';
import { templatesApi } from '../api/templatesApi';
import { 
  TemplateDataTable, 
  TemplateEditorModal, 
  TemplateViewerModal 
} from './index';
import { 
  Card, 
  Button, 
  Select, 
  SelectOption, 
  MetricCards
} from '../../../components/componentsreutilizables';
import { 
  Search, 
  Plus, 
  FileText, 
  CheckCircle2, 
  AlertTriangle, 
  Package,
  X,
  ChevronDown,
  ChevronUp,
  Filter
} from 'lucide-react';

export const TemplateManagerContainer: React.FC = () => {
  const [templates, setTemplates] = useState<GlobalTemplate[]>([]);
  const [filteredTemplates, setFilteredTemplates] = useState<GlobalTemplate[]>([]);
  const [stats, setStats] = useState<TemplateStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState<TemplateFilters>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [selectedType, setSelectedType] = useState<string>('ALL');
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<GlobalTemplate | null>(null);
  const [activeTab, setActiveTab] = useState('all');
  const [mostrarFiltrosAvanzados, setMostrarFiltrosAvanzados] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [templates, filters, searchTerm, selectedStatus, selectedType, activeTab]);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const [templatesData, statsData] = await Promise.all([
        templatesApi.obtenerPlantillas(),
        templatesApi.obtenerEstadisticas()
      ]);
      setTemplates(templatesData);
      setStats(statsData);
    } catch (error) {
      console.error('Error al cargar datos:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...templates];

    // Filter by status
    if (selectedStatus !== 'ALL') {
      filtered = filtered.filter(t => t.status === selectedStatus);
    }

    // Filter by type
    if (selectedType !== 'ALL') {
      filtered = filtered.filter(t => t.type === selectedType);
    }

    // Filter by search
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(t => 
        t.name.toLowerCase().includes(searchLower) ||
        t.description?.toLowerCase().includes(searchLower)
      );
    }

    // Filter by mandatory
    if (activeTab === 'mandatory') {
      filtered = filtered.filter(t => t.isMandatory);
    } else if (activeTab === 'optional') {
      filtered = filtered.filter(t => !t.isMandatory);
    }

    setFilteredTemplates(filtered);
  };

  const handleCreate = () => {
    setSelectedTemplate(null);
    setIsEditorOpen(true);
  };

  const handleEdit = (templateId: string) => {
    const template = templates.find(t => t.templateId === templateId);
    setSelectedTemplate(template || null);
    setIsEditorOpen(true);
  };

  const handleView = (templateId: string) => {
    const template = templates.find(t => t.templateId === templateId);
    setSelectedTemplate(template || null);
    setIsViewerOpen(true);
  };

  const handleDelete = async (templateId: string) => {
    if (confirm('¿Está seguro de que desea archivar esta plantilla?')) {
      try {
        await templatesApi.eliminarPlantilla(templateId);
        loadData();
      } catch (error) {
        console.error('Error al archivar plantilla:', error);
      }
    }
  };

  const handlePublish = async (templateId: string) => {
    try {
      await templatesApi.publicarPlantilla(templateId, {
        version: templates.find(t => t.templateId === templateId)?.version || 1,
        targetSites: 'ALL',
        notifySites: true,
        replaceActive: true
      });
      loadData();
    } catch (error) {
      console.error('Error al publicar plantilla:', error);
    }
  };

  const handleSave = async (data: Partial<GlobalTemplate>) => {
    try {
      if (selectedTemplate) {
        await templatesApi.actualizarPlantilla(selectedTemplate.templateId, data);
      } else {
        await templatesApi.crearPlantilla({
          name: data.name!,
          type: data.type!,
          description: data.description,
          content: data.content!,
          isMandatory: data.isMandatory || false
        });
      }
      loadData();
    } catch (error) {
      console.error('Error al guardar plantilla:', error);
      throw error;
    }
  };

  const statusOptions: SelectOption[] = [
    { value: 'ALL', label: 'Todos los Estados' },
    { value: 'PUBLISHED', label: 'Publicado' },
    { value: 'DRAFT', label: 'Borrador' },
    { value: 'ARCHIVED', label: 'Archivado' }
  ];

  const typeOptions: SelectOption[] = [
    { value: 'ALL', label: 'Todos los Tipos' },
    { value: 'CONTRACT', label: 'Contrato' },
    { value: 'POLICY', label: 'Política' },
    { value: 'WORKOUT_PLAN', label: 'Plan de Entrenamiento' },
    { value: 'NUTRITION_GUIDE', label: 'Guía Nutricional' },
    { value: 'EMAIL', label: 'Email' },
    { value: 'PROTOCOL', label: 'Protocolo' },
    { value: 'REGULATION', label: 'Reglamento' }
  ];

  const metricsData = stats ? [
    {
      id: 'total',
      title: 'Total Plantillas',
      value: stats.totalTemplates.toString(),
      icon: <FileText size={20} />,
      color: 'info' as const
    },
    {
      id: 'published',
      title: 'Publicadas',
      value: stats.publishedTemplates.toString(),
      icon: <CheckCircle2 size={20} />,
      color: 'success' as const
    },
    {
      id: 'mandatory',
      title: 'Obligatorias',
      value: stats.mandatoryTemplates.toString(),
      icon: <Package size={20} />,
      color: 'warning' as const
    },
    {
      id: 'compliance',
      title: 'Cumplimiento',
      value: `${stats.complianceRate}%`,
      icon: <AlertTriangle size={20} />,
      color: 'info' as const
    }
  ] : [];

  const tabItems = [
    { id: 'all', label: 'Todas', icon: FileText },
    { id: 'mandatory', label: 'Obligatorias', icon: Package },
    { id: 'optional', label: 'Opcionales', icon: CheckCircle2 }
  ];

  const filtrosActivos = [selectedStatus !== 'ALL', selectedType !== 'ALL', searchTerm].filter(Boolean).length;

  // LightInput component según la guía
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

  return (
    <div className="space-y-6">
      {/* Sistema de Tabs */}
      <Card className="p-0 bg-white shadow-sm">
        <div className="px-4 py-3">
          <div
            role="tablist"
            aria-label="Secciones plantillas"
            className="flex items-center gap-2 rounded-2xl bg-slate-100 p-1"
          >
            {tabItems.map(({ id, label, icon: Icon }) => {
              const activo = activeTab === id;
              return (
                <button
                  key={id}
                  role="tab"
                  aria-selected={activo}
                  onClick={() => setActiveTab(id)}
                  className={[
                    'inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all',
                    activo
                      ? 'bg-white text-slate-900 shadow-sm ring-1 ring-slate-200'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/70'
                  ].join(' ')}
                >
                  <Icon
                    size={18}
                    className={activo ? 'opacity-100' : 'opacity-70'}
                  />
                  <span>{label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </Card>

      {/* Contenido de la pestaña activa */}
      <div className="space-y-6">
        {/* Toolbar superior */}
        <div className="flex items-center justify-end">
          <Button onClick={handleCreate}>
            <Plus size={20} className="mr-2" />
            Nueva Plantilla
          </Button>
        </div>

        {/* KPIs/Métricas */}
        {!isLoading && metricsData.length > 0 && (
          <MetricCards
            data={metricsData}
            columns={4}
          />
        )}

        {/* Filtros */}
        <Card className="mb-6 bg-white shadow-sm">
          <div className="space-y-4">
            {/* Barra de búsqueda */}
            <div className="rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-3">
              <div className="flex gap-4">
                <div className="flex-1">
                  <LightInput
                    placeholder="Buscar plantillas por nombre o descripción..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    leftIcon={<Search size={20} />}
                    rightIcon={
                      searchTerm ? (
                        <button
                          onClick={() => setSearchTerm('')}
                          className="text-slate-400 hover:text-slate-600"
                        >
                          <X size={16} />
                        </button>
                      ) : undefined
                    }
                  />
                </div>

                <Button
                  variant='secondary'
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
                  <Button
                    variant='ghost'
                    onClick={() => {
                      setSearchTerm('');
                      setSelectedStatus('ALL');
                      setSelectedType('ALL');
                    }}
                  >
                    <X size={16} className="mr-2" />
                    Limpiar
                  </Button>
                )}
              </div>
            </div>

            {/* Panel de filtros avanzados */}
            {mostrarFiltrosAvanzados && (
              <div className="rounded-2xl bg-white ring-1 ring-slate-200 p-4 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Tipo de Plantilla
                    </label>
                    <Select
                      value={selectedType}
                      onChange={(e) => setSelectedType(e.target.value)}
                      options={typeOptions}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Estado
                    </label>
                    <Select
                      value={selectedStatus}
                      onChange={(e) => setSelectedStatus(e.target.value)}
                      options={statusOptions}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Resumen de resultados */}
            <div className="flex justify-between items-center text-sm text-slate-600 border-t border-slate-200 pt-4">
              <span>{filteredTemplates.length} resultados encontrados</span>
              <span>{filtrosActivos} filtros aplicados</span>
            </div>
          </div>
        </Card>

        {/* Tabla */}
        <TemplateDataTable
          templates={filteredTemplates}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onView={handleView}
          onPublish={handlePublish}
          loading={isLoading}
        />
      </div>

      {/* Modals */}
      <TemplateEditorModal
        isOpen={isEditorOpen}
        onClose={() => setIsEditorOpen(false)}
        templateData={selectedTemplate || undefined}
        onSave={handleSave}
      />

      <TemplateViewerModal
        isOpen={isViewerOpen}
        onClose={() => setIsViewerOpen(false)}
        template={selectedTemplate}
      />
    </div>
  );
};

