# Compras — Diagnóstico funcional y de producto

## 1) Mapa de páginas de la sección

### Páginas principales

#### `/ordenes-de-compra` — Órdenes de Compra
- **Componente raíz**: `src/features/ordenes-de-compra/pages/ordenes-de-compraPage.tsx`
- **Componentes hijos**:
  - `PurchaseOrderTable` (`src/features/ordenes-de-compra/components/PurchaseOrderTable.tsx`) - Tabla de órdenes
  - `PurchaseOrderFormModal` (`src/features/ordenes-de-compra/components/PurchaseOrderFormModal.tsx`) - Modal de creación/edición
  - `OrderDetailModal` (`src/features/ordenes-de-compra/components/OrderDetailModal.tsx`) - Modal de detalles
  - `PurchaseOrderFilters` (`src/features/ordenes-de-compra/components/PurchaseOrderFilters.tsx`) - Filtros
  - `PurchaseOrderKPIs` (`src/features/ordenes-de-compra/components/PurchaseOrderKPIs.tsx`) - KPIs
- **API**: `src/features/ordenes-de-compra/api/index.ts`
- **Estados**:
  - Loading: `isLoading` state
  - Error: Manejo de errores en componentes
  - Vacío: No hay estado vacío explícito
- **Guardias**: No hay guardias explícitas (depende de Layout, sección `gimnasioOnly: true`)
- **Estados de orden**: DRAFT, PENDING_APPROVAL, APPROVED, REJECTED, ORDERED, PARTIALLY_RECEIVED, COMPLETED, CANCELLED
- **Métricas**: Pendientes de Aprobación, Valor Comprometido, Órdenes Completadas, Total de Órdenes

#### `/inventario/recepciones` — Recepciones de Material
- **Componente raíz**: `src/features/recepciones-de-material/pages/recepciones-de-materialPage.tsx`
- **Componentes hijos**:
  - `ReceptionsDashboard` (`src/features/recepciones-de-material/components/ReceptionsDashboard.tsx`) - Dashboard principal
  - `ReceptionsTable` (`src/features/recepciones-de-material/components/ReceptionsTable.tsx`) - Tabla de recepciones
  - `NewReceptionModal` (`src/features/recepciones-de-material/components/NewReceptionModal.tsx`) - Modal de nueva recepción
- **API**: `src/features/recepciones-de-material/api/receptionsApi.ts`
- **Estados**:
  - Loading: `isLoading` state
  - Error: Manejo de errores en componentes
  - Vacío: No hay estado vacío explícito
- **Guardias**: No hay guardias explícitas (depende de Layout, sección `gimnasioOnly: true`)
- **Estados de recepción**: completed, partial, pending
- **Métricas**: Total Recepciones, Completadas, Parciales, Con Discrepancias
- **Funcionalidades**: Vinculación con órdenes de compra, gestión de discrepancias (dañados, faltantes)

#### `/admin/operaciones/proveedores` — Proveedores & Contratos
- **Componente raíz**: `src/features/proveedores-contratos/pages/proveedores-contratosPage.tsx`
- **Componentes hijos**:
  - `SuppliersDashboardContainer` (`src/features/proveedores-contratos/components/SuppliersDashboardContainer.tsx`) - Container principal
  - `SuppliersTable` (`src/features/proveedores-contratos/components/SuppliersTable.tsx`) - Tabla de proveedores
  - `SupplierFormModal` (`src/features/proveedores-contratos/components/SupplierFormModal.tsx`) - Modal de creación/edición
- **API**: `src/features/proveedores-contratos/hooks/useSuppliers.ts`
- **Estados**:
  - Loading: `isLoading` state
  - Error: Manejo de errores en componentes
  - Vacío: No hay estado vacío explícito
- **Guardias**: Verificación explícita de rol (`user?.role !== 'entrenador'` redirige si es entrenador)
- **Estados de proveedor**: approved, pending_approval, rejected
- **Métricas**: Total Proveedores, Aprobados, Pendientes, Calificación Media
- **Funcionalidades**: Categorización de proveedores, proceso de homologación, gestión de contratos

#### `/operaciones/proveedores/evaluaciones` — Evaluación de Proveedores
- **Componente raíz**: `src/features/evaluacion-de-proveedores/pages/evaluacion-de-proveedoresPage.tsx`
- **Componentes hijos**:
  - `SupplierEvaluationDashboard` (`src/features/evaluacion-de-proveedores/components/SupplierEvaluationDashboard.tsx`) - Dashboard principal
  - `EvaluationsTable` (`src/features/evaluacion-de-proveedores/components/EvaluationsTable.tsx`) - Tabla de evaluaciones
  - `EvaluationFormModal` (`src/features/evaluacion-de-proveedores/components/EvaluationFormModal.tsx`) - Modal de creación/edición
- **API**: `src/features/evaluacion-de-proveedores/api/index.ts`
- **Estados**:
  - Loading: `isLoading` state
  - Error: Manejo de errores en componentes
  - Vacío: No hay estado vacío explícito
- **Guardias**: Verificación explícita de rol (`user?.role !== 'entrenador'` redirige si es entrenador)
- **Métricas**: Calificación Promedio, Evaluaciones Totales, Proveedores Evaluados, Tendencia
- **Funcionalidades**: Sistema de evaluación con criterios, estadísticas de rendimiento

#### `/finanzas/compras/historico-costes` — Histórico de Costes de Compra
- **Componente raíz**: `src/features/historico-de-costes-de-compra/pages/historico-de-costes-de-compraPage.tsx`
- **Componentes hijos**:
  - `CostHistoryDashboard` (`src/features/historico-de-costes-de-compra/components/CostHistoryDashboard.tsx`) - Dashboard principal
  - `CostFilterControls` (`src/features/historico-de-costes-de-compra/components/CostFilterControls.tsx`) - Controles de filtros
  - `PriceEvolutionChart` (`src/features/historico-de-costes-de-compra/components/PriceEvolutionChart.tsx`) - Gráfico de evolución de precios
  - `CostDataTable` (`src/features/historico-de-costes-de-compra/components/CostDataTable.tsx`) - Tabla de datos
- **API**: `src/features/historico-de-costes-de-compra/hooks/usePurchaseData.ts`, `api/index.ts`
- **Estados**:
  - Loading: `loading` state
  - Error: Manejo de errores en componentes
  - Vacío: No hay estado vacío explícito
- **Guardias**: No hay guardias explícitas (depende de Layout, sección `gimnasioOnly: true`)
- **Métricas**: Gasto Total, Coste Promedio, Variación de Precio
- **Funcionalidades**: Filtros por proveedor, categoría, producto, rango de fechas, exportación a CSV, gráficos de evolución

---

## 2) 10 problemas que hoy SÍ resuelve

### 1. **Gestión Completa de Órdenes de Compra con Flujo de Aprobación**
**Página(s)**: `/ordenes-de-compra` (Órdenes de Compra)

**Problema cubierto**: No hay forma de gestionar órdenes de compra con un flujo estructurado de aprobación y seguimiento de estados.

**Como lo resuelve el código**:
- `PurchaseOrderTable` muestra todas las órdenes con estados claros
- Estados múltiples: DRAFT, PENDING_APPROVAL, APPROVED, REJECTED, ORDERED, PARTIALLY_RECEIVED, COMPLETED, CANCELLED
- `PurchaseOrderFormModal` permite crear órdenes con múltiples items
- Sistema de auditoría con `audit_log` que registra todos los cambios
- Cambio de estado con validaciones
- Vista detallada de orden con `OrderDetailModal`
- Filtros por estado y búsqueda por proveedor/solicitante

**Riesgos/limitaciones**:
- Órdenes son mock (no hay persistencia real)
- No hay flujo de aprobación configurable (es hardcodeado)
- Falta notificación automática cuando orden requiere aprobación

### 2. **KPIs de Órdenes de Compra con Métricas Clave**
**Página(s)**: `/ordenes-de-compra` (Órdenes de Compra)

**Problema cubierto**: No hay forma de ver el estado general de las compras sin calcular métricas manualmente.

**Como lo resuelve el código**:
- `PurchaseOrderKPIs` calcula métricas automáticamente
- Métricas: Pendientes de Aprobación, Valor Comprometido (órdenes aprobadas pero no recibidas), Órdenes Completadas, Total de Órdenes
- Cálculo en tiempo real desde datos de órdenes
- Visualización clara con iconos y colores diferenciados

**Riesgos/limitaciones**:
- Métricas son mock (no hay datos reales)
- No hay comparación con períodos anteriores
- Falta desglose por proveedor o categoría

### 3. **Gestión de Recepciones de Material con Discrepancias**
**Página(s)**: `/inventario/recepciones` (Recepciones de Material)

**Problema cubierto**: No hay forma de registrar recepciones de material y gestionar discrepancias (dañados, faltantes) de forma estructurada.

**Como lo resuelve el código**:
- `ReceptionsDashboard` gestiona recepciones vinculadas a órdenes de compra
- `NewReceptionModal` permite crear recepciones seleccionando orden de compra
- Gestión de discrepancias: items dañados (`damaged`), faltantes (`missing`), correctos (`ok`)
- Comparación automática entre cantidad esperada y recibida
- Estados: completed, partial, pending
- Cálculo automático de `discrepancyCount`
- Métricas: Total Recepciones, Completadas, Parciales, Con Discrepancias

**Riesgos/limitaciones**:
- Recepciones son mock (no hay persistencia real)
- No hay actualización automática del estado de orden de compra cuando se recibe material
- Falta notificación automática cuando hay discrepancias críticas

### 4. **Vinculación de Recepciones con Órdenes de Compra**
**Página(s)**: `/inventario/recepciones` (Recepciones de Material)

**Problema cubierto**: No hay forma de vincular recepciones con órdenes de compra para mantener trazabilidad.

**Como lo resuelve el código**:
- `NewReceptionModal` permite seleccionar orden de compra pendiente
- Búsqueda de órdenes de compra pendientes
- Carga automática de items esperados desde orden de compra
- Vinculación bidireccional: recepción referencia orden, orden puede tener recepciones
- Visualización de referencia de orden en recepciones

**Riesgos/limitaciones**:
- Vinculación es mock (no hay sincronización real)
- No hay actualización automática del estado de orden cuando se recibe material
- Falta validación de que orden existe y está en estado válido

### 5. **Gestión de Proveedores con Proceso de Homologación**
**Página(s)**: `/admin/operaciones/proveedores` (Proveedores & Contratos)

**Problema cubierto**: No hay forma de gestionar proveedores con un proceso formal de homologación y aprobación.

**Como lo resuelve el código**:
- `SuppliersDashboardContainer` gestiona proveedores con estados: approved, pending_approval, rejected
- `SupplierFormModal` permite crear/editar proveedores con información completa
- Categorización de proveedores (ej: Equipamiento, Suplementos, Mantenimiento)
- Sistema de aprobación con estados claros
- Métricas: Total Proveedores, Aprobados, Pendientes, Calificación Media
- Filtros por categoría y estado
- Búsqueda de proveedores

**Riesgos/limitaciones**:
- Proveedores son mock (no hay persistencia real)
- No hay proceso de homologación estructurado (solo estados)
- Falta gestión de contratos y documentos asociados

### 6. **Sistema de Evaluación de Proveedores con Estadísticas**
**Página(s)**: `/operaciones/proveedores/evaluaciones` (Evaluación de Proveedores)

**Problema cubierto**: No hay forma de evaluar proveedores de forma sistemática para tomar decisiones informadas.

**Como lo resuelve el código**:
- `SupplierEvaluationDashboard` permite crear evaluaciones de proveedores
- `EvaluationFormModal` permite evaluar con criterios (calidad, precio, servicio, puntualidad)
- Sistema de calificación con puntuaciones
- Estadísticas agregadas: Calificación Promedio, Evaluaciones Totales, Proveedores Evaluados, Tendencia
- Historial de evaluaciones por proveedor
- Filtros por proveedor, fecha, calificación
- Búsqueda de evaluaciones

**Riesgos/limitaciones**:
- Evaluaciones son mock (no hay persistencia real)
- No hay criterios de evaluación estandarizados
- Falta comparación automática entre proveedores

### 7. **Análisis de Histórico de Costes con Gráficos y Exportación**
**Página(s)**: `/finanzas/compras/historico-costes` (Histórico de Costes de Compra)

**Problema cubierto**: No hay forma de analizar la evolución de costes de compra a lo largo del tiempo para optimizar gastos.

**Como lo resuelve el código**:
- `CostHistoryDashboard` muestra análisis completo de costes
- `PriceEvolutionChart` muestra gráfico de evolución de precios
- `CostDataTable` muestra datos detallados con precios, variaciones
- Filtros por proveedor, categoría, producto, rango de fechas
- Métricas: Gasto Total, Coste Promedio, Variación de Precio
- Exportación a CSV con todos los datos
- Comparación de períodos (variación porcentual)

**Riesgos/limitaciones**:
- Datos son mock (no hay datos reales de compras)
- No hay predicción de costes futuros
- Falta alertas cuando hay aumentos significativos de precio

### 8. **Filtrado y Búsqueda Avanzada de Órdenes de Compra**
**Página(s)**: `/ordenes-de-compra` (Órdenes de Compra)

**Problema cubierto**: No hay forma de encontrar órdenes específicas cuando hay muchas sin buscar manualmente.

**Como lo resuelve el código**:
- `PurchaseOrderFilters` permite filtrar por estado
- Búsqueda por ID de orden, proveedor, solicitante
- Filtrado en tiempo real
- Visualización clara de resultados filtrados

**Riesgos/limitaciones**:
- Filtrado es client-side (no hay paginación eficiente)
- No hay filtros por fecha, monto, o categoría
- Falta guardado de filtros favoritos

### 9. **Gestión de Items en Órdenes de Compra con Validación**
**Página(s)**: `/ordenes-de-compra` (Órdenes de Compra)

**Problema cubierto**: No hay forma de crear órdenes de compra con múltiples items y validaciones básicas.

**Como lo resuelve el código**:
- `PurchaseOrderFormModal` permite agregar múltiples items a una orden
- Campos por item: producto, cantidad, precio unitario, descuento
- Cálculo automático de totales (subtotal, impuestos, total)
- Validación de campos requeridos
- Selección de proveedor y moneda

**Riesgos/limitaciones**:
- Items son mock (no hay catálogo de productos real)
- No hay validación de precios (ej: precio mínimo/máximo)
- Falta cálculo automático de impuestos según proveedor

### 10. **Métricas de Recepciones con Dashboard Visual**
**Página(s)**: `/inventario/recepciones` (Recepciones de Material)

**Problema cubierto**: No hay forma de ver el rendimiento general de las recepciones sin calcular métricas manualmente.

**Como lo resuelve el código**:
- `ReceptionsDashboard` muestra métricas agregadas
- Métricas: Total Recepciones, Completadas (con porcentaje), Parciales, Con Discrepancias
- Cálculo automático de porcentajes
- Visualización con `MetricCards` con iconos y colores
- Tendencias básicas (up/down)

**Riesgos/limitaciones**:
- Métricas son mock (no hay datos reales)
- No hay comparación con períodos anteriores
- Falta desglose por proveedor

---

## 3) 10 problemas que AÚN NO resuelve (y debería)

### 1. **Flujo de Aprobación Configurable con Múltiples Niveles**
**Necesidad detectada**: El flujo de aprobación es hardcodeado. No hay forma de configurar niveles de aprobación, montos mínimos, o aprobadores específicos.

**Propuesta de solución** (alto nivel + impacto):
- Sistema de configuración de flujos de aprobación
- Múltiples niveles de aprobación (ej: >1000€ requiere aprobación gerente)
- Asignación de aprobadores por monto o categoría
- Notificaciones automáticas a aprobadores
- Escalamiento automático si aprobador no responde en X días
- Historial de aprobaciones con timestamps
- **Impacto**: Alto - Permite controlar gastos según montos y políticas del gimnasio.

**Páginas/flujo afectados**:
- `PurchaseOrderFormModal` (configuración de flujo)
- Nuevo componente `ApprovalWorkflowConfig`
- Sistema de notificaciones
- Nuevo servicio `ApprovalWorkflowService`

**Complejidad estimada**: Alta (requiere configuración compleja, notificaciones, escalamiento)

### 2. **Integración con Sistema de Inventario**
**Necesidad detectada**: Las recepciones no actualizan automáticamente el inventario. No hay sincronización con el sistema de stock.

**Propuesta de solución** (alto nivel + impacto):
- Actualización automática de inventario cuando se recibe material
- Sincronización bidireccional: recepción → inventario, inventario → recepciones pendientes
- Validación de stock disponible antes de crear orden
- Alertas cuando material recibido excede stock máximo
- **Impacto**: Alto - Sin esto, las recepciones no tienen valor funcional para gestión de inventario.

**Páginas/flujo afectados**:
- `ReceptionsDashboard` (actualización de inventario)
- Integración con módulo de inventario
- Nuevo servicio `InventorySyncService`

**Complejidad estimada**: Media/Alta (requiere integración cross-module, sincronización)

### 3. **Notificaciones Automáticas de Órdenes y Recepciones**
**Necesidad detectada**: No hay notificaciones automáticas cuando se crea orden, requiere aprobación, se recibe material, o hay discrepancias.

**Propuesta de solución** (alto nivel + impacto):
- Notificaciones push/email/SMS cuando orden requiere aprobación
- Notificaciones cuando orden es aprobada/rechazada
- Alertas cuando se recibe material con discrepancias
- Notificaciones de recepciones pendientes
- Recordatorios de órdenes pendientes de recepción
- **Impacto**: Alto - Permite respuesta rápida y seguimiento eficiente.

**Páginas/flujo afectados**:
- Todo el módulo de compras (notificaciones)
- Nuevo servicio `PurchaseNotificationService`
- Integración con sistema de notificaciones

**Complejidad estimada**: Media (requiere sistema de notificaciones, configuración de canales)

### 4. **Gestión de Contratos y Documentos de Proveedores**
**Necesidad detectada**: No hay gestión de contratos asociados a proveedores, ni almacenamiento de documentos (certificados, SLAs, acuerdos).

**Propuesta de solución** (alto nivel + impacto):
- Sistema de gestión de contratos por proveedor
- Almacenamiento de documentos (certificados, SLAs, acuerdos)
- Fechas de vencimiento de contratos con alertas
- Renovación automática de contratos
- Historial de versiones de contratos
- **Impacto**: Medio/Alto - Permite gestión legal y cumplimiento de acuerdos.

**Páginas/flujo afectados**:
- `SuppliersDashboardContainer` (gestión de contratos)
- Nuevo componente `ContractManager`
- Sistema de almacenamiento de documentos
- Nuevo servicio `ContractService`

**Complejidad estimada**: Media (requiere almacenamiento de documentos, gestión de fechas)

### 5. **Comparación Automática de Precios entre Proveedores**
**Necesidad detectada**: No hay forma de comparar precios del mismo producto entre diferentes proveedores automáticamente.

**Propuesta de solución** (alto nivel + impacto):
- Sistema de comparación de precios por producto
- Sugerencias de proveedor más económico
- Alertas cuando hay mejor precio disponible
- Histórico de precios por proveedor
- Dashboard de ahorro potencial
- **Impacto**: Medio/Alto - Permite optimizar costes comparando proveedores.

**Páginas/flujo afectados**:
- `PurchaseOrderFormModal` (sugerencias de precio)
- `CostHistoryDashboard` (comparación de precios)
- Nuevo servicio `PriceComparisonService`

**Complejidad estimada**: Media (requiere normalización de productos, comparación)

### 6. **Presupuestos y Límites de Compra**
**Necesidad detectada**: No hay control de presupuestos ni límites de compra. No se valida si una orden excede el presupuesto disponible.

**Propuesta de solución** (alto nivel + impacto):
- Sistema de presupuestos por categoría o período
- Validación de límites antes de aprobar orden
- Alertas cuando se acerca al límite de presupuesto
- Dashboard de presupuesto vs gastado
- Bloqueo de órdenes que exceden presupuesto
- **Impacto**: Alto - Permite controlar gastos y evitar exceder presupuestos.

**Páginas/flujo afectados**:
- `PurchaseOrderFormModal` (validación de presupuesto)
- Nuevo componente `BudgetManager`
- Sistema de validación
- Nuevo servicio `BudgetService`

**Complejidad estimada**: Media/Alta (requiere gestión de presupuestos, validación, alertas)

### 7. **Sistema de Pedidos Recurrentes Automáticos**
**Necesidad detectada**: No hay forma de automatizar pedidos recurrentes (ej: suplementos mensuales, productos de limpieza).

**Propuesta de solución** (alto nivel + impacto):
- Configuración de pedidos recurrentes (mensual, trimestral, etc.)
- Generación automática de órdenes según programación
- Validación de stock antes de generar orden
- Notificación antes de generar orden automática
- Pausa/reanudación de pedidos recurrentes
- **Impacto**: Medio/Alto - Ahorra tiempo y asegura suministros continuos.

**Páginas/flujo afectados**:
- Nuevo componente `RecurringOrdersManager`
- Sistema de programación
- Integración con órdenes de compra
- Nuevo servicio `RecurringOrdersService`

**Complejidad estimada**: Media (requiere programación, validación, notificaciones)

### 8. **Trazabilidad Completa de Items desde Orden hasta Recepción**
**Necesidad detectada**: No hay trazabilidad completa de items desde que se crea la orden hasta que se recibe, incluyendo estados intermedios.

**Propuesta de solución** (alto nivel + impacto):
- Historial completo de cada item desde orden hasta recepción
- Estados intermedios: ordenado, en tránsito, recibido parcialmente, recibido completamente
- Tracking de ubicación de items en tránsito
- Notificaciones de cambios de estado
- Dashboard de trazabilidad
- **Impacto**: Medio/Alto - Permite seguimiento detallado y resolución de problemas.

**Páginas/flujo afectados**:
- `OrderDetailModal` (trazabilidad de items)
- `ReceptionsDashboard` (estados de items)
- Nuevo componente `ItemTrackingDashboard`
- Nuevo servicio `ItemTrackingService`

**Complejidad estimada**: Media (requiere estados, historial, notificaciones)

### 9. **Evaluación Automática de Proveedores Basada en Métricas**
**Necesidad detectada**: Las evaluaciones son manuales. No hay evaluación automática basada en métricas reales (puntualidad, calidad, precio).

**Propuesta de solución** (alto nivel + impacto):
- Cálculo automático de métricas de proveedores: puntualidad (fechas de entrega), calidad (discrepancias), precio (comparación)
- Score automático basado en métricas
- Alertas cuando proveedor tiene bajo rendimiento
- Recomendaciones de proveedores basadas en métricas
- Dashboard de rendimiento de proveedores
- **Impacto**: Medio/Alto - Permite decisiones basadas en datos objetivos.

**Páginas/flujo afectados**:
- `SupplierEvaluationDashboard` (métricas automáticas)
- Integración con órdenes y recepciones
- Nuevo servicio `SupplierMetricsService`

**Complejidad estimada**: Media (requiere cálculo de métricas, análisis de datos)

### 10. **Exportación e Integración con Sistemas Contables**
**Necesidad detectada**: No hay exportación de datos de compras para sistemas contables ni integración con software de facturación.

**Propuesta de solución** (alto nivel + impacto):
- Exportación de órdenes y recepciones a formatos contables (CSV, XML, Excel)
- Integración con software de facturación (SAGE, ContaPlus, etc.)
- Exportación automática periódica
- Mapeo de campos a formatos contables
- Validación de datos antes de exportar
- **Impacto**: Medio/Alto - Permite integración con sistemas externos y cumplimiento contable.

**Páginas/flujo afectados**:
- Nuevo componente `AccountingExportManager`
- Integración con APIs de software contable
- Nuevo servicio `AccountingIntegrationService`

**Complejidad estimada**: Media/Alta (requiere integración con sistemas externos, mapeo de datos)

---

## 4) Hallazgos desde navegación/menús

### Sidebar.tsx

**Estructura de la sección**:
```typescript
{
  id: 'compras',
  title: 'Compras',
  icon: ShoppingBasket,
  gimnasioOnly: true,
  items: [
    { id: 'ordenes-de-compra', label: 'Órdenes de Compra', icon: ShoppingBasket, path: '/ordenes-de-compra' },
    { id: 'recepciones-de-material', label: 'Recepciones de Material', icon: PackageOpen, path: '/inventario/recepciones' },
    { id: 'proveedores-contratos', label: 'Proveedores & Contratos', icon: FileSignature, path: '/admin/operaciones/proveedores' },
    { id: 'evaluacion-de-proveedores', label: 'Evaluación Proveedores', icon: Star, path: '/operaciones/proveedores/evaluaciones' },
    { id: 'historico-costes', label: 'Histórico de Costes', icon: FileBarChart, path: '/finanzas/compras/historico-costes' },
  ],
}
```

**Permisos y visibilidad**:
- Toda la sección es solo para gimnasios (`gimnasioOnly: true`)
- Algunas páginas tienen guardias adicionales (ej: Proveedores & Contratos verifica roles específicos)
- No hay badges o contadores de notificaciones

**Inconsistencias de UX o naming**:
1. **Naming inconsistente**:
   - "Órdenes de Compra" (español)
   - "Recepciones de Material" (español)
   - "Proveedores & Contratos" (español)
   - "Evaluación Proveedores" (español, pero incompleto - debería ser "Evaluación de Proveedores")
   - "Histórico de Costes" (español)

2. **Rutas inconsistentes**:
   - `/ordenes-de-compra` (español, bajo raíz)
   - `/inventario/recepciones` (español, bajo inventario - compartida con sección Ventas/POS)
   - `/admin/operaciones/proveedores` (inglés, bajo admin/operaciones - compartida con sección Operaciones)
   - `/operaciones/proveedores/evaluaciones` (español, bajo operaciones - compartida con sección Operaciones)
   - `/finanzas/compras/historico-costes` (español, bajo finanzas/compras - compartida con sección Finanzas)
   - Mezcla de rutas diferentes, muchas compartidas con otras secciones

3. **Iconos inconsistentes**:
   - ShoppingBasket para sección y "Órdenes de Compra" (duplicado)
   - PackageOpen para "Recepciones de Material" (específico)
   - FileSignature para "Proveedores & Contratos" (específico)
   - Star para "Evaluación Proveedores" (específico)
   - FileBarChart para "Histórico de Costes" (específico)
   - Falta coherencia en estilo de iconos

4. **Falta de conexión con otras secciones**:
   - "Recepciones de Material" está también en "Ventas / POS / Tienda"
   - "Proveedores & Contratos" y "Evaluación Proveedores" están también en "Operaciones del Centro"
   - "Histórico de Costes" está también en "Finanzas"
   - No hay conexión clara entre secciones relacionadas

5. **Falta de indicadores visuales**:
   - No hay badges de órdenes pendientes de aprobación
   - No hay alertas de recepciones con discrepancias
   - No hay indicadores de contratos próximos a vencer
   - No hay contadores de evaluaciones pendientes

**Sugerencias de mejora**:
- Estandarizar rutas (todas bajo `/compras/` o todas bajo `/purchases/`)
- Completar nombres (ej: "Evaluación Proveedores" a "Evaluación de Proveedores")
- Añadir badges de notificaciones para órdenes pendientes, recepciones con discrepancias
- Considerar mover páginas compartidas a una sección común o duplicar con diferentes vistas
- Conectar con otras secciones relacionadas (Inventario, Finanzas, Operaciones)

---

## 5) KPIs y métricas recomendadas

### Métricas de adopción
- **Tasa de uso de órdenes de compra**: % de compras que se gestionan a través del sistema
  - Meta: >80% para gimnasios
- **Tasa de recepciones registradas**: % de recepciones que se registran en el sistema
  - Meta: >90% para gimnasios
- **Tasa de proveedores evaluados**: % de proveedores que tienen al menos una evaluación
  - Meta: >70% para gimnasios
- **Tasa de uso de histórico de costes**: % de usuarios que consultan histórico de costes mensualmente
  - Meta: >60% para gimnasios
- **Tasa de aprobación de órdenes**: % de órdenes que se aprueban a tiempo
  - Meta: >85% para gimnasios
- **Retención de proveedores**: % de proveedores que se mantienen activos
  - Meta: >80% para gimnasios

### Tiempo de tarea
- **Tiempo para crear orden de compra**: Desde abrir modal hasta guardar orden básica
  - Meta: <10 minutos
- **Tiempo para registrar recepción**: Desde abrir modal hasta confirmar recepción
  - Meta: <5 minutos (recepción sin discrepancias)
- **Tiempo para aprobar orden**: Desde notificación hasta aprobación
  - Meta: <24 horas
- **Tiempo para evaluar proveedor**: Desde abrir modal hasta guardar evaluación
  - Meta: <5 minutos
- **Tiempo para consultar histórico**: Desde abrir página hasta ver datos relevantes
  - Meta: <30 segundos

### Conversión interna
- **Tasa de órdenes completadas**: % de órdenes que se completan (recibidas completamente)
  - Meta: >90%
- **Tasa de recepciones sin discrepancias**: % de recepciones sin discrepancias
  - Meta: >85%
- **Tasa de proveedores aprobados**: % de proveedores que están aprobados
  - Meta: >70%
- **Tasa de órdenes con recepción**: % de órdenes que tienen al menos una recepción
  - Meta: >95%

### Errores por flujo
- **Errores en creación de órdenes**: % de veces que falla la creación
  - Meta: <2%
- **Errores en registro de recepciones**: % de veces que falla el registro
  - Meta: <3%
- **Errores en evaluación de proveedores**: % de veces que falla la evaluación
  - Meta: <2%
- **Errores en aprobación de órdenes**: % de veces que falla la aprobación
  - Meta: <1%

### Latencia clave
- **Tiempo de carga de órdenes**: Desde abrir página hasta mostrar órdenes
  - Meta: <1 segundo
- **Tiempo de carga de recepciones**: Desde abrir página hasta mostrar recepciones
  - Meta: <1 segundo
- **Tiempo de cálculo de KPIs**: Desde cambiar filtros hasta actualizar KPIs
  - Meta: <500ms
- **Tiempo de actualización de estado**: Desde cambiar estado hasta confirmación
  - Meta: <2 segundos

---

## 6) Backlog priorizado (RICE/MoSCoW)

### MUST (top 3)

#### 1. Integración con Sistema de Inventario
- **RICE Score**:
  - Reach: 100% recepciones que afectan inventario
  - Impact: 10/10 (sin esto, recepciones no tienen valor funcional)
  - Confidence: 8/10
  - Effort: 8/10 (alto, requiere integración cross-module)
  - **Score: 10.0**
- **Justificación**: Sin integración con inventario, las recepciones no actualizan stock y no tienen valor funcional real.
- **Esfuerzo estimado**: 8-10 semanas (2 desarrolladores + integración)

#### 2. Notificaciones Automáticas de Órdenes y Recepciones
- **RICE Score**:
  - Reach: 100% órdenes y recepciones
  - Impact: 10/10 (permite respuesta rápida)
  - Confidence: 9/10
  - Effort: 6/10 (medio, requiere sistema de notificaciones)
  - **Score: 15.0**
- **Justificación**: Permite respuesta rápida a aprobaciones pendientes y discrepancias. Alto impacto con esfuerzo medio.
- **Esfuerzo estimado**: 6-8 semanas (1-2 desarrolladores)

#### 3. Flujo de Aprobación Configurable con Múltiples Niveles
- **RICE Score**:
  - Reach: 100% órdenes que requieren aprobación
  - Impact: 10/10 (permite control de gastos)
  - Confidence: 7/10 (requiere configuración compleja)
  - Effort: 10/10 (muy complejo, requiere configuración, notificaciones, escalamiento)
  - **Score: 7.0**
- **Justificación**: Permite controlar gastos según montos y políticas del gimnasio. Es funcionalidad core.
- **Esfuerzo estimado**: 12-14 semanas (2-3 desarrolladores)

### SHOULD (top 3)

#### 4. Presupuestos y Límites de Compra
- **RICE Score**:
  - Reach: 100% órdenes creadas
  - Impact: 9/10 (permite control de gastos)
  - Confidence: 8/10
  - Effort: 7/10 (medio/alto, requiere gestión de presupuestos)
  - **Score: 10.3**
- **Esfuerzo estimado**: 7-9 semanas

#### 5. Comparación Automática de Precios entre Proveedores
- **RICE Score**:
  - Reach: 100% órdenes creadas
  - Impact: 8/10 (optimiza costes)
  - Confidence: 8/10
  - Effort: 6/10 (medio, requiere normalización)
  - **Score: 10.7**
- **Esfuerzo estimado**: 6-8 semanas

#### 6. Gestión de Contratos y Documentos de Proveedores
- **RICE Score**:
  - Reach: 100% proveedores con contratos
  - Impact: 8/10 (gestión legal)
  - Confidence: 8/10
  - Effort: 6/10 (medio, requiere almacenamiento)
  - **Score: 10.7**
- **Esfuerzo estimado**: 6-8 semanas

### COULD (top 3)

#### 7. Sistema de Pedidos Recurrentes Automáticos
- **RICE Score**:
  - Reach: 100% productos que se compran recurrentemente
  - Impact: 8/10 (ahorra tiempo)
  - Confidence: 8/10
  - Effort: 7/10 (medio/alto, requiere programación)
  - **Score: 9.1**
- **Esfuerzo estimado**: 7-9 semanas

#### 8. Trazabilidad Completa de Items desde Orden hasta Recepción
- **RICE Score**:
  - Reach: 100% items en órdenes
  - Impact: 7/10 (mejora seguimiento)
  - Confidence: 8/10
  - Effort: 6/10 (medio, requiere estados, historial)
  - **Score: 9.3**
- **Esfuerzo estimado**: 6-8 semanas

#### 9. Evaluación Automática de Proveedores Basada en Métricas
- **RICE Score**:
  - Reach: 100% proveedores activos
  - Impact: 8/10 (decisiones basadas en datos)
  - Confidence: 7/10 (requiere cálculo de métricas)
  - Effort: 7/10 (medio/alto, requiere análisis)
  - **Score: 8.0**
- **Esfuerzo estimado**: 7-9 semanas

---

## 7) Próximos pasos

### 3 acciones accionables para la próxima iteración

#### 1. **Implementar Notificaciones Automáticas de Órdenes y Recepciones (6 semanas)**
- **Acciones específicas**:
  - Sistema de notificaciones push/email/SMS
  - Notificaciones cuando orden requiere aprobación
  - Notificaciones cuando orden es aprobada/rechazada
  - Alertas cuando se recibe material con discrepancias
  - Notificaciones de recepciones pendientes
  - Recordatorios de órdenes pendientes de recepción
  - Configuración de canales de notificación por tipo de alerta
  - Preferencias de notificación por usuario
- **Responsables**: Backend developer (1) + Frontend developer (0.5)
- **Entregables**:
  - Sistema de notificaciones
  - Integración con email/SMS/push
  - Configuración de alertas

#### 2. **Implementar Integración con Sistema de Inventario (8 semanas)**
- **Acciones específicas**:
  - Actualización automática de inventario cuando se recibe material
  - Sincronización bidireccional: recepción → inventario, inventario → recepciones pendientes
  - Validación de stock disponible antes de crear orden
  - Alertas cuando material recibido excede stock máximo
  - Integración con módulo de inventario
  - Actualización de estado de orden cuando se recibe material
- **Responsables**: Backend developer (1) + Frontend developer (0.5) + Inventario developer (0.5)
- **Entregables**:
  - Sistema de sincronización
  - Integración con inventario
  - Validaciones y alertas

#### 3. **Implementar Comparación Automática de Precios entre Proveedores (6 semanas)**
- **Acciones específicas**:
  - Sistema de comparación de precios por producto
  - Sugerencias de proveedor más económico al crear orden
  - Alertas cuando hay mejor precio disponible
  - Histórico de precios por proveedor
  - Dashboard de ahorro potencial
  - Normalización de nombres de productos para comparación
- **Responsables**: Backend developer (1) + Frontend developer (0.5)
- **Entregables**:
  - Sistema de comparación
  - Sugerencias y alertas
  - Dashboard de ahorro

### Riesgos y supuestos

**Riesgos identificados**:
1. **Integración con inventario puede ser compleja si hay inconsistencias de datos**:
   - Mitigación: Validación de datos antes de sincronizar, manejo de errores, rollback si es necesario
   - Impacto: Alto - afecta integridad de datos

2. **Notificaciones excesivas pueden causar fatiga**:
   - Mitigación: Configuración granular de notificaciones, agrupación de alertas, silenciamiento temporal
   - Impacto: Medio - afecta adopción de notificaciones

3. **Comparación de precios puede ser inexacta si productos no están normalizados**:
   - Mitigación: Sistema de normalización de nombres, matching inteligente, validación manual
   - Impacto: Medio - afecta calidad de sugerencias

4. **Flujo de aprobación configurable puede ser demasiado complejo para usuarios**:
   - Mitigación: Configuración guiada, plantillas predefinidas, documentación clara
   - Impacto: Medio - afecta adopción

**Supuestos**:
- Hay módulo de inventario para sincronizar con recepciones
- Hay sistema de notificaciones (email/SMS/push) disponible
- Los proveedores tienen productos con nombres similares o normalizables
- Hay base de datos para almacenar órdenes, recepciones, proveedores, evaluaciones
- Los usuarios tienen conocimientos básicos de gestión de compras (puede requerir educación)
- Hay acceso a APIs de software contable (opcional, para integración contable)

**Dependencias externas**:
- Sistema de inventario
- Sistema de notificaciones (email/SMS/push)
- Base de datos para almacenamiento
- APIs de software contable (opcional)
- Sistema de almacenamiento de documentos (para contratos, opcional)

---

> **Notas técnicas**: 
> - Todas las rutas son relativas desde la raíz del proyecto
> - Los componentes de Órdenes de Compra están en `src/features/ordenes-de-compra/`
> - Los componentes de Recepciones están en `src/features/recepciones-de-material/`
> - Los componentes de Proveedores están en `src/features/proveedores-contratos/`
> - Los componentes de Evaluación están en `src/features/evaluacion-de-proveedores/`
> - Los componentes de Histórico de Costes están en `src/features/historico-de-costes-de-compra/`
> - Las APIs están en `src/features/[Feature]/api/` o `hooks/`


















