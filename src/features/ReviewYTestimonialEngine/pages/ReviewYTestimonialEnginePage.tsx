import React, { useState, useEffect } from 'react';
import { Layout } from '../../../components/layout';
import { ReviewCard } from '../components/ReviewCard';
import { ReviewFilterControls } from '../components/ReviewFilterControls';
import {
  getReviews,
  updateReviewStatus,
  syncReviews,
  getReviewStats,
  Review,
  ReviewSource,
  ReviewStatus,
  ReviewStats as ReviewStatsType
} from '../api/reviews';
import { RefreshCw, AlertCircle, Star, TrendingUp, Share2 } from 'lucide-react';

export default function ReviewYTestimonialEnginePage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [stats, setStats] = useState<ReviewStatsType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingStats, setIsLoadingStats] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<{
    source?: ReviewSource | 'all';
    rating?: number | 'all';
    status?: ReviewStatus | 'all';
  }>({});
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    loadData();
  }, [filters]);

  const loadData = async () => {
    setIsLoading(true);
    setIsLoadingStats(true);
    setError(null);

    try {
      const source = filters.source && filters.source !== 'all' ? filters.source : undefined;
      const rating = filters.rating && filters.rating !== 'all' ? filters.rating : undefined;
      const status = filters.status && filters.status !== 'all' ? filters.status : undefined;

      const [reviewsResponse, statsData] = await Promise.all([
        getReviews(1, 20, source, rating, status),
        getReviewStats()
      ]);

      setReviews(reviewsResponse.data);
      setStats(statsData);
    } catch (err: any) {
      setError(err.message || 'Error al cargar las reseñas');
    } finally {
      setIsLoading(false);
      setIsLoadingStats(false);
    }
  };

  const handleSync = async () => {
    setIsSyncing(true);
    try {
      await syncReviews();
      await loadData();
    } catch (err: any) {
      alert('Error al sincronizar: ' + err.message);
    } finally {
      setIsSyncing(false);
    }
  };

  const handleFeature = async (reviewId: string) => {
    try {
      const review = reviews.find(r => r.id === reviewId);
      if (!review) return;

      const newStatus = review.status === 'featured' ? 'read' : 'featured';
      await updateReviewStatus(reviewId, newStatus);
      await loadData();
    } catch (err: any) {
      alert('Error al actualizar: ' + err.message);
    }
  };

  const handleCreatePost = (reviewId: string) => {
    console.log('Crear publicación para:', reviewId);
    // En producción, abrir modal para crear publicación social
    alert('Funcionalidad de crear publicación en desarrollo');
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Review & Testimonial Engine
            </h1>
            <p className="text-gray-600 mt-2">
              Gestiona tu reputación online y convierte testimonios en contenido de marketing
            </p>
          </div>
          <button
            onClick={handleSync}
            disabled={isSyncing}
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition disabled:opacity-50"
          >
            <RefreshCw className={`w-5 h-5 ${isSyncing ? 'animate-spin' : ''}`} />
            {isSyncing ? 'Sincronizando...' : 'Sincronizar'}
          </button>
        </div>

        {/* Error Banner */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
            <strong className="font-bold">Error:</strong>
            <span className="block sm:inline"> {error}</span>
          </div>
        )}

        {/* Stats Dashboard */}
        {isLoadingStats ? (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="bg-white rounded-lg border border-gray-200 p-6 animate-pulse">
                <div className="h-16 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        ) : stats ? (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center gap-2 mb-2">
                <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                <h3 className="text-sm font-medium text-gray-600">Puntuación Media</h3>
              </div>
              <p className="text-3xl font-bold text-gray-900">{stats.averageRating.toFixed(1)}</p>
              <p className="text-sm text-gray-600 mt-1">{stats.totalReviews} reseñas totales</p>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-5 h-5 text-green-600" />
                <h3 className="text-sm font-medium text-gray-600">Tasa de Conversión</h3>
              </div>
              <p className="text-3xl font-bold text-gray-900">{stats.requestConversionRate.toFixed(1)}%</p>
              <p className="text-sm text-gray-600 mt-1">Solicitudes → Reseñas</p>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center gap-2 mb-2">
                <Share2 className="w-5 h-5 text-purple-600" />
                <h3 className="text-sm font-medium text-gray-600">Conversiones a Contenido</h3>
              </div>
              <p className="text-3xl font-bold text-gray-900">{stats.reviewsConvertedToContent}</p>
              <p className="text-sm text-gray-600 mt-1">Este mes</p>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-sm font-medium text-gray-600 mb-2">Por Plataforma</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Google</span>
                  <span className="font-semibold">{stats.reviewsByPlatform.google}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Facebook</span>
                  <span className="font-semibold">{stats.reviewsByPlatform.facebook}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Web</span>
                  <span className="font-semibold">{stats.reviewsByPlatform.web}</span>
                </div>
              </div>
            </div>
          </div>
        ) : null}

        {/* Filters */}
        <ReviewFilterControls currentFilters={filters} onFilterChange={setFilters} />

        {/* Reviews List */}
        {isLoading ? (
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
          </div>
        ) : reviews.length === 0 ? (
          <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
            <Star className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No hay reseñas</h3>
            <p className="text-gray-600">No se encontraron reseñas con los filtros seleccionados</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {reviews.map((review) => (
              <ReviewCard
                key={review.id}
                review={review}
                onFeature={handleFeature}
                onCreatePost={handleCreatePost}
              />
            ))}
          </div>
        )}

        {/* Info Card */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-6 h-6 text-blue-600 mt-0.5" />
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                Consejos para gestionar tus reseñas
              </h3>
              <ul className="list-disc list-inside text-gray-700 space-y-1">
                <li>Responde siempre a las reseñas, especialmente las negativas, de forma profesional y constructiva</li>
                <li>Destaca las mejores reseñas para mostrarlas en tus landing pages y mejorar la conversión</li>
                <li>Convierte testimonios positivos en contenido de marketing para redes sociales</li>
                <li>Configura automatizaciones para solicitar reseñas en momentos clave del viaje del cliente</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

