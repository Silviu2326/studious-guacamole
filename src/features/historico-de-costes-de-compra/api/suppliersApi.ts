import { Supplier } from '../types';

// Simulación de datos de proveedores
const suppliersMock: Supplier[] = [
  { id: 'sup_abc', name: 'FitSupply' },
  { id: 'sup_def', name: 'GymCleaners Inc.' },
  { id: 'sup_ghi', name: 'NutriSport' },
  { id: 'sup_jkl', name: 'BulkPro' },
  { id: 'sup_mno', name: 'Equipamiento Pro' },
  { id: 'sup_pqr', name: 'Suplementos Direct' },
];

export const getSuppliers = async (): Promise<Supplier[]> => {
  // Simular delay de API
  await new Promise(resolve => setTimeout(resolve, 300));
  return [...suppliersMock];
};

