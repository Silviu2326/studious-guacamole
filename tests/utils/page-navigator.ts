import { Page, expect } from '@playwright/test';
import { errorReporter } from '../../../src/test/error-reporter';

/**
 * Mapeo de todas las rutas de la sidebar para tests E2E
 */
export interface SidebarRoute {
  id: string;
  label: string;
  path: string;
  section: string;
  entrenadorOnly?: boolean;
  gimnasioOnly?: boolean;
  skipForRole?: 'entrenador' | 'gimnasio';
}

/**
 * Todas las rutas de la aplicación extraídas de la sidebar
 */
export const ALL_SIDEBAR_ROUTES: SidebarRoute[] = [
  // Dashboard
  { id: 'resumen-general', label: 'Resumen General', path: '/resumen-general', section: 'Dashboard' },
  { id: 'tareas-alertas', label: 'Tareas & Alertas', path: '/tareas-alertas', section: 'Dashboard' },
  { id: 'objetivos-rendimiento', label: 'Objetivos & Rendimiento', path: '/objetivos-rendimiento', section: 'Dashboard' },
  
  // CRM & Clientes
  { id: 'leads', label: 'Leads', path: '/leads', section: 'CRM & Clientes' },
  { id: 'pipeline-de-venta-kanban', label: 'Pipeline de Venta', path: '/pipeline-de-venta-kanban', section: 'CRM & Clientes' },
  { id: 'gestión-de-clientes', label: 'Clientes Activos', path: '/gestión-de-clientes', section: 'CRM & Clientes' },
  { id: 'clientes-en-riesgo-retencion', label: 'Clientes en Riesgo', path: '/crm/clientes-en-riesgo', section: 'CRM & Clientes' },
  { id: 'clientes-perdidos-bajas', label: 'Clientes Perdidos / Bajas', path: '/crm/clientes/bajas', section: 'CRM & Clientes' },
  { id: 'portal-del-cliente-autoservicio', label: 'Portal del Cliente', path: '/portal-del-cliente-autoservicio', section: 'CRM & Clientes' },
  { id: 'encuestas-satisfaccin-npscsat', label: 'Encuestas & Satisfacción', path: '/encuestas-satisfaccin-npscsat', section: 'CRM & Clientes', gimnasioOnly: true },
  { id: 'campanas-outreach', label: 'Campañas / Outreach', path: '/campanas-outreach', section: 'CRM & Clientes', gimnasioOnly: true },
  { id: 'listas-inteligentes-segmentos-guardados', label: 'Listas Inteligentes', path: '/listas-inteligentes-segmentos-guardados', section: 'CRM & Clientes', gimnasioOnly: true },
  
  // Entrenamiento
  { id: 'programas-de-entreno', label: 'Programas de Entreno', path: '/programas-de-entreno', section: 'Entrenamiento' },
  { id: 'editor-de-entreno', label: 'Editor de Entreno', path: '/editor-de-entreno', section: 'Entrenamiento' },
  { id: 'plantillas-de-entrenamiento', label: 'Plantillas de Entrenamiento', path: '/plantillas-de-entrenamiento', section: 'Entrenamiento' },
  { id: 'biblioteca-de-ejercicios', label: 'Biblioteca de Ejercicios', path: '/biblioteca-de-ejercicios', section: 'Entrenamiento' },
  { id: 'check-ins-de-entreno', label: 'Check-ins de Entreno', path: '/check-ins-de-entreno', section: 'Entrenamiento', entrenadorOnly: true },
  { id: 'adherencia', label: 'Adherencia & Cumplimiento', path: '/adherencia', section: 'Entrenamiento' },
  
  // Nutrición
  { id: 'dietas-asignadas', label: 'Dietas Asignadas', path: '/dietas-asignadas', section: 'Nutrición' },
  { id: 'editor-de-dieta-meal-planner', label: 'Editor de Dieta', path: '/editor-de-dieta-meal-planner', section: 'Nutrición' },
  { id: 'plantillas-de-dieta', label: 'Plantillas de Dieta', path: '/plantillas-de-dieta', section: 'Nutrición' },
  { id: 'recetario-comidas-guardadas', label: 'Recetario', path: '/recetario-comidas-guardadas', section: 'Nutrición' },
  { id: 'check-ins-nutricionales', label: 'Check-ins Nutricionales', path: '/check-ins-nutricionales', section: 'Nutrición', entrenadorOnly: true },
  { id: 'lista-de-la-compra-supermercado', label: 'Lista de la Compra', path: '/lista-de-la-compra-supermercado', section: 'Nutrición', entrenadorOnly: true },
  { id: 'restricciones', label: 'Restricciones Alimentarias', path: '/restricciones', section: 'Nutrición' },
  { id: 'alertas-restricciones-alimentarias', label: 'Alertas Restricciones', path: '/alertas-restricciones-alimentarias', section: 'Nutrición' },
  
  // Agenda & Reservas
  { id: 'agenda', label: 'Agenda / Calendario', path: '/agenda', section: 'Agenda & Reservas' },
  { id: 'reservas-online', label: 'Reservas Online', path: '/reservas-online', section: 'Agenda & Reservas' },
  { id: 'lista-de-espera-ausencias', label: 'Lista de Espera & Ausencias', path: '/lista-de-espera-ausencias', section: 'Agenda & Reservas', gimnasioOnly: true },
  { id: 'disponibilidad-turnos-staff', label: 'Disponibilidad / Turnos', path: '/disponibilidad-turnos-staff', section: 'Agenda & Reservas', gimnasioOnly: true },
  { id: 'recursos-salas-material', label: 'Recursos / Salas / Material', path: '/recursos-salas-material', section: 'Agenda & Reservas', gimnasioOnly: true },
  { id: 'eventos-retos-especiales', label: 'Eventos & Retos', path: '/eventos-retos-especiales', section: 'Agenda & Reservas' },
  
  // Finanzas
  { id: 'panel-financiero-overview', label: 'Panel Financiero', path: '/panel-financiero-overview', section: 'Finanzas' },
  { id: 'facturacin-cobros', label: 'Facturación & Cobros', path: '/facturacin-cobros', section: 'Finanzas' },
  { id: 'pagos-pendientes-morosidad', label: 'Pagos Pendientes / Morosidad', path: '/pagos-pendientes-morosidad', section: 'Finanzas' },
  { id: 'suscripciones-cuotas-recurrentes', label: 'Suscripciones & Cuotas', path: '/suscripciones-cuotas-recurrentes', section: 'Finanzas' },
  { id: 'gastos-proveedores', label: 'Gastos & Proveedores', path: '/gastos-proveedores', section: 'Finanzas', gimnasioOnly: true },
  { id: 'caja-bancos', label: 'Caja & Bancos', path: '/caja-bancos', section: 'Finanzas', gimnasioOnly: true },
  { id: 'presupuestos-forecast', label: 'Presupuestos & Forecast', path: '/finanzas/presupuestos', section: 'Finanzas', gimnasioOnly: true },
  { id: 'impuestos-y-exportacion', label: 'Impuestos & Export', path: '/finanzas/impuestos-y-exportacion', section: 'Finanzas' },
  { id: 'informes-financieros-avanzados', label: 'Informes Avanzados', path: '/finanzas/informes-avanzados', section: 'Finanzas', gimnasioOnly: true },
  
  // Membresías & Planes
  { id: 'catalogo-planes', label: 'Catálogo de Planes', path: '/catalogo-planes', section: 'Membresías & Planes' },
  { id: 'membresias-activas', label: 'Membresías Activas', path: '/membresias-activas', section: 'Membresías & Planes' },
  { id: 'renovaciones-bajas', label: 'Renovaciones & Bajas', path: '/renovaciones-bajas', section: 'Membresías & Planes' },
  
  // Ventas / POS / Tienda
  { id: 'catalogo-productos', label: 'Catálogo de Productos', path: '/catalogo-productos', section: 'Ventas / POS / Tienda', gimnasioOnly: true },
  { id: 'inventario-stock', label: 'Inventario & Stock', path: '/inventario-stock', section: 'Ventas / POS / Tienda', gimnasioOnly: true },
  { id: 'pedidos-tickets', label: 'Pedidos & Tickets', path: '/pedidos-tickets', section: 'Ventas / POS / Tienda', gimnasioOnly: true },
  { id: 'recepciones-de-material', label: 'Recepciones de Material', path: '/inventario/recepciones', section: 'Ventas / POS / Tienda', gimnasioOnly: true },
  { id: 'tienda-online-checkout-online', label: 'Tienda Online', path: '/tienda-online-checkout-online', section: 'Ventas / POS / Tienda' },
  { id: 'informe-de-ventas-retail', label: 'Informe de Ventas Retail', path: '/informe-de-ventas-retail', section: 'Ventas / POS / Tienda', gimnasioOnly: true },
  
  // Operaciones del Centro
  { id: 'turnos-horarios-del-staff', label: 'Turnos & Horarios', path: '/turnos-horarios-del-staff', section: 'Operaciones del Centro', gimnasioOnly: true },
  { id: 'control-de-acceso-aforo', label: 'Control de Acceso & Aforo', path: '/control-de-acceso-aforo', section: 'Operaciones del Centro', gimnasioOnly: true },
  { id: 'mantenimiento-incidencias', label: 'Mantenimiento & Incidencias', path: '/mantenimiento-incidencias', section: 'Operaciones del Centro', gimnasioOnly: true },
  { id: 'operations-checklists', label: 'Checklists Operativos', path: '/operations/checklists', section: 'Operaciones del Centro', gimnasioOnly: true },
  { id: 'documentacion-interna-y-protocolos', label: 'Documentación Interna', path: '/operations/documents', section: 'Operaciones del Centro', gimnasioOnly: true },
  
  // Compras
  { id: 'ordenes-de-compra', label: 'Órdenes de Compra', path: '/ordenes-de-compra', section: 'Compras', gimnasioOnly: true },
  { id: 'proveedores-contratos', label: 'Proveedores & Contratos', path: '/admin/operaciones/proveedores', section: 'Compras', gimnasioOnly: true },
  { id: 'evaluacion-de-proveedores', label: 'Evaluación Proveedores', path: '/operaciones/proveedores/evaluaciones', section: 'Compras', gimnasioOnly: true },
  { id: 'historico-costes', label: 'Histórico de Costes', path: '/finanzas/compras/historico-costes', section: 'Compras', gimnasioOnly: true },
  
  // Equipo / RRHH / Nóminas
  { id: 'equipo-roles', label: 'Equipo & Roles', path: '/settings/team', section: 'Equipo / RRHH / Nóminas', gimnasioOnly: true },
  { id: 'objetivos-comisiones', label: 'Objetivos & Comisiones', path: '/team/incentives', section: 'Equipo / RRHH / Nóminas', gimnasioOnly: true },
  { id: 'parte-horaria-fichajes', label: 'Parte Horaria / Fichajes', path: '/team/time-tracking', section: 'Equipo / RRHH / Nóminas', gimnasioOnly: true },
  { id: 'nominas-variables', label: 'Nóminas & Variables', path: '/equipo/nominas', section: 'Equipo / RRHH / Nóminas', gimnasioOnly: true },
  { id: 'feedback-interno-y-evaluaciones-de-rendimiento', label: 'Evaluaciones Rendimiento', path: '/team/performance-reviews', section: 'Equipo / RRHH / Nóminas', gimnasioOnly: true },
  
  // Marketing & Crecimiento
  { id: 'embudos-ofertas-landing-pages', label: 'Embudos & Landing Pages', path: '/marketing/landing-pages', section: 'Marketing & Crecimiento' },
  { id: 'afiliados-y-referidos', label: 'Afiliados & Referidos', path: '/marketing/afiliados-y-referidos', section: 'Marketing & Crecimiento' },
  { id: 'analitica-de-adquisicion', label: 'Analítica de Adquisición', path: '/analytics/acquisition', section: 'Marketing & Crecimiento' },
  
  // Programas Corporativos (B2B)
  { id: 'empresas-convenios', label: 'Empresas / Convenios', path: '/b2b/convenios', section: 'Programas Corporativos (B2B)', gimnasioOnly: true },
  { id: 'empleados-activos', label: 'Empleados Activos', path: '/corporate/companies/example-company-id/employees', section: 'Programas Corporativos (B2B)', gimnasioOnly: true },
  { id: 'uso-resultados-programas-corporativos', label: 'Uso & Resultados', path: '/corporate/usage-results', section: 'Programas Corporativos (B2B)', gimnasioOnly: true },
  { id: 'facturacion-a-empresas', label: 'Facturación a Empresas', path: '/corporate/billing', section: 'Programas Corporativos (B2B)', gimnasioOnly: true },
  { id: 'portal-empresa', label: 'Portal Empresa', path: '/b2b/empresas-corporativas', section: 'Programas Corporativos (B2B)', gimnasioOnly: true },
  
  // Multisede / Franquicias
  { id: 'resumen-por-sede', label: 'Resumen por Sede', path: '/analytics/locations-summary', section: 'Multisede / Franquicias', gimnasioOnly: true },
  { id: 'comparativa-entre-sedes', label: 'Comparativa Entre Sedes', path: '/analiticas/comparativa-sedes', section: 'Multisede / Franquicias', gimnasioOnly: true },
  { id: 'catalogo-y-precios-por-sede', label: 'Catálogo y Precios por Sede', path: '/catalogo-y-precios-por-sede', section: 'Multisede / Franquicias', gimnasioOnly: true },
  { id: 'transferencias-entre-sedes', label: 'Transferencias Entre Sedes', path: '/multisede/transferencias', section: 'Multisede / Franquicias', gimnasioOnly: true },
  { id: 'normativa-y-plantillas-globales', label: 'Normativas y Plantillas', path: '/corporate/governance/templates', section: 'Multisede / Franquicias', gimnasioOnly: true },
  
  // Integraciones & Automatización
  { id: 'integraciones-y-automatizacion', label: 'Integraciones', path: '/settings/integrations', section: 'Integraciones & Automatización' },
  { id: 'webhooks-api-keys', label: 'Webhooks & API Keys', path: '/settings/developer', section: 'Integraciones & Automatización', gimnasioOnly: true },
  { id: 'importadores-migraciones', label: 'Importadores / Migraciones', path: '/settings/data/importers', section: 'Integraciones & Automatización' },
  
  // Configuración
  { id: 'general-del-centro-marca-personal', label: 'General del Centro', path: '/settings/general-profile', section: 'Configuración' },
  { id: 'servicios-tarifas', label: 'Servicios & Tarifas', path: '/settings/services', section: 'Configuración' },
  { id: 'politicas-terminos', label: 'Políticas & Términos', path: '/settings/policies', section: 'Configuración', gimnasioOnly: true },
  { id: 'plantillas-de-mensajes-y-contratos', label: 'Plantillas Mensajes', path: '/settings/templates', section: 'Configuración' },
  { id: 'roles-permisos', label: 'Roles & Permisos', path: '/configuracion/roles-y-permisos', section: 'Configuración', gimnasioOnly: true },
  { id: 'moneda-impuestos-series-de-factura', label: 'Configuración Financiera', path: '/settings/financials', section: 'Configuración' },
];

/**
 * Obtiene rutas filtradas por rol de usuario
 */
export function getRoutesForRole(role: 'entrenador' | 'gimnasio'): SidebarRoute[] {
  return ALL_SIDEBAR_ROUTES.filter(route => {
    if (route.gimnasioOnly && role === 'entrenador') return false;
    if (route.entrenadorOnly && role === 'gimnasio') return false;
    return true;
  });
}

/**
 * Helper para navegar a una página y verificar que se carga correctamente
 */
export async function navigateAndVerifyPage(
  page: Page,
  route: SidebarRoute,
  options?: { timeout?: number }
): Promise<{
  success: boolean;
  errors: string[];
  warnings: string[];
}> {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Capturar errores de consola
  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      errors.push(`Console Error: ${msg.text()}`);
    } else if (msg.type() === 'warning') {
      warnings.push(`Console Warning: ${msg.text()}`);
    }
  });

  // Capturar errores de página
  page.on('pageerror', (error) => {
    errors.push(`Page Error: ${error.message}`);
  });

  try {
    // Navegar a la página
    await page.goto(route.path, { 
      waitUntil: 'networkidle',
      timeout: options?.timeout || 30000 
    });

    // Verificar que la página se cargó (no es página de error 404)
    const url = page.url();
    if (url.includes('404') || url.includes('error')) {
      errors.push(`La página ${route.path} parece ser una página de error`);
      return { success: false, errors, warnings };
    }

    // Verificar que hay contenido en la página (al menos algún elemento)
    const hasContent = await page.locator('body').count() > 0;
    if (!hasContent) {
      errors.push(`La página ${route.path} no tiene contenido`);
      return { success: false, errors, warnings };
    }

    // Esperar un poco para que cualquier carga asíncrona se complete
    await page.waitForTimeout(1000);

    return { success: true, errors, warnings };
  } catch (error) {
    errors.push(`Error navegando a ${route.path}: ${error instanceof Error ? error.message : String(error)}`);
    return { success: false, errors, warnings };
  }
}






















