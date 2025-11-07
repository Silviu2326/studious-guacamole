# Marketing General — Diagnóstico funcional y de producto

## 1) Mapa de páginas de la sección

### Páginas principales

#### `/campanas-outreach` — Campañas (solo gimnasios)
- **Componente raíz**: `src/features/campanas-outreach/pages/campanas-outreachPage.tsx`
- **Componentes hijos**:
  - `CampaignsManager` (`src/features/campanas-outreach/components/CampaignsManager.tsx`) - Gestor principal con tabs
  - `CampaignsList` (`src/features/campanas-outreach/components/CampaignsList.tsx`) - Lista de campañas
  - `CampaignBuilder` (`src/features/campanas-outreach/components/CampaignBuilder.tsx`) - Constructor de campañas
  - `CampaignAnalytics` (`src/features/campanas-outreach/components/CampaignAnalytics.tsx`) - Analytics de campañas
  - `OutreachSequencesList` (`src/features/campanas-outreach/components/OutreachSequencesList.tsx`) - Lista de secuencias de outreach
  - `AudienceSegmenter` (`src/features/campanas-outreach/components/AudienceSegmenter.tsx`) - Segmentación de audiencias
- **Hooks**: `useCampaigns` (`src/features/campanas-outreach/hooks/useCampaigns.ts`)
- **APIs**: 
  - `src/features/campanas-outreach/api/campaigns.ts`
  - `src/features/campanas-outreach/api/outreach.ts`
  - `src/features/campanas-outreach/api/automation.ts`
  - `src/features/campanas-outreach/api/analytics.ts`
- **Estados**:
  - Loading: `loading` state con spinners
  - Error: Card con `AlertTriangle` y botón "Reintentar"
  - Vacío: No hay estado vacío explícito (solo lista de campañas)
- **Guardias**: `gimnasioOnly: true` (solo visible para gimnasios)
- **Tabs**: Campañas, Outreach, Analytics, Segmentos

#### `/marketing/landing-pages` — Embudos & Landing Pages
- **Componente raíz**: `src/features/embudos-ofertas-landing-pages/pages/embudos-ofertas-landing-pagesPage.tsx`
- **Componentes hijos**:
  - `LandingPagesList` (`src/features/embudos-ofertas-landing-pages/components/LandingPagesList.tsx`) - Lista de landing pages
  - `LandingPageBuilder` (`src/features/embudos-ofertas-landing-pages/components/LandingPageBuilder.tsx`) - Constructor visual de landing pages
  - `LandingPageAnalytics` (`src/features/embudos-ofertas-landing-pages/components/LandingPageAnalytics.tsx`) - Analytics de landing pages
- **API**: `src/features/embudos-ofertas-landing-pages/api/landingPages.ts`
- **Estados**:
  - Loading: `loading` state en componentes
  - Error: Manejo de errores en componentes individuales
  - Vacío: Mensaje cuando no hay landing pages seleccionadas para analytics
- **Guardias**: No hay guardias explícitas (depende de Layout)
- **Tabs**: Mis Landing Pages, Analíticas, Plantillas (solo gimnasios)

#### `/marketing/afiliados-y-referidos` — Afiliados & Referidos
- **Componente raíz**: `src/features/afiliados-referidos/pages/afiliados-referidosPage.tsx`
- **Componentes hijos**:
  - `ReferralDashboardContainer` (`src/features/afiliados-referidos/components/ReferralDashboardContainer.tsx`) - Container principal
  - `ProgramList` (`src/features/afiliados-referidos/components/ProgramList.tsx`) - Lista de programas
  - `ProgramConfigurationModal` (`src/features/afiliados-referidos/components/ProgramConfigurationModal.tsx`) - Modal de configuración
- **Hooks**: 
  - `useReferralPrograms` (`src/features/afiliados-referidos/hooks/useReferralPrograms.ts`)
  - `useReferralStats` (`src/features/afiliados-referidos/hooks/useReferralStats.ts`)
- **API**: `src/features/afiliados-referidos/api/referralApi.ts`
- **Estados**:
  - Loading: `isLoading` en hooks
  - Error: Manejo de errores en hooks
  - Vacío: No hay estado vacío explícito
- **Guardias**: No hay guardias explícitas (depende de Layout)
- **Diferencias por rol**: UI adaptada según `userType` ('trainer' vs 'gym')

---

## 2) 10 problemas que hoy SÍ resuelve

### 1. **Dashboard de Métricas de Campañas con KPIs Agregados**
**Página(s)**: `/campanas-outreach` (Campañas)

**Problema cubierto**: No hay forma de ver el rendimiento general de las campañas sin calcular métricas manualmente.

**Como lo resuelve el código**:
- `CampanasOutreachPage` muestra métricas agregadas: Total Campañas, Tasa Conversión, Mensajes Enviados, Ingresos Generados
- `CampaignsManager` muestra métricas adicionales: Total Secuencias Outreach
- Cálculo automático de métricas desde datos de campañas
- Tendencias comparativas (vs mes anterior)
- Visualización con `MetricCards` con iconos y colores diferenciados

**Riesgos/limitaciones**:
- Métricas son calculadas desde datos mock (no hay tracking real)
- No hay comparación con períodos anteriores más detallada
- Falta desglose por tipo de campaña o canal

### 2. **Gestión de Campañas Multi-canal con Estados**
**Página(s)**: `/campanas-outreach` (Campañas)

**Problema cubierto**: No hay forma de gestionar múltiples campañas de marketing sin perder visibilidad del estado de cada una.

**Como lo resuelve el código**:
- `CampaignsList` muestra lista de campañas con información clave: nombre, estado, objetivo, métricas
- Estados de campaña: draft, active, paused, completed
- Filtros por estado, tipo, fecha
- `CampaignBuilder` permite crear nuevas campañas
- `useCampaigns` hook gestiona estado de campañas
- Visualización clara de estado con badges de colores

**Riesgos/limitaciones**:
- Campañas son mock (no hay creación/envío real)
- No hay envío real de mensajes
- Falta programación de envíos

### 3. **Outreach Automatizado con Secuencias**
**Página(s)**: `/campanas-outreach` (Campañas)

**Problema cubierto**: No hay forma de automatizar secuencias de mensajes basadas en comportamiento.

**Como lo resuelve el código**:
- `OutreachSequencesList` muestra secuencias de outreach automatizadas
- Secuencias con triggers personalizables
- Estados de secuencias: active, paused, completed
- Integración con `useCampaigns` hook para gestión
- Visualización de métricas por secuencia

**Riesgos/limitaciones**:
- Secuencias son mock (no hay automatización real)
- No hay triggers reales basados en comportamiento
- Falta ejecución automática de secuencias

### 4. **Segmentación de Audiencias Avanzada**
**Página(s)**: `/campanas-outreach` (Campañas)

**Problema cubierto**: No hay forma de segmentar audiencias de forma avanzada para campañas personalizadas.

**Como lo resuelve el código**:
- `AudienceSegmenter` permite crear y gestionar segmentos de audiencia
- Segmentación por comportamiento, perfil, datos demográficos
- Integración con campañas para asignar segmentos
- Visualización de tamaño de segmento y criterios
- Reutilización de segmentos entre campañas

**Riesgos/limitaciones**:
- Segmentación es mock (no hay análisis real de datos)
- No hay actualización dinámica de segmentos
- Falta validación de criterios de segmentación

### 5. **Analytics de Campañas con Métricas Detalladas**
**Página(s)**: `/campanas-outreach` (Campañas)

**Problema cubierto**: No hay forma de analizar el rendimiento detallado de cada campaña.

**Como lo resuelve el código**:
- `CampaignAnalytics` muestra métricas detalladas por campaña: sent, delivered, opened, clicked, converted
- Visualización de ROI y revenue generado
- Comparación de campañas
- Gráficos de rendimiento temporal
- Identificación de mejores campañas

**Riesgos/limitaciones**:
- Analytics son mock (no hay tracking real de eventos)
- No hay tracking real de opens, clicks, conversiones
- Falta análisis de cohortes o atribución

### 6. **Constructor Visual de Landing Pages**
**Página(s)**: `/marketing/landing-pages` (Embudos & Landing Pages)

**Problema cubierto**: No hay forma de crear landing pages sin conocimientos técnicos de código.

**Como lo resuelve el código**:
- `LandingPageBuilder` proporciona constructor visual drag-and-drop
- Bloques de contenido: texto, imágenes, videos, CTAs, formularios, testimonios, precios
- Edición de propiedades de cada bloque
- Preview en tiempo real
- Guardado de contenido en JSON estructurado
- Reordenamiento de bloques

**Riesgos/limitaciones**:
- Constructor es básico (no hay todos los bloques implementados)
- No hay todos los tipos de bloques disponibles
- Falta integración con sistema de hosting/publicación

### 7. **Gestión de Landing Pages con Estados**
**Página(s)**: `/marketing/landing-pages` (Embudos & Landing Pages)

**Problema cubierto**: No hay forma de gestionar múltiples landing pages sin perder visibilidad del estado.

**Como lo resuelve el código**:
- `LandingPagesList` muestra lista de landing pages con información clave: nombre, estado, URL, estadísticas
- Estados: draft, published, archived
- Acciones: editar, duplicar, publicar/despublicar, eliminar, ver analytics
- Paginación de resultados
- Filtros por estado
- Links directos a landing pages publicadas

**Riesgos/limitaciones**:
- Landing pages son mock (no hay publicación real)
- No hay URLs reales generadas
- Falta búsqueda por nombre o texto

### 8. **Analytics de Landing Pages**
**Página(s)**: `/marketing/landing-pages` (Embudos & Landing Pages)

**Problema cubierto**: No hay forma de analizar el rendimiento de landing pages sin herramientas externas.

**Como lo resuelve el código**:
- `LandingPageAnalytics` muestra métricas por landing page: visitas, conversiones, tasa de conversión
- Visualización de estadísticas detalladas
- Comparación de páginas
- Identificación de mejores páginas

**Riesgos/limitaciones**:
- Analytics son mock (no hay tracking real de visitas)
- No hay tracking real de eventos (clicks, formularios)
- Falta análisis de heatmaps o grabaciones de sesiones

### 9. **Gestión de Programas de Referidos con Recompensas**
**Página(s)**: `/marketing/afiliados-y-referidos` (Afiliados & Referidos)

**Problema cubierto**: No hay forma de gestionar programas de referidos sin sistema de tracking.

**Como lo resuelve el código**:
- `ReferralDashboardContainer` muestra dashboard con programas activos
- `ProgramList` lista programas con información: nombre, estado, fechas, recompensas, conversiones
- `ProgramConfigurationModal` permite crear/editar programas
- Configuración de recompensas: tipo (free_month, free_session, percent_discount, fixed_amount) y valor
- Recompensas para referrer y referred
- Estados: active, inactive
- Fechas de inicio y fin

**Riesgos/limitaciones**:
- Programas son mock (no hay tracking real de referidos)
- No hay generación real de códigos de referido
- Falta aplicación automática de recompensas

### 10. **Analytics de Programas de Referidos**
**Página(s)**: `/marketing/afiliados-y-referidos` (Afiliados & Referidos)

**Problema cubierto**: No hay forma de analizar el rendimiento de programas de referidos sin cálculos manuales.

**Como lo resuelve el código**:
- `ReferralDashboardContainer` muestra métricas agregadas: Conversiones Totales, Tasa de Conversión, Ingresos Generados, Coste de Recompensas (solo gimnasios)
- `useReferralStats` hook calcula estadísticas desde datos
- Filtros por rango de fechas
- Top referrers con más conversiones
- Cálculo automático de ROI (revenue vs cost of rewards)

**Riesgos/limitaciones**:
- Analytics son mock (no hay tracking real de clicks/conversiones)
- No hay datos reales de referidos
- Falta desglose por programa individual

---

## 3) 10 problemas que AÚN NO resuelve (y debería)

### 1. **Envío Real de Campañas Multi-canal**
**Necesidad detectada**: Las campañas son mock. No hay envío real de mensajes por WhatsApp, Email, SMS.

**Propuesta de solución** (alto nivel + impacto):
- Integración con WhatsApp Business API para envío de mensajes
- Integración con servicios de email (SendGrid, Mailchimp, etc.) para envío de emails
- Integración con SMS Gateway para envío de SMS
- Sistema de colas para procesamiento de envíos masivos
- Rate limiting y gestión de cuotas por proveedor
- Manejo de bounces, errores, y reintentos
- **Impacto**: Alto - Sin esto, las campañas no tienen valor funcional. Es la funcionalidad core.

**Páginas/flujo afectados**:
- `CampaignsManager` (envío real)
- `CampaignBuilder` (configuración de canales)
- Nuevo servicio `MessageDeliveryService`
- Integración con proveedores externos

**Complejidad estimada**: Alta (requiere integración con múltiples APIs, colas, manejo de errores)

### 2. **Tracking Real de Eventos de Campañas**
**Necesidad detectada**: Los analytics son mock. No hay tracking real de opens, clicks, conversiones, bounces.

**Propuesta de solución** (alto nivel + impacto):
- Sistema de tracking de eventos: opens (pixel tracking), clicks (URL tracking), conversiones
- Webhooks para recibir eventos de proveedores (email opens, SMS delivery)
- Base de datos de eventos para análisis
- Dashboard en tiempo real de eventos
- Análisis de atribución (qué campaña generó conversión)
- **Impacto**: Alto - Sin esto, no se puede medir el rendimiento real de campañas.

**Páginas/flujo afectados**:
- `CampaignAnalytics` (datos reales)
- Nuevo servicio `EventTrackingService`
- Sistema de webhooks
- Base de datos de eventos

**Complejidad estimada**: Alta (requiere sistema de tracking completo, webhooks, base de datos)

### 3. **Automatización Real de Secuencias de Outreach**
**Necesidad detectada**: Las secuencias son mock. No hay ejecución automática basada en triggers.

**Propuesta de solución** (alto nivel + impacto):
- Sistema de triggers basados en comportamiento (visitó landing page, no abrió email, etc.)
- Ejecución automática de secuencias cuando se cumplen triggers
- Gestión de timing entre mensajes (días, horas)
- Sistema de jobs/workers para ejecución asíncrona
- Manejo de condiciones (si/no, entonces)
- Pausa automática si usuario responde
- **Impacto**: Alto - Sin esto, el outreach automatizado no funciona.

**Páginas/flujo afectados**:
- `OutreachSequencesList` (ejecución real)
- Nuevo servicio `OutreachAutomationService`
- Sistema de jobs/workers
- Integración con triggers de eventos

**Complejidad estimada**: Alta (requiere sistema de automatización, jobs, triggers, condiciones)

### 4. **Publicación Real de Landing Pages**
**Necesidad detectada**: Las landing pages son mock. No hay publicación real ni URLs generadas.

**Propuesta de solución** (alto nivel + impacto):
- Sistema de hosting de landing pages (CDN, servidor propio, o integración con hosting)
- Generación de URLs únicas por landing page
- Renderizado de landing pages desde JSON a HTML
- Optimización de rendimiento (lazy loading, minificación)
- SSL/HTTPS automático
- Dominio personalizado opcional
- **Impacto**: Alto - Sin esto, las landing pages no son accesibles públicamente.

**Páginas/flujo afectados**:
- `LandingPagesList` (publicación real)
- `LandingPageBuilder` (renderizado)
- Nuevo servicio `LandingPageHostingService`
- Sistema de renderizado HTML desde JSON

**Complejidad estimada**: Alta (requiere hosting, renderizado, optimización, dominio)

### 5. **Tracking Real de Landing Pages**
**Necesidad detectada**: Los analytics de landing pages son mock. No hay tracking real de visitas, conversiones.

**Propuesta de solución** (alto nivel + impacto):
- Integración con Google Analytics o sistema propio de tracking
- Tracking de visitas, tiempo en página, scroll depth
- Tracking de eventos: clicks en CTAs, envío de formularios
- Tracking de conversiones (compras, signups)
- Análisis de fuentes de tráfico (referrer, UTM parameters)
- Heatmaps y grabaciones de sesiones (opcional)
- **Impacto**: Alto - Sin esto, no se puede medir el rendimiento real de landing pages.

**Páginas/flujo afectados**:
- `LandingPageAnalytics` (datos reales)
- Nuevo servicio `LandingPageTrackingService`
- Integración con analytics
- Scripts de tracking en landing pages

**Complejidad estimada**: Media/Alta (requiere tracking completo, integración con analytics)

### 6. **Generación Real de Códigos de Referido**
**Necesidad detectada**: Los programas de referidos son mock. No hay generación real de códigos únicos.

**Propuesta de solución** (alto nivel + impacto):
- Generación automática de códigos únicos por usuario/programa
- URLs de referido personalizadas (ej: /ref/USER123)
- Tracking de clicks en URLs de referido
- Identificación automática de referrer cuando referred se registra
- Sistema de atribución (qué código generó conversión)
- Dashboard de códigos por usuario
- **Impacto**: Alto - Sin esto, los programas de referidos no funcionan.

**Páginas/flujo afectados**:
- `ReferralDashboardContainer` (códigos reales)
- Nuevo componente `ReferralCodeGenerator`
- Nuevo servicio `ReferralTrackingService`
- Sistema de atribución

**Complejidad estimada**: Media/Alta (requiere generación de códigos, tracking, atribución)

### 7. **Aplicación Automática de Recompensas**
**Necesidad detectada**: No hay aplicación automática de recompensas cuando se completa una conversión de referido.

**Propuesta de solución** (alto nivel + impacto):
- Detección automática de conversión (cuando referred se registra/paga)
- Aplicación automática de recompensas (descuento, mes gratis, sesión gratis)
- Notificaciones a referrer y referred sobre recompensas
- Integración con sistema de membresías/pagos para aplicar descuentos
- Historial de recompensas aplicadas
- **Impacto**: Medio/Alto - Permite automatizar completamente el programa de referidos.

**Páginas/flujo afectados**:
- `ReferralDashboardContainer` (aplicación automática)
- Integración con módulo de membresías/pagos
- Nuevo servicio `RewardApplicationService`
- Sistema de notificaciones

**Complejidad estimada**: Media (requiere integración cross-module, aplicación automática)

### 8. **A/B Testing Integrado en Landing Pages**
**Necesidad detectada**: No hay forma de hacer A/B testing de landing pages directamente desde el constructor.

**Propuesta de solución** (alto nivel + impacto):
- Creación de variantes de landing page desde el constructor
- Asignación aleatoria de tráfico a variantes (50/50, 70/30, etc.)
- Tracking de conversiones por variante
- Cálculo estadístico de significancia
- Identificación automática de ganador
- Aplicación automática de variante ganadora
- **Impacto**: Medio/Alto - Permite optimizar landing pages con datos reales.

**Páginas/flujo afectados**:
- `LandingPageBuilder` (creación de variantes)
- `LandingPageAnalytics` (comparación de variantes)
- Integración con sistema de A/B testing
- Nuevo servicio `ABTestingService`

**Complejidad estimada**: Media/Alta (requiere asignación de tráfico, tracking, cálculo estadístico)

### 9. **Plantillas de Landing Pages Pre-diseñadas**
**Necesidad detectada**: Solo hay placeholder de plantillas. No hay plantillas reales disponibles.

**Propuesta de solución** (alto nivel + impacto):
- Biblioteca de plantillas pre-diseñadas para diferentes casos de uso
- Plantillas por industria/tipo: fitness, entrenamiento personal, gimnasios, retos
- Plantillas por objetivo: captación, venta, lead magnet, webinar
- Editor de plantillas para personalización
- Preview de plantillas antes de usar
- Importación/exportación de plantillas
- **Impacto**: Medio - Permite crear landing pages más rápido sin empezar desde cero.

**Páginas/flujo afectados**:
- `EmbudosOfertasLandingPagesPage` (tab de plantillas)
- Nuevo componente `TemplateLibrary`
- Sistema de plantillas
- Nuevo servicio `TemplateService`

**Complejidad estimada**: Media (requiere diseño de plantillas, sistema de gestión)

### 10. **Integración con CRM para Segmentación**
**Necesidad detectada**: La segmentación es mock. No hay integración real con datos de CRM para crear segmentos.

**Propuesta de solución** (alto nivel + impacto):
- Integración con módulo de CRM para obtener datos de clientes/leads
- Segmentación basada en datos reales: comportamiento, historial, perfil
- Actualización dinámica de segmentos cuando cambian datos
- Segmentación avanzada: múltiples condiciones, operadores lógicos
- Validación de criterios de segmentación
- Preview de miembros del segmento antes de crear campaña
- **Impacto**: Medio/Alto - Permite segmentación real basada en datos del negocio.

**Páginas/flujo afectados**:
- `AudienceSegmenter` (segmentación real)
- Integración con módulo de CRM
- Nuevo servicio `SegmentService`
- Sistema de consultas a base de datos

**Complejidad estimada**: Media/Alta (requiere integración con CRM, consultas complejas, validación)

---

## 4) Hallazgos desde navegación/menús

### Sidebar.tsx

**Estructura de la sección**:
```typescript
{
  id: 'marketing-general',
  title: 'Marketing General',
  icon: Megaphone,
  items: [
    { id: 'campanas-outreach', label: 'Campañas', icon: Megaphone, path: '/campanas-outreach', gimnasioOnly: true },
    { id: 'embudos-ofertas-landing-pages', label: 'Embudos & Landing Pages', icon: Globe, path: '/marketing/landing-pages' },
    { id: 'afiliados-y-referidos', label: 'Afiliados & Referidos', icon: UserCheck, path: '/marketing/afiliados-y-referidos' },
  ],
}
```

**Permisos y visibilidad**:
- "Campañas" es solo para gimnasios (`gimnasioOnly: true`)
- "Embudos & Landing Pages" y "Afiliados & Referidos" son visibles para ambos roles
- No hay badges o contadores de notificaciones

**Inconsistencias de UX o naming**:
1. **Naming inconsistente**:
   - "Campañas" (singular, pero gestiona múltiples)
   - "Embudos & Landing Pages" (español)
   - "Afiliados & Referidos" (español)
   - Mezcla de singular/plural

2. **Rutas inconsistentes**:
   - `/campanas-outreach` (raíz, español)
   - `/marketing/landing-pages` (bajo marketing, inglés)
   - `/marketing/afiliados-y-referidos` (bajo marketing, español)
   - Falta de consistencia en estructura de rutas

3. **Restricción de acceso inconsistente**:
   - Solo "Campañas" está restringida a gimnasios
   - Las otras dos páginas son para ambos roles pero con diferencias en UI
   - Podría ser más claro qué funcionalidades están disponibles para cada rol

4. **Falta de conexión con otras secciones**:
   - "Campañas" podría estar relacionada con "Email & SMS" y "Segmentación & Automatización"
   - "Landing Pages" podría estar relacionada con "A/B Testing & Experimentación"
   - No hay conexión clara entre secciones relacionadas

5. **Iconos inconsistentes**:
   - Megaphone para sección y "Campañas" (duplicado)
   - Globe para "Embudos & Landing Pages" (genérico)
   - UserCheck para "Afiliados & Referidos" (específico)
   - Falta coherencia visual

6. **Falta de indicadores visuales**:
   - No hay badges de campañas activas
   - No hay alertas de landing pages con bajo rendimiento
   - No hay indicadores de programas de referidos que requieren atención

**Sugerencias de mejora**:
- Estandarizar nombres (singular vs plural)
- Unificar estructura de rutas (todas bajo `/marketing/` o todas en raíz)
- Clarificar restricciones de acceso con tooltips o badges
- Añadir badges de notificaciones para campañas activas y programas
- Conectar con otras secciones relacionadas

---

## 5) KPIs y métricas recomendadas

### Métricas de adopción
- **Tasa de adopción de Campañas**: % de gimnasios que crean al menos una campaña
  - Meta: >60% para gimnasios
- **Tasa de adopción de Landing Pages**: % de usuarios que crean al menos una landing page
  - Meta: >40% para ambos roles
- **Tasa de adopción de Programas de Referidos**: % de usuarios que crean al menos un programa
  - Meta: >50% para ambos roles
- **Frecuencia de uso**: Número promedio de veces que se gestionan campañas/landing pages por semana
  - Meta: >2 veces/semana para usuarios activos
- **Retención de usuarios**: % de usuarios que vuelven después del primer uso
  - Meta: >75% retención a 30 días

### Tiempo de tarea
- **Tiempo para crear campaña**: Desde abrir builder hasta activar campaña
  - Meta: <15 minutos (campaña simple)
- **Tiempo para crear landing page**: Desde abrir builder hasta publicar
  - Meta: <30 minutos (landing page básica)
- **Tiempo para configurar programa de referidos**: Desde abrir modal hasta activar programa
  - Meta: <5 minutos (programa básico)
- **Tiempo para revisar analytics**: Desde abrir analytics hasta entender resultados
  - Meta: <2 minutos

### Conversión interna
- **Tasa de conversión de campañas**: % de campañas que generan al menos una conversión
  - Meta: >70%
- **Tasa de conversión de landing pages**: % de landing pages que generan al menos una conversión
  - Meta: >50%
- **Tasa de conversión de programas de referidos**: % de programas que generan al menos una conversión
  - Meta: >60%
- **Tasa de apertura de emails**: % de emails que se abren
  - Meta: >20%
- **Tasa de clicks en CTAs**: % de clicks en CTAs de landing pages
  - Meta: >5%

### Errores por flujo
- **Errores en envío de campañas**: % de campañas que fallan al enviar
  - Meta: <2%
- **Errores en publicación de landing pages**: % de landing pages que fallan al publicar
  - Meta: <1%
- **Errores en aplicación de recompensas**: % de recompensas que fallan al aplicar
  - Meta: <1%
- **Errores en tracking**: % de eventos que no se trackean correctamente
  - Meta: <1%

### Latencia clave
- **Tiempo de envío de campaña**: Desde activar hasta enviar todos los mensajes
  - Meta: <1 hora (para campaña de 1000 mensajes)
- **Tiempo de publicación de landing page**: Desde publicar hasta estar accesible
  - Meta: <30 segundos
- **Tiempo de generación de código de referido**: Desde crear programa hasta códigos disponibles
  - Meta: <1 segundo
- **Tiempo de actualización de analytics**: Desde evento hasta actualizar dashboard
  - Meta: <5 segundos (tiempo casi real)

---

## 6) Backlog priorizado (RICE/MoSCoW)

### MUST (top 3)

#### 1. Envío Real de Campañas Multi-canal
- **RICE Score**:
  - Reach: 100% campañas creadas
  - Impact: 10/10 (sin esto, campañas no tienen valor)
  - Confidence: 8/10
  - Effort: 10/10 (muy complejo, requiere múltiples integraciones)
  - **Score: 8.0**
- **Justificación**: Es la funcionalidad core. Sin envío real, las campañas no tienen valor funcional.
- **Esfuerzo estimado**: 12-14 semanas (2-3 desarrolladores + DevOps)

#### 2. Tracking Real de Eventos de Campañas
- **RICE Score**:
  - Reach: 100% campañas enviadas
  - Impact: 10/10 (necesario para medir rendimiento)
  - Confidence: 8/10
  - Effort: 9/10 (complejo, requiere sistema de tracking completo)
  - **Score: 8.9**
- **Justificación**: Sin tracking real, no se puede medir el rendimiento de campañas.
- **Esfuerzo estimado**: 10-12 semanas (2 desarrolladores)

#### 3. Publicación Real de Landing Pages
- **RICE Score**:
  - Reach: 100% landing pages creadas
  - Impact: 10/10 (sin esto, landing pages no son accesibles)
  - Confidence: 8/10
  - Effort: 9/10 (complejo, requiere hosting y renderizado)
  - **Score: 8.9**
- **Justificación**: Sin publicación real, las landing pages no son accesibles públicamente.
- **Esfuerzo estimado**: 10-12 semanas (2 desarrolladores + DevOps)

### SHOULD (top 3)

#### 4. Generación Real de Códigos de Referido
- **RICE Score**:
  - Reach: 100% programas de referidos creados
  - Impact: 10/10 (necesario para que funcionen programas)
  - Confidence: 8/10
  - Effort: 7/10 (medio/alto, requiere tracking)
  - **Score: 11.4**
- **Esfuerzo estimado**: 6-8 semanas

#### 5. Automatización Real de Secuencias de Outreach
- **RICE Score**:
  - Reach: 100% secuencias creadas
  - Impact: 9/10 (permite automatizar completamente)
  - Confidence: 7/10
  - Effort: 9/10 (complejo)
  - **Score: 7.0**
- **Esfuerzo estimado**: 10-12 semanas

#### 6. Tracking Real de Landing Pages
- **RICE Score**:
  - Reach: 100% landing pages publicadas
  - Impact: 9/10 (necesario para medir rendimiento)
  - Confidence: 8/10
  - Effort: 7/10 (medio/alto)
  - **Score: 10.3**
- **Esfuerzo estimado**: 6-8 semanas

### COULD (top 3)

#### 7. Aplicación Automática de Recompensas
- **RICE Score**:
  - Reach: 100% conversiones de referidos
  - Impact: 8/10 (permite automatizar completamente)
  - Confidence: 8/10
  - Effort: 6/10 (medio, requiere integración)
  - **Score: 10.7**
- **Esfuerzo estimado**: 5-6 semanas

#### 8. A/B Testing Integrado en Landing Pages
- **RICE Score**:
  - Reach: 100% landing pages
  - Impact: 8/10 (permite optimizar con datos)
  - Confidence: 7/10
  - Effort: 7/10 (medio/alto)
  - **Score: 8.0**
- **Esfuerzo estimado**: 6-7 semanas

#### 9. Integración con CRM para Segmentación
- **RICE Score**:
  - Reach: 100% campañas
  - Impact: 8/10 (permite segmentación real)
  - Confidence: 8/10
  - Effort: 7/10 (medio/alto)
  - **Score: 9.1**
- **Esfuerzo estimado**: 6-8 semanas

---

## 7) Próximos pasos

### 3 acciones accionables para la próxima iteración

#### 1. **Implementar Envío Básico de Emails (8 semanas)**
- **Acciones específicas**:
  - Integración con SendGrid o servicio de email similar
  - Configuración de templates de email
  - Envío de emails desde campañas (individual y masivo)
  - Sistema de colas para procesamiento de envíos masivos
  - Rate limiting y gestión de cuotas
  - Manejo básico de bounces y errores
  - Tracking básico de opens (pixel tracking)
- **Responsables**: Backend developer (1) + Frontend developer (0.5)
- **Entregables**:
  - Integración con SendGrid
  - Sistema de envío de emails
  - Tracking básico de opens

#### 2. **Implementar Publicación Básica de Landing Pages (8 semanas)**
- **Acciones específicas**:
  - Sistema de renderizado de landing pages desde JSON a HTML
  - Hosting básico en CDN o servidor propio
  - Generación de URLs únicas por landing page
  - Optimización básica de rendimiento (minificación, compresión)
  - SSL/HTTPS automático
  - Publicación/despublicación de landing pages
- **Responsables**: Backend developer (1) + Frontend developer (1)
- **Entregables**:
  - Sistema de renderizado HTML
  - Hosting de landing pages
  - URLs generadas

#### 3. **Implementar Generación y Tracking de Códigos de Referido (6 semanas)**
- **Acciones específicas**:
  - Generación automática de códigos únicos por usuario/programa
  - URLs de referido personalizadas (ej: /ref/USER123)
  - Tracking de clicks en URLs de referido
  - Identificación automática de referrer cuando referred se registra
  - Dashboard de códigos por usuario
  - Sistema básico de atribución
- **Responsables**: Backend developer (1) + Frontend developer (0.5)
- **Entregables**:
  - Generación de códigos
  - URLs de referido
  - Tracking de clicks

### Riesgos y supuestos

**Riesgos identificados**:
1. **Envíos pueden ser marcados como spam si no hay configuración correcta**:
   - Mitigación: Configuración de SPF, DKIM, DMARC, warming up de dominios, lista de verificación
   - Impacto: Alto - afecta deliverability de emails

2. **Landing pages pueden tener problemas de rendimiento si no están optimizadas**:
   - Mitigación: Optimización de imágenes, lazy loading, CDN, minificación, compresión
   - Impacto: Medio - afecta experiencia del usuario y SEO

3. **Tracking puede ser bloqueado por ad blockers o privacy settings**:
   - Mitigación: Tracking server-side cuando sea posible, fallbacks, información clara de privacidad
   - Impacto: Medio - afecta precisión de analytics

4. **Códigos de referido pueden ser compartidos abusivamente**:
   - Mitigación: Límites de uso por código, validación de referidos únicos, detección de fraude
   - Impacto: Medio - afecta coste de recompensas

**Supuestos**:
- Hay acceso a servicios de email (SendGrid, Mailchimp, etc.) con cuotas suficientes
- Hay infraestructura para hosting de landing pages (CDN, servidor, dominio)
- Hay base de datos para almacenar campañas, landing pages, eventos, códigos de referido
- Hay sistema de colas/jobs para procesamiento asíncrono (envíos, renderizado)
- Hay acceso a datos de clientes/leads para segmentación
- Los usuarios entienden conceptos básicos de marketing (puede requerir educación)

**Dependencias externas**:
- Servicios de email (SendGrid, Mailchimp, etc.)
- Servicios de SMS (opcional, Twilio, etc.)
- WhatsApp Business API (opcional, para WhatsApp)
- Servicios de hosting/CDN (AWS, Cloudflare, etc.)
- Servicios de analytics (Google Analytics, opcional)
- Base de datos para almacenamiento
- Sistema de colas/jobs para procesamiento asíncrono

---

> **Notas técnicas**: 
> - Todas las rutas son relativas desde la raíz del proyecto
> - Los componentes de Campañas están en `src/features/campanas-outreach/`
> - Los componentes de Landing Pages están en `src/features/embudos-ofertas-landing-pages/`
> - Los componentes de Referidos están en `src/features/afiliados-referidos/`
> - Las APIs están en `src/features/[Feature]/api/`




