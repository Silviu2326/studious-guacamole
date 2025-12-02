# 📘 Documentación Técnica Completa: Editor de Entrenamiento

**Versión del Documento:** 2.0 (Detallada)
**Ruta Raíz del Módulo:** `@src/features/EditorEntrenamiento`

Este documento sirve como la fuente de verdad técnica para el módulo del Editor de Entrenamiento. Describe cada archivo, su responsabilidad, su estado interno, sus interfaces y sus interacciones con el resto del sistema.

---

## 🏗️ Arquitectura General

El Editor de Entrenamiento está construido sobre una arquitectura basada en **Contextos** (`ProgramContext`, `UIContext`) que alimentan una interfaz de usuario rica e interactiva dividida en tres áreas principales:
1.  **Sidebar Izquierdo (LibraryPanel):** Fuente de recursos (ejercicios, bloques).
2.  **Centro (EditorCanvas):** Área de composición donde se construye el programa.
3.  **Sidebar Derecho (FitCoachPanel):** Asistencia, métricas y feedback en tiempo real.

---

## 📂 1. Componentes Principales (`components/`)

Componentes de UI que forman la estructura básica o son compartidos a alto nivel.

### `AutoSaveIndicator.tsx`
*   **Tipo:** Componente Funcional (UI).
*   **Responsabilidad:** Informar al usuario sobre el estado de las operaciones de guardado en segundo plano.
*   **Props:**
    *   `status`: `'saving' | 'saved' | 'error'`.
    *   `lastSavedAt`: Fecha del último guardado exitoso.
    *   `onRetry`: Callback para reintentar en caso de error.
*   **Comportamiento:** Cambia entre un spinner de carga, un check verde y un icono de alerta roja. Muestra el tiempo relativo ("hace 5 min") usando `date-fns`.

### `ClientSelector.tsx`
*   **Tipo:** Componente Interactivo (Dropdown).
*   **Responsabilidad:** Permitir al entrenador cambiar entre diferentes clientes simulados para editar sus programas.
*   **Estado Interno:** Gestión de apertura del menú y filtrado de la lista de clientes por texto.
*   **Interacciones:**
    *   Al seleccionar cliente: Actualiza el estado local `selectedClient` (Mock).
    *   Botón "Nuevo Programa con IA": Dispara `setAIProgramGeneratorOpen(true)` del `UIContext`.

### `DragPreview.tsx`
*   **Tipo:** Componente de Utilidad (DND).
*   **Responsabilidad:** Renderizar la "imagen fantasma" que sigue al cursor cuando el usuario arrastra un elemento.
*   **Dependencias:** `useDndContext` de `@dnd-kit/core`.
*   **Lógica:**
    *   Detecta qué tipo de ítem se arrastra (`itemType`).
    *   Si es `block`, `exercise` o `template`: Renderiza una `LibraryCard` rotada.
    *   Si es `day`: Renderiza una tarjeta de día compacta.
    *   **Validación Visual:** Detecta si el `over` (destino) es válido. Si se intenta soltar un bloque dentro de un ejercicio (inválido), muestra un borde rojo e icono de prohibido.

### `EditorCanvas.tsx`
*   **Tipo:** Componente Estructural (Core).
*   **Responsabilidad:** Contenedor principal del área de trabajo. Decide qué vista renderizar.
*   **Dependencias:** `ProgramContext`, `UIContext`, `UserPreferencesContext`.
*   **Estado:**
    *   `viewMode`: Controla si se ve la vista Semanal, Excel o Timeline.
    *   `activeFilters` / `searchTerm`: Filtra los días mostrados.
*   **Interacciones:**
    *   **Drag & Drop:** Define las zonas de caída para los días.
    *   **Atajos:** Inicializa `useKeyboardShortcuts`.
    *   **Botones Flotantes:** "Agregar Semana", "BatchTraining" (abre modal), "Copiar Programa".

### `FitCoachPanel.tsx`
*   **Tipo:** Panel Lateral Inteligente.
*   **Responsabilidad:** Proveer asistencia, análisis y chat simulado.
*   **Dependencias:** `useFitCoach` (hook de lógica), `ProgramContext` (datos reales).
*   **Sub-componentes:**
    *   **Chat:** Interfaz de mensajes.
    *   **Insights:** Grafico de radar (`InsightsPanel`).
    *   **FatigueChart:** Gráfico de carga aguda/crónica alimentado por `weeks`.
    *   **Alertas:** Lista de advertencias generadas por reglas de validación.

### `GlobalFilterBar.tsx`
*   **Tipo:** Barra de Herramientas.
*   **Responsabilidad:** Proveer controles para filtrar el contenido del canvas.
*   **Props:** Callbacks para `onSearchChange` y `onToggleFilter`.
*   **Uso:** Permite al usuario escribir "press banca" y ver solo los días que contienen ese ejercicio.

### `LibraryCard.tsx`
*   **Tipo:** Componente UI (Tarjeta).
*   **Responsabilidad:** Representar visualmente un ítem en la biblioteca.
*   **Props:** `type` (determina el icono), `title`, `subtitle`.

### `LibraryPanel.tsx`
*   **Tipo:** Sidebar Izquierdo.
*   **Responsabilidad:** Listar los recursos disponibles para arrastrar.
*   **Dependencias:** `useTemplateManager` (para listar plantillas guardadas).
*   **Estado:** Pestaña activa ('blocks', 'exercises', 'templates').
*   **Lógica:**
    *   Filtra `MOCK_EXERCISES` y `MOCK_BLOCKS` basado en búsqueda.
    *   Envuelve cada ítem en un `useDraggable` de `dnd-kit` para permitir su arrastre hacia el Canvas.

### `MobileDayView.tsx`
*   **Tipo:** Vista Adaptativa.
*   **Responsabilidad:** Renderizar el programa en pantallas móviles donde el grid completo no cabe.
*   **Lógica:** Muestra un solo `DayCard` a la vez con navegación horizontal (carrusel).

### `ProgramHeader.tsx`
*   **Tipo:** Formulario en Canvas.
*   **Responsabilidad:** Editar metadatos del programa (Título, Fase, Tags Globales).
*   **Componentes:** Usa `TagInput` y `Select` reutilizables.

### `TopBar.tsx`
*   **Tipo:** Navegación Superior.
*   **Responsabilidad:** Acciones globales y navegación.
*   **Interacciones:**
    *   `Undo`/`Redo`: Llama a métodos de `ProgramContext`.
    *   `Export`: Abre `ExportModal`.
    *   `FitCoach`: Alterna la visibilidad del panel derecho.
    *   `Sync`: Muestra estado de conexión offline.

### `UserActionsMenu.tsx`
*   **Tipo:** Dropdown.
*   **Responsabilidad:** Menú de perfil de usuario. Acceso a `PreferencesModal` y `TagManagerModal`.

---

## 📂 2. Canvas Internals (`components/canvas/`)

La "maquinaria" interna del grid de edición.

### `CollaboratorsIndicator.tsx`
*   **Responsabilidad:** Mostrar quién más está editando (Multijugador simulado).
*   **Dependencias:** `CollaborationContext`.

### `DayCard.tsx`
*   **Responsabilidad:** Representar un día (columna/tarjeta).
*   **Características Clave:**
    *   Es un `useDroppable`: Acepta items de la librería.
    *   Contiene la lista de `TrainingBlock`s.
    *   Muestra feedback del cliente (RPE sesión, dolor) si existe.
    *   Menú contextual para operaciones de día (Copiar, Smart Fill).

### `EmptyDayState.tsx` & `EmptyWeekState.tsx`
*   **Responsabilidad:** UI de "estado vacío" para guiar al usuario cuando no hay contenido (CTAs para usar IA o copiar).

### `ExerciseRow.tsx` (y `SortableExerciseRow`)
*   **Responsabilidad:** La unidad atómica de edición. Representa un ejercicio.
*   **Lógica Compleja:**
    *   Inputs para `sets`, `reps`, `rpe`, `rest`.
    *   **Cálculo de Carga:** Detecta si el usuario escribe un % (ej. "80%") y calcula el peso en kg basado en el 1RM del cliente (usando `calculateLoad`).
    *   **Multimodo:** Puede renderizarse en modo "edit" (inputs) o "review" (texto estático).

### `TrainingBlock.tsx`
*   **Responsabilidad:** Agrupar ejercicios.
*   **Características:**
    *   Encapsula un `SortableContext` para permitir reordenar ejercicios dentro del bloque.
    *   Maneja selección múltiple de ejercicios para agruparlos (Superseries).
    *   Integra `TimerWidget` si el bloque es de tipo "Conditioning" o "EMOM".

### `WeeklySummaryFooter.tsx`
*   **Responsabilidad:** Dashboard estadístico al pie de cada semana.
*   **Cálculos:** Recorre todos los días de la semana para sumar:
    *   Volumen total (sets).
    *   Tonelaje (kg * reps).
    *   Distribución de zonas (Fuerza vs Hipertrofia vs Metabólico) para el gráfico circular.

---

## 📂 3. Colaboración (`components/collaboration/`)

### `CollaboratorCursors.tsx`
*   **Lógica:** Envuelve un componente (ej. `ExerciseRow`). Si `CollaborationContext` indica que otro usuario tiene el foco en ese ID, renderiza un borde de color y una etiqueta "Usuario X está editando...".

### `CommentThread.tsx`
*   **Lógica:** Pequeña interfaz de chat asociada a un ID de ejercicio específico. Permite dejar notas o discusiones entre entrenador y cliente.

---

## 📂 4. Comunes (`components/common/`)

*   **`ContextMenu.tsx`**: Implementación de portal para menús click derecho.
*   **`TagInput.tsx`**: Input sofisticado que tokeniza el texto en "chips" de colores. Soporta autocompletado.

---

## 📂 5. Feedback (`components/feedback/`)

*   **`ToastSystem.tsx`**: Sistema de notificaciones. Expone `useEditorToast` para disparar alertas efímeras (Success, Error, Info) desde cualquier parte de la app.

---

## 📂 6. Modales (`components/modals/`)

### `AIProgramGenerator.tsx`
*   **Funcionalidad:** Wizard paso a paso para crear programas desde cero.
*   **Flow:** Objetivo -> Días/Semana -> Limitaciones -> Generación (Barra de progreso simulada).

### `BatchTraining/BatchTrainingModal.tsx`
*   **Funcionalidad:** Orquestador de la edición masiva.
*   **Lógica:** Renderiza los pasos (`StepSelection`, `StepConfiguration`, `StepPreview`) y maneja la navegación entre ellos. Recibe `selectedAction` del hook `useBatchTraining`.

### `BatchTraining/StepConfiguration.tsx`
*   **Funcionalidad:** Formulario dinámico según la acción elegida.
*   **Uso:** Configura incrementos (+2.5%, +1 set) y rangos de semanas (1-4). Actualiza el objeto `config` del hook.

### `BatchTraining/StepPreview.tsx`
*   **Funcionalidad:** Muestra un resumen de texto y alertas antes de ejecutar la acción masiva.

### `BatchTraining/StepSelection.tsx`
*   **Funcionalidad:** Grid de tarjetas para elegir qué operación masiva realizar (Duplicar, Progresión, etc.).

### `ExerciseDetailModal.tsx`
*   **Funcionalidad:** Muestra información profunda del ejercicio seleccionado.
*   **Tabs:** Info técnica, Historial de cargas, Alternativas biomecánicas, Subida de video propio.

### `ExportModal.tsx`
*   **Funcionalidad:** Configuración de exportación a PDF/Excel/App.

### `PreferencesModal.tsx`
*   **Funcionalidad:** Ajustes de usuario (Unidades Kg/Lbs, Densidad Compacta/Cómoda). Actualiza `UserPreferencesContext`.

### `SaveTemplateModal.tsx`
*   **Funcionalidad:** Guarda el estado actual de `daysData` en `localStorage` como plantilla. Incluye opción "Sanitizar" para borrar las cargas absolutas.

### `SmartFillModal.tsx`
*   **Funcionalidad:** Formulario para configurar el algoritmo `SmartFill` (tiempo disponible, material).

### `TagManagerModal.tsx`
*   **Funcionalidad:** CRUD completo para las etiquetas globales del sistema. Permite fusionar tags duplicados.

### `VersionHistoryModal.tsx`
*   **Funcionalidad:** "Máquina del tiempo". Lista snapshots guardados por `VersioningService` y permite revertir el estado global a uno anterior.

---

## 📂 7. Onboarding & 8. Overlays

*   **`EditorTour.tsx`**: Tour guiado usando resaltado de elementos DOM.
*   **`CommandPalette.tsx`**: Buscador global (Cmd+K). Permite ejecutar acciones sin ratón (navegar, crear días, abrir modales).

---

## 📂 9. Paneles (`components/panels/`)

*   **`InsightsPanel.tsx`**: Componente de visualización de datos. Calcula la distribución de patrones de movimiento (Empuje/Tracción/Pierna) y renderiza un gráfico de radar.

---

## 📂 10. Preview (`components/preview/`)

*   **`ClientMobilePreview.tsx`**: Un "iframe simulado" que muestra cómo se ve el entrenamiento actual en la interfaz móvil del cliente. Es interactivo (se pueden marcar sets como completados).

---

## 📂 11. Herramientas (`components/tools/`)

*   **`TimerWidget.tsx`**: Cronómetro flotante y arrastrable. Soporta modos: Cronómetro simple, Cuenta atrás y Intervalos (Trabajo/Descanso) para bloques metabólicos.

---

## 📂 12. Vistas (`components/views/`)

### `ExcelView.tsx`
*   **Concepto:** Vista tabular densa para edición rápida de datos numéricos sin la interfaz de tarjetas.
*   **Funcionalidad:** Tabla expansible (Semana -> Día -> Bloque -> Ejercicio). Permite edición masiva seleccionando filas.

### `TimelineView.tsx`
*   **Concepto:** Vista de alto nivel para periodización.
*   **Funcionalidad:** Agrupa semanas en "Mesociclos". Muestra gráficos de barras simplificados de volumen e intensidad por semana.

---

## 📂 13. Visualizaciones (`components/visualizations/`)

### `FatigueChart.tsx`
*   **Lógica:** Calcula la Carga Aguda (semana actual) y la Carga Crónica (promedio móvil 4 semanas) para derivar el ratio ACWR.
*   **Visual:** Gráfico de líneas y áreas (`recharts`) mostrando el "Sweet Spot" (zona segura de entrenamiento) vs el riesgo de lesión.

---

## 📂 14. Contextos (`context/`)

El estado global de la aplicación se divide en dominios:

1.  **`ProgramContext.tsx`**: **El más crítico.**
    *   Contiene el array principal `weeks` (todo el programa).
    *   Provee métodos CRUD (`updateDay`, `addWeek`).
    *   Gestiona el historial (`undo`, `redo`) usando `useHistory`.
    *   Maneja la sincronización offline y la cola de guardado.
2.  **`UIContext.tsx`**:
    *   Gestiona la visibilidad de todos los modales y paneles (ej. `isBatchTrainingOpen`, `isFitCoachOpen`).
    *   Evita el "prop drilling" de estados de apertura/cierre.
3.  **`CollaborationContext.tsx`**:
    *   Simula la conexión con otros usuarios.
    *   Mantiene lista de `activeUsers` y sus cursores (`focusedElementId`).
4.  **`UserPreferencesContext.tsx`**:
    *   Persiste configuraciones de usuario (Tema, Unidades) en `localStorage`.
5.  **`GlobalDnDContext.tsx`**:
    *   Configura los sensores y manejadores globales de Drag & Drop (`@dnd-kit`) para todo el editor.

---

## 📂 15. Hooks (`hooks/`)

Lógica de negocio encapsulada.

*   **`useBatchTraining.ts`**: Máquina de estados para el wizard de Batch Training. Contiene la lógica compleja de `applyLinearProgression` (escalado matemático) y `massAdjustment` (cambios planos).
*   **`useCanvasDnd.ts`**: Contiene la lógica de qué sucede cuando sueltas un ítem de la librería en el canvas (creación de IDs, mapeo de datos).
*   **`useFitCoach.ts`**: Cerebro del chatbot. Analiza palabras clave en el input ("dolor", "tiempo") y devuelve respuestas predefinidas.
*   **`useHistory.ts`**: Implementación genérica de una pila de historia para deshacer/rehacer.
*   **`useKeyboardShortcuts.ts`**: Listener global de teclas (Cmd+Z, etc.).
*   **`useMediaQuery.ts`**: Responsive design en JS.
*   **`useTemplateManager.ts`**: Abstracción sobre `localStorage` para guardar/cargar plantillas.

---

## 📂 16. Otros (Lógica, Servicios, Utils)

### `validationEngine.ts` (`logic/`)
*   Motor de reglas. Recibe el objeto `Program` completo y devuelve un array de `ValidationAlert`.
*   Ejemplo de regla: "Si la semana 1 tiene >30 series de cuádriceps, generar alerta de volumen excesivo".

### `MockApiService.ts` (`services/`)
*   Simula un backend REST. Introduce latencia artificial y probabilidad de fallo para probar la robustez del manejo de errores y el modo offline.

### `VersioningService.ts` (`services/`)
*   Sistema de snapshots. Guarda copias completas del estado del programa en `localStorage` con timestamp y metadatos, permitiendo "viajar en el tiempo".

### `clipboardUtils.ts` (`utils/`)
*   Maneja el Copiar/Pegar complejo. Al pegar un día o bloque, regenera recursivamente todos los IDs (`uuid`) internos para evitar conflictos de referencia en el árbol de datos React.

### `loadCalculator.ts` (`utils/`)
*   Utilidad matemática que convierte inputs porcentuales (ej. "85%") en valores absolutos (kg) usando una tabla de 1RM mockeada.

### `SmartFill.ts` (`utils/`)
*   Algoritmo heurístico. Dado un `Day` vacío y restricciones (tiempo: 60min, material: mancuernas), selecciona y rellena ejercicios automáticamente priorizando movimientos compuestos y ajustando series para encajar en el tiempo.

### `offlineQueue.ts` (`utils/`)
*   Implementación del patrón "Offline First". Intercepta fallos de red en `MockApiService`, encola la operación, y la reintenta automáticamente cuando el navegador detecta evento `online`.