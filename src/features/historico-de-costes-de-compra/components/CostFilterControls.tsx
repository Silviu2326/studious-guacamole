import React from 'react';
import { Card } from '../../../components/componentsreutilizables';
import { ds } from '../../adherencia/ui/ds';
import { Supplier, ProductCategory } from '../types';
import { Calendar, Filter } from 'lucide-react';

interface CostFilterControlsProps {
  suppliers: Supplier[];
  categories: ProductCategory[];
  onFiltersChange: (filters: any) => void;
}

export const CostFilterControls: React.FC<CostFilterControlsProps> = ({
  suppliers,
  categories,
  onFiltersChange,
}) => {
  const [selectedSuppliers, setSelectedSuppliers] = React.useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = React.useState<string[]>([]);
  const [dateFrom, setDateFrom] = React.useState(
    new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );
  const [dateTo, setDateTo] = React.useState(new Date().toISOString().split('T')[0]);

  React.useEffect(() => {
    // Notificar cambios de filtros
    onFiltersChange({
      supplierIds: selectedSuppliers,
      categoryIds: selectedCategories,
      dateFrom,
      dateTo,
    });
  }, [selectedSuppliers, selectedCategories, dateFrom, dateTo, onFiltersChange]);

  const removeSupplier = (id: string) => {
    setSelectedSuppliers(selectedSuppliers.filter(supplierId => supplierId !== id));
  };

  const removeCategory = (id: string) => {
    setSelectedCategories(selectedCategories.filter(categoryId => categoryId !== id));
  };

  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-6">
        <Filter className="w-5 h-5 text-purple-600" />
        <h3 className={`${ds.typography.h3} ${ds.color.textPrimary} ${ds.color.textPrimaryDark} font-semibold`}>
          Filtros
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Rango de fechas */}
        <div>
          <label className={`block ${ds.typography.bodySmall} font-semibold ${ds.color.textPrimary} ${ds.color.textPrimaryDark} mb-2`}>
            <Calendar className="w-4 h-4 inline-block mr-1" />
            Desde
          </label>
          <input
            type="date"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
            className={ds.input}
          />
        </div>

        <div>
          <label className={`block ${ds.typography.bodySmall} font-semibold ${ds.color.textPrimary} ${ds.color.textPrimaryDark} mb-2`}>
            <Calendar className="w-4 h-4 inline-block mr-1" />
            Hasta
          </label>
          <input
            type="date"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
            className={ds.input}
          />
        </div>

        {/* Proveedores */}
        <div>
          <label className={`block ${ds.typography.bodySmall} font-semibold ${ds.color.textPrimary} ${ds.color.textPrimaryDark} mb-2`}>
            Proveedores
          </label>
          <select
            className={ds.select}
            multiple
            size={5}
            value={selectedSuppliers}
            onChange={(e) => {
              const newSelection = Array.from(e.target.selectedOptions, option => option.value);
              setSelectedSuppliers(newSelection);
            }}
          >
            {suppliers.map(s => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </div>

        {/* Categorías */}
        <div>
          <label className={`block ${ds.typography.bodySmall} font-semibold ${ds.color.textPrimary} ${ds.color.textPrimaryDark} mb-2`}>
            Categorías
          </label>
          <select
            className={ds.select}
            multiple
            size={5}
            value={selectedCategories}
            onChange={(e) => {
              const newSelection = Array.from(e.target.selectedOptions, option => option.value);
              setSelectedCategories(newSelection);
            }}
          >
            {categories.map(c => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Indicadores de filtros activos */}
      {(selectedSuppliers.length > 0 || selectedCategories.length > 0) && (
        <div className="mt-4 flex gap-2 flex-wrap">
          {selectedSuppliers.map(supplierId => {
            const supplier = suppliers.find(s => s.id === supplierId);
            return supplier ? (
              <span
                key={supplierId}
                className="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 rounded-full text-sm font-medium"
              >
                {supplier.name}
                <button
                  onClick={() => removeSupplier(supplierId)}
                  className="ml-1 hover:text-purple-900 dark:hover:text-purple-100"
                >
                  ×
                </button>
              </span>
            ) : null;
          })}
          {selectedCategories.map(categoryId => {
            const category = categories.find(c => c.id === categoryId);
            return category ? (
              <span
                key={categoryId}
                className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-full text-sm font-medium"
              >
                {category.name}
                <button
                  onClick={() => removeCategory(categoryId)}
                  className="ml-1 hover:text-blue-900 dark:hover:text-blue-100"
                >
                  ×
                </button>
              </span>
            ) : null;
          })}
        </div>
      )}
    </Card>
  );
};

