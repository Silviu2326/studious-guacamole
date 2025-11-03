import React, { useState, useEffect } from 'react';
import { Layout } from '../../../components/layout';
import { useAuth } from '../../../context/AuthContext';
import { PixelCard } from '../components/PixelCard';
import { AddPixelModal } from '../components/AddPixelModal';
import { AudienceSuggestionsCard } from '../components/AudienceSuggestionsCard';
import {
  getPixels,
  createPixel,
  updatePixel,
  deletePixel,
  getAudienceSuggestions,
  getTopEvents,
  Pixel
} from '../api/pixels';
import { Plus, AlertCircle, Target } from 'lucide-react';

export default function RetargetingYPixelManagerPage() {
  const { user } = useAuth();
  const [pixels, setPixels] = useState<Pixel[]>([]);
  const [audienceSuggestions, setAudienceSuggestions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const [pixelsData, suggestionsData] = await Promise.all([
        getPixels(),
        getAudienceSuggestions()
      ]);

      setPixels(pixelsData);
      setAudienceSuggestions(suggestionsData);
    } catch (err: any) {
      setError(err.message || 'Error al cargar los datos');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddPixel = async (data: { platform: any; pixelId: string }) => {
    try {
      await createPixel(data.platform, data.pixelId);
      await loadData();
    } catch (err: any) {
      throw new Error('Error al crear el pixel');
    }
  };

  const handleToggleStatus = async (pixelId: string, isActive: boolean) => {
    try {
      await updatePixel(pixelId, isActive);
      await loadData();
    } catch (err: any) {
      alert('Error al actualizar el pixel');
    }
  };

  const handleDeletePixel = async (pixelId: string) => {
    try {
      await deletePixel(pixelId);
      await loadData();
    } catch (err: any) {
      alert('Error al eliminar el pixel');
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Retargeting & Pixel Manager
            </h1>
            <p className="text-gray-600 mt-2">
              Gestiona tus píxeles de seguimiento y crea audiencias para retargeting
            </p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
          >
            <Plus className="w-5 h-5" />
            Añadir Pixel
          </button>
        </div>

        {/* Error Banner */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
            <strong className="font-bold">Error:</strong>
            <span className="block sm:inline"> {error}</span>
          </div>
        )}

        {isLoading ? (
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
          </div>
        ) : (
          <>
            {/* Pixels Grid */}
            {pixels.length === 0 ? (
              <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
                <Target className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No hay píxeles configurados</h3>
                <p className="text-gray-600 mb-6">Añade tu primer pixel para empezar a rastrear visitantes</p>
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
                >
                  <Plus className="w-5 h-5" />
                  Añadir Primer Pixel
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {pixels.map((pixel) => (
                  <PixelCard
                    key={pixel.id}
                    pixel={pixel}
                    onToggleStatus={handleToggleStatus}
                    onDelete={handleDeletePixel}
                  />
                ))}
              </div>
            )}

            {/* Audience Suggestions */}
            <AudienceSuggestionsCard suggestions={audienceSuggestions} />

            {/* Info Card */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-6 h-6 text-blue-600 mt-0.5" />
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                    ¿Necesitas ayuda?
                  </h3>
                  <p className="text-gray-700 mb-3">
                    TrainerERP instalará automáticamente tus píxeles en todas tus páginas públicas. 
                    Asegúrate de tener un banner de consentimiento de cookies activo para cumplir con GDPR.
                  </p>
                  <p className="text-sm text-gray-600">
                    Los datos recopilados te permitirán crear audiencias personalizadas en Facebook, 
                    Google y otras plataformas publicitarias para tus campañas de retargeting.
                  </p>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Modal */}
      <AddPixelModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAddPixel}
      />
    </Layout>
  );
}

