import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { MetricCards, Button, Card } from '../../../components/componentsreutilizables';
import { LeadsManager } from '../../leads/components';
import { getLeads } from '../../leads/api';
import { Lead } from '../../leads/types';
import {
  PipelineKanban,
  PipelineFilters,
  PipelineMetrics,
  PhaseConfigurator,
  PipelineAutomation,
  PipelineReports,
} from '../../pipeline-de-venta-kanban/components';
import { PipelineFilters as PipelineFiltersType } from '../../pipeline-de-venta-kanban/types';
import { LeadInboxContainer } from '../../LeadInboxUnificadoYSla/components';
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
  CalendarDays
} from 'lucide-react';

/**
 * Página unificada de Transformación de Leads
 * 
 * Combina tres features principales:
 * - Leads: Gestión completa de leads
 * - Pipeline de Venta Kanban: Visualización y gestión del pipeline
 * - Inbox Unificado & SLA: Centralización de conversaciones de leads
 */
function TransformacionLeadsPage() {
  const { user } = useAuth();
  const esEntrenador = user?.role === 'entrenador';
  const businessType = esEntrenador ? 'entrenador' : 'gimnasio';
  const [activeTab, setActiveTab] = useState('leads');

  // Estados para Leads
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFollowUps, setShowFollowUps] = useState(false);
  const openCaptureModalRef = useRef<(() => void) | null>(null);

  // Estados para Pipeline
  const [pipelineFilters, setPipelineFilters] = useState<PipelineFiltersType>({
    businessType,
  });
  const [pipelineActiveTab, setPipelineActiveTab] = useState('kanban');
  const [showPhaseConfig, setShowPhaseConfig] = useState(false);

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

  const mainTabs = [
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
      label: 'Pipeline de Venta',
      icon: Kanban,
      description: esEntrenador
        ? 'Visualiza y gestiona tu pipeline de ventas personal'
        : 'Sistema completo de gestión de pipeline comercial',
    },
    {
      id: 'inbox',
      label: 'Inbox Unificado & SLA',
      icon: Inbox,
      description: 'Centraliza todas tus conversaciones de leads con SLAs configurables',
    },
  ];

  const handleOpenCaptureModal = () => {
    if (openCaptureModalRef.current) {
      openCaptureModalRef.current();
    }
  };

  const handleShowFollowUps = () => {
    setShowFollowUps(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-[#0F0F23] dark:via-[#1E1E2E] dark:to-[#0F0F23]">
      {/* Header Unificado */}
      <div className="border-b border-gray-200/60 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:border-gray-700/60 dark:bg-[#0F0F23]/80 dark:supports-[backdrop-filter]:dark:bg-[#0F0F23]/60 sticky top-0 z-10">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6">
          <div className="py-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl mr-4 ring-1 ring-blue-200/70 dark:ring-blue-800/50">
                  <TrendingUp size={24} className="text-white" />
                </div>
                <div>
                  <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900 dark:text-[#F1F5F9]">
                    Transformación de Leads
                  </h1>
                  <p className="text-gray-600 dark:text-[#94A3B8]">
                    {esEntrenador
                      ? 'Gestiona todo el ciclo de transformación de leads: captura, seguimiento y conversión'
                      : 'Sistema completo para gestionar el ciclo completo de transformación de leads desde la captura hasta la conversión'}
                  </p>
                </div>
              </div>
              <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-900/30 rounded-lg border border-blue-200 dark:border-blue-800">
                <Zap className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span className="text-sm font-medium text-blue-900 dark:text-blue-100">
                  Vista Unificada
                </span>
              </div>
            </div>

            {/* Navegación por tabs principales */}
            <div
              role="tablist"
              aria-label="Secciones de Transformación de Leads"
              className="flex items-center gap-2 rounded-2xl bg-slate-100 dark:bg-slate-800/50 p-1"
            >
              {mainTabs.map((tab) => {
                const isActive = activeTab === tab.id;
                const IconComponent = tab.icon;
                
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-all ${
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

            {/* Botones de acción específicos por tab */}
            {activeTab === 'leads' && (
              <div className="flex items-center gap-3 mt-4">
                {esEntrenador && (
                  <Button 
                    variant="secondary" 
                    size="md"
                    onClick={handleShowFollowUps}
                  >
                    <Calendar className="w-4 h-4 mr-2" />
                    Ver Seguimientos
                  </Button>
                )}
                <Button 
                  variant="primary" 
                  size="md"
                  onClick={handleOpenCaptureModal}
                >
                  <UserPlus className="w-4 h-4 mr-2" />
                  {esEntrenador ? 'Nuevo Lead' : 'Capturar Lead'}
                </Button>
              </div>
            )}

            {activeTab === 'pipeline' && (
              <div className="flex items-center gap-3 mt-4">
                <Button
                  variant="secondary"
                  size="md"
                  onClick={() => setShowPhaseConfig(true)}
                >
                  <Settings size={20} className="mr-2" />
                  Configurar Fases
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Contenido de las tabs */}
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6 py-8">
        {activeTab === 'leads' && (
          <div className="space-y-6">
            <MetricCards data={leadsMetrics} columns={4} />
            <LeadsManager 
              businessType={businessType} 
              onOpenCaptureModalRef={openCaptureModalRef}
              showFollowUpsFilter={showFollowUps}
              onFollowUpsFilterChange={setShowFollowUps}
            />
          </div>
        )}

        {activeTab === 'pipeline' && (
          <div className="space-y-6">
            <MetricCards data={pipelineMetrics} columns={4} />
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
          </div>
        )}

        {activeTab === 'inbox' && (
          <div className="space-y-6">
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
            <LeadInboxContainer />
          </div>
        )}
      </div>
    </div>
  );
}

export default TransformacionLeadsPage;
