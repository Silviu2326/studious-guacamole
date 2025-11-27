# Documentación Maestra: Módulo Funnels & Adquisición (FunnelsAdquisicion)

Este documento constituye la referencia técnica y funcional completa del módulo **Funnels & Adquisición**. Este sistema no es solo un constructor de páginas, sino un **motor de inteligencia comercial** diseñado para automatizar, medir y optimizar el ciclo de vida completo de la captación de clientes, desde el primer clic hasta la conversión final.

---

## 🏛️ Arquitectura General

El módulo se divide en 4 pilares operativos que interactúan entre sí:

1.  **Centro de Comando (Dashboard):** Analítica predictiva y gestión de alertas.
2.  **Constructor de Estrategias (Funnel Builder):** Diseño visual de flujos, automatización y lógica de negocio.
3.  **Estudio Creativo (Landing & Lead Magnet):** Producción de activos digitales optimizados por IA.
4.  **Motor de Inteligencia (AI Core):** Capa transversal que aprende, sugiere y redacta contenido.

---

## 1. Centro de Comando (Dashboard Principal)

El punto de entrada (`FunnelsAdquisicionPage`) agrega datos de múltiples fuentes para ofrecer una "Salud del Negocio" en tiempo real.

### 📊 1.1. Métricas y KPIs (Snapshot)
**Funcionalidad:** Agregación de datos financieros y operativos de marketing.
*   **KPIs Clave:** Visualización de *Leads captados*, *Ingresos atribuidos*, *CTR*, *ROAS* y *Crecimiento Orgánico*.
*   **Tendencias:** Comparativa automática con periodos anteriores (7, 30, 90 días) con indicadores visuales de tendencia (Up/Down/Neutral).
*   **Objetivos:** Líneas base de objetivos configurables para medir el rendimiento contra metas (Target).

### 🚨 1.2. Sistema de Alertas Predictivas (US-FA-008 & US-FA-021)
**Funcionalidad:** Monitorización proactiva para evitar pérdidas de ingresos.
*   **Alertas de Riesgo de Leads (US-FA-008):** Detecta leads estancados en etapas críticas (ej. "Consulta solicitada" hace >5 días).
    *   *Acción:* Sugiere plantillas inmediatas de WhatsApp/Email o llamadas.
    *   *Prioridad:* Clasifica el riesgo en Alto/Medio/Bajo según el valor potencial del lead.
*   **Alertas de Generación de Leads (US-FA-021):** Algoritmo que calcula si el ritmo actual de captación (leads/día) es suficiente para llenar una campaña futura (ej. un Reto que empieza en 2 semanas).
    *   *Gap Analysis:* Calcula el déficit de leads ("Faltan 45 leads para llegar al objetivo").
    *   *Acciones:* Sugiere "Potenciar funnel" (aumentar ad spend) o "Extender timeline".

### 💰 1.3. Proyección de Revenue (US-FA-020)
**Funcionalidad:** Modelado financiero basado en capacidad operativa.
*   **Lógica:** Cruza la *Capacidad Máxima* (cupos disponibles), el *Precio* del servicio y la *Tasa de Conversión* actual.
*   **Output:** Calcula el *Revenue Proyectado* vs *Revenue Actual* y muestra el "Gap de Revenue" (dinero que se está dejando de ganar).
*   **Priorización:** Asigna un "Priority Score" a cada funnel para indicar dónde enfocar los esfuerzos de optimización.

### 🌐 1.4. Integración Multicanal
*   **Social Media Intelligence (US-FA-010):** No solo cuenta likes, sino que calcula el **ROI por post** y la tasa de conversión de Engagement a Lead. Identifica qué plataforma (IG, TikTok, YouTube) trae leads más cualificados.
*   **Programa de Referidos (US-FA-012):** Dashboard específico para gestionar el boca a boca. Identifica a los "Top Referrers" (clientes que traen más negocio) y calcula el LTV (Lifetime Value) de los referidos.

---

## 2. Constructor de Funnels (Builder Visual)

El corazón estratégico del módulo (`FunnelsEditorPage`). Utiliza `React Flow` para diagramar estrategias complejas.

### 🧠 2.1. Personalización Profunda (US-FA-015 & US-FA-03)
**Funcionalidad:** El funnel se adapta al cliente, no al revés.
*   **Editor de Buyer Personas:** Define avatares detallados (Demografía, Dolores, Objetivos, Objeciones). Estos perfiles se guardan y se usan para que la IA redacte copys específicos.
*   **Mapeo de Dolores (Pain Points):** Registro de problemas específicos (ej. "Dolor de espalda", "Falta de tiempo") con intensidad y frecuencia.
*   **Presets de Tono y CTA:** Guardado de configuraciones de marca (ej. Tono "Motivacional", CTA "Únete al reto").

### 🤖 2.2. Adaptación de Copy con IA
**Funcionalidad:** Redacción automática de mensajes para cada etapa.
*   **Flujo:** Seleccionas un nodo (ej. Email 1) -> Clic en "Adaptar con IA" -> El sistema cruza el *Objetivo del nodo* con los *Dolores del Buyer Persona* seleccionado -> Genera un copy persuasivo único.

### 🧪 2.3. Experimentos A/B Nativos (US-FA-07)
**Funcionalidad:** Optimización científica de la conversión.
*   **Tipos de Test:** Copy, Oferta, Formato, Imagen.
*   **Gestión:** Creación de variantes (A/B/C), asignación de tráfico (ej. 50/50) y monitorización de significancia estadística.
*   **IA Advisor:** La IA sugiere qué variante crear basándose en benchmarks (ej. "Prueba un titular más corto").

### ⚠️ 2.4. Análisis de Cuellos de Botella (US-FA-08)
**Funcionalidad:** Diagnóstico automático de salud del funnel.
*   **Detección:** Identifica etapas con tasas de abandono (dropoff) anormalmente altas.
*   **Diagnóstico IA:** Analiza la causa probable (ej. "Formulario demasiado largo", "Oferta poco clara") y sugiere soluciones (ej. "Simplificar campos", "Añadir prueba social").

### 🔗 2.5. Conectividad y Conversión
*   **Conector de Contenidos (US-FA-019):** Permite inyectar contenido existente (Top Reels, Testimonios validados) en puntos clave del funnel (ej. página de gracias, emails de nurturing).
*   **Actualizador de Insights (US-FA-024):** Inyecta automáticamente "Social Proof" fresca (NPS alto, nuevas reseñas) en las landings activas para mantener la credibilidad alta.

### 🚀 2.6. Exportación y Transformación
*   **Funnel a Campaña (US-FA-017):** Exporta la estructura visual a configuraciones reales en el módulo de Marketing (Listas, Secuencias, Disparadores).
*   **Funnel a Reto (US-FA-018):** Convierte un flujo de captación en una estructura de evento/reto (Participantes, Reglas, Métricas de progreso).

---

## 3. Estudio Creativo (Landing & Lead Magnet)

Herramientas de producción para crear los activos que componen el funnel.

### 📄 3.1. Editor de Landing Pages
**Tecnología:** Basado en GrapesJS / Craft.js para experiencia Drag & Drop.
*   **Generador de Copy IA (US-FA-05):** Redacta la página completa (Hero, Beneficios, FAQs) basándose en un objetivo (ej. "Vender curso") y un tono.
*   **Formularios Inteligentes (US-FA-06):**
    *   *Sugerencia IA:* Recomienda qué campos pedir según la etapa del funnel (TOFU: solo email / BOFU: teléfono + presupuesto).
    *   *Lógica:* Mapea respuestas a campos del CRM automáticamente.
*   **Checklist SEO:** Validación automática de meta-tags, estructura H1-H6 y performance.

### 🧲 3.2. Lead Magnet Factory
**Funcionalidad:** Fábrica de recursos gratuitos para captación.
*   **Sugerencias por Avatar (US-FA-04):** Analiza al Buyer Persona y recomienda el mejor formato (ej. "Para ejecutivos ocupados: Checklist de 5 min" vs "Para estudiantes: Guía completa PDF").
*   **Recomendaciones de Nurturing (US-FA-016):** Una vez creado el Lead Magnet, la IA diseña la secuencia de emails posterior para convertir esa descarga en una venta, basándose en el contenido del recurso.

---

## 4. Motor de Inteligencia (Funcionalidades Transversales)

Capacidades de IA que atraviesan todo el módulo para mejorar la toma de decisiones.

### 🧠 4.1. Aprendizaje de Propuestas (US-FA-023)
**Funcionalidad:** Memoria institucional de qué funciona.
*   **Análisis:** Rastrea qué ofertas (Descuento, Bonus, Trial) tienen mayor tasa de cierre históricamente.
*   **Priorización:** Al crear una nueva oferta, el sistema sugiere la estructura que mejor ha funcionado para audiencias similares.

### 💬 4.2. Plantillas de Follow-up (US-FA-025)
**Funcionalidad:** Comunicación post-registro inmediata.
*   **Generación:** Crea scripts para WhatsApp/Email para enviar justo después de un registro.
*   **Variables:** Personaliza con nombre, fecha, nombre del funnel y CTA específico.

### 📅 4.3. Calendario de Lanzamientos (US-FA-026)
**Funcionalidad:** Gestión temporal de estrategias.
*   **Fases:** Visualiza periodos de "Calentamiento", "Lanzamiento", "Carrito Abierto", "Cierre".
*   **Coordinación:** Asigna tareas y hitos a miembros del equipo.

### 📝 4.4. Notas Cualitativas y Retrospectivas (US-FA-021 & US-FA-022)
**Funcionalidad:** Ciclo de mejora continua (Kaizen).
*   **Cualitativo:** Registro de feedback "humano" (lo que dicen los leads por teléfono) para contrastar con los datos "duros".
*   **Retrospectiva:** Al cerrar un funnel, se genera un informe de "Lecciones Aprendidas" y "Resultados Reales vs Esperados" para alimentar la IA del siguiente proyecto.

### 🤖 4.5. Resumen Ejecutivo IA (US-FA-027)
**Funcionalidad:** Reporting automático.
*   Genera un resumen en lenguaje natural sobre el rendimiento del funnel, destacando logros, problemas y próximos pasos, listo para compartir con stakeholders.

---

## Resumen de User Stories Cubiertas

| Código | Funcionalidad | Descripción Corta |
| :--- | :--- | :--- |
| **US-FA-03** | Presets Tono/CTA | Guardar configuraciones de voz de marca. |
| **US-FA-04** | Formatos Lead Magnet | Sugerencia de formato según avatar. |
| **US-FA-05** | Copy Landing IA | Redacción completa de landings. |
| **US-FA-06** | Formularios Smart | Campos dinámicos según etapa. |
| **US-FA-07** | Tests A/B IA | Experimentos guiados y análisis. |
| **US-FA-08** | Cuellos de Botella | Detección de caídas de conversión. |
| **US-FA-008** | Alertas Riesgo Lead | Aviso de leads desatendidos. |
| **US-FA-009** | KPI 1ª Sesión | Métrica de conversión inicial. |
| **US-FA-010** | Métricas Social | ROI y atribución de redes. |
| **US-FA-012** | Referidos | Gestión completa de programa de afiliados. |
| **US-FA-014** | Funnels Recomendados | Generación de estrategias base. |
| **US-FA-015** | Buyer Personas | Definición de avatares y dolores. |
| **US-FA-016** | Nurturing Recs | Secuencias post-lead magnet. |
| **US-FA-017** | Exportar Campañas | Conexión con módulo de Marketing. |
| **US-FA-018** | Funnel a Reto | Conversión de estructura a evento. |
| **US-FA-019** | Conector Contenido | Uso de reels/reviews en funnels. |
| **US-FA-020** | Proyección Revenue | Estimación financiera basada en capacidad. |
| **US-FA-021** | Alertas Gen. Leads | Predicción de déficit de captación. |
| **US-FA-022** | Notas Cualitativas | Feedback manual de ventas. |
| **US-FA-023** | Aprendizaje Propuestas | IA sobre qué ofertas cierran mejor. |
| **US-FA-024** | Insights Comunidad | Inyección de Social Proof. |
| **US-FA-025** | Follow-up Templates | Scripts post-registro inmediatos. |
| **US-FA-026** | Calendario | Gestión de fases de lanzamiento. |
| **US-FA-027** | Resumen IA | Reporting ejecutivo automático. |