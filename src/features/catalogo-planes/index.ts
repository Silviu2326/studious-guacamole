/**
 * Punto de entrada del módulo Catálogo de Planes
 * 
 * Este archivo actúa como el punto de entrada centralizado del módulo para:
 * - El router de la aplicación (exportación de la página principal)
 * - Otros módulos que necesiten importar componentes o tipos (ej: suscripciones/cuotas)
 * 
 * Todas las exportaciones están organizadas por categoría para facilitar el mantenimiento.
 */

// Exportar tipos
export * from './types';

// Exportar página principal (para el router)
export { CatalogoPage } from './pages/CatalogoPage';

// Exportar componentes reutilizables
export { CatalogoPlanes } from './components/CatalogoPlanes';
export { PlanCard } from './components/PlanCard';
export { PlanForm } from './components/PlanForm';
export { GestorBonos } from './components/GestorBonos';

// Exportar datos mock (para desarrollo y testing)
export * from './data/mockData';