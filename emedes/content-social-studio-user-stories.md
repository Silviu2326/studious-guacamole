## 3. USER STORIES

### 🧬 PERFIL CREATIVO DEL ENTRENADOR

**US-CS-01**: Como Entrenador personal, Quiero configurar mi voz creativa (tono, palabras prohibidas, pilares temáticos), Para que todos los contenidos IA hablen como yo.  
**Feature**: `src/features/ContentSocialStudio`  
**Descripción**: Panel “Perfil creativo” conectado a `TrainerProfile`. Campos para tono, diferenciadores, storytelling típico. Impacta todos los generadores.

**US-CS-02**: Como Entrenador personal, Quiero definir mis formatos estrella (reels, carruseles, emails), Para que la IA los priorice en ideas y planning.  
**Feature**: `src/features/ContentSocialStudio/components/PlannerSchedulePreview`  
**Descripción**: Preferencias guardadas que ordenan backlog, IA sugiere % de distribución y recicla contenido ganador.

**US-CS-03**: Como Entrenador personal, Quiero especificar mis nichos principales (ejecutivos, postparto, alto rendimiento), Para que cada idea incluya ángulos adaptados.  
**Feature**: `src/features/ContentSocialStudio/components/AIContentWorkbench`  
**Descripción**: IA genera variantes por nicho con CTA personalizados. Toggle para activar/ocultar.

### 💡 IDEACIÓN Y WORKBENCH IA

**US-CS-04**: Como Entrenador personal, Quiero recibir un calendario IA semanal con ganchos, copy, CTA y hook audiovisual, Para publicar sin pensar mucho.  
**Feature**: `src/features/ContentSocialStudio/components/PlannerSchedulePreview`  
**Descripción**: IA crea plan día a día. Botón “Enviar a Planner” bloquea fechas. Plantillas exportables a Trello/Notion.

**US-CS-05**: Como Entrenador personal, Quiero generar contenido IA tipo “Transformación del cliente” usando mis datos reales, Para mostrar prueba social creíble.  
**Feature**: `src/features/ContentSocialStudio/components/ClientTransformationPostGenerator`  
**Descripción**: Toma métricas de Comunidad & Fidelización. Genera storytelling, quotes, CTA. Opciones para carrusel, reel, email.

**US-CS-06**: Como Entrenador personal, Quiero prompts rápidos para crear scripts de video alineados a mi estilo (energético vs calmado), Para grabar sin improvisar.  
**Feature**: `src/features/ContentSocialStudio/components/VideoStudioSpotlight`  
**Descripción**: IA genera guion, storyboard, CTA y notas de edición. Export a teleprompter app.

**US-CS-07**: Como Entrenador personal, Quiero plantillas IA para educar, inspirar y vender, Para mezclar formatos equilibradamente.  
**Feature**: `src/features/ContentSocialStudio/components/PromotionalContentTemplates`  
**Descripción**: Biblioteca con tres pilares. Cada plantilla se personaliza según perfil. Métricas asociadas.

### 📅 PLANIFICACIÓN Y AMPLIFICACIÓN

**US-CS-08**: Como Entrenador personal, Quiero que el Planner me avise de huecos en mi calendario editorial, Para rellenarlos con ideas IA en 1 clic.  
**Feature**: `src/features/ContentSocialStudio/components/PlannerSchedulePreview`  
**Descripción**: Detección de días vacíos y recomendación IA (tema + formato + CTA). Botón para agendar y enviar a redes.

**US-CS-09**: Como Entrenador personal, Quiero orquestar un lanzamiento completo (teasing, apertura, cierre) desde Content Studio, Para coordinar con funnels y campañas.  
**Feature**: `src/features/ContentSocialStudio/components/ModuleHighlights`  
**Descripción**: Modo “Lanzamiento” con fases predefinidas. IA conecta con Funnels y Campañas para asegurar coherencia.

**US-CS-10**: Como Entrenador personal, Quiero que el sistema recicle contenido ganador en nuevos formatos (blog → reel), Para maximizar alcance.  
**Feature**: `src/features/ContentSocialStudio/components/ClipperHighlights`  
**Descripción**: Detecta piezas top y ofrece versión adaptada (guion, copy, CTA). Recordatorio para re-publicar.

### 🔗 SINCRONIZACIÓN MULTIMÓDULO

**US-CS-11**: Como Entrenador personal, Quiero enviar contenido aprobado directamente a Campañas & Automatización, Para incluirlo en secuencias email/WhatsApp.  
**Feature**: `src/features/ContentSocialStudio/components/AIContentWorkbench`  
**Descripción**: Botón “Agregar a campaña” que crea asset en biblioteca de mensajes con copy y elementos visuales.

**US-CS-12**: Como Entrenador personal, Quiero vincular piezas clave a mis funnels activos, Para reforzar nurtures.  
**Feature**: `src/features/ContentSocialStudio`  
**Descripción**: Tag “Apoya funnel X”. IA sugiere CTAs y landing adecuada. Track de performance vinculado.

**US-CS-13**: Como Entrenador personal, Quiero que eventos/reto generen automáticamente kit de contenidos (invitación, recordatorio, recap), Para amplificarlos rápido.  
**Feature**: `src/features/ContentSocialStudio/components/ModuleHighlights`  
**Descripción**: Integración con Eventos & Retos. IA produce piezas para cada fase y agenda en Planner.

### 📊 ANALÍTICA IA Y FEEDBACK

**US-CS-14**: Como Entrenador personal, Quiero un dashboard que muestre qué piezas generan más leads/ventas, Para priorizar esas líneas.  
**Feature**: `src/features/ContentSocialStudio/components/ContentLeadAnalytics`  
**Descripción**: Métricas cruzadas con funnels y campañas. IA explica por qué funcionaron y sugiere próximos pasos.

**US-CS-15**: Como Entrenador personal, Quiero recibir retroalimentación IA sobre mi contenido (claridad, CTA, coherencia), Para mejorar cada publicación.  
**Feature**: `src/features/ContentSocialStudio/components/AIContentWorkbench`  
**Descripción**: Evaluación antes de publicar con score personalizado y recomendaciones precisas.

**US-CS-16**: Como Entrenador personal, Quiero guardar aprendizajes por formato/nicho, Para que la IA los considere en futuras ideas.  
**Feature**: `src/features/ContentSocialStudio/components/InternalContentIdeasGenerator`  
**Descripción**: Sistema de notas + feedback. IA actualiza prompt base y prioriza temas según resultados.

### 🧑‍🤝‍🧑 COLABORACIÓN Y OPERACIONES

**US-CS-17**: Como Entrenador personal, Quiero asignar piezas de contenido a mi equipo (editor video, diseñador), Para que sepan qué y cómo producir.  
**Feature**: `src/features/ContentSocialStudio/components/PlannerSchedulePreview`  
**Descripción**: Workflow con responsables, deadlines, checklist IA. Comentarios y versionado.

**US-CS-18**: Como Entrenador personal, Quiero aprobar contenido desde el móvil con preview IA, Para mantener cadencia.  
**Feature**: `src/features/ContentSocialStudio`  
**Descripción**: UI responsive con resumen IA del objetivo, copy, ganchos. Botón aprobar/editar con sugerencias automáticas.

**US-CS-19**: Como Entrenador personal, Quiero generar kits de marca coherentes (paleta, tipografías, slogans), Para entregar a mi equipo externo.  
**Feature**: `src/features/ContentSocialStudio/components/BrandProfileConfig`  
**Descripción**: Sección con documentación IA auto-generada. Export PDF/Notion. Versionado histórico.

### 🔄 APRENDIZAJE CONTINUO

**US-CS-20**: Como Entrenador personal, Quiero que la IA aprenda qué estilos visuales obtienen más engagement, Para recomendarme formatos similares.  
**Feature**: `src/features/ContentSocialStudio/components/ModuleHighlights`  
**Descripción**: Analiza color, duración, estructura. IA sugiere “Estilo ganador” y crea plantilla.

**US-CS-21**: Como Entrenador personal, Quiero que la plataforma detecte temas saturados y proponga giros creativos, Para mantener frescura.  
**Feature**: `src/features/ContentSocialStudio/components/InternalContentIdeasGenerator`  
**Descripción**: IA analiza repetición de temas, engagement decreciente. Sugiere nuevos ángulos alineados al perfil.

**US-CS-22**: Como Entrenador personal, Quiero recibir insights IA post campaña (qué contenido impactó más a cada buyer persona), Para afinar mis mensajes.  
**Feature**: `src/features/ContentSocialStudio/components/ContentLeadAnalytics`  
**Descripción**: Reporte segmentado con recomendaciones y CTA para replicar ganadores en próximos ciclos.


