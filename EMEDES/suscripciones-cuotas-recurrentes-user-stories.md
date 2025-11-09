# User Stories - Suscripciones & Cuotas Recurrentes (Entrenador Personal)

## US-SUB-001: Pausar suscripción de cliente
**Como** Entrenador Personal  
**Quiero** poder pausar la suscripción de un cliente por un período definido (vacaciones, lesión, motivos personales)  
**Para** mantener la relación con el cliente sin cobrarle cuando no puede entrenar y reanudar automáticamente después  
**Descripción**: Permitir pausar suscripciones con fecha inicio/fin, suspender pagos automáticos durante el período, extender fecha de vencimiento proporcionalmente, y mostrar estado "pausada" en la lista.  
**Feature**: `src/features/suscripciones-cuotas-recurrentes`

## US-SUB-002: Ajustar sesiones de un paquete activo
**Como** Entrenador Personal  
**Quiero** poder añadir o quitar sesiones de un paquete activo de un cliente  
**Para** ofrecer flexibilidad cuando un cliente necesita más o menos sesiones en un mes específico sin cambiar su plan base  
**Descripción**: Interfaz para ajustar sesiones incluidas con prorrateo automático del precio, registro en historial, y notificación al cliente del cambio.  
**Feature**: `src/features/suscripciones-cuotas-recurrentes`

## US-SUB-003: Visualizar uso de sesiones por cliente
**Como** Entrenador Personal  
**Quiero** ver de forma visual cuántas sesiones ha usado cada cliente de su paquete mensual  
**Para** identificar rápidamente quién no está aprovechando sus sesiones y poder contactarles proactivamente  
**Descripción**: Mostrar barra de progreso o indicador visual en cada suscripción con sesiones usadas/disponibles, porcentaje de uso, y alerta si está bajo (menos del 50% usado con menos de 10 días restantes).  
**Feature**: `src/features/suscripciones-cuotas-recurrentes`

## US-SUB-004: Cambiar plan de cliente
**Como** Entrenador Personal  
**Quiero** poder cambiar a un cliente de un plan a otro (ej: de 4 a 8 sesiones/mes)  
**Para** adaptarme a los cambios en las necesidades y disponibilidad de mis clientes  
**Descripción**: Seleccionar nuevo plan, calcular prorrateo automático, aplicar cambio inmediatamente o en próxima renovación, y enviar notificación al cliente.  
**Feature**: `src/features/suscripciones-cuotas-recurrentes`

## US-SUB-005: Ofrecer sesiones de prueba
**Como** Entrenador Personal  
**Quiero** crear suscripciones de prueba con sesiones limitadas y precio reducido  
**Para** permitir que nuevos clientes prueben mi servicio antes de comprometerse a un plan mensual  
**Descripción**: Opción de crear suscripción tipo "prueba" con duración definida, sesiones limitadas, conversión automática a plan regular o cancelación al finalizar.  
**Feature**: `src/features/suscripciones-cuotas-recurrentes`

## US-SUB-006: Regalar sesiones extra
**Como** Entrenador Personal  
**Quiero** poder añadir sesiones bonus gratuitas a la suscripción de un cliente  
**Para** recompensar fidelidad, compensar inconvenientes, o motivar a clientes que lo necesitan  
**Descripción**: Botón de acción rápida para añadir sesiones extra sin costo, con campo de motivo/nota, registro en historial, y notificación automática al cliente.  
**Feature**: `src/features/suscripciones-cuotas-recurrentes`

## US-SUB-007: Alertas de sesiones por vencer
**Como** Entrenador Personal  
**Quiero** recibir alertas cuando un cliente tiene sesiones que están por caducar sin usar  
**Para** contactar al cliente y evitar que pierda sesiones pagadas, mejorando su satisfacción  
**Descripción**: Notificaciones automáticas cuando faltan 7 días para renovación y quedan sesiones sin usar, con acceso rápido para contactar al cliente.  
**Feature**: `src/features/suscripciones-cuotas-recurrentes`

## US-SUB-008: Gestionar fallos de pago
**Como** Entrenador Personal  
**Quiero** ser notificado cuando falla un pago automático y tener herramientas para gestionarlo  
**Para** resolver rápidamente problemas de cobro sin perder clientes por cuestiones administrativas  
**Descripción**: Notificación inmediata de pago fallido, mostrar estado "pago pendiente", opciones para reintentar cargo, enviar recordatorio al cliente, o pausar suscripción temporalmente.  
**Feature**: `src/features/suscripciones-cuotas-recurrentes`

## US-SUB-009: Enviar recordatorios de renovación
**Como** Entrenador Personal  
**Quiero** que mis clientes reciban recordatorios automáticos antes de que se renueve su suscripción  
**Para** mantenerlos informados, reducir cancelaciones por sorpresa, y darles oportunidad de cambiar de plan  
**Descripción**: Envío automático de email/notificación 7 días antes de renovación con detalles del próximo cargo, opción de cambiar plan, y enlace para gestionar suscripción.  
**Feature**: `src/features/suscripciones-cuotas-recurrentes`

## US-SUB-010: Aplicar descuentos personalizados
**Como** Entrenador Personal  
**Quiero** poder aplicar descuentos personalizados a suscripciones específicas  
**Para** ofrecer precios especiales a familiares, amigos, clientes de largo plazo, o promociones puntuales  
**Descripción**: Opción de añadir descuento por porcentaje o monto fijo, temporal o permanente, con motivo registrado, visible en factura/recibo.  
**Feature**: `src/features/suscripciones-cuotas-recurrentes`

## US-SUB-011: Ver historial completo de cambios
**Como** Entrenador Personal  
**Quiero** ver el historial completo de cambios de una suscripción  
**Para** tener claridad sobre qué modificaciones se han hecho, cuándo y por qué (pausas, cambios de plan, ajustes de sesiones)  
**Descripción**: Timeline visual con todos los eventos de la suscripción: creación, pagos, cambios de plan, pausas, ajustes de sesiones, con fechas y notas.  
**Feature**: `src/features/suscripciones-cuotas-recurrentes`

## US-SUB-012: Gestionar cancelaciones con encuesta
**Como** Entrenador Personal  
**Quiero** que cuando un cliente cancele su suscripción pueda indicar el motivo  
**Para** entender por qué se van mis clientes y mejorar mi servicio  
**Descripción**: Formulario de cancelación con opciones de motivo (precio, horarios, resultados, ubicación, personal), campo de comentarios adicionales, y opción de "retención" con oferta especial.  
**Feature**: `src/features/suscripciones-cuotas-recurrentes`

## US-SUB-013: Analítica de compromiso de clientes
**Como** Entrenador Personal  
**Quiero** ver métricas de compromiso de mis clientes con sus suscripciones  
**Para** identificar clientes en riesgo de cancelación y tomar acción preventiva  
**Descripción**: Dashboard con métricas: tasa de uso de sesiones por cliente, frecuencia de asistencia, clientes que no han reservado en X días, tendencias de renovación/cancelación.  
**Feature**: `src/features/suscripciones-cuotas-recurrentes`

## US-SUB-014: Crear paquetes familiares o grupales
**Como** Entrenador Personal  
**Quiero** poder crear suscripciones que agrupen a varios miembros de una familia o grupo  
**Para** ofrecer descuentos por volumen y simplificar la gestión cuando entreno a grupos relacionados  
**Descripción**: Opción de crear suscripción "grupal" vinculando múltiples clientes, precio total compartido, seguimiento individual de sesiones de cada miembro.  
**Feature**: `src/features/suscripciones-cuotas-recurrentes`

## US-SUB-015: Previsualizar vista del cliente
**Como** Entrenador Personal  
**Quiero** poder ver cómo se muestra la información de suscripción desde la perspectiva del cliente  
**Para** asegurarme de que la información es clara y profesional antes de que el cliente la vea  
**Descripción**: Botón "Vista de cliente" que muestra modal o página con la información tal como la ve el cliente: sesiones disponibles, próximo pago, historial, opciones de gestión.  
**Feature**: `src/features/suscripciones-cuotas-recurrentes`

## US-SUB-016: Renovación con negociación flexible
**Como** Entrenador Personal  
**Quiero** poder proponer cambios de plan o precio cuando se acerca la renovación de un cliente  
**Para** retener clientes ofreciendo alternativas antes de que cancelen  
**Descripción**: Al detectar próxima renovación, opción de enviar propuesta personalizada al cliente (cambio de plan, descuento, ajuste de sesiones) que el cliente puede aceptar/rechazar.  
**Feature**: `src/features/suscripciones-cuotas-recurrentes`

## US-SUB-017: Transferir sesiones entre meses
**Como** Entrenador Personal  
**Quiero** poder permitir que las sesiones no usadas se transfieran al siguiente mes  
**Para** dar más flexibilidad a mis clientes y evitar que sientan que pierden dinero  
**Descripción**: Configuración a nivel de plan o individual para permitir rollover de sesiones, límite máximo de sesiones acumulables, indicador visual de sesiones del mes actual vs. acumuladas.  
**Feature**: `src/features/suscripciones-cuotas-recurrentes`

## US-SUB-018: Notificaciones de actividad de suscripciones
**Como** Entrenador Personal  
**Quiero** recibir un resumen diario/semanal de la actividad de suscripciones  
**Para** mantenerme informado sin tener que revisar manualmente cada día  
**Descripción**: Email o notificación configurable con resumen: nuevas suscripciones, renovaciones exitosas, pagos fallidos, cancelaciones, clientes con bajo uso de sesiones.  
**Feature**: `src/features/suscripciones-cuotas-recurrentes`

## US-SUB-019: Métricas financieras mejoradas
**Como** Entrenador Personal  
**Quiero** ver proyecciones de ingresos recurrentes y análisis de retención  
**Para** entender mejor la salud financiera de mi negocio y planificar a futuro  
**Descripción**: Dashboard de analytics con: MRR (ingresos mensuales recurrentes), proyección 3 meses, tasa de retención/cancelación, valor promedio por cliente, lifetime value.  
**Feature**: `src/features/suscripciones-cuotas-recurrentes`

## US-SUB-020: Exportar datos de suscripciones
**Como** Entrenador Personal  
**Quiero** poder exportar los datos de suscripciones y pagos a formatos como Excel o CSV  
**Para** hacer mis propios análisis, compartir con mi asesor fiscal, o mantener respaldos  
**Descripción**: Botón de exportar con opciones de formato (CSV, Excel, PDF), selección de período de tiempo, campos a incluir, y generación descargable.  
**Feature**: `src/features/suscripciones-cuotas-recurrentes`

