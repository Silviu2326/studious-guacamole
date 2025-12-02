## 3. USER STORIES

### 🧬 CONFIGURACIÓN PERSONALIZADA DEL ENTRENADOR

**US-CA-01**: Como Entrenador personal, Quiero que el panel importe mi tono, buyer persona y oferta principal desde el perfil estratégico, Para que todas las plantillas y secuencias respeten mi voz.  
**Feature**: `src/features/CampanasAutomatizacion`  
**Descripción**: Context provider consume `TrainerProfile`. Vista previa de copy IA siempre refleja tono escogido. Botón para ajustar micro-tono por campaña.

**US-CA-02**: Como Entrenador personal, Quiero definir objetivos de la campaña (captar, reactivar, fidelizar) desde Mission Control, Para que el sistema sugiera journeys y canales óptimos.  
**Feature**: `src/features/CampanasAutomatizacion/components/AutomationsCentralPanel`  
**Descripción**: Selector de objetivo + impacto en sugerencias IA, métricas clave y playbooks recomendados.

### 🚀 LANZAMIENTO RÁPIDO CON IA

**US-CA-03**: Como Entrenador personal, Quiero generar una campaña 360 (email + WhatsApp + DM) con IA en 3 pasos, Para activarla sin escribir desde cero.  
**Feature**: `src/features/CampanasAutomatizacion/components/MultiChannelCampaigns`  
**Descripción**: Wizard con prompts (objetivo, oferta, CTA, urgencia). IA genera secuencia cohesiva, segmentación sugerida y calendario.

**US-CA-04**: Como Entrenador personal, Quiero plantillas IA especializadas (retos 30 días, upsell packs, recuperación inactivos), Para reutilizarlas fácilmente.  
**Feature**: `src/features/CampanasAutomatizacion/components/PromotionalCampaigns`  
**Descripción**: Biblioteca categorizada con copy multi canal, assets sugeridos y formularios. Etiquetas de éxito y tasa histórica.

**US-CA-05**: Como Entrenador personal, Quiero que la IA me proponga secuencias automáticas post lead magnet, Para dar seguimiento coherente con el funnel.  
**Feature**: `src/features/CampanasAutomatizacion/components/LifecycleSequences`  
**Descripción**: Importa datos del funnel seleccionado. Genera mensajes y delays recomendados, con ajustes por buyer persona.

### 🤖 AUTOMATIZACIONES INTELIGENTES

**US-CA-06**: Como Entrenador personal, Quiero que el sistema defina triggers basados en acciones de mis clientes (reserva sesión, falta a clase), Para enviar mensajes contextuales.  
**Feature**: `src/features/CampanasAutomatizacion/components/MessagingAutomations`  
**Descripción**: Lista de disparadores predefinidos + posibilidad de crear nuevos. IA propone copy alineado y canal óptimo.

**US-CA-07**: Como Entrenador personal, Quiero automatizar recordatorios con IA que adapten el mensaje al historial del cliente, Para aumentar asistencia.  
**Feature**: `src/features/CampanasAutomatizacion/components/SessionReminders`  
**Descripción**: Plantillas que insertan logros previos y tono preferido del cliente. Aprende de confirmaciones para ajustar timing.

**US-CA-08**: Como Entrenador personal, Quiero que el sistema detecte saturación de mensajes y proponga pausas automatizadas, Para no quemar a la audiencia.  
**Feature**: `src/features/CampanasAutomatizacion/components/MessageAlerts`  
**Descripción**: Métricas de fatiga (no abren, se dan de baja). IA sugiere cooling period y contenido de valor.

### 📨 CONTENIDO Y COPY PERSONALIZADO

**US-CA-09**: Como Entrenador personal, Quiero una biblioteca de mensajes IA con mi tono segmentada por objetivo (venta, inspiración, seguimiento), Para seleccionar rápidamente.  
**Feature**: `src/features/CampanasAutomatizacion/components/MessageTemplatesLibrary`  
**Descripción**: Categorías + filtros (canal, buyer persona). Evaluación histórica de performance. Botón “Aplicar inmediatamente”.

**US-CA-10**: Como Entrenador personal, Quiero generar newsletters IA basadas en mis highlights semanales, Para nutrir con valor y CTA personalizados.  
**Feature**: `src/features/CampanasAutomatizacion/components/NewsletterEditor`  
**Descripción**: Conecta con Content Studio y Comunidad para jalar logros y testimonios. IA arma estructura + CTA sugerido.

**US-CA-11**: Como Entrenador personal, Quiero prompts rápidos para WhatsApp que incluyan audio/nota de voz sugerida, Para humanizar mis interacciones.  
**Feature**: `src/features/CampanasAutomatizacion/components/MultiChannelCampaigns`  
**Descripción**: IA genera guion para audio + texto soporte. Botón para descargar script o enviar a app móvil.

### 🎯 SEGMENTACIÓN DINÁMICA

**US-CA-12**: Como Entrenador personal, Quiero crear segmentos inteligentes basados en progreso de entrenamientos, Para personalizar mensajes.  
**Feature**: `src/features/CampanasAutomatizacion/components/ClientSegmentation`  
**Descripción**: Condiciones predefinidas (cumplimiento plan, asistencia eventos). IA sugiere micro segmentos y mensajes.

**US-CA-13**: Como Entrenador personal, Quiero que los segmentos se auto-actualicen con feedback y NPS, Para nutrir embajadores o recuperar detractores.  
**Feature**: `src/features/CampanasAutomatizacion`  
**Descripción**: Integración con Comunidad & Fidelización. Etiqueta leads como promoters/detractors. IA genera campañas específicas.

**US-CA-14**: Como Entrenador personal, Quiero ver un mapa de calor IA de horarios preferidos de envío, Para maximizar aperturas y respuestas.  
**Feature**: `src/features/CampanasAutomatizacion/components/PreferredSendingSchedules`  
**Descripción**: Dashboard con recomendación por canal y segmento. Botón “Aplicar a campaña actual”.

### 📊 CONTROL Y MEDICIÓN

**US-CA-15**: Como Entrenador personal, Quiero KPIs accionables que relacionen mensajes enviados con reservas y ventas, Para entender el impacto real.  
**Feature**: `src/features/CampanasAutomatizacion/components/MetricCards`  
**Descripción**: KPIs con narrativa IA (“Tu secuencia HIIT generó 6 reservas”). Comparativa por campaña y canal.

**US-CA-16**: Como Entrenador personal, Quiero un tablero de experimentos que compare versiones IA vs edición humana, Para elegir mejor copy.  
**Feature**: `src/features/CampanasAutomatizacion/components/MultiStepSequenceBuilder`  
**Descripción**: Tracking de resultados con tags “IA puro / Ajustado”. Recomendación basada en datos.

**US-CA-17**: Como Entrenador personal, Quiero recibir insights IA semanales con mejoras concretas (cambiar CTA, ajustar delay), Para iterar sin analizar a mano.  
**Feature**: `src/features/CampanasAutomatizacion/components/AutomationRoadmap`  
**Descripción**: Resumen automático, priorizado por impacto. Botón “Aplicar cambio” ejecuta en la secuencia.

### 🧑‍🤝‍🧑 COLABORACIÓN Y WORKFLOW

**US-CA-18**: Como Entrenador personal, Quiero asignar tareas a mi equipo (copywriter, CM) desde la campaña, Para que ejecuten sus partes con contexto.  
**Feature**: `src/features/CampanasAutomatizacion/components/ReportExporter`  
**Descripción**: Checklist IA con responsables, deadlines, assets. Comentarios colaborativos y seguimiento de estado.

**US-CA-19**: Como Entrenador personal, Quiero exportar playbooks IA con todo el contenido y programación, Para compartir con socios o franquicias.  
**Feature**: `src/features/CampanasAutomatizacion/components/MultiChannelCampaigns`  
**Descripción**: Export formato PDF/Notion con copy, cronograma, métricas esperadas, instrucciones por canal.

**US-CA-20**: Como Entrenador personal, Quiero aprobar campañas desde el móvil con vista previa clara, Para mantener velocidad.  
**Feature**: `src/features/CampanasAutomatizacion`  
**Descripción**: Responsive simplificado. Botón aprobar/rechazar. IA resume impacto estimado y cambios recientes.

### 🔄 APRENDIZAJE Y MEJORA CONTINUA

**US-CA-21**: Como Entrenador personal, Quiero que el sistema aprenda de mis campañas más exitosas y recomiende repetirlas, Para capitalizar lo probado.  
**Feature**: `src/features/CampanasAutomatizacion/services/campanasAutomatizacionService`  
**Descripción**: Analiza KPIs, audiencia, mensajes. IA propone “Play de la semana” con one-click deploy.

**US-CA-22**: Como Entrenador personal, Quiero que la IA detecte gaps en mis journeys (falta mensaje post-compra), Para completarlos automáticamente.  
**Feature**: `src/features/CampanasAutomatizacion/components/JourneyAuditor`  
**Descripción**: Auditoría IA de secuencias. Sugiere añadir pasos con copy pre-generado y timing sugerido.

**US-CA-23**: Como Entrenador personal, Quiero recibir recomendaciones para nuevos canales (SMS, bots) cuando tenga sentido, Para expandir alcance sin improvisar.  
**Feature**: `src/features/CampanasAutomatizacion/components/ChannelHealth`  
**Descripción**: Evalúa desempeño actual y saturación. IA sugiere canal alternativo con plan de implementación paso a paso.


