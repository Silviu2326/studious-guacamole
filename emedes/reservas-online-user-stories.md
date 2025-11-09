# User Stories - Reservas Online para Entrenador Personal

## US-RO-001: Configurar horarios de disponibilidad semanal
**Como** Entrenador Personal  
**Quiero** Configurar mis horarios disponibles para cada día de la semana  
**Para** Que los clientes solo puedan reservar en los bloques horarios que tengo libres y evitar reservas fuera de mi horario laboral

**Feature:** `src/features/reservas-online`

---

## US-RO-002: Bloquear fechas específicas
**Como** Entrenador Personal  
**Quiero** Marcar fechas específicas como no disponibles (vacaciones, eventos personales, días festivos)  
**Para** Que no se puedan hacer reservas en esos días y mantener mi agenda actualizada

**Feature:** `src/features/reservas-online`

---

## US-RO-003: Definir duración personalizada de sesiones
**Como** Entrenador Personal  
**Quiero** Configurar diferentes duraciones de sesión (30, 45, 60, 90 minutos)  
**Para** Ofrecer flexibilidad según el tipo de entrenamiento que el cliente necesite

**Feature:** `src/features/reservas-online`

---

## US-RO-004: Crear plantillas de tipos de sesión
**Como** Entrenador Personal  
**Quiero** Crear plantillas de sesión con nombre, descripción, duración y precio (ej: "Fuerza 60min", "HIIT 45min", "Evaluación inicial 90min")  
**Para** Agilizar el proceso de reserva y tener precios diferenciados según el tipo de entrenamiento

**Feature:** `src/features/reservas-online`

---

## US-RO-005: Configurar precios diferenciados
**Como** Entrenador Personal  
**Quiero** Establecer precios diferentes según el tipo de sesión, duración y modalidad (presencial/online)  
**Para** Reflejar correctamente el valor de cada servicio que ofrezco

**Feature:** `src/features/reservas-online`

---

## US-RO-006: Generar link público de reserva
**Como** Entrenador Personal  
**Quiero** Generar un enlace público personalizado que pueda compartir con mis clientes  
**Para** Que ellos puedan ver mi disponibilidad y reservar sesiones directamente sin mi intervención manual

**Feature:** `src/features/reservas-online`

---

## US-RO-008: Confirmación automática o manual de reservas
**Como** Entrenador Personal  
**Quiero** Elegir si las reservas de clientes se confirman automáticamente o requieren mi aprobación  
**Para** Tener control sobre mi agenda según mi preferencia de trabajo

**Feature:** `src/features/reservas-online`

---

## US-RO-009: Reprogramar reservas existentes
**Como** Entrenador Personal  
**Quiero** Cambiar la fecha y hora de una reserva ya confirmada  
**Para** Adaptarme a imprevistos sin tener que cancelar y crear una nueva reserva

**Feature:** `src/features/reservas-online`

---

## US-RO-010: Notificación automática de reprogramación
**Como** Entrenador Personal  
**Quiero** Que cuando reprograme una sesión, el cliente reciba automáticamente una notificación con los nuevos datos  
**Para** Mantener una comunicación clara y evitar confusiones

**Feature:** `src/features/reservas-online`

---

## US-RO-011: Vista de calendario semanal
**Como** Entrenador Personal  
**Quiero** Ver todas mis reservas de la semana en una vista de calendario  
**Para** Tener una visión completa de mi agenda y planificar mejor mi tiempo

**Feature:** `src/features/reservas-online`

---

## US-RO-012: Vista de calendario mensual
**Como** Entrenador Personal  
**Quiero** Ver todas mis reservas del mes en una vista de calendario  
**Para** Planificar a largo plazo y ver patrones de ocupación

**Feature:** `src/features/reservas-online`

---

## US-RO-013: Arrastrar y soltar para reprogramar
**Como** Entrenador Personal  
**Quiero** Arrastrar una reserva desde una fecha/hora a otra en el calendario  
**Para** Reprogramar de forma visual y rápida sin formularios

**Feature:** `src/features/reservas-online`

---

## US-RO-014: Generar enlace de videollamada automático
**Como** Entrenador Personal  
**Quiero** Que las sesiones marcadas como "videollamada" generen automáticamente un enlace de reunión  
**Para** No tener que crear manualmente cada enlace y ahorrar tiempo

**Feature:** `src/features/reservas-online`

---

## US-RO-015: Configurar plataforma de videollamada
**Como** Entrenador Personal  
**Quiero** Configurar qué plataforma usar para videollamadas (Zoom, Google Meet, Microsoft Teams)  
**Para** Integrar mi herramienta preferida y que se generen enlaces automáticamente

**Feature:** `src/features/reservas-online`

---

## US-RO-016: Enviar enlace de videollamada en recordatorio
**Como** Entrenador Personal  
**Quiero** Que el recordatorio automático incluya el enlace de videollamada  
**Para** Que el cliente tenga acceso directo y no tenga que buscarlo

**Feature:** `src/features/reservas-online`

---

## US-RO-017: Añadir notas post-sesión
**Como** Entrenador Personal  
**Quiero** Añadir notas después de cada sesión sobre qué trabajamos, rendimiento del cliente y observaciones  
**Para** Llevar un seguimiento detallado del progreso de cada cliente

**Feature:** `src/features/reservas-online`

---

## US-RO-018: Ver historial de notas por cliente
**Como** Entrenador Personal  
**Quiero** Ver todas las notas de sesiones anteriores de un cliente específico  
**Para** Revisar su evolución y preparar mejor las próximas sesiones

**Feature:** `src/features/reservas-online`

---

## US-RO-021: Marcar reserva como pagada
**Como** Entrenador Personal  
**Quiero** Marcar manualmente una reserva como pagada cuando recibo pago en efectivo o transferencia  
**Para** Mantener mi control de pagos actualizado

**Feature:** `src/features/reservas-online`

---

## US-RO-022: Recordatorio de pago pendiente
**Como** Entrenador Personal  
**Quiero** Enviar recordatorios automáticos a clientes con pagos pendientes  
**Para** Reducir la morosidad y automatizar el cobro

**Feature:** `src/features/reservas-online`

---

## US-RO-023: Crear bonos de sesiones
**Como** Entrenador Personal  
**Quiero** Crear paquetes de múltiples sesiones con precio especial (ej: bono 10 sesiones)  
**Para** Fidelizar clientes y obtener pagos anticipados

**Feature:** `src/features/reservas-online`

---

## US-RO-024: Aplicar bonos en reservas
**Como** Entrenador Personal  
**Quiero** Que al crear una reserva se pueda aplicar un bono activo del cliente  
**Para** Descontar automáticamente del saldo de sesiones disponibles

**Feature:** `src/features/reservas-online`

---

## US-RO-025: Notificaciones por WhatsApp
**Como** Entrenador Personal  
**Quiero** Enviar recordatorios y confirmaciones por WhatsApp además de email  
**Para** Asegurar que el cliente reciba la información en su canal preferido

**Feature:** `src/features/reservas-online`

---

## US-RO-026: Confirmación de asistencia del cliente
**Como** Entrenador Personal  
**Quiero** Que el cliente pueda confirmar su asistencia desde el recordatorio  
**Para** Saber con antelación si va a venir y poder gestionar cancelaciones

**Feature:** `src/features/reservas-online`

---

## US-RO-027: Recordatorio también para el entrenador
**Como** Entrenador Personal  
**Quiero** Recibir yo también recordatorios de mis sesiones del día  
**Para** No olvidar ninguna cita y estar preparado

**Feature:** `src/features/reservas-online`

---

## US-RO-028: Marcar como "No Show"
**Como** Entrenador Personal  
**Quiero** Marcar una reserva como "No Show" cuando el cliente no se presenta  
**Para** Llevar un control de asistencia y aplicar políticas de penalización si corresponde

**Feature:** `src/features/reservas-online`

---

## US-RO-029: Marcar como "Completada"
**Como** Entrenador Personal  
**Quiero** Marcar automáticamente o manualmente una sesión como completada  
**Para** Diferenciar las sesiones realizadas de las pendientes en el historial

**Feature:** `src/features/reservas-online`

---

## US-RO-030: Política de cancelación
**Como** Entrenador Personal  
**Quiero** Configurar una política de cancelación (ej: mínimo 24h antes)  
**Para** Establecer reglas claras y evitar cancelaciones de último momento

**Feature:** `src/features/reservas-online`

---

## US-RO-031: Aplicar política de cancelación automáticamente
**Como** Entrenador Personal  
**Quiero** Que el sistema no permita cancelaciones fuera del plazo establecido  
**Para** Hacer cumplir mi política sin tener que discutir con clientes

**Feature:** `src/features/reservas-online`

---

## US-RO-032: Analytics de tasa de asistencia
**Como** Entrenador Personal  
**Quiero** Ver estadísticas de tasa de asistencia vs no-shows por cliente  
**Para** Identificar clientes problemáticos y tomar decisiones

**Feature:** `src/features/reservas-online`

---

## US-RO-033: Analytics de horarios más rentables
**Como** Entrenador Personal  
**Quiero** Ver qué horarios generan más ingresos  
**Para** Optimizar mi disponibilidad en franjas más demandadas

**Feature:** `src/features/reservas-online`

---

## US-RO-034: Analytics de ingresos por cliente
**Como** Entrenador Personal  
**Quiero** Ver cuánto ingreso genera cada cliente  
**Para** Identificar mis mejores clientes y darles atención especial

**Feature:** `src/features/reservas-online`

---

## US-RO-035: Filtrar historial por cliente
**Como** Entrenador Personal  
**Quiero** Filtrar el historial de reservas por cliente específico  
**Para** Ver rápidamente todas las sesiones de un cliente en particular

**Feature:** `src/features/reservas-online`

---

## US-RO-036: Filtrar historial por estado
**Como** Entrenador Personal  
**Quiero** Filtrar el historial por estado (confirmadas, canceladas, completadas, no-show)  
**Para** Analizar patrones y problemas específicos

**Feature:** `src/features/reservas-online`

---

## US-RO-037: Filtrar historial por rango de fechas
**Como** Entrenador Personal  
**Quiero** Filtrar el historial por rango de fechas personalizado  
**Para** Hacer análisis de períodos específicos

**Feature:** `src/features/reservas-online`

---

## US-RO-038: Exportar historial a Excel
**Como** Entrenador Personal  
**Quiero** Exportar mi historial de reservas a Excel  
**Para** Hacer análisis personalizados o presentarlos a mi gestoría

**Feature:** `src/features/reservas-online`

---

## US-RO-039: Buffer entre sesiones
**Como** Entrenador Personal  
**Quiero** Configurar un tiempo de buffer automático entre sesiones (ej: 15 min)  
**Para** Tener tiempo de descanso, limpieza o desplazamiento entre clientes

**Feature:** `src/features/reservas-online`

---

## US-RO-040: Tiempo mínimo de anticipación para reservar
**Como** Entrenador Personal  
**Quiero** Configurar un tiempo mínimo de anticipación para nuevas reservas (ej: 2 horas)  
**Para** Evitar reservas de último momento cuando no puedo prepararme adecuadamente

**Feature:** `src/features/reservas-online`

---

## US-RO-041: Límite de reservas futuras
**Como** Entrenador Personal  
**Quiero** Configurar hasta cuántos días en el futuro se puede reservar (ej: 30 días)  
**Para** No comprometer mi disponibilidad demasiado tiempo por adelantado

**Feature:** `src/features/reservas-online`

---

## US-RO-042: Notas del cliente visibles al crear reserva
**Como** Entrenador Personal  
**Quiero** Ver las notas previas del cliente al crear una nueva reserva  
**Para** Recordar aspectos importantes (lesiones, objetivos, preferencias)

**Feature:** `src/features/reservas-online`

---

## US-RO-043: Solicitar información al reservar
**Como** Entrenador Personal  
**Quiero** Que los clientes puedan añadir observaciones al reservar (objetivos de la sesión, molestias, etc)  
**Para** Preparar mejor cada sesión según sus necesidades específicas

**Feature:** `src/features/reservas-online`

---

## US-RO-044: Reservas recurrentes
**Como** Entrenador Personal  
**Quiero** Crear reservas recurrentes (ej: todos los lunes y miércoles a las 10h)  
**Para** Agilizar la creación de sesiones regulares con clientes habituales

**Feature:** `src/features/reservas-online`

---

## US-RO-045: Gestionar serie de reservas recurrentes
**Como** Entrenador Personal  
**Quiero** Poder cancelar o modificar toda una serie de reservas recurrentes a la vez  
**Para** Hacer cambios masivos sin tener que editar una por una

**Feature:** `src/features/reservas-online`

---

## US-RO-046: Vista de lista compacta del día
**Como** Entrenador Personal  
**Quiero** Ver una lista simple de todas las sesiones del día con hora, cliente y tipo  
**Para** Tener una referencia rápida de mi agenda diaria sin abrir calendario

**Feature:** `src/features/reservas-online`

---

## US-RO-047: Dashboard de próximas 24 horas
**Como** Entrenador Personal  
**Quiero** Ver un resumen destacado de las sesiones de las próximas 24 horas en la página principal  
**Para** Tener visibilidad inmediata de mi día sin navegar a reservas

**Feature:** `src/features/reservas-online`

---

## US-RO-048: Notificación de nueva reserva
**Como** Entrenador Personal  
**Quiero** Recibir una notificación instantánea cuando un cliente hace una nueva reserva  
**Para** Estar al tanto de cambios en mi agenda en tiempo real

**Feature:** `src/features/reservas-online`

---

## US-RO-049: Notificación de cancelación de cliente
**Como** Entrenador Personal  
**Quiero** Recibir una notificación cuando un cliente cancela una reserva  
**Para** Saber inmediatamente que tengo un hueco libre y poder ofrecerlo

**Feature:** `src/features/reservas-online`

---

## US-RO-050: Colores personalizados por tipo de sesión
**Como** Entrenador Personal  
**Quiero** Asignar colores diferentes a cada tipo de sesión en el calendario  
**Para** Identificar visualmente y rápidamente el tipo de entrenamiento

**Feature:** `src/features/reservas-online`

