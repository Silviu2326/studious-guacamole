## BatchTrainingModal – Modos disponibles (documentación detallada)

Este documento describe en detalle todos los modos del `BatchTrainingModal`, qué UI muestra cada uno, qué datos toca, qué flujos de acciones permite y cómo impacta en el `workingPlan` y en el programa final.

El componente principal trabaja sobre:
- **`weeklyPlan`**: plan original de la semana (inmutable dentro del modal, se clona a `workingPlan`).
- **`weekDays`**: lista ordenada de días (strings) usados como claves.
- **`workingPlan`** (estado interno): copia editable de `weeklyPlan` sobre la que actúan todos los modos manuales.
- **Callbacks externos**:
  - **`onApplyRules(updatedPlan)`**: se usa tanto para aplicar el resultado de las reglas masivas como para los cambios manuales.
  - **`onExportSummary(previewResult)`**: salida opcional para enviar el resumen de reglas a automatizaciones.

---

### 1. Reglas masivas (`rules`)

Modo tipo “wizard” en 3 pasos que permite definir reglas automáticas, previsualizar su impacto y aplicarlas al programa.

#### 1.1. Elementos globales del modo

- **Botón de modo**: `Reglas masivas` activa `mode = 'rules'`.
- **Stepper de pasos** (`steps = ['Definir reglas', 'Previsualizar', 'Confirmar & aplicar']`):
  - Solo visible cuando `mode === 'rules'`.
  - Cada chip de paso muestra:
    - Icono `Layers` cuando el paso no está completado.
    - Icono `CheckSquare` cuando el paso está por detrás del actual (completado).
  - El paso activo se destaca visualmente con fondo índigo.
- **Atajo de teclado** `Ctrl/Cmd + Enter`:
  - Registrado con un `useEffect` global en el modal.
  - Si `currentStep === 1` y `canAdvance`, pasa al paso 2.
  - Si `currentStep === 2` y `canAdvance`, ejecuta `handleApply()` (aplica reglas) y pasa al paso 3.
  - No hace nada en el paso 3.
- **Navegación inferior (StepNavigation)**:
  - Botón **Anterior** (`ChevronLeft`):
    - Llama a `goToPreviousStep`, que reduce `currentStep` mientras sea > 1.
    - Deshabilitado cuando `currentStep === 1`.
  - Label intermedio:
    - Texto informativo: "Atajo: Ctrl/Cmd + Enter para avanzar".
  - Botón derecho:
    - Pasos 1 y 2: "Siguiente" (`ChevronRight`).
      - Llama a `goToNextStep`.
      - Deshabilitado si `canAdvance === false`.
    - Paso 3: "Cerrar".
      - Llama a `handleConfirmClose` (limpia mensaje de exportación y cierra modal).

#### 1.2. Lógica de avance (`canAdvance`)

- **Paso 1 (Definir reglas)**:
  - Requiere tener al menos una regla habilitada y con acciones:
    - `enabledRules = rules.filter(rule => rule.enabled && rule.actions.length > 0)`.
    - `canAdvance = enabledRules.length > 0`.
- **Paso 2 (Previsualizar)**:
  - Requiere que la simulación de reglas tenga al menos un bloque afectado:
    - `previewResult.metrics.sessionsTouched > 0`.
- **Paso 3 (Confirmar & aplicar)**:
  - `canAdvance` se fuerza a `true` (ya no hay restricción).

#### 1.3. Paso 1 – Definir reglas

##### 1.3.1. Cabecera de estadísticas rápidas

- Tarjeta superior “Reglas activas”:
  - Muestra:
    - **Reglas aplicables**: `enabledRules.length`.
    - **Bloques potenciales**: `previewResult.metrics.sessionsTouched` (resultado de `runRulesPreview`).
  - Botón "Nueva regla" (`Plus`):
    - Inserta una regla base al final de `rules` con:
      - `id`: generado con `createId()`.
      - `name`: `'Nueva regla'`.
      - `enabled`: `true`.
      - `operator`: `'AND'`.
      - `conditions`: `[]`.
      - `actions`: `[]`.

##### 1.3.2. Estructura visual de cada regla (`BatchRule`)

- Cada regla se renderiza como una `Card` con:
  - **Toggle habilitada/deshabilitada**:
    - Icono:
      - `CheckSquare` índigo si `rule.enabled === true`.
      - `Square` gris si `rule.enabled === false`.
    - Clic sobre el icono hace `setRules` toggling el campo `enabled`.
    - Estilo:
      - Regla habilitada: borde y fondo con tonos índigo (modo énfasis).
      - Regla deshabilitada: tonos neutros.
  - **Campos de cabecera**:
    - **Nombre de la regla**:
      - `Input` que edita `rule.name`.
    - **Descripción**:
      - `Textarea` (2 filas) que edita `rule.description`.
    - **Operador entre condiciones**:
      - `Select` sobre `rule.operator` con opciones:
        - `'AND'` → "Todas las condiciones (AND)".
        - `'OR'` → "Alguna condición (OR)".
      - Determina cómo se combinan las condiciones de la regla.
  - **Acciones rápidas**:
    - **Duplicar** (`Copy`):
      - Usa `cloneRule(rule)`:
        - Clona la regla asignando nuevo `id`.
        - Clona cada condición y acción con nuevos `id`s.
      - Añade la copia a `rules` con el nombre original + `" (copia)"`.
    - **Eliminar** (`Trash2`):
      - Quita la regla del array.

##### 1.3.3. Bloque de condiciones de la regla

- Sección “Condiciones”:
  - Botón "Añadir condición" (`Plus`):
    - Inserta una condición por defecto:
      - `id`: `createId()`.
      - `type`: `'modality'`.
      - `comparator`: `'equals'`.
      - `value`: `''`.
  - Mensaje vacío:
    - Si `rule.conditions.length === 0`, muestra:
      - "Sin condiciones: la regla se aplicará a todos los bloques."
  - Para cada condición se pinta una `Card` interna con:

###### Campos de una condición (`Condition`)

- **Tipo (`type: 'modality' | 'intensity' | 'duration' | 'tag'`)**:
  - `Select` con opciones:
    - Modalidad (`modality`).
    - Intesidad (`intensity`).
    - Duración (`duration`).
    - Tag (`tag`).
  - Cambiar el tipo modifica el significado del valor y de los comparadores.

- **Comparador (`comparator: 'equals' | 'contains' | 'gte' | 'lte'`)**:
  - Si `type === 'duration'`:
    - Opciones:
      - `gte` → "≥".
      - `lte` → "≤".
  - Si el tipo no es duración:
    - Opciones:
      - `equals` → "Igual".
      - `contains` → "Contiene".

- **Valor (`value: string`)**:
  - `Input` de texto libre.
  - Placeholder dinámico según `CONDITION_LABELS`:
    - Modalidad / Intensidad / Duración (min) / Tag.
  - Para duración:
    - Se interpreta numéricamente en minutos (`Number(condition.value)`).

- **Eliminar condición**:
  - Botón `Trash2` que elimina la condición de `rule.conditions`.

###### Lógica interna de evaluación de condiciones

- Implementada en `evaluateCondition(session, condition, day)`:
  - **modality**:
    - `equals`: `session.modality === condition.value`.
    - `contains`: `session.modality?.toLowerCase().includes(condition.value.toLowerCase())`.
  - **intensity**:
    - Igual que `modality`, pero sobre `session.intensity`.
  - **duration**:
    - Convierte `session.duration` a minutos con `parseMinutes()` (busca el primer número en la cadena).
    - Comparadores:
      - `gte`: `minutes >= target`.
      - `lte`: `minutes <= target`.
      - Caso por defecto: `minutes === target`.
  - **tag**:
    - Construye un array `tags` incluyendo:
      - Todos los tags de la sesión (`session.tags ?? []`).
      - El día (`day`) como tag adicional.
    - Devuelve `true` si **algún tag** contiene el valor (ignore case).

##### 1.3.4. Bloque de acciones de la regla

- Sección “Acciones”:
  - Botón "Añadir acción" (`Plus`):
    - Inserta una acción por defecto:
      - `id`: `createId()`.
      - `type`: `'set-intensity'`.
      - `mode`: `'set'`.
      - `value`: `''`.
  - Mensaje vacío:
    - "Sin acciones configuradas: no habrá cambios." cuando `rule.actions.length === 0`.
  - Cada acción se representa como una `Card` interna con:

###### Campos de una acción (`Action`)

- **Tipo (`type`)**:
  - `Select` con opciones derivadas de `ACTION_LABELS`:
    - `set-intensity` → Cambiar intensidad.
    - `bump-duration` → Ajustar duración.
    - `add-rest` → Añadir descanso.
    - `change-modality` → Cambiar modalidad.
    - `append-tag` → Añadir tag.

- **Modo (`mode`)**:
  - Solo se muestra cuando `type === 'bump-duration'`:
    - Opciones:
      - `increase` → "Aumentar".
      - `decrease` → "Disminuir".
      - `set` → "Fijar".
  - Para el resto de tipos, el modo es implícitamente `'set'`.

- **Valor (`value`)**:
  - `Input` genérico, placeholder "Valor".
  - Uso según tipo:
    - `set-intensity`: texto de intensidad objetivo (ej: "RPE 8", "Alta").
    - `bump-duration`: número de minutos.
    - `add-rest`: minutos de descanso extra (solo se usan en el texto de notas).
    - `change-modality`: nombre de nueva modalidad.
    - `append-tag`: tag a insertar.

- **Eliminar acción**:
  - Botón `Trash2` que quita la acción de la regla.

###### Lógica interna de aplicación de acciones

- Implementada en `applyAction(session, action)`:
  - `set-intensity`:
    - Retorna copia de la sesión con `intensity = action.value`.
  - `bump-duration`:
    - Parsea la duración actual (`parseMinutes`) como `current`.
    - Parsea `modifier = Number(action.value) || 0`.
    - Según `action.mode`:
      - `increase`: `next = current + modifier`.
      - `decrease`: `next = max(5, current - modifier)`.
      - `set` (o cualquier otro): `next = modifier`.
    - Devuelve sesión con `duration = \`${next} min\``.
  - `add-rest`:
    - Construye `note = "[Descanso extra: X min]"`.
    - Si `session.notes` ya contiene esa nota exacta, no la repite.
    - Si no, concatena usando el separador `" · "`.
  - `change-modality`:
    - Devuelve sesión con `modality = action.value`.
  - `append-tag`:
    - Construye un `Set` con `session.tags ?? []`.
    - Añade `action.value`.
    - Devuelve sesión con `tags = Array.from(set)`.

#### 1.4. Plantillas de reglas y presets

- **Plantillas por defecto (`DEFAULT_TEMPLATES`)**:
  - Tarjeta “Biblioteca de plantillas”.
  - Muestra lista de plantillas con:
    - Nombre.
    - Descripción.
    - Nº de reglas.
    - Tags (visualizados como `Badge`).
  - Clic en una plantilla:
    - Llama a `handleSelectTemplate(template)`:
      - Reemplaza completamente `rules` por `cloneRules(template.rules)`.

- **Presets personalizados**:
  - Tarjeta “Presets personalizados”.
  - Campos:
    - `presetName` (obligatorio para guardar).
    - `presetDescription` (opcional).
  - Botón "Guardar preset":
    - Deshabilitado si `presetName.trim()` está vacío.
    - Al pulsar:
      - Crea un `RuleTemplate` con:
        - `id` generado.
        - `name` y `description` (o "Preset personalizado").
        - `tags = ['custom']`.
        - `rules = cloneRules(rules)` (clon profundo con nuevos IDs).
      - Inserta el preset al inicio de `presetLibrary` y limita a 12 elementos.
      - Persiste `presetLibrary` en `localStorage` bajo `presetStorageKey`.
  - Lista de presets:
    - Cada uno es un botón que muestra:
      - Nombre, número de reglas y descripción.
    - Clic ejecuta `handleApplyPreset(preset)`:
      - Reemplaza las reglas actuales por un clon del preset.

#### 1.5. Historial de ejecuciones de reglas

- Tarjeta “Historial reciente”:
  - Si `history` está vacío:
    - Muestra mensaje invitando a aplicar reglas para empezar a llenar el historial.
  - Si no:
    - Lista de entradas (`HistoryEntry`):
      - Fecha/hora formateada (`new Date(entry.timestamp).toLocaleString()`).
      - Número de bloques modificados (`entry.metrics.sessionsTouched`).
      - Texto de resumen (`entry.summary`).
- Actualización del historial (`handleApply`):
  - Al aplicar reglas:
    - Crea `entry` con:
      - `summary`: "Aplicadas {affectedRules} regla(s) · {sessionsTouched} bloques".
      - `metrics`: el objeto de métricas de previsualización.
    - Prependa la entrada a `history` (máx. 15).
    - Persiste en `localStorage` bajo `historyStorageKey`.

#### 1.6. Paso 2 – Previsualizar impacto

- Tarjeta “Impacto proyectado”:
  - Resumen principal:
    - "X bloques afectados · Δ duración +Y min / -Y min" usando `previewResult.metrics`.
  - **Duración diaria**:
    - Lista `previewResult.metrics.perDay`:
      - Para cada día:
        - Nombre del día.
        - `delta` de minutos:
          - Sin formato especial si `delta === 0`.
          - Verde si `delta > 0`.
          - Rojo si `delta < 0`.
  - **Distribución de intensidades**:
    - Recorre claves de `intensityBefore`.
    - Para cada intensidad:
      - `before = intensityBefore[key]`.
      - `after = intensityAfter[key] || 0`.
      - `delta = after - before`.
      - Muestra "before → after (delta)" con color verde/rojo según signo.
  - Nota:
    - Recomienda ajustar las reglas si se observa un impacto no deseado antes de aplicar.

- Acciones:
  - Botón "Volver a reglas":
    - Establece `currentStep = 1`.
  - Botón "Aplicar al plan":
    - Ejecuta `handleApply()` directamente.
    - Deshabilitado si `enabledRules.length === 0`.

#### 1.7. Paso 3 – Confirmar & aplicar

- Tarjeta de confirmación:
  - Mensaje de éxito:
    - "Cambios aplicados correctamente."
  - Resumen:
    - Nº de bloques que se han actualizado (`previewResult.metrics.sessionsTouched`).
    - Nº de días con cambio de duración (`metrics.perDay` con `delta !== 0`).
  - Botones:
    - **Exportar resumen**:
      - Llama a `handleExportSummary()`:
        - Si `onExportSummary` existe, le pasa `previewResult`.
        - Actualiza `exportStatus` con mensaje de confirmación.
    - **Configurar nuevas reglas**:
      - Llama a `setCurrentStep(1)` para volver al inicio del wizard de reglas.

- Efecto principal de `handleApply()`:
  - Llama a `onApplyRules(previewResult.simulatedPlan)`.
  - Ajusta `workingPlan` para que sea la copia del plan simulado.
  - Añade entrada a `history`.
  - Fija `currentStep = 3`.

---

### 2. Editar sesiones (`edit-sessions`)

Modo para modificar manualmente los bloques día a día sobre el `workingPlan`, sin automatismos.

#### 2.1. Selección de día

- Cabecera:
  - Título “Editar sesiones por día”.
  - Explicación: los cambios se aplican al programa usando el botón “Aplicar cambios al programa”.
- Selector de días:
  - Lista de botones basada en `weekDays`.
  - Cada botón muestra:
    - Nombre del día.
    - Contador de sesiones del día en `workingPlan` (`({sessionsCount})`).
  - El día seleccionado se resalta.
  - Pulsar un día actualiza `selectedDayForEdit`.
- Día efectivo (`effectiveEditDay`):
  - Si `selectedDayForEdit` no está en `weekDays`, se fuerza al primer día.
  - Se usa para obtener `selectedDayPlan`.

#### 2.2. Edición de bloques de un día

- Cabecera del panel de sesiones:
  - Muestra el nombre de `effectiveEditDay`.
  - Si hay día seleccionado:
    - Botón "Añadir sesión":
      - Crea una nueva sesión con:
        - `id`: generado con `createId()`.
        - Campos iniciales:
          - `time = '00:00'`.
          - `block = 'Nuevo bloque'`.
          - `duration = '10 min'`.
          - `modality = 'Custom'`.
          - `intensity = 'Media'`.
          - `notes = ''`.
      - La añade al final de `selectedDayPlan.sessions`.
- Si `selectedDayPlan` no existe o no tiene sesiones:
  - Mensaje de ayuda explicando que se puede usar "Añadir sesión".
- Si hay sesiones:
  - Cada sesión (`DaySession`) se muestra en una `Card` con:

##### Campos de una sesión

- **Cabecera del bloque**:
  - Texto "Bloque X":
    - Usa `session.block` si existe, si no, el `id`.
  - Botones:
    - Duplicar:
      - Clona la sesión con nuevo `id` y la añade al final.
    - Eliminar:
      - Borra la sesión según `session.id`.

- **Datos principales (grid de 2 columnas)**:
  - Hora (`time`):
    - `Input` texto.
  - Duración (`duration`):
    - `Input` texto (ej. "30 min").
    - Se usa en métricas y reglas tras parsearlo a minutos.
  - Modalidad (`modality`):
    - `Input` texto (ej. "Strength", "MetCon").
  - Intensidad (`intensity`):
    - `Input` texto (ej. "Alta", "Media", "RPE 7").

- **Notas (`notes`)**:
  - `Textarea` de 2 filas.

- **Tags (`tags`)**:
  - `Input` que representa el array de tags como string:
    - Muestra `tags.join(', ')`.
    - Al cambiar:
      - Divide por comas.
      - `trim()` de cada fragmento.
      - Filtra vacíos.
      - Guarda el resultado en `session.tags`.

#### 2.3. Aplicar cambios manuales

- Pie del modo:
  - Botón "Cerrar":
    - Llama a `handleConfirmClose`.
  - Botón "Aplicar cambios al programa":
    - Llama a `handleApplyWorkingPlan()`:
      - Calcula métricas de antes y después (`buildManualMetrics(weeklyPlan, workingPlan, weekDays)`).
      - Invoca `onApplyRules(workingPlan)`.
      - Registra en `history` una entrada "Cambios manuales · {sessionsTouched} bloques".
      - Ajusta `manualApplyStatus` a "Cambios aplicados al programa.".

---

### 3. Añadir rutinas (`add-routines`)

Modo para insertar **rutinas predefinidas** (`DEFAULT_ROUTINES`) en uno o varios días del `workingPlan`.
---

### 4. Mover bloques (`move-sessions`)

Modo para mover o copiar bloques específicos de un día a otro dentro del `workingPlan`.

---

### 5. Tags masivos (`bulk-tags`)

Modo para gestionar tags para muchos bloques de golpe (añadir/eliminar un tag en días seleccionados).

---

### 6. Rebalancear intensidades (`rebalance-intensity`) – `RebalanceIntensityMode`

Subcomponente para homogeneizar la intensidad de todas las sesiones por día.

---

### 7. Modalidad en lote (`bulk-modality`) – `BulkModalityMode`

Subcomponente para cambiar la modalidad de muchos bloques simultáneamente, con filtro opcional.

---

### 8. Auto finisher / warm-up (`auto-finisher`) – `AutoFinisherMode`

Subcomponente que genera automáticamente bloques de calentamiento o finisher en días concretos.

---

### 9. Semana deload (`deload-week`) – `DeloadWeekMode`

Subcomponente para aplicar una semana de descarga reduciendo duración e intensidad en todos los días de la semana.


