import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { Card, Button, Table, Tabs, Modal, Input, Select } from '../../../components/componentsreutilizables';
import { ds } from '../../adherencia/ui/ds';
import { Lead, LeadFilters, LeadStatus, LeadSource } from '../types';
import { getLeads, createLead, updateLead, deleteLead } from '../api';
import { PipelineKanban } from './PipelineKanban';
import { LeadCapture } from './LeadCapture';
import { LeadHistory } from './LeadHistory';
import { LeadAnalytics } from './LeadAnalytics';
import { 
  Users, 
  Plus, 
  Filter, 
  Search, 
  TrendingUp,
  MessageSquare,
  BarChart3,
  List,
  Kanban,
  UserPlus,
  History
} from 'lucide-react';

interface LeadsManagerProps {
  businessType: 'entrenador' | 'gimnasio';
}

export const LeadsManager: React.FC<LeadsManagerProps> = ({ businessType }) => {
  const { user } = useAuth();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'kanban' | 'list'>('kanban');
  const [tabActiva, setTabActiva] = useState('pipeline');
  const [showCaptureModal, setShowCaptureModal] = useState(false);
  const [filters, setFilters] = useState<LeadFilters>({
    businessType,
    ...(businessType === 'entrenador' && user?.id ? { assignedTo: [user.id] } : {}),
  });
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadLeads();
  }, [filters, businessType, user?.id]);

  const loadLeads = async () => {
    setLoading(true);
    try {
      const updatedFilters = {
        ...filters,
        businessType,
        ...(businessType === 'entrenador' && user?.id ? { assignedTo: [user.id] } : {}),
        ...(searchTerm ? { search: searchTerm } : {}),
      };
      const data = await getLeads(updatedFilters);
      setLeads(data);
    } catch (error) {
      console.error('Error cargando leads:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateLead = async (leadData: Omit<Lead, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      await createLead(leadData);
      setShowCaptureModal(false);
      loadLeads();
    } catch (error) {
      console.error('Error creando lead:', error);
    }
  };

  const handleUpdateLead = async (id: string, updates: Partial<Lead>) => {
    try {
      await updateLead(id, updates);
      loadLeads();
    } catch (error) {
      console.error('Error actualizando lead:', error);
    }
  };

  const handleDeleteLead = async (id: string) => {
    if (window.confirm('¿Estás seguro de eliminar este lead?')) {
      try {
        await deleteLead(id);
        loadLeads();
      } catch (error) {
        console.error('Error eliminando lead:', error);
      }
    }
  };

  const tabs = [
    {
      id: 'pipeline',
      label: businessType === 'entrenador' ? 'Mis Leads' : 'Pipeline',
      icon: <Kanban className="w-4 h-4" />,
    },
    {
      id: 'list',
      label: 'Lista Completa',
      icon: <List className="w-4 h-4" />,
    },
    {
      id: 'analytics',
      label: 'Analytics',
      icon: <BarChart3 className="w-4 h-4" />,
    },
  ];

  const columns = [
    {
      key: 'name' as keyof Lead,
      label: 'Nombre',
      sortable: true,
      render: (value: any, row: Lead) => (
        <div>
          <div className={`${ds.typography.body} font-semibold ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>{row.name}</div>
          {row.email && (
            <div className={`${ds.typography.bodySmall} ${ds.color.textSecondary} ${ds.color.textSecondaryDark}`}>{row.email}</div>
          )}
        </div>
      ),
    },
    {
      key: 'source' as keyof Lead,
      label: 'Origen',
      render: (value: any) => {
        const sourceLabels: Record<LeadSource, string> = {
          instagram: 'Instagram',
          facebook: 'Facebook',
          tiktok: 'TikTok',
          whatsapp: 'WhatsApp',
          referido: 'Referido',
          landing_page: 'Landing Page',
          google_ads: 'Google Ads',
          evento: 'Evento',
          visita_centro: 'Visita Centro',
          campaña_pagada: 'Campaña Pagada',
          contenido_organico: 'Contenido Orgánico',
          otro: 'Otro',
        };
        return <span>{sourceLabels[value] || value}</span>;
      },
    },
    {
      key: 'stage' as keyof Lead,
      label: 'Etapa',
      render: (value: any) => {
        const stageLabels: Record<string, string> = {
          captacion: 'Captación',
          interes: 'Interés',
          calificacion: 'Calificación',
          oportunidad: 'Oportunidad',
          cierre: 'Cierre',
        };
        return <span>{stageLabels[value] || value}</span>;
      },
    },
    {
      key: 'status' as keyof Lead,
      label: 'Estado',
      render: (value: any) => {
        const statusLabels: Record<LeadStatus, string> = {
          new: 'Nuevo',
          contacted: 'Contactado',
          qualified: 'Calificado',
          nurturing: 'En Nurturing',
          meeting_scheduled: 'Reunión Agendada',
          proposal_sent: 'Propuesta Enviada',
          negotiation: 'En Negociación',
          converted: 'Convertido',
          lost: 'Perdido',
          unqualified: 'No Calificado',
        };
        return <span>{statusLabels[value] || value}</span>;
      },
    },
    {
      key: 'score' as keyof Lead,
      label: 'Score',
      sortable: true,
      render: (value: any) => (
        <div className="flex items-center gap-2">
          <span className={`${ds.typography.body} font-semibold ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>{value}</span>
          <div className={`w-2 h-2 ${ds.radius.full} ${
            value >= 70 ? ds.color.successBg + ' ' + ds.color.success : 
            value >= 50 ? ds.color.warningBg + ' ' + ds.color.warning : 
            ds.color.errorBg + ' ' + ds.color.error
          }`} />
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header con acciones */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h2 className={`${ds.typography.h2} ${ds.color.textPrimary} ${ds.color.textPrimaryDark} mb-2`}>
            {businessType === 'entrenador' ? 'Gestión de Leads 1 a 1' : 'Gestión de Pipeline Comercial'}
          </h2>
          <p className={`${ds.typography.body} ${ds.color.textSecondary} ${ds.color.textSecondaryDark}`}>
            {businessType === 'entrenador'
              ? 'Gestiona tus leads personales desde redes sociales y referidos'
              : 'Gestiona el pipeline comercial completo con múltiples leads y vendedores'}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="primary"
            size="md"
            onClick={() => setShowCaptureModal(true)}
          >
            <UserPlus className="w-4 h-4 mr-2" />
            Nuevo Lead
          </Button>
        </div>
      </div>

      {/* Búsqueda y filtros */}
      <Card>
        <div className={`${ds.spacing.lg} flex flex-col md:flex-row gap-4`}>
          <div className="flex-1">
            <Input
              placeholder="Buscar por nombre, email o teléfono..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              leftIcon={<Search className="w-4 h-4" />}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  loadLeads();
                }
              }}
            />
          </div>
          <Select
            value={filters.status?.[0] || ''}
            onChange={(e) => {
              const status = e.target.value;
              setFilters({
                ...filters,
                status: status ? [status as LeadStatus] : undefined,
              });
            }}
            options={[
              { value: '', label: 'Todos los estados' },
              { value: 'new', label: 'Nuevo' },
              { value: 'contacted', label: 'Contactado' },
              { value: 'qualified', label: 'Calificado' },
              { value: 'meeting_scheduled', label: 'Reunión Agendada' },
              { value: 'converted', label: 'Convertido' },
            ]}
            className="w-full md:w-48"
            fullWidth={false}
          />
        </div>
      </Card>

      {/* Navegación por tabs */}
      <Card>
        <div className={ds.spacing.xl}>
          <Tabs
            items={tabs}
            activeTab={tabActiva}
            onTabChange={setTabActiva}
            variant="pills"
          />
          
          <div className="mt-6">
            {tabActiva === 'pipeline' && (
              <PipelineKanban
                businessType={businessType}
                userId={businessType === 'entrenador' ? user?.id : undefined}
                onLeadUpdate={handleUpdateLead}
              />
            )}
            {tabActiva === 'list' && (
              <div>
                <div className="mb-4 flex items-center justify-between">
                  <h3 className={`${ds.typography.h3} ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
                    Lista de Leads
                  </h3>
                  <div className="flex items-center gap-2">
                    <Button
                      variant={viewMode === 'kanban' ? 'primary' : 'secondary'}
                      size="sm"
                      onClick={() => setViewMode('kanban')}
                    >
                      <Kanban className="w-4 h-4" />
                    </Button>
                    <Button
                      variant={viewMode === 'list' ? 'primary' : 'secondary'}
                      size="sm"
                      onClick={() => setViewMode('list')}
                    >
                      <List className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <Table
                  data={leads}
                  columns={columns}
                  loading={loading}
                  emptyMessage="No hay leads disponibles"
                />
              </div>
            )}
            {tabActiva === 'analytics' && (
              <LeadAnalytics businessType={businessType} userId={businessType === 'entrenador' ? user?.id : undefined} />
            )}
          </div>
        </div>
      </Card>

      {/* Modal de captura */}
      <Modal
        isOpen={showCaptureModal}
        onClose={() => setShowCaptureModal(false)}
        title="Capturar Nuevo Lead"
        size="lg"
      >
        <LeadCapture
          businessType={businessType}
          onSubmit={handleCreateLead}
          onCancel={() => setShowCaptureModal(false)}
        />
      </Modal>
    </div>
  );
};

