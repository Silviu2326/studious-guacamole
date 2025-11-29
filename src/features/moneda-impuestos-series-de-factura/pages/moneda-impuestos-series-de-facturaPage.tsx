import React, { useState, useEffect } from 'react';
import { Card, Button } from '../../../components/componentsreutilizables';
import { useAuth } from '../../../context/AuthContext';
import {
  CurrencySelector,
  TaxRateManager,
  InvoiceSeriesManager,
} from '../components';
import {
  financialApi,
  taxesApi,
  invoiceSeriesApi,
  FinancialSettings,
  TaxRate,
  InvoiceSeries,
  Location,
  CreateTaxRequest,
  UpdateTaxRequest,
  CreateInvoiceSeriesRequest,
  UpdateInvoiceSeriesRequest,
} from '../api';
import { Settings, Loader2, AlertCircle } from 'lucide-react';

/**
 * Página principal de Moneda / Impuestos / Series de Factura
 * 
 * Esta página permite configurar:
 * 1. Moneda: Define la divisa principal para todas las transacciones
 * 2. Impuestos: Gestiona tipos impositivos (IVA, GST, etc.)
 * 3. Series de Factura: Administra formatos y contadores para numeración de facturas
 * 
 * Adaptaciones por rol:
 * - Entrenadores: Configuración simple (una serie, un tipo de IVA)
 * - Gimnasios: Configuración avanzada (series por sede, múltiples impuestos)
 */
export default function MonedaImpuestosSeriesDeFacturaPage() {
  const { user } = useAuth();
  const isEntrenador = user?.role === 'entrenador';

  const [settings, setSettings] = useState<FinancialSettings | null>(null);
  const [locations, setLocations] = useState<Location[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Cargar configuración financiera al montar
  useEffect(() => {
    loadFinancialSettings();
    if (!isEntrenador) {
      loadLocations();
    }
  }, [isEntrenador]);

  const loadFinancialSettings = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await financialApi.getFinancialSettings();
      setSettings(data);
    } catch (error) {
      console.error('Error al cargar configuración financiera:', error);
      setError('Error al cargar la configuración financiera');
    } finally {
      setIsLoading(false);
    }
  };

  const loadLocations = async () => {
    try {
      const data = await invoiceSeriesApi.getLocations();
      setLocations(data);
    } catch (error) {
      console.error('Error al cargar ubicaciones:', error);
    }
  };

  const handleCurrencySave = async (newCurrency: string) => {
    try {
      await financialApi.updateCurrency({ currency: newCurrency });
      setSettings((prev) => prev ? { ...prev, currency: newCurrency } : null);
    } catch (error) {
      console.error('Error al guardar moneda:', error);
      throw error;
    }
  };

  const handleTaxAdd = async (data: CreateTaxRequest) => {
    try {
      const newTax = await taxesApi.createTax(data);
      setSettings((prev) =>
        prev
          ? {
              ...prev,
              taxes: [
                ...prev.taxes.filter((t) => !data.is_default || !t.is_default),
                newTax,
              ],
            }
          : null
      );
    } catch (error) {
      console.error('Error al añadir impuesto:', error);
      throw error;
    }
  };

  const handleTaxUpdate = async (id: string, data: UpdateTaxRequest) => {
    try {
      const updatedTax = await taxesApi.updateTax(id, data);
      setSettings((prev) =>
        prev
          ? {
              ...prev,
              taxes: prev.taxes.map((t) =>
                t.id === id
                  ? updatedTax
                  : data.is_default
                  ? { ...t, is_default: false }
                  : t
              ),
            }
          : null
      );
    } catch (error) {
      console.error('Error al actualizar impuesto:', error);
      throw error;
    }
  };

  const handleTaxDelete = async (id: string) => {
    try {
      await taxesApi.deleteTax(id);
      setSettings((prev) =>
        prev
          ? {
              ...prev,
              taxes: prev.taxes.filter((t) => t.id !== id),
            }
          : null
      );
    } catch (error) {
      console.error('Error al eliminar impuesto:', error);
      throw error;
    }
  };

  const handleSeriesAdd = async (data: CreateInvoiceSeriesRequest) => {
    try {
      const newSeries = await invoiceSeriesApi.createInvoiceSeries(data);
      setSettings((prev) =>
        prev
          ? {
              ...prev,
              invoice_series: [
                ...prev.invoice_series.filter(
                  (s) => !data.is_default || !s.is_default
                ),
                newSeries,
              ],
            }
          : null
      );
    } catch (error) {
      console.error('Error al añadir serie:', error);
      throw error;
    }
  };

  const handleSeriesUpdate = async (
    id: string,
    data: UpdateInvoiceSeriesRequest
  ) => {
    try {
      const updatedSeries = await invoiceSeriesApi.updateInvoiceSeries(
        id,
        data
      );
      setSettings((prev) =>
        prev
          ? {
              ...prev,
              invoice_series: prev.invoice_series.map((s) =>
                s.id === id
                  ? updatedSeries
                  : data.is_default
                  ? { ...s, is_default: false }
                  : s
              ),
            }
          : null
      );
    } catch (error) {
      console.error('Error al actualizar serie:', error);
      throw error;
    }
  };

  const handleSeriesDelete = async (id: string) => {
    try {
      await invoiceSeriesApi.deleteInvoiceSeries(id);
      setSettings((prev) =>
        prev
          ? {
              ...prev,
              invoice_series: prev.invoice_series.filter((s) => s.id !== id),
            }
          : null
      );
    } catch (error) {
      console.error('Error al eliminar serie:', error);
      throw error;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 flex items-center justify-center">
        <Card className="p-8 text-center bg-white shadow-sm">
          <Loader2 size={48} className="mx-auto text-blue-500 animate-spin mb-4" />
          <p className="text-gray-600">Cargando configuración financiera...</p>
        </Card>
      </div>
    );
  }

  if (error || !settings) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 flex items-center justify-center">
        <Card className="p-8 text-center">
          <AlertCircle size={48} className="mx-auto text-red-500 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Error al cargar</h3>
          <p className="text-gray-600 mb-4">{error || 'Error al cargar la configuración'}</p>
          <Button onClick={loadFinancialSettings}>Reintentar</Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Header */}
      <div className="border-b border-gray-200/60 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6">
          <div className="py-6">
            <div className="flex items-center">
              {/* Icono con contenedor */}
              <div className="p-2 bg-blue-100 rounded-xl mr-4 ring-1 ring-blue-200/70">
                <Settings size={24} className="text-blue-600" />
              </div>
              
              {/* Título y descripción */}
              <div>
                <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900">
                  Configuración Financiera
                </h1>
                <p className="text-gray-600">
                  {isEntrenador
                    ? 'Configura tu moneda, tipos de impuesto y serie de facturación para tus servicios.'
                    : 'Gestiona la configuración fiscal completa de tu gimnasio: moneda, impuestos y series de facturación por sede.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contenedor Principal */}
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6 py-8">
        <div className="space-y-6">
          {/* Sección de Moneda */}
          <CurrencySelector
            currentCurrency={settings.currency}
            onSave={handleCurrencySave}
            currencyList={[
              { code: 'EUR', name: 'Euro (EUR)' },
              { code: 'USD', name: 'US Dollar (USD)' },
              { code: 'GBP', name: 'British Pound (GBP)' },
              { code: 'MXN', name: 'Mexican Peso (MXN)' },
              { code: 'ARS', name: 'Argentine Peso (ARS)' },
              { code: 'CLP', name: 'Chilean Peso (CLP)' },
              { code: 'COP', name: 'Colombian Peso (COP)' },
              { code: 'PEN', name: 'Peruvian Sol (PEN)' },
            ]}
          />

          {/* Sección de Impuestos */}
          <TaxRateManager
            taxRates={settings.taxes}
            onAdd={handleTaxAdd}
            onUpdate={handleTaxUpdate}
            onDelete={handleTaxDelete}
          />

          {/* Sección de Series de Facturación */}
          <InvoiceSeriesManager
            invoiceSeries={settings.invoice_series}
            locations={locations}
            isGym={!isEntrenador}
            onAdd={handleSeriesAdd}
            onUpdate={handleSeriesUpdate}
            onDelete={handleSeriesDelete}
          />
        </div>
      </div>
    </div>
  );
}

