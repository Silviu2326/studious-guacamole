# Recepciones de Material

Sistema completo de gestión de recepciones de material para gimnasios. Permite registrar las entregas de proveedores, verificar que coinciden con las órdenes de compra y gestionar discrepancias.

## Características Principales

### 📦 Gestión de Recepciones
- **Registro de Nuevas Recepciones**: Vinculación automática con órdenes de compra
- **Verificación de Productos**: Control de cantidades recibidas vs esperadas
- **Gestión de Discrepancias**: Marcado de items dañados, faltantes o correctos
- **Notas Detalladas**: Documentación de incidencias

### 📊 Métricas y Reportes
- Total de recepciones
- Recepciones completadas
- Recepciones parciales
- Recepciones con discrepancias

### 🔍 Búsqueda y Filtros
- Filtro por proveedor
- Filtro por estado (completadas, parciales, pendientes)
- Filtro por rango de fechas
- Búsqueda por orden de compra

### 📋 Vista Detallada
- Detalle completo de cada recepción
- Listado de todos los items recibidos
- Condición de cada item
- Notas y observaciones

## Estructura del Módulo

```
recepciones-de-material/
├── api/                        # Servicios de API
│   ├── receptionsApi.ts        # API principal de recepciones
│   └── index.ts               # Exportaciones
├── components/                 # Componentes React
│   ├── ReceptionsDashboard.tsx # Dashboard principal
│   ├── ReceptionsTable.tsx     # Tabla de recepciones
│   ├── NewReceptionModal.tsx   # Modal nueva recepción
│   └── index.ts               # Exportaciones
├── pages/                      # Páginas
│   └── recepciones-de-materialPage.tsx
├── types/                      # Tipos TypeScript
│   └── index.ts
└── README.md                   # Este archivo
```

## Componentes Principales

### ReceptionsDashboard
Dashboard principal que orquesta:
- Obtención y gestión de datos
- Filtros y búsqueda
- Paginación
- Métricas en tiempo real
- Modales de creación y detalles

### ReceptionsTable
Tabla presentacional que muestra:
- Listado de recepciones
- Información básica (fecha, proveedor, estado, total)
- Acciones (ver detalles)
- Estados visuales con badges

### NewReceptionModal
Modal container para registrar nuevas recepciones:
- Búsqueda de órdenes de compra
- Carga automática de items esperados
- Ajuste de cantidades recibidas
- Gestión de discrepancias
- Validación de datos

## APIs Mock

### GET /receptions
Obtiene lista paginada de recepciones con filtros.

**Parámetros:**
- `filters`: ReceptionFilters (proveedor, estado, fechas)
- `page`: número de página
- `limit`: resultados por página

**Respuesta:**
```typescript
{
  data: Reception[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  };
}
```

### GET /receptions/:id
Obtiene detalles completos de una recepción específica.

### POST /receptions
Crea una nueva recepción y actualiza el inventario.

**Body:**
```typescript
{
  purchaseOrderId: string;
  receptionDate: string;
  notes?: string;
  receivedItems: ReceivedItemForm[];
}
```

### GET /purchase-orders/pending
Obtiene órdenes de compra pendientes de recibir.

### GET /suppliers
Obtiene lista de proveedores para filtros.

## Tipos Principales

```typescript
interface Reception {
  id: string;
  receptionDate: string;
  status: 'completed' | 'partial' | 'pending';
  purchaseOrderId: string;
  supplier: Supplier;
  receivedItems: ReceivedItem[];
  notes?: string;
  createdBy: User;
  discrepancyCount?: number;
}

interface ReceivedItem {
  productId: string;
  productName: string;
  quantityExpected: number;
  quantityReceived: number;
  condition: 'ok' | 'damaged' | 'missing';
  notes?: string;
}
```

## Uso de Componentes Reutilizables

Este módulo utiliza los siguientes componentes de `componentsreutilizables`:
- `Button`: Botones de acción
- `Modal`: Modales de creación y detalles
- `Table`: Tabla de datos
- `Input`: Campos de entrada
- `Select`: Selectores desplegables
- `Textarea`: Campos de texto largo
- `Card`: Contenedores de información
- `Badge`: Etiquetas de estado
- `MetricCards`: Tarjetas de métricas

## Ruta

Este módulo está disponible en la ruta:
- `/inventario/recepciones`

## Accesibilidad

- **Rol**: Solo gimnasio (no entrenadores)
- Se muestra en el Sidebar bajo la sección de Inventario
- Icono: PackageIn (lucide-react)

## Consideraciones Técnicas

- Estado de cargando: Spinners mientras se obtienen datos
- Validación de formularios: Verificación de cantidades y condiciones
- Gestión de errores: Manejo de errores de API
- Paginación: 10 items por página
- Búsqueda en tiempo real: Debounce de 300ms para búsqueda de POs

## Flujo de Uso

1. **Acceso**: Usuario accede a Recepciones de Material desde el sidebar
2. **Visualización**: Ve lista de recepciones existentes con métricas
3. **Búsqueda/Filtros**: Aplica filtros si es necesario
4. **Registro**: Click en "Nueva Recepción"
5. **Búsqueda OC**: Busca y selecciona orden de compra
6. **Verificación**: Ajusta cantidades y marca discrepancias
7. **Confirmación**: Confirma recepción y el sistema actualiza stock
8. **Detalles**: Puede ver detalles completos de cualquier recepción

## Próximas Mejoras

- [ ] Exportar recepciones a CSV/PDF
- [ ] Adjuntar fotografías de discrepancias
- [ ] Notificaciones a proveedores sobre discrepancias
- [ ] Reversión de recepciones (requiere permisos especiales)
- [ ] Recepciones sin orden de compra (recepciones ciegas)
- [ ] Manejo de sustituciones de productos

