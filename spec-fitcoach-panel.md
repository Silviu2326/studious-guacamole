# 🤖 Especificaciones Técnicas Maestras: FitCoach Panel (Panel Derecho)

> **Versión:** 2.1 (Definitiva)
> **Propósito:** Definir la arquitectura, lógica conversacional, visualización de datos y sistema de notificaciones del asistente IA integrado.

Este componente es el "cerebro" auxiliar del editor. Su función no es solo chatear, sino **actuar** sobre el programa de entrenamiento, ofrecer análisis en tiempo real y prevenir errores de diseño.

---

## 1. Arquitectura Visual y Layout

### 1.1. Contenedor Principal (`<aside>`)
El `FitCoachPanel` reside en el lateral derecho.

| Propiedad | Valor | Descripción |
| :--- | :--- | :--- |
| **Tag HTML** | `<aside>` | Semántica correcta. |
| **Ancho** | `320px` (w-80) | Fijo en Desktop estándar. |
| **Ancho Max** | `400px` | En monitores Ultrawide (> 1920px), podría expandirse. |
| **Posición** | `Relative` | Dentro del layout flex principal. |
| **Borde** | `border-l border-gray-200` | Separación clara del canvas. |
| **Fondo** | `bg-white` | Base limpia. |
| **Estructura** | `flex flex-col h-full` | Header fijo, Body scrollable, Footer fijo (input). |

### 1.2. Estado de Colapso
El panel puede ser colapsado por el usuario para ganar espacio en el Canvas.
*   **Estado Colapsado:**
    *   Ancho: `48px` (w-12).
    *   Contenido: Solo iconos de las tabs en vertical.
    *   Interacción: Al hacer click en un icono, se expande el panel a esa tab.

---

## 2. Sistema de Navegación (Tabs)

El panel se organiza en 4 pestañas principales que definen el **modo de interacción**.

### A. Pestaña Chat (💬) - *Modo Activo*
*   **Icono:** `MessageSquare` (Lucide).
*   **Propósito:** Interfaz conversacional bidireccional.
*   **Componentes:**
    1.  **Lista de Mensajes:** `flex-1 overflow-y-auto p-4 space-y-4`.
    2.  **Input Area:** `sticky bottom-0 bg-white p-4 border-t`.

### B. Pestaña Insights (📊) - *Modo Analítico*
*   **Icono:** `BarChart2` (Lucide).
*   **Propósito:** Dashboards visuales sobre la estructura del programa.
*   **Gráficos Clave:**
    *   **Volumen Semanal:** Bar chart (Series por semana).
    *   **Distribución Muscular:** Pie/Donut chart (Ej. 40% Pierna, 60% Torso).
    *   **Patrones de Movimiento:** Radar chart (Push, Pull, Squat, Hinge, Carry).

### C. Pestaña Alertas (⚠️) - *Modo Validación*
*   **Icono:** `AlertTriangle` (Lucide).
*   **Badge:** Muestra contador rojo si hay errores críticos.
*   **Propósito:** Lista de problemas detectados por el sistema de reglas (Rule Engine).

### D. Pestaña Métricas (📈) - *Modo Proyección*
*   **Icono:** `TrendingUp` (Lucide).
*   **Propósito:** Datos numéricos duros y comparativas históricas.

---

## 3. Componentes del Chat (Conversational UI)

### A. Burbuja de Mensaje (Message Bubble)
*   **Usuario:**
    *   Alineación: Derecha.
    *   Estilo: `bg-indigo-600 text-white rounded-2xl rounded-tr-none`.
    *   Contenido: Texto plano.
*   **FitCoach (Bot):**
    *   Alineación: Izquierda.
    *   Avatar: Icono Robot/Rayo en círculo `bg-indigo-100`.
    *   Estilo: `bg-gray-100 text-gray-900 rounded-2xl rounded-tl-none border border-gray-200`.
    *   **Contenido Rico:** Puede contener Markdown básico (negritas, listas) y **Componentes Interactivos**.

### B. Suggestion Chips (Sugerencias Rápidas)
Botones tipo "píldora" que aparecen sobre el input area cuando el contexto lo permite.
*   *Ejemplos:* "Analizar fatiga", "Sugerir calentamiento", "Optimizar descansos".
*   *Estilo:* `border border-gray-300 rounded-full px-3 py-1 text-xs hover:bg-gray-50 transition`.

### C. Action Cards (Tarjetas de Acción)
Bloques especiales dentro de una respuesta del bot que permiten ejecutar cambios en el editor.
```tsx
// Ejemplo conceptual
<div className="card bg-white border p-3 rounded-lg shadow-sm mt-2">
  <h4 className="font-bold text-sm">Desbalance Detectado</h4>
  <p className="text-xs text-gray-600 mb-2">Ratio Push/Pull es 3:1. Recomendado 1:1.</p>
  <div className="flex gap-2">
    <button className="btn-primary-xs">Corregir (+Remo)</button>
    <button className="btn-secondary-xs">Ignorar</button>
  </div>
</div>
```

---

## 4. Lógica de Negocio e Integración IA

### 4.1. Contexto del Asistente
El asistente no es un chatbot genérico; tiene acceso al **Estado Global del Programa** (`ProgramStore`).
*   Sabe qué ejercicios hay en cada día.
*   Conoce el volumen total, RPE promedio, etc.
*   Identifica al cliente seleccionado.

### 4.2. Flujo de Datos (Simulado en Fase 1)
1.  Usuario envía mensaje: "Agrega un día de pierna el sábado".
2.  Sistema (Mock IA): Detecta palabras clave ("agregar", "día", "pierna", "sábado").
3.  Acción: Llama a la función del store `addDay({ name: 'Leg Day', day: 'Saturday', ... })`.
4.  Respuesta: "He agregado un día de pierna para el sábado con 4 ejercicios base."

---

## 5. Sistema de Alertas (Rule Engine)

El panel de alertas se alimenta de un motor de reglas que corre en tiempo real (o debounced) sobre el programa.

### Reglas Básicas (Fase 1)
1.  **Volumen Cero:** Un día creado no tiene ejercicios. -> 🟡 *Warning*
2.  **RPE Invalido:** RPE > 10 o < 1. -> 🔴 *Error*
3.  **Día Vacío:** Un día de la semana no tiene asignación (ni descanso ni entreno). -> 🟢 *Info*

### Estructura de Alerta
```typescript
interface Alert {
  id: string;
  level: 'critical' | 'warning' | 'info';
  message: string;
  action?: {
    label: string;
    handler: () => void;
  };
}
```

---

## 6. Accesibilidad (a11y)

*   **Región Live:** El contenedor de mensajes debe tener `aria-live="polite"` para que los lectores de pantalla anuncien las nuevas respuestas.
*   **Foco:** Al abrir el panel, el foco puede ir opcionalmente al Input.
*   **Contraste:** Asegurar que el texto gris del bot sobre fondo gris claro tenga suficiente contraste.

---

## 7. Comportamiento Responsive

| Breakpoint | Comportamiento |
| :--- | :--- |
| **Mobile** | **Drawer (Slide-over).** Ocupa 100% del ancho, z-index alto. Botón de cierre "X" visible. |
| **Tablet** | **Drawer (Slide-over).** Ocupa 320px fijos desde la derecha. Overlay oscuro sobre el canvas. |
| **Desktop** | **Columna Flex.** Comparte espacio horizontal con Library y Canvas. Puede colapsarse. |