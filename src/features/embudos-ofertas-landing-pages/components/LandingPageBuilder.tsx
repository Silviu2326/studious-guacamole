import React, { useState, useEffect } from 'react';
import { Card, Button, Input, Textarea, Modal } from '../../../components/componentsreutilizables';
import { ds } from '../../adherencia/ui/ds';
import { getLandingPage, updateLandingPage, getTemplates } from '../api/landingPages';
import type { LandingPage, LandingPageTemplate } from '../types';
import { 
  Save, 
  Eye, 
  Settings, 
  FileText, 
  Image, 
  Video, 
  MousePointerClick,
  Type,
  CheckSquare,
  MessageSquare,
  Star,
  CreditCard
} from 'lucide-react';

interface LandingPageBuilderProps {
  pageId: string | null;
  onSave: () => void;
  onClose?: () => void;
  role?: 'entrenador' | 'gimnasio';
}

export const LandingPageBuilder: React.FC<LandingPageBuilderProps> = ({
  pageId,
  onSave,
  onClose,
}) => {
  const [page, setPage] = useState<LandingPage | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
  const [templates, setTemplates] = useState<LandingPageTemplate[]>([]);

  useEffect(() => {
    if (pageId) {
      loadPage();
    } else {
      loadTemplates();
    }
  }, [pageId]);

  const loadPage = async () => {
    if (!pageId) return;
    try {
      setLoading(true);
      const data = await getLandingPage(pageId);
      setPage(data);
    } catch (error) {
      console.error('Error loading landing page:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadTemplates = async () => {
    try {
      const data = await getTemplates();
      setTemplates(data);
    } catch (error) {
      console.error('Error loading templates:', error);
    }
  };

  const handleSave = async () => {
    if (!page) return;
    try {
      setSaving(true);
      await updateLandingPage(page.pageId, {
        name: page.name,
        contentJson: page.contentJson,
        pageSlug: page.pageSlug,
        seoMetadata: page.seoMetadata,
      });
      onSave();
    } catch (error) {
      console.error('Error saving landing page:', error);
    } finally {
      setSaving(false);
    }
  };

  const addBlock = (type: LandingPage['contentJson']['blocks'][0]['type']) => {
    if (!page) return;
    const newBlock = {
      id: `block-${Date.now()}`,
      type,
      content: '',
      props: {},
    };
    setPage({
      ...page,
      contentJson: {
        ...page.contentJson,
        blocks: [...page.contentJson.blocks, newBlock],
      },
    });
  };

  const updateBlock = (blockId: string, updates: Partial<LandingPage['contentJson']['blocks'][0]>) => {
    if (!page) return;
    setPage({
      ...page,
      contentJson: {
        ...page.contentJson,
        blocks: page.contentJson.blocks.map(block =>
          block.id === blockId ? { ...block, ...updates } : block
        ),
      },
    });
  };

  const removeBlock = (blockId: string) => {
    if (!page) return;
    setPage({
      ...page,
      contentJson: {
        ...page.contentJson,
        blocks: page.contentJson.blocks.filter(block => block.id !== blockId),
      },
    });
  };

  const blockIcons = {
    headline: Type,
    paragraph: FileText,
    image: Image,
    video: Video,
    button: MousePointerClick,
    form: CheckSquare,
    testimonial: MessageSquare,
    feature: Star,
    pricing: CreditCard,
  };

  if (loading) {
    return (
      <Card className={`p-8 text-center ${ds.card}`}>
        <div className={`${ds.color.textSecondary} ${ds.color.textSecondaryDark}`}>
          Cargando editor...
        </div>
      </Card>
    );
  }

  if (!page && !pageId) {
    return (
      <Card className={ds.card}>
        <div className="space-y-4">
          <h3 className={`${ds.typography.h2} ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
            Crear Nueva Landing Page
          </h3>
          <p className={`${ds.typography.body} ${ds.color.textSecondary} ${ds.color.textSecondaryDark}`}>
            Selecciona una plantilla o crea una desde cero.
          </p>
          {/* Placeholder para selección de plantillas */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-6">
            {templates.slice(0, 6).map((template) => (
              <Card
                key={template.templateId}
                className={`h-full flex flex-col ${ds.cardHover} overflow-hidden cursor-pointer`}
                onClick={() => {
                  // Lógica para inicializar página con plantilla
                  setPage({
                    pageId: `lp_${Date.now()}`,
                    name: template.name,
                    status: 'draft',
                    contentJson: template.contentJson,
                    createdAt: new Date().toISOString(),
                  });
                }}
              >
                <div className="space-y-2 p-4">
                  <div className={`aspect-video ${ds.color.surface} rounded-xl flex items-center justify-center`}>
                    <FileText size={32} className={`${ds.color.textMuted} ${ds.color.textMutedDark}`} />
                  </div>
                  <div className={`${ds.typography.bodySmall} font-medium ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
                    {template.name}
                  </div>
                  <div className={`${ds.typography.caption} ${ds.color.textSecondary} ${ds.color.textSecondaryDark}`}>
                    {template.description}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </Card>
    );
  }

  if (!page) return null;

  return (
    <div className="space-y-6">
      {/* Barra de herramientas */}
      <Card className={ds.card}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Input
              value={page.name}
              onChange={(e) => setPage({ ...page, name: e.target.value })}
              placeholder="Nombre de la landing page"
              className="w-64"
            />
            <Button variant="secondary" size="sm" onClick={() => setShowSettings(true)}>
              <Settings size={18} className="mr-2" />
              Configuración
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm">
              <Eye size={18} className="mr-2" />
              Vista Previa
            </Button>
            <Button variant="primary" size="sm" onClick={handleSave} disabled={saving}>
              <Save size={18} className="mr-2" />
              {saving ? 'Guardando...' : 'Guardar'}
            </Button>
            {onClose && (
              <Button variant="ghost" size="sm" onClick={onClose}>
                Cerrar
              </Button>
            )}
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Panel lateral - Componentes disponibles */}
        <div className="lg:col-span-1">
          <Card className={ds.card}>
            <h4 className={`${ds.typography.h3} ${ds.color.textPrimary} ${ds.color.textPrimaryDark} mb-4`}>
              Componentes
            </h4>
            <div className="space-y-2">
              {Object.entries(blockIcons).map(([type, Icon]) => (
                <Button
                  key={type}
                  variant="ghost"
                  size="sm"
                  fullWidth
                  onClick={() => addBlock(type as any)}
                  className="justify-start"
                >
                  <Icon size={16} className="mr-2" />
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </Button>
              ))}
            </div>
          </Card>
        </div>

        {/* Área de edición */}
        <div className="lg:col-span-3">
          <Card className={ds.card}>
            <div className="space-y-4">
              {page.contentJson.blocks.length === 0 ? (
                <div className={`text-center py-12 border-2 border-dashed ${ds.color.border} ${ds.radius.lg}`}>
                  <FileText size={48} className={`${ds.color.textMuted} ${ds.color.textMutedDark} mx-auto mb-4`} />
                  <h3 className={`${ds.typography.h3} ${ds.color.textPrimary} ${ds.color.textPrimaryDark} mb-2`}>Página vacía</h3>
                  <p className={`${ds.typography.body} ${ds.color.textSecondary} ${ds.color.textSecondaryDark} mb-4`}>
                    Tu página está vacía. Agrega componentes desde el panel lateral.
                  </p>
                </div>
              ) : (
                page.contentJson.blocks.map((block) => {
                  const Icon = blockIcons[block.type];
                  return (
                    <div
                      key={block.id}
                      className={`p-4 border-2 ${ds.radius.lg} ${ds.animation.normal} ${
                        selectedBlockId === block.id
                          ? `border-blue-500 bg-blue-50`
                          : ds.color.border
                      }`}
                      onClick={() => setSelectedBlockId(block.id)}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Icon size={16} className={`${ds.color.textMuted} ${ds.color.textMutedDark}`} />
                          <span className={`${ds.typography.caption} ${ds.color.textSecondary} ${ds.color.textSecondaryDark} font-medium uppercase`}>
                            {block.type}
                          </span>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeBlock(block.id)}
                        >
                          Eliminar
                        </Button>
                      </div>
                      {block.type === 'headline' && (
                        <Input
                          value={block.content || ''}
                          onChange={(e) => updateBlock(block.id, { content: e.target.value })}
                          placeholder="Escribe tu titular..."
                          className="text-2xl font-bold"
                        />
                      )}
                      {block.type === 'paragraph' && (
                        <Textarea
                          value={block.content || ''}
                          onChange={(e) => updateBlock(block.id, { content: e.target.value })}
                          placeholder="Escribe tu texto..."
                          rows={4}
                        />
                      )}
                      {block.type === 'button' && (
                        <div className="space-y-2">
                          <Input
                            value={block.content || ''}
                            onChange={(e) => updateBlock(block.id, { content: e.target.value })}
                            placeholder="Texto del botón..."
                          />
                          <Input
                            value={block.props?.url || ''}
                            onChange={(e) => updateBlock(block.id, { props: { ...block.props, url: e.target.value } })}
                            placeholder="URL de destino..."
                          />
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </Card>
        </div>
      </div>

      {/* Modal de configuración */}
      <Modal
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        title="Configuración de la Landing Page"
      >
        <div className="space-y-4">
          <div>
            <label className={`block ${ds.typography.bodySmall} font-medium ${ds.color.textPrimary} ${ds.color.textPrimaryDark} mb-2`}>
              URL Slug
            </label>
            <Input
              value={page.pageSlug || ''}
              onChange={(e) => setPage({ ...page, pageSlug: e.target.value })}
              placeholder="mi-oferta-verano"
            />
          </div>
          <div>
            <label className={`block ${ds.typography.bodySmall} font-medium ${ds.color.textPrimary} ${ds.color.textPrimaryDark} mb-2`}>
              Título SEO
            </label>
            <Input
              value={page.seoMetadata?.title || ''}
              onChange={(e) =>
                setPage({
                  ...page,
                  seoMetadata: { ...page.seoMetadata, title: e.target.value },
                })
              }
              placeholder="Título para buscadores"
            />
          </div>
          <div>
            <label className={`block ${ds.typography.bodySmall} font-medium ${ds.color.textPrimary} ${ds.color.textPrimaryDark} mb-2`}>
              Descripción SEO
            </label>
            <Textarea
              value={page.seoMetadata?.description || ''}
              onChange={(e) =>
                setPage({
                  ...page,
                  seoMetadata: { ...page.seoMetadata, description: e.target.value },
                })
              }
              placeholder="Descripción para buscadores"
              rows={3}
            />
          </div>
        </div>
      </Modal>
    </div>
  );
};

