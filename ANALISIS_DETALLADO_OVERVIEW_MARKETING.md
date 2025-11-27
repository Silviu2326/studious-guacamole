# Documentación Maestra: Módulo OverviewMarketing

**Ruta:** `src/features/OverviewMarketing`
**Versión:** 2.0 (Basada en Inteligencia Artificial y Personalización Estratégica)

Este documento detalla todas las funcionalidades, lógicas de negocio, interacciones de usuario y arquitectura técnica del módulo de Marketing. Este dashboard no es un simple visor de datos; es un **sistema operativo de marketing** que prescribe acciones, predice resultados y aprende del usuario.

---

## 1. Arquitectura de Personalización Estratégica
El núcleo diferencial de este módulo es que **todo** el contenido se adapta al perfil del entrenador. No hay dos dashboards iguales.

### 1.1. Configuración de Perfil Estratégico (`StrategicProfileSetup.tsx`)
Este componente define la "identidad" de la IA.
*   **Funcionalidad:** Permite al usuario configurar 5 dimensiones clave:
    1.  **Tono de Comunicación:** (Ej: *Motivacional, Científico, Cercano, Duro*). Esto altera cómo la IA redacta los copies sugeridos.
    2.  **Especialidad:** (Ej: *Hipertrofia, Pérdida de peso*). Filtra qué tipo de campañas se sugieren.
    3.  **Fortalezas:** (Ej: *Nutrición, Biomecánica*). La IA priorizará estrategias que apalanquen estas fortalezas.
    4.  **Pilares de Contenido:** Temas recurrentes de la marca.
    5.  **Buyer Personas:** Definición demográfica del cliente ideal.
*   **Lógica de Negocio:**
    *   Si el usuario selecciona "Tono Cercano", la API (`marketingOverview.ts`) reescribe dinámicamente las sugerencias (ej: cambia "Ejecute campaña" por "Te sugiero lanzar esta campaña").
    *   Validación de completitud: El perfil debe tener al menos Tono y Especialidad para considerarse "Completado".

### 1.2. Selector de Objetivos Trimestrales (`QuarterlyObjectivesSelector.tsx`)
Define el "Norte" del negocio para el trimestre actual.
*   **Funcionalidad:** Selección múltiple entre 3 objetivos macro:
    *   `captar_leads`: Foco en volumen y adquisición.
    *   `vender_packs`: Foco en conversión y revenue.
    *   `fidelizar`: Foco en retención y LTV (Lifetime Value).
*   **Impacto en el Sistema:**
    *   **Reordenamiento de KPIs:** Si el objetivo es `captar_leads`, los KPIs de "Leads" y "Crecimiento Social" se mueven visualmente a posiciones prioritarias.
    *   **Filtrado de Sugerencias:** La IA oculta sugerencias que no alineen con el objetivo activo.
    *   **Narrativas Contextuales:** Los textos explicativos de los KPIs cambian para explicar el dato en función del objetivo (ej: "Tu ROAS es bueno, lo cual es clave para tu objetivo de *Vender Packs*").

### 1.3. Segmentación por Buyer Persona (`BuyerPersonaSelector.tsx`)
*   **Funcionalidad:** Un switch global que filtra **todos** los datos del dashboard (KPIs, Gráficos, Alertas) para un segmento específico (ej: "Solo ver datos de *Madres Postparto*").
*   **Lógica:** Aplica multiplicadores y rangos de validación específicos en el servicio (`marketingOverview.ts`) para simular o filtrar la data correspondiente a ese segmento.

---

## 2. Motor de Inteligencia Artificial y Estrategia

### 2.1. Estrategia Semanal IA (`WeeklyAIStrategyComponent.tsx`)
El componente más complejo. Genera un plan de acción completo de lunes a domingo.
*   **Funcionalidades:**
    *   **Foco Estratégico:** Un resumen textual de la misión de la semana generado por IA.
    *   **Mensajería Directa:** Propone borradores de Emails, SMS o Notificaciones Push listos para enviar, con fecha y hora óptima.
    *   **Diseño de Funnels:** Sugiere activar funnels específicos (TOFU/MOFU/BOFU) con proyecciones de revenue.
    *   **Calendario de Contenidos:** Propone Posts, Reels o Stories con captions, hashtags y objetivos de engagement.
*   **Interacciones:**
    *   **Aprobar:** Cambia el estado de `draft` a `approved`.
    *   **Ejecutar:** Cambia a `executing`, activando una barra de progreso visual.
    *   **Personalización:** Muestra un desglose de "Por qué se generó esta estrategia" (basado en perfil + objetivos + data histórica).

### 2.2. Sugerencias Inteligentes (`AISuggestions.tsx`)
Un feed de acciones tácticas rápidas ("Quick Wins").
*   **Funcionalidades:**
    *   **Clasificación por Impacto:** Etiquetas visuales de impacto Alto/Medio/Bajo.
    *   **Acciones Directas:** Botones para ejecutar la acción (ej: "Crear Campaña", "Generar Copy").
    *   **Playbooks:** Permite seleccionar varias sugerencias y guardarlas como un "Playbook" (rutina de marketing reutilizable).
    *   **Feedback Loop:** Botones de Aceptar/Rechazar.
*   **Lógica de Creación de Recursos:**
    *   Integración con `CreateFunnelCampaignModal`: Permite convertir una sugerencia de texto directamente en un borrador de configuración de campaña o funnel.

### 2.3. Roadmap de Activaciones (`AIRoadmapActivaciones.tsx`)
Planificación de eventos a medio plazo (30-90 días).
*   **Funcionalidades:**
    *   **Tipos de Activación:** Sugiere Retos, Webinars, Lives, Colaboraciones.
    *   **Score de Consistencia:** Una métrica (0-100) que evalúa la regularidad del marketing del usuario.
    *   **Próxima Mejor Acción:** Destaca la activación más urgente.
*   **Lógica:** Analiza la frecuencia de eventos pasados y futuros para detectar si el usuario está perdiendo inercia (consistency score).

### 2.4. Insights de Aprendizaje (`LearningInsightsComponent.tsx`)
Muestra al usuario cómo la IA está "aprendiendo" de él.
*   **Métricas:**
    *   **Tasa de Precisión:** % de sugerencias aceptadas vs. rechazadas.
    *   **Patrones:** Identifica qué tipos de sugerencias el usuario prefiere (ej: "Aceptas el 90% de sugerencias sobre *Instagram*, pero rechazas las de *Email*").
*   **Utilidad:** Aumenta la confianza del usuario en el sistema mostrando transparencia en el aprendizaje.

---

## 3. Monitorización y Analítica Avanzada

### 3.1. Tarjetas de KPI con Narrativa (`KPICards.tsx`)
*   **Funcionalidad:** Muestra métricas estándar (Leads, ROAS, Revenue).
*   **Innovación:** **Narrativa Contextual**. En lugar de solo mostrar "Leads: 50", añade un texto generado: *"¡Excelente! Estás generando 50 leads. Con tu fortaleza en Nutrición, sugerimos segmentarlos por interés en dieta."*
*   **Alertas Visuales:** Bordes rojos/amarillos si el KPI sale de los rangos esperados definidos para el Buyer Persona actual.

### 3.2. Sistema de Alertas (`KPIAlerts.tsx`)
*   **Lógica:** Compara el valor actual con `expectedRange` (min/max).
*   **Severidad:**
    *   **Crítica:** Desviación > 30%. (Acción urgente requerida).
    *   **Advertencia:** Desviación > 0% pero < 30%.
*   **Interacción:** Permite descartar alertas.

### 3.3. Atribución de Ventas (`SalesAttributionComponent.tsx`)
Responde a la pregunta: "¿Qué esfuerzo de marketing me trajo dinero?".
*   **Funcionalidades:**
    *   Desglose de Revenue por fuente: Campañas vs. Contenido Orgánico vs. Lead Magnets.
    *   **Ranking:** Identifica el "Top Performer" (la mejor pieza de contenido/anuncio).
    *   **Insight-to-Action:** Botón para "Crear campaña similar" basado en un ítem de alto rendimiento.

### 3.4. Forecast de Leads e Ingresos (`ForecastLeadsIngresos.tsx`)
Predicción financiera y operativa.
*   **Funcionalidades:**
    *   **Proyección:** Estima resultados a 7, 14, 30, 60 días basado en la tendencia actual de las campañas activas.
    *   **Gestión de Capacidad:** Calcula si el entrenador tendrá cupos suficientes.
        *   *Lógica:* Si `leads_proyectados > capacidad_actual`, sugiere "Aumentar cupos" o "Contratar ayuda".
        *   Si `leads_proyectados < capacidad_actual`, sugiere "Aumentar inversión en ads".

### 3.5. Análisis de Funnels (`TopFunnels.tsx`)
*   **Visualización:** Muestra el rendimiento por etapa (TOFU/MOFU/BOFU).
*   **Métricas:** Tasa de conversión, Ingresos totales y **Velocidad** (días promedio para cerrar una venta).

---

## 4. Herramientas de Optimización y Gestión

### 4.1. Repotenciación de Contenido (`ContentRepowerSuggestions.tsx`)
Herramienta de reciclaje de contenido.
*   **Lógica:**
    1.  Escanea historial de posts/lead magnets.
    2.  Filtra los de alto rendimiento (alta conversión/engagement).
    3.  Calcula un **Match Score** con el perfil estratégico actual.
    4.  Sugiere: "Convierte este Post de Instagram en un Anuncio de Meta Ads".
*   **Estimación:** Calcula cuántos leads/dinero extra generaría esa acción.

### 4.2. Gestión de Hot Leads (`HotLeads.tsx`)
CRM ligero para acción inmediata.
*   **Algoritmo de Scoring:** Clasifica leads del 0-100 basándose en:
    *   Perfil (coincidencia con Buyer Persona).
    *   Comportamiento (interacciones recientes).
    *   Urgencia (tiempo desde última interacción).
*   **Acciones:** Generación de enlaces directos para WhatsApp/Email con un clic.

### 4.3. Tips ante Caída de Métricas (`MetricDropTips.tsx`)
Gestión de crisis automatizada.
*   **Trigger:** Se activa cuando una métrica clave tiene una tendencia negativa (`trendDirection: 'down'`).
*   **Contenido:** Provee una "Receta" paso a paso para arreglar el problema.
*   **Personalización:** El consejo se adapta al tono del entrenador (ej: si es 'Analítico', da datos; si es 'Motivacional', da ánimos).

### 4.4. Tracker de Experimentos (`ExperimentsTracker.tsx`)
Laboratorio A/B.
*   **Funcionalidad:** Permite registrar hipótesis (ej: "Usar video funciona mejor que imagen").
*   **Seguimiento:** Mide el impacto en KPIs antes/después.
*   **Conclusión:** Marca experimentos como "Exitosos" (para repetir) o "Fallidos" (aprendizaje).

### 4.5. Auditoría de Calendario (`CalendarGapsAlerts.tsx`)
*   **Lógica:** Analiza las fechas de todos los eventos, campañas y posts programados.
*   **Detección:** Si encuentra un periodo de >3 días sin actividad, genera una alerta de "Hueco Crítico".
*   **Solución:** Sugiere automáticamente contenido para rellenar ese hueco.

### 4.6. Compartir con Equipo (`ShareWeeklySummary.tsx`)
Herramienta de delegación.
*   **Funcionalidad:** Empaqueta la estrategia semanal en un formato compartible.
*   **Destinatarios:** Permite seleccionar roles (Nutricionista, Community Manager).
*   **Historial:** Muestra quién recibió qué estrategia y cuándo.

---

## 5. Modelos de Datos Clave (`types/index.ts`)

La robustez del sistema se basa en tipos TypeScript estrictos:

1.  **`StrategicProfile`**: Almacena la configuración de personalización (tonos, fortalezas).
2.  **`MarketingKPI`**: Extendido con propiedades de `contextualNarrative`, `expectedRange` y `buyerPersonaId`.
3.  **`AISuggestion`**: Incluye `impact`, `rationale` (razonamiento de la IA) y `adaptedTone`.
4.  **`WeeklyAIStrategy`**: Estructura compleja anidada con mensajes, funnels, posts y proyecciones.
5.  **`LearningProfile`**: Almacena el historial de feedback del usuario para refinar el algoritmo.

## 6. Integración de Servicios (`marketingOverviewService.ts`)

El servicio actúa como orquestador:
1.  **Fetching:** Obtiene datos crudos de la API.
2.  **Adaptación:**
    *   Inyecta narrativas contextuales a los KPIs.
    *   Filtra sugerencias basándose en las `strengths` del perfil.
    *   Prioriza sugerencias basándose en los `objectives` trimestrales.
    *   Aplica aprendizaje del `LearningProfile` para reordenar recomendaciones.
3.  **Presentación:** Entrega datos listos para consumir por los componentes de UI.