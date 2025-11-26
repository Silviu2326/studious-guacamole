import { useEffect, useState } from 'react';
import {
  ArrowRight,
  CheckCircle2,
  Filter,
  Link2,
  Loader2,
  RefreshCw,
  Sparkles,
  TrendingUp,
} from 'lucide-react';
import {
  Badge,
  Button,
  Card,
  Checkbox,
  Input,
  Modal,
  Select,
  Textarea,
} from '../../../components/componentsreutilizables';
import type { ActiveFunnel, ApprovedContent, ContentToFunnelLinkRequest } from '../types';
import { getActiveFunnels, linkContentToFunnel, getKeyContentForFunnels } from '../api/contentToFunnels';

interface ContentToFunnelsLinkerProps {
  loading?: boolean;
}

const placementLabels: Record<string, string> = {
  'nurture-email': 'Email de Nurturing',
  'nurture-whatsapp': 'WhatsApp de Nurturing',
  'landing-page': 'Landing Page',
  'thank-you-page': 'Página de Agradecimiento',
  'follow-up': 'Seguimiento',
};

const stageColors: Record<string, string> = {
  TOFU: 'bg-blue-100 text-blue-700',
  MOFU: 'bg-purple-100 text-purple-700',
  BOFU: 'bg-green-100 text-green-700',
};

export function ContentToFunnelsLinker({ loading: externalLoading }: ContentToFunnelsLinkerProps) {
  const [activeFunnels, setActiveFunnels] = useState<ActiveFunnel[]>([]);
  const [keyContent, setKeyContent] = useState<ApprovedContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedContentIds, setSelectedContentIds] = useState<Set<string>>(new Set());
  const [selectedFunnelId, setSelectedFunnelId] = useState<string>('');
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [linking, setLinking] = useState(false);
  const [linkSuccess, setLinkSuccess] = useState(false);

  const [linkFormData, setLinkFormData] = useState<ContentToFunnelLinkRequest>({
    contentIds: [],
    funnelId: '',
    placement: 'nurture-email',
    autoAdapt: true,
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [funnels, content] = await Promise.all([getActiveFunnels(), getKeyContentForFunnels()]);
      setActiveFunnels(funnels);
      setKeyContent(content);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectContent = (contentId: string) => {
    const newSelected = new Set(selectedContentIds);
    if (newSelected.has(contentId)) {
      newSelected.delete(contentId);
    } else {
      newSelected.add(contentId);
    }
    setSelectedContentIds(newSelected);
  };

  const handleSelectAll = () => {
    if (selectedContentIds.size === keyContent.length) {
      setSelectedContentIds(new Set());
    } else {
      setSelectedContentIds(new Set(keyContent.map((c) => c.id)));
    }
  };

  const handleOpenLinkModal = () => {
    if (selectedContentIds.size === 0 || !selectedFunnelId) return;
    setLinkFormData({
      ...linkFormData,
      contentIds: Array.from(selectedContentIds),
      funnelId: selectedFunnelId,
    });
    setShowLinkModal(true);
    setLinkSuccess(false);
  };

  const handleLinkToFunnel = async () => {
    setLinking(true);
    try {
      const response = await linkContentToFunnel(linkFormData);
      if (response.success) {
        setLinkSuccess(true);
        setTimeout(() => {
          setShowLinkModal(false);
          setSelectedContentIds(new Set());
          setSelectedFunnelId('');
          setLinkSuccess(false);
        }, 2000);
      }
    } catch (error) {
      console.error('Error linking content to funnel:', error);
    } finally {
      setLinking(false);
    }
  };

  const selectedFunnel = activeFunnels.find((f) => f.id === selectedFunnelId);

  if (externalLoading || loading) {
    return (
      <Card className="p-8">
        <div className="flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-violet-600" />
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-violet-100 to-rose-200 dark:from-violet-900/40 dark:to-rose-900/30 rounded-lg">
              <Sparkles className="w-5 h-5 text-violet-600 dark:text-violet-300" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-slate-100">
                Vincular Piezas Clave a Funnels Activos
              </h2>
              <p className="text-sm text-gray-600 dark:text-slate-400">
                Refuerza los nurtures de tus funnels vinculando contenido clave
              </p>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={loadData}>
            <RefreshCw className="w-4 h-4" />
          </Button>
        </div>

        {/* Selector de Funnel */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
            Selecciona un Funnel Activo
          </label>
          <Select
            value={selectedFunnelId}
            onChange={(e) => setSelectedFunnelId(e.target.value)}
            options={[
              { value: '', label: 'Selecciona un funnel...' },
              ...activeFunnels.map((funnel) => ({
                value: funnel.id,
                label: `${funnel.name} (${funnel.stage})`,
              })),
            ]}
          />
          {selectedFunnel && (
            <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="blue" size="sm" className={stageColors[selectedFunnel.stage]}>
                  {selectedFunnel.stage}
                </Badge>
                {selectedFunnel.revenue && (
                  <Badge variant="green" size="sm">
                    ${selectedFunnel.revenue.toLocaleString()} ingresos
                  </Badge>
                )}
                {selectedFunnel.conversionRate && (
                  <Badge variant="purple" size="sm">
                    {selectedFunnel.conversionRate.toFixed(1)}% conversión
                  </Badge>
                )}
              </div>
              {selectedFunnel.description && (
                <p className="text-sm text-gray-600 dark:text-slate-400">{selectedFunnel.description}</p>
              )}
            </div>
          )}
        </div>

        {/* Lista de Contenido Clave */}
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-slate-100">
            Contenido Clave Recomendado
          </h3>
          <div className="flex items-center gap-3">
            {selectedContentIds.size > 0 && (
              <Badge variant="blue" size="md">
                {selectedContentIds.size} seleccionado{selectedContentIds.size > 1 ? 's' : ''}
              </Badge>
            )}
            <Button variant="ghost" size="sm" onClick={handleSelectAll}>
              {selectedContentIds.size === keyContent.length ? 'Deseleccionar todo' : 'Seleccionar todo'}
            </Button>
            <Button
              variant="primary"
              onClick={handleOpenLinkModal}
              disabled={selectedContentIds.size === 0 || !selectedFunnelId}
            >
              <Link2 className="w-4 h-4 mr-2" />
              Vincular a Funnel
            </Button>
          </div>
        </div>

        {keyContent.length === 0 ? (
          <div className="text-center py-12">
            <Filter className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-slate-400">No hay contenido clave disponible</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {keyContent.map((content) => (
              <Card
                key={content.id}
                variant={selectedContentIds.has(content.id) ? 'hover' : 'default'}
                className={`p-4 cursor-pointer transition-all ${
                  selectedContentIds.has(content.id) ? 'ring-2 ring-violet-500' : ''
                }`}
                onClick={() => handleSelectContent(content.id)}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="green" size="sm">
                        {content.type}
                      </Badge>
                      {content.performance && content.performance.engagementRate && (
                        <Badge variant="purple" size="sm">
                          <TrendingUp className="w-3 h-3 mr-1" />
                          {content.performance.engagementRate.toFixed(1)}%
                        </Badge>
                      )}
                    </div>
                    <h3 className="font-semibold text-gray-900 dark:text-slate-100 mb-1">
                      {content.title}
                    </h3>
                  </div>
                  <Checkbox
                    checked={selectedContentIds.has(content.id)}
                    onChange={() => handleSelectContent(content.id)}
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>

                <div className="space-y-2 mb-3">
                  {content.content.caption && (
                    <p className="text-sm text-gray-600 dark:text-slate-400 line-clamp-2">
                      {content.content.caption}
                    </p>
                  )}
                  {content.content.subject && (
                    <p className="text-sm font-medium text-gray-700 dark:text-slate-300">
                      {content.content.subject}
                    </p>
                  )}
                  {content.tags && content.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {content.tags.slice(0, 3).map((tag) => (
                        <Badge key={tag} variant="gray" size="sm">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}
      </Card>

      {/* Modal para vincular a funnel */}
      <Modal
        isOpen={showLinkModal}
        onClose={() => !linking && setShowLinkModal(false)}
        title="Vincular Contenido a Funnel"
        size="lg"
      >
        {linkSuccess ? (
          <div className="text-center py-8">
            <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-slate-100 mb-2">
              ¡Contenido vinculado exitosamente!
            </h3>
            <p className="text-gray-600 dark:text-slate-400">
              El contenido ha sido vinculado al funnel y reforzará los nurtures
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            <div>
              <p className="text-sm text-gray-600 dark:text-slate-400 mb-2">
                Funnel seleccionado: <strong>{selectedFunnel?.name}</strong>
              </p>
              <p className="text-sm text-gray-600 dark:text-slate-400">
                {linkFormData.contentIds.length} contenido(s) serán vinculados a este funnel
              </p>
            </div>

            {selectedFunnel?.stages && selectedFunnel.stages.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                  Etapa del Funnel (opcional)
                </label>
                <Select
                  value={linkFormData.stageId || ''}
                  onChange={(e) => setLinkFormData({ ...linkFormData, stageId: e.target.value || undefined })}
                  options={[
                    { value: '', label: 'Todas las etapas' },
                    ...selectedFunnel.stages.map((stage) => ({
                      value: stage.id,
                      label: `${stage.name} (${stage.type})`,
                    })),
                  ]}
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                Ubicación en el Funnel
              </label>
              <Select
                value={linkFormData.placement}
                onChange={(e) =>
                  setLinkFormData({ ...linkFormData, placement: e.target.value as any })
                }
                options={[
                  { value: 'nurture-email', label: 'Email de Nurturing' },
                  { value: 'nurture-whatsapp', label: 'WhatsApp de Nurturing' },
                  { value: 'landing-page', label: 'Landing Page' },
                  { value: 'thank-you-page', label: 'Página de Agradecimiento' },
                  { value: 'follow-up', label: 'Seguimiento' },
                ]}
              />
              <p className="text-xs text-gray-500 dark:text-slate-500 mt-1">
                Dónde se mostrará este contenido en el funnel
              </p>
            </div>

            <div>
              <label className="flex items-center gap-2 mb-2">
                <Checkbox
                  checked={linkFormData.autoAdapt}
                  onChange={(checked) => setLinkFormData({ ...linkFormData, autoAdapt: checked })}
                />
                <span className="text-sm font-medium text-gray-700 dark:text-slate-300">
                  Adaptar contenido al formato del funnel
                </span>
              </label>
              <p className="text-xs text-gray-500 dark:text-slate-500 ml-6">
                El contenido se adaptará automáticamente al formato requerido por el funnel
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                Notas (opcional)
              </label>
              <Textarea
                value={linkFormData.notes || ''}
                onChange={(e) => setLinkFormData({ ...linkFormData, notes: e.target.value })}
                placeholder="Agrega notas sobre cómo usar este contenido en el funnel..."
                rows={3}
              />
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
              <Button variant="ghost" onClick={() => setShowLinkModal(false)} disabled={linking}>
                Cancelar
              </Button>
              <Button variant="primary" onClick={handleLinkToFunnel} loading={linking}>
                <Link2 className="w-4 h-4 mr-2" />
                Vincular a Funnel
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

