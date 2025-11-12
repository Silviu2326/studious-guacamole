# Confianza & Social Proof — Diagnóstico funcional y de producto

## 1) Mapa de páginas de la sección

### Páginas principales

#### `/dashboard/reviews` — Review & Testimonial Engine
- **Componente raíz**: `src/features/ReviewYTestimonialEngine/pages/ReviewYTestimonialEnginePage.tsx`
- **Componentes hijos**:
  - `ReviewCard` (`src/features/ReviewYTestimonialEngine/components/ReviewCard.tsx`)
  - `ReviewFilterControls` (`src/features/ReviewYTestimonialEngine/components/ReviewFilterControls.tsx`)
- **API**: `src/features/ReviewYTestimonialEngine/api/reviews.ts`
- **Estados**:
  - Loading: `isLoading` con `Loader2` spinner
  - Error: Card con `AlertCircle` y mensaje de error, botón de reintentar
  - Vacío: Card con `Package` icon y mensaje "No hay reseñas"
- **Guardias**: No hay guardias de autenticación explícitas (depende de Layout)

#### `/dashboard/feedback/surveys` — Feedback Loop & Encuestas Inteligentes
- **Componente raíz**: `src/features/FeedbackLoopYEncuestasInteligentes/pages/FeedbackLoopYEncuestasInteligentesPage.tsx`
- **Componentes hijos**:
  - `SurveyBuilderContainer` (`src/features/FeedbackLoopYEncuestasInteligentes/components/SurveyBuilderContainer.tsx`)
  - `SurveySummaryCard` (`src/features/FeedbackLoopYEncuestasInteligentes/components/SurveySummaryCard.tsx`)
  - `SurveyResultsDashboard` (`src/features/FeedbackLoopYEncuestasInteligentes/components/SurveyResultsDashboard.tsx`)
  - `AutomationTriggerConfig` (`src/features/FeedbackLoopYEncuestasInteligentes/components/AutomationTriggerConfig.tsx`)
- **API**: `src/features/FeedbackLoopYEncuestasInteligentes/api/surveys.ts`
- **Estados**:
  - Loading: `isLoading` con `Loader2` spinner
  - Error: No hay manejo explícito de errores (solo console.error)
  - Vacío: Card con `Package` icon y mensaje "No tienes encuestas creadas todavía"
- **Guardias**: No hay guardias explícitas (depende de Layout)

---

## 2) 10 problemas que hoy SÍ resuelve

### 1. **Gestión Centralizada de Reseñas desde Múltiples Plataformas**
**Página(s)**: `/dashboard/reviews` (Review & Testimonial Engine)

**Problema cubierto**: No hay forma de ver todas las reseñas de Google, Facebook y web en un solo lugar, causando pérdida de tiempo y dificultad para gestionar reputación.

**Como lo resuelve el código**:
- `getReviews` en API (`src/features/ReviewYTestimonialEngine/api/reviews.ts`) agrega reseñas de múltiples fuentes (google, facebook, web)
- `ReviewCard` muestra fuente, autor, rating y contenido unificados
- `syncReviews` permite sincronización manual de todas las plataformas
- Filtros por fuente (`ReviewFilterControls`) permiten ver reseñas por plataforma

**Riesgos/limitaciones**:
- Sincronización es mock (no hay integración real con APIs de Google/Facebook)
- No hay sincronización automática en tiempo real
- Falta validación de autenticidad de reseñas

### 2. **Sistema de Estados y Moderación de Reseñas**
**Página(s)**: `/dashboard/reviews` (Review & Testimonial Engine)

**Problema cubierto**: No hay forma de organizar reseñas por estado (leída, destacada, respondida) para priorizar acciones.

**Como lo resuelve el código**:
- `updateReviewStatus` permite cambiar estado de reseñas (read, featured, responded)
- `ReviewCard` muestra badge de estado con colores (`getStatusColor`, `getStatusLabel`)
- `ReviewFilterControls` permite filtrar por estado
- Funcionalidad de destacar (`handleFeature`) para mostrar reseñas en landing pages

**Riesgos/limitaciones**:
- No hay workflow de moderación automático
- Falta notificación de nuevas reseñas
- No hay alertas para reseñas negativas

### 3. **Análisis de Métricas de Reputación**
**Página(s)**: `/dashboard/reviews` (Review & Testimonial Engine)

**Problema cubierto**: No hay forma de entender el impacto de las reseñas en la reputación sin calcular métricas manualmente.

**Como lo resuelve el código**:
- `getReviewStats` calcula métricas agregadas (puntuación media, total de reseñas, conversión)
- `MetricCards` muestra KPIs: puntuación media, tasa de conversión (solicitudes → reseñas), conversiones a contenido, desglose por plataforma
- Estadísticas incluyen `reviewsByPlatform` (Google, Facebook, Web)

**Riesgos/limitaciones**:
- Datos son mock (no hay cálculo real de métricas)
- No hay comparación histórica (tendencias)
- Falta análisis de sentimiento automático

### 4. **Conversión de Testimonios en Contenido de Marketing**
**Página(s)**: `/dashboard/reviews` (Review & Testimonial Engine)

**Problema cubierto**: No hay forma de convertir testimonios positivos en contenido para redes sociales sin copiar/pegar manualmente.

**Como lo resuelve el código**:
- `handleCreatePost` en `ReviewYTestimonialEnginePage` permite crear publicación desde reseña
- `ReviewCard` tiene botón "Crear Publicación" para convertir reseña en contenido
- Métrica `reviewsConvertedToContent` trackea conversiones

**Riesgos/limitaciones**:
- Funcionalidad es placeholder (solo muestra alert, no implementada)
- No hay integración con Planner de Redes Sociales
- Falta generación automática de contenido desde reseña

### 5. **Creación de Encuestas Personalizadas con Múltiples Tipos de Preguntas**
**Página(s)**: `/dashboard/feedback/surveys` (Feedback Loop & Encuestas Inteligentes)

**Problema cubierto**: Crear encuestas desde cero requiere herramientas externas y no hay personalización para el contexto de fitness.

**Como lo resuelve el código**:
- `SurveyBuilderContainer` (`src/features/FeedbackLoopYEncuestasInteligentes/components/SurveyBuilderContainer.tsx`) permite crear encuestas con múltiples tipos de preguntas
- Soporta `QuestionType`: texto libre, múltiple choice, escala, rating stars, NPS, CSAT
- Editor visual permite agregar, editar, reordenar y eliminar preguntas
- Validación de formulario (título requerido, al menos una pregunta)

**Riesgos/limitaciones**:
- No hay plantillas predefinidas para fitness
- Falta validación de lógica condicional entre preguntas
- No hay preview en tiempo real antes de guardar

### 6. **Automatización de Envío de Encuestas Basada en Eventos**
**Página(s)**: `/dashboard/feedback/surveys` (Feedback Loop & Encuestas Inteligentes)

**Problema cubierto**: Enviar encuestas manualmente es ineficiente y fácil olvidar momentos clave para solicitar feedback.

**Como lo resuelve el código**:
- `AutomationTriggerConfig` (`src/features/FeedbackLoopYEncuestasInteligentes/components/AutomationTriggerConfig.tsx`) permite configurar triggers automáticos
- `getTriggerOptions` en API devuelve eventos disponibles (post-sesión, después de X días, al completar programa, etc.)
- Configuración de retraso (horas/días) antes del envío
- Soporte para envío manual además de automático

**Riesgos/limitaciones**:
- Automatización es mock (no hay integración real con eventos del sistema)
- No hay validación de que el trigger existe realmente
- Falta gestión de errores si el trigger falla

### 7. **Análisis de Resultados de Encuestas con Métricas NPS y CSAT**
**Página(s)**: `/dashboard/feedback/surveys` (Feedback Loop & Encuestas Inteligentes)

**Problema cubierto**: No hay forma de analizar resultados de encuestas sin usar herramientas externas o Excel.

**Como lo resuelve el código**:
- `SurveyResultsDashboard` (`src/features/FeedbackLoopYEncuestasInteligentes/components/SurveyResultsDashboard.tsx`) calcula métricas automáticamente
- Muestra NPS (Net Promoter Score) con desglose de promotores, pasivos, detractores
- Calcula CSAT (Customer Satisfaction Score) promedio
- Tasa de respuesta y total de respuestas
- Desglose por pregunta con estadísticas (promedio, distribución)

**Riesgos/limitaciones**:
- Cálculos son mock (no hay datos reales de respuestas)
- No hay comparación entre períodos
- Falta exportación a Excel/PDF

### 8. **Gestión del Ciclo Completo de Encuestas (Crear, Enviar, Analizar)**
**Página(s)**: `/dashboard/feedback/surveys` (Feedback Loop & Encuestas Inteligentes)

**Problema cubierto**: No hay herramienta única que gestione todo el ciclo de vida de una encuesta desde creación hasta análisis.

**Como lo resuelve el código**:
- `FeedbackLoopYEncuestasInteligentesPage` gestiona 3 modos de vista: `list`, `builder`, `results`
- `SurveyBuilderContainer` para crear/editar encuestas
- `SurveySummaryCard` muestra estado, tasa de respuesta y KPIs principales
- Navegación fluida entre creación, visualización de resultados y edición
- Estados de encuesta: draft, active, archived

**Riesgos/limitaciones**:
- No hay envío real de encuestas (solo mock)
- Falta tracking de aperturas y clicks
- No hay gestión de recordatorios para no respondedores

### 9. **Filtrado y Búsqueda Avanzada de Reseñas**
**Página(s)**: `/dashboard/reviews` (Review & Testimonial Engine)

**Problema cubierto**: No hay forma de encontrar reseñas específicas cuando hay muchas, especialmente para responder a negativas.

**Como lo resuelve el código**:
- `ReviewFilterControls` (`src/features/ReviewYTestimonialEngine/components/ReviewFilterControls.tsx`) permite filtrar por fuente, rating (1-5 estrellas) y estado
- Búsqueda por texto (aunque no implementada completamente)
- Contador de filtros activos y botón para limpiar filtros
- Filtros combinables (múltiples criterios simultáneos)

**Riesgos/limitaciones**:
- Búsqueda por texto no está implementada (solo UI)
- No hay filtros por fecha o rango de fechas
- Falta guardar filtros como favoritos

### 10. **Visualización de Reseñas con Información Completa**
**Página(s)**: `/dashboard/reviews` (Review & Testimonial Engine)

**Problema cubierto**: No hay forma de ver toda la información relevante de una reseña (autor, fecha, rating, contenido, fuente) de forma organizada.

**Como lo resuelve el código**:
- `ReviewCard` (`src/features/ReviewYTestimonialEngine/components/ReviewCard.tsx`) muestra información completa de forma visual
- Foto o inicial del autor, nombre, fecha formateada
- Rating visual con estrellas y número
- Contenido de la reseña con truncado para largo
- Badge de fuente (Google, Facebook, Web) con colores
- Botones de acción (destacar, crear publicación, ver en plataforma)

**Riesgos/limitaciones**:
- No hay vista de detalles expandida
- Falta mostrar historial de respuestas
- No hay validación de spam o reseñas falsas

---

## 3) 10 problemas que AÚN NO resuelve (y debería)

### 1. **Integración Real con APIs de Google y Facebook para Sincronización Automática**
**Necesidad detectada**: `syncReviews` es mock. No hay forma real de obtener reseñas de Google My Business y Facebook automáticamente.

**Propuesta de solución** (alto nivel + impacto):
- Integrar Google My Business API para obtener reseñas en tiempo real
- Integrar Facebook Graph API para reseñas de página
- Webhooks para notificaciones de nuevas reseñas
- Sincronización automática cada X horas configurable
- **Impacto**: Alto - Es la funcionalidad core. Sin esto, la herramienta no es útil en producción.

**Páginas/flujo afectados**:
- `ReviewYTestimonialEnginePage` (sincronización real)
- `syncReviews` en API necesita implementación real
- Nuevo componente `PlatformConnectionsManager` para configurar credenciales

**Complejidad estimada**: Alta (requiere OAuth, APIs complejas, rate limits, manejo de errores)

### 2. **Sistema de Respuestas a Reseñas desde la Plataforma**
**Necesidad detectada**: No hay forma de responder a reseñas directamente desde la app. Hay que ir a cada plataforma.

**Propuesta de solución** (alto nivel + impacto):
- Editor de respuestas integrado en `ReviewCard`
- Envío de respuestas a Google My Business y Facebook desde la app
- Plantillas de respuestas para diferentes situaciones (positiva, negativa, neutra)
- Historial de respuestas enviadas
- **Impacto**: Alto - Ahorra tiempo significativo y mejora gestión de reputación.

**Páginas/flujo afectados**:
- `ReviewCard` (añadir editor de respuesta)
- Nuevo componente `ReviewResponseEditor`
- API endpoints para enviar respuestas a cada plataforma

**Complejidad estimada**: Alta (requiere integración con APIs de respuesta, validación de límites de caracteres por plataforma)

### 3. **Análisis de Sentimiento y Detección Automática de Reseñas Negativas**
**Necesidad detectada**: No hay alertas automáticas para reseñas negativas. Hay que revisar manualmente todas.

**Propuesta de solución** (alto nivel + impacto):
- Análisis de sentimiento con NLP (positivo, neutro, negativo)
- Alertas automáticas para reseñas con rating ≤ 2 estrellas o sentimiento negativo
- Dashboard de "Reseñas que Requieren Atención"
- Priorización automática por criticidad
- **Impacto**: Alto - Permite responder rápidamente a problemas y mejorar retención.

**Páginas/flujo afectados**:
- Nueva página `ReviewsRequiringAttention`
- Modificar `ReviewYTestimonialEnginePage` para mostrar alertas
- Integración con servicio de NLP (OpenAI, AWS Comprehend)

**Complejidad estimada**: Media/Alta (requiere NLP y análisis de texto)

### 4. **Solicitud Automática de Reseñas con Seguimiento**
**Necesidad detectada**: No hay forma de solicitar reseñas automáticamente a clientes satisfechos en el momento adecuado.

**Propuesta de solución** (alto nivel + impacto):
- Integración con CRM para identificar clientes satisfechos (alta frecuencia, completaron programas)
- Envío automático de solicitudes de reseña por email/SMS después de eventos positivos
- Seguimiento de solicitudes (enviada, abierta, completada, ignorada)
- Recordatorios automáticos para no respondedores
- **Impacto**: Alto - Aumenta volumen de reseñas y mejora reputación online.

**Páginas/flujo afectados**:
- Nueva página `ReviewRequestManager`
- Integración con módulo CRM y Email/SMS
- Nuevo componente `ReviewRequestAutomation`

**Complejidad estimada**: Media (requiere integración cross-module y automatización)

### 5. **Widget de Reseñas para Mostrar en Landing Pages y Sitio Web**
**Necesidad detectada**: No hay forma de mostrar reseñas destacadas en landing pages o sitio web para generar confianza.

**Propuesta de solución** (alto nivel + impacto):
- Generador de widget HTML/JavaScript embebible
- Widget personalizable (colores, cantidad de reseñas, fuente)
- Selección de reseñas destacadas para mostrar
- Auto-actualización cuando hay nuevas reseñas destacadas
- **Impacto**: Alto - Mejora conversión en landing pages mostrando prueba social.

**Páginas/flujo afectados**:
- Nueva página `ReviewWidgetGenerator`
- Integración con módulo de Landing Pages
- Nuevo componente `ReviewWidgetPreview`

**Complejidad estimada**: Media (requiere generación de código y API pública)

### 6. **Encuestas con Lógica Condicional y Preguntas Dinámicas**
**Necesidad detectada**: `SurveyBuilderContainer` solo permite preguntas estáticas. No hay lógica condicional (si responde X, mostrar pregunta Y).

**Propuesta de solución** (alto nivel + impacto):
- Editor de flujo de encuesta con lógica condicional
- Reglas tipo "si rating < 3, mostrar pregunta de qué mejorar"
- Preguntas dinámicas basadas en respuestas anteriores
- Visualización de flujo de encuesta antes de guardar
- **Impacto**: Medio/Alto - Permite encuestas más inteligentes y relevantes, mejorando tasa de respuesta.

**Páginas/flujo afectados**:
- `SurveyBuilderContainer` (añadir editor de flujo)
- Nuevo componente `SurveyFlowEditor`
- Modificar lógica de renderizado de encuestas

**Complejidad estimada**: Alta (requiere motor de reglas y renderizado condicional)

### 7. **Comparación de Resultados de Encuestas entre Períodos y Segmentos**
**Necesidad detectada**: `SurveyResultsDashboard` solo muestra resultados actuales. No hay comparación histórica ni por segmentos.

**Propuesta de solución** (alto nivel + impacto):
- Comparación de NPS/CSAT entre períodos (mes anterior, año anterior)
- Segmentación de resultados por tipo de cliente (nuevo, activo, inactivo)
- Gráficos de tendencias con múltiples períodos
- Alertas cuando métricas bajan significativamente
- **Impacto**: Medio - Permite identificar tendencias y tomar decisiones basadas en datos.

**Páginas/flujo afectados**:
- `SurveyResultsDashboard` (añadir comparaciones)
- Nuevo componente `SurveyComparisonChart`
- Integración con módulo de segmentación

**Complejidad estimada**: Media (requiere almacenamiento histórico y análisis de datos)

### 8. **Integración de Encuestas con CRM para Acciones Automáticas**
**Necesidad detectada**: No hay forma de crear tareas o acciones automáticas en CRM cuando una encuesta revela un cliente insatisfecho.

**Propuesta de solución** (alto nivel + impacto):
- Reglas de automatización: si NPS < 7, crear tarea en CRM para contacto
- Si CSAT < 3, añadir cliente a segmento "En Riesgo"
- Notificaciones automáticas a entrenador asignado
- Integración con módulo de retención
- **Impacto**: Alto - Permite actuar proactivamente sobre feedback negativo y mejorar retención.

**Páginas/flujo afectados**:
- `AutomationTriggerConfig` (añadir acciones post-encuesta)
- Integración con módulo CRM
- Nuevo componente `SurveyActionAutomation`

**Complejidad estimada**: Media (requiere integración cross-module y reglas de negocio)

### 9. **Exportación y Reportes de Reseñas y Encuestas**
**Necesidad detectada**: No hay forma de exportar datos de reseñas o resultados de encuestas para análisis externo o reportes.

**Propuesta de solución** (alto nivel + impacto):
- Exportación a Excel/CSV de reseñas con filtros aplicados
- Exportación de resultados de encuestas a PDF con gráficos
- Reportes programados (enviar resumen mensual por email)
- Templates de reportes personalizables
- **Impacto**: Medio - Necesario para análisis avanzado y reportes gerenciales.

**Páginas/flujo afectados**:
- `ReviewYTestimonialEnginePage` (añadir botón de exportar)
- `SurveyResultsDashboard` (añadir exportación)
- Nuevo componente `ReportGenerator`

**Complejidad estimada**: Baja/Media (requiere generación de archivos y templates)

### 10. **Validación y Moderación de Reseñas Falsas/Spam**
**Necesidad detectada**: No hay forma de detectar reseñas falsas o spam. Todas las reseñas se muestran igual.

**Propuesta de solución** (alto nivel + impacto):
- Detección automática de patrones sospechosos (múltiples reseñas del mismo IP, timing sospechoso)
- Sistema de marcado de reseñas como "verificada" o "sospechosa"
- Opción de reportar reseñas como spam
- Integración con servicios de verificación de reseñas
- **Impacto**: Medio/Alto - Protege reputación de reseñas falsas y mejora credibilidad.

**Páginas/flujo afectados**:
- `ReviewCard` (añadir indicadores de verificación)
- Nuevo componente `ReviewModerationPanel`
- Integración con servicios de verificación

**Complejidad estimada**: Media/Alta (requiere algoritmos de detección y servicios externos)

---

## 4) Hallazgos desde navegación/menús

### Sidebar.tsx

**Estructura de la sección**:
```typescript
{
  id: 'confianza-social-proof',
  title: 'Confianza & Social Proof',
  icon: ThumbsUp,
  items: [
    { id: 'review-testimonial-engine', label: 'Review & Testimonial Engine', icon: Star, path: '/dashboard/reviews' },
    { id: 'feedback-encuestas', label: 'Feedback Loop & Encuestas Inteligentes', icon: MessageSquare, path: '/dashboard/feedback/surveys' },
  ],
}
```

**Permisos y visibilidad**:
- Ambos items son visibles para ambos roles (entrenador y gimnasio)
- No hay restricciones `entrenadorOnly` o `gimnasioOnly`
- No hay badges o contadores de notificaciones

**Inconsistencias de UX o naming**:
1. **Naming inconsistente**: 
   - "Review & Testimonial Engine" (nombre en inglés en una app en español)
   - "Feedback Loop & Encuestas Inteligentes" (mezcla inglés/español)

2. **Falta de relación con otras secciones**:
   - "Encuestas & Satisfacción (NPS/CSAT)" está en sección "CRM & Clientes" pero es similar a "Feedback Loop & Encuestas Inteligentes"
   - Hay duplicación funcional potencial entre ambas secciones

3. **Falta de indicadores visuales**:
   - No hay badges de nuevas reseñas pendientes de responder
   - No hay indicadores de encuestas con respuestas nuevas
   - No hay alertas de reseñas negativas sin responder

4. **Rutas inconsistentes**:
   - `/dashboard/reviews` (reviews)
   - `/dashboard/feedback/surveys` (feedback)
   - Mezcla de inglés/español en rutas

**Sugerencias de mejora**:
- Estandarizar nombres en español o inglés
- Consolidar o diferenciar claramente "Encuestas & Satisfacción" vs "Feedback Loop & Encuestas"
- Añadir badges de notificaciones para reseñas/encuestas que requieren atención
- Unificar prefijos de rutas (`/dashboard/feedback/` o `/dashboard/reviews/`)

---

## 5) KPIs y métricas recomendadas

### Métricas de adopción
- **Tasa de adopción por herramienta**: % de usuarios que usan cada herramienta al menos una vez al mes
  - Meta: >70% para Review Engine, >50% para Encuestas
- **Frecuencia de uso**: Número promedio de sesiones por usuario por semana
  - Meta: >2 sesiones/semana para usuarios activos
- **Retención de usuarios**: % de usuarios que vuelven después del primer uso
  - Meta: >75% retención a 30 días

### Tiempo de tarea
- **Tiempo para responder una reseña**: Desde abrir reseña hasta enviar respuesta
  - Meta: <3 minutos
- **Tiempo para crear una encuesta**: Desde "Nueva Encuesta" hasta guardar
  - Meta: <5 minutos (encuesta básica)
- **Tiempo para analizar resultados**: Desde abrir resultados hasta entender insights
  - Meta: <1 minuto (vista de dashboard)

### Conversión interna
- **Tasa de respuesta a reseñas**: % de reseñas que reciben respuesta
  - Meta: >80% (especialmente negativas)
- **Tasa de conversión de reseñas a contenido**: % de reseñas destacadas convertidas en posts
  - Meta: >30%
- **Tasa de respuesta a encuestas**: % de encuestas enviadas que reciben respuesta
  - Meta: >40% (depende de automatización)

### Errores por flujo
- **Errores en sincronización de reseñas**: % de sincronizaciones que fallan
  - Meta: <2%
- **Errores en envío de encuestas**: % de envíos que fallan
  - Meta: <1%
- **Errores en creación de encuestas**: % de intentos de guardar que fallan
  - Meta: <1%

### Latencia clave
- **Tiempo de carga de reseñas**: Desde abrir página hasta mostrar reseñas
  - Meta: <1 segundo
- **Tiempo de sincronización**: Desde iniciar sync hasta completar
  - Meta: <30 segundos (depende de volumen)
- **Tiempo de cálculo de métricas**: Desde abrir resultados hasta mostrar métricas
  - Meta: <2 segundos

---

## 6) Backlog priorizado (RICE/MoSCoW)

### MUST (top 3)

#### 1. Integración Real con APIs de Google y Facebook
- **RICE Score**: 
  - Reach: 100% usuarios (todos necesitan sincronizar reseñas)
  - Impact: 10/10 (sin esto, la herramienta no funciona)
  - Confidence: 8/10 (APIs están documentadas)
  - Effort: 8/10 (complejo pero factible)
  - **Score: 10.0**
- **Justificación**: Es la funcionalidad core. Sin sincronización real, la herramienta no tiene valor.
- **Esfuerzo estimado**: 6-8 semanas (1 desarrollador full-time)

#### 2. Sistema de Respuestas a Reseñas desde la Plataforma
- **RICE Score**:
  - Reach: 100% usuarios (todos responden reseñas)
  - Impact: 9/10 (ahorra tiempo significativo)
  - Confidence: 9/10 (APIs de respuesta disponibles)
  - Effort: 6/10 (requiere integración pero no es muy complejo)
  - **Score: 15.0**
- **Justificación**: Responder reseñas es crítico para reputación. Hacerlo desde la app es esencial.
- **Esfuerzo estimado**: 4-5 semanas (1 desarrollador)

#### 3. Solicitud Automática de Reseñas con Seguimiento
- **RICE Score**:
  - Reach: 100% usuarios
  - Impact: 9/10 (aumenta volumen de reseñas)
  - Confidence: 8/10 (integración con CRM necesaria)
  - Effort: 5/10 (requiere automatización pero no muy complejo)
  - **Score: 18.0**
- **Justificación**: Aumentar volumen de reseñas mejora reputación y conversión.
- **Esfuerzo estimado**: 3-4 semanas (1 desarrollador)

### SHOULD (top 3)

#### 4. Análisis de Sentimiento y Detección Automática de Reseñas Negativas
- **RICE Score**:
  - Reach: 100% usuarios
  - Impact: 8/10 (mejora respuesta a problemas)
  - Confidence: 7/10 (NLP disponible pero requiere tuning)
  - Effort: 6/10 (requiere NLP y alertas)
  - **Score: 9.3**
- **Esfuerzo estimado**: 4-5 semanas

#### 5. Widget de Reseñas para Landing Pages
- **RICE Score**:
  - Reach: 80% usuarios (solo quienes tienen web/landing)
  - Impact: 8/10 (mejora conversión)
  - Confidence: 9/10 (tecnología conocida)
  - Effort: 4/10 (relativamente simple)
  - **Score: 14.4**
- **Esfuerzo estimado**: 2-3 semanas

#### 6. Integración de Encuestas con CRM para Acciones Automáticas
- **RICE Score**:
  - Reach: 100% usuarios
  - Impact: 8/10 (mejora retención)
  - Confidence: 7/10 (requiere integración cross-module)
  - Effort: 6/10 (complejo pero factible)
  - **Score: 9.3**
- **Esfuerzo estimado**: 4-5 semanas

### COULD (top 3)

#### 7. Encuestas con Lógica Condicional
- **RICE Score**:
  - Reach: 60% usuarios (solo power users)
  - Impact: 7/10 (mejora calidad de feedback)
  - Confidence: 6/10 (complejo de implementar)
  - Effort: 8/10 (muy complejo)
  - **Score: 3.2**
- **Esfuerzo estimado**: 6-8 semanas

#### 8. Comparación de Resultados entre Períodos
- **RICE Score**:
  - Reach: 70% usuarios (solo usuarios avanzados)
  - Impact: 7/10 (permite análisis de tendencias)
  - Confidence: 8/10
  - Effort: 5/10 (requiere almacenamiento histórico)
  - **Score: 7.8**
- **Esfuerzo estimado**: 3-4 semanas

#### 9. Validación y Moderación de Reseñas Falsas
- **RICE Score**:
  - Reach: 100% usuarios
  - Impact: 7/10 (protege reputación)
  - Confidence: 5/10 (algoritmos complejos)
  - Effort: 7/10 (requiere ML básico)
  - **Score: 5.0**
- **Esfuerzo estimado**: 5-6 semanas

---

## 7) Próximos pasos

### 3 acciones accionables para la próxima iteración

#### 1. **Implementar Integración OAuth con Google My Business y Facebook (6 semanas)**
- **Acciones específicas**:
  - Configurar aplicaciones en Google Cloud Console y Facebook Developer
  - Implementar flujo OAuth 2.0 en backend
  - Crear endpoints de callback y refresh tokens
  - Implementar sincronización real usando Google My Business API y Facebook Graph API
  - Crear `PlatformConnectionsManager` para gestionar conexiones
  - Añadir manejo de errores y rate limits
- **Responsables**: Backend developer (1) + Frontend developer (0.5)
- **Entregables**: 
  - Conexión funcional de cuentas Google/Facebook
  - Sincronización automática de reseñas
  - Webhooks para nuevas reseñas

#### 2. **Implementar Sistema de Respuestas a Reseñas (4 semanas)**
- **Acciones específicas**:
  - Crear `ReviewResponseEditor` con editor de texto enriquecido
  - Implementar endpoints para enviar respuestas a Google My Business API
  - Implementar endpoints para enviar respuestas a Facebook Graph API
  - Añadir plantillas de respuestas (positiva, negativa, neutra)
  - Crear historial de respuestas enviadas
  - Validación de límites de caracteres por plataforma
- **Responsables**: Backend developer (0.5) + Frontend developer (1)
- **Entregables**:
  - Editor de respuestas funcional
  - Envío real de respuestas a ambas plataformas
  - Plantillas de respuestas disponibles

#### 3. **Implementar Solicitud Automática de Reseñas (3 semanas)**
- **Acciones específicas**:
  - Crear `ReviewRequestManager` con configuración de triggers
  - Integrar con módulo CRM para identificar clientes satisfechos
  - Crear templates de solicitud de reseña (email/SMS)
  - Implementar seguimiento de solicitudes (enviada, abierta, completada)
  - Añadir recordatorios automáticos para no respondedores
  - Integrar con módulo Email/SMS para envío
- **Responsables**: Full-stack developer (1)
- **Entregables**:
  - Solicitudes automáticas funcionando
  - Seguimiento de estado de solicitudes
  - Recordatorios automáticos configurados

### Riesgos y supuestos

**Riesgos identificados**:
1. **APIs de Google/Facebook cambian frecuentemente**: 
   - Mitigación: Abstraer lógica en servicio, versionar APIs, monitorear cambios
   - Impacto: Alto si ocurre

2. **Límites de rate de APIs pueden ser restrictivos**:
   - Mitigación: Implementar queue y throttling, cachear respuestas
   - Impacto: Medio - afecta sincronización en tiempo real

3. **Análisis de sentimiento puede tener falsos positivos/negativos**:
   - Mitigación: Permitir corrección manual, ajustar umbrales, entrenar modelo
   - Impacto: Medio - afecta calidad de alertas

**Supuestos**:
- Usuarios tienen cuentas de Google My Business y Facebook Page activas
- APIs de Google y Facebook están disponibles y accesibles
- Hay integración con módulo CRM para datos de clientes
- Hay integración con módulo Email/SMS para envío de solicitudes

**Dependencias externas**:
- Google My Business API (requiere verificación de negocio)
- Facebook Graph API (requiere aprobación de permisos)
- Servicio de NLP para análisis de sentimiento (OpenAI, AWS Comprehend, etc.)
- Módulo CRM para datos de clientes
- Módulo Email/SMS para envío de solicitudes

---

> **Notas técnicas**: 
> - Todas las rutas son relativas desde la raíz del proyecto
> - Los componentes están en `src/features/[feature-name]/`
> - Las APIs están en `src/features/[feature-name]/api/`
> - Los tipos TypeScript están en `src/features/[feature-name]/types/`
















