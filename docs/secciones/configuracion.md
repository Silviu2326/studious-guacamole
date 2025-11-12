# Configuración — Diagnóstico funcional y de producto

## 1) Mapa de páginas de la sección

### Páginas principales

#### `/settings/general-profile` — General del Centro / Marca Personal
- **Componente raíz**: `src/features/general-del-centro-marca-personal/pages/general-del-centro-marca-personalPage.tsx`
- **Componentes hijos**:
  - `GeneralSettingsContainer` (`src/features/general-del-centro-marca-personal/components/GeneralSettingsContainer.tsx`) - Container principal
  - `BusinessProfileCard` (`src/features/general-del-centro-marca-personal/components/BusinessProfileCard.tsx`) - Card de información del negocio
  - `LogoUploader` (`src/features/general-del-centro-marca-personal/components/LogoUploader.tsx`) - Subida de logo
  - `BusinessHoursCard` (`src/features/general-del-centro-marca-personal/components/BusinessHoursCard.tsx`) - Configuración de horarios
  - `PaymentIntegrationCard` (`src/features/general-del-centro-marca-personal/components/PaymentIntegrationCard.tsx`) - Integración de pagos
- **API**: `src/features/general-del-centro-marca-personal/api/profileApi.ts`
- **Estados**:
  - Loading: `Loader2` spinner con mensaje "Cargando..."
  - Error: Mensaje de error con `AlertCircle`
  - Vacío: No hay estado vacío explícito (siempre hay formulario)
- **Guardias**: No hay guardias explícitas (depende de Layout)
- **Diferencias por rol**: UI adaptada según rol (entrenador vs gimnasio)

#### `/settings/services` — Servicios & Tarifas
- **Componente raíz**: `src/features/servicios-tarifas/pages/servicios-tarifasPage.tsx`
- **Componentes hijos**:
  - `ServiceTable` (`src/features/servicios-tarifas/components/ServiceTable.tsx`) - Tabla de servicios
  - `ServiceFormModal` (`src/features/servicios-tarifas/components/ServiceFormModal.tsx`) - Modal de creación/edición
- **Estados**:
  - Loading: `Loader2` spinner con mensaje "Cargando servicios..."
  - Error: Card con `AlertCircle` y botón "Reintentar"
  - Vacío: No hay estado vacío explícito (solo tabla vacía)
- **Guardias**: No hay guardias explícitas (depende de Layout)
- **Filtros**: Por búsqueda, categoría, estado (activo/inactivo)

#### `/settings/policies` — Políticas & Términos (solo gimnasios)
- **Componente raíz**: `src/features/politicas-terminos/pages/politicas-terminosPage.tsx`
- **Componentes hijos**:
  - `PoliciesManagerContainer` (`src/features/politicas-terminos/components/PoliciesManagerContainer.tsx`) - Container principal
  - `PolicyCard` (`src/features/politicas-terminos/components/PolicyCard.tsx`) - Tarjeta individual de política
  - `PolicyEditor` (`src/features/politicas-terminos/components/PolicyEditor.tsx`) - Editor de políticas
  - `VersionHistory` (`src/features/politicas-terminos/components/VersionHistory.tsx`) - Historial de versiones
- **API**: `src/features/politicas-terminos/api/policiesAPI.ts`, `usePoliciesAPI.ts`
- **Estados**:
  - Loading: `loading` state en hook
  - Error: Card con `AlertCircle` y mensaje
  - Vacío: No hay estado vacío explícito (solo lista vacía)
- **Guardias**: `gimnasioOnly: true` (solo visible para gimnasios)
- **Tipos de políticas**: CANCELLATION, GDPR, FACILITY_RULES

#### `/settings/templates` — Plantillas de Mensajes y Contratos
- **Componente raíz**: `src/features/plantillas-de-mensajes-y-contratos/pages/plantillas-de-mensajes-y-contratosPage.tsx`
- **Componentes hijos**:
  - `TemplateManagerContainer` (`src/features/plantillas-de-mensajes-y-contratos/components/TemplateManagerContainer.tsx`) - Container principal
  - `TemplateList` (`src/features/plantillas-de-mensajes-y-contratos/components/TemplateList.tsx`) - Lista de plantillas
  - `TemplateEditor` (`src/features/plantillas-de-mensajes-y-contratos/components/TemplateEditor.tsx`) - Editor de plantillas
- **API**: `src/features/plantillas-de-mensajes-y-contratos/api/templatesAPI.ts`, `useTemplateAPI.ts`
- **Estados**:
  - Loading: `loading` state en hook
  - Error: Manejo de errores en componentes
  - Vacío: No hay estado vacío explícito
- **Guardias**: No hay guardias explícitas (depende de Layout)
- **Tipos**: EMAIL, SMS, CONTRACT
- **Filtros**: Por tipo, búsqueda

#### `/configuracion/roles-y-permisos` — Roles & Permisos (solo gimnasios)
- **Componente raíz**: `src/features/roles-permisos/pages/roles-permisosPage.tsx`
- **Componentes hijos**:
  - `RolesPermissionsManager` (`src/features/roles-permisos/components/RolesPermissionsManager.tsx`) - Gestor principal
  - `RoleListTable` (`src/features/roles-permisos/components/RoleListTable.tsx`) - Tabla de roles
  - `RoleEditorModal` (`src/features/roles-permisos/components/RoleEditorModal.tsx`) - Modal de edición
  - `PermissionSelector` (`src/features/roles-permisos/components/PermissionSelector.tsx`) - Selector de permisos
- **API**: `src/features/roles-permisos/api/` (RolesApiService)
- **Estados**:
  - Loading: `isLoading` state
  - Error: Mensaje de error con `AlertCircle`
  - Vacío: No hay estado vacío explícito
- **Guardias**: `gimnasioOnly: true` (solo visible para gimnasios)
- **Filtros**: Por búsqueda (nombre, descripción)

#### `/settings/financials` — Configuración Financiera / Fiscal
- **Componente raíz**: `src/features/moneda-impuestos-series-de-factura/pages/moneda-impuestos-series-de-facturaPage.tsx`
- **Componentes hijos**:
  - `CurrencySelector` (`src/features/moneda-impuestos-series-de-factura/components/CurrencySelector.tsx`) - Selector de moneda
  - `TaxRateManager` (`src/features/moneda-impuestos-series-de-factura/components/TaxRateManager.tsx`) - Gestor de impuestos
  - `InvoiceSeriesManager` (`src/features/moneda-impuestos-series-de-factura/components/InvoiceSeriesManager.tsx`) - Gestor de series de factura
  - `InvoiceSeriesForm` (`src/features/moneda-impuestos-series-de-factura/components/InvoiceSeriesForm.tsx`) - Formulario de series
- **API**: `src/features/moneda-impuestos-series-de-factura/api/` (financialApi, taxesApi, invoiceSeriesApi)
- **Estados**:
  - Loading: `Loader2` spinner con mensaje "Cargando configuración financiera..."
  - Error: Card con `AlertCircle` y botón "Reintentar"
  - Vacío: No hay estado vacío explícito
- **Guardias**: No hay guardias explícitas (depende de Layout)
- **Diferencias por rol**: UI adaptada según rol (entrenador: simple, gimnasio: avanzado)

---

## 2) 10 problemas que hoy SÍ resuelve

### 1. **Configuración de Perfil del Negocio con Indicador de Completitud**
**Página(s)**: `/settings/general-profile` (General del Centro / Marca Personal)

**Problema cubierto**: No hay forma de ver qué tan completo está el perfil del negocio sin revisar manualmente cada campo.

**Como lo resuelve el código**:
- `GeneralSettingsContainer` calcula porcentaje de completitud basado en campos requeridos
- Indicador visual circular con porcentaje (0-100%)
- Cálculo diferenciado según tipo de perfil (gimnasio: 7 campos, entrenador: 6 campos)
- Campos considerados: nombre, descripción, logo, horarios, integración de pagos, dirección (gimnasio), aforo (gimnasio), especialidades (entrenador)
- Visualización clara del progreso

**Riesgos/limitaciones**:
- Cálculo es básico (no todos los campos tienen el mismo peso)
- No hay validación de calidad de datos (ej: descripción mínima)
- Falta guía de cómo mejorar el completitud

### 2. **Gestión de Horarios de Negocio con Múltiples Franjas**
**Página(s)**: `/settings/general-profile` (General del Centro / Marca Personal)

**Problema cubierto**: No hay forma de configurar horarios complejos con múltiples franjas por día (ej: mañana y tarde).

**Como lo resuelve el código**:
- `BusinessHoursCard` permite configurar horarios por día de la semana
- Múltiples franjas horarias por día (slots)
- Añadir/eliminar franjas con botones
- Marcar días como cerrados
- Hook `useBusinessHours` gestiona estado de horarios
- Sincronización bidireccional entre props y estado local

**Riesgos/limitaciones**:
- Horarios son mock (no afectan disponibilidad real)
- No hay validación de solapamiento de franjas
- Falta importación desde calendario externo

### 3. **Subida de Logo con Validación**
**Página(s)**: `/settings/general-profile` (General del Centro / Marca Personal)

**Problema cubierto**: No hay forma de subir y gestionar el logo del negocio de forma sencilla.

**Como lo resuelve el código**:
- `LogoUploader` permite subir archivo de imagen
- `profileApi.uploadLogo` maneja subida con FormData
- Validación de tamaño máximo (5MB) y formato
- Preview del logo después de subir
- Manejo de errores específicos (413: tamaño excedido, 415: formato no soportado)
- Actualización automática del perfil

**Riesgos/limitaciones**:
- Subida es mock (no hay upload real)
- No hay validación de dimensiones (ancho/alto)
- Falta crop o redimensionamiento automático

### 4. **Gestión Completa de Servicios con Tipos y Tarifas**
**Página(s)**: `/settings/services` (Servicios & Tarifas)

**Problema cubierto**: No hay forma de gestionar el catálogo de servicios con diferentes tipos, precios y configuración.

**Como lo resuelve el código**:
- `ServiceTable` muestra lista completa de servicios con información clave
- `ServiceFormModal` permite crear/editar servicios con campos completos
- Tipos de servicio: MEMBERSHIP, SESSION_PACK, SINGLE_CLASS, PRODUCT, CONSULTATION, ONLINE_PROGRAM
- Configuración de precios, moneda, tarifas recurrentes, impuestos, duración, número de sesiones
- Estados: activo/inactivo
- Categorización de servicios
- Diferenciación por rol (entrenador vs gimnasio tienen tipos diferentes disponibles)

**Riesgos/limitaciones**:
- Servicios son mock (no hay persistencia real)
- No hay validación de precios (ej: mínimo, máximo)
- Falta integración con sistema de facturación

### 5. **Métricas de Servicios con KPIs Agregados**
**Página(s)**: `/settings/services` (Servicios & Tarifas)

**Problema cubierto**: No hay forma de ver el rendimiento general de los servicios sin calcular métricas manualmente.

**Como lo resuelve el código**:
- `ServiciosTarifasPage` muestra métricas agregadas: Total Servicios, Servicios Activos, Ingresos 30 días, Ticket Promedio
- Cálculo automático desde datos de servicios
- Visualización con `MetricCards` con iconos y colores diferenciados
- Datos mock pero estructura completa

**Riesgos/limitaciones**:
- Métricas son mock (no hay datos reales de ingresos)
- No hay comparación con períodos anteriores
- Falta desglose por tipo de servicio

### 6. **Filtrado y Búsqueda Avanzada de Servicios**
**Página(s)**: `/settings/services` (Servicios & Tarifas)

**Problema cubierto**: No hay forma de encontrar servicios específicos cuando hay muchos sin buscar manualmente.

**Como lo resuelve el código**:
- Búsqueda por nombre o descripción
- Filtros por categoría y estado (activo/inactivo)
- Panel de filtros avanzados colapsable
- Contador de filtros activos
- Botón para limpiar todos los filtros
- Resumen de resultados encontrados

**Riesgos/limitaciones**:
- Filtrado es client-side (no hay paginación eficiente)
- No hay filtros por precio, tipo, o fecha de creación
- Falta guardado de filtros favoritos

### 7. **Gestión de Políticas con Versionado Inmutable**
**Página(s)**: `/settings/policies` (Políticas & Términos)

**Problema cubierto**: No hay forma de gestionar políticas legales con historial de cambios para cumplimiento.

**Como lo resuelve el código**:
- `PoliciesManagerContainer` gestiona políticas con versionado
- `PolicyEditor` permite editar contenido HTML
- `VersionHistory` muestra historial completo de versiones
- Cada cambio crea nueva versión inmutable
- Opción de requerir re-aceptación de socios cuando cambia política
- Tipos de políticas: Cancelación, GDPR, Normas de Uso
- Vista previa del contenido HTML

**Riesgos/limitaciones**:
- Políticas son mock (no hay persistencia real)
- No hay validación de formato HTML
- Falta notificación automática a socios cuando se requiere re-aceptación

### 8. **Gestión de Plantillas con Variables Dinámicas**
**Página(s)**: `/settings/templates` (Plantillas de Mensajes y Contratos)

**Problema cubierto**: No hay forma de crear plantillas de comunicación reutilizables con personalización automática.

**Como lo resuelve el código**:
- `TemplateManagerContainer` gestiona plantillas de Email, SMS y Contratos
- `TemplateEditor` permite crear/editar con variables dinámicas
- Variables disponibles: `{{client_name}}`, `{{membership_plan}}`, `{{gym_name}}`, etc.
- Botones para insertar variables fácilmente
- Preview de plantillas
- Filtrado por tipo y búsqueda
- Estadísticas: total, activas, por tipo
- Soporte para firma digital en contratos (`requiresSignature`)

**Riesgos/limitaciones**:
- Plantillas son mock (no hay persistencia real)
- No hay validación de variables (si se usan correctamente)
- Falta preview con datos de ejemplo

### 9. **Gestión de Roles y Permisos con RBAC**
**Página(s)**: `/configuracion/roles-y-permisos` (Roles & Permisos)

**Problema cubierto**: No hay forma de gestionar permisos de acceso del personal sin configurar cada usuario individualmente.

**Como lo resuelve el código**:
- `RolesPermissionsManager` permite crear/editar roles con permisos
- `PermissionSelector` permite seleccionar permisos por grupo
- `RoleListTable` muestra roles con información: nombre, descripción, número de usuarios, permisos
- Clonación de roles para crear nuevos basados en existentes
- Búsqueda de roles por nombre o descripción
- Eliminación con confirmación
- Sistema RBAC (Role-Based Access Control)

**Riesgos/limitaciones**:
- Roles son mock (no hay persistencia real)
- No hay validación de permisos (si son coherentes)
- Falta preview de qué secciones puede ver cada rol

### 10. **Configuración Financiera Completa (Moneda, Impuestos, Series)**
**Página(s)**: `/settings/financials` (Configuración Financiera / Fiscal)

**Problema cubierto**: No hay forma de configurar moneda, impuestos y series de facturación de forma centralizada.

**Como lo resuelve el código**:
- `CurrencySelector` permite seleccionar moneda principal (EUR, USD, GBP, MXN, etc.)
- `TaxRateManager` permite gestionar tipos impositivos (IVA, GST, etc.) con porcentajes y tipos (estándar, reducido, exento)
- `InvoiceSeriesManager` permite gestionar series de facturación con formato personalizado y contadores
- Configuración diferenciada por rol (entrenador: simple, gimnasio: avanzado con múltiples sedes)
- Marcado de impuestos y series como "por defecto"
- Validación de unicidad (solo una serie/impuesto por defecto)

**Riesgos/limitaciones**:
- Configuración es mock (no afecta facturación real)
- No hay validación de formato de series (ej: formato válido)
- Falta historial de cambios en configuración

---

## 3) 10 problemas que AÚN NO resuelve (y debería)

### 1. **Validación de Datos y Cumplimiento de Requisitos Legales**
**Necesidad detectada**: No hay validación de que los datos configurados cumplan con requisitos legales (ej: RGPD, facturación fiscal).

**Propuesta de solución** (alto nivel + impacto):
- Validación automática de campos requeridos por ley (ej: NIF/CIF para facturación)
- Verificación de que políticas de privacidad están completas y cumplen RGPD
- Alertas cuando faltan datos requeridos para operaciones legales
- Checklist de cumplimiento legal
- Integración con servicios de validación de datos fiscales
- **Impacto**: Alto - Permite evitar problemas legales y cumplir con normativas.

**Páginas/flujo afectados**:
- `GeneralSettingsContainer` (validación de datos)
- `PoliciesManagerContainer` (validación RGPD)
- `MonedaImpuestosSeriesDeFacturaPage` (validación fiscal)
- Nuevo servicio `LegalComplianceValidator`

**Complejidad estimada**: Media/Alta (requiere conocimiento legal, validación, integraciones)

### 2. **Sincronización de Horarios con Sistema de Reservas**
**Necesidad detectada**: Los horarios configurados no se sincronizan automáticamente con el sistema de reservas/agenda.

**Propuesta de solución** (alto nivel + impacto):
- Sincronización automática de horarios de negocio con disponibilidad de reservas
- Bloqueo automático de reservas fuera de horarios de apertura
- Actualización automática cuando cambian horarios
- Diferentes horarios por tipo de servicio (ej: clases grupales vs personal training)
- Horarios especiales (festivos, vacaciones)
- **Impacto**: Alto - Evita reservas en horarios incorrectos y mejora experiencia del usuario.

**Páginas/flujo afectados**:
- `BusinessHoursCard` (sincronización real)
- Integración con módulo de agenda/reservas
- Nuevo servicio `ScheduleSyncService`

**Complejidad estimada**: Media (requiere integración cross-module, sincronización)

### 3. **Integración Real de Pagos (Stripe Connect)**
**Necesidad detectada**: La integración de pagos es mock. No hay conexión real con Stripe o procesadores de pago.

**Propuesta de solución** (alto nivel + impacto):
- Integración real con Stripe Connect para procesamiento de pagos
- Configuración de cuenta de Stripe desde el panel
- Verificación de cuenta verificada
- Configuración de métodos de pago aceptados
- Webhooks para recibir eventos de pagos
- **Impacto**: Alto - Sin esto, no se pueden procesar pagos reales. Es funcionalidad core.

**Páginas/flujo afectados**:
- `PaymentIntegrationCard` (conexión real)
- Nuevo servicio `PaymentIntegrationService`
- Integración con Stripe Connect API

**Complejidad estimada**: Alta (requiere OAuth de Stripe, webhooks, manejo de eventos)

### 4. **Aplicación Real de Permisos en el Sistema**
**Necesidad detectada**: Los roles y permisos son mock. No hay aplicación real de restricciones de acceso en el sistema.

**Propuesta de solución** (alto nivel + impacto):
- Sistema de autorización basado en permisos reales
- Middleware que verifica permisos en cada request
- Ocultación de UI según permisos del usuario
- Restricción de acceso a rutas según permisos
- Logging de intentos de acceso no autorizados
- **Impacto**: Alto - Sin esto, el sistema de roles no tiene valor funcional.

**Páginas/flujo afectados**:
- Todo el sistema (middleware de autorización)
- Nuevo servicio `AuthorizationService`
- Sistema de guards en rutas
- Componentes con permisos condicionales

**Complejidad estimada**: Alta (requiere middleware, guards, verificación en cada request)

### 5. **Asignación de Usuarios a Roles**
**Necesidad detectada**: No hay forma de asignar usuarios del equipo a roles creados.

**Propuesta de solución** (alto nivel + impacto):
- Interfaz para asignar usuarios a roles
- Gestión de usuarios por rol
- Asignación múltiple de usuarios a roles
- Historial de cambios de asignación de roles
- Notificaciones cuando se cambia rol de usuario
- **Impacto**: Alto - Sin esto, los roles no se pueden usar. Es funcionalidad core.

**Páginas/flujo afectados**:
- `RolesPermissionsManager` (asignación de usuarios)
- Integración con módulo de equipo/RRHH
- Nuevo componente `UserRoleAssignment`

**Complejidad estimada**: Media (requiere integración con módulo de usuarios, asignación)

### 6. **Aplicación Real de Impuestos en Facturación**
**Necesidad detectada**: Los impuestos configurados no se aplican automáticamente en facturas.

**Propuesta de solución** (alto nivel + impacto):
- Aplicación automática de impuestos según configuración al crear facturas
- Cálculo automático de base imponible e impuesto
- Diferentes impuestos según tipo de servicio o cliente
- Exportación con impuestos correctos para contabilidad
- **Impacto**: Alto - Sin esto, la configuración de impuestos no tiene valor funcional.

**Páginas/flujo afectados**:
- Integración con módulo de facturación
- Nuevo servicio `TaxCalculationService`
- Aplicación automática en facturas

**Complejidad estimada**: Media (requiere integración con facturación, cálculo)

### 7. **Uso Real de Series de Facturación**
**Necesidad detectada**: Las series de facturación configuradas no se usan automáticamente al generar facturas.

**Propuesta de solución** (alto nivel + impacto):
- Asignación automática de números de factura según serie configurada
- Incremento automático de contadores
- Validación de formato de serie
- Diferentes series por sede (gimnasios)
- Historial de números usados
- **Impacto**: Alto - Sin esto, la configuración de series no tiene valor funcional.

**Páginas/flujo afectados**:
- Integración con módulo de facturación
- Nuevo servicio `InvoiceSeriesService`
- Asignación automática de números

**Complejidad estimada**: Media (requiere integración con facturación, generación de números)

### 8. **Sustitución Real de Variables en Plantillas**
**Necesidad detectada**: Las variables dinámicas en plantillas no se sustituyen automáticamente al enviar mensajes.

**Propuesta de solución** (alto nivel + impacto):
- Sistema de sustitución de variables cuando se usa plantilla
- Obtención de datos del cliente/negocio para sustituir variables
- Validación de que todas las variables tienen valor
- Manejo de variables faltantes (valor por defecto o error)
- Preview con datos de ejemplo antes de enviar
- **Impacto**: Alto - Sin esto, las plantillas no tienen valor funcional.

**Páginas/flujo afectados**:
- Integración con módulos de email/SMS
- Nuevo servicio `TemplateVariableService`
- Sistema de sustitución

**Complejidad estimada**: Media (requiere sustitución de texto, obtención de datos)

### 9. **Editor WYSIWYG para Políticas y Plantillas**
**Necesidad detectada**: Solo hay editor de texto plano/HTML. No hay editor visual para usuarios no técnicos.

**Propuesta de solución** (alto nivel + impacto):
- Editor WYSIWYG (What You See Is What You Get) para políticas y plantillas
- Toolbar con opciones de formato (negrita, cursiva, listas, enlaces)
- Inserción de imágenes y tablas
- Vista previa en tiempo real
- Modo de edición HTML para usuarios avanzados
- **Impacto**: Medio/Alto - Permite crear contenido más rico sin conocimientos de HTML.

**Páginas/flujo afectados**:
- `PolicyEditor` (editor WYSIWYG)
- `TemplateEditor` (editor WYSIWYG)
- Integración con librería de editor (TinyMCE, Quill, etc.)

**Complejidad estimada**: Media (requiere librería de editor, integración)

### 10. **Versionado y Auditoría de Cambios en Configuración**
**Necesidad detectada**: No hay historial de cambios en configuración crítica (servicios, impuestos, series).

**Propuesta de solución** (alto nivel + impacto):
- Historial de cambios en servicios, impuestos, series de facturación
- Auditoría de quién hizo qué cambio y cuándo
- Rollback a versiones anteriores
- Comparación de versiones (diff)
- Notificaciones cuando se cambian configuraciones críticas
- **Impacto**: Medio/Alto - Permite rastrear cambios y resolver problemas.

**Páginas/flujo afectados**:
- Nuevo servicio `ConfigurationAuditService`
- Sistema de versionado
- Componentes de historial en cada módulo

**Complejidad estimada**: Media (requiere sistema de auditoría, almacenamiento)

---

## 4) Hallazgos desde navegación/menús

### Sidebar.tsx

**Estructura de la sección**:
```typescript
{
  id: 'configuracion',
  title: 'Configuración',
  icon: Settings,
  items: [
    { id: 'general-del-centro-marca-personal', label: isEntrenador ? 'Marca Personal' : 'General del Centro', icon: Settings, path: '/settings/general-profile' },
    { id: 'servicios-tarifas', label: 'Servicios & Tarifas', icon: Tag, path: '/settings/services' },
    { id: 'politicas-terminos', label: 'Políticas & Términos', icon: ShieldCheck, path: '/settings/policies', gimnasioOnly: true },
    { id: 'plantillas-de-mensajes-y-contratos', label: 'Plantillas Mensajes', icon: FileText, path: '/settings/templates' },
    { id: 'roles-permisos', label: 'Roles & Permisos', icon: ShieldIcon, path: '/configuracion/roles-y-permisos', gimnasioOnly: true },
    { id: 'moneda-impuestos-series-de-factura', label: isEntrenador ? 'Configuración Fiscal' : 'Configuración Financiera', icon: Coins, path: '/settings/financials' },
  ],
}
```

**Permisos y visibilidad**:
- "Políticas & Términos" y "Roles & Permisos" son solo para gimnasios (`gimnasioOnly: true`)
- Las otras páginas son visibles para ambos roles, pero con labels diferentes según rol
- No hay badges o contadores de notificaciones

**Inconsistencias de UX o naming**:
1. **Naming inconsistente**:
   - "General del Centro" vs "Marca Personal" (label dinámico, bien diferenciado)
   - "Servicios & Tarifas" (español)
   - "Políticas & Términos" (español)
   - "Plantillas Mensajes" (incompleto, debería ser "Plantillas de Mensajes")
   - "Roles & Permisos" (español)
   - "Configuración Fiscal" vs "Configuración Financiera" (label dinámico)

2. **Rutas inconsistentes**:
   - `/settings/general-profile` (bajo settings)
   - `/settings/services` (bajo settings)
   - `/settings/policies` (bajo settings)
   - `/settings/templates` (bajo settings)
   - `/configuracion/roles-y-permisos` (bajo configuracion, español)
   - `/settings/financials` (bajo settings, inglés)
   - Mezcla de español/inglés y rutas diferentes

3. **Iconos inconsistentes**:
   - Settings para sección y "General del Centro" (duplicado)
   - Tag para "Servicios & Tarifas" (específico)
   - ShieldCheck para "Políticas & Términos" (específico)
   - FileText para "Plantillas Mensajes" (específico)
   - ShieldIcon para "Roles & Permisos" (específico)
   - Coins para "Configuración Financiera" (específico)
   - Falta coherencia en estilo de iconos

4. **Falta de conexión con otras secciones**:
   - "Servicios & Tarifas" podría estar relacionada con "Membresías & Planes"
   - "Plantillas Mensajes" podría estar relacionada con "Email & SMS"
   - "Configuración Financiera" podría estar relacionada con "Finanzas"
   - No hay conexión clara entre secciones relacionadas

5. **Falta de indicadores visuales**:
   - No hay badges de perfil incompleto
   - No hay alertas de configuración pendiente
   - No hay indicadores de cambios no guardados

**Sugerencias de mejora**:
- Estandarizar rutas (todas bajo `/settings/` o todas bajo `/configuracion/`)
- Estandarizar nombres (completar "Plantillas Mensajes" a "Plantillas de Mensajes")
- Añadir badges de notificaciones para perfil incompleto y configuraciones pendientes
- Conectar con otras secciones relacionadas
- Considerar agrupar mejor (ej: todo relacionado con facturación en una subsección)

---

## 5) KPIs y métricas recomendadas

### Métricas de adopción
- **Tasa de completitud de perfil**: % de usuarios con perfil >80% completo
  - Meta: >70% para ambos roles
- **Tasa de configuración de servicios**: % de usuarios que crean al menos un servicio
  - Meta: >90% para ambos roles
- **Tasa de uso de plantillas**: % de usuarios que crean al menos una plantilla
  - Meta: >60% para ambos roles
- **Tasa de configuración financiera**: % de usuarios que configuran moneda e impuestos
  - Meta: >80% para ambos roles
- **Tasa de uso de roles**: % de gimnasios que crean al menos un rol personalizado
  - Meta: >40% para gimnasios
- **Retención de configuración**: % de usuarios que mantienen configuración actualizada
  - Meta: >85% actualización mensual

### Tiempo de tarea
- **Tiempo para completar perfil**: Desde primera visita hasta perfil >80% completo
  - Meta: <15 minutos
- **Tiempo para crear servicio**: Desde abrir modal hasta guardar servicio
  - Meta: <5 minutos (servicio básico)
- **Tiempo para crear plantilla**: Desde abrir editor hasta guardar plantilla
  - Meta: <10 minutos (plantilla básica)
- **Tiempo para configurar roles**: Desde crear rol hasta asignar permisos
  - Meta: <10 minutos (rol básico)

### Conversión interna
- **Tasa de servicios activos**: % de servicios creados que están activos
  - Meta: >80%
- **Tasa de plantillas usadas**: % de plantillas creadas que se usan al menos una vez
  - Meta: >70%
- **Tasa de roles asignados**: % de roles creados que tienen al menos un usuario asignado
  - Meta: >60%
- **Tasa de configuración completa**: % de usuarios con todas las configuraciones básicas completadas
  - Meta: >70%

### Errores por flujo
- **Errores en guardado de perfil**: % de veces que falla el guardado
  - Meta: <2%
- **Errores en creación de servicios**: % de veces que falla la creación
  - Meta: <3%
- **Errores en guardado de plantillas**: % de veces que falla el guardado
  - Meta: <2%
- **Errores en configuración financiera**: % de veces que falla el guardado
  - Meta: <1%

### Latencia clave
- **Tiempo de guardado de perfil**: Desde guardar hasta confirmación
  - Meta: <2 segundos
- **Tiempo de carga de servicios**: Desde abrir página hasta mostrar servicios
  - Meta: <1 segundo
- **Tiempo de carga de plantillas**: Desde abrir página hasta mostrar plantillas
  - Meta: <1 segundo
- **Tiempo de cálculo de completitud**: Desde cambiar campo hasta actualizar porcentaje
  - Meta: <100ms (tiempo real)

---

## 6) Backlog priorizado (RICE/MoSCoW)

### MUST (top 3)

#### 1. Integración Real de Pagos (Stripe Connect)
- **RICE Score**:
  - Reach: 100% usuarios que intentan configurar pagos
  - Impact: 10/10 (sin esto, no se pueden procesar pagos)
  - Confidence: 8/10
  - Effort: 9/10 (complejo, requiere OAuth, webhooks)
  - **Score: 8.9**
- **Justificación**: Es funcionalidad core. Sin pagos reales, no se pueden procesar transacciones.
- **Esfuerzo estimado**: 10-12 semanas (2 desarrolladores + DevOps)

#### 2. Aplicación Real de Permisos en el Sistema
- **RICE Score**:
  - Reach: 100% roles creados
  - Impact: 10/10 (sin esto, roles no tienen valor)
  - Confidence: 8/10
  - Effort: 10/10 (muy complejo, requiere middleware, guards)
  - **Score: 8.0**
- **Justificación**: Sin aplicación real de permisos, el sistema de roles no tiene valor funcional.
- **Esfuerzo estimado**: 12-14 semanas (2-3 desarrolladores)

#### 3. Asignación de Usuarios a Roles
- **RICE Score**:
  - Reach: 100% roles creados
  - Impact: 10/10 (necesario para usar roles)
  - Confidence: 8/10
  - Effort: 6/10 (medio, requiere integración)
  - **Score: 13.3**
- **Justificación**: Sin asignación de usuarios, los roles no se pueden usar.
- **Esfuerzo estimado**: 5-6 semanas (1 desarrollador)

### SHOULD (top 3)

#### 4. Aplicación Real de Impuestos en Facturación
- **RICE Score**:
  - Reach: 100% facturas generadas
  - Impact: 10/10 (necesario para facturación correcta)
  - Confidence: 8/10
  - Effort: 7/10 (medio/alto, requiere integración)
  - **Score: 11.4**
- **Esfuerzo estimado**: 6-8 semanas

#### 5. Uso Real de Series de Facturación
- **RICE Score**:
  - Reach: 100% facturas generadas
  - Impact: 10/10 (necesario para numeración correcta)
  - Confidence: 8/10
  - Effort: 7/10 (medio/alto, requiere integración)
  - **Score: 11.4**
- **Esfuerzo estimado**: 6-8 semanas

#### 6. Sustitución Real de Variables en Plantillas
- **RICE Score**:
  - Reach: 100% plantillas usadas
  - Impact: 10/10 (necesario para que funcionen plantillas)
  - Confidence: 8/10
  - Effort: 6/10 (medio, requiere sustitución)
  - **Score: 13.3**
- **Esfuerzo estimado**: 5-6 semanas

### COULD (top 3)

#### 7. Sincronización de Horarios con Sistema de Reservas
- **RICE Score**:
  - Reach: 100% reservas creadas
  - Impact: 8/10 (evita reservas incorrectas)
  - Confidence: 8/10
  - Effort: 7/10 (medio/alto, requiere integración)
  - **Score: 9.1**
- **Esfuerzo estimado**: 6-7 semanas

#### 8. Editor WYSIWYG para Políticas y Plantillas
- **RICE Score**:
  - Reach: 100% usuarios que crean políticas/plantillas
  - Impact: 8/10 (mejora UX para usuarios no técnicos)
  - Confidence: 8/10
  - Effort: 6/10 (medio, requiere librería)
  - **Score: 10.7**
- **Esfuerzo estimado**: 5-6 semanas

#### 9. Validación de Datos y Cumplimiento Legal
- **RICE Score**:
  - Reach: 100% usuarios
  - Impact: 9/10 (evita problemas legales)
  - Confidence: 7/10 (requiere conocimiento legal)
  - Effort: 7/10 (medio/alto)
  - **Score: 9.0**
- **Esfuerzo estimado**: 6-8 semanas

---

## 7) Próximos pasos

### 3 acciones accionables para la próxima iteración

#### 1. **Implementar Sustitución Real de Variables en Plantillas (5 semanas)**
- **Acciones específicas**:
  - Sistema de sustitución de variables cuando se usa plantilla
  - Obtención de datos del cliente/negocio para sustituir variables
  - Validación de que todas las variables tienen valor
  - Manejo de variables faltantes (valor por defecto o placeholder)
  - Preview con datos de ejemplo en editor
  - Integración con módulos de email/SMS para usar plantillas
- **Responsables**: Backend developer (1) + Frontend developer (0.5)
- **Entregables**:
  - Sistema de sustitución de variables
  - Preview con datos de ejemplo
  - Integración con email/SMS

#### 2. **Implementar Asignación de Usuarios a Roles (5 semanas)**
- **Acciones específicas**:
  - Interfaz para asignar usuarios a roles
  - Lista de usuarios disponibles con búsqueda
  - Asignación múltiple de usuarios a roles
  - Visualización de usuarios por rol
  - Historial básico de cambios de asignación
  - Integración con módulo de equipo/RRHH para obtener usuarios
- **Responsables**: Frontend developer (1) + Backend developer (0.5)
- **Entregables**:
  - Interfaz de asignación de usuarios
  - Integración con módulo de usuarios
  - Historial básico

#### 3. **Implementar Aplicación Real de Impuestos en Facturación (7 semanas)**
- **Acciones específicas**:
  - Aplicación automática de impuestos según configuración al crear facturas
  - Cálculo automático de base imponible e impuesto
  - Diferentes impuestos según tipo de servicio
  - Visualización de impuestos en facturas
  - Integración con módulo de facturación
  - Validación de que impuesto existe antes de aplicar
- **Responsables**: Backend developer (1) + Frontend developer (0.5)
- **Entregables**:
  - Sistema de aplicación de impuestos
  - Integración con facturación
  - Cálculo automático

### Riesgos y supuestos

**Riesgos identificados**:
1. **Configuración incorrecta puede causar problemas legales**:
   - Mitigación: Validación de datos requeridos, alertas claras, documentación de requisitos legales
   - Impacto: Alto - afecta cumplimiento legal

2. **Cambios en configuración pueden afectar datos existentes**:
   - Mitigación: Validación antes de aplicar cambios, advertencias de impacto, rollback si es necesario
   - Impacto: Medio - afecta integridad de datos

3. **Permisos mal configurados pueden bloquear acceso necesario**:
   - Mitigación: Preview de permisos, testing de roles, siempre permitir acceso de admin
   - Impacto: Medio - afecta uso del sistema

4. **Variables faltantes en plantillas pueden causar mensajes incorrectos**:
   - Mitigación: Validación de variables, valores por defecto, preview antes de enviar
   - Impacto: Medio - afecta calidad de comunicación

**Supuestos**:
- Hay módulo de usuarios/equipo para asignar a roles
- Hay módulo de facturación para aplicar impuestos y series
- Hay módulos de email/SMS para usar plantillas
- Hay base de datos para almacenar configuración, roles, permisos, historial
- Los usuarios tienen conocimientos básicos de configuración (puede requerir educación)
- Hay acceso a servicios de validación legal (opcional, para validación avanzada)

**Dependencias externas**:
- Stripe Connect API (para integración de pagos)
- Servicios de validación de datos fiscales (opcional)
- Librerías de editor WYSIWYG (opcional, para editor avanzado)
- Base de datos para almacenamiento
- Sistema de auditoría para historial

---

> **Notas técnicas**: 
> - Todas las rutas son relativas desde la raíz del proyecto
> - Los componentes de General del Centro están en `src/features/general-del-centro-marca-personal/`
> - Los componentes de Servicios están en `src/features/servicios-tarifas/`
> - Los componentes de Políticas están en `src/features/politicas-terminos/`
> - Los componentes de Plantillas están en `src/features/plantillas-de-mensajes-y-contratos/`
> - Los componentes de Roles están en `src/features/roles-permisos/`
> - Los componentes de Configuración Financiera están en `src/features/moneda-impuestos-series-de-factura/`
> - Las APIs están en `src/features/[Feature]/api/`


















