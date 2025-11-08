// API para resumen de mercado e inteligencia de mercado

export interface MarketSummary {
  location: string;
  averagePricePerSession: number;
  averagePricePerMonth: number;
  popularServices: string[];
  opportunityGaps: string[];
  nicheIndex?: number;
  totalCompetitors?: number;
}

export interface PriceComparisonData {
  name: string;
  price: number;
  type: 'user' | 'market' | 'competitor';
}

export interface MarketFilters {
  location: string;
  niche?: string;
}

// Funciones API simuladas (a implementar con backend real)
export const getMarketSummary = async (filters: MarketFilters): Promise<MarketSummary> => {
  // Simulación - en producción esto haría una llamada real
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Datos de ejemplo basados en el documento
  return {
    location: filters.location || 'Madrid, ES',
    averagePricePerSession: 45.5,
    averagePricePerMonth: 180,
    popularServices: [
      'Entrenamiento Funcional',
      'Asesoría Nutricional',
      'Pilates'
    ],
    opportunityGaps: [
      'Entrenamiento para mayores de 60',
      'Preparación para oposiciones'
    ],
    nicheIndex: 0.65,
    totalCompetitors: 15
  };
};

export const getPriceComparisonData = async (userId: string): Promise<PriceComparisonData[]> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // En producción: GET /api/intelligence/price-comparison?userId={userId}
  // Esto combinaría los precios del usuario con el promedio del mercado y competidores
  
  return [
    { name: 'Mi Precio', price: 50, type: 'user' },
    { name: 'Promedio Mercado', price: 45.5, type: 'market' },
    { name: 'FitLife Studio', price: 55, type: 'competitor' },
    { name: 'Joe\'s Training', price: 45, type: 'competitor' }
  ];
};











