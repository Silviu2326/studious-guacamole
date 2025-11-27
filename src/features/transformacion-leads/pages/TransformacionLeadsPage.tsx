import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { MetricCards, Button, Card, Select, Modal } from '../../../components/componentsreutilizables';
import { LeadsManager, LeadCapture } from '../../leads/components';
import { getLeads, createLead } from '../../leads/api';
import { Lead, LeadSource, LeadStatus } from '../../leads/types';
import {
  PipelineKanban,
  PipelineFilters,
  PipelineMetrics,
  PhaseConfigurator,
  PipelineAutomation,
  PipelineReports,
} from '../../pipeline-de-venta-kanban/components';
import FunnelPanel from '../components/FunnelPanel';
import { PipelineFilters as PipelineFiltersType } from '../../pipeline-de-venta-kanban/types';
import { getPipelineMetrics } from '../../pipeline-de-venta-kanban/api/metrics';
import { LeadInboxContainer } from '../../LeadInboxUnificadoYSla/components';
import { getLeads as getInboxLeads } from '../../LeadInboxUnificadoYSla/api/inbox';
import { 
  Users, 
  Kanban, 
  Inbox, 
  TrendingUp,
  Zap,
  UserPlus,
  Calendar,
  Target,
  MessageSquare,
  BarChart3,
  DollarSign,
  Settings,
  FileText,
  CalendarDays,
  AlertCircle,
  Loader2,
  Filter,
  X,
  Search,
  ArrowRight,
  Sparkles,
  Link2,
  RefreshCw,
  HelpCircle
} from 'lucide-react';

// Tipos para filtros globales
type DateRangePreset = 'this_month' | 'last_30_days' | 'last_7_days' | 'custom';
type SourceFilter = LeadSource | 'all';
type StatusFilter = LeadStatus | 'all';

interface GlobalFilters {
  dateRange: {
    preset: DateRangePreset;
    startDate: Date;
    endDate: Date;
  };
  source: SourceFilter;
  status: StatusFilter;
}

/**
 * Página unificada de Transformación de Leads
 * 
 * Combina tres features principales:
 * - Leads: Gestión completa de leads
 * - Pipeline de Venta Kanban: Visualización y gestión del pipeline
 * - Inbox Unificado & SLA: Centralización de conversaciones de leads
 * 
 * NOTA: Gestión de estados de carga y error
 * - Estados globales (isLoading, globalError): Representan la carga inicial y errores críticos
 *   que impiden el funcionamiento básico de la página (resumen de métricas, filtros, etc.)
 * - Errores locales: Los errores específicos de cada submódulo (listado de leads, pipeline, inbox)
 *   deben seguir manejándose dentro de esos módulos y no interfieren con los estados globales
 */
function TransformacionLeadsPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const esEntrenador = user?.role === 'entrenador';
  const businessType = esEntrenador ? 'entrenador' : 'gimnasio';
  const [activeTab, setActiveTab] = useState('leads');
  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null);

  // Estados globales de carga y error
  // Representan la carga inicial de datos clave (resumen de métricas, filtros, etc.)
  // y errores críticos que impiden el funcionamiento básico de la página
  const [isLoading, setIsLoading] = useState(true);
  const [globalError, setGlobalError] = useState<string | null>(null);

  // Estados para filtros globales
  const getDefaultDateRange = (): { preset: DateRangePreset; startDate: Date; endDate: Date } => {
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    return {
      preset: 'last_30_days',
      startDate: thirtyDaysAgo,
      endDate: now,
    };
  };

  const [globalFilters, setGlobalFilters] = useState<GlobalFilters>({
    dateRange: getDefaultDateRange(),
    source: 'all',
    status: 'all',
  });

  // Estados para Leads
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFollowUps, setShowFollowUps] = useState(false);
  const openCaptureModalRef = useRef<(() => void) | null>(null);
  const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Estados para Pipeline
  const [pipelineFilters, setPipelineFilters] = useState<PipelineFiltersType>({
    businessType,
  });
  const [pipelineActiveTab, setPipelineActiveTab] = useState('kanban');
  const [showPhaseConfig, setShowPhaseConfig] = useState(false);

  // Estados para el resumen de métricas
  const [summaryMetrics, setSummaryMetrics] = useState<{
    activeLeads: number;
    pendingResponse: number;
    conversionRate: number;
    wonThisMonth: number;
    inboxPending?: number;
  } | null>(null);
  const [summaryLoading, setSummaryLoading] = useState(true);
  const [summaryError, setSummaryError] = useState<string | null>(null);
  
  // Estado para almacenar leads completos para calcular recomendaciones
  const [allLeadsForRecommendations, setAllLeadsForRecommendations] = useState<Lead[]>([]);

  // Estados para SLA y banner
  const [slaMetrics, setSlaMetrics] = useState<{
    totalLeads: number;
    outsideSla: number;
    outsideSlaPercentage: number;
  } | null>(null);
  const [isSlaBannerDismissed, setIsSlaBannerDismissed] = useState(false);

  // Estados para búsqueda global
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Lead[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchResultsRef = useRef<HTMLDivElement>(null);

  // Estado para panel de filtros móvil
  const [isFiltersPanelOpen, setIsFiltersPanelOpen] = useState(false);

  // Refs para gestión de foco en tabs
  const tabPanelRefs = {
    leads: useRef<HTMLDivElement>(null),
    pipeline: useRef<HTMLDivElement>(null),
    inbox: useRef<HTMLDivElement>(null),
  };
  const tabButtonRefs = {
    leads: useRef<HTMLButtonElement>(null),
    pipeline: useRef<HTMLButtonElement>(null),
    inbox: useRef<HTMLButtonElement>(null),
  };

  // Estado para mostrar ayuda de atajos
  const [showShortcutsHelp, setShowShortcutsHelp] = useState(false);

  // Cargar leads
  const loadLeads = useCallback(async () => {
    setLoading(true);
    try {
      const filters: {
        businessType: 'entrenador' | 'gimnasio';
        assignedTo?: string[];
      } = {
        businessType,
        ...(businessType === 'entrenador' && user?.id ? { assignedTo: [user.id] } : {}),
      };
      const data = await getLeads(filters);
      setLeads(data);
    } catch (error) {
      console.error('[TransformacionLeadsPage] Error cargando leads:', error);
    } finally {
      setLoading(false);
    }
  }, [businessType, user?.id]);

  useEffect(() => {
    if (activeTab === 'leads') {
      loadLeads();
    }
  }, [activeTab, loadLeads]);

  // Cargar datos iniciales críticos de la página
  // Esta función carga los datos necesarios para que la página funcione correctamente
  // (resumen de métricas, filtros, pipeline básico)
  const loadInitialData = useCallback(async () => {
    setIsLoading(true);
    setGlobalError(null);
    setSummaryError(null);
    
    try {
      // Cargar datos de leads (crítico para el resumen)
      const leadsFilters: {
        businessType: 'entrenador' | 'gimnasio';
        assignedTo?: string[];
      } = {
        businessType,
        ...(businessType === 'entrenador' && user?.id ? { assignedTo: [user.id] } : {}),
      };
      const leadsData = await getLeads(leadsFilters);

      // Calcular métricas de leads
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const twoDaysAgo = new Date(today.getTime() - 48 * 60 * 60 * 1000);
      const thirtyDaysAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

      const activeLeads = leadsData.filter(l => l.status !== 'converted' && l.status !== 'lost');
      const pendingResponse = leadsData.filter(l => {
        if (l.status === 'converted' || l.status === 'lost') return false;
        if (!l.lastContactDate) return true;
        const lastContact = new Date(l.lastContactDate);
        return lastContact < twoDaysAgo;
      });
      const recentLeads = leadsData.filter(l => l.createdAt >= thirtyDaysAgo);
      const convertedRecent = recentLeads.filter(l => l.status === 'converted');
      const conversionRate = recentLeads.length > 0 
        ? Math.round((convertedRecent.length / recentLeads.length) * 100) 
        : 0;
      const wonThisMonth = leadsData.filter(l => 
        l.status === 'converted' && 
        l.conversionDate && 
        new Date(l.conversionDate) >= monthStart
      ).length;

      // Cargar métricas del pipeline (intentar, pero no es crítico si falla)
      let pipelineConversionRate = conversionRate;
      try {
        const pipelineMetrics = await getPipelineMetrics(businessType, esEntrenador ? user?.id : undefined);
        pipelineConversionRate = Math.round(pipelineMetrics.conversionRate);
      } catch (error) {
        console.error('[TransformacionLeadsPage] Error cargando métricas del pipeline:', error);
        // Usar la tasa de conversión de leads como fallback
      }

      // Cargar métricas del inbox (no crítico, puede fallar sin afectar la página)
      let inboxPending = 0;
      try {
        const inboxResponse = await getInboxLeads(1, 100);
        inboxPending = inboxResponse.data.filter(l => 
          l.status === 'new' || 
          (l.status === 'contacted' && (l.slaStatus === 'at_risk' || l.slaStatus === 'overdue'))
        ).length;

        // Calcular métricas de SLA para el banner
        const totalInboxLeads = inboxResponse.data.length;
        const outsideSlaLeads = inboxResponse.data.filter(l => 
          l.slaStatus === 'at_risk' || l.slaStatus === 'overdue'
        ).length;
        const outsideSlaPercentage = totalInboxLeads > 0 
          ? Math.round((outsideSlaLeads / totalInboxLeads) * 100) 
          : 0;

        setSlaMetrics({
          totalLeads: totalInboxLeads,
          outsideSla: outsideSlaLeads,
          outsideSlaPercentage,
        });
      } catch (error) {
        console.error('[TransformacionLeadsPage] Error cargando métricas del inbox:', error);
        // No es crítico, continuar sin esta métrica
      }

      setSummaryMetrics({
        activeLeads: activeLeads.length,
        pendingResponse: pendingResponse.length,
        conversionRate: pipelineConversionRate,
        wonThisMonth,
        inboxPending,
      });
      
      // Guardar leads para calcular recomendaciones
      setAllLeadsForRecommendations(leadsData);
      
      // Si llegamos aquí, la carga fue exitosa
      setGlobalError(null);
    } catch (error) {
      console.error('[TransformacionLeadsPage] Error crítico cargando datos iniciales:', error);
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'No se pudieron cargar los datos necesarios para la página. Por favor, verifica tu conexión e intenta de nuevo.';
      setGlobalError(errorMessage);
    } finally {
      setIsLoading(false);
      setSummaryLoading(false);
    }
  }, [businessType, user?.id, esEntrenador]);

  // Cargar métricas del resumen (función legacy, ahora usa loadInitialData)
  // Mantenida para compatibilidad con otros componentes
  const loadSummaryMetrics = useCallback(async () => {
    setSummaryLoading(true);
    setSummaryError(null);
    try {
      // Cargar datos de leads
      const leadsFilters: {
        businessType: 'entrenador' | 'gimnasio';
        assignedTo?: string[];
      } = {
        businessType,
        ...(businessType === 'entrenador' && user?.id ? { assignedTo: [user.id] } : {}),
      };
      const leadsData = await getLeads(leadsFilters);

      // Calcular métricas de leads
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const twoDaysAgo = new Date(today.getTime() - 48 * 60 * 60 * 1000);
      const thirtyDaysAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

      const activeLeads = leadsData.filter(l => l.status !== 'converted' && l.status !== 'lost');
      const pendingResponse = leadsData.filter(l => {
        if (l.status === 'converted' || l.status === 'lost') return false;
        if (!l.lastContactDate) return true;
        const lastContact = new Date(l.lastContactDate);
        return lastContact < twoDaysAgo;
      });
      const recentLeads = leadsData.filter(l => l.createdAt >= thirtyDaysAgo);
      const convertedRecent = recentLeads.filter(l => l.status === 'converted');
      const conversionRate = recentLeads.length > 0 
        ? Math.round((convertedRecent.length / recentLeads.length) * 100) 
        : 0;
      const wonThisMonth = leadsData.filter(l => 
        l.status === 'converted' && 
        l.conversionDate && 
        new Date(l.conversionDate) >= monthStart
      ).length;

      // Cargar métricas del pipeline
      let pipelineConversionRate = conversionRate;
      try {
        const pipelineMetrics = await getPipelineMetrics(businessType, esEntrenador ? user?.id : undefined);
        pipelineConversionRate = Math.round(pipelineMetrics.conversionRate);
      } catch (error) {
        console.error('[TransformacionLeadsPage] Error cargando métricas del pipeline:', error);
        // Usar la tasa de conversión de leads como fallback
      }

      // Cargar métricas del inbox (leads pendientes de respuesta)
      let inboxPending = 0;
      try {
        const inboxResponse = await getInboxLeads(1, 100);
        inboxPending = inboxResponse.data.filter(l => 
          l.status === 'new' || 
          (l.status === 'contacted' && (l.slaStatus === 'at_risk' || l.slaStatus === 'overdue'))
        ).length;

        // Calcular métricas de SLA para el banner
        const totalInboxLeads = inboxResponse.data.length;
        const outsideSlaLeads = inboxResponse.data.filter(l => 
          l.slaStatus === 'at_risk' || l.slaStatus === 'overdue'
        ).length;
        const outsideSlaPercentage = totalInboxLeads > 0 
          ? Math.round((outsideSlaLeads / totalInboxLeads) * 100) 
          : 0;

        setSlaMetrics({
          totalLeads: totalInboxLeads,
          outsideSla: outsideSlaLeads,
          outsideSlaPercentage,
        });
      } catch (error) {
        console.error('[TransformacionLeadsPage] Error cargando métricas del inbox:', error);
        // No es crítico, continuar sin esta métrica
      }

      setSummaryMetrics({
        activeLeads: activeLeads.length,
        pendingResponse: pendingResponse.length,
        conversionRate: pipelineConversionRate,
        wonThisMonth,
        inboxPending,
      });
      
      // Guardar leads para calcular recomendaciones
      setAllLeadsForRecommendations(leadsData);
    } catch (error) {
      console.error('[TransformacionLeadsPage] Error cargando métricas del resumen:', error);
      setSummaryError('No se han podido cargar las métricas de leads');
    } finally {
      setSummaryLoading(false);
    }
  }, [businessType, user?.id, esEntrenador]);

  // Función de reintento para errores globales
  const handleRetry = useCallback(() => {
    setGlobalError(null);
    setIsLoading(true);
    loadInitialData();
  }, [loadInitialData]);

  // Cargar datos iniciales al montar el componente
  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  // Manejar cambios en el rango de fechas
  const handleDateRangePresetChange = (preset: DateRangePreset) => {
    const now = new Date();
    let startDate: Date;
    let endDate: Date = now;

    switch (preset) {
      case 'this_month':
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
      case 'last_30_days':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case 'last_7_days':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case 'custom':
        // Mantener las fechas actuales
        startDate = globalFilters.dateRange.startDate;
        endDate = globalFilters.dateRange.endDate;
        break;
      default:
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    }

    setGlobalFilters({
      ...globalFilters,
      dateRange: {
        preset,
        startDate,
        endDate,
      },
    });
    // Resetear selección al cambiar filtros
    setSelectedLeadId(null);
  };

  const handleCustomDateChange = (type: 'start' | 'end', value: string) => {
    const date = new Date(value);
    if (isNaN(date.getTime())) return;

    setGlobalFilters({
      ...globalFilters,
      dateRange: {
        ...globalFilters.dateRange,
        preset: 'custom',
        [type === 'start' ? 'startDate' : 'endDate']: date,
      },
    });
  };

  const handleSourceChange = (source: SourceFilter) => {
    setGlobalFilters({
      ...globalFilters,
      source,
    });
    // Resetear selección al cambiar filtros
    setSelectedLeadId(null);
  };

  const handleStatusChange = (status: StatusFilter) => {
    setGlobalFilters({
      ...globalFilters,
      status,
    });
    // Resetear selección al cambiar filtros
    setSelectedLeadId(null);
  };

  // Handlers para selección de leads
  const handleSelectLead = (leadId: string) => {
    setSelectedLeadId(leadId);
  };

  const handleOpenLeadFromInbox = (leadId: string) => {
    setSelectedLeadId(leadId);
    // Opcional: cambiar a tab de Leads para ver la ficha
    // setActiveTab('leads');
  };

  const handleViewLeadInLeadsTab = (leadId: string) => {
    setSelectedLeadId(leadId);
    setActiveTab('leads');
  };

  const handleViewInPipeline = (leadId: string) => {
    setSelectedLeadId(leadId);
    setActiveTab('pipeline');
  };

  const handleClearSelection = () => {
    setSelectedLeadId(null);
  };

  // Handler para clicks en las fases del funnel
  const handleFunnelPhaseClick = (phase: 'nuevo' | 'contactado' | 'seguimiento' | 'ganado' | 'perdido', statusFilter?: LeadStatus) => {
    // Cambiar a la pestaña de pipeline
    setActiveTab('pipeline');
    
    // Mapear la fase del funnel a un filtro de estado
    // Para "contactado" y "seguimiento" que agrupan múltiples estados,
    // usamos el primer estado como representativo
    let statusToFilter: LeadStatus | 'all' = 'all';
    
    switch (phase) {
      case 'nuevo':
        statusToFilter = 'new';
        break;
      case 'contactado':
        // Puede ser 'contacted' o 'qualified', usamos 'contacted' como representativo
        statusToFilter = 'contacted';
        break;
      case 'seguimiento':
        // Agrupa 'nurturing', 'meeting_scheduled', 'proposal_sent', 'negotiation'
        // Usamos 'nurturing' como representativo, pero en una implementación más avanzada
        // podríamos filtrar por múltiples estados
        statusToFilter = 'nurturing';
        break;
      case 'ganado':
        statusToFilter = 'converted';
        break;
      case 'perdido':
        // Agrupa 'lost' y 'unqualified', usamos 'lost' como representativo
        statusToFilter = 'lost';
        break;
    }
    
    // Aplicar el filtro en los filtros globales
    if (statusToFilter !== 'all') {
      setGlobalFilters({
        ...globalFilters,
        status: statusToFilter,
      });
    }
    
    // También asegurar que el tab activo del pipeline sea 'kanban'
    setPipelineActiveTab('kanban');
  };

  // Calcular métricas de leads
  const calculateLeadsMetrics = () => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const twoDaysAgo = new Date(today.getTime() - 48 * 60 * 60 * 1000);
    const thirtyDaysAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

    const activeLeads = leads.filter(l => l.status !== 'converted' && l.status !== 'lost');
    
    const pendingResponse = leads.filter(l => {
      if (l.status === 'converted' || l.status === 'lost') return false;
      if (!l.lastContactDate) return true;
      const lastContact = new Date(l.lastContactDate);
      return lastContact < twoDaysAgo;
    });

    const followUpsToday = leads.filter(l => {
      if (!l.nextFollowUpDate) return false;
      const followUpDate = new Date(l.nextFollowUpDate);
      return followUpDate >= today && followUpDate < new Date(today.getTime() + 24 * 60 * 60 * 1000);
    });

    const recentLeads = leads.filter(l => l.createdAt >= thirtyDaysAgo);
    const convertedRecent = recentLeads.filter(l => l.status === 'converted');
    const conversionRate = recentLeads.length > 0 
      ? Math.round((convertedRecent.length / recentLeads.length) * 100) 
      : 0;

    return {
      activeLeads: activeLeads.length,
      pendingResponse: pendingResponse.length,
      followUpsToday: followUpsToday.length,
      conversionRate,
    };
  };

  const leadsMetrics = esEntrenador
    ? (() => {
        const calculated = calculateLeadsMetrics();
        return [
          {
            id: 'total',
            title: 'Total Leads Activos',
            value: calculated.activeLeads,
            subtitle: 'En pipeline',
            icon: <Users className="w-5 h-5" />,
            color: 'primary' as const,
            loading,
          },
          {
            id: 'pendientes',
            title: 'Pendientes de Respuesta',
            value: calculated.pendingResponse,
            subtitle: 'Sin respuesta 24-48h',
            icon: <MessageSquare className="w-5 h-5" />,
            color: 'warning' as const,
            loading,
          },
          {
            id: 'seguimientos',
            title: 'Seguimientos Hoy',
            value: calculated.followUpsToday,
            subtitle: 'Requieren atención',
            icon: <Calendar className="w-5 h-5" />,
            color: 'info' as const,
            loading,
          },
          {
            id: 'conversion',
            title: 'Tasa Conversión',
            value: `${calculated.conversionRate}%`,
            subtitle: 'Últimos 30 días',
            icon: <Target className="w-5 h-5" />,
            color: 'success' as const,
            loading,
          },
        ];
      })()
    : (() => {
        const calculated = calculateLeadsMetrics();
        return [
          {
            id: 'total',
            title: 'Total Leads',
            value: calculated.activeLeads,
            subtitle: 'En pipeline',
            icon: <Users className="w-5 h-5" />,
            color: 'primary' as const,
            loading,
          },
          {
            id: 'nuevos',
            title: 'Nuevos',
            value: leads.filter(l => {
              const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
              return l.createdAt >= weekAgo && l.status === 'new';
            }).length,
            subtitle: 'Últimos 7 días',
            icon: <TrendingUp className="w-5 h-5" />,
            color: 'info' as const,
            loading,
          },
          {
            id: 'convertidos',
            title: 'Convertidos',
            value: leads.filter(l => {
              const monthStart = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
              return l.status === 'converted' && l.conversionDate && l.conversionDate >= monthStart;
            }).length,
            subtitle: 'Este mes',
            icon: <Target className="w-5 h-5" />,
            color: 'success' as const,
            loading,
          },
          {
            id: 'conversion',
            title: 'Tasa Conversión',
            value: `${calculated.conversionRate}%`,
            subtitle: 'Promedio mensual',
            icon: <BarChart3 className="w-5 h-5" />,
            color: 'warning' as const,
            loading,
          },
        ];
      })();

  // Métricas de Pipeline
  const pipelineMetrics = esEntrenador
    ? [
        {
          id: 'total',
          title: 'Total Ventas',
          value: 12,
          subtitle: 'En pipeline',
          icon: <TrendingUp className="w-5 h-5" />,
          color: 'primary' as const,
        },
        {
          id: 'valor',
          title: 'Valor Total',
          value: '6.500€',
          subtitle: 'Valor potencial',
          icon: <DollarSign className="w-5 h-5" />,
          color: 'success' as const,
        },
        {
          id: 'conversion',
          title: 'Tasa Conversión',
          value: '33%',
          subtitle: 'Últimos 30 días',
          icon: <Target className="w-5 h-5" />,
          color: 'warning' as const,
          trend: {
            value: 5.2,
            direction: 'up' as const,
            label: 'vs mes anterior',
          },
        },
        {
          id: 'tiempo',
          title: 'Tiempo Promedio',
          value: '12 días',
          subtitle: 'Hasta el cierre',
          icon: <CalendarDays className="w-5 h-5" />,
          color: 'info' as const,
        },
      ]
    : [
        {
          id: 'total',
          title: 'Total Ventas',
          value: 45,
          subtitle: 'En pipeline',
          icon: <TrendingUp className="w-5 h-5" />,
          color: 'primary' as const,
        },
        {
          id: 'valor',
          title: 'Valor Total',
          value: '67.500€',
          subtitle: 'Valor potencial',
          icon: <DollarSign className="w-5 h-5" />,
          color: 'success' as const,
        },
        {
          id: 'conversion',
          title: 'Tasa Conversión',
          value: '22%',
          subtitle: 'Promedio mensual',
          icon: <Target className="w-5 h-5" />,
          color: 'warning' as const,
          trend: {
            value: 3.5,
            direction: 'up' as const,
            label: 'vs mes anterior',
          },
        },
        {
          id: 'tiempo',
          title: 'Tiempo Promedio',
          value: '18 días',
          subtitle: 'Hasta el cierre',
          icon: <CalendarDays className="w-5 h-5" />,
          color: 'info' as const,
        },
      ];

  const pipelineTabs = [
    {
      id: 'kanban',
      label: 'Pipeline Kanban',
      icon: <Kanban className="w-4 h-4" />,
    },
    {
      id: 'metrics',
      label: 'Métricas',
      icon: <BarChart3 className="w-4 h-4" />,
    },
    {
      id: 'reports',
      label: 'Reportes',
      icon: <FileText className="w-4 h-4" />,
    },
    {
      id: 'automation',
      label: 'Automatización',
      icon: <Settings className="w-4 h-4" />,
    },
  ];

  // Ordenar tabs: en móvil priorizar Inbox, Leads, Pipeline
  const mainTabs = [
    {
      id: 'inbox',
      label: 'Inbox',
      icon: Inbox,
      description: 'Centraliza todas tus conversaciones de leads con SLAs configurables',
    },
    {
      id: 'leads',
      label: 'Leads',
      icon: Users,
      description: esEntrenador 
        ? 'Gestiona tus leads desde Instagram, WhatsApp y referidos'
        : 'Pipeline comercial completo con captura desde múltiples canales',
    },
    {
      id: 'pipeline',
      label: 'Pipeline',
      icon: Kanban,
      description: esEntrenador
        ? 'Visualiza y gestiona tu pipeline de ventas personal'
        : 'Sistema completo de gestión de pipeline comercial',
    },
  ];

  const handleOpenCaptureModal = () => {
    if (openCaptureModalRef.current) {
      openCaptureModalRef.current();
    }
  };

  // Handler para cambiar de tab con gestión de foco
  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    // Mover el foco al panel de contenido después de un breve delay
    setTimeout(() => {
      const panelRef = tabPanelRefs[tabId as keyof typeof tabPanelRefs];
      if (panelRef?.current) {
        // Buscar el primer elemento enfocable dentro del panel
        const focusableElements = panelRef.current.querySelectorAll(
          'h1, h2, h3, button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
        );
        const firstFocusable = focusableElements[0] as HTMLElement;
        if (firstFocusable) {
          firstFocusable.focus();
        } else {
          panelRef.current.focus();
        }
      }
    }, 100);
  };

  // Handler para navegación por teclado en tabs (ArrowLeft/ArrowRight)
  const handleTabKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>, currentTabId: string) => {
    const tabIds = mainTabs.map(tab => tab.id);
    const currentIndex = tabIds.indexOf(currentTabId);

    let nextIndex = currentIndex;
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      nextIndex = currentIndex > 0 ? currentIndex - 1 : tabIds.length - 1;
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      nextIndex = currentIndex < tabIds.length - 1 ? currentIndex + 1 : 0;
    } else if (e.key === 'Home') {
      e.preventDefault();
      nextIndex = 0;
    } else if (e.key === 'End') {
      e.preventDefault();
      nextIndex = tabIds.length - 1;
    }

    if (nextIndex !== currentIndex) {
      const nextTabId = tabIds[nextIndex];
      handleTabChange(nextTabId);
      // Mover foco al botón de la nueva tab
      setTimeout(() => {
        const nextButtonRef = tabButtonRefs[nextTabId as keyof typeof tabButtonRefs];
        if (nextButtonRef?.current) {
          nextButtonRef.current.focus();
        }
      }, 50);
    }
  };

  // Atajos de teclado globales
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      // Ignorar si el usuario está escribiendo en un input, textarea o select
      const target = e.target as HTMLElement;
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.tagName === 'SELECT' ||
        target.isContentEditable
      ) {
        return;
      }

      // Ctrl+1 → Tab Leads
      if (e.ctrlKey && e.key === '1' && !e.shiftKey && !e.altKey) {
        e.preventDefault();
        handleTabChange('leads');
      }
      // Ctrl+2 → Tab Pipeline
      else if (e.ctrlKey && e.key === '2' && !e.shiftKey && !e.altKey) {
        e.preventDefault();
        handleTabChange('pipeline');
      }
      // Ctrl+3 → Tab Inbox
      else if (e.ctrlKey && e.key === '3' && !e.shiftKey && !e.altKey) {
        e.preventDefault();
        handleTabChange('inbox');
      }
      // Ctrl+N → Abrir modal "Nuevo lead"
      else if (e.ctrlKey && e.key === 'n' && !e.shiftKey && !e.altKey) {
        e.preventDefault();
        setIsLeadModalOpen(true);
      }
    };

    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => {
      window.removeEventListener('keydown', handleGlobalKeyDown);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Handler para crear lead desde el modal de la cabecera
  const handleCreateLead = async (leadData: Omit<Lead, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      // Preconfigurar assignedTo si es entrenador
      const leadToCreate = esEntrenador && user?.id
        ? { ...leadData, assignedTo: user.id }
        : leadData;

      await createLead(leadToCreate);
      setIsLeadModalOpen(false);
      
      // Refrescar datos
      if (activeTab === 'leads') {
        loadLeads();
      }
      loadSummaryMetrics();
      
      // Mostrar mensaje de éxito
      setSuccessMessage('Lead creado exitosamente');
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (error) {
      console.error('[TransformacionLeadsPage] Error creando lead:', error);
      setSuccessMessage('Error al crear el lead. Por favor, intenta de nuevo.');
      setTimeout(() => setSuccessMessage(null), 5000);
    }
  };

  const handleShowFollowUps = () => {
    setShowFollowUps(true);
  };

  // Generar métricas del resumen según el rol
  const getSummaryMetricsData = () => {
    if (!summaryMetrics) return [];

    const baseMetrics = [
      {
        id: 'active-leads',
        title: 'Leads Activos',
        value: summaryMetrics.activeLeads,
        subtitle: 'En pipeline',
        icon: <Users className="w-5 h-5" />,
        color: 'primary' as const,
      },
      {
        id: 'pending-response',
        title: 'Pendientes de Respuesta',
        value: summaryMetrics.pendingResponse,
        subtitle: 'Sin respuesta 24-48h',
        icon: <MessageSquare className="w-5 h-5" />,
        color: 'warning' as const,
      },
      {
        id: 'conversion-rate',
        title: 'Tasa de Conversión',
        value: `${summaryMetrics.conversionRate}%`,
        subtitle: esEntrenador ? 'Últimos 30 días' : 'Promedio mensual',
        icon: <Target className="w-5 h-5" />,
        color: 'success' as const,
      },
      {
        id: 'won-this-month',
        title: 'Leads Ganados',
        value: summaryMetrics.wonThisMonth,
        subtitle: 'Este mes',
        icon: <TrendingUp className="w-5 h-5" />,
        color: 'info' as const,
      },
    ];

    // Agregar métrica de inbox si está disponible
    if (summaryMetrics.inboxPending !== undefined) {
      baseMetrics.push({
        id: 'inbox-pending',
        title: 'Pendientes Inbox',
        value: summaryMetrics.inboxPending,
        subtitle: 'Requieren atención',
        icon: <Inbox className="w-5 h-5" />,
        color: 'warning' as const,
      });
    }

    return baseMetrics;
  };

  // Generar recomendaciones basadas en métricas actuales
  const getRecommendations = () => {
    if (!summaryMetrics) return [];

    const recommendations: Array<{
      id: string;
      title: string;
      description: string;
      action: () => void;
      priority: 'high' | 'medium' | 'low';
      icon: React.ReactNode;
    }> = [];

    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    
    // Calcular leads en fases intermedias
    const intermediatePhases = ['contacted', 'qualified', 'nurturing', 'meeting_scheduled', 'proposal_sent', 'negotiation'];
    const leadsInIntermediatePhases = allLeadsForRecommendations.filter(l => 
      intermediatePhases.includes(l.status) && l.status !== 'converted' && l.status !== 'lost' && l.status !== 'unqualified'
    ).length;

    // Calcular leads nuevos en últimos 7 días
    const newLeadsLast7Days = allLeadsForRecommendations.filter(l => 
      l.createdAt >= sevenDaysAgo && l.status === 'new'
    ).length;

    // Regla 1: Si hay muchos leads fuera de SLA → recomendar ir al Inbox
    if (slaMetrics && (slaMetrics.outsideSla > 5 || slaMetrics.outsideSlaPercentage > 20)) {
      recommendations.push({
        id: 'inbox-sla',
        title: esEntrenador ? 'Responder leads pendientes' : 'Revisar leads fuera de SLA',
        description: esEntrenador
          ? `Tienes ${slaMetrics?.outsideSla || 0} leads que requieren respuesta urgente. Revisa el Inbox para no perder oportunidades.`
          : `Hay ${slaMetrics?.outsideSla || 0} leads fuera de SLA (${slaMetrics?.outsideSlaPercentage || 0}% del total). Revisa el Inbox y delega si es necesario.`,
        action: () => {
          setActiveTab('inbox');
          setIsSlaBannerDismissed(true);
        },
        priority: 'high',
        icon: <Inbox className="w-5 h-5" />,
      });
    }

    // Regla 2: Si hay muchos leads en fases intermedias y pocos ganados → recomendar revisar el Pipeline
    if (leadsInIntermediatePhases > 5 && summaryMetrics.wonThisMonth < leadsInIntermediatePhases * 0.2) {
      recommendations.push({
        id: 'pipeline-review',
        title: esEntrenador ? 'Mover leads en el pipeline' : 'Revisar pipeline y delegar',
        description: esEntrenador
          ? `Tienes ${leadsInIntermediatePhases} leads en fases intermedias pero solo ${summaryMetrics.wonThisMonth} ganados este mes. Revisa el pipeline para identificar cuellos de botella.`
          : `Hay ${leadsInIntermediatePhases} leads en fases intermedias con baja conversión. Revisa el pipeline y delega leads estancados a tu equipo.`,
        action: () => {
          setActiveTab('pipeline');
          setPipelineActiveTab('kanban');
        },
        priority: leadsInIntermediatePhases > 10 ? 'high' : 'medium',
        icon: <Kanban className="w-5 h-5" />,
      });
    }

    // Regla 3: Si casi no hay leads nuevos en el periodo actual → recomendar crear campañas o nuevos leads
    if (newLeadsLast7Days < 3 && summaryMetrics.activeLeads < 10) {
      recommendations.push({
        id: 'create-leads',
        title: esEntrenador ? 'Crear nuevos leads' : 'Generar más leads',
        description: esEntrenador
          ? `Solo ${newLeadsLast7Days} leads nuevos en los últimos 7 días. Crea leads manualmente o revisa tus fuentes de captación.`
          : `Solo ${newLeadsLast7Days} leads nuevos en los últimos 7 días. Crea campañas o revisa tus canales de captación para aumentar el volumen.`,
        action: () => {
          setIsLeadModalOpen(true);
        },
        priority: newLeadsLast7Days === 0 ? 'high' : 'medium',
        icon: <UserPlus className="w-5 h-5" />,
      });
    }

    // Regla adicional: Si hay muchos pendientes de respuesta
    if (summaryMetrics.pendingResponse > 5 && recommendations.length < 2) {
      recommendations.push({
        id: 'pending-response',
        title: esEntrenador ? 'Contactar leads pendientes' : 'Revisar leads sin respuesta',
        description: esEntrenador
          ? `Tienes ${summaryMetrics.pendingResponse} leads sin respuesta en 24-48h. Contacta con ellos para mantener el momentum.`
          : `Hay ${summaryMetrics.pendingResponse} leads sin respuesta. Revisa y delega a tu equipo para asegurar seguimiento.`,
        action: () => {
          setActiveTab('leads');
        },
        priority: summaryMetrics.pendingResponse > 10 ? 'high' : 'medium',
        icon: <MessageSquare className="w-5 h-5" />,
      });
    }

    // Ordenar por prioridad (high primero)
    return recommendations.sort((a, b) => {
      const priorityOrder = { high: 0, medium: 1, low: 2 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    }).slice(0, 2); // Limitar a 2 recomendaciones
  };

  // Determinar si se debe mostrar el banner de SLA
  const shouldShowSlaBanner = () => {
    if (!slaMetrics || isSlaBannerDismissed) return false;
    // Mostrar si hay más de 5 leads fuera de SLA o más del 20%
    return slaMetrics.outsideSla > 5 || slaMetrics.outsideSlaPercentage > 20;
  };

  const handleGoToInbox = () => {
    setActiveTab('inbox');
    setIsSlaBannerDismissed(true); // Cerrar el banner cuando el usuario toma acción
  };

  // Función de búsqueda global de leads
  const handleGlobalSearch = useCallback(async (query: string, autoSelectSingle: boolean = false) => {
    if (!query.trim()) {
      setSearchResults([]);
      setShowSearchResults(false);
      return;
    }

    setIsSearching(true);
    try {
      const filters: {
        businessType: 'entrenador' | 'gimnasio';
        assignedTo?: string[];
        search: string;
      } = {
        businessType,
        search: query.trim(),
        ...(businessType === 'entrenador' && user?.id ? { assignedTo: [user.id] } : {}),
      };
      
      const results = await getLeads(filters);
      
      // Limitar a 5 resultados para el dropdown
      const limitedResults = results.slice(0, 5);
      setSearchResults(limitedResults);
      setShowSearchResults(limitedResults.length > 0);
      
      // Si hay un único resultado y se solicita auto-selección (al presionar Enter)
      if (autoSelectSingle && results.length === 1) {
        setSelectedLeadId(results[0].id);
        setActiveTab('leads');
        setSearchQuery('');
        setShowSearchResults(false);
      }
    } catch (error) {
      console.error('[TransformacionLeadsPage] Error en búsqueda global:', error);
      setSearchResults([]);
      setShowSearchResults(false);
    } finally {
      setIsSearching(false);
    }
  }, [businessType, user?.id]);

  // Manejar selección de resultado de búsqueda
  const handleSelectSearchResult = (leadId: string) => {
    setSelectedLeadId(leadId);
    setActiveTab('leads');
    setSearchQuery('');
    setShowSearchResults(false);
    // Scroll al lead seleccionado (se manejará en LeadsManager)
  };

  // Manejar búsqueda desde pipeline
  const handleViewInPipelineFromSearch = (leadId: string) => {
    setSelectedLeadId(leadId);
    setActiveTab('pipeline');
    setSearchQuery('');
    setShowSearchResults(false);
  };

  // Manejar búsqueda desde inbox
  const handleViewInInboxFromSearch = (leadId: string) => {
    setSelectedLeadId(leadId);
    setActiveTab('inbox');
    setSearchQuery('');
    setShowSearchResults(false);
  };

  // Manejar submit del formulario de búsqueda
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Al presionar Enter, si hay un único resultado, seleccionarlo automáticamente
    handleGlobalSearch(searchQuery, true);
  };

  // Debounce para búsqueda mientras se escribe
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchQuery.trim()) {
        handleGlobalSearch(searchQuery, false);
      } else {
        setSearchResults([]);
        setShowSearchResults(false);
      }
    }, 300); // Esperar 300ms después de que el usuario deje de escribir

    return () => clearTimeout(timeoutId);
  }, [searchQuery, handleGlobalSearch]);

  // Cerrar resultados al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchResultsRef.current &&
        !searchResultsRef.current.contains(event.target as Node) &&
        searchInputRef.current &&
        !searchInputRef.current.contains(event.target as Node)
      ) {
        setShowSearchResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Componente de skeleton global para la carga inicial
  // Muestra skeletons de las tarjetas de métricas, filtros, funnel panel y tabs
  const GlobalSkeleton = () => (
    <div className="border-b border-gray-200/60 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:border-gray-700/60 dark:bg-[#0F0F23]/80 dark:supports-[backdrop-filter]:dark:bg-[#0F0F23]/60">
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6">
        <div className="py-6 space-y-6">
          {/* Skeleton de métricas del resumen */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-24 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse" />
            ))}
          </div>

          {/* Skeleton de filtros globales */}
          <Card className="p-4 bg-white dark:bg-[#1E1E2E] shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="h-6 w-48 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse mb-4" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-10 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />
              ))}
            </div>
          </Card>

          {/* Skeleton del funnel panel */}
          <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse" />

          {/* Skeleton de tabs principales */}
          <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded-2xl animate-pulse" />
        </div>
      </div>
    </div>
  );

  // Componente de error global
  // Se muestra cuando hay errores críticos que impiden el funcionamiento de la página
  // NOTA: Los errores locales de submódulos (listado de leads, pipeline, inbox)
  // se manejan dentro de esos módulos y no se muestran aquí
  const GlobalErrorDisplay = () => (
    <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6 pt-6">
      <div className="mb-6 rounded-lg border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20 p-4 shadow-sm">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0">
            <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-semibold text-red-900 dark:text-red-100 mb-1">
              Error al cargar los datos de la página
            </h3>
            <p className="text-sm text-red-700 dark:text-red-200 mb-3">
              {globalError || 'No se pudieron cargar los datos necesarios para que la página funcione. Por favor, verifica tu conexión e intenta de nuevo.'}
            </p>
            <Button 
              variant="primary" 
              size="sm"
              onClick={handleRetry}
              className="bg-red-600 hover:bg-red-700 dark:bg-red-600 dark:hover:bg-red-700 text-white"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Reintentar
            </Button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-[#0F0F23] dark:via-[#1E1E2E] dark:to-[#0F0F23] overflow-x-hidden">
      {/* Header Unificado */}
      <div className="border-b border-gray-200/60 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:border-gray-700/60 dark:bg-[#0F0F23]/80 dark:supports-[backdrop-filter]:dark:bg-[#0F0F23]/60 sticky top-0 z-10">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6">
          <div className="py-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
              <div className="flex items-center">
                <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl mr-4 ring-1 ring-blue-200/70 dark:ring-blue-800/50 flex-shrink-0">
                  <TrendingUp size={24} className="text-white" />
                </div>
                <div className="min-w-0">
                  <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900 dark:text-[#F1F5F9]">
                    Transformación de Leads
                  </h1>
                  <p className="text-sm sm:text-base text-gray-600 dark:text-[#94A3B8] hidden sm:block">
                    {esEntrenador
                      ? 'Gestiona todo el ciclo de transformación de leads: captura, seguimiento y conversión'
                      : 'Sistema completo para gestionar el ciclo completo de transformación de leads desde la captura hasta la conversión'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
                {/* Buscador Global de Leads */}
                <div className="relative flex-1 max-w-md min-w-0">
                  <form onSubmit={handleSearchSubmit} className="relative">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500" />
                      <input
                        ref={searchInputRef}
                        type="text"
                        value={searchQuery}
                        onChange={(e) => {
                          setSearchQuery(e.target.value);
                        }}
                        placeholder="Buscar leads..."
                        className="w-full pl-10 pr-10 py-2 sm:py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm sm:text-base"
                      />
                      {isSearching && (
                        <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 animate-spin" />
                      )}
                      {searchQuery && !isSearching && (
                        <button
                          type="button"
                          onClick={() => {
                            setSearchQuery('');
                            setSearchResults([]);
                            setShowSearchResults(false);
                          }}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </form>

                  {/* Dropdown de resultados */}
                  {showSearchResults && searchResults.length > 0 && (
                    <div
                      ref={searchResultsRef}
                      className="absolute z-50 w-full mt-2 bg-white dark:bg-[#1E1E2E] border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg max-h-96 overflow-y-auto"
                    >
                      <div className="p-2">
                        <div className="px-3 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                          {searchResults.length === 1 
                            ? 'Resultado encontrado' 
                            : `${searchResults.length} resultados encontrados`}
                        </div>
                        {searchResults.map((lead) => (
                          <div
                            key={lead.id}
                            className="group px-3 py-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors cursor-pointer border-b border-gray-100 dark:border-gray-700 last:border-b-0"
                            onClick={() => handleSelectSearchResult(lead.id)}
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                  <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">
                                    {lead.name}
                                  </h4>
                                  {lead.status && (
                                    <span className={`px-2 py-0.5 text-xs rounded-full ${
                                      lead.status === 'converted' 
                                        ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                                        : lead.status === 'lost'
                                        ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                                        : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                                    }`}>
                                      {lead.status}
                                    </span>
                                  )}
                                </div>
                                {lead.email && (
                                  <p className="text-xs text-gray-600 dark:text-gray-400 truncate">
                                    📧 {lead.email}
                                  </p>
                                )}
                                {lead.phone && (
                                  <p className="text-xs text-gray-600 dark:text-gray-400 truncate">
                                    📱 {lead.phone}
                                  </p>
                                )}
                              </div>
                              <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 ml-2" />
                            </div>
                            {/* Acciones rápidas */}
                            <div className="flex items-center gap-2 mt-2 pt-2 border-t border-gray-100 dark:border-gray-700">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleSelectSearchResult(lead.id);
                                }}
                                className="flex-1 px-2 py-1.5 text-xs font-medium text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                                aria-label={`Ver ${lead.name} en leads`}
                              >
                                Ver en Leads
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleViewInPipelineFromSearch(lead.id);
                                }}
                                className="flex-1 px-2 py-1.5 text-xs font-medium text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500"
                                aria-label={`Ver ${lead.name} en pipeline`}
                              >
                                Ver en Pipeline
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleViewInInboxFromSearch(lead.id);
                                }}
                                className="flex-1 px-2 py-1.5 text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                aria-label={`Ver conversaciones de ${lead.name}`}
                              >
                                Ver Conversaciones
                              </button>
                            </div>
                          </div>
                        ))}
                        {searchResults.length >= 5 && (
                          <div className="px-3 py-2 text-xs text-gray-500 dark:text-gray-400 text-center border-t border-gray-100 dark:border-gray-700">
                            Mostrando los primeros 5 resultados. Refina tu búsqueda para más precisión.
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-900/30 rounded-lg border border-blue-200 dark:border-blue-800">
                  <Zap className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <span className="text-sm font-medium text-blue-900 dark:text-blue-100">
                    Vista Unificada
                  </span>
                </div>
                {/* Botones de acción en la cabecera */}
                <div className="flex items-center gap-2">
                  {/* Botón de ayuda de atajos */}
                  <button
                    type="button"
                    onClick={() => setShowShortcutsHelp(!showShortcutsHelp)}
                    className="p-2 rounded-lg text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    aria-label="Mostrar ayuda de atajos de teclado"
                    aria-expanded={showShortcutsHelp}
                    title="Atajos de teclado (Ctrl+?)"
                  >
                    <HelpCircle className="w-5 h-5" />
                  </button>
                  {/* Botón Nuevo Lead en la cabecera */}
                  <Button 
                    variant="primary" 
                    size="md"
                    onClick={() => setIsLeadModalOpen(true)}
                    className="whitespace-nowrap text-sm sm:text-base"
                    aria-label="Crear nuevo lead"
                  >
                    <UserPlus className="w-4 h-4 sm:mr-2" />
                    <span className="hidden sm:inline">Nuevo lead</span>
                    <span className="sm:hidden">Nuevo</span>
                  </Button>
                </div>
              </div>
            </div>

            {/* Resumen compacto de métricas clave, filtros, funnel y tabs */}
            {/* Solo se muestran cuando no hay carga global ni error global */}
            {!isLoading && !globalError && (
              <>
                {/* Resumen compacto de métricas clave */}
                {/* NOTA: Este estado local (summaryLoading, summaryError) se mantiene para compatibilidad
                    pero los estados globales (isLoading, globalError) tienen prioridad */}
                <div className="mb-6">
                  {summaryLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="h-24 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse" />
                      ))}
                    </div>
                  ) : summaryError ? (
                    <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-4 flex items-center gap-3">
                      <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0" />
                      <p className="text-sm text-yellow-800 dark:text-yellow-200">{summaryError}</p>
                    </div>
                  ) : summaryMetrics ? (
                    <>
                      {/* Desktop: Grid normal */}
                      <div className="hidden md:block">
                        <MetricCards 
                          data={getSummaryMetricsData()} 
                          columns={5} 
                        />
                      </div>
                      {/* Mobile: Carrusel horizontal */}
                      <div className="md:hidden overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
                        <div className="flex gap-4 min-w-max">
                          {getSummaryMetricsData().map((metric) => {
                            const colors = metric.color === 'success' 
                              ? { bg: 'bg-green-50 dark:bg-green-900/20', icon: 'bg-green-500 dark:bg-green-400', text: 'text-green-700 dark:text-green-400' }
                              : metric.color === 'warning'
                              ? { bg: 'bg-yellow-50 dark:bg-yellow-900/20', icon: 'bg-yellow-500 dark:bg-yellow-400', text: 'text-yellow-700 dark:text-yellow-400' }
                              : metric.color === 'info'
                              ? { bg: 'bg-blue-50 dark:bg-blue-900/20', icon: 'bg-blue-500 dark:bg-blue-400', text: 'text-blue-700 dark:text-blue-400' }
                              : { bg: 'bg-indigo-50 dark:bg-indigo-900/20', icon: 'bg-indigo-500 dark:bg-indigo-400', text: 'text-indigo-700 dark:text-indigo-400' };
                            
                            return (
                              <div
                                key={metric.id}
                                className={`${colors.bg} rounded-2xl p-4 min-w-[160px] flex-shrink-0`}
                              >
                                <div className="flex items-center mb-2">
                                  {metric.icon && (
                                    <div className={`w-10 h-10 ${colors.icon} rounded-xl flex items-center justify-center mr-3 flex-shrink-0`}>
                                      <div className="text-white text-lg">
                                        {metric.icon}
                                      </div>
                                    </div>
                                  )}
                                  <div className="flex-1 min-w-0">
                                    <p className={`text-xs font-semibold ${colors.text} mb-1 truncate`}>
                                      {metric.title}
                                    </p>
                                    <p className="text-xl font-bold text-gray-900 dark:text-gray-100">
                                      {metric.value}
                                    </p>
                                  </div>
                                </div>
                                {metric.subtitle && (
                                  <p className="text-xs text-gray-600 dark:text-gray-400 truncate">
                                    {metric.subtitle}
                                  </p>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </>
                  ) : null}
                </div>

                {/* Sección "Qué hacer ahora" - Recomendaciones */}
                {!summaryLoading && summaryMetrics && (
                  <div className="mb-6">
                    {(() => {
                      const recommendations = getRecommendations();
                      if (recommendations.length === 0) return null;
                      
                      return (
                        <Card className="p-4 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-900/20 dark:via-indigo-900/20 dark:to-purple-900/20 border border-blue-200 dark:border-blue-800 shadow-sm">
                          <div className="flex items-center gap-2 mb-4">
                            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                              <Sparkles className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                              Qué hacer ahora
                            </h3>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {recommendations.map((rec) => (
                              <div
                                key={rec.id}
                                className={`p-4 rounded-xl border transition-all ${
                                  rec.priority === 'high'
                                    ? 'bg-white dark:bg-[#1E1E2E] border-orange-200 dark:border-orange-800 shadow-sm hover:shadow-md'
                                    : 'bg-white/80 dark:bg-[#1E1E2E]/80 border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                                }`}
                              >
                                <div className="flex items-start gap-3 mb-3">
                                  <div className={`p-2 rounded-lg flex-shrink-0 ${
                                    rec.priority === 'high'
                                      ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400'
                                      : 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                                  }`}>
                                    {rec.icon}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-1">
                                      {rec.title}
                                    </h4>
                                    <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                                      {rec.description}
                                    </p>
                                  </div>
                                </div>
                                <Button
                                  variant={rec.priority === 'high' ? 'primary' : 'secondary'}
                                  size="sm"
                                  onClick={rec.action}
                                  className="w-full mt-3"
                                >
                                  {rec.id === 'inbox-sla' && 'Ir al Inbox'}
                                  {rec.id === 'pipeline-review' && 'Revisar Pipeline'}
                                  {rec.id === 'create-leads' && 'Crear Lead'}
                                  {rec.id === 'pending-response' && 'Ver Leads'}
                                  {!['inbox-sla', 'pipeline-review', 'create-leads', 'pending-response'].includes(rec.id) && 'Tomar acción'}
                                  <ArrowRight className="w-4 h-4 ml-2" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        </Card>
                      );
                    })()}
                  </div>
                )}

            {/* Filtros Globales */}
            <div className="mb-6">
              {/* Desktop: Mostrar filtros normalmente */}
              <Card className="hidden md:block p-4 bg-white dark:bg-[#1E1E2E] shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-2 mb-4">
                  <Filter className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    Filtros Globales
                  </h3>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    (Aplican a todas las vistas)
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* Filtro de Rango de Fechas */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      <Calendar className="w-4 h-4 inline mr-1" />
                      Rango de Fechas
                    </label>
                    <Select
                      options={[
                        { value: 'this_month', label: 'Este mes' },
                        { value: 'last_30_days', label: 'Últimos 30 días' },
                        { value: 'last_7_days', label: 'Últimos 7 días' },
                        { value: 'custom', label: 'Personalizado' },
                      ]}
                      value={globalFilters.dateRange.preset}
                      onChange={(e) => handleDateRangePresetChange(e.target.value as DateRangePreset)}
                      className="w-full"
                    />
                    {globalFilters.dateRange.preset === 'custom' && (
                      <div className="grid grid-cols-2 gap-2 mt-2">
                        <div>
                          <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">
                            Desde
                          </label>
                          <input
                            type="date"
                            value={globalFilters.dateRange.startDate.toISOString().split('T')[0]}
                            onChange={(e) => handleCustomDateChange('start', e.target.value)}
                            className="w-full rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2 text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">
                            Hasta
                          </label>
                          <input
                            type="date"
                            value={globalFilters.dateRange.endDate.toISOString().split('T')[0]}
                            onChange={(e) => handleCustomDateChange('end', e.target.value)}
                            className="w-full rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2 text-sm"
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Filtro de Fuente */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Fuente de Lead
                    </label>
                    <Select
                      options={[
                        { value: 'all', label: 'Todas las fuentes' },
                        { value: 'instagram', label: 'Instagram' },
                        { value: 'facebook', label: 'Facebook' },
                        { value: 'referido', label: 'Referidos' },
                        { value: 'landing_page', label: 'Web' },
                        { value: 'whatsapp', label: 'WhatsApp' },
                        { value: 'tiktok', label: 'TikTok' },
                        { value: 'google_ads', label: 'Google Ads' },
                        { value: 'evento', label: 'Evento' },
                        { value: 'visita_centro', label: 'Visita Centro' },
                        { value: 'campaña_pagada', label: 'Campaña Pagada' },
                        { value: 'contenido_organico', label: 'Contenido Orgánico' },
                        { value: 'otro', label: 'Otro' },
                      ]}
                      value={globalFilters.source}
                      onChange={(e) => handleSourceChange(e.target.value as SourceFilter)}
                      className="w-full"
                    />
                  </div>

                  {/* Filtro de Estado */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Estado
                    </label>
                    <Select
                      options={[
                        { value: 'all', label: 'Todos los estados' },
                        { value: 'new', label: 'Nuevo' },
                        { value: 'contacted', label: 'Contactado' },
                        { value: 'qualified', label: 'Calificado' },
                        { value: 'nurturing', label: 'En seguimiento' },
                        { value: 'meeting_scheduled', label: 'Reunión agendada' },
                        { value: 'proposal_sent', label: 'Propuesta enviada' },
                        { value: 'negotiation', label: 'En negociación' },
                        { value: 'converted', label: 'Ganado' },
                        { value: 'lost', label: 'Perdido' },
                        { value: 'unqualified', label: 'No calificado' },
                      ]}
                      value={globalFilters.status}
                      onChange={(e) => handleStatusChange(e.target.value as StatusFilter)}
                      className="w-full"
                    />
                  </div>

                  {/* Botón de Reset */}
                  <div className="flex items-end gap-2">
                    <Button
                      variant="secondary"
                      size="md"
                      onClick={() => {
                        setGlobalFilters({
                          dateRange: getDefaultDateRange(),
                          source: 'all',
                          status: 'all',
                        });
                        setSelectedLeadId(null);
                      }}
                      className="flex-1"
                    >
                      <Filter className="w-4 h-4 mr-2" />
                      Resetear Filtros
                    </Button>
                    {selectedLeadId && (
                      <Button
                        variant="ghost"
                        size="md"
                        onClick={handleClearSelection}
                        className="flex-1"
                        title="Limpiar selección de lead"
                      >
                        <X className="w-4 h-4 mr-2" />
                        Limpiar Selección
                      </Button>
                    )}
                  </div>
                </div>
              </Card>

              {/* Mobile: Botón para abrir panel de filtros */}
              <div className="md:hidden">
                <Button
                  variant="secondary"
                  size="md"
                  onClick={() => setIsFiltersPanelOpen(true)}
                  className="w-full justify-between"
                >
                  <div className="flex items-center gap-2">
                    <Filter className="w-4 h-4" />
                    <span>Filtros</span>
                    {(globalFilters.source !== 'all' || globalFilters.status !== 'all' || globalFilters.dateRange.preset !== 'last_30_days') && (
                      <span className="px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-full text-xs font-medium">
                        {[
                          globalFilters.source !== 'all' ? 1 : 0,
                          globalFilters.status !== 'all' ? 1 : 0,
                          globalFilters.dateRange.preset !== 'last_30_days' ? 1 : 0
                        ].reduce((a, b) => a + b, 0)}
                      </span>
                    )}
                  </div>
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Panel deslizante de filtros para móvil */}
            {isFiltersPanelOpen && (
              <>
                {/* Overlay */}
                <div 
                  className="fixed inset-0 bg-black/50 z-40 md:hidden"
                  onClick={() => setIsFiltersPanelOpen(false)}
                />
                {/* Panel */}
                <div className="fixed inset-y-0 right-0 z-50 w-full max-w-sm bg-white dark:bg-[#1E1E2E] shadow-xl transform transition-transform duration-300 ease-in-out md:hidden overflow-y-auto">
                  <div className="sticky top-0 bg-white dark:bg-[#1E1E2E] border-b border-gray-200 dark:border-gray-700 p-4 flex items-center justify-between z-10">
                    <div className="flex items-center gap-2">
                      <Filter className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                        Filtros Globales
                      </h3>
                    </div>
                    <button
                      onClick={() => setIsFiltersPanelOpen(false)}
                      className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                      aria-label="Cerrar filtros"
                    >
                      <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                    </button>
                  </div>
                  <div className="p-4 space-y-6">
                    {/* Filtro de Rango de Fechas */}
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        <Calendar className="w-4 h-4 inline mr-1" />
                        Rango de Fechas
                      </label>
                      <Select
                        options={[
                          { value: 'this_month', label: 'Este mes' },
                          { value: 'last_30_days', label: 'Últimos 30 días' },
                          { value: 'last_7_days', label: 'Últimos 7 días' },
                          { value: 'custom', label: 'Personalizado' },
                        ]}
                        value={globalFilters.dateRange.preset}
                        onChange={(e) => handleDateRangePresetChange(e.target.value as DateRangePreset)}
                        className="w-full"
                      />
                      {globalFilters.dateRange.preset === 'custom' && (
                        <div className="grid grid-cols-2 gap-2 mt-2">
                          <div>
                            <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">
                              Desde
                            </label>
                            <input
                              type="date"
                              value={globalFilters.dateRange.startDate.toISOString().split('T')[0]}
                              onChange={(e) => handleCustomDateChange('start', e.target.value)}
                              className="w-full rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2 text-sm"
                            />
                          </div>
                          <div>
                            <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">
                              Hasta
                            </label>
                            <input
                              type="date"
                              value={globalFilters.dateRange.endDate.toISOString().split('T')[0]}
                              onChange={(e) => handleCustomDateChange('end', e.target.value)}
                              className="w-full rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2 text-sm"
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Filtro de Fuente */}
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Fuente de Lead
                      </label>
                      <Select
                        options={[
                          { value: 'all', label: 'Todas las fuentes' },
                          { value: 'instagram', label: 'Instagram' },
                          { value: 'facebook', label: 'Facebook' },
                          { value: 'referido', label: 'Referidos' },
                          { value: 'landing_page', label: 'Web' },
                          { value: 'whatsapp', label: 'WhatsApp' },
                          { value: 'tiktok', label: 'TikTok' },
                          { value: 'google_ads', label: 'Google Ads' },
                          { value: 'evento', label: 'Evento' },
                          { value: 'visita_centro', label: 'Visita Centro' },
                          { value: 'campaña_pagada', label: 'Campaña Pagada' },
                          { value: 'contenido_organico', label: 'Contenido Orgánico' },
                          { value: 'otro', label: 'Otro' },
                        ]}
                        value={globalFilters.source}
                        onChange={(e) => handleSourceChange(e.target.value as SourceFilter)}
                        className="w-full"
                      />
                    </div>

                    {/* Filtro de Estado */}
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Estado
                      </label>
                      <Select
                        options={[
                          { value: 'all', label: 'Todos los estados' },
                          { value: 'new', label: 'Nuevo' },
                          { value: 'contacted', label: 'Contactado' },
                          { value: 'qualified', label: 'Calificado' },
                          { value: 'nurturing', label: 'En seguimiento' },
                          { value: 'meeting_scheduled', label: 'Reunión agendada' },
                          { value: 'proposal_sent', label: 'Propuesta enviada' },
                          { value: 'negotiation', label: 'En negociación' },
                          { value: 'converted', label: 'Ganado' },
                          { value: 'lost', label: 'Perdido' },
                          { value: 'unqualified', label: 'No calificado' },
                        ]}
                        value={globalFilters.status}
                        onChange={(e) => handleStatusChange(e.target.value as StatusFilter)}
                        className="w-full"
                      />
                    </div>

                    {/* Botones de acción */}
                    <div className="flex flex-col gap-2 pt-4 border-t border-gray-200 dark:border-gray-700">
                      <Button
                        variant="primary"
                        size="md"
                        onClick={() => setIsFiltersPanelOpen(false)}
                        className="w-full"
                      >
                        Aplicar Filtros
                      </Button>
                      <Button
                        variant="secondary"
                        size="md"
                        onClick={() => {
                          setGlobalFilters({
                            dateRange: getDefaultDateRange(),
                            source: 'all',
                            status: 'all',
                          });
                          setSelectedLeadId(null);
                        }}
                        className="w-full"
                      >
                        <Filter className="w-4 h-4 mr-2" />
                        Resetear Filtros
                      </Button>
                      {selectedLeadId && (
                        <Button
                          variant="ghost"
                          size="md"
                          onClick={() => {
                            handleClearSelection();
                            setIsFiltersPanelOpen(false);
                          }}
                          className="w-full"
                        >
                          <X className="w-4 h-4 mr-2" />
                          Limpiar Selección
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Panel de Funnel - Siempre visible */}
            <div className="mb-6">
              <FunnelPanel
                businessType={businessType}
                userId={esEntrenador ? user?.id : undefined}
                onFunnelPhaseClick={handleFunnelPhaseClick}
              />
            </div>

            {/* Resumen de métricas y botón Nuevo Lead */}
            <div className="mb-6 space-y-4">
              {/* Métricas por pestaña (mantener compatibilidad) */}
              <div>
                {activeTab === 'leads' && (
                  <>
                    <div className="hidden md:block">
                      <MetricCards data={leadsMetrics} columns={4} />
                    </div>
                    <div className="md:hidden overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
                      <div className="flex gap-4 min-w-max">
                        {leadsMetrics.map((metric) => {
                          const colors = metric.color === 'success' 
                            ? { bg: 'bg-green-50 dark:bg-green-900/20', icon: 'bg-green-500 dark:bg-green-400', text: 'text-green-700 dark:text-green-400' }
                            : metric.color === 'warning'
                            ? { bg: 'bg-yellow-50 dark:bg-yellow-900/20', icon: 'bg-yellow-500 dark:bg-yellow-400', text: 'text-yellow-700 dark:text-yellow-400' }
                            : metric.color === 'info'
                            ? { bg: 'bg-blue-50 dark:bg-blue-900/20', icon: 'bg-blue-500 dark:bg-blue-400', text: 'text-blue-700 dark:text-blue-400' }
                            : { bg: 'bg-indigo-50 dark:bg-indigo-900/20', icon: 'bg-indigo-500 dark:bg-indigo-400', text: 'text-indigo-700 dark:text-indigo-400' };
                          
                          return (
                            <div
                              key={metric.id}
                              className={`${colors.bg} rounded-2xl p-4 min-w-[160px] flex-shrink-0`}
                            >
                              <div className="flex items-center mb-2">
                                {metric.icon && (
                                  <div className={`w-10 h-10 ${colors.icon} rounded-xl flex items-center justify-center mr-3 flex-shrink-0`}>
                                    <div className="text-white text-lg">
                                      {metric.icon}
                                    </div>
                                  </div>
                                )}
                                <div className="flex-1 min-w-0">
                                  <p className={`text-xs font-semibold ${colors.text} mb-1 truncate`}>
                                    {metric.title}
                                  </p>
                                  <p className="text-xl font-bold text-gray-900 dark:text-gray-100">
                                    {metric.value}
                                  </p>
                                </div>
                              </div>
                              {metric.subtitle && (
                                <p className="text-xs text-gray-600 dark:text-gray-400 truncate">
                                  {metric.subtitle}
                                </p>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </>
                )}
                {activeTab === 'pipeline' && (
                  <>
                    <div className="hidden md:block">
                      <MetricCards data={pipelineMetrics} columns={4} />
                    </div>
                    <div className="md:hidden overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
                      <div className="flex gap-4 min-w-max">
                        {pipelineMetrics.map((metric) => {
                          const colors = metric.color === 'success' 
                            ? { bg: 'bg-green-50 dark:bg-green-900/20', icon: 'bg-green-500 dark:bg-green-400', text: 'text-green-700 dark:text-green-400' }
                            : metric.color === 'warning'
                            ? { bg: 'bg-yellow-50 dark:bg-yellow-900/20', icon: 'bg-yellow-500 dark:bg-yellow-400', text: 'text-yellow-700 dark:text-yellow-400' }
                            : metric.color === 'info'
                            ? { bg: 'bg-blue-50 dark:bg-blue-900/20', icon: 'bg-blue-500 dark:bg-blue-400', text: 'text-blue-700 dark:text-blue-400' }
                            : { bg: 'bg-indigo-50 dark:bg-indigo-900/20', icon: 'bg-indigo-500 dark:bg-indigo-400', text: 'text-indigo-700 dark:text-indigo-400' };
                          
                          return (
                            <div
                              key={metric.id}
                              className={`${colors.bg} rounded-2xl p-4 min-w-[160px] flex-shrink-0`}
                            >
                              <div className="flex items-center mb-2">
                                {metric.icon && (
                                  <div className={`w-10 h-10 ${colors.icon} rounded-xl flex items-center justify-center mr-3 flex-shrink-0`}>
                                    <div className="text-white text-lg">
                                      {metric.icon}
                                    </div>
                                  </div>
                                )}
                                <div className="flex-1 min-w-0">
                                  <p className={`text-xs font-semibold ${colors.text} mb-1 truncate`}>
                                    {metric.title}
                                  </p>
                                  <p className="text-xl font-bold text-gray-900 dark:text-gray-100">
                                    {metric.value}
                                  </p>
                                </div>
                              </div>
                              {metric.subtitle && (
                                <p className="text-xs text-gray-600 dark:text-gray-400 truncate">
                                  {metric.subtitle}
                                </p>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </>
                )}
                {activeTab === 'inbox' && (
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Métricas del inbox se mostrarán aquí
                  </div>
                )}
              </div>
              
              {/* Botones de acción */}
              <div className="flex items-center justify-end gap-2 sm:gap-3 flex-wrap">
                {activeTab === 'leads' && (
                  <>
                    {esEntrenador && (
                      <Button 
                        variant="secondary" 
                        size="md"
                        onClick={handleShowFollowUps}
                        aria-label="Ver seguimientos de leads"
                      >
                        <Calendar className="w-4 h-4 mr-2" />
                        Ver Seguimientos
                      </Button>
                    )}
                    <Button 
                      variant="primary" 
                      size="md"
                      onClick={handleOpenCaptureModal}
                      aria-label={esEntrenador ? 'Crear nuevo lead' : 'Capturar nuevo lead'}
                    >
                      <UserPlus className="w-4 h-4 mr-2" />
                      {esEntrenador ? 'Nuevo Lead' : 'Capturar Lead'}
                    </Button>
                  </>
                )}
                {activeTab === 'pipeline' && (
                  <Button
                    variant="secondary"
                    size="md"
                    onClick={() => setShowPhaseConfig(true)}
                    aria-label="Configurar fases del pipeline"
                  >
                    <Settings size={20} className="mr-2" />
                    Configurar Fases
                  </Button>
                )}
              </div>
            </div>

            {/* Navegación por tabs principales */}
            {/* Desktop: Tabs normales */}
            <div
              role="tablist"
              aria-label="Secciones de Transformación de Leads"
              className="hidden md:flex items-center gap-2 rounded-2xl bg-slate-100 dark:bg-slate-800/50 p-1"
            >
              {mainTabs.map((tab) => {
                const isActive = activeTab === tab.id;
                const IconComponent = tab.icon;
                const tabRef = tabButtonRefs[tab.id as keyof typeof tabButtonRefs];
                
                return (
                  <button
                    key={tab.id}
                    ref={tabRef}
                    onClick={() => handleTabChange(tab.id)}
                    onKeyDown={(e) => handleTabKeyDown(e, tab.id)}
                    role="tab"
                    aria-selected={isActive}
                    aria-controls={`tabpanel-${tab.id}`}
                    id={`tab-${tab.id}`}
                    tabIndex={isActive ? 0 : -1}
                    className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                      isActive
                        ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 shadow-sm ring-1 ring-slate-200 dark:ring-slate-600'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-white/70 dark:hover:bg-slate-700/50'
                    }`}
                    title={tab.description}
                  >
                    <IconComponent className={`w-4 h-4 ${isActive ? 'opacity-100' : 'opacity-70'}`} />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Mobile: Segment control scrollable */}
            <div className="md:hidden">
              <div
                role="tablist"
                aria-label="Secciones de Transformación de Leads"
                className="flex items-center gap-2 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide snap-x snap-mandatory"
                style={{ WebkitOverflowScrolling: 'touch' }}
              >
                {mainTabs.map((tab) => {
                  const isActive = activeTab === tab.id;
                  const IconComponent = tab.icon;
                  const tabRef = tabButtonRefs[tab.id as keyof typeof tabButtonRefs];
                  
                  return (
                    <button
                      key={tab.id}
                      ref={tabRef}
                      onClick={() => handleTabChange(tab.id)}
                      onKeyDown={(e) => handleTabKeyDown(e, tab.id)}
                      role="tab"
                      aria-selected={isActive}
                      aria-controls={`tabpanel-${tab.id}`}
                      id={`tab-${tab.id}`}
                      tabIndex={isActive ? 0 : -1}
                      className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-all flex-shrink-0 snap-start whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                        isActive
                          ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 shadow-sm ring-1 ring-slate-200 dark:ring-slate-600'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-white/70 dark:hover:bg-slate-700/50 bg-slate-100 dark:bg-slate-800/50'
                      }`}
                      title={tab.description}
                    >
                      <IconComponent className={`w-4 h-4 ${isActive ? 'opacity-100' : 'opacity-70'}`} />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Estados globales de carga y error */}
      {/* 
        NOTA: Los errores locales de cada submódulo (listado de leads, pipeline, inbox)
        se manejan dentro de esos componentes y no interfieren con estos estados globales.
        Solo se muestran aquí errores críticos que impiden el funcionamiento básico.
      */}
      {isLoading ? (
        <GlobalSkeleton />
      ) : globalError ? (
        <GlobalErrorDisplay />
      ) : (
        <>
          {/* Banner de alerta SLA */}
          {shouldShowSlaBanner() && slaMetrics && (
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6 pt-4 sm:pt-6">
          <div className="bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20 border border-orange-200 dark:border-orange-800 rounded-xl p-3 sm:p-4 shadow-sm">
            <div className="flex items-start gap-3 sm:gap-4">
              <div className="flex-shrink-0 p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-orange-600 dark:text-orange-400" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm sm:text-base font-semibold text-orange-900 dark:text-orange-100 mb-1">
                  Atención requerida: Leads fuera de SLA
                </h3>
                <p className="text-xs sm:text-sm text-orange-800 dark:text-orange-200 mb-2 sm:mb-3">
                  Tienes <strong>{slaMetrics.outsideSla} leads</strong> que llevan demasiado tiempo sin respuesta 
                  {slaMetrics.totalLeads > 0 && (
                    <span> ({slaMetrics.outsideSlaPercentage}% del total)</span>
                  )}. 
                  Revisa el Inbox para no perder oportunidades.
                </p>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={handleGoToInbox}
                    className="bg-orange-600 hover:bg-orange-700 text-white border-orange-600 text-xs sm:text-sm"
                    aria-label="Ir al inbox para revisar leads fuera de SLA"
                  >
                    <Inbox className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                    Ir al Inbox
                  </Button>
                  <button
                    onClick={() => setIsSlaBannerDismissed(true)}
                    className="text-xs sm:text-sm text-orange-700 dark:text-orange-300 hover:text-orange-900 dark:hover:text-orange-100 underline text-left sm:text-center"
                  >
                    Cerrar por ahora
                  </button>
                </div>
              </div>
              <button
                onClick={() => setIsSlaBannerDismissed(true)}
                className="flex-shrink-0 p-1 text-orange-600 dark:text-orange-400 hover:bg-orange-100 dark:hover:bg-orange-900/30 rounded-lg transition-colors"
                aria-label="Cerrar banner"
              >
                <X className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Contenido de las tabs */}
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6 py-6 sm:py-8 overflow-x-hidden">
        {/* Estado vacío global - Solo se muestra si no hay leads en absoluto y estamos en el tab de leads */}
        {activeTab === 'leads' && !loading && leads.length === 0 && (
          <Card className="p-12 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-900/20 dark:via-indigo-900/20 dark:to-purple-900/20 border-2 border-dashed border-blue-200 dark:border-blue-800">
            <div className="max-w-2xl mx-auto text-center space-y-6">
              <div className="flex justify-center">
                <div className="p-4 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl shadow-lg">
                  <Users className="w-16 h-16 text-white" />
                </div>
              </div>
              <div className="space-y-3">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                  {esEntrenador 
                    ? 'Todavía no tienes leads' 
                    : 'Todavía no hay leads en el centro'}
                </h2>
                <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                  {esEntrenador
                    ? 'Empieza creando tu primer lead o conectando tus fuentes de captación. Cada lead es una oportunidad de crecimiento.'
                    : 'Empieza creando tu primer lead o conectando tus fuentes de captación. Conecta campañas y landing pages para generar leads automáticamente.'}
                </p>
              </div>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                <Button
                  variant="primary"
                  size="lg"
                  onClick={() => setIsLeadModalOpen(true)}
                  className="min-w-[200px] shadow-lg hover:shadow-xl transition-shadow"
                >
                  <UserPlus className="w-5 h-5 mr-2" />
                  Crear primer lead
                </Button>
                <Button
                  variant="secondary"
                  size="lg"
                  onClick={() => navigate('/dashboard/analytics/captacion')}
                  className="min-w-[200px]"
                >
                  <Link2 className="w-5 h-5 mr-2" />
                  Ver opciones de captación
                </Button>
              </div>
              <div className="pt-6 border-t border-blue-200 dark:border-blue-800">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  💡 <strong>Tip:</strong> {esEntrenador 
                    ? 'Puedes capturar leads desde Instagram, WhatsApp, referidos o crearlos manualmente.'
                    : 'Conecta tus campañas de marketing, landing pages y formularios web para capturar leads automáticamente.'}
                </p>
              </div>
            </div>
          </Card>
        )}

        {activeTab === 'leads' && (loading || leads.length > 0) && (
          <div 
            ref={tabPanelRefs.leads}
            role="tabpanel"
            id="tabpanel-leads"
            aria-labelledby="tab-leads"
            tabIndex={-1}
            className="space-y-6"
          >
            <LeadsManager 
              businessType={businessType} 
              onOpenCaptureModalRef={openCaptureModalRef}
              showFollowUpsFilter={showFollowUps}
              onFollowUpsFilterChange={setShowFollowUps}
              globalFilters={{
                dateRange: globalFilters.dateRange,
                source: globalFilters.source === 'all' ? undefined : globalFilters.source,
                status: globalFilters.status === 'all' ? undefined : globalFilters.status,
              }}
              selectedLeadId={selectedLeadId}
              onSelectLead={handleSelectLead}
              onViewInPipeline={handleViewInPipeline}
            />
          </div>
        )}

        {activeTab === 'pipeline' && (
          <div 
            ref={tabPanelRefs.pipeline}
            role="tabpanel"
            id="tabpanel-pipeline"
            aria-labelledby="tab-pipeline"
            tabIndex={-1}
            className="space-y-6"
          >
            {/* Estado vacío para pipeline cuando no hay leads */}
            {!loading && leads.length === 0 ? (
              <Card className="p-12 bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50 dark:from-purple-900/20 dark:via-indigo-900/20 dark:to-blue-900/20 border-2 border-dashed border-purple-200 dark:border-purple-800">
                <div className="max-w-2xl mx-auto text-center space-y-6">
                  <div className="flex justify-center">
                    <div className="p-4 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl shadow-lg">
                      <Kanban className="w-16 h-16 text-white" />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                      {esEntrenador 
                        ? 'Tu pipeline está vacío' 
                        : 'El pipeline del centro está vacío'}
                    </h2>
                    <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                      {esEntrenador
                        ? 'Una vez que tengas leads, podrás visualizarlos y gestionarlos en tu pipeline de ventas. Organiza tus oportunidades y haz seguimiento de cada etapa.'
                        : 'Una vez que haya leads en el centro, podrás visualizarlos y gestionarlos en el pipeline de ventas. Organiza las oportunidades y haz seguimiento de cada etapa del proceso.'}
                    </p>
                  </div>
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                    <Button
                      variant="primary"
                      size="lg"
                      onClick={() => {
                        setActiveTab('leads');
                        setIsLeadModalOpen(true);
                      }}
                      className="min-w-[200px] shadow-lg hover:shadow-xl transition-shadow"
                    >
                      <UserPlus className="w-5 h-5 mr-2" />
                      Crear primer lead
                    </Button>
                    <Button
                      variant="secondary"
                      size="lg"
                      onClick={() => navigate('/dashboard/analytics/captacion')}
                      className="min-w-[200px]"
                    >
                      <Link2 className="w-5 h-5 mr-2" />
                      Ver opciones de captación
                    </Button>
                  </div>
                </div>
              </Card>
            ) : (
              <>
                <PipelineFilters
                  businessType={businessType}
                  filters={pipelineFilters}
                  onFiltersChange={setPipelineFilters}
                />
                <Card className="p-0 bg-white shadow-sm">
                  <div className="px-4 py-3">
                    <div
                      role="tablist"
                      aria-label="Secciones de Pipeline"
                      className="flex items-center gap-2 rounded-2xl bg-slate-100 p-1"
                    >
                      {pipelineTabs.map((tab) => {
                        const isActive = pipelineActiveTab === tab.id;
                        
                        return (
                          <button
                            key={tab.id}
                            onClick={() => setPipelineActiveTab(tab.id)}
                            className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all ${
                              isActive
                                ? 'bg-white text-slate-900 shadow-sm ring-1 ring-slate-200'
                                : 'text-slate-600 hover:text-slate-900 hover:bg-white/70'
                            }`}
                          >
                            {React.cloneElement(tab.icon, {
                              className: isActive ? 'opacity-100' : 'opacity-70',
                            })}
                            <span>{tab.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                  
                  <div className="px-4 pb-6 pt-6">
                    {pipelineActiveTab === 'kanban' && (
                      <PipelineKanban
                        businessType={businessType}
                        userId={esEntrenador ? user?.id : undefined}
                        globalFilters={{
                          dateRange: globalFilters.dateRange,
                          source: globalFilters.source === 'all' ? undefined : globalFilters.source,
                          status: globalFilters.status === 'all' ? undefined : globalFilters.status,
                        }}
                        selectedLeadId={selectedLeadId}
                      />
                    )}

                    {pipelineActiveTab === 'metrics' && (
                      <PipelineMetrics
                        businessType={businessType}
                        userId={esEntrenador ? user?.id : undefined}
                      />
                    )}

                    {pipelineActiveTab === 'reports' && (
                      <PipelineReports businessType={businessType} />
                    )}

                    {pipelineActiveTab === 'automation' && (
                      <PipelineAutomation businessType={businessType} />
                    )}
                  </div>
                </Card>
                <PhaseConfigurator
                  businessType={businessType}
                  isOpen={showPhaseConfig}
                  onClose={() => setShowPhaseConfig(false)}
                />
              </>
            )}
          </div>
        )}

        {activeTab === 'inbox' && (
          <div 
            ref={tabPanelRefs.inbox}
            role="tabpanel"
            id="tabpanel-inbox"
            aria-labelledby="tab-inbox"
            tabIndex={-1}
            className="space-y-6"
          >
            {/* Estado vacío para inbox cuando no hay leads */}
            {!loading && leads.length === 0 ? (
              <Card className="p-12 bg-gradient-to-br from-indigo-50 via-blue-50 to-cyan-50 dark:from-indigo-900/20 dark:via-blue-900/20 dark:to-cyan-900/20 border-2 border-dashed border-indigo-200 dark:border-indigo-800">
                <div className="max-w-2xl mx-auto text-center space-y-6">
                  <div className="flex justify-center">
                    <div className="p-4 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-2xl shadow-lg">
                      <Inbox className="w-16 h-16 text-white" />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                      {esEntrenador 
                        ? 'Todavía no tienes conversaciones' 
                        : 'Todavía no hay conversaciones en el centro'}
                    </h2>
                    <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                      {esEntrenador
                        ? 'Cuando tengas leads con conversaciones activas, aparecerán aquí. Centraliza todas tus interacciones de Instagram, WhatsApp y otros canales en un solo lugar.'
                        : 'Cuando haya leads con conversaciones activas, aparecerán aquí. Centraliza todas las interacciones de Instagram, WhatsApp, web y otros canales en un solo lugar con SLAs configurables.'}
                    </p>
                  </div>
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                    <Button
                      variant="primary"
                      size="lg"
                      onClick={() => {
                        setActiveTab('leads');
                        setIsLeadModalOpen(true);
                      }}
                      className="min-w-[200px] shadow-lg hover:shadow-xl transition-shadow"
                    >
                      <UserPlus className="w-5 h-5 mr-2" />
                      Crear primer lead
                    </Button>
                    <Button
                      variant="secondary"
                      size="lg"
                      onClick={() => navigate('/dashboard/analytics/captacion')}
                      className="min-w-[200px]"
                    >
                      <Link2 className="w-5 h-5 mr-2" />
                      Ver opciones de captación
                    </Button>
                  </div>
                </div>
              </Card>
            ) : (
              <>
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-800 rounded-2xl p-6">
                  <div className="flex items-start gap-4">
                    <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                      <Zap className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">Gestión Centralizada</h3>
                      <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                        Una única bandeja de entrada para todos tus leads de Instagram, Facebook, web, WhatsApp y email. 
                        Con SLAs configurables para responder a tiempo.
                      </p>
                    </div>
                  </div>
                </div>
                <LeadInboxContainer 
                  globalFilters={{
                    dateRange: globalFilters.dateRange,
                    source: globalFilters.source === 'all' ? undefined : globalFilters.source,
                    status: globalFilters.status === 'all' ? undefined : globalFilters.status,
                  }}
                  onOpenLead={handleOpenLeadFromInbox}
                  selectedLeadId={selectedLeadId}
                  onViewLeadInLeadsTab={handleViewLeadInLeadsTab}
                />
              </>
            )}
          </div>
        )}
      </div>
        </>
      )}

      {/* Modal de captura de lead */}
      <Modal
        isOpen={isLeadModalOpen}
        onClose={() => setIsLeadModalOpen(false)}
        title="Nuevo Lead"
        size="lg"
      >
        <LeadCapture
          businessType={businessType}
          onSubmit={handleCreateLead}
          onCancel={() => setIsLeadModalOpen(false)}
        />
      </Modal>

      {/* Modal de ayuda de atajos de teclado */}
      {showShortcutsHelp && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 dark:bg-black/70"
          onClick={() => setShowShortcutsHelp(false)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="shortcuts-help-title"
        >
          <div 
            className="bg-white dark:bg-[#1E1E2E] rounded-xl shadow-xl max-w-md w-full mx-4 p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 
                id="shortcuts-help-title"
                className="text-xl font-bold text-gray-900 dark:text-gray-100"
              >
                Atajos de Teclado
              </h2>
              <button
                onClick={() => setShowShortcutsHelp(false)}
                className="p-1 rounded-lg text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label="Cerrar ayuda de atajos"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-3">
              <div className="flex items-start justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                <div>
                  <p className="font-medium text-gray-900 dark:text-gray-100">Ir a Tab Leads</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Abre la sección de gestión de leads</p>
                </div>
                <kbd className="px-2 py-1 text-xs font-semibold text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded">
                  Ctrl + 1
                </kbd>
              </div>
              <div className="flex items-start justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                <div>
                  <p className="font-medium text-gray-900 dark:text-gray-100">Ir a Tab Pipeline</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Abre la sección de pipeline de ventas</p>
                </div>
                <kbd className="px-2 py-1 text-xs font-semibold text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded">
                  Ctrl + 2
                </kbd>
              </div>
              <div className="flex items-start justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                <div>
                  <p className="font-medium text-gray-900 dark:text-gray-100">Ir a Tab Inbox</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Abre la sección de inbox unificado</p>
                </div>
                <kbd className="px-2 py-1 text-xs font-semibold text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded">
                  Ctrl + 3
                </kbd>
              </div>
              <div className="flex items-start justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                <div>
                  <p className="font-medium text-gray-900 dark:text-gray-100">Nuevo Lead</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Abre el modal para crear un nuevo lead</p>
                </div>
                <kbd className="px-2 py-1 text-xs font-semibold text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded">
                  Ctrl + N
                </kbd>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                <strong>Navegación por pestañas:</strong> Usa las flechas <kbd className="px-1.5 py-0.5 text-xs font-semibold text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded">←</kbd> y <kbd className="px-1.5 py-0.5 text-xs font-semibold text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded">→</kbd> para navegar entre pestañas cuando una pestaña tiene el foco.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Mensaje de éxito */}
      {successMessage && (
        <div className={`fixed top-4 right-4 z-50 animate-in slide-in-from-right-full fade-in duration-300`}>
          <div className={`flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg border ${
            successMessage.includes('Error')
              ? 'bg-red-50 border-red-200 text-red-800 dark:bg-red-900/20 dark:border-red-800 dark:text-red-200'
              : 'bg-green-50 border-green-200 text-green-800 dark:bg-green-900/20 dark:border-green-800 dark:text-green-200'
          }`}>
            {successMessage.includes('Error') ? (
              <AlertCircle size={20} className="text-red-600 dark:text-red-400" />
            ) : (
              <Target size={20} className="text-green-600 dark:text-green-400" />
            )}
            <p className="text-sm font-medium">{successMessage}</p>
            <button 
              onClick={() => setSuccessMessage(null)}
              className="ml-2 p-1 hover:bg-black/5 dark:hover:bg-white/10 rounded-full transition-colors"
              aria-label="Cerrar mensaje"
            >
              <X size={16} className="opacity-50" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default TransformacionLeadsPage;
