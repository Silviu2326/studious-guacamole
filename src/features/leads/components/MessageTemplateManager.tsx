import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { Card, Button, Modal, Input, Select, Table, Tabs } from '../../../components/componentsreutilizables';
import { ds } from '../../adherencia/ui/ds';
import { MessageTemplate, InteractionChannel } from '../types';
import { TemplateService } from '../services/templateService';
import {
  Plus,
  Edit,
  Trash2,
  Mail,
  MessageSquare,
  Phone,
  BarChart3,
  Copy,
  Search
} from 'lucide-react';

interface MessageTemplateManagerProps {
  businessType: 'entrenador' | 'gimnasio';
}

export const MessageTemplateManager: React.FC<MessageTemplateManagerProps> = ({ businessType }) => {
  const { user } = useAuth();
  const [templates, setTemplates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<any | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [templateToDelete, setTemplateToDelete] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'list' | 'create' | 'edit'>('list');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterChannel, setFilterChannel] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadTemplates();
  }, [businessType]);

  const loadTemplates = async () => {
    setLoading(true);
    try {
      const data = await TemplateService.getTemplates(businessType);
      setTemplates(data);
    } catch (error) {
      console.error('Error cargando plantillas:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (templateData: any) => {
    try {
      if (editingTemplate) {
        await TemplateService.updateTemplate(editingTemplate.id, templateData);
      } else {
        await TemplateService.createTemplate({
          ...templateData,
          createdBy: user?.id || 'unknown'
        });
      }
      setShowModal(false);
      setEditingTemplate(null);
      setActiveTab('list');
      await loadTemplates();
    } catch (error) {
      console.error('Error guardando plantilla:', error);
      alert('Error al guardar la plantilla');
    }
  };

  const handleDelete = async () => {
    if (!templateToDelete) return;
    try {
      await TemplateService.deleteTemplate(templateToDelete);
      setShowDeleteModal(false);
      setTemplateToDelete(null);
      await loadTemplates();
    } catch (error) {
      console.error('Error eliminando plantilla:', error);
    }
  };

  const handleDuplicate = async (template: any) => {
    try {
      const duplicated = {
        ...template,
        name: `${template.name} (Copia)`,
        id: undefined,
        createdAt: undefined,
        updatedAt: undefined
      };
      await TemplateService.createTemplate(duplicated);
      await loadTemplates();
    } catch (error) {
      console.error('Error duplicando plantilla:', error);
    }
  };

  const channelLabels: Record<InteractionChannel, string> = {
    email: 'Email',
    whatsapp: 'WhatsApp',
    sms: 'SMS',
    call: 'Llamada',
    in_person: 'Presencial'
  };

  const categoryLabels: Record<string, string> = {
    bienvenida: 'Bienvenida',
    seguimiento: 'Seguimiento',
    cierre: 'Cierre',
    reactivacion: 'Reactivación',
    personalizada: 'Personalizada'
  };

  const filteredTemplates = templates.filter(t => {
    if (filterCategory !== 'all' && t.category !== filterCategory) return false;
    if (filterChannel !== 'all' && t.channel !== filterChannel) return false;
    if (searchTerm && !t.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !t.body.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    return true;
  });

  const columns = [
    {
      key: 'name' as keyof any,
      label: 'Nombre',
      render: (value: any, row: any) => (
        <div>
          <div className="font-semibold text-gray-900 dark:text-[#F1F5F9]">{row.name}</div>
          <div className="text-sm text-gray-600 dark:text-[#94A3B8]">{categoryLabels[row.category]}</div>
        </div>
      )
    },
    {
      key: 'channel' as keyof any,
      label: 'Canal',
      render: (value: any, row: any) => (
        <div className="flex items-center gap-2">
          {row.channel === 'email' && <Mail className="w-4 h-4 text-gray-600 dark:text-[#94A3B8]" />}
          {row.channel === 'whatsapp' && <MessageSquare className="w-4 h-4 text-gray-600 dark:text-[#94A3B8]" />}
          {row.channel === 'sms' && <Phone className="w-4 h-4 text-gray-600 dark:text-[#94A3B8]" />}
          <span>{channelLabels[row.channel]}</span>
        </div>
      )
    },
    {
      key: 'usageCount' as keyof any,
      label: 'Uso',
      render: (value: any, row: any) => (
        <div className="text-gray-900 dark:text-[#F1F5F9]">
          {row.usageCount || 0} veces
        </div>
      )
    },
    {
      key: 'effectiveness' as keyof any,
      label: 'Efectividad',
      render: (value: any, row: any) => {
        const eff = row.effectiveness;
        if (!eff || eff.sent === 0) return <span className="text-gray-500">-</span>;
        const replyRate = eff.replied ? ((eff.replied / eff.sent) * 100).toFixed(0) : '0';
        return (
          <div className="text-sm">
            <div className="text-gray-900 dark:text-[#F1F5F9]">{replyRate}% respuesta</div>
            {eff.converted && (
              <div className="text-xs text-green-600 dark:text-green-400">
                {eff.converted} conversiones
              </div>
            )}
          </div>
        );
      }
    },
    {
      key: 'actions' as keyof any,
      label: 'Acciones',
      render: (value: any, row: any) => (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleDuplicate(row)}
            title="Duplicar"
          >
            <Copy className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setEditingTemplate(row);
              setActiveTab('edit');
              setShowModal(true);
            }}
          >
            <Edit className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setTemplateToDelete(row.id);
              setShowDeleteModal(true);
            }}
          >
            <Trash2 className="w-4 h-4 text-red-600 dark:text-red-400" />
          </Button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-[#F1F5F9]">
            Plantillas de Mensajes
          </h2>
          <p className="text-gray-600 dark:text-[#94A3B8] mt-1">
            Crea y gestiona plantillas reutilizables para comunicación rápida
          </p>
        </div>
        <Button
          variant="primary"
          onClick={() => {
            setEditingTemplate(null);
            setActiveTab('create');
            setShowModal(true);
          }}
        >
          <Plus className="w-4 h-4 mr-2" />
          Nueva Plantilla
        </Button>
      </div>

      {/* Filtros */}
      <Card>
        <div className={ds.spacing.md}>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <Input
                placeholder="Buscar plantillas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                leftIcon={<Search className="w-4 h-4" />}
              />
            </div>
            <Select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              options={[
                { value: 'all', label: 'Todas las categorías' },
                { value: 'bienvenida', label: 'Bienvenida' },
                { value: 'seguimiento', label: 'Seguimiento' },
                { value: 'cierre', label: 'Cierre' },
                { value: 'reactivacion', label: 'Reactivación' },
                { value: 'personalizada', label: 'Personalizada' }
              ]}
            />
            <Select
              value={filterChannel}
              onChange={(e) => setFilterChannel(e.target.value)}
              options={[
                { value: 'all', label: 'Todos los canales' },
                { value: 'whatsapp', label: 'WhatsApp' },
                { value: 'email', label: 'Email' },
                { value: 'sms', label: 'SMS' }
              ]}
            />
          </div>
        </div>
      </Card>

      {/* Tabla de plantillas */}
      <Card>
        <Table
          data={filteredTemplates}
          columns={columns}
          loading={loading}
          emptyMessage="No hay plantillas creadas"
        />
      </Card>

      {/* Modal de crear/editar */}
      <TemplateFormModal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setEditingTemplate(null);
          setActiveTab('list');
        }}
        onSave={handleSave}
        template={editingTemplate}
        businessType={businessType}
        activeTab={activeTab}
      />

      {/* Modal de eliminar */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setTemplateToDelete(null);
        }}
        title="Eliminar Plantilla"
        size="md"
        footer={
          <div className="flex items-center justify-end gap-3">
            <Button
              variant="secondary"
              onClick={() => {
                setShowDeleteModal(false);
                setTemplateToDelete(null);
              }}
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
            >
              Eliminar
            </Button>
          </div>
        }
      >
        <p className="text-gray-600 dark:text-[#94A3B8]">
          ¿Estás seguro de que quieres eliminar esta plantilla? Esta acción no se puede deshacer.
        </p>
      </Modal>
    </div>
  );
};

// Modal de formulario
interface TemplateFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (template: any) => void;
  template?: any | null;
  businessType: 'entrenador' | 'gimnasio';
  activeTab: 'list' | 'create' | 'edit';
}

const TemplateFormModal: React.FC<TemplateFormModalProps> = ({
  isOpen,
  onClose,
  onSave,
  template,
  businessType,
  activeTab
}) => {
  const [formData, setFormData] = useState({
    name: template?.name || '',
    category: template?.category || 'bienvenida',
    channel: template?.channel || 'whatsapp',
    subject: template?.subject || '',
    body: template?.body || '',
    variables: template?.variables || []
  });

  useEffect(() => {
    if (template) {
      setFormData({
        name: template.name || '',
        category: template.category || 'bienvenida',
        channel: template.channel || 'whatsapp',
        subject: template.subject || '',
        body: template.body || '',
        variables: template.variables || []
      });
    } else {
      setFormData({
        name: '',
        category: 'bienvenida',
        channel: 'whatsapp',
        subject: '',
        body: '',
        variables: []
      });
    }
  }, [template, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.body) {
      alert('Por favor completa todos los campos requeridos');
      return;
    }

    // Extraer variables del cuerpo del mensaje
    const variableRegex = /\{\{(\w+)\}\}/g;
    const matches = formData.body.matchAll(variableRegex);
    const extractedVariables = Array.from(new Set(Array.from(matches).map(m => m[1])));

    onSave({
      ...formData,
      variables: extractedVariables,
      businessType
    });
  };

  const availableVariables = [
    { key: 'name', label: 'Nombre del lead', example: '{{name}}' },
    { key: 'service', label: 'Servicio', example: '{{service}}' },
    { key: 'price', label: 'Precio', example: '{{price}}' },
    { key: 'date', label: 'Fecha', example: '{{date}}' },
    { key: 'time', label: 'Hora', example: '{{time}}' }
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={template ? 'Editar Plantilla' : 'Nueva Plantilla'}
      size="lg"
      footer={
        <div className="flex items-center justify-end gap-3">
          <Button variant="secondary" onClick={onClose}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            Guardar
          </Button>
        </div>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Nombre de la Plantilla *"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="Ej: Bienvenida Instagram"
          required
        />

        <div className="grid grid-cols-2 gap-4">
          <Select
            label="Categoría *"
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            options={[
              { value: 'bienvenida', label: 'Bienvenida' },
              { value: 'seguimiento', label: 'Seguimiento' },
              { value: 'cierre', label: 'Cierre' },
              { value: 'reactivacion', label: 'Reactivación' },
              { value: 'personalizada', label: 'Personalizada' }
            ]}
            required
          />

          <Select
            label="Canal *"
            value={formData.channel}
            onChange={(e) => setFormData({ ...formData, channel: e.target.value })}
            options={[
              { value: 'whatsapp', label: 'WhatsApp' },
              { value: 'email', label: 'Email' },
              { value: 'sms', label: 'SMS' }
            ]}
            required
          />
        </div>

        {formData.channel === 'email' && (
          <Input
            label="Asunto *"
            value={formData.subject}
            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
            placeholder="Asunto del email"
            required={formData.channel === 'email'}
          />
        )}

        <div>
          <label className="block text-sm font-medium text-gray-900 dark:text-[#F1F5F9] mb-2">
            Mensaje * <span className="text-xs text-gray-500">(Usa {'{{variable}}'} para personalizar)</span>
          </label>
          <textarea
            value={formData.body}
            onChange={(e) => setFormData({ ...formData, body: e.target.value })}
            placeholder="Ej: ¡Hola {{name}}! 👋 Vi que te interesó nuestro contenido..."
            className="w-full px-3 py-2 border border-gray-300 dark:border-[#334155] rounded-lg bg-white dark:bg-[#1E1E2E] text-gray-900 dark:text-[#F1F5F9] min-h-[150px]"
            required
          />
          <div className="mt-2 text-xs text-gray-600 dark:text-[#94A3B8]">
            Variables disponibles:
            {availableVariables.map(v => (
              <span key={v.key} className="ml-2 px-2 py-1 bg-gray-100 dark:bg-[#334155] rounded">
                {v.example}
              </span>
            ))}
          </div>
        </div>
      </form>
    </Modal>
  );
};

