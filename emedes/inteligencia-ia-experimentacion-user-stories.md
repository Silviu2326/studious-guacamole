## 3. USER STORIES

### 🧠 PERFIL COGNITIVO DEL ENTRENADOR

**US-II-01**: Como Entrenador personal, Quiero capturar mis pilares estratégicos (misión, diferenciadores, recursos disponibles), Para que la IA proponga iniciativas alineadas a mi realidad.  
**Feature**: `src/features/InteligenciaIaExperimentacion`  
**Descripción**: Formulario “Perfil de inteligencia” sincronizado con `TrainerProfile`. Incluye objetivos, limitaciones, presupuesto y stack de herramientas.

**US-II-02**: Como Entrenador personal, Quiero indicar mi estilo de decisión (rápido, basado en datos, iterativo), Para que la IA adapte la forma de presentar recomendaciones.  
**Feature**: `src/features/InteligenciaIaExperimentacion/components/IntelligenceHeader`  
**Descripción**: Selector de estilo. Afecta longitud de resúmenes, nivel de detalle y CTA sugeridos.

### 📊 OVERVIEW Y NARRATIVA IA

**US-II-03**: Como Entrenador personal, Quiero un overview IA que conecte datos de marketing, comunidad y ventas en lenguaje claro, Para entender qué está pasando sin analizar tablas.  
**Feature**: `src/features/InteligenciaIaExperimentacion/components/IntelligenceMetrics`  
**Descripción**: Narrativa IA personalizada (“Tu estilo HIIT resonó con ejecutivos”). Destaca logros, riesgos y oportunidades.

**US-II-04**: Como Entrenador personal, Quiero priorización IA con matriz Impacto/Esfuerzo basada en mis recursos, Para enfocar mi energía.  
**Feature**: `src/features/InteligenciaIaExperimentacion/components/InsightsSection`  
**Descripción**: Cada insight incluye score, esfuerzo estimado y plan de acción. Botón “Lanzar ahora” enlaza a módulo correspondiente.

### 📚 PLAYBOOKS IA PERSONALIZADOS

**US-II-05**: Como Entrenador personal, Quiero playbooks IA completos (estrategia, copy, assets, medición) adaptados a mi estilo y audiencia, Para ejecutar sin perder tiempo.  
**Feature**: `src/features/InteligenciaIaExperimentacion/components/PlaybookLibrary`  
**Descripción**: Playbooks etiquetados por objetivo. IA usa perfil para rellenar copy y CTA. Opciones de ajustar tono antes de exportar.

**US-II-06**: Como Entrenador personal, Quiero transformar un insight en playbook con un clic, Para pasar de diagnóstico a acción inmediata.  
**Feature**: `src/features/InteligenciaIaExperimentacion/components/InsightsSection`  
**Descripción**: Botón “Crear playbook IA”. Solicita parámetros mínimos (duración, canal) y genera plan completo.

**US-II-07**: Como Entrenador personal, Quiero compartir playbooks personalizados con mi equipo, Para que entiendan contexto y pasos.  
**Feature**: `src/features/InteligenciaIaExperimentacion/components/PlaybookLibrary`  
**Descripción**: Export PDF/Notion con copy, timeline, responsables y KPIs. Notificación a colaboradores.

### 🔬 EXPERIMENTACIÓN ORIENTADA

**US-II-08**: Como Entrenador personal, Quiero que la IA me sugiera experimentos relevantes (ej: tono inspiracional vs técnico) según mis datos, Para aprender qué funciona mejor.  
**Feature**: `src/features/InteligenciaIaExperimentacion/components/ExperimentationSection`  
**Descripción**: Motor de hipótesis. Prioriza experimentos, define expectativas y assets requeridos. Integración con Campañas y Content Studio.

**US-II-09**: Como Entrenador personal, Quiero seguimiento automático de experimentos con resultados traducidos a insights comprensibles, Para decidir si escalar.  
**Feature**: `src/features/InteligenciaIaExperimentacion/components/ExperimentationSection`  
**Descripción**: Tabla comparativa, interpretación IA (“Los ejecutivos respondieron mejor al mensaje directo”). Botón “Escalar” crea campaña.

**US-II-10**: Como Entrenador personal, Quiero registrar lecciones aprendidas de cada experimento y que la IA las recuerde, Para no repetir errores.  
**Feature**: `src/features/InteligenciaIaExperimentacion/components/ExperimentationSection`  
**Descripción**: Campo “Aprendizaje clave”. IA resume y actualiza base de conocimiento. Impacta futuras recomendaciones.

### 🎯 PERSONALIZACIÓN IA AVANZADA

**US-II-11**: Como Entrenador personal, Quiero un motor de personalización IA que construya journeys según atributos del lead (objetivo fitness, motivadores), Para ofrecer experiencias únicas.  
**Feature**: `src/features/InteligenciaIaExperimentacion/components/PersonalizationEngineSection`  
**Descripción**: Editor visual + reglas IA. Sugiere mensajes y contenidos por perfil. Simulador de journey.

**US-II-12**: Como Entrenador personal, Quiero que la IA detecte micro-segmentos emergentes (ej: ejecutivos remotos) y sugiera ofertas, Para capitalizar tendencias.  
**Feature**: `src/features/InteligenciaIaExperimentacion/services/intelligenceService`  
**Descripción**: Análisis de datos cruzados. Insight con propuesta de valor, copy y landing sugerida.

**US-II-13**: Como Entrenador personal, Quiero ver impacto de la personalización en métricas clave (reservas, retención), Para justificar inversión.  
**Feature**: `src/features/InteligenciaIaExperimentacion/components/PersonalizationEngineSection`  
**Descripción**: Dashboard con comparativa A/B (personalizado vs genérico). IA destaca learnings.

### 🔁 FEEDBACK LOOP INTELIGENTE

**US-II-14**: Como Entrenador personal, Quiero integrar feedback de clientes, contenido y ventas en una sola vista IA, Para detectar patrones.  
**Feature**: `src/features/InteligenciaIaExperimentacion/components/FeedbackLoopSection`  
**Descripción**: Fusión de encuestas, comentarios y métricas. IA resalta temas recurrentes y propone acciones.

**US-II-15**: Como Entrenador personal, Quiero que cada feedback negativo genere un micro plan IA (mensaje, acción, seguimiento), Para resolver rápido.  
**Feature**: `src/features/InteligenciaIaExperimentacion/components/FeedbackLoopSection`  
**Descripción**: Workflow con responsables, mensaje sugerido y timebox. Track de resolución.

**US-II-16**: Como Entrenador personal, Quiero automatizar campañas basadas en feedback positivo (ej: invitar a programa premium), Para aprovechar momentum.  
**Feature**: `src/features/InteligenciaIaExperimentacion/components/FeedbackLoopSection`  
**Descripción**: Regla IA que envía lead a Campañas con copy adaptado. Métrica del impacto.

### 📈 INSIGHTS ACCIONABLES

**US-II-17**: Como Entrenador personal, Quiero recibir insights IA por canal (Ads, orgánico, referidos) con recomendaciones concretas, Para optimizar cada frente.  
**Feature**: `src/features/InteligenciaIaExperimentacion/components/InsightsSection`  
**Descripción**: Tarjetas con “qué pasó / por qué / qué hacer”. CTA conecta con módulo pertinente.

**US-II-18**: Como Entrenador personal, Quiero que la IA me avise de tendencias de mercado/movimiento competidor relevante, Para anticiparme.  
**Feature**: `src/features/InteligenciaIaExperimentacion/components/InsightsSection`  
**Descripción**: Feed mensual con análisis de mercado. Sugerencias de ofertas, contenido y productos.

**US-II-19**: Como Entrenador personal, Quiero planes trimestrales IA basados en mis datos (OKRs, roadmap), Para alinear mi estrategia.  
**Feature**: `src/features/InteligenciaIaExperimentacion/components/IntelligenceHeader`  
**Descripción**: Generador de OKRs y backlog. Exportable. Seguimiento de progreso.

### 🧑‍🤝‍🧑 COLABORACIÓN Y EJECUCIÓN

**US-II-20**: Como Entrenador personal, Quiero asignar dueños a insights/playbooks y ver su progreso, Para asegurar ejecución.  
**Feature**: `src/features/InteligenciaIaExperimentacion/components/PlaybookLibrary`  
**Descripción**: Campo responsable, estado, fechas. Notificaciones y checklist IA.

**US-II-21**: Como Entrenador personal, Quiero aprobar experimentos/playbooks desde móvil con resumen IA, Para mantener velocidad.  
**Feature**: `src/features/InteligenciaIaExperimentacion`  
**Descripción**: UI responsiva con highlight (“Impacto estimado alto”). Botones aprobar/posponer/descartar.

**US-II-22**: Como Entrenador personal, Quiero sincronizar playbooks con otras sedes o entrenadores, Para escalar mi metodología.  
**Feature**: `src/features/InteligenciaIaExperimentacion/components/PlaybookLibrary`  
**Descripción**: Compartir playbook con permisos, track de adopción, métricas comparativas.

### 🔄 APRENDIZAJE DEL SISTEMA

**US-II-23**: Como Entrenador personal, Quiero que la IA aprenda de mis decisiones (qué playbooks acepto/rechazo), Para refinar futuras recomendaciones.  
**Feature**: `src/features/InteligenciaIaExperimentacion/services/intelligenceService`  
**Descripción**: Registro de feedback. Ajuste de motor de scoring y prompts. Dashboard “Preferencias aprendidas”.

**US-II-24**: Como Entrenador personal, Quiero que el sistema evalúe automáticamente el impacto de cada iniciativa y me diga si repetirla, Para optimizar recursos.  
**Feature**: `src/features/InteligenciaIaExperimentacion/components/IntelligenceMetrics`  
**Descripción**: Análisis post ejecución con IA. Score “Repetir / Ajustar / Descartar”. Botón “Duplicar con mejoras”.

**US-II-25**: Como Entrenador personal, Quiero recibir retrospectivas IA mensuales que celebren logros y marquen próximos focos, Para mantener motivación y claridad.  
**Feature**: `src/features/InteligenciaIaExperimentacion/components/IntelligenceHeader`  
**Descripción**: Resumen narrativo, insights clave, top playbooks, próximos pasos sugeridos. Export y envío automático.


