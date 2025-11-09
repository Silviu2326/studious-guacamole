# Monetización & Ofertas — Diagnóstico funcional y de producto

## 1) Mapa de páginas de la sección

### Páginas principales

#### `/dashboard/monetizacion/ofertas` — Promociones, Cupones & Packs
- **Componente raíz**: `src/features/PromocionesCuponesYPacks/pages/PromocionesCuponesYPacksPage.tsx`
- **Componentes hijos**:
  - `OfferListTable` (`src/features/PromocionesCuponesYPacks/components/OfferListTable.tsx`)
  - `OfferFormModal` (`src/features/PromocionesCuponesYPacks/components/OfferFormModal.tsx`)
  - `OfferStatsDashboard` (`src/features/PromocionesCuponesYPacks/components/OfferStatsDashboard.tsx`)
- **API**: `src/features/PromocionesCuponesYPacks/api/offers.ts`
- **Estados**:
  - Loading: `isLoading` con `Loader2` spinner
  - Error: Card con `AlertCircle` y mensaje de error, botón de reintentar
  - Vacío: No hay estado vacío explícito (muestra tabla vacía)
- **Guardias**: No hay guardias de autenticación explícitas (depende de Layout)

#### `/dashboard/monetizacion/precios-dinamicos` — Dynamic Pricing & Ofertas Inteligentes
- **Componente raíz**: `src/features/DynamicPricingYOfertasInteligentes/pages/DynamicPricingYOfertasInteligentesPage.tsx`
- **Componentes hijos**:
  - `DynamicPricingDashboardContainer` (`src/features/DynamicPricingYOfertasInteligentes/components/DynamicPricingDashboardContainer.tsx`)
  - `RuleBuilderForm` (`src/features/DynamicPricingYOfertasInteligentes/components/RuleBuilderForm.tsx`)
  - `RuleListItem` (`src/features/DynamicPricingYOfertasInteligentes/components/RuleListItem.tsx`)
- **API**: `src/features/DynamicPricingYOfertasInteligentes/api/pricingRules.ts`
- **Estados**:
  - Loading: `isLoading` con spinner
  - Error: Manejo de errores con alerts
  - Vacío: Card con `Package` icon y mensaje "No hay reglas creadas todavía"
- **Guardias**: No hay guardias explícitas (depende de Layout)

#### `/dashboard/monetizacion/loyalty` — Loyalty Program Manager
- **Componente raíz**: `src/features/LoyaltyProgramManager/pages/LoyaltyProgramManagerPage.tsx`
- **Componentes hijos**:
  - `LoyaltyProgramDashboard` (`src/features/LoyaltyProgramManager/components/LoyaltyProgramDashboard.tsx`)
  - `RulesEngineConfigurator` (`src/features/LoyaltyProgramManager/components/RulesEngineConfigurator.tsx`)
  - `RewardsCatalogManager` (`src/features/LoyaltyProgramManager/components/RewardsCatalogManager.tsx`)
- **API**: `src/features/LoyaltyProgramManager/api/loyalty.ts`
- **Estados**:
  - Loading: Spinner con `animate-spin`
  - Error: Card con `AlertCircle` y mensaje de error
  - Vacío: No hay estados vacíos explícitos
- **Guardias**: No hay guardias explícitas (depende de Layout)

#### `/dashboard/marketing/referrals` — Referidos & Afiliados
- **Componente raíz**: `src/features/ReferidosYAfiliados/pages/ReferidosYAfiliadosPage.tsx`
- **Componentes hijos**:
  - `ShareableLink` (`src/features/ReferidosYAfiliados/components/ShareableLink.tsx`)
- **API**: `src/features/ReferidosYAfiliados/api/referrals.ts`
- **Estados**:
  - Loading: `isLoading` con `Loader2` spinner
  - Error: Card con `AlertCircle` y mensaje de error
  - Vacío: Estados vacíos para top referrers y top affiliates
- **Guardias**: Adapta vista según rol (entrenador vs cliente)
- **Nota**: Vista dual: administrador (entrenador) y cliente/afiliado

#### `/dashboard/monetizacion/referidos` — Referral Marketing
- **Componente raíz**: `src/features/MarketingDeReferidos/pages/MarketingDeReferidosPage.tsx`
- **Componentes hijos**:
  - `ReferralStatsDashboard` (`src/features/MarketingDeReferidos/components/ReferralStatsDashboard.tsx`)
  - `CampaignStatusCard` (`src/features/MarketingDeReferidos/components/CampaignStatusCard.tsx`)
  - `CampaignWizard` (`src/features/MarketingDeReferidos/components/CampaignWizard.tsx`)
- **API**: `src/features/MarketingDeReferidos/api/referrals.ts`
- **Estados**:
  - Loading: `isLoading` con `Loader2` spinner
  - Error: Card con `AlertCircle` y mensaje de error, botón de reintentar
  - Vacío: Card con `Package` icon y mensaje "No hay campañas"
- **Guardias**: No hay guardias explícitas (depende de Layout)

---

## 2) 10 problemas que hoy SÍ resuelve

### 1. **Creación y Gestión de Promociones, Cupones y Packs**
**Página(s)**: `/dashboard/monetizacion/ofertas` (Promociones, Cupones & Packs)

**Problema cubierto**: No hay forma de crear y gestionar promociones, cupones y packs de forma centralizada. Cada uno requiere gestión manual.

**Como lo resuelve el código**:
- `OfferFormModal` (`src/features/PromocionesCuponesYPacks/components/OfferFormModal.tsx`) permite crear/editar ofertas con múltiples tipos
- Soporta 3 tipos: `coupon` (cupón con código), `pack` (pack de servicios), `automatic` (aplicación automática)
- Tipos de descuento: porcentaje o cantidad fija
- Configuración de límites de uso, fechas de validez, servicios aplicables
- Validación de formulario (nombre obligatorio, código para cupones, valor > 0)

**Riesgos/limitaciones**:
- Creación/actualización es mock (no hay persistencia real)
- No hay verificación de códigos duplicados
- Falta preview de cómo se verá la oferta

### 2. **Dashboard de Estadísticas de Ofertas**
**Página(s)**: `/dashboard/monetizacion/ofertas` (Promociones, Cupones & Packs)

**Problema cubierto**: No hay forma de ver el impacto de las ofertas sin calcular métricas manualmente.

**Como lo resuelve el código**:
- `OfferStatsDashboard` (`src/features/PromocionesCuponesYPacks/components/OfferStatsDashboard.tsx`) calcula métricas agregadas
- Muestra: Tasa de Redención, Ingresos Totales, Nuevos Clientes Adquiridos
- Top 5 ofertas más utilizadas con uso y revenue
- Comparación de valor promedio de compra con/sin descuento
- `getOfferStats` API proporciona datos agregados

**Riesgos/limitaciones**:
- Estadísticas son mock (no hay datos reales de uso)
- No hay comparación entre períodos
- Falta segmentación por tipo de oferta

### 3. **Filtrado de Ofertas por Estado y Tipo**
**Página(s)**: `/dashboard/monetizacion/ofertas` (Promociones, Cupones & Packs)

**Problema cubierto**: No hay forma de encontrar ofertas específicas cuando hay muchas.

**Como lo resuelve el código**:
- Filtros por estado (Activas, Inactivas, Expiradas, Programadas) y tipo (Cupones, Packs, Automáticas)
- `filterStatus` y `filterType` controlan filtrado dinámico
- `getOffers` API acepta filtros opcionales
- Filtros combinables (múltiples criterios simultáneos)

**Riesgos/limitaciones**:
- No hay búsqueda por texto o nombre
- No hay filtros por fecha o rango de fechas
- Falta guardar filtros como favoritos

### 4. **Sistema de Reglas de Precios Dinámicos con Múltiples Condiciones**
**Página(s)**: `/dashboard/monetizacion/precios-dinamicos` (Dynamic Pricing & Ofertas Inteligentes)

**Problema cubierto**: No hay forma de automatizar ajustes de precios según condiciones como horario, temporada, inactividad del cliente, etc.

**Como lo resuelve el código**:
- `RuleBuilderForm` (`src/features/DynamicPricingYOfertasInteligentes/components/RuleBuilderForm.tsx`) permite crear reglas complejas
- Soporta múltiples tipos de condiciones: `time_of_day`, `day_of_week`, `client_inactivity`, `seasonal`, `demand_level`, `client_loyalty`, `service_type`
- Múltiples condiciones combinables con AND/OR
- Acciones: descuento porcentual, descuento fijo, precio fijo, aumento porcentual
- Sistema de prioridades para resolver conflictos entre reglas

**Riesgos/limitaciones**:
- Reglas son mock (no hay motor de evaluación real)
- No hay simulación de precios antes de aplicar regla
- Falta validación de conflictos entre reglas

### 5. **Gestión de Estado y Prioridades de Reglas de Precios Dinámicos**
**Página(s)**: `/dashboard/monetizacion/precios-dinamicos` (Dynamic Pricing & Ofertas Inteligentes)

**Problema cubierto**: No hay forma de activar/desactivar reglas o gestionar qué regla se aplica primero cuando hay conflictos.

**Como lo resuelve el código**:
- `DynamicPricingDashboardContainer` permite activar/desactivar reglas con `toggleRule`
- `RuleListItem` muestra estado de cada regla
- Sistema de prioridades (menor número = mayor prioridad)
- Estadísticas por regla: ofertas generadas, conversiones, revenue adicional

**Riesgos/limitaciones**:
- Cambio de estado es mock (no afecta aplicación real)
- No hay validación de que la prioridad no cause conflictos
- Falta ordenamiento automático por prioridad

### 6. **Programa de Fidelización con Sistema de Puntos y Recompensas**
**Página(s)**: `/dashboard/monetizacion/loyalty` (Loyalty Program Manager)

**Problema cubierto**: No hay forma de crear un programa de fidelización estructurado con puntos y recompensas.

**Como lo resuelve el código**:
- `LoyaltyProgramDashboard` muestra programa completo con reglas, recompensas y estadísticas
- `RulesEngineConfigurator` permite configurar reglas de acumulación de puntos (asistencia, referidos, reviews, milestones, cumpleaños, compras)
- `RewardsCatalogManager` permite gestionar catálogo de recompensas (físicas, servicios, digitales, descuentos)
- Sistema de tiers (Bronce, Plata, Oro) con multiplicadores de puntos
- Activar/desactivar programa completo

**Riesgos/limitaciones**:
- Programa es mock (no hay acumulación real de puntos)
- No hay validación de que el cliente tenga suficientes puntos para canjear
- Falta historial de puntos ganados/canjeados

### 7. **Configuración de Reglas de Acumulación de Puntos Editables**
**Página(s)**: `/dashboard/monetizacion/loyalty` (Loyalty Program Manager)

**Problema cubierto**: No hay forma de ajustar cuántos puntos se ganan por cada acción sin editar código.

**Como lo resuelve el código**:
- `RulesEngineConfigurator` permite editar puntos de cada regla inline
- Edición inline con botones de guardar/cancelar
- Activar/desactivar reglas individuales sin eliminar
- Iconos visuales por tipo de acción para mejor UX

**Riesgos/limitaciones**:
- Actualización es mock (no hay persistencia real)
- No hay validación de rangos de puntos (mínimo/máximo)
- Falta preview de impacto al cambiar puntos

### 8. **Creación de Campañas de Referidos con Wizard Guiado**
**Página(s)**: `/dashboard/monetizacion/referidos` (Referral Marketing)

**Problema cubierto**: Crear campañas de referidos requiere múltiples pasos y configuración manual compleja.

**Como lo resuelve el código**:
- `CampaignWizard` (`src/features/MarketingDeReferidos/components/CampaignWizard.tsx`) es un wizard de 3 pasos
- Paso 1: Configuración básica (nombre, fechas)
- Paso 2: Recompensas (referente y referido) con múltiples tipos: sesiones gratis, descuento porcentual, descuento fijo, acceso a contenido
- Paso 3: Términos y condiciones
- Validación en cada paso (`isStepValid`)
- Navegación entre pasos con botones Anterior/Siguiente

**Riesgos/limitaciones**:
- Wizard es mock (no crea campañas reales)
- No hay plantillas predefinidas de campañas
- Falta preview de cómo se verá la campaña

### 9. **Dashboard de Métricas de Referidos con Top Performers**
**Página(s)**: `/dashboard/marketing/referrals` (Referidos & Afiliados)

**Problema cubierto**: No hay forma de ver quiénes son los mejores referentes y afiliados sin análisis manual.

**Como lo resuelve el código**:
- `ReferidosYAfiliadosPage` muestra métricas agregadas: Total Conversiones, Ingresos Generados, Tasa de Conversión, CAC del Programa, Tasa de Participación
- Top Clientes Referentes con ranking y conversiones
- Top Afiliados con conversiones y revenue generado
- `getReferralOverview` API proporciona datos agregados
- Vista adaptada según rol (entrenador vs cliente)

**Riesgos/limitaciones**:
- Métricas son mock (no hay datos reales)
- No hay comparación entre períodos
- Falta detalle de cada referente/afiliado

### 10. **Gestión de Estado de Campañas de Referidos (Activar, Pausar, Archivar)**
**Página(s)**: `/dashboard/monetizacion/referidos` (Referral Marketing)

**Problema cubierto**: No hay forma de gestionar el ciclo de vida de campañas de referidos (activar, pausar, archivar).

**Como lo resuelve el código**:
- `CampaignStatusCard` muestra estado de cada campaña con acciones
- `handleToggleStatus` permite cambiar entre activo/pausado
- Filtros por estado (Todas, Activas, Pausadas, Archivadas) con contadores
- `updateReferralCampaign` API actualiza estado
- Estados visibles: `active`, `paused`, `archived`

**Riesgos/limitaciones**:
- Cambio de estado es mock (no afecta funcionalidad real)
- No hay confirmación antes de pausar/archivar
- Falta notificación cuando campaña expira automáticamente

---

## 3) 10 problemas que AÚN NO resuelve (y debería)

### 1. **Aplicación Real de Precios Dinámicos en Checkout y Facturación**
**Necesidad detectada**: Reglas de precios dinámicos son mock. No hay forma real de que los precios se ajusten automáticamente en el checkout.

**Propuesta de solución** (alto nivel + impacto):
- Motor de evaluación de reglas en tiempo real durante checkout
- Integración con módulo de facturación para aplicar descuentos automáticamente
- Cache de reglas activas para performance
- Validación de condiciones antes de aplicar descuento
- **Impacto**: Alto - Sin esto, las reglas no tienen valor práctico. Es la funcionalidad core.

**Páginas/flujo afectados**:
- `DynamicPricingDashboardContainer` (motor de evaluación)
- Integración con módulo de checkout/facturación
- Nuevo servicio `PricingEngine`

**Complejidad estimada**: Alta (requiere motor de reglas, integración cross-module, cache)

### 2. **Validación y Aplicación Real de Cupones en Checkout**
**Necesidad detectada**: Cupones son mock. No hay forma real de validar y aplicar cupones en el checkout.

**Propuesta de solución** (alto nivel + impacto):
- Validación de cupones en tiempo real (código válido, no expirado, dentro de límite de uso)
- Aplicación automática de descuentos en checkout
- Verificación de que el cupón aplica a los servicios seleccionados
- Tracking de uso de cupones por cliente
- **Impacto**: Alto - Sin esto, los cupones no funcionan. Es funcionalidad core.

**Páginas/flujo afectados**:
- Integración con módulo de checkout
- Nuevo servicio `CouponValidator`
- Modificar `OfferFormModal` para validación de códigos únicos

**Complejidad estimada**: Media/Alta (requiere validación, tracking, integración cross-module)

### 3. **Sistema de Acumulación y Canje Real de Puntos de Fidelización**
**Necesidad detectada**: Programa de fidelización es mock. No hay forma real de acumular puntos cuando los clientes realizan acciones.

**Propuesta de solución** (alto nivel + impacto):
- Event listeners para acciones que generan puntos (asistencia, referidos, reviews, compras)
- Base de datos de puntos por cliente con historial
- Validación de puntos suficientes antes de canjear recompensa
- Aplicación automática de recompensas canjeadas
- **Impacto**: Alto - Sin esto, el programa de fidelización no funciona. Es funcionalidad core.

**Páginas/flujo afectados**:
- `LoyaltyProgramDashboard` (acumulación real)
- Integración con módulos de asistencia, referidos, reviews, compras
- Nuevo servicio `PointsAccumulationService`

**Complejidad estimada**: Alta (requiere event system, integración cross-module, tracking)

### 4. **Generación Automática de Enlaces de Referidos y Tracking de Conversiones**
**Necesidad detectada**: No hay forma real de generar enlaces de referidos únicos y trackear cuando alguien hace clic y se convierte.

**Propuesta de solución** (alto nivel + impacto):
- Generación de enlaces únicos con códigos de tracking
- Sistema de tracking de clics y conversiones
- Atribución de conversión al referente correcto
- Dashboard de analytics en tiempo real
- **Impacto**: Alto - Sin esto, no hay tracking funcional de referidos.

**Páginas/flujo afectados**:
- `ReferidosYAfiliadosPage` (generación de enlaces)
- `MarketingDeReferidosPage` (tracking de conversiones)
- Nuevo servicio `ReferralTrackingService`
- Integración con módulo de checkout para atribución

**Complejidad estimada**: Alta (requiere tracking, atribución, analytics en tiempo real)

### 5. **Aplicación Automática de Ofertas y Descuentos en Checkout**
**Necesidad detectada**: Ofertas automáticas no se aplican realmente. No hay forma de que descuentos se apliquen automáticamente sin que el cliente use un código.

**Propuesta de solución** (alto nivel + impacto):
- Motor de evaluación de ofertas automáticas durante checkout
- Aplicación automática de descuentos basada en condiciones (primer cliente, compra mínima, etc.)
- Visualización de descuentos aplicados antes de pagar
- Validación de elegibilidad del cliente
- **Impacto**: Alto - Mejora experiencia de usuario y aumenta conversión.

**Páginas/flujo afectados**:
- Integración con módulo de checkout
- `OfferFormModal` (añadir lógica de aplicación automática)
- Nuevo servicio `AutoOfferEngine`

**Complejidad estimada**: Media/Alta (requiere motor de reglas, integración cross-module)

### 6. **Sistema de Niveles/Tiers de Fidelización con Beneficios Automáticos**
**Necesidad detectada**: Tiers existen en configuración pero no hay aplicación automática de beneficios cuando un cliente sube de nivel.

**Propuesta de solución** (alto nivel + impacto):
- Cálculo automático de tier basado en puntos acumulados
- Aplicación automática de multiplicadores de puntos según tier
- Beneficios automáticos por tier (descuentos adicionales, acceso premium)
- Notificaciones cuando cliente sube de tier
- **Impacto**: Medio/Alto - Mejora engagement y retención.

**Páginas/flujo afectados**:
- `LoyaltyProgramDashboard` (cálculo de tiers)
- Integración con módulo de notificaciones
- Nuevo servicio `TierCalculationService`

**Complejidad estimada**: Media (requiere cálculo automático, integración con notificaciones)

### 7. **Simulación de Precios Dinámicos Antes de Aplicar Regla**
**Necesidad detectada**: No hay forma de ver cómo afectará una regla de precios dinámicos antes de activarla.

**Propuesta de solución** (alto nivel + impacto):
- Simulador de precios con contexto (cliente, servicio, fecha, hora)
- Preview de precio original vs precio final
- Cálculo de impacto en revenue
- Validación de que la regla no cause pérdidas
- **Impacto**: Medio - Permite validar reglas antes de activarlas y evitar errores costosos.

**Páginas/flujo afectados**:
- `RuleBuilderForm` (añadir simulador)
- Nuevo componente `PriceSimulator`
- Modificar `pricingRules` API para incluir simulación

**Complejidad estimada**: Media (requiere motor de evaluación, UI de simulación)

### 8. **Reportes y Exportación de Datos de Monetización**
**Necesidad detectada**: No hay forma de exportar datos de ofertas, cupones, referidos o programa de fidelización para análisis externo.

**Propuesta de solución** (alto nivel + impacto):
- Exportación a Excel/CSV de ofertas con métricas
- Exportación de datos de referidos y afiliados
- Reportes PDF de programa de fidelización
- Reportes programados (resumen mensual por email)
- **Impacto**: Medio - Necesario para análisis avanzado y reportes gerenciales.

**Páginas/flujo afectados**:
- Todas las páginas de la sección (añadir botones de exportar)
- Nuevo componente `ReportGenerator`
- Nuevo servicio `ExportService`

**Complejidad estimada**: Baja/Media (requiere generación de archivos y templates)

### 9. **Alertas y Notificaciones de Ofertas y Cupones**
**Necesidad detectada**: No hay alertas cuando una oferta está por expirar, cuando un cupón alcanza su límite de uso, o cuando hay oportunidades de optimización.

**Propuesta de solución** (alto nivel + impacto):
- Alertas cuando oferta está por expirar (X días antes)
- Notificaciones cuando cupón alcanza 80% de uso límite
- Sugerencias de crear nuevas ofertas basadas en comportamiento
- Alertas de reglas de precios que no generan conversiones
- **Impacto**: Medio - Permite actuar proactivamente y optimizar estrategia.

**Páginas/flujo afectados**:
- Todas las páginas (añadir sistema de alertas)
- Nuevo componente `AlertsManager`
- Integración con sistema de notificaciones

**Complejidad estimada**: Media (requiere sistema de alertas y notificaciones)

### 10. **Integración de Programas de Referidos con Programas de Fidelización**
**Necesidad detectada**: No hay conexión entre programa de referidos y programa de fidelización. Referir a alguien debería dar puntos de fidelización también.

**Propuesta de solución** (alto nivel + impacto):
- Puntos de fidelización automáticos cuando se refiere a alguien
- Puntos adicionales cuando el referido se convierte
- Configuración de puntos por tipo de acción de referido
- Dashboard unificado mostrando relación entre referidos y fidelización
- **Impacto**: Medio/Alto - Mejora engagement y conecta dos programas de monetización.

**Páginas/flujo afectados**:
- `MarketingDeReferidosPage` (integración con puntos)
- `LoyaltyProgramDashboard` (mostrar puntos de referidos)
- Integración cross-module entre referidos y fidelización

**Complejidad estimada**: Media (requiere integración cross-module y sincronización)

---

## 4) Hallazgos desde navegación/menús

### Sidebar.tsx

**Estructura de la sección**:
```typescript
{
  id: 'monetizacion-ofertas',
  title: 'Monetización & Ofertas',
  icon: DollarIcon,
  items: [
    { id: 'promociones-cupones-packs', label: 'Promociones, Cupones & Packs', icon: Tag, path: '/dashboard/monetizacion/ofertas' },
    { id: 'dynamic-pricing-ofertas-inteligentes', label: 'Dynamic Pricing & Ofertas Inteligentes', icon: Sparkles, path: '/dashboard/monetizacion/precios-dinamicos' },
    { id: 'loyalty-program-manager', label: 'Loyalty Program Manager', icon: Gift, path: '/dashboard/monetizacion/loyalty' },
    { id: 'referidos-afiliados', label: 'Referidos & Afiliados', icon: Users, path: '/dashboard/marketing/referrals' },
    { id: 'marketing-de-referidos', label: 'Referral Marketing', icon: UserCheck, path: '/dashboard/monetizacion/referidos' },
  ],
}
```

**Permisos y visibilidad**:
- Todos los items son visibles para ambos roles (entrenador y gimnasio)
- No hay restricciones `entrenadorOnly` o `gimnasioOnly`
- No hay badges o contadores de notificaciones

**Inconsistencias de UX o naming**:
1. **Duplicación funcional**:
   - "Referidos & Afiliados" (`/dashboard/marketing/referrals`) y "Referral Marketing" (`/dashboard/monetizacion/referidos`) tienen funcionalidad similar
   - Ambos gestionan programas de referidos pero desde diferentes perspectivas
   - Hay confusión sobre cuál usar para qué propósito

2. **Naming inconsistente**:
   - "Dynamic Pricing & Ofertas Inteligentes" (inglés)
   - "Loyalty Program Manager" (inglés)
   - "Referral Marketing" (inglés)
   - "Promociones, Cupones & Packs" (español)
   - Mezcla de idiomas en una misma sección

3. **Rutas inconsistentes**:
   - `/dashboard/monetizacion/ofertas` (monetizacion)
   - `/dashboard/monetizacion/precios-dinamicos` (monetizacion)
   - `/dashboard/monetizacion/loyalty` (monetizacion)
   - `/dashboard/monetizacion/referidos` (monetizacion)
   - `/dashboard/marketing/referrals` (marketing) - **Inconsistencia**: un item está bajo `/marketing/` en lugar de `/monetizacion/`

4. **Falta de relación con otras secciones**:
   - "Afiliados & Referidos" está en sección "Marketing & Crecimiento" pero es similar a "Referidos & Afiliados" y "Referral Marketing"
   - Hay triple duplicación funcional potencial

5. **Falta de indicadores visuales**:
   - No hay badges de ofertas que expiran pronto
   - No hay indicadores de cupones con poco uso restante
   - No hay alertas de reglas de precios que no generan conversiones
   - No hay notificaciones de nuevos referidos

**Sugerencias de mejora**:
- Consolidar o diferenciar claramente los 3 módulos de referidos
- Estandarizar nombres en español o inglés
- Unificar rutas bajo `/dashboard/monetizacion/` o `/dashboard/marketing/`
- Añadir badges de notificaciones para ofertas/cupones que requieren atención
- Clarificar propósito de cada módulo de referidos en documentación

---

## 5) KPIs y métricas recomendadas

### Métricas de adopción
- **Tasa de adopción por herramienta**: % de usuarios que usan cada herramienta al menos una vez al mes
  - Meta: >70% para Promociones/Cupones, >50% para Dynamic Pricing, >60% para Loyalty, >40% para Referidos
- **Frecuencia de uso**: Número promedio de sesiones por usuario por semana
  - Meta: >1 sesión/semana para usuarios activos
- **Retención de usuarios**: % de usuarios que vuelven después del primer uso
  - Meta: >75% retención a 30 días

### Tiempo de tarea
- **Tiempo para crear una oferta**: Desde "Nueva Oferta" hasta guardar
  - Meta: <3 minutos (oferta básica)
- **Tiempo para crear una regla de precios dinámicos**: Desde "Nueva Regla" hasta completar formulario
  - Meta: <5 minutos (regla básica)
- **Tiempo para crear una campaña de referidos**: Desde "Nueva Campaña" hasta completar wizard
  - Meta: <4 minutos (campaña básica)
- **Tiempo para entender métricas**: Desde abrir dashboard hasta entender insights
  - Meta: <30 segundos (vista de dashboard)

### Conversión interna
- **Tasa de uso de ofertas**: % de ofertas creadas que se usan al menos una vez
  - Meta: >60%
- **Tasa de reglas activas**: % de reglas creadas que están activas
  - Meta: >70%
- **Tasa de participación en fidelización**: % de clientes que participan en programa de fidelización
  - Meta: >50%
- **Tasa de conversión de referidos**: % de referidos que se convierten en clientes
  - Meta: >25%

### Errores por flujo
- **Errores en creación de ofertas**: % de intentos de crear oferta que fallan
  - Meta: <2%
- **Errores en aplicación de cupones**: % de intentos de usar cupón que fallan
  - Meta: <1%
- **Errores en creación de reglas**: % de intentos de crear regla que fallan por validación
  - Meta: <3%
- **Errores en canje de recompensas**: % de intentos de canjear recompensa que fallan
  - Meta: <1%

### Latencia clave
- **Tiempo de carga de ofertas**: Desde abrir página hasta mostrar ofertas
  - Meta: <1 segundo
- **Tiempo de validación de cupón**: Desde ingresar código hasta validar
  - Meta: <500ms (en tiempo real)
- **Tiempo de evaluación de reglas de precios**: Desde calcular precio hasta mostrar
  - Meta: <200ms (en tiempo real)
- **Tiempo de canje de recompensa**: Desde seleccionar recompensa hasta confirmar
  - Meta: <1 segundo

---

## 6) Backlog priorizado (RICE/MoSCoW)

### MUST (top 3)

#### 1. Aplicación Real de Precios Dinámicos en Checkout
- **RICE Score**: 
  - Reach: 100% usuarios que usan precios dinámicos
  - Impact: 10/10 (sin esto, las reglas no funcionan)
  - Confidence: 8/10 (tecnología conocida)
  - Effort: 9/10 (muy complejo)
  - **Score: 8.9**
- **Justificación**: Es la funcionalidad core. Sin aplicación real, las reglas no tienen valor.
- **Esfuerzo estimado**: 8-10 semanas (1-2 desarrolladores full-time)

#### 2. Validación y Aplicación Real de Cupones en Checkout
- **RICE Score**:
  - Reach: 100% usuarios que usan cupones
  - Impact: 10/10 (sin esto, los cupones no funcionan)
  - Confidence: 9/10 (lógica conocida)
  - Effort: 6/10 (requiere integración pero no muy complejo)
  - **Score: 15.0**
- **Justificación**: Sin validación y aplicación real, los cupones no tienen valor funcional.
- **Esfuerzo estimado**: 4-5 semanas (1 desarrollador)

#### 3. Sistema de Acumulación y Canje Real de Puntos de Fidelización
- **RICE Score**:
  - Reach: 100% usuarios que usan programa de fidelización
  - Impact: 10/10 (sin esto, el programa no funciona)
  - Confidence: 8/10 (requiere integración cross-module)
  - Effort: 8/10 (complejo)
  - **Score: 10.0**
- **Justificación**: Es la funcionalidad core. Sin acumulación real, el programa no tiene valor.
- **Esfuerzo estimado**: 6-8 semanas (1-2 desarrolladores)

### SHOULD (top 3)

#### 4. Generación Automática de Enlaces de Referidos y Tracking
- **RICE Score**:
  - Reach: 100% usuarios que usan referidos
  - Impact: 9/10 (necesario para tracking funcional)
  - Confidence: 8/10
  - Effort: 7/10 (requiere tracking y atribución)
  - **Score: 10.3**
- **Esfuerzo estimado**: 5-6 semanas

#### 5. Aplicación Automática de Ofertas en Checkout
- **RICE Score**:
  - Reach: 100% usuarios que usan ofertas automáticas
  - Impact: 9/10 (mejora experiencia y conversión)
  - Confidence: 8/10
  - Effort: 6/10 (requiere motor de reglas)
  - **Score: 12.0**
- **Esfuerzo estimado**: 4-5 semanas

#### 6. Simulación de Precios Dinámicos
- **RICE Score**:
  - Reach: 80% usuarios (solo quienes crean reglas)
  - Impact: 8/10 (permite validar antes de activar)
  - Confidence: 8/10
  - Effort: 5/10 (requiere motor de evaluación)
  - **Score: 12.8**
- **Esfuerzo estimado**: 3-4 semanas

### COULD (top 3)

#### 7. Sistema de Niveles/Tiers con Beneficios Automáticos
- **RICE Score**:
  - Reach: 100% usuarios con programa de fidelización
  - Impact: 8/10 (mejora engagement)
  - Confidence: 8/10
  - Effort: 6/10 (requiere cálculo automático)
  - **Score: 10.7**
- **Esfuerzo estimado**: 4-5 semanas

#### 8. Integración de Referidos con Fidelización
- **RICE Score**:
  - Reach: 80% usuarios (solo quienes usan ambos)
  - Impact: 8/10 (mejora engagement)
  - Confidence: 7/10 (requiere integración cross-module)
  - Effort: 5/10
  - **Score: 11.2**
- **Esfuerzo estimado**: 3-4 semanas

#### 9. Alertas y Notificaciones
- **RICE Score**:
  - Reach: 100% usuarios
  - Impact: 7/10 (permite actuar proactivamente)
  - Confidence: 8/10
  - Effort: 5/10 (requiere sistema de notificaciones)
  - **Score: 11.2**
- **Esfuerzo estimado**: 3-4 semanas

---

## 7) Próximos pasos

### 3 acciones accionables para la próxima iteración

#### 1. **Implementar Motor de Evaluación de Reglas de Precios Dinámicos (8 semanas)**
- **Acciones específicas**:
  - Crear `PricingEngine` service que evalúe reglas en tiempo real
  - Integrar con módulo de checkout para aplicar descuentos automáticamente
  - Implementar cache de reglas activas para performance
  - Validación de condiciones antes de aplicar descuento
  - Sistema de resolución de conflictos cuando múltiples reglas aplican
  - Testing exhaustivo de edge cases
- **Responsables**: Backend developer (1) + Frontend developer (0.5)
- **Entregables**: 
  - Motor de evaluación funcional
  - Integración con checkout
  - Aplicación automática de descuentos

#### 2. **Implementar Validación y Aplicación Real de Cupones (4 semanas)**
- **Acciones específicas**:
  - Crear `CouponValidator` service para validar cupones en tiempo real
  - Validación de código único, no expirado, dentro de límite de uso
  - Verificación de que el cupón aplica a servicios seleccionados
  - Aplicación automática de descuentos en checkout
  - Tracking de uso de cupones por cliente y servicio
  - Integración con módulo de checkout
- **Responsables**: Backend developer (0.5) + Frontend developer (1)
- **Entregables**:
  - Validación funcional de cupones
  - Aplicación automática en checkout
  - Tracking de uso

#### 3. **Implementar Sistema de Acumulación Real de Puntos (6 semanas)**
- **Acciones específicas**:
  - Crear `PointsAccumulationService` que escuche eventos de acciones
  - Integrar con módulos de asistencia, referidos, reviews, compras
  - Base de datos de puntos por cliente con historial
  - Validación de puntos suficientes antes de canjear recompensa
  - Aplicación automática de recompensas canjeadas
  - Notificaciones cuando se ganan/canjean puntos
- **Responsables**: Backend developer (1) + Frontend developer (0.5)
- **Entregables**:
  - Acumulación automática de puntos
  - Canje funcional de recompensas
  - Historial de puntos

### Riesgos y supuestos

**Riesgos identificados**:
1. **Conflictos entre reglas de precios dinámicos pueden causar pérdidas**:
   - Mitigación: Validación de reglas antes de activar, simulador de precios, límites mínimos de precio
   - Impacto: Alto si ocurre

2. **Cupones pueden ser usados múltiples veces si no hay tracking robusto**:
   - Mitigación: Tracking por cliente y código, validación en tiempo real, límites estrictos
   - Impacto: Medio - afecta revenue

3. **Acumulación de puntos puede tener errores si eventos no se registran correctamente**:
   - Mitigación: Sistema de eventos robusto, logging completo, reconciliación periódica
   - Impacto: Medio - afecta confianza en programa

4. **Integración cross-module puede ser compleja y propensa a errores**:
   - Mitigación: Abstracciones claras, testing exhaustivo, documentación de APIs
   - Impacto: Alto - afecta todas las funcionalidades

**Supuestos**:
- Hay módulo de checkout funcional para integrar cupones y precios dinámicos
- Hay sistema de eventos para tracking de acciones que generan puntos
- Los clientes tienen identificadores únicos para tracking
- Hay base de datos para persistir ofertas, cupones, reglas, puntos

**Dependencias externas**:
- Módulo de checkout para aplicar descuentos
- Módulo de facturación para aplicar precios dinámicos
- Sistema de eventos para acumulación de puntos
- Sistema de notificaciones para alertas
- Base de datos para persistencia

---

> **Notas técnicas**: 
> - Todas las rutas son relativas desde la raíz del proyecto
> - Los componentes están en `src/features/[feature-name]/`
> - Las APIs están en `src/features/[feature-name]/api/`
> - Los tipos TypeScript están en `src/features/[feature-name]/types/`









