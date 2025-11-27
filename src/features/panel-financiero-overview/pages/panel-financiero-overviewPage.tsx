import React, { useState, useEffect, useMemo } from 'react';
import { Card } from '../../../components/componentsreutilizables';
import {
  LayoutDashboard,
  DollarSign,
  Receipt,
  AlertTriangle,
  BarChart3,
  Target,
  TrendingUp as TrendingUpIcon,
  FileText,
  Loader2,
  AlertCircle,
  RefreshCw
} from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import {
  PanelFinanciero,
  MetricasIngresos,
  GastosEstructurales,
  RendimientoMensual,
  AlertasPagos,
  AnalisisRentabilidad,
  ProyeccionesFinancieras,
  ReportesPersonalizados
} from '../components';
import { RolFinanciero } from '../types';

/**
 * Página principal del Panel Financiero / Overview
 * 
 * Sistema completo de overview financiero para entrenadores y gimnasios con métricas diferenciadas.
 * 
 * Para Entrenadores:
 * - Ingresos personales (sesiones 1 a 1, paquetes, consultas online)
 * - Clientes con pagos pendientes
 * - Rendimiento mensual individual
 * 
 * Para Gimnasios:
 * - Facturación total del centro
 * - Reparto por líneas (cuotas, PT, tienda, servicios)
 * - Costes estructurales
 * - Análisis de rentabilidad
 * 
 * @remarks
 * Esta página orquesta todos los componentes del módulo financiero mediante un sistema de pestañas
 * adaptado según el rol del usuario. Las pestañas se muestran u ocultan según el rol (entrenador/gimnasio).
 */
export const PanelFinancieroOverviewPage: React.FC = () => {
  // ============================================
  // 1) RECEPCIÓN DE ROL
  // ============================================
  // Obtener el rol desde el contexto de autenticación (misma estrategia que el resto de la app)
  const { user } = useAuth();
  
  // Determinar el rol financiero con validación
  const rol: RolFinanciero = useMemo(() => {
    if (user?.role === 'entrenador' || user?.role === 'gimnasio') {
      return user.role;
    }
    // Fallback por defecto
    return 'entrenador';
  }, [user?.role]);

  const isEntrenador = rol === 'entrenador';
  const isGimnasio = rol === 'gimnasio';

  // ============================================
  // 3) ESTADOS GLOBALES
  // ============================================
  // Estado de tab activo
  const [tabActiva, setTabActiva] = useState<string>('overview');
  
  // Loading global básico para la carga inicial
  const [loading, setLoading] = useState<boolean>(false);
  
  // Manejo de error sencillo
  const [error, setError] = useState<string | null>(null);

  const tabs = useMemo(() => obtenerTabs(), [isEntrenador, isGimnasio]);

  // Validar que la tab activa sea válida para el rol actual
  useEffect(() => {
    const tabsValidas = tabs.map(tab => tab.id);
    if (!tabsValidas.includes(tabActiva) && tabsValidas.length > 0) {
      setTabActiva(tabsValidas[0]);
    }
  }, [tabs, tabActiva]);

  // ============================================
  // 2) TABS PRINCIPALES
  // ============================================
  /**
   * Función que retorna las tabs disponibles según el rol
   * 
   * Estructura de tabs:
   * - Overview → PanelFinanciero (común)
   * - Ingresos/Facturación → MetricasIngresos (común)
   * - Costes Estructurales → GastosEstructurales (solo gimnasio)
   * - Rentabilidad → AnalisisRentabilidad (solo gimnasio)
   * - Rendimiento → RendimientoMensual (común)
   * - Alertas de Pagos → AlertasPagos (común)
   * - Proyecciones → ProyeccionesFinancieras (común)
   * - Reportes → ReportesPersonalizados (común)
   */
  const obtenerTabs = () => {
    // Tabs comunes para ambos roles
    const tabsComunes = [
      {
        id: 'overview',
        label: 'Overview',
        icon: LayoutDashboard,
        componente: 'PanelFinanciero'
      },
      {
        id: 'ingresos',
        label: isEntrenador ? 'Mis Ingresos' : 'Facturación',
        icon: DollarSign,
        componente: 'MetricasIngresos'
      },
      {
        id: 'rendimiento',
        label: 'Rendimiento',
        icon: TrendingUpIcon,
        componente: 'RendimientoMensual'
      },
      {
        id: 'alertas',
        label: 'Alertas de Pagos',
        icon: AlertTriangle,
        componente: 'AlertasPagos'
      },
      {
        id: 'proyecciones',
        label: 'Proyecciones',
        icon: BarChart3,
        componente: 'ProyeccionesFinancieras'
      },
      {
        id: 'reportes',
        label: 'Reportes',
        icon: FileText,
        componente: 'ReportesPersonalizados'
      }
    ];

    // Tabs adicionales solo para gimnasios
    const tabsGimnasio = [
      {
        id: 'gastos',
        label: 'Costes Estructurales',
        icon: Receipt,
        componente: 'GastosEstructurales',
        visible: isGimnasio // Solo visible si rol === "gimnasio"
      },
      {
        id: 'rentabilidad',
        label: 'Rentabilidad',
        icon: Target,
        componente: 'AnalisisRentabilidad',
        visible: isGimnasio // Solo visible si rol === "gimnasio"
      }
    ];

    // Construir array final: tabs comunes + tabs de gimnasio (si aplica) en el orden correcto
    if (isGimnasio) {
      // Para gimnasio: Overview, Ingresos, Costes, Rentabilidad, Rendimiento, Alertas, Proyecciones, Reportes
      return [
        ...tabsComunes.slice(0, 2), // Overview, Ingresos
        ...tabsGimnasio, // Costes, Rentabilidad
        ...tabsComunes.slice(2) // Rendimiento, Alertas, Proyecciones, Reportes
      ];
    } else {
      // Para entrenador: todas las tabs comunes
      return tabsComunes;
    }
  };

  // Función para manejar errores
  const handleError = (errorMessage: string) => {
    setError(errorMessage);
    setLoading(false);
  };

  // Función para reintentar
  const handleRetry = () => {
    setError(null);
    setLoading(true);
    // Simular recarga (en producción, aquí se recargarían los datos)
    setTimeout(() => {
      setLoading(false);
    }, 500);
  };

  // ============================================
  // RENDERIZADO DE CONTENIDO POR TAB
  // ============================================
  const renderTabContent = () => {
    // Si hay error global, mostrarlo
    if (error) {
      return (
        <Card className="p-6 bg-white shadow-sm">
          <div className="flex flex-col items-center justify-center py-8">
            <div className="p-3 bg-red-100 rounded-full mb-4">
              <AlertCircle className="w-6 h-6 text-red-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Error al cargar el panel financiero
            </h3>
            <p className="text-sm text-gray-600 text-center mb-4 max-w-md">
              {error}
            </p>
            <button
              onClick={handleRetry}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Reintentar
            </button>
          </div>
        </Card>
      );
    }

    // Si está cargando, mostrar loading
    if (loading) {
      return (
        <Card className="p-6 bg-white shadow-sm">
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
            <span className="ml-3 text-gray-600">Cargando panel financiero...</span>
          </div>
        </Card>
      );
    }

    // Renderizar contenido según la tab activa
    switch (tabActiva) {
      case 'overview':
        // Tab Overview → usa PanelFinanciero
        return <PanelFinanciero rol={rol} />;

      case 'ingresos':
        // Tab Ingresos/Facturación → usa MetricasIngresos
        return <MetricasIngresos rol={rol} />;

      case 'gastos':
        // Tab Costes Estructurales → solo visible si rol === "gimnasio", usa GastosEstructurales
        if (isGimnasio) {
          return <GastosEstructurales />;
        }
        return null;

      case 'rentabilidad':
        // Tab Rentabilidad → solo visible si rol === "gimnasio", usa AnalisisRentabilidad
        if (isGimnasio) {
          return <AnalisisRentabilidad />;
        }
        return null;

      case 'rendimiento':
        // Tab Rendimiento → usa RendimientoMensual
        return <RendimientoMensual rol={rol} />;

      case 'alertas':
        // Tab Alertas de Pagos → usa AlertasPagos
        return <AlertasPagos />;

      case 'proyecciones':
        // Tab Proyecciones → usa ProyeccionesFinancieras
        return <ProyeccionesFinancieras rol={rol} />;

      case 'reportes':
        // Tab Reportes → usa ReportesPersonalizados
        return <ReportesPersonalizados />;

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
                <DollarSign size={24} className="text-blue-600" />
              </div>
              
              {/* Título y descripción */}
              <div>
                <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900">
                  {isEntrenador ? 'Panel Financiero' : 'Overview Financiero'}
                </h1>
                <p className="text-gray-600">
                  {isEntrenador 
                    ? 'Visión completa de tus ingresos personales, clientes pendientes y rendimiento mensual. Controla tu economía y gestiona tus cobros de manera eficiente.'
                    : 'Visión completa de la facturación del centro, reparto por líneas, costes estructurales y análisis de rentabilidad. Toma decisiones informadas sobre la salud financiera de tu negocio.'
                  }
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6 py-8">
        <Card className="p-0 bg-white shadow-sm">
          {/* ============================================
              4) RESPONSIVE BÁSICO - Tabs con scroll horizontal en móvil
              ============================================ */}
          <div className="px-4 py-3">
            <div
              role="tablist"
              aria-label="Secciones del panel financiero"
              className="flex items-center gap-2 rounded-2xl bg-slate-100 p-1 overflow-x-auto scrollbar-hide"
              style={{ 
                scrollbarWidth: 'none', 
                msOverflowStyle: 'none',
                WebkitOverflowScrolling: 'touch'
              }}
            >
              {tabs.map((tab) => {
                const activo = tabActiva === tab.id;
                const IconComponent = tab.icon;
                return (
                  <button
                    key={tab.id}
                    role="tab"
                    aria-selected={activo}
                    onClick={() => setTabActiva(tab.id)}
                    className={[
                      'inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all whitespace-nowrap flex-shrink-0',
                      activo
                        ? 'bg-white text-slate-900 shadow-sm ring-1 ring-slate-200'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-white/70'
                    ].join(' ')}
                  >
                    <IconComponent
                      size={18}
                      className={activo ? 'opacity-100' : 'opacity-70'}
                    />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </Card>

        {/* Contenido de la pestaña activa */}
        <div className="mt-6">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
}

