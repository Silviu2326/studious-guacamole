import React, { useState, useEffect } from 'react';
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
import { Plus, Users, Handshake, AlertCircle, Copy, Check, Search, Filter, X, Loader2 } from 'lucide-react';
import { Card, Button, Modal } from '../../../components/componentsreutilizables';

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
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);

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


  const activeFiltersCount = (filterType !== 'all' ? 1 : 0) + (filterStatus !== 'all' ? 1 : 0);

  const filteredPartners = partners.filter(partner => {
    const matchesSearch = !searchQuery || 
      partner.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      partner.specialty?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === 'all' || partner.type === filterType;
    const matchesStatus = filterStatus === 'all' || partner.status === filterStatus;
    return matchesSearch && matchesType && matchesStatus;
  });

  if (error && partners.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
          <Card className="p-8 text-center bg-white shadow-sm">
            <AlertCircle size={48} className="mx-auto text-red-500 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Error al cargar</h3>
            <p className="text-gray-600 mb-4">{error}</p>
          </Card>
        </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
        {/* Header */}
        <div className="border-b border-gray-200/60 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
          <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6">
            <div className="py-6">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-xl mr-4 ring-1 ring-blue-200/70">
                  <Handshake size={24} className="text-blue-600" />
                </div>
                <div>
                  <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900">
                    Partnerships & Influencers
                  </h1>
                  <p className="text-gray-600">
                    Gestiona tu red de colaboradores profesionales e influencers
                  </p>
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
              <Button onClick={() => setIsAddModalOpen(true)} leftIcon={<Plus size={20} />}>
                Añadir Partner
              </Button>
            </div>

            {/* Stats Dashboard */}
            {user && (
              <PartnersDashboardContainer trainerId={user.id} />
            )}

            {/* Sistema de Filtros */}
            <Card className="mb-6 bg-white shadow-sm">
              <div className="space-y-4">
                {/* Barra de búsqueda */}
                <div className="rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-3">
                  <div className="flex gap-4">
                    <div className="relative flex-1">
                      <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Buscar por nombre o especialidad..."
                        className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 pl-10 pr-3 py-2.5"
                      />
                    </div>
                    <Button
                      variant="secondary"
                      onClick={() => setShowFilters(!showFilters)}
                      leftIcon={<Filter size={18} />}
                    >
                      Filtros
                      {activeFiltersCount > 0 && (
                        <span className="ml-2 px-2 py-0.5 bg-blue-600 text-white text-xs rounded-full">
                          {activeFiltersCount}
                        </span>
                      )}
                    </Button>
                    {activeFiltersCount > 0 && (
                      <Button
                        variant="ghost"
                        onClick={() => {
                          setFilterType('all');
                          setFilterStatus('all');
                          setSearchQuery('');
                        }}
                        leftIcon={<X size={18} />}
                      >
                        Limpiar
                      </Button>
                    )}
                  </div>
                </div>

                {/* Panel de Filtros Avanzados */}
                {showFilters && (
                  <div className="rounded-2xl bg-white ring-1 ring-slate-200 p-4 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {/* Tipo de Partner */}
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          <Users size={16} className="inline mr-1" />
                          Tipo de Partner
                        </label>
                        <div className="flex gap-2 rounded-xl bg-slate-100 p-1">
                          {[
                            { id: 'all', label: 'Todos' },
                            { id: 'professional', label: 'Profesionales' },
                            { id: 'influencer', label: 'Influencers' }
                          ].map((filter) => (
                            <button
                              key={filter.id}
                              onClick={() => setFilterType(filter.id as any)}
                              className={`flex-1 inline-flex items-center justify-center rounded-xl px-3 py-2 text-sm font-medium transition-all ${
                                filterType === filter.id
                                  ? 'bg-white text-slate-900 shadow-sm ring-1 ring-slate-200'
                                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/70'
                              }`}
                            >
                              {filter.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Estado */}
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          <Award size={16} className="inline mr-1" />
                          Estado
                        </label>
                        <div className="flex gap-2 rounded-xl bg-slate-100 p-1">
                          {[
                            { id: 'all', label: 'Todos' },
                            { id: 'active', label: 'Activos' },
                            { id: 'inactive', label: 'Inactivos' }
                          ].map((filter) => (
                            <button
                              key={filter.id}
                              onClick={() => setFilterStatus(filter.id as any)}
                              className={`flex-1 inline-flex items-center justify-center rounded-xl px-3 py-2 text-sm font-medium transition-all ${
                                filterStatus === filter.id
                                  ? 'bg-white text-slate-900 shadow-sm ring-1 ring-slate-200'
                                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/70'
                              }`}
                            >
                              {filter.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Resumen de Resultados */}
                    <div className="flex justify-between items-center text-sm text-slate-600 border-t border-slate-200 pt-4">
                      <span>{filteredPartners.length} resultados encontrados</span>
                      <span>{activeFiltersCount} filtros aplicados</span>
                    </div>
                  </div>
                )}
              </div>
            </Card>

            {/* Partners List */}
            {isLoading ? (
              <Card className="p-8 text-center bg-white shadow-sm">
                <Loader2 size={48} className="mx-auto text-blue-500 animate-spin mb-4" />
                <p className="text-gray-600">Cargando...</p>
              </Card>
            ) : (
              <PartnersList
                partners={filteredPartners}
                onSelectPartner={handleSelectPartner}
                onGenerateLink={handleGenerateLink}
              />
            )}
          </div>
        </div>

        {/* Add Partner Modal */}
        <AddPartnerModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onPartnerAdded={handlePartnerAdded}
        />

        {/* Generated Link Modal */}
        {generatedLink && (
          <Modal
            isOpen={!!generatedLink}
            onClose={() => setGeneratedLink(null)}
            title="Link de Referido Generado"
            size="md"
            footer={
              <div className="flex gap-3">
                <Button variant="secondary" onClick={() => setGeneratedLink(null)}>
                  Cerrar
                </Button>
                <Button
                  variant="primary"
                  onClick={handleCopyLink}
                  leftIcon={copied ? <Check size={18} /> : <Copy size={18} />}
                >
                  {copied ? 'Copiado' : 'Copiar'}
                </Button>
              </div>
            }
          >
            <div className="space-y-4">
              <input
                type="text"
                value={generatedLink}
                readOnly
                className="w-full rounded-xl bg-slate-50 text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-4 py-2.5"
              />
            </div>
          </Modal>
        )}
      </div>
  );
}

