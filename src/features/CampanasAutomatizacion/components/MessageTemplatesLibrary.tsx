import React, { useState } from 'react';
import {
  FileText,
  MessageSquare,
  Mail,
  Smartphone,
  Plus,
  Edit,
  Trash2,
  Star,
  StarOff,
  Copy,
  Send,
  Search,
  Users,
  Eye,
} from 'lucide-react';
import { Card, Button, Badge, Modal } from '../../../components/componentsreutilizables';
import { ds } from '../../adherencia/ui/ds';
import { MessageTemplate, MessageTemplateCategory } from '../types';

interface MessageTemplatesLibraryProps {
  templates?: MessageTemplate[];
  loading?: boolean;
  className?: string;
  onTemplateCreate?: () => void;
  onTemplateEdit?: (template: MessageTemplate) => void;
  onTemplateDelete?: (templateId: string) => void;
  onTemplateUse?: (template: MessageTemplate) => void;
  onTemplateSendBulk?: (template: MessageTemplate) => void;
  onTemplateToggleFavorite?: (templateId: string, isFavorite: boolean) => void;
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

const categoryLabels: Record<MessageTemplateCategory, string> = {
  'confirmacion-sesion': 'Confirmación Sesión',
  'recordatorio-pago': 'Recordatorio Pago',
  'felicitacion-progreso': 'Felicitación Progreso',
  'ajuste-plan': 'Ajuste Plan',
  general: 'General',
  bienvenida: 'Bienvenida',
  seguimiento: 'Seguimiento',
};

export const MessageTemplatesLibrary: React.FC<MessageTemplatesLibraryProps> = ({
  templates = [],
  loading = false,
  className = '',
  onTemplateCreate,
  onTemplateEdit,
  onTemplateDelete,
  onTemplateUse,
  onTemplateSendBulk,
  onTemplateToggleFavorite,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<MessageTemplateCategory | 'all'>('all');
  const [selectedChannel, setSelectedChannel] = useState<string>('all');
  const [selectedTemplate, setSelectedTemplate] = useState<MessageTemplate | null>(null);

  if (loading) {
    return (
      <Card className={className}>
        <div className={`${ds.shimmer} h-64 rounded-2xl`} />
      </Card>
    );
  }

  const favoriteTemplates = templates.filter((t) => t.isFavorite);
  const totalUsage = templates.reduce((sum, t) => sum + t.usageCount, 0);

  // Filtrar plantillas
  const filteredTemplates = templates.filter((template) => {
    const matchesSearch =
      searchQuery === '' ||
      template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.messageTemplate.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
    const matchesChannel = selectedChannel === 'all' || template.channel === selectedChannel;
    return matchesSearch && matchesCategory && matchesChannel;
  });

  const categories: (MessageTemplateCategory | 'all')[] = ['all', ...Object.keys(categoryLabels) as MessageTemplateCategory[]];
  const channels = ['all', 'whatsapp', 'sms', 'email', 'push', 'in-app'];

  return (
    <Card className={className} padding="lg">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-xl bg-indigo-100 dark:bg-indigo-900/40">
                <FileText className="w-5 h-5 text-indigo-600 dark:text-indigo-300" />
              </div>
              <h2 className={`${ds.typography.h2} ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
                Biblioteca de Plantillas de Mensajes
              </h2>
            </div>
            <p className={`${ds.typography.bodySmall} ${ds.color.textSecondary} ${ds.color.textSecondaryDark}`}>
              Plantillas personalizables con variables que puedes usar desde cualquier conversación o enviar en masa a grupos de clientes
            </p>
          </div>
          <Button size="sm" leftIcon={<Plus size={16} />} onClick={onTemplateCreate}>
            Nueva plantilla
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50">
            <div className="flex items-center gap-2 mb-1">
              <FileText className="w-4 h-4 text-slate-500" />
              <span className={`${ds.typography.caption} ${ds.color.textSecondary} ${ds.color.textSecondaryDark}`}>
                Total plantillas
              </span>
            </div>
            <p className={`${ds.typography.h3} ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
              {templates.length}
            </p>
          </div>
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50">
            <div className="flex items-center gap-2 mb-1">
              <Star className="w-4 h-4 text-slate-500" />
              <span className={`${ds.typography.caption} ${ds.color.textSecondary} ${ds.color.textSecondaryDark}`}>
                Favoritas
              </span>
            </div>
            <p className={`${ds.typography.h3} ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
              {favoriteTemplates.length}
            </p>
          </div>
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50">
            <div className="flex items-center gap-2 mb-1">
              <Send className="w-4 h-4 text-slate-500" />
              <span className={`${ds.typography.caption} ${ds.color.textSecondary} ${ds.color.textSecondaryDark}`}>
                Total usos
              </span>
            </div>
            <p className={`${ds.typography.h3} ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
              {totalUsage}
            </p>
          </div>
        </div>

        {/* Filtros y búsqueda */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar plantillas..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full pl-10 pr-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 ${ds.color.textPrimary} ${ds.color.textPrimaryDark} focus:outline-none focus:ring-2 focus:ring-indigo-500`}
            />
          </div>
          <div className="flex gap-2">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value as MessageTemplateCategory | 'all')}
              className={`px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 ${ds.color.textPrimary} ${ds.color.textPrimaryDark} focus:outline-none focus:ring-2 focus:ring-indigo-500`}
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat === 'all' ? 'Todas las categorías' : categoryLabels[cat]}
                </option>
              ))}
            </select>
            <select
              value={selectedChannel}
              onChange={(e) => setSelectedChannel(e.target.value)}
              className={`px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 ${ds.color.textPrimary} ${ds.color.textPrimaryDark} focus:outline-none focus:ring-2 focus:ring-indigo-500`}
            >
              {channels.map((ch) => (
                <option key={ch} value={ch}>
                  {ch === 'all' ? 'Todos los canales' : ch.toUpperCase()}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Lista de plantillas */}
        <div className="space-y-4">
          {filteredTemplates.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
              <p className={`${ds.typography.body} ${ds.color.textSecondary} ${ds.color.textSecondaryDark} mb-4`}>
                {searchQuery || selectedCategory !== 'all' || selectedChannel !== 'all'
                  ? 'No se encontraron plantillas con los filtros seleccionados'
                  : 'No hay plantillas creadas'}
              </p>
              {!searchQuery && selectedCategory === 'all' && selectedChannel === 'all' && (
                <Button size="sm" leftIcon={<Plus size={16} />} onClick={onTemplateCreate}>
                  Crear primera plantilla
                </Button>
              )}
            </div>
          ) : (
            filteredTemplates.map((template) => (
              <div
                key={template.id}
                className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => setSelectedTemplate(template)}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className={`${ds.typography.h3} ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
                        {template.name}
                      </h3>
                      <Badge className={channelColors[template.channel]}>
                        <span className="flex items-center gap-1">
                          {channelIcons[template.channel]}
                          {template.channel.toUpperCase()}
                        </span>
                      </Badge>
                      <Badge variant="secondary">{categoryLabels[template.category]}</Badge>
                      {template.isFavorite && (
                        <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                      )}
                    </div>
                    <p className={`${ds.typography.bodySmall} ${ds.color.textSecondary} ${ds.color.textSecondaryDark} mb-3`}>
                      {template.description}
                    </p>
                    <div className="flex items-center gap-4 text-sm text-slate-600 dark:text-slate-400 mb-2">
                      <span>Usada {template.usageCount} veces</span>
                      {template.lastUsed && <span>Última vez: {new Date(template.lastUsed).toLocaleDateString('es-ES')}</span>}
                      {template.variables.length > 0 && (
                        <span className="text-slate-500 dark:text-slate-400">
                          {template.variables.length} variable{template.variables.length > 1 ? 's' : ''}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-indigo-600 dark:text-indigo-400">
                      <Eye className="w-3 h-3" />
                      <span>Haz clic para ver el contenido completo</span>
                    </div>
                  </div>
                </div>
                <div 
                  className="flex items-center gap-2 pt-3 border-t border-slate-200 dark:border-slate-700"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Button
                    size="sm"
                    variant="ghost"
                    leftIcon={<Copy size={14} />}
                    onClick={() => onTemplateUse?.(template)}
                  >
                    Usar en conversación
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    leftIcon={<Users size={14} />}
                    onClick={() => onTemplateSendBulk?.(template)}
                  >
                    Enviar en masa
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    leftIcon={template.isFavorite ? <StarOff size={14} /> : <Star size={14} />}
                    onClick={() => onTemplateToggleFavorite?.(template.id, !template.isFavorite)}
                  >
                    {template.isFavorite ? 'Quitar favorito' : 'Marcar favorito'}
                  </Button>
                  <div className="flex-1" />
                  <Button
                    size="sm"
                    variant="ghost"
                    leftIcon={<Edit size={14} />}
                    onClick={() => onTemplateEdit?.(template)}
                  >
                    Editar
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    leftIcon={<Trash2 size={14} />}
                    onClick={() => onTemplateDelete?.(template.id)}
                    className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                  >
                    Eliminar
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Modal de detalle de plantilla */}
      <Modal
        isOpen={selectedTemplate !== null}
        onClose={() => setSelectedTemplate(null)}
        title={selectedTemplate ? selectedTemplate.name : ''}
        size="lg"
        footer={
          selectedTemplate ? (
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="ghost"
                  leftIcon={<Copy size={14} />}
                  onClick={() => {
                    onTemplateUse?.(selectedTemplate);
                    setSelectedTemplate(null);
                  }}
                >
                  Usar en conversación
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  leftIcon={<Users size={14} />}
                  onClick={() => {
                    onTemplateSendBulk?.(selectedTemplate);
                    setSelectedTemplate(null);
                  }}
                >
                  Enviar en masa
                </Button>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => setSelectedTemplate(null)}
                >
                  Cerrar
                </Button>
                <Button
                  size="sm"
                  leftIcon={<Edit size={14} />}
                  onClick={() => {
                    onTemplateEdit?.(selectedTemplate);
                    setSelectedTemplate(null);
                  }}
                >
                  Editar
                </Button>
              </div>
            </div>
          ) : null
        }
      >
        {selectedTemplate && (
          <div className="space-y-6">
            {/* Información básica */}
            <div className="flex items-center gap-3 flex-wrap">
              <Badge className={channelColors[selectedTemplate.channel]}>
                <span className="flex items-center gap-1">
                  {channelIcons[selectedTemplate.channel]}
                  {selectedTemplate.channel.toUpperCase()}
                </span>
              </Badge>
              <Badge variant="secondary">{categoryLabels[selectedTemplate.category]}</Badge>
              {selectedTemplate.isFavorite && (
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                  <span className="text-sm text-slate-600 dark:text-slate-400">Favorita</span>
                </div>
              )}
            </div>

            {/* Descripción */}
            {selectedTemplate.description && (
              <div>
                <h4 className={`${ds.typography.bodySmall} ${ds.color.textSecondary} ${ds.color.textSecondaryDark} mb-2 font-semibold`}>
                  Descripción
                </h4>
                <p className={`${ds.typography.body} ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
                  {selectedTemplate.description}
                </p>
              </div>
            )}

            {/* Contenido completo del mensaje */}
            <div>
              <h4 className={`${ds.typography.bodySmall} ${ds.color.textSecondary} ${ds.color.textSecondaryDark} mb-2 font-semibold`}>
                Contenido del mensaje
              </h4>
              <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700">
                <p className={`${ds.typography.body} ${ds.color.textPrimary} ${ds.color.textPrimaryDark} whitespace-pre-wrap`}>
                  {selectedTemplate.messageTemplate}
                </p>
              </div>
            </div>

            {/* Variables disponibles */}
            {selectedTemplate.variables.length > 0 && (
              <div>
                <h4 className={`${ds.typography.bodySmall} ${ds.color.textSecondary} ${ds.color.textSecondaryDark} mb-2 font-semibold`}>
                  Variables disponibles
                </h4>
                <div className="flex flex-wrap gap-2">
                  {selectedTemplate.variables.map((variable) => (
                    <Badge key={variable} variant="outline" size="sm" className="font-mono">
                      {variable}
                    </Badge>
                  ))}
                </div>
                <p className={`${ds.typography.caption} ${ds.color.textSecondary} ${ds.color.textSecondaryDark} mt-2`}>
                  Puedes usar estas variables en el mensaje y se reemplazarán automáticamente con los valores correspondientes.
                </p>
              </div>
            )}

            {/* Estadísticas de uso */}
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-200 dark:border-slate-700">
              <div>
                <span className={`${ds.typography.caption} ${ds.color.textSecondary} ${ds.color.textSecondaryDark}`}>
                  Veces usada
                </span>
                <p className={`${ds.typography.h3} ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
                  {selectedTemplate.usageCount}
                </p>
              </div>
              {selectedTemplate.lastUsed && (
                <div>
                  <span className={`${ds.typography.caption} ${ds.color.textSecondary} ${ds.color.textSecondaryDark}`}>
                    Última vez usada
                  </span>
                  <p className={`${ds.typography.body} ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
                    {new Date(selectedTemplate.lastUsed).toLocaleDateString('es-ES', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </Modal>
    </Card>
  );
};

