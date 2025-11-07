import React from 'react';
import { CostHistoryDashboard } from '../components';
import { ds } from '../../adherencia/ui/ds';
import { FileBarChart } from 'lucide-react';

/**
 * Página principal del Histórico de Costes de Compra
 * 
 * Herramienta analítica para gestionar el histórico de compras de productos y servicios.
 * Permite:
 * - Visualizar la evolución de costes a lo largo del tiempo
 * - Filtrar por proveedores, categorías y rangos de fechas
 * - Analizar KPIs de gasto total, coste promedio y variaciones de precio
 * - Exportar datos a CSV
 */
const HistoricoDeCostesDeCompraPage: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center">
            <FileBarChart className="w-6 h-6 text-white" />
          </div>
          <h1 className={`${ds.typography.displayLarge} ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
            Histórico de Costes de Compra
          </h1>
        </div>
        <p className={`${ds.typography.bodyLarge} ${ds.color.textSecondary} ${ds.color.textSecondaryDark} max-w-2xl mx-auto`}>
          Analiza la evolución de tus costes de compra y toma decisiones informadas para optimizar tus gastos
        </p>
      </div>

      {/* Dashboard principal */}
      <CostHistoryDashboard />
    </div>
  );
};

export default HistoricoDeCostesDeCompraPage;

