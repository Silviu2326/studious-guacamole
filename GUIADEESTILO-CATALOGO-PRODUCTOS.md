# Guía de Estilo - Módulo Catálogo de Productos
## Base para Estandarización de Módulos

**Versión:** 1.0  
**Fecha:** 2025-01-17  
**Módulo de Referencia:** `catalogo-productos`  
**Propósito:** Servir como base para mantener consistencia visual y estructural en todos los módulos de la aplicación.

---

## 📋 Estructura General de la Página

### Layout Principal

```tsx
<div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
  {/* Header */}
  {/* Contenido Principal */}
</div>
```

### Componentes Principales (en orden)

1. **Header con título y descripción**
2. **Contenedor principal con ancho máximo**
3. **Sistema de Tabs (si aplica)**
4. **Contenido de la sección activa**

---

## 🎨 Header de la Página

### Estructura

```tsx
<div className="border-b border-gray-200/60 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
  <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6">
    <div className="py-6">
      <div className="flex items-center">
        {/* Icono con contenedor */}
        <div className="p-2 bg-blue-100 rounded-xl mr-4 ring-1 ring-blue-200/70">
          <Icono size={24} className="text-blue-600" />
        </div>
        
        {/* Título y descripción */}
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900">
            Título del Módulo
          </h1>
          <p className="text-gray-600">
            Descripción breve del módulo
          </p>
        </div>
      </div>
    </div>
  </div>
</div>
```

### Especificaciones del Header

- **Fondo:** `bg-white/80 backdrop-blur` - Fondo blanco semitransparente con blur
- **Borde inferior:** `border-b border-gray-200/60` - Borde sutil en la parte inferior
- **Padding vertical:** `py-6` (24px)
- **Ancho máximo:** `max-w-[1600px]` - Centrado con máximo de 1600px
- **Padding horizontal:** `px-4 sm:px-6 lg:px-6` - Responsive: 16px móvil, 24px desktop

### Icono del Módulo

- **Contenedor:** `p-2 bg-blue-100 rounded-xl mr-4 ring-1 ring-blue-200/70`
  - Padding: 8px
  - Fondo: Azul claro (`bg-blue-100`)
  - Radio: `rounded-xl` (12px)
  - Margen derecho: `mr-4` (16px)
  - Anillo: `ring-1 ring-blue-200/70` - Borde sutil

- **Icono:** `size={24} className="text-blue-600"`
  - Tamaño: 24px
  - Color: Azul (`text-blue-600`)

### Título Principal

- **Clase:** `text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900`
  - Tamaño móvil: `text-3xl` (30px)
  - Tamaño desktop: `md:text-4xl` (36px)
  - Peso: `font-extrabold` (800)
  - Tracking: `tracking-tight` - Letras más juntas
  - Color: `text-gray-900` - Gris oscuro

### Descripción

- **Clase:** `text-gray-600`
  - Color: `text-gray-600` - Gris medio
  - Tamaño: Por defecto (16px)

---

## 📦 Contenedor Principal

### Estructura Base

```tsx
<div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6 py-8">
  {/* Contenido */}
</div>
```

### Especificaciones

- **Ancho máximo:** `max-w-[1600px]` - Mismo que el header
- **Centrado:** `mx-auto`
- **Padding horizontal:** `px-4 sm:px-6 lg:px-6`
  - Móvil: 16px
  - Desktop: 24px
- **Padding vertical superior:** `py-8` (32px)

---

## 🗂️ Sistema de Tabs

### Estructura del Tab Container

```tsx
<Card className="p-0 bg-white shadow-sm">
  <div className="px-4 py-3">
    <div
      role="tablist"
      aria-label="Secciones"
      className="flex items-center gap-2 rounded-2xl bg-slate-100 p-1"
    >
      {/* Botones de tab */}
    </div>
  </div>
</Card>
```

### Contenedor de Tabs

- **Card wrapper:** `p-0 bg-white shadow-sm`
- **Padding interno:** `px-4 py-3` (16px horizontal, 12px vertical)
- **Fondo de tabs:** `bg-slate-100 rounded-2xl`
- **Espaciado entre tabs:** `gap-2` (8px)
- **Padding interno tabs:** `p-1` (4px)

### Botón de Tab (Inactivo)

```tsx
<button
  className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all text-slate-600 hover:text-slate-900 hover:bg-white/70"
>
  <Icon size={18} className="opacity-70" />
  <span>Label</span>
</button>
```

- **Clase base:** `inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all`
- **Estado inactivo:** `text-slate-600 hover:text-slate-900 hover:bg-white/70`
- **Icono inactivo:** `opacity-70`
- **Radio:** `rounded-xl` (12px)
- **Padding:** `px-4 py-2` (16px horizontal, 8px vertical)

### Botón de Tab (Activo)

```tsx
<button
  className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all bg-white text-slate-900 shadow-sm ring-1 ring-slate-200"
>
  <Icon size={18} className="opacity-100" />
  <span>Label</span>
</button>
```

- **Estado activo:** `bg-white text-slate-900 shadow-sm ring-1 ring-slate-200`
- **Icono activo:** `opacity-100`
- **Sombra:** `shadow-sm` - Sombra pequeña
- **Anillo:** `ring-1 ring-slate-200` - Borde sutil

### Espaciado después de Tabs

- **Margen superior:** `mt-6` (24px) después del Card de tabs

---

## 📊 Orden de Componentes en el Contenido

### Estructura Típica (vista principal con lista)

1. **Toolbar superior** - Botones de acción principal
2. **KPIs/Métricas** - Tarjetas de métricas (si aplica)
3. **Filtros** - Sistema de filtrado y búsqueda
4. **Controles de vista** - Selector de vista y ordenamiento
5. **Lista/Grid de elementos** - Contenido principal
6. **Paginación** - Navegación entre páginas (si aplica)
7. **Modales** - Modales de creación/edición

### Espaciado entre Secciones

- **Container principal:** `space-y-6` (24px entre secciones)

---

## 🛠️ Toolbar Superior

### Estructura

```tsx
<div className="flex items-center justify-end">
  <Button onClick={handleAction}>
    <Icon size={20} className="mr-2" />
    Acción Principal
  </Button>
</div>
```

### Especificaciones

- **Alineación:** `justify-end` - Botones alineados a la derecha
- **Espaciado de iconos:** `mr-2` (8px entre icono y texto)
- **Tamaño de icono:** `size={20}` (20px)

---

## 📈 Tarjetas de Métricas (KPIs)

### Estructura

```tsx
<MetricCards
  data={[
    {
      id: 'id',
      title: 'Título',
      value: valor,
      color: 'info', // 'info' | 'success' | 'warning' | 'danger'
    },
    // ...
  ]}
/>
```

### Uso del Componente MetricCards

- Se utiliza el componente reutilizable `MetricCards`
- Colores disponibles: `info`, `success`, `warning`, `danger`
- Se coloca después del toolbar y antes de los filtros

---

## 🔍 Sistema de Filtros

### Estructura Principal

```tsx
<Card className="mb-6 bg-white shadow-sm">
  <div className="space-y-4">
    {/* Barra de búsqueda */}
    {/* Panel de filtros avanzados */}
    {/* Resumen de resultados */}
  </div>
</Card>
```

### Barra de Búsqueda

```tsx
<div className="rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-3">
  <div className="flex gap-4">
    {/* Input de búsqueda */}
    {/* Botón de filtros */}
    {/* Botón limpiar (si hay filtros activos) */}
  </div>
</div>
```

- **Fondo:** `bg-slate-50 rounded-2xl`
- **Borde:** `ring-1 ring-slate-200`
- **Padding:** `p-3` (12px)
- **Gap entre elementos:** `gap-4` (16px)

### Input de Búsqueda (Light Input)

```tsx
<input
  className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 pl-10 pr-3 py-2.5"
/>
```

- **Radio:** `rounded-xl` (12px)
- **Fondo:** `bg-white`
- **Borde:** `ring-1 ring-slate-300`
- **Focus:** `focus:ring-2 focus:ring-blue-400`
- **Padding:** `py-2.5` (10px vertical), `pl-10` (40px izquierdo para icono), `pr-3` (12px derecho)

### Botón de Filtros

- **Variante:** `variant='secondary'` o `variant='ghost'`
- **Badge de contador:** Si hay filtros activos, mostrar badge con número
- **Iconos:** ChevronDown/ChevronUp para expandir/colapsar

### Panel de Filtros Avanzados

```tsx
<div className="rounded-2xl bg-white ring-1 ring-slate-200 p-4 space-y-4">
  {/* Grid de filtros */}
</div>
```

- **Grid responsive:** `grid grid-cols-1 md:grid-cols-3 gap-4` para 3 columnas
- **Espaciado vertical:** `space-y-4` (16px entre filas)
- **Padding:** `p-4` (16px)

### Labels de Filtros

```tsx
<label className="block text-sm font-medium text-slate-700 mb-2">
  <Icon size={16} className="inline mr-1" />
  Etiqueta
</label>
```

- **Tamaño:** `text-sm`
- **Peso:** `font-medium`
- **Color:** `text-slate-700`
- **Margen inferior:** `mb-2` (8px)
- **Iconos en labels:** `size={16}` con `mr-1` (4px)

### Resumen de Resultados

```tsx
<div className="flex justify-between items-center text-sm text-slate-600 border-t border-slate-200 pt-4">
  <span>X resultados encontrados</span>
  <span>X filtros aplicados</span>
</div>
```

- **Separador:** `border-t border-slate-200`
- **Padding superior:** `pt-4` (16px)
- **Texto:** `text-sm text-slate-600`

---

## 🎛️ Controles de Vista y Ordenamiento

### Estructura

```tsx
<Card className="p-4 bg-white shadow-sm">
  <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
    {/* Selector de vista */}
    {/* Selector de ordenamiento */}
    {/* Información de paginación */}
  </div>
</Card>
```

### Especificaciones

- **Layout:** `flex-col` en móvil, `flex-row` en desktop
- **Alineación:** `md:items-center md:justify-between`
- **Gap:** `gap-4` (16px)
- **Padding:** `p-4` (16px)

### Selector de Vista (Grid/List)

```tsx
<div className="flex items-center gap-2">
  <span className="text-sm font-medium text-gray-700">Vista:</span>
  <div className="flex border rounded-lg overflow-hidden">
    <Button variant={vista === 'grid' ? 'primary' : 'ghost'} size="sm">
      <Grid3X3 size={16} />
    </Button>
  </div>
</div>
```

### Selector de Ordenamiento

```tsx
<div className="flex items-center gap-2">
  <span className="text-sm font-medium text-gray-700">Ordenar por:</span>
  <div className="flex flex-wrap gap-1">
    {/* Botones de ordenamiento */}
  </div>
</div>
```

---

## 📋 Grid/Lista de Elementos

### Grid View

```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
  {/* Cards */}
</div>
```

- **Responsive:**
  - Móvil: 1 columna
  - Tablet: 2 columnas
  - Desktop: 3 columnas
  - XL: 4 columnas
- **Gap:** `gap-6` (24px)

### List View

```tsx
<div className="space-y-4">
  {/* Elementos de lista */}
</div>
```

- **Espaciado vertical:** `space-y-4` (16px)

---

## 🃏 Cards de Elementos

### Estructura Base

```tsx
<Card variant="hover" className="h-full flex flex-col transition-shadow overflow-hidden">
  {/* Contenido */}
</Card>
```

- **Variante:** `variant="hover"` para efecto hover
- **Layout:** `flex flex-col` para distribuir contenido verticalmente
- **Altura:** `h-full` para igualar altura en grid
- **Overflow:** `overflow-hidden` para imágenes

### Contenido de Card

- **Imagen (si aplica):** `h-48 bg-gray-100` - Altura fija de 192px
- **Padding interno:** `p-4` (16px)
- **Espaciado entre secciones:** `space-y-2` o `mb-4`

---

## 🔄 Paginación

### Estructura

```tsx
<Card className="p-4 bg-white shadow-sm">
  <div className="flex justify-center items-center gap-2">
    {/* Botones de navegación */}
  </div>
</Card>
```

### Especificaciones

- **Centrado:** `justify-center`
- **Gap entre botones:** `gap-2` (8px)
- **Botones:** Variante `ghost` para navegación, `primary` para página activa
- **Tamaño:** `size="sm"`

---

## 🎭 Estados Vacíos y de Carga

### Estado de Carga

```tsx
<Card className="p-8 text-center bg-white shadow-sm">
  <Loader2 size={48} className="mx-auto text-blue-500 animate-spin mb-4" />
  <p className="text-gray-600">Cargando...</p>
</Card>
```

- **Padding:** `p-8` (32px)
- **Centrado:** `text-center`
- **Icono:** `size={48}`, color azul, animación spin
- **Margen icono:** `mb-4` (16px)

### Estado Vacío

```tsx
<Card className="p-8 text-center bg-white shadow-sm">
  <Package size={48} className="mx-auto text-gray-400 mb-4" />
  <h3 className="text-lg font-semibold text-gray-900 mb-2">Título</h3>
  <p className="text-gray-600 mb-4">Descripción</p>
  <Button>Acción</Button>
</Card>
```

- **Icono:** `size={48}`, `text-gray-400`
- **Título:** `text-lg font-semibold text-gray-900`
- **Descripción:** `text-gray-600`
- **Espaciado:** `mb-2` (8px) título, `mb-4` (16px) descripción

### Estado de Error

```tsx
<Card className="p-8 text-center">
  <AlertCircle size={48} className="mx-auto text-red-500 mb-4" />
  <h3 className="text-lg font-semibold text-gray-900 mb-2">Error al cargar</h3>
  <p className="text-gray-600 mb-4">Mensaje de error</p>
  <Button onClick={retry}>Reintentar</Button>
</Card>
```

- **Icono:** `size={48}`, `text-red-500`
- **Estructura similar a estado vacío**

---

## 🎨 Esquema de Colores del Módulo

### Colores Principales

- **Azul (Primary):** `blue-600`, `blue-100`, `blue-200/70`
- **Grises (Neutrales):** `gray-50`, `gray-100`, `gray-200`, `gray-400`, `gray-600`, `gray-900`
- **Slate (Inputs/Filtros):** `slate-50`, `slate-100`, `slate-200`, `slate-300`, `slate-600`, `slate-700`, `slate-900`

### Estados Semánticos

- **Success:** `green-600`, `green-100`
- **Warning:** `yellow-600`, `yellow-100`
- **Error:** `red-600`, `red-100`
- **Info:** `blue-600`, `blue-100`

---

## 📏 Sistema de Espaciado

### Espaciado Vertical (`space-y-*`)

- **Entre secciones principales:** `space-y-6` (24px)
- **Entre subsecciones:** `space-y-4` (16px)
- **Entre elementos pequeños:** `space-y-2` (8px)
- **Entre elementos en lista:** `space-y-3` (12px)

### Padding Horizontal

- **Contenedor principal:** `px-4 sm:px-6 lg:px-6`
- **Cards:** `px-4` o `p-4` (16px)
- **Tabs:** `px-4` (16px)

### Padding Vertical

- **Header:** `py-6` (24px)
- **Contenedor principal:** `py-8` (32px)
- **Cards:** `py-3` (12px) o `p-4` (16px)
- **Toolbar:** `py-2` (8px) o sin padding específico

### Márgenes

- **Margen superior entre secciones:** `mt-6` (24px)
- **Margen inferior en cards:** `mb-6` (24px) para filtros
- **Gap en grids:** `gap-6` (24px)

---

## 🔤 Tipografía

### Títulos

- **H1 (Header):** `text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900`
- **H2 (Sección):** `text-xl font-bold text-gray-900` o `text-lg font-semibold`
- **H3 (Subsección):** `text-lg font-semibold text-gray-900`

### Textos

- **Descripción:** `text-gray-600` (16px por defecto)
- **Labels:** `text-sm font-medium text-gray-700` o `text-slate-700`
- **Texto pequeño:** `text-sm text-gray-600`
- **Texto muy pequeño:** `text-xs text-gray-500`

---

## 🎯 Patrones de Diseño Específicos

### Badges y Estados

```tsx
<Badge variant="yellow" leftIcon={<Star size={12} />}>Destacado</Badge>
```

- **Tamaño de icono en badge:** `size={12}` (12px)
- **Variantes:** `yellow`, `green`, `red`, `gray`

### Botones de Acción en Cards

```tsx
<div className="flex gap-2 mt-auto pt-3 border-t border-gray-100">
  {/* Botones */}
</div>
```

- **Posición:** `mt-auto` para empujar al final
- **Separador:** `border-t border-gray-100`
- **Padding superior:** `pt-3` (12px)
- **Gap entre botones:** `gap-2` (8px)

### Modales

- Utilizar el componente `Modal` reutilizable
- Tamaño: `size="md"` por defecto
- Padding interno según contenido

---

## 📱 Responsive Design

### Breakpoints

- **Móvil:** Por defecto (< 640px)
- **sm:** ≥ 640px
- **md:** ≥ 768px
- **lg:** ≥ 1024px
- **xl:** ≥ 1280px

### Patrones Responsive Comunes

- **Padding horizontal:** `px-4 sm:px-6 lg:px-6`
- **Grids:** `grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4`
- **Flex direction:** `flex-col md:flex-row`
- **Títulos:** `text-3xl md:text-4xl`

---

## ✅ Checklist para Nuevos Módulos

Al crear un nuevo módulo basado en esta guía, verificar:

- [ ] Header con icono, título y descripción siguiendo el formato
- [ ] Contenedor principal con `max-w-[1600px]` y padding correcto
- [ ] Sistema de tabs (si aplica) con estilo consistente
- [ ] Toolbar superior alineado a la derecha
- [ ] Métricas/KPIs usando `MetricCards` (si aplica)
- [ ] Sistema de filtros con estilo `slate` consistente
- [ ] Controles de vista y ordenamiento en Card
- [ ] Grid/lista con espaciado `gap-6` o `space-y-4`
- [ ] Cards con variante `hover` y estructura flex-col
- [ ] Paginación centrada (si aplica)
- [ ] Estados vacíos, carga y error implementados
- [ ] Colores consistentes (azul para primarios, slate para inputs)
- [ ] Espaciado vertical `space-y-6` entre secciones principales
- [ ] Tipografía consistente con pesos y tamaños correctos
- [ ] Responsive en todos los breakpoints necesarios

---

## 📝 Notas Importantes

1. **Ancho máximo:** Todos los contenedores principales usan `max-w-[1600px]`
2. **Consistencia de colores:** Azul para acciones primarias, slate para inputs/filtros
3. **Espaciado:** Sistema basado en 8px (gap-2 = 8px, gap-4 = 16px, etc.)
4. **Cards:** Siempre usar `bg-white shadow-sm` para consistencia
5. **Iconos:** Tamaños estándar: 16px (labels), 20px (botones), 24px (headers), 48px (estados vacíos/carga)
6. **Transiciones:** `transition-all` en elementos interactivos
7. **Bordes:** Preferir `ring-1` sobre `border` en elementos modernos

---

## 🔄 Actualizaciones

Esta guía debe actualizarse cuando:
- Se cambien patrones de diseño en el módulo de referencia
- Se añadan nuevos componentes reutilizables
- Se modifiquen los colores o espaciado base
- Se ajusten los breakpoints responsive

**Última revisión:** Alineada con el módulo `catalogo-productos` - 2025-01-17

