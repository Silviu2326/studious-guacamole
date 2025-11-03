import React, { useState } from 'react';
import { PixelPlatform } from '../api/pixels';
import { X, Save } from 'lucide-react';

interface AddPixelModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { platform: PixelPlatform; pixelId: string }) => Promise<void>;
}

export const AddPixelModal: React.FC<AddPixelModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [selectedPlatform, setSelectedPlatform] = useState<PixelPlatform>('facebook');
  const [pixelIdInput, setPixelIdInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!pixelIdInput.trim()) {
      setError('El ID del pixel es obligatorio');
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit({ platform: selectedPlatform, pixelId: pixelIdInput.trim() });
      handleClose();
    } catch (err: any) {
      setError(err.message || 'Error al guardar el pixel');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setPixelIdInput('');
    setError(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-lg w-full mx-4">
        {/* Header */}
        <div className="border-b border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">Añadir Nuevo Pixel</h2>
            <button
              onClick={handleClose}
              className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Platform Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Plataforma *
            </label>
            <div className="space-y-2">
              {(['facebook', 'google_analytics', 'gtm'] as PixelPlatform[]).map((platform) => (
                <label key={platform} className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="radio"
                    value={platform}
                    checked={selectedPlatform === platform}
                    onChange={(e) => setSelectedPlatform(e.target.value as PixelPlatform)}
                    className="w-4 h-4 text-purple-600 border-gray-300 focus:ring-purple-500"
                  />
                  <span className="text-sm text-gray-700">
                    {platform === 'facebook' && 'Facebook Pixel'}
                    {platform === 'google_analytics' && 'Google Analytics'}
                    {platform === 'gtm' && 'Google Tag Manager'}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Pixel ID */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              ID del Pixel *
            </label>
            <input
              type="text"
              value={pixelIdInput}
              onChange={(e) => setPixelIdInput(e.target.value)}
              placeholder={
                selectedPlatform === 'facebook' ? '123456789012345' :
                selectedPlatform === 'google_analytics' ? 'G-XXXXXXXXXX' :
                'GTM-XXXXXXX'
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 font-mono"
            />
            <p className="text-xs text-gray-500 mt-1">
              Encuentra tu ID en {selectedPlatform === 'facebook' ? 'Meta Events Manager' :
                selectedPlatform === 'google_analytics' ? 'Google Analytics Admin' :
                'Google Tag Manager'}
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          {/* Footer */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={handleClose}
              className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
              disabled={isSubmitting}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              {isSubmitting ? 'Guardando...' : 'Guardar y Activar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

