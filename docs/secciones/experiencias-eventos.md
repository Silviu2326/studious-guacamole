# Experiencias & Eventos — Diagnóstico funcional y de producto

## 1) Mapa de páginas de la sección

### Páginas principales

#### `/dashboard/experiences/virtual-events` — Webinars & Virtual Events Manager
- **Componente raíz**: `src/features/WebinarsYVirtualEventsManager/pages/WebinarsYVirtualEventsManagerPage.tsx`
- **API**: `src/features/WebinarsYVirtualEventsManager/api/events.ts`
- **Estados**:
  - Loading: No hay estado de loading implementado
  - Error: No hay manejo de errores
  - Vacío: Estado vacío con mensaje "No hay eventos creados aún" y botón "Crear Primer Evento"
- **Guardias**: No hay guardias de autenticación explícitas (depende de Layout)
- **Nota**: Esta página es principalmente informativa. No hay funcionalidad real de creación/gestión de webinars implementada.

#### `/dashboard/experiencias/eventos` — Eventos & Retos
- **Componente raíz**: `src/features/EventosYRetos/pages/EventosYRetosPage.tsx`
- **Componentes hijos**:
  - `EventBuilderWizard` (`src/features/EventosYRetos/components/EventBuilderWizard.tsx`) - Wizard de 4 pasos para crear eventos
  - `EventDashboard` (`src/features/EventosYRetos/components/EventDashboard.tsx`) - Dashboard de evento individual
  - `Leaderboard` (`src/features/EventosYRetos/components/Leaderboard.tsx`) - Tabla de clasificación
- **API**: `src/features/EventosYRetos/api/events.ts`
- **Estados**:
  - Loading: `isLoading` con `Loader2` spinner
  - Error: No hay manejo de errores explícito en la página principal
  - Vacío: Card con `Package` icon y mensaje "No tienes eventos creados todavía"
- **Vistas**: `list`, `builder`, `dashboard` (modos de visualización)
- **Guardias**: No hay guardias explícitas (depende de Layout)

#### `/comunidad` — Community & Engagement
- **Componente raíz**: `src/features/CommunityYEngagement/pages/CommunityYEngagementPage.tsx`
- **Componentes hijos**:
  - `CommunityFeed` (`src/features/CommunityYEngagement/components/CommunityFeed.tsx`) - Feed de posts
  - `PostCard` (`src/features/CommunityYEngagement/components/PostCard.tsx`) - Tarjeta de post individual
  - `NewPostForm` (`src/features/CommunityYEngagement/components/NewPostForm.tsx`) - Formulario para crear posts
- **API**: `src/features/CommunityYEngagement/api/community.ts`
- **Estados**:
  - Loading: `loading` con spinner
  - Error: `error` con mensaje de error
  - Vacío: No hay estados vacíos explícitos
- **Tabs**: `feed`, `groups`, `analytics` (pestañas de navegación)
- **Guardias**: No hay guardias explícitas (depende de Layout)

---

## 2) 10 problemas que hoy SÍ resuelve

### 1. **Creación de Eventos y Retos con Wizard Guiado**
**Página(s)**: `/dashboard/experiencias/eventos` (Eventos & Retos)

**Problema cubierto**: No hay forma de crear eventos/retos estructurados sin saber qué información se necesita.

**Como lo resuelve el código**:
- `EventBuilderWizard` (`src/features/EventosYRetos/components/EventBuilderWizard.tsx`) es un wizard de 4 pasos
- Paso 1: Información Básica (nombre, descripción, tipo, fechas)
- Paso 2: Detalles y Precio (fee, currency, maxParticipants, rules)
- Paso 3: Métricas (definir métricas personalizadas para tracking)
- Paso 4: Revisar (preview de toda la información antes de guardar)
- Validación en cada paso (`validateStep`)
- Navegación entre pasos con botones Anterior/Siguiente

**Riesgos/limitaciones**:
- Creación es mock (no hay persistencia real)
- No hay preview de cómo se verá el evento para participantes
- Falta validación de fechas (no puede estar en el pasado)

### 2. **Dashboard de Eventos con KPIs y Métricas**
**Página(s)**: `/dashboard/experiencias/eventos` (Eventos & Retos)

**Problema cubierto**: No hay forma de ver el rendimiento de un evento sin calcular métricas manualmente.

**Como lo resuelve el código**:
- `EventDashboard` (`src/features/EventosYRetos/components/EventDashboard.tsx`) muestra KPIs clave
- Métricas: Participantes, Ingresos, Tasa de Finalización, Engagement
- Visualización de información del evento (nombre, descripción, fechas, tipo)
- Integración con `useEventData` hook para obtener datos del evento
- Cards con iconos y valores formateados

**Riesgos/limitaciones**:
- Métricas son mock (no hay datos reales de tracking)
- No hay gráficos de tendencias
- Falta comparación con eventos anteriores

### 3. **Sistema de Leaderboard con Múltiples Métricas**
**Página(s)**: `/dashboard/experiencias/eventos` (Eventos & Retos)

**Problema cubierto**: No hay forma de ver quién está liderando en un reto o evento sin calcular rankings manualmente.

**Como lo resuelve el código**:
- `Leaderboard` (`src/features/EventosYRetos/components/Leaderboard.tsx`) muestra tabla de clasificación
- Soporta múltiples métricas (selector de métrica)
- Muestra posición, nombre, valor, tendencia (up/down/neutral)
- Iconos de trofeos para top 3 (🥇🥈🥉)
- Colores destacados para top 3
- Integración con `EventDashboard` para mostrar leaderboard por evento

**Riesgos/limitaciones**:
- Datos son mock (no hay ranking real calculado)
- No hay actualización en tiempo real
- Falta historial de cambios de posición

### 4. **Lista de Eventos con Filtrado por Estado**
**Página(s)**: `/dashboard/experiencias/eventos` (Eventos & Retos)

**Problema cubierto**: No hay forma de encontrar eventos específicos cuando hay muchos.

**Como lo resuelve el código**:
- Filtro por estado (Todos, Borradores, Próximos, Activos, Completados)
- `statusFilter` controla el filtrado dinámico
- `getEvents` API acepta filtro opcional
- Cards visuales con información clave (nombre, descripción, fechas, participantes, precio)
- Badges de estado con colores diferenciados

**Riesgos/limitaciones**:
- No hay búsqueda por texto o nombre
- No hay filtros por fecha o tipo de evento
- Falta ordenamiento por fecha o participantes

### 5. **Gestión de Estado de Eventos (Ver, Editar, Eliminar)**
**Página(s)**: `/dashboard/experiencias/eventos` (Eventos & Retos)

**Problema cubierto**: No hay forma de gestionar el ciclo de vida de eventos (ver detalles, editar, eliminar).

**Como lo resuelve el código**:
- Botón "Ver Dashboard" para ver detalles del evento
- Botón "Editar" (solo para borradores) para modificar evento
- Botón "Eliminar" (solo para borradores) con confirmación
- `handleViewEvent`, `handleEditEvent`, `handleDeleteEvent` gestionan acciones
- Navegación entre vistas (list, builder, dashboard)

**Riesgos/limitaciones**:
- Eliminación es mock (no hay persistencia real)
- Edición solo disponible para borradores (no hay edición de eventos activos)
- Falta validación de que no se puede eliminar evento con participantes

### 6. **Feed de Comunidad con Posts y Reacciones**
**Página(s)**: `/comunidad` (Community & Engagement)

**Problema cubierto**: No hay forma de que los clientes compartan logros e interactúen entre sí.

**Como lo resuelve el código**:
- `CommunityFeed` (`src/features/CommunityYEngagement/components/CommunityFeed.tsx`) muestra feed de posts
- `PostCard` muestra posts con autor, contenido, media, reacciones, comentarios
- Sistema de reacciones (celebrate, support, like)
- Filtros: `latest`, `trending`, `questions`
- Paginación para cargar más posts
- Actualización optimista de reacciones

**Riesgos/limitaciones**:
- Posts son mock (no hay persistencia real)
- Reacciones no están implementadas completamente (solo actualización local)
- Falta sistema de notificaciones cuando alguien reacciona

### 7. **Creación de Posts con Media (Imágenes/Videos)**
**Página(s)**: `/comunidad` (Community & Engagement)

**Problema cubierto**: No hay forma de crear posts con imágenes o videos para compartir logros visuales.

**Como lo resuelve el código**:
- `NewPostForm` (`src/features/CommunityYEngagement/components/NewPostForm.tsx`) permite crear posts
- Soporte para subir imágenes o videos
- Preview de media antes de publicar
- Validación de tamaño de archivo (máximo 10MB)
- Selector de grupo para publicar en grupos específicos
- Validación de que hay contenido o media antes de publicar

**Riesgos/limitaciones**:
- Subida de media es mock (no hay upload real)
- No hay compresión de imágenes
- Falta validación de formato de video

### 8. **Dashboard de Analíticas de Comunidad**
**Página(s)**: `/comunidad` (Community & Engagement)

**Problema cubierto**: No hay forma de ver el engagement y crecimiento de la comunidad sin calcular métricas manualmente.

**Como lo resuelve el código**:
- `CommunityYEngagementPage` muestra métricas agregadas
- KPIs: Tasa de Participación, Miembros, Publicaciones, Comentarios/Post, Tiempo de Respuesta, Crecimiento
- `getCommunityAnalytics` API proporciona datos agregados
- Cards con iconos, valores y tendencias
- Tab separada para analíticas detalladas (aunque no implementada)

**Riesgos/limitaciones**:
- Analíticas son mock (no hay datos reales)
- No hay gráficos de tendencias
- Tab de analíticas detalladas está vacía

### 9. **Filtrado de Posts por Tipo (Latest, Trending, Questions)**
**Página(s)**: `/comunidad` (Community & Engagement)

**Problema cubierto**: No hay forma de encontrar posts específicos (preguntas, logros, trending) cuando hay muchos.

**Como lo resuelve el código**:
- Filtros: `latest` (más recientes), `trending` (más populares), `questions` (solo preguntas)
- `activeFilter` controla el filtrado
- `getPosts` API acepta `filterBy` en `CommunityFilters`
- Botones de filtro en `CommunityFeed`
- Recarga de posts cuando cambia el filtro

**Riesgos/limitaciones**:
- Filtrado es mock (no hay algoritmo real de trending)
- No hay búsqueda por texto
- Falta filtro por grupo específico

### 10. **Información Educativa sobre Webinars y Eventos Virtuales**
**Página(s)**: `/dashboard/experiences/virtual-events` (Webinars & Virtual Events Manager)

**Problema cubierto**: No hay forma de entender qué son los webinars y eventos virtuales y cómo funcionan.

**Como lo resuelve el código**:
- Card informativa explica qué son los webinars y eventos virtuales
- Descripción de funcionalidades: páginas de registro, gestión de inscritos, recordatorios automáticos, transmisión en vivo, grabaciones
- KPIs placeholder (Eventos Totales, Inscritos Totales, Tasa de Asistencia, Ingresos Totales)
- Filtros de eventos (Próximos, Pasados, Borradores) aunque no funcionales

**Riesgos/limitaciones**:
- Solo información educativa, no hay funcionalidad real
- No hay creación/gestión de webinars
- KPIs son estáticos (0 o valores hardcodeados)

---

## 3) 10 problemas que AÚN NO resuelve (y debería)

### 1. **Creación y Gestión Real de Webinars y Eventos Virtuales**
**Necesidad detectada**: La página de Webinars & Virtual Events Manager es solo informativa. No hay funcionalidad real para crear, gestionar o transmitir webinars.

**Propuesta de solución** (alto nivel + impacto):
- Wizard de creación de webinars similar a EventBuilderWizard
- Configuración de fecha/hora, plataforma de streaming (Zoom, YouTube Live, etc.)
- Gestión de inscritos con links de acceso
- Recordatorios automáticos por email/SMS antes del evento
- Integración con plataformas de streaming para links de acceso
- Grabaciones automáticas para contenido bajo demanda
- **Impacto**: Alto - Sin esto, los webinars no funcionan. Es la funcionalidad core.

**Páginas/flujo afectados**:
- `WebinarsYVirtualEventsManagerPage` (añadir wizard y gestión)
- Nuevo componente `WebinarBuilderWizard`
- Nuevo servicio `WebinarService`
- Integración con módulo de email/SMS para recordatorios

**Complejidad estimada**: Alta (requiere integración con plataformas de streaming, gestión de links, recordatorios)

### 2. **Registro e Inscripción Real de Participantes en Eventos**
**Necesidad detectada**: No hay forma real de que los clientes se inscriban a eventos. Solo hay mock data.

**Propuesta de solución** (alto nivel + impacto):
- Página pública de registro para eventos
- Formulario de inscripción con datos del cliente
- Verificación de capacidad máxima antes de permitir inscripción
- Procesamiento de pago si el evento es de pago
- Confirmación automática de inscripción por email
- Gestión de lista de espera si el evento está lleno
- **Impacto**: Alto - Sin esto, los eventos no pueden tener participantes reales.

**Páginas/flujo afectados**:
- Nuevo componente `EventRegistrationPage` (página pública)
- Integración con módulo de checkout para pagos
- Integración con módulo de email para confirmaciones
- Modificar `EventDashboard` para mostrar inscripciones reales

**Complejidad estimada**: Media/Alta (requiere página pública, integración con checkout, email)

### 3. **Tracking Real de Progreso de Participantes en Eventos/Retos**
**Necesidad detectada**: No hay forma real de que los participantes registren su progreso y se actualice el leaderboard automáticamente.

**Propuesta de solución** (alto nivel + impacto):
- Formulario para que participantes registren progreso (métricas definidas en el evento)
- Validación de que el progreso es válido (rango, formato)
- Actualización automática del leaderboard cuando se registra progreso
- Historial de progreso por participante
- Notificaciones cuando alguien sube de posición
- **Impacto**: Alto - Sin esto, los retos no tienen gamificación funcional.

**Páginas/flujo afectados**:
- Nuevo componente `ProgressTracker` (página del participante)
- Modificar `EventDashboard` para mostrar progreso real
- Modificar `Leaderboard` para calcular rankings reales
- Nuevo servicio `ProgressTrackingService`

**Complejidad estimada**: Media/Alta (requiere formularios, cálculo de rankings, notificaciones)

### 4. **Sistema de Comentarios Funcional en Posts de Comunidad**
**Necesidad detectada**: No hay forma real de comentar en posts. Solo hay placeholder.

**Propuesta de solución** (alto nivel + impacto):
- Modal o sección expandible para ver comentarios de un post
- Formulario para añadir comentarios
- Lista de comentarios con autor, contenido, fecha
- Notificaciones cuando alguien comenta en tu post
- Respuestas a comentarios (comentarios anidados)
- **Impacto**: Alto - Necesario para engagement real en la comunidad.

**Páginas/flujo afectados**:
- Modificar `PostCard` para mostrar comentarios
- Nuevo componente `CommentsSection`
- Integración con `addComment` API (actualmente mock)
- Integración con sistema de notificaciones

**Complejidad estimada**: Media (requiere UI de comentarios, persistencia, notificaciones)

### 5. **Gestión de Grupos de Comunidad (Crear, Unirse, Gestionar)**
**Necesidad detectada**: La tab de grupos está vacía. No hay forma de crear o gestionar grupos.

**Propuesta de solución** (alto nivel + impacto):
- Creación de grupos con nombre, descripción, privacidad (público/privado)
- Unirse/salirse de grupos
- Gestión de miembros (añadir, eliminar, roles)
- Filtrar posts por grupo
- Configuración de permisos (quién puede publicar, moderar)
- **Impacto**: Medio/Alto - Mejora organización y engagement de la comunidad.

**Páginas/flujo afectados**:
- Tab `groups` en `CommunityYEngagementPage`
- Nuevo componente `GroupsManager`
- Modificar `CommunityFeed` para filtrar por grupo
- Nuevo servicio `GroupsService`

**Complejidad estimada**: Media (requiere CRUD de grupos, gestión de miembros, permisos)

### 6. **Sistema de Notificaciones en Tiempo Real para Eventos y Comunidad**
**Necesidad detectada**: No hay notificaciones cuando hay actividad en eventos o comunidad (nuevos comentarios, cambios en leaderboard, etc.).

**Propuesta de solución** (alto nivel + impacto):
- Notificaciones push cuando alguien comenta en tu post
- Notificaciones cuando alguien te supera en el leaderboard
- Notificaciones cuando se publica un nuevo evento
- Notificaciones cuando alguien reacciona a tu post
- Centro de notificaciones con historial
- **Impacto**: Medio - Mejora engagement y participación.

**Páginas/flujo afectados**:
- Nuevo componente `NotificationsCenter`
- Integración con sistema de notificaciones push
- Modificar todas las páginas para mostrar notificaciones
- Nuevo servicio `NotificationService`

**Complejidad estimada**: Media/Alta (requiere sistema de notificaciones, WebSockets para tiempo real)

### 7. **Integración de Eventos con Sistema de Pagos**
**Necesidad detectada**: Los eventos tienen precio pero no hay integración real con el sistema de pagos.

**Propuesta de solución** (alto nivel + impacto):
- Integración con módulo de checkout para pagos de eventos
- Verificación de pago antes de confirmar inscripción
- Procesamiento de reembolsos si el evento se cancela
- Historial de pagos por evento
- Reportes de ingresos por evento
- **Impacto**: Alto - Necesario para monetizar eventos.

**Páginas/flujo afectados**:
- Integración con módulo de checkout
- Modificar `EventRegistrationPage` para procesar pagos
- Modificar `EventDashboard` para mostrar ingresos reales
- Nuevo servicio `EventPaymentService`

**Complejidad estimada**: Media/Alta (requiere integración con checkout, procesamiento de pagos, reembolsos)

### 8. **Sistema de Badges y Logros para Comunidad**
**Necesidad detectada**: Los posts muestran badges pero no hay sistema real de ganar/otorgar badges.

**Propuesta de solución** (alto nivel + impacto):
- Sistema de badges automáticos (50 sesiones, 10 referidos, etc.)
- Badges manuales otorgados por entrenadores
- Visualización de badges en perfil
- Notificaciones cuando se gana un badge
- Leaderboard de badges
- **Impacto**: Medio - Mejora gamificación y engagement.

**Páginas/flujo afectados**:
- Modificar `UserProfile` para mostrar badges
- Nuevo componente `BadgesManager`
- Integración con sistema de tracking de acciones
- Nuevo servicio `BadgesService`

**Complejidad estimada**: Media (requiere sistema de triggers, UI de badges, notificaciones)

### 9. **Recordatorios Automáticos para Eventos (Email/SMS)**
**Necesidad detectada**: No hay recordatorios automáticos cuando un evento está por comenzar o cuando hay cambios.

**Propuesta de solución** (alto nivel + impacto):
- Recordatorios automáticos 24h, 2h antes del evento
- Notificaciones cuando hay cambios en el evento (fecha, cancelación)
- Recordatorios para registrar progreso en retos
- Personalización de mensajes de recordatorio
- Configuración de preferencias de notificaciones
- **Impacto**: Medio/Alto - Mejora asistencia y participación.

**Páginas/flujo afectados**:
- Integración con módulo de email/SMS
- Nuevo servicio `EventReminderService`
- Modificar creación de eventos para configurar recordatorios
- Sistema de jobs/cron para enviar recordatorios

**Complejidad estimada**: Media (requiere sistema de scheduling, integración con email/SMS)

### 10. **Analíticas Avanzadas de Eventos y Comunidad**
**Necesidad detectada**: Las analíticas son básicas o mock. No hay insights profundos sobre engagement, conversión, etc.

**Propuesta de solución** (alto nivel + impacto):
- Gráficos de tendencias de participación en eventos
- Análisis de engagement por tipo de post
- Métricas de conversión (inscritos → participantes activos)
- Análisis de mejores momentos para publicar
- Comparación de eventos (qué eventos tienen mejor rendimiento)
- Exportación de reportes
- **Impacto**: Medio - Permite optimizar estrategia de eventos y comunidad.

**Páginas/flujo afectados**:
- Tab `analytics` en `CommunityYEngagementPage`
- Modificar `EventDashboard` para mostrar gráficos
- Nuevo componente `AnalyticsCharts`
- Nuevo servicio `AnalyticsService`

**Complejidad estimada**: Media (requiere gráficos, cálculo de métricas, exportación)

---

## 4) Hallazgos desde navegación/menús

### Sidebar.tsx

**Estructura de la sección**:
```typescript
{
  id: 'experiencias-eventos',
  title: 'Experiencias & Eventos',
  icon: CalendarCheck,
  items: [
    { id: 'webinars-virtual-events', label: 'Webinars & Virtual Events Manager', icon: Video, path: '/dashboard/experiences/virtual-events' },
    { id: 'eventos-retos', label: 'Eventos & Retos', icon: Trophy, path: '/dashboard/experiencias/eventos' },
    { id: 'community-engagement', label: 'Community & Engagement', icon: Users, path: '/comunidad' },
  ],
}
```

**Permisos y visibilidad**:
- Todos los items son visibles para ambos roles (entrenador y gimnasio)
- No hay restricciones `entrenadorOnly` o `gimnasioOnly`
- No hay badges o contadores de notificaciones

**Inconsistencias de UX o naming**:
1. **Duplicación funcional**:
   - "Eventos & Retos" (`/dashboard/experiencias/eventos`) y "Eventos & Retos Especiales" (`/eventos-retos-especiales`) tienen funcionalidad similar
   - Ambos gestionan eventos/retos pero desde diferentes perspectivas
   - Hay confusión sobre cuál usar para qué propósito

2. **Naming inconsistente**:
   - "Webinars & Virtual Events Manager" (inglés)
   - "Eventos & Retos" (español)
   - "Community & Engagement" (inglés)
   - Mezcla de idiomas en una misma sección

3. **Rutas inconsistentes**:
   - `/dashboard/experiences/virtual-events` (inglés)
   - `/dashboard/experiencias/eventos` (español)
   - `/comunidad` (español)
   - Mezcla de idiomas y estructura de rutas

4. **Falta de funcionalidad en Webinars**:
   - "Webinars & Virtual Events Manager" es solo informativa
   - No hay funcionalidad real de creación/gestión
   - Usuarios pueden confundirse al ver que no funciona

5. **Falta de relación con otras secciones**:
   - "Community & Engagement" podría estar relacionada con "Marketing & Crecimiento"
   - No hay conexión clara entre eventos y comunidad
   - Falta integración entre módulos

6. **Falta de indicadores visuales**:
   - No hay badges de eventos próximos
   - No hay indicadores de nuevos posts en comunidad
   - No hay alertas de eventos que requieren atención

**Sugerencias de mejora**:
- Consolidar o diferenciar claramente "Eventos & Retos" y "Eventos & Retos Especiales"
- Estandarizar nombres en español o inglés
- Unificar estructura de rutas
- Implementar funcionalidad real en Webinars o renombrar/ocultar
- Añadir badges de notificaciones para eventos/próximos
- Clarificar propósito de cada módulo en documentación

---

## 5) KPIs y métricas recomendadas

### Métricas de adopción
- **Tasa de adopción por herramienta**: % de usuarios que usan cada herramienta al menos una vez al mes
  - Meta: >60% para Eventos & Retos, >40% para Community, >30% para Webinars
- **Frecuencia de uso**: Número promedio de sesiones por usuario por semana
  - Meta: >1 sesión/semana para usuarios activos
- **Retención de usuarios**: % de usuarios que vuelven después del primer uso
  - Meta: >70% retención a 30 días

### Tiempo de tarea
- **Tiempo para crear un evento**: Desde "Crear Evento" hasta guardar
  - Meta: <5 minutos (evento básico)
- **Tiempo para crear un post**: Desde "Nuevo Post" hasta publicar
  - Meta: <2 minutos (post básico)
- **Tiempo para inscribirse a un evento**: Desde página de evento hasta confirmación
  - Meta: <3 minutos (con pago)
- **Tiempo para entender métricas**: Desde abrir dashboard hasta entender insights
  - Meta: <30 segundos (vista de dashboard)

### Conversión interna
- **Tasa de finalización de eventos**: % de eventos que completan su ciclo (no se cancelan)
  - Meta: >80%
- **Tasa de participación en eventos**: % de inscritos que participan activamente
  - Meta: >60%
- **Tasa de engagement en comunidad**: % de miembros que publican al menos una vez al mes
  - Meta: >40%
- **Tasa de respuesta a preguntas**: % de preguntas que reciben respuesta
  - Meta: >70%

### Errores por flujo
- **Errores en creación de eventos**: % de intentos de crear evento que fallan
  - Meta: <3%
- **Errores en inscripción**: % de intentos de inscribirse que fallan
  - Meta: <2%
- **Errores en creación de posts**: % de intentos de crear post que fallan
  - Meta: <2%
- **Errores en registro de progreso**: % de intentos de registrar progreso que fallan
  - Meta: <2%

### Latencia clave
- **Tiempo de carga de eventos**: Desde abrir página hasta mostrar eventos
  - Meta: <1 segundo
- **Tiempo de carga de feed**: Desde abrir comunidad hasta mostrar posts
  - Meta: <1 segundo
- **Tiempo de actualización de leaderboard**: Desde registrar progreso hasta actualizar ranking
  - Meta: <2 segundos
- **Tiempo de publicación de post**: Desde enviar hasta aparecer en feed
  - Meta: <1 segundo

---

## 6) Backlog priorizado (RICE/MoSCoW)

### MUST (top 3)

#### 1. Creación y Gestión Real de Webinars y Eventos Virtuales
- **RICE Score**:
  - Reach: 100% usuarios que quieren hacer webinars
  - Impact: 10/10 (sin esto, los webinars no funcionan)
  - Confidence: 8/10 (tecnología conocida)
  - Effort: 9/10 (muy complejo, requiere integración con streaming)
  - **Score: 8.9**
- **Justificación**: Es la funcionalidad core. Sin creación/gestión real, los webinars no tienen valor.
- **Esfuerzo estimado**: 8-10 semanas (1-2 desarrolladores full-time)

#### 2. Registro e Inscripción Real de Participantes
- **RICE Score**:
  - Reach: 100% usuarios que crean eventos
  - Impact: 10/10 (sin esto, los eventos no tienen participantes)
  - Confidence: 9/10 (lógica conocida)
  - Effort: 6/10 (requiere página pública, integración con checkout)
  - **Score: 15.0**
- **Justificación**: Sin inscripciones reales, los eventos no pueden tener participantes.
- **Esfuerzo estimado**: 5-6 semanas (1 desarrollador)

#### 3. Tracking Real de Progreso de Participantes
- **RICE Score**:
  - Reach: 100% participantes en retos
  - Impact: 10/10 (sin esto, los retos no tienen gamificación)
  - Confidence: 8/10 (requiere formularios y cálculo de rankings)
  - Effort: 7/10 (complejo)
  - **Score: 11.4**
- **Justificación**: Es la funcionalidad core de los retos. Sin tracking, no hay gamificación.
- **Esfuerzo estimado**: 6-7 semanas (1 desarrollador)

### SHOULD (top 3)

#### 4. Sistema de Comentarios Funcional
- **RICE Score**:
  - Reach: 100% usuarios de comunidad
  - Impact: 9/10 (necesario para engagement)
  - Confidence: 9/10
  - Effort: 5/10 (requiere UI y persistencia)
  - **Score: 16.2**
- **Esfuerzo estimado**: 3-4 semanas

#### 5. Integración de Eventos con Sistema de Pagos
- **RICE Score**:
  - Reach: 100% eventos de pago
  - Impact: 9/10 (necesario para monetizar)
  - Confidence: 8/10
  - Effort: 6/10 (requiere integración con checkout)
  - **Score: 12.0**
- **Esfuerzo estimado**: 4-5 semanas

#### 6. Sistema de Notificaciones en Tiempo Real
- **RICE Score**:
  - Reach: 100% usuarios
  - Impact: 8/10 (mejora engagement)
  - Confidence: 7/10 (requiere WebSockets)
  - Effort: 7/10 (complejo)
  - **Score: 9.1**
- **Esfuerzo estimado**: 6-7 semanas

### COULD (top 3)

#### 7. Gestión de Grupos de Comunidad
- **RICE Score**:
  - Reach: 80% usuarios (solo quienes usan grupos)
  - Impact: 8/10 (mejora organización)
  - Confidence: 8/10
  - Effort: 6/10 (requiere CRUD y permisos)
  - **Score: 10.7**
- **Esfuerzo estimado**: 4-5 semanas

#### 8. Sistema de Badges y Logros
- **RICE Score**:
  - Reach: 100% usuarios
  - Impact: 7/10 (mejora gamificación)
  - Confidence: 8/10
  - Effort: 5/10 (requiere sistema de triggers)
  - **Score: 11.2**
- **Esfuerzo estimado**: 3-4 semanas

#### 9. Analíticas Avanzadas
- **RICE Score**:
  - Reach: 80% usuarios (solo quienes analizan datos)
  - Impact: 8/10 (permite optimizar)
  - Confidence: 8/10
  - Effort: 6/10 (requiere gráficos y cálculos)
  - **Score: 10.7**
- **Esfuerzo estimado**: 4-5 semanas

---

## 7) Próximos pasos

### 3 acciones accionables para la próxima iteración

#### 1. **Implementar Registro e Inscripción Real de Participantes (5 semanas)**
- **Acciones específicas**:
  - Crear página pública de registro para eventos (`EventRegistrationPage`)
  - Formulario de inscripción con validación
  - Integración con módulo de checkout para pagos
  - Verificación de capacidad máxima y lista de espera
  - Confirmación automática por email
  - Modificar `EventDashboard` para mostrar inscripciones reales
- **Responsables**: Frontend developer (1) + Backend developer (0.5)
- **Entregables**:
  - Página pública de registro funcional
  - Integración con checkout
  - Gestión de inscripciones

#### 2. **Implementar Tracking Real de Progreso de Participantes (6 semanas)**
- **Acciones específicas**:
  - Crear componente `ProgressTracker` para que participantes registren progreso
  - Formulario con validación de métricas definidas en el evento
  - Cálculo automático de rankings cuando se registra progreso
  - Actualización del leaderboard en tiempo real
  - Historial de progreso por participante
  - Notificaciones cuando alguien sube de posición
- **Responsables**: Frontend developer (1) + Backend developer (1)
- **Entregables**:
  - Sistema de tracking funcional
  - Leaderboard actualizado automáticamente
  - Historial de progreso

#### 3. **Implementar Sistema de Comentarios Funcional (3 semanas)**
- **Acciones específicas**:
  - Crear componente `CommentsSection` para mostrar comentarios
  - Formulario para añadir comentarios en posts
  - Lista de comentarios con autor, contenido, fecha
  - Integración con `addComment` API (implementar backend real)
  - Notificaciones cuando alguien comenta en tu post
  - Actualización optimista de UI
- **Responsables**: Frontend developer (1) + Backend developer (0.5)
- **Entregables**:
  - Comentarios funcionales en posts
  - Notificaciones de comentarios
  - UI de comentarios completa

### Riesgos y supuestos

**Riesgos identificados**:
1. **Capacidad máxima puede excederse si hay inscripciones simultáneas**:
   - Mitigación: Locking en base de datos, verificación atómica de capacidad
   - Impacto: Alto si ocurre

2. **Rankings pueden tener inconsistencias si hay múltiples actualizaciones simultáneas**:
   - Mitigación: Cálculo de rankings en batch, cache de rankings
   - Impacto: Medio - afecta confianza en leaderboard

3. **Spam en comunidad puede degradar la experiencia**:
   - Mitigación: Sistema de moderación, límites de posts por usuario
   - Impacto: Medio - afecta calidad de comunidad

4. **Integración con plataformas de streaming puede ser compleja**:
   - Mitigación: Usar APIs conocidas (Zoom, YouTube), abstracciones claras
   - Impacto: Alto - afecta funcionalidad de webinars

**Supuestos**:
- Hay módulo de checkout funcional para procesar pagos de eventos
- Hay sistema de email/SMS para confirmaciones y recordatorios
- Los participantes tienen acceso a la plataforma para registrar progreso
- Hay base de datos para persistir eventos, inscripciones, progreso, posts

**Dependencias externas**:
- Módulo de checkout para pagos de eventos
- Sistema de email/SMS para confirmaciones y recordatorios
- Plataformas de streaming (Zoom, YouTube Live) para webinars
- Sistema de notificaciones push para tiempo real
- Base de datos para persistencia

---

> **Notas técnicas**: 
> - Todas las rutas son relativas desde la raíz del proyecto
> - Los componentes están en `src/features/[feature-name]/`
> - Las APIs están en `src/features/[feature-name]/api/`
> - Los tipos TypeScript están en `src/features/[feature-name]/types/`





