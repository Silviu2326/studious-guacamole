import React, { useState } from 'react';
import { SocialPost, SocialProfile, PostTemplate, getPlatformIcon } from '../api/social';
import { X, Upload, Calendar, Image as ImageIcon, Hash } from 'lucide-react';

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
  const [activeTab, setActiveTab] = useState<'create' | 'template'>('create');
  const [selectedTemplate, setSelectedTemplate] = useState<PostTemplate | null>(null);

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
      
      // Reset form
      setContent('');
      setSelectedAccounts([]);
      setScheduledDate('');
      setScheduledTime('');
      setUploadedMedia([]);
      setSelectedTemplate(null);
      
      onClose();
    } catch (err: any) {
      alert('Error al guardar el post: ' + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-3xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 z-10">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">
              {postId ? 'Editar Publicación' : 'Crear Nueva Publicación'}
            </h2>
            <button
              onClick={onClose}
              className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Tabs */}
          <div className="flex gap-4 mt-4">
            <button
              onClick={() => setActiveTab('create')}
              className={`py-2 px-4 rounded-lg transition ${
                activeTab === 'create'
                  ? 'bg-purple-100 text-purple-700'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Crear desde cero
            </button>
            {templates && templates.length > 0 && (
              <button
                onClick={() => setActiveTab('template')}
                className={`py-2 px-4 rounded-lg transition ${
                  activeTab === 'template'
                    ? 'bg-purple-100 text-purple-700'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                Usar plantilla
              </button>
            )}
          </div>
        </div>

        {/* Content */}
        {activeTab === 'template' ? (
          <div className="p-6">
            <div className="grid grid-cols-2 gap-4">
              {templates?.map((template) => (
                <div
                  key={template.id}
                  onClick={() => handleTemplateSelect(template)}
                  className={`p-4 border-2 rounded-lg cursor-pointer transition ${
                    selectedTemplate?.id === template.id
                      ? 'border-purple-600 bg-purple-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <h3 className="font-semibold text-gray-900 mb-2">{template.name}</h3>
                  <p className="text-xs text-gray-600 mb-2">{template.description}</p>
                  <p className="text-sm text-gray-700 line-clamp-2">{template.sampleContent}</p>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Content Editor */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contenido *
              </label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Escribe tu publicación aquí..."
                rows={6}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              />
              <div className="flex items-center gap-2 mt-2">
                <Hash className="w-4 h-4 text-gray-500" />
                <span className="text-xs text-gray-600">Agrega hashtags para mayor alcance</span>
              </div>
            </div>

            {/* Media Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Imágenes / Videos
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-purple-500 transition">
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
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Seleccionar Cuentas *
              </label>
              <div className="grid grid-cols-2 gap-3">
                {profiles.filter(p => p.isConnected).map((profile) => (
                  <button
                    key={profile.id}
                    type="button"
                    onClick={() => handleAccountToggle(profile.id)}
                    className={`flex items-center gap-2 p-3 border-2 rounded-lg transition ${
                      selectedAccounts.includes(profile.id)
                        ? 'border-purple-600 bg-purple-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <span className="text-2xl">{getPlatformIcon(profile.platform)}</span>
                    <div className="flex-1 text-left">
                      <p className="font-medium text-gray-900">{profile.displayName}</p>
                      <p className="text-xs text-gray-600">{profile.username}</p>
                    </div>
                    {selectedAccounts.includes(profile.id) && (
                      <div className="w-5 h-5 bg-purple-600 rounded-full flex items-center justify-center">
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
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <Calendar className="w-4 h-4" />
                Programar Publicación
              </label>
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="date"
                  value={scheduledDate}
                  onChange={(e) => setScheduledDate(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                />
                <input
                  type="time"
                  value={scheduledTime}
                  onChange={(e) => setScheduledTime(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>

            {/* Footer */}
            <div className="sticky bottom-0 bg-white border-t border-gray-200 -mx-6 -mb-6 p-6">
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || selectedAccounts.length === 0}
                  className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting
                    ? 'Guardando...'
                    : scheduledDate && scheduledTime
                    ? 'Programar'
                    : 'Guardar Borrador'}
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

