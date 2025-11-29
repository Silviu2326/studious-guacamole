import { useEffect, useState } from 'react';
import {
  ArrowRight,
  CheckCircle2,
  Loader2,
  Mail,
  MessageSquare,
  RefreshCw,
  Send,
  Smartphone,
  Sparkles,
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
import type { ApprovedContent, ContentToCampaignsRequest } from '../types';
import { getApprovedContent, sendContentToCampaigns } from '../api/contentToCampaigns';

interface ApprovedContentToCampaignsProps {
  loading?: boolean;
}

const contentTypeLabels: Record<string, string> = {
  post: 'Post',
  reel: 'Reel',
  carousel: 'Carrusel',
  email: 'Email',
  whatsapp: 'WhatsApp',
  video: 'Video',
  template: 'Plantilla',
};

const sourceLabels: Record<string, string> = {
  planner: 'Planner',
  clipper: 'Biblioteca',
  'ai-generator': 'IA Generador',
  'video-studio': 'Video Studio',
  transformation: 'Transformación',
  promotional: 'Promocional',
};

export function ApprovedContentToCampaigns({ loading: externalLoading }: ApprovedContentToCampaignsProps) {
  const [approvedContent, setApprovedContent] = useState<ApprovedContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedContentIds, setSelectedContentIds] = useState<Set<string>>(new Set());
  const [showSendModal, setShowSendModal] = useState(false);
  const [sending, setSending] = useState(false);
  const [sendSuccess, setSendSuccess] = useState(false);

  const [sendFormData, setSendFormData] = useState<ContentToCampaignsRequest>({
    contentIds: [],
    targetType: 'sequence',
    channels: ['email'],
    adaptContent: true,
    includeMedia: true,
  });

  useEffect(() => {
    loadApprovedContent();
  }, []);

  const loadApprovedContent = async () => {
    setLoading(true);
    try {
      const content = await getApprovedContent();
      setApprovedContent(content);
    } catch (error) {
      console.error('Error loading approved content:', error);
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
    if (selectedContentIds.size === approvedContent.length) {
      setSelectedContentIds(new Set());
    } else {
      setSelectedContentIds(new Set(approvedContent.map((c) => c.id)));
    }
  };

  const handleOpenSendModal = () => {
    if (selectedContentIds.size === 0) return;
    setSendFormData({
      ...sendFormData,
      contentIds: Array.from(selectedContentIds),
    });
    setShowSendModal(true);
    setSendSuccess(false);
  };

  const handleSendToCampaigns = async () => {
    setSending(true);
    try {
      const response = await sendContentToCampaigns(sendFormData);
      if (response.success) {
        setSendSuccess(true);
        setTimeout(() => {
          setShowSendModal(false);
          setSelectedContentIds(new Set());
          setSendSuccess(false);
        }, 2000);
      }
    } catch (error) {
      console.error('Error sending content to campaigns:', error);
    } finally {
      setSending(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('es-ES', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }).format(date);
  };

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
                Enviar Contenido Aprobado a Campañas & Automatización
              </h2>
              <p className="text-sm text-gray-600 dark:text-slate-400">
                Selecciona contenido aprobado para incluirlo en secuencias email/WhatsApp
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {selectedContentIds.size > 0 && (
              <Badge variant="blue" size="md">
                {selectedContentIds.size} seleccionado{selectedContentIds.size > 1 ? 's' : ''}
              </Badge>
            )}
            <Button
              variant="primary"
              onClick={handleOpenSendModal}
              disabled={selectedContentIds.size === 0}
            >
              <Send className="w-4 h-4 mr-2" />
              Enviar a Campañas
            </Button>
            <Button variant="ghost" size="sm" onClick={loadApprovedContent}>
              <RefreshCw className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {approvedContent.length === 0 ? (
          <div className="text-center py-12">
            <CheckCircle2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-slate-400">No hay contenido aprobado disponible</p>
          </div>
        ) : (
          <>
            <div className="mb-4 flex items-center justify-between">
              <Button variant="ghost" size="sm" onClick={handleSelectAll}>
                {selectedContentIds.size === approvedContent.length ? 'Deseleccionar todo' : 'Seleccionar todo'}
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {approvedContent.map((content) => (
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
                          {contentTypeLabels[content.type] || content.type}
                        </Badge>
                        <Badge variant="gray" size="sm">
                          {sourceLabels[content.source] || content.source}
                        </Badge>
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
                        Asunto: {content.content.subject}
                      </p>
                    )}
                    {content.content.text && (
                      <p className="text-sm text-gray-600 dark:text-slate-400 line-clamp-2">
                        {content.content.text}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center justify-between text-xs text-gray-500 dark:text-slate-500">
                    <span>Aprobado: {formatDate(content.approvedAt)}</span>
                    {content.performance && (
                      <span className="flex items-center gap-1">
                        <span>📊</span>
                        {content.performance.engagementRate?.toFixed(1)}% engagement
                      </span>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          </>
        )}
      </Card>

      {/* Modal para enviar a campañas */}
      <Modal
        isOpen={showSendModal}
        onClose={() => !sending && setShowSendModal(false)}
        title="Enviar Contenido a Campañas & Automatización"
        size="lg"
      >
        {sendSuccess ? (
          <div className="text-center py-8">
            <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-slate-100 mb-2">
              ¡Contenido enviado exitosamente!
            </h3>
            <p className="text-gray-600 dark:text-slate-400">
              El contenido ha sido agregado a Campañas & Automatización
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            <div>
              <p className="text-sm text-gray-600 dark:text-slate-400 mb-4">
                {sendFormData.contentIds.length} contenido(s) seleccionado(s) serán enviados a Campañas &
                Automatización
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                Tipo de destino
              </label>
              <Select
                value={sendFormData.targetType}
                onChange={(e) =>
                  setSendFormData({ ...sendFormData, targetType: e.target.value as any })
                }
                options={[
                  { value: 'sequence', label: 'Secuencia' },
                  { value: 'campaign', label: 'Campaña' },
                  { value: 'automation', label: 'Automatización' },
                  { value: 'template', label: 'Plantilla' },
                ]}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                Canales
              </label>
              <div className="space-y-2">
                <label className="flex items-center gap-2">
                  <Checkbox
                    checked={sendFormData.channels.includes('email')}
                    onChange={(checked) => {
                      const channels = checked
                        ? [...sendFormData.channels, 'email']
                        : sendFormData.channels.filter((c) => c !== 'email');
                      setSendFormData({ ...sendFormData, channels: channels as any });
                    }}
                  />
                  <Mail className="w-4 h-4" />
                  <span>Email</span>
                </label>
                <label className="flex items-center gap-2">
                  <Checkbox
                    checked={sendFormData.channels.includes('whatsapp')}
                    onChange={(checked) => {
                      const channels = checked
                        ? [...sendFormData.channels, 'whatsapp']
                        : sendFormData.channels.filter((c) => c !== 'whatsapp');
                      setSendFormData({ ...sendFormData, channels: channels as any });
                    }}
                  />
                  <MessageSquare className="w-4 h-4" />
                  <span>WhatsApp</span>
                </label>
                <label className="flex items-center gap-2">
                  <Checkbox
                    checked={sendFormData.channels.includes('sms')}
                    onChange={(checked) => {
                      const channels = checked
                        ? [...sendFormData.channels, 'sms']
                        : sendFormData.channels.filter((c) => c !== 'sms');
                      setSendFormData({ ...sendFormData, channels: channels as any });
                    }}
                  />
                  <Smartphone className="w-4 h-4" />
                  <span>SMS</span>
                </label>
              </div>
            </div>

            <div>
              <label className="flex items-center gap-2 mb-2">
                <Checkbox
                  checked={sendFormData.adaptContent}
                  onChange={(checked) => setSendFormData({ ...sendFormData, adaptContent: checked })}
                />
                <span className="text-sm font-medium text-gray-700 dark:text-slate-300">
                  Adaptar contenido al formato del canal
                </span>
              </label>
              <p className="text-xs text-gray-500 dark:text-slate-500 ml-6">
                El contenido se adaptará automáticamente al formato requerido por cada canal
              </p>
            </div>

            <div>
              <label className="flex items-center gap-2 mb-2">
                <Checkbox
                  checked={sendFormData.includeMedia}
                  onChange={(checked) => setSendFormData({ ...sendFormData, includeMedia: checked })}
                />
                <span className="text-sm font-medium text-gray-700 dark:text-slate-300">
                  Incluir medios adjuntos
                </span>
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                Notas (opcional)
              </label>
              <Textarea
                value={sendFormData.notes || ''}
                onChange={(e) => setSendFormData({ ...sendFormData, notes: e.target.value })}
                placeholder="Agrega notas sobre cómo usar este contenido..."
                rows={3}
              />
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
              <Button variant="ghost" onClick={() => setShowSendModal(false)} disabled={sending}>
                Cancelar
              </Button>
              <Button
                variant="primary"
                onClick={handleSendToCampaigns}
                loading={sending}
                disabled={sendFormData.channels.length === 0}
              >
                <Send className="w-4 h-4 mr-2" />
                Enviar a Campañas
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

