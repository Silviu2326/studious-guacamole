/**
 * API Mock de Paquetes de Facturación - Sistema de Facturación y Cobros
 * 
 * Este archivo implementa la lógica mock para la gestión de paquetes de servicios
 * que pueden ser facturados. Los paquetes representan conjuntos predefinidos de
 * servicios que se pueden vender a clientes.
 * 
 * FUNCIONES PRINCIPALES:
 * - getPaquetesFacturacion(): Obtiene todos los paquetes disponibles para facturación
 * - crearPaquete(data): Crea un nuevo paquete de servicios
 * - actualizarPaquete(id, cambios): Actualiza un paquete existente
 * - desactivarPaquete(id): Desactiva un paquete (no lo elimina, solo lo marca como inactivo)
 * 
 * USO EN COMPONENTES:
 * - CreadorFactura.tsx: 
 *   * Permite seleccionar paquetes predefinidos al crear una factura
 *   * Al seleccionar un paquete, se agregan automáticamente los servicios incluidos
 *   * como items de la factura con sus precios y cantidades configuradas
 *   * Ejemplo: const paquetes = await getPaquetesFacturacion();
 *   *          const paqueteSeleccionado = paquetes.find(p => p.id === paqueteId);
 *   *          // Agregar serviciosIncluidos como items de factura
 * 
 * - GestorPaquetes (componente futuro):
 *   * Lista todos los paquetes disponibles usando getPaquetesFacturacion()
 *   * Permite crear nuevos paquetes con crearPaquete()
 *   * Permite editar paquetes existentes con actualizarPaquete()
 *   * Permite desactivar paquetes con desactivarPaquete()
 * 
 * NOTA: En producción, las llamadas a backend reales irían en endpoints como:
 * - GET /api/paquetes-facturacion - Obtener todos los paquetes
 * - POST /api/paquetes-facturacion - Crear nuevo paquete
 * - PUT /api/paquetes-facturacion/:id - Actualizar paquete
 * - PATCH /api/paquetes-facturacion/:id/desactivar - Desactivar paquete
 */

import { PaqueteServicio, ServicioIncluido } from '../types/paquetes';

// ============================================================================
// DATOS MOCK
// ============================================================================

/**
 * Almacenamiento mock de paquetes de facturación en memoria
 * En producción, esto sería una base de datos (PostgreSQL, MongoDB, etc.)
 */
const mockPaquetes: PaqueteServicio[] = [
  {
    id: 'paq_001',
    nombre: 'Paquete Premium Mensual',
    descripcion: 'Paquete completo con entrenamiento personal, nutrición y seguimiento',
    serviciosIncluidos: [
      {
        servicioId: 'serv_001',
        nombreServicio: 'Entrenamiento Personal',
        cantidadSesiones: 8
      },
      {
        servicioId: 'serv_002',
        nombreServicio: 'Consulta Nutricional',
        cantidadSesiones: 2
      },
      {
        servicioId: 'serv_003',
        nombreServicio: 'Seguimiento Online',
        cantidadSesiones: 1
      }
    ],
    precio: 450000,
    moneda: 'EUR',
    esRecurrente: true,
    periodoRecurrenteOpcional: 'mensual',
    activo: true,
    creadoEn: new Date('2024-01-15T10:00:00')
  },
  {
    id: 'paq_002',
    nombre: 'Paquete Básico Trimestral',
    descripcion: 'Paquete básico de servicios con facturación trimestral',
    serviciosIncluidos: [
      {
        servicioId: 'serv_001',
        nombreServicio: 'Entrenamiento Personal',
        cantidadSesiones: 12
      },
      {
        servicioId: 'serv_004',
        nombreServicio: 'Acceso a Instalaciones',
        cantidadSesiones: 90
      }
    ],
    precio: 600000,
    moneda: 'EUR',
    esRecurrente: true,
    periodoRecurrenteOpcional: 'trimestral',
    activo: true,
    creadoEn: new Date('2024-01-10T09:00:00')
  },
  {
    id: 'paq_003',
    nombre: 'Paquete Inicio - 10 Sesiones',
    descripcion: 'Paquete único de inicio con 10 sesiones de entrenamiento personal',
    serviciosIncluidos: [
      {
        servicioId: 'serv_001',
        nombreServicio: 'Entrenamiento Personal',
        cantidadSesiones: 10
      }
    ],
    precio: 350000,
    moneda: 'EUR',
    esRecurrente: false,
    activo: true,
    creadoEn: new Date('2024-01-05T08:00:00')
  },
  {
    id: 'paq_004',
    nombre: 'Paquete VIP Anual',
    descripcion: 'Paquete premium anual con todos los servicios incluidos',
    serviciosIncluidos: [
      {
        servicioId: 'serv_001',
        nombreServicio: 'Entrenamiento Personal',
        cantidadSesiones: 96
      },
      {
        servicioId: 'serv_002',
        nombreServicio: 'Consulta Nutricional',
        cantidadSesiones: 24
      },
      {
        servicioId: 'serv_003',
        nombreServicio: 'Seguimiento Online',
        cantidadSesiones: 12
      },
      {
        servicioId: 'serv_004',
        nombreServicio: 'Acceso a Instalaciones',
        cantidadSesiones: 365
      }
    ],
    precio: 4500000,
    moneda: 'EUR',
    esRecurrente: true,
    periodoRecurrenteOpcional: 'anual',
    activo: false,
    creadoEn: new Date('2023-12-01T10:00:00')
  }
];

// ============================================================================
// FUNCIONES DE API
// ============================================================================

/**
 * Obtiene todos los paquetes de facturación disponibles
 * 
 * @returns Promise<PaqueteServicio[]> Lista de todos los paquetes (activos e inactivos)
 * 
 * @example
 * // En CreadorFactura.tsx:
 * const paquetes = await getPaquetesFacturacion();
 * const paquetesActivos = paquetes.filter(p => p.activo);
 * // Mostrar paquetes en selector para que el usuario elija
 */
export async function getPaquetesFacturacion(): Promise<PaqueteServicio[]> {
  // Simular delay de red
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Retornar copia del array para evitar mutaciones
  return [...mockPaquetes];
}

/**
 * Crea un nuevo paquete de facturación
 * 
 * @param data Datos del paquete a crear (sin id ni creadoEn, se generan automáticamente)
 * @returns Promise<PaqueteServicio> El paquete creado con id y fecha de creación
 * 
 * @example
 * // En GestorPaquetes:
 * const nuevoPaquete = await crearPaquete({
 *   nombre: 'Paquete Nuevo',
 *   descripcion: 'Descripción del paquete',
 *   serviciosIncluidos: [...],
 *   precio: 200000,
 *   moneda: 'EUR',
 *   esRecurrente: false,
 *   activo: true
 * });
 */
export async function crearPaquete(
  data: Omit<PaqueteServicio, 'id' | 'creadoEn'>
): Promise<PaqueteServicio> {
  // Simular delay de red
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Validar datos básicos
  if (!data.nombre || !data.serviciosIncluidos || data.serviciosIncluidos.length === 0) {
    throw new Error('El paquete debe tener un nombre y al menos un servicio incluido');
  }
  
  if (data.precio <= 0) {
    throw new Error('El precio del paquete debe ser mayor a 0');
  }
  
  if (data.esRecurrente && !data.periodoRecurrenteOpcional) {
    throw new Error('Los paquetes recurrentes deben tener un período definido');
  }
  
  // Crear nuevo paquete
  const nuevoPaquete: PaqueteServicio = {
    ...data,
    id: `paq_${Date.now()}`,
    creadoEn: new Date()
  };
  
  // Agregar al array mock
  mockPaquetes.push(nuevoPaquete);
  
  return nuevoPaquete;
}

/**
 * Actualiza un paquete de facturación existente
 * 
 * @param id ID del paquete a actualizar
 * @param cambios Objeto con los campos a actualizar (parcial)
 * @returns Promise<PaqueteServicio> El paquete actualizado
 * 
 * @example
 * // En GestorPaquetes:
 * const paqueteActualizado = await actualizarPaquete('paq_001', {
 *   precio: 500000,
 *   serviciosIncluidos: [...nuevosServicios]
 * });
 */
export async function actualizarPaquete(
  id: string,
  cambios: Partial<Omit<PaqueteServicio, 'id' | 'creadoEn'>>
): Promise<PaqueteServicio> {
  // Simular delay de red
  await new Promise(resolve => setTimeout(resolve, 400));
  
  // Buscar el paquete
  const index = mockPaquetes.findIndex(p => p.id === id);
  if (index === -1) {
    throw new Error(`Paquete con ID ${id} no encontrado`);
  }
  
  // Validar cambios si es necesario
  if (cambios.precio !== undefined && cambios.precio <= 0) {
    throw new Error('El precio del paquete debe ser mayor a 0');
  }
  
  if (cambios.esRecurrente === true && !cambios.periodoRecurrenteOpcional && !mockPaquetes[index].periodoRecurrenteOpcional) {
    throw new Error('Los paquetes recurrentes deben tener un período definido');
  }
  
  // Aplicar cambios
  mockPaquetes[index] = {
    ...mockPaquetes[index],
    ...cambios
  };
  
  return mockPaquetes[index];
}

/**
 * Desactiva un paquete de facturación (no lo elimina, solo lo marca como inactivo)
 * 
 * @param id ID del paquete a desactivar
 * @returns Promise<PaqueteServicio> El paquete desactivado
 * 
 * @example
 * // En GestorPaquetes:
 * const paqueteDesactivado = await desactivarPaquete('paq_004');
 * // El paquete ya no aparecerá en los listados de paquetes activos
 * // pero se mantiene en el historial para facturas ya generadas
 */
export async function desactivarPaquete(id: string): Promise<PaqueteServicio> {
  // Simular delay de red
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // Buscar el paquete
  const index = mockPaquetes.findIndex(p => p.id === id);
  if (index === -1) {
    throw new Error(`Paquete con ID ${id} no encontrado`);
  }
  
  // Desactivar el paquete
  mockPaquetes[index].activo = false;
  
  return mockPaquetes[index];
}

