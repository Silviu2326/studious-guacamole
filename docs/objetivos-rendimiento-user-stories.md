# Objetivos y Rendimiento · User Stories

## Header y contexto inicial
- Como **manager**, quiero que el header me muestre mi rol, sede y periodo activo (semana, mes, trimestre), para saber en qué contexto estoy evaluando los objetivos.
- Como **manager**, quiero ver un resumen rápido (objetivos cumplidos, desviaciones críticas, progreso global) en el encabezado, para detectar de inmediato si estamos on-track.
- Como **manager**, quiero acceder desde el header a accesos rápidos (crear objetivo, generar plan de acción IA, exportar reporte, actualizar datos), para actuar al instante sin navegar.
- Como **manager**, quiero activar desde el header filtros globales (sede, equipo, línea de negocio) que persistan en todas las tabs, para analizar indicadores con el mismo criterio.
- Como **manager**, quiero que el header integre alertas críticas relacionadas a objetivos (p. ej. “Retención < 80%”), y permita saltar directamente a gestionarlas, para intervenir rápido.

## Sistema de tabs y navegación
- Como **manager**, quiero alternar entre tabs (`Dashboard`, `Objetivos`, `Métricas`, `Seguimiento`, `Reportes`, `Alertas`, `Comparación`, `KPIs`) sin perder filtros ni periodos seleccionados, para mantener continuidad.
- Como **manager**, quiero reordenar tabs y ocultar las que no uso, para personalizar el módulo a mis prioridades.
- Como **manager**, quiero que cada tab muestre un badge con indicador de progreso (p. ej. % objetivos cumplidos en `Seguimiento`), para comprender el estado antes de entrar.
- Como **manager**, quiero que al cambiar de tab la navegación anote la ruta en el historial, para poder volver rápido a vistas frecuentes.
- Como **manager**, quiero que cada tab disponga de tooltips explicativos y vídeos cortos, para capacitar a nuevos usuarios en el uso del módulo.

## Dashboard general (`PerformanceDashboard`)
- Como **manager**, quiero ver indicadores clave (ingresos, retención, NPS, adherencia, ocupación) resumidos en tarjetas con tendencias, metas y variaciones, para tener una visión panorámica.
- Como **manager**, quiero poder configurar qué KPIs aparecen y en qué orden, para alinear el panel con mis OKRs del trimestre.
- Como **manager**, quiero comparar los datos actuales con periodos anteriores y con objetivos automáticos sugeridos por IA, para evaluar progreso y contexto.
- Como **manager**, quiero que el dashboard muestre insights destacados (p. ej. “Las sesiones martes contribuyen al 40% del objetivo semanal”) con explicaciones de IA, para identificar oportunidades.
- Como **manager**, quiero sincronizar widgets del dashboard con otras áreas del ERP (finanzas, adherencia, campañas) para mantener datos en tiempo real.

## Gestión de objetivos (`ObjectivesManager`)
- Como **manager**, quiero crear objetivos SMART con campos avanzados (período, responsable, métricas asociadas, peso relativo, plan de acción sugerido), para garantizar claridad y medición.
- Como **manager**, quiero definir diferentes tipos de objetivos (cuantitativos, cualitativos, OKRs, objetivos de proyecto) y agruparlos por horizontes (trimestral, mensual), para ajustarme a mi metodología.
- Como **manager**, quiero asignar objetivos a individuos, equipos o unidades de negocio, con permisos específicos (quién puede ver, editar, aprobar), para proteger información sensible.
- Como **manager**, quiero vincular cada objetivo con KPIs del `KPIConfigurator`, tareas del módulo `Tareas & Alertas` y planes de acción, para asegurar que la ejecución esté alineada.
- Como **manager**, quiero clonar objetivos existentes y generar versiones adaptadas (p. ej. “Plan A vs Plan B”), para comparar enfoques y elegir el mejor.
- Como **manager**, quiero fijar umbrales de color (verde/amarillo/rojo) y alertas automáticas cuando un objetivo se desvía, para intervenir antes de que fracase.
- Como **manager**, quiero que la IA proponga objetivos sugeridos en base a datos históricos y benchmarks del sector, para inspirar nuevos desafíos.

## Métricas y analítica (`MetricsChart`)
- Como **manager**, quiero disponer de gráficos interactivos que permitan visualizar métricas a lo largo del tiempo, con filtros por segmento, responsable y origen, para analizar tendencias.
- Como **manager**, quiero comparar múltiples KPIs en la misma gráfica, para detectar correlaciones (ej. “cuando sube la adherencia, baja la morosidad”).
- Como **manager**, quiero activar highlight automáticos de IA que destaquen anomalías o cambios importantes en las métricas, para enfocar mi atención.
- Como **manager**, quiero exportar los datos y gráficos en distintos formatos (CSV, imagen, embed) para compartir en reportes o presentaciones.
- Como **manager**, quiero integrar fuentes externas (CRM, wearables, campañas) y que se reflejen en los gráficos con etiquetas, para contextualizar variaciones.
- Como **manager**, quiero guardar vistas personalizadas de métricas para consultarlas después o compartir con stakeholders.

## Seguimiento (`GoalTracker`)
- Como **manager**, quiero ver el listado de objetivos activos con barras de progreso, responsables visibles y estado actual (on track, at risk, off track), para priorizar intervenciones.
- Como **manager**, quiero registrar actualizaciones de progreso (check-ins), añadir notas, evidencias y comentarios, para mantener trazabilidad de avances.
- Como **manager**, quiero asignar tareas o ajustes directamente desde cada objetivo cuando detecto bloqueos, para pasar de la observación a la acción sin fricción.
- Como **manager**, quiero visualizar dependencias entre objetivos (ej. objetivos secundarios que alimentan uno principal) y ver cómo el progreso de uno impacta al otro.
- Como **manager**, quiero configurar recordatorios automáticos para actualizar objetivos según la cadencia definida (semanal, quincenal), para mantener el seguimiento al día.
- Como **manager**, quiero que la IA sugiera micro-acciones o ajustes de plan cuando un objetivo está en riesgo, para reencarrilarlo rápidamente.
- Como **manager**, quiero mapear objetivos a los planes de acción generados automáticamente, para ver qué tareas están contribuyendo a cada meta.

## Reportes (`ReportsGenerator`)
- Como **manager**, quiero generar reportes personalizados (PDF, presentación) con métricas, gráficos y comentarios sobre objetivos, para informar a dirección o inversores.
- Como **manager**, quiero programar envíos automáticos de reportes (semanales, mensuales) con resúmenes narrativos generados por IA, para ahorrar tiempo.
- Como **manager**, quiero incluir comparativas entre objetivos vs. targets, lista de riesgos detectados y acciones propuestas, para dar una visión clara del estado del negocio.
- Como **manager**, quiero permitir que otros miembros (con permiso) personalicen sus propios reportes basados en plantillas comunes, para empoderar a los responsables.
- Como **manager**, quiero exportar data en bruto con etiquetas de objetivo, equipo, responsable, para análisis más detallados en herramientas externas.

## Alertas (`AlertsManager`)
- Como **manager**, quiero recibir alertas cuando un objetivo se desvía más allá de un umbral, cuando un KPI crítico cae o cuando no se actualiza un objetivo, para reaccionar a tiempo.
- Como **manager**, quiero que las alertas se clasifiquen por prioridad y sugieran planes de mitigación (IA) asociados a las causas detectadas.
- Como **manager**, quiero convertir una alerta en un ajuste de objetivo, tarea o plan de acción, para asegurar respuesta inmediata.
- Como **manager**, quiero ver el historial de alertas por objetivo y su resultado, para entender qué funcionó y qué no en mitigaciones anteriores.
- Como **manager**, quiero personalizar reglas de alerta (condiciones múltiples, periodos, responsables) y probarlas antes de activarlas, para evitar ruido.

## Comparación (`ComparisonTool`)
- Como **manager**, quiero comparar rendimientos entre periodos (mes vs mes, trimestre vs trimestre) y entre unidades (equipo A vs B, sede 1 vs 2), para detectar oportunidades.
- Como **manager**, quiero ver comparativas en formato tabla, gráfico y heatmap, para captar rápidamente patrones.
- Como **manager**, quiero que la IA me indique diferencias significativas y posibles causas, para evitar interpretaciones erróneas.
- Como **manager**, quiero simular escenarios hipotéticos (¿qué pasa si aumento objetivo de ventas 10%?) y ver el impacto proyectado, para planificar con datos.
- Como **manager**, quiero exportar las comparativas o integrarlas en dashboards ejecutivos, para compartir con stakeholders.

## Configuración de KPIs (`KPIConfigurator`)
- Como **manager**, quiero definir KPIs personalizados con fórmulas, fuentes de datos, umbrales y responsables, para que el sistema calcule automáticamente los indicadores relevantes.
- Como **manager**, quiero organizar KPIs en familias o marcos (finanzas, operaciones, satisfacción, salud), para mantener orden y claridad.
- Como **manager**, quiero mapear cada KPI a objetivos concretos y ver qué indicadores sustentan cada meta, para asegurar alineación.
- Como **manager**, quiero versionar definiciones de KPIs y mantener un historial de cambios, para auditar su evolución.
- Como **manager**, quiero importar KPIs desde hojas de cálculo o conectores externos y validarlos antes de integrarlos, para garantizar consistencia.

## Integración con Plan de Acción e IA
- Como **manager**, quiero generar un plan de acción inteligente desde la vista de objetivos en base a metas seleccionadas, para que el sistema proponga pasos (tareas, responsables, fechas) alineados con el ERP.
- Como **manager**, quiero que al modificar objetivos el plan de acción IA actualice tareas y prioridades en `Tareas & Alertas`, para mantener coherencia operativa.
- Como **manager**, quiero analizar el impacto previsto de un plan de acción en los objetivos (simulación IA) antes de aprobarlo, para tomar decisiones informadas.
- Como **manager**, quiero que la IA aprenda de planes anteriores (éxitos y fallos) y sugiera ajustes a los nuevos objetivos, para mejorar iterativamente nuestra estrategia.
- Como **manager**, quiero recibir resúmenes inteligentes (narrativa + métricas + alertas) sobre el avance de objetivos y planes, para compartir con stakeholders sin esfuerzo.

## Integración con el ERP y Sidebar
- Como **manager**, quiero ver el estado de mis objetivos en la Sidebar con indicadores (on track, riesgo), para ser consciente del progreso desde cualquier módulo.
- Como **manager**, quiero que al navegar desde objetivos a otros módulos (finanzas, marketing, suite de entreno) se mantengan filtros de sede y periodo, para trabajar en coherencia.
- Como **manager**, quiero que los objetivos se alimenten automáticamente de datos en otras áreas (ventas, adherencia, nutrición), para evitar carga manual.
- Como **manager**, quiero incrustar widgets de objetivos en `Resumen General`, `Tareas & Alertas` y `Plan de Acción`, para tener visibilidad transversal.
- Como **manager**, quiero gestionar permisos desde el panel de configuración global del ERP, para controlar quién puede ver o editar objetivos y KPIs.

## Colaboración y feedback
- Como **manager**, quiero comentar y mencionar a miembros del equipo en cada objetivo o KPI, para coordinar acciones sin salir del módulo.
- Como **manager**, quiero adjuntar documentación (presentaciones, briefs) a los objetivos, para que los responsables tengan la información contextual.
- Como **manager**, quiero que se registre un historial auditado de cambios en objetivos, KPIs y planes, para cumplir requisitos de gobernanza.
- Como **manager**, quiero solicitar aprobaciones (workflow) cuando un objetivo es crítico o requiere cambios significativos, para tener control ejecutivo.

## Experiencia de usuario y accesibilidad
- Como **manager**, quiero modo oscuro, control de densidad y soporte para lectores de pantalla, para trabajar cómodamente.
- Como **manager**, quiero recibir notificaciones en móvil o correo cuando se haya logrado un objetivo relevante o cuando haya desviaciones críticas, para mantenerme informado.
- Como **manager**, quiero atajos de teclado para navegar, crear objetivos, alternar vistas, para ganar velocidad.
- Como **manager**, quiero recibir formación in-app (tutoriales, casos de uso) y acceso a librerías de objetivos predefinidos, para inspirarme y aprender mejores prácticas.

## Reporting avanzado y analítica
- Como **manager**, quiero consolidar métricas de objetivos en dashboards globales del ERP (Finanzas, Marketing, Operaciones), para ofrecer reportes 360º.
- Como **manager**, quiero ver el impacto económico y operativo de cada objetivo (ingreso incremental, clientes retenidos), para justificar inversiones.
- Como **manager**, quiero identificar patrones de éxito (objetivos alcanzados en menos tiempo, planes más efectivos) y que la IA recomiende replicarlos.
- Como **manager**, quiero detectar objetivos obsoletos o con baja contribución al negocio y archivarlos, para mantener foco en lo que importa.

Estas user stories pretenden transformar la página de `Objetivos y Rendimiento` en el núcleo estratégico del ERP, conectando metas, métricas, planes de acción y ejecución diaria para que equipo ejecutivo y operativo trabajen coordinados, con datos confiables y automatizaciones que aceleran la toma de decisiones.

