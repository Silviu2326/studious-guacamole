# 🚀 Plan de Acción Maestro: Editor de Entrenamiento Definitivo v2.0

Este documento detalla la hoja de ruta técnica para construir el mejor editor de entrenamiento del mundo, basado en `@diagramas_visuales_mejorados.md` y `@editor_entrenamiento_definitivo.md`.

---

## 🏗️ FASE 1: LA ESTRUCTURA BASE (SKELETON)
**Objetivo:** Crear la arquitectura visual inamovible. Al terminar esta fase, la aplicación debe "parecer" el editor final, aunque los botones no hagan nada y los datos sean estáticos (hardcoded).

### 1.1. Configuración del Entorno y Rutas
- [ ] **Estructura de Carpetas:** Crear `src/features/EditorEntrenamiento` con subcarpetas: `components`, `hooks`, `layouts`, `types`, `assets`.
- [ ] **Definición de Tipos Core (`types/training.ts`):** Definir interfaces para `Program`, `Week`, `Day`, `Block`, `Exercise`, `Set`.
- [ ] **Routing:** Configurar la ruta `/editor` que cargue el layout principal.

### 1.2. Layout Principal (The Shell)
Implementar el diseño de "4 Paneles + Top Bar" descrito en la arquitectura.
- [ ] **Top Bar:** Componente fijo (64px alto).
    - Logo, Selector de Cliente (Dropdown UI solo), Estado de Guardado (Badge), Toggle FitCoach, Avatar.
- [ ] **Grid Container:** CSS Grid/Flex que maneje:
    - **Panel Izquierdo (Library):** Ancho fijo 240px.
    - **Panel Central (Canvas):** Flexible (flex-1).
    - **Panel Derecho (FitCoach):** Ancho fijo 320px (colapsable).

### 1.3. Esqueletos de los Paneles (Placeholders)
- [ ] **Panel Izquierdo (Tabs):** UI de pestañas "Bloques", "Ejercicios", "Plantillas". Lista vacía visualmente correcta.
- [ ] **Panel Central (View Switcher):**
    - Header del programa (Semana X, Tags).
    - Selector de Vistas: [Semanal] [Excel] [Timeline].
    - **Renderizado condicional:** Crear 3 componentes vacíos (`WeeklyView`, `ExcelView`, `TimelineView`) que solo muestren un texto "Work in Progress".
- [ ] **Panel Derecho (FitCoach):**
    - Tabs: Chat, Insights, Alertas, Métricas.
    - Chat UI estática (burbuja de mensaje del bot y del usuario).

---

## 🚀 FASE 2: IMPLEMENTACIÓN PROFUNDA (SECCIÓN POR SECCIÓN)
**Objetivo:** Dar vida a cada módulo, priorizando la "Usabilidad Percibida" y la interacción fluida.

### 🌊 MÓDULO A: EL CORAZÓN (VISTA SEMANAL INTERACTIVA)
*La vista por defecto. Debe sentirse increíblemente rápida.*

1.  **Renderizado de Datos:**
    - [ ] Mapear un JSON de prueba (mock data) a la grilla de días.
    - [ ] Componente `DayCard`: Header (Lunes, Tags), Body (Resumen bloques), Footer (Métricas).
2.  **Estado Expandido (Inline):**
    - [ ] Lógica de acordeón: Al hacer click en `[+Info]`, el día se expande desplazando el contenido.
    - [ ] Componente `BlockRow`: Visualización de bloques dentro del día.
    - [ ] Componente `ExerciseRow`: Filas de ejercicios con series/reps.
3.  **Drag & Drop (DnD Kit):**
    - [ ] **Nivel 1:** Reordenar ejercicios dentro de un bloque.
    - [ ] **Nivel 2:** Mover bloques entre días.
    - [ ] **Nivel 3:** Mover días completos en la semana.
4.  **Sistema de Tags (Días):**
    - [ ] UI de Tags en la cabecera del día.
    - [ ] Dropdown de autocompletado para agregar tags (#Fuerza, #Upper).

### 📚 MÓDULO B: BIBLIOTECA INTELIGENTE (PANEL IZQUIERDO)
*El origen de los datos.*

1.  **Pestaña Ejercicios:**
    - [ ] Lista virtualizada (para manejar +1000 ejercicios).
    - [ ] Filtros (Musculo, Equipamiento).
    - [ ] **Modal de Detalle:** Video, instrucciones, variaciones (según diseño).
2.  **Pestaña Bloques & Plantillas:**
    - [ ] Tarjetas de Bloques predefinidos.
3.  **Interacción Library -> Canvas:**
    - [ ] Habilitar Drag & Drop desde el Panel Izquierdo hacia el Panel Central (agregar ejercicio/bloque al día).

### 🤖 MÓDULO C: FITCOACH (PANEL DERECHO)
*La inteligencia artificial y asistencia.*

1.  **Chat Interface:**
    - [ ] Componente de chat con scroll automático.
    - [ ] **Quick Actions:** Botones predefinidos ("Optimizar semana", "Analizar fatiga").
2.  **Panel de Insights:**
    - [ ] Gráficos simples (Recharts/Chart.js) para Volumen Semanal y Balance Muscular.
    - [ ] Visualización de Alertas (Críticas/Advertencias).

### 📊 MÓDULO D: VISTA EXCEL (PROFESIONAL)
*Para los usuarios avanzados.*

1.  **TanStack Table (React Table):**
    - [ ] Implementar tabla con jerarquía expandible (Semana -> Día -> Bloque -> Ejercicio).
2.  **Edición Inline:**
    - [ ] Convertir celdas de texto en inputs al hacer click.
    - [ ] Propagación de cambios al estado global.
3.  **Funciones Masivas:**
    - [ ] Selección múltiple de filas (checkboxes).
    - [ ] Botón de "Edición Masiva" que abre el modal de cambios grupales.

### ⚡ MÓDULO E: BATCH TRAINING (WIZARD)
*La funcionalidad "Killer".*

1.  **El Modal/Wizard:**
    - [ ] Implementar máquina de estados para el Wizard (Paso 1, 2, 3).
2.  **Lógica de Progresión:**
    - [ ] Algoritmo de "Progresión Lineal": `(input: semanas, incremento) => output: programa actualizado`.
    - [ ] Vista Previa (Diff View): Mostrar "Antes -> Después" visualmente.

### 📈 MÓDULO F: VISTA TIMELINE Y PULIDO
*La visión macro.*

1.  **Timeline View:**
    - [ ] Visualización horizontal de Mesociclos y Microciclos.
    - [ ] Gráficos de carga superpuestos.
2.  **Command Palette (Cmd+K):**
    - [ ] Implementar buscador global de comandos y navegación (`cmdk` package).
3.  **Refinamiento Visual:**
    - [ ] Micro-interacciones (hover states, transiciones suaves).
    - [ ] Animaciones de "Guardado", "Éxito", "Error".

---

## 🛠️ STACK TÉCNICO SUGERIDO
- **Core:** React, TypeScript, Vite.
- **Estado:** Zustand (por su simplicidad y rendimiento fuera del ciclo de renderizado de React).
- **Estilos:** Tailwind CSS (para velocidad y consistencia con el diseño).
- **Iconos:** Lucide React / Heroicons.
- **Drag & Drop:** `@dnd-kit/core` y `@dnd-kit/sortable` (más moderno y modular que react-beautiful-dnd).
- **Tablas:** `@tanstack/react-table`.
- **Gráficos:** `recharts`.
- **Utilidades:** `clsx`, `tailwind-merge` (para componentes reutilizables).
