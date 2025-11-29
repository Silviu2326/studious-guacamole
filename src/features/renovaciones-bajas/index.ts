/**
 * Punto de entrada del módulo Renovaciones y Bajas
 * 
 * Este archivo actúa como el punto de entrada centralizado del módulo para:
 * - El router de la aplicación (exportación de la página principal)
 * - Otros módulos que necesiten importar componentes o tipos (ej: Suscripciones y Cuotas Recurrentes, Panel Financiero)
 * 
 * Todas las exportaciones están organizadas por categoría para facilitar el mantenimiento.
 */

// Exportar página principal (para el router)
export { default as RenovacionesBajasPage } from './pages/renovaciones-bajasPage';

// Exportar componentes clave reutilizables
// Estos componentes están disponibles para uso en otros módulos o para composición
export * from './components';

// Exportar tipos (interfaces, tipos TypeScript)
export * from './types';

// Exportar funciones API (si es necesario para otros módulos)
export * from './api';
