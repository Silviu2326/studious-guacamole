# Tareas & Alertas · User Stories

## Rol y entrada al módulo
- Como **manager**, quiero acceder a `Tareas & Alertas` desde la barra lateral y ver el número de pendientes en un badge, para priorizarlo cuando el volumen aumente.
- Como **manager**, quiero que al entrar al módulo el header me recuerde mi rol, sede y semana activa, para entender el contexto antes de actuar.
- Como **manager**, quiero que el módulo cargue vistas y filtros predefinidos según mi rol (entrenador vs. gimnasio vs. franquicia), para mostrarme solo la información relevante.

## Header y contexto
- Como **manager**, quiero ver en el encabezado un resumen de métricas clave (tareas nuevas hoy, alertas críticas, SLA medio), para medir la carga de trabajo actual.
- Como **manager**, quiero disponer de accesos rápidos en el header (crear tarea, lanzar plan de acción, exportar listado, abrir panel IA), para ejecutar acciones frecuentes sin navegar.
- Como **manager**, quiero activar un botón de “Modo foco” desde el header que oculte widgets secundarios, para centrarme cuando necesite resolver tareas urgentes.
- Como **manager**, quiero poder filtrar globalmente por sede, responsable o etiqueta desde el header, para que todas las secciones respeten ese contexto.

## Sistema de tabs
- Como **manager**, quiero alternar entre tabs (`Tareas`, `Alertas`, `Prioridades`, `Notificaciones`, `Historial`, `Configuración`) sin perder el filtro activo, para mantener continuidad.
- Como **manager**, quiero reordenar o esconder tabs según mis necesidades, para que el módulo se adapte a mi flujo de trabajo.
- Como **manager**, quiero que cada tab muestre un badge con el número de elementos críticos pendientes, para priorizar dónde entrar.
- Como **manager**, quiero ver tooltips en cada tab con descripción de su contenido, para formar a nuevos miembros del equipo fácilmente.

## Gestor de tareas (`TasksManager`)
- Como **manager**, quiero ver mis tareas en vistas múltiples (lista, kanban, calendario) y alternarlas sin perder posición, para gestionarlas como prefiera.
- Como **manager**, quiero crear tareas con campos avanzados (tipo, prioridad, vencimiento, cliente asociado, plan de acción, etiquetas IA), para tener contexto completo al asignarlas.
- Como **manager**, quiero asignar tareas a responsables individuales o equipos y enviarles notificaciones automáticas, para asegurar que se enteren.
- Como **manager**, quiero agrupar tareas por objetivo estratégico o plan de acción al que pertenecen, para ver cómo contribuyen a los OKRs.
- Como **manager**, quiero que la IA sugiera tareas basadas en alertas, métricas o hábitos del cliente (p. ej. “contactar a clientes sin check-in 7 días”), para anticiparme a problemas.
- Como **manager**, quiero convertir elementos de otras áreas (actividad, alertas, plan de acción IA) en tareas con un clic, para asegurar seguimiento sin duplicar pasos.
- Como **manager**, quiero que las tareas se sincronicen con campañas del ERP (marketing, onboarding, retención), para que cada equipo vea sus pendientes en su módulo.
- Como **manager**, quiero registrar subtareas, checklist y documentación adjunta, para que el responsable tenga todo lo necesario para ejecutar.
- Como **manager**, quiero cruzar cada tarea con indicadores del ERP (impacto en ingresos, clientes afectados, coste estimado) y visualizarlos en la tarjeta, para priorizar con datos.
- Como **manager**, quiero marcar tareas como automatizables y generar flujos de automatización (p. ej. crear tarea recurrente cuando haya alerta de aforo), para reducir trabajo manual.

## Alertas (`AlertsPanel`)
- Como **manager**, quiero ver las alertas clasificadas por severidad, área y origen (operaciones, finanzas, clientes), para priorizar la atención.
- Como **manager**, quiero activar filtros combinables (periodo, responsable, plan afectado, sede) y guardar vistas personalizadas, para regresar rápido al análisis que necesito.
- Como **manager**, quiero que cada alerta muestre el historial de acciones tomadas y el resultado, para entender la evolución sin salir del panel.
- Como **manager**, quiero aceptar, snoozear o escalar una alerta con un clic y que el sistema pregunte por el plan de acción asociado, para garantizar seguimiento.
- Como **manager**, quiero que las alertas se alimenten de diferentes módulos del ERP (resumen general, finanzas, check-ins, inventario) y lleguen etiquetadas con el origen, para contextualizar el problema.
- Como **manager**, quiero recibir alertas predictivas (IA) que estimen futuros riesgos (churn, morosidad, baja asistencia) y que incluyan recomendaciones, para actuar con proactividad.
- Como **manager**, quiero poder linkear una alerta al plan de acción inteligente; si el plan tiene tareas en curso relacionadas, deben aparecer como referencia, para evitar duplicidad.
- Como **manager**, quiero colaborar en una alerta (comentarios, menciones, adjuntar evidencias) y generar un log auditado, para mantener trazabilidad de decisiones.

## Prioridades (`PriorityQueue`)
- Como **manager**, quiero ver una cola de prioridades que combine tareas y alertas con un puntaje global (impacto, urgencia, esfuerzo), para actuar donde más valor aporta.
- Como **manager**, quiero ajustar manualmente el peso de criterios (impacto financiero, satisfacción del cliente, cumplimiento legal), para que la cola refleje mi estrategia.
- Como **manager**, quiero que la IA explique por qué priorizó cada ítem, para auditar y confiar en su recomendación.
- Como **manager**, quiero simular escenarios (¿qué pasa si resuelvo estas tres tareas hoy?) y ver el impacto en métricas clave, para decidir mejor qué atacar primero.
- Como **manager**, quiero congelar ítems en la prioridad (bloques críticos) para que no se reordenen cuando se recalcula la cola, para garantizar foco.
- Como **manager**, quiero que la cola muestre dependencias entre elementos (esta tarea depende de cerrar aquella alerta) y notifique si hay bloqueos, para evitar cuellos de botella.
- Como **manager**, quiero generar automáticamente planes de acción a partir de la cola priorizada (aplica un template IA, asigna responsables), para pasar de la priorización a la ejecución sin fricción.

## Centro de notificaciones (`NotificationCenter`)
- Como **manager**, quiero ver un timeline consolidado de notificaciones (tareas asignadas, alertas nuevas, planes actualizados, comentarios), para estar al día en un solo lugar.
- Como **manager**, quiero filtrar notificaciones por canal (email, in-app, móvil) y estado (leído, no leído, destacado), para gestionar mi bandeja eficientemente.
- Como **manager**, quiero responder comentarios o actualizar el estado de una tarea directamente desde la notificación, para ahorrar clics.
- Como **manager**, quiero configurar preferencias de notificación por rol, tipo de evento y horario, para evitar ruido fuera de horas críticas.
- Como **manager**, quiero recibir resúmenes automáticos diarios o semanales con highlights y planes de acción próximos, para mantenerme informado sin entrar al panel.
- Como **manager**, quiero conectar el centro de notificaciones con Slack/Teams y CRM, para recibir avisos donde ya trabajo con mi equipo.

## Historial (`TaskHistory`)
- Como **manager**, quiero consultar el historial completo de tareas y alertas resueltas con filtros avanzados, para analizar la evolución del trabajo.
- Como **manager**, quiero ver qué acciones del plan de acción se ejecutaron, quién las completó y con qué resultado, para medir efectividad.
- Como **manager**, quiero exportar el historial con métricas (tiempo de resolución, re-trabajos, impacto en KPIs) para reportar a dirección.
- Como **manager**, quiero identificar patrones (se repite una alerta concreta, tareas que siempre se retrasan) y que la IA proponga soluciones, para mejorar procesos.
- Como **manager**, quiero que el historial esté integrado con auditoría (quién cambió prioridades, quién cerró la alerta), para garantizar cumplimiento normativo.

## Configuración (`AlertRules` y ajustes)
- Como **manager**, quiero definir reglas avanzadas para generar alertas (condiciones AND/OR, integraciones externas, umbrales personalizados), para adaptar el sistema a la realidad del negocio.
- Como **manager**, quiero crear plantillas de tareas y planes de acción vinculados a cada tipo de alerta, para que al dispararse todo quede pre-cargado.
- Como **manager**, quiero configurar SLA y responsables automáticos según categoría, para que el sistema asigne tareas en cuanto llega una alerta.
- Como **manager**, quiero conectar fuentes externas (IoT, sistemas contables, apps de clientes) que alimenten las alertas, para centralizar la operación.
- Como **manager**, quiero simular una regla antes de activarla y ver qué alertas habría generado, para evitar ruido innecesario.
- Como **manager**, quiero programar recordatorios y tareas recurrentes dentro de la configuración (p. ej. checklists de mantenimiento), para que el sistema cree tareas automáticamente.

## Integración con Plan de Acción Inteligente
- Como **manager**, quiero abrir el plan de acción IA desde `Tareas & Alertas` y ver qué tareas y alertas están vinculadas a cada objetivo, para entender progreso global.
- Como **manager**, quiero que al generar un plan de acción se creen tareas y alertas correspondientes en el módulo, respetando prioridades y responsables, para garantizar ejecución coordinada.
- Como **manager**, quiero que el plan de acción se actualice automáticamente cuando una alerta crítica aparece, sugiriendo nuevas fases o ajustes, para mantenerlo vivo.
- Como **manager**, quiero que las tareas completadas alimenten los KPIs del plan y actualicen el status en `Resumen General`, para medir impacto real.
- Como **manager**, quiero comparar diferentes planes de acción y ver cuántas tareas/alertas generaron y su resolución, para elegir enfoques más efectivos en el futuro.
- Como **manager**, quiero que la IA recomiende acciones correctivas en el plan cuando detecte tareas estancadas o alertas sin atención, para evitar que el plan se quede en papel.
- Como **manager**, quiero que el plan IA soporte aprobaciones (revisión de director) antes de desplegar tareas masivas, para mantener control.

## Integración con la barra lateral / ERP completo
- Como **manager**, quiero ver badges de pendientes en la Sidebar (`Tareas & Alertas`, `Resumen General`, `Suite de Nutrición`, etc.), sincronizados, para saber desde cualquier módulo si hay urgencias.
- Como **manager**, quiero convertir una alerta en acción en otros módulos (p. ej. crear campaña en marketing, modificar plan de entreno) directamente desde el panel, para cerrar el ciclo sin salir del ERP.
- Como **manager**, quiero que al navegar a módulos relacionados (resumen general, finanzas, CRM) se mantenga el filtro de sede/plan de acción, para trabajar con coherencia.
- Como **manager**, quiero poder incrustar resúmenes de tareas o alertas en otras vistas (dashboard, suite de entreno) y que se actualicen en tiempo real, para tener visibilidad transversal.
- Como **manager**, quiero que los permisos y roles definidos en el ERP se reflejen en este módulo (quién puede ver alertas financieras, quién puede editar reglas), para mantener seguridad.
- Como **manager**, quiero acceder a logs e historial desde el menú de configuración del ERP, para auditar cambios en reglas o tareas a nivel global.

## Inteligencia y automatización
- Como **manager**, quiero que la IA sugiera tareas de mejora continua basadas en resultados (p. ej. “revisar experiencia de onboarding”) y las priorice en la cola, para evolucionar procesos.
- Como **manager**, quiero recibir recomendaciones de optimización (redistribuir carga del equipo, aplicar playbook de retención) cuando el sistema detecte picos de alertas, para actuar estratégicamente.
- Como **manager**, quiero que la IA destaque correlaciones (alertas de mantenimiento aumentan cuando baja limpieza) y proponga acciones a ambos equipos, para resolver causas raíz.
- Como **manager**, quiero que el sistema reconozca tareas duplicadas o redundantes y sugiera fusionarlas o automatizarlas, para reducir ruido.
- Como **manager**, quiero poder marcar acciones como automatizadas y que el ERP aprenda a ejecutar esas tareas sin intervención humana cuando se repitan las condiciones.

## Experiencia del usuario y accesibilidad
- Como **manager**, quiero modo oscuro, soporte a lectores de pantalla y control de densidad de información, para trabajar en jornadas largas sin fatiga.
- Como **manager**, quiero atajos de teclado para crear tareas, cambiar de tab, priorizar elementos, para operar más rápido.
- Como **manager**, quiero recibir notificaciones en móvil o wearable cuando se dispare una alerta crítica, para reaccionar incluso fuera de la oficina.
- Como **manager**, quiero contar con tutoriales interactivos y ejemplos de mejores prácticas dentro del módulo, para entrenar al equipo sin salir del ERP.

## Reporting y analítica
- Como **manager**, quiero generar reportes personalizados de productividad (tareas creadas vs. completadas, tiempo medio por categoría) y compartirlos en PDF o dashboard, para evaluar desempeño.
- Como **manager**, quiero ver el impacto económico de resolver o ignorar alertas (coste evitado, ingreso retenido), para argumentar decisiones.
- Como **manager**, quiero integrar métricas de tareas/alertas en el `Resumen General` y otros dashboards, para tener una visión consolidada del negocio.
- Como **manager**, quiero que el módulo ofrezca insights sobre carga del equipo (quién está al límite, quién tiene capacidad), para redistribuir responsabilidades.

Estas user stories buscan que el módulo `Tareas & Alertas` se convierta en el centro operativo del ERP, conectado con el plan de acción inteligente y con cada subsistema (finanzas, marketing, entreno, nutrición), asegurando que la estrategia se ejecute con precisión y que la organización mantenga control sobre tareas, alertas y prioridades en tiempo real.

