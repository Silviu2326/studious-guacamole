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
    descripción: 'Acceso total las 24 horas del día',
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
  }
];

export const MOCK_ESTADISTICAS_ENTRENADOR: EstadisticasPlanes = {
  totalPlanes: 3,
  planesActivos: 3,
  bonosVendidos: 15,
  ingresosMensuales: 2850,
  clientesActivos: 12
};

export const MOCK_ESTADISTICAS_GIMNASIO: EstadisticasPlanes = {
  totalPlanes: 3,
  planesActivos: 3,
  bonosVendidos: 0,
  ingresosMensuales: 4500,
  clientesActivos: 85
};