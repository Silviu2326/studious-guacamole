import { CostHistoryResponse, CostHistoryFilters } from '../types';

// Simulación de datos de historial de costes
const generateChartData = (from: Date, to: Date) => {
  const data = [];
  const startDate = new Date(from);
  let currentDate = new Date(startDate);
  
  while (currentDate <= to) {
    data.push({
      date: currentDate.toISOString().split('T')[0],
      averageCost: 20 + Math.random() * 10, // Entre 20 y 30
    });
    currentDate = new Date(currentDate.setMonth(currentDate.getMonth() + 1));
  }
  
  return data;
};

const generateTableData = () => {
  return [
    {
      productId: 'prod_123',
      productName: 'Proteína Whey 2kg',
      category: 'Suplementos',
      supplier: 'FitSupply',
      lastPrice: 55.99,
      avgPrice: 54.5,
      lowestPrice: 52.99,
      highestPrice: 58.00,
      volume: 120,
      priceVariation: 3.5,
    },
    {
      productId: 'prod_124',
      productName: 'Creatina Monohidrato 500g',
      category: 'Suplementos',
      supplier: 'NutriSport',
      lastPrice: 28.50,
      avgPrice: 27.80,
      lowestPrice: 25.00,
      highestPrice: 30.00,
      volume: 250,
      priceVariation: 2.1,
    },
    {
      productId: 'prod_125',
      productName: 'Mancuernas Hexagonales 20kg',
      category: 'Equipamiento de Cardio',
      supplier: 'FitSupply',
      lastPrice: 89.99,
      avgPrice: 87.50,
      lowestPrice: 85.00,
      highestPrice: 92.00,
      volume: 15,
      priceVariation: 5.2,
    },
    {
      productId: 'prod_126',
      productName: 'Bebida Isotónica Pack 12',
      category: 'Bebidas',
      supplier: 'BulkPro',
      lastPrice: 22.40,
      avgPrice: 21.50,
      lowestPrice: 20.00,
      highestPrice: 24.00,
      volume: 180,
      priceVariation: -1.8,
    },
    {
      productId: 'prod_127',
      productName: 'Producto Limpieza Multiusos 5L',
      category: 'Productos de Limpieza',
      supplier: 'GymCleaners Inc.',
      lastPrice: 35.75,
      avgPrice: 34.20,
      lowestPrice: 32.00,
      highestPrice: 38.00,
      volume: 90,
      priceVariation: 4.5,
    },
  ];
};

export const getCostHistory = async (filters: CostHistoryFilters): Promise<CostHistoryResponse> => {
  // Simular delay de API
  await new Promise(resolve => setTimeout(resolve, 800));
  
  const chartData = generateChartData(filters.from, filters.to);
  
  // Calcular KPIs
  const tableData = generateTableData();
  const totalSpend = tableData.reduce((sum, item) => sum + (item.avgPrice * (item.volume || 0)), 0);
  const averageItemCost = tableData.reduce((sum, item) => sum + item.avgPrice, 0) / tableData.length;
  
  // Simular variación de precio del período anterior
  const priceChangePercentage = 3.5;
  
  const kpis = {
    totalSpend,
    averageItemCost,
    priceChangePercentage,
  };
  
  return {
    kpis,
    chartData,
    tableData,
  };
};

