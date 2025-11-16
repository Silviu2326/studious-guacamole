1. Estructura general del BatchTrainingModal

Tipo de modal

Modal grande, casi full-screen (80–90% ancho y alto).

3 zonas fijas:

Header superior.

Zona de pestañas + contenido principal.

Footer con acciones globales.

1.1. Header superior

Contenido:

Título principal:
Batch Training – Ajustes masivos del programa

Subtítulo (copy trainer friendly):
Aplica cambios a toda la semana de forma rápida y segura. Primero pruebas, luego aplicas.

A la derecha:

Selector compacto del rango de fechas / semana (opcional).

Etiqueta:
Plan actual: Semana X (para recordar que el weeklyPlan original está “debajo”).

Botón X para cerrar.

Debajo del header, una barra con:

Tabs (pestañas):

Resumen

Acciones rápidas

Edición manual

Automatizaciones avanzadas

2. Pestaña 1 – “Resumen”

Objetivo: dar una vista global clara y generar confianza antes de tocar nada.

2.1. Layout

Columna izquierda (2/3 ancho) – Métricas y distribución.

Columna derecha (1/3) – Historial de cambios y estado.

2.2. Contenido

A. Tarjeta “Resumen de la semana”

Total de:

Bloques/sesiones.

Minutos totales.

Nº de días con sesiones.

Pequeño gráfico / lista por día:

Lun: 60 min · 3 bloques

Mar: 45 min · 2 bloques
(esto puedes sacarlo de tus métricas actuales que ya calculas para preview/manual).

B. Tarjeta “Intensidades”

Tabla simple o mini-barras:

Baja: 5 sesiones

Media: 8 sesiones

Alta: 4 sesiones

Si ya tienes métricas de “antes/después” de una operación, aquí se pueden mostrar cuando haya cambios aplicados:

Baja: 5 → 3 (-2)

Alta: 4 → 6 (+2)

C. Tarjeta “Distribución por modalidades”

Lista:

Fuerza · 5 sesiones.

Cardio · 3 sesiones.

MetCon · 4 sesiones.

Sirve para que el entrenador vea si la semana está bien repartida.

D. Columna derecha – “Historial reciente”

Aquí encajas lo que ya tienes en tu history:

Título: Historial de cambios

Cada entrada:

Fecha/hora.

Resumen tipo:

Aplicadas 3 reglas · 10 bloques modificados

Cambios manuales · 4 bloques

Botón pequeño: Ver detalles (opcional para futuro, aunque no haga nada aún).

Texto vacío cuando no hay historial:

Todavía no has aplicado cambios masivos a esta semana. Usa las pestañas de “Acciones rápidas” o “Automatizaciones avanzadas” para empezar.

3. Pestaña 2 – “Acciones rápidas”

Objetivo: encapsular todos tus modos potentes en recetas simples para entrenadores, usando internamente tus subcomponentes: add-routines, move-sessions, bulk-tags, rebalance-intensity, bulk-modality, auto-finisher, deload-week.

3.1. Layout

Arriba: texto breve

“Elige qué quieres hacer y sigue los pasos. Siempre podrás previsualizar el impacto antes de aplicar.”

Abajo: dos columnas:

Izquierda: Grid de tarjetas de acciones (como un menú).

Derecha: Panel de configuración + previsualización de la acción seleccionada.

3.2. Tarjetas de acción (lado izquierdo)

Tarjetas grandes tipo botón, una por modo:

Añadir rutinas predefinidas
→ usa tu modo add-routines.

Mover o copiar bloques entre días
→ usa tu modo move-sessions.

Añadir / quitar tags en lote
→ modo bulk-tags.

Rebalancear intensidades de la semana
→ rebalance-intensity.

Cambiar modalidad en lote
→ bulk-modality.

Añadir calentamientos / finishers automáticos
→ auto-finisher.

Aplicar semana de deload
→ deload-week.

Cada tarjeta muestra:

Icono.

Título.

Descripción en una línea:

“Aplica una rutina predefinida a varios días a la vez.”

“Sube o baja la intensidad de todos los días de forma equilibrada.”

Al hacer click en una tarjeta → se activa esa acción en el panel derecho.

3.3. Panel derecho – Configuración de la acción seleccionada

Estructura común para todas las acciones rápidas:

Título: “Configuración: [acción elegida]”.

Paso 1 – Seleccionar días

Lista de días de la semana con checkboxes:

Lun [ ] Mar [ ] Mié [ ] ...

Opción Seleccionar todos.

Paso 2 – Parámetros específicos de la acción
Aquí conectas con tus subcomponentes:

Añadir rutinas (add-routines):

Select de DEFAULT_ROUTINES.

Información de cada rutina (duración, tipo, notas).

Mover bloques (move-sessions):

Select de día origen.

Checkboxes de sesiones de ese día.

Select de día destino.

Toggle Mover vs Copiar.

Tags masivos (bulk-tags):

Input de tag a añadir o eliminar.

Radio: Añadir tag / Quitar tag.

Rebalance intensities (rebalance-intensity):

Selector de estrategia:

“Homogeneizar por día”.

“Limitar nº de sesiones Alta por semana”.

Bulk modality (bulk-modality):

Modalidad actual a filtrar (opcional).

Nueva modalidad.

Auto-finisher:

Select de tipo de finisher (core, cardio, metabólico…).

Duración aproximada (minutos).

Deload week:

Slider o imput:

“Reducir duración un X%” (ej. 30%).

Opcionalmente: bajar intensidad un nivel (Alta → Media).

Paso 3 – Previsualización de impacto

Debajo de la configuración:

Tarjeta “Impacto estimado” similar a la que ya tienes en previewResult.metrics:

X bloques afectados

Δ duración total: +Y / -Y min

Lista por día con cambios de minutos.

Esta tarjeta puede reutilizar tu runRulesPreview o lógica equivalente para cada modo.

Botones del panel

Izquierda: Cancelar (resetea la acción seleccionada y/o vuelve al estado inicial).

Derecha:

Botón principal: Aplicar cambios a la semana.

Internamente llama a onApplyRules(updatedPlan) usando el workingPlan resultante del modo correspondiente.

Debajo: texto pequeño:

“Se aplicará solo a los días seleccionados. El resto del plan no cambiará.”

4. Pestaña 3 – “Edición manual”

Aquí entra tu modo edit-sessions tal cual, pero presentado muy visual.

4.1. Layout

Tres columnas:

Columna izquierda – Días de la semana

Botones verticales:

Lun (3 sesiones)

Mar (0 sesiones)

...

Muestra el día seleccionado con un highlight.

Botón arriba: Añadir sesión para el día seleccionado.

Columna central – Lista de sesiones del día

Cada sesión como una card:

Cabecera:

Bloque: [nombre] (o “Nuevo bloque”).

Iconos:

Duplicar.

Eliminar.

Cuerpo en grid:

Hora.

Duración.

Modalidad.

Intensidad.

Notas (textarea).

Tags (input separado por comas, como ya haces).

Columna derecha – Resumen del día

Pequeña tarjeta:

Total de minutos del día.

Nº de bloques.

Lista de intensidades:

Baja / Media / Alta.

Si quieres, un mini gráfico de barras.

4.2. Acciones de la pestaña

En el footer del modal, cuando estás en esta pestaña:

Botón izquierda: Cerrar (usa tu handleConfirmClose).

Botón derecha: Aplicar cambios al programa
→ llama a tu función handleApplyWorkingPlan():

Llama a onApplyRules(workingPlan).

Registra historial: “Cambios manuales · X bloques”.

Muestra notificación tipo: Cambios aplicados correctamente.

5. Pestaña 4 – “Automatizaciones avanzadas”

Aquí vive tu modo rules con el wizard de 3 pasos, plantillas, presets y historial interno de reglas.

5.1. Layout

Parte superior: Stepper de 3 pasos (como ya lo tienes):

1. Definir reglas

2. Previsualizar

3. Confirmar & aplicar

Debajo, contenido del paso actual.

A la derecha (o debajo) un panel lateral opcional con:

Biblioteca de plantillas.

Presets del usuario.

5.2. Paso 1 – Definir reglas (UI para entrenadores)

Sección principal:

Tarjeta de cabecera

“Reglas activas” con:

Nº de reglas habilitadas.

Bloques potenciales afectados (si ya tienes un preview básico).

Botón + Crear nueva regla.

Lista de reglas (cada una en una Card):

Encabezado de la regla:

Toggle ON/OFF (icono tipo interruptor).

Campo nombre editable → “Nombre de la regla”.

Campo texto opcional “Descripción (opcional)”.

Botones:

Duplicar.

Eliminar.

Bloque “¿Dónde se aplica?” (tus Condiciones):

Botón + Añadir condición.

Cada condición como frase construida:

Cuando [Tipo: Modalidad / Intensidad / Duración / Tag] [Operador: es / contiene / ≥ / ≤] [Valor].

Internamente sigues usando tus type, comparator y value.

Bloque “¿Qué quieres que pase?” (tus Acciones):

Botón + Añadir acción.

Cada acción se representa como:

Cambiar [Intensidad / Duración / Modalidad / Añadir descanso / Añadir tag] a / en [Valor].

Para duración, dropdown “Aumentar / Disminuir / Fijar” + minutos.

En la parte inferior de este paso:

Texto:

“Atajo: Ctrl/Cmd + Enter para pasar al siguiente paso.”

Botón Siguiente (deshabilitado si no hay reglas válidas).

Panel lateral (en este paso)

Sección Biblioteca de plantillas:

Lista de plantillas por defecto (DEFAULT_TEMPLATES).

Sección Mis presets:

Input nombre preset.

Botón Guardar preset.

Lista de presets guardados.

Clic en uno → sustituye las reglas actuales.

5.3. Paso 2 – Previsualizar

Tarjeta principal:

Título: Impacto proyectado de las reglas.

Bloque resumen:

X bloques afectados.

Δ duración total.

Tabla por día, igual que en tu previewResult.metrics.perDay.

Tabla de intensidades antes / después.

Botones:

Volver a reglas (izquierda).

Aplicar al plan (derecha, usa handleApply()).

5.4. Paso 3 – Confirmar & aplicar

Tarjeta:

Mensaje de éxito: Cambios aplicados correctamente.

Resumen:

Bloques modificados.

Días con cambios.

Botones:

Exportar resumen → onExportSummary(previewResult).

Configurar nuevas reglas → vuelve al Paso 1.

Cerrar → cierra el modal (handleConfirmClose).

6. Mapeo de todo lo que ya tienes → nueva interfaz

Para que quede claro que no pierdes nada:

rules → Pestaña Automatizaciones avanzadas, con el wizard de 3 pasos + plantillas + presets + historial interno.

edit-sessions → Pestaña Edición manual.

add-routines → Pestaña Acciones rápidas, tarjeta “Añadir rutinas predefinidas”.

move-sessions → Pestaña Acciones rápidas, tarjeta “Mover o copiar bloques”.

bulk-tags → Pestaña Acciones rápidas, tarjeta “Añadir / quitar tags en lote”.

rebalance-intensity → Pestaña Acciones rápidas, tarjeta “Rebalancear intensidades”.

bulk-modality → Pestaña Acciones rápidas, tarjeta “Cambiar modalidad en lote”.

auto-finisher → Pestaña Acciones rápidas, tarjeta “Añadir calentamientos / finishers”.

deload-week → Pestaña Acciones rápidas, tarjeta “Semana de deload”.

history + métricas globales → Pestaña Resumen (y parte de Autom. avanzadas).