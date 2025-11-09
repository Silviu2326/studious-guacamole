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
import { NurturingSequenceManager } from './NurturingSequenceManager';
import { ReportGenerator } from './ReportGenerator';
import { MessageTemplateManager } from './MessageTemplateManager';
import { TasksDashboard } from './TasksDashboard';
import { CalendarIntegration } from './CalendarIntegration';
import { AssignmentRulesManager } from './AssignmentRulesManager';
import { QuoteManager } from './QuoteManager';
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
  History,
  Calendar,
  FileDown,
  FileText,
  Zap,
  Receipt
} from 'lucide-react';

interface LeadsManagerProps {
  businessType: 'entrenador' | 'gimnasio';
  onOpenCaptureModalRef?: React.MutableRefObject<(() => void) | null>;
  showFollowUpsFilter?: boolean;
  onFollowUpsFilterChange?: (value: boolean) => void;
}

export const LeadsManager: React.FC<LeadsManagerProps> = ({ 
  businessType,
  onOpenCaptureModalRef,
  showFollowUpsFilter = false,
  onFollowUpsFilterChange,
}) => {
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
  const [quickFilter, setQuickFilter] = useState<'all' | 'pending_response' | 'follow_ups_today'>('all');
  const [probabilityFilter, setProbabilityFilter] = useState<{ min?: number; max?: number } | null>(null);
  const [showReportModal, setShowReportModal] = useState(false);

  // Exponer función de apertura de modal
  useEffect(() => {
    if (onOpenCaptureModalRef) {
      onOpenCaptureModalRef.current = () => setShowCaptureModal(true);
    }
  }, [onOpenCaptureModalRef]);

  // Aplicar filtro de seguimientos cuando cambia showFollowUpsFilter
  useEffect(() => {
    if (showFollowUpsFilter) {
      setQuickFilter('follow_ups_today');
      if (onFollowUpsFilterChange) {
        // Resetear después de aplicar
        setTimeout(() => {
          onFollowUpsFilterChange(false);
        }, 100);
      }
    }
  }, [showFollowUpsFilter, onFollowUpsFilterChange]);

  const loadLeads = async () => {
    setLoading(true);
    try {
      const updatedFilters = {
        ...filters,
        businessType,
        ...(businessType === 'entrenador' && user?.id ? { assignedTo: [user.id] } : {}),
        ...(searchTerm ? { search: searchTerm } : {}),
      };
      console.log('[LeadsManager] Cargando leads con filtros:', {
        updatedFilters,
        user: user ? { id: user.id, role: user.role, name: user.name } : null,
        businessType,
        quickFilter,
        searchTerm,
      });
      let data = await getLeads(updatedFilters);
      console.log('[LeadsManager] Leads obtenidos antes de filtros rápidos:', {
        total: data.length,
        leads: data.map(l => ({ id: l.id, name: l.name, assignedTo: l.assignedTo, status: l.status, stage: l.stage })),
      });
      
      // Aplicar filtros rápidos para entrenador
      if (businessType === 'entrenador') {
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const twoDaysAgo = new Date(today.getTime() - 48 * 60 * 60 * 1000);
        
        if (quickFilter === 'pending_response') {
          const beforeFilter = data.length;
          data = data.filter(l => {
            if (l.status === 'converted' || l.status === 'lost') return false;
            if (!l.lastContactDate) return true;
            const lastContact = new Date(l.lastContactDate);
            return lastContact < twoDaysAgo;
          });
          console.log('[LeadsManager] Filtro pending_response aplicado:', { before: beforeFilter, after: data.length });
        } else if (quickFilter === 'follow_ups_today') {
          const beforeFilter = data.length;
          data = data.filter(l => {
            if (!l.nextFollowUpDate) return false;
            const followUpDate = new Date(l.nextFollowUpDate);
            return followUpDate >= today && followUpDate < new Date(today.getTime() + 24 * 60 * 60 * 1000);
          });
          console.log('[LeadsManager] Filtro follow_ups_today aplicado:', { before: beforeFilter, after: data.length });
        }
      }
      
      // Aplicar filtro por probabilidad si está activo
      if (probabilityFilter) {
        const { PredictionService } = await import('../services/predictionService');
        const predictions = await PredictionService.getPredictions(data, businessType);
        const beforeProbability = data.length;
        data = data.filter(lead => {
          const prediction = predictions.get(lead.id);
          if (!prediction) return false;
          if (probabilityFilter.min !== undefined && prediction.probability < probabilityFilter.min) return false;
          if (probabilityFilter.max !== undefined && prediction.probability > probabilityFilter.max) return false;
          return true;
        });
        console.log('[LeadsManager] Filtro por probabilidad aplicado:', { before: beforeProbability, after: data.length, filter: probabilityFilter });
      }

      console.log('[LeadsManager] Leads finales después de filtros:', {
        total: data.length,
        leads: data.map(l => ({ id: l.id, name: l.name, assignedTo: l.assignedTo, status: l.status, stage: l.stage })),
      });
      setLeads(data);
    } catch (error) {
      console.error('[LeadsManager] Error cargando leads:', error);
    } finally {
      setLoading(false);
    }
  };

  // Cargar leads cuando cambian los filtros, búsqueda o filtro rápido
  useEffect(() => {
    loadLeads();
  }, [filters, businessType, user?.id, quickFilter, searchTerm, probabilityFilter]);

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
    {
      id: 'nurturing',
      label: businessType === 'entrenador' ? 'Respuestas Automáticas' : 'Nurturing',
      icon: <Zap className="w-4 h-4" />,
    },
    {
      id: 'templates',
      label: 'Plantillas',
      icon: <FileText className="w-4 h-4" />,
    },
    {
      id: 'tasks',
      label: 'Tareas',
      icon: <Calendar className="w-4 h-4" />,
    },
    {
      id: 'calendar',
      label: 'Calendario',
      icon: <Calendar className="w-4 h-4" />,
    },
    ...(businessType === 'gimnasio' ? [{
      id: 'assignment',
      label: 'Asignación',
      icon: <Users className="w-4 h-4" />,
    }] : []),
    {
      id: 'quotes',
      label: businessType === 'entrenador' ? 'Propuestas y Precios' : 'Presupuestos',
      icon: <Receipt className="w-4 h-4" />,
    },
  ];

  const columns = [
    {
      key: 'name' as keyof Lead,
      label: 'Nombre',
      sortable: true,
      render: (value: any, row: Lead) => (
        <div>
          <div className="text-base font-semibold text-gray-900 dark:text-[#F1F5F9]">{row.name}</div>
          {row.email && (
            <div className="text-sm text-gray-600 dark:text-[#94A3B8]">{row.email}</div>
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
          <span className="text-base font-semibold text-gray-900 dark:text-[#F1F5F9]">{value}</span>
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
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-[#F1F5F9] mb-2">
            {businessType === 'entrenador' ? 'Gestión de Leads 1 a 1' : 'Gestión de Pipeline Comercial'}
          </h2>
          <p className="text-base text-gray-600 dark:text-[#94A3B8]">
            {businessType === 'entrenador'
              ? 'Gestiona tus leads personales desde redes sociales y referidos'
              : 'Gestiona el pipeline comercial completo con múltiples leads y vendedores'}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="secondary"
            size="md"
            onClick={() => setShowReportModal(true)}
          >
            <FileDown className="w-4 h-4 mr-2" />
            Exportar/Reportes
          </Button>
        </div>
      </div>

      {/* Búsqueda y filtros */}
      <Card>
        <div className={`${ds.spacing.lg} space-y-4`}>
          <div className="flex flex-col md:flex-row gap-4">
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
          
          {/* Filtros rápidos para entrenador */}
          {businessType === 'entrenador' && (
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm text-gray-600 dark:text-[#94A3B8] mr-2">
                Filtros rápidos:
              </span>
              <Button
                variant={quickFilter === 'all' ? 'primary' : 'secondary'}
                size="sm"
                onClick={() => setQuickFilter('all')}
              >
                Todos
              </Button>
              <Button
                variant={quickFilter === 'pending_response' ? 'primary' : 'secondary'}
                size="sm"
                onClick={() => setQuickFilter('pending_response')}
              >
                <MessageSquare className="w-4 h-4 mr-1" />
                Pendientes de Respuesta
              </Button>
              <Button
                variant={quickFilter === 'follow_ups_today' ? 'primary' : 'secondary'}
                size="sm"
                onClick={() => setQuickFilter('follow_ups_today')}
              >
                <Calendar className="w-4 h-4 mr-1" />
                Seguimientos Hoy
              </Button>
            </div>
          )}

          {/* Filtro por probabilidad de conversión */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm text-gray-600 dark:text-[#94A3B8]">
              Probabilidad de conversión:
            </span>
            <Button
              variant={probabilityFilter?.min === 70 ? 'primary' : 'secondary'}
              size="sm"
              onClick={() => setProbabilityFilter({ min: 70 })}
            >
              Alta (70%+)
            </Button>
            <Button
              variant={probabilityFilter?.min === 50 && probabilityFilter?.max === 69 ? 'primary' : 'secondary'}
              size="sm"
              onClick={() => setProbabilityFilter({ min: 50, max: 69 })}
            >
              Media (50-69%)
            </Button>
            <Button
              variant={probabilityFilter?.min === 30 && probabilityFilter?.max === 49 ? 'primary' : 'secondary'}
              size="sm"
              onClick={() => setProbabilityFilter({ min: 30, max: 49 })}
            >
              Baja (30-49%)
            </Button>
            {probabilityFilter && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setProbabilityFilter(null)}
              >
                Limpiar
              </Button>
            )}
          </div>
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
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-[#F1F5F9]">
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
            {tabActiva === 'nurturing' && (
              <NurturingSequenceManager businessType={businessType} />
            )}
            {tabActiva === 'templates' && (
              <MessageTemplateManager businessType={businessType} />
            )}
            {tabActiva === 'tasks' && (
              <TasksDashboard
                businessType={businessType}
                userId={businessType === 'entrenador' ? user?.id : undefined}
              />
            )}
            {tabActiva === 'calendar' && (
              <CalendarIntegration
                businessType={businessType}
                userId={businessType === 'entrenador' ? user?.id : undefined}
              />
            )}
            {tabActiva === 'assignment' && businessType === 'gimnasio' && (
              <AssignmentRulesManager businessType={businessType} />
            )}
            {tabActiva === 'quotes' && (
              <QuoteManager businessType={businessType} />
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

      {/* Modal de exportación y reportes */}
      <ReportGenerator
        businessType={businessType}
        leads={leads}
        isOpen={showReportModal}
        onClose={() => setShowReportModal(false)}
      />
    </div>
  );
};
