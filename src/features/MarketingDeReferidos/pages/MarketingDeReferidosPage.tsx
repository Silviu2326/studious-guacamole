import React, { useState, useEffect } from 'react';
import { Layout } from '../../../components/layout';
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
import { Plus, BarChart3, Folder, AlertCircle } from 'lucide-react';

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
            <h1 className="text-3xl font-bold text-gray-900">Marketing de Referidos</h1>
            <p className="text-gray-600 mt-2">
              Transforma tus clientes en embajadores de tu marca
            </p>
          </div>
          <button
            onClick={() => setShowWizard(true)}
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
          >
            <Plus className="w-5 h-5" />
            Nueva Campaña
          </button>
        </div>

        {/* Stats Dashboard */}
        {stats && <ReferralStatsDashboard stats={stats} isLoading={isLoadingStats} />}

        {/* Campaigns Section */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Folder className="w-6 h-6" />
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
                <button
                  key={filter.id}
                  onClick={() => setFilterStatus(filter.id as any)}
                  className={`px-4 py-2 rounded-lg transition ${
                    filterStatus === filter.id
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {filter.label} ({getCampaignCount(filter.id as any)})
                </button>
              ))}
            </div>
          </div>

          {/* Campaigns Grid */}
          {isLoading ? (
            <div className="flex items-center justify-center min-h-[200px]">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
            </div>
          ) : filteredCampaigns.length === 0 ? (
            <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
              <Folder className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No hay campañas</h3>
              <p className="text-gray-600 mb-6">
                {filterStatus === 'all' 
                  ? 'Comienza creando tu primera campaña de referidos'
                  : `No hay campañas ${filterStatus === 'active' ? 'activas' : filterStatus === 'paused' ? 'pausadas' : 'archivadas'}`
                }
              </p>
              <button
                onClick={() => setShowWizard(true)}
                className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
              >
                <Plus className="w-5 h-5" />
                Crear Campaña
              </button>
            </div>
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

        {/* Wizard Modal */}
        {showWizard && (
          <CampaignWizard
            onSubmit={handleCreateCampaign}
            onCancel={() => setShowWizard(false)}
          />
        )}
      </div>
    </Layout>
  );
}

