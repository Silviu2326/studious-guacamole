# User Stories - Pagos Pendientes & Morosidad (Rediseño para Entrenador Personal)

## US-01: Vista simplificada de "Quién me debe"
**Como** Entrenador personal
**Quiero** ver de forma simple y clara qué clientes me deben dinero y cuánto
**Para** tener una visión rápida de mi situación financiera sin términos complejos como "morosidad" o "clasificación de riesgo"

**Descripción**: Reemplazar la vista actual por una lista simple con: nombre del cliente, monto que debe, días desde el vencimiento, y acciones rápidas. Eliminar conceptos como "nivel de morosidad negro/rojo/naranja" y usar lenguaje más amigable como "Vencido hace X días".

**Feature**: `src/features/pagos-pendientes-morosidad`

---

## US-02: Botón directo de WhatsApp
**Como** Entrenador personal
**Quiero** tener un botón que abra WhatsApp directamente con el cliente
**Para** recordarle el pago de forma rápida y personal sin tener que copiar números o escribir mensajes

**Descripción**: Agregar un botón de WhatsApp en cada fila de cliente con deuda que abra la conversación con un mensaje pre-cargado amigable. El mensaje debe poder personalizarse antes de enviar.

**Feature**: `src/features/pagos-pendientes-morosidad`

---

## US-03: Registro rápido de pago recibido
**Como** Entrenador personal
**Quiero** marcar un pago como recibido con un solo clic e indicar el método de pago
**Para** mantener mi registro actualizado sin procesos complicados

**Descripción**: Simplificar el proceso de marcar pagos como recibidos. Debe permitir seleccionar método de pago (efectivo, transferencia, tarjeta, etc.) y agregar una nota opcional.

**Feature**: `src/features/pagos-pendientes-morosidad`

---

## US-04: Generar link de pago rápido
**Como** Entrenador personal
**Quiero** generar un link de pago que pueda enviar a mi cliente
**Para** facilitar que me paguen de forma digital sin tener que explicar cómo hacerlo

**Descripción**: Crear funcionalidad para generar enlaces de pago (integración con plataformas como Wompi, PayU, o similar) que se puedan copiar y enviar por WhatsApp.

**Feature**: `src/features/pagos-pendientes-morosidad`

---

## US-05: Historial de conversaciones sobre pagos
**Como** Entrenador personal
**Quiero** ver un registro simple de cuándo contacté a cada cliente sobre su pago
**Para** no repetir recordatorios y saber cuándo fue la última vez que hablé con ellos

**Descripción**: Simplificar el componente de "Seguimiento" actual. Mostrar timeline simple: "Le escribí el DD/MM", "Me respondió que paga la próxima semana", etc. Agregar botón "Registrar contacto rápido".

**Feature**: `src/features/pagos-pendientes-morosidad`

---

## US-06: Planes de pago flexibles
**Como** Entrenador personal
**Quiero** poder acordar un plan de pagos con un cliente que tiene dificultades económicas
**Para** mantener la relación y recuperar el dinero de forma gradual sin perder al cliente

**Descripción**: Crear funcionalidad para dividir una deuda en cuotas. Debe permitir definir cantidad de cuotas, fechas y montos. Mostrar estado del plan de pagos en el dashboard.

**Feature**: `src/features/pagos-pendientes-morosidad`

---

## US-07: Congelar/pausar membresía
**Como** Entrenador personal
**Quiero** poder pausar temporalmente la membresía de un cliente con deuda
**Para** evitar que la deuda siga creciendo mientras resolvemos el tema del pago

**Descripción**: Agregar opción para pausar la membresía de un cliente. Debe detener la generación de nuevos cobros y mostrar claramente que está pausada. Incluir fecha de reactivación programada.

**Feature**: `src/features/pagos-pendientes-morosidad`

---

## US-08: Dashboard simplificado con métricas clave
**Como** Entrenador personal
**Quiero** ver en el dashboard solo: total que me deben, cantidad de clientes con deuda, y quién me debe más
**Para** entender mi situación financiera de un vistazo sin métricas complejas como "tasa de recuperación"

**Descripción**: Rediseñar el dashboard eliminando métricas empresariales. Mostrar: monto total pendiente, cantidad de clientes con deuda, cliente con mayor deuda, y alerta si hay alguien con más de 30 días de retraso.

**Feature**: `src/features/pagos-pendientes-morosidad`

---

## US-09: Notas sobre situación del cliente
**Como** Entrenador personal
**Quiero** agregar notas privadas sobre la situación financiera o personal del cliente
**Para** recordar contexto importante (ej: "perdió su trabajo", "me dijo que paga el 15") al momento de hacer seguimiento

**Descripción**: Agregar campo de notas privadas en el perfil de pago de cada cliente. Las notas deben ser visibles al intentar contactar al cliente o ver su deuda.

**Feature**: `src/features/pagos-pendientes-morosidad`

---

## US-11: Relacionar pagos pendientes con asistencia
**Como** Entrenador personal
**Quiero** ver si un cliente con deuda sigue asistiendo a las sesiones
**Para** decidir mi estrategia de cobro o si debo pausar su acceso

**Descripción**: Integrar información de asistencia del cliente en la vista de pagos pendientes. Mostrar "Última asistencia: hace X días" y "Asistió este mes: X veces".

**Feature**: `src/features/pagos-pendientes-morosidad`

---

## US-12: Descuentos y excepciones
**Como** Entrenador personal
**Quiero** poder aplicar un descuento excepcional o condonar parte de una deuda
**Para** manejar casos especiales con clientes que tienen dificultades económicas y mantener la buena relación

**Descripción**: Agregar funcionalidad para ajustar el monto de una deuda. Debe solicitar motivo y quedar registrado en el historial del cliente.

**Feature**: `src/features/pagos-pendientes-morosidad`

---

## US-15: Métodos de pago preferidos del cliente
**Como** Entrenador personal
**Quiero** registrar el método de pago preferido de cada cliente
**Para** sugerirle directamente cómo pagarme cuando le hago seguimiento

**Descripción**: Agregar campo "Método de pago preferido" en el perfil del cliente. Mostrar esta información al momento de contactarlo sobre un pago pendiente.

**Feature**: `src/features/pagos-pendientes-morosidad`

---

## US-16: Reporte simple mensual
**Como** Entrenador personal
**Quiero** ver un reporte mensual simple de: cuánto me pagaron, cuánto quedó pendiente, y quién me debe
**Para** tener claridad de mis ingresos reales del mes sin métricas complejas

**Descripción**: Simplificar el componente de "Reportes". Crear vista mensual simple con: total cobrado, total pendiente, lista de quién pagó y quién no. Eliminar gráficos complejos y análisis estadísticos.

**Feature**: `src/features/pagos-pendientes-morosidad`

---

## US-17: Recordatorios programados simples
**Como** Entrenador personal
**Quiero** programar recordarme a mí mismo contactar a un cliente en una fecha específica
**Para** no olvidarme de hacer seguimiento cuando el cliente me dijo que podría pagar

**Descripción**: Simplificar sistema de recordatorios. Permitir marcar "Recordarme contactar el [fecha]" con nota opcional. Mostrar estos recordatorios pendientes en el dashboard.

**Feature**: `src/features/pagos-pendientes-morosidad`

---

## US-18: Filtros simples y prácticos
**Como** Entrenador personal
**Quiero** filtrar mi lista de deudas por: "vencidos hace más de 15 días", "montos mayores a X", o "no he contactado en 7 días"
**Para** priorizar a quién contactar primero de forma práctica

**Descripción**: Agregar filtros simples y útiles en la lista de pagos pendientes. Eliminar filtros complejos como "clasificación de riesgo" o "estrategia de cobro" que no aplican.

**Feature**: `src/features/pagos-pendientes-morosidad`

---

## US-19: Opción de "cliente de confianza"
**Como** Entrenador personal
**Quiero** marcar clientes de confianza que sé que me van a pagar aunque se atrasen
**Para** enfocar mi atención en casos que realmente requieren seguimiento

**Descripción**: Agregar etiqueta de "Cliente de confianza" que se puede activar/desactivar. Estos clientes deben aparecer con indicador diferente y no generar alertas urgentes.

**Feature**: `src/features/pagos-pendientes-morosidad`

---

## US-20: Exportar lista de deudores simple
**Como** Entrenador personal
**Quiero** exportar una lista simple en Excel con quién me debe, cuánto y desde cuándo
**Para** tener mi propio registro o compartirlo con mi contador si es necesario

**Descripción**: Agregar botón de exportar a Excel/CSV con información básica: nombre cliente, teléfono, email, factura, monto, fecha vencimiento, días de retraso. Formato simple sin métricas complejas.

**Feature**: `src/features/pagos-pendientes-morosidad`

