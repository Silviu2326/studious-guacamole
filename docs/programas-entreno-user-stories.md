# Programas de Entreno · User Stories

## Topbar

### Botón «Cliente»
- Como **coach**, quiero abrir la ficha del cliente en un modal con varias pestañas (perfil, objetivos, historial, alertas, notas), para tener una vista completa sin salir del editor.
- Como **coach**, quiero visualizar los datos biométricos, lesiones, hábitos, disponibilidad de material y cronotipo, para planificar sesiones acordes a su contexto real.
- Como **coach**, quiero revisar objetivos a corto, medio y largo plazo junto con métricas de progreso, para ajustar el plan según los avances y expectativas actuales.
- Como **coach**, quiero ver alertas activas (dolores, contraindicaciones, incidencias recientes) con su nivel de prioridad, para reaccionar antes de prescribir ejercicios riesgosos.
- Como **coach**, quiero acceder al timeline de sesiones, feedback y resultados anteriores, para detectar patrones de adherencia o fatiga acumulada.
- Como **coach**, quiero registrar notas colaborativas y mencionables por entrenador, para coordinar al equipo que da seguimiento al cliente.
- Como **coach**, quiero exportar la ficha en PDF o CSV, para compartir la información con el propio cliente o con especialistas externos.

### Botón «Fit Coach»
- Como **coach**, quiero abrir un asistente con IA en formato chat dentro del modal, para conversar sobre ajustes y recibir sugerencias contextualizadas al programa actual.
- Como **coach**, quiero poder elegir entre un modo “Asistente” (resumen estructurado) y un modo “Chat” (interacción libre), para adaptar la experiencia a mi forma de trabajar.
- Como **coach**, quiero que la IA conozca los datos de la ficha del cliente y el plan semanal, para que sus respuestas consideren lesiones, objetivos y sesiones ya programadas.
- Como **coach**, quiero solicitar recomendaciones específicas (p. ej. “añade calentamiento de 10 min”) y recibir bloques listos para arrastrar al plan.
- Como **coach**, quiero ver el razonamiento o métricas clave detrás de cada sugerencia, para confiar en la propuesta antes de aplicarla.
- Como **coach**, quiero guardar conversaciones importantes del chat como plantillas o notas asociadas al cliente, para revisarlas en futuras sesiones.
- Como **coach**, quiero compartir rápidamente los extractos del chat con el cliente (email, mensaje, exportación) para mantenerlo informado del plan.

### Botón «Sustituciones»
- Como **coach**, quiero buscar y sustituir cualquier entidad del programa (ejercicios individuales, bloques, sesiones completas, tags, notas) desde un único modal, para responder rápido ante cambios.
- Como **coach**, quiero seleccionar múltiples elementos en distintos días y reemplazarlos simultáneamente, para evitar acciones repetitivas cuando aparece una restricción nueva.
- Como **coach**, quiero aplicar filtros avanzados (modalidad, intensidad, duración, equipamiento, tags personalizados) antes de elegir la sustitución, para mantener coherencia en el plan.
- Como **coach**, quiero previsualizar el impacto de la sustitución (volumen, calorías, densidad) antes de confirmar, para asegurar que el ajuste no rompe el balance semanal.
- Como **coach**, quiero disponer de reglas inteligentes (p. ej. “si el cliente está lesionado del hombro, reemplazar presses por variantes en máquina”), para automatizar reemplazos recurrentes.
- Como **coach**, quiero revisar un historial con posibilidad de deshacer/rehacer sustituciones recientes, para regresar rápidamente a una versión anterior si el cambio no funciona.
- Como **coach**, quiero guardar combinaciones de sustituciones frecuentes como presets (“modo deload”, “semana de competición”), para ejecutarlas con un clic cuando sea necesario.

### Botón «Batch Training»
- Como **coach**, quiero crear flujos de automatización complejos sobre el plan semanal (añadir, editar, mover, duplicar, eliminar), para ajustar en masa sin salir del editor.
- Como **coach**, quiero asignar tags a días, sesiones y ejercicios (p. ej. “heavy lower”, “metcon corto”, “sin equipamiento”), para activar reglas basadas en condiciones dinámicas.
- Como **coach**, quiero definir reglas encadenadas con condicionales (si/entonces, y/o, limite), para modificar duración, intensidad, modalidad o notas según múltiples factores.
- Como **coach**, quiero programar automatizaciones recurrentes (p. ej. cada lunes recalcular objetivos, cada semana refrescar finisher), para mantener el plan actualizado automáticamente.
- Como **coach**, quiero simular el resultado de un conjunto de reglas y ver métricas antes de aplicarlas, para anticipar cambios en volumen total, calorías o balance de intensidades.
- Como **coach**, quiero guardar, versionar y compartir presets de automatizaciones con otros entrenadores, para reutilizar procesos validados por el equipo.
- Como **coach**, quiero disponer de un log detallado de cada automatización aplicada, indicando qué elementos cambió y bajo qué condiciones, para auditar ediciones en caso de duda.

### Botón «Guardar borrador»
- Como **coach**, quiero guardar un borrador del programa sin publicarlo, para retomar ediciones más tarde sin perder el trabajo hecho.
- Como **coach**, quiero añadir un mensaje opcional al guardar el borrador, para dejar notas al siguiente entrenador que revise el plan.
- Como **coach**, quiero que el botón muestre la fecha y hora del último guardado, para confirmar que los cambios recientes están respaldados.
- Como **coach**, quiero recibir una confirmación visual discreta tras guardar, para continuar editando sin salir de la pantalla.

## Panel lateral izquierdo (Biblioteca & bloques)
- Como **coach**, quiero arrastrar y soltar cualquier elemento de la biblioteca (bloques, ejercicios, plantillas completas) directamente sobre el lienzo central, para construir sesiones sin pasos adicionales.
- Como **coach**, quiero visualizar zonas de drop destacadas en el lienzo según el tipo de elemento que arrastre, para saber con claridad dónde se insertará.
- Como **coach**, quiero que al pasar el ratón sobre un ejercicio se muestre una previsualización rápida (músculos, duración, equipamiento), para decidir si lo arrastro sin abrir otra vista.
- Como **coach**, quiero una barra de búsqueda unificada que filtre simultáneamente plantillas, bloques y ejercicios, para encontrar lo que necesito con una sola consulta.
- Como **coach**, quiero aplicar filtros combinados (equipamiento, intensidad, duración, modalidad, tags personalizados) y guardar mis combinaciones favoritas, para reutilizar criterios habituales.
- Como **coach**, quiero anclar plantillas o bloques frecuentes en un área destacada, para arrastrarlos al lienzo sin necesidad de buscarlos cada vez.
- Como **coach**, quiero que el panel recuerde la última categoría y filtros utilizados, para retomar donde lo dejé cuando vuelva al editor.
- Como **coach**, quiero arrastrar múltiples elementos en lote (selección múltiple + drag) y soltarlos manteniendo su orden, para poblar un día completo en segundos.
- Como **coach**, quiero recibir sugerencias inteligentes en la parte superior del panel según el día que esté editando, para tener atajos contextuales listos para arrastrar.

## Área central (Canvas)

### Vista semanal · ágil y personalizada
- Como **coach**, quiero alternar entre una vista híbrida (tablero semanal de siete columnas y tarjetas expandibles tipo agenda), para elegir el formato que mejor encaje con la carga de sesiones de la semana.
- Como **coach**, quiero que cada sesión adopte colores e iconos dinámicos según tipo de entrenamiento y grupo muscular, para detectar de un vistazo excesos o carencias de estímulos.
- Como **coach**, quiero editar inline series, repeticiones, duración o intensidad haciendo doble clic sobre un bloque, para ajustar la carga sin abrir menús modales.
- Como **coach**, quiero seleccionar múltiples bloques (por modalidad, día o tag) y aplicar acciones masivas como duplicar, desplazar o reducir volumen, para ahorrar tiempo en ajustes grandes.
- Como **coach**, quiero ver líneas de referencia que marquen los objetivos de carga diaria/semanal y que cambien el color de las barras cuando se excedan, para actuar antes de que haya sobrecarga.
- Como **coach**, quiero recibir accesos rápidos desde el panel derecho con bloques recomendados y poder arrastrarlos directamente a huecos libres del calendario, para rellenar vacíos en segundos.
- Como **coach**, quiero superponer la semana actual con otra (anterior, próxima o de referencia) en modo fantasma, para comparar tendencias y mantener progresiones equilibradas.

### Vista diaria · detalle ajustable e interacción enriquecida
- Como **coach**, quiero visualizar las sesiones en un timeline vertical con control de zoom, para alternar entre un resumen compacto y un detalle completo de cada ejercicio.
- Como **coach**, quiero comparar cualquier ejercicio con su versión en la sesión anterior y ver mejoras o retrocesos destacados, para tomar decisiones de progresión informadas.
- Como **coach**, quiero cambiar entre un modo de edición rápida y uno completo, para alternar correcciones pequeñas con configuración avanzada (tempo, descansos, material alternativo).
- Como **coach**, quiero que la IA detecte riesgos (p. ej. dos días seguidos de piernas) y proponga planes de movilidad o descarga insertables con un clic, para prevenir lesiones.

### Vista Excel · potencia inspirada en hojas de cálculo
- Como **coach**, quiero completar un cuestionario inicial sobre mi forma de trabajar (metrías clave, frecuencia de revisión, nivel de detalle), para que la vista Excel se configure automáticamente según mis necesidades.
- Como **coach**, quiero poder reabrir el cuestionario cuando cambie mi rol o prioridades, para regenerar el layout con nuevas columnas, cálculos y resúmenes.
- Como **coach**, quiero que el cuestionario sugiera plantillas recomendadas basadas en mis respuestas (p. ej. más columnas de tonelaje, menos columnas de movilidad), para personalizar la vista en segundos.
- Como **coach**, quiero acceder a plantillas prediseñadas según mi rol (fuerza, maratón, HIIT) que configuren columnas, fórmulas y resúmenes, para empezar con la estructura adecuada.
- Como **coach**, quiero añadir fórmulas personalizadas tipo Excel (volumen, tonelaje, densidad) que se recalculen automáticamente cuando cambian los datos, para mantener métricas consistentes.
- Como **coach**, quiero aplicar formato condicional que resalte en verde los objetivos cumplidos y en rojo las desviaciones, para detectar anomalías sin analizar celda por celda.
- Como **coach**, quiero generar tablas dinámicas y resúmenes rápidos desde el panel derecho al seleccionar un rango, para obtener estadísticas (volumen por grupo muscular, RPE medio) sin salir de la vista.
- Como **coach**, quiero desplegar gráficos (histogramas, líneas de tendencia) desde la barra superior sin exportar, para visualizar la evolución de cargas directamente en el editor.
- Como **coach**, quiero copiar y pegar datos entre la vista Excel y hojas de cálculo externas conservando la estructura, para trabajar de forma híbrida con herramientas que ya uso.
- Como **coach**, quiero que la IA analice las celdas seleccionadas y sugiera cambios (p. ej. aumentar series de piernas si son insuficientes para hipertrofia), para ajustar el plan basándose en datos.

## Panel lateral derecho (Resumen & asistente inteligente)
- Como **coach**, quiero que el panel actúe como un asistente que interpreta los datos del plan y del cliente, para recibir insights relevantes sin buscarlos manualmente.
- Como **coach**, quiero ver resúmenes dinámicos (tendencias de volumen, intensidad, adherencia, calorías) con comparación respecto a semanas anteriores, para detectar cambios significativos.
- Como **coach**, quiero recibir alertas proactivas cuando detecte riesgos (sobrecarga en un grupo muscular, baja frecuencia de movilidad, feedback negativo del cliente), junto con recomendaciones accionables.
- Como **coach**, quiero que las sugerencias se adapten a la vista activa (semanal, diaria, Excel) mostrando bloques o fórmulas listos para arrastrar, aplicar o descartar, para agilizar decisiones.
- Como **coach**, quiero que el panel muestre una línea de tiempo de los próximos hitos (sesiones críticas, revisiones, competiciones) y tareas pendientes, para no olvidar acciones clave.
- Como **coach**, quiero poder registrar notas, acuerdos y recordatorios directamente en el panel y etiquetarlos (p. ej. “Revisar fatiga”, “Enviar vídeo”), para tener contexto al volver al plan.
- Como **coach**, quiero que el asistente combine feedback del cliente, métricas de rendimiento, datos externos (p. ej. sueño, meteorología) y los fusione en insights concretos, para ajustar el plan con información completa.
- Como **coach**, quiero disponer de accesos rápidos a acciones frecuentes (duplicar semana, generar plan de movilidad, enviar resumen al cliente) sugeridos por el asistente según el momento, para ahorrar clics.
- Como **coach**, quiero poder conversar con el panel en lenguaje natural (“¿Cuál es el ejercicio más cargado esta semana?”) y recibir respuestas contextualizadas apoyadas en datos, para resolver dudas al instante.
- Como **coach**, quiero aceptar o descartar recomendaciones y que el asistente aprenda de mis decisiones, para que futuras sugerencias se alineen mejor con mi estilo de programación.

## Interacciones generales
- Como **coach**, quiero que los paneles recuerden su estado (colapsado/expandido) cuando vuelva a la página para continuar donde lo dejé.
- Como **coach**, quiero que los atajos de teclado permitan cambiar de vista y colapsar paneles para trabajar más rápido sin usar el ratón.
