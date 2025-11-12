# Resumen General · User Stories

## Header y navegación principal
- Como **manager**, quiero ver en el encabezado el nombre del panel, mi rol y la fecha actual, para tener contexto inmediato antes de revisar los datos.
- Como **manager**, quiero un botón de actualización que indique la hora del último refresco y permita refresco manual o programado, para asegurarme de trabajar con la información más reciente.
- Como **manager**, quiero disponer de accesos rápidos configurables en la topbar (p. ej. crear tarea, exportar reporte, abrir chat del equipo), para saltar directamente a las acciones que más uso.
- Como **manager**, quiero que el encabezado muestre alertas críticas resaltadas (p. ej. caída de ingresos >10%, alertas de cumplimiento) con enlaces directos, para reaccionar sin buscar.
- Como **manager**, quiero cambiar fácilmente entre diferentes entornos/perfiles (entrenador, gimnasio, franquicia) desde el header, para gestionar múltiples unidades sin salir del panel.

## Métricas agregadas (DashboardOverview)
- Como **manager**, quiero visualizar métricas clave agrupadas por objetivo (crecimiento, retención, finanzas, satisfacción), para tener una lectura rápida del negocio.
- Como **manager**, quiero personalizar qué métricas aparecen y su orden, para centrarme en los indicadores que se alinean con mis OKRs actuales.
- Como **manager**, quiero que cada métrica muestre tendencia, meta y desviación, para detectar rápidamente si necesito intervenir.
- Como **manager**, quiero poder desglosar cada métrica (tooltip, modal) y ver el detalle (segmento, responsable, periodo), para entender la causa detrás del número.
- Como **manager**, quiero poder fijar métricas favoritas que permanezcan siempre visibles aun cuando cambie de pestaña, para no perder de vista los KPI críticos.
- Como **manager**, quiero comparar métricas actuales con periodos anteriores (semana, mes, año) y con benchmarks del sector, para contextualizar el desempeño.

## Acciones rápidas (QuickActions)
- Como **manager**, quiero ver accesos rápidos personalizados por rol (entrenador: crear sesión, gimnasio: lanzar promoción), para ejecutar las tareas más frecuentes en segundos.
- Como **manager**, quiero configurar mis propios accesos rápidos (enlace, icono, orden), para adaptar el panel a mi flujo de trabajo personal.
- Como **manager**, quiero que los accesos rápidos muestren estados (p. ej. tareas pendientes asociadas, caducidad), para priorizar qué acción tomar primero.
- Como **manager**, quiero que algunas acciones disparen playbooks predefinidos (p. ej. “Baja adherencia” → abrir plan de retención), para ejecutar procesos completos sin pensar en los pasos.
- Como **manager**, quiero ver sugerencias de acciones inteligentes basadas en datos recientes (IA detecta caída en sesiones → propone “Llamar a clientes inactivos”), para reaccionar de forma proactiva.

## Alertas y riesgos (AlertsPanel)
- Como **manager**, quiero recibir alertas clasificadas por severidad y categoría (finanzas, operaciones, clientes, cumplimiento), para priorizar la atención.
- Como **manager**, quiero filtrar las alertas por responsable o unidad de negocio, para asignar rápidamente a la persona adecuada.
- Como **manager**, quiero poder convertir una alerta en tarea o plan de acción con un clic, para asegurar seguimiento.
- Como **manager**, quiero registrar notas o comentarios en cada alerta y marcar estado (en revisión, resuelta), para mantener el historial colaborativo.
- Como **manager**, quiero que el panel muestre alertas predictivas (generadas por IA) antes de que ocurran los problemas (p. ej. riesgo de churn de un cliente VIP), para anticiparme.
- Como **manager**, quiero personalizar umbrales y reglas que disparan alertas, para alinearlos con nuestras políticas internas.

## Gestión de tareas (TasksWidget)
- Como **manager**, quiero ver en el widget las tareas pendientes clasificadas por prioridad, fecha y área, para organizar el trabajo del equipo.
- Como **manager**, quiero crear tareas directamente desde el widget asignando responsables, etiquetas y plazos, para mantener todo centralizado.
- Como **manager**, quiero sincronizar las tareas con mi gestor externo (Asana, Trello, Notion), para evitar duplicidad de esfuerzos.
- Como **manager**, quiero recibir recordatorios automáticos y resumen diario de tareas críticas, para no dejar pasar ningún compromiso.
- Como **manager**, quiero visualizar la carga de trabajo del equipo y redistribuir tareas desde el widget, para balancear recursos cuando alguien está saturado.
- Como **manager**, quiero que las tareas se puedan auto-generar a partir de ciertas condiciones (alerta crítica → crear seguimiento en 24h), para automatizar flujos repetitivos.

## Resumen financiero (FinancialSummary)
- Como **manager**, quiero visualizar ingresos, gastos, margen y flujo de caja en una vista compacta con tendencias, para tener claridad financiera inmediata.
- Como **manager**, quiero ver la contribución por línea de negocio (membresías, entrenamientos, retail) con gráficos comparativos, para identificar qué impulsa el resultado.
- Como **manager**, quiero simular escenarios (p. ej. bajar precios, abrir clases extra) y ver el impacto en el resumen financiero, para tomar decisiones informadas.
- Como **manager**, quiero recibir alertas de desviaciones presupuestarias y sugerencias de ajustes (IA), para mantener el control del plan financiero.
- Como **manager**, quiero exportar el resumen a Excel/PDF con filtros y notas, para compartir con dirección o auditoría.
- Como **manager**, quiero conectar el resumen con mi ERP/contabilidad para tener datos en tiempo real, evitando cargas manuales.

## Estado de clientes (ClientStatus)
- Como **manager**, quiero ver un panel de salud de clientes (activos, inactivos, en riesgo, nuevas altas) para monitorear la retención.
- Como **manager**, quiero segmentar clientes por programa, responsable, engagement o plan nutricional, para ofrecer respuestas personalizadas.
- Como **manager**, quiero recibir recomendaciones de acciones sobre clientes en riesgo (p. ej. “Ofrecer sesión gratuita”, “Enviar mensaje personalizado”), para recuperar adherencia.
- Como **manager**, quiero ver indicadores de satisfacción (NPS, feedback, encuestas) y evolución, para alinear las decisiones con la experiencia del cliente.
- Como **manager**, quiero activar campañas o listas de seguimiento desde el panel (p. ej. “Contactar clientes sin check-in 7 días”), para ejecutar acciones en masa.
- Como **manager**, quiero visualizar información contextual (último contacto, programa activo, notas del entrenador) antes de interactuar, para ofrecer un trato personalizado.

## Gráficos y analítica (MetricsChart & comparativas)
- Como **manager**, quiero visualizar gráficos comparativos interactivos (líneas, barras, heatmaps) que se adapten al rol, para analizar tendencias de sesiones, ocupación o ingresos.
- Como **manager**, quiero cambiar el periodo analizado (diario, semanal, mensual, YTD) y comparar contra objetivos u otro periodo, para evaluar progresión real.
- Como **manager**, quiero seleccionar subconjuntos de datos (por entrenador, por clase, por sede) y ver el gráfico filtrado, para profundizar en áreas clave.
- Como **manager**, quiero descargar los gráficos en imagen o CSV y compartirlos, para usarlos en reportes o presentaciones.
- Como **manager**, quiero que la IA destaque anomalías o cambios significativos directamente en el gráfico (p. ej. “+25% sesiones martes respecto a media”), para detectar insights sin análisis manual.

## Actividad reciente (RecentActivity)
- Como **manager**, quiero ver una línea de tiempo consolidada de eventos clave (pagos, nuevas altas, incidencias, sesiones completadas), para tener contexto del día a día.
- Como **manager**, quiero filtrar la actividad por tipo y relevancia, para enfocar la lectura en lo que me interesa.
- Como **manager**, quiero recibir notificaciones cuando ocurran eventos críticos (p. ej. cancelación VIP), para actuar inmediatamente.
- Como **manager**, quiero poder comentar o reaccionar en los eventos para coordinarme con el equipo, manteniendo la comunicación dentro del ERP.
- Como **manager**, quiero convertir un evento en tarea, alerta o plan de acción con un clic, para garantizar seguimiento.

## Personalización y experiencia de usuario
- Como **manager**, quiero adaptar el layout (densidad, tamaño de tarjetas, modo oscuro/alto contraste), para trabajar cómodamente sin fatiga visual.
- Como **manager**, quiero guardar vistas personalizadas (Dashboard de Finanzas, Dashboard Operativo) y alternar entre ellas, para enfocarme según el contexto.
- Como **manager**, quiero configurar un horario de envíos automáticos de reporte (diario, semanal) por email o Slack, para mantener informados a los stakeholders.
- Como **manager**, quiero recibir tutoriales contextuales y tooltips inteligentes, para aprender nuevas funciones sin salir del panel.
- Como **manager**, quiero usar atajos de teclado para navegar, refrescar datos o abrir widgets, para ganar velocidad.
- Como **manager**, quiero habilitar multilenguaje en el panel, para que equipos internacionales trabajen en su idioma preferido.

## Colaboración y control de acceso
- Como **manager**, quiero asignar roles y permisos diferenciados en el Dashboard (ver solo métricas, editar tareas, administrar finanzas), para proteger información sensible.
- Como **manager**, quiero ver qué usuario realizó cambios o resolvió alertas mediante un historial auditado, para mantener trazabilidad.
- Como **manager**, quiero mencionar a compañeros en alertas, tareas o actividades, para coordinar acciones sin salir del ERP.
- Como **manager**, quiero integrar el panel con canales de comunicación internos (Slack, Teams) para enviar resúmenes o alertas directas.
- Como **manager**, quiero que los permisos se sincronicen con el directorio corporativo (SSO, LDAP), para administrar accesos de forma centralizada.

## Integraciones y datos externos
- Como **manager**, quiero conectar el Resumen General con nuestros sistemas de facturación, CRM y control de acceso, para consolidar todo en un solo lugar.
- Como **manager**, quiero importar datos externos (planillas Excel, CSV) y que el panel los valide antes de integrarlos, para evitar errores.
- Como **manager**, quiero exponer APIs o webhooks que permitan enviar datos a herramientas externas (BI corporativo), para construir reportes avanzados.
- Como **manager**, quiero ver indicadores externos relevantes (clima, festivos locales, tendencias del sector) superpuestos a mis métricas, para anticipar fluctuaciones.
- Como **manager**, quiero que el Dashboard detecte automáticamente nuevas integraciones disponibles y me guíe en su configuración, para ampliar capacidades sin soporte técnico.

## Plan de acción inteligente (IA) – Sección dedicada
- Como **manager**, quiero completar un formulario guiado donde indique mis objetivos estratégicos (p. ej. aumentar ingresos, reducir churn, mejorar satisfacción), para que el sistema entienda mis prioridades.
- Como **manager**, quiero especificar en el formulario recursos disponibles, limitaciones (presupuesto, equipos, tiempo) y horizontes temporales, para que el plan de acción sea realista.
- Como **manager**, quiero que la IA proponga un plan de acción estructurado (fases, tareas, responsables sugeridos, KPIs) tras enviar el formulario, para empezar a ejecutar de inmediato.
- Como **manager**, quiero que el plan se sincronice con los módulos del ERP (tareas, finanzas, clientes) y asigne automáticamente las acciones a los responsables, para evitar trabajo manual.
- Como **manager**, quiero poder editar el plan sugerido (aceptar, modificar, descartar acciones) y que la IA aprenda de mis decisiones, para afinar recomendaciones futuras.
- Como **manager**, quiero recibir recordatorios y seguimiento automático del plan (progreso, próximos hitos, riesgos detectados), para asegurar la ejecución.
- Como **manager**, quiero generar planes alternativos (p. ej. “Plan agresivo”, “Plan conservador”) para comparar enfoques antes de decidir.
- Como **manager**, quiero exportar el plan de acción en formatos compartibles (PDF, presentación), para comunicarlo al equipo directivo.
- Como **manager**, quiero volver a completar el formulario cuando cambien mis objetivos y mantener un historial de planes anteriores, para evaluar impacto y aprendizajes.
- Como **manager**, quiero que el formulario incluya preguntas dinámicas basadas en mis respuestas previas, para profundizar solo en áreas relevantes y ahorrar tiempo.
- Como **manager**, quiero adjuntar documentos de soporte (presupuestos, análisis internos) al generar el plan, para que la IA incorpore todo el contexto disponible.
- Como **manager**, quiero que el plan proponga hitos medibles con fechas estimadas y alertas automáticas si se retrasan, para mantener la ejecución bajo control.
- Como **manager**, quiero visualizar el plan en múltiples formatos (tabla, timeline, kanban) según la fase del proyecto, para facilitar el seguimiento con distintos equipos.
- Como **manager**, quiero solicitar simulaciones de impacto (p. ej. si se logra el plan, cómo variarán ingresos, churn, satisfacción), para priorizar iniciativas con mayor ROI.
- Como **manager**, quiero que la IA sugiera recursos complementarios (formación, plantillas, playbooks) asociados a cada fase del plan, para acelerar su implementación.
- Como **manager**, quiero habilitar notificaciones multicanal (email, Slack, app móvil) para hitos críticos del plan, para asegurar que todos los involucrados estén alineados.
- Como **manager**, quiero que el plan contemple dependencias entre acciones y ajuste automáticamente fechas si una fase se retrasa, para mantener un cronograma realista.
- Como **manager**, quiero invitar a colaboradores externos o consultores a revisar y comentar el plan dentro del ERP, para consolidar feedback en un solo lugar.
- Como **manager**, quiero que el sistema genere resúmenes periódicos del progreso del plan (texto + métricas clave) listas para compartir con dirección o inversores, para ahorrar tiempo en reporting.

## Inteligencia y recomendaciones generales
- Como **manager**, quiero que el panel me muestre insights de IA sobre correlaciones relevantes (p. ej. “Clientes que asisten a 3 clases/semana tienen 20% menos churn”), para descubrir oportunidades de negocio.
- Como **manager**, quiero recibir recomendaciones de optimización (p. ej. “Aumenta clases de fuerza los martes”) cuando los datos indiquen demanda no cubierta.
- Como **manager**, quiero que la IA identifique posibles anomalías de datos (valores atípicos) y me sugiera verificarlas, para mantener la integridad del dashboard.
- Como **manager**, quiero que la IA priorice qué revisar cada mañana según impacto y urgencia, para empezar el día enfocado en lo importante.
- Como **manager**, quiero que el panel resuma automáticamente la semana/mes con un reporte narrativo (texto + visualizaciones) que pueda compartir con stakeholders.

Estas user stories buscan que el módulo de Resumen General sea el centro neurálgico del ERP: consolidando información crítica, integrando automatizaciones inteligentes y facilitando la ejecución de planes estratégicos impulsados por IA.

