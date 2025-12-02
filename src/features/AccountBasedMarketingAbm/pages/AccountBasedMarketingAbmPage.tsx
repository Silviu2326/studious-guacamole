import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { Card, MetricCards, Button, Tabs } from '../../../components/componentsreutilizables';
import { ABMPipelineView } from '../components/ABMPipelineView';
import { AccountDetailPanel } from '../components/AccountDetailPanel';
import { getABMAnalytics } from '../api/abm';
import { 
  Building2, 
  TrendingUp, 
  DollarSign, 
  Target,
  Users,
  FileText,
  Plus,
  BarChart3
} from 'lucide-react';

/**
 * Página principal de Account-Based Marketing (ABM)
 * 
 * Permite a los entrenadores gestionar ventas B2B a través de un pipeline
 * visual de oportunidades y cuentas objetivo.
 */
export const AccountBasedMarketingAbmPage: React.FC = () => {
  const { user } = useAuth();
  const [analytics, setAnalytics] = useState({
    totalPipelineValue: 0,
    conversionRate: 0,
    averageSalesCycle: 0,
    newAccountsThisMonth: 0,
    proposalEngagementRate: 0,
    totalRevenue: 0
  });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('pipeline');
  const [selectedAccountId, setSelectedAccountId] = useState<string | null>(null);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      const data = await getABMAnalytics();
      setAnalytics(data);
    } catch (error) {
      console.error('Error al cargar analíticas:', error);
    } finally {
      setLoading(false);
    }
  };

  const metricas = [
    {
      id: 'pipeline-value',
      title: 'Valor del Pipeline',
      value: new Intl.NumberFormat('es-ES', {
        style: 'currency',
        currency: 'EUR',
        minimumFractionDigits: 0
      }).format(analytics.totalPipelineValue),
      subtitle: 'Oportunidades activas',
      icon: <BarChart3 className="w-5 h-5" />,
      color: 'primary' as const,
      trend: {
        value: 12.5,
        direction: 'up' as const,
        label: 'vs mes anterior'
      }
    },
    {
      id: 'conversion-rate',
      title: 'Tasa de Conversión',
      value: `${analytics.conversionRate.toFixed(1)}%`,
      subtitle: 'Deals ganados / total',
      icon: <Target className="w-5 h-5" />,
      color: 'success' as const,
      trend: {
        value: 3.2,
        direction: 'up' as const,
        label: 'vs mes anterior'
      }
    },
    {
      id: 'sales-cycle',
      title: 'Ciclo de Venta',
      value: `${analytics.averageSalesCycle} días`,
      subtitle: 'Promedio',
      icon: <TrendingUp className="w-5 h-5" />,
      color: 'info' as const
    },
    {
      id: 'new-accounts',
      title: 'Cuentas Nuevas',
      value: analytics.newAccountsThisMonth.toString(),
      subtitle: 'Este mes',
      icon: <Building2 className="w-5 h-5" />,
      color: 'warning' as const
    },
    {
      id: 'engagement',
      title: 'Engagement Propuestas',
      value: `${analytics.proposalEngagementRate.toFixed(1)}%`,
      subtitle: 'Vistas / enviadas',
      icon: <FileText className="w-5 h-5" />,
      color: 'info' as const
    },
    {
      id: 'revenue',
      title: 'Ingresos ABM',
      value: new Intl.NumberFormat('es-ES', {
        style: 'currency',
        currency: 'EUR',
        minimumFractionDigits: 0
      }).format(analytics.totalRevenue),
      subtitle: 'Total generado',
      icon: <DollarSign className="w-5 h-5" />,
      color: 'success' as const
    }
  ];

  const tabs = [
    {
      id: 'pipeline',
      label: 'Pipeline',
      icon: <BarChart3 className="w-4 h-4" />
    },
    {
      id: 'accounts',
      label: 'Cuentas',
      icon: <Building2 className="w-4 h-4" />
    },
    {
      id: 'analytics',
      label: 'Analíticas',
      icon: <TrendingUp className="w-4 h-4" />
    }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'pipeline':
        return (
          <ABMPipelineView userId={user?.id || 'trainer-123'} />
        );
      case 'accounts':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-end">
              <Button onClick={() => {/* TODO: Crear cuenta */}}>
                <Plus size={20} className="mr-2" />
                Nueva Cuenta
              </Button>
            </div>
            <Card className="p-8 text-center bg-white shadow-sm">
              <Building2 size={48} className="mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Cuentas Objetivo</h3>
              <p className="text-gray-600 mb-4">Gestiona tus cuentas objetivo aquí</p>
              <Button onClick={() => {/* TODO: Crear cuenta */}}>Crear Cuenta</Button>
            </Card>
          </div>
        );
      case 'analytics':
        return (
          <Card className="p-8 text-center bg-white shadow-sm">
            <BarChart3 size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Analíticas Detalladas</h3>
            <p className="text-gray-600 mb-4">Vista de analíticas avanzadas</p>
          </Card>
        );
      default:
        return null;
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
                <Building2 size={24} className="text-blue-600" />
              </div>
              
              {/* Título y descripción */}
              <div>
                <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900">
                  Account-Based Marketing (ABM)
                </h1>
                <p className="text-gray-600">
                  Gestiona ventas B2B y capta clientes corporativos con un enfoque estratégico
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6 py-8">
        <div className="space-y-6">
          {/* Métricas */}
          {!loading && (
            <MetricCards 
              data={metricas} 
              columns={6} 
            />
          )}

          {/* Toolbar */}
          <div className="flex items-center justify-end">
            <Button onClick={() => {/* TODO: Abrir modal de creación */}}>
              <Plus size={20} className="mr-2" />
              Nueva Oportunidad
            </Button>
          </div>

          {/* Información sobre ABM */}
          <Card className="bg-white shadow-sm">
            <div className="p-6">
              <div className="flex items-start gap-4">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Building2 className="w-5 h-5 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-2">
                    ¿Qué es Account-Based Marketing?
                  </h3>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    ABM es una estrategia de marketing B2B que se enfoca en tratar a cada empresa objetivo 
                    como un mercado individual. Este módulo te permite gestionar perfiles de cuentas corporativas, 
                    mapear contactos clave dentro de cada organización y seguir oportunidades de negocio 
                    a través de un pipeline visual de ventas.
                  </p>
                </div>
              </div>
            </div>
          </Card>

          {/* Panel de detalles de cuenta (si está seleccionado) */}
          {selectedAccountId && (
            <AccountDetailPanel 
              accountId={selectedAccountId}
              onClose={() => setSelectedAccountId(null)}
            />
          )}

          {/* Tabs de navegación */}
          <Card className="p-0 bg-white shadow-sm">
            <div className="px-4 py-3">
              <div
                role="tablist"
                aria-label="Secciones"
                className="flex items-center gap-2 rounded-2xl bg-slate-100 p-1"
              >
                {tabs.map((tab) => {
                  const activo = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      role="tab"
                      aria-selected={activo}
                      onClick={() => setActiveTab(tab.id)}
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
            <div className="mt-6 p-6">
              {renderTabContent()}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AccountBasedMarketingAbmPage;


