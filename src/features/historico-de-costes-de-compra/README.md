# Histórico de Costes de Compra

## Descripción

El **Histórico de Costes de Compra** es una herramienta analítica avanzada diseñada para proporcionar a los gerentes y propietarios de gimnasios una visión profunda y detallada sobre sus patrones de gasto en suministros y equipamiento a lo largo del tiempo.

Esta funcionalidad permite:
- Visualizar la evolución de costes de productos individuales
- Comparar el rendimiento de diferentes proveedores
- Analizar el gasto por categorías
- Identificar tendencias y oportunidades de ahorro
- Exportar datos para análisis externo

## Características Principales

### 📊 Visualizaciones
- **Gráfico de Evolución de Precios**: Línea temporal del coste promedio por artículo
- **Tabla de Análisis Detallado**: Datos completos de cada producto con precios histórico, promedio, mínimo y máximo
- **KPIs en Tiempo Real**: Gasto total, coste promedio y variación de precios

### 🔍 Filtros Avanzados
- **Rango de Fechas**: Análisis personalizado por período
- **Selección de Proveedores**: Comparar múltiples proveedores
- **Filtros por Categorías**: Análisis específico por tipo de producto
- **Filtros Activos**: Indicadores visuales de filtros aplicados

### 📈 Métricas y KPIs
- **Gasto Total**: Suma de todos los costes en el período seleccionado
- **Coste Promedio**: Precio promedio por artículo
- **Variación de Precio**: Comparación con el período anterior
- **Precio Último vs Promedio**: Identificación de tendencias

### 💾 Exportación
- **Exportar a CSV**: Descarga de datos filtrados para análisis externo
- **Formato Compatible**: Excel, Google Sheets, etc.

## Estructura del Módulo

```
historico-de-costes-de-compra/
├── api/                    # APIs de datos
│   ├── costHistoryApi.ts   # API principal de histórico
│   ├── suppliersApi.ts     # API de proveedores
│   ├── categoriesApi.ts    # API de categorías
│   └── index.ts           # Exportaciones
├── components/            # Componentes React
│   ├── CostHistoryDashboard.tsx     # Dashboard principal
│   ├── CostFilterControls.tsx       # Controles de filtrado
│   ├── PriceEvolutionChart.tsx      # Gráfico de evolución
│   ├── CostDataTable.tsx            # Tabla de datos
│   └── index.ts                     # Exportaciones
├── hooks/                 # Hooks personalizados
│   ├── usePurchaseData.ts # Hook de datos de compra
│   └── index.ts           # Exportaciones
├── pages/                 # Páginas
│   └── historico-de-costes-de-compraPage.tsx  # Página principal
├── types/                 # Tipos TypeScript
│   └── index.ts           # Definiciones de tipos
├── index.ts              # Exportaciones del módulo
└── README.md             # Esta documentación
```

## Componentes Principales

### CostHistoryDashboard
Componente contenedor principal que orquesta toda la funcionalidad:
- Maneja el estado de los filtros
- Coordina las llamadas a APIs
- Renderiza subcomponentes
- Gestiona la exportación de datos

**Props:** Ninguna (componente standalone)

### CostFilterControls
Barra de filtros interactiva:
- Selector de rango de fechas
- Dropdown de proveedores (múltiple selección)
- Dropdown de categorías (múltiple selección)
- Indicadores visuales de filtros activos

**Props:**
- `suppliers`: Array de proveedores disponibles
- `categories`: Array de categorías disponibles
- `onFiltersChange`: Callback cuando los filtros cambian

### PriceEvolutionChart
Gráfico de líneas con recharts:
- Visualización temporal del coste promedio
- Tooltips informativos
- Responsive design
- Estados de carga y vacío

**Props:**
- `data`: Array de datos para el gráfico
- `isLoading`: Estado de carga

### CostDataTable
Tabla interactiva de productos:
- Ordenamiento por columnas
- Formateo de moneda
- Indicadores de variación de precio
- Estado de carga y vacío

**Props:**
- `data`: Array de datos de productos
- `loading`: Estado de carga
- `onSort`: Callback para ordenamiento
- `sortColumn`: Columna actual de orden
- `sortDirection`: Dirección del ordenamiento

## Hook Personalizado

### usePurchaseData
Hook que encapsula la lógica de fetching de datos:
- Gestiona el estado de carga
- Maneja errores
- Realiza llamadas a la API con filtros

**Parámetros:**
- `filters`: Objeto con filtros actuales

**Retorna:**
- `data`: Datos de la respuesta
- `loading`: Estado de carga
- `error`: Mensaje de error (si existe)

## APIs Mock

### getCostHistory
Obtiene datos agregados del histórico de costes:
```typescript
const response = await getCostHistory(filters);
// Retorna: { kpis, chartData, tableData }
```

### getSuppliers
Obtiene lista de proveedores:
```typescript
const suppliers = await getSuppliers();
// Retorna: Array<{ id: string, name: string }>
```

### getProductCategories
Obtiene lista de categorías:
```typescript
const categories = await getProductCategories();
// Retorna: Array<{ id: string, name: string }>
```

## Tipos TypeScript

### CostHistoryFilters
```typescript
interface CostHistoryFilters {
  from: Date;
  to: Date;
  supplierIds?: string[];
  categoryIds?: string[];
  productId?: string;
}
```

### CostHistoryResponse
```typescript
interface CostHistoryResponse {
  kpis: CostHistoryKPI;
  chartData: CostHistoryChartData[];
  tableData: CostHistoryTableData[];
}
```

Ver `types/index.ts` para definiciones completas.

## Uso

La página es accesible desde la ruta:
```
/finanzas/compras/historico-costes
```

También está disponible en el Sidebar bajo **"Histórico de Costes"** en la sección de operaciones financieras.

**Restricción:** Esta funcionalidad está disponible solo para usuarios de tipo **Gimnasio** (no para entrenadores personales).

## Tecnologías Utilizadas

- **React**: Framework UI
- **TypeScript**: Tipado estático
- **Recharts**: Visualizaciones de gráficos
- **Tailwind CSS**: Estilos
- **Componentes Reutilizables**: Card, Button, Select, Table, etc.

## Integraciones

- Integrado con `src/App.tsx` (ruta)
- Integrado con `src/components/Sidebar.tsx` (navegación)
- Usa componentes de `src/components/componentsreutilizables`
- Sigue patrones de diseño del sistema de design

## Futuras Mejoras

- [ ] Filtro por producto específico con búsqueda
- [ ] Vista comparativa lado a lado de proveedores
- [ ] Gráficos adicionales (barras, tarta)
- [ ] Exportación a PDF
- [ ] Alertas automáticas por variaciones significativas
- [ ] Análisis predictivo de tendencias

