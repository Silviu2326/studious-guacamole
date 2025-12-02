import { BonoRegaloB2B, CrearBonoRegaloB2BRequest, Producto, Bono } from '../types';
import { getProductos } from './productos';
import { createBonoFromCheckout } from './bonos';
import { crearBono } from './bonos';

// Mock data para bonos B2B
const BONOS_B2B_MOCK: BonoRegaloB2B[] = [];

/**
 * Crea bonos regalo personalizados para empresas (B2B)
 */
export async function crearBonoRegaloB2B(
  request: CrearBonoRegaloB2BRequest,
  entrenadorId: string
): Promise<BonoRegaloB2B> {
  await new Promise((resolve) => setTimeout(resolve, 500));

  // Obtener información del producto
  const productos = await getProductos();
  const producto = productos.find((p) => p.id === request.productoId);

  if (!producto) {
    throw new Error('Producto no encontrado');
  }

  // Calcular valor por bono (usar el especificado o el precio del producto)
  const valorPorBono = request.valorPorBono || producto.precio;

  // Generar códigos únicos para cada bono
  const codigosBonos: string[] = [];
  const bonosGenerados: string[] = [];

  for (let i = 0; i < request.cantidadBonos; i++) {
    const codigo = `B2B-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
    codigosBonos.push(codigo);

    // Crear bono individual usando la API existente
    try {
      const bono = await createBonoFromCheckout({
        clienteId: `empresa-${request.empresaNombre.toLowerCase().replace(/\s+/g, '-')}`,
        clienteNombre: request.empresaNombre,
        clienteEmail: request.empresaEmail,
        productoId: request.productoId,
        productoNombre: producto.nombre,
        sesionesTotal: producto.metadatos?.sesiones || 1,
        precio: valorPorBono,
        fechaVencimiento: request.fechaVencimiento,
        ventaId: `B2B-${Date.now()}`,
      });
      bonosGenerados.push(bono.id);
    } catch (error) {
      console.error(`Error creando bono ${i + 1}:`, error);
    }
  }

  const nuevoBonoB2B: BonoRegaloB2B = {
    id: `b2b-${Date.now()}`,
    empresaNombre: request.empresaNombre,
    empresaEmail: request.empresaEmail,
    empresaTelefono: request.empresaTelefono,
    empresaCIF: request.empresaCIF,
    entrenadorId,
    productoId: request.productoId,
    producto,
    cantidadBonos: request.cantidadBonos,
    valorPorBono,
    fechaVencimiento: request.fechaVencimiento,
    personalizacion: request.personalizacion,
    fechaCreacion: new Date(),
    estado: 'generado',
    bonosGenerados,
    codigosBonos,
  };

  BONOS_B2B_MOCK.push(nuevoBonoB2B);
  return nuevoBonoB2B;
}

/**
 * Obtiene todos los bonos B2B de un entrenador
 */
export async function getBonosB2B(entrenadorId: string): Promise<BonoRegaloB2B[]> {
  await new Promise((resolve) => setTimeout(resolve, 300));
  return BONOS_B2B_MOCK.filter((b) => b.entrenadorId === entrenadorId);
}

/**
 * Obtiene un bono B2B por ID
 */
export async function getBonoB2BById(bonoId: string): Promise<BonoRegaloB2B | null> {
  await new Promise((resolve) => setTimeout(resolve, 200));
  return BONOS_B2B_MOCK.find((b) => b.id === bonoId) || null;
}

/**
 * Actualiza el estado de un bono B2B
 */
export async function actualizarEstadoBonoB2B(
  bonoId: string,
  estado: BonoRegaloB2B['estado']
): Promise<BonoRegaloB2B> {
  await new Promise((resolve) => setTimeout(resolve, 300));

  const bono = BONOS_B2B_MOCK.find((b) => b.id === bonoId);
  if (!bono) {
    throw new Error('Bono B2B no encontrado');
  }

  bono.estado = estado;
  return bono;
}

// ============================================================================
// API MOCK DE BONOS B2B CORPORATIVOS (CHECKOUT)
// ============================================================================

/**
 * Crea un lote de bonos B2B para una empresa
 */
export async function crearLoteBonosB2B(
  payload: { empresa: string; cantidad: number; valorPorBono: number }
): Promise<Bono[]> {
  await new Promise((resolve) => setTimeout(resolve, 500));

  const bonosCreados: Bono[] = [];
  const fechaCaducidad = new Date();
  fechaCaducidad.setFullYear(fechaCaducidad.getFullYear() + 1); // Caducidad en 1 año por defecto

  // Obtener referencia a los bonos mock para actualizarlos
  const { getAllBonosCheckout } = await import('./bonos');

  for (let i = 0; i < payload.cantidad; i++) {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 9).toUpperCase();
    const codigo = `B2B-${payload.empresa.toUpperCase().replace(/\s+/g, '-')}-${timestamp}-${random}`;

    try {
      const bono = await crearBono({
        codigo,
        tipo: 'regalo',
        saldoInicial: payload.valorPorBono,
        saldoRestante: payload.valorPorBono,
        fechaCaducidadOpcional: fechaCaducidad,
        esB2BOpcional: true,
      });

      // Agregar información de empresa al bono en el mock
      const todosLosBonos = await getAllBonosCheckout();
      const bonoEnMock = todosLosBonos.find((b) => b.id === bono.id);
      if (bonoEnMock) {
        (bonoEnMock as any).empresaOpcional = payload.empresa;
      }

      bonosCreados.push(bono);
    } catch (error) {
      console.error(`Error creando bono ${i + 1} del lote:`, error);
    }
  }

  return bonosCreados;
}

// Función auxiliar para obtener todos los bonos B2B
async function getAllBonosB2BCheckout(): Promise<Array<Bono & { empresaOpcional?: string }>> {
  const { getAllBonosCheckout } = await import('./bonos');
  const todosLosBonos = await getAllBonosCheckout();
  return todosLosBonos
    .filter((b) => b.esB2BOpcional)
    .map((b) => ({ ...b, empresaOpcional: (b as any).empresaOpcional }));
}

/**
 * Obtiene todos los bonos B2B de una empresa específica
 */
export async function getBonosB2BPorEmpresa(nombreEmpresa: string): Promise<Bono[]> {
  await new Promise((resolve) => setTimeout(resolve, 300));

  const nombreEmpresaNormalizado = nombreEmpresa.toUpperCase().replace(/\s+/g, '-');
  
  // Obtener todos los bonos B2B
  const todosLosBonosB2B = await getAllBonosB2BCheckout();
  
  // Filtrar bonos B2B que pertenezcan a la empresa
  // Los bonos B2B tienen el nombre de la empresa en el código o en metadata
  return todosLosBonosB2B
    .filter((bono) => {
      // Buscar por nombre de empresa en el código
      const codigoNormalizado = bono.codigo.toUpperCase();
      const coincideEnCodigo = codigoNormalizado.includes(nombreEmpresaNormalizado) || 
                              codigoNormalizado.includes(nombreEmpresa.toUpperCase().replace(/\s+/g, '-'));
      
      // Buscar por metadata empresaOpcional
      const coincideEnMetadata = bono.empresaOpcional && 
                                  bono.empresaOpcional.toLowerCase() === nombreEmpresa.toLowerCase();
      
      return coincideEnCodigo || coincideEnMetadata;
    })
    .map(({ empresaOpcional, ...bono }) => bono);
}

