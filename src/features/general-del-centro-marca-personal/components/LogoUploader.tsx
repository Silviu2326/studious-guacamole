import React, { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { Button, Card } from '../../../components/componentsreutilizables';
import { profileApi } from '../api/profileApi';

interface LogoUploaderProps {
  currentLogoUrl?: string;
  onUploadSuccess: (newLogoUrl: string) => void;
}

export const LogoUploader: React.FC<LogoUploaderProps> = ({
  currentLogoUrl,
  onUploadSuccess,
}) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentLogoUrl || null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File): string | null => {
    const maxSize = 5 * 1024 * 1024; // 5MB
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];

    if (!allowedTypes.includes(file.type)) {
      return 'El formato del archivo no está soportado. Usa JPG, PNG, GIF o WEBP';
    }

    if (file.size > maxSize) {
      return 'El archivo excede el tamaño máximo de 5MB';
    }

    return null;
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const error = validateFile(file);
    if (error) {
      setUploadError(error);
      return;
    }

    setUploadError(null);
    setSelectedFile(file);

    // Crear preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    setUploadError(null);

    try {
      const response = await profileApi.uploadLogo(selectedFile);
      onUploadSuccess(response.logoUrl);
      setSelectedFile(null);
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : 'Error al subir el logotipo');
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemove = () => {
    setPreviewUrl(null);
    setSelectedFile(null);
    setUploadError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <Card padding="none">
      <div className="p-4 space-y-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            Logotipo
          </h3>
          <p className="text-sm text-gray-600">
            Sube el logotipo de tu marca. Formatos: JPG, PNG, GIF, WEBP (máx. 5MB)
          </p>
        </div>

        {previewUrl ? (
          <div className="relative">
            <div className="w-full h-48 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
              <img
                src={previewUrl}
                alt="Preview del logo"
                className="max-w-full max-h-full object-contain"
              />
            </div>
            {selectedFile && (
              <button
                onClick={handleRemove}
                className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                type="button"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        ) : (
          <div
            onClick={handleClick}
            className="w-full h-48 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-gray-400 transition"
          >
            <ImageIcon className="w-12 h-12 text-gray-400 mb-2" />
            <p className="text-sm text-gray-600">
              Haz clic para seleccionar una imagen
            </p>
            <p className="text-xs text-gray-500 mt-1">
              JPG, PNG, GIF o WEBP (máx. 5MB)
            </p>
          </div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
          onChange={handleFileSelect}
          className="hidden"
        />

        {uploadError && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600">{uploadError}</p>
          </div>
        )}

        <div className="flex gap-2">
          <Button
            variant="secondary"
            onClick={handleClick}
            disabled={isUploading}
            fullWidth
          >
            <Upload className="w-4 h-4 mr-2" />
            {previewUrl && selectedFile ? 'Cambiar Imagen' : 'Seleccionar Imagen'}
          </Button>
          {selectedFile && (
            <Button
              variant="primary"
              onClick={handleUpload}
              loading={isUploading}
              fullWidth
            >
              Subir Logotipo
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
};

