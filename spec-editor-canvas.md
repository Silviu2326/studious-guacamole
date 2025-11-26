# 🎨 Especificaciones Técnicas Maestras: Editor Canvas (Panel Central)

> **Versión:** 2.1 (Definitiva)
> **Propósito:** Definir la arquitectura de renderizado, el sistema de vistas, la interacción drag-and-drop y la jerarquía de componentes del área de trabajo principal.

Este componente es el "lienzo" donde ocurre la magia. Debe ser altamente performante, visualmente claro y extremadamente interactivo.

---

## 1. Arquitectura Visual y Layout

### 1.1. Contenedor Principal (`<main>`)
El `EditorCanvas` ocupa el espacio central, adaptándose dinámicamente al colapso/apertura de los paneles laterales.

| Propiedad | Valor | Descripción |
| :--- | :--- | :--- |
| **Tag HTML** | `<main>` | Contenido principal de la página. |
| **Flex** | `flex-1` | Crece para ocupar todo el ancho disponible. |
| **Fondo** | `bg-gray-50` (#F9FAFB) | Color neutro para resaltar las tarjetas blancas. |
| **Overflow** | `overflow-y-auto` | Scroll vertical independiente del resto de la app. |
| **Posición** | `Relative` | Necesario para posicionar modales o popovers internos. |

### 1.2. Zonas de Contenido (Grid Mental)

```text
[ HEADER DE NAVEGACIÓN ]       --> Sticky Top (dentro del main). Control de vistas.
[ CABECERA DE PROGRAMA ]       --> Información contextual (Semana, Tags).
[ GRID DE CONTENIDO ]          --> El área "droppable" principal.
[ FOOTER DE ACCIONES ]         --> Botones globales (BatchTraining, Nueva Semana).
```

---

## 2. Header del Canvas (Navegación Interna)

Barra de herramientas pegajosa en la parte superior del canvas.

*   **Componente:** `CanvasHeader.tsx`
*   **Selector de Vistas (Segmented Control):**
    *   Componente tipo "Pill" con fondo gris claro.
    *   Opción Activa: Fondo blanco, sombra suave, texto negro.
    *   Opción Inactiva: Texto gris, hover oscuro.
    *   **Estados:** `viewMode` ('weekly' | 'excel' | 'timeline').
*   **Acciones de Contexto:**
    *   Botones que cambian según la selección actual (ej. si selecciono un día, aparece "Copiar Día").

---

## 3. Componentes de la Vista Semanal (Weekly View)

Esta es la vista por defecto y la más compleja.

### A. Cabecera del Programa (`ProgramHeader`)
*   **Título:** Input transparente (`h1`) que permite editar el nombre de la semana (ej. "Fase de Acumulación").
*   **Metadatos:** Selectores nativos o custom para `Mesociclo` y `Microciclo`.
*   **Tags de Semana:** Componente `TagList` editable.
    *   `+` Botón abre un popover con buscador de tags.
    *   Tags existentes tienen botón `x` para eliminar.

### B. Grid de Días (`WeeklyGrid`)
*   **Layout Desktop:** `grid grid-cols-7 gap-4`.
*   **Layout Tablet:** `grid grid-cols-3` o `grid-cols-4`.
*   **Layout Mobile:** `flex flex-col gap-4` (Lista vertical).

#### **Tarjeta de Día (`DayCard`)**
El componente más importante. Tiene dos estados:

**1. Estado Colapsado (Default):**
*   **Header:**
    *   Nombre del día (LUN, MAR...) en negrita.
    *   Lista compacta de tags (max 2, luego "+1").
*   **Body:**
    *   Título de la sesión (editable). Si está vacío: "Descanso".
    *   **Resumen Visual:** Iconos con métricas calculadas (Volumen total, RPE promedio).
*   **Footer:**
    *   Botón `Ver Detalles` (expande la tarjeta).
    *   Menú de opciones (`...`): Duplicar, Borrar, Mover.

**2. Estado Expandido (Inline):**
*   Rompe el grid y ocupa el 100% del ancho de su fila (o usa un modal en mobile).
*   Muestra la lista completa de **Bloques** y **Ejercicios**.
*   Permite edición detallada de cada set.

### C. Jerarquía de Contenidos

1.  **Bloque (`TrainingBlock`):**
    *   Contenedor visual con borde sutil.
    *   Header con Título del Bloque (ej. "Warm Up").
    *   `SortableContext` vertical para los ejercicios.
2.  **Ejercicio (`ExerciseRow`):**
    *   Fila con columnas alineadas.
    *   **Col 1:** Nombre + Link a video.
    *   **Col 2:** Inputs de Sets x Reps (ej. `3` x `10`).
    *   **Col 3:** Input de Carga/RPE (`@ RPE 8`).
    *   **Col 4:** Descanso (`90s`).
    *   **Col 5:** Notas (Input opcional expandible).

---

## 4. Sistema Drag & Drop (DnD)

Utilizaremos `@dnd-kit` por su modularidad y accesibilidad.

### Zonas de Aterrizaje (Drop Zones)
1.  **Día Completo:** Al soltar un ejercicio sobre una `DayCard` (colapsada), se añade al final del último bloque.
2.  **Bloque Específico:** Al soltar entre dos ejercicios de un bloque, se inserta en esa posición.
3.  **Nueva Semana:** Al soltar un día completo en el área vacía inferior, se crea una nueva semana.

### Feedback Visual (Drag Overlay)
*   **Dragging:** El elemento que se arrastra debe tener opacidad reducida y una sombra elevada (`shadow-xl`).
*   **Placeholder:** En la zona de destino, debe aparecer una línea azul o un espacio fantasma indicando dónde caerá el elemento.

---

## 5. Gestión de Datos y Estado

El Canvas **NO** gestiona el estado localmente, sino que consume y despacha acciones al `useProgramStore`.

*   **Lectura:** `const { weeks, activeWeekId } = useProgramStore()`
*   **Escritura:** `addExerciseToDay(dayId, exerciseData)`, `updateSet(setId, field, value)`.
*   **Optimizaciones:** Usar `React.memo` en `DayCard` y `ExerciseRow` para evitar re-renderizados masivos al escribir en un input.

---

## 6. Estados Vacíos (Empty States)

*   **Día Vacío:** Ilustración sutil (ej. una pesa gris) + Texto "Arrastra ejercicios aquí".
*   **Semana Vacía:** Botón grande punteado "Comenzar a diseñar semana".

---

## 7. Footer del Canvas

Barra de acciones al final del scroll.

*   **Botón [+ Agregar Semana]:** Crea una nueva estructura de 7 días vacía debajo de la actual.
*   **Botón [⚡ BatchTraining]:** Abre el modal wizard para progresiones masivas.
*   **Botón [📋 Copiar Programa]:** Duplica toda la estructura actual.