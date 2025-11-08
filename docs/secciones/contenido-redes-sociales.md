# Contenido & Redes Sociales — Diagnóstico funcional y de producto

## 1) Mapa de páginas de la sección

### Páginas principales

#### `/dashboard/marketing/social-planner` — Planner de Redes Sociales
- **Componente raíz**: `src/features/PlannerDeRedesSociales/pages/PlannerDeRedesSocialesPage.tsx`
- **Componentes hijos**:
  - `SocialPlannerCalendar` (`src/features/PlannerDeRedesSociales/components/SocialPlannerCalendar.tsx`)
  - `PostCreatorModal` (`src/features/PlannerDeRedesSociales/components/PostCreatorModal.tsx`)
  - `PostCard` (`src/features/PlannerDeRedesSociales/components/PostCard.tsx`)
- **API**: `src/features/PlannerDeRedesSociales/api/social.ts`
- **Estados**:
  - Loading: `isLoading` con `Loader2` spinner
  - Error: Card con `AlertCircle` y mensaje de error
  - Vacío: Calendar vacío con posts vacíos
- **Guardias**: No hay guardias de autenticación explícitas (depende de Layout)

#### `/dashboard/marketing/ia-generator` — Generador Creativo con IA
- **Componente raíz**: `src/features/GeneradorCreativoConIa/pages/GeneradorCreativoConIaPage.tsx`
- **Componentes hijos**:
  - `GenerationForm` (`src/features/GeneradorCreativoConIa/components/GenerationForm.tsx`)
  - `ResultCard` (`src/features/GeneradorCreativoConIa/components/ResultCard.tsx`)
- **API**: `src/features/GeneradorCreativoConIa/api/generator.ts`
- **Estados**:
  - Loading: `isLoading` con `Loader2` spinner y mensaje "Generando contenido con IA..."
  - Error: Card con `AlertCircle` y botón de reintentar
  - Vacío: Formulario vacío listo para generar
- **Guardias**: No hay guardias explícitas (depende de Layout)

#### `/dashboard/marketing/ia-estrategias` — Generador de Estrategias de Marketing con IA
- **Componente raíz**: `src/features/GeneradorDeEstrategiasDeMarketingConIa/pages/GeneradorDeEstrategiasDeMarketingConIaPage.tsx`
- **Componentes hijos**:
  - `StrategyGeneratorWizard` (`src/features/GeneradorDeEstrategiasDeMarketingConIa/components/StrategyGeneratorWizard.tsx`)
  - `StrategyOutputDisplay` (`src/features/GeneradorDeEstrategiasDeMarketingConIa/components/StrategyOutputDisplay.tsx`)
  - `TitledInputSection` (`src/features/GeneradorDeEstrategiasDeMarketingConIa/components/TitledInputSection.tsx`)
- **API**: `src/features/GeneradorDeEstrategiasDeMarketingConIa/api/strategies.ts`
- **Estados**:
  - Loading: `isLoading` con spinner durante generación
  - Error: Card rojo con `AlertCircle` y mensaje de error
  - Vacío: Wizard en primer paso
- **Guardias**: No hay guardias explícitas (depende de Layout)

#### `/dashboard/contenido/generador-ia` — Generador de Ideas de Contenido con IA
- **Componente raíz**: `src/features/GeneradorDeIdeasDeContenidoConIa/pages/GeneradorDeIdeasDeContenidoConIaPage.tsx`
- **Componentes hijos**:
  - `ContentIdeaGeneratorContainer` (`src/features/GeneradorDeIdeasDeContenidoConIa/components/ContentIdeaGeneratorContainer.tsx`)
  - `GeneratorForm` (`src/features/GeneradorDeIdeasDeContenidoConIa/components/GeneratorForm.tsx`)
  - `IdeaCard` (`src/features/GeneradorDeIdeasDeContenidoConIa/components/IdeaCard.tsx`)
- **API**: `src/features/GeneradorDeIdeasDeContenidoConIa/api/contentIdeas.ts`
- **Estados**:
  - Loading: `isLoading` con `Loader2` spinner
  - Error: Card con `AlertCircle` y mensaje de error
  - Vacío: Formulario vacío listo para generar ideas
- **Guardias**: No hay guardias explícitas (depende de Layout)

#### `/dashboard/content/clipper` — Content Clipper
- **Componente raíz**: `src/features/ContentClipper/pages/ContentClipperPage.tsx`
- **Componentes hijos**:
  - `ContentClipperDashboard` (`src/features/ContentClipper/components/ContentClipperDashboard.tsx`)
  - `ClippedContentCard` (`src/features/ContentClipper/components/ClippedContentCard.tsx`)
  - `AddContentModal` (`src/features/ContentClipper/components/AddContentModal.tsx`)
- **API**: `src/features/ContentClipper/api/clips.ts`
- **Estados**:
  - Loading: `isLoading` con `Loader2` spinner
  - Error: Card con `AlertCircle` y mensaje de error
  - Vacío: Mensaje "No hay contenido guardado aún" con botón para agregar
- **Guardias**: No hay guardias explícitas (depende de Layout)

#### `/dashboard/marketing/influencers` — Creator/Influencer Content Syndication
- **Componente raíz**: `src/features/CreatorinfluencerContentSyndication/pages/CreatorinfluencerContentSyndicationPage.tsx`
- **Componentes hijos**:
  - `InfluencerDashboardContainer` (`src/features/CreatorinfluencerContentSyndication/components/InfluencerDashboardContainer.tsx`)
  - `InfluencerListTable` (`src/features/CreatorinfluencerContentSyndication/components/InfluencerListTable.tsx`)
  - `CampaignFormModal` (`src/features/CreatorinfluencerContentSyndication/components/CampaignFormModal.tsx`)
- **API**: `src/features/CreatorinfluencerContentSyndication/api/influencers.ts`
- **Estados**:
  - Loading: `isLoading` con `Loader2` spinner
  - Error: Card con `AlertCircle` y mensaje de error
  - Vacío: Tabla vacía con mensaje "No hay influencers registrados"
- **Guardias**: No hay guardias explícitas (depende de Layout)

#### `/dashboard/content/video-studio` — Video Marketing & Automation
- **Componente raíz**: `src/features/VideoMarketingYAutomation/pages/VideoMarketingYAutomationPage.tsx`
- **Componentes hijos**: No hay componentes hijos implementados (solo estructura básica)
- **API**: `src/features/VideoMarketingYAutomation/api/videos.ts`
- **Estados**:
  - Loading: No implementado explícitamente
  - Error: No implementado explícitamente
  - Vacío: Estados vacíos en "Mis Proyectos", "Top Videos", "Plantillas" y "Biblioteca de Medios"
- **Guardias**: No hay guardias explícitas (depende de Layout)

#### `/dashboard/contenido/ugc-hub` — Hub de Contenidos & UGC
- **Componente raíz**: `src/features/HubDeContenidosYUgc/pages/HubDeContenidosYUgcPage.tsx`
- **Componentes hijos**:
  - `UgcHubContainer` (`src/features/HubDeContenidosYUgc/components/UgcHubContainer.tsx`)
  - `ContentCard` (`src/features/HubDeContenidosYUgc/components/ContentCard.tsx`)
  - `ConsentRequestModal` (`src/features/HubDeContenidosYUgc/components/ConsentRequestModal.tsx`)
- **API**: `src/features/HubDeContenidosYUgc/api/ugc.ts`
- **Estados**:
  - Loading: `isLoading` con `Loader2` spinner
  - Error: Card con `AlertCircle` y mensaje de error
  - Vacío: Grid vacío con mensaje "No hay contenido UGC disponible"
- **Guardias**: No hay guardias explícitas (depende de Layout)

---

## 2) 10 problemas que hoy SÍ resuelve

### 1. **Planificación y Programación de Contenido en Redes Sociales**
**Página(s)**: `/dashboard/marketing/social-planner` (Planner de Redes Sociales)

**Problema cubierto**: No hay forma de planificar y programar publicaciones en múltiples redes sociales desde un solo lugar, lo que causa desorganización y pérdida de tiempo.

**Como lo resuelve el código**:
- `SocialPlannerCalendar` (`src/features/PlannerDeRedesSociales/components/SocialPlannerCalendar.tsx`) muestra vista semanal/mensual con posts programados
- `PostCreatorModal` permite crear/editar posts con selección de plataformas (Instagram, Facebook, TikTok, etc.)
- `getSocialPosts` y `createSocialPost` en API gestionan posts programados con fechas y horas
- Vista de calendario visual con navegación por semanas/meses

**Riesgos/limitaciones**: 
- No hay integración real con APIs de redes sociales (solo mock)
- Falta validación de límites de publicación por plataforma
- No hay sincronización automática con redes conectadas

### 2. **Generación de Contenido Creativo con IA Personalizada**
**Página(s)**: `/dashboard/marketing/ia-generator` (Generador Creativo con IA)

**Problema cubierto**: Crear contenido de marketing de calidad requiere tiempo y creatividad constante, generando bloqueo creativo.

**Como lo resuelve el código**:
- `GenerationForm` (`src/features/GeneradorCreativoConIa/components/GenerationForm.tsx`) permite seleccionar plantillas (post, story, email, etc.)
- Integración con perfil de marca (`getBrandProfile`) para personalizar tono y estilo
- `useAIGeneration` hook gestiona llamadas a API de IA con múltiples variantes
- `ResultCard` muestra resultados con opciones de copiar y guardar

**Riesgos/limitaciones**:
- API de IA es mock (no hay integración real con OpenAI/Claude)
- No hay límites de uso o costos de tokens visibles
- Falta validación de calidad del contenido generado

### 3. **Generación de Estrategias de Marketing Completas**
**Página(s)**: `/dashboard/marketing/ia-estrategias` (Generador de Estrategias de Marketing)

**Problema cubierto**: Crear estrategias de marketing completas requiere conocimientos especializados y tiempo de planificación.

**Como lo resuelve el código**:
- `StrategyGeneratorWizard` (`src/features/GeneradorDeEstrategiasDeMarketingConIa/components/StrategyGeneratorWizard.tsx`) guía al usuario en 5 pasos
- Recolecta objetivos, audiencia, presupuesto, canales y tono
- `StrategyOutputDisplay` muestra estrategia completa con plan de contenido, tácticas y métricas
- Opciones de exportar a PDF y añadir al calendario (aunque no implementadas)

**Riesgos/limitaciones**:
- Exportación a PDF y calendario son placeholders (no funcionan)
- No hay validación de estrategias generadas
- Falta integración con otros módulos (calendario, campañas)

### 4. **Generación de Ideas de Contenido Alineadas con Objetivos de Negocio**
**Página(s)**: `/dashboard/contenido/generador-ia` (Generador de Ideas de Contenido)

**Problema cubierto**: Generar ideas de contenido relevantes que se alineen con objetivos comerciales es difícil sin herramientas especializadas.

**Como lo resuelve el código**:
- `ContentIdeaGeneratorContainer` (`src/features/GeneradorDeIdeasDeContenidoConIa/components/ContentIdeaGeneratorContainer.tsx`) analiza objetivos y audiencia
- `GeneratorForm` permite especificar objetivo (captar leads, vender, retener), audiencia, formato y tema
- `IdeaCard` muestra cada idea con gancho, descripción y CTA específicos
- Funciones `saveIdea` y `scheduleIdea` permiten guardar y programar ideas

**Riesgos/limitaciones**:
- No hay integración real con CRM para datos de clientes
- Falta sincronización con calendario de eventos del negocio
- Ideas generadas no están validadas contra datos reales

### 5. **Captura y Organización de Contenido de Inspiración**
**Página(s)**: `/dashboard/content/clipper` (Content Clipper)

**Problema cubierto**: Perder referencias valiosas de contenido encontrado en internet, causando bloqueo creativo al planificar.

**Como lo resuelve el código**:
- `ContentClipperDashboard` (`src/features/ContentClipper/components/ContentClipperDashboard.tsx`) permite agregar contenido con URL, título, notas y categorías
- `AddContentModal` facilita captura rápida desde cualquier fuente
- Sistema de categorías y etiquetas para organización
- Búsqueda y filtrado por categoría y texto

**Riesgos/limitaciones**:
- No hay extensión de navegador para captura rápida
- Falta importación automática desde redes sociales
- No hay análisis de contenido capturado (extracción de texto/imágenes)

### 6. **Gestión de Colaboraciones con Influencers**
**Página(s)**: `/dashboard/marketing/influencers` (Creator/Influencer Content Syndication)

**Problema cubierto**: No hay forma de gestionar colaboraciones con influencers, medir ROI y generar códigos de seguimiento.

**Como lo resuelve el código**:
- `InfluencerDashboardContainer` (`src/features/CreatorinfluencerContentSyndication/components/InfluencerDashboardContainer.tsx`) gestiona lista de influencers
- `InfluencerListTable` muestra métricas (seguidores, engagement, ROI)
- `CampaignFormModal` permite crear campañas con términos, códigos y enlaces únicos
- API gestiona influencers, campañas y métricas de seguimiento

**Riesgos/limitaciones**:
- No hay integración real con APIs de redes sociales para métricas
- Códigos de descuento y enlaces no están conectados con sistema de ventas
- Falta seguimiento automático de conversiones

### 7. **Gestión Centralizada de Contenido Generado por Usuarios (UGC)**
**Página(s)**: `/dashboard/contenido/ugc-hub` (Hub de Contenidos & UGC)

**Problema cubierto**: No hay forma centralizada de gestionar testimonios, fotos de transformación y menciones de clientes, perdiendo valioso contenido de marketing.

**Como lo resuelve el código**:
- `UgcHubContainer` (`src/features/HubDeContenidosYUgc/components/UgcHubContainer.tsx`) centraliza todo el UGC
- `ConsentRequestModal` gestiona solicitudes de consentimiento legal
- Sistema de estados (pendiente, aprobado, rechazado) para moderación
- `syncSocialMedia` permite importar desde redes sociales
- Filtros por estado, consentimiento y etiquetas

**Riesgos/limitaciones**:
- Sincronización con redes sociales es mock (no hay integración real)
- Falta validación legal de consentimientos
- No hay exportación automática a otros módulos (landing pages, campañas)

### 8. **Análisis de Rendimiento de Contenido Social**
**Página(s)**: `/dashboard/marketing/social-planner` (Analytics tab)

**Problema cubierto**: No hay forma de analizar qué contenido funciona mejor sin usar múltiples herramientas externas.

**Como lo resuelve el código**:
- `getSocialAnalytics` en API devuelve métricas agregadas (alcance, engagement, crecimiento)
- `MetricCards` muestra resumen de métricas clave
- Lista de "Top Posts" ordenada por engagement y alcance
- Métricas por plataforma y período de tiempo

**Riesgos/limitaciones**:
- Datos son mock (no hay integración real con APIs de redes)
- No hay comparación entre períodos
- Falta análisis de tendencias y recomendaciones

### 9. **Reutilización de Contenido con Plantillas**
**Página(s)**: `/dashboard/marketing/social-planner` (PostCreatorModal con templates)

**Problema cubierto**: Crear contenido desde cero cada vez es ineficiente y causa inconsistencia en la marca.

**Como lo resuelve el código**:
- `getPostTemplates` en API devuelve plantillas predefinidas
- `PostCreatorModal` permite seleccionar template y personalizar
- Plantillas incluyen estructura, formato y hashtags sugeridos
- Guardado de posts como plantillas reutilizables

**Riesgos/limitaciones**:
- No hay editor visual de plantillas
- Falta categorización avanzada de plantillas
- No hay plantillas dinámicas con variables

### 10. **Gestión de Múltiples Cuentas de Redes Sociales**
**Página(s)**: `/dashboard/marketing/social-planner` (Cuentas Conectadas)

**Problema cubierto**: Gestionar múltiples cuentas de Instagram, Facebook, TikTok desde diferentes herramientas es confuso.

**Como lo resuelve el código**:
- `getSocialProfiles` en API devuelve lista de cuentas conectadas
- Vista de cards mostrando plataforma, nombre de usuario, seguidores
- Estado de conexión (conectada/desconectada) con botones de acción
- Selección de múltiples cuentas al crear posts

**Riesgos/limitaciones**:
- Conexión con redes sociales es mock (no hay OAuth real)
- No hay gestión de permisos por cuenta
- Falta sincronización bidireccional de contenido

---

## 3) 10 problemas que AÚN NO resuelve (y debería)

### 1. **Integración Real con APIs de Redes Sociales**
**Necesidad detectada**: Las conexiones con Instagram, Facebook, TikTok son mock. No hay publicación real ni sincronización de datos.

**Propuesta de solución** (alto nivel + impacto):
- Implementar OAuth 2.0 para cada plataforma (Instagram Graph API, Facebook API, TikTok Business API)
- Queue de publicación con reintentos automáticos y manejo de errores
- Sincronización bidireccional: publicaciones desde la app y desde redes sociales
- **Impacto**: Alto - Es la funcionalidad core que falta. Sin esto, la herramienta no es útil en producción.

**Páginas/flujo afectados**: 
- `PlannerDeRedesSocialesPage` (conexión de cuentas y publicación)
- `UgcHubContainer` (sincronización de UGC)
- `InfluencerDashboardContainer` (métricas reales)

**Complejidad estimada**: Alta (requiere tokens, webhooks, manejo de rate limits, actualización de credenciales)

### 2. **Editor Visual de Videos Integrado**
**Necesidad detectada**: Video Studio solo muestra estados vacíos. No hay editor real para crear/editar videos.

**Propuesta de solución** (alto nivel + impacto):
- Integrar editor de video en el navegador (ej: Remotion, FFmpeg.wasm) o usar servicio externo (Cloudinary, Mux)
- Timeline visual con tracks de video, audio, texto y overlays
- Plantillas de video específicas para fitness (transformaciones, workouts, tips)
- Exportación a formatos optimizados por plataforma (Reels, Shorts, Stories)
- **Impacto**: Alto - El video es el formato más efectivo en fitness. Sin editor, la funcionalidad no existe.

**Páginas/flujo afectados**:
- `VideoMarketingYAutomationPage` (necesita implementación completa)
- Nuevo componente `VideoEditor` con timeline y preview

**Complejidad estimada**: Alta (requiere procesamiento de video, storage, CDN, transcoding)

### 3. **Análisis Predictivo de Mejor Momento para Publicar**
**Necesidad detectada**: No hay recomendaciones basadas en datos sobre cuándo publicar para maximizar engagement.

**Propuesta de solución** (alto nivel + impacto):
- Analizar historial de publicaciones y métricas para identificar patrones
- Recomendaciones personalizadas por plataforma y audiencia
- Sugerencias automáticas al programar posts
- Dashboard de "Best Time to Post" con heatmaps
- **Impacto**: Medio - Mejora significativamente el engagement pero requiere datos históricos.

**Páginas/flujo afectados**:
- `SocialPlannerCalendar` (añadir recomendaciones visuales)
- `PostCreatorModal` (sugerencias automáticas de horario)
- Nuevo componente `OptimalPostingTimeAnalyzer`

**Complejidad estimada**: Media (requiere análisis de datos y ML básico)

### 4. **Automatización de Hashtags y Optimización de SEO**
**Necesidad detectada**: No hay sugerencias automáticas de hashtags relevantes ni optimización de SEO para contenido.

**Propuesta de solución** (alto nivel + impacto):
- Analizar contenido generado y sugerir hashtags relevantes por plataforma
- Tracking de hashtags más efectivos históricamente
- Sugerencias de keywords para SEO en posts de blog
- Validación de hashtags trending vs nicho
- **Impacto**: Medio - Mejora alcance orgánico sin costo adicional.

**Páginas/flujo afectados**:
- `PostCreatorModal` (sugerencias de hashtags)
- `GenerationForm` (optimización de contenido generado)
- Nuevo componente `HashtagOptimizer`

**Complejidad estimada**: Baja/Media (requiere base de datos de hashtags y análisis de tendencias)

### 5. **Integración con CRM para Personalización de Contenido**
**Necesidad detectada**: Los generadores de contenido no usan datos reales del CRM (clientes, programas, objetivos).

**Propuesta de solución** (alto nivel + impacto):
- Conectar generadores con datos de CRM (nombres de clientes, programas activos, objetivos)
- Personalización automática de contenido con variables dinámicas
- Sugerencias de contenido basadas en eventos del CRM (cumpleaños, aniversarios, logros)
- **Impacto**: Alto - Contenido más relevante y personalizado aumenta engagement y conversión.

**Páginas/flujo afectados**:
- `ContentIdeaGeneratorContainer` (usar datos de CRM)
- `GenerationForm` (variables dinámicas)
- Integración con módulo CRM

**Complejidad estimada**: Media (requiere integración cross-module y API unificada)

### 6. **Sistema de A/B Testing de Contenido**
**Necesidad detectada**: No hay forma de probar diferentes versiones de contenido para optimizar conversión.

**Propuesta de solución** (alto nivel + impacto):
- Crear variantes de posts y distribuir automáticamente a audiencias similares
- Tracking de métricas por variante (engagement, clicks, conversiones)
- Recomendaciones automáticas de variante ganadora
- Integración con analytics para medir impacto en conversión
- **Impacto**: Alto - Permite optimización continua basada en datos.

**Páginas/flujo afectados**:
- `PostCreatorModal` (opción de crear variantes)
- Nuevo componente `ABTestManager`
- Integración con analytics

**Complejidad estimada**: Media/Alta (requiere asignación de audiencias y tracking avanzado)

### 7. **Extensión de Navegador para Content Clipper**
**Necesidad detectada**: Content Clipper requiere copiar/pegar manual. No hay forma rápida de capturar desde cualquier página web.

**Propuesta de solución** (alto nivel + impacto):
- Extensión Chrome/Firefox que permite capturar contenido con un clic
- Captura automática de imágenes, texto, videos y metadata
- Sincronización automática con la app
- **Impacto**: Alto - Mejora drásticamente la UX y adopción de la herramienta.

**Páginas/flujo afectados**:
- `ContentClipperDashboard` (recibir datos de extensión)
- Nuevo proyecto: extensión de navegador
- API endpoint para recibir clips desde extensión

**Complejidad estimada**: Media (requiere desarrollo de extensión y API)

### 8. **Gestión de Derechos y Licencias de Contenido UGC**
**Necesidad detectada**: ConsentRequestModal es básico. No hay gestión legal completa de derechos de uso.

**Propuesta de solución** (alto nivel + impacto):
- Plantillas de consentimiento legales por jurisdicción (GDPR, CCPA, etc.)
- Tracking de expiración de consentimientos
- Alertas automáticas para renovar consentimientos
- Exportación de documentos legales para auditorías
- **Impacto**: Alto - Protección legal y compliance es crítico para usar UGC comercialmente.

**Páginas/flujo afectados**:
- `ConsentRequestModal` (mejoras legales)
- `UgcHubContainer` (tracking de expiraciones)
- Nuevo componente `LegalComplianceManager`

**Complejidad estimada**: Media (requiere conocimiento legal y plantillas por país)

### 9. **Analytics Cross-Platform y Attribution**
**Necesidad detectada**: Analytics están separados por plataforma. No hay visión unificada de ROI de contenido.

**Propuesta de solución** (alto nivel + impacto):
- Dashboard unificado mostrando métricas agregadas de todas las plataformas
- Attribution tracking: qué contenido genera leads/ventas
- ROI calculado por pieza de contenido y plataforma
- Funnel de conversión desde contenido hasta venta
- **Impacto**: Alto - Permite tomar decisiones basadas en ROI real, no solo engagement.

**Páginas/flujo afectados**:
- Nueva página `ContentAnalyticsDashboard`
- Integración con módulo de ventas y CRM
- Nuevo componente `ROIAttributionTracker`

**Complejidad estimada**: Alta (requiere tracking complejo y integración cross-module)

### 10. **Automatización de Respuestas y Engagement**
**Necesidad detectada**: No hay forma de responder automáticamente a comentarios o gestionar engagement en tiempo real.

**Propuesta de solución** (alto nivel + impacto):
- Bot de respuestas automáticas con IA para comentarios comunes
- Alertas en tiempo real de menciones y comentarios
- Queue de moderación para comentarios que requieren atención humana
- Respuestas personalizadas basadas en contexto del comentario
- **Impacto**: Medio/Alto - Mejora engagement y ahorra tiempo, pero requiere moderación cuidadosa.

**Páginas/flujo afectados**:
- `SocialPlannerCalendar` (añadir vista de comentarios)
- Nuevo componente `EngagementManager`
- Integración con APIs de comentarios

**Complejidad estimada**: Media/Alta (requiere NLP para análisis de comentarios y reglas de negocio)

---

## 4) Hallazgos desde navegación/menús

### Sidebar.tsx

**Estructura de la sección**:
```typescript
{
  id: 'contenido-redes-sociales',
  title: 'Contenido & Redes Sociales',
  icon: Palette,
  items: [
    { id: 'planner-redes-sociales', label: 'Planner de Redes Sociales', ... },
    { id: 'generador-creativo-ia', label: 'Generador Creativo con IA', ... },
    { id: 'generador-estrategias-marketing', label: 'Generador de Estrategias de Marketing con IA', ... },
    { id: 'generador-ideas-contenido', label: 'Generador de Ideas de Contenido con IA', ... },
    { id: 'content-clipper', label: 'Content Clipper', ... },
    { id: 'creatorinfluencer-content-syndication', label: 'Creator/Influencer Content Syndication', ... },
    { id: 'video-studio', label: 'Video Marketing & Automation', ... },
    { id: 'hub-contenidos-ugc', label: 'Hub de Contenidos & UGC', ... },
  ],
}
```

**Permisos y visibilidad**:
- Todos los items son visibles para ambos roles (entrenador y gimnasio)
- No hay restricciones `entrenadorOnly` o `gimnasioOnly`
- No hay badges o contadores de notificaciones

**Inconsistencias de UX o naming**:
1. **Naming inconsistente**: 
   - "Planner de Redes Sociales" vs "Social Planner" (mezcla español/inglés)
   - "Creator/Influencer Content Syndication" (nombre en inglés en una app en español)
   - "Video Marketing & Automation" (nombre en inglés)

2. **Falta de agrupación lógica**: 
   - Los 3 generadores de IA están separados pero son funcionalidades relacionadas
   - Video Studio está al final pero es una herramienta principal

3. **Falta de indicadores visuales**:
   - No hay badges de "nuevo" o "beta" en funcionalidades nuevas
   - No hay indicadores de estado (conectado/desconectado) para cuentas sociales

4. **Rutas inconsistentes**:
   - `/dashboard/marketing/social-planner` (marketing)
   - `/dashboard/content/clipper` (content)
   - `/dashboard/contenido/generador-ia` (contenido en español)
   - Mezcla de inglés/español en rutas

**Sugerencias de mejora**:
- Agrupar generadores de IA en submenú colapsable
- Estandarizar nombres en español o inglés
- Añadir badges de estado para cuentas conectadas
- Unificar prefijos de rutas (`/dashboard/content/` o `/dashboard/marketing/`)

---

## 5) KPIs y métricas recomendadas

### Métricas de adopción
- **Tasa de adopción por herramienta**: % de usuarios que usan cada herramienta al menos una vez al mes
  - Meta: >60% para Planner, >40% para generadores de IA
- **Frecuencia de uso**: Número promedio de sesiones por usuario por semana
  - Meta: >3 sesiones/semana para usuarios activos
- **Retención de usuarios**: % de usuarios que vuelven después del primer uso
  - Meta: >70% retención a 30 días

### Tiempo de tarea
- **Tiempo para crear un post programado**: Desde abrir modal hasta guardar
  - Meta: <2 minutos
- **Tiempo para generar contenido con IA**: Desde formulario hasta resultados
  - Meta: <30 segundos (incluyendo generación)
- **Tiempo para capturar contenido en Clipper**: Desde clic hasta guardado
  - Meta: <10 segundos

### Conversión interna
- **Tasa de publicación real vs programada**: % de posts programados que se publican realmente
  - Meta: >95% (requiere integración real con APIs)
- **Tasa de uso de contenido generado**: % de contenido generado con IA que se usa realmente
  - Meta: >50%
- **Tasa de conversión de ideas a contenido**: % de ideas generadas que se convierten en posts
  - Meta: >30%

### Errores por flujo
- **Errores en publicación**: % de intentos de publicación que fallan
  - Meta: <1%
- **Errores en generación de IA**: % de generaciones que fallan o timeout
  - Meta: <2%
- **Errores de sincronización**: % de sincronizaciones UGC que fallan
  - Meta: <5%

### Latencia clave
- **Tiempo de carga de calendario**: Desde abrir página hasta mostrar calendario
  - Meta: <1 segundo
- **Tiempo de generación de IA**: Desde submit hasta resultados
  - Meta: <15 segundos (depende de proveedor de IA)
- **Tiempo de sincronización UGC**: Desde iniciar sync hasta completar
  - Meta: <30 segundos (depende de volumen)

---

## 6) Backlog priorizado (RICE/MoSCoW)

### MUST (top 3)

#### 1. Integración Real con APIs de Redes Sociales
- **RICE Score**: 
  - Reach: 100% usuarios (todos necesitan publicar)
  - Impact: 10/10 (sin esto, la herramienta no funciona)
  - Confidence: 8/10 (APIs están documentadas)
  - Effort: 8/10 (complejo pero factible)
  - **Score: 10.0**
- **Justificación**: Es la funcionalidad core. Sin publicación real, la herramienta no tiene valor.
- **Esfuerzo estimado**: 6-8 semanas (1 desarrollador full-time)

#### 2. Editor Visual de Videos Funcional
- **RICE Score**:
  - Reach: 80% usuarios (video es formato principal)
  - Impact: 9/10 (diferenciador clave)
  - Confidence: 7/10 (tecnología disponible)
  - Effort: 9/10 (muy complejo)
  - **Score: 8.0**
- **Justificación**: Video Studio está vacío. El video es el formato más efectivo en fitness.
- **Esfuerzo estimado**: 8-10 semanas (1 desarrollador + 1 diseñador)

#### 3. Integración con CRM para Personalización
- **RICE Score**:
  - Reach: 100% usuarios (todos tienen CRM)
  - Impact: 8/10 (mejora significativa de relevancia)
  - Confidence: 9/10 (datos ya existen)
  - Effort: 5/10 (integración cross-module)
  - **Score: 16.0**
- **Justificación**: Contenido personalizado aumenta engagement y conversión.
- **Esfuerzo estimado**: 3-4 semanas (1 desarrollador)

### SHOULD (top 3)

#### 4. Análisis Predictivo de Mejor Momento para Publicar
- **RICE Score**:
  - Reach: 100% usuarios
  - Impact: 7/10 (mejora engagement)
  - Confidence: 8/10 (análisis de datos)
  - Effort: 6/10 (requiere ML básico)
  - **Score: 9.3**
- **Esfuerzo estimado**: 4-5 semanas

#### 5. Extensión de Navegador para Content Clipper
- **RICE Score**:
  - Reach: 100% usuarios (todos navegan web)
  - Impact: 8/10 (mejora UX drásticamente)
  - Confidence: 9/10 (tecnología conocida)
  - Effort: 4/10 (relativamente simple)
  - **Score: 18.0**
- **Esfuerzo estimado**: 2-3 semanas

#### 6. Sistema de A/B Testing de Contenido
- **RICE Score**:
  - Reach: 60% usuarios (solo power users)
  - Impact: 9/10 (optimización continua)
  - Confidence: 7/10 (requiere validación)
  - Effort: 7/10 (complejo)
  - **Score: 5.4**
- **Esfuerzo estimado**: 5-6 semanas

### COULD (top 3)

#### 7. Automatización de Hashtags y Optimización SEO
- **RICE Score**:
  - Reach: 100% usuarios
  - Impact: 6/10 (mejora incremental)
  - Confidence: 8/10
  - Effort: 3/10 (relativamente simple)
  - **Score: 16.0**
- **Esfuerzo estimado**: 2-3 semanas

#### 8. Analytics Cross-Platform y Attribution
- **RICE Score**:
  - Reach: 70% usuarios (solo usuarios avanzados)
  - Impact: 8/10 (muy valioso para optimización)
  - Confidence: 6/10 (complejo de implementar)
  - Effort: 8/10 (muy complejo)
  - **Score: 4.2**
- **Esfuerzo estimado**: 6-8 semanas

#### 9. Automatización de Respuestas y Engagement
- **RICE Score**:
  - Reach: 80% usuarios
  - Impact: 7/10 (ahorra tiempo)
  - Confidence: 5/10 (riesgo de errores)
  - Effort: 7/10 (requiere NLP)
  - **Score: 4.0**
- **Esfuerzo estimado**: 5-6 semanas

---

## 7) Próximos pasos

### 3 acciones accionables para la próxima iteración

#### 1. **Implementar Integración OAuth con Instagram y Facebook (4 semanas)**
- **Acciones específicas**:
  - Configurar aplicaciones en Facebook Developer Console
  - Implementar flujo OAuth 2.0 en backend
  - Crear endpoints de callback y refresh tokens
  - Implementar publicación real usando Instagram Graph API y Facebook API
  - Añadir manejo de errores y rate limits
- **Responsables**: Backend developer (1) + Frontend developer (0.5)
- **Entregables**: 
  - Conexión funcional de cuentas Instagram/Facebook
  - Publicación real de posts programados
  - Sincronización de métricas básicas

#### 2. **Completar Implementación Básica de Video Studio (6 semanas)**
- **Acciones específicas**:
  - Integrar servicio de procesamiento de video (Cloudinary o Mux)
  - Crear componente `VideoEditor` con timeline básico
  - Implementar upload y storage de videos
  - Crear 5-10 plantillas de video para fitness
  - Añadir exportación a formatos optimizados (Reels, Shorts)
- **Responsables**: Frontend developer (1) + Backend developer (0.5) + Designer (0.25)
- **Entregables**:
  - Editor funcional con timeline
  - Upload y preview de videos
  - Plantillas básicas disponibles
  - Exportación a formatos sociales

#### 3. **Mejorar Integración de Generadores de IA con CRM (3 semanas)**
- **Acciones específicas**:
  - Crear API unificada para acceder a datos de CRM
  - Modificar `ContentIdeaGeneratorContainer` para usar datos reales
  - Añadir variables dinámicas en `GenerationForm` (nombre cliente, programa, objetivo)
  - Crear sistema de sugerencias basadas en eventos del CRM
- **Responsables**: Full-stack developer (1)
- **Entregables**:
  - Generadores usan datos reales del CRM
  - Contenido personalizado con variables dinámicas
  - Sugerencias automáticas basadas en eventos

### Riesgos y supuestos

**Riesgos identificados**:
1. **APIs de redes sociales cambian frecuentemente**: 
   - Mitigación: Abstraer lógica en servicio, versionar APIs
   - Impacto: Alto si ocurre

2. **Costos de procesamiento de video pueden ser altos**:
   - Mitigación: Implementar límites de uso y pricing por tier
   - Impacto: Medio - afecta escalabilidad

3. **Generadores de IA pueden generar contenido inapropiado**:
   - Mitigación: Implementar filtros de contenido y revisión manual
   - Impacto: Alto - afecta marca y legal

**Supuestos**:
- Usuarios tienen cuentas de Instagram/Facebook Business activas
- Proveedor de IA (OpenAI/Claude) está disponible y accesible
- Usuarios tienen contenido base (fotos, videos) para usar en plantillas
- Hay suficiente tráfico/análisis para algoritmos predictivos

**Dependencias externas**:
- APIs de Facebook/Instagram (requieren aprobación)
- Servicio de procesamiento de video (Cloudinary, Mux, o similar)
- Proveedor de IA (OpenAI API, Anthropic Claude, etc.)
- Storage para videos (S3, Cloudinary, etc.)

---

> **Notas técnicas**: 
> - Todas las rutas son relativas desde la raíz del proyecto
> - Los componentes están en `src/features/[feature-name]/`
> - Las APIs están en `src/features/[feature-name]/api/`
> - Los tipos TypeScript están en `src/features/[feature-name]/types/`








