import React, { useState, useEffect } from 'react';
import { Card, MetricCards, Select } from '../../../components/componentsreutilizables';
import { useTemplateAPI } from '../api/useTemplateAPI';
import TemplateList from './TemplateList';
import TemplateEditor from './TemplateEditor';
import { Template, CreateTemplateRequest, UpdateTemplateRequest } from '../types';
import { Plus, Search, Mail, FileText as FileTextIcon, Check } from 'lucide-react';
import { Button, ConfirmModal } from '../../../components/componentsreutilizables';

const TemplateManagerContainer: React.FC = () => {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [templateToDelete, setTemplateToDelete] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('');

  const { 
    getTemplates, 
    createTemplate, 
    updateTemplate, 
    deleteTemplate, 
    duplicateTemplate, 
    loading 
  } = useTemplateAPI();

  useEffect(() => {
    loadTemplates();
  }, [filterType]);

  const loadTemplates = async () => {
    try {
      const response = await getTemplates({ type: filterType || undefined });
      setTemplates(response?.data || []);
    } catch (error) {
      console.error('Error al cargar plantillas:', error);
      setTemplates([]);
    }
  };

  const handleCreate = () => {
    setSelectedTemplate(null);
    setIsEditorOpen(true);
  };

  const handleEdit = async (templateId: string) => {
    try {
      const template = templates.find(t => t.id === templateId);
      if (template) {
        setSelectedTemplate(template);
        setIsEditorOpen(true);
      }
    } catch (error) {
      console.error('Error al cargar plantilla:', error);
    }
  };

  const handleSave = async (data: CreateTemplateRequest | UpdateTemplateRequest) => {
    try {
      if (selectedTemplate) {
        await updateTemplate(selectedTemplate.id, data as UpdateTemplateRequest);
      } else {
        await createTemplate(data as CreateTemplateRequest);
      }
      await loadTemplates();
    } catch (error) {
      console.error('Error al guardar plantilla:', error);
      throw error;
    }
  };

  const handleDelete = (templateId: string) => {
    setTemplateToDelete(templateId);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!templateToDelete) return;
    
    try {
      await deleteTemplate(templateToDelete);
      await loadTemplates();
      setDeleteModalOpen(false);
      setTemplateToDelete(null);
    } catch (error) {
      console.error('Error al eliminar plantilla:', error);
    }
  };

  const handleDuplicate = async (templateId: string) => {
    try {
      await duplicateTemplate(templateId);
      await loadTemplates();
    } catch (error) {
      console.error('Error al duplicar plantilla:', error);
    }
  };

  const handlePreview = (templateId: string) => {
    const template = templates.find(t => t.id === templateId);
    if (template) {
      alert(`Vista previa de: ${template.name}\n\nContenido:\n${template.bodyHtml.substring(0, 200)}...`);
    }
  };

  const filteredTemplates = (templates || []).filter(template => {
    const matchesSearch = searchQuery === '' || 
      template.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const typeFilterOptions = [
    { value: '', label: 'Todos los tipos' },
    { value: 'EMAIL', label: 'Email' },
    { value: 'SMS', label: 'SMS' },
    { value: 'CONTRACT', label: 'Contrato' },
  ];

  return (
    <div className="space-y-6">
      {/* Toolbar superior */}
      <div className="flex items-center justify-end">
        <Button onClick={handleCreate} leftIcon={<Plus size={20} className="mr-2" />}>
          Nueva Plantilla
        </Button>
      </div>

      {/* Métricas */}
      <MetricCards
        data={[
          {
            id: 'total',
            title: 'Total Plantillas',
            value: templates.length,
            color: 'info',
            icon: <FileTextIcon />,
          },
          {
            id: 'activas',
            title: 'Activas',
            value: templates.filter(t => t.isActive).length,
            color: 'success',
            icon: <Check />,
          },
          {
            id: 'emails',
            title: 'Emails',
            value: templates.filter(t => t.type === 'EMAIL').length,
            color: 'info',
            icon: <Mail />,
          },
          {
            id: 'contratos',
            title: 'Contratos',
            value: templates.filter(t => t.type === 'CONTRACT').length,
            color: 'warning',
            icon: <FileTextIcon />,
          },
        ]}
        columns={4}
      />

      {/* Sistema de filtros */}
      <Card className="mb-6 bg-white shadow-sm">
        <div className="space-y-4">
          {/* Barra de búsqueda */}
          <div className="rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-3">
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 pl-10 pr-3 py-2.5"
                  placeholder="Buscar plantillas..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                options={typeFilterOptions}
                fullWidth={false}
                className="w-48"
              />
            </div>
          </div>
          {/* Resumen de resultados */}
          <div className="flex justify-between items-center text-sm text-slate-600 border-t border-slate-200 pt-4">
            <span>{filteredTemplates.length} resultados encontrados</span>
            <span>{filterType ? '1 filtro aplicado' : '0 filtros aplicados'}</span>
          </div>
        </div>
      </Card>

      {/* Lista de plantillas */}
      <TemplateList
        templates={filteredTemplates}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onDuplicate={handleDuplicate}
        onPreview={handlePreview}
      />

      {/* Editor Modal */}
      <TemplateEditor
        isOpen={isEditorOpen}
        onClose={() => {
          setIsEditorOpen(false);
          setSelectedTemplate(null);
        }}
        onSave={handleSave}
        initialData={selectedTemplate}
      />

      {/* Confirmación de eliminación */}
      <ConfirmModal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setTemplateToDelete(null);
        }}
        onConfirm={confirmDelete}
        title="Eliminar Plantilla"
        message="¿Estás seguro de que deseas eliminar esta plantilla? Esta acción no se puede deshacer."
        confirmText="Eliminar"
        cancelText="Cancelar"
        variant="destructive"
      />
    </div>
  );
};

export default TemplateManagerContainer;

