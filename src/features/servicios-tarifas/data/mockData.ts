import { Service, ServiceCategory, ServiceStats } from '../types';

export const MOCK_CATEGORIES: ServiceCategory[] = [
  {
    id: 'cat_1',
    name: 'Membresías',
    description: 'Membresías recurrentes',
    isActive: true,
    createdAt: new Date('2024-01-01')
  },
  {
    id: 'cat_2',
    name: 'Entrenamiento Personal',
    description: 'Sesiones de entrenamiento personalizado',
    isActive: true,
    createdAt: new Date('2024-01-01')
  },
  {
    id: 'cat_3',
    name: 'Clases Grupales',
    description: 'Clases grupales y colectivas',
    isActive: true,
    createdAt: new Date('2024-01-01')
  },
  {
    id: 'cat_4',
    name: 'Nutrición',
    description: 'Consultas y planes nutricionales',
    isActive: true,
    createdAt: new Date('2024-01-01')
  },
  {
    id: 'cat_5',
    name: 'Productos',
    description: 'Productos físicos y suplementos',
    isActive: true,
    createdAt: new Date('2024-01-01')
  }
];

export const MOCK_SERVICES_GIMNASIO: Service[] = [
  {
    serviceId: 'svc_1',
    name: 'Membresía Gold',
    description: 'Acceso completo a todas las instalaciones y clases grupales',
    category: 'Membresías',
    price: 59.99,
    currency: 'EUR',
    serviceType: 'MEMBERSHIP',
    isRecurring: true,
    billingType: 'RECURRING',
    recurringInterval: 'MONTHLY',
    isActive: true,
    taxRate: 21,
    taxType: 'STANDARD',
    sku: 'MEM-GOLD-M',
    requiresBooking: false,
    requiresResources: false,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15')
  },
  {
    serviceId: 'svc_2',
    name: 'Membresía Premium',
    description: 'Acceso completo + Entrenamiento personal + Nutrición',
    category: 'Membresías',
    price: 99.99,
    currency: 'EUR',
    serviceType: 'MEMBERSHIP',
    isRecurring: true,
    billingType: 'RECURRING',
    recurringInterval: 'MONTHLY',
    isActive: true,
    taxRate: 21,
    taxType: 'STANDARD',
    sku: 'MEM-PREM-M',
    requiresBooking: false,
    requiresResources: false,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15')
  },
  {
    serviceId: 'svc_3',
    name: 'Pack 10 Clases de Yoga',
    description: 'Bono de 10 clases de yoga para usar en 3 meses',
    category: 'Clases Grupales',
    price: 120.00,
    currency: 'EUR',
    serviceType: 'SESSION_PACK',
    isRecurring: false,
    billingType: 'ONE_TIME',
    isActive: true,
    sessionCount: 10,
    duration: 60,
    taxRate: 21,
    taxType: 'STANDARD',
    sku: 'PKG-YOGA-10',
    requiresBooking: true,
    requiresResources: true,
    metadata: {
      validityDays: 90,
      resourceType: 'yoga_room'
    },
    createdAt: new Date('2024-02-01'),
    updatedAt: new Date('2024-02-01')
  },
  {
    serviceId: 'svc_4',
    name: 'Clase de Pilates',
    description: 'Clase suelta de pilates',
    category: 'Clases Grupales',
    price: 15.00,
    currency: 'EUR',
    serviceType: 'SINGLE_CLASS',
    isRecurring: false,
    billingType: 'ONE_TIME',
    isActive: true,
    duration: 50,
    taxRate: 21,
    taxType: 'STANDARD',
    sku: 'CLS-PILATES',
    requiresBooking: true,
    requiresResources: true,
    metadata: {
      resourceType: 'pilates_room'
    },
    createdAt: new Date('2024-02-05'),
    updatedAt: new Date('2024-02-05')
  },
  {
    serviceId: 'svc_5',
    name: 'Sesión de Fisioterapia 30min',
    description: 'Sesión individual de fisioterapia de 30 minutos',
    category: 'Entrenamiento Personal',
    price: 40.00,
    currency: 'EUR',
    serviceType: 'CONSULTATION',
    isRecurring: false,
    billingType: 'ONE_TIME',
    isActive: true,
    duration: 30,
    taxRate: 10,
    taxType: 'REDUCED',
    sku: 'FIS-30',
    requiresBooking: true,
    requiresResources: true,
    metadata: {
      requiresStaff: 'fisioterapeuta'
    },
    createdAt: new Date('2024-02-10'),
    updatedAt: new Date('2024-02-10')
  },
  {
    serviceId: 'svc_6',
    name: 'Batido de Proteínas',
    description: 'Batido de proteínas post-entrenamiento',
    category: 'Productos',
    price: 6.50,
    currency: 'EUR',
    serviceType: 'PRODUCT',
    isRecurring: false,
    billingType: 'ONE_TIME',
    isActive: true,
    taxRate: 10,
    taxType: 'REDUCED',
    sku: 'PROT-SHAKE',
    requiresBooking: false,
    requiresResources: false,
    createdAt: new Date('2024-02-15'),
    updatedAt: new Date('2024-02-15')
  }
];

export const MOCK_SERVICES_ENTRENADOR: Service[] = [
  {
    serviceId: 'svc_e1',
    name: 'Pack 10 Sesiones PT',
    description: 'Paquete de 10 sesiones de entrenamiento personal con descuento',
    category: 'Entrenamiento Personal',
    price: 450.00,
    currency: 'EUR',
    serviceType: 'SESSION_PACK',
    isRecurring: false,
    billingType: 'ONE_TIME',
    isActive: true,
    sessionCount: 10,
    duration: 60,
    taxRate: 21,
    taxType: 'STANDARD',
    sku: 'PKG-PT-10',
    requiresBooking: true,
    requiresResources: false,
    metadata: {
      validityDays: 120
    },
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-01-20')
  },
  {
    serviceId: 'svc_e2',
    name: 'Sesión de Entrenamiento Personal',
    description: 'Sesión individual de entrenamiento personalizado',
    category: 'Entrenamiento Personal',
    price: 50.00,
    currency: 'EUR',
    serviceType: 'SESSION_PACK',
    isRecurring: false,
    billingType: 'ONE_TIME',
    isActive: true,
    sessionCount: 1,
    duration: 60,
    taxRate: 21,
    taxType: 'STANDARD',
    sku: 'PT-SESION',
    requiresBooking: true,
    requiresResources: false,
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-01-20')
  },
  {
    serviceId: 'svc_e3',
    name: 'Plan Nutricional Online',
    description: 'Plan nutricional personalizado entregado digitalmente',
    category: 'Nutrición',
    price: 89.99,
    currency: 'EUR',
    serviceType: 'ONLINE_PROGRAM',
    isRecurring: false,
    billingType: 'ONE_TIME',
    isActive: true,
    taxRate: 21,
    taxType: 'STANDARD',
    sku: 'NUT-PLAN-DIG',
    requiresBooking: false,
    requiresResources: false,
    createdAt: new Date('2024-02-01'),
    updatedAt: new Date('2024-02-01')
  },
  {
    serviceId: 'svc_e4',
    name: 'Seguimiento Semanal Online',
    description: 'Membresía para seguimiento nutricional semanal online',
    category: 'Nutrición',
    price: 29.99,
    currency: 'EUR',
    serviceType: 'MEMBERSHIP',
    isRecurring: true,
    billingType: 'RECURRING',
    recurringInterval: 'MONTHLY',
    isActive: true,
    taxRate: 21,
    taxType: 'STANDARD',
    sku: 'NUT-FOLLOW-M',
    requiresBooking: false,
    requiresResources: false,
    createdAt: new Date('2024-02-05'),
    updatedAt: new Date('2024-02-05')
  },
  {
    serviceId: 'svc_e5',
    name: 'Consulta Nutricional Inicial',
    description: 'Primera consulta para evaluación y planificación nutricional',
    category: 'Nutrición',
    price: 75.00,
    currency: 'EUR',
    serviceType: 'CONSULTATION',
    isRecurring: false,
    billingType: 'ONE_TIME',
    isActive: true,
    duration: 60,
    taxRate: 21,
    taxType: 'STANDARD',
    sku: 'NUT-INIT',
    requiresBooking: true,
    requiresResources: false,
    createdAt: new Date('2024-02-10'),
    updatedAt: new Date('2024-02-10')
  }
];

export const MOCK_STATS_GIMNASIO: ServiceStats = {
  totalServices: 15,
  activeServices: 12,
  inactiveServices: 3,
  revenueLast30Days: 12500.50,
  topServiceRevenue: {
    name: 'Membresía Gold',
    revenue: 4500.00
  },
  topServiceSales: {
    name: 'Clase de Pilates',
    sales: 180
  },
  categoryDistribution: [
    { category: 'Membresías', count: 5 },
    { category: 'Clases Grupales', count: 6 },
    { category: 'Entrenamiento Personal', count: 2 },
    { category: 'Productos', count: 2 }
  ],
  revenueByCategory: [
    { category: 'Membresías', revenue: 8000.00 },
    { category: 'Clases Grupales', revenue: 3000.00 },
    { category: 'Entrenamiento Personal', revenue: 1200.50 },
    { category: 'Productos', revenue: 300.00 }
  ],
  averageTicketPrice: 45.50
};

export const MOCK_STATS_ENTRENADOR: ServiceStats = {
  totalServices: 8,
  activeServices: 7,
  inactiveServices: 1,
  revenueLast30Days: 3200.00,
  topServiceRevenue: {
    name: 'Pack 10 Sesiones PT',
    revenue: 1350.00
  },
  topServiceSales: {
    name: 'Sesión de Entrenamiento Personal',
    sales: 25
  },
  categoryDistribution: [
    { category: 'Entrenamiento Personal', count: 4 },
    { category: 'Nutrición', count: 3 },
    { category: 'Otros', count: 1 }
  ],
  revenueByCategory: [
    { category: 'Entrenamiento Personal', revenue: 2100.00 },
    { category: 'Nutrición', revenue: 950.00 },
    { category: 'Otros', revenue: 150.00 }
  ],
  averageTicketPrice: 75.00
};

