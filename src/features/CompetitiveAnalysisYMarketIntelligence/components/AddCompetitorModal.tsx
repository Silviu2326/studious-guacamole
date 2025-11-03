import React, { useState } from 'react';
import { createCompetitor } from '../api/competitors';
import { X, ExternalLink, AlertCircle } from 'lucide-react';
import { Button } from '../../../components/componentsreutilizables';

interface AddCompetitorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCompetitorAdded: () => void;
}

/**
 * Modal con formulario para añadir un nuevo competidor
 */
export const AddCompetitorModal: React.FC<AddCompetitorModalProps> = ({
  isOpen,
  onClose,
  onCompetitorAdded
}) => {
  const [url, setUrl] = useState('');
  const [socialMediaHandle, setSocialMediaHandle] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const validateUrl = (urlString: string): boolean => {
    try {
      const url = new URL(urlString);
      return url.protocol === 'http:' || url.protocol === 'https:';
    } catch {
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    // Validación
    if (!url.trim()) {
      setFormError('Por favor, introduce una URL');
      return;
    }

    if (!validateUrl(url)) {
      setFormError('Por favor, introduce una URL válida (debe comenzar con http:// o https://)');
      return;
    }

    setIsSubmitting(true);

    try {
      await createCompetitor(url);
      setUrl('');
      setSocialMediaHandle('');
      onCompetitorAdded();
      onClose();
    } catch (error: any) {
      setFormError(error.message || 'Error al añadir el competidor. Por favor, inténtalo de nuevo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setUrl('');
      setSocialMediaHandle('');
      setFormError(null);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={handleClose}
      />
      
      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">
              Añadir Competidor
            </h2>
            <button
              onClick={handleClose}
              disabled={isSubmitting}
              className="text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6">
            {formError && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-800">{formError}</p>
              </div>
            )}

            <div className="space-y-4">
              {/* URL del sitio web */}
              <div>
                <label htmlFor="url" className="block text-sm font-medium text-gray-700 mb-2">
                  URL del sitio web o perfil social <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <ExternalLink className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    id="url"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="https://ejemplo.com o https://instagram.com/perfil"
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    disabled={isSubmitting}
                    required
                  />
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  Introduce la URL de la página web principal o perfil de Instagram/Facebook
                </p>
              </div>

              {/* Handle de redes sociales (opcional) */}
              <div>
                <label htmlFor="socialHandle" className="block text-sm font-medium text-gray-700 mb-2">
                  Handle de redes sociales (opcional)
                </label>
                <input
                  type="text"
                  id="socialHandle"
                  value={socialMediaHandle}
                  onChange={(e) => setSocialMediaHandle(e.target.value)}
                  placeholder="@ejemplo"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  disabled={isSubmitting}
                />
              </div>
            </div>

            {/* Actions */}
            <div className="mt-6 flex gap-3 justify-end">
              <Button
                type="button"
                variant="secondary"
                onClick={handleClose}
                disabled={isSubmitting}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                variant="primary"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Añadiendo...' : 'Añadir Competidor'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};


