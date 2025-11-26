# Plan de Implementación: Marketing Overview 360°

Este documento detalla el plan para construir el **Overview de Marketing Unificado**, diseñado para ofrecer al Entrenador Personal una visión holística de su negocio digital en una sola pantalla. El objetivo es maximizar la satisfacción del usuario mediante una UX intuitiva que resalte métricas clave ("La salud de mi negocio") y acciones sugeridas ("Qué debo hacer hoy").

## 1. Filosofía de Diseño: "Business at a Glance"

El dashboard no será un simple volcado de datos, sino un tablero de control operativo.
*   **Prioridad Visual:** Lo urgente (Alertas/Leads) > Lo importante (KPIs Financieros) > Lo informativo (Contenido/Comunidad).
*   **Interacción:** Cada tarjeta debe ser "clicable" para llevar al usuario a la sección profunda correspondiente.
*   **Personalización:** Uso de IA para mostrar insights contextuales (ej. "Tu engagement bajó, prueba este post").

---

## 2. Selección de Componentes por Módulo

A continuación, se detallan los 3 componentes clave seleccionados de cada una de las 5 features principales, basados en el código analizado.

### A. Funnels & Adquisición
*Fuente: `src/features/FunnelsAdquisicion/services/funnelsAdquisicionService.ts`*

1.  **Tarjeta de KPIs de Adquisición (Mini-Scorecard):**
    *   **Qué muestra:** CAC (Coste por Adquisición), LTV (Valor de Vida), Tasa de Conversión Global y Leads Totales del mes.
    *   **Por qué:** Responde a "¿Es rentable mi captación?".
    *   **Datos:** `getKPIs(period)`.

2.  **Pipeline de Oportunidades (Lead Health):**
    *   **Qué muestra:** Gráfico de embudo simplificado con número de leads en cada etapa (Visitante -> Lead -> Oportunidad -> Cliente) + Alerta de "Leads en Riesgo".
    *   **Por qué:** Enfoca al entrenador en donde se pierden ventas.
    *   **Datos:** `getFunnels(period)` y `getLeadRiskAlerts()`.

3.  **Proyección de Ingresos (Revenue Forecast):**
    *   **Qué muestra:** Barra de progreso o gráfico de área comparando "Ingresos Actuales" vs "Proyectados" según el volumen de funnels activos.
    *   **Por qué:** Motivación financiera y previsibilidad.
    *   **Datos:** `getProjectedRevenueByFunnel(period)`.

### B. Campañas & Automatización
*Fuente: `src/features/CampanasAutomatizacion/pages/CampanasAutomatizacionPage.tsx`*

1.  **Monitor de Campañas Activas (Live Feed):**
    *   **Qué muestra:** Lista compacta de campañas en curso (Email/WhatsApp) con métricas en tiempo real (Open Rate, Click Rate).
    *   **Por qué:** Feedback inmediato sobre lo que está ocurriendo ahora mismo.
    *   **Datos:** `summary` y `campaigns` (del snapshot).

2.  **Radar de Automatización (Daily Task):**
    *   **Qué muestra:** Conteo de "Mensajes enviados hoy", "Programados para mañana" y "Errores de entrega".
    *   **Por qué:** Tranquilidad de que "el sistema trabaja por mí".
    *   **Datos:** `messageStatisticsDashboard` y `scheduledMessages`.

3.  **Salud de Canales (System Status):**
    *   **Qué muestra:** Indicadores tipo semáforo (Verde/Rojo) para WhatsApp API, Email Server, y SMS.
    *   **Por qué:** Diagnóstico rápido de problemas técnicos antes de que afecten al negocio.
    *   **Datos:** `health` (ChannelHealthMetric).

### C. Comunidad & Engagement
*Fuente: `src/features/CommunityYEngagement/pages/CommunityYEngagementPage.tsx`*

1.  **Pulso de Satisfacción (NPS & Retention):**
    *   **Qué muestra:** Gauge chart del NPS actual y Tasa de Retención mensual con indicador de tendencia (subiendo/bajando).
    *   **Por qué:** Métrica definitiva de la calidad del servicio.
    *   **Datos:** Componente `CommunityMetrics`.

2.  **Muro de la Fama (Recent Wins):**
    *   **Qué muestra:** Carrusel auto-deslizable con los últimos 3 testimonios de 5 estrellas o "Historias de éxito".
    *   **Por qué:** Refuerzo positivo y material listo para compartir en redes.
    *   **Datos:** Componente `TestimonialsViewer`.

3.  **Semáforo de Atención al Cliente:**
    *   **Qué muestra:** Lista priorizada de clientes que requieren atención (ej. "Riesgo de baja", "Cumpleaños hoy", "Feedback negativo reciente").
    *   **Por qué:** Acción proactiva para evitar el churn.
    *   **Datos:** Componente `LoyaltyQuickActions` / `InteractionsViewer`.

### D. Content & Social Studio
*Fuente: `src/features/ContentSocialStudio/pages/ContentSocialStudioPage.tsx`*

1.  **Calendario Editorial Semanal (Timeline):**
    *   **Qué muestra:** Vista horizontal de los próximos 5-7 días con iconos de posts programados (Instagram, TikTok, YouTube).
    *   **Por qué:** Organización y consistencia en la publicación.

2.  **Top Content Performer:**
    *   **Qué muestra:** Miniatura del Reel/Post con mejor rendimiento del mes (Vistas/Engagement) y un tip de IA: "Crea más contenido como este".
    *   **Por qué:** Aprendizaje basado en datos.
    *   **Datos:** `getTopReels` (vinculado en servicios de funnel).

3.  **Banco de Ideas IA (Inspiración):**
    *   **Qué muestra:** 3 tarjetas con ideas de contenido generadas por IA que aún no se han creado (ej. "Habla sobre Hidratación en verano").
    *   **Por qué:** Elimina el bloqueo creativo ("Writer's block").

### E. Inteligencia IA & Experimentación
*Fuente: `src/features/InteligenciaIaExperimentacion/pages/InteligenciaIaExperimentacionPage.tsx`*

1.  **Insight Estratégico del Día:**
    *   **Qué muestra:** Una tarjeta destacada con *el* consejo más importante de la IA para hoy (ej. "Tus leads de Instagram convierten un 20% menos, revisa tu bio").
    *   **Por qué:** Valor añadido de alto nivel consultivo.
    *   **Datos:** `overview.aiSuggestions` o `weeklyAIInsights`.

2.  **Laboratorio de Experimentos (A/B Tests):**
    *   **Qué muestra:** Estado de experimentos activos (ej. "Landing A vs B: B gana por +15%").
    *   **Por qué:** Fomenta la cultura de mejora continua.
    *   **Datos:** `experimentsDashboard`.

3.  **Progreso de Playbooks:**
    *   **Qué muestra:** Barras de progreso de estrategias a largo plazo (ej. "Estrategia de Lanzamiento Verano: 60% completada").
    *   **Por qué:** Gamificación del crecimiento del negocio.
    *   **Datos:** `overview.playbooksProgress`.

---

## 3. Propuesta Visual (Wireframe Conceptual)

El layout sugerido utiliza una cuadrícula "Bento Grid" (estilo moderno, modular) que se adapta a diferentes tamaños de pantalla.

```
+---------------------------------------------------------------+
| [H1] Marketing Overview     [Date]      [Global Status: Good] |
+---------------------------------------------------------------+
|                                                               |
|  [ A. FUNNELS KPI ]    [ B. CAMPAIGNS LIVE ]   [ C. NPS ]     |
|  [  CAC | LTV | % ]    [  🟢 Promo Verano  ]   [  ⭐ 9.5  ]    |
|                                                               |
+-----------------------+-----------------------+---------------+
|                       |                       |               |
|  [ D. CALENDAR ]      |  [ E. AI INSIGHT ]    | [ ACTIONS ]   |
|  [ Lun | Mar | Mie ]  |  "Mejora tu copy..."  | 1. Call Ana   |
|                       |                       | 2. Post Reel  |
|                       |                       |               |
+-----------------------+-----------------------+---------------+
|                                                               |
|  [ DETAILS ROW - TABS ]                                       |
|  [ Funnels Graph ] [ Automation Stats ] [ Top Content ]       |
|                                                               |
+---------------------------------------------------------------+
```

## 4. Próximos Pasos Técnicos

1.  Crear `src/features/MarketingOverview/` como contenedor principal.
2.  Implementar un `MarketingOverviewService` que agrege (sin duplicar lógica) las llamadas a los 5 servicios existentes.
3.  Diseñar componentes "Widget" reutilizables (ej. `MetricCard`, `InsightAlert`, `MiniList`) para mantener consistencia visual.
4.  Ensamblar la página principal usando el Layout Bento Grid.
