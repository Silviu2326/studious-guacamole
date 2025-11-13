import {
  ProveedorExterno,
  RecursoProveedorExterno,
  ResultadoBusquedaProveedor,
  RecursoBiblioteca,
  TipoRecurso,
} from '../types';

// Mock de proveedores externos - en producción vendría de la API
const proveedoresMock: ProveedorExterno[] = [
  {
    id: 'proveedor-1',
    nombre: 'Marketplace Nutricional Certificado',
    tipo: 'marketplace',
    descripcion: 'Marketplace con recetas certificadas por nutricionistas',
    url: 'https://marketplace-nutricional.com',
    activo: true,
    recursosImportados: 45,
    ultimaSincronizacion: '2024-12-20T10:00:00Z',
    creadoEn: '2024-01-15T10:00:00Z',
    actualizadoEn: '2024-12-20T10:00:00Z',
  },
  {
    id: 'proveedor-2',
    nombre: 'Ingredientes de Temporada API',
    tipo: 'api',
    descripcion: 'API con ingredientes de temporada y recetas sostenibles',
    url: 'https://api-temporada.com',
    activo: true,
    recursosImportados: 32,
    ultimaSincronizacion: '2024-12-19T15:30:00Z',
    creadoEn: '2024-02-10T10:00:00Z',
    actualizadoEn: '2024-12-19T15:30:00Z',
  },
  {
    id: 'proveedor-3',
    nombre: 'Recetas Sostenibles Pro',
    tipo: 'marketplace',
    descripcion: 'Marketplace especializado en recetas con huella de carbono certificada',
    url: 'https://recetas-sostenibles.com',
    activo: false,
    recursosImportados: 0,
    creadoEn: '2024-03-20T10:00:00Z',
    actualizadoEn: '2024-03-20T10:00:00Z',
  },
];

// Mock de recursos de proveedores externos
const recursosProveedoresMock: Record<string, RecursoProveedorExterno[]> = {
  'proveedor-1': [
    {
      id: 'ext-receta-1',
      proveedorId: 'proveedor-1',
      nombre: 'Ensalada Mediterránea Certificada',
      descripcion: 'Ensalada certificada con ingredientes de temporada',
      tipo: 'receta',
      macros: {
        calorias: 280,
        proteinas: 12,
        carbohidratos: 30,
        grasas: 14,
      },
      costeEstimado: 3.5,
      huellaCarbono: 0.8,
      certificado: true,
      ingredientesTemporada: true,
      imagenUrl: 'https://example.com/ensalada.jpg',
      enlace: 'https://marketplace-nutricional.com/receta/1',
    },
    {
      id: 'ext-receta-2',
      proveedorId: 'proveedor-1',
      nombre: 'Bowl de Quinoa y Verduras',
      descripcion: 'Receta certificada vegana con ingredientes de temporada',
      tipo: 'receta',
      macros: {
        calorias: 350,
        proteinas: 15,
        carbohidratos: 45,
        grasas: 12,
      },
      costeEstimado: 4.2,
      huellaCarbono: 0.6,
      certificado: true,
      ingredientesTemporada: true,
      imagenUrl: 'https://example.com/quinoa.jpg',
      enlace: 'https://marketplace-nutricional.com/receta/2',
    },
  ],
  'proveedor-2': [
    {
      id: 'ext-ingrediente-1',
      proveedorId: 'proveedor-2',
      nombre: 'Tomate de Temporada',
      descripcion: 'Tomate ecológico de temporada',
      tipo: 'alimento',
      macros: {
        calorias: 20,
        proteinas: 1,
        carbohidratos: 4,
        grasas: 0,
      },
      costeEstimado: 2.5,
      huellaCarbono: 0.2,
      certificado: false,
      ingredientesTemporada: true,
      enlace: 'https://api-temporada.com/ingrediente/1',
    },
    {
      id: 'ext-receta-3',
      proveedorId: 'proveedor-2',
      nombre: 'Sopa de Verduras de Temporada',
      descripcion: 'Sopa con ingredientes locales de temporada',
      tipo: 'receta',
      macros: {
        calorias: 150,
        proteinas: 5,
        carbohidratos: 25,
        grasas: 4,
      },
      costeEstimado: 2.8,
      huellaCarbono: 0.4,
      certificado: false,
      ingredientesTemporada: true,
      enlace: 'https://api-temporada.com/receta/3',
    },
  ],
};

/**
 * Obtiene todos los proveedores externos configurados
 */
export async function getProveedoresExternos(): Promise<ProveedorExterno[]> {
  await new Promise((resolve) => setTimeout(resolve, 300));
  return [...proveedoresMock];
}

/**
 * Obtiene un proveedor externo por ID
 */
export async function getProveedorExternoPorId(
  id: string
): Promise<ProveedorExterno | null> {
  await new Promise((resolve) => setTimeout(resolve, 200));
  return proveedoresMock.find((p) => p.id === id) || null;
}

/**
 * Busca recursos en un proveedor externo
 */
export async function buscarRecursosEnProveedor(
  proveedorId: string,
  busqueda?: string,
  soloCertificados?: boolean,
  soloTemporada?: boolean,
  pagina: number = 1,
  limite: number = 20
): Promise<ResultadoBusquedaProveedor> {
  await new Promise((resolve) => setTimeout(resolve, 500));

  const proveedor = proveedoresMock.find((p) => p.id === proveedorId);
  if (!proveedor) {
    throw new Error('Proveedor no encontrado');
  }

  let recursos = recursosProveedoresMock[proveedorId] || [];

  // Filtrar por búsqueda
  if (busqueda) {
    const busquedaLower = busqueda.toLowerCase();
    recursos = recursos.filter(
      (r) =>
        r.nombre.toLowerCase().includes(busquedaLower) ||
        r.descripcion?.toLowerCase().includes(busquedaLower)
    );
  }

  // Filtrar por certificados
  if (soloCertificados) {
    recursos = recursos.filter((r) => r.certificado);
  }

  // Filtrar por temporada
  if (soloTemporada) {
    recursos = recursos.filter((r) => r.ingredientesTemporada);
  }

  const total = recursos.length;
  const totalPaginas = Math.ceil(total / limite);
  const inicio = (pagina - 1) * limite;
  const fin = inicio + limite;
  const recursosPagina = recursos.slice(inicio, fin);

  return {
    proveedor,
    recursos: recursosPagina,
    total,
    pagina,
    totalPaginas,
  };
}

/**
 * Importa un recurso desde un proveedor externo a la biblioteca
 */
export async function importarRecursoDesdeProveedor(
  proveedorId: string,
  recursoId: string,
  creadoPor?: string
): Promise<RecursoBiblioteca> {
  await new Promise((resolve) => setTimeout(resolve, 400));

  const recursos = recursosProveedoresMock[proveedorId] || [];
  const recursoExterno = recursos.find((r) => r.id === recursoId);

  if (!recursoExterno) {
    throw new Error('Recurso no encontrado en el proveedor');
  }

  // Convertir recurso externo a RecursoBiblioteca
  const recursoImportado: RecursoBiblioteca = {
    id: `importado-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    tipo: recursoExterno.tipo,
    nombre: recursoExterno.nombre,
    descripcion: recursoExterno.descripcion,
    macros: recursoExterno.macros || {
      calorias: 0,
      proteinas: 0,
      carbohidratos: 0,
      grasas: 0,
    },
    costeEstimado: recursoExterno.costeEstimado,
    huellaCarbono: recursoExterno.huellaCarbono,
    proveedorExterno: proveedorId,
    certificado: recursoExterno.certificado,
    ingredientesTemporada: recursoExterno.ingredientesTemporada,
    imagenUrl: recursoExterno.imagenUrl,
    favorito: false,
    tags: [
      ...(recursoExterno.certificado ? ['Certificado'] : []),
      ...(recursoExterno.ingredientesTemporada ? ['Temporada'] : []),
      'Importado',
    ],
    creadoEn: new Date().toISOString(),
    actualizadoEn: new Date().toISOString(),
    creadoPor: creadoPor || 'user-import',
  };

  // En producción, esto guardaría en la base de datos
  return recursoImportado;
}

/**
 * Sincroniza recursos desde un proveedor externo
 */
export async function sincronizarProveedor(
  proveedorId: string
): Promise<{ recursosNuevos: number; recursosActualizados: number }> {
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const proveedor = proveedoresMock.find((p) => p.id === proveedorId);
  if (!proveedor) {
    throw new Error('Proveedor no encontrado');
  }

  // En producción, esto sincronizaría con la API del proveedor
  // Por ahora, simulamos una sincronización
  const recursosNuevos = Math.floor(Math.random() * 5) + 1;
  const recursosActualizados = Math.floor(Math.random() * 3);

  // Actualizar última sincronización
  proveedor.ultimaSincronizacion = new Date().toISOString();
  proveedor.recursosImportados = (proveedor.recursosImportados || 0) + recursosNuevos;

  return {
    recursosNuevos,
    recursosActualizados,
  };
}

/**
 * Conecta un nuevo proveedor externo
 */
export async function conectarProveedor(
  datos: Omit<ProveedorExterno, 'id' | 'creadoEn' | 'actualizadoEn' | 'recursosImportados'>
): Promise<ProveedorExterno> {
  await new Promise((resolve) => setTimeout(resolve, 500));

  const nuevoProveedor: ProveedorExterno = {
    ...datos,
    id: `proveedor-${Date.now()}`,
    recursosImportados: 0,
    creadoEn: new Date().toISOString(),
    actualizadoEn: new Date().toISOString(),
  };

  proveedoresMock.push(nuevoProveedor);
  return nuevoProveedor;
}

/**
 * Actualiza la configuración de un proveedor
 */
export async function actualizarProveedor(
  id: string,
  datos: Partial<ProveedorExterno>
): Promise<ProveedorExterno | null> {
  await new Promise((resolve) => setTimeout(resolve, 300));

  const proveedor = proveedoresMock.find((p) => p.id === id);
  if (!proveedor) return null;

  Object.assign(proveedor, {
    ...datos,
    actualizadoEn: new Date().toISOString(),
  });

  return proveedor;
}

/**
 * Desactiva un proveedor externo
 */
export async function desactivarProveedor(id: string): Promise<boolean> {
  await new Promise((resolve) => setTimeout(resolve, 200));

  const proveedor = proveedoresMock.find((p) => p.id === id);
  if (!proveedor) return false;

  proveedor.activo = false;
  proveedor.actualizadoEn = new Date().toISOString();
  return true;
}

