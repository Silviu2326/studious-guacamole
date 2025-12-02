/**
 * Datos mock del catálogo de planes y bonos
 * 
 * IMPORTANTE: Estos datos se utilizan ÚNICAMENTE durante el desarrollo y testing del módulo.
 * En producción, estos datos serán sustituidos por llamadas a la API real.
 * 
 * Los datos mock están diseñados para:
 * - Probar diferentes estados y variantes de planes (activos, inactivos, archivados, borradores)
 * - Probar diferentes tipos de planes (suscripción, bono, paquete, pt, grupal)
 * - Probar diferentes periodicidades (mensual, trimestral, anual, puntual)
 * - Probar badges especiales (esPopular, esRecomendado, esNuevo)
 * - Probar diferentes configuraciones de bonos (sesiones, caducidades, restricciones)
 */

import { Plan, Bono } from '../types';

// ============================================================================
// PLANES MOCK
// ============================================================================

/**
 * planesMock - Array de planes de ejemplo para desarrollo y testing
 * 
 * Incluye ejemplos de:
 * - Plan Básico: Plan de suscripción básico
 * - Plan Premium: Plan de suscripción premium (marcado como esPopular)
 * - Plan VIP: Plan de suscripción VIP (marcado como esRecomendado y esNuevo)
 * - PT Intensivo: Plan de entrenamiento personal intensivo
 * - Grupal Empresas: Plan grupal para empresas
 * 
 * Variedad de precios, periodicidades y estados para cubrir todos los casos de uso.
 */
export const planesMock: Plan[] = [
  // Plan Básico - Suscripción mensual básica
  {
    id: 'plan-001',
    nombre: 'Básico',
    descripcion: 'Plan ideal para comenzar tu rutina de entrenamiento. Acceso a instalaciones básicas y clases grupales estándar.',
    tipo: 'suscripcion',
    periodicidad: 'mensual',
    precioBase: 35.00,
    moneda: 'EUR',
    caracteristicas: [
      {
        id: 'car-001',
        label: 'Acceso a sala de pesas',
        descripcionOpcional: 'Uso de todas las máquinas y equipos de fuerza',
        destacadoOpcional: true
      },
      {
        id: 'car-002',
        label: 'Acceso a zona cardio',
        descripcionOpcional: 'Cintas, bicicletas estáticas y elípticas'
      },
      {
        id: 'car-003',
        label: '2 clases grupales por semana',
        descripcionOpcional: 'Yoga, pilates, spinning'
      },
      {
        id: 'car-004',
        label: 'Vestuarios y taquillas',
        destacadoOpcional: false
      }
    ],
    beneficiosAdicionales: [
      'Asesoramiento nutricional básico',
      'App móvil incluida'
    ],
    esRecomendado: false,
    esPopular: false,
    esNuevo: false,
    estado: 'activo',
    ordenVisual: 1,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15')
  },

  // Plan Premium - Suscripción mensual premium (MÁS POPULAR)
  {
    id: 'plan-002',
    nombre: 'Premium',
    descripcion: 'El plan más popular entre nuestros usuarios. Acceso completo a todas las instalaciones, clases ilimitadas y beneficios exclusivos.',
    tipo: 'suscripcion',
    periodicidad: 'mensual',
    precioBase: 55.00,
    moneda: 'EUR',
    caracteristicas: [
      {
        id: 'car-005',
        label: 'Acceso completo 24/7',
        descripcionOpcional: 'Todas las instalaciones disponibles las 24 horas',
        destacadoOpcional: true
      },
      {
        id: 'car-006',
        label: 'Clases grupales ilimitadas',
        descripcionOpcional: 'Yoga, pilates, spinning, crossfit, zumba y más',
        destacadoOpcional: true
      },
      {
        id: 'car-007',
        label: 'Acceso a piscina y spa',
        descripcionOpcional: 'Piscina climatizada, jacuzzi y sauna'
      },
      {
        id: 'car-008',
        label: '1 sesión de PT al mes',
        descripcionOpcional: 'Entrenamiento personalizado incluido'
      },
      {
        id: 'car-009',
        label: 'Plan nutricional personalizado',
        destacadoOpcional: false
      }
    ],
    beneficiosAdicionales: [
      'App móvil premium',
      'Seguimiento de progreso avanzado',
      'Descuentos en suplementos',
      'Invitación a eventos exclusivos'
    ],
    esRecomendado: false,
    esPopular: true, // MARCADO COMO POPULAR
    esNuevo: false,
    estado: 'activo',
    ordenVisual: 2,
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-02-10')
  },

  // Plan VIP - Suscripción anual VIP (RECOMENDADO Y NUEVO)
  {
    id: 'plan-003',
    nombre: 'VIP',
    descripcion: 'La experiencia más exclusiva. Plan anual con todos los beneficios premium, entrenamiento personal ilimitado y servicios de lujo.',
    tipo: 'suscripcion',
    periodicidad: 'anual',
    precioBase: 950.00,
    moneda: 'EUR',
    caracteristicas: [
      {
        id: 'car-010',
        label: 'Entrenamiento personal ilimitado',
        descripcionOpcional: 'Sesiones de PT sin límite durante todo el año',
        destacadoOpcional: true
      },
      {
        id: 'car-011',
        label: 'Acceso VIP a todas las instalaciones',
        descripcionOpcional: 'Zona VIP exclusiva, lockers premium',
        destacadoOpcional: true
      },
      {
        id: 'car-012',
        label: 'Clases premium ilimitadas',
        descripcionOpcional: 'Todas las clases grupales sin restricciones'
      },
      {
        id: 'car-013',
        label: 'Spa y wellness completo',
        descripcionOpcional: 'Masajes, tratamientos faciales y corporales'
      },
      {
        id: 'car-014',
        label: 'Nutricionista personal',
        descripcionOpcional: 'Seguimiento nutricional mensual'
      },
      {
        id: 'car-015',
        label: 'Toallas y servicio de limpieza',
        destacadoOpcional: false
      }
    ],
    beneficiosAdicionales: [
      'App móvil VIP con funciones exclusivas',
      'Acceso prioritario a nuevas clases',
      'Descuentos del 20% en suplementos',
      'Invitación a eventos VIP',
      'Programa de fidelización premium'
    ],
    esRecomendado: true, // MARCADO COMO RECOMENDADO
    esPopular: false,
    esNuevo: true, // MARCADO COMO NUEVO
    estado: 'activo',
    ordenVisual: 3,
    createdAt: new Date('2024-03-01'),
    updatedAt: new Date('2024-03-01')
  },

  // PT Intensivo - Plan de entrenamiento personal intensivo
  {
    id: 'plan-004',
    nombre: 'PT Intensivo',
    descripcion: 'Plan de entrenamiento personal intensivo de 3 meses. Ideal para alcanzar objetivos específicos con seguimiento constante.',
    tipo: 'pt',
    periodicidad: 'trimestral',
    precioBase: 450.00,
    moneda: 'EUR',
    sesionesIncluidasOpcional: 12,
    caracteristicas: [
      {
        id: 'car-016',
        label: '12 sesiones de PT',
        descripcionOpcional: '1 sesión por semana durante 3 meses',
        destacadoOpcional: true
      },
      {
        id: 'car-017',
        label: 'Evaluación física inicial',
        descripcionOpcional: 'Análisis de composición corporal y objetivos'
      },
      {
        id: 'car-018',
        label: 'Plan de entrenamiento personalizado',
        descripcionOpcional: 'Rutina adaptada a tus objetivos y nivel'
      },
      {
        id: 'car-019',
        label: 'Seguimiento semanal',
        descripcionOpcional: 'Ajustes y modificaciones según progreso'
      },
      {
        id: 'car-020',
        label: 'Plan nutricional básico',
        destacadoOpcional: false
      }
    ],
    beneficiosAdicionales: [
      'Acceso a instalaciones durante el plan',
      'App de seguimiento incluida',
      'Informes de progreso mensuales'
    ],
    esRecomendado: false,
    esPopular: false,
    esNuevo: false,
    estado: 'activo',
    ordenVisual: 4,
    createdAt: new Date('2024-01-25'),
    updatedAt: new Date('2024-02-15')
  },

  // Grupal Empresas - Plan grupal para empresas
  {
    id: 'plan-005',
    nombre: 'Grupal Empresas',
    descripcion: 'Plan diseñado para empresas que quieren promover el bienestar de sus empleados. Clases grupales corporativas con horarios flexibles.',
    tipo: 'grupal',
    periodicidad: 'mensual',
    precioBase: 25.00,
    moneda: 'EUR',
    sesionesIncluidasOpcional: 8,
    caracteristicas: [
      {
        id: 'car-021',
        label: '8 clases grupales al mes',
        descripcionOpcional: 'Yoga, pilates, estiramientos, activación matutina',
        destacadoOpcional: true
      },
      {
        id: 'car-022',
        label: 'Horarios flexibles',
        descripcionOpcional: 'Clases en horario laboral o después del trabajo'
      },
      {
        id: 'car-023',
        label: 'Clases en empresa o gimnasio',
        descripcionOpcional: 'Flexibilidad de ubicación'
      },
      {
        id: 'car-024',
        label: 'Mínimo 10 empleados',
        descripcionOpcional: 'Precio por empleado con descuento grupal'
      },
      {
        id: 'car-025',
        label: 'Informes de participación',
        descripcionOpcional: 'Reportes mensuales para RRHH',
        destacadoOpcional: false
      }
    ],
    beneficiosAdicionales: [
      'Descuentos en planes individuales',
      'Programas de wellness corporativo',
      'Charlas de nutrición y salud'
    ],
    esRecomendado: false,
    esPopular: false,
    esNuevo: false,
    estado: 'activo',
    ordenVisual: 5,
    createdAt: new Date('2024-02-01'),
    updatedAt: new Date('2024-02-20')
  },

  // Plan Trimestral - Suscripción trimestral con descuento
  {
    id: 'plan-006',
    nombre: 'Trimestral',
    descripcion: 'Compromiso trimestral con ahorro del 10%. Ideal para usuarios que buscan estabilidad y mejor precio.',
    tipo: 'suscripcion',
    periodicidad: 'trimestral',
    precioBase: 148.50, // 55€/mes * 3 meses * 0.9 (10% descuento)
    moneda: 'EUR',
    caracteristicas: [
      {
        id: 'car-026',
        label: 'Mismas características que Premium',
        descripcionOpcional: 'Todos los beneficios del plan Premium mensual',
        destacadoOpcional: true
      },
      {
        id: 'car-027',
        label: 'Ahorro del 10%',
        descripcionOpcional: 'Descuento por pago trimestral anticipado'
      },
      {
        id: 'car-028',
        label: 'Sin permanencia adicional',
        descripcionOpcional: 'Renovación automática cada 3 meses'
      }
    ],
    beneficiosAdicionales: [
      'App móvil premium',
      'Seguimiento de progreso',
      'Descuentos en servicios adicionales'
    ],
    esRecomendado: false,
    esPopular: false,
    esNuevo: false,
    estado: 'activo',
    ordenVisual: 6,
    createdAt: new Date('2024-01-30'),
    updatedAt: new Date('2024-01-30')
  },

  // Plan Inactivo - Para probar estados
  {
    id: 'plan-007',
    nombre: 'Plan Descontinuado',
    descripcion: 'Este plan ya no está disponible para nuevos clientes.',
    tipo: 'suscripcion',
    periodicidad: 'mensual',
    precioBase: 40.00,
    moneda: 'EUR',
    caracteristicas: [
      {
        id: 'car-029',
        label: 'Plan descontinuado',
        descripcionOpcional: 'Solo para clientes existentes'
      }
    ],
    esRecomendado: false,
    esPopular: false,
    esNuevo: false,
    estado: 'inactivo',
    ordenVisual: 99,
    createdAt: new Date('2023-12-01'),
    updatedAt: new Date('2024-01-15')
  },

  // Plan Borrador - Para probar estados
  {
    id: 'plan-008',
    nombre: 'Plan Estudiantes (Borrador)',
    descripcion: 'Plan especial para estudiantes con descuento del 30%. En fase de revisión.',
    tipo: 'suscripcion',
    periodicidad: 'mensual',
    precioBase: 24.50,
    moneda: 'EUR',
    caracteristicas: [
      {
        id: 'car-030',
        label: 'Descuento estudiantil del 30%',
        descripcionOpcional: 'Requiere acreditación de estudiante'
      },
      {
        id: 'car-031',
        label: 'Acceso básico a instalaciones',
        descripcionOpcional: 'Sala de pesas y cardio'
      }
    ],
    esRecomendado: false,
    esPopular: false,
    esNuevo: false,
    estado: 'borrador',
    ordenVisual: 100,
    createdAt: new Date('2024-03-10'),
    updatedAt: new Date('2024-03-10')
  }
];

// ============================================================================
// BONOS MOCK
// ============================================================================

/**
 * bonosMock - Array de bonos de ejemplo para desarrollo y testing
 * 
 * Incluye ejemplos de:
 * - Bonos de 5 sesiones: Para usuarios ocasionales
 * - Bonos de 10 sesiones: Opción intermedia popular
 * - Bonos de 20 sesiones: Para usuarios comprometidos
 * 
 * Variedad de caducidades, restricciones y estados para cubrir todos los casos de uso.
 */
export const bonosMock: Bono[] = [
  // Bono de 5 sesiones - Básico
  {
    id: 'bono-001',
    nombre: 'Bono 5 Sesiones',
    descripcion: 'Bono básico de 5 sesiones de entrenamiento personal. Perfecto para probar nuestros servicios o para usuarios ocasionales.',
    numeroSesiones: 5,
    precio: 150.00,
    tiposSesiones: ['pt', 'online'],
    fechaCaducidadOpcional: new Date('2024-09-01'), // 6 meses de validez
    transferible: false,
    restriccionesUso: 'Válido solo de lunes a viernes en horario de 9:00 a 20:00',
    estado: 'activo'
  },

  // Bono de 5 sesiones - Con restricciones
  {
    id: 'bono-002',
    nombre: 'Bono 5 Sesiones Express',
    descripcion: 'Bono de 5 sesiones con validez reducida. Ideal para objetivos a corto plazo.',
    numeroSesiones: 5,
    precio: 140.00,
    tiposSesiones: ['pt'],
    fechaCaducidadOpcional: new Date('2024-06-01'), // 3 meses de validez
    transferible: false,
    restriccionesUso: 'Validez de 3 meses desde la compra. No acumulable con otras ofertas.',
    estado: 'activo'
  },

  // Bono de 10 sesiones - Estándar
  {
    id: 'bono-003',
    nombre: 'Bono 10 Sesiones',
    descripcion: 'Bono estándar de 10 sesiones. La opción más popular entre nuestros clientes. Mejor precio por sesión.',
    numeroSesiones: 10,
    precio: 280.00,
    tiposSesiones: ['pt', 'grupal', 'online'],
    fechaCaducidadOpcional: new Date('2024-12-01'), // 9 meses de validez
    transferible: true,
    restriccionesUso: 'Válido para cualquier tipo de sesión. Transferible a otro cliente con previo aviso.',
    estado: 'activo'
  },

  // Bono de 10 sesiones - Sin restricciones
  {
    id: 'bono-004',
    nombre: 'Bono 10 Sesiones Premium',
    descripcion: 'Bono de 10 sesiones sin restricciones de horario. Máxima flexibilidad para tu entrenamiento.',
    numeroSesiones: 10,
    precio: 300.00,
    tiposSesiones: ['pt', 'grupal', 'online'],
    fechaCaducidadOpcional: new Date('2025-03-01'), // 12 meses de validez
    transferible: true,
    restriccionesUso: undefined, // Sin restricciones
    estado: 'activo'
  },

  // Bono de 20 sesiones - Premium
  {
    id: 'bono-005',
    nombre: 'Bono 20 Sesiones',
    descripcion: 'Bono premium de 20 sesiones con validez extendida. Ideal para usuarios comprometidos con su entrenamiento.',
    numeroSesiones: 20,
    precio: 500.00,
    tiposSesiones: ['pt', 'grupal', 'online'],
    fechaCaducidadOpcional: new Date('2025-06-01'), // 15 meses de validez
    transferible: true,
    restriccionesUso: 'Válido para todos los tipos de sesión. Incluye 2 sesiones de evaluación física gratuitas.',
    estado: 'activo'
  },

  // Bono de 20 sesiones - Intensivo
  {
    id: 'bono-006',
    nombre: 'Bono 20 Sesiones Intensivo',
    descripcion: 'Bono de 20 sesiones diseñado para programas intensivos. Validez de 6 meses para mantener la constancia.',
    numeroSesiones: 20,
    precio: 480.00,
    tiposSesiones: ['pt'],
    fechaCaducidadOpcional: new Date('2024-10-01'), // 6 meses de validez
    transferible: false,
    restriccionesUso: 'Validez de 6 meses. Diseñado para programas de entrenamiento intensivo. No transferible.',
    estado: 'activo'
  },

  // Bono de 5 sesiones - Solo online
  {
    id: 'bono-007',
    nombre: 'Bono 5 Sesiones Online',
    descripcion: 'Bono de 5 sesiones exclusivamente para entrenamiento online. Perfecto para entrenar desde casa.',
    numeroSesiones: 5,
    precio: 120.00,
    tiposSesiones: ['online'],
    fechaCaducidadOpcional: new Date('2024-09-01'), // 6 meses de validez
    transferible: false,
    restriccionesUso: 'Solo válido para sesiones online. Requiere conexión a internet estable.',
    estado: 'activo'
  },

  // Bono de 10 sesiones - Grupal
  {
    id: 'bono-008',
    nombre: 'Bono 10 Sesiones Grupales',
    descripcion: 'Bono de 10 sesiones exclusivamente para clases grupales. Ideal para disfrutar de la energía del grupo.',
    numeroSesiones: 10,
    precio: 200.00,
    tiposSesiones: ['grupal'],
    fechaCaducidadOpcional: new Date('2024-12-01'), // 9 meses de validez
    transferible: true,
    restriccionesUso: 'Solo válido para clases grupales. Requiere reserva previa con 24h de antelación.',
    estado: 'activo'
  },

  // Bono inactivo - Para probar estados
  {
    id: 'bono-009',
    nombre: 'Bono Descontinuado',
    descripcion: 'Este bono ya no está disponible para compra.',
    numeroSesiones: 15,
    precio: 350.00,
    tiposSesiones: ['pt'],
    fechaCaducidadOpcional: undefined,
    transferible: false,
    restriccionesUso: 'Bono descontinuado',
    estado: 'inactivo'
  },

  // Bono archivado - Para probar estados
  {
    id: 'bono-010',
    nombre: 'Bono Archivado',
    descripcion: 'Bono archivado del sistema.',
    numeroSesiones: 8,
    precio: 220.00,
    tiposSesiones: ['pt', 'grupal'],
    fechaCaducidadOpcional: undefined,
    transferible: false,
    restriccionesUso: undefined,
    estado: 'archivado'
  }
];
