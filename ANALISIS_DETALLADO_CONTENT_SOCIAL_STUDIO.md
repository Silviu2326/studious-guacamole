# 📘 Documentación Maestra: Content & Social Studio

> **Versión:** 2.0 (Exhaustiva)
> **Módulo:** `@src\features\ContentSocialStudio`
> **Propósito:** Sistema Operativo Central para la estrategia de contenidos, integrando planificación, producción con IA, gestión de equipos y analítica de negocio.

---

## 📑 Índice de Contenidos

1.  [Visión General y Arquitectura](#1-visión-general-y-arquitectura)
2.  [Módulo de Planificación Estratégica](#2-módulo-de-planificación-estratégica)
    *   [Weekly AI Calendar](#21-weekly-ai-calendar-calendario-semanal-ia)
    *   [Calendar Gap Detection](#22-calendar-gap-detection-detección-de-huecos)
    *   [Launch Orchestrator](#23-launch-orchestrator-orquestador-de-lanzamientos)
3.  [Motor de Generación con IA (AI Content Engine)](#3-motor-de-generación-con-ia-ai-content-engine)
    *   [Video Script Generator](#31-video-script-generator)
    *   [Client Transformation Generator](#32-client-transformation-generator)
    *   [FAQ Content Generator](#33-faq-content-generator)
    *   [Promotional Content Templates](#34-promotional-content-templates)
    *   [Internal Content Ideas](#35-internal-content-ideas)
    *   [AI Content Workbench](#36-ai-content-workbench)
4.  [Gestión de Identidad y Marca](#4-gestión-de-identidad-y-marca)
    *   [Brand Kit Generator](#41-brand-kit-generator)
    *   [Creative Voice Config](#42-creative-voice-config-voz-creativa)
    *   [Trainer Niches Config](#43-trainer-niches-config-configuración-de-nichos)
    *   [Star Formats Config](#44-star-formats-config)
5.  [Flujos de Trabajo y Equipo](#5-flujos-de-trabajo-y-equipo)
    *   [Content Team Assignment](#51-content-team-assignment-asignación-de-tareas)
    *   [Mobile Content Approval](#52-mobile-content-approval-aprobación-móvil)
    *   [Content Recycling](#53-content-recycling-reciclaje-de-contenido)
6.  [Inteligencia y Analítica Avanzada](#6-inteligencia-y-analítica-avanzada)
    *   [Content Lead Analytics](#61-content-lead-analytics)
    *   [Saturated Topics Detector](#62-saturated-topics-detector)
    *   [Visual Style Learning](#63-visual-style-learning)
    *   [Content AI Feedback](#64-content-ai-feedback)
    *   [Post-Campaign Insights](#65-post-campaign-insights)
7.  [Integraciones del Ecosistema](#7-integraciones-del-ecosistema)

---

## 1. Visión General y Arquitectura

El **Content & Social Studio** no es un simple calendario; es un **ecosistema "Business-Aware"**. A diferencia de herramientas genéricas, este módulo entiende el negocio del entrenador: sabe qué servicios vende, quiénes son sus clientes, cuál es su tasa de conversión y cómo es su tono de voz.

### Arquitectura de Datos
El sistema se alimenta de múltiples fuentes internas:
*   **CRM:** Para conocer el progreso de los clientes y generar testimonios.
*   **Ventas:** Para analizar qué contenido genera ingresos reales.
*   **Inbox:** Para detectar preguntas frecuentes y generar contenido educativo.
*   **Configuración:** Para adaptar la IA a la voz y nichos del entrenador.

---

## 2. Módulo de Planificación Estratégica

### 2.1. Weekly AI Calendar (Calendario Semanal IA)
**Archivo:** `api/weeklyAICalendar.ts`, `components/WeeklyAICalendar.tsx`

Genera una parrilla de contenido completa para 7 días con un solo clic, asegurando variedad temática y estratégica.

*   **Funcionalidad:**
    *   Genera **7 posts** (uno por día) distribuidos estratégicamente.
    *   Rota automáticamente entre los **Nichos Principales** configurados (ej. Lunes: Ejecutivos, Martes: Postparto).
    *   Mezcla formatos (Reel, Carrusel, Post) y plataformas.
*   **Componentes del Post Generado:**
    *   **Hook (Gancho):** Frase inicial para captar atención.
    *   **Copy:** Cuerpo del mensaje desarrollado.
    *   **CTA (Call to Action):** Llamada a la acción clara.
    *   **Audiovisual Hook:** Sugerencia visual específica para el video/imagen.
    *   **Hashtags:** Selección inteligente basada en el nicho.
*   **Lógica de Negocio:**
    *   Utiliza plantillas predefinidas por nicho para asegurar relevancia.
    *   Permite regenerar la semana completa o editar posts individuales antes de enviarlos al Planner.

### 2.2. Calendar Gap Detection (Detección de Huecos)
**Archivo:** `api/calendarGaps.ts`, `components/CalendarGapAlerts.tsx`

Un sistema proactivo que vigila la agenda para evitar la inconsistencia, el enemigo #1 del crecimiento orgánico.

*   **Análisis Automático:**
    *   Detecta días sin publicaciones (basado en `minPostsPerDay`).
    *   Identifica huecos entre "Horas Óptimas" de publicación.
    *   Analiza los próximos 14 días.
*   **Tipos de Alertas:**
    *   **High Priority:** Días vacíos o huecos muy largos (>24h).
    *   **Medium Priority:** Baja cobertura en días clave.
    *   **Imbalance:** Desequilibrio en tipos de contenido (ej. solo ventas, nada de valor).
*   **Acción "Rellenar con IA":**
    *   Botón mágico para generar contenido instantáneo para ese hueco específico.
    *   La IA sugiere el formato y tema óptimo según la hora del día (ej. Mañana -> Educativo, Mediodía -> Motivacional).

### 2.3. Launch Orchestrator (Orquestador de Lanzamientos)
**Archivo:** `api/launchOrchestration.ts`, `components/LaunchOrchestrator.tsx`

Herramienta avanzada para coordinar campañas de venta complejas (retos, nuevos programas).

*   **Estructura de Fases:**
    1.  **Teasing (Expectativa):** Genera curiosidad antes del anuncio.
    2.  **Apertura (Venta):** Anuncio oficial, apertura de carrito/plazas.
    3.  **Cierre (Urgencia):** Últimas horas, escasez.
*   **Integración:**
    *   Se vincula directamente con un **Funnel** (Landing Page) y una **Campaña** de marketing.
*   **Gestión de Contenido:**
    *   Permite visualizar y programar contenido específico para cada fase en una línea de tiempo.
    *   Asegura que la narrativa de venta sea coherente durante todo el periodo.

---

## 3. Motor de Generación con IA (AI Content Engine)

### 3.1. Video Script Generator
**Archivo:** `api/videoScripts.ts`, `components/VideoScriptGenerator.tsx`

Elimina el miedo a la cámara proporcionando guiones estructurados.

*   **Estilos de Comunicación:**
    *   **Energético:** Ritmo rápido, cortes frecuentes, alto entusiasmo.
    *   **Calmado:** Pausado, educativo, tono sereno.
    *   **Motivacional:** Inspirador, música épica, mensajes de fuerza.
*   **Estructura del Guion:**
    *   **Hook Visual/Verbal:** Los primeros 3 segundos.
    *   **Cuerpo (Paso a Paso):** Desarrollo del contenido con tiempos estimados.
    *   **Indicaciones Visuales (Visual Cues):** Qué mostrar en pantalla (ej. "Primer plano del entrenador", "Texto flotante").
    *   **CTA Final:** Qué pedir a la audiencia.

### 3.2. Client Transformation Generator
**Archivo:** `api/clientTransformations.ts`, `components/ClientTransformationPostGenerator.tsx`

Convierte datos del CRM en potentes herramientas de marketing (Prueba Social).

*   **Uso de Datos Reales:**
    *   Extrae métricas de progreso: Peso perdido, cm reducidos, aumento de fuerza.
    *   Calcula automáticamente el tiempo transcurrido.
*   **Plantillas Narrativas:**
    *   "Héroe del Viaje": Enfocado en la historia de superación.
    *   "Datos Duros": Enfocado en las métricas y resultados.
*   **Gestión de Privacidad:**
    *   Sistema integrado para solicitar permiso al cliente antes de generar/publicar.
    *   Estado de permiso: `not_requested` -> `pending` -> `granted/denied`.

### 3.3. FAQ Content Generator
**Archivo:** `api/faqContent.ts`, `components/FAQContentGenerator.tsx`

Convierte el soporte al cliente en marketing de contenidos.

*   **Análisis de Fuentes:** Escanea Inbox unificado, WhatsApp y comentarios.
*   **Detección de Patrones:** Agrupa preguntas similares (ej. "¿Cuánto cuesta?", "Precio", "Tarifas").
*   **Generación de Respuestas:** Crea piezas educativas (Reels, Carruseles) que responden a esas dudas específicas, posicionando al entrenador como autoridad.

### 3.4. Promotional Content Templates
**Archivo:** `api/promotionalContent.ts`, `components/PromotionalContentTemplates.tsx`

Generador de contenido de venta directa "Business-Aware".

*   **Variables Dinámicas:**
    *   Se conecta con el catálogo de **Servicios y Planes**.
    *   Inserta automáticamente precios, características y fechas de ofertas.
*   **Tipos de Plantillas:**
    *   Lanzamiento de Plan.
    *   Oferta Flash (Descuento por tiempo limitado).
    *   Bono de Sesiones.
    *   Invitación a Clase/Webinar.

### 3.5. Internal Content Ideas
**Archivo:** `api/internalContentIdeas.ts`, `components/InternalContentIdeasGenerator.tsx`

Estrategia de retención. Genera contenido para enviar por canales privados (WhatsApp, Email) a clientes existentes.

*   **Segmentación:**
    *   Clientes Nuevos (Onboarding).
    *   Clientes Activos (Fidelización).
    *   Clientes Inactivos (Reactivación).
*   **Categorías:** Nutrición, Recuperación, Mindset, Tips exclusivos.

### 3.6. AI Content Workbench
**Archivo:** `components/AIContentWorkbench.tsx`

Tablero central de control para todas las herramientas de IA, mostrando el estado de los "Asistentes IA" y acceso rápido a ideas guardadas.

---

## 4. Gestión de Identidad y Marca

### 4.1. Brand Kit Generator
**Archivo:** `api/brandKit.ts`, `components/BrandKitGenerator.tsx`

Estandariza la imagen visual del entrenador.

*   **Generación:** Crea paletas de colores, pares tipográficos y eslóganes basados en la personalidad (ej. "Vibrante", "Minimalista", "Profesional").
*   **Exportación y Compartir:**
    *   Permite compartir el kit digital con miembros del equipo (diseñadores).
    *   Define reglas de uso ("Do's and Don'ts").

### 4.2. Creative Voice Config (Voz Creativa)
**Archivo:** `api/creativeVoice.ts`, `components/CreativeVoiceConfig.tsx`

El "Alma" de la IA. Asegura que el texto generado no suene robótico.

*   **Tono de Voz:** Definición precisa (ej. "Empático pero exigente").
*   **Palabras Prohibidas:** Lista negra de términos que la IA nunca debe usar (ej. "Dieta milagro", "Fácil").
*   **Pilares Temáticos:** Los grandes temas de la marca sobre los que debe girar el contenido.

### 4.3. Trainer Niches Config (Configuración de Nichos)
**Archivo:** `api/trainerNiches.ts`, `components/TrainerNichesConfig.tsx`

Personalización extrema del contenido.

*   **Definición de Nichos:** Selecciona especialidades (ej. Ejecutivos, Postparto, Alto Rendimiento).
*   **Mapeo de Ángulos:** Para cada nicho, define:
    *   **Pain Points:** Dolores específicos (ej. "Falta de tiempo" para ejecutivos).
    *   **Keywords:** Palabras clave resonantes.
    *   **Beneficios:** Qué valoran más (ej. "Energía" vs "Estética").

### 4.4. Star Formats Config
**Archivo:** `api/starFormats.ts`, `components/StarFormatsConfig.tsx`

Entrena a la IA sobre las preferencias de formato del usuario. Si el entrenador odia bailar en TikTok, la IA dejará de sugerirlo.

---

## 5. Flujos de Trabajo y Equipo

### 5.1. Content Team Assignment (Asignación de Tareas)
**Archivo:** `api/contentAssignments.ts`, `components/ContentTeamAssignment.tsx`

Transforma ideas en tareas delegables.

*   **Roles:** Editor de Video, Diseñador, Copywriter.
*   **Briefing:** Instrucciones detalladas, material de referencia, fecha límite.
*   **Estado:** Seguimiento del flujo (Pendiente -> En Progreso -> Revisión -> Completado).

### 5.2. Mobile Content Approval (Aprobación Móvil)
**Archivo:** `api/contentApprovals.ts`, `components/MobileContentApproval.tsx`

Diseñado para el entrenador que está en movimiento.

*   **AI Preview:** Antes de aprobar, la IA genera una previsualización con estimación de **Alcance** y **Engagement**.
*   **Feedback Rápido:** Aprobar, Rechazar (con razón) o Solicitar Cambios desde el móvil.
*   **Quality Score:** Puntuación automática de calidad del contenido (0-100).

### 5.3. Content Recycling (Reciclaje de Contenido)
**Archivo:** `api/contentRecycling.ts`, `components/ContentRecycler.tsx`

Maximiza el ROI de cada pieza de contenido.

*   **Detección de Ganadores:** Identifica posts antiguos con alto rendimiento.
*   **Transformación Inteligente:** Sugiere cómo reutilizarlo.
    *   *Ejemplo:* "Este Hilo de Twitter tuvo mucho éxito -> Conviértelo en un Reel educativo".
    *   *Ejemplo:* "Este video largo de YouTube -> Extrae 3 clips cortos para TikTok".

---

## 6. Inteligencia y Analítica Avanzada

### 6.1. Content Lead Analytics
**Archivo:** `api/contentAnalytics.ts`, `components/ContentLeadAnalytics.tsx`

El Santo Grial del ROI en redes sociales.

*   **Atribución Real:** No mide solo likes. Mide **Leads** y **Ventas**.
*   **Pattern Recognition:** Identifica patrones de éxito (ej. "Los Reels de nutrición los martes a las 18:00 generan más consultas").
*   **Embudo de Contenido:** Visualiza: Impresiones -> Engagement -> Leads -> Clientes -> Ingresos.

### 6.2. Saturated Topics Detector
**Archivo:** `api/saturatedTopics.ts`, `components/SaturatedTopicsDetector.tsx`

Evita que el entrenador se repita y aburra a su audiencia.

*   **Análisis de Frecuencia:** Detecta si se ha hablado demasiado de un tema recientemente.
*   **Creative Twists (Giros Creativos):** Si un tema está saturado (ej. "Sentadillas"), la IA propone ángulos novedosos (ej. "Sentadillas desde la biomecánica", "Historia de una lesión por mala sentadilla").

### 6.3. Visual Style Learning
**Archivo:** `api/visualStyleLearning.ts`, `components/VisualStyleLearning.tsx`

La IA "mira" el contenido para entender qué estética funciona.

*   **Análisis de Atributos:** Rastrea colores, composición, presencia de texto, ritmo de edición.
*   **Correlación con Rendimiento:** "Los videos con colores cálidos y ritmo rápido tienen un 30% más de retención".
*   **Recomendaciones:** Sugiere mantener o cambiar estilos visuales basados en datos.

### 6.4. Content AI Feedback
**Archivo:** `api/contentFeedback.ts`, `components/ContentAIFeedback.tsx`

Un editor jefe virtual.

*   **Análisis de Texto:** Revisa borradores antes de publicar.
*   **Puntuación:**
    *   **Claridad:** ¿Se entiende el mensaje?
    *   **CTA:** ¿Es la llamada a la acción lo suficientemente fuerte?
    *   **Coherencia:** ¿Tiene sentido la estructura?
*   **Mejora Automática:** Ofrece una versión reescrita optimizada.

### 6.5. Post-Campaign Insights
**Archivo:** `api/postCampaignInsights.ts`, `components/PostCampaignInsights.tsx`

Análisis profundo post-mortem de campañas.

*   **Desglose por Buyer Persona:** ¿Qué contenido resonó con qué tipo de cliente (ej. Ejecutivos vs Madres)?
*   **Lecciones Aprendidas:** Genera insights accionables para la próxima campaña.

---

## 7. Integraciones del Ecosistema

Este módulo no vive aislado; es el motor de distribución para todo el sistema:

*   **Creator & Influencer Syndication (`SyndicationOverview`):**
    *   Gestiona campañas con terceros.
    *   Seguimiento de entregables y contratos.
*   **Content to Funnels (`ContentToFunnelsLinker`):**
    *   Permite seleccionar contenido "Star" y enviarlo directamente a las etapas de nutrición de un Funnel de ventas.
*   **Approved to Campaigns (`ApprovedContentToCampaigns`):**
    *   Convierte un post de Instagram exitoso en un email para la newsletter o un mensaje masivo de WhatsApp.
*   **Event Challenge Kits (`EventChallengeContentKit`):**
    *   Al crear un evento en el módulo de Eventos, este generador crea automáticamente todo el kit de promoción necesario (Invitación, Cuenta atrás, Testimonios).