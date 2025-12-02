# Editor de Dieta · User Stories

## Topbar y navegación
- Como **dietista**, quiero regresar al listado general desde un botón visible, para alternar rápidamente entre diferentes dietas asignadas.
- Como **dietista**, quiero ver en la topbar la semana, el objetivo calórico y el estado del plan, para confirmar que edito la versión correcta antes de aplicar cambios.
- Como **dietista**, quiero un botón de guardado que muestre la hora del último autosave y permita “Guardar como borrador” o “Publicar”, para gestionar versiones con tranquilidad.
- Como **dietista**, quiero lanzar un asistente IA desde la topbar que analice instantáneamente la semana y sugiera ajustes, para tomar decisiones sin abandonar el flujo de trabajo.
- Como **dietista**, quiero duplicar la dieta actual desde el encabezado, para crear rápidamente variaciones (leve déficit, mantenimiento, superávit).
- Como **dietista**, quiero recibir alertas en la topbar cuando existan inconsistencias (día sin comidas, macros fuera de rango), para detectarlas antes de cerrar la semana.
- Como **dietista**, quiero disponer de un historial de cambios accesible desde la topbar, para revisar rápidamente qué modificaciones se hicieron y revertir si es necesario.
- Como **dietista**, quiero fijar atajos rápidos (p. ej. “Duplicar semana”, “Generar lista compra”) en el encabezado, para acceder a mis acciones favoritas sin abrir menús adicionales.

## Métricas de cabecera
- Como **dietista**, quiero visualizar tarjetas con métricas clave (kcal objetivo, macronutrientes, ratio proteína/kg, vasos de agua, fibra), para validar que los ejes principales están cubiertos.
- Como **dietista**, quiero personalizar qué tarjetas aparecen y su orden, para centrarme en los indicadores más relevantes para cada cliente.
- Como **dietista**, quiero que cada tarjeta muestre la desviación respecto al plan anterior y un indicador de tendencia, para identificar si vamos en la dirección correcta.
- Como **dietista**, quiero que las métricas integren datos externos (actividad real, sueño, estrés), para contextualizar el plan con el estilo de vida del cliente.
- Como **dietista**, quiero poder añadir notas o mini objetivos a cada métrica (p. ej. “subir a 2000 ml de agua”), para recordar micro metas al revisar el panel.

## Panel lateral izquierdo · Biblioteca & recursos
- Como **dietista**, quiero disponer de un buscador unificado que filtre plantillas, recetas, alimentos, bloques y snacks, para encontrar cualquier recurso con una sola búsqueda.
- Como **dietista**, quiero arrastrar y soltar cualquier recurso sobre el calendario o la vista diaria, para construir menús sin diálogos intermedios.
- Como **dietista**, quiero filtrar la biblioteca por valores nutricionales (kcal, macros, fibra, sodio), estilo culinario, restricciones o tiempo de preparación, para encontrar opciones que encajen.
- Como **dietista**, quiero anclar plantillas o recetas favoritas y agruparlas en colecciones, para reutilizarlas con un clic.
- Como **dietista**, quiero guardar filtros personalizados (p. ej. “Recetas altas en proteína veganas < 20 min”), para reutilizar criterios frecuentes.
- Como **dietista**, quiero previsualizar cada recurso con macros detallados, alérgenos, coste estimado y nivel de adherencia histórica del cliente, para elegir con criterio.
- Como **dietista**, quiero crear bloques personalizados con múltiples recetas y guardarlos en la biblioteca, para volver a emplearlos en otras dietas.
- Como **dietista**, quiero ver sugerencias inteligentes en la parte superior (p. ej. “recetas con ingredientes que el cliente ya compró”), para reducir tiempo de búsqueda.
- Como **dietista**, quiero importar recursos propios (CSV, enlaces, fotos) y que queden disponibles en la biblioteca, para ampliar el repertorio más allá del catálogo base.
- Como **dietista**, quiero conectar la biblioteca con proveedores externos o marketplaces, para añadir recetas certificadas o ingredientes de temporada con un clic.
- Como **dietista**, quiero ver la huella de carbono estimada y coste aproximado de cada recurso, para ofrecer opciones sostenibles y ajustadas al presupuesto del cliente.
- Como **dietista**, quiero etiquetar recursos con niveles de adherencia o satisfacción histórica del cliente, para priorizar aquellos que sabemos que funcionarán mejor.

## Área central · Vistas y edición

### Vista semanal
- Como **dietista**, quiero alternar entre un tablero de siete columnas y una vista agenda expandible, para adaptarme al volumen de comidas de la semana.
- Como **dietista**, quiero colorear sesiones y mostrar iconos según tipo (desayuno, snack, comida principal) y objetivo (hipertrofia, déficit), para identificar desequilibrios al instante.
- Como **dietista**, quiero editar inline las porciones, macros o notas de cada bloque al hacer doble clic, para ajustar sin abrir modales.
- Como **dietista**, quiero seleccionar múltiples bloques (por día, tipo o etiqueta) y aplicar acciones en lote (duplicar, desplazar, reducir kcal, etiquetar), para agilizar cambios masivos.
- Como **dietista**, quiero ver líneas objetivo y barras acumuladas por día que cambien de color si superan/tocan el rango establecido, para controlar fácilmente el balance.
- Como **dietista**, quiero comparar la semana actual con otra (anterior, objetivo, versión histórica) en modo fantasma, para evaluar progresión y variedad.
- Como **dietista**, quiero recibir sugerencias contextuales para huecos libres (p. ej. “añadir snack proteico”), y añadirlas arrastrando desde el panel derecho, para cerrar gaps sin buscar manualmente.
- Como **dietista**, quiero poder cambiar la distribución de comidas por día (añadir/quitar bloques) y que se ajusten las macros automáticamente, para personalizar según el ritmo del cliente.
- Como **dietista**, quiero visualizar indicadores de adherencia prevista (según feedback histórico) directamente en cada día, para prever dónde habrá más riesgo de incumplimiento.
- Como **dietista**, quiero añadir tags y comentarios visibles por día (p. ej. “día pre-competición”, “viaje”), para contextualizar la planificación sin abrir cada bloque.
- Como **dietista**, quiero bloquear ciertos bloques para evitar que automatizaciones o IA los modifiquen (p. ej. comida cultural importante), para preservar elementos no negociables.
- Como **dietista**, quiero programar variaciones automáticas (p. ej. “lunes rotar snack A, miércoles snack B”) y visualizarlas en la vista semanal, para mantener variedad sin trabajo manual.

### Vista diaria
- Como **dietista**, quiero ver las comidas en un timeline vertical con control de zoom, para inspeccionar rápidamente el detalle o un resumen por bloque.
- Como **dietista**, quiero mostrar comparativas con la sesión equivalente anterior (misma comida el día anterior o semana pasada) resaltando mejoras o desviaciones, para ajustar la progresión.
- Como **dietista**, quiero alternar entre modo edición rápida (cambios pequeños) y modo avanzado (tempo culinario, sustitutos, instrucciones detalladas), para trabajar acorde a la complejidad del ajuste.
- Como **dietista**, quiero registrar notas de texto, audio o vídeo para cada bloque, para entregar instrucciones personalizadas que el cliente pueda revisar antes de cocinar.
- Como **dietista**, quiero iniciar temporizadores o cronómetros desde cada receta y almacenar el tiempo real invertido, para ajustar próximas recomendaciones según disponibilidad real.
- Como **dietista**, quiero ver el feedback del cliente (sensación, saciedad, tiempo real consumido) tras cada comida, para que el asistente IA proponga ajustes automáticos.
- Como **dietista**, quiero recibir alertas cuando la IA detecte potenciales sobrecargas (p. ej. demasiada fibra dos días seguidos, baja hidratación) y añadir bloques preventivos con un clic.
- Como **dietista**, quiero duplicar comidas a otros días arrastrando entre columnas o usando atajos, para acelerar la planificación cuando un cliente repite menús.
- Como **dietista**, quiero asignar sustitutos sugeridos (p. ej. “sin lactosa”, “versión rápida”) visibles dentro de cada bloque, para que el cliente adapte la comida si surge un imprevisto.
- Como **dietista**, quiero integrar recordatorios de suplementos o hidratación en la vista diaria, para que aparezcan junto a las comidas correspondientes.
- Como **dietista**, quiero visualizar el impacto estimado en calorías/hora cuando el cliente realiza ejercicio adicional, para ajustar ingestas dentro del mismo timeline.

### Vista Excel
- Como **dietista**, quiero iniciar un cuestionario que pregunte sobre mi metodología (métricas, nivel de detalle, foco del cliente), para que la vista Excel se configure automáticamente a mi estilo.
- Como **dietista**, quiero reabrir el cuestionario cuando cambien las necesidades y regenerar el layout con nuevas columnas y fórmulas, para mantener la vista alineada con mis prioridades.
- Como **dietista**, quiero que, según mis respuestas, el sistema sugiera plantillas (p. ej. entrenador de fuerza, nutricionista endurance) que adapten las columnas y resúmenes, para ahorrar setup manual.
- Como **dietista**, quiero añadir fórmulas personalizadas (tonelaje, densidad energética, % vegetariano) que se recalculen automáticamente, para analizar datos avanzados sin salir del editor.
- Como **dietista**, quiero utilizar formato condicional que resalte celdas fuera de rango (exceso de sodio, déficit de proteína) para centrarme en las anomalías.
- Como **dietista**, quiero generar tablas dinámicas o resúmenes automáticos al seleccionar un rango (volumen por grupo muscular, promedio de saciedad), para obtener insights inmediatos.
- Como **dietista**, quiero visualizar gráficos (histogramas, líneas de progresión, circular de macros) sin exportar, para compartir la evolución con el cliente desde la plataforma.
- Como **dietista**, quiero copiar y pegar columnas desde/hacia Excel u otras hojas manteniendo la estructura, para colaborar con otros profesionales que usan herramientas externas.
- Como **dietista**, quiero que la IA analice las columnas seleccionadas y proponga ajustes (p. ej. “sube la proteína en cenas”), para detectar mejoras sin revisar todas las celdas manualmente.
- Como **dietista**, quiero crear plantillas propias con fórmulas y formatos guardados, para reutilizarlas en otros clientes con un clic.
- Como **dietista**, quiero exportar la vista Excel con filtros activos o sin ellos, para compartir únicamente la información relevante con stakeholders.
- Como **dietista**, quiero incorporar columnas de coste, tiempo de preparación y satisfacción prevista, para evaluar el plan desde una perspectiva holística.

## Panel lateral derecho · Resumen & asistente
- Como **dietista**, quiero que el panel derecho actúe como un asistente inteligente que interprete adherencia, feedback y datos externos (sueño, estrés) para ofrecer insights accionables.
- Como **dietista**, quiero ver un dashboard compacto con macros diarias, tendencia semanal, % de días en rango y objetivos de micronutrientes, para comprobar el estado general.
- Como **dietista**, quiero recibir alertas proactivas cuando detecte riesgos (deficiencia de fibra, baja ingesta de agua, exceso de procesados) junto a soluciones concretas.
- Como **dietista**, quiero que el panel muestre la próxima comida relevante con tips de preparación e ingredientes pendientes, para que el cliente llegue preparado.
- Como **dietista**, quiero registrar notas, acuerdos y recordatorios etiquetados (p. ej. “Revisar suplementación”, “Coordinar con entrenador”), para tener contexto cuando vuelva al editor.
- Como **dietista**, quiero conversar en lenguaje natural con el asistente (“¿Qué comidas tienen más sodio?”) y recibir respuestas basadas en los datos del plan.
- Como **dietista**, quiero aceptar o descartar sugerencias y que el asistente aprenda mis preferencias, para que las recomendaciones futuras estén alineadas con mi estilo.
- Como **dietista**, quiero obtener accesos rápidos a acciones frecuentes (generar lista de compra, duplicar semana, enviar resumen al cliente) en función del momento del plan.
- Como **dietista**, quiero ver un timeline de hitos (controles médicos, competiciones, sesiones clave) y tareas pendientes, para alinear la nutrición con eventos importantes.
- Como **dietista**, quiero que el panel sugiera planes de contingencia cuando detecte condiciones externas (viajes, eventos sociales, lesiones), para adaptar el plan sin empezar de cero.
- Como **dietista**, quiero visualizar insights de coste total, variedad nutricional y grado de procesamiento de los alimentos, para ajustar el plan a objetivos de salud global.
- Como **dietista**, quiero que el asistente proponga contenido educativo (artículos, vídeos cortos) acorde a los retos del cliente, para reforzar la adherencia con información relevante.

## IA y automatizaciones
- Como **dietista**, quiero que la IA equilibre automáticamente macros por día o semana respetando mis reglas (p. ej. proteína mínima, límite de azúcares), para ajustar en segundos.
- Como **dietista**, quiero definir reglas personalizadas (condiciones + acciones) que se ejecuten bajo demanda o de forma recurrente (p. ej. “si día libre, añadir postre libre”), para automatizar ajustes comunes.
- Como **dietista**, quiero que la IA analice el historial del cliente (adherencia, preferencias, feedback) para priorizar recetas con mayor probabilidad de cumplimiento.
- Como **dietista**, quiero simular el impacto de recomendaciones IA antes de aplicarlas (variación de kcal, coste, tiempo de preparación), para decidir con información completa.
- Como **dietista**, quiero conectar la IA con mi inventario de ingredientes o con apps externas (MyFitnessPal, Cronometer), para actualizar valores con datos reales.
- Como **dietista**, quiero que la IA pueda generar planes alternativos (p. ej. “versión vegetariana”, “plan con presupuesto reducido”) partiendo del actual, para personalizar rápidamente.
- Como **dietista**, quiero recibir explicaciones claras de por qué la IA propone cada ajuste, para evaluar la recomendación con criterio profesional.
- Como **dietista**, quiero programar automatizaciones activadas por eventos (feedback negativo, ingesta registrada fuera de rango), para que el sistema responda sin mi intervención constante.

## Gestión de compras y logística
- Como **dietista**, quiero generar listas de la compra por cliente, semana o tipo de comida, agrupadas por categorías (frutas, proteínas, despensa), para facilitar la compra.
- Como **dietista**, quiero ajustar la lista según el número de raciones o personas, para que el cliente reciba cantidades adaptadas.
- Como **dietista**, quiero detectar ingredientes que se repiten y consolidar unidades, para evitar duplicados y optimizar el gasto.
- Como **dietista**, quiero exportar o enviar la lista de compra por email, WhatsApp o PDF, para que el cliente la reciba en su canal favorito.
- Como **dietista**, quiero añadir sugerencias de meal prep (p. ej. “prepara 3 raciones de pollo el lunes”) asociadas a la lista de compra, para mejorar la organización semanal.
- Como **dietista**, quiero calcular automáticamente el coste estimado semanal y comparar con el presupuesto del cliente, para ajustar el plan si excede el límite.
- Como **dietista**, quiero etiquetar ingredientes como prioritarios o opcionales en la lista, para que el cliente priorice compras si el presupuesto es limitado.
- Como **dietista**, quiero sincronizar la lista de compra con servicios de delivery o supermercados, para que el cliente pueda encargar los alimentos desde la plataforma.

## Colaboración y feedback
- Como **dietista**, quiero dejar comentarios o menciones para otros profesionales (entrenadores, médicos), para coordinar ajustes interdisciplinares.
- Como **dietista**, quiero ver el feedback del cliente (saciedad, gusto, digestión) y responder directamente desde el editor, para cerrar el ciclo de comunicación.
- Como **dietista**, quiero generar reportes semanales o mensuales con evolución de métricas y hábitos, para compartir con el cliente o el equipo.
- Como **dietista**, quiero gestionar versiones del plan y recuperar versiones anteriores, para comparar cambios y revertir si algo no funciona.
- Como **dietista**, quiero ofrecer encuestas rápidas al cliente (p. ej. satisfacción semanal, facilidad de preparación), para recoger insights cualitativos que mejoren el plan.
- Como **dietista**, quiero asignar permisos específicos a colaboradores (solo lectura, sugerencias, edición completa), para controlar quién puede modificar la dieta.
- Como **dietista**, quiero ver un historial cronológico de comentarios y decisiones asociadas a cada bloque, para entender el contexto de cambios pasados.

## Personalización y accesibilidad
- Como **dietista**, quiero configurar temas de color y tamaño de fuente, para trabajar cómodamente durante largos periodos.
- Como **dietista**, quiero atajos de teclado para cambiar de día, duplicar bloques o abrir el panel IA, para ganar velocidad.
- Como **dietista**, quiero que el editor sea responsive y funcione en tablets, para revisar o ajustar dietas sobre la marcha.
- Como **dietista**, quiero recibir entrenamiento contextual (tooltips, vídeos cortos) sobre nuevas funciones, para aprender sin salir del editor.
- Como **dietista**, quiero activar modo contraste alto y soporte para lectores de pantalla, para garantizar la accesibilidad del editor.
- Como **dietista**, quiero personalizar la densidad del layout (compacto, estándar, amplio), para elegir cuánto contenido ver a la vez.
- Como **dietista**, quiero configurar notificaciones (email, push, in-app) para eventos clave (feedback recibido, IA detecta riesgo), para enterarme incluso si no estoy en el editor.

## Integraciones y datos externos
- Como **dietista**, quiero importar datos de apps de seguimiento (calorías consumidas, síntomas digestivos) para comparar plan vs. realidad.
- Como **dietista**, quiero vincular el editor con el calendario del cliente, para que reciba recordatorios de preparación o compra con antelación.
- Como **dietista**, quiero sincronizar el plan con wearables (pasos, gasto calórico estimado), para ajustar el aporte energético según actividad real.
- Como **dietista**, quiero integrar el editor con plataformas de recetas populares y blogs especializados, para enriquecer el catálogo con contenido actualizado.
- Como **dietista**, quiero exportar datos del plan (macro, coste, adherencia) hacia dashboards externos (Power BI, Looker), para realizar análisis avanzados.
- Como **dietista**, quiero recibir avisos cuando el cliente sincronice nuevos datos (peso, medidas, análisis clínicos) y linkearlos al plan, para ajustar la dieta en base a resultados objetivos.

Estas user stories cubren desde la captura de recursos y edición detallada hasta la automatización, colaboración y seguimiento, con el objetivo de que el editor de dieta sea un entorno completo, ágil y centrado en la experiencia tanto del profesional como del cliente.

