# Integraciones & Partnerships — Diagnóstico funcional y de producto

## 1) Mapa de páginas de la sección

### Páginas principales

#### `/dashboard/partnerships` — Partnerships & Influencers
- **Componente raíz**: `src/features/PartnershipsYInfluencers/pages/PartnershipsYInfluencersPage.tsx`
- **Componentes hijos**:
  - `PartnersDashboardContainer` (`src/features/PartnershipsYInfluencers/components/PartnersDashboardContainer.tsx`) - Dashboard de KPIs y estadísticas
  - `PartnersList` (`src/features/PartnershipsYInfluencers/components/PartnersList.tsx`) - Lista de partners con tarjetas
  - `AddPartnerModal` (`src/features/PartnershipsYInfluencers/components/AddPartnerModal.tsx`) - Modal para añadir nuevo partner
- **API**: `src/features/PartnershipsYInfluencers/api/partnerships.ts`
- **Estados**:
  - Loading: `isLoading` con `Loader2` spinner
  - Error: Card con `AlertCircle` y mensaje de error
  - Vacío: Card con `Package` icon y mensaje "No hay partners registrados"
- **Guardias**: No hay guardias explícitas (depende de Layout)

#### `/abm` — Account-Based Marketing (ABM)
- **Componente raíz**: `src/features/AccountBasedMarketingAbm/pages/AccountBasedMarketingAbmPage.tsx`
- **Componentes hijos**:
  - `ABMPipelineView` (`src/features/AccountBasedMarketingAbm/components/ABMPipelineView.tsx`) - Vista Kanban del pipeline de ventas
  - `AccountDetailPanel` (`src/features/AccountBasedMarketingAbm/components/AccountDetailPanel.tsx`) - Panel de detalles de cuenta
  - `DealCard` (`src/features/AccountBasedMarketingAbm/components/DealCard.tsx`) - Tarjeta individual de deal/oportunidad
- **API**: `src/features/AccountBasedMarketingAbm/api/abm.ts`
- **Estados**:
  - Loading: `loading` con `Loader2` spinner
  - Error: Card con `AlertCircle` y mensaje de error, botón de reintentar
  - Vacío: Estados vacíos para tabs "Cuentas" y "Analíticas" (no implementados)
- **Guardias**: No hay guardias explícitas (depende de Layout)
- **Tabs**: Pipeline, Cuentas, Analíticas (solo Pipeline está completamente implementado)

#### `/settings/integrations` — Integraciones y Automatización
- **Nota**: Esta página está en otra sección del Sidebar ("Integraciones & Automatización"), pero está relacionada funcionalmente con "Integraciones & Partnerships"
- **Componente raíz**: `src/features/integraciones-y-automatizacion/pages/integraciones-y-automatizacionPage.tsx`
- **Componentes hijos**:
  - `IntegrationGalleryContainer` (`src/features/integraciones-y-automatizacion/components/IntegrationGalleryContainer.tsx`) - Galería de integraciones disponibles
  - `IntegrationCard` (`src/features/integraciones-y-automatizacion/components/IntegrationCard.tsx`) - Tarjeta individual de integración
  - `IntegrationSettingsModal` (`src/features/integraciones-y-automatizacion/components/IntegrationSettingsModal.tsx`) - Modal de configuración de integración
- **API**: `src/features/integraciones-y-automatizacion/api/index.ts`
- **Estados**:
  - Loading: `isLoading` con `Loader2` spinner
  - Error: Card con `AlertCircle` y mensaje de error, botón de reintentar
  - Vacío: No hay estados vacíos explícitos
- **Guardias**: No hay guardias explícitas (depende de Layout)

---

## 2) 10 problemas que hoy SÍ resuelve

### 1. **Gestión de Partners e Influencers con Información Completa**
**Página(s)**: `/dashboard/partnerships` (Partnerships & Influencers)

**Problema cubierto**: No hay forma de gestionar una red de colaboradores profesionales (nutricionistas, fisioterapeutas) e influencers de forma centralizada.

**Como lo resuelve el código**:
- `PartnershipsYInfluencersPage` permite crear y gestionar partners
- `Partner` interface incluye: nombre, tipo (professional/influencer), especialidad, contacto (email, teléfono, Instagram, website), acuerdo (tipo de comisión, valor), estado (active/inactive)
- `PartnersList` muestra información clave de cada partner: stats (referidos, conversiones, comisiones), acuerdo de comisión, estado
- Filtrado por tipo (professional/influencer) y estado (active/inactive)
- Búsqueda por nombre o especialidad

**Riesgos/limitaciones**:
- Partners son mock (no hay persistencia real)
- No hay integración con sistema de referidos para tracking automático
- Falta historial de interacciones con partners

### 2. **Dashboard de KPIs de Partnerships con Métricas Agregadas**
**Página(s)**: `/dashboard/partnerships` (Partnerships & Influencers)

**Problema cubierto**: No hay forma de ver el rendimiento general del programa de partnerships sin calcular métricas manualmente.

**Como lo resuelve el código**:
- `PartnersDashboardContainer` muestra KPIs agregados
- Métricas: Partners Activos, Comisiones Totales, Pendientes de Pago, Ingresos por Referidos
- Estadísticas de conversión: Referidos Enviados (total, convertidos, tasa), Referidos Recibidos (total, convertidos, tasa)
- Top Partners con ranking de conversiones y comisiones
- `getPartnershipsKPI` API calcula métricas agregadas

**Riesgos/limitaciones**:
- KPIs son mock (no hay datos reales de tracking)
- No hay comparación con períodos anteriores
- Falta desglose temporal (diario, semanal, mensual)

### 3. **Generación de Links de Referido para Partners**
**Página(s)**: `/dashboard/partnerships` (Partnerships & Influencers)

**Problema cubierto**: No hay forma de generar links únicos de referido para cada partner para tracking de conversiones.

**Como lo resuelve el código**:
- `generateReferralLink` API genera link único por partner
- Modal para mostrar link generado con botón de copiar
- Link copiado al portapapeles con feedback visual
- Tracking code único por partner incluido en el link

**Riesgos/limitaciones**:
- Generación de links es mock (no hay sistema real de tracking)
- No hay validación de links o expiración
- Falta analytics de clicks en links

### 4. **Filtrado y Búsqueda Avanzada de Partners**
**Página(s)**: `/dashboard/partnerships` (Partnerships & Influencers)

**Problema cubierto**: No hay forma de encontrar partners específicos cuando hay muchos registrados.

**Como lo resuelve el código**:
- Búsqueda por texto (nombre o especialidad)
- Filtros: tipo (professional/influencer), estado (active/inactive)
- Panel de filtros colapsable
- Contador de filtros activos
- Botón "Limpiar" para resetear filtros
- Resumen de resultados encontrados

**Riesgos/limitaciones**:
- Filtrado es client-side (no hay paginación eficiente)
- No hay guardado de filtros favoritos
- Falta ordenamiento por métricas (más referidos, más comisiones)

### 5. **Pipeline Kanban de Ventas B2B con Drag & Drop**
**Página(s)**: `/abm` (Account-Based Marketing)

**Problema cubierto**: No hay forma de gestionar oportunidades de venta B2B de forma visual con un pipeline.

**Como lo resuelve el código**:
- `ABMPipelineView` muestra pipeline Kanban con etapas: Prospección, Contacto Establecido, Propuesta Enviada, Negociación, Ganado, Perdido
- `DealCard` muestra información clave: título, cuenta, valor, probabilidad, próxima acción
- Drag & drop para mover deals entre etapas
- Actualización optimista de UI
- `updateDealStage` API actualiza etapa en backend
- Visualización de valor total por etapa

**Riesgos/limitaciones**:
- Pipeline es mock (no hay persistencia real)
- Drag & drop puede fallar si hay problemas de red
- Falta validación de transiciones entre etapas

### 6. **Dashboard de Métricas ABM con KPIs Clave**
**Página(s)**: `/abm` (Account-Based Marketing)

**Problema cubierto**: No hay forma de ver el rendimiento del pipeline B2B sin calcular métricas manualmente.

**Como lo resuelve el código**:
- `AccountBasedMarketingAbmPage` muestra métricas agregadas
- KPIs: Valor del Pipeline, Tasa de Conversión, Ciclo de Venta, Cuentas Nuevas, Engagement Propuestas, Ingresos ABM
- Comparación con período anterior (tendencias up/down)
- `getABMAnalytics` API calcula métricas desde deals y cuentas

**Riesgos/limitaciones**:
- Métricas son mock (no hay datos reales)
- No hay desglose por cuenta o etapa
- Falta proyección de ingresos futuros

### 7. **Gestión de Cuentas Corporativas con Contactos**
**Página(s)**: `/abm` (Account-Based Marketing)

**Problema cubierto**: No hay forma de gestionar información de empresas objetivo y sus contactos clave.

**Como lo resuelve el código**:
- `Account` interface incluye: nombre empresa, industria, website, número de empleados, contactos, deals, log de actividades
- `AccountDetailPanel` muestra información completa de cuenta: contactos clave, deals asociados, historial de actividades
- `Contact` interface incluye: nombre, rol, email, teléfono, es contacto clave
- Visualización de contactos con iconos y badges
- Historial de actividades (emails, llamadas, reuniones, propuestas)

**Riesgos/limitaciones**:
- Cuentas son mock (no hay persistencia real)
- No hay sincronización con CRM externo
- Falta importación masiva de cuentas

### 8. **Galería de Integraciones con Categorización**
**Página(s)**: `/settings/integrations` (Integraciones y Automatización)

**Problema cubierto**: No hay forma de ver qué integraciones están disponibles y conectarlas fácilmente.

**Como lo resuelve el código**:
- `IntegrationGalleryContainer` muestra integraciones agrupadas por categoría: Pagos (Stripe, PayPal), Calendarios (Google Calendar, Outlook), Marketing (Mailchimp), Comunicación (WhatsApp), Salud (Apple Health, Google Fit)
- `IntegrationCard` muestra: nombre, descripción, logo, estado (connected/disconnected/error), última sincronización
- Badges de estado con colores diferenciados
- Botones de acción según estado: "Conectar" o "Gestionar"

**Riesgos/limitaciones**:
- Integraciones son mock (no hay conexión real)
- No hay preview de funcionalidades antes de conectar
- Falta información de requisitos previos

### 9. **Flujo OAuth para Conectar Integraciones**
**Página(s)**: `/settings/integrations` (Integraciones y Automatización)

**Problema cubierto**: No hay forma de autenticar y conectar integraciones de forma segura con OAuth.

**Como lo resuelve el código**:
- `handleConnect` inicia flujo OAuth con popup
- `connectIntegration` API devuelve URL de autorización
- Popup para autenticación OAuth
- Escucha de mensajes del popup para completar autenticación
- Manejo de errores de OAuth
- Actualización automática del estado después de conectar

**Riesgos/limitaciones**:
- Flujo OAuth es mock (no hay backend real)
- Popup puede ser bloqueado por navegador
- Falta manejo de refresh tokens

### 10. **Configuración Personalizada de Integraciones**
**Página(s)**: `/settings/integraciones` (Integraciones y Automatización)

**Problema cubierto**: No hay forma de configurar el comportamiento de integraciones después de conectarlas.

**Como lo resuelve el código**:
- `IntegrationSettingsModal` permite configurar settings por tipo de integración
- Settings específicos según integración: calendarios (calendario a sincronizar, recordatorios), pagos (auto-capture, moneda, webhook), WhatsApp (habilitar recordatorios, tiempo), Mailchimp (lista, auto-subscribe)
- Guardado de configuración con `updateSettings` API
- Validación de settings antes de guardar

**Riesgos/limitaciones**:
- Settings son mock (no hay persistencia real)
- No hay validación de settings según integración
- Falta preview de cambios antes de aplicar

---

## 3) 10 problemas que AÚN NO resuelve (y debería)

### 1. **Tracking Real de Referidos y Conversiones desde Links**
**Necesidad detectada**: La generación de links es mock. No hay tracking real de cuándo alguien hace clic en un link de referido y se convierte.

**Propuesta de solución** (alto nivel + impacto):
- Sistema de tracking de URLs con parámetros únicos
- Webhooks o eventos cuando alguien hace clic en link
- Tracking automático cuando un lead/cliente menciona código de referido
- Asociación automática de conversión con partner
- Dashboard de analytics de links (clicks, conversiones, tasa)
- **Impacto**: Alto - Sin esto, el programa de partnerships no funciona realmente.

**Páginas/flujo afectados**:
- `PartnersDashboardContainer` (analytics reales)
- Nuevo componente `ReferralLinkAnalytics`
- Sistema de tracking de URLs
- Nuevo servicio `ReferralTrackingService`

**Complejidad estimada**: Media/Alta (requiere tracking de URLs, eventos, asociación automática)

### 2. **Sistema de Comisiones y Payouts Automático**
**Necesidad detectada**: No hay sistema real para calcular, aprobar y pagar comisiones a partners.

**Propuesta de solución** (alto nivel + impacto):
- Cálculo automático de comisiones cuando hay conversión
- Aprobación de comisiones (manual o automática según umbral)
- Sistema de payouts con múltiples métodos (transferencia bancaria, PayPal, etc.)
- Historial de pagos y estados (due, paid, pending)
- Notificaciones a partners cuando se genera comisión o se paga
- Reportes fiscales de comisiones pagadas
- **Impacto**: Alto - Necesario para operar programa de partnerships.

**Páginas/flujo afectados**:
- `PartnersDashboardContainer` (payouts reales)
- Nuevo componente `PayoutsManager`
- Integración con sistema de pagos
- Nuevo servicio `CommissionService`

**Complejidad estimada**: Alta (requiere cálculo automático, aprobaciones, integración con pagos, reportes)

### 3. **Integración Real con APIs de Servicios Externos**
**Necesidad detectada**: Las integraciones son mock. No hay conexión real con Stripe, WhatsApp, Google Calendar, etc.

**Propuesta de solución** (alto nivel + impacto):
- Backend real para manejar OAuth de cada servicio
- Sincronización automática de datos (calendarios, pagos, etc.)
- Manejo de tokens de acceso y refresh
- Webhooks para recibir actualizaciones de servicios externos
- Manejo de errores y reconexión automática
- **Impacto**: Alto - Sin esto, las integraciones no tienen valor funcional.

**Páginas/flujo afectados**:
- `IntegrationGalleryContainer` (conexión real)
- Nuevo servicio `IntegrationService` en backend
- Sistema de webhooks
- Gestión de tokens OAuth

**Complejidad estimada**: Alta (requiere integración con múltiples APIs, OAuth, webhooks, sincronización)

### 4. **Propuestas Personalizadas para Cuentas ABM**
**Necesidad detectada**: No hay forma de crear y enviar propuestas personalizadas a cuentas corporativas.

**Propuesta de solución** (alto nivel + impacto):
- Editor de propuestas con templates personalizables
- Generación de PDFs de propuestas
- Envío de propuestas por email con tracking
- Tracking de cuando se abre la propuesta (pixel tracking)
- Notificaciones cuando se ve la propuesta
- Versiones de propuestas (revisiones)
- **Impacto**: Alto - Necesario para cerrar deals B2B.

**Páginas/flujo afectados**:
- `AccountDetailPanel` (añadir propuestas)
- Nuevo componente `ProposalBuilder`
- Nuevo componente `ProposalTracker`
- Sistema de generación de PDFs
- Tracking de emails

**Complejidad estimada**: Alta (requiere editor, generación de PDFs, tracking, templates)

### 5. **Automatización de Secuencias de Nurturing para ABM**
**Necesidad detectada**: No hay automatización de seguimiento con cuentas objetivo (emails, llamadas programadas, etc.).

**Propuesta de solución** (alto nivel + impacto):
- Secuencias de nurturing configurables por etapa del pipeline
- Emails automáticos basados en triggers (días sin contacto, etapa cambiada, etc.)
- Recordatorios de llamadas y reuniones
- Templates de emails personalizables
- Pausa/reanudación de secuencias
- Analytics de engagement con secuencias
- **Impacto**: Medio/Alto - Permite escalar seguimiento con múltiples cuentas.

**Páginas/flujo afectados**:
- `AccountDetailPanel` (secuencias activas)
- Nuevo componente `NurturingSequenceBuilder`
- Integración con módulo de email
- Nuevo servicio `NurturingService`

**Complejidad estimada**: Media/Alta (requiere secuencias, triggers, templates, analytics)

### 6. **Análisis de Engagement con Cuentas y Predicción de Conversión**
**Necesidad detectada**: No hay análisis de qué cuentas tienen más probabilidad de convertir o qué acciones aumentan engagement.

**Propuesta de solución** (alto nivel + impacto):
- Scoring de cuentas basado en engagement (emails abiertos, propuestas vistas, reuniones, etc.)
- Predicción de probabilidad de conversión con ML
- Recomendaciones de acciones (qué cuenta priorizar, qué tipo de contacto hacer)
- Análisis de patrones de cuentas que convierten vs. no convierten
- Alertas cuando una cuenta tiene alto engagement
- **Impacto**: Medio/Alto - Permite optimizar esfuerzos y aumentar conversión.

**Páginas/flujo afectados**:
- `AccountBasedMarketingAbmPage` (añadir scoring)
- Nuevo componente `AccountScoringPanel`
- Nuevo servicio `PredictiveAnalyticsService`
- Integración con ML model

**Complejidad estimada**: Alta (requiere ML model, análisis de datos, scoring)

### 7. **Integración con CRM Externos (Salesforce, HubSpot)**
**Necesidad detectada**: No hay forma de sincronizar datos de ABM con CRMs externos que ya se usan.

**Propuesta de solución** (alto nivel + impacto):
- Integración con APIs de Salesforce, HubSpot, Pipedrive
- Sincronización bidireccional de cuentas, contactos, deals
- Mapeo de campos personalizable
- Resolución de conflictos cuando hay cambios en ambos lados
- Sincronización automática o manual
- **Impacto**: Medio - Permite usar datos existentes y evitar duplicación.

**Páginas/flujo afectados**:
- `IntegrationGalleryContainer` (añadir CRMs)
- Nuevo servicio `CRMIntegrationService`
- Sistema de sincronización bidireccional
- Configuración de mapeo de campos

**Complejidad estimada**: Alta (requiere integración con múltiples CRMs, sincronización bidireccional, resolución de conflictos)

### 8. **Gestion de Contratos y Acuerdos con Partners**
**Necesidad detectada**: No hay forma de gestionar contratos legales con partners (firmas, términos, renovaciones).

**Propuesta de solución** (alto nivel + impacto):
- Almacenamiento de contratos digitales
- Firma electrónica de contratos
- Recordatorios de renovación de contratos
- Versiones de contratos
- Plantillas de contratos por tipo de partner
- Notificaciones cuando contrato está por vencer
- **Impacto**: Medio - Necesario para operar partnerships de forma legal.

**Páginas/flujo afectados**:
- `PartnersList` (añadir contratos)
- Nuevo componente `ContractManager`
- Integración con sistema de firmas electrónicas
- Nuevo servicio `ContractService`

**Complejidad estimada**: Media/Alta (requiere almacenamiento, firmas electrónicas, plantillas, notificaciones)

### 9. **Marketplace de Integraciones con Ratings y Reviews**
**Necesidad detectada**: No hay forma de descubrir nuevas integraciones o ver qué integraciones son más populares/useful.

**Propuesta de solución** (alto nivel + impacto):
- Catálogo ampliado de integraciones con descripciones detalladas
- Ratings y reviews de usuarios
- Categorías y tags para buscar integraciones
- Filtros: más populares, mejor valoradas, recientes
- Preview de funcionalidades antes de conectar
- Recomendaciones basadas en uso de otras integraciones
- **Impacto**: Bajo/Medio - Mejora descubrimiento y adopción de integraciones.

**Páginas/flujo afectados**:
- `IntegrationGalleryContainer` (añadir marketplace)
- Nuevo componente `IntegrationMarketplace`
- Sistema de ratings y reviews
- Nuevo servicio `MarketplaceService`

**Complejidad estimada**: Media (requiere catálogo, ratings, búsqueda, recomendaciones)

### 10. **Reportes y Analytics Avanzados de Partnerships y ABM**
**Necesidad detectada**: No hay forma de exportar datos o generar reportes personalizados de partnerships y ABM.

**Propuesta de solución** (alto nivel + impacto):
- Exportación a Excel/CSV de datos de partners, deals, cuentas
- Reportes PDF personalizados (comisiones por partner, pipeline por período, ROI de ABM)
- Reportes programados (resumen mensual por email)
- Templates de reportes predefinidos
- Dashboards compartibles (links públicos o privados)
- **Impacto**: Medio - Necesario para análisis avanzado y reportes gerenciales.

**Páginas/flujo afectados**:
- Todas las páginas (añadir botones de exportar)
- Nuevo componente `ReportGenerator`
- Nuevo servicio `ExportService`
- Sistema de reportes programados

**Complejidad estimada**: Baja/Media (requiere generación de archivos, templates, programación)

---

## 4) Hallazgos desde navegación/menús

### Sidebar.tsx

**Estructura de la sección**:
```typescript
{
  id: 'integraciones-partnerships',
  title: 'Integraciones & Partnerships',
  icon: Network,
  items: [
    { id: 'partnerships-influencers', label: 'Partnerships & Influencers', icon: Handshake, path: '/dashboard/partnerships' },
    { id: 'account-based-marketing', label: 'Account-Based Marketing (ABM)', icon: Building2, path: '/abm' },
  ],
}
```

**Sección relacionada (separada)**:
```typescript
{
  id: 'integraciones',
  title: 'Integraciones & Automatización',
  icon: Plug,
  items: [
    { id: 'integraciones-y-automatizacion', label: 'Integraciones', icon: Plug, path: '/settings/integrations' },
  ],
}
```

**Permisos y visibilidad**:
- Todos los items son visibles para ambos roles (entrenador y gimnasio)
- No hay restricciones `entrenadorOnly` o `gimnasioOnly`
- No hay badges o contadores de notificaciones

**Inconsistencias de UX o naming**:
1. **Separación confusa**:
   - "Integraciones & Partnerships" tiene Partnerships y ABM
   - "Integraciones & Automatización" tiene Integraciones
   - Separación no es clara - ¿por qué no están juntas todas las integraciones?

2. **Naming inconsistente**:
   - "Partnerships & Influencers" (inglés)
   - "Account-Based Marketing (ABM)" (inglés + acrónimo)
   - "Integraciones" (español)
   - Mezcla de idiomas

3. **Rutas inconsistentes**:
   - `/dashboard/partnerships` (dashboard/)
   - `/abm` (sin dashboard/)
   - `/settings/integrations` (settings/)
   - Mezcla de estructura de rutas

4. **Falta de funcionalidad real en ABM**:
   - Tab "Cuentas" solo muestra estado vacío
   - Tab "Analíticas" solo muestra estado vacío
   - Solo tab "Pipeline" está implementado
   - Usuarios pueden confundirse al ver tabs sin funcionalidad

5. **Duplicación potencial**:
   - ABM podría estar relacionado con "CRM & Clientes" (gestión de cuentas)
   - Partnerships podría estar relacionado con "Referidos & Afiliados"
   - No hay conexión clara entre módulos

6. **Falta de indicadores visuales**:
   - No hay badges de integraciones con errores que requieren atención
   - No hay indicadores de partners con comisiones pendientes
   - No hay alertas de deals que requieren seguimiento

7. **Tipos de datos inconsistentes**:
   - Algunos módulos usan datos mock, otros tienen estructura más completa
   - No hay consistencia en cómo se manejan los datos

**Sugerencias de mejora**:
- Unificar "Integraciones & Partnerships" con "Integraciones & Automatización" en una sola sección
- Estandarizar nombres en español o inglés
- Unificar estructura de rutas (`/dashboard/integrations/` o `/integrations/`)
- Implementar funcionalidad real en tabs de ABM o ocultarlos
- Añadir badges de notificaciones para errores de integración, comisiones pendientes
- Clarificar propósito de cada módulo y su relación con otras secciones

---

## 5) KPIs y métricas recomendadas

### Métricas de adopción
- **Tasa de adopción de partnerships**: % de usuarios que tienen al menos un partner activo
  - Meta: >40% para gimnasios, >30% para entrenadores
- **Tasa de adopción de ABM**: % de usuarios que usan ABM al menos una vez al mes
  - Meta: >20% para gimnasios, >10% para entrenadores
- **Tasa de adopción de integraciones**: % de usuarios que tienen al menos una integración conectada
  - Meta: >60% para todos los usuarios
- **Frecuencia de uso**: Número promedio de sesiones por usuario por semana
  - Meta: >2 sesiones/semana para usuarios activos de partnerships, >1 sesión/semana para ABM

### Tiempo de tarea
- **Tiempo para añadir un partner**: Desde abrir modal hasta completar
  - Meta: <3 minutos
- **Tiempo para generar link de referido**: Desde hacer clic hasta copiar link
  - Meta: <30 segundos
- **Tiempo para mover deal en pipeline**: Desde drag hasta actualización
  - Meta: <2 segundos
- **Tiempo para conectar integración**: Desde hacer clic en "Conectar" hasta completar OAuth
  - Meta: <2 minutos (incluyendo OAuth)

### Conversión interna
- **Tasa de conversión de referidos**: % de referidos que se convierten en clientes
  - Meta: >25%
- **Tasa de conversión de deals ABM**: % de deals que se ganan
  - Meta: >30%
- **Tasa de uso de integraciones**: % de integraciones conectadas que se usan activamente
  - Meta: >80%
- **Tasa de retención de partners**: % de partners que siguen activos después de 6 meses
  - Meta: >70%

### Errores por flujo
- **Errores en conexión de integraciones**: % de intentos de conexión que fallan
  - Meta: <5%
- **Errores en sincronización de integraciones**: % de sincronizaciones que fallan
  - Meta: <2%
- **Errores en drag & drop de deals**: % de movimientos de deals que fallan
  - Meta: <1%
- **Errores en generación de links**: % de generaciones de links que fallan
  - Meta: <1%

### Latencia clave
- **Tiempo de carga de partners**: Desde abrir página hasta mostrar partners
  - Meta: <1 segundo
- **Tiempo de carga de pipeline**: Desde abrir página hasta mostrar pipeline
  - Meta: <1.5 segundos
- **Tiempo de sincronización de integraciones**: Desde trigger hasta actualización
  - Meta: <30 segundos (tiempo real)
- **Tiempo de actualización de deal**: Desde drag & drop hasta actualización
  - Meta: <1 segundo

---

## 6) Backlog priorizado (RICE/MoSCoW)

### MUST (top 3)

#### 1. Tracking Real de Referidos y Conversiones desde Links
- **RICE Score**:
  - Reach: 100% usuarios que usan partnerships
  - Impact: 10/10 (sin esto, partnerships no funciona)
  - Confidence: 9/10 (tecnología conocida)
  - Effort: 6/10 (requiere tracking, eventos, asociación)
  - **Score: 15.0**
- **Justificación**: Es la funcionalidad core. Sin tracking real, el programa de partnerships no tiene valor.
- **Esfuerzo estimado**: 5-6 semanas (1-2 desarrolladores)

#### 2. Integración Real con APIs de Servicios Externos
- **RICE Score**:
  - Reach: 100% usuarios que usan integraciones
  - Impact: 10/10 (sin esto, integraciones no funcionan)
  - Confidence: 8/10 (requiere integración con múltiples APIs)
  - Effort: 10/10 (muy complejo, múltiples integraciones)
  - **Score: 8.0**
- **Justificación**: Sin integración real, las integraciones no tienen valor funcional.
- **Esfuerzo estimado**: 10-12 semanas (2-3 desarrolladores full-time)

#### 3. Sistema de Comisiones y Payouts Automático
- **RICE Score**:
  - Reach: 100% usuarios que usan partnerships
  - Impact: 10/10 (necesario para operar partnerships)
  - Confidence: 8/10
  - Effort: 8/10 (complejo, requiere cálculo, aprobaciones, pagos)
  - **Score: 10.0**
- **Justificación**: Sin sistema de comisiones, no se puede operar partnerships de forma real.
- **Esfuerzo estimado**: 8-10 semanas (2 desarrolladores)

### SHOULD (top 3)

#### 4. Propuestas Personalizadas para Cuentas ABM
- **RICE Score**:
  - Reach: 100% usuarios que usan ABM
  - Impact: 9/10 (necesario para cerrar deals)
  - Confidence: 8/10
  - Effort: 7/10 (requiere editor, PDFs, tracking)
  - **Score: 10.3**
- **Esfuerzo estimado**: 6-7 semanas

#### 5. Automatización de Secuencias de Nurturing para ABM
- **RICE Score**:
  - Reach: 100% usuarios que usan ABM
  - Impact: 8/10 (permite escalar seguimiento)
  - Confidence: 8/10
  - Effort: 7/10 (requiere secuencias, triggers, templates)
  - **Score: 9.1**
- **Esfuerzo estimado**: 6-7 semanas

#### 6. Análisis de Engagement con Cuentas
- **RICE Score**:
  - Reach: 100% usuarios que usan ABM
  - Impact: 8/10 (permite optimizar esfuerzos)
  - Confidence: 7/10 (requiere ML)
  - Effort: 8/10 (complejo)
  - **Score: 7.0**
- **Esfuerzo estimado**: 8-10 semanas

### COULD (top 3)

#### 7. Integración con CRM Externos
- **RICE Score**:
  - Reach: 60% usuarios (solo quienes usan CRMs externos)
  - Impact: 8/10 (permite usar datos existentes)
  - Confidence: 7/10
  - Effort: 9/10 (muy complejo, múltiples CRMs)
  - **Score: 3.7**
- **Esfuerzo estimado**: 10-12 semanas

#### 8. Gestión de Contratos y Acuerdos
- **RICE Score**:
  - Reach: 100% usuarios que usan partnerships
  - Impact: 7/10 (necesario para operar legalmente)
  - Confidence: 8/10
  - Effort: 6/10 (requiere almacenamiento, firmas)
  - **Score: 9.3**
- **Esfuerzo estimado**: 5-6 semanas

#### 9. Reportes y Analytics Avanzados
- **RICE Score**:
  - Reach: 80% usuarios (solo quienes necesitan reportes)
  - Impact: 7/10 (útil para análisis avanzado)
  - Confidence: 9/10
  - Effort: 5/10
  - **Score: 11.2**
- **Esfuerzo estimado**: 3-4 semanas

---

## 7) Próximos pasos

### 3 acciones accionables para la próxima iteración

#### 1. **Implementar Tracking Real de Referidos y Conversiones (5 semanas)**
- **Acciones específicas**:
  - Crear sistema de tracking de URLs con parámetros únicos (`?ref=partner_id`)
  - Endpoint para registrar clicks en links de referido
  - Asociación automática cuando un lead/cliente menciona código de referido
  - Dashboard de analytics de links (clicks, conversiones, tasa de conversión)
  - Webhooks o eventos para notificar cuando hay conversión
  - Actualización automática de stats de partners cuando hay conversión
- **Responsables**: Backend developer (1) + Frontend developer (0.5)
- **Entregables**:
  - Sistema de tracking funcional
  - Dashboard de analytics de links
  - Asociación automática de conversiones

#### 2. **Implementar Integración Básica con Stripe y Google Calendar (6 semanas)**
- **Acciones específicas**:
  - Backend para manejar OAuth de Stripe y Google Calendar
  - Sincronización de eventos de calendario (sesiones/clases)
  - Sincronización de pagos desde Stripe
  - Manejo de tokens de acceso y refresh
  - Webhooks para recibir actualizaciones (nuevos pagos, cambios en calendario)
  - UI para configurar conexión (botones de conectar, estados)
  - Manejo de errores y reconexión automática
- **Responsables**: Backend developer (1) + Frontend developer (1)
- **Entregables**:
  - Integración con Stripe funcional
  - Integración con Google Calendar funcional
  - Sincronización automática de datos

#### 3. **Implementar Sistema Básico de Comisiones y Payouts (6 semanas)**
- **Acciones específicas**:
  - Cálculo automático de comisiones cuando hay conversión
  - Estados de comisiones: pending, approved, paid
  - Aprobación manual de comisiones (con umbral configurable)
  - Sistema de payouts con estados: due, processing, paid
  - Historial de comisiones y payouts
  - Dashboard de comisiones pendientes y pagadas
  - Notificaciones a partners cuando se genera comisión
- **Responsables**: Backend developer (1) + Frontend developer (1)
- **Entregables**:
  - Sistema de comisiones funcional
  - Dashboard de payouts
  - Notificaciones a partners

### Riesgos y supuestos

**Riesgos identificados**:
1. **Tracking de referidos puede ser manipulado si no hay validación**:
   - Mitigación: Validación de conversiones, códigos únicos, límites de tiempo
   - Impacto: Alto - afecta confianza en programa de partnerships

2. **Integraciones pueden fallar si hay cambios en APIs externas**:
   - Mitigación: Versionado de APIs, manejo robusto de errores, notificaciones de cambios
   - Impacto: Alto - afecta todas las integraciones

3. **Cálculo de comisiones puede tener errores si hay múltiples reglas**:
   - Mitigación: Validación de reglas, testing exhaustivo, revisión manual opcional
   - Impacto: Medio - afecta confianza en sistema de comisiones

4. **Sincronización bidireccional puede causar conflictos**:
   - Mitigación: Resolución de conflictos clara, sincronización unidireccional por defecto, merge manual
   - Impacto: Medio - afecta integraciones con CRMs

**Supuestos**:
- Hay sistema de eventos para tracking de acciones (referral_clicked, referral_converted)
- Hay sistema de pagos para procesar payouts (Stripe, PayPal, transferencias bancarias)
- Hay sistema de notificaciones para alertar a partners
- Hay base de datos para persistir partners, deals, cuentas, integraciones, comisiones
- Hay acceso a APIs de servicios externos (Stripe, Google Calendar, WhatsApp, etc.) con permisos apropiados
- Hay sistema de firmas electrónicas para contratos (opcional)

**Dependencias externas**:
- APIs de Stripe, PayPal, Google Calendar, Outlook, WhatsApp Business, Mailchimp, Apple Health, Google Fit
- APIs de Salesforce, HubSpot, Pipedrive (para integración con CRMs)
- Sistema de eventos para tracking
- Sistema de notificaciones para alertas
- Sistema de pagos para payouts
- Base de datos para persistencia
- Servicios de ML para análisis predictivo (opcional)
- Servicio de firmas electrónicas (opcional)

---

> **Notas técnicas**: 
> - Todas las rutas son relativas desde la raíz del proyecto
> - Los componentes están en `src/features/[feature-name]/`
> - Las APIs están en `src/features/[feature-name]/api/`
> - Los tipos TypeScript están en `src/features/[feature-name]/types/`















