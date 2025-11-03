import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { PixelCard } from '../components/PixelCard';
import { AddPixelModal } from '../components/AddPixelModal';
import { AudienceSuggestionsCard } from '../components/AudienceSuggestionsCard';
import { Button, Card } from '../../../components/componentsreutilizables';
import {
  getPixels,
  createPixel,
  updatePixel,
  deletePixel,
  getAudienceSuggestions,
  getTopEvents,
  Pixel
} from '../api/pixels';
import { Plus, AlertCircle, Target, Loader2 } from 'lucide-react';

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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
        {/* Header */}
        <div className="border-b border-gray-200/60 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
          <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6">
            <div className="py-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-100 rounded-xl mr-4 ring-1 ring-blue-200/70">
                    <Target size={24} className="text-blue-600" />
                  </div>
                  <div>
                    <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900">
                      Retargeting & Pixel Manager
                    </h1>
                    <p className="text-gray-600">
                      Gestiona tus píxeles de seguimiento y crea audiencias para retargeting
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contenedor Principal */}
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6 py-8">
          <div className="space-y-6">
            {/* Toolbar Superior */}
            <div className="flex items-center justify-end">
              <Button onClick={() => setIsModalOpen(true)}>
                <Plus size={20} className="mr-2" />
                Añadir Pixel
              </Button>
            </div>

            {/* Estados de Error */}
            {error && (
              <Card className="p-8 text-center bg-white shadow-sm">
                <AlertCircle size={48} className="mx-auto text-red-500 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Error al cargar</h3>
                <p className="text-gray-600 mb-4">{error}</p>
                <Button onClick={loadData}>
                  Reintentar
                </Button>
              </Card>
            )}

            {/* Estado de Carga */}
            {isLoading && !error && (
              <Card className="p-8 text-center bg-white shadow-sm">
                <Loader2 size={48} className="mx-auto text-blue-500 animate-spin mb-4" />
                <p className="text-gray-600">Cargando...</p>
              </Card>
            )}

            {/* Contenido Principal */}
            {!isLoading && !error && (
              <>
                {/* Estado Vacío */}
                {pixels.length === 0 ? (
                  <Card className="p-8 text-center bg-white shadow-sm">
                    <Target size={48} className="mx-auto text-gray-400 mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No hay píxeles configurados</h3>
                    <p className="text-gray-600 mb-4">Añade tu primer pixel para empezar a rastrear visitantes</p>
                    <Button onClick={() => setIsModalOpen(true)}>
                      <Plus size={20} className="mr-2" />
                      Añadir Primer Pixel
                    </Button>
                  </Card>
                ) : (
                  <>
                    {/* Grid de Pixels */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                      {pixels.map((pixel) => (
                        <PixelCard
                          key={pixel.id}
                          pixel={pixel}
                          onToggleStatus={handleToggleStatus}
                          onDelete={handleDeletePixel}
                        />
                      ))}
                    </div>

                    {/* Audience Suggestions */}
                    <AudienceSuggestionsCard suggestions={audienceSuggestions} />

                    {/* Info Card */}
                    <Card className="bg-blue-50 border border-blue-200 shadow-sm p-4">
                      <div className="flex items-start gap-3">
                        <AlertCircle size={20} className="text-blue-600 mt-0.5" />
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-2">
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
                    </Card>
                  </>
                )}
              </>
            )}
          </div>
        </div>

        {/* Modal */}
        <AddPixelModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleAddPixel}
        />
      </div>
  );
}

