import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Card } from '../../../components/componentsreutilizables';
import { useAuth } from '../../../context/AuthContext';
import {
  TaxSummaryReport,
  ExportControlsContainer,
  ExportHistory,
  GestorGastosDeducibles,
  TaxCalculator,
  FiscalCalendar,
  AnnualSummary,
  TaxReminderBanner,
  FinancialDashboard,
} from '../components';
import { taxSummaryApi, getPerfilFiscal } from '../api';
import { TaxSummary, PerfilFiscal } from '../api/types';
import { FileText, Download, TrendingDown, Calendar, BarChart3, LayoutDashboard, Calculator } from 'lucide-react';
import { useTaxReminders } from '../hooks/useTaxReminders';

/**
 * Página principal de Impuestos & Export Contable
 * 
 * Sistema completo de gestión fiscal y exportación contable.
 * Centro de control para gestionar todos los aspectos fiscales y contables.
 */
export default function ImpuestosExportContablePage() {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Deep linking: leer tab desde query params
  const tabFromUrl = searchParams.get('tab') || 'dashboard';
  const [tabActiva, setTabActiva] = useState(tabFromUrl);
  const [taxSummary, setTaxSummary] = useState<TaxSummary | null>(null);
  const [loadingSummary, setLoadingSummary] = useState(false);
  const [perfilFiscal, setPerfilFiscal] = useState<PerfilFiscal | null>(null);

  // Cargar recordatorios de impuestos
  const { reminders: taxReminders } = useTaxReminders(user?.id || '');

  // Estado para el rango de fechas del resumen
  const [summaryDateRange, setSummaryDateRange] = useState<{ from: Date; to: Date }>(() => {
    const today = new Date();
    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
    return { from: firstDay, to: today };
  });

  // Cargar perfil fiscal al montar
  useEffect(() => {
    const loadPerfilFiscal = async () => {
      try {
        const perfil = await getPerfilFiscal();
        setPerfilFiscal(perfil);
      } catch (error) {
        console.error('Error loading perfil fiscal:', error);
      }
    };
    loadPerfilFiscal();
  }, []);

  // Sincronizar tab con URL (deep linking)
  useEffect(() => {
    const tabFromUrl = searchParams.get('tab') || 'dashboard';
    if (tabFromUrl !== tabActiva) {
      setTabActiva(tabFromUrl);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  // Actualizar URL cuando cambia la tab
  const handleTabChange = (tabId: string) => {
    setTabActiva(tabId);
    setSearchParams({ tab: tabId });
  };

  // Cargar resumen fiscal cuando cambie el rango de fechas o la pestaña activa
  useEffect(() => {
    if (tabActiva === 'exportar' || tabActiva === 'reportes') {
      loadTaxSummary();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [summaryDateRange.from?.getTime(), summaryDateRange.to?.getTime(), tabActiva]);

  const loadTaxSummary = async () => {
    setLoadingSummary(true);
    try {
      const summary = await taxSummaryApi.getSummary(
        summaryDateRange.from.toISOString().split('T')[0],
        summaryDateRange.to.toISOString().split('T')[0]
      );
      setTaxSummary(summary);
    } catch (error) {
      console.error('Error loading tax summary:', error);
    } finally {
      setLoadingSummary(false);
    }
  };

  // Callback para refrescar el resumen cuando cambien los gastos
  const handleExpensesChange = () => {
    if (tabActiva === 'exportar' || tabActiva === 'reportes') {
      loadTaxSummary();
    }
  };

  // Definición de pestañas con descripciones
  const tabs = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: <LayoutDashboard size={18} />,
      description: 'Vista general de tu situación financiera y fiscal. Monitorea ingresos, gastos, impuestos estimados y próximas obligaciones fiscales.'
    },
    {
      id: 'gastos',
      label: 'Gastos',
      icon: <TrendingDown size={18} />,
      description: 'Registra y gestiona todos tus gastos deducibles. Organiza por categorías, adjunta facturas y mantén un control completo de tus deducciones fiscales.'
    },
    {
      id: 'calculadora',
      label: 'Calculadora',
      icon: <Calculator size={18} />,
      description: 'Calcula tus impuestos estimados (IRPF e IVA) para cualquier período. Simula diferentes escenarios y planifica tus obligaciones fiscales.'
    },
    {
      id: 'exportar',
      label: 'Exportar',
      icon: <Download size={18} />,
      description: 'Exporta tus datos fiscales y contables en múltiples formatos (Excel, CSV, PDF). Compatible con software contable profesional y listo para enviar a tu gestor.'
    },
    {
      id: 'reportes',
      label: 'Reportes',
      icon: <BarChart3 size={18} />,
      description: 'Genera informes fiscales detallados y resúmenes anuales. Analiza tu situación fiscal con gráficos y desgloses completos.'
    },
    {
      id: 'calendario',
      label: 'Calendario',
      icon: <Calendar size={18} />,
      description: 'Visualiza todas tus obligaciones fiscales en un calendario. Recibe recordatorios de fechas importantes y nunca olvides una presentación.'
    }
  ];

  const handleNavigate = (tab: string) => {
    handleTabChange(tab);
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
                <FileText size={24} className="text-blue-600" />
              </div>
              
              {/* Título y descripción */}
              <div>
                <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900">
                  Impuestos & Export Contable
                </h1>
                <p className="text-gray-600">
                  Centro de control para gestionar todos los aspectos fiscales y contables. 
                  Exporta tus datos, calcula impuestos, gestiona gastos y mantén un control completo de tu situación fiscal.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contenido Principal */}
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6 py-8">
        <div className="space-y-6">
          {/* Banner de recordatorios */}
          {user?.id && (
            <TaxReminderBanner
              reminders={taxReminders}
              onViewCalendar={() => handleTabChange('calendario')}
            />
          )}
          
          {/* Sistema de Tabs */}
          <Card className="p-0 bg-white shadow-sm">
            <div className="px-4 py-3">
              <div
                role="tablist"
                aria-label="Secciones"
                className="flex items-center gap-2 rounded-2xl bg-slate-100 p-1 overflow-x-auto"
              >
                {tabs.map((tab) => {
                  const isActive = tabActiva === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => handleTabChange(tab.id)}
                      className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all whitespace-nowrap ${
                        isActive
                          ? 'bg-white text-slate-900 shadow-sm ring-1 ring-slate-200'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-white/70'
                      }`}
                      aria-selected={isActive}
                      role="tab"
                    >
                      <span className={isActive ? 'opacity-100' : 'opacity-70'}>
                        {tab.icon}
                      </span>
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </Card>

          {/* Contenido de la sección activa */}
          <div className="mt-6 space-y-6">
            {/* Descripción contextual de la pestaña activa */}
            {tabs.find(t => t.id === tabActiva) && (
              <Card className="p-4 bg-blue-50/50 border border-blue-100 shadow-sm">
                <p className="text-sm text-gray-700">
                  {tabs.find(t => t.id === tabActiva)?.description}
                </p>
              </Card>
            )}

            {/* Tab: Dashboard */}
            {tabActiva === 'dashboard' && (
              <FinancialDashboard onNavigate={handleNavigate} />
            )}

            {/* Tab: Gastos */}
            {tabActiva === 'gastos' && (
              <GestorGastosDeducibles onExpensesChange={handleExpensesChange} />
            )}

            {/* Tab: Calculadora */}
            {tabActiva === 'calculadora' && (
              <TaxCalculator
                  fiscalProfile={perfilFiscal}
                  isLoading={loadingSummary}
                />
            )}

            {/* Tab: Exportar */}
            {tabActiva === 'exportar' && (
              <div className="space-y-6">
                <ExportControlsContainer 
                  userType={user?.role === 'entrenador' ? 'trainer' : 'gym'}
                  onDateRangeChange={setSummaryDateRange}
                  initialDateRange={summaryDateRange}
                />
                <ExportHistory />
              </div>
            )}

            {/* Tab: Reportes */}
            {tabActiva === 'reportes' && (
              <div className="space-y-6">
                {taxSummary && (
                  <TaxSummaryReport 
                    summaryData={taxSummary} 
                    isLoading={loadingSummary}
                    dateRange={summaryDateRange}
                    onDateRangeChange={setSummaryDateRange}
                  />
                )}
                <AnnualSummary userId={user?.id} />
              </div>
            )}

            {/* Tab: Calendario */}
            {tabActiva === 'calendario' && user?.id && (
              <FiscalCalendar userId={user.id} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

