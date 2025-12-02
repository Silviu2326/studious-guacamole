import React, { useState } from 'react';
import { Card, Button } from '../../../components/componentsreutilizables';
import { Group } from '../api/community';
import { Image as ImageIcon, Video, X, Loader2, Users } from 'lucide-react';

interface NewPostFormProps {
  availableGroups: Group[];
  onSubmitSuccess?: () => void;
}

export const NewPostForm: React.FC<NewPostFormProps> = ({ 
  availableGroups, 
  onSubmitSuccess 
}) => {
  const [content, setContent] = useState('');
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [mediaPreview, setMediaPreview] = useState<string | null>(null);
  const [selectedGroupId, setSelectedGroupId] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validar tamaño (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setError('El archivo es demasiado grande. Máximo 10MB.');
      return;
    }

    setMediaFile(file);
    setError(null);

    // Crear preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setMediaPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const removeMedia = () => {
    setMediaFile(null);
    setMediaPreview(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!content.trim() && !mediaFile) {
      setError('Debes escribir algo o subir una imagen/video');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      // TODO: Subir media primero si existe, luego crear post
      // const mediaUrl = mediaFile ? await uploadMedia(mediaFile) : undefined;
      
      // En producción: await createPost(content, mediaUrl, selectedGroupId || undefined);
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulación
      
      // Reset form
      setContent('');
      setMediaFile(null);
      setMediaPreview(null);
      setSelectedGroupId('');
      
      onSubmitSuccess?.();
    } catch (err) {
      setError('Error al publicar. Por favor, intenta de nuevo.');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isImage = mediaFile?.type.startsWith('image/');
  const isVideo = mediaFile?.type.startsWith('video/');

  return (
    <Card className="p-4 bg-white shadow-sm mb-6">
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          {/* Selector de grupo */}
          {availableGroups.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                <Users size={16} className="inline mr-1" />
                Publicar en
              </label>
              <select
                value={selectedGroupId}
                onChange={(e) => setSelectedGroupId(e.target.value)}
                className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-4 py-2.5"
              >
                <option value="">Feed General</option>
                {availableGroups.map(group => (
                  <option key={group.id} value={group.id}>
                    {group.name} {group.isPrivate && '(Privado)'}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Textarea */}
          <div>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="¿Qué quieres compartir con la comunidad?"
              rows={4}
              className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-4 py-2.5 resize-none"
            />
          </div>

          {/* Media preview */}
          {mediaPreview && (
            <div className="relative">
              {isImage && (
                <img 
                  src={mediaPreview} 
                  alt="Preview" 
                  className="max-h-64 rounded-xl object-cover"
                />
              )}
              {isVideo && (
                <video 
                  src={mediaPreview} 
                  controls 
                  className="max-h-64 rounded-xl"
                />
              )}
              <button
                type="button"
                onClick={removeMedia}
                className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
              >
                <X size={16} />
              </button>
            </div>
          )}

          {/* Error message */}
          {error && (
            <div className="p-3 bg-red-50 ring-1 ring-red-200 rounded-xl text-sm text-red-700">
              {error}
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              {/* Upload image */}
              <label className="cursor-pointer p-2 hover:bg-slate-100 rounded-xl transition-all">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                  disabled={isSubmitting || !!mediaFile}
                />
                <ImageIcon size={20} className="text-slate-600" />
              </label>

              {/* Upload video */}
              <label className="cursor-pointer p-2 hover:bg-slate-100 rounded-xl transition-all">
                <input
                  type="file"
                  accept="video/*"
                  onChange={handleFileChange}
                  className="hidden"
                  disabled={isSubmitting || !!mediaFile}
                />
                <Video size={20} className="text-slate-600" />
              </label>
            </div>

            <Button
              type="submit"
              variant="primary"
              disabled={isSubmitting || (!content.trim() && !mediaFile)}
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={20} className="mr-2 animate-spin" />
                  Publicando...
                </>
              ) : (
                'Publicar'
              )}
            </Button>
          </div>
        </div>
      </form>
    </Card>
  );
};


