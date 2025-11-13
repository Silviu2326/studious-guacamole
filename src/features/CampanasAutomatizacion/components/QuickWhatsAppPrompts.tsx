import React, { useState } from 'react';
import {
  MessageSquare,
  Mic,
  Plus,
  Edit,
  Trash2,
  Star,
  StarOff,
  Copy,
  Send,
  Search,
  Filter,
  Clock,
  Heart,
  TrendingUp,
  Bell,
  Gift,
  CheckCircle,
  Settings,
  Play,
  Volume2,
} from 'lucide-react';
import { Card, Button, Badge, Modal } from '../../../components/componentsreutilizables';
import { ds } from '../../adherencia/ui/ds';
import {
  QuickWhatsAppPromptsLibrary as QuickWhatsAppPromptsLibraryType,
  QuickWhatsAppPrompt,
  WhatsAppPromptCategory,
  VoiceNoteSuggestion,
} from '../types';

interface QuickWhatsAppPromptsProps {
  library?: QuickWhatsAppPromptsLibraryType;
  loading?: boolean;
  className?: string;
  onPromptCreate?: () => void;
  onPromptEdit?: (prompt: QuickWhatsAppPrompt) => void;
  onPromptDelete?: (promptId: string) => void;
  onPromptUse?: (prompt: QuickWhatsAppPrompt) => void;
  onPromptCopy?: (prompt: QuickWhatsAppPrompt) => void;
  onPromptToggleFavorite?: (promptId: string, isFavorite: boolean) => void;
  onVoiceNoteGenerate?: (prompt: QuickWhatsAppPrompt) => void;
  onSettingsEdit?: () => void;
}

const categoryIcons: Record<WhatsAppPromptCategory, React.ReactNode> = {
  'follow-up': <MessageSquare className="w-4 h-4" />,
  motivation: <TrendingUp className="w-4 h-4" />,
  reminder: <Bell className="w-4 h-4" />,
  celebration: <Gift className="w-4 h-4" />,
  'check-in': <CheckCircle className="w-4 h-4" />,
  offer: <Heart className="w-4 h-4" />,
  custom: <MessageSquare className="w-4 h-4" />,
};

const categoryLabels: Record<WhatsAppPromptCategory, string> = {
  'follow-up': 'Seguimiento',
  motivation: 'Motivación',
  reminder: 'Recordatorio',
  celebration: 'Celebración',
  'check-in': 'Check-in',
  offer: 'Oferta',
  custom: 'Personalizado',
};

const categoryColors: Record<WhatsAppPromptCategory, string> = {
  'follow-up': 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
  motivation: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300',
  reminder: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300',
  celebration: 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-300',
  'check-in': 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
  offer: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
  custom: 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-300',
};

const toneColors: Record<string, string> = {
  friendly: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
  professional: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
  casual: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300',
  motivational: 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-300',
  empathetic: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
};

export const QuickWhatsAppPrompts: React.FC<QuickWhatsAppPromptsProps> = ({
  library,
  loading = false,
  className = '',
  onPromptCreate,
  onPromptEdit,
  onPromptDelete,
  onPromptUse,
  onPromptCopy,
  onPromptToggleFavorite,
  onVoiceNoteGenerate,
  onSettingsEdit,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<WhatsAppPromptCategory | 'all'>('all');
  const [activeTab, setActiveTab] = useState<'all' | 'favorites' | 'recent'>('all');
  const [selectedPrompt, setSelectedPrompt] = useState<QuickWhatsAppPrompt | null>(null);
  const [showVoiceNoteModal, setShowVoiceNoteModal] = useState(false);

  const prompts = library?.prompts || [];
  const favoritePrompts = library?.favoritePrompts || [];
  const recentPrompts = library?.recentPrompts || [];
  const voiceNoteSuggestions = library?.voiceNoteSuggestions || [];

  const filteredPrompts = prompts.filter((prompt) => {
    const matchesSearch = searchQuery === '' || prompt.name.toLowerCase().includes(searchQuery.toLowerCase()) || prompt.messageTemplate.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || prompt.category === selectedCategory;
    const matchesTab =
      activeTab === 'all' ||
      (activeTab === 'favorites' && prompt.isFavorite) ||
      (activeTab === 'recent' && recentPrompts.some((rp) => rp.id === prompt.id));

    return matchesSearch && matchesCategory && matchesTab;
  });

  const handleCopyPrompt = (prompt: QuickWhatsAppPrompt) => {
    navigator.clipboard.writeText(prompt.messageTemplate);
    onPromptCopy?.(prompt);
  };

  const handleShowVoiceNote = (prompt: QuickWhatsAppPrompt) => {
    setSelectedPrompt(prompt);
    setShowVoiceNoteModal(true);
  };

  if (loading) {
    return (
      <Card className={className}>
        <div className="p-6 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500 mx-auto"></div>
          <p className={`${ds.typography.body} ${ds.color.textMuted} ${ds.color.textMutedDark} mt-4`}>
            Cargando prompts de WhatsApp...
          </p>
        </div>
      </Card>
    );
  }

  return (
    <>
      <Card className={className}>
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30">
                <MessageSquare className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <h2 className={`${ds.typography.h2} ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
                  Prompts Rápidos para WhatsApp
                </h2>
                <p className={`${ds.typography.bodySmall} ${ds.color.textSecondary} ${ds.color.textSecondaryDark}`}>
                  Mensajes rápidos con sugerencias de audio/nota de voz para humanizar tus interacciones
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" leftIcon={<Settings size={16} />} onClick={onSettingsEdit}>
                Configuración
              </Button>
              <Button variant="primary" size="sm" leftIcon={<Plus size={16} />} onClick={onPromptCreate}>
                Nuevo Prompt
              </Button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex items-center gap-2 mb-4 p-1 rounded-xl bg-slate-100 dark:bg-slate-800">
            <button
              onClick={() => setActiveTab('all')}
              className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'all'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Todos ({prompts.length})
            </button>
            <button
              onClick={() => setActiveTab('favorites')}
              className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'favorites'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Star className="w-4 h-4 inline mr-1" />
              Favoritos ({favoritePrompts.length})
            </button>
            <button
              onClick={() => setActiveTab('recent')}
              className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'recent'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Clock className="w-4 h-4 inline mr-1" />
              Recientes ({recentPrompts.length})
            </button>
          </div>

          {/* Filters */}
          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Buscar prompts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-slate-400" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value as WhatsAppPromptCategory | 'all')}
                className="px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="all">Todas las categorías</option>
                {Object.entries(categoryLabels).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Prompts List */}
          {filteredPrompts.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-200 dark:border-slate-700 p-12 text-center">
              <MessageSquare className="w-12 h-12 text-slate-400 mx-auto mb-4" />
              <p className={`${ds.typography.body} ${ds.color.textMuted} ${ds.color.textMutedDark} mb-4`}>
                No hay prompts disponibles
              </p>
              <Button variant="primary" size="sm" leftIcon={<Plus size={16} />} onClick={onPromptCreate}>
                Crear primer prompt
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredPrompts.map((prompt) => (
                <div
                  key={prompt.id}
                  className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900/50 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <div className={`p-1.5 rounded-lg ${categoryColors[prompt.category]}`}>
                          {categoryIcons[prompt.category]}
                        </div>
                        <h3 className={`${ds.typography.h4} ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
                          {prompt.name}
                        </h3>
                        <Badge className={categoryColors[prompt.category]} size="sm">
                          {prompt.categoryLabel}
                        </Badge>
                        {prompt.isFavorite && <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />}
                      </div>
                      <p className={`${ds.typography.bodySmall} ${ds.color.textSecondary} ${ds.color.textSecondaryDark} mb-2`}>
                        {prompt.whenToUse}
                      </p>
                      <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 mb-2">
                        <p className={`${ds.typography.bodySmall} ${ds.color.textPrimary} ${ds.color.textPrimaryDark} whitespace-pre-wrap`}>
                          {prompt.messageTemplate}
                        </p>
                      </div>
                      {prompt.voiceNoteSuggestion && (
                        <div className="flex items-center gap-2 p-2 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 mb-2">
                          <Mic className="w-4 h-4 text-green-600 dark:text-green-400" />
                          <div className="flex-1">
                            <p className={`${ds.typography.bodySmall} font-medium ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
                              Nota de voz sugerida: {prompt.voiceNoteSuggestion.title}
                            </p>
                            <p className={`${ds.typography.caption} ${ds.color.textSecondary} ${ds.color.textSecondaryDark}`}>
                              {prompt.voiceNoteSuggestion.description}
                            </p>
                            {prompt.suggestedAudioDuration && (
                              <p className={`${ds.typography.caption} ${ds.color.textMuted} ${ds.color.textMutedDark} mt-1`}>
                                Duración sugerida: {prompt.suggestedAudioDuration}s
                              </p>
                            )}
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            leftIcon={<Play size={14} />}
                            onClick={() => handleShowVoiceNote(prompt)}
                          >
                            Ver script
                          </Button>
                        </div>
                      )}
                      {prompt.personalizationTips && prompt.personalizationTips.length > 0 && (
                        <div className="mt-2">
                          <p className={`${ds.typography.caption} font-semibold ${ds.color.textSecondary} ${ds.color.textSecondaryDark} mb-1`}>
                            Tips de personalización:
                          </p>
                          <ul className="list-disc list-inside space-y-1">
                            {prompt.personalizationTips.map((tip, index) => (
                              <li key={index} className={`${ds.typography.caption} ${ds.color.textMuted} ${ds.color.textMutedDark}`}>
                                {tip}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      <div className="flex items-center gap-4 mt-3 text-xs text-slate-500 dark:text-slate-400">
                        <span className="flex items-center gap-1">
                          <MessageSquare className="w-3 h-3" />
                          Usado {prompt.usageCount} veces
                        </span>
                        {prompt.lastUsed && (
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {new Date(prompt.lastUsed).toLocaleDateString('es-ES')}
                          </span>
                        )}
                        {prompt.tags && prompt.tags.length > 0 && (
                          <div className="flex items-center gap-1">
                            {prompt.tags.map((tag) => (
                              <Badge key={tag} variant="gray" size="xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2 ml-4">
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          leftIcon={<Copy size={14} />}
                          onClick={() => handleCopyPrompt(prompt)}
                        >
                          Copiar
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          leftIcon={<Send size={14} />}
                          onClick={() => onPromptUse?.(prompt)}
                        >
                          Usar
                        </Button>
                      </div>
                      <div className="flex items-center gap-1">
                        {prompt.voiceNoteSuggestion && (
                          <Button
                            variant="ghost"
                            size="sm"
                            leftIcon={<Mic size={14} />}
                            onClick={() => onVoiceNoteGenerate?.(prompt)}
                          >
                            Audio
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          leftIcon={prompt.isFavorite ? <StarOff size={14} /> : <Star size={14} />}
                          onClick={() => onPromptToggleFavorite?.(prompt.id, !prompt.isFavorite)}
                        >
                          {prompt.isFavorite ? 'Quitar' : 'Favorito'}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          leftIcon={<Edit size={14} />}
                          onClick={() => onPromptEdit?.(prompt)}
                        >
                          Editar
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          leftIcon={<Trash2 size={14} />}
                          onClick={() => onPromptDelete?.(prompt.id)}
                        >
                          Eliminar
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </Card>

      {/* Voice Note Modal */}
      {showVoiceNoteModal && selectedPrompt?.voiceNoteSuggestion && (
        <Modal
          isOpen={showVoiceNoteModal}
          onClose={() => {
            setShowVoiceNoteModal(false);
            setSelectedPrompt(null);
          }}
          title="Script de Nota de Voz"
        >
          <div className="space-y-4">
            <div>
              <h3 className={`${ds.typography.h4} ${ds.color.textPrimary} ${ds.color.textPrimaryDark} mb-2`}>
                {selectedPrompt.voiceNoteSuggestion.title}
              </h3>
              <p className={`${ds.typography.bodySmall} ${ds.color.textSecondary} ${ds.color.textSecondaryDark} mb-4`}>
                {selectedPrompt.voiceNoteSuggestion.description}
              </p>
            </div>
            {selectedPrompt.voiceNoteSuggestion.exampleScript && (
              <div>
                <p className={`${ds.typography.bodySmall} font-semibold ${ds.color.textPrimary} ${ds.color.textPrimaryDark} mb-2`}>
                  Ejemplo de script:
                </p>
                <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                  <p className={`${ds.typography.bodySmall} ${ds.color.textPrimary} ${ds.color.textPrimaryDark} whitespace-pre-wrap`}>
                    {selectedPrompt.voiceNoteSuggestion.exampleScript}
                  </p>
                </div>
              </div>
            )}
            {selectedPrompt.voiceNoteSuggestion.script && (
              <div>
                <p className={`${ds.typography.bodySmall} font-semibold ${ds.color.textPrimary} ${ds.color.textPrimaryDark} mb-2`}>
                  Script sugerido:
                </p>
                <div className="p-4 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
                  <p className={`${ds.typography.bodySmall} ${ds.color.textPrimary} ${ds.color.textPrimaryDark} whitespace-pre-wrap`}>
                    {selectedPrompt.voiceNoteSuggestion.script}
                  </p>
                </div>
              </div>
            )}
            <div className="flex items-center gap-2">
              <Badge className={toneColors[selectedPrompt.voiceNoteSuggestion.tone] || toneColors.friendly} size="sm">
                Tono: {selectedPrompt.voiceNoteSuggestion.tone}
              </Badge>
              {selectedPrompt.suggestedAudioDuration && (
                <Badge variant="gray" size="sm">
                  Duración: {selectedPrompt.suggestedAudioDuration}s
                </Badge>
              )}
            </div>
            <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-200 dark:border-slate-700">
              <Button variant="ghost" size="sm" onClick={() => setShowVoiceNoteModal(false)}>
                Cerrar
              </Button>
              <Button
                variant="primary"
                size="sm"
                leftIcon={<Mic size={16} />}
                onClick={() => {
                  onVoiceNoteGenerate?.(selectedPrompt);
                  setShowVoiceNoteModal(false);
                }}
              >
                Generar Audio
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
};

