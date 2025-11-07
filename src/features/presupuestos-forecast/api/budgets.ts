import { BudgetSummary, BudgetDetail, CreateBudgetRequest, UpdateBudgetItemRequest } from '../types';

// Mock API for budgets management
// In production, this would connect to a real backend

const API_BASE_URL = '/api/finances/budgets';

class BudgetsAPI {
  /**
   * Obtiene una lista de todos los presupuestos disponibles
   */
  async getAllBudgets(year?: number): Promise<BudgetSummary[]> {
    try {
      const url = year ? `${API_BASE_URL}?year=${year}` : API_BASE_URL;
      
      // TODO: Replace with actual API call
      // const response = await fetch(url, {
      //   method: 'GET',
      //   headers: {
      //     'Authorization': `Bearer ${getAuthToken()}`,
      //     'Content-Type': 'application/json',
      //   },
      // });
      // 
      // if (!response.ok) {
      //   throw new Error('Error al obtener presupuestos');
      // }
      // 
      // return await response.json();

      // Mock data for development
      return [
        {
          budgetId: 'bgt_2024',
          name: 'Presupuesto Anual 2024',
          year: 2024,
          status: 'active'
        },
        {
          budgetId: 'bgt_2023',
          name: 'Presupuesto Anual 2023',
          year: 2023,
          status: 'archived'
        },
      ];
    } catch (error) {
      console.error('Error fetching budgets:', error);
      throw error;
    }
  }

  /**
   * Crea un nuevo presupuesto
   */
  async createBudget(data: CreateBudgetRequest): Promise<BudgetSummary> {
    try {
      // TODO: Replace with actual API call
      // const response = await fetch(API_BASE_URL, {
      //   method: 'POST',
      //   headers: {
      //     'Authorization': `Bearer ${getAuthToken()}`,
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify(data),
      // });
      // 
      // if (!response.ok) {
      //   throw new Error('Error al crear presupuesto');
      // }
      // 
      // return await response.json();

      // Mock data for development
      return {
        budgetId: `bgt_${Date.now()}`,
        name: data.name,
        year: data.year,
        status: 'draft'
      };
    } catch (error) {
      console.error('Error creating budget:', error);
      throw error;
    }
  }

  /**
   * Obtiene los detalles completos de un presupuesto
   */
  async getBudgetDetails(budgetId: string): Promise<BudgetDetail> {
    try {
      // TODO: Replace with actual API call
      // const response = await fetch(`${API_BASE_URL}/${budgetId}/details`, {
      //   method: 'GET',
      //   headers: {
      //     'Authorization': `Bearer ${getAuthToken()}`,
      //     'Content-Type': 'application/json',
      //   },
      // });
      // 
      // if (!response.ok) {
      //   throw new Error('Error al obtener detalles del presupuesto');
      // }
      // 
      // return await response.json();

      // Mock data for development
      return {
        budgetId,
        name: 'Presupuesto Anual 2024',
        year: 2024,
        status: 'active',
        incomeItems: [
          {
            itemId: 'inc_001',
            category: 'Membresías',
            type: 'income',
            monthlyValues: {
              jan: { budgeted: 10000, actual: 10500 },
              feb: { budgeted: 10000, actual: 9800 },
              mar: { budgeted: 10000, actual: 10200 },
            }
          },
          {
            itemId: 'inc_002',
            category: 'Entrenamiento Personal',
            type: 'income',
            monthlyValues: {
              jan: { budgeted: 5000, actual: 4800 },
              feb: { budgeted: 5000, actual: 5100 },
              mar: { budgeted: 5000, actual: 5200 },
            }
          },
        ],
        expenseItems: [
          {
            itemId: 'exp_001',
            category: 'Salarios',
            type: 'expense',
            monthlyValues: {
              jan: { budgeted: 4000, actual: 4000 },
              feb: { budgeted: 4000, actual: 4150 },
              mar: { budgeted: 4000, actual: 3950 },
            }
          },
          {
            itemId: 'exp_002',
            category: 'Alquiler',
            type: 'expense',
            monthlyValues: {
              jan: { budgeted: 2000, actual: 2000 },
              feb: { budgeted: 2000, actual: 2000 },
              mar: { budgeted: 2000, actual: 2000 },
            }
          },
        ]
      };
    } catch (error) {
      console.error('Error fetching budget details:', error);
      throw error;
    }
  }

  /**
   * Actualiza un item específico del presupuesto
   */
  async updateBudgetItem(
    budgetId: string,
    itemId: string,
    data: UpdateBudgetItemRequest
  ): Promise<BudgetItemDetail> {
    try {
      // TODO: Replace with actual API call
      // const response = await fetch(`${API_BASE_URL}/${budgetId}/items/${itemId}`, {
      //   method: 'PUT',
      //   headers: {
      //     'Authorization': `Bearer ${getAuthToken()}`,
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify(data),
      // });
      // 
      // if (!response.ok) {
      //   throw new Error('Error al actualizar item del presupuesto');
      // }
      // 
      // return await response.json();

      // Mock data for development
      console.log('Updating budget item:', { budgetId, itemId, data });
      
      return {
        itemId,
        category: 'Test Category',
        type: 'income',
        monthlyValues: {
          [data.month]: {
            budgeted: data.budgeted,
            actual: 0
          }
        }
      };
    } catch (error) {
      console.error('Error updating budget item:', error);
      throw error;
    }
  }

  /**
   * Exporta los datos del presupuesto a CSV
   */
  async exportToCSV(budgetId: string): Promise<Blob> {
    try {
      // TODO: Replace with actual API call
      // const response = await fetch(`${API_BASE_URL}/${budgetId}/export/csv`, {
      //   method: 'GET',
      //   headers: {
      //     'Authorization': `Bearer ${getAuthToken()}`,
      //   },
      // });
      // 
      // if (!response.ok) {
      //   throw new Error('Error al exportar presupuesto');
      // }
      // 
      // return await response.blob();

      // Mock export for development
      const csvContent = 'Categoría,Enero,Febrero,Marzo\nMembresías,10000,10000,10000\n';
      return new Blob([csvContent], { type: 'text/csv' });
    } catch (error) {
      console.error('Error exporting budget:', error);
      throw error;
    }
  }
}

export const budgetsAPI = new BudgetsAPI();

