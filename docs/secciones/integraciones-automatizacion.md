# Integraciones & Automatización — Diagnóstico funcional y de producto

## 1) Mapa de páginas de la sección

### Páginas principales

#### `/settings/integrations` — Integraciones
- **Componente raíz**: `src/features/integraciones-y-automatizacion/pages/integraciones-y-automatizacionPage.tsx`
- **Componentes hijos**:
  - `IntegrationGalleryContainer` (`src/features/integraciones-y-automatizacion/components/IntegrationGalleryContainer.tsx`) - Container principal con galería de integraciones
  - `IntegrationCard` (`src/features/integraciones-y-automatizacion/components/IntegrationCard.tsx`) - Tarjeta individual de integración
  - `IntegrationSettingsModal` (`src/features/integraciones-y-automatizacion/components/IntegrationSettingsModal.tsx`) - Modal de configuración de integración
- **API**: `src/features/integraciones-y-automatizacion/api/index.ts` (integrationService)
- **Datos mock**: `src/features/integraciones-y-automatizacion/data/mockIntegrations.ts`
- **Estados**:
  - Loading: `Loader2` spinner con mensaje "Cargando integraciones..."
  - Error: Card con `AlertCircle` y botón "Reintentar"
  - Vacío: No hay estado vacío explícito (siempre hay integraciones disponibles)
- **Guardias**: No hay guardias explícitas (depende de Layout)
- **Categorías**: Pagos, Calendarios, Marketing, Comunicación, Salud y Fitness, Otras

#### `/settings/developer` — Webhooks & API Keys (solo gimnasios)
- **Componente raíz**: `src/features/webhooks-api-keys/pages/webhooks-api-keysPage.tsx`
- **Componentes hijos**:
  - `DeveloperSettingsContainer` (`src/features/webhooks-api-keys/components/DeveloperSettingsContainer.tsx`) - Container con tabs
  - `ApiKeysManager` (`src/features/webhooks-api-keys/components/ApiKeysManager.tsx`) - Gestor de API Keys
  - `ApiKeyListItem` (`src/features/webhooks-api-keys/components/ApiKeyListItem.tsx`) - Item individual de API Key
  - `WebhooksManager` (`src/features/webhooks-api-keys/components/WebhooksManager.tsx`) - Gestor de Webhooks
  - `WebhookForm` (`src/features/webhooks-api-keys/components/WebhookForm.tsx`) - Formulario de creación/edición
  - `WebhookLogsModal` (`src/features/webhooks-api-keys/components/WebhookLogsModal.tsx`) - Modal de logs de webhooks
- **API**: `src/features/webhooks-api-keys/api/index.ts` (webhooksApiKeysApi)
- **Estados**:
  - Loading: Spinner en componentes individuales
  - Error: Manejo de errores en componentes
  - Vacío: Mensaje cuando no hay API Keys o Webhooks
- **Guardias**: `gimnasioOnly: true` (solo visible para gimnasios)
- **Tabs**: API Keys, Webhooks

#### `/settings/data/importers` — Importadores / Migraciones
- **Componente raíz**: `src/features/importadores-migraciones/pages/importadores-migracionesPage.tsx`
- **Componentes hijos**:
  - `ImportProcessContainer` (`src/features/importadores-migraciones/components/ImportProcessContainer.tsx`) - Container principal del proceso
  - `FileUploadDropzone` (`src/features/importadores-migraciones/components/FileUploadDropzone.tsx`) - Zona de subida de archivos
  - `FieldMappingWizard` (`src/features/importadores-migraciones/components/FieldMappingWizard.tsx`) - Wizard de mapeo de campos
  - `ImportProgress` (`src/features/importadores-migraciones/components/ImportProgress.tsx`) - Barra de progreso de importación
  - `ImportResults` (`src/features/importadores-migraciones/components/ImportResults.tsx`) - Resultados de importación
  - `ImportHistory` (`src/features/importadores-migraciones/components/ImportHistory.tsx`) - Historial de importaciones
- **API**: `src/features/importadores-migraciones/api/importService.ts`
- **Estados**:
  - Loading: Estados de carga en cada paso
  - Error: Manejo de errores en cada paso
  - Vacío: No hay estado vacío explícito
- **Guardias**: No hay guardias explícitas (depende de Layout)
- **Pasos**: upload, mapping, progress, results
- **Tabs**: Import, History
- **Entidades soportadas**: members, classes, subscriptions, check_ins

---

## 2) 10 problemas que hoy SÍ resuelve

### 1. **Dashboard de Métricas de Integraciones con KPIs Agregados**
**Página(s)**: `/settings/integrations` (Integraciones)

**Problema cubierto**: No hay forma de ver el estado general de las integraciones sin revisar cada una individualmente.

**Como lo resuelve el código**:
- `IntegracionesYAutomatizacionPage` muestra métricas agregadas: Integraciones Activas, Automatizaciones, Tiempo Ahorrado, Conectividades Fallidas
- Métricas incluyen tendencias (vs mes pasado) y subtítulos descriptivos
- Visualización con `MetricCards` con iconos y colores diferenciados
- Alertas visuales para integraciones con problemas

**Riesgos/limitaciones**:
- Métricas son mock (no hay datos reales de tracking)
- No hay cálculo real de tiempo ahorrado
- Falta desglose por categoría de integración

### 2. **Galería de Integraciones con Categorización**
**Página(s)**: `/settings/integrations` (Integraciones)

**Problema cubierto**: No hay forma de descubrir y gestionar integraciones disponibles sin buscarlas manualmente.

**Como lo resuelve el código**:
- `IntegrationGalleryContainer` muestra galería de integraciones agrupadas por categoría
- Categorías: Pagos, Calendarios, Marketing, Comunicación, Salud y Fitness, Otras
- `IntegrationCard` muestra información clave: nombre, descripción, estado, logo
- Grid responsive (1-4 columnas según tamaño de pantalla)
- Visualización clara de estado (connected, disconnected, error)

**Riesgos/limitaciones**:
- Integraciones son mock (no hay catálogo real desde API)
- No hay búsqueda o filtrado avanzado
- Falta información de pricing o requisitos de cada integración

### 3. **Conexión de Integraciones con Flujo OAuth Simulado**
**Página(s)**: `/settings/integrations` (Integraciones)

**Problema cubierto**: No hay forma de conectar integraciones sin conocer el proceso técnico de OAuth.

**Como lo resuelve el código**:
- `IntegrationGalleryContainer` maneja flujo de conexión con `handleConnect`
- `integrationService.connectIntegration` genera URL de autorización
- Simulación de popup OAuth con `window.open` y escucha de mensajes
- Manejo de éxito/error del flujo OAuth
- Actualización automática de estado después de conexión

**Riesgos/limitaciones**:
- Flujo OAuth es simulado (no hay conexión real)
- No hay validación real de permisos o scopes
- Falta manejo de errores específicos de OAuth

### 4. **Configuración de Integraciones por Tipo**
**Página(s)**: `/settings/integrations` (Integraciones)

**Problema cubierto**: No hay forma de configurar parámetros específicos de cada integración después de conectarla.

**Como lo resuelve el código**:
- `IntegrationSettingsModal` permite configurar settings específicos por tipo de integración
- Configuraciones por tipo: calendarios (calendario a sincronizar, recordatorios), pagos (auto-capture, moneda), WhatsApp (recordatorios, templates), Mailchimp (list ID, auto-subscribe)
- Guardado de configuración con `integrationService.updateSettings`
- Validación de campos según tipo
- UI adaptada según tipo de integración

**Riesgos/limitaciones**:
- Configuración es mock (no afecta comportamiento real)
- No hay validación de valores (ej: moneda válida, list ID válido)
- Falta preview de cómo afecta la configuración

### 5. **Desconexión de Integraciones con Confirmación**
**Página(s)**: `/settings/integrations` (Integraciones)

**Problema cubierto**: No hay forma de desconectar integraciones de forma segura sin riesgo de pérdida de datos.

**Como lo resuelve el código**:
- `IntegrationCard` muestra botón "Desconectar" cuando está conectada
- Confirmación antes de desconectar (`confirm`)
- `integrationService.disconnectIntegration` ejecuta desconexión
- Actualización automática de estado después de desconexión
- Feedback visual inmediato

**Riesgos/limitaciones**:
- Desconexión es mock (no revoca tokens reales)
- No hay advertencias sobre impacto de desconexión
- Falta opción de pausar temporalmente en lugar de desconectar

### 6. **Gestión de API Keys con Permisos (Scopes)**
**Página(s)**: `/settings/developer` (Webhooks & API Keys)

**Problema cubierto**: No hay forma de generar API Keys con permisos específicos para integraciones externas.

**Como lo resuelve el código**:
- `ApiKeysManager` permite crear API Keys con nombre y scopes (permisos)
- `ApiKeyListItem` muestra información de cada key: nombre, scopes, última actividad, fecha de creación
- Selección de scopes desde lista disponible (`AVAILABLE_SCOPES`)
- Revocación de API Keys con confirmación
- Visualización de key solo una vez (después de crear, no se puede ver de nuevo)
- Estados: active, revoked

**Riesgos/limitaciones**:
- API Keys son mock (no hay generación real de tokens)
- No hay validación de scopes o límites de uso
- Falta rotación automática de keys

### 7. **Gestión de Webhooks con Eventos y Logs**
**Página(s)**: `/settings/developer` (Webhooks & API Keys)

**Problema cubierto**: No hay forma de configurar webhooks para recibir notificaciones de eventos del sistema.

**Como lo resuelve el código**:
- `WebhooksManager` permite crear/editar webhooks con URL y eventos
- `WebhookForm` permite configurar: URL, eventos a escuchar, secret, método HTTP
- `WebhookLogsModal` muestra historial de entregas de webhooks con estado (success, failed)
- Visualización de estado de webhook (active, inactive, error)
- Reenvío manual de webhooks fallidos
- Eliminación de webhooks con confirmación

**Riesgos/limitaciones**:
- Webhooks son mock (no hay envío real de eventos)
- No hay validación de URL o formato de secret
- Falta retry automático para webhooks fallidos

### 8. **Importación de Datos con Mapeo de Campos**
**Página(s)**: `/settings/data/importers` (Importadores / Migraciones)

**Problema cubierto**: No hay forma de importar datos masivos desde archivos CSV/Excel sin mapear campos manualmente.

**Como lo resuelve el código**:
- `FileUploadDropzone` permite subir archivos CSV/Excel
- `FieldMappingWizard` permite mapear columnas del archivo a campos del sistema
- Auto-mapeo inteligente basado en nombres similares de columnas
- Validación de campos requeridos antes de importar
- Soporte para múltiples entidades: members, classes, subscriptions, check_ins
- Campos objetivo específicos por entidad con tipos (string, email, phone, date, number)

**Riesgos/limitaciones**:
- Mapeo es básico (no hay todos los campos disponibles)
- No hay validación de formato de datos (ej: email válido, fecha válida)
- Falta preview de datos antes de importar

### 9. **Proceso de Importación con Progreso en Tiempo Real**
**Página(s)**: `/settings/data/importers` (Importadores / Migraciones)

**Problema cubierto**: No hay forma de ver el progreso de una importación masiva sin recargar la página.

**Como lo resuelve el código**:
- `ImportProgress` muestra barra de progreso con porcentaje
- Polling automático del estado de importación cada segundo
- Visualización de métricas: total rows, processed rows, successful rows, failed rows
- Estados de importación: pending, processing, completed, completed_with_errors, failed
- Transición automática a resultados cuando termina

**Riesgos/limitaciones**:
- Progreso es simulado (no hay procesamiento real)
- No hay cancelación de importación en progreso
- Falta estimación de tiempo restante

### 10. **Resultados Detallados de Importación con Errores**
**Página(s)**: `/settings/data/importers` (Importadores / Migraciones)

**Problema cubierto**: No hay forma de ver qué registros fallaron en una importación y por qué.

**Como lo resuelve el código**:
- `ImportResults` muestra resumen de importación: total, exitosos, fallidos
- Tabla de errores con: fila, columna, valor, mensaje de error
- Visualización clara de estado (success, partial success, failed)
- Métricas destacadas: total, exitosos, con errores
- Descarga de reporte de errores (opcional)
- Botón para iniciar nueva importación

**Riesgos/limitaciones**:
- Resultados son mock (no hay procesamiento real)
- No hay opción de corregir errores y re-importar solo las filas fallidas
- Falta exportación de errores a CSV

---

## 3) 10 problemas que AÚN NO resuelve (y debería)

### 1. **Conexión Real de Integraciones con OAuth**
**Necesidad detectada**: El flujo OAuth es simulado. No hay conexión real con servicios externos (Stripe, Google Calendar, WhatsApp, etc.).

**Propuesta de solución** (alto nivel + impacto):
- Implementación real de OAuth 2.0 para cada servicio
- Configuración de client IDs y secrets por servicio
- Flujo OAuth completo: redirect, callback, token exchange, refresh tokens
- Almacenamiento seguro de tokens (encriptados)
- Renovación automática de tokens expirados
- **Impacto**: Alto - Sin esto, las integraciones no funcionan. Es la funcionalidad core.

**Páginas/flujo afectados**:
- `IntegrationGalleryContainer` (conexión real)
- Nuevo servicio `OAuthService`
- Sistema de almacenamiento de tokens
- Integración con cada proveedor externo

**Complejidad estimada**: Alta (requiere OAuth completo, múltiples proveedores, almacenamiento seguro)

### 2. **Sincronización Real de Datos entre Sistemas**
**Necesidad detectada**: No hay sincronización real de datos entre la plataforma y servicios externos.

**Propuesta de solución** (alto nivel + impacto):
- Sincronización bidireccional de datos según tipo de integración
- Calendarios: sincronización de eventos (clases, sesiones) con Google Calendar/Outlook
- Pagos: sincronización de transacciones con Stripe/PayPal
- Salud: sincronización de datos de actividad con Apple Health/Google Fit
- Jobs/workers para sincronización periódica
- Manejo de conflictos (qué sistema tiene prioridad)
- **Impacto**: Alto - Sin esto, las integraciones no tienen valor funcional.

**Páginas/flujo afectados**:
- Nuevo servicio `DataSyncService`
- Sistema de jobs/workers
- Integración con cada tipo de servicio
- Manejo de conflictos

**Complejidad estimada**: Alta (requiere sincronización bidireccional, jobs, manejo de conflictos)

### 3. **Sistema de Automatizaciones Visual (Zapier-like)**
**Necesidad detectada**: No hay forma de crear automatizaciones personalizadas entre integraciones.

**Propuesta de solución** (alto nivel + impacto):
- Constructor visual de automatizaciones (if-then-else)
- Triggers: cuando ocurre evento en integración (nuevo pago, nuevo evento de calendario, etc.)
- Actions: acciones a ejecutar (enviar email, crear registro, actualizar dato)
- Condiciones: múltiples condiciones con operadores lógicos
- Testing de automatizaciones antes de activar
- Historial de ejecuciones con logs
- **Impacto**: Alto - Permite crear flujos de trabajo personalizados sin código.

**Páginas/flujo afectados**:
- Nuevo componente `AutomationBuilder`
- Nuevo servicio `AutomationService`
- Sistema de triggers y actions
- Sistema de ejecución de automatizaciones

**Complejidad estimada**: Alta (requiere constructor visual, triggers, actions, ejecución)

### 4. **Generación Real de API Keys con Tokens**
**Necesidad detectada**: Las API Keys son mock. No hay generación real de tokens para autenticación.

**Propuesta de solución** (alto nivel + impacto):
- Generación real de tokens JWT o API keys
- Almacenamiento seguro de tokens (hash)
- Validación de tokens en cada request
- Rate limiting por API key
- Rotación automática de keys
- Revocación inmediata de tokens
- **Impacto**: Alto - Sin esto, las API Keys no tienen valor funcional.

**Páginas/flujo afectados**:
- `ApiKeysManager` (generación real)
- Nuevo servicio `TokenGenerationService`
- Sistema de autenticación API
- Rate limiting

**Complejidad estimada**: Media/Alta (requiere generación de tokens, autenticación, rate limiting)

### 5. **Envío Real de Webhooks con Retry y Logging**
**Necesidad detectada**: Los webhooks son mock. No hay envío real de eventos a URLs externas.

**Propuesta de solución** (alto nivel + impacto):
- Envío real de webhooks HTTP POST cuando ocurren eventos
- Retry automático con exponential backoff para fallos
- Logging completo de cada intento (request, response, status)
- Validación de firma (HMAC) para seguridad
- Rate limiting para evitar spam
- Webhook health checks (ping periódico)
- **Impacto**: Alto - Sin esto, los webhooks no tienen valor funcional.

**Páginas/flujo afectados**:
- `WebhooksManager` (envío real)
- Nuevo servicio `WebhookDeliveryService`
- Sistema de eventos
- Sistema de retry y logging

**Complejidad estimada**: Media/Alta (requiere envío HTTP, retry, logging, seguridad)

### 6. **Importación Real de Datos con Validación Completa**
**Necesidad detectada**: La importación es mock. No hay procesamiento real de archivos ni validación de datos.

**Propuesta de solución** (alto nivel + impacto):
- Procesamiento real de archivos CSV/Excel
- Validación de formato de datos (email válido, fecha válida, número válido)
- Validación de unicidad (ej: emails duplicados)
- Validación de relaciones (ej: membership_plan_id existe)
- Procesamiento en background con jobs
- Rollback si falla completamente
- Importación parcial (solo registros válidos)
- **Impacto**: Alto - Sin esto, la importación no tiene valor funcional.

**Páginas/flujo afectados**:
- `ImportProcessContainer` (procesamiento real)
- Nuevo servicio `DataImportService`
- Sistema de validación
- Jobs para procesamiento en background

**Complejidad estimada**: Media/Alta (requiere procesamiento de archivos, validación, jobs)

### 7. **Catálogo Dinámico de Integraciones desde API**
**Necesidad detectada**: Las integraciones son mock. No hay catálogo real que se actualice cuando hay nuevas integraciones.

**Propuesta de solución** (alto nivel + impacto):
- API de catálogo de integraciones disponibles
- Actualización dinámica cuando se añaden nuevas integraciones
- Información detallada: pricing, requisitos, documentación, reviews
- Filtros: por categoría, precio, popularidad
- Búsqueda de integraciones
- Preview de funcionalidades antes de conectar
- **Impacto**: Medio/Alto - Permite descubrir nuevas integraciones sin actualizar código.

**Páginas/flujo afectados**:
- `IntegrationGalleryContainer` (catálogo dinámico)
- Nuevo servicio `IntegrationCatalogService`
- API de catálogo
- Sistema de búsqueda y filtros

**Complejidad estimada**: Media (requiere API de catálogo, búsqueda, filtros)

### 8. **Monitoreo y Alertas de Integraciones**
**Necesidad detectada**: No hay alertas cuando integraciones fallan, tokens expiran, o sincronizaciones fallan.

**Propuesta de solución** (alto nivel + impacto):
- Monitoreo continuo de salud de integraciones
- Alertas cuando token expira o necesita renovación
- Alertas cuando sincronización falla repetidamente
- Alertas cuando webhook falla múltiples veces
- Dashboard de salud de todas las integraciones
- Notificaciones por email/notificación push
- **Impacto**: Medio/Alto - Permite detectar y resolver problemas proactivamente.

**Páginas/flujo afectados**:
- `IntegracionesYAutomatizacionPage` (dashboard de salud)
- Nuevo componente `IntegrationHealthMonitor`
- Nuevo servicio `IntegrationMonitoringService`
- Sistema de alertas

**Complejidad estimada**: Media (requiere monitoreo, alertas, notificaciones)

### 9. **Historial y Auditoría de Cambios en Integraciones**
**Necesidad detectada**: No hay historial de cambios en integraciones, conexiones, o configuraciones.

**Propuesta de solución** (alto nivel + impacto):
- Historial de todas las acciones: conexión, desconexión, cambios de configuración
- Auditoría de quién hizo qué cambio y cuándo
- Historial de sincronizaciones (últimas 10, estado, errores)
- Historial de webhooks (últimos 100 eventos, estado)
- Exportación de historial para auditoría
- **Impacto**: Medio - Permite rastrear cambios y debuggear problemas.

**Páginas/flujo afectados**:
- Nuevo componente `IntegrationHistory`
- Nuevo servicio `AuditLogService`
- Sistema de auditoría
- Base de datos de historial

**Complejidad estimada**: Media (requiere sistema de auditoría, almacenamiento)

### 10. **Migración Completa desde Sistemas Externos**
**Necesidad detectada**: La importación es básica. No hay migración completa desde sistemas externos (otros softwares de gimnasio).

**Propuesta de solución** (alto nivel + impacto):
- Conectores específicos para sistemas populares (Mindbody, GymMaster, etc.)
- Migración de datos completos: clientes, membresías, pagos, entrenos, historial
- Mapeo automático de campos entre sistemas
- Validación de integridad de datos después de migración
- Rollback si algo falla
- Migración incremental (por lotes)
- **Impacto**: Medio/Alto - Permite migrar completamente desde otros sistemas sin pérdida de datos.

**Páginas/flujo afectados**:
- `ImportProcessContainer` (migración completa)
- Nuevos conectores por sistema externo
- Nuevo servicio `MigrationService`
- Sistema de validación y rollback

**Complejidad estimada**: Alta (requiere conectores específicos, migración completa, validación)

---

## 4) Hallazgos desde navegación/menús

### Sidebar.tsx

**Estructura de la sección**:
```typescript
{
  id: 'integraciones',
  title: 'Integraciones & Automatización',
  icon: Plug,
  items: [
    { id: 'integraciones-y-automatizacion', label: 'Integraciones', icon: Plug, path: '/settings/integrations' },
    { id: 'webhooks-api-keys', label: 'Webhooks & API Keys', icon: Key, path: '/settings/developer', gimnasioOnly: true },
    { id: 'importadores-migraciones', label: isEntrenador ? 'Importar Clientes' : 'Importadores / Migraciones', icon: Database, path: '/settings/data/importers' },
  ],
}
```

**Permisos y visibilidad**:
- "Integraciones" es visible para ambos roles
- "Webhooks & API Keys" es solo para gimnasios (`gimnasioOnly: true`)
- "Importadores / Migraciones" es visible para ambos roles, pero con label diferente según rol
- No hay badges o contadores de notificaciones

**Inconsistencias de UX o naming**:
1. **Naming inconsistente**:
   - "Integraciones" (singular, pero gestiona múltiples)
   - "Webhooks & API Keys" (inglés)
   - "Importadores / Migraciones" (español, plural)
   - Mezcla de idiomas y singular/plural

2. **Rutas inconsistentes**:
   - `/settings/integrations` (bajo settings)
   - `/settings/developer` (bajo settings)
   - `/settings/data/importers` (bajo settings/data)
   - Falta de consistencia en estructura de rutas

3. **Label dinámico según rol**:
   - "Importar Clientes" para entrenador
   - "Importadores / Migraciones" para gimnasio
   - Bien diferenciado, pero podría ser más claro qué funcionalidades están disponibles

4. **Falta de conexión con otras secciones**:
   - "Integraciones" podría estar relacionada con "Integraciones & Partnerships" (pero son diferentes)
   - No hay conexión clara entre integraciones y automatizaciones (aunque están en el mismo nombre)

5. **Iconos inconsistentes**:
   - Plug para sección y "Integraciones" (duplicado)
   - Key para "Webhooks & API Keys" (específico)
   - Database para "Importadores / Migraciones" (específico)
   - Falta coherencia visual

6. **Falta de indicadores visuales**:
   - No hay badges de integraciones con errores
   - No hay alertas de webhooks fallidos
   - No hay indicadores de importaciones en progreso

**Sugerencias de mejora**:
- Estandarizar nombres (singular vs plural, idioma)
- Unificar estructura de rutas (todas bajo `/settings/integrations/` o `/settings/`)
- Añadir badges de notificaciones para integraciones con errores y webhooks fallidos
- Conectar con sección de "Integraciones & Partnerships" para clarificar diferencias
- Considerar renombrar sección a "Integraciones" y mover "Automatización" a otra sección

---

## 5) KPIs y métricas recomendadas

### Métricas de adopción
- **Tasa de adopción de integraciones**: % de usuarios que conectan al menos una integración
  - Meta: >60% para ambos roles
- **Número promedio de integraciones por usuario**: Integraciones activas por usuario
  - Meta: >2 integraciones activas
- **Tasa de adopción de API Keys**: % de gimnasios que generan al menos una API key
  - Meta: >30% para gimnasios
- **Tasa de adopción de webhooks**: % de gimnasios que crean al menos un webhook
  - Meta: >20% para gimnasios
- **Tasa de uso de importadores**: % de usuarios que importan datos al menos una vez
  - Meta: >40% para ambos roles
- **Retención de usuarios**: % de usuarios que siguen usando integraciones después del primer uso
  - Meta: >80% retención a 30 días

### Tiempo de tarea
- **Tiempo para conectar integración**: Desde abrir hasta completar OAuth
  - Meta: <2 minutos (flujo OAuth)
- **Tiempo para generar API Key**: Desde abrir modal hasta key generada
  - Meta: <1 minuto
- **Tiempo para crear webhook**: Desde abrir modal hasta webhook creado
  - Meta: <2 minutos
- **Tiempo para importar datos**: Desde subir archivo hasta completar importación
  - Meta: <5 minutos (para 100 registros)

### Conversión interna
- **Tasa de éxito de conexión OAuth**: % de intentos de conexión que se completan exitosamente
  - Meta: >90%
- **Tasa de integraciones activas**: % de integraciones conectadas que se mantienen activas
  - Meta: >85%
- **Tasa de éxito de importaciones**: % de importaciones que se completan sin errores
  - Meta: >80%
- **Tasa de éxito de webhooks**: % de webhooks que se entregan exitosamente
  - Meta: >95%

### Errores por flujo
- **Errores en conexión OAuth**: % de intentos de conexión que fallan
  - Meta: <5%
- **Errores en sincronización**: % de sincronizaciones que fallan
  - Meta: <2%
- **Errores en importación**: % de importaciones que fallan completamente
  - Meta: <5%
- **Errores en entrega de webhooks**: % de webhooks que fallan al entregar
  - Meta: <5%

### Latencia clave
- **Tiempo de sincronización**: Tiempo desde evento hasta sincronizar con servicio externo
  - Meta: <30 segundos (tiempo casi real)
- **Tiempo de entrega de webhook**: Tiempo desde evento hasta entregar webhook
  - Meta: <5 segundos
- **Tiempo de procesamiento de importación**: Tiempo por registro en importación
  - Meta: <100ms por registro
- **Tiempo de respuesta de API**: Tiempo de respuesta promedio de API endpoints
  - Meta: <200ms (p95)

---

## 6) Backlog priorizado (RICE/MoSCoW)

### MUST (top 3)

#### 1. Conexión Real de Integraciones con OAuth
- **RICE Score**:
  - Reach: 100% usuarios que intentan conectar integración
  - Impact: 10/10 (sin esto, integraciones no funcionan)
  - Confidence: 8/10
  - Effort: 10/10 (muy complejo, requiere OAuth completo)
  - **Score: 8.0**
- **Justificación**: Es la funcionalidad core. Sin conexión real, las integraciones no tienen valor funcional.
- **Esfuerzo estimado**: 12-14 semanas (2-3 desarrolladores + DevOps)

#### 2. Sincronización Real de Datos entre Sistemas
- **RICE Score**:
  - Reach: 100% integraciones conectadas
  - Impact: 10/10 (necesario para que funcionen integraciones)
  - Confidence: 8/10
  - Effort: 10/10 (muy complejo, requiere sincronización bidireccional)
  - **Score: 8.0**
- **Justificación**: Sin sincronización real, las integraciones no tienen valor funcional.
- **Esfuerzo estimado**: 12-14 semanas (2-3 desarrolladores + DevOps)

#### 3. Generación Real de API Keys con Tokens
- **RICE Score**:
  - Reach: 100% gimnasios que intentan generar API key
  - Impact: 10/10 (sin esto, API keys no funcionan)
  - Confidence: 8/10
  - Effort: 7/10 (medio/alto, requiere generación de tokens)
  - **Score: 11.4**
- **Justificación**: Sin tokens reales, las API Keys no tienen valor funcional.
- **Esfuerzo estimado**: 6-8 semanas (1-2 desarrolladores)

### SHOULD (top 3)

#### 4. Envío Real de Webhooks con Retry
- **RICE Score**:
  - Reach: 100% webhooks creados
  - Impact: 10/10 (necesario para que funcionen webhooks)
  - Confidence: 8/10
  - Effort: 7/10 (medio/alto)
  - **Score: 11.4**
- **Esfuerzo estimado**: 6-8 semanas

#### 5. Importación Real de Datos con Validación
- **RICE Score**:
  - Reach: 100% usuarios que intentan importar datos
  - Impact: 10/10 (necesario para que funcione importación)
  - Confidence: 8/10
  - Effort: 7/10 (medio/alto)
  - **Score: 11.4**
- **Esfuerzo estimado**: 6-8 semanas

#### 6. Sistema de Automatizaciones Visual
- **RICE Score**:
  - Reach: 100% usuarios
  - Impact: 9/10 (permite crear flujos personalizados)
  - Confidence: 7/10
  - Effort: 10/10 (muy complejo)
  - **Score: 6.3**
- **Esfuerzo estimado**: 12-14 semanas

### COULD (top 3)

#### 7. Monitoreo y Alertas de Integraciones
- **RICE Score**:
  - Reach: 100% integraciones conectadas
  - Impact: 8/10 (permite detectar problemas)
  - Confidence: 8/10
  - Effort: 6/10 (medio)
  - **Score: 10.7**
- **Esfuerzo estimado**: 5-6 semanas

#### 8. Catálogo Dinámico de Integraciones
- **RICE Score**:
  - Reach: 100% usuarios
  - Impact: 7/10 (permite descubrir nuevas integraciones)
  - Confidence: 8/10
  - Effort: 6/10 (medio)
  - **Score: 9.3**
- **Esfuerzo estimado**: 5-6 semanas

#### 9. Historial y Auditoría de Cambios
- **RICE Score**:
  - Reach: 100% acciones en integraciones
  - Impact: 7/10 (permite rastrear cambios)
  - Confidence: 8/10
  - Effort: 6/10 (medio)
  - **Score: 9.3**
- **Esfuerzo estimado**: 5-6 semanas

---

## 7) Próximos pasos

### 3 acciones accionables para la próxima iteración

#### 1. **Implementar Conexión Real de Integraciones Básicas (10 semanas)**
- **Acciones específicas**:
  - OAuth 2.0 para Google Calendar (conexión básica)
  - OAuth 2.0 para Stripe (conexión básica)
  - Almacenamiento seguro de tokens (encriptados en base de datos)
  - Renovación automática de tokens expirados
  - Manejo básico de errores de OAuth
  - Validación de permisos/scopes requeridos
- **Responsables**: Backend developer (1) + Frontend developer (1)
- **Entregables**:
  - OAuth funcional para 2 integraciones
  - Almacenamiento seguro de tokens
  - Renovación automática

#### 2. **Implementar Generación Real de API Keys (6 semanas)**
- **Acciones específicas**:
  - Generación real de tokens JWT o API keys
  - Almacenamiento seguro (hash de tokens)
  - Validación de tokens en cada request
  - Rate limiting básico por API key
  - Revocación inmediata de tokens
  - Documentación básica de API
- **Responsables**: Backend developer (1)
- **Entregables**:
  - Generación real de tokens
  - Autenticación API funcional
  - Rate limiting básico

#### 3. **Implementar Importación Real de Datos Básica (8 semanas)**
- **Acciones específicas**:
  - Procesamiento real de archivos CSV (usar librería papaparse)
  - Validación básica de formato (email válido, fecha válida)
  - Validación de campos requeridos
  - Procesamiento en background con jobs
  - Importación de miembros (entidad más simple)
  - Manejo básico de errores por fila
- **Responsables**: Backend developer (1) + Frontend developer (0.5)
- **Entregables**:
  - Procesamiento real de CSV
  - Validación básica
  - Importación de miembros funcional

### Riesgos y supuestos

**Riesgos identificados**:
1. **Tokens pueden ser comprometidos si no se almacenan correctamente**:
   - Mitigación: Encriptación de tokens, rotación periódica, revocación inmediata, auditoría de acceso
   - Impacto: Alto - afecta seguridad de datos

2. **Sincronización puede causar conflictos si hay datos duplicados**:
   - Mitigación: Resolución de conflictos (último cambio gana, o merge manual), validación de unicidad
   - Impacto: Medio - afecta integridad de datos

3. **OAuth puede fallar si proveedor cambia API o requiere más permisos**:
   - Mitigación: Monitoreo de cambios en APIs, testing continuo, alertas cuando falla
   - Impacto: Medio - afecta disponibilidad de integraciones

4. **Importación puede fallar si archivo es muy grande o formato incorrecto**:
   - Mitigación: Validación previa de formato, límites de tamaño, procesamiento por lotes
   - Impacto: Medio - afecta experiencia del usuario

**Supuestos**:
- Hay acceso a APIs de proveedores externos (Google, Stripe, etc.) con cuotas suficientes
- Hay infraestructura para almacenar tokens de forma segura (encriptación)
- Hay base de datos para almacenar integraciones, tokens, webhooks, historial de importaciones
- Hay sistema de jobs/workers para procesamiento asíncrono (sincronización, importación)
- Hay sistema de eventos para trigger de webhooks
- Los usuarios tienen conocimientos básicos de OAuth (puede requerir educación)

**Dependencias externas**:
- APIs de proveedores externos (Google, Stripe, PayPal, WhatsApp, Mailchimp, etc.)
- Servicios de almacenamiento seguro (encriptación de tokens)
- Base de datos para almacenamiento
- Sistema de jobs/workers para procesamiento asíncrono
- Sistema de eventos para webhooks
- Librerías de procesamiento de archivos (papaparse para CSV, exceljs para Excel)

---

> **Notas técnicas**: 
> - Todas las rutas son relativas desde la raíz del proyecto
> - Los componentes de Integraciones están en `src/features/integraciones-y-automatizacion/`
> - Los componentes de Webhooks & API Keys están en `src/features/webhooks-api-keys/`
> - Los componentes de Importadores están en `src/features/importadores-migraciones/`
> - Las APIs están en `src/features/[Feature]/api/`














