# Segmentación & Automatización — Diagnóstico funcional y de producto

## 1) Mapa de páginas de la sección

### Páginas principales

#### `/dashboard/audiencias` — Segmentación Dinámica & Audiencias
- **Componente raíz**: `src/features/SegmentacionDinamicaYAudiencias/pages/SegmentacionDinamicaYAudienciasPage.tsx`
- **Componentes hijos**:
  - `AudienceCard` (`src/features/SegmentacionDinamicaYAudiencias/components/AudienceCard.tsx`)
  - `MetricCards` (reutilizable)
- **API**: `src/features/SegmentacionDinamicaYAudiencias/api/audiences.ts`
- **Estados**:
  - Loading: `isLoading` con `Loader2` spinner
  - Error: banner rojo con `AlertCircle`
  - Vacío: card con `Package` icon y CTA para crear primera audiencia
- **Guardias**: No hay guardias de autenticación explícitas en el componente (depende de Layout)

#### `/dashboard/automatizacion/secuencias-email` — Lifecycle Email Sequences
- **Componente raíz**: `src/features/LifecycleEmailSequences/pages/LifecycleEmailSequencesPage.tsx`
- **Componentes hijos**:
  - `SequenceListContainer` (`src/features/LifecycleEmailSequences/components/SequenceListContainer.tsx`)
  - `SequenceCard` (`src/features/LifecycleEmailSequences/components/SequenceCard.tsx`)
- **API**: `src/features/LifecycleEmailSequences/api/sequences.ts`
- **Estados**:
  - Loading: `Loader2` spinner
  - Error: card con `AlertCircle` y botón de reintento
  - Vacío: card con `Mail` icon y CTA para crear primera secuencia
- **Guardias**: No hay guardias de autenticación explícitas

### Páginas relacionadas (funcionalidad extendida)

#### `/listas-inteligentes-segmentos-guardados` — Listas Inteligentes & Segmentos Guardados
- **Componente raíz**: `src/features/listas-inteligentes-segmentos-guardados/pages/listas-inteligentes-segmentos-guardadosPage.tsx`
- **Tabs**:
  1. **Segmentos** (`SegmentationEngine`)
  2. **Listas Inteligentes** (`SmartListsManager`)
  3. **Constructor** (`SegmentBuilder`)
  4. **Análisis Comportamiento** (`BehaviorAnalyzer`)
  5. **Segmentación Predictiva** (`PredictiveSegmentation`)
  6. **Analytics** (`SegmentAnalytics`)
  7. **Automatización** (`AutomationRules`)
  8. **Comparación** (`SegmentComparison`)
- **Estados**: Loading, error, vacío manejados por cada componente hijo
- **Guardias**: Solo visible para gimnasios (`gimnasioOnly: true` en Sidebar)

### Relaciones padre/hijo

```
Segmentación & Automatización (Sidebar Section)
├── Segmentación Dinámica & Audiencias (/dashboard/audiencias)
│   └── AudienceCard (hijo)
│   └── MetricCards (métricas)
│   └── API: audiences.ts
├── Lifecycle Email Sequences (/dashboard/automatizacion/secuencias-email)
│   └── SequenceListContainer (hijo)
│       └── SequenceCard (nieto)
│   └── API: sequences.ts
└── Listas Inteligentes (relacionada, /listas-inteligentes-segmentos-guardados)
    ├── SegmentationEngine
    ├── SmartListsManager
    ├── SegmentBuilder
    ├── BehaviorAnalyzer
    ├── PredictiveSegmentation
    ├── SegmentAnalytics
    ├── AutomationRules
    └── SegmentComparison
```

---

## 2) 10 problemas que hoy SÍ resuelve

### 1. **Creación y gestión de audiencias dinámicas con reglas configurables**
**Problema cubierto**: No hay forma de crear grupos de clientes basados en criterios específicos para personalizar marketing y comunicación.

**Página(s)**: `/dashboard/audiencias` (`SegmentacionDinamicaYAudienciasPage.tsx`)

**Como lo resuelve el código**:
- API `getAudiences()`, `createAudience()`, `updateAudience()`, `deleteAudience()` en `src/features/SegmentacionDinamicaYAudiencias/api/audiences.ts`
- Interfaz `Audience` con `rules` que contiene `operator` (AND/OR) y array de `rules` con `field`, `operator`, `value`
- `AudienceCard` muestra preview de reglas y número de miembros
- Métricas de estadísticas (`getAudienceStats()`) con total de audiencias, miembros, tamaño promedio, tasa de segmentación

**Riesgos/limitaciones**:
- Funcionalidad de creación/edición muestra `alert('Funcionalidad en desarrollo')` — no está completamente implementada
- No hay validación de reglas en el frontend antes de crear
- No hay preview en tiempo real de cuántos miembros cumplirían las reglas

---

### 2. **Automatización de secuencias de email por ciclo de vida**
**Problema cubierto**: No hay forma de automatizar emails basados en eventos del ciclo de vida del cliente (onboarding, reactivación, felicitaciones).

**Página(s)**: `/dashboard/automatizacion/secuencias-email` (`LifecycleEmailSequencesPage.tsx`)

**Como lo resuelve el código**:
- API `getSequences()`, `updateSequence()`, `deleteSequence()` en `src/features/LifecycleEmailSequences/api/sequences.ts`
- Interfaz `EmailSequence` con `trigger`, `steps`, `isActive`, métricas
- `SequenceCard` muestra nombre, trigger, estado activo/inactivo, número de pasos
- Toggle de activación/desactivación con `handleToggle()`

**Riesgos/limitaciones**:
- Creación y edición muestran `alert('Funcionalidad en desarrollo')` — solo lectura/activación
- No hay editor visual de secuencias
- No hay preview de emails antes de enviar

---

### 3. **Segmentación avanzada con múltiples criterios y operadores lógicos**
**Problema cubierto**: No hay forma de crear segmentos complejos usando múltiples condiciones con AND/OR.

**Página(s)**: `/listas-inteligentes-segmentos-guardados` — Tab "Constructor" (`SegmentBuilder.tsx`)

**Como lo resuelve el código**:
- `SegmentBuilder` permite crear reglas con `field`, `operator` (equals, not_equals, contains, greater_than, less_than, between, in, not_in)
- Operadores lógicos `AND`/`OR` entre reglas
- Campos disponibles: edad, género, tipo membresía, caducidad, tasa asistencia, LTV, días sin visita, meses activos, frecuencia compra
- API `getSegments()`, `refreshSegment()`, `deleteSegment()` en `src/features/listas-inteligentes-segmentos-guardados/api/segments.ts`

**Riesgos/limitaciones**:
- Guardado simulado con `console.log` y `alert` — no persiste realmente
- No hay validación de reglas conflictivas
- No hay preview de resultados antes de guardar

---

### 4. **Listas inteligentes que se actualizan automáticamente**
**Problema cubierto**: No hay forma de mantener listas de clientes que se actualicen automáticamente según cambios en datos.

**Página(s)**: `/listas-inteligentes-segmentos-guardados` — Tab "Listas Inteligentes" (`SmartListsManager.tsx`)

**Como lo resuelve el código**:
- `SmartList` con `refreshFrequency`: 'realtime' | 'hourly' | 'daily' | 'weekly' | 'manual'
- API `getSmartLists()`, `refreshSmartList()`, `deleteSmartList()`
- Métricas: total listas, miembros totales, listas en tiempo real
- Botón de refresh manual por lista

**Riesgos/limitaciones**:
- No hay indicador visual de cuándo se actualizó por última vez en tiempo real
- No hay logs de cambios en miembros de la lista
- Frecuencia "realtime" puede ser costosa en términos de performance

---

### 5. **Análisis de comportamiento de clientes para segmentación**
**Problema cubierto**: No hay forma de identificar patrones de comportamiento para segmentar clientes automáticamente.

**Página(s)**: `/listas-inteligentes-segmentos-guardados` — Tab "Análisis Comportamiento" (`BehaviorAnalyzer.tsx`)

**Como lo resuelve el código**:
- Interfaz `BehaviorPattern` con `patternType`: 'attendance' | 'purchase' | 'engagement' | 'risk'
- Score numérico y detalles de cada patrón
- Detección automática de patrones (`detectedAt`)

**Riesgos/limitaciones**:
- Componente existe pero no se revisó su implementación completa en el código
- No hay información sobre qué algoritmos se usan para detectar patrones
- No hay configuración de sensibilidad de detección

---

### 6. **Segmentación predictiva con modelos de ML**
**Problema cubierto**: No hay forma de predecir qué clientes tienen mayor probabilidad de churn, upsell, engagement o conversión.

**Página(s)**: `/listas-inteligentes-segmentos-guardados` — Tab "Segmentación Predictiva" (`PredictiveSegmentation.tsx`)

**Como lo resuelve el código**:
- Interfaz `PredictiveSegment` con `modelType`: 'churn' | 'upsell' | 'engagement' | 'conversion'
- `confidence` score (0-100)
- `memberCount` y `criteria` del modelo

**Riesgos/limitaciones**:
- No hay información sobre qué modelos se usan (regresión, clasificación, etc.)
- No hay forma de entrenar o actualizar modelos
- Confidence score no se explica claramente al usuario

---

### 7. **Analytics de segmentos con métricas de rendimiento**
**Problema cubierto**: No hay forma de medir el rendimiento de diferentes segmentos para optimizar estrategias.

**Página(s)**: `/listas-inteligentes-segmentos-guardados` — Tab "Analytics" (`SegmentAnalytics.tsx`)

**Como lo resuelve el código**:
- Interfaz `SegmentAnalytics` con métricas: `engagementRate`, `conversionRate`, `revenue`, `avgLifetimeValue`, `churnRate`
- `TrendData[]` para visualizar evolución temporal de métricas
- API `compareSegments()` para comparar múltiples segmentos

**Riesgos/limitaciones**:
- No se revisó implementación completa del componente
- No hay exportación de datos
- No hay alertas cuando métricas cambian significativamente

---

### 8. **Reglas de automatización basadas en segmentos**
**Problema cubierto**: No hay forma de automatizar acciones cuando clientes entran o salen de segmentos.

**Página(s)**: `/listas-inteligentes-segmentos-guardados` — Tab "Automatización" (`AutomationRules.tsx`)

**Como lo resuelve el código**:
- Interfaz `AutomationRule` con `segmentId`, `trigger`: 'member_added' | 'member_removed' | 'segment_updated' | 'schedule'
- `action`: 'send_email' | 'send_sms' | 'add_to_campaign' | 'assign_tag' | 'webhook'
- `actionConfig` para configuración específica de cada acción
- Toggle de activación/desactivación

**Riesgos/limitaciones**:
- Usa datos mock (`mockAutomationRules`) — no hay API real implementada
- No hay validación de triggers antes de activar
- No hay logs de ejecución de reglas

---

### 9. **Comparación de segmentos side-by-side**
**Problema cubierto**: No hay forma de comparar métricas entre diferentes segmentos para tomar decisiones.

**Página(s)**: `/listas-inteligentes-segmentos-guardados` — Tab "Comparación" (`SegmentComparison.tsx`)

**Como lo resuelve el código**:
- Interfaz `SegmentComparison` con `segments[]` y `metrics` (memberCount, engagementRate, conversionRate, revenue arrays)
- API `compareSegments()` que acepta array de IDs de segmentos
- `MetricCards` para visualizar métricas comparativas
- Selección múltiple de segmentos (mínimo 2, máximo 4)

**Riesgos/limitaciones**:
- No hay visualización gráfica de comparación (solo cards)
- No hay exportación de comparación
- Máximo 4 segmentos puede ser limitante

---

### 10. **Gestión de segmentos con estados y tipos**
**Problema cubierto**: No hay forma de organizar y gestionar múltiples segmentos con diferentes estados y tipos.

**Página(s)**: `/listas-inteligentes-segmentos-guardados` — Tab "Segmentos" (`SegmentationEngine.tsx`)

**Como lo resuelve el código**:
- `Segment` con `type`: 'automatic' | 'manual' | 'smart'
- `status`: 'active' | 'inactive' | 'archived'
- Filtros por tipo y estado
- Búsqueda por nombre/descripción
- Tabla con columnas: nombre, tipo, miembros, estado, última actualización
- Refresh manual por segmento
- Badges de colores para tipos y estados

**Riesgos/limitaciones**:
- No hay paginación en tabla (puede ser lenta con muchos segmentos)
- No hay exportación de segmentos
- No hay duplicación de segmentos desde esta vista

---

## 3) 10 problemas que AÚN NO resuelve (y debería)

### 1. **Editor visual de secuencias de email con drag-and-drop**
**Necesidad detectada**: No hay forma de crear o editar secuencias de email visualmente. Las funciones muestran alerts de "en desarrollo".

**Propuesta de solución** (alto nivel + impacto):
- Editor visual tipo flowchart con nodos para cada paso del email
- Drag-and-drop para reordenar pasos
- Configuración de delays, condiciones, triggers por paso
- Preview de emails antes de activar
- **Impacto**: Alto — permite crear secuencias complejas sin conocimiento técnico
- **Páginas/flujo afectados**: `/dashboard/automatizacion/secuencias-email` — reemplazar `alert()` con modal de editor
- **Complejidad estimada**: Alta — requiere librería de diagramas (react-flow, vis.js) y lógica de validación de flujos

---

### 2. **Preview en tiempo real de miembros que cumplen reglas de segmento**
**Necesidad detectada**: No hay forma de saber cuántos miembros cumplirían las reglas antes de guardar el segmento.

**Propuesta de solución** (alto nivel + impacto):
- Al cambiar reglas en `SegmentBuilder`, ejecutar query de preview (sin guardar)
- Mostrar contador y lista sample de miembros (primeros 10)
- Validación de reglas (ej: "edad > 100" mostrar warning)
- **Impacto**: Medio — reduce errores y mejora UX
- **Páginas/flujo afectados**: `/listas-inteligentes-segmentos-guardados` — Tab "Constructor"
- **Complejidad estimada**: Media — requiere endpoint de preview y optimización de queries

---

### 3. **Segmentación basada en eventos y comportamiento en tiempo real**
**Necesidad detectada**: No hay forma de crear segmentos basados en eventos recientes (ej: "clientes que hicieron check-in en última hora" o "clientes que vieron email pero no abrieron").

**Propuesta de solución** (alto nivel + impacto):
- Sistema de eventos en tiempo real (WebSockets o polling frecuente)
- Triggers de eventos: check-in, email abierto, compra, cancelación, etc.
- Segmentos dinámicos que se actualizan automáticamente cuando ocurre evento
- **Impacto**: Alto — permite segmentación muy precisa y reactiva
- **Páginas/flujo afectados**: `SegmentBuilder` — agregar tipo de regla "evento", backend requiere sistema de eventos
- **Complejidad estimada**: Alta — requiere infraestructura de eventos y procesamiento en tiempo real

---

### 4. **A/B testing de segmentos para optimizar criterios**
**Necesidad detectada**: No hay forma de probar diferentes criterios de segmentación para ver cuál funciona mejor.

**Propuesta de solución** (alto nivel + impacto):
- Crear variantes de un segmento con diferentes criterios
- Asignar miembros aleatoriamente a cada variante
- Medir conversión, engagement, revenue por variante
- Recomendación automática de mejor variante
- **Impacto**: Medio — permite optimización continua
- **Páginas/flujo afectados**: `SegmentBuilder` — agregar opción "Crear variante para A/B test"
- **Complejidad estimada**: Alta — requiere sistema de asignación aleatoria, tracking de métricas por variante, análisis estadístico

---

### 5. **Integración de segmentos con campañas y automatizaciones existentes**
**Necesidad detectada**: Aunque hay `AutomationRules`, no hay forma clara de usar segmentos en campañas de email/SMS existentes o en otras automatizaciones.

**Propuesta de solución** (alto nivel + impacto):
- Selector de segmento en `CampaignBuilder` de `campanas-outreach`
- Integración con sistema de email marketing existente
- Preview de tamaño de audiencia antes de enviar
- **Impacto**: Alto — maximiza uso de segmentación
- **Páginas/flujo afectados**: `/campanas-outreach`, `/dashboard/marketing/email-campaigns` — agregar selector de audiencia/segmento
- **Complejidad estimada**: Media — requiere refactor de APIs de campañas y email

---

### 6. **Exportación e importación de segmentos y reglas**
**Necesidad detectada**: No hay forma de compartir segmentos entre gimnasios o hacer backup de configuraciones complejas.

**Propuesta de solución** (alto nivel + impacto):
- Exportar segmento a JSON con reglas y configuración
- Importar segmento desde JSON (validación de campos disponibles)
- Biblioteca de segmentos predefinidos (ej: "Clientes VIP", "Riesgo Churn")
- **Impacto**: Bajo-Medio — útil para casos específicos (multi-sede, migración)
- **Páginas/flujo afectados**: `SegmentationEngine` — agregar botones "Exportar" e "Importar"
- **Complejidad estimada**: Baja — serialización JSON y validación

---

### 7. **Alertas y notificaciones cuando segmentos cambian significativamente**
**Necesidad detectada**: No hay forma de saber cuando un segmento cambia de tamaño drásticamente (ej: muchos clientes entran/salen).

**Propuesta de solución** (alto nivel + impacto):
- Configurar umbrales de cambio (ej: "alertar si segmento cambia >10% en 24h")
- Notificaciones por email/in-app cuando se alcanza umbral
- Dashboard de cambios recientes de segmentos
- **Impacto**: Medio — permite detectar problemas o oportunidades temprano
- **Páginas/flujo afectados**: `SegmentationEngine` — agregar tab "Alertas", backend requiere sistema de notificaciones
- **Complejidad estimada**: Media — requiere tracking de cambios históricos y sistema de notificaciones

---

### 8. **Segmentación por atributos personalizados y campos custom**
**Necesidad detectada**: Solo se pueden usar campos predefinidos. No hay forma de segmentar por campos personalizados (ej: "preferencia de clase", "objetivo fitness").

**Propuesta de solución** (alto nivel + impacto):
- Editor de campos personalizados en configuración
- Selector de campos custom en `SegmentBuilder`
- Validación de tipos de datos (string, number, date, boolean)
- **Impacto**: Alto — permite segmentación muy específica por negocio
- **Páginas/flujo afectados**: `SegmentBuilder` — agregar selector de campos custom, backend requiere esquema dinámico
- **Complejidad estimada**: Alta — requiere sistema de campos dinámicos y queries SQL dinámicas

---

### 9. **Segmentación por ubicación geográfica y datos de check-in**
**Necesidad detectada**: No hay forma de segmentar por ubicación (ej: "clientes que vienen del centro de la ciudad") o patrones de check-in (ej: "clientes que vienen solo fines de semana").

**Propuesta de solución** (alto nivel + impacto):
- Integración con datos de check-in del sistema de agenda
- Análisis de frecuencia y horarios de visita
- Segmentación por código postal o zona (si está disponible)
- **Impacto**: Medio — útil para campañas locales y personalización
- **Páginas/flujo afectados**: `SegmentBuilder` — agregar campos de check-in y ubicación, requiere integración con módulo de agenda
- **Complejidad estimada**: Media — requiere agregar campos a schema y queries de agregación

---

### 10. **Segmentación predictiva con explicación de por qué un cliente está en un segmento**
**Necesidad detectada**: Los modelos predictivos muestran confidence pero no explican qué factores llevaron a la predicción.

**Propuesta de solución** (alto nivel + impacto):
- SHAP values o feature importance para explicar predicciones
- Visualización de factores principales (ej: "85% probabilidad de churn por: días sin visita >30, pago fallido reciente")
- Recomendaciones de acciones basadas en factores
- **Impacto**: Alto — mejora interpretabilidad y acción del usuario
- **Páginas/flujo afectados**: `PredictiveSegmentation` — agregar explicaciones por cliente, requiere modelos con explicabilidad
- **Complejidad estimada**: Alta — requiere modelos con explicabilidad (SHAP, LIME) y visualización

---

## 4) Hallazgos desde navegación/menús

### `@Sidebar.tsx` — Análisis de la sección

**Ubicación en Sidebar** (líneas 350-357):
```typescript
{
  id: 'segmentacion-automatizacion',
  title: 'Segmentación & Automatización',
  icon: Filter,
  items: [
    { id: 'segmentacion-dinamica-audiencias', label: 'Segmentación Dinámica & Audiencias', icon: Filter, path: '/dashboard/audiencias' },
    { id: 'lifecycle-email-sequences', label: 'Lifecycle Email Sequences', icon: Mail, path: '/dashboard/automatizacion/secuencias-email' },
  ],
}
```

**Permisos y visibilidad**:
- No tiene `entrenadorOnly` ni `gimnasioOnly` — visible para ambos roles
- Sin badges o indicadores de estado

**Mapeo de rutas** (líneas 130, 230 en `Sidebar.tsx`):
- `path.includes('dashboard/audiencias')` → `segmentacion-dinamica-audiencias`
- `path.includes('dashboard/automatizacion/secuencias-email')` → `lifecycle-email-sequences`

**Inconsistencias de UX o naming**:
1. **Naming inconsistente**: La sección se llama "Segmentación & Automatización" pero la funcionalidad más completa está en "Listas Inteligentes" que está en otra sección (CRM & Clientes). Debería estar aquí o viceversa.
2. **Falta de conexión visual**: No hay indicadores de que "Listas Inteligentes" esté relacionada con esta sección aunque tiene funcionalidad de segmentación avanzada.
3. **Rutas no intuitivas**: `/dashboard/audiencias` y `/dashboard/automatizacion/secuencias-email` no siguen un patrón claro. Debería ser `/segmentacion/audiencias` y `/segmentacion/secuencias-email` o similar.
4. **Falta de shortcuts**: No hay atajos de teclado para acciones comunes (crear segmento, crear secuencia).
5. **Sin badges de estado**: No hay indicadores de cuántas secuencias activas hay o cuántos segmentos existen sin entrar a la página.

---

## 5) KPIs y métricas recomendadas

### Métricas de adopción
- **% de usuarios que crean al menos 1 segmento en primeros 30 días**: Target 40%
- **% de usuarios que crean al menos 1 secuencia de email en primeros 30 días**: Target 25%
- **Promedio de segmentos creados por usuario activo**: Target 3-5
- **Promedio de secuencias activas por usuario**: Target 2-3

### Tiempo de tarea
- **Tiempo promedio para crear un segmento básico**: Target <5 minutos
- **Tiempo promedio para crear una secuencia de 3 pasos**: Target <10 minutos
- **Tiempo de carga de página de audiencias**: Target <2 segundos

### Conversión interna
- **% de segmentos creados que se usan en campañas**: Target 60%
- **% de secuencias activadas que envían al menos 1 email**: Target 80%
- **Tasa de abandono en creación de segmento**: Target <30%

### Errores por flujo
- **Errores al crear segmento (validación, API)**: Target <5% de intentos
- **Errores al activar secuencia**: Target <2% de intentos
- **Errores de preview de segmento**: Target <10% de intentos

### Latencia clave
- **Tiempo de preview de segmento (cuántos miembros cumplen)**: Target <3 segundos
- **Tiempo de actualización de lista inteligente (realtime)**: Target <1 segundo
- **Tiempo de ejecución de regla de automatización**: Target <5 segundos

---

## 6) Backlog priorizado (RICE/MoSCoW)

### MUST (top 3)

1. **Completar funcionalidad de creación/edición de audiencias y secuencias**
   - **Reach**: 100% (todos los usuarios)
   - **Impact**: Alto (funcionalidad core no funciona)
   - **Confidence**: 100%
   - **RICE**: ∞ (prioridad absoluta)
   - **Justificación**: Actualmente muestra alerts de "en desarrollo". Sin esto, la sección no es funcional.

2. **Implementar preview en tiempo real de miembros de segmento**
   - **Reach**: 80% (usuarios que crean segmentos)
   - **Impact**: Alto (reduce errores y mejora UX)
   - **Confidence**: 80%
   - **RICE**: 80
   - **Justificación**: Crítico para validar segmentos antes de guardar.

3. **Integrar segmentos con campañas existentes**
   - **Reach**: 70% (usuarios que hacen campañas)
   - **Impact**: Alto (maximiza valor de segmentación)
   - **Confidence**: 90%
   - **RICE**: 63
   - **Justificación**: Sin integración, los segmentos no se pueden usar en marketing real.

### SHOULD (top 3)

4. **Editor visual de secuencias de email con drag-and-drop**
   - **Reach**: 60% (usuarios que crean secuencias)
   - **Impact**: Alto (mejora UX significativamente)
   - **Confidence**: 70%
   - **RICE**: 42
   - **Justificación**: Mejora drásticamente la experiencia de creación de secuencias.

5. **Segmentación basada en eventos en tiempo real**
   - **Reach**: 50% (usuarios avanzados)
   - **Impact**: Alto (segmentación muy precisa)
   - **Confidence**: 60%
   - **RICE**: 30
   - **Justificación**: Permite casos de uso avanzados de segmentación reactiva.

6. **Alertas cuando segmentos cambian significativamente**
   - **Reach**: 100% (todos los usuarios)
   - **Impact**: Medio (detección temprana de problemas)
   - **Confidence**: 80%
   - **RICE**: 40
   - **Justificación**: Ayuda a detectar cambios importantes en audiencias.

### COULD (top 3)

7. **A/B testing de segmentos**
   - **Reach**: 30% (usuarios avanzados)
   - **Impact**: Medio (optimización continua)
   - **Confidence**: 50%
   - **RICE**: 15
   - **Justificación**: Funcionalidad avanzada para optimización.

8. **Exportación/importación de segmentos**
   - **Reach**: 20% (casos específicos: multi-sede, migración)
   - **Impact**: Bajo (útil pero no crítico)
   - **Confidence**: 90%
   - **RICE**: 18
   - **Justificación**: Útil para casos específicos pero no prioritario.

9. **Explicabilidad de segmentación predictiva (SHAP values)**
   - **Reach**: 25% (usuarios que usan segmentación predictiva)
   - **Impact**: Medio (mejora interpretabilidad)
   - **Confidence**: 40%
   - **RICE**: 10
   - **Justificación**: Funcionalidad avanzada que requiere modelos con explicabilidad.

---

## 7) Próximos pasos

### 3 acciones accionables para la próxima iteración

1. **Implementar API real de creación/edición de audiencias y secuencias**
   - **Acción**: Reemplazar `alert('Funcionalidad en desarrollo')` con modales funcionales y endpoints reales
   - **Archivos a modificar**:
     - `src/features/SegmentacionDinamicaYAudiencias/pages/SegmentacionDinamicaYAudienciasPage.tsx` — agregar modal de creación/edición
     - `src/features/SegmentacionDinamicaYAudiencias/api/audiences.ts` — implementar `createAudience()`, `updateAudience()` con validación
     - `src/features/LifecycleEmailSequences/pages/LifecycleEmailSequencesPage.tsx` — agregar modal de creación/edición
     - `src/features/LifecycleEmailSequences/api/sequences.ts` — implementar `createSequence()`, `updateSequence()` con editor de pasos
   - **Riesgos**: Validación compleja de reglas, performance de queries con muchos miembros
   - **Supuestos**: Backend puede manejar queries complejas de segmentación eficientemente

2. **Agregar preview en tiempo real de miembros de segmento**
   - **Acción**: Al editar reglas en `SegmentBuilder`, hacer query de preview y mostrar contador + sample
   - **Archivos a modificar**:
     - `src/features/listas-inteligentes-segmentos-guardados/components/SegmentBuilder.tsx` — agregar preview panel
     - `src/features/listas-inteligentes-segmentos-guardados/api/segments.ts` — agregar endpoint `previewSegment(rules)`
   - **Riesgos**: Queries de preview pueden ser lentas con muchos datos, necesidad de cache
   - **Supuestos**: Base de datos puede manejar queries de preview sin afectar performance general

3. **Integrar segmentos con campañas existentes**
   - **Acción**: Agregar selector de audiencia/segmento en `CampaignBuilder` de `campanas-outreach`
   - **Archivos a modificar**:
     - `src/features/campanas-outreach/components/CampaignBuilder.tsx` — agregar selector de audiencia
     - `src/features/campanas-outreach/types/index.ts` — agregar `audienceId` a `Campaign`
     - `src/features/campanas-outreach/services/campaignsService.ts` — usar audiencia para filtrar destinatarios
   - **Riesgos**: Refactor de APIs de campañas, validación de que audiencia existe y es accesible
   - **Supuestos**: Sistema de campañas puede manejar listas dinámicas de destinatarios

### Riesgos y supuestos

**Riesgos principales**:
1. **Performance de queries de segmentación**: Con muchos miembros y reglas complejas, queries pueden ser lentas. Necesita índices y optimización.
2. **Sincronización de datos**: Segmentos dinámicos deben actualizarse cuando cambian datos de clientes. Requiere sistema de eventos o polling eficiente.
3. **Complejidad de reglas**: Reglas muy complejas (muchos AND/OR anidados) pueden ser difíciles de validar y ejecutar.

**Supuestos**:
1. Backend tiene capacidad de procesar queries de segmentación complejas en tiempo razonable (<3s)
2. Base de datos tiene índices apropiados en campos usados para segmentación (edad, tipo membresía, etc.)
3. Sistema de eventos o polling puede manejar actualizaciones en tiempo real sin sobrecarga

---

> **Notas técnicas**: 
> - Archivos clave: `src/components/Sidebar.tsx` (líneas 350-357), `src/features/SegmentacionDinamicaYAudiencias/`, `src/features/LifecycleEmailSequences/`, `src/features/listas-inteligentes-segmentos-guardados/`
> - Integraciones: Sistema de campañas (`campanas-outreach`), sistema de email/SMS, CRM de clientes
> - Dependencias: APIs de segmentación, sistema de eventos, base de datos con índices optimizados






