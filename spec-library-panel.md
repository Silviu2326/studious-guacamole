# 📚 Especificaciones Técnicas Maestras: Library Panel (Panel Izquierdo)

> **Versión:** 2.1 (Definitiva)
> **Propósito:** Definir la arquitectura, comportamiento interactivo, gestión de datos y experiencia de usuario del panel de recursos (Biblioteca) del editor.

Este componente es el **almacén de activos** del entrenador. Su función principal es proveer acceso rápido, organizado y "arrastrable" a todos los elementos constructivos de un programa de entrenamiento.

---

## 1. Arquitectura Visual y Layout

### 1.1. Contenedor Principal
El `LibraryPanel` reside en el lateral izquierdo (`<aside>`) y mantiene una altura del 100% del viewport disponible.

| Propiedad | Valor | Descripción |
| :--- | :--- | :--- |
| **Tag HTML** | `<aside>` | Semántica correcta para contenido lateral. |
| **Ancho** | `240px` (w-60) | Fijo en Desktop. No redimensionable por el usuario (v1). |
| **Posición** | `Relative` | Dentro del layout flex principal. |
| **Borde** | `border-r border-gray-200` | Separación clara del canvas. |
| **Fondo** | `bg-white` | Contraste máximo con el canvas grisáceo. |
| **Estructura Flex** | `flex flex-col h-full` | Permite secciones fijas (header/footer) y scrollable (body). |

### 1.2. Zonas de Contenido (Grid Mental)

```text
[ HEADER DE NAVEGACIÓN (Tabs) ]   --> Altura fija (~48px)
[ BARRA DE HERRAMIENTAS (Search) ] --> Altura fija (~60px)
[ LISTA DE RECURSOS (Scrollable) ] --> Flex-1 (Ocupa el resto)
[ ACCIONES GLOBALES (Footer) ]     --> Altura fija (~60px)
```

---

## 2. Sistema de Navegación (Tabs)

El panel utiliza un patrón de pestañas superiores para cambiar el contexto de la biblioteca.

### Lógica de Estado
*   **Estado:** `activeTab` ('blocks' | 'exercises' | 'templates').
*   **Persistencia:** Guardar en `localStorage` la última pestaña abierta para mantener contexto entre recargas.

### A. Pestaña Bloques (📦)
*   **Icono:** `Box` (Lucide).
*   **Concepto:** Conjuntos predefinidos de ejercicios (ej. "Warmup General", "HIIT Core").
*   **Estructura de Datos (Item):**
    ```typescript
    interface LibraryBlock {
      id: string;
      name: string;
      type: 'warmup' | 'strength' | 'conditioning';
      exerciseCount: number;
      estimatedDuration: number; // minutos
    }
    ```

### B. Pestaña Ejercicios (🏋️) - *Default*
*   **Icono:** `Dumbbell` (Lucide).
*   **Concepto:** La unidad atómica de entrenamiento.
*   **Estructura de Datos (Item):**
    ```typescript
    interface LibraryExercise {
      id: string;
      name: string;
      muscleGroup: string[]; // ['Chest', 'Triceps']
      equipment: string;     // 'Barbell'
      videoUrl?: string;
      isFavorite: boolean;
    }
    ```

### C. Pestaña Plantillas (📋)
*   **Icono:** `LayoutTemplate` (Lucide).
*   **Concepto:** Estructuras de mesociclos o semanas completas.
*   **Comportamiento Especial:** Al arrastrar, no se inserta *dentro* de un día, sino que puede *reemplazar* o *poblar* días/semanas.

---

## 3. Barra de Herramientas (Search & Filter)

Ubicada justo debajo de las tabs.

### A. Buscador Inteligente
*   **Componente:** Input con icono de lupa a la izquierda.
*   **Comportamiento:**
    *   **Debounce:** 300ms para evitar filtrado excesivo en cada keystroke.
    *   **Fuzzy Search:** Usar algoritmo (tipo `fuse.js` o simple `includes`) que normalice acentos y case.
        *   *Ejemplo:* "Press" encuentra "Press Banca" y "Leg Press".
    *   **Clearable:** Icono `X` a la derecha aparece cuando hay texto. Click limpia el input.

### B. Filtros Avanzados (Popover)
*   **Trigger:** Botón de texto/icono "Filtros" o icono de embudo.
*   **Interfaz:** Popover flotante.
*   **Filtros Disponibles:**
    *   **Grupo Muscular:** Checkbox list (Pecho, Espalda, Pierna...).
    *   **Equipamiento:** Checkbox list (Mancuerna, Barra, Máquina, Peso Corporal).
    *   **Patrón de Movimiento:** (Push, Pull, Squat, Hinge).

---

## 4. Lista de Recursos (List View)

El corazón del panel. Una lista virtualizada para rendimiento óptimo.

### A. Tarjeta de Recurso (Draggable Card)
Cada item en la lista es una tarjeta interactiva.

*   **Estilos Base:**
    *   `p-3 rounded-lg border border-transparent hover:border-blue-200 hover:bg-blue-50 cursor-grab active:cursor-grabbing transition-all group`.
*   **Contenido Visual:**
    *   **Izquierda:** Thumbnail pequeño o Icono representativo (ej. mancuerna SVG) sobre fondo gris suave.
    *   **Centro:**
        *   **Título:** Texto principal (Nombre ejercicio). `text-sm font-medium text-gray-900 truncate`.
        *   **Subtítulo:** Metadatos (Músculo • Equipo). `text-xs text-gray-500 truncate`.
    *   **Derecha (Hover Actions):**
        *   Botón `+` (Agregar rápido).
        *   Botón `i` (Info modal).
*   **Interacción DnD (Drag & Drop):**
    *   Usar `@dnd-kit/core` y `@dnd-kit/sortable`.
    *   **Drag Overlay:** Al arrastrar, mostrar una versión semitransparente y compacta de la tarjeta pegada al cursor.
    *   **Data Transfer:** El objeto arrastrado debe contener todo el payload del ejercicio/bloque para hidratar el Drop Zone.

### B. Agrupación (Headers)
Para la pestaña Ejercicios, usar "Sticky Headers" dentro de la lista:
1.  **Favoritos:** (Si existen).
2.  **Recientes:** (Últimos 5 usados).
3.  **Todos:** (Orden alfabético).

---

## 5. Footer de Acciones

Zona fija en la parte inferior.

*   **Botón Principal:** `w-full` botón primario (negro/gris oscuro).
*   **Texto Dinámico:**
    *   Tab Ejercicios -> `+ Crear Ejercicio`
    *   Tab Bloques -> `+ Crear Bloque`
    *   Tab Plantillas -> `+ Guardar Plantilla`
*   **Acción:** Abre un Modal de creación correspondiente al contexto.

---

## 6. Estados de Interfaz (UI States)

### A. Estado de Carga (Loading)
*   Mostrar **Skeleton Loaders** (rectángulos grises pulsantes) simulando la estructura de 5-6 tarjetas.
*   Evitar "layout shift" manteniendo la altura de los elementos.

### B. Estado Vacío (Empty)
*   **Búsqueda sin resultados:** Icono lupa rota + "No encontramos 'xyz'". Botón "Limpiar búsqueda".
*   **Colección vacía:** Icono de la categoría + "Aún no hay bloques creados". Flecha apuntando al botón de crear.

### C. Estado de Error
*   Mensaje sutil en rojo "Error al cargar recursos" + Botón de refrescar icono.

---

## 7. Accesibilidad (a11y)

*   **Teclado:**
    *   Las Tabs deben ser navegables con flechas izquierda/derecha.
    *   La lista de items debe ser navegable con flechas arriba/abajo.
    *   `Enter` en un item debe simular la acción de "Agregar al primer hueco disponible".
*   **Drag & Drop Accesible:**
    *   Implementar modo de teclado para DnD (Espacio para levantar, Flechas para mover, Espacio para soltar) si es posible con `@dnd-kit`.
*   **Labels:**
    *   Inputs y botones de solo icono deben tener `aria-label` descriptivos.

---

## 8. Comportamiento Responsive

| Breakpoint | Comportamiento |
| :--- | :--- |
| **Mobile** | **Oculto por defecto.** Se accede mediante un botón flotante `+` o pestaña inferior "Biblioteca". Al activarse, sube como un **Bottom Sheet** (Drawer inferior) que ocupa el 50-80% de la pantalla. |
| **Tablet** | **Drawer Lateral.** Se desliza desde la izquierda sobre el contenido (overlay) al pulsar un botón de menú. |
| **Desktop** | **Visible y Fijo.** Ocupa su columna de `240px` permanentemente. |

---

## 9. Integración de Datos (Mock Data Structure)

Para la Fase 1 y 2, usaremos datos estáticos (Mocks) definidos en `src/data/libraryMocks.ts`.

```typescript
// Ejemplo de estructura de datos esperada para renderizar
export const MOCK_EXERCISES = [
  { id: '1', name: 'Bench Press', muscle: 'Chest', equipment: 'Barbell', favorite: true },
  { id: '2', name: 'Squat', muscle: 'Legs', equipment: 'Barbell', favorite: true },
  // ... 20 items más
];
```