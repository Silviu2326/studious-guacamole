import React, { useState, useEffect } from 'react';
import { Card, Button, Modal, Input, Select } from '../../../components/componentsreutilizables';
import {
  DollarSign,
  BarChart3,
  Download,
  Plus,
  RefreshCw,
  FileSpreadsheet
} from 'lucide-react';
import { BudgetGrid, ForecastChart, BudgetKPIs } from '../components';
import { budgetsAPI } from '../api';
import { BudgetDetail, BudgetGridData, ChartData, BudgetKPIs as BudgetKPIsType } from '../types';

/**
 * Página principal de Presupuestos & Forecast
 * 
 * Herramienta financiera estratégica para planificar, monitorear y proyectar 
 * la salud financiera del gimnasio. Permite la creación de presupuestos detallados,
 * comparativa en tiempo real entre lo planificado y lo ejecutado, y generación
 * de proyecciones (forecasts) inteligentes.
 */
export default function PresupuestosForecastPage() {
  const [activeTab, setActiveTab] = useState('budget');
  const [loading, setLoading] = useState(false);
  const [budgets, setBudgets] = useState<any[]>([]);
  const [selectedBudget, setSelectedBudget] = useState<BudgetDetail | null>(null);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newBudgetName, setNewBudgetName] = useState('');

  // Tabla de datos para BudgetGrid
  const [budgetGridData, setBudgetGridData] = useState<BudgetGridData[]>([]);
  const [kpis, setKpis] = useState<BudgetKPIsType>({
    totalDeviationPercentage: 0,
    incomeDeviation: 0,
    expenseDeviation: 0,
    netProfitProjected: 0,
    categoryCompliance: [],
    ebitdaProjected: 0
  });

  useEffect(() => {
    loadBudgets();
  }, [selectedYear]);

  useEffect(() => {
    if (budgets.length > 0) {
      loadBudgetDetails(budgets[0].budgetId);
    }
  }, [budgets]);

  const loadBudgets = async () => {
    try {
      setLoading(true);
      const data = await budgetsAPI.getAllBudgets(selectedYear);
      setBudgets(data);
      if (data.length > 0) {
        loadBudgetDetails(data[0].budgetId);
      }
    } catch (error) {
      console.error('Error cargando presupuestos:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadBudgetDetails = async (budgetId: string) => {
    try {
      setLoading(true);
      const details = await budgetsAPI.getBudgetDetails(budgetId);
      setSelectedBudget(details);
      transformBudgetDataToGrid(details);
      calculateKPIs(details);
    } catch (error) {
      console.error('Error cargando detalles:', error);
    } finally {
      setLoading(false);
    }
  };

  const transformBudgetDataToGrid = (budget: BudgetDetail) => {
    const gridData: BudgetGridData[] = [];
    
    // Convert income items
    budget.incomeItems.forEach(item => {
      gridData.push({
        category: item.category,
        type: 'income',
        itemId: item.itemId,
        jan: item.monthlyValues.jan,
        feb: item.monthlyValues.feb,
        mar: item.monthlyValues.mar,
        apr: item.monthlyValues.apr,
        may: item.monthlyValues.may,
        jun: item.monthlyValues.jun,
        jul: item.monthlyValues.jul,
        aug: item.monthlyValues.aug,
        sep: item.monthlyValues.sep,
        oct: item.monthlyValues.oct,
        nov: item.monthlyValues.nov,
        dec: item.monthlyValues.dec,
      });
    });

    // Convert expense items
    budget.expenseItems.forEach(item => {
      gridData.push({
        category: item.category,
        type: 'expense',
        itemId: item.itemId,
        jan: item.monthlyValues.jan,
        feb: item.monthlyValues.feb,
        mar: item.monthlyValues.mar,
        apr: item.monthlyValues.apr,
        may: item.monthlyValues.may,
        jun: item.monthlyValues.jun,
        jul: item.monthlyValues.jul,
        aug: item.monthlyValues.aug,
        sep: item.monthlyValues.sep,
        oct: item.monthlyValues.oct,
        nov: item.monthlyValues.nov,
        dec: item.monthlyValues.dec,
      });
    });

    setBudgetGridData(gridData);
  };

  const calculateKPIs = (budget: BudgetDetail) => {
    // Calculate KPIs based on budget data
    // This is simplified - in production would be more sophisticated
    const totalIncome = budget.incomeItems.reduce((sum, item) => {
      return sum + Object.values(item.monthlyValues).reduce((s, val) => s + (val.budgeted || 0), 0);
    }, 0);

    const totalExpenses = budget.expenseItems.reduce((sum, item) => {
      return sum + Object.values(item.monthlyValues).reduce((s, val) => s + (val.budgeted || 0), 0);
    }, 0);

    const actualIncome = budget.incomeItems.reduce((sum, item) => {
      return sum + Object.values(item.monthlyValues).reduce((s, val) => s + (val.actual || 0), 0);
    }, 0);

    const actualExpenses = budget.expenseItems.reduce((sum, item) => {
      return sum + Object.values(item.monthlyValues).reduce((s, val) => s + (val.actual || 0), 0);
    }, 0);

    const totalDeviation = ((actualIncome - totalIncome) / (totalIncome || 1)) * 100;
    const incomeDeviation = actualIncome - totalIncome;
    const expenseDeviation = actualExpenses - totalExpenses;
    const netProfitProjected = (actualIncome - actualExpenses);

    setKpis({
      totalDeviationPercentage: totalDeviation,
      incomeDeviation,
      expenseDeviation,
      netProfitProjected,
      categoryCompliance: [],
      ebitdaProjected: netProfitProjected
    });
  };

  const handleCellUpdate = async (itemId: string, month: string, newValue: number) => {
    if (!selectedBudget) return;

    try {
      await budgetsAPI.updateBudgetItem(selectedBudget.budgetId, itemId, {
        itemId,
        month,
        budgeted: newValue
      });
      loadBudgetDetails(selectedBudget.budgetId);
    } catch (error) {
      console.error('Error actualizando celda:', error);
    }
  };

  const handleCreateBudget = async () => {
    if (!newBudgetName) return;

    try {
      const newBudget = await budgetsAPI.createBudget({
        name: newBudgetName,
        year: selectedYear
      });
      setIsCreateModalOpen(false);
      setNewBudgetName('');
      loadBudgets();
    } catch (error) {
      console.error('Error creando presupuesto:', error);
    }
  };

  const handleExportCSV = async () => {
    if (!selectedBudget) return;

    try {
      const blob = await budgetsAPI.exportToCSV(selectedBudget.budgetId);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `presupuesto-${selectedBudget.year}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error exportando CSV:', error);
    }
  };

  // Prepare chart data
  const incomeChartData: ChartData = {
    labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Presupuestado',
        data: [10000, 10000, 10000, 10000, 10000, 10000],
        backgroundColor: '#10B981'
      },
      {
        label: 'Real',
        data: [10500, 9800, 10200, 0, 0, 0],
        backgroundColor: '#34D399'
      }
    ]
  };

  const expenseChartData: ChartData = {
    labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Presupuestado',
        data: [6000, 6000, 6000, 6000, 6000, 6000],
        backgroundColor: '#EF4444'
      },
      {
        label: 'Real',
        data: [6000, 6150, 5950, 0, 0, 0],
        backgroundColor: '#F87171'
      }
    ]
  };

  const tabs = [
    {
      id: 'budget',
      label: 'Presupuesto',
      icon: <FileSpreadsheet size={18} />
    },
    {
      id: 'income',
      label: 'Ingresos',
      icon: <DollarSign size={18} />
    },
    {
      id: 'expenses',
      label: 'Gastos',
      icon: <BarChart3 size={18} />
    },
    {
      id: 'forecast',
      label: 'Forecast',
      icon: <BarChart3 size={18} />
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Header */}
      <div className="border-b border-gray-200/60 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6">
          <div className="py-6">
            <div className="flex items-center">
              {/* Icono con contenedor */}
              <div className="p-2 bg-blue-100 rounded-xl mr-4 ring-1 ring-blue-200/70">
                <FileSpreadsheet size={24} className="text-blue-600" />
              </div>
              
              {/* Título y descripción */}
              <div>
                <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900">
                  Presupuestos & Forecast
                </h1>
                <p className="text-gray-600">
                  Planificación financiera estratégica para gimnasios. Controla ingresos, gastos y proyecciones.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contenedor Principal */}
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6 py-8">
        <div className="space-y-6">
          {/* Toolbar Superior */}
          <div className="flex items-center justify-end gap-3">
            <Button
              variant="primary"
              leftIcon={<Plus size={20} className="mr-2" />}
              onClick={() => setIsCreateModalOpen(true)}
            >
              Nuevo Presupuesto
            </Button>
            <Button
              variant="secondary"
              leftIcon={<Download size={20} className="mr-2" />}
              onClick={handleExportCSV}
              disabled={!selectedBudget}
            >
              Exportar CSV
            </Button>
            <Button
              variant="ghost"
              leftIcon={<RefreshCw size={20} className="mr-2" />}
              onClick={loadBudgets}
              disabled={loading}
            >
              Actualizar
            </Button>
          </div>

          {/* Selector de Año */}
          <Card className="bg-white shadow-sm">
            <div className="p-4">
              <Select
                label="Año"
                value={selectedYear.toString()}
                onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                options={[
                  { value: '2024', label: '2024' },
                  { value: '2023', label: '2023' },
                  { value: '2022', label: '2022' }
                ]}
              />
            </div>
          </Card>

          {/* KPIs */}
          <BudgetKPIs kpis={kpis} loading={loading} />

          {/* Main content con Tabs */}
          <Card className="p-0 bg-white shadow-sm">
            <div className="px-4 py-3">
              <div
                role="tablist"
                aria-label="Secciones"
                className="flex items-center gap-2 rounded-2xl bg-slate-100 p-1"
              >
                {tabs.map((tab) => {
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all ${
                        isActive
                          ? 'bg-white text-slate-900 shadow-sm ring-1 ring-slate-200'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-white/70'
                      }`}
                    >
                      <span className={isActive ? 'opacity-100' : 'opacity-70'}>
                        {tab.icon}
                      </span>
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
            
            <div className="px-4 pb-6 pt-0 mt-6">
              {activeTab === 'budget' && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Presupuesto Mensual
                  </h3>
                  <BudgetGrid
                    data={budgetGridData}
                    onCellUpdate={handleCellUpdate}
                    loading={loading}
                  />
                </div>
              )}

              {activeTab === 'income' && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Análisis de Ingresos
                  </h3>
                  <ForecastChart
                    chartData={incomeChartData}
                    type="income"
                    title="Ingresos Presupuestados vs Reales"
                  />
                </div>
              )}

              {activeTab === 'expenses' && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Análisis de Gastos
                  </h3>
                  <ForecastChart
                    chartData={expenseChartData}
                    type="expense"
                    title="Gastos Presupuestados vs Reales"
                  />
                </div>
              )}

              {activeTab === 'forecast' && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Proyección Anual
                  </h3>
                  <ForecastChart
                    chartData={incomeChartData}
                    type="profit"
                    title="Forecast de Beneficio Neto"
                  />
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>

      {/* Create budget modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Crear Nuevo Presupuesto"
        footer={
          <div className="flex gap-2">
            <Button variant="secondary" onClick={() => setIsCreateModalOpen(false)}>
              Cancelar
            </Button>
            <Button variant="primary" onClick={handleCreateBudget}>
              Crear
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          <Input
            label="Nombre del Presupuesto"
            placeholder="Ej: Presupuesto Anual 2025"
            value={newBudgetName}
            onChange={(e) => setNewBudgetName(e.target.value)}
          />
          <Select
            label="Año"
            value={selectedYear.toString()}
            onChange={(e) => setSelectedYear(parseInt(e.target.value))}
            options={[
              { value: '2024', label: '2024' },
              { value: '2025', label: '2025' },
              { value: '2026', label: '2026' }
            ]}
          />
        </div>
      </Modal>
    </div>
  );
}

