import React, { useState, useEffect } from 'react';
import { ReferralStatsDashboard } from '../components/ReferralStatsDashboard';
import { CampaignStatusCard } from '../components/CampaignStatusCard';
import { CampaignWizard } from '../components/CampaignWizard';
import { 
  getReferralCampaigns, 
  getReferralStats, 
  createReferralCampaign, 
  updateReferralCampaign,
  ReferralCampaign, 
  ReferralStats 
} from '../api/referrals';
import { Plus, Folder, AlertCircle, Loader2, Package, Users } from 'lucide-react';
import { Card, Button } from '../../../components/componentsreutilizables';

export default function MarketingDeReferidosPage() {
  const [campaigns, setCampaigns] = useState<ReferralCampaign[]>([]);
  const [stats, setStats] = useState<ReferralStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingStats, setIsLoadingStats] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showWizard, setShowWizard] = useState(false);
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'paused' | 'archived'>('all');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const campaignsData = await getReferralCampaigns();
      const statsData = await getReferralStats();
      
      setCampaigns(campaignsData);
      setStats(statsData);
    } catch (err: any) {
      setError(err.message || 'Error al cargar los datos');
    } finally {
      setIsLoading(false);
      setIsLoadingStats(false);
    }
  };

  const handleCreateCampaign = async (campaignData: Omit<ReferralCampaign, 'id' | 'stats'>) => {
    try {
      const newCampaign = await createReferralCampaign(campaignData);
      setCampaigns(prev => [...prev, newCampaign]);
      setShowWizard(false);
    } catch (err: any) {
      alert('Error al crear la campaña: ' + err.message);
    }
  };

  const handleToggleStatus = async (campaignId: string) => {
    const campaign = campaigns.find(c => c.id === campaignId);
    if (!campaign) return;

    const newStatus = campaign.status === 'active' ? 'paused' : 'active';
    
    try {
      const updated = await updateReferralCampaign(campaignId, { status: newStatus });
      setCampaigns(prev => prev.map(c => c.id === campaignId ? updated : c));
    } catch (err: any) {
      alert('Error al actualizar la campaña: ' + err.message);
    }
  };

  const handleViewDetails = (campaignId: string) => {
    console.log('Ver detalles de campaña:', campaignId);
    // Implementar modal o navegación a página de detalles
  };

  const filteredCampaigns = filterStatus === 'all' 
    ? campaigns 
    : campaigns.filter(c => c.status === filterStatus);

  const getCampaignCount = (status: typeof filterStatus) => {
    if (status === 'all') return campaigns.length;
    return campaigns.filter(c => c.status === status).length;
  };

  if (error) {
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
                  <div className="p-2 bg-blue-100 rounded-xl mr-4 ring-1 ring-blue-200/70">
                    <Users size={24} className="text-blue-600" />
                  </div>
                  <div>
                    <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900">
                      Marketing de Referidos
                    </h1>
                    <p className="text-gray-600">
                      Transforma tus clientes en embajadores de tu marca
                    </p>
                  </div>
                </div>
                <Button onClick={() => setShowWizard(true)} leftIcon={<Plus size={20} />}>
                  Nueva Campaña
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Contenido Principal */}
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6 py-8">
          <div className="space-y-6">
            {/* Stats Dashboard */}
            {stats && <ReferralStatsDashboard stats={stats} isLoading={isLoadingStats} />}

            {/* Campaigns Section */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <Folder className="w-5 h-5" />
                  Campañas Activas
                </h2>

                {/* Filters */}
                <div className="flex gap-2">
                  {[
                    { id: 'all', label: 'Todas' },
                    { id: 'active', label: 'Activas' },
                    { id: 'paused', label: 'Pausadas' },
                    { id: 'archived', label: 'Archivadas' }
                  ].map((filter) => (
                    <Button
                      key={filter.id}
                      variant={filterStatus === filter.id ? 'primary' : 'secondary'}
                      size="sm"
                      onClick={() => setFilterStatus(filter.id as any)}
                    >
                      {filter.label} ({getCampaignCount(filter.id as any)})
                    </Button>
                  ))}
                </div>
              </div>

              {/* Campaigns Grid */}
              {isLoading ? (
                <Card className="p-8 text-center bg-white shadow-sm">
                  <Loader2 size={48} className="mx-auto text-blue-500 animate-spin mb-4" />
                  <p className="text-gray-600">Cargando...</p>
                </Card>
              ) : filteredCampaigns.length === 0 ? (
                <Card className="p-8 text-center bg-white shadow-sm">
                  <Package size={48} className="mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No hay campañas</h3>
                  <p className="text-gray-600 mb-4">
                    {filterStatus === 'all' 
                      ? 'Comienza creando tu primera campaña de referidos'
                      : `No hay campañas ${filterStatus === 'active' ? 'activas' : filterStatus === 'paused' ? 'pausadas' : 'archivadas'}`
                    }
                  </p>
                  <Button onClick={() => setShowWizard(true)} leftIcon={<Plus size={20} />}>
                    Crear Campaña
                  </Button>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredCampaigns.map((campaign) => (
                    <CampaignStatusCard
                      key={campaign.id}
                      campaign={campaign}
                      onViewDetails={handleViewDetails}
                      onToggleStatus={handleToggleStatus}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Wizard Modal */}
        {showWizard && (
          <CampaignWizard
            onSubmit={handleCreateCampaign}
            onCancel={() => setShowWizard(false)}
          />
        )}
      </div>
  );
}

