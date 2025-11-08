# Publicidad & Retargeting — Diagnóstico funcional y de producto

## 1) Mapa de páginas de la sección

### Páginas principales

#### `/dashboard/marketing/anuncios` — Gestor de Anuncios
- **Componente raíz**: `src/features/GestorDeAnuncios/pages/GestorDeAnunciosPage.tsx`
- **Componentes hijos**:
  - `CampaignsDashboardContainer` (`src/features/GestorDeAnuncios/components/CampaignsDashboardContainer.tsx`)
  - `CampaignCreatorWizard` (`src/features/GestorDeAnuncios/components/CampaignCreatorWizard.tsx`)
  - `PerformanceMetricsGrid` (`src/features/GestorDeAnuncios/components/PerformanceMetricsGrid.tsx`)
- **API**: `src/features/GestorDeAnuncios/api/campaigns.ts`
- **Estados**:
  - Loading: `isLoading` con `Loader2` spinner
  - Error: Card con `AlertCircle` y mensaje de error, botón de reintentar
  - Vacío: Card con `Package` icon y mensaje "No hay campañas aún"
- **Guardias**: No hay guardias de autenticación explícitas (depende de Layout)

#### `/dashboard/marketing/retargeting` — Retargeting & Pixel Manager
- **Componente raíz**: `src/features/RetargetingYPixelManager/pages/RetargetingYPixelManagerPage.tsx`
- **Componentes hijos**:
  - `PixelCard` (`src/features/RetargetingYPixelManager/components/PixelCard.tsx`)
  - `AddPixelModal` (`src/features/RetargetingYPixelManager/components/AddPixelModal.tsx`)
  - `AudienceSuggestionsCard` (`src/features/RetargetingYPixelManager/components/AudienceSuggestionsCard.tsx`)
- **API**: `src/features/RetargetingYPixelManager/api/pixels.ts`
- **Estados**:
  - Loading: `isLoading` con `Loader2` spinner
  - Error: Card con `AlertCircle` y mensaje de error, botón de reintentar
  - Vacío: Card con `Target` icon y mensaje "No hay píxeles configurados"
- **Guardias**: No hay guardias explícitas (depende de Layout)

---

## 2) 10 problemas que hoy SÍ resuelve

### 1. **Creación Guiada de Campañas Publicitarias sin Conocimientos Técnicos**
**Página(s)**: `/dashboard/marketing/anuncios` (Gestor de Anuncios)

**Problema cubierto**: Crear campañas en Facebook Ads y Google Ads requiere conocimientos técnicos avanzados y múltiples pasos complejos.

**Como lo resuelve el código**:
- `CampaignCreatorWizard` (`src/features/GestorDeAnuncios/components/CampaignCreatorWizard.tsx`) es un wizard de 5 pasos que guía al usuario
- Paso 1: Selección de plataforma (Meta/Google), objetivo (Captar Leads, Mensajes, Promocionar Web) y nombre
- Paso 2: Configuración de audiencia (ubicación, edad, género, intereses)
- Paso 3: Presupuesto y duración con cálculo automático de costo estimado
- Paso 4: Creación del anuncio (título, descripción, imagen con preview)
- Paso 5: Resumen y confirmación antes de crear
- Validación en cada paso (`canAdvance`) para evitar errores

**Riesgos/limitaciones**:
- Wizard es mock (no hay integración real con APIs de Meta/Google)
- No hay validación de límites de caracteres por plataforma
- Falta preview real del anuncio antes de publicar

### 2. **Dashboard Centralizado de Métricas de Campañas Publicitarias**
**Página(s)**: `/dashboard/marketing/anuncios` (Gestor de Anuncios)

**Problema cubierto**: No hay forma de ver métricas agregadas de todas las campañas sin ir a cada plataforma individual.

**Como lo resuelve el código**:
- `CampaignsDashboardContainer` muestra métricas agregadas usando `getPerformance` API
- `PerformanceMetricsGrid` (`src/features/GestorDeAnuncios/components/PerformanceMetricsGrid.tsx`) muestra 6 métricas clave: Gasto Total, CPL, ROAS, Conversiones, CTR, Total Clics
- `MetricCards` muestra datos en tiempo real (aunque mock)
- Desglose diario disponible en `dailyBreakdown`

**Riesgos/limitaciones**:
- Métricas son mock (no hay datos reales de APIs)
- No hay comparación entre períodos
- Falta segmentación por plataforma en el dashboard

### 3. **Gestión de Estado de Campañas (Activar, Pausar, Reanudar)**
**Página(s)**: `/dashboard/marketing/anuncios` (Gestor de Anuncios)

**Problema cubierto**: No hay forma de pausar o reanudar campañas sin ir a cada plataforma publicitaria.

**Como lo resuelve el código**:
- `CampaignsDashboardContainer` muestra tarjetas de campañas con botones de acción según estado
- `handlePauseCampaign` y `handleResumeCampaign` permiten cambiar estado
- `getStatusBadge` muestra badges visuales de estado (Activa, Pausada, En Revisión, Error)
- Estados visibles: `active`, `paused`, `pending_review`, `error`

**Riesgos/limitaciones**:
- Cambios de estado son mock (no hay sincronización real con plataformas)
- No hay confirmación antes de pausar/reanudar
- Falta notificación cuando campaña cambia de estado externamente

### 4. **Filtrado y Búsqueda de Campañas por Plataforma y Estado**
**Página(s)**: `/dashboard/marketing/anuncios` (Gestor de Anuncios)

**Problema cubierto**: No hay forma de encontrar campañas específicas cuando hay muchas, especialmente por plataforma o estado.

**Como lo resuelve el código**:
- `CampaignsDashboardContainer` tiene filtros por plataforma (Meta, Google, Todas) y estado (Activas, Pausadas, En Revisión, Todas)
- Búsqueda por texto (aunque no implementada completamente)
- `filteredCampaigns` filtra dinámicamente según selección
- Contador de resultados y filtros aplicados

**Riesgos/limitaciones**:
- Búsqueda por texto no está implementada (solo UI)
- No hay filtros por fecha o rango de fechas
- Falta guardar filtros como favoritos

### 5. **Gestión de Píxeles de Seguimiento Multi-Plataforma**
**Página(s)**: `/dashboard/marketing/retargeting` (Retargeting & Pixel Manager)

**Problema cubierto**: No hay forma de gestionar píxeles de Facebook, Google Analytics y GTM en un solo lugar.

**Como lo resuelve el código**:
- `RetargetingYPixelManagerPage` gestiona múltiples píxeles de diferentes plataformas
- `PixelCard` (`src/features/RetargetingYPixelManager/components/PixelCard.tsx`) muestra información de cada pixel (plataforma, ID, estado, último evento)
- `AddPixelModal` permite agregar nuevos píxeles seleccionando plataforma y proporcionando ID
- `getPixels` API devuelve lista de píxeles con información completa

**Riesgos/limitaciones**:
- Píxeles son mock (no hay instalación real en páginas)
- No hay verificación de que el pixel ID es válido
- Falta health check real de píxeles

### 6. **Activación/Desactivación de Píxeles de Seguimiento**
**Página(s)**: `/dashboard/marketing/retargeting` (Retargeting & Pixel Manager)

**Problema cubierto**: No hay forma de activar o desactivar píxeles sin editar código manualmente.

**Como lo resuelve el código**:
- `PixelCard` tiene toggle switch para activar/desactivar pixel
- `handleToggleStatus` actualiza estado del pixel usando `updatePixel` API
- `getStatusLabel` y `getStatusColor` muestran estado visual (Activo/Inactivo)
- Estado se guarda y persiste

**Riesgos/limitaciones**:
- Cambio de estado es mock (no afecta instalación real del pixel)
- No hay confirmación antes de desactivar
- Falta notificación de impacto al desactivar

### 7. **Sugerencias Inteligentes de Audiencias para Retargeting**
**Página(s)**: `/dashboard/marketing/retargeting` (Retargeting & Pixel Manager)

**Problema cubierto**: No hay forma de identificar qué audiencias crear para retargeting sin análisis manual de datos.

**Como lo resuelve el código**:
- `AudienceSuggestionsCard` (`src/features/RetargetingYPixelManager/components/AudienceSuggestionsCard.tsx`) muestra sugerencias basadas en comportamiento
- `getAudienceSuggestions` API devuelve sugerencias como: "Visitantes de página de precios", "Abandono de inscripción", "Visitantes de contacto", etc.
- Cada sugerencia tiene descripción y criterios (URL_VISIT, EVENT_SEQUENCE)
- Botón "Crear Audiencia" para cada sugerencia

**Riesgos/limitaciones**:
- Sugerencias son mock (no hay análisis real de comportamiento)
- Botón "Crear Audiencia" no está implementado (solo UI)
- Falta personalización de criterios de sugerencias

### 8. **Visualización de Información de Píxeles con Estado de Salud**
**Página(s)**: `/dashboard/marketing/retargeting` (Retargeting & Pixel Manager)

**Problema cubierto**: No hay forma de saber si un pixel está funcionando correctamente sin revisar código o analytics externos.

**Como lo resuelve el código**:
- `PixelCard` muestra información completa: plataforma, ID, estado, último evento
- `formatLastEvent` formatea timestamp de último evento ("hace X minutos/horas/días")
- `getPixelHealthCheck` API (aunque no usado en UI) proporciona status, eventos últimas 24h, eventos últimos 7 días
- Indicadores visuales de estado con colores

**Riesgos/limitaciones**:
- Health check no se muestra en UI (solo existe en API mock)
- Último evento es mock (no hay datos reales)
- Falta alertas cuando pixel no funciona

### 9. **Cálculo Automático de Presupuesto Estimado de Campaña**
**Página(s)**: `/dashboard/marketing/anuncios` (Gestor de Anuncios)

**Problema cubierto**: No hay forma de calcular el costo total de una campaña sin hacer cálculos manuales.

**Como lo resuelve el código**:
- `CampaignCreatorWizard` calcula automáticamente presupuesto estimado en Paso 3
- `estimatedTotal` multiplica presupuesto diario por número de días entre fechas
- Muestra cálculo visual: "X días × €Y/día = €Z"
- Actualización en tiempo real cuando cambian fechas o presupuesto diario

**Riesgos/limitaciones**:
- Cálculo no incluye posibles variaciones de costo
- No hay validación de presupuesto mínimo/máximo por plataforma
- Falta advertencia si presupuesto es muy bajo para resultados

### 10. **Eliminación y Edición de Píxeles de Seguimiento**
**Página(s)**: `/dashboard/marketing/retargeting` (Retargeting & Pixel Manager)

**Problema cubierto**: No hay forma de eliminar o editar píxeles sin editar código manualmente.

**Como lo resuelve el código**:
- `PixelCard` tiene botones de editar (Settings) y eliminar (Trash2)
- `handleDeletePixel` elimina pixel usando `deletePixel` API
- Confirmación antes de eliminar (window.confirm)
- Botón de editar preparado (aunque funcionalidad no implementada completamente)

**Riesgos/limitaciones**:
- Eliminación es mock (no elimina pixel de páginas)
- Edición no está implementada (solo botón visible)
- Falta confirmación más robusta con advertencia de impacto

---

## 3) 10 problemas que AÚN NO resuelve (y debería)

### 1. **Integración Real con APIs de Meta y Google Ads para Crear Campañas**
**Necesidad detectada**: `createCampaign` es mock. No hay forma real de crear campañas en Facebook Ads o Google Ads desde la app.

**Propuesta de solución** (alto nivel + impacto):
- Integrar Facebook Marketing API para crear campañas reales en Meta
- Integrar Google Ads API para crear campañas reales en Google
- OAuth 2.0 para conectar cuentas publicitarias
- Mapeo de campos del wizard a parámetros de APIs
- **Impacto**: Alto - Es la funcionalidad core. Sin esto, la herramienta no es útil en producción.

**Páginas/flujo afectados**:
- `CampaignCreatorWizard` (necesita integración real)
- `createCampaign` en API necesita implementación real
- Nuevo componente `AdAccountConnector` para conectar cuentas

**Complejidad estimada**: Alta (requiere OAuth, APIs complejas, rate limits, manejo de errores)

### 2. **Sincronización Automática de Métricas de Campañas desde Plataformas**
**Necesidad detectada**: Métricas son mock. No hay forma de ver datos reales de rendimiento de campañas.

**Propuesta de solución** (alto nivel + impacto):
- Sincronización automática cada X horas de métricas desde Meta/Google APIs
- Webhooks para actualizaciones en tiempo real cuando hay cambios
- Cache inteligente para reducir llamadas a APIs
- Alertas cuando métricas cambian significativamente
- **Impacto**: Alto - Sin métricas reales, no se puede optimizar campañas.

**Páginas/flujo afectados**:
- `CampaignsDashboardContainer` (sincronización real)
- `getPerformance` en API necesita implementación real
- Nuevo servicio `CampaignMetricsSyncService`

**Complejidad estimada**: Alta (requiere sincronización, cache, webhooks)

### 3. **Instalación Automática de Píxeles en Páginas Web**
**Necesidad detectada**: Píxeles son mock. No hay forma real de instalar píxeles en landing pages o sitio web.

**Propuesta de solución** (alto nivel + impacto):
- Generación automática de código JavaScript para instalar píxeles
- Integración con módulo de Landing Pages para auto-instalación
- API pública para servir código de píxeles
- Verificación de instalación mediante health check
- **Impacto**: Alto - Sin instalación real, no hay tracking funcional.

**Páginas/flujo afectados**:
- `RetargetingYPixelManagerPage` (instalación real)
- Integración con módulo de Landing Pages
- Nuevo servicio `PixelInstallationService`

**Complejidad estimada**: Media/Alta (requiere generación de código, integración cross-module)

### 4. **Creación Real de Audiencias de Retargeting en Plataformas**
**Necesidad detectada**: Botón "Crear Audiencia" no funciona. No hay forma de crear audiencias reales en Facebook/Google.

**Propuesta de solución** (alto nivel + impacto):
- Integración con Facebook Custom Audiences API
- Integración con Google Ads Customer Match/Similar Audiences
- Conversión de criterios de sugerencias a parámetros de APIs
- Sincronización de audiencias creadas
- **Impacto**: Alto - Sin audiencias reales, no hay retargeting funcional.

**Páginas/flujo afectados**:
- `AudienceSuggestionsCard` (creación real)
- Nuevo componente `AudienceCreator`
- Integración con APIs de audiencias

**Complejidad estimada**: Alta (requiere APIs complejas, manejo de datos sensibles)

### 5. **Optimización Automática de Campañas Basada en Rendimiento**
**Necesidad detectada**: No hay forma de optimizar automáticamente campañas basándose en métricas.

**Propuesta de solución** (alto nivel + impacto):
- Reglas de optimización (si CPL > X, pausar; si ROAS < Y, reducir presupuesto)
- A/B testing automático de creativos
- Sugerencias inteligentes de optimización con IA
- Auto-ajuste de targeting basado en audiencias que convierten
- **Impacto**: Medio/Alto - Mejora ROI significativamente con mínimo esfuerzo.

**Páginas/flujo afectados**:
- `CampaignsDashboardContainer` (añadir optimizaciones)
- Nuevo componente `CampaignOptimizer`
- Nuevo servicio `OptimizationEngine`

**Complejidad estimada**: Alta (requiere IA, reglas complejas, pruebas A/B)

### 6. **Tracking de Eventos Personalizados y Conversiones**
**Necesidad detectada**: No hay forma de trackear eventos personalizados (completar formulario, ver video, etc.) más allá de eventos estándar.

**Propuesta de solución** (alto nivel + impacto):
- Editor de eventos personalizados con triggers configurables
- Integración con módulo de Landing Pages para tracking automático
- Dashboard de eventos con visualización de funnel
- Mapeo de eventos a conversiones en plataformas publicitarias
- **Impacto**: Medio/Alto - Permite tracking granular y optimización precisa.

**Páginas/flujo afectados**:
- Nueva página `CustomEventsManager`
- Integración con módulo de Landing Pages
- Nuevo componente `EventTrackerConfig`

**Complejidad estimada**: Media (requiere tracking, integración cross-module)

### 7. **Comparación de Rendimiento entre Campañas y Períodos**
**Necesidad detectada**: No hay forma de comparar rendimiento entre campañas o períodos para identificar qué funciona mejor.

**Propuesta de solución** (alto nivel + impacto):
- Vista de comparación side-by-side de campañas
- Comparación de períodos (mes anterior, año anterior)
- Gráficos de tendencias con múltiples campañas
- Identificación automática de campañas con mejor/worst performance
- **Impacto**: Medio - Permite identificar mejores prácticas y optimizar.

**Páginas/flujo afectados**:
- `CampaignsDashboardContainer` (añadir comparación)
- Nuevo componente `CampaignComparisonView`
- Modificar `getPerformance` para incluir comparaciones

**Complejidad estimada**: Media (requiere almacenamiento histórico y análisis)

### 8. **Plantillas de Campañas Pre-Optimizadas para Fitness**
**Necesidad detectada**: Wizard permite crear campañas desde cero, pero no hay plantillas probadas para el nicho fitness.

**Propuesta de solución** (alto nivel + impacto):
- Biblioteca de plantillas de campañas (Captación de Leads, Retención, Promoción de Retos)
- Plantillas con creativos, copy y targeting pre-configurado
- Plantillas basadas en mejores prácticas del sector fitness
- Opción de usar plantilla como base y personalizar
- **Impacto**: Medio - Acelera creación y mejora resultados con plantillas probadas.

**Páginas/flujo afectados**:
- `CampaignCreatorWizard` (añadir selector de plantillas)
- Nuevo componente `CampaignTemplatesLibrary`
- Nuevo servicio `TemplatesService`

**Complejidad estimada**: Baja/Media (requiere diseño de plantillas y almacenamiento)

### 9. **Reportes y Exportación de Datos de Campañas**
**Necesidad detectada**: No hay forma de exportar datos de campañas o generar reportes para análisis externo o presentaciones.

**Propuesta de solución** (alto nivel + impacto):
- Exportación a Excel/CSV de campañas con métricas
- Generación de reportes PDF con gráficos y análisis
- Reportes programados (enviar resumen semanal/mensual por email)
- Templates de reportes personalizables
- **Impacto**: Medio - Necesario para análisis avanzado y reportes gerenciales.

**Páginas/flujo afectados**:
- `CampaignsDashboardContainer` (añadir botón de exportar)
- Nuevo componente `ReportGenerator`
- Nuevo servicio `ExportService`

**Complejidad estimada**: Baja/Media (requiere generación de archivos y templates)

### 10. **Alertas y Notificaciones de Cambios en Campañas**
**Necesidad detectada**: No hay alertas cuando campañas cambian de estado, superan presupuesto, o tienen problemas.

**Propuesta de solución** (alto nivel + impacto):
- Alertas cuando campaña se pausa automáticamente (sin presupuesto)
- Notificaciones cuando CPL supera umbral configurado
- Alertas cuando pixel deja de funcionar
- Notificaciones de nuevas sugerencias de audiencias
- **Impacto**: Medio - Permite actuar rápidamente sobre problemas y oportunidades.

**Páginas/flujo afectados**:
- `CampaignsDashboardContainer` (añadir sistema de alertas)
- `RetargetingYPixelManagerPage` (añadir alertas de píxeles)
- Nuevo componente `AlertsManager`
- Integración con sistema de notificaciones

**Complejidad estimada**: Media (requiere sistema de alertas y notificaciones)

---

## 4) Hallazgos desde navegación/menús

### Sidebar.tsx

**Estructura de la sección**:
```typescript
{
  id: 'publicidad-retargeting',
  title: 'Publicidad & Retargeting',
  icon: Radio,
  items: [
    { id: 'gestor-de-anuncios', label: 'Gestor de Anuncios', icon: Megaphone, path: '/dashboard/marketing/anuncios' },
    { id: 'retargeting-pixel-manager', label: 'Retargeting & Pixel Manager', icon: Target, path: '/dashboard/marketing/retargeting' },
  ],
}
```

**Permisos y visibilidad**:
- Ambos items son visibles para ambos roles (entrenador y gimnasio)
- No hay restricciones `entrenadorOnly` o `gimnasioOnly`
- No hay badges o contadores de notificaciones

**Inconsistencias de UX o naming**:
1. **Naming inconsistente**: 
   - "Gestor de Anuncios" (español)
   - "Retargeting & Pixel Manager" (inglés)
   - Mezcla de idiomas en una misma sección

2. **Falta de relación con otras secciones**:
   - "Campañas y Outreach" está en sección "CRM & Clientes" pero es similar conceptualmente
   - Hay duplicación funcional potencial entre "Gestor de Anuncios" y "Campañas y Outreach"
   - "Analítica de Adquisición" podría estar relacionada pero está en otra sección

3. **Falta de indicadores visuales**:
   - No hay badges de campañas que requieren atención (pausadas por error, sin presupuesto)
   - No hay indicadores de píxeles con problemas
   - No hay alertas de métricas fuera de rango

4. **Rutas inconsistentes**:
   - `/dashboard/marketing/anuncios` (anuncios)
   - `/dashboard/marketing/retargeting` (retargeting)
   - Ambos bajo `/dashboard/marketing/` pero sección se llama "Publicidad & Retargeting"

**Sugerencias de mejora**:
- Estandarizar nombres en español o inglés
- Consolidar o diferenciar claramente "Gestor de Anuncios" vs "Campañas y Outreach"
- Añadir badges de notificaciones para campañas/píxeles que requieren atención
- Unificar prefijos de rutas si pertenecen a la misma sección funcional

---

## 5) KPIs y métricas recomendadas

### Métricas de adopción
- **Tasa de adopción por herramienta**: % de usuarios que usan cada herramienta al menos una vez al mes
  - Meta: >60% para Gestor de Anuncios, >40% para Pixel Manager
- **Frecuencia de uso**: Número promedio de sesiones por usuario por semana
  - Meta: >1 sesión/semana para usuarios activos
- **Retención de usuarios**: % de usuarios que vuelven después del primer uso
  - Meta: >70% retención a 30 días

### Tiempo de tarea
- **Tiempo para crear una campaña**: Desde "Nueva Campaña" hasta completar wizard
  - Meta: <10 minutos (campaña básica)
- **Tiempo para agregar un pixel**: Desde "Añadir Pixel" hasta guardar
  - Meta: <2 minutos
- **Tiempo para entender métricas**: Desde abrir dashboard hasta entender insights
  - Meta: <30 segundos (vista de dashboard)

### Conversión interna
- **Tasa de campañas activas**: % de campañas creadas que se activan
  - Meta: >80%
- **Tasa de píxeles activos**: % de píxeles configurados que están activos
  - Meta: >90%
- **Tasa de uso de sugerencias de audiencias**: % de sugerencias que se convierten en audiencias
  - Meta: >30%

### Errores por flujo
- **Errores en creación de campañas**: % de intentos de crear campaña que fallan
  - Meta: <2%
- **Errores en conexión de cuentas publicitarias**: % de conexiones OAuth que fallan
  - Meta: <5%
- **Errores en sincronización de métricas**: % de sincronizaciones que fallan
  - Meta: <3%

### Latencia clave
- **Tiempo de carga de campañas**: Desde abrir página hasta mostrar campañas
  - Meta: <1.5 segundos
- **Tiempo de sincronización de métricas**: Desde iniciar sync hasta completar
  - Meta: <30 segundos (depende de volumen)
- **Tiempo de creación de campaña**: Desde enviar wizard hasta confirmación
  - Meta: <5 segundos (siempre que sea mock, instantáneo en producción sería ideal)

---

## 6) Backlog priorizado (RICE/MoSCoW)

### MUST (top 3)

#### 1. Integración Real con APIs de Meta y Google Ads
- **RICE Score**: 
  - Reach: 100% usuarios (todos necesitan crear campañas reales)
  - Impact: 10/10 (sin esto, la herramienta no funciona)
  - Confidence: 8/10 (APIs están documentadas)
  - Effort: 9/10 (muy complejo)
  - **Score: 8.9**
- **Justificación**: Es la funcionalidad core. Sin creación real de campañas, la herramienta no tiene valor.
- **Esfuerzo estimado**: 8-10 semanas (1-2 desarrolladores full-time)

#### 2. Instalación Automática de Píxeles en Páginas Web
- **RICE Score**:
  - Reach: 100% usuarios que usan píxeles
  - Impact: 10/10 (sin esto, no hay tracking funcional)
  - Confidence: 9/10 (tecnología conocida)
  - Effort: 6/10 (requiere integración pero no muy complejo)
  - **Score: 15.0**
- **Justificación**: Sin instalación real de píxeles, no hay tracking ni retargeting funcional.
- **Esfuerzo estimado**: 4-5 semanas (1 desarrollador)

#### 3. Sincronización Automática de Métricas de Campañas
- **RICE Score**:
  - Reach: 100% usuarios
  - Impact: 9/10 (necesario para optimización)
  - Confidence: 8/10 (APIs disponibles)
  - Effort: 7/10 (complejo pero factible)
  - **Score: 12.9**
- **Justificación**: Sin métricas reales, no se puede optimizar ni tomar decisiones.
- **Esfuerzo estimado**: 5-6 semanas (1 desarrollador)

### SHOULD (top 3)

#### 4. Creación Real de Audiencias de Retargeting
- **RICE Score**:
  - Reach: 80% usuarios (solo quienes usan retargeting)
  - Impact: 9/10 (core de retargeting)
  - Confidence: 7/10 (APIs complejas)
  - Effort: 8/10 (muy complejo)
  - **Score: 7.9**
- **Esfuerzo estimado**: 6-8 semanas

#### 5. Plantillas de Campañas Pre-Optimizadas
- **RICE Score**:
  - Reach: 100% usuarios
  - Impact: 8/10 (acelera creación y mejora resultados)
  - Confidence: 9/10 (diseño de plantillas conocido)
  - Effort: 4/10 (relativamente simple)
  - **Score: 20.0**
- **Esfuerzo estimado**: 2-3 semanas

#### 6. Tracking de Eventos Personalizados
- **RICE Score**:
  - Reach: 70% usuarios (solo power users)
  - Impact: 8/10 (permite tracking granular)
  - Confidence: 8/10
  - Effort: 6/10 (requiere integración)
  - **Score: 9.3**
- **Esfuerzo estimado**: 4-5 semanas

### COULD (top 3)

#### 7. Optimización Automática de Campañas
- **RICE Score**:
  - Reach: 60% usuarios (solo power users)
  - Impact: 9/10 (mejora ROI significativamente)
  - Confidence: 6/10 (complejo de implementar)
  - Effort: 9/10 (muy complejo)
  - **Score: 3.6**
- **Esfuerzo estimado**: 8-10 semanas

#### 8. Comparación de Rendimiento entre Campañas
- **RICE Score**:
  - Reach: 70% usuarios (solo usuarios avanzados)
  - Impact: 7/10 (permite identificar mejores prácticas)
  - Confidence: 8/10
  - Effort: 5/10 (requiere almacenamiento histórico)
  - **Score: 9.8**
- **Esfuerzo estimado**: 3-4 semanas

#### 9. Alertas y Notificaciones de Cambios
- **RICE Score**:
  - Reach: 100% usuarios
  - Impact: 7/10 (permite actuar rápidamente)
  - Confidence: 8/10
  - Effort: 5/10 (requiere sistema de notificaciones)
  - **Score: 11.2**
- **Esfuerzo estimado**: 3-4 semanas

---

## 7) Próximos pasos

### 3 acciones accionables para la próxima iteración

#### 1. **Implementar Integración OAuth con Meta y Google Ads (8 semanas)**
- **Acciones específicas**:
  - Configurar aplicaciones en Meta Business y Google Cloud Console
  - Implementar flujo OAuth 2.0 en backend para ambas plataformas
  - Crear endpoints de callback y refresh tokens
  - Implementar `connectAdAccount` real usando Meta Marketing API y Google Ads API
  - Crear `AdAccountConnector` component para gestionar conexiones
  - Validar permisos y scopes necesarios
  - Añadir manejo de errores y rate limits
- **Responsables**: Backend developer (1) + Frontend developer (0.5)
- **Entregables**: 
  - Conexión funcional de cuentas Meta/Google
  - Gestión de tokens y refresh automático
  - UI para conectar/desconectar cuentas

#### 2. **Implementar Creación Real de Campañas en Meta y Google (6 semanas)**
- **Acciones específicas**:
  - Mapear campos del wizard a parámetros de Meta Marketing API
  - Mapear campos del wizard a parámetros de Google Ads API
  - Implementar `createCampaign` real en backend
  - Validar límites de caracteres, presupuestos mínimos, etc.
  - Manejar diferentes objetivos según plataforma
  - Crear lógica de conversión de intereses a targeting de plataformas
  - Añadir manejo de errores específicos de cada plataforma
- **Responsables**: Backend developer (1) + Frontend developer (0.5)
- **Entregables**:
  - Creación real de campañas en Meta
  - Creación real de campañas en Google Ads
  - Validación y manejo de errores robusto

#### 3. **Implementar Instalación Automática de Píxeles (4 semanas)**
- **Acciones específicas**:
  - Crear servicio `PixelInstallationService` que genere código JavaScript
  - Integrar con módulo de Landing Pages para auto-instalación
  - Crear API pública para servir código de píxeles dinámicamente
  - Implementar health check real usando eventos de píxeles
  - Crear componente `PixelCodeGenerator` para mostrar código
  - Añadir instrucciones de instalación manual como fallback
- **Responsables**: Full-stack developer (1)
- **Entregables**:
  - Instalación automática en landing pages
  - Health check funcional
  - Código generado automáticamente

### Riesgos y supuestos

**Riesgos identificados**:
1. **APIs de Meta/Google cambian frecuentemente**: 
   - Mitigación: Abstraer lógica en servicio, versionar APIs, monitorear cambios
   - Impacto: Alto si ocurre

2. **Límites de rate de APIs pueden ser restrictivos**:
   - Mitigación: Implementar queue y throttling, cachear respuestas
   - Impacto: Medio - afecta sincronización en tiempo real

3. **Permisos de OAuth pueden ser rechazados por usuarios**:
   - Mitigación: Explicar claramente qué permisos se necesitan y por qué, guía paso a paso
   - Impacto: Medio - afecta adopción

4. **Instalación de píxeles puede fallar por bloqueadores de anuncios**:
   - Mitigación: Detectar bloqueadores, mostrar advertencia, ofrecer alternativas
   - Impacto: Bajo/Medio - afecta tracking pero no bloquea funcionalidad

**Supuestos**:
- Usuarios tienen cuentas de Meta Business y Google Ads activas
- APIs de Meta y Google están disponibles y accesibles
- Hay integración con módulo de Landing Pages para instalación de píxeles
- Usuarios tienen conocimientos básicos de marketing digital (targeting, presupuestos)

**Dependencias externas**:
- Meta Marketing API (requiere aprobación de aplicación)
- Google Ads API (requiere aprobación y acceso)
- Módulo de Landing Pages para instalación automática de píxeles
- Sistema de notificaciones para alertas (si se implementa)

---

> **Notas técnicas**: 
> - Todas las rutas son relativas desde la raíz del proyecto
> - Los componentes están en `src/features/[feature-name]/`
> - Las APIs están en `src/features/[feature-name]/api/`
> - Los tipos TypeScript están en `src/features/[feature-name]/types/`







