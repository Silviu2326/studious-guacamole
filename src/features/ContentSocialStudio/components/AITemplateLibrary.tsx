import { useState, useEffect, useMemo } from 'react';
import {
  BookOpen,
  Lightbulb,
  ShoppingCart,
  Filter,
  Sparkles,
  TrendingUp,
  Calendar,
  Loader2,
  CheckCircle2,
  X,
} from 'lucide-react';
import {
  Badge,
  Button,
  Card,
  Input,
  Modal,
  Select,
  Tabs,
  Textarea,
  Tooltip,
} from '../../../components/componentsreutilizables';
import type {
  AITemplate,
  AITemplatePurpose,
  AITemplateFormat,
  AITemplateBalance,
  SocialPlatform,
} from '../types';
import {
  getAITemplates,
  getAITemplatesByPurpose,
  getAITemplatesByFormat,
  getAITemplateBalance,
  useAITemplate,
  updateAITemplateUsage,
} from '../api/aiTemplates';

interface AITemplateLibraryProps {
  loading?: boolean;
}

const purposeConfig: Record<AITemplatePurpose, { label: string; icon: typeof BookOpen; color: string }> = {
  educar: {
    label: 'Educar',
    icon: BookOpen,
    color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
  },
  inspirar: {
    label: 'Inspirar',
    icon: Lightbulb,
    color: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300',
  },
  vender: {
    label: 'Vender',
    icon: ShoppingCart,
    color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
  },
};

const formatLabels: Record<AITemplateFormat, string> = {
  post: 'Post',
  reel: 'Reel',
  carousel: 'Carrusel',
  story: 'Story',
  video: 'Video',
  email: 'Email',
};

export function AITemplateLibrary({ loading: externalLoading }: AITemplateLibraryProps) {
  const [templates, setTemplates] = useState<AITemplate[]>([]);
  const [balance, setBalance] = useState<AITemplateBalance | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedPurpose, setSelectedPurpose] = useState<AITemplatePurpose | 'all'>('all');
  const [selectedFormat, setSelectedFormat] = useState<AITemplateFormat | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState<AITemplate | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [templateVariables, setTemplateVariables] = useState<Record<string, string>>({});
  const [selectedPlatform, setSelectedPlatform] = useState<SocialPlatform | ''>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<{ content: string; hashtags: string[] } | null>(null);
  const [activeTab, setActiveTab] = useState<'library' | 'balance'>('library');

  useEffect(() => {
    loadTemplates();
    loadBalance();
  }, []);

  const loadTemplates = async () => {
    setLoading(true);
    try {
      const data = await getAITemplates();
      setTemplates(data);
    } catch (error) {
      console.error('Error loading templates', error);
    } finally {
      setLoading(false);
    }
  };

  const loadBalance = async () => {
    try {
      const data = await getAITemplateBalance();
      setBalance(data);
    } catch (error) {
      console.error('Error loading balance', error);
    }
  };

  const filteredTemplates = useMemo(() => {
    let filtered = templates;

    if (selectedPurpose !== 'all') {
      filtered = filtered.filter((t) => t.purpose === selectedPurpose);
    }

    if (selectedFormat !== 'all') {
      filtered = filtered.filter((t) => t.format === selectedFormat);
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (t) =>
          t.name.toLowerCase().includes(query) ||
          t.description.toLowerCase().includes(query) ||
          t.category.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [templates, selectedPurpose, selectedFormat, searchQuery]);

  const handleOpenTemplate = (template: AITemplate) => {
    setSelectedTemplate(template);
    setTemplateVariables({});
    setGeneratedContent(null);
    setSelectedPlatform(template.platforms[0] || '');
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedTemplate(null);
    setTemplateVariables({});
    setGeneratedContent(null);
    setIsGenerating(false);
  };

  const handleVariableChange = (key: string, value: string) => {
    setTemplateVariables((prev) => ({ ...prev, [key]: value }));
  };

  const handleGenerateContent = async () => {
    if (!selectedTemplate || !selectedPlatform) return;

    // Validate required variables
    const requiredVars = selectedTemplate.variables.filter((v) => v.required);
    const missingVars = requiredVars.filter((v) => !templateVariables[v.key]?.trim());

    if (missingVars.length > 0) {
      alert(`Por favor completa los siguientes campos requeridos: ${missingVars.map((v) => v.label).join(', ')}`);
      return;
    }

    setIsGenerating(true);
    try {
      const result = await useAITemplate(selectedTemplate.id, templateVariables, selectedPlatform);
      setGeneratedContent(result);

      // Update usage
      await updateAITemplateUsage(
        selectedTemplate.id,
        selectedTemplate.purpose,
        selectedTemplate.format,
        selectedPlatform
      );

      // Reload balance
      await loadBalance();
    } catch (error) {
      console.error('Error generating content', error);
      alert('Error al generar el contenido. Por favor intenta nuevamente.');
    } finally {
      setIsGenerating(false);
    }
  };

  const purposeOptions = [
    { value: 'all', label: 'Todos los propósitos' },
    { value: 'educar', label: 'Educar' },
    { value: 'inspirar', label: 'Inspirar' },
    { value: 'vender', label: 'Vender' },
  ];

  const formatOptions = [
    { value: 'all', label: 'Todos los formatos' },
    ...Object.entries(formatLabels).map(([value, label]) => ({ value, label })),
  ];

  const platformOptions = selectedTemplate
    ? selectedTemplate.platforms.map((p) => ({ value: p, label: p.charAt(0).toUpperCase() + p.slice(1) }))
    : [];

  if (externalLoading || loading) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-center py-16">
          <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
        </div>
      </Card>
    );
  }

  return (
    <>
      <Card className="p-0 shadow-sm border border-slate-100">
        <div className="px-6 py-5 border-b border-slate-100">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-xl font-semibold text-slate-900 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-violet-500" />
                Plantillas IA
              </h2>
              <p className="text-sm text-slate-500">
                Plantillas para educar, inspirar y vender. Mezcla formatos equilibradamente.
              </p>
            </div>
            <Tabs
              items={[
                { id: 'library', label: 'Biblioteca' },
                { id: 'balance', label: 'Balance' },
              ]}
              activeTab={activeTab}
              onTabChange={(tab) => setActiveTab(tab as 'library' | 'balance')}
              variant="pills"
              size="sm"
            />
          </div>
        </div>

        <div className="p-6 space-y-6">
          {activeTab === 'library' ? (
            <>
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="flex flex-1 gap-3">
                  <Input
                    placeholder="Buscar plantillas..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="max-w-xs"
                  />
                  <Select
                    value={selectedPurpose}
                    onChange={(e) => setSelectedPurpose(e.target.value as AITemplatePurpose | 'all')}
                    options={purposeOptions}
                    className="w-48"
                  />
                  <Select
                    value={selectedFormat}
                    onChange={(e) => setSelectedFormat(e.target.value as AITemplateFormat | 'all')}
                    options={formatOptions}
                    className="w-48"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredTemplates.map((template) => {
                  const purposeStyle = purposeConfig[template.purpose];
                  const PurposeIcon = purposeStyle.icon;

                  return (
                    <div
                      key={template.id}
                      className="rounded-xl border border-slate-200 p-4 hover:shadow-md transition-shadow cursor-pointer"
                      onClick={() => handleOpenTemplate(template)}
                    >
                      <div className="flex items-start justify-between gap-2 mb-3">
                        <div className="flex items-center gap-2">
                          <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${purposeStyle.color}`}>
                            <PurposeIcon className="w-3 h-3 mr-1" />
                            {purposeStyle.label}
                          </span>
                          <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700">
                            {formatLabels[template.format]}
                          </span>
                        </div>
                        {template.usageCount && template.usageCount > 0 ? (
                          <Tooltip content={`Usado ${template.usageCount} veces`}>
                            <span className="text-xs text-slate-500">{template.usageCount}</span>
                          </Tooltip>
                        ) : null}
                      </div>
                      <h3 className="text-sm font-semibold text-slate-900 mb-2">{template.name}</h3>
                      <p className="text-xs text-slate-500 mb-3">{template.description}</p>
                      <div className="flex flex-wrap gap-1">
                        {template.platforms.slice(0, 3).map((platform) => (
                          <span
                            key={platform}
                            className="inline-flex items-center rounded-full bg-indigo-50 px-2 py-0.5 text-[10px] font-semibold text-indigo-600"
                          >
                            {platform}
                          </span>
                        ))}
                        {template.platforms.length > 3 ? (
                          <span className="text-[10px] text-slate-500">+{template.platforms.length - 3}</span>
                        ) : null}
                      </div>
                    </div>
                  );
                })}
              </div>

              {filteredTemplates.length === 0 ? (
                <div className="text-center py-12 text-slate-500">
                  <p>No se encontraron plantillas que coincidan con los filtros seleccionados.</p>
                </div>
              ) : null}
            </>
          ) : (
            <div className="space-y-6">
              {balance ? (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="rounded-xl border border-blue-200 bg-blue-50 p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <BookOpen className="w-5 h-5 text-blue-600" />
                        <h3 className="text-sm font-semibold text-blue-900">Educar</h3>
                      </div>
                      <p className="text-2xl font-bold text-blue-900">{balance.educar}</p>
                      <p className="text-xs text-blue-700">
                        {balance.total > 0 ? `${Math.round((balance.educar / balance.total) * 100)}% del total` : '0%'}
                      </p>
                    </div>
                    <div className="rounded-xl border border-yellow-200 bg-yellow-50 p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Lightbulb className="w-5 h-5 text-yellow-600" />
                        <h3 className="text-sm font-semibold text-yellow-900">Inspirar</h3>
                      </div>
                      <p className="text-2xl font-bold text-yellow-900">{balance.inspirar}</p>
                      <p className="text-xs text-yellow-700">
                        {balance.total > 0 ? `${Math.round((balance.inspirar / balance.total) * 100)}% del total` : '0%'}
                      </p>
                    </div>
                    <div className="rounded-xl border border-green-200 bg-green-50 p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <ShoppingCart className="w-5 h-5 text-green-600" />
                        <h3 className="text-sm font-semibold text-green-900">Vender</h3>
                      </div>
                      <p className="text-2xl font-bold text-green-900">{balance.vender}</p>
                      <p className="text-xs text-green-700">
                        {balance.total > 0 ? `${Math.round((balance.vender / balance.total) * 100)}% del total` : '0%'}
                      </p>
                    </div>
                  </div>
                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-semibold text-slate-900">Total de usos</h3>
                        <p className="text-2xl font-bold text-slate-900">{balance.total}</p>
                      </div>
                      <TrendingUp className="w-8 h-8 text-slate-400" />
                    </div>
                    <p className="text-xs text-slate-500 mt-2">
                      Ideal: 40% Educar, 30% Inspirar, 30% Vender
                    </p>
                  </div>
                </>
              ) : null}
            </div>
          )}
        </div>
      </Card>

      <Modal
        isOpen={isModalOpen && !!selectedTemplate}
        onClose={handleCloseModal}
        title={selectedTemplate?.name || 'Plantilla IA'}
        size="lg"
        footer={
          <div className="flex gap-3">
            <Button variant="ghost" size="sm" onClick={handleCloseModal} disabled={isGenerating}>
              Cerrar
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={handleGenerateContent}
              loading={isGenerating}
              disabled={isGenerating || !selectedPlatform}
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Generar contenido
            </Button>
          </div>
        }
      >
        {selectedTemplate ? (
          <div className="space-y-6">
            <div className="flex flex-col gap-2">
              <p className="text-sm font-semibold text-violet-600">{selectedTemplate.description}</p>
              <div className="flex flex-wrap gap-2">
                <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${purposeConfig[selectedTemplate.purpose].color}`}>
                  {purposeConfig[selectedTemplate.purpose].label}
                </span>
                <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700">
                  {formatLabels[selectedTemplate.format]}
                </span>
                <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700">
                  {selectedTemplate.category}
                </span>
              </div>
            </div>

            <Select
              label="Plataforma"
              value={selectedPlatform}
              onChange={(e) => setSelectedPlatform(e.target.value as SocialPlatform)}
              options={platformOptions}
              placeholder="Selecciona una plataforma"
            />

            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-slate-900">Variables del template</h4>
              {selectedTemplate.variables.map((variable) => (
                <div key={variable.key}>
                  {variable.type === 'text' || variable.type === 'url' || variable.type === 'hashtag' ? (
                    <Input
                      label={variable.label}
                      value={templateVariables[variable.key] || ''}
                      onChange={(e) => handleVariableChange(variable.key, e.target.value)}
                      placeholder={variable.defaultValue || `Ingresa ${variable.label.toLowerCase()}`}
                      required={variable.required}
                    />
                  ) : variable.type === 'number' ? (
                    <Input
                      label={variable.label}
                      type="number"
                      value={templateVariables[variable.key] || ''}
                      onChange={(e) => handleVariableChange(variable.key, e.target.value)}
                      placeholder={variable.defaultValue || `Ingresa ${variable.label.toLowerCase()}`}
                      required={variable.required}
                    />
                  ) : variable.type === 'date' ? (
                    <Input
                      label={variable.label}
                      type="date"
                      value={templateVariables[variable.key] || ''}
                      onChange={(e) => handleVariableChange(variable.key, e.target.value)}
                      required={variable.required}
                    />
                  ) : null}
                </div>
              ))}
            </div>

            {generatedContent ? (
              <div className="space-y-4 rounded-xl border border-violet-200 bg-violet-50 p-4">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-violet-600" />
                  <h4 className="text-sm font-semibold text-violet-900">Contenido generado</h4>
                </div>
                <Textarea
                  value={generatedContent.content}
                  readOnly
                  rows={8}
                  className="bg-white"
                />
                <div className="flex flex-wrap gap-2">
                  {generatedContent.hashtags.map((hashtag) => (
                    <span
                      key={hashtag}
                      className="inline-flex items-center rounded-full bg-violet-100 px-2.5 py-1 text-xs font-semibold text-violet-700"
                    >
                      {hashtag}
                    </span>
                  ))}
                </div>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => {
                    navigator.clipboard.writeText(generatedContent.content);
                    alert('Contenido copiado al portapapeles');
                  }}
                >
                  Copiar contenido
                </Button>
              </div>
            ) : null}
          </div>
        ) : null}
      </Modal>
    </>
  );
}

