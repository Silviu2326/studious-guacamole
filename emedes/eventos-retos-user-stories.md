
## 3. USER STORIES

### 📝 GESTIÓN DE EVENTOS

**US-ER-01**: Como Entrenador personal, Quiero crear eventos presenciales, retos y webinars virtuales desde una sola sección, Para organizar todas mis actividades grupales en un mismo lugar.
**Feature**: `src/features/eventos-retos`
**Descripción**: Formularios específicos por tipo de evento con campos relevantes. Validación de campos obligatorios. Vista previa antes de publicar. Guardar como borrador.

**US-ER-02**: Como Entrenador personal, Quiero duplicar un evento existente para crear uno nuevo similar, Para ahorrar tiempo al organizar eventos recurrentes como clases semanales o retos mensuales.
**Feature**: `src/features/eventos-retos`
**Descripción**: Botón "Duplicar" en cada evento. Copiar toda la información menos fecha y participantes. Permitir editar antes de guardar. Indicador de "evento duplicado de...".

**US-ER-03**: Como Entrenador personal, Quiero guardar plantillas de mis eventos frecuentes (ej: clase de spinning, reto mensual), Para crearlos más rápido sin escribir todo cada vez.
**Feature**: `src/features/eventos-retos`
**Descripción**: Botón "Guardar como plantilla" en eventos. Galería de plantillas personales. Crear evento desde plantilla. Editar/eliminar plantillas.

**US-ER-04**: Como Entrenador personal, Quiero establecer un precio o costo para cada evento, Para comunicar claramente la inversión necesaria y controlar los ingresos por evento.
**Feature**: `src/features/eventos-retos`
**Descripción**: Campo de precio opcional. Indicador de "evento gratuito" o precio visible. Total de ingresos proyectados en métricas. Diferentes precios por tipo de cliente.

**US-ER-05**: Como Entrenador personal, Quiero cambiar el estado de un evento fácilmente (programado, en curso, finalizado, cancelado), Para reflejar el estado real y mantener organizado mi calendario.
**Feature**: `src/features/eventos-retos`
**Descripción**: Selector rápido de estado desde tarjeta. Confirmación al cancelar. Opción de notificar cambio a participantes. Histórico de cambios de estado.

**US-ER-06**: Como Entrenador personal, Quiero ver destacados mis próximos eventos de los siguientes 7 días, Para saber rápidamente qué tengo por delante y prepararme.
**Feature**: `src/features/eventos-retos`
**Descripción**: Sección superior "Próximos eventos" con eventos de la semana. Countdown hasta el evento. Acceso rápido a lista de participantes. Vista compacta y clara.

---

### 👥 GESTIÓN DE PARTICIPANTES

**US-ER-07**: Como Entrenador personal, Quiero agregar participantes manualmente a un evento desde mi lista de clientes, Para inscribir a las personas que me confirman por WhatsApp o en persona.
**Feature**: `src/features/eventos-retos`
**Descripción**: Botón "Agregar participantes" en evento. Selector con lista de clientes activos. Búsqueda por nombre. Agregar múltiples a la vez. Confirmación visual.

**US-ER-08**: Como Entrenador personal, Quiero ver la lista completa de participantes inscritos en cada evento, Para saber quién viene y cuántos lugares quedan disponibles.
**Feature**: `src/features/eventos-retos`
**Descripción**: Sección "Participantes" en detalle del evento. Lista con foto y nombre. Indicador de confirmación. Contador visual X/Y participantes. Ordenar alfabéticamente.

**US-ER-09**: Como Entrenador personal, Quiero eliminar participantes de un evento si cancelan, Para mantener la lista actualizada y liberar espacios.
**Feature**: `src/features/eventos-retos`
**Descripción**: Botón eliminar en cada participante. Confirmación antes de eliminar. Opción de mover a lista de espera. Registro de cancelaciones.

**US-ER-10**: Como Entrenador personal, Quiero activar una lista de espera cuando el evento está lleno, Para no perder interesados y llenar lugares si alguien cancela.
**Feature**: `src/features/eventos-retos`
**Descripción**: Lista de espera automática al llegar a capacidad máxima. Notificación automática si se libera lugar. Mover manualmente de espera a confirmado. Contador de personas en espera.

**US-ER-11**: Como Entrenador personal, Quiero hacer check-in de asistencia el día del evento, Para registrar quién asistió realmente y tener estadísticas precisas.
**Feature**: `src/features/eventos-retos`
**Descripción**: Modo "Check-in" el día del evento. Lista de inscritos con checkbox. Agregar asistentes no inscritos. Vista simple para uso en celular. Guardar registro de asistencia.

**US-ER-12**: Como Entrenador personal, Quiero exportar la lista de participantes a Excel o PDF, Para enviarla a recepción, hacer diplomas o tener un respaldo.
**Feature**: `src/features/eventos-retos`
**Descripción**: Botón "Exportar participantes" con opciones Excel/PDF. Incluir: nombre, contacto, confirmación, asistencia. Formato listo para imprimir.

**US-ER-13**: Como Entrenador personal, Quiero ver el historial de eventos de cada cliente, Para saber qué tan activo es en actividades grupales y personalizar invitaciones.
**Feature**: `src/features/eventos-retos`
**Descripción**: Desde perfil de cliente, lista de eventos a los que asistió. Filtrar por tipo de evento. % de asistencia vs inscripciones. Eventos favoritos.

---

### 📢 COMUNICACIÓN Y NOTIFICACIONES

**US-ER-14**: Como Entrenador personal, Quiero compartir un link público del evento para que mis clientes se inscriban solos, Para no tener que agregar manualmente a cada uno.
**Feature**: `src/features/eventos-retos`
**Descripción**: Generar link único por evento. Página de inscripción con información del evento. Formulario simple (nombre, contacto). Límite de inscripciones automático. Desactivar inscripciones cuando está lleno.

**US-ER-15**: Como Entrenador personal, Quiero enviar invitaciones al evento a clientes específicos o grupos, Para comunicar de forma profesional y llenar el cupo.
**Feature**: `src/features/eventos-retos`
**Descripción**: Botón "Enviar invitaciones" con selector de destinatarios. Plantilla de invitación personalizable. Envío por email y/o WhatsApp. Ver quién abrió la invitación.

**US-ER-16**: Como Entrenador personal, Quiero que el sistema envíe recordatorios automáticos a los participantes 24 horas y 2 horas antes del evento, Para reducir inasistencias y que nadie olvide.
**Feature**: `src/features/eventos-retos`
**Descripción**: Configurar recordatorios automáticos al crear evento. Personalizar timing (1 día, 2 horas, custom). Plantilla de recordatorio. Log de recordatorios enviados.

**US-ER-17**: Como Entrenador personal, Quiero solicitar confirmación de asistencia a los inscritos, Para saber con anticipación quién vendrá realmente.
**Feature**: `src/features/eventos-retos`
**Descripción**: Botón "Solicitar confirmación" X días antes. Mensaje con opciones "Confirmo / No puedo". Actualizar estado del participante. Ver quién confirmó en tiempo real.

**US-ER-18**: Como Entrenador personal, Quiero enviar un mensaje grupal a todos los participantes del evento, Para comunicar cambios, instrucciones de último momento o motivar.
**Feature**: `src/features/eventos-retos`
**Descripción**: Botón "Enviar mensaje grupal". Plantillas predefinidas (cambio horario, cancelación, instrucciones). Envío masivo por WhatsApp o email. Historial de comunicaciones del evento.

**US-ER-19**: Como Entrenador personal, Quiero notificar automáticamente si cancelo o reprogramo un evento, Para avisar a todos los inscritos sin tener que hacerlo manualmente.
**Feature**: `src/features/eventos-retos`
**Descripción**: Al cambiar estado a "cancelado" o modificar fecha, prompt de notificación. Plantilla auto-generada con razón del cambio. Envío automático a todos los participantes. Confirmación de envío.

---

### 📊 SEGUIMIENTO Y ESTADÍSTICAS

**US-ER-20**: Como Entrenador personal, Quiero ver estadísticas de asistencia real vs inscritos en cada evento, Para entender si tengo problema de inasistencias y mejorar.
**Feature**: `src/features/eventos-retos`
**Descripción**: Métrica "X% de asistencia" por evento. Comparativa con eventos anteriores. Identificar patrones (día/hora con más inasistencias). Gráfico de tendencia.

**US-ER-21**: Como Entrenador personal, Quiero solicitar feedback y valoración después de cada evento, Para saber si gustó y qué puedo mejorar.
**Feature**: `src/features/eventos-retos`
**Descripción**: Envío automático de encuesta post-evento. 3-4 preguntas clave + valoración de estrellas. Ver resultados agregados. Comentarios destacados. Métrica de satisfacción.

**US-ER-22**: Como Entrenador personal, Quiero ver qué eventos han tenido más éxito (más participantes, mejor valoración), Para repetir lo que funciona y descartar lo que no.
**Feature**: `src/features/eventos-retos`
**Descripción**: Ranking de eventos por: participación, asistencia, valoración. Comparativa entre tipos de eventos. Mejores horarios/días. Insights y recomendaciones.

**US-ER-23**: Como Entrenador personal, Quiero hacer seguimiento del progreso de participantes en retos largos (30 días), Para motivar, reconocer logros y dar apoyo.
**Feature**: `src/features/eventos-retos`
**Descripción**: Para eventos tipo "reto", dashboard de progreso por participante. Métricas configurables (días completados, check-ins, objetivos). Ranking opcional. Envío de mensajes de motivación.

**US-ER-24**: Como Entrenador personal, Quiero ver mis métricas generales de eventos (cuántos hice, total participantes, promedio asistencia), Para evaluar si esta estrategia está funcionando.
**Feature**: `src/features/eventos-retos`
**Descripción**: Dashboard con KPIs principales. Tendencia mensual. Comparativa con periodo anterior. Tipo de evento más popular. Ingresos totales por eventos.

---

### 🔧 FUNCIONALIDADES COMPLEMENTARIAS

**US-ER-25**: Como Entrenador personal, Quiero sincronizar mis eventos con mi calendario personal (Google Calendar), Para tener todo en un solo lugar y evitar cruces de horario.
**Feature**: `src/features/eventos-retos`
**Descripción**: Conexión con Google Calendar API. Sincronización bidireccional. Crear evento en calendario automáticamente. Actualizar si hay cambios. Opción de desactivar sincronización.

**US-ER-26**: Como Entrenador personal, Quiero agregar un checklist de materiales y preparación para cada evento, Para no olvidar nada el día del evento.
**Feature**: `src/features/eventos-retos`
**Descripción**: Sección "Preparación" en evento. Lista de tareas/materiales. Checkbox para marcar completado. Recordatorio de preparación 1 día antes. Plantillas de checklists.

**US-ER-28**: Como Entrenador personal, Quiero ver un calendario mensual con todos mis eventos, Para tener una vista general y planificar mejor.
**Feature**: `src/features/eventos-retos`
**Descripción**: Vista de calendario mensual/semanal. Eventos marcados con color según tipo. Click en día para ver eventos. Drag & drop para mover fecha. Filtros por tipo.

**US-ER-29**: Como Entrenador personal, Quiero ocultar o archivar eventos finalizados antiguos, Para mantener la lista limpia y enfocarme en lo actual.
**Feature**: `src/features/eventos-retos`
**Descripción**: Auto-archivar eventos finalizados después de 60 días. Opción de archivar manualmente. Ver archivo cuando necesite. Buscar en archivo. Estadísticas incluyen archivados.

**US-ER-30**: Como Entrenador personal, Quiero que eventos presenciales se vinculen con mis ubicaciones/salas, Para gestionar mejor el uso de espacio.
**Feature**: `src/features/eventos-retos`
**Descripción**: Selector de ubicación desde lista predefinida. Alerta de conflicto de horario en misma sala. Capacidad máxima según sala. Gestión de ubicaciones frecuentes.

-