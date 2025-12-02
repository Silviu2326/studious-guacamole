# User Stories - Gestión de Clientes para Entrenador Personal

## US-01: Directorio centralizado de clientes
**Como** Entrenador personal  
**Quiero** ver un listado centralizado de todos mis clientes  
**Para** acceder rápidamente a su información y tomar acciones desde un solo lugar  
**Descripción**: Vista principal con tabla filtrable por estado, plan activo, fecha de última sesión y nivel de riesgo.  
**Feature**: `src/features/gestión-de-clientes`

---

## US-02: Perfil 360º del cliente
**Como** Entrenador personal  
**Quiero** abrir el perfil completo de cada cliente con objetivos, historial y notas  
**Para** personalizar mis sesiones y retener mejor a cada persona  
**Descripción**: Al seleccionar un cliente se despliega su ficha 360º con datos de progreso, adherencia y comunicaciones previas.  
**Feature**: `src/features/gestión-de-clientes`

---

## US-03: Alta rápida de nuevos clientes
**Como** Entrenador personal  
**Quiero** registrar un nuevo cliente en pocos pasos desde la vista principal  
**Para** comenzar a llevar seguimiento desde la primera consulta o sesión  
**Descripción**: Botón "Crear Cliente" que abre modal con datos mínimos (nombre, contacto, objetivo principal, plan inicial) y validaciones básicas.  
**Feature**: `src/features/gestión-de-clientes`

---

## US-04: Registro de objetivos y planes personalizados
**Como** Entrenador personal  
**Quiero** definir objetivos concretos, plan de entrenamiento y plan nutricional por cliente  
**Para** medir avances y ajustar la propuesta según resultado y feedback  
**Descripción**: Sección editable con objetivos SMART, hitos, plan semanal y recordatorios asociados.  
**Feature**: `src/features/gestión-de-clientes`

---

## US-05: Seguimiento de adherencia y check-ins
**Como** Entrenador personal  
**Quiero** registrar check-ins, asistencia y feedback post-sesión  
**Para** detectar caídas de motivación y ajustar rutinas  
**Descripción**: Widgets en cada perfil para marcar asistencia, registrar esfuerzo percibido y notas después de cada sesión.  
**Feature**: `src/features/gestión-de-clientes`

---

## US-06: Alertas de clientes en riesgo
**Como** Entrenador personal  
**Quiero** recibir alertas cuando un cliente muestra señales de abandono  
**Para** intervenir a tiempo con mensajes, ajustes o incentivos  
**Descripción**: Indicadores automáticos basados en inasistencias, baja adherencia o falta de respuesta a mensajes.  
**Feature**: `src/features/gestión-de-clientes`

---

## US-07: Analytics de cartera personal
**Como** Entrenador personal  
**Quiero** ver métricas de retención, churn, progreso de objetivos y clientes activos  
**Para** evaluar la salud de mi cartera y priorizar acciones de fidelización  
**Descripción**: Panel de analytics con tarjetas clave, gráficos de evolución mensual y comparativas con metas personales.  
**Feature**: `src/features/gestión-de-clientes`

---

## US-08: Segmentación inteligente de clientes
**Como** Entrenador personal  
**Quiero** agrupar clientes por objetivos, nivel, adherencia o plan contratado  
**Para** enviar comunicaciones relevantes y preparar sesiones grupales personalizadas  
**Descripción**: Filtros avanzados y etiquetas que se guardan como segmentos reutilizables con conteos automáticos.  
**Feature**: `src/features/gestión-de-clientes`

---

## US-09: Historial de interacciones
**Como** Entrenador personal  
**Quiero** ver el historial de mensajes, sesiones y pagos de cada cliente  
**Para** comprender el contexto antes de cada contacto nuevo  
**Descripción**: Línea de tiempo dentro de la ficha 360º con eventos ordenados (sesiones realizadas, notas, emails enviados, cambios de plan).  
**Feature**: `src/features/gestión-de-clientes`

---

## US-10: Recordatorios automáticos de seguimiento
**Como** Entrenador personal  
**Quiero** recibir recordatorios cuando un cliente no asiste o no actualiza su progreso  
**Para** mantener la relación activa y evitar abandonos  
**Descripción**: Sistema de notificaciones que genera tareas o alertas tras X días sin check-in o sin actualización de objetivos.  
**Feature**: `src/features/gestión-de-clientes`

---

## US-11: Exportación de datos de clientes
**Como** Entrenador personal  
**Quiero** exportar la información de mis clientes y sus métricas  
**Para** analizarla en otras herramientas o compartirla con especialistas externos  
**Descripción**: Acción de exportación que respeta filtros activos y genera archivos CSV/PDF con resumen por cliente.  
**Feature**: `src/features/gestión-de-clientes`

---

## US-12: Mensajes motivacionales automatizados
**Como** Entrenador personal  
**Quiero** programar mensajes motivacionales o tips cuando un cliente alcanza hitos  
**Para** reforzar la constancia y la satisfacción del cliente  
**Descripción**: Reglas configurables que disparan emails o notificaciones cuando el cliente completa X sesiones o cumple un objetivo parcial.  
**Feature**: `src/features/gestión-de-clientes`

---

## US-13: Detección de clientes inactivos
**Como** Entrenador personal  
**Quiero** identificar clientes que llevan semanas sin actividad  
**Para** reactivarlos con mensajes personalizados o cambios de plan  
**Descripción**: Indicadores visuales y filtros que resaltan clientes sin check-ins o feedback en un periodo configurable.  
**Feature**: `src/features/gestión-de-clientes`

---

## US-14: Notas post-sesión estructuradas
**Como** Entrenador personal  
**Quiero** registrar notas estructuradas después de cada sesión  
**Para** recordar ajustes, lesiones, reacciones o acuerdos para la siguiente cita  
**Descripción**: Campo de notas con plantillas editables, etiquetas (nutrición, lesión, motivación) y registro de fecha para consulta rápida.  
**Feature**: `src/features/gestión-de-clientes`

---
