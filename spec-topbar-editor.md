# 📐 Especificaciones Técnicas Maestras: Top Bar (Editor de Entrenamiento)

> **Versión:** 2.1 (Definitiva)
> **Propósito:** Definir con precisión quirúrgica el comportamiento, diseño, estados y lógica de negocio de la barra superior del editor.

Este componente no es solo una barra de navegación; es el **centro de control contextual** del editor. Maneja la identidad del usuario, el contexto del cliente actual, el estado de persistencia de datos y el acceso a la inteligencia artificial.

---

## 1. Arquitectura Visual y Layout

### 1.1. Contenedor Principal
El `TopBar` actúa como el `header` global de la aplicación dentro del contexto del editor.

| Propiedad | Valor | Descripción |
| :--- | :--- | :--- |
| **Tag HTML** | `<header>` | Semántica correcta. |
| **Altura** | `64px` (h-16) | Altura fija para garantizar alineación vertical. |
| **Posición** | `Sticky` (`top-0`) | Siempre visible al hacer scroll. |
| **Z-Index** | `50` | Por encima del canvas y paneles laterales, pero debajo de modales (z-100). |
| **Fondo** | `bg-white` | Blanco puro para limpieza visual. |
| **Borde** | `border-b border-gray-200` | Separación sutil del contenido. |
| **Padding** | `px-4` (Mobile) / `px-6` (Desktop) | Espaciado lateral responsivo. |
| **Flexbox** | `flex items-center justify-between` | Distribución espacial estándar. |

### 1.2. Zonas de Contenido (Grid Mental)

```text
[ ZONA IZQUIERDA (25%) ]       [ ZONA CENTRAL (50%) ]       [ ZONA DERECHA (25%) ]
.flex .justify-start           .flex .justify-center        .flex .justify-end
- Logo                         - (Espacio vacío o           - Estado Guardado
- Separador                      alertas globales)          - FitCoach Toggle
- Selector Cliente                                          - Separador
                                                            - Acciones User
```

---

## 2. Componentes Detallados y Lógica de Negocio

### A. Área de Marca (Logo)
*El ancla visual de la aplicación.*

*   **Interacción:**
    *   **Click:** Navega a `/dashboard` (fuera del editor).
    *   **Hover:** Cursor pointer, opacidad 80%.
*   **Estructura DOM:**
    ```html
    <a href="/dashboard" class="flex items-center gap-2 group">
      <div class="w-8 h-8 bg-blue-600 text-white rounded-lg flex-center shadow-sm group-hover:bg-blue-700 transition">
        <!-- SVG Isotipo -->
      </div>
      <span class="font-bold text-xl text-gray-900 hidden lg:block tracking-tight">FitPro</span>
    </a>
    ```

### B. Selector de Cliente (Context Switcher) 🌟 *Core Feature*
*Permite cambiar el contexto de edición sin salir de la pantalla.*

*   **Componente:** `ClientSelector.tsx` (Dropdown personalizado con `Headless UI` o `Radix UI`).
*   **Estado Visual (Trigger):**
    *   **Avatar:** Círculo `24px` con iniciales (ej. "ML"). Fondo dinámico basado en hash del nombre o color asignado al cliente.
    *   **Nombre:** `text-sm font-medium text-gray-700`. Truncar con `...` si > 20 caracteres.
    *   **Icono:** `ChevronDown` (`w-4 h-4 text-gray-400`). Rota 180° cuando está abierto.
    *   **Separador:** Línea vertical `h-6 w-px bg-gray-200` que lo separa del logo.
*   **Dropdown (Menú Desplegable):**
    *   **Ancho:** `320px`.
    *   **Animación:** `transition-all duration-200 origin-top-left`.
    *   **Contenido:**
        1.  **Buscador Sticky:** Input `autofocus` al abrir. Icono lupa. Placeholder: "Buscar cliente...".
        2.  **Sección 'Actual':** Muestra al cliente seleccionado con un indicador de estado (Activo/Pausado) y detalles del programa actual (Nombre, Semana X/Y).
        3.  **Lista Virtualizada:** Si hay > 50 clientes, usar virtualización.
        4.  **Footer:** Botón `+ Nuevo Cliente` (azul, ancho completo) y `Ver todos`.
*   **Lógica de Negocio:**
    *   Al seleccionar un cliente, **NO recargar la página**. Usar `React Router` o estado global para cambiar el `clientId` y disparar un `refetch` de los datos del programa.
    *   Mostrar `Skeleton Loader` en el Canvas mientras se carga el nuevo cliente.

### C. Indicador de Estado de Guardado (Auto-save Feedback)
*Comunicación crítica de integridad de datos.*

*   **Lógica:** Se conecta al store global (`useProgramStore`) para escuchar cambios (`isDirty`, `isSaving`, `lastSavedAt`).
*   **Estados:**
    1.  **Inactivo (Pristine):** Nada que guardar. Texto: "Guardado". Icono: `Check` gris.
    2.  **Modificado (Dirty):** El usuario hizo un cambio, esperando debounce. Texto: "Esperando...".
    3.  **Guardando (Saving):** Petición API en vuelo.
        *   **UI:** Spinner SVG `animate-spin` + Texto "Guardando...".
        *   **Color:** Texto `text-blue-600`.
    4.  **Guardado Exitoso (Success):**
        *   **UI:** Icono `CloudCheck` + Texto "Guardado hace X min" (usar `date-fns/formatDistanceToNow`).
        *   **Color:** `text-gray-500`.
    5.  **Error (Failure):**
        *   **UI:** Icono `AlertCircle` + Texto "Error al guardar".
        *   **Color:** `text-red-600`.
        *   **Interacción:** Tooltip con el error + Botón "Reintentar".

### D. Toggle FitCoach (IA Assistant)
*El acceso a la "magia" de la app.*

*   **Componente:** Botón tipo "Toggle" o "Switch" estilizado como botón.
*   **Estado Activo (Panel Abierto):**
    *   Fondo: `bg-indigo-100`.
    *   Texto: `text-indigo-700`.
    *   Borde: `border-indigo-200`.
*   **Estado Inactivo (Panel Cerrado):**
    *   Fondo: `bg-white` o `transparent`.
    *   Texto: `text-gray-600`.
    *   Hover: `bg-gray-50`.
*   **Badge de Notificación:**
    *   Si FitCoach genera una nueva sugerencia (sin abrir el panel), mostrar un punto rojo o un contador sobre el icono.

### E. Menú de Usuario y Configuración
*Acceso a preferencias globales.*

*   **Avatar de Usuario:** Foto de perfil del entrenador o iniciales.
*   **Dropdown de Perfil:**
    *   Items: "Mi Perfil", "Suscripción", "Team Settings", "Cerrar Sesión".
*   **Botón Configuración (Engranaje):**
    *   Abre un **Modal de Preferencias del Editor**:
        *   Unidades por defecto (kg/lbs).
        *   Tema (Claro/Oscuro).
        *   Densidad de la interfaz (Compacta/Cómoda).
        *   Atajos de teclado (Ver/Editar).

---

## 3. Comportamiento Responsive (Breakpoints)

El `TopBar` debe adaptarse elegantemente a diferentes anchos de pantalla.

| Breakpoint | Ancho | Comportamiento |
| :--- | :--- | :--- |
| **Mobile** | `< 640px` | **Logo:** Oculto. <br> **Menú:** Botón Hamburguesa (abre Sidebar flotante). <br> **Cliente:** Solo muestra el Nombre (sin avatar). <br> **Derecha:** Solo Avatar de usuario. <br> **FitCoach:** Se mueve a una barra de navegación inferior o botón flotante (FAB). |
| **Tablet** | `640px - 1024px` | **Logo:** Visible (Solo icono). <br> **Cliente:** Completo. <br> **Estado Guardado:** Solo icono (sin texto). <br> **FitCoach:** Visible (Icono). |
| **Desktop** | `> 1024px` | **Todo Visible:** Layout completo descrito en la sección 1. |

---

## 4. Accesibilidad (a11y)

*   **Navegación por Teclado:**
    *   Todos los elementos interactivos (`button`, `a`, `input`) deben ser focusables (`Tab`).
    *   El foco debe tener un indicador visual claro (`ring-2 ring-blue-500`).
*   **ARIA Attributes:**
    *   Selector Cliente: `aria-haspopup="true"`, `aria-expanded="true/false"`.
    *   Iconos: `aria-hidden="true"` para iconos decorativos. `aria-label="Descripción"` para botones de solo icono.
    *   Notificaciones: `role="status"` para el indicador de guardado.
*   **Contraste:**
    *   Asegurar ratio 4.5:1 para texto normal.

---

## 5. Integración de Estado (State Management)

El `TopBar` no debe manejar lógica compleja internamente, sino consumir hooks o stores.

```typescript
// Ejemplo conceptual de integración
const TopBar = () => {
  const { client, setClient } = useClientStore();
  const { savingStatus, lastSaved } = useEditorStore();
  const { isFitCoachOpen, toggleFitCoach } = useUIStore();
  
  // Render...
}
```

---

## 6. Atajos de Teclado Globales

La barra debe informar o reaccionar a ciertos atajos:

*   **`Cmd/Ctrl + K`**: Dispara el foco en el input de búsqueda del Selector de Cliente.
*   **`Cmd/Ctrl + /`**: Alterna la visibilidad del panel FitCoach.
*   **`Cmd/Ctrl + S`**: Fuerza un guardado manual (feedback visual inmediato en el indicador).

---

## 7. Paleta de Colores (Tailwind CSS Tokens)

*   **Superficie:** `bg-white`
*   **Borde:** `border-gray-200` (#E5E7EB)
*   **Texto Primario:** `text-gray-900` (#111827) - Inter, 500/600 weight.
*   **Texto Secundario:** `text-gray-500` (#6B7280) - Inter, 400 weight.
*   **Brand/Action:** `text-blue-600` (#2563EB)
*   **FitCoach Brand:** `text-indigo-600` (#4F46E5)
*   **Danger/Error:** `text-red-600` (#DC2626)
*   **Success:** `text-green-600` (#16A34A)

---

## 8. Animaciones (Micro-interacciones)

*   **Dropdowns:** `enter="transition ease-out duration-100"`, `enterFrom="transform opacity-0 scale-95"`, `enterTo="transform opacity-100 scale-100"`.
*   **Botones:** `active:scale-95` (efecto de pulsación sutil).
*   **Spinner:** `animate-spin` (linear, infinite).