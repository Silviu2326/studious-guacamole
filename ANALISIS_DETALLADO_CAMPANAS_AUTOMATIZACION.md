# Documentación Técnica Completa: Mission Control (Campañas y Automatización)

**Versión del Documento:** 2.0
**Módulo:** `src/features/CampanasAutomatizacion`
**Rol:** Sistema Central de Operaciones de Marketing y Retención (CRM Omnicanal)

Este documento proporciona una descripción exhaustiva, técnica y funcional del módulo "Mission Control". Este sistema no es solo un gestor de campañas, sino un **motor de decisiones inteligente** que orquesta la comunicación cliente-negocio a través de múltiples canales, impulsado por IA y análisis de datos en tiempo real.

---

## 1. Arquitectura y Dashboard Principal

El punto de entrada (`CampanasAutomatizacionPage.tsx`) integra múltiples sub-sistemas en una interfaz de pestañas ("Tabs") para organizar la complejidad operativa.

### 1.1. Resumen Ejecutivo (`SummaryGrid`)
**Funcionalidad:** Proporciona una visión inmediata de la salud operativa del marketing.
*   **Métricas Rastreadas:**
    *   **Mensajes Enviados:** Volumen total en ventana de tiempo (30 días por defecto).
    *   **Tasa de Respuesta:** % de clientes que interactúan (foco en canales bidireccionales como WhatsApp).
    *   **Recordatorios Activos:** Carga de trabajo actual del sistema de notificaciones.
    *   **Comunicación Pendiente:** Cola de tareas manuales o fallidas que requieren atención humana.
*   **Lógica de Tendencias:** Calcula delta porcentual vs. periodo anterior y asigna dirección (`up`, `down`, `neutral`) con codificación de colores semántica (Verde/Rojo/Gris) para interpretación rápida.

### 1.2. Analítica de Impacto (`ActionableKPIs`)
**Funcionalidad:** Traduce métricas vanidad (opens/clicks) en métricas de negocio (reservas/dinero).
*   **Atribución:**
    *   **Mensaje -> Reserva:** Rastrea si un usuario reservó una sesión dentro de una ventana de atribución (ej. 24h) tras recibir un mensaje.
    *   **Mensaje -> Venta:** Rastrea conversiones monetarias directas (ej. renovación de plan tras recordatorio).
*   **Cálculo de ROI:** Monitoriza el `Revenue Per Message` para identificar qué canales son más rentables.
*   **Insights Automáticos:** Genera alertas de texto plano (ej. "El canal SMS tiene un costo alto con baja conversión, considera cambiar a WhatsApp").

### 1.3. Salud de Canales (`ChannelHealth`)
**Funcionalidad:** Monitorización de infraestructura y calidad de envío.
*   **Deliverability:** Detección de correos rebotados o números bloqueados.
*   **Engagement Score:** Puntuación compuesta de aperturas + respuestas.
*   **Coverage:** % de la base de datos alcanzable por cada canal.
*   **Gestión de Incidentes:** Alerta sobre problemas técnicos (ej. "Caída de API WhatsApp", "IP en lista negra").

---

## 2. Motor de Campañas (Outbound Marketing)

### 2.1. Campañas Omnicanal (`MultiChannelCampaigns`)
**Funcionalidad:** Orquestador de campañas complejas que abarcan múltiples puntos de contacto.
*   **Máquina de Estados:** `Borrador` -> `Programada` -> `En Marcha` -> `Pausada` -> `Finalizada`.
*   **Gestión Financiera:** Control de presupuesto (`Budget`) vs. Gasto real (`Spend`) y Retorno (`Revenue`).
*   **Segmentación Cruzada:** Permite seleccionar múltiples segmentos de audiencia (ej. "Clientes VIP" + "Riesgo de Churn").
*   **Barra de Progreso:** Visualización en tiempo real del % de envíos completados.

### 2.2. Campañas Promocionales (`PromotionalCampaigns`)
**Funcionalidad:** Herramienta táctica para ofertas "Flash" o estacionales.
*   **Destinatarios Dinámicos:**
    *   *All:* Broadcast general.
    *   *Segment:* Basado en reglas predefinidas.
    *   *Inactive:* Filtro automático de "sin actividad en X días".
    *   *Custom:* Selección manual de IDs.
*   **Biblioteca de Plantillas Especializadas:** Acceso a `SpecializedTemplates` (ej. "Reto 30 días") que incluyen copy, estructura y sugerencias de assets visuales.
*   **Tracking Específico:** Métricas aisladas por campaña para medir el éxito de una oferta concreta.

### 2.3. Editor de Newsletters & Highlights (`NewsletterEditor`)
**Funcionalidad:** Sistema de gestión de boletines informativos con fuerte apoyo de IA.
*   **Generador de Highlights (IA):**
    *   Recopila automáticamente "hitos" de la semana (ej. "Cliente X bajó 5kg", "Nueva clase de Yoga añadida").
    *   La IA redacta el cuerpo del correo combinando estos hitos en una narrativa coherente.
*   **Gestión de Frecuencia:** Soporta envíos `Weekly`, `Biweekly`, `Monthly` o `Custom`.
*   **Métricas de Contenido:** Análisis de qué enlaces o secciones tuvieron más clics (`Top Links`).

### 2.4. Programas de Email (`EmailPrograms`)
**Funcionalidad:** Contenedores para estrategias de email a largo plazo.
*   **Tipos de Programa:** Onboarding, Nurturing, Reactivación, Product Updates.
*   **Optimización Continua:** El sistema sugiere el "Mejor Asunto" basándose en tasas de apertura históricas (A/B testing implícito).

---

## 3. Automatización de Ciclo de Vida (Lifecycle Automation)

Este es el núcleo "inteligente" que reacciona al comportamiento del usuario.

### 3.1. Constructor de Secuencias Multi-Paso (`MultiStepSequenceBuilder`)
**Funcionalidad:** Editor visual/lógico para crear flujos de trabajo complejos ("Journeys").
*   **Triggers (Disparadores):**
    *   `new-client`: Al registrarse.
    *   `first-session-booked`: Al agendar.
    *   `inactivity`: Tras X días sin eventos.
    *   `custom-event`: Eventos arbitrarios del sistema.
*   **Lógica Condicional (`ConditionalRules`):**
    *   *IF* (Responde al mensaje anterior) *THEN* (Saltar paso de recordatorio).
    *   *IF* (Agenda sesión) *THEN* (Finalizar secuencia de venta).
*   **Delays:** Esperas configurables en minutos, horas o días entre pasos.

### 3.2. Automatización de Mensajería Crítica (`MessagingAutomations`)
**Funcionalidad:** Gestión de mensajes transaccionales de alto valor (SMS/WhatsApp).
*   **SLA Monitor:** Monitoriza el tiempo de entrega y respuesta.
*   **Fallbacks:** (Lógica implícita) Si falla WhatsApp, intentar SMS.

### 3.3. Protocolos Específicos de Automatización
El sistema incluye lógica pre-programada ("hard-coded logic blocks") para escenarios comunes de gimnasios/entrenadores:

1.  **Secuencias de Bienvenida (`WelcomeSequences`):**
    *   **Día 1:** Bienvenida calurosa + Onboarding.
    *   **Día 2:** Educación ("Qué esperar").
    *   **Día 3:** Logística ("Qué traer a tu primera sesión").
    *   *KPI:* Tasa de finalización del onboarding.

2.  **Gestión de Ausencias (`AbsenceAutomations`):**
    *   **Trigger:** `session-missed` (No-show).
    *   **Escalada de Tono:**
        *   *1ra falta:* Tono "Friendly" (¿Todo bien?).
        *   *2da falta:* Tono "Concerned" (Nos preocupamos por tu progreso).
        *   *3ra falta:* Tono "Urgent" (Riesgo de perder el hábito/dinero).

3.  **Recuperación de Inactividad (`InactivityAutomations`):**
    *   **Lógica Progresiva:** Motivación -> Oferta Especial -> Invitación directa a llamada.
    *   **Smart Pause:** Se detiene automáticamente si el cliente reserva o responde.

4.  **Recordatorios de Pago (`PaymentReminderAutomations`):**
    *   **Escalada:** Aviso preventivo -> Aviso de vencimiento -> Aviso de mora (con tono urgente).
    *   **Recuperación:** Mide el % de pagos realizados tras el envío.

5.  **Fechas Importantes (`ImportantDateAutomations`):**
    *   Cumpleaños, Aniversarios de cliente (ej. "1 año entrenando").
    *   **Ofertas Dinámicas:** Puede inyectar códigos de descuento automáticamente.

---

## 4. Inteligencia Artificial Aplicada (AI Layer)

El módulo integra IA no como un añadido, sino como un motor central de optimización.

### 4.1. Generador de Campañas 360 (`Campaign360AIGenerator`)
**Funcionalidad:** Crea una estrategia omnicanal completa a partir de un simple objetivo.
*   **Input:** Objetivo (ej. "Llenar clases de la mañana"), Audiencia.
*   **Output IA:**
    *   Copy para Email (Asunto + Cuerpo).
    *   Script para WhatsApp.
    *   Script para DM de Instagram.
    *   Cronograma sugerido (Timeline).

### 4.2. Mapas de Calor de Envío (`AIHeatMapSendingSchedules`)
**Funcionalidad:** Optimización predictiva de tiempos de envío.
*   **Análisis:** Procesa históricos de apertura/respuesta de *todos* los clientes.
*   **Visualización:** Matriz Día/Hora con código de colores (Verde=Óptimo, Rojo=Evitar).
*   **Scoring:** Asigna un puntaje (0-100) a cada slot horario.

### 4.3. Biblioteca de Mensajes Inteligente (`AIMessageLibrary`)
**Funcionalidad:** Repositorio de copys generados y validados.
*   **Segmentación por Objetivo:** Venta, Inspiración, Seguimiento.
*   **Adaptación de Tono:** Ajusta el mensaje según el "Perfil Estratégico" del entrenador (ej. Autoritario vs. Empático).
*   **Learning:** Rastrea la `SuccessRate` de cada plantilla.

### 4.4. Prompts Rápidos de WhatsApp (`QuickWhatsAppPrompts`)
**Funcionalidad:** Asistente para comunicación manual rápida.
*   **Voice Note Scripts:** La IA genera guiones para notas de voz, que humanizan la relación. Sugiere duración y tono.
*   **Contexto:** Sugiere prompts basados en la situación (ej. "Cliente no contesta hace 3 días").

### 4.5. Detección de Gaps (`JourneyGapDetector`)
**Funcionalidad:** Auditoría automática de la estrategia de comunicación.
*   **Análisis:** Escanea los flujos activos.
*   **Detección:** Identifica huecos lógicos (ej. "Falta mensaje post-compra", "No hay seguimiento a los 30 días").
*   **Auto-Fill:** Propone crear la automatización faltante con un clic.

### 4.6. Detector de Saturación (`MessageSaturationDetector`)
**Funcionalidad:** Prevención de "burnout" de la audiencia.
*   **Lógica:** Monitoriza la frecuencia de mensajes por cliente/semana.
*   **Alertas:** Notifica si se supera el umbral crítico (ej. >3 mensajes/día).
*   **Pausas Inteligentes:** Sugiere pausar campañas no críticas para segmentos saturados.

### 4.7. Recomendador de Éxito (`SuccessfulCampaignsRecommender`)
**Funcionalidad:** Aprendizaje por refuerzo simplificado.
*   **Análisis:** Identifica campañas pasadas con alto ROI/Conversión.
*   **Acción:** Sugiere clonar o repetir estas campañas ("Esta campaña funcionó muy bien hace 3 meses, ¿repetir?").

---

## 5. Gestión de Audiencias y Datos

### 5.1. Segmentación Avanzada (`ClientSegmentation`)
**Funcionalidad:** Motor de creación de audiencias.
*   **Criterios:** Combinación de lógica AND/OR sobre datos demográficos, comportamiento (asistencia), estado de pago y plan.
*   **Segmentos Inteligentes (`IntelligentSegmentBuilder`):**
    *   Basados en **Progreso Físico** (ej. "Clientes que han mejorado fuerza un 10%").
    *   Basados en **NPS/Feedback** (ej. "Promotores" para pedir referidos).
*   **Auto-Update:** Reglas para mover clientes entre segmentos automáticamente (ej. Si NPS < 6 -> Mover a "Riesgo").

### 5.2. Triggers de Acción (`ClientActionTriggers`)
**Funcionalidad:** "Escucha" eventos del sistema en tiempo real.
*   **Eventos Soportados:** Reserva, Cancelación, Pago, Renovación, Logro de Objetivo.
*   **Reacción:** Dispara un mensaje inmediato o inicia una secuencia.

### 5.3. Integración con Reservas (`ReservationsIntegration`)
**Funcionalidad:** Puente entre el calendario y el marketing.
*   **Sincronización Bidireccional:** Escucha cambios en el calendario (ej. reagendamiento) para detener/iniciar recordatorios.
*   **Lógica de Conflictos:** Evita enviar recordatorios si la sesión se canceló.

### 5.4. Horarios Preferidos (`PreferredSendingSchedules`)
**Funcionalidad:** Respeto por la disponibilidad del cliente.
*   **Configuración:** Ventanas de tiempo permitidas por cliente o grupo (ej. "Solo mañanas", "No fines de semana").
*   **Encolado:** Si un mensaje se dispara fuera de hora, se encola hasta la siguiente ventana válida.

---

## 6. Operaciones y Colaboración

### 6.1. Panel Centralizado (`AutomationsCentralPanel`)
**Funcionalidad:** Vista de pájaro para el operador.
*   **Control Global:** Pausar/Reanudar todo el sistema (botón de pánico).
*   **Cola de Envíos:** Ver qué va a salir en las próximas horas.

### 6.2. Asignación de Tareas (`TeamTaskAssignment`)
**Funcionalidad:** Flujo de trabajo colaborativo.
*   **Roles:** Copywriter, Diseñador, Community Manager.
*   **Flujo:** Asignar tarea -> Revisión -> Aprobación -> Integración en campaña.

### 6.3. Aprobación Móvil (`MobileCampaignApproval`)
**Funcionalidad:** Gestión "on-the-go" para dueños de negocio.
*   **Interfaz Simplificada:** Tarjetas de aprobación rápida ("Tinder style" o lista simple) para revisar copy/arte antes del envío.

### 6.4. Alertas de Mensajes (`MessageAlerts`)
**Funcionalidad:** Red de seguridad para asegurar atención al cliente.
*   **Lógica:** Si un mensaje importante (ej. "Quiero cancelar") no se abre/responde en X horas -> Alerta al staff.
*   **Priorización:** Clasifica alertas como Urgente, Alta, Media, Baja.

### 6.5. Respuestas Fuera de Horario (`AfterHoursAutoReply`)
**Funcionalidad:** Bot de gestión de expectativas.
*   **Horarios:** Configuración de horas laborales.
*   **Respuesta:** Si entra mensaje fuera de hora -> Auto-reply con hora estimada de respuesta humana.

---

## 7. Reportes y Salida de Datos

### 7.1. Exportador de Reportes (`ReportExporter`)
**Funcionalidad:** Generación de entregables formales.
*   **Formatos:** PDF, Excel, CSV.
*   **Contenido:** Métricas de comunicación, efectividad de automatización, comparativa de periodos.

### 7.2. Exportador de Playbooks (`AIPlaybookExporter`)
**Funcionalidad:** Empaquetado de propiedad intelectual (Estrategia).
*   **Concepto:** Permite guardar una estrategia exitosa (ej. "Campaña Black Friday") como un "Playbook" (JSON/PDF).
*   **Uso:** Replicar en otras sucursales o vender la estrategia.

---

## Resumen de Capacidades Técnicas

1.  **Omnicanalidad Real:** Abstracción de canales (el sistema decide o sugiere el mejor canal).
2.  **Event-Driven:** Arquitectura reactiva basada en eventos del cliente (triggers).
3.  **AI-First:** La IA no es un plugin, está en la generación, optimización (horarios), análisis (gaps/saturación) y operación (respuestas).
4.  **Ciclo Cerrado:** Mide el impacto final en ventas/reservas, no solo en clics.
5.  **Seguridad Operativa:** Mecanismos de saturación, horarios preferidos y validación humana (aprobación móvil) para evitar errores costosos.