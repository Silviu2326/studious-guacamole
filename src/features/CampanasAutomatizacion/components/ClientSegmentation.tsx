import React, { useState } from 'react';
import {
  Users,
  Filter,
  Plus,
  Edit,
  Trash2,
  Send,
  Search,
  Target,
  MessageSquare,
  Mail,
  Smartphone,
  Calendar,
  CheckCircle2,
  XCircle,
  Clock,
  TrendingUp,
  Eye,
  Reply,
} from 'lucide-react';
import { Card, Button, Badge, Modal } from '../../../components/componentsreutilizables';
import { ds } from '../../adherencia/ui/ds';
import { ClientSegment, BulkMessage, SegmentCriteria, MessagingChannel, CampaignStatus } from '../types';

interface ClientSegmentationProps {
  segments?: ClientSegment[];
  bulkMessages?: BulkMessage[];
  loading?: boolean;
  className?: string;
  onSegmentCreate?: () => void;
  onSegmentEdit?: (segment: ClientSegment) => void;
  onSegmentDelete?: (segmentId: string) => void;
  onSegmentRefresh?: (segmentId: string) => void;
  onBulkMessageCreate?: (segmentId?: string) => void;
  onBulkMessageEdit?: (message: BulkMessage) => void;
  onBulkMessageDelete?: (messageId: string) => void;
  onBulkMessageSend?: (messageId: string) => void;
}

const channelIcons = {
  whatsapp: <MessageSquare className="w-4 h-4" />,
  sms: <Smartphone className="w-4 h-4" />,
  email: <Mail className="w-4 h-4" />,
  push: <MessageSquare className="w-4 h-4" />,
  'in-app': <MessageSquare className="w-4 h-4" />,
};

const channelColors = {
  whatsapp: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
  sms: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
  email: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
  push: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300',
  'in-app': 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300',
};

const statusColors: Record<CampaignStatus, string> = {
  draft: 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-300',
  scheduled: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
  running: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
  paused: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300',
  completed: 'bg-slate-100 text-slate-700 dark:bg-slate-900/30 dark:text-slate-300',
};

const statusLabels: Record<CampaignStatus, string> = {
  draft: 'Borrador',
  scheduled: 'Programado',
  running: 'Enviando',
  paused: 'Pausado',
  completed: 'Completado',
};

export const ClientSegmentation: React.FC<ClientSegmentationProps> = ({
  segments = [],
  bulkMessages = [],
  loading = false,
  className = '',
  onSegmentCreate,
  onSegmentEdit,
  onSegmentDelete,
  onSegmentRefresh,
  onBulkMessageCreate,
  onBulkMessageEdit,
  onBulkMessageDelete,
  onBulkMessageSend,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'segments' | 'messages'>('segments');
  const [selectedSegment, setSelectedSegment] = useState<string | null>(null);

  if (loading) {
    return (
      <Card className={className}>
        <div className={`${ds.shimmer} h-64 rounded-2xl`} />
      </Card>
    );
  }

  const filteredSegments = segments.filter(
    (segment) =>
      searchQuery === '' ||
      segment.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      segment.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredMessages = bulkMessages.filter(
    (message) =>
      searchQuery === '' ||
      message.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      message.segmentName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderCriteria = (criteria: SegmentCriteria[]) => {
    return (
      <div className="flex flex-wrap gap-2">
        {criteria.map((criterion, idx) => (
          <Badge key={idx} variant="gray" size="sm">
            {criterion.label}
          </Badge>
        ))}
      </div>
    );
  };

  return (
    <Card className={className}>
      <div className="flex items-start justify-between mb-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-100 to-purple-200 flex items-center justify-center">
              <Users className="w-5 h-5 text-indigo-600" />
            </span>
            <h2 className={`${ds.typography.h2} ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
              Segmentación de Clientes
            </h2>
          </div>
          <p className={`${ds.typography.bodySmall} ${ds.color.textSecondary} ${ds.color.textSecondaryDark}`}>
            Crea grupos de clientes según criterios y envía mensajes masivos personalizados a cada segmento
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="blue" size="md">
            {segments.length} segmentos
          </Badge>
          <Button variant="primary" size="sm" leftIcon={<Plus size={16} />} onClick={onSegmentCreate}>
            Nuevo segmento
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 mb-6 border-b border-slate-200 dark:border-slate-700">
        <button
          onClick={() => setActiveTab('segments')}
          className={`px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === 'segments'
              ? 'text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600 dark:border-indigo-400'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
          }`}
        >
          <div className="flex items-center gap-2">
            <Filter size={16} />
            <span>Segmentos ({segments.length})</span>
          </div>
        </button>
        <button
          onClick={() => setActiveTab('messages')}
          className={`px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === 'messages'
              ? 'text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600 dark:border-indigo-400'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
          }`}
        >
          <div className="flex items-center gap-2">
            <Send size={16} />
            <span>Mensajes Masivos ({bulkMessages.length})</span>
          </div>
        </button>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar segmentos o mensajes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* Segments Tab */}
      {activeTab === 'segments' && (
        <div className="space-y-4">
          {filteredSegments.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-200 dark:border-slate-700 p-12 text-center">
              <Users className="w-12 h-12 text-slate-400 mx-auto mb-4" />
              <p className={`${ds.typography.body} ${ds.color.textMuted} ${ds.color.textMutedDark} mb-4`}>
                No hay segmentos creados aún
              </p>
              <Button variant="primary" size="sm" leftIcon={<Plus size={16} />} onClick={onSegmentCreate}>
                Crear primer segmento
              </Button>
            </div>
          ) : (
            filteredSegments.map((segment) => (
              <div
                key={segment.id}
                className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900/50 p-5 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className={`${ds.typography.h3} ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
                        {segment.name}
                      </h3>
                      {segment.isActive ? (
                        <Badge variant="green" size="sm">
                          <CheckCircle2 className="w-3 h-3 mr-1" />
                          Activo
                        </Badge>
                      ) : (
                        <Badge variant="gray" size="sm">
                          <XCircle className="w-3 h-3 mr-1" />
                          Inactivo
                        </Badge>
                      )}
                    </div>
                    <p className={`${ds.typography.bodySmall} ${ds.color.textSecondary} ${ds.color.textSecondaryDark} mb-3`}>
                      {segment.description}
                    </p>
                    {renderCriteria(segment.criteria)}
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <div className="text-right mr-4">
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-slate-400" />
                        <span className={`${ds.typography.h3} ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
                          {segment.clientCount}
                        </span>
                      </div>
                      <p className={`${ds.typography.caption} ${ds.color.textMuted} ${ds.color.textMutedDark}`}>
                        clientes
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      leftIcon={<Target size={14} />}
                      onClick={() => onBulkMessageCreate?.(segment.id)}
                    >
                      Enviar mensaje
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      leftIcon={<Edit size={14} />}
                      onClick={() => onSegmentEdit?.(segment)}
                    >
                      Editar
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      leftIcon={<Trash2 size={14} />}
                      onClick={() => onSegmentDelete?.(segment.id)}
                    >
                      Eliminar
                    </Button>
                  </div>
                </div>
                <div className="flex items-center gap-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                    <Clock className="w-4 h-4" />
                    <span>Actualizado: {new Date(segment.lastUpdated).toLocaleDateString('es-ES')}</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onSegmentRefresh?.(segment.id)}
                    className="text-sm"
                  >
                    Actualizar conteo
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Messages Tab */}
      {activeTab === 'messages' && (
        <div className="space-y-4">
          {filteredMessages.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-200 dark:border-slate-700 p-12 text-center">
              <Send className="w-12 h-12 text-slate-400 mx-auto mb-4" />
              <p className={`${ds.typography.body} ${ds.color.textMuted} ${ds.color.textMutedDark} mb-4`}>
                No hay mensajes masivos creados aún
              </p>
              <Button variant="primary" size="sm" leftIcon={<Plus size={16} />} onClick={() => onBulkMessageCreate?.()}>
                Crear mensaje masivo
              </Button>
            </div>
          ) : (
            filteredMessages.map((message) => (
              <div
                key={message.id}
                className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900/50 p-5 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className={`${ds.typography.h3} ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
                        {message.name}
                      </h3>
                      <Badge className={statusColors[message.status]} size="sm">
                        {statusLabels[message.status]}
                      </Badge>
                      <Badge className={channelColors[message.channel]} size="sm">
                        {channelIcons[message.channel]}
                        <span className="ml-1 capitalize">{message.channel}</span>
                      </Badge>
                    </div>
                    <p className={`${ds.typography.bodySmall} ${ds.color.textSecondary} ${ds.color.textSecondaryDark} mb-2`}>
                      {message.description}
                    </p>
                    <Badge variant="blue" size="sm">
                      Segmento: {message.segmentName}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      leftIcon={<Edit size={14} />}
                      onClick={() => onBulkMessageEdit?.(message)}
                    >
                      Editar
                    </Button>
                    {message.status === 'draft' || message.status === 'scheduled' ? (
                      <Button
                        variant="primary"
                        size="sm"
                        leftIcon={<Send size={14} />}
                        onClick={() => onBulkMessageSend?.(message.id)}
                      >
                        Enviar
                      </Button>
                    ) : null}
                    <Button
                      variant="ghost"
                      size="sm"
                      leftIcon={<Trash2 size={14} />}
                      onClick={() => onBulkMessageDelete?.(message.id)}
                    >
                      Eliminar
                    </Button>
                  </div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Users className="w-4 h-4 text-slate-400" />
                      <span className={`${ds.typography.caption} ${ds.color.textMuted} ${ds.color.textMutedDark}`}>
                        Destinatarios
                      </span>
                    </div>
                    <p className={`${ds.typography.h3} ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
                      {message.totalRecipients}
                    </p>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Eye className="w-4 h-4 text-slate-400" />
                      <span className={`${ds.typography.caption} ${ds.color.textMuted} ${ds.color.textMutedDark}`}>
                        Tasa apertura
                      </span>
                    </div>
                    <p className={`${ds.typography.h3} ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
                      {message.openRate.toFixed(1)}%
                    </p>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Reply className="w-4 h-4 text-slate-400" />
                      <span className={`${ds.typography.caption} ${ds.color.textMuted} ${ds.color.textMutedDark}`}>
                        Tasa respuesta
                      </span>
                    </div>
                    <p className={`${ds.typography.h3} ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
                      {message.replyRate.toFixed(1)}%
                    </p>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <TrendingUp className="w-4 h-4 text-slate-400" />
                      <span className={`${ds.typography.caption} ${ds.color.textMuted} ${ds.color.textMutedDark}`}>
                        Entrega
                      </span>
                    </div>
                    <p className={`${ds.typography.h3} ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
                      {message.deliveryRate.toFixed(1)}%
                    </p>
                  </div>
                </div>
                {message.scheduledDate && (
                  <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                      <Calendar className="w-4 h-4" />
                      <span>
                        Programado para: {new Date(message.scheduledDate).toLocaleString('es-ES')}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </Card>
  );
};

