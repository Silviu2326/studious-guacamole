# Catálogo de Productos - Módulo FitOffice

## Descripción

El módulo de Catálogo de Productos permite a los gimnasios gestionar su inventario completo de productos disponibles para la venta, incluyendo suplementos, ropa deportiva, accesorios, merchandising y bebidas.

## Características Principales

### 🛍️ Gestión de Productos
- **CRUD Completo**: Crear, leer, actualizar y eliminar productos
- **Duplicación**: Clonar productos existentes para agilizar la creación
- **Estados**: Productos activos/inactivos y destacados
- **Información Detallada**: Nombre, descripción, SKU, marca, proveedor
- **Especificaciones**: Campos personalizables para características específicas
- **Tags**: Sistema de etiquetado para mejor organización

### 📦 Control de Inventario
- **Stock en Tiempo Real**: Seguimiento de cantidades disponibles
- **Stock Mínimo**: Configuración de umbrales de alerta
- **Movimientos**: Historial completo de entradas, salidas y ajustes
- **Alertas Automáticas**: Notificaciones de stock bajo y sin stock
- **Unidades de Medida**: Soporte para diferentes tipos (unidad, kg, litro, etc.)

### 🏷️ Sistema de Categorías
- **Categorías Jerárquicas**: Categorías principales y subcategorías
- **Personalización Visual**: Iconos y colores personalizados
- **Organización**: Orden configurable de categorías
- **Contadores**: Cantidad de productos por categoría

### 🔍 Búsqueda y Filtros Avanzados
- **Búsqueda Global**: Por nombre, descripción, SKU o tags
- **Filtros Múltiples**: Por categoría, precio, stock, estado, marca
- **Ordenamiento**: Por diferentes campos (nombre, precio, stock, fecha)
- **Paginación**: Navegación eficiente para grandes catálogos

### 📊 Estadísticas y Reportes
- **Métricas Generales**: Total de productos, activos, sin stock
- **Valor de Inventario**: Cálculo automático del valor total
- **Análisis de Categorías**: Identificación de categorías principales
- **Movimientos Recientes**: Historial de cambios en el inventario

## Estructura del Módulo

```
catalogo-productos/
├── components/           # Componentes React
│   ├── CatalogoProductos.tsx    # Componente principal
│   ├── ProductoCard.tsx         # Tarjeta de producto
│   ├── ProductoModal.tsx        # Modal crear/editar
│   ├── FiltrosProductos.tsx     # Sistema de filtros
│   ├── GestorCategorias.tsx     # Gestión de categorías
│   ├── EstadisticasProductos.tsx # Dashboard de estadísticas
│   └── index.ts                 # Exportaciones
├── hooks/               # Hooks personalizados
│   └── useProductos.ts          # Hook principal de productos
├── services/            # Servicios de datos
│   └── productosService.ts      # API y lógica de negocio
├── types/               # Definiciones TypeScript
│   └── index.ts                 # Tipos e interfaces
├── data/                # Datos de prueba
│   └── mockData.ts              # Datos mock para desarrollo
├── page.tsx             # Página principal con tabs
├── index.ts             # Exportaciones del módulo
└── README.md            # Esta documentación
```

## Componentes Principales

### CatalogoProductos
Componente principal que integra:
- Lista de productos con vista grid/lista
- Sistema de filtros y búsqueda
- Paginación
- Acciones CRUD
- Modales de confirmación

### ProductoCard
Tarjeta individual de producto que muestra:
- Imagen del producto
- Información básica (nombre, precio, stock)
- Estados visuales (destacado, activo, stock)
- Acciones rápidas (ver, editar, duplicar, eliminar)

### ProductoModal
Modal completo para crear/editar productos:
- Formulario con validación
- Gestión de imágenes
- Tags dinámicos
- Especificaciones personalizables
- Estados y configuración

### FiltrosProductos
Sistema avanzado de filtros:
- Búsqueda por texto
- Filtros por categoría, precio, stock
- Filtros avanzados colapsables
- Contador de resultados

### GestorCategorias
Gestión completa de categorías:
- CRUD de categorías
- Personalización visual (iconos, colores)
- Vista previa en tiempo real
- Organización jerárquica

### EstadisticasProductos
Dashboard con métricas clave:
- Tarjetas de estadísticas principales
- Alertas de stock en tiempo real
- Movimientos recientes
- Resumen ejecutivo

## Hooks Personalizados

### useProductos
Hook principal que maneja:
- Estado de productos y categorías
- Operaciones CRUD
- Filtros y ordenamiento
- Paginación
- Manejo de errores

### useEstadisticasProductos
Hook para estadísticas:
- Carga de métricas generales
- Cálculos automáticos
- Actualización en tiempo real

### useStock
Hook para gestión de inventario:
- Movimientos de stock
- Alertas automáticas
- Actualización de cantidades

## Tipos de Datos

### Producto
```typescript
interface Producto {
  id: string;
  nombre: string;
  descripcion: string;
  precio: number;
  categoria: string;
  stock: number;
  stockMinimo: number;
  sku: string;
  imagenes: string[];
  activo: boolean;
  destacado: boolean;
  // ... más campos
}
```

### Categoria
```typescript
interface Categoria {
  id: string;
  nombre: string;
  descripcion: string;
  icono: string;
  color: string;
  activa: boolean;
  subcategorias?: Categoria[];
  cantidadProductos: number;
}
```

## Categorías Predefinidas

El módulo incluye categorías específicas para gimnasios:

1. **Suplementos** 🟢
   - Proteínas
   - Pre-entrenos
   - Vitaminas
   - Creatina
   - BCAA

2. **Ropa Deportiva** 🔵
   - Camisetas
   - Pantalones
   - Shorts
   - Leggings
   - Sudaderas

3. **Accesorios** 🟡
   - Guantes
   - Cinturones
   - Vendas
   - Bandas elásticas
   - Cuerdas

4. **Merchandising** 🔴
   - Gorras
   - Botellas
   - Toallas
   - Mochilas
   - Productos con logo

5. **Bebidas** 🔵
   - Agua
   - Isotónicas
   - Batidos de proteína
   - Energéticas

## Integración

### Navegación
El módulo se integra en el sidebar principal, disponible solo para usuarios con rol de gimnasio.

### Rutas
- `/catalogo-productos` - Página principal con tabs
- Navegación interna por pestañas (Catálogo, Categorías, Estadísticas)

### Componentes Reutilizables
Utiliza los componentes del sistema de diseño:
- `Button` - Botones con variantes
- `Card` - Contenedores con elevación
- `Input` - Campos de entrada
- `Select` - Selectores dropdown
- `Modal` - Modales y confirmaciones
- `Tabs` - Navegación por pestañas

## Funcionalidades Futuras

### Próximas Mejoras
- [ ] Integración con sistema de ventas
- [ ] Códigos de barras y QR
- [ ] Importación/exportación de productos
- [ ] Integración con proveedores
- [ ] Sistema de descuentos avanzado
- [ ] Reportes de rotación de inventario
- [ ] Notificaciones push para alertas
- [ ] API REST completa
- [ ] Sincronización con sistemas externos

### Optimizaciones Técnicas
- [ ] Lazy loading de imágenes
- [ ] Virtualización para listas grandes
- [ ] Cache inteligente
- [ ] Búsqueda con debounce
- [ ] Optimistic updates
- [ ] Service Worker para offline

## Uso

### Acceso al Módulo
1. Iniciar sesión como usuario de gimnasio
2. Navegar a "Catálogo de Productos" en el sidebar
3. Explorar las tres pestañas disponibles

### Gestión de Productos
1. **Crear Producto**: Botón "Nuevo Producto" → Completar formulario
2. **Editar Producto**: Clic en "Editar" en la tarjeta → Modificar datos
3. **Ver Producto**: Clic en "Ver" para vista de solo lectura
4. **Duplicar**: Clic en icono de copia para clonar producto
5. **Eliminar**: Clic en icono de papelera → Confirmar eliminación

### Filtros y Búsqueda
1. **Búsqueda Rápida**: Escribir en el campo de búsqueda principal
2. **Filtros Avanzados**: Clic en "Filtros" → Configurar criterios
3. **Ordenamiento**: Seleccionar campo y dirección
4. **Vista**: Alternar entre grid y lista

### Gestión de Categorías
1. Ir a pestaña "Categorías"
2. **Crear**: Botón "Nueva Categoría" → Configurar nombre, icono, color
3. **Editar**: Clic en "Editar" en tarjeta de categoría
4. **Vista Previa**: Ver resultado en tiempo real

### Monitoreo de Stock
1. Ir a pestaña "Estadísticas"
2. Revisar métricas principales
3. Atender alertas de stock bajo
4. Consultar movimientos recientes

## Soporte

Para dudas o problemas con el módulo de Catálogo de Productos, consultar la documentación técnica o contactar al equipo de desarrollo.