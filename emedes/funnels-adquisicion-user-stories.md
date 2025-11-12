## 3. USER STORIES

### 🧬 FUNNELS PERSONALIZADOS AL ENTRENADOR

**US-FA-01**: Como Entrenador personal, Quiero generar funnels recomendados según mi especialidad y objetivos, Para lanzar embudos que reflejen mi propuesta única.  
**Feature**: `src/features/FunnelsAdquisicion`  
**Descripción**: Asistente IA toma datos de `TrainerProfile` y devuelve funnels sugeridos (retos, programas premium, corporativo). Incluye estructura, objetivos y métricas.

**US-FA-02**: Como Entrenador personal, Quiero definir buyer personas y dolores principales en el builder, Para que cada funnel adapte copy y assets automáticamente.  
**Feature**: `src/features/FunnelsAdquisicion/components/FunnelBuilder`  
**Descripción**: Paso “Audiencia”. Selección múltiple + notas IA. Información se refleja en mensajes, formularios y IA prompts.

**US-FA-03**: Como Entrenador personal, Quiero guardar mis configuraciones de tono y CTA favoritos, Para reutilizarlos en funnels nuevos.  
**Feature**: `src/features/FunnelsAdquisicion`  
**Descripción**: Librería de presets (p.ej. “Desafío 21 días”, “Sesión estratégica”). Botón “Aplicar a funnel”.

### 📣 GENERACIÓN IA DE LEAD MAGNETS Y LANDINGS

**US-FA-04**: Como Entrenador personal, Quiero que la Lead Magnet Factory me sugiera formatos según mi avatar (guía nutricional, checklist HIIT, mini-curso), Para ofrecer recursos que conecten.  
**Feature**: `src/features/FunnelsAdquisicion/components/LeadMagnetFactory`  
**Descripción**: IA propone ideas con título, promesa, formato y CTA. Botón “Generar recursos” crea copy y prompts de diseño.

**US-FA-05**: Como Entrenador personal, Quiero generar el copy completo de la landing page con IA en mi tono, Para publicarla sin redacción extensa.  
**Feature**: `src/features/FunnelsAdquisicion/components/LandingPageEditor`  
**Descripción**: Sección “Copy IA” con prompts dinámicos (beneficios, pruebas sociales, FAQ). Vista previa editable.

**US-FA-06**: Como Entrenador personal, Quiero que la IA cree formularios inteligentes que capturen datos relevantes (objetivos, disponibilidad), Para nutrir campañas posteriores.  
**Feature**: `src/features/FunnelsAdquisicion/services/funnelsAdquisicionService`  
**Descripción**: Generador de campos con lógica condicional. Opciones de preguntas personalizadas según tipo de funnel.

### 🚀 OPTIMIZACIÓN Y TESTING

**US-FA-07**: Como Entrenador personal, Quiero ejecutar A/B tests guiados por IA (copy, oferta, formato), Para mejorar conversiones rápidamente.  
**Feature**: `src/features/FunnelsAdquisicion/components/FunnelExperiments`  
**Descripción**: Crear variantes con copy IA alternativo. Dashboard compara resultados y sugiere ganador.

**US-FA-08**: Como Entrenador personal, Quiero que el sistema identifique cuellos de botella por etapa (visitas, formulario, cierre), Para saber dónde actuar.  
**Feature**: `src/features/FunnelsAdquisicion/components/FunnelPerformance`  
**Descripción**: Visual funnel con semáforos. Tooltip IA con acciones recomendadas (mejorar oferta, nutrir leads fríos, etc.).

**US-FA-09**: Como Entrenador personal, Quiero recibir recomendaciones de nurturing según respuestas del lead magnet, Para personalizar follow-ups.  
**Feature**: `src/features/FunnelsAdquisicion/components/LeadNurturingSuggestions`  
**Descripción**: IA analiza campos capturados y propone secuencias segmentadas; envía plan a Campañas & Automatización.

### 🤝 INTEGRACIONES Y HANDOFF

**US-FA-10**: Como Entrenador personal, Quiero enviar un funnel a Campañas & Automatización con todos los assets (mensajes, listas, timing), Para activarlo sin duplicar trabajo.  
**Feature**: `src/features/FunnelsAdquisicion`  
**Descripción**: Botón “Activar funnel” crea secuencia en módulo de campañas con plantillas IA.

**US-FA-11**: Como Entrenador personal, Quiero convertir rápidamente un funnel en reto/comunidad, Para maximizar engagement posterior.  
**Feature**: `src/features/FunnelsAdquisicion`  
**Descripción**: CTA “Crear reto desde funnel” abre Eventos & Retos con información precargada.

**US-FA-12**: Como Entrenador personal, Quiero conectar mis funnels con contenidos existentes (reels top, testimonios), Para reforzar prueba social.  
**Feature**: `src/features/FunnelsAdquisicion/components/FunnelAssets`  
**Descripción**: Selector de assets de Content Studio. IA recomienda combinaciones basadas en performance.

### 📊 MONITOREO DE IMPACTO

**US-FA-13**: Como Entrenador personal, Quiero ver el revenue proyectado por funnel según capacidad y precios, Para priorizar esfuerzos.  
**Feature**: `src/features/FunnelsAdquisicion/components/MetricCards`  
**Descripción**: Cálculo automático con escenarios. IA recomienda ajustes (subir precio, limitar cupos, upsell).

**US-FA-14**: Como Entrenador personal, Quiero recibir alertas si un funnel de captación no genera leads suficientes antes de una campaña, Para tomar medidas preventivas.  
**Feature**: `src/features/FunnelsAdquisicion/services/funnelsAdquisicionService`  
**Descripción**: Monitoreo continuo + notificación. Sugerencias IA (reforzar ads, generar contenido, lanzar promo flash).

**US-FA-15**: Como Entrenador personal, Quiero registrar notas cualitativas de cada funnel (feedback de prospectos), Para mejorar las siguientes iteraciones.  
**Feature**: `src/features/FunnelsAdquisicion/components/FunnelNotes`  
**Descripción**: Timeline colaborativo. IA resume insights y propone cambios.

### 🔄 APRENDIZAJE DEL SISTEMA

**US-FA-16**: Como Entrenador personal, Quiero que la IA aprenda qué tipos de propuestas cierro mejor, Para priorizar ideas similares.  
**Feature**: `src/features/FunnelsAdquisicion/services/funnelsAdquisicionService`  
**Descripción**: Motor de recomendaciones con feedback de cierre. Dashboard “Mejores cierres” por arquetipo.

**US-FA-17**: Como Entrenador personal, Quiero que los funnels se actualicen con insights de Comunidad & Fidelización (testimonios, NPS), Para reforzar credibilidad automáticamente.  
**Feature**: `src/features/FunnelsAdquisicion/components/FunnelAssets`  
**Descripción**: Integración que sugiere testimonios frescos. IA redacta versiones y CTA específicos.

**US-FA-18**: Como Entrenador personal, Quiero plantillas IA para follow-up post registro (WhatsApp + email) con mi tono, Para cerrar la venta rápidamente.  
**Feature**: `src/features/FunnelsAdquisicion/components/FunnelFollowUp`  
**Descripción**: Biblioteca de mensajes IA (primer contacto, recordatorio, urgencia). Se envían a Campañas & Automatización.

### 📅 GESTIÓN OPERATIVA

**US-FA-19**: Como Entrenador personal, Quiero ver un calendario de lanzamientos y fases del funnel, Para coordinarme con mi equipo.  
**Feature**: `src/features/FunnelsAdquisicion/components/LaunchTimeline`  
**Descripción**: Roadmap visual (pre-lanzamiento, nurturing, cierre). Tareas IA sugeridas con due dates.

**US-FA-20**: Como Entrenador personal, Quiero compartir con mi community manager un resumen IA del funnel, Para que ejecute contenido y anuncios consistentes.  
**Feature**: `src/features/FunnelsAdquisicion/components/FunnelSummary`  
**Descripción**: Exportacion PDF/Notion con copy base, assets, timetable, KPIs esperados.

**US-FA-21**: Como Entrenador personal, Quiero actualizar un funnel una vez finalizado con resultados reales y aprendizajes, Para documentar iteraciones.  
**Feature**: `src/features/FunnelsAdquisicion/components/FunnelRetrospective`  
**Descripción**: Formulario post-campaña. IA crea checklist con mejoras y lo envía a Inteligencia IA.


