import { useState, useEffect, useCallback } from 'react';
import { LocationSummary, Location, DateRange, SortKey, SortDirection } from '../types';
import { getLocationSummary, getLocations, exportLocationSummary, ExportRequest } from '../api/locationAnalyticsApi';

interface UseLocationAnalyticsReturn {
  data: LocationSummary[];
  locations: Location[];
  loading: boolean;
  error: string | null;
  dateRange: DateRange;
  sortColumn: SortKey | null;
  sortDirection: SortDirection;
  loadData: (dateRange: DateRange) => Promise<void>;
  loadLocations: () => Promise<void>;
  handleSort: (column: SortKey) => void;
  exportData: (format: 'csv' | 'pdf', columns?: string[]) => Promise<void>;
  clearError: () => void;
}

export const useLocationAnalytics = (initialDateRange: DateRange): UseLocationAnalyticsReturn => {
  const [data, setData] = useState<LocationSummary[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState<DateRange>(initialDateRange);
  const [sortColumn, setSortColumn] = useState<SortKey | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  const loadData = useCallback(async (range: DateRange) => {
    setLoading(true);
    setError(null);
    try {
      const summary = await getLocationSummary(range.startDate, range.endDate);
      setData(summary);
      setDateRange(range);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar los datos');
    } finally {
      setLoading(false);
    }
  }, []);

  const loadLocations = useCallback(async () => {
    try {
      const locs = await getLocations();
      setLocations(locs);
    } catch (err) {
      console.error('Error al cargar sedes:', err);
    }
  }, []);

  const handleSort = useCallback((column: SortKey) => {
    setSortColumn((prevColumn) => {
      if (prevColumn === column) {
        setSortDirection((prevDirection) => prevDirection === 'asc' ? 'desc' : 'asc');
        return prevColumn;
      } else {
        setSortDirection('asc');
        return column;
      }
    });
  }, []);

  const exportData = useCallback(async (format: 'csv' | 'pdf', columns?: string[]) => {
    setLoading(true);
    setError(null);
    try {
      const exportRequest: ExportRequest = {
        format,
        dateRange: {
          startDate: dateRange.startDate.toISOString(),
          endDate: dateRange.endDate.toISOString(),
        },
        columns,
      };
      
      const blob = await exportLocationSummary(exportRequest);
      
      // Crear enlace de descarga
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `resumen-por-sede-${new Date().toISOString().split('T')[0]}.${format}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al exportar los datos');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [dateRange]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Cargar datos iniciales
  useEffect(() => {
    loadData(initialDateRange);
    loadLocations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Aplicar ordenamiento
  const sortedData = sortColumn
    ? [...data].sort((a, b) => {
        const aValue = a[sortColumn];
        const bValue = b[sortColumn];
        
        if (aValue === undefined || aValue === null) return 1;
        if (bValue === undefined || bValue === null) return -1;
        
        if (typeof aValue === 'number' && typeof bValue === 'number') {
          return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
        }
        
        const aStr = String(aValue);
        const bStr = String(bValue);
        return sortDirection === 'asc'
          ? aStr.localeCompare(bStr)
          : bStr.localeCompare(aStr);
      })
    : data;

  return {
    data: sortedData,
    locations,
    loading,
    error,
    dateRange,
    sortColumn,
    sortDirection,
    loadData,
    loadLocations,
    handleSort,
    exportData,
    clearError,
  };
};

