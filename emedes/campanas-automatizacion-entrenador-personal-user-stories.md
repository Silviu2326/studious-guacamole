## US-CA-001: Ver métricas relevantes de comunicación con clientes
**Como** Entrenador personal  
**Quiero** ver métricas como mensajes enviados, tasa de respuesta de clientes, recordatorios automáticos activos y clientes con comunicación pendiente  
**Para** entender cómo está funcionando mi comunicación con los clientes y qué necesito mejorar  
**Descripción**: Reemplazar métricas genéricas de marketing (campañas activas, ingresos atribuidos) por métricas específicas de comunicación entre entrenador y clientes que muestren el estado real de la interacción.  
**Feature**: `src/features/CampanasAutomatizacion`

---

## US-CA-002: Crear y gestionar recordatorios automáticos de sesiones
**Como** Entrenador personal  
**Quiero** configurar recordatorios automáticos que se envíen por WhatsApp o SMS antes de cada sesión (24h, 2h antes)  
**Para** reducir las ausencias y asegurarme de que los clientes lleguen puntuales sin tener que recordarles manualmente  
**Descripción**: Sistema para crear plantillas de recordatorios de sesiones que se envíen automáticamente según el calendario de reservas, con personalización por cliente y posibilidad de activar/desactivar por cliente.  
**Feature**: `src/features/CampanasAutomatizacion`

---

## US-CA-003: Configurar secuencias de bienvenida para nuevos clientes
**Como** Entrenador personal  
**Quiero** crear una secuencia automática de mensajes de bienvenida que se active cuando un lead se convierte en cliente  
**Para** dar una excelente primera impresión y proporcionar información importante sin tener que escribir los mismos mensajes repetidamente  
**Descripción**: Sistema de secuencias de bienvenida con múltiples mensajes programados (día 1: bienvenida, día 2: qué esperar, día 3: preparación primera sesión) que se envíen automáticamente por email o WhatsApp.  
**Feature**: `src/features/CampanasAutomatizacion`

---

## US-CA-004: Automatizar seguimiento después de sesiones perdidas
**Como** Entrenador personal  
**Quiero** que se envíe automáticamente un mensaje de seguimiento cuando un cliente falta a una sesión sin avisar  
**Para** mostrar que me importa su progreso y recuperar la sesión sin tener que contactar manualmente a cada uno  
**Descripción**: Automatización que detecte ausencias no justificadas y envíe mensajes personalizados preguntando si todo está bien y ofreciendo reagendar, con diferentes tonos según la frecuencia de ausencias.  
**Feature**: `src/features/CampanasAutomatizacion`

---

## US-CA-005: Gestionar plantillas de mensajes rápidos para situaciones comunes
**Como** Entrenador personal  
**Quiero** tener plantillas predefinidas para situaciones como "confirmar sesión", "recordar pago pendiente", "felicitar por progreso" o "sugerir ajuste de plan"  
**Para** ahorrar tiempo escribiendo mensajes similares y mantener consistencia en la comunicación  
**Descripción**: Biblioteca de plantillas de mensajes personalizables con variables (nombre cliente, fecha sesión, etc.) que pueda usar desde cualquier conversación o enviar en masa a grupos de clientes.  
**Feature**: `src/features/CampanasAutomatizacion`

---

## US-CA-006: Programar mensajes de seguimiento de progreso periódicos
**Como** Entrenador personal  
**Quiero** programar mensajes automáticos que se envíen cada 2 semanas o 1 mes preguntando por el progreso y cómo se sienten los clientes  
**Para** mantener el engagement y detectar problemas antes de que se conviertan en abandono  
**Descripción**: Sistema de mensajes programados que se envíen automáticamente según la frecuencia configurada, con opción de personalizar el contenido y ajustar la frecuencia por cliente o grupo de clientes.  
**Feature**: `src/features/CampanasAutomatizacion`

---

## US-CA-007: Crear secuencias de re-enganche para clientes inactivos
**Como** Entrenador personal  
**Quiero** configurar una secuencia automática que se active cuando un cliente no viene a sesiones durante X días  
**Para** recuperar clientes que están perdiendo el hábito antes de que abandonen completamente  
**Descripción**: Automatización que detecte inactividad (sin sesiones en X días) y envíe una secuencia progresiva de mensajes motivacionales, ofertas especiales o invitaciones a retomar, con posibilidad de pausar si el cliente responde.  
**Feature**: `src/features/CampanasAutomatizacion`

---

## US-CA-008: Enviar mensajes automáticos de cumpleaños y aniversarios
**Como** Entrenador personal  
**Quiero** que se envíen automáticamente mensajes de felicitación en cumpleaños y aniversarios de inicio de entrenamiento  
**Para** fortalecer la relación personal con los clientes y hacerlos sentir valorados  
**Descripción**: Sistema que detecte fechas importantes de cada cliente y envíe mensajes personalizados automáticamente, con posibilidad de incluir ofertas especiales o recordatorios de sesiones.  
**Feature**: `src/features/CampanasAutomatizacion`

---

## US-CA-009: Configurar recordatorios de pago automáticos
**Como** Entrenador personal  
**Quiero** que se envíen recordatorios automáticos cuando un pago está próximo a vencer o vencido  
**Para** reducir la morosidad sin tener que estar pendiente manualmente de cada cliente  
**Descripción**: Automatización que detecte pagos pendientes o próximos a vencer y envíe recordatorios amables por WhatsApp o email, con diferentes mensajes según los días de retraso.  
**Feature**: `src/features/CampanasAutomatizacion`

---

## US-CA-010: Ver historial y estadísticas de mensajes enviados
**Como** Entrenador personal  
**Quiero** ver un resumen de todos los mensajes automáticos enviados, tasas de apertura, respuestas y efectividad  
**Para** entender qué mensajes funcionan mejor y optimizar mi comunicación  
**Descripción**: Dashboard que muestre estadísticas de mensajes automáticos: cuántos se enviaron, cuántos se abrieron, cuántos generaron respuesta, y comparativa entre diferentes tipos de mensajes.  
**Feature**: `src/features/CampanasAutomatizacion`

---

## US-CA-011: Segmentar clientes para enviar mensajes personalizados
**Como** Entrenador personal  
**Quiero** poder agrupar clientes por criterios (nuevos, veteranos, inactivos, próximos a vencer plan) y enviarles mensajes específicos  
**Para** personalizar la comunicación según el estado y necesidades de cada grupo sin enviar mensajes genéricos a todos  
**Descripción**: Sistema de segmentación que permita crear grupos de clientes según criterios (días desde última sesión, tipo de plan, adherencia, etc.) y enviar mensajes masivos personalizados a cada segmento.  
**Feature**: `src/features/CampanasAutomatizacion`

---

## US-CA-012: Programar newsletters o boletines informativos para clientes
**Como** Entrenador personal  
**Quiero** crear y programar envío de newsletters con consejos, novedades, retos o contenido educativo  
**Para** mantener a los clientes informados y comprometidos sin tener que contactarlos individualmente  
**Descripción**: Editor de newsletters con plantillas, posibilidad de programar envío recurrente (semanal, quincenal, mensual) y tracking de aperturas y clics para medir engagement.  
**Feature**: `src/features/CampanasAutomatizacion`

---

## US-CA-013: Configurar respuestas automáticas fuera de horario
**Como** Entrenador personal  
**Quiero** configurar mensajes automáticos que se envíen cuando recibo mensajes fuera de mi horario de atención  
**Para** informar a los clientes cuándo responderé y gestionar expectativas sin tener que estar disponible 24/7  
**Descripción**: Sistema de respuestas automáticas que detecte mensajes entrantes fuera del horario configurado y envíe una respuesta automática informando el horario de atención y tiempo estimado de respuesta.  
**Feature**: `src/features/CampanasAutomatizacion`

---

## US-CA-014: Crear campañas de promoción o ofertas especiales
**Como** Entrenador personal  
**Quiero** crear y enviar campañas promocionales como "Descuento en bonos", "Promoción de verano" o "Invitación a clase grupal"  
**Para** aumentar ventas y engagement sin tener que contactar a cada cliente manualmente  
**Descripción**: Sistema para crear campañas promocionales con mensajes personalizados, seleccionar destinatarios (todos, segmentos específicos, clientes inactivos), programar envío y medir resultados.  
**Feature**: `src/features/CampanasAutomatizacion`

---

## US-CA-015: Integrar automatizaciones con el sistema de reservas
**Como** Entrenador personal  
**Quiero** que los recordatorios y mensajes automáticos se activen según eventos del calendario de reservas (sesión creada, cancelada, completada)  
**Para** que la comunicación esté sincronizada automáticamente con las acciones de los clientes sin tener que configurarlo manualmente  
**Descripción**: Integración que conecte las automatizaciones con el sistema de reservas para que los mensajes se activen según cambios en el calendario (nueva sesión → recordatorio, cancelación → seguimiento, etc.).  
**Feature**: `src/features/CampanasAutomatizacion`

---

## US-CA-016: Ver y gestionar todas las automatizaciones activas desde un panel central
**Como** Entrenador personal  
**Quiero** ver en un solo lugar todas mis automatizaciones (recordatorios, secuencias, campañas) con su estado y poder activarlas o pausarlas fácilmente  
**Para** tener control total sobre mi comunicación automatizada sin tener que buscar en diferentes secciones  
**Descripción**: Panel centralizado que muestre todas las automatizaciones configuradas, su estado (activa, pausada, finalizada), próximos envíos programados y permita gestionarlas desde un único lugar.  
**Feature**: `src/features/CampanasAutomatizacion`

---

## US-CA-017: Recibir alertas cuando un cliente no responde a mensajes importantes
**Como** Entrenador personal  
**Quiero** poder recibir notificaciones cuando un cliente no responde a mensajes críticos como recordatorios de pago o seguimiento de ausencias  
**Para** poder contactarlo de forma más directa o personal antes de que la situación empeore  
**Descripción**: Sistema de alertas que detecte cuando mensajes importantes no han sido abiertos o respondidos después de X tiempo y notifique al entrenador para que tome acción manual.  
**Feature**: `src/features/CampanasAutomatizacion`

---

## US-CA-018: Personalizar horarios de envío según preferencias del cliente
**Como** Entrenador personal  
**Quiero** configurar horarios de envío preferidos por cliente (algunos prefieren mañana, otros tarde) para respetar sus hábitos  
**Para** aumentar las tasas de apertura y no molestar a los clientes con mensajes a horas inadecuadas  
**Descripción**: Sistema que permita configurar horarios de envío preferidos por cliente o grupo, y que los mensajes automáticos se programen dentro de esas ventanas de tiempo.  
**Feature**: `src/features/CampanasAutomatizacion`

---

## US-CA-019: Crear secuencias de onboarding para nuevos clientes con múltiples pasos
**Como** Entrenador personal  
**Quiero** configurar una secuencia completa de onboarding que incluya bienvenida, información sobre metodología, preparación primera sesión, y seguimiento post-sesión  
**Para** asegurar que los nuevos clientes tengan toda la información necesaria y se sientan bienvenidos desde el inicio  
**Descripción**: Constructor de secuencias de múltiples pasos con lógica condicional (si responde X, enviar Y), delays entre mensajes, y posibilidad de pausar si el cliente responde o toma acción.  
**Feature**: `src/features/CampanasAutomatizacion`

---

## US-CA-020: Exportar reportes de comunicación y automatizaciones
**Como** Entrenador personal  
**Quiero** poder exportar reportes con estadísticas de mensajes enviados, tasas de respuesta, efectividad de automatizaciones y costos  
**Para** analizar el ROI de mi tiempo invertido en comunicación y presentar resultados si es necesario  
**Descripción**: Funcionalidad de exportación de reportes en diferentes formatos (PDF, Excel) que incluya métricas de comunicación, comparativas de períodos, y análisis de efectividad de cada tipo de automatización.  
**Feature**: `src/features/CampanasAutomatizacion`

