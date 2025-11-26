// Tipos para plantillas de servicios comunes

export interface PlantillaServicio {
  id: string;
  nombre: string;
  descripcion: string;
  precio: number;
  tipo: 'servicio' | 'producto';
  categoria?: string; // Ej: 'sesiones', 'paquetes', 'planes', 'adicionales'
  activa: boolean;
  orden: number; // Orden de visualización
  usoFrecuente: number; // Contador de uso
  createdAt: Date;
  updatedAt: Date;
  userId?: string; // ID del usuario (entrenador) que creó la plantilla
}

// Plantillas predefinidas comunes
export const PLANTILLAS_PREDEFINIDAS: Omit<PlantillaServicio, 'id' | 'createdAt' | 'updatedAt' | 'usoFrecuente'>[] = [
  {
    nombre: 'Sesión Individual',
    descripcion: 'Sesión de entrenamiento personal 1 a 1',
    precio: 50000,
    tipo: 'servicio',
    categoria: 'sesiones',
    activa: true,
    orden: 1,
    usoFrecuente: 0,
  },
  {
    nombre: 'Paquete 10 Sesiones',
    descripcion: 'Paquete de 10 sesiones de entrenamiento personal',
    precio: 450000,
    tipo: 'servicio',
    categoria: 'paquetes',
    activa: true,
    orden: 2,
    usoFrecuente: 0,
  },
  {
    nombre: 'Paquete 20 Sesiones',
    descripcion: 'Paquete de 20 sesiones de entrenamiento personal',
    precio: 850000,
    tipo: 'servicio',
    categoria: 'paquetes',
    activa: true,
    orden: 3,
    usoFrecuente: 0,
  },
  {
    nombre: 'Plan Mensual',
    descripcion: 'Plan mensual de entrenamiento personal (4 sesiones)',
    precio: 180000,
    tipo: 'servicio',
    categoria: 'planes',
    activa: true,
    orden: 4,
    usoFrecuente: 0,
  },
  {
    nombre: 'Evaluación Física',
    descripcion: 'Evaluación física completa',
    precio: 80000,
    tipo: 'servicio',
    categoria: 'adicionales',
    activa: true,
    orden: 5,
    usoFrecuente: 0,
  },
  {
    nombre: 'Plan Nutricional',
    descripcion: 'Plan nutricional personalizado',
    precio: 120000,
    tipo: 'servicio',
    categoria: 'adicionales',
    activa: true,
    orden: 6,
    usoFrecuente: 0,
  },
];


