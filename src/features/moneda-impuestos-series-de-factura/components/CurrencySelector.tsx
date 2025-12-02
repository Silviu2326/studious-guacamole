import React, { useState, useEffect } from 'react';
import { Button, Select, SelectOption, Card } from '../../../components/componentsreutilizables';
import { Currency } from '../api/types';
import { Coins } from 'lucide-react';

interface CurrencySelectorProps {
  currentCurrency: string;
  onSave: (newCurrency: string) => Promise<void>;
  currencyList: Currency[];
}

const CURRENCY_LIST: Currency[] = [
  { code: 'EUR', name: 'Euro (EUR)' },
  { code: 'USD', name: 'US Dollar (USD)' },
  { code: 'GBP', name: 'British Pound (GBP)' },
  { code: 'MXN', name: 'Mexican Peso (MXN)' },
  { code: 'ARS', name: 'Argentine Peso (ARS)' },
  { code: 'CLP', name: 'Chilean Peso (CLP)' },
  { code: 'COP', name: 'Colombian Peso (COP)' },
  { code: 'PEN', name: 'Peruvian Sol (PEN)' },
];

export const CurrencySelector: React.FC<CurrencySelectorProps> = ({
  currentCurrency,
  onSave,
  currencyList = CURRENCY_LIST,
}) => {
  const [selectedCurrency, setSelectedCurrency] = useState(currentCurrency);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setSelectedCurrency(currentCurrency);
  }, [currentCurrency]);

  const handleSave = async () => {
    if (selectedCurrency === currentCurrency) return;
    
    setIsSaving(true);
    try {
      await onSave(selectedCurrency);
    } catch (error) {
      console.error('Error al guardar moneda:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const options: SelectOption[] = currencyList.map(currency => ({
    value: currency.code,
    label: currency.name,
  }));

  const selectedCurrencyName = currencyList.find(c => c.code === selectedCurrency)?.name || selectedCurrency;

  return (
    <Card className="p-0 bg-white shadow-sm">
      <div className="p-6 space-y-4">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-blue-100 rounded-xl ring-1 ring-blue-200/70">
            <Coins size={24} className="text-blue-600" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900">
              Moneda
            </h3>
            <p className="text-gray-600">
              Selecciona la moneda principal para todas las transacciones
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Moneda Actual
            </label>
            <p className="text-gray-600">
              {selectedCurrencyName}
            </p>
          </div>

          <Select
            label="Cambiar Moneda"
            options={options}
            value={selectedCurrency}
            onChange={(e) => setSelectedCurrency(e.target.value)}
            placeholder="Selecciona una moneda"
          />

          <div className="flex justify-end">
            <Button
              variant="primary"
              onClick={handleSave}
              disabled={isSaving || selectedCurrency === currentCurrency}
              loading={isSaving}
            >
              Guardar Cambios
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};

