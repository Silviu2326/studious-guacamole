import React, { useState, useMemo } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { Card, Tabs, Button, MetricCards } from '../../../components/componentsreutilizables';
import { CampaignsManager } from '../components/CampaignsManager';
import { 
  Megaphone, 
  Send, 
  Users, 
  MessageSquare,
  BarChart3,
  Target,
  DollarSign,
  TrendingUp
} from 'lucide-react';
import { useCampaigns } from '../hooks/useCampaigns';

/**
 * Página principal de Campañas y Outreach
 * 
 * Adaptada según el rol del usuario:
 * - Gimnasios: Acceso completo a campañas coordinadas, outreach automatizado, analytics avanzados
 * - Entrenadores: Funcionalidades básicas de outreach manual desde su lista de leads
 */
export const CampanasOutreachPage: React.FC = () => {
  const { user } = useAuth();
  const esEntrenador = user?.role === 'entrenador';
  const role = esEntrenador ? 'entrenador' : 'gimnasio';
  
  const {
    campaigns,
    outreachSequences,
    loading
  } = useCampaigns();

  const [tabActiva, setTabActiva] = useState<string>('campaigns');

  // Calcular métricas para gimnasio
  const totalCampaigns = campaigns.length;
  const activeCampaigns = campaigns.filter(c => c.status === 'active').length;
  const totalSent = campaigns.reduce((sum, c) => sum + c.metrics.sent, 0);
  const totalConverted = campaigns.reduce((sum, c) => sum + c.metrics.converted, 0);
  const totalRevenue = campaigns.reduce((sum, c) => sum + (c.metrics.revenue || 0), 0);
  const averageConversionRate = totalSent > 0 ? (totalConverted / totalSent) * 100 : 0;

  const metricasGimnasio = useMemo(() => [
    {
      id: 'total-campaigns',
      title: 'Total Campañas',
      value: totalCampaigns,
      subtitle: `${activeCampaigns} activas`,
      icon: <BarChart3 className="w-5 h-5" />,
      color: 'primary' as const,
      trend: {
        value: 12,
        direction: 'up' as const,
        label: 'vs mes anterior'
      }
    },
    {
      id: 'conversion-rate',
      title: 'Tasa Conversión',
      value: `${averageConversionRate.toFixed(1)}%`,
      subtitle: `${totalConverted} conversiones`,
      icon: <Target className="w-5 h-5" />,
      color: 'success' as const,
      trend: {
        value: 3.2,
        direction: 'up' as const,
        label: 'vs mes anterior'
      }
    },
    {
      id: 'total-sent',
      title: 'Mensajes Enviados',
      value: totalSent.toLocaleString(),
      subtitle: 'Total de envíos',
      icon: <Send className="w-5 h-5" />,
      color: 'info' as const
    },
    {
      id: 'total-revenue',
      title: 'Ingresos Generados',
      value: `$${totalRevenue.toLocaleString()}`,
      subtitle: 'Total campañas',
      icon: <DollarSign className="w-5 h-5" />,
      color: 'warning' as const,
      trend: {
        value: 15.8,
        direction: 'up' as const,
        label: 'vs mes anterior'
      }
    }
  ], [totalCampaigns, activeCampaigns, totalSent, totalConverted, totalRevenue, averageConversionRate]);

  // Métricas simplificadas para entrenador
  const metricasEntrenador = useMemo(() => [
    {
      id: 'total-leads',
      title: 'Leads Totales',
      value: 45,
      subtitle: 'En mi lista',
      icon: <Users className="w-5 h-5" />,
      color: 'primary' as const
    },
    {
      id: 'pendientes',
      title: 'Pendientes',
      value: 12,
      subtitle: 'Requieren seguimiento',
      icon: <MessageSquare className="w-5 h-5" />,
      color: 'warning' as const
    },
    {
      id: 'respuestas',
      title: 'Respuestas',
      value: '28%',
      subtitle: 'Tasa de respuesta',
      icon: <TrendingUp className="w-5 h-5" />,
      color: 'success' as const
    }
  ], []);

  const tabs = useMemo(() => {
    if (esEntrenador) {
      // Tabs simplificadas para entrenadores
      return [
        { 
          id: 'outreach', 
          label: 'Outreach Manual', 
          icon: <MessageSquare className="w-4 h-4" /> 
        },
        { 
          id: 'leads', 
          label: 'Mis Leads', 
          icon: <Users className="w-4 h-4" /> 
        }
      ];
    } else {
      // Tabs completas para gimnasios
      return [
        { 
          id: 'campaigns', 
          label: 'Campañas', 
          icon: <Megaphone className="w-4 h-4" /> 
        },
        { 
          id: 'outreach', 
          label: 'Outreach Automatizado', 
          icon: <Send className="w-4 h-4" /> 
        },
        { 
          id: 'analytics', 
          label: 'Analytics', 
          icon: <BarChart3 className="w-4 h-4" /> 
        },
        { 
          id: 'segments', 
          label: 'Segmentos', 
          icon: <Users className="w-4 h-4" /> 
        }
      ];
    }
  }, [esEntrenador]);

  const renderTabContent = () => {
    if (esEntrenador) {
      // Vista simplificada para entrenadores
      switch (tabActiva) {
        case 'outreach':
          return (
            <Card className="bg-white shadow-sm">
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  Outreach Manual
                </h3>
                <p className="text-gray-600 mb-6">
                  Gestiona tus mensajes de outreach personalizados desde tu lista de leads.
                </p>
                <div className="space-y-4">
                  <div className="p-4 border border-gray-200 rounded-lg bg-white">
                    <p className="text-gray-600">
                      Funcionalidad de outreach manual desde leads en desarrollo...
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          );
        case 'leads':
          return (
            <Card className="bg-white shadow-sm">
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  Mis Leads
                </h3>
                <p className="text-gray-600 mb-6">
                  Gestiona tu lista de leads y realiza seguimiento personalizado.
                </p>
                <div className="space-y-4">
                  <div className="p-4 border border-gray-200 rounded-lg bg-white">
                    <p className="text-gray-600">
                      Lista de leads en desarrollo...
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          );
        default:
          return null;
      }
    } else {
      // Vista completa para gimnasios usando CampaignsManager
      return <CampaignsManager />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Header */}
      <div className="border-b border-gray-200/60 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6">
          <div className="py-6">
            <div className="flex items-center">
              {/* Icono con contenedor */}
              <div className="p-2 bg-blue-100 rounded-xl mr-4 ring-1 ring-blue-200/70">
                <Megaphone size={24} className="text-blue-600" />
              </div>
              
              {/* Título y descripción */}
              <div>
                <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900">
                  Campañas y Outreach
                </h1>
                <p className="text-gray-600">
                  {esEntrenador
                    ? 'Gestiona tu outreach personalizado y seguimiento con tus leads'
                    : 'Sistema completo de gestión de campañas coordinadas y outreach automatizado para tu gimnasio'
                  }
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6 py-8">
        <div className="space-y-6">
          {/* Toolbar superior */}
          <div className="flex items-center justify-end">
            {!esEntrenador && (
              <Button variant="primary" size="md" onClick={() => {/* TODO: Manejar creación de campaña */}}>
                <Megaphone size={20} className="mr-2" />
                Nueva Campaña
              </Button>
            )}
            {esEntrenador && (
              <Button variant="primary" size="md" onClick={() => {/* TODO: Manejar creación de mensaje */}}>
                <MessageSquare size={20} className="mr-2" />
                Nuevo Mensaje
              </Button>
            )}
          </div>

          {/* Métricas */}
          {!esEntrenador && (
            <MetricCards 
              data={metricasGimnasio} 
              columns={4} 
            />
          )}
          {esEntrenador && (
            <MetricCards 
              data={metricasEntrenador} 
              columns={3} 
            />
          )}

          {/* Navegación por tabs */}
          {esEntrenador ? (
            <Card className="p-0 bg-white shadow-sm">
              <div className="px-4 py-3">
                <div
                  role="tablist"
                  aria-label="Secciones"
                  className="flex items-center gap-2 rounded-2xl bg-slate-100 p-1"
                >
                  {tabs.map((tab) => {
                    const activo = tabActiva === tab.id;
                    return (
                      <button
                        key={tab.id}
                        role="tab"
                        aria-selected={activo}
                        onClick={() => setTabActiva(tab.id)}
                        className={[
                          'inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all',
                          activo
                            ? 'bg-white text-slate-900 shadow-sm ring-1 ring-slate-200'
                            : 'text-slate-600 hover:text-slate-900 hover:bg-white/70'
                        ].join(' ')}
                      >
                        {React.cloneElement(tab.icon, {
                          size: 18,
                          className: activo ? 'opacity-100' : 'opacity-70'
                        })}
                        <span>{tab.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </Card>
          ) : null}

          {/* Contenido de la pestaña activa */}
          {esEntrenador ? (
            <div className="mt-6">
              {renderTabContent()}
            </div>
          ) : (
            // Para gimnasios, CampaignsManager maneja sus propias tabs
            renderTabContent()
          )}
        </div>
      </div>
    </div>
  );
};

export default CampanasOutreachPage;
