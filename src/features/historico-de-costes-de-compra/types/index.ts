// Tipos para el módulo Histórico de Costes de Compra

export interface CostHistoryFilters {
  from: Date;
  to: Date;
  supplierIds?: string[];
  categoryIds?: string[];
  productId?: string;
}

export interface CostHistoryKPI {
  totalSpend: number;
  averageItemCost: number;
  priceChangePercentage: number;
}

export interface CostHistoryChartData {
  date: string;
  averageCost: number;
}

export interface CostHistoryTableData {
  productId: string;
  productName: string;
  category: string;
  supplier: string;
  lastPrice: number;
  avgPrice: number;
  lowestPrice: number;
  highestPrice?: number;
  volume?: number;
  priceVariation?: number;
}

export interface CostHistoryResponse {
  kpis: CostHistoryKPI;
  chartData: CostHistoryChartData[];
  tableData: CostHistoryTableData[];
}

export interface Supplier {
  id: string;
  name: string;
}

export interface ProductCategory {
  id: string;
  name: string;
}

