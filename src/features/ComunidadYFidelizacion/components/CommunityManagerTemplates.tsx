import { useState, useEffect, useCallback } from 'react';
import {
  FileText,
  Sparkles,
  Plus,
  Edit,
  Trash2,
  Users,
  CheckCircle,
  XCircle,
  AlertCircle,
  BookOpen,
  Download,
  Upload,
} from 'lucide-react';
import { Card, Badge, Button, Tabs } from '../../../components/componentsreutilizables';
import {
  CommunityManagerAITemplate,
  CommunityManagerGuidelines,
  TemplateCategory,
  TemplateStatus,
} from '../types';
import {
  getCommunityManagerTemplates,
  getCommunityManagerGuidelines,
  createTemplate,
  updateTemplate,
  deleteTemplate,
  assignTemplateToManagers,
  updateCommunityManagerGuidelines,
} from '../api/communityManagerTemplates';

interface CommunityManagerTemplatesProps {
  loading?: boolean;
  onRefresh?: () => void;
}

const categoryLabels: Record<TemplateCategory, string> = {
  testimonial: 'Testimonios',
  'social-post': 'Posts Sociales',
  email: 'Emails',
  message: 'Mensajes',
  content: 'Contenido',
  campaign: 'Campañas',
};

const statusLabels: Record<TemplateStatus, string> = {
  draft: 'Borrador',
  active: 'Activo',
  archived: 'Archivado',
};

const statusColors: Record<TemplateStatus, 'gray' | 'green' | 'blue'> = {
  draft: 'gray',
  active: 'green',
  archived: 'blue',
};

export function CommunityManagerTemplates({ loading: externalLoading, onRefresh }: CommunityManagerTemplatesProps) {
  const [templates, setTemplates] = useState<CommunityManagerAITemplate[]>([]);
  const [guidelines, setGuidelines] = useState<CommunityManagerGuidelines | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<TemplateCategory | 'all'>('all');
  const [activeTab, setActiveTab] = useState<'templates' | 'guidelines'>('templates');
  const [selectedTemplate, setSelectedTemplate] = useState<CommunityManagerAITemplate | null>(null);
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);

  useEffect(() => {
    loadData();
  }, [selectedCategory]);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [templatesData, guidelinesData] = await Promise.all([
        getCommunityManagerTemplates(selectedCategory === 'all' ? undefined : selectedCategory),
        getCommunityManagerGuidelines(),
      ]);
      setTemplates(templatesData);
      setGuidelines(guidelinesData);
    } catch (error) {
      console.error('Error cargando datos:', error);
    } finally {
      setLoading(false);
    }
  }, [selectedCategory]);

  const handleDeleteTemplate = useCallback(async (templateId: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar esta plantilla?')) return;

    try {
      await deleteTemplate(templateId);
      await loadData();
      if (onRefresh) onRefresh();
    } catch (error) {
      console.error('Error eliminando plantilla:', error);
    }
  }, [loadData, onRefresh]);

  const filteredTemplates = templates.filter((t) =>
    selectedCategory === 'all' ? true : t.category === selectedCategory
  );

  return (
    <Card className="bg-white/90 dark:bg-slate-900/80 shadow-sm border border-slate-200/60 dark:border-slate-800/60">
      <header className="flex items-start justify-between gap-4 mb-6">
        <div>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            Plantillas IA para Community Managers
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 max-w-2xl mt-1">
            Aprovisiona plantillas IA con guidelines claros para mantener coherencia al delegar contenido a tus
            community managers.
          </p>
        </div>
        <Badge variant="blue" size="sm" className="inline-flex items-center gap-1.5">
          <FileText className="w-3.5 h-3.5" />
          US-CF-20
        </Badge>
      </header>

      <Tabs
        items={[
          { id: 'templates', label: 'Plantillas', icon: <FileText className="w-4 h-4" /> },
          { id: 'guidelines', label: 'Guidelines', icon: <BookOpen className="w-4 h-4" /> },
        ]}
        activeTab={activeTab}
        onTabChange={(tab) => setActiveTab(tab as 'templates' | 'guidelines')}
        variant="pills"
        size="sm"
        className="mb-6"
      />

      {activeTab === 'templates' && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 flex-wrap">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setSelectedCategory('all')}
                className={selectedCategory === 'all' ? 'bg-indigo-100 dark:bg-indigo-900/30' : ''}
              >
                Todas
              </Button>
              {(Object.keys(categoryLabels) as TemplateCategory[]).map((category) => (
                <Button
                  key={category}
                  variant="secondary"
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                  className={selectedCategory === category ? 'bg-indigo-100 dark:bg-indigo-900/30' : ''}
                >
                  {categoryLabels[category]}
                </Button>
              ))}
            </div>
            <Button
              variant="primary"
              size="sm"
              onClick={() => {
                setSelectedTemplate(null);
                setIsTemplateModalOpen(true);
              }}
              className="inline-flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Nueva Plantilla
            </Button>
          </div>

          {loading || externalLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="animate-pulse h-32 bg-slate-200/60 dark:bg-slate-800/60 rounded-lg" />
              ))}
            </div>
          ) : filteredTemplates.length === 0 ? (
            <div className="text-center py-12 text-slate-500 dark:text-slate-400">
              <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No hay plantillas disponibles</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredTemplates.map((template) => (
                <div
                  key={template.id}
                  className="rounded-xl border border-slate-200/60 dark:border-slate-800/60 p-5 bg-gradient-to-br from-white via-white to-slate-50 dark:from-slate-900 dark:via-slate-900/95 dark:to-slate-950"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                          {template.name}
                        </h4>
                        <Badge variant={statusColors[template.status]} size="sm">
                          {statusLabels[template.status]}
                        </Badge>
                        <Badge variant="blue" size="sm">
                          {categoryLabels[template.category]}
                        </Badge>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">{template.description}</p>
                      <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
                        <span className="flex items-center gap-1">
                          <Users className="w-3.5 h-3.5" />
                          {template.assignedTo?.length || 0} asignado(s)
                        </span>
                        {template.usageCount && (
                          <span>Usado {template.usageCount} veces</span>
                        )}
                        {template.lastUsed && (
                          <span>Último uso: {new Date(template.lastUsed).toLocaleDateString()}</span>
                        )}
                      </div>
                      {template.guidelines && (
                        <div className="mt-3 p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg">
                          <p className="text-xs font-medium text-indigo-900 dark:text-indigo-300 mb-2">
                            Guidelines:
                          </p>
                          <div className="space-y-1">
                            <p className="text-xs text-indigo-700 dark:text-indigo-400">
                              <strong>Tono:</strong> {template.guidelines.tone}
                            </p>
                            {template.guidelines.do.length > 0 && (
                              <div className="flex items-start gap-2">
                                <CheckCircle className="w-3 h-3 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                                <div className="text-xs text-indigo-700 dark:text-indigo-400">
                                  <strong>DO:</strong> {template.guidelines.do.join(', ')}
                                </div>
                              </div>
                            )}
                            {template.guidelines.dont.length > 0 && (
                              <div className="flex items-start gap-2">
                                <XCircle className="w-3 h-3 text-rose-600 dark:text-rose-400 mt-0.5 flex-shrink-0" />
                                <div className="text-xs text-indigo-700 dark:text-indigo-400">
                                  <strong>DON'T:</strong> {template.guidelines.dont.join(', ')}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSelectedTemplate(template);
                          setIsTemplateModalOpen(true);
                        }}
                        title="Editar"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteTemplate(template.id)}
                        title="Eliminar"
                        className="text-rose-500 hover:text-rose-600 dark:text-rose-400 dark:hover:text-rose-300"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'guidelines' && (
        <div>
          {loading || externalLoading ? (
            <div className="animate-pulse h-64 bg-slate-200/60 dark:bg-slate-800/60 rounded-lg" />
          ) : guidelines ? (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-base font-semibold text-slate-900 dark:text-slate-100 mb-1">
                    Guidelines Generales
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Versión {guidelines.version || 1} · Última actualización:{' '}
                    {guidelines.updatedAt ? new Date(guidelines.updatedAt).toLocaleDateString() : 'N/A'}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="secondary" size="sm" className="inline-flex items-center gap-2">
                    <Download className="w-4 h-4" />
                    Exportar
                  </Button>
                  <Button variant="primary" size="sm" className="inline-flex items-center gap-2">
                    <Edit className="w-4 h-4" />
                    Editar
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                  <h5 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-3 flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
                    DOs
                  </h5>
                  <ul className="space-y-2">
                    {guidelines.dos.map((item, index) => (
                      <li key={index} className="text-sm text-slate-700 dark:text-slate-300 flex items-start gap-2">
                        <span className="text-green-600 dark:text-green-400 mt-1">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                  <h5 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-3 flex items-center gap-2">
                    <XCircle className="w-4 h-4 text-rose-600 dark:text-rose-400" />
                    DON'Ts
                  </h5>
                  <ul className="space-y-2">
                    {guidelines.donts.map((item, index) => (
                      <li key={index} className="text-sm text-slate-700 dark:text-slate-300 flex items-start gap-2">
                        <span className="text-rose-600 dark:text-rose-400 mt-1">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-indigo-50 dark:bg-indigo-900/20">
                <h5 className="text-sm font-semibold text-indigo-900 dark:text-indigo-300 mb-3">
                  Voz de Marca
                </h5>
                <p className="text-sm text-indigo-700 dark:text-indigo-400 mb-2">
                  <strong>Tono:</strong> {guidelines.general.tone}
                </p>
                <p className="text-sm text-indigo-700 dark:text-indigo-400 mb-2">
                  <strong>Voz:</strong> {guidelines.general.voice}
                </p>
                {guidelines.general.values.length > 0 && (
                  <div className="mt-2">
                    <p className="text-xs font-medium text-indigo-900 dark:text-indigo-300 mb-1">Valores:</p>
                    <div className="flex flex-wrap gap-2">
                      {guidelines.general.values.map((value, index) => (
                        <Badge key={index} variant="blue" size="sm">
                          {value}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {guidelines.goodExamples && guidelines.goodExamples.length > 0 && (
                <div>
                  <h5 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-3">
                    Ejemplos de Buen Contenido
                  </h5>
                  <div className="space-y-3">
                    {guidelines.goodExamples.map((example) => (
                      <div
                        key={example.id}
                        className="p-4 rounded-xl border border-green-200 dark:border-green-900/30 bg-green-50 dark:bg-green-900/10"
                      >
                        <div className="flex items-start gap-2 mb-2">
                          <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                          <div className="flex-1">
                            <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                              {example.title}
                            </p>
                            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">{example.content}</p>
                            <p className="text-xs text-green-700 dark:text-green-400 mt-2">
                              <strong>Por qué es bueno:</strong> {example.whyGood}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-12 text-slate-500 dark:text-slate-400">
              <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No hay guidelines configurados</p>
              <Button variant="primary" size="sm" className="mt-4">
                Crear Guidelines
              </Button>
            </div>
          )}
        </div>
      )}
    </Card>
  );
}

