import React, { useState, useMemo } from 'react';
import { Badge, Button, Card, Modal, Input, Select, Checkbox } from '../../../components/componentsreutilizables';
import {
  Download,
  FileText,
  FileJson,
  FileCode,
  FileSpreadsheet,
  Share2,
  CheckCircle2,
  XCircle,
  Loader2,
  Settings,
  Calendar,
  Users,
  Zap,
  Target,
  MessageSquare,
  Filter,
  Search,
  Eye,
  Copy,
  ExternalLink,
} from 'lucide-react';
import { ds } from '../../adherencia/ui/ds';
import {
  AIPlaybook,
  PlaybookFormat,
  PlaybookExport,
  PlaybookExportConfig,
  MultiChannelCampaign,
  Campaign360Review,
  SpecializedTemplate,
  PostLeadMagnetSequence,
  LifecycleSequence,
  MessagingChannel,
} from '../types';

const formatLabel: Record<PlaybookFormat, { label: string; icon: React.ReactNode; color: string }> = {
  json: { label: 'JSON', icon: <FileJson className="w-4 h-4" />, color: 'text-yellow-600' },
  pdf: { label: 'PDF', icon: <FileText className="w-4 h-4" />, color: 'text-red-600' },
  markdown: { label: 'Markdown', icon: <FileCode className="w-4 h-4" />, color: 'text-blue-600' },
  html: { label: 'HTML', icon: <FileSpreadsheet className="w-4 h-4" />, color: 'text-green-600' },
};

const channelLabel: Record<MessagingChannel, string> = {
  email: 'Email',
  whatsapp: 'WhatsApp',
  sms: 'SMS',
  push: 'Push',
  'in-app': 'In-App',
};

interface AIPlaybookExporterProps {
  playbooks?: AIPlaybook[];
  campaigns?: MultiChannelCampaign[];
  campaign360s?: Campaign360Review[];
  templates?: SpecializedTemplate[];
  sequences?: (LifecycleSequence | PostLeadMagnetSequence)[];
  loading?: boolean;
  className?: string;
  onPlaybookCreate?: (playbook: Omit<AIPlaybook, 'id' | 'metadata'>) => void;
  onPlaybookExport?: (playbookId: string, config: PlaybookExportConfig) => void;
  onPlaybookDownload?: (exportId: string) => void;
  onPlaybookShare?: (playbookId: string, partnerId: string, accessLevel: 'view' | 'edit' | 'copy') => void;
}

export const AIPlaybookExporter: React.FC<AIPlaybookExporterProps> = ({
  playbooks = [],
  campaigns = [],
  campaign360s = [],
  templates = [],
  sequences = [],
  loading = false,
  className = '',
  onPlaybookCreate,
  onPlaybookExport,
  onPlaybookDownload,
  onPlaybookShare,
}) => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [selectedPlaybook, setSelectedPlaybook] = useState<AIPlaybook | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const [exportConfig, setExportConfig] = useState<PlaybookExportConfig>({
    format: 'pdf',
    includeContent: true,
    includeScheduling: true,
    includeAutomationRules: true,
    includeSegmentation: true,
    includeMetrics: true,
    includeBrandGuidelines: true,
    includeInstructions: true,
    compress: false,
  });

  const initialFormState = useMemo(
    () => ({
      name: '',
      description: '',
      sourceType: 'campaign' as 'campaign' | 'template' | 'sequence' | 'manual',
      sourceId: '',
      version: '1.0.0',
      category: '',
      tags: [] as string[],
      isTemplate: false,
    }),
    []
  );

  const [formData, setFormData] = useState(initialFormState);

  const filteredPlaybooks = useMemo(() => {
    return playbooks.filter((playbook) => {
      const matchesCategory = filterCategory === 'all' || playbook.metadata.category === filterCategory;
      const matchesSearch =
        searchTerm === '' ||
        playbook.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        playbook.description.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [playbooks, filterCategory, searchTerm]);

  const categories = useMemo(() => {
    const cats = new Set<string>();
    playbooks.forEach((playbook) => {
      if (playbook.metadata.category) {
        cats.add(playbook.metadata.category);
      }
    });
    return Array.from(cats);
  }, [playbooks]);

  const handleInputChange = (field: keyof typeof formData) => (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const value = event.target.type === 'checkbox' ? (event.target as HTMLInputElement).checked : event.target.value;
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleExportConfigChange = (field: keyof PlaybookExportConfig) => (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const value =
      event.target.type === 'checkbox' ? (event.target as HTMLInputElement).checked : event.target.value;
    setExportConfig((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleCloseCreateModal = () => {
    setIsCreateModalOpen(false);
    setFormData(initialFormState);
  };

  const handleCreatePlaybook = () => {
    // Aquí se crearía el playbook desde la fuente seleccionada
    // Por ahora, solo mostramos el modal
    if (onPlaybookCreate) {
      // Esta función se implementaría con la lógica real
      console.log('Crear playbook desde:', formData);
    }
    handleCloseCreateModal();
  };

  const handleExportPlaybook = (playbook: AIPlaybook) => {
    setSelectedPlaybook(playbook);
    setIsExportModalOpen(true);
  };

  const handleCloseExportModal = () => {
    setIsExportModalOpen(false);
    setSelectedPlaybook(null);
  };

  const handleSubmitExport = () => {
    if (selectedPlaybook && onPlaybookExport) {
      onPlaybookExport(selectedPlaybook.id, exportConfig);
    }
    handleCloseExportModal();
  };

  const handleSharePlaybook = (playbook: AIPlaybook) => {
    setSelectedPlaybook(playbook);
    setIsShareModalOpen(true);
  };

  const handleCloseShareModal = () => {
    setIsShareModalOpen(false);
    setSelectedPlaybook(null);
  };

  const handleSubmitShare = (partnerId: string, accessLevel: 'view' | 'edit' | 'copy') => {
    if (selectedPlaybook && onPlaybookShare) {
      onPlaybookShare(selectedPlaybook.id, partnerId, accessLevel);
    }
    handleCloseShareModal();
  };

  const formatFileSize = (bytes?: number): string => {
    if (!bytes) return 'N/A';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  if (loading && playbooks.length === 0) {
    return (
      <Card className={className}>
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className={`${ds.shimmer} h-32`} />
          ))}
        </div>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Playbooks IA</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Exporta playbooks IA con todo el contenido y programación para compartir con socios o franquicias
            </p>
          </div>
          <Button
            size="sm"
            leftIcon={<Download size={16} />}
            onClick={() => setIsCreateModalOpen(true)}
          >
            Crear Playbook
          </Button>
        </div>

        {/* Filtros */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex-1 min-w-[200px]">
            <Input
              placeholder="Buscar playbooks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              leftIcon={<Search size={16} />}
            />
          </div>
          <Select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            leftIcon={<Filter size={16} />}
          >
            <option value="all">Todas las categorías</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </Select>
        </div>

        {/* Lista de playbooks */}
        <div className="space-y-3">
          {filteredPlaybooks.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="w-12 h-12 text-slate-400 mx-auto mb-4" />
              <p className="text-slate-600 dark:text-slate-400">No hay playbooks disponibles</p>
              <Button
                size="sm"
                variant="secondary"
                className="mt-4"
                onClick={() => setIsCreateModalOpen(true)}
              >
                Crear primer playbook
              </Button>
            </div>
          ) : (
            filteredPlaybooks.map((playbook) => (
              <div
                key={playbook.id}
                className="p-4 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-semibold text-slate-900 dark:text-slate-100">{playbook.name}</h4>
                      <Badge variant="purple" size="sm">
                        v{playbook.version}
                      </Badge>
                      {playbook.metadata.isTemplate && (
                        <Badge variant="blue" size="sm">
                          Plantilla
                        </Badge>
                      )}
                      {playbook.content.aiGenerated && (
                        <Badge variant="green" size="sm">
                          IA
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">{playbook.description}</p>
                    <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-500">
                      <span className="flex items-center gap-1">
                        <Target size={14} />
                        {playbook.content.objective}
                      </span>
                      <span className="flex items-center gap-1">
                        <MessageSquare size={14} />
                        {playbook.content.channels.map((c) => channelLabel[c]).join(', ')}
                      </span>
                      {playbook.metadata.usageCount !== undefined && (
                        <span className="flex items-center gap-1">
                          <Users size={14} />
                          {playbook.metadata.usageCount} usos
                        </span>
                      )}
                      {playbook.metadata.successRate !== undefined && (
                        <span className="flex items-center gap-1">
                          <Zap size={14} />
                          {playbook.metadata.successRate}% éxito
                        </span>
                      )}
                    </div>
                    {playbook.metadata.tags && playbook.metadata.tags.length > 0 && (
                      <div className="flex items-center gap-2 mt-2">
                        {playbook.metadata.tags.map((tag) => (
                          <Badge key={tag} variant="gray" size="sm">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleExportPlaybook(playbook)}
                      leftIcon={<Download size={16} />}
                    >
                      Exportar
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleSharePlaybook(playbook)}
                      leftIcon={<Share2 size={16} />}
                    >
                      Compartir
                    </Button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Modal para crear playbook */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={handleCloseCreateModal}
        title="Crear Playbook IA"
        size="lg"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Nombre del playbook
            </label>
            <Input
              value={formData.name}
              onChange={handleInputChange('name')}
              placeholder="Ej: Playbook de Retención Q1 2024"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Descripción
            </label>
            <Input
              value={formData.description}
              onChange={handleInputChange('description')}
              placeholder="Describe el playbook..."
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Fuente
              </label>
              <Select
                value={formData.sourceType}
                onChange={handleInputChange('sourceType')}
                required
              >
                <option value="campaign">Campaña</option>
                <option value="template">Plantilla</option>
                <option value="sequence">Secuencia</option>
                <option value="manual">Manual</option>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Versión
              </label>
              <Input
                value={formData.version}
                onChange={handleInputChange('version')}
                placeholder="1.0.0"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Categoría
            </label>
            <Input
              value={formData.category}
              onChange={handleInputChange('category')}
              placeholder="Ej: Retención, Captación, Fidelización"
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isTemplate"
              checked={formData.isTemplate}
              onChange={(e) => setFormData((prev) => ({ ...prev, isTemplate: e.target.checked }))}
              className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
            />
            <label htmlFor="isTemplate" className="text-sm text-slate-700 dark:text-slate-300">
              Marcar como plantilla reutilizable
            </label>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-700">
            <Button type="button" variant="secondary" onClick={handleCloseCreateModal}>
              Cancelar
            </Button>
            <Button type="button" onClick={handleCreatePlaybook} leftIcon={<Download size={16} />}>
              Crear Playbook
            </Button>
          </div>
        </div>
      </Modal>

      {/* Modal para exportar playbook */}
      <Modal
        isOpen={isExportModalOpen}
        onClose={handleCloseExportModal}
        title={`Exportar Playbook: ${selectedPlaybook?.name || ''}`}
        size="lg"
      >
        {selectedPlaybook && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Formato de exportación
              </label>
              <Select
                value={exportConfig.format}
                onChange={handleExportConfigChange('format')}
                required
              >
                {Object.entries(formatLabel).map(([value, { label }]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </Select>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Opciones de exportación
              </label>
              <div className="space-y-2">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={exportConfig.includeContent}
                    onChange={handleExportConfigChange('includeContent')}
                    className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="text-sm text-slate-700 dark:text-slate-300">Incluir contenido completo</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={exportConfig.includeScheduling}
                    onChange={handleExportConfigChange('includeScheduling')}
                    className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="text-sm text-slate-700 dark:text-slate-300">Incluir programación</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={exportConfig.includeAutomationRules}
                    onChange={handleExportConfigChange('includeAutomationRules')}
                    className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="text-sm text-slate-700 dark:text-slate-300">Incluir reglas de automatización</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={exportConfig.includeSegmentation}
                    onChange={handleExportConfigChange('includeSegmentation')}
                    className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="text-sm text-slate-700 dark:text-slate-300">Incluir segmentación</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={exportConfig.includeMetrics}
                    onChange={handleExportConfigChange('includeMetrics')}
                    className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="text-sm text-slate-700 dark:text-slate-300">Incluir métricas</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={exportConfig.includeBrandGuidelines}
                    onChange={handleExportConfigChange('includeBrandGuidelines')}
                    className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="text-sm text-slate-700 dark:text-slate-300">Incluir guías de marca</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={exportConfig.includeInstructions}
                    onChange={handleExportConfigChange('includeInstructions')}
                    className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="text-sm text-slate-700 dark:text-slate-300">Incluir instrucciones de uso</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={exportConfig.compress}
                    onChange={handleExportConfigChange('compress')}
                    className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="text-sm text-slate-700 dark:text-slate-300">Comprimir archivo</span>
                </label>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-700">
              <Button type="button" variant="secondary" onClick={handleCloseExportModal}>
                Cancelar
              </Button>
              <Button type="button" onClick={handleSubmitExport} leftIcon={<Download size={16} />}>
                Exportar Playbook
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Modal para compartir playbook */}
      <Modal
        isOpen={isShareModalOpen}
        onClose={handleCloseShareModal}
        title={`Compartir Playbook: ${selectedPlaybook?.name || ''}`}
        size="md"
      >
        {selectedPlaybook && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Socio o Franquicia
              </label>
              <Input
                placeholder="ID del socio o franquicia"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Nivel de acceso
              </label>
              <Select required>
                <option value="view">Solo visualización</option>
                <option value="edit">Editar</option>
                <option value="copy">Copiar</option>
              </Select>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-700">
              <Button type="button" variant="secondary" onClick={handleCloseShareModal}>
                Cancelar
              </Button>
              <Button
                type="button"
                onClick={() => handleSubmitShare('partner-id', 'view')}
                leftIcon={<Share2 size={16} />}
              >
                Compartir
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </Card>
  );
};

