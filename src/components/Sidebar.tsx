import { LayoutDashboard, LogOut, Award, Building2, ChevronLeft, ChevronRight, ChevronDown, TrendingUp, CalendarDays, ShieldAlert, Dumbbell, Banknote, Megaphone, Package, PackageOpen, ShoppingBag, AlertTriangle, Clock, UtensilsCrossed, FileEdit, MessageSquare, Trophy, Receipt, Wallet, Users, BarChart, Warehouse, UserPlus, Users as UsersList, ShoppingCart, ListFilter, Wrench, Ticket, Target, DollarSign, PieChart, Kanban, ClipboardList, UserCircle, ClipboardCheck, Calendar, CheckSquare, Apple, Shield, BookOpen, ChefHat, Boxes, RotateCcw, CalendarCheck, RefreshCw, Bell, Store, UserCheck, LineChart, Clipboard, UserMinus, AlertCircle, BarChart3, FileText, Globe, Briefcase, Handshake, UserCog, Star, FileCheck, ClipboardPen, Settings, FileBarChart, Database, FileSpreadsheet, Plug, Coins, Scroll, FileSpreadsheet as Payroll, Award as IncentiveIcon, Clock as TimeTrackingIcon, FileStack, ShieldCheck, Building, FileSignature, Shield as ShieldIcon, Tag, ArrowRightLeft, TrendingDown, Key, ShoppingBasket, FlaskConical, Search, Scissors, Sparkles, Mail, Image, Inbox, Gift, Brain, Layers, Filter, Video, Zap, Radio, ThumbsUp, DollarSign as DollarIcon, Palette, BarChart2, Network, Sparkles as SparklesIcon, TestTube, Workflow, HeartHandshake } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { useState } from 'react';

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
  activeView?: string;
  onViewChange?: (view: string) => void;
}

interface NavItem {
  id: string;
  label: string;
  icon: any;
  path: string;
  entrenadorOnly?: boolean;
  gimnasioOnly?: boolean;
}

interface NavSection {
  id: string;
  title: string;
  icon: any;
  items: NavItem[];
  entrenadorOnly?: boolean;
  gimnasioOnly?: boolean;
}

export function Sidebar({ isCollapsed, onToggle, onViewChange }: SidebarProps) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['dashboard', 'crm', 'marketing']));

  if (location.pathname.includes('/dietas-asignadas/editor')) {
    return null;
  }

  const role = user?.role ?? 'gimnasio';
  const isEntrenador = role === 'entrenador';
  const isCreador = role === 'creador';
  const isPersonalRole = isEntrenador || isCreador;
  const isGimnasio = role === 'gimnasio';

  // Determinar el path actual
  const getCurrentPath = () => {
    const path = location.pathname;
    if (path.includes('resumen-general')) return 'resumen-general';
    if (path.includes('tareas-alertas')) return 'tareas-alertas';
    if (path.includes('objetivos-rendimiento')) return 'objetivos-rendimiento';
    if (path.includes('overview-marketing')) return 'overview-marketing';
  if (path.includes('funnels-adquisicion')) return 'funnels-adquisicion';
    if (path.includes('leads')) return 'leads';
    if (path.includes('gestión-de-clientes') || path.includes('clientes')) return 'gestión-de-clientes';
    if (path.includes('portal-del-cliente-autoservicio')) return 'portal-del-cliente-autoservicio';
    if (path.includes('pipeline-de-venta-kanban')) return 'pipeline-de-venta-kanban';
    if (path.includes('transformacion-leads')) return 'transformacion-leads';
    if (path.includes('clientes-360')) return 'clientes-360';
    if (path.includes('ventas-leads')) return 'ventas-leads';
    if (path.includes('encuestas-satisfaccin-npscsat')) return 'encuestas-satisfaccin-npscsat';
    if (path.includes('campanas-outreach')) return 'campanas-outreach';
    if (path.includes('campanas-automatizacion')) return 'campanas-automatizacion';
    if (path.includes('listas-inteligentes-segmentos-guardados')) return 'listas-inteligentes-segmentos-guardados';
    if (path.includes('suite-de-entreno') || path.includes('programas-de-entreno') || path.includes('editor-de-entreno') || path.includes('plantillas-de-entrenamiento') || path.includes('biblioteca-de-ejercicios')) return 'suite-de-entreno';
    if (path.includes('check-ins-de-entreno')) return 'check-ins-de-entreno';
    if (path.includes('adherencia')) return 'adherencia';
    if (path.includes('suite-de-nutricion') || path.includes('dietas-asignadas') || path.includes('editor-de-dieta-meal-planner') || path.includes('plantillas-de-dieta') || path.includes('recetario-comidas-guardadas')) return 'suite-de-nutricion';
    if (path.includes('check-ins-nutricionales')) return 'check-ins-nutricionales';
    if (path.includes('agenda-reservas')) return 'agenda-reservas';
    if (path.includes('agenda')) return 'agenda';
    if (path.includes('reservas-online')) return 'reservas-online';
    if (path.includes('lista-de-espera-ausencias')) return 'lista-de-espera-ausencias';
    if (path.includes('disponibilidad-turnos-staff')) return 'disponibilidad-turnos-staff';
    if (path.includes('recursos-salas-material')) return 'recursos-salas-material';
    if (path.includes('eventos-retos') || path.includes('eventos-retos-especiales') || path.includes('dashboard/experiencias/eventos') || path.includes('dashboard/experiences/virtual-events') || path.includes('webinars-virtual-events')) return 'eventos-retos';
    if (path.includes('panel-financiero-overview')) return 'panel-financiero-overview';
    if (path.includes('facturacin-cobros')) return 'facturacin-cobros';
    if (path.includes('pagos-pendientes-morosidad')) return 'pagos-pendientes-morosidad';
    if (path.includes('suscripciones-cuotas-recurrentes')) return 'suscripciones-cuotas-recurrentes';
    if (path.includes('gastos-proveedores')) return 'gastos-proveedores';
    if (path.includes('caja-bancos')) return 'caja-bancos';
    if (path.includes('presupuestos-forecast')) return 'presupuestos-forecast';
    if (path.includes('impuestos-y-exportacion')) return 'impuestos-y-exportacion';
    if (path.includes('informes-financieros-avanzados')) return 'informes-financieros-avanzados';
    if (path.includes('catalogo-planes')) return 'catalogo-planes';
    if (path.includes('membresias-planes')) return 'membresias-planes';
    if (path.includes('membresias-activas')) return 'membresias-activas';
    if (path.includes('renovaciones-bajas')) return 'renovaciones-bajas';
    if (path.includes('portal-del-cliente-autoservicio')) return 'portal-del-cliente-autoservicio';
    if (path.includes('catalogo-productos')) return 'catalogo-productos';
    if (path.includes('inventario-stock')) return 'inventario-stock';
    if (path.includes('pedidos-tickets')) return 'pedidos-tickets';
    if (path.includes('recepciones-de-material')) return 'recepciones-de-material';
    if (path.includes('promociones-cupones')) return 'promociones-cupones';
    if (path.includes('tienda-online-checkout-online')) return 'tienda-online-checkout-online';
    if (path.includes('informe-de-ventas-retail')) return 'informe-de-ventas-retail';
    if (path.includes('turnos-horarios-del-staff')) return 'turnos-horarios-del-staff';
    if (path.includes('control-de-acceso-aforo')) return 'control-de-acceso-aforo';
    if (path.includes('mantenimiento-incidencias')) return 'mantenimiento-incidencias';
    if (path === '/operaciones') return 'operaciones-hub';
    if (path.startsWith('/operaciones/equipo-rrhh')) return 'operaciones-equipo-rrhh';
    if (
      path.includes('turnos-horarios-del-staff') ||
      path.includes('control-de-acceso-aforo') ||
      path.includes('mantenimiento-incidencias') ||
      path.includes('operations/checklists') ||
      path.includes('operations/documents')
    ) {
      return 'operaciones-hub';
    }
    if (
      path.includes('settings/team') ||
      path.includes('team/time-tracking') ||
      path.includes('equipo/nominas') ||
      path.includes('team/incentives') ||
      path.includes('team/performance-reviews')
    ) {
      return 'operaciones-equipo-rrhh';
    }
    if (path.includes('operations/checklists')) return 'operations-checklists';
    if (path.includes('recursos-salas-material')) return 'recursos-salas-material';
    if (path.includes('documentacion-interna-y-protocolos')) return 'documentacion-interna-y-protocolos';
    if (path.includes('ordenes-de-compra')) return 'ordenes-de-compra';
    if (path.includes('recepciones-de-material')) return 'recepciones-de-material';
    if (path.includes('proveedores-contratos')) return 'proveedores-contratos';
    if (path.includes('evaluacion-de-proveedores')) return 'evaluacion-de-proveedores';
    if (path.includes('historico-costes')) return 'historico-costes';
    if (path.includes('equipo-roles')) return 'equipo-roles';
    if (path.includes('objetivos-comisiones')) return 'objetivos-comisiones';
    if (path.includes('parte-horaria-fichajes')) return 'parte-horaria-fichajes';
    if (path.includes('nominas-variables')) return 'nominas-variables';
    if (path.includes('feedback-interno-y-evaluaciones-de-rendimiento')) return 'feedback-interno-y-evaluaciones-de-rendimiento';
    if (path.includes('afiliados-y-referidos') || path.includes('marketing/afiliados')) return 'afiliados-y-referidos';
    if (path.includes('embudos-ofertas-landing-pages') || path.includes('marketing/landing-pages')) return 'embudos-ofertas-landing-pages';
    if (path.includes('dashboard/marketing/funnels') || path.includes('constructor-de-funnels')) return 'constructor-de-funnels-y-landing-pages';
    if (path.includes('dashboard/content/social-studio') || path.includes('content-social-studio')) return 'content-social-studio';
    if (path.includes('dashboard/content/clipper') || path.includes('content-clipper')) return 'content-clipper';
    if (path.includes('dashboard/content/video-studio') || path.includes('video-studio')) return 'video-studio';
    if (path.includes('dashboard/marketing/influencers') || path.includes('influencer-content-syndication')) return 'creatorinfluencer-content-syndication';
    if (path.includes('dashboard/monetizacion/precios-dinamicos') || path.includes('dynamic-pricing')) return 'dynamic-pricing-ofertas-inteligentes';
    if (path.includes('dashboard/monetizacion/loyalty') || path.includes('loyalty-program-manager')) return 'loyalty-program-manager';
    if (path.includes('dashboard/monetizacion/referidos') || path.includes('marketing-de-referidos')) return 'marketing-de-referidos';
    if (path.includes('dashboard/partnerships') || path.includes('partnerships-influencers')) return 'partnerships-influencers';
    if (path.includes('dashboard/email/compliance') || path.includes('email-deliverability')) return 'email-deliverability-compliance-hub';
    if (path.includes('dashboard/marketing/email-campaigns') || path.includes('email-marketing-newsletters')) return 'email-marketing-newsletters';
    if (path.includes('dashboard/marketing/mensajeria') || path.includes('sms-whatsapp-marketing')) return 'sms-whatsapp-marketing';
    if (path.includes('dashboard/feedback/surveys') || path.includes('feedback-encuestas')) return 'feedback-encuestas';
    if (path.includes('dashboard/marketing/ia-generator') || path.includes('generador-creativo-ia')) return 'generador-creativo-ia';
    if (path.includes('dashboard/marketing/ia-estrategias') || path.includes('generador-estrategias-marketing')) return 'generador-estrategias-marketing';
    if (path.includes('dashboard/contenido/generador-ia') || path.includes('generador-ideas-contenido')) return 'generador-ideas-contenido';
    if (path.includes('dashboard/ia/personalization-engine') || path.includes('personalization-engine-ia')) return 'personalization-engine-ia-avanzada';
    if (path.includes('dashboard/marketing/progressive-profiling') || path.includes('progressive-profiling')) return 'progressive-profiling';
    if (path.includes('dashboard/monetizacion/ofertas') || path.includes('promociones-cupones-packs')) return 'promociones-cupones-packs';
    if (path.includes('dashboard/marketing/referrals') || path.includes('referidos-afiliados')) return 'referidos-afiliados';
    if (path.includes('dashboard/marketing/retargeting') || path.includes('retargeting-pixel-manager')) return 'retargeting-pixel-manager';
    if (path.includes('dashboard/reviews') || path.includes('review-testimonial-engine')) return 'review-testimonial-engine';
    if (path.includes('dashboard/audiencias') || path.includes('segmentacion-dinamica-audiencias')) return 'segmentacion-dinamica-audiencias';
    if (path.includes('client/preferences/communication') || path.includes('smsemail-preference-center')) return 'smsemail-preference-center';
    if (path.includes('dashboard/contenido-premium') || path.includes('gestion-contenidos-premium')) return 'gestion-contenidos-premium';
    if (path.includes('dashboard/contenido/ugc-hub') || path.includes('hub-contenidos-ugc')) return 'hub-contenidos-ugc';
    if (path.includes('dashboard/marketing/lead-magnets') || path.includes('lead-magnet-factory')) return 'lead-magnet-factory';
    if (path.includes('dashboard/intelligence/playbooks') || path.includes('libreria-campanas-playbooks')) return 'libreria-campanas-playbooks';
    if (path.includes('dashboard/intelligence/trend-analyzer') || path.includes('trend-analizer')) return 'trend-analizer';
    if (path.includes('dashboard/automatizacion/secuencias-email') || path.includes('lifecycle-email-sequences')) return 'lifecycle-email-sequences';
    if (path.includes('dashboard/automations/messaging') || path.includes('sms-whatsapp-automation')) return 'sms-whatsapp-automation';
    if (path.includes('dashboard/analytics/inbox') || path.includes('lead-inbox-unificado-sla')) return 'lead-inbox-unificado-sla';
    if (path.includes('ab-testing') || path.includes('experimentacion')) return 'ab-testing-experimentacion';
    if (path.includes('abm') || path.includes('account-based')) return 'account-based-marketing';
    if (path.includes('comunidad-fidelizacion')) return 'comunidad-fidelizacion';
    if (path.includes('comunidad') || path.includes('community')) return 'community-engagement';
    if (path.includes('market-intelligence') || path.includes('competitive-analysis')) return 'competitive-analysis-market-intelligence';
    if (path.includes('dashboard/marketing/anuncios') || path.includes('gestor-de-anuncios')) return 'gestor-de-anuncios';
    if (path.includes('dashboard/marketing/social-planner') || path.includes('planner-redes-sociales')) return 'planner-redes-sociales';
    if (path.includes('analitica-de-adquisicion')) return 'analitica-de-adquisicion';
    if (path === '/b2b/empresas') return 'b2b-empresas';
    if (path.includes('resumen-por-sede')) return 'resumen-por-sede';
    if (path.includes('comparativa-entre-sedes')) return 'comparativa-entre-sedes';
    if (path.includes('catalogo-y-precios-por-sede')) return 'catalogo-y-precios-por-sede';
    if (path.includes('transferencias-entre-sedes')) return 'transferencias-entre-sedes';
    if (path.includes('normativa-y-plantillas-globales')) return 'normativa-y-plantillas-globales';
    if (path.includes('integraciones-y-automatizacion') || path.includes('settings/integrations')) return 'integraciones-y-automatizacion';
    if (path.includes('webhooks-api-keys')) return 'webhooks-api-keys';
    if (path.includes('importadores-migraciones')) return 'importadores-migraciones';
    if (path.includes('general-del-centro-marca-personal') || path.includes('settings/general-profile')) return 'general-del-centro-marca-personal';
    if (path.includes('servicios-tarifas') || path.includes('settings/services')) return 'servicios-tarifas';
    if (path.includes('politicas-terminos') || path.includes('settings/policies')) return 'politicas-terminos';
    if (path.includes('plantillas-de-mensajes-y-contratos') || path.includes('settings/templates')) return 'plantillas-de-mensajes-y-contratos';
    if (path.includes('roles-permisos')) return 'roles-permisos';
    if (path.includes('moneda-impuestos-series-de-factura') || path.includes('settings/financials')) return 'moneda-impuestos-series-de-factura';
    if (path === '/multisede') return 'multisede-hub';
    if (path.includes('resumen-por-sede') || path.includes('comparativa-entre-sedes') || path.includes('catalogo-y-precios-por-sede') || path.includes('transferencias-entre-sedes') || path.includes('normativa-y-plantillas-globales')) return 'multisede-hub';
    if (
      path === '/configuracion/centro' ||
      path.includes('settings/general-profile') ||
      path.includes('settings/services') ||
      path.includes('settings/policies') ||
      path.includes('settings/templates') ||
      path.includes('configuracion/roles-y-permisos') ||
      path.includes('settings/financials') ||
      path.includes('settings/integrations') ||
      path.includes('settings/developer') ||
      path.includes('settings/data/importers')
    ) {
      return 'configuracion-centro';
    }
    return 'dashboard';
  };

  const currentPath = getCurrentPath();

  const headerBgClass = isPersonalRole ? 'bg-blue-600' : 'bg-purple-600';
  const headerTitle = isEntrenador ? 'Panel Entrenador' : isCreador ? 'Panel Creador' : 'Panel Gimnasio';
  const HeaderIcon = isEntrenador ? Award : isCreador ? Sparkles : Building2;

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => {
      const next = new Set(prev);
      if (next.has(sectionId)) {
        next.delete(sectionId);
      } else {
        next.add(sectionId);
      }
      return next;
    });
  };

  const marketingLiteItems: NavItem[] = [
    { id: 'overview-marketing', label: 'Overview Marketing', icon: BarChart3, path: '/overview-marketing' },
    { id: 'funnels-adquisicion', label: 'Funnels & Adquisición', icon: Layers, path: '/dashboard/marketing/funnels-adquisicion' },
    { id: 'campanas-automatizacion', label: 'Campañas & Automatización', icon: Workflow, path: '/dashboard/marketing/campanas-automatizacion' },
    { id: 'content-social-studio', label: 'Content & Social Studio', icon: SparklesIcon, path: '/dashboard/content/social-studio' },
    { id: 'comunidad-fidelizacion', label: 'Comunidad & Fidelización', icon: HeartHandshake, path: '/comunidad-fidelizacion' },
    { id: 'inteligencia-ia-experimentacion', label: 'IA & Experimentación', icon: Brain, path: '/dashboard/intelligence/ia-experimentacion' },
  ];

const marketingGimnasioItems: NavItem[] = [
    { id: 'overview-marketing', label: 'Overview Marketing', icon: BarChart3, path: '/overview-marketing' },
    { id: 'funnels-adquisicion', label: 'Funnels & Adquisición', icon: Layers, path: '/dashboard/marketing/funnels-adquisicion' },
    { id: 'campanas-promociones', label: 'Campañas & Promociones', icon: Megaphone, path: '/dashboard/marketing/campanas-promociones' },
    { id: 'campanas-automatizacion', label: 'Campañas & Automatización', icon: Workflow, path: '/dashboard/marketing/campanas-automatizacion' },
    { id: 'landing-pages-simples', label: 'Landing Pages Simples', icon: Globe, path: '/dashboard/marketing/landing-pages-simples' },
    { id: 'comunidad-fidelizacion', label: 'Comunidad & Fidelización', icon: HeartHandshake, path: '/comunidad-fidelizacion' },
    { id: 'campanas-retencion-riesgo', label: 'Campañas Retención & Riesgo de Baja', icon: AlertCircle, path: '/dashboard/marketing/retencion-riesgo' },
    { id: 'planner-redes-sociales-simple', label: 'Redes Sociales (Planner simple)', icon: Calendar, path: '/dashboard/marketing/social-planner-simple' },
    { id: 'analitica-captacion', label: 'Analítica de Captación', icon: LineChart, path: '/dashboard/analytics/captacion' },
  { id: 'inteligencia-ia-experimentacion', label: 'IA & Experimentación', icon: SparklesIcon, path: '/dashboard/intelligence/ia-experimentacion' },
  ];

  const marketingFullItems: NavItem[] = [
    { id: 'overview-marketing', label: 'Overview Marketing', icon: BarChart3, path: '/overview-marketing' },
    { id: 'funnels-adquisicion', label: 'Funnels & Adquisición', icon: Layers, path: '/dashboard/marketing/funnels-adquisicion' },
    // Captura & Conversión
    { id: 'constructor-de-funnels-y-landing-pages', label: 'Constructor de Funnels & Landing Pages', icon: Globe, path: '/dashboard/marketing/funnels' },
    { id: 'lead-magnet-factory', label: 'Lead Magnet Factory', icon: FileText, path: '/dashboard/marketing/lead-magnets' },
    { id: 'progressive-profiling', label: 'Progressive Profiling', icon: Layers, path: '/dashboard/marketing/progressive-profiling' },
    { id: 'gestion-contenidos-premium', label: 'Gestión de Contenidos Premium', icon: Package, path: '/dashboard/contenido-premium' },
    // Segmentación & Automatización
    { id: 'segmentacion-dinamica-audiencias', label: 'Segmentación Dinámica & Audiencias', icon: Filter, path: '/dashboard/audiencias' },
    { id: 'campanas-automatizacion', label: 'Campañas & Automatización', icon: Workflow, path: '/dashboard/marketing/campanas-automatizacion' },
    { id: 'lifecycle-email-sequences', label: 'Lifecycle Email Sequences', icon: Mail, path: '/dashboard/automatizacion/secuencias-email' },
    // Email & SMS
    { id: 'email-marketing-newsletters', label: 'Email Marketing & Newsletters', icon: Mail, path: '/dashboard/marketing/email-campaigns' },
    { id: 'email-deliverability-compliance-hub', label: 'Email Deliverability & Compliance Hub', icon: ShieldCheck, path: '/dashboard/email/compliance' },
    { id: 'sms-whatsapp-marketing', label: 'SMS/WhatsApp Marketing', icon: MessageSquare, path: '/dashboard/marketing/mensajeria' },
    { id: 'sms-whatsapp-automation', label: 'SMS/WhatsApp Automation', icon: MessageSquare, path: '/dashboard/automations/messaging' },
    { id: 'smsemail-preference-center', label: 'SMS/Email Preference Center', icon: Settings, path: '/client/preferences/communication' },
    // Contenido & Redes Sociales
    { id: 'content-social-studio', label: 'Content & Social Studio', icon: SparklesIcon, path: '/dashboard/content/social-studio' },
    { id: 'planner-redes-sociales', label: 'Planner de Redes Sociales', icon: Calendar, path: '/dashboard/marketing/social-planner' },
    { id: 'generador-creativo-ia', label: 'Generador Creativo con IA', icon: Sparkles, path: '/dashboard/marketing/ia-generator' },
    { id: 'generador-estrategias-marketing', label: 'Generador de Estrategias de Marketing con IA', icon: Target, path: '/dashboard/marketing/ia-estrategias' },
    { id: 'generador-ideas-contenido', label: 'Generador de Ideas de Contenido con IA', icon: SparklesIcon, path: '/dashboard/contenido/generador-ia' },
    { id: 'content-clipper', label: 'Content Clipper', icon: Scissors, path: '/dashboard/content/clipper' },
    { id: 'creatorinfluencer-content-syndication', label: 'Creator/Influencer Content Syndication', icon: Users, path: '/dashboard/marketing/influencers' },
    { id: 'video-studio', label: 'Video Marketing & Automation', icon: Video, path: '/dashboard/content/video-studio' },
    { id: 'hub-contenidos-ugc', label: 'Hub de Contenidos & UGC', icon: Image, path: '/dashboard/contenido/ugc-hub' },
    // Confianza & Social Proof
    { id: 'comunidad-fidelizacion', label: 'Comunidad & Fidelización', icon: HeartHandshake, path: '/comunidad-fidelizacion' },
    { id: 'feedback-encuestas', label: 'Feedback Loop & Encuestas Inteligentes', icon: MessageSquare, path: '/dashboard/feedback/surveys' },
    // Publicidad & Retargeting
    { id: 'gestor-de-anuncios', label: 'Gestor de Anuncios', icon: Megaphone, path: '/dashboard/marketing/anuncios' },
    { id: 'retargeting-pixel-manager', label: 'Retargeting & Pixel Manager', icon: Target, path: '/dashboard/marketing/retargeting' },
    // Monetización & Ofertas
    { id: 'promociones-cupones-packs', label: 'Promociones, Cupones & Packs', icon: Tag, path: '/dashboard/monetizacion/ofertas' },
    { id: 'dynamic-pricing-ofertas-inteligentes', label: 'Dynamic Pricing & Ofertas Inteligentes', icon: Sparkles, path: '/dashboard/monetizacion/precios-dinamicos' },
    { id: 'loyalty-program-manager', label: 'Loyalty Program Manager', icon: Gift, path: '/dashboard/monetizacion/loyalty' },
    { id: 'referidos-afiliados', label: 'Referidos & Afiliados', icon: Users, path: '/dashboard/marketing/referrals' },
    { id: 'marketing-de-referidos', label: 'Referral Marketing', icon: UserCheck, path: '/dashboard/monetizacion/referidos' },
    // Experiencias & Eventos
    { id: 'webinars-virtual-events', label: 'Webinars & Virtual Events Manager', icon: Video, path: '/dashboard/experiences/virtual-events' },
    { id: 'eventos-retos', label: 'Eventos & Retos', icon: Trophy, path: '/dashboard/experiencias/eventos' },
    { id: 'community-engagement', label: 'Community & Engagement', icon: Users, path: '/comunidad' },
    // Análisis & Inteligencia
    { id: 'libreria-campanas-playbooks', label: 'Librería de Campañas (Playbooks)', icon: BookOpen, path: '/dashboard/intelligence/playbooks' },
  { id: 'inteligencia-ia-experimentacion', label: 'Inteligencia, IA & Experimentación', icon: Brain, path: '/dashboard/intelligence/ia-experimentacion' },
    { id: 'trend-analizer', label: 'Trend Analizer', icon: TrendingUp, path: '/dashboard/intelligence/trend-analyzer' },
    { id: 'analitica-de-adquisicion', label: 'Analítica de Adquisición', icon: LineChart, path: '/analytics/acquisition' },
    // Integraciones & Partnerships
    { id: 'partnerships-influencers', label: 'Partnerships & Influencers', icon: Handshake, path: '/dashboard/partnerships' },
    { id: 'account-based-marketing', label: 'Account-Based Marketing (ABM)', icon: Building2, path: '/abm' },
    // Personalización & IA
    { id: 'personalization-engine-ia-avanzada', label: 'Personalization Engine (IA avanzada)', icon: Brain, path: '/dashboard/ia/personalization-engine' },
    // Extras & Especializados
    { id: 'ab-testing-experimentacion', label: 'A/B Testing & Experimentación', icon: FlaskConical, path: '/marketing/ab-testing' },
    { id: 'competitive-analysis-market-intelligence', label: 'Competitive Analysis & Market Intelligence', icon: Search, path: '/market-intelligence' },
    // Marketing General
    { id: 'campanas-outreach', label: 'Campañas', icon: Megaphone, path: '/campanas-outreach', gimnasioOnly: true },
    { id: 'embudos-ofertas-landing-pages', label: 'Embudos & Landing Pages', icon: Globe, path: '/marketing/landing-pages' },
    { id: 'afiliados-y-referidos', label: 'Afiliados & Referidos', icon: UserCheck, path: '/marketing/afiliados-y-referidos' },
  ];

  const marketingItems = isEntrenador
    ? marketingLiteItems
    : isCreador
      ? marketingFullItems.map(item =>
          item.gimnasioOnly ? { ...item, gimnasioOnly: undefined } : item
        )
      : isGimnasio
        ? marketingGimnasioItems
        : marketingFullItems;

  const crmBaseItems: NavItem[] = [
    { id: 'transformacion-leads', label: 'Transformación de Leads', icon: ArrowRightLeft, path: '/transformacion-leads' },
    { id: 'ventas-leads', label: 'Ventas & Leads', icon: TrendingUp, path: '/ventas-leads', gimnasioOnly: true },
    { id: 'gestión-de-clientes', label: isPersonalRole ? 'Mis Clientes' : 'Clientes', icon: Users, path: '/gestión-de-clientes' },
    { id: 'encuestas-satisfaccin-npscsat', label: 'Encuestas & Satisfacción', icon: MessageSquare, path: '/encuestas-satisfaccin-npscsat', gimnasioOnly: true },
    { id: 'campanas-outreach', label: 'Campañas / Outreach', icon: Megaphone, path: '/campanas-outreach', gimnasioOnly: true },
    { id: 'listas-inteligentes-segmentos-guardados', label: 'Listas Inteligentes', icon: ListFilter, path: '/listas-inteligentes-segmentos-guardados', gimnasioOnly: true },
  ];

  const crmItems: NavItem[] = isGimnasio
    ? crmBaseItems.filter(item => item.id === 'ventas-leads')
    : crmBaseItems;

  const agendaBaseItems: NavItem[] = [
    { id: 'agenda', label: 'Agenda / Calendario', icon: CalendarDays, path: '/agenda' },
    { id: 'reservas-online', label: 'Reservas Online', icon: CalendarCheck, path: '/reservas-online' },
    { id: 'eventos-retos', label: 'Eventos & Retos', icon: Trophy, path: '/eventos-retos' },
    { id: 'lista-de-espera-ausencias', label: 'Lista de Espera & Ausencias', icon: UsersList, path: '/lista-de-espera-ausencias', gimnasioOnly: true },
    { id: 'disponibilidad-turnos-staff', label: 'Disponibilidad / Turnos', icon: Clock, path: '/disponibilidad-turnos-staff', gimnasioOnly: true },
  ];

  const agendaItems: NavItem[] = isGimnasio
    ? agendaBaseItems.filter(
        item =>
          item.id !== 'agenda' &&
          item.id !== 'reservas-online' &&
          item.id !== 'eventos-retos' &&
          item.id !== 'lista-de-espera-ausencias'
      )
    : agendaBaseItems;

  const membresiasBaseItems: NavItem[] = [
    { id: 'membresias-planes', label: 'Membresías & Planes', icon: Ticket, path: '/membresias-planes', gimnasioOnly: true },
    { id: 'catalogo-planes', label: isPersonalRole ? 'Bonos PT' : 'Catálogo de Planes', icon: Package, path: '/catalogo-planes' },
    { id: 'renovaciones-bajas', label: isPersonalRole ? 'Renovaciones' : 'Renovaciones & Bajas', icon: RotateCcw, path: '/renovaciones-bajas' },
  ];

  const membresiasItems: NavItem[] = isGimnasio
    ? membresiasBaseItems.filter(item => item.id === 'membresias-planes')
    : membresiasBaseItems;

  const finanzasItems: NavItem[] = isGimnasio
    ? [
        { id: 'panel-financiero-overview', label: 'Finanzas', icon: PieChart, path: '/panel-financiero-overview' },
        membresiasItems.find(item => item.id === 'membresias-planes')!,
      ].filter(Boolean) as NavItem[]
    : [
        { id: 'panel-financiero-overview', label: isPersonalRole ? 'Panel Financiero' : 'Panel Financiero / Overview', icon: PieChart, path: '/panel-financiero-overview' },
        { id: 'facturacin-cobros', label: 'Facturación & Cobros', icon: Receipt, path: '/facturacin-cobros' },
        { id: 'pagos-pendientes-morosidad', label: 'Pagos Pendientes / Morosidad', icon: DollarSign, path: '/pagos-pendientes-morosidad' },
        { id: 'suscripciones-cuotas-recurrentes', label: isPersonalRole ? 'Suscripciones PT' : 'Suscripciones & Cuotas', icon: RefreshCw, path: '/suscripciones-cuotas-recurrentes' },
        { id: 'gastos-proveedores', label: 'Gastos & Proveedores', icon: Wallet, path: '/gastos-proveedores', gimnasioOnly: true },
        { id: 'caja-bancos', label: 'Caja & Bancos', icon: Banknote, path: '/caja-bancos', gimnasioOnly: true },
        { id: 'presupuestos-forecast', label: 'Presupuestos & Forecast', icon: FileBarChart, path: '/finanzas/presupuestos', gimnasioOnly: true },
        { id: 'impuestos-y-exportacion', label: 'Impuestos & Export', icon: FileSpreadsheet, path: '/finanzas/impuestos-y-exportacion' },
        { id: 'informes-financieros-avanzados', label: 'Informes Avanzados', icon: FileBarChart, path: '/finanzas/informes-avanzados', gimnasioOnly: true },
        ...membresiasItems,
      ];

  const sections: NavSection[] = [
    {
      id: 'dashboard',
      title: 'Dashboard',
      icon: LayoutDashboard,
      items: [
        { id: 'resumen-general', label: 'Resumen General', icon: LayoutDashboard, path: '/resumen-general' },
        { id: 'tareas-alertas', label: 'Tareas & Alertas', icon: Bell, path: '/tareas-alertas' },
        { id: 'objetivos-rendimiento', label: 'Objetivos & Rendimiento', icon: Target, path: '/objetivos-rendimiento' },
      ],
    },
    {
      id: 'crm',
      title: 'CRM & Clientes',
      icon: Users,
      items: crmItems,
    },
    {
      id: 'entrenamiento',
      title: 'Entrenamiento',
      icon: Dumbbell,
      items: [
        { id: 'suite-de-entreno', label: 'Suite de Entreno', icon: FileStack, path: '/suite-de-entreno' },
        { id: 'check-ins-de-entreno', label: 'Check-ins de Entreno', icon: CheckSquare, path: '/check-ins-de-entreno', entrenadorOnly: true },
        { id: 'adherencia', label: 'Adherencia & Cumplimiento', icon: TrendingUp, path: '/adherencia' },
      ],
    },
    {
      id: 'nutricion',
      title: 'Nutrición',
      icon: UtensilsCrossed,
      items: [
        { id: 'suite-de-nutricion', label: 'Suite de Nutrición', icon: UtensilsCrossed, path: '/suite-de-nutricion' },
        { id: 'check-ins-nutricionales', label: 'Check-ins Nutricionales', icon: Apple, path: '/check-ins-nutricionales', entrenadorOnly: true },
      ],
    },
    {
      id: 'agenda',
      title: 'Agenda & Reservas',
      icon: CalendarDays,
      items: agendaItems,
    },
    {
      id: 'finanzas',
      title: 'Finanzas',
      icon: DollarSign,
      items: finanzasItems,
    },
    {
      id: 'ventas',
      title: 'Ventas / POS / Tienda',
      icon: Store,
      items: [
        { id: 'catalogo-productos', label: 'Catálogo de Productos', icon: ShoppingBag, path: '/catalogo-productos', gimnasioOnly: true },
        { id: 'inventario-stock', label: 'Inventario & Stock', icon: Warehouse, path: '/inventario-stock', gimnasioOnly: true },
        { id: 'pedidos-tickets', label: 'Pedidos & Tickets', icon: Receipt, path: '/pedidos-tickets', gimnasioOnly: true },
        { id: 'tienda-online-checkout-online', label: isPersonalRole ? 'Tienda de Servicios' : 'Tienda Online', icon: Store, path: '/tienda-online-checkout-online' },
        { id: 'informe-de-ventas-retail', label: 'Informe de Ventas Retail', icon: BarChart, path: '/informe-de-ventas-retail', gimnasioOnly: true },
      ],
    },
    {
      id: 'operaciones',
      title: 'Operaciones del Centro',
      icon: Wrench,
      gimnasioOnly: true,
      items: [
        { id: 'operaciones-hub', label: 'Operaciones', icon: Wrench, path: '/operaciones' },
        { id: 'operaciones-equipo-rrhh', label: 'Equipo & RRHH', icon: UserCog, path: '/operaciones/equipo-rrhh' },
      ],
    },
    {
      id: 'compras',
      title: 'Compras',
      icon: ShoppingBasket,
      gimnasioOnly: true,
      items: [
        { id: 'ordenes-de-compra', label: 'Órdenes de Compra', icon: ShoppingBasket, path: '/ordenes-de-compra' },
        { id: 'recepciones-de-material', label: 'Recepciones de Material', icon: PackageOpen, path: '/inventario/recepciones' },
        { id: 'proveedores-contratos', label: 'Proveedores & Contratos', icon: FileSignature, path: '/admin/operaciones/proveedores' },
        { id: 'evaluacion-de-proveedores', label: 'Evaluación Proveedores', icon: Star, path: '/operaciones/proveedores/evaluaciones' },
        { id: 'historico-costes', label: 'Histórico de Costes', icon: FileBarChart, path: '/finanzas/compras/historico-costes' },
      ],
    },
    {
      id: 'marketing',
      title: 'Marketing',
      icon: Megaphone,
      items: marketingItems,
    },
    {
      id: 'b2b',
      title: 'Programas Corporativos (B2B)',
      icon: Building,
      gimnasioOnly: true,
      items: [{ id: 'b2b-empresas', label: 'B2B / Empresas', icon: Building2, path: '/b2b/empresas' }],
    },
    {
      id: 'multisede',
      title: 'Multisede / Franquicias',
      icon: Building2,
      gimnasioOnly: true,
      items: [{ id: 'multisede-hub', label: 'Multisede & Franquicias', icon: Building2, path: '/multisede' }],
    },
    {
      id: 'integraciones',
      title: 'Integraciones & Automatización',
      icon: Plug,
      items: [
        { id: 'integraciones-y-automatizacion', label: 'Integraciones', icon: Plug, path: '/settings/integrations' },
        { id: 'webhooks-api-keys', label: 'Webhooks & API Keys', icon: Key, path: '/settings/developer', gimnasioOnly: true },
        { id: 'importadores-migraciones', label: isPersonalRole ? 'Importar Clientes' : 'Importadores / Migraciones', icon: Database, path: '/settings/data/importers' },
      ],
    },
    {
      id: 'configuracion',
      title: 'Configuración',
      icon: Settings,
      items: [{ id: 'configuracion-centro', label: 'Configuración del Centro', icon: Settings, path: '/configuracion/centro' }],
    },
  ];

  const filteredSections = sections.filter(section => {
    if (section.gimnasioOnly && isPersonalRole) return false;
    if (section.entrenadorOnly && !isPersonalRole) return false;
    return true;
  });

  const renderNavItem = (item: NavItem) => {
    if (item.gimnasioOnly && isPersonalRole) return null;
    if (item.entrenadorOnly && !isPersonalRole) return null;

    const isActive = currentPath === item.id;
    const Icon = item.icon;

    return (
      <li key={item.id}>
        <button
          onClick={() => {
            onViewChange?.(item.id);
            navigate(item.path);
          }}
          className={`w-full flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'} px-4 py-2.5 rounded-lg transition-all ${
            isActive
            ? isPersonalRole
                ? 'bg-blue-50 text-blue-700 border border-blue-200 shadow-sm'
                : 'bg-purple-50 text-purple-700 border border-purple-200 shadow-sm'
              : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
          } font-medium text-sm`}
          title={isCollapsed ? item.label : ''}
        >
          <Icon className="w-5 h-5 flex-shrink-0" />
          {!isCollapsed && <span className="truncate">{item.label}</span>}
        </button>
      </li>
    );
  };

  const renderSection = (section: NavSection) => {
    const isExpanded = expandedSections.has(section.id);
    const SectionIcon = section.icon;
    const hasItems = section.items.some(item => {
      if (item.gimnasioOnly && isPersonalRole) return false;
      if (item.entrenadorOnly && !isPersonalRole) return false;
      return true;
    });

    if (!hasItems) return null;

    return (
      <li key={section.id} className="mb-2">
        {!isCollapsed ? (
          <>
            <button
              onClick={() => toggleSection(section.id)}
              className={`w-full flex items-center justify-between px-4 py-2.5 rounded-lg transition-all ${
                isExpanded
                  ? isPersonalRole
                    ? 'bg-blue-50 text-blue-900'
                    : 'bg-purple-50 text-purple-900'
                  : 'text-gray-600 hover:bg-gray-50'
              } font-semibold text-xs uppercase tracking-wider mb-1`}
            >
              <div className="flex items-center gap-2">
                <SectionIcon className="w-4 h-4" />
                <span>{section.title}</span>
              </div>
              <ChevronDown className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-0' : '-rotate-90'}`} />
            </button>
            {isExpanded && (
              <ul className="space-y-1 ml-2 border-l-2 border-gray-200 pl-2">
                {section.items.map(renderNavItem)}
              </ul>
            )}
          </>
        ) : (
          <div className="px-2 py-1">
            <div
              className={`flex items-center justify-center p-2 rounded-lg ${
                isPersonalRole ? 'bg-blue-50' : 'bg-purple-50'
              }`}
            >
              <SectionIcon className={`w-4 h-4 ${isPersonalRole ? 'text-blue-600' : 'text-purple-600'}`} />
            </div>
          </div>
        )}
      </li>
    );
  };

  return (
    <div className={`${isCollapsed ? 'w-20' : 'w-64'} bg-white border-r border-gray-200 flex flex-col transition-all duration-300 shadow-sm`}>
      {/* Header */}
      <div className="p-6 border-b border-gray-200 bg-gradient-to-br from-white to-gray-50">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 ${headerBgClass} rounded-lg flex items-center justify-center flex-shrink-0 shadow-md`}>
            <HeaderIcon className="w-6 h-6 text-white" />
          </div>
          {!isCollapsed && (
            <div className="flex-1 min-w-0">
              <h2 className="text-sm font-bold text-gray-900 truncate">
                {headerTitle}
              </h2>
              <p className="text-xs text-gray-600 truncate">{user?.name}</p>
            </div>
          )}
        </div>
        <button
          onClick={onToggle}
          className={`mt-4 w-full flex items-center ${isCollapsed ? 'justify-center' : 'justify-end'} text-gray-500 hover:text-gray-700 transition p-1 rounded hover:bg-gray-100`}
        >
          {isCollapsed ? (
            <ChevronRight className="w-5 h-5" />
          ) : (
            <ChevronLeft className="w-5 h-5" />
          )}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 overflow-y-auto sidebar-scroll">
        <ul className="space-y-1">
          {filteredSections.map(renderSection)}
        </ul>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200 bg-gradient-to-t from-white to-gray-50">
        <button
          onClick={logout}
          className={`w-full flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'} px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition font-medium`}
          title={isCollapsed ? 'Cerrar Sesión' : ''}
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          {!isCollapsed && <span>Cerrar Sesión</span>}
        </button>
      </div>
    </div>
  );
}