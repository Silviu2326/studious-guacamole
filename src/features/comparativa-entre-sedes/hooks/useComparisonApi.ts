import { useState, useEffect, useMemo } from 'react';
import { ComparisonFilters, ComparisonResponse, Location } from '../types';
import { getLocationComparison, getLocations } from '../api';

interface UseComparisonApiReturn {
  comparisonData: ComparisonResponse | null;
  locations: Location[];
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

export const useComparisonApi = (filters: ComparisonFilters): UseComparisonApiReturn => {
  const [comparisonData, setComparisonData] = useState<ComparisonResponse | null>(null);
  const [locations, setLocations] = useState<Location[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Memorizar los valores de filtros para evitar re-renders innecesarios
  const locationIdsKey = useMemo(() => filters.locationIds.sort().join(','), [filters.locationIds.join(',')]);
  const startDateKey = useMemo(() => filters.dateRange.startDate.toISOString(), [filters.dateRange.startDate]);
  const endDateKey = useMemo(() => filters.dateRange.endDate.toISOString(), [filters.dateRange.endDate]);
  const kpisKey = useMemo(() => filters.kpis.sort().join(','), [filters.kpis.join(',')]);

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Solo hacer la comparación si hay sedes seleccionadas y KPIs seleccionados
      if (filters.locationIds.length > 0 && filters.kpis.length > 0) {
        const data = await getLocationComparison(filters);
        setComparisonData(data);
      } else {
        setComparisonData(null);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido al cargar los datos.';
      setError(errorMessage);
      setComparisonData(null);
    } finally {
      setIsLoading(false);
    }
  };

  // Cargar sedes al montar el componente
  useEffect(() => {
    const loadLocations = async () => {
      try {
        const locationsData = await getLocations();
        setLocations(locationsData);
      } catch (err) {
        console.error('Error cargando sedes:', err);
      }
    };

    if (locations.length === 0) {
      loadLocations();
    }
  }, []);

  // Efecto para cargar datos cuando cambian los filtros
  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locationIdsKey, startDateKey, endDateKey, kpisKey]);

  return {
    comparisonData,
    locations,
    isLoading,
    error,
    refetch: fetchData,
  };
};

