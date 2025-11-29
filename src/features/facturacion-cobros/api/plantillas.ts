/**
 * API Mock de Plantillas de Factura - Sistema de Facturación y Cobros
 * 
 * Este archivo implementa la lógica mock para la gestión de plantillas de facturas.
 * Las plantillas definen el diseño, estilo y campos personalizados que se aplican
 * al generar y renderizar facturas.
 * 
 * FUNCIONES PRINCIPALES:
 * - getPlantillasFactura(): Obtiene todas las plantillas de factura disponibles
 * - crearPlantillaFactura(data): Crea una nueva plantilla de factura
 * - actualizarPlantillaFactura(id, cambios): Actualiza una plantilla existente
 * - eliminarPlantillaFactura(id): Elimina una plantilla (no permite eliminar la por defecto)
 * - establecerPlantillaPorDefecto(id): Establece una plantilla como la predeterminada
 * 
 * USO EN COMPONENTES:
 * - PlantillasFactura.tsx:
 *   * Lista todas las plantillas disponibles usando getPlantillasFactura()
 *   * Permite crear nuevas plantillas con crearPlantillaFactura()
 *   * Permite editar plantillas existentes con actualizarPlantillaFactura()
 *   * Permite eliminar plantillas con eliminarPlantillaFactura() (excepto la por defecto)
 *   * Permite establecer una plantilla como predeterminada con establecerPlantillaPorDefecto()
 *   * Ejemplo: const plantillas = await getPlantillasFactura();
 *   *          const plantillaPorDefecto = plantillas.find(p => p.esPorDefecto);
 * 
 * - CreadorFactura.tsx:
 *   * Permite seleccionar una plantilla al crear una factura
 *   * Si no se selecciona una plantilla, se usa la plantilla por defecto
 *   * La plantilla seleccionada determina el diseño y campos personalizados de la factura
 *   * Ejemplo: const plantillas = await getPlantillasFactura();
 *   *          const plantillaSeleccionada = plantillas.find(p => p.id === plantillaId) 
 *   *                                      || plantillas.find(p => p.esPorDefecto);
 *   *          // Aplicar diseño y campos de la plantilla al renderizar la factura
 * 
 * NOTA: En producción, las llamadas a backend reales irían en endpoints como:
 * - GET /api/plantillas-factura - Obtener todas las plantillas
 * - POST /api/plantillas-factura - Crear nueva plantilla
 * - PUT /api/plantillas-factura/:id - Actualizar plantilla
 * - DELETE /api/plantillas-factura/:id - Eliminar plantilla
 * - PATCH /api/plantillas-factura/:id/establecer-por-defecto - Establecer como predeterminada
 */

import { PlantillaFactura, CampoPersonalizadoFactura, DisenoPlantilla } from '../types/plantillas';

// ============================================================================
// DATOS MOCK
// ============================================================================

/**
 * Almacenamiento mock de plantillas de factura en memoria
 * En producción, esto sería una base de datos (PostgreSQL, MongoDB, etc.)
 */
const mockPlantillas: PlantillaFactura[] = [
  {
    id: 'plantilla_001',
    nombre: 'Plantilla Clásica',
    descripcion: 'Diseño tradicional y profesional para facturas estándar',
    diseño: 'clasica',
    logoUrlOpcional: 'https://example.com/logo.png',
    colorPrimarioOpcional: '#3B82F6',
    camposOpcionales: [
      {
        id: 'campo_001',
        nombreCampo: 'Términos de pago',
        tipo: 'texto',
        valorPorDefectoOpcional: 'Pago a 30 días'
      },
      {
        id: 'campo_002',
        nombreCampo: 'Referencia interna',
        tipo: 'texto'
      }
    ],
    textoLegalOpcional: 'Todos los precios incluyen IVA. Factura conforme a la normativa vigente.',
    esPorDefecto: true
  },
  {
    id: 'plantilla_002',
    nombre: 'Plantilla Minimalista',
    descripcion: 'Diseño limpio y moderno, ideal para facturas simples',
    diseño: 'minimal',
    colorPrimarioOpcional: '#10B981',
    camposOpcionales: [
      {
        id: 'campo_003',
        nombreCampo: 'Notas adicionales',
        tipo: 'texto'
      }
    ],
    esPorDefecto: false
  },
  {
    id: 'plantilla_003',
    nombre: 'Plantilla Detallada',
    descripcion: 'Diseño completo con todos los campos y información detallada',
    diseño: 'detallada',
    logoUrlOpcional: 'https://example.com/logo-detallado.png',
    colorPrimarioOpcional: '#8B5CF6',
    camposOpcionales: [
      {
        id: 'campo_004',
        nombreCampo: 'Términos de pago',
        tipo: 'texto',
        valorPorDefectoOpcional: 'Pago a 30 días'
      },
      {
        id: 'campo_005',
        nombreCampo: 'Orden de compra',
        tipo: 'texto'
      },
      {
        id: 'campo_006',
        nombreCampo: 'Fecha de entrega',
        tipo: 'fecha'
      },
      {
        id: 'campo_007',
        nombreCampo: 'Aprobado por',
        tipo: 'texto'
      }
    ],
    textoLegalOpcional: 'Esta factura es conforme a la normativa fiscal vigente. Todos los importes incluyen IVA cuando corresponda.',
    esPorDefecto: false
  },
  {
    id: 'plantilla_004',
    nombre: 'Plantilla Corporativa',
    descripcion: 'Plantilla personalizada para facturación B2B',
    diseño: 'clasica',
    logoUrlOpcional: 'https://example.com/logo-corporativo.png',
    colorPrimarioOpcional: '#1E40AF',
    camposOpcionales: [
      {
        id: 'campo_008',
        nombreCampo: 'Número de orden',
        tipo: 'texto'
      },
      {
        id: 'campo_009',
        nombreCampo: 'Centro de coste',
        tipo: 'texto'
      },
      {
        id: 'campo_010',
        nombreCampo: 'Requiere aprobación',
        tipo: 'boolean',
        valorPorDefectoOpcional: false
      }
    ],
    textoLegalOpcional: 'Factura corporativa. Condiciones de pago según acuerdo comercial.',
    esPorDefecto: false
  }
];

// ============================================================================
// FUNCIONES DE API
// ============================================================================

/**
 * Obtiene todas las plantillas de factura disponibles
 * 
 * @returns Promise<PlantillaFactura[]> Lista de todas las plantillas
 * 
 * @example
 * // En PlantillasFactura.tsx:
 * const plantillas = await getPlantillasFactura();
 * setPlantillas(plantillas);
 * 
 * // En CreadorFactura.tsx:
 * const plantillas = await getPlantillasFactura();
 * const plantillaPorDefecto = plantillas.find(p => p.esPorDefecto);
 * // Usar plantillaPorDefecto si no se selecciona otra
 */
export async function getPlantillasFactura(): Promise<PlantillaFactura[]> {
  // Simular delay de red
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Retornar copia del array para evitar mutaciones
  return [...mockPlantillas];
}

/**
 * Crea una nueva plantilla de factura
 * 
 * @param data Datos de la plantilla a crear (sin id, se genera automáticamente)
 * @returns Promise<PlantillaFactura> La plantilla creada con id
 * 
 * @example
 * // En PlantillasFactura.tsx:
 * const nuevaPlantilla = await crearPlantillaFactura({
 *   nombre: 'Mi Plantilla Personalizada',
 *   descripcion: 'Descripción de la plantilla',
 *   diseño: 'minimal',
 *   camposOpcionales: [...],
 *   esPorDefecto: false
 * });
 * // Recargar lista de plantillas
 */
export async function crearPlantillaFactura(
  data: Omit<PlantillaFactura, 'id'>
): Promise<PlantillaFactura> {
  // Simular delay de red
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Validar datos básicos
  if (!data.nombre || !data.diseño) {
    throw new Error('La plantilla debe tener un nombre y un diseño definido');
  }
  
  // Si se establece como por defecto, desactivar las demás
  if (data.esPorDefecto) {
    mockPlantillas.forEach(p => {
      p.esPorDefecto = false;
    });
  }
  
  // Crear nueva plantilla
  const nuevaPlantilla: PlantillaFactura = {
    ...data,
    id: `plantilla_${Date.now()}`,
    camposOpcionales: data.camposOpcionales || []
  };
  
  // Agregar al array mock
  mockPlantillas.push(nuevaPlantilla);
  
  return nuevaPlantilla;
}

/**
 * Actualiza una plantilla de factura existente
 * 
 * @param id ID de la plantilla a actualizar
 * @param cambios Objeto con los campos a actualizar (parcial)
 * @returns Promise<PlantillaFactura> La plantilla actualizada
 * 
 * @example
 * // En PlantillasFactura.tsx:
 * const plantillaActualizada = await actualizarPlantillaFactura('plantilla_001', {
 *   colorPrimarioOpcional: '#FF5733',
 *   camposOpcionales: [...nuevosCampos]
 * });
 * // Recargar lista de plantillas
 */
export async function actualizarPlantillaFactura(
  id: string,
  cambios: Partial<Omit<PlantillaFactura, 'id'>>
): Promise<PlantillaFactura> {
  // Simular delay de red
  await new Promise(resolve => setTimeout(resolve, 400));
  
  // Buscar la plantilla
  const index = mockPlantillas.findIndex(p => p.id === id);
  if (index === -1) {
    throw new Error(`Plantilla con ID ${id} no encontrada`);
  }
  
  // Si se establece como por defecto, desactivar las demás
  if (cambios.esPorDefecto === true) {
    mockPlantillas.forEach((p, i) => {
      if (i !== index) {
        p.esPorDefecto = false;
      }
    });
  }
  
  // Aplicar cambios
  mockPlantillas[index] = {
    ...mockPlantillas[index],
    ...cambios,
    camposOpcionales: cambios.camposOpcionales !== undefined 
      ? cambios.camposOpcionales 
      : mockPlantillas[index].camposOpcionales
  };
  
  return mockPlantillas[index];
}

/**
 * Establece una plantilla como la predeterminada del sistema
 * 
 * @param id ID de la plantilla a establecer como predeterminada
 * @returns Promise<PlantillaFactura> La plantilla establecida como predeterminada
 * 
 * @example
 * // En PlantillasFactura.tsx:
 * const plantillaPorDefecto = await establecerPlantillaPorDefecto('plantilla_002');
 * // Esta plantilla se usará automáticamente al crear nuevas facturas
 * // si no se especifica otra plantilla
 */
export async function establecerPlantillaPorDefecto(id: string): Promise<PlantillaFactura> {
  // Simular delay de red
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // Buscar la plantilla
  const index = mockPlantillas.findIndex(p => p.id === id);
  if (index === -1) {
    throw new Error(`Plantilla con ID ${id} no encontrada`);
  }
  
  // Desactivar todas las demás plantillas como predeterminadas
  mockPlantillas.forEach((p, i) => {
    p.esPorDefecto = i === index;
  });
  
  return mockPlantillas[index];
}

/**
 * Elimina una plantilla de factura
 * 
 * @param id ID de la plantilla a eliminar
 * @returns Promise<void>
 * 
 * @example
 * // En PlantillasFactura.tsx:
 * await eliminarPlantillaFactura('plantilla_001');
 * // Recargar lista de plantillas
 */
export async function eliminarPlantillaFactura(id: string): Promise<void> {
  // Simular delay de red
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // Buscar la plantilla
  const index = mockPlantillas.findIndex(p => p.id === id);
  if (index === -1) {
    throw new Error(`Plantilla con ID ${id} no encontrada`);
  }
  
  // No permitir eliminar la plantilla por defecto
  if (mockPlantillas[index].esPorDefecto) {
    throw new Error('No se puede eliminar la plantilla por defecto. Establece otra plantilla como predeterminada primero.');
  }
  
  // Eliminar la plantilla
  mockPlantillas.splice(index, 1);
}

