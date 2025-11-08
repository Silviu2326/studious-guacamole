import { AuthProvider, useAuth } from './context/AuthContext';
import { Login } from './components/Login';
import { Dashboard } from './components/Dashboard';
import AdherenciaCumplimientoEntrenoPage from './features/adherencia-cumplimiento-de-entreno/pages/adherencia-cumplimiento-de-entrenoPage';
import { RestriccionesAlimentariasPage } from './features/restricciones-alimentarias/page';
import { CajaBancosPage } from './features/caja-bancos/pages/caja-bancosPage';
import { CampanasOutreachPage } from './features/campanas-outreach/pages/campanas-outreachPage';
import AbTestingYExperimentacionPage from './features/AbTestingYExperimentacion/pages/AbTestingYExperimentacionPage';
import AccountBasedMarketingAbmPage from './features/AccountBasedMarketingAbm/pages/AccountBasedMarketingAbmPage';
import CommunityYEngagementPage from './features/CommunityYEngagement/pages/CommunityYEngagementPage';
import CompetitiveAnalysisYMarketIntelligencePage from './features/CompetitiveAnalysisYMarketIntelligence/pages/CompetitiveAnalysisYMarketIntelligencePage';
import ConstructorDeFunnelsYLandingPagesPage from './features/ConstructorDeFunnelsYLandingPages/pages/ConstructorDeFunnelsYLandingPagesPage';
import ContentClipperPage from './features/ContentClipper/pages/ContentClipperPage';
import CreatorinfluencerContentSyndicationPage from './features/CreatorinfluencerContentSyndication/pages/CreatorinfluencerContentSyndicationPage';
import DynamicPricingYOfertasInteligentesPage from './features/DynamicPricingYOfertasInteligentes/pages/DynamicPricingYOfertasInteligentesPage';
import EmailDeliverabilityYComplianceHubPage from './features/EmailDeliverabilityYComplianceHub/pages/EmailDeliverabilityYComplianceHubPage';
import EmailMarketingYNewslettersPage from './features/EmailMarketingYNewsletters/pages/EmailMarketingYNewslettersPage';
import EventosYRetosPage from './features/EventosYRetos/pages/EventosYRetosPage';
import FeedbackLoopYEncuestasInteligentesPage from './features/FeedbackLoopYEncuestasInteligentes/pages/FeedbackLoopYEncuestasInteligentesPage';
import GeneradorCreativoConIaPage from './features/GeneradorCreativoConIa/pages/GeneradorCreativoConIaPage';
import GeneradorDeEstrategiasDeMarketingConIaPage from './features/GeneradorDeEstrategiasDeMarketingConIa/pages/GeneradorDeEstrategiasDeMarketingConIaPage';
import GeneradorDeIdeasDeContenidoConIaPage from './features/GeneradorDeIdeasDeContenidoConIa/pages/GeneradorDeIdeasDeContenidoConIaPage';
import GestionDeContenidosPremiumPage from './features/GestionDeContenidosPremium/pages/GestionDeContenidosPremiumPage';
import { CatalogoPage } from './features/catalogo-planes';
import { CatalogoProductosPage } from './features/catalogo-productos';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { Layout } from './components/Layout';
import { useState } from 'react';
import { ExamplePage } from './components/componentsreutilizables';
import AgendaCalendarioPage from './features/agenda-calendario/pages/agenda-calendarioPage';
import AlertasRestriccionesAlimentariasPage from './features/alertas-restricciones-alimentarias/pages/alertas-restricciones-alimentariasPage';
import DisponibilidadTurnosStaffPage from './features/disponibilidad-turnos-staff/pages/disponibilidad-turnos-staffPage';
import EditorDeEntrenoPage from './features/editor-de-entreno/pages/editor-de-entrenoPage';
import SuiteDeEntrenoPage from './features/suite-de-entreno/pages/suite-de-entrenoPage';
import SuiteDeNutricionPage from './features/suite-de-nutricion/pages/suite-de-nutricionPage';
import EncuestasSatisfaccinNPSCSATPage from './features/encuestas-satisfaccin-npscsat/pages/encuestas-satisfaccin-npscsatPage';
import EventosRetosEspecialesPage from './features/eventos-retos-especiales';
import EventosRetosPage from './features/eventos-retos/pages/eventos-retosPage';
import { FacturacinCobrosPage } from './features/facturacin-cobros';
import { GastosProveedoresPage } from './features/gastos-proveedores';
import GestiónDeClientesPage from './features/gestión-de-clientes/pages/gestión-de-clientesPage';
import InformeDeVentasRetailPage from './features/informe-de-ventas-retail/pages/informe-de-ventas-retailPage';
import { InventarioStockPage } from './features/inventario-stock';
import RecepcionesDeMaterialPage from './features/recepciones-de-material/pages/recepciones-de-materialPage';
import LeadsPage from './features/leads/pages/leadsPage';
import ListaEsperaAusenciasPage from './features/lista-de-espera-ausencias/pages/lista-de-espera-ausenciasPage';
import ListaDeLaCompraSupermercadoPage from './features/lista-de-la-compra-supermercado/pages/lista-de-la-compra-supermercadoPage';
import { ListasInteligentesSegmentosGuardadosPage } from './features/listas-inteligentes-segmentos-guardados';
import { MantenimientoIncidenciasPage } from './features/mantenimiento-incidencias';
import MembresiasActivasPage from './features/membresas-activas/pages/membresas-activasPage';
import ObjetivosRendimientoPage from './features/objetivos-rendimiento/pages/objetivos-rendimientoPage';
import PagosPendientesMorosidadPage from './features/pagos-pendientes-morosidad/pages/pagos-pendientes-morosidadPage';
import { PedidosTicketsPage } from './features/pedidos-tickets';
import PipelineDeVentaKanbanPage from './features/pipeline-de-venta-kanban/pages/pipeline-de-venta-kanbanPage';
import PlantillasDeEntrenamientoPage from './features/plantillas-de-entrenamiento/pages/plantillas-de-entrenamientoPage';
import PortalDelClienteAutoservicioPage from './features/portal-del-cliente-autoservicio/pages/portal-del-cliente-autoservicioPage';
import ProgramasDeEntrenoPage from './features/programas-de-entreno/pages/programas-de-entrenoPage';
import TurnosHorariosDelStaffPage from './features/turnos-horarios-del-staff/pages/turnos-horarios-del-staffPage';
import CheckInsDeEntrenoPage from './features/check-ins-de-entreno/pages/check-ins-de-entrenoPage';
import CheckInsNutricionalesPage from './features/check-ins-nutricionales/pages/check-ins-nutricionalesPage';
import ControlAccesoAforoTiempoRealPage from './features/control-de-acceso-aforo-en-tiempo-real/pages/control-de-acceso-aforo-en-tiempo-realPage';
import RecetarioComidasGuardadasPage from './features/recetario-comidas-guardadas/pages/recetario-comidas-guardadasPage';
import RecursosSalasMaterialPage from './features/recursos-salas-material/pages/recursos-salas-materialPage';
import RenovacionesBajasPage from './features/renovaciones-bajas/pages/renovaciones-bajasPage';
import ReservasOnlinePage from './features/reservas-online/pages/reservas-onlinePage';
import ResumenGeneralPage from './features/resumen-general/pages/resumen-generalPage';
import SuscripcionesCuotasRecurrentesPage from './features/suscripciones-cuotas-recurrentes/pages/suscripciones-cuotas-recurrentesPage';
import TareasAlertasPage from './features/tareas-alertas/pages/tareas-alertasPage';
import TiendaOnlineCheckoutOnlinePage from './features/tienda-online-checkout-online/pages/tienda-online-checkout-onlinePage';
import AfiliadosReferidosPage from './features/afiliados-referidos/pages/afiliados-referidosPage';
import AnaliticaDeAdquisicionPage from './features/analitica-de-adquisicion/pages/analitica-de-adquisicionPage';
import CatalogoYPreciosPorSedePage from './features/catalogo-y-precios-por-sede/pages/catalogo-y-precios-por-sedePage';
import ChecklistsOperativosAperturaCierreLimpiezaPage from './features/checklists-operativos-aperturacierrelimpieza/pages/checklists-operativos-aperturacierrelimpiezaPage';
import { ClientesPerdidosBajasPage } from './features/clientes-perdidos-bajas';
import ClientesEnRiesgoRetencionPage from './features/clientes-en-riesgo-retencion/pages/clientes-en-riesgo-retencionPage';
import { Cliente360Page } from './features/cliente-360/pages/cliente-360Page';
import ComparativaEntreSedesPage from './features/comparativa-entre-sedes/pages/comparativa-entre-sedesPage';
import ResumenPorSedePage from './features/resumen-por-sede/pages/resumen-por-sedePage';
import DocumentacionInternaYProtocolosPage from './features/documentacion-interna-y-protocolos/pages/documentacion-interna-y-protocolosPage';
import EmbudosOfertasLandingPagesPage from './features/embudos-ofertas-landing-pages/pages/embudos-ofertas-landing-pagesPage';
import EmpleadosActivosPage from './features/empleados-activos/pages/empleados-activosPage';
import EmpresasConveniosPage from './features/empresas-convenios/pages/empresas-conveniosPage';
import EquipoRolesPage from './features/equipo-roles/pages/equipo-rolesPage';
import PortalEmpresaPage from './features/portal-empresa/pages/portal-empresaPage';
import EvaluacionDeProveedoresPage from './features/evaluacion-de-proveedores/pages/evaluacion-de-proveedoresPage';
import FacturacionAEmpresasPage from './features/facturacion-a-empresas/pages/facturacion-a-empresasPage';
import FeedbackInternoYEvaluacionesDeRendimientoPage from './features/feedback-interno-y-evaluaciones-de-rendimiento/pages/feedback-interno-y-evaluaciones-de-rendimientoPage';
import GeneralDelCentroMarcaPersonalPage from './features/general-del-centro-marca-personal/pages/general-del-centro-marca-personalPage';
import HistoricoDeCostesDeCompraPage from './features/historico-de-costes-de-compra/pages/historico-de-costes-de-compraPage';
import ImportadoresMigracionesPage from './features/importadores-migraciones/pages/importadores-migracionesPage';
import ImpuestosExportContablePage from './features/impuestos-export-contable/pages/impuestos-export-contablePage';
import InformesFinancierosAvanzadosPage from './features/informes-financieros-avanzados/pages/informes-financieros-avanzadosPage';
import IntegracionesYAutomatizacionPage from './features/integraciones-y-automatizacion/pages/integraciones-y-automatizacionPage';
import MonedaImpuestosSeriesDeFacturaPage from './features/moneda-impuestos-series-de-factura/pages/moneda-impuestos-series-de-facturaPage';
import NormativaYPlantillasGlobalesPage from './features/normativa-y-plantillas-globales/pages/normativa-y-plantillas-globalesPage';
import NominasVariablesPage from './features/nominas-variables/pages/nominas-variablesPage';
import ObjetivosComisionesPage from './features/objetivos-comisiones/pages/objetivos-comisionesPage';
import ParteHorariaFichajesPage from './features/parte-horaria-fichajes/pages/parte-horaria-fichajesPage';
import RolesPermisosPage from './features/roles-permisos/pages/roles-permisosPage';
import OrdenesDeCompraPage from './features/ordenes-de-compra/pages/ordenes-de-compraPage';
import ServiciosTarifasPage from './features/servicios-tarifas/pages/servicios-tarifasPage';
import WebhooksApiKeysPage from './features/webhooks-api-keys/pages/webhooks-api-keysPage';
import PlantillasDeMensajesYContratosPage from './features/plantillas-de-mensajes-y-contratos/pages/plantillas-de-mensajes-y-contratosPage';
import PoliticasTerminosPage from './features/politicas-terminos/pages/politicas-terminosPage';
import PresupuestosForecastPage from './features/presupuestos-forecast/pages/presupuestos-forecastPage';
import ProveedoresContratosPage from './features/proveedores-contratos/pages/proveedores-contratosPage';
import TransferenciasEntreSedesPage from './features/transferencias-entre-sedes/pages/transferencias-entre-sedesPage';
import UsoResultadosProgramasCorporativosPage from './features/uso-resultados-programas-corporativos/pages/uso-resultados-programas-corporativosPage';
import GestorDeAnunciosPage from './features/GestorDeAnuncios/pages/GestorDeAnunciosPage';
import HubDeContenidosYUgcPage from './features/HubDeContenidosYUgc/pages/HubDeContenidosYUgcPage';
import LeadMagnetFactoryPage from './features/LeadMagnetFactory/pages/LeadMagnetFactoryPage';
import LibreriaDeCampanasPlaybooksPage from './features/LibreriaDeCampanasPlaybooks/pages/LibreriaDeCampanasPlaybooksPage';
import LifecycleEmailSequencesPage from './features/LifecycleEmailSequences/pages/LifecycleEmailSequencesPage';
import LeadInboxUnificadoYSlaPage from './features/LeadInboxUnificadoYSla/pages/LeadInboxUnificadoYSlaPage';
import LoyaltyProgramManagerPage from './features/LoyaltyProgramManager/pages/LoyaltyProgramManagerPage';
import MarketingDeReferidosPage from './features/MarketingDeReferidos/pages/MarketingDeReferidosPage';
import PartnershipsYInfluencersPage from './features/PartnershipsYInfluencers/pages/PartnershipsYInfluencersPage';
import PersonalizationEngineIaAvanzadaPage from './features/PersonalizationEngineIaAvanzada/pages/PersonalizationEngineIaAvanzadaPage';
import PlannerDeRedesSocialesPage from './features/PlannerDeRedesSociales/pages/PlannerDeRedesSocialesPage';
import ProgressiveProfilingPage from './features/ProgressiveProfiling/pages/ProgressiveProfilingPage';
import PromocionesCuponesYPacksPage from './features/PromocionesCuponesYPacks/pages/PromocionesCuponesYPacksPage';
import ReferidosYAfiliadosPage from './features/ReferidosYAfiliados/pages/ReferidosYAfiliadosPage';
import RetargetingYPixelManagerPage from './features/RetargetingYPixelManager/pages/RetargetingYPixelManagerPage';
import ReviewYTestimonialEnginePage from './features/ReviewYTestimonialEngine/pages/ReviewYTestimonialEnginePage';
import SegmentacionDinamicaYAudienciasPage from './features/SegmentacionDinamicaYAudiencias/pages/SegmentacionDinamicaYAudienciasPage';
import SmsemailPreferenceCenterPage from './features/SmsemailPreferenceCenter/pages/SmsemailPreferenceCenterPage';
import SmswhatsappAutomationPage from './features/SmswhatsappAutomation/pages/SmswhatsappAutomationPage';
import SmswhatsappMarketingPage from './features/SmswhatsappMarketing/pages/SmswhatsappMarketingPage';
import TrendAnalizerPage from './features/TrendAnalizer/pages/TrendAnalizerPage';
import VideoMarketingYAutomationPage from './features/VideoMarketingYAutomation/pages/VideoMarketingYAutomationPage';
import WebinarsYVirtualEventsManagerPage from './features/WebinarsYVirtualEventsManager/pages/WebinarsYVirtualEventsManagerPage';
import { CampanasPromocionesPage } from './features/CampanasYPromociones/pages/CampanasPromocionesPage';
import { LandingPagesSimplesPage } from './features/LandingPagesSimples/pages/LandingPagesSimplesPage';
import { GestionResenasTestimoniosPage } from './features/GestionResenasTestimonios/pages/GestionResenasTestimoniosPage';
import { CampanasRetencionRiesgoPage } from './features/CampanasRetencionRiesgo/pages/CampanasRetencionRiesgoPage';
import { RedesSocialesPlannerSimplePage } from './features/RedesSocialesPlannerSimple/pages/RedesSocialesPlannerSimplePage';
import { AnaliticaCaptacionPage } from './features/AnaliticaCaptacion/pages/AnaliticaCaptacionPage';
import { Clientes360Page } from './features/Clientes360/pages/Clientes360Page';
import { AgendaReservasPage } from './features/AgendaReservas/pages/AgendaReservasPage';
import { MembresiasPlanesPage } from './features/MembresiasPlanes/pages/MembresiasPlanesPage';
import { FinanzasPage } from './features/Finanzas/pages/FinanzasPage';
import { VentasYLeadsPage } from './features/VentasYLeads/pages/VentasYLeadsPage';
import { B2BEmpresasPage } from './features/B2BEmpresas';
import { OperacionesPage } from './features/Operaciones';
import { EquipoRRHHPage } from './features/EquipoRRHH';
import { MultisedeFranquiciasPage } from './features/MultisedeFranquicias';
import { ConfiguracionCentroPage } from './features/ConfiguracionCentro';

function ProtectedRoute() {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return <Outlet />;
}

function RedirectIfAuthed() {
  const { user } = useAuth();
  if (user) return <Navigate to="/resumen-general" replace />;
  return <Login />;
}

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/example" element={<ExamplePage />} />
        <Route path="/login" element={<RedirectIfAuthed />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          {/** Envuelve las páginas con Layout para mostrar Sidebar */}
          <Route element={<AppLayout />}>
            <Route path="/adherencia" element={<AdherenciaCumplimientoEntrenoPage />} />
            <Route path="/restricciones" element={<RestriccionesAlimentariasPage />} />
            <Route path="/catalogo-planes" element={<CatalogoPage />} />
            <Route path="/catalogo-productos" element={<CatalogoProductosPage />} />
            <Route path="/settings/services" element={<ServiciosTarifasPage />} />
            <Route path="/agenda" element={<AgendaCalendarioPage />} />
            <Route path="/agenda-reservas" element={<AgendaReservasPage />} />
            <Route path="/membresias-planes" element={<MembresiasPlanesPage />} />
            <Route path="/caja-bancos" element={<CajaBancosPage />} />
            <Route path="/campanas-outreach" element={<CampanasOutreachPage />} />
            <Route path="/alertas-restricciones-alimentarias" element={<AlertasRestriccionesAlimentariasPage />} />
            <Route path="/disponibilidad-turnos-staff" element={<DisponibilidadTurnosStaffPage />} />
            <Route path="/editor-de-entreno" element={<EditorDeEntrenoPage />} />
            <Route path="/encuestas-satisfaccin-npscsat" element={<EncuestasSatisfaccinNPSCSATPage />} />
            <Route path="/eventos-retos-especiales" element={<EventosRetosEspecialesPage />} />
            <Route path="/eventos-retos" element={<EventosRetosPage />} />
            <Route path="/facturacin-cobros" element={<FacturacinCobrosPage />} />
            <Route path="/gastos-proveedores" element={<GastosProveedoresPage />} />
            <Route path="/ordenes-de-compra" element={<OrdenesDeCompraPage />} />
            <Route path="/finanzas/compras/historico-costes" element={<HistoricoDeCostesDeCompraPage />} />
            <Route path="/gestión-de-clientes" element={<GestiónDeClientesPage />} />
            <Route path="/informe-de-ventas-retail" element={<InformeDeVentasRetailPage />} />
            <Route path="/inventario-stock" element={<InventarioStockPage />} />
            <Route path="/inventario/recepciones" element={<RecepcionesDeMaterialPage />} />
            <Route path="/leads" element={<LeadsPage />} />
            <Route path="/dashboard/analytics/inbox" element={<LeadInboxUnificadoYSlaPage />} />
            <Route path="/lista-de-espera-ausencias" element={<ListaEsperaAusenciasPage />} />
            <Route path="/lista-de-la-compra-supermercado" element={<ListaDeLaCompraSupermercadoPage />} />
            <Route path="/listas-inteligentes-segmentos-guardados" element={<ListasInteligentesSegmentosGuardadosPage />} />
            <Route path="/mantenimiento-incidencias" element={<MantenimientoIncidenciasPage />} />
            <Route path="/membresias-activas" element={<MembresiasActivasPage />} />
            <Route path="/objetivos-rendimiento" element={<ObjetivosRendimientoPage />} />
            <Route path="/pagos-pendientes-morosidad" element={<PagosPendientesMorosidadPage />} />
            <Route path="/panel-financiero-overview" element={<FinanzasPage />} />
            <Route path="/pedidos-tickets" element={<PedidosTicketsPage />} />
            <Route path="/pipeline-de-venta-kanban" element={<PipelineDeVentaKanbanPage />} />
            <Route path="/clientes-360" element={<Clientes360Page />} />
            <Route path="/ventas-leads" element={<VentasYLeadsPage />} />
            <Route path="/plantillas-de-entrenamiento" element={<PlantillasDeEntrenamientoPage />} />
            <Route path="/settings/templates" element={<PlantillasDeMensajesYContratosPage />} />
            <Route path="/settings/policies" element={<PoliticasTerminosPage />} />
            <Route path="/portal-del-cliente-autoservicio" element={<PortalDelClienteAutoservicioPage />} />
            <Route path="/programas-de-entreno" element={<ProgramasDeEntrenoPage />} />
            <Route path="/suite-de-entreno" element={<SuiteDeEntrenoPage />} />
            <Route path="/suite-de-nutricion" element={<SuiteDeNutricionPage />} />
            <Route path="/turnos-horarios-del-staff" element={<TurnosHorariosDelStaffPage />} />
            <Route path="/check-ins-de-entreno" element={<CheckInsDeEntrenoPage />} />
            <Route path="/check-ins-nutricionales" element={<CheckInsNutricionalesPage />} />
            <Route path="/control-de-acceso-aforo" element={<ControlAccesoAforoTiempoRealPage />} />
            <Route path="/recetario-comidas-guardadas" element={<RecetarioComidasGuardadasPage />} />
            <Route path="/recursos-salas-material" element={<RecursosSalasMaterialPage />} />
            <Route path="/renovaciones-bajas" element={<RenovacionesBajasPage />} />
            <Route path="/reservas-online" element={<ReservasOnlinePage />} />
            <Route path="/resumen-general" element={<ResumenGeneralPage />} />
            <Route path="/suscripciones-cuotas-recurrentes" element={<SuscripcionesCuotasRecurrentesPage />} />
            <Route path="/tareas-alertas" element={<TareasAlertasPage />} />
            <Route path="/tienda-online-checkout-online" element={<TiendaOnlineCheckoutOnlinePage />} />
            <Route path="/marketing/afiliados-y-referidos" element={<AfiliadosReferidosPage />} />
            <Route path="/marketing/landing-pages" element={<EmbudosOfertasLandingPagesPage />} />
            <Route path="/marketing/ab-testing" element={<AbTestingYExperimentacionPage />} />
            <Route path="/dashboard/marketing/anuncios" element={<GestorDeAnunciosPage />} />
            <Route path="/dashboard/marketing/social-planner" element={<PlannerDeRedesSocialesPage />} />
            <Route path="/abm" element={<AccountBasedMarketingAbmPage />} />
            <Route path="/comunidad" element={<CommunityYEngagementPage />} />
            <Route path="/market-intelligence" element={<CompetitiveAnalysisYMarketIntelligencePage />} />
            <Route path="/dashboard/marketing/funnels" element={<ConstructorDeFunnelsYLandingPagesPage />} />
            <Route path="/dashboard/content/clipper" element={<ContentClipperPage />} />
            <Route path="/dashboard/content/video-studio" element={<VideoMarketingYAutomationPage />} />
            <Route path="/dashboard/marketing/influencers" element={<CreatorinfluencerContentSyndicationPage />} />
            <Route path="/dashboard/monetizacion/precios-dinamicos" element={<DynamicPricingYOfertasInteligentesPage />} />
            <Route path="/dashboard/monetizacion/loyalty" element={<LoyaltyProgramManagerPage />} />
            <Route path="/dashboard/monetizacion/referidos" element={<MarketingDeReferidosPage />} />
            <Route path="/dashboard/partnerships" element={<PartnershipsYInfluencersPage />} />
            <Route path="/dashboard/email/compliance" element={<EmailDeliverabilityYComplianceHubPage />} />
            <Route path="/dashboard/marketing/email-campaigns" element={<EmailMarketingYNewslettersPage />} />
            <Route path="/dashboard/marketing/mensajeria" element={<SmswhatsappMarketingPage />} />
            <Route path="/dashboard/automatizacion/secuencias-email" element={<LifecycleEmailSequencesPage />} />
            <Route path="/dashboard/automations/messaging" element={<SmswhatsappAutomationPage />} />
            <Route path="/dashboard/experiencias/eventos" element={<EventosYRetosPage />} />
            <Route path="/dashboard/experiences/virtual-events" element={<WebinarsYVirtualEventsManagerPage />} />
            <Route path="/dashboard/feedback/surveys" element={<FeedbackLoopYEncuestasInteligentesPage />} />
            <Route path="/dashboard/marketing/ia-generator" element={<GeneradorCreativoConIaPage />} />
            <Route path="/dashboard/marketing/ia-estrategias" element={<GeneradorDeEstrategiasDeMarketingConIaPage />} />
            <Route path="/dashboard/contenido/generador-ia" element={<GeneradorDeIdeasDeContenidoConIaPage />} />
            <Route path="/dashboard/ia/personalization-engine" element={<PersonalizationEngineIaAvanzadaPage />} />
            <Route path="/dashboard/marketing/progressive-profiling" element={<ProgressiveProfilingPage />} />
            <Route path="/dashboard/monetizacion/ofertas" element={<PromocionesCuponesYPacksPage />} />
            <Route path="/dashboard/marketing/referrals" element={<ReferidosYAfiliadosPage />} />
            <Route path="/dashboard/marketing/retargeting" element={<RetargetingYPixelManagerPage />} />
            <Route path="/dashboard/reviews" element={<ReviewYTestimonialEnginePage />} />
            <Route path="/dashboard/audiencias" element={<SegmentacionDinamicaYAudienciasPage />} />
            <Route path="/client/preferences/communication" element={<SmsemailPreferenceCenterPage />} />
            <Route path="/dashboard/contenido-premium" element={<GestionDeContenidosPremiumPage />} />
            <Route path="/dashboard/contenido/ugc-hub" element={<HubDeContenidosYUgcPage />} />
            <Route path="/dashboard/marketing/lead-magnets" element={<LeadMagnetFactoryPage />} />
            <Route path="/dashboard/intelligence/playbooks" element={<LibreriaDeCampanasPlaybooksPage />} />
            <Route path="/dashboard/intelligence/trend-analyzer" element={<TrendAnalizerPage />} />
            <Route path="/analytics/acquisition" element={<AnaliticaDeAdquisicionPage />} />
            <Route path="/dashboard/marketing/campanas-promociones" element={<CampanasPromocionesPage />} />
            <Route path="/dashboard/marketing/landing-pages-simples" element={<LandingPagesSimplesPage />} />
            <Route path="/dashboard/marketing/resenas-testimonios" element={<GestionResenasTestimoniosPage />} />
            <Route path="/dashboard/marketing/retencion-riesgo" element={<CampanasRetencionRiesgoPage />} />
            <Route path="/dashboard/marketing/social-planner-simple" element={<RedesSocialesPlannerSimplePage />} />
            <Route path="/dashboard/analytics/captacion" element={<AnaliticaCaptacionPage />} />
            <Route path="/analytics/locations-summary" element={<ResumenPorSedePage />} />
            <Route path="/analiticas/comparativa-sedes" element={<ComparativaEntreSedesPage />} />
            <Route path="/multisede/transferencias" element={<TransferenciasEntreSedesPage />} />
            <Route path="/catalogo-y-precios-por-sede" element={<CatalogoYPreciosPorSedePage />} />
            <Route path="/operations/checklists" element={<ChecklistsOperativosAperturaCierreLimpiezaPage />} />
            <Route path="/operations/documents" element={<DocumentacionInternaYProtocolosPage />} />
            <Route path="/corporate/governance/templates" element={<NormativaYPlantillasGlobalesPage />} />
            <Route path="/operaciones" element={<OperacionesPage />} />
            <Route path="/operaciones/equipo-rrhh" element={<EquipoRRHHPage />} />
            <Route path="/finanzas/impuestos-y-exportacion" element={<ImpuestosExportContablePage />} />
            <Route path="/finanzas/informes-avanzados" element={<InformesFinancierosAvanzadosPage />} />
            <Route path="/finanzas/presupuestos" element={<PresupuestosForecastPage />} />
            <Route path="/crm/clientes/bajas" element={<ClientesPerdidosBajasPage />} />
            <Route path="/crm/clientes-en-riesgo" element={<ClientesEnRiesgoRetencionPage />} />
            <Route path="/crm/cliente-360/:clientId" element={<Cliente360Page />} />
            <Route path="/corporate/companies/:companyId/employees" element={<EmpleadosActivosPage />} />
            <Route path="/b2b/convenios" element={<EmpresasConveniosPage />} />
            <Route path="/b2b/empresas" element={<B2BEmpresasPage />} />
            <Route path="/b2b/empresas-corporativas" element={<PortalEmpresaPage />} />
            <Route path="/corporate/usage-results" element={<UsoResultadosProgramasCorporativosPage />} />
            <Route path="/corporate/billing" element={<FacturacionAEmpresasPage />} />
            <Route path="/settings/team" element={<EquipoRolesPage />} />
            <Route path="/settings/general-profile" element={<GeneralDelCentroMarcaPersonalPage />} />
            <Route path="/operaciones/proveedores/evaluaciones" element={<EvaluacionDeProveedoresPage />} />
            <Route path="/admin/operaciones/proveedores" element={<ProveedoresContratosPage />} />
            <Route path="/team/performance-reviews" element={<FeedbackInternoYEvaluacionesDeRendimientoPage />} />
            <Route path="/settings/data/importers" element={<ImportadoresMigracionesPage />} />
            <Route path="/settings/integrations" element={<IntegracionesYAutomatizacionPage />} />
            <Route path="/settings/developer" element={<WebhooksApiKeysPage />} />
            <Route path="/settings/financials" element={<MonedaImpuestosSeriesDeFacturaPage />} />
            <Route path="/equipo/nominas" element={<NominasVariablesPage />} />
            <Route path="/team/incentives" element={<ObjetivosComisionesPage />} />
            <Route path="/team/time-tracking" element={<ParteHorariaFichajesPage />} />
            <Route path="/configuracion/roles-y-permisos" element={<RolesPermisosPage />} />
            <Route path="/multisede" element={<MultisedeFranquiciasPage />} />
            <Route path="/configuracion/centro" element={<ConfiguracionCentroPage />} />
          </Route>
        </Route>
        <Route path="*" element={<Navigate to="/resumen-general" replace />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;

function AppLayout() {
  const [activeView, setActiveView] = useState<string | undefined>(undefined);
  return (
    <Layout activeView={activeView} onViewChange={setActiveView}>
      <Outlet />
    </Layout>
  );
}
