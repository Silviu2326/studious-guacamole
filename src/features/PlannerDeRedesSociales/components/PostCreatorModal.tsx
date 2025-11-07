import React, { useState, useEffect, useRef } from 'react';
import { SocialPost, SocialProfile, PostTemplate, getPlatformIcon, SocialPlatform, getHashtagAnalysis } from '../api/social';
import { X, Upload, Calendar, Image as ImageIcon, Hash, Eye, Bold, Italic, List, Save, History, Sparkles, Type } from 'lucide-react';
import { Modal, Button, Card } from '../../../components/componentsreutilizables';

interface PostCreatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  postId?: string | null;
  onSave: (postData: Partial<SocialPost>) => void;
  profiles: SocialProfile[];
  templates?: PostTemplate[];
}

export const PostCreatorModal: React.FC<PostCreatorModalProps> = ({
  isOpen,
  onClose,
  postId,
  onSave,
  profiles,
  templates
}) => {
  const [content, setContent] = useState('');
  const [selectedAccounts, setSelectedAccounts] = useState<string[]>([]);
  const [scheduledDate, setScheduledDate] = useState('');
  const [scheduledTime, setScheduledTime] = useState('');
  const [uploadedMedia, setUploadedMedia] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState<'create' | 'template' | 'preview'>('create');
  const [selectedTemplate, setSelectedTemplate] = useState<PostTemplate | null>(null);
  const [selectedPlatform, setSelectedPlatform] = useState<SocialPlatform | null>(null);
  const [hashtagSuggestions, setHashtagSuggestions] = useState<string[]>([]);
  const [characterCount, setCharacterCount] = useState(0);
  const [draftHistory, setDraftHistory] = useState<string[]>([]);
  const [autoSaveEnabled, setAutoSaveEnabled] = useState(true);
  const autoSaveTimerRef = useRef<NodeJS.Timeout | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleAccountToggle = (profileId: string) => {
    setSelectedAccounts(prev =>
      prev.includes(profileId)
        ? prev.filter(id => id !== profileId)
        : [...prev, profileId]
    );
  };

  const handleTemplateSelect = (template: PostTemplate) => {
    setSelectedTemplate(template);
    setContent(template.sampleContent);
    setActiveTab('create');
    saveToHistory(template.sampleContent);
  };

  useEffect(() => {
    setCharacterCount(content.length);
    
    // Sugerencias de hashtags mientras escribes
    if (content.length > 10) {
      loadHashtagSuggestions();
    }
    
    // Auto-guardado
    if (autoSaveEnabled && content.length > 0) {
      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current);
      }
      autoSaveTimerRef.current = setTimeout(() => {
        saveDraft();
      }, 2000); // Guardar después de 2 segundos de inactividad
    }
    
    return () => {
      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current);
      }
    };
  }, [content, autoSaveEnabled]);

  useEffect(() => {
    if (selectedAccounts.length > 0) {
      const profile = profiles.find(p => p.id === selectedAccounts[0]);
      if (profile) {
        setSelectedPlatform(profile.platform);
      }
    }
  }, [selectedAccounts, profiles]);

  const loadHashtagSuggestions = async () => {
    try {
      const hashtags = await getHashtagAnalysis();
      const suggestions = hashtags
        .filter(h => h.recommendation === 'use')
        .slice(0, 5)
        .map(h => h.hashtag.replace('#', ''));
      setHashtagSuggestions(suggestions);
    } catch (err) {
      console.error('Error loading hashtag suggestions:', err);
    }
  };

  const saveDraft = () => {
    if (content.trim().length > 0) {
      localStorage.setItem(`draft_${postId || 'new'}`, JSON.stringify({
        content,
        uploadedMedia,
        selectedAccounts,
        scheduledDate,
        scheduledTime,
        timestamp: new Date().toISOString()
      }));
    }
  };

  const loadDraft = () => {
    const draft = localStorage.getItem(`draft_${postId || 'new'}`);
    if (draft) {
      try {
        const parsed = JSON.parse(draft);
        setContent(parsed.content || '');
        setUploadedMedia(parsed.uploadedMedia || []);
        setSelectedAccounts(parsed.selectedAccounts || []);
        setScheduledDate(parsed.scheduledDate || '');
        setScheduledTime(parsed.scheduledTime || '');
      } catch (err) {
        console.error('Error loading draft:', err);
      }
    }
  };

  const saveToHistory = (text: string) => {
    if (text.trim().length > 0 && !draftHistory.includes(text)) {
      setDraftHistory(prev => [text, ...prev].slice(0, 10)); // Mantener solo las últimas 10
    }
  };

  const getCharacterLimit = (platform: SocialPlatform | null): number => {
    switch (platform) {
      case 'instagram':
        return 2200;
      case 'facebook':
        return 5000;
      case 'tiktok':
        return 150;
      case 'linkedin':
        return 3000;
      default:
        return 2200;
    }
  };

  const getCharacterCountColor = (): string => {
    const limit = getCharacterLimit(selectedPlatform);
    const percentage = (characterCount / limit) * 100;
    
    if (percentage >= 100) return 'text-red-600';
    if (percentage >= 90) return 'text-yellow-600';
    return 'text-gray-600';
  };

  const insertText = (text: string) => {
    if (textareaRef.current) {
      const start = textareaRef.current.selectionStart;
      const end = textareaRef.current.selectionEnd;
      const newContent = content.substring(0, start) + text + content.substring(end);
      setContent(newContent);
      saveToHistory(newContent);
      
      // Restaurar cursor
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.selectionStart = textareaRef.current.selectionEnd = start + text.length;
          textareaRef.current.focus();
        }
      }, 0);
    }
  };

  const applyFormat = (format: 'bold' | 'italic' | 'list') => {
    if (textareaRef.current) {
      const start = textareaRef.current.selectionStart;
      const end = textareaRef.current.selectionEnd;
      const selectedText = content.substring(start, end);
      
      let formattedText = '';
      switch (format) {
        case 'bold':
          formattedText = `**${selectedText || 'texto'}**`;
          break;
        case 'italic':
          formattedText = `*${selectedText || 'texto'}*`;
          break;
        case 'list':
          formattedText = `\n• ${selectedText || 'elemento'}\n`;
          break;
      }
      
      insertText(formattedText);
    }
  };

  const insertHashtag = (hashtag: string) => {
    const hashtagText = hashtag.startsWith('#') ? hashtag : `#${hashtag}`;
    insertText(` ${hashtagText}`);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      // Simular subida de archivos
      const newMedia = Array.from(files).map(file => URL.createObjectURL(file));
      setUploadedMedia(prev => [...prev, ...newMedia]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const scheduledDateTime = scheduledDate && scheduledTime
        ? new Date(`${scheduledDate}T${scheduledTime}`).toISOString()
        : undefined;

      const postData: Partial<SocialPost> = {
        content,
        mediaUrls: uploadedMedia,
        profileId: selectedAccounts[0] || '', // Simplificado para ejemplo
        scheduledAt: scheduledDateTime,
        status: scheduledDateTime ? 'scheduled' : 'draft'
      };

      await onSave(postData);
      
      // Limpiar borrador guardado
      if (postId) {
        localStorage.removeItem(`draft_${postId}`);
      } else {
        localStorage.removeItem('draft_new');
      }
      
      // Reset form
      setContent('');
      setSelectedAccounts([]);
      setScheduledDate('');
      setScheduledTime('');
      setUploadedMedia([]);
      setSelectedTemplate(null);
      setDraftHistory([]);
      setHashtagSuggestions([]);
      
      onClose();
    } catch (err: any) {
      alert('Error al guardar el post: ' + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadDraft();
    } else {
      // Limpiar al cerrar
      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current);
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={postId ? 'Editar Publicación' : 'Crear Nueva Publicación'}
      size="xl"
      className="max-h-[90vh] overflow-y-auto"
      footer={
        activeTab === 'create' ? (
          <div className="flex justify-end gap-3">
            <Button variant="secondary" onClick={onClose}>
              Cancelar
            </Button>
            <Button
              type="submit"
              form="post-form"
              disabled={isSubmitting || selectedAccounts.length === 0}
              loading={isSubmitting}
            >
              {scheduledDate && scheduledTime ? 'Programar' : 'Guardar Borrador'}
            </Button>
          </div>
        ) : null
      }
    >
      {/* Tabs */}
      <div className="mb-6">
        <div className="flex gap-4">
          <button
            onClick={() => setActiveTab('create')}
            className={`py-2 px-4 rounded-xl text-sm font-medium transition-all flex items-center gap-2 ${
              activeTab === 'create'
                ? 'bg-blue-100 text-blue-700 ring-1 ring-blue-200'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Type size={16} />
            Crear desde cero
          </button>
          {templates && templates.length > 0 && (
            <button
              onClick={() => setActiveTab('template')}
              className={`py-2 px-4 rounded-xl text-sm font-medium transition-all flex items-center gap-2 ${
                activeTab === 'template'
                  ? 'bg-blue-100 text-blue-700 ring-1 ring-blue-200'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Sparkles size={16} />
              Usar plantilla
            </button>
          )}
          {content.length > 0 && (
            <button
              onClick={() => setActiveTab('preview')}
              className={`py-2 px-4 rounded-xl text-sm font-medium transition-all flex items-center gap-2 ${
                activeTab === 'preview'
                  ? 'bg-blue-100 text-blue-700 ring-1 ring-blue-200'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Eye size={16} />
              Vista Previa
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      {activeTab === 'preview' ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Vista Previa</h3>
            <div className="flex gap-2">
              {profiles.filter(p => selectedAccounts.includes(p.id)).map(profile => (
                <div key={profile.id} className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-lg">
                  <span className="text-lg">{getPlatformIcon(profile.platform)}</span>
                  <span className="text-sm font-medium text-gray-900">{profile.displayName}</span>
                </div>
              ))}
            </div>
          </div>
          
          {profiles.filter(p => selectedAccounts.includes(p.id)).map(profile => {
            const limit = getCharacterLimit(profile.platform);
            const previewContent = content.length > limit ? content.substring(0, limit) + '...' : content;
            
            return (
              <Card key={profile.id} className="p-6 bg-white shadow-sm ring-1 ring-gray-200">
                <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-200">
                  <span className="text-2xl">{getPlatformIcon(profile.platform)}</span>
                  <div>
                    <p className="font-semibold text-gray-900">{profile.displayName}</p>
                    <p className="text-xs text-gray-600 capitalize">{profile.platform}</p>
                  </div>
                </div>
                
                <div className="mb-4">
                  {uploadedMedia.length > 0 && (
                    <div className="grid grid-cols-2 gap-2 mb-4">
                      {uploadedMedia.slice(0, 4).map((url, idx) => (
                        <img
                          key={idx}
                          src={url}
                          alt={`Preview ${idx + 1}`}
                          className="w-full h-32 object-cover rounded-lg"
                        />
                      ))}
                    </div>
                  )}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <pre className="whitespace-pre-wrap text-sm text-gray-900 font-sans">
                      {previewContent || 'Tu contenido aparecerá aquí...'}
                    </pre>
                  </div>
                </div>
                
                {content.match(/#\w+/g) && (
                  <div className="flex flex-wrap gap-1 pt-3 border-t border-gray-200">
                    {content.match(/#\w+/g)?.map((tag, idx) => (
                      <span key={idx} className="text-xs text-blue-600">#{tag.replace('#', '')}</span>
                    ))}
                  </div>
                )}
              </Card>
            );
          })}
          
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <Button variant="secondary" onClick={() => setActiveTab('create')}>
              Volver al Editor
            </Button>
          </div>
        </div>
      ) : activeTab === 'template' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {templates?.map((template) => (
            <Card
              key={template.id}
              variant="hover"
              onClick={() => handleTemplateSelect(template)}
              className={`cursor-pointer transition ${
                selectedTemplate?.id === template.id
                  ? 'ring-2 ring-blue-600 bg-blue-50'
                  : 'ring-1 ring-gray-200 hover:ring-blue-400'
              }`}
            >
              <h3 className="font-semibold text-gray-900 mb-2">{template.name}</h3>
              <p className="text-xs text-gray-600 mb-2">{template.description}</p>
              <p className="text-sm text-gray-700 line-clamp-2">{template.sampleContent}</p>
            </Card>
          ))}
        </div>
      ) : (
        <form id="post-form" onSubmit={handleSubmit} className="space-y-6">
          {/* Content Editor */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-slate-700">
                <Hash size={16} className="inline mr-1" />
                Contenido *
              </label>
              <div className="flex items-center gap-2">
                <div className="flex gap-1">
                  <button
                    type="button"
                    onClick={() => applyFormat('bold')}
                    className="p-1.5 rounded hover:bg-gray-100 transition"
                    title="Negrita"
                  >
                    <Bold size={16} className="text-gray-600" />
                  </button>
                  <button
                    type="button"
                    onClick={() => applyFormat('italic')}
                    className="p-1.5 rounded hover:bg-gray-100 transition"
                    title="Cursiva"
                  >
                    <Italic size={16} className="text-gray-600" />
                  </button>
                  <button
                    type="button"
                    onClick={() => applyFormat('list')}
                    className="p-1.5 rounded hover:bg-gray-100 transition"
                    title="Lista"
                  >
                    <List size={16} className="text-gray-600" />
                  </button>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveTab('preview')}
                  className="p-1.5 rounded hover:bg-gray-100 transition"
                  title="Vista previa"
                >
                  <Eye size={16} className="text-gray-600" />
                </button>
              </div>
            </div>
            <textarea
              ref={textareaRef}
              value={content}
              onChange={(e) => {
                setContent(e.target.value);
                saveToHistory(e.target.value);
              }}
              placeholder="Escribe tu publicación aquí..."
              rows={8}
              required
              className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-4 py-2.5 transition-all font-sans"
            />
            <div className="flex items-center justify-between mt-2">
              <div className="flex items-center gap-2">
                <p className="text-xs text-gray-600">Agrega hashtags para mayor alcance</p>
                {hashtagSuggestions.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {hashtagSuggestions.map((tag, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => insertHashtag(tag)}
                        className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded text-xs hover:bg-blue-100 transition"
                      >
                        + #{tag}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2">
                {selectedPlatform && (
                  <span className="text-xs text-gray-500">
                    Límite: {getCharacterLimit(selectedPlatform).toLocaleString()}
                  </span>
                )}
                <span className={`text-xs font-medium ${getCharacterCountColor()}`}>
                  {characterCount.toLocaleString()} / {selectedPlatform ? getCharacterLimit(selectedPlatform).toLocaleString() : '∞'}
                </span>
              </div>
            </div>
            {draftHistory.length > 0 && (
              <div className="mt-2 pt-2 border-t border-gray-200">
                <div className="flex items-center gap-2">
                  <History size={12} className="text-gray-400" />
                  <span className="text-xs text-gray-600">Historial de versiones ({draftHistory.length})</span>
                  <button
                    type="button"
                    onClick={loadDraft}
                    className="text-xs text-blue-600 hover:text-blue-700"
                  >
                    Cargar borrador guardado
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Media Upload */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              <ImageIcon size={16} className="inline mr-1" />
              Imágenes / Videos
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-blue-500 transition cursor-pointer">
              <input
                type="file"
                accept="image/*,video/*"
                multiple
                onChange={handleFileUpload}
                className="hidden"
                id="media-upload"
              />
              <label htmlFor="media-upload" className="cursor-pointer">
                <Upload className="w-10 h-10 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600">
                  Haz clic para subir o arrastra archivos aquí
                </p>
              </label>
            </div>

              {/* Uploaded Media Preview */}
              {uploadedMedia.length > 0 && (
                <div className="grid grid-cols-4 gap-2 mt-4">
                  {uploadedMedia.map((url, idx) => (
                    <div key={idx} className="relative group">
                      <img
                        src={url}
                        alt={`Preview ${idx + 1}`}
                        className="w-full h-24 object-cover rounded"
                      />
                      <button
                        type="button"
                        onClick={() => setUploadedMedia(prev => prev.filter((_, i) => i !== idx))}
                        className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

          {/* Account Selection */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Seleccionar Cuentas *
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {profiles.filter(p => p.isConnected).map((profile) => (
                <button
                  key={profile.id}
                  type="button"
                  onClick={() => handleAccountToggle(profile.id)}
                  className={`flex items-center gap-2 p-3 border-2 rounded-xl transition ${
                    selectedAccounts.includes(profile.id)
                      ? 'border-blue-600 bg-blue-50 ring-1 ring-blue-200'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <span className="text-2xl">{getPlatformIcon(profile.platform)}</span>
                  <div className="flex-1 text-left">
                    <p className="font-medium text-gray-900">{profile.displayName}</p>
                    <p className="text-xs text-gray-600">{profile.username}</p>
                  </div>
                  {selectedAccounts.includes(profile.id) && (
                    <div className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center">
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Schedule */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-2">
              <Calendar size={16} />
              Programar Publicación
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <input
                type="date"
                value={scheduledDate}
                onChange={(e) => setScheduledDate(e.target.value)}
                className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-4 py-2.5 transition-all"
              />
              <input
                type="time"
                value={scheduledTime}
                onChange={(e) => setScheduledTime(e.target.value)}
                className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-4 py-2.5 transition-all"
              />
            </div>
          </div>
        </form>
      )}
    </Modal>
  );
};

