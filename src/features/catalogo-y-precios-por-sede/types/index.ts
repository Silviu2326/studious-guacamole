export interface Branch {
  id: string;
  name: string;
  location: string;
}

export type CatalogItemType = 'membership' | 'class' | 'product' | 'service';
export type CatalogItemStatus = 'master' | 'override' | 'exclusive';

export interface CatalogItem {
  itemId: string;
  name: string;
  type: CatalogItemType;
  status: CatalogItemStatus;
  masterPrice: number;
  branchPrice: number;
  isActive: boolean;
  description?: string;
  masterItemId?: string; // Para items sobrescritos
}

export interface CatalogOverride {
  id: string;
  branchId: string;
  masterItemId: string;
  price?: number;
  isActive?: boolean;
}

export interface BranchCatalogData {
  branchId: string;
  branchName: string;
  items: CatalogItem[];
  stats: {
    totalItems: number;
    masterItems: number;
    overriddenItems: number;
    exclusiveItems: number;
    avgPriceDeviation: number;
    lastModified?: string;
  };
}
