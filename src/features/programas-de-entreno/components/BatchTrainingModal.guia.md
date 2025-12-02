## BatchTrainingModal – Guía completa de modos, UI y comportamiento

Este documento explica **en detalle todo lo que ofrece el `BatchTrainingModal`**, cómo se ve la interfaz, qué botones aparecen en cada pestaña y qué impacto tiene cada acción sobre el plan semanal.

El componente principal trabaja siempre sobre los mismos datos:
- **`weeklyPlan`**: plan original de la semana (inmutable dentro del modal, se clona a `workingPlan`).
- **`weekDays`**: lista ordenada de días (strings) usados como claves.
- **`workingPlan`** (estado interno): copia editable de `weeklyPlan` sobre la que actúan todos los modos manuales.
- **Callbacks principales**:
  - **`onApplyRules(updatedPlan)`**: se usa tanto para aplicar el resultado de las reglas masivas como para los cambios manuales.
  - **`onExportSummary(previewResult)`**: salida opcional para enviar el resumen de reglas a automatizaciones.
  - **`onClose()`**: cierra el modal.

---

### 1. Estructura general de la UI

El `BatchTrainingModal` es un modal grande tipo **pantalla de trabajo** con tres zonas principales:

- **Header superior** (barra de título y cierre).
- **Barra de pestañas + contenido principal** (la mayor parte de la pantalla).
- **En la pestaña de Automatizaciones avanzadas**, un **footer de navegación de pasos** (StepNavigation).

#### 1.1. Header superior

Contenido:
- **Título**: `Batch Training – Ajustes masivos del programa`.
- **Subtítulo**: “Aplica cambios a toda la semana de forma rápida y segura. Primero previsualiza, luego aplica.”
- **Etiqueta de contexto**: “Plan actual: Semana seleccionada”.
- **Botón `Cerrar`**:
  - `Button` variante `ghost`, tamaño `sm`.
  - Acción: `handleConfirmClose()` → limpia `exportStatus` y ejecuta `onClose()`.

#### 1.2. Pestañas principales

Bajo el header hay 4 botones que funcionan como pestañas (cambian `activeTab`):

- **Resumen** (`activeTab === 'summary'`).
- **Acciones rápidas** (`activeTab === 'quick-actions'`).
- **Edición manual** (`activeTab === 'manual-edit'`).
- **Automatizaciones avanzadas** (`activeTab === 'advanced-automation'`).

Cada botón:
- Usa `variant="secondary"` cuando está activo, `variant="ghost"` cuando no.
- Al hacer clic, cambia `activeTab`.

A la derecha se muestra un texto de ayuda que cambia según la pestaña:
- Resumen → “Vista global de la semana y cambios recientes.”
- Acciones rápidas → “Elige una receta rápida, configura y previsualiza su impacto.”
- Edición manual → “Edita sesiones individuales por día.”
- Automatizaciones avanzadas → “Crea y aplica reglas avanzadas sobre el plan semanal.”

---

### 2. Pestaña “Resumen” (`summary`)

Objetivo: dar una **foto global clara de la semana** y mostrar el **historial de cambios**.

Layout: `lg:grid-cols-3`:
- Columna izquierda (2 columnas unidas): métricas y distribuciones.
- Columna derecha (1 columna): historial de cambios.

#### 2.1. Tarjeta “Resumen de la semana”

Muestra:
- Total de **bloques/sesiones** (`summaryMetrics.totalSessions`).
- **Minutos totales** (`summaryMetrics.totalDuration`).
- **Días con sesiones** (`summaryMetrics.daysWithSessions`).
- Lista por día (`summaryMetrics.perDayList`):
  - Cada fila: `Día — X min · Y bloques`.

#### 2.2. Tarjeta “Intensidades”

- Si no hay intensidades (`Object.keys(summaryMetrics.intensity).length === 0`):
  - Mensaje: “Todavía no hay intensidades registradas.”
- Si las hay:
  - Lista de `intensidad → N sesiones` (ej.: “RPE 7 → 4 sesiones”, “Alta → 3 sesiones”).

#### 2.3. Tarjeta “Distribución por modalidades”

- Si no hay modalidades (`Object.keys(summaryMetrics.modalityCount).length === 0`):
  - Mensaje: “Todavía no hay modalidades registradas en esta semana.”
- Si las hay:
  - Lista de `modalidad → N sesiones` (ej.: “Strength → 5 sesiones”, “MetCon → 4 sesiones”).

#### 2.4. Tarjeta “Historial de cambios”

Columna derecha:
- Encabezado con icono `History` y texto “Historial de cambios”.
- Si `history` está vacío:
  - Mensaje: “Todavía no has aplicado cambios masivos a esta semana…”
- Si hay entradas:
  - Lista scrollable (`max-h-64`) de `HistoryEntry`:
    - Fecha/hora (`toLocaleString`).
    - Nº de bloques modificados (`entry.metrics.sessionsTouched`).
    - Texto `entry.summary` (ej.: “Aplicadas 3 regla(s) · 10 bloques”, “Cambios manuales · 4 bloques”).

**Persistencia**:
- `history` se lee y se guarda en `localStorage` con la clave:
  - `batch-training-history-${clientId ?? 'global'}-${programId ?? 'default'}`.
- Se mantienen como máximo 15 entradas.

---

### 3. Pestaña “Acciones rápidas” (`quick-actions`)

Objetivo: ofrecer un menú de **recetas rápidas** para tareas habituales sin tener que construir reglas complejas.

Parte superior (tarjeta introductoria):
- Título: “Acciones rápidas”.
- Texto: “Elige qué quieres hacer y sigue los pasos. Siempre podrás previsualizar el impacto antes de aplicar.”
- Debajo, **grid de tarjetas** que representan cada modo.

#### 3.1. Menú de acciones (tarjetas)

Cada tarjeta es un `Card` clickable con icono, título y descripción:

1. **Añadir rutinas predefinidas** (`mode = 'add-routines'`)
   - Icono `Plus`.
   - Texto: “Aplica una rutina predefinida a varios días a la vez.”
2. **Mover o copiar bloques entre días** (`mode = 'move-sessions'`)
   - Icono `ChevronRight`.
   - Texto: “Reorganiza bloques de un día a otro rápidamente.”
3. **Añadir / quitar tags en lote** (`mode = 'bulk-tags'`)
   - Icono `Badge` con texto “Tag”.
   - Texto: “Gestiona un mismo tag en muchos bloques a la vez.”
4. **Rebalancear intensidades de la semana** (`mode = 'rebalance-intensity'`)
   - Icono `Sparkles`.
   - Texto: “Sube o baja la intensidad de días completos de forma equilibrada.”
5. **Cambiar modalidad en lote** (`mode = 'bulk-modality'`)
   - Icono `Layers`.
   - Texto: “Cambia la modalidad de muchos bloques filtrando por texto.”
6. **Añadir calentamientos / finishers automáticos** (`mode = 'auto-finisher'`)
   - Icono `Sparkles`.
   - Texto: “Inserta bloques automáticos de warm-up o finisher en varios días.”
7. **Aplicar semana de deload** (`mode = 'deload-week'`)
   - Icono `History`.
   - Texto: “Reduce duración e intensidad de toda la semana como descarga.”

Cuando una tarjeta está seleccionada (`mode` coincide), se resalta con borde y fondo índigo.
Al hacer clic:
- Se ejecuta `handleSelectQuickAction(nextMode)`:
  - Cambia `mode`.
  - Limpia `manualApplyStatus`.
  - Si `nextMode === 'move-sessions'`, reinicia `moveSelectedSessionIds`.

Debajo de este menú se renderiza el **panel específico** según `mode`.

---

### 3.2. Añadir rutinas predefinidas (`mode === 'add-routines'`)

Layout: `grid` de dos columnas:
- Izquierda: configuración.
- Derecha: biblioteca de rutinas (`DEFAULT_ROUTINES`).

#### 3.2.1. Panel de configuración

Tarjeta “Configuración: Añadir rutinas predefinidas”:
- Explica que se seleccionan días objetivo y una rutina para insertarla en lote.
- **Días objetivo**:
  - Lista de botones con todos los `weekDays`.
  - Estado: se basan en `routineTargetDays`.
  - Acción: `toggleRoutineDay(day)` añade o quita el día de la lista.
- Texto pequeño: aclara que solo se aplicará a los días seleccionados.
- **Botones**:
  - `Añadir rutina a días`:
    - `disabled` si no hay rutina seleccionada (`selectedRoutineId` vacío) o no hay días en `routineTargetDays`.
    - Acción: `handleApplyRoutineToDays()`:
      - Busca la rutina en `DEFAULT_ROUTINES` por `selectedRoutineId`.
      - Por cada día destino:
        - Clona cada sesión de la rutina con un `id` nuevo (`createId()`).
        - Las añade al final de las sesiones del día en `workingPlan`.
      - Ajusta `manualApplyStatus` con el mensaje:
        - “Rutina añadida. Aplica los cambios para guardarlos en el programa.”
  - `Aplicar cambios al programa`:
    - Llama a `handleApplyWorkingPlan()` (ver sección 4.3).
- Si `manualApplyStatus` no es `null`, se muestra en verde.

#### 3.2.2. Biblioteca de rutinas (`DEFAULT_ROUTINES`)

Tarjeta “Biblioteca de rutinas”:
- Lista todas las rutinas predefinidas (`DEFAULT_ROUTINES`).
- Cada rutina aparece en un `Card` clickable con:
  - Nombre (`name`).
  - Descripción (`description`), si existe.
  - Nº de bloques: `routine.sessions.length`.
  - Tags (`tags`), representados como `Badge` pequeños.
- Clic en una rutina:
  - Actualiza `selectedRoutineId` con su `id`.
  - El card se resalta con borde/fondo índigo.

---

### 3.3. Mover o copiar bloques (`mode === 'move-sessions'`)

Layout: dos columnas:
- Izquierda: configuración de origen/destino/modo.
- Derecha: lista de bloques del día origen.

#### 3.3.1. Panel de configuración

Tarjeta “Configuración: Mover o copiar bloques entre días”:
- Explica que hay que elegir un día origen, un día destino y los bloques.
- **Parámetros** (3 columnas):
  - Día origen:
    - `Select` con opciones `weekDays`.
    - Controla `moveSourceDay`.
  - Día destino:
    - `Select` con opciones `weekDays`.
    - Controla `moveTargetDay`.
  - Modo:
    - `Select` con:
      - `move` → “Mover (cortar y pegar)”.
      - `copy` → “Copiar (duplicar)”.
    - Controla `moveMode`.
- Texto pequeño: “Se aplicará solo a los bloques seleccionados del día origen.”
- **Botones**:
  - Principal: label dinámico:
    - “Mover bloques” si `moveMode === 'move'`.
    - “Copiar bloques” si `moveMode === 'copy'`.
  - Está deshabilitado si:
    - No hay día origen o destino.
    - `moveSourceDay === moveTargetDay`.
    - `moveSelectedSessionIds` está vacío (ningún bloque marcado).
  - Acción: `handleExecuteMoveSessions()`:
    - Coge las sesiones del día origen y destino desde `workingPlan`.
    - Recorre `moveSelectedSessionIds`:
      - Si `move`:
        - Extrae la sesión del array de origen y la añade al destino (misma `id`).
      - Si `copy`:
        - Clona la sesión con `id` nuevo y la añade al destino.
    - Actualiza `workingPlan` con los nuevos arrays de sesiones.
    - Limpia `moveSelectedSessionIds`.
    - Ajusta `manualApplyStatus` con:
      - “Bloques movidos. Aplica los cambios para guardarlos en el programa.” o
      - “Bloques copiados. Aplica los cambios para guardarlos en el programa.”
  - Secundario: `Aplicar cambios al programa` → `handleApplyWorkingPlan()`.
- `manualApplyStatus` se muestra en verde si no es `null`.

#### 3.3.2. Bloques del día origen

Tarjeta “Bloques del día origen”:
- Si el día origen no tiene sesiones:
  - Texto: “Este día no tiene sesiones.”
- Si tiene sesiones:
  - Lista de `Card` por cada sesión:
    - Checkbox (`input type="checkbox"`) ligado a `moveSelectedSessionIds`:
      - Marca si el `id` de la sesión está seleccionado.
      - Acción: `toggleMoveSessionSelection(session.id)` (añade o quita el id).
    - Texto del bloque:
      - Nombre del bloque (`session.block` o “Bloque sin nombre”).
      - Línea con: `time · duration · modality · intensity`.
    - Si la sesión está seleccionada se muestra un `ring` índigo alrededor del card.

---

### 3.4. Tags masivos (`mode === 'bulk-tags'`)

Layout: dos columnas:
- Izquierda: configuración.
- Derecha: panel de impacto.

#### 3.4.1. Panel de configuración

Tarjeta “Configuración: Gestión masiva de tags”:
- Explica que añade/elimina un tag en todos los bloques de los días seleccionados.
- **Días objetivo**:
  - Lista de botones (`weekDays`) basada en `bulkTagTargetDays`.
  - Clic en un día → `toggleBulkTagDay(day)` (lo añade o lo quita).
- **Acción**:
  - `Select` sobre `bulkTagMode`:
    - `add` → “Añadir tag”.
    - `remove` → “Eliminar tag”.
- **Tag**:
  - `Input` ligado a `bulkTagValue` con placeholder: “Nombre del tag (ej: long-form, fuerza, metcon)”.
- Texto pequeño: aclara que se aplicará a todos los bloques de los días seleccionados.
- **Botones**:
  - Principal:
    - Label:
      - “Añadir tag a días” si `bulkTagMode === 'add'`.
      - “Eliminar tag de días” si `bulkTagMode === 'remove'`.
    - Deshabilitado si:
      - `bulkTagValue.trim()` está vacío.
      - `bulkTagTargetDays.length === 0`.
    - Acción: `handleExecuteBulkTags()`:
      - Recorre los días en `bulkTagTargetDays`.
      - Para cada sesión del día:
        - Si `add` y el tag **no** está:
          - Lo añade a `session.tags`.
        - Si `remove` y el tag **sí** está:
          - Lo elimina de `session.tags`.
      - Ajusta `manualApplyStatus` con un mensaje informativo:
        - “Tag "X" añadido…” o “Tag "X" eliminado…”.
  - `Aplicar cambios al programa` → `handleApplyWorkingPlan()`.
- `manualApplyStatus` se muestra en verde si existe.

#### 3.4.2. Panel de impacto estimado

Tarjeta “Impacto estimado”:
- Explica que la acción afectará a todos los bloques de los días seleccionados.
- Recomienda revisar el resultado en “Edición manual” o “Resumen” antes de aplicar definitivamente al programa.

---

### 3.5. Rebalancear intensidades (`mode === 'rebalance-intensity'`)

Layout: dos columnas:
- Izquierda: texto explicativo.
- Derecha: subcomponente `RebalanceIntensityMode`.

#### 3.5.1. Panel de texto

Tarjeta “Configuración: Rebalancear intensidades”:
- Explica que se elige la intensidad objetivo para cada día.
- Aclara que se aplica solo a los días seleccionados, el resto del plan no cambia.

#### 3.5.2. Subcomponente `RebalanceIntensityMode`

Se renderiza pasando:
- `weekDays`.
- `workingPlan`.
- `setWorkingPlan`.
- `setManualApplyStatus`.

Comportamiento (alto nivel para el usuario):
- Permite seleccionar días y ajustar la intensidad de todos sus bloques a un criterio común (ej. homogenizar RPE o subir/bajar un nivel).
- Aplica los cambios directamente sobre `workingPlan`.
- Deja un mensaje en `manualApplyStatus` indicando que hay que pulsar “Aplicar cambios al programa” para guardarlo.

---

### 3.6. Cambiar modalidad en lote (`mode === 'bulk-modality'`)

Layout: dos columnas:
- Izquierda: texto.
- Derecha: subcomponente `BulkModalityMode`.

#### 3.6.1. Panel de texto

Tarjeta “Configuración: Cambiar modalidad en lote”:
- Explica que se seleccionan días y una nueva modalidad.
- Indica que se puede filtrar por texto para limitar qué bloques se cambian.

#### 3.6.2. Subcomponente `BulkModalityMode`

Recibe:
- `weekDays`, `workingPlan`, `setWorkingPlan`, `setManualApplyStatus`.

Rol:
- Permite definir:
  - Días objetivo.
  - Filtro por modalidad actual (texto).
  - Nueva modalidad destino.
- Recorre las sesiones que cumplan el filtro y les cambia la `modality`.
- Deja un mensaje en `manualApplyStatus` para recordar aplicar los cambios.

---

### 3.7. Auto finisher / warm-up (`mode === 'auto-finisher'`)

Layout: dos columnas:
- Izquierda: texto.
- Derecha: subcomponente `AutoFinisherMode`.

#### 3.7.1. Panel de texto

Tarjeta “Configuración: Auto finisher / warm-up”:
- Explica que se pueden insertar calentamientos al inicio o finishers al final de los días seleccionados.
- Aclara que solo afecta a los días elegidos.

#### 3.7.2. Subcomponente `AutoFinisherMode`

Recibe:
- `weekDays`, `workingPlan`, `setWorkingPlan`, `setManualApplyStatus`.

Rol:
- Permite elegir tipo de bloque (warm-up / finisher, y posiblemente tipo: core, cardio, metabólico, etc.) y su duración.
- Inserta automáticamente esos bloques al principio o final de los días seleccionados.
- Informa en `manualApplyStatus` para que el usuario aplique los cambios al programa.

---

### 3.8. Semana de deload (`mode === 'deload-week'`)

Layout: dos columnas:
- Izquierda: texto.
- Derecha: subcomponente `DeloadWeekMode`.

#### 3.8.1. Panel de texto

Tarjeta “Configuración: Semana de deload”:
- Explica que se define un porcentaje de reducción de duración y la opción de bajar intensidad.
- Aclara que se aplicará a todos los bloques de la semana completa.

#### 3.8.2. Subcomponente `DeloadWeekMode`

Recibe:
- `weekDays`, `workingPlan`, `setWorkingPlan`, `setManualApplyStatus`.

Rol:
- Recorre todos los bloques de la semana y:
  - Reduce su duración según el porcentaje configurado (ej.: -30% de minutos).
  - Opcionalmente baja la intensidad (ej.: Alta → Media).
- Actualiza `workingPlan` y deja un mensaje en `manualApplyStatus`.

---

### 4. Pestaña “Edición manual” (`manual-edit`)

Objetivo: permitir una **edición fina, bloque a bloque y día a día** del `workingPlan`, sin automatismos.

#### 4.1. Selector de día

Tarjeta “Editar sesiones por día”:
- Explica que los cambios se guardan al aplicar el programa.
- Muestra una fila de botones con todos los `weekDays`:
  - Cada botón: `Día (N)` donde N es el nº de sesiones (`workingPlan[day]?.sessions.length`).
  - El día activo es `effectiveEditDay`.
  - Clic en un botón → `setSelectedDayForEdit(day)`.
- `effectiveEditDay` se calcula para garantizar que siempre sea un día válido (si el seleccionado no existe en `weekDays`, usa el primero).

#### 4.2. Lista de sesiones del día

Encabezado:
- Muestra el nombre de `effectiveEditDay`.
- Si hay día seleccionado:
  - Botón `Añadir sesión`:
    - Acción: `handleAddSession(effectiveEditDay)`:
      - Crea un `DaySession` nuevo con:
        - `id` nuevo (`createId()`).
        - `time = '00:00'`.
        - `block = 'Nuevo bloque'`.
        - `duration = '10 min'`.
        - `modality = 'Custom'`.
        - `intensity = 'Media'`.
        - `notes = ''`.
      - Lo añade al final de las sesiones del día.

Contenido:
- Si no hay plan para el día o `selectedDayPlan.sessions.length === 0`:
  - Mensaje: “No hay sesiones en este día. Usa "Añadir sesión" para crear bloques nuevos.”
- Si hay sesiones:
  - Cada sesión se muestra en un `Card` con:
    - **Cabecera**:
      - Texto: “Bloque X” usando `session.block` o el `id`.
      - Botones:
        - `Duplicar` (`Copy`):
          - `handleDuplicateSession(effectiveEditDay, session)` → clona la sesión con nuevo `id` y la añade al final.
        - `Eliminar` (`Trash2`):
          - `handleDeleteSession(effectiveEditDay, session.id)` → elimina la sesión.
    - **Grid de 2 columnas** con campos principales:
      - `time` (Input).
      - `duration` (Input, texto libre tipo “30 min”).
      - `modality` (Input, ej. “Strength”, “MetCon”).
      - `intensity` (Input, ej. “Alta”, “RPE 7”).
      - Todos actualizan usando `handleSessionChange(dayKey, sessionId, updates)`.
    - **Notas**:
      - `Textarea` (2 filas) para `session.notes`.
    - **Tags**:
      - `Input` que muestra `tags.join(', ')`.
      - Al cambiar:
        - Divide la cadena por comas, hace `trim` por fragmento, filtra vacíos.
        - Guarda el array resultante en `session.tags`.

#### 4.3. Aplicar cambios manuales

Al final de la pestaña:
- Botón `Cerrar`:
  - `handleConfirmClose()`.
- Botón `Aplicar cambios al programa`:
  - `handleApplyWorkingPlan()`:
    - Calcula métricas de antes/después con `buildManualMetrics(weeklyPlan, workingPlan, weekDays)`:
      - `sessionsTouched`, `totalDurationDelta`, `perDay`, `intensityBefore/After`.
    - Llama a `onApplyRules(workingPlan)` para actualizar el programa real.
    - Crea un `HistoryEntry` con summary “Cambios manuales · X bloques”.
    - Lo inserta al inicio de `history` (máx. 15) y guarda en `localStorage`.
    - Fija `manualApplyStatus = "Cambios aplicados al programa."`.
- Si `manualApplyStatus` existe, se muestra en verde bajo los botones.

---

### 5. Pestaña “Automatizaciones avanzadas” (`advanced-automation`)

Objetivo: permitir crear **reglas potentes** sobre el plan semanal con un flujo guiado en 3 pasos:
1. Definir reglas.
2. Previsualizar.
3. Confirmar & aplicar.

#### 5.1. Stepper de 3 pasos

En la parte superior se muestra un stepper con los pasos:

- Cada paso es un chip:
  - Activo: fondo índigo, texto blanco.
  - Completado: mismo chip pero con icono `CheckSquare`.
  - Pendiente: icono `Layers`.

##### Atajo de teclado

`useEffect` global escucha `keydown`:
- Solo actúa cuando `activeTab === 'advanced-automation'`.
- Si pulsas **Ctrl/Cmd + Enter**:
  - Si `currentStep === 1` y `canAdvance` → pasa al paso 2.
  - Si `currentStep === 2` y `canAdvance` → ejecuta `handleApply()` y pasa al paso 3.
  - Si `currentStep === 3` → no hace nada.

##### Navegación inferior (StepNavigation)

Siempre que `activeTab === 'advanced-automation'` se muestra un footer con:
- Botón `Anterior` (`ChevronLeft`):
  - `goToPreviousStep()` (si `currentStep > 1`).
- Texto: “Atajo: Ctrl/Cmd + Enter para avanzar”.
- Botón derecho:
  - Si `currentStep < 3`:
    - Label `Siguiente` (`ChevronRight`).
    - `goToNextStep()`:
      - Si está en paso 2 y `canAdvance`, llama internamente a `handleApply()` y pasa al 3.
    - Deshabilitado si `canAdvance` es `false`.
  - Si `currentStep === 3`:
    - Label `Cerrar`.
    - `handleConfirmClose()`.

#### 5.2. Lógica de `canAdvance`

- Paso 1 (definir reglas):
  - `canAdvance = enabledRules.length > 0`.
  - `enabledRules = rules.filter(rule => rule.enabled && rule.actions.length > 0)`.
- Paso 2 (previsualizar):
  - `canAdvance = previewResult.metrics.sessionsTouched > 0`.
- Paso 3 (confirmar & aplicar):
  - `canAdvance = true` (ya se han aplicado las reglas).

#### 5.3. Paso 1 – Definir reglas (`rules`)

Este paso corresponde a todo el bloque de edición de reglas:

##### 5.3.1. Cabecera “Reglas activas”

- Muestra:
  - Nº de reglas aplicables (`enabledRules.length`).
  - Nº de bloques potenciales (`previewResult.metrics.sessionsTouched`).
- Botón `Nueva regla`:
  - `handleAddRule()`:
    - Añade una regla base:
      - `name = 'Nueva regla'`.
      - `enabled = true`.
      - `operator = 'AND'`.
      - `conditions = []`.
      - `actions = []`.

##### 5.3.2. Lista de reglas (`BatchRule`)

Cada regla se muestra como un `Card`:
- **Toggle**:
  - Icono `CheckSquare` azul si `rule.enabled`, `Square` gris si no.
  - Clic → toggle `rule.enabled`.
- **Nombre**:
  - `Input` ligado a `rule.name`.
- **Descripción**:
  - `Textarea` ligado a `rule.description`.
- **Operador**:
  - `Select` para `rule.operator` con:
    - “Todas las condiciones (AND)”.
    - “Alguna condición (OR)”.
- **Botones de cabecera**:
  - `Duplicar` (`Copy`) → `handleDuplicateRule(rule.id)`:
    - Clona la regla (nuevo `id`, nuevas condiciones/acciones con `id` nuevo).
    - Añade la copia al final.
  - `Eliminar` (`Trash2`) → `handleRemoveRule(rule.id)`.

##### 5.3.3. Bloque “Condiciones”

Sección dentro del card:
- Texto “Condiciones” + botón `Añadir condición`:
  - `handleAddCondition(rule.id)` → añade condición base:
    - `type = 'modality'`, `comparator = 'equals'`, `value = ''`.
- Si `rule.conditions.length === 0`:
  - Texto: “Sin condiciones: la regla se aplicará a todos los bloques.”
- Cada condición se pinta con:
  - `Select` de tipo (`modality`, `intensity`, `duration`, `tag`).
  - `Select` de comparador:
    - Si `duration` → `gte` (≥), `lte` (≤).
    - Otros → `equals` (Igual), `contains` (Contiene).
  - `Input` de valor con placeholder según `CONDITION_LABELS`.
  - Botón `Trash2` para eliminar (`handleRemoveCondition(ruleId, conditionId)`).

La lógica de evaluación se hace en `evaluateCondition(session, condition, day)`:
- Comprueba modalidad, intensidad, duración (en minutos) o tags (incluido el nombre del día como tag virtual).

##### 5.3.4. Bloque “Acciones”

Sección “Acciones”:
- Botón `Añadir acción`:
  - `handleAddAction(rule.id)` → añade acción base:
    - `type = 'set-intensity'`, `mode = 'set'`, `value = ''`.
- Si no hay acciones:
  - Texto: “Sin acciones configuradas: no habrá cambios.”
- Cada acción se pinta con:
  - `Select` de tipo (`set-intensity`, `bump-duration`, `add-rest`, `change-modality`, `append-tag`).
  - Si el tipo es `bump-duration`, se muestra un `Select` de `mode`:
    - `increase` (Aumentar), `decrease` (Disminuir), `set` (Fijar).
  - `Input` “Valor”.
  - Botón `Trash2` para eliminar (`handleRemoveAction(ruleId, actionId)`).

La lógica de aplicación se hace en `applyAction(session, action)`:
- Ajusta intensidad, duración (aumenta/disminuye/fija minutos), añade notas de descanso, cambia modalidad, añade tags sin duplicar.

##### 5.3.5. Panel lateral – Plantillas y presets

Dos tarjetas a la derecha:

- **Biblioteca de plantillas**:
  - Muestra `DEFAULT_TEMPLATES` con:
    - Nombre, descripción, nº de reglas, tags (`Badge`).
  - Clic en una plantilla → `handleSelectTemplate(template)`:
    - Reemplaza `rules` por `cloneRules(template.rules)`.

- **Presets personalizados**:
  - Inputs:
    - `presetName` (obligatorio).
    - `presetDescription` (opcional).
  - Botón `Guardar preset`:
    - Deshabilitado si `presetName.trim()` está vacío.
    - `handleSavePreset()`:
      - Crea un `RuleTemplate` con `rules` clonadas.
      - Lo añade al inicio de `presetLibrary` (máx. 12).
      - Persiste en `localStorage` (`presetStorageKey`).
  - Lista de presets existentes:
    - Cada uno muestra nombre, nº de reglas y descripción.
    - Clic → `handleApplyPreset(preset)` (reemplaza `rules` actuales).

#### 5.4. Historial reciente (dentro de Automatizaciones)

Al final del paso 1 hay una tarjeta “Historial reciente”:
- Si `history` está vacío:
  - Mensaje invitando a aplicar reglas.
- Si hay entradas:
  - Lista scrollable de `HistoryEntry` (fecha/hora, nº de bloques y resumen).

Las entradas se añaden desde `handleApply()` cada vez que se aplican reglas.

#### 5.5. Paso 2 – Previsualizar impacto

Tarjeta “Impacto proyectado”:
- Resumen:
  - “X bloques afectados · Δ duración +Y/-Y min” (`previewResult.metrics`).
- **Duración diaria**:
  - Lista `previewResult.metrics.perDay`:
    - Día → `delta` de minutos (verde si > 0, rojo si < 0, neutro si 0).
- **Distribución de intensidades**:
  - Para cada clave de `intensityBefore`:
    - Muestra `before → after (delta)` con color en función del signo del delta.
- Texto pequeño: recomienda ajustar las reglas si el impacto no es el deseado.

Acciones:
- Botón `Volver a reglas` → `setCurrentStep(1)`.
- Botón `Aplicar al plan` (deshabilitado si `enabledRules.length === 0`) → `handleApply()`.

#### 5.6. Paso 3 – Confirmar & aplicar

Tarjeta de éxito:
- Mensaje: “Cambios aplicados correctamente.”
- Resume:
  - Nº de bloques actualizados (`previewResult.metrics.sessionsTouched`).
  - Nº de días con cambios de duración (cuenta de `perDay` con `delta !== 0`).
- Botones:
  - `Exportar resumen` (`Upload`):
    - `handleExportSummary()`:
      - Si `onExportSummary` existe, le pasa `previewResult`.
      - Ajusta `exportStatus = "Resumen enviado a automatización."`.
  - `Configurar nuevas reglas` (`Download`):
    - `setCurrentStep(1)` para volver a empezar.
- Si `exportStatus` no es `null`, se muestra en texto verde.

Efectos de `handleApply()`:
- Llama a `onApplyRules(previewResult.simulatedPlan)` para actualizar el programa real.
- Sincroniza `workingPlan` con ese plan simulado (`setWorkingPlan(cloneWeeklyPlan(previewResult.simulatedPlan))`.
- Crea entrada en `history` (resumen “Aplicadas X regla(s) · Y bloques”).
- Guarda el historial en `localStorage`.
- Fija `currentStep = 3`.

---

### 6. Historial, métricas y almacenamiento

- **Historial (`history`)**:
  - Registra tanto ejecuciones de reglas como cambios manuales.
  - Cada `HistoryEntry` guarda:
    - `timestamp`.
    - `summary`.
    - `metrics` (sesiones tocadas, delta total de minutos, detalle por día, intensidades antes/después).
  - Persistido en `localStorage` (`historyStorageKey`) con máximo 15 entradas.

- **Presets de reglas (`presetLibrary`)**:
  - Persistidos en `localStorage` (`presetStorageKey`) con máximo 12 presets.

- **Métricas internas**:
  - `aggregatePlanMetrics`:
    - Calcula minutos totales, minutos por día e intensidades.
  - `computeSessionsTouched`:
    - Cuenta cuántas sesiones han cambiado (duración, modalidad, intensidad, notas o tags).
  - `buildManualMetrics`:
    - Compara `weeklyPlan` vs `workingPlan`.
  - `runRulesPreview`:
    - Aplica las reglas sobre una copia del plan y devuelve:
      - `simulatedPlan`.
      - `metrics` (impacto proyectado).

---

### 7. Resumen mental para el entrenador

Cuando el entrenador abre el `BatchTrainingModal` ve:
- Una **cabecera** clara con título, explicación y botón `Cerrar`.
- Una pestaña **Resumen** con métricas de la semana y el historial de todo lo que se ha aplicado.
- Una pestaña **Acciones rápidas** con tarjetas para tareas típicas (añadir rutinas, mover/copiar, tags, rebalance, modalidad, warm-up/finisher, deload) y sus paneles de configuración.
- Una pestaña **Edición manual** para tocar bloque a bloque cada día.
- Una pestaña de **Automatizaciones avanzadas** con un wizard de 3 pasos para crear reglas poderosas, guardar presets, ver el impacto, aplicarlo y exportar el resumen.


