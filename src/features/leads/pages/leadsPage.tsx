import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { MetricCards, Button } from '../../../components/componentsreutilizables';
import { LeadsManager } from '../components';
import { getLeads } from '../api';
import { Lead } from '../types';
import { 
  Users, 
  TrendingUp, 
  Target, 
  MessageSquare,
  UserPlus,
  BarChart3,
  Calendar
} from 'lucide-react';

/**
 * Página principal de Leads y Pipeline
 * 
 * Adaptada según el rol del usuario:
 * - Entrenadores: Leads 1 a 1 desde redes sociales (Instagram, WhatsApp, Referidos)
 * - Gimnasios: Pipeline comercial clásico con campañas, visitas al centro, eventos
 */
export default function LeadsPage() {
  const { user } = useAuth();
  const esEntrenador = user?.role === 'entrenador';
  const businessType = esEntrenador ? 'entrenador' : 'gimnasio';
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFollowUps, setShowFollowUps] = useState(false);
  const openCaptureModalRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    loadLeads();
  }, [businessType, user?.id]);

  const loadLeads = async () => {
    setLoading(true);
    try {
      const filters: {
        businessType: 'entrenador' | 'gimnasio';
        assignedTo?: string[];
      } = {
        businessType,
        ...(businessType === 'entrenador' && user?.id ? { assignedTo: [user.id] } : {}),
      };
      console.log('[LeadsPage] Cargando leads con filtros:', {
        filters,
        user: user ? { id: user.id, role: user.role, name: user.name } : null,
        businessType,
      });
      const data = await getLeads(filters);
      console.log('[LeadsPage] Leads cargados:', {
        total: data.length,
        leads: data.map(l => ({ id: l.id, name: l.name, assignedTo: l.assignedTo, status: l.status, stage: l.stage })),
      });
      setLeads(data);
    } catch (error) {
      console.error('[LeadsPage] Error cargando leads:', error);
    } finally {
      setLoading(false);
    }
  };

  // Calcular métricas desde datos reales
  const calculateMetrics = () => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const twoDaysAgo = new Date(today.getTime() - 48 * 60 * 60 * 1000);
    const thirtyDaysAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

    // Leads activos (no convertidos ni perdidos)
    const activeLeads = leads.filter(l => l.status !== 'converted' && l.status !== 'lost');
    
    // Pendientes de respuesta (sin interacción en últimas 24-48h)
    const pendingResponse = leads.filter(l => {
      if (l.status === 'converted' || l.status === 'lost') return false;
      if (!l.lastContactDate) return true; // Nunca contactado
      const lastContact = new Date(l.lastContactDate);
      return lastContact < twoDaysAgo;
    });

    // Seguimientos hoy (nextFollowUpDate = hoy)
    const followUpsToday = leads.filter(l => {
      if (!l.nextFollowUpDate) return false;
      const followUpDate = new Date(l.nextFollowUpDate);
      return followUpDate >= today && followUpDate < new Date(today.getTime() + 24 * 60 * 60 * 1000);
    });

    // Tasa de conversión (últimos 30 días)
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

  const metrics = esEntrenador
    ? (() => {
        const calculated = calculateMetrics();
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
        const calculated = calculateMetrics();
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

  const handleOpenCaptureModal = () => {
    if (openCaptureModalRef.current) {
      openCaptureModalRef.current();
    }
  };

  const handleShowFollowUps = () => {
    setShowFollowUps(true);
    // Esto se pasará a LeadsManager para activar el filtro
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-[#0F0F23] dark:via-[#1E1E2E] dark:to-[#0F0F23]`}>
      {/* Header */}
      <div className={`border-b border-gray-200/60 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:border-gray-700/60 dark:bg-[#0F0F23]/80 dark:supports-[backdrop-filter]:dark:bg-[#0F0F23]/60`}>
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6">
          <div className="py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                {/* Icono con contenedor */}
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-xl mr-4 ring-1 ring-blue-200/70 dark:ring-blue-800/50">
                  <Users size={24} className="text-blue-600 dark:text-blue-400" />
                </div>
                
                {/* Título y descripción */}
                <div>
                  <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900 dark:text-[#F1F5F9]">
                    {esEntrenador ? 'Gestión de Leads' : 'Pipeline Comercial'}
                  </h1>
                  <p className="text-gray-600 dark:text-[#94A3B8]">
                    {esEntrenador
                      ? 'Responde rápido a tus leads desde Instagram, WhatsApp y referidos. Cada minuto cuenta en la conversión.'
                      : 'Sistema completo de gestión de pipeline comercial. Captura leads desde múltiples canales, gestiona visitas al centro y coordina tu equipo de ventas.'}
                  </p>
                </div>
              </div>
              
              {/* Botones de acción */}
              <div className="flex items-center gap-3">
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
            </div>
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6 py-8">
        {/* Métricas */}
        <div className="mb-6">
          <MetricCards data={metrics} columns={4} />
        </div>

        {/* Gestor principal de leads */}
        <LeadsManager 
          businessType={businessType} 
          onOpenCaptureModalRef={openCaptureModalRef}
          showFollowUpsFilter={showFollowUps}
          onFollowUpsFilterChange={setShowFollowUps}
        />
      </div>
    </div>
  );
}

