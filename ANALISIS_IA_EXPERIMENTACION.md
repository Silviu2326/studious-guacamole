# Documentación Maestra: Módulo de Inteligencia, IA & Experimentación

**Directorio:** `@src\features\InteligenciaIaExperimentacion`

Este módulo actúa como un **Hub de Inteligencia Artificial** diseñado para entrenadores y dueños de negocios fitness. Su propósito es transformar datos dispersos (Marketing, Ventas, Comunidad) en planes de acción concretos, automatizar la toma de decisiones estratégicas y ejecutar experimentos de crecimiento con rigor científico pero sin complejidad técnica.

---

## 1. Arquitectura Funcional: El Ciclo de Inteligencia

El módulo opera bajo un ciclo continuo de mejora:
1.  **Analizar:** (Overview, Tendencias, Insights).
2.  **Planificar:** (Planes Trimestrales, Pilares Estratégicos).
3.  **Ejecutar:** (Playbooks, Campañas, Personalización).
4.  **Experimentar:** (A/B Testing, Validación de Hipótesis).
5.  **Aprender:** (Retrospectivas, Lecciones Aprendidas, Ajuste de Modelos).

---

## 2. Detalle de Funcionalidades por Subsistema

### A. Hub de Inteligencia y Visión Global (`IntelligenceHeader`, `AIOverviewSection`)
El punto de entrada que elimina la parálisis por análisis.

*   **Narrativas de Datos en Lenguaje Natural:** En lugar de solo mostrar gráficos, el sistema genera párrafos explicativos (ej: *"Tu marketing va bien, pero la comunidad está estancada. Esto afecta tu LTV"*). Conecta puntos entre Marketing, Comunidad y Ventas.
*   **Priorización IA (Matriz Impacto/Esfuerzo):** Analiza los recursos disponibles del entrenador (tiempo, presupuesto, equipo) y sugiere una lista ordenada de acciones (Quick Wins vs. Proyectos Mayores).
*   **Estilos de Decisión Configurables:** El usuario puede configurar cómo la IA le presenta la información:
    *   *Rápido:* Dame la solución ya.
    *   *Basado en Datos:* Muéstrame la evidencia y los KPIs.
    *   *Iterativo:* Vamos paso a paso.

### B. Fábrica de Estrategias (Playbooks Engine) (`PlaybookLibrary`)
No son simples plantillas de email; son estrategias de negocio completas generadas y gestionadas por IA.

*   **Generador de Playbooks Completos:** Con un solo prompt (ej: "Quiero reactivar ex-clientes"), la IA genera:
    1.  **Estrategia:** Visión general, audiencia objetivo, mensajes clave y timeline.
    2.  **Copywriting:** Correos, mensajes de WhatsApp y posts sociales adaptados al tono del entrenador.
    3.  **Assets:** Sugerencias de imágenes o plantillas visuales.
    4.  **Medición:** KPIs principales y secundarios para definir el éxito.
*   **Sincronización Multi-Sede/Multi-Entrenador:** Permite "empujar" un playbook exitoso desde la central a otras sedes o entrenadores, resolviendo conflictos de versiones automáticamente.
*   **Aprendizaje de Decisiones:** La IA rastrea si el usuario Acepta, Rechaza o Modifica un Playbook. Si se rechaza, pide la razón y refina el modelo para futuras sugerencias.

### C. Laboratorio de Experimentación (`ExperimentationSection`)
Trae el método científico al fitness marketing.

*   **Sugerencias de Experimentos IA:** La IA analiza los datos y sugiere tests específicos (ej: *"Prueba cambiar el asunto del email de bienvenida, la tasa de apertura es baja"*). Tipos de tests: Tono, Contenido, Timing, Canal, Audiencia, CTA.
*   **Traducción de Resultados:** Cuando un experimento termina, la IA no solo da números. Genera un **Insight** legible: *"La variante B ganó con un 18% más de conversión. Recomendamos escalar esto inmediatamente."*
*   **Repositorio de Lecciones Aprendidas:** Sistema para registrar qué funcionó y qué no (Éxito/Fracaso), etiquetarlo y consultarlo antes de lanzar futuros experimentos.

### D. Motor de Personalización (`PersonalizationEngineSection`)
Hiper-segmentación y journeys dinámicos.

*   **Detección de Micro-Segmentos:** La IA escanea la base de datos buscando patrones emergentes (ej: *"Ejecutivos que entrenan de noche y compran suplementos"*).
*   **Sugerencia de Ofertas:** Para cada micro-segmento, sugiere una oferta específica (Descuento, Pack, Trial) con una probabilidad de conversión calculada.
*   **Constructor de Journeys IA:** Crea flujos de automatización basados en atributos psicológicos del lead (Objetivo Fitness + Motivador Principal).
    *   *Ejemplo:* Si el motivador es "Competencia", el journey usa lenguaje de reto y ranking. Si es "Salud", usa lenguaje médico y preventivo.
*   **Análisis de Impacto:** Mide el ROI específico de la personalización (¿Cuánto más retengo a los clientes personalizados vs. genéricos?).

### E. Inteligencia de Mercado y Competencia (`MarketTrendsAlertsSection`)
Un radar externo para no operar a ciegas.

*   **Alertas de Competencia:** Monitorea movimientos (cambios de precio, nuevos productos) y sugiere contra-estrategias defensivas u ofensivas.
*   **Tendencias del Sector:** Identifica modas emergentes (ej: "Hyrox", "Ayuno Intermitente") y sugiere Playbooks para capitalizarlas rápidamente.
*   **Insights por Canal:** Analiza qué canal (Ads, Orgánico, Referidos) es más rentable y da recomendaciones tácticas para optimizar el presupuesto.

### F. Feedback Loop & Gestión de Reputación (`FeedbackLoopSection`)
Transforma la opinión del cliente en acciones automáticas.

*   **Micro-Planes para Feedback Negativo:** Si llega una mala reseña, la IA genera instantáneamente un plan de contención:
    1.  **Mensaje:** Borrador de disculpa/solución.
    2.  **Acción:** Qué hacer (llamar, ofrecer descuento).
    3.  **Seguimiento:** Cuándo verificar si el cliente está feliz.
*   **Campañas de Feedback Positivo:** Si llega una excelente reseña, activa automáticamente campañas de "Premium Invitation" o "Pide un Referido" para aprovechar el momento de euforia del cliente.
*   **Vista Integrada (Patrones):** Cruza datos para encontrar correlaciones complejas (ej: *"Los clientes que se quejan de la música tienen un 20% más de probabilidad de cancelar en el mes 3"*).

### G. Planificación y Operaciones (`QuarterlyPlanSection`, `MobileApproval`)
Herramientas para la gestión del negocio y el equipo.

*   **Plan Trimestral IA:** Genera un roadmap estratégico alineado con OKRs (Objetivos y Resultados Clave), desglosado en hitos y tareas.
*   **Retrospectiva Mensual:** Genera un reporte automático celebrando logros, analizando métricas y definiendo el foco del mes siguiente.
*   **Aprobación Móvil (Tinder for Business):** Una interfaz simplificada para que el dueño apruebe Playbooks o Experimentos desde el móvil con un resumen ejecutivo generado por IA, sin tener que leer todos los detalles técnicos.
*   **Tracking de Ownership:** Asigna responsables a cada Insight o Playbook y rastrea su progreso para evitar que las buenas ideas se pierdan.

---

## 3. Estructura Técnica del Código

### API y Tipos (`/api`, `/types`)
El backend (simulado) es robusto y tipado estrictamente.
*   **`intelligenceHub.ts`**: Archivo central que simula la lógica de negocio compleja (generación de playbooks, cálculo de ROI, análisis de texto).
*   **Tipos Clave**:
    *   `PlaybookRecord`: Estructura compleja anidada (estrategia, copies, assets).
    *   `IntelligenceInsight`: Contiene la severidad y la sugerencia de acción.
    *   `MicroSegment`: Datos demográficos y psicográficos detectados.

### Componentes Clave (`/components`)

1.  **Visualización de Datos:**
    *   `AIOverviewSection`: Usa componentes de "Narrativa" y tarjetas de métricas limpias.
    *   `IntegratedAIPatternsSection`: Muestra correlaciones y patrones complejos.
    *   `MarketTrendsAlertsSection`: Lista de alertas con severidad y acciones recomendadas.

2.  **Acción y Gestión:**
    *   `PlaybookLibrary`: Tabla avanzada con acciones para ver, compartir, pausar y sincronizar.
    *   `ExperimentationSection`: Gestión del ciclo de vida de los tests A/B.
    *   `OwnershipTrackingSection`: Gestión de tareas y responsables.

3.  **Generadores e Interactividad:**
    *   `StrategicPillarsForm`: Formulario para "enseñar" a la IA sobre el negocio.
    *   `PersonalizationEngineSection`: Constructor de Journeys interactivo.
    *   `MobileApprovalSection`: Interfaz simplificada para decisiones rápidas.

### Servicios (`/services`)
Capa de abstracción que conecta la UI con la API. Implementa funciones asíncronas para cada acción (generar, guardar, actualizar, analizar), manejando estados de carga y errores.

---

## 4. Flujos de Usuario Destacados (User Stories Implementadas)

1.  **"Como dueño, quiero reaccionar rápido a una mala racha":**
    *   El sistema detecta métricas a la baja -> Genera una alerta en `AIOverview` -> Sugiere un `Playbook` de reactivación -> El usuario lo aprueba en `MobileApproval` -> Se lanza la campaña.

2.  **"Como entrenador, no sé qué postear o enviar":**
    *   El usuario va a `InsightsSection` -> Ve una tendencia de mercado ("Ayuno") -> Clic en "Transformar en Playbook" -> La IA genera todo el contenido -> El usuario revisa y lanza.

3.  **"Como franquicia, quiero estandarizar la calidad":**
    *   La central crea un Playbook exitoso -> Usa `PlaybookSyncSection` -> Selecciona todas las sedes -> El Playbook se instala en los paneles de los entrenadores locales automáticamente.

4.  **"Como marketer, quiero optimizar mi presupuesto":**
    *   El sistema analiza `ChannelInsights` -> Detecta que "Ads" tiene ROI bajo pero "Referidos" alto -> Sugiere mover presupuesto -> Usuario acepta -> Se genera campaña de incentivos para referidos.
