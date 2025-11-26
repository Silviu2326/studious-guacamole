# Extras & Especializados — Diagnóstico funcional y de producto

## 1) Mapa de páginas de la sección

### Páginas principales

#### `/marketing/ab-testing` — A/B Testing & Experimentación
- **Componente raíz**: `src/features/AbTestingYExperimentacion/pages/AbTestingYExperimentacionPage.tsx`
- **Componentes hijos**:
  - `ExperimentDashboard` (`src/features/AbTestingYExperimentacion/components/ExperimentDashboard.tsx`) - Dashboard de experimentos con filtros
  - `ExperimentResultCard` (`src/features/AbTestingYExperimentacion/components/ExperimentResultCard.tsx`) - Tarjeta individual de experimento
  - `StatisticalSignificanceIndicator` (`src/features/AbTestingYExperimentacion/components/StatisticalSignificanceIndicator.tsx`) - Indicador de significancia estadística
- **API**: `src/features/AbTestingYExperimentacion/api/experiments.ts`
- **Estados**:
  - Loading: `Loader2` spinner con mensaje "Cargando..."
  - Error: Card con `AlertCircle` y botón "Reintentar"
  - Vacío: Card con `Package` icon y mensaje informativo + botón "Crear Primer Experimento"
- **Guardias**: No hay guardias explícitas (depende de Layout)
- **Filtros**: Por estado (Todos, Activos, Pausados, Finalizados, Borradores)

#### `/market-intelligence` — Competitive Analysis & Market Intelligence
- **Componente raíz**: `src/features/CompetitiveAnalysisYMarketIntelligence/pages/CompetitiveAnalysisYMarketIntelligencePage.tsx`
- **Componentes hijos**:
  - `MarketIntelligenceDashboard` (`src/features/CompetitiveAnalysisYMarketIntelligence/components/MarketIntelligenceDashboard.tsx`) - Dashboard principal
  - `CompetitorCard` (`src/features/CompetitiveAnalysisYMarketIntelligence/components/CompetitorCard.tsx`) - Tarjeta individual de competidor
  - `PriceComparisonChart` (`src/features/CompetitiveAnalysisYMarketIntelligence/components/PriceComparisonChart.tsx`) - Gráfico de comparación de precios
  - `AddCompetitorModal` (`src/features/CompetitiveAnalysisYMarketIntelligence/components/AddCompetitorModal.tsx`) - Modal para añadir competidor
- **APIs**:
  - `src/features/CompetitiveAnalysisYMarketIntelligence/api/competitors.ts`
  - `src/features/CompetitiveAnalysisYMarketIntelligence/api/marketSummary.ts`
- **Estados**:
  - Loading: `Loader2` spinner con mensaje "Cargando..."
  - Error: Card con `AlertCircle` y botón "Reintentar"
  - Vacío: No hay estado vacío explícito (solo lista de competidores)
- **Guardias**: No hay guardias explícitas (depende de Layout)

---

## 2) 10 problemas que hoy SÍ resuelve

### 1. **Dashboard de Métricas de A/B Testing con KPIs Agregados**
**Página(s)**: `/marketing/ab-testing` (A/B Testing & Experimentación)

**Problema cubierto**: No hay forma de ver el rendimiento general de los experimentos A/B sin calcular métricas manualmente.

**Como lo resuelve el código**:
- `AbTestingYExperimentacionPage` muestra métricas agregadas: Total Experimentos, Tasa de Éxito, Mejora Promedio, Conversiones Totales
- Métricas incluyen tendencias (vs mes anterior) y subtítulos descriptivos
- Visualización con `MetricCards` con iconos y colores diferenciados
- Datos mock pero estructura completa para integración real

**Riesgos/limitaciones**:
- Métricas son mock (no hay datos reales de tracking)
- No hay comparación con períodos anteriores más detallada
- Falta desglose por tipo de experimento

### 2. **Gestión de Experimentos A/B con Estados y Filtros**
**Página(s)**: `/marketing/ab-testing` (A/B Testing & Experimentación)

**Problema cubierto**: No hay forma de gestionar múltiples experimentos A/B sin perder visibilidad del estado de cada uno.

**Como lo resuelve el código**:
- `ExperimentDashboard` muestra lista de experimentos con filtros por estado (Todos, Activos, Pausados, Finalizados, Borradores)
- `ExperimentResultCard` muestra información clave: nombre, tipo, estado, objetivo, variantes, ganador
- Estados visuales diferenciados con badges de colores
- Sistema de tabs para filtrar por estado
- Filtrado client-side en tiempo real

**Riesgos/limitaciones**:
- Experimentos son mock (no hay creación real de experimentos)
- Filtrado es client-side (no hay paginación eficiente)
- No hay búsqueda por nombre o texto

### 3. **Visualización de Resultados de Experimentos con Variantes**
**Página(s)**: `/marketing/ab-testing` (A/B Testing & Experimentación)

**Problema cubierto**: No hay forma de ver resultados detallados de cada variante del experimento.

**Como lo resuelve el código**:
- `ExperimentResultCard` muestra métricas por variante: visitantes, conversiones, tasa de conversión
- Identificación de variante ganadora con icono de trofeo
- Comparación visual de rendimiento entre variantes
- Indicador de lift (mejora relativa) y confianza estadística
- Visualización clara de mejor variante

**Riesgos/limitaciones**:
- Resultados son mock (no hay tracking real de visitantes/conversiones)
- No hay gráficos de tendencias temporales
- Falta visualización de distribución de tráfico

### 4. **Indicador de Significancia Estadística**
**Página(s)**: `/marketing/ab-testing` (A/B Testing & Experimentación)

**Problema cubierto**: No hay forma de saber si los resultados del experimento son estadísticamente confiables.

**Como lo resuelve el código**:
- `StatisticalSignificanceIndicator` muestra nivel de confianza (0-100%)
- Categorización automática: "Muy Confiable" (≥95%), "Moderadamente Confiable" (≥80%), "Poco Confiable" (<80%)
- Visualización con barra de progreso y colores diferenciados
- Integrado en `ExperimentResultCard` para cada experimento
- Indicador visual claro de confiabilidad

**Riesgos/limitaciones**:
- Cálculo de confianza es mock (no hay cálculo estadístico real)
- No hay explicación de cómo se calcula la confianza
- Falta información sobre tamaño de muestra necesario

### 5. **Dashboard de Inteligencia de Mercado con Métricas Agregadas**
**Página(s)**: `/market-intelligence` (Competitive Analysis & Market Intelligence)

**Problema cubierto**: No hay forma de ver el panorama general del mercado sin analizar datos manualmente.

**Como lo resuelve el código**:
- `MarketIntelligenceDashboard` muestra métricas agregadas: Precio Promedio/Sesión, Precio Promedio/Mes, Competidores Monitoreados, Oportunidades
- `getMarketSummary` API proporciona datos de mercado: precios promedio, servicios populares, oportunidades
- Visualización con `MetricCards` con iconos y colores diferenciados
- Datos contextualizados por ubicación

**Riesgos/limitaciones**:
- Métricas son mock (no hay datos reales de mercado)
- No hay comparación con períodos anteriores
- Falta desglose por nicho o segmento

### 6. **Gestión de Competidores con Monitoreo**
**Página(s)**: `/market-intelligence` (Competitive Analysis & Market Intelligence)

**Problema cubierto**: No hay forma de gestionar y monitorear competidores de forma centralizada.

**Como lo resuelve el código**:
- `MarketIntelligenceDashboard` lista competidores con información resumida
- `CompetitorCard` muestra información clave: nombre, URL, precio promedio, engagement, última actualización
- Estados de monitoreo: pending_first_scan, scanning, active, error
- Botones para ver detalles y eliminar competidor
- Link directo al sitio web del competidor

**Riesgos/limitaciones**:
- Competidores son mock (no hay scraping real de datos)
- No hay actualización automática de datos
- Falta información detallada de servicios y estrategias

### 7. **Comparación de Precios con Gráficos**
**Página(s)**: `/market-intelligence` (Competitive Analysis & Market Intelligence)

**Problema cubierto**: No hay forma de comparar visualmente precios propios con mercado y competidores.

**Como lo resuelve el código**:
- `PriceComparisonChart` muestra gráfico de barras comparando: Mi Precio, Promedio Mercado, Competidores individuales
- `getPriceComparisonData` API combina datos del usuario con mercado y competidores
- Visualización con colores diferenciados por tipo (user, market, competitor)
- Tooltip interactivo con información detallada
- Leyenda clara de tipos de datos

**Riesgos/limitaciones**:
- Datos son mock (no hay precios reales del usuario)
- No hay comparación histórica de precios
- Falta análisis de tendencias de precios

### 8. **Añadir Competidores con Validación**
**Página(s)**: `/market-intelligence` (Competitive Analysis & Market Intelligence)

**Problema cubierto**: No hay forma de añadir nuevos competidores para monitorear.

**Como lo resuelve el código**:
- `AddCompetitorModal` permite añadir competidor con URL
- Validación de URL (debe comenzar con http:// o https://)
- Manejo de errores con mensajes claros
- Estado de carga durante creación
- Actualización automática de lista después de añadir
- `createCompetitor` API crea registro con estado "pending_first_scan"

**Riesgos/limitaciones**:
- Creación es mock (no hay scraping real)
- No hay validación de que la URL sea un competidor válido
- Falta opción de añadir información manual adicional

### 9. **Identificación de Oportunidades de Mercado**
**Página(s)**: `/market-intelligence` (Competitive Analysis & Market Intelligence)

**Problema cubierto**: No hay forma de identificar nichos o oportunidades no explotadas en el mercado.

**Como lo resuelve el código**:
- `getMarketSummary` API incluye `opportunityGaps` (nichos identificados)
- Visualización en métricas como "Oportunidades" con contador
- Ejemplos de oportunidades: "Entrenamiento para mayores de 60", "Preparación para oposiciones"
- Presentación clara en dashboard

**Riesgos/limitaciones**:
- Oportunidades son mock (no hay análisis real de mercado)
- No hay explicación de cómo se identifican las oportunidades
- Falta información sobre potencial de mercado de cada oportunidad

### 10. **Información Educativa sobre Funcionalidades**
**Páginas**: `/marketing/ab-testing`, `/market-intelligence`

**Problema cubierto**: No hay forma de entender qué son estas funcionalidades y cómo usarlas.

**Como lo resuelve el código**:
- `AbTestingYExperimentacionPage` incluye card informativa "¿Qué es A/B Testing?" con explicación
- `CompetitiveAnalysisYMarketIntelligencePage` incluye card informativa "¿Qué es la Inteligencia de Mercado?" con explicación
- Explicaciones claras y contextualizadas
- Visualización destacada con iconos y colores

**Riesgos/limitaciones**:
- Información es estática (no hay tutoriales interactivos)
- No hay ejemplos prácticos o casos de uso
- Falta documentación más detallada o links a recursos

---

## 3) 10 problemas que AÚN NO resuelve (y debería)

### 1. **Creación Real de Experimentos A/B con Wizard**
**Necesidad detectada**: Los botones "Nuevo Experimento" están como TODO y no hay creación real de experimentos.

**Propuesta de solución** (alto nivel + impacto):
- Wizard paso a paso para crear experimento: tipo (Landing Page, Email, Oferta), objetivo, variantes
- Editor visual para crear variantes (diferencias en contenido)
- Configuración de distribución de tráfico (50/50, 70/30, etc.)
- Configuración de duración y criterios de finalización
- Preview de experimento antes de activar
- Integración con módulos de landing pages, emails, ofertas
- **Impacto**: Alto - Sin esto, no se pueden crear experimentos reales. Es la funcionalidad core.

**Páginas/flujo afectados**:
- `AbTestingYExperimentacionPage` (wizard de creación)
- Nuevo componente `ExperimentWizard`
- Integración con módulos de landing pages, emails, ofertas
- Nuevo servicio `ExperimentCreationService`

**Complejidad estimada**: Alta (requiere wizard completo, editor visual, integración cross-module)

### 2. **Tracking Real de Visitantes y Conversiones**
**Necesidad detectada**: Los resultados son mock. No hay tracking real de visitantes, conversiones, ni asignación de variantes.

**Propuesta de solución** (alto nivel + impacto):
- Sistema de tracking de visitantes con asignación aleatoria a variantes
- Tracking de conversiones basado en objetivos (formularios, clicks, compras)
- Integración con Google Analytics o sistema de tracking propio
- Dashboard en tiempo real de resultados
- Alertas cuando se alcanza significancia estadística
- **Impacto**: Alto - Sin esto, los experimentos no tienen valor funcional.

**Páginas/flujo afectados**:
- `ExperimentResultCard` (datos reales)
- Nuevo servicio `ExperimentTrackingService`
- Sistema de tracking de eventos
- Integración con analytics

**Complejidad estimada**: Alta (requiere sistema de tracking completo, asignación de variantes, analytics)

### 3. **Cálculo Estadístico Real de Significancia**
**Necesidad detectada**: El indicador de confianza es mock. No hay cálculo estadístico real (p-value, chi-square, etc.).

**Propuesta de solución** (alto nivel + impacto):
- Cálculo de p-value usando test chi-square o test t según tipo de métrica
- Cálculo de intervalo de confianza
- Determinación automática de ganador cuando se alcanza significancia (p < 0.05)
- Recomendaciones de tamaño de muestra necesario
- Alertas cuando resultados son estadísticamente significativos
- **Impacto**: Alto - Sin esto, los resultados no son confiables.

**Páginas/flujo afectados**:
- `StatisticalSignificanceIndicator` (cálculo real)
- Nuevo servicio `StatisticalAnalysisService`
- Integración con resultados de experimentos

**Complejidad estimada**: Media/Alta (requiere cálculo estadístico, pero es matemática conocida)

### 4. **Aplicación Automática de Variante Ganadora**
**Necesidad detectada**: No hay forma de aplicar automáticamente la variante ganadora como versión por defecto.

**Propuesta de solución** (alto nivel + impacto):
- Botón "Aplicar Ganador" cuando experimento finaliza con ganador claro
- Integración con módulos de landing pages, emails, ofertas para actualizar versión por defecto
- Confirmación antes de aplicar
- Historial de cambios (versión anterior se guarda)
- Rollback si es necesario
- **Impacto**: Medio/Alto - Permite aplicar resultados automáticamente sin trabajo manual.

**Páginas/flujo afectados**:
- `ExperimentResultCard` (botón aplicar)
- Integración con módulos de landing pages, emails, ofertas
- Nuevo servicio `ExperimentApplicationService`

**Complejidad estimada**: Media (requiere integración cross-module, pero lógica simple)

### 5. **Scraping Real de Datos de Competidores**
**Necesidad detectada**: Los datos de competidores son mock. No hay scraping real de precios, servicios, contenido.

**Propuesta de solución** (alto nivel + impacto):
- Sistema de scraping automatizado de sitios web de competidores
- Extracción de precios, servicios, paquetes, promociones
- Scraping de redes sociales para métricas de engagement
- Actualización periódica automática (diaria, semanal)
- Manejo de errores si sitio cambia estructura
- Almacenamiento de historial de cambios
- **Impacto**: Alto - Sin esto, el análisis competitivo no tiene valor funcional.

**Páginas/flujo afectados**:
- `MarketIntelligenceDashboard` (datos reales)
- Nuevo servicio `CompetitorScrapingService`
- Sistema de jobs/workers para scraping periódico
- Base de datos para almacenar datos históricos

**Complejidad estimada**: Alta (requiere scraping robusto, manejo de errores, actualización periódica)

### 6. **Análisis de Contenido y Estrategias de Competidores**
**Necesidad detectada**: Solo hay precios básicos. No hay análisis de contenido, estrategias de marketing, tono de comunicación.

**Propuesta de solución** (alto nivel + impacto):
- Análisis de contenido de redes sociales (temas, frecuencia, engagement)
- Análisis de estrategias de marketing (promociones, ofertas, eventos)
- Análisis de tono de comunicación (formal, informal, motivacional)
- Comparación con estrategia propia
- Recomendaciones de mejoras basadas en análisis
- **Impacto**: Medio/Alto - Permite entender no solo qué hacen competidores, sino cómo lo hacen.

**Páginas/flujo afectados**:
- Nuevo componente `CompetitorContentAnalysis`
- Nuevo servicio `ContentAnalysisService`
- Integración con análisis de redes sociales

**Complejidad estimada**: Alta (requiere NLP, análisis de contenido, comparación)

### 7. **Alertas y Notificaciones de Cambios en Competidores**
**Necesidad detectada**: No hay alertas cuando competidores cambian precios, lanzan promociones, o actualizan servicios.

**Propuesta de solución** (alto nivel + impacto):
- Sistema de alertas cuando detecta cambios en competidores
- Notificaciones de cambios de precios (aumentos, descuentos)
- Alertas de nuevas promociones u ofertas
- Alertas de cambios en servicios o paquetes
- Dashboard de alertas recientes
- Configuración de qué tipos de alertas recibir
- **Impacto**: Medio/Alto - Permite reaccionar rápidamente a cambios del mercado.

**Páginas/flujo afectados**:
- Nuevo componente `CompetitorAlertsPanel`
- Sistema de notificaciones
- Nuevo servicio `CompetitorChangeDetectionService`

**Complejidad estimada**: Media/Alta (requiere detección de cambios, sistema de alertas)

### 8. **Análisis de Tendencias de Mercado**
**Necesidad detectada**: Solo hay snapshot actual. No hay análisis de tendencias (cómo cambian precios, servicios, estrategias con el tiempo).

**Propuesta de solución** (alto nivel + impacto):
- Análisis histórico de precios (cómo cambian con el tiempo)
- Identificación de tendencias (aumentos, disminuciones, estacionalidad)
- Análisis de tendencias de servicios (qué servicios son más populares)
- Predicción de tendencias futuras
- Gráficos de tendencias temporales
- **Impacto**: Medio/Alto - Permite entender dirección del mercado, no solo estado actual.

**Páginas/flujo afectados**:
- Nuevo componente `MarketTrendsAnalysis`
- Nuevo servicio `MarketTrendsService`
- Visualización de gráficos temporales

**Complejidad estimada**: Media/Alta (requiere análisis histórico, identificación de tendencias, predicción)

### 9. **Benchmarking Personalizado con Segmentos**
**Necesidad detectada**: Solo hay comparación general. No hay benchmarking específico por tipo de entrenador, ubicación, nicho.

**Propuesta de solución** (alto nivel + impacto):
- Segmentación de competidores por tipo (entrenador personal, gimnasio, boutique)
- Segmentación por ubicación (mismo barrio, ciudad, región)
- Segmentación por nicho (CrossFit, Pilates, entrenamiento funcional)
- Benchmarking personalizado según perfil del usuario
- Comparación con segmento específico
- **Impacto**: Medio/Alto - Permite comparaciones más relevantes y útiles.

**Páginas/flujo afectados**:
- `MarketIntelligenceDashboard` (añadir segmentación)
- Nuevo componente `SegmentBenchmarking`
- Nuevo servicio `BenchmarkingService`

**Complejidad estimada**: Media (requiere segmentación, comparación por segmento)

### 10. **Exportación y Reportes de Análisis Competitivo**
**Necesidad detectada**: No hay forma de exportar datos o generar reportes de análisis competitivo.

**Propuesta de solución** (alto nivel + impacto):
- Exportación de datos a PDF, Excel, CSV
- Reportes automáticos periódicos (semanal, mensual)
- Reportes personalizables con métricas seleccionadas
- Compartir reportes con equipo
- Historial de reportes generados
- **Impacto**: Medio - Permite usar datos fuera de la plataforma y compartir con equipo.

**Páginas/flujo afectados**:
- Nuevo componente `ReportGenerator`
- Nuevo servicio `ReportExportService`
- Sistema de plantillas de reportes

**Complejidad estimada**: Media (requiere generación de reportes, exportación, plantillas)

---

## 4) Hallazgos desde navegación/menús

### Sidebar.tsx

**Estructura de la sección**:
```typescript
{
  id: 'extras-especializados',
  title: 'Extras & Especializados',
  icon: TestTube,
  items: [
    { id: 'ab-testing-experimentacion', label: 'A/B Testing & Experimentación', icon: FlaskConical, path: '/marketing/ab-testing' },
    { id: 'competitive-analysis-market-intelligence', label: 'Competitive Analysis & Market Intelligence', icon: Search, path: '/market-intelligence' },
  ],
}
```

**Permisos y visibilidad**:
- Ambos items son visibles para ambos roles (entrenador y gimnasio)
- No hay restricciones `entrenadorOnly` o `gimnasioOnly`
- No hay badges o contadores de notificaciones

**Inconsistencias de UX o naming**:
1. **Naming inconsistente**:
   - "A/B Testing & Experimentación" (español)
   - "Competitive Analysis & Market Intelligence" (inglés)
   - Mezcla de idiomas en la misma sección

2. **Rutas inconsistentes**:
   - `/marketing/ab-testing` (bajo marketing)
   - `/market-intelligence` (raíz, no bajo marketing)
   - Falta de consistencia en estructura de rutas

3. **Sección con nombre genérico**:
   - "Extras & Especializados" es muy genérico
   - No indica claramente qué tipo de funcionalidades contiene
   - Podría ser "Análisis & Optimización" o "Marketing Avanzado"

4. **Falta de conexión con otras funcionalidades**:
   - A/B Testing podría estar relacionado con "Embudos & Landing Pages"
   - Market Intelligence podría estar relacionado con "Análisis & Inteligencia"
   - No hay conexión clara entre secciones

5. **Iconos inconsistentes**:
   - TestTube para sección (genérico)
   - FlaskConical para A/B Testing (específico)
   - Search para Market Intelligence (específico)
   - Falta coherencia visual

6. **Falta de indicadores visuales**:
   - No hay badges de experimentos activos
   - No hay alertas de cambios en competidores
   - No hay indicadores de resultados pendientes de revisar

**Sugerencias de mejora**:
- Estandarizar nombres en español o inglés
- Unificar estructura de rutas (ambas bajo `/marketing/` o ambas en raíz)
- Considerar renombrar sección a algo más descriptivo
- Añadir badges de notificaciones para experimentos activos y alertas de competidores
- Conectar con otras secciones relacionadas (embudos, análisis)

---

## 5) KPIs y métricas recomendadas

### Métricas de adopción
- **Tasa de adopción de A/B Testing**: % de usuarios que crean al menos un experimento
  - Meta: >30% para entrenadores, >50% para gimnasios
- **Tasa de adopción de Market Intelligence**: % de usuarios que añaden al menos un competidor
  - Meta: >40% para ambos roles
- **Frecuencia de uso**: Número promedio de veces que se revisan experimentos/competidores por semana
  - Meta: >2 veces/semana para usuarios activos
- **Retención de usuarios**: % de usuarios que vuelven después del primer uso
  - Meta: >70% retención a 30 días

### Tiempo de tarea
- **Tiempo para crear experimento**: Desde abrir wizard hasta activar
  - Meta: <10 minutos (experimento simple)
- **Tiempo para añadir competidor**: Desde abrir modal hasta añadir
  - Meta: <2 minutos
- **Tiempo para revisar resultados**: Desde abrir experimento hasta entender resultados
  - Meta: <1 minuto
- **Tiempo de carga de dashboard**: Desde abrir página hasta mostrar datos
  - Meta: <2 segundos

### Conversión interna
- **Tasa de experimentos con ganador**: % de experimentos que alcanzan significancia estadística
  - Meta: >60%
- **Tasa de aplicación de ganador**: % de experimentos finalizados donde se aplica ganador
  - Meta: >80%
- **Tasa de mejora promedio**: % de mejora promedio en experimentos exitosos
  - Meta: >15% lift promedio
- **Tasa de competidores activos**: % de competidores añadidos que se mantienen monitoreando
  - Meta: >70%

### Errores por flujo
- **Errores en creación de experimentos**: % de veces que falla la creación
  - Meta: <5%
- **Errores en tracking**: % de veces que falla el tracking de visitantes/conversiones
  - Meta: <2%
- **Errores en scraping**: % de veces que falla el scraping de competidores
  - Meta: <10% (scraping es más propenso a errores)
- **Errores en cálculo estadístico**: % de veces que falla el cálculo de significancia
  - Meta: <1%

### Latencia clave
- **Tiempo de asignación de variante**: Desde visita hasta asignación a variante
  - Meta: <100ms (tiempo real)
- **Tiempo de actualización de resultados**: Desde evento hasta actualizar dashboard
  - Meta: <5 segundos (tiempo casi real)
- **Tiempo de scraping inicial**: Desde añadir competidor hasta primera actualización
  - Meta: <5 minutos
- **Tiempo de actualización periódica**: Tiempo para actualizar todos los competidores
  - Meta: <30 minutos (para 10 competidores)

---

## 6) Backlog priorizado (RICE/MoSCoW)

### MUST (top 3)

#### 1. Creación Real de Experimentos A/B con Wizard
- **RICE Score**:
  - Reach: 100% usuarios que usan A/B Testing
  - Impact: 10/10 (sin esto, no se pueden crear experimentos)
  - Confidence: 8/10
  - Effort: 9/10 (complejo, requiere wizard completo)
  - **Score: 8.9**
- **Justificación**: Es la funcionalidad core. Sin creación real, A/B Testing no tiene valor.
- **Esfuerzo estimado**: 10-12 semanas (2 desarrolladores)

#### 2. Tracking Real de Visitantes y Conversiones
- **RICE Score**:
  - Reach: 100% experimentos creados
  - Impact: 10/10 (sin esto, experimentos no tienen datos)
  - Confidence: 8/10
  - Effort: 10/10 (muy complejo, requiere sistema de tracking completo)
  - **Score: 8.0**
- **Justificación**: Sin tracking real, los experimentos no generan datos útiles.
- **Esfuerzo estimado**: 12-14 semanas (2-3 desarrolladores)

#### 3. Scraping Real de Datos de Competidores
- **RICE Score**:
  - Reach: 100% usuarios que usan Market Intelligence
  - Impact: 10/10 (sin esto, análisis competitivo no tiene valor)
  - Confidence: 7/10 (scraping puede ser complejo)
  - Effort: 9/10 (complejo, requiere scraping robusto)
  - **Score: 7.8**
- **Justificación**: Sin datos reales, Market Intelligence no tiene valor funcional.
- **Esfuerzo estimado**: 10-12 semanas (2 desarrolladores + DevOps)

### SHOULD (top 3)

#### 4. Cálculo Estadístico Real de Significancia
- **RICE Score**:
  - Reach: 100% experimentos activos
  - Impact: 9/10 (necesario para confiabilidad)
  - Confidence: 8/10 (matemática conocida)
  - Effort: 6/10 (medio, requiere cálculo estadístico)
  - **Score: 12.0**
- **Esfuerzo estimado**: 6-8 semanas

#### 5. Aplicación Automática de Variante Ganadora
- **RICE Score**:
  - Reach: 100% experimentos finalizados con ganador
  - Impact: 8/10 (permite aplicar resultados automáticamente)
  - Confidence: 8/10
  - Effort: 7/10 (requiere integración cross-module)
  - **Score: 9.1**
- **Esfuerzo estimado**: 6-7 semanas

#### 6. Alertas de Cambios en Competidores
- **RICE Score**:
  - Reach: 100% competidores monitoreados
  - Impact: 8/10 (permite reaccionar rápidamente)
  - Confidence: 7/10
  - Effort: 7/10 (requiere detección de cambios, alertas)
  - **Score: 8.0**
- **Esfuerzo estimado**: 6-8 semanas

### COULD (top 3)

#### 7. Análisis de Contenido y Estrategias
- **RICE Score**:
  - Reach: 100% competidores
  - Impact: 7/10 (permite entender estrategias)
  - Confidence: 6/10 (requiere NLP)
  - Effort: 9/10 (muy complejo)
  - **Score: 4.7**
- **Esfuerzo estimado**: 12-14 semanas

#### 8. Análisis de Tendencias de Mercado
- **RICE Score**:
  - Reach: 100% usuarios
  - Impact: 7/10 (permite entender dirección del mercado)
  - Confidence: 7/10
  - Effort: 7/10 (requiere análisis histórico)
  - **Score: 7.0**
- **Esfuerzo estimado**: 8-10 semanas

#### 9. Exportación y Reportes
- **RICE Score**:
  - Reach: 100% usuarios
  - Impact: 6/10 (permite usar datos fuera de plataforma)
  - Confidence: 8/10
  - Effort: 6/10 (medio, requiere generación de reportes)
  - **Score: 8.0**
- **Esfuerzo estimado**: 5-6 semanas

---

## 7) Próximos pasos

### 3 acciones accionables para la próxima iteración

#### 1. **Implementar Wizard de Creación de Experimentos (8 semanas)**
- **Acciones específicas**:
  - Crear componente `ExperimentWizard` con pasos: tipo, objetivo, variantes, configuración
  - Editor visual básico para crear variantes (diferencias en texto, imágenes, CTA)
  - Integración con módulo de landing pages para seleccionar landing a testear
  - Configuración de distribución de tráfico (50/50, 70/30)
  - Preview de experimento antes de activar
  - Guardado como borrador y activación
  - Integración con API real de creación
- **Responsables**: Frontend developer (1) + Backend developer (0.5)
- **Entregables**:
  - Wizard funcional para crear experimentos
  - Integración con landing pages
  - API de creación de experimentos

#### 2. **Implementar Tracking Básico de Visitantes y Conversiones (10 semanas)**
- **Acciones específicas**:
  - Sistema de tracking de visitantes con asignación aleatoria a variantes
  - Cookie/ID único por visitante para mantener consistencia de variante
  - Tracking de conversiones basado en eventos (formularios, clicks, compras)
  - Dashboard en tiempo real de resultados (actualización cada 30 segundos)
  - Almacenamiento de eventos en base de datos
  - Integración con Google Analytics (opcional)
- **Responsables**: Backend developer (1) + Frontend developer (1)
- **Entregables**:
  - Sistema de tracking funcional
  - Dashboard en tiempo real
  - Almacenamiento de eventos

#### 3. **Implementar Scraping Básico de Competidores (8 semanas)**
- **Acciones específicas**:
  - Sistema de scraping de sitios web de competidores (precios, servicios)
  - Extracción de información básica: nombre, precios, servicios listados
  - Scraping inicial cuando se añade competidor
  - Almacenamiento de datos en base de datos
  - Manejo básico de errores (sitio no accesible, estructura diferente)
  - Actualización manual (trigger por botón)
- **Responsables**: Backend developer (1) + DevOps (0.5)
- **Entregables**:
  - Sistema de scraping funcional
  - Extracción de datos básicos
  - Almacenamiento en base de datos

### Riesgos y supuestos

**Riesgos identificados**:
1. **Scraping puede fallar si sitios cambian estructura**:
   - Mitigación: Validación de datos extraídos, alertas cuando falla, opción de datos manuales
   - Impacto: Alto - afecta confiabilidad de datos

2. **Tracking puede afectar performance si hay mucho tráfico**:
   - Mitigación: Sistema asíncrono, procesamiento en background, caching de resultados
   - Impacto: Medio - afecta experiencia del usuario

3. **Experimentos pueden no tener suficientes visitantes para significancia estadística**:
   - Mitigación: Recomendaciones de duración mínima, alertas de muestra pequeña, extensión automática
   - Impacto: Medio - afecta confiabilidad de resultados

4. **Datos de competidores pueden ser sensibles o privados**:
   - Mitigación: Solo datos públicos, cumplimiento de términos de servicio, opción de exclusión
   - Impacto: Bajo - afecta legalidad/compliance

**Supuestos**:
- Hay suficiente tráfico para realizar experimentos significativos (mínimo 100 visitantes por variante)
- Los sitios de competidores son accesibles y tienen estructura scrapeable
- Hay base de datos para almacenar experimentos, eventos, datos de competidores
- Hay sistema de eventos/jobs para procesamiento asíncrono (scraping, cálculos)
- Hay recursos para mantener y actualizar scrapers cuando sitios cambian
- Los usuarios entienden conceptos básicos de A/B Testing (puede requerir educación)

**Dependencias externas**:
- Servicios de scraping (opcional, puede usar librerías propias)
- Google Analytics (opcional, para integración)
- Servicios de cálculo estadístico (opcional, puede usar librerías propias)
- Base de datos para almacenamiento
- Sistema de jobs/workers para procesamiento asíncrono
- Infraestructura para scraping (puede requerir proxies, rate limiting)

---

> **Notas técnicas**: 
> - Todas las rutas son relativas desde la raíz del proyecto
> - Los componentes de A/B Testing están en `src/features/AbTestingYExperimentacion/`
> - Los componentes de Market Intelligence están en `src/features/CompetitiveAnalysisYMarketIntelligence/`
> - Las APIs están en `src/features/[Feature]/api/`


















