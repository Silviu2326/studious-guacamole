import React, { useState, useEffect } from 'react';
import { Layout } from '../../../components/layout';
import { OfferListTable } from '../components/OfferListTable';
import { OfferFormModal } from '../components/OfferFormModal';
import { OfferStatsDashboard } from '../components/OfferStatsDashboard';
import {
  getOffers,
  createOffer,
  updateOffer,
  getOfferStats,
  Offer,
  OfferStats as OfferStatsType,
  OfferType,
  OfferStatus
} from '../api/offers';
import { Plus, AlertCircle, Tag } from 'lucide-react';

export default function PromocionesCuponesYPacksPage() {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [stats, setStats] = useState<OfferStatsType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingStats, setIsLoadingStats] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState<Offer | null>(null);
  const [filterStatus, setFilterStatus] = useState<OfferStatus | 'all'>('all');
  const [filterType, setFilterType] = useState<OfferType | 'all'>('all');

  const availableServices = [
    'Entrenamiento Personal',
    'Asesoría Nutricional',
    'Plan de Entrenamiento Mensual',
    'Plan de Entrenamiento Mensual Online',
    'Programa de Transformación 90 días',
    'Sesiones Individuales'
  ];

  useEffect(() => {
    loadData();
  }, [filterStatus, filterType]);

  const loadData = async () => {
    setIsLoading(true);
    setIsLoadingStats(true);
    setError(null);

    try {
      const status = filterStatus === 'all' ? undefined : filterStatus;
      const type = filterType === 'all' ? undefined : filterType;
      
      const [offersData, statsData] = await Promise.all([
        getOffers(status, type),
        getOfferStats()
      ]);

      setOffers(offersData);
      setStats(statsData);
    } catch (err: any) {
      setError(err.message || 'Error al cargar las ofertas');
    } finally {
      setIsLoading(false);
      setIsLoadingStats(false);
    }
  };

  const handleCreateOffer = () => {
    setSelectedOffer(null);
    setIsModalOpen(true);
  };

  const handleEditOffer = (offerId: string) => {
    const offer = offers.find(o => o.id === offerId);
    setSelectedOffer(offer || null);
    setIsModalOpen(true);
  };

  const handleViewStats = (offerId: string) => {
    console.log('View stats for:', offerId);
    // En producción, abrir modal con estadísticas detalladas
  };

  const handleSubmitOffer = async (offerData: Partial<Offer>) => {
    try {
      if (selectedOffer) {
        await updateOffer(selectedOffer.id, offerData);
      } else {
        await createOffer(offerData as any);
      }
      setIsModalOpen(false);
      setSelectedOffer(null);
      await loadData();
    } catch (err: any) {
      alert('Error al guardar: ' + err.message);
    }
  };

  if (error && offers.length === 0 && !stats) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <p className="text-red-600 font-medium">{error}</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Promociones, Cupones & Packs
            </h1>
            <p className="text-gray-600 mt-2">
              Crea y gestiona ofertas para impulsar tus ventas
            </p>
          </div>
          <button
            onClick={handleCreateOffer}
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
          >
            <Plus className="w-5 h-5" />
            Nueva Oferta
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
        <OfferStatsDashboard stats={stats} isLoading={isLoadingStats} />

        {/* Filters */}
        <div className="flex gap-4 items-center">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Filtrar por estado
            </label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
            >
              <option value="all">Todos</option>
              <option value="active">Activas</option>
              <option value="inactive">Inactivas</option>
              <option value="expired">Expiradas</option>
              <option value="scheduled">Programadas</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Filtrar por tipo
            </label>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as any)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
            >
              <option value="all">Todos</option>
              <option value="coupon">Cupones</option>
              <option value="pack">Packs</option>
              <option value="automatic">Automáticas</option>
            </select>
          </div>
        </div>

        {/* Offers List */}
        {isLoading ? (
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
          </div>
        ) : (
          <OfferListTable
            offers={offers}
            onEdit={handleEditOffer}
            onViewStats={handleViewStats}
          />
        )}
      </div>

      {/* Modal */}
      <OfferFormModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedOffer(null);
        }}
        onSubmit={handleSubmitOffer}
        initialData={selectedOffer}
        availableServices={availableServices}
      />
    </Layout>
  );
}

