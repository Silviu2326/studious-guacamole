# User Stories - Facturación & Cobros

## US-FC-002: Facturación Automática de Sesiones Completadas
**Como** Entrenador Personal  
**Quiero** Generar facturas automáticamente cuando marco una sesión como completada  
**Para** No tener que recordar facturar cada sesión individualmente  

**Descripción:** Al completar una sesión en la agenda, el sistema pregunta si desea generar factura automática. Si el cliente tiene paquete prepago, se descuenta automáticamente.

**Feature:** `src/features/facturacin-cobros`

---

## US-FC-003: Plantillas de Servicios Pre-configuradas
**Como** Entrenador Personal  
**Quiero** Tener mis servicios más comunes guardados como plantillas rápidas  
**Para** Facturar con un solo clic los servicios que ofrezco regularmente  

**Descripción:** Lista de servicios comunes (sesión individual, paquete 10 sesiones, plan mensual, etc.) con precio pre-configurado. Selección rápida al crear factura.

**Feature:** `src/features/facturacin-cobros`

---

## US-FC-004: Cobros Recurrentes Automáticos
**Como** Entrenador Personal  
**Quiero** Configurar cobros mensuales automáticos para clientes con suscripción  
**Para** No tener que crear manualmente la misma factura cada mes  

**Descripción:** Configurar frecuencia (mensual, semanal) y monto. El sistema genera y envía automáticamente facturas en las fechas programadas.

**Feature:** `src/features/facturacin-cobros`

---

## US-FC-005: Link de Pago Online
**Como** Entrenador Personal  
**Quiero** Enviar un link de pago directo a mis clientes  
**Para** Que puedan pagar online con tarjeta o transferencia sin intermediarios  

**Descripción:** Cada factura genera un link único que se envía por email/WhatsApp. El cliente puede pagar directamente y el sistema actualiza el estado automáticamente.

**Feature:** `src/features/facturacin-cobros`

---

## US-FC-006: Recibos Digitales Automáticos
**Como** Entrenador Personal  
**Quiero** Que se envíe un recibo digital automáticamente cuando registro un pago  
**Para** Que mis clientes tengan comprobante inmediato sin trabajo adicional  

**Descripción:** Al registrar un cobro, el sistema envía automáticamente recibo PDF al email del cliente con detalles del pago.

**Feature:** `src/features/facturacin-cobros`

---

## US-FC-007: Dashboard Financiero Simplificado
**Como** Entrenador Personal  
**Quiero** Ver de un vistazo cuánto he facturado y cobrado este mes  
**Para** Tener control rápido de mis ingresos sin revisar reportes complejos  

**Descripción:** Widget visual con: ingresos del mes, pendientes de cobro, gráfico de tendencia mensual, y próximos vencimientos. Vista simple y clara.

**Feature:** `src/features/facturacin-cobros`

---

## US-FC-008: Vista de Flujo de Caja Proyectado
**Como** Entrenador Personal  
**Quiero** Ver mis ingresos esperados vs ingresos reales del mes  
**Para** Planificar mejor mis finanzas personales  

**Descripción:** Calendario mensual mostrando: facturas pendientes (ingresos esperados), cobros confirmados (ingresos reales), y proyección de fin de mes.

**Feature:** `src/features/facturacin-cobros`

---

## US-FC-009: Recordatorios Automáticos Inteligentes
**Como** Entrenador Personal  
**Quiero** Que el sistema envíe recordatorios automáticos antes del vencimiento  
**Para** No tener que estar pendiente de enviar recordatorios manualmente  

**Descripción:** Configuración única de recordatorios automáticos (3 días antes, día de vencimiento, 3 días después). Se envían automáticamente por email/WhatsApp.

**Feature:** `src/features/facturacin-cobros`

---

## US-FC-010: Registro Rápido de Cobros en Efectivo
**Como** Entrenador Personal  
**Quiero** Registrar un pago en efectivo en menos de 30 segundos  
**Para** Marcar rápidamente que un cliente pagó después de una sesión  

**Descripción:** Botón de "Registrar Pago Rápido" en lista de facturas. Modal simple con monto, método, y confirmar. Sin campos innecesarios.

**Feature:** `src/features/facturacin-cobros`

---

## US-FC-011: Historial de Transacciones por Cliente
**Como** Entrenador Personal  
**Quiero** Ver todo el historial de pagos y facturas de un cliente en un solo lugar  
**Para** Resolver dudas rápidamente sobre pagos anteriores  

**Descripción:** Sección en el perfil del cliente con todas las facturas, pagos, y saldo pendiente. Timeline visual de transacciones.

**Feature:** `src/features/facturacin-cobros`

---

## US-FC-012: Alertas de Facturas Vencidas
**Como** Entrenador Personal  
**Quiero** Recibir notificaciones de facturas que llevan más de 7 días vencidas  
**Para** Hacer seguimiento oportuno a clientes morosos  

**Descripción:** Notificación en el sistema y opcional por email cuando una factura lleva más de X días vencida. Lista prioritaria de pendientes.

**Feature:** `src/features/facturacin-cobros`

---

## US-FC-013: Múltiples Métodos de Pago por Factura
**Como** Entrenador Personal  
**Quiero** Registrar pagos parciales con diferentes métodos  
**Para** Cuando un cliente paga parte en efectivo y parte con transferencia  

**Descripción:** Permitir registrar múltiples pagos parciales en una factura, cada uno con su propio método de pago y referencia.

**Feature:** `src/features/facturacin-cobros`

---

## US-FC-014: Descuentos y Promociones Rápidas
**Como** Entrenador Personal  
**Quiero** Aplicar descuentos porcentuales o de monto fijo fácilmente  
**Para** Hacer promociones o reconocer la fidelidad de clientes regulares  

**Descripción:** Campo de descuento visible al crear factura. Opciones: porcentaje, monto fijo, o motivo predefinido (referido, promoción, etc.).

**Feature:** `src/features/facturacin-cobros`

---

## US-FC-015: Exportar Resumen Mensual para Contabilidad
**Como** Entrenador Personal  
**Quiero** Exportar un resumen de todas mis facturas y cobros del mes en Excel  
**Para** Facilitar la declaración de impuestos y contabilidad personal  

**Descripción:** Botón de exportar en reportes que genera archivo Excel con: fecha, cliente, concepto, monto, método de pago, y estado.

**Feature:** `src/features/facturacin-cobros`

---

## US-FC-016: Marcado de Clientes con Pagos Pendientes
**Como** Entrenador Personal  
**Quiero** Ver visualmente en la lista de clientes quiénes tienen pagos pendientes  
**Para** Identificar rápidamente situaciones de mora antes de agendar sesiones  

**Descripción:** Indicador visual (badge o ícono) en lista de clientes mostrando si tiene facturas vencidas o pendientes. Color según antigüedad.

**Feature:** `src/features/facturacin-cobros`

---

## US-FC-017: Notas Internas en Facturas
**Como** Entrenador Personal  
**Quiero** Agregar notas privadas en las facturas  
**Para** Recordar detalles importantes sobre acuerdos de pago o situaciones especiales  

**Descripción:** Campo de notas internas (no visible para el cliente) en cada factura. Útil para registrar acuerdos de pago, recordatorios personales, etc.

**Feature:** `src/features/facturacin-cobros`

---

## US-FC-018: Vista de Ingresos por Servicio
**Como** Entrenador Personal  
**Quiero** Ver qué servicios generan más ingresos  
**Para** Enfocar mi estrategia en los servicios más rentables  

**Descripción:** Reporte visual que muestra ingresos desglosados por tipo de servicio (sesiones individuales, paquetes, planes, etc.) con gráfico comparativo.

**Feature:** `src/features/facturacin-cobros`

---



