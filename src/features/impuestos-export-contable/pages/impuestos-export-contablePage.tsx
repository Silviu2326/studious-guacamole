import React, { useState, useEffect } from 'react';
import { Card } from '../../../components/componentsreutilizables';
import { useAuth } from '../../../context/AuthContext';
import {
  FiscalProfileForm,
  TaxSummaryReport,
  ExportControlsContainer,
  ExportHistory,
  GestorGastosDeducibles,
  TaxCalculator,
  FiscalCalendarComponent,
  AnnualSummaryComponent,
  TaxReminderBanner,
  IncomeExpensesChart,
  FinancialDashboard,
  BankCSVImport,
  TaxPDFReportGenerator
} from '../components';
import { fiscalProfileApi, taxSummaryApi } from '../api';
import { FiscalProfile, TaxSummary } from '../api/types';
import { FileText, Building2, Download, History, TrendingDown, Calendar, BarChart3, LayoutDashboard, Upload, FileDown } from 'lucide-react';
import { useTaxReminders } from '../hooks/useTaxReminders';

/**
 * Página principal de Impuestos & Export Contable
 * 
 * Sistema completo de gestión fiscal y exportación contable.
 * 
 * Para Entrenadores Personales:
 * - Exportación simplificada de ingresos y gastos
 * - Ideal para enviar a gestoría
 * - Formato CSV simple
 * 
 * Para Gimnasios:
 * - Informes fiscales avanzados con desglose de IVA
 * - Exportaciones compatibles con software contable (A3, Sage, etc.)
 * - Preparación para modelos fiscales
 * - Gestión de perfil fiscal corporativo
 */
export default function ImpuestosExportContablePage() {
  const { user } = useAuth();
  const isEntrenador = user?.role === 'entrenador';
  
  const [tabActiva, setTabActiva] = useState('dashboard');
  const [fiscalProfile, setFiscalProfile] = useState<FiscalProfile | null>(null);
  const [taxSummary, setTaxSummary] = useState<TaxSummary | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [loadingSummary, setLoadingSummary] = useState(false);
  const [saving, setSaving] = useState(false);
  
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
    loadFiscalProfile();
  }, []);

  // Cargar resumen fiscal cuando cambie el rango de fechas o la pestaña activa
  useEffect(() => {
    if (tabActiva === 'export' || tabActiva === 'calculator') {
      loadTaxSummary();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [summaryDateRange.from?.getTime(), summaryDateRange.to?.getTime(), tabActiva]);

  const loadFiscalProfile = async () => {
    setLoadingProfile(true);
    try {
      const profile = await fiscalProfileApi.getProfile();
      setFiscalProfile(profile);
    } catch (error) {
      console.error('Error loading fiscal profile:', error);
    } finally {
      setLoadingProfile(false);
    }
  };

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

  const handleProfileUpdate = async (data: FiscalProfile) => {
    setSaving(true);
    try {
      const updated = await fiscalProfileApi.updateProfile(data);
      setFiscalProfile(updated);
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setSaving(false);
    }
  };

  // Callback para refrescar el resumen cuando cambien los gastos
  const handleExpensesChange = () => {
    if (tabActiva === 'export' || tabActiva === 'calculator') {
      loadTaxSummary();
    }
  };

  // Tabs según el tipo de usuario
  const tabsTrainer = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: <LayoutDashboard size={18} />
    },
    {
      id: 'import',
      label: 'Importar CSV',
      icon: <Upload size={18} />
    },
    {
      id: 'pdf-report',
      label: 'Informe PDF',
      icon: <FileDown size={18} />
    },
    {
      id: 'calculator',
      label: 'Calculadora de Impuestos',
      icon: <FileText size={18} />
    },
    {
      id: 'export',
      label: 'Exportar Ingresos',
      icon: <Download size={18} />
    },
    {
      id: 'annual',
      label: 'Resumen Anual',
      icon: <BarChart3 size={18} />
    },
    {
      id: 'calendar',
      label: 'Calendario Fiscal',
      icon: <Calendar size={18} />
    },
    {
      id: 'gastos',
      label: 'Gastos Deducibles',
      icon: <TrendingDown size={18} />
    },
    {
      id: 'profile',
      label: 'Datos Fiscales',
      icon: <Building2 size={18} />
    }
  ];

  const tabsGym = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: <LayoutDashboard size={18} />
    },
    {
      id: 'import',
      label: 'Importar CSV',
      icon: <Upload size={18} />
    },
    {
      id: 'pdf-report',
      label: 'Informe PDF',
      icon: <FileDown size={18} />
    },
    {
      id: 'calculator',
      label: 'Calculadora de Impuestos',
      icon: <FileText size={18} />
    },
    {
      id: 'export',
      label: 'Exportar',
      icon: <Download size={18} />
    },
    {
      id: 'annual',
      label: 'Resumen Anual',
      icon: <BarChart3 size={18} />
    },
    {
      id: 'calendar',
      label: 'Calendario Fiscal',
      icon: <Calendar size={18} />
    },
    {
      id: 'gastos',
      label: 'Gastos Deducibles',
      icon: <TrendingDown size={18} />
    },
    {
      id: 'profile',
      label: 'Datos Fiscales',
      icon: <Building2 size={18} />
    },
    {
      id: 'history',
      label: 'Historial',
      icon: <History size={18} />
    }
  ];

  const tabs = isEntrenador ? tabsTrainer : tabsGym;

  const handleNavigate = (tab: string) => {
    setTabActiva(tab);
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
                  {isEntrenador 
                    ? 'Exporta tus ingresos y gestiona tus datos fiscales de forma simple. Genera informes listos para enviar a tu gestor.'
                    : 'Sistema completo de gestión fiscal y exportación contable. Genera informes avanzados y exportaciones compatibles con software contable profesional.'
                  }
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
              onViewCalendar={() => setTabActiva('calendar')}
            />
          )}
          
          {/* Sistema de Tabs */}
          <Card className="p-0 bg-white shadow-sm">
            <div className="px-4 py-3">
              <div
                role="tablist"
                aria-label="Secciones"
                className="flex items-center gap-2 rounded-2xl bg-slate-100 p-1"
              >
                {tabs.map((tab) => {
                  const isActive = tabActiva === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setTabActiva(tab.id)}
                      className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all ${
                        isActive
                          ? 'bg-white text-slate-900 shadow-sm ring-1 ring-slate-200'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-white/70'
                      }`}
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
            {/* Tab: Dashboard */}
            {tabActiva === 'dashboard' && (
              <FinancialDashboard onNavigate={handleNavigate} />
            )}

            {/* Tab: Importar CSV */}
            {tabActiva === 'import' && (
              <BankCSVImport onImportComplete={handleExpensesChange} />
            )}

            {/* Tab: Informe PDF */}
            {tabActiva === 'pdf-report' && (
              <>
                <ExportControlsContainer 
                  userType={isEntrenador ? 'trainer' : 'gym'}
                  onDateRangeChange={setSummaryDateRange}
                  initialDateRange={summaryDateRange}
                />
                <TaxPDFReportGenerator 
                  dateRange={summaryDateRange}
                  onGenerateComplete={() => {
                    // Opcional: recargar datos después de generar el informe
                  }}
                />
              </>
            )}

            {/* Tab: Calculadora de Impuestos */}
            {tabActiva === 'calculator' && (
              <>
                <ExportControlsContainer 
                  userType={isEntrenador ? 'trainer' : 'gym'}
                  onDateRangeChange={setSummaryDateRange}
                  initialDateRange={summaryDateRange}
                />
                {taxSummary && fiscalProfile && (
                  <TaxCalculator
                    fiscalProfile={fiscalProfile}
                    taxSummary={taxSummary}
                    isLoading={loadingSummary}
                  />
                )}
                {(!taxSummary || !fiscalProfile) && !loadingSummary && (
                  <Card className="p-6 bg-white shadow-sm">
                    <div className="text-center text-gray-500">
                      Carga los datos fiscales y el resumen para ver la calculadora de impuestos
                    </div>
                  </Card>
                )}
              </>
            )}

            {/* Tab: Exportar */}
            {tabActiva === 'export' && (
              <>
                {taxSummary && (
                  <TaxSummaryReport 
                    summaryData={taxSummary} 
                    isLoading={loadingSummary}
                  />
                )}
                <ExportControlsContainer 
                  userType={isEntrenador ? 'trainer' : 'gym'}
                  onDateRangeChange={setSummaryDateRange}
                  initialDateRange={summaryDateRange}
                />
                <IncomeExpensesChart userId={user?.id} />
              </>
            )}

            {/* Tab: Resumen Anual */}
            {tabActiva === 'annual' && (
              <AnnualSummaryComponent userId={user?.id} />
            )}

            {/* Tab: Calendario Fiscal */}
            {tabActiva === 'calendar' && user?.id && (
              <FiscalCalendarComponent userId={user.id} />
            )}

            {/* Tab: Gastos Deducibles */}
            {tabActiva === 'gastos' && (
              <GestorGastosDeducibles onExpensesChange={handleExpensesChange} />
            )}

            {/* Tab: Datos Fiscales */}
            {tabActiva === 'profile' && fiscalProfile && (
              <FiscalProfileForm
                initialData={fiscalProfile}
                onSubmit={handleProfileUpdate}
                isSaving={saving}
              />
            )}

            {/* Tab: Historial (solo gimnasios) */}
            {tabActiva === 'history' && !isEntrenador && (
              <ExportHistory />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

