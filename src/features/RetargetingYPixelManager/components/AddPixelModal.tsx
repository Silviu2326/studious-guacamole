import React, { useState } from 'react';
import { PixelPlatform } from '../api/pixels';
import { Modal, Button, Input } from '../../../components/componentsreutilizables';
import { Save, Target, Hash } from 'lucide-react';

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

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
    }
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

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Añadir Nuevo Pixel"
      size="md"
      footer={
        <div className="flex justify-end gap-3">
          <Button variant="secondary" onClick={handleClose} disabled={isSubmitting} type="button">
            Cancelar
          </Button>
          <Button
            variant="primary"
            onClick={(e) => {
              e.preventDefault();
              handleSubmit();
            }}
            loading={isSubmitting}
            leftIcon={<Save size={18} />}
            type="button"
          >
            Guardar y Activar
          </Button>
        </div>
      }
    >
      <form onSubmit={(e) => { e.preventDefault(); handleSubmit(e); }} className="space-y-6">
        {/* Platform Selection */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            <Target size={16} className="inline mr-1" />
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
                  className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
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
          <label className="block text-sm font-medium text-slate-700 mb-2">
            <Hash size={16} className="inline mr-1" />
            ID del Pixel *
          </label>
          <Input
            type="text"
            value={pixelIdInput}
            onChange={(e) => setPixelIdInput(e.target.value)}
            placeholder={
              selectedPlatform === 'facebook' ? '123456789012345' :
              selectedPlatform === 'google_analytics' ? 'G-XXXXXXXXXX' :
              'GTM-XXXXXXX'
            }
            error={error || undefined}
            className="font-mono"
          />
          <p className="text-xs text-gray-500 mt-1">
            Encuentra tu ID en {selectedPlatform === 'facebook' ? 'Meta Events Manager' :
              selectedPlatform === 'google_analytics' ? 'Google Analytics Admin' :
              'Google Tag Manager'}
          </p>
        </div>
      </form>
    </Modal>
  );
};

