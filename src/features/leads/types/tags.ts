// Tag types for leads

export interface LeadTag {
  id: string;
  name: string;
  category: TagCategory;
  color: TagColor;
  icon?: string;
}

export type TagCategory = 'objetivo' | 'servicio' | 'estado' | 'personalizado';

export type TagColor = 
  | 'blue' 
  | 'green' 
  | 'purple' 
  | 'pink' 
  | 'yellow' 
  | 'red' 
  | 'orange' 
  | 'teal'
  | 'indigo'
  | 'gray';

export const PREDEFINED_TAGS: LeadTag[] = [
  // Objetivos
  { id: 'perdida-peso', name: 'Pérdida de peso', category: 'objetivo', color: 'red' },
  { id: 'ganar-musculo', name: 'Ganar músculo', category: 'objetivo', color: 'purple' },
  { id: 'tonificar', name: 'Tonificar', category: 'objetivo', color: 'pink' },
  { id: 'nutricion', name: 'Nutrición', category: 'objetivo', color: 'green' },
  { id: 'rendimiento', name: 'Rendimiento deportivo', category: 'objetivo', color: 'blue' },
  { id: 'salud-general', name: 'Salud general', category: 'objetivo', color: 'teal' },
  { id: 'recuperacion', name: 'Recuperación', category: 'objetivo', color: 'orange' },
  
  // Servicios de interés
  { id: 'entreno-1-1', name: 'Entreno 1:1', category: 'servicio', color: 'indigo' },
  { id: 'plan-online', name: 'Plan online', category: 'servicio', color: 'blue' },
  { id: 'nutricion-online', name: 'Nutrición online', category: 'servicio', color: 'green' },
  { id: 'combo', name: 'Combo entreno + nutrición', category: 'servicio', color: 'purple' },
  { id: 'clase-grupal', name: 'Clase grupal', category: 'servicio', color: 'pink' },
];

export const TAG_COLORS: Record<TagColor, { bg: string; text: string; border: string }> = {
  blue: { bg: 'bg-blue-100', text: 'text-blue-800', border: 'border-blue-300' },
  green: { bg: 'bg-green-100', text: 'text-green-800', border: 'border-green-300' },
  purple: { bg: 'bg-purple-100', text: 'text-purple-800', border: 'border-purple-300' },
  pink: { bg: 'bg-pink-100', text: 'text-pink-800', border: 'border-pink-300' },
  yellow: { bg: 'bg-yellow-100', text: 'text-yellow-800', border: 'border-yellow-300' },
  red: { bg: 'bg-red-100', text: 'text-red-800', border: 'border-red-300' },
  orange: { bg: 'bg-orange-100', text: 'text-orange-800', border: 'border-orange-300' },
  teal: { bg: 'bg-teal-100', text: 'text-teal-800', border: 'border-teal-300' },
  indigo: { bg: 'bg-indigo-100', text: 'text-indigo-800', border: 'border-indigo-300' },
  gray: { bg: 'bg-gray-100', text: 'text-gray-800', border: 'border-gray-300' },
};

