# Análisis & Inteligencia — Diagnóstico funcional y de producto

## 1) Mapa de páginas de la sección

### Páginas principales

#### `/dashboard/analytics/inbox` — Lead Inbox Unificado & SLA
- **Componente raíz**: `src/features/LeadInboxUnificadoYSla/pages/LeadInboxUnificadoYSlaPage.tsx`
- **Componentes hijos**:
  - `LeadInboxContainer` (`src/features/LeadInboxUnificadoYSla/components/LeadInboxContainer.tsx`) - Contenedor principal del inbox
  - `InboxMetrics` (`src/features/LeadInboxUnificadoYSla/components/InboxMetrics.tsx`) - Métricas del inbox
  - `SLAMonitoringPanel` (`src/features/LeadInboxUnificadoYSla/components/SLAMonitoringPanel.tsx`) - Panel de monitoreo SLA
  - `ChannelStats` (`src/features/LeadInboxUnificadoYSla/components/ChannelStats.tsx`) - Estadísticas por canal
  - `LeadFilters` (`src/features/LeadInboxUnificadoYSla/components/LeadFilters.tsx`) - Filtros de búsqueda
  - `LeadCard` (`src/features/LeadInboxUnificadoYSla/components/LeadCard.tsx`) - Tarjeta individual de lead
- **API**: `src/features/LeadInboxUnificadoYSla/api/inbox.ts`
- **Estados**:
  - Loading: `isLoading` con `Loader2` spinner
  - Error: Card con `AlertCircle` y mensaje de error
  - Vacío: Card con `Inbox` icon y mensaje "No hay leads en tu inbox"
- **Guardias**: No hay guardias de autenticación explícitas (depende de Layout)

#### `/dashboard/intelligence/playbooks` — Librería de Campañas (Playbooks)
- **Componente raíz**: `src/features/LibreriaDeCampanasPlaybooks/pages/LibreriaDeCampanasPlaybooksPage.tsx`
- **Componentes hijos**:
  - `PlaybookLibraryContainer` (`src/features/LibreriaDeCampanasPlaybooks/components/PlaybookLibraryContainer.tsx`) - Contenedor principal
  - `PlaybookCard` (`src/features/LibreriaDeCampanasPlaybooks/components/PlaybookCard.tsx`) - Tarjeta de playbook
  - `PlaybookDetailModal` (`src/features/LibreriaDeCampanasPlaybooks/components/PlaybookDetailModal.tsx`) - Modal de detalles y activación
- **API**: `src/features/LibreriaDeCampanasPlaybooks/api/playbooks.ts`
- **Estados**:
  - Loading: `isLoading` con `Loader2` spinner
  - Error: Card con `AlertCircle` y mensaje de error, botón de reintentar
  - Vacío: Card con `Package` icon y mensaje "No hay playbooks disponibles"
- **Guardias**: No hay guardias explícitas (depende de Layout)

#### `/dashboard/intelligence/trend-analyzer` — Trend Analizer
- **Componente raíz**: `src/features/TrendAnalizer/pages/TrendAnalizerPage.tsx`
- **Estados**:
  - Loading: No hay estado de loading implementado
  - Error: No hay manejo de errores
  - Vacío: Estados vacíos para todas las secciones (Top Tendencias, Sugerencias de Contenido, Análisis de Competidores)
- **Guardias**: No hay guardias explícitas (depende de Layout)
- **Nota**: Esta página es principalmente informativa. No hay funcionalidad real de análisis de tendencias o competidores implementada.

#### `/analytics/acquisition` — Analítica de Adquisición
- **Componente raíz**: `src/features/analitica-de-adquisicion/pages/analitica-de-adquisicionPage.tsx`
- **Componentes hijos**:
  - `AcquisitionDashboardContainer` (`src/features/analitica-de-adquisicion/components/AcquisitionDashboardContainer.tsx`) - Dashboard principal
  - `AcquisitionChannelChart` (`src/features/analitica-de-adquisicion/components/AcquisitionChannelChart.tsx`) - Gráficos de canales
  - `CampaignsTable` (`src/features/analitica-de-adquisicion/components/CampaignsTable.tsx`) - Tabla de campañas
- **API**: `src/features/analitica-de-adquisicion/api/acquisitionApi.ts`
- **Hook**: `useAcquisitionApi` (`src/features/analitica-de-adquisicion/hooks/useAcquisitionApi.ts`)
- **Estados**:
  - Loading: `isLoading` manejado por el hook
  - Error: `error` manejado por el hook
  - Vacío: No hay estados vacíos explícitos (muestra gráficos vacíos)
- **Guardias**: No hay guardias explícitas (depende de Layout)
- **Adaptación**: Vista adaptada según rol (entrenador vs gimnasio) con diferentes canales y métricas

---

## 2) 10 problemas que hoy SÍ resuelve

### 1. **Inbox Unificado de Leads desde Múltiples Canales**
**Página(s)**: `/dashboard/analytics/inbox` (Lead Inbox Unificado & SLA)

**Problema cubierto**: No hay forma de ver todos los leads de diferentes canales (Instagram, Facebook, WhatsApp, Email, Web) en un solo lugar.

**Como lo resuelve el código**:
- `LeadInboxContainer` (`src/features/LeadInboxUnificadoYSla/components/LeadInboxContainer.tsx`) centraliza todos los leads
- `LeadCard` muestra información unificada: nombre, snippet del último mensaje, canal de origen, estado, SLA
- Iconos diferenciados por canal (Instagram, Facebook, WhatsApp, Email, Web)
- `getLeads` API agrega leads de múltiples canales
- Vista consistente independientemente del canal de origen

**Riesgos/limitaciones**:
- Leads son mock (no hay integración real con canales)
- No hay sincronización en tiempo real de nuevos leads
- Falta integración con APIs de Instagram, Facebook, WhatsApp

### 2. **Monitoreo de SLA (Service Level Agreement) con Alertas Visuales**
**Página(s)**: `/dashboard/analytics/inbox` (Lead Inbox Unificado & SLA)

**Problema cubierto**: No hay forma de saber qué leads requieren atención inmediata porque están cerca de vencer su SLA.

**Como lo resuelve el código**:
- `SLAMonitoringPanel` (`src/features/LeadInboxUnificadoYSla/components/SLAMonitoringPanel.tsx`) muestra métricas de SLA
- Estados de SLA: `on_time` (a tiempo), `at_risk` (en riesgo), `overdue` (vencido)
- Cálculo de tasa de cumplimiento (compliance rate)
- Barra de progreso visual con colores (verde ≥90%, amarillo ≥75%, rojo <75%)
- Estadísticas por estado con iconos y colores diferenciados
- Alerta cuando hay leads en riesgo o vencidos
- Tiempo promedio de respuesta mostrado

**Riesgos/limitaciones**:
- Cálculo de SLA es mock (no hay tracking real de tiempos de respuesta)
- No hay actualización en tiempo real cuando un SLA está por vencer
- Falta configuración de SLAs personalizados por canal

### 3. **Filtrado Avanzado de Leads por Estado, Canal y SLA**
**Página(s)**: `/dashboard/analytics/inbox` (Lead Inbox Unificado & SLA)

**Problema cubierto**: No hay forma de encontrar leads específicos cuando hay muchos en el inbox.

**Como lo resuelve el código**:
- `LeadFilters` permite filtrar por múltiples criterios simultáneos
- Filtros: búsqueda por texto, estado (new, contacted, converted, discarded), canal (instagram, facebook, whatsapp, email, web_form), SLA (on_time, at_risk, overdue)
- `filteredLeads` calcula resultados combinando todos los filtros
- Búsqueda por nombre o contenido del mensaje
- Toggle para mostrar/ocultar filtros

**Riesgos/limitaciones**:
- Filtrado es client-side (no hay paginación eficiente)
- No hay guardado de filtros favoritos
- Falta búsqueda avanzada con múltiples condiciones

### 4. **Métricas Agregadas del Inbox con KPIs Clave**
**Página(s)**: `/dashboard/analytics/inbox` (Lead Inbox Unificado & SLA)

**Problema cubierto**: No hay forma de ver el rendimiento general del inbox sin calcular métricas manualmente.

**Como lo resuelve el código**:
- `InboxMetrics` muestra KPIs agregados
- Métricas calculadas: Total Leads, Nuevos Leads, Contactados, Convertidos, Tasa de Cumplimiento SLA, Tiempo Promedio de Respuesta, Tasa de Conversión
- `calculateMetrics` función calcula métricas en tiempo real desde los leads
- Cards visuales con iconos y valores formateados

**Riesgos/limitaciones**:
- Cálculo es mock (no hay datos reales de tracking)
- No hay comparación con períodos anteriores
- Falta desglose por período (diario, semanal, mensual)

### 5. **Estadísticas por Canal de Adquisición**
**Página(s)**: `/dashboard/analytics/inbox` (Lead Inbox Unificado & SLA)

**Problema cubierto**: No hay forma de ver qué canal genera más leads y conversiones.

**Como lo resuelve el código**:
- `ChannelStats` (`src/features/LeadInboxUnificadoYSla/components/ChannelStats.tsx`) muestra estadísticas por canal
- Calcula leads totales y conversiones por canal (Instagram, Facebook, WhatsApp, Email, Web)
- Tasa de conversión por canal
- Iconos y colores diferenciados por canal
- Cards visuales con valores y porcentajes

**Riesgos/limitaciones**:
- Estadísticas son mock (no hay datos reales de tracking)
- No hay gráficos de tendencias por canal
- Falta comparación entre períodos

### 6. **Visualización de Librería de Playbooks con Filtrado por Objetivo**
**Página(s)**: `/dashboard/intelligence/playbooks` (Librería de Campañas)

**Problema cubierto**: No hay forma de encontrar campañas pre-diseñadas para diferentes objetivos sin buscar manualmente.

**Como lo resuelve el código**:
- `PlaybookLibraryContainer` muestra grid de playbooks
- `PlaybookCard` muestra información clave: nombre, descripción, objetivo (Captación, Retención, Monetización), tags, contadores de assets (emails, posts, landing pages, SMS)
- Filtro por objetivo (lead_generation, retention, monetization)
- Búsqueda por texto (aunque no funcional completamente)
- Iconos y colores diferenciados por objetivo
- Paginación para navegar entre playbooks

**Riesgos/limitaciones**:
- Playbooks son mock (no hay base de datos real)
- Búsqueda por texto no está completamente implementada
- Falta filtro por tags

### 7. **Preview y Activación de Playbooks con Copia de Assets**
**Página(s)**: `/dashboard/intelligence/playbooks` (Librería de Campañas)

**Problema cubierto**: No hay forma de ver qué incluye un playbook antes de activarlo o de activarlo fácilmente.

**Como lo resuelve el código**:
- `PlaybookDetailModal` (`src/features/LibreriaDeCampanasPlaybooks/components/PlaybookDetailModal.tsx`) muestra detalles completos
- Lista de assets incluidos (emails, posts sociales, landing pages, SMS) con preview
- Formulario de activación con nombre personalizado de campaña
- `activatePlaybook` API copia todos los assets automáticamente
- Botones "Preview" y "Activar" en cada `PlaybookCard`
- Modal con información detallada antes de activar

**Riesgos/limitaciones**:
- Activación es mock (no copia assets reales)
- No hay preview real de contenido de assets
- Falta personalización de assets antes de activar

### 8. **Dashboard de Analítica de Adquisición con Métricas por Canal**
**Página(s)**: `/analytics/acquisition` (Analítica de Adquisición)

**Problema cubierto**: No hay forma de ver qué canales de marketing generan más leads y conversiones sin analizar datos manualmente.

**Como lo resuelve el código**:
- `AcquisitionDashboardContainer` (`src/features/analitica-de-adquisicion/components/AcquisitionDashboardContainer.tsx`) muestra dashboard completo
- Métricas agregadas: Total Leads, Conversiones, Tasa de Conversión, CPA (Coste por Adquisición), Ingresos, ROAS (Retorno sobre Adquisición), LTV (Lifetime Value)
- Gráficos por canal con múltiples tipos (bar, pie, line)
- Selección de métrica para visualizar (leads, conversions, cpa, revenue)
- Comparación con período anterior (tendencias up/down)
- Vista adaptada según rol (entrenador vs gimnasio)

**Riesgos/limitaciones**:
- Datos son mock (no hay tracking real de canales)
- No hay integración con Google Analytics, Facebook Ads, etc.
- Falta atribución multi-touch

### 9. **Tabla de Campañas con Métricas de Rendimiento**
**Página(s)**: `/analytics/acquisition` (Analítica de Adquisición)

**Problema cubierto**: No hay forma de comparar el rendimiento de diferentes campañas para optimizar el marketing.

**Como lo resuelve el código**:
- `CampaignsTable` (`src/features/analitica-de-adquisicion/components/CampaignsTable.tsx`) muestra tabla de campañas
- Columnas: Campaña, Canal, Inversión, Leads, Conversiones, Tasa de Conversión, CPA, Revenue, ROAS, Estado
- Ordenamiento por columna (asc/desc)
- Badges de estado (Activa, Pausada, Completada)
- Indicadores de tendencia (up/down/neutral)
- Formato de moneda y porcentajes

**Riesgos/limitaciones**:
- Datos son mock (no hay tracking real de campañas)
- Ordenamiento no está completamente funcional
- Falta filtrado y búsqueda de campañas

### 10. **Gráficos Interactivos de Canales de Adquisición**
**Página(s)**: `/analytics/acquisition` (Analítica de Adquisición)

**Problema cubierto**: No hay forma de visualizar datos de canales de forma gráfica para entender mejor las tendencias.

**Como lo resuelve el código**:
- `AcquisitionChannelChart` (`src/features/analitica-de-adquisicion/components/AcquisitionChannelChart.tsx`) muestra gráficos
- Soporta múltiples tipos: bar (barras), pie (torta), line (línea)
- Selector de métrica: leads, conversions, cpa, revenue
- Colores diferenciados por canal
- Tooltips con información detallada
- Adaptación automática según datos disponibles

**Riesgos/limitaciones**:
- Gráficos son mock (no hay datos reales)
- No hay exportación de gráficos
- Falta zoom y drill-down en gráficos

---

## 3) 10 problemas que AÚN NO resuelve (y debería)

### 1. **Integración Real con Canales de Comunicación (Instagram, Facebook, WhatsApp, Email)**
**Necesidad detectada**: El inbox muestra leads pero no hay integración real con las APIs de los canales. No se sincronizan mensajes automáticamente.

**Propuesta de solución** (alto nivel + impacto):
- Integración con APIs de Instagram Business, Facebook Messenger, WhatsApp Business API, Email
- Sincronización automática de mensajes en tiempo real
- Webhooks para recibir notificaciones de nuevos mensajes
- Sistema de autenticación OAuth para cada plataforma
- Almacenamiento de historial completo de conversaciones
- **Impacto**: Alto - Sin esto, el inbox no funciona realmente. Es la funcionalidad core.

**Páginas/flujo afectados**:
- `LeadInboxContainer` (sincronización automática)
- Nuevo servicio `ChannelIntegrationService`
- Sistema de webhooks para recibir mensajes
- Base de datos para almacenar conversaciones

**Complejidad estimada**: Alta (requiere integración con múltiples APIs, OAuth, webhooks, tiempo real)

### 2. **Tracking Real de Tiempos de Respuesta y Cálculo Automático de SLA**
**Necesidad detectada**: Los SLA son mock. No hay tracking real de cuándo se recibe un lead y cuándo se responde.

**Propuesta de solución** (alto nivel + impacto):
- Timestamp automático cuando llega un lead
- Timestamp automático cuando se responde
- Cálculo automático de tiempo transcurrido
- Comparación con SLA configurado para determinar estado (on_time, at_risk, overdue)
- Alertas automáticas cuando un SLA está por vencer
- **Impacto**: Alto - Sin esto, el monitoreo SLA no funciona realmente.

**Páginas/flujo afectados**:
- `SLAMonitoringPanel` (cálculo real)
- Nuevo servicio `SLATrackingService`
- Sistema de eventos para tracking de respuestas
- Configuración de SLAs por canal

**Complejidad estimada**: Media/Alta (requiere tracking de eventos, cálculo automático, alertas)

### 3. **Sistema Real de Análisis de Tendencias y Competidores**
**Necesidad detectada**: Trend Analizer es solo informativo. No hay análisis real de tendencias o competidores.

**Propuesta de solución** (alto nivel + impacto):
- Integración con APIs de redes sociales para analizar tendencias
- Scraping o API de competidores para analizar su contenido
- Análisis de hashtags, temas, frecuencia de publicación
- Alertas cuando aparece una nueva tendencia
- Sugerencias de contenido basadas en tendencias detectadas
- **Impacto**: Alto - Sin esto, Trend Analizer no tiene valor funcional.

**Páginas/flujo afectados**:
- `TrendAnalizerPage` (añadir análisis real)
- Nuevo servicio `TrendAnalysisService`
- Nuevo servicio `CompetitorAnalysisService`
- Integración con APIs de redes sociales

**Complejidad estimada**: Alta (requiere scraping/APIs, análisis de texto, ML para detectar tendencias)

### 4. **Integración Real de Playbooks con Sistema de Campañas**
**Necesidad detectada**: La activación de playbooks es mock. No se crean campañas reales con los assets.

**Propuesta de solución** (alto nivel + impacto):
- Copia real de assets (emails, posts, landing pages, SMS) al activar playbook
- Creación automática de campaña en el sistema de campañas
- Personalización de assets antes de activar (opcional)
- Integración con módulos de email, redes sociales, landing pages
- **Impacto**: Alto - Sin esto, los playbooks no tienen valor funcional.

**Páginas/flujo afectados**:
- `PlaybookDetailModal` (activación real)
- Integración con módulo de campañas
- Integración con módulos de email, redes sociales, landing pages
- Nuevo servicio `PlaybookActivationService`

**Complejidad estimada**: Alta (requiere integración cross-module, copia de assets, creación de campañas)

### 5. **Atribución Multi-Touch y Modelos de Atribución**
**Necesidad detectada**: La analítica de adquisición solo muestra el último canal. No hay atribución multi-touch que muestre todo el customer journey.

**Propuesta de solución** (alto nivel + impacto):
- Tracking del customer journey completo (todos los touchpoints)
- Modelos de atribución: first-touch, last-touch, linear, time-decay, position-based
- Visualización del customer journey en gráficos
- Análisis de qué canales trabajan mejor juntos
- **Impacto**: Medio/Alto - Permite entender mejor qué canales realmente contribuyen a la conversión.

**Páginas/flujo afectados**:
- `AcquisitionDashboardContainer` (añadir modelos de atribución)
- Nuevo componente `AttributionModels`
- Nuevo servicio `AttributionService`
- Tracking de customer journey completo

**Complejidad estimada**: Media/Alta (requiere tracking completo, modelos de atribución, visualización)

### 6. **Integración con Google Analytics, Facebook Ads, etc.**
**Necesidad detectada**: Los datos de analítica de adquisición son mock. No hay integración con plataformas reales de analytics y ads.

**Propuesta de solución** (alto nivel + impacto):
- Integración con Google Analytics API para datos de tráfico
- Integración con Facebook Ads API para datos de campañas pagadas
- Integración con Google Ads API para datos de campañas
- Sincronización automática de datos
- Unificación de datos de múltiples fuentes
- **Impacto**: Alto - Sin esto, la analítica no tiene datos reales.

**Páginas/flujo afectados**:
- `AcquisitionDashboardContainer` (datos reales)
- Nuevo servicio `AnalyticsIntegrationService`
- Configuración de conexiones OAuth
- Sistema de sincronización de datos

**Complejidad estimada**: Alta (requiere integración con múltiples APIs, OAuth, sincronización)

### 7. **Reportes Personalizados y Exportación**
**Necesidad detectada**: No hay forma de exportar datos de analítica o crear reportes personalizados.

**Propuesta de solución** (alto nivel + impacto):
- Exportación a Excel/CSV de datos de adquisición
- Exportación de datos de inbox (leads, SLA)
- Generación de reportes PDF personalizados
- Reportes programados (resumen semanal/mensual por email)
- Templates de reportes predefinidos
- **Impacto**: Medio - Necesario para análisis avanzado y reportes gerenciales.

**Páginas/flujo afectados**:
- Todas las páginas de la sección (añadir botones de exportar)
- Nuevo componente `ReportGenerator`
- Nuevo servicio `ExportService`
- Sistema de reportes programados

**Complejidad estimada**: Baja/Media (requiere generación de archivos y templates)

### 8. **Alertas y Notificaciones Automáticas de SLA y Tendencias**
**Necesidad detectada**: No hay alertas cuando un SLA está por vencer o cuando hay nuevas tendencias.

**Propuesta de solución** (alto nivel + impacto):
- Alertas push cuando un lead está cerca de vencer su SLA
- Notificaciones cuando se detecta una nueva tendencia
- Alertas cuando un canal de adquisición tiene bajo rendimiento
- Configuración de umbrales personalizados
- Centro de notificaciones
- **Impacto**: Medio - Permite actuar proactivamente y no perder oportunidades.

**Páginas/flujo afectados**:
- Todas las páginas (añadir sistema de alertas)
- Nuevo componente `AlertsManager`
- Integración con sistema de notificaciones
- Nuevo servicio `AlertService`

**Complejidad estimada**: Media (requiere sistema de alertas, notificaciones, configuración)

### 9. **Análisis Predictivo de Conversión y Scoring de Leads**
**Necesidad detectada**: No hay predicción de qué leads tienen más probabilidad de convertir o análisis predictivo.

**Propuesta de solución** (alto nivel + impacto):
- Modelo de ML para predecir probabilidad de conversión
- Scoring automático de leads basado en comportamiento
- Análisis de qué características tienen los leads que convierten
- Recomendaciones de qué leads priorizar
- Dashboard de leads con mayor probabilidad de conversión
- **Impacto**: Medio/Alto - Permite optimizar esfuerzos y aumentar conversión.

**Páginas/flujo afectados**:
- `LeadInboxContainer` (añadir scoring)
- Nuevo componente `LeadScoringPanel`
- Nuevo servicio `PredictiveAnalyticsService`
- Integración con ML model

**Complejidad estimada**: Alta (requiere ML model, análisis de datos, scoring)

### 10. **Comparación de Playbooks y Métricas de Rendimiento**
**Necesidad detectada**: No hay forma de ver qué playbooks tienen mejor rendimiento o compararlos entre sí.

**Propuesta de solución** (alto nivel + impacto):
- Tracking de métricas de playbooks activados (leads generados, conversiones, revenue)
- Comparación de playbooks por objetivo
- Rankings de playbooks más efectivos
- Recomendaciones de qué playbook usar según objetivo
- Dashboard de rendimiento de playbooks
- **Impacto**: Medio - Permite optimizar qué playbooks usar.

**Páginas/flujo afectados**:
- `PlaybookLibraryContainer` (añadir métricas)
- Nuevo componente `PlaybookPerformanceComparison`
- Tracking de métricas de playbooks activados
- Nuevo servicio `PlaybookAnalyticsService`

**Complejidad estimada**: Media (requiere tracking de métricas, comparación, visualización)

---

## 4) Hallazgos desde navegación/menús

### Sidebar.tsx

**Estructura de la sección**:
```typescript
{
  id: 'analisis-inteligencia',
  title: 'Análisis & Inteligencia',
  icon: BarChart2,
  items: [
    { id: 'lead-inbox-unificado-sla', label: 'Lead Inbox Unificado & SLA', icon: Inbox, path: '/dashboard/analytics/inbox' },
    { id: 'libreria-campanas-playbooks', label: 'Librería de Campañas (Playbooks)', icon: BookOpen, path: '/dashboard/intelligence/playbooks' },
    { id: 'trend-analizer', label: 'Trend Analizer', icon: TrendingUp, path: '/dashboard/intelligence/trend-analyzer' },
    { id: 'analitica-de-adquisicion', label: 'Analítica de Adquisición', icon: LineChart, path: '/analytics/acquisition' },
  ],
}
```

**Permisos y visibilidad**:
- Todos los items son visibles para ambos roles (entrenador y gimnasio)
- No hay restricciones `entrenadorOnly` o `gimnasioOnly`
- No hay badges o contadores de notificaciones

**Inconsistencias de UX o naming**:
1. **Naming inconsistente**:
   - "Lead Inbox Unificado & SLA" (español + inglés)
   - "Librería de Campañas (Playbooks)" (español + inglés)
   - "Trend Analizer" (inglés, con typo - debería ser "Analyzer")
   - "Analítica de Adquisición" (español)
   - Mezcla de idiomas y formato inconsistente

2. **Rutas inconsistentes**:
   - `/dashboard/analytics/inbox` (analytics)
   - `/dashboard/intelligence/playbooks` (intelligence)
   - `/dashboard/intelligence/trend-analyzer` (intelligence)
   - `/analytics/acquisition` (analytics, sin dashboard/)
   - Mezcla de estructura de rutas y nombres de carpetas

3. **Falta de funcionalidad real en Trend Analizer**:
   - "Trend Analizer" es solo informativa
   - No hay funcionalidad real de análisis de tendencias
   - No hay análisis de competidores
   - Usuarios pueden confundirse al ver que no funciona

4. **Duplicación potencial con otras secciones**:
   - "Analítica de Adquisición" podría estar relacionada con "Marketing & Crecimiento"
   - "Lead Inbox" podría estar relacionado con "CRM & Clientes"
   - No hay conexión clara entre módulos

5. **Falta de indicadores visuales**:
   - No hay badges de leads que requieren atención (SLA vencido)
   - No hay indicadores de nuevas tendencias
   - No hay alertas de canales con bajo rendimiento

6. **Tipos de datos inconsistentes**:
   - Algunos módulos usan datos mock, otros tienen estructura más completa
   - No hay consistencia en cómo se manejan los datos

**Sugerencias de mejora**:
- Estandarizar nombres en español o inglés
- Unificar estructura de rutas (`/dashboard/analytics/` o `/dashboard/intelligence/`)
- Implementar funcionalidad real en Trend Analizer o renombrar/ocultar
- Añadir badges de notificaciones para SLA vencidos
- Clarificar propósito de cada módulo y su relación con otras secciones

---

## 5) KPIs y métricas recomendadas

### Métricas de adopción
- **Tasa de adopción por herramienta**: % de usuarios que usan cada herramienta al menos una vez por semana
  - Meta: >70% para Lead Inbox, >50% para Analítica de Adquisición, >40% para Playbooks, >30% para Trend Analizer
- **Frecuencia de uso**: Número promedio de sesiones por usuario por semana
  - Meta: >3 sesiones/semana para usuarios activos del inbox
- **Retención de usuarios**: % de usuarios que vuelven después del primer uso
  - Meta: >80% retención a 30 días

### Tiempo de tarea
- **Tiempo para responder a un lead**: Desde ver lead en inbox hasta responder
  - Meta: <5 minutos (lead urgente), <15 minutos (lead normal)
- **Tiempo para activar un playbook**: Desde seleccionar playbook hasta activar
  - Meta: <3 minutos (activación básica)
- **Tiempo para entender analíticas**: Desde abrir dashboard hasta entender insights
  - Meta: <1 minuto (vista de dashboard)
- **Tiempo para encontrar lead específico**: Desde buscar hasta encontrar lead
  - Meta: <30 segundos (con filtros)

### Conversión interna
- **Tasa de cumplimiento de SLA**: % de leads que se responden dentro del SLA
  - Meta: >90%
- **Tasa de uso de playbooks**: % de usuarios que activan al menos un playbook
  - Meta: >60%
- **Tasa de conversión de leads**: % de leads que se convierten en clientes
  - Meta: >25%
- **Tasa de uso de analíticas**: % de usuarios que revisan analíticas semanalmente
  - Meta: >50%

### Errores por flujo
- **Errores en sincronización de leads**: % de leads que no se sincronizan correctamente
  - Meta: <1%
- **Errores en cálculo de SLA**: % de SLA calculados incorrectamente
  - Meta: <0.5%
- **Errores en activación de playbook**: % de activaciones que fallan
  - Meta: <2%
- **Errores en carga de analíticas**: % de veces que las analíticas no cargan
  - Meta: <2%

### Latencia clave
- **Tiempo de carga de inbox**: Desde abrir página hasta mostrar leads
  - Meta: <1 segundo
- **Tiempo de sincronización de nuevos leads**: Desde llegar mensaje hasta aparecer en inbox
  - Meta: <30 segundos (tiempo real)
- **Tiempo de actualización de SLA**: Desde responder hasta actualizar estado SLA
  - Meta: <5 segundos
- **Tiempo de carga de analíticas**: Desde abrir dashboard hasta mostrar métricas
  - Meta: <2 segundos

---

## 6) Backlog priorizado (RICE/MoSCoW)

### MUST (top 3)

#### 1. Integración Real con Canales de Comunicación
- **RICE Score**:
  - Reach: 100% usuarios que usan inbox
  - Impact: 10/10 (sin esto, el inbox no funciona)
  - Confidence: 8/10 (tecnología conocida pero compleja)
  - Effort: 10/10 (muy complejo, requiere múltiples integraciones)
  - **Score: 8.0**
- **Justificación**: Es la funcionalidad core. Sin integración real, el inbox no tiene valor.
- **Esfuerzo estimado**: 10-12 semanas (2-3 desarrolladores full-time)

#### 2. Tracking Real de Tiempos de Respuesta y Cálculo Automático de SLA
- **RICE Score**:
  - Reach: 100% usuarios que usan inbox
  - Impact: 10/10 (sin esto, el monitoreo SLA no funciona)
  - Confidence: 9/10 (lógica conocida)
  - Effort: 6/10 (requiere tracking y cálculo)
  - **Score: 15.0**
- **Justificación**: Sin tracking real, el monitoreo SLA no tiene valor funcional.
- **Esfuerzo estimado**: 5-6 semanas (1-2 desarrolladores)

#### 3. Sistema Real de Análisis de Tendencias
- **RICE Score**:
  - Reach: 80% usuarios (solo quienes usan Trend Analizer)
  - Impact: 10/10 (sin esto, Trend Analizer no funciona)
  - Confidence: 7/10 (requiere scraping/APIs y análisis)
  - Effort: 9/10 (muy complejo)
  - **Score: 8.9**
- **Justificación**: Sin análisis real, Trend Analizer no tiene valor.
- **Esfuerzo estimado**: 8-10 semanas (2 desarrolladores)

### SHOULD (top 3)

#### 4. Integración Real de Playbooks con Sistema de Campañas
- **RICE Score**:
  - Reach: 100% usuarios que usan playbooks
  - Impact: 9/10 (necesario para funcionalidad completa)
  - Confidence: 8/10
  - Effort: 7/10 (requiere integración cross-module)
  - **Score: 10.3**
- **Esfuerzo estimado**: 6-7 semanas

#### 5. Integración con Google Analytics, Facebook Ads, etc.
- **RICE Score**:
  - Reach: 100% usuarios que usan analíticas
  - Impact: 9/10 (necesario para datos reales)
  - Confidence: 8/10
  - Effort: 8/10 (requiere múltiples integraciones)
  - **Score: 10.1**
- **Esfuerzo estimado**: 7-8 semanas

#### 6. Atribución Multi-Touch y Modelos de Atribución
- **RICE Score**:
  - Reach: 80% usuarios (solo quienes analizan canales)
  - Impact: 8/10 (permite entender mejor customer journey)
  - Confidence: 7/10
  - Effort: 7/10 (complejo)
  - **Score: 9.1**
- **Esfuerzo estimado**: 6-7 semanas

### COULD (top 3)

#### 7. Reportes Personalizados y Exportación
- **RICE Score**:
  - Reach: 60% usuarios (solo quienes necesitan reportes)
  - Impact: 7/10 (útil para análisis avanzado)
  - Confidence: 9/10
  - Effort: 5/10
  - **Score: 8.4**
- **Esfuerzo estimado**: 3-4 semanas

#### 8. Alertas y Notificaciones Automáticas
- **RICE Score**:
  - Reach: 100% usuarios
  - Impact: 7/10 (permite actuar proactivamente)
  - Confidence: 8/10
  - Effort: 5/10 (requiere sistema de notificaciones)
  - **Score: 11.2**
- **Esfuerzo estimado**: 4-5 semanas

#### 9. Análisis Predictivo de Conversión
- **RICE Score**:
  - Reach: 100% usuarios
  - Impact: 8/10 (permite optimizar esfuerzos)
  - Confidence: 6/10 (requiere ML)
  - Effort: 9/10 (muy complejo)
  - **Score: 5.3**
- **Esfuerzo estimado**: 8-10 semanas

---

## 7) Próximos pasos

### 3 acciones accionables para la próxima iteración

#### 1. **Implementar Tracking Real de Tiempos de Respuesta y SLA (5 semanas)**
- **Acciones específicas**:
  - Crear `SLATrackingService` que trackee eventos de recepción y respuesta de leads
  - Timestamp automático cuando llega un lead (evento `lead_received`)
  - Timestamp automático cuando se responde (evento `lead_responded`)
  - Cálculo automático de tiempo transcurrido
  - Comparación con SLA configurado para determinar estado
  - Actualización automática de `slaStatus` en tiempo real
  - Alertas cuando un SLA está por vencer (X minutos antes)
  - Configuración de SLAs por canal (diferentes tiempos para diferentes canales)
- **Responsables**: Backend developer (1) + Frontend developer (0.5)
- **Entregables**:
  - Sistema de tracking funcional
  - Cálculo automático de SLA
  - Alertas de SLA

#### 2. **Implementar Integración Básica con WhatsApp Business API (6 semanas)**
- **Acciones específicas**:
  - Integración con WhatsApp Business API para recibir mensajes
  - Webhook para recibir notificaciones de nuevos mensajes
  - Sincronización automática de mensajes en inbox
  - Almacenamiento de historial de conversaciones
  - Autenticación OAuth para WhatsApp
  - UI para configurar conexión de WhatsApp
  - Actualización en tiempo real del inbox cuando llega mensaje
- **Responsables**: Backend developer (1) + Frontend developer (1)
- **Entregables**:
  - Integración con WhatsApp funcional
  - Sincronización automática de mensajes
  - Inbox actualizado en tiempo real

#### 3. **Implementar Integración Real de Playbooks con Sistema de Campañas (6 semanas)**
- **Acciones específicas**:
  - Crear `PlaybookActivationService` que copie assets reales
  - Integración con módulo de campañas para crear campaña automáticamente
  - Copia de emails al módulo de email marketing
  - Copia de posts al módulo de redes sociales
  - Copia de landing pages al módulo de landing pages
  - Copia de SMS al módulo de SMS
  - Personalización opcional de assets antes de activar
  - Validación de que todos los assets se copiaron correctamente
- **Responsables**: Backend developer (1) + Frontend developer (1)
- **Entregables**:
  - Activación real de playbooks
  - Integración con módulos de campañas, email, redes sociales, landing pages, SMS

### Riesgos y supuestos

**Riesgos identificados**:
1. **Integración con múltiples APIs puede ser compleja y propensa a errores**:
   - Mitigación: Abstracciones claras, manejo robusto de errores, testing exhaustivo
   - Impacto: Alto - afecta todas las funcionalidades

2. **SLA puede calcularse incorrectamente si hay problemas de sincronización**:
   - Mitigación: Validación de timestamps, reconciliación periódica, logging completo
   - Impacto: Medio - afecta confianza en SLA

3. **Playbooks pueden fallar si algún módulo de destino no está disponible**:
   - Mitigación: Validación previa, rollback automático, notificaciones de error
   - Impacto: Medio - afecta activación de playbooks

4. **Datos de analíticas pueden tener inconsistencias si hay múltiples fuentes**:
   - Mitigación: Normalización de datos, validación cruzada, reconciliación
   - Impacto: Medio - afecta confianza en analíticas

**Supuestos**:
- Hay módulos de campañas, email, redes sociales, landing pages, SMS funcionales para integrar playbooks
- Hay sistema de eventos para tracking de acciones (lead_received, lead_responded)
- Los leads tienen identificadores únicos para tracking
- Hay base de datos para persistir leads, conversaciones, métricas, playbooks
- Hay acceso a APIs de WhatsApp Business, Instagram, Facebook (con permisos apropiados)

**Dependencias externas**:
- APIs de WhatsApp Business, Instagram Business, Facebook Messenger
- APIs de Google Analytics, Facebook Ads, Google Ads
- Sistema de eventos para tracking
- Sistema de notificaciones para alertas
- Base de datos para persistencia
- Servicios de ML para análisis predictivo (opcional)

---

> **Notas técnicas**: 
> - Todas las rutas son relativas desde la raíz del proyecto
> - Los componentes están en `src/features/[feature-name]/`
> - Las APIs están en `src/features/[feature-name]/api/`
> - Los tipos TypeScript están en `src/features/[feature-name]/types/`
















