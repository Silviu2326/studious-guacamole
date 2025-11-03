import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { Card, MetricCards, Button } from '../../../components/componentsreutilizables';
import { CompetitorCard } from './CompetitorCard';
import { AddCompetitorModal } from './AddCompetitorModal';
import { PriceComparisonChart } from './PriceComparisonChart';
import { 
  getCompetitors, 
  getCompetitorDetails, 
  deleteCompetitor,
  Competitor 
} from '../api/competitors';
import { 
  getMarketSummary, 
  getPriceComparisonData,
  MarketSummary 
} from '../api/marketSummary';
import { TrendingUp, Users, MapPin, DollarSign, Plus, Search, Lightbulb } from 'lucide-react';

interface MarketIntelligenceDashboardProps {
  userId: string;
}

/**
 * Componente container principal que orquesta la página de inteligencia de mercado
 */
export const MarketIntelligenceDashboard: React.FC<MarketIntelligenceDashboardProps> = ({ userId }) => {
  const { user } = useAuth();
  const [competitorsList, setCompetitorsList] = useState<Competitor[]>([]);
  const [marketSummary, setMarketSummary] = useState<MarketSummary | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [priceComparisonData, setPriceComparisonData] = useState<any[]>([]);

  useEffect(() => {
    loadDashboardData();
  }, [userId]);

  const loadDashboardData = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Cargar competidores
      const competitors = await getCompetitors();
      setCompetitorsList(competitors);

      // Cargar resumen de mercado (usando ubicación por defecto si está configurada)
      if (selectedLocation || true) { // Por ahora siempre carga, luego usar ubicación del usuario
        const location = selectedLocation || 'Madrid, ES'; // Por defecto
        const summary = await getMarketSummary({ location });
        setMarketSummary(summary);
        setSelectedLocation(location);
      }

      // Cargar datos de comparación de precios
      const priceData = await getPriceComparisonData(userId);
      setPriceComparisonData(priceData);
    } catch (err: any) {
      setError(err.message || 'Error al cargar los datos. Por favor, inténtalo de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteCompetitor = async (id: string) => {
    if (!window.confirm('¿Estás seguro de que quieres eliminar este competidor del monitoreo?')) {
      return;
    }

    try {
      await deleteCompetitor(id);
      setCompetitorsList(prev => prev.filter(c => c.id !== id));
    } catch (err: any) {
      alert('Error al eliminar el competidor: ' + err.message);
    }
  };

  const handleViewDetails = (id: string) => {
    // En una implementación completa, esto abriría un modal o navegaría a una página de detalles
    console.log('Ver detalles del competidor:', id);
  };

  const handleCompetitorAdded = () => {
    loadDashboardData();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando inteligencia de mercado...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="p-6">
        <div className="text-center text-red-600">
          <p className="font-semibold mb-2">Error</p>
          <p className="text-sm">{error}</p>
          <Button
            variant="primary"
            size="sm"
            onClick={loadDashboardData}
            className="mt-4"
          >
            Reintentar
          </Button>
        </div>
      </Card>
    );
  }

  const metrics = marketSummary ? [
    {
      id: 'avg-price',
      title: 'Precio Promedio/Sesión',
      value: `€${marketSummary.averagePricePerSession.toFixed(0)}`,
      subtitle: 'Mercado local',
      icon: <DollarSign className="w-5 h-5" />,
      color: 'primary' as const
    },
    {
      id: 'avg-monthly',
      title: 'Precio Promedio/Mes',
      value: `€${marketSummary.averagePricePerMonth}`,
      subtitle: 'Membresías',
      icon: <TrendingUp className="w-5 h-5" />,
      color: 'success' as const
    },
    {
      id: 'competitors',
      title: 'Competidores Monitoreados',
      value: competitorsList.length.toString(),
      subtitle: 'En seguimiento activo',
      icon: <Users className="w-5 h-5" />,
      color: 'info' as const
    },
    {
      id: 'opportunities',
      title: 'Oportunidades',
      value: marketSummary.opportunityGaps.length.toString(),
      subtitle: 'Nichos identificados',
      icon: <Lightbulb className="w-5 h-5" />,
      color: 'warning' as const
    }
  ] : [];

  return (
    <div className="space-y-6">
      {/* Métricas principales */}
      {metrics.length > 0 && (
        <MetricCards data={metrics} columns={4} />
      )}

      {/* Acciones rápidas */}
      <Card>
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Competidores Monitoreados</h2>
              <p className="text-sm text-gray-600 mt-1">
                Gestiona los competidores que estás analizando
              </p>
            </div>
            <Button
              variant="primary"
              onClick={() => setIsAddModalOpen(true)}
            >
              <Plus className="w-5 h-5 mr-2" />
              Añadir Competidor
            </Button>
          </div>

          {/* Lista de competidores */}
          {competitorsList.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
              <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 font-medium mb-2">No hay competidores monitoreados</p>
              <p className="text-sm text-gray-500 mb-4">
                Añade competidores para comenzar a analizar el mercado
              </p>
              <Button
                variant="primary"
                size="sm"
                onClick={() => setIsAddModalOpen(true)}
              >
                <Plus className="w-4 h-4 mr-2" />
                Añadir Primer Competidor
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {competitorsList.map(competitor => (
                <CompetitorCard
                  key={competitor.id}
                  competitor={competitor}
                  onViewDetails={handleViewDetails}
                  onDelete={handleDeleteCompetitor}
                />
              ))}
            </div>
          )}
        </div>
      </Card>

      {/* Gráfico de comparación de precios */}
      {priceComparisonData.length > 0 && (
        <PriceComparisonChart data={priceComparisonData} />
      )}

      {/* Resumen de mercado */}
      {marketSummary && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Servicios populares */}
          <Card>
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Servicios Más Populares
              </h3>
              <ul className="space-y-2">
                {marketSummary.popularServices.map((service, index) => (
                  <li key={index} className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
                    <span className="flex items-center justify-center w-6 h-6 bg-purple-100 text-purple-600 rounded-full text-xs font-semibold">
                      {index + 1}
                    </span>
                    <span className="text-gray-700">{service}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Card>

          {/* Oportunidades de nicho */}
          <Card>
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-yellow-500" />
                Oportunidades de Nicho
              </h3>
              <ul className="space-y-2">
                {marketSummary.opportunityGaps.map((opportunity, index) => (
                  <li key={index} className="flex items-start gap-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <span className="flex items-center justify-center w-6 h-6 bg-yellow-500 text-white rounded-full text-xs font-semibold flex-shrink-0 mt-0.5">
                      {index + 1}
                    </span>
                    <div>
                      <p className="text-gray-900 font-medium">{opportunity}</p>
                      <p className="text-xs text-gray-600 mt-1">
                        Baja competencia, alta demanda potencial
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </Card>
        </div>
      )}

      {/* Modal para añadir competidor */}
      <AddCompetitorModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onCompetitorAdded={handleCompetitorAdded}
      />
    </div>
  );
};


