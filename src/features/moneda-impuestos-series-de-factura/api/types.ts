// Tipos para el módulo de Moneda / Impuestos / Series de Factura

export interface Currency {
  code: string;
  name: string;
}

export interface TaxRate {
  id: string;
  name: string;
  rate: number;
  is_default: boolean;
}

export interface InvoiceSeries {
  id: string;
  name: string;
  format: string;
  next_number: number;
  is_default: boolean;
  location_id: string | null;
}

export interface Location {
  id: string;
  name: string;
}

export interface FinancialSettings {
  currency: string;
  taxes: TaxRate[];
  invoice_series: InvoiceSeries[];
}

export interface CreateTaxRequest {
  name: string;
  rate: number;
  is_default?: boolean;
}

export interface UpdateTaxRequest {
  name?: string;
  rate?: number;
  is_default?: boolean;
}

export interface CreateInvoiceSeriesRequest {
  name: string;
  format: string;
  next_number: number;
  is_default?: boolean;
  location_id?: string | null;
}

export interface UpdateInvoiceSeriesRequest {
  name?: string;
  format?: string;
  next_number?: number;
  is_default?: boolean;
  location_id?: string | null;
}

export interface UpdateCurrencyRequest {
  currency: string;
}

export type UserType = 'trainer' | 'gym';

