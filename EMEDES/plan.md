
## 3. USER STORIES

### 📥 INBOX & CONVERSACIONES

**US-01**: Como Entrenador personal, Quiero responder mensajes de Instagram y WhatsApp desde una sola pantalla, Para no perder tiempo cambiando entre apps y responder más rápido a mis leads.
**Feature**: `src/features/LeadInboxUnificadoYSla`
**Descripción**: Integración real con APIs de Instagram Direct y WhatsApp Business para ver y responder conversaciones sin salir de la plataforma. Incluye envío de mensajes, fotos y audios.

**US-02**: Como Entrenador personal, Quiero tener plantillas de respuestas rápidas (FAQs, precios, horarios), Para responder más rápido las preguntas frecuentes y ser más eficiente.
**Feature**: `src/features/LeadInboxUnificadoYSla`
**Descripción**: Sistema de plantillas personalizables con variables (nombre del lead, servicio, precio). Acceso rápido mediante shortcut o menú desplegable. Editar antes de enviar.

**US-03**: Como Entrenador personal, Quiero ver claramente qué leads llevo más de 24 horas sin responder, Para priorizar y no perder oportunidades de venta.
**Feature**: `src/features/LeadInboxUnificadoYSla`
**Descripción**: Destacar visualmente (color rojo/naranja) los leads sin respuesta en 24h. Ordenar automáticamente por urgencia. Notificación push si pasan más de 8 horas.

**US-04**: Como Entrenador personal, Quiero etiquetar cada lead según su objetivo (pérdida de peso, ganar músculo, nutrición), Para personalizar mejor mi seguimiento y entender qué buscan.
**Feature**: `src/features/leads`
**Descripción**: Sistema de etiquetas predefinidas y personalizables. Aplicar múltiples etiquetas. Filtrar y agrupar por etiquetas. Mostrar etiquetas en tarjeta de lead.

**US-05**: Como Entrenador personal, Quiero ver si el lead ha leído mi último mensaje, Para saber si debo insistir o esperar su respuesta.
**Feature**: `src/features/LeadInboxUnificadoYSla`
**Descripción**: Indicador visual de "visto/leído" sincronizado con WhatsApp e Instagram. Timestamp de cuándo vio el mensaje.

**US-06**: Como Entrenador personal, Quiero programar recordatorios para hacer seguimiento a cada lead, Para no olvidarme de contactar a nadie y mantener la comunicación activa.
**Feature**: `src/features/leads`
**Descripción**: Botón de "Recordarme en X días/horas" en cada lead. Notificación cuando llega el recordatorio. Opción de posponer. Lista de recordatorios pendientes.


**US-08**: Como Entrenador personal, Quiero ver el historial completo de interacciones con cada lead (mensajes, llamadas, reuniones), Para recordar rápidamente de qué hablamos y continuar la conversación naturalmente.
**Feature**: `src/features/leads`
**Descripción**: Timeline unificado por lead mostrando: mensajes, llamadas, notas, cambios de etapa. Scroll infinito con fechas. Agregar notas manuales.

**US-09**: Como Entrenador personal, Quiero recibir notificaciones cuando un lead responde, Para contestar rápido y no perder momentum en la conversación.
**Feature**: `src/features/LeadInboxUnificadoYSla`
**Descripción**: Notificaciones push y de escritorio cuando llega mensaje. Sonido distintivo. Opción de silenciar por horario (noche/fines de semana).

**US-10**: Como Entrenador personal, Quiero ver estadísticas simples de mis tiempos de respuesta, Para mejorar mi velocidad de atención.
**Feature**: `src/features/LeadInboxUnificadoYSla`
**Descripción**: Métrica clara: "Respondes en promedio en X horas". Comparativa semanal. Meta visual (ej: "Responder en menos de 2 horas").

---

### 📊 PIPELINE & PROCESO DE VENTA

**US-11**: Como Entrenador personal, Quiero ver mis leads en un tablero visual con etapas simples (Contacto nuevo → Primera charla → Enviado precio → Llamada → Cliente/Descartado), Para saber rápidamente en qué estado está cada persona.
**Feature**: `src/features/pipeline-de-venta-kanban`
**Descripción**: Kanban con 5 columnas predefinidas. Drag & drop entre columnas. Contador de leads por columna. Vista compacta y clara.

**US-12**: Como Entrenador personal, Quiero mover un lead de una etapa a otra con un click, Para actualizar rápidamente el estado sin perder tiempo.
**Feature**: `src/features/pipeline-de-venta-kanban`
**Descripción**: Arrastrar y soltar entre columnas. Acciones rápidas desde tarjeta. Confirmación opcional para evitar errores. Historial de movimientos.

**US-13**: Como Entrenador personal, Quiero ver en cada tarjeta qué servicio quiere el lead (1:1, plan online, nutrición), Para preparar mejor la conversación y la oferta.
**Feature**: `src/features/pipeline-de-venta-kanban`
**Descripción**: Badge visual mostrando tipo de servicio. Selector rápido para cambiar. Precio sugerido según servicio. Filtro por tipo de servicio.

**US-14**: Como Entrenador personal, Quiero ver cuántos días llevo sin contactar a cada lead, Para priorizar seguimientos y no dejar leads olvidados.
**Feature**: `src/features/pipeline-de-venta-kanban`
**Descripción**: Contador visible "Hace X días" en cada tarjeta. Color de alerta (verde/amarillo/rojo). Ordenar por días sin contacto.

**US-15**: Como Entrenador personal, Quiero que el sistema me avise automáticamente si llevo más de 3 días sin hablar con un lead activo, Para no perder ventas por falta de seguimiento.
**Feature**: `src/features/pipeline-de-venta-kanban`
**Descripción**: Notificación automática a los 3 días. Sugerencia de mensaje de seguimiento. Opción de posponer o descartar lead.

**US-16**: Como Entrenador personal, Quiero agendar una llamada o reunión con un lead directamente desde su tarjeta, Para organizar mejor mi tiempo y no olvidar citas.
**Feature**: `src/features/pipeline-de-venta-kanban`
**Descripción**: Botón "Agendar llamada" en tarjeta. Selector de fecha/hora. Sincronización con calendario. Recordatorio antes de la cita.

**US-17**: Como Entrenador personal, Quiero enviar rápidamente mi lista de precios con un botón, Para no tener que escribir todo cada vez.
**Feature**: `src/features/pipeline-de-venta-kanban`
**Descripción**: Botón "Enviar precios" con plantilla predefinida. Personalizar antes de enviar. Registro de cuándo se enviaron. Plantilla por tipo de servicio.

**US-18**: Como Entrenador personal, Quiero usar una calculadora rápida de precios según el servicio, Para responder dudas de costo al instante.
**Feature**: `src/features/pipeline-de-venta-kanban`
**Descripción**: Modal con calculadora por servicio (sesiones/mes, plan nutri, combos). Descuentos por paquetes. Copiar precio formateado. Enviar directamente al lead.

**US-19**: Como Entrenador personal, Quiero ver mis métricas de conversión de forma simple (cuántos leads tuve, cuántos convertí), Para entender si estoy mejorando.
**Feature**: `src/features/pipeline-de-venta-kanban`
**Descripción**: Dashboard simple: X leads → Y clientes = Z% conversión. Comparativa mes anterior. Gráfico de tendencia. Objetivo configurable.

**US-20**: Como Entrenador personal, Quiero marcar por qué descarto un lead (muy caro, no hay química, ghosting), Para aprender qué objeciones son más comunes y mejorar.
**Feature**: `src/features/pipeline-de-venta-kanban`
**Descripción**: Al mover a "Descartado", pedir motivo. Lista predefinida + opción custom. Estadísticas de motivos. Insights de mejora.

**US-21**: Como Entrenador personal, Quiero que los leads más "calientes" (con más interacción reciente) aparezcan arriba, Para enfocarme en los que tienen más probabilidad de comprar.
**Feature**: `src/features/pipeline-de-venta-kanban`
**Descripción**: Ordenamiento automático por score de engagement. Indicador visual de "temperatura" (frío/tibio/caliente). Algoritmo basado en: mensajes recientes, respuestas rápidas, interés mostrado.

**US-22**: Como Entrenador personal, Quiero agregar notas privadas a cada lead, Para recordar detalles importantes de las conversaciones.
**Feature**: `src/features/leads`
**Descripción**: Sección de notas en tarjeta del lead. Markdown simple. Timestamp de notas. Búsqueda dentro de notas.

**US-23**: Como Entrenador personal, Quiero ver desde mi celular el pipeline de forma clara y gestionar leads fácilmente, Para trabajar en cualquier lugar sin depender del computador.
**Feature**: `src/features/pipeline-de-venta-kanban`
**Descripción**: Vista móvil optimizada. Gestos touch para mover leads. Cards compactas. Actions rápidas con swipe.

**US-24**: Como Entrenador personal, Quiero ver cuánto dinero potencial tengo en el pipeline, Para motivarme y proyectar mis ingresos.
**Feature**: `src/features/pipeline-de-venta-kanban`
**Descripción**: Suma total del valor de todos los leads activos. Desglose por etapa. Indicador de valor promedio por lead. Proyección de cierre.

**US-25**: Como Entrenador personal, Quiero exportar mi lista de leads fácilmente, Para tener un respaldo o usar en otras herramientas.
**Feature**: `src/features/leads`
**Descripción**: Botón de exportar a CSV/Excel. Incluir: nombre, contacto, etapa, notas, servicio. Filtros antes de exportar.

---

### 🔗 INTEGRACIÓN INBOX + PIPELINE

**US-26**: Como Entrenador personal, Quiero que al responder un mensaje desde el inbox, se actualice automáticamente la fecha de último contacto en el pipeline, Para no tener que actualizar manualmente en dos lugares.
**Feature**: `src/features/transformacion-leads`
**Descripción**: Sincronización automática bidireccional. Timestamp actualizado. Registro en timeline del lead.

**US-27**: Como Entrenador personal, Quiero crear un nuevo lead desde el inbox y que aparezca automáticamente en la primera columna del pipeline, Para tener todo integrado sin duplicar trabajo.
**Feature**: `src/features/transformacion-leads`
**Descripción**: Botón "Nuevo lead" en inbox. Formulario simple. Aparece automáticamente en "Contacto nuevo". Link bidireccional inbox ↔ pipeline.

**US-28**: Como Entrenador personal, Quiero acceder rápidamente a la conversación de un lead desde su tarjeta en el pipeline, Para ver el contexto completo sin buscar.
**Feature**: `src/features/transformacion-leads`
**Descripción**: Botón "Ver conversación" en tarjeta. Abre modal o panel lateral con historial completo. Responder directo desde ahí.

**US-29**: Como Entrenador personal, Quiero que cuando un lead no responde en 48 horas, se marque visualmente tanto en inbox como en pipeline, Para identificar rápidamente quién necesita seguimiento.
**Feature**: `src/features/transformacion-leads`
**Descripción**: Badge/indicador visual sincronizado. Color distintivo. Filtro "Sin respuesta +48h". Contador de horas.

**US-30**: Como Entrenador personal, Quiero ver las últimas 2-3 conversaciones de cada lead directamente en su tarjeta del pipeline, Para recordar rápido de qué hablamos sin abrir todo el historial.
**Feature**: `src/features/transformacion-leads`
**Descripción**: Preview de últimos mensajes en tarjeta expandible. Hover para ver más. Indicador de quién envió cada mensaje.

---