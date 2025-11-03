import React, { useState, useEffect } from 'react';
import { Card } from '../../../components/componentsreutilizables';
import { getLeads, Lead } from '../api/inbox';
import { Inbox, AlertCircle, Loader2 } from 'lucide-react';
import { InboxMetrics } from './InboxMetrics';
import { LeadCard } from './LeadCard';
import { LeadFilters } from './LeadFilters';
import { SLAMonitoringPanel } from './SLAMonitoringPanel';
import { ChannelStats } from './ChannelStats';

export const LeadInboxContainer: React.FC = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<Lead['status'] | 'all'>('all');
  const [channelFilter, setChannelFilter] = useState<Lead['sourceChannel'] | 'all'>('all');
  const [slaFilter, setSlaFilter] = useState<Lead['slaStatus'] | 'all'>('all');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    loadLeads();
  }, []);

  const loadLeads = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await getLeads();
      setLeads(response.data);
    } catch (err: any) {
      setError(err.message || 'Error al cargar los leads');
    } finally {
      setIsLoading(false);
    }
  };

  // Calcular métricas
  const calculateMetrics = () => {
    const totalLeads = leads.length;
    const newLeads = leads.filter(l => l.status === 'new').length;
    const contactedLeads = leads.filter(l => l.status === 'contacted').length;
    const convertedLeads = leads.filter(l => l.status === 'converted').length;
    
    const onTimeSLA = leads.filter(l => l.slaStatus === 'on_time').length;
    const atRiskSLA = leads.filter(l => l.slaStatus === 'at_risk').length;
    const overdueSLA = leads.filter(l => l.slaStatus === 'overdue').length;
    
    const onTimePercentage = totalLeads > 0 ? Math.round((onTimeSLA / totalLeads) * 100) : 0;
    
    // Calcular tiempo promedio de respuesta (simulado)
    const avgResponseTime = 45; // En producción, calcular desde datos reales
    
    const conversionRate = totalLeads > 0 ? Math.round((convertedLeads / totalLeads) * 100) : 0;

    return {
      totalLeads,
      newLeads,
      contactedLeads,
      convertedLeads,
      onTimeSLA: onTimePercentage,
      atRiskSLA,
      overdueSLA,
      avgResponseTime,
      conversionRate
    };
  };

  // Filtrar leads
  const filteredLeads = leads.filter(lead => {
    // Filtro de búsqueda
    const matchesSearch = !searchQuery || 
      lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.lastMessageSnippet.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Filtro por estado
    const matchesStatus = statusFilter === 'all' || lead.status === statusFilter;
    
    // Filtro por canal
    const matchesChannel = channelFilter === 'all' || lead.sourceChannel === channelFilter;
    
    // Filtro por SLA
    const matchesSLA = slaFilter === 'all' || lead.slaStatus === slaFilter;
    
    return matchesSearch && matchesStatus && matchesChannel && matchesSLA;
  });

  const handleLeadSelect = (leadId: string) => {
    console.log('Ver conversación del lead:', leadId);
    // En producción, abrir modal o navegar a vista detallada
  };

  if (error) {
    return (
      <Card className="p-8 text-center bg-white shadow-sm">
        <AlertCircle size={48} className="mx-auto text-red-500 mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Error al cargar</h3>
        <p className="text-gray-600 mb-4">{error}</p>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <Card className="p-8 text-center bg-white shadow-sm">
        <Loader2 size={48} className="mx-auto text-blue-500 animate-spin mb-4" />
        <p className="text-gray-600">Cargando...</p>
      </Card>
    );
  }

  const metrics = calculateMetrics();

  return (
    <div className="space-y-6">
      {/* Métricas */}
      <InboxMetrics {...metrics} />

      {/* Grid con SLA Monitoring y Channel Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SLAMonitoringPanel
          totalLeads={metrics.totalLeads}
          onTime={leads.filter(l => l.slaStatus === 'on_time').length}
          atRisk={metrics.atRiskSLA}
          overdue={metrics.overdueSLA}
          avgResponseTime={metrics.avgResponseTime}
          slaTarget={60}
        />
        <ChannelStats leads={leads} />
      </div>

      {/* Filtros */}
      <LeadFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        channelFilter={channelFilter}
        onChannelFilterChange={setChannelFilter}
        slaFilter={slaFilter}
        onSlaFilterChange={setSlaFilter}
        showFilters={showFilters}
        onToggleFilters={() => setShowFilters(!showFilters)}
      />

      {/* Lista de leads */}
      {filteredLeads.length === 0 ? (
        <Card className="p-8 text-center bg-white shadow-sm">
          <Inbox size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {leads.length === 0 ? 'No hay leads' : 'No se encontraron leads'}
          </h3>
          <p className="text-gray-600">
            {leads.length === 0 
              ? 'Los nuevos leads aparecerán aquí'
              : 'Intenta ajustar los filtros de búsqueda'
            }
          </p>
        </Card>
      ) : (
        <>
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-gray-600">
              Mostrando <strong>{filteredLeads.length}</strong> de <strong>{leads.length}</strong> leads
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredLeads.map((lead) => (
              <LeadCard
                key={lead.id}
                lead={lead}
                onSelect={handleLeadSelect}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};
