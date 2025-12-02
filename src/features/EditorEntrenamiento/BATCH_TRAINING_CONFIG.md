# Configuración de Batch Training por Modo

Este documento define cómo debe comportarse el popup de configuración de Batch Training (`StepConfiguration.tsx`) basándose en el modo seleccionado en el paso anterior (`StepSelection.tsx`).

Actualmente, los modos disponibles son:
1.  **Duplicar Semana** (`duplicate`)
2.  **Progresión Lineal** (`progression`)
3.  **Aplicar Plantilla** (`template`)
4.  **Ajuste Masivo** (`adjust`)
5.  **Reorganizar Días** (`reorganize`)

---

## 1. Modo: Duplicar Semana (`duplicate`)
**Objetivo:** Copiar la estructura completa de una semana fuente a un rango de semanas destino.

### Campos de Configuración Requeridos:
1.  **Semana Fuente (Source):**
    *   *Tipo:* Select / Dropdown.
    *   *Etiqueta:* "Semana a copiar:"
    *   *Opciones:* Lista de semanas existentes (ej. "Semana 1", "Semana 2").
2.  **Semanas Destino (Target Range):**
    *   *Tipo:* Multi-Select o Rango (Desde/Hasta).
    *   *Etiqueta:* "Copiar hacia:"
    *   *Comportamiento:* Debe permitir seleccionar múltiples semanas o un rango continuo (ej. "Semana 2 a Semana 4").
3.  **Opciones de Copiado:**
    *   *Tipo:* Checkboxes.
    *   *Opciones:*
        *   [x] Mantener pesos y RPE
        *   [ ] Limpiar notas
        *   [ ] Limpiar estado de completado (si aplica)

---

## 2. Modo: Progresión Lineal (`progression`)
**Objetivo:** Aumentar variables numéricas (carga, reps, series) de forma sistemática a lo largo de las semanas.

### Campos de Configuración Requeridos:
1.  **Rango de Aplicación:**
    *   *Tipo:* Rango (Desde Semana X Hasta Semana Y).
    *   *Etiqueta:* "Aplicar progresión desde/hasta:"
2.  **Variables a Progresar (Dynamic Rows):**
    *   *Usuario debe poder activar qué variables progresan.*
    *   **Series:** Toggle (On/Off) -> Input numérico (+1 serie/semana).
    *   **Repeticiones:** Toggle (On/Off) -> Input numérico (-1 o +1 rep/semana).
    *   **Carga (%):** Toggle (On/Off) -> Input porcentual (+2.5% / semana).
    *   **Carga (Absoluta):** Toggle (On/Off) -> Input numérico (+2.5kg / semana).
    *   **RPE:** Toggle (On/Off) -> Input numérico (+0.5 RPE / semana).
3.  **Filtros (Scope):**
    *   *Tipo:* Radio Buttons + Tag Selector.
    *   *Opciones:*
        *   "Todos los ejercicios"
        *   "Solo ejercicios principales (Compound)"
        *   "Solo ejercicios con etiqueta:" [Selector de Tags]

---

## 3. Modo: Aplicar Plantilla (`template`)
**Objetivo:** Inyectar una estructura predefinida (ej. Upper/Lower) en las semanas seleccionadas.

### Campos de Configuración Requeridos:
1.  **Selección de Plantilla:**
    *   *Tipo:* Card Grid o Dropdown con búsqueda.
    *   *Datos:* Lista de plantillas guardadas por el usuario o predeterminadas del sistema.
2.  **Rango de Semanas:**
    *   *Tipo:* Multi-select.
    *   *Etiqueta:* "Aplicar a semanas:"
3.  **Gestión de Conflictos:**
    *   *Tipo:* Radio Button.
    *   *Opciones:*
        *   "Sobreescribir contenido existente" (Peligroso, alerta roja).
        *   "Añadir al final de los días existentes".

---

## 4. Modo: Ajuste Masivo (`adjust`)
**Objetivo:** Realizar cambios específicos (Find & Replace) en propiedades de ejercicios o bloques.

### Campos de Configuración Requeridos:
1.  **Variable a Ajustar:**
    *   *Tipo:* Dropdown.
    *   *Opciones:* "RPE Objetivo", "Tiempo de Descanso", "Etiquetas", "Notas".
2.  **Operación:**
    *   *Depende de la variable seleccionada.*
    *   *Si es RPE:* "Establecer en X" o "Aumentar en X".
    *   *Si es Descanso:* "Establecer en X segundos".
    *   *Si es Tags:* "Añadir Tag" o "Remover Tag".
3.  **Filtros de Alcance:**
    *   *Similar al modo Progresión.*
    *   "Aplicar a ejercicios que se llamen..." (Búsqueda de texto).
    *   "Aplicar a ejercicios con Tag..."

---

## 5. Modo: Reorganizar Días (`reorganize`)
**Objetivo:** Mover días completos (ej. intercambiar Lunes por Miércoles en todas las semanas).

### Campos de Configuración Requeridos:
1.  **Patrón de Movimiento:**
    *   *Tipo:* Drag and Drop visual o Selectores de Mapeo.
    *   *Ejemplo:* "Mover Día 1 (Lunes) -> Día 3 (Miércoles)".
2.  **Alcance Temporal:**
    *   *Tipo:* Rango de semanas.
    *   *Etiqueta:* "Aplicar cambio de horario en semanas:"

---

## Resumen de Cambios Técnicos Necesarios en `StepConfiguration.tsx`

1.  **Recibir Prop `action`:** El componente ya recibe `action` (tipo `BatchActionType`). Se debe usar un `switch(action)` principal para renderizar formularios completamente diferentes.
2.  **Estado Local Dinámico:** El objeto `config` actual (`BatchConfig`) parece estar muy acoplado a la "Progresión Lineal". Necesitamos extender el tipo `BatchConfig` o crear tipos de configuración específicos para cada modo (ej. `DuplicateConfig`, `AdjustConfig`).
3.  **Componentes Modulares:** Se recomienda dividir el contenido del render en sub-componentes:
    *   `<LinearProgressionForm />`
    *   `<DuplicateWeekForm />`
    *   `<MassAdjustmentForm />`
    *   etc.
