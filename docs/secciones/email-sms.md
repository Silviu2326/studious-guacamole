# Email & SMS — Diagnóstico funcional y de producto

## 1) Mapa de páginas de la sección

### Páginas principales

#### `/dashboard/marketing/email-campaigns` — Email Marketing & Newsletters
- **Componente raíz**: `src/features/EmailMarketingYNewsletters/pages/EmailMarketingYNewslettersPage.tsx`
- **Componentes hijos**:
  - `CampaignList` (`src/features/EmailMarketingYNewsletters/components/CampaignList.tsx`)
  - `CampaignBuilderContainer` (`src/features/EmailMarketingYNewsletters/components/CampaignBuilderContainer.tsx`)
  - `CampaignAnalyticsDashboard` (`src/features/EmailMarketingYNewsletters/components/CampaignAnalyticsDashboard.tsx`)
  - `SegmentSelector` (`src/features/EmailMarketingYNewsletters/components/SegmentSelector.tsx`)
- **API**: `src/features/EmailMarketingYNewsletters/api/campaigns.ts`
- **Estados**:
  - Loading: `isLoading` con `Loader2` spinner
  - Error: no hay manejo explícito de errores (solo `console.error`)
  - Vacío: no hay estado vacío explícito en `CampaignList`
- **Guardias**: No hay guardias de autenticación explícitas (depende de Layout)
- **View modes**: `list` | `builder` | `analytics` (controlado por `viewMode` state)

#### `/dashboard/email/compliance` — Email Deliverability & Compliance Hub
- **Componente raíz**: `src/features/EmailDeliverabilityYComplianceHub/pages/EmailDeliverabilityYComplianceHubPage.tsx`
- **Componentes hijos**:
  - `EmailHealthDashboard` (`src/features/EmailDeliverabilityYComplianceHub/components/EmailHealthDashboard.tsx`)
  - `SuppressionListTable` (`src/features/EmailDeliverabilityYComplianceHub/components/SuppressionListTable.tsx`)
  - `KpiCard` (`src/features/EmailDeliverabilityYComplianceHub/components/KpiCard.tsx`)
- **Hook**: `useEmailComplianceAPI` (`src/features/EmailDeliverabilityYComplianceHub/hooks/useEmailComplianceAPI.ts`)
- **Estados**:
  - Loading: `isLoading` con `Loader2` spinner
  - Error: no hay manejo explícito de errores
  - Vacío: no hay estado vacío explícito
- **Tabs**: `health` | `suppression` | `compliance` (controlado por `activeTab` state)
- **Guardias**: No hay guardias de autenticación explícitas

#### `/dashboard/marketing/mensajeria` — SMS/WhatsApp Marketing
- **Componente raíz**: `src/features/SmswhatsappMarketing/pages/SmswhatsappMarketingPage.tsx`
- **Componentes hijos**: Ninguno (componente plano)
- **API**: No hay API implementada (solo UI)
- **Estados**:
  - Loading: no hay estado de loading
  - Error: no hay manejo de errores
  - Vacío: estado vacío hardcodeado con `Package` icon y mensaje
- **Guardias**: No hay guardias de autenticación explícitas
- **Funcionalidad**: Página placeholder — botones muestran `onClick={() => {}}` (no implementado)

#### `/dashboard/automations/messaging` — SMS/WhatsApp Automation
- **Componente raíz**: `src/features/SmswhatsappAutomation/pages/SmswhatsappAutomationPage.tsx`
- **Componentes hijos**: Ninguno (componente plano)
- **API**: No hay API implementada (solo UI)
- **Estados**:
  - Loading: no hay estado de loading
  - Error: no hay manejo de errores
  - Vacío: estado vacío hardcodeado con `Package` icon y mensaje
- **Guardias**: No hay guardias de autenticación explícitas
- **Funcionalidad**: Página placeholder — botones muestran `onClick={() => {}}` (no implementado)

#### `/client/preferences/communication` — SMS/Email Preference Center
- **Componente raíz**: `src/features/SmsemailPreferenceCenter/pages/SmsemailPreferenceCenterPage.tsx`
- **Componentes hijos**:
  - `PreferenceCategoryRow` (`src/features/SmsemailPreferenceCenter/components/PreferenceCategoryRow.tsx`)
- **API**: `src/features/SmsemailPreferenceCenter/api/preferences.ts`
- **Estados**:
  - Loading: `isLoading` con `Loader2` spinner
  - Error: banner rojo con `AlertTriangle` y mensaje
  - Success: banner verde con `CheckCircle` y mensaje (se oculta después de 5 segundos)
  - Vacío: no hay estado vacío explícito
- **Guardias**: No hay guardias de autenticación explícitas (usa token de URL para acceso)
- **Autenticación**: Usa token de URL (`?token=xxx`) para acceso del cliente

### Relaciones padre/hijo

```
Email & SMS (Sidebar Section)
├── Email Marketing & Newsletters (/dashboard/marketing/email-campaigns)
│   ├── CampaignList (hijo)
│   ├── CampaignBuilderContainer (hijo)
│   │   └── SegmentSelector (nieto)
│   └── CampaignAnalyticsDashboard (hijo)
│   └── API: campaigns.ts
├── Email Deliverability & Compliance Hub (/dashboard/email/compliance)
│   ├── EmailHealthDashboard (hijo)
│   ├── SuppressionListTable (hijo)
│   └── Hook: useEmailComplianceAPI
├── SMS/WhatsApp Marketing (/dashboard/marketing/mensajeria)
│   └── (sin hijos — placeholder)
├── SMS/WhatsApp Automation (/dashboard/automations/messaging)
│   └── (sin hijos — placeholder)
└── SMS/Email Preference Center (/client/preferences/communication)
    └── PreferenceCategoryRow (hijo)
    └── API: preferences.ts
```

---

## 2) 10 problemas que hoy SÍ resuelve

### 1. **Creación y gestión de campañas de email con editor visual**
**Problema cubierto**: No hay forma de crear campañas de email profesionales sin usar herramientas externas como Mailchimp.

**Página(s)**: `/dashboard/marketing/email-campaigns` (`EmailMarketingYNewslettersPage.tsx`)

**Como lo resuelve el código**:
- `CampaignBuilderContainer` con wizard multi-paso: `setup` → `design` → `audience` → `schedule`
- API `createCampaign()`, `updateCampaign()`, `scheduleCampaign()` en `src/features/EmailMarketingYNewsletters/api/campaigns.ts`
- Selección de plantillas (`getEmailTemplates()`) para diseño rápido
- Editor HTML para personalización (`bodyHtml`)
- Integración con segmentos (`SegmentSelector`) para audiencias
- Programación de envío (`scheduleDate`, `scheduleTime`)

**Riesgos/limitaciones**:
- No hay preview visual del email antes de enviar (solo HTML raw)
- Editor HTML no es WYSIWYG — requiere conocimiento técnico
- No hay validación de contenido antes de guardar

---

### 2. **Listado y gestión de campañas de email con filtros**
**Problema cubierto**: No hay forma de ver todas las campañas creadas, sus estados y gestionarlas desde un lugar central.

**Página(s)**: `/dashboard/marketing/email-campaigns` (`EmailMarketingYNewslettersPage.tsx`)

**Como lo resuelve el código**:
- `CampaignList` muestra lista de campañas
- API `getCampaigns()` con filtro por estado (`statusFilter`: 'all' | 'draft' | 'scheduled' | 'sent')
- Acciones: ver, editar, eliminar, ver analytics
- Estados de campaña: draft, scheduled, sent

**Riesgos/limitaciones**:
- No hay paginación (puede ser lenta con muchas campañas)
- No hay búsqueda por nombre
- Filtro solo por estado, no por fecha, segmento, etc.

---

### 3. **Analytics de campañas de email con métricas detalladas**
**Problema cubierto**: No hay forma de medir el rendimiento de campañas de email para optimizar futuras campañas.

**Página(s)**: `/dashboard/marketing/email-campaigns` — View mode `analytics` (`CampaignAnalyticsDashboard.tsx`)

**Como lo resuelve el código**:
- Hook `useCampaignAnalytics()` que carga métricas por `campaignId`
- `CampaignAnalyticsDashboard` muestra métricas de rendimiento
- Navegación dedicada desde lista de campañas (`handleViewAnalytics`)

**Riesgos/limitaciones**:
- No se revisó implementación completa de `CampaignAnalyticsDashboard` para ver qué métricas muestra
- No hay exportación de datos
- No hay comparación entre campañas

---

### 4. **Segmentación de audiencias para campañas de email**
**Problema cubierto**: No hay forma de enviar emails a segmentos específicos de clientes sin crear listas manualmente.

**Página(s)**: `/dashboard/marketing/email-campaigns` — Step `audience` en builder (`SegmentSelector.tsx`)

**Como lo resuelve el código**:
- `SegmentSelector` permite seleccionar segmento de audiencia
- API `getSegments()` para obtener segmentos disponibles
- Integración con sistema de segmentación (`EmailSegment` interface)

**Riesgos/limitaciones**:
- No hay preview de cuántos miembros tiene el segmento antes de seleccionar
- No hay validación de que el segmento tenga miembros antes de enviar
- No se puede crear segmento desde aquí (solo seleccionar)

---

### 5. **Monitoreo de salud de email y métricas de deliverability**
**Problema cubierto**: No hay forma de monitorear si los emails llegan a la bandeja de entrada o van a spam.

**Página(s)**: `/dashboard/email/compliance` — Tab `health` (`EmailHealthDashboard.tsx`)

**Como lo resuelve el código**:
- `EmailHealthDashboard` muestra métricas de salud de email
- `KpiCard` para visualizar KPIs clave
- Integración con sistema de monitoreo de deliverability

**Riesgos/limitaciones**:
- No se revisó implementación completa para ver qué métricas específicas muestra
- No hay alertas cuando métricas caen por debajo de umbrales
- No hay recomendaciones de mejora

---

### 6. **Gestión de lista de supresión de emails**
**Problema cubierto**: No hay forma de gestionar emails que no deben recibir más comunicaciones (rebotes, spam complaints, unsubscribes).

**Página(s)**: `/dashboard/email/compliance` — Tab `suppression` (`SuppressionListTable.tsx`)

**Como lo resuelve el código**:
- `SuppressionListTable` muestra lista de emails suprimidos
- Hook `useEmailComplianceAPI` con `addSuppressedEmail()`, `removeSuppressedEmail()`
- Actualización automática cuando hay rebotes, quejas de spam o bajas

**Riesgos/limitaciones**:
- No hay importación masiva de emails suprimidos
- No hay exportación de lista
- No hay filtros por razón de supresión

---

### 7. **Preferencias de comunicación del cliente (opt-in/opt-out)**
**Problema cubierto**: No hay forma de que los clientes controlen qué tipos de mensajes reciben y por qué canal.

**Página(s)**: `/client/preferences/communication` (`SmsemailPreferenceCenterPage.tsx`)

**Como lo resuelve el código**:
- `PreferenceCategoryRow` permite toggle por categoría (marketing, recordatorios, etc.)
- Selección de canal preferido (email, SMS, WhatsApp, ambos)
- API `getClientPreferences()`, `updateClientPreferences()`, `unsubscribeAll()`
- Autenticación por token de URL (`?token=xxx`)
- Guardado con feedback visual (success/error banners)

**Riesgos/limitaciones**:
- Token de URL puede ser inseguro si se comparte
- No hay validación de expiración de token
- No hay historial de cambios de preferencias

---

### 8. **Cumplimiento básico con normativas de privacidad**
**Problema cubierto**: No hay forma de cumplir con GDPR y otras normativas de privacidad en comunicaciones.

**Página(s)**: `/dashboard/email/compliance` — Tab `compliance` (placeholder)

**Como lo resuelve el código**:
- Tab dedicada a cumplimiento GDPR
- Placeholder que indica que se implementará próximamente
- Mensaje sobre registro de consentimientos, exportación de datos, gestión de solicitudes de eliminación

**Riesgos/limitaciones**:
- Funcionalidad no implementada (solo placeholder)
- No hay registro real de consentimientos
- No hay exportación de datos para auditorías

---

### 9. **Plantillas de email para acelerar creación de campañas**
**Problema cubierto**: Crear emails desde cero requiere mucho tiempo y conocimiento de diseño.

**Página(s)**: `/dashboard/marketing/email-campaigns` — Step `design` en builder

**Como lo resuelve el código**:
- API `getEmailTemplates()` para obtener plantillas disponibles
- `selectedTemplate` state para aplicar plantilla
- Plantillas específicas para fitness según descripción

**Riesgos/limitaciones**:
- No se revisó qué plantillas están disponibles
- No hay preview de plantilla antes de aplicar
- No hay editor de plantillas (solo selección)

---

### 10. **Programación de envío de campañas de email**
**Problema cubierto**: No hay forma de programar envíos de campañas para fechas/horas específicas.

**Página(s)**: `/dashboard/marketing/email-campaigns` — Step `schedule` en builder

**Como lo resuelve el código**:
- `scheduleDate` y `scheduleTime` states para programación
- API `scheduleCampaign()` para guardar campaña programada
- Estado `scheduled` en campañas

**Riesgos/limitaciones**:
- No hay validación de que la fecha/hora sea futura
- No hay opción de timezone
- No hay programación recurrente (solo una vez)

---

## 3) 10 problemas que AÚN NO resuelve (y debería)

### 1. **Editor WYSIWYG visual de emails con drag-and-drop**
**Necesidad detectada**: El editor actual es HTML raw, requiere conocimiento técnico. No hay forma de crear emails visualmente arrastrando elementos.

**Propuesta de solución** (alto nivel + impacto):
- Editor visual tipo drag-and-drop (como Mailchimp, SendGrid)
- Bloques predefinidos: texto, imagen, botón, espaciador, etc.
- Preview en tiempo real mientras se edita
- Personalización de estilos (colores, fuentes, padding)
- **Impacto**: Alto — reduce barrera de entrada, permite crear emails profesionales sin código
- **Páginas/flujo afectados**: `/dashboard/marketing/email-campaigns` — Step `design` en `CampaignBuilderContainer`
- **Complejidad estimada**: Alta — requiere librería de editor visual (react-email, grapesjs, o similar) y sistema de bloques

---

### 2. **Preview de email antes de enviar con diferentes clientes de email**
**Necesidad detectada**: No hay forma de ver cómo se verá el email en diferentes clientes (Gmail, Outlook, Apple Mail) antes de enviar.

**Propuesta de solución** (alto nivel + impacto):
- Preview multi-cliente con tabs (Gmail, Outlook, Apple Mail, móvil)
- Renderizado real del HTML con estilos aplicados
- Indicadores de compatibilidad (warnings si hay problemas)
- **Impacto**: Medio — reduce errores de visualización, mejora calidad
- **Páginas/flujo afectados**: `/dashboard/marketing/email-campaigns` — Step `design` o modal de preview antes de enviar
- **Complejidad estimada**: Media — requiere renderizado de HTML en diferentes contextos y detección de problemas de compatibilidad

---

### 3. **A/B testing de campañas de email**
**Necesidad detectada**: No hay forma de probar diferentes variantes de asunto, contenido o diseño para ver cuál funciona mejor.

**Propuesta de solución** (alto nivel + impacto):
- Crear variantes de campaña (A/B/C)
- Asignación aleatoria de destinatarios a variantes
- Análisis de resultados con significancia estadística
- Recomendación automática de mejor variante
- **Impacto**: Alto — permite optimización continua de campañas
- **Páginas/flujo afectados**: `/dashboard/marketing/email-campaigns` — Agregar opción "Crear variante A/B" en builder
- **Complejidad estimada**: Alta — requiere sistema de asignación aleatoria, tracking de métricas por variante, análisis estadístico

---

### 4. **Automatización de SMS/WhatsApp con flujos visuales**
**Necesidad detectada**: La página de automatización es placeholder. No hay forma de crear flujos automáticos de mensajería.

**Propuesta de solución** (alto nivel + impacto):
- Editor visual de flujos tipo flowchart
- Triggers configurables (eventos: check-in, pago, cita, etc.)
- Condiciones y ramificaciones (if/else)
- Delays entre mensajes
- Personalización con variables dinámicas
- **Impacto**: Alto — permite automatización completa de comunicación
- **Páginas/flujo afectados**: `/dashboard/automations/messaging` — Reemplazar placeholder con editor completo
- **Complejidad estimada**: Alta — requiere librería de diagramas (react-flow), sistema de triggers, motor de ejecución

---

### 5. **Campañas de SMS/WhatsApp con segmentación y personalización**
**Necesidad detectada**: La página de marketing SMS/WhatsApp es placeholder. No hay forma de crear campañas reales.

**Propuesta de solución** (alto nivel + impacto):
- Constructor de campañas similar a email pero para SMS/WhatsApp
- Límite de caracteres y validación
- Variables dinámicas ({{nombre}}, {{cita}}, etc.)
- Segmentación de audiencias
- Programación de envío
- **Impacto**: Alto — habilita marketing directo por SMS/WhatsApp
- **Páginas/flujo afectados**: `/dashboard/marketing/mensajeria` — Reemplazar placeholder con constructor completo
- **Complejidad estimada**: Media — similar a constructor de email pero más simple (menos diseño)

---

### 6. **Integración con WhatsApp Business API y SMS Gateway**
**Necesidad detectada**: No hay integración real con proveedores de SMS/WhatsApp. Solo UI placeholder.

**Propuesta de solución** (alto nivel + impacto):
- Integración con WhatsApp Business API (Twilio, MessageBird, etc.)
- Integración con SMS Gateway (Twilio, AWS SNS, etc.)
- Configuración de credenciales y webhooks
- Manejo de errores y reintentos
- **Impacto**: Alto — sin esto, SMS/WhatsApp no funciona realmente
- **Páginas/flujo afectados**: Configuración de integraciones, backend de envío
- **Complejidad estimada**: Alta — requiere integración con APIs externas, manejo de webhooks, costos por mensaje

---

### 7. **Tracking de aperturas, clics y conversiones en emails**
**Necesidad detectada**: No hay forma de saber si los emails fueron abiertos, qué links se hicieron clic, o si generaron conversiones.

**Propuesta de solución** (alto nivel + impacto):
- Pixel de tracking invisible para aperturas
- Links con parámetros de tracking para clics
- Integración con analytics para conversiones
- Dashboard de engagement con heatmaps de clics
- **Impacto**: Alto — métricas esenciales para optimización
- **Páginas/flujo afectados**: `CampaignAnalyticsDashboard` — agregar métricas de apertura/clics, backend requiere tracking
- **Complejidad estimada**: Media — requiere pixel de tracking, parámetros de URLs, almacenamiento de eventos

---

### 8. **Cumplimiento GDPR completo con registro de consentimientos**
**Necesidad detectada**: El tab de compliance es placeholder. No hay registro real de consentimientos ni gestión de solicitudes.

**Propuesta de solución** (alto nivel + impacto):
- Registro de consentimientos con fecha/hora/IP
- Historial de cambios de consentimiento
- Exportación de datos para auditorías
- Gestión de solicitudes de eliminación (right to be forgotten)
- Certificados de consentimiento exportables
- **Impacto**: Alto — cumplimiento legal requerido en UE
- **Páginas/flujo afectados**: `/dashboard/email/compliance` — Tab `compliance`, backend requiere almacenamiento de consentimientos
- **Complejidad estimada**: Media — requiere schema de consentimientos, sistema de exportación, interfaz de gestión

---

### 9. **Alertas y notificaciones de problemas de deliverability**
**Necesidad detectada**: No hay alertas cuando métricas de deliverability caen (alta tasa de rebote, spam complaints, etc.).

**Propuesta de solución** (alto nivel + impacto):
- Configuración de umbrales (ej: "alertar si tasa de rebote >5%")
- Notificaciones por email/in-app cuando se alcanza umbral
- Recomendaciones de acción (ej: "limpiar lista de emails inválidos")
- Dashboard de alertas activas
- **Impacto**: Medio — permite detectar problemas temprano y tomar acción
- **Páginas/flujo afectados**: `/dashboard/email/compliance` — Tab `health`, agregar sección de alertas
- **Complejidad estimada**: Media — requiere sistema de monitoreo continuo, configuración de umbrales, sistema de notificaciones

---

### 10. **Plantillas de email responsive y optimizadas para móvil**
**Necesidad detectada**: No hay garantía de que las plantillas se vean bien en móvil. No hay preview móvil.

**Propuesta de solución** (alto nivel + impacto):
- Plantillas responsive por defecto (media queries)
- Preview móvil en editor
- Validación de compatibilidad móvil antes de enviar
- Biblioteca de plantillas optimizadas para móvil
- **Impacto**: Alto — mayoría de emails se leen en móvil (>50%)
- **Páginas/flujo afectados**: `/dashboard/marketing/email-campaigns` — Step `design`, sistema de plantillas
- **Complejidad estimada**: Media — requiere plantillas responsive, preview móvil, validación de estilos

---

## 4) Hallazgos desde navegación/menús

### `@Sidebar.tsx` — Análisis de la sección

**Ubicación en Sidebar** (líneas 359-370):
```typescript
{
  id: 'email-sms',
  title: 'Email & SMS',
  icon: Mail,
  items: [
    { id: 'email-marketing-newsletters', label: 'Email Marketing & Newsletters', icon: Mail, path: '/dashboard/marketing/email-campaigns' },
    { id: 'email-deliverability-compliance-hub', label: 'Email Deliverability & Compliance Hub', icon: ShieldCheck, path: '/dashboard/email/compliance' },
    { id: 'sms-whatsapp-marketing', label: 'SMS/WhatsApp Marketing', icon: MessageSquare, path: '/dashboard/marketing/mensajeria' },
    { id: 'sms-whatsapp-automation', label: 'SMS/WhatsApp Automation', icon: MessageSquare, path: '/dashboard/automations/messaging' },
    { id: 'smsemail-preference-center', label: 'SMS/Email Preference Center', icon: Settings, path: '/client/preferences/communication' },
  ],
}
```

**Permisos y visibilidad**:
- No tiene `entrenadorOnly` ni `gimnasioOnly` — visible para ambos roles
- Sin badges o indicadores de estado
- Sin contadores de campañas activas o mensajes pendientes

**Mapeo de rutas** (líneas 120-122, 136, 143 en `Sidebar.tsx`):
- `path.includes('dashboard/marketing/email-campaigns')` → `email-marketing-newsletters`
- `path.includes('dashboard/email/compliance')` → `email-deliverability-compliance-hub`
- `path.includes('dashboard/marketing/mensajeria')` → `sms-whatsapp-marketing`
- `path.includes('dashboard/automations/messaging')` → `sms-whatsapp-automation`
- `path.includes('client/preferences/communication')` → `smsemail-preference-center`

**Inconsistencias de UX o naming**:
1. **Naming inconsistente**: "Email Marketing & Newsletters" vs "Email Deliverability & Compliance Hub" — diferentes niveles de detalle. Debería ser consistente.
2. **Rutas no intuitivas**: `/dashboard/marketing/mensajeria` (español) vs `/dashboard/marketing/email-campaigns` (inglés). Debería ser consistente el idioma.
3. **Falta de conexión visual**: No hay indicadores de que "Email Deliverability" está relacionado con "Email Marketing" aunque son complementarios.
4. **Placeholder pages**: "SMS/WhatsApp Marketing" y "SMS/WhatsApp Automation" son placeholders pero no hay indicador visual de que están en desarrollo.
5. **Preference Center fuera de contexto**: `/client/preferences/communication` está en ruta de cliente, no en dashboard. Esto es correcto pero puede confundir si no está claro que es para clientes.
6. **Sin badges de estado**: No hay indicadores de cuántas campañas activas hay, mensajes pendientes, o problemas de deliverability sin entrar a cada página.
7. **Iconos duplicados**: Tanto "SMS/WhatsApp Marketing" como "SMS/WhatsApp Automation" usan `MessageSquare` — deberían ser diferentes para distinguir.

---

## 5) KPIs y métricas recomendadas

### Métricas de adopción
- **% de usuarios que crean al menos 1 campaña de email en primeros 30 días**: Target 30%
- **% de usuarios que crean al menos 1 automatización SMS/WhatsApp en primeros 30 días**: Target 20%
- **Promedio de campañas creadas por usuario activo**: Target 2-3
- **Promedio de automatizaciones activas por usuario**: Target 1-2

### Tiempo de tarea
- **Tiempo promedio para crear una campaña de email básica**: Target <10 minutos
- **Tiempo promedio para crear una automatización SMS básica**: Target <5 minutos
- **Tiempo de carga de lista de campañas**: Target <2 segundos
- **Tiempo de preview de email**: Target <1 segundo

### Conversión interna
- **% de campañas creadas que se envían (no quedan en draft)**: Target 70%
- **% de automatizaciones activadas que envían al menos 1 mensaje**: Target 90%
- **Tasa de abandono en creación de campaña**: Target <40%
- **% de usuarios que usan segmentación en campañas**: Target 50%

### Errores por flujo
- **Errores al crear campaña (validación, API)**: Target <5% de intentos
- **Errores al enviar campaña**: Target <2% de intentos
- **Errores de deliverability (rebotes, spam)**: Target <3% de emails enviados
- **Errores al guardar preferencias de cliente**: Target <1% de intentos

### Latencia clave
- **Tiempo de envío de email (desde programado hasta entregado)**: Target <5 minutos
- **Tiempo de envío de SMS/WhatsApp**: Target <30 segundos
- **Tiempo de actualización de métricas de analytics**: Target <1 minuto
- **Tiempo de carga de lista de supresión**: Target <2 segundos

---

## 6) Backlog priorizado (RICE/MoSCoW)

### MUST (top 3)

1. **Implementar funcionalidad completa de SMS/WhatsApp Marketing y Automation**
   - **Reach**: 100% (todos los usuarios)
   - **Impact**: Alto (páginas actuales son placeholders, funcionalidad core no existe)
   - **Confidence**: 100%
   - **RICE**: ∞ (prioridad absoluta)
   - **Justificación**: Sin esto, 2 de las 5 páginas de la sección no funcionan. Es funcionalidad core prometida.

2. **Integrar WhatsApp Business API y SMS Gateway**
   - **Reach**: 100% (todos los usuarios que usan SMS/WhatsApp)
   - **Impact**: Alto (sin esto, SMS/WhatsApp no funciona realmente)
   - **Confidence**: 80%
   - **RICE**: 80
   - **Justificación**: Crítico para que SMS/WhatsApp funcione. Sin integración, solo es UI sin funcionalidad.

3. **Editor WYSIWYG visual de emails con drag-and-drop**
   - **Reach**: 80% (usuarios que crean campañas de email)
   - **Impact**: Alto (reduce barrera de entrada, mejora UX drásticamente)
   - **Confidence**: 70%
   - **RICE**: 56
   - **Justificación**: Editor HTML actual requiere conocimiento técnico. Editor visual es estándar de industria.

### SHOULD (top 3)

4. **A/B testing de campañas de email**
   - **Reach**: 60% (usuarios avanzados que quieren optimizar)
   - **Impact**: Alto (permite optimización continua)
   - **Confidence**: 60%
   - **RICE**: 36
   - **Justificación**: Funcionalidad avanzada que diferencia el producto y permite optimización.

5. **Tracking de aperturas, clics y conversiones en emails**
   - **Reach**: 100% (todos los usuarios que envían emails)
   - **Impact**: Alto (métricas esenciales para optimización)
   - **Confidence**: 80%
   - **RICE**: 80
   - **Justificación**: Sin métricas de engagement, no se puede optimizar. Es funcionalidad básica esperada.

6. **Cumplimiento GDPR completo con registro de consentimientos**
   - **Reach**: 100% (requisito legal en UE)
   - **Impact**: Alto (cumplimiento legal requerido)
   - **Confidence**: 90%
   - **RICE**: 90
   - **Justificación**: Requisito legal. Actualmente solo hay placeholder.

### COULD (top 3)

7. **Preview de email con diferentes clientes de email**
   - **Reach**: 80% (usuarios que crean campañas)
   - **Impact**: Medio (reduce errores de visualización)
   - **Confidence**: 70%
   - **RICE**: 56
   - **Justificación**: Mejora calidad pero no es crítico.

8. **Alertas de problemas de deliverability**
   - **Reach**: 100% (todos los usuarios)
   - **Impact**: Medio (detección temprana de problemas)
   - **Confidence**: 80%
   - **RICE**: 80
   - **Justificación**: Útil pero no crítico. Puede ser manual al principio.

9. **Plantillas responsive optimizadas para móvil**
   - **Reach**: 100% (todos los usuarios que crean emails)
   - **Impact**: Alto (mayoría de emails se leen en móvil)
   - **Confidence**: 90%
   - **RICE**: 90
   - **Justificación**: Importante pero puede mejorarse gradualmente después de funcionalidad core.

---

## 7) Próximos pasos

### 3 acciones accionables para la próxima iteración

1. **Implementar constructor de campañas SMS/WhatsApp funcional**
   - **Acción**: Reemplazar placeholder de `/dashboard/marketing/mensajeria` con constructor real similar a email pero simplificado
   - **Archivos a modificar**:
     - `src/features/SmswhatsappMarketing/pages/SmswhatsappMarketingPage.tsx` — agregar estados y lógica
     - Crear `src/features/SmswhatsappMarketing/components/CampaignBuilder.tsx` — constructor de campañas
     - Crear `src/features/SmswhatsappMarketing/api/campaigns.ts` — API de campañas SMS/WhatsApp
     - Crear `src/features/SmswhatsappMarketing/components/CampaignList.tsx` — lista de campañas
   - **Riesgos**: Validación de límites de caracteres (SMS 160, WhatsApp variable), costos por mensaje, integración con proveedores
   - **Supuestos**: Backend puede manejar envío de SMS/WhatsApp, hay integración con proveedor configurada

2. **Implementar editor visual de automatizaciones SMS/WhatsApp**
   - **Acción**: Reemplazar placeholder de `/dashboard/automations/messaging` con editor de flujos visual
   - **Archivos a modificar**:
     - `src/features/SmswhatsappAutomation/pages/SmswhatsappAutomationPage.tsx` — agregar estados y lógica
     - Crear `src/features/SmswhatsappAutomation/components/FlowBuilder.tsx` — editor visual de flujos (react-flow)
     - Crear `src/features/SmswhatsappAutomation/api/automations.ts` — API de automatizaciones
     - Crear `src/features/SmswhatsappAutomation/components/TriggerSelector.tsx` — selector de triggers
   - **Riesgos**: Complejidad de editor visual, validación de flujos, ejecución de automatizaciones en tiempo real
   - **Supuestos**: Backend tiene sistema de eventos para triggers, motor de ejecución de automatizaciones

3. **Agregar tracking de aperturas y clics en emails**
   - **Acción**: Implementar pixel de tracking y parámetros de URLs para métricas de engagement
   - **Archivos a modificar**:
     - `src/features/EmailMarketingYNewsletters/components/CampaignAnalyticsDashboard.tsx` — agregar métricas de apertura/clics
     - `src/features/EmailMarketingYNewsletters/api/campaigns.ts` — agregar endpoints de tracking
     - Backend requiere pixel de tracking y almacenamiento de eventos
   - **Riesgos**: Privacidad (pixel de tracking puede ser bloqueado), almacenamiento de muchos eventos, performance
   - **Supuestos**: Backend puede procesar eventos de tracking en tiempo real, hay sistema de almacenamiento de eventos

### Riesgos y supuestos

**Riesgos principales**:
1. **Costos de SMS/WhatsApp**: Cada mensaje tiene costo. Necesita sistema de límites y alertas de costos.
2. **Límites de rate limiting**: Proveedores tienen límites de envío. Necesita manejo de colas y reintentos.
3. **Privacidad y GDPR**: Tracking de emails puede ser bloqueado por navegadores. Necesita alternativas y cumplimiento.
4. **Deliverability de email**: Emails pueden ir a spam. Necesita monitoreo continuo y mejoras.

**Supuestos**:
1. Backend tiene capacidad de procesar envíos masivos de email/SMS sin problemas de performance
2. Hay integración con proveedores de SMS/WhatsApp configurada (Twilio, MessageBird, etc.)
3. Sistema de eventos puede manejar triggers de automatizaciones en tiempo real
4. Base de datos puede almacenar grandes volúmenes de eventos de tracking sin problemas

---

> **Notas técnicas**: 
> - Archivos clave: `src/components/Sidebar.tsx` (líneas 359-370), `src/features/EmailMarketingYNewsletters/`, `src/features/EmailDeliverabilityYComplianceHub/`, `src/features/SmswhatsappMarketing/`, `src/features/SmswhatsappAutomation/`, `src/features/SmsemailPreferenceCenter/`
> - Integraciones: WhatsApp Business API, SMS Gateway (Twilio, AWS SNS), Email service (SendGrid, Mailgun), sistema de eventos
> - Dependencias: Editor visual (react-flow para automatizaciones, react-email o grapesjs para emails), sistema de tracking, sistema de colas para envíos

















