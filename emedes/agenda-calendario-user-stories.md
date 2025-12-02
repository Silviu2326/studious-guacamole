# USER STORIES - AGENDA Y CALENDARIO
## Perspectiva: Entrenador Personal en Solitario

---

## VISTA Y NAVEGACIÓN DEL CALENDARIO

**US-31**: Como Entrenador personal, Quiero ver mi agenda en formato semanal por defecto, Para visualizar rápidamente toda mi semana de trabajo de un vistazo.
**Feature**: `src/features/agenda-calendario`
**Descripción**: Vista semanal como predeterminada con días de lunes a domingo. Incluir horas desde las 6:00 hasta las 22:00 configurables. Cambio rápido a vista diaria o mensual. Grid claro con slots de 30 minutos.

**US-32**: Como Entrenador personal, Quiero mover sesiones arrastrando y soltando en el calendario, Para reprogramar rápidamente cuando un cliente cancela o surge un cambio.
**Feature**: `src/features/agenda-calendario`
**Descripción**: Drag & drop de citas entre días y horarios. Validación de conflictos automática. Confirmación antes de mover. Notificación automática al cliente del cambio.

**US-33**: Como Entrenador personal, Quiero ver de forma clara qué horarios tengo libres versus ocupados, Para saber al instante cuándo puedo agendar nuevas sesiones.
**Feature**: `src/features/agenda-calendario`
**Descripción**: Código de colores claro: verde (libre), azul (ocupado), gris (bloqueado). Indicador de disponibilidad porcentual por día. Vista rápida de próximos slots disponibles.

**US-34**: Como Entrenador personal, Quiero navegar rápidamente entre semanas con flechas o calendario desplegable, Para planificar y revisar mi agenda del futuro y pasado fácilmente.
**Feature**: `src/features/agenda-calendario`
**Descripción**: Navegación con flechas ← →. Botón "Hoy" para volver al día actual. Mini calendario mensual para saltar a cualquier fecha. Atajos de teclado.

---

## CREACIÓN Y GESTIÓN DE SESIONES

**US-35**: Como Entrenador personal, Quiero crear una sesión 1:1 en menos de 30 segundos, Para no perder tiempo en procesos complicados cuando un cliente quiere agendar.
**Feature**: `src/features/agenda-calendario`
**Descripción**: Modal simplificado con campos esenciales: cliente (autocompletar), fecha/hora, tipo de sesión, duración. Valores por defecto inteligentes. Crear y duplicar para sesiones recurrentes.

**US-36**: Como Entrenador personal, Quiero tener plantillas de sesiones frecuentes (ej: "PT 1h", "Evaluación inicial", "Sesión online"), Para crear citas aún más rápido sin repetir información.
**Feature**: `src/features/agenda-calendario`
**Descripción**: Guardar plantillas personalizadas con: nombre, duración, tipo, precio, notas predefinidas. Aplicar plantilla con 1 click. Editar plantillas fácilmente. Mínimo 5 plantillas disponibles.

**US-37**: Como Entrenador personal, Quiero crear sesiones recurrentes (ej: "Todos los lunes y miércoles a las 10:00"), Para no tener que agendar una por una las sesiones habituales de mis clientes.
**Feature**: `src/features/agenda-calendario`
**Descripción**: Opciones de recurrencia: diaria, semanal (seleccionar días), quincenal, mensual. Fecha de inicio y fin. Opción "hasta cancelar". Editar serie completa o sesión individual.

**US-38**: Como Entrenador personal, Quiero editar o cancelar una sesión con facilidad, Para gestionar cambios sin complicaciones.
**Feature**: `src/features/agenda-calendario`
**Descripción**: Click derecho o botón de acciones rápidas. Editar: cambiar fecha/hora/cliente. Cancelar: motivo de cancelación (cliente, entrenador, otro). Registro en historial. Notificación automática.

**US-39**: Como Entrenador personal, Quiero ver la información completa de una sesión al hacer click, Para recordar rápidamente de qué cliente es y qué vamos a trabajar.
**Feature**: `src/features/agenda-calendario`
**Descripción**: Modal o panel lateral con: nombre del cliente, foto, tipo de sesión, horario, duración, notas previas, historial de sesiones anteriores. Acceso rápido a perfil del cliente.

---

## DISPONIBILIDAD Y BLOQUEOS

**US-40**: Como Entrenador personal, Quiero configurar mis horarios de trabajo habituales por día, Para que el sistema solo permita agendar en mis horas disponibles.
**Feature**: `src/features/agenda-calendario`
**Descripción**: Configurador semanal: establecer horarios por día (ej: Lunes 8:00-14:00 y 16:00-20:00). Copiar horarios entre días. Guardar plantillas de horarios (temporada alta/baja). Visualización clara en calendario.

**US-41**: Como Entrenador personal, Quiero bloquear días completos o rangos de horas (vacaciones, días libres, compromisos), Para que no se puedan agendar sesiones en esos momentos.
**Feature**: `src/features/agenda-calendario`
**Descripción**: Selector de rango de fechas. Bloqueo de día completo o parcial. Motivo del bloqueo (opcional). Vista de bloqueos futuros. Editar o eliminar bloqueos. Color distintivo en calendario.

**US-42**: Como Entrenador personal, Quiero que mi agenda respete automáticamente tiempos de descanso entre sesiones, Para no agendar sesiones consecutivas sin respiro.
**Feature**: `src/features/agenda-calendario`
**Descripción**: Configurar tiempo mínimo entre sesiones (ej: 15 min). Aplicar automáticamente al crear o mover citas. Opción de override manual si es necesario. Indicador visual de buffer time.

---

## RECORDATORIOS Y COMUNICACIÓN

**US-43**: Como Entrenador personal, Quiero que se envíen recordatorios automáticos a mis clientes por WhatsApp, Para reducir los no-shows y cancelaciones de último momento.
**Feature**: `src/features/agenda-calendario`
**Descripción**: Recordatorios automáticos 24h y 2h antes de la sesión. Mensaje personalizable con variables (nombre, hora, lugar). Envío vía WhatsApp o SMS. Confirmación de lectura. Desactivar por cliente si prefiere.

**US-44**: Como Entrenador personal, Quiero recibir un resumen diario de mis sesiones del día siguiente, Para planificar mentalmente mi jornada.
**Feature**: `src/features/agenda-calendario`
**Descripción**: Email o notificación cada noche con sesiones del día siguiente. Incluir: horarios, clientes, tipos de sesión, notas importantes. Opción de ver en app. Configurar hora de envío.

**US-45**: Como Entrenador personal, Quiero que los clientes puedan confirmar su asistencia al recibir el recordatorio, Para saber con anticipación si vendrán o no.
**Feature**: `src/features/agenda-calendario`
**Descripción**: Botones en recordatorio: "Confirmo" / "No puedo ir". Actualización automática en agenda. Notificación al entrenador si cancela. Solicitar reprogramación. Estadísticas de confirmación por cliente.

**US-46**: Como Entrenador personal, Quiero recibir una notificación 10 minutos antes de cada sesión, Para prepararme y no olvidar ninguna cita.
**Feature**: `src/features/agenda-calendario`
**Descripción**: Notificación push y sonido 10 min antes. Mostrar nombre del cliente y tipo de sesión. Botón de acceso rápido a detalles. Snooze de 5 min si estoy ocupado. Configurar tiempo de antelación.

---

## INTEGRACIÓN Y SINCRONIZACIÓN

**US-47**: Como Entrenador personal, Quiero sincronizar mi agenda con Google Calendar o Outlook, Para tener todas mis citas en un solo lugar y evitar dobles reservas.
**Feature**: `src/features/agenda-calendario`
**Descripción**: Conexión con Google Calendar y Outlook. Sincronización bidireccional en tiempo real. Eventos externos bloquean horarios automáticamente. Elegir qué calendarios sincronizar. Desconexión fácil.

**US-48**: Como Entrenador personal, Quiero generar un link público para que mis clientes agenden sesiones solos, Para ahorrar tiempo en ir y venir de mensajes coordinando horarios.
**Feature**: `src/features/agenda-calendario`
**Descripción**: Generar link personal tipo "miagenda.com/nombre-entrenador". Cliente ve horarios disponibles en tiempo real. Selecciona slot y tipo de sesión. Formulario simple (nombre, email, tel). Confirmación automática. Aparece en agenda del entrenador.

**US-49**: Como Entrenador personal, Quiero que al crear una sesión se cree automáticamente un evento en mi calendario personal, Para no tener que duplicar el trabajo en dos sitios.
**Feature**: `src/features/agenda-calendario`
**Descripción**: Creación automática en calendario externo sincronizado. Incluir detalles: cliente, tipo, notas. Actualización automática si se modifica. Eliminación si se cancela. Opción de desactivar por sesión.

---

## HISTORIAL Y SEGUIMIENTO

**US-50**: Como Entrenador personal, Quiero ver el historial completo de sesiones de cada cliente, Para hacer seguimiento de su constancia y progreso.
**Feature**: `src/features/agenda-calendario`
**Descripción**: Vista por cliente con todas las sesiones: pasadas, presentes, futuras. Indicadores de asistencia (asistió/faltó/canceló). Filtros por fecha. Contador de sesiones totales. Tasa de asistencia porcentual. Notas de cada sesión.

**US-51**: Como Entrenador personal, Quiero agregar notas rápidas después de cada sesión, Para recordar qué trabajamos y cómo le fue al cliente.
**Feature**: `src/features/agenda-calendario`
**Descripción**: Botón "Agregar nota" en sesión completada. Campos: qué se trabajó, cómo se sintió, observaciones, próximos pasos. Plantillas de notas frecuentes. Visible en historial del cliente. Búsqueda en notas.

**US-52**: Como Entrenador personal, Quiero marcar las sesiones como "completada", "no show" o "cancelada", Para llevar un registro real de lo que sucedió.
**Feature**: `src/features/agenda-calendario`
**Descripción**: Estados de sesión con colores: verde (completada), rojo (no show), amarillo (cancelada). Cambio manual o automático. Métricas de no-shows por cliente. Alertas si cliente tiene muchos no-shows. Política de cancelación configurable.

**US-53**: Como Entrenador personal, Quiero ver estadísticas de cuántas sesiones no asistidas tiene cada cliente, Para identificar clientes problemáticos o con baja adherencia.
**Feature**: `src/features/agenda-calendario`
**Descripción**: Dashboard por cliente: total sesiones, asistidas, no shows, cancelaciones. Porcentaje de adherencia. Tendencia últimos 3 meses. Alertas automáticas si baja adherencia. Sugerencia de conversación con cliente.

---

## MÉTRICAS Y ANALÍTICAS

**US-54**: Como Entrenador personal, Quiero ver mi porcentaje de ocupación semanal, Para saber si tengo capacidad para más clientes o estoy al límite.
**Feature**: `src/features/agenda-calendario`
**Descripción**: Gráfico claro: X horas trabajadas / Y horas disponibles = Z% ocupación. Por semana y mes. Comparativa con períodos anteriores. Meta configurable. Proyección de ingresos según ocupación.

**US-55**: Como Entrenador personal, Quiero ver métricas simples de mis sesiones (total semana/mes, tipos de sesión, horarios más ocupados), Para entender mejor mi negocio.
**Feature**: `src/features/agenda-calendario`
**Descripción**: Dashboard simple: total sesiones, por tipo, por horario, por día de semana. Gráficos visuales. Comparativa mes anterior. Ingresos generados. Promedio de sesiones por día. Tendencias.

**US-56**: Como Entrenador personal, Quiero ver qué horarios son los más solicitados, Para optimizar mi disponibilidad y ofrecer más en esos momentos.
**Feature**: `src/features/agenda-calendario`
**Descripción**: Mapa de calor semanal mostrando slots más ocupados. Estadísticas por franja horaria. Lista de horarios con mayor demanda. Sugerencias de apertura de nuevos horarios. Análisis de tendencias.

**US-57**: Como Entrenador personal, Quiero ver cuántos ingresos he generado y cuántos tengo pendientes por sesiones programadas, Para tener control de mi facturación.
**Feature**: `src/features/agenda-calendario`
**Descripción**: Dashboard financiero: ingresos del mes, sesiones cobradas vs pendientes, proyección del mes. Marcador de sesiones pagadas/no pagadas. Integración con gestión de pagos. Alertas de pagos pendientes. Filtros por cliente.

---

## GESTIÓN DE CANCELACIONES Y ESPERAS

**US-58**: Como Entrenador personal, Quiero tener una lista de espera para horarios populares, Para ofrecer slots cancelados rápidamente a otros clientes interesados.
**Feature**: `src/features/agenda-calendario`
**Descripción**: Sistema de lista de espera por horario. Cliente se apunta a horarios deseados. Notificación automática cuando se libera. Orden de prioridad (primero en lista). Gestión de lista por entrenador.

**US-59**: Como Entrenador personal, Quiero configurar mi política de cancelación y que se aplique automáticamente, Para ser consistente y profesional con todos mis clientes.
**Feature**: `src/features/agenda-calendario`
**Descripción**: Configurar reglas: tiempo mínimo de cancelación (ej: 24h), penalizaciones, excepciones. Aplicación automática al crear sesiones. Notificación al cliente de la política. Registro de cancelaciones tardías. Estadísticas de cumplimiento.

**US-60**: Como Entrenador personal, Quiero que el sistema me sugiera automáticamente reemplazar una sesión cancelada con clientes de la lista de espera, Para maximizar mi ocupación sin esfuerzo adicional.
**Feature**: `src/features/agenda-calendario`
**Descripción**: Al cancelarse una sesión, mostrar lista de espera para ese horario. Botón de notificar automáticamente. Mensaje predefinido a clientes en espera. Asignación con 1 click. Tiempo límite de respuesta. Si nadie acepta, pasar al siguiente.

---

## EXPERIENCIA MÓVIL Y ACCESIBILIDAD

**US-61**: Como Entrenador personal, Quiero gestionar mi agenda fácilmente desde mi celular, Para poder agendar, modificar o consultar sesiones en cualquier momento y lugar.
**Feature**: `src/features/agenda-calendario`
**Descripción**: web responsive optimizada para móvil. Vista semanal adaptada a pantalla pequeña. Gestos touch intuitivos. Acceso rápido a acciones frecuentes. Carga rápida. Funciona offline con sincronización posterior.

**US-62**: Como Entrenador personal, Quiero recibir todas las notificaciones importantes en mi celular, Para estar al tanto de cancelaciones, nuevas reservas o recordatorios sin estar frente al computador.
**Feature**: `src/features/agenda-calendario`
**Descripción**: Notificaciones push configurables: nuevas reservas, cancelaciones, recordatorios, no shows, confirmaciones. Sonidos personalizados por tipo. Horario de no molestar. Ver y actuar desde notificación. Badge con contador.

---

## OTROS

**US-64**: Como Entrenador personal, Quiero poder imprimir o exportar mi agenda semanal, Para tener un respaldo físico o compartir con recepción/asistente.
**Feature**: `src/features/agenda-calendario`
**Descripción**: Botón de exportar/imprimir. Formato PDF limpio y profesional. Incluir: horarios, clientes, tipos de sesión, notas. Rango de fechas configurable. Opción de ocultar información sensible. Enviar por email.

**US-65**: Como Entrenador personal, Quiero tener un modo "día completo" que muestre únicamente las sesiones de hoy con mayor detalle, Para enfocarme solo en mi jornada actual sin distracciones.
**Feature**: `src/features/agenda-calendario`
**Descripción**: Vista de día simplificada: solo sesiones de hoy. Cards grandes con info del cliente, foto, hora, tipo. Botones de acción rápida. Siguiente sesión destacada. Countdown a próxima sesión. Checklist diario.

