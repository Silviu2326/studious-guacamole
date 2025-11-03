import React, { useState, useEffect } from 'react';
import { Layout } from '../../../components/layout';
import { useAuth } from '../../../context/AuthContext';
import { PartnersList } from '../components/PartnersList';
import { PartnersDashboardContainer } from '../components/PartnersDashboardContainer';
import { AddPartnerModal } from '../components/AddPartnerModal';
import { 
  getPartners, 
  createPartner, 
  generateReferralLink,
  Partner,
  PartnerType,
  PartnerStatus
} from '../api/partnerships';
import { Plus, Users, Award, AlertCircle, Copy, Check } from 'lucide-react';

export default function PartnershipsYInfluencersPage() {
  const { user } = useAuth();
  const [partners, setPartners] = useState<Partner[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [filterType, setFilterType] = useState<'all' | PartnerType>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | PartnerStatus>('all');
  const [generatedLink, setGeneratedLink] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    loadPartners();
  }, [filterType, filterStatus]);

  const loadPartners = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const type = filterType === 'all' ? undefined : filterType;
      const status = filterStatus === 'all' ? undefined : filterStatus;
      const data = await getPartners(type, status);
      setPartners(data);
    } catch (err: any) {
      setError(err.message || 'Error al cargar los partners');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePartnerAdded = async (newPartner: Partner) => {
    try {
      const created = await createPartner(newPartner as any);
      setPartners(prev => [...prev, created]);
    } catch (err: any) {
      alert('Error al crear el partner: ' + err.message);
    }
  };

  const handleGenerateLink = async (partnerId: string) => {
    try {
      const link = await generateReferralLink(partnerId);
      setGeneratedLink(link);
    } catch (err: any) {
      alert('Error al generar el link: ' + err.message);
    }
  };

  const handleCopyLink = async () => {
    if (generatedLink) {
      await navigator.clipboard.writeText(generatedLink);
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
        setGeneratedLink(null);
      }, 2000);
    }
  };

  const handleSelectPartner = (partnerId: string) => {
    console.log('Ver detalles del partner:', partnerId);
    // Implementar modal o navegación a página de detalles
  };

  const getFilterCount = (type: typeof filterType | typeof filterStatus, subtype: 'type' | 'status') => {
    if (subtype === 'type' && type === 'all') return partners.length;
    if (subtype === 'type') return partners.filter(p => p.type === type).length;
    if (subtype === 'status' && type === 'all') return partners.length;
    return partners.filter(p => p.status === type).length;
  };

  if (error && partners.length === 0) {
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
            <h1 className="text-3xl font-bold text-gray-900">Partnerships & Influencers</h1>
            <p className="text-gray-600 mt-2">
              Gestiona tu red de colaboradores profesionales e influencers
            </p>
          </div>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
          >
            <Plus className="w-5 h-5" />
            Añadir Partner
          </button>
        </div>

        {/* Stats Dashboard */}
        {user && (
          <PartnersDashboardContainer trainerId={user.id} />
        )}

        {/* Partners Section */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Users className="w-6 h-6" />
              Mis Partners
            </h2>

            {/* Filters */}
            <div className="flex gap-2">
              {/* Type Filter */}
              <div className="flex gap-1 bg-gray-100 p-1 rounded-lg">
                {[
                  { id: 'all', label: 'Todos' },
                  { id: 'professional', label: 'Profesionales' },
                  { id: 'influencer', label: 'Influencers' }
                ].map((filter) => (
                  <button
                    key={filter.id}
                    onClick={() => setFilterType(filter.id as any)}
                    className={`px-3 py-1 rounded transition ${
                      filterType === filter.id
                        ? 'bg-purple-600 text-white'
                        : 'text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {filter.label} ({getFilterCount(filter.id as any, 'type')})
                  </button>
                ))}
              </div>

              {/* Status Filter */}
              <div className="flex gap-1 bg-gray-100 p-1 rounded-lg">
                {[
                  { id: 'all', label: 'Todos' },
                  { id: 'active', label: 'Activos' },
                  { id: 'inactive', label: 'Inactivos' }
                ].map((filter) => (
                  <button
                    key={filter.id}
                    onClick={() => setFilterStatus(filter.id as any)}
                    className={`px-3 py-1 rounded transition ${
                      filterStatus === filter.id
                        ? 'bg-green-600 text-white'
                        : 'text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {filter.label} ({getFilterCount(filter.id as any, 'status')})
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Partners List */}
          {isLoading ? (
            <div className="flex items-center justify-center min-h-[200px]">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
            </div>
          ) : (
            <PartnersList
              partners={partners}
              onSelectPartner={handleSelectPartner}
              onGenerateLink={handleGenerateLink}
            />
          )}
        </div>

        {/* Add Partner Modal */}
        <AddPartnerModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onPartnerAdded={handlePartnerAdded}
        />

        {/* Generated Link Modal */}
        {generatedLink && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg max-w-md w-full mx-4 p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Link de Referido Generado</h3>
              <div className="flex items-center gap-2 mb-4">
                <input
                  type="text"
                  value={generatedLink}
                  readOnly
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
                />
                <button
                  onClick={handleCopyLink}
                  className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
                >
                  {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                  {copied ? 'Copiado' : 'Copiar'}
                </button>
              </div>
              <button
                onClick={() => setGeneratedLink(null)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
              >
                Cerrar
              </button>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}

