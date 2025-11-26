import { Plan, Bono, TipoCuota, Cliente, EstadisticasPlanes } from '../types';

export const MOCK_PLANES_ENTRENADOR: Plan[] = [
  {
    id: '1',
    nombre: 'Bono Básico PT',
    descripcion: 'Perfecto para comenzar tu entrenamiento personalizado',
    tipo: 'bono_pt',
    precio: {
      base: 150,
      descuento: 0,
      moneda: 'EUR'
    },
    activo: true,
    fechaCreacion: new Date('2024-01-15'),
    fechaActualizacion: new Date('2024-01-15'),
    sesiones: 5,
    validezMeses: 3
  },
  {
    id: '2',
    nombre: 'Bono Estándar PT',
    descripcion: 'La opción más popular para entrenamientos regulares',
    tipo: 'bono_pt',
    precio: {
      base: 280,
      descuento: 5,
      moneda: 'EUR'
    },
    activo: true,
    fechaCreacion: new Date('2024-01-15'),
    fechaActualizacion: new Date('2024-01-20'),
    sesiones: 10,
    validezMeses: 6
  },
  {
    id: '3',
    nombre: 'Bono Premium PT',
    descripcion: 'Máximo valor para entrenamientos intensivos',
    tipo: 'bono_pt',
    precio: {
      base: 500,
      descuento: 10,
      moneda: 'EUR'
    },
    activo: true,
    fechaCreacion: new Date('2024-01-15'),
    fechaActualizacion: new Date('2024-01-25'),
    sesiones: 20,
    validezMeses: 12
  },
  {
    id: '7',
    nombre: 'Bono Intensivo PT',
    descripcion: 'Para atletas que buscan resultados rápidos',
    tipo: 'bono_pt',
    precio: {
      base: 750,
      descuento: 12,
      moneda: 'EUR'
    },
    activo: true,
    fechaCreacion: new Date('2024-02-01'),
    fechaActualizacion: new Date('2024-02-05'),
    sesiones: 30,
    validezMeses: 6
  },
  {
    id: '8',
    nombre: 'Bono Iniciación PT',
    descripcion: 'Tu primera experiencia con entrenamiento personalizado',
    tipo: 'bono_pt',
    precio: {
      base: 120,
      descuento: 15,
      moneda: 'EUR'
    },
    activo: true,
    fechaCreacion: new Date('2024-03-01'),
    fechaActualizacion: new Date('2024-03-01'),
    sesiones: 3,
    validezMeses: 2
  },
  {
    id: '9',
    nombre: 'Bono Trimestral PT',
    descripcion: 'Compromiso trimestral con mejor precio por sesión',
    tipo: 'bono_pt',
    precio: {
      base: 400,
      descuento: 8,
      moneda: 'EUR'
    },
    activo: true,
    fechaCreacion: new Date('2024-01-20'),
    fechaActualizacion: new Date('2024-01-20'),
    sesiones: 15,
    validezMeses: 3
  }
];

export const MOCK_PLANES_GIMNASIO: Plan[] = [
  {
    id: '4',
    nombre: 'Membresía Básica',
    descripcion: 'Acceso a instalaciones básicas del gimnasio',
    tipo: 'cuota_gimnasio',
    precio: {
      base: 35,
      descuento: 0,
      moneda: 'EUR'
    },
    activo: true,
    fechaCreacion: new Date('2024-01-15'),
    fechaActualizacion: new Date('2024-01-15'),
    tipoAcceso: 'basica',
    clasesIlimitadas: false,
    instalacionesIncluidas: ['Sala de pesas', 'Cardio']
  },
  {
    id: '5',
    nombre: 'Membresía Premium',
    descripcion: 'Acceso completo con clases grupales incluidas',
    tipo: 'cuota_gimnasio',
    precio: {
      base: 55,
      descuento: 0,
      moneda: 'EUR'
    },
    activo: true,
    fechaCreacion: new Date('2024-01-15'),
    fechaActualizacion: new Date('2024-01-20'),
    tipoAcceso: 'premium',
    clasesIlimitadas: true,
    instalacionesIncluidas: ['Sala de pesas', 'Cardio', 'Piscina', 'Sauna', 'Clases grupales']
  },
  {
    id: '6',
    nombre: 'Libre Acceso 24/7',
    descripcion: 'Acceso total las 24 horas del día',
    tipo: 'cuota_gimnasio',
    precio: {
      base: 75,
      descuento: 15,
      moneda: 'EUR'
    },
    activo: true,
    fechaCreacion: new Date('2024-01-15'),
    fechaActualizacion: new Date('2024-01-25'),
    tipoAcceso: 'libre_acceso',
    clasesIlimitadas: true,
    instalacionesIncluidas: ['Todas las instalaciones', 'Acceso 24/7', 'Clases premium']
  },
  {
    id: '10',
    nombre: 'Membresía VIP',
    descripcion: 'Acceso exclusivo con beneficios premium',
    tipo: 'cuota_gimnasio',
    precio: {
      base: 95,
      descuento: 10,
      moneda: 'EUR'
    },
    activo: true,
    fechaCreacion: new Date('2024-02-01'),
    fechaActualizacion: new Date('2024-02-05'),
    tipoAcceso: 'premium',
    clasesIlimitadas: true,
    instalacionesIncluidas: ['Todas las instalaciones', 'Servicio de toalla', 'Lockers VIP', 'Spa']
  },
  {
    id: '11',
    nombre: 'Membresía Estudiantes',
    descripcion: 'Para estudiantes con precio reducido',
    tipo: 'cuota_gimnasio',
    precio: {
      base: 28,
      descuento: 20,
      moneda: 'EUR'
    },
    activo: true,
    fechaCreacion: new Date('2024-02-15'),
    fechaActualizacion: new Date('2024-02-15'),
    tipoAcceso: 'basica',
    clasesIlimitadas: false,
    instalacionesIncluidas: ['Sala de pesas', 'Cardio']
  },
  {
    id: '12',
    nombre: 'Membresía Senior',
    descripcion: 'Para mayores de 60 años',
    tipo: 'cuota_gimnasio',
    precio: {
      base: 30,
      descuento: 14,
      moneda: 'EUR'
    },
    activo: true,
    fechaCreacion: new Date('2024-03-01'),
    fechaActualizacion: new Date('2024-03-01'),
    tipoAcceso: 'basica',
    clasesIlimitadas: false,
    instalacionesIncluidas: ['Sala de pesas', 'Cardio', 'Clases adaptadas']
  }
];

export const MOCK_BONOS: Bono[] = [
  {
    id: 'b1',
    planId: '1',
    clienteId: 'c1',
    sesionesTotal: 5,
    sesionesUsadas: 2,
    sesionesRestantes: 3,
    fechaCompra: new Date('2024-01-20'),
    fechaVencimiento: new Date('2024-04-20'),
    estado: 'activo',
    precio: 150
  },
  {
    id: 'b2',
    planId: '2',
    clienteId: 'c2',
    sesionesTotal: 10,
    sesionesUsadas: 7,
    sesionesRestantes: 3,
    fechaCompra: new Date('2024-01-15'),
    fechaVencimiento: new Date('2024-07-15'),
    estado: 'activo',
    precio: 266
  },
  {
    id: 'b3',
    planId: '3',
    clienteId: 'c3',
    sesionesTotal: 20,
    sesionesUsadas: 18,
    sesionesRestantes: 2,
    fechaCompra: new Date('2024-02-01'),
    fechaVencimiento: new Date('2025-02-01'),
    estado: 'activo',
    precio: 450
  },
  {
    id: 'b4',
    planId: '8',
    clienteId: 'c1',
    sesionesTotal: 3,
    sesionesUsadas: 3,
    sesionesRestantes: 0,
    fechaCompra: new Date('2024-01-10'),
    fechaVencimiento: new Date('2024-03-10'),
    estado: 'agotado',
    precio: 102
  },
  {
    id: 'b5',
    planId: '7',
    clienteId: 'c2',
    sesionesTotal: 30,
    sesionesUsadas: 5,
    sesionesRestantes: 25,
    fechaCompra: new Date('2024-03-01'),
    fechaVencimiento: new Date('2024-09-01'),
    estado: 'activo',
    precio: 660
  },
  {
    id: 'b6',
    planId: '9',
    clienteId: 'c3',
    sesionesTotal: 15,
    sesionesUsadas: 0,
    sesionesRestantes: 15,
    fechaCompra: new Date('2024-01-20'),
    fechaVencimiento: new Date('2024-04-20'),
    estado: 'activo',
    precio: 368
  },
  {
    id: 'b7',
    planId: '1',
    clienteId: 'c4',
    sesionesTotal: 5,
    sesionesUsadas: 2,
    sesionesRestantes: 3,
    fechaCompra: new Date('2023-11-15'),
    fechaVencimiento: new Date('2024-02-15'),
    estado: 'vencido',
    precio: 150
  },
  {
    id: 'b8',
    planId: '2',
    clienteId: 'c5',
    sesionesTotal: 10,
    sesionesUsadas: 4,
    sesionesRestantes: 6,
    fechaCompra: new Date('2024-02-15'),
    fechaVencimiento: new Date('2024-08-15'),
    estado: 'suspendido',
    precio: 266
  }
];

export const MOCK_TIPOS_CUOTA: TipoCuota[] = [
  {
    id: 't1',
    nombre: 'Cuota Básica',
    descripcion: 'Acceso básico a instalaciones',
    precio: 35,
    duracionMeses: 1,
    beneficios: ['Sala de pesas', 'Área de cardio', 'Vestuarios'],
    activo: true
  },
  {
    id: 't2',
    nombre: 'Cuota Premium',
    descripcion: 'Acceso completo con beneficios adicionales',
    precio: 55,
    duracionMeses: 1,
    beneficios: ['Todas las instalaciones', 'Clases grupales', 'Piscina', 'Sauna'],
    limitaciones: ['Reserva previa para clases'],
    activo: true
  }
];

export const MOCK_CLIENTES: Cliente[] = [
  {
    id: 'c1',
    nombre: 'Ana García',
    email: 'ana.garcia@email.com',
    telefono: '+34 666 123 456',
    fechaRegistro: new Date('2024-01-10')
  },
  {
    id: 'c2',
    nombre: 'Carlos Rodríguez',
    email: 'carlos.rodriguez@email.com',
    telefono: '+34 666 789 012',
    fechaRegistro: new Date('2024-01-12')
  },
  {
    id: 'c3',
    nombre: 'María López',
    email: 'maria.lopez@email.com',
    telefono: '+34 666 345 678',
    fechaRegistro: new Date('2024-01-18')
  },
  {
    id: 'c4',
    nombre: 'Elena Sánchez',
    email: 'elena.sanchez@email.com',
    telefono: '+34 666 234 567',
    fechaRegistro: new Date('2024-01-20')
  },
  {
    id: 'c5',
    nombre: 'Roberto Martín',
    email: 'roberto.martin@email.com',
    telefono: '+34 666 456 789',
    fechaRegistro: new Date('2024-01-25')
  },
  {
    id: 'c6',
    nombre: 'Laura Torres',
    email: 'laura.torres@email.com',
    telefono: '+34 666 567 890',
    fechaRegistro: new Date('2024-02-01')
  },
  {
    id: 'c7',
    nombre: 'Miguel Vargas',
    email: 'miguel.vargas@email.com',
    telefono: '+34 666 678 901',
    fechaRegistro: new Date('2024-02-05')
  },
  {
    id: 'c8',
    nombre: 'Patricia Jiménez',
    email: 'patricia.jimenez@email.com',
    telefono: '+34 666 789 123',
    fechaRegistro: new Date('2024-02-10')
  }
];

export const MOCK_ESTADISTICAS_ENTRENADOR: EstadisticasPlanes = {
  totalPlanes: 6,
  planesActivos: 6,
  bonosVendidos: 32,
  ingresosMensuales: 5420,
  clientesActivos: 24
};

export const MOCK_ESTADISTICAS_GIMNASIO: EstadisticasPlanes = {
  totalPlanes: 6,
  planesActivos: 6,
  bonosVendidos: 0,
  ingresosMensuales: 8750,
  clientesActivos: 145
};