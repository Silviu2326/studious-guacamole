import { useSearchParams } from 'react-router-dom';
import { GlobalFilters } from '../types';

/**
 * Hook para leer filtros de sede y periodo desde la URL
 * Útil para otros módulos que quieren mantener la coherencia con objetivos-rendimiento
 * 
 * User Story 2: Mantener filtros al navegar entre módulos
 */
export const useFiltersFromUrl = (): {
  sede?: string;
  periodo?: 'semana' | 'mes' | 'trimestre';
  globalFilters: GlobalFilters;
} => {
  const [searchParams] = useSearchParams();
  
  const sede = searchParams.get('sede') || undefined;
  const periodoParam = searchParams.get('periodo');
  const periodo = periodoParam && ['semana', 'mes', 'trimestre'].includes(periodoParam)
    ? (periodoParam as 'semana' | 'mes' | 'trimestre')
    : undefined;
  
  const globalFilters: GlobalFilters = {
    ...(sede && { sede }),
  };
  
  return {
    sede,
    periodo,
    globalFilters,
  };
};

