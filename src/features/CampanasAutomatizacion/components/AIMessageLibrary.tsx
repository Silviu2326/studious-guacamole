import React, { useState } from 'react';
import {
  Sparkles,
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
  Filter,
  Target,
  TrendingUp,
  Heart,
  RefreshCw,
  Settings,
} from 'lucide-react';
import { Card, Button, Badge } from '../../../components/componentsreutilizables';
import { ds } from '../../adherencia/ui/ds';
import { AIMessageLibrary as AIMessageLibraryType, AIMessageTemplate, MessageObjective } from '../types';

interface AIMessageLibraryProps {
  library?: AIMessageLibraryType;
  loading?: boolean;
  className?: string;
  onTemplateCreate?: () => void;
  onTemplateEdit?: (template: AIMessageTemplate) => void;
  onTemplateDelete?: (templateId: string) => void;
  onTemplateUse?: (template: AIMessageTemplate) => void;
  onTemplateSendBulk?: (template: AIMessageTemplate) => void;
  onTemplateToggleFavorite?: (templateId: string, isFavorite: boolean) => void;
  onGenerateWithAI?: (objective: MessageObjective) => void;
  onSyncWithProfile?: () => void;
  onSettingsEdit?: () => void;
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

const objectiveLabels: Record<MessageObjective, string> = {
  venta: 'Venta',
  inspiracion: 'Inspiración',
  seguimiento: 'Seguimiento',
};

const objectiveIcons: Record<MessageObjective, React.ReactNode> = {
  venta: <TrendingUp className="w-4 h-4" />,
  inspiracion: <Heart className="w-4 h-4" />,
  seguimiento: <Target className="w-4 h-4" />,
};

const objectiveColors: Record<MessageObjective, string> = {
  venta: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
  inspiracion: 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-300',
  seguimiento: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
};

export const AIMessageLibrary: React.FC<AIMessageLibraryProps> = ({
  library,
  loading = false,
  className = '',
  onTemplateCreate,
  onTemplateEdit,
  onTemplateDelete,
  onTemplateUse,
  onTemplateSendBulk,
  onTemplateToggleFavorite,
  onGenerateWithAI,
  onSyncWithProfile,
  onSettingsEdit,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedObjective, setSelectedObjective] = useState<MessageObjective | 'all'>('all');
  const [selectedChannel, setSelectedChannel] = useState<string>('all');

  if (loading) {
    return (
      <Card className={className}>
        <div className={`${ds.shimmer} h-64 rounded-2xl`} />
      </Card>
    );
  }

  if (!library) {
    return (
      <Card className={className} padding="lg">
        <div className="text-center py-12">
          <Sparkles className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
          <p className={`${ds.typography.body} ${ds.color.textSecondary} ${ds.color.textSecondaryDark}`}>
            No hay datos de biblioteca de mensajes IA disponibles
          </p>
        </div>
      </Card>
    );
  }

  const favoriteTemplates = library.templates.filter((t) => t.isFavorite);
  const totalUsage = library.templates.reduce((sum, t) => sum + t.usageCount, 0);

  // Filtrar plantillas
  const filteredTemplates = library.templates.filter((template) => {
    const matchesSearch =
      searchQuery === '' ||
      template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.messageTemplate.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesObjective = selectedObjective === 'all' || template.objective === selectedObjective;
    const matchesChannel = selectedChannel === 'all' || template.channel === selectedChannel;
    return matchesSearch && matchesObjective && matchesChannel;
  });

  const objectives: (MessageObjective | 'all')[] = ['all', 'venta', 'inspiracion', 'seguimiento'];
  const channels = ['all', 'whatsapp', 'sms', 'email', 'push', 'in-app'];

  return (
    <Card className={className} padding="lg">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-xl bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/40 dark:to-pink-900/40">
                <Sparkles className="w-5 h-5 text-purple-600 dark:text-purple-300" />
              </div>
              <h2 className={`${ds.typography.h2} ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
                Biblioteca de Mensajes IA
              </h2>
            </div>
            <p className={`${ds.typography.bodySmall} ${ds.color.textSecondary} ${ds.color.textSecondaryDark}`}>
              Mensajes generados con IA usando tu tono personal, segmentados por objetivo (venta, inspiración, seguimiento)
            </p>
            {library.trainerTone && (
              <div className="mt-2 flex items-center gap-2">
                <Badge variant="secondary" size="sm">
                  Tono: {library.trainerTone}
                </Badge>
                {library.lastSyncedWithProfile && (
                  <span className={`${ds.typography.caption} ${ds.color.textSecondary} ${ds.color.textSecondaryDark}`}>
                    Sincronizado: {new Date(library.lastSyncedWithProfile).toLocaleDateString('es-ES')}
                  </span>
                )}
              </div>
            )}
          </div>
          <div className="flex items-center gap-2">
            {onSyncWithProfile && (
              <Button
                size="sm"
                variant="ghost"
                leftIcon={<RefreshCw size={16} />}
                onClick={onSyncWithProfile}
                title="Sincronizar con perfil estratégico"
              >
                Sincronizar tono
              </Button>
            )}
            {onSettingsEdit && (
              <Button size="sm" variant="ghost" leftIcon={<Settings size={16} />} onClick={onSettingsEdit}>
                Configuración
              </Button>
            )}
            <Button size="sm" leftIcon={<Plus size={16} />} onClick={onTemplateCreate}>
              Nueva plantilla
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50">
            <div className="flex items-center gap-2 mb-1">
              <Sparkles className="w-4 h-4 text-slate-500" />
              <span className={`${ds.typography.caption} ${ds.color.textSecondary} ${ds.color.textSecondaryDark}`}>
                Total plantillas IA
              </span>
            </div>
            <p className={`${ds.typography.h3} ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
              {library.totalTemplates}
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
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50">
            <div className="flex items-center gap-2 mb-1">
              <Target className="w-4 h-4 text-slate-500" />
              <span className={`${ds.typography.caption} ${ds.color.textSecondary} ${ds.color.textSecondaryDark}`}>
                Por objetivo
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" size="sm">
                V: {library.byObjective.venta}
              </Badge>
              <Badge variant="outline" size="sm">
                I: {library.byObjective.inspiracion}
              </Badge>
              <Badge variant="outline" size="sm">
                S: {library.byObjective.seguimiento}
              </Badge>
            </div>
          </div>
        </div>

        {/* Quick Generate by Objective */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {(['venta', 'inspiracion', 'seguimiento'] as MessageObjective[]).map((objective) => (
            <Button
              key={objective}
              variant="outline"
              className="flex items-center justify-center gap-2 h-auto py-4"
              onClick={() => onGenerateWithAI?.(objective)}
            >
              <div className="flex items-center gap-2">
                {objectiveIcons[objective]}
                <div className="text-left">
                  <div className="font-semibold">Generar con IA</div>
                  <div className="text-xs text-slate-500">{objectiveLabels[objective]}</div>
                </div>
              </div>
              <Sparkles className="w-4 h-4 ml-auto" />
            </Button>
          ))}
        </div>

        {/* Filtros y búsqueda */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar mensajes IA..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full pl-10 pr-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 ${ds.color.textPrimary} ${ds.color.textPrimaryDark} focus:outline-none focus:ring-2 focus:ring-purple-500`}
            />
          </div>
          <div className="flex gap-2">
            <select
              value={selectedObjective}
              onChange={(e) => setSelectedObjective(e.target.value as MessageObjective | 'all')}
              className={`px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 ${ds.color.textPrimary} ${ds.color.textPrimaryDark} focus:outline-none focus:ring-2 focus:ring-purple-500`}
            >
              {objectives.map((obj) => (
                <option key={obj} value={obj}>
                  {obj === 'all' ? 'Todos los objetivos' : objectiveLabels[obj]}
                </option>
              ))}
            </select>
            <select
              value={selectedChannel}
              onChange={(e) => setSelectedChannel(e.target.value)}
              className={`px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 ${ds.color.textPrimary} ${ds.color.textPrimaryDark} focus:outline-none focus:ring-2 focus:ring-purple-500`}
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
              <Sparkles className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
              <p className={`${ds.typography.body} ${ds.color.textSecondary} ${ds.color.textSecondaryDark} mb-4`}>
                {searchQuery || selectedObjective !== 'all' || selectedChannel !== 'all'
                  ? 'No se encontraron mensajes con los filtros seleccionados'
                  : 'No hay mensajes IA creados'}
              </p>
              {!searchQuery && selectedObjective === 'all' && selectedChannel === 'all' && (
                <div className="flex items-center justify-center gap-2">
                  <Button size="sm" leftIcon={<Plus size={16} />} onClick={onTemplateCreate}>
                    Crear primera plantilla
                  </Button>
                  {onGenerateWithAI && (
                    <Button size="sm" variant="outline" leftIcon={<Sparkles size={16} />} onClick={() => onGenerateWithAI('venta')}>
                      Generar con IA
                    </Button>
                  )}
                </div>
              )}
            </div>
          ) : (
            filteredTemplates.map((template) => (
              <div
                key={template.id}
                className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2 flex-wrap">
                      <h3 className={`${ds.typography.h3} ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
                        {template.name}
                      </h3>
                      <Badge className={objectiveColors[template.objective]}>
                        <span className="flex items-center gap-1">
                          {objectiveIcons[template.objective]}
                          {template.objectiveLabel}
                        </span>
                      </Badge>
                      <Badge className={channelColors[template.channel]}>
                        <span className="flex items-center gap-1">
                          {channelIcons[template.channel]}
                          {template.channel.toUpperCase()}
                        </span>
                      </Badge>
                      {template.aiGenerated && (
                        <Badge variant="secondary" size="sm">
                          <Sparkles className="w-3 h-3 mr-1" />
                          IA
                        </Badge>
                      )}
                      {template.isFavorite && (
                        <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                      )}
                    </div>
                    <p className={`${ds.typography.bodySmall} ${ds.color.textSecondary} ${ds.color.textSecondaryDark} mb-2`}>
                      {template.description}
                    </p>
                    {template.tone && (
                      <Badge variant="outline" size="sm" className="mb-2">
                        Tono: {template.tone}
                      </Badge>
                    )}
                    <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-900/50 mb-3">
                      <p className={`${ds.typography.bodySmall} ${ds.color.textPrimary} ${ds.color.textPrimaryDark} whitespace-pre-wrap`}>
                        {template.messageTemplate}
                      </p>
                    </div>
                    {template.variables.length > 0 && (
                      <div className="flex flex-wrap items-center gap-2 mb-3">
                        <span className={`${ds.typography.caption} ${ds.color.textSecondary} ${ds.color.textSecondaryDark}`}>
                          Variables:
                        </span>
                        {template.variables.map((variable) => (
                          <Badge key={variable} variant="outline" size="sm">
                            {variable}
                          </Badge>
                        ))}
                      </div>
                    )}
                    <div className="flex items-center gap-4 text-sm text-slate-600 dark:text-slate-400 flex-wrap">
                      <span>Usada {template.usageCount} veces</span>
                      {template.lastUsed && (
                        <span>Última vez: {new Date(template.lastUsed).toLocaleDateString('es-ES')}</span>
                      )}
                      {template.successRate !== undefined && (
                        <span className="text-green-600 dark:text-green-400">
                          Éxito: {template.successRate.toFixed(1)}%
                        </span>
                      )}
                      {template.averageResponseRate !== undefined && (
                        <span className="text-blue-600 dark:text-blue-400">
                          Respuesta: {template.averageResponseRate.toFixed(1)}%
                        </span>
                      )}
                    </div>
                    {template.tags && template.tags.length > 0 && (
                      <div className="flex flex-wrap items-center gap-2 mt-2">
                        {template.tags.map((tag) => (
                          <Badge key={tag} variant="outline" size="sm">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2 pt-3 border-t border-slate-200 dark:border-slate-700 flex-wrap">
                  <Button
                    size="sm"
                    variant="ghost"
                    leftIcon={<Copy size={14} />}
                    onClick={() => onTemplateUse?.(template)}
                  >
                    Usar
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    leftIcon={<Send size={14} />}
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
                    {template.isFavorite ? 'Quitar favorito' : 'Favorito'}
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
    </Card>
  );
};

