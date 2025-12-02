import { ProductCategory } from '../types';

// Simulación de datos de categorías
const categoriesMock: ProductCategory[] = [
  { id: 'cat_01', name: 'Equipamiento de Cardio' },
  { id: 'cat_02', name: 'Suplementos' },
  { id: 'cat_03', name: 'Productos de Limpieza' },
  { id: 'cat_04', name: 'Bebidas' },
  { id: 'cat_05', name: 'Merchandising' },
  { id: 'cat_06', name: 'Equipamiento de Fuerza' },
  { id: 'cat_07', name: 'Mantenimiento' },
];

export const getProductCategories = async (): Promise<ProductCategory[]> => {
  // Simular delay de API
  await new Promise(resolve => setTimeout(resolve, 300));
  return [...categoriesMock];
};

