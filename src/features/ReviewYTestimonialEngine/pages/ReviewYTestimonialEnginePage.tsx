import React, { useState, useEffect } from 'react';
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
import { RefreshCw, AlertCircle, Star, TrendingUp, Share2, MessageSquare, Loader2, Package } from 'lucide-react';
import { Card, MetricCards, Button } from '../../../components/componentsreutilizables';

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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Header */}
      <div className="border-b border-gray-200/60 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6">
          <div className="py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                {/* Icono con contenedor */}
                <div className="p-2 bg-blue-100 rounded-xl mr-4 ring-1 ring-blue-200/70">
                  <MessageSquare size={24} className="text-blue-600" />
                </div>
                
                {/* Título y descripción */}
                <div>
                  <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900">
                    Review & Testimonial Engine
                  </h1>
                  <p className="text-gray-600">
                    Gestiona tu reputación online y convierte testimonios en contenido de marketing
                  </p>
                </div>
              </div>
              <Button
                variant="primary"
                onClick={handleSync}
                disabled={isSyncing}
                loading={isSyncing}
                leftIcon={<RefreshCw size={20} />}
              >
                {isSyncing ? 'Sincronizando...' : 'Sincronizar'}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6 py-8">
        <div className="space-y-6">

          {/* Error Banner */}
          {error && (
            <Card className="p-8 text-center bg-white shadow-sm">
              <AlertCircle size={48} className="mx-auto text-red-500 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Error al cargar</h3>
              <p className="text-gray-600 mb-4">{error}</p>
              <Button onClick={loadData}>Reintentar</Button>
            </Card>
          )}

          {/* Stats Dashboard */}
          {isLoadingStats ? (
            <MetricCards
              data={[
                { id: '1', title: '', value: '', loading: true },
                { id: '2', title: '', value: '', loading: true },
                { id: '3', title: '', value: '', loading: true },
                { id: '4', title: '', value: '', loading: true },
              ]}
              columns={4}
            />
          ) : stats ? (
            <MetricCards
              data={[
                {
                  id: 'average-rating',
                  title: 'Puntuación Media',
                  value: stats.averageRating.toFixed(1),
                  subtitle: `${stats.totalReviews} reseñas totales`,
                  icon: <Star className="w-5 h-5" />,
                  color: 'info' as const,
                },
                {
                  id: 'conversion-rate',
                  title: 'Tasa de Conversión',
                  value: `${stats.requestConversionRate.toFixed(1)}%`,
                  subtitle: 'Solicitudes → Reseñas',
                  icon: <TrendingUp className="w-5 h-5" />,
                  color: 'success' as const,
                },
                {
                  id: 'content-conversions',
                  title: 'Conversiones a Contenido',
                  value: stats.reviewsConvertedToContent.toString(),
                  subtitle: 'Este mes',
                  icon: <Share2 className="w-5 h-5" />,
                  color: 'warning' as const,
                },
                {
                  id: 'platforms',
                  title: 'Por Plataforma',
                  value: `${stats.reviewsByPlatform.google + stats.reviewsByPlatform.facebook + stats.reviewsByPlatform.web}`,
                  subtitle: `G:${stats.reviewsByPlatform.google} F:${stats.reviewsByPlatform.facebook} W:${stats.reviewsByPlatform.web}`,
                  icon: <MessageSquare className="w-5 h-5" />,
                  color: 'primary' as const,
                },
              ]}
              columns={4}
            />
          ) : null}

        {/* Filters */}
        <ReviewFilterControls currentFilters={filters} onFilterChange={setFilters} />

          {/* Reviews List */}
          {isLoading ? (
            <Card className="p-8 text-center bg-white shadow-sm">
              <Loader2 size={48} className="mx-auto text-blue-500 animate-spin mb-4" />
              <p className="text-gray-600">Cargando...</p>
            </Card>
          ) : reviews.length === 0 ? (
            <Card className="p-8 text-center bg-white shadow-sm">
              <Package size={48} className="mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No hay reseñas</h3>
              <p className="text-gray-600 mb-4">No se encontraron reseñas con los filtros seleccionados</p>
            </Card>
          ) : (
            <div className="space-y-4">
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
          <Card className="bg-white shadow-sm">
            <div className="p-6">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-6 h-6 text-blue-600 mt-0.5" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
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
          </Card>
        </div>
      </div>
    </div>
  );
}

