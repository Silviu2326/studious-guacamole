import React, { useState, useEffect } from 'react';
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
import { Plus, AlertCircle, Tag, Loader2, Package } from 'lucide-react';
import { Button } from '../../../components/componentsreutilizables';
import { Card } from '../../../components/componentsreutilizables';

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
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
          <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6 py-8">
            <Card className="p-8 text-center bg-white shadow-sm">
              <AlertCircle size={48} className="mx-auto text-red-500 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Error al cargar</h3>
              <p className="text-gray-600 mb-4">{error}</p>
              <Button onClick={loadData}>Reintentar</Button>
            </Card>
          </div>
        </div>
    );
  }

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
                    <Tag size={24} className="text-blue-600" />
                  </div>
                  
                  {/* Título y descripción */}
                  <div>
                    <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900">
                      Promociones, Cupones & Packs
                    </h1>
                    <p className="text-gray-600">
                      Crea y gestiona ofertas para impulsar tus ventas
                    </p>
                  </div>
                </div>
                <Button onClick={handleCreateOffer} leftIcon={<Plus size={20} />}>
                  Nueva Oferta
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Contenedor Principal */}
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6 py-8">
          <div className="space-y-6">
            {/* Error Banner */}
            {error && (
              <Card className="p-4 bg-red-50 border border-red-200 shadow-sm">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-red-600" />
                  <span className="text-sm font-medium text-red-700">Error: {error}</span>
                </div>
              </Card>
            )}

            {/* Stats Dashboard */}
            <OfferStatsDashboard stats={stats} isLoading={isLoadingStats} />

            {/* Filters */}
            <Card className="mb-6 bg-white shadow-sm">
              <div className="space-y-4">
                <div className="rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Filtrar por estado
                      </label>
                      <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value as any)}
                        className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5"
                      >
                        <option value="all">Todos</option>
                        <option value="active">Activas</option>
                        <option value="inactive">Inactivas</option>
                        <option value="expired">Expiradas</option>
                        <option value="scheduled">Programadas</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Filtrar por tipo
                      </label>
                      <select
                        value={filterType}
                        onChange={(e) => setFilterType(e.target.value as any)}
                        className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5"
                      >
                        <option value="all">Todos</option>
                        <option value="coupon">Cupones</option>
                        <option value="pack">Packs</option>
                        <option value="automatic">Automáticas</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Offers List */}
            {isLoading ? (
              <Card className="p-8 text-center bg-white shadow-sm">
                <Loader2 size={48} className="mx-auto text-blue-500 animate-spin mb-4" />
                <p className="text-gray-600">Cargando...</p>
              </Card>
            ) : (
              <OfferListTable
                offers={offers}
                onEdit={handleEditOffer}
                onViewStats={handleViewStats}
              />
            )}
          </div>
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
      </div>
  );
}

